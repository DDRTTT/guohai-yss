import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, message, Descriptions, Spin, Tabs } from 'antd';
import { Card, PageContainers } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';

import LifeCycle from './lifeCycle';
import TimeAxis from './timeAxis';
const { TabPane } = Tabs;

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    record: {},
    basicsList: [],
    valuationList: [],
    activeTabKey: 'basics',
    expensesAndAchievementList: [], //费用与业绩报酬信息
  };

  componentDidMount() {
    this.handleTaskTabs();
  }

  handleTaskTabs = (key = 'basics') => {
    const { dispatch, proCode } = this.props;
    const _this = this;
    this.setState({ activeTabKey: key }, () => {
      switch (key) {
        case 'expensesAndAchievement':
          let arr = [];
          new Promise((resolve, reject) => {
            // 费用与业绩报酬信息
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f2f5bc6e62970',
                FPRO_CODE: proCode,
              },
            }).then(itemRes => {
              arr = [...arr, ...(itemRes || [])];
              resolve();
            });
          }).then(() => {
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f2f6202812ae8',
                FPRO_CODE: proCode,
              },
            }).then(itemRes => {
              arr = [...arr, ...(itemRes || [])];
              _this.setState({ expensesAndAchievementList: arr });
            });
          });
          break;

        case 'disclosure':
          dispatch({
            type: 'productForInfo/getInfoList',
            payload: {
              bizViewId: 'I8aaa8285017e483748371242017f300d3f2338a3',
              FPRO_CODE: proCode,
            },
          });
          break;

        case 'liquidation':
          dispatch({
            type: 'productForInfo/getInfoList',
            payload: {
              bizViewId: 'I8aaa8285017e483748371242017f301cac4c39a3',
              FPRO_CODE: proCode,
            },
          });
          break;

        case 'basics':
          dispatch({
            type: 'productForInformationInfo/getInfo',
            payload: {
              bizViewId: 'I8aaa8285017e483748371242017f4db8fe2c5129',
              FPRO_CODE: proCode,
              returnType: 'OBJECT',
            },
          }).then(res => {
            this.setState({ basicsList: res || [] });
          });
          break;

        case 'valuation':
          let arrForValuation = [];
          const valuation1 = new Promise(function(resolve, reject) {
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f2f9963192f19',
                FPRO_CODE: proCode,
              },
            }).then(res => {
              arrForValuation = [...arrForValuation, ...(res || [])];
              console.log('1', '----', arrForValuation);
              resolve();
            });
          });
          const valuation2 = new Promise(function(resolve, reject) {
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f300433e63842',
                FPRO_CODE: proCode,
              },
            }).then(res => {
              arrForValuation = [...arrForValuation, ...(res || [])];
              console.log('2', '----', arrForValuation);
              resolve();
            });
          });
          const valuation3 = new Promise(function(resolve, reject) {
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f2fcfe63331fb',
                FPRO_CODE: proCode,
              },
            }).then(res => {
              arrForValuation = [...arrForValuation, ...(res || [])];
              console.log('3', '----', arrForValuation);
              resolve();
            });
          });
          const valuation4 = new Promise(function(resolve, reject) {
            dispatch({
              type: 'productForInfo/getInfoList',
              payload: {
                bizViewId: 'I8aaa8285017e483748371242017f2f86a38e2e5c',
                FPRO_CODE: proCode,
              },
            }).then(res => {
              arrForValuation = [...arrForValuation, ...(res || [])];
              console.log('4', '----', arrForValuation);
              resolve();
            });
          });
          Promise.all([valuation1, valuation2, valuation3, valuation4]).then(function(values) {
            _this.setState({ valuationList: arrForValuation });
          });
          break;
        default:
          break;
      }
    });
  };

  handleItem = (child = []) => {
    return (
      <Descriptions>
        {child.map(item => {
          return <Descriptions.Item label={item.label}>{item.value || '--'}</Descriptions.Item>;
        })}
      </Descriptions>
    );
  };

  render() {
    const {
      record,
      activeTabKey,
      expensesAndAchievementList,
      basicsList,
      valuationList,
    } = this.state;
    const { loading, productForInfo, productForInformationInfo } = this.props;
    const { infoList = [] } = productForInfo;
    const { info = [] } = productForInformationInfo;
    //
    return (
      <Tabs tabPosition="left" onChange={this.handleTaskTabs} activeKey={activeTabKey}>
        <TabPane tab="基础信息" key="basics" style={{ padding: '16px 0' }}>
          <Spin spinning={!!loading}>{this.handleItem(basicsList)}</Spin>
        </TabPane>
        <TabPane
          tab="费用与业绩报酬信息"
          key="expensesAndAchievement"
          style={{ padding: '16px 0' }}
        >
          <Spin spinning={!!loading}>{this.handleItem(expensesAndAchievementList)}</Spin>
        </TabPane>
        <TabPane tab="估值运营信息" key="valuation" style={{ padding: '16px 0' }}>
          <Spin spinning={!!loading}>{this.handleItem(valuationList)}</Spin>
        </TabPane>
        <TabPane tab="信息披露信息" key="disclosure" style={{ padding: '16px 0' }}>
          <Spin spinning={!!loading}>{this.handleItem(infoList)}</Spin>
        </TabPane>
        <TabPane tab="终止结算信息" key="liquidation" style={{ padding: '16px 0' }}>
          <Spin spinning={!!loading}>{this.handleItem(infoList)}</Spin>
        </TabPane>
      </Tabs>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInfo, productForInformationInfo, loading }) => ({
        productForInfo,
        productForInformationInfo,
        loading:
          loading.effects['productForInfo/getInfoList'] ||
          loading.effects['productForInformationInfo/getInfo'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

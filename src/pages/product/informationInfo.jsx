import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Tabs, Form, Breadcrumb, message, Descriptions, Spin } from 'antd';
import { Card, PageContainers } from '@/components';
import styles from './bulletinBoard.less';

const { TabPane } = Tabs;

// 组件引用
import Description from './component/description';
import Document from './document';
import AccountList from './accountList';
import ExamineList from './examineList';

@Form.create()
class Index extends Component {
  state = {
    activeTabKey: 'product',
    title: '',
  };

  componentDidMount() {
    this.getInfo();
    this.handleTaskTabs();
  }

  getInfo = () => {
    const { dispatch, location } = this.props;
    const proCode = location?.query?.proCode || '';
    const proName = location?.query?.proName || '';
    // 详情
    dispatch({
      type: 'productForInformationInfo/getInfo',
      payload: {
        bizViewId: 'I8aaa8285017e483748371242017f632986c57863',
        FPRO_CODE: proCode,
        returnType: 'OBJECT',
      },
    });
    this.setState({ title: `${proName}-${proCode}` });
  };

  handleTaskTabs = (key = 'product') => {
    const { dispatch, location } = this.props;
    const proCode = location?.query?.proCode || '';
    this.setState({ activeTabKey: key }, () => {
      switch (key) {
        case 'product':
          // 产品信息  
          dispatch({
            type: 'productForInformationInfo/getInfos',
            payload: {
              bizViewId: 'I8aaa8285017e483748371242017f4db8fe2c5129',
              FPRO_CODE: proCode,
              returnType: 'OBJECT',
            },
          });
          break;
        case 'contract':
          // 合同详情
          dispatch({
            type: 'productForInformationInfo/getInfos',
            payload: {
              bizViewId: 'I8aaa8285017e483748371242017f4340a1027ded',
              FPRO_CODE: proCode,
              returnType: 'OBJECT',
            },
          });
          break;

        case 'account':
   
          break;

        case 'customer':
          // 客户详情
          dispatch({
            type: 'productForInformationInfo/getInfos',
            payload: {
              bizViewId: 'I8aaa82b6018044a544a547620180ac6c59f53c6b',
              FPRO_CODE: proCode,
              returnType: 'OBJECT',
            },
          });
          break;

        default:
          break;
      }
    });
  };

  render() {
    const { activeTabKey, tabListNoTitle, title } = this.state;
    const { productForInformationInfo, location, listLoading, loading } = this.props;
    const { info, infoDataList, accountList } = productForInformationInfo || [];
    const proCode = location?.query?.proCode || '';

    return (
      <>
        <PageContainers
          breadcrumb={[
            { title: '产品管理', url: '' },
            { title: '信息管理', url: '/product/bulletinBoard' },
            { title: '信息详情', url: '' },
          ]}
        />
        <Spin spinning={loading}>
          <Description data={info} title={title} />
        </Spin>
        <Card title={false} style={{ marginTop: '16px' }}>
          <Tabs tabPosition="left" onChange={this.handleTaskTabs} activeKey={activeTabKey}>
            <TabPane tab="产品信息" key="product" style={{ padding: '16px 0' }}>
              <Spin spinning={!!listLoading}>
                <Descriptions>
                  {infoDataList?.map(item => {
                    return <Descriptions.Item label={item.label}>{item.value}</Descriptions.Item>;
                  })}
                </Descriptions>
                <ExamineList proCode={proCode}/>
              </Spin>
            </TabPane>
            <TabPane tab="合同信息" key="contract" style={{ padding: '16px 0' }}>
              <Spin spinning={!!listLoading}>
                <Descriptions>
                  {infoDataList?.map(item => {
                    return <Descriptions.Item label={item.label}>{item.value}</Descriptions.Item>;
                  })}
                </Descriptions>
              </Spin>
            </TabPane>
            <TabPane tab="账户信息" key="account" style={{ padding: '16px 0' }}>
              <Spin spinning={!!listLoading}>
                {activeTabKey === 'account' && <AccountList  proCode={proCode}/>}
              </Spin>
            </TabPane>
            <TabPane tab="客户信息" key="customer" style={{ padding: '16px 0' }}>
              <Spin spinning={!!listLoading}>
                <Descriptions>
                  {infoDataList?.map(item => {
                    return <Descriptions.Item label={item.label}>{item.value}</Descriptions.Item>;
                  })}
                </Descriptions>
              </Spin>
            </TabPane>
            <TabPane tab="文件列表" key="file" style={{ padding: '16px 0' }}>
              <Spin spinning={!!listLoading}>
                {activeTabKey === 'file' && <Document proCode={proCode}></Document>}
              </Spin>
            </TabPane>
          </Tabs>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInformationInfo, loading }) => {
        return {
          productForInformationInfo,
          loading: loading.effects['productForInformationInfo/getInfo'],
          listLoading:
            loading.effects['productForInformationInfo/getInfos'] ||
            loading.effects['productForInformationInfo/getInfoForAccount'],
        };
      })(Index),
    ),
  ),
);

export default WrappedSingleForm;

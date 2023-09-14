import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Row, Col, Spin } from 'antd';
import { Card, PageContainers } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';

// 组件引用
import Description from './component/description';
import LifeCycle from './lifeCycle';
import TimeAxis from './timeAxis';
import Data from './data';
import Document from './document';
import ChangeHistory from './changeHistory';

// 布局
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
@Form.create()
class Index extends Component {
  state = {
    loading: false,
    activeTabKey: 'LifeCycle',
    tabListNoTitle: [
      {
        key: 'LifeCycle',
        tab: '产品生命周期',
      },
      {
        tab: '时间轴',
        key: 'TimeAxis',
      },
      {
        tab: '产品数据',
        key: 'Data',
      },
      {
        tab: '产品文档',
        key: 'Document',
      },
      {
        tab: '变更历史',
        key: 'ChangeHistory',
      },
    ],
    infoData: [],
  };

  componentDidMount() {
    this.getInfo();
  }

  // 获取产品详情数据
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
    }).then(res => {
      this.setState({ infoData: res || [] });
    });
    this.setState({ title: `${proName}-${proCode}` });
  };

  handleTaskTabs = key => {
    this.setState({ activeTabKey: key });
  };

  render() {
    const { activeTabKey, tabListNoTitle, title, infoData } = this.state;
    const { location, loading } = this.props;
    const proCode = location?.query?.proCode || '';
    const proStage = location?.query?.proStage || '';

    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品管理',
              url: '',
            },
            {
              title: '产品看板',
              url: '/product/bulletinBoard',
            },
            {
              title: '产品详情',
              url: '',
            },
          ]}
        />
        <Spin spinning={!!loading}>
          <Description data={infoData} title={title} />
        </Spin>
        <Card
          title={false}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey}
          onTabChange={key => this.handleTaskTabs(key)}
          style={{ marginTop: '16px' }}
        >
          {activeTabKey === 'LifeCycle' && <LifeCycle proCode={proCode} proStage={proStage}></LifeCycle>}
          {activeTabKey === 'TimeAxis' && <TimeAxis proCode={proCode}></TimeAxis>}
          {activeTabKey === 'Data' && <Data proCode={proCode}></Data>}
          {activeTabKey === 'Document' && <Document proCode={proCode}></Document>}
          {activeTabKey === 'ChangeHistory' && <ChangeHistory></ChangeHistory>}
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForbulletinBoard, productForInformationInfo, loading }) => ({
        productForbulletinBoard,
        productForInformationInfo,
        loading: loading.effects['productForInformationInfo/getInfo'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

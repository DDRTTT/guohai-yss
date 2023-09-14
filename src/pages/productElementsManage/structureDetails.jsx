
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Descriptions, Card } from 'antd';
import styles from './productElements.less';

@Form.create()
class Index extends Component {
  state = {
    record: {},
  };
  componentDidMount() {
    console.log(this.props.location.data);
    this.setState({ record: this.props.location.data });
  }

  jumpBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '../productElementsList',
      data: { activeKey: 'structure' },
    }))
  }

  render() {
    const { record } = this.state;
    return (
      <>
        <Card className={styles.detailCard}>
          <Breadcrumb className={styles.breadcrumb} >
            <Breadcrumb.Item>产品要素管理</Breadcrumb.Item>
            <Breadcrumb.Item>查看产品要素表结构信息</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card title='查看产品要素-表结构信息' extra={<a onClick={this.jumpBack}>返回</a>} >
          <div className={styles.detailCard1}>
            <Descriptions>
              <Descriptions.Item label="表名">--</Descriptions.Item>
              <Descriptions.Item label="数据库字段名">--</Descriptions.Item>
              <Descriptions.Item label="数据库字段类型">--</Descriptions.Item>
              <Descriptions.Item label="必输项">--</Descriptions.Item>
              <Descriptions.Item label="组件类型">--</Descriptions.Item>
              <Descriptions.Item label="精度">--</Descriptions.Item>
              <Descriptions.Item label="是否为扩展字段">--</Descriptions.Item>
              <Descriptions.Item label="权限校验类型">--</Descriptions.Item>
              <Descriptions.Item label="是否为系统级别字段">--</Descriptions.Item>
              <Descriptions.Item label="关联业务数据">--</Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productElements }) => ({ productElements }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

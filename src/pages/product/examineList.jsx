// 考核参数列表
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig, eutrapelia } from '@/pages/investorReview/func';
import { Form, Breadcrumb, Button, message, Row, Col, Pagination } from 'antd';
import { Card, PageContainers, Table } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';
// 布局
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
@Form.create()
class Index extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    list: {},
  };

  componentDidMount() {
    this.getDicts();
    this.handleGetTableList();
  }
  // 切换页码（任务列表）
  changePage = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize: pageSize }, () => {
      this.handleGetTableList();
    });
  };

  getDicts = () => {
    const { dispatch } = this.props;
    // 数据字典
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'divideChannel,AgencyChannelType,InlineResourceType,statisticalMethod',
    });
  };

  // 列表项回显
  handleColumns = (item, code) => {
    const { productForbulletinBoard } = this.props;
    const { dicts, subclass } = productForbulletinBoard || {};
    const text = dicts[item]?.find(value => value?.code === code);
    return (text && text?.name) || '-';
  };

  /**
   * 初始化表格数据
   */
  handleGetTableList = () => {
    const { dispatch, proCode } = this.props;
    const { pageNum, pageSize, seachData } = this.state;
    // 产品信息-考核列表
    dispatch({
      type: 'productForInformationInfo/getInfoForAccount',
      payload: {
        bizViewId: 'I8aaa8285017e483748371242017f3e5a44d35718',
        FPRO_CODE: proCode,
        returnType: 'LIST',
        isPage: '1',
        page: pageNum,
        size: pageSize,
      },
    }).then(res => {
      this.setState({ list: res });
    });
  };

  render() {
    const { pageNum, pageSize, list } = this.state;
    const { loading, productForbulletinBoard } = this.props;

    const { dicts = {} } = productForbulletinBoard;

    // 表头数据
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        align: 'center',
        render: (val, record, index) => {
          const { pageNum, pageSize } = this.state;
          return `${index + 1 + (pageNum - 1) * pageSize}`;
        },
      },
      {
        title: '是否划分渠道',
        dataIndex: 'whetherDivideChannel',
        key: 'whetherDivideChannel',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(text ? (text === '1' ? '是' : '否') : '-');
        },
      },
      {
        title: '划分渠道',
        dataIndex: 'divideChannel',
        key: 'divideChannel',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('divideChannel', text));
        },
      },
      {
        title: '代销渠道类型',
        dataIndex: 'agencyChannelType',
        key: 'agencyChannelType',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('AgencyChannelType', text));
        },
      },
      {
        title: '行内资源类型',
        dataIndex: 'inlineResourceType',
        key: 'inlineResourceType',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('InlineResourceType', text));
        },
      },
      {
        title: '统计方式',
        dataIndex: 'statisticalMethod',
        key: 'statisticalMethod',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('statisticalMethod', text));
        },
      },
      {
        title: '保有量代码',
        dataIndex: 'holdingCode',
        key: 'holdingCode',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '固定金额',
        dataIndex: 'scaledFixedCost',
        key: 'scaledFixedCost',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
    ];

    return (
      <>
        <Table
          columns={columns}
          dataSource={list?.rows || []}
          scroll={{ x: columns.length * 200 - 200 }}
          loading={loading}
          pagination={false}
        />
        <Pagination
          style={{ textAlign: 'right', marginTop: 15 }}
          onChange={this.changePage}
          onShowSizeChange={this.changePage}
          total={list?.total}
          pageSize={pageSize}
          current={pageNum}
          showTotal={total => `共 ${total} 条数据`}
          showSizeChanger
          showQuickJumper
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInformationInfo, productForbulletinBoard, loading }) => {
        return {
          productForInformationInfo,
          productForbulletinBoard,
          loading: loading.effects['productForInformationInfo/getInfoForAccount'],
        };
      })(Index),
    ),
  ),
);
//
export default WrappedSingleForm;

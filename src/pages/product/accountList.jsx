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

  getDicts = () => {
    const { dispatch } = this.props;
    // 数据字典
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'C001,A003,A001,openAccountChannel',
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
    dispatch({
      type: 'productForInformationInfo/getInfoForAccount',
      payload: {
        bizViewId: 'I8aaa8285017e483748371242017f4346e22c7e4b',
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

  // 切换页码（任务列表）
  changePage = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize: pageSize }, () => {
      this.handleGetTableList();
    });
  };

  render() {
    const { pageNum, pageSize, list } = this.state;
    const { productForbulletinBoard } = this.props;

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
        title: '开户行',
        dataIndex: 'accDepositBank',
        key: 'accDepositBank',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '账户类型',
        dataIndex: 'accountType',
        key: 'accountType',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('A001', text));
        },
      },
      {
        title: '开户渠道',
        dataIndex: 'openAccountChannel',
        key: 'openAccountChannel',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('openAccountChannel', text));
        },
      },
      {
        title: '重要说明',
        dataIndex: 'majorNote',
        key: 'majorNote',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '账户名称',
        dataIndex: 'accountName',
        key: 'accountName',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '账号',
        dataIndex: 'accountNo',
        key: 'accountNo',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('C001', text));
        },
      },
      {
        title: '账户利率',
        dataIndex: 'accInterestRate',
        key: 'accInterestRate',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '账户状态',
        dataIndex: 'accountStatus',
        key: 'accountStatus',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumns('A003', text));
        },
      },
      {
        title: '是否为子账户',
        dataIndex: 'subAccount',
        key: 'subAccount',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(text ? (text === '1' ? '是' : '否') : '-');
        },
      },
      {
        title: '关联母账户账号',
        dataIndex: 'associateParentAccount',
        key: 'associateParentAccount',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '大额支付号',
        dataIndex: 'largePayNum',
        key: 'largePayNum',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '开户日期',
        dataIndex: 'openingDate',
        key: 'openingDate',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '销户日期',
        dataIndex: 'closingDate',
        key: 'closingDate',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '用途',
        dataIndex: 'purpose',
        key: 'purpose',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '备注',
        dataIndex: 'accountRemark',
        key: 'accountRemark',
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
      connect(({ productForInformationInfo, productForbulletinBoard }) => ({
        productForInformationInfo,
        productForbulletinBoard,
      }))(Index),
    ),
  ),
);
//
export default WrappedSingleForm;

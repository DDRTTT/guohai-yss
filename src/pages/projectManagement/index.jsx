/**
 * 项目信息管理
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { Table } from '@/components';
import router from 'umi/router';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    name: `King ${i}`,
    age: 32,
    address: ` Lane no. ${i}`,
  });
}

@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {}

  sponsorTask = link => {
    router.push('/projectManagement/addInformationManagement');
  };

  aaDetails = link => {
    router.push('/projectManagement/informationParticulars');
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const columns = [
      {
        title: '项目编码',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '项目名称',
        dataIndex: 'age',
        fixed: 'left',
      },
      {
        title: '项目简称',
        dataIndex: 'address',
      },
      {
        title: '项目类型',
        dataIndex: '',
      },
      {
        title: '项目区域',
        dataIndex: '',
      },
      {
        title: '所属部门',
        dataIndex: '',
      },
      {
        title: '开始日期',
        dataIndex: '',
      },
      {
        title: '项目描述',
        dataIndex: '',
      },
      {
        title: '项目分类',
        dataIndex: '',
      },
      {
        title: '是否招投标',
        dataIndex: '',
      },
      {
        title: '证券代码',
        dataIndex: '',
      },
      {
        title: '证券简称',
        dataIndex: '',
      },
      {
        title: '上市/挂牌板块',
        dataIndex: '',
      },
      {
        title: '交易场所',
        dataIndex: '',
      },
      {
        title: '其他交易场所',
        dataIndex: '',
      },
      {
        title: '申报时间',
        dataIndex: '',
      },
      {
        title: '发行时间',
        dataIndex: '',
      },
      {
        title: '客户名称',
        dataIndex: '',
      },
      {
        title: '客户类型',
        dataIndex: '',
      },
      {
        title: '创建时间',
        dataIndex: '',
      },
      {
        title: '创建人',
        dataIndex: '',
      },
      {
        title: '状态',
        dataIndex: '',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <div>
            <span>未生效</span>
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        fixed: 'right',
        width: 320,
        render: (text, record) => (
          <div className={style.actionButs}>
            <span className={style.actionBut} onClick={this.aaDetails}>
              查看
            </span>
            |<span className={style.actionBut}>修改</span>|
            <span className={style.actionBut}>审查</span>|
            <span className={style.actionBut}>删除</span>|
            <span className={style.actionBut}>项目终止</span>|
            <span className={style.actionBut}>项目发行</span>
          </div>
        ),
      },
    ];

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div className={style.topBg}>
          <Button type="primary" onClick={this.sponsorTask}>
            新建项目
          </Button>
        </div>
        <Table
          scroll={{ x: 3000 }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(Form.create()(connect(({ loading }) => ({}))(Index)));

export default WrappedIndex;

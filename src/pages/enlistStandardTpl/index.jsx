/**
 *  招募书标准模板
 */
import React, { Component, useState } from 'react';
import { Form, Row, Col, Breadcrumb, Button, Table, Pagination, message, Tooltip, Tag } from 'antd';
import { Card, PageContainers } from '@/components';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import request from '@/utils/request';

@Form.create()
class StandardTpl extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    selectedRowKeys: [],
    selectedRows: [],
    dataList: [],
    columns: [
      {
        title: '序号',
        align: 'center',
        width: 50,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        key: 'fileName',
        title: '招募说明书名称',
        dataIndex: 'fileName',
        width: 300,
        ellipsis: {
          showTitle: false,
        },
        render: fileName => {
          return (
            <Tooltip placement="topLeft" title={fileName}>
              <span>{fileName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'lastEditTime',
        title: '最新更新时间',
        dataIndex: 'lastEditTime',
        width: 140,
        ellipsis: {
          showTitle: false,
        },
        render: lastEditTime => {
          return (
            <Tooltip placement="topLeft" title={lastEditTime}>
              <span>{lastEditTime}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proShortName',
        title: '最新更新人',
        dataIndex: 'proShortName',
        width: 180,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        key: 'dataFrom',
        title: '数据来源',
        dataIndex: 'dataFrom',
        align: 'center',
        width: 120,
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        align: 'center',
        width: 140,
        render: (checked, record) => {
          return <Tag>{checked ? '已审核' : '未审核'}</Tag>;
        },
      },
      {
        title: '操作',
        width: 320,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Button
                style={{
                  marginLeft: '-10px',
                }}
                onClick={() => this.watchDetail(record)}
                type="link"
                size="small"
              >
                查看
              </Button>
              <Button onClick={() => this.modifyData(record)} type="link" size="small">
                修改
              </Button>
              <Button onClick={() => this.delete(record)} type="link" size="small">
                删除
              </Button>
              <Button onClick={() => this.handelCheck(record)} type="link" size="small">
                审核
              </Button>
              <Button onClick={() => this.handelDeCheck(record)} type="link" size="small">
                反审核
              </Button>
              <Button onClick={() => this.handleDownLoad(record)} type="link" size="small">
                下载
              </Button>
            </>
          );
        },
      },
    ],
  };

  componentDidMount() {
    this.getTableList();
  }

  // 切换页数的时候触发
  handleSetPage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize,
      },
      () => this.getTableList(),
    );
  };

  // 获取列表数据
  getTableList() {
    const { pageNum, pageSize } = this.state;
    const { dispatch, form } = this.props;

    const payload = {
      pageNum,
      pageSize,
    };
    request(`/ams-file-service/template/getStandardTemplate`, {
      method: 'get',
      payload,
    }).then(res => {
      this.setState(
        {
          dataList: [],
          total: 0,
        },
        () => {
          if (res && res.status === 200) {
            this.setState({
              dataList: [res.data],
              total: 1,
            });
          } else {
            message.warn(res.message);
          }
        },
      );

      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    });
  }

  // 导入模板
  importTemplates() {}

  // 查看
  watchDetail(record) {}

  // 修改
  modifyData(record) {}

  // 删除
  delete(record) {}

  // 审核
  handelCheck(record) {}

  // 反审核
  handelDeCheck(record) {}

  // 下载
  handleDownLoad(record) {}

  render() {
    const { columns, dataList, selectedRowKeys, pageNum, pageSize, total } = this.state;
    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '招募说明书',
              url: '',
            },
            {
              title: '招募说明书标准模板',
              url: '',
            },
          ]}
        />
        <Card
          extra={
            <Button type="primary" onClick={this.importTemplates}>
              导入模板
            </Button>
          }
        >
          <Table
            dataSource={dataList}
            columns={columns}
            scroll={{ x: 1300 }}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            pagination={false}
            rowKey={record => record.taskId}
          />
          {total != 0 ? (
            <Pagination
              style={{
                textAlign: 'right',
              }}
              defaultCurrent={pageNum}
              defaultPageSize={pageSize}
              onChange={this.handleSetPage}
              onShowSizeChange={this.handleSetPage}
              total={total}
              showTotal={() => `共 ${total} 条数据`}
              showSizeChanger
              showQuickJumper={total > pageSize}
            />
          ) : null}
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ standardTpl }) => ({
        standardTpl,
      }))(StandardTpl),
    ),
  ),
);
export default WrappedSingleForm;

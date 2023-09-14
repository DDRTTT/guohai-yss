import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Form,
  Breadcrumb,
  Button,
  message,
  Descriptions,
  Spin,
  Steps,
  Timeline,
  Row,
  Col,
} from 'antd';
import { Card, PageContainers, Table } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';
const { Step } = Steps;
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
    record: {},
    pageNum: 1,
    pageSize: 10,
    total: 11,
  };

  handleSearch = () => {};
  handleReset = () => {};
  render() {
    const { loading, record, pageNum, pageSize, total } = this.state;
    const { form } = this.props;
    const formItemData = [
      {
        name: 'proCodes',
        label: '所属流程',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
      {
        name: 'proCodes',
        label: '文档类型',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
      {
        name: 'proCodes',
        label: '明细分类',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
      {
        name: 'proCodes',
        label: '文档名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
      {
        name: 'proCodes2',
        label: '归档开始日期',
        type: 'DatePicker',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
      {
        name: 'proCodes1',
        label: '归档结束日期',
        type: 'DatePicker',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [],
      },
    ];

    const columns = [
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '产品代码',
        dataIndex: 'age',
        key: 'age',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '操作类型',
        dataIndex: 'tel',
        key: 'tel',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '操作内容',
        dataIndex: 'phone',
        key: 'phone',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '变更前',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '变更后',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '提交时间',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '审核结果',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '审批意见',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '审批人',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
      {
        title: '审批时间',
        dataIndex: 'zt',
        key: 'zt',
        render: subjectName => <span>{subjectName}</span>,
      },
    //   {
    //     title: '操作',
    //     dataIndex: 'id',
    //     align: 'center',
    //     fixed: 'right',
    //     render: (val, record) => <a style={{ marginRight: 10 }}>查看</a>,
    //   },
    ];

    return (
      <>
        {/* <Form {...layout} onSubmit={this.handleSearch} className={'seachForm2'}>
          <Row gutter={24}>
            <CustomFormItem formItemList={formItemData} form={form} />
            <Col span={6} className={'textAlign_r padding_t8 padding_b8 float_r'}>
              <Button
                type="primary"
                htmlType="submit"
                // loading={loading}
                className={'margin_l5 margin_l5'}
              >
                查询
              </Button>
              <Button onClick={this.handleReset} className={'margin_l5 margin_r5'}>
                重置
              </Button>
            </Col>
          </Row>
        </Form> */}
        <Table
          // rowKey={record => record.id}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={[{}, {}]}
          scroll={{ x: columns.length * 200 }}
          // loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showTotal: total => `共 ${total} 条数据`,
          }}
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(Form.create()(connect(({ dataSource }) => ({ dataSource }))(Index))),
);

export default WrappedSingleForm;

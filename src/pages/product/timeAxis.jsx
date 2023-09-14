import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleShowTransferHistory } from '@/utils/transferHistory';
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
  Table,
} from 'antd';
import { Card, PageContainers } from '@/components';
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

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { dispatch, proCode } = this.props;
    dispatch({
      type: 'productForInfo/getTimeAxis',
      payload: proCode,
    });
  };

  handleExportFile = () => {
    const { productForInfo } = this.props;
    const { timeAxis } = productForInfo || [];
    console.log(timeAxis);
    const arr = [];
    for (const i of timeAxis) {
      arr.push({
        发起时间: i.startTime || '',
        结束时间: i.endTime || '',
        流程名称: this.handleChangeVlue(i.processName),
        流程状态: i.processStatusName || '',
        用户名称: i.startUserName || '',
        processInstanceId: i.processInstanceId || '',
        startUserId: i.startUserId || '',
      });
    }
    this.tableToExcel(arr);
  };

  tableToExcel = data => {
    const base64 = s => window.btoa(unescape(encodeURIComponent(s)));

    let str =
      '<tr><td>开始时间</td><td>结束时间</td><td>流程名称</td><td>流程状态</td><td>用户名称</td><td>processInstanceId</td><td>startUserId</td></tr>';
    for (let i = 0; i < data.length; i++) {
      str += '<tr>';
      for (const key in data[i]) {
        str += `<td>${data[i][key] + '\t'}</td>`;
      }
      str += '</tr>';
    }
    const worksheet = '产品生命周期 - 时间轴';
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`;
    window.location.href = uri + base64(template);
  };

  handleChangeVlue = val => {
    return val?.replace(/lifecycle_/, '产品生命周期') || '';
  };

  sharedOnCell = (record, index) => {
    if (record.yearAndMoth) {
      return { colSpan: 0 };
    }
  };

  render() {
    const { loading, record, pageNum, pageSize, total } = this.state;

    const { listLoading, productForInfo } = this.props;
    const { timeAxis } = productForInfo || [];

    const columns = [
      {
        title: '发起时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 200,
        render: (text, record) => {
          return record.yearAndMoth ? (
            <strong>{record.yearAndMoth}</strong>
          ) : (
            <span>{record.yearAndMoth || text}</span>
          );
        },
        onCell: (record, _) => ({
          colSpan: record.yearAndMoth ? 6 : 1,
        }),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 200,
        render: subjectName => <span>{subjectName}</span>,
        onCell: this.sharedOnCell,
      },
      {
        title: '流程名称',
        dataIndex: 'processName',
        key: 'processName',
        width: 200,
        render: subjectName => <span>{subjectName}</span>,
        onCell: this.sharedOnCell,
      },
      {
        title: '发起人',
        dataIndex: 'startUserName',
        key: 'startUserName',
        fixed: 'right',
        width: 200,
        render: subjectName => <span>{subjectName}</span>,
        onCell: this.sharedOnCell,
      },
      {
        title: '流程状态',
        dataIndex: 'processStatusName',
        key: 'processStatusName',
        fixed: 'right',
        render: subjectName => <span>{subjectName}</span>,
        onCell: this.sharedOnCell,
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <div>
            {!record.yearAndMoth && (
              <a style={{ marginRight: 10 }} onClick={() => handleShowTransferHistory(record)}>
                查看详情
              </a>
            )}
          </div>
        ),
      },
    ];

    return (
      <div className={styles.timeAxis}>
        <Card
          title={false}
          extra={
            <Button type="primary" onClick={this.handleExportFile}>
              导出
            </Button>
          }
        >
          <Table
            bordered={false}
            columns={columns}
            dataSource={timeAxis}
            scroll={{ x: columns.length * 200 }}
            loading={listLoading}
            pagination={false}
          />
        </Card>
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInfo, loading }) => ({
        productForInfo,
        listLoading: loading.effects['productForInfo/getTimeAxis'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

/**
 * 操作日志
 */

import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Tooltip} from 'antd';
import { getDateStr } from '@/utils/utils';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Table } from '@/components';
import List from '@/components/List';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

@errorBoundary
@Form.create()
@connect(({ operationLog, loading }) => ({
  operationLog,
  loading: loading.effects['operationLog/logListTable'],
}))
export default class logList extends BaseCrudComponent {
  state = {
    formValues: {
      start: 1,
      length: 10,
    },
    startDate: getDateStr(-7)
  };

  handleSearch = fieldsValue => {
    const { dispatch } = this.props;
    const date = {
      startDate: getDateStr(-15),
      endDate: getDateStr(0),
    };
    if (fieldsValue?.date !== undefined) {
      date.startDate = fieldsValue?.date[0].format('YYYY-MM-DD');
      date.endDate = fieldsValue?.date[1].format('YYYY-MM-DD');
    }
    const value = {
      service: fieldsValue?.service,
      userName: fieldsValue?.userName,
      method: fieldsValue?.method,
      start: 1,
      length: 10,
      ...date,
    };
    this.setState({
      formValues: value,
    });
    dispatch({
      type: `operationLog/logListTable`,
      payload: value,
    });
  };

  //重置
  handleReset = () => {
    const { dispatch } = this.props;
    const value = { start: 1, length: 10, startDate: getDateStr(-15), endDate: getDateStr(0) };
    this.setState({ formValues: value });
    dispatch({
      type: `operationLog/logListTable`,
      payload: value,
    });
  }

  handleStandardTableChange = ({ current, pageSize }) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const form = {
      ...formValues,
      start: current,
      length: pageSize,
    };
    dispatch({
      type: `operationLog/logListTable`,
      payload: form,
    });
    this.setState({
      formValues: form,
    });
  };

  // 跳转
  jumpPage = ({ id }) =>
    router.push(`/LogQuery/logList/logDetails?startTime=${this.state.startDate}&id=${id}`);

  componentDidMount() {
    const { dispatch } = this.props;

    // 操作类型 - 词汇字典
    dispatch({
      type: `operationLog/vocabularyDic`,
      payload: 'opeType',
    });

    // 服务模块 下拉
    dispatch({
      type: 'operationLog/searchgroup2',
      payload: {
        startDate: getDateStr(-7),
        endDate: getDateStr(0),
        group: [
          {
            groupName: 'service',
            groupLeve: 1,
          },
        ],
      },
    });

    this.handleSearch();
  }

  render() {
    const {
      operationLog: { saveNewTable, saveSearchGroup, saveVocabularyDic },
      loading,
    } = this.props;

    const { formValues } = this.state;

    const handlePagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: formValues.start,
      total: saveNewTable.total,
      showTotal: total => `共 ${total} 条数据`,
    };

    const columns = [
      {
        title: '服务名',
        dataIndex: 'service',
        key: 'service',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '主机名',
        dataIndex: 'host',
        key: 'host',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '端口号',
        dataIndex: 'port',
        key: 'port',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '日志级别',
        dataIndex: 'severity',
        key: 'severity',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '线程',
        dataIndex: 'thread',
        key: 'thread',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '进程号',
        dataIndex: 'pid',
        key: 'pid',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '终端请求方式',
        dataIndex: 'type',
        key: 'type',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '操作人ID',
        dataIndex: 'userId',
        key: 'userId',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '用户归属机构ID',
        dataIndex: 'orgId',
        key: 'orgId',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '操作人姓名',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '操作人终端IP',
        dataIndex: 'userHost',
        key: 'userHost',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '用户归属系统ID',
        dataIndex: 'fsysId',
        key: 'fsysId',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求类名',
        dataIndex: 'className',
        key: 'className',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求类名描述',
        dataIndex: 'swaggerApi',
        key: 'swaggerApi',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求方法',
        dataIndex: 'classMethod',
        key: 'classMethod',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求方法描述',
        dataIndex: 'swaggerApiOperation',
        key: 'swaggerApiOperation',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        key: 'method',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求路径',
        dataIndex: 'url',
        key: 'url',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求终端IP',
        dataIndex: 'clientIp',
        key: 'clientIp',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求sessionId',
        dataIndex: 'sessionId',
        key: 'sessionId',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '接口返回时间',
        dataIndex: 'returnTime',
        key: 'returnTime',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '请求耗时',
        dataIndex: 'timeConsuming',
        key: 'timeConsuming',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '响应码',
        dataIndex: 'httpStatusCode',
        key: 'httpStatusCode',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                  ? '-'
                  : 0}
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (text, record) => (
          <span>
            <a onClick={() => this.jumpPage(record)}>详情</a>
          </span>
        ),
      },
    ];

    const formItemData = [
      {
        name: 'service',
        label: '服务模块',
        type: 'select',
        readSet: { name: 'key', code: 'key' },
        option: saveSearchGroup.rows,
      },

      {
        name: 'userName',
        label: '操作人',
        type: 'input',
      },
      {
        name: 'method',
        label: '操作类型',
        type: 'select',
        option: saveVocabularyDic,
      },
      {
        name: 'date',
        label: '选择日期',
        type: 'RangePicker',
        initialValue: [moment(getDateStr(-15), dateFormat), moment(getDateStr(0), dateFormat)],
        rules: [
          {
            required: true,
            message: '请选择选择日期',
          },
        ],
      },
    ];

    return (
      <>
        <List
          formItemData={formItemData}
          advancSearch={this.handleSearch}
          resetFn={this.handleReset}
          fuzzySearchBool={false}
          loading={loading}
          tableList={<Table
            columns={columns}
            loading={loading}
            dataSource={saveNewTable.rows}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            bordered={false}
            pagination={handlePagination}
            scroll={{ x: 4500 }}
          />}
        />
      </>
    );
  }
}

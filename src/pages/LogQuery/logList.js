/**
 * 操作日志
 */

import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';
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
  loading: loading.effects['operationLog/logListTable2'],
}))
export default class logList extends BaseCrudComponent {
  state = {
    formValues: {
      start: 1,
      length: 10,
    },
    startDate: getDateStr(-7),
  };

  handleSearch = fieldsValue => {
    const { dispatch } = this.props;
    console.log('++++++++++++++++++', fieldsValue);
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
      // userId: fieldsValue?.userId,
      userName: fieldsValue?.userName,
      method: fieldsValue?.method,
      url: fieldsValue?.url,
      start: 1,
      length: 10,
      ...date,
    };
    this.setState({
      formValues: value,
    });
    dispatch({
      type: `operationLog/logListTable2`,
      payload: value,
    });
  };

  //重置
  handleReset = () => {
    const { dispatch } = this.props;
    const value = { start: 1, length: 10, startDate: getDateStr(-15), endDate: getDateStr(0) };
    this.setState({ formValues: value });
    dispatch({
      type: `operationLog/logListTable2`,
      payload: value,
    });
  };

  handleStandardTableChange = ({ current, pageSize }) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const form = {
      ...formValues,
      start: current,
      length: pageSize,
    };
    dispatch({
      type: `operationLog/logListTable2`,
      payload: form,
    });
    this.setState({
      formValues: form,
    });
  };

  // 跳转
  jumpPage = ({ id, index }) =>
    // router.push(`/LogQuery/logList/logDetails?startTime=${this.state.startDate}&id=${id}`);
    router.push(`/LogQuery/logList/logDetails?index=${index}&id=${id}`);

  componentDidMount() {
    const { dispatch } = this.props;

    // // 操作类型 - 词汇字典
    // dispatch({
    //   type: `operationLog/vocabularyDic`,
    //   payload: 'opeType',
    // });

    // 服务模块 下拉
    dispatch({
      type: 'operationLog/searchBusGroupList',
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
    // 当前用户下的机构
    dispatch({
      type: 'operationLog/getOrgDropDownList',
      payload: {
        orgId: JSON.parse(sessionStorage.getItem('USER_INFO')).orgId,
      },
    });

    this.handleSearch();
  }

  getSeverResource = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationLog/getResourceData2',
      payload: {
        currentPage: 1,
        pageSize: 10000,
        ...param,
      },
    });
  };

  render() {
    const {
      operationLog: {
        saveBusTable,
        saveBusGroup,
        saveVocabularyDic,
        resourceData,
        departLeaderList,
      },
      loading,
    } = this.props;

    const { formValues } = this.state;

    const handlePagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: formValues.start,
      total: saveBusTable.total,
      showTotal: total => `共 ${total} 条数据`,
    };

    const columns = [
      {
        title: '服务名',
        dataIndex: 'service',
        key: 'service',
      },
      {
        title: '主机名',
        dataIndex: 'host',
        key: 'host',
      },
      {
        title: '端口号',
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: '日志级别',
        dataIndex: 'severity',
        key: 'severity',
      },
      {
        title: '线程',
        dataIndex: 'thread',
        key: 'thread',
      },
      {
        title: '进程号',
        dataIndex: 'pid',
        key: 'pid',
      },
      {
        title: '终端请求方式',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '操作人ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '用户归属机构ID',
        dataIndex: 'orgId',
        key: 'orgId',
      },
      {
        title: '操作人姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '操作人终端IP',
        dataIndex: 'userHost',
        key: 'userHost',
      },
      {
        title: '用户归属系统ID',
        dataIndex: 'fsysId',
        key: 'fsysId',
      },
      {
        title: '请求类名',
        dataIndex: 'className',
        key: 'className',
      },
      {
        title: '请求类名描述',
        dataIndex: 'swaggerApi',
        key: 'swaggerApi',
      },
      {
        title: '请求方法',
        dataIndex: 'classMethod',
        key: 'classMethod',
      },
      {
        title: '请求方法描述',
        dataIndex: 'swaggerApiOperation',
        key: 'swaggerApiOperation',
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        key: 'method',
      },
      {
        title: '请求路径',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '请求终端IP',
        dataIndex: 'clientIp',
        key: 'clientIp',
      },
      {
        title: '请求sessionId',
        dataIndex: 'sessionId',
        key: 'sessionId',
      },
      {
        title: '请求开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
      },
      {
        title: '请求结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '接口返回时间',
        dataIndex: 'returnTime',
        key: 'returnTime',
      },
      {
        title: '请求耗时',
        dataIndex: 'timeConsuming',
        key: 'timeConsuming',
      },
      {
        title: '响应码',
        dataIndex: 'httpStatusCode',
        key: 'httpStatusCode',
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
        option: saveBusGroup.rows,
        config: {
          onChange: e => {
            console.log(e);
            this.getSeverResource({ uriFlag: e });
          },
        },
      },
      {
        name: 'url',
        label: '服务资源',
        type: 'select',
        option: resourceData.rows,
        // fieldNames: {
        //   label: 'description',
        //   value: 'uri',
        // },
        readSet: {
          name: 'description',
          code: 'uri',
          bracket: 'uri',
        },
      },
      {
        name: 'userName',
        label: '操作人',
        type: 'input',
      },
      // {
      //   name: 'userId',
      //   label: '操作人',
      //   type: 'select',
      //   option: departLeaderList,
      //   readSet: {
      //     name: 'name',
      //     code: 'id',
      //   },
      // },
      // {
      //   name: 'method',
      //   label: '操作类型',
      //   type: 'select',
      //   option: saveVocabularyDic,
      // },
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
          tableList={
            <Table
              columns={columns}
              loading={loading}
              dataSource={saveBusTable.rows}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              bordered={false}
              pagination={handlePagination}
              scroll={{ x: 4500 }}
            />
          }
        />
      </>
    );
  }
}

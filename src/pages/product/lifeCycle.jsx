import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig, eutrapelia } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import moment from 'moment';
import { Form, Button, Row, Col, Pagination, message } from 'antd';
import { Card, PageContainers, Table } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';
import History from './component/history';
// 布局
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const uesrInfo = JSON.parse(sessionStorage.getItem('USER_INFO')) || {};
@Form.create()
class Index extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    seachData: {},
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { dispatch } = this.props;
    // 流程发起人下啦数据表
    dispatch({
      type: 'productForInfo/getUserList',
      payload: {},
    });
    // 流程名称下拉
    dispatch({
      type: 'productForInfo/getProcessName',
      payload: {},
    });
    //
    this.setState({ proCode: this.props?.proCode || '' }, () => {
      this.handleGetList();
    });
  };

  handleGetList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, seachData, proCode } = this.state;

    // 任务列表
    dispatch({
      type: 'productForInfo/getNodeTodoTask',
      payload: {
        proCode: proCode,
        pageNum: pageNum,
        pageSize: pageSize,
        flag: this.handleSeachData(seachData),
        ...seachData,
      },
    });
  };

  // 判断查询条件中的值是否都是空值
  handleSeachData = params => {
    for (var key in params) {
      if (params[key]) {
        return '1'; // 终止程序
      }
    }
    return '0';
  };

  handleSearch = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      const startTime =
        (values.startTime && moment(values.startTime).format('YYYY-MM-DD')) || undefined;
      const endTime = (values.endTime && moment(values.endTime).format('YYYY-MM-DD')) || undefined;
      this.setState(
        { pageNum: 1, pageSize: 10, seachData: { ...values, ...{ startTime, endTime } } },
        () => {
          this.handleGetList();
        },
      );
    });
  };
  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ seachData: {} });
  };

  // 办理
  /**
   * 去流程引擎的办理页面需要的参数
   * @method handleCanCheck
   * @params taskId 任务id
   * @params processDefinitionId 流程定义id
   * @params processInstanceId 流程实例id
   * @params taskDefinitionKey 任务定义key
   */
  handleCanCheck = record => {
    const { dispatch } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      id: record.id,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      proCode: record.proCode,
    };
    dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  };

  handleGetTaskNameList = val => {
    const { seachData } = this.state;
    const { productForInfo, dispatch, form } = this.props;
    const { processNameList } = productForInfo;
    const list = processNameList.find(item => item.moduleCode === val);

    // 任务列表
    dispatch({
      type: 'productForInfo/getTaskName',
      payload: list?.processKey || '',
    });
    form.resetFields('name');
    this.setState({
      seachData: { ...seachData, ...{ name: '' } },
    });
  };

  // 切换页码（任务列表）
  changePage = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize: pageSize }, () => {
      this.handleGetList();
    });
  };

  handleStageChange = val => {
    const { form } = this.props;
    const { seachData } = this.state;
    form.setFieldsValue({ processName: val });
    this.handleGetTaskNameList(val);
    this.setState(
      { pageNum: 1, pageSize: 10, seachData: { ...seachData, ...{ processName: val } } },
      () => {
        this.handleGetList();
      },
    );
  };

  //  催办
  handleUrge = val => {
    const { dispatch } = this.props;
    let time = new Date();
    // 任务列表
    dispatch({
      type: 'productForInfo/addTask',
      payload: {
        queryData: val?.assignee,
        data: {
          type: 'customItems',
          title: '催办提醒',
          content: '您名下有一条流转任务停留时间过长，请尽快进行处理！',
          executeTime: time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate(),
          typeCode: 'otherOpMatters',
          taskSource: '1',
        },
      },
    }).then(res => {
      if (res) message.success('催办成功');
    });
  };

  handleColumnsForAssignee = val => {
    const { productForInfo } = this.props;
    const { userList } = productForInfo;
    const assigneeList = val?.split(',') || [];
    let nameList = [];
    userList?.forEach(item => {
      if (assigneeList.includes(item?.id)) nameList.push(item.username);
    });
    return nameList.join(',');
  };

  render() {
    const { pageNum, pageSize } = this.state;
    const { listLoading, productForInfo, form, proCode, proStage } = this.props;
    const { userList, nodeTodoTask, processNameList, taskNameList } = productForInfo;

    const formItemData = [
      {
        name: 'processName',
        label: '流程名称',
        type: 'select',
        readSet: { name: 'processName', code: 'moduleCode' },
        config: { maxTagCount: 1, onChange: this.handleGetTaskNameList },
        option: processNameList || [],
      },
      {
        name: 'name',
        label: '任务名称',
        type: 'select',
        readSet: { name: 'nodeName', code: 'nodeId' },
        config: { maxTagCount: 1 },
        option: taskNameList || [],
      },
      {
        name: 'startUserId',
        label: '发起人',
        type: 'select',
        readSet: { name: 'username', code: 'id' },
        config: { maxTagCount: 1 },
        option: userList || [],
      },
      {
        name: 'assignee',
        label: '办理人',
        type: 'select',
        readSet: { name: 'username', code: 'id' },
        config: { maxTagCount: 1 },
        option: userList || [],
      },
      {
        name: 'startTime',
        label: '发起时间',
        type: 'DatePicker',
      },
      {
        name: 'endTime',
        label: '办理时间',
        type: 'DatePicker',
      },
      {
        name: 'state',
        label: '流程状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { maxTagCount: 1 },
        option: [
          { name: '进行中', code: 'S001_2' },
          { name: '已完成', code: 'S001_3' },
        ],
      },
    ];

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
        title: '流程名称',
        dataIndex: 'processName',
        key: 'processName',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '发起人',
        dataIndex: 'startUserId',
        key: 'startUserId',
        render: text => {
          const _text = userList?.find(item => item.id === text) || {};
          return eutrapelia(_text.username);
        },
      },
      {
        title: '发起时间',
        dataIndex: 'processStartTime',
        key: 'processStartTime',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '办理人',
        dataIndex: 'assignee',
        key: 'assignee',
        ...tableRowConfig,
        sorter: false,
        render: text => {
          return eutrapelia(this.handleColumnsForAssignee(text));
        },
      },
      {
        title: '办理时间',
        dataIndex: 'endTime',
        key: 'endTime',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '流程状态',
        dataIndex: 'state',
        key: 'state',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <div>
            <a style={{ marginRight: 10 }} onClick={() => handleShowTransferHistory(record)}>
              查看
            </a>
            {/* {record?.state === 'S001_3' && (
              <a style={{ marginRight: 10 }} onClick={() => this.handleCanCheck(record)}>
                办理
              </a>
            )} */}
            {String(uesrInfo.id) === record.startUserId && record.stateCode !== 'S001_3' && (
              <a
                style={{ marginRight: 10 }}
                onClick={() => {
                  this.handleUrge(record);
                }}
              >
                催办
              </a>
            )}
          </div>
        ),
      },
    ];
    return (
      <>
        <div style={{ padding: '20px 40px 0px 40px' }}>
          <History
            proCode={proCode}
            proStage={proStage}
            handleStageChange={this.handleStageChange}
          />
        </div>
        <Card title="全部任务">
          <Form {...layout} className={'seachForm2'} onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <CustomFormItem formItemList={formItemData} form={form} />
              <Col span={6} className={'textAlign_r padding_t8 padding_b8 float_r'}>
                <Button type="primary" htmlType="submit" className={'margin_l5 margin_l5'}>
                  查询
                </Button>
                <Button onClick={this.handleReset} className={'margin_l5 margin_r5'}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={nodeTodoTask?.rows || []}
            scroll={{ x: columns.length * 200 - 200 }}
            loading={listLoading}
            pagination={false}
          />
          <Pagination
            style={{ textAlign: 'right', marginTop: 15 }}
            onChange={this.changePage}
            onShowSizeChange={this.changePage}
            total={nodeTodoTask?.total || 0}
            pageSize={pageSize}
            current={pageNum}
            showTotal={total => `共 ${total} 条数据`}
            showSizeChanger
            showQuickJumper
          />
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInfo, productForbulletinBoard, loading }) => ({
        productForInfo,
        productForbulletinBoard,
        listLoading: loading.effects['productForInfo/getNodeTodoTask'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

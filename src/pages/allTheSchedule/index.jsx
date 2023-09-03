import React, { Component } from 'react';
import { Col, Form, message, Pagination, Progress, Row, Tabs, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import CollectionCreateForm from './Circulate';
import { Table } from '@/components';
import List from '@/components/List';
import styles from './index.less';

const { TabPane } = Tabs;
const comColAttr = () => ({
  ellipsis: true,
  render: text => (
    <Tooltip title={text}>
      {text ? text.toString().replace(/null/g, '-') : text === '' || text === undefined ? '-' : 0}
    </Tooltip>
  ),
});

@Form.create()
class Index extends Component {
  state = {
    taskType: this.props.publicTas,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    processKeys: '',
    proCodes: '',
    dataList: [],
    visible: false,
    curTaskId: '',
    columns: [
      {
        title: '主体名称',
        dataIndex: 'subjectName',
        width: 300,
        ...comColAttr(),
      },
      {
        title: '主体代码',
        dataIndex: 'subjectCode',
        width: 120,
        ...comColAttr(),
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        width: 300,
        ...comColAttr(),
      },
      {
        title: '流程类型',
        dataIndex: 'processName',
        width: 300,
        ...comColAttr(),
      },
      {
        title: '截止时间',
        dataIndex: 'taskArrivalTime',
        width: 180,
        ...comColAttr(),
      },
      {
        dataIndex: 'action',
        title: '操作',
        fixed: 'right',
        render: (val, record) => {
          const { taskType } = this.state;
          switch (taskType) {
            case 'T001_3':
            case 'T001_5':
            case 'T001_6':
              return (
                <>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleShowTransferHistory(record)}
                  >
                    流转历史
                  </Button>
                  {taskType === 'T001_3' ? (
                    <Button
                      type="link"
                      size="small" onClick={() => this.handleCirculate(record)}>
                      传阅
                    </Button>
                  ) : null}
                </>
              );
            default:
              return (
                <Button
                  type="link"
                  size="small"
                  // onClick={()=>this.handleJumpToTaskDeal(record)}
                  // 上面这个方法不知道是谁加的，但结果是把原来正常的东西改坏了。
                  // 原本正常的东西请不要乱改，如果要改请改正确，改出来新bug这是什么东东？？？
                  onClick={() => {
                    const params = {
                      taskId: record.taskId,
                      processDefinitionId: record.processDefinitionId,
                      processInstanceId: record.processInstanceId,
                      taskDefinitionKey: record.taskDefinitionKey,
                    };

                    this.props.dispatch({
                      type: 'allTheSchedule/getLinkRouter',
                      payload: params,
                    });
                  }}
                >
                  进入办理
                </Button>
              );
          }
        },
      },
    ],
    confirmLoading: false,
  };

  componentDidMount() {
    // 从首页我待办/已办理/传阅等不同tab 点击更多 进入流程管理对应tab页面
    const tabKey = new URLSearchParams(window.location.search).get('tabKey');
    let taskType;
    if (tabKey === 'handled') {
      taskType = 'T001_5';
    } else if (tabKey === 'transmit') {
      taskType = 'T001_6';
    } else {
      taskType = 'T001_1';
    }
    this.setState(
      {
        taskType,
      },
      () => {
        this.getTableDataList();
      },
    );

    this.getproTypeList();

    const { dispatch } = this.props;
    dispatch({
      type: 'allTheSchedule/getAllProcessNameReq',
    });
    dispatch({
      type: 'allTheSchedule/getAllProductNameReq',
      payload: {
        proStage: '',
        proStatus: '',
        proType: '',
      },
    });
  }

  componentWillUnmount() {

  }

  // 表格数据查询
  getTableDataList = () => {
    const { dispatch } = this.props;
    const { page, limit, taskType, startDate, endDate, processKeys, proCodes } = this.state;
    const params = {
      pageNum: page,
      pageSize: limit,
      taskType,
      startDate,
      endDate,
      processKeys,
      proCodes,
    };
    dispatch({
      type: `allTheSchedule/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows || [],
          oTotal: res.data.total,
        });
      }
    });
  };

  getproTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `allTheSchedule/handlgetproTypeList`,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          dataList: res.data || [],
        });
      }
    });
  };

  // 页码change
  sizeChange = (current, size) => {
    this.setState(
      {
        page: current,
        limit: size,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.setState({ taskType: key, page: 1, limit: 10 }, () => {
      this.getTableDataList();
    });
  };

  /**
   * @method handlerSearch 详细搜索
   */
  handlerSearch = fieldsValue => {
    const { processKeys = '', proCodes = '', date = [] } = fieldsValue || {};
    const startDate = date[0] ? date[0].format('YYYY-MM-DD') : '';
    const endDate = date[1] ? date[1].format('YYYY-MM-DD') : '';
    this.setState(
      {
        startDate,
        endDate,
        processKeys,
        proCodes,
        page: 1,
      },
      () => this.getTableDataList(),
    );
  };

  //重置
  handleReset = () => {
    this.setState(
      {
        startDate: "",
        endDate: "",
        processKeys: "",
        proCodes: "",
        page: 1,
      },
      () => this.getTableDataList(),
    );
  }

  handleClearVal = () => {
    const { taskType } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        startDate: '',
        endDate: '',
        processKeys: '',
        proCodes: '',
        page: 1,
        tableList: [],
        taskType,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  handleJumpToTaskDeal = record => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: {
          taskId: record.taskId,
          processDefinitionId: record.processDefinitionId,
          processInstanceId: record.processInstanceId,
          taskDefinitionKey: record.taskDefinitionKey,
          mode: 'deal',
        },
      }),
    );
  };

  baseTable = () => {
    const { tableList, oTotal, page, columns } = this.state;
    return (
      <>
        <Table
          className={'margin_t16'}
          rowKey={({ taskId }) => `${taskId}`}
          dataSource={tableList}
          columns={columns}
          pagination={false}
          scroll={{ x: columns.length * 220 }}
          loading={this.props.loading}
        />
        {tableList && tableList.length !== 0 ? (
          <Row style={{ paddingTop: 20 }}>
            <Pagination
              style={{ float: 'right' }}
              showSizeChanger
              showQuickJumper={oTotal > 10}
              pageSizeOptions={['10', '20', '30', '40']}
              current={page}
              total={oTotal}
              onShowSizeChange={this.sizeChange}
              onChange={this.sizeChange}
              showTotal={() => `共 ${oTotal} 条数据`}
            />
          </Row>
        ) : null}
      </>
    );
  };

  handleCirculate = ({ processInstanceId = '', taskId = '', subjectCode = '' }) => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      curTaskId: taskId,
    });
    dispatch({
      type: 'allTheSchedule/circulateHistoryUsersReq',
      payload: processInstanceId,
    });
    dispatch({
      type: 'allTheSchedule/authUserInfoReq',
      payload: {
        proCodeList: subjectCode,
      },
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { dispatch } = this.props;
    const { curTaskId } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = values.circulateUser.map(item => ({
        circulateUser: item,
        taskId: curTaskId,
      }));

      this.setState({ confirmLoading: true });
      dispatch({
        type: 'allTheSchedule/circulateTaskBatchReq',
        payload: params,
        callback: res => {
          if (res && res.status === 200) {
            message.success('保存成功~');
            form.resetFields();
            this.setState({ visible: false });
            this.getTableDataList();
          } else {
            message.error(res.message);
          }
          this.setState({ confirmLoading: false });
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  completion = value => {
    if (!value) return '0';
    return parseInt(value * 100, 10);
  };

  render() {
    const {
      allTheSchedule: { processName, productName, authUserInfo, circulateHistoryUsers },
    } = this.props;
    const { taskType, visible, dataList, confirmLoading } = this.state;

    const formItemData = [
      {
        name: 'processKeys',
        label: '流程类型',
        type: 'select',
        readSet: { name: 'processName', code: 'processKey' },
        config: { mode: 'multiple' },
        option: processName,
      },
      {
        name: 'proCodes',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode' },
        config: { mode: 'multiple' },
        option: productName,
      },
      {
        name: 'date',
        label: '截至日期',
        type: 'RangePicker',
      },
    ];

    return (
      <div>
        <List
          title={false}
          formItemData={formItemData}
          advancSearch={fieldsValue => this.handlerSearch(fieldsValue)}
          resetFn={this.handleReset}
          fuzzySearchBool={false}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_5', tab: '已办理' },
              { key: 'T001_6', tab: '传阅' },
            ],
            activeTabKey: taskType,
            onTabChange: this.changeTabs,
          }}
          tableList={
            <>
              <Row className={styles.row}>
                <Col span={6}>
                  <div className={('margin_l0', styles.statistics_col)} style={{ marginLeft: 0 }}>
                    <div className={styles.box}>
                      <p className={'text_575d6c'}>待完成</p>
                      <p>{dataList.upcomingCount}</p>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.statistics_col}>
                    <div className={styles.box}>
                      <p className={'text_575d6c'}>今日已完成</p>
                      <p className={'text_50D4AB'}>{dataList.todayComplateCount}</p>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    className={('margin_r0', styles.statistics_col)}
                    style={{ marginRight: 0, padding: '0 10%' }}
                  >
                    <div className={styles.progress}>
                      <p className={'flex_between'}>
                        <span>完成度</span>
                        <span className={'text_252b3a'}>{this.completion(dataList.complate)}%</span>
                      </p>
                      <Progress
                        percent={parseInt(dataList.complate * 100, 10)}
                        strokeColor="#2450A5"
                        showInfo={false}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              {taskType === 'T001_3' ? (
                <CollectionCreateForm
                  wrappedComponentRef={this.saveFormRef}
                  visible={visible}
                  confirmLoading={confirmLoading}
                  circulateHistoryUsers={circulateHistoryUsers}
                  authUserInfo={authUserInfo}
                  onCancel={this.handleCancel}
                  onCreate={this.handleCreate}
                />
              ) : null}
              {this.baseTable()}
            </>
          }
        />
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  Form.create()(
    connect(({ allTheSchedule, loading, publicModel: { publicTas } }) => ({
      allTheSchedule,
      loading: loading.effects['allTheSchedule/handleTableDataList'],
      publicTas,
    }))(Index),
  ),
);

export default WrappedSingleForm;

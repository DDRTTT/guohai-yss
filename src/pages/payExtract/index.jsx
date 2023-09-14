// 单一投资者资金缴付提取页面
import React, { Component } from 'react';
import { Button, Col, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { cacheHoc, linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

@linkHoc()
@cacheHoc()
@errorBoundary
@connect(({ loading, payExtract, publicModel: { publicTas } }) => ({
  tableLoading: loading.effects['payExtract/queryTableList'],
  publicTas,
  payExtract,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    // 读取缓存的state释放到当前state中
    const recoveryState = props.recoveryState();
    this.state = {
      expand: false,
      taskTypeCode: props.publicTas,
      keyWords: '',
      formValues: {},
      pageSize: 10,
      currentPage: 1,
      selectedRowKeys: [],
      selectRows: [],
      batchList: [],
      isCheckAll: false,
      direction: '',
      field: '',
      ...recoveryState,
      columns: [
        {
          key: 'proName',
          dataIndex: 'proName',
          width: 400,
          title: '产品全称',
          // render: columnTooltip,
          render: (proName, record) => {
            return (
              <Tooltip title={proName}>
                <span>{proName ? proName : '-'}</span>
              </Tooltip>
            );
          },
          ellipsis: true,
          sorter: true,
        },
        {
          key: 'proCode',
          width: 150,
          dataIndex: 'proCode',
          // render: columnTooltip,
          render: (proCode, record) => {
            return (
              <Tooltip title={proCode}>
                <span>{proCode ? proCode : '-'}</span>
              </Tooltip>
            );
          },
          ellipsis: true,
          title: '产品代码',
          sorter: true,
        },
        {
          key: 'proType',
          width: 120,
          dataIndex: 'proType',
          title: '产品类型',
          sorter: true,
          render: (proType, record) => {
            return (
              <Tooltip title={proType}>
                <span>{proType ? proType : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'clientType',
          width: 120,
          dataIndex: 'clientType',
          title: '客户类型',
          sorter: true,
          render: (clientType, record) => {
            return (
              <Tooltip title={clientType}>
                <span>{clientType ? clientType : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'clientName',
          width: 200,
          dataIndex: 'clientName',
          title: '委托人',
          // render: columnTooltip,
          render: (clientName, record) => {
            return (
              <Tooltip title={clientName}>
                <span>{clientName ? clientName : '-'}</span>
              </Tooltip>
            );
          },
          ellipsis: true,
          sorter: true,
        },
        {
          key: 'businessType',
          width: 120,
          align: 'center',
          dataIndex: 'businessType',
          title: '业务类型',
          sorter: true,
          render: (businessType, record) => {
            return (
              <Tooltip title={businessType}>
                <span>{businessType ? businessType : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'amount',
          width: 150,
          align: 'right',
          dataIndex: 'amount',
          title: '确认金额',
          render: (amount, record) => {
            return (
              <Tooltip title={this.numToString(amount)} placement="topLeft">
                <span>{amount ? this.numToString(amount) : amount == 0 ? 0 : '-'}</span>
              </Tooltip>
            );
          },
          ellipsis: true,
          sorter: true,
        },
        {
          key: 'affirmDate',
          width: 120,
          dataIndex: 'affirmDate',
          title: '确认日期',
          sorter: true,
          render: (affirmDate, record) => {
            return (
              <Tooltip title={affirmDate}>
                <span>{affirmDate ? affirmDate : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'taskTime',
          width: 180,
          dataIndex: 'taskTime',
          title: '任务到达时间',
          sorter: true,
          render: (taskTime, record) => {
            return (
              <Tooltip title={taskTime}>
                <span>{taskTime ? taskTime : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'operStatusName',
          dataIndex: 'operStatusName',
          width: 100,
          title: '状态',
          sorter: true,
          render: (operStatusName, record) => {
            return (
              <Tooltip title={operStatusName}>
                <span>{operStatusName ? operStatusName : '-'}</span>
              </Tooltip>
            );
          },
        },
        {
          title: '操作',
          width: 250,
          fixed: 'right',
          key: 'action',
          dataIndex: 'action',
          render: (text, record) => {
            // 待提交 S001_1   流程中S001_2  已结束 S001_3
            const { taskTypeCode } = this.state;
            let content;
            if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
              switch (record.operStatus) {
                case 'S001_1':
                  content = (
                    <>
                      <Action code="payExtract:update-link">
                        <Button onClick={() => this.handleEdit(record)} type="link" size="small">
                          修改
                        </Button>
                      </Action>
                      <Action code="payExtract:copy">
                        <Button onClick={() => this.handleCopy(record)} type="link" size="small">
                          复制
                        </Button>
                      </Action>
                      <Action code="payExtract:commit-link">
                        <Button onClick={() => this.handleCommit(record)} type="link" size="small">
                          提交
                        </Button>
                      </Action>
                      <Action code="payExtract:delete">
                        <Button
                          onClick={() => this.showDeleteConfirm(record)}
                          type="link"
                          size="small"
                        >
                          删除
                        </Button>
                      </Action>
                    </>
                  );
                  break;
                case 'S001_2':
                  content = (
                    <>
                      <Action code="payExtract:handle-link">
                        <Button onClick={() => this.handelBanli(record)} type="link" size="small">
                          办理
                        </Button>
                      </Action>

                      <Action code="payExtract:history">
                        <Button
                          onClick={() => this.handleCirculationHistory(record)}
                          type="link"
                          size="small"
                        >
                          流转历史
                        </Button>
                      </Action>
                      {record.revoke.toString() === '1' ? (
                        <Button
                          onClick={() => this.showRevokeConfirm(record)}
                          type="link"
                          size="small"
                        >
                          撤销
                        </Button>
                      ) : (
                        ''
                      )}

                      <MoreOperation
                        record={record}
                        fn={this.getTableData}
                        opertations={{ tabs: this.state.taskTypeCode, status: record.operStatus }}
                      />
                    </>
                  );
                  break;
                case 'S001_3':
                  content = (
                    <>
                      <Action code="payExtract:detail-link">
                        <Button onClick={() => this.handleDetail(record)} type="link" size="small">
                          详情
                        </Button>
                      </Action>
                      <Action code="payExtract:history">
                        <Button
                          onClick={() => this.handleCirculationHistory(record)}
                          type="link"
                          size="small"
                        >
                          流转历史
                        </Button>
                      </Action>
                    </>
                  );
              }
            } else {
              content = (
                <>
                  <Action code="payExtract:detail-link">
                    <Button onClick={() => this.handleDetail(record)} type="link" size="small">
                      详情
                    </Button>
                  </Action>
                  <Action code="payExtract:history">
                    <Button
                      onClick={() => this.handleCirculationHistory(record)}
                      type="link"
                      size="small"
                    >
                      流转历史
                    </Button>
                  </Action>

                  {this.deleteAndRevokeHtml(record)}
                </>
              );
            }
            return content;
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.initProductName();
    this.initSelectOptions();
    this.initTableData();
  }

  columnTooltip = (text, record) => {
    return (
      <Tooltip title={text} placement="topLeft">
        <span>{text}</span>
      </Tooltip>
    );
  };
  // 数字转带千分位字符串
  numToString = num => {
    let result = num;
    if (num && !isNaN(num)) {
      result = num.toFixed(2).replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
    }
    if (typeof str === 'string') {
      result = num.toLocaleString();
    }
    return result;
  };

  /**
   * 初始化产品名称数据
   * * */
  initProductName = () => {
    this.props.dispatch({
      type: 'payExtract/getProductName',
    });
  };

  /**
   * 初始化表格数据
   */
  initTableData = () => {
    const { dispatch } = this.props;
    const { pageSize, currentPage } = this.state;
    dispatch({
      type: 'payExtract/queryTableList',
      payload: {
        params: {
          keyWords: '',
          pageNum: currentPage,
          pageSize,
          taskTypeCode: this.state.taskTypeCode,
          proType: '',
          operStatus: '',
          proName: '',
          proCode: '',
        },
      },
    });
  };

  /**
   * 初始化下拉框数据
   */
  initSelectOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'payExtract/getDicts',
      payload: { codeList: ['A002', 'S001', 'I009', 'T005'] },
    });
    dispatch({
      type: 'payExtract/getClient',
    });
  };

  /**
   * 发起流程 跳转产品终止模板页面
   */
  initiateProcess = () => {
    this.props.fnLink('payExtract:add', '');
  };

  /**
   * tab bar上的操作按钮
   * @returns {jsx}
   */
  setOperations() {
    const operations = (
      <Action code="payExtract:add">
        <Button type="primary" onClick={this.initiateProcess}>
          发起流程
        </Button>
      </Action>
    );
    return operations;
  }

  /**
   * 切换Tab页签
   * @param key
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.setState(
      {
        taskTypeCode: key,
        currentPage: 1,
        pageSize: 10,
        selectedRowKeys: [],
        isCheckAll: false,
      },
      () => {
        this.handleReset();
      },
    );
  };

  // 查询触发的函数 获取表单中的所有查询条件 然后调用getTableData  请求数据
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const formValues = { ...values };
      formValues.clientType = formValues.clientType ? formValues.clientType.join() : '';
      formValues.businessType = formValues.businessType ? formValues.businessType.join() : '';
      formValues.operStatus = formValues.operStatus ? formValues.operStatus.join() : '';
      formValues.clientName = formValues.clientName ? formValues.clientName.join() : '';
      formValues.proCode = formValues.proCode ? formValues.proCode.join() : '';
      this.setState({ formValues }, () => {
        this.getTableData();
      });
    });
  };
  handlerSearch = fieldsValue => {
    const formValues = { ...fieldsValue };
    formValues.clientType = formValues.clientType ? formValues.clientType.join() : '';
    formValues.businessType = formValues.businessType ? formValues.businessType.join() : '';
    formValues.operStatus = formValues.operStatus ? formValues.operStatus.join() : '';
    formValues.clientName = formValues.clientName ? formValues.clientName.join() : '';
    formValues.proCode = formValues.proCode ? formValues.proCode.join() : '';
    this.setState({ formValues }, () => {
      this.getTableData();
    });
  };

  // 重置
  handleReset = () => {
    this.setState({ formValues: {}, direction: '', field: '', keyWords: '' }, () => {
      this.getTableData();
    });
  };

  /**
   *查询表格数据
   */
  getTableData() {
    const { pageSize, currentPage, taskTypeCode, formValues, direction, field } = this.state;
    const params = {
      keyWords: this.state.keyWords,
      pageNum: currentPage,
      pageSize,
      taskTypeCode,
      direction,
      field,
      ...formValues,
    };
    this.props.dispatch({
      type: 'payExtract/queryTableList',
      payload: {
        params,
      },
    });
  }

  /**
   *
   * @param keyword 关键字 (系列/产品全称、系列号/产品代码)
   */
  changeKeyWords = keywords => {
    this.setState(
      {
        keyWords: keywords,
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   * 每页条数更改
   * @param current 当前页
   * @param size  每页条数
   */
  handleShowSizeChange = (current, size) => {
    this.setState({ currentPage: 1, pageSize: size }, () => {
      this.getTableData();
    });
  };

  /**
   * 页码切换
   * @param page 当前页
   * @param pageSize 每页条数
   */
  handlePageNumChange = page => {
    this.setState({ currentPage: page }, () => this.getTableData());
  };

  /**
   * 全选框点选
   * @param e
   */
  // onChangeCheckAll = e => {
  //   const { dataSource } = this.props.payExtract;
  //   const isCheckAll = e.target.checked;
  //   this.setState({ isCheckAll });
  //   const selectedRowKeys = isCheckAll ? dataSource.rows.map(item => item.taskId) : [];
  //   this.setState({ selectedRowKeys });
  // };

  /**
   *
   * @param selectedRowKeys
   * @param selectRows
   */
  onSelectChange = (selectedRowKeys, selectRows) => {
    const { dataSource } = this.props.payExtract;
    this.setState({
      selectedRowKeys,
      selectRows,
      batchList: selectRows,
    });
    const isCheckAll = dataSource.rows.length === selectedRowKeys.length;
    this.setState({ isCheckAll });
  };

  // /**
  //  * 批量操作
  //  * @method actionButton
  //  */
  // batchOperationComponent = () => {
  //   const { isCheckAll } = this.state;
  //   return (
  //     <>
  //       <Dropdown
  //         overlay={
  //           <Menu>
  //             <Menu.Item key="0" onClick={this.handleBatchAction}>
  //               提交
  //             </Menu.Item>
  //             <Menu.Item key="1" onClick={this.handleBatchAction}>
  //               认领
  //             </Menu.Item>
  //             <Menu.Item key="2" onClick={this.handleBatchAction}>
  //               委托
  //             </Menu.Item>
  //             <Menu.Item key="3" onClick={this.handleBatchAction}>
  //               退回
  //             </Menu.Item>
  //             <Menu.Item key="4" onClick={this.handleBatchAction}>
  //               移交
  //             </Menu.Item>
  //           </Menu>
  //         }
  //         placement="topLeft"
  //       >
  //         <Button style={{ marginRight: 10, width: 100, height: 26 }}>
  //           批量操作
  //           <Icon type="up" />
  //         </Button>
  //       </Dropdown>
  //     </>
  //   );
  // };

  // /**
  //  *
  //  * 批量操作
  //  * @param key
  //  */
  // handleBatchAction = key => {
  //   console.log(key);
  // };

  /**
   * 跳转详情页面
   * * */
  handleDetail(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

  /**
   * 修改跳转
   */
  handleEdit = record => {
    // 跳转前缓存state
    this.props.cacheState(this.state);
    this.props.fnLink(
      'payExtract:update-link',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}`,
    );
  };

  /**
   * 提交跳转
   */
  handleCommit = record => {
    // 跳转前缓存state
    this.props.cacheState(this.state);
    this.props.fnLink(
      'payExtract:commit-link',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}`,
    );
  };

  /**
   * 复制跳转
   */
  handleCopy = record => {
    console.log('record', record);
    this.props.fnLink('payExtract:copy', `?processInstanceId=${record.processInstanceId}`);

    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: `/dynamicPage/pages/单一投资者资金缴付提取/4028e7b676216e1b01763b4a85a5001d/复制?id=${record.id}`,
    //   }),
    // );
  };

  /** 办理
   * @param record
   */
  handelBanli(record) {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      id: record.id,
      proCode: record.proCode,
      mode: 'deal',
    };
    this.props.dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  }

  /**
   * 跳转到流转历史页面
   * * */
  handleCirculationHistory(record) {
    handleShowTransferHistory(record);
  }

  // 产品名称代码格式化大写
  productFilterOption = (input, option) => {
    const label = option.props.children;
    const { value } = option.props;
    return (
      label
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase()) || value.toLowerCase().includes(input.toLowerCase())
    );
  };

  paginationComponent = () => {
    const { pageSize, currentPage } = this.state;
    const { dataSource } = this.props.payExtract;
    return (
      <Pagination
        showSizeChanger
        onShowSizeChange={this.handleShowSizeChange}
        pageSize={pageSize}
        current={currentPage}
        total={dataSource.total}
        onChange={this.handlePageNumChange}
        showQuickJumper
        showTotal={() => `共 ${dataSource.total} 条数据`}
      />
    );
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const { keyWords, currentPage, pageSize, taskTypeCode, formValues } = this.state;
    let { order, field } = sorter;
    field = field !== 'operStatusName' ? field : 'operStatus';
    const params = {
      keyWords,
      pageNum: currentPage,
      pageSize,
      taskTypeCode,
      ...formValues,
      direction: order ? (order === 'descend' ? 'desc' : 'asc') : '',
      field: order ? field : '',
    };
    this.setState({
      direction: order ? (order === 'descend' ? 'desc' : 'asc') : '',
      field: order ? field : '',
    });
    this.props.dispatch({
      type: 'payExtract/queryTableList',
      payload: {
        params,
      },
    });
  };

  revoke(record) {
    const payload = {
      processInstanceId: record.processInstanceId,
    };
    this.props.dispatch({
      type: 'payExtract/revoke',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('撤销成功!');
          this.getTableData();
        } else {
          message.error('撤销失败!');
        }
      },
    });
  }

  /**
   * 删除
   * @param {} record
   */
  deleteTask(record) {
    const payload = record.id;
    this.props.dispatch({
      type: 'payExtract/deleteTask',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('删除成功!');
          this.getTableData();
        } else {
          message.error('删除失败!');
        }
      },
    });
  }

  // 渲染删除或撤销按钮
  deleteAndRevokeHtml(record) {
    // 待提交 S001_1   流程中S001_2  已结束 S001_3
    const deleteHtml = (
      <Action code="payExtract:delete">
        <Button onClick={() => this.showDeleteConfirm(record)} type="link" size="small">
          删除
        </Button>
      </Action>
    );
    const revokeHtml = (
      <Action code="payExtract:revoke">
        <Button onClick={() => this.showRevokeConfirm(record)} type="link" size="small">
          撤销
        </Button>
      </Action>
    );
    let content;
    switch (record.operStatus) {
      case 'S001_1':
        content = deleteHtml;
        break;
      case 'S001_2':
        content = record.revoke.toString() === '1' ? revokeHtml : '';
        break;
      case 'S001_3':
        content = '';
        break;
      default:
    }
    return content;
  }

  showDeleteConfirm(record) {
    const { confirm } = Modal;
    const ts = this;
    confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        ts.deleteTask(record);
      },
    });
  }

  showRevokeConfirm(record) {
    const { confirm } = Modal;
    const ts = this;
    confirm({
      title: '请确认是否撤销?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        ts.revoke(record);
      },
    });
  }

  /**
   * 批量提交
   * @param {*} list
   */
  handlerBatchSubmit = list => {
    const { selectRows } = this.state;
    const ids = selectRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'payExtract/getBatchCommitReq',
        payload: ids,
      })
      .then(() => {
        this.getTableData();
        this.handlerSuccessCallback();
      });
  };
  /**
   * 批量处理接口调用成功以后的回调
   */
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      selectRows: [],
      batchList: [],
    });
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const { dataSource } = this.props.payExtract;
    const { tableLoading } = this.props;
    const { selectedRowKeys, taskTypeCode, batchList, columns } = this.state;

    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const baseTable = () => {
      return (
        <Table
          rowKey="taskId"
          rowSelection={rowSelection}
          dataSource={dataSource.rows}
          columns={columns}
          pagination={false}
          scroll={{ x: 1500 }}
          loading={tableLoading}
          onChange={this.onTableChange}
        />
      );
    };
    const { productName, clientDropList, dicts } = this.props.payExtract;
    // 条件查询配置
    const formItemData = [
      {
        name: 'proCode',
        label: '产品名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productName,
      },
      {
        name: 'clientType',
        label: '客户类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts.I009List,
      },
      {
        name: 'clientName',
        label: '委托人',
        type: 'select',
        readSet: { name: 'clientName', code: 'id' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: clientDropList,
      },
      {
        name: 'businessType',
        label: '业务类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts.T005List,
      },
      {
        name: 'operStatus',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts.S001List,
      },
    ];
    return (
      <>
        <List
          pageCode="payExtract"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchPlaceholder="请输入产品全称/产品代码/委托人"
          fuzzySearch={this.changeKeyWords}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: this.state.taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {this.state.taskTypeCode === 'T001_1' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_3' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_4' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_5' && <> {baseTable()} </>}
              {dataSource.total > 0 ? (
                <Row gutter={24} style={{ marginTop: 15 }}>
                  <Col span={6}>
                    {taskTypeCode && (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') ? (
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'operStatus',
                        }}
                        fn={this.getTableData}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                    ) : null}
                  </Col>
                  <Col offset={4} span={14} style={{ textAlign: 'right' }}>
                    {this.paginationComponent()}
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </>
          }
        />
      </>
    );
  }
}

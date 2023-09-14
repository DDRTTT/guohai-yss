/**
 *定期报告页面  韦卓
 */
import React, { Component } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Icon,
  Menu,
  message,
  Modal,
  Pagination,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;
const ButtonGroup = Button.Group;

const codeList = 'A002,DQ001,S001';

@Form.create()
class RegularReports extends Component {
  state = {
    expand: false, // 判断搜索是否隐藏
    keyWords: '',
    proType: '',
    proName: '',
    proCode: '',
    reportType: '',
    reportPeriodYear: '',
    reportPeriodMonth: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
    taskTypeCode: this.props.publicTas,
    loading: false,
    direction: '',
    field: '',
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    checkedRow: [],
    // paginationProps: {},
    popContent: (
      <ul style={{ margin: 0, padding: 0 }}>
        <li>
          <a> 提交 </a>
        </li>
        <li>
          <a> 认领 </a>
        </li>
        <li>
          <a> 委托 </a>
        </li>
        <li>
          <a> 退回 </a>
        </li>
        <li>
          <a> 移交 </a>
        </li>
        <li>
          <a> 传阅 </a>
        </li>
      </ul>
    ),
    fieldsValue: {},

    // 表头数据(有时间)
    columns: [
      {
        title: '托管行',
        dataIndex: 'proTrusBank',
        key: 'proTrusBank',
        sorter: true,
        width: 200,
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
        title: '标题',
        dataIndex: 'titleMarketingUnit',
        key: 'titleMarketingUnit',
        sorter: true,
        width: 400,
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
        ellipsis: true,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        key: 'taskTime',
        sorter: true,
        width: 180,
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
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        width: 120,
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
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        render: (_, record) => {
          switch (taskTypeCodeData.current) {
            case 'T001_1':
              switch (record.status) {
                case '待提交':
                  return (
                    <div>
                      {handleAddButtonUpdate(record)}
                      {handleAddButtonCopy(record)}
                      {handleAddButtonCommit(record)}
                      {handleAddButtonDelete(record)}
                    </div>
                  );
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonCheck(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                        <span style={{ paddingLeft: '-5px' }}>
                          <MoreOperation record={record} fn={handleGetListData} />
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonCheck(record)}
                      {handleAddButtonTransferHistory(record)}
                      <span style={{ paddingLeft: '-5px' }}>
                        <MoreOperation record={record} fn={handleGetListData} />
                      </span>
                    </div>
                  );

                default:
                  return '';
              }
            case 'T001_3':
              switch (record.status) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );

                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            case 'T001_4':
              return (
                <div>
                  {handleAddButtonUpdate(record)}
                  {handleAddButtonCopy(record)}
                  {handleAddButtonCommit(record)}
                  {handleAddButtonDelete(record)}
                </div>
              );
            case 'T001_5':
              switch (record.status) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );

                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            default:
              return '';
          }
        },
      },
    ],
  };

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   */
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `regularReports/queryCriteria`,
      payload: {
        codeList,
      },
    });
  }

  /**
   * 方法说明 请求列表
   * @method  handleGetTableList
   */
  handleGetTableList() {
    if (
      (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') &&
      this.state.field === ''
    ) {
      this.setState(
        {
          // field: 'taskArriveTime',
          // direction: 'desc'
          field: '',
          direction: '',
        },
        () => {
          this.getTableList();
        },
      );
    } else {
      this.getTableList();
    }
  }

  getTableList = () => {
    const { pageNum, pageSize, taskTypeCode, keyWords, direction, field, fieldsValue } = this.state;
    const { dispatch } = this.props;
    if (fieldsValue.reportingPeriod) {
      fieldsValue.startDate = `${fieldsValue.reportingPeriod[0]._d.getFullYear()}-${Number(
        fieldsValue.reportingPeriod[0]._d.getMonth() + 1,
      )}`;
      fieldsValue.endDate = `${fieldsValue.reportingPeriod[1]._d.getFullYear()}-${Number(
        fieldsValue.reportingPeriod[1]._d.getMonth() + 1,
      )}`;
      delete fieldsValue.reportingPeriod;
    }
    if (field === 'proTypeName') {
      field = 'proType';
    }
    if (field === 'reportTypeName') {
      field = 'reportType';
    }
    if (field === 'reportPeriod') {
      if (direction === 'asc') {
        field = 'reportPeriodYear,reportPeriodMonth';
      }
      if (direction === 'desc') {
        field = 'reportPeriodYear desc,reportPeriodMonth';
      }
    }
    if (field === 'statusName') {
      field = 'status';
    }
    const payload = {
      pageNum,
      pageSize,
      taskTypeCode,
      keyWords,
      direction,
      field,
      ...fieldsValue,
    };
    dispatch({
      type: 'regularReports/searchTableData',
      payload,
    });

    // let paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   current: this.state.pageNum,
    //   total: this.props.regularReports.total,
    //   showTotal: total => `共 ${total} 条数据`,
    //   onChange: page => this.handleSetPage(page),handleGetTableList
    //   onShowSizeChange: (page, size) => this.handleSetPage(page, size),
    // };

    // this.setState(() => ({ paginationProps }));
  };

  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  componentDidMount() {
    this.handleGetTableList();
    this.getDictList();
    this.getProductDropList();
    this.getProductTypeList();
  }

  getProductDropList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'regularReports/getProductDropList',
      payload: {
        proStatus: 'PS001_7',
      },
    });
  }

  getProductTypeList() {
    this.props.dispatch({
      type: 'regularReports/getProductTypeList',
      payload: {},
    });
  }

  /**
   * 条件查询
   * @method searchBtn
   */
  searchBtn = fieldsValue => {
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        fieldsValue: fieldsValue || {},
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 重置
   */
  handleReset = () => {
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        fieldsValue: {},
        field: '',
        direction: '',
        keyWords: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 展开搜索/收起搜索
   */
  toggle = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
      keyWords: '',
      proCode: '',
      proType: '',
      reportType: '',
      endDate: '',
      startDate: '',
      status: '',
    });
    this.props.form.resetFields();
  };

  /**
   * @method 切换tab
   * @param {*} key
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.props.form.resetFields();
    this.setState(
      {
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 操作列 事件
   * @method groupOperate
   * @param record {string} 行元素
   * @param mark {string} 标记
   *
   */
  groupOperate(record, mark) {
    const { dispatch } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.id,
      proCode: record.proCode,
    };
    if (mark === 'copy') {
      this.props.fnLink('regularReports:copy', `?processInstId=${record.processInstanceId}`);
    } else if (mark === 'update') {
      this.props.fnLink(
        'regularReports:update',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'commit') {
      this.props.fnLink(
        'regularReports:commit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'check') {
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'detail') {
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'history') {
      handleShowTransferHistory(record);
    } else if (mark === 'delete') {
      this.handleDelete(record);
    } else if (mark === 'revoke') {
      this.handleCancel(record);
    }
  }

  // 删除
  handleDelete = record => {
    confirm({
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = record.id.split(',');
        this.props.dispatch({
          type: 'regularReports/deleteTable',
          payload,
          callback: res => {
            if (res.status == 200) {
              message.success('删除成功');
              this.getTableList();
            } else {
              message.error(res.message);
            }
          },
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };

  // 撤销
  handleCancel = record => {
    confirm({
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'regularReports/revokeTable',
          payload,
          callback: res => {
            if (res.status == 200) {
              message.success('撤销成功');
              this.getTableList();
            } else {
              message.error(res.message);
            }
          },
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };

  /**
   * @method 新增发起流程
   */
  addProcess = () => {
    this.props.fnLink('regularReports:add', '');
  };

  /**
   * 方法说明 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="regularReports:add">
        <Button
          type="primary"
          onClick={() => {
            this.addProcess();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  /**
   * 批量提交
   */
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'regularReports/commitBatch',
        payload: {
          ids,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.handleGetTableList();
          this.handlerSuccessCallback();
        } else {
          message.error(res.message);
        }
      });
  };

  /**
   * 批量处理接口调用成功以后的回调
   */
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      batchList: [],
    });
  };

  /**
   * @method 改变表格排序
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   */
  changeTable = (pagination, filters, sorter) => {
    this.setState(
      {
        direction: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? sorter.field : '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * 更多
   * @method actionButtonMore
   */
  actionButtonMore = record => {
    return (
      <Dropdown
        overlay={
          <Menu onClick={this.moreGroupButton} style={{ textAlign: 'center' }}>
            {record.operationAuthority &&
              record.operationAuthority.map(operationAuthorityItem => (
                <Menu.Item key={operationAuthorityItem}>{operationAuthorityItem}</Menu.Item>
              ))}
          </Menu>
        }
        trigger={['click']}
      >
        <Button type="link">
          更多
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  };

  /**
   * 更多按钮操作事件
   * @method moreGroupButton
   * */
  moreGroupButton = val => {
    const { key } = val;
    if (key === '认领') {
    } else if (key === '委托') {
    } else if (key === '退回') {
    } else if (key === '移交') {
    } else if (key === '传阅') {
    } else if (key === '撤销') {
    }
  };

  renderColActions = (colActions, text, record) => {
    return (
      <ButtonGroup>
        {colActions.map(btn =>
          btn.text === '更多' ? (
            this.actionButtonMore(record)
          ) : (
            <Action key={`regularReports:${btn.flag}`} code={`regularReports:${btn.flag}`}>
              <Button onClick={() => btn.onClick(record, text)} type="link" size="small">
                {btn.text}
              </Button>
            </Action>
          ),
        )}
      </ButtonGroup>
    );
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { dataList } = this.props.regularReports;
    const tempSelectedRows = [];
    for (let i = 0; i < selectedRowKeys.length; i++) {
      tempSelectedRows.push(dataList[selectedRowKeys[i]]);
    }
    this.setState({
      selectedRowKeys,
      selectedRows: tempSelectedRows,
      batchList: selectedRows,
    });
  };

  /**
   * @method  handleSetPage 切换页数的时候触发
   * @param page 当前页数
   * @param size
   */
  handleSetPage = (page, size) => {
    // page !== this.state.pageNum ? (this.state.pageNum = page) : (this.state.pageSize = size);
    // this.handleGetTableList();
    this.setState(
      {
        pageNum: page,
        pageSize: size,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 列表总条数
   * @param {*} total
   */
  showTotal = total => {
    return `共 ${total} 条数据`;
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      regularReports: {
        dataList,
        productTypeList,
        reportTypeList,
        statusList,
        productDropList,
        total,
      },
    } = this.props;
    const { pageNum, pageSize, taskTypeCode, batchList, columns } = this.state;
    const { loading } = this.props;
    const { TabPane } = Tabs;

    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productDropList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productTypeList,
      },
      {
        name: 'reportType',
        label: '报告类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: reportTypeList,
      },
      {
        name: 'reportingPeriod',
        label: '报告期',
        type: 'RangePicker',
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: statusList,
      },
    ];

    return (
      <>
        <List
          pageCode="regularReports"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskArriveTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.searchBtn}
          resetFn={this.handleReset}
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.seachTableData}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {taskTypeCode === 'T001_1' && (
                <>
                  <Table
                    dataSource={dataList}
                    columns={columns}
                    scroll={{ x: columns.length * 200 }}
                    loading={loading}
                    footer={this.actionButton}
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total !== 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'status',
                        }}
                        fn={this.getTableList}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.handleSetPage}
                        onShowSizeChange={this.handleSetPage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={this.showTotal}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {taskTypeCode === 'T001_3' && (
                <>
                  <Table
                    dataSource={dataList}
                    columns={columns}
                    scroll={{ x: columns.length * 200 }}
                    loading={loading}
                    footer={this.actionButton}
                    // rowSelection={this.rowSelection}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total !== 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.handleSetPage}
                        onShowSizeChange={this.handleSetPage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={this.showTotal}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {taskTypeCode === 'T001_4' && (
                <>
                  <Table
                    dataSource={dataList}
                    columns={columns}
                    scroll={{ x: columns.length * 200 }}
                    loading={loading}
                    footer={this.actionButton}
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total !== 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'status',
                        }}
                        fn={this.getTableList}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.handleSetPage}
                        onShowSizeChange={this.handleSetPage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={this.showTotal}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {taskTypeCode === 'T001_5' && (
                <>
                  <Table
                    dataSource={dataList}
                    columns={columns}
                    scroll={{ x: columns.length * 200 }}
                    loading={loading}
                    footer={this.actionButton}
                    // rowSelection={this.rowSelection}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total !== 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.handleSetPage}
                        onShowSizeChange={this.handleSetPage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={this.showTotal}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </>
          }
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ regularReports, loading, publicModel: { publicTas } }) => ({
        regularReports,
        publicTas,
        loading: loading.effects['regularReports/searchTableData'],
      }))(RegularReports),
    ),
  ),
);
export default WrappedSingleForm;

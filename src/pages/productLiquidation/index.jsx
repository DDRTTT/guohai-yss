// 产品清盘页面
import React, { Component } from 'react';
import { Button, Form, Menu, message, Modal, Pagination, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;
const { TabPane } = Tabs;

@Form.create()
class ProductLiquidation extends Component {
  state = {
    expand: false,
    selectedRowKeys: [],
    selectedRows: [],
    form: {},
    keyWords: '',
    proCodeList: [],
    // proCode: '',
    proTypeList: [],
    statusCodes: [],
    pageNum: 1,
    pageSize: 10,
    taskTypeCode: this.props.publicTas,
    direction: '',
    field: '',
    batchList: [],
    columns: [
      {
        key: 'proName',
        title: '产品全称',
        dataIndex: 'proName',
        sorter: true,
        width: 400,
        render: text => {
          return (
            <Tooltip title={text}>
              <span>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                  ? '-'
                  : 0}
              </span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        key: 'proCode',
        title: '产品代码',
        dataIndex: 'proCode',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proCode => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proTypeName',
        title: '产品类型',
        dataIndex: 'proTypeName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proTypeName => {
          return (
            <Tooltip title={proTypeName}>
              <span>{proTypeName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proEndDate',
        title: '产品终止日期',
        dataIndex: 'proEndDate',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proEndDate => {
          return (
            <Tooltip title={proEndDate}>
              <span>{proEndDate || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'clearReasonName',
        title: '清盘原因',
        dataIndex: 'clearReasonName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: clearReasonName => {
          return (
            <Tooltip title={clearReasonName}>
              <span>{clearReasonName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'clearStartDate',
        title: '清算起始日',
        dataIndex: 'clearStartDate',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: clearStartDate => {
          return (
            <Tooltip title={clearStartDate}>
              <span>{clearStartDate || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'clearAbortDate',
        title: '清算结束日',
        dataIndex: 'clearAbortDate',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: clearAbortDate => {
          return (
            <Tooltip title={clearAbortDate}>
              <span>{clearAbortDate || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'taskTime',
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: taskTime => {
          return (
            <Tooltip title={taskTime}>
              <span>{taskTime || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'statusName',
        title: '状态',
        dataIndex: 'statusName',
        sorter: true,
        width: 200,
        align: 'right',
        ellipsis: {
          showTitle: false,
        },
        render: statusName => {
          return (
            <Tooltip title={statusName}>
              <span>{statusName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'option',
        title: '操作',
        dataIndex: 'option',
        // width: 200,
        fixed: 'right',
        render: (val, record) => {
          const { taskTypeCode } = this.state;
          return (
            <span>
              <Action code="productLiquidation:update">
                <a
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                      record.statusName === '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.updateTable(val, record);
                  }}
                >
                  修改
                </a>
              </Action>
              <Action code="productLiquidation:copy">
                <a
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                      record.statusName === '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.copyTable(val, record);
                  }}
                >
                  复制
                </a>
              </Action>
              <Action code="productLiquidation:commit">
                <a
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                      record.statusName === '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.submitTable(val, record);
                  }}
                >
                  提交
                </a>
              </Action>
              <Action code="productLiquidation:delete">
                <a
                  style={{
                    display: record.statusName === '待提交' ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.deleteTable(val, record);
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="productLiquidation:check">
                <a
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                      record.statusName === '流程中'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.handleTable(val, record);
                  }}
                >
                  办理
                </a>
              </Action>
              <Action code="productLiquidation:detail">
                <a
                  style={{
                    display:
                      ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                        record.statusName === '已结束') ||
                      taskTypeCode === 'T001_3' ||
                      taskTypeCode === 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.lookDetail(val, record);
                  }}
                >
                  详情
                </a>
              </Action>
              <Action code="productLiquidation:history">
                <a
                  style={{
                    display:
                      ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                        record.statusName !== '待提交') ||
                      taskTypeCode === 'T001_3' ||
                      taskTypeCode === 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => handleShowTransferHistory(record)}
                >
                  流转历史
                </a>
              </Action>
              <Action code="productLiquidation:revoke">
                <a
                  style={{
                    display:
                      record.statusName === '流程中' && record.revoke === 1
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.revokeTable(val, record);
                  }}
                >
                  撤销
                </a>
              </Action>
              {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
              {/* <Action code="productLiquidation:more"> */}
              <a
                className="ant-dropdown-link"
                style={{
                  display:
                    (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                    record.statusName === '流程中'
                      ? 'inline-block'
                      : 'none',
                  marginRight: 10,
                }}
                // onClick={e => e.preventDefault()}
              >
                {/* 更多 */}
                <MoreOperation record={record} fn={this.getTableList} />
              </a>
              {/* </Action> */}
              {/* </Dropdown> */}
            </span>
          );
        },
      },
    ],
  };

  /**
   * @method 请求表单下拉选项
   * 'A002' 产品类型, 'P001' 产品备案类型, 'M002' 运作方式,  'R001' 风险等级 'I009' 客户类型 'S001' 状态 'J004_2'托管人
   J006 管理人  暂时取字典  后期从企业信息管理表中获取
   产品归属业务部 投资经理  投资经理暂无字典
   */
  handleGetSelectOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productLiquidation/getDicts',
      payload: { codeList: ['S001'] },
    });

    dispatch({
      type: 'productLiquidation/getProductDropList',
    });
  };

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   *@method 获取产品类型下拉列表
   */
  handleGetProTypeList = () => {
    this.props.dispatch({
      type: 'productLiquidation/getProTypeList',
      payload: {},
    });
  };

  /**
   * @method 生命周期钩子函数
   */
  componentDidMount() {
    this.handleGetSelectOptions();
    this.handleGetProTypeList();
    this.handleGetTableList();
  }

  /**
   * @method 请求表格列表
   */
  handleGetTableList = () => {
    if (
      (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') &&
      this.state.field === ''
    ) {
      this.setState(
        {
          // field: 'taskTime',
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
  };

  getTableList = () => {
    const payload = {
      keyWords: this.state.keyWords,
      proCodeList: this.state.proCodeList,
      // proCode: this.state.proCode,
      proTypeList: this.state.proTypeList,
      statusCodes: this.state.statusCodes,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      taskTypeCode: this.state.taskTypeCode,
      direction: this.state.direction,
      field: this.state.field,
    };
    if (payload.field === 'proTypeName') {
      payload.field = 'proType';
    }
    if (payload.field === 'clearReasonName') {
      payload.field = 'clearReason';
    }
    if (payload.field === 'statusName') {
      payload.field = 'status';
    }
    this.props.dispatch({
      type: 'productLiquidation/getTaskList',
      payload,
    });
  };

  /**
   * @method 修改关键字
   * @param {*} value
   */
  changeKeyWords = value => {
    this.setState(
      {
        keyWords: value,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 查询
   */
  handleSubmit = fieldsValue => {
    const { proCodeList, proTypeList, statusCodes } = fieldsValue || {};
    this.setState(
      {
        proCodeList,
        proTypeList,
        statusCodes,
        pageNum: 1,
        pageSize: 10,
        keyWords: '',
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
        keyWords: '',
        proCodeList: [],
        proTypeList: [],
        statusCodes: [],
        field: '',
        direction: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 切换页码
   * @param {*} page
   * @param {*} pageSize
   */
  changePage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 切换页大小
   * @param {*} current
   * @param pagesize
   */
  changePageSize = (current, pagesize) => {
    this.setState(
      {
        pageNum: current,
        pageSize: pagesize,
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

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
      batchList: selectedRows,
    });
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
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
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
   * @method 更多下拉菜单
   * @param {*} val
   * @param {*} record
   */
  HandleGetMenu = (val, record) => {
    return (
      <Menu onClick={this.moreGroupButton} style={{ textAlign: 'center' }}>
        {record.operationAuthority &&
          record.operationAuthority.map(operationAuthorityItem => (
            <Menu.Item key={operationAuthorityItem}>{operationAuthorityItem}</Menu.Item>
          ))}
      </Menu>
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

  /**
   * @method 新增发起流程
   */
  addProcess = () => {
    this.props.fnLink('productLiquidation:add', '');
  };

  /**
   * @method 发起流程按钮
   */
  setOperations = () => {
    return (
      <Action code="productLiquidation:add">
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
   * 修改
   * @param {*} val
   * @param {*} record
   */
  updateTable(val, record) {
    this.props.fnLink(
      'productLiquidation:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * 复制
   * @param {*} val
   * @param {*} record
   */
  copyTable(val, record) {
    this.props.fnLink('productLiquidation:copy', `?processInstId=${record.processInstanceId}`);
  }

  /**
   * @method 提交
   * @param {*} val
   * @param {*} record
   */
  submitTable(val, record) {
    this.props.fnLink(
      'productLiquidation:commit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * 批量提交
   */
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'productLiquidation/commitBatch',
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
   * @method 详情
   * @param {*} val
   * @param {*} record
   */
  lookDetail(val, record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

  /**
   * @method 办理
   * @param {*} val
   * @param {*} record
   * @params taskId 任务id
   * @params processDefinitionId 流程定义id
   * @params processInstanceId 流程实例id
   * @params taskDefinitionKey 任务定义key
   */
  handleTable(val, record) {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.id,
      proCode: record.proCode,
    };
    this.props.dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  }

  /**
   * @method 流转历史
   * @param {*} val
   * @param {*} record
   */
  historyTable(val, record) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

  /**
   * @method 删除
   * @param {*} val
   * @param {*} record
   */
  deleteTable(val, record) {
    confirm({
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = {
          ids: record.id.split(','),
        };
        this.props.dispatch({
          type: 'productLiquidation/deleteTable',
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
  }

  /**
   * @method 撤销
   * @param {*} val
   * @param {*} record
   */
  revokeTable(val, record) {
    confirm({
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'productLiquidation/revokeTable',
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
  }

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  /**
   * @method 渲染模板
   */
  render() {
    const {
      dataSource,
      total,
      loading,
      dicts,
      proTypeList,
      productDropList,
    } = this.props.productLiquidation;

    const { taskTypeCode, pageNum, pageSize, batchList, columns } = this.state;

    const formItemData = [
      {
        name: 'proCodeList',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productDropList,
      },
      {
        name: 'proTypeList',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: proTypeList,
      },
      {
        name: 'statusCodes',
        label: '任务状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts && dicts.S001List,
      },
    ];

    return (
      <>
        <List
          pageCode="productLiquidation"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handleSubmit}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.changeKeyWords}
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
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 200 }}
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
                        onChange={this.changePage}
                        onShowSizeChange={this.changePageSize}
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
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 100 }}
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
                          textAlign: 'right',
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePageSize}
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
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 100 }}
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
                        onChange={this.changePage}
                        onShowSizeChange={this.changePageSize}
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
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 100 }}
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
                          textAlign: 'right',
                          float: 'right',
                        }}
                        defaultCurrent={pageNum}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePageSize}
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
      connect(({ productLiquidation, publicModel: { publicTas } }) => ({
        productLiquidation,
        publicTas,
      }))(ProductLiquidation),
    ),
  ),
);

export default WrappedSingleForm;

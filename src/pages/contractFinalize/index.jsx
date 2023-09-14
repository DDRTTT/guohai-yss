// 合同定稿  殷爽  合同信息维护页面

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Button, Col, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

/**
 * @method Agent 信披流程 经办人模块
 */

@Form.create()
class Agent extends Component {
  state = {
    // 类别选项
    panes: [
      {
        key: 'T001_1',
        title: '我待办',
        name: 'page1',
      },
      // {
      //   key: 'T001_2',
      //   title: '我参与',
      //   name: 'page2',
      // },
      {
        key: 'T001_3',
        title: '我发起',
        name: 'page3',
      },
      {
        key: 'T001_4',
        title: '未提交',
        name: 'page4',
      },
      {
        key: 'T001_5',
        title: '已办理',
        name: 'page5',
      },
    ],
    // table 表头
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        width: 400,
        sorter: true,
        // render: columnTooltip,
        render: proName => {
          return (
            <Tooltip title={proName}>
              <span>{proName || '-'}</span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        sorter: true,
        // render: columnTooltip,
        render: proCode => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode || '-'}</span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        sorter: true,
        width: 120,
        render: proTypeName => {
          return (
            <Tooltip title={proTypeName}>
              <span>{proTypeName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '投资经理',
        dataIndex: 'investmentManager',
        sorter: true,
        // render: columnTooltip,
        render: investmentManager => {
          return (
            <Tooltip title={investmentManager}>
              <span>{investmentManager ? investmentManager.replace(/null/g, '-') : '-'}</span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '托管人',
        dataIndex: 'proTrusBank',
        sorter: true,
        // render: columnTooltip,
        render: proTrusBank => {
          return (
            <Tooltip title={proTrusBank}>
              <span>{proTrusBank || '-'}</span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '任务到达时间',
        width: 180,
        dataIndex: 'taskTime',
        sorter: true,
        render: taskTime => {
          return (
            <Tooltip title={taskTime}>
              <span>{taskTime || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'operStatusName',
        width: 100,
        sorter: true,
        render: operStatusName => {
          return (
            <Tooltip title={operStatusName}>
              <span>{operStatusName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        width: 250,
        render: (text, record) => {
          // 待提交 S001_1   流程中S001_2  已结束 S001_3
          // 代办 T001_1 未提交 T001_3
          let content;
          if (this.state.params.taskType === 'T001_1' || this.state.params.taskType === 'T001_4') {
            switch (record.operStatus) {
              case 'S001_1':
                content = (
                  <>
                    <Action code="contractFinalize:update-link">
                      <Button onClick={() => this.editTask(record)} type="link" size="small">
                        修改
                      </Button>
                    </Action>
                    <Action code="contractFinalize:commit-link">
                      <Button onClick={() => this.commitTask(record)} type="link" size="small">
                        提交
                      </Button>
                    </Action>
                    <Action code="contractFinalize:delete">
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
                    <Action code="contractFinalize:handle-link">
                      <Button onClick={() => this.handelBanli(record)} type="link" size="small">
                        办理
                      </Button>
                    </Action>
                    <Action code="contractFinalize:history">
                      <Button
                        onClick={() => handleShowTransferHistory(record)}
                        type="link"
                        size="small"
                      >
                        流转历史
                      </Button>
                    </Action>
                    {record.revoke.toString() === '1' ? (
                      <Action code="contractFinalize:revoke">
                        <Button
                          onClick={() => this.showRevokeConfirm(record)}
                          type="link"
                          size="small"
                        >
                          撤销
                        </Button>
                      </Action>
                    ) : (
                      ''
                    )}
                    <MoreOperation
                      record={record}
                      fn={this.handleGetTableList}
                      opertations={{ tabs: this.state.params.taskType, status: record.operStatus }}
                    />
                  </>
                );
                break;
              case 'S001_3':
                content = (
                  <>
                    <Action code="contractFinalize:detail-link">
                      <Button
                        onClick={() => this.detailTask(record, 'processInstanceId')}
                        type="link"
                        size="small"
                      >
                        详情
                      </Button>
                    </Action>
                    <Action code="contractFinalize:history">
                      <Button
                        onClick={() => handleShowTransferHistory(record)}
                        type="link"
                        size="small"
                      >
                        流转历史
                      </Button>
                    </Action>
                  </>
                );
                break;
              default:
                content = <></>;
            }
            return content;
          }
          content = (
            <>
              <Action code="contractFinalize:detail-link">
                <Button onClick={() => this.detailTask(record, 'id')} type="link" size="small">
                  详情
                </Button>
              </Action>
              <Action code="contractFinalize:history">
                <Button onClick={() => handleShowTransferHistory(record)} type="link" size="small">
                  流转历史
                </Button>
              </Action>
              {this.deleteAndRevokeHtml(record)}
            </>
          );
          return content;
        },
      },
    ],
    // table 内容
    tableVal: [],
    // table 选项
    params: {
      pageNum: 1,
      pageSize: 10,
      taskType: this.props.publicTas,
      sortType: '',
      sortField: '',
      keyWords: '',
    },
    // 下方全选checkbox状态
    ischecked: false,
    // checkbox选中
    selectedRows: [],
    // checkbox  key
    selectedRowKeys: [],
    batchList: [],
    // isForm 展开和收起
    isForm: true,
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    // 列表数据请求
    this.handleGetTableList(this.state.params);
    // 产品名称
    this.props.dispatch({
      type: 'contractFinalize/handleGetProductName',
    });
    // 产品类型下拉
    this.props.dispatch({
      type: 'contractFinalize/handleGetProductType',
    });
    // 状态下拉
    this.props.dispatch({
      type: 'contractFinalize/getDicts',
      payload: ['S001'],
    });
    // 托管人
    this.props.dispatch({
      type: 'contractFinalize/handleGetTrustee',
      payload: { orgType: 'J004_2' },
    });
    // 投资经理下拉框
    this.props.dispatch({
      type: 'productReview/getInvestmentManagerDropList',
    });
  }

  /**
   * @method  handleGetTableList 请求table的数据
   */
  async handleGetTableList(payload) {
    await this.props.dispatch({
      type: 'contractFinalize/handleQueryTableData',
      payload,
    });
  }

  /**
   * @method  handleSetPageNum 切换页数的时候触发
   * @param page 当前页数
   */
  handleSetPageNum(page) {
    this.state.params.pageNum = page;
    this.handleGetTableList(this.state.params);
  }

  /**
   * @method  handleSetPageNum 切换条数的时候触发
   */
  handleSetPageSize(...r) {
    this.state.params.pageSize = r[1];
    this.handleGetTableList(this.state.params);
  }

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange = (order, field, sorter) => {
    const { params } = this.state;
    params.sortType = sorter.order;
    params.sortField = sorter.field;
    if (params.sortType === 'ascend') {
      params.sortType = 'ASC';
    } else if (params.sortType === 'descend') {
      params.sortType = 'DESC';
    } else {
      params.sortField = '';
      params.sortType = '';
    }
    this.handleGetTableList(params);
  };

  /**
   * @method handleSetTaskTime 切换类别
   * @param key taskTime值
   */
  handleSetTaskTime = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.state.params.taskType = key;
    this.setState({ taskType: key }, () => this.handleReset());
  };

  /**
   * @method handleOnChecked 全选checkbox触发
   */
  handleOnChecked() {
    // tableVal 是这页面表格的所有数据
    const { tableVal } = this.state;
    // selectedRows 为state中存放的选中的表格行
    const { selectedRows } = this.state;
    if (tableVal.length === selectedRows.length) {
      this.handleRowSelectChange([], []);
    } else {
      // 把索引数组里的值由String转换成Number
      const keys = Object.keys(tableVal);
      const index = [];
      keys.forEach(item => {
        index.push(Number(item));
      });
      this.handleRowSelectChange(index, tableVal);
    }
  }

  /**
   * @method handleRowSelectChange checkbox触发
   * @param {*selectedRowKeys} 序号ID
   * @param {*selectedRows} 选中的行
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { tableVal } = this.state;
    let ischecked = false;
    tableVal.length === selectedRowKeys.length ? (ischecked = true) : (ischecked = false);

    this.setState({
      selectedRowKeys,
      selectedRows,
      ischecked,
      batchList: selectedRows,
    });
  };

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch = val => {
    this.state.params.keyWords = val;
    this.handleGetTableList(this.state.params);
  };

  /**
   * @method handlerSearch 详细搜索
   */
  handlerSearch = fieldsValue => {
    this.state.params.keyWords = '';
    let formValues = {};
    if (fieldsValue) {
      formValues = { ...fieldsValue };
      formValues.proType = formValues.proType ? formValues.proType.join() : '';
      formValues.status = formValues.status ? formValues.status.join() : '';
      formValues.proCode = formValues.proCode ? formValues.proCode.join() : '';
      formValues.proTrusBank = formValues.proTrusBank ? formValues.proTrusBank.join() : '';
      formValues.investmentManager = formValues.investmentManager
        ? formValues.investmentManager.join()
        : '';
    }
    this.setState(
      {
        params: {
          ...this.state.params,
          ...formValues,
        },
      },
      () => {
        this.handleGetTableList(this.state.params);
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        params: {
          pageNum: 1,
          pageSize: 10,
          taskType: this.props.publicTas,
          sortType: '',
          sortField: '',
          keyWords: '',
        },
      },
      () => {
        this.handleGetTableList(this.state.params);
      },
    );
  };

  /**
   * 编辑跳转
   * @method addTask
   * @param type  add/edit 新增还是编辑
   */
  addTask() {
    this.props.fnLink('contractFinalize:add', '');
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/dynamicPage/pages/4028e7b67443dc6e0174571543730012/lifecycle-合同定稿信息录入',
    //   }),
    // );
  }

  /**
   * 跳转合同定稿修改页面
   * * */
  editTask(record) {
    this.props.fnLink(
      'contractFinalize:update-link',
      `?id=${record.id}&proCode=${record.proCode}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * 跳转合同定稿提交页面
   * * */
  commitTask(record) {
    this.props.fnLink(
      'contractFinalize:commit-link',
      `?id=${record.id}&proCode=${record.proCode}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * 跳转合同定稿详情页面
   * * */
  detailTask(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

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
   * 跳转到流转历史
   * * */
  handleCirculationHistory(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`,
      }),
    );
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

  // productFilterOption(input, option) {
  //   let label = option.props.children;
  //   let value = option.props.value;
  //   return label.toLowerCase().includes(input.toLowerCase()) || value.toLowerCase().includes(input.toLowerCase());
  // };
  revoke(record) {
    const payload = {
      processInstanceId: record.processInstanceId,
    };
    this.props.dispatch({
      type: 'contractFinalize/revoke',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('撤销成功');
          this.handleGetTableList(this.state.params);
        } else {
          message.error('撤销失败');
        }
      },
    });
  }

  /**
   * 删除
   * @param {} record
   */
  deleteTask(record) {
    const payload = {
      ids: record.id.split(','),
      processInstanceIds: record.processInstanceId.split(','),
    };
    this.props.dispatch({
      type: 'contractFinalize/deleteTask',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('删除成功!');
          this.handleGetTableList(this.state.params);
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
      <Action code="contractFinalize:delete">
        <Button onClick={() => this.showDeleteConfirm(record)} type="link" size="small">
          删除
        </Button>
      </Action>
    );
    const revokeHtml = (
      <Action code="contractFinalize:revoke">
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
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'contractFinalize/commitBatch',
        payload: {
          ids,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.handleGetTableList(this.state.params);
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

  paginationComponent = () => {
    const { pageSize, pageNum } = this.state.params;
    const { tableList } = this.props.contractFinalize;
    return (
      <Pagination
        showSizeChanger
        onShowSizeChange={(page, size) => this.handleSetPageSize(page, size)}
        pageSize={pageSize}
        current={pageNum}
        total={tableList.total}
        onChange={page => {
          this.handleSetPageNum(page);
        }}
        showQuickJumper
        showTotal={() => `共 ${tableList.total} 条数据`}
      />
    );
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const { selectedRowKeys, columns, batchList } = this.state;
    const { taskType } = this.state.params;
    const {
      contractFinalize: { productName, productType, trustee, opts, loading, tableList },
      productReview: { investmentManagerDropList },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    // 搜索组件配置
    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productName,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productType,
      },
      {
        name: 'investmentManager',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: investmentManagerDropList,
      },
      {
        name: 'proTrusBank',
        label: '托管人',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: trustee,
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: opts.S001,
      },
    ];
    return (
      <>
        <List
          pageCode="contractFinalize"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskType}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.handleBlurSearch}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: taskType,
            onTabChange: this.handleSetTaskTime,
          }}
          extra={
            <Action code="contractFinalize:add">
              <Button type="primary" onClick={() => this.addTask()}>
                发起流程
              </Button>
            </Action>
          }
          tableList={
            <>
              <Table
                pagination={false}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableList.rows}
                scroll={{ x: 1640 }}
                onChange={this.sortChange}
                loading={loading}
              />
              {tableList.total > 0 ? (
                <Row style={{ marginTop: 15 }}>
                  <Col span={6}>
                    {taskType && (taskType === 'T001_1' || taskType === 'T001_4') ? (
                      <MoreOperation
                        batchStyles={{ position: 'relative', left: '12px' }}
                        opertations={{
                          tabs: taskType,
                          statusKey: 'operStatus',
                        }}
                        fn={this.handleGetTableList}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                    ) : null}
                  </Col>
                  <Col span={18} style={{ textAlign: 'right' }}>
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

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ contractFinalize, productReview, loading, publicModel: { publicTas } }) => ({
        contractFinalize,
        productReview,
        publicTas,
        loading: loading.effects['contractFinalize/handleQueryTableData'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

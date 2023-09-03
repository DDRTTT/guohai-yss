// 产品评审页面
import React, { Component } from 'react';
import moment from 'moment';
import { Button, Col, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

@linkHoc()
@errorBoundary
@connect(({ loading, productReview, publicModel: { publicTas } }) => ({
  tableLoading: loading.effects['productReview/queryTableList'],
  productReview,
  publicTas,
}))
@Form.create()
export default class Index extends Component {
  state = {
    expand: false,
    taskTypeCode: this.props.publicTas,
    keyWords: '',
    formValues: {},
    pageSize: 10,
    currentPage: 1,
    selectedRowKeys: [],
    selectRows: [],
    batchList: [],
    isCheckAll: false,
    initLoading: false,
    direction: '',
    field: '',
    columns: [
      {
        key: 'objectLevelName',
        dataIndex: 'objectLevelName',
        title: '对象类型',
        width: 120,
        sorter: true,
        render: objectLevelName => {
          return (
            <Tooltip title={objectLevelName}>
              <span>{objectLevelName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'isReviewName',
        width: 120,
        dataIndex: 'isReviewName',
        title: '是否评审',
        sorter: true,
        render: isReviewName => {
          return (
            <Tooltip title={isReviewName}>
              <span>{isReviewName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proName',
        dataIndex: 'proName',// 实际含义：系列展示全称，产品展示简称
        width: 220,
        title: '系列/产品简称',
        ellipsis: true,
        sorter: true,
        render: proName => {
          return (
            <Tooltip title={proName}>
              <span>{proName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        dataIndex: 'proCode',
        width: 160,
        title: '系列号/产品代码',
        ellipsis: true,
        sorter: true,
        render: proCode => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'assetTypeName',
        width: 120,
        dataIndex: 'assetTypeName',
        title: '产品类型',
        sorter: true,
        render: assetTypeName => {
          return (
            <Tooltip title={assetTypeName}>
              <span>{assetTypeName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'investManagerNames',
        dataIndex: 'investManagerNames',
        width: 200,
        ellipsis: true,
        title: '投资经理',
        sorter: true,
        render: investManagerNames => {
          return (
            <Tooltip title={investManagerNames}>
              <span>{investManagerNames ? investManagerNames.replace(/null/g, '-') : '-'}</span>
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
        render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        width: 150,
        sorter: true,
        render: status => {
          return (
            <Tooltip title={status}>
              <span>{status || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        width: 280,
        align: 'center',
        render: (text, record) => {
          // 待提交 S001_1   流程中S001_2  已结束 S001_3
          const { taskTypeCode } = this.state;
          let content;
          if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
            switch (record.checked) {
              case 'S001_1':
                content = (
                  <>
                    <Action code="productReview:update-link">
                      <Button onClick={() => this.handleEdit(record)} type="link" size="small">
                        修改
                      </Button>
                    </Action>
                    <Action code="productReview:copy">
                      <Button onClick={() => this.handleCopy(record)} type="link" size="small">
                        复制
                      </Button>
                    </Action>
                    <Action code="productReview:commit-link">
                      <Button onClick={() => this.handleCommit(record)} type="link" size="small">
                        提交
                      </Button>
                    </Action>
                    <Action code="productReview:delete">
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
                    <Action code="productReview:handle-link">
                      <Button onClick={() => this.handelBanli(record)} type="link" size="small">
                        办理
                      </Button>
                    </Action>
                    <Action code="productReview:history">
                      <Button
                        onClick={() => this.handleCirculationHistory(record)}
                        type="link"
                        size="small"
                      >
                        流转历史
                      </Button>
                    </Action>
                    {record.revoke.toString() === '1' ? (
                      <>
                        <Action code="productReview:revoke">
                          <Button
                            onClick={() => this.showRevokeConfirm(record)}
                            type="link"
                            size="small"
                          >
                            撤销
                          </Button>
                        </Action>
                      </>
                    ) : (
                      ''
                    )}
                    <MoreOperation
                      record={record}
                      fn={this.getTableData}
                      opertations={{ tabs: this.state.taskTypeCode, status: record.checked }}
                    />
                  </>
                );
                break;
              case 'S001_3':
                content = (
                  <>
                    <Action code="productReview:detail-link">
                      <Button
                        onClick={() => {
                          this.handleDetail(record);
                        }}
                        type="link"
                        size="small"
                      >
                        详情
                      </Button>
                    </Action>
                    <Action code="productReview:history">
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
                break;
              default:
            }
          } else {
            content = (
              <>
                <Action code="productReview:detail-link">
                  <Button onClick={() => this.handleDetail(record)} type="link" size="small">
                    详情
                  </Button>
                </Action>
                <Action code="productReview:history">
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

  componentDidMount() {
    this.initSelectOptions();
    // 配合后端延迟刷新列表
    this.setState({
      initLoading: true,
    });
    setTimeout(() => {
      this.initTableData();
    }, 3000);
  }

  /**
   * 初始化表格数据
   */
  initTableData = () => {
    const { dispatch } = this.props;
    const { pageSize, currentPage } = this.state;
    dispatch({
      type: 'productReview/queryTableList',
      payload: {
        params: {
          keyWords: '',
          pageNum: currentPage,
          pageSize,
          taskTypeCode: this.state.taskTypeCode,
          proType: '',
          investmentManager: '',
          objectLevel: '',
          isReview: '',
          status: '',
          proName: '',
          proCode: [],
        },
      },
      callback: () => {
        this.setState({
          initLoading: false,
        });
      },
    });
  };

  /**
   * 初始化下拉框数据
   */
  initSelectOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productReview/getDicts',
      // 'A002' 产品类型, 'P001' 产品备案类型, 'M002' 运作方式,  'R001' 风险等级 'I009' 客户类型
      payload: { codeList: ['A002', 'S001'] },
    });
    // 产品类型下拉框
    dispatch({
      type: 'productReview/getProTypeDropList',
    });
    // 产品全称下拉框
    dispatch({
      type: 'productReview/getProductDropList',
    });
    // 投资经理下拉框
    dispatch({
      type: 'productReview/getInvestmentManagerDropList',
    });
  };

  /**
   * 新增按钮跳转
   */
  handleAdd = () => {
    this.props.fnLink('productReview:add', '');
  };

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
      },
      () => {
        this.handleReset();
      },
    );
  };

  // 查询触发的函数 获取表单中的所有查询条件 然后调用getTableData  请求数据
  handlerSearch = fieldsValue => {
    if (this.props.tableLoading) return;
    const formValues = { ...fieldsValue };
    formValues.proType = formValues.proType ? formValues.proType.join() : '';
    formValues.investmentManager = formValues.investmentManager
      ? formValues.investmentManager.join()
      : '';
    formValues.status = formValues.status ? formValues.status.join() : '';
    this.setState({ formValues, keyWords: '', currentPage: 1, pageSize: 10 }, () =>
      this.getTableData(),
    );
  };

  /**
   * 搜索条件置空
   */
  handleReset = () => {
    this.setState(
      {
        formValues: {},
        direction: '',
        currentPage: 1,
        pageSize: 10,
        field: '',
        selectedRowKeys: [],
        isCheckAll: false,
        keyWords: '',
      },
      () => this.getTableData(),
    );
  };

  /**
   *查询表格数据
   */
  getTableData = () => {
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
      type: 'productReview/queryTableList',
      payload: {
        params,
      },
    });
  }

  /**
   * 展开搜索 切换
   */
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand, keyWords: '', formValues: {} });
  };

  /**
   *
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
   *
   * @param keywords {string} 关键字 (系列/产品全称、系列号/产品代码)
   */
  changeKeyWords = keywords => {
    this.setState(
      {
        keyWords: keywords,
        currentPage: 1,
        pageSize: 10,
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
   */
  handlePageNumChange = page => {
    this.setState({ currentPage: page }, () => this.getTableData());
  };

  /**
   * 全选框点选
   * @param e
   */
  // onChangeCheckAll = e => {
  //   const { taskListTable } = this.props.productReview;
  //   const isCheckAll = e.target.checked;
  //   this.setState({ isCheckAll });
  //   const selectedRowKeys = isCheckAll ? taskListTable.rows.map((item, index) => index) : [];
  //   this.setState({ selectedRowKeys });
  // };

  /**
   *
   * @param selectedRowKeys
   * @param selectRows
   */
  onSelectChange = (selectedRowKeys, selectRows) => {
    const { taskListTable } = this.props.productReview;
    this.setState({
      selectedRowKeys,
      selectRows,
      batchList: selectRows,
    });
    const isCheckAll = taskListTable.rows.length === selectedRowKeys.length;
    this.setState({ isCheckAll });
  };
  /**
   * 修改跳转
   */
  handleEdit = record => {
    this.props.fnLink(
      'productReview:update-link',
      `?proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&code=${record.proCode}`,
    );
  };
  /**
   * 提交跳转
   */
  handleCommit = record => {
    this.props.fnLink(
      'productReview:commit-link',
      `?proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&code=${record.proCode}`,
    );
  };

  /**
   * 复制跳转
   */
  handleCopy = record => {
    this.props.fnLink('productReview:copy', `?code=${record.proCode}`);

    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: `/dynamicPage/pages/产品评审/4028e7b676216e1b01763b45899a001c/复制?&code=${record.proCode}`,
    //   }),
    // );
  };

  /**
   * 详情跳转
   */
  handleDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  };

  /**
   * 跳转到流转历史
   * * */
  handleCirculationHistory(record) {
    handleShowTransferHistory(record);
  }

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
    const { taskListTable } = this.props.productReview;
    return (
      <Pagination
        showSizeChanger
        onShowSizeChange={this.handleShowSizeChange}
        pageSize={pageSize}
        current={currentPage}
        total={taskListTable.total}
        onChange={this.handlePageNumChange}
        showQuickJumper
        showTotal={() => `共 ${taskListTable.total} 条数据`}
      />
    );
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const { order, field } = sorter;
    this.setState(
      {
        direction: order ? (order === 'descend' ? 'desc' : 'asc') : '',
        field: order ? field : '',
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   * 撤销
   * @param {*} record
   */
  revoke(record) {
    const payload = {
      processInstanceId: record.processInstanceId,
    };
    this.props.dispatch({
      type: 'productReview/revoke',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('撤销成功');
          this.getTableData();
        } else {
          message.error(res.message);
        }
      },
    });
  }

  /**
   * 删除
   * @param {} record
   */
  deleteTask(record) {
    const payload = [record.proCode];
    this.props.dispatch({
      type: 'productReview/deleteTask',
      payload,
      callback: res => {
        if (res.status == 200) {
          message.success('删除成功');
          this.getTableData();
        } else {
          message.error(res.message);
        }
      },
    });
  }

  // 渲染删除或撤销按钮
  deleteAndRevokeHtml(record) {
    // 待提交 S001_1   流程中S001_2  已结束 S001_3
    const deleteHtml = (
      <Action code="productReview:delete">
        <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
      </Action>
    );
    const revokeHtml = (
      <Action code="productReview:revoke">
        <a
          onClick={() => {
            this.showRevokeConfirm(record);
          }}
        >
          撤销
        </a>
      </Action>
    );
    let content;
    switch (record.checked) {
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
   */
  handlerBatchSubmit = () => {
    const { selectRows } = this.state;
    const proCodes = selectRows.map(item => item.proCode);
    this.props
      .dispatch({
        type: 'productReview/getBatchSubmitByProCodeReq',
        payload: proCodes,
      })
      .then(res => {
        if (res && res.status === 200) {
          this.getTableData();
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
      selectRows: [],
      batchList: [],
    });
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  /**
   * 表格内容溢出渲染函数
   */
  render() {
    const { taskListTable } = this.props.productReview;
    const { tableLoading } = this.props;
    const { selectedRowKeys, taskTypeCode, batchList, columns } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const baseTable = () => {
      return (
        <Table
          rowSelection={rowSelection}
          dataSource={taskListTable.rows}
          columns={columns}
          scroll={{ x: true }}
          loading={tableLoading || this.state.initLoading}
          pagination={false}
          onChange={this.onTableChange}
        />
      );
    };
    const {
      dicts,
      proTypeDropList,
      productDropList,
      investmentManagerDropList,
    } = this.props.productReview;
    // 搜索组件配置
    const formItemData = [
      {
        name: 'objectLevel',
        label: '对象类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: '系列', code: '0' },
          { name: '产品', code: '1' },
        ],
      },
      {
        name: 'isReview',
        label: '是否评审',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: '是', code: '1' },
          { name: '否', code: '0' },
        ],
      },
      {
        name: 'proCode',
        label: '系列/产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productDropList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple' },
        option: proTypeDropList,
      },
      {
        name: 'investmentManager',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo' },
        config: { mode: 'multiple' },
        option: investmentManagerDropList,
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: dicts.S001List,
      },
    ];
    return (
      <>
        <List
          pageCode="productReview"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入系列/产品全称/系列号/产品代码"
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
          extra={
            <Action code="productReview:add">
              <Button type="primary" onClick={this.handleAdd}>
                发起流程
              </Button>
            </Action>
          }
          tableList={
            <>
              {baseTable()}
              {taskListTable.total > 0 ? (
                <Row style={{ marginTop: 15 }}>
                  <Col span={6}>
                    {taskTypeCode && (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') ? (
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'checked',
                        }}
                        fn={this.getTableData}
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

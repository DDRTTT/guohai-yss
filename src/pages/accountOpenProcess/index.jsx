/**
 * 账户开户/变更流程  账户信息维护页面
 */
import React, { Component } from 'react';
import { Button, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import MoreOperation from '@/components/moreOperation';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import moment from 'moment';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const codeList = 'A001, A003, S001';

@Form.create()
class Index extends Component {
  componentDidMount() {
    this.getTableData();
    this.getAccountList();
    this.getProductList();
    this.getDictList();
    this.getNodeList();
  }

  /**
   * 方法说明 获取任务节点下拉
   * @method  getNodeList
   */
  getNodeList() {
    const { dispatch } = this.props;
    dispatch({
      type: `accountOpenProcess/getNodeList`,
      payload: {
        codeList,
      },
    });
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   */
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `accountOpenProcess/queryCriteria`,
      payload: {
        codeList,
      },
    });
  }

  /**
   * 方法说明 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="accountOpenProcess:link">
        <Button
          type="primary"
          onClick={() => {
            this.accountAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  /**
   * 方法说明 tab切换
   * @method  changeTabs
   * @param key {string}
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.setState({ taskTypeCode: key });
    this.handleReset();
  };

  accountAdd = () => {
    this.props.fnLink('accountOpenProcess:link', '');
  };

  // 删除参数中的空值选项
  deleteEmptyParam(value) {
    for (const key in value) {
      if (
        value[key] === '' ||
        value[key] === null ||
        value[key] === undefined ||
        value[key] === [] ||
        value[key].length === 0
      ) {
        delete value[key];
      }
    }
  }

  /**
   * 方法说明 表格数据查询
   * @method getTableData
   */
  getTableData() {
    const { dispatch } = this.props;
    const { direct, oField, page, limit, taskTypeCode, searchFormData, keyWords } = this.state;
    this.setState({
      loading: true,
    });
    const params = {
      pageNum: page,
      pageSize: limit,
      direction: direct,
      field: oField,
      taskTypeCode,
      keyWords: keyWords,
      ...searchFormData,
    };
    if (params.direction === 'ascend') {
      params.direction = 'asc';
    } else if (params.direction === 'descend') {
      params.direction = 'desc';
    } else {
      params.direction = '';
      params.field = '';
    }
    this.deleteEmptyParam(params);
    dispatch({
      type: `accountOpenProcess/queryTableData`,
      payload: params,
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res !== undefined) {
        res?.data?.rows?.forEach(item => {
          if (item.taskTime !== undefined) {
            item.taskTime = moment(item?.taskTime).format('YYYY-MM-DD HH:mm:ss');
          }
        });
        this.setState({
          tableList: res?.data?.rows,
          oTotal: res?.data?.total,
        });
      }
    });
  }

  /**
   * 方法说明  排序change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param filters
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order,
        oField: sorter.field,
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
  sizeChange = (current, size) => {
    this.setState(
      {
        page: 1,
        limit: size,
      },
      () => {
        this.getTableData();
      },
    );
  };

  // 页码change
  pageChange = (current, size) => {
    this.setState(
      {
        page: current,
        limit: size,
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param val {string} 关键字
   */
  keyWordsSearch = val => {
    const { dispatch } = this.props;
    this.setState({ page: 1, keyWords: val });
    const params = {
      pageNum: 1,
      pageSize: 10,
      taskTypeCode: this.state.taskTypeCode,
      keyWords: val,
    };
    dispatch({
      type: `accountOpenProcess/queryTableData`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
        });
      }
    });
  };

  seachTableData = val => {
    this.keyWordsSearch(val);
  };

  /**
   * 方法说明 帐户列表查询
   * @method getAccountList
   */
  getAccountList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `accountOpenProcess/queryAccountList`,
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `accountOpenProcess/queryProductList`,
    });
  };

  // 产品全称产品code大写
  productFilterOption = (input, option) => {
    const label = option.props.children;
    const { value } = option.props;
    return (
      label
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      value
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase())
    );
  };

  /**
   * 条件查询
   * @method searchBtn
   */

  handlerSearch = fieldsValue => {
    this.setState(
      {
        searchFormData: fieldsValue,
        page: 1,
        keyWords: '',
      },
      () => {
        this.getTableData();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        searchFormData: {},
        page: 1,
        direct: '',
        oField: '',
        keyWords: '',
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   *
   * 批量复核事件
   * @method recheck
   */
  recheck = () => {
    const idArr = [];
    this.state.selectedRows.forEach(item => {
      if (item.id !== undefined) {
        idArr.push(item.id);
      }
    });
  };
  // /**
  //  * 批量操作
  //  * @method actionButton
  //  */
  // actionButton = () => {
  //   return (
  //     <Dropdown
  //       overlay={
  //         <Menu>
  //           <Menu.Item key="0">提交</Menu.Item>
  //           <Menu.Item key="1">认领</Menu.Item>
  //           <Menu.Item key="2">委托</Menu.Item>
  //           <Menu.Item key="3">退回</Menu.Item>
  //           <Menu.Item key="4">移交</Menu.Item>
  //         </Menu>
  //       }
  //       placement="topLeft"
  //     >
  //       <Button style={{ marginRight: 10, width: 100, height: 26 }}>
  //         批量操作
  //         <Icon type="up" />
  //       </Button>
  //     </Dropdown>
  //   );
  // };

  /**
   * @method renderColActions
   */
  renderColActions = (colActions, text, record) => {
    return (
      <ButtonGroup>
        {colActions &&
          colActions.map(btn =>
            btn.text === '更多' ? (
              <MoreOperation
                record={record}
                fn={this.getTableData}
                opertations={{ tabs: this.state.taskTypeCode, status: record.statusCode }}
              />
            ) : (
                <Action
                  key={`accountOpenProcess:${btn.flag}`}
                  code={`accountOpenProcess:${btn.flag}`}
                >
                  <Button onClick={() => btn.onClick(record)} type="link" size="small">
                    {btn.text}
                  </Button>
                </Action>
              ),
          )}
      </ButtonGroup>
    );
  };

  state = {
    taskTypeCode: this.props.publicTas,
    isOpenFrame: false,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    loading: false,
    // checkedArr: [],
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    searchFormData: {},
    keyWords: '',
    columns: [
      {
        key: 'businessTypeName',
        dataIndex: 'businessTypeName',
        title: '业务类型',
        width: 120,
        sorter: true,
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
        key: 'accountTypeName',
        dataIndex: 'accountTypeName',
        title: '账户类型',
        width: 120,
        sorter: true,
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
        key: 'accountName',
        dataIndex: 'accountName',
        title: '账户名称',
        sorter: true,
        width: 200,
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
        key: 'proName',
        dataIndex: 'proName',
        title: '产品全称',
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
        key: 'proCode',
        dataIndex: 'proCode',
        title: '产品代码',
        width: 150,
        sorter: true,
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
        key: 'accountStatus',
        dataIndex: 'accountStatus',
        title: '账户状态',
        width: 120,
        sorter: true,
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
        key: 'needRecord',
        dataIndex: 'needRecord',
        title: '是否需要备案',
        width: 150,
        sorter: true,
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
        key: 'taskName',
        dataIndex: 'taskName',
        title: '任务名称',
        width: 200,
        sorter: true,
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
        key: 'taskTime',
        dataIndex: 'taskTime',
        title: '任务到达时间',
        width: 180,
        sorter: true,
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
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        width: 100,
        sorter: true,
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
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        width: 240,
        render: (text, record) => {
          const columnTooltip = (text, record) => {
            return (
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            );
          };
          const editBtn = {
            text: '修改',
            flag: 'edit',
            onClick: record => this.groupOperate(record, 'edit'),
          };
          // const copyBtn = {
          //   text: '复制',
          //   flag: 'copy',
          //   onClick: record => this.groupOperate(record, 'copy'),
          // };
          const submitBtn = {
            text: '提交',
            flag: 'submit',
            onClick: record => this.groupOperate(record, 'submit'),
          };
          const deleteBtn = {
            text: '删除',
            flag: 'delete',
            onClick: record => this.groupOperate(record, 'delete'),
          };
          const handleBtn = {
            text: '办理',
            flag: 'handle',
            onClick: record => this.groupOperate(record, 'handle'),
          };
          const historyBtn = {
            text: '流转历史',
            flag: 'history',
            // onClick: record => this.groupOperate(record, 'history'),
            onClick: record => handleShowTransferHistory(record),
          };
          const cancelBtn = {
            text: '撤销',
            flag: 'cancel',
            onClick: record => this.groupOperate(record, 'cancel'),
          };
          const viewBtn = {
            text: '详情',
            flag: 'view',
            onClick: record => this.groupOperate(record, 'view'),
          };
          const moreBtn = {
            text: '更多',
            onClick: record => this.groupOperate(record, 'more'),
          };
          const { taskTypeCode } = this.state;
          let content;
          if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
            switch (record.statusCode) {
              case 'S001_1':
                content = [editBtn, submitBtn, deleteBtn];
                break;
              case 'S001_2':
                content = [handleBtn, historyBtn];
                if (record.revoke.toString() === '1') content.push(cancelBtn);
                content.push(moreBtn);
                break;
              case 'S001_3':
                content = [viewBtn, historyBtn];
                break;
            }
          } else {
            switch (record.statusCode) {
              case 'S001_1':
                content = [viewBtn, historyBtn];
                break;
              case 'S001_2':
                content = [viewBtn, historyBtn];
                if (record.revoke.toString() === '1') content.push(cancelBtn);
                break;
              case 'S001_3':
                content = [viewBtn, historyBtn];
                break;
            }
          }
          return this.renderColActions(content, text, record);
        },
      },
    ],
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
      id: record.id,
      proCode: record.proCode,
    };
    if (mark === 'edit') {
      this.props.fnLink(
        'accountOpenProcess:edit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'handle') {
      params.mode = 'deal';
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'history') {
      //   console.log('流转历史');
      console.log('流转历史-------record:', record);
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'more') {
      //   console.log('更多');
    } else if (mark === 'submit') {
      this.openSubmitModal(record);
    } else if (mark === 'view') {
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'cancel') {
      this.showRevokeConfirm(record);
    } else if (mark === 'delete') {
      this.showDeleteConfirm(record);
    } else if (mark === 'copy') {
      this.props.fnLink('accountOpenProcess:copy', `?processInstId=${record.processInstanceId}`);
      // this.props.dispatch(
      //   routerRedux.push({
      //     pathname: `/dynamicPage/pages/账户信息管理/4028e7b676216e1b01763b4d06f5001e/复制?processInstId=${record.processInstanceId}`,
      //   }),
      // );
    }
  }

  /**
   * 提交
   * @method openSubmitModal
   */

  openSubmitModal = record => {
    this.props.fnLink(
      'accountOpenProcess:submit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  revoke(record) {
    const payload = record.processInstanceId;
    this.props.dispatch({
      type: 'accountOpenProcess/revoke',
      payload,
      callback: res => {
        console.log('res', res);
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
  deleteTask = record => {
    const payload = [record.id];
    this.props.dispatch({
      type: 'accountOpenProcess/deleteTask',
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
  };

  showDeleteConfirm = record => {
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
  };

  showRevokeConfirm = record => {
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
  };

  /**
   * 批量提交
   */
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'accountOpenProcess/getCommitBatch',
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
      selectedRows: [],
      batchList: [],
    });
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

  callBackHandler = value => {
    this.setState({
      columns: value,
    });
  };

  render() {
    const {
      tableList,
      oTotal,
      page,
      limit,
      loading,
      taskTypeCode,
      selectedRowKeys,
      batchList,
      columns,
    } = this.state;

    const baseTable = () => {
      return (
        <>
          <Table
            // rowSelection={rowSelection}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            dataSource={tableList}
            columns={columns}
            pagination={false}
            onChange={this.handleTableChange}
            loading={loading}
            scroll={{ x: 1990 }}
          />
          {tableList && tableList.length !== 0 ? (
            <Row style={{ paddingTop: 20 }}>
              <Pagination
                style={{ float: 'right' }}
                showSizeChanger
                showQuickJumper={oTotal > limit}
                pageSizeOptions={['10', '20', '30', '40']}
                current={page}
                total={oTotal}
                onShowSizeChange={this.sizeChange}
                onChange={this.pageChange}
                showTotal={() => `共 ${oTotal} 条数据`}
              />
              <MoreOperation
                batchStyles={{ position: 'relative' }}
                opertations={{
                  tabs: taskTypeCode,
                  statusKey: 'statusCode',
                }}
                fn={this.getTableData}
                type="batch"
                batchList={batchList}
                submitCallback={this.handlerBatchSubmit}
                successCallback={this.handlerSuccessCallback}
              />
            </Row>
          ) : (
              ''
            )}
        </>
      );
    };
    const {
      accountOpenProcess: {
        accountTypeList,
        processStateList,
        productList,
        accountStatusList,
        nodeList,
      },
    } = this.props;
    const formItemData = [
      {
        name: 'accountType',
        label: '账户类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: accountTypeList,
      },
      {
        name: 'accountName',
        label: '账户名称',
        type: 'input',
      },
      {
        name: 'productCodes',
        label: '产品名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productList,
      },
      {
        name: 'accountStatus',
        label: '账户状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: accountStatusList,
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: processStateList,
      },
      {
        name: 'taskDefinitionKeys',
        label: '任务节点',
        type: 'select',
        readSet: { name: 'nodeName', code: 'nodeId' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: nodeList,
      },
    ];
    return (
      <>
        <List
          pageCode="accountOpenProcess"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          searchInputWidth="300"
          resetFn={this.handleReset}
          searchPlaceholder="请输入账户名称/产品全称/产品代码"
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
          extra={
            <Action code="accountOpenProcess:link">
              <Button type="primary" onClick={() => this.accountAdd()}>
                发起流程
              </Button>
            </Action>
          }
          tableList={baseTable()}
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ accountOpenProcess, loading, publicModel: { publicTas } }) => ({
        accountOpenProcess,
        loading: loading.effects['accountOpenProcess/queryTableData'],
        publicTas,
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

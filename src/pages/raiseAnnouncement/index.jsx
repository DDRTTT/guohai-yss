// 募集公告页面
import React, { Component } from 'react';
import { Button, Form, Input, Menu, message, Modal, Pagination, Select, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;

@Form.create()
class RaiseAnnouncement extends Component {
  state = {
    expand: false,
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    form: {},
    keyWords: '',
    proName: '',
    proCode: '',
    proType: '',
    investmentManager: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
    taskType: this.props.publicTas,
    sortType: '',
    sortField: '',
    columns: [
      {
        key: 'proFname',
        title: '产品简称',
        dataIndex: 'proFname',
        sorter: true,
        width: 300,
        ellipsis: {
          showTitle: false,
        },
        render: (proFname, record) => {
          return (
            <Tooltip title={proFname}>
              <span>{proFname ? proFname : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: '产品代码',
        dataIndex: 'proCode',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (proCode, record) => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode ? proCode : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proTypeName',
        title: '产品类型',
        dataIndex: 'proTypeName',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (proTypeName, record) => {
          return (
            <Tooltip title={proTypeName}>
              <span>{proTypeName ? proTypeName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'investmentManager',
        title: '投资经理',
        dataIndex: 'investmentManager',
        sorter: true,
        width: 250,
        ellipsis: {
          showTitle: false,
        },
        render: (investmentManager, record) => {
          return (
            <Tooltip title={investmentManager}>
              <span>{investmentManager ? investmentManager.replace(/null/g, '-') : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'raiseSdate',
        title: '募集开始日',
        dataIndex: 'raiseSdate',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (raiseSdate, record) => {
          return (
            <Tooltip title={raiseSdate}>
              <span>{raiseSdate ? raiseSdate : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'raiseEdateExpect',
        title: '募集计划结束日',
        dataIndex: 'raiseEdateExpect',
        sorter: true,
        width: 180,
        ellipsis: {
          showTitle: false,
        },
        render: (raiseEdateExpect, record) => {
          return (
            <Tooltip title={raiseEdateExpect}>
              <span>{raiseEdateExpect ? raiseEdateExpect : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'taskTime',
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        width: 180,
        ellipsis: {
          showTitle: false,
        },
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
        title: '状态',
        dataIndex: 'operStatusName',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (operStatusName, record) => {
          return (
            <Tooltip title={operStatusName}>
              <span>{operStatusName ? operStatusName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'option',
        title: '操作',
        dataIndex: 'option',
        // width: 250,
        align: 'center',
        fixed: 'right',
        render: (val, record) => {
          const { taskType } = this.state;
          return (
            <span>
              <Action code="raiseAnnouncement:update">
                <a
                  style={{
                    display:
                      (taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.updateTable(val, record);
                  }}
                >
                  修改
                </a>
              </Action>
              <Action code="raiseAnnouncement:copy">
                <a
                  style={{
                    display:
                      (taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.copyTable(val, record);
                  }}
                >
                  复制
                </a>
              </Action>
              <Action code="raiseAnnouncement:commit">
                <a
                  style={{
                    display:
                      (taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.submitTable(val, record);
                  }}
                >
                  提交
                </a>
              </Action>
              <Action code="raiseAnnouncement:delete">
                <a
                  style={{
                    display: record.operStatusName == '待提交' ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.deleteTable(val, record);
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="raiseAnnouncement:check">
                <a
                  style={{
                    display:
                      (taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName == '流程中'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.handleTable(val, record);
                  }}
                >
                  办理
                </a>
              </Action>
              <Action code="raiseAnnouncement:detail">
                <a
                  style={{
                    display:
                      ((taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName == '已结束') ||
                        taskType == 'T001_3' ||
                        taskType == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.lookDetail(val, record);
                  }}
                >
                  详情
                </a>
              </Action>
              <Action code="raiseAnnouncement:history">
                <a
                  style={{
                    display:
                      ((taskType == 'T001_1' || taskType == 'T001_4') &&
                        record.operStatusName != '待提交') ||
                        taskType == 'T001_3' ||
                        taskType == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    handleShowTransferHistory(record);
                  }}
                >
                  流转历史
                </a>
              </Action>
              <Action code="raiseAnnouncement:revoke">
                <a
                  style={{
                    display:
                      record.operStatusName == '流程中' && record.revoke == 1
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  className="color526ECC"
                  onClick={() => {
                    this.revokeTable(val, record);
                  }}
                >
                  撤销
                </a>
              </Action>
              {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
              {/* <Action code="raiseAnnouncement:more"> */}
              <a
                className="ant-dropdown-link color526ECC"
                style={{
                  display:
                    (taskType == 'T001_1' || taskType == 'T001_4') &&
                      record.operStatusName == '流程中'
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
    this.props.dispatch({
      type: 'raiseAnnouncement/getDicts',
      payload: { codeList: ['S001'] },
    });
  };

  /**
   *@method 获取产品类型下拉列表
   */
  handleGetProTypeList = () => {
    this.props.dispatch({
      type: 'raiseAnnouncement/getProTypeList',
    });
  };

  /**
   * @method 生命周期钩子函数
   */
  componentDidMount() {
    this.handleGetSelectOptions();
    this.handleGetProTypeList();
    this.handleGetTableList();
    this.getProductDropList();
    this.getInvestManagerNameList();
  }

  getProductDropList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'raiseAnnouncement/getProductDropList',
      payload: {
        proStage: 'P002_1',
        proType: 'A002_2,A002_3',
        proStatus: 'PS001_2',
      },
    });
  };

  getInvestManagerNameList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'raiseAnnouncement/getInvestManagerNameList',
    });
  }

  /**
   * @method 请求表格列表
   */
  handleGetTableList = () => {
    if (
      (this.state.taskType === 'T001_1' || this.state.taskType === 'T001_4') &&
      this.state.sortField === ''
    ) {
      this.setState(
        {
          // sortField: 'taskTime',
          // sortType: 'desc'
          sortField: '',
          sortType: '',
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
      // proName: this.state.proName,
      proCode: this.state.proCode,
      proType: this.state.proType,
      investmentManager: this.state.investmentManager,
      status: this.state.status,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      taskType: this.state.taskType,
      sortType: this.state.sortType,
      sortField: this.state.sortField,
    };

    this.props.dispatch({
      type: 'raiseAnnouncement/getTaskList',
      payload,
    });
  };

  /**
   * @method 修改关键字
   * @param {*} value
   */
  changekeyWords = value => {
    this.setState(
      {
        keyWords: value,
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 查询
   * @param {*} e
   */
  handlerSearch = fieldsValue => {
    let proCode, proType, investmentManager, status;
    if (fieldsValue) {
      proCode = (fieldsValue.proCode && fieldsValue.proCode.join()) || '';
      proType = (fieldsValue.proType && fieldsValue.proType.join()) || '';
      investmentManager =
        (fieldsValue.investmentManager && fieldsValue.investmentManager.join()) || '';
      status = (fieldsValue.status && fieldsValue.status.join()) || '';
    }
    this.setState(
      {
        proCode: proCode,
        proType: proType,
        investmentManager: investmentManager,
        status: status,
        pageNum: 1,
        pageSize: 10,
        keyWords: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        proCode: '',
        proType: '',
        investmentManager: '',
        status: '',
        pageNum: 1,
        pageSize: 10,
        sortType: '',
        sortField: '',
        keyWords: '',
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
   * @method 选中列表
   * @param {*} selectedRowKeys
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('===选中列表===');
    console.log(selectedRowKeys, selectedRows);
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
        taskType: key,
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
   * @method 改变表格排序
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   */
  changeTable = (pagination, filters, sorter) => {
    this.setState(
      {
        sortType: sorter.order ? (sorter.order == 'ascend' ? 'asc' : 'desc') : '',
        sortField: sorter.order ? sorter.field : '',
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
    console.log(val);
    if (key === '认领') {
    } else if (key === '委托') {
    } else if (key === '退回') {
    } else if (key === '移交') {
    } else if (key === '传阅') {
    } else if (key === '撤销') {
    }
  };

  /**
   * 批量提交
   * @param {*} list
   */
  handlerBatchSubmit = list => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'raiseAnnouncement/commitBatch',
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
   * @method 新增发起流程
   */
  addProcess = () => {
    this.props.fnLink('raiseAnnouncement:add', '');
  };

  /**
   *
   * @method 修改
   * @param {*} val
   * @param {*} record
   * @memberof RaiseAnnouncement
   */
  updateTable(val, record) {
    console.log('===修改===');
    console.log(val);
    console.log(record);

    this.props.fnLink(
      'raiseAnnouncement:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }
  /**
   *
   * @method 复制
   * @param {*} val
   * @param {*} record
   * @memberof RaiseAnnouncement
   */
  copyTable(val, record) {
    console.log('===修改===');
    console.log(val);
    console.log(record);

    this.props.fnLink('raiseAnnouncement:copy', `?processInstId=${record.processInstanceId}`);
  }

  /**
   * @method 提交
   * @param {*} val
   * @param {*} record
   */
  submitTable(val, record) {
    console.log('===提交===');
    console.log(val);
    console.log(record);

    this.props.fnLink(
      'raiseAnnouncement:commit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }

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
    console.log('===办理===');
    console.log(val);
    console.log(record);

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
    console.log('===流转历史===');
    console.log(val);
    console.log(record);
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
          processInstanceIds: record.processInstanceId.split(','),
        };
        this.props.dispatch({
          type: 'raiseAnnouncement/deleteTable',
          payload,
          callback: res => {
            if (res && res.status == 200) {
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
          type: 'raiseAnnouncement/revokeTable',
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

  /**
   * @method 发起流程按钮
   */
  setOperations = () => {
    return (
      <Action code="raiseAnnouncement:add">
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
      productDropList,
      proType,
      investManagerNameList,
      moreOperationStatus,
    } = this.props.raiseAnnouncement;
    const { getFieldDecorator } = this.props.form;
    const { taskType, pageNum, pageSize, batchList, columns } = this.state;
    const { Option } = Select;
    const { Search } = Input;
    const { TabPane } = Tabs;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productDropList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: [
          { name: '小集合', code: 'A002_2' },
          { name: '大集合', code: 'A002_3' },
        ],
      },
      {
        name: 'investmentManager',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo' },
        config: { mode: 'multiple' },
        option: investManagerNameList,
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
          pageCode="raiseAnnouncement"
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
          fuzzySearch={this.changekeyWords}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: this.state.taskType,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {this.state.taskType === 'T001_1' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: true }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total != 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskType,
                          statusKey: 'operStatus',
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
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {this.state.taskType === 'T001_3' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: true }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total != 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskType,
                          statusKey: 'operStatus',
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
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {this.state.taskType === 'T001_4' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: true }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total != 0 ? (
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskType,
                          statusKey: 'operStatus',
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
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  ) : null}
                </>
              )}
              {this.state.taskType === 'T001_5' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: true }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  {total != 0 ? (
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
                        onChange={this.changePage}
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
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
      connect(({ raiseAnnouncement, publicModel: { publicTas } }) => ({
        raiseAnnouncement,
        publicTas,
      }))(RaiseAnnouncement),
    ),
  ),
);

export default WrappedSingleForm;

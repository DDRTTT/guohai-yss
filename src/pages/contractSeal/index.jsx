// 合同用印页面
import React, { Component } from 'react';
import { Button, Form, message, Modal, Pagination, Row, Tabs } from 'antd';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { routerRedux } from 'dva/router';
import MoreOperation from '@/components/moreOperation';
import router from 'umi/router';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
/* S001状态  J004_2托管人 */
const dictList = {
  codeList: 'S001',
};

@Form.create()
class ContractSeal extends Component {
  state = {
    isOpenFrame: false,
    taskTypeCode: this.props.publicTas,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    loading: false,
    batchList: [],
    batchObj: {},
    selectedRowKeys: [],
    fieldsValue: {},
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        key: 'proName',
        sorter: true,
        ...tableRowConfig,
        width: 400,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品类型',
        dataIndex: 'assetTypeName',
        key: 'assetTypeName',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '投资经理',
        dataIndex: 'investManagerNames',
        key: 'investManagerNames',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '托管人',
        dataIndex: 'proTrusBank',
        key: 'proTrusBank',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        key: 'taskTime',
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        ...tableRowConfig,
      },
      {
        key: 'taskId',
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        width: 240,
        render: (text, record) => {
          if (this.state.taskTypeCode === 'T001_1' && record.circulateFlag === '0') {
            return this.renderColActions(lookOverActions, text, record);
          }
          if (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') {
            if (record.checked === 'S001_2') {
              // 流程中
              if (record.revoke && record.revoke * 1 === 1) {
                return this.renderColActions(joinedActions, text, record);
              }
              return this.renderColActions(joinActions, text, record);
            }
            return this.renderColActions(moreActions, text, record);
          }
          if (record.checked === 'S001_2' && record.revoke && record.revoke * 1 === 1) {
            return this.renderColActions(initActions, text, record);
          }
          return this.renderColActions(inActions, text, record);
        },
      },
    ],
    // checkedArr: [],
  };

  componentDidMount() {
    this.getTableDataList();
    this.getproTrusBankList();
    this.getProductList();
    this.getDictList();
    this.getproTypeList();
    this.getInvestManageChangeList();
  }

  /**
   * 方法说明 表格数据查询
   */
  getTableDataList = () => {
    const { dispatch, form } = this.props;
    const { direct, oField, page, limit, taskTypeCode, fieldsValue } = this.state;
    const proCode = fieldsValue.proCode ? fieldsValue.proCode : [];
    const proType = fieldsValue.proType ? fieldsValue.proType.join() : '';
    const status = fieldsValue.status ? fieldsValue.status.join() : '';
    const investmentManager = fieldsValue.investmentManager
      ? fieldsValue.investmentManager.join()
      : '';
    const proTrusBank = fieldsValue.proTrusBank ? fieldsValue.proTrusBank.join() : '';
    const params = {
      pageNum: page,
      pageSize: limit,
      taskTypeCode,
      proCode,
      proType,
      status,
      proTrusBank,
      investmentManager,
    };
    if (this.state.keyWords) {
      params.keyWords = this.state.keyWords;
    }
    if (oField) {
      params.field = oField;
    }
    if (direct === 'ascend') {
      params.direction = 'asc';
    } else if (direct === 'descend') {
      params.direction = 'desc';
    }
    dispatch({
      type: `contractSeal/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
          loading: false,
        });
      }
    });
  };

  /**
   * 方法说明  托管人查询
   * @method getproTrusBankList
   */
  getproTrusBankList() {
    const { dispatch } = this.props;
    const params = {
      orgType: 'J004_2',
    };
    dispatch({
      type: `contractSeal/handlproTrusBankList`,
      payload: params,
    });
  }

  /**
   * 方法说明  经理人查询
   * @method getInvestManageChangeList
   */
  getInvestManageChangeList() {
    const { dispatch } = this.props;
    dispatch({
      type: `contractSeal/handlInvestManagerList`,
    });
  }

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'contractSeal',
    };
    dispatch({
      type: `contractSeal/queryProductList`,
      payload: params,
    });
  }

  /**
   * 方法说明  产品类型查询
   * @method getProductTypeList
   */
  getproTypeList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'contractSeal',
    };
    dispatch({
      type: `contractSeal/handleProductTypeList`,
      payload: params,
    });
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   */
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `contractSeal/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

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
        this.getTableDataList();
      },
    );
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

  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param val
   */
  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  /**
   * @method 展开搜索框
   */
  openConditions = () => {
    const { isOpenFrame } = this.state;
    this.props.form.resetFields();
    this.setState({
      isOpenFrame: !isOpenFrame,
    });
  };

  /**
   * @method renderColActions
   */
  renderColActions = (colActions, text, record) => {
    return (
      <span>
        {colActions.map(btn =>
          btn.text === '更多' ? (
            this.actionButtonMore(record)
          ) : (
            <Action code={btn.code}>
              <a onClick={() => btn.onClick(record)} type="link" style={{ marginRight: 10 }}>
                {btn.text}
              </a>
            </Action>
          ),
        )}
      </span>
    );
  };

  /**
   * 条件查询
   * @method searchBtn
   */
  searchBtn = () => {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getTableDataList();
      },
    );
    // this.getTableDataList();
  };

  handlerSearch = fieldsValue => {
    this.setState(
      {
        page: 1,
        fieldsValue: fieldsValue || {},
        keyWords: '',
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        page: 1,
        fieldsValue: {},
        direct: '',
        oField: '',
        keyWords: '',
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  /**
   * 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="contractSeal:link">
        <Button
          type="primary"
          onClick={() => {
            this.contractSealAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  contractSealAdd = () => {
    this.props.fnLink('contractSeal:link', '');
  };

  // 流转历史
  transHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`;
    router.push(url);
  };

  /* *
   * 更多按钮操作事件
   * @method moreGroupButton
   * */
  moreGroupButton = val => {
    const { key } = val;
    if (key === '0') {
      //   console.log('认领');
    } else if (key === '1') {
      //   console.log('委托');
    } else if (key === '2') {
      //   console.log('退回');
    } else if (key === '3') {
      //   console.log('移交');
    }
  };

  actionButtonMore = record => {
    return <MoreOperation record={record} fn={this.getTableDataList} />;
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
    this.setState(
      {
        tableList: [],
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  /**
   * 操作列 事件
   * @method groupOperate
   */
  groupOperate(record, mark) {
    const { dispatch, fnLink } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
    };
    if (mark === 'lookOver') {
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: {
            id: record.taskId,
            taskId: record.taskId,
            processInstanceId: record.processInstanceId,
            processDefinitionId: record.processDefinitionId,
            taskDefinitionKey: record.taskDefinitionKey,
            mode: 'review',
          },
        }),
      );
    }
    if (mark === 'edit') {
      //   console.log('修改');
      fnLink(
        'contractSeal:update',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'chart') {
      dispatch(
        routerRedux.push({
          pathname: '/nativeProduct',
          query: {
            status: 'update',
            proCode: record.productCode,
          },
        }),
      );
      //   console.log('流程图');
    } else if (mark === 'handle') {
      params.mode = 'deal';
      params.id = record.id;
      params.proCode = record.proCode;
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'history') {
      //   console.log('流转历史');
      this.transHistory(record);
    } else if (mark === 'more') {
      //   console.log('更多');
    } else if (mark === 'submit') {
      fnLink(
        'contractSeal:commit',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'view') {
      this.props.dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'cancel') {
      Modal.confirm({
        title: '请确认是否撤销?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'contractSeal/getRevokeFunc',
            payload: record.processInstanceId,
          }).then(data => {
            if (data) {
              this.getTableDataList();
            }
          });
        },
      });
    } else if (mark === 'del') {
      Modal.confirm({
        title: '请确认是否删除?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'contractSeal/getDeleteFunc',
            payload: record.id,
          }).then(data => {
            if (data) {
              this.getTableDataList();
            }
          });
        },
      });
    } else if (mark === 'copy') {
      fnLink('contractSeal:copy', `?processInstId=${record.processInstanceId}`);
    }
  }

  // 批量处理成功以后的回调
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      batchList: [],
      batchObj: {},
    });
  };

  // 批量提交的回调
  handlerBatchSubmit = () => {
    const { batchList } = this.state;
    const proCodes = batchList.map(item => item.id);
    this.props
      .dispatch({
        type: 'contractSeal/getBatchSubmitByProCodeReq',
        payload: proCodes,
      })
      .then(res => {
        if (res && res.status === 200) {
          this.getTableDataList();
          this.handlerSuccessCallback();
        } else {
          message.error(res.message);
        }
      });
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      contractSeal: {
        proTypeList,
        proTrusBankList,
        statusList,
        investmentManagerList,
        productList,
      },
    } = this.props;
    /* const { } = this.props; */
    const { tableList, oTotal, page, loading, taskTypeCode, columns } = this.state;

    const moreActions = [
      {
        text: '修改',
        code: 'contractSeal:update',
        onClick: record => this.groupOperate(record, 'edit'),
      },
      {
        text: '复制',
        code: 'contractSeal:copy',
        onClick: record => this.groupOperate(record, 'copy'),
      },
      {
        text: '提交',
        code: 'contractSeal:commit',
        onClick: record => this.groupOperate(record, 'submit'),
      },
      {
        text: '删除',
        onClick: record => this.groupOperate(record, 'del'),
        code: 'contractSeal:deleteApi',
      },
    ];

    const lookOverActions = [
      {
        text: '审阅',
        code: 'lookOver',
        onClick: record => this.groupOperate(record, 'lookOver'),
      },
    ];

    const joinedActions = [
      {
        text: '办理',
        code: 'contractSeal:check',
        onClick: record => this.groupOperate(record, 'handle'),
      },
      {
        text: '流转历史',
        code: 'contractSeal:transferHistory',
        onClick: record => handleShowTransferHistory(record),
      },
      {
        text: '撤销',
        code: 'contractSeal:backOut',
        onClick: record => this.groupOperate(record, 'cancel'),
      },
      {
        text: '更多',
        code: 'contractSeal:more',
        onClick: record => this.groupOperate(record, 'more'),
      },
    ];

    const joinActions = [
      {
        text: '办理',
        code: 'contractSeal:check',
        onClick: record => this.groupOperate(record, 'handle'),
      },
      {
        text: '流转历史',
        code: 'contractSeal:transferHistory',
        onClick: record => handleShowTransferHistory(record),
      },
      {
        text: '更多',
        code: 'contractSeal:more',
        onClick: record => this.groupOperate(record, 'more'),
      },
    ];

    const initActions = [
      {
        text: '详情',
        code: 'contractSeal:details',
        onClick: record => this.groupOperate(record, 'view'),
      },
      {
        text: '流转历史',
        code: 'contractSeal:transferHistory',
        onClick: record => handleShowTransferHistory(record),
      },
      {
        text: '撤销',
        code: 'contractSeal:backOut',
        onClick: record => this.groupOperate(record, 'cancel'),
      },
    ];

    const inActions = [
      {
        text: '详情',
        code: 'contractSeal:details',
        onClick: record => this.groupOperate(record, 'view'),
      },
      {
        text: '流转历史',
        code: 'contractSeal:transferHistory',
        onClick: record => handleShowTransferHistory(record),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectRows) => {
        const { page } = this.state;
        this.state.batchObj = { ...this.state.batchObj, [page]: selectRows };
        this.setState(
          {
            selectedRowKeys,
          },
          () => {
            let tempList = [];
            for (const key in this.state.batchObj) {
              if (this.state.batchObj.hasOwnProperty(key)) {
                const element = this.state.batchObj[key];
                tempList = tempList.concat(element);
              }
            }
            this.setState({
              batchList: tempList,
            });
          },
        );
      },
      selectedRowKeys: this.state.selectedRowKeys,
    };

    const baseTable = () => {
      return (
        <>
          <Table
            rowSelection={rowSelection}
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: columns.length * 200 + 320 }}
            onChange={this.handleTableChange}
            loading={loading}
            rowKey="taskId"
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
              {/* <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">提交</Menu.Item>
                    <Menu.Item key="1">认领</Menu.Item>
                    <Menu.Item key="2">委托</Menu.Item>
                    <Menu.Item key="3">退回</Menu.Item>
                    <Menu.Item key="4">移交</Menu.Item>
                  </Menu>
                }
                placement="topLeft"
              >
                <Button style={{ marginRight: 10, width: 100, height: 26 }}>批量操作</Button>
              </Dropdown> */}
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };

    const formItemData = [
      {
        name: 'proCode',
        label: '产品名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value', bracket: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: proTypeList,
      },
      {
        name: 'proTrusBank',
        label: '托管人',
        type: 'select',
        readSet: { name: 'orgName', code: 'id', bracket: 'id' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: proTrusBankList,
      },
      {
        name: 'investmentManager',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo', bracket: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: investmentManagerList,
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
          pageCode="contractSeal"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
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
                  {baseTable()}
                  <MoreOperation
                    batchStyles={{ float: 'left', marginTop: '-34px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'checked',
                    }}
                    fn={this.getTableDataList}
                    type="batch"
                    batchList={this.state.batchList}
                    submitCallback={this.handlerBatchSubmit}
                    successCallback={this.handlerSuccessCallback}
                  />
                </>
              )}
              {taskTypeCode === 'T001_3' && <>{baseTable()}</>}
              {taskTypeCode === 'T001_4' && (
                <>
                  {baseTable()}
                  <MoreOperation
                    batchStyles={{ float: 'left', marginTop: '-34px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'checked',
                    }}
                    fn={this.getTableDataList}
                    type="batch"
                    batchList={this.state.batchList}
                    submitCallback={this.handlerBatchSubmit}
                    successCallback={this.handlerSuccessCallback}
                  />
                </>
              )}
              {taskTypeCode === 'T001_5' && <>{baseTable()}</>}
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
      connect(({ contractSeal, loading, publicModel: { publicTas } }) => ({
        contractSeal,
        loading: loading.effects['contractSeal/handleTableDataList'],
        publicTas,
      }))(ContractSeal),
    ),
  ),
);

export default WrappedSingleForm;

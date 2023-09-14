// 投资经理变更页面
import React, { Component } from 'react';
import { Button, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
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
/* S001状态 */
const dictList = {
  codeList: 'S001',
};

@Form.create()
class InvestManagerChange extends Component {
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
    seachData: {},
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
        width: 400,
      },
      {
        title: '原投资经理',
        dataIndex: 'oriInvestManagerName',
        key: 'oriInvestManagerName',
        sorter: true,
        ...tableRowConfig,
        width: 200,
      },
      {
        title: '拟任投资经理',
        dataIndex: 'appointInvestManagerName',
        key: 'appointInvestManagerName',
        sorter: true,
        ...tableRowConfig,
        width: 200,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        key: 'taskTime',
        ...tableRowConfig,
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
        sorter: true,
        ...tableRowConfig,
        width: 200,
      },
      {
        key: 'taskId',
        dataIndex: 'taskId',
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          if (this.state.taskTypeCode === 'T001_1' && record.circulateFlag === '0') {
            return this.renderColActions(lookOverActions, text, record);
          } else {
            if (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') {
              if (record.status === 'S001_2') {
                // 流程中
                if (record.revoke && record.revoke * 1 === 1) {
                  return this.renderColActions(joinedActions, text, record);
                } else {
                  return this.renderColActions(joinActions, text, record);
                }
              } else {
                return this.renderColActions(moreActions, text, record);
              }
            } else {
              if (record.status === 'S001_2' && record.revoke && record.revoke * 1 === 1) {
                return this.renderColActions(initActions, text, record);
              } else {
                return this.renderColActions(inActions, text, record);
              }
            }
          }
        },
      },
    ],
    // checkedArr: [],
  };

  componentDidMount() {
    this.getTableDataList();
    this.getDictList();
    this.getProductList();
    this.getproTypeList();
    this.getInvestManagerList();
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getInvestManagerList
   */
  getInvestManagerList() {
    const { dispatch } = this.props;
    dispatch({
      type: `investManagerChange/getInvestManagerList`,
      payload: {},
    });
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   * @param codeList {Object} 字典类型
   */
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `investManagerChange/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  /**
   * 方法说明 表格数据查询
   * @method getTableDataList
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param formItems {Object} 表单项
   * @param direction {string} 升序/降序
   * @param field  {string} 被排序字段
   * @param keyWords {string} 关键字
   */
  getTableDataList = () => {
    const { dispatch } = this.props;
    const { direct, oField, page, limit, taskTypeCode, keyWords, seachData } = this.state;

    const params = {
      pageNum: page,
      pageSize: limit,
      taskTypeCode,
      keyWords,
      ...seachData,
    };
    if (oField) {
      params.field = oField;
    }
    if (params.field === 'oriInvestManagerName') {
      params.field = 'oriInvestManager';
    }
    if (params.field === 'appointInvestManagerName') {
      params.field = 'appointInvestManager';
    }
    if (params.field === 'statusName') {
      params.field = 'status';
    }
    if (direct === 'ascend') {
      params.direction = 'asc';
    } else if (direct === 'descend') {
      params.direction = 'desc';
    }
    this.setState({
      loading: true,
    });
    dispatch({
      type: `investManagerChange/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res && res.data) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
        });
      }
    });
  };

  // 产品名称change
  proNameChange = val => {
    this.props.form.setFieldsValue({
      seriesCodeOrProCode: val,
    });
  };

  // 产品代码change
  proCodeChange = val => {
    this.props.form.setFieldsValue({
      proName: val,
    });
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
   * 方法说明  产品类型查询
   * @method getProductTypeList
   */
  getproTypeList = () => {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'investManagerChange',
    };
    dispatch({
      type: `investManagerChange/handleProductTypeList`,
      payload: params,
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `investManagerChange/queryProductList`,
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

  /* *
   * @method 展开搜索框
   * @param menuCode {string} 菜单
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
  searchBtn = formItems => {
    this.setState(
      {
        page: 1,
        seachData: formItems || {},
      },
      () => this.getTableDataList(),
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        page: 1,
        oField: '',
        direct: '',
        seachData: {},
        keyWords: '',
      },
      () => this.getTableDataList(),
    );
  };
  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param keyWords {string} 关键字
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
   * 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="investManagerChange:link">
        <Button
          type="primary"
          onClick={() => {
            this.InvestManagerAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  InvestManagerAdd = () => {
    this.props.fnLink('investManagerChange:link', '');
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
        'investManagerChange:update',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'handle') {
      params.mode = 'deal';
      params.id = record.id;
      params.proCode = record.seriesOrProCode;
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'history') {
      //   console.log('流转历史');
      handleShowTransferHistory(record);
    } else if (mark === 'more') {
      //   console.log('更多');
    } else if (mark === 'submit') {
      fnLink(
        'investManagerChange:commit',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'view') {
      dispatch(
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
            type: 'investManagerChange/getRevokeFunc',
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
            type: 'investManagerChange/getDeleteFunc',
            payload: {
              ids: record.id,
              processInstanceIds: record.processInstanceId,
            },
          }).then(data => {
            if (data) {
              this.getTableDataList();
            }
          });
        },
      });
    } else if (mark === 'copy') {
      fnLink('investManagerChange:copy', `?processInstId=${record.processInstanceId}`);
    }
  }

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
    const ids = batchList.map(item => item.id);
    this.props
      .dispatch({
        type: 'investManagerChange/getBatchSubmitByProCodeReq',
        payload: { ids },
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
      investManagerChange: { statusList, proTypeList, productList, investManagerList },
      loading,
    } = this.props;

    const { tableList, oTotal, page, taskTypeCode, columns } = this.state;

    const moreActions = [
      {
        text: '修改',
        code: 'investManagerChange:update',
        onClick: record => this.groupOperate(record, 'edit'),
      },
      {
        text: '复制',
        code: 'investManagerChange:copy',
        onClick: record => this.groupOperate(record, 'copy'),
      },
      {
        text: '提交',
        code: 'investManagerChange:commit',
        onClick: record => this.groupOperate(record, 'submit'),
      },
      {
        text: '删除',
        code: 'investManagerChange:deleteApi',
        onClick: record => this.groupOperate(record, 'del'),
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
        code: 'investManagerChange:check',
        onClick: record => this.groupOperate(record, 'handle'),
      },
      {
        text: '流转历史',
        code: 'investManagerChange:transferHistory',
        onClick: record => this.groupOperate(record, 'history'),
      },
      {
        text: '撤销',
        code: 'investManagerChange:backOut',
        onClick: record => this.groupOperate(record, 'cancel'),
      },
      {
        text: '更多',
        code: 'investManagerChange:more',
        onClick: record => this.groupOperate(record, 'more'),
      },
    ];

    const joinActions = [
      {
        text: '办理',
        code: 'investManagerChange:check',
        onClick: record => this.groupOperate(record, 'handle'),
      },
      {
        text: '流转历史',
        code: 'investManagerChange:transferHistory',
        onClick: record => this.groupOperate(record, 'history'),
      },
      {
        text: '更多',
        code: 'investManagerChange:more',
        onClick: record => this.groupOperate(record, 'more'),
      },
    ];

    // const colActions = [
    //   {
    //     text: '修改',
    //     code: 'investManagerChange:update',
    //     onClick: record => this.groupOperate(record, 'edit'),
    //   },
    // ];

    const initActions = [
      {
        text: '详情',
        code: 'investManagerChange:details',
        onClick: record => this.groupOperate(record, 'view'),
      },
      {
        text: '流转历史',
        code: 'investManagerChange:transferHistory',
        onClick: record => this.groupOperate(record, 'history'),
      },
      {
        text: '撤销',
        code: 'investManagerChange:backOut',
        onClick: record => this.groupOperate(record, 'cancel'),
      },
    ];
    const inActions = [
      {
        text: '详情',
        code: 'investManagerChange:details',
        onClick: record => this.groupOperate(record, 'view'),
      },
      {
        text: '流转历史',
        code: 'investManagerChange:transferHistory',
        onClick: record => this.groupOperate(record, 'history'),
      },
    ];

    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectRows) => {
        const { batchObj, page } = this.state;
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
            scroll={{ x: columns.length * 200 + 440 }}
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
        name: 'oriInvestManagerList',
        label: '原投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo', bracket: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: investManagerList,
      },
      {
        name: 'appointInvestManagerList',
        label: '拟任投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo', bracket: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: investManagerList,
      },
      {
        name: 'statusCodes',
        label: '状态',
        type: 'select',
        config: { mode: 'multiple', maxTagCount: 1 },
        option: statusList,
      },
    ];

    return (
      <div>
        <List
          pageCode="investManagerChange"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={formValues => this.searchBtn(formValues)}
          resetFn={this.handleReset}
          searchPlaceholder="请输入系列/产品全称/系列号/产品代码"
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
                      tabs: taskTypeCode,
                      statusKey: 'operStatus',
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
                      tabs: taskTypeCode,
                      statusKey: 'operStatus',
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
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ investManagerChange, loading, publicModel: { publicTas } }) => ({
        investManagerChange,
        publicTas,
        loading: loading.effects['investManagerChange/handleTableDataList'],
      }))(InvestManagerChange),
    ),
  ),
);

export default WrappedSingleForm;

// 关联方核查页面
import React, { Component } from 'react';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { routerRedux } from 'dva/router';
import MoreOperation from '@/components/moreOperation';
import router from 'umi/router';
import { tableRowConfig } from '@/pages/investorReview/func';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
/* S001状态 */
const dictList = {
  codeList: 'S001',
};

@Form.create()
class Index extends Component {
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
    searchData: {},
    columns: [
      {
        title: '产品简称',
        dataIndex: 'proFname',
        key: 'proFname',
        sorter: true,
        ...tableRowConfig,
        width: 250,
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
        dataIndex: 'assetType',
        key: 'assetType',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品阶段',
        dataIndex: 'productStage',
        key: 'productStage',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '任务到达时间',
        dataIndex: 'missionArrivalTime',
        sorter: true,
        key: 'missionArrivalTime',
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        width: 180,
        render: (_, record) => {
          return (
            <Tooltip title={record.statusName} placement="topLeft">
              <span
                style={{
                  width: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  paddingTop: '5px',
                }}
              >
                {record.statusName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        key: 'taskId',
        dataIndex: 'taskId',
        title: '操作',
        fixed: 'right',
        width: 240,
        align: 'center',
        render: (text, record) => {
          const moreActions = [
            {
              text: '修改',
              code: 'affiliatedVerification:update',
              onClick: record => this.groupOperate(record, 'edit'),
            },
            {
              text: '复制',
              code: 'affiliatedVerification:copy',
              onClick: record => this.groupOperate(record, 'copy'),
            },
            {
              text: '提交',
              code: 'affiliatedVerification:commit',
              onClick: record => this.groupOperate(record, 'submit'),
            },
            {
              text: '删除',
              onClick: record => this.groupOperate(record, 'del'),
              code: 'affiliatedVerification:deleteApi',
            },
          ];

          const joinedActions = [
            {
              text: '办理',
              code: 'affiliatedVerification:check',
              onClick: record => this.groupOperate(record, 'handle'),
            },
            {
              text: '流转历史',
              code: 'affiliatedVerification:transferHistory',
              onClick: record => handleShowTransferHistory(record),
            },
            {
              text: '撤销',
              code: 'affiliatedVerification:backOut',
              onClick: record => this.groupOperate(record, 'cancel'),
            },
            {
              text: '更多',
              code: 'affiliatedVerification:more',
              onClick: record => this.groupOperate(record, 'more'),
            },
          ];

          const lookOverActions = [
            {
              text: '审阅',
              code: 'lookOver',
              onClick: record => this.groupOperate(record, 'lookOver'),
            },
          ];

          const joinActions = [
            {
              text: '办理',
              code: 'affiliatedVerification:check',
              onClick: record => this.groupOperate(record, 'handle'),
            },
            {
              text: '流转历史',
              code: 'affiliatedVerification:transferHistory',
              onClick: record => handleShowTransferHistory(record),
            },
            {
              text: '更多',
              code: 'affiliatedVerification:more',
              onClick: record => this.groupOperate(record, 'more'),
            },
          ];

          const colActions = [
            {
              text: '修改',
              code: 'affiliatedVerification:update',
              onClick: record => this.groupOperate(record, 'edit'),
            },
          ];

          const initActions = [
            {
              text: '详情',
              code: 'affiliatedVerification:details',
              onClick: record => this.groupOperate(record, 'view'),
            },
            {
              text: '流转历史',
              code: 'affiliatedVerification:transferHistory',
              onClick: record => handleShowTransferHistory(record),
            },
            {
              text: '撤销',
              code: 'affiliatedVerification:backOut',
              onClick: record => this.groupOperate(record, 'cancel'),
            },
          ];

          const inActions = [
            {
              text: '详情',
              code: 'affiliatedVerification:details',
              onClick: record => this.groupOperate(record, 'view'),
            },
            {
              text: '流转历史',
              code: 'affiliatedVerification:transferHistory',
              onClick: record => handleShowTransferHistory(record),
            },
          ];
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
    this.getTaskList();
    this.getDictsAPI();
    this.getproTypeList();
    this.getProductList();
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictsAPI
   * @param codeList {Object} 字典类型
   */
  getDictsAPI() {
    const { dispatch } = this.props;
    dispatch({
      type: `affiliatedVerification/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  /**
   * 方法说明 表格数据查询
   * @method getTaskList
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param formItems {Object} 表单项
   * @param direction {string} 升序/降序
   * @param field  {string} 被排序字段
   * @param keyWords {string} 关键字
   */
  getTaskList = () => {
    const { dispatch, form } = this.props;
    const { direct, oField, page, limit, taskTypeCode, searchData } = this.state;
    const formItems = searchData;
    const params = {
      pageNum: page,
      pageSize: limit,
      taskTypeCode,
      keyWords: this.state.keyWords,
      ...formItems,
    };
    if (oField) {
      params.field = oField;
    }
    if (direct === 'ascend') {
      params.direction = 'asc';
    } else if (direct === 'descend') {
      params.direction = 'desc';
    }
    dispatch({
      type: `affiliatedVerification/queryTableList`,
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

  getProductList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'affiliatedVerification',
    };
    dispatch({
      type: `affiliatedVerification/queryProductList`,
      payload: params,
    });
  }

  /**
   * 方法说明  排序change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order,
        oField: sorter.field,
      },
      () => {
        this.getTaskList();
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
        this.getTaskList();
      },
    );
  };

  /**
   * 方法说明  产品类型查询
   * @method getProductTypeList
   * @param menuCode {string} 菜单
   */
  getproTypeList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'affiliatedVerification',
    };
    dispatch({
      type: `affiliatedVerification/handleProductTypeList`,
      payload: params,
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
              <a
                onClick={() => btn.onClick(record)}
                type="link"
                size="small"
                style={{ marginRight: 10 }}
              >
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
        this.getTaskList();
      },
    );
    // this.getTaskList();
  };
  handlerSearch = fieldsValue => {
    this.setState(
      {
        page: 1,
        searchData: fieldsValue || {},
      },
      () => {
        this.getTaskList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        page: 1,
        searchData: {},
        oField: '',
        direct: '',
        keyWords: '',
      },
      () => {
        this.getTaskList();
      },
    );
  };

  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param keyWords {string} 关键字
   */
  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
      },
      () => {
        this.getTaskList();
      },
    );
  };

  /**
   * 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    const operations = (
      <Action code="affiliatedVerification:link">
        <Button
          type="primary"
          onClick={() => {
            this.InitiateProcess();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
    return operations;
  };

  InitiateProcess = () => {
    this.props.fnLink('affiliatedVerification:link', '');
  };

  // 流转历史
  transHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`;
    router.push(url);
  };

  /* 更多按钮操作事件 */
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
    return <MoreOperation record={record} fn={this.getTaskList} />;
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
        'affiliatedVerification:update',
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
      this.transHistory(record);
      //   console.log('流转历史');
    } else if (mark === 'more') {
      //   console.log('更多');
    } else if (mark === 'submit') {
      fnLink(
        'affiliatedVerification:commit',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'view') {
      console.log(record);
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
            type: 'affiliatedVerification/getRevokeFunc',
            payload: record.processInstanceId,
          }).then(data => {
            if (data) {
              this.getTaskList();
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
            type: 'affiliatedVerification/getDeleteFunc',
            payload: record.id,
          }).then(data => {
            if (data) {
              this.getTaskList();
            }
          });
        },
      });
      // dispatch({
      //   type: 'affiliatedVerification/getDeleteFunc',
      //   payload: record.id,
      // }).then(data => {
      //   if (data) {
      //     this.getTaskList();
      //   }
      // });
    } else if (mark === 'copy') {
      fnLink('affiliatedVerification:copy', `?processInstId=${record.processInstanceId}`);
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
    const proCodes = batchList.map(item => item.id);
    this.props
      .dispatch({
        type: 'affiliatedVerification/getBatchSubmitByProCodeReq',
        payload: proCodes,
      })
      .then(res => {
        if (res && res.status === 200) {
          this.getTaskList();
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
    /* const { } = this.props; */
    const { tableList, oTotal, page, loading, taskTypeCode, columns } = this.state;
    const {
      affiliatedVerification: { statusList, proTypeList, productList },
    } = this.props;

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
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: page,
      total: oTotal,
      showTotal: total => `共 ${total} 条数据`,
    };
    const baseTable = () => {
      return (
        <>
          <Table
            rowSelection={rowSelection}
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
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
                showTotal={oTotal => `共 ${oTotal} 条数据`}
              />
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };
    // 条件查询配置
    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productList,
      },
      {
        name: 'assetType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple' },
        option: proTypeList,
      },
      {
        name: 'processStatus',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: statusList,
      },
    ];
    return (
      <>
        <List
          pageCode="affiliatedVerification"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="missionArrivalTime"
          title={false}
          formItemData={formItemData}
          advancSearch={fieldsValue => this.handlerSearch(fieldsValue)}
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
            activeTabKey: this.state.taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {this.state.taskTypeCode === 'T001_1' && (
                <>
                  {baseTable()}
                  <MoreOperation
                    batchStyles={{ float: 'left', marginTop: '-34px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'status',
                    }}
                    fn={this.getTaskList}
                    type="batch"
                    batchList={this.state.batchList}
                    submitCallback={this.handlerBatchSubmit}
                    successCallback={this.handlerSuccessCallback}
                  />
                </>
              )}
              {this.state.taskTypeCode === 'T001_3' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_4' && (
                <>
                  {baseTable()}
                  <MoreOperation
                    batchStyles={{ float: 'left', marginTop: '-34px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'status',
                    }}
                    fn={this.getTaskList}
                    type="batch"
                    batchList={this.state.batchList}
                    submitCallback={this.handlerBatchSubmit}
                    successCallback={this.handlerSuccessCallback}
                  />
                </>
              )}
              {this.state.taskTypeCode === 'T001_5' && <> {baseTable()} </>}
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
      connect(({ affiliatedVerification, loading, publicModel: { publicTas } }) => ({
        affiliatedVerification,
        publicTas,
        loading: loading.effects['affiliatedVerification/queryTableList'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

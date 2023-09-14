/**
 *债卷交易 债券交易偏离度报备页面
 */
import React, { Component } from 'react';
import { Button, Form, message, Modal, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import { routerRedux } from 'dva/router';
import MoreOperation from '@/components/moreOperation';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const codeList = 'S001';

@Form.create()
class DiverGence extends Component {
  state = {
    expand: false, // 判断搜索是否隐藏
    fuzzy: '',
    pageNum: 1,
    pageSize: 10,
    taskTypeCode: this.props.publicTas,
    direction: '', // 排序方式 desc:降序|asc:升序
    field: '',
    loading: false,
    total: '',
    tableList: [],
    batchList: [],
    batchObj: {},
    selectedRowKeys: [],
    fieldsValue: {},
    columns: [
      {
        key: 'title',
        title: '流程标题',
        dataIndex: 'title',
        sorter: true,
        // ...tableRowConfig,
        width: 400,
        ellipsis: {
          showTitle: false,
        },
        render: title => {
          return (
            <Tooltip title={title}>
              <span>{title || '-'}</span>
            </Tooltip>
          );
        },
      },
      // {
      //   key: 'content',
      //   title: '正文',
      //   dataIndex: 'content',
      //   sorter: false,
      //   // ...tableRowConfig,
      //   width: 300,
      //   ellipsis: {
      //     showTitle: false,
      //   },
      //   render: (content, record) => {
      //     return (
      //       <Tooltip title={content}>
      //         <span>{content ? content : '-'}</span>
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        key: 'taskTime',
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        // ...tableRowConfig,
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
        key: 'operStatus',
        title: '状态',
        dataIndex: 'operStatus',
        sorter: true,
        width: 200,
        render: (_, record) => {
          return (
            <Tooltip title={record.operStatusName} placement="topLeft">
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
                {record.operStatusName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        // width: 260,
        render: (text, record) => {
          // 待提交 S001_1   流程中S001_2  已结束 S001_3
          // 代办 T001_1 未提交 T001_3
          let content;
          if (this.state.taskTypeCode === 'T001_1' && record.circulateFlag === '0') {
            content = (
              <>
                <a onClick={() => this.dealTask(record, 'lookOver')} className={styles.rightBtn}>
                  详情
                </a>
                {this.revokeBtn(record)}
              </>
            );
          } else {
            if (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') {
              switch (record.operStatus) {
                case 'S001_1':
                  content = (
                    <>
                      <Action code="divergence:update">
                        <a
                          onClick={() => this.dealTask(record, 'edit')}
                          className={styles.rightBtn}
                        >
                          修改
                        </a>
                      </Action>
                      <Action code="divergence:copy">
                        <a
                          onClick={() => this.dealTask(record, 'copy')}
                          className={styles.rightBtn}
                        >
                          复制
                        </a>
                      </Action>
                      <Action code="divergence:commit">
                        <a
                          onClick={() => this.dealTask(record, 'submit')}
                          className={styles.rightBtn}
                        >
                          提交
                        </a>
                      </Action>
                      <Action code="divergence:deleteApi">
                        <a
                          onClick={() => {
                            this.dealTask(record, 'del');
                          }}
                          className={styles.rightBtn}
                        >
                          删除
                        </a>
                      </Action>
                    </>
                  );
                  break;
                case 'S001_2':
                  content = (
                    <>
                      <Action code="divergence:check">
                        <a
                          onClick={() => this.dealTask(record, 'handle')}
                          className={styles.rightBtn}
                        >
                          办理
                        </a>
                      </Action>
                      <Action code="divergence:transferHistory">
                        <a
                          onClick={() => this.dealTask(record, 'history')}
                          className={styles.rightBtn}
                        >
                          流转历史
                        </a>
                      </Action>
                      {this.revokeBtn(record)}
                      <MoreOperation record={record} fn={this.handleGetTableList} />
                    </>
                  );
                  break;
                default:
              }
              return content;
            }
            content = (
              <>
                <Action code="divergence:details">
                  <a onClick={() => this.dealTask(record, 'view')} className={styles.rightBtn}>
                    详情
                  </a>
                </Action>
                <Action code="divergence:transferHistory">
                  <a onClick={() => this.dealTask(record, 'history')} className={styles.rightBtn}>
                    流转历史
                  </a>
                </Action>
                {this.revokeBtn(record)}
              </>
            );
          }
          return content;
        },
      },
    ],
  };

  componentDidMount() {
    this.handleGetTableList();
    this.getDictList();
  }

  // 词汇字典查询
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `diverGence/queryCriteria`,
      payload: {
        codeList,
      },
    });
  }

  // 请求列表
  handleGetTableList = () => {
    const { pageNum, pageSize, taskTypeCode, fuzzy, direction, field, fieldsValue } = this.state;
    const { dispatch } = this.props;
    const payload = {
      pageNum,
      pageSize,
      taskTypeCode,
      ...fieldsValue,
    };
    if (fieldsValue.operStatus) {
      payload.operStatus = fieldsValue.operStatus.toString();
    }
    if (direction || field) {
      (payload.direction = direction), (payload.field = field);
    }
    if (fuzzy) {
      payload.fuzzy = fuzzy;
    }
    dispatch({
      type: 'diverGence/searchTableData',
      payload,
    });
  };

  // 条件查询
  searchBtn = fieldsValue => {
    this.setState(
      {
        pageNum: 1,
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
        fieldsValue: {},
        field: '',
        direction: '',
        fuzzy: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 模糊查询
  seachTableData = val => {
    this.setState(
      {
        fuzzy: val,
      },
      () => {
        this.handleGetTableList();
      },
    );
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
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  /**
   * 跳转新增页面
   * @method editTask
   */
  editTask() {
    this.props.fnLink('divergence:link', '');
  }

  /**
   * 方法说明 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="divergence:link">
        <Button type="primary" onClick={() => this.editTask()}>
          发起流程
        </Button>
      </Action>
    );
  };

  // /**
  //  * 批量操作
  //  * @method actionButton
  //  */
  // actionButton = () => {
  //   return (
  //     <>
  //       <Dropdown
  //         overlay={
  //           <Menu>
  //             <Menu.Item key="0">提交</Menu.Item>
  //             <Menu.Item key="1">认领</Menu.Item>
  //             <Menu.Item key="2">委托</Menu.Item>
  //             <Menu.Item key="3">退回</Menu.Item>
  //             <Menu.Item key="4">移交</Menu.Item>
  //           </Menu>
  //         }
  //         trigger={['click']}
  //       >
  //         <Button>批量操作</Button>
  //       </Dropdown>
  //     </>
  //   );
  // };

  /**
   * 方法说明  页码change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param filters
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        direction: sorter.order === 'ascend' ? 'asc' : 'desc',
        field: sorter.field,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  revokeBtn = record => {
    if (record.operStatus === 'S001_2' && record.revoke && record.revoke * 1 === 1) {
      return (
        <Action code="divergence:backOut">
          <a
            onClick={() => {
              this.dealTask(record, 'cancel');
            }}
            className={styles.rightBtn}
          >
            撤销
          </a>
        </Action>
      );
    }
  };

  dealTask(record, mark) {
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
    if (mark === 'handle') {
      // 办理
      params.id = record.id;
      params.proCode = record.proCode;
      params.mode = 'deal';
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'edit') {
      // 修改
      fnLink(
        'divergence:update',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'submit') {
      // 提交
      fnLink(
        'divergence:commit',
        `?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&proCode=${record.proCode}`,
      );
    } else if (mark === 'view') {
      // 详情
      this.props.dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'history') {
      //   console.log('流转历史');
      handleShowTransferHistory(record);
    } else if (mark === 'cancel') {
      Modal.confirm({
        title: '请确认是否撤销?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'diverGence/getRevokeFunc',
            payload: record.processInstanceId,
          }).then(data => {
            if (data) {
              this.handleGetTableList();
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
            type: 'diverGence/getDeleteFunc',
            payload: record.id,
          }).then(data => {
            if (data) {
              this.handleGetTableList();
            }
          });
        },
      });
    } else if (mark === 'copy') {
      fnLink('divergence:copy', `?processInstId=${record.processInstanceId}`);
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
        type: 'diverGence/getBatchSubmitByProCodeReq',
        payload: proCodes,
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

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      diverGence: { dataList, statusList },
      loading,
    } = this.props;
    const { taskTypeCode, columns } = this.state;
    const { TabPane } = Tabs;

    // 选择框
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
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              current: this.state.pageNum,
              total: this.props.diverGence.total,
              showTotal: total => `共 ${total} 条数据`,
            }}
            dataSource={dataList}
            columns={columns}
            scroll={{ x: columns.length * 300 + 100 }}
            onChange={this.handleTableChange}
            loading={loading}
            rowSelection={rowSelection}
            rowKey="taskId"
          />
          {/* <div className={styles.batshSelect}>{this.actionButton()}</div> */}
        </>
      );
    };

    const formItemData = [
      {
        name: 'title',
        label: '流程标题',
        type: 'input',
      },
      {
        name: 'operStatus',
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
          pageCode="divergence"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.searchBtn}
          resetFn={this.handleReset}
          searchPlaceholder="请输入流程标题/正文"
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
                    batchStyles={{ float: 'left', marginTop: '-50px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'operStatus',
                    }}
                    fn={this.handleGetTableList}
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
                    batchStyles={{ float: 'left', marginTop: '-50px', marginLeft: '10px' }}
                    opertations={{
                      tabs: this.state.taskTypeCode,
                      statusKey: 'operStatus',
                    }}
                    fn={this.handleGetTableList}
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
      connect(({ diverGence, loading, publicModel: { publicTas } }) => ({
        diverGence,
        publicTas,
        loading: loading.effects['diverGence/searchTableData'],
      }))(DiverGence),
    ),
  ),
);
export default WrappedSingleForm;

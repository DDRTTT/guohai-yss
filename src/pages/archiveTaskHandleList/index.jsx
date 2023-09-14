/**
 * 项目管理--底稿归档任务办理列表
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Button, Form, Card, Tag, Modal, Tooltip, message, Radio } from 'antd';
import { handleClearQuickJumperValue } from './util';
import PreciseSearch from './component/IndexPreciseSearch';
import FuzzySearch from './component/IndexFuzzySearch';
import { Table } from '@/components';

const { confirm } = Modal;
const fuzzySearchRef = React.createRef();
const initParams = {
  keyWords: '',
  pageNum: 1,
  pageSize: 10,
  direction: 'DESC',
  field: '',
  type: 1,
};

@Form.create()
class Index extends Component {
  state = {
    columns: [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'proCode',
        title: '项目编码',
        dataIndex: 'proCode',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'projectState',
        title: '项目阶段',
        dataIndex: 'projectState',
        sorter: true,
        width: 150,
        render: (text, record) => <span>{record.projectStateName}</span>,
      },
      {
        key: 'fileStatus',
        title: '当前用户任务',
        dataIndex: 'fileStatus',
        sorter: true,
        width: 150,
        render: text => (
          <Tag
            color={(() => {
              switch (text) {
                case '待提交':
                case '待审批':
                  return 'magenta';
                case '已办理':
                  return 'blue';
                default:
                  return '';
              }
            })()}
          >
            {text}
          </Tag>
        ),
      },
      {
        key: 'taskName',
        title: '任务名称',
        dataIndex: 'taskName',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'taskType',
        title: '任务类型',
        dataIndex: 'taskType',
        sorter: true,
        width: 150,
        render: (text, record) => <span>{record.taskTypeName}</span>,
      },
      {
        key: 'startTime',
        title: '开始时间',
        width: 120,
        dataIndex: 'startTime',
        sorter: true,
      },
      {
        key: 'endTime',
        title: '截止时间',
        dataIndex: 'endTime',
        sorter: true,
        width: 120,
      },
      {
        key: 'continueTime',
        title: '任务持续时间',
        dataIndex: 'continueTime',
        sorter: true,
        width: 150,
      },
      {
        key: 'priority',
        title: '优先级',
        dataIndex: 'priority',
        sorter: true,
        width: 100,
        render: text => <span>{['低', '中', '高'][text]}</span>,
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        width: 180,
      },
      {
        key: 'creatorId',
        title: '创建人',
        dataIndex: 'creatorId',
        sorter: true,
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip title={record.creatorName}>
            <span>{record.creatorName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'timeoutStatus',
        title: '超时状态',
        dataIndex: 'timeoutStatus',
        sorter: true,
        width: 120,
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        width: 120,
        sorter: true,
        render: text => (
          <Tag>{['未提交', '办理中', '已完成', '未归档', '已归档', '入库中', '已入库'][text]}</Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (text, record) => {
          switch (record.checked) {
            case 0: //未提交
              return (
                <>
                  <Action code="archiveTaskHandleList:submit">
                    <Button onClick={() => this.handleSubmit(record)} type="link">
                      提交
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:edit">
                    <Button onClick={() => this.handleJumpDetail(record, 1)} type="link">
                      修改
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:delete">
                    <Button onClick={() => this.handleDelete([record.id])} type="link">
                      删除
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:check">
                    <Button onClick={() => this.handleJumpReviewPage(record)} type="link">
                      审核
                    </Button>
                  </Action>
                </>
              );
            case 1: // 办理中
              return (
                <>
                  <Action code="archiveTaskHandleList:execute">
                    <Button onClick={() => this.handleExecute(record)} type="link">
                      办理
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:link">
                    <Button onClick={() => this.handleJumpDetail(record)} type="link">
                      查看
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:taskCompleted">
                    {record.taskType === 'archive' ? null : (
                      <Button onClick={() => this.handleTaskCompleted(record)} type="link">
                        任务完成
                      </Button>
                    )}
                  </Action>
                  {/* revoke=1可撤销  任务撤销 */}
                  <Action code="archiveTaskHandleList:taskRevoke">
                    {record.revoke === 1 ? (
                      <Button onClick={() => this.handleTaskRevoke(record)} type="link">
                        撤销
                      </Button>
                    ) : null}
                  </Action>
                  <Action code="archiveTaskHandleList:check">
                    <Button onClick={() => this.handleJumpReviewPage(record)} type="link">
                      审核
                    </Button>
                  </Action>
                </>
              );
            case 2: // 已完成
            case 4: // 已归档
              return (
                <>
                  <Action code="archiveTaskHandleList:link">
                    <Button onClick={() => this.handleJumpDetail(record)} type="link">
                      查看
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:check">
                    <Button onClick={() => this.handleJumpReviewPage(record)} type="link">
                      审核
                    </Button>
                  </Action>
                </>
              );
            case 3: // 未归档
              return (
                <>
                  <Action code="archiveTaskHandleList:link">
                    <Button onClick={() => this.handleJumpDetail(record)} type="link">
                      查看
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:taskUploadPrinting">
                    <Button onClick={() => this.handleTaskUploadPrinting(record)} type="link">
                      用印文件归档
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:check">
                    <Button onClick={() => this.handleJumpReviewPage(record)} type="link">
                      审核
                    </Button>
                  </Action>
                </>
              );
            case 5: // 入库中
            case 6: // 已入库
              return (
                <>
                  <Action code="archiveTaskHandleList:link">
                    <Button onClick={() => this.handleJumpDetail(record)} type="link">
                      查看
                    </Button>
                  </Action>
                  <Button onClick={() => this.handleJumpPhysicalArchivePage(record)} type="link">
                    审核
                  </Button>
                </>
              );
            default:
              return null;
          }
        },
      },
    ],
    params: {
      keyWords: '',
      pageNum: 1,
      pageSize: 10,
      direction: 'DESC',
      field: '',
      type: 1,
    },
    expand: false,
    selectedRows: [],
    selectedRowKeys: [],
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { radioType },
      },
    } = this.props;
    if (radioType === 0) {
      this.state.params.type = 0;
      initParams.type = 0;
      this.handleTableColumnTitle(0);
    } else {
      this.state.params.type = 1;
      initParams.type = 1;
    }

    // 任务类型
    dispatch({
      type: 'archiveTaskHandleList/getAwpTaskTypeReq',
    });
    // 任务名称
    dispatch({
      type: 'archiveTaskHandleList/getTaskNameReq',
    });

    this.handleProCodeData();
    this.handleGetTableData(this.state.params);
  }

  /**
   * 项目编码
   * **/
  handleProCodeData = (type = initParams.type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archiveTaskHandleList/getProCodeReq',
      payload: {
        type,
      },
    });
  };

  /**
   * 获取表格数据
   * **/
  handleGetTableData = params => {
    const { dispatch } = this.props;
    const { expand } = this.state;
    const payload = { ...params };
    expand && delete payload.keyWords;
    dispatch({
      type: 'archiveTaskHandleList/getTableListReq',
      payload,
      callback: () => {
        this.state.params = payload;
        if (this.state.selectedRowKeys.length) {
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
          });
        }
        handleClearQuickJumperValue();
      },
    });
  };

  /**
   * 查看修改跳转至详情 默认详情
   * 查看：type:0
   * 修改：type:1
   * * */
  handleJumpDetail = ({ proCode, id } = record, type = 0) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/taskManagementStart',
        query: {
          type,
          data: proCode,
          id,
          radioType: initParams.type,
        },
      }),
    );
  };

  /**
   * 跳转到二级审核审核页面
   * **/
  handleJumpReviewPage = ({ id, proCode, proName }) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/archiveTaskHandleList/review',
        query: {
          id,
          proCode,
          proName,
          radioType: initParams.type,
        },
      }),
    );
  };

  /**
   * 跳转到物理归档入库页面
   * **/
  handleJumpPhysicalArchivePage = ({ id, proCode, checked }) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentPhysicalArchive',
        query: {
          id,
          proCode,
          radioType: initParams.type,
          checked,
        },
      }),
    );
  };

  /**
   * 办理（跳页面）
   * taskType=archive用印页面 否则 为办理页面
   * * */
  handleExecute({ proCode, proName, id, taskType, taskName, path }) {
    const { dispatch } = this.props;
    const otherQuery = {};
    if (taskType !== 'archive') {
      if (path === 0) return message.error('项目目录树未生成~');
      dispatch(
        routerRedux.push({
          pathname: '/projectManagement/taskManagementDeal',
          query: {
            proCode,
            proName,
            id,
            radioType: initParams.type,
          },
        }),
      );
      return;
    }

    if (taskName === '归档文件更新') {
      otherQuery.pageType = 'update';
      otherQuery.pageSource = 'archiveTaskHandleListPage';
    }
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/archiveTaskHandleListUploadPrinting',
        query: {
          generateArchiveTask: 0,
          taskIdArchive: id,
          type: 1,
          proCode,
          ...otherQuery,
          radioType: initParams.type,
        },
      }),
    );
  }

  /**
   * 跳转至用印上传页面
   * * */
  handleTaskUploadPrinting = ({ proCode, id }) => {
    confirm({
      maskClosable: true,
      title: '用印文件归档',
      content: '是否发起用印文件归档任务?',
      onOk: () => {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/projectManagement/archiveTaskHandleListUploadPrinting',
            query: {
              generateArchiveTask: 1,
              type: 1,
              proCode,
              taskIdConventional: id,
              radioType: initParams.type,
            },
          }),
        );
      },
    });
  };

  /**
   * 任务发起：页面跳转至任务发起页面
   * **/
  handleJumpTaskStart = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/taskManagementStart',
      }),
    );
  };

  /**
   * 简单封装
   * 提交、撤销、删除、完成
   * **/
  submitRevokeDeleteCompletedFn = ({ content = '', type = '', payload = {} }) => {
    confirm({
      maskClosable: true,
      content,
      onOk: () => {
        this.props.dispatch({
          type,
          payload,
          callback: () => {
            this.handleGetTableData(this.state.params);
          },
        });
      },
    });
  };

  /**
   * 提交
   * * */
  handleSubmit({ id }) {
    this.submitRevokeDeleteCompletedFn({
      content: '确定提交吗?',
      type: 'archiveTaskHandleList/getCommitByIdReq',
      payload: { id },
    });
  }

  /**
   * 撤销
   * 任务撤销，办理中任务状态revoke=1时刻撤销
   * * */
  handleTaskRevoke({ id }) {
    this.submitRevokeDeleteCompletedFn({
      content: '请确认是否撤销当前任务?',
      type: 'archiveTaskHandleList/getTaskRevokeReq',
      payload: { id },
    });
  }

  /**
   * 删除：接口参数值为record.id
   * * */
  handleDelete(ids) {
    this.submitRevokeDeleteCompletedFn({
      content: '请确认是否删除当前任务?',
      type: 'archiveTaskHandleList/getDeleteReq',
      payload: { ids },
    });
  }

  /**
   * 办理中：任务完成结束任务
   * * */
  handleTaskCompleted({ id }) {
    this.props.dispatch({
      type: 'archiveTaskHandleList/getFileSizeReq',
      payload: {
        taskId: id,
      },
      callback: res => {
        const fileSize = res.data;
        this.submitRevokeDeleteCompletedFn({
          content: fileSize ? '请确认是否完成任务?' : '当前任务未上传文件，请确认是否完成?',
          type: 'archiveTaskHandleList/getConventionalEndReq',
          payload: { id },
        });
      },
    });
  }

  /**
   * @method handleRowSelectChange checkbox触发
   * @param {*selectedRowKeys} 序号ID
   * @param {*selectedRows} 选中的行
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange = ({ current, pageSize }, field, sorter) => {
    this.state.params.pageNum = current;
    this.state.params.pageSize = pageSize;
    const { params } = this.state;
    params.field = sorter.field;
    switch (sorter.order) {
      case 'ascend':
        params.direction = 'ASC';
        break;
      case 'descend':
        params.direction = 'DESC';
        break;
      default:
        params.direction = '';
        params.field = '';
    }
    this.handleGetTableData(params);
  };

  /**
   * 展开/收起 切换
   * **/
  handleToggle = () => {
    this.setState(({ expand }) => ({ expand: !expand }));
  };

  /**
   * table表格列标题显示：项目或者系列
   * **/
  handleTableColumnTitle = type => {
    return this.state.columns.map(item => {
      if (type === 0 && item.title.includes('项目')) {
        item.title = item.title.replace('项目', '系列');
      }
      if (type === 1 && item.title.includes('系列')) {
        item.title = item.title.replace('系列', '项目');
      }
      return item;
    });
  };

  /**
   * tab切换
   * type:1项目,2系列
   * **/
  handleRadioChange = e => {
    const type = e.target.value;
    const columns = this.handleTableColumnTitle(type);
    initParams.type = type;
    this.setState({ columns, expand: false }, () => {
      fuzzySearchRef.current && fuzzySearchRef.current.handleReset();
      this.handleProCodeData(type);
      this.handleGetTableData(initParams);
    });
  };

  render() {
    const {
      selectedRowKeys,
      columns,
      params: { pageSize, pageNum, type },
      expand,
    } = this.state;
    const {
      archiveTaskHandleList: { tableList, proCode, taskType, taskName },
      form,
      loading,
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.checked !== 0,
      }),
    };

    return (
      <>
        {/* 高级搜索 */}
        <Card bordered={false}>
          {expand ? (
            <PreciseSearch
              props={{ form, proCode, taskType, taskName, initParams }}
              handleToggle={this.handleToggle}
              handleGetTableData={this.handleGetTableData}
            />
          ) : (
            <FuzzySearch
              props={{
                form,
                initParams,
              }}
              handleToggle={this.handleToggle}
              handleGetTableData={this.handleGetTableData}
              ref={fuzzySearchRef}
            />
          )}
        </Card>
        <Card bordered={false} style={{ marginTop: '12px' }}>
          <div
            style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Radio.Group
              buttonStyle="solid"
              defaultValue={1}
              value={type}
              onChange={this.handleRadioChange}
            >
              <Action code="archiveTaskHandleList:projectReport">
                <Radio.Button value={1}>项目任务</Radio.Button>
              </Action>
              <Action code="archiveTaskHandleList:seriesReport">
                <Radio.Button value={0}>系列任务</Radio.Button>
              </Action>
            </Radio.Group>
            <Action code="archiveTaskHandleList:initiateTask">
              <Button type="primary" onClick={this.handleJumpTaskStart}>
                发起任务
              </Button>
            </Action>
          </div>
          <Table
            rowKey={record => record.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableList.rows}
            scroll={{ x: columns.length * 160 + 300 }}
            onChange={this.sortChange}
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              current: pageNum,
              pageSize: pageSize,
              total: tableList.total,
              showTotal: total => `共 ${total} 条数据`,
            }}
          />
          <Action code="archiveTaskHandleList:delete">
            <Button
              disabled={selectedRowKeys.length === 0}
              style={{
                float: 'left',
                marginTop: '-40px',
              }}
              onClick={() => this.handleDelete(selectedRowKeys)}
            >
              批量删除
            </Button>
          </Action>
        </Card>
      </>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ archiveTaskHandleList, loading }) => {
        const tableLoading =
          loading.effects['archiveTaskHandleList/getTableListReq'] ||
          loading.effects['archiveTaskHandleList/getCommitByIdReq'] ||
          loading.effects['archiveTaskHandleList/getTaskRevokeReq'] ||
          loading.effects['archiveTaskHandleList/getDeleteReq'] ||
          loading.effects['archiveTaskHandleList/getConventionalEndReq'];
        return {
          archiveTaskHandleList,
          loading: tableLoading,
        };
      })(Index),
    ),
  ),
);

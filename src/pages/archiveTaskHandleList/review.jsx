/**
 * 项目管理--底稿归档任务办理--二级审批页面
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Button,
  Table,
  Form,
  Card,
  Tag,
  Modal,
  Dropdown,
  Tooltip,
  Menu,
  message,
  Layout,
  Breadcrumb,
  Icon,
} from 'antd';
import { handleClearQuickJumperValue } from './util';
import ReviewOpinion from '@/components/ReviewOpinion';
import ReviewModal from './component/ReviewModal';
import Preview from '@/components/Preview';
import DownloadFile from '@/components/DownloadFile';
import PreciseSearch from './component/ReviewPreciseSearch';
import FuzzySearch from './component/ReviewFuzzySearch';
import SelfTree from '@/components/SelfTree';

const { confirm } = Modal;
const { Sider, Content } = Layout;
const fuzzySearchRef = React.createRef();
const initParams = {
  keyWords: '',
  pageNum: 1,
  pageSize: 10,
  direction: 'desc',
  field: '',
};

@Form.create()
class Review extends Component {
  state = {
    columns: [
      {
        key: 'awpName',
        title: '文档名称',
        width: 200,
        dataIndex: 'awpName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={record.awpName}>
            <span>{record.awpName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'stateName',
        title: '文件状态',
        dataIndex: 'stateName',
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'processType',
        title: '办理状态',
        width: 120,
        dataIndex: 'processType',
        sorter: true,
        render: text => {
          switch (text) {
            case 'gtasksFile':
              return <Tag color="magenta">待办理</Tag>;
            case 'completedFile':
              return <Tag color="orange">已办理</Tag>;
            case 'readOnly':
              return <Tag>只读</Tag>;
            default:
              return '';
          }
        },
      },
      {
        key: 'needUseSeal',
        title: '是否需要用印',
        width: 150,
        dataIndex: 'needUseSeal',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        key: 'useSeal',
        title: '是否用印文档',
        width: 150,
        dataIndex: 'useSeal',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <DownloadFile buttonType="link" record={[record]} />
              <Button type="link" size="small" onClick={() => this.handlePreview(record)}>
                查看
              </Button>
              {/* 待办理 */}
              <Action code="archiveTaskHandleList:reviewPass">
                {record && record.processType === 'gtasksFile' ? (
                  <ReviewModal buttonType="link" payload={[record]} success={this.handleSuccess} />
                ) : null}
              </Action>
              {/* 审核意见 */}
              {record && record.opinion === 1 ? (
                <Action code="archiveTaskHandleList:reviewOpinion">
                  <ReviewOpinion processInstanceId={record.processInstanceId} />
                </Action>
              ) : null}
              {/* revoke=1 文件撤销 */}
              {record && record.revoke === 1 ? (
                <Action code="archiveTaskHandleList:fileRevoke">
                  <Button type="link" size="small" onClick={() => this.handleFileRevoke(record)}>
                    撤销
                  </Button>
                </Action>
              ) : null}
              {/* 流转历史 */}
              {record && record.processInstanceId ? (
                <Button type="link" size="small" onClick={() => this.handleGetTaskId(record)}>
                  流转历史
                </Button>
              ) : null}
            </>
          );
        },
      },
    ],
    params: {
      keyWords: '',
      pageNum: 1,
      pageSize: 10,
      direction: 'desc',
      field: '',
      taskId: '',
    },
    expand: false,
    selectedRows: {},
    selectedRowKeys: [],
    previewShow: false,
    collapsed: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { id, proCode },
      },
    } = this.props;
    initParams.taskId = id;
    initParams.proCode = proCode;
    this.state.params.taskId = id;
    this.state.params.proCode = proCode;

    // 文档名称
    dispatch({
      type: 'review/getHandleInfoFileNamesReq',
      payload: {
        taskId: id,
      },
    });

    // table表格数据
    this.handleGetTableData(this.state.params);
    // treeData
    this.handleGetSysTreeData();
  }

  /**
   * 获取目录树数据
   * **/
  handleGetSysTreeData = () => {
    const { dispatch } = this.props;
    const { proCode, taskId } = initParams;
    dispatch({
      type: 'taskManagementDeal/getSysTreeReq',
      payload: {
        code: proCode,
        taskId,
      },
    });
  };

  /**
   * 获取流转历史所需的taskId
   * **/
  handleGetTaskId = ({ processInstanceId }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskManagementDeal/getCurrentNodeIdByProcessIdsReq',
      payload: {
        processInstanceIds: [processInstanceId],
      },
      callback: res => {
        if (res.data) {
          dispatch(
            routerRedux.push({
              pathname: '/processCenter/processHistory',
              query: {
                processInstanceId,
                taskId: res.data[0].id,
              },
            }),
          );
        }
      },
    });
  };

  /**
   * 获取表格数据
   * **/
  handleGetTableData = (params, type = '') => {
    const { dispatch } = this.props;
    const { expand, selectedRowKeys, selectedRows } = this.state;
    const payload = { ...params };
    expand && delete payload.keyWords;
    dispatch({
      type: 'review/getTableListReq',
      payload,
      callback: () => {
        this.state.params = payload;
        if (selectedRowKeys.length > 0 && type !== 'sortChange') {
          this.setState({
            selectedRowKeys: [],
            selectedRows: {},
          });
        }
        handleClearQuickJumperValue();
      },
    });
  };

  /**
   * 审批 成功后的回调
   * **/
  handleSuccess = () => {
    this.handleGetTableData(this.state.params);
  };

  /**
   * 撤销
   * 文档状态revoke=1时可撤销
   * * */
  handleFileRevoke = ({ id, processInstanceId }) => {
    const { dispatch } = this.props;
    confirm({
      maskClosable: true,
      content: '请确认是否撤销当前文档？',
      onOk: () => {
        dispatch({
          type: 'review/getFileRevokeReq',
          payload: {
            fileId: id,
            processInstanceId,
          },
          callback: () => {
            this.handleGetTableData(this.state.params);
          },
        });
      },
    });
  };

  /**
   * @method handleRowSelectChange checkbox触发
   * @param {*selectedRowKeys} 序号ID
   * @param {*selectedRows} 选中的行
   */
  handleRowSelectChange = (selectedRowKeys = [], selectedRowsInfo = []) => {
    let { selectedRows } = this.state;

    if (selectedRowKeys.length > 0) {
      selectedRowKeys.forEach(pItem => {
        selectedRowsInfo.forEach(cItem => {
          if (pItem === cItem.id) {
            selectedRows[pItem] = cItem;
          }
        });
      });

      for (let key in selectedRows) {
        if (!selectedRowKeys.includes(key)) {
          delete selectedRows[key];
        }
      }
    } else {
      selectedRows = {};
    }

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
    this.handleGetTableData(params, 'sortChange');
  };

  /**
   * 显示预览框
   * **/
  handlePreview = record => {
    this.setState(
      {
        previewShow: true,
      },
      () => {
        this.previewChild.handlePreview(record);
      },
    );
  };

  /**
   * 切换
   * **/
  handleToggle = () => {
    this.setState(({ expand }) => ({ expand: !expand }));
  };

  /**
   * 返回
   * **/
  handleBackPage = () => {
    const {
      dispatch,
      location: {
        query: { radioType },
      },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/archiveTaskHandleList/index',
        query: { radioType },
      }),
    );
  };

  /**
   * 处理审批通过和审批拒绝的提交参数
   * **/
  handleReviewSubmitParams = () => {
    const { selectedRows } = this.state;
    const arr = [];
    for (let key in selectedRows) {
      arr.push(selectedRows[key]);
    }

    return arr;
  };

  /**
   * 催办
   * **/
  handleSendReminder = () => {
    const {
      dispatch,
      location: {
        query: { proCode, proName },
      },
      review: {
        tableList: { rows = [] },
      },
    } = this.props;
    const bool = rows.some(item => item.processType === 'completedFile' && item.state === 1);
    if (!bool) {
      return message.warn('当前页数据暂无可进行催办的文件');
    }
    dispatch({
      type: 'review/getSendReminderReq',
      payload: {
        node: '2',
        proCode,
        proName,
      },
    });
  };

  /**
   * 获取子组件信息
   * * */
  getClickMsg = (result, msg) => {
    this.state.clickMsgData = msg;
    const { code } = msg;
    this.setState({
      expand: false,
    });
    fuzzySearchRef.current && fuzzySearchRef.current.handleReset();
    code ? (initParams.awpCode = code) : delete initParams.awpCode;
    this.handleGetTableData(initParams);
  };

  render() {
    const {
      expand,
      columns,
      selectedRowKeys,
      previewShow,
      params: { pageNum, pageSize },
      collapsed,
    } = this.state;
    const {
      loading,
      form,
      review: { tableList, fileNames },
      taskManagementDeal: { saveTreeData },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <Card
        bordered={false}
        title={
          <>
            <Breadcrumb>
              <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目任务管理</Breadcrumb.Item>
              <Breadcrumb.Item>审核</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
        extra={
          <>
            <Button
              type="primary"
              style={{ marginRight: '12px' }}
              onClick={this.handleSendReminder}
            >
              催办
            </Button>
            <Button onClick={this.handleBackPage}>取消</Button>
          </>
        }
      >
        <Layout style={{ backgroundColor: '#fff' }}>
          <Sider
            breakpoint="lg"
            theme="light"
            width={350}
            style={{
              margin: '15px',
              overflowY: 'auto',
            }}
            trigger={null}
            collapsed={collapsed}
          >
            <div>
              <SelfTree
                treeData={saveTreeData}
                multipleFlag={false}
                getCheckMsg={() => null}
                getClickMsg={this.getClickMsg}
                ref={ref => (this.selfTreeRef = ref)}
              />
            </div>
          </Sider>
          <Content>
            <Card
              title={
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Icon
                      style={{ color: 'blue' }}
                      type={collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={() => this.setState({ collapsed: !collapsed })}
                    />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>文档清单</Breadcrumb.Item>
                </Breadcrumb>
              }
            >
              {/* 文档预览modal */}
              {previewShow ? <Preview onRef={ref => (this.previewChild = ref)} /> : null}
              {/* 高级搜索 */}
              {expand ? (
                <PreciseSearch
                  props={{ form, fileNames, initParams }}
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
              <Table
                rowKey={record => record.id}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableList.rows}
                scroll={{ x: columns.length * 200 }}
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
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">
                      <Action code="archiveTaskHandleList:reviewPass">
                        <ReviewModal
                          buttonType="link"
                          buttonText="批量审批"
                          payload={this.handleReviewSubmitParams()}
                          success={this.handleSuccess}
                        />
                      </Action>
                    </Menu.Item>
                    <Menu.Item key="1">
                      <DownloadFile
                        buttonType="link"
                        buttonText="批量下载"
                        record={this.handleReviewSubmitParams()}
                        success={this.handleRowSelectChange}
                      />
                    </Menu.Item>
                  </Menu>
                }
                placement="topCenter"
                arrow
                disabled={this.handleReviewSubmitParams().length === 0}
              >
                <Button style={{ float: 'left', marginTop: '-48px' }}>批量操作</Button>
              </Dropdown>
            </Card>
          </Content>
        </Layout>
      </Card>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ global, review, taskManagementDeal, loading, router }) => {
        const tableLoading =
          loading.effects['review/getTableListReq'] || loading.effects['review/getFileRevokeReq'];
        return {
          review,
          taskManagementDeal,
          router,
          global,
          loading: tableLoading,
        };
      })(Review),
    ),
  ),
);

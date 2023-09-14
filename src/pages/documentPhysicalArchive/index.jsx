import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Button,
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
import { Table } from '@/components';
import { handleClearQuickJumperValue } from './util';
import FileHistoryVersion from '@/components/FileHistoryVersion';
import Preview from '@/components/Preview';
import DownloadFile from '@/components/DownloadFile';
import PreciseSearch from './component/PreciseSearch';
import FuzzySearch from './component/FuzzySearch';
import SelfTree from '@/components/SelfTree';
import ReviewModal from './component/ReviewModal';
import FileBoxNumber from './component/FileBoxNumber';

const { confirm } = Modal;
const { Sider, Content } = Layout;
const fuzzySearchRef = React.createRef();
class Index extends Component {
  state = {
    columns: [
      {
        key: 'awpName',
        title: '文档名称',
        width: 250,
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
        key: 'state',
        title: '文件状态',
        dataIndex: 'state',
        width: 120,
        sorter: true,
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'handleStatus',
        title: '办理状态',
        dataIndex: 'handleStatus',
        width: 120,
        sorter: true,
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'fileNum',
        title: '档案盒号',
        width: 150,
        dataIndex: 'fileNum',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={record.fileBoxNum}>
            <span>{record.fileBoxNum}</span>
          </Tooltip>
        ),
      },
      {
        key: 'needUseSeal',
        dataIndex: 'needUseSeal',
        title: '是否需要用印',
        width: 150,
        sorter: true,
      },
      {
        key: 'useSeal',
        title: '是否用印文档',
        width: 150,
        dataIndex: 'useSeal',
        sorter: true,
      },
      {
        key: 'createTime',
        title: '上传时间',
        width: 200,
        dataIndex: 'createTime',
        sorter: true,
      },
      {
        key: 'version',
        title: '版本号',
        width: 100,
        dataIndex: 'version',
        sorter: true,
        render: (text, record) => <FileHistoryVersion fileId={record.id} buttonText={text} />,
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <DownloadFile buttonType="link" record={[record]} />
              <Button type="link" size="small" onClick={() => this.handlePreview(record)}>
                查看
              </Button>
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
    },
    initParams: {
      keyWords: '',
      pageNum: 1,
      pageSize: 10,
      direction: 'desc',
      field: '',
      proCode: '',
      taskId: '',
    },
    expand: false,
    selectedRows: {},
    selectedRowKeys: [],
    previewShow: false,
    collapsed: false,
    submiting: false,
    ableSubmit: false,
    ableReview: false,
    ableFileBoxNumber: false,
    ablePhysicalArchive: false,
    ableRevoke: false,
    isRevoking: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { proCode, id },
      },
    } = this.props;

    this.state.params.taskId = id;
    this.state.params.proCode = proCode;
    this.state.initParams.taskId = id;
    this.state.initParams.proCode = proCode;

    // table表格数据
    this.handleGetTableData(this.state.params);

    // treeData
    this.handleGetSysTreeData();

    // 文档名称下拉列表
    dispatch({
      type: 'manuscriptManagementList/getFileNameListReq',
      payload: {
        proCode,
        inType: '3',
      },
    });
  }

  /**
   * 获取表格数据
   * **/
  handleGetTableData = (params, type = '') => {
    const {
      dispatch,
      location: {
        query: { checked },
      },
    } = this.props;
    const { expand, selectedRowKeys } = this.state;
    const payload = { ...params };

    if (payload.taskId) {
      delete payload.proCode;
    }

    expand && delete payload.keyWords;

    dispatch({
      type: 'documentPhysicalArchive/getFileListReq',
      payload,
      callback: res => {
        const { data } = res;
        if (data && data.total > 0) {
          const {
            handleStatus,
            state,
            relationBoxNumSize,
            processInstanceId,
            revoke,
          } = data.rows[0];
          this.state.params = payload;

          // 第一个节点：提交
          if (checked == 0 && data) {
            this.setState({
              ableSubmit: data && data.total !== 0,
            });
          }

          if (checked == 5 && data) {
            this.setState({
              ablePhysicalArchive: relationBoxNumSize === data.total, // 第一个节点提交之后不可以在提交
              ableReview: state !== '已归档' && handleStatus === '待办理', // 第二个、第三个审批节点：审批
              ableSubmit: state === '已归档' && handleStatus === '待办理', // 撤销之后可以重新提交
            });

            dispatch({
              type: 'documentPhysicalArchive/getTaskQueryProcessIdReq',
              payload: {
                processInstanceId,
              },
              callback: result => {
                if (result.data) {
                  // 最后一个节点：录入档案盒号、审批（切记后端修改流程模板name，前端也要修改，通过流程模板name判断）
                  // 最后一个节点的判断条件，流程模板name及文件的办理状态，ablePhysicalArchive 档案盒号全部录入完成，可进行最后的归档入库操作
                  this.setState({
                    ableFileBoxNumber:
                      handleStatus === '待办理' && result.data[0].name === '办公室行政部门确认归档', //判断是否是最后一个节点
                  });
                }
              },
            });
          }

          // 撤销
          if (checked != 0 && checked != 6 && data) {
            this.setState({
              ableRevoke: revoke,
            });
          }
        }

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
   * 获取目录树数据
   * **/
  handleGetSysTreeData = () => {
    const { dispatch } = this.props;
    const {
      params: { proCode },
    } = this.state;
    dispatch({
      type: 'documentPhysicalArchive/getSysTreeReq',
      payload: {
        code: proCode,
      },
    });
  };

  /**
   * 获取流转历史所需的taskId
   * **/
  handleGetTaskId = ({ processInstanceId }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentPhysicalArchive/getCurrentNodeIdByProcessIdsReq',
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
   * 获取子组件信息
   * * */
  getClickMsg = (result, msg) => {
    this.state.clickMsgData = msg;
    const { code } = msg;
    this.setState({
      expand: false,
    });
    fuzzySearchRef.current && fuzzySearchRef.current.handleReset();
    code ? (this.state.initParams.awpCode = code) : delete this.state.initParams.awpCode;
    this.handleGetTableData(this.state.initParams);
  };

  /**
   * 提交
   * **/
  handleSubmit = () => {
    const {
      dispatch,
      location: {
        query: { proCode, id },
      },
    } = this.props;

    this.setState({ submiting: true });
    dispatch({
      type: 'documentPhysicalArchive/getFileCommitReq',
      payload: id ? { taskId: id, proCode } : { proCode },
      callback: res => {
        if (res && res.status === 200) {
          message.success('提交成功~');
          if (!id) {
            this.handleBackPage();
            return;
          }
          this.handleGetTableData(this.state.params);
        } else {
          message.error(res.message);
        }
        this.setState({ submiting: false });
      },
    });
  };

  /**
   * 撤销
   * **/
  handleRevoke = () => {
    const {
      dispatch,
      location: {
        query: { id },
      },
      documentPhysicalArchive: {
        tableList: { rows },
      },
    } = this.props;

    this.setState({ isRevoking: true });
    dispatch({
      type: 'documentPhysicalArchive/getBatchRevokeReq',
      payload: {
        taskId: id,
        processInstanceId: rows[0].processInstanceId,
      },
      callback: res => {
        if (res && res.status === 200) {
          message.success('撤销成功~');
          if (res.data === 2) {
            this.handleBackPage();
            return;
          }
          this.handleGetTableData(this.state.params);
        } else {
          message.error(res.message);
        }
        this.setState({ isRevoking: false });
      },
    });
  };

  render() {
    const {
      expand,
      columns,
      selectedRowKeys,
      previewShow,
      params: { pageNum, pageSize, taskId },
      initParams,
      collapsed,
      submiting,
      ableSubmit,
      ableReview,
      ableFileBoxNumber,
      ablePhysicalArchive,
      ableRevoke,
      isRevoking,
    } = this.state;
    const {
      loading,
      form,
      documentPhysicalArchive: { saveTreeData, tableList },
      manuscriptManagementList: { fileNameList },
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
              <Breadcrumb.Item>项目文档管理</Breadcrumb.Item>
              <Breadcrumb.Item>物理归档入库</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
        extra={
          <>
            {/* 页面来源：项目文档管理 物理归档入库 */}
            {ableSubmit ? (
              <Action code="documentManagement:physicalArchiveSubmit">
                <Button
                  style={{ marginRight: '12px' }}
                  type="primary"
                  loading={submiting}
                  onClick={this.handleSubmit}
                >
                  提交
                </Button>
              </Action>
            ) : null}
            {/* 页面来源：项目任务管理 状态为入库中 审核 */}
            {(ableReview && !ableFileBoxNumber) ||
            (ableReview && ableFileBoxNumber && ablePhysicalArchive) ? (
              <Action code="documentManagement:physicalArchiveReview">
                <ReviewModal
                  taskId={taskId}
                  updateTable={() => this.handleGetTableData(this.state.params)}
                />
              </Action>
            ) : null}
            {ableRevoke ? (
              <Action code="documentManagement:physicalArchiveRevoke">
                <Button
                  style={{ marginRight: '12px' }}
                  loading={isRevoking}
                  onClick={this.handleRevoke}
                >
                  撤销
                </Button>
              </Action>
            ) : null}
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
                  props={{ form, fileNames: fileNameList, initParams }}
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
                scroll={{ x: columns.length * 150 + 450 }}
                onChange={this.sortChange}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  current: pageNum,
                  pageSize,
                  total: tableList.total,
                  showTotal: total => `共 ${total} 条数据`,
                }}
              />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">
                      {ableFileBoxNumber ? (
                        <Action code="documentManagement:physicalArchiveFileBoxNumber">
                          <FileBoxNumber
                            record={this.handleReviewSubmitParams()}
                            updateTable={() => this.handleGetTableData(this.state.params)}
                          />
                        </Action>
                      ) : null}
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
      connect(({ documentPhysicalArchive, manuscriptManagementList }) => {
        return {
          documentPhysicalArchive,
          manuscriptManagementList,
        };
      })(Index),
    ),
  ),
);

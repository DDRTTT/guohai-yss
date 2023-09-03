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
  Dropdown,
  Tooltip,
  Menu,
  message,
  Layout,
  Breadcrumb,
  Icon,
  Upload,
} from 'antd';
import { handleClearQuickJumperValue } from './util';
import FileHistoryVersion from '@/components/FileHistoryVersion';
import Preview from '@/components/Preview';
import DownloadFile from '@/components/DownloadFile';
import PreciseSearch from './component/PreciseSearch';
import FuzzySearch from './component/FuzzySearch';
import SelfTree from '@/components/SelfTree';
import ReviewModal from './component/ReviewModal';
import FileBoxNumber from './component/FileBoxNumber';
import { downloadFile } from '@/utils/download';
import { getAuthToken } from '@/utils/session';

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
        key: 'awpPathName',
        title: '底稿目录',
        width: 250,
        dataIndex: 'awpPathName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
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
        key: 'fileBoxNum',
        title: '档案盒号',
        width: 150,
        dataIndex: 'fileBoxNum',
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
              <DownloadFile
                buttonType="link"
                record={[{ ...record, awpFileNumber: record.fileNum }]}
              />
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
    haveBoxNumNoInput: false,
    ableRevoke: false,
    isRevoking: false,
    uploadBtnLoading: false,
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
   * * */
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
          const { handleStatus, state, relationBoxNumSize, revoke } = data.rows[0];
          this.state.params = payload;

          // 第一个节点：提交
          if (checked == 0 && data) {
            this.setState({
              ableSubmit: data.total !== 0,
              haveBoxNumNoInput: relationBoxNumSize === data.total, // 是否存在未录入的档案盒号，相当表示不存在
            });
          }

          if (checked == 5 && data) {
            this.setState({
              ableReview: state !== '已归档' && handleStatus === '待办理', // 第二个、第三个审批节点：审批
              ableSubmit: state === '已归档' && handleStatus === '待办理', // 撤销之后可以重新提交
              haveBoxNumNoInput: relationBoxNumSize === data.total,
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
   * * */
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
   * * */
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

      Object.keys(selectedRows).forEach(key => {
        if (!selectedRowKeys.includes(key)) {
          delete selectedRows[key];
        }
      });
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
   * * */
  handlePreview = record => {
    this.setState(
      {
        previewShow: true,
      },
      () => {
        this.previewChild.handlePreview({ ...record, awpFileNumber: record.fileNum });
      },
    );
  };

  /**
   * 切换
   * * */
  handleToggle = () => {
    this.setState(({ expand }) => ({ expand: !expand }));
  };

  /**
   * 返回
   * * */
  handleBackPage = () => {
    const {
      dispatch,
      location: {
        query: { radioType },
      },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentManagement',
        query: { radioType },
      }),
    );
  };

  /**
   * 处理审批通过和审批拒绝的提交参数
   * * */
  handleReviewSubmitParams = () => {
    const { selectedRows } = this.state;
    return Object.values(selectedRows).map(item => item);
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
   * * */
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
   * * */
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

  // 导出
  handleCanDownload = () => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
    } = this.props;
    dispatch({
      type: 'documentPhysicalArchive/getDownload',
      payload: proCode,
      callback: res => {
        downloadFile(res, '文档清单.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        message.success('导出成功 !');
      },
    });
  };

  uploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadBtnLoading: true });
    }
    if (info.file.status === 'done') {
      if (info?.file?.response?.status === 200) {
        message.success(`${info.file.name} 导入成功`);
        this.handleGetTableData(this.state.initParams);
      } else {
        message.warn(`${info.file.response.message}`);
      }
      this.setState({ uploadBtnLoading: false });
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 导入失败，请稍后再试`);
      this.setState({ uploadBtnLoading: false });
    }
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
      haveBoxNumNoInput,
      ableRevoke,
      isRevoking,
      uploadBtnLoading,
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

   

  // 导入
  const uploadContractProps = {
    action: '/ams/yss-awp-server/awp/task/import',
    name: 'multipartFile',
    method: 'post',
    headers: {
      Token: getAuthToken(),
    },
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
            {ableSubmit ? (
              <>
                <Action code="documentManagement:import">
                  <Upload
                    {...uploadContractProps}
                    accept=".xlsx"
                    onChange={this.uploadChange}
                    showUploadList={false}
                  >
                    <Button
                      loading={uploadBtnLoading}
                      disabled={uploadBtnLoading}
                      style={{ marginRight: 8 }}
                    >
                      导入
                    </Button>
                  </Upload>
                </Action>

                <Action code="documentManagement:export">
                  <Button
                    style={{ marginRight: '12px' }}
                    type="primary"
                    onClick={this.handleCanDownload}
                  >
                    全部导出
                  </Button>
                </Action>
                {/* 第一个节点：提交，档案盒号已完全录入完成 */}
                {/* 录入档案盒号 */}
                <Action code="documentManagement:physicalArchiveFileBoxNumber">
                  <FileBoxNumber
                    record={this.handleReviewSubmitParams()}
                    updateTable={() => this.handleGetTableData(this.state.params)}
                  />
                </Action>
                <Action code="documentManagement:physicalArchiveSubmit">
                  <Button
                    style={{ marginRight: '12px' }}
                    type="primary"
                    disabled={!haveBoxNumNoInput}
                    loading={submiting}
                    onClick={this.handleSubmit}
                  >
                    全部提交
                  </Button>
                </Action>
              </>
            ) : null}
            {/* 第一个节点：提交之后发起人可进行撤销 */}
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
            {/* 第二、三、四个节点：审核 */}
            {ableReview ? (
              <Action code="documentManagement:physicalArchiveReview">
                <ReviewModal
                  taskId={taskId}
                  updateTable={() => this.handleGetTableData(this.state.params)}
                />
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
                      <DownloadFile
                        buttonType="link"
                        buttonText="批量下载"
                        record={this.handleReviewSubmitParams().map(item => ({
                          ...item,
                          awpFileNumber: item.fileNum,
                        }))}
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

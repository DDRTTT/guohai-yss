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
  Modal
} from 'antd';
import { handleClearQuickJumperValue } from './util';
import FileHistoryVersion from '@/components/FileHistoryVersion';
import Preview from '@/components/Preview';
import DownloadFile from '@/components/DownloadFile';
import PreciseSearch from './component/PreciseSearch';
import FuzzySearch from './component/FuzzySearch';
import SelfTree from '@/components/SelfTree';
import { downloadFile } from '@/utils/download';
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
        key: 'isExtend',
        title: '继承状态',
        dataIndex: 'isExtend',
        width: 120,
        sorter: true,
        render: text => <span>{text === '1' ? '已继承' : '未继承'}</span>,
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
        render: (text, record) => (
          <Action code="projectAndSeriesQuery:getFileHistory">
            <FileHistoryVersion fileId={record.id} buttonText={text} />
          </Action>
        ),
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
    isAddAllExtends: false,
    isRemoveAllExtends: false,
    isAddSelectedExtends: false,
    isRemoveSelectedExtends: false,
    visible: false,
    resMessage:'',
    errorList:[],
  };

  componentDidMount() {
    const {
      location: {
        query: { proCode, seriesCode, id },
      },
    } = this.props;
    const params = {
      ...this.state.params,
      taskId: id,
      proCode,
      seriesCode,
    };
    const initParams = {
      ...this.state.initParams,
      taskId: id,
      proCode,
      seriesCode,
    };

    this.setState({
      params,
      initParams,
    });

    // table表格数据
    this.handleGetTableData(params);

    // treeData
    this.handleGetSysTreeData();

    // 文档名称下拉列表
    this.getFileNameList();
  }
  /**
   * 弹窗操作
   * * */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  /**
   * 下载弹窗内错误报告 
   */
  downError = () => {
    const {
      dispatch
    } = this.props;
    const proCode  =this.state.errorList;
    dispatch({
      type: 'projectAndSeriesQueryExtends/downloadErrorFile',
      payload: proCode,
      callback: res => {
        if (res) downloadFile(res, '继承详情.xlsx', 'application/vnd.ms-excel;charset=utf-8');
      },
    });
  };
  /**
   * 文档名称
   * * */
  getFileNameList = () => {
    const {
      dispatch,
      location: {
        query: { seriesCode },
      },
    } = this.props;
    dispatch({
      type: 'manuscriptManagementList/getFileNameListReq',
      payload: {
        proCode: seriesCode,
        inType: '3',
      },
    });
  };

  /**
   * 获取表格数据
   * * */
  handleGetTableData = (params, type = '') => {
    const { dispatch } = this.props;
    const { expand, selectedRowKeys } = this.state;
    const payload = { ...params };
    expand && delete payload.keyWords;
    dispatch({
      type: 'projectAndSeriesQueryExtends/getFileListReq',
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
   * 获取目录树数据
   * * */
  handleGetSysTreeData = () => {
    const {
      dispatch,
      location: {
        query: { seriesCode },
      },
    } = this.props;

    dispatch({
      type: 'projectAndSeriesQueryExtends/getSysTreeReq',
      payload: {
        code: seriesCode,
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
        params.direction = 'asc';
        break;
      case 'descend':
        params.direction = 'desc';
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
        this.previewChild.handlePreview(record);
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
        pathname: '/projectManagement/projectAndSeriesQuery',
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

  addExtendsFn = (fileIds, key) => {
    const {
      dispatch,
      location: {
        query: { proCode, seriesCode },
      },
    } = this.props;
    this.setState({
      [key]: true,
    });
    dispatch({
      type: 'projectAndSeriesQueryExtends/batchExtendArchivedFileReq',
      payload: {
        proCode,
        seriesCode,
        fileIds,
      },
      callback: res => {
        if (res && res.status === 200) {
          this.showModal()
          this.state.resMessage=res.message
          this.state.errorList=res.data
          // message.success(res.message);
          this.handleGetTableData(this.state.params);
        } else {
          message.error(res.message);
        }
        this.setState({
          [key]: false,
        });
      },
    });
  };

  removeExtends = (fileIds, key) => {
    const {
      dispatch,
      location: {
        query: { proCode, seriesCode },
      },
    } = this.props;

    this.setState({ [key]: true });
    dispatch({
      type: 'projectAndSeriesQueryExtends/batchDelProExtendArchivedFileReq',
      payload: {
        proCode,
        fileIds,
        seriesCode,
      },
      callback: res => {
        if (res && res.status === 200) {
          message.success(res.message)
          this.handleGetTableData(this.state.params);
        } else {
          message.error(res.message);
        }
        this.setState({ [key]: false });
      },
    });
  };

  render() {
    const {
      expand,
      columns,
      selectedRowKeys,
      previewShow,
      params: { pageNum, pageSize },
      initParams,
      collapsed,
      isAddAllExtends,
      isRemoveAllExtends,
      isAddSelectedExtends,
      isRemoveSelectedExtends,
    } = this.state;
    const {
      loading,
      form,
      projectAndSeriesQueryExtends: { saveTreeData, tableList },
      manuscriptManagementList: { fileNameList },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state !== '已归档',
        state: record.state,
      }),
    };

    return (
      <Card
        bordered={false}
        title={
          <Breadcrumb>
            <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>项目</Breadcrumb.Item>
            <Breadcrumb.Item>系列信息查询</Breadcrumb.Item>
            <Breadcrumb.Item>系列继承</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <>
            <Modal
              title="消息提醒"
              visible={this.state.visible}
              onOk={this.handleCancel}
              onCancel={this.handleCancel}
              okText="继承详情"
              cancelText="取消"
              footer={[
                <Button
                key="confim"
                size="large"
                loading={isAddAllExtends}
                onClick={this.downError}
              >
                继承详情
              </Button>,
                <Button
                key="confim"
                size="large"
                loading={isAddAllExtends}
                onClick={this.handleCancel}
              >
                取消
              </Button>
              ]} 
            >
              <p>{this.state.resMessage}</p>
            </Modal>
            <Action code="projectAndSeriesQuery:batchExtendArchivedFile">
              <Button
                style={{ marginRight: '12px' }}
                type="primary"
                loading={isAddAllExtends}
                onClick={() => this.addExtendsFn([], 'isAddAllExtends')}
              >
                全部继承
              </Button>
            </Action>
            <Action code="projectAndSeriesQuery:batchDelProExtendArchivedFile">
              <Button
                style={{ marginRight: '12px' }}
                type="primary"
                loading={isRemoveAllExtends}
                onClick={() => this.removeExtends([], 'isRemoveAllExtends')}
              >
                全部移除
              </Button>
            </Action>
            <Action code="projectAndSeriesQuery:batchExtendArchivedFile">
              <Button
                style={{ marginRight: '12px' }}
                type="primary"
                disabled={
                  this.handleReviewSubmitParams().filter(item => item.isExtend === '0').length === 0
                }
                loading={isAddSelectedExtends}
                onClick={() =>
                  this.addExtendsFn(
                    this.handleReviewSubmitParams()
                      .filter(item => item.isExtend === '0')
                      .map(item => (item.parentId === '-1' ? item.id : item.parentId)),
                    'isAddSelectedExtends',
                  )
                }
              >
                添加继承
              </Button>
            </Action>
            <Action code="projectAndSeriesQuery:batchDelProExtendArchivedFile">
              <Button
                style={{ marginRight: '12px' }}
                type="primary"
                disabled={
                  this.handleReviewSubmitParams()
                    .filter(item => item.isExtend === '1')
                    .map(item => item.id).length === 0
                }
                loading={isRemoveSelectedExtends}
                onClick={() =>
                  this.removeExtends(
                    this.handleReviewSubmitParams()
                      .filter(item => item.isExtend === '1')
                      .map(item => (item.parentId === '-1' ? item.id : item.parentId)),
                    'isRemoveSelectedExtends',
                  )
                }
              >
                移除继承
              </Button>
            </Action>
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
                ref={ref => {
                  this.selfTreeRef = ref;
                  return this.selfTreeRef;
                }}
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
      connect(({ projectAndSeriesQueryExtends, manuscriptManagementList }) => {
        return {
          projectAndSeriesQueryExtends,
          manuscriptManagementList,
        };
      })(Index),
    ),
  ),
);

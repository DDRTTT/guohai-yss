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
import FileHistoryVersion from '@/components/FileHistoryVersion';
import Preview from '@/components/Preview';
import DownloadFile from '@/components/DownloadFile';
import PreciseSearch from './component/PreciseSearch';
import FuzzySearch from './component/FuzzySearch';
import SelfTree from '@/components/SelfTree';

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
    removeExtending: false,
  };

  componentDidMount() {
    const {
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
    this.getFileNameList();
  }

  /**
   * 文档名称
   * **/
  getFileNameList = () => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
    } = this.props;
    dispatch({
      type: 'manuscriptManagementList/getFileNameListReq',
      payload: {
        proCode,
        inType: '3',
      },
    });
  };

  /**
   * 获取表格数据
   * **/
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
   * **/
  handleGetSysTreeData = () => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
    } = this.props;

    dispatch({
      type: 'projectAndSeriesQueryExtends/getSysTreeReq',
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
   * 移除继承
   * **/
  handleRemoveExtends = () => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
      projectAndSeriesQueryExtends: {
        tableList: { total },
      },
    } = this.props;
    const fileIds = this.handleReviewSubmitParams().map(item => item.id);
    const removeExtends = () => {
      this.setState({ removeExtending: true });
      dispatch({
        type: 'projectAndSeriesQueryExtends/batchDelProExtendArchivedFileReq',
        payload: {
          proCode,
          fileIds,
        },
        callback: res => {
          if (res && res.status === 200) {
            this.handleGetTableData(this.state.params);
            this.handleGetSysTreeData();
            this.getFileNameList();
          } else {
            message.error(res.message);
          }
          this.setState({ removeExtending: false });
        },
      });
    };

    if (total === 0) {
      message.warn('此系列下已经没有可继承的文档了');
      return;
    }

    if (fileIds.length === 0) {
      Modal.confirm({
        title: '确定',
        content: '您尚未选择要移除继承的文档，是要全部移除继承关系吗？',
        onOk: () => {
          removeExtends();
        },
      });
      return;
    }

    removeExtends();
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
      removeExtending,
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
          <>
            <Breadcrumb>
              <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目</Breadcrumb.Item>
              <Breadcrumb.Item>系列信息查询</Breadcrumb.Item>
              <Breadcrumb.Item>系列继承</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
        extra={
          <>
            <Button
              style={{ marginRight: '12px' }}
              type="primary"
              loading={removeExtending}
              onClick={this.handleRemoveExtends}
            >
              移除继承
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

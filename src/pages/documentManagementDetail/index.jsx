import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc, ActionBool } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Row,
  Table,
  Form,
  Icon,
  Select,
  Card,
  Layout,
  Tag,
  Tooltip,
  Menu,
  Dropdown,
  message,
  Switch,
  Modal,
} from 'antd';
import SelfTree from '@/components/SelfTree';
import FileHistoryVersion from '@/components/FileHistoryVersion';
import UpdateFilePath from './component/UpdateFilePath';
import DownloadFile from '@/components/DownloadFile';
import Preview from '@/components/Preview';
import FileDeleteModal from './component/FileDeleteModal';

const { Sider, Content } = Layout;
const { Search } = Input;

class Index extends Component {
  state = {
    columns: [
      {
        title: '文档名称',
        dataIndex: 'awpName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.awpName}>
              <span>{record.awpName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'operStatus',
        title: '文档状态',
        dataIndex: 'operStatus',
        sorter: true,
        render: (text, record) => <Tag>{record.statusName}</Tag>,
      },
      {
        key: 'awpPathName',
        title: '底稿目录',
        dataIndex: 'awpPathName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.awpPathName}>
              <span>{record.awpPathName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'recordBoxNum',
        title: '档案盒号',
        dataIndex: 'recordBoxNum',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip placement="topLeft" title={text}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'taskName',
        title: '所属流程',
        dataIndex: 'taskName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.taskName}>
              <span>{record.taskName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'updateType',
        title: '变更标识',
        dataIndex: 'updateType',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.updateType}>
              <span>
                {record.updateType &&
                  {
                    move: '文件移动',
                    update: '文件更新',
                    'update,move': '文件更新移动',
                    'move,update': '文件移动更新',
                  }[record.updateType]}
              </span>
            </Tooltip>
          );
        },
      },
      {
        key: 'needUseSeal',
        title: '是否需要用印',
        align: 'center',
        dataIndex: 'needUseSeal',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        key: 'useSeal',
        title: '是否用印文档',
        align: 'center',
        dataIndex: 'useSeal',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        key: 'version',
        title: '版本号',
        dataIndex: 'version',
        sorter: true,
        render: (text, record) => (
          <Action code="documentManagement:getFileHistory">
            <FileHistoryVersion fileId={record.id} buttonText={text} />
          </Action>
        ),
      },
      {
        key: 'createTime',
        title: '上传时间',
        dataIndex: 'createTime',
        sorter: true,
      },
      {
        key: 'creatorId',
        title: '操作用户',
        dataIndex: 'creatorId',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.creatorName}>
              <span>{record.creatorName}</span>
            </Tooltip>
          );
        },
      },
    ],
    optColumns: [
      {
        title: '操作列',
        key: 'action',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <DownloadFile buttonType="link" record={[record]} />
              <Button type="link" size="small" onClick={() => this.handlePreview(record)}>
                查看
              </Button>
              {record &&
              record.source === 1 &&
              (record.operStatus === '5' ||
                (record.operStatus === '0' &&
                  record.updateType === 'move' &&
                  record.backupState !== '2' &&
                  record.backupState !== '3')) ? (
                <Action code="documentManagement:updateHandle">
                  <Button type="link" size="small" onClick={() => this.handleFileUpdate([record])}>
                    更新
                  </Button>
                </Action>
              ) : null}
              {record && record.operStatus === '0' ? (
                <Button type="link" size="small" onClick={() => this.handleFileDelete(record)}>
                  删除
                </Button>
              ) : null}
              {/* operStatus 2：已审核；3：待归档；5：已归档 */}
              {record &&
                (record.operStatus === '2' ||
                  record.operStatus === '3' ||
                  record.operStatus === '5') && (
                  <Action code="documentManagement:fileDelete">
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        this.handleFileDeleteModalShowModal({
                          proCode: record.proCode,
                          fileIds: [record.id],
                          taskId: '',
                        })  
                      }
                    >
                      文件删除
                    </Button>
                  </Action>
                )}
            </>
          );
        },
      },
    ],
    showOpt: true,
    params: {
      inType: '2',
      proCode: '',
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    },
    expands: true,
    type: null,
    previewShow: false,
    selectedRows: {},
    selectedRowKeys: [],
    siderWidth: 350,
    fileDeleteModalVisible: false,
    fileDeleteModalOtherParams: null,
    fileDeleteModalLoading: false,
    isModalVisible: false,
    aprocessList: [], // 流程中不可执行更新数据
    tableListForUpdate: [], //更新跳转数据
    isBatchUpdate: false, //是否时候批量更新
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { type, proCode },
      },
    } = this.props;
    this.state.params.proCode = proCode;

    this.setState({
      type,
    });

    // 获取详情基础信息
    dispatch({
      type: 'manuscriptManagementList/getProjectBaseInfoDetailReq',
      payload: {
        proCode,
      },
    });

    // 文档名称下拉列表
    dispatch({
      type: 'documentManagementDetail/getFileNameListReq',
      payload: {
        proCode,
        inType: '2',
      },
    });
    // 文档状态
    dispatch({
      type: 'manuscriptManagementList/getDicsDocumentStatusReq',
      payload: {
        fcode: 'D004',
      },
    });
    // 所属任务
    dispatch({
      type: 'documentManagementDetail/getTaskNameListReq',
      payload: {
        proCode,
        inType: '3',
      },
    });
    // 操作人
    dispatch({
      type: 'taskManagementDeal/getUsersByProAndTaskReq',
      payload: {
        proCode,
      },
    });
    // 初始化加载全部文档列表
    this.handleGetTableData(this.state.params);
    this.handleGetSysTreeData();
  }

  // 重新请求文件名称下拉列表
  reGetFileNameList() {
    const { dispatch } = this.props;
    const {
      params: { proCode },
    } = this.state;
    dispatch({
      type: 'documentManagementDetail/getFileNameListReq',
      payload: {
        proCode,
        inType: '2',
      },
    });
  }

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
   * 获取目录树数据
   * * */
  handleGetSysTreeData = () => {
    const { dispatch } = this.props;
    const {
      params: { proCode },
    } = this.state;
    dispatch({
      type: 'manuscriptManagementList/getSysTreeReq',
      payload: {
        code: proCode,
      },
    });
  };

  /**
   * 根据左侧所选树查询右侧文件
   * inType: 1.查询全部文档;2.已复核文档
   * 项目文档管理查看文档页面传inType:2；项目任务管理办理页面传inType:1
   */
  handleGetTableData = (params, type = '') => {
    this.props
      .dispatch({
        type: 'documentManagementDetail/handleQueryTableReq',
        payload: params,
      })
      .then(() => {
        if (this.state.selectedRowKeys.length > 0 && type !== 'sortChange') {
          this.setState({
            selectedRowKeys: [],
            selectedRows: {},
          });
        }
        // 批量移动之后，文件名称中的下拉列表code会改变，需要更新
        if (type === 'updateFilePath') {
          this.reGetFileNameList();
        }
        setTimeout(() => {
          const inputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
          if (inputElement) inputElement.value = '';
        }, 300);
      });
  };

  /**
   * 获取子组件信息
   * * */
  getClickMsg = (result, msg) => {
    const { code } = msg;
    this.handleClearVal();

    if (code) {
      this.state.params.awpCode = code;
    } else {
      delete this.state.params.awpCode;
    }

    this.handleGetTableData(this.state.params);
  };

  /**
   * 右侧下拉选中时重置左侧树
   * * */
  handleResetTree = ref => {
    this.child = ref;
  };

  /**
   *  显示预览框
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

  initParams = () => {
    const {
      params: { proCode, awpCode },
    } = this.state;
    const obj = {
      inType: '2',
      proCode,
      awpCode,
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    };
    if (!awpCode) {
      delete obj.awpCode;
    }
    return obj;
  };

  /**
   * 查询
   * 筛选条件：文件状态、文件名
   */
  handleSearchBtn = e => {
    const {
      form: { validateFields },
    } = this.props;
    e.preventDefault();

    validateFields((err, values) => {
      if (err) {
        return;
      }

      this.state.params = {
        ...this.initParams(),
        ...values,
      };

      this.handleGetTableData(this.state.params);
    });
  };

  handleBlurSearch = value => {
    this.state.params = {
      ...this.initParams(),
      keyWords: value,
    };
    this.handleGetTableData(this.state.params);
  };

  /**
   * 重置
   */
  handleClearVal = () => {
    this.props.form.resetFields();
    this.state.params = this.initParams();
  };

  /**
   * select 模糊搜索
   * * */
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions = () => {
    this.handleClearVal();
    this.setState(state => ({
      expands: !state.expands,
    }));
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const {
      selectedRows,
      params: { proCode },
    } = this.state;
    const files = Object.values(selectedRows)
      .filter(item => item.operStatus === '0')
      .map(item => ({
        fileId: item.id,
        awpFileNumber: item.awpFileNumber,
      }));
    if (files.length === 0) {
      message.warn('只有文档状态为待提交时才能进行提交！');
      return;
    }

    this.setState({
      submitLoading: true,
    });
    dispatch({
      type: 'documentManagementDetail/getUpdateCommitReq',
      payload: {
        files,
        proCode,
      },
    }).then(res => {
      if (res && res.status === 200) {
        this.setState({
          submitLoading: false,
        });
        this.handleGetTableData(this.state.params);
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * 文件更新
   * * */
  handleFileUpdate = (tableList = [], type) => {
    this.setState({ isBatchUpdate: type ? true : false });
    if (tableList.length) {
      const payload = [];
      tableList.forEach(item => {
        payload.push(item.id);
      });

      const { dispatch } = this.props;
      dispatch({
        type: 'documentManagementDetail/getFileTips',
        payload: payload,
      }).then(res => {
        // (flag=1在文件删除流程中，flag=0不在文件删除流程中)
        let list = res;
        const aprocessList = list.filter(item => item.flag === 1) || [];
        const nonProcessList = list.filter(item => item.flag === 0) || [];
        // 更新跳转数据
        const idList = [];
        nonProcessList.forEach(item => {
          idList.push(item.id);
        });
        const tableListForUpdate = tableList.filter(item => idList.includes(item.id));
        this.setState({ tableListForUpdate: tableListForUpdate });
        sessionStorage.setItem('tableList', JSON.stringify(tableListForUpdate));

        if (aprocessList.length) {
          this.setState({
            aprocessList: aprocessList,
            isModalVisible: true,
          });
        } else {
          this.jumpProcess();
        }
      });
    } else {
      message.warn('仅已归档且为非继承的文件可以进更新操作');
    }
  };

  jumpProcess = () => {
    const {
      dispatch,
      location: {
        query: { proCode },
      },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentArchiveFileUpdate',
        query: {
          proCode,
        },
      }),
    );
  };

  handleOk = () => {
    const { tableListForUpdate } = this.state;
    this.setState({ isModalVisible: false, aprocessList: [] }, () => {
      if (tableListForUpdate.length) {
        this.jumpProcess();
      }
    });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false, aprocessList: [] });
  };

  handleFileDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentManagementDetail/getFileUpdateReq',
      payload: [
        {
          fileId: record.id,
          updateType: record.updateType,
        },
      ],
      callback: () => {
        message.success('删除成功');
        this.handleGetTableData(this.state.params);
        this.handleGetSysTreeData();
      },
    });
  };

  /**
   * 批量操作的参数
   * * */
  handleBatchOperationParams = () => {
    const { selectedRows } = this.state;
    return Object.values(selectedRows).map(item => item);
  };

  /**
   * 取消：返回上一页面
   * * */
  handleBackPage = () => {
    const { sourcePage = '' } = this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: sourcePage || '/projectManagement/documentManagement',
        query: { type: this.state.type },
      }),
    );
  };

  handleFileDeleteModalShowModal = fileDeleteModalOtherParams => {
    this.setState({
      fileDeleteModalVisible: true,
      fileDeleteModalOtherParams,
    });
  };

  handleFileDeleteModalCancel = () => {
    this.setState({ fileDeleteModalVisible: false });
  };

  handleFileDeleteModalCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { fileDeleteModalOtherParams } = this.state;

      if (!fileDeleteModalOtherParams.fileIds.length) {
        return message.warn('仅文档状态为：已审批、待归档、已归档的文件可进行删除~');
      }

      this.setState({ fileDeleteModalLoading: true });
      this.props
        .dispatch({
          type: 'documentManagementDetail/getFileDeleteReq',
          payload: {
            delReason: values.delReason,
            ...fileDeleteModalOtherParams,
          },
        })
        .then(res => {
          if (res && res.status === 200) {
            message.success(res?.message);
            this.handleClearVal();
            this.handleGetTableData(this.state.params);
            form.resetFields();
            this.reGetFileNameList();
            this.setState({
              fileDeleteModalVisible: false,
              fileDeleteModalRecord: null,
            });
          } else {
            message.error(res?.message);
          }
          this.setState({
            fileDeleteModalLoading: false,
          });
        });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      columns,
      optColumns,
      showOpt,
      params: { pageSize, pageNum },
      expands,
      siderWidth,
      previewShow,
      selectedRowKeys,
      submitLoading,
      fileDeleteModalVisible,
      fileDeleteModalLoading,
      isModalVisible,
      aprocessList,
      isBatchUpdate,
    } = this.state;
    const {
      form: { getFieldDecorator },
      loading,
      location: { query: proCode },
      manuscriptManagementList: { saveTreeData, documentStatus, baseInfo },
      taskManagementDeal: { creatorList },
      documentManagementDetail: { tableList, fileNameList, taskNameList },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <Layout style={{ backgroundColor: '#fff', height: '100%' }}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>项目文档管理</Breadcrumb.Item>
              {baseInfo.proName ? <Breadcrumb.Item> {baseInfo.proName}</Breadcrumb.Item> : ''}
              <Breadcrumb.Item>文档列表</Breadcrumb.Item>
            </Breadcrumb>
          }
          extra={
            <>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                disabled={selectedRowKeys.length === 0}
                loading={submitLoading}
                onClick={this.handleSubmit}
              >
                提交
              </Button>
              <Button onClick={this.handleBackPage}>取消</Button>
            </>
          }
        >
          {/* 文档预览modal */}
          {previewShow ? (
            <Preview id="documentManagementDetail" onRef={ref => (this.previewChild = ref)} />
          ) : null}
          {fileDeleteModalVisible && (
            <FileDeleteModal
              wrappedComponentRef={this.saveFormRef}
              visible={fileDeleteModalVisible}
              loading={fileDeleteModalLoading}
              onCancel={this.handleFileDeleteModalCancel}
              onCreate={this.handleFileDeleteModalCreate}
            />
          )}
          <Layout
            style={{ backgroundColor: '#fff', height: 'calc(100vh - 216px)', overflowY: 'auto' }}
          >
            <Sider
              breakpoint="lg"
              theme="light"
              width={siderWidth}
              style={{
                margin: '15px',
                overflowY: 'auto',
                position: 'relative',
                paddingBottom: '0',
              }}
            >
              <SelfTree
                treeData={saveTreeData}
                multipleFlag={false}
                getCheckMsg={() => null}
                getClickMsg={this.getClickMsg}
                onRef={this.handleResetTree}
              />
            </Sider>
            <Content>
              <Form>
                {expands ? (
                  <Row type="flex" align="middle" style={{ marginBottom: '24px' }}>
                    <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                      <Search
                        placeholder="请输入文档名称"
                        onSearch={value => this.handleBlurSearch(value)}
                        style={{
                          width: 210,
                          marginRight: 23,
                          height: 32,
                        }}
                      />
                      <Button onClick={this.handleOpenConditions} type="link">
                        展开搜索
                        <Icon type="down" />
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col span={8}>
                      <Form.Item label="文档状态" {...formItemLayout}>
                        {getFieldDecorator('fileStatus')(
                          <Select
                            placeholder="请选择文档状态"
                            mode="multiple"
                            showArrow
                            allowClear
                            filterOption={this.handleFilterOption}
                          >
                            {documentStatus &&
                              documentStatus.map(item => (
                                <Select.Option key={item.code} title={item.name}>
                                  {item.name}
                                </Select.Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="文档名称" {...formItemLayout}>
                        {getFieldDecorator('fileName')(
                          <Select
                            placeholder="请选择文档名称"
                            mode="multiple"
                            showArrow
                            allowClear
                            filterOption={this.handleFilterOption}
                          >
                            {fileNameList &&
                              fileNameList.map(item => (
                                <Select.Option key={item.code} title={item.name}>
                                  {item.name}
                                </Select.Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="所属任务" {...formItemLayout}>
                        {getFieldDecorator('taskName')(
                          <Select
                            placeholder="请选择所属任务"
                            mode="multiple"
                            showArrow
                            allowClear
                            filterOption={this.handleFilterOption}
                          >
                            {taskNameList &&
                              taskNameList.map(item => (
                                <Select.Option key={item.name} title={item.name}>
                                  {item.name}
                                </Select.Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="操作用户" {...formItemLayout}>
                        {getFieldDecorator('creatorIds')(
                          <Select
                            placeholder="请选择操作用户"
                            mode="multiple"
                            showArrow
                            allowClear
                            filterOption={this.handleFilterOption}
                          >
                            {creatorList &&
                              creatorList.map(item => (
                                <Select.Option key={item.key} title={item.value}>
                                  {item.value}
                                </Select.Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="是否需要用印" {...formItemLayout}>
                        {getFieldDecorator('needUseSeals')(
                          <Select
                            placeholder={`请选择是否需要用印`}
                            showArrow
                            allowClear
                            mode="multiple"
                            filterOption={this.handleFilterOption}
                          >
                            <Select.Option key={1} value={1}>
                              是
                            </Select.Option>
                            <Select.Option key={0} value={0}>
                              否
                            </Select.Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="是否用印文档" {...formItemLayout}>
                        {getFieldDecorator('archives')(
                          <Select
                            placeholder={`请选择是否用印文档`}
                            showArrow
                            allowClear
                            mode="multiple"
                            filterOption={this.handleFilterOption}
                          >
                            <Select.Option key={1} value={1}>
                              是
                            </Select.Option>
                            <Select.Option key={0} value={0}>
                              否
                            </Select.Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={8} style={{ float: 'right', textAlign: 'right' }}>
                      <Button type="primary" onClick={this.handleSearchBtn}>
                        查询
                      </Button>
                      <Button style={{ marginLeft: 10 }} onClick={this.handleClearVal}>
                        重置
                      </Button>
                      <Button
                        style={{ marginLeft: 23 }}
                        onClick={this.handleOpenConditions}
                        type="link"
                      >
                        收起
                        <Icon type="up" />
                      </Button>
                    </Col>
                  </Row>
                )}
              </Form>
              <Row type="flex">
                <Col span={3}>
                  <Form.Item label="目录树" type="flex">
                    <Switch
                      checked={!!siderWidth}
                      onChange={bool => {
                        this.setState({
                          siderWidth: bool ? 350 : 0,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="操作列" type="flex">
                    <Switch
                      checked={!!showOpt}
                      onChange={bool => {
                        this.setState({
                          showOpt: bool,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Table
                rowKey={row => row.id}
                rowSelection={rowSelection}
                columns={showOpt ? columns.concat(optColumns) : columns}
                dataSource={tableList.rows}
                scroll={{ x: columns.length * 250 }}
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
              <div
                style={{
                  float: 'left',
                  marginTop: '-48px',
                }}
              >
                <Button type="link" size="small">
                  已勾选 {this.handleBatchOperationParams().length} 个
                </Button>
                <Dropdown
                  placement="bottomRight"
                  disabled={this.handleBatchOperationParams().length === 0}
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <DownloadFile
                          buttonType="link"
                          resetButtonStyle={{
                            color: '#666',
                          }}
                          buttonText="批量下载"
                          record={this.handleBatchOperationParams()}
                          success={this.handleRowSelectChange}
                        />
                      </Menu.Item>
                      {ActionBool('archiveTaskHandleList:updateFilePath') && (
                        <Menu.Item key="2">
                          <UpdateFilePath
                            saveTreeData={saveTreeData}
                            record={this.handleBatchOperationParams()}
                            handleGetSysTreeData={this.handleGetSysTreeData}
                            handleClearVal={this.handleClearVal}
                            handleGetTableData={() =>
                              this.handleGetTableData(this.state.params, 'updateFilePath')
                            }
                          />
                        </Menu.Item>
                      )}
                      {ActionBool('documentManagement:updateHandle') && (
                        <Menu.Item key="3">
                          <Button
                            size="small"
                            type="link"
                            style={{ color: '#666' }}
                            onClick={() =>
                              this.handleFileUpdate(
                                (() =>
                                  Object.values(this.state.selectedRows).filter(
                                    item =>
                                      item.source === 1 &&
                                      (item.operStatus === '5' ||
                                        (item.operStatus === '0' &&
                                          item.updateType === 'move' &&
                                          item.backupState !== '2' &&
                                          item.backupState !== '3')),
                                  ))(),
                                'batch',
                              )
                            }
                          >
                            批量更新
                          </Button>
                        </Menu.Item>
                      )}
                      {ActionBool('documentManagement:fileDelete') && (
                        <Menu.Item key="4">
                          <Button
                            type="link"
                            size="small"
                            disabled={this.handleBatchOperationParams().length === 0}
                            onClick={() =>
                              this.handleFileDeleteModalShowModal({
                                proCode: proCode?.proCode,
                                taskId: '',
                                fileIds: this.handleBatchOperationParams()
                                  .filter(
                                    record =>
                                      record.operStatus === '2' ||
                                      record.operStatus === '3' ||
                                      record.operStatus === '5',
                                  )
                                  .map(item => item.id),
                              })
                            }
                          >
                            批量文件删除
                          </Button>
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                >
                  <Button>批量操作</Button>
                </Dropdown>
              </div>
            </Content>
          </Layout>
        </Card>
        <Modal
          title="提示"
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {isBatchUpdate && (
            <p>
              发起成功，其中目前部分文档已在删除流程中，无法更新，文档包括：
              {aprocessList?.map((item, index) => {
                return <span key={index}>{item.awpName + ' '}</span>;
              })}
              。
            </p>
          )}
          {!isBatchUpdate && <p>目前文档已发起删除流程，无法发起移动操作！</p>}
        </Modal>
      </Layout>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          documentManagementDetail,
          manuscriptManagement,
          manuscriptManagementList,
          archiveTaskHandleList,
          taskManagementDeal,
          loading,
          router,
        }) => ({
          documentManagementDetail,
          manuscriptManagement,
          manuscriptManagementList,
          archiveTaskHandleList,
          taskManagementDeal,
          loading: loading.effects['manuscriptManagementList/handleQueryTableReq'],
          modalLoading: loading.effects['documentManagementDetail/getFileHistoryReq'],
          router,
        }),
      )(Index),
    ),
  ),
);

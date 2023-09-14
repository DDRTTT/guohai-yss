/**
 * 项目文档管理--文档列表
 * 复用项目电子底稿管理查看底稿页面manuscriptManagementList
 * 不同：查看文档页面有项目基本信息展示,查看底稿页面无基本信息展示
 *
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
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
  message,
  Modal,
  Spin,
  Tag,
  Tooltip,
  Pagination,
} from 'antd';
import SelfTree from '@/components/SelfTree';
import { filePreviewWithBlobUrl } from '@/utils/download';
import { uuid, launchIntoFullscreen } from '@/utils/utils';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import styles from './index.less';

const IMGs =
  'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';

const { Sider, Content } = Layout;
const { Search } = Input;
const { confirm } = Modal;

@Form.create()
class Index extends Component {
  state = {
    isForm: true, // isForm 展开和收起
    collapsed: false,
    type: null,
    params: {
      inType: '2',
      proCode: '',
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    },
    treeFileParams: {
      // 点击左侧树获取文档列表所需参数
      inType: '2',
      proCode: '',
      awpCode: '',
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    },
    ablePreview: false,
    blobUrl: '',
    fileType: '',
    IMG: false,
    awpFileNumber: '',
    showModal: false,
    oriSealFileId: '',
    fileList: [],
    lookHistoryVersion: false,
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    document.querySelector('#body-content').scrollIntoView();
    const { query } = this.props.router.location;
    this.setState({ type: query.type });
    this.state.params.proCode = this.state.treeFileParams.proCode = query.proCode;
    const { dispatch } = this.props;
    const { proCode } = this.state.params;
    // 获取详情基础信息
    dispatch({
      type: 'manuscriptManagementList/getProjectBaseInfoDetailReq',
      payload: {
        proCode,
      },
    });
    // 左侧树
    dispatch({
      type: 'manuscriptManagementList/getSysTreeReq',
      payload: {
        code: proCode,
      },
    });
    // 文档名称下拉列表
    dispatch({
      type: 'manuscriptManagementList/getFileNameListReq',
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
      type: 'archiveTaskHandleList/getTaskNameReq',
      payload: {
        proCode,
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
    this.handleGetTableList(this.state.params);
  }

  /**
   * 销毁
   * * */
  componentWillUnmount() {
    const { dispatch } = this.props;
    // 销毁左侧树
    dispatch({
      type: 'manuscriptManagementList/updateSysTree',
      payload: {
        saveTreeData: [],
      },
    });
    // 销毁table
    dispatch({
      type: 'manuscriptManagementList/updateTableList',
      payload: {
        tableList: [],
      },
    });
  }

  /**
   * 根据左侧所选树查询右侧文件
   * inType: 1.查询全部文档;2.已复核文档
   * 项目文档管理查看文档页面传inType:2；项目任务管理办理页面传inType:1
   */
  handleGetTableList(params) {
    this.props
      .dispatch({
        type: 'manuscriptManagementList/handleQueryTableReq',
        payload: {
          ...params,
        },
      })
      .then(() => {
        setTimeout(() => {
          let InputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
          if (InputElement) InputElement.value = '';
        }, 300);
      });
  }

  /**
   * 获取子组件信息
   * * */
  getCheckMsg = (result, msg) => {};

  getClickMsg = (result, msg) => {
    const { code } = msg;
    this.state.treeFileParams = {
      ...this.state.treeFileParams,
      awpCode: code || '',
      direction: 'DESC',
      field: '',
    };

    if (code) {
      // 重置右侧筛选条件
      this.handleClearVal();
      this.handleGetTableList(this.state.treeFileParams);
    }
  };

  /**
   * 右侧下拉选中时重置左侧树
   * * */
  handleResetTree = ref => {
    this.child = ref;
  };

  handleSelectChange(values) {
    const {
      treeFileParams: { awpCode },
      params,
    } = this.state;

    if (awpCode) {
      this.child.handleReset();
    }

    if (!values.length) {
      this.state.params = {
        ...params,
        fileName: [],
        fileStatus: [],
      };
    }
  }

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange = (order, field, sorter) => {
    const { proCode } = this.state.params;
    const {
      treeFileParams: { awpCode },
    } = this.state;
    const params = awpCode ? this.state.treeFileParams : this.state.params;
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

    this.handleGetTableList(params);
  };

  /**
   * 下载
   * * */
  handleDownLoad(record) {
    const { awpFileNumber, awpName } = record;
    const payload = [`${awpFileNumber}@${awpName}`];
    this.props.dispatch({
      type: 'manuscriptManagementList/getFileDownLoadReq',
      payload,
    });
  }

  /**
   * 查看预览
   * * */
  handleFilePreviewWithBlob({ awpFileNumber, awpName }) {
    const arr = awpName.split('.');
    const fileType = awpName.split('.')[arr.length - 1];
    if (IMGs.includes(fileType)) {
      this.setState(
        {
          ablePreview: true,
          IMG: true,
        },
        () => {
          filePreviewWithBlobUrl(
            `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}@${awpName}`,
            blobUrl => {
              this.setState({
                blobUrl,
              });
            },
          );
        },
      );
    } else {
      if (!getDocumentType(fileType)) {
        message.warn('目前不支持预览该格式的文件');
        return;
      }
      this.setState({
        ablePreview: true,
        awpFileNumber,
        fileType,
      });
    }
  }

  /**
   * 更新文档
   * * */
  handleUpdateFile({ id }) {
    this.setState({
      showModal: true,
      oriSealFileId: id,
    });
  }

  /**
   * 查看历史版本
   * * */
  handleLookHistoryVersion({ id }) {
    this.setState(
      {
        lookHistoryVersion: true,
      },
      () => {
        this.props.dispatch({
          type: 'documentManagementDetail/getFileHistoryReq',
          payload: {
            fileId: id,
          },
        });
      },
    );
  }

  /**
   * 查询
   * 筛选条件：文件状态、文件名
   */
  handleSearchBtn(e) {
    const ev = e || event;
    ev.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.state.params = {
        ...this.state.params,
        direction: 'DESC',
        field: '',
        pageNum: 1,
        pageSize: 10,
        ...values,
      };
      this.state.params.keyWords && delete this.state.params.keyWords;
      this.handleGetTableList(this.state.params);
    });
  }

  /**
   * 重置
   */
  handleClearVal() {
    this.props.form.resetFields();
    this.state.params = {
      ...this.state.params,
      direction: 'DESC',
      field: '',
    };
  }

  /**
   * @method  handleSetPageNum 切换页数的时候触发
   * @param page 当前页数
   */
  handleSetPageNum(page) {
    const {
      treeFileParams: { awpCode },
    } = this.state;

    if (awpCode) {
      this.state.treeFileParams.pageNum = page;
      this.handleGetTableList(this.state.treeFileParams);
    } else {
      this.state.params.pageNum = page;
      this.handleGetTableList(this.state.params);
    }
  }

  /**
   * @method  handleSetPageNum 切换条数的时候触发
   */
  handleSetPageSize(pageNum, pageSize) {
    const {
      treeFileParams: { awpCode },
    } = this.state;

    if (awpCode) {
      this.state.treeFileParams = {
        ...this.state.treeFileParams,
        pageNum,
        pageSize,
      };
      this.handleGetTableList(this.state.treeFileParams);
    } else {
      this.state.params = {
        ...this.state.params,
        pageNum,
        pageSize,
      };
      this.handleGetTableList(this.state.params);
    }
  }

  /**
   * select 模糊搜索
   * * */
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  /**
   * 取消：返回上一页面
   * * */
  handleBackPage() {
    const { type } = this.state;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentManagement',
        query: { type },
      }),
    );
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions() {
    this.setState(state => ({
      isForm: !state.isForm,
    }));
  }

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch(val) {
    this.state.params.keyWords = val;
    this.state.params.taskName = [];
    this.state.params.fileStatus = [];
    this.state.params.fileName = [];
    this.state.params.creatorIds = [];
    this.state.params.pageNum = 1;
    this.handleGetTableList(this.state.params);
  }
  /**
   * 跳转至用印上传页面
   * * */
  handleTaskUploadPrinting({ proCode, id }) {
    const { dispatch } = this.props;
    confirm({
      title: '用印文件更新',
      content: '是否发起用印文件更新任务?',
      centered: true,
      onOk: () => {
        const payload = {
          generateArchiveTask: 1,
          fileId: id,
          proCode,
          pageType: 'update',
        };
        dispatch(
          routerRedux.push({
            pathname: '/projectManagement/archiveTaskHandleListUploadPrinting',
            query: payload,
          }),
        );
      },
    });
  }

  render() {
    const {
      type,
      blobUrl,
      fileType,
      awpFileNumber,
      IMG,
      oriSealFileId,
      params,
      treeFileParams,
      collapsed,
    } = this.state;
    const {
      form: { getFieldDecorator },
      documentManagementDetail: { fileHistory },
      loading,
      modalLoading,
      manuscriptManagementList: { tableList, saveTreeData, fileNameList, documentStatus, baseInfo },
      archiveTaskHandleList: { taskName },
      global: {
        saveIP: { gateWayIp },
      },
      taskManagementDeal: { creatorList },
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
    const columns = [
      {
        title: '文档名称',
        dataIndex: 'awpName',
        sorter: true,
        fixed: 'left',
        width: 180,
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
        key: 'needUseSeal',
        title: '是否需要用印',
        align: 'center',
        width: 148,
        dataIndex: 'needUseSeal',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        key: 'useSeal',
        title: '是否用印文档',
        align: 'center',
        width: 148,
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
            <Button type="link" onClick={() => this.handleLookHistoryVersion(record)}>
              {text}
            </Button>
          </Action>
        ),
      },
      {
        key: 'createTime',
        title: '上传时间',
        width: 180,
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
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <Button type="link" size="small" onClick={() => this.handleDownLoad(record)}>
                下载
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => this.handleFilePreviewWithBlob(record)}
              >
                查看
              </Button>
              {record.operStatus && record.operStatus === '5' ? (
                <Action code="documentManagement:updateHandle">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => this.handleTaskUploadPrinting(record)}
                  >
                    更新
                  </Button>
                </Action>
              ) : null}
            </>
          );
        },
      },
    ];
    const handleModel = () => {
      this.setState({ ablePreview: false, IMG: false, blobUrl: '' });
    };
    const url = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}`;
    const key = uuid();
    const handleClose = () => {
      this.setState({ showModal: false });
      this.setState({ fileList: [] });
    };
    const fileHistoryColumns = [
      {
        key: 'awpName',
        title: '文件名称',
        dataIndex: 'awpName',
      },
      {
        key: 'version',
        title: '文件版本',
        dataIndex: 'version',
      },
      {
        key: 'createTime',
        title: '更新日期',
        dataIndex: 'createTime',
      },
      {
        key: 'creatorName',
        title: '更新用户',
        dataIndex: 'creatorName',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => this.handleDownLoad(record)}>
                下载
              </Button>
              <Button type="link" onClick={() => this.handleFilePreviewWithBlob(record)}>
                查看
              </Button>
            </>
          );
        },
      },
    ];
    const { pageSize, pageNum } = treeFileParams.awpCode ? treeFileParams : params;

    let SearchHtml = (
      <Row type="flex" align="middle" style={{ marginBottom: '24px' }}>
        <Col md={24} sm={24} style={{ textAlign: 'right' }}>
          <Search
            placeholder="请输入文档名称"
            onSearch={value => this.handleBlurSearch(value)}
            ref="keyWordsInput"
            style={{
              width: 210,
              marginRight: 23,
              height: 32,
            }}
          />
          <Button
            onClick={() => this.handleOpenConditions()}
            type="link">展开搜索<Icon type="down" />
          </Button>
        </Col>
      </Row>
    );
    return (
      <Layout id="body-content" style={{ backgroundColor: '#fff', height: '100%' }}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>项目文档管理</Breadcrumb.Item>
              {baseInfo.proName ? <Breadcrumb.Item> {baseInfo.proName}</Breadcrumb.Item> : ''}
              <Breadcrumb.Item>文档列表</Breadcrumb.Item>
            </Breadcrumb>
          }
          bordered={false}
          extra={<Button onClick={() => this.handleBackPage()}>取消</Button>}
        />
        {/* 文件预览 弹窗可拖动 */}
        <ModalWin
          id="manuscriptManagementList"
          width="80vw"
          resetContentHeight
          hideModalFooter
          denominator={10}
          visible={this.state.ablePreview}
          title="文件预览"
          okText="确定"
          onOk={handleModel}
          onCancel={handleModel}
        >
          <Button
            onClick={launchIntoFullscreen}
            style={{ margin: '20px 0', float: 'right', zIndex: 10 }}
          >
            全屏
          </Button>
          {IMG ? (
            <Spin
              tip="加载中..."
              spinning={!blobUrl.length}
              wrapperClassName={styles.iframeContent}
            >
              <iframe width="100%" height="100%" src={blobUrl} title="预览文件" id="preview" />
            </Spin>
          ) : (
            <OnlineEdit fileType={fileType} _key={key} title="预览文件" url={url} />
          )}
        </ModalWin>
        {/* 查看历史版本Modal */}
        <Modal
          width="60vw"
          bodyStyle={{
            height: '400px',
            overflowY: 'auto',
            textAlign: 'center',
          }}
          title="历史版本"
          visible={this.state.lookHistoryVersion}
          onOk={() => this.setState({ lookHistoryVersion: false })}
          onCancel={() => this.setState({ lookHistoryVersion: false })}
          zIndex={10}
        >
          <Table
            bordered
            columns={fileHistoryColumns}
            dataSource={fileHistory}
            pagination={false}
            loading={modalLoading}
          />
        </Modal>
        <Layout
          style={{ backgroundColor: '#fff', height: 'calc(100vh - 216px)', overflowY: 'auto' }}
        >
          <Sider
            breakpoint="lg"
            theme="light"
            width={350}
            style={{
              margin: '15px',
              overflowY: 'auto',
              position: 'relative',
              paddingBottom: '0',
            }}
            className={styles.leftSider}
            collapsible
            collapsed={collapsed}
            onCollapse={this.onCollapse}
          >
            <Breadcrumb>
              <Breadcrumb.Item>目录名称</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ marginTop: '10px' }}>
              <SelfTree
                treeData={saveTreeData}
                multipleFlag={false}
                getCheckMsg={this.getCheckMsg}
                getClickMsg={this.getClickMsg}
                onRef={this.handleResetTree}
              />
            </div>
          </Sider>
          <Content className={styles.content}>
            <Form>
              {this.state.isForm ? (
                SearchHtml
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
                          onChange={values => this.handleSelectChange(values)}
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
                          onChange={values => this.handleSelectChange(values)}
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
                          onChange={values => this.handleSelectChange(values)}
                        >
                          {taskName &&
                            taskName.map(item => (
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
                          onChange={values => this.handleSelectChange(values)}
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
                  <Col md={8} style={{ float: 'right', textAlign: 'right' }}>
                    <Button type="primary" onClick={() => this.handleSearchBtn()}>
                      查询
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={() => this.handleClearVal()}>
                      重置
                    </Button>
                    <Button
                      style={{ marginLeft: 23 }}
                      onClick={() => this.handleOpenConditions()}
                      type="link">收起<Icon type="up" />
                    </Button>
                  </Col>
                </Row>
              )}
            </Form>
            <Table
              columns={columns}
              dataSource={tableList.rows}
              scroll={{ x: columns.length * 120 + 240 }}
              onChange={this.sortChange}
              loading={loading}
              pagination={false}
            />
            {tableList.total != 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: 20,
                }}
              >
                <Pagination
                  style={{
                    textAlign: 'right',
                  }}
                  defaultCurrent={pageNum}
                  current={pageNum}
                  defaultPageSize={pageSize}
                  pageSize={pageSize}
                  onChange={page => this.handleSetPageNum(page)}
                  onShowSizeChange={(page, size) => this.handleSetPageSize(page, size)}
                  total={tableList.total}
                  showTotal={() => `共 ${tableList.total || 0} 条数据`}
                  showSizeChanger
                  showQuickJumper={tableList.total > pageSize}
                />
              </div>
            ) : null}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const documentManagementDetail = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          documentManagementDetail,
          manuscriptManagement,
          manuscriptManagementList,
          manuscriptManagementSpotCheckReport,
          archiveTaskHandleList,
          taskManagementDeal,
          loading,
          router,
          global,
        }) => ({
          documentManagementDetail,
          manuscriptManagement,
          manuscriptManagementList,
          manuscriptManagementSpotCheckReport,
          archiveTaskHandleList,
          taskManagementDeal,
          loading: loading.effects['manuscriptManagementList/handleQueryTableReq'],
          modalLoading: loading.effects['documentManagementDetail/getFileHistoryReq'],
          router,
          global,
        }),
      )(Index),
    ),
  ),
);

export default documentManagementDetail;

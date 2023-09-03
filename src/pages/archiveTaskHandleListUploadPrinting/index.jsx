import React, { Component } from 'react';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { routerRedux } from 'dva/router';
import {
  Button,
  Col,
  Row,
  Table,
  Select,
  Form,
  Icon,
  Card,
  message,
  Modal,
  Tag,
  Spin,
  Input,
  List,
  Pagination,
  Tooltip,
} from 'antd';
import { filePreviewWithBlobUrl } from '@/utils/download';
import { uuid, launchIntoFullscreen } from '@/utils/utils';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import UploadSection from '@/components/UploadSection';
import { cloneDeep } from 'lodash';
import styles from './index.less';

const IMGs =
  'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';
const UPDATE_URL = {
  getFileList: 'archiveTaskHandleListUploadPrinting/getUpdatedFileReq',
};
const COMMON_URL = {
  getFileList: 'archiveTaskHandleListUploadPrinting/getUnUseSealFileReq',
};

const { Search } = Input;
const { confirm } = Modal;

const initParams = {
  pageNum: 1,
  pageSize: 10,
  direction: 'DESC',
  field: '',
  keyWords: '',
};

@Form.create()
class Agent extends Component {
  state = {
    successColumn: [
      {
        key: 'fileName',
        title: '文档名称',
        sorter: true,
        dataIndex: 'fileName',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.fileName}>
              <span>{record.fileName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'state',
        title: '文档状态',
        sorter: true,
        dataIndex: 'state',
        width: 120,
        render: text => (
          <Tag>{['待提交', '审批中', '已审批', '待归档', '归档中', '已归档'][text]}</Tag>
        ),
      },
      {
        key: 'taskName',
        title: '所属流程',
        sorter: true,
        dataIndex: 'taskName',
        width: 120,
      },
      {
        key: 'creator',
        title: '操作人',
        sorter: true,
        dataIndex: 'creator',
        width: 120,
      },
      {
        key: 'createTime',
        title: '创建时间',
        sorter: true,
        dataIndex: 'createTime',
        width: 200,
      },
      {
        key: 'version',
        title: '版本号',
        sorter: true,
        width: 120,
        dataIndex: 'version',
        render: (text, record) => (
          <Action code="archiveTaskHandleList:getFileHistory">
            <Button type="link" onClick={() => this.handleLookHistoryVersion(record)}>
              {text}
            </Button>
          </Action>
        ),
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Button type="link" size="small" onClick={() => this.handleDownLoadWithTable(record)}>
                下载
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => this.handleFilePreviewWithTable(record)}
              >
                查看
              </Button>
              {/* state:0：未提交（提交、删除）1：处理中（可撤销）2：处理完 */}
              {record && record.state == 0 ? (
                <>
                  <Action code="archiveTaskHandleList:handleDelete">
                    <Button type="link" size="small" onClick={() => this.handleDelete(record)}>
                      删除
                    </Button>
                  </Action>
                  <Button type="link" size="small" onClick={() => this.handleSubmit([record])}>
                    提交
                  </Button>
                </>
              ) : null}
              {/* 处理中（可撤销） */}
              {record && record.revoke === 1 ? (
                <Action code="archiveTaskHandleList:fileRevoke">
                  <Button type="link" size="small" onClick={() => this.handleRevoke(record)}>
                    撤销
                  </Button>
                </Action>
              ) : null}
              {/* option=1可查看审核意见 */}
              {record && record.opinion === 1 ? (
                <Action code="archiveTaskHandleList:reviewOpinion">
                  <Button type="link" size="small" onClick={() => this.handleReviewOpinion(record)}>
                    审核意见
                  </Button>
                </Action>
              ) : null}
            </>
          );
        },
      },
    ],
    failureColumn: [
      {
        key: 'id',
        title: '序号',
        dataIndex: 'id',
        width: 90,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        key: 'fileName',
        title: '文档名称',
        dataIndex: 'fileName',
      },
      {
        key: 'reason',
        title: '失败原因',
        dataIndex: 'reason',
      },
    ],
    fileList: [],
    blobUrl: '',
    fileType: '',
    fileNumber: '',
    IMG: false,
    firstUpload: true,
    uploadCompleted: false,
    params: {
      ...initParams,
    },
    isForm: true, // isForm 展开和收起
    submitMultiLoading: false,
    selectedRowKeys: [],
    selectedRows: [],
    auditOpinion: false,
    uploadFilePathObj: null,
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    document.querySelector('#body-content').scrollIntoView();
    this.initPageData();
  }

  /**
   * 初始化页面数据
   * * */
  initPageData = () => {
    const { dispatch } = this.props;
    const query = this.props.router.location.query;
    const { proCode, taskIdConventional } = query;
    const payload = {
      proCode,
    };

    if (taskIdConventional) payload.taskId = taskIdConventional;

    // 文档名称下拉列表
    dispatch({
      type: 'archiveTaskHandleListUploadPrinting/getFileNamesReq',
      payload,
    });

    // 操作人
    dispatch({
      type: 'archiveTaskHandleListUploadPrinting/getUsersByProAndTaskReq',
      payload,
    });

    this.state.params = {
      ...this.state.params,
      ...query,
    };

    this.handleGetFileList(this.state.params);
  };

  /**
   * 获取文件列表
   * **/
  handleGetFileList(payload) {
    const { dispatch } = this.props;
    const { pageType, pageSource } = this.props.router.location.query;
    const getFileListReq = pageType === 'update' ? `getUpdatedFileReq` : `getUnUseSealFileReq`;

    this.setState({ selectedRowKeys: [], selectedRows: [] });
    dispatch({
      type: `archiveTaskHandleListUploadPrinting/${getFileListReq}`,
      payload,
    }).then(res => {
      let search = location.search;
      search = search.replace('generateArchiveTask=1', 'generateArchiveTask=0');
      this.state.params.generateArchiveTask = 0;
      const {
        archiveTaskHandleListUploadPrinting: { taskId },
      } = this.props;
      if (!search.includes('taskIdArchive')) {
        search += `&taskIdArchive=${taskId}`;
        this.state.params.taskIdArchive = taskId;
      }

      // 更新的来源页面是任务办理页面时,文件上传前置判断需要传fileId,即文件列表接口第一条数据,如返回数据为空对象禁止上传
      if (pageSource === 'archiveTaskHandleListPage' && pageType === 'update') {
        if (res.data && res.data.rows) {
          this.state.params.fileId = res.data.rows[0].fileId;
        }
      }

      window.history.replaceState(null, null, search);
    });
  }

  /**
   * 提交
   * type:single 单个提交
   * type:multi 批量提交
   * **/
  handleSubmit = (record = [], type = 'single') => {
    const submitFn = () => {
      const {
        dispatch,
        archiveTaskHandleListUploadPrinting: { taskId },
      } = this.props;
      const awpProductFile = record.map(({ fileId, fileNumber }) => ({
        id: fileId,
        fileNumber,
      }));

      if (type === 'multi') {
        this.setState({ submitMultiLoading: true });
      }
      dispatch({
        type: 'archiveTaskHandleListUploadPrinting/launchArchiveReq',
        payload: {
          taskId,
          awpProductFile,
        },
      }).then(res => {
        if (res && res.status === 200) {
          message.success('提交成功~');
          this.handleGetFileList(this.state.params);
        } else {
          message.error(res.message);
        }

        if (type === 'multi') {
          this.setState({ submitMultiLoading: false });
        }
      });
    };

    if (type === 'multi' && record.length === 0) {
      return message.warn('请至少选择一个文件列表~');
    }

    if (record.some(item => item.state != 0)) {
      return message.warn('仅未提交状态的文档可进行提交~');
    }

    if (type === 'single') {
      confirm({
        maskClosable: true,
        content: '请确认是否提交当前文档？',
        onOk: () => {
          submitFn();
        },
      });
    } else {
      submitFn();
    }
  };

  /**
   * 文件删除接口
   * **/
  handleDelete = ({ fileId }) => {
    const {
      dispatch,
      archiveTaskHandleListUploadPrinting: { taskId },
    } = this.props;
    confirm({
      maskClosable: true,
      content: '请确认是否删除当前文档？',
      onOk: () => {
        dispatch({
          type: 'archiveTaskHandleListUploadPrinting/getUploadFileRevokeReq',
          payload: {
            fileIds: [fileId],
            taskId,
          },
          callback: () => {
            message.success('删除当前文档成功~');
            this.handleGetFileList(this.state.params);
          },
        });
      },
    });
  };

  /**
   * 文件撤销接口
   * **/
  handleRevoke = ({ fileId, processInstanceId }) => {
    confirm({
      maskClosable: true,
      content: '请确认是否撤销当前文档？',
      onOk: () => {
        this.props.dispatch({
          type: 'archiveTaskHandleListUploadPrinting/getFileRevokeReq',
          payload: {
            fileId,
            processInstanceId,
          },
          callback: () => {
            message.success('撤销当前文档成功~');
            this.handleGetFileList(this.state.params);
          },
        });
      },
    });
  };

  /**
   * 审核意见列表
   * * */
  handleReviewOpinion(record) {
    const { processInstanceId } = record;
    this.setState(
      () => ({
        auditOpinion: true,
      }),
      () => {
        this.props.dispatch({
          type: 'archiveTaskHandleListUploadPrinting/getReviewReq',
          payload: {
            processInstanceId,
          },
        });
      },
    );
  }

  /**
   * 表格下载按钮
   * * */
  handleDownLoadWithTable({ fileNumber, fileName }) {
    this.props.dispatch({
      type: 'manuscriptManagementList/getFileDownLoadReq',
      payload: [`${fileNumber}@${fileName}`],
    });
  }

  /**
   * 弹窗下载按钮
   * * */
  handleDownLoadWithBlob({ awpFileNumber, awpName }) {
    this.props.dispatch({
      type: 'manuscriptManagementList/getFileDownLoadReq',
      payload: [`${awpFileNumber}@${awpName}`],
    });
  }

  /**
   * 表格查看预览按钮
   * * */
  handleFilePreviewWithTable({ fileNumber, fileName }) {
    const arr = fileName.split('.');
    const fileType = fileName.split('.')[arr.length - 1];
    this.previewFile(fileNumber, fileName, fileType);
  }

  /**
   * 弹窗查看预览按钮
   * * */
  handleFilePreviewWithBlob({ awpFileNumber, awpName }) {
    const arr = awpName.split('.');
    const fileType = awpName.split('.')[arr.length - 1];
    this.previewFile(awpFileNumber, awpName, fileType);
  }

  /**
   * 预览文件
   * * */
  previewFile(fileNumber, fileName, fileType) {
    if (IMGs.includes(fileType)) {
      this.setState(
        {
          ablePreview: true,
          IMG: true,
        },
        () => {
          filePreviewWithBlobUrl(
            `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${fileNumber}@${fileName}`,
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
        fileNumber,
        fileType,
      });
    }
  }

  /**
   * 刷新数据
   * * */
  handleReupload = () => {
    const { firstUpload } = this.state;
    if (!firstUpload) {
      this.handleGetFileList(this.state.params);
      this.setState({ uploadCompleted: false });
    }
  };

  /**
   * 获取上传接口地址栏所需参数
   * **/
  getUrlParams = () => {
    const {
      params: { taskIdArchive, taskIdConventional, type, proCode },
    } = this.state;
    const {
      location: {
        query: { pageType, fileId },
      },
    } = this.props.router;
    let urlParams = null;

    if (pageType === 'update') {
      urlParams = {
        fileId: fileId ? fileId : this.state.params.fileId,
        taskId: taskIdArchive,
      };
    } else {
      urlParams = {
        pageNum: 1,
        pageSize: 10,
        taskIdArchive,
        generateArchiveTask: 0,
        type,
        proCode,
      };
      if (taskIdConventional) {
        urlParams.taskIdConventional = taskIdConventional;
      }
    }

    return urlParams;
  };

  /**
   * 大文件切割上传前
   * **/
  handleBigFileBeforeUpload = async uploadFileInfo => {
    const { dispatch } = this.props;
    const { pageType } = this.props.router.location.query;
    const urlParams = this.getUrlParams();
    const fileName = [];
    this.state.urlParams = urlParams;

    dispatch({
      type: 'archiveTaskHandleListUploadPrinting/getUploadFailureBackInfo',
      payload: {
        uploadFailureBackInfo: [],
      },
    });

    Object.keys(uploadFileInfo).forEach(key => {
      fileName.push({
        fileName: uploadFileInfo[key].name,
      });
    });

    const bool = await dispatch({
      type: 'archiveTaskHandleListUploadPrinting/getUploadBeforeCheckedReq',
      payload: {
        urlParams,
        fileName,
      },
    }).then(res => {
      const data = res.data ? res.data : {};
      // 文件上传接口所需的文件保存目录
      const uploadFilePathObj = {};

      if (JSON.stringify(data.useSealFileMap) === '{}') {
        message.error('该用印文档未找到原文档,请重新上传~');
        return false;
      }

      // 用印登记和更新登记接口需要检测接口返回的所有数据
      this.state.uploadPrintingCheckBackInfo = data;

      // 用印上传为批量上传 需要过滤上传文件为检测接口返回的文件
      // 更新上传为单个上传 不需要过滤 仅需要判断failure数组为空可进行上传否则不可进行上传
      if (pageType !== 'update') {
        // 用印上传
        for (let key in data.useSealFileMap) {
          uploadFilePathObj[`${data.useSealFileMap[key].fileName}`] =
            data.useSealFileMap[key].uploadFilePath;
        }
        this.setState({ uploadFilePathObj });

        const { useSealFileMap = {} } = data;
        const uploadFileInfoArr = Array.from(uploadFileInfo);
        const needUploadFileList = [];
        Object.keys(useSealFileMap).forEach(key => {
          uploadFileInfoArr.forEach(item => {
            if (useSealFileMap[key].fileName === item.name) {
              needUploadFileList.push(item);
            }
          });
        });

        return {
          needUploadFileList,
        };
      } else {
        // 用印更新
        this.setState({ uploadFilePathObj: data.uploadFilePath });
        return data.failure.length === 0 ? true : false;
      }
    });

    return bool;
  };

  /**
   * 文件上传失败后的回调
   * **/
  handleUploadFailureAfter = uploadFailureBackInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archiveTaskHandleListUploadPrinting/updateFailTableList',
      payload: {
        uploadFailureBackInfo,
      },
    });
  };

  /**
   * 大文件上传后信息登记
   * **/
  handleUploadSuccessAfter = uploadSuccessBackInfo => {
    const { dispatch } = this.props;
    const { uploadPrintingCheckBackInfo } = this.state;
    let bodyParams = cloneDeep(uploadPrintingCheckBackInfo);
    const { pageType } = this.props.router.location.query;
    const urlParams = this.state.urlParams;

    if (pageType !== 'update') {
      // 批量上传
      for (let key in uploadPrintingCheckBackInfo.useSealFileMap) {
        if (
          uploadPrintingCheckBackInfo.useSealFileMap[key].fileName ===
          uploadSuccessBackInfo.fileName
        ) {
          bodyParams.useSealFileMap = {};
          bodyParams.useSealFileMap[key] = uploadSuccessBackInfo;
        }
      }
    } else {
      // 单个上传
      bodyParams = {
        ...bodyParams,
        ...uploadSuccessBackInfo,
      };
    }

    this.setState({ uploadCompleted: false, selectedRowKeys: [], selectedRows: [] });
    const uploadAfterRegisterCallback = dispatch({
      type: 'archiveTaskHandleListUploadPrinting/getUploadAfterRegisterReq',
      payload: {
        urlParams,
        bodyParams,
      },
    }).then(() => {
      this.state.params.pageNum = 1;
      this.state.params.pageSize = 10;
    });

    return uploadAfterRegisterCallback;
  };

  /**
   * 取消：返回上一页面
   * * */
  handleBackPage() {
    const {
      dispatch,
      location: {
        query: { radioType },
      },
    } = this.props;
    if (radioType === 0 || radioType === 1) {
      dispatch(
        routerRedux.push({
          pathname: '/projectManagement/archiveTaskHandleList/index',
          query: { radioType },
        }),
      );
    } else {
      dispatch(routerRedux.goBack());
    }
  }

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch(val) {
    this.state.params.keyWords = val;
    this.state.params.fileStatus = [];
    this.state.params.fileName = [];
    this.state.params.creatorIds = [];
    this.state.params.pageNum = 1;
    this.handleGetFileList(this.state.params);
  }
  /**
   * 重置
   */
  handleClearVal = () => {
    this.props.form.resetFields();
    this.state.params = {
      ...this.state.params,
      direction: 'DESC',
      field: '',
    };
  };
  /**
   * select 模糊搜索
   * **/
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  /**
   * 查看历史版本
   * **/
  handleLookHistoryVersion({ fileId }) {
    this.setState(
      {
        lookHistoryVersion: true,
      },
      () => {
        this.props.dispatch({
          type: 'documentManagementDetail/getFileHistoryReq',
          payload: { fileId },
        });
      },
    );
  }
  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions() {
    this.setState(state => ({
      isForm: !state.isForm,
    }));
  }

  /**
   * 查询
   * 筛选条件：文件状态、文件名
   */
  handleSearchBtn = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.state.params = {
        ...this.state.params,
        direction: 'DESC',
        field: '',
        pageNum: 1,
        pageSize: 10,
        ...values,
      };
      this.state.params.keyWords && delete this.state.params.keyWords;
      this.handleGetFileList(this.state.params);
    });
  };

  /**
   * @method  handleSetPageNum 切换页数的时候触发
   * @param page 当前页数
   */
  handleSetPageNum(page) {
    this.state.params.pageNum = page;
    this.handleGetFileList(this.state.params);
  }

  /**
   * @method  handleSetPageSize 切换条数的时候触发
   */
  handleSetPageSize(pageNum, pageSize) {
    this.state.params = {
      ...this.state.params,
      pageNum,
      pageSize,
    };
    this.handleGetFileList(this.state.params);
  }

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange(order, field, sorter) {
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
    this.handleGetFileList(params);
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

  render() {
    const {
      selectedRowKeys,
      selectedRows,
      successColumn,
      failureColumn,
      fileList,
      blobUrl,
      fileType,
      fileNumber,
      IMG,
      uploadCompleted,
      params: { pageSize, pageNum },
      submitMultiLoading,
      pageType,
      uploadFilePathObj,
    } = this.state;
    const {
      archiveTaskHandleListUploadPrinting: {
        successTableList,
        successTableListTotal,
        failTableList,
        creatorList,
        fileNameList,
        reviewList,
      },
      global: {
        saveIP: { gateWayIp },
      },
      loading,
      modalLoading,
      reviewListLoading,
      form: { getFieldDecorator },
      documentManagementDetail: { fileHistory },
    } = this.props;
    const PAGETYPE = this.props.router.location.query.pageType;
    const url = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${fileNumber}`;
    const key = uuid();

    const handleModel = () => {
      this.setState({ ablePreview: false, IMG: false, blobUrl: '' });
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
        title: '上传时间',
        dataIndex: 'createTime',
      },
      {
        key: 'creatorName',
        title: '操作用户',
        dataIndex: 'creatorName',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() => this.handleDownLoadWithBlob(record)}>
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

    let SearchHtml = (
      <Row type="flex" align="middle" style={{ marginBottom: '20px' }}>
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
    let DetailSearchHtml = (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Form.Item label="文档状态" {...formItemLayout}>
            {getFieldDecorator('fileStates')(
              <Select
                placeholder="请选择文档状态"
                mode="multiple"
                showArrow
                allowClear
                filterOption={this.handleFilterOption}
              >
                <Select.Option key={0} title={'待提交'}>
                  待提交
                </Select.Option>
                <Select.Option key={3} title={'待归档'}>
                  待归档
                </Select.Option>
                <Select.Option key={4} title={'归档中'}>
                  归档中
                </Select.Option>
                <Select.Option key={5} title={'已归档'}>
                  已归档
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="文档名称" {...formItemLayout}>
            {getFieldDecorator('fileNames')(
              <Select
                placeholder="请选择文档名称"
                mode="multiple"
                showArrow
                allowClear
                filterOption={this.handleFilterOption}
              >
                {fileNameList.length &&
                  fileNameList.map(item => (
                    <Select.Option key={item.id} title={item.value}>
                      {item.value}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="操作用户" {...formItemLayout}>
            {getFieldDecorator('userIds')(
              <Select
                placeholder="请选择操作用户"
                mode="multiple"
                showArrow
                allowClear
                filterOption={this.handleFilterOption}
              >
                {creatorList.length &&
                  creatorList.map(item => (
                    <Select.Option key={item.key} title={item.value}>
                      {item.value}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col style={{ float: 'right', textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSearchBtn}>
            查询
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleClearVal}>
            重置
          </Button>
          <Button
            style={{ marginLeft: 23 }}
            onClick={() => this.handleOpenConditions()}
            type="link">收起<Icon type="up" />
          </Button>
        </Col>
      </Row>
    );
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div id="body-content">
        {/* 文件预览 弹窗可拖动 */}
        <ModalWin
          id="archiveTaskHandleListUploadPrinting"
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
        {/* 审核意见列表Modal */}
        <Modal
          bodyStyle={{
            height: '400px',
            overflowY: 'auto',
          }}
          title="审核意见"
          visible={this.state.auditOpinion}
          onOk={() => this.setState({ auditOpinion: false })}
          onCancel={() => this.setState({ auditOpinion: false })}
        >
          <Spin spinning={reviewListLoading}>
            <List
              itemLayout="horizontal"
              dataSource={reviewList}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Row type="flex">
                        <Col span={8}>{item.reviewer}</Col>
                        <Col span={16}>{item.createTime}</Col>
                      </Row>
                    }
                    description={item.opinion}
                  />
                </List.Item>
              )}
            />
          </Spin>
        </Modal>
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
        <Card
          bordered={false}
          style={{ borderBottom: '1px solid #e8e8e8' }}
          title={PAGETYPE === 'update' ? '用印文件更新' : '用印文件归档'}
          extra={
            <>
              <Button
                className={styles.save}
                style={{
                  marginRight: '10px',
                }}
                loading={submitMultiLoading}
                onClick={() => this.handleSubmit(selectedRows, 'multi')}
              >
                提交
              </Button>
              <Button onClick={() => this.handleBackPage()}>取消</Button>
            </>
          }
        >
          <Row type="flex" justify="center">
            <Col span={4}>
              {uploadCompleted ? (
                <Button onClick={this.handleReupload}>
                  <Icon type="reload" />
                  刷新数据
                </Button>
              ) : (
                <UploadSection
                  sectionSize={2}
                  btnName="上传文件"
                  uploadFilePath={uploadFilePathObj}
                  isMultiple={pageType !== 'update'}
                  isDisabled={
                    (successTableList.length === 1 && successTableList[0].state === 0) ||
                    !successTableList.length
                  }
                  beforeUpload={this.handleBigFileBeforeUpload}
                  uploadSuccessAfter={this.handleUploadSuccessAfter}
                  uploadFailureAfter={this.handleUploadFailureAfter}
                />
              )}
            </Col>
          </Row>
        </Card>
        <div style={{ height: 'calc(100vh - 242px)', overflowY: 'auto' }}>
          <Card title="文档清单" bordered={false}>
            <Form>{this.state.isForm ? SearchHtml : DetailSearchHtml}</Form>
            <Table
              columns={successColumn}
              dataSource={successTableList}
              rowSelection={rowSelection}
              pagination={false}
              loading={loading}
              scroll={{ x: successColumn.length * 160 }}
              onChange={(order, field, sorter) => this.sortChange(order, field, sorter)}
            />
            {successTableListTotal != 0 ? (
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
                  current={pageNum}
                  pageSize={pageSize}
                  onChange={page => this.handleSetPageNum(page)}
                  onShowSizeChange={(page, size) => this.handleSetPageSize(page, size)}
                  total={successTableListTotal}
                  showTotal={() => `共 ${successTableListTotal || 0} 条数据`}
                  showSizeChanger
                  showQuickJumper={successTableListTotal > pageSize}
                />
              </div>
            ) : null}
            <Button
              type="link"
              style={{
                float: 'left',
                marginTop: '-40px',
                display: successTableList && successTableList.length == 0 ? 'none' : 'block',
              }}
            >
              已勾选 {this.state.selectedRowKeys.length} 个
            </Button>
          </Card>
          <Card title="文档名称错误原因" bordered={false}>
            <Table columns={failureColumn} dataSource={failTableList} pagination={false} />
          </Card>
        </div>
      </div>
    );
  }
}

const archiveTaskHandleListUploadPrinting = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          archiveTaskHandleListUploadPrinting,
          manuscriptManagementList,
          archiveTaskHandleList,
          loading,
          router,
          global,
          documentManagementDetail,
        }) => ({
          archiveTaskHandleListUploadPrinting,
          manuscriptManagementList,
          archiveTaskHandleList,
          router,
          global,
          documentManagementDetail,
          loading:
            loading.effects['archiveTaskHandleListUploadPrinting/getUnUseSealFileReq'] ||
            loading.effects['archiveTaskHandleListUploadPrinting/getUpdatedFileReq'],
          modalLoading: loading.effects['documentManagementDetail/getFileHistoryReq'],
          reviewListLoading: loading.effects['archiveTaskHandleListUploadPrinting/getReviewReq'],
        }),
      )(Agent),
    ),
  ),
);

export default archiveTaskHandleListUploadPrinting;

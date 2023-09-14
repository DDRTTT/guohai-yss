/**
 * 项目管理--底稿底稿列表
 * author: jiaqiuhua
 * * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Form,
  Icon,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Select,
  Table,
  Tag,
  Tooltip,
  TreeSelect,
} from 'antd';
import { handleClearQuickJumperValue } from '@/pages/archiveTaskHandleList/util';
import SelfTree from '@/components/SelfTree';
import UploadSection from '@/components/UploadSection';
import FileHistoryVersion from '@/components/FileHistoryVersion';
import Preview from '@/components/Preview';
import ReviewOpinion from '@/components/ReviewOpinion';
import DownloadFile from '@/components/DownloadFile';
import FuzzySearch from './component/FuzzySearch';
import PreciseSearch from './component/PreciseSearch';
import TreeNodeAdd from './component/TreeNodeAdd';
import styles from './index.less';
import UpdateFilePath from './component/UpdateFilePath';
import BatchPrinting from './component/BatchPrinting';

const { Sider, Content } = Layout;
const { confirm } = Modal;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const fuzzySearchRef = React.createRef();
let initParams = {
  keyWords: '',
  inType: '1',
  taskId: '',
  proCode: '',
  direction: 'DESC',
  field: '',
  pageNum: 1,
  pageSize: 10,
};

/**
 * 目录树：通过子节点获取所有父节点信息
 * treeData：树的数据源
 * 处理为合适的数据格式
 * **/
const valueMap = {};
const findParentNodeLoops = (treeData, parent) => {
  return (treeData || []).map(({ children, value, name, applicability }) => {
    const node = (valueMap[value] = {
      parent,
      value,
      name,
      applicability,
    });
    node.children = findParentNodeLoops(children, node);
    return node;
  });
};
/**
 * 目录树：获取当前点击元素的父节点信息
 * value：当前点击的子节点
 * **/
const findParentNodeGetPath = value => {
  const path = [];
  let current = valueMap[value];
  while (current) {
    if (current.value !== value) {
      path.unshift(current);
    }
    current = current.parent;
  }
  return path;
};

@Form.create()
class Agent extends Component {
  componentDidMount() {
    document.querySelector('#body-content').scrollIntoView();
    const {
      location: {
        query: { proCode, id },
      },
    } = this.props;

    initParams = {
      keyWords: '',
      inType: '1',
      taskId: id,
      proCode,
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    };
    this.state.params.taskId = id;
    this.state.params.proCode = proCode;

    // 获取目录树
    this.handleGetSysTreeData();
    // 获取全部文档列表
    this.handleGetTableData(this.state.params);
    // 初始化查询条件数据
    this.initQueryData();
  }

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
   * 初始化查询条件数据
   * **/
  initQueryData = () => {
    const { dispatch } = this.props;
    const { proCode, taskId } = this.state.params;
    // 文档名称下拉列表
    dispatch({
      type: 'manuscriptManagementList/getFileNameListReq',
      payload: {
        proCode,
        inType: '1',
      },
    });
    // 操作人
    dispatch({
      type: 'taskManagementDeal/getUsersByProAndTaskReq',
      payload: {
        proCode,
        taskId,
      },
    });
  };

  /**
   * 批量用印，是否用印文档，是否需要用印实时保存
   * **/
  handleRadioChange = arr => {
    const { dispatch } = this.props;
    const params = arr.map(item => {
      return {
        ...item,
        useSeal: item.needUseSeal === 0 ? 0 : item.useSeal,
      };
    });

    dispatch({
      type: 'taskManagementDeal/updateNeedUseSealOrUseSealReq',
      payload: params,
      callback: () => {
        this.handleGetTableData(this.state.params);
      },
    });
  };

  /**
   * 根据左侧所选树查询右侧文件table数据
   * 项目文档管理查看文档页面传inType:2；项目任务管理办理页面传inType:1
   */
  handleGetTableData = (params, type) => {
    const { dispatch } = this.props;
    const { expand, selectedRowKeys, selectedRows } = this.state;
    const payload = { ...params };
    expand && delete payload.keyWords;
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'taskManagementDeal/getFileListAbleSortReq',
        payload,
        callback: res => {
          this.state.params = payload;
          if (selectedRowKeys.length > 0 && type !== 'sortChange') {
            this.setState({
              selectedRowKeys: [],
              selectedRows: {},
            });
          }
          handleClearQuickJumperValue();
          resolve(res);
        },
      });
    });
  };

  /**
   * 批量操作的参数
   * **/
  handleBatchOperationParams = () => {
    const { selectedRows } = this.state;
    const arr = [];
    for (let key in selectedRows) {
      arr.push(selectedRows[key]);
    }

    return arr;
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
   * 删除
   * * */
  handleFileDelete = record => {
    const { dispatch } = this.props;
    const fileIds = record.filter(item => item.operStatus === '0').map(item => item.id);

    if (fileIds.length === 0) {
      return message.warn('仅文档状态为待提交的文档可进行删除~');
    }

    confirm({
      maskClosable: true,
      content: '请确认是否删除当前文档?',
      onOk: () => {
        dispatch({
          type: 'taskManagementDeal/getUploadFileRevokeReq',
          payload: {
            taskId: record[0].taskId,
            fileIds,
          },
          callback: () => {
            const { params } = this.state;
            this.handleGetSysTreeData();
            this.handleGetTableData(params).then(res => {
              // 更新文档名称、操作用户下拉数据源
              this.initQueryData();
              // 以下代码只针对列表删除的 删除本页最后一条数据后 页面需展示上一页的数据
              const { rows, total } = res.data;

              if (rows.length === 0 && total > 0) {
                this.state.params.pageNum--;
                this.handleGetTableData(this.state.params);
              }
            });
          },
        });
      },
    });
  };

  /**
   * 提交
   * 操作列单个提交及批量提交
   * type='submitMulti'批量提交提交按钮需设置loading状态
   * **/
  handleSubmit = (record, type) => {
    const { dispatch } = this.props;
    const {
      params: { taskId },
    } = this.state;
    const recordArr = [...record];
    const awpProductFile = recordArr
      .filter(item => item.operStatus === '0')
      .map(({ id, needUseSeal, useSeal, awpFileNumber }) => ({
        id,
        needUseSeal,
        useSeal,
        awpFileNumber,
      }));

    if (awpProductFile.length === 0) {
      return message.warn('请至少选择一个未提交状态的文档进行提交~');
    }
    if (type === 'submitMulti') {
      this.setState({ submitLoading: true });
    }
    dispatch({
      type: 'taskManagementDeal/getConventionalReq',
      payload: {
        taskId,
        awpProductFile,
      },
    }).then(res => {
      if (type === 'submitMulti') {
        this.setState({ submitLoading: false });
      }

      if (res && res.status === 200) {
        message.success('提交成功~');
        this.handleGetSysTreeData();
        this.handleGetTableData(this.state.params);
      } else {
        message.error(res.message);
      }
    });
  };

  /**
   * 撤销
   * 文档状态operStatus=1时可撤销
   * * */
  handleFileRevoke = ({ id, processInstanceId }) => {
    const { dispatch } = this.props;
    confirm({
      maskClosable: true,
      content: '请确认是否删除当前文档?',
      onOk: () => {
        dispatch({
          type: 'taskManagementDeal/getFileRevokeReq',
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
   * 获取子组件信息
   * * */
  getClickMsg = (result, msg) => {
    this.state.clickMsgData = msg;
    const { code, isLeaf = false, applicability } = msg;
    this.setState({
      expand: false,
      ableOperateUpload: code && isLeaf && applicability,
      isLeaf,
    });
    fuzzySearchRef.current && fuzzySearchRef.current.handleReset();
    code ? (initParams.awpCode = code) : delete initParams.awpCode;
    this.handleGetTableData(initParams);
  };

  /**
   * 目录树：删除
   * **/
  handleTreeNodeDelete = () => {
    const { dispatch } = this.props;
    const {
      clickMsgData: { code, dataSource },
    } = this.state;

    if (!code) return message.warn('请选择要删除的节点~');
    if (dataSource === 0) return message.warn('标准目录不可删除');
    confirm({
      title: '确定删除所选节点吗?',
      onOk: () => {
        dispatch({
          type: 'taskManagementDeal/getTaskPathDeleteReq',
          payload: [code],
          callback: () => {
            this.selfTreeRef.handleReset();
            // 更新目录树
            this.handleGetSysTreeData();
          },
        });
      },
    });
  };

  /**
   * 目录树：新增
   * **/
  handleTreeNodeAdd = () => {
    this.setState(
      {
        opType: 'add',
      },
      () => {
        this.treeNodeAddRef.handleShow();
      },
    );
  };

  /**
   * 目录树：修改
   * **/
  handleTreeNodeEdit = () => {
    const {
      clickMsgData: { code, dataSource, applicability },
    } = this.state;

    if (!code) return message.warn('请选择一个要修改的节点~');
    if (dataSource === 0) return message.warn('标准目录不可修改~');
    if (applicability === 0) return message.warn('不适用目录不可修改~');

    this.setState(
      {
        opType: 'edit',
      },
      () => {
        this.treeNodeAddRef.handleShow();
      },
    );
  };

  /**
   * 目录树：不适用
   * **/
  handleTreeNodeNoUsed = () => {
    const {
      clickMsgData: { code, applicability },
    } = this.state;

    if (!code) return message.warn('请选择不适用节点~');
    if (applicability === 0) return message.warn('选择的节点中含有不适用目录');
    this.setState({
      noUsed: true,
    });
  };

  /**
   * 目录树：不适用提交原因
   * **/
  handleNoUsedConfirm = () => {
    const { dispatch } = this.props;
    const {
      reason,
      clickMsgData: { code },
    } = this.state;

    if (!reason) return message.warn('请填写不适用原因');
    dispatch({
      type: 'manuscriptManage/handleSetPathFetch',
      payload: { code: [code], applicability: '0', reason },
    }).then(data => {
      if (data) {
        this.setState({ noUsed: false, reason: '' });
        this.selfTreeRef.handleReset();
        this.handleGetSysTreeData();
      }
    });
  };

  /**
   * 目录树：不适用修改
   * **/
  handleTreeNodeNoUsedEdit = () => {
    this.setState(
      {
        noUsedEdit: true,
        treeSelectValue: '',
      },
      () => {
        const { dispatch } = this.props;
        const { proCode, taskId } = initParams;
        // 获取不适用下拉树数据
        dispatch({
          type: 'taskManagementDeal/getNoPathTreeReq',
          payload: {
            proCode,
            taskId,
          },
          callback: treeData => {
            findParentNodeLoops(treeData);
          },
        });
      },
    );
  };

  /**
   * 目录树：不适用目录修改时 获取选中的值
   * **/
  handleTreeSelectValue = value => {
    this.setState({
      treeSelectValue: value,
    });
  };

  /**
   * 目录树：不适用修改确定
   * **/
  handleNoUsedEditConfirm = () => {
    const { dispatch } = this.props;
    const { treeSelectValue } = this.state;
    const parentNodeArr = findParentNodeGetPath(treeSelectValue);

    if (!treeSelectValue) return message.warn('请选择目录~');
    if (parentNodeArr.some(item => item.applicability === 0))
      return message.warn(
        '父级目录不适用，无法调整子级目录。若要调整子级目录，请先将父级目录不适用修改~',
      );

    dispatch({
      type: 'manuscriptManage/handleSetPathFetch',
      payload: { code: [treeSelectValue], applicability: '1', reason: '' },
    }).then(data => {
      if (data) {
        this.setState({ noUsedEdit: false, treeSelectValue: '' });
        this.selfTreeRef.handleReset();
        this.handleGetSysTreeData();
      }
    });
  };

  /**
   * 上传文件前的判断是否选择左侧树
   * **/
  handleCanUpload = () => {
    const {
      clickMsgData: { applicability },
    } = this.state;

    if (!initParams.awpCode) return message.warn('请选择左侧目录树~');
    if (!this.state.isLeaf) return message.warn('当前不是最底层子目录，无法上传文档~');
    if (applicability === 0) return message.warn('不适用目录不能上传文件');
  };

  /**
   * 大文件切割上传前
   * **/
  handleBigFileBeforeUpload = async uploadFileInfo => {
    const { dispatch } = this.props;
    const payload = [];

    Object.keys(uploadFileInfo).forEach(key => {
      payload.push({
        pathId: initParams.awpCode,
        taskId: this.state.params.taskId,
        fileName: uploadFileInfo[key].name,
      });
    });
    const bool = await dispatch({
      type: 'taskManagementDeal/getFileCheckedReq',
      payload,
    }).then(res => {
      if (res && res.status === 200) {
        const { uploadFilePath = '' } = res.data ? res.data : {};
        this.setState({
          uploadFilePath,
        });
        return true;
      } else {
        message.error(res.message);
        return false;
      }
    });

    return bool;
  };

  /**
   * 大文件上传后信息登记
   * **/
  handleUploadSuccessAfter = uploadSuccessBackInfo => {
    const { dispatch } = this.props;
    const uploadAfterRegisterCallback = dispatch({
      type: 'taskManagementDeal/getFileRegisteredReq',
      payload: [
        {
          pathId: initParams.awpCode,
          taskId: this.state.params.taskId,
          ...uploadSuccessBackInfo,
        },
      ],
      callback: () => {
        this.handleGetSysTreeData();
        this.initQueryData();
        this.handleGetTableData(this.state.params);
      },
    });

    return uploadAfterRegisterCallback;
  };

  /**
   * 切换
   * **/
  handleToggle = () => {
    this.setState(({ expand }) => ({ expand: !expand }));
  };

  /**
   *  显示预览框
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

  state = {
    columns: [
      {
        key: 'awpName',
        title: '文档名称',
        dataIndex: 'awpName',
        width: 250,
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
        key: 'operStatus',
        title: '文档状态',
        width: 150,
        dataIndex: 'operStatus',
        sorter: true,
        render: (text, record) => <Tag>{record.statusName}</Tag>,
      },
      {
        key: 'needUseSeal',
        title: '是否需要用印',
        width: 150,
        dataIndex: 'needUseSeal',
        sorter: true,
        render: (text, record) => (
          <Select
            onChange={value =>
              this.handleRadioChange([
                {
                  id: record.id,
                  needUseSeal: value,
                  useSeal: record.useSeal,
                },
              ])
            }
            disabled={record.operStatus !== '0'}
            value={record.needUseSeal === 1 ? '是' : '否'}
          >
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        ),
      },
      {
        key: 'useSeal',
        title: '是否用印文档',
        width: 150,
        dataIndex: 'useSeal',
        sorter: true,
        render: (text, record) => {
          return (
            <Select
              onChange={value =>
                this.handleRadioChange([
                  {
                    id: record.id,
                    useSeal: value,
                    needUseSeal: record.needUseSeal,
                  },
                ])
              }
              disabled={record.needUseSeal === 0}
              value={record.useSeal === 1 ? '是' : '否'}
            >
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          );
        },
      },
      {
        key: 'createTime',
        title: '上传时间',
        dataIndex: 'createTime',
        sorter: true,
        width: 180,
      },
      {
        key: 'version',
        title: '版本号',
        width: 100,
        dataIndex: 'version',
        sorter: true,
        render: (text, record) => (
          <Action code="archiveTaskHandleList:getFileHistory">
            <FileHistoryVersion fileId={record.id} buttonText={text} />
          </Action>
        ),
      },
      {
        key: 'creatorId',
        title: '操作用户',
        width: 150,
        dataIndex: 'creatorId',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={record.creatorName}>
            <span>{record.creatorName}</span>
          </Tooltip>
        ),
      },
      {
        key: 'opt',
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <DownloadFile buttonType="link" record={[record]} />
              <Button type="link" size="small" onClick={() => this.handlePreview(record)}>
                查看
              </Button>
              {/* operStatus:0：未提交（提交、删除）1：处理中（可撤销）2：处理完 */}
              {record && record.operStatus === '0' ? (
                <>
                  <Action code="archiveTaskHandleList:handleDelete">
                    <Button
                      type="link"
                      size="small"
                      onClick={() => this.handleFileDelete([record])}
                    >
                      删除
                    </Button>
                  </Action>
                  <Action code="archiveTaskHandleList:handleSubmit">
                    <Button type="link" size="small" onClick={() => this.handleSubmit([record])}>
                      提交
                    </Button>
                  </Action>
                </>
              ) : null}
              {/* 处理中（可撤销） */}
              <Action code="archiveTaskHandleList:fileRevoke">
                {record && record.revoke === 1 ? (
                  <Button type="link" size="small" onClick={() => this.handleFileRevoke(record)}>
                    撤销
                  </Button>
                ) : null}
              </Action>
              {/* option=1可查看审核意见 */}
              <Action code="archiveTaskHandleList:reviewOpinion">
                {record && record.opinion === 1 ? (
                  <ReviewOpinion processInstanceId={record.processInstanceId} />
                ) : null}
              </Action>
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
    fileStatus: [
      {
        code: '0',
        name: '待提交',
      },
      {
        code: '1',
        name: '审批中',
      },
      {
        code: '2',
        name: '已审批',
      },
      {
        code: '3',
        name: '待归档',
      },
      {
        code: '4',
        name: '归档中',
      },
      {
        code: '5',
        name: '已归档',
      },
    ],
    params: {
      keyWords: '',
      inType: '1',
      taskId: '',
      proCode: '',
      direction: 'DESC',
      field: '',
      pageNum: 1,
      pageSize: 10,
    },
    expand: false,
    selectedRows: {},
    selectedRowKeys: [],
    collapsed: false,
    ableOperateUpload: false,
    submitLoading: false,
    uploadFilePath: '',
    previewShow: false,
    isLeaf: false,
    clickMsgData: {},
    opType: 'add',
    noUsed: false,
    noUsedEdit: false,
    reason: '',
    treeSelectValue: '',
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

  // 适用不适用修改：下拉树
  loopTree = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={
              <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
                {item.title}
              </span>
            }
            value={item.id}
            disabled={item.applicability == 0 ? false : true}
          >
            {this.loopTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={
            <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
              {item.title}
            </span>
          }
          value={item.id}
          disabled={item.applicability == 0 ? false : true}
        ></TreeNode>
      );
    });

  /**
   * 取消：返回上一页面
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
        pathname: '/projectManagement/archiveTaskHandleList/index',
        query: { radioType },
      }),
    );
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
      taskManagementDeal: {
        tableList: { rows = [] },
      },
    } = this.props;
    const bool = rows.some(item => item.operStatus === '1');
    if (!bool) {
      return message.warn('当前页数据暂无可进行催办的文件');
    }

    dispatch({
      type: 'review/getSendReminderReq',
      payload: {
        node: '1',
        proCode,
        proName,
      },
    });
  };

  render() {
    const {
      dispatch,
      loading,
      form,
      taskManagementDeal: { saveTreeData, tableList, creatorList, noUsedTreeList },
      manuscriptManagementList: { fileNameList },
    } = this.props;
    const {
      selectedRowKeys,
      columns,
      ableOperateUpload,
      submitLoading,
      collapsed,
      uploadFilePath,
      expand,
      fileStatus,
      previewShow,
      params: { pageNum, pageSize, taskId },
      clickMsgData,
      opType,
      noUsed,
      noUsedEdit,
      reason,
      treeSelectValue,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <Layout id="body-content">
        {/* 文档预览modal */}
        {previewShow ? (
          <Preview id="taskManagementDeal" onRef={ref => (this.previewChild = ref)} />
        ) : null}
        {/* 目录树：增加、修改modal */}
        <TreeNodeAdd
          multipleFlag={false}
          props={{
            dispatch,
            saveTreeData,
            clickMsgData,
            taskId,
            proCode: initParams.proCode,
            opType,
          }}
          wrappedComponentRef={ref => (this.treeNodeAddRef = ref)}
          newAddTreeSuccess={this.handleGetSysTreeData}
        />
        {/* 目录树：不适用modal */}
        <Modal
          title={'不适用'}
          visible={noUsed}
          onOk={this.handleNoUsedConfirm}
          onCancel={() => this.setState({ noUsed: false })}
        >
          <TextArea
            rows={4}
            maxLength={200}
            placeholder={'请填写不适用原因'}
            value={reason}
            onChange={e => this.setState({ reason: e.target.value })}
          />
        </Modal>
        {/* 目录树：不适用修改 */}
        <Modal
          title={'适用性修改'}
          visible={noUsedEdit}
          onOk={this.handleNoUsedEditConfirm}
          onCancel={() => this.setState({ noUsedEdit: false })}
        >
          <TreeSelect
            style={{ width: '100%' }}
            value={treeSelectValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择目录"
            treeDefaultExpandAll
            onSelect={this.handleTreeSelectValue}
          >
            {this.loopTree(noUsedTreeList)}
          </TreeSelect>
        </Modal>
        <Card
          bordered={false}
          title={
            <Breadcrumb>
              <Breadcrumb.Item>项目任务管理</Breadcrumb.Item>
              <Breadcrumb.Item>办理</Breadcrumb.Item>
            </Breadcrumb>
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
              <Action code="archiveTaskHandleList:handleSubmit">
                <Button
                  type="primary"
                  style={{
                    marginRight: '10px',
                  }}
                  loading={submitLoading}
                  onClick={() =>
                    this.handleSubmit(this.handleBatchOperationParams(), 'submitMulti')
                  }
                >
                  提交
                </Button>
              </Action>
              <Button onClick={this.handleBackPage}>取消</Button>
            </>
          }
        >
          <Layout
            style={{ backgroundColor: '#fff', height: 'calc(100vh - 200px)', overflowY: 'auto' }}
          >
            <Sider
              breakpoint="lg"
              theme="light"
              width={400}
              style={{
                margin: '15px',
                overflowY: 'auto',
              }}
              collapsed={collapsed}
            >
              <div className={styles.treeOptBtnWrap}>
                <Action code="archiveTaskHandleList:treeNodeAdd">
                  <Button size={'small'} onClick={this.handleTreeNodeAdd}>
                    添加
                  </Button>
                </Action>
                <Action code="archiveTaskHandleList:treeNodeEdit">
                  <Button size={'small'} onClick={this.handleTreeNodeEdit}>
                    修改
                  </Button>
                </Action>
                <Action code="archiveTaskHandleList:treeNodeDelete">
                  <Button size={'small'} onClick={this.handleTreeNodeDelete}>
                    删除
                  </Button>
                </Action>
                <Action code="archiveTaskHandleList:treeNodeNoUsed">
                  <Button size={'small'} onClick={this.handleTreeNodeNoUsed}>
                    不适用
                  </Button>
                </Action>
                <Action code="archiveTaskHandleList:treeNodeNoUsedEdit">
                  <Button size={'small'} onClick={this.handleTreeNodeNoUsedEdit}>
                    不适用修改
                  </Button>
                </Action>
              </div>
              <SelfTree
                treeData={saveTreeData}
                multipleFlag={false}
                getCheckMsg={() => null}
                getClickMsg={this.getClickMsg}
                ref={ref => (this.selfTreeRef = ref)}
              />
            </Sider>
            <Content>
              <Card
                title={
                  <>
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
                  </>
                }
                extra={
                  <Action code="archiveTaskHandleList:handleUpload">
                    {ableOperateUpload ? (
                      <UploadSection
                        sectionSize={2}
                        btnName="添加文档"
                        uploadFilePath={uploadFilePath}
                        beforeUpload={this.handleBigFileBeforeUpload}
                        uploadSuccessAfter={this.handleUploadSuccessAfter}
                      />
                    ) : (
                      <Button onClick={this.handleCanUpload}>
                        <Icon type="upload" />
                        添加文档
                      </Button>
                    )}
                  </Action>
                }
              >
                {/* 高级搜索 */}
                {expand ? (
                  <PreciseSearch
                    props={{
                      form,
                      fileStatus,
                      fileName: fileNameList,
                      creatorIds: creatorList,
                      initParams,
                    }}
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
                  style={{ marginTop: '24px' }}
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
                        <Menu.Item key="2">
                          <Action code="archiveTaskHandleList:handleDelete">
                            <Button
                              size="small"
                              type="link"
                              style={{ color: '#666' }}
                              onClick={() =>
                                this.handleFileDelete(this.handleBatchOperationParams())
                              }
                            >
                              批量删除
                            </Button>
                          </Action>
                        </Menu.Item>
                        <Menu.Item key="3">
                          <Action code="archiveTaskHandleList:updateFilePath">
                            <UpdateFilePath
                              saveTreeData={saveTreeData}
                              record={this.handleBatchOperationParams()}
                              handleGetSysTreeData={this.handleGetSysTreeData}
                              handleGetTableData={() => this.handleGetTableData(this.state.params)}
                            />
                          </Action>
                        </Menu.Item>
                        <Menu.Item key="4">
                          <BatchPrinting
                            batchOperationParams={this.handleBatchOperationParams()}
                            handleRadioChange={this.handleRadioChange}
                          />
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Button>批量操作</Button>
                  </Dropdown>
                </div>
              </Card>
            </Content>
          </Layout>
        </Card>
      </Layout>
    );
  }
}

export default errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({ taskManagementDeal, manuscriptManagementList, review, loading, router, global }) => {
          const tableLoading =
            loading.effects['taskManagementDeal/getFileListAbleSortReq'] ||
            loading.effects['taskManagementDeal/getUploadFileRevokeReq'] ||
            loading.effects['taskManagementDeal/getConventionalReq'] ||
            loading.effects['taskManagementDeal/getFileRevokeReq'];
          return {
            taskManagementDeal,
            manuscriptManagementList,
            review,
            router,
            global,
            loading: tableLoading,
          };
        },
      )(Agent),
    ),
  ),
);

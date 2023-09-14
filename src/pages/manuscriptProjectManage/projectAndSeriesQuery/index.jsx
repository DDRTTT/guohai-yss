/**
 *  项目/系列信息查询
 */
import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import PublishModal from '../projectInfoManger/PublishModal';
import ApplyModal from '../seriesManage/ApplyModal';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

let saveFlag = false;
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@Form.create()
class ProjectAndSeriesQuery extends Component {
  componentDidMount() {
    const {
      location: {
        query: { radioType },
      },
    } = this.props;
    this.state.tabKey = radioType === 'series' ? 'series' : 'project';
    this.getTableList();
    this.getDropLists();
  }

  /**
   * 获取列表数据
   */
  getTableList() {
    const { pageNum, pageSize, keyWords, direction, field, tabKey } = this.state;
    const { dispatch, form } = this.props;
    const formItems = form.getFieldsValue();

    if (formItems.projectPeriod) {
      formItems.proCDateMin = this.formatDate(formItems.projectPeriod[0]);
      formItems.proCDateMax = this.formatDate(formItems.projectPeriod[1]);
      delete formItems.projectPeriod;
    }
    if (formItems.projectState) {
      if (formItems.projectState.length === 2) {
        formItems.projectState = '';
      } else {
        formItems.projectState = formItems.projectState[0];
      }
    }
    const payload = {
      pageNum,
      pageSize,
      keyWords,
      direction,
      field,
      projectState: '',
      ...formItems,
      type: tabKey === 'project' ? 1 : 0,
    };
    dispatch({
      type: 'projectInfoManger/getTableData',
      payload,
    }).then(res => {
      if (res && res.status === 200) {
        if (tabKey === 'project') {
          this.setState({
            projectData: res.data.rows,
            projectDataTotal: res.data.total,
          });
        } else {
          this.setState({
            seriesData: res.data.rows,
            seriesDataTotal: res.data.total,
          });
        }
      } else {
        message.warn(res.message);
      }
      setTimeout(() => {
        const InputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
        if (InputElement) InputElement.value = '';
      }, 300);
    });
  }

  /**
   * 项目终止操作
   * @param {} record
   */
  projectStop = ({ proCode, type }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectInfoManger/checkTerminationReq',
      payload: {
        proCode,
        type,
      },
      callback: res => {
        if (res.data === 'ok') {
          this.setState({
            proCode,
            showTermModal: true,
          });
          return;
        }

        Modal.confirm({
          title: '提示',
          content: `${res.data}`,
          onOk: () => {
            this.setState({
              proCode,
              showTermModal: true,
            });
          },
        });
      },
    });
  };

  /**
   * 项目终止补录框 点击确认终止
   */
  projectTermOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (values.terminationReason && values.terminationDate) {
        if (saveFlag) return;
        saveFlag = true;
        dispatch({
          type: 'projectInfoManger/projectTermination',
          payload: {
            terminationReason: values.terminationReason,
            terminationDate: this.formatDate(values.terminationDate._d),
            proCode: this.state.proCode,
          },
        }).then(res => {
          saveFlag = false;
          if (res && res.status === 200) {
            form.resetFields();
            this.setState({
              showTermModal: false,
            });
            this.getTableList();
          }
        });
      }
    });
  };

  /**
   * 项目终止补录框 取消操作
   */
  projectTermCancel = () => {
    this.props.form.resetFields();
    this.setState({
      showTermModal: false,
    });
  };

  formatDate(date, type) {
    if (type === 1) return date ? moment(date).format('YYYY-MM-DD 00:00:00') : '';
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
        pageNum: 1,
      },
      () => {
        this.getTableList();
      },
    );
  };

  getDropLists() {
    const { dispatch } = this.props;
    // 项目名称下拉框数据获取
    dispatch({
      type: 'projectInfoManger/getProcodeAndProDept',
      payload: {
        type: 1,
      },
    });
    // 系列名称下拉框数据获取
    dispatch({
      type: 'seriesManage/getSeriesName',
      payload: {
        type: 0,
        projectState: [],
      },
    });
    // 所属部门下拉框数据获取
    dispatch({
      type: 'projectInfoManger/getProcodeAndProDept',
      payload: {
        type: 2,
      },
    });
    // 项目类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
    // 交易场所下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_trad_place',
      },
    });
  }

  /**
   * 条件查询
   * @method searchBtn
   */
  searchBtn = () => {
    this.setState(
      {
        pageNum: 1,
      },
      () => {
        this.getTableList();
      },
    );
  };

  /**
   * @method 展开搜索/收起搜索
   */
  toggle = () => {
    const { expand } = this.state;
    this.props.form.resetFields();
    this.setState({ expand: !expand, keyWords: '' });
  };

  /**
   * @method 改变表格排序
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   */
  changeTable = (pagination, filters, sorter) => {
    this.setState(
      {
        direction: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? (sorter.field === 'seriesName' ? 'seriesCode' : sorter.field) : '',
      },
      () => this.getTableList(),
    );
  };

  /**
   * @method  handleSetPage 切换页数的时候触发
   * @param page 当前页数
   * @param pageSize
   */
  handleSetPage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize,
      },
      () => this.getTableList(),
    );
  };

  // 查看操作
  watchDetail = record => {
    if (this.state.tabKey === 'project') {
      router.push(
        `/projectManagement/projectInfoDetail?proCode=${record.proCode}&radioType=project`,
      );
    } else {
      router.push(
        `/projectManagement/addProjectSeries?proCode=${
          record.proCode
        }&dis=${true}&radioType=series`,
      );
    }
  };

  // 变更操作
  updateData = record => {
    if (this.state.tabKey === 'project') {
      router.push(
        `/projectManagement/addInformationManagement?proCode=${record.proCode}&radioType=project&update=${record.update}`,
      );
    } else {
      router.push(
        `/projectManagement/addProjectSeries?proCode=${record.proCode}&update=${record.update}&radioType=series`,
      );
    }
  };

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 格式化日期
   * @param {Date} date
   */
  deFormatDate = date => (date ? moment(date).format('YYYY-MM-DD') : '');

  state = {
    expand: false, // 判断搜索是否隐藏
    keyWords: '',
    pageNum: 1,
    pageSize: 10,
    direction: '',
    field: '',
    proCode: '',
    tabKey: 'project',
    projectData: [],
    projectDataTotal: 0,
    seriesData: [],
    seriesDataTotal: 0,
    showTermModal: false,
    projectColumns: [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        sorter: true,
        width: 400,
        ellipsis: {
          showTitle: false,
        },
        render: proName => {
          return (
            <Tooltip placement="topLeft" title={proName}>
              <span>{proName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: '项目编码',
        dataIndex: 'proCode',
        sorter: true,
        align: 'center',
        width: 140,
        ellipsis: {
          showTitle: false,
        },
        render: proCode => {
          return (
            <Tooltip placement="topLeft" title={proCode}>
              <span>{proCode}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proShortName',
        title: '项目简称',
        dataIndex: 'proShortName',
        sorter: true,
        align: 'center',
        width: 180,
        ellipsis: {
          showTitle: false,
        },
        render: proShortName => {
          return (
            <Tooltip placement="topLeft" title={proShortName}>
              <span>{proShortName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        align: 'center',
        sorter: true,
        width: 100,
        render: checked => {
          return <Tag>{checked ? '已生效' : '未生效'}</Tag>;
        },
      },
      {
        key: 'seriesCode',
        title: '系列编码',
        dataIndex: 'seriesCode',
        sorter: true,
        align: 'center',
        width: 140,
        render: seriesCode => {
          return <span>{seriesCode}</span>;
        },
      },
      {
        key: 'seriesName',
        title: '系列名称',
        dataIndex: 'seriesName',
        sorter: true,
        align: 'center',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: seriesName => {
          return (
            <Tooltip placement="topLeft" title={seriesName}>
              <span>{seriesName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proType',
        title: '项目类型',
        dataIndex: 'proType',
        sorter: true,
        align: 'center',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (proType, record) => {
          return (
            <Tooltip placement="topLeft" title={record.proTypeName}>
              <span>{record.proTypeName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proArea',
        title: '项目区域',
        dataIndex: 'proArea',
        sorter: true,
        align: 'center',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (proArea, record) => {
          return (
            <Tooltip
              placement="topLeft"
              title={proArea === '900000' ? record.overseasProArea : record.proAreaName}
            >
              <span>{proArea === '900000' ? record.overseasProArea : record.proAreaName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        sorter: true,
        align: 'center',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proDept => {
          return (
            <Tooltip placement="topLeft" title={proDept}>
              <span>{proDept}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCDate',
        title: '开始日期',
        dataIndex: 'proCDate',
        sorter: true,
        align: 'center',
        width: 160,
        render: proCDate => {
          return <span>{this.deFormatDate(proCDate)}</span>;
        },
      },
      {
        key: 'projectState',
        title: '项目阶段',
        dataIndex: 'projectState',
        sorter: true,
        align: 'center',
        width: 200,
        render: (projectState, record) => {
          return <span>{record.projectStateName}</span>;
        },
      },
      {
        key: 'proBusType',
        title: '项目分类',
        dataIndex: 'proBusType',
        sorter: true,
        align: 'center',
        width: 160,
        render: proBusType => {
          return <span>{proBusType === '1' ? '管理人项目' : '非管理人项目'}</span>;
        },
      },
      {
        key: 'biddingFlag',
        title: '是否招投标',
        dataIndex: 'biddingFlag',
        sorter: true,
        width: 160,
        render: biddingFlag => {
          return <span>{biddingFlag === 1 ? '是' : '否'}</span>;
        },
      },
      {
        key: 'customerName',
        title: '客户名称',
        dataIndex: 'customerName',
        sorter: true,
        align: 'center',
        width: 170,
        ellipsis: {
          showTitle: false,
        },
        render: customerName => {
          return (
            <Tooltip placement="topLeft" title={customerName}>
              <span>{customerName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'customerType',
        title: '客户类型',
        dataIndex: 'customerType',
        sorter: true,
        align: 'center',
        width: 130,
        render: customerType => {
          return <span>{customerType === '1' ? '机构' : '自然人'}</span>;
        },
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        align: 'center',
        width: 160,
        render: createTime => {
          return <span>{createTime}</span>;
        },
      },
      {
        key: 'creatorId',
        title: '创建人',
        dataIndex: 'creatorId',
        align: 'center',
        sorter: true,
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (creatorId, record) => {
          return (
            <Tooltip placement="topLeft" title={record.creatorName}>
              <span>{record.creatorName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'terminationStateName',
        title: '终止状态',
        dataIndex: 'terminationStateName',
        sorter: true,
        align: 'center',
        width: 110,
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'terminationReason',
        title: '终止原因',
        dataIndex: 'terminationReason',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        width: 200,
        render: terminationReason => {
          return (
            <Tooltip placement="topLeft" title={terminationReason}>
              <span>{terminationReason}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'terminationDate',
        title: '终止时间',
        dataIndex: 'terminationDate',
        sorter: true,
        align: 'center',
        width: 160,
        render: terminationDate => {
          return <span>{this.deFormatDate(terminationDate)}</span>;
        },
      },
      {
        key: 'terminationId',
        title: '操作人',
        dataIndex: 'terminationId',
        sorter: true,
        align: 'center',
        width: 170,
        render: (terminationId, record) => {
          return <span>{record.terminationName}</span>;
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 252,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          const {
            addProjectInfo: { tradingPlacesList },
            dispatch,
          } = this.props;
          return (
            <>
              <Action code="projectAndSeriesQuery:look">
                <Button onClick={() => this.watchDetail(record)} type="link" size="small">
                  查看
                </Button>
              </Action>
              <Action code="projectAndSeriesQuery:update">
                <Button
                  style={{ display: record.update ? 'inline-block' : 'none' }}
                  onClick={() => this.updateData(record)}
                  type="link"
                  size="small"
                >
                  变更
                </Button>
              </Action>
              <Action code="projectAndSeriesQuery:apply">
                {record && record.report === 1 ? (
                  <ApplyModal
                    onConfirm={() => {
                      this.getTableList();
                    }}
                    dispatch={dispatch}
                    proCode={record.proCode}
                    data={{
                      productFilterOption: this.productFilterOption,
                      tradingPlacesList,
                    }}
                  />
                ) : null}
              </Action>
              <Action code="projectAndSeriesQuery:issue">
                {record && record.publish === 1 ? (
                  <PublishModal
                    onConfirm={() => {
                      this.getTableList();
                    }}
                    dispatch={dispatch}
                    proCode={record.proCode}
                  />
                ) : null}
              </Action>
              <Action code="projectAndSeriesQuery:stop">
                <Button
                  style={{
                    display:
                      record.checked === 1 && record.isTermination === 0 ? 'inline-block' : 'none',
                  }}
                  onClick={() => this.projectStop(record)}
                  type="link"
                  size="small"
                >
                  终止
                </Button>
              </Action>
            </>
          );
        },
      },
    ],
    seriesColumns: [
      {
        key: 'proName',
        title: '系列名称',
        dataIndex: 'proName',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        width: 300,
        render: proName => {
          return (
            <Tooltip placement="topLeft" title={proName}>
              <span>{proName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: '系列编码',
        dataIndex: 'proCode',
        sorter: true,
        align: 'center',
        width: 140,
        render: proCode => {
          return <span>{proCode}</span>;
        },
      },
      {
        key: 'proType',
        title: '项目类型',
        dataIndex: 'proType',
        sorter: true,
        align: 'center',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (proType, record) => {
          return (
            <Tooltip placement="topLeft" title={record.proTypeName}>
              <span>{record.proTypeName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        align: 'center',
        sorter: true,
        width: 100,
        render: checked => {
          return checked ? <Tag>已生效</Tag> : <Tag>未生效</Tag>;
        },
      },
      {
        key: 'proArea',
        title: '项目区域',
        dataIndex: 'proArea',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        width: 200,
        render: (proArea, record) => {
          return (
            <Tooltip
              placement="topLeft"
              title={proArea === '900000' ? record.overseasProArea : record.proAreaName}
            >
              <span>{proArea === '900000' ? record.overseasProArea : record.proAreaName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'projectState',
        title: '项目阶段',
        dataIndex: 'projectState',
        sorter: true,
        align: 'center',
        width: 200,
        render: (projectState, record) => {
          return <span>{record.projectStateName}</span>;
        },
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        width: 200,
        render: proDept => {
          return (
            <Tooltip placement="topLeft" title={proDept}>
              <span>{proDept}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'customerName',
        title: '客户名称',
        dataIndex: 'customerName',
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        align: 'center',
        width: 170,
        render: customerName => {
          return (
            <Tooltip placement="topLeft" title={customerName}>
              <span>{customerName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'customerType',
        title: '客户类型',
        dataIndex: 'customerType',
        sorter: true,
        align: 'center',
        width: 130,
        render: customerType => {
          return <span>{customerType === '1' ? '机构' : '自然人'}</span>;
        },
      },
      {
        key: 'productNum',
        title: '项目数量',
        dataIndex: 'productNum',
        sorter: true,
        align: 'center',
        width: 120,
        render: productNum => {
          return <span>{productNum}</span>;
        },
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        align: 'center',
        width: 160,
        render: createTime => {
          return <span>{createTime}</span>;
        },
      },
      {
        key: 'creatorId',
        title: '创建人',
        dataIndex: 'creatorId',
        sorter: true,
        align: 'center',
        width: 150,
        render: (creatorId, record) => {
          return <span>{record.creatorName}</span>;
        },
      },
      {
        key: 'terminationStateName',
        title: '终止状态',
        dataIndex: 'terminationStateName',
        sorter: true,
        align: 'center',
        width: 110,
        render: text => <Tag>{text}</Tag>,
      },
      {
        key: 'terminationReason',
        title: '终止原因',
        dataIndex: 'terminationReason',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        width: 200,
        render: terminationReason => {
          return (
            <Tooltip placement="topLeft" title={terminationReason}>
              <span>{terminationReason}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'terminationDate',
        title: '终止时间',
        dataIndex: 'terminationDate',
        sorter: true,
        align: 'center',
        width: 160,
        render: terminationDate => {
          return <span>{this.deFormatDate(terminationDate)}</span>;
        },
      },
      {
        key: 'terminationId',
        title: '操作人',
        dataIndex: 'terminationId',
        sorter: true,
        align: 'center',
        width: 170,
        render: (terminationId, record) => {
          return <span>{record.terminationName}</span>;
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 208,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          const {
            addProjectInfo: { tradingPlacesList },
            dispatch,
          } = this.props;
          return (
            <>
              {record.checked === 1 ? (
                <Button onClick={() => this.jumpToSeriesExtends(record)} type="link" size="small">
                  编辑继承
                </Button>
              ) : null}
              <Action code="projectAndSeriesQuery:look">
                <Button onClick={() => this.watchDetail(record)} type="link" size="small">
                  查看
                </Button>
              </Action>
              <Action code="projectAndSeriesQuery:update">
                <Button
                  style={{ display: record.update ? 'inline-block' : 'none' }}
                  onClick={() => this.updateData(record)}
                  type="link"
                  size="small"
                >
                  变更
                </Button>
              </Action>
              <Action code="projectAndSeriesQuery:apply">
                {record && record.report === 1 ? (
                  <ApplyModal
                    onConfirm={() => {
                      this.getTableList();
                    }}
                    dispatch={dispatch}
                    proCode={record.proCode}
                    data={{
                      productFilterOption: this.productFilterOption,
                      tradingPlacesList,
                    }}
                  />
                ) : null}
              </Action>
              <Action code="projectAndSeriesQuery:stop">
                <Button
                  style={{
                    display:
                      record.checked === 1 && record.isTermination === 0 ? 'inline-block' : 'none',
                  }}
                  onClick={() => this.projectStop(record)}
                  type="link"
                  size="small"
                >
                  终止
                </Button>
              </Action>
            </>
          );
        },
      },
    ],
    expandedColumns: [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        width: 200,
        render: proName => {
          return (
            <Tooltip placement="topLeft" title={proName}>
              <span>{proName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: '项目编码',
        dataIndex: 'proCode',
        align: 'center',
        sorter: true,
        width: 160,
        render: proCode => {
          return <span>{proCode}</span>;
        },
      },
      {
        key: 'proShortName',
        title: '项目简称',
        dataIndex: 'proShortName',
        sorter: true,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        width: 180,
        render: proShortName => {
          return (
            <Tooltip placement="topLeft" title={proShortName}>
              <span>{proShortName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proType',
        title: '项目类型',
        dataIndex: 'proType',
        sorter: true,
        align: 'center',
        width: 240,
        render: (proType, record) => {
          return <span>{record.proTypeName}</span>;
        },
      },
      {
        key: 'proArea',
        title: '项目区域',
        dataIndex: 'proArea',
        sorter: true,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        width: 200,
        render: (proArea, record) => {
          return (
            <Tooltip
              placement="topLeft"
              title={proArea === '900000' ? record.overseasProArea : record.proAreaName}
            >
              <span>{proArea === '900000' ? record.overseasProArea : record.proAreaName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        sorter: true,
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        width: 200,
        render: proDept => {
          return (
            <Tooltip placement="topLeft" title={proDept}>
              <span>{proDept}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'projectStateName',
        title: '项目阶段',
        dataIndex: 'projectStateName',
        sorter: true,
        align: 'center',
        width: 160,
        render: projectStateName => {
          return <span>{projectStateName}</span>;
        },
      },
      {
        key: 'checked',
        title: '状态',
        dataIndex: 'checked',
        sorter: true,
        align: 'center',
        width: 100,
        render: checked => {
          return <span>{checked ? '已审核' : '未审核'}</span>;
        },
      },
    ],
    expandedRowRender: record => {
      const { expandedColumns } = this.state;
      const {
        seriesManage: { allSubTableListObj },
        subLoading,
      } = this.props;
      return (
        <Card style={{ width: '1680px' }}>
          <Table
            rowKey={record => record.proCode}
            columns={expandedColumns}
            dataSource={allSubTableListObj[`seriesCode_${record.proCode}`]}
            pagination={false}
            loading={subLoading}
          />
        </Card>
      );
    },
  };

  jumpToSeriesExtends = ({ proCode }) => {
    router.push({
      pathname: '/projectManagement/projectAndSeriesQueryExtends',
      query: {
        proCode,
      },
    });
  };

  /**
   * @method 切换tab
   * @param e
   */
  changeTabs = e => {
    this.props.form.resetFields();
    this.setState(
      {
        tabKey: e.target.value,
        pageNum: 1,
        pageSize: 10,
        direction: '',
        field: '',
      },
      () => {
        this.getTableList();
      },
    );
  };

  // 主表格点击展开图标时触发
  handleExpand(expanded, record) {
    if (expanded) {
      this.setState(
        () => ({
          curClickId: record.proCode,
        }),
        () => {
          this.handleSubTableData(record.proCode);
        },
      );
    }
  }

  // 子表格查询
  handleSubTableData(proCode) {
    this.props
      .dispatch({
        type: 'seriesManage/getProductBySeries',
        payload: {
          seriesCode: proCode,
        },
      })
      .then(() => {
        setTimeout(() => {
          const attr = `data-row-key=${`${proCode}-extra-row`}`;
          const $dom = this.attrSelect(`tr[${attr}]`);
          const h = this.getH($dom);

          const $row = this.attrSelect(`tr[${attr}]`);
          this.setH($row, h);
        }, 500);
      });
  }

  // 原生JS简单实现标签+属性选择器
  attrSelect = name => {
    const Arr = [];
    const ns = name.match(/([a-z]+)\[([^=]+)=([^\]]*)\]/);
    if (!ns) return null;
    const tag = ns[1];
    const attrName = ns[2];
    const attrValue = ns[3];
    const eles = document.getElementsByTagName(tag);
    for (let i = 0; i < eles.length; i++) {
      if (eles[i].getAttribute(attrName) == attrValue) {
        Arr.push(eles[i]);
      }
    }
    return Arr;
  };

  /**
   * 原生JS设置高度
   * @param {*} item
   * @param {*} h
   */
  setH = (item, h) => {
    if (!h || !item) return;
    for (let i = 0; i < item.length; i++) {
      if (item[i]) item[i].style.height = `${h}px`;
    }
  };

  /**
   * 原生JS获取高度
   * @param {*} item
   */
  getH = item => {
    if (item && item[0]) return item[0].clientHeight;
    return null;
  };

  render() {
    const {
      projectInfoManger: { proDeptList, proCodeList },
      addProjectInfo: { proTypeList },
      seriesManage: { seriesList },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      pageNum,
      pageSize,
      keyWords,
      tabKey,
      projectData,
      projectDataTotal,
      seriesData,
      seriesDataTotal,
      projectColumns,
      seriesColumns,
      showTermModal,
      expandedRowRender,
    } = this.state;

    return (
      <>
        <Card
          style={{
            marginBottom: 10,
          }}
        >
          <Form {...layout}>
            <Row gutter={24}>
              <Col md={12} sm={12}>
                <Breadcrumb>
                  <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
                  <Breadcrumb.Item>项目</Breadcrumb.Item>
                  <Breadcrumb.Item>系列信息查询</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col
                gutter={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  // margin: 15,
                }}
              >
                <Search
                  placeholder="请输入项目/系列名称或编码"
                  onSearch={val => this.seachTableData(val)}
                  onChange={ev => this.setState({ keyWords: ev.target.value })}
                  value={keyWords}
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    width: 220,
                  }}
                />
                <Button
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    marginLeft: 23,
                    fontSize: 14,
                  }}
                  onClick={this.toggle}
                  type="link"
                >
                  展开搜索
                  <Icon type="down" />
                </Button>
              </Col>
            </Row>
            <Row
              gutter={24}
              style={{ display: this.state.expand ? 'block' : 'none', marginTop: 20 }}
            >
              <Col span={8}>
                {tabKey === 'project' ? (
                  <Form.Item name="proCode" label="项目名称:">
                    {getFieldDecorator('proCode')(
                      <Select
                        placeholder="请选择"
                        mode="multiple"
                        showArrow
                        filterOption={this.productFilterOption}
                      >
                        {proCodeList &&
                          proCodeList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item name="proCode" label="系列名称:">
                    {getFieldDecorator('proCode')(
                      <Select
                        placeholder="请选择"
                        mode="multiple"
                        showArrow
                        filterOption={this.productFilterOption}
                      >
                        {seriesList &&
                          seriesList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                <Form.Item name="proType" label="项目类型:">
                  {getFieldDecorator('proType')(
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      showArrow
                      filterOption={this.productFilterOption}
                    >
                      {proTypeList &&
                        proTypeList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="proDept" label="所属部门:">
                  {getFieldDecorator('proDept')(
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      showArrow
                      filterOption={this.productFilterOption}
                    >
                      {proDeptList &&
                        proDeptList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
              <Col span={8} style={{ display: tabKey === 'project' ? 'inline-block' : 'none' }}>
                <Form.Item label="项目周期">
                  {getFieldDecorator('projectPeriod')(
                    <RangePicker placeholder={['开始日期', '结束日期']} format="YYYY-MM-DD" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={tabKey === 'project' ? '项目状态:' : '系列状态:'}>
                  {getFieldDecorator('projectState')(
                    <Select placeholder="请选择" mode="multiple" showArrow>
                      <Option value="noterminal">未终止</Option>
                      <Option value="state5">已终止</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: 'right', float: 'right', marginTop: 10 }}>
                <Button
                  type="primary"
                  onClick={() => this.searchBtn()}
                  htmlType="submit"
                  style={{
                    display: this.state.expand ? 'inline-block' : 'none',
                    marginRight: '10px',
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => form.resetFields()}
                  style={{ display: this.state.expand ? 'inline-block' : 'none', marginLeft: 8 }}
                >
                  重置
                </Button>
                <Button style={{ marginLeft: 5 }} onClick={this.toggle} type="link">
                  收起
                  <Icon type="up" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Radio.Group
            style={{ marginBottom: '20px' }}
            buttonStyle="solid"
            defaultValue="project"
            value={tabKey}
            onChange={this.changeTabs}
          >
            <Radio.Button value="project">项目信息</Radio.Button>
            <Radio.Button value="series">系列信息</Radio.Button>
          </Radio.Group>
          {tabKey === 'project' ? (
            <>
              <Table
                dataSource={projectData}
                columns={projectColumns}
                scroll={{ x: 1300 }}
                rowKey={record => record.proCode}
                loading={loading}
                pagination={false}
                onChange={this.changeTable}
              />
              {projectDataTotal != 0 ? (
                <Pagination
                  style={{
                    marginTop: 20,
                    textAlign: 'right',
                  }}
                  current={pageNum}
                  pageSize={pageSize}
                  onChange={this.handleSetPage}
                  onShowSizeChange={this.handleSetPage}
                  total={projectDataTotal}
                  showTotal={() => `共 ${projectDataTotal} 条数据`}
                  showSizeChanger
                  showQuickJumper={projectDataTotal > pageSize}
                />
              ) : null}
            </>
          ) : (
            <>
              <Table
                dataSource={seriesData}
                columns={seriesColumns}
                scroll={{ x: 1300 }}
                expandedRowRender={expandedRowRender}
                onExpand={(expanded, record) => this.handleExpand(expanded, record)}
                rowKey={record => record.proCode}
                loading={loading}
                pagination={false}
                onChange={this.changeTable}
              />
              {seriesDataTotal != 0 ? (
                <Pagination
                  style={{
                    marginTop: 20,
                    textAlign: 'right',
                    float: 'right',
                  }}
                  current={pageNum}
                  pageSize={pageSize}
                  onChange={this.handleSetPage}
                  onShowSizeChange={this.handleSetPage}
                  total={seriesDataTotal}
                  showTotal={() => `共 ${seriesDataTotal} 条数据`}
                  showSizeChanger
                  showQuickJumper={seriesDataTotal > pageSize}
                />
              ) : null}
            </>
          )}
        </Card>
        {/* 项目终止信息补录弹窗 */}
        <Modal
          width={600}
          title="补录信息"
          visible={showTermModal}
          onOk={this.projectTermOk}
          onCancel={this.projectTermCancel}
          okText="确认终止"
        >
          <Form>
            <Form.Item name="terminationReason" label="终止原因:">
              {getFieldDecorator('terminationReason', {
                rules: [{ required: true, message: '终止原因是必填项' }],
              })(
                <TextArea
                  rows={4}
                  allowClear
                  autosize={{ minRows: 3, maxRows: 6 }}
                  maxLength={500}
                />,
              )}
            </Form.Item>
            <Form.Item name="terminationDate" label="终止日期">
              {getFieldDecorator('terminationDate', {
                rules: [{ required: true, message: '终止日期是必填项' }],
              })(<DatePicker placeholder="请选择" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ projectInfoManger, addProjectInfo, seriesManage, loading }) => ({
        projectInfoManger,
        addProjectInfo,
        seriesManage,
        loading: loading.effects['projectInfoManger/getTableData'],
        subLoading: loading.effects['seriesManage/getProductBySeries'],
      }))(ProjectAndSeriesQuery),
    ),
  ),
);
export default WrappedSingleForm;

/**
 *  项目系列管理
 */
import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

let tabKey = '';
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@Form.create()
class SeriesManage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getTableList();
    this.getDropLists();
    this.handleColumns();
  }

  componentWillUnmount() {
    clearTimeout(this.setTimeoutInputElement);
    clearTimeout(this.setTimeoutAttr);
  }

  // 我发起 已办理 不展示 任务到达时间
  handleColumns = () => {
    let columns1 = [];
    this.state.columns.forEach(item => {
      if (item.title !== '任务到达时间') columns1.push(item);
    });
    this.setState({
      columns1,
    });
  };

  // 获取列表数据
  getTableList() {
    const { pageNum, pageSize, keyWords, direction, field, taskTypeCode } = this.state;
    const { dispatch, form } = this.props;
    const formItems = form.getFieldsValue();

    const payload = {
      pageNum,
      pageSize,
      keyWords,
      direction,
      field,
      ...formItems,
      isProduct: 0,
      taskTypeCode,
    };
    dispatch({
      type: 'projectInfoManger/getProductList',
      payload,
    }).then(res => {
      this.setState(
        {
          dataList: [],
          total: 0,
        },
        () => {
          if (res && res.status === 200) {
            this.setState({
              dataList: res.data.rows,
              total: res.data.total,
            });
          } else {
            message.warn(res.message);
          }
        },
      );
      this.setTimeoutInputElement = setTimeout(() => {
        let InputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
        if (InputElement) InputElement.value = '';
      }, 300);

      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    });
  }

  formatDate(date, type) {
    if (type === 1) return moment(date).format('YYYY-MM-DD 00:00:00');
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
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
    // this.getSeriesList();
    //获取系列名称下拉数据
    this.props
      .dispatch({
        type: 'seriesManage/getSeriesName',
        payload: {
          type: 0,
          projectState: [],
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.setState({
            seriesList: res.data,
          });
        }
      });
    // 所属部门下拉框数据获取
    dispatch({
      type: 'projectInfoManger/getProcodeAndProDept',
      payload: {
        type: 4,
      },
    });
    // 项目类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
    // 系列流程类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_process_series',
      },
    });
  }

  // 条件查询
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

  // 删除操作
  delete = record => {
    confirm({
      title: '温馨提示',
      closable: true,
      content: '请确认是否删除这条数据?',
      onOk: () => {
        this.props
          .dispatch({
            type: 'projectInfoManger/delete',
            payload: {
              instanceIds: [record.processInstanceId],
            },
          })
          .then(res => {
            if (res && res.status === 200) {
              this.getTableList();
            }
          });
      },
    });
  };

  // 批量删除
  handleDelete = () => {
    const { selectedRows } = this.state;
    const instanceIds = [];
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].checked === 1 || selectedRows[i].operStatus === 'S001_2') {
        message.info('已生效或流程中的项目不能删除!');
        return;
      }
      instanceIds.push(selectedRows[i].processInstanceId);
    }
    confirm({
      title: '温馨提示',
      closable: true,
      content: '请确认是否批量删除这些数据?',
      onOk: () => {
        this.props
          .dispatch({
            type: 'projectInfoManger/delete',
            payload: {
              instanceIds,
            },
          })
          .then(res => {
            if (res && res.status === 200) {
              this.getTableList();
            }
          });
      },
    });
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
        field: sorter.order ? sorter.field : '',
      },
      () => this.getTableList(),
    );
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 切换tab
  changeTabs = key => {
    tabKey = key;
    this.props.form.resetFields();
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        direction: '',
        field: '',
        taskTypeCode: key,
      },
      () => {
        this.getTableList();
      },
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
  watchDetail = ({ processInstanceId }) => {
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
              pathname: `/processCenter/processDetail?processInstanceId=${processInstanceId}&nodeId=${res.data[0].taskDefinitionKey}&taskId=${res.data[0].id}`,
            }),
          );
        }
      },
    });
  };

  // 修改操作
  changeProjectInfo = record => {
    router.push(
      `/projectManagement/addProjectSeries?proCode=${record.proCode}&comeFrom=series&taskId=${record.taskId}`,
    );
  };

  // 审核
  handelCheck = record => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: {
          taskId: record.taskId,
          processDefinitionId: record.processDefinitionId,
          processInstanceId: record.processInstanceId,
          taskDefinitionKey: record.taskDefinitionKey,
          mode: 'deal',
        },
      }),
    );
  };

  // 流转历史
  handleHistory = ({ processInstanceId, taskId }) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/processCenter/processHistory',
        query: {
          processInstanceId,
          taskId,
        },
      }),
    );
  };

  state = {
    expand: false, // 判断搜索是否隐藏
    seriesList: [],
    keyWords: '',
    pageNum: 1,
    pageSize: 10,
    loading: false,
    direction: '',
    field: '',
    selectedRowKeys: [],
    selectedRows: [],
    curClickId: '',
    taskTypeCode: tabKey || 'T001_1',
    dataList: [],
    total: 0,
    columns1: [],
    columns: [
      {
        key: 'proName',
        title: '系列名称',
        dataIndex: 'proName',
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
        key: 'operStatus',
        title: '流程状态',
        dataIndex: 'operStatus',
        align: 'center',
        sorter: true,
        width: 120,
        render: operStatus => {
          return (
            <Tag>
              {operStatus === 'S001_1' ? '待提交' : operStatus === 'S001_2' ? '流程中' : '已结束'}
            </Tag>
          );
        },
      },
      {
        key: 'proArea',
        title: '项目区域',
        dataIndex: 'proArea',
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
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
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
        align: 'center',
        sorter: true,
        width: 140,
        render: customerType => {
          return <span>{customerType === '1' ? '机构' : '自然人'}</span>;
        },
      },
      // {
      //   key: 'productNum',
      //   title: '项目数量',
      //   dataIndex: 'productNum',
      //   align: 'center',
      //   sorter: true,
      //   width: 140,
      //   render: productNum => {
      //     return <span>{productNum}</span>;
      //   },
      // },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        width: 180,
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
        key: 'processType',
        title: '流程类型',
        dataIndex: 'processType',
        sorter: true,
        width: 160,
        render: (processType, record) => {
          return <span>{record.processTypeName}</span>;
        },
      },
      {
        key: 'taskTime',
        dataIndex: 'taskTime',
        title: '任务到达时间',
        width: 180,
        sorter: true,
        render: taskTime => (taskTime ? moment(taskTime).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 215,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          let { taskTypeCode } = this.state;
          return (
            <>
              {taskTypeCode === 'T001_3' || taskTypeCode === 'T001_5' ? (
                <Action code="seriesManage:look">
                  <Button
                    style={{ marginLeft: '-10px' }}
                    onClick={() => this.watchDetail(record)}
                    type="link"
                    size="small"
                  >
                    详情
                  </Button>
                </Action>
              ) : null}
              <Action code="seriesManage:update">
                <Button
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                      record.operStatus === 'S001_1'
                        ? 'inline-block'
                        : 'none',
                  }}
                  onClick={() => this.changeProjectInfo(record)}
                  type="link"
                  size="small"
                >
                  修改
                </Button>
              </Action>
              <Action code="seriesManage:check">
                <Button
                  style={{
                    display:
                      taskTypeCode === 'T001_1' && record.operStatus === 'S001_2'
                        ? 'inline-block'
                        : 'none',
                  }}
                  onClick={() => this.handelCheck(record)}
                  type="link"
                  size="small"
                >
                  审核
                </Button>
              </Action>
              <Action code="seriesManage:history">
                <Button
                  style={{
                    display:
                      taskTypeCode === 'T001_3' ||
                      taskTypeCode === 'T001_5' ||
                      ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                        record.operStatus !== 'S001_1')
                        ? 'inline-block'
                        : 'none',
                  }}
                  onClick={() => this.handleHistory(record)}
                  type="link"
                  size="small"
                >
                  流转历史
                </Button>
              </Action>
              <Action code="seriesManage:delete">
                <Button
                  style={{
                    display:
                      (taskTypeCode === 'T001_5' && record.deleteFlag === 1) ||
                      (taskTypeCode !== 'T001_5' && record.operStatus === 'S001_1')
                        ? 'inline-block'
                        : 'none',
                  }}
                  onClick={() => this.delete(record)}
                  type="link"
                  size="small"
                >
                  删除
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
        title: '项目编码',
        dataIndex: 'proCode',
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
        width: 100,
        render: checked => {
          return <span>{checked ? '已生效' : '未生效'}</span>;
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

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 跳转至新建
   * **/
  handleJumpToAddInformation = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/addProjectSeries',
        query: {
          comeFrom: 'series',
        },
      }),
    );
  };

  // 新建系列按钮
  setOperations = () => {
    return (
      <Action code="seriesManage:add">
        <Button type="primary" onClick={this.handleJumpToAddInformation}>
          新建系列
        </Button>
      </Action>
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
        this.setTimeoutAttr = setTimeout(() => {
          const attr = `data-row-key=${proCode + '-extra-row'}`;
          const $dom = this.attrSelect(`tr[${attr}]`);
          let h = this.getH($dom);

          const $row = this.attrSelect(`tr[${attr}]`);
          this.setH($row, h);
        }, 500);
      });
  }

  // 原生JS简单实现标签+属性选择器
  attrSelect = name => {
    let Arr = [];
    const ns = name.match(/([a-z]+)\[([^=]+)=([^\]]*)\]/);
    if (!ns) return null;
    const tag = ns[1];
    const attrName = ns[2];
    const attrValue = ns[3];
    const eles = document.getElementsByTagName(tag);
    for (var i = 0; i < eles.length; i++) {
      if (eles[i].getAttribute(attrName) == attrValue) {
        Arr.push(eles[i]);
      }
    }
    return Arr;
  };
  /**
   * 原生JS设置高度
   * @param {*} item
   * @param {*} h
   */
  setH = (item, h) => {
    if (!h || !item) return;
    for (var i = 0; i < item.length; i++) {
      if (item[i]) item[i].style.height = h + 'px';
    }
  };
  /**
   * 原生JS获取高度
   * @param {*} item
   */
  getH = item => {
    if (item && item[0]) return item[0].clientHeight;
    else return null;
  };

  render() {
    const {
      addProjectInfo: { proTypeList, processSeriesList },
      projectInfoManger: { proDeptList },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      seriesList,
      keyWords,
      pageNum,
      pageSize,
      columns,
      columns1,
      selectedRowKeys,
      taskTypeCode,
      dataList,
      total,
      expandedRowRender,
    } = this.state;

    return (
      <>
        <Card
          style={{
            marginBottom: 16,
          }}
        >
          <Form {...layout}>
            <Row gutter={24}>
              <Col md={12} sm={12}>
                <Breadcrumb>
                  <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
                  <Breadcrumb.Item>项目信息管理</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col
                gutter={24}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Search
                  placeholder="请输入系列名称/系列编码"
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
              <Col span={6}>
                <Form.Item name="proCode" label="系列名称:">
                  {getFieldDecorator('proCode')(
                    <Select
                      placeholder="请选择系列名称"
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
              </Col>
              <Col span={6}>
                <Form.Item name="proType" label="项目类型:">
                  {getFieldDecorator('proType')(
                    <Select
                      placeholder="请选择项目类型"
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
              <Col span={6}>
                <Form.Item name="proDept" label="所属部门:">
                  {getFieldDecorator('proDept')(
                    <Select
                      placeholder="请选择所属部门"
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
              <div style={{ display: this.state.expand ? 'block' : 'none' }}>
                <Col span={6}>
                  <Form.Item label="系列流程类型:">
                    {getFieldDecorator('processType')(
                      <Select placeholder="请选择" mode="multiple" showArrow>
                        {processSeriesList &&
                          processSeriesList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right', float: 'right', marginTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => this.searchBtn()}
                    htmlType="submit"
                    style={{
                      display: this.state.expand ? 'inline-block' : 'none',
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => form.resetFields()}
                    style={{ display: this.state.expand ? 'inline-block' : 'none', marginLeft: 10 }}
                  >
                    重置
                  </Button>
                  <Button onClick={this.toggle} type="link">
                    收起
                    <Icon type="up" />
                  </Button>
                </Col>
              </div>
            </Row>
          </Form>
        </Card>
        <Card>
          <Tabs
            tabBarExtraContent={this.setOperations()}
            onChange={this.changeTabs}
            activeKey={taskTypeCode}
          >
            <TabPane tab="我待办" key="T001_1" />
            <TabPane tab="我发起" key="T001_3" />
            <TabPane tab="未提交" key="T001_4" />
            <TabPane tab="已办理" key="T001_5" />
          </Tabs>
          <Table
            dataSource={dataList}
            columns={taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4' ? columns : columns1}
            scroll={{ x: 1300 }}
            expandedRowRender={expandedRowRender}
            onExpand={(expanded, record) => this.handleExpand(expanded, record)}
            loading={loading}
            rowKey={record => record.proCode}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            pagination={false}
            onChange={this.changeTable}
          />
          {total != 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <Button onClick={this.handleDelete}>批量删除</Button>
              <Pagination
                style={{
                  textAlign: 'right',
                }}
                defaultCurrent={pageNum}
                defaultPageSize={pageSize}
                onChange={this.handleSetPage}
                onShowSizeChange={this.handleSetPage}
                total={total}
                showTotal={() => `共 ${total} 条数据`}
                showSizeChanger
                showQuickJumper={total > pageSize}
              />
            </div>
          ) : null}
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ seriesManage, addProjectInfo, projectInfoManger, loading }) => ({
        seriesManage,
        addProjectInfo,
        projectInfoManger,
        loading: loading.effects['projectInfoManger/getProductList'],
        subLoading: loading.effects['seriesManage/getProductBySeries'],
      }))(SeriesManage),
    ),
  ),
);
export default WrappedSingleForm;

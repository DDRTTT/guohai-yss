/**
 *  项目信息管理
 */
import React, { Component, useState } from 'react';
import {
  Table,
  Modal,
  Form,
  Select,
  Button,
  Row,
  Col,
  Input,
  Card,
  DatePicker,
  Pagination,
  Tabs,
  Icon,
  Menu,
  Dropdown,
  Tag,
  message,
  Tooltip,
  Breadcrumb,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import style from './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { TabPane } = Tabs;

let saveFlag = false;
let tabKey = '';
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@Form.create()
class ProjectInfoManger extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    expand: false, // 判断搜索是否隐藏
    keyWords: '',
    pageNum: 1,
    pageSize: 10,
    direction: '',
    field: '',
    selectedRowKeys: [],
    selectedRows: [],
    taskTypeCode: tabKey || 'T001_1',
    dataList: [],
    total: 0,
    columns: [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        sorter: true,
        fixed: 'left',
        width: 300,
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
        key: 'operStatus',
        title: '流程状态',
        dataIndex: 'operStatus',
        align: 'center',
        sorter: true,
        width: 120,
        render: (operStatus, record) => {
          return (
            <Tag>
              {operStatus === 'S001_1' ? '待提交' : operStatus === 'S001_2' ? '流程中' : '已结束'}
            </Tag>
          );
        },
      },
      {
        key: 'seriesCode',
        title: '系列编码',
        dataIndex: 'seriesCode',
        sorter: true,
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
        width: 200,
        render: (projectState, record) => {
          return <span>{record.projectStateName}</span>;
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
        key: 'proBusType',
        title: '项目分类',
        dataIndex: 'proBusType',
        sorter: true,
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
        align: 'center',
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
        width: 170,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          let { customerName } = record;
          if ('customerList' in record) {
            customerName =
              record.customerList && record.customerList.map(item => item.customerName).join(',');
          }
          return (
            <Tooltip placement="topLeft" title={customerName}>
              {customerName}
            </Tooltip>
          );
        },
      },
      {
        key: 'customerType',
        title: '客户类型',
        dataIndex: 'customerType',
        sorter: true,
        width: 140,
        align: 'center',
        render: (text, record) => {
          let customerType = record.customerType === '1' ? '机构' : '自然人';
          if ('customerList' in record) {
            customerType =
              record.customerList &&
              record.customerList
                .map(item => (item.customerType === '1' ? '机构' : '自然人'))
                .join(',');
          }
          return (
            <Tooltip placement="topLeft" title={customerType}>
              {customerType}
            </Tooltip>
          );
        },
      },
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
        width: 230,
        align: 'center',
        fixed: 'right',
        render: (text, record) => {
          let { taskTypeCode } = this.state;
          return (
            <>
              {taskTypeCode === 'T001_3' || taskTypeCode === 'T001_5' ? (
                <Action code="informationManagement:look">
                  <Button
                    style={{
                      marginLeft: '-10px',
                    }}
                    onClick={() => this.watchDetail(record)}
                    type="link"
                    size="small"
                  >
                    详情
                  </Button>
                </Action>
              ) : null}
              <Action code="informationManagement:update">
                <Button
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
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
              <Action code="informationManagement:check">
                <Button
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatus == 'S001_2'
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
              <Action code="informationManagement:history">
                <Button
                  style={{
                    display:
                      taskTypeCode == 'T001_3' ||
                      taskTypeCode == 'T001_5' ||
                      ((taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
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
              <Action code="informationManagement:delete">
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
    columns1: [],
  };

  componentDidMount() {
    this.getTableList();
    this.getDropLists();
    this.handleColumns();
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
    if (formItems.projectPeriod) {
      formItems.proCDateMin = this.formatDate(formItems.projectPeriod[0]._d, 1);
      formItems.proCDateMax = this.formatDate(formItems.projectPeriod[1]._d, 1);
      delete formItems.projectPeriod;
    }
    const payload = {
      pageNum,
      pageSize,
      keyWords,
      direction,
      field,
      ...formItems,
      isProduct: 1,
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
      setTimeout(() => {
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

  // 获取下拉数据
  getDropLists() {
    const { dispatch } = this.props;
    // 项目名称下拉框数据获取
    dispatch({
      type: 'projectInfoManger/getProcodeAndProDept',
      payload: {
        type: 1,
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
    // 项目流程类型下拉框数据获取
    dispatch({
      type: 'addProjectInfo/getProTypeList',
      payload: {
        fcode: 'awp_process_project',
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
    if (selectedRows.length === 0) {
      message.info('请选择需要批量操作的项目!');
      return;
    }
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
        direction: sorter.order ? (sorter.order == 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? (sorter.field === 'seriesName' ? 'seriesCode' : sorter.field) : '',
      },
      () => this.getTableList(),
    );
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  /**
   * @method  handleSetPage 切换页数的时候触发
   * @param page 当前页数
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

  /**
   * 查看操作
   */
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

  /**
   * 修改操作
   * @param {} record
   */
  changeProjectInfo = record => {
    router.push(
      `/projectManagement/addInformationManagement?proCode=${record.proCode}&taskId=${record.taskId}`,
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

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * 格式化日期
   * @param {时间} date
   */
  deFormatDate(date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }

  /**
   * @method 切换tab
   * @param {*} key
   */
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
   * 跳转至新建
   * **/
  handleJumpToAddInformation = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/addInformationManagement',
      }),
    );
  };

  // 新建项目
  setOperations = () => {
    return (
      <Action code="informationManagement:add">
        <Button type="primary" onClick={this.handleJumpToAddInformation}>
          新建项目
        </Button>
      </Action>
    );
  };

  render() {
    const {
      projectInfoManger: { proDeptList, proCodeList },
      loading,
      form,
      addProjectInfo: { proTypeList, processProjectList },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      pageNum,
      pageSize,
      keyWords,
      dataList,
      total,
      taskTypeCode,
      columns,
      columns1,
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
                  <Breadcrumb.Item>项目信息管理</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col
                gutter={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Search
                  placeholder="请输入项目名称/项目编码"
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
                <Form.Item label="项目名称:">
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
              </Col>
              <Col span={8}>
                <Form.Item label="项目类型:">
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
                <Form.Item label="所属部门:">
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
              <Col span={8} className={style.FormPicker}>
                <Form.Item label="项目周期">
                  {getFieldDecorator('projectPeriod')(
                    <RangePicker placeholder={['开始日期', '结束日期']} format="YYYY-MM-DD" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="项目流程类型:">
                  {getFieldDecorator('processType')(
                    <Select placeholder="请选择" mode="multiple" showArrow>
                      {processProjectList &&
                        processProjectList.map(item => (
                          <Option key={item.code} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: 'right', float: 'right', marginTop: 10 }}>
                <Action code="informationManagement:listQuery">
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
                </Action>
                <Button
                  onClick={() => form.resetFields()}
                  style={{ display: this.state.expand ? 'inline-block' : 'none', marginLeft: 8 }}
                >
                  重置
                </Button>
                <Button e={{ marginLeft: 5 }} onClick={this.toggle} type="link">
                  收起
                  <Icon type="up" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className={style.projectinfomanage}>
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
            loading={loading}
            rowSelection={{
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            pagination={false}
            onChange={this.changeTable}
            rowKey={record => record.taskId}
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
      connect(({ projectInfoManger, addProjectInfo, loading }) => ({
        projectInfoManger,
        addProjectInfo,
        loading: loading.effects['projectInfoManger/getProductList'],
      }))(ProjectInfoManger),
    ),
  ),
);
export default WrappedSingleForm;

/**
 * 项目电子底稿管理
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
  Col,
  Input,
  Row,
  Radio,
  Table,
  Form,
  Icon,
  Select,
  Card,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  message,
  Tooltip,
  Pagination,
  Tag,
} from 'antd';
import monment from 'moment';
import styles from './index.less';

const { Search } = Input;
const { confirm } = Modal;
const initParams = {
  type: 1,
  pageNum: 1,
  pageSize: 10,
  direction: 'DESC', // DESC、ASC
  field: '',
  keyWords: '',
};

@Form.create()
class Agent extends Component {
  state = {
    sortedInfo: null,
    params: {
      ...initParams,
    },
    isForm: true, // isForm 展开和收起
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    const { type } = this.props.router.location.query;
    if (typeof type !== 'undefined') {
      this.setState(
        ({ params }) => ({
          params: {
            ...params,
            type: Number(type),
          },
        }),
        () => {
          this.handleGetTableList(this.state.params); // table列表数据请求
          this.getProcodeInfoAPI(Number(type)); // 项目/系列名称下拉
        },
      );
    } else {
      this.handleGetTableList(this.state.params); // table列表数据请求
      this.getProcodeInfoAPI(1); // 项目/系列名称下拉
    }
    this.handleGetProjectBaseInfo(2); // 所属部门下拉
    this.props.dispatch({
      // 项目类型下拉
      type: 'manuscriptManagement/getDictsReq',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
  }

  /**
   * 查询table表格
   */
  handleGetTableList(payload) {
    this.props
      .dispatch({
        type: 'manuscriptManagement/getQueryTableReq',
        payload,
      })
      .then(() => {
        setTimeout(() => {
          let InputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
          if (InputElement) InputElement.value = '';
        }, 300);
      });
  }

  /**
   * 获取项目基本信息方法
   * * */
  handleGetProjectBaseInfo(type) {
    this.props.dispatch({
      type: 'manuscriptManagement/getProjectBaseInfoReq',
      payload: {
        type,
      },
    });
  }
  /**
   * 获取项目/系列名称
   * * */
  getProcodeInfoAPI(type) {
    this.props.dispatch({
      type: 'manuscriptManagement/getProcodeInfoReq',
      payload: {
        type,
      },
    });
  }

  /**
   * 查看底稿
   * * */
  handleLookManagement({ proCode, type }) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/manuscriptSystem/manuscriptManagementList',
        query: {
          proCode,
          type,
        },
      }),
    );
  }

  /**
   * 变更记录
   * * */
  handleChangeLog({ proCode }) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/manuscriptManagementOperationLog/manuscriptManagementOperationLogIndex',
        query: {
          code: proCode,
        },
      }),
    );
  }

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch(val) {
    this.state.params.keyWords = val;
    this.state.params.pageNum = 1;
    this.handleGetTableList(this.state.params);
  }

  /**
   * @method  handleSetPage 切换页数的时候触发
   */
  handleSetPage = (pageNum, pageSize) => {
    this.setState(
      ({ params }) => ({
        params: {
          ...params,
          pageNum,
          pageSize,
        },
      }),
      () => this.handleGetTableList(this.state.params),
    );
  };

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange(order, field, sorter) {
    const { params } = this.state;
    params.field = sorter.field;
    this.setState({
      sortedInfo: sorter,
    });
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
   * @method handleClearVal 重置 // 清理value值
   */
  handleClearVal() {
    this.props.form.resetFields();
    const resetParams = { ...initParams };
    resetParams.type = this.state.params.type;
    this.state.params = {
      ...resetParams,
    };
  }

  /**
   * @method clearSortedInfo 清除表格列排序状态
   */
  clearSortedInfo() {
    this.setState({
      sortedInfo: null,
    });
  }
  /**
   * @method handleSearchBtn 详细搜索
   */
  handleSearchBtn(e) {
    const ev = e || event;
    ev.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.proCDateMin = values.proCDateMin
        ? monment(values.proCDateMin).format('YYYY-MM-DD 00:00:00')
        : '';
      values.proCDateMax = values.proCDateMax
        ? monment(values.proCDateMax).format('YYYY-MM-DD 00:00:00')
        : '';

      const resetParams = { ...initParams };
      resetParams.type = this.state.params.type;
      this.state.params = {
        ...resetParams,
        ...values,
      };
      this.state.params.keyWords && delete this.state.params.keyWords;

      // 刷新列表
      this.handleGetTableList(this.state.params);
      this.clearSortedInfo();
    });
  }

  /**
   * 报送接口：
   * 项目报送、人员报送、文件报送 底稿范围外项目报送 底稿范围外文件报送
   * * */
  submitReportFn(record, type) {
    const { proCode } = record;
    const deliverReq = reqFnName => {
      this.props.dispatch({
        type: `manuscriptManagement/${reqFnName}`,
        payload: {
          proCode,
          fileCode: [],
          batchNumber: Date.now(),
        },
        callback: res => {
          message.success(res.data);
        },
      });
    };
    switch (type) {
      case 0: // 目录报送(调接口)
        return deliverReq(`submitWpDictDeliverReq`);
      case 1: // 文件报送(调接口)
        return deliverReq(`submitFileReq`);
      case 2: //  底稿范围外项目报送
        return deliverReq(`submitWpDictDeliverOosReq`);
      case 3: //  底稿范围外文件报送
        return deliverReq(`submitWpFileUploadWithoutDictReq`);
      default:
        // 人员报送(调接口)
        return deliverReq(`submitWpItemUpdateReq`);
    }
  }

  /**
   * 选择报送操作按钮confirm弹出层
   * 确定 根据type调用各自报送接口
   * * */
  handleSubmitReport(record, type) {
    // if (type !== 2) {
    // 目录报送、人员报送、文件报送
    confirm({
      title: '确认报送',
      closable: true,
      content: '确定提交该报送申请吗',
      onOk: () => {
        this.submitReportFn(record, type);
      },
    });
    // } else {
    //   // 抽查报送
    //   const { proCode } = record;
    //   this.props.dispatch(
    //     routerRedux.push({
    //       pathname: `/manuscriptSystem/manuscriptManagementSpotCheckReport`,
    //       query: {
    //         proCode,
    //       },
    //     }),
    //   );
    // }
  }

  /**
   * tab切换
   * * */
  handleRadioChange(e) {
    const type = e.target.value;
    this.setState(
      ({ params }) => ({
        params: {
          ...params,
          type,
          pageNum: 1,
          pageSize: 10,
        },
      }),
      () => {
        if (this.state.isForm) {
          // this.refs.keyWordsInput.input.handleReset(e)
          this.refs.keyWordsInput.input.state.value = '';
        }
        this.handleClearVal();
        this.getProcodeInfoAPI(type);
        this.handleGetTableList(this.state.params);
      },
    );
  }

  /**
   * select 模糊搜索
   * **/
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  SearchHtml() {
    const {
      params: { type },
    } = this.state;
    return (
      <Card bordered={false}>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目电子底稿管理</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col>
            <Search
              placeholder={`请输入${type === 1 ? '项目' : '系列'}名称/编码`}
              onSearch={value => this.handleBlurSearch(value)}
              ref="keyWordsInput"
              style={{
                width: 210,
                marginRight: 23,
                height: 32,
              }}
            />
            <Button onClick={() => this.handleOpenConditions()} type="link">
              展开搜索
              <Icon type="down" />
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }

  detailsSearchHtml() {
    const {
      form: { getFieldDecorator },
      manuscriptManagement: { proCode, awpProType, proDept },
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
    const {
      params: { type },
    } = this.state;
    return (
      <Card bordered={false}>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
                <Breadcrumb.Item>项目电子底稿管理</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6}>
              <Form.Item label={`${type === 1 ? '项目' : '系列'}名称`} {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select
                    placeholder={`请选择${type === 1 ? '项目' : '系列'}名称`}
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={this.handleFilterOption}
                  >
                    {proCode &&
                      proCode.map(item => (
                        <Select.Option key={item.code} title={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="项目类型" {...formItemLayout}>
                {getFieldDecorator('proType')(
                  <Select
                    placeholder="请选择项目类型"
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={this.handleFilterOption}
                  >
                    {awpProType &&
                      awpProType.map(item => (
                        <Select.Option key={item.code} title={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属部门" {...formItemLayout}>
                {getFieldDecorator('proDept')(
                  <Select
                    placeholder="请选择所属部门"
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={this.handleFilterOption}
                  >
                    {proDept &&
                      proDept.map(item => (
                        <Select.Option key={item.code} title={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="开始日期：" {...formItemLayout} className={styles.FormDatePicker}>
                {getFieldDecorator('proCDateMin')(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="结束日期：" {...formItemLayout} className={styles.FormDatePicker}>
                {getFieldDecorator('proCDateMax')(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col md={6} style={{ float: 'right', textAlign: 'right', paddingTop: 5 }}>
              <Button type="primary" onClick={() => this.handleSearchBtn()}>
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={() => this.handleClearVal()}>
                重置
              </Button>
              <Button onClick={() => this.handleOpenConditions()} type="link">
                收起
                <Icon type="up" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  render() {
    const {
      params: { type, pageSize, pageNum },
    } = this.state;
    const {
      loading,
      manuscriptManagement: { tableList },
    } = this.props;
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    let columns = null;
    if (type === 1) {
      columns = [
        {
          key: 'proName',
          title: '项目名称',
          dataIndex: 'proName',
          sorter: true,
          width: 300,
          fixed: 'left',
          sortOrder: sortedInfo.columnKey === 'proName' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proName}>
                <span>{record.proName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proCode',
          title: '项目编码',
          dataIndex: 'proCode',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proCode' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proCode}>
                <span>{record.proCode}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proShortName',
          title: '项目简称',
          dataIndex: 'proShortName',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proShortName' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proShortName}>
                <span>{record.proShortName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'projectState',
          title: '状态',
          dataIndex: 'projectState',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'projectState' && sortedInfo.order,
          render: (text, record) => <Tag>{record.projectStateName}</Tag>,
        },
        {
          key: 'proType',
          title: '项目类型',
          dataIndex: 'proType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proType' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
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
          sortOrder: sortedInfo.columnKey === 'proArea' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proAreaName}>
                <span>{record.proAreaName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proDept',
          title: '所属部门',
          dataIndex: 'proDept',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proDept' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proDept}>
                <span>{record.proDept}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proCDate',
          title: '开始日期',
          dataIndex: 'proCDate',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proCDate' && sortedInfo.order,
        },
        {
          key: 'proBusType',
          title: '项目分类',
          dataIndex: 'proBusType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proBusType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '管理人项目' : '非管理人项目'}</span>,
        },
        {
          key: 'biddingFlag',
          title: '是否招投标',
          align: 'center',
          dataIndex: 'biddingFlag',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'biddingFlag' && sortedInfo.order,
          render: text => <span>{text === 1 ? '是' : '否'}</span>,
        },
        {
          key: 'customerName',
          title: '客户名称',
          dataIndex: 'customerName',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.customerName}>
                <span>{record.customerName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'customerType',
          title: '客户类型',
          dataIndex: 'customerType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'customerType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '机构' : '自然人'}</span>,
        },
        {
          key: 'createTime',
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
          width: 180,
        },
        {
          key: 'creatorId',
          title: '创建人',
          dataIndex: 'creatorId',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'creatorId' && sortedInfo.order,
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
          width: 320,
          render: (text, record) => {
            const optItem = record => (
              <Menu>
                <Menu.Item key="0">
                  <Action code="manuscriptManagement:projectReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 0)}
                      size="small"
                    >
                      项目报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="1">
                  <Action code="manuscriptManagement:fileReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 1)}
                      size="small"
                    >
                      文件报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="2">
                  <Action code="manuscriptManagement:outProjectReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 2)}
                      size="small"
                    >
                      底稿范围外项目报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="3">
                  <Action code="manuscriptManagement:outFileReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 3)}
                      size="small"
                    >
                      底稿范围外文件报送
                    </Button>
                  </Action>
                </Menu.Item>
                {/* <Menu.Item key="4" onClick={() => this.handleSubmitReport(record, 4)}>
                  人员报送
                </Menu.Item> */}
              </Menu>
            );
            return (
              <>
                <Action code="manuscriptManagement:viewPage">
                  <Button type="link" onClick={() => this.handleLookManagement(record)}>
                    查看底稿
                  </Button>
                </Action>
                <Action code="manuscriptManagement:changeLog">
                  <Button type="link" onClick={() => this.handleChangeLog(record)}>
                    变更记录
                  </Button>
                </Action>
                <Action code="manuscriptManagement:selectSubmit">
                  <Dropdown overlay={optItem(record)} trigger={['click']}>
                    <Button type="link">
                      选择报送 <Icon type="caret-right" />
                    </Button>
                  </Dropdown>
                </Action>
              </>
            );
          },
        },
      ];
    } else {
      columns = [
        {
          key: 'proName',
          title: '系列名称',
          dataIndex: 'proName',
          sorter: true,
          width: 300,
          fixed: 'left',
          sortOrder: sortedInfo.columnKey === 'proName' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proName}>
                <span>{record.proName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proCode',
          title: '系列编码',
          dataIndex: 'proCode',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proCode' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proCode}>
                <span>{record.proCode}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proType',
          title: '项目类型',
          dataIndex: 'proType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proType' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proTypeName}>
                <span>{record.proTypeName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'projectState',
          title: '状态',
          dataIndex: 'projectState',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'projectState' && sortedInfo.order,
          render: (text, record) => <Tag>{record.projectStateName}</Tag>,
        },
        {
          key: 'proArea',
          title: '项目区域',
          dataIndex: 'proArea',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proArea' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proAreaName}>
                <span>{record.proAreaName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'proDept',
          title: '所属部门',
          dataIndex: 'proDept',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'proDept' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.proDept}>
                <span>{record.proDept}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'customerName',
          title: '客户名称',
          dataIndex: 'customerName',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip placement="topLeft" title={record.customerName}>
                <span>{record.customerName}</span>
              </Tooltip>
            );
          },
        },
        {
          key: 'customerType',
          title: '客户类型',
          dataIndex: 'customerType',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'customerType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '机构' : '自然人'}</span>,
        },
        {
          key: 'createTime',
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
          width: 180,
        },
        {
          key: 'creatorId',
          title: '创建人',
          dataIndex: 'creatorId',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'creatorId' && sortedInfo.order,
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
          width: 320,
          render: (text, record) => {
            const optItem = record => (
              <Menu>
                <Menu.Item key="0">
                  <Action code="manuscriptManagement:projectReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 0)}
                      size="small"
                    >
                      项目报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="1">
                  <Action code="manuscriptManagement:fileReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 1)}
                      size="small"
                    >
                      文件报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="2">
                  <Action code="manuscriptManagement:outProjectReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 2)}
                      size="small"
                    >
                      底稿范围外项目报送
                    </Button>
                  </Action>
                </Menu.Item>
                <Menu.Item key="3">
                  <Action code="manuscriptManagement:outFileReport">
                    <Button
                      style={{ paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' }}
                      type="link"
                      onClick={() => this.handleSubmitReport(record, 3)}
                      size="small"
                    >
                      底稿范围外文件报送
                    </Button>
                  </Action>
                </Menu.Item>
              </Menu>
            );
            return (
              <>
                <Action code="manuscriptManagement:viewPage">
                  <Button type="link" onClick={() => this.handleLookManagement(record)}>
                    查看底稿
                  </Button>
                </Action>
                <Action code="manuscriptManagement:changeLog">
                  <Button type="link" onClick={() => this.handleChangeLog(record)}>
                    变更记录
                  </Button>
                </Action>
                <Action code="manuscriptManagement:selectSubmit">
                  <Dropdown overlay={optItem(record)} trigger={['click']}>
                    <Button type="link">
                      选择报送 <Icon type="caret-right" />
                    </Button>
                  </Dropdown>
                </Action>
              </>
            );
          },
        },
      ];
    }

    return (
      <>
        {this.state.isForm ? this.SearchHtml() : this.detailsSearchHtml()}
        <Card style={{ marginTop: '16px' }} bordered={false}>
          <Radio.Group
            defaultValue={type}
            value={type}
            onChange={e => this.handleRadioChange(e)}
            buttonStyle="solid"
            style={{ marginBottom: '16px' }}
          >
            <Action code="manuscriptManagement:projectDirectory">
              <Radio.Button value={1}>项目目录</Radio.Button>
            </Action>
            <Action code="manuscriptManagement:seriesDirectory">
              <Radio.Button value={0}>系列目录</Radio.Button>
            </Action>
          </Radio.Group>
          <Table
            rowKey={record => record.proCode}
            columns={columns}
            dataSource={tableList.rows}
            scroll={{ x: columns.length * 180 + 440 }}
            onChange={(order, field, sorter) => this.sortChange(order, field, sorter)}
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
                current={pageNum}
                pageSize={pageSize}
                onChange={this.handleSetPage}
                onShowSizeChange={this.handleSetPage}
                total={tableList.total}
                showTotal={() => `共 ${tableList.total} 条数据`}
                showSizeChanger
                showQuickJumper={tableList.total > pageSize}
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
      connect(({ manuscriptManagement, loading, router }) => ({
        manuscriptManagement,
        router,
        loading: loading.effects['manuscriptManagement/getQueryTableReq'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

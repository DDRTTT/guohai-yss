/**
 * 项目管理--操作日志 底稿日志查询页面
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
  Table,
  Form,
  Icon,
  Select,
  Card,
  DatePicker,
  Radio,
  Tooltip,
  Pagination,
  Tag,
} from 'antd';
import monment from 'moment';
import router from 'umi/router';
import styles from './index.less';

const { Search } = Input;
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
    KeyWordsInputRef: null,
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
    if (type !== 2 && typeof type !== 'undefined') {
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
    this.handleGetProjectBaseInfo(); // 所属部门下拉
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
   * 获取项目基本信息方法
   * * */
  handleGetProjectBaseInfo() {
    this.props.dispatch({
      type: 'manuscriptManagement/getProjectBaseInfoReq',
      payload: {
        type: this.state.params.type === 1 ? 2 : 4,
      },
    });
  }

  /**
   * 查看详情
   * * */
  handleLookDetail(record, productFlag) {
    router.push({
      pathname: '/manuscriptManagementOperationLog/manuscriptManagementOperationLogDetail',
      query: {
        proCode: record.proCode,
        productFlag,
        type: record.type,
      },
    });
  }

  /**
   * 变更记录
   * * */
  handleChangeLog(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/manuscriptManagementOperationLog/manuscriptManagementOperationLogIndex',
        query: {
          code: record.proCode,
        },
      }),
    );
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
          if (this.KeyWordsInputRef) this.KeyWordsInputRef.input.state.value = '';
        }
        this.handleClearVal();
        this.getProcodeInfoAPI(type); // 项目/系列名称下拉
        this.handleGetProjectBaseInfo(); // 所属部门下拉
        this.handleGetTableList(this.state.params);
      },
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

      //刷新列表数据
      this.handleGetTableList(this.state.params);
      this.clearSortedInfo();
    });
  }

  /**
   * select 模糊搜索
   * **/
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  setKeyWordsInputRef = element => {
    this.KeyWordsInputRef = element;
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
              <Breadcrumb.Item>底稿日志管理</Breadcrumb.Item>
              <Breadcrumb.Item>底稿日志查询</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col>
            <Search
              placeholder={`请输入${type === 1 ? '项目' : '系列'}名称/编码`}
              onSearch={value => this.handleBlurSearch(value)}
              ref={this.setKeyWordsInputRef}
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
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item>底稿日志管理</Breadcrumb.Item>
                <Breadcrumb.Item>底稿日志查询</Breadcrumb.Item>
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
            <Col span={6} className={styles.FormDatePicker}>
              <Form.Item label="开始日期：" {...formItemLayout}>
                {getFieldDecorator('proCDateMin')(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col span={6} className={styles.FormDatePicker}>
              <Form.Item label="结束日期：" {...formItemLayout}>
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
          align: 'center',
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
          align: 'center',
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
          align: 'center',
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'projectState' && sortedInfo.order,
          render: (text, record) => <Tag>{record.projectStateName}</Tag>,
        },
        {
          key: 'proType',
          title: '项目类型',
          width: 188,
          dataIndex: 'proType',
          sorter: true,
          align: 'center',
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'proArea' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip
                placement="topLeft"
                title={record.proAreaName === '境外' ? record.overseasProArea : record.proAreaName}
              >
                <span>
                  {record.proAreaName === '境外' ? record.overseasProArea : record.proAreaName}
                </span>
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'proCDate' && sortedInfo.order,
        },
        {
          key: 'proBusType',
          title: '项目分类',
          dataIndex: 'proBusType',
          sorter: true,
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'proBusType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '管理人项目' : '非管理人项目'}</span>,
        },
        {
          key: 'biddingFlag',
          title: '是否招投标',
          dataIndex: 'biddingFlag',
          sorter: true,
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'biddingFlag' && sortedInfo.order,
          render: text => <span>{text === 1 ? '是' : '否'}</span>,
        },
        {
          key: 'customerName',
          title: '客户名称',
          dataIndex: 'customerName',
          sorter: true,
          align: 'center',
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'customerType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '机构' : '自然人'}</span>,
        },
        {
          key: 'createTime',
          title: '创建时间',
          width: 180,
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        },
        {
          key: 'creatorId',
          title: '创建人',
          dataIndex: 'creatorId',
          sorter: true,
          align: 'center',
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
          align: 'center',
          width: 80,
          fixed: 'right',
          render: (text, record) => (
            <Action code="manuscriptManagementOperationLogIndex:viewPage">
              <Button type="link" onClick={() => this.handleLookDetail(record, 1)}>
                查看
              </Button>
            </Action>
          ),
        },
      ];
    } else {
      // 系列日志只保留系列编码、系列名称、项目类型、区域、所属部门、客户名称、客户类型、创建时间、创建人、状态
      columns = [
        {
          key: 'proName',
          title: '系列名称',
          dataIndex: 'proName',
          sorter: true,
          align: 'center',
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
          align: 'center',
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
          width: 188,
          dataIndex: 'proType',
          sorter: true,
          align: 'center',
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'projectState' && sortedInfo.order,
          render: (text, record) => <Tag>{record.projectStateName}</Tag>,
        },
        {
          key: 'proArea',
          title: '项目区域',
          dataIndex: 'proArea',
          sorter: true,
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'proArea' && sortedInfo.order,
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => {
            return (
              <Tooltip
                placement="topLeft"
                title={record.proAreaName === '境外' ? record.overseasProArea : record.proAreaName}
              >
                <span>
                  {record.proAreaName === '境外' ? record.overseasProArea : record.proAreaName}
                </span>
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
          align: 'center',
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
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'customerType' && sortedInfo.order,
          render: text => <span>{text === '1' ? '机构' : '自然人'}</span>,
        },
        {
          key: 'createTime',
          title: '创建时间',
          width: 180,
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        },
        {
          key: 'creatorId',
          title: '创建人',
          dataIndex: 'creatorId',
          sorter: true,
          align: 'center',
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
          width: 80,
          fixed: 'right',
          align: 'center',
          render: (text, record) => (
            <Action code="manuscriptManagementOperationLogIndex:viewPage">
              <Button type="link" onClick={() => this.handleLookDetail(record, 1)}>
                查看
              </Button>
            </Action>
          ),
        },
      ];
    }
    const {
      loading,
      manuscriptManagement: { tableList },
    } = this.props;
    return (
      <div className={styles.manuscriptManagement}>
        {this.state.isForm ? this.SearchHtml() : this.detailsSearchHtml()}
        <Card style={{ marginTop: '12px' }} bordered={false} className={styles.content}>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8}>
              <Radio.Group
                defaultValue={type}
                value={type}
                onChange={e => this.handleRadioChange(e)}
                buttonStyle="solid"
              >
                <Action code="manuscriptManagementOperationLogIndex:relatedLogs">
                  <Radio.Button value={1}>项目日志</Radio.Button>
                </Action>
                <Action code="manuscriptManagementOperationLogIndex:relatedLogs">
                  <Radio.Button value={0}>系列日志</Radio.Button>
                </Action>
              </Radio.Group>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'right' }}>
              <Action code="manuscriptManagementOperationLogIndex:viewPage">
                <Button
                  type="primary"
                  onClick={() => this.handleLookDetail({ proCode: null, type: 2 }, 2)}
                >
                  非项目相关日志
                </Button>
              </Action>
            </Col>
          </Row>
          <Table
            rowKey={record => record.proCode}
            columns={columns}
            dataSource={tableList.rows}
            scroll={{ x: columns.length * 150 + 350 }}
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
                ref="pagination"
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
      </div>
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

/**
 *  项目终止
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
  Tooltip,
  Menu,
  Dropdown,
  message,
  Radio,
  Divider,
  Popover,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;

@Form.create()
class ProjectTermination extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    expand: false, // 判断搜索是否隐藏
    keyWords: '',
    pageNum: 1,
    pageSize: 10,
    loading: false,
    direction: '',
    field: '',
  };

  getTableList() {
    const { pageNum, pageSize, keyWords, direction, field } = this.state;
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
      type: 1,
    };
    dispatch({
      type: 'projectTermination/getTableData',
      payload,
    }).then(() => {
      setTimeout(() => {
        let InputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
        if (InputElement) InputElement.value = '';
      }, 300);
    });
  }

  formatDate(date, type) {
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    if (type === 1) {
      return `${Y}-${M}-${D} 00:00:00`;
    }
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
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

  componentDidMount() {
    this.getTableList();
    this.getDropLists();
  }

  getDropLists() {
    const { dispatch } = this.props;
    // 项目名称下拉框数据获取
    this.props.dispatch({
      type: 'projectTermination/getSeriesName',
      payload: {
        type: 1,
        checked: 1,
        projectState: ['state5'],
      },
    });
    // 所属部门下拉框数据获取
    dispatch({
      type: 'projectTermination/getProcodeAndProDept',
      payload: {
        type: 2,
      },
    });
    // 项目类型下拉框数据获取
    dispatch({
      type: 'projectTermination/getProTypeList',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
  }

  /**
   * 条件查询
   * @method searchBtn
   */
  searchBtn = () => {
    this.getTableList();
  };

  /**
   * @method 重置
   */
  handleReset = () => {
    this.props.form.resetFields();
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
        direction: sorter.order ? (sorter.order == 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? sorter.field : '',
      },
      () => {
        this.getTableList();
      },
    );
  };
  watchDetail = record => {
    router.push(`/projectManagement/projectTerminationDetail?proCode=${record.proCode}`);
  };
  /**
   * @method  handleSetPage 切换页数的时候触发
   * @param page 当前页数
   */
  handleSetPage = (pageNum, pageSize) => {
    this.setState(
      {
        pageNum,
        pageSize,
      },
      () => {
        this.getTableList();
      },
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
    if (date) {
      return date.slice(0, 10);
    }
    return '';
  }
  render() {
    const {
      loading,
      projectTermination: { dataList, total, proDeptList, proCodeList, proTypeList },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { pageNum, pageSize, keyWords } = this.state;

    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const columns = [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        fixed: 'left',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
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

        width: 140,
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
        width: 140,
        align: 'center',
        render: biddingFlag => {
          return <span>{biddingFlag === 1 ? '是' : '否'}</span>;
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
        width: 200,
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
      {
        key: 'terminationReason',
        title: '终止原因',
        dataIndex: 'terminationReason',
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
        width: 160,
        render: terminationDate => {
          return <span>{this.deFormatDate(terminationDate)}</span>;
        },
      },
      {
        key: 'terminationId',
        title: '操作人',
        dataIndex: 'terminationId',
        align: 'center',
        sorter: true,
        width: 170,
        render: (terminationId, record) => {
          return <span>{record.terminationName}</span>;
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <Action code="terminationManagement:look">
            <Button onClick={() => this.watchDetail(record)} type="link" size="small">
              查看
            </Button>
          </Action>
        ),
      },
    ];

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
                <span style={{ color: 'rgba(149, 163, 187, 1)' }}>底稿项目管理</span> /{' '}
                <span style={{ color: 'rgba(71,75,91,1)' }}>项目终止管理</span>
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
                  onChange={e => this.setState({ keyWords: e.target.value })}
                  value={keyWords}
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    width: 220,
                  }}
                />
                <a
                  style={{
                    display: this.state.expand ? 'none' : 'block',
                    marginLeft: 23,
                  }}
                  onClick={this.toggle}
                >
                  {'展开搜索'}
                  <Icon type="down" />
                </a>
              </Col>
            </Row>
            <Row
              gutter={24}
              style={{ display: this.state.expand ? 'block' : 'none', marginTop: 20 }}
            >
              <Col span={8}>
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
              <Col span={8} className={styles.FormPicker}>
                <Form.Item name="projectPeriod" label="项目周期">
                  {getFieldDecorator('projectPeriod')(
                    <RangePicker placeholder={['开始日期', '结束日期']} format="YYYY-MM-DD" />,
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
                  onClick={this.handleReset}
                  style={{ display: this.state.expand ? 'inline-block' : 'none', marginLeft: 8 }}
                >
                  重置
                </Button>
                <a onClick={this.toggle} style={{ marginLeft: 23 }}>
                  收起
                  <Icon type="up" />
                </a>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className={styles.projectterm}>
          <Table
            dataSource={dataList}
            columns={columns}
            scroll={{ x: 1300 }}
            loading={loading}
            pagination={false}
            onChange={this.changeTable}
          />
          <Pagination
            style={{
              display: total != 0 ? 'inline-block' : 'none',
              float: 'right',
              textAlign: 'right',
              marginTop: 20,
            }}
            current={pageNum}
            defaultPageSize={pageSize}
            onChange={this.handleSetPage}
            onShowSizeChange={this.handleSetPage}
            total={total}
            showTotal={() => `共 ${total} 条数据`}
            showSizeChanger
            showQuickJumper={total > pageSize}
          />
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ projectTermination, loading }) => ({
        projectTermination,
        loading: loading.effects['projectTermination/getTableData'],
      }))(ProjectTermination),
    ),
  ),
);
export default WrappedSingleForm;

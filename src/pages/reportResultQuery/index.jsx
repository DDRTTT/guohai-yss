/**
 * 底稿管理：操作日志详情页面
 * author：jiaqiuhua
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
  Tabs,
  Checkbox,
  Form,
  Icon,
  Divider,
  Popover,
  Select,
  Card,
  DatePicker,
} from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DownOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;
const { RangePicker } = DatePicker;

@Form.create()
class Agent extends Component {
  state = {
    // table 表头
    columns: [
      {
        key: 'id',
        title: '序号',
        fixed: 'left',
        dataIndex: 'id',
        width: 90,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '操作人',
        fixed: 'left',
        dataIndex: 'proCode',
        width: 150,
        sorter: true,
      },
      {
        title: '操作类型',
        dataIndex: 'proTypeName',
        fixed: 'left',
        width: 150,
        sorter: true,
      },
      {
        title: '变更主体',
        dataIndex: 'proTrusBank',
        width: 150,
        sorter: true,
      },
      {
        title: '日志内容',
        dataIndex: 'investmentManager',
        width: 150,
        sorter: true,
      },
      {
        title: '操作时间',
        dataIndex: 'taskArriveTime',
        width: 150,
        sorter: true,
      },
    ],
    // table 内容
    tableVal: [],
    // table 选项
    params: {
      pageNum: 1,
      pageSize: 10,
      taskType: 'T001_1',
      sortType: '',
      sortField: '',
    },
    // 下方全选checkbox状态
    ischecked: false,
    // checkbox选中
    selectedRows: [],
    // checkbox  key
    selectedRowKeys: [],
    // isForm 展开和收起
    isForm: true,
    // 批量操作
    popContent: (
      <ul style={{ margin: 0, padding: 0 }}>
        <li>
          <a> 提交 </a>
        </li>
        <li>
          <a> 认领 </a>
        </li>
        <li>
          <a> 委托 </a>
        </li>
        <li>
          <a> 退回 </a>
        </li>
        <li>
          <a> 移交 </a>
        </li>
        <li>
          <a> 传阅 </a>
        </li>
      </ul>
    ),
  };

  /**
   * @method handleBlurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch(val) {
    console.log('handleBlurSearch val::', val);
    // this.state.params.keyWords = val;
    // this.handleGetTableList(this.state.params);
  }

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    // 列表数据请求
    this.handleDetailData(this.state.id);
    // 项目类型下拉
    this.props.dispatch({
      type: 'manuscriptManagementOperationLog/getDicts',
      payload: {
        fcode: 'awp_pro_type',
      },
    });
  }

  /**
   * @method  handleGetTableList 请求table的数据
   */
  async handleDetailData(id) {
    await this.props.dispatch({
      type: 'manuscriptManagementOperationLog/getDetailReq',
      payload: {
        id,
      },
    });
  }

  /**
   * @method  handleSetPageNum 切换页数的时候触发
   * @param page 当前页数
   */
  handleSetPageNum(page) {
    this.state.params.pageNum = page;
    this.handleGetTableList(this.state.params);
  }

  /**
   * @method  handleSetPageNum 切换条数的时候触发
   */
  handleSetPageSize(...r) {
    this.state.params.pageSize = r[1];
    this.handleGetTableList(this.state.params);
  }

  /**
   * @method  sortChange 切换条数的时候触发
   */
  sortChange = (order, field, sorter) => {
    const { params } = this.state;
    params.sortType = sorter.order;
    params.sortField = sorter.field;
    if (params.sortType === 'ascend') {
      params.sortType = 'ASC';
    } else if (params.sortType === 'descend') {
      params.sortType = 'DESC';
    } else {
      params.sortField = '';
      params.sortType = '';
    }
    this.handleGetTableList(params);
  };

  /**
   * @method handleRowSelectChange checkbox触发
   * @param {*selectedRowKeys} 序号ID
   * @param {*selectedRows} 选中的行
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { tableVal } = this.state;
    let ischecked = false;
    tableVal.length === selectedRowKeys.length ? (ischecked = true) : (ischecked = false);

    this.setState({
      selectedRowKeys,
      selectedRows,
      ischecked,
    });
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
   * @method handleClearVal 重置 // 清理value值
   */
  handleClearVal() {
    this.props.form.resetFields();
  }

  /**
   * @method handleSearchBtn 详细搜索
   */
  handleSearchBtn(e) {
    // eslint-disable-next-line no-restricted-globals
    const ev = e || event;
    ev.preventDefault();

    this.state.params.fuzzy && delete this.state.params.fuzzy;
    this.props.form.validateFields((err, values) => {
      let proType;
      values.proType ? (proType = values.proType.join(',')) : (proType = '');
      let status;
      values.status ? (status = values.status.join(',')) : (status = '');
      this.state.params = {
        ...this.state.params,
        ...values,
        proType,
        status,
      };
      this.state.params.keyWords && delete this.state.params.keyWords;
      this.handleGetTableList(this.state.params);
    });
  }

  // 产品名称代码格式化大写
  productFilterOption = (input, option) => {
    const label = option.props.children;
    const { value } = option.props;
    return (
      label.toLowerCase().includes(input.toLowerCase()) ||
      value.toLowerCase().includes(input.toLowerCase())
    );
  };

  detailsSearchHtml() {
    const {
      form: { getFieldDecorator },
      operationLog: { awpProType },
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
    return (
      <Form>
        <Card title="项目信息" bordered={false}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <Form.Item label="*项目编码" {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select placeholder="请选择项目编码" mode="multiple" showArrow={false} allowClear>
                    <Select.Option key={0}>否</Select.Option>
                    <Select.Option key={1}>是</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="*项目名称" {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select placeholder="请选择项目名称" mode="multiple" showArrow={false} allowClear>
                    <Select.Option key={0}>否</Select.Option>
                    <Select.Option key={1}>是</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="*项目类型" {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select placeholder="请选择项目类型" mode="multiple" showArrow={false} allowClear>
                    <Select.Option key={0}>否</Select.Option>
                    <Select.Option key={1}>是</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="操作日志" bordered={false}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <Form.Item label="变更主体" {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select
                    placeholder="请选择项变更主体"
                    mode="multiple"
                    showArrow={false}
                    allowClear
                  >
                    <Select.Option key={0}>否</Select.Option>
                    <Select.Option key={1}>是</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="操作类型" {...formItemLayout}>
                {getFieldDecorator('proCode')(
                  <Select
                    placeholder="请选择项操作类型"
                    mode="multiple"
                    showArrow={false}
                    allowClear
                  >
                    <Select.Option key={0}>否</Select.Option>
                    <Select.Option key={1}>是</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="日期范围：" style={{ display: 'flex' }}>
                {getFieldDecorator('date')(<DatePicker />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} style={{ float: 'right' }}>
              <span style={{ float: 'right' }}>
                <Button type="primary" onClick={() => this.handleSearchBtn()}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={() => this.handleClearVal()}>
                  重 置
                </Button>
              </span>
            </Col>
          </Row>
          <Row type="flex" justify="end" style={{ margin: '24px 0' }}>
            <Col span={4}>
              <Search
                placeholder="请输入"
                onSearch={value => this.handleBlurSearch(value)}
                allowClear
                style={{
                  width: 260,
                  marginRight: 20,
                  height: 32,
                }}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }

  render() {
    const { selectedRowKeys, tableVal, columns, ischecked, popContent } = this.state;
    const {
      operationLog: { loading, tableList },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.operationLog}>
        <Card style={{ margin: -30, marginBottom: 10 }}>
          {/* {this.detailsSearchHtml()} */}
          报送结果查询--待开发
        </Card>
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ operationLog, loading }) => ({
        operationLog,
        // loading: loading.effects['manuscriptManagementOperationLog/handleQueryTableData'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

/**
 * 项目管理--操作日志详情
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
  Tooltip,
  Pagination,
} from 'antd';
import monment from 'moment';
import styles from './index.less';

const { Search } = Input;

@Form.create()
class Agent extends Component {
  state = {
    columns: [],
    sortedInfo: null,
    params: {
      pageNum: 1,
      pageSize: 10,
      direction: 'DESC', // DESC、ASC
      field: '',
    },
    isForm: true, // isForm 展开和收起
  };

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    document.querySelector('#body-content').scrollIntoView();
    const { proCode, productFlag, type } = this.props.router.location.query;
    this.state.params.proCode = proCode ? [proCode] : [];
    this.state.params.productFlag = productFlag;
    this.state.type = type;
    const { dispatch } = this.props;
    // 获取详情基础信息
    if (proCode) {
      dispatch({
        type: 'manuscriptChangeLogDetail/getProjectBaseInfoDetailReq',
        payload: {
          proCode,
        },
      });
    }
    // 操作对象下拉
    dispatch({
      type: 'manuscriptChangeLogDetail/getOptObjReq',
    });
    // 操作人下拉
    dispatch({
      type: 'manuscriptChangeLogDetail/getPersonReq',
    });
    // table列表数据请求
    this.handleGetTableList(this.state.params);
  }

  /**
   * 取消：返回上一页面
   * * */
  handleBackPage() {
    const type = this.state.type;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/manuscriptManagementOperationLog/manuscriptManagementOperationLogIndex',
        query: { type },
      }),
    );
  }

  /**
   * 查询table表格
   */
  handleGetTableList(payload) {
    this.props
      .dispatch({
        type: 'manuscriptChangeLogDetail/getQueryTableReq',
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
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch(val) {
    this.state.params.keyWords = val;
    this.state.params.operSdate = '';
    this.state.params.operEdate = '';
    this.state.params.operObject = [];
    this.state.params.userId = [];
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
   * @method handleClearVal 重置 // 清理value值
   */
  handleClearVal() {
    this.props.form.resetFields();
    this.state.params = {
      ...this.state.params,
      direction: 'DESC', // DESC、ASC
      field: '',
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
      values.operSdate = values.operSdate ? monment(values.operSdate).format('YYYY-MM-DD') : '';
      values.operEdate = values.operEdate ? monment(values.operEdate).format('YYYY-MM-DD') : '';

      this.state.params = {
        ...this.state.params,
        pageNum: 1,
        pageSize: 10,
        direction: 'DESC', // DESC、ASC
        field: '',
        ...values,
      };
      this.state.params.keyWords && delete this.state.params.keyWords;
      // 刷新列表数据
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
  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions() {
    this.setState(state => ({
      isForm: !state.isForm,
    }));
  }

  SearchHtml() {
    const {
      manuscriptChangeLogDetail: { baseInfo },
    } = this.props;
    return (
      <Row type="flex" align="middle">
        <Col md={24} sm={24} style={{ textAlign: 'right' }}>
          <Search
            placeholder="请输入操作人/操作对象"
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
  }

  detailsSearchHtml() {
    const {
      form: { getFieldDecorator },
      manuscriptChangeLogDetail: { operObject, personList, baseInfo },
    } = this.props;
    if (baseInfo.type === 0) {
      const index = operObject.findIndex(item => item.obj_name === '项目');
      if (index >= 0) {
        operObject[index].obj_name = '系列';
      }
    }
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
        <div
          style={{
            padding: '25px 0',
          }}
        >
          {this.state.isForm ? (
            this.SearchHtml()
          ) : (
            <>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={8}>
                  <Form.Item label="操作对象" {...formItemLayout}>
                    {getFieldDecorator('operObject')(
                      <Select
                        placeholder="请选择操作对象"
                        mode="multiple"
                        showArrow
                        allowClear
                        filterOption={this.handleFilterOption}
                      >
                        {operObject &&
                          operObject.map(item => (
                            <Select.Option key={item.obj_code} title={item.obj_name}>
                              {item.obj_name}
                            </Select.Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="操作人" {...formItemLayout}>
                    {getFieldDecorator('userId')(
                      <Select
                        placeholder="请选择操作人"
                        mode="multiple"
                        showArrow
                        allowClear
                        filterOption={this.handleFilterOption}
                      >
                        {personList &&
                          personList.map(item => (
                            <Select.Option key={item.id} title={item.username}>
                              {item.username}
                            </Select.Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} className={styles.FormDatePicker}>
                  <Form.Item label="开始日期：" {...formItemLayout}>
                    {getFieldDecorator('operSdate')(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.FormDatePicker}>
                  <Form.Item label="结束日期：" {...formItemLayout}>
                    {getFieldDecorator('operEdate')(<DatePicker />)}
                  </Form.Item>
                </Col>
                <Col md={8} offset={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={() => this.handleSearchBtn()}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 20 }} onClick={() => this.handleClearVal()}>
                    重置
                  </Button>
                  <Button
                    style={{ marginLeft: 23 }}
                    onClick={() => this.handleOpenConditions()}
                    type="link">收起<Icon type="up" />
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Form>
    );
  }

  render() {
    let {
      sortedInfo,
      params: { pageSize, pageNum },
    } = this.state;
    const {
      loading,
      manuscriptChangeLogDetail: { tableList, baseInfo },
    } = this.props;
    sortedInfo = sortedInfo || {};
    const { productFlag } = this.props.router.location.query;
    let columns = [
      {
        key: 'userName',
        title: '操作人',
        dataIndex: 'userName',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.userName}>
              <span>{record.userName}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'operType',
        title: '操作类型',
        dataIndex: 'operType',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'operType' && sortedInfo.order,
      },
      {
        key: 'operObject',
        title: '变更主体',
        dataIndex: 'operObject',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'operObject' && sortedInfo.order,
      },
      {
        key: 'operContent',
        title: '日志内容',
        dataIndex: 'operContent',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'operContent' && sortedInfo.order,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={record.operContent}>
              <span>{record.operContent}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'operTime',
        title: '操作时间',
        dataIndex: 'operTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'operTime' && sortedInfo.order,
      },
    ];
    if (Number(productFlag) === 1) {
      columns.unshift({
        key: 'proName',
        title: `${baseInfo.type === 1 ? '项目' : '系列'}名称`,
        dataIndex: 'proName',
        sorter: true,
        width: 300,
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
      });
    }
    let ProInfoHtml = '';
    let BreadcrumbItemHtml = <Breadcrumb.Item>非项目相关日志详情</Breadcrumb.Item>;
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
    if (Number(productFlag) !== 2) {
      ProInfoHtml = (
        <div style={{ borderBottom: '1px solid #e8e8e8' }}>
          <span
            style={{
              display: 'block',
              paddingBottom: 20,
              color: '#333',
              fontSize: '16px',
            }}
          >
            {`${baseInfo.type === 1 ? '项目' : '系列'}信息`}
          </span>
          <Row>
            <Col span={8}>
              <Form.Item label={`${baseInfo.type === 1 ? '项目' : '系列'}编号`} {...formItemLayout}>
                <Input value={baseInfo.proCode || ''} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`${baseInfo.type === 1 ? '项目' : '系列'}名称`} {...formItemLayout}>
                <Input value={baseInfo.proName || ''} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="项目类型" {...formItemLayout}>
                <Input value={baseInfo.proTypeName || ''} disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
      BreadcrumbItemHtml = (
        <Breadcrumb.Item>{`${baseInfo.type === 1 ? '项目' : '系列'}日志详情`}</Breadcrumb.Item>
      );
    }

    return (
      <div id="body-content" className={styles.manuscriptChangeLogDetail}>
        <Card bordered={false} style={{ borderBottom: '1px solid #e8e8e8' }}>
          <Row type="flex" align="middle">
            <Col span={12}>
              <Breadcrumb>
                <Breadcrumb.Item>底稿日志查询</Breadcrumb.Item>
                {BreadcrumbItemHtml}
              </Breadcrumb>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button onClick={() => this.handleBackPage()}>取消</Button>
            </Col>
          </Row>
        </Card>

        <div
          style={{
            height: 'calc(100vh - 196px)',
            overflowY: 'auto',
          }}
        >
          <Card bordered={false}>
            {ProInfoHtml}
            {this.detailsSearchHtml()}
            <Table
              loading={loading}
              columns={columns}
              dataSource={tableList.rows}
              scroll={{ x: columns.length * 400 }}
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
                  defaultCurrent={pageNum}
                  current={pageNum}
                  defaultPageSize={pageSize}
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
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ manuscriptChangeLogDetail, loading, router }) => ({
        manuscriptChangeLogDetail,
        router,
        loading: loading.effects['manuscriptChangeLogDetail/getQueryTableReq'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

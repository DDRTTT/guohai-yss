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
  Radio,
  Tooltip,
  Tag,
  Pagination,
  Modal,
  message,
} from 'antd';

const { Search } = Input;
const { confirm } = Modal;
const initParams = {
  type: 1,
  pageNum: 1,
  pageSize: 10,
  direction: 'ASC', // DESC、ASC
  field: '',
  keyWords: '',
};

@Form.create()
class Agent extends Component {
  state = {
    params: {
      ...initParams,
    },
    isForm: true, // isForm 展开和收起
    projectColumn: [
      {
        key: 'proName',
        title: '项目名称',
        dataIndex: 'proName',
        sorter: true,
        width: 300,
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
        width: 150,
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
        width: 150,
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
        title: '项目阶段',
        dataIndex: 'projectState',
        width: 150,
        sorter: true,
        render: (text, record) => <Tag>{record.projectStateName}</Tag>,
      },
      {
        key: 'proType',
        title: '项目类型',
        dataIndex: 'proType',
        width: 200,
        sorter: true,
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
        width: 150,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => <span>{record.proAreaName}</span>,
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        width: 150,
        sorter: true,
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
        width: 180,
        dataIndex: 'proCDate',
        sorter: true,
      },
      {
        key: 'proBusType',
        title: '项目分类',
        width: 150,
        dataIndex: 'proBusType',
        sorter: true,
        render: text => <span>{text === '1' ? '管理人项目' : '非管理人项目'}</span>,
      },
      {
        key: 'biddingFlag',
        title: '是否招投标',
        width: 150,
        dataIndex: 'biddingFlag',
        sorter: true,
        render: text => <span>{text === 1 ? '是' : '否'}</span>,
      },
      {
        key: 'customerName',
        title: '客户名称',
        dataIndex: 'customerName',
        width: 150,
        sorter: true,
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
        width: 150,
        sorter: true,
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        width: 180,
      },
      {
        key: 'creatorId',
        title: '创建人',
        dataIndex: 'creatorId',
        width: 150,
        sorter: true,
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
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
          <>
            <Action code="documentManagement:link">
              <Button type="link" size="small" onClick={() => this.handleLookDocument(record)}>
                查看
              </Button>
            </Action>
            <Action code="documentManagement:physicalArchive">
              <Button type="link" size="small" onClick={() => this.handledPhysicalArchive(record)}>
                物理归档入库
              </Button>
            </Action>
            <Action code="documentManagement:taskUploadPrinting">
              {record && record.archive === 1 ? (
                <Button
                  type="link"
                  size="small"
                  onClick={() => this.handleTaskUploadPrinting(record)}
                >
                  用印文件归档
                </Button>
              ) : null}
            </Action>
          </>
        ),
      },
    ],
    seriesColumn: [
      {
        key: 'proName',
        title: '系列名称',
        dataIndex: 'proName',
        sorter: true,
        width: 300,
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
        width: 150,
        sorter: true,
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
        width: 200,
        sorter: true,
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
        title: '项目阶段',
        dataIndex: 'projectState',
        sorter: true,
        render: (text, record) => <Tag>{record.projectStateName}</Tag>,
      },
      {
        key: 'proArea',
        title: '项目区域',
        width: 150,
        dataIndex: 'proArea',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => <span>{record.proAreaName}</span>,
      },
      {
        key: 'proDept',
        title: '所属部门',
        dataIndex: 'proDept',
        width: 150,
        sorter: true,
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
        width: 150,
        dataIndex: 'customerName',
        sorter: true,
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
        width: 150,
        sorter: true,
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        width: 180,
      },
      {
        key: 'creatorId',
        title: '创建人',
        dataIndex: 'creatorId',
        width: 150,
        sorter: true,
        render: (text, record) => <span>{record.creatorName}</span>,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
          <>
            <Action code="documentManagement:link">
              <Button type="link" size="small" onClick={() => this.handleLookDocument(record)}>
                查看
              </Button>
            </Action>
            <Action code="documentManagement:physicalArchive">
              <Button type="link" size="small" onClick={() => this.handledPhysicalArchive(record)}>
                物理归档入库
              </Button>
            </Action>
            <Action code="documentManagement:taskUploadPrinting">
              {record && record.archive === 1 ? (
                <Button
                  type="link"
                  size="small"
                  onClick={() => this.handleTaskUploadPrinting(record)}
                >
                  用印文件归档
                </Button>
              ) : null}
            </Action>
          </>
        ),
      },
    ],
  };

  getCheckedUseSealFileFn(proCode) {
    return new Promise(resolve => {
      this.props
        .dispatch({
          type: 'archiveTaskHandleList/getCheckedUseSealFileReq',
          payload: { proCode },
        })
        .then(res => {
          // type:1表示是在移动流程，0表示在文件删除流程 2表示正常 3 是全部都在删除流程
          if (res?.data?.type === 0) {
            confirm({
              maskClosable: true,
              title: '用印文件归档',
              content: `其中目前部分文档已在删除流程中，无法用印，文档包括：${res?.data?.fileNames?.join(
                '、',
              )}`,
              onOk: () => {
                resolve();
              },
            });
          } else if (res?.data?.type === 1) {
            message.error('需要用印的文件正处于文件移动审批流程，请完成审批');
          } else if (res?.data?.type === 3) {
            message.error('目前文档已发起删除流程，无法发起用印文件归档操作！');
          } else {
            resolve();
          }
        });
    });
  }

  /**
   * 跳转至用印上传页面
   * * */
  handleTaskUploadPrinting(record) {
    confirm({
      title: '用印文件归档',
      content: '是否发起用印文件归档任务?',
      centered: true,
      onOk: () => {
        const { proCode } = record;
        this.getCheckedUseSealFileFn(proCode).then(() => {
          const payload = {
            generateArchiveTask: 1,
            type: 2,
            proCode,
          };
          this.props.dispatch(
            routerRedux.push({
              pathname: '/projectManagement/archiveTaskHandleListUploadPrinting',
              query: payload,
            }),
          );
        });
      },
    });
  }

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
          this.getProcodeInfoAPI(Number(type)); // 项目/系列编码下拉
        },
      );
    } else {
      this.getProcodeInfoAPI(1); // 项目/系列编码下拉
      this.handleGetTableList(this.state.params); // table列表数据请求
    }
  }

  /**
   * 获取项目/系列编码
   * * */
  getProcodeInfoAPI(type) {
    this.props.dispatch({
      type: 'documentManagement/getProcodeInfoReq',
      payload: {
        type,
      },
    });
  }

  /**
   * 查询table表格
   */
  handleGetTableList(payload) {
    this.props
      .dispatch({
        type: 'documentManagement/getQueryTableReq',
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
   * 查看文档
   * * */
  handleLookDocument({ proCode, type, path }) {
    const { dispatch } = this.props;
    if (path === 0) {
      message.error('项目目录树未生成~');
      return;
    }
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentManagementDetail',
        query: {
          proCode,
          type,
        },
      }),
    );
  }

  /**
   *  物理归档入库
   * * */
  handledPhysicalArchive = ({ proCode, type, path }) => {
    const { dispatch } = this.props;
    if (path === 0) return message.error('项目目录树未生成~');
    dispatch(
      routerRedux.push({
        pathname: '/projectManagement/documentPhysicalArchive',
        query: {
          proCode,
          type,
          checked: 0,
        },
      }),
    );
  };

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
      () => {
        const inputElement = document.querySelector('.ant-pagination-options-quick-jumper>input');
        if (inputElement) inputElement.value = '';
        this.handleGetTableList(this.state.params);
      },
    );
  };

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
   * @method handleSearchBtn 详细搜索
   */
  handleSearchBtn(e) {
    const ev = e || event;
    ev.preventDefault();
    this.props.form.validateFields((err, values) => {
      const resetParams = { ...initParams };
      resetParams.type = this.state.params.type;
      this.state.params = {
        ...resetParams,
        ...values,
      };
      this.state.keyWords && delete this.state.params.keyWords;
      this.handleGetTableList(this.state.params);
    });
  }

  /**
   * select 模糊搜索
   * * */
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  SearchHtml() {
    const {
      params: { type },
    } = this.state;
    return (
      <Card bordered={false}>
        <Row type="flex" align="middle">
          <Col md={12} sm={12}>
            <Breadcrumb>
              <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目文档管理</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col md={12} sm={12} style={{ textAlign: 'right' }}>
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
      documentManagement: { proCode },
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
                <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
                <Breadcrumb.Item>项目文档管理</Breadcrumb.Item>
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
            <Col span={6} offset={8} style={{ textAlign: 'right', float: 'right' }}>
              <span>
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
              </span>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  render() {
    const {
      projectColumn,
      seriesColumn,
      params: { type, pageSize, pageNum },
    } = this.state;
    const {
      loading,
      documentManagement: { tableList },
    } = this.props;
    let columns = null;
    if (type === 1) {
      columns = projectColumn;
    } else {
      columns = seriesColumn;
    }
    return (
      <>
        {this.state.isForm ? this.SearchHtml() : this.detailsSearchHtml()}
        <Card style={{ marginTop: '12px' }} bordered={false}>
          <Radio.Group
            defaultValue={type}
            value={type}
            onChange={e => this.handleRadioChange(e)}
            buttonStyle="solid"
            style={{ marginBottom: '20px' }}
          >
            <Action code="documentManagement:tabProject">
              <Radio.Button value={1}>项目底稿</Radio.Button>
            </Action>
            <Action code="documentManagement:tabSeries">
              <Radio.Button value={0}>系列底稿</Radio.Button>
            </Action>
          </Radio.Group>
          <Table
            rowKey={record => record.proCode}
            columns={columns}
            dataSource={tableList.rows}
            scroll={{ x: columns.length * 200 }}
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
      connect(({ documentManagement, loading, router }) => ({
        documentManagement,
        router,
        loading: loading.effects['documentManagement/getQueryTableReq'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

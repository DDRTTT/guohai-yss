import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc, ActionBool } from '@/utils/hocUtil';
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
  message,
  Tooltip,
  Pagination,
  Tag,
} from 'antd';
import monment from 'moment';
import { download } from '@/utils/download';
import styles from './index.less';
import ProjectStateModal from './component/ProjectStateModal';

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
    params: {
      ...initParams,
    },
    isForm: true, // isForm 展开和收起
    projectStateVisible: false,
    reportTypeKey: null,
    curReportRecord: null,
    confirmLoading: null,
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
    });
  }

  /**
   * 选择报送操作按钮confirm弹出层
   * 确定 根据type调用各自报送接口
   * * */
  handleSubmitReport(record, type) {
    this.setState({
      curReportRecord: record,
      projectStateVisible: true,
      reportTypeKey: type,
    });
  }

  handleProjectStateCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({
      projectStateVisible: false,
      reportTypeKey: null,
      curReportRecord: null,
    });
    this.props.dispatch({
      type: 'manuscriptManagement/updatePreviewInfo',
      payload: {
        previewInfo: {
          param: {
            apiParam: {},
          },
          wpDict: [],
          pathMap: [],
        },
      },
    });
  };

  handleProjectStateCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const {
        curReportRecord: { proCode },
        reportTypeKey,
      } = this.state;
      const dispatchTypeMap = {
        0: 'manuscriptManagement/submitWpDictDeliverReq', // 目录报送
        1: 'manuscriptManagement/submitFileReq', // 文件报送
        2: 'manuscriptManagement/submitWpDictDeliverOosReq', // 底稿范围外项目报送
        3: 'manuscriptManagement/submitWpFileUploadWithoutDictReq', // 底稿范围外文件报送
      };

      this.setState({ confirmLoading: true });
      this.props
        .dispatch({
          type: dispatchTypeMap[reportTypeKey],
          payload: {
            proCode,
            batchNumber: Date.now(),
            projectState: values.othersState || values.projectState,
          },
        })
        .then(res => {
          if (res?.status === 200) {
            message.success(res.data);
            this.handleProjectStateCancel();
          } else {
            message.error(res.message);
          }
          this.setState({ confirmLoading: null });
        });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
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
   * * */
  handleFilterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  SearchHtml() {
    const {
      params: { type },
    } = this.state;
    return (
      <Card bordered={ false }>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目电子底稿管理</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col>
            <Search
              placeholder={ `请输入${type === 1 ? '项目' : '系列'}名称/编码` }
              onSearch={ value => this.handleBlurSearch(value) }
              ref="keyWordsInput"
              style={ {
                width: 210,
                marginRight: 23,
                height: 32,
              } }
            />
            <Button onClick={ () => this.handleOpenConditions() } type="link">
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
      <Card bordered={ false }>
        <Form>
          <Row gutter={ { md: 8, lg: 24, xl: 48 } }>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item>底稿目录管理</Breadcrumb.Item>
                <Breadcrumb.Item>项目电子底稿管理</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={ 6 }>
              <Form.Item label={ `${type === 1 ? '项目' : '系列'}名称` } { ...formItemLayout }>
                { getFieldDecorator('proCode')(
                  <Select
                    placeholder={ `请选择${type === 1 ? '项目' : '系列'}名称` }
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={ this.handleFilterOption }
                  >
                    { proCode &&
                      proCode.map(item => (
                        <Select.Option key={ item.code } title={ item.name }>
                          { item.name }
                        </Select.Option>
                      )) }
                  </Select>,
                ) }
              </Form.Item>
            </Col>
            <Col span={ 6 }>
              <Form.Item label="项目类型" { ...formItemLayout }>
                { getFieldDecorator('proType')(
                  <Select
                    placeholder="请选择项目类型"
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={ this.handleFilterOption }
                  >
                    { awpProType &&
                      awpProType.map(item => (
                        <Select.Option key={ item.code } title={ item.name }>
                          { item.name }
                        </Select.Option>
                      )) }
                  </Select>,
                ) }
              </Form.Item>
            </Col>
            <Col span={ 6 }>
              <Form.Item label="所属部门" { ...formItemLayout }>
                { getFieldDecorator('proDept')(
                  <Select
                    placeholder="请选择所属部门"
                    mode="multiple"
                    showArrow
                    allowClear
                    filterOption={ this.handleFilterOption }
                  >
                    { proDept &&
                      proDept.map(item => (
                        <Select.Option key={ item.code } title={ item.name }>
                          { item.name }
                        </Select.Option>
                      )) }
                  </Select>,
                ) }
              </Form.Item>
            </Col>
            <Col span={ 6 }>
              <Form.Item label="开始日期：" { ...formItemLayout } className={ styles.FormDatePicker }>
                { getFieldDecorator('proCDateMin')(<DatePicker />) }
              </Form.Item>
            </Col>
            <Col span={ 6 }>
              <Form.Item label="结束日期：" { ...formItemLayout } className={ styles.FormDatePicker }>
                { getFieldDecorator('proCDateMax')(<DatePicker />) }
              </Form.Item>
            </Col>
            <Col md={ 6 } style={ { float: 'right', textAlign: 'right', paddingTop: 5 } }>
              <Button type="primary" onClick={ () => this.handleSearchBtn() }>
                查询
              </Button>
              <Button style={ { marginLeft: 10 } } onClick={ () => this.handleClearVal() }>
                重置
              </Button>
              <Button onClick={ () => this.handleOpenConditions() } type="link">
                收起
                <Icon type="up" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /**
   * 目录导出
   * * */
  handleContentsExport = ({ proName, proCode }) => {
    download(`/ams/yss-awp-server/product/export/path-file?proCode=${proCode}`, {
      method: 'GET',
      name: `${proName}_${proCode}`,
    });
  };

  tableColumns = type => {
    const selectReport = record => (
      <Menu>
        { ActionBool('manuscriptManagement:projectReport') && (
          <Menu.Item key="0">
            <Button
              style={ { paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' } }
              type="link"
              onClick={ () => this.handleSubmitReport(record, 0) }
              size="small"
            >
              项目报送
            </Button>
          </Menu.Item>
        ) }
        { ActionBool('manuscriptManagement:fileReport') && (
          <Menu.Item key="1">
            <Button
              style={ { paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' } }
              type="link"
              onClick={ () => this.handleSubmitReport(record, 1) }
              size="small"
            >
              文件报送
            </Button>
          </Menu.Item>
        ) }
        { ActionBool('manuscriptManagement:outProjectReport') && (
          <Menu.Item key="2">
            <Button
              style={ { paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' } }
              type="link"
              onClick={ () => this.handleSubmitReport(record, 2) }
              size="small"
            >
              底稿范围外项目报送
            </Button>
          </Menu.Item>
        ) }
        { ActionBool('manuscriptManagement:outFileReport') && (
          <Menu.Item key="3">
            <Button
              style={ { paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' } }
              type="link"
              onClick={ () => this.handleSubmitReport(record, 3) }
              size="small"
            >
              底稿范围外文件报送
            </Button>
          </Menu.Item>
        ) }
        { ActionBool('manuscriptManagement:contentsExport') && (
          <Menu.Item key="4">
            <Button
              style={ { paddingLeft: 0, color: 'rgba(0, 0, 0, 0.65)' } }
              type="link"
              onClick={ () => this.handleContentsExport(record) }
              size="small"
            >
              目录及项下文件导出
            </Button>
          </Menu.Item>
        ) }
      </Menu>
    );
    const columns = [
      {
        key: 'proName',
        title: type === 1 ? '项目名称' : '系列名称',
        dataIndex: 'proName',
        sorter: true,
        width: 300,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proName }>
              <span>{ record.proName }</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: type === 1 ? '项目编码' : '系列编码',
        dataIndex: 'proCode',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proCode }>
              <span>{ record.proCode }</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'projectState',
        title: '项目阶段',
        dataIndex: 'projectState',
        sorter: true,
        render: (text, record) => <Tag>{ record.projectStateName }</Tag>,
      },
      {
        key: 'proType',
        title: '项目类型',
        dataIndex: 'proType',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proTypeName }>
              <span>{ record.proTypeName }</span>
            </Tooltip>
          );
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
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proAreaName }>
              <span>{ record.proAreaName }</span>
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
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proDept }>
              <span>{ record.proDept }</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'customerName',
        title: '客户名称',
        dataIndex: 'customerName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.customerName }>
              <span>{ record.customerName }</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'customerType',
        title: '客户类型',
        dataIndex: 'customerType',
        sorter: true,
        render: text => (
          <Tooltip placement="topLeft" title={ text }>
            <span>{ text }</span>
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
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.creatorName }>
              <span>{ record.creatorName }</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        fixed: 'right',
        width: 350,
        render: (text, record) => {
          return (
            <>
              <Action code="manuscriptManagement:viewPage">
                <Button type="link" onClick={ () => this.handleLookManagement(record) }>
                  查看底稿
                </Button>
              </Action>
              <Action code="manuscriptManagement:changeLog">
                <Button type="link" onClick={ () => this.handleChangeLog(record) }>
                  变更记录
                </Button>
              </Action>
              <Action code="manuscriptManagement:selectSubmit">
                <Dropdown overlay={ selectReport(record) } trigger={ ['click'] }>
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
    if (type === 1) {
      columns.splice(2, 0, {
        key: 'proShortName',
        title: '项目简称',
        dataIndex: 'proShortName',
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <Tooltip placement="topLeft" title={ record.proShortName }>
              <span>{ record.proShortName }</span>
            </Tooltip>
          );
        },
      });
      columns.splice(
        7,
        0,
        {
          key: 'proCDate',
          title: '开始日期',
          dataIndex: 'proCDate',
          sorter: true,
        },
        {
          key: 'proBusType',
          title: '项目分类',
          dataIndex: 'proBusType',
          sorter: true,
          render: text => <span>{ text === '1' ? '管理人项目' : '非管理人项目' }</span>,
        },
        {
          key: 'biddingFlag',
          title: '是否招投标',
          dataIndex: 'biddingFlag',
          sorter: true,
          render: text => <span>{ text === 1 ? '是' : '否' }</span>,
        },
      );
    }
    return columns;
  };

  render() {
    const {
      params: { type, pageSize, pageNum },
      projectStateVisible,
      reportTypeKey,
      confirmLoading,
      curReportRecord,
    } = this.state;
    const {
      loading,
      manuscriptManagement: { tableList },
    } = this.props;

    return (
      <>
        <ProjectStateModal
          wrappedComponentRef={ this.saveFormRef }
          visible={ projectStateVisible }
          reportTypeKey={ reportTypeKey }
          curReportRecord={ curReportRecord }
          confirmLoading={ confirmLoading }
          onCancel={ this.handleProjectStateCancel }
          onCreate={ this.handleProjectStateCreate }
        />
        { this.state.isForm ? this.SearchHtml() : this.detailsSearchHtml() }
        <Card style={ { marginTop: '16px' } } bordered={ false }>
          <Radio.Group
            defaultValue={ type }
            value={ type }
            onChange={ e => this.handleRadioChange(e) }
            buttonStyle="solid"
            style={ { marginBottom: '16px' } }
          >
            <Action code="manuscriptManagement:projectDirectory">
              <Radio.Button value={ 1 }>项目目录</Radio.Button>
            </Action>
            <Action code="manuscriptManagement:seriesDirectory">
              <Radio.Button value={ 0 }>系列目录</Radio.Button>
            </Action>
          </Radio.Group>
          <Table
            rowKey={ record => record.proCode }
            columns={ this.tableColumns(type) }
            dataSource={ tableList.rows }
            scroll={ { x: this.tableColumns(type).length * 250 } }
            onChange={ (order, field, sorter) => this.sortChange(order, field, sorter) }
            loading={ loading }
            pagination={ false }
          />
          { tableList.total != 0 ? (
            <div
              style={ {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 20,
              } }
            >
              <Pagination
                style={ {
                  textAlign: 'right',
                } }
                current={ pageNum }
                pageSize={ pageSize }
                onChange={ this.handleSetPage }
                onShowSizeChange={ this.handleSetPage }
                total={ tableList.total }
                showTotal={ () => `共 ${tableList.total} 条数据` }
                showSizeChanger
                showQuickJumper={ tableList.total > pageSize }
              />
            </div>
          ) : null }
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

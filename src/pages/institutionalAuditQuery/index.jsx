import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
  Table,
} from 'antd';
// import StandardTable from '../../components/StandardTable';
import styles from './index.less';
import BaseCrudComponent from './BaseCrudComponent';
import Action from '@/utils/hocUtil';
import { errorBoundary } from '../../layouts/ErrorBoundary';
import List from '@/components/List';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@errorBoundary
@Form.create()
@connect(state => ({
  institutionalAuditQuery: state.institutionalAuditQuery,
  memberManagement: state.memberManagement,
}))
export default class TableLists extends BaseCrudComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    expandForm: false,
    status: 1,
    checked: 1,
    filteredInfo: null,
    sortedInfo: null,
    formValues: null,
    currentPage: 1,
    pageSize: 10,
    visible: false,
    record: '',
  };

  componentDidMount() {
    this.handleList();
    this.handleUserInfo();
  }

  // 查询/列表
  handleList = () => {
    const { dispatch } = this.props;
    console.log('查询');
    const basic = {
      currentPage: 1,
      pageSize: 10,
    };
    this.setState({
      formValues: basic,
    });

    dispatch({
      type: `institutionalAuditQuery/fetch`,
      payload: basic,
    });

    dispatch({
      type: `institutionalAuditQuery/handleCheckType`,
    });
  };

  handleUserInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleUserInfo`,
    });
  };

  // 新增
  addSon = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/datum/institutionalAuditQuery/addUser'));
  };

  //用户详情
  userInfo = record => {
    const { dispatch } = this.props;
    let registrationReviewFunButtons = JSON.stringify({
      // 当前id
      id: record.id,
      // 审核状态
      checked: record.checked,
    });
    sessionStorage.setItem('registrationReviewFunButtons', registrationReviewFunButtons);
    dispatch(routerRedux.push('/datum/institutionalAuditQuery/userInfo'));
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    let interFace = 'fetch';
    let namespace = 'institutionalAuditQuery';
    this.handleStandardTabpage(pagination, filtersArg, sorter, formValues, interFace, namespace);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 通过
  handleExaminationPassed = record => {
    const {
      memberManagement: { saveUserInfo },
    } = this.props;

    let values = {
      list: [record.id],
      status: 1,
      checkMsg: '默认通过',
      username: saveUserInfo.username,
    };
    this.handleDispatch(values);
  };

  // 批量通过
  handlebatchExaminationPassed = record => {
    const {
      memberManagement: { saveUserInfo },
    } = this.props;
    console.log(this.state.selectedRows, 'this.state.selectedRows');
    if (this.state.selectedRows.length === 0) {
      message.warn('请至少选择一条数据信息', 3);
    } else {
      let data = [];
      this.state.selectedRows.map(item => {
        data.push(item.id);
      });
      const values = {
        list: data,
        status: 1,
        checkMsg: '默认通过',
        username: saveUserInfo.username,
      };
      this.handleDispatch(values);
    }
  };

  // 驳回
  handleExaminationFailed = record => {
    this.showModal();
    this.setState({
      record,
    });
  };

  // 显示弹框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // 弹框确认按钮
  handleOk = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, value) => {
      if (err) return;
      let values = Object.assign({}, value);
      delete values['checked'];
      delete values['registTime'];
      delete values['orgName'];
      this.setState({
        visible: false,
      });
      let val = {
        list: [this.state.record.id],
        status: 2,
        checkMsg: values.checkMsg,
        desc: values.desc,
      };
      this.handleDispatch(val);
    });
  };

  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 触发 驳回/通过 请求
  handleDispatch = values => {
    const { dispatch } = this.props;
    dispatch({
      type: `institutionalAuditQuery/handleReview`,
      payload: values,
    });

    const basic = {
      currentPage: 1,
      pageSize: 10,
    };
    this.setState({
      formValues: basic,
    });
  };

  // 新增按钮
  action = () => {
    return (
      //   <div className={styles.actionsButton}>
      //     <Action key="institutionalAuditQuery:add" code="institutionalAuditQuery:add">
      <Button onClick={this.addSon} type="primary">
        新增
      </Button>
    );
  };

  /***
   * 查询触发
   * @param e
   */
  handleSearch = () => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    const { formValues } = this.state;
    let selectDate;
    if (formValues['registTime'] && formValues['registTime'][0]) {
      selectDate =
        formValues['registTime'][0].format('YYYY-MM-DD') +
        '_' +
        formValues['registTime'][1].format('YYYY-MM-DD');
    }
    const basic = {
      currentPage: 1,
      pageSize: 10,
    };
    const values = {
      ...formValues,
      selectDate,
      ...basic,
    };
    delete values['registTime'];
    delete values['desc'];
    delete values['checkMsg'];
    this.setState({
      formValues: values,
    });
    dispatch({
      type: `institutionalAuditQuery/fetch`,
      payload: values,
    });
  };

  // selection
  getforgtype(e) {
    let children = [];
    for (var key in e) {
      children.push(
        <Option key={e[key].checked} value={e[key].checked}>
          {e[key].name}
        </Option>,
      );
    }
    return (
      <Select style={{ width: '100%', height: 30 }} allowClear>
        {children}
      </Select>
    );
  }

  // selection
  getRejectType(e) {
    let children = [];
    for (var key in e) {
      children.push(
        <Option key={e[key].code} value={e[key].name}>
          {e[key].name}
        </Option>,
      );
    }
    return (
      <Select style={{ width: '100%' }} placeholder="请选择驳回原因" allowClear>
        {children}
      </Select>
    );
  }

  // 查询功能表单
  //   renderAdvancedForm() {
  //     const { getFieldDecorator } = this.props.form;

  //     const select = [
  //       { checked: 0, name: '未审核' },
  //       { checked: 1, name: '通过' },
  //       { checked: 2, name: '驳回' },
  //     ];

  //     const showALLform = (
  //       //<Row gutter={{ md: 24, lg: 24, xl: 48 }}>
  //       <Row>
  //         <Col md={12} sm={24} xxl={6}>
  //           <FormItem label="企业名称">
  //             {getFieldDecorator('orgName')(<Input placeholder="请输入" style={{ height: 30 }} />)}
  //           </FormItem>
  //         </Col>

  //         <Col md={12} sm={24} xxl={6}>
  //           <FormItem label="注册时间">
  //             {getFieldDecorator('registTime')(
  //               <RangePicker className={styles.RangePicker} style={{ height: 30 }} />,
  //             )}
  //           </FormItem>
  //         </Col>

  //         <Col md={12} sm={24} xxl={6}>
  //           <FormItem label="审核状态">
  //             {getFieldDecorator('checked')(this.getforgtype(select))}
  //           </FormItem>
  //         </Col>

  //         <Col md={12} sm={24} xxl={6}>
  //           <div className={styles.actionsButton}>
  //             {/* <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:check"> */}
  //             <Button type="primary" htmlType="submit">
  //               查询
  //             </Button>
  //             <Button onClick={this.handleFormReset}>重置</Button>
  //             {/* </Action> */}
  //           </div>
  //         </Col>
  //       </Row>
  //     );
  //     return (
  //       <Form onSubmit={this.handleSearch} layout="inline">
  //         {showALLform}
  //       </Form>
  //     );
  //   }

  renderForm() {
    return this.renderAdvancedForm();
  }

  // 判断功能按钮
  handleFun = record => {
    if (record.checked === 0) {
      if (record.checkUser === 0) {
        return (
          <div>
            <span>
              <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:review">
                <a href="javascript:;" onClick={() => this.handleExaminationFailed(record)}>
                  驳回
                </a>
              </Action>
            </span>
            <Divider type="vertical" />
            <span onClick={() => this.userInfo(record)}>
              <a href="javascript:;">详情</a>
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <span>
              <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:review">
                <a href="javascript:;" onClick={() => this.handleExaminationPassed(record)}>
                  通过
                </a>
              </Action>
            </span>
            <Divider type="vertical" />
            <span>
              <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:review">
                <a href="javascript:;" onClick={() => this.handleExaminationFailed(record)}>
                  驳回
                </a>
              </Action>
            </span>
            <Divider type="vertical" />
            <span onClick={() => this.userInfo(record)}>
              <a href="javascript:;">详情</a>
            </span>
          </div>
        );
      }
    } else {
      return (
        <div>
          <span onClick={() => this.userInfo(record)}>
            <a href="javascript:;">详情</a>
          </span>
        </div>
      );
    }
  };
  /**
   * 条件查询
   * @method searchBtn
   */

  handlerSearch = fieldsValue => {
    console.log(fieldsValue, 'fieldsValue查询');
    this.setState(
      {
        formValues: fieldsValue || {},
      },
      () => {
        this.handleSearch();
      },
    );
  };
  /**
   *
   * @param keywords 关键字 (系列/产品全称、系列号/产品代码)
   */
  changeKeyWords = keywords => {
    this.setState(
      {
        currentPage: 1,
        pageSize: 10,
        keyWords: keywords,
      },
      () => {
        // this.getTableData();
      },
    );
  };

  render() {
    const {
      institutionalAuditQuery: { loading, data, checkType, currentPage },
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows } = this.state;
    // columns
    const columns = [
      {
        title: '企业全称',
        dataIndex: 'orgName',
        key: 'orgName',
        render: text => (
          <Tooltip title={text}>
            <span className={styles.ellips}>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '申请时间',
        dataIndex: 'registTime',
        key: 'registTime',
      },
      {
        title: '经办人',
        dataIndex: 'handler',
        key: 'handler',
      },
      {
        title: '系统验证',
        dataIndex: 'checkUser',
        key: 'checkUser',
        render: text => (
          <span>{text === 0 ? '重复注册' : text === 1 ? '非存量客户' : '新用户'}</span>
        ),
      },
      {
        title: '短信通知',
        dataIndex: 'sendMassage',
        key: 'sendMassage',
        render: text => (
          <span>
            {text === 1 ? (
              <Icon
                type="check-circle"
                style={{ fontSize: 14, color: '#9fcc02' }}
                title="发送成功"
              />
            ) : (
              <Icon
                type="close-circle"
                style={{ fontSize: 14, color: '#cc1300' }}
                title="发送成功"
              />
            )}
          </span>
        ),
        align: 'center',
      },
      {
        title: '审核状态',
        dataIndex: 'checked',
        key: 'checked',
        render: text => <span>{text === 0 ? '未审核' : text === 1 ? '通过' : '驳回'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operating',
        key: 'operating',
        width: '156px',
        fixed: 'right',
        render: (text, record) => <span>{this.handleFun(record)}</span>,
        align: 'center',
      },
    ];
    const select = [
      { checked: 0, name: '未审核' },
      { checked: 1, name: '通过' },
      { checked: 2, name: '驳回' },
    ];

    const formItemData = [
      {
        name: 'orgName',
        label: '企业名称',
        type: 'Input',
      },
      {
        name: 'registTime',
        label: '注册时间',
        type: 'RangePicker',
      },
      {
        name: 'checked',
        label: '审核状态',
        type: 'select',
        readSet: { name: 'name', code: 'checked' },
        option: select,
      },
    ];
    const rowSelections = {
      selectedRows: this.state.selectedRows,
      onChange: (selectedRows, selectRows) => {
        this.setState({
          selectedRows: selectRows,
          //   checkedArr: selectRows,
        });
      },
    };

    return (
      <div className={styles.base}>
        {/* <Card bordered={false} title="注册机构用户" extra={this.action()}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card> */}
        <List
          pageCode="institutionalAuditQuery"
          //   dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={null}
          taskArrivalTimeKey="taskTime"
          title={'注册审核授权'}
          fuzzySearchBool={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleFormReset}
          searchInputWidth="300"
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.changeKeyWords}
          extra={this.action()}
          tableList={
            <>
              <Table
                dataSource={data.data.rows}
                columns={columns}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: data.data.total,
                  showTotal: () => `共 ${data.data.total} 条数据`,
                  // onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
                  pageSize: this.state.pageSize,
                  current: this.state.currentPage,
                }}
                scroll={{ x: 2000 }}
                loading={loading}
                rowSelection={rowSelections}
                onChange={this.handleStandardTableChange}
                rowKey={record => record.key}
              />
              <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:check">
                {typeof data.data.rows !== 'undefined' && data.data.rows.length > 0 ? (
                  <Button
                    type="primary"
                    className={styles.dowmBuutton}
                    onClick={this.handlebatchExaminationPassed}
                  >
                    批量通过
                  </Button>
                ) : (
                  ''
                )}
              </Action>
            </>
          }
        />
        {/* <Card
          style={{
            marginTop: '20px',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '10px',
          }}
        >
          <Card bordered={false}>
            <StandardTable
              rowKey={record => record.key}
              columns={columns}
              selectedRows={selectedRows}
              data={data}
              loading={loading}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              currentPage={currentPage}
            />
          </Card>
          <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:check">
            {typeof data.data.rows !== 'undefined' && data.data.rows.length > 0 ? (
              <Button
                type="primary"
                className={styles.dowmBuutton}
                onClick={this.handlebatchExaminationPassed}
              >
                批量通过
              </Button>
            ) : (
              ''
            )}
          </Action>
        </Card> */}
        <Modal
          title="用户注册驳回"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="517px"
          height="307px"
          destroyOnClose
        >
          <Form layout="vertical" style={{ paddingLeft: 114, paddingRight: 114 }}>
            <Row>
              <Col>
                <FormItem label="驳回原因：">
                  {getFieldDecorator('checkMsg', {
                    initialValue: `${checkType && checkType[0] && checkType[0]['name']}`,
                  })(this.getRejectType(checkType))}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="备注：">{getFieldDecorator('desc')(<TextArea />)}</FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

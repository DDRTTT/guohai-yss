//联系人信息
import React, { Component } from 'react';
import Action from '@/utils/hocUtil';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Modal, Row, Col, Input, Button } from 'antd';
import { Table } from '@/components';
import { handleTableCss } from '../../manuscriptBasic/func';
import { handleValidator } from '@/utils/utils';
import Gird from '@/components/Gird';
import styles from '../index.less';
import styleSetPanel from '@/pages/operatingCalendar/setPanel/styleSetPanel';
@Form.create()
class contactInfo extends Component {
  state = {
    contpageNum: 1,
    contpageSize: 10,
    addContactsShow: false,
    popuptitle: '',
    record: null,
  };
  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构名称长度过长');
  };
  handleNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '姓名长度过长');
  };
  handleOrgCallValidator = (rule, value, callback) => {
    handleValidator(value, callback, 11, '手机号长度过长');
  };
  handleOtherInfoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '其他信息长度过长');
  };
  handleOrgPhoneValidator = (rule, value, callback) => {
    handleValidator(value, callback, 11, '电话长度过长');
  };
  componentDidMount = () => {
    this.getContacts();
  };
  //联系人新增
  newContactthis = () => {
    this.setState(
      {
        popuptitle: '新增',
        addContactsShow: true,
      },
      () => {
        this.showContactsModal();
      },
    );
  };
  // 联系人修改
  contactModif = record => {
    this.setState({
      record,
      popuptitle: '修改',
      addContactsShow: true,
    });
    this.showContactsModal();
  };
  // 联系人查看
  contactView = record => {
    this.setState({
      record,
      buttonDisabled: true,
      addContactsShow: true,
      popuptitle: '查看',
    });
    this.showContactsModal();
  };
  // 联系人查询
  contactSearch = () => {
    this.setState(
      {
        contpageNum: 1,
        contpageSize: 10,
      },
      () => {
        this.getContacts();
      },
    );
  };
  // 联系人删除
  contacDelete = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'orgInfoManagement/getDeleteContent',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getContacts();
          }
        });
      },
    });
  };
  // 对话框关闭时的回调
  afterClose = () => {
    this.setState({
      record: null,
      buttonDisabled: false,
    });
    this.props.form.resetFields();
  };
  // 联系人新增弹框是否显示
  showContactsModal = () => {
    this.props.form.resetFields();
    this.setState({
      addContactsShow: true,
    });
  };
  /**
   * 重置 联系人
   * @method handleClearVal
   */
  handleClearContact = () => {
    this.props.form.resetFields();
    this.setState(
      {
        contpageNum: 1,
        contpageSize: 10,
      },
      () => {
        this.getContacts();
      },
    );
  };
  /**
   * 联系人列表分页查询
   * @method getStafList
   */
  getContacts(val) {
    const { dispatch, location } = this.props;
    const { contpageNum, contpageSize } = this.state;
    const values = this.props.form.getFieldsValue();
    const payload = {
      pageNum: contpageNum,
      pageSize: contpageSize,
      // orgId: Number(location.query.id),
      orgId: this.props.orgid,
    };
    if (values && values.linkerName) {
      payload.linkerName = values.linkerName;
    }
    if (values && values.otherOrg && val !== 'content') {
      payload.otherOrg = values.otherOrg;
    }
    dispatch({
      type: 'orgInfoManagement/getContacts',
      payload,
    });
  }
  /**
   * 联系人分页/页码切换/排序
   * @method contactsTableChange
   */
  contactsTableChange = pagination => {
    this.setState(
      {
        contpageNum: pagination.current,
        contpageSize: pagination.pageSize,
        // direction: sorter.order == 'ascend' ? 'asc' : 'desc',
        // fieldName: sorter.field,
      },
      () => {
        this.getContacts();
      },
    );
  };
  /**
   * 联系人保存/修改
   * @method getSaveContent
   */
  getSaveContent = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dispatch, location } = this.props;
      const { record } = this.state;
      // const values = this.props.form.getFieldsValue();
      if (record !== null) {
        values.id = record.id;
      }
      // if (values.orgName) {
      //   values.otherOrg = values.otherOrgs;
      //   delete values.otherOrgs;
      // }
      values.orgId = this.props.orgid;
      values.otherOrg = values.orgName;
      delete values.orgName;
      dispatch({
        type: 'orgInfoManagement/getSaveContent',
        payload: values,
      }).then(data => {
        if (data) {
          this.props.form.resetFields();
          this.setState(
            {
              addContactsShow: false,
              pageNum: 1,
              pageSize: 10,
              orgId: this.props.orgid,
            },
            () => {
              this.getContacts('content');
            },
          );
        }
      });
    });
  };
  handleContactsCancel = () => {
    this.setState(
      {
        addContactsShow: false,
      },
      () => {
        // this.showContactsModal();
      },
    );
  };
  /**
   * 联系人信息查询
   * @method contactsInfor
   */
  contactsInfor() {
    const { getFieldDecorator } = this.props.form;
    const { record } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
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
      <>
        <Form {...layout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <Form.Item label="姓名" {...formItemLayout}>
                {getFieldDecorator(
                  'linkerName',
                  {},
                )(<Input autoComplete="off" allowClear placeholder="请输入员工姓名" />)}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="机构名称" {...formItemLayout}>
                {getFieldDecorator('otherOrg', {
                  //   rules: [{ validator: this.handleorgNameValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入机构名称" />)}
              </Form.Item>
            </Col>
            <Col md={4}>
              <span>
                <Button type="primary" onClick={() => this.contactSearch()}>
                  查 询
                </Button>
                <Button className={styles.reset} onClick={() => this.handleClearContact()}>
                  重 置
                </Button>
              </span>
            </Col>
            {this.props.falg && (
              <Col className={styles.addbtn} md={8}>
                <Action code="orgInfoManagement:contactSave">
                  <Button type="primary" onClick={() => this.newContactthis()}>
                    新增
                  </Button>
                </Action>
              </Col>
            )}
          </Row>
        </Form>
      </>
    );
  }
  /**
   * 新增修改弹框
   * @method addContacts
   */
  addContacts() {
    const { getFieldDecorator } = this.props.form;
    const { record } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
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
      <Row>
        <Form {...layout}>
          <Col span={8}>
            <Form.Item label="机构名称" {...formItemLayout}>
              {getFieldDecorator('orgName', {
                initialValue: record !== null ? record.otherOrg : localStorage.getItem('orgName'),
                rules: [
                  {
                    required: true,
                    message: '机构名称不可为空',
                  },
                  { validator: this.handleorgNameValidator },
                ],
              })(<Input disabled={true} autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: record !== null ? record.name : '',
                rules: [
                  {
                    required: true,
                    message: '姓名不可为空',
                  },
                  { validator: this.handleNameValidator },
                ],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系方式" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: record !== null ? record.phone : '',
                rules: [{ validator: this.handleOrgCallValidator }],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: record !== null ? record.email : '',
                rules: [
                  {
                    type: 'email',
                    message: '无效的邮箱格式',
                  },
                ],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="其他" {...formItemLayout}>
              {getFieldDecorator('otherInfo', {
                initialValue: record !== null ? record.otherInfo : '',
                rules: [{ validator: this.handleOtherInfoValidator }],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="座机号" {...formItemLayout}>
              {getFieldDecorator('tel', {
                initialValue: record !== null ? record.tel : '',
                rules: [{ validator: this.handleOrgPhoneValidator }],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    );
  }
  render() {
    const {
      orgInfoManagement: { stafList, contactsList },
      //   location: { query },
    } = this.props;
    const {
      contpageNum,
      contpageSize,
      addContactsShow,
      popuptitle,
      buttonDisabled,
      record,
    } = this.state;
    // 详情配置
    const drawerConfig = [
      { label: '机构名称', value: 'otherOrg' },
      { label: '姓名', value: 'name' },
      { label: '联系方式', value: 'phone' },
      { label: '邮箱', value: 'email' },
      { label: '其他', value: 'otherInfo' },
      { label: '座机号', value: 'tel' },
    ];
    const contactList = [
      {
        title: '机构名称',
        dataIndex: 'otherOrg',
        // sorter: true,
        width: 400,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '姓名',
        dataIndex: 'name',
        // sorter: true,
        width: 150,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
        // sorter: true,
        width: 150,
        render: text => {
          return handleTableCss(text);
        },
        align: 'right',
      },
      // {
      //   title: '备注',
      //   dataIndex: 'linkerDesc',
      //   // sorter: true,
      //   width: 150,
      //   render: text => {
      //     return handleTableCss(text);
      //   },
      // },
      {
        title: '操作',
        dataIndex: '',
        // sorter: true,
        width: 150,
        render: (text, record) => {
          const content = (
            <>
              <a className={styles.tablebtn} type="link" onClick={() => this.contactView(record)}>
                查看
              </a>

              {this.props.falg && (
                <a
                  className={styles.tablebtn}
                  type="link"
                  onClick={() => this.contactModif(record)}
                >
                  修改
                </a>
              )}
              {this.props.falg && (
                <a
                  type="link"
                  className={styles.tablebtn}
                  onClick={() => this.contacDelete(record)}
                >
                  删除
                </a>
              )}
            </>
          );
          return content;
        },
      },
    ];
    return (
      <div className={styles.contactInfo}>
        {this.contactsInfor()}
        <Modal
          title={popuptitle}
          visible={addContactsShow}
          onOk={() => this.getSaveContent()}
          onCancel={this.handleContactsCancel}
          width={1200}
          afterClose={this.afterClose}
          okButtonProps={{ disabled: buttonDisabled }}
          // cancelButtonProps={{ disabled: buttonDisabled }}
        >
          {buttonDisabled ? <Gird config={drawerConfig} info={record} /> : this.addContacts()}
        </Modal>
        <Table
          rowKey={record => record.id}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            total: contactsList.total,
            showTotal: () => `共 ${contactsList.total} 条数据`,
            pageSize: contpageSize,
          }}
          dataSource={contactsList.rows}
          columns={contactList}
          scroll={{ x: 1300 }}
          // loading={tableLoading}
          rowSelection={this.rowSelection}
          onChange={this.contactsTableChange}
        />
      </div>
    );
  }
}
const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(contactInfo),
  ),
);
export default WrappedAdvancedSearchForm;

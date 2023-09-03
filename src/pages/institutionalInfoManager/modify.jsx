import React, { Component } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { downloadNoToken } from '@/utils/download';
import { handleTableCss } from '../manuscriptBasic/func';
import Gird from '@/components/Gird';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Tabs,
  TreeSelect,
  Upload,
} from 'antd';
import { getAuthToken } from '@/utils/session';
import See from './details';
import Add from './addOrganization';
import OrgStructure from './orgStructure';
import styles from './less/modify.less';
import { handleValidator } from '@/utils/utils';
import { Card, PageContainers, Table } from '@/components';

const { TabPane } = Tabs;
const token = getAuthToken();

@Form.create()
class Modify extends Component {
  state = {
    size: 'small',
    addEmployShow: false,
    addContactsShow: false,
    buttonDisabled: false,
    record: null,
    emppageNum: 1,
    emppageSize: 10,
    contpageNum: 1,
    contpageSize: 10,
    checkedArr: [],
    editing: false,
    keyValue: 1,
    title: `修改`,
    popuptitle: '新增',
    // 查看页进来员工联系人标识
    seeIdenti: true,
    // 所属组织机构
    SuperiorOrgs: [],
    defaultActiveKey: sessionStorage.getItem('keyValue') ? '2' : '1',
    dataSource: [
      {
        key: 0,
        orgName: '',
        heldPosition: '',
        department: '',
        positionStartDate: '',
        positionEndDate: '',
      },
    ],
    breadcrumb: '',
  };

  componentDidMount() {
    // console.log('this.props.location', this.props.location);
    const { query } = this.props.location;
    this.getOrganName();
    this.getStafList();
    // this.getSuperiorOrg('0')
    this.getDepartment(query?.id);
    sessionStorage.removeItem('keyValue');
    if (query.type && query.type === 'details') {
      this.setState({
        title: `查看-${query.name}`,
        seeIdenti: false,
        breadcrumb: '查看',
      });
    } else {
      this.setState({
        title: `修改-${query.name}`,
        breadcrumb: '修改',
      });
    }
    if (query.type && query.type === 'othermodify') {
      this.setState({
        title: `修改-${query.name}`,
        breadcrumb: '修改',
      });
    }
  }

  /**
   * 员工列表分页查询
   * @method getStafList
   */
  getStafList() {
    const { dispatch, location } = this.props;
    const { emppageSize, emppageNum } = this.state;
    const values = this.props.form.getFieldsValue();
    const payload = {
      pageNum: emppageNum,
      pageSize: emppageSize,
    };
    if (location.query.id) {
      payload.orgId = Number(location.query.id);
    }
    if (values && values.name) {
      payload.name = values.name;
    }
    if (values && values.depIdList) {
      payload.depIdList = [values.depIdList];
    }
    dispatch({
      type: 'modify/getStafList',
      payload,
    });
  }

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
      orgId: Number(location.query.id),
    };
    if (values && values.linkerName) {
      payload.linkerName = values.linkerName;
    }
    if (values && values.otherOrg && val !== 'content') {
      payload.otherOrg = values.otherOrg;
    }
    dispatch({
      type: 'modify/getContacts',
      payload,
    });
  }

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
      if (values.otherOrgs) {
        values.otherOrg = values.otherOrgs;
        delete values.otherOrgs;
      }
      values.orgId = location.query.id;
      dispatch({
        type: 'modify/getSaveContent',
        payload: values,
      }).then(data => {
        if (data) {
          this.props.form.resetFields();
          this.setState(
            {
              addContactsShow: false,
              pageNum: 1,
              pageSize: 10,
              orgId: Number(location.query.id),
            },
            () => {
              this.getContacts('content');
            },
          );
        }
      });
    });
  };

  /**
   * 机构名称
   * @method getOrganName
   */
  getOrganName() {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getOrganName',
    });
  }

  /**
   * 获取机构部门
   * @method getDepartment
   */
  getDepartment(orgId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'modify/getDepartment',
      // payload: orgId,
      payload: { needRoot: 0, orgId },
    });
  }

  /**
   * 重置
   * @method handleClearVal
   */
  handleClearVal = () => {
    this.props.form.resetFields();
    this.setState(
      {
        emppageNum: 1,
        emppageSize: 10,
      },
      () => {
        this.getStafList();
      },
    );
  };

  /**
   * tab切换
   * @method callback
   */
  callback = key => {
    // this.props.form.resetFields();
    this.setState({ defaultActiveKey: key }, () => {
      if (key === '2') {
        this.getStafList();
        // this.getDepartment();
      } else if (key === '3') {
        this.getContacts();
      }
    });
  };

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
   * 员工分页/页码切换/排序
   * @method staffTableChange
   */
  staffTableChange = pagination => {
    this.setState(
      {
        emppageNum: pagination.current,
        emppageSize: pagination.pageSize,
        // direction: sorter.order == 'ascend' ? 'asc' : 'desc',
        // fieldName: sorter.field,
      },
      () => {
        this.getStafList();
      },
    );
  };

  /**
   * 员工下载
   * @method staffDownload
   */
  staffDownload = () => {
    downloadNoToken(`/ams/ams-base-parameter/employee/download`, {
      name: '员工信息模板.xlsx',
    });
  };

  // 员工新增弹框是否显示
  showEmployModal = orgId => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/addEmployees',
        query: { orgId },
      }),
    );
  };

  // 联系人新增弹框是否显示
  showContactsModal = () => {
    this.props.form.resetFields();
    this.setState({
      addContactsShow: true,
    });
  };

  handleContactsCancel = e => {
    this.setState({
      addContactsShow: false,
    });
  };

  EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );

  /**
   * 添加员工履历
   * @method addEmploy
   */
  addResume = () => {
    const { dataSource, keyValue } = this.state;
    // console.log(keyValue, 'keyValue');
    const employInfo = {
      key: keyValue,
      orgName: '',
      heldPosition: '',
      department: '',
      positionStartDate: '',
      positionEndDate: '',
      show: true,
    };
    this.setState({
      dataSource: [employInfo, ...dataSource],
      key: keyValue + 1,
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  // 对话框关闭时的回调
  afterClose = () => {
    this.setState({
      record: null,
      buttonDisabled: false,
    });
    this.props.form.resetFields();
  };

  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构名称长度过长');
  };

  handleOrgRegaddrValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '地址长度过长');
  };

  handleOrgPhoneValidator = (rule, value, callback) => {
    handleValidator(value, callback, 11, '电话长度过长');
  };

  handleOrgCallValidator = (rule, value, callback) => {
    handleValidator(value, callback, 11, '手机号长度过长');
  };

  handleOrgFaxValidator = (rule, value, callback) => {
    handleValidator(value, callback, 20, '传真长度过长');
  };

  handleIdNumberValidator = (rule, value, callback) => {
    if (!value) callback();
    const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
    // /^[1-9]d{5}(18|19|20|(3d))d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)d{3}[0-9Xx]$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('身份证号码格式不正确');
    }
  };

  handleOtherInfoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '其他信息长度过长');
  };

  handleLinkerDescValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '联系人备注长度过长');
  };

  handleNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '姓名长度过长');
  };

  /**
   * 联系人新增
   * @method addContacts
   */
  addContacts() {
    const { addContactsShow, record, buttonDisabled, popuptitle } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    // 详情配置
    const drawerConfig = [
      { label: '机构名称', value: 'otherOrg' },
      { label: '姓名', value: 'name' },
      { label: '电话', value: 'tel' },
      { label: '手机号码', value: 'phone' },
      { label: '邮箱', value: 'email' },
      { label: '地址', value: 'address' },
      { label: '邮编', value: 'zip' },
      { label: '传真', value: 'fax' },
      { label: '身份证号', value: 'idNumber' },
      { label: '联系人备注', value: 'linkerDesc', proportion: true },
      { label: '其他', value: 'otherInfo' },
    ];
    return (
      <Modal
        title={popuptitle}
        visible={addContactsShow}
        onOk={() => this.getSaveContent(record)}
        onCancel={this.handleContactsCancel}
        width={1200}
        afterClose={this.afterClose}
        okButtonProps={{ disabled: buttonDisabled }}
        cancelButtonProps={{ disabled: buttonDisabled }}
      >
        <Row>
          {!buttonDisabled && (
            <Form {...layout}>
              <Col span={8}>
                <Form.Item label="机构名称" {...formItemLayout}>
                  {getFieldDecorator('otherOrg', {
                    initialValue: record !== null ? record.otherOrg : '',
                    rules: [
                      {
                        required: true,
                        message: '机构名称不可为空',
                      },
                      { validator: this.handleorgNameValidator },
                    ],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
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
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="电话" {...formItemLayout}>
                  {getFieldDecorator('tel', {
                    initialValue: record !== null ? record.tel : '',
                    rules: [{ validator: this.handleOrgPhoneValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="手机号码" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    initialValue: record !== null ? record.phone : '',
                    rules: [{ validator: this.handleOrgCallValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
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
                      {
                        required: true,
                        message: '邮箱不可为空',
                      },
                    ],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="地址" {...formItemLayout}>
                  {getFieldDecorator('address', {
                    initialValue: record !== null ? record.address : '',
                    rules: [{ validator: this.handleOrgRegaddrValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="邮编" {...formItemLayout}>
                  {getFieldDecorator('zip', {
                    initialValue: record !== null ? record.zip : '',
                    rules: [
                      {
                        pattern: /^[0-9]{1,6}$/,
                        message: '邮编不得超过6位',
                      },
                    ],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="传真" {...formItemLayout}>
                  {getFieldDecorator('fax', {
                    initialValue: record !== null ? record.fax : '',
                    rules: [{ validator: this.handleOrgFaxValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="身份证号" {...formItemLayout}>
                  {getFieldDecorator('idNumber', {
                    initialValue: record !== null ? record.idNumber : '',
                    rules: [{ validator: this.handleIdNumberValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="联系人备注" {...formItemLayout}>
                  {getFieldDecorator('linkerDesc', {
                    initialValue: record !== null ? record.linkerDesc : '',
                    rules: [{ validator: this.handleLinkerDescValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="其他" {...formItemLayout}>
                  {getFieldDecorator('otherInfo', {
                    initialValue: record !== null ? record.otherInfo : '',
                    rules: [{ validator: this.handleOtherInfoValidator }],
                  })(<Input autoComplete="off" disabled={buttonDisabled} />)}
                </Form.Item>
              </Col>
            </Form>
          )}
          {buttonDisabled && <Gird config={drawerConfig} info={record} />}
        </Row>
      </Modal>
    );
  }

  /**
   * 公共信息
   * @method publicInfor
   */
  publicInfor = () => {
    const { location } = this.props;
    // 查看页面
    if (location && location?.query?.type && location.query.type !== 'othermodify') {
      return <See identification="true" location={location} />;
    }
    // 修改页面
    return <Add identification="true" orgId={location.query.id} />;
  };
  // 员工查询
  employeeSearch = () => {
    this.setState(
      {
        emppageNum: 1,
        emppageSize: 10,
      },
      () => {
        this.getStafList();
      },
    );
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

  /**
   * 员工信息查询
   * @method employeeInfor
   */
  employeeInfor() {
    const { getFieldDecorator } = this.props.form;
    const {
      modify: { department },
      location: { query },
    } = this.props;
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
    const uploadProps = {
      action: '/ams/ams-base-parameter/employee/import',
      name: 'multipartFile',
      method: 'post',
      headers: {
        Token: token,
      },
    };
    return (
      <>
        <Form {...layout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <Form.Item label="员工姓名" {...formItemLayout}>
                {getFieldDecorator('name', {
                  rules: [{ validator: this.handleNameValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入员工姓名" />)}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="部门" {...formItemLayout}>
                {getFieldDecorator('depIdList')(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={department}
                    placeholder="请选择部门"
                    treeDefaultExpandAll
                    // onChange={this.onChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={4}>
              <span>
                <Button type="primary" onClick={() => this.employeeSearch()}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={() => this.handleClearVal()}>
                  重 置
                </Button>
              </span>
            </Col>
            <Col md={2} />
            <Col md={2} style={{ display: this.state.seeIdenti ? 'block' : 'none' }}>
              <Button>
                <a
                  href="/img/amsInvestorServer/employeeInformation.xlsx"
                  download="员工信息模板.xlsx"
                >
                  下载模板
                </a>
              </Button>
            </Col>
            <Col md={2} style={{ display: this.state.seeIdenti ? 'block' : 'none' }}>
              <Upload showUploadList={false} {...uploadProps} onChange={this.onChange}>
                <Button>
                  <Icon type="upload" />
                  导入信息
                </Button>
              </Upload>
            </Col>
            <Col
              span={2}
              style={{ textAlign: 'right', display: this.state.seeIdenti ? 'block' : 'none' }}
            >
              <Button type="primary" onClick={() => this.showEmployModal(query?.id)}>
                新增
              </Button>
            </Col>
          </Row>
        </Form>
      </>
    );
  }

  onChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.response && info.file.response.status === 200) {
      message.success(`${info.file.name} 文件上传成功`);
      this.getStafList();
    } else if (info.file.response && info.file.response.status === 500) {
      message.error(info.file.response.message);
    }
  };

  newContactthis = () => {
    this.setState(
      {
        popuptitle: '新增',
      },
      () => {
        this.showContactsModal();
      },
    );
  };

  /**
   * 联系人信息查询
   * @method contactsInfor
   */
  contactsInfor() {
    const { getFieldDecorator } = this.props.form;
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
                {getFieldDecorator('linkerName', {
                  rules: [{ validator: this.handleNameValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入员工姓名" />)}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="机构名称" {...formItemLayout}>
                {getFieldDecorator('otherOrg', {
                  rules: [{ validator: this.handleorgNameValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入机构名称" />)}
              </Form.Item>
            </Col>
            <Col md={4}>
              <span>
                <Button type="primary" onClick={() => this.contactSearch()}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={() => this.handleClearVal()}>
                  重 置
                </Button>
              </span>
            </Col>
            <Col
              md={8}
              style={{ textAlign: 'right', display: this.state.seeIdenti ? 'block' : 'none' }}
            >
              <Action code="institutionalInfoManager:contactSave">
                <Button type="primary" onClick={() => this.newContactthis()}>
                  新增
                </Button>
              </Action>
            </Col>
          </Row>
        </Form>
      </>
    );
  }

  // 员工查看
  staffView = record => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/addEmployees',
        query: {
          id: record.id,
          type: 'details',
        },
      }),
    );
  };

  // 员工修改
  goDetails = record => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/addEmployees',
        query: {
          id: record.id,
          type: 'modify',
          orgId: query?.id,
        },
      }),
    );
  };

  // 联系人查看
  contactView = record => {
    this.setState({
      record,
      buttonDisabled: true,
      popuptitle: '查看',
    });
    this.showContactsModal();
  };

  // 联系人修改
  contactModif = record => {
    this.setState({
      record,
      popuptitle: '修改',
    });
    this.showContactsModal();
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
          type: 'modify/getDeleteContent',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getContacts();
          }
        });
      },
    });
  };

  // 员工删除
  employeeDelete = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'modify/getEmployeeDelete',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getStafList();
          }
        });
      },
    });
  };

  // 批量删除
  pldelInfo = () => {
    const { dispatch } = this.props;
    const idArr = [];
    this.state.checkedArr.map(item => idArr.push(item.id));
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'modify/getEmployeeDelete',
          payload: idArr,
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [] });
            this.getStafList();
          }
        });
      },
    });
  };

  // 返回主页
  gohomepage = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index',
      }),
    );
  };

  render() {
    const { emppageSize, contpageSize, title, breadcrumb } = this.state;

    const {
      modify: { stafList, contactsList },
      location: { query },
    } = this.props;
    const employeeList = [
      // 需求：删除 职务类型 列
      // {
      //   title: '职务类型',
      //   dataIndex: 'jobTypeName',
      //   // sorter: true,
      //   width: 400,
      //   render: text => {
      //     return handleTableCss(text);
      //   },
      // },
      {
        title: '姓名',
        dataIndex: 'name',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '性别',
        dataIndex: 'sexName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '员工部门',
        dataIndex: 'depName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '最高学位',
        dataIndex: 'highestDegreeName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '最高学历',
        dataIndex: 'highestEducationName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '是否在职',
        dataIndex: 'isOnJobName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '任职开始日期',
        dataIndex: 'positionStartDate',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '任职结束日期',
        dataIndex: 'positionEndDate',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '操作',
        fixed: 'right',
        // sorter: true,
        width: 300,
        render: (text, record) => {
          const content = (
            <>
              <a className={styles.operationBtn} type="link" onClick={() => this.staffView(record)}>
                查看
              </a>
              {this.state.seeIdenti ? (
                <>
                  <a
                    className={styles.operationBtn}
                    type="link"
                    onClick={() => this.goDetails(record)}
                  >
                    修改
                  </a>
                  <a
                    className={styles.operationBtn}
                    type="link"
                    onClick={() => this.employeeDelete(record)}
                  >
                    删除
                  </a>
                </>
              ) : (
                ''
              )}
            </>
          );
          return content;
        },
      },
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
      {
        title: '备注',
        dataIndex: 'linkerDesc',
        // sorter: true,
        width: 150,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '操作',
        dataIndex: '',
        // sorter: true,
        width: 150,
        render: (text, record) => {
          const content = (
            <>
              <a
                className={styles.operationBtn}
                type="link"
                onClick={() => this.contactView(record)}
              >
                查看
              </a>
              {this.state.seeIdenti ? (
                <>
                  <a
                    className={styles.operationBtn}
                    type="link"
                    onClick={() => this.contactModif(record)}
                  >
                    修改
                  </a>
                  <a
                    className={styles.operationBtn}
                    type="link"
                    onClick={() => this.contacDelete(record)}
                  >
                    删除
                  </a>
                </>
              ) : (
                ''
              )}
            </>
          );
          return content;
        },
      },
    ];

    return (
      <PageContainers
        breadcrumb={[
          {
            title: '产品数据管理',
            url: '',
          },
          {
            title: '机构信息管理',
            url: '/productDataManage/institutionalInfoManager/index',
          },
          {
            title: breadcrumb,
            url: '',
          },
        ]}
        footer={
          <Tabs
            defaultActiveKey={this.state.defaultActiveKey}
            onChange={this.callback}
            // animated={false}
          >
            <TabPane tab="公共信息" key="1" />
            <TabPane tab="组织架构" key="0" />
            <TabPane tab="员工信息" key="2" />
            <TabPane tab="联系人信息" key="3" />
          </Tabs>
        }
      >
        <div className="detailPage">
          <div className="scollWrap scollWrap176 none-scroll-bar">
            {this.state.defaultActiveKey === '1' && this.publicInfor()}
            {this.state.defaultActiveKey === '0' && (
              <>
                <Card title={false} style={{ paddingTop: 16 }}>
                  <OrgStructure identification={query.type === 'details'} orgCode={query.orgCode || ''} orgId={query.id || ''}/>
                </Card>
              </>
            )}
            {this.state.defaultActiveKey === '2' && (
              <>
                <Card title={false} style={{ paddingTop: 16 }}>
                  {this.employeeInfor()}
                  <Table
                    pagination={{
                      size: 'small',
                      showQuickJumper: true,
                      showSizeChanger: true,
                      total: stafList.total,
                      showTotal: () => `共 ${stafList.total} 条数据`,
                      pageSize: emppageSize,
                    }}
                    dataSource={stafList.rows}
                    columns={employeeList}
                    scroll={{ x: 1300 }}
                    // loading={tableLoading}
                    // rowSelection={rowSelection}
                    onChange={this.staffTableChange}
                  />
                  {/* <div style={{ marginTop: -50 }}>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              key="0"
                              onClick={() => {
                                this.pldelInfo();
                              }}
                            >
                              删除
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <Button>批量操作</Button>
                      </Dropdown>
                    </div> */}
                </Card>
              </>
            )}
            {this.state.defaultActiveKey === '3' && (
              <>
                <Card title={false} style={{ paddingTop: 16 }}>
                  {this.addContacts()}
                  {this.contactsInfor()}
                  <Table
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
                </Card>
              </>
            )}
          </div>
        </div>
      </PageContainers>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ modify }) => ({
      modify,
    }))(Modify),
  ),
);

export default WrappedAdvancedSearchForm;

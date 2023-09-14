//新增、修改员工弹框
import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Table,
  TreeSelect,
  Modal,
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import moment from 'moment';
import Action from '@/utils/hocUtil';
import { handleValidator } from '@/utils/utils';
// import styles from './less/addEmployees.less';
import AddAccount from './addResume';
import { tableRowConfig } from '@/pages/investorReview/func';
// import staticInstance from '../../utils/staticInstance';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';
import styleSetPanel from '@/pages/operatingCalendar/setPanel/styleSetPanel';
import styles from '../index.less';
const { TextArea } = Input;

class addEmployee extends Component {
  state = {
    dataSource: [],
    // 判断是否置灰
    disabled: false,
    // 履历信息
    detailsList: [],
    count: 0,
    title: '新增',
    isShowAddAccount: false,
    editAccount: {},
    accountList: [],
    ascriptionOrg: '',
    department: [],
  };

  componentDidMount() {
    this.getCodes();
    if (this.props.record) this.getDetails();
    this.getPosition();
    this.getPositionType();
    this.departmentAPI(this.props.orgid);
    sessionStorage.setItem('keyValue', '2');
    const ascriptionOrg = sessionStorage.getItem('ascriptionOrg');
    this.setState({
      ascriptionOrg,
    });
    this.getDepartment();
  }

  // 字典
  getCodes() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getCodeLists',
      payload: ['J009', 'E002', 'J010', 'J008', 'certificateType', 'J010_6'],
    });
  }

  // 职务类型
  getPositionType() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getPositionType',
    });
  }

  // 获取岗位
  getPosition() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getPosition',
    });
  }

  // 详情
  getDetails() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'orgInfoManagement/getEmployDetails',
      payload: this.props.record && this.props.record.id,
    }).then(data => {
      const { detailsLists, department } = this.props.orgInfoManagement;
      this.setState({
        detailsList: detailsLists,
        accountList: detailsLists.executiveResume,
      });
    });
  }

  // 保存/修改
  getPreservation = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;

      const { dispatch, location } = this.props;
      // const values = this.props.form.getFieldsValue();
      values.executiveResume = this.state.accountList;
      if (values.positionStartDate)
        values.positionStartDate = moment(values.positionStartDate).format('YYYY-MM-DD');

      if (values.positionEndDate)
        values.positionEndDate = moment(values.positionEndDate).format('YYYY-MM-DD');

      if (this.props.record) values.id = Number(this.props.record.id);

      if (values.jobType) values.jobType = values.jobType[values.jobType.length - 1];

      if (values.orgId) values.orgId = this.props.orgid;
      values.oaEmployeeId = values.empNo;
      dispatch({
        type: 'orgInfoManagement/getPreservation',
        payload: values,
      }).then(data => {
        //调用父组件关闭弹框的方法
        this.props.onOk && this.props.onOk();
      });
    });
  };
  handleContactsCancel = () => {
    this.props.onOk && this.props.onOk();
  };

  // 回到修改页面
  goModify = () => {
    window.history.go(-1);
  };
  /**
   *
   * @method 树形节点部门信息
   */
  getDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getDepartment',
      // type: 'modify/superiorOrgList',
      payload: { needRoot: 1, orgId: this.props.orgid },
    }).then(data => {
      this.setState({
        loading: true,
      });
      if (data.status === 200) {
        const {
          orgInfoManagement: { department },
        } = this.props;
        this.setState({
          department,
        });
      }
    });
  };

  // 保存
  // preservation() {
  //   const { disabled } = this.state;
  //   const { location } = this.props;
  //   return (
  //     <Row>
  //       <Col span={24} style={{ textAlign: 'right', margin: '10px 0 15px 0' }}>
  //         {false ? (
  //           <Action code="institutionalInfoManager:staffSave">
  //             <Button
  //               type="primary"
  //               onClick={() => {
  //                 this.getPreservation();
  //               }}
  //             >
  //               修改
  //             </Button>
  //           </Action>
  //         ) : (
  //           <Action code="institutionalInfoManager:staffSave">
  //             <Button
  //               type="primary"
  //               onClick={() => {
  //                 this.getPreservation();
  //               }}
  //             >
  //               保存
  //             </Button>
  //           </Action>
  //         )}

  //         <Button
  //           onClick={() => {
  //             this.goModify();
  //           }}
  //           style={{ marginLeft: 10 }}
  //         >
  //           取消
  //         </Button>
  //       </Col>
  //     </Row>
  //   );
  // }

  // 长度校验
  handleNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '姓名长度过长');
  };

  handleLinkedValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '联系方式长度过长');
  };

  handleTopGraduateValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '最高毕业院校长度过长');
  };

  handleEmpNoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '员工编号长度过长');
  };

  handleMajorNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '专业名称长度过长');
  };

  handleOaEmployeeIdValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, 'OA员工长度过长');
  };

  handleCertificateNoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 40, '证件号码长度过长');
  };

  handleSeatNumberValidator = (rule, value, callback) => {
    if (!value) callback();
    const reg = /0\d{2,3}-\d{7,8}/;
    if (reg.test(value)) {
      handleValidator(value, callback, 20, '座机号长度过长');
    } else {
      callback('座机号格式不正确');
    }
  };

  handlePhoneNumberValidator = (rule, value, callback) => {
    handleValidator(value, callback, 20, '手机号长度过长');
  };

  handleVitaeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 4000, '履历长度过长');
  };

  handleOrgIdValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '所属机构长度过长');
  };
  handleOrgPhoneValidator = (rule, value, callback) => {
    let tempText;
    if (value) {
      tempText = value.replace(/\-|\——/g, '');
    } else {
      tempText = value;
    }
    const reg = /^\d+(\-|\——)\d+(\-|\——)\d+$/;
    if (/^\d+$/.test(tempText)) {
      // 是数字
      if (/\-|\——/.test(value)) {
        // 包含中划线是电话
        if (reg.test(value)) {
          handleValidator(tempText, callback, 11, '联系方式长度过长');
        } else {
          callback('请输入正确的联系方式');
        }
      } else {
        // 是手机号码
        handleValidator(tempText, callback, 11, '联系方式长度过长');
      }
    } else if (value) {
      callback('请输入数字');
    } else {
      callback();
    }
  };

  // 详细信息
  employeeDetails = () => {
    const { addEmployShow, record, dataSource, disabled, detailsList, ascriptionOrg } = this.state;
    const {
      orgInfoManagement: { codeList, employOrg },
      form: { getFieldDecorator },
    } = this.props;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const textAreaLayout = {
      labelAlign: 'right',
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
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
    let jobTypeArr = [];
    if (!!detailsList.jobTypePCode && !!detailsList.jobType) {
      jobTypeArr = [detailsList.jobTypePCode, detailsList.jobType];
    } else {
      jobTypeArr = [];
    }
    return (
      <Row>
        <Form {...layout}>
          <Col span={8}>
            <Form.Item label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detailsList.name,
                rules: [
                  {
                    required: true,
                    message: '姓名不可为空',
                  },
                  { validator: this.handleNameValidator },
                ],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请选择姓名" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="性别" {...formItemLayout}>
              {getFieldDecorator('sex', {
                initialValue: detailsList.sex,
                rules: [
                  {
                    required: true,
                    message: '性别不可为空',
                  },
                ],
              })(
                <Radio.Group disabled={disabled}>
                  <Radio value={0}>男</Radio>
                  <Radio value={1}>女</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="OA员工编号" {...formItemLayout}>
              {getFieldDecorator('empNo', {
                rules: [
                  {
                    required: true,
                    message: '员工编号不可为空',
                  },
                  { validator: this.handleEmpNoValidator },
                ],
                initialValue: detailsList.empNo,
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入员工编号" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属机构" {...formItemLayout}>
              {getFieldDecorator('orgId', {
                initialValue: this.props.orgName,
                rules: [
                  {
                    required: true,
                    message: '所属机构不可为空',
                  },
                  { validator: this.handleOrgIdValidator },
                ],
              })(<Input autoComplete="off" disabled />)}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="所属组织机构">
              {getFieldDecorator('orgId', {
                initialValue: this.props.orgid,
                rules: [
                  {
                    required: true,
                    message: '所属组织机构不可为空',
                  },
                ],
              })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.department}
                  // placeholder="请选择所属组织机构"
                  disabled={true}
                  treeDefaultExpandAll
                  // onChange={this.onChange}
                />,
              )}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="员工角色" {...formItemLayout}>
              {getFieldDecorator('roleCode', {
                rules: [
                  {
                    required: true,
                    message: '员工角色不可为空',
                  },
                ],
                initialValue: detailsList.roleCode,
              })(
                <Select showSearch placeholder="请选择员工角色" showArrow={false}>
                  {codeList &&
                    codeList.E002 &&
                    codeList.E002.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="归属部门" {...formItemLayout}>
              {getFieldDecorator('depId', {
                initialValue: detailsList.depId,
                rules: [
                  {
                    required: true,
                    message: '归属部门不可为空',
                  },
                ],
              })(
                <TreeSelect
                  // style={{ width: '100%' }}
                  // value={SuperiorOrgs}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={employOrg}
                  placeholder="请选择归属部门"
                  treeDefaultExpandAll
                  // onChange={this.onChange}
                  showSearch
                  treeNodeFilterProp="title"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系方式" {...formItemLayout}>
              {getFieldDecorator('phoneNumber', {
                rules: [
                  {
                    required: true,
                    message: '联系方式不可为空',
                  },
                  { validator: this.handleOrgPhoneValidator },
                ],
                initialValue: detailsList.phoneNumber,
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入联系方式" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱" {...formItemLayout}>
              {getFieldDecorator('mailbox', {
                initialValue: detailsList.mailbox,
                rules: [
                  {
                    required: true,
                    message: '邮箱不可为空',
                  },
                  {
                    type: 'email',
                    message: '请正确填写邮箱',
                  },
                ],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入邮箱" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="是否在职" {...formItemLayout}>
              {getFieldDecorator('isOnJob', {
                initialValue: detailsList.isOnJob,
              })(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="任职开始日期" {...formItemLayout}>
              {getFieldDecorator('positionStartDate', {
                initialValue:
                  this.props.record && detailsList.positionStartDate
                    ? moment(detailsList.positionStartDate)
                    : null,
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="任职结束日期" {...formItemLayout}>
              {getFieldDecorator('positionEndDate', {
                initialValue:
                  this.props.record && detailsList.positionStartDate
                    ? moment(detailsList.positionEndDate)
                    : null,
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="证件类型" {...formItemLayout}>
              {getFieldDecorator('certificateType', {
                initialValue: detailsList.certificateType,
              })(
                <Select
                  showSearch
                  disabled={disabled}
                  placeholder="请选择证件类型"
                  showArrow={false}
                >
                  {codeList &&
                    codeList.certificateType &&
                    codeList.certificateType.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="证件号码" {...formItemLayout}>
              {getFieldDecorator('certificateNo', {
                initialValue: detailsList.certificateNo,
                rules: [{ validator: this.handleCertificateNoValidator }],
              })(<Input autoComplete="off" placeholder="请输入证件号码" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="座机号" {...formItemLayout}>
              {getFieldDecorator('seatNumber', {
                initialValue: detailsList.seatNumber,
                rules: [{ validator: this.handleSeatNumberValidator }],
              })(<Input autoComplete="off" placeholder="请输入座机号" />)}
            </Form.Item>
          </Col>

          <Col md={24}>
            <h3>学历信息</h3>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="最高毕业院校：" {...formItemLayout}>
              {getFieldDecorator('highestEducation', {
                initialValue: detailsList.highestEducation,
              })(
                <Select
                  showSearch
                  disabled={disabled}
                  placeholder="请选择最高毕业院校"
                  showArrow="false"
                >
                  {codeList?.J009?.map(item => (
                    <Select.Option key={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="最高毕业院校" {...formItemLayout}>
              {getFieldDecorator('topGraduate', {
                initialValue: detailsList.topGraduate,
                rules: [{ validator: this.handleTopGraduateValidator }],
              })(<Input autoComplete="off" placeholder="请输入最高毕业院校" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="专业名称" {...formItemLayout}>
              {getFieldDecorator('majorName', {
                initialValue: detailsList.majorName,
                rules: [{ validator: this.handleMajorNameValidator }],
              })(<Input autoComplete="off" placeholder="请输入专业名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="最高学位" {...formItemLayout}>
              {getFieldDecorator('highestDegree', {
                initialValue: detailsList.highestDegree,
              })(
                <Select showSearch placeholder="请选择职务类型" showArrow={false}>
                  {codeList &&
                    codeList.J008 &&
                    codeList.J008.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="最高学历：" {...formItemLayout}>
              {getFieldDecorator('highestEducation', {
                initialValue: detailsList.highestEducation,
              })(
                <Select
                  showSearch
                  disabled={disabled}
                  placeholder="请选择最高学历"
                  showArrow={false}
                >
                  {codeList?.J009?.map(item => (
                    <Select.Option key={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col md={24}>
            <h3>履历信息</h3>
          </Col>
        </Form>
      </Row>
    );
  };

  onShowAddAccount = data => {
    this.setState({
      editAccount: data || {},
      isShowAddAccount: true,
    });
  };

  setAccountList = data => {
    const { accountList } = this.state;
    const tempList = JSON.parse(JSON.stringify(accountList));
    if (data && data.indexId) {
      for (let index = 0; index < tempList.length; index++) {
        if (tempList[index].indexId === data.indexId) {
          tempList[index] = data;
        }
        tempList[index].index = index + 1;
      }
    } else if (data) {
      // debugger;
      tempList.push({
        ...data,
        index: tempList.length + 1,
        indexId: +new Date(),
      });
    }
    this.setState({
      accountList: tempList,
      isShowAddAccount: false,
    });
  };

  delAccountList = index => {
    const { accountList } = this.state;
    accountList.splice(index, 1);
    this.setState({
      accountList,
    });
  };

  // 部门
  departmentAPI(orgId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getEmployOrg',
      payload: orgId,
    });
  }

  // 归属部门
  getdepId = (item, key) => {
    let arr = [];
    function depIdFilter(item) {
      item.forEach(item => {
        if (item.value === key) {
          arr = [{ code: item.value, name: item.title }];
        }
        if (item.children) {
          depIdFilter(item.children, key);
        }
      });
    }
    depIdFilter(item);
    return arr;
  };

  render() {
    const { dataSource, disabled, detailsList, accountList, title } = this.state;
    const { addContactsShow = false } = this.props;
    const {
      orgInfoManagement: { codeList, TreeSelect, employOrg },
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        ...tableRowConfig,
        align: 'right',
        sorter: false,
      },
      {
        title: '任职公司名称',
        dataIndex: 'orgName',
        editable: true,
        ...tableRowConfig,
        width: 400,
        sorter: false,
      },
      {
        title: '任职部门',
        dataIndex: 'department',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '担任职位',
        dataIndex: 'heldPosition',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '任职开始日期',
        dataIndex: 'positionStartDate',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '任职结束日期',
        dataIndex: 'positionEndDate',
        width: 200,
        editable: true,
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'opt',
        render: (text, record, index) => (
          <span className={this.props.detailsFlag ? styles.displaynone : styles.displayblock}>
            <a
              onClick={() => {
                this.onShowAddAccount(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.delAccountList(index);
              }}
            >
              删除
            </a>
          </span>
        ),
      },
    ];
    const drawerConfig = info => {
      return [
        { label: '姓名', value: 'name' },
        {
          label: '性别',
          value: 'sex',
          type: 'select',
          option: [
            { name: '女', code: '1' },
            { name: '男', code: '0' },
          ],
        },
        {
          label: 'OA员工编号',
          value: 'empNo',
        },
        {
          label: '所属组织机构',
          value: 'orgId',
          type: 'select',
          option: [{ code: this.props.orgid, name: this.props.orgName }],
          // optionConfig: { name: 'orgName', code: 'id' },
        },
        {
          label: '员工角色',
          value: 'roleCode',
          type: 'multiple',
          option: codeList.E002,
        },
        {
          label: '归属部门',
          value: 'depId',
          type: 'select',
          option:
            this.state.detailsList.depId && this.getdepId(employOrg, this.state.detailsList.depId),
        },
        { label: '联系方式', value: 'linked' },
        { label: '邮箱', value: 'mailbox' },
        {
          label: '是否在职',
          value: 'isOnJob',
          type: 'select',
          option: [
            { name: '是', code: '1' },
            { name: '否', code: '0' },
          ],
        },
        { label: '任职开始日期', value: 'positionStartDate' },
        { label: '任职结束日期', value: 'positionEndDate' },
        {
          label: '证件类型',
          value: 'certificateType',
          type: 'multiple',
          option: codeList.certificateType,
        },
        { label: '证件号码', value: 'certificateNo' },
        { label: '座机号', value: 'seatNumber' },
        { label: '最高毕业院校', value: 'topGraduate' },
        { label: '专业名称', value: 'majorName' },
        { label: '最高学位', value: 'highestDegree', type: 'multiple', option: codeList.J008 },
        { label: '最高学历', value: 'highestEducation', type: 'multiple', option: codeList.J009 },
      ];
    };
    return (
      <Modal
        className={styles.addemployee}
        title={this.props.record ? (this.props.detailsFlag ? '查看' : '修改') : '新增'}
        visible={addContactsShow}
        onOk={() => this.getPreservation()}
        onCancel={this.handleContactsCancel}
        width={1500}
        afterClose={this.afterClose}
        okButtonProps={{ disabled: this.props.detailsFlag }}
        // cancelButtonProps={{ disabled: buttonDisabled }}
      >
        <Row>
          {/* <Card extra={disabled ? this.goBack() : this.preservation()}> */}
          <div className={this.props.detailsFlag ? styles.divbox1 : styles.divbox2}>
            {this.props.detailsFlag ? (
              <Gird config={drawerConfig(detailsList)} info={detailsList} />
            ) : (
              this.employeeDetails()
            )}

            {!this.props.detailsFlag && (
              <div className={styles.addbtn}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.onShowAddAccount();
                  }}
                >
                  新增
                </Button>
              </div>
            )}

            <Table
              rowKey={record => record.id}
              columns={columns}
              scroll={{ x: columns.length * 200 + 200 }}
              dataSource={accountList}
            />
            <AddAccount
              isShowAddAccount={this.state.isShowAddAccount}
              updateAccountList={this.setAccountList}
              editAccount={this.state.editAccount}
            />
          </div>
          {/* </Card> */}
        </Row>
      </Modal>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(addEmployee),
  ),
);

export default WrappedAdvancedSearchForm;

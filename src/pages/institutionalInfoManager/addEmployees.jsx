import React, { Component } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
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
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import moment from 'moment';
import Action from '@/utils/hocUtil';
import { handleValidator } from '@/utils/utils';
import styles from './less/addEmployees.less';
import AddAccount from './addResume';
import { tableRowConfig } from '@/pages/investorReview/func';

// import staticInstance from '../../utils/staticInstance';

class addEmployees extends Component {
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
  };

  componentDidMount() {
    this.getCodes();
    this.getDetails();
    this.getPosition();
    this.getPositionType();
    this.departmentAPI(sessionStorage.getItem('id'));
    sessionStorage.setItem('keyValue', '2');
    const ascriptionOrg = sessionStorage.getItem('ascriptionOrg');
    this.setState({
      ascriptionOrg,
    });
  }

  // 字典
  getCodes() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addEmployees/getCodeList',
      payload: ['J009', 'E002', 'J010', 'J008', 'certificateType', 'J010_6'],
    });
  }

  // 职务类型
  getPositionType() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addEmployees/getPositionType',
    });
  }

  // 获取岗位
  getPosition() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addEmployees/getPosition',
    });
  }

  // 详情
  getDetails() {
    const { dispatch, location } = this.props;
    if (
      location.query.type &&
      (location.query.type === 'details' || location.query.type === 'modify')
    ) {
      dispatch({
        type: 'addEmployees/getDetails',
        payload: location.query.id,
      }).then(() => {
        const { detailsLists } = this.props.addEmployees;
        this.setState({
          detailsList: detailsLists,
          accountList: detailsLists.executiveResume,
        });
      });
    }
    if (location.query.type && location.query.type === 'details') {
      this.setState({
        disabled: true,
        title: '查看',
      });
    }
    if (location.query.type && location.query.type === 'modify') {
      this.setState({
        title: '修改',
      });
    }
  }

  // 保存/修改
  getPreservation = () => {
    this.props.form.validateFieldsAndScroll((err, options) => {
      if (err) return;
      const values = options;
      const { dispatch, location } = this.props;
      // const values = this.props.form.getFieldsValue();
      values.executiveResume = this.state.accountList;
      if (values.positionStartDate)
        values.positionStartDate = moment(values.positionStartDate).format('YYYY-MM-DD');

      if (values.positionEndDate)
        values.positionEndDate = moment(values.positionEndDate).format('YYYY-MM-DD');

      if (location.query.id) values.id = Number(location.query.id);

      if (values.jobType) values.jobType = values.jobType[values.jobType.length - 1];

      if (values.orgId) values.orgId = sessionStorage.getItem('id');

      dispatch({
        type: 'addEmployees/getPreservation',
        payload: {
          ...values,
          empNo: values.oaEmployeeId, // OA员工编号和员工编号相同，删除了员工编号表单项
        },
      }).then(data => {
        if (data) {
          window.history.go(-1);
        }
      });
    });
  };

  // 回到修改页面
  goModify = () => {
    window.history.go(-1);
  };

  // handleDelete = key => {
  //   const dataSource = [...this.state.dataSource];
  //   this.setState({
  //     dataSource: dataSource.filter(item => item.key !== key),
  //   });
  // };

  // handleAdd = () => {
  //   const { count, dataSource } = this.state;
  //   const newData = {
  //     key: count,
  //     orgName: '',
  //     department: '',
  //     heldPosition: '',
  //     positionStartDate: '',
  //     positionEndDate: '',
  //   };
  //   this.setState({
  //     dataSource: [...dataSource, newData],
  //     count: count + 1,
  //   });
  // };

  // handleSave = row => {
  //   const newData = [...this.state.dataSource];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   this.setState({ dataSource: newData });
  // };

  titleNav = () => {
    const { title } = this.state;
    return (
      <Breadcrumb style={{ marginButtom: 10 }}>
        <Breadcrumb.Item>员工管理</Breadcrumb.Item>
        <Breadcrumb.Item>{title}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  // 保存
  preservation() {
    const { location } = this.props;
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'right', margin: '10px 0 15px 0' }}>
          {location.query.type && location.query.type === 'modify' ? (
            <Action code="institutionalInfoManager:staffSave">
              <Button
                type="primary"
                onClick={() => {
                  this.getPreservation();
                }}
              >
                修改
              </Button>
            </Action>
          ) : (
            <Action code="institutionalInfoManager:staffSave">
              <Button
                type="primary"
                onClick={() => {
                  this.getPreservation();
                }}
              >
                保存
              </Button>
            </Action>
          )}

          <Button
            onClick={() => {
              this.goModify();
            }}
            style={{ marginLeft: 10 }}
          >
            取消
          </Button>
        </Col>
      </Row>
    );
  }

  // 返回
  goBack = () => {
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'right', marginBottom: 20 }}>
          <Button type="primary" onClick={this.goBackAPI}>
            返回
          </Button>
        </Col>
      </Row>
    );
  };

  goBackAPI = () => {
    // const { dispatch } = this.props;
    // dispatch(
    //   routerRedux.push({
    //     pathname: '/productDataManage/institutionalInfoManager/index/modify',
    //   }),
    // );
    window.history.go(-1);
  };

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

  // 详细信息
  employeeDetails = () => {
    const { disabled, detailsList } = this.state;
    const {
      addEmployees: { codeList, department },
      form: { getFieldDecorator },
      location,
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
          {/* <Col span={8}>
            <Form.Item label="员工编号" {...formItemLayout}>
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
          </Col> */}
          <Col span={8}>
            <Form.Item label="OA员工编号" {...formItemLayout}>
              {getFieldDecorator('oaEmployeeId', {
                rules: [
                  { required: true, message: '请输入OA员工编号' },
                  { validator: this.handleOaEmployeeIdValidator },
                ],
                initialValue: detailsList.oaEmployeeId,
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入OA员工编号" />)}
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
                <Select
                  showSearch
                  disabled={disabled}
                  placeholder="请选择员工角色"
                  showArrow="false"
                >
                  {codeList &&
                    codeList.E002 &&
                    codeList.E002.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="联系方式" {...formItemLayout}>
              {getFieldDecorator('linked', {
                rules: [
                  {
                    required: true,
                    message: '联系方式不可为空',
                  },
                ],
                initialValue: detailsList.linked,
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入联系方式" />)}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="联系方式" {...formItemLayout}>
              {getFieldDecorator('phoneNumber', {
                initialValue: detailsList.phoneNumber,
                rules: [
                  { required: true, message: '请输入联系方式' },
                  {
                    pattern: /(^1[0-9]{10}$)|(^\+\d{13}$)/,
                    message: '请输入正确的联系方式',
                  },
                  { validator: this.handlePhoneNumberValidator },
                ],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入联系方式" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属机构" {...formItemLayout}>
              {getFieldDecorator('orgId', {
                initialValue: sessionStorage.getItem('orgName'),
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
                  treeData={department}
                  placeholder="请选择归属部门"
                  treeDefaultExpandAll
                  disabled={disabled}
                  // onChange={this.onChange}
                  showSearch
                  treeNodeFilterProp="title"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否在职" {...formItemLayout}>
              {getFieldDecorator('isOnJob', {
                initialValue: detailsList.isOnJob,
              })(
                <Radio.Group disabled={disabled}>
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
                  disabled || location?.query?.type === 'modify'
                    ? moment(detailsList.positionStartDate)
                    : '',
              })(<DatePicker disabled={disabled} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="任职结束日期" {...formItemLayout}>
              {getFieldDecorator('positionEndDate', {
                initialValue:
                  disabled || (location.query.type && location.query.type === 'modify')
                    ? moment(detailsList.positionEndDate)
                    : '',
              })(<DatePicker disabled={disabled} />)}
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
                  showArrow="false"
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
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入证件号码" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="座机号" {...formItemLayout}>
              {getFieldDecorator('seatNumber', {
                initialValue: detailsList.seatNumber,
                rules: [{ validator: this.handleSeatNumberValidator }],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入座机号" />)}
            </Form.Item>
          </Col>
          <Col md={24}>
            <h3>履历信息</h3>
          </Col>
          <Col span={8}>
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
          </Col>
          <Col span={8}>
            <Form.Item label="最高毕业院校" {...formItemLayout}>
              {getFieldDecorator('topGraduate', {
                initialValue: detailsList.topGraduate,
                rules: [{ validator: this.handleTopGraduateValidator }],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入最高毕业院校" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="专业名称" {...formItemLayout}>
              {getFieldDecorator('majorName', {
                initialValue: detailsList.majorName,
                rules: [{ validator: this.handleMajorNameValidator }],
              })(<Input autoComplete="off" disabled={disabled} placeholder="请输入专业名称" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="最高学位" {...formItemLayout}>
              {getFieldDecorator('highestDegree', {
                initialValue: detailsList.highestDegree,
              })(
                <Select
                  showSearch
                  disabled={disabled}
                  placeholder="请选择职务类型"
                  showArrow="false"
                >
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
                  showArrow="false"
                >
                  {codeList?.J009?.map(item => (
                    <Select.Option key={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
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
      type: 'addEmployees/getDepartment',
      payload: orgId,
    });
  }

  render() {
    const { dataSource, disabled, detailsList, accountList } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        ...tableRowConfig,
        align: 'right',
      },
      {
        title: '任职公司名称',
        dataIndex: 'orgName',
        editable: true,
        ...tableRowConfig,
        width: 400,
      },
      {
        title: '任职部门',
        dataIndex: 'department',
        width: 200,
        editable: true,
        ...tableRowConfig,
      },
      {
        title: '担任职位',
        dataIndex: 'heldPosition',
        width: 200,
        editable: true,
        ...tableRowConfig,
      },
      {
        title: '任职开始日期',
        dataIndex: 'positionStartDate',
        width: 200,
        editable: true,
        ...tableRowConfig,
      },
      {
        title: '任职结束日期',
        dataIndex: 'positionEndDate',
        width: 200,
        editable: true,
        ...tableRowConfig,
      },
      {
        title: '操作',
        key: 'opt',
        render: (text, record, index) => (
          <span style={{ display: disabled ? 'none' : 'block' }}>
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
    // const components = {
    //   body: {
    //     row: EditableFormRow,
    //     cell: EditableCell,
    //   },
    // };
    // const columns = this.columns.map(col => {
    //   if (!col.editable) {
    //     return col;
    //   }
    //   return {
    //     ...col,
    //     onCell: record => ({
    //       record,
    //       editable: col.editable,
    //       dataIndex: col.dataIndex,
    //       title: col.title,
    //       handleSave: this.handleSave,
    //     }),
    //   };
    // });
    return (
      <Row className={styles.content}>
        <Card>
          {this.titleNav()}
          {disabled ? this.goBack() : this.preservation()}
          <div
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 240px)',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            {this.employeeDetails()}
            <div
              style={{ textAlign: 'right', marginBottom: 12, display: disabled ? 'none' : 'block' }}
            >
              <Button type="primary" onClick={() => this.onShowAddAccount()}>
                新增
              </Button>
            </div>

            <Table
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
        </Card>
      </Row>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ addEmployees, loading }) => ({
      addEmployees,
    }))(addEmployees),
  ),
);

export default WrappedAdvancedSearchForm;

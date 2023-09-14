import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import { isEmptyObject } from '@/utils/utils';
import styles from './addMember.less';
import { setSession } from '@/utils/session';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

const dirCode = 'attributionSystem,SysUserType,authorizationStrategy';

@Form.create()
@connect(({ memberManagement, loading }) => ({
  memberManagement,
  loading: loading.effects['memberManagement/handleGetDictList'],
  infoLoading: loading.effects['memberManagement/handleMobileQueryInfo'],
}))
export default class SelectionAgency extends Component {
  state = {
    data: [],
    value: 1,
    user: false,
    disabled: false,
  };

  componentDidMount() {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    this.props.save(this);

    // 归属系统词汇
    dispatch({
      type: 'memberManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });

    // 所属部门
    dispatch({
      type: 'memberManagement/handleGetDept',
      payload: {
        orgId: saveOrgId,
        orgKind: 2,
      },
    });
  }

  showConfirm = () => {
    const {
      dispatch,
      memberManagement: { saveMobileQueryInfo },
      form: { setFieldsValue, resetFields },
    } = this.props;

    const info = saveMobileQueryInfo[0];
    const { username, type, email, usercode, sysId, oaUsernum, deptId } = info;
    const sysIdArr = sysId?.split(',');
    // const deptIdArr = deptId?.split(',');
    confirm({
      title: '此手机号已存在于系统库中，用户的基本信息已自动补全，请确认是否复用?',
      cancelText: '重新输入',
      okText: '确定',
      onOk: () => {
        this.setState({
          disabled: true,
        });
        setFieldsValue({
          username,
          type,
          email,
          usercode,
          oaUsernum,
          deptId,
          sysId: sysIdArr,
        });
      },
      onCancel: () => {
        this.setState({
          disabled: false,
        });
        resetFields();
        dispatch({
          type: `memberManagement/handleCleanMobileQueryInfo`,
        });
      },
    });
  };

  handleShow = () => {
    const {
      memberManagement: { saveMobileQueryInfo },
    } = this.props;
    if (!isEmptyObject(saveMobileQueryInfo)) {
      this.showConfirm();
    }
  };

  validateUserCode = (rule, value, callback) => {
    const patrn = /^[\da-z]+$/im;
    if (patrn.test(value)) {
      callback();
      return;
    }
    callback('请输入正确登录名,仅限数字及字母');
  };

  validateUserName = (rule, value, callback) => {
    const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (!patrn.test(value)) {
      callback();
      return;
    }
    callback('请输入正确用户名,不包能含特殊字符');
  };

  // 基本信息
  baseInfo = () => {
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
      form: { getFieldDecorator },
      memberManagement: {
        saveDictList: { SysUserType },
        saveGetDept,
        saveInfo,
      },
      infoLoading,
    } = this.props;
    return (
      <>
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.basic}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem
                  label="手机号码"
                  {...formItemLayout}
                  help="我们将对您填写的手机号进行校验，会确保是唯一项"
                  hasFeedback
                >
                  {getFieldDecorator('mobile', {
                    initialValue: saveInfo.mobile,
                    rules: [
                      {
                        pattern: new RegExp(/^(1[0-9])\d{9}$/),
                        message: '请输入正确手机号码',
                      },
                      { required: true, message: '请输入手机号码' },
                    ],
                  })(
                    <Input
                      placeholder="请输入"
                      onChange={this.handleMobileOnly}
                      disabled={false}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Card>
        <Divider dashed />
        <Card style={{ marginBottom: 24 }} bordered={false} loading={infoLoading}>
          <div className={styles.basic}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    initialValue: saveInfo.username,
                    rules: [
                      { validator: this.validateUserName },
                      { required: true, message: '请输入用户名' },
                      { max: 20, message: '不能超过20个字符' },
                    ],
                  })(<Input placeholder="请输入" disabled={this.state.disabled} />)}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="登录名" {...formItemLayout}>
                  {getFieldDecorator('usercode', {
                    initialValue: saveInfo.usercode,
                    rules: [
                      { validator: this.validateUserCode },
                      { required: true, message: '请输入登录名' },
                      { max: 20, message: '不能超过20个字符' },
                    ],
                  })(<Input placeholder="请输入" disabled={this.state.disabled} />)}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="用户类型" {...formItemLayout}>
                  {getFieldDecorator('type', {
                    initialValue: saveInfo.type,
                    rules: [{ required: true, message: '请选择用户类型' }],
                  })(
                    <Select
                      style={{ minWidth: '100%' }}
                      placeholder="请选择"
                      disabled={this.state.disabled}
                    >
                      {SysUserType &&
                        SysUserType.map(i => {
                          return (
                            <Option key={i.code} value={i.code}>
                              {i.name}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="电子邮箱" {...formItemLayout}>
                  {getFieldDecorator('email', {
                    initialValue: saveInfo.email,
                    rules: [
                      {
                        type: 'email',
                        message: '输入的信息不是有效的电子邮箱',
                      },
                      {
                        required: true,
                        message: '请输入电子邮箱',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled={this.state.disabled} />)}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="所属部门" {...formItemLayout}>
                  {getFieldDecorator('deptId', {
                    initialValue: saveInfo.deptId,
                  })(
                    <Select
                      style={{ minWidth: '100%' }}
                      disabled={this.state.disabled}
                      placeholder="请选择"
                    >
                      {saveGetDept &&
                        saveGetDept.map(i => {
                          return (
                            <Option key={i.id} value={i.id}>
                              {i.orgName}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="员工编号" {...formItemLayout}>
                  {getFieldDecorator('oaUsernum', {
                    initialValue: saveInfo.oaUsernum,
                  })(<Input placeholder="请输入" disabled={this.state.disabled} />)}
                </FormItem>
              </Col>
              {/*              <Col md={12} sm={24}>
                <FormItem label="归属系统" {...formItemLayout}>
                  {getFieldDecorator('sysId', {
                    initialValue: saveInfo?.sysId?.split(','),
                    rules: [{ required: true, message: '请选择用户归属系统' }],
                  })(
                    <Checkbox.Group>
                      {attributionSystem &&
                        attributionSystem.map(i => {
                          return (
                            <Checkbox disabled={i.code === '0'} key={i.code} value={i.code}>
                              {i.name}
                            </Checkbox>
                          );
                        })}
                    </Checkbox.Group>,
                  )}
                </FormItem>
              </Col> */}
            </Row>
          </div>
        </Card>
      </>
    );
  };

  handleMobileOnly = e => {
    const { dispatch } = this.props;
    const { value } = e.target;
    if (value.length === 11) {
      dispatch({
        type: `memberManagement/handleMobileQueryInfo`,
        payload: value,
      }).then(res => {
        if (res.status === 200 && res.message === 'success' && res?.data?.length !== 0) {
          this.handleShow();
        }
      });
    } else {
      this.setState({
        disabled: false,
      });
    }
  };

  // 保存第二步用户信息
  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
      memberManagement: {
        saveCurrent,
        saveOrgId,
        saveMobileQueryInfo,
        saveDictList: { attributionSystem },
      },
    } = this.props;
    const attributionSystemCode = [];
    attributionSystem?.forEach(item => {
      attributionSystemCode.push(item.code);
    });

    const { disabled } = this.state;
    let id;
    let userCode;
    validateFields((err, values) => {
      id = (saveMobileQueryInfo[0] && saveMobileQueryInfo[0].id) || '';
      values.sysId = attributionSystemCode?.join();
      userCode = values.usercode;
      if (!err) {
        // 保存用户信息
        dispatch({
          type: `memberManagement/handleSaveInfo`,
          payload: {
            values,
            current: saveCurrent,
            disabled,
          },
        });
        dispatch({
          type: `memberManagement/saveMobileQueryInfo`,
          payload: {
            values,
          },
        });

        const firstSysId = values.sysId.split(',')[0];
        // 获取数据包
        dispatch({
          type: `orgAuthorize/queAllData`,
          payload: {
            orgAuthedId: saveOrgId,
            userAuthedId: id,
            sysId: firstSysId,
          },
        });

        // 获 ‘排在第一个位置系统’id，请求 权限树
        dispatch({
          type: 'role/init',
          payload: firstSysId,
        });
        setSession('sysId', values.sysId);
        dispatch({
          type: 'role/getEmptyRole',
        });
      }
    });
  };

  render() {
    const { loading } = this.props;
    return (
      <Card bordered={false} loading={loading}>
        <div className={styles.content}>{this.baseInfo()}</div>
      </Card>
    );
  }
}

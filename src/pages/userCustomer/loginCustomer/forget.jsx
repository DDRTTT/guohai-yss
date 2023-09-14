import { Alert, Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import LoginComponents from '../components/Login';
import styles from './style.less';
import { removeAuthToken } from '@/utils/session';
import customerPic from '@/assets/login/customer_pic.png';
import { encryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

const { Password, Captcha, Mobile, Submit, Tab, IdNo, Cancel } = LoginComponents;
const { TabPane } = Tabs;
const FormItem = Form.Item;

@Form.create()
class Forget extends Component {
  loginForm = undefined;

  state = {
    type: 'account', // account, mobile
    autoLogin: true,
    modalShow: false,
    updatePasswordButtonLoading: false,
    oldPassword: '',
    hasicon: 'false',
    mobile: '',
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          const val = {
            scene: 'DLYZM',
            mobile: values.mobile,
            flag: 1, // 要求先验证手机号是否已经存在了
          };
          try {
            await dispatch({
              type: 'loginCustomer/getFakeCaptchaCode',
              payload: val,
              callback: () => {
                resolve();
              },
            });
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  handleCheckPassowrd = (rule, value, callback) => {
    const password1 = this.props.form.getFieldValue('password1');
    const password2 = this.props.form.getFieldValue('password2');
    if (password1 && password1 !== password2) {
      callback(new Error('两次密码输入不一致'));
    } else {
      callback();
    }
  };
  // 修改密码
  handleCanUpdatePassowrd = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ updatePasswordButtonLoading: true });
        this.props.dispatch({
          type: 'loginCustomer/handleForgotPasswordFunc',
          payload: {
            mobile: encryptText(this.state.mobile, ENCRYPTED_PASSWORD()),
            password: encryptText(values.password2, ENCRYPTED_PASSWORD()),
          },
          callback1: () => {
            this.setState({ modalShow: false });
            removeAuthToken();
            // 跳到登录页
            this.props.history.push({ pathname: '/userCustomer/login' });
          },
          callback2: () => this.setState({ updatePasswordButtonLoading: false }),
        });
      }
    });
  };

  hasErrors(fieldsError, values) {
    return !(
      !Object.keys(fieldsError).some(field => fieldsError[field]) &&
      values.password1 !== undefined &&
      values.password2 !== undefined
    );
  }

  // 修改密码弹出框
  handleAddModal = () => {
    const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form;
    return (
      <Modal
        onCancel={() => [this.setState({ modalShow: false }), removeAuthToken()]}
        footer={null}
        centered
        destroyOnClose
        width="600px"
        // height="800px"
        className={styles.pwdbox}
        visible={this.state.modalShow}
      >
        <div className={styles.pwdcontent}>
          <p className={styles.updatePwdTitle}>修改密码</p>
          <Form onSubmit={this.handleCanUpdatePassowrd}>
            <FormItem className={styles.f1}>
              {getFieldDecorator('password1', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                  {
                    pattern: '^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?!.*[~!@%#$^&*=|{};\\[\\]<>《》?·~！@#￥……&*——|{}【】；。？]).{8,15}$',
                    message: '请按照规则输入密码 : 8-15位 (只能是大写字母+小写字母+数字) ',
                  },
                ],
              })(
                <Input.Password
                  placeholder="新密码：8-15位 (只能是大写字母+小写字母+数字) "
                  className={styles.i1}
                />,
              )}
            </FormItem>
            <FormItem className={styles.f2}>
              {getFieldDecorator('password2', {
                rules: [
                  {
                    required: true,
                    message: '请输入再次新密码',
                  },
                  {
                    validator: (rule, value, callback) => {
                      this.handleCheckPassowrd(rule, value, callback);
                    },
                  },
                ],
              })(<Input.Password placeholder="确认新密码" className={styles.i1} />)}
            </FormItem>
            <Button
              htmlType="submit"
              loading={this.state.updatePasswordButtonLoading}
              disabled={this.hasErrors(getFieldsError(), getFieldsValue())}
              className={styles.b1}
            >
              确&nbsp;认&nbsp;修&nbsp;改
            </Button>
          </Form>
        </div>
      </Modal>
    );
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const val = {
        // idNo: encryptText(values.idNo, ENCRYPTED_PASSWORD()),
        mobile: values.mobile,
        code: values.captcha,
      };
      dispatch({
        type: 'loginCustomer/handleForgotPassword',
        payload: {
          ...val,
        },
        callback: () => {
          this.setState({ modalShow: true, mobile: values.mobile });
        },
      });
    }
  };

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, hasicon } = this.state;
    return (
      <div className={styles.main}>
        {this.handleAddModal()}
        <div className={styles.content}>
          {/* <img src={customerPic} /> */}
          <div className={styles.loginBox}>
            <div>
              <LoginComponents
                className={styles.loginCom}
                defaultActiveKey="forget"
                onTabChange={this.onTabChange}
                onSubmit={this.handleSubmit}
                onCreate={form => {
                  this.loginForm = form;
                }}
              >
                <Tab key="forget" tab="忘记密码">
                  <div>
                    {status === 'error' &&
                      loginType === 'account' &&
                      !submitting &&
                      this.renderMessage('账户或密码错误（admin/ant.design）')}

                    {/* <IdNo
                                name="idNo"
                                placeholder={`请输入${'身份证号'}`}
                                hasicon={hasicon}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入身份证号',
                                    },
                                    {
                                        pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                                        message: '身份证号码格式错误',
                                    }
                                ]}
                            /> */}
                    <Mobile
                      name="mobile"
                      placeholder="请输入手机号"
                      hasicon={hasicon}
                      rules={[
                        {
                          required: true,
                          message: '请输入手机号',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '手机号格式错误',
                        },
                      ]}
                    />
                    <Captcha
                      name="captcha"
                      placeholder="请输入验证码"
                      hasicon={hasicon}
                      countDown={60}
                      onGetCaptcha={this.onGetCaptcha}
                      getCaptchaButtonText="获取验证码"
                      getCaptchaSecondText="秒"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                      ]}
                    />
                  </div>
                  <Submit loading={submitting} className={styles.btn}>
                    确定
                  </Submit>
                  <Cancel
                    className={styles.cancel}
                    onClick={() => {
                      this.props.history.push({ pathname: '/userCustomer/login' });
                    }}
                  >
                    取消
                  </Cancel>
                </Tab>
              </LoginComponents>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['loginCustomer/login'],
}))(Forget);

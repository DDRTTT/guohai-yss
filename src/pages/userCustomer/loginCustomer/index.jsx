import { Alert, Button, Form, Input, Modal, Tabs, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import LoginComponents from '../components/Login';
import styles from './style.less';
import { removeAuthToken } from '@/utils/session';
import customerPic from '@/assets/login/customer_pic.png';
import { encryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

const { UserName, Password, Submit, Tab, Captcha, Mobile, Verificode } = LoginComponents;
const { TabPane } = Tabs;

@Form.create()
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account', // account, mobile
    autoLogin: true,
    modalShow: false,
    hasicon: 'false',
    originalVerificode: '',
    verificodeRef: undefined,
    // oldPassword: '',
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
            mobile: values.mobile,
            scene: 'DLYZM',
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

  getOriginalVerificode = value => {
    if (value) {
      this.setState({ originalVerificode: value });
    }
  };
  handleCheckVerificode = (rule, value, callback) => {
    // console.log('verificode===',  value);
    // console.log('originalVerificode===', this.state.originalVerificode);
    // const verificode = this.props.form.getFieldValue('verificode');
    if (value && value !== this.state.originalVerificode) {
      callback(new Error('验证码错误'));
    } else {
      callback();
    }
  };
  onTabChange = type => {
    this.setState({
      type,
    });
  };
  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      let val = undefined;
      if (this.state.type === 'account') {
        val = {
          username: encryptText(values.userName, ENCRYPTED_PASSWORD()),
          password: encryptText(values.password, ENCRYPTED_PASSWORD()),
          nountype: encryptText(1, ENCRYPTED_PASSWORD()),
        };
        dispatch({
          type: 'login/login',
          payload: {
            ...val,
          },
          callback1: () => {
            this.setState({ modalShow: false });
            removeAuthToken();
            // 登录出错返回处理业务
            this.reatVerificode();
          },
          // 第一次登录时，修改密码的返回处理方法
          callback2: () => {
            // this.setState({ oldPassword: values.password });
            this.setState({ modalShow: true });
          },
        });
      } else if (this.state.type === 'mobile') {
        val = {
          mobile: values.mobile,
          code: values.captcha,
          nountype: encryptText(1, ENCRYPTED_PASSWORD()),
        };
        dispatch({
          type: 'loginCustomer/phoneLoginCustomer',
          payload: {
            ...val,
          },
          callback1: () => {
            this.setState({ modalShow: false });
            removeAuthToken();
            // 登录出错返回处理业务
            this.reatVerificode();
          },
          // 第一次登录时，修改密码的返回处理方法
          callback2: () => {
            // this.setState({ oldPassword: values.password });
            this.setState({ modalShow: true });
          },
        });
      } else {
        console.log('登录类型不存在！');
      }
    }
  };

  handleCheckPassowrd = (rule, value, callback) => {
    const password1 = this.props.form.getFieldValue('password1');
    const password2 = this.props.form.getFieldValue('password2');
    if (password1 && password1 !== password2) {
      callback(new Error('两次密码输入不一致'));
    } else {
      callback();
    }
  };
  hasErrors(fieldsError, values) {
    return !(
      !Object.keys(fieldsError).some(field => fieldsError[field]) &&
      values.password1 !== undefined &&
      values.password2 !== undefined
    );
  }
  handleCanUpdatePassowrd = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ updatePasswordButtonLoading: true });
        this.props.dispatch({
          type: 'loginCustomer/handleUpdatePasswordFunc',
          payload: {
            password: encryptText(values.password, ENCRYPTED_PASSWORD()),
            // newPassword: encryptText('000000', ENCRYPTED_PASSWORD()),
            // sureNewPassWord: encryptText('000000', ENCRYPTED_PASSWORD()),
            newPassword: encryptText(values.password1, ENCRYPTED_PASSWORD()),
            sureNewPassWord: encryptText(values.password2, ENCRYPTED_PASSWORD()),
          },
          callback1: () => {
            // 成功，需要重新登录
            this.setState({ modalShow: false }), removeAuthToken();
            // // 触发图片验证码更新
            this.loginForm.resetFields();
            this.reatVerificode();
            this.setState({ updatePasswordButtonLoading: false });
          },
          callback2: () => {
            this.setState({ updatePasswordButtonLoading: false });
          },
        });
      }
    });
  };
  handleAddModal = () => {
    const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form;
    return (
      <Modal
        onCancel={() => [this.setState({ modalShow: false }), removeAuthToken()]}
        footer={null}
        centered
        destroyOnClose
        width="600px"
        className={styles.pwdbox}
        visible={this.state.modalShow}
      >
        <div className={styles.pwdcontent}>
          <p className={styles.p1}>欢迎您 , 亲爱的用户 !</p>
          <p className={styles.p2}>由于您是首次登录 , 请在下面输入新的密码增强账户安全！</p>
          <Form onSubmit={this.handleCanUpdatePassowrd}>
            <Form.Item className={styles.f0}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入原密码',
                  },
                ],
              })(<Input.Password placeholder="请输入原密码 " className={styles.i1} />)}
            </Form.Item>
            <Form.Item className={styles.f1}>
              {getFieldDecorator('password1', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                  {
                    pattern: '^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?!.*[~!@%#$^&*=|{};\\[\\]<>《》?·~！@#￥……&*——|{}【】；。？]).{8,15}$',
                    message: '请按照规则输入密码 :  8-15位 (只能是大写字母+小写字母+数字)  ',
                  },
                ],
              })(
                <Input.Password placeholder=" 8-15位 (只能是大写字母+小写字母+数字)  " className={styles.i1} />,
              )}
            </Form.Item>
            <Form.Item className={styles.f1}>
              {getFieldDecorator('password2', {
                rules: [
                  {
                    required: true,
                    message: '请再次输入新密码',
                  },
                  {
                    pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$',
                    message: '请输入再次新密码',
                  },
                  {
                    validator: (rule, value, callback) => {
                      this.handleCheckPassowrd(rule, value, callback);
                    },
                  },
                ],
              })(<Input.Password placeholder="确认新密码" className={styles.i1} />)}
            </Form.Item>
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

  reatVerificode = () => {
    // 重新触发图片验证码
    if (this.state.verificodeRef) {
      this.state.verificodeRef.reloadPic();
    }
  };

  getRefVerificode = ref => {
    this.setState({ verificodeRef: ref });
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
                defaultActiveKey={type}
                onTabChange={this.onTabChange}
                onSubmit={this.handleSubmit}
                onCreate={form => {
                  this.loginForm = form;
                }}
              >
                <Tab key="account" tab="账户登录">
                  <div>
                    {status === 'error' &&
                      loginType === 'account' &&
                      !submitting &&
                      this.renderMessage('账户或密码错误（admin/ant.design）')}
                    <UserName
                      name="userName"
                      placeholder={`请输入${'账号'}`}
                      hasicon={hasicon}
                      rules={[
                        {
                          required: true,
                          message: '请输入账号',
                        },
                      ]}
                    />
                    <Password
                      name="password"
                      placeholder={`请输入${'密码'}`}
                      hasicon={hasicon}
                      rules={[
                        {
                          required: true,
                          message: '请输入密码',
                        },
                      ]}
                      onPressEnter={e => {
                        e.preventDefault();
                        if (this.loginForm) {
                          this.loginForm.validateFields(this.handleSubmit);
                        }
                      }}
                    />
                    <Verificode
                      className={styles.padding}
                      name="verificode"
                      placeholder="请输入验证码"
                      hasicon={hasicon}
                      getOriginalVerificode={this.getOriginalVerificode}
                      getRefVerificode={this.getRefVerificode}
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                        {
                          validator: (rule, value, callback) => {
                            this.handleCheckVerificode(rule, value, callback);
                          },
                        },
                      ]}
                    />
                  </div>
                  <Submit loading={submitting} className={styles.btn}>
                    登录
                  </Submit>
                  {/* <div className={styles.other}>
                    <Link className={styles.forget} to="/userCustomer/forget">
                      忘记密码？
                    </Link>
                  </div> */}
                </Tab>
                {/* <Tab key="mobile" tab="手机登录">
                  {status === 'error' &&
                    loginType === 'mobile' &&
                    !submitting &&
                    this.renderMessage('验证码错误')}
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
                  <Submit loading={submitting} className={styles.btn}>
                    登录
                  </Submit>
                  {/* <div className={styles.other}>
                    <Link className={styles.forget} to="/userCustomer/forget">
                      忘记密码？
                    </Link>
                  </div>
                </Tab> */}
              </LoginComponents>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ loginCustomer, loading }) => ({
  userLogin: loginCustomer,
  submitting: loading.effects['login/login'],
}))(Login);

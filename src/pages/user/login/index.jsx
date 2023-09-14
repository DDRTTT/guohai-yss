import { Alert, Button, Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { encryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';
import LoginComponents from './components/Login';
import styles from './style.less';
import { removeAuthToken } from '@/utils/session';

const { UserName, Password, Submit } = LoginComponents;

@Form.create()
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
    modalShow: false,
    updatePasswordButtonLoading: false,
    oldPassword: '',
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
          type: 'login/handleUpdatePasswordFunc',
          payload: {
            password: encryptText(this.state.oldPassword, ENCRYPTED_PASSWORD()),
            newPassword: encryptText(values.password1, ENCRYPTED_PASSWORD()),
            sureNewPassWord: encryptText(values.password2, ENCRYPTED_PASSWORD()),
          },
          callback1: () => [this.setState({ modalShow: false }), removeAuthToken()],
          callback2: () => this.setState({ updatePasswordButtonLoading: false }),
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
        width="800px"
        visible={this.state.modalShow}
      >
        <p className={styles.p1}>欢迎您 , 亲爱的用户 !</p>
        <p className={styles.p2}>由于你是首次登录 , 请在下面输入新的密码增强账户安全</p>
        <Form onSubmit={this.handleCanUpdatePassowrd}>
          <Form.Item hasFeedback className={styles.f1}>
            {getFieldDecorator('password1', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码 !',
                },
                {
                  pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$',
                  message: '请按照规则输入密码 : 8-20位 (不能全是数字或字母) ',
                },
              ],
            })(<Input.Password placeholder="8-20位 (不能全是数字或字母) " className={styles.i1} />)}
          </Form.Item>
          <Form.Item hasFeedback className={styles.f1}>
            {getFieldDecorator('password2', {
              rules: [
                {
                  required: true,
                  message: '请输入再次新密码 !',
                },
                {
                  pattern: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$',
                  message: '请按照规则输入密码 : 8-20位 (不能全是数字或字母) ',
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
            创建新密码
          </Button>
        </Form>
      </Modal>
    );
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const val = {
        username: encryptText(values.userName, ENCRYPTED_PASSWORD()),
        password: encryptText(values.password, ENCRYPTED_PASSWORD()),
        nountype: encryptText(1, ENCRYPTED_PASSWORD()),
      };
      dispatch({
        type: 'login/login',
        payload: {
          ...val, // type,
        },
        callback: () => {
          this.setState({ oldPassword: values.password });
          this.setState({ modalShow: true });
        },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
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

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
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

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        {this.handleAddModal()}
        <div className={styles.title}>欢迎登录</div>
        <LoginComponents
          className={styles.loginCom}
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          {/* <Tab key="account" tab="密码登录"> */}
          <div>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/ant.design）')}
            <UserName
              name="userName"
              placeholder={`请输入${'用户名'}`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`请输入${'密码'}`}
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
          </div>
          {/* </Tab> */}
          {/* <Tab key="mobile" tab="短信登录">
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile
              name="mobile"
              placeholder="手机号"
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
              placeholder="验证码"
              countDown={120}
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
          </Tab> */}
          {/*          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              忘记密码
            </a>
          </div> */}
          <Submit loading={submitting} className={styles.btn}>登录</Submit>
          <div className={styles.other}>
            {/*            <Icon type="alipay-circle" className={styles.icon} theme="outlined"/>
            <Icon type="taobao-circle" className={styles.icon} theme="outlined"/>
            <Icon type="weibo-circle" className={styles.icon} theme="outlined"/> */}
            {/*            <Link className={styles.register} to="/user/login">
              立即注册
            </Link>
            <Link className={styles.forget} to="/user/login">
              忘记密码？
            </Link> */}
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

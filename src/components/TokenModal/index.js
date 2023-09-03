import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'dva';
import tokenStyle from './index.less';
import { CHECK_TIME, checkUserActionTime, setLassTime } from '@/utils/cookie';
import bgToken from '@/assets/token_bg.png';
import { encryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';
import { setAuthToken } from '@/utils/session';

const FormItem = Form.Item;

@Form.create()
@connect(({ login, user, loading }) => ({
  login,
  currentUser: user.currentUser,
  loading: loading.effects['login/login'],
}))
export default class TokenModal extends PureComponent {
  componentWillUnmount() {
    // clearInterval(this.interval);
  }

  componentDidMount() {
    // this.getTimeDiffer(); // 初始加载状态监测扫描
    // this.interval = setInterval(this.getTimeDiffer, CHECK_TIME * 60 * 1000); // 检测一次

    document.addEventListener('keydown', () => {
      if (!checkUserActionTime()) setLassTime();
    });
    document.addEventListener('click', () => {
      if (!checkUserActionTime()) setLassTime();
    });
    document.addEventListener('mousemove', () => {
      setLassTime();
    });
  }

  getTimeDiffer = () => {
    if (checkUserActionTime()) {
      // 超过60min未操作，锁定屏幕，强制重新登录
      // token过期后，请求前token置空
      // setAuthToken('');
      console.log('____No Operating___');
      this.props.dispatch({
        type: 'login/modelSwitch',
        payload: true,
      });
    }
  };

  checkNameAndPsd = e => {
    e.preventDefault();
    const {
      dispatch,
      form: { validateFields, resetFields },
      currentUser,
    } = this.props;
    validateFields((err, fieldsValue) => {
      const { password } = fieldsValue;
      if (err) return;
      const username = currentUser.usercode;
      dispatch({
        type: 'login/login',
        payload: {
          username: encryptText(username, ENCRYPTED_PASSWORD()),
          password: encryptText(password, ENCRYPTED_PASSWORD()),
          nountype: encryptText(1, ENCRYPTED_PASSWORD()),
        },
        flag: false,
      }).then(res => {
        if (res) {
          resetFields([`password`]);
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      login: { modelVisible },
      currentUser,
      loading,
    } = this.props;
    return (
      <div className={tokenStyle.tokenModal}>
        <Modal
          visible={modelVisible}
          width={520}
          closable={false}
          maskClosable={false}
          afterClose={this.handleAfterClose}
          className={tokenStyle.defaultModal}
          footer={null}
        >
          <div className={tokenStyle.tableListForm} style={{ marginTop: 14 }}>
            <Form onSubmit={this.checkNameAndPsd}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={3} sm={24}>
                  <img src={bgToken} alt={''} />
                </Col>
                <Col md={21} sm={24}>
                  <h1>系统安全保护</h1>
                  <p>
                    由于您已 <b style={{ color: '#007aff' }}>60</b> 分钟未进行操作，已进入安全锁定。
                  </p>
                  <p>请输入【{currentUser.username}】的密码进行解锁</p>
                  <div style={{ marginTop: 14 }}>
                    <FormItem>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: '请输入密码！',
                          },
                        ],
                      })(<Input type="password" placeholder="请输入登录密码" />)}
                    </FormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      确认
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

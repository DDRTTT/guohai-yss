import { PureComponent } from 'react';
import { Form, message, Button, Row, Col, Input } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
export default class Emailone extends PureComponent {
  state = {
    emailHelp: '',
    nextStep: false,

    captchaInputUse: true, // 手机验证码输入框是否可用
    captchaBtnUse: false, // 手机验证码按钮是否可用,默认可用
    emailUse: false, // 手机号码输入框是否可用
  };

  // 检查邮箱验证码是否匹配,是否跳转下一步
  checkEmailCode = e => {
    const { dispatch, form, data } = this.props;
    e.preventDefault();
    form.validateFields((err, value) => {
      const user_email = data.data[0].email;
      if (!err) {
        this.props.dispatch({
          type: 'personalDatum/sensMailboxCode',
          payload: {
            code: value.emailCode,
            email: user_email,
          },
        });
      }
    });
  };

  checkEmail = (rule, value, callback) => {
    const { dispatch, form } = this.props;
    if (!value) {
      // this.setState({ emailHelp: '请输入邮箱验证码' });
      message.error('请输入邮箱验证码');
      callback('Error:验证码为空');
      this.setState({
        nextStep: false,
      });
    } else {
      this.setState({ emailHelp: '' });
      // let reg = this.props.emailCodeArr.data.code;
      // if (value == reg) {
      callback();
      this.setState({
        nextStep: true,
      });
      // } else {
      //   this.setState({ emailHelp: '邮箱验证码错误' });
      //   callback('Error:邮箱验证码错误');
      //   this.setState({
      //     nextStep: false,
      //   })
      // }
    }
  };

  // 点击获取邮箱验证码的时候启用定时器
  checkCode = () => {
    const { form, data } = this.props;
    // 发送邮箱验证码
    const user_email = data.data[0].email;
    this.props.dispatch({
      type: 'personalDatum/sendCodeFun',
      payload: {
        email: user_email,
      },
    });

    let count = 60;
    this.setState({ count, captchaBtnUse: true, captchaInputUse: false, emailUse: false });

    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
        this.setState({ count, captchaBtnUse: false, emailUse: false });
      }
    }, 1000);
  };

  render() {
    const { data } = this.props;
    // 传递方法
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const emailError = isFieldTouched('emailCode') && getFieldError('emailCode');

    const emailOne = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <p className={styles.rightText}>邮箱验证码:</p>
          <FormItem
            label=""
            validateStatus={emailError ? 'error' : ''}
            help={this.state.emailHelp}
            className={styles.form}
          >
            {getFieldDecorator('emailCode', {
              rules: [{ validator: this.checkEmail }],
            })(
              <Input
                placeholder="请输入邮箱验证码"
                className={styles.formInput}
                disabled={this.state.captchaInputUse}
              />,
            )}
          </FormItem>
          <p className={styles.leftTextLine}>
            <Button
              type="primary"
              onClick={() => this.checkCode()}
              disabled={this.state.captchaBtnUse}
            >
              {this.state.count ? `${this.state.count} s` : '获取验证码'}
            </Button>
          </p>
        </Col>
        <div className={styles.nonForm} style={{ marginTop: 10 }}>
          <p className={styles.rightText} />
          <p className={styles.leftText}>
            <Button type="primary">下一步</Button>
            <span className={styles.cancelBtn} onClick={() => this.props.changeF(0, 'e')}>
              取消
            </span>
          </p>
        </div>
      </Row>
    );

    return (
      <Form onSubmit={this.checkEmailCode} className="form">
        {emailOne}
      </Form>
    );
  }
}

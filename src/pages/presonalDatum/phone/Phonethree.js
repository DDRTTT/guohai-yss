import { PureComponent } from 'react';
import { Form, message, Button, Row, Col, Input } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
export default class Phonethree extends PureComponent {
  state = {
    phoneHelp: '', // 手机号码提示消息
    placeholder: '', // 手机验证码输入框里的提示信息
    captchaInputUse: true, // 手机验证码输入框是否可用
    captchaBtnUse: false, // 手机验证码按钮是否可用,默认可用
    phoneUse: false, // 手机号码输入框是否可用
    nextStep: false,
  };

  // 检查手机验证码是否匹配,是否跳转下一步
  checkPhoneCode = e => {
    // if (this.state.nextStep) {
    // } else {
    //   return false
    // }
    // let user_phone = data.data[0].mobile
    e.preventDefault();
    const { dispatch, form, data } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'personalDatum/checkPhoneCodeFun2',
          payload: {
            code: value.phoneCodeThree,
            fmobile: this.props.newMobile,
          },
        });
      }
    });
  };

  // 点击获取手机验证码的时候启用定时器
  checkCode = () => {
    const { form } = this.props;
    // 后台调取_短信接口
    this.props.dispatch({
      type: 'personalDatum/sensPhoneCode',
      payload: {
        scene: 'XGSJBD',
        fmobile: this.props.newMobile,
      },
    });
    let count = 60;
    this.setState({ count, captchaBtnUse: true, captchaInputUse: false, phoneUse: false });

    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
        this.setState({ count, captchaBtnUse: false, phoneUse: false });
      }
    }, 1000);
  };

  // 检验手机验证码
  checkPhone = (rule, value, callback) => {
    const { dispatch, form } = this.props;
    if (!value) {
      // this.setState({ phoneHelp: '请输入手机验证码' });
      message.error('请输入手机验证码!');
      callback('Error:验证码为空');
      this.setState({
        nextStep: false,
      });
    } else {
      this.setState({ phoneHelp: '' });
      callback();
      this.setState({
        nextStep: true,
      });
    }
  };

  render() {
    const { data } = this.props;
    // 传递方法
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const phoneError = isFieldTouched('phoneCodeThree') && getFieldError('phoneCodeThree');

    const phoneThree = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <p className={styles.rightText}>手机验证码:</p>
          <FormItem
            label=""
            validateStatus={phoneError ? 'error' : ''}
            help={this.state.phoneHelp}
            className={styles.form}
          >
            {getFieldDecorator('phoneCodeThree', {
              rules: [{ validator: this.checkPhone }],
            })(
              <Input
                placeholder="请输入手机验证码"
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
          <div className={styles.nonForm} style={{ marginTop: 10 }}>
            <p className={styles.rightText} />
            <p className={styles.leftText}>
              <Button type="primary">绑定</Button>
              <span className={styles.cancelBtn} onClick={() => this.props.changeF(2, 'p')}>
                取消
              </span>
            </p>
          </div>
        </Col>
      </Row>
    );

    return (
      <Form onSubmit={this.checkPhoneCode} className="form">
        {phoneThree}
      </Form>
    );
  }
}

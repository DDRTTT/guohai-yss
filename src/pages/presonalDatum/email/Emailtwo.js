import { PureComponent } from 'react';
import { Form, message, Row, Col, Input, Button } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
export default class Emailtwo extends PureComponent {
  state = {
    emailHelp: '', // 邮箱提示消息
    nextStep: false, // 判断是否可以进行下一步
  };

  // 检查手机号输入是否正确，当正确的时候调用相应的函数
  checkEmail = (rule, value, callback) => {
    if (!value) {
      // this.setState({ emailHelp: '请输入邮箱' });
      message.error('请输入邮箱');
      callback('Error:邮箱为空');
      this.setState({
        nextStep: false,
      });
    } else {
      this.setState({ emailHelp: '' });
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (reg.test(value)) {
        callback();
        sessionStorage.setItem('newEmail', value);
        this.setState({
          nextStep: true,
        });
      } else {
        this.setState({ emailHelp: '邮箱格式错误' });
        callback('Error:邮箱格式错误');
        this.setState({
          nextStep: false,
        });
      }
    }
  };

  // 点击下一步
  checkNewEmail = e => {
    e.preventDefault();
    if (this.state.nextStep) {
      this.props.changeF(3, 'e');
    } else {
      message.error('请输入正确的邮箱!');
    }
  };

  render() {
    const { data } = this.props;
    // 传递方法
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { setEmail } = this.props;

    // 控制显示隐藏变量
    const show = {
      display: '',
    };
    const hide = {
      display: 'none',
    };

    const emailError = isFieldTouched('newEmail') && getFieldError('newEmail');

    const emailTwo = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <p className={styles.rightText}>新邮箱地址:</p>
          <FormItem
            label=""
            validateStatus={emailError ? 'error' : ''}
            help={this.state.emailHelp}
            className={styles.form}
          >
            {getFieldDecorator('newEmail', {
              rules: [{ validator: this.checkEmail }],
            })(<Input placeholder="请输入新的邮箱地址" className={styles.formInput} />)}
          </FormItem>
        </Col>
        <div className={styles.nonForm} style={{ marginTop: 10 }}>
          <p className={styles.rightText} />
          <p className={styles.leftText}>
            <Button
              onClick={() => {
                setEmail(this.props.form.getFieldValue('newEmail'));
              }}
            >
              下一步
            </Button>
            <span
              style={this.props.cancel ? show : hide}
              className={styles.cancelBtn}
              onClick={() => this.props.changeF(1, 'e')}
            >
              取消
            </span>
          </p>
        </div>
      </Row>
    );

    return (
      <Form onSubmit={this.checkNewEmail} className="form">
        {emailTwo}
      </Form>
    );
  }
}

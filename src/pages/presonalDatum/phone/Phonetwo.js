import { PureComponent } from 'react';
import { Form, message, Row, Col, Input, Button } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;

@Form.create()
export default class Phonetwo extends PureComponent {
  state = {
    phoneHelp: '', // 手机号码提示消息
    nextStep: false, // 判断是否可以进行下一步
    newPhoneNum: '',
  };

  // 检查手机号输入是否正确，当正确的时候调用相应的函数
  checkPhone = (rule, value, callback) => {
    if (!value) {
      // this.setState({phoneHelp: '请输入手机号'});
      message.error('请输入手机号');
      callback('Error:手机号空');
      this.setState({
        nextStep: false,
      });
    } else {
      this.setState({ phoneHelp: '' });
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(value)) {
        callback();
        sessionStorage.setItem('newPhone', value);
        this.setState({
          nextStep: true,
        });
      } else {
        this.setState({ phoneHelp: '手机号格式错误' });
        callback('Error:手机号格式错误');
        this.setState({
          nextStep: false,
        });
      }
    }
  };

  // 点击下一步
  checkNewPhone = e => {
    const { dispatch, form, data } = this.props;
    e.preventDefault();
    form.validateFields((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'personalDatum/isPhoneExistFun',
          payload: {
            fmobile: value.newPhone,
          },
        });
      }
    });
  };

  render() {
    const { data } = this.props;
    // 传递方法
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { setValues } = this.props;

    // 控制显示隐藏变量
    const show = {
      display: '',
    };
    const hide = {
      display: 'none',
    };

    const phoneError = isFieldTouched('newPhone') && getFieldError('newPhone');

    const phoneTwo = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <p className={styles.rightText}>新手机号码:</p>
          <FormItem
            label=""
            validateStatus={phoneError ? 'error' : ''}
            help={this.state.phoneHelp}
            className={styles.form}
          >
            {getFieldDecorator('newPhone', {
              rules: [{ validator: this.checkPhone }],
            })(<Input placeholder="请输入新手机号码" className={styles.formInput} />)}
          </FormItem>
          <div className={styles.nonForm} style={{ marginTop: 10 }}>
            <p className={styles.rightText} />
            <p className={styles.leftText}>
              <Button
                onClick={() => {
                  setValues(this.props.form.getFieldValue('newPhone'));
                }}
              >
                下一步
              </Button>
              <span
                className={styles.cancelBtn}
                style={this.props.cancel ? show : hide}
                onClick={() => this.props.changeF(1, 'p')}
              >
                取消
              </span>
            </p>
          </div>
        </Col>
      </Row>
    );

    return (
      <Form onSubmit={this.checkNewPhone} className="form">
        {phoneTwo}
      </Form>
    );
  }
}

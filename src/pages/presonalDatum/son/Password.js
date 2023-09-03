import { PureComponent } from 'react';
import { Col, Form, Input, Row, Button } from 'antd';
import { encryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

@Form.create()
export default class Password extends PureComponent {
  state = {
    confirmDirty: false,
  };

  passwordSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const val = {
        newPassword: encryptText(values.newPassword, ENCRYPTED_PASSWORD()),
        password: encryptText(values.password, ENCRYPTED_PASSWORD()),
        sureNewPassWord: encryptText(values.sureNewPassWord, ENCRYPTED_PASSWORD()),
      };
      if (!err) {
        dispatch({
          type: 'personalDatum/PasswordFun',
          payload: val,
        });
      }
    });
  };

  // 验证旧密码
  checkOldPassword = (rule, value, callback) => {
    this.validate(rule, value, callback);
  };

  // 验证新密码
  validateToNextPassword = (rule, value, callback) => {
    this.validate(rule, value, callback);
  };

  validate = (rule, value, callback) => {
    if (value) {
      if (value.length < 6) {
        callback('请至少输入 6 个字符');
      }
    }
    callback();
  };

  // 判断输入的登录密码和输入的确定密码是否一致
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 10,
        },
        sm: {
          span: 24,
          offset: 24,
        },
      },
    };
    // 修改密码 passWordEdit
    const passWordEdit = (
      <Row>
        <Col md={24} sm={24} style={{ marginTop: 10 }}>
          <Form.Item label="当前密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入当前密码!',
                },
                {
                  validator: this.checkOldPassword,
                },
              ],
            })(<Input.Password style={{ width: '328px' }} />)}
          </Form.Item>
        </Col>
        <Col md={24} sm={24} style={{ marginTop: 10 }}>
          <Form.Item label="新密码">
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password style={{ width: '328px' }} />)}
          </Form.Item>
        </Col>
        <Col md={24} sm={24} style={{ marginTop: 10 }}>
          <Form.Item label="确认新密码">
            {getFieldDecorator('sureNewPassWord', {
              rules: [
                {
                  required: true,
                  message: '请再次输入新密码!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password style={{ width: '328px' }} onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
        </Col>
        <Col md={24} sm={24} style={{ marginTop: 10 }}>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.passwordSubmit}>
              保存
            </Button>
          </Form.Item>
        </Col>
      </Row>
    );

    return <Form {...formItemLayout}>{passWordEdit}</Form>;
  }
}

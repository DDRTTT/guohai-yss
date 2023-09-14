import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Row, Col, Input, Select, Button, Popover, Progress } from 'antd';
import styles from './index.less';
//本页面中插入的所有图片
import blue_dotted from '@/assets/blue_dotted.png';
import gray_dotted from '@/assets/gray_dotted.png';

//个人用户注册的参数
const FormItem = Form.Item;
const Option = Select.Option;

//判断两次输入的密码是否一致的参数
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

//hasErrors函数判断form表单中是否有错误
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

//机构用户注册2
class CompanyFirstForm extends React.Component {
  state = {
    confirmDirty: false,
    passwordHelp: '', //密码提示消息
    visible: false,
    companySecondBtn: 0, //下一步按钮是否被按下（0：没有被按下；1：已按下）
  };
  //点击登录按钮后调用此函数
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = Object.assign(values, this.props.register.OrgFistdata);
        data = {
          ...data,
          sysId: 0,
          userType: 1,
        };
        this.props.dispatch({
          type: 'register/submit',
          payload: data,
        });
        this.handleResult();
      }
    });
  };

  handleResult = () => {
    setTimeout(() => {
      this.setState({
        visible: false,
      });
      const {
        register: { saveFail },
      } = this.props;
      if (saveFail !== 'none') {
        let companySecondBtn = 1;
        this.props.callbackParent(companySecondBtn);
      }
    }, 1000);
  };
  //下拉框选择内容后打印内容
  handleSelectChange = value => {};

  //判断输入的登录密码和输入的确定密码是否一致
  //两次输入的密码是否一致的逻辑判断
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        passwordHelp: '请输入密码！',
        visible: !!value,
      });
      callback('密码空');
    } else {
      this.setState({
        passwordHelp: '',
      });
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
        this.setState({
          passwordHelp: '请至少输入 6 个字符！',
        });
      } else {
        callback();
      }
    }
  };
  //判断输入的密码长度
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('pwd');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  //输出的错误提示框
  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('pwd');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  //页面加载之后就对表单中的内容进行校验
  componentDidMount() {
    this.props.dispatch({
      type: 'register/getOrgType',
    });
    this.props.form.validateFields();
    this.setState({ passwordHelp: '' });
  }

  getorgType = () => {
    let children = [];
    const {
      register: { OrgType },
    } = this.props;
    for (let key in OrgType) {
      children.push(
        <Option index={OrgType[key].code} key={key} value={OrgType[key].code}>
          {OrgType[key].name}
        </Option>,
      );
    }
    return (
      <Select
        placeholder="请选择机构类型"
        onChange={this.handleSelectChange}
        className={styles.companyTypeSelect}
      >
        {children}
      </Select>
    );
  };

  render() {
    const callbackChild2 = this.props.callbackChild2;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const companyNameError = isFieldTouched('companyName') && getFieldError('companyName');
    const companyCodeError = isFieldTouched('companyCode') && getFieldError('companyCode');
    const companyTypeError = isFieldTouched('companyType') && getFieldError('companyType');
    const emailError = isFieldTouched('email') && getFieldError('email');
    const passwordError = isFieldTouched('pwd') && getFieldError('pwd');
    const confirmError = isFieldTouched('confirm') && getFieldError('confirm');

    return (
      <div className={styles.companySecond} style={{ display: callbackChild2 }}>
        <div className={styles.Step_bar}>
          <Row>
            <Col span={8} className={styles.Step_blue}>
              <p>1</p>
              <h4>经办人信息验证</h4>
            </Col>
            <Col span={8} className={styles.Step_blue}>
              <p>2</p>
              <h4>填写企业信息</h4>
              <div className={styles.gray_line}>
                <img alt="进行到的步骤" src={blue_dotted} />
              </div>
            </Col>
            <Col span={8} className={styles.Step_gray}>
              <p>3</p>
              <h4>注册完成</h4>
              <div className={styles.gray_line}>
                <img alt="没进行到的步骤" src={gray_dotted} />
              </div>
            </Col>
          </Row>
        </div>

        <Form onSubmit={this.handleSubmit}>
          {/*用户名*/}
          <FormItem
            className={styles.input_box}
            validateStatus={companyNameError ? 'error' : ''}
            help={companyNameError || ''}
            hasFeedback
          >
            {getFieldDecorator('orgName', {
              rules: [{ required: true, whitespace: true, message: '请输入企业全称!' }],
            })(<Input addonBefore="企业全称" placeholder="请与银行预留的公司名称保持一致" />)}
          </FormItem>

          {/*用户真实姓名*/}
          <FormItem
            className={styles.input_box}
            validateStatus={companyCodeError ? 'error' : ''}
            help={companyCodeError || ''}
            hasFeedback
          >
            {getFieldDecorator('orgCode', {
              rules: [{ required: true, whitespace: true, message: '请输入组织机构代码!' }],
            })(<Input addonBefore="机构代码" placeholder="请输入组织机构代码" />)}
          </FormItem>

          {/*机构类型*/}
          <FormItem
            className={styles.input_box}
            validateStatus={companyTypeError ? 'error' : ''}
            help={companyTypeError || ''}
            hasFeedback
          >
            <span className={styles.companyTypeSpan}>机构类型</span>
            {getFieldDecorator('orgType', {
              rules: [{ required: true, whitespace: true, message: '请选择机构类型!' }],
            })(this.getorgType())}
          </FormItem>

          {/*邮箱地址*/}
          <FormItem
            className={styles.input_box}
            validateStatus={emailError ? 'error' : ''}
            help={emailError || ''}
            hasFeedback
          >
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '请输入真实的邮箱地址!',
                },
                {
                  required: true,
                  message: '请输入邮箱地址!',
                },
              ],
            })(<Input addonBefore="邮箱地址" placeholder="请输入邮箱地址" />)}
          </FormItem>
          {/*密码*/}
          <FormItem
            help={this.state.passwordHelp}
            className={styles.input_box}
            validateStatus={passwordError ? 'error' : ''}
            hasFeedback
          >
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('pwd', {
                rules: [{ validator: this.checkPassword }],
              })(
                <Input
                  addonBefore="登录密码"
                  placeholder="至少6位密码，区分大小写"
                  type="password"
                />,
              )}
            </Popover>
          </FormItem>
          {/*确定密码项*/}
          <FormItem
            className={styles.input_box}
            validateStatus={confirmError ? 'error' : ''}
            help={confirmError || ''}
            hasFeedback
          >
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: '请确认密码！' },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                addonBefore="确认密码"
                placeholder="请确认登录密码"
                type="password"
                onBlur={this.handleConfirmBlur}
              />,
            )}
          </FormItem>
          {/*提交按钮*/}
          <FormItem className={styles.input_box_submit}>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedCompanyFirstForm = Form.create()(CompanyFirstForm);

export default WrappedCompanyFirstForm;

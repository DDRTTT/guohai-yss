import React from 'react';
import { Link } from 'dva/router';
import { Button, Checkbox, Col, Form, Input, message, Row, Select } from 'antd';
import styles from './index.less';
//本页面中插入的所有图片
import gray_dotted from '@/assets/gray_dotted.png';

//个人用户注册的参数
const FormItem = Form.Item;
const Option = Select.Option;

//hasErrors函数判断form表单中是否有错误
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

//机构用户注册1
class CompanyFirstForm extends React.Component {
  state = {
    phoneHelp: '',
    count: 0, //手机验证码按钮显示信息（倒计时）
    placeholder: '', //手机验证码输入框里的提示信息
    captchaInputUse: true, //手机验证码输入框是否可用
    captchaBtnUse: true, //手机验证码按钮是否可用
    phoneUse: false, //手机号码输入框是否可用
    companyFirstBtn: 0, //下一步按钮是否被按下（0：没有被按下；1：已按下）
    checkAgreement: false, //《平台用户协议条款》是否是已勾选状态
  };

  //控制注册页面的显示和隐藏
  constructor(...args) {
    super(...args);
    this.state = { display: 'block' };
  }

  //判断 阅读并同意《平台用户协议条款》是否已勾选
  checkAgreement = (rule, value, callback) => {
    this.setState({ checkAgreement: value });
    if (!value) {
      this.setState({ agreementHelp: '请阅读并同意《平台用户协议条款》！' });
      callback('请阅读并同意平台用户协议条款');
    } else {
      this.setState({ agreementHelp: '' });
      callback();
    }
  };

  //检查手机号输入是否正确，当正确的时候调用相应的函数
  checkPhone = (rule, value, callback) => {
    if (!value) {
      this.setState({
        phoneHelp: '请输入手机号！',
        placeholder: '',
        captchaInputUse: true,
        captchaBtnUse: true,
      });
      callback('Error:手机号空');
    } else {
      this.setState({ phoneHelp: '' });
      const reg = /^1\d{10}$/;
      if (reg.test(value)) {
        callback();
        this.setState({
          placeholder: '请输入短信验证码',
          captchaInputUse: false,
          captchaBtnUse: false,
        });
      } else {
        this.setState({
          phoneHelp: '手机号格式错误！',
          placeholder: '',
          captchaInputUse: true,
          captchaBtnUse: true,
        });
        callback('Error:手机号格式错误');
      }
    }
  };

  //点击获取手机验证码的时候启用定时器
  onGetCaptcha = () => {
    const { form } = this.props;
    //后台调取_短信接口
    let user_phone = form.getFieldValue('mobile');
    const val = {
      fmobil: user_phone,
      scene: 'ZCYZM',
    };
    this.props.dispatch({
      type: 'register/getDX',
      payload: val,
    });
    let count = 60;
    this.setState({ count, captchaBtnUse: true, phoneUse: true });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
        this.setState({ count, captchaBtnUse: false, phoneUse: false });
      }
    }, 1000);
  };

  //点击登录按钮后调用此函数
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    // 验证码
    let verCode = form.getFieldValue('verCode');
    // 手机号
    let mobile = form.getFieldValue('mobile');
    // 用户名
    let code = form.getFieldValue('code');

    let CodeAndMobileVal = {
      mobile,
      code,
    };

    let dxVal = {
      verCode,
      mobile,
    };

    // 用户名和手机号 校验
    dispatch({
      type: 'register/checkCodeAndMobile',
      payload: CodeAndMobileVal,
    });

    // 验证码 校验
    dispatch({
      type: 'register/checkDX',
      payload: dxVal,
    });
    message.info('请稍后，正在验证您当前的信息');
    setTimeout(() => {
      if (
        this.props.register.CodeAndMobileStatus === true &&
        this.props.register.dxStatus === true
      ) {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'register/putOrgIfo',
              payload: values,
            });
            let companyFirstBtn = 1;
            this.setState({ display: (this.state.display = 'none') });
            this.props.callbackParent(companyFirstBtn);
          }
        });
      }
    }, 1500);
  };

  // 触发验证码验证
  checkDX = e => {
    let value = e.target.value;
    const { dispatch, form } = this.props;
    if (value.length === 6) {
      let mobile = form.getFieldValue('mobile');
      let verCode = form.getFieldValue('verCode');
      let val = {
        mobile,
        verCode,
      };
      dispatch({
        type: 'namespace/checkDX',
        payload: val,
      });
    }
  };

  inputAddonBefore = () => {
    return (
      <span>
        姓<span style={{ visibility: 'hidden' }}>姓名</span>名
      </span>
    );
  };

  inputUserAddonBefore = () => {
    return (
      <span>
        用<span style={{ visibility: 'hidden' }}>a</span>户
        <span style={{ visibility: 'hidden' }}>a</span>名
      </span>
    );
  };

  //页面加载之后就对表单中的内容进行校验
  componentDidMount() {
    this.props.form.validateFields();
    this.setState({ phoneHelp: '' });
  }

  //卸载之前清空定时器
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { count } = this.state;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ fontSize: '14px' }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );
    const nickNameError = isFieldTouched('code') && getFieldError('code');
    const userNameError = isFieldTouched('name') && getFieldError('name');
    const IDError = isFieldTouched('usernum') && getFieldError('usernum');
    const phoneError = isFieldTouched('mobile') && getFieldError('mobile');
    const captchaError = isFieldTouched('verCode') && getFieldError('verCode');
    return (
      <div className={styles.companyFirst} style={{ display: this.state.display }}>
        <div className={styles.Step_bar}>
          <Row>
            <Col span={8} className={styles.Step_blue}>
              <p>1</p>
              <h4>经办人信息验证</h4>
            </Col>
            <Col span={8} className={styles.Step_gray}>
              <p>2</p>
              <h4>填写企业信息</h4>
              <div className={styles.gray_line}>
                <img alt="没进行到的步骤" src={gray_dotted} />
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
            validateStatus={nickNameError ? 'error' : ''}
            help={nickNameError || ''}
            hasFeedback
          >
            {getFieldDecorator('code', {
              rules: [{ required: true, whitespace: true, message: '请输入用户名!' }],
            })(<Input addonBefore={this.inputUserAddonBefore()} placeholder="请输入用户名" />)}
          </FormItem>

          {/*用户真实姓名*/}
          <FormItem
            className={styles.input_box}
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
            hasFeedback
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入用户真实姓名!' }],
            })(<Input addonBefore={this.inputAddonBefore()} placeholder="请输入用户真实姓名" />)}
          </FormItem>

          {/*用户身份证号码*/}
          <FormItem
            className={styles.input_box}
            validateStatus={IDError ? 'error' : ''}
            help={IDError || ''}
            hasFeedback
          >
            {getFieldDecorator('usernum', {
              rules: [
                { required: true, message: '请输入用户身份证号码!' },
                {
                  len: 18,
                  message: '请输入用户正确身份证号码',
                },
              ],
            })(<Input addonBefore="身份证号" placeholder="请输入用户身份证号码" />)}
          </FormItem>

          {/*手机号码*/}
          <FormItem
            className={styles.input_box_phone}
            validateStatus={phoneError ? 'error' : ''}
            help={this.state.phoneHelp}
            hasFeedback
          >
            {getFieldDecorator('mobile', {
              rules: [{ validator: this.checkPhone }],
            })(
              <Input
                addonBefore={prefixSelector}
                placeholder="请输入银行预留手机号码"
                // disabled={this.state.phoneUse}
              />,
            )}
          </FormItem>

          {/*手机验证码*/}
          <FormItem
            className={styles.input_box_captcha}
            validateStatus={captchaError ? 'error' : ''}
            help={captchaError || ''}
            hasFeedback
          >
            {getFieldDecorator('verCode', {
              rules: [{ required: true, message: '请输入短信验证码！' }],
            })(
              <Input
                addonBefore="手机验证码"
                placeholder={this.state.placeholder}
                disabled={this.state.captchaInputUse}
                // onKeyUp={this.checkDX} //验证码校验
                maxLength="6"
              />,
            )}
            <Button
              className={styles.getCaptcha}
              onClick={this.onGetCaptcha}
              disabled={this.state.captchaBtnUse}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </FormItem>

          {/*提交按钮*/}
          <FormItem className={styles.input_box_submit}>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              下一步
            </Button>
          </FormItem>

          {/*阅读并同意《平台用户协议条款》*/}
          <FormItem className={styles.last_input_box}>
            {getFieldDecorator('agreement', {
              rules: [{ validator: this.checkAgreement }],
              initialValue: true,
            })(
              <Checkbox checked={this.state.checkAgreement}>
                阅读并同意
                <Link to="/user/Agreement">《平台用户协议条款》</Link>
              </Checkbox>,
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedCompanyFirstForm = Form.create()(CompanyFirstForm);

export default WrappedCompanyFirstForm;

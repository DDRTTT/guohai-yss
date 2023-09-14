import { Button, Col, Form, Input, Row } from 'antd';
import React, { Component } from 'react';
import omit from 'omit.js';
import ItemMap from './map';
import LoginContext from './LoginContext';
import styles from './index.less';
import { keyBy } from 'lodash';

const FormItem = Form.Item;

class WrapFormItem extends Component {
  interval = undefined;

  static defaultProps = {
    getCaptchaButtonText: 'captcha',
    getCaptchaSecondText: 'second',
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      code: '',
      codeLength: 4,
      fontSizeMin: 20,
      fontSizeMax: 22,
      backgroundColorMin: 240,
      backgroundColorMax: 250,
      colorMin: 10,
      colorMax: 20,
      lineColorMin: 40,
      lineColorMax: 180,
      contentWidth: 96,
      contentHeight: 38,
    };
    // console.log('====LoginItem===', props)
  }

  UNSAFE_componentWillMount() {
    // 需要canvas时 todo
    this.canvas = this.props.type === 'Verificode' ? React.createRef() : null;
  }

  componentDidMount() {
    const { updateActive, name = '', type, getRefVerificode } = this.props;

    if (updateActive) {
      updateActive(name);
    }

    if (type === 'Verificode') {
      this.drawPic()
      getRefVerificode(this)
    }

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;
    const result = onGetCaptcha ? onGetCaptcha() : null;

    if (result === false) {
      return;
    }

    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };
  getOriginalVerificode() {
    const { getOriginalVerificode } = this.props;
    if (getOriginalVerificode && this.state.code) {
      getOriginalVerificode(this.state.code);
    }
  }

  getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }) => {
    const options = {
      rules: rules || customProps.rules,
    };

    if (onChange) {
      options.onChange = onChange;
    }

    if (defaultValue) {
      options.initialValue = defaultValue;
    }

    return options;
  };

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  //-----------图片验证码 方法  开始
  // 生成一个随机数`
  randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  drawPic = () => {
    this.randomCode();
  };

  // 生成一个随机的颜色
  randomColor(min, max) {
    const r = this.randomNum(min, max);
    const g = this.randomNum(min, max);
    const b = this.randomNum(min, max);
    return `rgb(${r}, ${g}, ${b})`;
  }

  drawText(ctx, txt, i) {
    ctx.fillStyle = this.randomColor(this.state.colorMin, this.state.colorMax);
    let fontSize = this.randomNum(this.state.fontSizeMin, this.state.fontSizeMax);
    ctx.font = fontSize + 'px SimHei';
    let padding = 10;
    let offset = (this.state.contentWidth - 40) / (this.state.code.length - 1);
    let x = padding;
    if (i > 0) {
      x = padding + i * offset;
    }
    let y = this.randomNum(this.state.fontSizeMax, this.state.contentHeight - 5);
    if (fontSize > 40) {
      y = 40;
    }
    let deg = this.randomNum(-10, 10);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  }

  drawLine(ctx) {
    // 绘制干扰线
    for (let i = 0; i < 1; i++) {
      ctx.strokeStyle = this.randomColor(this.state.lineColorMin, this.state.lineColorMax);
      ctx.beginPath();
      ctx.moveTo(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight),
      );
      ctx.lineTo(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight),
      );
      ctx.stroke();
    }
  }

  drawDot(ctx) {
    // 绘制干扰点
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = this.randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(
        this.randomNum(0, this.state.contentWidth),
        this.randomNum(0, this.state.contentHeight),
        1,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }
  }

  reloadPic = () => {
    this.drawPic();
    // 赋值默认值
    this.props.form.setFieldsValue({
      sendcode: '',
    });
  };

  // 输入验证码
  changeCode = e => {
    if (
      e.target.value.toLowerCase() !== '' &&
      e.target.value.toLowerCase() !== this.state.code.toLowerCase()
    ) {
      this.setState({
        showError: true,
      });
    } else if (e.target.value.toLowerCase() === '') {
      this.setState({
        showError: false,
      });
    } else if (e.target.value.toLowerCase() === this.state.code.toLowerCase()) {
      this.setState({
        showError: false,
      });
    }
  };

  // 随机生成验证码
  randomCode() {
    let random = '';
    // 字母：去掉了I l i o O
    // const str = 'QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890';
    // for (let i = 0; i < this.state.codeLength; i++) {
    //   let index = Math.floor(Math.random() * 57);
    //   random += str[index];
    // }
    // console.log('random=', random)
    // 数字
    for (let i = 0; i < this.state.codeLength; i++) {
      let index = Math.floor(Math.random() * 57);
      random += this.randomNum(1, 9);
    }
    // console.log('random=', random)
    this.setState(
      {
        code: random,
      },
      () => {
        let canvas = this.canvas.current;
        let ctx = canvas.getContext('2d');
        ctx.textBaseline = 'bottom';
        // 绘制背景
        ctx.fillStyle = this.randomColor(
          this.state.backgroundColorMin,
          this.state.backgroundColorMax,
        );
        ctx.fillRect(0, 0, this.state.contentWidth, this.state.contentHeight);
        // 绘制文字
        for (let i = 0; i < this.state.code.length; i++) {
          this.drawText(ctx, this.state.code[i], i);
        }
        this.drawLine(ctx);
        // this.drawDot(ctx);

        // console.log('code===', this.state)
        this.getOriginalVerificode(this.state.code);
      },
    );
  }
  //-----------图片验证码 方法  结束

  render() {
    const { count } = this.state; // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil

    const {
      onChange,
      customProps,
      defaultValue,
      rules,
      name,
      getCaptchaButtonText,
      getCaptchaSecondText,
      updateActive,
      type,
      form,
      tabUtil,
      ...restProps
    } = this.props;

    if (!name) {
      return null;
    }

    if (!form) {
      return null;
    }

    const { getFieldDecorator } = form; // get getFieldDecorator props

    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    if (type === 'Captcha') {
      // console.log('customProps', customProps);
      // console.log('inputProps', inputProps);
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }

    // 图片验证码
    if (type === 'Verificode') {
      // console.log('customProps', customProps);
      // console.log('inputProps', inputProps);
      const inputProps = omit(otherProps, ['getOriginalVerificode', 'getRefVerificode']);
      const suffix = (
        <div>
          <canvas onClick={this.reloadPic} ref={this.canvas} width="100" height="40" />
        </div>
      );
      return (
        <FormItem>
          {getFieldDecorator(
            name,
            options,
          )(<Input  {...customProps} {...inputProps} suffix={suffix} />)}
        </FormItem>
      );
    }

    return (
      <FormItem>
        {getFieldDecorator(name, options)(<Input {...customProps} {...otherProps} />)}
      </FormItem>
    );
  }
}

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];

  LoginItem[key] = props => (
    <LoginContext.Consumer>
      {context => (
        <WrapFormItem
          customProps={item.props}
          rules={item.rules}
          prefix={props.hasicon === 'true' ? item.props.prefix : ''}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
  // console.log('key=', key, '>>>>>>>>>>>>', LoginItem)
  // console.log('key=', key, '------------', item)
});

export default LoginItem;

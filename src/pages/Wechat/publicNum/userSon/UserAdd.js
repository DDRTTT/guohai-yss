import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()

export default class UserAdd extends PureComponent {
  state = {


  };

  componentDidMount() {
    const { data,type,dispatch } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;
    if (!nextProps.visible) {
      this.props.form.resetFields();
    }
  }

  componentWillUnmount(){
    sessionStorage.removeItem("publicApp");
  }

  //表单提交
  formSubmit = (e) => {
    const { dispatch, start, length, formValues,type,data } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let basic = {
          start: 1,
          length: length,
          appid: sessionStorage.getItem('publicApp'),
          ...formValues,
        };

        if(type == 'revise'){
          values.id = data.id
        }

        dispatch({
          type: type != 'revise'?'publicNum/userAdd':'publicNum/userUpdate',
          payload: {
            payload: values,
            addParam: basic,
          },
        });
      }
    });
  };

  //渲染表单
  renderForm = (formList) => {
    const { getFieldDecorator } = this.props.form;

    const { type,data} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    let uploadInfo = [];

    formList.map((index, i) => {
      uploadInfo.push(<Col md={24} sm={24}>
        <FormItem  {...formItemLayout} label={index.label}>
          <Col md={index.tipShow ? 14 : 24} sm={24}>
            {index.showType == 'input' ? getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + '为必填项!' }],
            })(
              <Input/>,
            ) : (index.showType == 'select' ? getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + '为必填项!' }],
            })(
              this.encryptWay(),
            ) : getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + '为必填项!' }],
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={0}>未知</Radio>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </RadioGroup>,
            ))}
          </Col>
          <Col md={index.tipShow ? 10 : 0} sm={24}><p
            style={{ fontSize: 14, color: '#c3c9d2', marginLeft: 10 }}>{index.tipInfo}</p></Col>
        </FormItem>
      </Col>);
    });
    return uploadInfo;
  };

  render() {
    const { userMenu } = this.props;
    return (<Form className="form">
      {this.renderForm(userMenu)}
      <Button onClick={this.props.handleCancel} style={{ float: 'right' }}>取消</Button>
      <Button type="primary" onClick={this.formSubmit} style={{ marginRight: 10, float: 'right' }}>确定</Button>
    </Form>);
  }
}


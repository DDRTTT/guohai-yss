import React, { PureComponent } from 'react';
import { Form, Radio, Row, Col, Input, Button } from 'antd';
import styles from '../index.less';
import { handleValidator } from '@/utils/utils';

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

const FormItem = Form.Item;
@Form.create()
export default class Person extends PureComponent {
  state = {};

  personSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/saveDatum',
          payload: values,
        })
      }
    });
  };

  // 单选change事件
  onChangeRadio = e => {
    this.setState({
      sex: e.target.value,
    });
  };



  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const RadioGroup = Radio.Group;

    const personalInfo = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col sm={24}>
          <FormItem label="所在城市" className={styles.form}>
            {getFieldDecorator('city', {
              initialValue: data?.data[0]?.city,
              rules: [{ validator: this.handleCityValidator }],
            })(
              <Input
                placeholder="请输入所在城市"
                style={{ width: '328px' }}
                className={styles.formInput}
              />,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24}>
          <FormItem label="性别" className={styles.form}>
            {getFieldDecorator('sex', {
              initialValue: data?.data[0]?.sex,
            })(
              <RadioGroup onChange={this.onChangeRadio} className={styles.leftText}>
                <Radio value={0}>男</Radio>
                <Radio value={1}>女</Radio>
                <Radio value={2}>保密</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24}>
          <FormItem label="从事职业" className={styles.form}>
            {getFieldDecorator('profession', {
              initialValue: data?.data[0]?.profession,
              rules: [{ validator: this.handleJobValidator }],
            })(
              <Input
                placeholder="请输入从事职业"
                style={{ width: '328px' }}
                className={styles.formInput}
              />,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24}>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.personSubmit}>
              绑定
            </Button>
          </Form.Item>
        </Col>
      </Row>
    );
    return (
      <Form {...formItemLayout} className="form">
        {personalInfo}
      </Form>
    );
  }
}

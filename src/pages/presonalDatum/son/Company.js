import React, { PureComponent } from 'react';
import { Form, Radio, Button, Row, Col, Input } from 'antd';
import styles from '../index.less';

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
export default class Company extends PureComponent {
  state = {};

  companySubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/saveCompanyFun',
          payload: values,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const RadioGroup = Radio.Group;
    const companyInfo = (
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem label="法人代表" className={styles.form}>
            {getFieldDecorator('legalPerson', {
              initialValue: data?.data[0]?.legalPerson,
              rules: [{ required: true, message: '请输入法人代表' }],
            })(
              <Input
                placeholder="请输入法人代表"
                style={{ width: '328px' }}
                className={styles.formInput}
                maxLength={50}
              />,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24}>
          <FormItem label="公司地址" className={styles.form}>
            {getFieldDecorator('offAddr', {
              initialValue: data?.data[0]?.offAddr,
            })(
              <Input
                placeholder="请输入公司地址"
                style={{ width: '328px' }}
                className={styles.formInput}
                maxLength={50}
              />,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24} className={styles.comHeight}>
          <FormItem label="公司固话" help="公司固话格式为：区号-固话">
            {getFieldDecorator('offTel', {
              initialValue: data?.data[0]?.offTel,
              rules: [
                {
                  pattern: new RegExp(/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/),
                  message: '请输入正确手机号码',
                },
              ],
            })(
              <Input
                placeholder="请输入公司固话"
                style={{ width: '328px' }}
                className={styles.formInput}
                maxLength={13}
              />,
            )}
          </FormItem>
        </Col>
        <Col md={24} sm={24} style={{ marginTop: 10 }}>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.companySubmit}>
              绑定
            </Button>
          </Form.Item>
        </Col>
      </Row>
    );
    return (
      <Form className="form" {...formItemLayout}>
        {companyInfo}
      </Form>
    );
  }
}

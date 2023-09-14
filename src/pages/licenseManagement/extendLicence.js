/**
 * 延长许可证
 * * */
import React from 'react';
import { connect } from 'dva';
import { Button, Col, DatePicker, Form, Input, message, Row, Spin } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import styles from './index.less';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
@errorBoundary
@Form.create()
@connect(({ loading, licenseManagement }) => ({
  loadingDismissPass: loading.effects['licenseManagement/DismissPass'],
  licenseManagement,
}))
export default class ExtendLicence extends BaseCrudComponent {
  state = {
    ciphertext: true,
  };

  exReset = () => {
    const { ciphertext } = this.state;
    const { form } = this.props;

    if (!ciphertext) {
      form.resetFields('password');
    }

    this.setState({
      ciphertext: !ciphertext,
    });
  };

  // 确认修改
  sureRevise = () => {
    const { getList, onCancel, onCancel2, dispatch, form, id } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.effectiveDate = values.expireDate[0].format('YYYY-MM-DD HH:mm:ss');
        values.expireDate = values.expireDate[1].format('YYYY-MM-DD HH:mm:ss');
        dispatch({
          type: `licenseManagement/DismissPass`,
          payload: {
            id, 
            checkResult: 1,
            effectiveDate: values.effectiveDate,
            expireDate: values.expireDate,
            restPassword: values.password,
          },
        }).then(function(response) {
          if (response.status === 200) {
            message.success('操作成功');
            getList();
            onCancel();
            onCancel2();
          } else {
            message.warn(response.message);
          }
        });
      }
    });
  };

  render() {
    const {
      issueType,
      record,
      form: { getFieldDecorator },
    } = this.props;
    const { ciphertext } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    return (
      <div className={styles.index} style={{ marginTop: 16 }}>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="许可到期时间" {...formItemLayout}>
                {getFieldDecorator('expireDate', {
                  initialValue: record.expireDate ? record.expireDate : '',
                  rules: [
                    {
                      required: true,
                      message: '许可到期时间不能为空',
                    },
                  ],
                })(<RangePicker format="YYYY-MM-DD" style={{ width: '80%' }} />)}
              </FormItem>
            </Col>
            <div>
              {issueType ? (
                <Col md={24} sm={24}>
                  <FormItem label="回执编码" {...formItemLayout}>
                    {getFieldDecorator('replyCode', {
                      initialValue: record.replyCode ? record.replyCode : '',
                      rules: [
                        {
                          required: true,
                          message: '回执编码不能为空',
                        },
                      ],
                    })(<Input disabled style={{ width: '80%' }} />)}
                  </FormItem>
                </Col>
              ) : null}
              <Col md={24} sm={24}>
                <FormItem label="登录密码" {...formItemLayout}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: false,
                        message: '登录密码不能为空',
                      },
                    ],
                  })(<Input type="password" disabled={ciphertext} style={{ width: '60%' }} />)}
                  {ciphertext ? (
                    <a style={{ width: '40%' }}>
                      <span className={styles.resetWord} onClick={() => this.exReset()}>
                        重置密码
                      </span>
                    </a>
                  ) : (
                    <a style={{ width: '40%', textAlign: 'right' }}>
                      <span
                        className={styles.resetCancel}
                        style={{ marginLeft: 10 }}
                        onClick={() => this.exReset()}
                      >
                        取消
                      </span>
                    </a>
                  )}
                </FormItem>
              </Col>
            </div>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ textAlign: 'right', marginTop: 30 }}>
            <Button style={{ marginRight: 10 }} onClick={() => this.props.onCancel2()}>
              取消
            </Button>
            <Button style={{ marginRight: 30 }} type="primary" onClick={() => this.sureRevise()}>
              确定
            </Button>
          </Row>
        </Form>
      </div>
    );
  }
}

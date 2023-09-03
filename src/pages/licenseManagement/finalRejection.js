/**
 * 驳回意见
 * * */
import React from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import styles from './index.less';

const { TextArea } = Input;
const FormItem = Form.Item;

@errorBoundary
@Form.create()
@connect(state => ({
  licenseManagement: state.licenseManagement,
}))
export default class FinalRejection extends BaseCrudComponent {
  state = {};

  sureRevise = () => {
    const {
      getList,
      onCancel,
      dispatch,
      form: { validateFields, resetFields },
      id,
    } = this.props;
    validateFields((err, values) => {
      dispatch({
        type: 'licenseManagement/DismissPass',
        payload: {
          checkResult: 0,
          id,
          checkDesc: values.checkDesc,
        },
      }).then(function(response) {
        if (response.status === 200) {
          message.success('驳回成功');
          resetFields();
          getList();
          onCancel();
        } else {
          message.error(response.message);
        }
      });
    });
  };

  cancelForm = () => {
    const { onCancel, form } = this.props;
    form.resetFields();
    onCancel();
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
        sm: { span: 19 },
      },
    };

    return (
      <div className={styles.index} style={{ marginTop: 16 }}>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="驳回意见" {...formItemLayout}>
                {getFieldDecorator('checkDesc', {
                  rules: [
                    {
                      required: true,
                      message: '驳回意见不能为空',
                    },
                  ],
                })(<TextArea rows={4} style={{ width: '80%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ textAlign: 'right', marginTop: 30 }}>
            <Button style={{ marginRight: 10 }} onClick={() => this.cancelForm()}>
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

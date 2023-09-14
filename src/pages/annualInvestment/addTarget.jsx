import React from 'react';
import { Form, Input, Modal, Select, Row, Col } from 'antd';

import request from '@/utils/request';

const FormItem = Form.Item;

class AddTarget extends React.Component {
  state = { inveSecuHoldTime: [] };

  componentDidMount() {
    this.inveSecuHoldTime();
  }
  /**
   * 持有时间
   */
  inveSecuHoldTime() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=inveSecuHoldTime`).then(res => {
      if (res) {
        this.setState({ inveSecuHoldTime: res });
      }
    });
  }
  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // debugger;
        const { editTarget } = this.props;
        this.props.updateTargetList({
          ...editTarget,
          ...values,
        });
      }
    });
  };

  onCancel = () => {
    this.props.updateTargetList();
  };

  render() {
    const {
      isShowAddTarget,
      editTarget: { tradeMark, tradeMarkCode, holdShare, holdTime },
      form: { getFieldDecorator, resetFields },
    } = this.props;
    const { inveSecuHoldTime } = this.state;
    if (!isShowAddTarget) {
      resetFields();
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        width="50vw"
        title="标的类型维护"
        visible={isShowAddTarget}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="标的名称" {...formItemLayout}>
                {getFieldDecorator('tradeMark', {
                  initialValue: tradeMark,
                  rules: [
                    {
                      required: true,
                      message: '标的名称不可为空',
                    },
                  ],
                })(<Input autoComplete="off" disabled={false} placeholder="" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="标的代码" {...formItemLayout}>
                {getFieldDecorator('tradeMarkCode', {
                  initialValue: tradeMarkCode,
                  rules: [
                    {
                      required: true,
                      message: '标的代码不可为空',
                    },
                  ],
                })(<Input autoComplete="off" disabled={false} placeholder="" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="持仓份额" {...formItemLayout}>
                {getFieldDecorator('holdShare', {
                  initialValue: holdShare,
                  rules: [
                    {
                      required: true,
                      message: '持仓份额不可为空',
                    },
                  ],
                })(<Input autoComplete="off" disabled={false} placeholder="" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="持有时间" {...formItemLayout}>
                {getFieldDecorator('holdTime', {
                  initialValue: holdTime,
                  rules: [
                    {
                      required: true,
                      message: '持有时间不可为空',
                    },
                  ],
                })(
                  <Select placeholder="请选择持有时间" disabled={false} showArrow={false}>
                    {inveSecuHoldTime &&
                      inveSecuHoldTime.map(item => (
                        <Select.Option key={item.code}>{item.name}</Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const AddTargetModalForm = Form.create({ name: 'add_target_form' })(AddTarget);

export default AddTargetModalForm;

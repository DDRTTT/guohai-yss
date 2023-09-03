import React from 'react';
import Action from '@/utils/hocUtil';
import { Button, Modal, Form, Input, message } from 'antd';

const { TextArea } = Input;

const ReviewModal = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, isLoading, taskType, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="审核意见"
          onCancel={onCancel}
          footer={
            <>
              <Action
                code={`${
                  taskType === 'fileDelete'
                    ? 'archiveTaskHandleList:fileDeleteReviewNoPass'
                    : 'archiveTaskHandleList:reviewNoPass'
                }`}
              >
                <Button disabled={isLoading} onClick={() => onCreate(0)}>
                  审批拒绝
                </Button>
              </Action>
              <Button disabled={isLoading} type="primary" onClick={() => onCreate(1)}>
                审批通过
              </Button>
            </>
          }
        >
          <Form layout="vertical">
            <Form.Item>
              {getFieldDecorator('opinion', {
                rules: [{ required: true, message: '请输入审核意见！' }],
              })(<TextArea rows={6} placeholder="请输入审核意见~" maxLength={200} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default ReviewModal;

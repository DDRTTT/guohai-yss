import React, { PureComponent } from 'react';
import { Modal, Form, DatePicker, Button } from 'antd';
import Action from '@/utils/hocUtil';
import moment from 'moment';
import { PropsType } from './SetUpTimeModal.d';
import styles from './SetUpTimeModal.less';

const Index = Form.create({ name: 'form_in_modal' })(
  class extends PureComponent<PropsType> {
    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        setUpTime,
        loading,
      } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      };

      return (
        <Modal
          visible={visible}
          title="成立日期"
          onCancel={onCancel}
          footer={
            <>
              <Button onClick={onCancel}>取消</Button>
              <Action code="projectAndSeriesQuery:setUpTimeAdd">
                <Button type="primary" loading={loading} onClick={onCreate}>
                  确定
                </Button>
              </Action>
            </>
          }
        >
          <Form>
            <Form.Item label="成立日期：" {...formItemLayout}>
              {getFieldDecorator('setUpTime', {
                initialValue: setUpTime ? moment(setUpTime) : null,
              })(<DatePicker className={styles.DatePickerWidth} placeholder="请选择成立日期" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default Index;

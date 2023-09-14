import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Button, Form, Input, Radio, Select, DatePicker, InputNumber } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getHandlerCode } from '../common';
const { Option } = Select;
function returnCon({
  dispatch,
  returnVisable,
  setReturnVisable,
  form: { getFieldDecorator, validateFields, resetFields },
  fileBorrower: { persons },
  detail,
}) {
  const [isLate, setIslate] = useState(false);
  useEffect(() => {
    // 借阅人
    if (!persons.length) {
      dispatch({
        type: 'fileBorrower/getPersons',
      });
    }
  }, []);
  const disabledEndDate = returnTime => {
    const borrowedTime = detail.borrowedTime;
    if (!returnTime || !borrowedTime) {
      return false;
    }
    return returnTime.valueOf() <= borrowedTime.valueOf();
  };
  const okClick = () => {
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const payload = { ...values };
        payload.returnTime = moment(payload.returnTime).format('YYYY-MM-DD');
        Modal.confirm({
          title: '确认归还',
          icon: <ExclamationCircleOutlined />,
          content: '是否确认已借阅档案都已归还活延期完毕！',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'fileBorrower/fetModifyApply',
              payload: {
                ...payload,
                id: detail.id,
                flag: getHandlerCode('return'),
              },
            }).then(() => {
              resetFields();
              setReturnVisable(false);
            });
          },
        });
      }
    });
  };
  const cancelClick = () => {
    setReturnVisable(false);
  };
  const hasLate = e => {
    setIslate(e.target.value == true);
  };
  return (
    <div>
      <Modal
        title="归还"
        visible={returnVisable}
        onOk={okClick}
        okText="提交"
        onCancel={cancelClick}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} layout="horizontal">
          <Form.Item label="借阅人">
            {getFieldDecorator('borrower', {
              rules: [{ required: true, message: '请选择借阅人' }],
              initialValue: detail?.borrower ?? '',
            })(
              <Select placeholder="请选择借阅人">
                {persons.map(item => {
                  return (
                    <Option key={item.usercode} value={item.id}>
                      {item.username}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="归还时间">
            {getFieldDecorator('returnTime', {
              rules: [{ required: true, message: '请选择归还时间' }],
              initialValue: detail?.returnTime ? moment(detail.returnTime) : '',
            })(<DatePicker style={{ width: '100%' }} disabledDate={disabledEndDate} />)}
          </Form.Item>
          <Form.Item label="借阅文档数量">
            {getFieldDecorator('borrowedNum', {
              rules: [{ required: true, message: '请填写借阅文档数量' }],
              initialValue: detail.libraryNum,
            })(<InputNumber style={{ width: '100%' }} disabled />)}
          </Form.Item>
          <Form.Item label="归还文档数量">
            {getFieldDecorator('returnedNum', {
              rules: [{ required: true, message: '请填写归还文档数量' }],
            })(<InputNumber style={{ width: '100%' }} max={detail.libraryNum} />)}
          </Form.Item>
          <Form.Item label="是否有档案延期" name="size">
            <Radio.Group onChange={hasLate}>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
            ,
          </Form.Item>
          {isLate && (
            <Form.Item label="延期文档数量">
              {getFieldDecorator('delayedNum', {
                rules: [{ required: true, message: '请填写延期文档数量' }],
              })(<InputNumber style={{ width: '100%' }} max={detail.libraryNum} />)}
            </Form.Item>
          )}
          <Form.Item label="接收人">
            {getFieldDecorator('recipient', {
              rules: [{ required: true, message: '请选择接收人' }],
              initialValue: '',
            })(
              <Select placeholder="请选择接收人">
                {persons.map(item => {
                  return (
                    <Option key={item.usercode} value={item.id}>
                      {item.username}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const WrappedReturnCon = errorBoundary(
  Form.create()(
    connect(({ fileBorrower }) => ({
      fileBorrower,
    }))(returnCon),
  ),
);

export default WrappedReturnCon;

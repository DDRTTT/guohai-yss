import React, { Component } from 'react';
import { Form, Input, Select, Row, Card, Col, Button, Radio, Modal, Table, DatePicker } from 'antd';
import { connect } from 'dva';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import moment from 'moment';
import { handleValidator } from '@/utils/utils';

const FormItem = Form.Item;

class AddAccount extends React.Component {
  state = {};

  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (values.positionStartDate) {
        values.positionStartDate = moment(values.positionStartDate).format('YYYY-MM-DD');
      }
      if (values.positionEndDate) {
        values.positionEndDate = moment(values.positionEndDate).format('YYYY-MM-DD');
      }
      if (!err) {
        // debugger;
        const { editAccount } = this.props;
        this.props.updateAccountList({
          ...editAccount,
          ...values,
        });
      }
    });
  };

  onCancel = () => {
    this.props.updateAccountList();
  };

  handleOrgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 200, '任职公司名称过长');
  };

  handleDepartmentValidator = (rule, value, callback) => {
    handleValidator(value, callback, 200, '任职部门名称过长');
  };

  handleHeldPositionValidator = (rule, value, callback) => {
    handleValidator(value, callback, 200, '担任职位名称过长');
  };

  render() {
    const {
      isShowAddAccount,
      editAccount: { orgName, department, heldPosition, positionStartDate, positionEndDate },
      form: { getFieldDecorator, resetFields },
    } = this.props;
    if (!isShowAddAccount) {
      resetFields();
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="新增履历信息"
        visible={isShowAddAccount}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <FormItem name="orgName" label="任职公司名称:" {...formItemLayout}>
            {getFieldDecorator('orgName', {
              rules: [
                { required: true, message: '请输入任职公司名称', whitespace: true },
                { validator: this.handleOrgNameValidator },
              ],
              initialValue: orgName,
            })(<Input autoComplete="off" allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="department" label="任职部门:" {...formItemLayout}>
            {getFieldDecorator('department', {
              rules: [{ validator: this.handleDepartmentValidator }],
              initialValue: department,
            })(<Input autoComplete="off" allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="heldPosition" label="担任职位:" {...formItemLayout}>
            {getFieldDecorator('heldPosition', {
              rules: [{ validator: this.handleHeldPositionValidator }],
              initialValue: heldPosition,
            })(<Input autoComplete="off" allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="positionStartDate" label="任职开始日期:" {...formItemLayout}>
            {getFieldDecorator('positionStartDate', {
              initialValue: positionStartDate ? moment(positionStartDate) : null,
            })(<DatePicker />)}
          </FormItem>
          <FormItem name="positionEndDate" label="任职结束日期:" {...formItemLayout}>
            {getFieldDecorator('positionEndDate', {
              initialValue: positionEndDate ? moment(positionEndDate) : null,
            })(<DatePicker />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const AddAccountModalForm = Form.create({ name: 'add_account_form' })(AddAccount);

export default AddAccountModalForm;

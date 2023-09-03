import React, { Component } from 'react';
import { Form, Input, Select, Row, Card, Col, Button, Radio, Modal, Table } from 'antd';

import { connect } from 'dva';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';

const FormItem = Form.Item;

class AddAccountForm extends React.Component {
  state = {};

  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
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

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { isShowAddAccount, editAccount, bankList, businessTypeList = [] } = this.props;
    console.log(businessTypeList);
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
        title="新增账户信息"
        visible={isShowAddAccount}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
      >
        <Form>
          <FormItem name="accountName" label="账户名:" {...formItemLayout}>
            {getFieldDecorator('accountName', {
              rules: [{ required: true, message: '请输入账户名', whitespace: true }],
              initialValue: editAccount.accountName,
            })(<Input maxLength={50} allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="salesAccountBizTypeList" label="账户业务类型:" {...formItemLayout}>
            {getFieldDecorator('salesAccountBizTypeList', {
              rules: [
                { required: true, message: '请选择账户业务类型' },
                // {
                //   validator: (rule, value, callback) => {
                //     if (!value) callback();
                //     try {
                //       if (
                //         value.includes('X019_1') ||
                //         value.includes('X019_2') ||
                //         value.includes('X019_3') ||
                //         value.includes('X019_4')
                //       ) {
                //         if (
                //           value.every(val =>
                //             ['X019_1', 'X019_2', 'X019_3', 'X019_4'].includes(val),
                //           ) &&
                //           value.length == 4
                //         ) {
                //           callback();
                //         } else if (value.length > 4) {
                //           callback();
                //         } else {
                //           callback(
                //             '账户业务类型：资管清算岗在使用销售商往来账户信息时需要有明确的业务类型，销售机构维护时必须明确“申购付款账户”、“认购退款收款账户”、“赎回分红款收款账户”、“销售服务费收款账户”这四类业务类型',
                //           );
                //         }
                //       } else {
                //         callback();
                //       }
                //     } catch (error) {
                //       callback();
                //     }
                //     callback();
                //   },
                // },
              ],
              initialValue: editAccount.salesAccountBizTypeList,
            })(
              <Select
                optionFilterProp="children"
                allowClear
                showSearch
                placeholder="请选择账户业务类型"
                mode="multiple"
              >
                {businessTypeList.map(item => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem name="accountNo" label="账号:" {...formItemLayout}>
            {getFieldDecorator('accountNo', {
              rules: [{ required: true, message: '请输入账号', whitespace: true }],
              initialValue: editAccount.accountNo,
            })(<Input maxLength={50} allowClear placeholder="请输入" />)}
          </FormItem>
          {/* <FormItem name="openingInstitution" label="开户行:" {...formItemLayout}>
                        {getFieldDecorator('openingInstitution', {
                            initialValue: editAccount.openingInstitution,
                        })(<Input maxLength={16} allowClear placeholder="请输入" />)}
                    </FormItem> */}
          <FormItem label="开户行" {...formItemLayout}>
            {getFieldDecorator('openingInstitution', {
              initialValue: editAccount.openingInstitution,
            })(
              <Select
                optionFilterProp="children"
                allowClear
                showSearch
                placeholder="请选择开户行"
              >
                {bankList &&
                  bankList.length > 0 &&
                  bankList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.orgName}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </FormItem>
          <FormItem name="bankNo" label="联行号:" {...formItemLayout}>
            {getFieldDecorator('bankNo', {
              initialValue: editAccount.bankNo,
            })(<Input maxLength={50} allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="paymentNo" label="大额支付号:" {...formItemLayout}>
            {getFieldDecorator('paymentNo', {
              initialValue: editAccount.paymentNo,
            })(<Input maxLength={50} allowClear placeholder="请输入" />)}
          </FormItem>
          <FormItem name="purpose" label="用途:" {...formItemLayout}>
            {getFieldDecorator('purpose', {
              initialValue: editAccount.purpose,
            })(<Input allowClear placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const AddAccountModalForm = Form.create({ name: 'add_account_form' })(AddAccountForm);

export default AddAccountModalForm;

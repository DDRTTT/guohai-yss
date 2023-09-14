import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, message, Modal, Row } from 'antd';
import AuthorizationPad from '../assembly/authorityPreview';
import styles from '../Less/dataLicense.less';
import { getSession } from '@/utils/session';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const FormItem = Form.Item;

@Form.create()
@connect(({ role, licenseChecked }) => ({
  licenseChecked,
  role,
}))
export default class addRole extends PureComponent {
  state = {
    selectedActions: null,
    addRoleLoading: false,
  };

  // 关闭弹窗
  cancelQuotationOpt = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.props.closeModal();
    this.setState({
      addRoleLoading: false,
    });
  };

  // 修改组件权限
  commitApplication = () => {
    const sysId = getSession('sysId');
    const firstSysId = sysId?.split(',')[0] || '1';
    const {
      role: { actions, basics },
      dispatch,
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ addRoleLoading: true });
        const { ...newV } = values;
        newV.actionsList = this.state.selectedActions ? this.state.selectedActions : actions;
        newV.id = basics?.id;
        newV.type = basics?.type;
        if (newV.actionsList && newV.actionsList.length > 0) {
          dispatch({
            type: 'role/addRole',
            payload: { ...newV, sysId: firstSysId },
          }).then(res => {
            if (res && res.status === 200) {
              this.cancelQuotationOpt();
              this.setState({ addRoleLoading: false, selectedActions: [] });
            }
          });
        } else {
          message.error('请至少为该组件选择一个权限点');
          this.setState({ addRoleLoading: false });
        }
      }
    });
  };

  onSelectedActionsChange = selectedActions => {
    this.setState({ selectedActions });
  };

  render() {
    const {
      role: { actions, saveAllMenuTreeCode },
      form: { getFieldDecorator },
    } = this.props;
    const { addRoleLoading } = this.state;
    const chooseRole = sessionStorage.getItem('chooseRole');

    return (
      <Modal
        visible={this.props.visible}
        title={chooseRole === '0' ? '新增组件' : chooseRole === '01' ? '授权组件' : '功能组件'}
        okText="提交"
        cancelText="取消"
        onCancel={this.cancelQuotationOpt}
        width="90%"
        onOk={this.commitApplication}
        destroyOnClose
        confirmLoading={addRoleLoading}
      >
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem label="组件名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: this.props.basics.name,
                  rules: [
                    {
                      required: true,
                      message: '组件名称不能为空',
                    },
                  ],
                })(
                  <Input className={styles.roleNameStyle} disabled placeholder="请输入组件名称" />,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="组件描述" {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: this.props.basics.description,
                })(<Input className={styles.roleNameStyle} placeholder="请进行组件描述" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <AuthorizationPad
          authorizes={this.props.authorizes}
          allowedModifying
          selectedActions={actions}
          onSelectedActionsChange={this.onSelectedActionsChange}
          allMenuTreeCode={saveAllMenuTreeCode}
          // update={false}
          // selectedActions={this.props.selectedActions}
        />
      </Modal>
    );
  }
}

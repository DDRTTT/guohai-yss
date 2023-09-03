import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Modal, Radio, Row } from 'antd';
import styles from '../Less/dataLicense.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
@Form.create()
@connect(state => ({
  userLicense: state.userLicense,
}))
export default class addConfig extends PureComponent {
  state = {
    optCtrl: true,
    sortRole: 0,
    classRoleChoose: `${styles.personType} ${styles.roleChoose}`,
    classRole: styles.personType,
    disabledRole: `${styles.personType} ${styles.disabledRole}`,
    roleKind: 0,
    autoConfigValue: 0,
  };

  /**  关闭弹窗  * */
  cancelQuotationOpt = e => {
    const { form } = this.props;
    form.resetFields();
    this.props.closeAdd();
  };

  commitApplication = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {
        dispatch,
        userLicense: { userInfo },
      } = this.props;
      const appedOrgId = [];
      for (let i = 0; i < userInfo.data.typeState.length; i++) {
        if (userInfo.data.typeState[i].ctrlStyle == 1) {
          appedOrgId.push(userInfo.data.typeState[i].appedOrgId);
        }
      }
      if (appedOrgId.length == 0) {
        message.error('请至少选择一个功能组件进行授权');
      } else if (!err) {
        /**  提交新增  * */
        const { ...newV } = values;
        newV.appedOrgId = appedOrgId;
        newV.appedState = 1;
        dispatch({
          type: 'userLicense/commitApplication',
          payload: newV,
        });
      }
    });
  };

  optRole = () => {
    return '';
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  // 版本组件标签
  versionRole = () => {
    // return (
    //   <div></div>
    // )
    const {
      userLicense: { userInfo },
    } = this.props;
    if (userInfo) {
      if (userInfo.data) {
        if (userInfo.data.typeState) {
          return userInfo.data.typeState.map((info, index) => {
            return (
              <div
                disabled={info.appedState == 1}
                className={
                  info.appedState == 1
                    ? this.state.disabledRole
                    : info.ctrlStyle == 0 || !info.ctrlStyle
                    ? this.state.classRole
                    : this.state.classRoleChoose
                }
                onClick={() => this.changeRole(info, index)}
              >
                {info.appedOrgTypeName}
              </div>
            );
          });
        }
        return <div />;
      }
      return <div />;
    }
    return <div />;
  };

  changeRole = (info, index) => {
    const {
      userLicense: { userInfo },
      dispatch,
    } = this.props;
    if (userInfo.data.typeState[index].appedState != 1) {
      dispatch({
        type: 'userLicense/dataChange',
        payload: {
          data: userInfo,
          index,
        },
      });
    } else {
      message.error('无法对授权中的组件授权，请重新选择！！');
    }
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.userLicense.addResult == 1) {
      const { form } = this.props;
      nextProps.userLicense.addResult = 0;
      form.resetFields();
      this.props.closeAdd();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
    return (
      <Modal
        visible={this.props.visible}
        title="申请授权"
        okText="提交"
        cancelText="取消"
        onCancel={() => this.cancelQuotationOpt()}
        width={800}
        onOk={() => this.commitApplication()}
      >
        <Form>
          <div className={styles.tableListForm}>
            <Row className={styles.rowStyle} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <FormItem label="申请机构：" {...formItemLayout}>
                {getFieldDecorator(
                  'appDesc1',
                  {},
                )(
                  <img
                    className={styles.imgStyles}
                    src={this.props.data.data ? this.props.data.data.appedOrgLogo : ''}
                  />,
                )}
              </FormItem>
              <FormItem label="版本组件：" {...formItemLayout}>
                {getFieldDecorator('appedRoleType', {})(<div>{this.versionRole()}</div>)}
              </FormItem>
              <FormItem label="申请人机构：" {...formItemLayout}>
                {getFieldDecorator(
                  'appOrgName',
                  {},
                )(<div>{this.props.data.data ? this.props.data.data.appOrgName : ''}</div>)}
              </FormItem>
              <FormItem label="组织机构代码：" {...formItemLayout}>
                {getFieldDecorator('appedOrgCode')(
                  <div>{this.props.data.data ? this.props.data.data.appedOrgCode : ''}</div>,
                )}
              </FormItem>
              <FormItem label="经办人：" {...formItemLayout}>
                {getFieldDecorator(
                  'appName',
                  {},
                )(<div>{this.props.data.data ? this.props.data.data.appName : ''}</div>)}
              </FormItem>
              <FormItem label="联系方式：" {...formItemLayout}>
                {getFieldDecorator(
                  'appPhone',
                  {},
                )(<div>{this.props.data.data ? this.props.data.data.appPhone : ''}</div>)}
              </FormItem>
              <FormItem label="申请描述：" {...formItemLayout}>
                {getFieldDecorator(
                  'appDesc',
                  {},
                )(
                  <TextArea
                    placeholder="请在此描述申请的理由或其它"
                    autosize={{ minRows: 3, maxRows: 6 }}
                  />,
                )}
              </FormItem>
            </Row>
          </div>
        </Form>
      </Modal>
    );
  }
}

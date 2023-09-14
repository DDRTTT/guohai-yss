import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import { nsHoc } from '@/utils/hocUtil';
import delay from 'lodash/delay';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { PageContainers } from '@/components';
const FormItem = Form.Item;
const Option = Select.Option;

@errorBoundary
@nsHoc({ namespace: 'institutionalAuditQuery' })
@Form.create()
@connect(state => ({
  institutionalAuditQuery: state.institutionalAuditQuery,
  CompanyType: state.CompanyType,
}))
export default class addUser extends Component {
  state = {
    data: [],
    action: null,
    id: null,
    autoCompleteResult: [],
    confirmDirty: false,
    handlerSaveDisable: false,
  };

  componentDidMount() {
    const { dispatch, namespace } = this.props;
    let basic = {
      code: 'orgType',
    };
    dispatch({
      type: `${namespace}/handleCompanyTypeQuery`,
      payload: basic,
    });
  }

  componentWillReceiveProps(props) {
    const {
      namespace,
      dispatch,
      institutionalAuditQuery: { addUserStatus },
    } = this.props;
    if (addUserStatus) {
      // 添加成功跳转到列表页面
      dispatch(routerRedux.push('/datum/institutionalAuditQuery/index'));
      // 清除添加成功的状态
      dispatch({
        type: `${namespace}/handleClean`,
        payload: false,
      });
    } else {
      delay(this.handleNodeSelect, 1000);
    }
  }

  handleNodeSelect = () => {
    this.setState({
      handlerSaveDisable: false,
    });
  };

  // 取消
  showModalclose = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/datum/institutionalAuditQuery/index'));
  };

  // selection
  getforgtype = e => {
    let children = [];
    for (var key in e) {
      children.push(
        <Option key={e[key].code} value={e[key].code}>
          {e[key].name}
        </Option>,
      );
    }
    return <Select style={{ width: '100%' }}>{children}</Select>;
  };

  // 密码一致验证
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  action = () => {
    return (
      <div>
        <Button type="primary" disabled={this.state.handlerSaveDisable} onClick={this.handlerSave}>
          保存
        </Button>
        <Button onClick={this.showModalclose}>取消</Button>
      </div>
    );
  };

  // 注册人机构信息
  title = () => {
    const {
      form,
      institutionalAuditQuery: { companyType },
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="机构名称">
            {getFieldDecorator('orgName', {
              // initialValue: (this.state.action == "add" ? null : basic.orgName),
              rules: [
                { required: true, message: '请输入机构名称' },
                { max: 100, message: '不能超过100个字符!' },
              ],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="机构代码">
            {getFieldDecorator('orgCode', {
              // initialValue: (this.state.action == "add" ? null : basic.orgId),
              rules: [
                { required: true, message: '请输入全国组织机构统一社会信用代码' },
                { max: 20, message: '不能超过20个字符!' },
              ],
            })(<Input placeholder="请输入全国组织机构统一社会信用代码" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="机构类型">
            {getFieldDecorator('orgType', {
              // initialValue: (this.state.action == "add" ? null : basic.orgType),
              rules: [
                { required: true, message: '请输入机构类型' },
                { max: 100, message: '不能超过100个字符!' },
              ],
            })(this.getforgtype(companyType))}
          </FormItem>
        </Col>
      </Row>
    );
  };

  // 注册人信息
  basic = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="用户名">
            {getFieldDecorator('code', {
              rules: [
                { required: true, message: '请输入用户名' },
                { max: 20, message: '不能超过20个字符!' },
              ],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="邮箱地址">
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: '不是有效的E-mail!' },
                { required: true, message: '请输入邮箱地址' },
              ],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="手机号码">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  pattern: new RegExp(
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                  ),
                  message: '请输入正确手机号码!',
                },
                { required: true, message: '请输入手机号码' },
              ],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="登录密码">
            {getFieldDecorator('pwd', {
              rules: [{ required: true, message: '请输入密码' }],
            })(<Input type="password" placeholder="请输入" maxLength="20" />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="确认密码">
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: '请确认密码' },
                { validator: this.compareToFirstPassword },
              ],
            })(
              <Input
                type="password"
                placeholder="请输入"
                onBlur={this.handleConfirmBlur}
                maxLength="20"
              />,
            )}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="身份证号">
            {getFieldDecorator('usernum', {
              rules: [
                {
                  pattern: new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/),
                  message: '请输入正确身份证号!',
                },
                { required: true, message: '请输入身份证号' },
              ],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>

        <Col md={8} sm={24}>
          <FormItem label="经办人">
            {getFieldDecorator('handler', {
              rules: [{ required: true, message: '请输入经办人' }],
            })(<Input placeholder="请输入" disabled={false} />)}
          </FormItem>
        </Col>
      </Row>
    );
  };

  /**
   * 保存
   * @param e
   */
  handlerSave = e => {
    e.preventDefault();
    const { dispatch, form, namespace } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue, 'fieldsValue');
      if (err) return;
      const values = {
        sysId: 0,
        ...fieldsValue,
      };
      this.setState({
        handlerSaveDisable: true,
      });
      dispatch({
        type: `${namespace}/handleAddUser`,
        payload: values,
      });
    });
  };

  showmessage = (title, descr) => {
    message.success(descr);
  };

  render() {
    const {
      institutionalAuditQuery: { data },
    } = this.props;
    return (
      //   <PageHeaderLayout father_url="/base/institutionalAuditQuery">
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '系统运营管理',
              url: '',
            },
            {
              title: '注册审核授权',
              url: '/datum/institutionalAuditQuery/index',
            },
          ]}
          fuzz={''}
        />
        <Form onSubmit={this.handlerSave} layout="inline">
          <div className={styles.tableListForm}>
            {/*注册人机构信息*/}
            <Card
              bordered={false}
              title="注册人机构信息"
              style={{ marginBottom: 24 }}
              extra={this.action(data)}
            >
              {this.title(data)}
            </Card>

            {/*注册人信息*/}
            <Card title="注册人信息" style={{ marginBottom: 24 }} bordered={false}>
              <div>
                <Row>
                  <Col span={24}>{this.basic(data)}</Col>
                </Row>
              </div>
            </Card>
          </div>
        </Form>
      </>
      //   </PageHeaderLayout>
    );
  }
}

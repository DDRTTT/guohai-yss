import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Form, Input, Radio, Row, Select, TreeSelect } from 'antd';
import Action from '@/utils/hocUtil';
import delay from 'lodash/delay';
import styles from './relatedProducts.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ memberManagement, loading }) => ({
  memberManagement,
  loading: loading.effects['memberManagement/handleOrgInfoById'],
  handleUserInfoLoading: loading.effects['memberManagement/handleUserInfo'],
}))
export default class Index extends Component {
  state = {
    data: [],
    value: 1,
  };

  componentDidMount() {
    this.props.save(this);
    const { dispatch } = this.props;

    // 机构名称
    dispatch({
      type: `memberManagement/handleOrgName`,
    });
    // 请求,登录用户的机构
    dispatch({
      type: `memberManagement/handleUserInfo`,
    }).then(res => {
      if (res?.status === 200) {
        this.onChangeforgId(res?.data[0]?.orgId);
      }
    });
    // ‘机构类型’词汇字典
    dispatch({
      type: `memberManagement/handleOrgTypeDictionary`,
      payload: 'orgType',
    });

    // 清空已选择的机构信息
    dispatch({
      type: `memberManagement/saveOrgInfo`,
      payload: {},
    });
    // 清空手机号
    dispatch({
      type: `memberManagement/saveUserMobile`,
      payload: '',
    });
    // 清空基本信息
    dispatch({
      type: `memberManagement/saveMobileQueryInfo`,
      payload: {},
    });
  }

  // 选择机构名称时，请求，已选择的机构的信息
  onChangeforgId = value => {
    this.setState({
      orgId: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleOrgInfoById`,
      payload: value,
    });
  };

  // 已有机构基本信息
  existingInstitutionInfo = () => {
    const {
      memberManagement: {
        saveOrgName,
        saveOrgInfo: { orgCode, orgName, orgTypeName },
      },
      form: { getFieldDecorator },
    } = this.props;

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
      <Form onSubmit={this.props.handleSubmit}>
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.basic}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem label="机构名称" {...formItemLayout}>
                  {getFieldDecorator('orgName', {
                    rules: [{ required: true, message: '请选择机构名称' }],
                    initialValue: orgName,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={saveOrgName}
                      placeholder="请选择机构名称"
                      treeDefaultExpandAll
                      onSelect={this.onChangeforgId}
                      showSearch
                      treeNodeFilterProp="label"
                    />,
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="机构类型" {...formItemLayout}>
                  {getFieldDecorator('orgTypeName', {
                    initialValue: orgTypeName,
                  })(<Input disabled />)}
                </FormItem>
              </Col>

              {/* <Col md={12} sm={24}>
                <FormItem label="机构简称" {...formItemLayout}>
                  {
                    getFieldDecorator(
                      'orgShortName', {
                        initialValue: orgShortName,
                      },
                    )(<Input disabled/>)
                  }
                </FormItem>
              </Col> */}

              <Col md={12} sm={24}>
                <FormItem label="机构代码" {...formItemLayout}>
                  {getFieldDecorator('orgCode', {
                    initialValue: orgCode,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    );
  };

  validateOrgName = (rule, value, callback) => {
    // var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    // if (!patrn.test(value)) {
    //   callback();
    //   return false;
    // }
    // callback('请输入正确机构名称');
    return true;
  };

  validateOrgCode = (rule, value, callback) => {
    // var patrn = /^[\da-z]+$/im;
    // if (patrn.test(value)) {
    //   callback();
    //   return false;
    // }
    // callback('请输入正确机构代码');
    return true;
  };

  // 新增机构基本信息
  newInstitutionInfo = () => {
    const {
      memberManagement: { saveOrgTypeDictionary },
    } = this.props;
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
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Card style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.basic}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem label="机构名称" {...formItemLayout}>
                  {getFieldDecorator('orgName', {
                    rules: [
                      { validator: this.validateOrgName },
                      { required: true, message: '请输入机构名称' },
                      { max: 50, message: '不能超过50个字符' },
                    ],
                    initialValue: '',
                  })(<Input placeholder="请输入机构名称" disabled={false} />)}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="机构类型" {...formItemLayout}>
                  {getFieldDecorator('orgType', {
                    rules: [{ required: true, message: '请选择机构类型' }],
                    initialValue: '',
                  })(this.getforgtype(saveOrgTypeDictionary))}
                </FormItem>
              </Col>

              {/* <Col md={12} sm={24}>
                <FormItem label="机构简称" {...formItemLayout}>
                  {
                    getFieldDecorator(
                      'orgShortName', {
                        rules: [
                          { required: true, message: '请输入机构简称' },
                        ],
                        initialValue: '',
                      })(<Input placeholder="请输入机构简称" disabled={false}/>)
                  }
                </FormItem>
              </Col> */}

              <Col md={12} sm={24}>
                <FormItem label="机构代码" {...formItemLayout} help="统一社会信用代码/组织机构代码">
                  {getFieldDecorator('orgCode', {
                    rules: [
                      { validator: this.validateOrgCode },
                      { required: true, message: '请输入机构代码' },
                      { max: 18, message: '不能超过18个字符' },
                    ],
                    initialValue: '',
                  })(<Input placeholder="请输入机构代码" disabled={false} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    );
  };

  // radio选择
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
    this.props.form.resetFields();
  };

  // 提交，并下一步
  handleSubmit = () => {
    const { form } = this.props;
    const { value } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      if (!err) {
        switch (value) {
          case 1:
            // 缓存信息
            this.handleCacheInfo(values, value);
            break;
          case 2:
            // 创建机构
            this.handleSaveInfo(values);
            break;
          default:
        }
      }
    });
  };

  // 缓存信息
  handleCacheInfo = (val, orgBool) => {
    const {
      dispatch,
      memberManagement: { saveCurrent },
    } = this.props;
    dispatch({
      type: `memberManagement/handleCacheInfo`,
      payload: {
        orgBool,
        val,
        current: saveCurrent,
      },
    });
    dispatch({
      type: `memberManagement/handleStep`,
      payload: saveCurrent + 1,
    });
  };

  // 创建机构
  handleSaveInfo = val => {
    const {
      dispatch,
      memberManagement: { saveCurrent },
    } = this.props;
    dispatch({
      type: `memberManagement/handleSaveOrg`,
      payload: {
        val,
        current: saveCurrent,
      },
    });
  };

  // selection
  getforgtype = e => {
    const children = [];
    for (let i = 0; i < e.length; i++) {
      children.push(
        <Option key={e[i].code} value={e[i].code}>
          {e[i].name}
        </Option>,
      );
    }
    return (
      <Select style={{ width: '100%', height: 30 }} allowClear placeholder="请输入">
        {children}
      </Select>
    );
  };

  render() {
    const { value } = this.state;
    const { loading, handleUserInfoLoading } = this.props;
    return (
      <Card bordered={false} loading={loading || handleUserInfoLoading}>
        <RadioGroup onChange={this.onChange} value={this.state.value}>
          <Radio value={1}>已有机构</Radio>
          <Action key="memberManagement:addOrg" code="memberManagement:addOrg">
            <Radio value={2}>新增机构</Radio>
          </Action>
        </RadioGroup>
        <div className={styles.content}>
          {value === 1 ? this.existingInstitutionInfo() : this.newInstitutionInfo()}
        </div>
      </Card>
    );
  }
}

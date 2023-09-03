
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Input, Modal, Breadcrumb, Row, Col, Icon, Button, Table, Select, message, Spin } from 'antd';
import styles from './dataSource.less';
import { Card, PageContainers } from '@/components';
import { getSession } from '@/utils/session';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;


@Form.create()
class Index extends Component {
  state = {
    type: '',
    loading: false,
    record: {},
    title: '新增',
    orgLoading: false,
    orgData: [],
    yssLoading: false,
    dropDownData: [],
    id: '',
  };

  componentDidMount() {
    const id = this.props.location?.query?.id || '';
    const type = this.props.location?.query?.type || '';
    if (id) {
      this.setState({ id, title: '修改', type, loading: true });
      this.props.dispatch({
        type: 'dataSource/getDetails',
        payload: { id }
      }).then(res => {
        if (res) {
          this.setState({ record: res, loading: false })
        }
        this.setState({ loading: false })
      })
    }
    this.getOrgData();
    this.getDropdownData();

  }

  // 获取所有机构（用于下拉框的option）
  getOrgData = () => {
    this.setState({ orgLoading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/getOrgData',
        payload: { "isOut": true, "pageNum": 1, "pageSize": 9999 }
      }).then(res => {
        if (res) {
          this.setState({ orgData: res })
        }
        this.setState({ orgLoading: false })
      })
    })
  }

  // 获取下拉框(归属系统)
  getDropdownData = () => {
    this.setState({ yssLoading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/getDropdownData',
        payload: { codeList: 'attributionSystem' }
      }).then(res => {
        if (res) {
          this.setState({ dropDownData: res })
        }
        this.setState({ yssLoading: false })
      })
    })
  }

  jumpBack = () => {
    this.props.dispatch(routerRedux.push('../dataSourceManage'))
  }

  dataSourceAdd = () => {
    const { type } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      let payload = { ...vals };
      if (type === 'ORACLE') {
        payload = { ...vals, [vals.prefix]: vals.txt }
      }
      this.setState({ loading: true }, () => {
        dispatch({
          type: `dataSource/${type.toLowerCase()}`,
          payload,
        }).then(res => {
          this.setState({ loading: false });
          if (res) {
            message.success('操作成功！');
            this.jumpBack();
          }
        })
      })
    })
  }

  dataSourceUpdate = () => {
    const { type, record } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      let payload = { ...vals, code: record.code };
      if (type === 'ORACLE') {
        payload = { ...vals, code: record.code, [vals.prefix]: vals.txt }
      }
      this.setState({ loading: true }, () => {
        dispatch({
          type: `dataSource/${type.toLowerCase()}Update`,
          payload,
        }).then(res => {
          this.setState({ loading: false });
          if (res) {
            message.success('操作成功！');
            this.jumpBack();
          }
        })
      })
    })
  }

  submit = () => {
    const { id } = this.state;
    if (id) {
      this.dataSourceUpdate();
    } else {
      this.dataSourceAdd();
    }
  }

  testConnect = () => {
    const { type } = this.state;
    const { dispatch, form } = this.props;
    if (type === 'MYSQL') {
      form.validateFields(['jdbcUrl', 'port', 'dataBaseName', 'username', 'password'], (err, vals) => {
        if (err) return;
        this.setState({ loading: true }, () => {
          dispatch({
            type: 'dataSource/mysqlTest',
            payload: { ...vals },
          }).then(res => {
            if (res) {
              message.success('测试通过！');
            }
            this.setState({ loading: false });
          })
        })
      })
    } else if (type === 'ORACLE') {
      form.validateFields(['jdbcUrl', 'port', 'prefix', 'txt', 'username', 'password'], (err, vals) => {
        if (err) return;
        this.setState({ loading: true }, () => {
          dispatch({
            type: 'dataSource/oracleTest',
            payload: { ...vals, [vals.prefix]: vals.txt }
          }).then(res => {
            if (res) {
              message.success('测试通过！');
            }
            this.setState({ loading: false });
          })
        })
      })

    } else {
      message.warn('请先选择数据源类型！')
    }

  }

  typeChange = val => {
    this.setState({ type: val }, () => {
      this.props.form.resetFields(['prefix', 'orgId', 'sysId', 'name', 'jdbcUrl', 'port', 'dataBaseName', 'txt', 'username', 'password']);
    })
  }


  render() {
    const { type, loading, record, title, orgLoading, orgData, yssLoading, dropDownData } = this.state;
    const loginOrgId = getSession('loginOrgId');
    const loginId = getSession('loginId');
    const { getFieldDecorator } = this.props.form;
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

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: record?.serverName ? 'serverName' : 'sid',
    })(
      <Select style={{ width: 100 }}>
        <Option key='sid' value="sid">sid</Option>
        <Option key='serverName' value="serverName">服务名</Option>
      </Select>,
    );

    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品要素管理',
              url: '',
            },
            {
              title: '数据源管理',
              url: '/productEle/dataSourceManage',
            },
            {
              title: `数据源${title}`,
              url: '',
            },
          ]}
        />
        <Card title={`数据源${title}`}>
          <Spin spinning={loading}>
            <Form>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="数据源类型:" {...formItemLayout}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择数据源类型' }],
                      initialValue: record?.type,
                    })(
                      <Select onChange={val => this.typeChange(val)} placeholder='请选择数据源类型' showSearch optionFilterProp="children">
                        <Option key='MYSQL' value='MYSQL'>MYSQL</Option>
                        <Option key='ORACLE' value='ORACLE'>ORACLE</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <Spin size='small' spinning={orgLoading}>
                    <FormItem label="归属机构:" {...formItemLayout}>
                      {getFieldDecorator('orgId', {
                        rules: [{ required: true, message: '请选择归属机构' }],
                        initialValue: loginId === '1' ? record?.orgId : loginOrgId,
                      })(
                        <Select placeholder='请选择归属机构' disabled={loginId === '1' ? false : true} showSearch optionFilterProp="children">
                          {orgData.length > 0 && orgData.map(item => (
                            <Option key={item.id} value={item.id}>{item.orgName}</Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Spin>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <Spin size='small' spinning={yssLoading}>
                    <FormItem label="归属系统:" {...formItemLayout}>
                      {getFieldDecorator('sysId', {
                        rules: [{ required: true, message: '请选择归属系统' }],
                        initialValue: record?.sysId,
                      })(
                        <Select placeholder='请选择归属系统' showSearch optionFilterProp="children">
                          {dropDownData?.attributionSystem?.length > 0 && dropDownData.attributionSystem.map(item => (
                            <Option key={item.code} value={item.code}>{item.name}</Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Spin>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="数据源名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入数据源名称' }],
                      initialValue: record?.name,
                    })(
                      <Input placeholder='请输入数据源名称' />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="主机地址:" {...formItemLayout}>
                    {getFieldDecorator('jdbcUrl', {
                      rules: [{ required: true, message: '请输入主机地址' }],
                      initialValue: record?.jdbcUrl,
                    })(
                      <Input placeholder='请输入主机地址' />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="端口号:" {...formItemLayout}>
                    {getFieldDecorator('port', {
                      rules: [{ required: true, message: '请输入端口号' }],
                      initialValue: record?.port,
                    })(
                      <Input placeholder='请输入端口号' />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              {type === 'MYSQL' && <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="数据库名称:" {...formItemLayout}>
                    {getFieldDecorator('dataBaseName', {
                      rules: [{ required: true, message: '请输入数据库名称' }],
                      initialValue: record?.dataBaseName,
                    })(
                      <Input placeholder='请输入数据库名称' />,
                    )}
                  </FormItem>
                </Col>
              </Row>}
              {type === 'ORACLE' && <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="实例名:" {...formItemLayout}>
                    {getFieldDecorator('txt', {
                      rules: [{ required: true, message: '请输入名称' }],
                      initialValue: record?.sid || record?.serverName,
                    })(
                      <Input addonBefore={prefixSelector} placeholder='请输入名称' />,
                    )}
                  </FormItem>
                </Col>
              </Row>}
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="用户名:" {...formItemLayout}>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入用户名' }],
                      initialValue: record?.username,
                    })(
                      <Input placeholder='请输入用户名' />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="口令:" {...formItemLayout}>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入口令' }],
                      initialValue: record?.password,
                    })(
                      <Input placeholder='请输入口令' />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <div style={{ marginBottom: 10 }}>
                <Row>
                  <Col span={4}></Col>
                  <Col span={18} style={{ marginBottom: 10 }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={this.submit}>确定</Button>
                    <Button style={{ marginRight: 8 }} onClick={this.jumpBack}>取消</Button>
                    <Button onClick={this.testConnect}>测试</Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </Spin>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ dataSource }) => ({ dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

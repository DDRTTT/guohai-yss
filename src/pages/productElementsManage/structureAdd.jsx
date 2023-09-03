import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Row, Col, Input, Select, Spin } from 'antd';
import styles from './productElements.less';
import { Card, PageContainers } from '@/components';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    record: {},
    title: '',
    dropDownData: {},
  };
  componentDidMount() {
    const record = this.props?.location?.data;
    this.setState({ record, title: record?.flag === 'structureUpdate' ? '修改' : '新增' });
    this.getDropDownData();
  }

  jumpBack = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../productElementsList',
        data: { activeKey: 'structure' },
      }),
    );
  };

  // 获取 select 下啦数据
  getDropDownData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getDropdownData',
        payload: {
          codeList:
            'columnAuthType,plmSysPEDataSubject,attributionSystem,plmSysPESubjectTopCategory,plmSysPESubjectSecondCategory,plmSysPESubjectThirdCategory,plmSysPEBusinessScenario,plmSysPEBusinessClassification,plmSysPEDataGrading',
        },
      })
      .then(res => {
        if (res) {
          this.setState({ dropDownData: res });
        }
      });
  };

  save = e => {
    e.preventDefault();
    const { record } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      if (record.flag === 'structureUpdate') {
        vals.id = record.id;
      }
      this.setState({ loading: true }, () => {
        dispatch({
          type: `productElements/${record.flag}`,
          payload: { ...vals },
        }).then(res => {
          this.setState({ loading: false }, () => {
            this.jumpBack();
          });
        });
      });
    });
  };

  render() {
    const { loading, record, title, dropDownData } = this.state;
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

    // 关于是否的下拉数据
    const option = [
      { name: '是', code: 1 },
      { name: '否', code: 0 },
    ];

    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品要素管理',
              url: '',
            },
            {
              title: '新增产品要素表结构信息',
              url: '',
            },
          ]}
        />
        <Card title={`${title}产品要素-表结构信息`}>
          <div style={{ padding: '0 40px' }}>
            <Spin spinning={loading}>
              <Form>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="业务主表名:" {...formItemLayout}>
                      {getFieldDecorator('masterTableName', {
                        rules: [{ required: true, message: '请选择业务主表名!' }],
                        initialValue: record?.masterTableName || '',
                      })(<Select placeholder="请选择业务主表名"></Select>)}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="数据库字段名:" {...formItemLayout}>
                      {getFieldDecorator('columnName', {
                        rules: [{ required: true, message: '请选择数据库字段名!' }],
                        initialValue: record?.columnName || '',
                      })(<Select placeholder="请选择数据库字段名"></Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="数据库字段类型:" {...formItemLayout}>
                      {getFieldDecorator('columnType', {
                        rules: [{ required: true, message: '请选择数据库字段类型!' }],
                        initialValue: record?.columnType || '',
                      })(<Select placeholder="请选择数据库字段类型"></Select>)}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="必输项:" {...formItemLayout}>
                      {getFieldDecorator('required', {
                        rules: [{ required: true, message: '请选择必输项!' }],
                        initialValue: record?.required || '',
                      })(
                        <Select placeholder="请选择必输项">
                          <Option key="1" value="1">
                            是
                          </Option>
                          <Option key="0" value="0">
                            否
                          </Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="精度:" {...formItemLayout}>
                      {getFieldDecorator('precision', {
                        rules: [{ required: true, message: '请选择精度!' }],
                        initialValue: record?.precision || '',
                      })(<Select placeholder="请选择精度"></Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="是否为扩展字段:" {...formItemLayout}>
                      {getFieldDecorator('extended', {
                        rules: [{ required: true, message: '请选择是否为扩展字段!' }],
                        initialValue: record?.extended || '',
                      })(
                        <Select placeholder="请选择是否为扩展字段">
                          <Option key="1" value="1">
                            是
                          </Option>
                          <Option key="0" value="0">
                            否
                          </Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="权限校验类型:" {...formItemLayout}>
                      {getFieldDecorator('authType', {
                        rules: [{ required: true, message: '请选择权限校验类型!' }],
                        initialValue: record?.authType || '',
                      })(
                        <Select placeholder="请选择权限校验类型">
                          {dropDownData?.columnAuthType?.length > 0 &&
                            dropDownData.columnAuthType.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="是否为系统级别字段:" {...formItemLayout}>
                      {getFieldDecorator('systemLevel', {
                        rules: [{ required: true, message: '请选择是否为系统级别字段!' }],
                        initialValue: record?.systemLevel || '',
                      })(
                        <Select placeholder="请选择是否为系统级别字段">
                          <Option key="1" value="1">
                            是
                          </Option>
                          <Option key="0" value="0">
                            否
                          </Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="关联业务数据:" {...formItemLayout}>
                      {getFieldDecorator('bizName', {
                        rules: [{ required: true, message: '请选择关联业务数据!' }],
                        initialValue: record?.bizName || '',
                      })(<Select placeholder="请选择关联业务数据"></Select>)}
                    </FormItem>
                  </Col>
                </Row>

                <div style={{ marginBottom: 10 }}>
                  <Row>
                    <Col span={24} style={{ marginBottom: 10 }} style={{ textAlign: 'right' }}>
                      <Button style={{ marginRight: 8 }} onClick={this.jumpBack}>
                        取消
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginRight: 8 }}
                        loading={loading}
                        onClick={this.save}
                      >
                        确定
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Spin>
          </div>
        </Card>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productElements, dataSource }) => ({ productElements, dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Row, Col, Input, Select, Spin } from 'antd';
import styles from './productElements.less';
import { Card, PageContainers } from '@/components';
import { getSession } from '@/utils/session';
const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    record: {},
    id: '',
    flag: '',
    dropDownData: [],
    orgData: [],
    dataLevelList: [],
    sortList: [],
    activeKey: '',
  };
  componentDidMount() {
    const id = this.props?.location.query?.id;
    const activeKey = this.props?.location.query?.activeKey;
    if (id) {
      this.setState({ flag: 'businessUpdate', id: id, activeKey }, () => {
        this.getInfo();
      });
    } else {
      this.setState({ flag: 'businessAdd', activeKey });
    }
    this.getDropDownData();
    this.getOrgData();
  }

  // 获取详情
  getInfo = () => {
    const { dispatch } = this.props;
    const { id } = this.state;
    this.setState({ loading: true }, () => {
      dispatch({
        type: 'productElements/getBusiness',
        payload: id,
      }).then(res => {
        this.setState({ record: res, loading: false });
      });
    });
  };

  getDropDownData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getDropdownData',
        payload: {
          codeList:
            'plmIndustry,plmSysPEDataSubject,plmSysPESubjectTopCategory,plmSysPESubjectSecondCategory,plmSysPESubjectThirdCategory,plmSysPEBusinessScenario,plmSysPEBusinessClassification,plmSysPEDataGrading,plmSysPEElementChangeWay,plmSysPESort,plmSysPEDataSource,plmSysPEDataPushSystem,plmSysPEScene,plmSysPEComponentType,attributionSystem',
        },
      })
      .then(res => {
        if (res) {
          this.setState({
            dropDownData: res,
            dataLevelList: res?.plmSysPEDataGrading.sort((a, b) => a.code - b.code),
            sortList: res?.plmSysPESort.sort((a, b) => a.code - b.code),
          });
        }
      });
  };

  getOrgData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getOrgData',
        payload: { isOut: true, pageNum: 1, pageSize: 9999 },
      })
      .then(res => {
        if (res) {
          this.setState({ orgData: res });
        }
      });
  };

  jumpBack = () => {
    const { activeKey } = this.state;
    this.props.dispatch(
      routerRedux.push({
        pathname: '../productElementsList',
        query: { activeKey },
      }),
    );
  };

  save = () => {
    const { record, flag } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, vals) => {
      if (err) return;
      if (flag === 'businessUpdate') {
        vals.id = record.id;
      }
      this.setState({ loading: true }, () => {
        dispatch({
          type: `productElements/${flag}`,
          payload: { ...vals },
        }).then(res => {
          if (res) {
            message.success('操作成功');
            this.jumpBack();
          }
          this.setState({ loading: false });
        });
      });
    });
  };

  render() {
    const {
      loading,
      record,
      dropDownData,
      orgData,
      flag,
      sortList,
      dataLevelList,
      activeKey,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const loginOrgId = getSession('loginOrgId');
    const loginId = getSession('loginId');
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
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品要素管理',
              url: '',
            },
            {
              title: `${flag === 'businessAdd' ? '新增' : '修改'}产品要素${
                activeKey === 'business' ? '业务信息' : '表结构信息'
              }`,
              url: '',
            },
          ]}
        />
        <Card title={`产品要素-${activeKey === 'business' ? '业务信息' : '表结构信息'}`}>
          <div className={styles.cardStyle}>
            <Spin spinning={loading}>
              <Form>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="数据主体:" {...formItemLayout}>
                      {getFieldDecorator('dataSubject', {
                        rules: [{ required: true, message: '请选择数据主体' }],
                        initialValue: record?.dataSubject,
                      })(
                        <Select placeholder="请选择数据主体" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPEDataSubject?.length > 0 &&
                            dropDownData.plmSysPEDataSubject.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="一级分类:" {...formItemLayout}>
                      {getFieldDecorator('dataThemeLevelOne', {
                        rules: [{ required: true, message: '请选择一级分类' }],
                        initialValue: record?.dataThemeLevelOne || '',
                      })(
                        <Select placeholder="请选择一级分类" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPESubjectTopCategory?.length > 0 &&
                            dropDownData.plmSysPESubjectTopCategory.map(item => (
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
                    <FormItem label="二级分类:" {...formItemLayout}>
                      {getFieldDecorator('dataThemeLevelTwo', {
                        rules: [{ required: true, message: '请选择二级分类' }],
                        initialValue: record?.dataThemeLevelTwo || '',
                      })(
                        <Select placeholder="请选择二级分类" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPESubjectSecondCategory?.length > 0 &&
                            dropDownData.plmSysPESubjectSecondCategory.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="三级分类:" {...formItemLayout}>
                      {getFieldDecorator('dataThemeLevelThree', {
                        rules: [{ required: true, message: '请选择三级分类' }],
                        initialValue: record?.dataThemeLevelThree || '',
                      })(
                        <Select placeholder="请选择三级分类" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPESubjectThirdCategory?.length > 0 &&
                            dropDownData.plmSysPESubjectThirdCategory.map(item => (
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
                    <FormItem label="业务场景:" {...formItemLayout}>
                      {getFieldDecorator('bizScene', {
                        rules: [{ required: true, message: '请选择业务场景' }],
                        initialValue: record?.bizScene || '',
                      })(
                        <Select placeholder="请选择业务场景" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPEBusinessScenario?.length > 0 &&
                            dropDownData.plmSysPEBusinessScenario.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="业务分类:" {...formItemLayout}>
                      {getFieldDecorator('bizClass', {
                        rules: [{ required: true, message: '请选择业务分类' }],
                        initialValue: record?.bizClass || '',
                      })(
                        <Select placeholder="请选择业务分类" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPEBusinessClassification?.length > 0 &&
                            dropDownData.plmSysPEBusinessClassification.map(item => (
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
                    <FormItem label="英文业务属性:" {...formItemLayout}>
                      {getFieldDecorator('attributeName', {
                        rules: [
                          { required: true, message: '请输入英文业务属性' },
                          { pattern: /^[a-zA-Z0-9]+$/, message: '只能输入英文和数字' },
                        ],
                        initialValue: record?.attributeName || '',
                      })(<Input placeholder="请输入英文业务属性" />)}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="中文业务属性:" {...formItemLayout}>
                      {getFieldDecorator('bizDataName', {
                        rules: [{ required: true, message: '请输入中文业务属性' }],
                        initialValue: record?.bizDataName || '',
                      })(<Input placeholder="请输入中文业务属性" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="数据分级:" {...formItemLayout}>
                      {getFieldDecorator('dataLevel', {
                        rules: [{ required: true, message: '请选择数据分级' }],
                        initialValue: record?.dataLevel || '',
                      })(
                        <Select placeholder="请选择数据分级" showSearch optionFilterProp="children">
                          {dataLevelList.length > 0 &&
                            dataLevelList.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="要素变更方式:" {...formItemLayout}>
                      {getFieldDecorator('elementChangeType', {
                        initialValue: record?.elementChangeType || '',
                      })(
                        <Select
                          placeholder="请选择要素变更方式"
                          showSearch
                          optionFilterProp="children"
                        >
                          {dropDownData?.plmSysPEElementChangeWay?.length > 0 &&
                            dropDownData.plmSysPEElementChangeWay.map(item => (
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
                        rules: [{ required: true, message: '请选择是否为系统级别字段' }],
                        initialValue: record?.systemLevel ?? '',
                      })(
                        <Select
                          placeholder="请选择是否为系统级别字段"
                          showSearch
                          optionFilterProp="children"
                        >
                          <Option key={1} value={1}>
                            是
                          </Option>
                          <Option key={0} value={0}>
                            否
                          </Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="排序:" {...formItemLayout}>
                      {getFieldDecorator('sort', {
                        initialValue: record?.sort || '',
                      })(
                        <Select placeholder="请选择排序" showSearch optionFilterProp="children">
                          {sortList.length > 0 &&
                            sortList.map(item => (
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
                    <FormItem label="数据来源:" {...formItemLayout}>
                      {getFieldDecorator('source', {
                        initialValue: record?.source || '',
                      })(
                        <Select placeholder="请选择数据来源" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPEDataSource?.length > 0 &&
                            dropDownData.plmSysPEDataSource.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="数据推送(系统):" {...formItemLayout}>
                      {getFieldDecorator('pushSystem', {
                        initialValue: record?.pushSystem || '',
                      })(
                        <Select
                          placeholder="请选择数据推送(系统)"
                          showSearch
                          optionFilterProp="children"
                        >
                          {dropDownData?.plmSysPEDataPushSystem?.length > 0 &&
                            dropDownData.plmSysPEDataPushSystem.map(item => (
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
                    <FormItem label="数据推送(场景):" {...formItemLayout}>
                      {getFieldDecorator('pushScene', {
                        initialValue: record?.pushScene || '',
                      })(
                        <Select
                          placeholder="请选择数据推送(场景)"
                          showSearch
                          optionFilterProp="children"
                        >
                          {dropDownData?.plmSysPEScene?.length > 0 &&
                            dropDownData.plmSysPEScene.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="默认值:" {...formItemLayout}>
                      {getFieldDecorator('defaultValue', {
                        initialValue: record?.defaultValue || '',
                      })(<Input placeholder="请输入默认值" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="字典中文名称:" {...formItemLayout}>
                      {getFieldDecorator('dicItem', {
                        initialValue: record?.dicItem || '',
                      })(<Input placeholder="请输入字典中文名称" />)}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="字典英文名称:" {...formItemLayout}>
                      {getFieldDecorator('dicItemCode', {
                        initialValue: record?.dicItemCode || '',
                        rules: [
                          {
                            pattern: /^[a-zA-Z0-9_:-]+$/,
                            message: '只能输入英文、数字、下划线及冒号',
                          },
                        ],
                      })(<Input placeholder="请输入字典英文名称" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="说明:" {...formItemLayout}>
                      {getFieldDecorator('description', {
                        initialValue: record?.description || '',
                      })(<Input placeholder="请输入说明" />)}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="提示语:" {...formItemLayout}>
                      {getFieldDecorator('tip', {
                        initialValue: record?.tip || '',
                      })(<Input placeholder="请输入提示语" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="所属行业:" {...formItemLayout}>
                      {getFieldDecorator('industry', {
                        rules: [{ required: true, message: '请选择所属行业' }],
                        initialValue: record?.industry || 'all',
                      })(
                        <Select placeholder="请选择所属行业" showSearch optionFilterProp="children">
                          {dropDownData?.plmIndustry?.length > 0 &&
                            dropDownData.plmIndustry.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="归属机构:" {...formItemLayout}>
                      {getFieldDecorator('orgId', {
                        rules: [{ required: true, message: '请选择归属机构' }],
                        initialValue: loginId === '1' ? record?.orgId || '' : loginOrgId, // 超级管理员登录，逻辑同前；否则，归属机构默认为登录用户的归属机构，且不可编辑
                      })(
                        <Select
                          placeholder="请选择归属机构"
                          showSearch
                          optionFilterProp="children"
                          disabled={loginId === '1' ? false : true} // 修改原因见 initialValue
                        >
                          {orgData.length > 0 &&
                            orgData.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.orgName}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10}>
                    <FormItem label="归属系统:" {...formItemLayout}>
                      {getFieldDecorator('sysId', {
                        rules: [{ required: true, message: '请选择归属系统' }],
                        initialValue: record?.sysId || '',
                      })(
                        <Select placeholder="请选择归属系统" showSearch optionFilterProp="children">
                          {dropDownData?.attributionSystem?.length > 0 &&
                            dropDownData.attributionSystem.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10}>
                    <FormItem label="组件类型:" {...formItemLayout}>
                      {getFieldDecorator('widgetType', {
                        rules: [{ required: true, message: '请选择组件类型' }],
                        initialValue: record?.widgetType || '',
                      })(
                        <Select placeholder="请选择组件类型" showSearch optionFilterProp="children">
                          {dropDownData?.plmSysPEComponentType?.length > 0 &&
                            dropDownData.plmSysPEComponentType.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <div className={styles.div1}>
                  <Row>
                    <Col span={24} className={styles.col}>
                      <Button className={styles.btn} onClick={this.jumpBack}>
                        取消
                      </Button>
                      <Button
                        type="primary"
                        className={styles.btn}
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

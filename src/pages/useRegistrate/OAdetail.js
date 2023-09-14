import React from 'react';
import { Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { nsHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import moment from 'moment';
import BaseCrudComponent from '../../components/BaseCrudComponent';
import style from './index.less';
import { PageContainers } from '@/components';

const FormItem = Form.Item;
const { Option } = Select;
const dictList = {
  codeList:
    'runMode, lc-mjlx, CurrencyType, investType, proRisk, profitBase, lc-sylx, interBackMethod, fRiskType',
};

@errorBoundary
@nsHoc({ namespace: 'useRegistrate' })
@Form.create()
@connect(({ useRegistrate }) => ({
  useRegistrate,
}))
export default class OAdetail extends BaseCrudComponent {
  state = {
    contractValue: '',
    approvalValue: '',
    isuesValue: '',
    lookForm: {},
    loading: false,
  };

  componentDidMount() {
    this.getDetailForm();
    this.getDictList();
    this.getItemsList();
    this.getPersonList();
    this.getOAPersonList();
    this.getApproverList();
    this.getModuleList();
    this.getSealTypeList();
    this.getSealNameList();
  }

  getSealTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getSealTypeList`,
      payload: {},
    });
  }

  getSealNameList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getSealNameList`,
      payload: {},
    });
  }

  /**
   * 获取当前机构全部用户列表(全部)
   * @method getPersonList
   */
  getPersonList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getPersonList`,
      payload: {},
    });
  }

  /**
   * 获取当前机构全部用户列表（OA）
   * @method getOAPersonList
   */
  getOAPersonList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getOAPersonList`,
      payload: {},
    });
  }

  /**
   * 获取审批人下拉列表
   * @method getOAPersonList
   */
  getApproverList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getApproverList`,
      payload: {},
    });
  }

  /**
   * 获取产品实名注册子流程模块代码和名称的映射关系
   * @method getOAPersonList
   */
  getModuleList() {
    const { dispatch } = this.props;
    dispatch({
      type: `useRegistrate/getModuleList`,
      payload: {},
    });
  }

  // 详情数据查询
  getDetailForm() {
    this.setState({
      loading: true,
    });
    const { dispatch, namespace } = this.props;
    const params = {
      id: sessionStorage.getItem('detailId'),
    };
    dispatch({
      type: `${namespace}/queryDetailForm`,
      payload: params,
    }).then(res => {
      if (res && res.data) {
        console.log(res.data, 'data');
        this.setState({
          lookForm: res.data,
          contractValue: res.data.iscontractagreement,
          approver: res.data.approver ? res.data.approver.split(',') : [],
          applicantseal: res.data.applicantseal ? res.data.applicantseal.split(',') : [],
          promoter: res.data.promoter ? res.data.promoter.split(',') : [],
          contractresponsible: res.data.contractresponsible
            ? res.data.contractresponsible.split(',')
            : [],
          sealname: res.data.sealname ? res.data.sealname.split(';') : [],
          sealtype: res.data.sealtype ? res.data.sealtype.split(';') : [],
          loading: false,
        });
      }
    });
  }

  // 词汇字典
  getDictList() {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  // 获取下拉表单项 sealName(印章名)、useSealType（使用印章种类）、usingContractType（合同类型）、paymentType（收付款类型）
  getItemsList() {
    const { dispatch, namespace } = this.props;
    const params = {
      type: 'useSealType',
    };
    dispatch({
      type: `${namespace}/queryItemsList`,
      payload: params,
    });
  }

  addOfferForm() {
    const {
      form: { getFieldDecorator },
      useRegistrate: { contractTypeList, payTypeList, OAPersonList },
    } = this.props;
    const { contractValue, lookForm } = this.state;
    return (
      <Form className={style.useRegistrateDetailForm} layout="inline" labelAlign="right">
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>数据来源:</Col>
            <Col span={4}>{lookForm.dataSource || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>是否合同协议:</Col>
            <Col span={4}>
              {lookForm.iscontractagreement === 1
                ? '合同协议'
                : lookForm.iscontractagreement === 2
                ? '非合同协议'
                : '—'}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>用印单位:</Col>
            <Col span={4}>{lookForm.usingunit || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>用印内容:</Col>
            <Col span={4}>{lookForm.usingcontent || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>审批形式:</Col>
            <Col span={4}>
              {lookForm.approvalform === '1'
                ? 'OA审批'
                : lookForm.approvalform === '2'
                ? '纸质审批'
                : '—'}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>是否使用电子印章:</Col>
            <Col span={4}>{lookForm.isues === 1 ? '是' : lookForm.isues === 0 ? '否' : '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>使用印章种类:</Col>
            <Col span={4}>{this.state.sealtype || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>印章名:</Col>
            <Col span={4}>{this.state.sealname || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>审批人:</Col>
            <Col span={4}>{this.state.approver || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>用印份数:</Col>
            <Col span={4}>{lookForm.sealsnumber || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>用印申请人:</Col>
            <Col span={4}>{this.state.applicantseal || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>承办人:</Col>
            <Col span={4}>{this.state.promoter || '—'}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={2} />
            <Col span={2}>备注:</Col>
            <Col span={4}>{lookForm.remark || '—'}</Col>
          </Row>
          {contractValue === 1 ? (
            <Row>
              <Card title="合同详细信息" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同类型">
                      {getFieldDecorator('contracttype', { initialValue: lookForm.contracttype })(
                        <Select
                          optionFilterProp="children"
                          mode="multiple"
                          showArrow="false"
                          allowClear
                          placeholder="请选择合同类型"
                          disabled
                        >
                          {contractTypeList &&
                            contractTypeList.length > 0 &&
                            contractTypeList.map(item => (
                              <Option key={item.code} setFieldsValue={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同名称">
                      {getFieldDecorator('contractname', { initialValue: lookForm.contractname })(
                        <Input disabled />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="签订方">
                      {getFieldDecorator('partiessign', { initialValue: lookForm.partiessign })(
                        <Input disabled />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同责任人">
                      {getFieldDecorator('contractresponsible', {
                        initialValue: this.state.contractresponsible,
                      })(
                        <Select
                          optionFilterProp="children"
                          mode="multiple"
                          showArrow="false"
                          allowClear
                          placeholder="请选择合同负责人"
                          disabled
                        >
                          {OAPersonList &&
                            OAPersonList.length > 0 &&
                            OAPersonList.map(item => (
                              <Option key={item.oaUsernum} setFieldsValue={item.oaUsernum}>
                                {item.username}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="签约日期">
                      {getFieldDecorator('signingdate', {
                        initialValue: lookForm.signingdate ? moment(lookForm.signingdate) : '',
                      })(<DatePicker onChange={val => this.signtTimeDate(val)} disabled />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同期限">
                      {getFieldDecorator('contractdeadline', {
                        initialValue: lookForm.contractdeadline,
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同开始日期">
                      {getFieldDecorator('contractstartdate', {
                        initialValue: lookForm.contractdeadline
                          ? moment(lookForm.contractstartdate)
                          : '',
                      })(<DatePicker onChange={val => this.signtTimeDate(val)} disabled />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同截止日期">
                      {getFieldDecorator('contractenddate', {
                        initialValue: lookForm.contractdeadline
                          ? moment(lookForm.contractenddate)
                          : '',
                      })(<DatePicker onChange={val => this.signtTimeDate(val)} disabled />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="收付款类型">
                      {getFieldDecorator('paymenttype', { initialValue: lookForm.paymenttype })(
                        <Select
                          optionFilterProp="children"
                          mode="multiple"
                          showArrow="false"
                          allowClear
                          placeholder="请选择收付款类型"
                          disabled
                        >
                          {payTypeList &&
                            payTypeList.length > 0 &&
                            payTypeList.map(item => (
                              <Option key={item.code} setFieldsValue={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col md={12} sm={12}>
                    <FormItem label="合同金额">
                      {getFieldDecorator('contractamount', {
                        initialValue: lookForm.contractamount,
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </Row>
          ) : (
            ''
          )}
        </Card>
      </Form>
    );
  }

  // 表单
  renderAddOffer = () => {
    return this.addOfferForm();
  };

  contractChange = val => {
    this.setState({
      contractValue: val.target.value,
    });
  };

  // 用印形式change
  approvalValueChange = val => {
    console.log(val, 'val');
  };

  // 是否使用电子印章
  isuesValueChange = val => {
    console.log(val, 'val');
  };

  // 签约日期
  signtTimeDate = val => {
    console.log(val, 'val');
  };

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/productLifecycle/useRegistrate/index'));
  };

  detailTitle() {
    return (
      <Row>
        <span className={style.lifeCycle}>用印登记</span> /
        <span className={style.processName}>查看</span>
      </Row>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <PageContainers
        breadcrumb={[
          {
            title: '产品生命周期',
            url: '',
          },
          {
            title: '用印登记',
            url: '/productLifecycle/useRegistrate/index',
          },
          {
            title: '查看',
            url: '',
          },
        ]}
      >
        <Card bordered title={this.detailTitle()}>
          <div className={style.tableListForm} style={{ height: '70vh', overflowY: 'auto' }}>
            {this.renderAddOffer()}
          </div>
        </Card>
      </PageContainers>
    );
  }
}

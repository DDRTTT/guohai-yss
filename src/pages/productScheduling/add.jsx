import React from 'react';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, TreeSelect } from 'antd';

import { connect } from 'dva';
import { router } from 'umi';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { Card, PageContainers } from '@/components';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    tableData: [],
    productListData: [],
    recordList: [],
    value: [],
  };

  componentDidMount() {
    this.getUsersList();
    this.getProductReleaseList();
    this.getProBeDepList();
    this.getproTypeList();
    this.getRecordUsersList();
  }

  // 用户
  getUsersList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryUsersList`,
    });
  }

  // 备案联系人
  getRecordUsersList() {
    const { dispatch } = this.props;
    const userId = JSON.parse(sessionStorage.getItem('USER_INFO'));
    const params = {
      orgId: userId.orgId,
    };
    dispatch({
      type: `productScheduling/queryRecordUsersList`,
      payload: params,
    }).then(res => {
      if (res && res.status === 200) {
        this.setState({
          recordList: res.data.rows,
        });
      }
    });
  }

  onClickChange = value => {
    // console.log('onChange ', value);
    this.setState({ value });
  };

  // 产品名称
  getProductReleaseList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryProductReleaseList`,
    });
  }

  // 产品归属部门
  getProBeDepList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryProBeDepList`,
    });
  }

  // 产品类型查询
  getproTypeList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'productScheduling',
    };
    dispatch({
      type: `productScheduling/handleProductTypeList`,
      payload: params,
    });
  }

  // 取消
  addCancel = () => {
    this.props.form.resetFields();
    this.setState({
      tableData: [],
    });
    router.push('/taskCenter/productScheduling/calendar');
  };

  // 保存
  addSave = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        const formItems = value;
        const params = {
          ccOVs: formItems.recordNames ? formItems.recordNames : [],
          ...formItems,
        };
        if (formItems.recSdateDate && formItems.recSdateDate != 'undefined') {
          params.recSdate = formItems.recSdateDate[0].format('YYYY-MM-DD');
          params.recEdate = formItems.recSdateDate[1].format('YYYY-MM-DD');
        }
        params.proCdate = params.proCdate.format('YYYY-MM-DD');
        if (params.canOwnfundPartDate) {
          params.canOwnfundPartDate = params.canOwnfundPartDate.format('YYYY-MM-DD');
          params.canOwnfundNoticeDate = params.canOwnfundNoticeDate.format('YYYY-MM-DD');
        }
        params.proRecordContactor = formItems.proRecordContactor.join();
        params.proNames = formItems.proNames.label;
        params.councilSendFlag = '0';
        params.checked = 'D001_1';
        delete params.recSdateDate;
        delete params.proType;
        delete params.proBelongDepartment;
        delete params.recordNames;
        dispatch({
          type: `productScheduling/queryProducrSave`,
          payload: params,
        }).then(res => {
          if (res && res.status === 200) {
            router.push('/taskCenter/productScheduling/calendar');
          }
        });
      }
    });
  };

  proNameChange = val => {
    this.props.form.setFieldsValue({
      proCode: val.key,
    });
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryProductInfoView`,
      payload: { proCode: val.key },
    }).then(res => {
      if (res && res.status === 200) {
        this.setState({
          productListData: res.data,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const {
      productScheduling: { proBeDepList, ccObjectList, productList, proTypeList },
    } = this.props;
    const { productListData, recordList } = this.state;

    const config = {
      rules: [{ required: true, message: '请选择日期!' }],
    };
    const tProps = {
      treeData: ccObjectList,
      value: this.state.value,
      onChange: this.onClickChange,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
      },
    };

    const baseForm = () => {
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
        <Form>
          <div className={styles.box}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="产品名称:" {...formItemLayout}>
                  {getFieldDecorator('proNames', {
                    rules: [{ required: true, message: '请选择产品名称!' }],
                  })(
                    <Select
                      optionFilterProp="children"
                      placeholder="请输入"
                      allowClear
                      showArrow="false"
                      showSearch
                      labelInValue={true}
                      onChange={val => this.proNameChange(val)}
                    >
                      {productList &&
                        productList.length > 0 &&
                        productList.map(item => (
                          <Option key={item.proCode} value={item.proCode}>
                            {item.proName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="产品代码:" {...formItemLayout}>
                  {getFieldDecorator('proCode')(
                    <Select
                      optionFilterProp="children"
                      disabled
                      // onChange={val => this.proCodeChange(val)}
                    >
                      {productList &&
                        productList.length > 0 &&
                        productList.map(item => (
                          <Option key={item.proCode} value={item.proCode}>
                            {item.proCode}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="产品类型:" {...formItemLayout}>
                  {getFieldDecorator('proType', {
                    initialValue: productListData.proType,
                  })(
                    <Select optionFilterProp="children" disabled>
                      {proTypeList &&
                        proTypeList.length > 0 &&
                        proTypeList.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="投资类型:" {...formItemLayout}>
                  {getFieldDecorator('proBelongDepartment', {
                    initialValue: productListData.proArchivalTypeName
                      ? productListData.proArchivalTypeName
                      : '',
                  })(
                    <Select optionFilterProp="children" disabled>
                      {proBeDepList &&
                        proBeDepList.length > 0 &&
                        proBeDepList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.deptName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="产品归属部门:" {...formItemLayout}>
                  {getFieldDecorator('proBelongDepartment', {
                    initialValue: productListData.proBelongDepartmentNames
                      ? productListData.proBelongDepartmentNames
                      : '',
                  })(
                    <Select optionFilterProp="children" disabled>
                      {proBeDepList &&
                        proBeDepList.length > 0 &&
                        proBeDepList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.deptName}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            {productListData.proType !== 'A002_1' && (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem name="proTa" label="所属TA:" {...formItemLayout}>
                    {getFieldDecorator('proTa', {
                      rules: [{ required: true, message: '请选择所属TA!', whitespace: true }],
                    })(
                      <Radio.Group>
                        <Radio value="0">分TA</Radio>
                        <Radio value="1">自TA</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}
            {productListData.proType !== 'A002_1' && (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="募集日期：" {...formItemLayout}>
                    {getFieldDecorator('recSdateDate', {
                      rules: [{ required: true, message: '请选择日期!' }],
                      // initialValue: [moment('2020-12-01', 'YYYY-MM-DD'), moment('2020-12-02', 'YYYY-MM-DD')],
                    })(<RangePicker />)}
                  </FormItem>
                </Col>
              </Row>
            )}
            {productListData.proType !== 'A002_1' && (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="是否允许自有资金参与：" {...formItemLayout}>
                    {getFieldDecorator('canOwnfundParticipation', {
                      initialValue: productListData.canOwnfundParticipation,
                    })(
                      <Radio.Group disabled>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="计划成立日：" {...formItemLayout}>
                  {getFieldDecorator('proCdate', config)(<DatePicker />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="成立备案联系人：" {...formItemLayout}>
                  {getFieldDecorator('proRecordContactor', {
                    rules: [{ required: true, message: '请选择成立备案联系人!' }],
                  })(
                    <Select
                      optionFilterProp="children"
                      mode="multiple"
                      allowClear
                      showSearch
                      showArrow="false"
                    >
                      {recordList &&
                        recordList.length > 0 &&
                        recordList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            {productListData.proType !== 'A002_1' &&
              productListData.canOwnfundParticipation == '1' && (
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={12}>
                    <FormItem label="预计自有资金参与日：" {...formItemLayout}>
                      {getFieldDecorator(
                        'canOwnfundPartDate',
                        config,
                      )(
                        <DatePicker
                          onChange={date => {
                            if (date) {
                              setFieldsValue({
                                canOwnfundNoticeDate: moment(date).subtract('days', 5),
                              });
                            }
                          }}
                        />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              )}
            {productListData.proType !== 'A002_1' &&
              productListData.canOwnfundParticipation == '1' && (
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={12}>
                    <FormItem label="最晚自有资金公告日：" {...formItemLayout}>
                      {getFieldDecorator('canOwnfundNoticeDate', config)(<DatePicker disabled />)}
                    </FormItem>
                  </Col>
                </Row>
              )}
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="备注：" {...formItemLayout}>
                  {getFieldDecorator(
                    'remarks',
                    {},
                  )(<TextArea rows={6} allowClear placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12}>
                <FormItem label="抄送：" {...formItemLayout}>
                  {/* <Button type="primary" onClick={() => this.customListAdd()}>
                    新增
                  </Button> */}
                  {getFieldDecorator('recordNames', {})(<TreeSelect {...tProps} />)}
                </FormItem>
              </Col>
            </Row>
            {/* {this.state.tableData.length !== 0 && (
              <Table dataSource={this.state.tableData} columns={columns} />
            )} */}
            {/* <Modal
              title="添加抄送人"
              visible={this.state.isShowModal}
              onOk={this.onOkModal}
              onCancel={() => this.setState({ isShowModal: false })}
            >
              <Checkbox.Group onChange={onCheckboxChange} defaultValue={this.state.ccObjectValues}>
                {ccObjectList.map(cItem => (
                  <Checkbox
                    style={{ width: 148, marginLeft: 8 }}
                    userName={cItem.username}
                    ccObjectId={cItem.id}
                    value={cItem.id}
                  >
                    {cItem.username}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Modal> */}
          </div>
        </Form>
      );
    };
    return (
      <PageContainers
        breadcrumb={[
          {
            title: '产品生命周期',
            url: '',
          },
          {
            title: '产品计划排期表',
            url: '/taskCenter/productScheduling/calendar',
          },
          {
            title: '新增',
            url: '',
          },
        ]}
      >
        <Card
          title="产品发行计划"
          extra={[
            <Action key="add" code="productScheduling:add">
              <Button type="primary" onClick={() => this.addSave()}>
                保存
              </Button>
            </Action>,
            <Button key="cancel" type="" className={styles.button} onClick={() => this.addCancel()}>
              取消
            </Button>,
          ]}
        >
          <div style={{ weight: 200 }}>{baseForm()}</div>
        </Card>
      </PageContainers>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productScheduling, loading }) => ({
        productScheduling,
        loading: loading.effects['productScheduling/queryProducrSave'],
      }))(RegistrationForm),
    ),
  ),
);

export default WrappedSingleForm;

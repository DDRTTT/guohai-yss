import React from 'react';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, TreeSelect } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { router } from 'umi';
import { linkHoc } from '@/utils/hocUtil';
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
    tableData: [],
    productData: [],
    value: [],
  };

  componentDidMount() {
    this.getProductInfo();
    this.getUsersList();
    this.getProBeDepList();
    this.getProductReleaseList();
    this.getproTypeList();
    this.getRecordUsersList();
  }

  // 数据回显
  getProductInfo() {
    const query = window.location.search;
    const abc = query.split('=');
    this.props
      .dispatch({
        type: `productScheduling/queryProductInfo`,
        payload: abc[1],
      })
      .then(res => {
        if (res && res.status === 200 && res.data) {
          this.setState({
            productData: res.data,
          });
        }
      });
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
        const query = window.location.search;
        const abc = query.split('=');
        const params = {
          ccOVs: formItems.recordNames ? formItems.recordNames : [],
          ...formItems,
          id: abc[1],
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
          type: `productScheduling/queryProducrUpdateSave`,
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
          productData: res.data,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const {
      productScheduling: { proBeDepList, ccObjectList, productList, proTypeList },
    } = this.props;
    const { productData, recordList } = this.state;
    const tProps = {
      treeData: ccObjectList,
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
      const formItemLayoutForOne = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      return (
        <Form>
          <div className={styles.box,'info-form'}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8}>
                <FormItem label="产品名称:" {...formItemLayout}>
                  {getFieldDecorator('proNames', {
                    initialValue: { label: productData.proNames, value: productData.proCode },
                    rules: [{ required: true, message: '请选择产品名称!' }],
                  })(
                    <Select
                      optionFilterProp="children"
                      showSearch
                      disabled
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
              <Col md={8}>
                <FormItem label="产品代码:" {...formItemLayout}>
                  {getFieldDecorator('proCode', {
                    initialValue: productData.proCode,
                  })(
                    <Select
                      optionFilterProp="children"
                      disabled
                      onChange={val => this.proCodeChange(val)}
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
              <Col md={8}>
                <FormItem label="产品类型:" {...formItemLayout}>
                  {getFieldDecorator('proType', {
                    initialValue: productData.proType,
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
              <Col md={8}>
                <FormItem label="投资类型:" {...formItemLayout}>
                  {getFieldDecorator('proBelongDepartment', {
                    initialValue: productData.proArchivalTypeName
                      ? productData.proArchivalTypeName
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
              <Col md={8}>
                <FormItem label="产品归属部门:" {...formItemLayout}>
                  {getFieldDecorator('proBelongDepartment', {
                    initialValue: productData.proBelongDepartmentNames
                      ? productData.proBelongDepartmentNames
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
            {productData.proType !== 'A002_1' && (
                <Col md={8}>
                  <FormItem name="proTa" label="所属TA:" {...formItemLayout}>
                    {getFieldDecorator('proTa', {
                      initialValue: productData.proTa ? productData.proTa : '',
                      rules: [{ required: true, message: '请选择所属TA!', whitespace: true }],
                    })(
                      <Radio.Group>
                        <Radio value="0">分TA</Radio>
                        <Radio value="1">自TA</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
            )}
            {productData.proType !== 'A002_1' && (
                <Col md={8}>
                  <FormItem label="募集日期：" {...formItemLayout}>
                    {getFieldDecorator('recSdateDate', {
                      initialValue: [
                        moment(productData.recSdate ? productData.recSdate : '', 'YYYY-MM-DD'),
                        moment(productData.recEdate ? productData.recEdate : '', 'YYYY-MM-DD'),
                      ],
                      rules: [{ required: true, message: '请选择日期!' }],
                    })(<RangePicker />)}
                  </FormItem>
                </Col>
            )}
            {productData.proType !== 'A002_1' && (
                <Col md={8}>
                  <FormItem label="是否允许自有资金参与：" {...formItemLayout}>
                    {getFieldDecorator('canOwnfundParticipation', {
                      initialValue: productData.canOwnfundParticipation,
                    })(
                      <Radio.Group disabled>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
            )}
              <Col md={8}>
                <FormItem label="计划成立日：" {...formItemLayout}>
                  {getFieldDecorator('proCdate', {
                    initialValue: moment(productData.proCdate, 'YYYY-MM-DD'),
                    rules: [{ required: true, message: '请选择日期!' }],
                  })(<DatePicker />)}
                </FormItem>
              </Col>
              <Col md={8}>
                <FormItem label="成立备案联系人：" {...formItemLayout}>
                  {getFieldDecorator('proRecordContactor', {
                    initialValue: productData.proRecordContactor,
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
            {productData.proType !== 'A002_1' && productData.canOwnfundParticipation == '1' && (
                <Col md={8}>
                  <FormItem label="预计自有资金参与日：" {...formItemLayout}>
                    {getFieldDecorator('canOwnfundPartDate', {
                      initialValue: moment(
                        productData.canOwnfundPartDate ? productData.canOwnfundPartDate : '',
                        'YYYY-MM-DD',
                      ),
                      rules: [{ type: 'object', required: true, message: '请选择日期!' }],
                    })(
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
            )}
            {productData.proType !== 'A002_1' && productData.canOwnfundParticipation == '1' && (
                <Col md={8}>
                  <FormItem label="最晚自有资金公告日：" {...formItemLayout}>
                    {getFieldDecorator('canOwnfundNoticeDate', {
                      initialValue: moment(
                        productData.canOwnfundNoticeDate ? productData.canOwnfundNoticeDate : '',
                        'YYYY-MM-DD',
                      ),
                    })(<DatePicker disabled />)}
                  </FormItem>
                </Col>
            )}
              <Col md={8}>
                <FormItem label="抄送：" {...formItemLayout}>
                  {getFieldDecorator('recordNames', {
                    initialValue: productData.ccOVs || null,
                  })(<TreeSelect {...tProps} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={17}>
                <FormItem label="备注：" {...formItemLayoutForOne}>
                  {getFieldDecorator('remarks', {
                    initialValue: productData.remarks ? productData.remarks : '',
                  })(<TextArea rows={6} allowClear placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
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
            title: '修改',
            url: '',
          },
        ]}
      >
        <Card
          title="产品发行计划"
          extra={
            <>
              <Button type="primary" onClick={() => this.addSave()}>
                保存
              </Button>
              <Button type="" className={styles.button} onClick={() => this.addCancel()}>
                取消
              </Button>
            </>
          }
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

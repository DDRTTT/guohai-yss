import {
  Button,
  Modal,
  Select,
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker,
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleFilterOption, datePickerFormat } from '@/pages/archiveTaskHandleList/util';

const { Option } = Select;
const MakeUpModalForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      guestType: 'C003', // 客户类型
      fundSourceType: 'O005', // 产品资金来源类型
      clientType: '0',
      isInstituteOwnFunds: '0',
    };

    componentWillReceiveProps(nextProps) {
      if (JSON.stringify(nextProps.saveDetail) !== JSON.stringify(this.props.saveDetail)) {
        const {
          saveDetail: { guestType, fundSourceType, clientType, isInstituteOwnFunds },
        } = nextProps;

        // 客户类型：根据账户类型返回的数据
        this.getCascaderData('I009', clientType || '0', 'guestTypeData');
        this.setState({
          guestType: guestType || 'C003',
          fundSourceType: fundSourceType || 'O005',
          clientType: clientType || '0',
          isInstituteOwnFunds: isInstituteOwnFunds || '0',
        });

        // 子客户类型：根据客户类型返回的数据
        if (guestType) {
          this.getCascaderData('C002', guestType, 'subGuestTypeData');
        }
        // 中基协投资者类型：根据产品资金来源类型返回的数据
        if (fundSourceType) {
          this.getCascaderData('O003', fundSourceType, 'amacInvestorTypeData');
        }
      }
    }

    // 初始化下拉数据源
    getCascaderData = (dictategoryCode, datadictCode, key) => {
      const { dispatch } = this.props;
      dispatch({
        type: `myInvestor/handleGetQueryByLinkage`,
        payload: {
          dictategoryCode,
          datadictCode,
        },
        callback: res => {
          this.setState({ [key]: res.data });
        },
      });
    };

    // 客户类型 Change
    handleGuestType = value => {
      this.getCascaderData('C002', value, 'subGuestTypeData');
      this.props.form.setFieldsValue({
        subGuestType: undefined,
        fundSourceType: undefined,
        subFundSourceType: undefined,
        amacInvestorType: undefined,
      });
    };

    // 产品资金来源类型 Change
    handleFundSourceType = value => {
      this.getCascaderData('O003', value, 'amacInvestorTypeData');
      this.props.form.setFieldsValue({
        subFundSourceType: undefined,
        amacInvestorType: undefined,
      });
    };

    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form: { getFieldDecorator },
        dicts,
        submitLoading,
        saveDetail,
      } = this.props;
      const {
        clientType,
        guestTypeData,
        subGuestTypeData,
        amacInvestorTypeData,
        isInstituteOwnFunds,
      } = this.state;
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
        <Modal
          width="90vw"
          id="makeUpModal"
          visible={visible}
          title="补录信息"
          okText="确定"
          confirmLoading={submitLoading}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col span={12}>
                <Form.Item label="账户类型：" {...formItemLayout}>
                  {getFieldDecorator('clientType', {
                    initialValue: saveDetail.clientType || '0',
                    rules: [{ required: true, message: `请选择账户类型` }],
                  })(
                    <Radio.Group disabled>
                      {dicts &&
                        dicts.I009 &&
                        dicts.I009.map(item => (
                          <Radio value={item.code} key={item.code}>
                            {item.name}
                          </Radio>
                        ))}
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="是否机构自有资金：" {...formItemLayout}>
                  {getFieldDecorator('isInstituteOwnFunds', {
                    initialValue: saveDetail.isInstituteOwnFunds,
                    rules: [{ required: true, message: '请选择是否机构自有资金' }],
                  })(
                    <Radio.Group
                      onChange={e => this.setState({ isInstituteOwnFunds: e.target.value })}
                    >
                      <Radio value={'1'} key={'1'}>
                        是
                      </Radio>
                      <Radio value={'0'} key={'0'}>
                        否
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="客户类型：" {...formItemLayout}>
                  {getFieldDecorator('guestType', {
                    initialValue: saveDetail.guestType,
                    rules: [{ required: true, message: `请选择客户类型` }],
                  })(
                    <Select
                      placeholder={`请选择客户类型`}
                      showArrow
                      onChange={this.handleGuestType}
                      filterOption={handleFilterOption}
                    >
                      {guestTypeData &&
                        guestTypeData.C002 &&
                        guestTypeData.C002.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="子客户类型：" {...formItemLayout}>
                  {getFieldDecorator('subGuestType', {
                    initialValue: saveDetail.subGuestType,
                    rules: [{ required: true, message: `请选择子客户类型` }],
                  })(
                    <Select
                      placeholder={`请选择子客户类型`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {subGuestTypeData &&
                        subGuestTypeData.C003 &&
                        subGuestTypeData.C003.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产品资金来源类型：" {...formItemLayout}>
                  {getFieldDecorator('fundSourceType', {
                    initialValue: saveDetail.fundSourceType,
                    rules: [{ required: true, message: `请选择产品资金来源类型` }],
                  })(
                    <Select
                      placeholder={`请选择产品资金来源类型`}
                      showArrow
                      onChange={this.handleFundSourceType}
                      filterOption={handleFilterOption}
                    >
                      {subGuestTypeData &&
                        subGuestTypeData.O003 &&
                        subGuestTypeData.O003.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产品资金来源子类型：" {...formItemLayout}>
                  {getFieldDecorator('subFundSourceType', {
                    initialValue: saveDetail.subFundSourceType,
                    rules: [{ required: true, message: `请选择产品资金来源子类型` }],
                  })(
                    <Select
                      placeholder={`请选择产品资金来源子类型`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {amacInvestorTypeData &&
                        amacInvestorTypeData.O005 &&
                        amacInvestorTypeData.O005.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="中基协投资者类型：" {...formItemLayout}>
                  {getFieldDecorator('amacInvestorType', {
                    initialValue: saveDetail.amacInvestorType,
                    rules: [{ required: true, message: `请选择中基协投资者类型` }],
                  })(
                    <Select
                      placeholder={`请选择中基协投资者类型`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {amacInvestorTypeData &&
                        amacInvestorTypeData.T023 &&
                        amacInvestorTypeData.T023.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="中基协是否为电子签名：" {...formItemLayout}>
                  {getFieldDecorator('isAmacESignature', {
                    initialValue: saveDetail.isAmacESignature,
                    rules: [{ required: true, message: '请选择中基协是否为电子签名' }],
                  })(
                    <Radio.Group>
                      <Radio value={'1'} key={'1'}>
                        是
                      </Radio>
                      <Radio value={'0'} key={'0'}>
                        否
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="中基协是否为管理人关联方：" {...formItemLayout}>
                  {getFieldDecorator('isAmacManagerRelation', {
                    initialValue: saveDetail.isAmacManagerRelation,
                    rules: [{ required: true, message: '请选择中基协是否为管理人关联方' }],
                  })(
                    <Radio.Group>
                      <Radio value={'1'} key={'1'}>
                        是
                      </Radio>
                      <Radio value={'0'} key={'0'}>
                        否
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="交易确认日期：" {...formItemLayout}>
                  {getFieldDecorator('tradeConfirmDate', {
                    initialValue: saveDetail.tradeConfirmDate
                      ? moment(saveDetail.tradeConfirmDate)
                      : null,
                    rules: [{ required: true, message: `请选择交易确认日期` }],
                  })(<DatePicker style={{ width: '100%' }} placeholder={'请选择交易确认日期'} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="投资者与产品关系：" {...formItemLayout}>
                  {getFieldDecorator('investorProRel', {
                    initialValue: saveDetail.investorProRel,
                    rules: [{ required: true, message: `请选择投资者与产品关系` }],
                  })(
                    <Select
                      placeholder={`请选择投资者与产品关系`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {dicts &&
                        dicts.R007.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="投资者类型：" {...formItemLayout}>
                  {getFieldDecorator('investorType', {
                    initialValue: saveDetail.investorType,
                    rules: [{ required: true, message: `请选择投资者类型` }],
                  })(
                    <Select
                      placeholder={`请选择投资者类型`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {guestTypeData &&
                        guestTypeData.T024 &&
                        guestTypeData.T024.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              {clientType === '2' ? (
                <Col span={12}>
                  <Form.Item label="上层产品管理人名称：" {...formItemLayout}>
                    {getFieldDecorator('superProManagerName', {
                      initialValue: saveDetail.superProManagerName,
                      rules: [{ required: true, message: `请选择上层产品管理人名称` }],
                    })(<Input placeholder={'请选择上层产品管理人名称'} />)}
                  </Form.Item>
                </Col>
              ) : null}
              <Col span={12}>
                <Form.Item label="资金来源中本公司或关联方情况：" {...formItemLayout}>
                  {getFieldDecorator('sourcesFunds', {
                    initialValue: saveDetail.sourcesFunds,
                    rules: [
                      {
                        required: isInstituteOwnFunds === '1',
                        message: '请选择资金来源中本公司或关联方情况',
                      },
                    ],
                  })(
                    <Select
                      placeholder={`请选择资金来源中本公司或关联方情况`}
                      showArrow
                      filterOption={handleFilterOption}
                    >
                      {dicts &&
                        dicts.F006.map(item => (
                          <Option key={item.code} title={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

class MakeUpModal extends React.Component {
  state = {
    visible: false,
    dicts: null,
    submitLoading: false,
    saveDetail: {},
    guestType: null,
  };

  showModal = () => {
    const { dispatch, recordId } = this.props;
    const { form } = this.formRef.props;

    this.setState({ visible: true });
    form.resetFields();
    // 字典项接口
    dispatch({
      type: `myInvestor/getDicts`,
      payload: {
        codeList: 'I009,R007,F006',
      },
      callback: res => {
        this.setState({
          dicts: res.data,
        });
      },
    });

    // 数据回填接口
    dispatch({
      type: `myInvestor/handleGetAdditionalRecord`,
      payload: {
        id: recordId,
      },
    }).then(res => {
      this.setState({
        saveDetail: res.data,
      });
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit = () => {
    const { dispatch, recordId } = this.props;
    const { form } = this.formRef.props;

    this.setState({ submitLoading: true });
    form.validateFields((err, values) => {
      if (err) {
        this.setState({ submitLoading: false });
        return;
      }
      values.tradeConfirmDate = datePickerFormat(values.tradeConfirmDate);
      dispatch({
        type: 'myInvestor/handleAdditionalRecord',
        payload: {
          id: recordId,
          ...values,
        },
      }).then(res => {
        message.success('补录成功~');
        form.resetFields();
        this.handleCancel();
        this.setState({ submitLoading: false });
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { visible, dicts, submitLoading, saveDetail } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Button type="link" size="small" onClick={this.showModal}>
          补录
        </Button>
        <MakeUpModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          dicts={dicts}
          submitLoading={submitLoading}
          saveDetail={saveDetail}
          dispatch={dispatch}
          onCancel={this.handleCancel}
          onCreate={this.handleSubmit}
        />
      </>
    );
  }
}

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ myInvestor }) => ({
      myInvestor,
    }))(MakeUpModal),
  ),
);

export default WrappedIndex;

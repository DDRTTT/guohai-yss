import { Form, Input, Button, Card, Row, Col, Radio, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const creditNumReg = /^[0-9a-zA-Z]{18}$/; // 统一社会信用代码校验规则
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; // 电话号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; // 护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; // 护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; // 港澳通行证
const TAIWAN1 = /^[0-9]{8}$/; // 台湾来往大陆通行证
const TAIWAN2 = /^[0-9]{10}$/; // 台湾来往大陆通行证
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

class CustomerInfoChildrenForm extends React.Component {
  state = {
    customerList: [
      {
        id: `${Date.now()}`,
        expands: true,
        customerName: '',
        customerShortName: '',
        customerType: '1',
        customerCode: '',
        industryInvolved: '',
        setUpTime: '',
        publicSector: '',
        publicTime: '',
        legalRepresentative: '',
        registeredCapital: '',
        registeredCapitalCurrency: 'CNY',
        contact: '',
        contactNumber: '',
        businessScope: '',
        remark: '',
        idType: '',
        otherIdType: '',
        idNumber: '',
        sex: '',
        email: '',
      },
    ],
  };

  // 客户信息 新增、删除、展开操作后 更新子表单的数据
  childFormSetFieldsValue = callback => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const customerList = getFieldValue('customerList');

    callback(customerList);
    setFieldsValue({
      customerList,
    });
  };

  // 客户信息 新增子表单
  handleAdd = () => {
    this.childFormSetFieldsValue(customerList => {
      customerList.push({
        ...this.state.customerList[0],
        id: `${Date.now()}`,
      });
      return customerList;
    });
  };

  // 客户信息 删除子表单
  handleRemove = index => {
    this.childFormSetFieldsValue(customerList => {
      if (customerList.length === 1) {
        return;
      }
      customerList.splice(index, 1);
    });
  };

  // 客户信息 展开/收起
  handleExpands = index => {
    this.childFormSetFieldsValue(customerList => {
      const customerListNew = { ...customerList };
      customerListNew[index].expands = !customerListNew[index].expands;
      return customerListNew;
    });
  };

  // 客户类型
  handleCustomerType = (e, index) => {
    this.childFormSetFieldsValue(customerList => {
      const customerListNew = { ...customerList };
      customerListNew[index].customerType = e.target.value;
      return customerListNew;
    });
  };

  // 证件类型
  handleIdType = (value, index) => {
    this.childFormSetFieldsValue(customerList => {
      const customerListNew = { ...customerList };
      customerListNew[index].idType = value;
      customerListNew[index].idNumber = '';
      return customerListNew;
    });
  };

  // 上市板块
  handlePublicSector = (value, index) => {
    this.childFormSetFieldsValue(customerList => {
      const customerListNew = { ...customerList };
      customerListNew[index].publicSector = value;
      if (value === '1006') {
        customerListNew[index].publicTime = '';
      }
      return customerListNew;
    });
  };

  // 上市时间、成立时间
  handleDatePicker = (date, dateString, index, name) => {
    this.childFormSetFieldsValue(customerList => {
      const customerListNew = { ...customerList };
      customerListNew[index][name] = dateString;
      return customerListNew;
    });
  };

  // 格式化日期
  formatDate = date => (date ? moment(date).format('YYYY-MM-DD') : '');

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      data: {
        idTypeList,
        proTradeList,
        proPlateList,
        moneyFormat,
        capitalCurrencyList,
        pageInfo,
        dis,
      },
    } = this.props;
    getFieldDecorator('customerList', {
      initialValue: pageInfo.customerList ? pageInfo.customerList : this.state.customerList,
    });
    const customerList = getFieldValue('customerList');

    return (
      <>
        {customerList.map((customerListItem, customerListIndex) => (
          <Card
            title="客户信息"
            extra={
              <>
                <Button type="link" onClick={this.handleAdd} disabled={dis}>
                  添加
                </Button>
                {customerList.length > 1 ? (
                  <Button
                    type="link"
                    onClick={() => this.handleRemove(customerListIndex)}
                    disabled={dis}
                  >
                    删除
                  </Button>
                ) : null}
                <Button type="link" onClick={() => this.handleExpands(customerListIndex)}>
                  {customerListItem.expands ? '展开' : '收起'}
                </Button>
              </>
            }
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: customerListItem.expands ? 'block' : 'none' }}>
              <Row>
                <Col span={8}>
                  <Form.Item label="客户名称:">
                    {getFieldDecorator(`customerInfoCustomerName[${customerListItem.id}]`, {
                      initialValue: customerListItem.customerName,
                      rules: [{ required: true, message: '客户名称是必填项' }],
                    })(<Input placeholder="请输入" maxLength={50} disabled={dis} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="客户简称:">
                    {getFieldDecorator(`customerInfoCustomerShortName[${customerListItem.id}]`, {
                      initialValue: customerListItem.customerShortName,
                    })(<Input placeholder="请输入" maxLength={25} disabled={dis} />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="客户类型:">
                    {getFieldDecorator(`customerInfoCustomerType[${customerListItem.id}]`, {
                      initialValue: customerListItem.customerType || '1',
                      rules: [{ required: true, message: '客户类型是必填项' }],
                    })(
                      <Radio.Group
                        onChange={e => this.handleCustomerType(e, customerListIndex)}
                        disabled={dis}
                      >
                        <Radio value="1">机构</Radio>
                        <Radio value="0">自然人</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                {customerListItem.customerType === '1' ? (
                  <>
                    {/* 客户类型：机构 */}
                    <Col span={8}>
                      <Form.Item label="统一社会信用代码:">
                        {getFieldDecorator(`customerInfoCustomerCode[${customerListItem.id}]`, {
                          initialValue: customerListItem.customerCode,
                          rules: [
                            {
                              required: true,
                              message: '统一社会信用代码是必填项',
                            },
                            {
                              validator: (rule, value, callback) => {
                                if (value && !creditNumReg.test(value)) {
                                  callback('统一社会信用代码格式错误');
                                } else {
                                  callback();
                                }
                              },
                            },
                          ],
                        })(<Input placeholder="请输入" disabled={dis} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="所属行业:">
                        {getFieldDecorator(`customerInfoIndustryInvolved[${customerListItem.id}]`, {
                          initialValue: customerListItem.industryInvolved,
                          rules: [
                            {
                              required: true,
                              message: '所属行业是必填项',
                            },
                          ],
                        })(
                          <Select placeholder="请选择" showSearch allowClear disabled={dis}>
                            {proTradeList &&
                              proTradeList.map(item => (
                                <Option key={item.code} value={item.code}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="成立时间">
                        {getFieldDecorator(`customerInfoSetUpTime[${customerListItem.id}]`, {
                          initialValue: customerListItem.setUpTime
                            ? moment(this.formatDate(customerListItem.setUpTime))
                            : '',
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                if (
                                  value &&
                                  moment(this.formatDate(customerListItem.setUpTime)).isAfter(
                                    this.formatDate(customerListItem.publicTime),
                                  )
                                ) {
                                  callback('成立时间不能大于上市时间');
                                } else {
                                  callback();
                                }
                              },
                            },
                          ],
                        })(
                          <DatePicker
                            placeholder="请选择"
                            disabled={dis}
                            onChange={(date, dateString) =>
                              this.handleDatePicker(
                                date,
                                dateString,
                                customerListIndex,
                                'setUpTime',
                              )
                            }
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="上市板块:">
                        {getFieldDecorator(`customerInfoPublicSector[${customerListItem.id}]`, {
                          initialValue: customerListItem.publicSector,
                        })(
                          <Select
                            placeholder="请选择"
                            showArrow
                            onChange={value => this.handlePublicSector(value, customerListIndex)}
                            disabled={dis}
                          >
                            {proPlateList &&
                              proPlateList.map(item => (
                                <Option key={item.code} value={item.code}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    {customerListItem.publicSector !== '1006' ? (
                      <Col span={8}>
                        <Form.Item label="上市时间">
                          {getFieldDecorator(`customerInfoPublicTime[${customerListItem.id}]`, {
                            initialValue: customerListItem.publicTime
                              ? moment(this.formatDate(customerListItem.publicTime))
                              : '',
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  if (
                                    value &&
                                    moment(this.formatDate(customerListItem.publicTime)).isBefore(
                                      this.formatDate(customerListItem.setUpTime),
                                    )
                                  ) {
                                    callback('上市时间需大于成立时间');
                                  } else {
                                    callback();
                                  }
                                },
                              },
                            ],
                          })(
                            <DatePicker
                              placeholder="请选择"
                              disabled={dis}
                              onChange={(date, dateString) =>
                                this.handleDatePicker(
                                  date,
                                  dateString,
                                  customerListIndex,
                                  'publicTime',
                                )
                              }
                            />,
                          )}
                        </Form.Item>
                      </Col>
                    ) : null}
                    <Col span={8}>
                      <Form.Item label="法人代表:">
                        {getFieldDecorator(
                          `customerInfoLegalRepresentative[${customerListItem.id}]`,
                          {
                            initialValue: customerListItem.legalRepresentative,
                          },
                        )(<Input placeholder="请输入" maxLength={25} disabled={dis} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="注册资本(万):">
                        {getFieldDecorator(
                          `customerInfoRegisteredCapital[${customerListItem.id}]`,
                          {
                            initialValue: customerListItem.registeredCapital,
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  const reg = /^[0-9\.\,]*$/g;
                                  if (value && !reg.test(value)) {
                                    callback('输入金额格式不对');
                                  } else {
                                    callback();
                                  }
                                },
                              },
                            ],
                          },
                        )(
                          <InputNumber
                            style={{ width: '100%' }}
                            maxLength={20}
                            formatter={value => moneyFormat(value)}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="请输入"
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="币种:">
                        {getFieldDecorator(
                          `customerInfoRegisteredCapitalCurrency[${customerListItem.id}]`,
                          {
                            initialValue: customerListItem.registeredCapitalCurrency || 'CNY',
                          },
                        )(
                          <Select placeholder="请选择" showArrow disabled={dis}>
                            {capitalCurrencyList &&
                              capitalCurrencyList.map(item => (
                                <Option key={item.code} value={item.code}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="联系人:">
                        {getFieldDecorator(`customerInfoContact[${customerListItem.id}]`, {
                          initialValue: customerListItem.contact,
                        })(<Input placeholder="请输入" maxLength={10} disabled={dis} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="联系电话:">
                        {getFieldDecorator(`customerInfoContactNumber[${customerListItem.id}]`, {
                          initialValue: customerListItem.contactNumber,
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                if (
                                  (value &&
                                    (phoneReg.test(value) ||
                                      phoneReg2.test(value) ||
                                      numReg.test(value))) ||
                                  !value
                                ) {
                                  callback();
                                } else {
                                  callback('格式校验失败!');
                                }
                              },
                            },
                          ],
                        })(
                          <Input
                            placeholder="请输入"
                            type="number"
                            maxLength={14}
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="经营范围:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                        {getFieldDecorator(`customerInfoBusinessScope[${customerListItem.id}]`, {
                          initialValue: customerListItem.businessScope,
                          rules: [
                            {
                              required: true,
                              message: '经营范围是必填项',
                            },
                          ],
                        })(
                          <TextArea
                            rows={4}
                            allowClear
                            maxLength={2000}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            placeholder="请输入2000字以内内容..."
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="备注:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                        {getFieldDecorator(`customerInfoRemark[${customerListItem.id}]`, {
                          initialValue: customerListItem.remark,
                        })(
                          <TextArea
                            rows={4}
                            allowClear
                            maxLength={2000}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            placeholder="请输入2000字以内内容..."
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <>
                    {/* 客户类型：自然人 */}
                    <Col span={8}>
                      <Form.Item label="证件类型:">
                        {getFieldDecorator(`customerInfoIdType[${customerListItem.id}]`, {
                          initialValue: customerListItem.idType,
                          rules: [
                            {
                              required: true,
                              message: '证件类型是必填项',
                            },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
                            showArrow
                            onChange={value => this.handleIdType(value, customerListIndex)}
                            disabled={dis}
                          >
                            {idTypeList &&
                              idTypeList.map(item => (
                                <Option key={item.code} value={item.code}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    {customerListItem.idType === '1007' ? (
                      <Col span={8}>
                        <Form.Item label="其他证件类型:">
                          {getFieldDecorator(`customerInfoOtherIdType[${customerListItem.id}]`, {
                            initialValue: customerListItem.otherIdType,
                            rules: [
                              {
                                required: true,
                                message: '其他证件类型是必填项',
                              },
                            ],
                          })(<Input placeholder="请输入" maxLength={25} disabled={dis} />)}
                        </Form.Item>
                      </Col>
                    ) : null}
                    <Col span={8}>
                      <Form.Item label="证件号码:">
                        {getFieldDecorator(`customerInfoIdNumber[${customerListItem.id}]`, {
                          initialValue: customerListItem.idNumber,
                          rules: [
                            {
                              required: true,
                              message: '证件号码是必填项',
                            },
                            {
                              validator: (rule, value, callback) => {
                                switch (customerListItem.idType) {
                                  case '1001':
                                    if (!idCardReg.test(value)) {
                                      callback('身份证号格式不正确!');
                                    }
                                    break;
                                  case '1002':
                                    if (!(PASSPORT1.test(value) || PASSPORT2.test(value))) {
                                      callback('护照号码格式不正确!');
                                    }
                                    break;
                                  case '1003':
                                    if (!HKMAKAO.test(value)) {
                                      callback('港澳居民通行证号码格式不正确!');
                                    }
                                    break;
                                  case '1004':
                                    if (!(TAIWAN1.test(value) || TAIWAN2.test(value))) {
                                      callback('台湾来往通行证号码格式不正确!');
                                    }
                                    break;
                                  default:
                                    callback();
                                }
                              },
                            },
                          ],
                        })(<Input placeholder="请输入" maxLength={18} disabled={dis} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="性别:">
                        {getFieldDecorator(`customerInfoSex[${customerListItem.id}]`, {
                          initialValue: customerListItem.sex,
                        })(
                          <Radio.Group disabled={dis}>
                            <Radio value="0">男</Radio>
                            <Radio value="1">女</Radio>
                          </Radio.Group>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="邮箱:">
                        {getFieldDecorator(`customerInfoEmail[${customerListItem.id}]`, {
                          initialValue: customerListItem.email,
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                if (value && !emailReg.test(value)) {
                                  callback('邮箱格式错误');
                                } else {
                                  callback();
                                }
                              },
                            },
                          ],
                        })(<Input placeholder="请输入" maxLength={50} disabled={dis} />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="联系电话:">
                        {getFieldDecorator(`customerInfoContactNumber[${customerListItem.id}]`, {
                          initialValue: customerListItem.contactNumber,
                          rules: [
                            {
                              validator: (rule, value, callback) => {
                                if (
                                  (value &&
                                    (phoneReg.test(value) ||
                                      phoneReg2.test(value) ||
                                      numReg.test(value))) ||
                                  !value
                                ) {
                                  callback();
                                } else {
                                  callback('格式校验失败!');
                                }
                              },
                            },
                          ],
                        })(
                          <Input
                            placeholder="请输入"
                            type="number"
                            maxLength={14}
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="备注:" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                        {getFieldDecorator(`customerInfoRemark[${customerListItem.id}]`, {
                          initialValue: customerListItem.remark,
                        })(
                          <TextArea
                            rows={4}
                            allowClear
                            maxLength={2000}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            placeholder="请输入2000字以内内容..."
                            disabled={dis}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </Card>
        ))}
      </>
    );
  }
}

export default CustomerInfoChildrenForm;

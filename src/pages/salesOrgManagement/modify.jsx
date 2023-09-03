import React from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';

import { connect } from 'dva';
import { router } from 'umi';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import AddAccount from './addAccount';
import styles from './index.less';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { Card, Table, PageContainers } from '@/components';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const dictList = {
  codeList: 'X001,X003,X019',
};

const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    tableData: [],
    accountList: [],
    isShowAddAccount: false,
    editAccount: {},
    productDataInfo: {
      sellerAccountInfoParamList: [],
      salesOrgInfoElement: {},
    },
    bankList: [],
  };

  componentDidMount() {
    this.getProductInfo();
    this.getTypeList();
    this.getDicList();
    this.getBankInfo();
  }

  // 数据回显
  getProductInfo() {
    // const { form: { setFieldsValue } } = this.props;
    const query = window.location.search;
    const abc = query.split('=');
    this.props
      .dispatch({
        type: `salesOrgManagement/handleProInfo`,
        payload: abc[1],
      })
      .then(res => {
        if (res && res.data && res.data.salesOrgInfoElement) {
          this.onRadioChange({
            target: {
              value: res.data.salesOrgInfoElement.sellerType,
            },
          });
          this.setState({
            productDataInfo: res.data,
          });
          // console.log(222, res.data)
          // setFieldsValue({
          // sellerNameFull,
          // sellerName,
          // sellerCode,
          // sellerType: res.data.salesOrgInfoElement.sellerType,
          // channelType,
          // })
        }
      });
  }

  // 词汇字典
  getTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: `salesOrgManagement/queryTypeList`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  getDicList() {
    const { dispatch } = this.props;
    const params = { fcode: '' };
    dispatch({
      type: `salesOrgManagement/queryCriteria`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          channelList: res,
        });
      }
    });
  }

  getBankInfo() {
    const { dispatch } = this.props;
    const params = {
      orgType: 'J004_2',
      qualifyType: 'J001_4',
    };
    dispatch({
      type: `salesOrgManagement/queryBankInfo`,
      payload: params,
    }).then(res => {
      console.log(res);
      if (res && res.status === 200) {
        this.setState({
          bankList: res.data,
        });
      }
    });
  }

  onShowAddAccount = data => {
    this.setState({
      editAccount: data || {},
      isShowAddAccount: true,
    });
  };

  // 设置 账户列表
  setAccountList = data => {
    const { accountList } = this.state;
    if (data && data.indexId) {
      for (let index = 0; index < accountList.length; index++) {
        if (accountList[index].indexId === data.indexId) {
          accountList[index] = data;
        }
        accountList[index].index = index + 1;
      }
    } else if (data) {
      accountList.push({
        ...data,
        index: accountList.length + 1,
        indexId: +new Date(),
      });
    }
    this.setState({
      accountList,
      isShowAddAccount: false,
    });
  };

  // 删除
  delAccountList = record => {
    const { accountList } = this.state;
    const index = accountList.findIndex(item => JSON.stringify(item) == JSON.stringify(record));
    if (~index) {
      accountList.splice(index, 1);
      this.setState({
        accountList,
      });
    }
  };

  //  渠道类型
  onRadioChange = values => {
    const { dispatch } = this.props;
    const fCode = values.target.value;
    const params = { fcode: fCode };
    const { setFieldsValue, getFieldValue } = this.props.form;

    dispatch({
      type: `salesOrgManagement/queryCriteria`,
      payload: params,
    }).then(res => {
      this.setState({
        channelList: res || [],
      });
      const { productDataInfo } = this.state;
      const state1 = productDataInfo.salesOrgInfoElement.sellerType === getFieldValue('sellerType');
      const state2 =
        productDataInfo.salesOrgInfoElement.channelType === getFieldValue('channelType');
      if (!(state1 && state2)) {
        setFieldsValue({ channelType: undefined });
      }
      // resetFields(['channelType']);
    });
  };

  // 保存
  addSave = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { accountList } = this.state;
      const { dispatch, form } = this.props;
      const query = window.location.search;
      const abc = query.split('=');
      const formItems = form.getFieldsValue();
      if (accountList.length == 0) {
        message.error('请添加账户信息');
      } else {
        const params = {
          salesOrgInfoElement: {
            id: abc[1],
            ...formItems,
          },
          sellerAccountInfoParamList: accountList,
        };

        dispatch({
          type: `salesOrgManagement/querysalesUpdate`,
          payload: params,
        }).then(res => {
          if (res && res.status === 200) {
            router.push('/productDataManage/salesOrgManagement');
          }
        });
      }
    });
  };

  // 取消
  addCancel = () => {
    this.props.form.resetFields();
    this.setState({
      accountList: [],
    });
    router.push('/productDataManage/salesOrgManagement');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      salesOrgManagement: { zdSettleList, sellerList, dicList },
    } = this.props;
    const { accountList, channelList, productDataInfo, bankList } = this.state;
    const { salesOrgInfoElement, sellerAccountInfoParamList } = productDataInfo;
    // if (sellerAccountInfoParamList.length !== 0 && accountList.length === 0) {
    //   const list = []
    //   sellerAccountInfoParamList.forEach((item, index) => {
    //     list.push({
    //       index: index + 1,
    //       indexId: item.id,
    //       ...item
    //     })
    //   })
    //   this.setState({
    //     accountList: list,
    //   });
    // }

    if (
      sellerAccountInfoParamList.length !== 0 &&
      accountList.length === 0 &&
      !this.state.accountListStatus
    ) {
      const list = [];
      sellerAccountInfoParamList.forEach((item, index) => {
        list.push({
          index: index + 1,
          indexId: item.id,
          ...item,
        });
      });
      this.setState({
        accountList: list,
        accountListStatus: true,
      });
    }

    const baseTable = () => {
      const bankListMap = {};
      bankList.forEach(item => {
        bankListMap[item.id] = item.orgName;
      });
      const columns = [
        // {
        //   title: '序号',
        //   dataIndex: 'index',
        //   key: 'index',
        // },
        {
          title: '账户名',
          dataIndex: 'accountName',
          key: 'accountName',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.accountName} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.accountName}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
        },
        {
          title: '账号',
          dataIndex: 'accountNo',
          key: 'accountNo',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.accountNo} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.accountNo}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
          align: 'right',
        },
        {
          title: '账户业务类型',
          dataIndex: 'salesAccountBizTypeList',
          key: 'salesAccountBizTypeList',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip
                  title={
                    record.salesAccountBizTypeList &&
                    record.salesAccountBizTypeList
                      .map(item => {
                        return dicList?.X019?.find(sonItem => sonItem.code == item).name;
                      })
                      .join(',')
                  }
                  placement="topLeft"
                >
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.salesAccountBizTypeList &&
                      record.salesAccountBizTypeList
                        .map(item => {
                          return dicList?.X019?.find(sonItem => sonItem.code == item).name;
                        })
                        .join(',')}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
        },
        {
          title: '开户行',
          dataIndex: 'openingInstitution',
          key: 'openingInstitution',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={bankListMap[record.openingInstitution]} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {bankListMap[record.openingInstitution]}
                  </span>
                </Tooltip>
              );
            }
            handleChangeLabel(_);
          },
        },
        {
          title: '联行号',
          dataIndex: 'bankNo',
          key: 'bankNo',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.bankNo} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.bankNo}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
          align: 'right',
        },
        {
          title: '大额支付号',
          dataIndex: 'paymentNo',
          key: 'paymentNo',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.paymentNo} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.paymentNo}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
          align: 'right',
        },
        {
          title: '用途',
          dataIndex: 'purpose',
          key: 'purpose',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.purpose} placement="topLeft">
                  <span
                    style={{
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      paddingTop: '5px',
                    }}
                  >
                    {record.purpose}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
          },
        },
        {
          title: '操作',
          key: 'opt',
          render: (text, record, index) => (
            <span>
              <a
                onClick={() => {
                  this.onShowAddAccount(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.delAccountList(record);
                }}
              >
                删除
              </a>
            </span>
          ),
        },
      ];
      return <Table columns={columns} dataSource={accountList} />;
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
          <Card 
            title="销售机构信息"
            extra={[<Button type="primary" onClick={() => this.addSave()}>
              保存
            </Button>,
            <Button type="" className={styles.button} onClick={() => this.addCancel()}>
              取消
            </Button>]}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8}>
                  <FormItem name="sellerNameFull" label="销售机构名称:" {...formItemLayout}>
                    {getFieldDecorator('sellerNameFull', {
                      initialValue: salesOrgInfoElement.sellerNameFull,
                      rules: [{ required: true, message: '请输入销售机构简称', whitespace: true }],
                    })(<Input allowClear placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem name="sellerName" label="销售机构简称:" {...formItemLayout}>
                    {getFieldDecorator('sellerName', {
                      initialValue: salesOrgInfoElement.sellerName,
                      rules: [{ required: true, message: '请输入销售机构简称', whitespace: true }],
                    })(<Input allowClear placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem name="sellerCode" label="销售商代码:" {...formItemLayout}>
                    {getFieldDecorator('sellerCode', {
                      initialValue: salesOrgInfoElement.sellerCode,
                      rules: [{ required: true, message: '请输入销售商代码', whitespace: true }],
                    })(<Input allowClear placeholder="请输入" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8}>
                  <FormItem name="sellerType" label="销售商类型:" {...formItemLayout}>
                    {getFieldDecorator('sellerType', {
                      initialValue: salesOrgInfoElement.sellerType,
                      rules: [{ required: true, message: '请选择' }],
                    })(
                      <Radio.Group onChange={this.onRadioChange}>
                        {sellerList &&
                          sellerList.length > 0 &&
                          sellerList.map(item => (
                            <Radio key={item.code} value={item.code}>
                              {item.name}
                            </Radio>
                          ))}
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="渠道类型:" {...formItemLayout}>
                    {getFieldDecorator('channelType', {
                      initialValue: salesOrgInfoElement.channelType,
                      rules: [{ required: true, message: '请选择渠道类型' }],
                    })(
                      <Select allowClear placeholder="请选择">
                        {channelList &&
                          channelList.length > 0 &&
                          channelList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={24}>
                      <FormItem name="zdSettlePlace" label="中登结算地点:" {...formItemLayout}>
                        {getFieldDecorator('zdSettlePlace', {
                          initialValue: salesOrgInfoElement.zdSettlePlace,
                        })(
                          <Radio.Group>
                            {/* <Radio.Group> */}
                            {zdSettleList &&
                              zdSettleList.length > 0 &&
                              zdSettleList.map(item => (
                                <Radio key={item.code} value={item.code}>
                                  {item.name}
                                </Radio>
                              ))}
                          </Radio.Group>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8}>
                  <FormItem name="customerPhone" label="客服电话:" {...formItemLayout}>
                    {getFieldDecorator('customerPhone', {
                      rules: [
                        {
                          pattern: /(^1[0-9]{10}$)|(^\+\d{13}$)/,
                          message: '请输入正确的电话',
                        },
                      ],
                      initialValue: salesOrgInfoElement.customerPhone,
                    })(<Input allowClear placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem name="website" label="网址:" {...formItemLayout}>
                    {getFieldDecorator('website', {
                      rules: [
                        {
                          pattern: /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
                          message: '请输入正确的网址',
                        },
                      ],
                      initialValue: salesOrgInfoElement.website,
                    })(<Input allowClear placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8}></Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24}>
                  <Row>
                    <Col span={2} style={{ textAlign: 'right', marginLeft: 20 }}>
                      备注：
                    </Col>
                    <Col span={20}>
                      <FormItem label="" {...formItemLayout}>
                        {getFieldDecorator('remarks', { initialValue: salesOrgInfoElement.remarks })(
                          <TextArea maxLength={256} rows={10} allowClear placeholder="请输入" />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>  
          </Card>
          <Card 
            title={<>
              账户信息
              <Tooltip title="账户业务类型：资管清算岗在使用销售商往来账户信息时需要有明确的业务类型，销售机构维护时必须明确“申购付款账户”、“认购退款收款账户”、“赎回分红款收款账户”、“销售服务费收款账户”这四类业务类型">
                <Icon style={{ marginLeft: '10px' }} type="info-circle" />
              </Tooltip>
            </>}
            extra={<Button type="primary" onClick={() => this.onShowAddAccount()}>新增</Button>}
            className="margin_t16"
          >
            {baseTable()}
            <AddAccount
              businessTypeList={dicList.X019}
              bankList={bankList}
              isShowAddAccount={this.state.isShowAddAccount}
              updateAccountList={this.setAccountList}
              editAccount={this.state.editAccount}
            />
          </Card>
        </Form>
      );
    };

    return (
      <PageContainers
        breadcrumb={[
          {
            title: '产品数据管理',
            url: '',
          },
          {
            title: '销售机构管理',
            url: '/productDataManage/salesOrgManagement',
          },
          {
            title: '修改',
            url: '',
          },
        ]}
      >
        {baseForm()}
      </PageContainers>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ salesOrgManagement, loading }) => ({
        salesOrgManagement,
        loading: loading.effects['salesOrgManagement/queryProducrSave'],
      }))(RegistrationForm),
    ),
  ),
);

export default WrappedSingleForm;

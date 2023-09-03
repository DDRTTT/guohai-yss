import React, { Component } from 'react';
import {
  Col,
  Collapse,
  Divider,
  Form,
  Icon,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import router from 'umi/router';
import styles from './index.less';
import { downloadNoToken, filePreview } from '@/utils/download';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { Card, PageContainers, Table } from '@/components';
import Gird from '@/components/Gird';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const dictList = {
  codeList: 'X001, X003, X006, X007, X004,X019',
};

@Form.create()
class RegistrationForm extends Component {
  state = {
    modalVisible: false,
    oTotal: 10,
    page: 1,
    limit: 10,
    productdata: [],
    viewDetailsdata: {},
    collapseData: [],
    productDataInfo: {
      sellerAccountInfoParamList: [],
      salesOrgInfoElement: {},
    },
    tabKey: 'account',
  };

  componentDidMount() {
    this.getProductInfo();
    this.getTypeList();
    this.getDicList();
    this.getProtocolInfo();
    this.getProDetailsList();
    this.getFileType();
  }

  // 数据回显
  getProductInfo() {
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

  // wenjian
  getFileType() {
    const { dispatch } = this.props;
    dispatch({
      type: `salesOrgManagement/handleFileType`,
      payload: {
        moduleCode: 'M001_3',
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

  //  渠道类型
  onRadioChange = values => {
    const { dispatch } = this.props;
    const fCode = values.target.value;
    const params = { fcode: fCode };
    const { resetFields } = this.props.form;

    dispatch({
      type: `salesOrgManagement/queryCriteria`,
      payload: params,
    }).then(res => {
      this.setState({
        channelList: res || [],
      });
      resetFields(['channelType']);
    });
  };

  // 协议信息
  getProtocolInfo() {
    const { dispatch } = this.props;
    const query = window.location.search;
    const abc = query.split('=');
    dispatch({
      type: `salesOrgManagement/handleProtocolInfo`,
      payload: { id: abc[1] },
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          collapseData: res.data,
        });
      }
    });
  }

  // 销售产品信息列表
  getProDetailsList() {
    const { dispatch } = this.props;
    const { limit, page } = this.state;
    const query = window.location.search;
    const abc = query.split('=');
    dispatch({
      type: `salesOrgManagement/handleProDetailsList`,
      payload: {
        id: abc[1],
        pageNum: page,
        pageSize: limit,
      },
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          productdata: res.data.rows,
          oTotal: res.data.total,
          loading: false,
        });
      }
    });
  }

  // 页面change
  sizeChange = (current, size) => {
    this.setState(
      {
        page: current,
        limit: size,
      },
      () => {
        this.getProDetailsList();
      },
    );
  };

  onCancelDetails = () => {
    router.push('/productDataManage/salesOrgManagement');
  };

  // 查询单个商品详情
  onShowProductDetails = item => {
    const { dispatch } = this.props;
    const query = window.location.search;
    const abc = query.split('=');
    dispatch({
      type: `salesOrgManagement/handleProDetails`,
      payload: {
        id: abc[1],
        proCode: item.proCode,
      },
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          viewDetailsdata: res.data,
          // oTotal: res.data.total,
          loading: false,
        });
      }
    });
    this.setState({
      modalVisible: true,
    });
  };

  // 文件下载
  downLoadFile = item => {
    downloadNoToken(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${item.fileSerialNumber}@${item.fileName}.${item.fileForm}`,
    );
  };

  // 文件查看
  viewFile = item => {
    message.success('查看预览准备中 . . .');
    filePreview(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${item.fileSerialNumber}@${item.fileName}.${item.fileForm}`,
    );
  };

  handleChangeTabKey = tabKey => this.setState({ tabKey });

  render() {
    const {
      salesOrgManagement: { zdSettleList, sellerList, rateMonList, filesTypeList, dicList },
    } = this.props;
    const {
      productdata,
      oTotal,
      page,
      tabKey,
      viewDetailsdata,
      collapseData,
      productDataInfo,
      channelList,
    } = this.state;
    const { salesOrgInfoElement, sellerAccountInfoParamList } = productDataInfo;
    const { product, rateCategories, sellerAccount } = viewDetailsdata;
    const baseTable = () => {
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
          },
        },
        {
          title: '账号',
          dataIndex: 'accountNo',
          key: 'accountNo',
          render: (_, record) => {
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
          },
          align: 'right',
        },
        {
          title: '账户业务类型',
          dataIndex: 'salesAccountBizTypeList',
          key: 'salesAccountBizTypeList',
          render: (_, record) => {
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
          },
        },
        {
          title: '开户行',
          dataIndex: 'openingInstitutionName',
          key: 'openingInstitutionName',
          render: (_, record) => {
            if (_) {
              return (
                <Tooltip title={record.openingInstitutionName} placement="topLeft">
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
                    {record.openingInstitutionName}
                  </span>
                </Tooltip>
              );
            }
            return handleChangeLabel(_);
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
      ];
      return <Table bordered columns={columns} dataSource={sellerAccountInfoParamList || []} 
        rowClassName={(record, index) => {
          let className = '';
          if (index % 2 === 1) className = 'bgcFBFCFF';
          return className;
        }}
      />;
    };

    // 销售产品列表
    const productColumns = [
      {
        title: '产品全称',
        dataIndex: 'proName',
        key: 'proName',
        render: (_, record) => {
          if (_) {
            return (
              <Tooltip title={record.proName} placement="topLeft">
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
                  {record.proName}
                </span>
              </Tooltip>
            );
          }
          return handleChangeLabel(_);
        },
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        render: (_, record) => {
          if (_) {
            return (
              <Tooltip title={record.proCode} placement="topLeft">
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
                  {record.proCode}
                </span>
              </Tooltip>
            );
          }
          return handleChangeLabel(_);
        },
      },
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
        title: '账户',
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
        title: '开户行',
        dataIndex: 'openingInstitution',
        key: 'openingInstitution',
        render: (_, record) => {
          if (_) {
            return (
              <Tooltip title={record.openingInstitution} placement="topLeft">
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
                  {record.openingInstitution}
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
        render: (text, record) => (
          <a
            onClick={() => {
              this.onShowProductDetails(record);
            }}
          >
            详情
          </a>
        ),
      },
    ];

    // 费率信息
    const rateColumns = [
      {
        title: '基本费率（%）',
        dataIndex: 'basicRate',
        key: 'basicRate',
      },
      {
        title: '基准类型',
        dataIndex: 'datumTypeName',
        key: 'datumTypeName',
      },
      {
        title: '基准下线',
        dataIndex: 'baselineLine',
        key: 'baselineLine',
      },
      {
        title: '基准上线(含)',
        dataIndex: 'baselineOnline',
        key: 'baselineOnline',
      },
      {
        title: '比率值(%)',
        dataIndex: 'ratioValue',
        key: 'ratioValue',
      },
      {
        title: '固定值',
        dataIndex: 'fixedValue',
        key: 'fixedValue',
      },
      {
        title: '最大值',
        dataIndex: 'maxinmumValue',
        key: 'maxinmumValue',
      },
      {
        title: '最小值',
        dataIndex: 'minimumValue',
        key: 'minimumValue',
      },
    ];

    // 相关文档
    const fileColums = [
      {
        title: '文档类型',
        dataIndex: 'fileType',
        key: 'fileType',
        render: (text, recod) => {
          if (text) {
            return (
              <Select disabled value={recod.fileType}>
                {filesTypeList &&
                  filesTypeList.length > 0 &&
                  filesTypeList.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            );
          }
          return handleChangeLabel(text);
        },
      },
      {
        title: '名称',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      {
        title: '文档格式',
        dataIndex: 'fileForm',
        key: 'fileForm',
      },
      {
        title: '文件来源',
        dataIndex: 'fileSource',
        key: 'fileSource',
      },
      {
        title: '文件版本',
        dataIndex: 'fileVersion',
        key: 'fileVersion',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        textalign: 'left',
        render: (text, record) => {
          if (record.fileForm === 'pdf' && 'image') {
            return (
              <>
                <span>
                  <a
                    type="link"
                    onClick={() => {
                      this.viewFile(record);
                    }}
                  >
                    查看
                  </a>
                  <Divider type="vertical" />
                  <a
                    type="link"
                    onClick={() => {
                      this.downLoadFile(record);
                    }}
                  >
                    下载
                  </a>
                </span>
              </>
            );
          }
          return (
            <>
              <span>
                <a
                  type="link"
                  disabled="disabled"
                  onClick={() => {
                    this.viewFile(record);
                  }}
                >
                  查看
                </a>
                <Divider type="vertical" />
                <a
                  type="link"
                  onClick={() => {
                    this.downLoadFile(record);
                  }}
                >
                  下载
                </a>
              </span>
            </>
          );
        },
      },
    ];

    // 销售机构信息 - 账户信息详情配置
    const drawerConfigForAccount = [
      { label: '销售机构名称', value: 'sellerNameFull' },
      { label: '销售机构简称', value: 'sellerName' },
      { label: '销售商代码', value: 'sellerCode' },
      { 
        label: '销售商类型', 
        value: 'sellerType', 
        type: 'select', 
        option: sellerList, 
      },{ 
        label: '渠道类型', 
        value: 'channelType', 
        type: 'select', 
        option: channelList, 
      },{ 
        label: '中登结算地点', 
        value: 'zdSettlePlace', 
        type: 'select', 
        option: zdSettleList, 
      },
      { label: '客服电话', value: 'customerPhone' },
      { label: '网址', value: 'website' },
      { label: '备注', value: 'remarks', proportion:true },
    ]
    // 销售机构信息 - 协议信息详情配置
    const drawerConfigForAgreement = {
      details:[
        { label: '协议名称', value: 'contractName' },
        { label: '生效日期', value: 'effectiveDate' },
        { label: '注销日期', value: 'cancellDate' },
        { label: '备注', value: 'remarks', proportion:true },
      ],
      serviceChargeForSale:[
        { 
          label: '付费频率', 
          value: 'salePayRate', 
          type: 'select', 
          option: rateMonList, 
        },
        { label: '支付条款', value: 'salePayClause' },
      ],
      serviceChargeForCustomer: [
        { 
          label: '付费频率', 
          value: 'customerPayRate', 
          type: 'select', 
          option: rateMonList, 
        },
        { label: '客户维护费条款', value: 'customerPayClause' },
      ],
      discount:[
        { label: '优惠信息', value: 'preferentialInfo' },
      ]
    }
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
            title: '查看',
            url: '',
          },
        ]}
        footer={
          <Tabs
            defaultActiveKey={this.state.tabKey}
            onChange={this.handleChangeTabKey}
          >
            <TabPane tab="账户信息" key="account" />
            <TabPane tab="协议信息" key="agreement" />
            <TabPane tab="销售产品信息" key="product" />
          </Tabs>
        }
      >
        {tabKey === 'account' && (
            <>
              <Card title="销售机构信息"><Gird config={drawerConfigForAccount} info={salesOrgInfoElement}/></Card>
              <Card title={<>
                账户信息
                <Tooltip title="账户业务类型：资管清算岗在使用销售商往来账户信息时需要有明确的业务类型，销售机构维护时必须明确“申购付款账户”、“认购退款收款账户”、“赎回分红款收款账户”、“销售服务费收款账户”这四类业务类型">
                  <Icon style={{ marginLeft: '10px' }} type="info-circle" />
                </Tooltip>
              </>}
              className="margin_t16"
              >{baseTable()}</Card>
            </>
          )}
          {tabKey === 'agreement' && (
            <div key="agreement" className={styles.detailsFormItem}>
              <Collapse accordion>
                {collapseData.map((item, index) => (
                  <Panel header={`协议信息${index + 1}`} key={item.id}>
                    <>
                      <Gird config={drawerConfigForAgreement.details} info={item}/>
                      <h1 className={'font-w600'}>销售服务费</h1>
                      <Gird config={drawerConfigForAgreement.serviceChargeForSale} info={item}/>
                      <h1 className={'font-w600'}>客户服务费</h1>
                      <Gird config={drawerConfigForAgreement.serviceChargeForCustomer} info={item}/>
                      <h1 className={'font-w600'}>优惠信息</h1>
                      <Gird config={drawerConfigForAgreement.discount} info={item}/>
                      <h1 className={'font-w600'}>相关文档</h1>
                    </>
                    <Table
                      columns={fileColums || []}
                      dataSource={item.businessArchives}
                      pagination={false}
                    />
                  </Panel>
                ))}
              </Collapse>
            </div>
          )}
          {tabKey === 'product' && (
            <div key="product">
              <Card title="产品信息">
                <Table columns={productColumns} dataSource={productdata} pagination={false} />
                {productdata && productdata.length !== 0 ? (
                <Row style={{ paddingTop: 20 }}>
                  <Pagination
                    style={{ float: 'right' }}
                    showSizeChanger
                    showQuickJumper={oTotal > 10}
                    pageSizeOptions={['5', '10', '20', '30', '40']}
                    current={page}
                    total={oTotal}
                    onShowSizeChange={this.sizeChange}
                    onChange={this.sizeChange}
                    showTotal={total => `共 ${total} 条数据`}
                  />
                </Row>
                ) : (
                  ''
                )}
              </Card>
            </div>
          )}
        {/* <Card className={'margin_t16'} title={<>
          账户信息
          <Tooltip title="账户业务类型：资管清算岗在使用销售商往来账户信息时需要有明确的业务类型，销售机构维护时必须明确“申购付款账户”、“认购退款收款账户”、“赎回分红款收款账户”、“销售服务费收款账户”这四类业务类型">
            <Icon style={{ marginLeft: '10px' }} type="info-circle" />
          </Tooltip>
        </>}>{baseTable()}</Card> */}
        <Modal
          title="详情"
          visible={this.state.modalVisible}
          footer={null}
          width={960}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          <div className={styles.detailsAgreementTitle}>产品信息</div>
          {product && (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 12 }}>
              <Col md={8}>
                <Row>
                  <Col span={8}>产品全称:</Col>
                  <Col span={16}>{product.proName}</Col>
                </Row>
              </Col>
              <Col md={8}>
                <Row>
                  <Col span={8}>产品代码:</Col>
                  <Col span={16}>{product.proCode}</Col>
                </Row>
              </Col>
            </Row>
          )}
          {/* <div className={styles.detailsAgreementTitle}>费率信息</div>
          {rateCategories && (
            <>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8}>
                  <Row>
                    <Col span={8}>费用品种:</Col>
                    <Col span={16}>
                      <Select
                        allowClear
                        disabled
                        placeholder=""
                        value={rateCategories.rateCategory}
                      >
                        {rateCategoryList &&
                          rateCategoryList.length > 0 &&
                          rateCategoryList.map(item => (
                            <Option key={item.code} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col md={16}>
                  <Row>
                    <Col span={4}>费率类型:</Col>
                    <Col span={20}>
                      <Radio.Group disabled value={rateCategories.rateType}>
                        {rateTypeList &&
                          rateTypeList.length > 0 &&
                          rateTypeList.map(item => (
                            <Radio key={item.code} value={item.code}>
                              {item.name}
                            </Radio>
                          ))}
                      </Radio.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                {rateCategories && rateCategories.rateType === "X007_1" && (
                  <Col md={8}>
                    <Row>
                      <Col span={8}>固定费率:</Col>
                      <Col span={16}>{rateCategories.rate}</Col>
                    </Row>
                  </Col>
                )}
                {rateCategories && rateCategories.rateType === "X007_3" && (
                  <Col md={8}>
                    <Row>
                      <Col span={10}>固定费用（元）:</Col>
                      <Col span={14}>{rateCategories.fixedExpenses}</Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </>
          )} */}
          {/* {rateCategories && rateCategories.rateType === "X007_2" && (
            <Table columns={rateColumns || []} dataSource={rateList} />
          )} */}
          <div className={styles.detailsAgreementTitle}>账户信息</div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 12 }}>
            <Col md={8}>
              <Row>
                <Col span={8}>账户名:</Col>
                <Col span={16}>{sellerAccount && sellerAccount.accountName}</Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col span={8}>账号:</Col>
                <Col span={16}> {sellerAccount && sellerAccount.accountNo}</Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col span={8}>开户行:</Col>
                <Col span={16}> {sellerAccount && sellerAccount.openingInstitution}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 12 }}>
            <Col md={8}>
              <Row>
                <Col span={8}>联行号:</Col>
                <Col span={16}>{sellerAccount && sellerAccount.bankNo} </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col span={8}>大额支付号:</Col>
                <Col span={16}>{sellerAccount && sellerAccount.paymentNo} </Col>
              </Row>
            </Col>
            <Col md={8}>
              <Row>
                <Col span={8}>用途:</Col>
                <Col span={16}>{sellerAccount && sellerAccount.purpose} </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
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

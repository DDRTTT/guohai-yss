import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  TreeSelect,
  Upload,
} from 'antd';
import styless from './add.less';
import classNames from 'classnames';
import { getAuthToken } from '@/utils/session';
import moment from 'moment';
import _ from 'lodash';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';

const token = getAuthToken();
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const uploadProps = {
  action: '/ams/ams-file-service/fileServer/uploadFile',
  name: 'file',
  data: { uploadFilePath: 'contractfile/examineUploadFile/6' },
  headers: {
    Token: token,
  },
};
const Search = Input.Search;
const columnsFiles = [
  {
    name: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    name: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    name: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  },
];

@errorBoundary
@Form.create()
@connect(state => ({
  newCustomerHandling: state.newCustomerHandling,
  instructionOperate: state.instructionOperate,
  proQuery: state.proQuery,
  memberManagement: state.memberManagement,
  myInvestorInfo: state.myInvestorInfo,
}))
export default class newInvestor extends Component {
  state = {
    selectedRows: [],
    more: false,
    orgDictsData: [], // 机构下拉最终版
    fileList: [],
    fileFinal: [],
    doType: null,
    isfirst: null,

    child11: null,
    isReset: null,

    // 投资者类型 0机构 1个人 2产品
    clientType: '0',
    visible: false,
    // tabel 类型
    riskGradeControl: false,

    // // 投资人信息
    InvestorInfo: [],
    // 经办人信息
    ManagerInfo: [],
    // 产品信息
    ProductInfo: [],
    // 机构信息
    OrganizationInfo: [],
    // 法定代表或负责人信息
    CorporateInfo: [],
    // 资质信息
    QualificationInfo: [],

    // 上传文件类型
    fileType: 'InvestorInfo',
    fileTypeName: ' ',

    // 预览
    previewVisible: false,
    previewImage: null,
    // 金融账号信息个数
    index: [],

    activeKey: '1',

    loadings: false,

    // 附件
    accessories: [],
    options: false,
    flag: true,
    institutionRow: [],
    institutionDelVisible: false,
    fieldsValue: {
      code: 'saleorginfo',
      currentPage: 1,
      pageSize: 10,
    },
    searchInfo: '',
    distributorcodeRequired: false,
    fundacctRequired: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { fieldsValue } = this.state;
    // 请求当前页面词汇字典
    dispatch({
      type: `newCustomerHandling/dictBatchQuery`,
      payload: {
        codeList: 'I009,I001,J002,G001,I003,G002',
      },
    });
    dispatch({
      type: `newCustomerHandling/dictNameAndCodeBatchQuery`,
      payload: {
        codeList: 'investorRiskGrade',
      },
    });

    /**
     * 获取机构下拉字典
     */
    // const handleGetOrgDicts = () => {
    dispatch({
      type: 'myInvestor/getOrgDictsFunc',
      payload: '',
      callback: res => {
        this.setState({
          orgDictsData: res,
        });
      },
    });
    // };

    // 管理人名称
    dispatch({
      type: `proQuery/getfprobank`,
    });

    // 托管人
    dispatch({
      type: 'newCustomerHandling/custodian',
    });

    // ‘机构类型’词汇字典
    dispatch({
      type: `memberManagement/handleOrgTypeDictionary`,
      payload: 'orgType',
    });

    // 销售机构下拉
    dispatch({
      type: 'newCustomerHandling/dropDownSaleorginfo',
      payload: {
        code: 'saleorginfo',
      },
    });
    // 银行下拉
    dispatch({
      type: 'newCustomerHandling/dropDownAccountOpenBank',
    });
    //初始化销售机构下拉
    dispatch({
      type: `myInvestorInfo/getFdistributorcode`,
      payload: fieldsValue,
    });

    // 管理人名称 和 产品托管人
    dispatch({
      type: `myInvestorInfo/getOrgData`,
      payload: {
        orgTypeList: 'TG,GL',
      },
    });

    // 产品类别
    dispatch({
      type: `myInvestorInfo/getProType`,
    });

    dispatch({
      type: `newCustomerHandling/cardType`,
      payload: 'TA_IDTP',
    });
  }

  componentWillReceiveProps(next) {
    const { isfirst, fileList, fileFinal } = this.state;
    let list = [];
    let uList = [];
    //如果点击保存||保存并提交 上传附件置空
    if (next.isReset === 1 && fileList.length !== 0 && fileFinal.length !== 0) {
      this.setState({
        fileList: [],
        fileFinal: [],
      });
    }
    if (next.instructionOperate.dictateOne.files.length !== 0 && !isfirst) {
      next.instructionOperate.dictateOne.files.map((i, n) => {
        list.push({
          uid: n,
          name: i.fileName,
          fileId: i.fileNumber,
          status: 'done',
        });
        uList.push({
          fileNumber: i.fileNumber,
          fileName: i.fileName,
        });
      });
      this.setState({
        fileList: list,
        fileFinal: uList,
        isfirst: 1,
      });
    }
  }

  handleStandardTableChange = pagination => {
    const { fieldsValue } = this.state;
    const { dispatch } = this.props;
    const values = {
      ...fieldsValue,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues: values,
    });
    dispatch({
      type: `newCustomerHandling/getFdistributorcode`,
      payload: values,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  //点击orc OCR文字识别
  orcTest = () => {
    return (
      <div className={styless.ocrStyle} onClick={() => this.orcComponent()}>
        <a>手动录入太麻烦？试试OCR文字识别</a>
        {/*<img src={{ imgs }} alt="" style={{ width: 20, height: 20 }}/>*/}
      </div>
    );
  };

  //ocr识别组件
  orcComponent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instructionOperate/visibleFun',
      payload: false,
    });
  };

  orcClose = () => {
    const {
      dispatch,
      instructionOperate: { correctData },
    } = this.props;
    dispatch({
      type: 'instructionOperate/visibleFun',
      payload: true,
    });
    this.setState({
      orcParam: !!correctData.imgUrl,
    });
  };

  //控制上传文件大小 不可超过5M
  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 50;
    if (!isLt2M) {
      message.error('文件小于50M');
    }
    return isLt2M;
  };

  handleFileChange = info => {
    const {
      fileType,
      InvestorInfo,
      ManagerInfo,
      ProductInfo,
      OrganizationInfo,
      CorporateInfo,
      QualificationInfo,
      accessories,
    } = this.state;

    let { fileList } = info;

    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.status === 200;
      } else if (file.status) {
        return file.status;
      }
      return true;
    });
    if (info.file.status === 'done') {
      if (info.file.response.status === 200) {
        message.success(info.file.name + '上传成功');

        switch (fileType) {
          case 'InvestorInfo':
            InvestorInfo.push(info.file);
            this.setState({ InvestorInfo });
            break;
          case 'ManagerInfo':
            ManagerInfo.push(info.file);
            this.setState({ ManagerInfo });
            break;
          case 'ProductInfo':
            ProductInfo.push(info.file);
            this.setState({ ProductInfo });
            break;
          case 'OrganizationInfo':
            OrganizationInfo.push(info.file);
            this.setState({ OrganizationInfo });
            break;
          case 'CorporateInfo':
            CorporateInfo.push(info.file);
            this.setState({ CorporateInfo });
            break;
          case 'QualificationInfo':
            QualificationInfo.push(info.file);
            this.setState({ QualificationInfo });
            break;
        }
        accessories.push({
          name: info.file.name,
          fileType,
          code: info.file.response.data,
        });
      } else {
        message.error('文件上传失败');
      }
    }

    this.setState({
      fileList,
    });
  };
  remove = (e, fileType) => {
    let { uid, name } = e;

    let item = this.state[fileType];
    let accessories = this.state.accessories;

    let newItem = item.filter(item => {
      return item.uid !== uid;
    });

    let newAccessories = accessories.filter(item => {
      return item.name !== name;
    });

    this.setState({
      [fileType]: newItem,
      accessories: newAccessories,
    });
  };

  // 投资者证件类型
  handleFinvestorType = value => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    this.setState({
      clientType: value,
    });
    switch (value) {
      case '0':
        dispatch({
          type: `newCustomerHandling/cardType`,
          payload: 'TA_IDTP',
        });
        break;
      case '1':
        dispatch({
          type: `newCustomerHandling/cardType`,
          payload: 'TA_IDTPTP',
        });
        break;
      case '2':
        dispatch({
          type: `newCustomerHandling/cardType`,
          payload: 'TA_PROTP',
        });
        break;
    }
    resetFields();
  };

  getStatus = (e, item, sign = false) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }

    let bool = item === 'riskGrade';
    let props = bool
      ? {
        disabled: this.state.riskGradeControl,
      }
      : '';
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        placeholder="请选择"
        {...props}
        allowClear
        disabled={sign}
      >
        {children}
      </Select>
    );
  };

  getStatusManager = (e, item) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }

    let bool = item === 'riskGrade';
    let props = bool
      ? {
        disabled: this.state.riskGradeControl,
      }
      : '';
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        placeholder="请选择"
        {...props}
        onChange={this.getStatusManagerChange}
        allowClear
      >
        {children}
      </Select>
    );
  };

  getStatusManagerChange = value => {
    const {
      form: { resetFields },
    } = this.props;
    this.setState({
      managerBase: value,
    });
    resetFields(['agentCardNum']);
  };

  getStatusBase = (e, item) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }

    let bool = item === 'riskGrade';
    let props = bool
      ? {
        disabled: this.state.riskGradeControl,
      }
      : '';
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        placeholder="请选择"
        {...props}
        onChange={this.getStatusBaseChange}
        allowClear
      >
        {children}
      </Select>
    );
  };

  // 机构下拉列表渲染
  getStatusNewBase = (e, item) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].id} value={e[key].id}>
            {e[key].orgName}
          </Option>,
        );
      }
    }

    let bool = item === 'riskGrade';
    let props = bool
      ? {
        disabled: this.state.riskGradeControl,
      }
      : '';
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        placeholder="请选择"
        {...props}
        onChange={this.getStatusBaseChange}
        allowClear
      >
        {children}
      </Select>
    );
  };

  getStatusBaseChange = value => {
    const {
      form: { resetFields },
    } = this.props;
    this.setState({
      typeBase: value,
    });
    resetFields(['cardNum']);
  };

  getStatusOther = (e, item) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }

    let bool = item === 'riskGrade';
    let props = bool
      ? {
        disabled: this.state.riskGradeControl,
      }
      : '';
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        placeholder="请选择"
        {...props}
        onChange={this.getStatusOtherChange}
        allowClear
      >
        {children}
      </Select>
    );
  };

  getStatusOtherChange = value => {
    const {
      form: { resetFields },
    } = this.props;
    this.setState({
      typeOther: value,
    });
    resetFields(['corporationCardNum']);
  };

  getfproGL = item => {
    const e = item;
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].text} value={e[key].text}>
            {e[key].value}
          </Option>,
        );
      }
    }
    return (
      <Select optionFilterProp={'children'} showSearch allowClear style={{ width: '100%' }}>
        {children}
      </Select>
    );
  };

  getforgtype = treeData => {
    const tProps = {
      treeData,
      onChange: this.onChange,
      multiple: false,
      showCheckedStrategy: SHOW_PARENT,
    };
    return <TreeSelect {...tProps} />;
  };

  //图片显示
  pictureShow = field => {
    const { retData, dictateOne } = this.props;
    let img = '';
    let imgStyle = '';
    for (let key in dictateOne) {
      if (key === field) {
        img = './img/amsTransferServer/ocr/' + retData + '/' + field + '.jpg';
        imgStyle = <img alt="" src={img} style={{ height: 30, width: '100%' }} />;
        return <div>{imgStyle}</div>;
      } else {
        imgStyle = '暂无识别数据';
      }
    }

    return <div>{imgStyle}</div>;
  };

  validateName = (rule, value, callback) => {
    if (value && value.length > 120) {
      callback('输入超出120位长度限制');
      return;
    }
    if (value === undefined || value.trim() === '') {
      callback('请输入');
      return;
    }
    callback();
  };

  validateCardNum = (rule, value, callback) => {
    const { typeBase, clientType } = this.state;
    if (clientType === '1' && typeBase === '0') {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) === false) {
        callback('请输入正确身份证号码');
        return;
      }
      callback();
    } else {
      if (value && value.length > 30) {
        callback('输入超出30位长度限制');
        return;
      }
      if (value === undefined || value.trim() === '') {
        callback('请输入');
        return;
      }
      callback();
    }
  };

  validateOtherCardNum = (rule, value, callback) => {
    const { typeOther } = this.state;
    if (typeOther === '0') {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) === false) {
        callback('请输入正确身份证号码');
        return;
      }
      callback();
    } else {
      if (value && value.length > 30) {
        callback('输入超出30位长度限制');
        return;
      }
      // if (value === undefined || value === '') {
      //   callback('请输入');
      //   return;
      // }
      callback();
    }
  };

  validateAgentName = (rule, value, callback) => {
    if (value && value.length > 20) {
      callback('输入超出20位长度限制');
      return;
    }
    if (value === undefined || value.trim() === '') {
      callback('请输入');
      return;
    }
    callback();
  };

  validateAgentCardNum = (rule, value, callback) => {
    const { managerBase } = this.state;
    if (managerBase === '0') {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) === false) {
        callback('请输入正确身份证号码');
        return;
      }
      callback();
    } else {
      if (value && value.length > 50) {
        callback('输入超出50位长度限制');
        return;
      }
      if (value === undefined || value.trim() === '') {
        callback('请输入');
        return;
      }
      callback();
    }
  };

  validateClearacct = (rule, value, callback) => {
    if (value && value.length > 28) {
      callback('输入超出28位长度限制');
      return;
    }
    if (value === undefined || value.trim() === '') {
      callback('请输入');
      return;
    }
    callback();
  };

  validateAccountNumber = (rule, value, callback) => {
    if (value && value.length > 17) {
      callback('输入超出17位长度限制');
      return;
    }
    if (value === undefined || value.trim() === '') {
      callback('请输入');
      return;
    }
    callback();
  };

  // 基本信息
  basicInformationForm = () => {
    const {
      newCustomerHandling: {
        saveDictBatchQuery: { I009, I001, J002 },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { clientType } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="客户编号">
              {getFieldDecorator('clientCode', {
                rules: [{ required: true, message: '请选择' }],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="客户类型">
              {getFieldDecorator('clientType', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group initialValue="0" onChange={this.onRadioChange}>
                  {I009 &&
                    I009.map(item => {
                      return (
                        <Radio value={item.code} key={item.code}>
                          {item.name}
                        </Radio>
                      );
                    })}
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="是否专业投资者">
              {getFieldDecorator('isMajorInvestor', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group onChange={this.onRadioChange}>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="信用编码">
              {getFieldDecorator('creditNumber', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                    max: 120,
                    whitespace: true,
                  },
                  {
                    validator: this.validateName,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="是否是金融客户">
              {getFieldDecorator('isFinanceClient', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group onChange={this.onRadioChange}>
                  <Radio value={'0'}>是</Radio>
                  <Radio value={'1'}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="基金账号">
              {getFieldDecorator('fundAccount')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="渠道代码">
              {getFieldDecorator('channelCode', {
                rules: [
                  {
                    max: 120,
                    message: '输入超出120位限制',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="网点代码">
              {getFieldDecorator('branchCode')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="非自然人客户类型">
              {getFieldDecorator('customerType', {
                rules: [
                  {
                    max: 50,
                    message: '输入超出50位限制',
                  },
                ],
              })(this.getDropDownSome(I001))}
            </Form.Item>
          </Col>
          {clientType !== '1' && (
            <Col xl={12} lg={24} md={24} sm={24}>
              <Form.Item {...formItemLayout} label="其他">
                {getFieldDecorator('other', {
                  rules: [
                    {
                      max: 50,
                      message: '输入超出50位限制',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          )}

          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="客户状态描述">
              {getFieldDecorator('clientStatusDescrip', {
                rules: [
                  {
                    max: 200,
                    message: '输入超出50位限制',
                  },
                ],
              })(<TextArea placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // 机构客户信息
  institutionalCustomersInformationForm = () => {
    const {
      newCustomerHandling: {
        saveDictBatchQuery: { TA_IDTPTP },
        saveDictBatchQuery: { J002 },
      },
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="客户名称">
              {getFieldDecorator('clientName', {
                rules: [{ required: true, message: '请输入客户名称' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="营业执照号码">
              {getFieldDecorator('businessLicenseNumber', {
                rules: [{ required: true, message: '请输入客户名称' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件有效期">
              {getFieldDecorator('certificValidPeriod')(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人代表">
              {getFieldDecorator('orgLegalPers', {
                rules: [{ required: true, message: '请输入法人代表' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人代表证件类型">
              {getFieldDecorator('orgLegalCertifcType', {
                rules: [{ required: true, message: '请选择法人代表证件类型' }],
              })(this.getStatusBase(J002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人代表证件代码">
              {getFieldDecorator('orgLegalCertificCode', {
                rules: [{ required: true, message: '请输入法人代表证件代码' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人代表证件有效期">
              {getFieldDecorator('orgLegalCertificValidPeriod')(
                <DatePicker style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="注册地址">
              {getFieldDecorator('registeredAddress')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="经营范围">
              {getFieldDecorator('businessScope', {
                rules: [
                  {
                    max: 200,
                    message: '输入超出50位限制',
                  },
                ],
              })(<TextArea placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // 自然人客户信息
  naturalPersonCustomersInformationForm = () => {
    const {
      form: { getFieldDecorator },
      newCustomerHandling: {
        saveDictBatchQuery: { J002, G001 },
      },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const sex = [
      { name: '男', code: '1' },
      { name: '女', code: '0' },
    ];
    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="姓名">
              {getFieldDecorator('clientName', { rules: [{ required: true }] })(
                <Input placeholder="请输入" />,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件类型">
              {getFieldDecorator('certificaType', {
                rules: [{ required: true, message: '请选择法人代表证件类型' }],
              })(this.getStatusBase(J002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件号码">
              {getFieldDecorator('certificNum', {
                rules: [{ required: true, message: '请输入正确的证件号码' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件有效期">
              {getFieldDecorator('personCertificValidPeriod')(
                <RangePicker style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="职业">
              {getFieldDecorator('profession', {
                rules: [{ required: true, message: '请选择职业' }],
              })(this.getStatusBase(G001))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="生日">
              {getFieldDecorator('birthDate')(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="性别">
              {getFieldDecorator('gender')(this.getStatusBase(sex))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="邮箱">
              {getFieldDecorator('mail', {
                rules: [
                  {
                    type: 'email',
                    message: '不是有效的电子邮箱',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="联系人">
              {getFieldDecorator('contactPerson')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="联系人电话">
              {getFieldDecorator('contactNumber')(<Input type="number" placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="地址">
              {getFieldDecorator('address')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="邮编">
              {getFieldDecorator('postcode', {
                rules: [
                  {
                    len: 6,
                    message: '请输入正确邮政编码',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // 产品客户信息
  productInformationForm = () => {
    const {
      newCustomerHandling: {
        saveDictBatchQuery: { J002 },
      },
      form: { getFieldDecorator },
      myInvestorInfo: {
        orgData: { TG, GL },
        proTypeData,
      },
      newCustomerHandling: {
        saveDictBatchQuery: { productRecordingAgency },
      },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="产品全称">
              {getFieldDecorator('productName', {
                rules: [{ required: true, message: '请输入产品全称' }],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="产品代码">
              {getFieldDecorator('productCode', {
                rules: [{ required: true, message: '请输入产品代码' }],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="产品备案代码">
              {getFieldDecorator('productRecordCode', {
                rules: [{ required: true, message: '请输入产品代码' }],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="所属机构">
              {getFieldDecorator('affiliation')(this.getStatusNewBase(this.state.orgDictsData))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人代表">
              {getFieldDecorator('legalPerson')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人证件类型">
              {getFieldDecorator('legalpCardTypeCode')(this.getStatusBase(J002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人证件号码">
              {getFieldDecorator('legalpCardId')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="法人证件有效期">
              {getFieldDecorator('legalCertificValidPeriod')(
                <RangePicker style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // 受益所有人信息
  handleAddBeneficiary = () => {
    const {
      newCustomerHandling: {
        saveDictBatchQuery: { I003, J002, G001, G002 },
      },
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const sex = [
      { name: '男', code: '1' },
      { name: '女', code: '0' },
    ];

    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="产品全称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入产品全称' }],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件类型">
              {getFieldDecorator('certificaType', {
                rules: [{ required: true, message: '请选择证件类型' }],
              })(this.getStatusBase(J002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件号码">
              {getFieldDecorator('certificNum', {
                rules: [{ required: true, message: '请输入证件号码' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="证件有效期">
              {getFieldDecorator('SellCertificValidPeriod')(
                <RangePicker style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="受益所有人身份类别">
              {getFieldDecorator('beneficStatusType')(this.getStatusBase(I003))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="性别">
              {getFieldDecorator('gender')(this.getStatusBase(sex))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="国籍">
              {getFieldDecorator('nationality')(this.getStatusBase(G002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="职业">
              {getFieldDecorator('profession')(this.getStatusBase(G001))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="邮箱">
              {getFieldDecorator('mail', {
                rules: [
                  {
                    type: 'email',
                    message: '不是有效的电子邮箱',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="联系人">
              {getFieldDecorator('contactPerson')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="联系人电话">
              {getFieldDecorator('contactNumber')(<Input type="number" placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="地址">
              {getFieldDecorator('address')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="邮编">
              {getFieldDecorator('postcode', {
                rules: [
                  {
                    len: 6,
                    message: '请输入正确邮政编码',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="出生日期">
              {getFieldDecorator('birthDate')(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // 经办人信息
  handleAddAgent = () => {
    const {
      newCustomerHandling: {
        saveDictBatchQuery: { J002 },
      },
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Form>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="经办人姓名">
              {getFieldDecorator('operatorName', {
                rules: [{ required: true, message: '请输入正确的证件号码' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="经办人证件类型">
              {getFieldDecorator('operatorCertType', {
                rules: [{ required: true, message: '请输入正确的证件号码' }],
              })(this.getStatusBase(J002))}
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24}>
            <Form.Item {...formItemLayout} label="经办人证件号码">
              {getFieldDecorator('operatorCertNo', {
                rules: [{ required: true, message: '请输入正确的证件号码' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  jumpToUploadTab = () => {
    this.setState({
      activeKey: '2',
    });
  };

  jumpToAccountTab = () => {
    this.setState({
      activeKey: '3',
    });
  };

  qualifiedInvestoronChange = value => {
    let bool = value === '2';
    this.setState({
      riskGradeControl: bool,
    });
  };

  save11 = ref => {
    this.setState({
      child11: ref,
    });
  };

  // 提交表单
  saveFormData = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll, getFieldsValue },
    } = this.props;
    const { accessories, institutionRow, index } = this.state;
    validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('必填信息填写不完整，请检查');
        return;
      }
      console.log(values);
      const obj1 = {
        clientCode: values.clientCode,
        clientType: values.clientType,
        isMajorInvestor: values.isMajorInvestor,
        creditNumber: values.creditNumber,
        clientName: values.clientName,
        certificaType: values.certificaType,
      };
    });
  };

  // 提交表单
  saveForm = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll, getFieldsValue },
    } = this.props;
    const { accessories, institutionRow, index } = this.state;
    validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('必填信息填写不完整，请检查');
        return;
      }
      let Index = this.state.index;
      let arr = [];
      values.distributorcode = institutionRow[0]
        ? institutionRow[0] && institutionRow[0].code
        : undefined;
      let otherFir = getFieldsValue(['accountNumber', 'clearacct', 'acctname', 'banknetpointname']);
      otherFir = {
        ...otherFir,
        bankno: otherFir.banknetpointname && otherFir.banknetpointname.key,
        banknetpointname: otherFir.banknetpointname && otherFir.banknetpointname.label,
      };
      for (let i = 1; i <= index.length; i++) {
        let others = getFieldsValue([
          `accountNumber${i}`,
          `clearacct${i}`,
          `acctname${i}`,
          `bankno${i}`,
          `banknetpointname${i}`,
        ]);
        others = {
          ...others,
          [`bankno${i}`]: others[`banknetpointname${i}`].key,
          [`banknetpointname${i}`]: others[`banknetpointname${i}`].label,
        };
        var keyMap = {
          [`accountNumber${i}`]: 'accountNumber',
          [`clearacct${i}`]: 'clearacct',
          [`acctname${i}`]: 'acctname',
          [`banknetpointname${i}`]: 'banknetpointname',
          [`bankno${i}`]: 'bankno',
        };
        for (var key in others) {
          if (others.hasOwnProperty(key)) {
            var newKey = keyMap[key];
            if (newKey) {
              others[newKey] = others[key];
              delete others[key];
            }
          }
        }
        arr.push(others);
      }
      if (otherFir['accountNumber'] !== undefined) {
        arr.push(otherFir);
      }

      if (accessories.length === 0) {
        message.warning('请至少上传一份附件');
        return;
      }
      if (values.endDate) values.endDate = values.endDate.format('YYYYMMDD');
      if (values.agentEndDate) values.agentEndDate = values.agentEndDate.format('YYYYMMDD');
      if (values.corporationEndDate)
        values.corporationEndDate = values.corporationEndDate.format('YYYYMMDD');
      if (values.recordsTime) values.recordsTime = values.recordsTime.format('YYYYMMDD');
      if (values.foundingTime) values.foundingTime = values.foundingTime.format('YYYYMMDD');
      if (values.orgEndDate) values.orgEndDate = values.orgEndDate.format('YYYYMMDD');

      for (var i in values) {
        if (values.hasOwnProperty(i)) {
          if (typeof values[i] === 'number' || typeof values[i] === 'string') {
            values[i] = values[i].trim();
          }
        }
      }

      if (!err) {
        dispatch({
          type: `newCustomerHandling/saveInfo`,
          payload: {
            ...values,
            distributorcode: values.distributorcode,
            accessories,
            investorAccounts: arr,
          },
        });
      }
    });
  };

  disabledDate = current => {
    return current && current < moment().endOf('day');
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSelectChange = (value, Option) => {
    this.setState({
      fileType: value,
      fileTypeName: Option.props.children,
    });
  };

  // 上传图片方法
  image = num => {
    const {
      distributionList: { },
    } = this.props;

    const reurl = '/ams/ams-file-service/fileServer/uploadFile';
    const headers = { Token: getAuthToken() };
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 16 }}>
          <Col md={24} sm={24}>
            <Upload
              headers={headers}
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              fileList={this.state['imageUrl' + num]}
              action={reurl}
              beforeUpload={beforeUpload}
              onChange={e => this.handleImgChange(e, num)}
              onSuccess={this.success}
              onError={this.error}
              onRemove={e => this.remove(e, num)}
              style={{ width: 102, height: 102 }}
              onPreview={this.handlePreview}
            >
              <div>
                <Icon type={'plus'} />
                <div>上传</div>
              </div>
            </Upload>
          </Col>
        </Row>
      </div>
    );
  };

  // 点击文件链接或预览图标时的回调
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  add = () => {
    const { index } = this.state;
    if (index.length !== 0) {
      index.push(index[index.length - 1] + 1);
    } else {
      index.push(1);
    }
    this.setState({
      index,
    });
  };

  minus = i => {
    const { index } = this.state;
    let indexs = index.filter(item => {
      return item !== i;
    });
    this.setState({
      index: indexs,
    });
  };

  addItem = () => {
    const {
      form: { getFieldDecorator },
      newCustomerHandling: { accountOpenBank },
    } = this.props;

    const { index, flag } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    let arr;
    let sty = classNames('ant-divider-horizontal', 'ant-divider-dashed');
    arr = index.map((item, index) => {
      let lab = `交易账号${item}`;
      return (
        <div>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }} key={index}>
            <Col xl={24} lg={24} md={24} sm={24}>
              <div className={sty} />
            </Col>
            <Col xl={10} lg={24} md={24} sm={24}>
              <Form.Item {...formItemLayout} label={lab}>
                {getFieldDecorator(`accountNumber${item}`, {
                  rules: [
                    {
                      required: flag,
                      message: ' ',
                      max: 17,
                    },
                    {
                      validator: this.validateAccountNumber,
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col xl={10} lg={24} md={24} sm={24}>
              <Form.Item {...formItemLayout} label="银行卡号">
                {getFieldDecorator(`clearacct${item}`, {
                  rules: [
                    {
                      required: flag,
                      message: ' ',
                      max: 28,
                    },
                    {
                      validator: this.validateClearacct,
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col xl={4} lg={24} md={24} sm={24}>
              <Form.Item>
                <Button type="dashed" onClick={() => this.minus(item)}>
                  <Icon type="minus" />
                </Button>
              </Form.Item>
            </Col>
            <Col xl={10} lg={24} md={24} sm={24}>
              <Form.Item {...formItemLayout} label="开户行">
                {getFieldDecorator(`banknetpointname${item}`, {
                  rules: [
                    {
                      required: flag,
                      message: '请选择',
                    },
                  ],
                })(this.getDropDownBank(accountOpenBank, '请选择'))}
              </Form.Item>
            </Col>
            <Col xl={10} lg={24} md={24} sm={24}>
              <Form.Item {...formItemLayout} label="开户名">
                {getFieldDecorator(`acctname${item}`, {
                  rules: [
                    {
                      required: flag,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    });
    return arr;
  };

  onTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  compon = fileType => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return getFieldDecorator(fileType)(
      <Upload
        {...uploadProps}
        fileList={this.state[fileType]}
        onChange={this.handleFileChange}
        beforeUpload={this.beforeUpload}
        onRemove={e => this.remove(e, fileType)}
      />,
    );
  };

  routerLink = path => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(path));
  };

  onRadioChange = e => {
    this.setState({
      clientType: e.target.value,
    });
    console.log(clientType);
  };

  //个例下拉框
  getDropDownSome = e => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }
    return (
      <Select
        style={{ width: '100%' }}
        optionFilterProp={'children'}
        showSearch
        placeholder="请选择"
        allowClear
      >
        {children}
      </Select>
    );
  };

  getDropDownBank = (e, text) => {
    let children = [];
    for (var key in e) {
      if (e.hasOwnProperty(key)) {
        children.push(
          <Option key={e[key].code} value={e[key].code}>
            {e[key].name}
          </Option>,
        );
      }
    }
    return (
      <Select
        style={{ width: '100%' }}
        optionFilterProp={'children'}
        placeholder={text}
        onChange={this.changeBankInfo}
        allowClear
        showSearch
        labelInValue
      >
        {children}
      </Select>
    );
  };

  showInstitutionTable = () => {
    this.setState({
      institutionDelVisible: true,
    });
  };

  setInstitution = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    this.setState({
      institutionDelVisible: false,
    });
    if (getFieldValue('distributorName')) {
      this.setState({
        fundacctRequired: true,
      });
    } else {
      this.setState({
        fundacctRequired: false,
      });
    }
  };

  institutionTable = data => {
    const {
      myInvestorInfo: { institutionLoading, I_currentPage },
      form: { setFieldsValue },
    } = this.props;
    const { institutionDelVisible } = this.state;
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        const {
          form: { getFieldValue },
        } = this.props;
        setFieldsValue({
          distributorName: selectedRows.length === 1 ? selectedRows[0].name : '',
        });
        this.setState({
          institutionDelVisible: false,
          institutionRow: selectedRows,
        });
        if (getFieldValue('distributorName')) {
          this.setState({
            fundacctRequired: true,
          });
        } else {
          this.setState({
            fundacctRequired: false,
          });
        }
      },
    };
    const columns = [
      {
        title: '机构名称',
        dataIndex: 'name',
        width: 400,
      },
      {
        title: '机构代码',
        dataIndex: 'code',
      },
    ];
    const paginationProps = {
      current: I_currentPage,
      // showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <div>
        <Spin spinning={institutionLoading}>
          <Search
            placeholder="请输入"
            onSearch={val => this.institutionQuery(val)}
            style={{ width: 242, height: 32, marginBottom: 20 }}
          />
          {institutionDelVisible ? (
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              onChange={this.institutionPaging}
              pagination={paginationProps}
              bordered={true}
              size="small"
            />
          ) : null}
        </Spin>
      </div>
    );
  };

  institutionPaging = pagination => {
    const { dispatch } = this.props,
      { searchInfo } = this.state;
    dispatch({
      type: `myInvestorInfo/getFdistributorcode`,
      payload: {
        code: 'saleorginfo',
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        param: searchInfo,
      },
    });
  };

  institutionQuery = val => {
    const { dispatch } = this.props;
    this.setState({
      searchInfo: val,
    });
    dispatch({
      type: `myInvestorInfo/getFdistributorcode`,
      payload: {
        code: 'saleorginfo',
        currentPage: 1,
        pageSize: 10,
        param: val,
      },
    });
  };

  handleFundacctChange = val => {
    const {
      form: { setFields },
    } = this.props;
    if (val.target.value) {
      this.setState({
        distributorcodeRequired: true,
      });
    } else {
      this.setState({
        distributorcodeRequired: false,
      });
    }
  };

  distributorNameChange = e => {
    this.setState({
      institutionDelVisible: false,
    });
    if (e.target.value && e.target.value.length !== 0) {
      this.setState({
        fundacctRequired: true,
      });
    } else {
      this.setState({
        fundacctRequired: false,
      });
    }
  };

  validateFundacct = (rule, value, callback) => {
    const { fundacctRequired } = this.state;
    if (fundacctRequired && value.length === 0) {
      callback('请填写');
    }
    if (value && value.length > 17) {
      callback('输入超出17位限制');
    }
    callback();
  };

  onChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const { distributorcodeRequired, fundacctRequired } = this.state;
    const {
      instructionOperate: { visible, retData, correctData, loading },
      newCustomerHandling: { accountOpenBank },
      myInvestorInfo: { fdistributorcode },
      dispatch,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const {
      clientType,
      previewVisible,
      previewImage,
      activeKey,
      loadings,
      flag,
      radioValue,
      institutionDelVisible,
      institutionRow,
    } = this.state;
    console.log(clientType);
    let sty = classNames('ant-divider-horizontal', 'ant-divider-dashed');
    return (
      <>
        <Card className={styless.addTitleDiv}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '20px' }}>新增客户</div>
          </div>
        </Card>
        <div className={styless.content}>
          <div style={{ position: 'relative', zIndex: 999 }}>
            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              activeKey={activeKey}
              onChange={this.onTabsChange}
            >
              <TabPane tab="信息录入" key="1">
                <div className={styless.body}>
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <div id="basic1">基本信息</div>
                      {this.basicInformationForm()}
                      <Divider />
                    </div>

                    {clientType === '0' && (
                      <div style={{ marginBottom: 24 }}>
                        <div>机构客户信息</div>
                        {this.institutionalCustomersInformationForm()}
                        <Divider />
                      </div>
                    )}

                    {clientType === '1' && (
                      <div style={{ marginBottom: 24 }}>
                        <div>自然人客户信息</div>
                        {this.naturalPersonCustomersInformationForm()}
                        <Divider />
                      </div>
                    )}

                    {clientType === '2' && (
                      <div style={{ marginBottom: 24 }}>
                        <div>产品客户信息</div>
                        {this.productInformationForm()}
                        <Divider />
                      </div>
                    )}

                    {clientType !== '1' && (
                      <div style={{ marginBottom: 24 }}>
                        <div>受益所有人信息</div>
                        {this.handleAddBeneficiary()}
                        <Divider />
                      </div>
                    )}

                    {
                      <div style={{ marginBottom: 24 }}>
                        <div>客户经办人信息</div>
                        {this.handleAddAgent()}
                        <Divider />
                      </div>
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane tab="附件上传" key="2">
                <Upload {...uploadProps} onChange={this.onChange}>
                  <Button type="primary">
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>

                {/* <Form>
                  <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                    <Col md={24} sm={24} style={{ paddingLeft: 32 }}>
                      <Col
                        md={3}
                        sm={24}
                        style={{ textAlign: 'right', paddingLeft: 0, paddingRight: 0 }}
                      />
                      <Col md={24} sm={24} style={{ paddingLeft: 24, paddingRight: 24 }}>
                        <div className={styless.uploadFile}>
                          <FormItem label="选择上传类型">
                            {getFieldDecorator('uploadType', {
                              initialValue: 'InvestorInfo',
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            })(
                              <Select style={{ width: '40%' }} onChange={this.handleSelectChange}>
                                <Option value="InvestorInfo">投资人信息附件</Option>
                                <Option value="ManagerInfo">经办人信息附件</Option>
                                <Option value="OrganizationInfo">机构信息附件</Option>
                                <Option value="ProductInfo">产品信息附件</Option>
                                <Option value="CorporateInfo">法定代表或负责人信息附件</Option>
                                <Option value="QualificationInfo">资质信息附件</Option>
                              </Select>,
                            )}
                          </FormItem>

                          <Form.Item {...formItemLayout} label="">
                            {getFieldDecorator('ManagerInfo')(
                              <Upload
                                {...uploadProps}
                                showUploadList={false}
                                fileList={this.state.fileList}
                                onChange={this.handleFileChange}
                                beforeUpload={this.beforeUpload}
                                onRemove={e => this.remove(e)}
                              >
                                <Button type={'primary'} loading={loadings}>
                                  <Icon type="upload" />
                                  点击上传
                                </Button>
                                <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...且不超过50M</p>
                              </Upload>,
                            )}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="投资人信息">
                            {this.compon('InvestorInfo')}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="经办人信息">
                            {this.compon('ManagerInfo')}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="产品信息">
                            {this.compon('ProductInfo')}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="机构信息">
                            {this.compon('OrganizationInfo')}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="法定代表或负责人信息">
                            {this.compon('CorporateInfo')}
                          </Form.Item>

                          <Form.Item {...formItemLayout} label="资质信息">
                            {this.compon('QualificationInfo')}
                          </Form.Item>
                        </div>
                      </Col>
                    </Col>
                  </Row>
                </Form>
                <Col md={24} sm={24} style={{ paddingRight: 116 }}>
                  <div className={styless.writeMore} onClick={this.jumpToAccountTab}>
                    <p>账户管理</p>
                  </div>
                </Col> */}
              </TabPane>
              <TabPane tab="账户管理" key="3" style={{ marginBottom: 50 }}>
                <Form>
                  <div id="basic3">基金账户</div>
                  <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                    <Col xl={10} lg={24} md={24} sm={24}>
                      <Form.Item {...formItemLayout} label="销售机构">
                        {getFieldDecorator('distributorName', {
                          rules: [
                            {
                              required: distributorcodeRequired,
                              message: '请选择',
                            },
                          ],
                        })(
                          <Input
                            onClick={this.showInstitutionTable}
                            onChange={this.distributorNameChange}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={24} md={24} sm={24}>
                      <Form.Item {...formItemLayout} label="基金账号">
                        {getFieldDecorator('fundacct', {
                          rules: [
                            {
                              required: fundacctRequired,
                              message: ' ',
                              max: 17,
                            },
                            {
                              validator: this.validateFundacct,
                            },
                          ],
                        })(<Input placeholder="请输入" onChange={this.handleFundacctChange} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Divider />
                <Form>
                  <Action key="accountAdd" code="myInvestor:accountAdd">
                    <div id="basic4">交易账号</div>
                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                      <Col xl={12} lg={24} md={24} sm={24}>
                        <Form.Item {...formItemLayout} label="添加交易账号">
                          {getFieldDecorator('accountNumber11', {
                            initialValue: false,
                          })(
                            <Radio.Group onChange={this.onRadioChange}>
                              <Radio value={true}>是</Radio>
                              <Radio value={false}>否</Radio>
                            </Radio.Group>,
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    {radioValue ? (
                      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                        <Col xl={10} lg={24} md={24} sm={24}>
                          <Form.Item {...formItemLayout} label="交易账号">
                            {getFieldDecorator('accountNumber', {
                              rules: [
                                {
                                  required: flag,
                                  message: ' ',
                                  max: 17,
                                },
                                {
                                  validator: this.validateAccountNumber,
                                },
                              ],
                            })(<Input placeholder="请输入" />)}
                          </Form.Item>
                        </Col>
                        <Col xl={10} lg={24} md={24} sm={24}>
                          <Form.Item {...formItemLayout} label="银行卡号">
                            {getFieldDecorator('clearacct', {
                              rules: [
                                {
                                  required: flag,
                                  message: ' ',
                                  max: 28,
                                },
                                {
                                  validator: this.validateClearacct,
                                },
                              ],
                            })(<Input placeholder="请输入" />)}
                          </Form.Item>
                        </Col>
                        <Col xl={4} lg={24} md={24} sm={24} />
                        <Col xl={10} lg={24} md={24} sm={24}>
                          <Form.Item {...formItemLayout} label="开户行">
                            {getFieldDecorator('banknetpointname', {
                              rules: [
                                {
                                  required: flag,
                                  message: '请输入',
                                },
                              ],
                            })(
                              //accountOpenBankInfo
                              this.getDropDownBank(accountOpenBank, '请选择'),
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={10} lg={24} md={24} sm={24}>
                          <Form.Item {...formItemLayout} label="开户名">
                            {getFieldDecorator('acctname', {
                              rules: [
                                {
                                  required: flag,
                                  message: '请输入',
                                },
                              ],
                            })(<Input placeholder="请输入" />)}
                          </Form.Item>
                        </Col>
                        <Col xl={4} lg={24} md={24} sm={24} />
                      </Row>
                    ) : (
                      ''
                    )}
                    {this.addItem()}
                    {radioValue ? (
                      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                        <Col xl={24} lg={24} md={24} sm={24}>
                          <div className={sty} />
                        </Col>
                        <Col xl={18} lg={24} md={24} sm={24}>
                          <Form.Item {...formItemLayout} label=" " colon={false}>
                            <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                              <Icon type="plus" /> 新增交易账户
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : (
                      ''
                    )}
                  </Action>
                </Form>
              </TabPane>
            </Tabs>
            <Modal
              title="选择上传类型"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Select
                defaultValue="InvestorInfo"
                style={{ width: '100%' }}
                onChange={this.handleSelectChange}
                allowClear
              >
                <Option value="InvestorInfo">投资人信息附件</Option>
                <Option value="ManagerInfo">经办人信息附件</Option>
                <Option value="OrganizationInfo">机构信息附件</Option>
                <Option value="ProductInfo">产品信息附件</Option>
                <Option value="CorporateInfo">法定代表或负责人信息附件</Option>
                <Option value="QualificationInfo">资质信息附件</Option>
              </Select>
            </Modal>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <Card
              style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                marginTop: '20px',
                marginLeft: -24,
                zIndex: 10,
              }}
            >
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginRight: 210 }}>
                <Col
                  md={24}
                  sm={24}
                  style={{ textAlign: 'right', paddingLeft: -24, marginLeft: -24 }}
                >
                  <Popconfirm
                    title="确定要取消吗?"
                    onConfirm={() => this.routerLink('/productDataManage/myInvestor')}
                  >
                    <Button style={{ marginRight: 10 }}>取消</Button>
                  </Popconfirm>
                  <Button
                    type="primary"
                    onClick={_.debounce(this.saveFormData, 2000)}
                    loading={loading}
                  >
                    保存
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
        <Modal
          key="institution"
          title="销售机构"
          wrapClassName="vertical-center-modal"
          zIndex={1001}
          visible={institutionDelVisible}
          onOk={() => this.setInstitution()}
          onCancel={() => this.setInstitution()}
          footer={null}
          width={850}
        >
          {this.institutionTable(fdistributorcode)}
        </Modal>
      </>
    );
  }
}

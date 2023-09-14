// 基本信息
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { routerRedux } from 'dva/router';
import { getUrlParams, handleValidator } from '@/utils/utils';
import FileList from './fileList';
import styles from '../index.less';
import moment from 'moment';
import {
  // Card,
  Button,
  Dropdown,
  Form,
  Menu,
  Modal,
  Tooltip,
  Table,
  Input,
  Icon,
  Tabs,
  Row,
  Col,
  Select,
  Radio,
  Upload,
  TreeSelect,
  InputNumber,
  DatePicker,
} from 'antd';
import styleSetPanel from '@/pages/operatingCalendar/setPanel/styleSetPanel';
import { Card } from '@/components';
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
class publicInfor extends Component {
  state = {
    // 文件列表
    businessArchive: '',
    fileList: [],
    detailsList: [],
    disabled: false,
    trustee: false,
    administrator: false,
    adviser: false,
    diffcountries: false,
    myOrglst: {},
    // 是否是境外机构
    overInst: [
      { code: 1, name: '是' },
      { code: 0, name: '否' },
    ],
  };
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    this.getCodes();
    this.getSuperiorOrg();
    if (this.props.falg !== false) {
      this.getDetails();
    }
  }
  /**
   * 获取词汇字典内容
   * @method getCodes
   */
  getCodes() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getCodeLists',
      payload: ['J001', 'J004', 'J002', 'J005', 'J007', 'C001', 'J006', 'O002', 'R006', 'G002'],
    });
  }
  /**
   * 保存机构（保存按钮）
   * @method preservation
   */
  preservation = current => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      this.props.loading && this.props.loading()
      const { dispatch, orgId } = this.props;
      const { myOrglst, serialNumber, fileList } = this.state;
      // const values = this.props.form.getFieldsValue();
      if (values.orgType) {
        values.orgType = values.orgType.toString();
      }
      if (values.registCapital) {
        values.registCapital = values.registCapital.toString();
      }
      if (values.whichSetupdate) {
        values.whichSetupdate = moment(values.whichSetupdate).format('YYYY-MM-DD');
      }
      if (values.legalCertPeriod) {
        values.legalCertPeriod = moment(values.legalCertPeriod).format('YYYY-MM-DD');
      }
      if (values.registered || values.registered == 0) {
        values.registered = values.registered.toString();
      }
      if (values.jurisdictionSupervision) {
        values.jurisdictionSupervision = values.jurisdictionSupervision.toString();
      }
      // if (values.parentId) {
      //   values.parentId = values.parentId[values.parentId.length - 1];
      // }
      // 如果是否境外机构为否 去掉国别字段
      if (values.foreignInstitution == 0) {
        delete values.foreignInstitutionCountry;
      }
      // 上传头像
      if (serialNumber) {
        values.orgLoge = serialNumber;
      }
      values.businessArchives = this.state.businessArchive ? this.state.businessArchive : fileList;
      values.orgOtherCode = values.orgCode;
      localStorage.setItem('orgName', values.orgName);
      // 判断所属组织机构是不是本家的
      if (myOrglst.id) {
        values.parentId = myOrglst.id;
      }
      const id = getUrlParams('id');
      if (id) {
        values.id = Number(id);
        dispatch({
          type: 'orgInfoManagement/preservation',
          payload: values,
        }).then(data => {
          if (data) {
            if (data.flag) {
              this.props.form.resetFields();
              dispatch(
                routerRedux.push({
                  pathname: '/productDataManage/orgInfoManagement/index',
                }),
              );
            }
          }
        });
        return;
      }
      dispatch({
        type: 'orgInfoManagement/preservation',
        payload: values,
      }).then(data => {
        if (data.flag) {
          this.props.changeStep && this.props.changeStep(current, data.data);
          // console.log(this.props.changeStep, '返回');
          // if (!this.props.changeStep) {
          //   console.log('返回');
          //   dispatch(
          //     routerRedux.push({
          //       pathname: '/productDataManage/orgInfoManagement/index',
          //     }),
          //   );
          // }
        }
      });
    });
  };
  /**
   * 详情
   * @method getDetails
   */
  getDetails = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getDetails',
      payload: location.search.slice(4),
    }).then(data => {
      if (data) {
        const {
          orgInfoManagement: { detailsList },
        } = this.props;
        this.isShow(detailsList.orgType);
        // this.orgShow(detailsList.orgKind);
        if (detailsList.foreignInstitution == 1) {
          this.setState({
            diffcountries: true,
          });
        }
        this.setState({
          fileList: detailsList.businessArchives,
          detailsList,
          imageUrl: detailsList.logBase64 ? detailsList.logBase64 : '',
          serialNumber: detailsList.orgLoge ? detailsList.orgLoge : '',
          imgTitle: detailsList.orgLoge ? '更换头像' : '上传头像',
        });
      }
    });
  };
  // 所属机构和机构内码
  getAscriptionAPI = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getAscriptionAPI',
    }).then(data => {
      if (data) {
        const {
          orgInfoManagement: { myOrglst },
        } = this.props;
        this.setState({
          myOrglst,
          // myOrglstShow:true,
        });
      }
    });
  };
  /**
   * 上级机构
   * @method getCodes
   */
  getSuperiorOrg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/superiorOrgList',
      payload: 1,
    }).then(data => {
      if (data) {
        const {
          orgInfoManagement: { SuperiorOrgs },
        } = this.props;
        this.setState({
          SuperiorOrgs,
        });
      }
    });
  };
  // 头像上传的方法
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // this.getqueryimg(info.file.response.data)
      this.setState({
        serialNumber: info.file.response.data,
      }),
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
        );
    }
  };
  // 资质类型关联是否显示
  isShow = value => {
    // value是接口中返回的资质类型的值，是多选返回的数组
    // myfilter是检验数组中有没有这一项,判断关联显示
    if (value && value.indexOf('JGJS02') !== -1) {
      this.setState({
        trustee: true,
      });
    } else {
      this.setState({
        trustee: false,
      });
    }
    if (value && value.indexOf('JGJS01') !== -1) {
      this.setState({
        administrator: true,
      });
    } else {
      this.setState({
        administrator: false,
      });
    }
    if (value && value.indexOf('JGJS10') !== -1) {
      this.setState({
        adviser: true,
      });
    } else {
      this.setState({
        adviser: false,
      });
    }
  };
  //资质类型字段change事件
  orgTypeValue = value => {
    // 清除历史记录
    this.props.form.resetFields([
      'custodianBranchOrg',
      'headOffice',
      'managerType',
      'jurisdictionSupervision',
      'financialOrgcode',
      'obligatoryDiscloser',
      'informationDisclosure',
      'informationDisclosureTel',
      'informationDisclosureEmail',
      'investmentOrgType',
      'privateEquityManagerCode',
    ]);
    if (value.indexOf('JGJS02') !== -1) {
      this.setState({
        trustee: true,
      });
    } else {
      this.setState({
        trustee: false,
      });
    }
    if (value.indexOf('JGJS01') !== -1) {
      this.setState({
        administrator: true,
      });
    } else {
      this.setState({
        administrator: false,
      });
    }
    if (value.indexOf('JGJS10') !== -1) {
      this.setState({
        adviser: true,
      });
    } else {
      this.setState({
        adviser: false,
      });
    }
  };
  // 是否境外机构选择联动国别
  overOnchange = val => {
    this.props.form.resetFields('foreignInstitutionCountry');
    if (val == 1) {
      this.setState({
        diffcountries: true,
      });
    } else {
      this.setState({
        diffcountries: false,
      });
    }
  };
  saveData = data => {
    this.setState({
      businessArchive: data,
    });
  };
  title = val => {
    return (
      <Col className={styles.categoryTitle} span={24}>
        <div style={{ height: 20 }}>
          <div className={styles.box}></div>
          <span className={styles.title}>{val}</span>
        </div>
      </Col>
    );
  };

  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构名称长度过长');
  };

  handleOrgShortValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构简称长度过长');
  };

  handleOrganizationFormValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '组织形式长度过长');
  };

  handleLegalPersonValidator = (rule, value, callback) => {
    handleValidator(value, callback, 32, '法人代表长度过长');
  };

  handleInstitutionCodeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 18, '机构代码过长');
  };

  handleRecordNoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '备案编号过长');
  };

  handleOrgOtherCodeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 18, '机构内码过长');
  };

  handleEnglishNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '英文名称过长');
  };

  handleEnglishShortValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '英文简称过长');
  };

  handleOaEmployeeIdValidator = (rule, value, callback) => {
    handleValidator(value, callback, 50, 'OA部门id长度过长');
  };

  handleLegalCertNoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '法人代表证件代码长度过长');
  };

  handleOrgRegaddrValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '注册地址长度过长');
  };

  handleOrgOffaddrValidator = (rule, value, callback) => {
    handleValidator(value, callback, 500, '办公地址长度过长');
  };

  handleOrgPhoneValidator = (rule, value, callback) => {
    let tempText;
    if (value) {
      tempText = value.replace(/\-|\——/g, '');
    } else {
      tempText = value;
    }
    const reg = /^\d+(\-|\——)\d+(\-|\——)\d+$/;
    if (/^\d+$/.test(tempText)) {
      // 是数字
      if (/\-|\——/.test(value)) {
        // 包含中划线是电话
        if (reg.test(value)) {
          handleValidator(tempText, callback, 11, '长度过长');
        } else {
          callback('请重新输入');
        }
      } else {
        // 是手机号码
        handleValidator(tempText, callback, 11, '长度过长');
      }
    } else if (value) {
      callback('请输入数字');
    } else {
      callback();
    }
  };

  handleOrgFaxValidator = (rule, value, callback) => {
    handleValidator(value, callback, 20, '传真长度过长');
  };

  handleBusinessScopeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '经营范围长度过长');
  };

  handleDurationValidator = (rule, value, callback) => {
    handleValidator(value, callback, 50, '续存期长度过长');
  };

  handleSubmitOrgCodeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '报送机构编号长度过长');
  };

  handleApprovalNoValidator = (rule, value, callback) => {
    handleValidator(value, callback, 50, '批准文号长度过长');
  };

  handleCustodianBranchOrgValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '托管人分支机构长度过长');
  };

  handleHeadOfficeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '总行名称长度过长');
  };

  handleJurisdictionSupervisionValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '所属监管辖区长度过长');
  };

  handleFinancialOrgcodeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '金融机构编码长度过长');
  };

  handleObligatoryDiscloserValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '义务披露人代码长度过长');
  };

  handleInformationDisclosureValidator = (rule, value, callback) => {
    handleValidator(value, callback, 1200, '信息披露负责人长度过长');
  };

  handleInformationDisclosureTelValidator = (rule, value, callback) => {
    handleValidator(value, callback, 11, '信披负责人联系电话长度过长');
  };

  handlePrivateEquityManagerCodeValidator = (rule, value, callback) => {
    handleValidator(value, callback, 50, '私募管理人编码长度过长');
  };

  render() {
    const {
      detailsList,
      disabled,
      overInst,
      SuperiorOrgs,
      trustee,
      administrator,
      adviser,
      diffcountries,
      imageUrl,
      myOrglst,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      orgInfoManagement: { codeList },
    } = this.props;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const textAreaLayout = {
      labelAlign: 'right',
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <div>
        <Row>
          <Col span={16}>
            <Form {...layout}>
              <Row>
                <Col span={12}>
                  <Form.Item label="机构名称">
                    {getFieldDecorator('orgName', {
                      initialValue: detailsList.orgName,
                      rules: [
                        {
                          required: true,
                          message: '机构名称不可为空',
                        },
                        { validator: this.handleorgNameValidator },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        // disabled={disabled}
                        placeholder="请输入机构名称"
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="机构分类">
                    {getFieldDecorator('orgKind', {
                      // initialValue: detailsList.orgKind,
                      initialValue: '0',
                      rules: [
                        {
                          required: true,
                          message: '机构分类不可为空',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        placeholder="请选择管机构分类"
                        // onChange={this.changeValue}
                        showArrow={false}
                        showSearch
                        disabled={true}
                      >
                        {codeList?.O002?.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="机构类型">
                    {getFieldDecorator('qualifyType', {
                      initialValue: detailsList.qualifyType,
                      rules: [
                        {
                          required: true,
                          message: '机构类型名称不可为空',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        showSearch
                        placeholder="请选择机构类型"
                        // showArrow={flag}
                        optionFilterProp="children"
                      >
                        {codeList &&
                          codeList.J001 &&
                          codeList.J001.map(item => (
                            <Select.Option key={item.code}>{item.name}</Select.Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="是否境外机构">
                    {getFieldDecorator('foreignInstitution', {
                      initialValue: detailsList.foreignInstitution,
                      rules: [
                        {
                          required: true,
                          message: '是否境外机构不可为空',
                        },
                      ],
                    })(
                      <Select
                        onChange={this.overOnchange}
                        showSearch
                        placeholder="请选择是否境外机构"
                        allowClear
                      >
                        {overInst.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  style={{
                    display: diffcountries ? 'block' : 'none',
                  }}
                  span={12}
                >
                  <Form.Item label="境外机构国别">
                    {getFieldDecorator('foreignInstitutionCountry', {
                      initialValue: detailsList.foreignInstitutionCountry,
                      rules: [
                        {
                          required: diffcountries,
                          message: '境外机构国别不可为空',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        placeholder="境外机构国别不可为空"
                      >
                        {codeList?.G002?.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="统一社会信用代码">
                    {getFieldDecorator('orgCode', {
                      initialValue: detailsList.orgCode,
                      rules: [
                        {
                          // required: creditCode === 'block',
                          required: true,
                          message: '统一社会信用代码不可为空',
                        },
                        {
                          pattern: /^[0-9a-zA-Z]{1,18}$/,
                          message: '统一社会信用代码不能超过18位',
                        },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        allowClear
                        disabled={disabled}
                        placeholder="请输入社会信用代码"
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="资质类型">
                    {getFieldDecorator('orgType', {
                      initialValue: detailsList.orgType,
                      rules: [
                        {
                          required: true,
                          message: '资质类型不可为空',
                        },
                      ],
                    })(
                      <Select
                        allowClear
                        placeholder="请选择资质类型"
                        mode="multiple"
                        // showArrow={flag}
                        optionFilterProp="children"
                        showSearch
                        onChange={this.orgTypeValue}
                      >
                        {codeList &&
                          codeList.J004 &&
                          codeList.J004.map(item => (
                            <Select.Option key={item.code}>{item.name}</Select.Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: administrator ? 'block' : 'none',
                  }}
                >
                  <Form.Item label="管理人类别">
                    {getFieldDecorator('managerType', {
                      initialValue: detailsList.managerType,
                      rules: [
                        {
                          required: administrator,
                          message: '管理人类别不可为空',
                        },
                      ],
                    })(
                      <Select allowClear placeholder="请选择管理人类别" showSearch>
                        {codeList &&
                          codeList.J006 &&
                          codeList.J006.map(item => (
                            <Select.Option key={item.code}>{item.name}</Select.Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: administrator ? 'block' : 'none',
                  }}
                >
                  <Form.Item label="所属监管辖区">
                    {getFieldDecorator('jurisdictionSupervision', {
                      initialValue:
                        detailsList.jurisdictionSupervision &&
                        detailsList.jurisdictionSupervision.split(','),
                      rules: [
                        {
                          required: administrator,
                          message: '所属监管辖区不可为空',
                        },
                        // { validator: this.handleJurisdictionSupervisionValidator },
                      ],
                    })(
                      <Select
                        allowClear
                        placeholder="请选择所属监管辖区"
                        mode="multiple"
                        showSearch
                      >
                        {codeList?.R006?.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item label="机构内码">
                    {getFieldDecorator('orgOtherCode', {
                      initialValue: myOrglst.orgOtherCode
                        ? myOrglst.orgOtherCode
                        : detailsList.orgOtherCode,
                      rules: [
                        {
                          required: true,
                          message: '机构内码不可为空',
                        },
                        { validator: this.handleOrgOtherCodeValidator },
                      ],
                    })(
                      <Input
                        disabled={this.props.falg !== false}
                        autoComplete="off"
                        allowClear
                        placeholder="请输入机构内码"
                      />,
                    )}
                  </Form.Item>
                </Col> */}
                <Col span={12}>
                  <Form.Item label="机构简称">
                    {getFieldDecorator('orgShort', {
                      initialValue: detailsList.orgShort,
                      rules: [{ validator: this.handleOrgShortValidator }],
                    })(
                      <Input
                        autoComplete="off"
                        disabled={disabled}
                        allowClear
                        placeholder="请输入机构简称"
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Tooltip title="维护TA机构代码">
                    <Form.Item label="机构代码">
                      {getFieldDecorator('institutionCode', {
                        initialValue: detailsList.institutionCode,
                        rules: [{ validator: this.handleInstitutionCodeValidator }],
                      })(
                        <Input
                          autoComplete="off"
                          disabled={disabled}
                          allowClear
                          placeholder="请输入机构代码"
                        />,
                      )}
                    </Form.Item>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Form.Item label="是否已在协会登记">
                    {getFieldDecorator('registered', {
                      initialValue: detailsList.registered ? Number(detailsList.registered) : '',
                    })(
                      <Radio.Group disabled={disabled}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
                <Col style={{ display: this.props.org === 'other' ? 'block' : 'none' }} span={12}>
                  <Form.Item label="上级机构">
                    {getFieldDecorator('parentId', {
                      initialValue: detailsList.parentId,
                      rules: [
                        {
                          // required: onOrgShow === 'block',
                          message: '所属组织机构不可为空',
                        },
                      ],
                    })(
                      <TreeSelect
                        style={{ width: '100%' }}
                        // value={SuperiorOrgs}
                        allowClear
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={SuperiorOrgs}
                        placeholder="请选择所属组织机构"
                        treeDefaultExpandAll
                        // onChange={this.onChange}
                        showSearch
                        treeNodeFilterProp="title"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={7} style={{ float: 'right' }}>
            <h3>企业标志</h3>
            <div
              style={{
                width: '100%',
                height: '250px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                />
              ) : null}
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Upload
                // name="file"
                // listType="picture-card"
                // className="avatar-uploader"
                // data = {{uploadFilePath: 'img/institutionalInfoManager'}}
                showUploadList={false}
                action="/ams/ams-file-service/fileServer/uploadFile?uploadFilePath=img/institutionalInfoManager"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                // transformFile={this.handlerTransform}
              >
                <Button>
                  <Icon type="upload" />
                  上传头像
                </Button>
              </Upload>
            </div>
          </Col>
        </Row>

        <Row>
          <Form {...layout}>
            <Col span={8}>
              <Form.Item label="英文名称">
                {getFieldDecorator('englishName', {
                  initialValue: detailsList.englishName,
                  rules: [
                    {
                      pattern: /^[0-9a-zA-Z\s]+$/,
                      message: '请填写正确格式',
                    },
                    { validator: this.handleEnglishNameValidator },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入英文名称"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="英文简称">
                {getFieldDecorator('englishShort', {
                  initialValue: detailsList.englishShort,
                  rules: [
                    {
                      pattern: /^[0-9a-zA-Z\s]+$/,
                      message: '请填写正确格式',
                    },
                    { validator: this.handleEnglishShortValidator },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入英文简称"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col style={{ display: this.props.org === 'other' ? 'block' : 'none' }} span={8}>
              <Form.Item label="组织形式">
                {getFieldDecorator('organizationForm', {
                  initialValue: detailsList.organizationForm,
                  rules: [{ validator: this.handleOrganizationFormValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入组织形式"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="注册资本（元）">
                {getFieldDecorator('registCapital', {
                  initialValue: detailsList.registCapital,
                  rules: [
                    {
                      pattern: /^\d+$|^\d*\.\d+$/g,
                      message: '请填写数字',
                    },
                  ],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="请输入注册资本"
                    // onChange={onChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="资本币种">
                {getFieldDecorator('capitalCurrency', {
                  initialValue: detailsList.capitalCurrency,
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择资本币种"
                    // showArrow={flag}
                    optionFilterProp="children"
                  >
                    {codeList?.C001?.map(item => (
                      <Select.Option key={item.code}>{item.name}</Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="注册地址">
                {getFieldDecorator('orgRegaddr', {
                  initialValue: detailsList.orgRegaddr,
                  rules: [{ validator: this.handleOrgRegaddrValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入注册地址"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="邮政编码">
                {getFieldDecorator('orgPostcode', {
                  initialValue: detailsList.orgPostcode,
                  rules: [
                    {
                      pattern: /^[0-9]{1,6}$/,
                      message: '邮编不得超过6位',
                    },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入邮政编码"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="客户服务电话">
                {getFieldDecorator('orgPhone', {
                  initialValue: detailsList.orgPhone,
                  rules: [{ validator: this.handleOrgPhoneValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入客户服务电话"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="网址">
                {getFieldDecorator('orgWebsite', {
                  initialValue: detailsList.orgWebsite,
                  rules: [
                    {
                      pattern: /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
                      message: '请输入正确的网址',
                    },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入网址"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="传真">
                {getFieldDecorator('orgFax', {
                  initialValue: detailsList.orgFax,
                  rules: [{ validator: this.handleOrgFaxValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入传真"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="成立日期">
                {getFieldDecorator('whichSetupdate', {
                  initialValue: detailsList.whichSetupdate
                    ? moment(detailsList.whichSetupdate)
                    : null,
                })(<DatePicker style={{ width: '100%' }} disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col style={{ display: this.props.org === 'other' ? 'block' : 'none' }} span={8}>
              <Form.Item label="存续期间">
                {getFieldDecorator('duration', {
                  initialValue: detailsList.duration,
                  rules: [{ validator: this.handleDurationValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入存续期间"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="报送机构编号">
                {getFieldDecorator('submitOrgCode', {
                  initialValue: detailsList.submitOrgCode,
                  rules: [{ validator: this.handleSubmitOrgCodeValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入报送机构编号"
                  />,
                )}
              </Form.Item>
            </Col>
            {/* <Col span={8}>
                <Form.Item label="批准文号">
                  {getFieldDecorator('approvalNo', {
                    initialValue: detailsList.approvalNo,
                    // rules: [{ validator: this.handleApprovalNoValidator }],
                  })(
                    <Input
                      autoComplete="off"
                      disabled={disabled}
                      allowClear
                      placeholder="请输入批准文号"
                    />,
                  )}
                </Form.Item>
              </Col> */}
          </Form>
        </Row>
        <Form {...textAreaLayout}>
          <Row>
            <Col span={24} style={{ marginLeft: -20 }}>
              <Form.Item label="经营范围">
                {getFieldDecorator('businessScope', {
                  initialValue: detailsList.businessScope,
                  rules: [{ validator: this.handleBusinessScopeValidator }],
                })(<TextArea disabled={disabled} placeholder="请填写经营范围" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {this.title('法人信息')}
        <Form {...layout}>
          <Row>
            <Col span={8}>
              <Form.Item label="法人代表">
                {getFieldDecorator('legalPerson', {
                  initialValue: detailsList.legalPerson,
                  rules: [{ validator: this.handleLegalPersonValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入法人代表"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="法人代表证件类型">
                {getFieldDecorator('legalCertType', {
                  initialValue: detailsList.legalCertType,
                })(
                  <Select
                    allowClear
                    placeholder="请选择法人代表证件类型"
                    showSearch
                    // showArrow={flag}
                    optionFilterProp="children"
                  >
                    {codeList &&
                      codeList.J002 &&
                      codeList.J002.map(item => (
                        <Select.Option key={item.code} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="法人代表证件代码">
                {getFieldDecorator('legalCertNo', {
                  initialValue: detailsList.legalCertNo,
                  rules: [
                    {
                      pattern: /^\w+$/,
                      message: '证件号码不能是汉字',
                    },
                    { validator: this.handleLegalCertNoValidator },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入法人代表证件代码"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="法人代表证件有效期">
                {getFieldDecorator('legalCertPeriod', {
                  initialValue: detailsList.legalCertPeriod
                    ? moment(detailsList.legalCertPeriod)
                    : '',
                })(<DatePicker style={{ width: '100%' }} disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="办公地址">
                {getFieldDecorator('orgOffaddr', {
                  initialValue: detailsList.orgOffaddr,
                  rules: [{ validator: this.handleOrgOffaddrValidator }],
                })(
                  <Input
                    autoComplete="off"
                    disabled={disabled}
                    allowClear
                    placeholder="请输入办公地址"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {trustee && this.props.org === 'other' && this.title('托管人属性')}
          <Row>
            <Col
              span={8}
              style={{
                display: trustee && this.props.org === 'other' ? 'block' : 'none',
              }}
            >
              <Form.Item label="托管人分支机构">
                {getFieldDecorator('custodianBranchOrg', {
                  initialValue: detailsList.custodianBranchOrg,
                  rules: [{ validator: this.handleCustodianBranchOrgValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="托管人分支机构"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                display: trustee && this.props.org === 'other' ? 'block' : 'none',
              }}
            >
              <Form.Item label="总行名称">
                {getFieldDecorator('headOffice', {
                  initialValue: detailsList.headOffice,
                  rules: [{ validator: this.handleHeadOfficeValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入总行名称"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {administrator && this.title('管理人属性')}
          <Row>
            <Col
              span={8}
              style={{
                display: administrator ? 'block' : 'none',
              }}
            >
              <Form.Item label="金融机构编码">
                {getFieldDecorator('financialOrgcode', {
                  initialValue: detailsList.financialOrgcode,
                  rules: [{ validator: this.handleFinancialOrgcodeValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入金融机构编码"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                display: administrator ? 'block' : 'none',
              }}
            >
              <Form.Item label="义务披露人代码">
                {getFieldDecorator('obligatoryDiscloser', {
                  initialValue: detailsList.obligatoryDiscloser,
                  rules: [{ validator: this.handleObligatoryDiscloserValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入义务披露人代码"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {(administrator || trustee) && this.title('信息披露负责人')}
          <Row>
            <Col
              span={8}
              style={{
                display: administrator || trustee ? 'block' : 'none',
              }}
            >
              <Form.Item label="信息披露负责人">
                {getFieldDecorator('informationDisclosure', {
                  initialValue: detailsList.informationDisclosure,
                  rules: [{ validator: this.handleInformationDisclosureValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入信息披露负责人"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                display: administrator || trustee ? 'block' : 'none',
              }}
            >
              <Form.Item label="信披负责人联系电话">
                {getFieldDecorator('informationDisclosureTel', {
                  initialValue: detailsList.informationDisclosureTel,
                  rules: [{ validator: this.handleOrgPhoneValidator }],
                })(
                  <Input
                    disabled={disabled}
                    allowClear
                    placeholder="请输入信披负责人联系电话"
                    autoComplete="off"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                display: administrator || trustee ? 'block' : 'none',
              }}
            >
              <Form.Item label="信披负责人邮箱">
                {getFieldDecorator('informationDisclosureEmail', {
                  initialValue: detailsList.informationDisclosureEmail,
                  rules: [
                    {
                      type: 'email',
                      message: '无效的邮箱格式',
                    },
                  ],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入信披负责人邮箱"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {adviser && this.title('投资顾问属性')}
          <Row>
            <Col
              span={8}
              style={{
                display: adviser ? 'block' : 'none',
              }}
            >
              <Form.Item label="投资顾问机构类型">
                {getFieldDecorator('investmentOrgType', {
                  initialValue: detailsList.investmentOrgType,
                })(
                  <Select
                    allowClear
                    showSearch
                    disabled={disabled}
                    placeholder="请选择机构类型"
                    showArrow={false}
                    optionFilterProp="children"
                  >
                    {codeList &&
                      codeList.J001 &&
                      codeList.J001.map(item => (
                        <Select.Option key={item.code}>{item.name}</Select.Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                display: adviser ? 'block' : 'none',
              }}
            >
              <Form.Item label="私募管理人编码">
                {getFieldDecorator('privateEquityManagerCode', {
                  initialValue: detailsList.privateEquityManagerCode,
                  rules: [{ validator: this.handlePrivateEquityManagerCodeValidator }],
                })(
                  <Input
                    disabled={disabled}
                    autoComplete="off"
                    allowClear
                    placeholder="请输入私募管理人编码"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* </Row> */}
        {/* </Card> */}
        <FileList
          uploadAfter={this.saveData}
          businessArchives={detailsList.businessArchives}
          AfterFileDelet={this.getDetails}
        />
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(publicInfor),
  ),
);
export default WrappedAdvancedSearchForm;

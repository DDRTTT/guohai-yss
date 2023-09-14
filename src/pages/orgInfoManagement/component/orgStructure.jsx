// 组织架构新增、修改弹框
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { getUrlParams, handleValidator } from '@/utils/utils';
import {
  Card,
  Form,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Tooltip,
  TreeSelect,
  InputNumber,
  DatePicker,
  Radio,
} from 'antd';
import SelfTree from './SelfTree';
import PublicInfor from './publicInfor';
import FileList from './fileList';
import moment from 'moment';
import styles from '../index.less';
const { TextArea } = Input;
class orgStructure extends Component {
  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '名称长度过长');
  };

  handleOrgShortValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '简称长度过长');
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

  state = {
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
    department: [],
    isModalVisible: false,
    setIsModalVisible: false,
    //显示标识
    orgfalg: false,
    depentfalg: false,
    title: '',
    //详情信息
    detailsList: [],
    deletefalg: false,
  };
  // 初始化函数
  componentDidMount = () => {
    this.getDepartment();
    this.getCodes();
    this.handleGetDepartLeaderList();
    this.getSuperiorOrg();
  };
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
  //添加
  add = data => {
    // this.getDetails(data)
    this.orgKindChange();
    this.setState({
      title: '新增',
      parentId: data.value,
      isModalVisible: true,
      id: null,
      detailsList: [],
      deletefalg: false,
    });
  };
  //修改
  modify = data => {
    this.setState(
      {
        title: '修改',
        id: data.value,
        isModalVisible: true,
        deletefalg: data.deletefalg,
      },
      () => {
        this.getDetails();
      },
    );
  };
  //删除
  delete = data => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type:
            this.props.org === 'own'
              ? 'orgInfoManagement/orgtionDelete'
              : 'orgInfoManagement/otherOrgDelete',
          payload: [data.value],
        }).then(data => {
          if (data) {
            this.getDepartment();
          }
        });
      },
    });
  };
  // 撤销
  revoke = data => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '请确认是否撤销?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'orgInfoManagement/revoke',
          payload: { orgId: data.value },
        }).then(data => {
          if (data) {
            this.getDepartment();
          }
        });
      },
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
  // 资质类型关联是否显示
  isShow = value => {
    if (!value) return;
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
  /**
   *
   * @method 树形节点部门信息
   */
  getDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getDepartment',
      // type: 'modify/superiorOrgList',
      payload: { needRoot: 1, orgId: this.props.orgid },
    }).then(data => {
      this.setState({
        loading: true,
      });
      if (data.status === 200) {
        const {
          orgInfoManagement: { department },
        } = this.props;
        let data = [];
        if (department[0]) {
          data = [{ deletefalg: true, ...department[0] }];
        }
        this.setState({
          department: data,
        });
      }
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
      payload: this.state.id,
    }).then(data => {
      if (data) {
        const {
          orgInfoManagement: { detailsList },
        } = this.props;
        this.isShow(detailsList.orgType);
        this.orgKindChange(detailsList.orgKind);
        // this.orgShow(detailsList.orgKind);
        if (detailsList.foreignInstitution == 1) {
          this.setState({
            diffcountries: true,
          });
        } else {
          this.setState({
            diffcountries: false,
          });
        }
        this.setState({
          fileList: detailsList.businessArchives,
          detailsList,
          parentId: detailsList.parentId,
          // imageUrl: detailsList.logBase64 ? detailsList.logBase64 : '',
          // serialNumber: detailsList.orgLoge ? detailsList.orgLoge : '',
          // imgTitle: detailsList.orgLoge ? '更换头像' : '上传头像',
        });
      }
    });
  };
  // 请求:机构人员列表
  handleGetDepartLeaderList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getDepartLeaderFunc',
    });
  };

  //保存接口
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dispatch, orgId } = this.props;
      const { myOrglst, serialNumber, fileList } = this.state;
      //后期加的参数为了区分内部组织架构和外部组织架构新增修改==>后台gongli
      if (this.props.org === 'own') {
        values.isInternal = '1';
      }
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
      values.parentId = this.state.parentId;
      // if (values.parentId) {
      //   values.parentId = values.parentId[values.parentId.length - 1];
      // }
      // 如果是否境外机构为否 去掉国别字段
      if (values.foreignInstitution == 0) {
        delete values.foreignInstitutionCountry;
      }
      // // 上传头像
      // if (serialNumber) {
      //   values.orgLoge = serialNumber;
      // }
      values.businessArchives = this.state.businessArchive ? this.state.businessArchive : fileList;
      values.orgOtherCode = values.orgCode;
      // 判断所属组织机构是不是本家的
      // if (myOrglst.id) {
      //   values.parentId = myOrglst.id;
      // }
      if (this.state.id) {
        values.id = Number(this.state.id);
      }
      dispatch({
        type: 'orgInfoManagement/preservation',
        payload: values,
      }).then(data => {
        if (data.flag) {
          this.setState(
            {
              isModalVisible: false,
            },
            () => this.getDepartment(),
          );
          this.props.form.resetFields();
        }
      });
    });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  //机构分类变化
  orgKindChange = val => {
    // 机构、
    if (val == 0) {
      this.setState(
        {
          orgfalg: true,
          depentfalg: false,
          operationOrg: false,
        },
        () => {
          this.isShow(this.state.detailsList.orgType);
          this.overOnchange(this.state.detailsList.foreignInstitution);
        },
      );
    } else if (val == 1 || val == 3) {
      // 分行、支行
      this.setState({
        orgfalg: true,
        depentfalg: false,
        operationOrg: true,
      });
    } else if (val == 2) {
      // 部门
      this.setState(
        {
          orgfalg: false,
          depentfalg: true,
          operationOrg: false,
        },
        () => {
          this.isShow(this.state.detailsList.orgType);
          this.overOnchange(this.state.detailsList.foreignInstitution);
        },
      );
    } else {
      this.setState(
        {
          orgfalg: false,
          depentfalg: false,
          operationOrg: false,
        },
        () => {
          this.isShow(this.state.detailsList.orgType);
          this.overOnchange(this.state.detailsList.foreignInstitution);
        },
      );
    }
  };
  saveData = data => {
    this.setState({
      businessArchive: data,
    });
  };
  //基本信息
  basicInfo = () => {
    const {
      detailsList,
      disabled,
      overInst,
      SuperiorOrgs,
      trustee,
      administrator,
      adviser,
      diffcountries,
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
        {/* <Card> */}
        <Row>
          <Form {...layout}>
            <Row>
              <Col span={8}>
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
                      // disabled={disabled}
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
              <Col span={8}>
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
                span={8}
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
              <Col span={8}>
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
              <Col span={8}>
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
                      disabled={disabled}
                      placeholder="请选择资质类型"
                      mode="multiple"
                      // showArrow={flag}
                      optionFilterProp="children"
                      showSearch
                      onChange={this.orgTypeValue}
                      allowClear
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
              {this.state.operationOrg && trustee && this.props.org === 'own' && (
                <Col span={8}>
                  <Form.Item label="是否运营机构">
                    {getFieldDecorator('isOperateOrg', {
                      initialValue: detailsList.isOperateOrg,
                      rules: [
                        {
                          required: true,
                          message: '是否运营机构不可为空',
                        },
                      ],
                    })(
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col>
              )}
              <Col
                span={8}
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
                    <Select placeholder="请选择管理人类别" allowClear showSearch>
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
                span={8}
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
                    <Select placeholder="请选择所属监管辖区" mode="multiple" allowClear showSearch>
                      {codeList?.R006?.map(item => (
                        <Select.Option key={item.code}>{item.name}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Form.Item label="机构内码">
                  {getFieldDecorator('orgOtherCode', {
                    initialValue: myOrglst.orgOtherCode
                      ? myOrglst.orgOtherCode
                      : detailsList.orgOtherCode,
                    rules: [
                      {
                        // required: orgShow === 'block',
                        required: this.props.org !== 'other',
                        message: '机构内码不可为空',
                      },
                      { validator: this.handleOrgOtherCodeValidator },
                    ],
                  })(<Input autoComplete="off" allowClear placeholder="请输入机构内码" />)}
                </Form.Item>
              </Col> */}
              {this.state.depentfalg && (
                <Col span={8}>
                  <Form.Item label="OA部门id">
                    {getFieldDecorator('oaDeptId', {
                      initialValue: detailsList.oaDeptId,
                      rules: [{ validator: this.handleOaEmployeeIdValidator }],
                    })(<Input autoComplete="off" allowClear placeholder="请输入OA部门id" />)}
                  </Form.Item>
                </Col>
              )}
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
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
              {/* <Col style={{ display: this.props.org === 'other' ? 'block' : 'none' }} span={8}>
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
                      dropdownStyle={{ maxHeight: 400, maxWidth: 200, overflow: 'auto' }}
                      treeData={SuperiorOrgs}
                      placeholder="请选择所属组织机构"
                      treeDefaultExpandAll
                      // onChange={this.onChange}
                    />,
                  )}
                </Form.Item>
              </Col> */}
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
                      showSearch
                      placeholder="请选择资本币种"
                      allowClear
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
                    initialValue: moment(detailsList.whichSetupdate)
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
            </Row>
          </Form>
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
                      showSearch
                      allowClear
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
        </Row>
        {/* </Card> */}
        <FileList
          uploadAfter={this.saveData}
          businessArchives={detailsList.businessArchives}
          AfterFileDelet={this.getDetails}
        />
      </div>
    );
  };
  //表单分类
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

  render() {
    const { department, title, detailsList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { codeList, departLeaderList } = this.props.orgInfoManagement;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <SelfTree
          org={this.props.org}
          details={this.props.details}
          add={this.add}
          modify={this.modify}
          delete={this.delete}
          revoke={this.revoke}
          treeData={department}
        />
        {this.state.isModalVisible && (
          <Modal
            title={title}
            visible={this.state.isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1400}
          >
            <div
              style={{
                overflow: 'auto',
                height: this.state.orgfalg ? '700px' : '150px',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <Form {...layout}>
                <Row>
                  <Col span={8}>
                    <Form.Item label="机构分类">
                      {getFieldDecorator('orgKind', {
                        initialValue: detailsList.orgKind,
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
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={this.orgKindChange}
                          showSearch
                        >
                          {codeList?.O002?.map(item => {
                            if (this.props.org !== 'own') {
                              if (item.code != 2)
                                return <Select.Option key={item.code}>{item.name}</Select.Option>;
                            } else {
                              return <Select.Option key={item.code}>{item.name}</Select.Option>;
                            }
                          })}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  {this.state.depentfalg && (
                    <Col span={8}>
                      <Form.Item label="部门名称">
                        {getFieldDecorator('orgName', {
                          initialValue: detailsList.orgName,
                          rules: [
                            {
                              required: true,
                              message: '部门名称不可为空',
                            },
                            { validator: this.handleorgNameValidator },
                          ],
                        })(<Input autoComplete="off" allowClear placeholder="请输入机构名称" />)}
                      </Form.Item>
                    </Col>
                  )}
                  {this.state.depentfalg && (
                    <Col span={8}>
                      <Form.Item label="部门简称">
                        {getFieldDecorator('orgShort', {
                          initialValue: detailsList.orgShort,
                          rules: [
                            {
                              required: true,
                              message: '部门简称不可为空',
                            },
                            { validator: this.handleOrgShortValidator },
                          ],
                        })(<Input autoComplete="off" allowClear placeholder="请输入机构名称" />)}
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={8}>
                    <Form.Item label="负责人">
                      {getFieldDecorator('departLeader', {
                        initialValue: detailsList.departLeader,
                      })(
                        <Select
                          allowClear
                          placeholder="请选择负责人"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={this.changeValue}
                          showSearch
                        >
                          {departLeaderList.map(item => {
                            if (item.id !== undefined) {
                              return <Select.Option key={item.id}>{item.name}</Select.Option>;
                            }
                          })}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  {this.state.orgfalg && (
                    <Col span={8}>
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
                            disabled={this.state.deletefalg}
                            placeholder="请输入机构名称"
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Form>
              {this.state.orgfalg && this.basicInfo()}
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(orgStructure),
  ),
);
export default WrappedAdvancedSearchForm;

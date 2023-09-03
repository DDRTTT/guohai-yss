import React, { Component } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import moment from 'moment';
import { handleValidator } from '@/utils/utils';
import Gird from '@/components/Gird';
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import styles from './less/details.less';
import FileList from './fileList';
import { Card } from '@/components';

const { TextArea } = Input;

// @Form.create()
class Details extends Component {
  state = {
    // 是否置灰
    disabled: true,
    parentisShow: 'none',
    parentrules: false,
    orgCodeShow: 'block',
    orgCoderules: true,
    detailsList: [],
    overInst: [
      { code: 1, name: '是' },
      { code: 0, name: '否' },
    ],
  };

  componentDidMount() {
    this.getCodes();
    this.getDetails();
    const { identification } = this.props;
    if (identification) {
      // 本家机构查看页
      this.getSuperiorOrg('0');
    } else {
      // 其他机构查看页
      this.getSuperiorOrg('1');
    }
  }

  /**
   * 详情信息获取
   * @method getDetails
   */
  getDetails = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'details/getDetails',
      payload: location.query.id,
    }).then(obj => {
      if (obj.flag) {
        this.setState({
          detailsList: obj.data,
        });
      }
    });
  };

  /**
   * 获取词汇字典内容
   * @method getCodes
   */
  getCodes() {
    const { dispatch } = this.props;
    dispatch({
      type: 'details/getCodeList',
      payload: ['J001', 'J004', 'J002', 'J005', 'J007', 'C001', 'O002', 'J006', 'R006', 'G002'],
    });
  }

  /**
   * 上级机构
   * @method getCodes
   */
  getSuperiorOrg = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'details/superiorOrgList',
      payload: type,
    });
  };

  goBackButton = () => {
    return (
      <Button type="primary" style={{ marginRight: 20 }} onClick={() => this.goBack()}>
        返回
      </Button>
    );
  };

  goBack = () => {
    window.history.go(-1);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { identification } = this.props;
    const {
      details: { codeList },
      location,
    } = this.props;
    const { disabled, orgCoderules, detailsList, overInst } = this.state;
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

    // 查看
    let orgOtherCodeShow;
    if (location?.query?.type === 'details') {
      if (detailsList.orgKind === '0') {
        orgOtherCodeShow = 'block';
      } else {
        orgOtherCodeShow = 'none';
      }
    }

    const drawerConfig = (info) => {
      return [
        { label: '机构名称', value: 'orgName', },
        { label: '机构简称', value: 'orgShort' },
        { 
          label: '机构分类', 
          value: 'orgKind', 
          type: 'select', 
          option: codeList.O002, 
        },{ 
          label: '机构类型', 
          value: 'qualifyType', 
          type: 'select', 
          option: codeList.J001, 
        },{ 
          label: '资质类型', 
          value: 'orgType', 
          type: 'multiple', 
          option: codeList.J004, 
        },
        { label: '统一社会信用代码', value: 'orgCode' },
        { label: '英文名称', value: 'englishName' },
        { label: '机构代码', value: 'institutionCode' },
        { label: '英文简称', value: 'englishShort' },
        { label: '机构内码', value: 'orgOtherCode' },
        { 
          label: '是否已在协会登记', 
          value: 'registered', 
          type: 'select', 
          option: [{ name: '是', code: '1' }, { name: '否', code: '0' }], 
        },
        { label: '组织形式', value: 'organizationForm' },
        // { label: '企业标志', value: 'logBase64', valType:'img'},
        { 
          label: '是否境外机构', 
          value: 'foreignInstitution', 
          type: 'select', 
          option: overInst, 
        },{ 
          label: '境外机构国别', 
          value: 'foreignInstitutionCountry', 
          type: 'select', 
          option: codeList?.G002, 
          rule: detailsList.foreignInstitution !== 1
        },
        { label: '注册资本（元）', value: 'registCapital' },
        { 
          label: '资本币种', 
          value: 'capitalCurrency', 
          type: 'select', 
          option: codeList?.C001, 
        },
        { label: '注册地址', value: 'orgRegaddr' },
        { label: '法人代表', value: 'legalPerson' },
        { 
          label: '法人代表证件类型', 
          value: 'legalCertType', 
          type: 'select', 
          option: codeList.J002, 
        },
        { label: '办公地址', value: 'orgOffaddr' },
        { label: '法人代表证件有效期', value: 'legalCertPeriod' },
        { label: '法人代表证件代码', value: 'legalCertNo' },
        { label: '邮政编码', value: 'orgPostcode' },
        { label: '网址', value: 'orgWebsite' },
        { label: '传真', value: 'orgFax' },
        { label: '客户服务电话', value: 'orgPhone' },
        { label: '成立日期', value: 'whichSetupdate' },
        { label: '存续期间', value: 'duration' },
        { label: '报送机构编号', value: 'submitOrgCode' },
        { label: '经营范围', value: 'businessScope', proportion: true },//一行
        { 
          label: '批准机构', 
          value: 'approvalOrg', 
          type: 'select', 
          option: codeList.J005, 
        },
        { label: '批准文号', value: 'approvalNo' },
        { label: '托管人分支机构', value: 'custodianBranchOrg', rule: !(info.orgType && info.orgType.indexOf('J004_2') != -1) },
        { label: '总行名称', value: 'headOffice', rule: !(info.orgType && info.orgType.indexOf('J004_2') != -1) },
        { 
          label: '管理人类别', 
          value: 'managerType', 
          type: 'select', 
          option: codeList.J006,
          rule: !(info.orgType && info.orgType.indexOf('J004_1') != -1)
        },{ 
          label: '所属监管辖区', 
          value: 'jurisdictionSupervision', 
          type: 'select', 
          option: codeList?.R006,
          rule: !(info.orgType && info.orgType.indexOf('J004_1') != -1)
        },
        { label: '金融机构编码', value: 'financialOrgcode', rule: !(info.orgType && info.orgType.indexOf('J004_1') != -1) },
        { label: '义务披露人代码', value: 'obligatoryDiscloser', rule: !(info.orgType && info.orgType.indexOf('J004_1') != -1) },
        { 
          label: '信息披露负责人', 
          value: 'informationDisclosure', 
          type: 'select', 
          option: codeList?.R006,
          rule: !(info.orgType &&
            (info.orgType.indexOf('J004_1') != -1 ||
              info.orgType.indexOf('J004_2') != -1))
        },{ 
          label: '信披负责人联系电话', 
          value: 'informationDisclosureTel', 
          type: 'select', 
          option: codeList?.R006,
          rule: !(info.orgType &&
            (info.orgType.indexOf('J004_1') != -1 ||
              info.orgType.indexOf('J004_2') != -1))
        },
        { 
          label: '信披负责人邮箱', 
          value: 'informationDisclosureEmail', 
          rule: !(info.orgType &&
            (info.orgType.indexOf('J004_1') != -1 ||
              info.orgType.indexOf('J004_2') != -1))
        },{ 
          label: '投资顾问机构类型', 
          value: 'investmentOrgType', 
          type: 'select', 
          option: codeList.J001,
          rule: !(info.orgType && info.orgType.indexOf('J004_7') != -1)
        },
        { 
          label: '私募管理人编码', 
          value: 'privateEquityManagerCode', 
          rule: !(info.orgType && info.orgType.indexOf('J004_7') != -1)
        },
      ]
    }
    return (
      <div className={styles.content}>
        <Card title="机构信息" style={{padding: 0}}>
        <Row gutter={[16, 16]} style={{margin: 0}}>
          <Col span={2} />
          <Col span={2}>企业标志</Col>
          <Col span={19}>
            <img
              src={detailsList.logBase64}
              alt="avatar"
              style={{ width: '200px', borderRadius: '50%' }}
            />
          </Col>
        </Row>
          <Gird config={drawerConfig(detailsList)} info={detailsList}/>
        </Card>
          {identification ? (
            <FileList falg="details" businessArchives={detailsList.businessArchives} />
          ) : null}
      </div>
    );
  }
}
const WrappedAdvancedSearchForm = errorBoundary(
  // linkHoc()(
  Form.create()(
    connect(({ details }) => ({
      details,
    }))(Details),
  ),
  // ),
);
export default WrappedAdvancedSearchForm;

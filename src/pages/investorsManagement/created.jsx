/**
 * 产品看板-查看产品-账户
 */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { launchIntoFullscreen, uuid } from '@/utils/utils';
import { downloadNoToken, filePreviewWithBlobUrl } from '@/utils/download';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import styless from './add.less';
import moment from 'moment';
import { rangPickerFormat } from '@/pages/archiveTaskHandleList/util';
import Gird from '@/components/Gird';
import {
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import Position from './Position.jsx';
import { parse } from 'qs';
import { Table, Card, PageContainers } from '@/components';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const IMGs =
  'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';
const businessLicenseReg = /^[0-9a-zA-Z]{18}$/; // 统一社会信用代码校验规则
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const phoneReg2 = /^\+86(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; // 手机号码校验规则
const numReg = /^\d{3,4}-?\d{7,8}$/; // 电话号码校验规则
const idCardReg = /(^[1-9]\d{5}(18|19|2[0-3])\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/; // 18位身份证号校验规则
const PASSPORT1 = /^[a-zA-Z]{5,17}$/; // 护照验证规则
const PASSPORT2 = /^[a-zA-Z0-9]{5,17}$/; // 护照验证规则
const HKMAKAO = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/; // 港澳通行证

const Created = ({
  dispatch,
  myInvestor: {
    dicts,
    orgDicts,
    tradeConfirmData: { tradeConfirmList, tradeConfirmTotal },
    investProductData: { investProductList, investProductTotal },
    customDocumentData: { fileInfoList, total },
    fileTypeList,
    invesReviewResult: {
      qualifiedInfo,
      suitabilityInfo,
      investReviewInfo,
      customerRiskInfo,
      blackListInfo,
      investRuleStandardList,
      isAntimoney,
    },
  },
  form: { validateFieldsAndScroll, getFieldDecorator, setFieldsValue },
  global: {
    saveIP: { gateWayIp },
  },
}) => {
  const [activeKey, setActiveKey] = useState('1');
  const [customerTypeData, setCustomerTypeData] = useState(''); // 非自然人客户类型的值
  const [beneficiaryTypeList, setBeneficiaryTypeList] = useState([]); // 受益人类型下拉列表数据
  const [orgLegalCertifcType, setOrgLegalCertifcType] = useState(''); // 机构客户信息法人代表证件类型
  const [certificValidPeriodPermanent, setCertificValidPeriodPermanent] = useState(); // 机构客户统一社会信用代码是否永久有效
  const [
    orgLegalCertificValidPeriodPermanent,
    setOrgLegalCertificValidPeriodPermanent,
  ] = useState(); // 机构客户信息法人代表证件是否永久有效
  const [legalpCardTypeCode, setLegalpCardTypeCode] = useState(''); // 产品客户信息法人代码证件类型
  const [legalCertificValidPeriodPermanent, setLegalCertificValidPeriodPermanent] = useState(); // 产品客户法人证件是否永久有效

  const [certificaType, setCertificaType] = useState(''); // 自然人客户信息证件类型
  const [personCertificValidPeriodPermanent, setPersonCertificValidPeriodPermanent] = useState(); // 自然人客户证件是否永久有效
  const [beneficCertifcTypeList, setBeneficCertifcTypeList] = useState(['']); // 受益所有人证件类型List
  const [operatorCertType, setOperatorCertType] = useState(''); // 经办人证件类型
  const [clientTypeData, setClientTypeData] = useState('0'); // 账户类型
  const [preview, setPreview] = useState({ IMG: false, ablePreview: false }); //
  const [blobUrl, setBlobUrl] = useState(''); //
  const [fileType, setFileType] = useState(''); // 文件类型
  const [awpFileNumber, setAwpFileNumber] = useState('');
  const [searchFileType, setSearchFileType] = useState([]); // 搜索文件类型
  const [searchFileName, setSearchFileName] = useState(''); // 搜索文件名称
  const [restBtn, setRestBtn] = useState(); // 是否触发了重置按钮
  const [customDocPageNum, setcustomDocPageNum] = useState(1); // 客户文档列表页码
  const [customDocPageSize, setcustomDocPageSize] = useState(10); // 客户文档列表页面展示数量
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 客户文档选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 客户文档选中项

  const [tradeConfirmPageNum, setTradeConfirmPageNum] = useState(1); // 交易确认信息列表页码
  const [tradeConfirmPageSize, setTradeConfirmPageSize] = useState(10); // 交易确认信息列表页面展示数量

  const [investProductPageNum, setInvestProductPageNum] = useState(1); // 投资产品信息列表页码
  const [investProductPageSize, setInvestProductPageSize] = useState(10); // 投资产品信息列表页面展示数量

  const [showDesc, setShowDesc] = useState(false); // 控制审查信息其他描述是否展示

  const orgDictsArr = useRef([]); // 机构下拉列表

  const [customId, setCustomId] = useState(); // 从单一客户信息管理列表传过来的id
  const [busIdList, setBusIdList] = useState(['1']);
  const [dis, setDis] = useState(false); // 表单是否置灰 是否是查看页面
  const [isModify, setIsModify] = useState(false); // 是否是修改页面
  const [id, setId] = useState(''); // id
  const [saveDetail, setSaveDetail] = useState({});
  const [beneficiarylist, setBeneficiarylist] = useState([]);
  const [keys, setKeys] = useState([0]);

  const [isSaving, setIsSaving] = useState(false);

  const [guestType, setGuestType] = useState('C003'); // 客户类型
  const [fundSourceType, setFundSourceType] = useState('O005'); // 产品资金来源类型
  const [isInstituteOwnFunds, setIsInstituteOwnFunds] = useState('0');
  const [guestTypeData, setGuestTypeData] = useState([]);
  const [investorTypeData, setInvestorTypeData] = useState([]);
  const [subGuestTypeData, setSubGuestTypeData] = useState([]);
  const [fundSourceTypeData, setFundSourceTypeData] = useState([]);
  const [amacInvestorTypeData, setAmacInvestorTypeData] = useState([]);
  const [subFundSourceTypeData, setSubFundSourceTypeData] = useState([]);

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

  // 单选时间格式
  const dateFormat = 'YYYY-MM-DD';

  // 双选时间格式
  const dateFormatList = ['YYYY-MM-DD', 'YYYY-MM-DD'];

  // 是否单选框
  const yesAndNo = [
    { name: '是', code: '1' },
    { name: '否', code: '0' },
  ];

  // 通过不通过单选框
  const passAndNoPass = [
    { name: '通过', code: '1' },
    { name: '不通过', code: '0' },
  ];
  // 通过不通过单选框
  const belongAndNotBelong = [
    { name: '属于', code: '1' },
    { name: '不属于', code: '0' },
  ];
  // 性别选择框
  const sex = [
    { name: '男', code: '1' },
    { name: '女', code: '0' },
  ];

  // 可疑规则
  const doubtfulRules =
    dicts.I011 &&
    dicts.I011.map(item => {
      return { label: item.name, value: item.code };
    });

  // 客户文档信息
  const customDocumentColumns = [
    {
      key: 'fileName',
      title: '文件名称',
      dataIndex: 'fileName',
      width: 400,
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      render: fileName => (
        <Tooltip placement="topLeft" title={fileName}>
          <span>{fileName}</span>
        </Tooltip>
      ),
    },
    {
      key: 'fileForm',
      title: '文件格式',
      dataIndex: 'fileForm',
      width: 160,
      align: 'center',
      render: fileForm => <span>{fileForm}</span>,
    },
    {
      key: 'fileType',
      title: '文件类型',
      dataIndex: 'fileType',
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: fileType => (
        <Tooltip placement="topLeft" title={fileType}>
          <span>{fileType}</span>
        </Tooltip>
      ),
    },
    {
      key: 'fileSource',
      title: '文件来源',
      dataIndex: 'fileSource',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: fileSource => (
        <Tooltip placement="topLeft" title={fileSource}>
          <span>{fileSource}</span>
        </Tooltip>
      ),
    },
    {
      key: 'fileVersion',
      title: '文件版本',
      dataIndex: 'fileVersion',
      width: 140,
      align: 'center',
      render: fileVersion => <span>{fileVersion}</span>,
    },
    {
      key: 'uploadPeole',
      title: '上传人',
      dataIndex: 'uploadPeole',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: uploadPeole => (
        <Tooltip placement="topLeft" title={uploadPeole}>
          <span>{uploadPeole}</span>
        </Tooltip>
      ),
    },
    {
      key: 'uploadFileTime',
      title: '上传时间',
      dataIndex: 'uploadFileTime',
      width: 180,
      align: 'center',
      render: uploadFileTime => <span>{uploadFileTime}</span>,
    },
    {
      key: 'checkedName',
      title: '文件状态',
      dataIndex: 'checkedName',
      width: 140,
      align: 'center',
      render: checkedName => {
        return <div className={'working'}>{checkedName}</div>;
      },
    },
    {
      key: '',
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: record => {
        return (
          <>
            <Button
              style={{ marginLeft: '-10px' }}
              onClick={() => handlePreview(record)}
              type="link"
              size="small"
            >
              预览
            </Button>
            <Button onClick={() => handleDownload(record, 'single')} type="link" size="small">
              下载
            </Button>
          </>
        );
      },
    },
  ];

  // 交易确认信息
  const tradeConfirmColumns = [
    {
      key: 'proName',
      title: '产品全称',
      dataIndex: 'proName',
      ellipsis: {
        showTitle: false,
      },
      width: 400,
      align: 'center',
      render: proName => (
        <Tooltip placement="topLeft" title={proName}>
          <span>{proName}</span>
        </Tooltip>
      ),
    },
    {
      key: 'proCode',
      title: '产品代码',
      dataIndex: 'proCode',
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
      render: proCode => (
        <Tooltip placement="topLeft" title={proCode}>
          <span>{proCode}</span>
        </Tooltip>
      ),
    },
    {
      key: 'businessType',
      title: '业务类型',
      dataIndex: 'businessType',
      width: 120,
      align: 'center',
      render: businessType => <span>{businessType}</span>,
    },
    {
      key: 'ifInstallment',
      title: '是否分期缴付',
      dataIndex: 'ifInstallment',
      width: 120,
      align: 'center',
      render: (ifInstallment, record) => (
        <span>{record.businessType !== '提取' ? (ifInstallment === '1' ? '是' : '否') : ''}</span>
      ),
    },
    {
      key: 'ifInitialOperate',
      title: '是否起始运作',
      dataIndex: 'ifInitialOperate',
      width: 120,
      align: 'center',
      render: (ifInitialOperate, record) => (
        <span>
          {record.businessType !== '提取' ? (ifInitialOperate === '1' ? '是' : '否') : ''}
        </span>
      ),
    },
    // {
    //   key: 'businessCode',
    //   title: '业务代码',
    //   dataIndex: 'businessCode',
    //   width: 160,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   align: 'center',
    //   render: businessCode => (
    //     <Tooltip placement="topLeft" title={businessCode}>
    //       <span>{businessCode}</span>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   key: 'businessSerialNum',
    //   title: '交易流水号',
    //   dataIndex: 'businessSerialNum',
    //   width: 200,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   align: 'center',
    //   render: businessSerialNum => (
    //     <Tooltip placement="topLeft" title={businessSerialNum}>
    //       <span>{businessSerialNum}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      key: 'applyDate',
      title: '申请日期',
      dataIndex: 'applyDate',
      width: 120,
      align: 'center',
      render: applyDate => <span>{applyDate}</span>,
    },
    {
      key: 'affirmDate',
      title: '确认日期',
      dataIndex: 'affirmDate',
      width: 120,
      align: 'center',
      render: affirmDate => <span>{affirmDate}</span>,
    },
    {
      key: 'amount',
      title: '确认金额',
      dataIndex: 'amount',
      ellipsis: {
        showTitle: false,
      },
      width: 160,
      align: 'center',
      render: amount => (
        <Tooltip placement="topLeft" title={amount}>
          <span>{amount}</span>
        </Tooltip>
      ),
    },
  ];

  // 投资产品信息
  const investProductColumns = [
    {
      key: 'proName',
      title: '产品全称',
      dataIndex: 'proName',
      width: 400,
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      render: proName => (
        <Tooltip placement="topLeft" title={proName}>
          <span>{proName}</span>
        </Tooltip>
      ),
    },
    {
      key: 'proCode',
      title: '产品代码',
      dataIndex: 'proCode',
      ellipsis: {
        showTitle: false,
      },
      width: 160,
      align: 'center',
      render: proCode => (
        <Tooltip placement="topLeft" title={proCode}>
          <span>{proCode}</span>
        </Tooltip>
      ),
    },
    {
      key: 'proStage',
      title: '产品阶段',
      dataIndex: 'proStage',
      width: 160,
      align: 'center',
      render: proStage => <span>{proStage}</span>,
    },
  ];

  // 可疑项筛查表
  const suspiciousScreeningForm = [
    {
      key: 'ruleDegree',
      title: '维度',
      dataIndex: 'ruleDegree',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: ruleDegree => (
        <Tooltip placement="topLeft" title={ruleDegree}>
          <span>{ruleDegree}</span>
        </Tooltip>
      ),
    },
    {
      key: 'ruleItem',
      title: '识别要素',
      dataIndex: 'ruleItem',
      width: 320,
      ellipsis: {
        showTitle: false,
      },
      render: (ruleItem, record) => (
        <Tooltip placement="topLeft" title={ruleItem}>
          <Checkbox
            style={{ display: record.itemAbleSelected ? 'inline-block' : 'none', marginRight: 10 }}
            disabled
            checked={record.itemSelected}
          />
          <span>{ruleItem}</span>
        </Tooltip>
      ),
    },
    {
      key: 'ruleStanstandard',
      title: '筛查标准',
      dataIndex: 'ruleStanstandard',
      width: 320,
      ellipsis: {
        showTitle: false,
      },
      render: (ruleStanstandard, record) => (
        <Tooltip placement="topLeft" title={ruleStanstandard}>
          <Checkbox
            style={{
              display: record.standardAbleSelected ? 'inline-block' : 'none',
              marginRight: 10,
            }}
            disabled
            checked={record.standardSelected}
          />
          <span>{ruleStanstandard}</span>
        </Tooltip>
      ),
    },
  ];
  // 客户文档信息预览
  const handlePreview = ({ fileSerialNumber, fileName, fileForm }) => {
    if (IMGs.includes(fileForm)) {
      setPreview({ IMG: true, ablePreview: true });
      filePreviewWithBlobUrl(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${fileSerialNumber}@${`${fileName}.${fileForm}`}`,
        blobUrl => {
          setBlobUrl(blobUrl);
        },
      );
    } else {
      if (!getDocumentType(fileForm)) {
        message.warn('目前不支持预览该格式的文件');
        return;
      }
      setAwpFileNumber(fileSerialNumber);
      setPreview({ IMG: false, ablePreview: true });
      setFileType(fileForm);
    }
  };

  // 下载:批量下载文件
  const handleDownload = (record, type) => {
    if (type === 'single') {
      // 单个下载
      const { fileSerialNumber, fileName, fileForm } = record;
      message.success('文件正在下载中,请稍后. . .');
      downloadNoToken(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${fileSerialNumber}@${`${fileName}.${fileForm}`}`,
      );
    } else {
      // 批量下载
      if (selectedRows.length === 0) {
        message.warn('请选择需要批量下载的文件!');
        return;
      }
      const payload = selectedRows.map(
        ({ fileSerialNumber, fileName, fileForm } = item) =>
          `${fileSerialNumber}@${`${fileName}.${fileForm}`}`,
      );
      message.success('多文件压缩包正在下载中,请稍后. . .');
      downloadNoToken(`/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${payload}`);
    }
  };

  // 初始化下拉数据源
  const getCascaderData = (dictategoryCode, datadictCode, callback) => {
    dispatch({
      type: `myInvestor/handleGetQueryByLinkage`,
      payload: {
        dictategoryCode,
        datadictCode,
      },
      callback: res => {
        callback && callback(res);
      },
    });
  };

  // 处理从单一客户信息管理列表传过来的参数
  const handleQuery = () => {
    const { dis, id, busIdList, isModify } = parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    setDis(dis);
    setCustomId(id);
    if (id) {
      setBusIdList([busIdList]);
    }
    if (isModify) {
      setIsModify(true);
    }

    // const arr = window.location.search.slice(1).split('&');
    // let investorId = '';
    // if (arr.length > 0) {
    //   const newBusIdList = [];
    //   for (var i = 0; i < arr.length; i++) {
    //     if (arr[i].split('=')[0] === 'dis') {
    //       setDis(true);
    //     } else if (arr[i].split('=')[0] === 'id') {
    //       investorId = arr[i].split('=')[1];
    //       setCustomId(investorId);
    //     } else if (arr[i].split('=')[0] === 'busIdList') {
    //       newBusIdList.push(arr[i].split('=')[1]);
    //     } else if (arr[i].split('=')[0] === 'isModify') {
    //       setIsModify(true);
    //     }
    //   }
    //   if (JSON.stringify(newBusIdList) !== '[]') setBusIdList(newBusIdList);
    // }

    if (id) {
      dispatch({
        type: `myInvestor/handleDetail`,
        payload: {
          id,
        },
      }).then(resData => {
        if (resData && resData.status === 200) {
          const tempDetail = resData.data;

          // 客户类型：根据账户类型返回的数据
          if (tempDetail.clientType) {
            getCascaderData('I009', tempDetail.clientType, res => {
              setGuestTypeData(res.data.C002);
              setInvestorTypeData(res.data.T024);
            });
          }

          // 子客户类型：根据客户类型返回的数据
          if (tempDetail.guestType) {
            getCascaderData('C002', tempDetail.guestType, res => {
              setSubGuestTypeData(res.data.C003);
              setFundSourceTypeData(res.data.O003);
            });
          }

          // 中基协投资者类型：根据产品资金来源类型返回的数据
          if (tempDetail.fundSourceType) {
            getCascaderData('O003', tempDetail.fundSourceType, res => {
              setAmacInvestorTypeData(res.data.T023);
              setSubFundSourceTypeData(res.data.O005);
            });
          }

          setSaveDetail(tempDetail);
          setClientTypeData(tempDetail.clientType);
          setCustomerTypeData(tempDetail.customerType);
          setCertificValidPeriodPermanent(tempDetail.certificValidPeriodPermanent);
          setOrgLegalCertificValidPeriodPermanent(tempDetail.orgLegalCertificValidPeriodPermanent);
          setLegalCertificValidPeriodPermanent(tempDetail.legalCertificValidPeriodPermanent);
          setPersonCertificValidPeriodPermanent(tempDetail.personCertificValidPeriodPermanent);
          if (tempDetail.beneficiarylist) {
            setBeneficiarylist(tempDetail.beneficiarylist);
            setOrgLegalCertifcType(tempDetail.orgLegalCertifcType);
            setLegalpCardTypeCode(tempDetail.legalpCardTypeCode);
            setCertificaType(tempDetail.certificaType);
            setOperatorCertType(tempDetail.operatorCertType);
            const newArr = [];
            const tempBeneficCertifcTypeList = [];
            for (let i = 0; i < tempDetail.beneficiarylist.length; i++) {
              newArr.push(i);
              tempBeneficCertifcTypeList.push(tempDetail.beneficiarylist[i].certificaType);
            }

            setBeneficCertifcTypeList(tempBeneficCertifcTypeList);
            setKeys(newArr);
          }
          if (tempDetail.reviewStatus !== '0') getInvesReviewResult(id);
        } else {
          setSaveDetail({});
        }
      });
    } else {
      setSaveDetail({});
    }
  };

  // 获取词汇字典下拉列表
  const handleGetDicts = () => {
    dispatch({
      type: `myInvestor/getDicts`,
      payload: {
        codeList:
          'I009,I010,F006,I001,J002,G001,I003,G002,I002,I008,I004,I005,I014,I011,C002,C003,T021,T020,T022,O003,O005,R007,T018,T017,T019,KH0001_JRJGST,KH0001_TDMDZT,ZJX011_00,ZJX011_01,ZJX011_14,ZJX011_15,ZJX011_16',
      },
    });
  };

  // 获取文件类型下拉列表
  const handleFileTypeDicts = () => {
    dispatch({
      type: 'myInvestor/getFileTypeDicts',
    });
    dispatch({
      type: 'archiveTaskHandleList/handleGetNginxIP',
    });
  };

  // 获取机构下拉字典
  const handleGetOrgDicts = () => {
    dispatch({
      type: 'myInvestor/getOrgDictsFunc',
      payload: '',
      callback: res => {},
    });
  };

  // 获取客户文档信息列表
  const getCustomDocumentList = newBusIdList => {
    dispatch({
      type: 'myInvestor/getCustomDocumentList',
      payload: {
        pageNum: customDocPageNum,
        pageSize: customDocPageSize,
        archivesClassification: 'customerArchives',
        documentType: 'customerInfo',
        fileTypeList: searchFileType,
        fileName: searchFileName,
        busIdList: newBusIdList || busIdList,
      },
      callback: res => {},
    });
  };

  // 获取交易确认信息列表
  const getTradeConfirmList = investorId => {
    dispatch({
      type: 'myInvestor/getTradeConfirmList',
      payload: {
        pageNum: tradeConfirmPageNum,
        pageSize: tradeConfirmPageSize,
        investorId: investorId || customId,
      },
      callback: res => {},
    });
  };

  // 投资产品信息列表
  const getInvestProductList = investorId => {
    dispatch({
      type: 'myInvestor/getInvestProductList',
      payload: {
        pageNum: investProductPageNum,
        pageSize: investProductPageSize,
        investorId: investorId || customId,
      },
      callback: res => {},
    });
  };

  // 投资审查信息
  const getInvesReviewResult = investorId => {
    dispatch({
      type: 'myInvestor/getInvesReviewResult',
      payload: {
        investorId,
      },
    }).then(res => {
      if (res && res.status === 200) {
        if (res.data.investRuleStandardList && res.data.investRuleStandardList.ruleCode) {
          setFieldsValue({ doubtfulRules: res.data.investRuleStandardList.ruleCode });
        } else {
          setFieldsValue({ doubtfulRules: [] });
        }
        if (
          res.data.investRuleStandardList &&
          res.data.investRuleStandardList.ruleCode &&
          res.data.investRuleStandardList.ruleCode.indexOf('7') !== -1
        )
          setShowDesc(true);
        if (res.data && res.data.qualifiedInfo) setId(res.data.qualifiedInfo.id);
      } else {
      }
    });
  };

  const handleModel = () => {
    setPreview({ ablePreview: false, IMG: false });
    setBlobUrl('');
  };

  // 文件预览弹框
  const handlePreviewModal = () => {
    const url = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}`;
    const key = uuid();
    return (
      <ModalWin
        id="myInvestor"
        width="80vw"
        resetContentHeight={true}
        hideModalFooter={true}
        denominator={10}
        visible={preview.ablePreview}
        title="文件预览"
        okText="确定"
        onOk={handleModel}
        onCancel={handleModel}
      >
        <Button
          onClick={launchIntoFullscreen}
          style={{ margin: '20px 0', float: 'right', zIndex: 10 }}
        >
          全屏
        </Button>
        {preview.IMG ? (
          <Spin tip="加载中..." spinning={!blobUrl.length} wrapperClassName={styless.iframeContent}>
            <iframe width="100%" height="100%" src={blobUrl} title="预览文件" id="preview" />
          </Spin>
        ) : (
          <OnlineEdit fileType={fileType} _key={key} title="预览文件" url={url} />
        )}
      </ModalWin>
    );
  };

  // 头部
  const handleAddHeard = () => {
    return (
      <Card
        className={styless.addTitleDiv}
        extra={[
          <Button style={{ float: 'right', marginLeft: 10 }} onClick={handleCancel}>
            取消
          </Button>,
          <Button
            style={{ display: dis ? 'none' : 'inline-block' }}
            className={styless.save}
            onClick={handleCommit}
            loading={isSaving}
          >
            保存
          </Button>,
        ]}
      />
    );
  };

  // tabs切换
  const handleTabsChange = val => {
    setActiveKey(val);
    if (document.getElementsByClassName('antd-pro-pages-investors-management-add-content')[0]) {
      document.getElementsByClassName(
        'antd-pro-pages-investors-management-add-content',
      )[0].scrollTop = 0;
    }
  };

  // 身体
  const handleAddBody = () => {
    return (
      <div className={(styless.content, 'detailPage bgcFFF')}>
        <div className="scollWrap none-scroll-bar">
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            activeKey={activeKey}
            onChange={handleTabsChange}
            className={styless.mTabs}
          >
            {handleAddBodyData()}
            {dis ? handleCustomDocumentData() : ''}
            {dis ? handleTradeConfirmData() : ''}
            {dis ? handleInvestProductData() : ''}
            {(dis || isModify) && saveDetail.reviewStatus !== '0' ? handleInvestReviewData() : ''}
          </Tabs>
        </div>
      </div>
    );
  };

  // 账户类型 Change
  const handleClientTypeChange = e => {
    setClientTypeData(e.target.value);
    setFieldsValue({ amacInvestorType: undefined });
    setFieldsValue({ investorType: undefined });
  };

  // 客户类型 Change
  const handleChangeGuestType = val => {
    if (val === 'JRJGST' || val === 'TDMDZT') {
      setGuestType(`KH0001_${val}`);
      setFieldsValue({ subGuestType: undefined });
    } else {
      setGuestType('C003');
    }
  };

  // 产品资金来源类型 Change
  const handlechangeFundSourceType = val => {
    if (val === '00' || val === '01' || val === '14' || val === '15' || val === '16') {
      setFundSourceType(`ZJX011_${val}`);
      setFieldsValue({ subFundSourceType: undefined });
    } else {
      setFundSourceType('O005');
    }
  };

  // 非自然人客户类型 Change
  const handleChangeCustomerType = val => {
    setCustomerTypeData(val);
  };

  // 机构客户信息法人代表证件类型 Change
  const handleOrgLegalCertifcTypeChange = val => {
    setOrgLegalCertifcType(val);
  };

  // 机构客户统一社会信用代码是否永久有校 Change
  const handleCertificValidPeriodPermanentChange = e => {
    setCertificValidPeriodPermanent(e.target.value);
  };

  // 机构客户信息法人代表证件是否永久有校 Change
  const handleOrgLegalCertificValidPeriodPermanentChange = e => {
    setOrgLegalCertificValidPeriodPermanent(e.target.value);
  };

  // 产品客户信息代表证件类型 Change
  const handleLegalpCardTypeCodeChange = val => {
    setLegalpCardTypeCode(val);
  };

  // 产品客户法人证件是否永久有校 Change
  const handleLegalCertificValidPeriodPermanent = e => {
    setLegalCertificValidPeriodPermanent(e.target.value);
  };

  // 自然人客户信息证件类型 Change
  const handleNaturalPersonCertificaTypeChange = val => {
    setCertificaType(val);
  };

  // 自然人客户证件是否永久有校 Change
  const handlePersonCertificValidPeriodPermanentChange = e => {
    setPersonCertificValidPeriodPermanent(e.target.value);
  };

  // 受益所有人证件类型 Change
  const handleBeneficCertifcTypeChange = (val, k) => {
    beneficCertifcTypeList[k] = val;
    setBeneficCertifcTypeList(beneficCertifcTypeList);
  };

  // 经办人证件类型 Change
  const handleOperatorCertTypeChange = val => {
    setOperatorCertType(val);
  };

  /**
   * 创建单选框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名称
   * @param {String} bindCode 标签绑定值
   * @param data
   * @param {String} code 字典code
   * @param {String} name 字典name
   * @param {Function} onChange 变更方法
   * @param isShow
   * @param {String} def 默认值
   */
  const handleAddRadio = (
    queryValue,
    spanName,
    bindCode,
    data,
    code,
    name,
    onChange,
    isShow,
    def,
  ) => {
    const arr = [];
    if (data) {
      for (const key of data) {
        arr.push(
          <Radio value={key[code]} key={key[code]}>
            {key[name]}
          </Radio>,
        );
      }
    }
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue || (typeof def !== 'undefined' ? def : undefined),
            rules: [{ required: isShow, message: `请选择${spanName}` }],
          })(
            <Radio.Group
              onChange={onChange}
              disabled={dis ? true : !!(isModify && bindCode === '1')}
            >
              {arr}
            </Radio.Group>,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建下拉框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名称
   * @param {String} bindCode 标签绑定值
   * @param data
   * @param {String} code 字典code
   * @param {String} name 字典name
   * @param {Function} onChange 变更方法
   * @param {Boolean} isShow 是否必填项
   * @param {String} def 默认值
   */
  const handleAddSelect = (
    queryValue,
    spanName,
    bindCode,
    data,
    code,
    name,
    onChange,
    isShow,
    def,
  ) => {
    const arr = [];
    if (data) {
      for (const key of data) {
        arr.push(
          <Select.Option value={key[code]} key={key[code]}>
            {key[name]}
          </Select.Option>,
        );
      }
    }
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue || (typeof def !== 'undefined' ? def : undefined),
            rules: [{ required: isShow, message: `请选择${spanName}` }],
          })(
            <Select
              onChange={onChange}
              disabled={dis ? true : !!(isModify && bindCode === '1')}
              placeholder={dis ? '' : '请选择'}
              filterOption={productFilterOption}
            >
              {arr}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建input框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   * @param {Boolean} isShow 是否必填
   * @param {Object} Ruletype 规则类型
   */
  const handleAddInput = (queryValue, spanName, bindCode, isShow, Ruletype) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [{ required: isShow, ...Ruletype, message: `请输入正确的${spanName}` }],
          })(
            <Input
              style={{ width: '100%' }}
              disabled={dis ? true : !!(isModify && bindCode === '1')}
              maxLength={spanName.indexOf('地址') !== -1 ? 50 : 20}
              placeholder={dis ? '' : '请输入'}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建 Cascader 框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   */
  const handleAddCascader = (queryValue, spanName, bindCode) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [
              {
                type: 'array',
              },
            ],
          })(
            <Cascader
              expandTrigger="hover"
              options={Position}
              placeholder="请选择省/市/区"
              disabled={dis ? true : !!(isModify && bindCode === '1')}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建证件号码input框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   * @param bindVar
   * @param {Boolean} isShow 是否必填
   * @param {Object} Ruletype 规则类型
   */
  const handleAddIdCardNumInput = (queryValue, spanName, bindCode, bindVar, isShow, Ruletype) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [
              { required: isShow, ...Ruletype, message: `请输入正确的${spanName}` },
              {
                validator: (rule, value, callback) => {
                  if (value && bindVar === '0' && !idCardReg.test(value)) {
                    callback('身份证号格式不正确!');
                  } else if (
                    value &&
                    bindVar === '1' &&
                    !(PASSPORT1.test(value) || PASSPORT2.test(value))
                  ) {
                    callback('护照号码格式不正确!');
                  } else if (value && bindVar === '4' && !HKMAKAO.test(value)) {
                    callback('港澳居民通行证号码格式不正确!');
                  } else {
                    callback();
                  }
                },
              },
            ],
          })(
            <Input
              style={{ width: '100%' }}
              disabled={dis}
              maxLength={20}
              placeholder={dis ? '' : '请输入'}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建电话号码input框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   */
  const handleAddContactNumberInput = (queryValue, spanName, bindCode) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (
                    (value &&
                      (phoneReg.test(value) || phoneReg2.test(value) || numReg.test(value))) ||
                    !value
                  ) {
                    callback();
                  } else {
                    callback('电话或手机号码的格式不正确');
                  }
                },
              },
            ],
          })(
            <Input
              style={{ width: '100%' }}
              disabled={dis}
              maxLength={14}
              placeholder={dis ? '' : '请输入'}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建大文本框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   * @param {Boolean} isShow 是否必填
   */
  const handleAddTextArea = (queryValue, spanName, bindCode, isShow) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [{ required: isShow, message: `请输入${spanName}` }],
          })(
            <TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              allowClear
              style={{ width: '100%' }}
              disabled={dis ? true : !!(isModify && bindCode === '1')}
              maxLength={200}
              placeholder={dis ? '' : '请输入200字以内内容...'}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建单选时间框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   * @param {Boolean} isShow 是否必填
   */
  const handleAddDatePicker = (queryValue, spanName, bindCode, isShow) => {
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue ? moment(queryValue) : null,
            rules: [{ required: isShow, message: `请输入${spanName}` }],
          })(<DatePicker style={{ width: '100%' }} format={dateFormatList} disabled={dis} />)}
        </Form.Item>
      </Col>
    );
  };

  /**
   * 创建双选时间框
   * @param {string} queryValue 反显值
   * @param {String} spanName 标签名
   * @param {String} bindCode 表单绑定值
   * @param {Boolean} isShow 是否必填
   */
  const handleAddRangePicker = (queryValue, spanName, bindCode, isShow) => {
    if (queryValue) {
      const arr = queryValue.split('~');
      queryValue = [moment(arr[0]), moment(arr[1])];
    }
    return (
      <Col xl={8} lg={24} md={24} sm={24}>
        <Form.Item {...formItemLayout} label={spanName}>
          {getFieldDecorator(bindCode, {
            initialValue: queryValue,
            rules: [{ required: isShow, message: `请输入${spanName}` }],
          })(<RangePicker style={{ width: '100%' }} format={dateFormat} disabled={dis} />)}
        </Form.Item>
      </Col>
    );
  };

  // 基本信息
  const handleAddBaseData = () => {
    return (
      <div style={{ marginBottom: 24 }}>
        <h1 className={'font-w600'}>基本信息</h1>
        <Form>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            {/* {handleAddInput(saveDetail.clientCode, '客户编号', 'clientCode', true)} */}
            {handleAddRadio(
              saveDetail.clientType,
              '账户类型',
              'clientType',
              dicts.I009,
              'code',
              'name',
              handleClientTypeChange,
              true,
              '0',
            )}
            {handleAddRadio(
              saveDetail.isMajorInvestor,
              '是否专业投资者',
              'isMajorInvestor',
              yesAndNo,
              'code',
              'name',
              _,
              false,
            )}
            {/* {clientTypeData !== '1'
                    ? handleAddInput(saveDetail.creditNumber, '信用编码', 'creditNumber', true)
                    : ''} */}
            {clientTypeData !== '1'
              ? handleAddRadio(
                  saveDetail.isFinanceClient,
                  '是否金融客户',
                  'isFinanceClient',
                  yesAndNo,
                  'code',
                  'name',
                  _,
                  false,
                )
              : ''}
            {/* dis?'详情页显示':'新增或编辑页显示' */}
            {dis ? (
              <>
                {handleAddRadio(
                  saveDetail.isInstituteOwnFunds,
                  '是否机构自有资金',
                  'isInstituteOwnFunds',
                  yesAndNo,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.guestType,
                  '客户类型',
                  'guestType',
                  guestTypeData,
                  'code',
                  'name',
                  handleChangeGuestType,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.subGuestType,
                  '子客户类型',
                  'subGuestType',
                  subGuestTypeData,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.amacInvestorType,
                  '中基协投资者类型',
                  'amacInvestorType',
                  amacInvestorTypeData,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddRadio(
                  saveDetail.isAmacESignature,
                  '中基协是否为电子签名',
                  'isAmacESignature',
                  yesAndNo,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddRadio(
                  saveDetail.isAmacManagerRelation,
                  '中基协是否为管理人关联方',
                  'isAmacManagerRelation',
                  yesAndNo,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddDatePicker(
                  saveDetail.tradeConfirmDate,
                  '交易确认日期',
                  'tradeConfirmDate',
                  true,
                )}
                {handleAddSelect(
                  saveDetail.fundSourceType,
                  '产品资金来源类型',
                  'fundSourceType',
                  fundSourceTypeData,
                  'code',
                  'name',
                  handlechangeFundSourceType,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.subFundSourceType,
                  '产品资金来源子类型',
                  'subFundSourceType',
                  subFundSourceTypeData,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.investorProRel,
                  '投资者与产品关系',
                  'investorProRel',
                  dicts.R007,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {handleAddSelect(
                  saveDetail.investorType,
                  '投资者类型',
                  'investorType',
                  investorTypeData,
                  'code',
                  'name',
                  _,
                  true,
                )}
                {clientTypeData === '2'
                  ? handleAddInput(
                      saveDetail.superProManagerName,
                      '上层产品管理人名称',
                      'superProManagerName',
                      true,
                    )
                  : null}
                {handleAddSelect(
                  saveDetail.sourcesFunds,
                  '资金来源中本公司或关联方情况',
                  'sourcesFunds',
                  dicts.F006,
                  'code',
                  'name',
                  _,
                  saveDetail.isInstituteOwnFunds === '1',
                )}
              </>
            ) : null}
            {handleAddInput(saveDetail.fundAccount, '基金账号', 'fundAccount', false)}
            {handleAddInput(saveDetail.channelCode, '渠道代码', 'channelCode', false)}
            {handleAddInput(saveDetail.branchCode, '网点代码', 'branchCode', false)}
            {clientTypeData !== '1'
              ? handleAddSelect(
                  saveDetail.customerType,
                  '非自然人客户类型',
                  'customerType',
                  dicts.I001,
                  'code',
                  'name',
                  handleChangeCustomerType,
                )
              : ''}
            {customerTypeData === 'I001_23'
              ? handleAddInput(saveDetail.other, '其他', 'other', false)
              : ''}
            {handleAddTextArea(
              saveDetail.clientStatusDescrip,
              '客户状态描述',
              'clientStatusDescrip',
              false,
            )}
          </Row>
        </Form>
        <Divider />
      </div>
    );
  };

  // 机构客户信息
  const handleAddSellData = () => {
    if (clientTypeData === '0') {
      return (
        <div style={{ marginBottom: 24 }}>
          <h1 className={'font-w600'}>机构客户信息</h1>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(saveDetail.agencyName, '客户名称', 'agencyName', true)}
              <Col xl={8} lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label="统一社会信用代码">
                  {getFieldDecorator('businessLicenseNumber', {
                    initialValue: saveDetail.businessLicenseNumber,
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          if (clientTypeData !== '0') {
                            callback();
                          } else if (value && !businessLicenseReg.test(value)) {
                            callback('统一社会信用代码格式错误');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(
                    <Input
                      style={{ width: '100%' }}
                      disabled={dis}
                      maxLength={18}
                      placeholder={dis ? '' : '请输入'}
                    />,
                  )}
                </Form.Item>
              </Col>
              {handleAddRadio(
                saveDetail.certificValidPeriodPermanent,
                '是否永久有效',
                'certificValidPeriodPermanent',
                yesAndNo,
                'code',
                'name',
                handleCertificValidPeriodPermanentChange,
              )}
              {certificValidPeriodPermanent === '0'
                ? handleAddRangePicker(
                    saveDetail.certificValidPeriod,
                    '证件有效期',
                    'certificValidPeriod',
                    false,
                  )
                : ''}
              {handleAddInput(saveDetail.orgLegalPers, '法人代表', 'orgLegalPers', false)}
              {handleAddSelect(
                saveDetail.orgLegalCertifcType,
                '法人代表证件类型',
                'orgLegalCertifcType',
                dicts.J002,
                'code',
                'name',
                handleOrgLegalCertifcTypeChange,
                false,
              )}
              {handleAddIdCardNumInput(
                saveDetail.orgLegalCertificCode,
                '法人代表证件代码',
                'orgLegalCertificCode',
                orgLegalCertifcType,
                false,
              )}
              {handleAddRadio(
                saveDetail.orgLegalCertificValidPeriodPermanent,
                '是否永久有效',
                'orgLegalCertificValidPeriodPermanent',
                yesAndNo,
                'code',
                'name',
                handleOrgLegalCertificValidPeriodPermanentChange,
              )}
              {orgLegalCertificValidPeriodPermanent === '0'
                ? handleAddRangePicker(
                    saveDetail.orgLegalCertificValidPeriod,
                    '法人代表证件有效期',
                    'orgLegalCertificValidPeriod',
                    false,
                  )
                : ''}
              {handleAddCascader(saveDetail.registeredArea, '注册所在地区', 'registeredArea')}
              {handleAddInput(
                saveDetail.registeredAddress,
                '注册详细地址',
                'registeredAddress',
                false,
              )}
              {handleAddTextArea(saveDetail.businessScope, '经营范围', 'businessScope', false)}
            </Row>
          </Form>
          <Divider />
        </div>
      );
    }
  };

  // 自然人客户信息
  const handleAddNaturalPersonData = () => {
    if (clientTypeData === '1') {
      return (
        <div style={{ marginBottom: 24 }}>
          <h1 className={'font-w600'}>自然人客户信息</h1>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(saveDetail.naturalName, '客户名称', 'naturalName', true)}
              {handleAddSelect(
                saveDetail.certificaType,
                '证件类型',
                'certificaType',
                dicts.J002,
                'code',
                'name',
                handleNaturalPersonCertificaTypeChange,
                false,
              )}
              {handleAddIdCardNumInput(
                saveDetail.certificNum,
                '证件号码',
                'certificNum',
                certificaType,
                false,
              )}
              {handleAddRadio(
                saveDetail.personCertificValidPeriodPermanent,
                '是否永久有效',
                'personCertificValidPeriodPermanent',
                yesAndNo,
                'code',
                'name',
                handlePersonCertificValidPeriodPermanentChange,
              )}
              {personCertificValidPeriodPermanent === '0'
                ? handleAddRangePicker(
                    saveDetail.personCertificValidPeriod,
                    '证件有效期',
                    'personCertificValidPeriod',
                    false,
                  )
                : ''}
              {handleAddSelect(
                saveDetail.profession,
                '职业',
                'profession',
                dicts.G001,
                'code',
                'name',
                _,
                false,
              )}
              {handleAddDatePicker(saveDetail.birthDate, '生日', 'birthDate', false)}
              {handleAddSelect(saveDetail.gender, '性别', 'gender', sex, 'code', 'name', _)}
              {handleAddInput(saveDetail.mail, '邮箱', 'mail', false, { type: 'email' })}
              {/* {handleAddInput(saveDetail.contactPerson, '联系人', 'contactPerson', false)} */}
              {/* {handleAddContactNumberInput(saveDetail.contactNumber, '联系人电话', 'contactNumber')} */}
              {handleAddCascader(saveDetail.addressArea, '地区地址', 'addressArea')}
              {handleAddInput(saveDetail.address, '详细地址', 'address', false)}
              {handleAddInput(saveDetail.postcode, '邮编', 'postcode', false, { len: 6 })}
            </Row>
          </Form>
          <Divider />
        </div>
      );
    }
  };

  // 产品客户信息
  const handleAddProductClientData = () => {
    if (clientTypeData === '2') {
      return (
        <div style={{ marginBottom: 24 }}>
          <h1 className={'font-w600'}>产品客户信息</h1>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(saveDetail.productName, '客户名称', 'productName', true)}
              {/* {handleAddInput(saveDetail.productCode, '产品代码', 'productCode', true)} */}
              {handleAddInput(
                saveDetail.productRecordCode,
                '产品备案代码',
                'productRecordCode',
                false,
              )}
              {handleAddSelect(
                saveDetail.affiliation,
                '所属机构',
                'affiliation',
                orgDicts,
                'id',
                'orgName',
                _,
                false,
              )}
              {handleAddInput(saveDetail.legalPerson, '法人代表', 'legalPerson', false)}
              {handleAddSelect(
                saveDetail.legalpCardTypeCode,
                '法人证件类型',
                'legalpCardTypeCode',
                dicts.J002,
                'code',
                'name',
                handleLegalpCardTypeCodeChange,
              )}
              {handleAddIdCardNumInput(
                saveDetail.legalpCardId,
                '法人证件号码',
                'legalpCardId',
                legalpCardTypeCode,
                false,
              )}
              {handleAddRadio(
                saveDetail.legalCertificValidPeriodPermanent,
                '是否永久有效',
                'legalCertificValidPeriodPermanent',
                yesAndNo,
                'code',
                'name',
                handleLegalCertificValidPeriodPermanent,
              )}
              {legalCertificValidPeriodPermanent === '0'
                ? handleAddRangePicker(
                    saveDetail.legalCertificValidPeriod,
                    '法人证件有效期',
                    'legalCertificValidPeriod',
                    false,
                  )
                : ''}
              {handleAddCascader(saveDetail.proAddressArea, '地区', 'proAddressArea')}
            </Row>
          </Form>
          <Divider />
        </div>
      );
    }
  };

  // 受益所有人信息
  const formItems = keys.map(k => {
    if (clientTypeData !== '1') {
      return (
        <div style={{ marginBottom: 24 }} key={k}>
          {k && !dis ? (
            <Button className={styless.save} onClick={() => deleteBenefic(k)}>
              删除受益所有人
            </Button>
          ) : (
            ''
          )}
          <h1 className={'font-w600'}>受益所有人信息</h1>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(
                beneficiarylist[k] && beneficiarylist[k].name,
                '姓名',
                `beneficname[${k}]`,
                false,
              )}
              {handleAddSelect(
                beneficiarylist[k] && beneficiarylist[k].certificaType,
                '证件类型',
                `beneficcertificaType[${k}]`,
                dicts.J002,
                'code',
                'name',
                val => handleBeneficCertifcTypeChange(val, k),
                false,
              )}
              {handleAddIdCardNumInput(
                beneficiarylist[k] && beneficiarylist[k].certificNum,
                '证件号码',
                `beneficcertificNum[${k}]`,
                beneficCertifcTypeList[k],
                false,
              )}
              {/* {handleAddInput(
                      beneficiarylist[k] && beneficiarylist[k].certificNum,
                      '证件号码',
                      `beneficcertificNum[${k}]`,
                      true,
                    )} */}
              {handleAddRangePicker(
                beneficiarylist[k] && beneficiarylist[k].certificValidPeriod,
                '证件有效期',
                `beneficcertificValidPeriod[${k}]`,
                false,
              )}
              {handleAddSelect(
                beneficiarylist[k] && beneficiarylist[k].beneficType,
                '受益人类型',
                `beneficbeneficType[${k}]`,
                beneficiaryTypeList,
                'code',
                'name',
                _,
              )}
              {handleAddSelect(
                beneficiarylist[k] && beneficiarylist[k].beneficStatusType,
                '受益所有人身份类别',
                `beneficbeneficStatusType[${k}]`,
                dicts.I003,
                'code',
                'name',
                _,
              )}
              {handleAddSelect(
                beneficiarylist[k] && 'gender' in beneficiarylist[k]
                  ? `${beneficiarylist[k].gender}`
                  : undefined,
                `性别`,
                `beneficgender[${k}]`,
                sex,
                'code',
                'name',
                _,
              )}
              {handleAddSelect(
                beneficiarylist[k] && beneficiarylist[k].nationality,
                '国籍',
                `beneficnationality[${k}]`,
                dicts.G002,
                'code',
                'name',
                _,
              )}
              {handleAddSelect(
                beneficiarylist[k] && beneficiarylist[k].profession,
                '职业',
                `beneficprofession[${k}]`,
                dicts.G001,
                'code',
                'name',
                _,
              )}
              {handleAddInput(
                beneficiarylist[k] && beneficiarylist[k].mail,
                '邮箱',
                `beneficmail[${k}]`,
                false,
                {
                  type: 'email',
                },
              )}
              {handleAddInput(
                beneficiarylist[k] && beneficiarylist[k].contactPerson,
                '联系人',
                `beneficcontactPerson[${k}]`,
                false,
              )}
              {handleAddContactNumberInput(
                beneficiarylist[k] && beneficiarylist[k].contactNumber,
                '联系人电话',
                `beneficcontactNumber[${k}]`,
              )}
              {handleAddCascader(
                beneficiarylist[k] && beneficiarylist[k].addressArea,
                '地区地址',
                `beneficaddressArea[${k}]`,
              )}
              {handleAddInput(
                beneficiarylist[k] && beneficiarylist[k].address,
                '详细地址',
                `beneficaddress[${k}]`,
                false,
              )}
              {handleAddInput(
                beneficiarylist[k] && beneficiarylist[k].postcode,
                '邮编',
                `beneficpostcode[${k}]`,
                false,
                {
                  len: 6,
                },
              )}
              {handleAddDatePicker(
                beneficiarylist[k] && beneficiarylist[k].birthDate,
                '出生日期',
                `beneficbirthDate[${k}]`,
                false,
              )}
            </Row>
          </Form>
          <Divider />
        </div>
      );
    }
  });

  // 经办人信息
  const handleAddAgent = () => {
    if (clientTypeData !== '1') {
      return (
        <div style={{ marginBottom: 24 }}>
          <h1 className={'font-w600'}>经办人信息</h1>
          <Form>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(saveDetail.operatorName, '经办人姓名', 'operatorName', false)}
              {handleAddSelect(
                saveDetail.operatorCertType,
                '经办人证件类型',
                'operatorCertType',
                dicts.J002,
                'code',
                'name',
                handleOperatorCertTypeChange,
                false,
              )}
              {handleAddIdCardNumInput(
                saveDetail.operatorCertNo,
                '经办人证件号码',
                'operatorCertNo',
                operatorCertType,
                false,
              )}
              {handleAddInput(saveDetail.operatorEmail, '邮箱', 'operatorEmail', false, {
                type: 'email',
              })}
              {handleAddContactNumberInput(saveDetail.operatorTel, '电话', 'operatorTel')}
            </Row>
          </Form>
          <Divider />
        </div>
      );
    }
  };

  // 新增受益所有人
  const add = () => {
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);
    setKeys(nextKeys);
  };

  // 删除受益所有人
  const deleteBenefic = k => {
    const newKeys = [];
    keys.forEach(item => {
      if (item !== k) newKeys.push(item);
    });
    setKeys(newKeys);
  };

  // 五脏--客户基本信息
  const handleAddBodyData = () => {
    const drawerConfigForBasic = [
      {
        label: '账户类型',
        value: 'clientType',
        type: 'select',
        option: dicts.I009,
      },
      {
        label: '是否专业投资者',
        value: 'isMajorInvestor',
        type: 'select',
        option: yesAndNo,
      },
      {
        label: '是否金融客户',
        value: 'isFinanceClient',
        type: 'select',
        option: yesAndNo,
        rule: clientTypeData === '1',
      },
      {
        label: '是否机构自有资金',
        value: 'isInstituteOwnFunds',
        type: 'select',
        option: yesAndNo,
      },
      {
        label: '客户类型',
        value: 'guestType',
        type: 'select',
        option: guestTypeData,
      },
      {
        label: '子客户类型',
        value: 'subGuestType',
        type: 'subGuestTypeData',
        option: yesAndNo,
      },
      {
        label: '中基协投资者类型',
        value: 'amacInvestorType',
        type: 'select',
        option: amacInvestorTypeData,
      },
      {
        label: '中基协是否为电子签名',
        value: 'isAmacESignature',
        type: 'select',
        option: yesAndNo,
      },
      {
        label: '中基协是否为管理人关联方',
        value: 'isAmacManagerRelation',
        type: 'select',
        option: yesAndNo,
      },
      {
        label: '交易确认日期',
        value: 'tradeConfirmDate',
      },
      {
        label: '产品资金来源类型',
        value: 'fundSourceType',
        type: 'select',
        option: fundSourceTypeData,
      },
      {
        label: '产品资金来源子类型',
        value: 'subFundSourceType',
        type: 'select',
        option: subFundSourceTypeData,
      },
      {
        label: '投资者与产品关系',
        value: 'investorProRel',
        type: 'select',
        option: dicts.R007,
      },
      {
        label: '投资者类型',
        value: 'investorType',
        type: 'select',
        option: investorTypeData,
      },
      {
        label: '上层产品管理人名称',
        value: 'superProManagerName',
        rule: !(clientTypeData === '2'),
      },
      {
        label: '资金来源中本公司或关联方情况',
        value: 'sourcesFunds',
        type: 'select',
        option: dicts.F006,
      },
      { label: '基金账号', value: 'fundAccount' },
      { label: '渠道代码', value: 'channelCode' },
      { label: '网点代码', value: 'branchCode' },
      {
        label: '非自然人客户类型',
        value: 'customerType',
        type: 'select',
        option: dicts.I001,
      },
      { label: '其他', value: 'other', rule: !(customerTypeData === 'I001_23') },
      { label: '客户状态描述', value: 'clientStatusDescrip', proportion: true },
    ];
    const drawerConfigForOrganization = info => {
      return [
        { label: '客户名称', value: 'agencyName' },
        { label: '统一社会信用代码', value: 'businessLicenseNumber' },
        {
          label: '是否永久有效',
          value: 'certificValidPeriodPermanent',
          type: 'select',
          option: yesAndNo,
        },
        {
          label: '证件有效期',
          value: 'certificValidPeriod',
          rule: !(info.certificValidPeriodPermanent === '0'),
        },
        { label: '法人代表', value: 'orgLegalPers' },
        {
          label: '法人法人代表证件类型代表',
          value: 'orgLegalCertifcType',
          type: 'select',
          option: dicts.J002,
        },
        { label: '法人代表证件代码', value: 'orgLegalCertificCode' },
        {
          label: '是否永久有效',
          value: 'orgLegalCertificValidPeriodPermanent',
          type: 'select',
          option: yesAndNo,
        },
        {
          label: '法人代表证件有效期',
          value: 'orgLegalCertificValidPeriod',
          rule: !(info.orgLegalCertificValidPeriodPermanent === '0'),
        },
        { label: '注册所在地区', value: 'registeredArea' },
        { label: '注册详细地址', value: 'registeredAddress' },
        { label: '经营范围', value: 'businessScope' },
      ];
    };
    const drawerConfigForNatural = info => {
      return [
        { label: '姓名', value: 'naturalName' },
        {
          label: '证件类型',
          value: 'certificaType',
          type: 'select',
          option: dicts.J002,
        },
        { label: '证件号码', value: 'certificNum' },
        {
          label: '是否永久有效',
          value: 'personCertificValidPeriodPermanent',
          type: 'select',
          option: yesAndNo,
        },
        {
          label: '证件有效期',
          value: 'personCertificValidPeriod',
          rule: !(info.personCertificValidPeriodPermanent === '0'),
        },
        {
          label: '职业',
          value: 'profession',
          type: 'select',
          option: dicts.G001,
        },
        { label: '生日', value: 'birthDate' },
        { label: '性别', value: 'gender' },
        { label: '邮箱', value: 'mail' },
        { label: '地区地址', value: 'addressArea' },
        { label: '详细地址', value: 'address' },
        { label: '邮编', value: 'postcode' },
      ];
    };
    const drawerConfigForCustomer = info => {
      return [
        { label: '产品全称', value: 'productName' },
        { label: '产品备案代码', value: 'productRecordCode' },
        {
          label: '所属机构',
          value: 'affiliation',
          type: 'select',
          option: orgDicts,
          optionConfig: { name: 'orgName', code: 'id' },
        },
        { label: '法人代表', value: 'legalPerson' },
        {
          label: '法人证件类型',
          value: 'legalpCardTypeCode',
          type: 'select',
          option: dicts.J002,
        },
        { label: '法人证件号码', value: 'legalpCardId' },
        {
          label: '是否永久有效',
          value: 'legalCertificValidPeriodPermanent',
          type: 'select',
          option: yesAndNo,
        },
        {
          label: '法人证件有效期',
          value: 'legalCertificValidPeriod',
          rule: !(info.legalCertificValidPeriodPermanent === '0'),
        },
        { label: '地区', value: 'proAddressArea' },
      ];
    };
    const drawerConfigForBeneficiary = [
      { label: '姓名', value: 'name' },
      {
        label: '证件类型',
        value: 'certificaType',
        type: 'select',
        option: dicts.J002,
      },
      { label: '证件号码', value: 'certificNum' },
      { label: '证件有效期', value: 'certificValidPeriod' },
      {
        label: '受益人类型',
        value: 'beneficType',
        type: 'select',
        option: beneficiaryTypeList,
      },
      {
        label: '受益所有人身份类别',
        value: 'beneficStatusType',
        type: 'select',
        option: dicts.I003,
      },
      {
        label: '性别',
        value: 'gender',
        type: 'select',
        option: sex,
      },
      {
        label: '国籍',
        value: 'nationality',
        type: 'select',
        option: dicts.G002,
      },
      {
        label: '职业',
        value: 'profession',
        type: 'select',
        option: dicts.G001,
      },
      { label: '邮箱', value: 'mail' },
      { label: '联系人', value: 'contactPerson' },
      { label: '联系人电话', value: 'contactNumber' },
      { label: '地区地址', value: 'addressArea' },
      { label: '详细地址', value: 'address' },
      { label: '邮编', value: 'postcode' },
      { label: '出生日期', value: 'birthDate' },
    ];
    const drawerConfigForOperator = [
      { label: '经办人姓名', value: 'operatorName' },
      {
        label: '经办人证件类型',
        value: 'operatorCertType',
        type: 'select',
        option: dicts.J002,
      },
      { label: '经办人证件号码', value: 'operatorCertNo' },
      { label: '邮箱', value: 'operatorEmail' },
      { label: '电话', value: 'operatorTel' },
    ];
    return (
      <TabPane tab="客户基本信息" key="1">
        {!dis && (
          <div className={styless.body}>
            <div>
              {handleAddBaseData()}
              {handleAddSellData()}
              {handleAddNaturalPersonData()}
              {handleAddProductClientData()}
              {clientTypeData !== '1' ? (
                <>
                  <Button
                    style={{ display: dis ? 'none' : 'inline-block' }}
                    className={styless.save}
                    onClick={add}
                  >
                    新增受益所有人
                  </Button>
                  {formItems}
                </>
              ) : (
                ''
              )}
              {handleAddAgent()}
            </div>
          </div>
        )}
        {dis && (
          <div>
            <h1 className={'font-w600'}>基本信息</h1>
            <Gird config={drawerConfigForBasic} info={saveDetail} />
            {clientTypeData === '0' && (
              <>
                <h1 className={'font-w600'}>机构客户信息</h1>
                <Gird config={drawerConfigForOrganization(saveDetail)} info={saveDetail} />
              </>
            )}
            {clientTypeData === '1' && (
              <>
                <h1 className={'font-w600'}>自然人客户信息</h1>
                <Gird config={drawerConfigForNatural(saveDetail)} info={saveDetail} />
              </>
            )}
            {clientTypeData === '2' && (
              <>
                <h1 className={'font-w600'}>产品客户信息</h1>
                <Gird config={drawerConfigForCustomer(saveDetail)} info={saveDetail} />
              </>
            )}
            {clientTypeData !== '1' && (
              <>
                <Button
                  style={{ display: dis ? 'none' : 'inline-block' }}
                  className={styless.save}
                  onClick={add}
                >
                  新增受益所有人
                </Button>
                <div style={{ marginBottom: 24 }}>
                  {keys.map(k => {
                    return (
                      <React.Fragment key={k}>
                        {k && !dis ? (
                          <Button className={styless.save} onClick={() => deleteBenefic(k)}>
                            删除受益所有人
                          </Button>
                        ) : (
                          ''
                        )}
                        <h1 className={'font-w600'}>受益所有人信息</h1>
                        <Gird config={drawerConfigForBeneficiary} info={beneficiarylist[k] || {}} />
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
            {clientTypeData !== '1' && (
              <>
                <h1 className={'font-w600'}>经办人信息</h1>
                <Gird config={drawerConfigForOperator} info={saveDetail} />
              </>
            )}
          </div>
        )}
      </TabPane>
    );
  };

  // 五脏--客户文档信息
  const handleCustomDocumentData = () => {
    return (
      <TabPane tab="客户文档信息" key="2">
        <Row gutter={24} style={{ marginBottom: 10 }}>
          <Col span={8}>
            <Input
              placeholder="搜索文件名"
              onChange={e => setSearchFileName(e.target.value)}
              value={searchFileName}
              maxLength={14}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{
                width: '100%',
              }}
              value={searchFileType}
              placeholder="请选择文件类型"
              mode="multiple"
              onChange={val => setSearchFileType(val)}
              showArrow
              filterOption={productFilterOption}
            >
              {fileTypeList &&
                fileTypeList.map(item => (
                  <Option key={item.code} value={item.code}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={8}>
            <Button onClick={handleReset} style={{ float: 'right', marginLeft: 8 }}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={searchBtn}
              htmlType="submit"
              style={{
                float: 'right',
                marginRight: '10px',
              }}
            >
              查询
            </Button>
          </Col>
        </Row>
        <Table
          columns={customDocumentColumns}
          scroll={{ x: 1300 }}
          dataSource={fileInfoList}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={false}
        />
        {total != 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Button onClick={handleDownload}>批量下载</Button>
            <Pagination
              style={{
                textAlign: 'right',
              }}
              current={customDocPageNum}
              pageSize={customDocPageSize}
              onChange={(page, pageSize) => handleSetPage(page, pageSize, 'customDoc')}
              onShowSizeChange={(page, pageSize) => handlePageSize(page, pageSize, 'customDoc')}
              total={total}
              showTotal={() => `共 ${total} 条数据`}
              showSizeChanger
              showQuickJumper={total > customDocPageSize}
            />
          </div>
        ) : null}
      </TabPane>
    );
  };

  // 文件类型下拉框刷选过滤
  const productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  // 条件查询
  const searchBtn = () => {
    getCustomDocumentList();
  };

  // 重置
  const handleReset = () => {
    setSearchFileType([]);
    setSearchFileName('');
    setRestBtn(!restBtn);
  };

  // 切换页数的时候触发
  const handleSetPage = (page, pageSize, type) => {
    if (type === 'customDoc') {
      setcustomDocPageNum(page);
      setcustomDocPageSize(pageSize);
    } else if (type === 'tradeConfirm') {
      setTradeConfirmPageNum(page);
      setTradeConfirmPageSize(pageSize);
    } else if (type === 'investProduct') {
      setInvestProductPageNum(page);
      setInvestProductPageSize(pageSize);
    }
  };

  // 切换页码的时候触发
  const handlePageSize = (page, pageSize, type) => {
    if (type === 'customDoc') {
      setcustomDocPageNum(1);
      setcustomDocPageSize(pageSize);
    } else if (type === 'tradeConfirm') {
      setTradeConfirmPageNum(1);
      setTradeConfirmPageSize(pageSize);
    } else if (type === 'investProduct') {
      setInvestProductPageNum(1);
      setInvestProductPageSize(pageSize);
    }
  };

  // 客户文档信息选中列表
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  // 五脏--交易确认信息
  const handleTradeConfirmData = () => {
    return (
      <TabPane tab="确认交易信息" key="3">
        <Table
          columns={tradeConfirmColumns}
          scroll={{ x: 1300 }}
          dataSource={tradeConfirmList}
          pagination={false}
        />
        <Pagination
          style={{
            display: tradeConfirmTotal != 0 ? 'inline-block' : 'none',
            float: 'right',
            textAlign: 'right',
            marginTop: 20,
          }}
          current={tradeConfirmPageNum}
          pageSize={tradeConfirmPageSize}
          onChange={(page, pageSize) => handleSetPage(page, pageSize, 'tradeConfirm')}
          onShowSizeChange={(page, pageSize) => handlePageSize(page, pageSize, 'tradeConfirm')}
          total={tradeConfirmTotal}
          showTotal={() => `共 ${tradeConfirmTotal} 条数据`}
          showSizeChanger
          showQuickJumper={tradeConfirmTotal > tradeConfirmPageSize}
        />
      </TabPane>
    );
  };

  // 五脏--投资产品信息
  const handleInvestProductData = () => {
    return (
      <TabPane tab="投资产品信息" key="4">
        <Table columns={investProductColumns} dataSource={investProductList} pagination={false} />
        <Pagination
          style={{
            display: investProductTotal != 0 ? 'inline-block' : 'none',
            float: 'right',
            textAlign: 'right',
            marginTop: 20,
          }}
          current={investProductPageNum}
          pageSize={investProductPageSize}
          onChange={(page, pageSize) => handleSetPage(page, pageSize, 'investProduct')}
          onShowSizeChange={(page, pageSize) => handlePageSize(page, pageSize, 'investProduct')}
          total={investProductTotal}
          showTotal={() => `共 ${investProductTotal} 条数据`}
          showSizeChanger
          showQuickJumper={investProductTotal > investProductPageSize}
        />
      </TabPane>
    );
  };

  // 五脏--审查信息
  const handleInvestReviewData = () => {
    const drawerConfigForEligibility = [
      {
        label: '是否合格投资者',
        value: 'isQualifiedInvestor',
        type: 'select',
        option: yesAndNo,
      },
      {
        label: '审查结果',
        value: 'reviewResult',
        type: 'select',
        option: passAndNoPass,
      },
    ];

    const drawerConfigForAppropriateness = [
      {
        label: '风险承受能力',
        value: 'riskTolerance',
        type: 'select',
        option: dicts?.I008,
      },
      {
        label: '审查结果',
        value: 'reviewResult',
        type: 'select',
        option: passAndNoPass,
      },
    ];

    return (
      <TabPane tab="审查信息" key="5">
        <Form>
          <div style={{ display: qualifiedInfo ? 'block' : 'none' }}>
            <h1 className={'font-w600'}>合格性审查结果</h1>
            <Gird config={drawerConfigForEligibility} info={qualifiedInfo || {}} />
          </div>
          <div style={{ display: suitabilityInfo ? 'block' : 'none' }}>
            <h1 className={'font-w600'}>适当性审查结果</h1>
            <Gird config={drawerConfigForAppropriateness} info={suitabilityInfo || {}} />
          </div>
          <div style={{ display: isAntimoney === 1 ? 'block' : 'none' }}>
            <div style={{ marginTop: 24, marginBottom: 20 }}>反洗钱审查-客户身份识别</div>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddSelect(
                investReviewInfo && investReviewInfo.clientIdentityMeasure,
                '客户身份识别措施',
                '1',
                dicts.I004,
                'code',
                'name',
                _,
              )}
              {handleAddInput(investReviewInfo && investReviewInfo.holdProcess, '认定过程', '1')}
            </Row>
          </div>
          <div style={{ display: isAntimoney === 1 ? 'block' : 'none' }}>
            <div style={{ marginTop: 24, marginBottom: 20 }}>反洗钱审查-客户风险</div>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddInput(
                customerRiskInfo && customerRiskInfo.clientRiskScore,
                '风险评估得分',
                '1',
              )}
              {handleAddSelect(
                customerRiskInfo && customerRiskInfo.clientRiskLevel,
                '客户风险等级',
                '1',
                dicts.I005,
                'code',
                'name',
                _,
              )}
              {handleAddRadio(
                customerRiskInfo && customerRiskInfo.terroristListResult,
                '恐怖活动组织及恐怖活动人员名单结果',
                '1',
                belongAndNotBelong,
                'code',
                'name',
              )}
            </Row>
          </div>
          {isAntimoney === 1 ? (blackListInfo ? handleAddBlackList : handleEmptyBlackList) : ''}
          <div
            style={{
              display: isAntimoney === 1 ? 'block' : 'none',
            }}
          >
            <div style={{ marginTop: 24, marginBottom: 20 }}>
              反洗钱审查-大额交易和可疑交易监控信息
            </div>
            <Row>
              <Col>
                <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="可疑规则">
                  {getFieldDecorator('doubtfulRules')(
                    <CheckboxGroup options={doubtfulRules} disabled />,
                  )}
                </Form.Item>
              </Col>
              <Col
                style={{
                  display: showDesc ? 'block' : 'none',
                }}
              >
                <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="其他描述">
                  <TextArea
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={investRuleStandardList && investRuleStandardList.otherDescription}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>可疑交易筛查表：</span>
            <Table
              bordered
              columns={suspiciousScreeningForm}
              dataSource={investRuleStandardList && investRuleStandardList.ruleStandardList}
              pagination={false}
            />
          </div>
          <div style={{ display: isAntimoney === 1 ? 'block' : 'none' }}>
            <div style={{ marginTop: 24, marginBottom: 20 }}>反洗钱审核结果</div>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              {handleAddRadio(
                investReviewInfo && investReviewInfo.reviewResult,
                '审查结果',
                '1',
                passAndNoPass,
                'code',
                'name',
              )}
              {handleAddInput(
                investReviewInfo && timestampToTime(investReviewInfo.reviewDate),
                '审核日期',
                '1',
              )}
              {handleAddInput(investReviewInfo && investReviewInfo.managerId, '经办人', '1')}
              {handleAddInput(investReviewInfo && investReviewInfo.reviewerId, '复核人', '1')}
            </Row>
          </div>
        </Form>
        <Divider />
      </TabPane>
    );
  };

  const timestampToTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate()} `;
    return Y + M + D;
  };

  // 黑名单列表
  const handleAddBlackList =
    blackListInfo &&
    blackListInfo.map(item => {
      return (
        <>
          <div style={{ marginTop: 24, marginBottom: 20 }}>反洗钱审查-黑名单审核</div>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            {handleAddRadio(
              item && item.benefitOwnerTouch,
              '受益所有人触发',
              '1',
              yesAndNo,
              'code',
              'name',
            )}
            {handleAddSelect(
              item && item.sourceType,
              '匹配原因',
              '1',
              dicts.I014,
              'code',
              'name',
              _,
            )}
            {handleAddSelect(
              item.auditStatus,
              '审核状态',
              '1',
              dicts && dicts.I010,
              'code',
              'name',
              _,
            )}
            {handleAddInput(timestampToTime(item.matchDate), '匹配日期', '1')}
            {handleAddTextArea(item.auditInstruction, '审核说明', '1')}
          </Row>
        </>
      );
    });

  // 黑名单为空时列表
  const handleEmptyBlackList = (
    <>
      <div style={{ marginTop: 24, marginBottom: 20 }}>反洗钱审查-黑名单审核</div>
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
        {handleAddRadio('', '受益所有人触发', '1', yesAndNo, 'code', 'name')}
        {handleAddSelect('', '匹配原因', '1', dicts.I014, 'code', 'name', _)}
        {handleAddSelect('', '审核状态', '1', dicts && dicts.I010, 'code', 'name', _)}
        {handleAddInput('', '匹配日期', '1')}
        {handleAddTextArea('', '审核说明', '1')}
      </Row>
    </>
  );

  // 格式化日期
  const formatDate = date => {
    return moment(date).format('YYYY-MM-DD');
  };

  const handleCancel = () => {
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/myInvestor',
      }),
    );
  };

  // 提交表单
  const handleCommit = () => {
    validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('必填信息填写不完整，请检查');
        return;
      }

      // if (values.clientCode) {
      //   values.clientCode = values.clientCode.trim();
      //   if (values.clientCode === '') return message.warning('客户编号不能为空，请检查');
      // }

      if (values.agencyName) {
        values.agencyName = values.agencyName.trim();
        if (values.agencyName === '') return message.warning('客户名称不能为空，请检查');
      }
      if (values.operatorName) {
        values.operatorName = values.operatorName.trim();
        if (values.operatorName === '') return message.warning('经办人姓名不能为空，请检查');
      }
      if (values.naturalName) {
        values.naturalName = values.naturalName.trim();
        if (values.naturalName === '') return message.warn('自然人姓名不能为空，请检查');
      }
      if (values.productName) {
        values.productName = values.productName.trim();
        if (values.productName === '') return message.warn('产品全称不能为空，请检查');
      }
      // if (values.productCode) {
      //   values.productCode = values.productCode.trim();
      //   if (values.productCode === '') return message.warn('产品代码不能为空，请检查');
      // }

      if (values.tradeConfirmDate) {
        values.tradeConfirmDate = formatDate(values.tradeConfirmDate._d);
      }

      if (values.certificValidPeriod) {
        values.certificValidPeriod = `${rangPickerFormat(values.certificValidPeriod).join('~')}`;
      }

      if (values.orgLegalCertificValidPeriod) {
        values.orgLegalCertificValidPeriod = `${rangPickerFormat(
          values.orgLegalCertificValidPeriod,
        ).join('~')}`;
      }

      if (values.personCertificValidPeriod) {
        values.personCertificValidPeriod = `${rangPickerFormat(
          values.personCertificValidPeriod,
        ).join('~')}`;
      }

      if (values.birthDate) {
        values.birthDate = formatDate(values.birthDate._d);
      }

      if (values.legalCertificValidPeriod) {
        values.legalCertificValidPeriod = `${rangPickerFormat(values.legalCertificValidPeriod).join(
          '~',
        )}`;
      }

      const myBeneficiarylist = [];
      const productinvest = {};
      if (values.beneficname) {
        for (var i = 0; i < values.beneficname.length; i++) {
          // 需求：“账户类型”及“客户名称”字段保持必填，其他字段调整为非必填
          // 下面这个判断逻辑会报错，所以注释掉
          // if (values.beneficname[i].trim() === '') {
          //   return message.warning('受益所有人姓名不能为空，请检查');
          // }
          // 根据需求新增的业务逻辑，表单可以正常提交
          if (values.beneficname[i] !== undefined && values.beneficname[i].trim() !== '') {
            myBeneficiarylist.push({});
          }
        }
      }
      setIsSaving(true);
      const qualifiedInfo = {};
      for (const key in values) {
        if (key.startsWith('benefic')) {
          for (var i = 0; i < values[key].length; i++) {
            if (values[key][i] != undefined) {
              if (key === 'beneficcertificValidPeriod' && values.beneficcertificValidPeriod[i]) {
                myBeneficiarylist[i].certificValidPeriod = `${rangPickerFormat(
                  values.beneficcertificValidPeriod[i],
                ).join('~')}`;
              } else if (key === 'beneficbirthDate' && values.beneficbirthDate[i]) {
                myBeneficiarylist[i].birthDate = formatDate(values.beneficbirthDate[i]._d);
              } else if (key === 'beneficaddressArea') {
                myBeneficiarylist[i][key.slice(7)] = values[key][i];
              } else if (values[key][i]) {
                myBeneficiarylist[i][key.slice(7)] = values[key][i].toString().trim();
              }
            }
          }
        } else if (key === 'isQualifiedInvestor') {
          qualifiedInfo.isQualifiedInvestor = values[key];
          qualifiedInfo.id = id;
        } else if (key !== 'keys' && key !== '1' && values[key]) {
          productinvest[key] = values[key];
        }
      }

      const myNewBeneficiarylist = [];
      myBeneficiarylist.forEach(item => {
        if (JSON.stringify(item) !== '{}') {
          myNewBeneficiarylist.push(item);
        }
      });

      if (customId) productinvest.id = customId;
      let payload = { productinvest, beneficiarylist: myNewBeneficiarylist };
      if (saveDetail.reviewStatus !== '0') {
        payload = { ...payload, qualifiedInfo };
      }

      dispatch({
        type: 'myInvestor/handleAdd',
        payload,
        callback: res => {
          setIsSaving(false);
          if (res && res.status === 200) router.push('/productDataManage/myInvestor');
        },
      });
    });
  };

  useEffect(() => {
    if (customerTypeData) {
      setBeneficiaryTypeList([]);
      dispatch({
        type: `myInvestor/getDicts`,
        payload: {
          codeList: customerTypeData,
          type: 'beneficiary',
        },
      }).then(res => {
        if (res && res.status === 200) setBeneficiaryTypeList(res.data[customerTypeData]);
      });
    }
  }, [customerTypeData]);

  useEffect(() => {
    handleQuery(); // 处理从单一客户信息管理列表传过来的参数
    handleGetDicts(); // 请求:获取词汇字典下拉列表
    handleGetOrgDicts(); // 请求:获取机构下拉列表
  }, []);

  // 请求:获取交易确认信息列表 投资产品信息
  useEffect(() => {
    if (dis) {
      getTradeConfirmList();
      getInvestProductList();
      handleFileTypeDicts(); // 请求:获取文件类型下拉列表
    }
  }, [dis]);

  // 请求:客户文档信息列表
  useEffect(() => {
    if (customId && dis) getCustomDocumentList();
  }, [customDocPageNum, customDocPageSize, dis, customId, restBtn]);

  // 请求:获取交易确认信息列表
  useEffect(() => {
    if (customId) getTradeConfirmList();
  }, [tradeConfirmPageNum, tradeConfirmPageSize]);

  // 请求:获取投资产品信息列表
  useEffect(() => {
    if (customId) getInvestProductList();
  }, [investProductPageNum, investProductPageSize]);

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '产品数据管理',
          url: '',
        },
        {
          title: '客户信息管理',
          url: '/productDataManage/myInvestor',
        },
        {
          title: dis ? ' 查看客户信息' : customId ? ' 修改客户信息' : ' 新增',
          url: '',
        },
      ]}
    >
      {handleAddHeard()}
      {handleAddBody()}
      {handlePreviewModal()}
    </PageContainers>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ global, myInvestor, loading }) => ({
      myInvestor,
      global,
      listLoading: loading.effects['myInvestor/getOrgDictsFunc'],
    }))(Created),
  ),
);

export default WrappedIndexForm;

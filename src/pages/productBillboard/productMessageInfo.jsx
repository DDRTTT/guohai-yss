/**
 * 产品看板-查看产品-产品数据-基础信息
 */
import React, { useContext, useEffect, useRef } from 'react';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleAddCustomTooltip,
  handleChangeNumberToFloat,
  handleChangeThousands,
} from '@/pages/productBillboard/baseFunc';

const ProductMessageInfo = ({ dispatch, productBillboard: { productOverviewMessage } }) => {
  const {
    proTypeArguments,
    proCodeArguments,
    codeListCodeData,
    codeListData,
    codeListOrgCodeData,
    codeListOrgData,
    orgBelongCodeData,
    orgBelongData,
    proConsignerCodeData,
    proConsignerListData,
  } = useContext(MyContext); // 子组件接受的数据
  const proConsignerList = useRef([]); // 委托人下拉列表
  const proBondtrusList = useRef([]); // 托管人下拉列表

  // 产品概述信息(超链接)
  const productTrusBank = {
    proConsigner: '委托人',
  };

  // 动态渲染:客户类型
  const customerTypeShow = {
    customerType: '客户类型',
  };

  // 动态渲染:自有资金参与公告日
  const ownFundsDateName = {
    ownFundsDate: '自有资金参与公告日',
  };

  // 动态渲染:量化/对冲类型
  const hedgeFundTypeName = {
    hedgeFundType: '量化/对冲类型',
  };

  // 动态渲染:境外投资类型
  const overseasInvestmentTypeName = {
    overseasInvestmentType: '涉及境外投资类型',
  };

  // 动态渲染:是否通道业务方式
  const channelBusinessShow = {
    channelBusiness: '是否通道业务方式',
  };

  // 动态渲染:托管人(第三方)
  const proBondtrusShow = {
    // proBondtrus: '托管人',
  };

  // 动态渲染:产品成立条件(子项)
  const tapahtumanEhtoNameData = {
    scaleMin: '最低成立规模(万元)',
    investorNumMin: '最低投资者数量(个)',
    tapahtumanEhtoOther: '其他成立条件',
  };

  // 基础信息
  const messageData = {
    // proportionalBandMin: '比例范围(最小值)',
    // proportionalBandMax: '比例范围(最大值)',
    derivativesRatioMin: '衍生品账户权益比例最小值(%)',
    derivativesRatioMax: '衍生品账户权益比例最大值(%)',
    investmentOrientation: '主要投资方向',
    // proEname: '英文名称',
    branchOrgName: '分支机构名称',
    raiseWay: '募集方式',
    supervisorMode: '管理方式',
    // contractCommencementDate: '合同生效日',
    // contractEDate: '合同到期日',
    duration: '存续期限',
    faceValue: '面值',
    fofMom: 'FOF（MOM）',
    momProCode: 'MOM产品代码',
    riskDisclosure: '风险揭示',
    elucidate: '管理人认为需要说明的其他问题',
    tapahtumanEhto: '产品成立条件',
    // taSubordinate: '所属TA',
    holidayGroup: '节假日群',
    gradingScale: '分级比例',
    proBelongDepartment: '产品归属部门',
    organizationForm: '组织形式',
    proArchivalType: '投资类型',
    operationWay: '运作方式',
    settlementMode: '结算模式',
    accountability: '受托责任',
    settlementCurrency: '结算币种',
    gradingType: '分级类型',
    shareRegister: '份额登记方式',
    salesMethod: '销售方式',
    investingActivities: '资产管理计划成立后备案完成前 , 是否开展以下投资活动',
    isStructpro: '是否结构化产品',
    reorganizationGroup: '是否涉及上市公司并购重组',
    stockOwnershipPlan: '是否为员工持股计划',
    canOwnfundParticipation: '是否允许自有资金参与',
    // isStructpro:"是否分级", // 公募显示是否分级
    escrow: '是否第三方托管',
    subassetUnit: '是否子资产单元',
    // qdii: '是否合格境外投资者',
    netType: '是否净值型',
    samp: '是否专项资产管理计划',
    privateEnterprisePlan: '是否为证券行业支持民营企业发展系列资产管理计划',
    nonStandardizedAssets: '底层资产是否涉及非标准化资产',
    overseasInvestment: '是否涉及境外投资',
    hedgeFund: '是否量化/对冲基金',
    breakEven: '是否存在保本情形',
    maintainYield: '是否存在保收益情形',
    investmentProperty: '是否投资房地产',
  };

  const allName = {
    ...productTrusBank,
    ...messageData,
    ...tapahtumanEhtoNameData,
    ...channelBusinessShow,
    ...overseasInvestmentTypeName,
    ...proBondtrusShow,
    ...hedgeFundTypeName,
    ...ownFundsDateName,
    ...customerTypeShow,
  };

  /**
   * 获取产品信息(栅格信息)
   * @param {String} code 产品代码
   * @param {String} type 参数值
   */
  const handleGetProductOverivewMessage = (code, type) => {
    dispatch({
      type: 'productBillboard/overviewMessageListData',
      payload: { proCode: code, type },
    });
  };

  /**
   * 获取机构下拉字典
   * @param {String} code 机构查询参数
   * @param {Object} refData 机构赋值对象
   */
  const handleGetOrgDicts = (code, refData) => {
    dispatch({
      type: 'productBillboard/getOrgDictsFunc',
      payload: code,
      callback: res => {
        refData.current = res;
      },
    });
  };

  /**
   * 词汇替换(不替换)
   * @param {String} val 词汇值
   */
  const handleDoNontUpdate = val => {
    return val;
  };

  /**
   * 词汇替换(托管人,委托人)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgName = val => {
    if (codeListOrgCodeData.includes(val)) {
      return codeListOrgData[val];
    }
    return val;
  };

  /**
   * 词汇替换(产品归属部门)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgBelong = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (orgBelongCodeData.includes(key)) {
          arr.push(orgBelongData[key]);
        } else if (!orgBelongCodeData.includes(key)) {
          arr.push(key);
        }
      }
      return arr;
    }
  };

  /**
   * 词汇替换(委托人)
   * @param {String} val 词汇值
   */
  const handleUpdateProConsigner = val => {
    if (proConsignerCodeData.includes(val)) {
      return proConsignerListData[val];
    }
    return val;
  };

  /**
   * 词汇替换(字典)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValue = val => {
    if (Array.isArray(val)) {
      const arr = [];
      for (const key of val) {
        if (codeListCodeData.includes(key)) {
          arr.push(codeListData[key]);
        }
      }
      return arr;
    }
    if (codeListCodeData.includes(val)) {
      return codeListData[val];
    }
    return val;
  };

  /**
   * 词汇替换(是否)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValueYesAndNo = val => {
    if (val === '1') {
      return '是';
    }
    if (val === '0') {
      return '否';
    }
    return val;
  };

  // 募集方式
  const handleUpdateRaiseValue = val => {
    if (val === '0') {
      return '公开募集';
    }
    if (val === '1') {
      return '非公开募集';
    }
    return val;
  };

  // 管理方式
  const handleUpdateManageValue = val => {
    if (val === '1') {
      return '单独管理';
    }
    if (val === '0') {
      return '集合管理';
    }
    return val;
  };

  // 所属TA
  const handleUpdateTAValue = val => {
    if (val === '1') {
      return '自TA';
    }
    if (val === '0') {
      return '分TA';
    }
    return val;
  };

  // FOF
  const handleUpdateFOFValue = val => {
    if (val === '0') {
      return '否';
    }
    if (val === '1') {
      return 'FOF';
    }
    if (val === '2') {
      return 'MOM';
    }
    return val;
  };

  const arrDicts = [
    '主要投资方向',
    '节假日群',
    '投资类型',
    '组织形式',
    '运作方式',
    '客户类型',
    '结算模式',
    '受托责任',
    '单位(存续期限)',
    '结算币种',
    '产品成立条件',
    '境外投资类型',
    '量化/对冲类型',
    '份额登记方式',
    '销售方式',
    '分级类型',
    '资产管理计划成立后备案完成前 , 是否开展以下投资活动',
  ];

  const arrOrgDicts = ['托管人', '管理人', '分支机构名称'];

  const arrOgrBelong = ['产品归属部门'];

  const arrYesAndNo = [
    '是否结构化产品',
    '是否涉及上市公司并购重组',
    '是否为员工持股计划',
    '是否允许自有资金参与',
    '是否第三方托管',
    '是否通道业务方式',
    '是否子资产单元',
    // '是否合格境外投资者',
    '是否净值型',
    '是否专项资产管理计划',
    '是否为证券行业支持民营企业发展系列资产管理计划',
    '底层资产是否涉及非标准化资产',
    '是否涉及境外投资',
    '是否量化/对冲基金',
    '是否存在保本情形',
    '是否存在保收益情形',
    '是否投资房地产',
  ];

  const thousands = ['比例范围(最小值)', '比例范围(最大值)'];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    }
    if (arrOrgDicts.includes(val2)) {
      return handleUpdateOrgName(val);
    }
    if (arrOgrBelong.includes(val2)) {
      return handleUpdateOrgBelong(val);
    }
    if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    }
    if (val2 === '募集方式') {
      return handleUpdateRaiseValue(val);
    }
    if (val2 === '管理方式') {
      return handleUpdateManageValue(val);
    }
    if (val2 === '所属TA') {
      return handleUpdateTAValue(val);
    }
    if (val2 === 'FOF（MOM）') {
      return handleUpdateFOFValue(val);
    }
    if (val2 === '委托人') {
      return handleUpdateProConsigner(val);
    }
    if (thousands.includes(val2)) {
      return handleChangeThousands(val);
    }
    if (typeof val === 'number') {
      return handleChangeNumberToFloat(val);
    } else {
      return val;
    }
  };

  /**
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName, wordChange) => {
    return productOverviewMessage
      ? handleAddAllData(dataTitle, dataName, productOverviewMessage, wordChange)
      : '';
    // return handleAddbaseData(dataTitle, dataName, productOverviewMessage, wordChange);
  };

  /**
   * 跳转(托管行详情页)
   */
  const handleGoProConsignerPages = () => {
    if (productOverviewMessage.busIdList && productOverviewMessage.proConsigner) {
      const id = productOverviewMessage.proConsigner;
      const d1 = productOverviewMessage.busIdList[0];
      const d2 = productOverviewMessage.busIdList[1];
      router.push(
        `/productDataManage/myInvestor/newInvestor?id=${id}&dis=true&busIdList=${d1}&busIdList=${d2}`,
      );
    }
  };

  /**
   * 信息渲染(公共)
   * @param {dataTitle} String 页标题
   * @param {dataName} Object 数据名称
   * @param {data} Object 数据源
   */
  const handleAddbaseData = (dataTitle, dataName, data, wordChange) => {
    const rowColData = [];
    for (const key in data) {
      if (typeof dataName[key] !== 'undefined') {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>{handleAddCustomTooltip(dataName[key], 15)} : </span>
            {handleAddCustomTooltip(wordChange(data[key], dataName[key]), 15)}
          </Col>,
        );
      }
      if (typeof ownFundsDateName[key] !== 'undefined') {
        if (data.canOwnfundParticipation === '1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>
                {handleAddCustomTooltip(ownFundsDateName[key], 15)} :
              </span>
              {handleAddCustomTooltip(wordChange(data[key], ownFundsDateName[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof hedgeFundTypeName[key] !== 'undefined') {
        if (data.hedgeFund === '1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>
                {handleAddCustomTooltip(hedgeFundTypeName[key], 15)} :
              </span>
              {handleAddCustomTooltip(wordChange(data[key], hedgeFundTypeName[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof overseasInvestmentTypeName[key] !== 'undefined') {
        if (data.overseasInvestment === '1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>
                {handleAddCustomTooltip(overseasInvestmentTypeName[key], 15)} :
              </span>
              {handleAddCustomTooltip(wordChange(data[key], overseasInvestmentTypeName[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof productTrusBank[key] !== 'undefined') {
        if (proTypeArguments === 'A002_1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <div className={styles.divClick} onClick={() => handleGoProConsignerPages()}>
                <span className={styles.dataName}>{productTrusBank[key]} : </span>
                {handleAddCustomTooltip(wordChange(data[key], productTrusBank[key]), 15)}
              </div>
            </Col>,
          );
        }
      }
      if (typeof customerTypeShow[key] !== 'undefined') {
        if (proTypeArguments === 'A002_1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>{customerTypeShow[key]} : </span>
              {handleAddCustomTooltip(wordChange(data[key], customerTypeShow[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof proBondtrusShow[key] !== 'undefined') {
        if (productOverviewMessage.escrow === '1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>{proBondtrusShow[key]} : </span>
              {handleAddCustomTooltip(wordChange(data[key], proBondtrusShow[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof channelBusinessShow[key] !== 'undefined') {
        if (proTypeArguments === 'A002_1') {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>{channelBusinessShow[key]} : </span>
              {handleAddCustomTooltip(wordChange(data[key], channelBusinessShow[key]), 15)}
            </Col>,
          );
        }
      }
      if (productOverviewMessage.tapahtumanEhto) {
        if (typeof tapahtumanEhtoNameData[key] !== 'undefined') {
          if (!productOverviewMessage.tapahtumanEhto.indexOf('A0021_1')) {
            rowColData.push(
              <Col span={6} className={styles.rowColBody}>
                <span className={styles.dataName}>{tapahtumanEhtoNameData[key]} : </span>
                {handleAddCustomTooltip(wordChange(data[key], tapahtumanEhtoNameData[key]), 15)}
              </Col>,
            );
          }
        }
        if (typeof tapahtumanEhtoNameData[key] !== 'undefined') {
          if (!productOverviewMessage.tapahtumanEhto.indexOf('A0021_2')) {
            rowColData.push(
              <Col span={6} className={styles.rowColBody}>
                <span className={styles.dataName}>{tapahtumanEhtoNameData[key]} : </span>
                {handleAddCustomTooltip(wordChange(data[key], tapahtumanEhtoNameData[key]), 15)}
              </Col>,
            );
          }
        }
        if (typeof tapahtumanEhtoNameData[key] !== 'undefined') {
          if (!productOverviewMessage.tapahtumanEhto.indexOf('A0021_3')) {
            rowColData.push(
              <Col span={6} className={styles.rowColBody}>
                <span className={styles.dataName}>{tapahtumanEhtoNameData[key]} : </span>
                {handleAddCustomTooltip(wordChange(data[key], tapahtumanEhtoNameData[key]), 15)}
              </Col>,
            );
          }
        }
      }
    }
    return (
      <div className={styles.dataTitle}>
        <Row>
          <h3 style={{ fontSize: '20px', paddingBottom: '10px' }}>{dataTitle}</h3>
          {rowColData}
        </Row>
      </div>
    );
  };

  const handleAddAllData = (title, name, data, wordChange) => {
    const rowColData = [];
    for (const key in name) {
      if (name[key] === '委托人') {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <div className={styles.divClick} onClick={() => handleGoProConsignerPages()}>
              <span className={styles.divName}>{name[key]} : </span>
              {handleAddCustomTooltip(wordChange(data[key], name[key]), 15)}
            </div>
          </Col>,
        );
      } else {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>{handleAddCustomTooltip(name[key], 15)} : </span>
            {data[key] === undefined
              ? ''
              : handleAddCustomTooltip(wordChange(data[key], name[key]), 15)}
          </Col>,
        );
      }
    }
    return (
      <div className={styles.dataTitle}>
        <Row>
          <h3 style={{ fontSize: '20px', paddingBottom: '10px' }}>{title}</h3>
          {rowColData}
        </Row>
      </div>
    );
  };

  useEffect(() => {
    handleGetOrgDicts('J004_13', proConsignerList);
    handleGetOrgDicts('J004_2', proBondtrusList);
    handleGetProductOverivewMessage(proCodeArguments, 'productInfo');
  }, []);

  return <>{handleIfProductOverviewMessage('基础信息', allName, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard }) => ({
    productBillboard,
  }))(ProductMessageInfo),
);

export default WrappedIndexForm;

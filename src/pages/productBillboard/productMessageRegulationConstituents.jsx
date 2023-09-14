/**
 * 产品看板-查看产品-产品数据-监管要素
 */
import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleAddCustomTooltip, handleChangeThousands } from './baseFunc';

const ProductMessageRegulationConstituents = ({ productBillboard: { RC } }) => {
  const { codeListCodeData, codeListData } = useContext(MyContext); // 子组件接受的数据

  const fispItemInfo = {
    privateFund: '是否私募基金',
    privateFundType: '私募基金类别',
    // channelBusiness: '是否通道类业务',
    pensionFund: '是否养老金产品',
    stageAccount: '是否分期账户',
    pensionBaseFund: '是否基本养老金',
    socialFund: '是否社保基金',
    enterpriseFund: '是否企业年金',
    enterpriseFundType: '企业年金计划类型',
    enterpriseFundModule: '企业年金受托模式',
    professionFund: '是否职业年金',
    creditWay: '产品资产是否存在增信措施',
    creditType: '增信措施类别',
    approveNum: '核准文号',
    transition: '是否转型',
    transitionProCode: '转型前正式代码',
    turnDate: '正式转型日期',
    suspendOperation: '产品是否暂停运作',
    totalShare: '总份数',
    riskCash: '投资管理风险准备金',
    breachRisk: '是否存在延期兑付风险',
    breachContent: '延期兑付风险描述',
    securityPledge: '是否出资参与股票质押业务',
    // performanceBenchmark: '业绩比较基准',
    applyConfirmDays: '申请确认天数',
    shareConfirmDays: '份额确认（估值完成）天数',
    launchDate: '上市日期',
    approvalDate: '核准日期',
    registApprovalChangeDate: '注册批文变更日期',
    isPensionTargetFund: '是否养老目标基金',
    investementStrategy: '投资策略',
    isInlandMutualFund: '是否内地互认基金',
    isHedgeFund: '是否避险策略基金',
    mixedInvestmentBias: '混合投资偏向性',
    isListedTransactions: '是否上市交易',
    listedFundType: '上市基金类型',
    listedTradingPlace: '上市交易场所',
    isIndexFund: '是否指数基金',
    isETFFund: '是否ETF基金',
    isETFFeederFund: '是否ETF联接基金',
    targetFundCode: '目标基金代码',
    targetFundName: '目标基金名称',
    fispMark: '备注',
  };

  const pbocReportItemInfo = {
    spvProCode: 'SPV产品编码',
    spvProNum: 'SPV编码顺序码',
    proBrand: '产品品牌',
    proIssue: '产品期次',
    orgTerminationTag: '发行机构提前终止权标识',
    redeemTag: '客户赎回权标识',
    proCreditTag: '产品增信标识',
    creditOrgType: '增信机构类型',
    creditChannel: '增信形式',
    // trusteeOrgCountry: '境外托管机构国别',
    raiseCurrency: '募集资金币种',
    payCostCurrency: '兑付本金币种',
    payProfitCurrency: '兑付收益币种',
    marketFund: '货币市场基金',
    proType: '产品品种',
    profitChangePro: '收益权转让产品',
    // pbocMark: '备注',
  };

  const amacItemInfo = {
    // proTypeFirst: '产品类型1',
    // protTypeSecond: '产品类型2',
    protTypeSecDelay: '产品类型2(延付本息情况)',
    proTypeThird: '产品类型3',
    proTypeFourth: '产品类型4',
    proTypeFifth: '产品类型5',
    reportOnOpenTerm: '报告期末是否处于开放期',
    // unstandardAsset: '底层资产是否涉及非标准化资产',
    assetBaseInfo: '基础资产投资情况',
    proBaseInfo: '产品基本情况',
    assetChargeInfo: '资金监管情况',
    currentStop: '是否当期终止(注意每月更新)',
    mainInvest: '主要投向',
    amacMarkAM02: '备注(AM02)',
    productInferiorFundSource: '产品劣后级资金来源',
    amacMark: '备注',
  };

  const sacItemInfo = {
    proType: '产品类型',
    proKindThird: '产品类别3',
    sacMark: '备注',
  };

  const cusWeekMonthItemInfo = {
    proKindFirst: '产品类别1',
    proKindSecond: '产品类别2',
    proKindThird: '产品类别3',
    proKindFourth: '产品类别4',
    proKindFifth: '产品类别5',
    proKindSixth: '产品类别6(产品是否出资参与股票质押业务)',
    proTypeSeventh: '产品类别7(是否为主动管理)',
    keepCost: '是否挂牌转让',
    proKind: '产品类别',
    isOpenRedemption: '是否开放申赎',
    isSpecialTransaction: '是否存在特殊交易',
    unitermBondPayRate: '单一项目或证券是否向资管产品支付固定利率',
    unitermBondPayRateRatio: '单一项目或证券支付固定利率（%）',
    isAchievementDatum: '是否存在业绩基准',
    achievementDatum1: '业绩基准1',
    achievementDatum2: '业绩基准2',
    productOpenFrequency: '产品开放频率',
    irregularOpenPlan: '不定期开放安排',
    isCreditLiquidityRisk: '是否存在信用及流动性风险',
    cusWeekMonthMark: '备注',
  };

  const financeMonthItemInfo = {
    desiredYield: '受益凭证预期收益率(%)',
    sponsor: '项目主办人',
    liaisons: '联络人',
    financeMonthType2: '类型2',
    financeMonthMark: '备注',
  };

  const personItemInfo = {
    backEndChargeRate: '后端收费率(%)',
    rate: '费率(%)',
    subscribeReturnRatio: '认购费返还比例(%)',
    // personalizedProType1: '产品类型1',
    seviceType: '服务类型',
    // personalizedProType2: '产品类型2',
    // businessType: '业务类型',
    // personalizedInvestType: '投资类型',
    // personalizedInvestStrategy: '投资策略',
    // projectType: '项目类型',
    isCashManageMentPro: '是否现金管理产品',
    transferCode: '转让代码',
    personalizedMark: '备注',
  };

  // 子表单详情渲染
  const handleAddBaseData = (dataTitle, dataName, data, changWords) => {
    const arr = [];
    for (const key in dataName) {
      arr.push(
        <Col span={6} className={styles.rowColBody}>
          <span className={styles.dataName}>{handleAddCustomTooltip(dataName[key], 15)} : </span>
          {data ? handleAddCustomTooltip(changWords(data[key], dataName[key]), 15) : ''}
        </Col>,
      );
    }
    return (
      <div className={styles.dataTitle}>
        <h2 style={{ fontSize: '20px', padding: '0 0 10px 5px', fontWeight: 'bold' }}>
          {dataTitle}
        </h2>
        <Row>{arr}</Row>
      </div>
    );
  };

  /**
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   * @param {Object} data 数据源
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName, data, changWords) => {
    if (JSON.stringify(data) !== '{}') {
      return handleAddBaseData(dataTitle, dataName, data, changWords);
    }
  };

  /**
   * 词汇替换(字典)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValue = val => {
    if (Array.isArray(val)) {
      let arr = [];
      for (let key of val) {
        if (codeListCodeData.includes(key)) {
          arr.push(codeListData[key]);
        }
      }
      console.log('阿萨德', arr);
      return arr;
    } else if (codeListCodeData.includes(val)) {
      return codeListData[val];
    } else {
      return val;
    }
  };

  /**
   * 词汇替换(是否)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValueYesAndNo = val => {
    if (val === '1') {
      return '是';
    } else if (val === '0') {
      return '否';
    } else {
      return val;
    }
  };

  /**
   * 词汇替换(有无)
   * @param {String} val 词汇值
   */
  const handleUpdateNameValueNoOneTwo = val => {
    if (val === '0') {
      return '无';
    } else if (val === '1') {
      return '有';
    } else if (val === '2') {
      return '其他';
    } else return val;
  };

  const arrDicts = [
    '私募基金类别',
    '企业年金计划类型',
    '增信措施类别',
    '企业年金受托模式',
    '增信机构类型',
    '增信形式',
    // '境外托管机构国别',
    '募集资金币种',
    '兑付本金币种',
    '兑付收益币种',
    '产品品种',
    // '产品类型1',
    // '产品类型2',
    '产品类型2(延付本息情况)',
    '产品类型3',
    '产品类型4',
    '产品类型5',
    '产品类型',
    '产品类别3',
    '产品类别',
    '产品类别1',
    '产品类别2',
    '产品类别3',
    '产品类别4',
    '产品类别5',
    '投资策略',
    '混合投资偏向性',
    '上市基金类型',
    '上市交易场所',
    '是否当期终止(注意每月更新)',
    '主要投向',
    '单一项目或证券是否向资管产品支付固定利率',
    '类型2',
    // '产品类型1',
    '服务类型',
    // '产品类型2',
    // '业务类型',
    // '投资类型',
    // '投资策略',
    // '项目类型',
  ];

  const arrYesAndNo = [
    '是否私募基金',
    // '是否通道类业务',
    '是否养老金产品',
    '是否分期账户',
    '是否基本养老金',
    '是否社保基金',
    '是否企业年金',
    '是否职业年金',
    '产品资产是否存在增信措施',
    '产品是否暂停运作',
    '是否存在延期兑付风险',
    '是否出资参与股票质押业务',
    '报告期末是否处于开放期',
    // '底层资产是否涉及非标准化资产',
    '是否挂牌转让',
    '是否转型',
    '货币市场基金',
    '收益权转让产品',
    '产品类别6(产品是否出资参与股票质押业务)',
    '产品类别7(是否为主动管理)',
    '是否内地互认基金',
    '是否指数基金',
    '是否养老目标基金',
    '是否避险策略基金',
    '是否ETF基金',
    '是否ETF联接基金',
    '是否开放申赎',
    '是否存在业绩基准',
    '是否存在信用及流动性风险',
    '是否上市交易',
    '是否存在特殊交易',
    '是否现金管理产品',
  ];

  const arrNoOneTow = ['发行机构提前终止权标识', '客户赎回权标识', '产品增信标识'];

  const moneyArr = ['投资管理风险准备金'];

  // 词汇替换
  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (arrNoOneTow.includes(val2)) {
      return handleUpdateNameValueNoOneTwo(val);
    } else if (moneyArr.includes(val2)) {
      return handleChangeThousands(val);
    } else if (typeof val === 'number') {
      return val.toString();
    } else {
      return val;
    }
  };

  return (
    <>
      <h3 style={{ fontSize: '20px', padding: '0 0 10px 5px', fontWeight: 'bold' }}>监管要素</h3>
      {handleIfProductOverviewMessage('FISP', fispItemInfo, RC.fispItemInfo, handleChangeWords)}
      {handleIfProductOverviewMessage(
        '人行',
        pbocReportItemInfo,
        RC.pbocReportItemInfo,
        handleChangeWords,
      )}
      {handleIfProductOverviewMessage('中基协', amacItemInfo, RC.amacItemInfo, handleChangeWords)}
      {handleIfProductOverviewMessage('中证协', sacItemInfo, RC.sacItemInfo, handleChangeWords)}
      {handleIfProductOverviewMessage(
        '资管月周报',
        cusWeekMonthItemInfo,
        RC.cusWeekMonthItemInfo,
        handleChangeWords,
      )}
      {handleIfProductOverviewMessage(
        '综合金融月报',
        financeMonthItemInfo,
        RC.financeMonthItemInfo,
        handleChangeWords,
      )}
      {handleIfProductOverviewMessage(
        '个性化内部报表',
        personItemInfo,
        RC.personItemInfo,
        handleChangeWords,
      )}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard }) => ({
    productBillboard,
  }))(ProductMessageRegulationConstituents),
);

export default WrappedIndexForm;

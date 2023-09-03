/**
 * 产品看板-查看产品-产品数据-参数设置
 */
import React, { useContext, useEffect } from 'react';
import { Table, Button, message, Row, Col, Tooltip } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleAddCustomTooltip,
  handleChangeNumberToFloat,
  handleChangeThousands,
  handleChangeLabel,
} from '@/pages/productBillboard/baseFunc';

const ProductMessageArgumentsSet = ({ dispatch, productBillboard: { AS } }) => {
  const { proCodeArguments, codeListCodeData, codeListData } = useContext(MyContext); // 子组件接受的数据

  const valCheckSheet = {
    valWay: '估值方法',
    valRate: '估值频率',
    checkSheetRate: '对账频率',
    netValRate: '净值披露频率',
    netValAccuracy: '净值精度',
  };

  const openParam = {
    subscribeRate: '申购费率',
    subscribeRateAmount: '单一费率%',
    diffRateDivideStandardS: '差异化费率的划分标准(申购)',
    redeemRate: '赎回费率',
    redeemRateAmount: '单一费率%',
    diffRateDivideStandardR: '差异化费率的划分标准(赎回)',
    redeemFeeBelong: '赎回费归属',
    closePeriod: '封闭期',
    closePeriodMonth: '月份',
    closePeriodSupply: '封闭期补充说明',
    openRate: '开放频率',
    openRateExplain: '开放频率解释说明',
    tempOpenPeriod: '是否设置临时开放期',
    tempOpenSupply: '临时开放期补充说明',
    otherRedeemLimit: '其他赎回限制',
    otherRedeemLimitSupply: '其他赎回限制补充说明',
    refuseHandleWay: '拒绝或暂停参与、暂停退出的情形及处理方式',
    allowShareTransfer: '运作期间是否允许份额转让',
    applyConfirmDays: '申请确认天数	',
  };

  const investParam = {
    investStrategy: '投资策略',
    investTarget: '投资目标',
    contractInvestRange: '合同规定的主要投资范围及投资组合比例',
    investRange: '投资范围',
    standardization: '标准化',
    noStandardization: '非标准化',
    assetProductOther: '资产管理产品及其他',
    existCompareBaseRate: '是否有业绩比较基准',
    compareBaseRateA: '业绩基准1',
    compareBaseRateB: '业绩基准2',
    securitiesBusiSituation: '说明参与证券回购、融资融券、转融通、场外证券业务的情况',
    directInvestBank: '是否直接投资商业银行信贷资产',
    warningLine: '预警线',
    warnLineUnitNetval: '预警线对应的基金单位净值',
    warningLineOther: '预警线其他',
    stopLossLine: '止损线',
    lossLineUnitNetval: '止损线对应的基金单位净值',
    lossLineOther: '止损线其他',
    addArrange: '达到预警线、止损线时有无追加安排',
    investLevRate: '投资杠杆率上限(总资产/净资产)',
    openPositionPeriod: '建仓期',
    useQuantInvest: '是否采用量化投资',
    useHedgeStrategy: '是否采用对冲策略',
    restrictionStockMin: '股票类(最低)',
    restrictionStockMax: '股票类(最高)',
    restrictionHkstockMin: '香港市场的股票类(最低)',
    restrictionHkstockMax: '香港市场的股票类(最高)',
    restrictionBondMin: '债券类(最低)',
    restrictionBondMax: '债券类(最高)',
    restrictionCurrencyMin: '货币类(最低)',
    restrictionCurrencyMax: '货币类(最高)',
  };

  // 表格词汇替换
  const randerFunc = {
    render: text => {
      return handleUpdateNameValue(text);
    },
  };

  // 表头(分红规则)
  const bonusRateRemindRules = [
    {
      title: '分红方式',
      key: 'bonusType',
      dataIndex: 'bonusType',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '分红频率',
      key: 'rateValue',
      dataIndex: 'rateValue',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '(频率)单位',
      key: 'rateUnit',
      dataIndex: 'rateUnit',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '起始日期',
      key: 'startDate',
      dataIndex: 'startDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '结束日期',
      key: 'endDate',
      dataIndex: 'endDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '节假日调整规则',
      key: 'holidayAdjustRule',
      dataIndex: 'holidayAdjustRule',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 表头(分红日期)
  const bonusRateRemindDates = [
    {
      title: '分红方式',
      key: 'bonusType',
      dataIndex: 'bonusType',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '分红日期',
      key: 'remindDate',
      dataIndex: 'remindDate',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 表头(信披规则)
  const infoPublishRateRules = [
    {
      title: '披露对象',
      key: 'publishTarget',
      dataIndex: 'publishTarget',
      align: 'center',
      ...randerFunc,
      width: 400,
    },
    {
      title: '披露类型',
      key: 'publishType',
      dataIndex: 'publishType',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '披露频率',
      key: 'rateValue',
      dataIndex: 'rateValue',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '(频率)单位',
      key: 'rateUnit',
      dataIndex: 'rateUnit',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '起始日期',
      key: 'startDate',
      dataIndex: 'startDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '结束日期',
      key: 'endDate',
      dataIndex: 'endDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '节假日调整规则',
      key: 'holidayAdjustRule',
      dataIndex: 'holidayAdjustRule',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 表头(信披日期)
  const infoPublishRateDates = [
    {
      title: '披露对象',
      key: 'publishTarget',
      dataIndex: 'publishTarget',
      align: 'center',
      ...randerFunc,
      width: 400,
    },
    {
      title: '披露类型',
      key: 'publishType',
      dataIndex: 'publishType',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '披露日期',
      key: 'remindDate',
      dataIndex: 'remindDate',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 表头(开放规则)
  const openParamRules = [
    {
      title: '开放状态',
      key: 'openStatus',
      dataIndex: 'openStatus',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '开放天数',
      key: 'openDays',
      dataIndex: 'openDays',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '披露频率',
      key: 'rateValue',
      dataIndex: 'rateValue',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '(频率)单位',
      key: 'rateUnit',
      dataIndex: 'rateUnit',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '起始日期',
      key: 'startDate',
      dataIndex: 'startDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '结束日期',
      key: 'endDate',
      dataIndex: 'endDate',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '节假日调整规则',
      key: 'holidayAdjustRule',
      dataIndex: 'holidayAdjustRule',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 表头(开放日期)
  const openParamDates = [
    {
      title: '开放状态',
      key: 'openStatus',
      dataIndex: 'openStatus',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '开放天数',
      key: 'openDays',
      dataIndex: 'openDays',
      align: 'center',
      ...randerFunc,
    },
    {
      title: '开放日期',
      key: 'remindDate',
      dataIndex: 'remindDate',
      align: 'center',
      ...randerFunc,
    },
  ];

  // 子表单表格渲染
  const handleAddTable = (dataTitle, columns, data) => {
    if (data) {
      return (
        <div className={styles.dataTitle} style={{ paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '16px', padding: '0 0 0 5px', fontWeight: 'bold' }}>
            {dataTitle}
          </h2>
          <Table
            size="small"
            dataSource={data} // 表数据源
            columns={columns}
          />
        </div>
      );
    }
  };

  // 子表单组表格渲染
  const handleAddTables = data => {
    let arr = [];
    if (data) {
      for (let key of data) {
        arr.push(
          handleAddTable('信披参数(信披规则)', infoPublishRateRules, key?.remindRules),
          handleAddTable('信披参数(信披日期)', infoPublishRateDates, key?.remindDates),
        );
      }
    }
    return arr;
  };

  // 子表单组数据渲染
  const handleAddOpenParam = data => {
    let arr = [];
    if (data) {
      for (let key of data) {
        arr.push(handleIfProductOverviewMessage('开放参数', openParam, key, handleChangeWords));
        arr.push(handleAddTable('开放参数(开放规则)', openParamRules, key?.remindRules));
        arr.push(handleAddTable('开放参数(开放日期)', openParamDates, key?.remindDates));
      }
    }
    return arr;
  };

  const handleAddInvestParam = data => {
    let arr = [];
    if (data) {
      for (let key of data) {
        arr.push(handleIfProductOverviewMessage('投资参数', investParam, key, handleChangeWords));
      }
    }
    return arr;
  };

  /**
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   * @param {Object} data 数据源
   * @param {Function} changWords 词汇替换方法
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName, data, changWords) => {
    if (JSON.stringify(data) !== '{}') {
      return handleAddBaseData(dataTitle, dataName, data, changWords);
    }
  };

  // 子表单详情渲染
  const handleAddBaseData = (dataTitle, dataName, data, changWords) => {
    let arr = [];
    if (data) {
      for (let key in data) {
        if (typeof dataName[key] !== 'undefined') {
          if (dataName[key].length <= 12) {
            arr.push(
              <Col span={6} className={styles.rowColBody}>
                <span className={styles.dataName}>{dataName[key]} : </span>
                {handleAddCustomTooltip(changWords(data[key], dataName[key]), 15)}
              </Col>,
            );
          } else {
            arr.push(
              <Col span={18} className={styles.rowColBody}>
                <span className={styles.dataName}>{dataName[key]} : </span>
                {handleAddCustomTooltip(changWords(data[key], dataName[key]), 15)}
              </Col>,
            );
          }
        }
      }
      return (
        <div className={styles.dataTitle}>
          <h2 style={{ fontSize: '20px', padding: '0 0 10px 5px', fontWeight: 'bold' }}>
            {dataTitle}
          </h2>
          <Row>{arr}</Row>
        </div>
      );
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
      return arr;
    } else if (codeListCodeData.includes(val)) {
      return codeListData[val];
    } else {
      return handleChangeLabel(val);
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
    '估值方法',
    '估值频率',
    '对账频率',
    '净值披露频率',
    '开放参数',
    '差异化费率的划分标准(申购)',
    '差异化费率的划分标准(赎回)',
    '赎回费率',
    '赎回费归属',
    '封闭期',
    '开放频率',
    '其他赎回限制',
    '投资范围',
    '标准化',
    '非标准化',
    '资产管理产品及其他',
    '申购费率',
  ];

  const arrYesAndNo = [
    '是否设置临时开放期',
    '运作期间是否允许份额转让',
    '是否有业绩比较基准',
    '是否直接投资商业银行信贷资产',
    '是否采用量化投资',
    '是否采用对冲策略',
  ];

  const arrNoOneTow = ['预警线', '止损线', '达到预警线、止损线时有无追加安排'];

  // 词汇替换
  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (val2 === '投资杠杆率上限(总资产/净资产)') {
      return handleChangeThousands(val);
    } else if (arrNoOneTow.includes(val2)) {
      return handleUpdateNameValueNoOneTwo(val);
    } else if (typeof val === 'number') {
      return handleChangeNumberToFloat(val);
    } else {
      return val;
    }
  };

  return (
    <>
      <h3 style={{ fontSize: '20px', padding: '0 0 10px 5px', fontWeight: 'bold' }}>参数设置</h3>
      {handleIfProductOverviewMessage(
        '估值对账参数',
        valCheckSheet,
        AS?.valCheckSheet,
        handleChangeWords,
      )}
      {handleAddTable('分红参数(分红规则)', bonusRateRemindRules, AS?.bonusRate?.remindRules)}
      {handleAddTable('分红参数(分红日期)', bonusRateRemindDates, AS?.bonusRate?.remindDates)}
      {handleAddTables(AS?.infoPublishRate)}
      {handleAddOpenParam(AS?.openParam)}
      {handleAddInvestParam(AS?.investParam)}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard }) => ({
    productBillboard,
  }))(ProductMessageArgumentsSet),
);

export default WrappedIndexForm;

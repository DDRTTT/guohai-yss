/**
 * 产品看板-查看产品-产品数据-其他信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Spin,
  Modal,
  Input,
  DatePicker,
  Select,
  Tooltip,
  Form,
  message,
} from 'antd';
import moment from 'moment/moment';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleAddAllData,
  handleAddCustomTooltip,
  handleAddModalColSelect,
  handleAddModalColInput,
  handleAddModalColNumber,
  handleAddModalColDate,
  handleChangeNumberToFloat,
  handleChangeThousands,
} from '@/pages/productBillboard/baseFunc';

const { confirm } = Modal;

const ProductMessageOther = ({
  dispatch,
  form: { validateFieldsAndScroll, getFieldDecorator, validateFields, getFieldValue },
  productBillboard: { productOverviewMessage },
}) => {
  const {
    proTypeArguments,
    proCodeArguments,
    codeListData,
    codeListCodeData,
    proDictsObj,
  } = useContext(MyContext); // 子组件接受的数据

  // 其他信息(栅格信息) 100%
  const otherInformationData = {
    conflictInterest: '利益冲突情形',
    contractChange: '合同变更的方式',
    endOfContract: '合同终止情形',
    // clientMin: '客户过少期限(天)',
    // shareMin: '份额过低期限(天)',
    assetJudgmentTypeMin: '资产过低判断类型',
    assetMin: '最低资产限额',
    mediationMethods: '争议调解方式',
    contractCondition: '合同生效条件',
    contractSigningMethod:'合同签署方式',
    contractConditionOther: '附加条件',
    otherMatters: '其他事项内容',
  };

  // 动态渲染:其他方式
  const contractChangeOtherData = {
    contractChangeOther: '其他方式',
  };

  // 动态渲染:附加情形
  const endOfContractOtherData = {
    endOfContractOther: '附加情形',
  };

  /**
   *获取产品信息(栅格信息)
   *@param {String} code 产品代码
   *@param {String} type 参数值
   */
  const handleGetProductOverivewMessage = (code, type) => {
    dispatch({
      type: 'productBillboard/overviewMessageListData',
      payload: { proCode: code, type: type },
      callback: res => {
        if (res) {
          handleUpOldData(res);
        }
      },
    });
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
      return val;
    }
  };

  /**
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName, wordChange) => {
    return !productOverviewMessage ? '' : handleAddAllData(dataTitle, dataName, productOverviewMessage, wordChange);
  };

  /** `
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
            <span className={styles.dataName}>{handleAddCustomTooltip(dataName[key], 15)}：</span>
            {handleAddCustomTooltip(wordChange(data[key], dataName[key]), 15)}
          </Col>,
        );
      }
      if (typeof contractChangeOtherData[key] !== 'undefined') {
        if (data.contractChange && data.contractChange.indexOf('HTBG_13') > -1) {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>
                {handleAddCustomTooltip(contractChangeOtherData[key], 15)}：
              </span>
              {handleAddCustomTooltip(wordChange(data[key], contractChangeOtherData[key]), 15)}
            </Col>,
          );
        }
      }
      if (typeof endOfContractOtherData[key] !== 'undefined') {
        if (data.endOfContract && data.endOfContract.indexOf('HTZZ_15') > -1) {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>
                {handleAddCustomTooltip(endOfContractOtherData[key], 15)}：
              </span>
              {handleAddCustomTooltip(wordChange(data[key], endOfContractOtherData[key]), 15)}
            </Col>,
          );
        }
      }
    }
    return (
      <div className={styles.dataTitle}>
        <Row>
          <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>
            {dataTitle}
          </h3>
          {rowColData}
        </Row>
      </div>
    );
  };

  const arrDicts = ['利益冲突情形', '合同变更的方式', '合同终止情形', '争议调解方式'];

  // 是否下拉框
  const yseAndNo = [
    {
      code: '1',
      name: '是',
    },
    {
      code: '0',
      name: '否',
    },
  ];

  // 资产过低判断类型
  const assetJudgmentTypeMinDicts = [
    {
      code: '1',
      name: '金额',
    },
    {
      code: '0',
      name: '份额',
    },
  ];

  // 合同生效条件
  const contractConditionDicts = [
    {
      code: '1',
      name: '附条件生效',
    },
    {
      code: '0',
      name: '签署即生效',
    },
  ];

  // 合同签署方式
  const contractSigningMethodDicts = [
    {
      code: 'M003_1',
      name: '电子合同',
    },
    {
      code: 'M003_2',
      name: '纸质合同',
    },
  ];

  const handleAssetJudgmentTypeMinDicts = val => {
    if (val === '1') {
      return '金额';
    } else if (val === '0') {
      return '份额';
    } else return val;
  };

  const handleContractConditionDicts = val => {
    if (val === '1') {
      return '附条件生效';
    } else if (val === '0') {
      return '签署即生效';
    } else return val;
  };

  const handleContractSigningMethodDicts = val => {
    if (val === 'M003_1') {
      return '电子合同';
    } else if (val === 'M003_2') {
      return '纸质合同';
    } else return val;
  };

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (val2 === '资产过低判断类型') {
      return handleAssetJudgmentTypeMinDicts(val);
    } else if (val2 === '合同生效条件') {
      return handleContractConditionDicts(val);
    } else if (val2 === '合同签署方式') {
      return handleContractSigningMethodDicts(val);
    }else if (val2 === '最低资产限额') {
      return handleChangeThousands(val);
    } else if (typeof val === 'number') {
      return val.toString();
    } else return val;
  };

  return <>{handleIfProductOverviewMessage('其他信息', otherInformationData, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productBillboard, loading }) => ({
      productBillboard,
      listLoading: loading.effects['productBillboard/overviewMessageListData'],
    }))(ProductMessageOther),
  ),
);

export default WrappedIndexForm;

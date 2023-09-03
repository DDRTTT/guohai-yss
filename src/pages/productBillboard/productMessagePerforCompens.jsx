/**
 * 产品看板-查看产品-产品数据-业绩报酬信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Tooltip,
  Form,
  Button,
  Select,
  Spin,
  Modal,
  Input,
  DatePicker,
} from 'antd';
import moment from 'moment/moment';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleAddAllData,
  handleChangeNumberToFloat,
  handleChangeThousands,
  handleAddCustomTooltip,
} from './baseFunc';

const { confirm } = Modal;
const { TextArea } = Input;

const ProductMessagePerforCompens = ({
  dispatch,
  productBillboard: { productOverviewMessage },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 业绩报酬信息(栅格)
  const perforCompensData = {
    extractRemuneration: '是否提取业绩报酬',
    accruedTimePoint: '计提时点',
    accruedDatum: '计提基准',
    performanceAccruedDatum: '业绩报酬计提基准(%)',
    qita: '其他',
    accruedProportion: '计提比例(%)',
    extractFrequency: '提取频率是否大于或等于六个月',
    accruedProportionMax: '管理人最高业绩报酬计提比例(%)',
    explanation: '业绩报酬的其他解释说明',
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
   * 产品概述信息加载状态
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 标题数据源
   */
  const handleIfProductOverviewMessage = (dataTitle, dataName, wordChange) => {

    return !productOverviewMessage ? '' : handleAddAllData(dataTitle, dataName, productOverviewMessage, wordChange);
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
    }
    if (typeof dataTitle === 'string') {
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
    } else {
      return (
        <div className={styles.dataTitle}>
          <Row>{rowColData}</Row>
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

  const arrDicts = ['计提时点', '计提基准'];

  const arrYesAndNo = ['是否提取业绩报酬', '提取频率是否大于或等于六个月'];

  const thousands = ['管理人最高业绩报酬计提比例(%)', '业绩报酬计提基准(%)', '计提比例(%)'];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (thousands.includes(val2)) {
      return handleChangeThousands(val);
    } else {
      return val;
    }
  };

  return (
    <>{handleIfProductOverviewMessage('业绩报酬信息', perforCompensData, handleChangeWords)}</>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessagePerforCompens),
);

export default WrappedIndexForm;

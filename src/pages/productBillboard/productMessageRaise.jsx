/**
 * 产品看板-查看产品-产品数据-募集信息
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
  handleAddCustomTooltip,
  handleChangeNumberToFloat,
  handleChangeThousands,
} from './baseFunc';

const { confirm } = Modal;

const ProductMessageRaise = ({ dispatch, productBillboard: { productOverviewMessage } }) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 募集信息(栅格信息) 100%
  const raiseData = {
    // raiseAmountExpect: '预期募集金额(元)',
    // actualRaiseAmount: '实际募集金额(元)',
    // subsStart: '认购起点',
    minSubsAmount: '最低认购金额(元)',
    minAppendAmount: '最低追加金额(元)',
    minRaiseAmount: '最低募集金额(元)',
    maxRaiseAmount: '最高募集金额(元)',
    raiseSdate: '募集开始日(含)',
    raiseEdateExpect: '计划募集结束日(含)',
    raiseEdateActual: '实际募集结束日',
    raiseEdateDelayExpect: '调整后募集结束日(含)',
    raiseResult: '是否达到成立条件',
    subsRate: '认购费率',
    // contractSigningMethod: '合同签署方式',
    placingMethod: '配售方式',
    confirmPlacingMethod: '末日比例配售确认方式',
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
  const handleIfProductOverviewMessage = (dataTitle, dataName, changeWords) => {
    return !productOverviewMessage ? '' : handleAddAllData(dataTitle, dataName, productOverviewMessage, changeWords);
  };

  /** `
   * 信息渲染(公共)
   * @param {dataTitle} String 页标题
   * @param {dataName} Object 数据名称
   * @param {data} Object 数据源
   */
  const handleAddbaseData = (dataTitle, dataName, data, changeWords) => {
    const rowColData = [];
    for (const key in data) {
      if (typeof dataName[key] !== 'undefined') {
        rowColData.push(
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {changeWords(data[key], dataName[key])}
          </Col>,
        );
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

  // const arrDicts = ['合同签署方式', '配售方式', '末日比例配售确认方式', '认购费率'];
  const arrDicts = ['配售方式', '末日比例配售确认方式', '认购费率'];

  const arrYesAndNo = ['是否达到成立条件'];

  const thousands = [
    // '认购起点',
    // '预期募集金额(元)',
    // '实际募集金额(元)',
    '最低认购金额(元)',
    '最低追加金额(元)',
    '最低募集金额(元)',
    '最高募集金额(元)',
  ];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (thousands.includes(val2)) {
      return handleChangeThousands(val);
    } else if (typeof val === 'number') {
      return handleChangeNumberToFloat(val);
    } else {
      return val;
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
    if (val === '0') {
      return '否';
    } else if (val === '1') {
      return '是';
    } else {
      return val;
    }
  };

  return <>{handleIfProductOverviewMessage('募集信息', raiseData, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageRaise),
);

export default WrappedIndexForm;

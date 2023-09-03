/**
 * 产品看板-查看产品-产品数据-份额持有人大会及日常机构
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Col, Table, Button, Spin } from 'antd';
import moment from 'moment/moment';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleAddAllData } from './baseFunc'

const ProductMessageShareHolder = ({ dispatch, productBillboard: { productOverviewMessage } }) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  const pageDatas = {
    dailyOrg: '是否设立日常机构',
    dailyOrgContent: '日常机构议事内容',
    meeting: '是否设立持有人大会',
    meetingContent: '持有人大会议事内容',
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

  /** `
   * 信息渲染(公共)
   * @param {dataTitle} String 页标题
   * @param {dataName} Object 数据名称
   * @param {data} Object 数据源
   */
  const handleAddbaseData = (dataTitle, dataName, data, wordChange) => {
    const rowColData = [];
    for (const key in data) {
      if (dataName[key] === '是否设立日常机构') {
        console.log(dataName[key], data[key]);
        rowColData.push(
          <Col span={18} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {wordChange(data[key], dataName[key])}
          </Col>,
        );
      }
      if (dataName[key] === '日常机构议事内容' && data.dailyOrg === '1') {
        rowColData.push(
          <Col span={18} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {wordChange(data[key], dataName[key])}
          </Col>,
        );
      }
      if (dataName[key] === '是否设立持有人大会') {
        rowColData.push(
          <Col span={18} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {wordChange(data[key], dataName[key])}
          </Col>,
        );
      }
      if (dataName[key] === '持有人大会议事内容' && data.meeting === '1') {
        rowColData.push(
          <Col span={18} className={styles.rowColBody}>
            <span className={styles.dataName}>{dataName[key]}：</span>
            {wordChange(data[key], dataName[key])}
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

  // 份额持有人大会及日常机构(字典)
  const shareHolderData = ['持有人大会议事内容', '日常机构议事内容'];

  // 份额持有人大会及日常机构(是否)
  const shareHolderDataYesAndNo = ['是否设立持有人大会', '是否设立日常机构'];

  const handleChangeWords = (val, val2) => {
    if (shareHolderData.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (shareHolderDataYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (typeof val === 'number') {
      return val.toString();
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
    if (val === '1') {
      return '是';
    } else if (val === '0') {
      return '否';
    } else {
      return val;
    }
  };

  return <>{handleIfProductOverviewMessage('份额持有人大会及日常机构', pageDatas, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageShareHolder),
);

export default WrappedIndexForm;

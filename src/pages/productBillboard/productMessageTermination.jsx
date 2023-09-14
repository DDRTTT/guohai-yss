/**
 * 产品看板-查看产品-产品数据-终止信息
 */
import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleAddAllData } from './baseFunc'

const ProductMessageTermination = ({ dispatch, productBillboard: { productOverviewMessage } }) => {
  const {
    codeListData,
    codeListCodeData,
  } = useContext(MyContext); // 子组件接受的数据

  // 终止信息(栅格信息) 100%
  const overData = {
    proSdate: '产品终止日期',
    // contractSDate: '合同终止日期',
    causeTermination: '产品终止原因',
    // description: '具体描述',
    earlyTermination: '是否提前终止',
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
        if (dataName[key].length <= 12) {
          rowColData.push(
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>{dataName[key]} : </span>
              {wordChange(data[key], dataName[key])}
            </Col>,
          );
        } else {
          rowColData.push(
            <Col span={18} className={styles.rowColBody}>
              <span className={styles.dataName}>{dataName[key]} : </span>
              {wordChange(data[key], dataName[key])}
            </Col>,
          );
        }
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

  // const arrDicts = ['产品终止原因', '具体描述'];
  const arrDicts = ['产品终止原因'];

  const arrYesAndNo = ['是否提前终止'];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (typeof val === 'number') {
      return val.toString();
    } else {
      return val;
    }
  };

  return <>{handleIfProductOverviewMessage('终止信息', overData, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageTermination),
);

export default WrappedIndexForm;

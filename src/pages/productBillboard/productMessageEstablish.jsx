/**
 * 产品看板-查看产品-产品数据-成立信息
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
  handleAddModalColSelect,
  handleAddModalColInput,
  handleAddModalColNumber,
  handleAddModalColDate,
} from '@/pages/productBillboard/baseFunc';

const { confirm } = Modal;

const ProductMessageEstablish = ({
  dispatch,
  form: { validateFieldsAndScroll, getFieldDecorator, validateFields, getFieldValue },
  productBillboard: { productOverviewMessage },
}) => {
  const {
    proTypeArguments,
    proCodeArguments,
    codeListData,
    codeListCodeData,
    codeListOrgCodeData,
    codeListOrgData,
    proDictsObj,
    allDictdOrgObj,
  } = useContext(MyContext); // 子组件接受的数据

  // 成立信息(栅格信息-集合) 100%
  const setUpData = {
    assetVerifiedDate: '取得验资报告日',
    verfiedOrgId: '验资机构名称',
    proCdate: '产品成立日',
    proEdate: '产品到期日',
    establishScale: '成立规模',
    proRecodeName:'备案名称',
    proRecodeCode: '备案编码',
    // beginRecodeDate: '初始备案日期',
    completeRecodeDate: '备案日期',
  };

  // 成立信息(栅格信息) 100%
  const setUpNewData = {
    proCdate: '产品成立日',
    proEdate: '产品到期日',
    establishScale: '成立规模',
    proRecodeName:'备案名称',
    proRecodeCode: '备案编码',
    // beginRecodeDate: '初始备案日期',
    completeRecodeDate: '备案日期',
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

  /**
   * 词汇替换(托管人,委托人)
   * @param {String} val 词汇值
   */
  const handleUpdateOrgName = val => {
    if (codeListOrgCodeData.includes(val)) {
      return codeListOrgData[val];
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

  const arrDicts = [];

  const arrOrgDicts = ['验资机构名称'];

  const arrYesAndNo = [];

  const handleChangeWords = (val, val2) => {
    if (arrDicts.includes(val2)) {
      return handleUpdateNameValue(val);
    } else if (arrOrgDicts.includes(val2)) {
      return handleUpdateOrgName(val);
    } else if (arrYesAndNo.includes(val2)) {
      return handleUpdateNameValueYesAndNo(val);
    } else if (typeof val === 'number') {
      return val.toString();
    } else {
      return val;
    }
  };

  return (
    <>{handleIfProductOverviewMessage('成立信息', setUpData, handleChangeWords)}</>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productBillboard, loading }) => ({
      productBillboard,
      listLoading: loading.effects['productBillboard/overviewMessageListData'],
    }))(ProductMessageEstablish),
  ),
);

export default WrappedIndexForm;

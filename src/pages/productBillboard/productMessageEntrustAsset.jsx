/**
 * 产品看板-查看产品-产品数据-委托财产
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Spin,
  Modal,
  Tooltip,
  Select,
  Input,
  Form,
  DatePicker,
} from 'antd';
import moment from 'moment/moment';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleAddCustomTooltip,
  handleAddModalColSelect,
  handleAddModalColInput,
  handleAddModalColNumber,
  handleAddModalColDate,
  handleChangeNumberToFloat,
  handleChangeThousands,
} from '@/pages/productBillboard/baseFunc';

const { confirm } = Modal;

const ProductMessageEntrustAsset = ({
  dispatch,
  form: { validateFieldsAndScroll, getFieldDecorator, validateFields, getFieldValue },
  productBillboard: { productOverviewMessage },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 委托财产(栅格信息) 100% -单一产品展示
  const entrustAssetData = {
    typeOfEntrustedAsset: '委托资产类型',
    commissionAmount: '金额(元)',
    consignorTypeSome: '委托人是否为管理人懂事、监视、从业人员及其配偶',
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
    if (JSON.stringify(productOverviewMessage) === '{}') {
      return (
        <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>{dataTitle}</h3>
      );
    }
    return handleAddbaseData(dataTitle, dataName, productOverviewMessage, wordChange);
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

  const arrDicts = ['委托资产类型'];

  const arrYesAndNo = ['委托人是否为管理人懂事、监视、从业人员及其配偶'];

  const thousands = ['金额(元)'];

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

  return <>{handleIfProductOverviewMessage('委托财产', entrustAssetData, handleChangeWords)}</>;
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ productBillboard, loading }) => ({
      productBillboard,
      listLoading: loading.effects['productBillboard/overviewMessageListData'],
    }))(ProductMessageEntrustAsset),
  ),
);

export default WrappedIndexForm;

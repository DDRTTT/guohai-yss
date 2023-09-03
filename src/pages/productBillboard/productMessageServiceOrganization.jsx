/**
 * 产品看板-查看产品-产品数据-服务机构
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Col, Table, Button, Spin } from 'antd';
import moment from 'moment/moment';
import router from 'umi/router';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleAddCustomTooltip } from './baseFunc';

const ProductMessageServiceOrganization = ({
  dispatch,
  productBillboard: { productOverviewMessage },
}) => {
  const {
    proCodeArguments,
    codeListData,
    codeListCodeData,
    proDictsObj,
    codeListOrgCodeData,
    codeListOrgData,
    allDictdOrgObj,
  } = useContext(MyContext); // 子组件接受的数据

  // 服务机构(栅格信息) 100%
  const serviceOrganizationData = {
    registOrg: '注册登记机构',
    investOrg: '投资顾问机构',
    overseaInvest: '境外投资顾问',
    overseaTrustee: '境外托管人',
    lawOrg: '律师事务所',
    calOrg: '会计师事务所',
    guarantee: '保障义务人',
    fundAssurer: '基金保证人',
    outsourcing: '外包服务机构',
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
   * 服务机构跳转方法集合(暂跳看板主页)
   */
  const handleGoProductBillboard = val => {
    router.push(`/productDataManage/institutionalInfoManager/details?id=${val}`);
  };

  /**
   * 信息渲染(服务机构)
   * @param {String} dataTitle 页标题
   * @param {Object} dataName 数据名称
   */
  const handleAddServiceOrganizationData = (dataTitle, data) => {
    const rowColData = [];
    if (data && +data !== 0) {
      for (const i of data) {
        const arr = [];
        arr.push(
          <Row style={{ marginBottom: '20px' }}>
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>服务机构类型 : </span>
              {handleUpdateNameValue(i.orgType)}
            </Col>
            <Col
              span={6}
              style={{ cursor: 'pointer' }}
              className={styles.serviceOrganizationRowColBody}
              onClick={() => handleGoProductBillboard(i.orgId)}
            >
              <span className={styles.dataName}>服务机构名称 : </span>
              {handleUpdateOrgName(i.orgId)}
            </Col>
            <Col span={6} className={styles.rowColBody}>
              <span className={styles.dataName}>服务机构代码 : </span>
              {i.creditCode}
            </Col>
            {i.serviceType ? (
              <Col span={6} className={styles.rowColBody}>
                <span className={styles.dataName}>服务类型 : </span>
                {handleAddCustomTooltip(handleUpdateNameValue(i.serviceType), 15)}
              </Col>
            ) : (
              ''
            )}
            <Col span={18} className={styles.rowColBody}>
              <span className={styles.dataName}>备注 : </span>
              {i.remark}
            </Col>
          </Row>,
        );
        rowColData.push(...arr);
      }
    } else {
      rowColData.push(
        <Row style={{ marginBottom: '20px' }}>
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>服务机构类型 : </span>
          </Col>
          <Col
            span={6}
            style={{ cursor: 'pointer' }}
            className={styles.serviceOrganizationRowColBody}
            onClick={() => handleGoProductBillboard(i.orgId)}
          >
            <span className={styles.dataName}>服务机构名称 : </span>
          </Col>
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>服务机构代码 : </span>
          </Col>
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>服务类型 : </span>
          </Col>
          <Col span={18} className={styles.rowColBody}>
            <span className={styles.dataName}>备注 : </span>
          </Col>
        </Row>,
      );
    }

    return (
      <div className={styles.dataTitle}>
        <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>{dataTitle}</h3>
        {rowColData}
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

  return <>{productOverviewMessage ? handleAddServiceOrganizationData('服务机构', productOverviewMessage.rows) : ''}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageServiceOrganization),
);

export default WrappedIndexForm;

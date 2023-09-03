/**
 * 产品看板-查看产品-产品数据-下属产品
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Spin } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleChangeNumberToFloat,
  handleChangeThousands,
} from '@/pages/productBillboard/baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const ProductMessageProGrade = ({
  dispatch,
  listLoading,
  productBillboard: { productOverviewMessage },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 表头数据(下属产品)
  const proGradeColumns = [
    {
      title: '分级名称',
      dataIndex: 'gradeName',
      key: 'gradeName',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '份额代码',
      dataIndex: 'shareCode',
      key: 'shareCode',
      ...tableRowConfig,
    },
    {
      title: '分级简称',
      dataIndex: 'gradeShortName',
      key: 'gradeShortName',
      ...tableRowConfig,
    },
    {
      title: '分级类别',
      dataIndex: 'shareTypeName',
      key: 'shareTypeName',
      ...tableRowConfig,
    },
    {
      title: '业绩比较基准',
      dataIndex: 'compareBaseRate',
      key: 'compareBaseRate',
      ...tableRowConfig,
    },
    // {
    //   title: '预期募集金额(元)',
    //   dataIndex: 'raiseAmount',
    //   key: 'raiseAmount',
    //   render: val => {
    //     return handleChangeThousands(val);
    //   },
    // },
    // {
    //   title: '预期年化收益率(%)',
    //   dataIndex: 'expYearYield',
    //   key: 'expYearYield',
    //   render: val => {
    //     return handleChangeNumberToFloat(val);
    //   },
    // },
  ];

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
   *获取产品信息(栅格信息)
   *@param {String} code 产品代码
   *@param {String} type 参数值
   */
  const handleGetProductOverivewMessage = (code, type) => {
    dispatch({
      type: 'productBillboard/overviewMessageListData',
      payload: { proCode: code, type: type },
    });
  };

  /**
   * 表格渲染(自有资金参与)
   * @param {String} dataTitle 页标题
   * @param {String} columns 表头数据
   * @param {String} keyId 表id
   * @param {String} scroll 表格内宽
   */
  const handleAddNewTable = (dataTitle, columns, keyId, scroll, pagination) => {
    if (JSON.stringify(productOverviewMessage) === '{}') {
      return (
        <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>{dataTitle}</h3>
      );
    } else if (productOverviewMessage) {
      return (
        <>
          <h3 className={styles.baseTableTitle}>{dataTitle}</h3>
          <Table
            style={{ paddingLeft: '3%' }}
            pagination={false}
            // rowSelection={rowSelection} // 开启checkbox多选框
            loading={listLoading} // 加载中效果
            rowKey={record => record[keyId]} // key值
            pagination={pagination} // 分页栏
            columns={columns}
            dataSource={productOverviewMessage.rows}
            scroll={{ x: scroll }}
          />
        </>
      );
    }
  };

  return <>{handleAddNewTable('下属产品', proGradeColumns, 'id')}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageProGrade),
);

export default WrappedIndexForm;

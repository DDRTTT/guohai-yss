/**
 * 产品看板-查看产品-产品数据-清盘信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Spin, Row, Col } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const ProductMessageLiquidation = ({
  dispatch,
  listLoading,
  productBillboard: { productOverviewMessage },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 表头数据(清盘信息)
  const liquidationColumns = [
    {
      title: '清算起始日',
      dataIndex: 'clearStartDate',
      key: 'clearStartDate',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '清算结束日',
      dataIndex: 'clearAbortDate',
      key: 'clearAbortDate',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '清盘原因',
      dataIndex: 'clearReasonName',
      key: 'clearReasonName',
      ...tableRowConfig,
      width: 140,
    },
    // {
    //   title: '具体描述',
    //   dataIndex: 'detailReason',
    //   key: 'detailReason',
    //   ...tableRowConfig,
    //   width: 140,
    // },
    {
      title: '已清算规模',
      dataIndex: 'clearedScale',
      key: 'clearedScale',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '是否清算完成',
      dataIndex: 'clearCompleteName',
      key: 'clearCompleteName',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '无法清算的原因',
      dataIndex: 'unclearReason',
      key: 'unclearReason',
      ...tableRowConfig,
      width: 140,
    },
  ];

  /**
   * 词汇替换
   * @param {String} val 词汇字典数据源
   */
  const handleUpdateNameValue = val => {
    if (typeof val === 'string') {
      if (codeListCodeData.includes(val)) {
        return codeListData[val];
      } else {
        if (val === '1') {
          return '是';
        } else if (val === '0') {
          return '否';
        } else {
          return val;
        }
      }
    } else if (Array.isArray(val)) {
      let arr = [];
      for (let key in val) {
        if (codeListCodeData.includes(val[key])) {
          arr.push(codeListData[val[key]]);
        } else {
          return val;
        }
      }
      return arr;
    } else {
      return val;
    }
  };

  /**
   * 表格渲染(自有资金参与)
   * @param {String} dataTitle 页标题
   * @param {String} columns 表头数据
   * @param {String} keyId 表id
   * @param {String} scroll 表格内宽
   */
  const handleAddNewTable = (dataTitle, columns, keyId, pagination) => {
    if (JSON.stringify(productOverviewMessage) === '{}') {
      return (
        <h3 style={{ fontSize: '20px', paddingBottom: '10px', fontWeight: 'bold' }}>{dataTitle}</h3>
      );
    } else if (productOverviewMessage) {
      let arr = [
        <Row>
          <Col span={6} className={styles.rowColBody}>
            <span className={styles.dataName}>是否延期清盘 : </span>
            {productOverviewMessage.delayClear === 1 ? '是' : '否'}
          </Col>
        </Row>,
      ];
      arr.push(
        <Table
          style={{ paddingLeft: '3%' }}
          pagination={pagination}
          loading={listLoading} // 加载中效果
          rowKey={record => record[keyId]} // key值
          columns={columns}
          dataSource={productOverviewMessage.rows}
          scroll={{ x: true }}
        />,
      );
      return (
        <>
          <h3 className={styles.baseTableTitle}>{dataTitle}</h3>
          {arr}
        </>
      );
    }
  };

  return <>{handleAddNewTable('清盘信息', liquidationColumns, 'id', pagination)}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageLiquidation),
);

export default WrappedIndexForm;

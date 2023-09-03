/**
 * 产品看板-查看产品-产品数据-自有资金参与信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Spin } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { handleChangeNumberToFloat, handleChangeThousands } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const ProductMessageOwnFunds = ({
  dispatch,
  listLoading,
  productBillboard: { productOverviewMessage },
}) => {
  const { proCodeArguments, codeListData, codeListCodeData, proDictsObj } = useContext(MyContext); // 子组件接受的数据
  const pageNumData关联方 = useRef(1);
  const pageSizeData关联方 = useRef(10);
  const totalData关联方 = useRef();

  // 表头数据(自有资金参与信息)
  const ownFundsColumns = [
    {
      title: '自有资金投资金额 (元)',
      dataIndex: 'selfMoneyAmount',
      key: 'selfMoneyAmount',
      render: val => {
        return handleChangeThousands(val);
      },
      align: 'right',
    },
    {
      title: '自有资金投资比例 (%)',
      dataIndex: 'selfMoneyRate',
      key: 'selfMoneyRate',
      render: val => {
        return handleChangeThousands(val);
      },
      align: 'right',
    },
    {
      title: '管理人附属机构自有资金是否参与',
      dataIndex: 'isParticipate',
      key: 'isParticipate',
      ...tableRowConfig,
    },
    {
      title: '自有资金认购份额',
      dataIndex: 'selfMoneySubsQuota',
      key: 'selfMoneySubsQuota',
      ...tableRowConfig,
      align: 'right',
    },
    {
      title: '自有资金参与日',
      dataIndex: 'participationDay',
      key: 'participationDay',
      ...tableRowConfig,
    },
  ];

  /**
   * 请求:关联方参与表格数据
   * @method handleGetListData
   */
  const handleGetListData = () => {
    dispatch({
      type: 'productBillboard/overviewMessageListData',
      payload: {
        proCode: proCodeArguments,
        pageNum: pageNumData关联方.current,
        pageSize: pageSizeData关联方.current,
        type: 'ownFunds',
      },
    });
  };

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
   * 当前页码变更(产品看板)
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataPageNum = pageNum => {
    pageNumData关联方.current = pageNum;
    handleGetListData();
  };

  /**
   * 页码属性变更(关联方)
   * @method  handleUpdataPageSize
   * @param   {pageSize}     string    表格行数据
   * @return  {string}
   */
  const handleUpdataPage = (current, pageSize, pageNum) => {
    pageSizeData关联方.current = pageSize;
    handleGetListData();
  };

  // 页码属性设置(关联方)
  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPage,
    onChange: handleUpdataPageNum,
    current: pageNumData关联方.current,
    total: productOverviewMessage.total,
    showTotal: () => {
      return `共 ${productOverviewMessage.total} 条数据`;
    },
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

  return <> {handleAddNewTable('自有资金参与信息', ownFundsColumns, 'id')}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/overviewMessageListData'],
  }))(ProductMessageOwnFunds),
);

export default WrappedIndexForm;

// 产品看板-查看产品-产品数据-分红明细
import React, { useContext, useEffect } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination, moneyRender, handleAddTooltip } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Table } from '@/components';

const BonusOfDetail = ({ dispatch, listLoading, productBillboard: { bonusOfDetailData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据

  // 获取分红明细信息表格
  const handleGetTableData = () => {
    dispatch({
      type: 'productBillboard/getBonusOfDetailFunc',
      payload: proCodeArguments,
    });
  };

  // 表头数据
  const columns = [
    {
      title: '分配日期',
      dataIndex: 'allocateDate',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '分配基数',
      dataIndex: 'allocateBase',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '应分配本金(元)',
      dataIndex: 'allocateCapital',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '应分配收益(元)',
      dataIndex: 'allocateProfit',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '实际分配本金(元)',
      dataIndex: 'actualAllocateCapital',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '实际分配收益(元)',
      dataIndex: 'actualAllocateProfit',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '实际分配日期',
      dataIndex: 'actualAllocateDate',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '单位产品分配收益(元)',
      dataIndex: 'proAllocateProfit',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '现金分配金额(元)',
      dataIndex: 'cashAllocateMoney',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '再投资金额(元)',
      dataIndex: 'reinvestmentMoney',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
    {
      title: '是否发生延期兑付',
      dataIndex: 'isDelayedPayment',
      sorter: false,
      width: 140,
      render: val => {
        return val === '1' ? handleAddTooltip('是') : val === '0' ? handleAddTooltip('否') : '';
      },
    },
    {
      title: '延期分配本金(元)',
      dataIndex: 'deferredPrincipal',
      ...moneyRender,
      width: 140,
      align: 'right',
    },
  ];

  // 渲染表格数据
  const handleAddTable = () => {
    return (
      <Table
        ellipsis="true"
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        dataSource={bonusOfDetailData} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
        scroll={{ x: 2400 }}
      />
    );
  };
  useEffect(() => {
    handleGetTableData(); // 请求:获取分红明细表格数据
  }, []);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/getBonusOfDetailFunc'],
  }))(BonusOfDetail),
);

export default WrappedIndexForm;

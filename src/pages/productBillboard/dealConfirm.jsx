/**
 * 产品看板-查看产品-产品数据-交易确认
 */
import React, { useContext, useEffect } from 'react';
import { Button, message, Row, Col, Table } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import {
  handleChangeNumberToFloat,
  handleChangeThousands,
  pagination,
  handleChangeLabel,
} from '@/pages/productBillboard/baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';

const DealConfirm = ({ dispatch, listLoading, productBillboard: { dealConfirmData } }) => {
  const { proCodeArguments, proTypeArguments } = useContext(MyContext); // 子组件接受的数据

  // 获取交易确认信息表格
  const handleGetDealConfirmData = () => {
    dispatch({
      type: 'productBillboard/dealConfirmFunc',
      payload: proCodeArguments,
    });
  };

  // 表头数据
  const columns = [
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: text => {
        if (text === 'T005_1') {
          return '缴付';
        } else if (text === 'T005_2') {
          return '提取';
        } else {
          return handleChangeLabel(text);
        }
      },
    },
    {
      title: '是否分期缴付',
      dataIndex: 'ifInstallment',
      key: 'ifInstallment',
      render: (text, record) => {
        if (record.businessType === 'T005_1') {
          if (text === '1') {
            return '是';
          } else if (text === '0') {
            return '否';
          } else {
            return handleChangeLabel(text);
          }
        } else {
          return handleChangeLabel(text);
        }
      },
    },
    {
      title: '是否起始运作',
      dataIndex: 'ifInitialOperate',
      key: 'ifInitialOperate',
      render: (text, record) => {
        if (record.businessType === 'T005_1') {
          if (text === '1') {
            return '是';
          } else if (text === '0') {
            return '否';
          } else {
            return handleChangeLabel(text);
          }
        } else {
          return handleChangeLabel(text);
        }
      },
    },
    {
      title: '确认金额',
      dataIndex: 'amount',
      key: 'amount',
      render: val => {
        return handleChangeThousands(val);
      },
      align: 'right',
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      ...tableRowConfig,
    },
    {
      title: '确认日期',
      dataIndex: 'affirmDate',
      key: 'affirmDate',
      ...tableRowConfig,
    },
  ];

  /**
   * 渲染表格数据
   * @method  handleAddTable
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={dealConfirmData} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
      />
    );
  };

  useEffect(() => {
    handleGetDealConfirmData();
  }, [proCodeArguments]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/dealConfirmFunc'],
  }))(DealConfirm),
);

export default WrappedIndexForm;

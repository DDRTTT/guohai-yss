/**
 * 产品看板-产品信息-评审记录
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Input, DatePicker, Row, Col, Tooltip } from 'antd';
import moment from 'moment/moment';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { Table } from '@/components';

const ReviewRecord = ({ dispatch, listLoading, productBillboard: { reviewRecordData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据

  // 获取评审记录信息表格
  const handleGetReviewRecordData = () => {
    dispatch({
      type: 'productBillboard/reviewRecordFunc',
      payload: proCodeArguments,
    });
  };

  // 表头数据
  const columns = [
    {
      title: '评审日期',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevelName',
      key: 'riskLevelName',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '资管委评审结果',
      dataIndex: 'assetReviewResultName',
      key: 'assetReviewResultName',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '产品委评审结果',
      dataIndex: 'proReviewResultName',
      key: 'proReviewResultName',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '是否上投决会',
      dataIndex: 'referendum',
      key: 'referendum',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '投决会日期',
      dataIndex: 'referendumDate',
      key: 'referendumDate',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '投决会结果',
      dataIndex: 'referendumResult',
      key: 'referendumResult',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: text => {
        if (text) {
          if (text.length > 10) {
            return (
              <Tooltip title={text}>
                <span>{text.substr(0, 20)}··· ···</span>
              </Tooltip>
            );
          } else return text;
        } else return handleChangeLabel(text);
      },
    },
  ];

  /**
   *@method handleAddTable 渲染表格数据
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={reviewRecordData} // 表数据源
        columns={columns} // 表头数据
        scroll={{ x: true }}
        style={{ margin: '0 26px 26px 26px', borderRadius: '7px 7px 0 0' }}
      />
    );
  };

  useEffect(() => {
    handleGetReviewRecordData();
  }, []);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/reviewRecordFunc'],
  }))(ReviewRecord),
);

export default WrappedIndexForm;

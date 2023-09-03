// 产品看板-查看产品-产品数据-投资者
import React, { useContext, useEffect, useRef } from 'react';
import {  Button, message } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination, moneyRender, handleAddTooltip } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { Table } from '@/components';

const Investor = ({ dispatch, listLoading, productBillboard: { dicts, investorData } }) => {
  const { proCodeArguments, proDictsObj } = useContext(MyContext); // 子组件接受的数据

  // 获取投资者信息表格
  const handleGetTableData = () => {
    dispatch({
      type: 'productBillboard/getInvestorFunc',
      payload: proCodeArguments,
    });
  };

  // 表头数据
  const columns = [
    {
      title: '投资者类型',
      dataIndex: 'investType',
      ...tableRowConfig,
      sorter: false,
      render: val => {
        if (val) {
          for (let key of proDictsObj.DI001) {
            if (key.code === val) {
              return handleAddTooltip(key.name);
            }
          }
        } else return handleChangeLabel(val);
      },
      width: 140,
    },
    {
      title: '投资者名称',
      dataIndex: 'investName',
      ...tableRowConfig,
      sorter: false,
      width: 400,
    },
    {
      title: '有效证件类型',
      dataIndex: 'cardType',
      ...tableRowConfig,
      sorter: false,
      render: val => {
        if (val) {
          for (let key of proDictsObj.DC001) {
            if (key.code === val) {
              return handleAddTooltip(key.name);
            }
          }
        } else return handleChangeLabel(val);
      },
      width: 140,
    },
    {
      title: '其他证件类型',
      dataIndex: 'otherCardType',
      ...tableRowConfig,
      sorter: false,
      render: val => {
        if (val) {
          for (let key of proDictsObj.DC001) {
            if (key.code === val) {
              return handleAddTooltip(key.name);
            }
          }
        } else return handleChangeLabel(val);
      },
      width: 140,
    },
    {
      title: '有效证件号码',
      dataIndex: 'cardCode',
      ...tableRowConfig,
      sorter: false,
      align: 'right',
      width: 140,
    },
    {
      title: '份额名称',
      dataIndex: 'shareName',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '持有份额(万份)',
      dataIndex: 'ownShareMyriad',
      ...tableRowConfig,
      sorter: false,
      ...moneyRender,
      align: 'right',
      width: 140,
    },
    {
      title: '持有资产净值(万元)',
      dataIndex: 'ownAssetNetvalMyriad',
      ...tableRowConfig,
      sorter: false,
      ...moneyRender,
      align: 'right',
      width: 160,
    },
    {
      title: '销售机构',
      dataIndex: 'sellOrg',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '是否为电子签名',
      dataIndex: 'isElecSign',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '是否为管理人关联方',
      dataIndex: 'isManageRelation',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '关联方类型',
      dataIndex: 'relationType',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
    {
      title: '联系电话',
      dataIndex: 'contactNum',
      ...tableRowConfig,
      sorter: false,
      align: 'right',
      width: 140,
    },
    {
      title: '联系地址',
      dataIndex: 'contactAddress',
      ...tableRowConfig,
      sorter: false,
      width: 140,
    },
  ];

  // 渲染表格数据
  const handleAddTable = () => {
    return (
      <Table
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        dataSource={investorData} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
        scroll={{ x: true }}
      />
    );
  };
  console.log(proDictsObj.DC001);
  useEffect(() => {
    handleGetTableData(); // 请求:获取投资者表格数据
  }, []);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/getInvestorFunc'],
  }))(Investor),
);

export default WrappedIndexForm;

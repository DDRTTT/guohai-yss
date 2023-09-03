/**
 * 产品看板-查看产品-产品数据-销售机构
 */
import React, { useContext, useEffect } from 'react';
import { Button, message } from 'antd';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { pagination } from './baseFunc';
import { Table } from '@/components';

const SalesOrganization = ({
  dispatch,
  listLoading,
  productBillboard: { salesOrganizationData },
}) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据

  /**
   * 获取账户信息表格
   */
  const handleGetSalesOrganizationData = () => {
    dispatch({
      type: 'productBillboard/salesOrganizationDataFunc',
      payload: proCodeArguments,
    });
  };

  /**
   * 跳转(托管行详情页)
   */
  const handleGoSell = record => {
    const id = record.id;
    router.push(`/productDataManage/salesOrgManagement/details?id=${id}`);
  };

  // 表头数据
  const columns = [
    {
      title: '销售机构名称',
      dataIndex: 'sellerName',
      key: 'sellerName',
      align: 'center',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '销售机构简称',
      dataIndex: 'sellerNameFull',
      key: 'sellerNameFull',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '销售商代码',
      dataIndex: 'sellerCode',
      key: 'sellerCode',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '销售商类型',
      dataIndex: 'sellerTypeName',
      key: 'sellerTypeName',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '渠道类型',
      dataIndex: 'channelTypeName',
      key: 'channelTypeName',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '中登结算地点',
      dataIndex: 'zdSettlePlaceName',
      key: 'zdSettlePlaceName',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '客户电话',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      ...tableRowConfig,
      align: 'right',
      width: 140,
    },
    {
      title: '网址',
      dataIndex: 'website',
      key: 'website',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleGoSell(record)}>
            查看
          </Button>
        </div>
      ),
    },
  ];

  /**
   * 渲染表格数据
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={salesOrganizationData} // 表数据源
        columns={columns} // 表头数据
        scroll={{ x: true }}
        style={{ margin: '10px 5% 0 5%', paddingBottom: '10px' }}
      />
    );
  };

  useEffect(() => {
    handleGetSalesOrganizationData();
  }, [proCodeArguments]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/salesOrganizationDataFunc'],
  }))(SalesOrganization),
);

export default WrappedIndexForm;

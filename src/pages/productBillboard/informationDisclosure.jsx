/**
 * 产品看板-查看产品-产品数据-信披
 */
import React, { useContext, useEffect } from 'react';
import { Button, message } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Table } from '@/components';

const InformationDisclosure = ({
  dispatch,
  listLoading,
  productBillboard: { informationDisclosureData },
}) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据

  /**
   *@method handleGetInformationDisclosureData 获取信披信息表格
   */
  const handleGetInformationDisclosureData = () => {
    dispatch({
      type: 'productBillboard/informationDisclosureFunc',
      payload: proCodeArguments,
    });
  };

  // 表头数据
  const columns = [
    {
      title: '信披事项',
      dataIndex: 'infoPublishItemName',
      key: 'infoPublishItemName',
      ...tableRowConfig,
    },
    {
      title: '披露对象',
      dataIndex: 'publishTargetName',
      key: 'publishTargetName',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '预计披露日期',
      dataIndex: 'predictPublishDate',
      key: 'predictPublishDate',
      ...tableRowConfig,
    },
    {
      title: '披露结果',
      dataIndex: 'publishResult',
      key: 'publishResult',
      ...tableRowConfig,
    },
    {
      title: '实际披露日期',
      dataIndex: 'actualPublishDate',
      key: 'actualPublishDate',
      ...tableRowConfig,
    },
  ];

  /**
   * @const  表格多选框
   * @method  onChange
   * @param   {selectedRowKeys} 选中项key值
   */
  const rowSelection = {
    onChange: selectedRowKeys => {
      message.success(selectedRowKeys);
    },
  };

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
        dataSource={informationDisclosureData} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
      />
    );
  };

  useEffect(() => {
    handleGetInformationDisclosureData();
  }, []);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/informationDisclosureFunc'],
  }))(InformationDisclosure),
);

export default WrappedIndexForm;

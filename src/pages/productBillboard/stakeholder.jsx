/**
 * 产品看板-查看产品-干系人
 */
import React, { useContext, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { pagination } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { Table } from '@/components';

const Stakeholder = ({ dispatch, listLoading, productBillboard: { stakeholderData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据

  /**
   *@method handleGetStakeholderData 获取账户信息表格
   */
  const handleGetStakeholderData = () => {
    dispatch({
      type: 'productBillboard/stakeholderDataFunc',
      payload: proCodeArguments,
    });
  };

  const eutrapelia = label => {
    return (
      <Tooltip title={label} placement="topLeft">
        <span
          style={{
            width: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            paddingTop: '5px',
          }}
        >
          {label
            ? label.toString().replace(/null/g, '-')
            : label === '' || label === undefined
            ? '-'
            : 0}
        </span>
      </Tooltip>
    );
  };

  // 表头数据
  const columns = [
    {
      title: '产品类型',
      dataIndex: 'proType',
      key: 'proType',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      ...tableRowConfig,
      render: val => {
        if (val === 0) {
          return eutrapelia('内部干系人');
        } else if (val === 1) {
          return eutrapelia('外部干系人');
        } else return handleChangeLabel(val);
      },
      width: 140,
    },
    {
      title: '干系人类型',
      dataIndex: 'stakeholderType',
      key: 'stakeholderType',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '机构名称',
      dataIndex: 'agencyName',
      key: 'agencyName',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '证件类型',
      dataIndex: 'certificateType',
      key: 'certificateType',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '证件号码',
      dataIndex: 'idNumber',
      key: 'idNumber',
      ...tableRowConfig,
      align: 'right',
      width: 140,
    },
    {
      title: '座机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ...tableRowConfig,
      align: 'right',
      width: 140,
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      ...tableRowConfig,
      align: 'right',
      width: 140,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '开始任职日期',
      dataIndex: 'startDate',
      key: 'startDate',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '离任日期',
      dataIndex: 'departureDate',
      key: 'departureDate',
      ...tableRowConfig,
      width: 140,
    },
  ];

  /**
   * @method  handleAddTable 渲染表格数据
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={pagination} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={stakeholderData} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
        scroll={{ x: true }}
      />
    );
  };

  useEffect(() => {
    handleGetStakeholderData();
  }, [proCodeArguments]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/stakeholderDataFunc'],
  }))(Stakeholder),
);

export default WrappedIndexForm;

/**
 * 产品看板-查看产品-产品数据-定期报告
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, message } from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';

const PeriodicReport = ({ dispatch, listLoading, productBillboard: { periodicReportData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小

  // 获取账户信息表格
  const handleGetPeriodicReportData = () => {
    dispatch({
      type: 'productBillboard/periodicReportDataFunc',
      payload: {
        proCode: proCodeArguments,
        pageNum: pageNum,
        pageSize: pageSize,
        direction: 'DESC',
        field: 'proCode',
      },
      callback: res => {
        total.current = res.total;
      },
    });
  };

  // 页码属性设置
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: total.current,
    showTotal: () => {
      return `共 ${total.current} 条数据`;
    },
  };

  /**
   * 表格多选框
   * @const   rowSelection
   * @method  onChange
   * @param   {selectedRowKeys} 选中项key值
   */
  const rowSelection = {
    onChange: selectedRowKeys => {
      message.success(selectedRowKeys);
    },
  };

  // 表头数据
  const columns = [
    {
      title: '报告类型',
      dataIndex: 'reportTypeName',
      key: 'reportTypeName',
      ...tableRowConfig,
    },
    {
      title: '报告期',
      children: [
        {
          title: '年',
          dataIndex: 'reportPeriodYear',
          key: 'reportPeriodYear',
        },
        {
          title: '月',
          dataIndex: 'reportPeriodMonth',
          key: 'reportPeriodMonth',
        },
      ],
    },
    {
      title: '披露状态',
      dataIndex: 'disclosureStatus',
      key: 'disclosureStatus',
      render: text => {
        if (text === '1') {
          return '已披露';
        } else if (text === '0') {
          return '未披露';
        } else {
          return handleChangeLabel(text);
        }
      },
    },
    {
      title: '披露对象',
      dataIndex: 'disclosureTargetName',
      key: 'disclosureTargetName',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '披露日期',
      dataIndex: 'disclosureDate',
      key: 'disclosureDate',
      ...tableRowConfig,
    },
    // {
    //   title: '附件',
    //   dataIndex: 'businessArchives',
    //   key: 'businessArchives',
    // },
  ];

  // 页码回调
  const handleChangePages = page => {
    if (page) {
      setPageNum(page.current);
      setPageSize(page.pageSize);
    }
  };

  /**
   * 渲染表格数据
   * @method  handleAddTable
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={periodicReportData.rows} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
        onChange={handleChangePages}
      />
    );
  };

  useEffect(() => {
    handleChangePages();
    handleGetPeriodicReportData();
  }, [proCodeArguments, pageNum, pageSize]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/periodicReportDataFunc'],
  }))(PeriodicReport),
);

export default WrappedIndexForm;

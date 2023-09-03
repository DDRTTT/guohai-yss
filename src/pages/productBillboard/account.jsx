/**
 * 产品看板-查看产品-账户
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Table } from '@/components';

const Account = ({ dispatch, listLoading, productBillboard: { accountData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小

  // 获取账户信息表格
  const handleGetAccountData = () => {
    dispatch({
      type: 'productBillboard/accountDataFunc',
      payload: { product: proCodeArguments, pageNum: pageNum, pageSize: pageSize },
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
   * 查看
   * @param {Object} record 行数据
   */
  const handleCanLook = record => {
    const url = `/dynamicPage/pages/产品看板/8aaaa81774da3eb1017569330849000f/账户详情?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&type=view`;
    router.push(url);
  };

  // 表头数据
  const columns = [
    {
      title: '账户类型',
      dataIndex: 'accountTypeName',
      key: 'accountTypeName',
      align: 'center',
      ...tableRowConfig,
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      align: 'center',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '账户状态',
      dataIndex: 'accountStatusName',
      key: 'accountStatusName',
      align: 'center',
      ...tableRowConfig,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      align: 'center',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleCanLook(record)}>
            查看
          </Button>
        </div>
      ),
    },
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
   * @return  {Object}     表格数据及属性
   */
  const handleAddTable = () => {
    return (
      <Table
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={accountData.rows} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', paddingBottom: '10px' }}
        onChange={handleChangePages}
      />
    );
  };

  useEffect(() => {
    handleChangePages();
    handleGetAccountData();
  }, [proCodeArguments, pageNum, pageSize]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/accountDataFunc'],
  }))(Account),
);

export default WrappedIndexForm;

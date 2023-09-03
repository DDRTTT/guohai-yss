/**
 * 产品信息要素 - 产品基本信息
 */
import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Card, Breadcrumb } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { handleAddHeard, handleAddTable, handleAddSearch } from './baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import Action from '@/utils/hocUtil';

const Index = ({ dispatch, listLoading, productInformationBase: { productTable } }) => {
  const dataObj = useRef({}); // 请求参数对象
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小
  const [keyWords, setKeyWords] = useState(''); // 关键字

  // 参数更新
  const handleUpdateData = () => {
    dataObj.current = {
      pageNum: pageNum, // 当前页
      pageSize: pageSize, // 页展示量
      keyWords: keyWords, // 关键字
    };
  };

  // 页码回调
  const handleChangePages = page => {
    if (page) {
      setPageNum(page.current);
      setPageSize(page.pageSize);
    }
  };

  // 搜索回调
  const handleCanSearch = val => {
    setKeyWords(val);
  };

  // 查看/修改
  const handleGoCheck = (record, val) => {
    console.log(record);
    if (val) {
      const url = `/dynamicPage/pages/产品基本信息/4028e7b6757809700175fdb917c20045/查看?proCode=${record.proCode}`;
      router.push(url);
    } else {
      const url = `/dynamicPage/pages/产品基本信息/4028e7b6757809700175fdcfabd80046/修改?proCode=${record.proCode}`;
      router.push(url);
    }
  };

  // 页码属性设置(产品看板)
  const pages = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: total.current,
    showTotal: () => {
      return `共 ${total.current} 条数据`;
    },
  };

  /**
   * 请求:表格数据
   */
  const handleGetListData = () => {
    handleUpdateData();
    dispatch({
      type: 'productInformationBase/getProductTableFunc',
      payload: dataObj.current,
      callback: res => {
        total.current = res.total;
      },
    });
  };

  const columns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '产品简称',
      dataIndex: 'proFname',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '风险等级',
      dataIndex: 'proRisk',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '产品类型',
      dataIndex: 'proType',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '产品成立日',
      dataIndex: 'proCdate',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '产品到期日',
      dataIndex: 'proEdate',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '管理人',
      dataIndex: 'proCustodian',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '托管人',
      dataIndex: 'proTrusBank',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '募集开始日',
      dataIndex: 'recSdate',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '募集结束日',
      dataIndex: 'recEdate',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Action code="productInformationBase:check">
              <Button type="link" onClick={() => handleGoCheck(record, '1')}>
                查看
              </Button>
            </Action>
            <Action code="productInformationBase:update">
              <Button type="link" onClick={() => handleGoCheck(record)}>
                修改
              </Button>
            </Action>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    handleChangePages();
    handleGetListData();
  }, [pageNum, pageSize, keyWords]);

  return (
    <>
      {handleAddHeard(handleCanSearch, 1, '产品生命周期', '产品信息要素', '产品基本信息')}
      {handleAddTable(columns, productTable.rows, pages, handleChangePages, listLoading)}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productInformationBase, loading }) => ({
    productInformationBase,
    listLoading: loading.effects['productInformationBase/getProductTableFunc'],
  }))(Index),
);

export default WrappedIndexForm;

/**
 * 产品信息要素 - 系列基本信息
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

const Index = ({ dispatch, listLoading, productInformationBase: { servicesTable } }) => {
  const dataObj = useRef({}); // 请求参数对象
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小
  const [keyWords, setKeyWords] = useState(''); // 关键字
  const [direction, setDirection] = useState(''); // 排序方式
  const [field, setField] = useState(''); // 排序依据

  // 参数更新
  const handleUpdateData = () => {
    dataObj.current = {
      pageNum: pageNum, // 当前页
      pageSize: pageSize, // 页展示量
      keyWords: keyWords, // 关键字
      direction: direction, //排序方式
      field: field, // 排序依据
    };
  };

  // 页码回调
  const handleChangePages = (page, _, sorter) => {
    if (page) {
      setPageNum(page.current);
      setPageSize(page.pageSize);
    }
    if (sorter) {
      setField(sorter.field);
      setDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
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
      const url = `/dynamicPage/pages/系列基本信息/4028e7b676216e1b01764695f0b50029/查看?proCode=${record.proCode}`;
      router.push(url);
    } else {
      const url = `/dynamicPage/pages/系列基本信息/4028e7b6757809700175fe2fea3d0048/修改?proCode=${record.proCode}`;
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
      type: 'productInformationBase/getServicesTableFunc',
      payload: dataObj.current,
      callback: res => {
        total.current = res.total;
      },
    });
  };

  const columns = [
    {
      title: '系列名称',
      dataIndex: 'proName',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '系列号',
      dataIndex: 'proCode',
      ...tableRowConfig,
      sorter: false,
    },

    {
      title: '上级系列',
      dataIndex: 'upstairsSeries',
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
      title: '产品类型',
      dataIndex: 'proType',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '运作方式',
      dataIndex: 'operationWay',
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
      title: '产品备案类型',
      dataIndex: 'proArchivalType',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '业务归属部门',
      dataIndex: 'proBelongDepartment',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '投资经理',
      dataIndex: 'investmentManager',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '是否结构化产品',
      dataIndex: 'isStructpro',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '委托人',
      dataIndex: 'proConsigner',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '是否允许自有资金参与',
      dataIndex: 'canOwnfundParticipation',
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
  }, [pageNum, pageSize, keyWords, direction, field]);

  console.log(servicesTable);
  return (
    <>
      {handleAddHeard(handleCanSearch, 0, '产品生命周期', '产品信息要素', '系列基本信息')}
      {handleAddTable(columns, servicesTable.rows, pages, handleChangePages, listLoading)}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productInformationBase, loading }) => ({
    productInformationBase,
    listLoading: loading.effects['productInformationBase/getServicesTableFunc'],
  }))(Index),
);

export default WrappedIndexForm;

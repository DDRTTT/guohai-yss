/**
 * 产品信息要素 - 募集信息
 */
import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Card, Breadcrumb } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { handleAddHeard, handleAddTable, handleAddSearch } from './baseFunc';
import { moneyRender } from '@/pages/productBillboard/baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import Action from '@/utils/hocUtil';

const Index = ({ dispatch, listLoading, productInformationBase: { productTableInfo } }) => {
  const name = 'raise';
  const dataObj = useRef({}); // 请求参数对象
  const total = useRef(0); // 总数据条数
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 页大小
  const [fuzzy, setFuzzy] = useState(''); // 关键字
  const [direction, setDirection] = useState(''); // 排序方式
  const [field, setField] = useState(''); // 排序依据

  // 参数更新
  const handleUpdateData = () => {
    dataObj.current = {
      queryTypeCode: name,
      proCode: [],
      pageNum: pageNum, // 当前页
      pageSize: pageSize, // 页展示量
      fuzzy: fuzzy, // 关键字
      // direction: direction, //排序方式
      // field: field, // 排序依据
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
    setFuzzy(val);
  };

  // 查看/修改
  const handleGoCheck = (record, val) => {
    console.log(record);
    if (val) {
      const url = `/dynamicPage/pages/募集信息/4028e7b6757809700176034bc4bf0055/查看?proCode=${record.proCode}&type=${name}&updateDataType=${name}`;
      router.push(url);
    } else {
      const url = `/dynamicPage/pages/募集信息/4028e7b6757809700175f8199c430039/修改?proCode=${record.proCode}&type=${name}&updateDataType=${name}`;
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
      type: 'productInformationBase/getProductInfoTableFunc',
      payload: dataObj.current,
      callback: res => {
        total.current = res.total;
      },
    });
  };

  const columns = [
    {
      title: '产品名称',
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
      title: '募集开始日',
      dataIndex: 'raiseSdate',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '计划募集结束日',
      dataIndex: 'raiseEdateExpect',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '调整后募集结束日',
      dataIndex: 'raiseEdateDelayExpect',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '实际募集结束日',
      dataIndex: 'raiseEdateActual',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '最低募集金额',
      dataIndex: 'minRaiseAmount',
      ...moneyRender,
    },
    {
      title: '最高募集金额',
      dataIndex: 'maxRaiseAmount',
      ...moneyRender,
    },
    {
      title: '认购起点',
      dataIndex: 'subsStart',
      ...moneyRender,
    },
    {
      title: '是否达到成立条件',
      dataIndex: 'raiseResult',
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
  }, [pageNum, pageSize, fuzzy, direction, field]);

  return (
    <>
      {handleAddHeard(handleCanSearch, 1, '产品生命周期', '产品信息要素', '募集信息')}
      {handleAddTable(columns, productTableInfo.rows, pages, handleChangePages, listLoading)}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productInformationBase, loading }) => ({
    productInformationBase,
    listLoading: loading.effects['productInformationBase/getProductInfoTableFunc'],
  }))(Index),
);

export default WrappedIndexForm;

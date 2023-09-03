/**
 * 产品信息要素 - 份额持有人大会及日常机构信息
 */
import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Card, Breadcrumb } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import {
  handleAddHeard,
  handleAddTable,
  handleAddSearch,
  tableRender,
  handleAddTooltip15,
} from './baseFunc';
import Action from '@/utils/hocUtil';

const Index = ({ dispatch, listLoading, productInformationBase: { productTableInfo } }) => {
  const name = 'shareHolder';
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
    console.log('行数据', record);
    if (val) {
      const url = `/dynamicPage/pages/份额持有人大会及日常机构信息/4028e7b67578097001761d02ce25005d/查看?proCode=${record.proCode}&type=${name}&updateDataType=${name}`;
      router.push(url);
    } else {
      const url = `/dynamicPage/pages/份额持有人大会及日常机构信息/8aaaa5d2757978ef01761cf6f808001c/修改?proCode=${record.proCode}&type=${name}&updateDataType=${name}`;
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
      ...tableRender,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      ...tableRender,
    },
    {
      title: '是否设立持有人大会',
      dataIndex: 'meeting',
      ...tableRender,
    },
    {
      title: '持有人大会议事内容',
      dataIndex: 'meetingContent',
      render: (_, record) => {
        return record.meeting === '是' ? handleAddTooltip15(record.meetingContent) : '';
      },
    },
    {
      title: '是否涉及日常机构',
      dataIndex: 'dailyOrg',
      ...tableRender,
    },
    {
      title: '日常机构议事内容',
      dataIndex: 'dailyOrgContent',
      render: (_, record) => {
        return record.dailyOrg === '是' ? handleAddTooltip15(record.dailyOrgContent) : '';
      },
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
      {handleAddHeard(
        handleCanSearch,
        1,
        '产品生命周期',
        '产品信息要素',
        '份额持有人大会及日常机构信息',
      )}
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

/**
 * 产品看板-查看系列-系列产品
 */
import React, { useContext, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { Table } from '@/components';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';

const SeriesProduct = ({ dispatch, listLoading, productBillboard: { seriesProductData } }) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
  const totalData = useRef(0); // 页码总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const proNameData = useRef([]); // 产品全称
  const proCodeData = useRef([proCodeArguments]); // 产品代码
  const upstairsSeriesData = useRef([]); // 系列名称
  const proTypeData = useRef([]); // 产品类型
  const investmentManagerData = useRef([]); // 投资经理
  const proRiskData = useRef([]); // 风险等级
  const proStageData = useRef([]); // 产品阶段
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const batchData = useRef([]); // 批量操作参数

  // 跳转产品
  const handleGoProduct = record => {
    dispatch(
      routerRedux.push({
        pathname: './productData',
        query: { proCode: record.proCode },
      }),
    );
  };

  // 表头数据(系列产品)
  const columns = [
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      render: (text, record) => {
        if (text) {
          return (
            <Button
              type="link"
              onClick={() => {
                handleGoProduct(record);
              }}
            >
              {text}
            </Button>
          );
        } else return handleChangeLabel(text);
      },
      width: 400,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
    },
    {
      title: '产品简称',
      dataIndex: 'proFname',
      key: 'proFname',
      sorter: true,
    },
    {
      title: '产品阶段',
      dataIndex: 'proStage',
      key: 'proStage',
      sorter: true,
    },
    {
      title: '产品状态',
      dataIndex: 'proStatus',
      key: 'proStatus',
      sorter: true,
    },
  ];

  /**
   * 更新请求参数(下级系列)
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current, // 当前页
      pageSize: pageSizeData.current, // 页展示量
      proName: proNameData.current, // 产品名称
      proCode: [], // 产品代码
      proType: proTypeData.current, // 产品类型
      upstairsSeries: [proCodeArguments], // 系列名称
      investmentManager: investmentManagerData.current, // 投资经理
      proRisk: proRiskData.current, // 风险等级
      proStage: proStageData.current, // 产品阶段
      direction: directionData.current, // 排序方式
      field: fieldData.current, // 排序字段
    };
  };

  /**
   *获取系列产品表格
   */
  const handleGetSeriesProduct = () => {
    handleGetDataObj();
    dispatch({
      type: 'productBillboard/seriesProductFunc',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  const handleChangePages = (pages, _, sorter) => {
    console.log(pages, _, sorter);
    pageNumData.current = pages.current;
    pageSizeData.current = pages.pageSize;
    fieldData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionData.current = 'asc'; // 升序
    } else if (sorter.order === 'descend') {
      directionData.current = 'desc'; // 降序
    } else {
      directionData.current = ''; // 默认
    }
    handleGetSeriesProduct();
  };

  // 页码属性设置
  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  /**
   * 渲染表格(下级系列)
   */
  const handleAddTable = () => {
    if (seriesProductData.rows) {
      return (
        <Table
          bordered
          rowKey={record => record.proCode} // key值
          pagination={paginationProps}
          loading={listLoading} // 加载中效果
          style={{ margin: '0 26px 26px 26px', borderRadius: '7px 7px 0 0' }}
          columns={columns}
          dataSource={seriesProductData.rows}
          onChange={handleChangePages}
          rowClassName={(record, index) => {
            let className = '';
            if (index % 2 === 1) className = 'bgcFBFCFF';
            return className;
          }}
        />
      );
    }
  };

  useEffect(() => {
    handleGetSeriesProduct();
  }, [proCodeArguments]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/seriesProductFunc'],
  }))(SeriesProduct),
);

export default WrappedIndexForm;

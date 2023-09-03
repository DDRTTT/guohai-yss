/**
 * 产品看板-查看系列-下级系列表格
 */
import React, { useContext, useEffect, useRef } from 'react';
import { Table, Button, message } from 'antd';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';

const SubordinateSeries = ({
  dispatch,
  listLoading,
  productBillboard: { subordinateSeriesData },
}) => {
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

  // 获取系列视图
  const handleGoSeries = record => {
    router.push(`/productLifecycle/productBillboard/seriesData?proCode=${record.proCode}`);
    location.reload();
  };

  // 表头数据(下级系列)
  const columns = [
    {
      title: '系列名称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      render: (text, record) => {
        if (text) {
          return (
            <Button
              type="link"
              onClick={() => {
                handleGoSeries(record);
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
      title: '系列号',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      redner: val => {
        return handleChangeLabel(val);
      },
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
      proCode: [proCodeArguments], // 产品代码
      proType: proTypeData.current, // 产品类型
      upstairsSeries: upstairsSeriesData.current, // 系列名称
      investmentManager: investmentManagerData.current, // 投资经理
      proRisk: proRiskData.current, // 风险等级
      proStage: proStageData.current, // 产品阶段
      direction: directionData.current, // 排序方式
      field: fieldData.current, // 排序字段
    };
  };

  /**
   *获取下级系列表格
   */
  const handleGetSubordinateSeries = () => {
    handleGetDataObj();
    dispatch({
      type: 'productBillboard/subordinateSeriesFunc',
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
    handleGetSubordinateSeries();
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
    if (subordinateSeriesData.rows) {
      return (
        <Table
          bordered
          rowKey={record => record.proCode} // key值
          pagination={paginationProps}
          loading={listLoading} // 加载中效果
          style={{ margin: '0 26px 26px 26px', borderRadius: '7px 7px 0 0' }}
          columns={columns}
          dataSource={subordinateSeriesData.rows}
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
    handleGetSubordinateSeries();
  }, [proCodeArguments]);

  return <>{handleAddTable()}</>;
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/subordinateSeriesFunc'],
  }))(SubordinateSeries),
);

export default WrappedIndexForm;

/**
 * 产品看板-查看产品-产品生命周期
 */
import React, { useContext, useRef, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip, Progress, Menu, Dropdown, message, Form, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import processLineMap from '@/utils/processLineMap';
import styles from './index.less';
import MyContext from './myContext';
import flatMap from 'lodash/flatMap';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { handleChangeLabel } from '@/pages/productBillboard/baseFunc';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Table } from '@/components';

const ProductLifeCycle = ({
  dispatch,
  listLoading,
  productBillboard: { lifeCycleTableData, canvasMessage, nodeStatusList },
}) => {
  const { percent, 产品评审data, proTypeArguments } = useContext(MyContext); // 子组件接受的数据
  const [loadingData, setLoadingData] = useState(true);
  const dataObj = useRef({}); // 请求参数
  const receiveArguments = useRef(''); // 产品代码
  const proTypeData = useRef(''); // 产品类型
  const canvas = useRef(); // canvas绘图
  const codeListData = useRef([]); // code数组
  const totalData = useRef(0); // 页码总数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据

  const mapInstance = useRef(null);
  // 表头
  const columns = [
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
      align: 'center',
      render: val => {
        if (val) {
          return val.replace(/lifecycle_/, '产品生命周期');
        } else return handleChangeLabel(val);
      },
      width: 400,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '发起人',
      dataIndex: 'startUserName',
      key: 'startUserName',
      align: 'center',
      ...tableRowConfig,
    },
    {
      title: '发起时间',
      dataIndex: 'processStartTime',
      key: 'processStartTime',
      align: 'center',
      ...tableRowConfig,
    },
    {
      title: '任务开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
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
          {/* <Button type="link" onClick={() => handleCanDetails(record)}>
            详情
          </Button> */}
          <Button type="link" onClick={() => handleShowTransferHistory(record)}>
            流转历史
          </Button>
        </div>
      ),
    },
  ];

  // 流转历史
  const handleCanLocationHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}`;
    router.push(url);
  };

  // 详情
  const handleCanDetails = record => {
    const url = `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}`;
    router.push(url);
  };

  // 更新请求参数
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current, // 当前页
      pageSize: pageSizeData.current, // 页展示量
      proCode: receiveArguments.current, // 产品代码
      codes: codeListData.current, // code数组
      direction: directionData.current, // 排序方式
      field: fieldData.current, // 排序字段
    };
  };

  /**
   * 排序方法
   * @param {Object} pagination 页码数据信息
   * @param {Object} filters 不知道干啥的
   * @param {Object} sorter 排序依据
   */
  const handleChangeSorter = (pagination, filters, sorter) => {
    fieldData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionData.current = 'asc'; // 升序
    } else if (sorter.order === 'descend') {
      directionData.current = 'desc'; // 降序
    } else {
      directionData.current = ''; // 默认
    }
    handleGetDataObj();
    handleGetLifeCycleTableData();
  };

  /**
   * 获取url参数
   * @param {String} variable 参数名称
   * @param {String} paramName 参数值
   */
  const handleGetUrlParam = variable => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return (receiveArguments.current = pair[1]);
      }
    }
    return message.error('参数接收错误');
  };

  /**
   * 加工实例化canvas
   * @method handleMakeCanvas
   * @param {Object} res 数据源
   */
  const handleMakeCanvas = stageList => {
    console.log('canvas.current', canvas.current); // 调试用
    if (canvas.current) {
      canvas.current.addEventListener('circleClick', e => {
        const { nodeActionType, nodeActionUri } = e.detail;
        if (nodeActionType != '//') {
          // 跳转到本地路由
          if (nodeActionType == 'uri') {
            router.push(nodeActionUri);
          } else {
            // 如果是resource的话,调接口,但是不用做处理
            commonRequest(nodeActionUri);
          }
        }
      });
      if (!mapInstance.current) {
        mapInstance.current = new processLineMap(canvas.current, stageList, true, proTypeArguments);
      } else {
        mapInstance.current.update(stageList, proTypeArguments);
      }
    }
  };

  /**
   * 请求:获取统计数据
   * @method handleGetCanvasMessage
   * @param {Object} res 数据源
   */
  const handleGetCanvasMessage = res => {
    if (res && res.length > 0) {
      const special = ['start', 'end', 'parallel'];
      let codeList = res.map(item => {
        return item.nextCells
          .filter(item => !special.includes(item.code))
          .map(sonItem => {
            return sonItem.code;
          });
      });
      codeList = flatMap(codeList);
      codeListData.current = codeList;
      const tempRes = res;
      let countList = [];
      let statusList = [];
      dispatch({
        type: 'productBillboard/getStatisticsFunc',
        payload: {
          proCode: receiveArguments.current,
          codes: codeList,
        },
        callback: res => {
          countList = res;
          computedCanvasData(tempRes, countList, statusList);
        },
      });
      dispatch({
        type: 'productBillboard/getNodeStatus',
        payload: {
          proCode: receiveArguments.current,
          codes: codeList,
        },
        callback: res => {
          statusList = res;
          computedCanvasData(tempRes, countList, statusList);
          setLoadingData(false);
        },
      });
    }
  };
  // 计算
  const computedCanvasData = (_nodeList, _countList, _statusList) => {
    if (_nodeList.length > 0 && _countList.length > 0 && _statusList.length > 0) {
      handleGetDataObj();
      handleGetLifeCycleTableData();
      const tempStageList = JSON.parse(JSON.stringify(_nodeList));
      tempStageList.forEach(item => {
        item.nextCells.forEach(secItem => {
          const tempItem = _countList.find(sonItem => sonItem.code == secItem.code);
          const tempItem2 = _statusList.find(sonItem => sonItem.code == secItem.code);
          secItem.count = (tempItem && tempItem.count) || 0;
          secItem.status = (tempItem2 && tempItem2.status) || 0;
        });
      });
      handleMakeCanvas(tempStageList);
    }
  };

  /**
   * 请求:获取canvas数据
   * @method handleGetCanvasData
   */
  const handleGetCanvasData = () => {
    dispatch({
      type: 'productBillboard/getProcessTreeFunc',
      payload: { proCode: proTypeArguments },
      callback: res => {
        handleGetCanvasMessage(res);
      },
    });
  };

  /**
   * 请求:获取生命周期表格数据
   */
  const handleGetLifeCycleTableData = () => {
    dispatch({
      type: 'productBillboard/getLifeCycleTableFunc',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  /**
   * 页展示量变更
   * @param {Object} current pageNum当前页码
   * @param {String} pageSize 表格行数据
   */
  const handleUpdataPageSize = (current, pageSize) => {
    pageSizeData.current = pageSize;
    pageNumData.current = 1;
    handleGetDataObj();
  };

  /**
   * 当前页码变更
   * @param {String} pageNum 跳转到的页码
   */
  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
  };

  // 页码属性设置
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: handleUpdataPageSize,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  /**
   * 渲染表格数据
   */
  const tableData = () => {
    handleGetDataObj();
    return (
      <Table
        style={{ margin: '0% 2% 0 2%' }}
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.taskId} // key值
        dataSource={lifeCycleTableData.rows} // 表数据源
        columns={columns} // 表头
        onChange={handleChangeSorter}
      />
    );
  };

  useEffect(() => {
    if (!proTypeArguments) return;
    handleGetUrlParam('proCode');
    handleGetCanvasData();
    handleGetLifeCycleTableData();
  }, [proTypeArguments]);

  useEffect(() => {
    return () => {
      mapInstance.current?.unmount();
      mapInstance.current = null;
    };
  }, []);

  return (
    <>
      <Spin spinning={loadingData}>
        <canvas className={styles.canvasData} ref={canvas} />
      </Spin>
      {tableData()}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productBillboard, loading }) => ({
    productBillboard,
    listLoading: loading.effects['productBillboard/getLifeCycleTableFunc'],
  }))(ProductLifeCycle),
);

export default WrappedIndexForm;

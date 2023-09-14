import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'antd';
import { Table } from '@/components';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { getPaginationConfig, tableRowConfig } from '@/pages/investorReview/func';
import styles from './index.less';

const DispatchContext = React.createContext(null);
// 第三级的表格
const ThirdTable = props => {
  const { dispatch } = useContext(DispatchContext);
  const { data = [] } = props;
  const localData = JSON.parse(JSON.stringify(data));
  localData.map(item => {
    item.zhixingzhe = JSON.parse(sessionStorage.getItem('USER_INFO')).username;
  });
  const columns = [
    {
      key: 'taskName',
      dataIndex: 'taskName',
      title: '事项名称',
      ...tableRowConfig,
      width: 400,
    },
    {
      key: 'taskDefinitionKey',
      dataIndex: 'taskDefinitionKey',
      title: '事项代码',
      ...tableRowConfig,
    },
    // {
    //   key: 'processName',
    //   dataIndex: 'processName',
    //   title: '任务类型',
    // },
    {
      key: 'zhixingzhe',
      dataIndex: 'zhixingzhe',
      title: '执行者',
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作',
      fixed: 'right',
      render: (val, record, index) => {
        return (
          <>
            <a
              style={{ marginRight: '12px' }}
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/processCenter/taskDeal',
                    query: {
                      taskId: record.taskInstId,
                      processDefinitionId: record.processDefinitionId,
                      processInstanceId: record.processInstId,
                      taskDefinitionKey: record.taskDefinitionKey,
                      mode: 'deal',
                    },
                  }),
                );
              }}
            >
              进入办理
            </a>
            {/* <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/processCenter/processDetail',
                    query: {
                      processInstanceId: record.processInstId,
                      nodeId: record.taskDefinitionKey,
                      taskId: record.taskInstId,
                    },
                  }),
                );
              }}
            >
              查看详情
            </a> */}
          </>
        );
      },
    },
  ];
  return <Table dataSource={localData} columns={columns} rowKey="taskInstId" pagination={false} />;
};

// 第二级的表格
const SecondTable = props => {
  const { data = [] } = props;
  const columns = [
    {
      key: 'processName',
      dataIndex: 'processName',
      title: '流程名称',
      ...tableRowConfig,
      width: 400,
    },
    // {
    //   key: '',
    //   dataIndex: '',
    //   title: '流程进度',
    // },
    {
      key: 'toDoTaskCount',
      dataIndex: 'toDoTaskCount',
      title: '待办事项',
    },
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="processDefinitionKey"
      pagination={false}
      expandedRowRender={record => {
        return <ThirdTable data={record.taskDetailInfoVoList} />;
      }}
      scroll={{ x: columns.length * 200 + 200 }}
    />
  );
};

// 产品视图
const Index = props => {
  const { dispatch, stackedBarChartList, tableLoading, currentStartTime } = props;

  const [firstData, setFirstData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [thirdData, setThirdData] = useState([]);
  // 一页多少数据
  const [pageSize, setPageSize] = useState(10);
  // 页数
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    if (currentStartTime) {
      getTableList();
    }
  }, [pageSize, pageNum, currentStartTime]);

  const getTableList = () => {
    dispatch({
      type: 'operatingCalendar/stackedBarChart',
      payload: { pageSize, pageNum, date: currentStartTime },
    });
  };

  const oneColumns = [
    {
      key: 'id',
      title: '序号',
      dataIndex: 'id',
      width: 90,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      key: 'proName',
      dataIndex: 'proName',
      title: '产品名称',
      ...tableRowConfig,
      width: 400,
    },
    {
      key: 'proCode',
      dataIndex: 'proCode',
      title: '产品代码',
      ...tableRowConfig,
    },
    {
      key: 'proTypeName',
      dataIndex: 'proTypeName',
      title: '产品类型',
      ...tableRowConfig,
    },
    {
      key: 'proStageName',
      dataIndex: 'proStageName',
      title: '产品阶段',
      ...tableRowConfig,
    },
    {
      key: 'toDoProcessCount',
      dataIndex: 'toDoProcessCount',
      title: '待办流程',
    },
    {
      key: 'toDoTaskCount',
      dataIndex: 'toDoTaskCount',
      title: '待办事项',
    },
  ];

  /**
   * @description table页码切换的回调
   * @param {object} _pagination 分页器的对象
   * @param {object} _filters 筛选的对象
   * @param {object} _sorter 排序的对象
   */
  const tableChange = (_pagination, _filters, _sorter) => {
    setPageNum(_pagination.current);
    setPageSize(_pagination.pageSize);
  };

  return (
    <DispatchContext.Provider value={{ dispatch }}>
      <Card className={styles.productView} style={{ marginTop: '24px' }} title="产品视图">
        <Table
          dataSource={stackedBarChartList.rows}
          columns={oneColumns}
          pagination={getPaginationConfig(stackedBarChartList.total, pageSize, {
            current: pageNum,
          })}
          onChange={tableChange}
          rowKey="proCode"
          loading={tableLoading}
          expandedRowRender={record => {
            return <SecondTable data={record.processDetailInfoVoList} />;
          }}
        />
      </Card>
    </DispatchContext.Provider>
  );
};

const productVeiw = state => {
  const {
    dispatch,
    operatingCalendar: { stackedBarChartList },
    loading,
  } = state;
  return {
    dispatch,
    stackedBarChartList,
    tableLoading: loading.effects['operatingCalendar/stackedBarChart'],
  };
};
export default connect(productVeiw)(Index);

// 投资者审查页面
import React, { useEffect, useRef, useState } from 'react';
import { Form, Tabs } from 'antd';
import { connect } from 'dva';
import EnrichEditButton from '@/components/AdvancSearch/EnrichEditButton';
import { deleteApi } from '@/services/investorReview';
import {
  getEditButton,
  getPaginationConfig,
  hideTaskTime,
  isNullObj,
  tableRowConfig,
} from '@/pages/investorReview/func';
import MoreOperation from '@/components/moreOperation';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
// 投资者审查
const Index = props => {
  const { publicTas } = props;
  const taskTypeCodeRef = useRef(publicTas);
  // 初始化state
  const [state, setState] = useState({
    // tabs的code
    taskTypeCode: publicTas,
    // 页面数据的条数
    pageSize: 10,
    // 当前页数
    pageNum: 1,
    // 排序方式
    direction: '',
    // 排序字段
    field: '',
    // 批量处理的选中
    selectedRowKeys: [],
    // 搜索组件传回来的值
    searchData: undefined,
    // 模糊收索的值
    fuzzy: undefined,
    // 表格表头
    columns: [
      {
        key: 'clientType',
        dataIndex: 'clientType',
        title: '客户类型',
        ...tableRowConfig,
      },
      {
        key: 'clientName',
        dataIndex: 'clientName',
        title: '客户名称',
        ...tableRowConfig,
        width: 400,
      },
      {
        key: 'isProfessInvestor',
        dataIndex: 'isProfessInvestor',
        title: '是否专业投资者',
        ...tableRowConfig,
        width: 150,
      },
      {
        key: 'auditItems',
        dataIndex: 'auditItems',
        title: '审查项',
        ...tableRowConfig,
      },
      // {
      //   key: 'creditCode',
      //   dataIndex: 'creditCode',
      //   title: '信用编码',
      //   ...tableRowConfig,
      // },
      {
        key: 'reviewProduct',
        dataIndex: 'reviewProduct',
        title: '审查产品',
        ...tableRowConfig,
      },
      {
        key: 'missionArrivalTime',
        dataIndex: 'missionArrivalTime',
        title: '任务到达时间',
        ...tableRowConfig,
        width: 180,
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        ...tableRowConfig,
        width: 100,
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: '操作',
        fixed: 'right',
        render: (val, record) => {
          const buttonList = getEditButton(
            record.processStatus,
            taskTypeCodeRef.current,
            record.revoke,
          );
          const pageConfigParam = `?taskId=${record.taskId}&instanceId=${record.processInstanceId}&id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&id=${record.id}`;
          return (
            <>
              <EnrichEditButton
                buttonList={buttonList}
                pageConfig={pageConfig}
                pageConfigParam={pageConfigParam}
                record={record}
                pageName="investorReview"
              />
              <MoreOperation
                opertations={{
                  tabs: taskTypeCodeRef.current,
                  status: record.processStatus,
                }}
                record={record}
                fn={getTableList}
              />
            </>
          );
        },
      },
    ],
  });

  const { dispatch, tableList, tabList, codeList, productList, allInvestList } = props;
  const [batchList, setBatchList] = useState([]);
  const [batchObj, setBatchObj] = useState({});

  // 搜索的区域的配置
  const formItemData = [
    {
      name: 'investType',
      label: '客户类型',
      type: 'select',
      option: codeList.I009,
      config: { mode: 'multiple', maxTagCount: 1 },
    },
    {
      name: 'clientName',
      label: '客户名称',
      type: 'select',
      option: allInvestList,
      readSet: { name: 'clientName', code: 'clientName' },
      config: { mode: 'multiple', maxTagCount: 1 },
    },
    {
      name: 'examineItem',
      label: '审查项',
      type: 'select',
      option: codeList.L001,
      config: { mode: 'multiple', maxTagCount: 1 },
    },
    // {
    //   name: 'creditNumber',
    //   label: '信用编码',
    // },
    {
      name: 'proName',
      label: '审查产品',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      option: productList,
      config: { mode: 'multiple', optionFilterProp: 'children' },
    },
    {
      name: 'processStatusCode',
      label: '流程状态',
      type: 'select',
      option: codeList.S001,
      config: { mode: 'multiple', maxTagCount: 1 },
    },
  ];
  /**
   * @description 获取搜索下拉框的值
   */
  const getDicsByTypes = () => {
    // 获取客户类型和状态
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['I009', 'S001', 'L001'],
    });
    // 获取审查产品
    dispatch({
      type: 'investorReview/getProductEnum',
    });
    // 获取客户名称
    dispatch({
      type: 'investorReview/getFindAllInvest',
    });
  };
  /**
   * @description 获取表格数据
   */
  const getTableList = () => {
    if (props.tableLoading) return;
    const { pageSize, pageNum, searchData, fuzzy, direction, field } = state;
    dispatch({
      type: 'investorReview/getTableList',
      payload: {
        ...searchData,
        taskTypeCode: taskTypeCodeRef.current,
        pageSize,
        pageNum,
        keyWords: fuzzy,
        direction,
        field,
      },
    });
  };
  // 页面按钮跳转配置
  const pageConfig = {
    // pathName: '/dynamicPage/4028e7b67443dc6e01745d1e6c93001c/lifecycle_投资者审查',
    pathName: 'investorReview',
    dispatch,
    handlerDelete: deleteApi,
    refresh: getTableList,
  };
  /**
   * @description 合并更新 封装后的setState
   * @params {object} newVal 新的对象
   */
  const assign = newVal => {
    setState({ ...state, ...newVal });
  };
  //   初始化生命周期 只执行一次
  useEffect(() => {
    getDicsByTypes();
    // hideTaskTime(taskTypeCodeRef.current, state.columns, 'missionArrivalTime');
  }, []);
  //   监控数值变化
  useEffect(() => {
    getTableList();
  }, [state.taskTypeCode, state.pageSize, state.pageNum, state.direction, state.field]);

  // 清空高级搜索的时候不调接口
  useEffect(() => {
    if (state.searchData === undefined) return;
    getTableList();
  }, [state.searchData]);

  // 清空模糊搜索的时候不调接口
  useEffect(() => {
    if (state.fuzzy === undefined) return;
    getTableList();
  }, [state.fuzzy]);

  // 处理分页以后的数据
  useEffect(() => {
    if (!isNullObj(batchObj)) {
      let tempList = [];
      for (const key in batchObj) {
        if (batchObj.hasOwnProperty(key)) {
          const element = batchObj[key];
          tempList = tempList.concat(element);
        }
      }
      setBatchList(tempList);
    }
  }, [batchObj]);
  /**
   * 搜索组件的搜索回调函数
   * @param {object} param  搜索组件传回来的值
   */
  const handlerSearch = param => {
    assign({
      pageNum: 1,
      searchData: param,
      fuzzy: undefined,
    });
  };

  // 重置
  const handleReset = () => {
    assign({
      pageNum: 1,
      searchData: {},
      fuzzy: undefined,
      direction: '',
      field: '',
    });
  };

  /**
   * 模糊搜索的回调
   * @param {string} param 模糊搜索传回来的字符串
   */
  const handlerFuzzySearch = param => {
    assign({
      pageNum: 1,
      fuzzy: param,
      searchData: undefined,
    });
  };

  // 切换tab标签
  const changeTab = _key => {
    props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: _key,
    });
    taskTypeCodeRef.current = _key;
    assign({
      taskTypeCode: _key,
      pageNum: 1,
      searchData: {},
      fuzzy: undefined,
      direction: '',
      field: '',
    });
    // 隐藏任务到达时间
    // hideTaskTime(_key, state.columns, 'missionArrivalTime');
  };

  /**
   *@description table选择框选择事件
   * @param {*} selectedRowKeys
   * @param rows
   */
  const onSelectChange = (selectedRowKeys, rows) => {
    assign({ selectedRowKeys });
    setBatchObj({ ...batchObj, [state.pageNum]: rows });
  };
  // 表格左边的选择框
  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange,
  };
  /**
   * @description table页码切换的回调
   * @param {object} _pagination 分页器的对象
   * @param {object} _filters 筛选的对象
   * @param {object} _sorter 排序的对象
   */
  const tableChange = (_pagination, _filters, _sorter) => {
    let field = _sorter.order ? _sorter.field : '';
    field = field === 'status' ? 'processStatus' : field;
    assign({
      pageNum: state.pageSize == _pagination.pageSize ? _pagination.current : 1,
      pageSize: _pagination.pageSize,
      direction: _sorter.order ? _sorter.order.replace(/end/, '') : '',
      field,
    });
  };

  /**
   * 批量提交
   */
  const handlerBatchSubmit = () => {
    dispatch({
      type: 'investorReview/batchCommit',
      // payload: state.selectedRowKeys,
      payload: batchList.map(item => item.id),
      callback: () => {
        handlerSuccessCallback();
        getTableList();
      },
    });
  };
  /**
   * 批量处理接口调用成功以后的回调
   */
  const handlerSuccessCallback = () => {
    setBatchObj({});
    assign({ selectedRowKeys: [] });
  };

  const callBackHandler = value => {
    assign({
      columns: value,
    });
  };

  return (
    <>
      <List
        pageCode="investorReview"
        dynamicHeaderCallback={callBackHandler}
        columns={state.columns}
        taskTypeCode={state.taskTypeCode}
        taskArrivalTimeKey="missionArrivalTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="300"
        loading={props.tableLoading}
        searchPlaceholder="请输入客户名称/审查产品"
        fuzzySearch={handlerFuzzySearch}
        tabs={{
          tabList: [
            { key: 'T001_1', tab: '我待办' },
            { key: 'T001_3', tab: '我发起' },
            { key: 'T001_4', tab: '未提交' },
            { key: 'T001_5', tab: '已办理' },
          ],
          activeTabKey: state.taskTypeCode,
          onTabChange: changeTab,
        }}
        extra={
          <>
            <EnrichEditButton
              buttonConfig={{ type: 'primary' }}
              moreBtnStyle={{ marginRight: 0 }}
              buttonList={[
                {
                  label: '发起流程',
                  code: 'start',
                  type: 'button',
                },
              ]}
              pageConfig={pageConfig}
              pageName="investorReview"
            />
          </>
        }
        tableList={
          <>
            <Table
              rowSelection={rowSelection}
              dataSource={tableList.rows}
              columns={state.columns}
              pagination={getPaginationConfig(tableList.total, state.pageSize, {
                current: state.pageNum,
              })}
              onChange={tableChange}
              rowKey="taskId"
              loading={props.tableLoading}
              scroll={{ x: state.columns.length * 200 + 200 }}
            />
            <MoreOperation
              opertations={{
                tabs: taskTypeCodeRef.current,
                statusKey: 'processStatus',
              }}
              fn={getTableList}
              type="batch"
              batchList={batchList}
              submitCallback={handlerBatchSubmit}
              successCallback={handlerSuccessCallback}
            />
          </>
        }
      />
    </>
  );
};

const inverstorReview = state => {
  const {
    loading,
    dispatch,
    investorReview: { tabList, tableList, codeList, productList, allInvestList },
    publicModel: { publicTas },
  } = state;
  return {
    dispatch,
    tabList,
    tableList,
    codeList,
    productList,
    allInvestList,
    publicTas,
    tableLoading: loading.effects['investorReview/getTableList'],
  };
};
export default Form.create()(connect(inverstorReview)(Index));

import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import EnrichEditButton from '@/components/AdvancSearch/EnrichEditButton';
import MoreOperation from '@/components/moreOperation';
import { batchDelete } from '@/services/salesOrganizationMaintenance';
import {
  getEditButton,
  getPaginationConfig,
  hideTaskTime,
  isNullObj,
  tableRowConfig,
} from '@/pages/investorReview/func';
import { Card, CommonSearch, Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
// 维护销售协议
const Index = props => {
  const { publicTas } = props;
  let taskTypeCodeRef = useRef(publicTas);
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
    // 表格的表头
    columns: [
      {
        key: 'sellerNameFull',
        dataIndex: 'sellerNameFull',
        title: '销售机构名称',
        ...tableRowConfig,
        width: 400,
      },
      {
        key: 'sellerCode',
        dataIndex: 'sellerCode',
        title: '销售商代码',
        ...tableRowConfig,
      },
      {
        key: 'contractName',
        dataIndex: 'contractName',
        title: '协议名称',
        ...tableRowConfig,
        width: 400,
      },
      {
        key: 'effectiveDate',
        dataIndex: 'effectiveDate',
        title: '生效日期',
        ...tableRowConfig,
      },
      {
        key: 'cancellDate',
        dataIndex: 'cancellDate',
        title: '注销日期',
        ...tableRowConfig,
      },
      {
        key: 'statusName',
        dataIndex: 'statusName',
        title: '状态',
        ...tableRowConfig,
      },
      {
        key: 'taskTime',
        dataIndex: 'taskTime',
        title: '任务到达时间',
        ...tableRowConfig,
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: '操作',
        fixed: 'right',
        // width: 300,
        render: (val, record) => {
          const buttonList = getEditButton(record.status, taskTypeCodeRef.current, record.revoke);
          const pageConfigParam = `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`;
          return (
            <>
              <EnrichEditButton
                buttonList={buttonList}
                pageConfig={pageConfig}
                record={record}
                pageConfigParam={pageConfigParam}
                pageName="salesOrganizationMaintenance"
              />
              <MoreOperation
                record={record}
                opertations={{
                  tabs: taskTypeCodeRef.current,
                  status: record.status,
                }}
                fn={getTableList}
              />
            </>
          );
        },
      },
    ],
  });

  const { dispatch, tabList, tableList, sellerNameList, sellerCodeList, codeList } = props;
  const [batchList, setBatchList] = useState([]);
  const [batchObj, setBatchObj] = useState({});

  // 搜索的区域的配置
  const formItemData = [
    {
      name: 'sellerNameFull',
      label: '销售机构名称',
      // type: 'select',
      // config: { showSearch: true },
      // option: sellerNameList,
    },
    {
      name: 'sellerCode',
      label: '销售商代码',
      // type: 'select',
      // config: { showSearch: true },
      // option: sellerCodeList,
    },
    {
      name: 'contractName',
      label: '协议名称',
    },
    {
      name: 'statusCodes',
      type: 'select',
      config: { mode: 'multiple'},
      label: '状态',
      option: codeList['S001'],
    },
  ];
  /**
   * @description 获取表格数据
   */
  const getTableList = () => {
    if (props.tableLoading) return;
    const { taskTypeCode, pageSize, pageNum, searchData, fuzzy, direction, field } = state;
    dispatch({
      type: 'salesOrganizationMaintenance/getTableList',
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
    pathName: 'salesOrganizationMaintenance',
    dispatch,
    handlerDelete: batchDelete,
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
    // 获取搜索下拉框的值
    // 获取产品相关的数据
    // dispatch({
    //   type: 'salesOrganizationMaintenance/getOrgList',
    // });
    // 获取状态的值
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['S001'],
    });
  }, []);
  //   监控数值变化
  useEffect(() => {
    getTableList();
  }, [state.taskTypeCode, state.pageSize, state.pageNum, state.field, state.direction]);

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
      field: ''
    });
  }
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
  // 设置tab栏额外的按钮
  const setOperations = () => {
    return (
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
        pageName="salesOrganizationMaintenance"
      />
    );
  };

  // 切换tab标签
  const changeTab = _key => {
    props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: _key,
    });
    taskTypeCodeRef.current = _key;
    // 隐藏任务到达时间
    assign({
      taskTypeCode: _key,
      pageNum: 1,
      searchData: {},
      fuzzy: undefined,
      direction: '',
      field: ''
    });
  };

  /**
   *@description table选择框选择事件
   * @param {*} selectedRowKeys
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
    field = field == 'statusName' ? 'status' : field;
    assign({
      pageNum: state.pageSize == _pagination.pageSize ? _pagination.current : 1,
      pageSize: _pagination.pageSize,
      direction: _sorter.order ? _sorter.order.replace(/end/, '') : '',
      field,
    });
  };
  /**
   * 批量提交
   * @param {*} list
   */
  const handlerBatchSubmit = list => {
    dispatch({
      type: 'salesOrganizationMaintenance/batchCommit',
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
        pageCode="salesOrganizationMaintenance"
        dynamicHeaderCallback={callBackHandler}
        columns={state.columns}
        taskTypeCode={state.taskTypeCode}
        taskArrivalTimeKey="taskTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="350"
        loading={props.tableLoading}
        searchPlaceholder="请输入销售机构名称/销售商代码/协议名称"
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
        extra={setOperations()}
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
              scroll={{ x: state.columns.length * 200 + 600 }}
            />
            <MoreOperation
              opertations={{
                tabs: taskTypeCodeRef.current,
                statusKey: 'status',
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

const data = state => {
  const {
    loading,
    salesOrganizationMaintenance: { tableList, sellerCodeList, sellerNameList },
    dispatch,
    investorReview: { tabList, codeList },
    publicModel: { publicTas },
  } = state;
  return {
    tabList,
    tableList,
    dispatch,
    sellerCodeList,
    sellerNameList,
    codeList,
    publicTas,
    tableLoading: loading.effects['salesOrganizationMaintenance/getTableList'],
  };
};
export default connect(data)(Index);

// 交易单元管理

import React, { useEffect, useState } from 'react';
import { Tooltip, Button, Modal } from 'antd';
import { connect } from 'dva';
import { getPaginationConfig } from '@/pages/investorReview/func';
import Action from '@/utils/hocUtil';
import router from 'umi/router';
import { Table } from '@/components';
import List from '@/components/List';

const commonColAttr = (name = '') => {
  return {
    ellipsis: true,
    render: (t, r) => {
      const text = name ? r[name] : t;
      return (
        <Tooltip title={text}>
          {text
            ? text.toString().replace(/null/g, '-')
            : text === '' || text === undefined
            ? '-'
            : 0}
        </Tooltip>
      );
    },
  };
};

const Index = props => {
  // 初始化state
  const [state, setState] = useState({
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
        dataIndex: 'trusteeshipId',
        title: '托管人/适用托管人',
        sorter: true,
        width: 400,
        ...commonColAttr('trusteeshipIdName'),
      },
      {
        dataIndex: 'unitNumSH',
        title: '上海交易单元',
        sorter: true,
        width: 200,
        ...commonColAttr(),
      },
      {
        dataIndex: 'clearNo',
        title: '上海清算编号',
        sorter: true,
        width: 200,
        ...commonColAttr(),
      },
      {
        dataIndex: 'unitNumSZ',
        title: '深圳交易单元',
        sorter: true,
        width: 200,
        ...commonColAttr(),
      },
      {
        dataIndex: 'applyPro',
        title: '适用产品',
        sorter: true,
        width: 120,
        ...commonColAttr('applyProName'),
      },
      {
        dataIndex: 'settlementMode',
        title: '结算模式',
        sorter: true,
        ...commonColAttr('settlementModeName'),
      },
      {
        dataIndex: 'action',
        title: '操作',
        fixed: 'right',
        width: 240,
        render: (text, record) => {
          return (
            <>
              <Action key="tradingUnitManager:show" code="tradingUnitManager:show">
                <Button onClick={() => goDetailPage(record)} type="link">
                  查看
                </Button>
              </Action>
              <Action key="tradingUnitManager:update" code="tradingUnitManager:update">
                <Button onClick={() => goUpdatePage(record)} type="link">
                  修改
                </Button>
              </Action>
              <Action key="tradingUnitManager:delete" code="tradingUnitManager:delete">
                <Button onClick={() => deleteRow(record)} type="link">
                  删除
                </Button>
              </Action>
            </>
          );
        },
      },
    ],
  });

  const { dispatch, tableList, hostingList } = props;

  /**
   * @description 获取表格数据
   */
  const getTableList = () => {
    if (props.tableLoading) return;
    const { pageSize, pageNum, searchData, fuzzy, direction, field } = state;
    dispatch({
      type: 'tradingUnitManager/getTableList',
      payload: {
        ...searchData,
        pageSize,
        pageNum,
        keyWords: fuzzy,
        direction,
        field,
      },
    });
  };
  /**
   * @description 合并更新 封装后的setState
   * @params {object} newVal 新的对象
   */
  const assign = newVal => {
    setState({ ...state, ...newVal });
  };
  // 搜索的区域的配置
  const formItemData = [
    {
      name: 'trusteeshipIds',
      label: '托管人/适用托管人',
      width: 10,
      type: 'select',
      readSet: { name: 'orgName', code: 'id' },
      option: hostingList,
      config: { mode: 'multiple' },
    },
    // {
    //   name: 'market',
    //   label: '交易市场',
    //   type: 'select',
    //   option: codeList['T003'],
    //   config: { mode: 'tags' },
    // },
    {
      name: 'unitNum',
      label: '交易单元号',
    },
  ];
  // 初始化
  useEffect(() => {
    dispatch({
      type: 'tradingUnitManager/getHostingList',
      payload: {
        orgType: 'J004_2',
      },
    });
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['T003'],
    });
  }, []);

  //   监控数值变化
  useEffect(() => {
    getTableList();
  }, [state.pageSize, state.pageNum, state.field, state.direction]);

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

  /**
   * 搜索组件的搜索回调函数
   * @param {object} param  搜索组件传回来的值
   */
  const handlerSearch = param => {
    if (param) {
      param.trusteeshipIds = (param.trusteeshipIds && param.trusteeshipIds) || null;
      // param['market'] = (param['market'] && param['market'].join()) || null;
    }
    assign({
      pageNum: 1,
      searchData: param,
      fuzzy: undefined,
    });
  };

  //重置
  const handleReset = () => {
    assign({
      pageNum: 1,
      searchData: {},
      fuzzy: undefined,
      field: '',
      direction: '',
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

  // 跳转至查看页面
  const goDetailPage = row => {
    const { trusteeshipId, applyPro, settlementMode } = row;
    return router.push(
      `/dynamicPage/pages/交易单元管理/8aaa82287e4c5163017e75f012900002/查看?trusteeshipId=${trusteeshipId}&applyPro=${applyPro}&settlementMode=${settlementMode}`,
    );
  };

  // 跳转至修改页面
  const goUpdatePage = row => {
    const { trusteeshipId, applyPro, settlementMode } = row;
    return router.push(
      `/dynamicPage/pages/交易单元管理/8aaa82287e4c5163017e75419a690001/修改?trusteeshipId=${trusteeshipId}&applyPro=${applyPro}&settlementMode=${settlementMode}`,
    );
  };

  // 新增
  const addRow = () => {
    return router.push(`/dynamicPage/pages/交易单元管理/8aaa82287e4c5163017e7181c6320000/新增`);
  };

  // 调用删除api
  const handleDeletApi = row => {
    const { pid, trusteeshipId, applyPro, settlementMode } = row;
    dispatch({
      type: 'tradingUnitManager/deleteTrandingBoothInfo',
      payload: {
        pid,
        trusteeshipId,
        applyPro,
        settlementMode,
      },
      callback: () => {
        // 删除成功后，重新刷新列表数据
        if (state.pageNum === 1) {
          getTableList();
        }
        assign({
          pageNum: 1,
        });
      },
    });
  };

  // 确认删除提示框
  const deleteRow = row => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 调用删除接口
        handleDeletApi(row);
      },
    });
  };

  /**
   * @description table页码切换的回调
   * @param {object} _pagination 分页器的对象
   * @param {object} _filters 筛选的对象
   * @param {object} _sorter 排序的对象
   */
  const tableChange = (_pagination, _filters, _sorter) => {
    // const mapObj = {
    //   trusteeshipIds: 'trusteeshipIds',
    //   brokerName: 'broker',
    //   applyProName: 'applyPro',
    //   marketName: 'market',
    //   unitTypeName: 'unitType',
    //   settlementModes: 'settlementModes',
    //   openStatusName: 'operator',
    // };
    // let field = _sorter.order ? _sorter.field : '';
    // field = mapObj[field] ? mapObj[field] : field;
    assign({
      pageNum: _pagination.current,
      pageSize: _pagination.pageSize,
      direction: _sorter.order ? _sorter.order.replace(/end/, '') : '',
      field: _sorter.order ? _sorter.field : '',
    });
  };

  const callBackHandler = value => {
    assign({
      columns: value,
    });
  };

  return (
    <>
      <List
        pageCode="tradingUnitManager"
        dynamicHeaderCallback={callBackHandler}
        columns={state.columns}
        taskTypeCode={null}
        title="交易单元管理"
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="350"
        loading={props.tableLoading}
        searchPlaceholder="请输入托管人/适用托管人"
        fuzzySearch={handlerFuzzySearch}
        extra={
          <Action key="tradingUnitManager:add" code="tradingUnitManager:add">
            <Button onClick={addRow} type="primary">
              新增
            </Button>
          </Action>
        }
        tableList={
          <Table
            rowKey={(item, index) => `${index}`}
            loading={props.tableLoading}
            dataSource={tableList.rows}
            columns={state.columns}
            onChange={tableChange}
            scroll={{ x: true }}
            pagination={getPaginationConfig(tableList.total, state.pageSize, {
              current: state.pageNum,
            })}
          />
        }
      />
    </>
  );
};

const data = state => {
  const {
    loading,
    tradingUnitManager: { tableList, hostingList },
    investorReview: { codeList },
    dispatch,
  } = state;
  return {
    tableList,
    dispatch,
    hostingList,
    codeList,
    tableLoading: loading.effects['tradingUnitManager/getTableList'],
  };
};
export default connect(data)(Index);

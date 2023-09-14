// 干系人信息管理

import React, { useEffect, useState } from 'react';
import { message, Modal, Tooltip } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import EnrichEditButton from '@/components/AdvancSearch/EnrichEditButton';
import { getPaginationConfig, isNullObj } from '@/pages/investorReview/func';
import Action from '@/utils/hocUtil';
import { Table } from '@/components';
import List from '@/components/List';

// 干系人信息管理
const Index = props => {
  const {
    dispatch,
    tableList,
    stakeholdersTypeList,
    orgNameList,
    searchNameList,
    productEnum,
  } = props;
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
  });
  // 默认的批量操作的按钮
  const defaultBtnList = [
    { label: '审核', action: 'review' },
    { label: '反审核', action: 'audit' },
    // { label: '删除', action: 'delete' },
  ];
  // 批量处理的按钮们
  const [batchBtnList, setBatchBtnList] = useState(defaultBtnList);
  // 批量的数据
  const [batchList, setBatchList] = useState([]);
  const [batchObj, setBatchObj] = useState({});

  const [columns, setColumns] = useState([
    {
      key: 'proName',
      dataIndex: 'proName',
      title: '产品全称',
      sorter: true,
      width: 400,
      render: text => {
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
    },
    {
      key: 'proCode',
      dataIndex: 'proCode',
      title: '产品代码',
      sorter: true,
      width: 120,
      render: text => {
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
    },
    {
      key: 'assetType',
      dataIndex: 'assetType',
      title: '产品类型',
      sorter: true,
      width: 150,
      render: text => {
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
    },
    {
      key: 'category',
      dataIndex: 'category',
      title: '类别',
      sorter: true,
      width: 150,
      render: text => {
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
    },
    {
      key: 'stakeholderType',
      dataIndex: 'stakeholderType',
      title: '干系人类别',
      sorter: true,
      width: 150,
      render: text => {
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
    },
    {
      key: 'agencyName',
      dataIndex: 'agencyName',
      title: '机构名称',
      sorter: true,
      width: 400,
      render: text => {
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
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '姓名',
      sorter: true,
      width: 120,
      render: text => {
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
    },
    {
      key: 'startDate',
      dataIndex: 'startDate',
      title: '开始任职日期',
      sorter: true,
      width: 180,
      render: text => {
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
    },
    {
      key: 'departureDate',
      dataIndex: 'departureDate',
      title: '离任日期',
      sorter: true,
      width: 180,
      render: text => {
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
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      sorter: true,
      width: 100,
      render: text => {
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
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作',
      fixed: 'right',
      render: (val, record) => {
        const buttonList = [
          {
            label: '查看',
            code: 'show',
            handler: () => {
              // fnLink(
              //   'stakeholderInfoManager:show',
              //   `?id=${record.id}&proCode=${record.proCode}&type=show`,
              // );
              router.push(
                `/productDataManage/stakeholderInfoManager/index/detail?id=${record.id}&proCode=${record.proCode}&type=show`,
              );
            },
          },
          {
            label: '修改',
            code: 'modify',
            // config: { disabled: record.statusCode === 'D001_2' },
            // unRender: record.statusCode !== 'D001_2',
            handler: () => {
              // fnLink(
              //   'stakeholderInfoManager:show',
              //   `?id=${record.id}&proCode=${record.proCode}&type=modify`,
              // );
              router.push(
                `/productDataManage/stakeholderInfoManager/index/updateInfo?id=${record.id}&proCode=${record.proCode}&type=modify`,
              );
            },
          },
          {
            label: '审核',
            code: 'review',
            config: {
              disabled: record.statusCode === 'D001_2',
              // loading: !!reviewLoading,
            },
            // unRender: record.statusCode !== 'D001_2',
            handler: () => {
              Modal.confirm({
                title: '请确认是否审核?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  dispatch({
                    type: 'stakeholderInfoManager/updateChecked',
                    payload: {
                      ids: [record.id],
                      flag: 0,
                    },
                    callback: () => {
                      message.success('操作成功');
                      getTableList();
                    },
                  });
                },
              });
            },
          },
          {
            label: '反审核',
            code: 'audit',
            config: {
              disabled: record.statusCode === 'D001_1',
              // loading: !!reviewLoading,
            },
            // unRender: record.statusCode !== 'D001_1',
            handler: () => {
              Modal.confirm({
                title: '请确认是否反审核?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  dispatch({
                    type: 'stakeholderInfoManager/updateChecked',
                    payload: {
                      ids: [record.id],
                      flag: 3,
                    },
                    callback: () => {
                      message.success('操作成功');
                      getTableList();
                    },
                  });
                },
              });
            },
          },
          {
            label: '删除',
            code: 'delete',
            config: {
              disabled: record.statusCode === 'D001_2',
              // loading: !!deleteLoading,
            },
            // unRender: record.statusCode !== 'D001_2',
            handler: () => {
              Modal.confirm({
                title: '请确认是否删除?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  dispatch({
                    type: 'stakeholderInfoManager/deleteByIds',
                    payload: {
                      ids: [record.id],
                      stakeProduceIds: [record.stakeProduceId],
                    },
                    callback: () => {
                      message.success('删除成功');
                      getTableList();
                    },
                  });
                },
              });
            },
          },
        ];
        const pageConfigParam = `?id=${record.id}&proCode=${record.proCode}`;
        return (
          <EnrichEditButton
            buttonList={buttonList}
            pageConfig={pageConfig}
            record={record}
            pageConfigParam={pageConfigParam}
            pageName="stakeholderInfoManager"
          />
        );
      },
    },
  ]);

  // 表格的表头

  // /**
  //  * 类别切换的时候
  //  * @param {*} code
  //  */
  // const handlerCategoryChange = code => {
  //   dispatch({
  //     type: 'stakeholderInfoManager/getStakeholdersTypeList',
  //     payload: {
  //       flag: code,
  //     },
  //   });
  // };

  // 页面按钮跳转配置
  const pageConfig = {
    pathName: 'stakeholderInfoManager',
    dispatch,
  };

  /**
   * @description 获取表格数据
   */
  const getTableList = () => {
    if (props.tableLoading) return;
    const { pageSize, pageNum, searchData, fuzzy, direction, field } = state;
    dispatch({
      type: 'stakeholderInfoManager/getTableList',
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
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: productEnum,
    },
    // {
    //   name: 'proCode',
    //   label: '产品代码',
    // },
    {
      name: 'category',
      label: '类别',
      type: 'select',
      option: [
        { name: '内部干系人', code: 0 },
        { name: '外部干系人', code: 1 },
      ],
      config: { mode: 'multiple', maxTagCount: 1 },
      // config: {
      //   onChange: handlerCategoryChange,
      // },
    },
    {
      name: 'stakeholderType',
      label: '干系人类型',
      type: 'select',
      config: { mode: 'multiple', maxTagCount: 1 },
      option: stakeholdersTypeList,
    },
    {
      name: 'agencyName',
      label: '机构名称',
      type: 'select',
      config: { mode: 'multiple', maxTagCount: 1 },
      option: orgNameList,
      readSet: { name: 'orgName', code: 'id' },
    },
    {
      name: 'name',
      label: '姓名',
      type: 'select',
      config: { mode: 'multiple', maxTagCount: 1 },
      option: searchNameList,
      readSet: { name: 'name', code: 'id' },
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'stakeholderInfoManager/getStakeholdersTypeList',
      payload: {
        flag: 2,
      },
    });
    // 获取机构下拉
    dispatch({
      type: 'stakeholderInfoManager/getOrgNameList',
    });
    dispatch({
      type: 'stakeholderInfoManager/getSearchNameList',
    });
    dispatch({
      type: 'stakeholderInfoManager/getProductEnumList',
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
      comparisonBtn(tempList);
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
    assign({
      pageNum: state.pageSize == _pagination.pageSize ? _pagination.current : 1,
      pageSize: _pagination.pageSize,
      direction: _sorter.order ? _sorter.order.replace(/end/, '') : '',
      field: _sorter.order ? _sorter.field : '',
    });
  };
  /**
   * 比对批量的按钮
   */
  const comparisonBtn = list => {
    const tempBtnList = [];
    if (list.every(item => item.statusCode === 'D001_1')) {
      tempBtnList.push({ label: '审核', action: 'review' });
    }
    if (list.every(item => item.statusCode === 'D001_2')) {
      tempBtnList.push({ label: '反审核', action: 'audit' });
    }
    // if (list.every(item => item.statusCode === 'D001_1')) {
    //   tempBtnList.push({ label: '删除', action: 'delete' });
    // }
    setBatchBtnList(tempBtnList);
  };

  /**
   * 批量操作的回调函数
   */
  const handlerBatch = action => {
    console.log(batchList);
    if (!batchList || batchList.length <= 0) return message.warn('请选择要操作的数据');
    const ids = batchList.map(item => item.id);
    switch (action) {
      case 'delete':
        const stakeProduceIds = batchList.map(item => item.stakeProduceId);
        Modal.confirm({
          title: '请确认是否删除?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'stakeholderInfoManager/deleteByIds',
              payload: {
                ids,
                stakeProduceIds,
              },
              callback: () => {
                message.success('删除成功');
                handlerSuccessCallback();
                getTableList();
              },
            });
          },
        });
        break;
      case 'review':
        Modal.confirm({
          title: '请确认是否审核?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'stakeholderInfoManager/updateChecked',
              payload: {
                ids,
                flag: 0,
              },
              callback: () => {
                message.success('操作成功');
                handlerSuccessCallback();
                getTableList();
              },
            });
          },
        });
        break;
      case 'audit':
        Modal.confirm({
          title: '请确认是否反审核?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'stakeholderInfoManager/updateChecked',
              payload: {
                ids,
                flag: 3,
              },
              callback: () => {
                message.success('操作成功');
                handlerSuccessCallback();
                getTableList();
              },
            });
          },
        });
        break;
    }
  };

  /**
   * 批量处理接口调用成功以后的回调
   */
  const handlerSuccessCallback = () => {
    setBatchObj({});
    assign({ selectedRowKeys: [] });
  };

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        pageCode="stakeholderInfoManager"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={null}
        title="干系人信息管理"
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="300"
        fuzzySearch={handlerFuzzySearch}
        searchPlaceholder="请输入产品全称/产品代码/机构名称"
        extra={
          <Action code="stakeholderInfoManager:add">
            <EnrichEditButton
              // moreBtnStyle={{ float: 'right', zIndex: 99 }}
              buttonConfig={{ type: 'primary' }}
              buttonList={[
                {
                  label: '新增',
                  code: 'add',
                  type: 'button',
                  handler: () => {
                    dispatch({
                      type: 'stakeholderInfoManager/setResetList',
                    });
                    // fnLink('stakeholderInfoManager:show', `?type=add`);
                    router.push(
                      '/productDataManage/stakeholderInfoManager/index/updateInfo?type=add',
                    );
                  },
                },
              ]}
              pageConfig={pageConfig}
            />
          </Action>
        }
        tableList={
          <>
            <Table
              rowSelection={rowSelection}
              dataSource={tableList.taskList}
              columns={columns}
              pagination={getPaginationConfig(tableList.total, state.pageSize, {
                current: state.pageNum,
              })}
              onChange={tableChange}
              rowKey={record => record.id}
              loading={props.tableLoading}
              scroll={{ x: columns.length * 200 + 50 }}
            />
            <EnrichEditButton
              moreBtnStyle={{
                float: 'left',
                marginTop: '-48px',
                marginLeft: '10px',
                display: batchBtnList.length === 0 ? 'none' : 'block',
              }}
              buttonConfig={{ type: null }}
              buttonList={[
                {
                  label: '批量操作',
                  type: 'more',
                  batchHandler: handlerBatch,
                  list: batchBtnList,
                },
              ]}
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
    stakeholderInfoManager: {
      tableList,
      stakeholdersTypeList,
      orgNameList,
      searchNameList,
      productEnum,
    },
    dispatch,
  } = state;
  return {
    tableList,
    dispatch,
    stakeholdersTypeList,
    orgNameList,
    productEnum,
    searchNameList,
    tableLoading: loading.effects['stakeholderInfoManager/getTableList'],
    reviewLoading: loading.effects['stakeholderInfoManager/updateChecked'],
    deleteLoading: loading.effects['stakeholderInfoManager/deleteByIds'],
  };
};
export default connect(data)(Index);

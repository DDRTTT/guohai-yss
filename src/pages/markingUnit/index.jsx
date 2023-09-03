/**
 * 交易单元申请页面
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Tabs, Tooltip } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import { connect } from 'dva';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Card, CommonSearch, Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const { confirm } = Modal;

const Index = ({
  fnLink,
  dispatch,
  listLoading,
  markingUnit: { dicts, markingUnitTableData },
  publicTas,
}) => {
  const proTrusBankList = useRef([]); // 托管行下拉列表
  const totalData = useRef(0); // 页码总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值
  const taskStatusData = useRef(''); // 状态
  const proTrusBankData = useRef(''); // 托管行
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const deleteData = useRef([]); // 删除参数
  const backOutData = useRef([]); // 撤销参数
  const [batchData, setDatchData] = useState([]); // 批量操作参数
  const [batchObj, setBatchObj] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState(
    // 表头数据(有时间)
    [
      {
        title: '托管行',
        dataIndex: 'proTrusBank',
        key: 'proTrusBank',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
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
        title: '标题',
        dataIndex: 'titleMarketingUnit',
        key: 'titleMarketingUnit',
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
        ellipsis: true,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        key: 'taskTime',
        sorter: true,
        width: 180,
        ellipsis: {
          showTitle: false,
        },
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
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        width: 120,
        ellipsis: {
          showTitle: false,
        },
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
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        render: (_, record) => {
          switch (taskTypeCodeData.current) {
            case 'T001_1':
              switch (record.status) {
                case '待提交':
                  return (
                    <div>
                      {handleAddButtonUpdate(record)}
                      {handleAddButtonCopy(record)}
                      {handleAddButtonCommit(record)}
                      {handleAddButtonDelete(record)}
                    </div>
                  );
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonCheck(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                        <span style={{ paddingLeft: '-5px' }}>
                          <MoreOperation record={record} fn={handleGetListData} />
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonCheck(record)}
                      {handleAddButtonTransferHistory(record)}
                      <span style={{ paddingLeft: '-5px' }}>
                        <MoreOperation record={record} fn={handleGetListData} />
                      </span>
                    </div>
                  );

                default:
                  return '';
              }
            case 'T001_3':
              switch (record.status) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );

                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            case 'T001_4':
              return (
                <div>
                  {handleAddButtonUpdate(record)}
                  {handleAddButtonCopy(record)}
                  {handleAddButtonCommit(record)}
                  {handleAddButtonDelete(record)}
                </div>
              );
            case 'T001_5':
              switch (record.status) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  }
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );

                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            default:
              return '';
          }
        },
      },
    ],
  );

  // 处理分页以后的数据
  useEffect(() => {
    if (JSON.stringify(batchObj) !== '{}') {
      let tempList = [];
      for (const key in batchObj) {
        if (batchObj.hasOwnProperty(key)) {
          const element = batchObj[key];
          tempList = tempList.concat(element);
        }
      }
      setDatchData(tempList);
    }
  }, [batchObj]);

  /**
   * 更新请求参数
   */
  const handleGetDataObj = () => {
    let proTrusBankDataObj = '';
    let taskStatusDataObj = '';
    for (const a in proTrusBankData.current) {
      if (proTrusBankData.current.hasOwnProperty(a)) {
        proTrusBankDataObj += `${proTrusBankData.current[a]},`;
      }
    }
    for (const a in taskStatusData.current) {
      if (taskStatusData.current) {
        taskStatusDataObj += `${taskStatusData.current[a]},`;
      }
    }
    proTrusBankDataObj = proTrusBankDataObj.slice(0, proTrusBankDataObj.length - 1);
    taskStatusDataObj = taskStatusDataObj.slice(0, taskStatusDataObj.length - 1);

    dataObj.current = {
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      taskTypeCode: taskTypeCodeData.current,
      proTrusBank: proTrusBankDataObj,
      status: taskStatusDataObj,
      keyWords: keyWordsData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
    // console.log('请求参数 ---', dataObj.current);
  };

  // 获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'markingUnit/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  // 请求表单下拉选项
  const handleGetSelectOptions = () => {
    // 'J004' 托管行 / 'S001' 状态
    dispatch({
      type: 'markingUnit/getDicts',
      payload: { codeList: ['J004', 'S001'] },
    });
  };

  /**
   * 获取机构下拉字典(托管人)
   * @param {String} code 机构查询参数
   * @param {Object} refData 机构赋值对象
   */
  const handleGetOrgNewDicts = (code, refData) => {
    dispatch({
      type: 'markingUnit/getOrgDictsFunc',
      payload: code,
      callback: res => {
        refData.current = res;
      },
    });
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param   {key}         搜索框值
   */
  const blurSearch = key => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    keyWordsData.current = key;
    handleGetListData();
  };

  /**
   * 精确查询数据取值
   * @method  handleExactSerach
   */
  const handlerSearch = fieldsValue => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    keyWordsData.current = '';
    if (fieldsValue) {
      proTrusBankData.current = fieldsValue.proTrusBank;
      taskStatusData.current = fieldsValue.status;
      directionData.current = fieldsValue.direction;
      fieldData.current = fieldsValue.field;
    }
    handleGetDataObj();
    handleGetListData();
  };

  // 重置
  const handleReset = () => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    proTrusBankData.current = '';
    taskStatusData.current = '';
    directionData.current = '';
    fieldData.current = '';
    keyWordsData.current = '';
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 页码属性变更
   * @return  {string}
   * @param current
   * @param pageSize
   */
  const handleUpdataPageSize = (current, pageSize) => {
    pageSizeData.current = pageSize;
    pageNumData.current = 1;
    handleGetDataObj();
  };
  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
  };
  // 页码属性设置
  const paginationProps = {
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPageSize,
    showQuickJumper: true,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  /**
   * @method handleGoAdd 跳转流程引擎-流程发起
   */
  const handleGoAdd = () => {
    fnLink('markingUnit:link', '');
  };

  // 修改
  const handleCanUpdate = record => {
    fnLink(
      'markingUnit:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 复制
  const handleCanCopy = record => {
    fnLink('markingUnit:copy', `?processInstId=${record.processInstanceId}`);
  };

  // 提交
  const handleCanSubmit = record => {
    fnLink(
      'markingUnit:commit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 撤销
  const handleCanBackOut = record => {
    backOutData.current = [record.processInstanceId];
    confirm({
      title: '请确认是否撤销?',
      onOk() {
        dispatch({
          type: 'markingUnit/getRevokeFunc',
          payload: backOutData.current,
          callback: () => {
            handleGetListData();
          },
        });
      },
      onCancel() {
        backOutData.current = [];
      },
    });
  };

  // 删除
  const handleCanDelete = record => {
    deleteData.current = [record.id];
    confirm({
      title: '请确认是否删除?',
      onOk() {
        dispatch({
          type: 'markingUnit/getDeleteFunc',
          payload: deleteData.current,
          callback: () => {
            handleGetListData();
          },
        });
      },
      onCancel() {
        deleteData.current = [];
      },
    });
  };

  // 详情
  const handleCanDetails = record => {
    const url = `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`;
    router.push(url);
  };

  // 办理
  /**
   * 去流程引擎的办理页面需要的参数
   * @method handleCanCheck
   * @params taskId 任务id
   * @params processDefinitionId 流程定义id
   * @params processInstanceId 流程实例id
   * @params taskDefinitionKey 任务定义key
   */
  const handleCanCheck = record => {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      id: record.id,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      proCode: record.proCode,
    };
    dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  };

  /**
   * 创建按钮-修改
   */
  const handleAddButtonUpdate = record => {
    return (
      <Action code="markingUnit:update">
        <Button type="link" size="small" onClick={() => handleCanUpdate(record)}>
          修改
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-复制
   */
  const handleAddButtonCopy = record => {
    return (
      // <Action code="markingUnit:copy">
      <Button type="link" size="small" onClick={() => handleCanCopy(record)}>
        复制
      </Button>
      // </Action>
    );
  };

  /**
   * 创建按钮-提交
   */
  const handleAddButtonCommit = record => {
    return (
      <Action code="markingUnit:commit">
        <Button type="link" size="small" onClick={() => handleCanSubmit(record)}>
          提交
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-办理
   */
  const handleAddButtonCheck = record => {
    return (
      <Action code="markingUnit:check">
        <Button type="link" size="small" onClick={() => handleCanCheck(record)}>
          办理
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-流转历史
   */
  const handleAddButtonTransferHistory = record => {
    return (
      <Action code="markingUnit:transferHistory">
        <Button type="link" size="small" onClick={() => handleShowTransferHistory(record)}>
          流转历史
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-撤销
   */
  const handleAddButtonBackOut = record => {
    return (
      <Action code="markingUnit:backOut">
        <Button type="link" size="small" onClick={() => handleCanBackOut(record)}>
          撤销
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-删除
   */
  const handleAddButtonDelete = record => {
    return (
      <Action code="markingUnit:delete">
        <Button type="link" size="small" onClick={() => handleCanDelete(record)}>
          删除
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-详情
   */
  const handleAddButtonDetails = record => {
    return (
      <Action code="markingUnit:details">
        <Button type="link" size="small" onClick={() => handleCanDetails(record)}>
          详情
        </Button>
      </Action>
    );
  };

  /**
   * 表格多选框按钮
   * @const   rowSelection
   * @method  onChange
   * @param   {selectedRows} 选中项
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, rows) => {
      setBatchObj({ ...batchObj, [pageNumData.current]: rows });
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  /**
   * 排序方法
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
    handleGetListData();
  };

  /**
   * 渲染表格数据
   * @method  tableData
   * @param
   * @return  {Object}     表格数据及属性
   */
  const tableData = columns => {
    return (
      <Table
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.taskId} // key值
        dataSource={markingUnitTableData.rows} // 表数据源
        columns={columns} // 表头数据
        onChange={handleChangeSorter}
        scroll={{ x: 1300 }}
      />
    );
  };

  /**
   * 切换选项卡
   * @method  handleClickGetTabsData
   * @param   {} key 选项卡key值
   * @return  {void} 数据获取后自动渲染
   */
  const handleClickGetTabsData = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    taskTypeCodeData.current = key;
    handleReset();
  };

  /**
   * 批量提交
   */
  const handlerBatchSubmit = () => {
    dispatch({
      type: 'investorReview/batchCommit',
      payload: batchData,
      callback: () => {
        handleGetListData();
      },
    });
  };

  /**
   * 批量处理接口调用成功以后的回调
   */
  const handlerSuccessCallback = () => {
    setSelectedRowKeys([]);
    setBatchObj({});
  };

  useEffect(() => {
    handleGetDataObj(); // 获取请求参数
    handleGetSelectOptions(); // 获取展开搜索下拉选项框数据
    handleGetOrgNewDicts('J004_2', proTrusBankList); // 托管人下拉列表
    handleGetListData(); // 发起分页列表数据请求
  }, []);
  // 搜索组件配置
  const formItemData = [
    {
      name: 'proTrusBank',
      label: '托管行',
      type: 'select',
      readSet: { name: 'orgName', code: 'id' },
      config: { mode: 'multiple' },
      option: proTrusBankList.current,
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple' },
      option: dicts.S001,
    },
  ];

  const callBackHandler = value => {
    setColumns(value);
  };
  return (
    <>
      <List
        pageCode="markingUnit"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={taskTypeCodeData.current}
        taskArrivalTimeKey="taskTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="300"
        searchPlaceholder="请输入托管行"
        fuzzySearch={blurSearch}
        tabs={{
          tabList: [
            { key: 'T001_1', tab: '我待办' },
            { key: 'T001_3', tab: '我发起' },
            { key: 'T001_4', tab: '未提交' },
            { key: 'T001_5', tab: '已办理' },
          ],
          activeTabKey: taskTypeCodeData.current,
          onTabChange: handleClickGetTabsData,
        }}
        extra={
          <Action code="markingUnit:link">
            <Button type="primary" onClick={handleGoAdd} className={styles.startButton}>
              发起流程
            </Button>
          </Action>
        }
        tableList={tableData(columns)}
      />

      <MoreOperation
        batchStyles={{ position: 'relative', left: '35px', top: '-75px' }}
        opertations={{
          tabs: taskTypeCodeData.current,
          statusKey: 'checked',
        }}
        fn={handleGetListData}
        type="batch"
        batchList={batchData}
        submitCallback={handlerBatchSubmit}
        successCallback={handlerSuccessCallback}
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ markingUnit, loading, publicModel: { publicTas } }) => ({
        markingUnit,
        publicTas,
        listLoading: loading.effects['markingUnit/fetch'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

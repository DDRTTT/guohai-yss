/**
 * 参数设置页面
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
  publicTas,
  argumentsSet: { dicts, proTypeDatas, proNameAndCodeData, argumentsSetTableData },
}) => {
  const totalData = useRef(0); // 页码总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值
  const proNameData = useRef([]); // 产品全称
  const proCodeData = useRef([]); // 产品代码
  const taskStatusData = useRef([]); // 状态
  const proTypeData = useRef([]); // 产品类型
  const proParamTypeData = useRef([]); // 参数类型
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  // const [keyWordsData, setKeyWordsData] = useState(''); // 模糊搜索关键字
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
        title: '产品简称',
        dataIndex: 'proFname',
        key: 'proFname',
        sorter: true,
        width: 250,
        render: text => {
          return (
            <Tooltip title={text}>
              <span>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        ...titleRender,
        width: 150,
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        key: 'proTypeName',
        ...titleRender,
        width: 150,
      },
      {
        title: '参数类型',
        dataIndex: 'proParamTypeName',
        key: 'proParamTypeName',
        ...titleRender,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskArriveTime',
        key: 'taskArriveTime',
        ...titleRender,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ...titleRender,
        width: 150,
        render: text => {
          if (text === 'S001_1') {
            return '待提交';
          }
          if (text === 'S001_2') {
            return '流程中';
          }
          if (text === 'S001_3') {
            return '已结束';
          }
          return '';
        },
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        render: (_, record) => {
          switch (taskTypeCodeData.current) {
            case 'T001_1':
              switch (record.status) {
                case 'S001_1':
                  return (
                    <div>
                      {handleAddButtonUpdate(record)}
                      {handleAddButtonCopy(record)}
                      {handleAddButtonCommit(record)}
                      {handleAddButtonDelete(record)}
                    </div>
                  );
                case 'S001_2':
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
                case 'S001_2':
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

                case 'S001_3':
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
                case 'S001_1':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                case 'S001_2':
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

                case 'S001_3':
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

  // 字符过长省略(20 / 包含数组类型)
  const handleAddTooltip20 = val => {
    if (typeof val === 'string') {
      if (val.length > 20) {
        return (
          <Tooltip title={val}>
            <span>{val ? `${val.substr(0, 17)}···` : '-'}</span>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={val}>
          <span>{val || '-'}</span>
        </Tooltip>
      );
    }
    if (Array.isArray(val)) {
      const str = val.toLocaleString();
      if (str.length > 20) {
        return (
          <Tooltip title={val}>
            <span>{val ? `${val.substr(0, 17)}···` : '-'}</span>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={str}>
          <span>{str || '-'}</span>
        </Tooltip>
      );
    }
    return (
      <Tooltip title={val}>
        <span>{val || '-'}</span>
      </Tooltip>
    );
  };

  const titleRender = {
    sorter: true,
    render: val => {
      return handleAddTooltip20(val);
    },
  };

  // 处理分页以后的数据
  useEffect(() => {
    if (!JSON.stringify(batchObj)) {
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
   * @method  handleGetDataObj
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      taskTypeCode: taskTypeCodeData.current,
      keyWords: keyWordsData.current,
      proType: proTypeData.current,
      proParamType: proParamTypeData.current,
      status: taskStatusData.current,
      proName: proNameData.current,
      proCode: proCodeData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'argumentsSet/getProNameAndCodeFunc',
    });
  };

  const handleGetProTypeData = () => {
    dispatch({
      type: 'argumentsSet/getProTypeFunc',
    });
  };

  // 请求:获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'argumentsSet/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  // 请求:获取表单下拉选项
  const handleGetSelectOptions = () => {
    // 'CS021' 参数类型 / 'S001' 状态 / 'A002' 产品类型
    dispatch({
      type: 'argumentsSet/getDicts',
      payload: { codeList: ['CS021', 'S001', 'A002'] },
    });
  };

  /**
   * 精确查询数据取值
   * @method  handleExactSerach
   */
  const handleExactSerach = values => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    proNameData.current = values.proName;
    proCodeData.current = values.proCode;
    proTypeData.current = values.proType;
    proParamTypeData.current = values.proParamType;
    taskStatusData.current = values.status;
    keyWordsData.current = values.keyWords;
    handleGetDataObj();

    handleGetListData();
  };

  // 重置
  const handleReset = () => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    proNameData.current = [];
    proCodeData.current = [];
    proTypeData.current = [];
    proParamTypeData.current = [];
    taskStatusData.current = [];
    directionData.current = '';
    fieldData.current = '';
    keyWordsData.current = '';
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 页码属性变更
   * @param   {pageSize}     string    表格行数据
   * @return  {string}
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
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPageSize,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  /**
   * @method handleGoAdd 跳转流程引擎-发起流程
   */
  const handleGoAdd = () => {
    fnLink('argumentsSet:link', '');
  };

  // 发起流程按钮
  const operations = (
    <Action code="argumentsSet:link">
      <Button type="primary" onClick={handleGoAdd} className={styles.startButton}>
        发起流程
      </Button>
    </Action>
  );

  // 修改
  const handleCanUpdate = record => {
    fnLink(
      'argumentsSet:update',
      `?proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&id=${record.id}&processInstId=${record.processInstanceId}`,
    );
  };

  // 复制
  const handleCanCopy = record => {
    fnLink('argumentsSet:copy', `?copyId=${record.processInstanceId}`);
  };

  // 提交
  const handleCanSubmit = record => {
    fnLink(
      'argumentsSet:commit',
      `?proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&id=${record.id}&processInstId=${record.processInstanceId}`,
    );
  };

  // 撤销
  const handleCanBackOut = record => {
    backOutData.current = [record.processInstanceId];
    confirm({
      title: '请确认是否撤销?',
      onOk() {
        dispatch({
          type: 'argumentsSet/getRevokeFunc',
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
          type: 'argumentsSet/getDeleteFunc',
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
      processInstanceId: record.processInstanceId,
      id: record.id,
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
      <Action code="argumentsSet:update">
        <Button type="link" onClick={() => handleCanUpdate(record)} style={{ width: '45px' }}>
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
      <Action code="argumentsSet:copy">
        <Button type="link" onClick={() => handleCanCopy(record)} style={{ width: '45px' }}>
          复制
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-提交
   */
  const handleAddButtonCommit = record => {
    return (
      <Action code="argumentsSet:commit">
        <Button type="link" onClick={() => handleCanSubmit(record)} style={{ width: '45px' }}>
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
      <Action code="argumentsSet:check">
        <Button type="link" onClick={() => handleCanCheck(record)} style={{ width: '45px' }}>
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
      <Action code="argumentsSet:transferHistory">
        <Button
          type="link"
          onClick={() => handleShowTransferHistory(record)}
          style={{ width: '75px' }}
        >
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
      <Action code="argumentsSet:backOut">
        <Button type="link" onClick={() => handleCanBackOut(record)} style={{ width: '45px' }}>
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
      <Action code="argumentsSet:delete">
        <Button type="link" onClick={() => handleCanDelete(record)} style={{ width: '45px' }}>
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
      <Action code="argumentsSet:details">
        <Button type="link" onClick={() => handleCanDetails(record)} style={{ width: '45px' }}>
          详情
        </Button>
      </Action>
    );
  };

  /**
   * 表格多选框按钮
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
    } else if (sorter.order === 'desc') {
      directionData.current = 'descend'; // 降序
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
        className={styles.controlButtonDiv}
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.taskId} // key值
        dataSource={argumentsSetTableData.rows} // 表数据源
        columns={columns} // 表头数据
        onChange={handleChangeSorter}
        scroll={{ x: columns.length * 200 + 200 }}
      />
    );
  };

  /**
   * 切换选项卡
   * @method  handleClickGetTabsData
   * @param   {key} 选项卡key值
   * @return  {void} 数据获取后自动渲染
   */
  const handleClickGetTabsData = key => {
    keyWordsData.current = '';
    setTabsKey(key);
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    taskTypeCodeData.current = key;
    // handleGetDataObj();
    // handleGetListData();
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
    handleGetDataObj(); // 更新请求参数
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProTypeData();
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  const formItemData = [
    {
      name: 'proName',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode' },
      config: { mode: 'multiple' },
      option: proNameAndCodeData,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple' },
      option: proTypeDatas,
    },
    {
      name: 'proParamType',
      label: '参数类型',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple' },
      option: dicts && dicts.CS021,
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple' },
      option: dicts && dicts.S001,
    },
  ];
  //  // 模糊查询回调
  //  const handlerSearch = fieldsValue => {
  //   if(tabsKey === '1'){
  //     handleExactSerach(fieldsValue)
  //   }else{
  //     seriesSearchhandler(fieldsValue)
  //   }
  // }
  const [tabsKey, setTabsKey] = useState('1');
  /**
   * 搜索框值
   * @param {key} 值
   */
  const blurSearch = key => {
    keyWordsData.current = key;
    pageNumData.current = 1;
    handleGetListData();
  };

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        pageCode="argumentsSet"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={taskTypeCodeData.current}
        taskArrivalTimeKey="taskArriveTime"
        title={false}
        formItemData={formItemData}
        advancSearch={fieldsValue => handleExactSerach(fieldsValue || {})}
        searchInputWidth="300"
        resetFn={handleReset}
        searchPlaceholder="请输入产品全称/产品代码"
        fuzzySearch={value => blurSearch(value)}
        tabs={{
          tabList: [
            { key: 'T001_1', tab: '我待办' },
            { key: 'T001_3', tab: '我发起' },
            { key: 'T001_4', tab: '未提交' },
            { key: 'T001_5', tab: '已办理' },
          ],
          activeKey: taskTypeCodeData.current,
          onTabChange: handleClickGetTabsData,
        }}
        extra={operations}
        tableList={tableData(columns)}
      />
      <MoreOperation
        batchStyles={{ position: 'relative', left: '35px', top: '-75px' }}
        opertations={{
          tabs: taskTypeCodeData.current,
          statusKey: 'status',
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
      connect(({ argumentsSet, loading, publicModel: { publicTas } }) => ({
        argumentsSet,
        publicTas,
        listLoading: loading.effects['argumentsSet/fetch'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

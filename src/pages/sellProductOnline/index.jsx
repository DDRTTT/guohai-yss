/**
 * 运营参数页面
 */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Select, Tabs } from 'antd';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import MoreOperation from '@/components/moreOperation';
import router from 'umi/router';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { confirm } = Modal;

const SpoTable = ({
  fnLink,
  form: { getFieldDecorator },
  dispatch,
  listLoading,
  sellProductOnline: { dicts, proTypeData, proNameAndCodeData, sellProductOnlineTableData },
  publicTas,
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 展开/收起搜索
  const totalData = useRef(0); // 数据总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值
  const proNameData = useRef(''); // 产品名称
  const proCodeData = useRef(''); // 产品代码
  const operStatusData = useRef(''); // 状态
  const assetTypeData = useRef(''); // 产品类型
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const deleteData = useRef([]); // 删除参数
  const backOutData = useRef([]); // 撤销参数
  const [batchData, setDatchData] = useState([]); // 批量操作参数
  const [batchObj, setBatchObj] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [seachData, setSeachData] = useState([]);
  const [columns, setColumns] = useState(
    // 表头数据(有时间)
    [
      {
        title: '产品简称',
        dataIndex: 'proFname',
        key: 'proFname',
        sorter: true,
        ...tableRowConfig,
        width: 300,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品类型',
        dataIndex: 'assetType',
        key: 'assetType',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品阶段',
        dataIndex: 'proStage',
        key: 'proStage',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskReceiveTime',
        key: 'taskReceiveTime',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'operStatus',
        key: 'operStatus',
        sorter: true,
        ...tableRowConfig,
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
              switch (record.operStatus) {
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
                  } else {
                    return (
                      <div>
                        {handleAddButtonCheck(record)}
                        {handleAddButtonTransferHistory(record)}
                        <span style={{ paddingLeft: '-5px' }}>
                          <MoreOperation record={record} fn={handleGetListData} />
                        </span>
                      </div>
                    );
                  }
                default:
                  '';
              }
            case 'T001_3':
              switch (record.operStatus) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                      </div>
                    );
                  }
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
              switch (record.operStatus) {
                case '流程中':
                  if (record.revoke.toString() === '1') {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                        {handleAddButtonBackOut(record)}
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        {handleAddButtonDetails(record)}
                        {handleAddButtonTransferHistory(record)}
                      </div>
                    );
                  }
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
   * @method  handleGetDataObj
   * @const   assetTypeDataObj 产品类型字符串
   * @const   operStatusDataObj 产品状态字符串
   * @return  {viod}
   */
  const handleGetDataObj = () => {
    let proNameDataObj = '';
    let operStatusDataObj = '';
    let assetTypeDataObj = '';
    if (proNameData.current) {
      for (const key of proNameData.current) {
        proNameDataObj += `${key},`;
      }
    }
    if (operStatusData.current) {
      for (const key of operStatusData.current) {
        operStatusDataObj += `${key},`;
      }
    }
    if (assetTypeData.current) {
      for (const key of assetTypeData.current) {
        assetTypeDataObj += `${key},`;
      }
    }

    proNameDataObj = proNameDataObj.slice(0, proNameDataObj.length - 1);
    operStatusDataObj = operStatusDataObj.slice(0, operStatusDataObj.length - 1);
    assetTypeDataObj = assetTypeDataObj.slice(0, assetTypeDataObj.length - 1);

    dataObj.current = {
      fuzzy: keyWordsData.current,
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      taskTypeCode: taskTypeCodeData.current,
      proName: proNameDataObj,
      operStatus: operStatusDataObj,
      assetType: assetTypeDataObj,
      proCode: proCodeData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
  };

  /**
   * 发起列表数据请求
   * @method handleGetListData
   * @uses handleGetDataObj 更新请求参数
   * @uses dispatch 发起请求
   * @return {viod}
   */
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'sellProductOnline/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  /**
   * 发起数据字典下拉选项卡数据请求
   * @method handleGetSelectOptions
   * @param codeList 数据字典请求参数
   * @return {viod}
   */
  const handleGetSelectOptions = () => {
    // 'A002' 产品类型 / 'S001' 状态
    dispatch({
      type: 'sellProductOnline/getDicts',
      payload: { codeList: ['A002', 'S001'] },
    });
  };

  const handleGetProTypeData = () => {
    dispatch({
      type: 'sellProductOnline/getProTypeFunc',
    });
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'sellProductOnline/getProNameAndCodeFunc',
    });
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
   * 精确查询数据取值
   * @method handleExactSerach
   * @param e 选中的表单
   * @uses preventDefault 获取表单数据
   * @uses validateFields 修改表单数据
   * @uses handleGetDataObj 修改请求参数
   * @uses handleGetListData 发起列表数据请求
   */
  const handlerSearch = fieldsValue => {
    const values = fieldsValue || {};
    proNameData.current = values.proName;
    proCodeData.current = values.proCode;
    assetTypeData.current = values.proType;
    operStatusData.current = values.operStatus;
    directionData.current = values.direction;
    fieldData.current = values.field;
    pageNumData.current = 1;
    pageSizeData.current = 10;
    handleGetDataObj();
    handleGetListData();
  };

  // 重置
  const handleReset = () => {
    proNameData.current = '';
    proCodeData.current = '';
    assetTypeData.current = '';
    operStatusData.current = '';
    directionData.current = '';
    fieldData.current = '';
    keyWordsData.current = '';
    pageNumData.current = 1;
    pageSizeData.current = 10;
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 数据字典下拉选项数据获取
   * @method  handleMapList
   * @param   value 父级字典code
   * @param   code 字典子级code
   * @param   name 字典子级name
   * @param   spanName 标题名称
   * @param   getFDname 标签所绑定的属性值
   */
  const handleMapList = (value, code, name, spanName, getFDname, inputBody) => {
    if (dicts[value]) {
      const children = [];
      for (const key of dicts[value]) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <FormItem>
          <span>{spanName}</span>
          {getFieldDecorator(getFDname)(
            <Select
              mode="multiple"
              className={styles.selectStyle}
              placeholder={inputBody}
              showArrow
            >
              {children}
            </Select>,
          )}
        </FormItem>
      );
    }
    return '';
  };

  /**
   * 产品全称/代码下拉列表渲染
   * @param spanName span名称
   * @param getFDname 标签绑定值
   * @param inputBody 输入框提示信息
   */
  const handleProNameAndCodeSelect = (spanName, getFDname, inputBody, getKey) => {
    const children = [];
    if (proNameAndCodeData !== []) {
      for (const key of proNameAndCodeData) {
        if (getKey) {
          children.push(
            <Select.Option value={key[getFDname]}>
              {key[getFDname]}&nbsp;&nbsp;({key[getKey]})
            </Select.Option>,
          );
        } else {
          children.push(<Select.Option value={key[getFDname]}>{key[getFDname]}</Select.Option>);
        }
      }
    }
    return (
      <FormItem>
        <span>{spanName}</span>
        {getFieldDecorator(getFDname)(
          <Select mode="multiple" className={styles.searchInput} placeholder={inputBody} showArrow>
            {children}
          </Select>,
        )}
      </FormItem>
    );
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param key 搜索框key值
   * @uses handleGetListData 发起列表数据请求
   */
  const blurSearch = key => {
    keyWordsData.current = key;
    pageNumData.current = 1;
    pageSizeData.current = 10;
    handleGetListData();
  };

  /**
   * 页码属性变更
   * @param   {pageSize}     string    表格行数据
   * @uses     handleGetDataObj
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
   * Table操作按钮
   * @method  ...
   * @param   {record}      string    表格行数据
   * @return  {string}
   */

  /**
   * @method handleGoAdd 跳转流程引擎-发起流程
   */
  const handleGoAdd = () => {
    fnLink('sellProductOnline:link', '');
  };

  // 发起流程按钮
  const operations = (
    <Action code="sellProductOnline:link">
      <Button type="primary" onClick={handleGoAdd} className={styles.startButton}>
        发起流程
      </Button>
    </Action>
  );

  // 修改
  const handleCanUpdate = record => {
    fnLink(
      'sellProductOnline:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
    // dispatch(
    //   routerRedux.push({
    //     pathname: '/dynamicPage/pages/阿萨德/4028e7b674b6714e0174fcb4a9b00053/阿萨德',
    //     query: { id: record.id },
    //   }),
    // );
  };

  // 复制
  const handleCanCopy = record => {
    fnLink('sellProductOnline:copy', `?processInstId=${record.processInstanceId}`);
  };

  // 提交
  const handleCanSubmit = record => {
    fnLink(
      'sellProductOnline:commit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 详情
  const handleCanDetails = record => {
    const url = `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`;
    router.push(url);
  };

  // 撤销
  const handleCanBackOut = record => {
    backOutData.current = [record.processInstanceId];
    confirm({
      title: '请确认是否撤销?',
      onOk() {
        dispatch({
          type: 'sellProductOnline/getRevokeFunc',
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
          type: 'sellProductOnline/getDeleteFunc',
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

  // 办理
  /**
   * 去流程引擎的办理页面需要的参数
   * @method handleCanCheck
   * @param {taskId} 任务id
   * @param {processDefinitionId} 流程定义id
   * @param {processInstanceId} 流程实例id
   * @param {taskDefinitionKey} 任务定义key
   */
  const handleCanCheck = record => {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.id,
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
      <Action code="sellProductOnline:update">
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
      <Action code="sellProductOnline:copy">
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
      <Action code="sellProductOnline:commit">
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
      <Action code="sellProductOnline:check">
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
      <Action code="sellProductOnline:transferHistory">
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
      <Action code="sellProductOnline:backOut">
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
      <Action code="sellProductOnline:delete">
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
      <Action code="sellProductOnline:details">
        <Button type="link" onClick={() => handleCanDetails(record)} style={{ width: '45px' }}>
          详情
        </Button>
      </Action>
    );
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
        className={styles.controlButtonDiv}
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.taskId} // key值
        dataSource={sellProductOnlineTableData.rows} // 表数据源
        columns={columns} // 表头数据
        onChange={handleChangeSorter}
        scroll={{ x: true }}
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
    fieldData.current = '';
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
    handleGetDataObj(); // 更新请求参数
    handleGetProTypeData();
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  // 条件查询配置
  const formItemData = [
    {
      name: 'proName',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proName', bracket: 'proCode' },
      config: { mode: 'multiple' },
      option: proNameAndCodeData,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple' },
      option: proTypeData,
    },
    {
      name: 'operStatus',
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
        pageCode="sellProductOnline"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={taskTypeCodeData.current}
        taskArrivalTimeKey="taskReceiveTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="350"
        searchPlaceholder="请输入产品代码/产品全称"
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
        extra={operations}
        tableList={
          <>
            {taskTypeCodeData.current === 'T001_1' && <>{tableData(columns)}</>}
            {taskTypeCodeData.current === 'T001_3' && <>{tableData(columns)}</>}
            {taskTypeCodeData.current === 'T001_4' && <>{tableData(columns)}</>}
            {taskTypeCodeData.current === 'T001_5' && <>{tableData(columns)}</>}
          </>
        }
      />
      <MoreOperation
        batchStyles={{ position: 'relative', left: '35px', top: '-63px' }}
        opertations={{
          tabs: taskTypeCodeData.current,
          statusKey: 'operStatusCode',
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
      connect(({ sellProductOnline, loading, publicModel: { publicTas } }) => ({
        sellProductOnline,
        listLoading: loading.effects['sellProductOnline/fetch'],
        publicTas,
      }))(SpoTable),
    ),
  ),
);

export default WrappedIndexForm;

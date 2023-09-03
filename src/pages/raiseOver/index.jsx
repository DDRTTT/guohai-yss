/**
 * 产品募集结束页面
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Select, Tabs } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import MoreOperation from '@/components/moreOperation';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { confirm } = Modal;

const proTypeNewData = [
  { value: 'A002_2', label: '小集合' },
  { value: 'A002_3', label: '大集合' },
];

const Index = ({
  fnLink,
  form: { getFieldDecorator },
  dispatch,
  listLoading,
  raiseOver: { dicts, proNameAndCodeData, investmentManagerDataList, riseOverTableData },
  publicTas,
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 展开/收起搜索
  const dataObj = useRef({}); // 请求参数
  const totalData = useRef(0); // 页码总数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值
  const proNameData = useRef([]); // 产品全称
  const proCodeData = useRef([]); // 产品代码
  const taskStatusData = useRef([]); // 状态
  const proTypeData = useRef([]); // 产品类型
  const investmentManagerData = useRef([]); // 投资经理2
  const raisingResultData = useRef(''); // 是否达到成立条件
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
        title: '产品简称',
        dataIndex: 'proFname',
        key: 'proFname',
        sorter: true,
        ...tableRowConfig,
        width: 280,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        sorter: true,
        ...tableRowConfig,
        width: 150,
      },
      {
        title: '产品类型',
        dataIndex: 'proType',
        key: 'proType',
        sorter: true,
        ...tableRowConfig,
        render: text => {
          switch (text) {
            case 'A002_1':
              return '单一';
            case 'A002_2':
              return '小集合';
            case 'A002_3':
              return '大集合';
            default:
              '';
          }
        },
        width: 150,
      },
      {
        title: '投资经理',
        dataIndex: 'investmentManager',
        key: 'investmentManager',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskArriveTime',
        key: 'taskArriveTime',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        ...tableRowConfig,
        render: text => {
          switch (text) {
            case 'S001_1':
              return '待提交';
            case 'S001_2':
              return '流程中';
            case 'S001_3':
              return '已结束';
            default:
              '';
          }
        },
        width: 150,
      },
      {
        title: '募集开始日',
        dataIndex: 'raiseSdate',
        key: 'raiseSdate',
        sorter: true,
        ...tableRowConfig,
        width: 150,
      },
      {
        title: '实际募集结束日',
        dataIndex: 'actualEndRaisingDate',
        key: 'actualEndRaisingDate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '是否达到成立条件',
        dataIndex: 'raisingResultName',
        key: 'raisingResultName',
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
              switch (record.statusName) {
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
              switch (record.statusName) {
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
              switch (record.statusName) {
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
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      taskTypeCode: taskTypeCodeData.current,
      keyWords: keyWordsData.current,
      proType: proTypeData.current,
      investmentManager: investmentManagerData.current,
      status: taskStatusData.current,
      raisingResult: raisingResultData.current,
      proName: proNameData.current,
      proCode: proCodeData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
  };

  // 获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'raiseOver/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  // 请求:获取表单下拉列表
  const handleGetSelectOptions = () => {
    // 'A002' 产品类型 / 'S001' 状态
    dispatch({
      type: 'raiseOver/getDicts',
      payload: { codeList: ['A002', 'S001'] },
    });
  };

  const handleGetProTypeData = () => {
    dispatch({
      type: 'raiseOver/getProTypeFunc',
    });
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'raiseOver/getProNameAndCodeFunc',
    });
  };

  // 请求:获取投资经理下拉列表
  const handleGetInvestmentManager = () => {
    dispatch({
      type: 'raiseOver/getInvestmentManagerFunc',
    });
  };

  /**
   * 精确查询数据取值
   * @method  handleExactSerach
   */
  const handlerSearch = fieldsValue => {
    const values = fieldsValue || {};
    pageNumData.current = '1';
    pageSizeData.current = '10';
    proNameData.current = values.proName;
    proCodeData.current = values.proCode;
    proTypeData.current = values.proType;
    investmentManagerData.current = values.investmentManager;
    raisingResultData.current = values.raisingResult;
    taskStatusData.current = values.status;
    directionData.current = values.direction;
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
    investmentManagerData.current = [];
    raisingResultData.current = '';
    taskStatusData.current = [];
    directionData.current = '';
    fieldData.current = '';
    keyWordsData.current = '';
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param   {key}         搜索框值
   */
  const blurSearch = key => {
    keyWordsData.current = key;
    pageNumData.current = 1;
    pageSizeData.current = 10;
    handleGetListData();
  };

  /**
   * @method handleMapList 数据字典下拉列表渲染
   * @param value 父级字典code
   * @param code 字典子级code
   * @param name 字典子级name
   * @param spanName 标题名称
   * @param getFDname 标签的绑定值
   * @param inputBody 输入框提示信息
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
              className={styles.searchInput}
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
   * @method handleProNameAndCodeSelect 产品全称/代码下拉列表渲染
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
   * 公共下拉列表渲染
   * @param data 数据源
   * @param spanName span名称
   * @param getFDname 标签绑定值
   * @param inputBody 输入框提示信息
   * @param getKey 输入框value值
   * @param getNewKey 输入框显示值
   */
  const handleCanShowBase = (data, spanName, getFDname, inputBody, getKey, getNewKey) => {
    const children = [];
    if (data !== []) {
      for (const key of data) {
        children.push(
          <Select.Option value={key[getKey]} key={key[getKey]}>
            {key[getNewKey]}
          </Select.Option>,
        );
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
    fnLink('raiseOver:link', '');
  };

  /**
   * Table操作按钮
   * @method  ...
   * @param   {record}      string    表格行数据
   * @return  {string}
   */

  // 发起流程按钮
  const operations = (
    <Action code="raiseOver:link">
      <Button type="primary" onClick={handleGoAdd} className={styles.startButton}>
        发起流程
      </Button>
    </Action>
  );

  // 修改
  const handleCanUpdate = record => {
    fnLink(
      'raiseOver:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 修改
  const handleCanCopy = record => {
    fnLink('raiseOver:copy', `?processInstId=${record.processInstanceId}`);
  };

  // 提交
  const handleCanSubmit = record => {
    fnLink(
      'raiseOver:commit',
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
          type: 'raiseOver/getRevokeFunc',
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
          type: 'raiseOver/getDeleteFunc',
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
      // processInstanceId: record.processInstanceId,
      id: record.id,
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

  // 流转历史
  const handleCanLocationHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`;
    router.push(url);
  };

  /**
   * 创建按钮-修改
   */
  const handleAddButtonUpdate = record => {
    return (
      <Action code="raiseOver:update">
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
      <Action code="raiseOver:copy">
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
      <Action code="raiseOver:commit">
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
      <Action code="raiseOver:check">
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
      <Action code="raiseOver:transferHistory">
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
      <Action code="raiseOver:backOut">
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
      <Action code="raiseOver:delete">
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
      <Action code="raiseOver:details">
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
    } else if (sorter.order === 'desc') {
      directionData.current = 'descend'; // 降序
    } else {
      directionData.current = ''; // 默认
    }
    handleGetDataObj();
    handleGetListData();
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
   * 渲染表格数据
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
        rowKey={record => record.id} // key值
        dataSource={riseOverTableData.rows} // 表数据源
        columns={columns} // 表头数据
        scroll={{ x: true }}
        onChange={handleChangeSorter}
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
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    taskTypeCodeData.current = key;
    handleReset();
  };

  useEffect(() => {
    handleGetDataObj(); // 更新请求参数
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProTypeData();
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetInvestmentManager(); // 请求:获取投资经理下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

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
  // 条件查询配置
  const formItemData = [
    {
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple' },
      option: proNameAndCodeData,
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple' },
      option: proTypeNewData,
    },
    {
      name: 'investmentManager',
      label: '投资经理',
      type: 'select',
      readSet: { name: 'name', code: 'empNo', bracket: 'empNo' },
      config: { mode: 'multiple' },
      option: investmentManagerDataList,
    },
    {
      name: 'raisingResult',
      label: '是否达到成立条件',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      option: [
        { name: '成功', code: '0' },
        { name: '失败', code: '1' },
      ],
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
        pageCode="raiseOver"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={taskTypeCodeData.current}
        taskArrivalTimeKey="taskArriveTime"
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchPlaceholder="请输入产品全称/产品代码"
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
            {taskTypeCodeData.current === 'T001_1' && <> {tableData(columns)} </>}
            {taskTypeCodeData.current === 'T001_3' && <> {tableData(columns)} </>}
            {taskTypeCodeData.current === 'T001_4' && <> {tableData(columns)} </>}
            {taskTypeCodeData.current === 'T001_5' && <> {tableData(columns)} </>}
            <MoreOperation
              batchStyles={{ position: 'relative', left: '35px', top: '-45px' }}
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
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ raiseOver, loading, publicModel: { publicTas } }) => ({
        raiseOver,
        listLoading: loading.effects['raiseOver/fetch'],
        publicTas,
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

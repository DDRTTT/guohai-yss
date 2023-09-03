/**
 * 账户销户
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Dropdown,
  Tabs,
  Button,
  Table,
  message,
  Select,
  Form,
  Row,
  Col,
  Icon,
  Input,
  Card,
  Breadcrumb,
  Modal,
} from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import { connect } from 'dva';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;

const Index = ({
  fnLink,
  form: { getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  publicTas,
  accountPinHouseholds: { dicts, proNameAndCodeData, accountPinHouseholdsTableData },
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 展开/收起搜索
  const totalData = useRef(0); // 页码总数
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值
  const proNameData = useRef([]); // 产品全称
  const proCodeData = useRef([]); // 产品代码
  const taskStatusData = useRef([]); // 状态
  const proTypeData = useRef([]); // 产品类型
  const accountTypeData = useRef([]); //账户类型
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const [keyWordsData, setKeyWordsData] = useState(''); // 模糊搜索关键字
  const deleteData = useRef([]); // 删除参数
  const backOutData = useRef([]); // 撤销参数
  const [batchData, setDatchData] = useState([]); // 批量操作参数
  const [batchObj, setBatchObj] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      productCodes: proNameData.current,
      proCode: proCodeData.current,
      taskTypeCode: taskTypeCodeData.current,
      keyWords: keyWordsData,
      proType: proTypeData.current,
      accountType: accountTypeData.current,
      status: taskStatusData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'accountPinHouseholds/getProNameAndCodeFunc',
    });
  };

  // 请求:获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'accountPinHouseholds/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  // 请求:获取表单下拉选项
  const handleGetSelectOptions = () => {
    // 'A001' 账户类型 / 'S001' 状态 / 'A002' 产品类型
    dispatch({
      type: 'accountPinHouseholds/getDicts',
      payload: { codeList: ['A001', 'S001', 'A002'] },
    });
  };

  /**
   * 精确查询数据取值
   * @method  handleExactSerach
   */
  const handleExactSerach = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        pageNumData.current = 1;
        pageSizeData.current = 10;
        proNameData.current = values.productCodes;
        proCodeData.current = values.proCode;
        proTypeData.current = values.proType;
        accountTypeData.current = values.accountType;
        taskStatusData.current = values.status;
        directionData.current = values.direction;
        fieldData.current = values.field;
        handleGetDataObj();
      }
    });
    handleGetListData();
  };

  /**
   * 重置表单按钮
   */
  const handleFormReset = () => {
    resetFields();
    validateFields((err, values) => {
      if (!err) {
        proNameData.current = values.productCodes;
        proCodeData.current = values.proCode;
        proTypeData.current = values.proType;
        accountTypeData.current = values.accountType;
        taskStatusData.current = values.status;
        directionData.current = values.direction;
        fieldData.current = values.field;
        handleGetDataObj();
      }
    });
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param   {key}         搜索框值
   */
  const blurSearch = key => {
    setKeyWordsData(key);
    handleGetListData();
  };

  /**
   * 数据字典下拉选项数据获取
   * @method  handleMapList
   * @param   {value} 父级字典code
   * @param   {code} 字典子级code
   * @param   {name} 字典子级name
   * @param   {spanName} 标题名称
   * @param   {getFDname} 标签的绑定值
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
  const handleProNameAndCodeSelect = (
    spanName,
    getFDname,
    inputBody,
    getKey,
    realData,
    config = {},
  ) => {
    const children = [];
    if (proNameAndCodeData !== []) {
      for (const key of proNameAndCodeData) {
        if (getKey) {
          children.push(
            <Select.Option value={key[getKey]}>
              {key[getFDname]}&nbsp;&nbsp;({key[getKey]})
            </Select.Option>,
          );
        } else {
          children.push(<Select.Option value={key[getKey]}>{key[getFDname]}</Select.Option>);
        }
      }
    }
    return (
      <FormItem>
        <span>{spanName}</span>
        {getFieldDecorator(realData)(
          <Select
            mode="multiple"
            className={styles.searchInput}
            placeholder={inputBody}
            {...config}
            showArrow
          >
            {children}
          </Select>,
        )}
      </FormItem>
    );
  };

  // 展开搜索表单创建
  const seniorSearchForm = () => {
    return (
      <Form onSubmit={handleExactSerach}>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            {handleProNameAndCodeSelect(
              '产品全称 : ',
              'proName',
              '请选择',
              'proCode',
              'productCodes',
              { optionFilterProp: 'children' },
            )}
          </Col>
          <Col md={8} sm={24}>
            {handleMapList('A001', 'code', 'name', '账户类型 : ', 'accountType', '请选择')}
          </Col>
          <Col md={8} sm={24}>
            {handleMapList(
              'S001',
              'code',
              'name',
              '\xa0\xa0\xa0\xa0\xa0\xa0状态 : ',
              'status',
              '请选择',
            )}
          </Col>
        </Row>
        <div style={{ textAlign: 'right', position: 'relative', left: '40px' }}>
          <span className={styles.submitButtons}>
            <Action code="accountPinHouseholds:query">
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  marginRight: '10px',
                  height: 28,
                }}
              >
                查询
              </Button>
            </Action>
            <Button style={{ height: 28 }} onClick={handleFormReset}>
              重置
            </Button>
          </span>
          <Button
            className={styles.searchLabelOff}
            onClick={() => {
              setOnAndOff();
              handleFormReset();
            }}
            type="link">收起&nbsp;<Icon type="up" />
          </Button>
        </div>
      </Form>
    );
  };

  /**
   * 页码属性变更
   * @method  handleUpdataPageSize
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
    fnLink('accountPinHouseholds:link', '');
  };

  // 发起流程按钮
  const operations = (
    <Action code="accountPinHouseholds:link">
      <Button type="primary" onClick={handleGoAdd} className={styles.startButton}>
        发起流程
      </Button>
    </Action>
  );

  // 修改
  const handleCanUpdate = record => {
    fnLink(
      'accountPinHouseholds:update',
      `?id=${record.cancelId}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 提交
  const handleCanSubmit = record => {
    fnLink(
      'accountPinHouseholds:commit',
      `?id=${record.cancelId}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  };

  // 撤销
  const handleCanBackOut = record => {
    backOutData.current = [record.processInstanceId];
    confirm({
      title: '请确认是否撤销?',
      onOk() {
        dispatch({
          type: 'accountPinHouseholds/getRevokeFunc',
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
    deleteData.current = [record.cancelId];
    confirm({
      title: '请确认是否删除?',
      onOk() {
        dispatch({
          type: 'accountPinHouseholds/getDeleteFunc',
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

  // 流转历史
  const handleCanLocationHistory = record => {
    const url = `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&taskId=${record.taskId}`;
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
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.cancelId,
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
      <Action code="accountPinHouseholds:update">
        <Button type="link" onClick={() => handleCanUpdate(record)} style={{ width: '45px' }}>
          修改
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-提交
   */
  const handleAddButtonCommit = record => {
    return (
      <Action code="accountPinHouseholds:commit">
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
      <Action code="accountPinHouseholds:check">
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
      <Action code="accountPinHouseholds:transferHistory">
        <Button
          type="link"
          onClick={() => handleCanLocationHistory(record)}
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
      <Action code="accountPinHouseholds:backOut">
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
      <Action code="accountPinHouseholds:delete">
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
      <Action code="accountPinHouseholds:details">
        <Button type="link" onClick={() => handleCanDetails(record)} style={{ width: '45px' }}>
          详情
        </Button>
      </Action>
    );
  };

  // 表头(有时间)
  const columns = [
    {
      title: '账户类型',
      dataIndex: 'accountTypeName',
      key: 'accountTypeName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '是否需要备案',
      dataIndex: 'needRecord',
      key: 'needRecord',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '任务到达时间',
      dataIndex: 'taskTime',
      key: 'taskTime',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      fixed: 'right',
      render: (_, record) => {
        switch (taskTypeCodeData.current) {
          case 'T001_1':
            switch (record.status) {
              case '待提交':
                return (
                  <div>
                    {handleAddButtonUpdate(record)}
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
  ];

  // 表头(无时间)
  const columnsNoTime = [
    {
      title: '账户类型',
      dataIndex: 'accountTypeName',
      key: 'accountTypeName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '是否需要备案',
      dataIndex: 'needRecord',
      key: 'needRecord',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      ...tableRowConfig,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      fixed: 'right',
      render: (_, record) => {
        switch (taskTypeCodeData.current) {
          case 'T001_1':
            switch (record.status) {
              case '待提交':
                return (
                  <div>
                    {handleAddButtonUpdate(record)}
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
  ];

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
   * @param {selectedRows} selectedRows 选中项
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, rows) => {
      setSelectedRowKeys(selectedRowKeys);
      setBatchObj({ ...batchObj, [pageNumData.current]: rows });
      console.log(batchObj);
    },
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
        dataSource={accountPinHouseholdsTableData.rows} // 表数据源
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
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    taskTypeCodeData.current = key;
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 创建搜索框
   * @method  handleAddSerach
   * @param   {key} 选项卡key值
   * @return  {void} 数据获取后自动渲染
   */
  const handleAddSerach = () => {
    return (
      <div className={styles.searchCard}>
        <Card>
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col md={12} sm={24}>
              <Breadcrumb className={styles.searchTitle}>
                <Breadcrumb.Item>产品生命周期</Breadcrumb.Item>
                <Breadcrumb.Item>账户销户</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.seniorsearch} style={{ display: onAndOff ? 'none' : '' }}>
                <Search
                  placeholder="请输入产品全称/产品代码"
                  onSearch={value => blurSearch(value)}
                  allowClear
                  style={{
                    width: 260,
                    marginRight: 20,
                    height: 32,
                  }}
                  value={keyWordsData}
                  onChange={e => {
                    setKeyWordsData(e.target.value);
                  }}
                />
                <Button
                  className={styles.searchLabel}
                  onClick={() => {
                    setOnAndOff(true);
                    setKeyWordsData('');
                  }}
                  type="link">展开搜索<Icon type="down" />
                </Button>
              </div>
            </Col>
            <Col
              md={24}
              sm={24}
              style={{ display: onAndOff ? '' : 'none' }}
              className={styles.searchForm}
            >
              {seniorSearchForm()}
            </Col>
          </Row>
        </Card>
      </div>
    );
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
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  return (
    <>
      {handleAddSerach()}
      <Card>
        <Tabs
          tabBarExtraContent={operations}
          onChange={handleClickGetTabsData}
          activeKey={taskTypeCodeData.current}
        >
          <TabPane tab="我待办" key="T001_1">
            {tableData(columns)}
          </TabPane>
          <TabPane tab="我发起" key="T001_3">
            {tableData(columnsNoTime)}
          </TabPane>
          <TabPane tab="未提交" key="T001_4">
            {tableData(columns)}
          </TabPane>
          <TabPane tab="已办理" key="T001_5">
            {tableData(columnsNoTime)}
          </TabPane>
        </Tabs>
      </Card>
      <MoreOperation
        batchStyles={{ position: 'relative', left: '35px', top: '-75px' }}
        opertations={{
          tabs: taskTypeCodeData.current,
          statusKey: 'statusCode',
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
      connect(({ accountPinHouseholds, loading, publicModel: { publicTas } }) => ({
        accountPinHouseholds,
        publicTas,
        listLoading: loading.effects['accountPinHouseholds/fetch'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

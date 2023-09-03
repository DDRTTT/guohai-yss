// 产品数据管理/备付金账户管理
import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Dropdown, Icon, Menu, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import Action, { ActionBool } from '@/utils/hocUtil';
import { Table } from '@/components';
import List from '@/components/List';

const Index = ({ publicTas, dispatch, listLoading, currentUser: { id } }) => {
  const [accountNameList, setAccountNameList] = useState([]); // 备付金账户名称下拉选项值
  const accountNameListRef = useRef([]);
  const [proTrusBankList, setProTrusBankList] = useState([]); // 托管人下拉选项值
  const [openingInstitutionList, setOpeningInstitutionList] = useState([]); // 开户行下拉选项值
  // 备付金账户列表查询条件
  const [formParams, setFormParams] = useState({
    accountName: '', // 备付金账户名称
    accountNo: '', // 备付金账号
    trusBankNo: '', // 托管行/托管人
    openingInstitution: '', // 开户行
    openingDate: '', // 开户日期
  });
  // publicTas是公共数据，初始化设置时做处理，防止参数错误
  const initPublicTas = ['0', '2'].indexOf(publicTas) > -1 ? publicTas + '' : '0';
  const activeTabShowRef = useRef(initPublicTas);
  const activeTabRef = useRef(initPublicTas);
  const [pageNum, setPageNum] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 分页数
  const pageNumValue = useRef(1);
  const pageSizeValue = useRef(10);
  const [field, setField] = useState(''); // 表格排序字段
  const [direction, setDirection] = useState(''); // 表格升序/降序
  const [total, setTotal] = useState(0); // 总条数
  const [dataSource, setDataSource] = useState([]); // 数据源
  const [selectedRows, setSelectedRows] = useState([]); // 表格选中项
  const [selectedCheckRows, setSelectedCheckRows] = useState([]); // 可审核数据表格选中项
  const [selectedReCheckRows, setSelectedReCheckRows] = useState([]); // 可反审核数据表格选中项
  const [selectedDeleteRows, setSelectedDeleteRows] = useState([]); // 可删除数据表格选中项
  const [openDate, setOpenDate] = useState(''); // 开户日期
  const listRef = useRef();
  const accountType = 'A001_7';

  // 获取对应code的 name
  const getaccountName = code => {
    const accountNameObj = accountNameListRef.current.find(item => item.code === code) || {};
    return accountNameObj.name || '';
  };

  const [columns, setColumns] = useState(
    // 表格列
    [
      {
        title: '备付金账户名称',
        dataIndex: 'accountName',
        key: 'accountName',
        ...tableRowConfig,
        width: 400,
        render: code => {
          return getaccountName(code);
        },
      },
      {
        title: '备付金账号',
        dataIndex: 'accountNo',
        key: 'accountNo',
        ...tableRowConfig,
      },
      {
        title: '托管人',
        dataIndex: 'trusBankName',
        key: 'trusBankName',
        ...tableRowConfig,
      },
      {
        title: '开户行',
        dataIndex: 'openName',
        key: 'openName',
        ...tableRowConfig,
      },
      {
        title: '大额支付号',
        dataIndex: 'paymentNo',
        key: 'paymentNo',
        ...tableRowConfig,
      },
      {
        title: '开户日期',
        dataIndex: 'openingDate',
        key: 'openingDate',
        ...tableRowConfig,
      },
      {
        title: '销户日期',
        dataIndex: 'closingDate',
        key: 'closingDate',
        ...tableRowConfig,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        ...tableRowConfig,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        render: (text, record) => {
          const canBatchReCheck = activeTabRef.current === '2';
          return (
            <>
              <Action
                key="provisionAccountManagement:detail"
                code="provisionAccountManagement:detail"
              >
                <Button onClick={() => goDetailPage(record.id)} type="link">
                  查看
                </Button>
              </Action>
              <Action
                key="provisionAccountManagement:update"
                code="provisionAccountManagement:update"
              >
                <Button
                  disabled={canBatchReCheck || !canDelete(record)}
                  onClick={() => goUpdatePage(record.id)}
                  type="link"
                >
                  修改
                </Button>
              </Action>
              <Action key="provisionAccountManagement:del" code="provisionAccountManagement:del">
                <Button
                  disabled={canBatchReCheck || !canDelete(record)}
                  onClick={() => deleteRow([record.id], 'single')}
                  type="link"
                >
                  删除
                </Button>
              </Action>
              <Action
                key="provisionAccountManagement:check"
                code="provisionAccountManagement:check"
              >
                <Button
                  disabled={canBatchReCheck || !canCheck(record)}
                  onClick={() => checkData([record.id], 'single')}
                  type="link"
                >
                  审核
                </Button>
              </Action>
              <Action
                key="provisionAccountManagement:reCheck"
                code="provisionAccountManagement:reCheck"
              >
                <Button
                  disabled={!canBatchReCheck || !canRecheck(record)}
                  onClick={() => reCheckData([record.id], 'single')}
                  type="link"
                >
                  反审核
                </Button>
              </Action>
            </>
          );
        },
      },
    ],
  );

  // 点击新增按钮
  const addAccount = () => {
    return router.push(
      `/dynamicPage/pages/备付金账户管理/8aaa81067d8e8842017d93f956590000/新增?userId=${id}&accountType=A001_7`,
    );
  };

  // 跳转至查看页面
  const goDetailPage = rowId => {
    return router.push(
      `/dynamicPage/pages/备付金账户管理/8aaa81067d8e8842017d981ed6b60001/查看?id=${rowId}&userId=${id}&accountType=A001_7`,
    );
  };

  // 跳转至查修改页面
  const goUpdatePage = rowId => {
    return router.push(
      `/dynamicPage/pages/备付金账户管理/8aaa81067d8e8842017d9820121c0002/修改?id=${rowId}&userId=${id}&accountType=A001_7`,
    );
  };

  // 操作前提示框
  const operationTips = ({ content, callback }) => {
    Modal.confirm({
      title: content,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        callback();
      },
    });
  };

  // 调用查询表格API
  const handleGetTableDataAPI = () => {
    setDataSource([]);
    setSelectedRows([]);
    setSelectedCheckRows([]);
    setSelectedReCheckRows([]);
    setSelectedDeleteRows([]);
    setTotal(0);
    // 查询表格数据参数
    const queryParams = {
      accountType, // 账户类型
      pageNum: pageNumValue.current, // 当前页
      pageSize: pageSizeValue.current, // 分页数
      field, // 排序字段
      direction, // 升序/降序
      pageType: activeTabShowRef.current,
    };
    const params = { ...queryParams, ...formParams, openingDate: openDate };
    dispatch({
      type: 'provisionAccountManagement/getTableDatasApi',
      payload: params,
      callback: res => {
        if (res && res.rows) {
          setDataSource(res.rows);
          setTotal(res.total);
        }
      },
    });
  };

  // 查询备付金账户名称
  const handleProvisionAccountNameApi = () => {
    dispatch({
      type: 'provisionAccountManagement/provisionAccountNameApi',
      payload: 'provisionAccountName',
      callback: res => {
        const list = res || [];
        setAccountNameList(list);
        accountNameListRef.current = list;
      },
    });
  };

  // 获取托管人下拉列表/或者开户行下拉列表
  const getOrgNameList = (params, setOptions) => {
    dispatch({
      type: 'provisionAccountManagement/getOpeningInstitutionList',
      payload: params,
      callback: res => {
        const list = res || [];
        setOptions(list);
      },
    });
  };

  // 获取开户行下拉列表
  const getOpeningInstitutionList = () => {
    getOrgNameList('1', list => {
      setOpeningInstitutionList(list);
    });
  };

  // 获取托管人下拉列表
  const geProTrusBankList = () => {
    getOrgNameList('0', list => {
      setProTrusBankList(list);
    });
  };

  // 搜索时重新设置数据
  const getTableTatas = filedValue => {
    const params = filedValue || {};
    const searchParams = {
      accountName: params.accountName || '',
      accountNo: params.accountNo || '',
      trusBankNo: params.trusBankNo || '',
      openingInstitution: params.openingInstitution || '',
      openingDate: params.openingDate || '',
    };
    setFormParams(searchParams);
    setPageNum(1);
  };

  // 点击重置按钮, 重新设置数据
  const resetForm = () => {
    const currentSearchData = {
      accountName: '', // 备付金账户名称
      accountNo: '', // 备付金账号
      trusBankNo: '', // 托管行/托管人
      openingInstitution: '', // 开户行
      openingDate: '', // 开户日期
    };
    setOpenDate('');
    setFormParams(currentSearchData);
    setPageNum(1);
  };

  // 重新刷新数据列表
  const refreshData = () => {
    if (pageNumValue.current === 1) {
      handleGetTableDataAPI();
    } else {
      setPageNum(1);
    }
  };

  // 删除
  const deleteRow = (ids, type) => {
    operationTips({
      content: type ? '请确认是否删除?' : '请确认是否批量删除?',
      callback: () => {
        dispatch({
          type: 'provisionAccountManagement/deleteProvisionAccount',
          payload: {
            ids,
            accountType,
            userId: id + '',
          },
          callback: () => {
            refreshData();
          },
        });
      },
    });
  };

  // 调用审核/反审核API
  const reviewApi = params => {
    dispatch({
      type: 'provisionAccountManagement/reviewProvisionAccount',
      payload: params,
      callback: () => {
        refreshData();
      },
    });
  };

  // 审核
  const checkData = (ids, type) => {
    operationTips({
      content: type ? '请确认是否审核?' : '请确认是否批量审核?',
      callback: () => {
        const params = {
          type: '0',
          userId: id + '',
          ids,
          accountType,
        };
        reviewApi(params);
      },
    });
  };

  // 反审核
  const reCheckData = (ids, type) => {
    operationTips({
      content: type ? '请确认是否反审核?' : '请确认是否批量反审核?',
      callback: () => {
        const params = {
          type: '1',
          userId: id + '',
          ids,
          accountType,
        };
        reviewApi(params);
      },
    });
  };

  // 批量操作
  const handleMenuClick = params => {
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    const { key } = params;
    const batchOperationMap = {
      0: () => {
        deleteRow(selectedDeleteRows);
      }, // 批量删除
      1: () => {
        checkData(selectedCheckRows);
      }, // 批量审核
      2: () => {
        reCheckData(selectedReCheckRows);
      }, // 批量反审核
    };
    batchOperationMap[key]();
  };

  // 只有账户状态是未生效，流程状态是未提交的数据才可以修改和删除
  const canDelete = row => {
    return (!row.checked || row.checked === 'D001_1') && row.operStatus === 'S001_1';
  };
  // 已提交,未生效的数据, 可以审核
  const canCheck = row => {
    return row.checked === 'D001_1' && row.operStatus === 'S001_2' && row.creatorId !== id;
  };

  // 已生效的数据,可以进行反审核
  const canRecheck = row => {
    return row.checked && row.checked === 'D001_2';
  };

  // 过滤出可以删除、审核、反审核的数据
  const filterCheckData = rows => {
    let checkArr = [];
    let deleteArr = [];
    let reCheckArr = [];
    // 1.只有待办tab栏，才有审核、删除按钮
    if (accountNameListRef.current === '0') {
      rows.map(item => {
        if (canCheck(item)) {
          checkArr.push(item.id);
        }
        if (canDelete(item)) {
          deleteArr.push(item.id);
        }
      });
    } else {
      // 2.全部tab栏，才有反审核按钮
      rows.map(item => {
        if (canRecheck(item)) {
          reCheckArr.push(item.id);
        }
      });
    }
    setSelectedCheckRows(checkArr);
    setSelectedReCheckRows(reCheckArr);
    setSelectedDeleteRows(deleteArr);
  };

  // 点击checkBox
  const handleSelectRows = (keys, rows) => {
    setSelectedRows(keys);
    filterCheckData(rows);
  };

  // 切换tab栏
  const changeTabs = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    resetForm();
    activeTabRef.current = key;
    activeTabShowRef.current = key;
  };

  // 表单数据
  const formItemData = [
    {
      name: 'accountName',
      label: '备付金账户名称',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      option: accountNameList,
    },
    {
      name: 'accountNo',
      label: '备付金账号',
      type: 'input',
    },
    {
      name: 'trusBankNo',
      label: '托管人',
      type: 'select',
      option: proTrusBankList,
      readSet: { name: 'ORGNAME', code: 'ORGID' },
    },
    {
      name: 'openingInstitution',
      label: '开户行',
      type: 'select',
      option: openingInstitutionList,
      readSet: { name: 'ORGNAME', code: 'ORGID' },
    },
    {
      name: 'openingDate',
      label: '开户日期',
      type: 'datepicker',
      config: {
        format: 'YYYY-MM-DD',
        onChange: (moment, string) => {
          setOpenDate(string);
        },
      },
    },
  ];

  // 参数变化时, 查询数据列表的数据
  useEffect(() => {
    handleGetTableDataAPI();
  }, [activeTabShowRef.current, pageNum, pageSize, field, direction, formParams]);

  // 调用获取备付金账户接口
  useEffect(() => {
    getOpeningInstitutionList();
    geProTrusBankList();
    handleProvisionAccountNameApi();
  }, []);


  useEffect(() => {
    pageNumValue.current = pageNum;
    pageSizeValue.current = pageSize;
  }, [pageSize, pageNum]);

  // 根据tab栏判断是否可以批量反审核
  const canBatchReCheck = accountNameListRef.current === '2';

  // 判断是否有可反审核的数据
  const hasRecheckData = selectedReCheckRows.length > 0;

  // 判断是否有可以审核的数据
  const hasCheckData = selectedCheckRows.length > 0;

  // 判断是否有可以删除的数据
  const hasDeleteData = selectedDeleteRows.length > 0;

  // 表格功能数据
  const tableData = {
    key: 'id',
    columns: columns,
    dataSource: dataSource,
    listLoading: listLoading,
    onChange: (a, b, data) => {
      const order = data.order ? data.order.replace('end', '') : '';
      let fieldName = data.field;
      if (fieldName === 'trusBankName') {
        fieldName = 'trusBankNo';
      } else if (fieldName === 'openName') {
        fieldName = 'openingInstitution';
      }
      setField(fieldName);
      setDirection(order);
    },
    pagination: {
      pageSizeOptions: ['10', '30', '50', '100'],
      showSizeChanger: true,
      onShowSizeChange: (num, size) => [setPageNum(1), setPageSize(size)],
      showQuickJumper: true,
      onChange: (num, size) => [setPageNum(num), setPageSize(size)],
      current: pageNum,
      total: total,
      showTotal: () => `共 ${total} 条数据`,
    },
    rowSelection: {
      selectedRowKeys: selectedRows,
      onChange: handleSelectRows,
    },
    button() {
      return (
        <Action key="provisionAccountManagement:add" code="provisionAccountManagement:add">
          <Button onClick={addAccount} type="primary">
            新增
          </Button>
        </Action>
      );
    },
    tabs: true,
    tabsOnChange: e => changeTabs(e),
    tabList: [
      { key: '0', tab: '待办' },
      { key: '2', tab: '全部' },
    ],
  };

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        pageCode="provisionAccountManagement"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={activeTabShowRef.current}
        listRef={listRef}
        title={false}
        formItemData={formItemData}
        advancSearch={filedValue => {
          // 搜索时返回的表单数据
          getTableTatas(filedValue);
        }}
        searchInputWidth="300"
        resetFn={() => {
          resetForm();
        }}
        // 是否有模糊搜索
        fuzzySearchBool={false}
        // tab栏
        tabs={{
          tabList: tableData.tabList,
          activeTabKey: activeTabShowRef.current,
          onTabChange: tableData.tabsOnChange,
        }}
        extra={tableData.button() ? tableData.button() : ''}
        tableList={
          <>
            <Table
              rowSelection={tableData.rowSelection} // checkbox多选框
              pagination={tableData.pagination} // 分页栏
              loading={tableData.listLoading} // 加载中效果
              rowKey={tableData.key} // key值
              dataSource={tableData.dataSource} // 表数据源
              columns={tableData.columns} // 表头数据
              onChange={tableData.onChange}
              scroll={{ x: true }}
            />
            {dataSource.length > 0 && (
              <div style={{ marginTop: -45 }}>
                <Dropdown
                  overlay={
                    <Menu
                      onClick={params => {
                        handleMenuClick(params);
                      }}
                    >
                      {ActionBool('provisionAccountManagement:del') && (
                        <Menu.Item key="0" disabled={canBatchReCheck || !hasDeleteData}>
                          删除
                        </Menu.Item>
                      )}
                      {ActionBool('provisionAccountManagement:check') && (
                        <Menu.Item key="1" disabled={canBatchReCheck || !hasCheckData}>
                          审核
                        </Menu.Item>
                      )}
                      {ActionBool('provisionAccountManagement:reCheck') && (
                        <Menu.Item key="2" disabled={!canBatchReCheck || !hasRecheckData}>
                          反审核
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  placement="topLeft"
                >
                  <Button style={{ marginRight: 10, width: 100, height: 32 }}>
                    批量操作
                    <Icon type="up" />
                  </Button>
                </Dropdown>
              </div>
            )}
          </>
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ user, loading, publicModel: { publicTas } }) => ({
    publicTas,
    currentUser: user.currentUser,
    listLoading: loading.effects['provisionAccountManagement/getTableDatasApi'],
  }))(Index),
);

export default WrappedIndexForm;

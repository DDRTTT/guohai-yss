// 产品数据管理/产品账户台账
import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Tabs } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { download } from '@/utils/download';
import {
  handleTableRender,
  handleGetTime,
  handleAddTable,
} from '../productDataManagement/baseFunc';
import { CommonSearch } from '@/components';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

const Index = ({ dispatch, listLoading }) => {
  const [onAndOff, setOnAndOff] = useState(false);
  const [keyWords, setKeyWords] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowKeys, setRowKeys] = useState([]);
  const [sort, setSort] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [accountType, setAccountType] = useState(
    sessionStorage.getItem('accountParameterAccountType') || 'A001_1',
  );
  const [columns, setColumns] = useState([]);
  const [proCodeData, setProCodeData] = useState([]);
  const proCodeList = useRef([]);
  const accountName = useRef('');

  // 动态表头标题
  const handleDynamicColumnsTitle = (type, val) => {
    if (type === 'accountName') {
      switch (val) {
        case 'A001_1':
          return '托管账户名称';
        case 'A001_3':
          return '证券账户名称';
        case 'A001_4':
          return '中债登债券账户';
        case 'A001_5':
          return '期货账户名称';
        case 'A001_2':
          return '基金账户名称';
        case 'A001_6':
          return '银行账户名称';
        default:
          '账户名称';
      }
    }
    if (type === 'accountNo') {
      switch (val) {
        case 'A001_1':
          return '托管账户号码';
        case 'A001_3':
          return '一码通账户';
        case 'A001_4':
          return '中债登债券账户';
        case 'A001_5':
          return '期货账户资金号码';
        case 'A001_2':
          return '基金账户号码';
        case 'A001_6':
          return '银行账户号码';
        default:
          '账户号码';
      }
    }
    if (type === 'openingDate') {
      switch (val) {
        case 'A001_1':
          return '开户日期';
        case 'A001_3':
          return '开户日期';
        case 'A001_4':
          return '开户日期';
        case 'A001_5':
          return '开户完成日期';
        case 'A001_2':
          return '开户完成日期';
        case 'A001_6':
          return '开户完成日期';
        default:
          '开户日期';
      }
    }
  };

  // 动态表头
  const handleReturnDynamicColumns = () => {
    const source = {
      title: '信息来源',
      dataIndex: 'source',
      key: 'source',
      width: 200,
      sorter: true,
      render: text => {
        return handleTableRender(text === '0' ? '流程' : text === '1' ? '台账' : '');
      },
    };
    const proName = {
      title: '产品名称',
      dataIndex: 'proName',
      key: 'proName',
      ...tableRowConfig,
      width: 400,
    };
    const proCode = {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      ...tableRowConfig,
    };
    const proTrusBankName = {
      title: '托管人',
      dataIndex: 'proTrusBankName',
      key: 'proTrusBankName',
      ...tableRowConfig,
    };
    const openingDate = {
      title: handleDynamicColumnsTitle('openingDate', accountType),
      dataIndex: 'openingDate',
      key: 'openingDate',
      ...tableRowConfig,
    };
    const belongDeptName = {
      title: '账户使用部门',
      dataIndex: 'belongDeptName',
      key: 'belongDeptName',
      ...tableRowConfig,
    };
    const accountName = {
      title: handleDynamicColumnsTitle('accountName', accountType),
      dataIndex: 'accountName',
      key: 'accountName',
      ...tableRowConfig,
    };
    const accountNo = {
      title: handleDynamicColumnsTitle('accountNo', accountType),
      dataIndex: 'accountNo',
      key: 'accountNo',
      ...tableRowConfig,
    };
    const openingInstitutionName = {
      title: accountType === 'A001_6' ? '开户银行全称' : '开户机构全称',
      dataIndex: 'openingInstitutionName',
      key: 'openingInstitutionName',
      ...tableRowConfig,
    };
    const transMarket = {
      title: '交易市场',
      dataIndex: 'transMarket',
      key: 'transMarket',
      ...tableRowConfig,
    };
    const capitalAccountNum = {
      title: '中债登资金账户',
      dataIndex: 'capitalAccountNum',
      key: 'capitalAccountNum',
      ...tableRowConfig,
    };
    const sqholderAccountNum = {
      title: '上清所持有人账户',
      dataIndex: 'sqholderAccountNum',
      key: 'sqholderAccountNum',
      ...tableRowConfig,
    };
    const sqcapitalAccountNum = {
      title: '上清所资金账户',
      dataIndex: 'sqcapitalAccountNum',
      key: 'sqcapitalAccountNum',
      ...tableRowConfig,
    };
    const shareholderAccountSZ = {
      title: '股东账号',
      dataIndex: 'shareholderAccountSZ',
      key: 'shareholderAccountSZ',
      ...tableRowConfig,
    };
    const futureTradeCode = {
      title: '期货交易编码',
      dataIndex: 'futureTradeCode',
      key: 'futureTradeCode',
      ...tableRowConfig,
    };
    const remark = {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ...tableRowConfig,
    };
    const id = {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <a
              style={{ marginRight: '10px', display: record.source === '1' }}
              onClick={() => handleCanCheck(record)}
            >
              查看
            </a>
            <a style={{ marginRight: '10px' }} onClick={() => handleCanUpdate(record)}>
              修改
            </a>
          </>
        );
      },
    };

    const baseArr = [source, proName, proCode, proTrusBankName];

    switch (accountType) {
      case 'A001_1':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          remark,
          id,
        ]);
      case 'A001_3':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          transMarket,
          shareholderAccountSZ,
          remark,
          id,
        ]);
      case 'A001_4':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountNo,
          capitalAccountNum,
          sqholderAccountNum,
          sqcapitalAccountNum,
          remark,
          id,
        ]);
      case 'A001_5':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          futureTradeCode,
          openingInstitutionName,
          remark,
          id,
        ]);
      case 'A001_2':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          remark,
          id,
        ]);
      case 'A001_6':
        return setColumns([
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          remark,
          id,
        ]);
      default:
        setColumns([]);
    }
  };

  // 表格功能数据
  const tableData = {
    // key: 'id',
    columns: columns,
    dataSource: dataSource,
    listLoading: listLoading,
    onChange: (a, b, data) =>
      setSort(data.order ? { [data.field]: data.order?.replace('end', '') } : {}),
    pagination: {
      pageSizeOptions: ['10', '30', '50', '100'],
      showSizeChanger: true,
      onShowSizeChange: (num, size) => [setPageNum(num), setPageSize(size)],
      showQuickJumper: true,
      onChange: (num, size) => [setPageNum(num), setPageSize(size)],
      current: pageNum,
      total: total,
      showTotal: () => `共 ${total} 条数据`,
    },
    // rowSelection: {
    //   onChange: (keys, rows) => setRowKeys(keys),
    // },
    button() {
      return (
        <div style={{display: 'inline-block', marginBottom: 14 }}>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={() => handleExport()}>
            导出Excel
          </Button>
          <Button type="primary" onClick={() => handleAdd()}>
            新增产品账户
          </Button>
        </div>
      );
    },
    tabs: true,
    defaultacconutType: accountType,
    tabsOnChange: e => [setAccountType(e), setPageNum(1)],
    tabsKeyArray: [
      { name: '托管账户', code: 'A001_1' },
      { name: '证券账户', code: 'A001_3' },
      { name: '债券账户', code: 'A001_4' },
      { name: '期货账户', code: 'A001_5' },
      { name: '基金账户', code: 'A001_2' },
      { name: '其他资金账户', code: 'A001_6' },
    ],
  };

  // 导出
  const handleExport = () => {
    download('/ams/yss-lifecycle-flow/baseAccount/export/accountList', {
      body: { accountType },
      name: `产品账户台账报表_${handleGetTime()}`,
      method: 'POST',
      fileType: '.xlsx',
    });
  };

  // 新增
  const handleAdd = () => {
    sessionStorage.setItem('accountParameterAccountType', accountType);
    return router.push('/dynamicPage/pages/产品账户台账/8aaa812b7a0dd2be017b70f38b60000a/新增');
  };

  // 查看
  const handleCanCheck = record => {
    sessionStorage.setItem('accountParameterAccountType', accountType);
    if (record?.source === '0') {
      return router.push(
        `/dynamicPage/pages/账户信息维护/4028e7b6757809700175a1279bad002c/账户变更流程查看?type=view&id=${record.id}&proCode=${record.proCode}`,
      );
    } else if (record?.source === '1') {
      return router.push(
        `/dynamicPage/pages/产品账户台账/8aaa812b7a0dd2be017b70f38b60000a/查看?id=${record.id}&type=view`,
      );
    } else {
      return message.warning('任务条件有误!');
    }
  };

  // 修改
  const handleCanUpdate = record => {
    sessionStorage.setItem('accountParameterAccountType', accountType);
    if (record?.source === '0') {
      return router.push(
        `/dynamicPage/pages/账户信息维护/4028e7b6757809700175a1279bad002c/账户变更流程修改?type=view&id=${record.id}&proCode=${record.proCode}`,
      );
    } else if (record?.source === '1') {
      return router.push(
        `/dynamicPage/pages/产品账户台账/8aaa812b7a0dd2be017b70f38b60000a/修改?id=${record.id}`,
      );
    } else {
      return message.warning('任务条件有误!');
    }
  };

  // 接口 : 表格查询
  const handleGetTableDataAPI = data => {
    data.proCodeList = proCodeList.current || [];
    data.accountName = accountName.current || '';
    setDataSource([]);
    dispatch({
      type: 'accountParameter/getTableFunc',
      payload: data,
      callback: res => {
        setDataSource(res.rows);
        setTotal(res.total);
      },
    });
  };

  // 接口 : 产品全称下拉列表查询
  const handleGetProNameListDataAPI = data => {
    dispatch({
      type: 'accountParameter/getProductListFunc',
      payload: data,
      callback: res => {
        setProCodeData(res);
      },
    });
  };

  // 接口 : 字典下拉列表
  const handleGetDictsAPI = () => {
    dispatch({
      type: 'accountParameter/getDictsFunc',
      payload: { codeList: ['A001'] },
    });
  };

  useEffect(() => {
    handleReturnDynamicColumns();
  }, [accountType]);

  useEffect(() => {
    handleGetProNameListDataAPI();
    handleGetDictsAPI();
  }, []);

  useEffect(() => {
    handleGetTableDataAPI(params);
  }, [accountType, pageNum, pageSize, sort]);

  useEffect(() => {
    return sessionStorage.removeItem('accountParameterAccountType');
  }, []);

  // 查询参数
  const params = {
    sort,
    pageNum,
    pageSize,
    keyWords,
    accountType,
  };

  const formItemData = [
    {
      name: 'proCode',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: proCodeData,
    },
    {
      name: 'accountName',
      label: '账户名称',
      type: 'input',
    },
  ];


  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        pageCode="accountParameter"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={accountType}
        taskArrivalTimeKey="taskTime"
        title={false}
        formItemData={formItemData}
        advancSearch={filedValue => {
          setPageNum(1);
          proCodeList.current = filedValue?.proCode || [];
          accountName.current = filedValue?.accountName || '';
          handleGetTableDataAPI(params);
        }}
        searchInputWidth="300"
        resetFn={() => {
          setPageNum(1);
          proCodeList.current = [];
          accountName.current = '';
          handleGetTableDataAPI(params);
        }}
        fuzzySearchBool={false}
        tabs={{
          tabList: [
            { key: 'A001_1', tab: '托管账户' },
            { key: 'A001_3', tab: '证券账户' },
            { key: 'A001_4', tab: '债券账户' },
            { key: 'A001_5', tab: '期货账户' },
            { key: 'A001_2', tab: '基金账户' },
            { key: 'A001_6', tab: '其他资金账户' },
          ],
          activeKey: accountType,
          onTabChange: e => {
            proCodeList.current = [];
            accountName.current = '';
            [setAccountType(e), setPageNum(1)];
          },
        }}
        extra={tableData.button() ? tableData.button() : ''}
        tableList={
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
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ loading }) => ({
    listLoading: loading.effects['accountParameter/getTableFunc'],
  }))(Index),
);

export default WrappedIndexForm;

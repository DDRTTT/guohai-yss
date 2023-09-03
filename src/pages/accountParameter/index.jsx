// 产品数据管理/产品账户台账
import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Tooltip } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { download } from '@/utils/download';
import { handleTableRender, handleGetTime } from '../productDataManagement/baseFunc';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;

const Index = ({ dispatch, listLoading, provisionListLoading, currentUser: { id } }) => {
  const [keyWords, setKeyWords] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageNumValue = useRef(1);
  const pageSizeValue = useRef(10);
  const [sort, setSort] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [accountType, setAccountType] = useState(
    sessionStorage.getItem('accountParameterAccountType') || 'A001_1',
  );
  const [columns, setColumns] = useState([]);
  const [proCodeData, setProCodeData] = useState([]);
  const proCodeList = useRef([]);
  const proCodeInput = useRef('');
  const accountName = useRef('');
  // 产品账户台账：增加查询条件和列-状态（备付金账户和券商_资金账户除外）
  const checkStatus = useRef('');// did't mean to code like this
  // 备付金账户及券商_资金账户表单参数
  const [accountNameList, setAccountNameList] = useState([]); // 备付金账户名称下拉选项值
  const accountNameListRef = useRef([]);
  const [proTrusBankList, setProTrusBankList] = useState([]); // 托管人下拉选项值
  const [openingInstitutionList, setOpeningInstitutionList] = useState([]); // 开户行下拉选项值
  const [brokerOpeningInstitutionList, setBrokerOpeningInstitutionList] = useState([]); // 开户行下拉选项值
  const [openDate, setOpenDate] = useState('');
  const [field, setField] = useState(''); // 表格排序字段
  const [direction, setDirection] = useState(''); // 表格升序/降序
  // 备付金账户列表查询条件
  const [formParams, setFormParams] = useState({
    accountName: '', // 备付金账户名称
    accountNo: '', // 备付金账号
    trusBankNo: '', // 托管行/托管人
    openingInstitution: '', // 开户行
    openingDate: '', // 开户日期
  });

  // 券商_资金账户列表查询条件
  const [brokerFormParams, setBrokerFormParams] = useState({
    proNo: '', // 产品名称
    accountName: '', // 资金账户名称
    accountNo: '', // 资金账号
    openingInstitution: '', // 开户行
    openingDate: '', // 开户日期
  });

  // 是备付金账户
  const isProvisionAccount = accountType === 'A001_7';
  // 是券商_资金账户
  const isBrokersAccount = accountType === 'A001_8';
  // 是备付金账户/券商_资金账户
  const isProvisionAccountOrBrokersAccount = isProvisionAccount || isBrokersAccount;

  // 跳转至查看页面
  const goDetailPage = rowId => {
    return router.push(
      `/dynamicPage/pages/备付金账户管理/8aaa81067d8e8842017d981ed6b60001/查看?id=${rowId}&userId=${id}&accountType=A001_7`,
    );
  };

  // 跳转至查看页面
  const goBrokerDetailPage = rowId => {
    return router.push(
      `/dynamicPage/pages/券商_资金账户管理/8aaa82067da717a9017dbd0dc4f90003/查看?id=${rowId}&userId=${id}&accountType=A001_8`,
    );
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

  // 获取备付金账户开户行下拉列表
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

  // 券商_资金账户开户行下拉列表
  const getBrokerOpeningInstitutionList = () => {
    getOrgNameList('2', list => {
      setBrokerOpeningInstitutionList(list);
    });
  };

  // 调用备付金账户查询表格API
  const handleProvisionGetTableDataAPI = params => {
    setDataSource([]);
    setTotal(0);
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

  // 备付金账户查询列表数据
  const getProvisionList = () => {
    // 备付金账户查询表格数据参数
    const queryParams = {
      accountType, // 账户类型
      pageType: '1',
      pageNum: pageNumValue.current,
      pageSize: pageSizeValue.current,
      field,
      direction,
    };
    const params = { ...queryParams, ...formParams, openingDate: openDate };
    handleProvisionGetTableDataAPI(params);
  };

  // 券商_资金账户查询列表数据
  const getBrokerList = () => {
    // 备付金账户查询表格数据参数
    const queryParams = {
      accountType, // 账户类型
      pageType: '1',
      pageNum: pageNumValue.current,
      pageSize: pageSizeValue.current,
      field,
      direction,
    };
    const params = { ...queryParams, ...brokerFormParams, openingDate: openDate };
    handleProvisionGetTableDataAPI(params);
  };

  // 获取对应code的 name
  const getaccountName = code => {
    const accountNameObj = accountNameListRef.current.find(item => item.code === code) || {};
    return accountNameObj.name || '-';
  };

  // 备付金账户表格列
  const proversionAccountColumns = [
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
      align: 'center',
      render: (text, record) => {
        return (
          <Button onClick={() => goDetailPage(record.id)} type="link">
            查看
          </Button>
        );
      },
    },
  ];

  // 券商_资金账户表格列
  const brokersAccountColumns = [
    {
      title: '产品简称',
      dataIndex: 'proFname',
      key: 'proFname',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '资金账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      ...tableRowConfig,
    },
    {
      title: '资金账号',
      dataIndex: 'accountNo',
      key: 'accountNo',
      ...tableRowConfig,
    },
    {
      title: '开户行',
      dataIndex: 'openName',
      key: 'openName',
      ...tableRowConfig,
    },
    {
      title: '开户日期',
      dataIndex: 'openingDate',
      key: 'openingDate',
      ...tableRowConfig,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        return (
          <Button onClick={() => goBrokerDetailPage(record.id)} type="link">
            查看
          </Button>
        );
      },
    },
  ];

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
      title: '产品简称',
      dataIndex: 'proFname',
      key: 'proFname',
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
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Button type="link" size="small" onClick={() => handleCanCheck(record)}>
              查看
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => handleCanUpdate(record)}
              style={record.buttonFlag === 1 ? {} : { display: 'none' }}
            >
              修改
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => handleCanAudit(record)}
              style={record.buttonFlag === 2 || record.buttonFlag === 3 ? {} : { display: 'none' }}
            >
              {record.buttonFlag === 2 ? '审核' : record.buttonFlag === 3 ? '反审核' : ''}
            </Button>
          </>
        );
      },
    };
    const checkStatus = {
      title: '状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      sorter: true,
      ellipsis: true,
      width: 110,
      render: text => {
        const label = text === '1' ? '待提交' : text === '2' ? '待复核' : text === '3' ? '已提交' : text === '4' ? '审核通过' : '';
        return (
          <Tooltip title={label} placement="topLeft">
            {label
              ? label.toString().replace(/null/g, '-')
              : label === '' || label === undefined || label === null
                ? '-'
                : 0}
          </Tooltip>
        );
      }
    }


    const baseArr = [source, proName, proCode, proTrusBankName];

    switch (accountType) {
      case 'A001_1':
        return setColumns([// 托管账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          checkStatus,
          remark,
          id,
        ]);
      case 'A001_3':
        return setColumns([// 证券账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          transMarket,
          shareholderAccountSZ,
          checkStatus,
          remark,
          id,
        ]);
      case 'A001_4':
        return setColumns([// 债券账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountNo,
          capitalAccountNum,
          sqholderAccountNum,
          sqcapitalAccountNum,
          checkStatus,
          remark,
          id,
        ]);
      case 'A001_5':
        return setColumns([// 期货账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          futureTradeCode,
          openingInstitutionName,
          checkStatus,
          remark,
          id,
        ]);
      case 'A001_2':
        return setColumns([// 基金账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          checkStatus,
          remark,
          id,
        ]);
      case 'A001_6':
        return setColumns([// 其他资金账户
          ...baseArr,
          openingDate,
          belongDeptName,
          accountName,
          accountNo,
          openingInstitutionName,
          checkStatus,
          remark,
          id,
        ]);
      default:
        setColumns([]);
    }
  };

  // 获取当前数据列表的loading状态
  const loadingStatus = isProvisionAccountOrBrokersAccount ? provisionListLoading : listLoading;

  // 表格功能数据
  const tableData = {
    key: 'id',
    columns: columns,
    dataSource: dataSource,
    listLoading: loadingStatus,
    onChange: (a, b, data) => {
      if (isProvisionAccountOrBrokersAccount) {
        const order = data.order ? data.order.replace('end', '') : '';
        let fieldName = data.field;
        if (fieldName === 'trusBankName') {
          fieldName = 'trusBankNo';
        } else if (fieldName === 'openName') {
          fieldName = 'openingInstitution';
        } else if (fieldName === 'prodName') {
          fieldName = 'proNo';
        }
        setField(fieldName);
        setDirection(order);
      } else {
        setSort(data.order ? { [data.field]: data.order?.replace('end', '') } : {});
      }
    },
    pagination: {
      pageSizeOptions: ['10', '30', '50', '100'],
      showSizeChanger: true,
      onShowSizeChange: (num, size) => {
        setPageNum(1); // 切换每页展示条数，应将当前页重新定位到第1页，防止出现表格展示为空（实际有数据，因当前页不为1导致）
        setPageSize(size);
      },
      showQuickJumper: true,
      onChange: num => {
        // 切换页码时，无须更新每页展示条数
        setPageNum(num);
      },
      current: pageNum,
      pageSize: pageSize,
      total: total,
      showTotal: () => `共 ${total} 条数据`,
    },
    button() {
      return (
        <div style={{ display: 'inline-block', marginBottom: 14 }}>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={() => handleExport()}>
            导出Excel
          </Button>
          {!isProvisionAccountOrBrokersAccount ? (
            <Button type="primary" onClick={() => handleAdd()}>
              新增产品账户
            </Button>
          ) : (
            ''
          )}
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
      { name: '备付金账户', code: 'A001_7' },
      { name: '券商_资金账户', code: 'A001_8' },
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
    return router.push(`/dynamicPage/pages/产品账户台账/8aaa82bb813f024f0181d2ae0bdb0004/新增?accountTypeValue=${accountType}`);
  };

  // 查看
  const handleCanCheck = record => {
    sessionStorage.setItem('accountParameterAccountType', accountType);
    if (record?.source === '0') {// 信息来源：流程--跳转页面模板：lifecycle_产品账户台账(流程类数据详情)（原名是：lifecycle_产品看板(账户详情)-台账专属，即修改名称，模板内容和id不变）
      return router.push(
        `/dynamicPage/pages/产品账户台账/8aaa82bb813f024f0181ec1c27450008/查看?id=${record.id}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstId}&type=view&editFlag=0`
      );
    } else if (record?.source === '1') {// 信息来源：台账--跳转页面模板：lifecycle_产品账户台账(台账类数据详情)--测试要求查看时，文件列表不能上传文件和删除，因此将原来的引用模板【lifecycle_产品账户台账(修改)】复制一份（注意：id也会变），并改名字，最后在此基础上修改
      return router.push(
        `/dynamicPage/pages/产品账户台账/8aaa82bb813f024f0181f5377e1f000a/查看?id=${record.id}&type=view&editFlag=0`
      );
    } else {
      return message.warning('任务条件有误!');
    }
  };

  // 修改
  const handleCanUpdate = record => {// 查看和修改：增加字段editFlag，区分是详情还是修改页；若是修改页，则editFlag为1，业务类型固定为[变更]
    sessionStorage.setItem('accountParameterAccountType', accountType);
    if (record?.source === '0' || record?.source === '1') {// 跳转页面模板：lifecycle_产品账户台账(修改)
      return router.push(
        `/dynamicPage/pages/产品账户台账/8aaa812b7a0dd2be017b70f38b60000a/修改?id=${record.id}&editFlag=1`,
      );
    } else {
      return message.warning('任务条件有误!');
    }
  };

  // 审核
  const handleCanAudit = record => {
    confirm({
      title: '确定要审核吗?',
      onOk() {
        dispatch({
          type: 'accountParameter/auditFunc',
          payload: {
            type: record.buttonFlag === 2 ? 0 : 1,
            idList: [record.id],
          },
          callback: () => {
            handleGetTableDataAPI({
              accountName,
              accountType,
              keyWords,
              pageNum: pageNumValue.current,
              pageSize: pageSizeValue.current,
              proCodeList,
              sort,
            });
          },
        });
      },
      onCancel() { },
    });
  };

  // 接口 : 表格查询
  const handleGetTableDataAPI = data => {
    data.proCodeList = proCodeList.current || [];
    data.accountName = accountName.current || '';
    data.checkStatus = checkStatus.current || '';
    data.proCode = proCodeInput.current || '';
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

  // 搜索时重新设置数据
  const getTableDatas = filedValue => {
    const params = filedValue || {};
    const searchParams = {
      accountName: params.accountName || '',
      accountNo: params.accountNo || '',
      trusBankNo: params.trusBankNo || '',
      openingInstitution: params.openingInstitution || '',
      openingDate: params.openingDate || '',
      checkStatus: params.checkStatus || '',
    };
    setFormParams(searchParams);
    setPageNum(1);
  };

  // 券商_资金账户搜索时重新设置数据
  const getBrokerTableDatas = filedValue => {
    const params = filedValue || {};
    const searchParams = {
      proNo: params.proNo || '',
      accountName: params.accountName || '',
      accountNo: params.accountNo || '',
      openingInstitution: params.openingInstitution || '',
      openingDate: params.openingDate || '',
    };
    setBrokerFormParams(searchParams);
    setPageNum(1);
  };

  // 查询列表
  const advancSearch = filedValue => {
    setPageNum(1);
    // 1.备付金账户
    if (isProvisionAccount) {
      return getTableDatas(filedValue);
    }
    // 2.券商_资金账户
    if (isBrokersAccount) {
      return getBrokerTableDatas(filedValue);
    }
    // 3.其它账户
    proCodeList.current = filedValue?.proCode || [];
    accountName.current = filedValue?.accountName || '';
    checkStatus.current = filedValue?.checkStatus || '';
    proCodeInput.current = filedValue?.proCodeInput || '';
    handleGetTableDataAPI(params);
  };

  // 点击重置按钮, 重置备付金账户表单数据
  const resetProvisionForm = () => {
    const currentSearchData = {
      accountName: '', // 备付金账户名称
      accountNo: '', // 备付金账号
      trusBankNo: '', // 托管行/托管人
      openingInstitution: '', // 开户行
      openingDate: '', // 开户日期
    };
    setOpenDate('');
    setFormParams(currentSearchData);
  };

  // 点击重置按钮, 重置券商_资金账户表单数据
  const resetBrokerForm = () => {
    const currentSearchData = {
      proNo: '', // 产品名称
      accountName: '', // 资金账户名称
      accountNo: '', // 资金账号
      openingInstitution: '', // 开户行
      openingDate: '', // 开户日期
    };
    setOpenDate('');
    setBrokerFormParams(currentSearchData);
  };

  // 重置其它项的表单数据
  const resetOtherForm = () => {
    proCodeList.current = [];
    accountName.current = '';
    checkStatus.current = '';
    proCodeInput.current = '';
    handleGetTableDataAPI(params);
  };

  // 重置表单数据
  const resetFn = () => {
    setPageNum(1);
    // 1.备付金账户
    if (isProvisionAccount) {
      return resetProvisionForm();
    }
    // 2.券商_资金账户
    if (isBrokersAccount) {
      return resetBrokerForm();
    }
    // 3.其它账户
    resetOtherForm();
  };

  // 切换tab栏
  const changeTabs = e => {
    setAccountType(e);
    setPageNum(1);
    // 1.备付金账户
    if (isProvisionAccount) {
      return resetProvisionForm();
    }
    // 2.券商_资金账户
    if (isBrokersAccount) {
      return resetBrokerForm();
    }
    // 3.其它账户
    proCodeList.current = [];
    accountName.current = '';
    checkStatus.current = '';
    proCodeInput.current = '';
  };

  // 初始化动态表头
  useEffect(() => {
    // 1.备付金账户
    if (isProvisionAccount) {
      return setColumns(proversionAccountColumns);
    }
    // 2.券商_资金账户
    if (isBrokersAccount) {
      return setColumns(brokersAccountColumns);
    }
    // 3.其它账户
    handleReturnDynamicColumns();
  }, [accountType]);

  // 初始化下拉选项值
  useEffect(() => {
    handleGetProNameListDataAPI();
    handleGetDictsAPI();
    getOpeningInstitutionList();
    geProTrusBankList();
    handleProvisionAccountNameApi();
    getBrokerOpeningInstitutionList();
  }, []);

  useEffect(() => {
    // 1.备付金账户
    if (isProvisionAccount) {
      return getProvisionList();
    }
    // 2.券商_资金账户
    if (isBrokersAccount) {
      return getBrokerList();
    }
    // 3.其它账户
    handleGetTableDataAPI(params);
  }, [accountType, formParams, brokerFormParams, pageNum, pageSize, sort, field, direction]);

  useEffect(() => {
    return sessionStorage.removeItem('accountParameterAccountType');
  }, []);

  useEffect(() => {
    pageNumValue.current = pageNum;
    pageSizeValue.current = pageSize;
  }, [pageSize, pageNum]);

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
      width: 8,
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple' },
      option: proCodeData,
    },
    {
      name: 'proCodeInput',
      label: '产品代码',
      width: 8,
      type: 'input',
    },
    {
      name: 'accountName',
      label: '账户名称',
      width: 8,
      type: 'input',
    },
    {
      name: 'checkStatus',
      label: '状态',
      width: 8,
      type: 'select',
      option: [
        { name: '待提交', code: '1' },
        { name: '待复核', code: '2' },
        { name: '已提交', code: '3' },
        { name: '审核通过', code: '4' },
      ],
      readSet: { name: 'name', code: 'code' },
    },
  ];

  // 备付金账户表单数据
  const pervisionFormData = [
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
        onChange: (moment, dateString) => {
          setOpenDate(dateString);
        },
      },
    },
  ];

  // 券商_资金账户
  const brokerFormData = [
    {
      name: 'proNo',
      label: '产品名称',
      type: 'select',
      option: proCodeData,
      readSet: { name: 'proName', code: 'proCode' },
    },
    {
      name: 'accountName',
      label: '资金账户名称',
      type: 'input',
    },
    {
      name: 'accountNo',
      label: '资金账号',
      type: 'input',
    },
    {
      name: 'openingInstitution',
      label: '开户行',
      type: 'select',
      option: brokerOpeningInstitutionList,
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

  // 获取表单配置项
  const formData =
    accountType === 'A001_7'
      ? pervisionFormData
      : accountType === 'A001_8'
        ? brokerFormData
        : formItemData;

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        hasMoreTabs={true} // 有多个tab栏
        pageCode="accountParameter"
        dynamicHeaderCallback={callBackHandler}
        columns={tableData.columns} // 表头数据
        taskTypeCode={accountType}
        title={false}
        formItemData={formData}
        advancSearch={filedValue => {
          advancSearch(filedValue);
        }}
        searchInputWidth="300"
        resetFn={() => {
          resetFn();
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
            { key: 'A001_7', tab: '备付金账户' },
            { key: 'A001_8', tab: '券商_资金账户' },
          ],
          activeTabKey: accountType,// 修复从修改页返回，数据和选中tab不对应问题
          onTabChange: e => {
            changeTabs(e);
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
  connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    listLoading: loading.effects['accountParameter/getTableFunc'],
    provisionListLoading: loading.effects['provisionAccountManagement/getTableDatasApi'],
  }))(Index),
);

export default WrappedIndexForm;

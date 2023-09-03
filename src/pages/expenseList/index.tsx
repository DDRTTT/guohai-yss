// 产品数据管理/备付金账户管理
import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Form, DatePicker, message } from 'antd';
import { connect } from 'dva';
import styles from '../repaymentInstructions/index.less';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { moneyRender } from '@/pages/productBillboard/baseFunc';
import Action from '@/utils/hocUtil';
import { Table } from '@/components';
import List from '@/components/List';
import moment from 'moment';

const Index = ({
  publicTas,
  dispatch,
  listLoading,
  checksLoading,
  repaymentInstructions: { dicts, expenseListPaymentTypeList, proNameAndCodeData },
  form: { getFieldDecorator, validateFields },
}) => {
  const initPublicTas = ['0', '1'].indexOf(publicTas) > -1 ? publicTas + '' : '0';
  const [activeTab, setActiveTab] = useState(initPublicTas);
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 分页数
  const [field, setField] = useState(''); // 表格排序字段
  const [direction, setDirection] = useState(''); // 表格升序/降序
  const [total, setTotal] = useState(0); // 总条数
  const [dataSource, setDataSource] = useState([]); // 数据源
  const [selectedRows, setSelectedRows] = useState([]); // 表格选中项
  const [ordDate, setOrdDate] = useState(''); // 指令日期, 对应的是表单数据
  const [balanceDate, setBalanceDate] = useState(''); // 余额日期，对应的是表单数据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const [modalShow, setModalShow] = useState(false); // 是否展示拉取数据弹框

  // 费用列表表单查询条件
  const [formParams, setFormParams] = useState({
    C_PORT_CODE: [], // 产品全称
    FLOWSTATE: [], // 指令状态
    C_PAY_TYPE: [], // 费用类型
    C_EXPENSE_DATE_START: '', // 余额日期开始
    C_EXPENSE_DATE_END: '', // 余额日期结束
    D_ORD_START: '', // 指令日期开始
    D_ORD_END: '', // 指令日期结束
  });

  // 查询列表数据的其它参数
  const queryParams = {
    currentPage,
    pageSize,
    field,
    direction,
    FLOWFLAG: activeTab,
  };

  // 字符串日期转换为Date
  const transferDate = date => {
    return new Date(date).getTime();
  };

  // 调用查询表格API
  const handleGetTableDataAPI = () => {
    setDataSource([]);
    setSelectedRows([]);
    setTotal(0);
    // 查询表格数据参数
    const params = {
      ...queryParams,
      ...formParams,
      C_EXPENSE_DATE_START: balanceDate ? transferDate(balanceDate[0]) : '', // 余额日期开始
      C_EXPENSE_DATE_END: balanceDate ? transferDate(balanceDate[1]) : '', // 余额日期结束
      D_ORD_START: ordDate ? transferDate(ordDate[0]) : '', // 指令日期开始
      D_ORD_END: ordDate ? transferDate(ordDate[1]) : '', // 指令日期结束
      keyWords: keyWordsData.current,
    };
    dispatch({
      type: 'repaymentInstructions/getReceiptList',
      payload: params,
      callback: res => {
        if (res && res.rows) {
          setDataSource(res.rows);
          setTotal(res.total);
        }
      },
    });
  };

  // 搜索时重新设置数据
  const getAdvancSearchParams = (filedValue: any) => {
    const params = filedValue || {};
    const searchParams = {
      C_PORT_CODE: params.C_PORT_CODE || [], // 产品全称
      FLOWSTATE: params.FLOWSTATE || [], // 指令状态
      C_EXPENSE_DATE_START: balanceDate ? balanceDate[0] : '', // 余额日期开始
      C_EXPENSE_DATE_END: balanceDate ? balanceDate[1] : '', // 余额日期结束
      D_ORD_START: ordDate ? ordDate[0] : '', // 指令日期开始
      D_ORD_END: ordDate ? ordDate[1] : '', // 指令日期结束
      C_PAY_TYPE: params.C_PAY_TYPE || [],
    };
    setFormParams(searchParams);
    setCurrentPage(1);
  };

  // 点击重置按钮, 重新设置数据
  const resetForm = () => {
    const currentSearchData = {
      C_PORT_CODE: [], // 产品全称
      FLOWSTATE: [], // 指令状态
      C_PAY_TYPE: [], // 费用类型
      C_EXPENSE_DATE_START: '', // 余额日期开始
      C_EXPENSE_DATE_END: '', // 余额日期结束
      D_ORD_START: '', // 指令日期开始
      D_ORD_END: '', // 指令日期结束
    };
    setOrdDate('');
    setBalanceDate('');
    setFormParams(currentSearchData);
    setCurrentPage(1);
  };

  // 点击checkBox
  const handleSelectRows = keys => {
    setSelectedRows(keys);
  };

  // 切换tab栏
  const changeTabs = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    resetForm();
    setSelectedRows([]);
    setActiveTab(key);
  };

  // 模糊搜索时调用方法
  const blurSearch = key => {
    keyWordsData.current = key;
    handleGetTableDataAPI();
  };

  // 刷新列表数据
  const refreshData = () => {
    if (queryParams.currentPage === 1) {
      handleGetTableDataAPI();
    } else {
      setCurrentPage(1);
    }
  };

  // 日期格式转化
  const formatDate = date => {
    return moment(date).format('YYYYMMDD');
  };

  // 获取 基金余额 数据
  const getReceiptDataApi = tradeDay => {
    dispatch({
      type: 'repaymentInstructions/getReceiptData',
      payload: tradeDay,
      callback: () => {
        refreshData();
      },
    });
  };

  // 点击 获取余额 按钮
  const getBalance = () => {
    setModalShow(true);
  };

  // 关闭弹框
  const handleModalClose = () => {
    setModalShow(false);
  };

  // 拉取数据
  const handleModalSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        const date = formatDate(values.date);
        getReceiptDataApi(date);
      }
    });
  };

  // 点击 生成费用划款指令 按钮
  const createOrd = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择列表数据');
    } else {
      const idsString = selectedRows.join(',');
      router.push(
        `/dynamicPage/pages/划款指令/8aaa82777faabb58017fd368bfe00001/新增费用划款指令?submitType=6&ids=${idsString}`,
      );
    }
  };

  // 请求:字典数据
  const handleGetSelectOptions = () => {
    dispatch({
      type: 'repaymentInstructions/getDicts',
      payload: { codeList: ['A002', 'transferOrdStatus', 'transferOrdSource'] },
    });
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'repaymentInstructions/getProNameAndCodeFunc',
      payload: { isAccountCancel: '1' }// 剔除销户的账户和托管户销户的产品(资金运用部分优化)
    });
  };

  // 获取 款项类型  下拉列表
  const getPaymentTypeList = () => {
    dispatch({
      type: 'repaymentInstructions/getExpenseListPaymentType',
    });
  };

  // 参数变化时, 查询数据列表的数据
  useEffect(() => {
    handleGetTableDataAPI();
  }, [activeTab, currentPage, pageSize, field, direction, formParams]);

  // 获取下拉列表数据
  useEffect(() => {
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    getPaymentTypeList(); // 获取 款项类型 下拉列表
  }, []);

  // 条件查询配置
  const formItemData = [
    {
      name: 'C_PORT_CODE',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple' },
      option: proNameAndCodeData,
    },
    {
      name: 'balanceDate',
      label: '余额日期',
      type: 'rangePicker',
      config: {
        format: 'YYYY-MM-DD',
        onChange: (moment, string) => {
          setBalanceDate(string);
        },
        getCalendarContainer: () => document.getElementById('expenseId')
      },
    },
    {
      name: 'FLOWSTATE',
      label: '指令状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple' },
      option: dicts.transferOrdStatus,
    },
    {
      name: 'C_PAY_TYPE',
      label: '费用类型',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple' },
      option: expenseListPaymentTypeList,
    },
    {
      name: 'ordDate',
      label: '指令日期',
      type: 'rangePicker',
      config: {
        format: 'YYYY-MM-DD',
        onChange: (moment, string) => {
          setOrdDate(string);
        },
        getCalendarContainer: () => document.getElementById('expenseId')
      },
    },
  ];

  // 表头数据
  const [columns, setColumns] = useState([
    {
      title: '产品名称',
      dataIndex: 'C_PORT_NAME',
      ...tableRowConfig,
      width: 400,
      fixed: 'left',
    },
    {
      title: '产品代码',
      dataIndex: 'C_PORT_CODE',
      ...tableRowConfig,
    },
    // 费用类型
    {
      title: '费用类型',
      dataIndex: 'C_PAY_TYPE',
      ...tableRowConfig,
    },
    {
      title: '余额日期',
      dataIndex: 'C_EXPENSE_DATE',
      ...tableRowConfig,
    },
    {
      title: '余额',
      dataIndex: 'N_ORD_MONEY',
      ...moneyRender,
    },
    {
      title: '指令ID',
      dataIndex: 'C_IDEN',
      ...tableRowConfig,
    },
    {
      title: '指令日期',
      dataIndex: 'D_ORD',
      ...tableRowConfig,
    },
    // 指令状态
    {
      title: '指令状态',
      dataIndex: 'FLOWSTATE',
      ...tableRowConfig,
    },
  ]);
  // 表格功能数据
  const tableData = {
    key: 'id',
    columns: columns,
    dataSource: dataSource,
    listLoading: listLoading,
    onChange: (a, b, data) => {
      const order = data.order ? data.order.replace('end', '') : '';
      const fieldName = data.field;
      setField(fieldName);
      setDirection(order);
    },
    pagination: {
      pageSizeOptions: ['10', '20', '30', '40'],
      showSizeChanger: true,
      onShowSizeChange: (num, size) => [setCurrentPage(1), setPageSize(size)],
      showQuickJumper: true,
      onChange: (num, size) => [setCurrentPage(num), setPageSize(size)],
      current: currentPage,
      total: total,
      showTotal: () => `共 ${total} 条数据`,
    },
    rowSelection: {
      selectedRowKeys: selectedRows,
      onChange: handleSelectRows,
    },
    button() {
      return (
        <>
          <Action key="expenseList:check" code="expenseList:check">
            <Button onClick={getBalance} type="primary">
              获取余额
            </Button>
          </Action>
          <Action key="expenseList:create" code="expenseList:create">
            <Button
              onClick={createOrd}
              type="primary"
              className={styles.buttonMarginLeft20}
              disabled={activeTab !== '0'}
            >
              生成费用划款指令
            </Button>
          </Action>
          <Modal
            title="获取基金余额"
            visible={modalShow}
            onCancel={handleModalClose}
            footer={[
              <Button
                key="submit"
                type="primary"
                disabled={checksLoading}
                onClick={handleModalSubmit}
                loading={checksLoading}
              >
                拉取数据
              </Button>,
              <Button key="back" onClick={handleModalClose}>
                关闭
              </Button>,
            ]}
          >
            <>
              <Form layout="inline">
                <Form.Item label="余额日期：">
                  {getFieldDecorator('date', {
                    rules: [
                      {
                        required: true,
                        message: '请选择余额日期',
                      },
                    ],
                  })(<DatePicker />)}
                </Form.Item>
              </Form>
            </>
          </Modal>
        </>
      );
    },
    tabs: true,
    tabsOnChange: e => changeTabs(e),
    tabList: [
      { key: '0', tab: '待生成指令' },
      { key: '1', tab: '已生成指令' },
    ],
  };

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <div id="expenseId">
      <List
        pageCode="expenseList"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={activeTab}
        title={false}
        formItemData={formItemData}
        advancSearch={getAdvancSearchParams}
        searchInputWidth="300"
        resetFn={resetForm}
        searchPlaceholder="请输入产品名称/产品代码"
        fuzzySearch={blurSearch}
        // tab栏
        tabs={{
          tabList: tableData.tabList,
          activeTabKey: activeTab,
          onTabChange: tableData.tabsOnChange,
        }}
        extra={tableData.button() ? tableData.button() : ''}
        tableList={
          <Table
            className={styles.controlButtonDiv}
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
    </div>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ repaymentInstructions, loading, publicModel: { publicTas } }) => ({
      repaymentInstructions,
      listLoading: loading.effects['repaymentInstructions/getReceiptList'],
      checksLoading: loading.effects['repaymentInstructions/getReceiptData'],
      publicTas,
    }))(Index),
  ),
);

export default WrappedIndexForm;

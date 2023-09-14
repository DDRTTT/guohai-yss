/**
 * 账户信息管理
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Dropdown,
  Button,
  Select,
  Form,
  Row,
  Col,
  Icon,
  Input,
  Card,
  Breadcrumb,
} from 'antd';
import { Table } from '@/components';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;

const Index = ({
  fnLink,
  form: { getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  accountManagement: { dicts, proNameAndCodeData, accountManagementTableData },
}) => {
  const [onAndOff, setOnAndOff] = useState(false); // 展开/收起搜索
  const dataObj = useRef({}); // 请求参数
  const totalData = useRef(0); // 页码总数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const accountTypeData = useRef(''); // 账户类型
  const accountNameData = useRef(''); // 账户名称
  const proNameData = useRef(''); // 产品全称
  const proCodeData = useRef(''); // 产品代码
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const batchData = useRef(''); // 批量操作参数

  /**
   * 更新请求参数
   * @method  handleGetDataObj
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      accountType: accountTypeData.current,
      accountName: accountNameData.current,
      proName: proNameData.current,
      proCode: proCodeData.current,
      keyWords: keyWordsData.current,
      direction: directionData.current,
      field: fieldData.current,
    };
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'accountManagement/getProNameAndCodeFunc',
    });
  };

  // 请求:获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'accountManagement/fetch',
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
      type: 'accountManagement/getDicts',
      payload: { codeList: ['CS021', 'S001', 'A002'] },
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
        proNameData.current = values.proName;
        proCodeData.current = values.proCode;
        directionData.current = values.direction;
        fieldData.current = values.field;
        handleGetDataObj();
      }
    });
    handleGetListData();
  };

  useEffect(() => {
    handleGetDataObj(); // 更新请求参数
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    resetFields();
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param   {key}         搜索框值
   */
  const blurSearch = key => {
    keyWordsData.current = key;
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
            {handleProNameAndCodeSelect('产品全称 : ', 'proName', '请选择产品全称', 'proCode')}
          </Col>
          <Col md={8} sm={24}>
            {handleProNameAndCodeSelect('产品代码 : ', 'proCode', '请选择产品代码')}
          </Col>
          <Col md={8} sm={24}>
            {handleMapList(
              'CS021',
              'code',
              'name',
              '参数类型 : ',
              'proParamType',
              '请选择参数类型',
            )}
          </Col>
          <Col md={8} sm={24}>
            {handleMapList(
              'S001',
              'code',
              'name',
              '\xa0\xa0\xa0\xa0\xa0\xa0\xa0状态 : ',
              'status',
              '请选择状态',
            )}
          </Col>
        </Row>
        <div style={{ textAlign: 'right' }}>
          <span className={styles.submitButtons} style={{ marginRight: 10 }}>
            <Action code="accountManagement:query">
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
            onClick={() => {setOnAndOff()}}
            type="link">收起搜索<Icon type="up" />
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
    pageNumData.current = current;
    handleGetDataObj();
    handleGetListData();
  };
  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
    handleGetListData();
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
   * @method handleGoAdd 跳转流程引擎-开户申请
   */
  const handleGoAdd = () => {
    fnLink('accountManagement:link', '');
  };

  // 开户申请按钮
  const handleOperations = () => {
    return (
      <Action code="accountManagement:link">
        <Button onClick={handleGoAdd} style={{ position: 'relative', left: '90%', bottom: '10px' }}>
          开户申请
        </Button>
      </Action>
    );
  };

  // 查看
  const handleGoCheck = record => {
    dispatch(
      routerRedux.push({
        pathname: '../productDataManage/accountManagement',
      }),
    );
  };

  // 变更
  const handleGoChange = record => {
    dispatch(
      routerRedux.push({
        pathname: '../productDataManage/accountManagement',
      }),
    );
  };
  // 销户
  const handleGoClear = () => {
    fnLink('accountManagement:clear', '');
  };

  // 认领
  const handleCanClaim = record => {};
  // 委托
  const handleCanEntrust = record => {};
  // 退回
  const handleCanNoPass = record => {};
  // 移交
  const handleCanHandOver = record => {};
  // 传阅
  const handleCanCirculate = record => {};

  /**
   * 创建按钮-查看
   */
  const handleCanCheck = record => {
    return (
      <Action code="accountManagement:check">
        <Button type="link" onClick={() => handleGoCheck(record)}>
          查看
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-变更
   */
  const handleCanChange = record => {
    return (
      <Action code="accountManagement:change">
        <Button type="link" onClick={() => handleGoChange(record)}>
          变更
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-销户
   */
  const handleCanClear = record => {
    return (
      <Action code="accountManagement:clear">
        <Button type="link" onClick={() => handleGoClear(record)}>
          销户
        </Button>
      </Action>
    );
  };

  // 表头数据
  const columns = [
    {
      title: '账户类型',
      dataIndex: 'accountTypeName',
      key: 'accountTypeName',
      align: 'center',
      sorter: true,
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      align: 'center',
      sorter: true,
    },
    {
      title: '产品全称',
      dataIndex: 'proName',
      key: 'proName',
      align: 'center',
      sorter: true,
    },
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
      align: 'center',
      sorter: true,
    },
    {
      title: '账户状态',
      dataIndex: 'accountStatusName',
      key: 'accountStatusName',
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            {handleCanCheck(record)}
            {handleCanChange(record)}
            {handleCanClear(record)}
          </>
        );
      },
    },
  ];

  /**
   * 表格多选框按钮
   * @const   rowSelection
   * @method  onChange
   * @param   {selectedRowKeys} 选中项key值
   * @param   {selectedRows} 选中项
   */
  const rowSelection = {
    onChange: (selectedRowKeys /* , selectedRows */) => {
      batchData.current = selectedRowKeys;
      // console.log('行key赋值后的批量参数:', batchData.current);
      // console.log('这一行的数据对象:', selectedRows);
    },
  };

  /**
   * 批量操作请求
   * @method  handleCanBatchToDo
   * @param
   * @return  {Object}     表格数据及属性
   */
  const handleCanBatchToDo1 = () => {
    console.log('提交:', batchData.current);
  };
  const handleCanBatchToDo2 = () => {
    console.log('认领:', batchData.current);
  };
  const handleCanBatchToDo3 = () => {
    console.log('委托:', batchData.current);
  };
  const handleCanBatchToDo4 = () => {
    console.log('退回:', batchData.current);
  };
  const handleCanBatchToDo5 = () => {
    console.log('移交:', batchData.current);
  };
  const handleCanBatchToDo6 = () => {
    console.log('传阅:', batchData.current);
  };

  /**
   * 批量操作按钮(并渲染)
   * @method  handleCanBatch
   * @param
   * @return  {Object}     表格数据及属性
   */
  const handleGetCheckbox = () => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={handleCanBatchToDo1}>
          提交
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            handleCanBatchToDo2;
          }}
        >
          认领
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            handleCanBatchToDo3;
          }}
        >
          委托
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            handleCanBatchToDo4;
          }}
        >
          移交
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            handleCanBatchToDo5;
          }}
        >
          退回
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            handleCanBatchToDo6;
          }}
        >
          传阅
        </Menu.Item>
      </Menu>
    );
  };

  const handleCanBatch = () => {
    return (
      // <Action code="accountManagement:checkbox">
      <Dropdown overlay={handleGetCheckbox()} className={styles.batshSelect}>
        <Button>批量操作</Button>
      </Dropdown>
      // </Action>
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
   * 渲染表格数据
   * @method  tableData
   * @param
   * @return  {Object}     表格数据及属性
   */
  const tableData = columns => {
    return (
      <Table
        bordered
        style={{ backgroundColor: '#FFF' }}
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={accountManagementTableData.rows} // 表数据源
        columns={columns} // 表头数据
        onChange={handleChangeSorter}
      />
    );
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
              <Breadcrumb>
                <Breadcrumb.Item>产品生命周期</Breadcrumb.Item>
                <Breadcrumb.Item>账户信息管理</Breadcrumb.Item>
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
                />
                <span className={styles.searchLabel} onClick={() => setOnAndOff(true)}>
                  展开搜索
                  <Icon type="down" />
                </span>
                <Button
                  className={styles.searchLabel}
                  onClick={() => {setOnAndOff(true)}}
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

  return (
    <>
      {handleAddSerach()}
      {handleOperations()}
      {tableData(columns)}
      {handleCanBatch()}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ accountManagement, loading }) => ({
        accountManagement,
        listLoading: loading.effects['accountManagement/fetch'],
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

// 生命周期编排页面
import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  Tabs,
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
// import Action, { fnLink } from '@/utils/hocUtil';
import { cloneDeep } from 'lodash';
import styles from './index.less';
import PageContainer from '@/components/PageContainers';
import List from '@/components/List';
import { Table } from '@/components';

const { TabPane } = Tabs;
const { Search } = Input;
const FormItem = Form.Item;
const selectData = [];
const routerPath = {
  linkAddress: '/processCenter/flow',
};

const Index = ({
  dispatch,
  listLoading,
  flowList: { saveFlowListInfo },
  flow: { saveWordDictionaryFetch, saveAuthorityProduct },
}) => {
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  // 批量操作按钮集合
  const [btnList, setBtnList] = useState([]);

  // tabs code
  const tabs = useRef('type');
  // 每页数据条数
  const pageSize = useRef(10);
  // 页码(10)
  const currentPage = useRef(1);
  const lifecycleName = useRef();
  const proType = useRef();
  const proCode = useRef();
  const field = useRef('');
  const direction = useRef('');

  const columns = [
    {
      title: '产品类型',
      dataIndex: 'porCodeName',
      key: 'porCodeName',
      sorter: true,
    },
    {
      title: '类型代码',
      dataIndex: 'proCode',
      key: 'proCode',
      sorter: true,
    },
    {
      title: '生命周期标题',
      dataIndex: 'lifecycleName',
      key: 'lifecycleName',
      sorter: true,
    },
    {
      title: '发布状态',
      dataIndex: 'statusName',
      key: 'statusName',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: '发布时间',
      dataIndex: 'checkerTime',
      key: 'checkerTime',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'opeator',
      key: 'opeator',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        const actionBtnList = getActionBtn(record.statusName);
        return <ActionButton buttonList={actionBtnList} handlerBack={handleEdit} record={record} />;
      },
    },
  ];

  // 阶段流程 列表
  useEffect(() => {
    handleGetListFetch('type', 10, 1);
    handleWordDictionaryFetch('A002');
    handleAuthorityProduct('flow'); // 当前菜单代码
  }, []);

  // 产品名称下拉框
  const handleProductSelection = proType => {
    dispatch({
      type: 'flowList/handleProductSearch',
      payload: { proType, proStage: 'P002_2' },
    });
  };

  /**
   * 词汇字典
   * @method  handleWordDictionaryFetch
   * @param codeList {string} 词汇代码
   */
  const handleWordDictionaryFetch = codeList => {
    dispatch({
      type: 'flow/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  // 权限产品
  const handleAuthorityProduct = menuCode => {
    dispatch({
      type: 'flow/handleAuthorityProduct',
      payload: { menuCode },
    });
  };

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   */
  const handleMapList = (data, code, name, mode = false, fnBoole = false, fn) => {
    if (!data) {
      data = {};
      data.data = [];
    }
    const e = data;
    if (e) {
      const children = [];
      for (const key of e) {
        const keys = key[code];
        const values = key[name];
        children.push(
          <Select.Option key={keys} value={keys}>
            {values}
          </Select.Option>,
        );
      }
      return (
        <Select
          maxTagCount={1}
          mode={mode}
          style={{ width: '100%' }}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={fnBoole ? fn : ''}
        >
          {children}
        </Select>
      );
    }
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = (searchnData) => {
    const data = searchnData || {};
    lifecycleName.current = data.lifecycleName;
    proType.current = data.proType
    proCode.current = data.pProCode
    handleGetListFetch();
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    lifecycleName.current = null
    proType.current = null
    proCode.current = null
    pageSize.current = 10
    currentPage.current = 1
    field.current = ""
    direction.current = ""
    handleGetListFetch();
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param type {string} 类型
   * @param pageSize {number} 每页大小
   * @param currentPage  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = () => {
    const params = {
      proType: tabs.current,
      pageSize: pageSize.current,
      currentPage: currentPage.current,
      field: field.current,
      direction: direction.current,
      lifecycleName: lifecycleName.current,
      proCode: proCode.current,
    }
    dispatch({
      type: 'flowList/handleGetListMsg',
      payload: params,
    });
  };

  /**
   * table 回调
   * @param {*} key
   */
  const handleTabsChanges = key => {
    tabs.current = key
    handleFormReset()
  };

  /**
   * rowSelection 回调
   */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows);
    },
  };

  /**
   * 分页回调
   * @method  handlePaginationChange
   */
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    field.current = sorter.columnKey;
    switch (sorter.order) {
      case 'ascend':
        direction.current = 'asc';
        break;
      case 'descend':
        direction.current = 'desc';
        break;
      default:
        direction.current = '';
        break;
    }
    pageSize.current = 10;
    currentPage.current = 1;
    handleGetListFetch();
  };

  // 批量操作 Todo
  const batchOperate = () => { };

  // 展开搜索收起 查询
  const blurSearch = value => {
    lifecycleName.current = value;
    handleGetListFetch();
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total: saveFlowListInfo.total,
    showTotal: total => `共 ${total} 条数据`,
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  /**
   * 操作列表按钮
   *
   */
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map((item, index) => {
      let button;
      if (item.type !== 'more') {
        button = (
          <Button type="link" size="small"
            onClick={() => {
              props.handlerBack(item.label, props.record);
            }}
          >
            {item.label}
          </Button>
        );
      } else {
        const menu = (
          <Menu>
            {item.list.map((item, index) => {
              return (
                <Menu.Item key={index}>
                  <Button type="link" size="small"
                    onClick={() => {
                      props.handlerBack(item, props.record);
                    }}
                  >
                    {item}
                  </Button>
                </Menu.Item>
              );
            })}
          </Menu>
        );
        button = (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" size="small"
              className="ant-dropdown-link"
              onClick={e => {
                e.preventDefault();
              }}
            >
              更多
              <Icon type="caret-right" />
            </Button>
          </Dropdown>
        );
      }
      return <span key={index}>{button}</span>;
    });
    return child;
  };

  /**
   * 根据不同的tabs生成不同的按钮
   * @param {*} operStatusName
   */
  const getActionBtn = operStatusName => {
    let buttonList = [];
    switch (operStatusName) {
      case '已发布':
        buttonList = [
          { label: '预览' },
          { label: '取消发布' },
          // { label: '修改' },
          // { label: '复制' },
          // { label: '删除' },
        ];
        break;
      case '未发布':
        buttonList = [
          { label: '预览' },
          { label: '发布' },
          { label: '修改' },
          // { label: '复制' },
          { label: '删除' },
        ];
        break;
    }
    return buttonList;
  };

  /**
   * 为操作列表按钮，绑定事件
   * @param {*} label
   * @param {*} record
   */
  const handleEdit = (label, record) => {
    const { id } = record;
    let status;
    switch (label) {
      case '预览':
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAddress,
            query: { id, preview: true },
          }),
        );
        break;
      case '发布':
        status = 1;
        dispatch({
          type: 'flowList/handlePublishProductFetch',
          payload: { id, status },
        }).then(data => {
          if (data) {
            handleGetListFetch('type', 10, 1);
          }
        });
        break;
      case '取消发布':
        status = 0;
        dispatch({
          type: 'flowList/handlePublishProductFetch',
          payload: { id, status },
        }).then(data => {
          if (data) {
            handleGetListFetch('type', 10, 1);
          }
        });
        break;
      case '修改':
        const newData = {
          proCode: record.proCode,
          proType: record.proType,
          lifecycleName: record.lifecycleName,
        };
        localStorage.setItem('newData', JSON.stringify(newData));
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAddress,
            query: { id, edit: true },
          }),
        );
        break;
      case '复制':
        break;
      case '删除':
        dispatch({
          type: 'flowList/handleDeleteProductFetch',
          payload: { id },
        }).then(data => {
          if (data) {
            handleGetListFetch('type', 10, 1);
          }
        });
        break;

      default:
        throw new Error('没有该按钮的处理方法');
    }
  };

  /**
   * table组件
   */
  const tableCom = () => {
    return (
      <Table
        rowKey="proCode"
        loading={listLoading}
        dataSource={saveFlowListInfo.rows}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  // 发起流程
  const extractContent = () => {
    return (
      <Button type="primary" href={routerPath.linkAddress}>
        新增
      </Button>
    );
  };

  // 批量操作按钮
  const dropdownBtn = btnList => {
    const menu = (
      <Menu>
        {btnList.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <a
                onClick={() => {
                  batchOperation(item);
                }}
              >
                {item}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    const button = (
      <Dropdown overlay={menu} trigger={['click']}>
        <a
          className="ant-dropdown-link"
          onClick={e => {
            e.preventDefault();
          }}
        >
          <Button>批量操作</Button>
        </a>
      </Dropdown>
    );
    return button;
  };

  // 批量操作方法
  const batchOperation = btn => {
    switch (btn) {
      case value:
        break;

      default:
        break;
    }
  };

  const formItemData = [
    {
      name: 'lifecycleName',
      label: '生命周期标题',
      type: 'input',
    }, {
      name: 'proCode',
      label: '产品类型',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'code' },
      config: { mode: 'multiple' },
      option: saveWordDictionaryFetch.A002,
    }
  ]
  console.log("saveAuthorityProduct");
  console.log(saveAuthorityProduct);
  const formItemDataForProduct = [
    {
      name: 'lifecycleName',
      label: '生命周期标题',
      type: 'input',
    }, {
      name: 'proCode',
      label: '产品代码',
      type: 'select',
      readSet: { name: 'value', code: 'text' },
      config: { mode: 'multiple' },
      option: saveAuthorityProduct,
    },
  ]


  return (
    <>
      <List
        title={false}
        formItemData={tabs.current === 'type' ? formItemData : formItemDataForProduct}
        advancSearch={handleGetSearchFetch}
        resetFn={handleFormReset}
        searchPlaceholder='请输入模板名称'
        fuzzySearch={blurSearch}
        extra={extractContent()}
        tabs={{
          tabList: [
            { key: 'type', tab: '按产品类型' },
            { key: 'product', tab: '按产品' }
          ],
          activeTabKey: tabs.current,
          onTabChange: handleTabsChanges,
        }}
        tableList={tableCom()}
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ flowList, loading, flow }) => ({
      flowList,
      flow,
      listLoading: loading.effects['flowList/handleGetListMsg'],
    }))(Index),
  ),
);

export default WrappedIndexForm;

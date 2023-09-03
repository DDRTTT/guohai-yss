/**
 *Create on 2020/9/23. (单一客户信息管理 - 列表页)
 */

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Menu, message, Modal, Pagination, Select, Tooltip } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { getDynamicOptColWidth, getSumWidth } from '@/utils/utils';
import MakeUpModal from './MakeUpModal';
import { Card, Table } from '@/components';
import CommonSearch from '@/components/AdvancSearch/CommonSearchs';
import List from '@/components/List';

const { Option } = Select;
const { confirm } = Modal;

const Index = ({
  listLoading,
  dispatch,
  myInvestor: {
    saveFetchList,
    saveDictBatchQuery: { I009 },
  },
}) => {
  const [openType, setOpenType] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [direction, setDirection] = useState('');
  const [field, setField] = useState('');
  const [keyWords, setKeyWords] = useState('');
  const [searchData, setSearchData] = useState({});
  const Render = text => (
    <Tooltip title={text}>
      {text ? text.toString().replace(/null/g, '-') : text === '' || text === undefined ? '-' : 0}
    </Tooltip>
  );
  const [columns, setColumns] = useState([
    {
      title: '客户名称',
      dataIndex: 'clientName',
      sorter: true,
      width: 400,
      ellipsis: true,
      render: Render,
    },
    {
      title: '账户类型',
      dataIndex: 'clientType',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: val => {
        switch (val) {
          case '0':
            return '机构';
          case '1':
            return '自然人';
          case '2':
            return '产品';
          default:
            return val;
        }
      },
    },
    {
      title: '是否专业投资者',
      dataIndex: 'isMajorInvestor',
      sorter: true,
      align: 'center',
      width: 150,
      ellipsis: true,
      render: text => (text === '0' ? '否' : text === '1' ? '是' : '-'),
    },
    {
      title: '是否是金融客户',
      dataIndex: 'isFinanceClient',
      sorter: true,
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (text, record) =>
        record.clientType === '1' ? '-' : text === '0' ? '否' : text === '1' ? '是' : '-',
    },
    {
      title: '非自然人客户类型',
      dataIndex: 'customerTypeName',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: Render,
    },
    {
      title: '状态',
      dataIndex: 'checked',
      sorter: true,
      width: 100,
      ellipsis: true,
      render: val => {
        switch (val) {
          case 'D001_1':
            return '未生效';
          case 'D001_2':
            return '已生效';
          case 'D001_3':
            return '废弃';
          default:
            return val;
        }
      },
    },
    {
      title: '审查状态',
      dataIndex: 'reviewStatus',
      sorter: true,
      width: 100,
      ellipsis: true,
      render: text => (text === '0' ? '未审查' : '已审查'),
    },
    {
      title: '审查时间',
      dataIndex: 'reviewTime',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: text => (text ? text : '-'),
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => (
        <div>
          <Action code="myInvestor:look">
            <Button
              style={{ marginLeft: '-10px' }}
              onClick={() => watchDetail(record)}
              type="link"
              size="small"
            >
              查看
            </Button>
          </Action>
          <Action code="myInvestor:update">
            <Button
              disabled={record.checked !== 'D001_1'}
              onClick={() => modify(record)}
              type="link"
              size="small"
            >
              修改
            </Button>
          </Action>
          <Action code="myInvestor:makeUpSubmit">
            <MakeUpModal recordId={record.id} />
          </Action>
          <Action code="myInvestor:status">
            <Button
              disabled={record.checked !== 'D001_1'}
              onClick={() => handleConfirm(record, 'D001_2')}
              type="link"
              size="small"
            >
              审核
            </Button>
          </Action>
          <Action code="myInvestor:status">
            <Button
              disabled={record.checked !== 'D001_2'}
              onClick={() => handleConfirm(record, 'D001_1')}
              type="link"
              size="small"
            >
              反审核
            </Button>
          </Action>
          <Action code="myInvestor:review">
            <Button
              disabled={record.checked !== 'D001_2'}
              onClick={() => investorReview(record)}
              type="link"
              size="small"
            >
              投资者审查
            </Button>
          </Action>
          <Action code="myInvestor:delete">
            <Button
              disabled={record.checked === 'D001_2'}
              onClick={() => handleConfirm(record)}
              type="link"
              size="small"
            >
              删除
            </Button>
          </Action>
        </div>
      ),
    },
  ]);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    fetchList({});
  }, [pageNum, pageSize, direction, field, searchData]);

  // 页面table表格数据改变时，获取动态操作列的宽度
  useEffect(() => {
    setScrollX(60 + getSumWidth(columns) + getDynamicOptColWidth());
  }, [saveFetchList.total]);

  useEffect(() => {
    // 查询条件（词汇字典）
    dispatch({
      type: `myInvestor/queryCriteria`,
      payload: 'I009',
    });
  }, []);

  const fetchList = par => {
    dispatch({
      type: `myInvestor/fetch`,
      payload: {
        pageNum,
        pageSize,
        direction,
        field,
        keyWords,
        ...par,
        ...searchData,
      },
    });
  };

  // 下拉
  const getDropdownData = data => {
    if (!data) data = [];
    let children = [];
    data.map(item => {
      children.push(
        <Option key={item.code} value={item.code}>
          {item.name}
        </Option>,
      );
    });

    return (
      <Select style={{ width: '100%' }} optionFilterProp={'children'} placeholder="请选择">
        {children}
      </Select>
    );
  };

  const handleStandardTableChange = ({ current, pageSize }, filters, sorter, extra) => {
    setField(sorter.field);
    if (sorter.order === 'ascend') {
      setDirection('asc');
    } else if (sorter.order === 'descend') {
      setDirection('desc');
    } else {
      setDirection('');
    }
  };

  // 分页
  const handleSetPage = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
  };

  //
  const handlePageSize = (page, pageSize) => {
    setPageNum(1);
    setPageSize(pageSize);
  };

  const handleCanBatchToDo = ({ key }) => {
    if (selectedRows.length === 0) return message.warn('请选择需要批量操作的客户!');
    const ids = [];
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].checked == 'D001_2' && key == '1') {
        message.warn('已生效的客户不能进行审核!');
        return;
      }
      if (selectedRows[i].checked === 'D001_1' && key == '2') {
        message.warn('未生效的客户不能进行反审核!');
        return;
      }
      if (selectedRows[i].checked === 'D001_2' && key == '3') {
        message.warn('已生效的客户不能删除!');
        return;
      }
      ids.push(selectedRows[i].id);
    }
    if (key === '1' || key === '2') {
      confirm({
        closable: true,
        content: key === '1' ? '请确认是否审核?' : '请确认是否反审核?',
        onOk: () => {
          dispatch({
            type: 'myInvestor/handleChecked',
            payload: {
              ids,
              checked: key === '1' ? 'D001_2' : 'D001_1',
            },
          }).then(res => {
            if (res && res.status === 200) {
              fetchList({});
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }
          });
        },
      });
    } else {
      confirm({
        closable: true,
        content: '请确认是否删除?',
        onOk: () => {
          dispatch({
            type: 'myInvestor/handleDelete',
            payload: {
              ids,
            },
          }).then(res => {
            if (res && res.status === 200) {
              fetchList({});
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }
          });
        },
      });
    }
  };

  const handleGetCheckbox = () => {
    return (
      <Menu onClick={handleCanBatchToDo}>
        <Menu.Item key="1">审核</Menu.Item>
        <Menu.Item key="2">反审核</Menu.Item>
        {/* <Menu.Item key="3">删除</Menu.Item> */}
      </Menu>
    );
  };

  const handleConfirm = (record, checked) => {
    if (checked) {
      confirm({
        closable: true,
        content: checked === 'D001_2' ? '请确认是否审核?' : '请确认是否反审核?',
        onOk: () => {
          dispatch({
            type: 'myInvestor/handleChecked',
            payload: {
              ids: [record.id],
              checked,
            },
          }).then(resData => {
            if (resData && resData.status === 200) fetchList({});
          });
        },
      });
    } else {
      confirm({
        closable: true,
        content: '请确认是否删除?',
        onOk: () => {
          dispatch({
            type: 'myInvestor/handleDelete',
            payload: {
              ids: [record.id],
            },
          }).then(resData => {
            if (resData && resData.status === 200) fetchList({});
          });
        },
      });
    }
  };

  // 查看操作
  const watchDetail = record => {
    let busIds = '';
    if (record.busIdList.length) {
      record.busIdList.forEach(element => {
        busIds += '&busIdList=' + element;
      });
    }

    router.push(`/productDataManage/myInvestor/newInvestor?id=${record.id}&dis=${true}${busIds}`);
  };

  // 修改操作
  const modify = record => {
    router.push(`/productDataManage/myInvestor/newInvestor?isModify=${true}&id=${record.id}`);
  };

  // 投资者审查操作
  const investorReview = record => {
    router.push(
      `/dynamicPage/pages/投资者审查/4028e7b67443dc6e01745d1e6c93001c/发起流程?id=${record.id}`,
    );
  };

  // 勾选
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    selectedRowKeys: selectedRowKeys,
  };

  // 表单查询
  const handlerSearch = fieldsValue => {
    setPageNum(1);
    setSearchData(fieldsValue);
  };
  // 搜索查询
  const searchQuery = val => {
    setPageNum(1);
    fetchList({ keyWords: val, pageNum: 1 });
  };
  // 重置
  const handleReset = () => {
    setPageNum(1);
    setField('');
    setDirection('');
    setSearchData({});
  };

  const formItemData = [
    {
      name: 'clientType',
      label: '账户类型',
      type: 'select',
      option: I009,
    },
    {
      name: 'clientName',
      label: '客户名称',
      type: 'Input',
    },
  ];

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <>
      <List
        pageCode="myInvestor"
        dynamicHeaderCallback={callBackHandler}
        columns={columns}
        taskTypeCode={null}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchInputWidth="300"
        searchPlaceholder="请输入客户名称"
        fuzzySearch={val => searchQuery(val)}
        extra={
          <Action code="myInvestor:add">
            <Button
              type="primary"
              onClick={() => router.push('/productDataManage/myInvestor/newInvestor')}
            >
              新增
            </Button>
          </Action>
        }
        tableList={
          <>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              pagination={false}
              loading={listLoading}
              dataSource={saveFetchList.rows}
              onChange={handleStandardTableChange}
              scroll={{ x: scrollX }}
            />
            {saveFetchList.total !== 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <Dropdown overlay={handleGetCheckbox()} trigger={['click']}>
                  <Button>批量操作</Button>
                </Dropdown>
                <Pagination
                  style={{
                    textAlign: 'right',
                  }}
                  current={pageNum}
                  pageSize={pageSize}
                  onChange={handleSetPage}
                  onShowSizeChange={handlePageSize}
                  total={saveFetchList.total}
                  showTotal={() => `共 ${saveFetchList.total} 条数据`}
                  showSizeChanger
                  showQuickJumper={saveFetchList.total > pageSize}
                />
              </div>
            ) : null}
          </>
        }
      />
    </>
  );
};

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ myInvestor, loading }) => ({
      myInvestor,
      listLoading:
        loading.effects['myInvestor/fetch'] ||
        loading.effects['myInvestor/handleDelete'] ||
        loading.effects['myInvestor/handleChecked'],
    }))(Index),
  ),
);

export default WrappedIndex;

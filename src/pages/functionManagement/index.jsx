import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Action, { ActionBool } from '@/utils/hocUtil';
import { Button, Dropdown, Form, Icon, Menu, message, Popconfirm, Tag } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import List from '@/components/List';
import { Table } from '@/components';
import { eutrapelia, tableRowConfig } from '@/pages/investorReview/func';

const Index = ({
  dispatch,
  roleManagement: {
    saveDictList: { attributionSystem },
  },
  loading,
  form: { resetFields },
  functionManagement: { tableList },
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIdStr, setSelectedRowsIdStr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryStr, setQueryStr] = useState('');
  const [searchForm, setSearchForm] = useState({});

  // 获取成员列表
  const getMemberList = (val = '') => {
    setCurrentPage(1);
    setPageSize(10);
    setQueryStr(val);
  };

  useEffect(() => {
    // 重置状态
    dispatch({
      type: `memberManagement/handleResetState`,
    });
    // 查询字典
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: 'attributionSystem' },
    });
  }, []);

  useEffect(() => {
    getTable();
  }, [currentPage, pageSize, queryStr, searchForm]);

  const getTable = () => {
    dispatch({
      type: `functionManagement/getTableList`,
      payload: {
        currPage: currentPage,
        pageSize,
        name: queryStr,
        ...searchForm,
      },
    });
  };

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  // 发送审核或反审核
  const dispatchCheck = (ids, check) => {
    dispatch({
      type: `functionManagement/check`,
      payload: { ids, check },
    }).then(res => {
      if (res) {
        getTable();
      }
    });
  };

  // 删除
  const handleDelete = selectedRowsIdStr => {
    dispatch({
      type: `functionManagement/delRole`,
      payload: selectedRowsIdStr,
    }).then(res => {
      if (res) {
        getTable();
      }
    });
  };

  // 添加成员
  const handleNewMember = () => {
    // 清空用户信息
    dispatch({
      type: `functionManagement/setRoleDetail`,
      payload: {},
    });
    router.push('./functionManagement/detail?isDetail=0');
  };

  // 批量操作
  const handleMenuClick = ({ key }) => {
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    if (key === '2') {
      dispatch({
        type: `functionManagement/dellist`,
        payload: selectedRowsIdStr,
      }).then(res => {
        if (res) {
          message.success('删除成功');
        }
      });
    } else {
      dispatchCheck(selectedRowsIdStr, key);
    }
    setSelectedRows([]);
    setSelectedRowsIdStr('');
  };

  // columns
  const columns = [
    {
      title: '功能名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '组件描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '归属系统',
      dataIndex: 'sysId',
      key: 'sysId',
      render: (text, record) => {
        const sysItem = attributionSystem.find(item => item.code === `${record.sysId}`);
        return eutrapelia(sysItem ? sysItem.name : '');
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => eutrapelia(record.type === '01' ? '授权' : '功能'),
    },
    {
      title: '状态',
      dataIndex: 'checked',
      key: 'checked',
      render: (text, record) => (
        <>
          {record.checked === 0 ? <Tag color="red">未审核</Tag> : <Tag color="green">已审核</Tag>}
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      width: '250px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <span>
          <span>
            <a onClick={() => toDetailPage(record)}>查看</a>
          </span>
          <span style={{ margin: 5, display: record.checked === 0 ? '' : 'none' }}>
            <a onClick={() => modify(record)}>修改</a>
          </span>
          <Action key="functionManagement:check" code="functionManagement:check">
            <span style={{ margin: 5 }}>
              <a onClick={() => dispatchCheck(record.id, +!record.checked)}>
                {record.checked === 0 ? '审核' : '反审核'}
              </a>
            </span>
          </Action>
          {record.checked === 0 && (
            <Action key="functionManagement:delete" code="functionManagement:delete">
              <span style={{ margin: 5 }}>
                <Popconfirm title="确认删除吗?" onConfirm={() => handleDelete(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            </Action>
          )}
        </span>
      ),
    },
  ];

  // const userName = item => <div style={{ marginLeft: 11, fontSize: 22 }}>{item.username}</div>;

  // 新增功能组件
  const toDetailPage = record =>
    router.push('./functionManagement/detail?isDetail=1&dataId=' + record.id);

  const modify = record =>
    router.push('./functionManagement/detail?isDetail=2&dataId=' + record.id);

  const handleSelectRows = rows => {
    setSelectedRows(rows);
    setSelectedRowsIdStr(rows.join());
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: handleSelectRows,
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: tableList.total,
    current: currentPage,
    showTotal: total => `共 ${total} 条`,
  };
  const formItemData = [
    {
      name: 'name',
      label: '功能名称',
      type: 'input',
    },
    {
      name: 'sysId',
      label: '归属系统',
      type: 'select',
      option: attributionSystem,
    },
    {
      name: 'checked',
      label: '状态',
      type: 'select',
      readSet: { name: 'text', code: 'value' },
      option: [
        { value: '0', text: '未审核' },
        { value: '1', text: '已审核' },
      ],
    },
  ];

  const queryInit = formData => {
    setQueryStr('');
    setCurrentPage(1);
    setPageSize(10);
    setSearchForm(formData);
  };

  return (
    <div className={styles.content}>
      <List
        formItemData={formItemData}
        // 查询按钮
        advancSearch={queryInit}
        searchPlaceholder="请输入功能名称"
        // 模糊查询
        fuzzySearch={getMemberList}
        loading={loading}
        resetFn={() => {
          resetFields();
          setCurrentPage(1);
          setPageSize(10);
          setSearchForm({});
          setQueryStr('');
          getMemberList();
        }}
        extra={
          <Action key="functionManagement:add" code="functionManagement:add">
            <Button onClick={handleNewMember} type="primary" className={styles.defaultButton}>
              新建功能
            </Button>
          </Action>
        }
        tableList={
          <>
            <Table
              rowKey={record => record.id}
              bordered={false}
              columns={columns}
              dataSource={tableList.rows}
              loading={loading}
              onChange={handleStandardTableChange}
              rowSelection={rowSelection}
              pagination={paginationProps}
              scroll={{ x: columns.length * 150 + 500 }}
            />
            <div style={{ marginTop: -45 }}>
              <Action key="memberManagement:delete" code="memberManagement:delete">
                <Dropdown
                  overlay={
                    <Menu onClick={handleMenuClick}>
                      {ActionBool('functionManagement:check') && (
                        <Menu.Item key="0" className={styles.action}>
                          反审核
                        </Menu.Item>
                      )}
                      {ActionBool('functionManagement:check') && (
                        <Menu.Item key="1" className={styles.action}>
                          审核
                        </Menu.Item>
                      )}
                      {ActionBool('functionManagement:batchDelete') && (
                        <Menu.Item key="2" className={styles.action}>
                          删除
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  placement="topLeft"
                >
                  <Button style={{ marginRight: 10, width: 100, height: 26 }}>
                    批量操作
                    <Icon type="up" />
                  </Button>
                </Dropdown>
              </Action>
            </div>
          </>
        }
      />
    </div>
  );
};

export default errorBoundary(
  connect(({ memberManagement, loading, functionManagement, roleManagement }) => ({
    memberManagement,
    functionManagement,
    roleManagement,
    loading:
      loading.effects['functionManagement/getTableList'] ||
      loading.effects['functionManagement/delRole'] ||
      loading.effects['functionManagement/check'],
  }))(Form.create()(Index)),
);

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Action from '@/utils/hocUtil';
import { Button, Col, Drawer, Dropdown, Form, Icon, Menu, message, Popconfirm, Row } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { getSession, setSession, USER_INFO } from '@/utils/session';
import { Table } from '@/components';
import List from '@/components/List';

const Index = ({
  dispatch,
  memberManagement: { saveOrgName, data },
  modify: { department },
  loading,
  form: { resetFields },
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsIdStr, setSelectedRowsIdStr] = useState([]);
  const [baseInfo, setBaseInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryStr, setQueryStr] = useState('');
  const [searchForm, setSearchForm] = useState({});
  const userInfo = JSON.parse(getSession(USER_INFO));
  // 获取成员列表
  const getMemberList = (val = '') => {
    setCurrentPage(1);
    setPageSize(10);
    setQueryStr(val);
  };

  useEffect(() => {
    // 机构名称
    dispatch({
      type: `memberManagement/handleOrgName`,
    });
    // 重置状态
    dispatch({
      type: `memberManagement/handleResetState`,
    });
    if (userInfo && userInfo?.orgId) {
      // 获取机构部门
      dispatch({
        type: 'modify/getDepartment',
        payload: { needRoot: 0, orgId: userInfo?.orgId },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: `memberManagement/fetch`,
      payload: {
        currentPage,
        pageSize,
        queryStr,
        ...searchForm,
      },
    });
  }, [currentPage, pageSize, queryStr, searchForm]);

  // 分页
  const handleStandardTableChange = ({ current, pageSize: size }) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  // 授权--列操作
  const handleOpearAuthorization = record => {
    const { sysId, id, orgId } = record;
    dispatch({
      type: `memberManagement/member`,
      payload: record,
    });
    router.push({
      pathname: './memberManagement/edit',
      query: {
        sysId,
        saveMemberId: id,
        orgId,
      },
    });
    setSession('sysId', record.sysId);
    setSession('memberInfos', JSON.stringify(record));
  };

  // 删除
  const handleDelete = str => {
    dispatch({
      type: `memberManagement/handleDelete`,
      payload: str,
    });
  };

  // 添加成员
  const handleNewMember = () => {
    // 清空用户信息
    dispatch({
      type: `memberManagement/saveInfo`,
      payload: {},
    });
    router.push('./memberManagement/add');
  };

  // 批量操作
  const handleMenuClick = () => {
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    handleDelete(selectedRowsIdStr);
    setSelectedRows([]);
    setSelectedRowsIdStr('');
  };

  const handleShowDrawer = record => {
    setVisible(true);
    setBaseInfo(record);
  };

  const restUserCode = record =>
    dispatch({
      type: `memberManagement/rest`,
      payload: {
        id: record.id,
      },
    });

  // columns
  const columns = [
    {
      title: '登录名',
      dataIndex: 'usercode',
      key: 'usercode',
      fixed: 'left',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '机构类型',
      dataIndex: 'orgTypeName',
      key: 'orgTypeName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      key: 'userType',
      render: (text, record) => <span>{record.type === '01' ? '系统管理员' : '普通用户'}</span>,
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
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
            <a onClick={() => handleShowDrawer(record)}>查看</a>
          </span>
          <Action key="memberManagement:authorization" code="memberManagement:authorization">
            <span style={{ margin: 5 }}>
              <a onClick={() => handleOpearAuthorization(record)}>授权</a>
            </span>
          </Action>
          <Action key="memberManagement:rest" code="memberManagement:rest">
            <span style={{ margin: 5 }}>
              <Popconfirm title="确认重置密码?" onConfirm={() => restUserCode(record)}>
                <a>重置密码</a>
              </Popconfirm>
            </span>
          </Action>
          <Action key="memberManagement:delete" code="memberManagement:delete">
            <span style={{ margin: 5 }}>
              <Popconfirm title="确认删除吗?" onConfirm={() => handleDelete(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </Action>
        </span>
      ),
    },
  ];

  const userName = item => <div style={{ marginLeft: 11, fontSize: 22 }}>{item.username}</div>;

  const handleCloseDrawer = () => setVisible(false);

  const handleSelectRows = rows => {
    setSelectedRows(rows);
    setSelectedRowsIdStr(rows.join());
  };

  const rowSelection = {
    selectedRows,
    onChange: handleSelectRows,
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: data.total,
    current: currentPage,
    showTotal: total => {
      return `共 ${total} 条`;
    },
  };

  const formItemData = [
    {
      name: 'usercode',
      label: '登录名',
      type: 'input',
    },
    {
      name: 'username',
      label: '用户名',
      type: 'input',
    },
    {
      name: 'orgId',
      label: '机构名称',
      type: 'TreeSelect',
      config: {
        dropdownStyle: { maxHeight: 400, overflow: 'auto' },
        treeData: saveOrgName,
        treeDefaultExpandAll: true,
        showSearch: true,
        treeNodeFilterProp: 'title',
      },
    },
    {
      name: 'type',
      label: '用户类型',
      type: 'select',
      readSet: { name: 'text', code: 'value' },
      option: [
        { value: '01', text: '系统管理员' },
        { value: '02', text: '普通用户' },
      ],
    },
    {
      name: 'deptId',
      label: '部门',
      type: 'treeSelect',
      config: {
        dropdownStyle: { maxHeight: 400, overflow: 'auto' },
        treeData: department,
        treeDefaultExpandAll: true,
        showSearch: true,
        treeNodeFilterProp: 'title',
      },
    },
  ];

  const queryInit = formData => {
    setQueryStr('');
    setCurrentPage(1);
    setPageSize(10);
    setSearchForm(formData);
  };

  const handleReset = formData => {
    setQueryStr('');
    setCurrentPage(1);
    setPageSize(10);
    setSearchForm({});
  };

  return (
    <div className={styles.content}>
      <List
          formItemData={formItemData}
          // 查询按钮
          advancSearch={queryInit}
          resetFn={handleReset}
          searchPlaceholder={'输入成员登录名或用户名'}
          // 模糊查询
          fuzzySearch={value => {
            resetFields();
            setSearchForm({});
            getMemberList(value);
          }}
          loading={loading}
          extra={
          <Action key="memberManagement:add" code="memberManagement:add">
            <Button onClick={handleNewMember} type="primary" className={styles.defaultButton}>
              新建用户
            </Button>
          </Action>
          }
          tableList={(<>
            <Table
              rowKey="id"
              bordered={false}
              columns={columns}
              dataSource={data.rows}
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
                      <Menu.Item key="0" className={styles.action}>
                        删除
                      </Menu.Item>
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
          </>)}
        />
      <Drawer
        title={userName(baseInfo)}
        placement="bottom"
        closable={false}
        onClose={handleCloseDrawer}
        visible={visible}
      >
        <div className={styles.drawers}>
          <div className={styles.bottomLeft} />
          <div className={styles.middleBox}>
            <Row>
              <Col span={7} className={styles.inner}>
                手机号码：{baseInfo.mobile}
              </Col>
              <Col span={7} className={styles.inner}>
                机构名称：{baseInfo.orgName}
              </Col>
              <Col span={7} className={styles.inner}>
                创建时间：{baseInfo.createTime}
              </Col>
            </Row>
            <Row>
              <Col span={7} className={styles.inner}>
                电子邮箱：{baseInfo.email}
              </Col>
              <Col span={7} className={styles.inner}>
                机构代码：{baseInfo.orgCode}
              </Col>
              <Col span={7} className={styles.inner}>
                机构类型：{baseInfo.orgTypeName}
              </Col>
            </Row>
            <Row>
              <Col span={7} className={styles.inner}>
                用户代码：{baseInfo.usercode}
              </Col>
              <Col span={7} className={styles.inner}>
                用户类型：
                {baseInfo.type === '01' ? '系统管理员' : '普通用户'}
              </Col>
            </Row>
            <Row>
              <Col span={7} />
              <Col span={7} />
            </Row>
          </div>
          <div className={styles.bottomLeft} />
        </div>
      </Drawer>
    </div>
  );
};

export default errorBoundary(
  connect(({ memberManagement, modify, loading }) => ({
    modify,
    memberManagement,
    loading: loading.effects['memberManagement/fetch'],
  }))(Form.create()(Index)),
);

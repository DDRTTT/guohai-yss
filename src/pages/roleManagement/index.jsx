import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { Button, Dropdown, Form, Icon, Menu, message, Modal, Popconfirm, Tag } from 'antd';
import router from 'umi/router';
import PreviewModal from './preview';
import { USER_INFO } from '@/utils/session';
import cloneDeep from 'lodash/cloneDeep';
import { handleTableCss, utilsCodeToName } from '@/utils/utils';
import Action, { ActionBool } from '@/utils/hocUtil';
import { Table } from '@/components';
import List from '@/components/List';
import { tableRowConfig } from '@/pages/investorReview/func';

const { confirm } = Modal;
const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,manuscriptStrategy,roleName';

const RoleManagement = ({
  dispatch,
  fetchLoading,
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  handleRoleDeleteLoading,
  handleRoleReviewLoading,
  roleManagement: {
    data,
    saveAllMenuTree,
    saveDictList,
    saveDictList: { attributionSystem },
    saveAuthorizeActionsList,
    savePositionsTree,
    savePositionsList,
    savePositionAuthorizeActionsList,
  },
  form: { resetFields },
}) => {
  const [authModal, setAuthModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [baseInfo, setBaseInfo] = useState({});
  // 数据策略组件展示
  const [strategy, setStrategy] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryStr, setQueryStr] = useState('');
  const [positionIds, setPositionIds] = useState([]);
  const [sysId, setSysId] = useState('');
  const [searchForm, setSearchForm] = useState({});

  // 获取个人信息
  const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO)) || {};

  useEffect(() => {
    // 所属部门
    dispatch({
      type: 'roleManagement/fetchGetDept',
      payload: {
        orgId: userInfo.orgId,
        orgKind: 2,
      },
    });
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
  }, []);

  useEffect(() => {
    handleList();
  }, [currentPage, pageSize, queryStr, searchForm]);

  // 预览框中选中组件请求数据
  const handleFetchGetAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetAuthorizeById',
      payload: tag,
    });
  };

  useEffect(() => {
    // 1 产品中心 4 底稿系统
    const cloneDeepAuthorizationStrategy =
      sysId === 1
        ? cloneDeep(saveDictList?.authorizationStrategy)
        : sysId === 4
        ? cloneDeep(saveDictList?.manuscriptStrategy)
        : [];
    cloneDeepAuthorizationStrategy?.map(item => {
      item.label = item.name;
      item.value = item.code;
    });
    setStrategy(cloneDeepAuthorizationStrategy);
  }, [saveDictList, sysId]);

  // 清空选中的行数据
  const handleResetSelected = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const handleRoleDelete = payload =>
    dispatch({
      type: `roleManagement/handleRoleDelete`,
      payload,
    }).then(bool => bool && handleResetSelected()); // 清空选中的行数据

  const showDeleteConfirm = (payload, messages = '当前角色已被用户使用，确定要删除吗？') => {
    confirm({
      title: messages,
      okType: 'danger',
      onOk: () => handleRoleDelete(payload),
    });
  };

  const showDeleteConfirm1 = payload => {
    confirm({
      title: '确认删除吗?',
      content: '删除为不可逆操作',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        handleDelete(payload);
      },
    });
  };

  // 删除
  const handleDelete = payload => {
    // 检查角色是否被使用
    dispatch({
      type: `roleManagement/handleCheckRole`,
      payload,
    }).then(res => {
      if (res.status === 10347777) {
        // 需要反复核后才能删除
        message.warn(`角色需要反复核后才能删除`);
      }
      if (res.status === 10347778) {
        // 被使用，强制删除
        showDeleteConfirm(payload, res.message);
      }
      if (res.status === 200) {
        // 未被使用，执行删除
        handleRoleDelete(payload);
      }
    });
  };

  // 复核，反复核
  const handleReview = payload =>
    dispatch({
      type: 'roleManagement/handleRoleReview',
      payload,
    }).then(bool => bool && handleResetSelected()); // 清空选中的行数据

  const handleList = () => {
    const deptId = searchForm?.deptId?.map(item => Number(item));
    const sysId = searchForm?.sysId?.map(item => Number(item));
    dispatch({
      type: 'roleManagement/fetch',
      payload: {
        currentPage,
        pageSize,
        ...searchForm,
        deptId,
        sysId,
      },
    });
  };

  // 新建角色
  const handleNewMember = () => router.push('./roleManagement/add');

  // 批量操作
  const handleMenuClick = e => {
    const { key } = e;
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    const len = selectedRows.length;
    for (let i = 0; i < len; i++) {
      // 复核
      if (selectedRows[i].checked === 1 && key === '1') {
        message.warn('选中数据包含已复核角色，请去掉勾选后再次操作');
        return;
      }
      // 反复核
      if (selectedRows[i].checked === 0 && key === '2') {
        message.warn('选中数据包含已反复核角色，请去掉勾选后再次操作');
        return;
      }
      // 删除
      if (selectedRows[i].checked === 1 && key === '0') {
        message.warn('已复核角色不可，请先反复核');
        return;
      }
    }
    // 删除
    if (key === '0') {
      showDeleteConfirm1({ roleComIds: selectedRowKeys.join() });
    }
    // 复核
    if (key === '1') {
      handleReview({ roleComIds: selectedRowKeys.join(), check: 1 });
    }
    // 反复核
    if (key === '2') {
      handleReview({ roleComIds: selectedRowKeys.join(), check: 0 });
    }
  };

  const handleShowDrawer = record => {
    // 显示弹框
    setAuthModal(true);
    // 存储列数据
    setBaseInfo(record);
    setSysId(record.sysId);
    // 权限树查询
    dispatch({
      type: 'roleManagement/fetchGetAuthTree',
      payload: record.sysId,
    });
    // 查询岗位组件树
    dispatch({
      type: 'roleManagement/fetchGetPositionsTree',
      payload: { sysId: record.sysId },
    });
    // 岗位列表
    dispatch({
      type: 'roleManagement/fetchGetPositionsList',
      payload: record.sysId,
    });

    // 岗位id
    const positionId = [];
    record.positions.forEach(item => positionId.push(item.id));
    setPositionIds(positionId);
  };

  const handleFetchGetPositionAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetPositionAuthorizeById',
      payload: { positionIds: tag, sysId },
    });
  };

  const handleUpdateRole = record => {
    router.push(`/authority/roleManagement/add?flagType=update&updateId=${record.id}`);
  };

  // columns
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '归属系统',
      dataIndex: 'sysId',
      key: 'sysId',
      ...tableRowConfig,
      sorter: false,
      render: (_, { sysId }) => handleTableCss(utilsCodeToName(attributionSystem, sysId, 'name')),
    },
    {
      title: '功能组件',
      dataIndex: 'functions',
      key: 'functions',
      ...tableRowConfig,
      sorter: false,
      render: (_, { functions }) => {
        const arr = [];
        functions.forEach(item => arr.push(item?.name));
        const data = arr.length !== 0 ? arr.join(',') : '-';
        return handleTableCss(data);
      },
    },
    {
      title: '岗位组件',
      dataIndex: 'positions',
      key: 'positions',
      ...tableRowConfig,
      sorter: false,
      render: (_, { positions }) => {
        const arr = [];
        positions.forEach(item => arr.push(item?.name));
        const data = arr.length !== 0 ? arr.join(' ') : '-';
        return handleTableCss(data);
      },
    },
    // {
    //   title: '数据策略组件',
    //   dataIndex: 'dataStrategies',
    //   key: 'dataStrategies',
    //   ...tableRowConfig,
    //   sorter: false,
    //   render: (_, { dataStrategies }) => {
    //     const arr = [];
    //     dataStrategies.forEach(item => arr.push(item?.strategyName));
    //     const data = arr.length !== 0 ? arr.join(' ') : '-';
    //     return handleTableCss(data);
    //   },
    // },
    {
      title: '状态',
      dataIndex: 'checked',
      key: 'checked',
      render: (text, { checked }) => {
        if (checked === 0) {
          return <Tag color="red">待复核</Tag>;
        }
        if (checked === 1) {
          return <Tag color="green">已生效</Tag>;
        }
        return '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      width: '250px',
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        <span key="1">
          <a onClick={() => handleShowDrawer(record)}>查看</a>
        </span>,
        <Action key="roleManagement:modify" code="roleManagement:modify">
          {record.checked === 0 && (
            <span className={styles.btnMargin}>
              <a onClick={() => handleUpdateRole(record)}>修改</a>
            </span>
          )}
        </Action>,
        <Action key="roleManagement:review" code="roleManagement:review">
          {record.checked === 0 && (
            <span className={styles.btnMargin}>
              <a onClick={() => handleReview({ roleComIds: record.id, check: 1 })}>复核</a>
            </span>
          )}
          {record.checked === 1 && (
            <span className={styles.btnMargin}>
              <a onClick={() => handleReview({ roleComIds: record.id, check: 0 })}>反复核</a>
            </span>
          )}
        </Action>,
        <Action key="roleManagement:delete" code="roleManagement:delete">
          {record.checked === 0 && (
            <span className={styles.btnMargin}>
              <Popconfirm
                title="删除为不可逆操作，确认删除吗?"
                onConfirm={() => handleDelete({ roleComIds: record.id })}
              >
                <a className={styles.delete}>删除</a>
              </Popconfirm>
            </span>
          )}
        </Action>,
      ],
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
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

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  // 重置方法
  const handleReset = () => {
    // 关闭弹框
    setAuthModal(false);
    // 重置通过组件id查询出的权限
    dispatch({
      type: 'roleManagement/saveAuthorizeActionsList',
      payload: [],
    });
    dispatch({
      type: 'roleManagement/savePositionAuthorizeActionsList',
      payload: [],
    });
  };

  const handleDealData = (item, code) => {
    const arr = [];
    item.forEach(item => arr.push(item[code]));
    return arr;
  };

  const formItemData = [
    {
      name: 'like',
      label: '角色名称',
      type: 'input',
    },
    {
      name: 'sysId',
      label: '归属系统',
      type: 'select',
      option: attributionSystem,
      config: {
        mode: 'multiple',
      },
    },
  ];

  const queryInit = (formData = {}) => {
    setQueryStr('');
    setCurrentPage(1);
    setPageSize(10);
    setSearchForm(formData || {});
  };

  return (
    <div className={styles.base}>
      <List
        formItemData={formItemData}
        // 查询按钮
        advancSearch={queryInit}
        // 模糊查询
        loading={fetchLoading || handleRoleDeleteLoading || handleRoleReviewLoading}
        resetFn={() => {
          resetFields();
          setCurrentPage(1);
          setPageSize(10);
          // setSearchForm({});
          queryInit();
        }}
        searchPlaceholder="请输入角色名称"
        fuzzySearch={e => queryInit({ like: e ?? '' })}
        extra={
          <Action key="roleManagement:add" code="roleManagement:add">
            <Button onClick={handleNewMember} type="primary" className={styles.defaultButton}>
              新建角色
            </Button>
          </Action>
        }
        tableList={
          <>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={data.rows}
              loading={fetchLoading || handleRoleDeleteLoading || handleRoleReviewLoading}
              onChange={handleStandardTableChange}
              rowSelection={rowSelection}
              pagination={paginationProps}
              scroll={{ x: columns.length * 200 }}
            />
            <div className={styles.batch}>
              <Dropdown
                overlay={
                  <Menu onClick={handleMenuClick}>
                    {ActionBool('roleManagement:delete') && (
                      <Menu.Item key="0" className={styles.action}>
                        删除
                      </Menu.Item>
                    )}
                    {ActionBool('roleManagement:review') && [
                      <Menu.Item key="1" className={styles.action}>
                        复核
                      </Menu.Item>,
                      <Menu.Item key="2" className={styles.action}>
                        反复核
                      </Menu.Item>,
                    ]}
                  </Menu>
                }
                placement="topLeft"
              >
                <Button className={styles.batchBtn}>
                  批量操作
                  <Icon type="up" />
                </Button>
              </Dropdown>
            </div>
          </>
        }
      />
      {authModal && (
        <PreviewModal
          title={'查看权限'}
          footer={null}
          authorizationStrategy={strategy}
          authModal={authModal}
          setAuthModal={setAuthModal}
          name={baseInfo?.name}
          code={baseInfo?.code}
          dataStrategies={handleDealData(baseInfo.dataStrategies || [], 'strategyCode')}
          functions={handleDealData(baseInfo.functions || [], 'id')}
          saveAuthorizeActionsList={saveAuthorizeActionsList}
          // 根据选中的岗位查询组件id
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          saveAllMenuTree={saveAllMenuTree}
          tags={baseInfo.functions || []}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          handleReset={handleReset}
          savePositionsTree={savePositionsTree}
          positionsList={savePositionsList}
          positions={positionIds}
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
        />
      )}
    </div>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ loading, roleManagement }) => ({
      roleManagement,
      fetchLoading: loading.effects['roleManagement/fetch'],
      fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      handleRoleDeleteLoading: loading.effects['roleManagement/handleRoleDelete'],
      handleRoleReviewLoading: loading.effects['roleManagement/handleRoleReview'],
    }))(RoleManagement),
  ),
);

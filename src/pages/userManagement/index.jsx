import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import cloneDeep from 'lodash/cloneDeep';
import { Button, Dropdown, Form, Icon, Menu, message, Modal, Popconfirm, Row } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import SubRole from './subRole';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import PreviewModal from './preview';
import { handleTableCss, utilsCodeToName } from '@/utils/utils';
import Action, { ActionBool } from '@/utils/hocUtil';
import { Table } from '@/components';
import List from '@/components/List';
import { eutrapelia, tableRowConfig } from '@/pages/investorReview/func';
import { setSession, USER_INFO } from '@/utils/session';
import { download } from '@/utils/download';

const { confirm } = Modal;

const Index = ({
  dispatch,
  memberManagement: { data },
  userManagement: { roleComByUser, roleBySys, userauthed, saveGetDept },
  roleManagement: {
    saveDictList: { authorizationStrategy, attributionSystem },
    savePositionsList,
    saveAllMenuTree,
    saveAuthorizeActionsList,
    tags,
    saveRoleDetail,
    savePositionsTree,
    savePositionAuthorizeActionsList,
  },
  workSpace: { GET_USER_SYSID },
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  handleUserFreezeLoading,
  modifyRoleLoading = false,
  loading,
  form,
  form: { setFieldsValue, resetFields },
}) => {
  // 获取个人信息
  const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryStr, setQueryStr] = useState('');
  const [searchForm, setSearchForm] = useState({});
  const [selectTagList, setSelectTagList] = useState([]);
  const [sysId, setSysId] = useState('');
  // 当前选择的用户
  const [userId, setUserId] = useState('');
  // 权限预览
  const [authModal, setAuthModal] = useState(false);
  // 已关联功能组件
  const [associatedFunction, setAssociatedFunction] = useState([]);
  // 已关联岗位组件
  const [associatedJobs, setAssociatedJob] = useState([]);
  // 数据策略组件
  const [strategyCodes, setStrategyCodes] = useState([]);
  // 批量冻结和解冻是否可操作（当多选项中，但凡有一项已注销的用户，则值置为true）
  const [hasWithdraw, setHasWithdraw] = useState(false);

  const cloneDeepAuthorizationStrategy = cloneDeep(authorizationStrategy);

  cloneDeepAuthorizationStrategy?.map(item => {
    item.label = item.name;
    item.value = item.code;
  });

  const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,roleName';

  // 选中所属角色时候获取角色对应的功能&岗位数据
  const handleQueryBySys = tag => {
    dispatch({
      type: 'roleManagement/handleRoleDetail',
      payload: tag,
    });
  };

  // 预览框中选中组件请求数据
  const handleFetchGetAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetAuthorizeById',
      payload: tag,
    });
  };

  const handleFetchGetPositionAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetPositionAuthorizeById',
      payload: { positionIds: tag, sysId },
    });
  };
  // 获取成员列表
  const getMemberList = (val = '') => {
    setCurrentPage(1);
    setPageSize(10);
    setQueryStr(val);
  };

  const handleList = () => {
    dispatch({
      type: `memberManagement/fetch`,
      payload: {
        currentPage,
        pageSize,
        queryStr,
        ...searchForm,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
    // 机构名称
    dispatch({
      type: `memberManagement/handleOrgName`,
    });
    // 重置状态
    dispatch({
      type: `memberManagement/handleResetState`,
    });
  }, []);

  useEffect(() => {
    // 查询功能组件
    dispatch({
      type: 'roleManagement/fetchHasRole',
      payload: sysId,
    });
    // 查询岗位组件树
    dispatch({
      type: 'roleManagement/fetchGetPositionsTree',
      payload: { sysId },
    });
    // 岗位列表
    dispatch({
      type: 'roleManagement/fetchGetPositionsList',
      payload: sysId,
    });
    // 权限树查询
    dispatch({
      type: 'roleManagement/fetchGetAuthTree',
      payload: sysId,
    });
    // 所属部门
    dispatch({
      type: 'userManagement/fetchGetDept',
      payload: {
        orgId: userInfo?.orgId, //机构ID
        orgKind: 2,
      },
    });
    dispatch({
      type: 'workSpace/GET_USER_SYSID_FETCH',
    });
    setFieldsValue({ sysId });
  }, [sysId]);

  useEffect(() => {// 修复0617全系统自测bug: 【ID1006354】用户管理-接口报错（接口yss-base-admin/rolecom/queryBySys 前端参数sysIds为空，需将接口yss-base-admin/user/getUserSysIds返回的数据，作为sysIds的值传入）
    // 根据归属系统查询可用的角色组件集合
    dispatch({
      type: 'userManagement/queryBySys',
      payload: GET_USER_SYSID,
    });
  }, [sysId, GET_USER_SYSID])

  useEffect(() => {
    if (!userauthed || JSON.stringify(userauthed) === '{}') return;
    setAssociatedJob(userauthed.positions);
    setAssociatedFunction(userauthed.userRole);
    // setStrategyCodes(userauthed.strategyCodes);
  }, [userauthed]);

  useEffect(() => {
    if (!saveRoleDetail || JSON.stringify(saveRoleDetail) === '{}') return;
    setAssociatedJob(saveRoleDetail.positions);
    setAssociatedFunction(saveRoleDetail.functions);
    setStrategyCodes(saveRoleDetail.dataStrategies.map(item => item.strategyCode));
  }, [saveRoleDetail]);

  useEffect(() => {
    console.log('roleComByUser', roleComByUser);
    if (!roleComByUser) return;
    setSelectTagList(roleComByUser);
  }, [roleComByUser]);

  useEffect(() => {
    handleList();
  }, [currentPage, pageSize, queryStr, searchForm]);

  useEffect(() => {
    // 查询用户被授权的角色组建id集合
    userId &&
      sysId &&
      dispatch({
        type: 'userManagement/queryRoleComByUser',
        payload: { userId, sysId },
      });
  }, [userId, sysId]);

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  // 添加成员
  const handleNewMember = () => {
    // 清空用户信息
    dispatch({
      type: `memberManagement/saveInfo`,
      payload: {},
    });
    router.push('/authority/userManagement/add');
  };

  const handleResetSelect = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // 批量操作
  const handleMenuClick = e => {
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个，再进行操作');
      return;
    }
    const len = selectedRows.length;
    for (let i = 0; i < len; i++) {
      // 冻结
      if (selectedRows[i].freezed === 1 && e.key === '1') {
        message.warn('选中数据包含已冻结用户，请去掉勾选后再次操作');
        return;
      }
      // 解冻
      if (selectedRows[i].freezed === 0 && e.key === '2') {
        message.warn('选中数据包含已解冻用户，请去掉勾选后再次操作');
        return;
      }
    }
    if (e.key === '1') {
      handleFreeze({ freeze: 1, userIds: selectedRowKeys.join() });
    }
    if (e.key === '2') {
      handleFreeze({ freeze: 0, userIds: selectedRowKeys.join() });
    }
    // 删除
    if (e.key === '0') {
      showDeleteConfirm({ list: selectedRowKeys.join() });
    }
  };

  // 冻结/解冻
  const handleFreeze = payload =>
    dispatch({
      type: `userManagement/handleUserFreeze`,
      payload,
    }).then(bool => {
      console.log('bool', bool);
      if (bool) {
        handleList();
        handleResetSelect();
      }
    });

  // 重置密码
  const restUserCode = record =>
    dispatch({
      type: `memberManagement/rest`,
      payload: {
        id: record.id,
      },
    });

  // 删除用户
  const handleUserLogout = list =>
    dispatch({
      type: `userManagement/handleFetchUserLogout`,
      payload: list,
    }).then(bool => {
      if (bool) handleList();
    });

  const showDeleteConfirm = list => {
    confirm({
      title: '确认删除吗?',
      content: '删除为不可逆操作',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        handleUserLogout(list);
      },
    });
  };

  // 注销用户
  const handleWithdraw = payload =>
    dispatch({
      type: `userManagement/handleUserWithdraw`,
      payload,
    }).then(bool => {
      if (bool) {
        handleList();
        handleResetSelect();
      }
    });

  const showWithdrawConfirm = id => {
    confirm({
      title: '确认注销吗?',
      content: '注销为不可逆操作',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleWithdraw({ freeze: 2, userIds: id });
      },
    });
  };

  const handleOperaAuthorization = record => {
    const { sysId, id, orgId } = record;
    dispatch({
      type: `memberManagement/member`,
      payload: record,
    });
    router.push({
      pathname: `/authority/userManagement/quickAuthorization`,
      query: {
        sysId,
        saveMemberId: id,
        orgId,
        userId: id,
      },
    });
    setSession('sysId', record.sysId);
    setSession('memberInfos', JSON.stringify(record));
  };

  // columns
  const columns = [
    {
      title: '登录名',
      dataIndex: 'usercode',
      key: 'usercode',
      fixed: 'left',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '机构类型',
      dataIndex: 'orgTypeName',
      key: 'orgTypeName',
      ...tableRowConfig,
      sorter: false,
      render: text => handleTableCss(text),
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
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      ...tableRowConfig,
      sorter: false,
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ...tableRowConfig,
      sorter: false,
    },
    {
      title: '使用状态',
      dataIndex: 'deleted',
      key: 'deleted',
      ...tableRowConfig,
      sorter: false,
      width: 110,
      render: (text, record) =>
        eutrapelia(record.deleted === 0 ? (record.freezed === 1 ? '冻结' : record.freezed === 2 ? '注销' : '正常') : '删除'),
    },
    {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      width: '320px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          <span>
            <span style={{ margin: 5 }}>
              <a
                onClick={() => {
                  router.push(
                    `/authority/userManagement/detail?sysId=${record.sysId}&orgAuthedId=${record.orgId}&userAuthedId=${record.id}`,
                  );
                }}
              >
                查看
              </a>
            </span>
            {record.freezed === 0 && [
              <Action key="userManagement:changeRole" code="userManagement:changeRole">
                <span style={{ margin: 5 }}>
                  <a onClick={() => handleOperaAuthorization(record)}>角色变更</a>
                </span>
              </Action>,
              <Action key="userManagement:reset" code="userManagement:reset">
                <span style={{ margin: 5 }}>
                  <Popconfirm title="确认重置密码?" onConfirm={() => restUserCode(record)}>
                    <a>重置密码</a>
                  </Popconfirm>
                </span>
              </Action>,
            ]}

            <Action key="userManagement:freeze" code="userManagement:freeze">
              {record.freezed === 0 && (
                <span style={{ margin: 5 }}>
                  <a onClick={() => handleFreeze({ freeze: 1, userIds: record.id })}>冻结</a>
                </span>
              )}
              {record.freezed === 1 && (
                <span style={{ margin: 5 }}>
                  <a onClick={() => handleFreeze({ freeze: 0, userIds: record.id })}>解冻</a>
                </span>
              )}
            </Action>
            <Action key="userManagement:withdraw" code="userManagement:withdraw">
              {record.freezed !== 2 && (
                <span style={{ margin: 5 }}>
                  <a onClick={() => showWithdrawConfirm(record.id)}>注销</a>
                </span>
              )}
            </Action>
            <Action key="userManagement:delMember" code="userManagement:delMember">
              <span style={{ margin: 5 }}>
                <a
                  style={{ color: '#D9001B' }}
                  onClick={() => showDeleteConfirm({ list: record.id })}
                >
                  删除
                </a>
              </span>
            </Action>
          </span>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      const flag = selectedRows.some(item => item.freezed === 2);
      setHasWithdraw(flag);
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: data.total,
    current: currentPage,
    showTotal: total => `共 ${total} 条`,
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
      name: 'deptId',
      label: '所属部门',
      type: 'select',
      option: saveGetDept,
      readSet: {
        name: 'orgName',
        code: 'id',
      },
    },
    {
      name: 'freezed',
      label: '使用状态',
      type: 'select',
      option: [
        { code: 0, name: '正常' },
        { code: 1, name: '冻结' },
        { code: 2, name: '注销' }
      ],
      readSet: { name: 'name', code: 'code' },
    },
  ];

  const queryInit = formData => {
    setQueryStr('');
    setCurrentPage(1);
    setPageSize(10);
    setSearchForm(formData);
  };

  const productInfo = [
    {
      name: 'sysId',
      label: '归属系统',
      type: 'radio',
      rules: [{ required: true, message: '请选择归属系统' }],
      // option: attributionSystem || [],
      option: attributionSystem?.filter(item => GET_USER_SYSID.includes(item.code)),
      width: 24,
      config: { onChange: e => setSysId(e.target.value) },
      extra: (
        <SubRole
          sysId={sysId}
          // 根据归属系统查询可用角色组件集合
          roleBySys={roleBySys}
          setSelectTagList={setSelectTagList}
          selectTagList={selectTagList}
          showModal={() => setAuthModal(true)}
        />
      ),
    },
  ];

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
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
  };

  // 重置弹出框的数据
  const resetData = () => {
    setSysId('');
    // 重置所属角色
    dispatch({
      type: 'userManagement/setQueryBySys',
      payload: [],
    });
    setUserId('');
    // 重置已选角色的 功能组件
    setAssociatedFunction([]);
  };

  // 时间戳获取
  function handleGetDate() {
    const d = new Date();
    const ye = d.getFullYear();
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const da = d.getDate().toString().padStart(2, '0');
    const time = ye + mo + da;
    return time;
  };

  // 导出-按查询条件
  function handleExport() {
    download('/ams/yss-base-admin/user/exportExcel?', {
      body: { ...searchForm, queryStr },
      name: `用户管理信息_${handleGetDate()}`,
      method: 'GET',
      fileType: '.xlsx',
    });
  };

  return (
    <>
      <div className={styles.content}>
        <List
          formItemData={formItemData}
          // 查询按钮
          advancSearch={queryInit}
          searchPlaceholder="请输入成员登录名或用户名"
          // 模糊查询
          fuzzySearch={getMemberList}
          loading={loading}
          resetFn={() => {
            resetFields();
            setCurrentPage(1);
            setPageSize(10);
            setSearchForm({});
            setQueryStr('');
            handleList();
          }}
          extra={
            <>
              <Button onClick={handleExport} type="primary" className={styles.defaultButton} style={{ marginRight: 10 }}>
                导出
              </Button>
              <Action key="userManagement:add" code="userManagement:add">
                <Button onClick={handleNewMember} type="primary" className={styles.defaultButton}>
                  新建用户
                </Button>
              </Action>
            </>
          }
          tableList={
            <>
              <Table
                rowKey="id"
                bordered={false}
                columns={columns}
                dataSource={data.rows}
                loading={loading || handleUserFreezeLoading}
                onChange={handleStandardTableChange}
                rowSelection={rowSelection}
                pagination={paginationProps}
                scroll={{ x: columns.length * 200 }}
              />
              <div style={{ marginTop: -45 }}>
                <Dropdown
                  overlay={
                    <Menu onClick={handleMenuClick}>
                      {ActionBool('userManagement:delMember') && (
                        <Menu.Item key="0" className={styles.action}>
                          删除
                        </Menu.Item>
                      )}
                      {ActionBool('userManagement:freeze') && [
                        <Menu.Item key="1" className={styles.action} disabled={hasWithdraw}>
                          冻结
                        </Menu.Item>,
                        <Menu.Item key="2" className={styles.action} disabled={hasWithdraw}>
                          解冻
                        </Menu.Item>,
                      ]}
                    </Menu>
                  }
                  placement="topLeft"
                >
                  <Button style={{ marginRight: 10, width: 100, height: 26 }}>
                    批量操作
                    <Icon type="up" />
                  </Button>
                </Dropdown>
              </div>
            </>
          }
        />
        <Modal
          title="角色变更"
          width="40%"
          confirmLoading={modifyRoleLoading}
          onOk={() => {
            dispatch({
              type: 'userManagement/modifyRole',
              payload: {
                id: userId,
                sysId,
                roleComIds: selectTagList.map(item => item?.id),
              },
            }).then(() => {
              handleList(); // 重置 角色组件集合
              resetData();
              setVisible(false);
            });
          }}
          onCancel={() => {
            setVisible(false);
            resetData();
          }}
          visible={visible}
          destroyOnClose
        >
          <Form {...layout}>
            <Row>
              <CustomFormItem formItemList={productInfo} form={form} />
            </Row>
          </Form>
        </Modal>
      </div>
      {authModal && (
        <PreviewModal
          title={'预览权限'}
          authorizationStrategy={cloneDeepAuthorizationStrategy}
          authModal={authModal}
          setAuthModal={setAuthModal}
          dataStrategies={strategyCodes}
          saveAuthorizeActionsList={saveAuthorizeActionsList}
          saveAllMenuTree={saveAllMenuTree}
          savePositionsTree={savePositionsTree}
          tags={[...(tags['01'] || []), ...(tags['02'] || [])]}
          positionsList={savePositionsList}
          functions={associatedFunction}
          positions={associatedJobs}
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
          handleReset={handleReset}
          ownershipSystem={attributionSystem}
          selectOwnershipSystem={sysId}
          ownershipSystemChange={value => setSysId(value)}
          // userauthed={userauthed}
          roleComByUser={selectTagList}
          // 根据归属系统查询可用角色组件集合
          roleBySys={roleBySys}
          handleQueryBySys={handleQueryBySys}
          disabled={true}
          onClose={() => {
            setSysId('');
            // 重置所属角色
            dispatch({
              type: 'userManagement/setQueryBySys',
              payload: [],
            });
            // 重置已选角色的 功能组件
            setAssociatedFunction([]);
            setSysId('');
          }}
        />
      )}
    </>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ memberManagement, userManagement, loading, roleManagement, workSpace }) => ({
      memberManagement,
      roleManagement,
      userManagement,
      workSpace,
      loading: loading.effects['memberManagement/fetch'],
      fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      fetchGetPositionsTreeLoading: loading.effects['roleManagement/fetchGetPositionsTreeLoading'],
      handleUserFreezeLoading: loading.effects['userManagement/handleUserFreeze'],
      modifyRoleLoading: loading.effects['userManagement/modifyRole'],
    }))(Index),
  ),
);

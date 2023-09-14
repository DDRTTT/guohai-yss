import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Row, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import cloneDeep from 'lodash/cloneDeep';
import PreviewModal from './preview';
import ModifyInfo from './modifyInfo';
import SubRole from './subRole';
import { parse } from 'qs';
import { USER_INFO } from '@/utils/session';
import Action from '@/utils/hocUtil';
import { PageContainers } from '@/components';
import {QUICK_AUTH_DETAIL_API, getAllAuthorizeById, getPositionsTree} from '@/services/userManagement/index'
import styles from './index.less';
import { stringify } from 'qs';
const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,roleName,manuscriptStrategy';
const Detail = ({
  dispatch,
  userManagement: { saveGetDept, roleComByUser, roleBySys },
  roleManagement: {
    saveDictList,
    saveDictList: { authorizationStrategy, attributionSystem },
    savePositionsList,
    saveAllMenuTree,
    // saveAuthorizeActionsList,
    tags,
    saveRoleDetail,
    savePositionsTree,
    // savePositionAuthorizeActionsList,
  },
  workSpace: { GET_USER_SYSID },
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  getuserauthedLoading,
  form,
  location
}) => {
  // 用户信息
  const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));
  // 获取的连接里面的参数
  const queryParam = parse(location.search, { ignoreQueryPrefix: true });

  // 归属系统id
  let id = queryParam?.sysId?.indexOf(',') ? queryParam.sysId[0] : queryParam.sysId;
  const [sysId, setSysId] = useState(id);

  // 是否显示修改信息弹窗
  const [showModifyPannel, setShowModifyPannel] = useState(false);

  // 数据策略组件展示
  const [strategy, setStrategy] = useState([]);

  // 已关联功能组件
  const [associatedFunction, setAssociatedFunction] = useState([]);
  // 已关联岗位组件
  const [associatedJobs, setAssociatedJob] = useState([]);
  // 数据策略组件
  const [strategyCodes, setStrategyCodes] = useState([]);

  // 添加的角色
  const [selectTagList, setSelectTagList] = useState([]);
  // 权限预览
  const [authModal, setAuthModal] = useState(false);
  const [userauthed, setUserauthed] = useState({});
  const [loading, setLoading] = useState(true)
  const [saveAuthorizeActionsList, setSaveAuthorizeActionsList] = useState([])
  const [savePositionAuthorizeActionsList, setSavePositionAuthorizeActionsList] = useState([])

  // useEffect(()=>{
    
  // },[])
  

  //冻结/解冻
  const handleFreeze = payload =>
    dispatch({
      type: `userManagement/handleUserFreeze`,
      payload: { ...payload, userIds: queryParam.userAuthedId },
    }).then(() => {
      getUserInfo();
    });

  // 重置密码
  const restUserCode = () =>
    dispatch({
      type: `roleManagement/rest`,
      payload: {
        id: queryParam.userAuthedId,
      },
    });
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
      payload: {
        positionIds: tag,
        sysId,
      },
    });
  };

  // 选中所属角色时候获取角色对应的功能&岗位数据
  const handleQueryBySys = tag => {
    dispatch({
      type: 'roleManagement/handleRoleDetail',
      payload: tag,
    });
  };

  const cloneDeepAuthorizationStrategy = cloneDeep(authorizationStrategy);

  cloneDeepAuthorizationStrategy?.map(item => {
    item.label = item.name;
    item.value = item.code;
  });

  //   查询用户数据包
  const getUserInfo = () => {
    setLoading(true);
    dispatch({
      type: 'userManagement/getGLAuserauthed',
      payload: {
        sysId,
        orgAuthedId: queryParam.orgAuthedId,
        userAuthedId: queryParam.userAuthedId,
      },
    });
    
    QUICK_AUTH_DETAIL_API({...location.query}).then(res => {
      console.log(res.data);
      let id = 0
      let positionIds = []
      if (res.data.userRole.length > 0) {
        res.data.userRole.forEach(item => {
          if(!item.name.includes('统稿')) {
            id = item.id
          }
        })
      }
      if (res.data.positions.length > 0) {
        res.data.positions.forEach(item => {
          positionIds.push(item.id);
        });
      }
      getPositionsTree(stringify({sysId: 1, positionIds })).then(succ => {
        setSavePositionAuthorizeActionsList(succ.data[0].nodesMap);
      })
      getAllAuthorizeById(id).then(rsp => {
        setSaveAuthorizeActionsList(rsp.data[0]?.actionsList || [])
      });
      setUserauthed(res.data);
      setLoading(false);
    });

  };

  useEffect(() => {
    // 所属部门
    dispatch({
      type: 'userManagement/fetchGetDept',
      payload: {
        orgId: userauthed?.orgId || userInfo?.orgId,
        orgKind: 2,
      },
    });
  }, [userauthed]);

  useEffect(() => {
    // 查询字典
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
  }, []);

  useEffect(() => {
    getUserInfo();
    // 查询用户被授权的角色组件id集合
    dispatch({
      type: 'userManagement/queryRoleComByUser',
      payload: { userId: queryParam.userAuthedId, sysId },
    });
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
    // 根据归属系统查询可用的角色组件集合
    dispatch({
      type: 'userManagement/queryBySys',
      payload: sysId,
    });
  }, [sysId]);

  useEffect(() => {
    // 1 产品中心 4 底稿系统
    const cloneDeepAuthorizationStrategy =
      sysId === '1'
        ? cloneDeep(saveDictList?.authorizationStrategy)
        : sysId === '4'
        ? cloneDeep(saveDictList?.manuscriptStrategy)
        : [];
    cloneDeepAuthorizationStrategy?.map(item => {
      item.label = item.name;
      item.value = item.code;
    });
    setStrategy(cloneDeepAuthorizationStrategy);
  }, [saveDictList, sysId]);

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
  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const layoutNew = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const defaultConfig = {
    config: {
      disabled: true,
    },
  };

  const handleRoleBySysId = sysId => {
    // 根据归属系统查询可用的角色组件集合
    dispatch({
      type: 'userManagement/queryBySys',
      payload: sysId,
    });
  };

  const productInfo = [
    {
      name: 'username',
      label: '用户名',
      ...defaultConfig,
      initialValue: userauthed.username,
    },
    {
      name: 'usercode',
      label: '登录名',
      ...defaultConfig,
      initialValue: userauthed.usercode,
    },
    {
      name: 'sex',
      label: '性别',
      type: 'select',
      option: [
        { name: '男', code: 0 },
        { name: '女', code: 1 },
      ],
      ...defaultConfig,
      initialValue: userauthed.sex + '',
    },
    {
      name: 'mobile',
      label: '手机号码',
      ...defaultConfig,
      initialValue: userauthed.mobile,
    },
    {
      name: 'email',
      label: '电子邮箱',
      ...defaultConfig,
      initialValue: userauthed.email,
    },
    {
      name: 'deptId',
      label: '所属部门',
      type: 'select',
      option: saveGetDept,
      ...defaultConfig,
      initialValue: userauthed.deptId && userauthed.deptId + '',
      readSet: {
        name: 'orgName',
        code: 'id',
      },
    },
    {
      name: 'principal',
      label: '是否部门负责人',
      type: 'radio',
      ...defaultConfig,
      option: [
        { name: '是', code: 1 },
        { name: '否', code: 0 },
      ],
      initialValue: userauthed.principal,
    },
    {
      name: 'assistMgtDept',
      label: '协管部门',
      type: 'select',
      ...defaultConfig,
      initialValue: userauthed.assistMgtDept + '',
      readSet: {
        name: 'orgName',
        code: 'id',
      },
      option: saveGetDept,
    },
    {
      name: 'sysId',
      label: '归属系统',
      type: 'checkbox',
      ...defaultConfig,
      option: attributionSystem?.filter(item => GET_USER_SYSID.includes(item.code)),
      initialValue: [...(userauthed?.sysId?.split(',') || [])],
    },
  ];

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '权限管理',
          url: '',
        },
        {
          title: '用户管理',
          url: '/authority/userManagement',
        },
        {
          title: '详情',
          url: '',
        },
      ]}
    >
      <Spin spinning={loading}>
        <Card
          title={userauthed.username}
          extra={
            <div>
              {/* {userauthed.freezed == 0 && [
                <Action key="userManagement:modify" code="userManagement:modify">
                  <Button onClick={() => setShowModifyPannel(true)}>修改信息</Button>
                </Action>,
                <Action key="userManagement:reset" code="userManagement:reset">
                  <Button className={styles.btnsStyle } onClick={restUserCode}>
                    重置密码
                  </Button>
                </Action>,
              ]}
              <Action key="userManagement:freeze" code="userManagement:freeze">
                {userauthed.freezed == 0 ? (
                  <Button
                    className={styles.btnsStyle }
                    onClick={() => {
                      handleFreeze({ freeze: 1 });
                    }}
                  >
                    冻结
                  </Button>
                ) : (
                  <Button
                    className={styles.btnsStyle }
                    onClick={() => {
                      handleFreeze({ freeze: 0 });
                    }}
                  >
                    解冻
                  </Button>
                )}
              </Action> */}
              <Button className={styles.btnsStyle } onClick={() => router.go(-1)}>
                返回
              </Button>
            </div>
          }
        >
          <Form {...layout}>
            <Row>
              <CustomFormItem formItemList={productInfo} form={form} />
            </Row>
          </Form>
        </Card>
        <PreviewModal
          title={'用户权限'}
          authorizationStrategy={strategy}
          authModal={true}
          dataStrategies={strategyCodes}
          saveAuthorizeActionsList={saveAuthorizeActionsList}
          saveAllMenuTree={saveAllMenuTree}
          savePositionsTree={savePositionsTree}
          tags={tags['02']}
          positionsList={savePositionsList}
          functions={associatedFunction}
          positions={associatedJobs}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
          // 根据选中的岗位查询组件id
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          handleReset={handleReset}
          isModel={false}
          ownershipSystem={attributionSystem}
          selectOwnershipSystem={sysId}
          ownershipSystemChange={value => {
            setSysId(value);
          }}
          userauthed={userauthed}
          roleComByUser={roleComByUser}
          roleBySys={roleBySys}
          handleQueryBySys={handleQueryBySys}
          disabled={true}
        />
      </Spin>
      <ModifyInfo
        setShowModifyPannel={setShowModifyPannel}
        showModifyPannel={showModifyPannel}
        userauthed={userauthed}
        saveGetDept={saveGetDept}
        userId={queryParam.userAuthedId}
        refreshFunc={getUserInfo}
      />

      <PreviewModal
        title={'预览权限'}
        authorizationStrategy={strategy}
        authModal={authModal}
        setAuthModal={setAuthModal}
        dataStrategies={strategyCodes}
        saveAuthorizeActionsList={saveAuthorizeActionsList}
        saveAllMenuTree={saveAllMenuTree}
        savePositionsTree={savePositionsTree}
        tags={tags['02'].concat(tags['01'] ?? [])}
        positionsList={savePositionsList}
        functions={associatedFunction}
        positions={associatedJobs}
        fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
        fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
        fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
        handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
        handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
        // 根据选中的岗位查询组件id
        savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
        handleReset={handleReset}
        ownershipSystem={attributionSystem}
        selectOwnershipSystem={sysId}
        ownershipSystemChange={value => {
          setSysId(value);
        }}
        userauthed={userauthed}
        roleComByUser={selectTagList}
        roleBySys={roleBySys}
        handleQueryBySys={handleQueryBySys}
        disabled={true}
      />
    </PageContainers>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ loading, userManagement, roleManagement, workSpace }) => ({
      userManagement,
      roleManagement,
      workSpace,
      fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      fetchGetPositionsTreeLoading: loading.effects['roleManagement/fetchGetPositionsTreeLoading'],
      handleCreateRoleLoading: loading.effects['roleManagement/handleCreateRole'],
      getuserauthedLoading: loading.effects['userManagement/getGLAuserauthed'],
    }))(Detail),
  ),
);

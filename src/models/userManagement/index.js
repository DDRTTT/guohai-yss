import {
  authorize,
  createRole,
  fetchUserFreeze,
  fetchUserLogout,
  getInfoByUserName,
  getOrgList,
  getPositionsList,
  getRoleDetail,
  getRoleList,
  getRoleSetBySysId,
  getRoleTree,
  getuserauthed,
  modifyRole,
  queryBySys,
  queryRoleComByUser,
  QUICK_AUTH_DETAIL_API,
  roleDelete,
  roleReview,
  SAVE_QUICK_AUTH_API,
  updateRole,
  updateUserInfo,
  fetchUserWithdraw,
} from '@/services/userManagement';
import { getDeptAPI, getDictList, handleClassRole } from '@/services/datum';
import { getAllAuthorizeById as getAuthorizeById } from '@/services/role';
import { getEmployeeInfo } from '@/services/institutionalInfoManager/modify';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'userManagement',

  state: {
    // 角色列表
    data: {
      rows: [],
      total: 0,
    },
    saveListPayload: {},
    // 词汇
    saveDictList: {
      attributionSystem: [],
      SysUserType: [],
      authorizationStrategy: [],
      roleName: [],
    },
    // 部门
    saveGetDept: [],
    // 功能组件
    tags: {
      '02': [],
    },
    // 岗位
    savePositionsList: [],

    saveAllMenuTree: [],
    saveAllMenuTreeCode: [],
    saveAuthorize: [],
    saveAuthorizeActionsList: [],
    // 角色详情
    saveRoleDetail: {},
    // 创建角色时保存的信息
    saveRoleInfo: {},

    // ------------
    // 根据归属系统查询可用角色组件集合
    saveRoleSet: [],
    // 根据员工名称查详情
    saveInfoByUserName: [],
    // 用户被授权的角色组建id集合
    roleComByUser: [],
    // 根据归属系统查询可用角色组件集合
    roleBySys: [],
    // user权限详情
    userauthed: {},
    // 机构列表下拉
    saveOrgList: [],
    // 员工详情
    employeeInfo: {},
  },

  effects: {
    // 角色变更
    *modifyRole({ payload }, { call }) {
      const res = yield call(modifyRole, payload);
      if (res && res.status === 200) {
        message.success('操作成功');
        router.goBack();
      }
    },

    // 更新用户信息
    *updateUserInfo({ payload }, { call }) {
      const res = yield call(updateUserInfo, payload);
      if (res && res.status === 200) {
        if (res?.data?.status === '9999') {
          message.warn(res?.data?.errMsg ?? '该用户登录名已被使用！');
        } else {
          message.success('操作成功');
        }
      } else {
        message.error(res?.message);
      }
    },

    // 查看用户权限详情
    *getuserauthed({ payload }, { call, put }) {
      const res = yield call(getuserauthed, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setGetuserauthed',
          payload: res.data,
        });
      }
    },

    // 创建用户并授权
    *authorize({ payload }, { call }) {
      const res = yield call(authorize, payload);
      if (res && res.status) {
        if (res.status === 200) {
          return true;
        }
        if (res.status.toString().length === 8) {
          message.warn(res.message);
        } else {
          message.warn(`新增失败`);
        }
      }
    },

    // 根据归属系统查询可用角色组件集合
    *queryBySys({ payload }, { call, put }) {
      const res = yield call(queryBySys, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setQueryBySys',
          payload: res.data,
        });
      }
    },

    // 根据员工Id查询员工详细信息
    *getEmployeeInfo({ payload }, { call, put }) {
      const res = yield call(getEmployeeInfo, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setEmployeeInfo',
          payload: res.data,
        });
        return res.data;
      }
    },

    // 查询用户被授权的角色组建id集合
    *queryRoleComByUser({ payload }, { call, put }) {
      const res = yield call(queryRoleComByUser, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setRoleComByUser',
          payload: res.data,
        });
      }
    },

    // 角色列表
    *fetch({ payload }, { call, put }) {
      const res = yield call(getRoleList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveList',
          payload: res.data,
        });
        yield put({
          type: 'saveListPayload',
          payload,
        });
      }
    },

    // 词汇
    *handleGetDictList({ payload }, { put, call }) {
      const res = yield call(getDictList, payload);
      if (res && res.data) {
        yield put({
          type: 'saveDictList',
          payload: res.data,
        });
      }
    },

    // 所属部门
    *fetchGetDept({ payload }, { put, call }) {
      const res = yield call(getDeptAPI, payload);
      if (res && res.data) {
        yield put({
          type: 'saveGetDept',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 创建角色
    *handleCreateRole({ payload }, { call }) {
      yield put({
        type: 'saveRoleInfo',
        payload,
      });
      return yield call(createRole, payload);
    },

    // 更新角色
    *handleUpdateRole({ payload }, { call }) {
      return yield call(updateRole, payload);
    },

    // 查询功能组件
    *fetchHasRole({ payload }, { call, put }) {
      const res = yield call(handleClassRole, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'hasRole',
          payload: res.data,
        });
      }
    },

    // 岗位查询
    *fetchGetPositionsList({ payload }, { call, put }) {
      const res = yield call(getPositionsList, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'savePositionsList',
          payload: res.data,
        });
      }
    },

    // 权限树查询
    *fetchGetAuthTree({ payload }, { call, put }) {
      const res = yield call(getRoleTree, payload);
      if (res && res.status === 200 && res.data) {
        const authorizes = res.data;
        const arr = [];
        for (let i = 0; i < authorizes.length; i++) {
          if (authorizes[i].children) {
            const item = authorizes[i].children;
            item.map(items => {
              const mapItem = items.actions;
              const len = items.actions.length;
              for (let j = 0; j < len; j++) {
                arr.push(mapItem[j].id);
              }
            });
          }
        }
        // 树
        yield put({
          type: 'saveAllMenuTree',
          payload: [],
        });
        yield put({
          type: 'saveAllMenuTree',
          payload: res.data,
        });
        // 全部的权限id
        yield put({
          type: 'saveAllMenuTreeCode',
          payload: arr,
        });
      }
    },

    // 通过组件id查询当前组件的权限
    *fetchGetAuthorizeById({ payload }, { put, call }) {
      const res = yield call(getAuthorizeById, payload);
      if (res.data) {
        yield put({
          type: 'saveAuthorize',
          payload: res.data[0],
        });
        if (res.data[0]) {
          yield put({
            type: 'saveAuthorizeActionsList',
            payload: res.data[0].actionsList || [],
          });
        }
      }
    },

    // 复核，反复核
    *handleRoleReview({ payload }, { put, call, select }) {
      const res = yield call(roleReview, payload);
      const text = payload.check === 1 ? '复核' : '反复核';
      if (res && res.status === 200) {
        const params = yield select(m => m.roleManagement.saveListPayload);
        message.success(`${text}成功`);
        yield put({
          type: 'fetch',
          payload: params,
        });
      } else {
        message.warn(`${text}失败`);
      }
    },

    // 删除
    *handleRoleDelete({ payload }, { put, call, select }) {
      const res = yield call(roleDelete, payload);
      const text = '角色删除';
      if (res && res.status === 200) {
        const params = yield select(m => m.roleManagement.saveListPayload);
        message.success(`${text}成功`);
        yield put({
          type: 'fetch',
          payload: params,
        });
      } else {
        message.warn(`${text}失败`);
      }
      return res;
    },

    // 角色详情
    *handleRoleDetail({ payload }, { put, call }) {
      const res = yield call(getRoleDetail, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveRoleDetail',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // -----------------------------------

    // 根据归属系统查询可用角色组件集合
    *fetchGetRoleSetBySysId({ payload }, { put, call }) {
      const res = yield call(getRoleSetBySysId, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveRoleSet',
          payload: data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 根据员工名称查详情
    *handleGetInfoByUserName({ payload }, { put, call }) {
      const res = yield call(getInfoByUserName, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveInfoByUserName',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 冻结/解冻
    *handleUserFreeze({ payload }, { call }) {
      const res = yield call(fetchUserFreeze, payload);
      if (res && res.status === 200) {
        if (payload.freeze === 1) {
          message.success('冻结用户成功');
        }
        if (payload.freeze === 0) {
          message.success('解冻用户成功');
        }
        return true;
      }
      message.warn(res.message);
    },

    // 注销
    *handleUserWithdraw({ payload }, { call }) {
      const res = yield call(fetchUserWithdraw, payload);
      if (res && res.status === 200) {
        message.success('注销用户成功');
        return true;
      }
      message.warn(res.message);
    },

    // 注销用户
    *handleFetchUserLogout({ payload }, { call }) {
      const res = yield call(fetchUserLogout, payload);
      if (res && res.status === 200) {
        if (res?.data?.status === '200') {
          message.success('用户删除成功');
          return true;
        }
        message.error(res?.data?.errMsg || '用户删除失败，请稍后重试');
      } else {
        message.warn('用户删除失败，请稍后重试');
      }
    },

    // 机构列表下拉
    *handleGetOrgList({ payload }, { put, call }) {
      const res = yield call(getOrgList, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'saveOrgList',
          payload: res.data,
        });
      }
    },

    // 便捷授权保存
    *SAVE_QUICK_AUTH_FETCH({ payload }, { call }) {
      const res = yield call(SAVE_QUICK_AUTH_API, payload);
      if (res && res.status === 200) {
        message.success('保存成功');
        router.goBack();
      }
    },

    // 查看用户权限详情
    *QUICK_AUTH_DETAIL_FETCH({ payload }, { call, put }) {
      const res = yield call(QUICK_AUTH_DETAIL_API, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setGetuserauthed',
          payload: res.data,
        });
      }
    },
  },

  reducers: {
    setGetuserauthed(state, { payload }) {
      return {
        ...state,
        userauthed: payload,
      };
    },
    setQueryBySys(state, { payload }) {
      return {
        ...state,
        roleBySys: payload,
      };
    },
    setEmployeeInfo(state, { payload }) {
      return {
        ...state,
        employeeInfo: payload,
      };
    },
    setRoleComByUser(state, { payload }) {
      return {
        ...state,
        roleComByUser: payload,
      };
    },
    saveList(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveListPayload(state, { payload }) {
      return {
        ...state,
        saveListPayload: payload,
      };
    },
    saveDictList(state, { payload }) {
      return {
        ...state,
        saveDictList: payload,
      };
    },
    saveGetDept(state, { payload }) {
      return {
        ...state,
        saveGetDept: payload,
      };
    },
    hasRole(state, { payload }) {
      return {
        ...state,
        tags: payload,
      };
    },
    savePositionsList(state, { payload }) {
      return {
        ...state,
        savePositionsList: payload,
      };
    },
    saveAllMenuTree(state, { payload }) {
      return {
        ...state,
        saveAllMenuTree: payload,
      };
    },
    saveAllMenuTreeCode(state, { payload }) {
      return {
        ...state,
        saveAllMenuTreeCode: payload,
      };
    },
    saveAuthorize(state, { payload }) {
      return {
        ...state,
        saveAuthorize: payload,
      };
    },
    saveAuthorizeActionsList(state, { payload }) {
      return {
        ...state,
        saveAuthorizeActionsList: payload,
      };
    },
    saveRoleDetail(state, { payload }) {
      return {
        ...state,
        saveRoleDetail: payload,
      };
    },
    saveRoleInfo(state, { payload }) {
      return {
        ...state,
        saveRoleInfo: payload,
      };
    },
    // ----------------------
    saveRoleSet(state, { payload }) {
      return {
        ...state,
        saveRoleSet: payload,
      };
    },
    saveInfoByUserName(state, { payload }) {
      return {
        ...state,
        saveInfoByUserName: payload,
      };
    },
    saveOrgList(state, { payload }) {
      return {
        ...state,
        saveOrgList: payload,
      };
    },
  },
};

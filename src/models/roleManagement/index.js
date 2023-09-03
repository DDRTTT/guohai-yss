import {
  ADD_GROUP_FUN,
  CHECK_GROUP_FUN,
  checkRole,
  createRole,
  DELETE_GROUP_FUN,
  GET_ALL_PRO_CODE_FUN,
  GET_DG_PRO_PAGINATION_FUN,
  GET_DG_PRO_TREE_FUN,
  GET_GROUP_PRO_FUN,
  GET_PRO_GROUP_FUN,
  GET_PRO_PAGINATION_FUN,
  GET_PRO_TREE_FUN,
  getPositionsList,
  getPositionsTree,
  getRoleDetail,
  getRoleList,
  getRoleTree,
  getSummary,
  restUserCode,
  roleDelete,
  roleReview,
  updateRole,
} from '@/services/roleManagement';
import {
  getDeptAPI,
  getDictList,
  handleAddGroup,
  handleCheckChild,
  handleClassRole,
} from '@/services/datum';
import { getAllAuthorizeById as getAuthorizeById } from '@/services/role';
import { message } from 'antd';

export default {
  namespace: 'roleManagement',

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
    savePositionsTree: [],
    saveAllMenuTree: [],
    saveAllMenuTreeCode: [],
    saveAuthorize: [],
    // 根据组件id查询当前组件权限id
    saveAuthorizeActionsList: [],
    // 角色详情
    saveRoleDetail: {},
    // 根据员工名称查详情
    saveInfoByUserName: [],
    // 根据选中的岗位查询组件id
    savePositionAuthorizeActionsList: [],
    // 成功后信息
    saveSuccessInfo: {},
    // 产品类树
    SAVE_PRO_TREE: [],
    // 我的产品分组
    SAVE_PRO_GROUP: [],
    // 条件查询产品-分页
    SAVE_PRO_PAGINATION: {
      total: 0,
      rows: [],
    },
    // 条件查询产品-分页
    SAVE_PRO_PAGINATION2: {
      total: 0,
      rows: [],
    },
    // 获取全部产品code
    SAVE_ALL_PRO_CODE: [],
    // 临时存储产品
    SAVE_TEMP_PRO: [],
  },

  effects: {
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

    // 查询岗位组件
    *fetchGetPositionsTree({ payload }, { call, put }) {
      const res = yield call(getPositionsTree, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'savePositionsTree',
          payload: [],
        });
        yield put({
          type: 'savePositionsTree',
          payload: res.data,
        });
      } else {
        yield put({
          type: 'savePositionsTree',
          payload: [],
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
      if (res && res.status === 200) {
        yield put({
          type: 'saveAllMenuTree',
          payload: [],
        });
        yield put({
          type: 'saveAllMenuTree',
          payload: res?.data ?? [],
        });
      }
    },

    // 通过功能组件id查询当前组件的权限
    *fetchGetAuthorizeById({ payload }, { put, call }) {
      const res = yield call(getAuthorizeById, payload);
      if (res && res.data) {
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

    // 通过岗位组件id查询当前组件的权限 TODO：未完成
    *fetchGetPositionAuthorizeById({ payload }, { put, call }) {
      const res = yield call(getPositionsTree, payload);
      if (res && res.status === 200 && res.data) {
        const arr = [];
        const { data } = res;
        data.forEach(item => arr.push(...item.nodesMap));
        yield put({
          type: 'savePositionAuthorizeActionsList',
          payload: arr,
        });
      } else {
        yield put({
          type: 'savePositionsTree',
          payload: [],
        });
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
        return true;
      }
      message.warn(`${text}失败`);
    },

    // 校验角色是否被使用
    *handleCheckRole({ payload }, { call }) {
      return yield call(checkRole, payload);
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
        return true;
      }
      message.warn(res.message);
    },

    // 角色详情
    *handleRoleDetail({ payload }, { put, call }) {
      const res = yield call(getRoleDetail, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveRoleDetail',
          payload: res.data,
        });
        return res.data;
      }
      message.warn(res.message);
    },

    // 查询返显数据
    *getSummary({ payload }, { put, call }) {
      const res = yield call(getSummary, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveSuccessInfo',
          payload: res.data,
        });
      }
    },

    // 重置密码
    *rest({ payload }, { call }) {
      const res = yield call(restUserCode, payload);
      if (res && res.status === 200) {
        message.success('操作成功，重置为初始密码!');
      } else {
        message.warn('重置密码失败!');
      }
    },

    // 获取产品类树
    *GET_PRO_TREE_FETCH({ payload }, { call, put }) {
      const res = yield call(GET_PRO_TREE_FUN, payload);
      if (res && res.status && res.status === 200) {
        yield put({
          type: 'SAVE_PRO_TREE',
          payload: res?.data ?? [],
        });
      }
    },

    // 底稿-获取产品类树
    *GET_DG_PRO_TREE_FETCH({ payload }, { call, put }) {
      const res = yield call(GET_DG_PRO_TREE_FUN, payload);
      if (res && res.status && res.status === 200) {
        yield put({
          type: 'SAVE_PRO_TREE',
          payload: res?.data ?? [],
        });
      }
    },

    // 我的分组
    *GET_PRO_GROUP_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_PRO_GROUP_FUN, payload);
      if (res && res.status && res.status === 200) {
        yield put({
          type: 'SAVE_PRO_GROUP',
          payload: res?.data ?? [],
        });
      }
    },

    // 条件查询产品-分页
    *GET_PRO_PAGINATION_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_PRO_PAGINATION_FUN, payload);
      if (res && res.data) {
        const { rows } = res.data;
        if (rows && Array.isArray(rows)) {
          const len = rows.length;
          for (let i = 0; i < len; i++) {
            rows[i].key = rows[i].proCode;
          }
        }
        yield put({
          type: 'SAVE_PRO_PAGINATION',
          payload: res.data ?? {
            total: 0,
            rows: [],
          },
        });
      }
    },

    // 条件查询产品-分页-弹框使用
    *GET_PRO_PAGINATION2_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_PRO_PAGINATION_FUN, payload);
      if (res && res.data) {
        const { rows } = res.data;
        if (rows && Array.isArray(rows)) {
          const len = rows.length;
          for (let i = 0; i < len; i++) {
            rows[i].key = rows[i].proCode;
          }
        }
        yield put({
          type: 'SAVE_PRO_PAGINATION2',
          payload: res.data ?? {
            total: 0,
            rows: [],
          },
        });
      }
    },

    // 底稿-条件查询产品-分页
    *GET_DG_PRO_PAGINATION_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_DG_PRO_PAGINATION_FUN, payload);
      if (res && res.data) {
        const { rows } = res.data;
        if (rows && Array.isArray(rows)) {
          const len = rows.length;
          for (let i = 0; i < len; i++) {
            rows[i].key = rows[i].proCode;
          }
        }
        yield put({
          type: 'SAVE_PRO_PAGINATION',
          payload: res.data ?? {
            total: 0,
            rows: [],
          },
        });
      }
    },

    // 底稿-条件查询产品-分页-返回数据：pages中需要对底稿数据做实时处理
    *getDGProducts({ payload }, { put, call }) {
      const res = yield call(GET_DG_PRO_PAGINATION_FUN, payload);
      if (res && res.status === 200) {
        return res.data;
      } else {
        if (res.message) {
          message.warn(res.message);
          return;
        }
        message.warn('产品数据请求失败，请稍后重试')
      }
    },

    // 底稿-条件查询产品-分页-弹框使用
    *GET_DG_PRO_PAGINATION2_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_DG_PRO_PAGINATION_FUN, payload);
      if (res && res.data) {
        const { rows } = res.data;
        if (rows && Array.isArray(rows)) {
          const len = rows.length;
          for (let i = 0; i < len; i++) {
            rows[i].key = rows[i].proCode;
          }
        }
        yield put({
          type: 'SAVE_PRO_PAGINATION2',
          payload: res.data ?? {
            total: 0,
            rows: [],
          },
        });
      }
    },

    // 校验分组下是否有产品
    *CHECK_GROUP_FETCH({ payload }, { call }) {
      const res = yield call(CHECK_GROUP_FUN, payload);
      if (res.message === 'success' && res.status === 200) {
        if (res.data.status === '10031000') {
          message.warn(res.data.errMsg);
          return false;
        }
        return true;
      }
    },

    // 添加分组 仅保存组
    *SAVE_GROUP_FETCH({ payload }, { call }) {
      const parentGroupId = payload.productGroup.parentId;

      // 校验分组下是否有产品
      const res = yield call(CHECK_GROUP_FUN, parentGroupId);
      if (res && res.message === 'success' && res.status === 200) {
        // 有分组 不允许添加
        if (res.data.status === '10031000') {
          return {
            modelType: false,
            message: res.data.errMsg ?? '分组名称已存在，请更换分组名称',
          };
        }
        // 可添加分组
        else {
          const res = yield call(ADD_GROUP_FUN, payload);
          // 添加成功时
          if (res && res.message === 'success' && res.status === 200 && res.data.status === '200') {
            return {
              modelType: true,
              message: '添加成功',
            };
          }
          // 添加失败时

          return {
            modelType: false,
            message: res.data.errMsg ?? '分组名称已存在，请更换分组名称',
          };
        }
      }
    },

    // 获取全部产品code
    *GET_ALL_PRO_CODE_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_ALL_PRO_CODE_FUN, payload);
      if (res && res.message === 'success' && res.status === 200) {
        yield put({
          type: 'SAVE_ALL_PRO_CODE',
          payload: res?.data ?? [],
        });
      }
    },

    // 根据产品类型proTypeList、分组类型groupList、查询条件proCondition，获取对应proCode
    *getProCodeByConditions({ payload }, { put, call }) {
      const res = yield call(GET_ALL_PRO_CODE_FUN, payload);
      if (res && res.status === 200) {
        return res;
      } else {
        if (res.message) {
          message.warn(res.message);
        } else {
          message.warn('获取产品编码失败，请稍后重试')
        }
      }
    },

    // 删除分组
    *DELETE_GROUP_FETCH({ payload }, { put, call }) {
      const res = yield call(DELETE_GROUP_FUN, payload);
      if (res && res.status === 200 && res.data.message === false && res.message === 'success') {
        message.warning('该分组或子分组已被使用，请撤销授权后进行删除');
      }
      if (res && res.status === 200 && res.data.message === true && res.message === 'success') {
        message.success('删除成功');
        // 更新分组数据
        yield put({ type: 'GET_PRO_GROUP_FETCH' });
        return true;
      }
    },

    // 添加分组，并在组中添加产品
    *SAVE_PRODUCT_TO_GROUP_FETCH({ payload }, { put, call }) {
      // 编辑分组时
      if (payload.type === 'edit') {
        const { id } = payload.productGroup;
        const res = yield call(handleCheckChild, id);

        if (res.message === 'success' && res.status === 200 && res.data.status === '200') {
          // 根据分组的id是否存在判断：
          // 1.如果分组id存在，为修改分组
          // 2.如果分组id不存在，为新增分组并添加产品
          const r = yield call(handleAddGroup, payload);

          // 添加成功时
          if (r.message === 'success' && r.status === 200) {
            message.success('修改成功');
          }
          // 添加失败时
          else {
            message.success('修改失败');
          }
        } else {
          message.info('当前分组下已有分组，无法添加产品，可创建新分组并添加产品');
        }
      }
      // 新增分组并添加产品
      else if (payload.type === 'add') {
        // 根据分组的id是否存在判断：1.如果分组id存在，为修改分组 2.如果分组id不存在，为新增分组并添加产品
        const res = yield call(handleAddGroup, payload);
        // 添加成功时
        if (res.message === 'success' && res.status === 200) {
          message.success('添加成功');
          // 更新分组数据
          yield put({ type: 'GET_PRO_GROUP_FETCH' });
          return true;
        }
        // 添加失败时
        message.success('添加失败');
      }
    },

    // 查询分组中产品
    *GET_GROUP_PRO_FETCH({ payload }, { put, call }) {
      const res = yield call(GET_GROUP_PRO_FUN, payload);
      if (res && res.message === 'success' && res.status === 200) {
        const data = res?.data ?? [];
        yield put({
          type: 'SAVE_TEMP_PRO',
          payload: data,
        });
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].proCode);
        }
        yield put({
          type: 'SAVE_ALREADY_PRO',
          payload: arr,
        });
      }
    },
  },

  reducers: {
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
    savePositionsTree(state, { payload }) {
      return {
        ...state,
        savePositionsTree: payload,
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
    saveSuccessInfo(state, { payload }) {
      return {
        ...state,
        saveSuccessInfo: payload,
      };
    },
    savePositionAuthorizeActionsList(state, { payload }) {
      return {
        ...state,
        savePositionAuthorizeActionsList: payload,
      };
    },
    SAVE_PRO_TREE(state, { payload }) {
      return {
        ...state,
        SAVE_PRO_TREE: payload,
      };
    },
    SAVE_PRO_GROUP(state, { payload }) {
      return {
        ...state,
        SAVE_PRO_GROUP: payload,
      };
    },
    SAVE_PRO_PAGINATION(state, { payload }) {
      return {
        ...state,
        SAVE_PRO_PAGINATION: payload,
      };
    },
    SAVE_PRO_PAGINATION2(state, { payload }) {
      return {
        ...state,
        SAVE_PRO_PAGINATION2: payload,
      };
    },
    SAVE_ALL_PRO_CODE(state, { payload }) {
      return {
        ...state,
        SAVE_ALL_PRO_CODE: payload,
      };
    },
    // 暂时保存选择的产品
    SAVE_TEMP_PRO(state, { payload }) {
      return {
        ...state,
        SAVE_TEMP_PRO: payload,
      };
    },
  },
};

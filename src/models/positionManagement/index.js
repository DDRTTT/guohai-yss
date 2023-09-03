import {
  addPosition,
  detailPosition,
  getDictList,
  getPositionLists,
  getRoleList,
  handleDelPosition,
  positionReview,
  updatePosition,
} from '@/services/positionManagement';
import { message } from 'antd';

export default {
  namespace: 'positionManagement',

  state: {
    // 角色列表
    saveList: {
      rows: [],
      total: 0,
    },

    // 词汇
    saveDictList: {
      attributionSystem: [],
      SysUserType: [],
      authorizationStrategy: [],
      roleName: [],
    },
    saveRoleList: [],
    saveListPayload: {},
    savePositionDetail: { sysId: '' },
  },

  effects: {
    // 角色列表
    *fetch({ payload }, { call, put }) {
      const res = yield call(getPositionLists, payload);
      if (res && res.status === 200 && res.data) {
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

    // 岗位详情
    *fetchPositionDetail({ payload }, { call, put }) {
      const res = yield call(detailPosition, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'savePositionDetail',
          payload: res.data,
        });
      }
    },

    // 复核，反复核
    *handleRoleReview({ payload }, { call }) {
      const res = yield call(positionReview, payload);
      const text = payload.check === 1 ? '复核' : '反复核';
      if (res && res.status === 200) {
        message.success(`${text}成功`);
      } else {
        message.warn(`${text}失败`);
      }
      return res;
    },

    // 词汇
    *handleGetDictList({ payload }, { put, call }) {
      const res = yield call(getDictList, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'saveDictList',
          payload: res.data,
        });
      }
    },

    // 获取角色
    *handleGetRole({ payload }, { put, call }) {
      const res = yield call(getRoleList, payload);
      if (res && res.status === 200 && res.data) {
        const { data } = res;
        data.map(item => {
          item.label = item.name;
          item.value = item.id;
        });
        yield put({
          type: 'saveRoleList',
          payload: data,
        });
      }
    },

    // 删除岗位
    *handleDelete({ payload }, { call }) {
      const res = yield call(handleDelPosition, payload.id);
      if (res && res.status === 200) {
        message.success('岗位删除成功');
      } else {
        message.warn('岗位删除失败，请稍后再试');
      }
      return res;
    },

    // 新增岗位
    *handleSavePosition({ payload }, { call }) {
      const res = yield call(addPosition, payload);
      if (res && res.status === 200) {
        message.success('新增岗位成功');
      } else {
        message.warn(res.message || '新增岗位失败，请稍后再试');
      }
      return res;
    },

    // 更新岗位
    *handleUpdatePosition({ payload }, { call }) {
      const res = yield call(updatePosition, payload);
      if (res && res.status === 200) {
        message.success('修改岗位成功');
      } else {
        message.warn(res?.message ?? '修改岗位失败，请稍后再试');
      }
      return res;
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        saveList: payload,
      };
    },
    saveDictList(state, { payload }) {
      return {
        ...state,
        saveDictList: payload,
      };
    },
    saveListPayload(state, { payload }) {
      return {
        ...state,
        saveListPayload: payload,
      };
    },
    saveRoleList(state, { payload }) {
      return {
        ...state,
        saveRoleList: payload,
      };
    },
    savePositionDetail(state, { payload }) {
      return {
        ...state,
        savePositionDetail: payload,
      };
    },
  },
};

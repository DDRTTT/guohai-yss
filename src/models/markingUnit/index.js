import {
  getListAPI,
  getDictsAPI,
  getOrgDictsAPI,
  getRevokeAPI,
  getDeleteAPI,
} from '@/services/markingUnit/index';
import { message } from 'antd';

export default {
  namespace: 'markingUnit',
  state: {
    dicts: {},
    orgDicts: [],
    markingUnitTableData: {
      total: '',
      rows: [],
    },
  },

  effects: {
    // 获取数据字典
    *getDicts({ payload, callback }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 获取机构下拉字典数据
    *getOrgDictsFunc({ payload, callback }, { call, put }) {
      const response = yield call(getOrgDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'orgDicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 删除
    *getDeleteFunc({ payload, callback }, { call }) {
      console.log(payload);
      const response = yield call(getDeleteAPI, payload);
      if (response && response.status === 200) {
        message.success(' 删除成功 ! ', 1);
        if (callback) callback();
      } else {
        message.error(' 删除失败 ! ', 1);
      }
    },

    // 撤销
    *getRevokeFunc({ payload, callback }, { call }) {
      console.log(payload);
      const response = yield call(getRevokeAPI, payload);
      if (response && response.status === 200) {
        message.success(' 撤销成功 ! ', 1);
        if (callback) callback();
      } else {
        message.error(' 撤销失败 ! ', 1);
      }
    },

    // 获取分页列表数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'markingUnitTableData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },
  },

  reducers: {
    dicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },

    orgDicts(state, { payload }) {
      return {
        ...state,
        orgDicts: payload,
      };
    },

    markingUnitTableData(state, { payload }) {
      return {
        ...state,
        markingUnitTableData: payload,
      };
    },
  },
};

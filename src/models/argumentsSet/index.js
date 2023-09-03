import {
  getListAPI,
  getProType,
  getProNameAndCodeAPI,
  getDictsAPI,
  getDeleteAPI,
  getRevokeAPI,
} from '@/services/argumentsSet/index';
import { message } from 'antd';

export default {
  namespace: 'argumentsSet',
  state: {
    dicts: {},
    proTypeDatas: [],

    proNameAndCodeData: [],
    argumentsSetTableData: {
      total: '',
      rows: [],
    },
  },

  effects: {
    // 获取数据字典
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
      }
    },

    *getProTypeFunc({}, { call, put }) {
      const response = yield call(getProType);
      if (response && response.status === 200) {
        yield put({
          type: 'proTypeDatas',
          payload: response.data,
        });
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

    // 获取产品全称/代码下拉列表数据
    *getProNameAndCodeFunc({}, { call, put }) {
      const response = yield call(getProNameAndCodeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'proNameAndCodeData',
          payload: response.data,
        });
      } else {
      }
    },

    // 获取分页列表数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'argumentsSetTableData',
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

    proTypeDatas(state, { payload }) {
      return {
        ...state,
        proTypeDatas: payload,
      };
    },

    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    argumentsSetTableData(state, { payload }) {
      return {
        ...state,
        argumentsSetTableData: payload,
      };
    },
  },
};

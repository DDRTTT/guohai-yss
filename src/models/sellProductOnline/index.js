import {
  getListAPI,
  getProType,
  getProNameAndCodeAPI,
  submitFormAPI,
  getProNameAPI,
  getProNameDataAPI,
  getProductDataSaveAPI,
  getDictsAPI,
  getDeleteAPI,
  getRevokeAPI,
} from '@/services/sellProductOnline/index';
import { message } from 'antd';

export default {
  namespace: 'sellProductOnline',
  state: {
    dicts: {},
    proTypeData: [],
    proNameAndCodeData: [],
    sellProductOnlineTableData: {
      total: '',
      rows: [],
    },
    saveWordDictionaryFetch: {},
    addData: {},
    proName: [],
    proNameData: {},
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
      } else {
      }
    },

    *getProTypeFunc({}, { call, put }) {
      const response = yield call(getProType);
      if (response && response.status === 200) {
        yield put({
          type: 'proTypeData',
          payload: response.data,
        });
      } else {
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
          type: 'sellProductOnlineTableData',
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

    // 提交新增
    *submitForm({ payload }, { call }) {
      const response = yield call(submitFormAPI, payload.params);
      if (response && response.status === 200) {
      } else {
      }
    },

    // 产品名称下拉列表
    *handleGetProCode({ payload }, { call, put }) {
      const response = yield call(getProNameAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proName',
          payload: response.data,
        });
      } else {
      }
    },

    // 根据产品名称反显数据
    *getProNameData({ payload, callback }, { call, put }) {
      const response = yield call(getProNameDataAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proNameData',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 保存form页
    *saveForm({ payload }, { call }) {
      const response = yield call(getProductDataSaveAPI, payload);
      if (response && response.status === 200) {
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

    proTypeData(state, { payload }) {
      return {
        ...state,
        proTypeData: payload,
      };
    },

    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    sellProductOnlineTableData(state, { payload }) {
      return {
        ...state,
        sellProductOnlineTableData: payload,
      };
    },

    proName(state, { payload }) {
      return {
        ...state,
        proName: payload,
      };
    },

    proNameData(state, { payload }) {
      return {
        ...state,
        proNameData: payload,
      };
    },
  },
};

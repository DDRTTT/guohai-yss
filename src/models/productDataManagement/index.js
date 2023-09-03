import { getDictsAPI, getTableAPI } from '@/services/productDataManagement';
import { message } from 'antd';

export default {
  namespace: 'productDataManagement',
  state: {
    dicts: [],
    tableData: {},
  },

  effects: {
    // 获取词汇字典数据
    *getDictsFunc({ payload, callback }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 获取表格数据
    *getTableFunc({ payload, callback }, { put, call }) {
      const res = yield call(getTableAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'tableData',
          payload: res.data,
        });
        if (callback) callback(res.data);
      } else {
        message.error(`表格数据获取失败 ! , 错误信息 : ${res.message}`);
        if (callback) callback([]);
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

    tableData(state, { payload }) {
      return {
        ...state,
        tableData: payload,
      };
    },
  },
};

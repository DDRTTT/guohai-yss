import {
  getDictsAPI,
  getProNameAndCodeAPI,
  getTableAPI,
  handleExportAPI, auditAPI
} from '@/services/accountParameter';
import { message } from 'antd';

export default {
  namespace: 'accountParameter',
  state: {
    dicts: [],
    productList: [],
    tableData: {},
  },

  effects: {
    // 获取词汇字典数据
    *getDictsFunc({ payload, callback }, { call, put }) {
      const response = yield call(auditAPI, payload.codeList);
      if (response && response.status === 200) {
        yield put({
          type: 'dicts',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 获取产品全称/代码下拉列表数据
    *getProductListFunc({ callback }, { call, put }) {
      const response = yield call(getProNameAndCodeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'productList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
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

    // 导出
    *handleExportFunc({ payload, callback }, { put, call }) {
      const res = yield call(handleExportAPI, payload);
      if (res && res.status === 200) {
        message.success('导出成功!');
        if (callback) callback(res.data);
      } else {
        message.error(`导出失败! , 错误信息 : ${res.message}`);
        if (callback) callback(res.data);
      }
    },

    // 审核/反审核
    *auditFunc({ payload, callback }, { call }) {
      const response = yield call(auditAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      } else message.error(response.message)
    },

  },

  reducers: {
    dicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },

    productList(state, { payload }) {
      return {
        ...state,
        productList: payload,
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

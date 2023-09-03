import { message } from 'antd';
import {
  handleGetTableData,
  getDicsByTypes,
  getProductList,
  productEnum,
  commitBatchAPI,
  deleteTableAPI,
  revokeTableAPI,
  productTypeListAPI
} from '@/services/messageFlow';

const model = {
  namespace: 'messageFlow',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    // 各种类型下拉
    opts: {},
    productList: [],
    productDropList: [],
    productTypeList: [],
  },
  effects: {
    // 获取信披流程列表
    *handleQueryTableData({ payload }, { call, put }) {
      const response = yield call(handleGetTableData, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'handleSetTableList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },

    // 产品名称/产品代码 查询
    *queryProductList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productListDict',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },

    // 查询模块下拉的字典
    *getDicts({ payload }, { put, call }) {
      const res = yield call(getDicsByTypes, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'initSelects',
          payload: {
            opts: res.data || {},
          },
        });
      }
    },
    *getProductDropList({ payload }, { call, put }) {
      const response = yield call(productEnum, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateProductDropList',
          payload: {
            productDropList: response.data,
          },
        });
      }
    },
    *commitBatch({ payload }, { call, put }) {
      yield put({
        type: 'updeteLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(commitBatchAPI, payload);
      if (response) {
        yield put({
          type: 'updeteLoading',
          payload: {
            loading: false,
          },
        });
        return response
      }
    },
    *deleteTable({ payload,callback}, { call, put }) {
        const response = yield call(deleteTableAPI,payload);
        if (response) {
          callback && callback(response)
        }
      },
    *revokeTable({ payload,callback}, { call, put }) {
        const response = yield call(revokeTableAPI,payload);
        if (response) {
          callback && callback(response)
        }
      },
    *getProductTypeList({ payload }, { call, put }) {
      const response = yield call(productTypeListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateProductTypeList',
          payload: response,
        });
      }
    },
  },
  reducers: {
    handleSetTableList(state, action) {
      return {
        ...state,
        tableList: action.payload,
      };
    },
    // 查询条件下拉值集合
    initSelects(state, { payload }) {
      return {
        ...state,
        opts: payload.opts,
      };
    },
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
    updateProductDropList(state, action) {
      return {
        ...state,
        productDropList: action.payload.productDropList,
      };
    },
    updeteLoading(state, action) {
      return {
        ...state,
        loading: action.payload.loading,
      };
    },
    updateProductTypeList(state, action) {
      return {
        ...state,
        productTypeList: action.payload.data,
      };
    },
  },
};

export default model;

import { message } from 'antd';
import {
  getTaskList,
  getDicsByTypes,
  getProductList,
  productEnum,
  commitBatchAPI,
  getInvestManagerNameListAPI,
  deleteTableAPI,
  revokeTableAPI,
  productTypeListAPI
} from '@/services/investorConference';

// 募集公告
const InvestorConference = {
  namespace: 'investorConference',
  state: {
    // 列表数据
    taskData: {
      rows: [],
      total: 0,
    },
    // 各种类型下拉
    opts: {},
    productList: [],
    productDropList: [],
    productTypeList: [],
    investManagerNameList: [],
  },

  effects: {
    // 获取任务列表
    *getTaskList({ payload }, { put, call }) {
      const res = yield call(getTaskList, payload);
      if (res && res.status === 200) {
        return res;
      } else {
        message.error(res.message);
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
        return response;
      }
    },
    *getInvestManagerNameList({ payload }, { call, put }) {
      const response = yield call(getInvestManagerNameListAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'updeteInvestManagerNameList',
          payload: {
            investManagerNameList: response.data,
          },
        });
      }
    },
    *deleteTable({ payload, callback }, { call, put }) {
      const response = yield call(deleteTableAPI, payload);
      if (response) {
        callback && callback(response);
      }
    },
    *revokeTable({ payload, callback }, { call, put }) {
      const response = yield call(revokeTableAPI, payload);
      if (response) {
        callback && callback(response);
      }
    },
    *getProductTypeList({ payload,callback}, { call, put }) {
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
    // 募集公告任务列表数据
    taskList(state, { payload }) {
      // 返回新的数据 newState
      return {
        ...state,
        taskData: payload.tableData,
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
    updeteInvestManagerNameList(state, action) {
      return {
        ...state,
        investManagerNameList: action.payload.investManagerNameList,
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

export default InvestorConference;

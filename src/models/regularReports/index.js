import { message } from 'antd';
import {
  getTableDataList,
  getDictList,
  productEnum,
  commitBatchAPI,
  deleteTableAPI,
  revokeTableAPI,
  productTypeListAPI
} from '@/services/regularReports';

export default {
  namespace: 'regularReports',
  state: {
    // 表格数据
    dataList: [],
    // 产品类型
    proTypeList: [],
    // 报告类型
    reportTypeList: [],
    // 状态类型
    statusList: [],
    total: 0,
    loading: false,
    productDropList: [],
    productTypeList: [],
  },
  effects: {
    *searchTableData({ payload }, { call, put }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveDataList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    // 词汇字典 查询
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getDictList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'dictList',
          payload: response,
        });
      } else {
        message.error('查询失败');
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
    *getProductTypeList({ payload }, { call, put }) {
      const response = yield call(productTypeListAPI, payload);
      if (response && response.status === 200) {
        console.log(response);
        yield put({
          type: 'updateProductTypeList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload.rows,
        total: payload.total,
      };
    },

    dictList(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data.A002,
        reportTypeList: action.payload.data.DQ001,
        statusList: action.payload.data.S001,
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

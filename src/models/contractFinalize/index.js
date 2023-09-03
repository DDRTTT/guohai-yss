import { message } from 'antd';
import {
  handleGetTableData,
  getDicsByTypes,
  getTrustee,
  getProductType,
  productEnum,
  revoke,
  deleteTask,
  commitBatchAPI,
} from '@/services/contractFinalize';

const model = {
  namespace: 'contractFinalize',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    // 各种类型下拉
    opts: {},
    // 托管人下拉信息
    trustee: [],
    // 产品类型
    productType: [],
    // 产品名称
    productName: [],
  },
  effects: {
    // 获取合同定稿列表
    *handleQueryTableData({ payload }, { call, put }) {
      const response = yield call(handleGetTableData, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'handleSetTableList',
          payload: response.data,
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
    // 获取下拉托管人的数据
    *handleGetTrustee({ payload }, { put, call }) {
      const res = yield call(getTrustee, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'handleSetTrustee',
          payload: {
            trustee: res.data || {},
          },
        });
      }
    },
    // 获取下拉产品类型的数据
    *handleGetProductType({ payload }, { put, call }) {
      const res = yield call(getProductType, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'handleSetProductType',
          payload: {
            productType: res.data || {},
          },
        });
      }
    },
    // 获取产品名称下拉框数据
    *handleGetProductName({ payload }, { put, call }) {
      const res = yield call(productEnum, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'handleSetProductName',
          payload: {
            productName: res.data || {},
          },
        });
      }
    },
    *revoke({ payload, callback }, { call, put }) {
      const response = yield call(revoke, payload);
      if (response) {
        callback && callback(response);
      }
    },
    *deleteTask({ payload, callback }, { call, put }) {
      const response = yield call(deleteTask, payload);
      if (response) {
        callback && callback(response);
      }
    },

    // 批量提交
    *commitBatch({ payload }, { call, put }) {
      return yield call(commitBatchAPI, payload);
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
    handleSetTrustee(state, { payload }) {
      return {
        ...state,
        trustee: payload.trustee,
      };
    },
    handleSetProductType(state, { payload }) {
      return {
        ...state,
        productType: payload.productType,
      };
    },
    // 产品名称action
    handleSetProductName(state, { payload }) {
      return {
        ...state,
        productName: payload.productName,
      };
    },
  },
};

export default model;

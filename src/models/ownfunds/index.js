import { message } from 'antd';
import {
  getTableDataList,
  getProductList,
  getDicList,
  getproTypeList,
  roductEnum,
  productEnum,
  commitBatchAPI,
  deleteTableAPI,
  revokeTableAPI,
} from '@/services/ownfunds';

const model = {
  namespace: 'ownfunds',
  state: {
    /* 表格列表 */
    tableList: [],
    // 产品名称/产品代码
    productList: [],
    /* 资产类型 */
    proTypeList: [],
    /* 状态 */
    statusList: [],
    productDropList: [],
  },
  effects: {
    /* 查询自有资金划款列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
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
    // 产品类型 查询
    *handleProductTypeList({ payload }, { call, put }) {
      const response = yield call(getproTypeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proType',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    /* 词汇字典 */
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getDicList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'status',
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
  },
  reducers: {
    tableChangeList(state, action) {
      return {
        ...state,
        tableList: action.payload.data,
      };
    },
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
    proType(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },
    status(state, action) {
      return {
        ...state,
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
  },
};

export default model;

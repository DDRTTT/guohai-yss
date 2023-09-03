import { message } from 'antd';
import {
  getTaskListAPI,
  getDictsAPI,
  getProTypeAPI,
  productEnum,
  commitBatchAPI,
  deleteTableAPI,
  revokeTableAPI
} from '@/services/productLiquidation';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'productLiquidation',
  state: {
    name: 'productLiquidation',
    dataSource: [],
    total: 0,
    loading: false,
    proTypeList: [],
    proType: '',
    proCode: '',
    moreOperationStatus: {},
    productDropList: [],
    dicts: {
      A002List: [],
      P001List: [],
      M002List: [],
      J006List: [],
      R001List: [],
      I009List: [],
      S001List: [],
      J004_2List: [],
    },
  },
  subscriptions: {},
  effects: {
    *getTaskList({ payload }, { call, put }) {
      yield put({
        type: 'updeteTableData',
        payload: {
          dataSource: [],
          total: 0,
          loading: true,
        },
      });
      const response = yield call(getTaskListAPI, payload);
      console.log('===请求表格数据--返回结果===');
      console.log(response.data);
      if (response && response.status===200) {
        yield put({
          type: 'updeteTableData',
          payload: {
            dataSource: response.data.rows,
            total: response.data.total,
            loading: false,
          },
        });
      }else{
        yield put({
          type: 'updeteTableData',
          payload: {
            dataSource: [],
            total: 0,
            loading: false,
          },
        });
        message.error(response.message);
      }
    },

    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response) {
        yield put({
          type: 'updateDicts',
          payload: {
            dicts: response.data,
          },
        });
      }
    },

    *getProTypeList({ payload }, { call, put }) {
      const response = yield call(getProTypeAPI);
      if (response) {
        yield put({
          type: 'updateProTypeList',
          payload: {
            data: response.data,
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

  },

  reducers: {
    updeteTableData(state, action) {
      return {
        ...state,
        dataSource: action.payload.dataSource,
        total: action.payload.total,
        loading: action.payload.loading,
      };
    },

    updateDicts(state, action) {
      const dicts = {
        A002List: action.payload.dicts.A002 ? action.payload.dicts.A002 : [],
        P001List: action.payload.dicts.P001 ? action.payload.dicts.P001 : [],
        M002List: action.payload.dicts.M002 ? action.payload.dicts.M002 : [],
        J006List: action.payload.dicts.J006 ? action.payload.dicts.J006 : [],
        R001List: action.payload.dicts.R001 ? action.payload.dicts.R001 : [],
        I009List: action.payload.dicts.R001 ? action.payload.dicts.I009 : [],
        S001List: action.payload.dicts.S001 ? action.payload.dicts.S001 : [],
        J004_2List: action.payload.dicts.J004_2 ? action.payload.dicts.J004_2 : [],
      };
      // 'A002' 产品类型, 'P001' 产品备案类型, 'M002' 运作方式, J006 管理人  'R001' 风险等级
      return {
        ...state,
        dicts,
      };
    },

    updateProTypeList(state, action) {
      // 'A002' 资产类型, 'P001' 产品备案类型, 'M002' 运作方式, J006 管理人  'R001' 风险等级
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },

    moreOperation(state, action) {
      // 'A002' 资产类型, 'P001' 产品备案类型, 'M002' 运作方式, J006 管理人  'R001' 风险等级
      return {
        ...state,
        moreOperationStatus: action.payload.data,
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

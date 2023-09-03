import { message } from 'antd';
import { getDictsAPI } from '@/services/productEnd';
import {
  getTaskList,
  getClient,
  productEnum,
  revoke,
  deleteTask,
  getBatchCommitApi,
} from '@/services/payExtract';
const model = {
  namespace: 'payExtract',
  state: {
    dataSource: {
      total: 0,
      rows: [],
    },
    dicts: {
      A002List: [], // 产品类型
      S001List: [], // 流程状态
      I009List: [], // 客户类型
      T005List: [], // 业务类型
    },
    clientDropList: [], // 委托人下来框
    productName: [], // 产品名称
  },
  effects: {
    *queryTableList({ payload }, { call, put }) {
      const response = yield call(getTaskList, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: {
            dataSource: response.data,
          },
        });
      } else {
        errorMessage();
      }
    },
    // 获取产品名称下拉框数据
    *getProductName({ payload }, { put, call }) {
      const response = yield call(productEnum, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateProductName',
          payload: {
            productName: response.data,
          },
        });
      }
    },
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload.codeList);
      if (response.status === 200) {
        yield put({
          type: 'updateDicts',
          payload: {
            dicts: response.data,
          },
        });
      }
    },
    *getClient({ payload }, { call, put }) {
      const response = yield call(getClient);
      if (response.status === 200) {
        console.log('response', response);
        yield put({
          type: 'updateClientDropList',
          payload: {
            clientDropList: response.data,
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
    *getBatchCommitReq({ payload }, { call, put }) {
      const response = yield call(getBatchCommitApi, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    // 产品全称action
    updateProductName(state, action) {
      return {
        ...state,
        productName: action.payload.productName,
      };
    },
    updateTableList(state, action) {
      return {
        ...state,
        dataSource: action.payload.dataSource,
      };
    },
    updateDicts(state, action) {
      const dicts = {
        A002List: action.payload.dicts.A002 ? action.payload.dicts.A002 : [],
        S001List: action.payload.dicts.S001 ? action.payload.dicts.S001 : [],
        I009List: action.payload.dicts.I009 ? action.payload.dicts.I009 : [],
        T005List: action.payload.dicts.T005 ? action.payload.dicts.T005 : [],
      };
      // 'A002' 资产类型, 'S001':流程状态
      return {
        ...state,
        dicts,
      };
    },
    updateClientDropList(state, action) {
      console.log('clientDropList', action.payload.clientDropList);
      return {
        ...state,
        clientDropList: action.payload.clientDropList,
      };
    },
  },
};
export default model;

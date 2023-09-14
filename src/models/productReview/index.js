import {
  submitForm,
  queryTableList,
  getDict,
  getProductType,
  productEnum,
  revoke,
  deleteTask,
  getInvestmentManagerDropList,
  getBatchSubmitByProCodeApi,
} from '@/services/productReview';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

const errorMessage = () => {
  message.error('查询失败');
};
export default {
  namespace: 'productReview',
  state: {
    taskListTable: {
      total: 0,
      rows: [],
    },
    dicts: {
      A002List: [],
      S001List: [],
    },
    proTypeDropList: [],
    productDropList: [],
    investmentManagerDropList: [],
  },
  effects: {
    *submitForm({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(submitForm, payload.params);
      if (response.status === 200) {
        message.success('提交成功');
        yield put({
          type: 'queryTableList',
        });
        yield put(routerRedux.push('./index'));
      } else {
        message.error('保存失败');
      }
    },
    *queryTableList({ payload,callback }, { call, put }) {
      const response = yield call(queryTableList, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: {
            taskListTable: response.data,
          },
        });
        callback&&callback();
      } else {
        errorMessage();
      }
    },
    *getDicts({ payload }, { call, put }) {
      const response = yield call(getDict, payload.codeList);
      if (response.status === 200) {
        yield put({
          type: 'updateDicts',
          payload: {
            dicts: response.data,
          },
        });
      }
    },
    *getProTypeDropList({ payload }, { call, put }) {
      const response = yield call(getProductType);
      if (response.status === 200) {
        yield put({
          type: 'updateProTypeDropList',
          payload: {
            proTypeDropList: response.data,
          },
        });
      }
    },
    *getProductDropList({ payload }, { call, put }) {
      const response = yield call(productEnum);
      if (response.status === 200) {
        yield put({
          type: 'updateProductDropList',
          payload: {
            productDropList: response.data,
          },
        });
      }
    },
    *getInvestmentManagerDropList({ payload }, { call, put }) {
      const response = yield call(getInvestmentManagerDropList);
      if (response.status === 200) {
        yield put({
          type: 'updateInvestmentManagerDropList',
          payload: {
            investmentManagerDropList: response.data,
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
    *getBatchSubmitByProCodeReq({ payload }, { call, put }) {
      const response = yield call(getBatchSubmitByProCodeApi, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    updateTableList(state, action) {
      return {
        ...state,
        taskListTable: action.payload.taskListTable,
      };
    },
    updateDicts(state, action) {
      const dicts = {
        A002List: action.payload.dicts.A002 ? action.payload.dicts.A002 : [],
        S001List: action.payload.dicts.S001 ? action.payload.dicts.S001 : [],
      };
      // 'A002' 资产类型, 'P001' 产品备案类型, 'M002' 运作方式, J006 管理人  'R001' 风险等级
      return {
        ...state,
        dicts,
      };
    },
    updateProTypeDropList(state, action) {
      return {
        ...state,
        proTypeDropList: action.payload.proTypeDropList,
      };
    },
    updateProductDropList(state, action) {
      return {
        ...state,
        productDropList: action.payload.productDropList,
      };
    },
    updateInvestmentManagerDropList(state, action) {
      return {
        ...state,
        investmentManagerDropList: action.payload.investmentManagerDropList,
      };
    },
  },
};

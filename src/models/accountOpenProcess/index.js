import { message } from 'antd';
import {
  getTableData,
  getProductList,
  getDictList,
  accountCommit,
  getRevokeAPI,
  deleteTask,
  getCommitBatchApi,
  getNodeListAPI
} from '@/services/accountOpenProcess';

const model = {
  namespace: 'accountOpenProcess',
  state: {
    tableList: [],
    // 账户类型
    accountTypeList: [],
    // 产品名称/产品代码
    productList: [],
    // 帐户状态
    accountStatusList: [],
    // 状态
    processStateList: [],
    // 任务节点下拉
    nodeList:[]
  },
  effects: {
    // 查询 任务节点下拉框
    *getNodeList({ payload }, { call, put }) {
      const response = yield call(getNodeListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateNodeList',
          payload: response,
        });
      }
    },
    // 查询 账户开户任务列表
    *queryTableData({ payload }, { call }) {
      const response = yield call(getTableData, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
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
        // message.error('查询失败');
      }
    },
    *accountCommit({ payload }, { call, put }) {
      const response = yield call(accountCommit, payload);
      if (response && response.status === 200) {
      } else {
        message.error('提交失败');
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
        // message.error('查询失败');
      }
    },
    *revoke({ payload, callback }, { call, put }) {
      const response = yield call(getRevokeAPI, payload);
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
    *getCommitBatch({ payload }, { call, put }) {
      const response = yield call(getCommitBatchApi, payload);
      if (response && response.status === 200) {
        return response;
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
    dictList(state, action) {
      return {
        ...state,
        accountTypeList: action.payload.data.A001,
        accountStatusList: action.payload.data.A003,
        processStateList: action.payload.data.S001,
      };
    },
    updateNodeList(state, action) {
      return {
        ...state,
        nodeList: action.payload.data,
      };
    },

  },
};

export default model;

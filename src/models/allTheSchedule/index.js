import { message } from 'antd';
import router from 'umi/router';
import {
  getTableDataList,
  getproTypeList,
  getAllProcessNameApi,
  getAllProductNameApi,
  getLinkRouterAPI,
  authUserInfoApi,
  circulateTaskBatchApi,
  circulateHistoryUsersApi,
} from '@/services/allTheSchedule';

const model = {
  namespace: 'allTheSchedule',
  state: {
    /* 表格列表 */
    tableList: [],
    processName: [],
    productName: [],
    authUserInfo: [],
    circulateHistoryUsers: [],
  },
  effects: {
    /* 查询列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 托管人查询
    *handlgetproTypeList({ payload }, { call, put }) {
      const response = yield call(getproTypeList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 流程类型
    *getAllProcessNameReq({ payload }, { put, call }) {
      const res = yield call(getAllProcessNameApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProcessName',
          payload: {
            processName: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 产品全称
    *getAllProductNameReq({ payload }, { put, call }) {
      const res = yield call(getAllProductNameApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProductName',
          payload: {
            productName: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 对办理和未提交进行筛选API
    *getLinkRouter({ payload }, { call, put }) {
      const res = yield call(getLinkRouterAPI, payload);

      if (res.status === 200) {
        yield put({
          type: 'saveLinkRouter',
          payload: res.data,
        });
        if (res.data) {
          router.push(res.data.url);
        }
      } else {
        message.warn(res.message);
      }
    },
    // 我发起  传阅下拉
    *authUserInfoReq({ payload }, { put, call }) {
      const res = yield call(authUserInfoApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateAuthUserInfo',
          payload: {
            authUserInfo: res.data.rows ? res.data.rows : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 我发起  传阅提交
    *circulateTaskBatchReq({ payload, callback }, { put, call }) {
      const res = yield call(circulateTaskBatchApi, payload);
      callback && callback(res);
    },
    // 我发起  已传阅
    *circulateHistoryUsersReq({ payload }, { put, call }) {
      const res = yield call(circulateHistoryUsersApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateCirculateHistoryUsers',
          payload: {
            circulateHistoryUsers: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
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
    updateProcessName(state, { payload }) {
      return {
        ...state,
        processName: payload.processName,
      };
    },
    updateProductName(state, { payload }) {
      return {
        ...state,
        productName: payload.productName,
      };
    },
    updateAuthUserInfo(state, { payload }) {
      return {
        ...state,
        authUserInfo: payload.authUserInfo,
      };
    },
    updateCirculateHistoryUsers(state, { payload }) {
      return {
        ...state,
        circulateHistoryUsers: payload.circulateHistoryUsers,
      };
    },
  },
};

export default model;

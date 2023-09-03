import {
  getProNameAndCodeAPI,
  getTableListAPI,
  getFileDetailsAPI,
  reqCheckUrl,
} from '@/services/quarterlyAssetReport/index';
import { message } from 'antd';

export default {
  namespace: 'quarterlyAssetReport',
  state: {
    proNameAndCodeData: [],
    tableList: [],
    total: 0,
    fileDetails: '',
  },

  effects: {
    // 方法:获取产品全称/代码下拉列表数据
    *getProNameAndCodeFunc({ }, { call, put }) {
      const response = yield call(getProNameAndCodeAPI);
      if (response && response.status === 200) {
        yield put({
          type: 'proNameAndCodeData',
          payload: response.data,
        });
      } else {
      }
    },

    // 方法:获取分页列表数据
    *getTableListFunc({ payload, callback }, { call, put }) {
      const response = yield call(getTableListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'tableList',
          payload: response.data.rows ? response.data.rows : [],
        });
        yield put({
          type: 'total',
          payload: response.data.total,
        });
        if (callback) callback(response.data);
      } else {
        yield put({
          type: 'tableList',
          payload: [],
        });
        yield put({
          type: 'total',
          payload: 0,
        });
        message.warning('列表数据获取异常 ! 错误信息 : ' + response.message);
      }
    },

    // 方法:获取分页列表数据
    *getFileDetailsFunc({ payload, callback }, { call, put }) {
      const response = yield call(getFileDetailsAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data.fileInfo);
      } else {
        if (callback) callback('');
        message.warning('文件数据获取异常 ! 错误信息 : ' + response.message);
      }
    },

    // 查看：确认跳转路径是否可用 
    *getCheckUrl({ payload }, { call, put }) {
      const response = yield call(reqCheckUrl, payload);
      return response;
    },

  },

  reducers: {
    proNameAndCodeData(state, { payload }) {
      return {
        ...state,
        proNameAndCodeData: payload,
      };
    },

    tableList(state, { payload }) {
      return {
        ...state,
        tableList: payload,
      };
    },

    total(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },

    fileDetails(state, { payload }) {
      return {
        ...state,
        fileDetails: payload,
      };
    },
  },
};

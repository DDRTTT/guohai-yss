import { message } from 'antd';
import {
  getTableListApi,
  getProCodeApi,
  getFileNameListApi,
  getProcodeInfoAPI,
} from '@/services/documentManagement';

const model = {
  namespace: 'documentManagement',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    proCode: [], // 项目编码
    fileName: [], // 文件名称
  },
  effects: {
    // 项目列表table
    *getQueryTableReq({ payload }, { call, put }) {
      const res = yield call(getTableListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: {
            tableList: res.data
              ? res.data
              : {
                  total: 0,
                  rows: [],
                },
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 项目编码
    *getProCodeReq({ payload }, { put, call }) {
      const res = yield call(getProCodeApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProCode',
          payload: {
            proCode: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取项目系列编码
    *getProcodeInfoReq({ payload }, { put, call }) {
      const res = yield call(getProcodeInfoAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProcodeInfo',
          payload: {
            data: res.data || [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 文件名称
    *getFileNameReq({ payload }, { put, call }) {
      const res = yield call(getFileNameListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileName',
          payload: {
            fileName: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    // 项目列表table action
    updateTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload.tableList,
      };
    },
    // 项目编码action
    updateProCode(state, { payload }) {
      return {
        ...state,
        proCode: payload.proCode,
      };
    },
    // 文件名称action
    updateFileName(state, { payload }) {
      return {
        ...state,
        fileName: payload.fileName,
      };
    },
    // 项目或系列编码action
    updateProcodeInfo(state, { payload }) {
      return {
        ...state,
        proCode: payload.data,
      };
    },
  },
};

export default model;

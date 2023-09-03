import { message } from 'antd';
import {
  getTAwpLogListApi,
  getOptObjApi,
  getProjectBaseInfoDetailApi,
  getPersonApi,
} from '@/services/manuscriptChangeLogDetail';

const model = {
  namespace: 'manuscriptChangeLogDetail',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    operObject: [], // 操作对象
    baseInfo: {}, // 基础信息
    personList: [], // 操作人列表
  },
  effects: {
    // 查询table API
    *getQueryTableReq({ payload }, { call, put }) {
      const res = yield call(getTAwpLogListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: res.data || {},
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取详情基本信息
    *getProjectBaseInfoDetailReq({ payload }, { put, call }) {
      const res = yield call(getProjectBaseInfoDetailApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateBaseInfo',
          payload: {
            baseInfo: res.data || {},
          },
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取操作对象
    *getOptObjReq({ payload }, { put, call }) {
      const res = yield call(getOptObjApi, payload);
      yield put({
        type: 'updateOperObject',
        payload: {
          operObject: res.data || [],
        },
      });
    },
    // 操作人列表接口
    *getPersonReq({ payload }, { put, call }) {
      const res = yield call(getPersonApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updatePersonList',
          payload: {
            personList: res.data || [],
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    // 项目信息table action
    updateTableList(state, action) {
      return {
        ...state,
        tableList: action.payload,
      };
    },
    // 操作对象action
    updateOperObject(state, { payload }) {
      return {
        ...state,
        operObject: payload.operObject,
      };
    },
    // 基础信息action
    updateBaseInfo(state, { payload }) {
      return {
        ...state,
        baseInfo: payload.baseInfo,
      };
    },
    // 操作人action
    updatePersonList(state, { payload }) {
      return {
        ...state,
        personList: payload.personList,
      };
    },
  },
};

export default model;

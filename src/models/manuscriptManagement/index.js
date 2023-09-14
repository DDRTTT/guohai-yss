import { message } from 'antd';
import {
  getDicsByFcodeApi,
  getProjectBaseInfoApi,
  getProjectInfoListApi,
  submitWpDictDeliverApi,
  submitWpItemUpdateApi,
  submitFileApi,
  submitWpDictDeliverOosApi,
  submitWpFileUploadWithoutDictApi,
  getProcodeInfoAPI,
} from '@/services/manuscriptManagement';

const model = {
  namespace: 'manuscriptManagement',
  state: {
    tableList: {
      total: 0,
      rows: [],
    },
    proCode: [], // 项目编码
    awpProType: [], // 项目类型字典
    proDept: [], // 所属部门
  },
  effects: {
    // 查询项目基本信息列表API
    *getQueryTableReq({ payload }, { call, put }) {
      const res = yield call(getProjectInfoListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTableList',
          payload: res.data
            ? res.data
            : {
                total: 0,
                rows: [],
              },
        });
      } else {
        message.error(res.message);
      }
    },
    // 获取项目类型字典
    *getDictsReq({ payload }, { put, call }) {
      const res = yield call(getDicsByFcodeApi, payload);
      yield put({
        type: 'updateAwpProType',
        payload: {
          awpProType: res ? res : [],
        },
      });
    },
    // 获取项目基本信息接口
    *getProjectBaseInfoReq({ payload }, { put, call }) {
      const res = yield call(getProjectBaseInfoApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateProjectBaseInfo',
          payload: {
            projectBaseInfo: res.data ? res.data : [],
            ...payload,
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
    // 目录报送
    *submitWpDictDeliverReq({ payload, callback }, { put, call }) {
      const res = yield call(submitWpDictDeliverApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },
    // 人员报送
    *submitWpItemUpdateReq({ payload, callback }, { put, call }) {
      const res = yield call(submitWpItemUpdateApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },
    // 文件报送提交文件
    *submitFileReq({ payload, callback }, { call, put }) {
      const res = yield call(submitFileApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },
    // 底稿范围外项目报送
    *submitWpDictDeliverOosReq({ payload, callback }, { call, put }) {
      const res = yield call(submitWpDictDeliverOosApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },
    // 底稿范围外文件报送
    *submitWpFileUploadWithoutDictReq({ payload, callback }, { call, put }) {
      const res = yield call(submitWpFileUploadWithoutDictApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
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
    // 项目类型action
    updateAwpProType(state, { payload }) {
      return {
        ...state,
        awpProType: payload.awpProType,
      };
    },
    // 项目基本信息action
    updateProjectBaseInfo(state, { payload }) {
      // type:1项目编码;2所属部门
      const projectBaseInfoKey = payload.type === 1 ? 'proCode' : 'proDept';
      return {
        ...state,
        [projectBaseInfoKey]: payload.projectBaseInfo,
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

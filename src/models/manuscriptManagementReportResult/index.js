import { message } from 'antd';
import {
  getDicsByFcodeApi,
  getProjectBaseInfoApi,
  getTableLogsMasterApi,
  getTableLogsSubApi,
} from '@/services/manuscriptManagementReportResult';
import { cloneDeep } from 'lodash';

const model = {
  namespace: 'manuscriptManagementReportResult',
  state: {
    masterTableList: {
      total: 0,
      rows: [],
    }, // 主表格数据
    allSubTableListObj: {}, // 子表格对象集
    proCode: [], // 项目编码
    awpProType: [], // 项目类型字典
    logsType: [
      {
        code: '1',
        name: '项目报送',
      },
      {
        code: '2',
        name: '文件报送',
      },
      {
        code: '3',
        name: '底稿范围外项目报送',
      },
      {
        code: '4',
        name: '底稿范围外文件报送',
      },
    ], // 报送类型
  },
  effects: {
    // 获取主表格table
    *getTableLogsMasterReq({ payload, callback }, { call, put }) {
      const res = yield call(getTableLogsMasterApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateMasterTableList',
          payload: res.data
            ? res.data
            : {
                total: 0,
                rows: [],
              },
        });
        callback && callback();
      } else {
        message.error(res.message);
      }
    },

    // 获取子表格table
    *getTableLogsSubReq({ payload }, { call, put }) {
      const { proCode, batchNumber, logsType } = payload;
      if (logsType !== 2) {
        yield put({
          type: 'updateSubTableList',
          payload: {
            batchNumber,
            data: [],
          },
        });
      } else {
        const res = yield call(getTableLogsSubApi, { proCode, batchNumber });
        if (res && res.status === 200) {
          yield put({
            type: 'updateSubTableList',
            payload: {
              batchNumber,
              data: res.data,
            },
          });
        } else {
          message.error(res.message);
        }
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
  },
  reducers: {
    // 主表格action
    updateMasterTableList(state, { payload }) {
      return {
        ...state,
        masterTableList: payload,
      };
    },
    // 子表格action
    updateSubTableList(state, { payload }) {
      const { batchNumber, data } = payload;
      const { allSubTableListObj } = state;
      return {
        ...state,
        allSubTableListObj: {
          ...allSubTableListObj,
          [`batchNumber_${batchNumber}`]: data,
        },
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
      return {
        ...state,
        proCode: payload.projectBaseInfo,
      };
    },
  },
};

export default model;

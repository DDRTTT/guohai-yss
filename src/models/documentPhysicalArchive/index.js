import { message } from 'antd';
import {
  getSysTreeApi,
  getFileHistoryApi,
  getCurrentNodeIdByProcessIdsApi,
  getFileListApi,
  getFileCommitApi,
  getFileHandleApi,
  getRealTimeSaveApi,
  getTaskQueryProcessIdApi,
  getBatchRevokeApi,
} from '@/services/documentPhysicalArchive';
import { cloneDeep } from 'lodash';

// 左侧树增处理后台返回数据字段名
function handleNewTreeData(data) {
  data.forEach(item => {
    item.key = item.code;
    item.value = item.code;
    item.title = item.name;
    if (item.children) {
      handleNewTreeData(item.children);
    }
  });
  return data;
}

const model = {
  namespace: 'documentPhysicalArchive',
  state: {
    saveTreeData: [], // 左侧树
    tableList: {
      total: 0,
      rows: [],
    },
    fileHistory: [],
  },
  effects: {
    // 获取左侧目录树
    *getSysTreeReq({ payload }, { call, put }) {
      const res = yield call(getSysTreeApi, payload);
      if (res && res.status === 200) {
        const newData = res.data ? handleNewTreeData(cloneDeep(res.data)) : [];
        yield put({
          type: 'updateSysTree',
          payload: {
            saveTreeData: newData,
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 获取已归档文件列表
    *getFileListReq({ payload, callback }, { call, put }) {
      const res = yield call(getFileListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileList',
          payload: {
            tableList: res.data
              ? res.data
              : {
                  total: 0,
                  rows: [],
                },
          },
        });

        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 获取历史记录
    *getFileHistoryReq({ payload }, { put, call }) {
      const res = yield call(getFileHistoryApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileHistory',
          payload: {
            fileHistory: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 获取流转历史所需的taskId
    *getCurrentNodeIdByProcessIdsReq({ payload, callback }, { call, put }) {
      const res = yield call(getCurrentNodeIdByProcessIdsApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 根据流程实例Id获取任务
    *getTaskQueryProcessIdReq({ payload, callback }, { call, put }) {
      const res = yield call(getTaskQueryProcessIdApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 归档文件入库提交
    *getFileCommitReq({ payload, callback }, { call, put }) {
      const res = yield call(getFileCommitApi, payload);
      callback && callback(res);
    },

    // 审核、录入档案盒号
    *getFileHandleReq({ payload, callback }, { call, put }) {
      const res = yield call(getFileHandleApi, payload);
      callback && callback(res);
    },

    // 档案盒号实时录入
    *getRealTimeSaveReq({ payload, callback }, { call, put }) {
      const res = yield call(getRealTimeSaveApi, payload);
      callback && callback(res);
    },

    // 撤销
    *getBatchRevokeReq({ payload, callback }, { call, put }) {
      const res = yield call(getBatchRevokeApi, payload);
      callback && callback(res);
    },
  },
  reducers: {
    updateSysTree(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload.saveTreeData,
      };
    },

    updateFileList(state, { payload }) {
      return {
        ...state,
        tableList: payload.tableList,
      };
    },

    updateFileHistory(state, { payload }) {
      return {
        ...state,
        fileHistory: payload.fileHistory,
      };
    },
  },
};

export default model;

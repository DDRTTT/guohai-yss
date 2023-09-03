import { message } from 'antd';
import {
  getFileHistoryApi,
  getUpdatePathApi,
  getFileUpdateApi,
  getUpdateCommitApi,
  getFileNameListApi,
  getFileListAbleSortApi,
  getTaskNameListApi,
  getCheckFilePathMoveApi,
  getFileDeleteApi,
  getFileTipsApi,
} from '@/services/documentManagementDetail';

const model = {
  namespace: 'documentManagementDetail',
  state: {
    fileHistory: [],
    fileNameList: [],
    tableList: {
      total: 0,
      rows: [],
    },
    taskNameList: [],
  },
  effects: {
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

    *getUpdatePathReq({ payload, callback }, { call, put }) {
      const res = yield call(getUpdatePathApi, payload);
      if (res && res.status === 200) {
        message.success(res.message);
        if (callback) {
          callback(res);
        }
      } else {
        message.error(res.message);
      }
    },

    *getCheckFilePathMoveReq({ payload, callback }, { call, put }) {
      const res = yield call(getCheckFilePathMoveApi, payload);
      if (res && res.status === 200) {
        if (callback) {
          callback(res);
        }
      } else {
        message.error(res.message);
      }
    },

    // 删除待提交的文件
    *getFileUpdateReq({ payload, callback }, { call }) {
      const res = yield call(getFileUpdateApi, payload);
      if (res && res.status === 200) {
        callback(res);
      } else {
        message.error(res.message);
      }
    },

    // 提交
    *getUpdateCommitReq({ payload }, { call }) {
      const res = yield call(getUpdateCommitApi, payload);
      return res;
    },

    // 获取文件名称列表下拉
    *getFileNameListReq({ payload }, { call, put }) {
      const res = yield call(getFileNameListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateFileNameList',
          payload: {
            fileNameList: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 获取全部文件列表，或者根据左侧选择目录查询文件列表支持排序
    *handleQueryTableReq({ payload }, { call, put }) {
      const res = yield call(getFileListAbleSortApi, payload);
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

    *getTaskNameListReq({ payload }, { call, put }) {
      const res = yield call(getTaskNameListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTaskNameList',
          payload: {
            taskNameList: res.data || [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    *getFileDeleteReq({ payload }, { call }) {
      const res = yield call(getFileDeleteApi, payload);
      return res;
    },

    *getFileTips({ payload }, { call }) {
      const res = yield call(getFileTipsApi, payload);
      if (res && res.status === 200) {
        return res.data;
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    // 项目列表table action
    updateFileHistory(state, { payload }) {
      return {
        ...state,
        fileHistory: payload.fileHistory,
      };
    },
    // 文件名称下拉
    updateFileNameList(state, { payload }) {
      return {
        ...state,
        fileNameList: payload.fileNameList,
      };
    },

    // 文件列表action
    updateTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload.tableList,
      };
    },

    updateTaskNameList(state, { payload }) {
      return {
        ...state,
        taskNameList: payload.taskNameList,
      };
    },
  },
};

export default model;

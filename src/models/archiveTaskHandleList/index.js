import { message } from 'antd';
import {
  getProCodeApi,
  getDicsByFcodeApi,
  getTaskNameApi,
  getTableListApi,
  getCommitByIdApi,
  getDeleteApi,
  getFileDownLoadApi,
  getConventionalEndApi,
  getTaskRevokeApi,
  getFileSizeApi,
  getDeleteRecordApi,
  getCheckedUseSealFileApi,
  getFileDeleteBatchRevokeApi,
} from '@/services/archiveTaskHandleList';
import { getNginxIP } from '@/services/global';

const appendJs = src => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.setAttribute('src', src);
  head.appendChild(script);
};

const model = {
  namespace: 'archiveTaskHandleList',
  state: {
    tableList: {
      total: 0,
      rows: [],
    }, // 表格数据
    proCode: [], // 项目编码
    taskType: [], // 任务类型
    taskName: [], // 任务名称
    saveIP: {},
    deleteRecordList: {
      total: 0,
      rows: [],
    },
  },
  effects: {
    // table表格
    *getTableListReq({ payload, callback }, { call, put }) {
      const res = yield call(getTableListApi, payload);
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
        if (typeof callback === 'function') {
          callback();
        }
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

    // 任务类型
    *getAwpTaskTypeReq({ }, { put, call }) {
      const res = yield call(getDicsByFcodeApi, { fcode: 'awp_task_type' });
      yield put({
        type: 'updateTaskType',
        payload: {
          taskType: res ? res : [],
        },
      });
    },

    // 任务名称
    *getTaskNameReq({ payload }, { call, put }) {
      const res = yield call(getTaskNameApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateTaskName',
          payload: {
            taskName: res.data ? res.data : [],
          },
        });
      } else {
        message.error(res.message);
      }
    },

    // 任务列表提交
    *getCommitByIdReq({ payload, callback }, { call }) {
      const res = yield call(getCommitByIdApi, payload);
      if (res && res.status === 200) {
        message.success('提交成功~');
        if (typeof callback === 'function') {
          callback(res);
        }
      } else {
        message.error(res.message);
      }
    },

    // 任务列表删除
    *getDeleteReq({ payload, callback }, { call }) {
      const res = yield call(getDeleteApi, payload);
      if (res && res.status === 200) {
        message.success('删除成功~');
        if (typeof callback === 'function') {
          callback(res);
        }
      } else {
        message.error(res.message);
      }
    },

    // 文件下载
    *getFileDownLoadReq({ payload }, { call }) {
      yield call(getFileDownLoadApi, payload);
    },

    // 结束任务
    *getConventionalEndReq({ payload, callback }, { call }) {
      const res = yield call(getConventionalEndApi, payload);
      if (res && res.status === 200) {
        message.success(res.data);
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        message.error(res.message);
      }
    },

    // 任务撤销
    *getTaskRevokeReq({ payload, callback }, { call }) {
      const res = yield call(getTaskRevokeApi, payload);
      if (res && res.status === 200) {
        message.success('任务撤销成功~');
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        message.error(res.message);
      }
    },

    // 获取文件数量（判断是否可以完成任务）
    *getFileSizeReq({ payload, callback }, { call }) {
      const res = yield call(getFileSizeApi, payload);
      if (res && res.status === 200) {
        if (typeof callback === 'function') {
          callback(res);
        }
      } else {
        message.error(res.message);
      }
    },

    // 获取IP
    *handleGetNginxIP({ payload }, { call, put }) {
      const res = yield call(getNginxIP, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveIP',
          payload: res.data,
        });
        appendJs(res.data.jsApi);
      }
    },

    *getDeleteRecordReq({ payload }, { call, put }) {
      const res = yield call(getDeleteRecordApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateDeleteRecordList',
          payload: {
            deleteRecordList: res.data
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

    *getCheckedUseSealFileReq({ payload }, { call }) {
      const res = yield call(getCheckedUseSealFileApi, payload);
      if (res && res.status === 200) {
        return res;
      } else {
        message.error(res.message);
      }
    },

    *getFileDeleteBatchRevokeReq({ payload, callback }, { call }) {
      const res = yield call(getFileDeleteBatchRevokeApi, payload);
      if (res && res.status === 200) {
        message.success('文件删除任务撤销成功~');
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        message.error(res.message);
      }
    }
  },

  reducers: {
    updateTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload,
      };
    },

    updateProCode(state, { payload }) {
      return {
        ...state,
        proCode: payload.proCode,
      };
    },

    updateTaskType(state, { payload }) {
      return {
        ...state,
        taskType: payload.taskType,
      };
    },

    updateTaskName(state, { payload }) {
      return {
        ...state,
        taskName: payload.taskName,
      };
    },

    saveIP(state, { payload }) {
      return {
        ...state,
        saveIP: payload,
      };
    },

    updateDeleteRecordList(state, { payload }) {
      return {
        ...state,
        deleteRecordList: payload.deleteRecordList,
      };
    },
  },
};

export default model;

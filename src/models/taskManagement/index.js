import {
  getTaskListAPI,
  getTaskCodeAPI,
  getproStageAPI,
  getproNameAPI,
  getDetailAPI,
  getDateAPI,
  getTaskNameAPI,
  onSaveAPI,
  onSubmitAPI,
  listSubmitAPI,
  getChildrenListAPI,
  deleteAPI,
  getSysTreeReqAPI,
  auditAndDeAuditAPI,
  autoMaticAPI,
  getFileDownLoadApi,
  taskEndApi,
  taskCommenEndApi,
  getOpinionApi,
  getProTypeAPI,
  getProAreaAPI,
} from '@/services/taskManagement';

import { cloneDeep } from 'lodash';

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

const GlobalModel = {
  namespace: 'taskManagement',
  state: {
    collapsed: false,
    list: [],
    total: 0,
    taskTypeCode: [],
    proStage: [],
    proName: [],
    data: [],
    taskName: [],
    treeList: [],
    tableList: {
      total: 0,
      rows: [],
    },
    proType: [],
    proArea: [],
    loading: false,
  },
  effects: {
    *getTaskList({ payload }, { call, put }) {
      yield put({
        type: 'updateTableData',
        payload: {
          loading: true,
        },
      });
      const response = yield call(getTaskListAPI, payload);
      const taskTypeCode = yield call(getTaskCodeAPI, payload);
      const taskName = yield call(getTaskNameAPI, payload);
      const proName = yield call(getproNameAPI, payload);
      if (response) {
        yield put({
          type: 'updateTableData',
          payload: {
            list: response.data.rows,
            total: response.data.total,
            taskTypeCode: taskTypeCode,
            taskName: taskName,
            proName: proName.data,
            loading: false,
          },
        });
      }
    },
    *getCode({ payload }, { call, put }) {
      // const proName = yield call(getproNameAPI, payload);
      const taskTypeCode = yield call(getTaskCodeAPI, payload);
      const proStage = yield call(getproStageAPI, payload);
      if (taskTypeCode) {
        yield put({
          type: 'taskType',
          payload: {
            taskTypeCode: taskTypeCode,
            proStage: proStage,
            // proName: proName.data,
          },
        });
      }
    },
    *getproName({ payload }, { call, put }) {
      const response = yield call(getproNameAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateProName',
          payload: {
            proName: response.data,
          },
        });
        return response;
      }
    },
    // 获取任务名称
    *getDate({ payload, callback }, { call, put }) {
      const data = yield call(getDateAPI, payload);
      if (callback) {
        callback(data.data);
      }
    }, // 获取所有回显数据、详情
    *getDetail({ payload, callback }, { call, put }) {
      const detail = yield call(getDetailAPI, payload);
      const proType = yield call(getProTypeAPI, payload);
      const proArea = yield call(getProAreaAPI, payload);
      if (callback) {
        callback(detail.data);
      }
      if (proType) {
        yield put({
          type: 'getProType',
          payload: {
            proType: proType,
            proArea: proArea,
          },
        });
      }
    },
    // 获取任务名称
    *getTaskName({ payload, callback }, { call, put }) {
      const data = yield call(getTaskNameAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 保存
    *save({ payload, callback }, { call, put }) {
      const data = yield call(onSaveAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 提交
    *submit({ payload, callback }, { call, put }) {
      const data = yield call(onSubmitAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 列表提交
    *listSubmit({ payload, callback }, { call, put }) {
      const data = yield call(listSubmitAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 获取子列表
    *getChildrenList({ payload, callback }, { call, put }) {
      const data = yield call(getChildrenListAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 删除（支持批量）
    *batchDelete({ payload, callback }, { call, put }) {
      const data = yield call(deleteAPI, payload);
      if (callback) {
        callback(data);
      }
    },
    // 获取项目树
    *getSysTreeReq({ payload }, { call, put }) {
      const response = yield call(getSysTreeReqAPI, payload);
      let data = cloneDeep(response.data);
      const newData = handleNewTreeData(data);
      yield put({
        type: 'getTree',
        payload: newData,
      });
    },
    // 审核与反审核
    *auditAndDeAudit({ payload, callback }, { call, put }) {
      const response = yield call(auditAndDeAuditAPI, payload);
      if (callback) {
        callback(response);
      }
    },
    // 底稿归档任务办理列表提交
    *autoMatic({ payload, callback }, { call, put }) {
      const response = yield call(autoMaticAPI, payload);
      if (callback) {
        callback(response);
      }
    },
    // 文件下载
    *getFileDownLoadReq({ payload, callback }, { call, put }) {
      yield call(getFileDownLoadApi, payload);
    },
    // 归档任务完成
    *taskEnd({ payload, callback }, { call, put }) {
      const response = yield call(taskEndApi, payload);
      if (callback) {
        callback(response);
      }
    },
    // 常规任务完成
    *taskCommenEnd({ payload, callback }, { call, put }) {
      const response = yield call(taskCommenEndApi, payload);
      if (callback) {
        callback(response);
      }
    },
    // 获取审核意见
    *getOpinion({ payload, callback }, { call, put }) {
      const response = yield call(getOpinionApi, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    updateTableData(state, action) {
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total,
        taskName: action.payload.taskName,
        taskTypeCode: action.payload.taskTypeCode,
        proName: action.payload.proName,
        loading: action.payload.loading,
      };
    },
    taskType(state, action) {
      return {
        ...state,
        taskTypeCode: action.payload.taskTypeCode,
        proStage: action.payload.proStage,
        proName: action.payload.proName,
      };
    },
    updateProName(state, action) {
      return {
        ...state,
        proName: action.payload.proName,
      };
    },
    getTree(state, action) {
      return {
        ...state,
        treeList: action.payload,
      };
    },
    getProType(state, action) {
      return {
        ...state,
        proType: action.payload.proType,
        proArea: action.payload.proArea,
      };
    },
  },
  subscriptions: {},
};
export default GlobalModel;

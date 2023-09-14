import { message } from 'antd';
import router from 'umi/router';
import {
  DATA_DICTIONARY_API,
  GET_SYS_USER_INFO_API,
  GET_USER_SYSID_API,
  getHandledTasksAPI,
  getInitiatedTasksAPI,
  getLinkRouterAPI,
  getParticipateTasksAPI,
  getProductCenterFlowIdAPI,
  getTodoTasksAPI,
  getTransmitTasksAPI,
} from '@/services/workSpace';

const workSpace = {
  namespace: 'workSpace',

  state: {
    saveTodoTasks: {
      taskInstances: [],
      total: 0,
    },
    saveParticipateTasks: {
      taskInstances: [],
      total: 0,
    },
    saveInitiatedTasks: {
      taskInstances: [],
      total: 0,
    },
    saveHandledTasks: {
      taskInstances: [],
      total: 0,
    },
    saveTransmitTasks: {
      taskInstances: [],
      total: 0,
    },
    saveProductCenterFlowId: [],
    GET_USER_SYSID: '',
    SAVE_DATA_DICTIONARY: {},
  },

  effects: {
    // 我待办的任务:根据用户Id获取任务(分页)  获取用户待办的任务
    *getTodoTasks({ payload }, { call, put }) {
      const res = yield call(getTodoTasksAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveTodoTasks',
          payload: res.data,
        });
      } else {
        // message.warn(res.message);
      }
    },

    // 我参与的任务：获取指定用户的已经办流程的任务(分页)
    *getParticipateTasks({ payload }, { call, put }) {
      const res = yield call(getParticipateTasksAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveParticipateTasks',
          payload: res.data,
        });
      } else {
        // message.warn(res.message);
      }
    },

    // 我发起的任务：获取指定发起人或发起组的任务(分页)
    *getInitiatedTasks({ payload }, { call, put }) {
      const res = yield call(getInitiatedTasksAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveInitiatedTasks',
          payload: res.data,
        });
      } else {
        // message.warn(res.message);
      }
    },

    // 我已办理的任务：获取已办理的任务(分页)
    *getHandledTasks({ payload }, { call, put }) {
      const res = yield call(getHandledTasksAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveHandledTasks',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 我传阅的任务：获取传阅的任务(分页)
    *getTransmitTasks({ payload }, { call, put }) {
      const res = yield call(getTransmitTasksAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveTransmitTasks',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 获取非底稿任务流程
    *getProductCenterFlowId({ payload }, { call, put }) {
      const res = yield call(getProductCenterFlowIdAPI, payload);
      if (res.status === 200) {
        yield put({
          type: 'saveProductCenterFlowId',
          payload: res.data,
        });
      } else {
        // message.warn(res.message);
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

    // 获取系统词汇
    *DATA_DICTIONARY_FETCH({ payload }, { call, put }) {
      const res = yield call(DATA_DICTIONARY_API, payload);
      if (res && res.status === 200 && res.data) {
        let { data } = res;
        yield put({
          type: 'SAVE_DATA_DICTIONARY',
          payload: data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 获取用户拥有的系统
    *GET_USER_SYSID_FETCH({ payload }, { call, put }) {
      const res = yield call(GET_USER_SYSID_API, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'SAVE_GET_USER_SYSID',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 根据用户的sysId查询对应系统的映射信息
    *GET_SYS_USER_INFO_FETCH({ payload }, { call }) {
      const res = yield call(GET_SYS_USER_INFO_API, payload);
      if (res && res.data && res.status === 200) {
        return res.data;
      } else {
        message.warn(res.message);
      }
    },
  },

  reducers: {
    saveTodoTasks(state, { payload }) {
      return {
        ...state,
        saveTodoTasks: payload,
      };
    },
    saveParticipateTasks(state, { payload }) {
      return {
        ...state,
        saveParticipateTasks: payload,
      };
    },
    saveInitiatedTasks(state, { payload }) {
      return {
        ...state,
        saveInitiatedTasks: payload,
      };
    },
    saveProductCenterFlowId(state, { payload }) {
      return {
        ...state,
        saveProductCenterFlowId: payload,
      };
    },
    saveHandledTasks(state, { payload }) {
      return {
        ...state,
        saveHandledTasks: payload,
      };
    },
    saveTransmitTasks(state, { payload }) {
      return {
        ...state,
        saveTransmitTasks: payload,
      };
    },
    SAVE_GET_USER_SYSID(state, { payload }) {
      return {
        ...state,
        GET_USER_SYSID: payload,
      };
    },
    SAVE_DATA_DICTIONARY(state, { payload }) {
      return {
        ...state,
        SAVE_DATA_DICTIONARY: payload,
      };
    },
  },
};

export default workSpace;

import {
  getAllStages,
  getStageCell,
  proStageTask,
  proTypeAndCode,
} from '@/services/processLibraryGuide/index';
import { message } from 'antd';

export default {
  namespace: 'processLibraryGuide',
  state: {
    // 流程数据
    phaseData: [],
    // 阶段数据
    stageList: [],
    // 阶段待办任务
    proStageTaskList: [],
    // 详细的任务和结点
    proTypeAndCodeList: [],
  },
  reducers: {
    // 设置流程数据
    setPhaseData(state, { payload }) {
      return {
        ...state,
        phaseData: payload,
      };
    },
    // 设置阶段数据
    setStageList(state, { payload }) {
      return {
        ...state,
        stageList: payload,
      };
    },
    // 设置阶段待办任务
    setProStageTask(state, { payload }) {
      return {
        ...state,
        proStageTaskList: payload,
      };
    },
    // 设置详细的结点
    setProTypeAndCode(state, { payload }) {
      return {
        ...state,
        proTypeAndCodeList: payload,
      };
    },
  },
  effects: {
    /**
     * 获取流程的数据
     */
    *getPhaseData({ payload }, { put, call }) {
      const res = yield call(getStageCell, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setPhaseData',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取阶段的数据
     */
    *getStageList({ payload }, { put, call }) {
      const res = yield call(getAllStages, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setStageList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取阶段待办任务
     */
    *getProStageTask({ payload }, { put, call }) {
      const res = yield call(proStageTask, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProStageTask',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取详细的待办任务
     */
    *getProTypeAndCode({ payload }, { put, call }) {
      const res = yield call(proTypeAndCode, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProTypeAndCode',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
  },
};

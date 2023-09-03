import { message } from 'antd';
import { getTaskApi, getProjectApi, getListApi } from '@/services/documentFileDeleteLog';
import { getSeriesNameAPI } from '@/services/seriesManage';

const model = {
  namespace: 'documentFileDeleteLog',
  state: {
    taksList: [],
    seriesList: [],
    projectList: [],
    list: [],
  },
  effects: {
    // 文件列表任务名称下拉
    *getTask({ payload }, { call, put }) {
      const res = yield call(getTaskApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTask',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    //
    *getSeriesName({ payload }, { call, put }) {
      const res = yield call(getSeriesNameAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setSeriesName',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    // 文件列表项目名称下拉
    *getProject({ payload }, { call, put }) {
      const res = yield call(getProjectApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProject',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    // 文件列表
    *getList({ payload }, { call, put }) {
      const res = yield call(getListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    setTask(state, { payload }) {
      return {
        ...state,
        taksList: payload,
      };
    },
    setSeriesName(state, { payload }) {
      return {
        ...state,
        seriesList: payload,
      };
    },
    setProject(state, { payload }) {
      return {
        ...state,
        projectList: payload,
      };
    },
    setList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};

export default model;

import {
  handleGetTreeAPI,
  handleGetListAPI,
  handleGetRecordListAPI,
  handleGetVersionListAPI,
  handleGetPersonalTreeAPI,
  handlesaveTagsListAPI,
} from '@/services/lifeCyclePRD';
import { handleSelectPersonalFileAPI, handleGetPersonAPI } from '@/services/personalPRD';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

function handleNewTreeData(data) {
  data.forEach(item => {
    let temp = item.id || item.key;
    item.title = item.name || item.value;
    item.value = temp;
    if (item.children) {
      handleNewTreeData(item.children);
    }
  });
  return data;
}
export default {
  namespace: 'personalPRD',
  state: {
    saveListFetch: {
      total: 0,
      fileInfoList: [],
    },
    saveTreeData: [],
    savePersonalTreeData: [],
    saveRecordList: [],
    saveVersionData: [],
  },

  effects: {
    // 所有信息
    *handleGetListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 文档版本列表信息
    *handleGetVersionListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetVersionListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveVersionData',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 流转历史信息
    *handleGetRecordListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetRecordListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveRecordList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 生命周期树形
    *handleGetTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          const data = cloneDeep(response.data);
          newData = handleNewTreeData(data);
        }
        yield put({
          type: 'saveTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },
    // 个性化树形
    *handleGetPersonalTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetPersonalTreeAPI, payload);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          const data = cloneDeep(response.data);
          newData = handleNewTreeData(data);
        }
        yield put({
          type: 'savePersonalTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 同步个人管理--保存
    *handleSaveTagsListMsg({ payload }, { call, put }) {
      const response = yield call(handlesaveTagsListAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
      } else {
        message.warn(response.message);
      }
      return flag;
    },
  },

  reducers: {
    saveTreeData(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload,
      };
    },
    savePersonalTreeData(state, { payload }) {
      return {
        ...state,
        savePersonalTreeData: payload,
      };
    },
    saveListFetch(state, { payload }) {
      return {
        ...state,
        saveListFetch: payload,
      };
    },
    saveVersionData(state, { payload }) {
      return {
        ...state,
        saveVersionData: payload,
      };
    },
    saveRecordList(state, { payload }) {
      return {
        ...state,
        saveRecordList: payload,
      };
    },
  },
};

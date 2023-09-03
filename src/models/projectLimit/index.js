import { handleGetListAPI, handleGetTreeAPI } from '@/services/projectLimit';
import { message } from 'antd';
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

function handleNewData(data) {
  data.forEach(item => {
    item.key = item.code;
    item.value = item.code;
    item.title = item.name;
  });
  return data;
}

export default {
  namespace: 'projectLimit',
  state: {
    saveList: [],
    saveTreeData: [],
  },

  effects: {
    // 项目列表
    *handleGetListInfo({ payload }, { call, put }) {
      const response = yield call(handleGetListAPI, payload);
      const data = cloneDeep(response.data);
      const newData = handleNewData(data);
      if (response && response.status === 200) {
        yield put({
          type: 'saveList',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 生命周期树形, 包含全部目录+不适用目录
    *handleGetTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);
      const data = cloneDeep(response.data);

      if (response && response.status === 200) {
        if (!data) {
          yield put({
            type: 'saveTreeData',
            payload: [],
          });
          return;
        }
        const newData = handleNewTreeData(data);
        yield put({
          type: 'saveTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        saveList: payload,
      };
    },
    saveTreeData(state, { payload }) {
      return {
        ...state,
        saveTreeData: payload,
      };
    },
  },
};

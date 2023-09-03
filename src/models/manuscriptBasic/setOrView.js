import {
  handleGetTreeAPI,
  handleAddTreeAPI,
  handleDeleteTreeAPI,
  handleWordDictionaryFetchAPI,
} from '@/services/manuscriptBasic/setOrView';
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
export default {
  namespace: 'manuscriptBasicSov',
  state: {
    saveTreeData: [],
    saveWordDictionaryFetch: [],
  },

  effects: {
    // 生命周期树形, 包含全部目录
    *handleGetTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);

      if (response && response.status === 200) {
        if (!response.data || !response.data.children) {
          yield put({
            type: 'saveTreeData',
            payload: [],
          });
          return;
        }
        const data = cloneDeep(response.data.children);
        const newData = handleNewTreeData(data);
        yield put({
          type: 'saveTreeData',
          payload: newData,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 字典查询
    *handleWordDictionaryFetch({ payload }, { call, put }) {
      const response = yield call(handleWordDictionaryFetchAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveWordDictionaryFetch',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // 删除
    *handleDeleteTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleDeleteTreeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('删除成功');
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },

    // 添加
    *handleAddTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleAddTreeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.warn(response.message);
        flag = false;
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
    saveWordDictionaryFetch(state, { payload }) {
      return {
        ...state,
        saveWordDictionaryFetch: payload,
      };
    },
  },
};

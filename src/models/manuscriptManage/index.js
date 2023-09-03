import {
  handleGetTreeAPI,
  handleGetListAPI,
  handleGetInfoByProCodeAPI,
  handleSetPathAPI,
  handleAuditAPI,
  handleGetProductListAPI,
  handleWordDictionaryFetchAPI,
  handleGetNoPathTreeAPI,
  handleDragTreeAPI,
} from '@/services/manuscriptManage';
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
  namespace: 'manuscriptManage',
  state: {
    saveTreeData: [],
    saveManuscriptManageListInfo: {
      total: '',
      pathList: [],
    },
    saveManuscriptDetailInfo: {},
    saveProductList: [],
    saveWordDictionaryFetch: [],
    saveUpdateTreeData: [],
  },

  effects: {
    // 生命周期树形, 包含全部目录+不适用目录
    *handleGetTreeInfo({ payload }, { call, put }) {
      const response = yield call(handleGetTreeAPI, payload);
      const data = cloneDeep(response.data);
      if (response && response.status === 200) {
        if (response.data) {
          const newData = handleNewTreeData(data);
          yield put({
            type: 'saveTreeData',
            payload: newData,
          });
        } else {
          yield put({
            type: 'saveTreeData',
            payload: [],
          });
        }
      } else {
        message.warn(response.message);
      }
    },
    // 不适用目录树
    *handleGetUpdateTreeInfo({ payload, callback }, { call, put }) {
      const response = yield call(handleGetNoPathTreeAPI, payload);
      const data = cloneDeep(response.data);
      let newData = [];
      if (response && response.status === 200) {
        if (response.data) {
          newData = handleNewTreeData(data);
        }
        yield put({
          type: 'saveUpdateTreeData',
          payload: newData,
        });
        callback && callback(newData);
      } else {
        message.warn(response.message);
      }
    },

    // 列表信息
    *handleGetListMsg({ payload }, { call, put }) {
      // mode： project：项目目录；series：系列目录
      const response = yield call(handleGetListAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'saveManuscriptManageListInfo',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
      return flag;
    },
    // 项目名称下拉
    *handleGetProductListMsg({ payload }, { call, put }) {
      const response = yield call(handleGetProductListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveProductList',
          payload: response.data,
        });
      } else {
        message.warn(response.message);
      }
    },

    // item信息
    *handleGetItemInfoFetch({ payload }, { call, put }) {
      const response = yield call(handleGetInfoByProCodeAPI, payload);
      if (response && response.status === 200) {
      } else {
        message.warn(response.message);
      }
      return response.data;
    },
    // 适用性修改
    *handleSetPathFetch({ payload }, { call, put }) {
      const response = yield call(handleSetPathAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('设置成功');
      } else {
        message.warn(response.message);
        flag = false;
      }
      return flag;
    },
    // 审核/反审核
    *handleAudit({ payload }, { call, put }) {
      const response = yield call(handleAuditAPI, payload);
      let flag = true;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        flag = false;
        message.warn(response.message);
      }
      return flag;
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
    // 拖动树，保存树结构
    *handleDragTree({ payload }, { call, put }) {
      const response = yield call(handleDragTreeAPI, payload);
      let flag = true;
      if (response && response.status === 200) {
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
    saveUpdateTreeData(state, { payload }) {
      return {
        ...state,
        saveUpdateTreeData: payload,
      };
    },
    saveManuscriptManageListInfo(state, { payload }) {
      return {
        ...state,
        saveManuscriptManageListInfo: payload,
      };
    },
    saveManuscriptDetailInfo(state, { payload }) {
      return {
        ...state,
        saveManuscriptDetailInfo: payload,
      };
    },
    saveProductList(state, { payload }) {
      return {
        ...state,
        saveProductList: payload,
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

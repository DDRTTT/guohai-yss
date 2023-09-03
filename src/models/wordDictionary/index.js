/**
 *Create on 2020/6/16.
 */
import { router } from 'umi';
import {
  handleAddUser,
  handleDeleteUser,
  handleEditUser,
  handleList,
  handleOne,
  handleOneList,
  handleDownloadAPI,
  getDropDownListApi,
  updateByLinkageApi,
  queryInfoByLinkageApi,
} from '@/services/wordDictionary';
import { message } from 'antd';
import { isEmptyObject } from '@/utils/utils';

export default {
  namespace: 'wordDictionary',
  state: {
    loading: true,

    data: {
      rows: [],
      total: 0,
    },

    one: {},
    oneList: [],
    newList: [],

    add: {
      status: null,
    },

    update: {
      status: null,
    },

    delete: {
      status: null,
    },

    currentPage: 1,
    currentPageData: 1,

    status: 'look',
    forMoment: [],
    savePayload: {},
    handleDownloadData: '',
    childrenDicSelectList: [],
    getDropDownList: [],
  },

  effects: {
    // 查询字典类目
    *fetch({ payload }, { call, put }) {
      const response = yield call(handleList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      yield put({
        type: 'savecurrentPage',
        payload: payload.page,
      });
    },

    // 导出词汇字典
    *handleDownloadFunc({ payload, callback }, { call, put }) {
      const response = yield call(handleDownloadAPI, payload);
      if (typeof response === 'string') {
        yield put({
          type: 'handleDownloadData',
          payload: response,
        });
        if (callback) callback(response);
      }
    },

    // 查询字典类目详情列表
    *fetchOneList({ payload }, { call, put }) {
      const res = yield call(handleOneList, payload);
      if (res) {
        yield put({
          type: 'oneList',
          payload: res,
        });
      }
    },

    // 查询字典类目详情
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(handleOne, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'one',
          payload: response.data,
        });
      }
    },

    // 添加词汇字典
    *addWord({ payload }, { call }) {
      const response = yield call(handleAddUser, payload);
      if (response && response.status === 200) {
        message.success('添加成功');
        router.push('/base/wordDictionary');
      } else {
        message.error('字典代码已存在');
      }
    },

    // 修改词汇字典
    *updateWord({ payload }, { call }) {
      const response = yield call(handleEditUser, payload);
      if (response && response.status === 200) {
        message.success('修改成功');
        router.push('/base/wordDictionary');
      }
    },

    // 删除词汇字典
    *deleteWord({ payload }, { call, put }) {
      const response = yield call(handleDeleteUser, payload);
      if (response && response.status === 200) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
          payload: {
            page: 1,
            limit: 10,
          },
        });
      }
    },

    // 切换查看或编辑状态
    *state({ payload }, { put }) {
      yield put({
        type: 'status',
        payload: payload.state,
      });
    },

    *changeOneList({ payload }, { put }) {
      yield put({
        type: 'oneList',
        payload: payload.list,
      });
    },

    *changeNewList({ payload }, { put }) {
      yield put({
        type: 'newList',
        payload: payload.list,
      });
    },

    *childrenDicSelect({ payload }, { call, put }) {
      const res = yield call(handleOneList, payload);
      if (res) {
        yield put({
          type: 'updateChildrenDicSelect',
          payload: res,
        });
      }
    },

    *getDropDownListReq({ payload }, { call, put }) {
      const res = yield call(getDropDownListApi, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'updateGetDropDownList',
          payload: res.data,
        });
      }
    },

    *updateByLinkageReq({ payload, callback }, { call, put }) {
      const res = yield call(updateByLinkageApi, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.warn(res.message);
      }
    },

    *queryInfoByLinkageReq({ payload, callback }, { call, put }) {
      const res = yield call(queryInfoByLinkageApi, payload);
      if (res && res.status === 200) {
        callback && callback(res);
      } else {
        message.warn(res.message);
      }
    },
    queryInfoByLinkageApi,
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    handleDownloadData(state, { payload }) {
      return {
        ...state,
        handleDownloadData: payload,
      };
    },

    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        saveData: action.payload,
      };
    },

    one(state, action) {
      return {
        ...state,
        one: action.payload,
      };
    },
    oneList(state, { payload }) {
      return {
        ...state,
        oneList: payload,
      };
    },
    newList(state, action) {
      return {
        ...state,
        newList: action.payload,
      };
    },

    add(state, action) {
      return {
        ...state,
        add: action.payload,
      };
    },

    update(state, action) {
      return {
        ...state,
        update: action.payload,
      };
    },

    delete(state, action) {
      return {
        ...state,
        delete: action.payload,
      };
    },

    savecurrentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    currentPageData(state, action) {
      return {
        ...state,
        currentPageData: action.payload,
      };
    },

    status(state, action) {
      return {
        ...state,
        status: action.payload,
      };
    },

    forMoment(state, action) {
      return {
        ...state,
        forMoment: action.payload,
      };
    },
    savePayload(state, action) {
      return {
        ...state,
        savePayload: action.payload,
      };
    },

    updateChildrenDicSelect(state, action) {
      return {
        ...state,
        childrenDicSelectList: action.payload,
      };
    },

    updateGetDropDownList(state, action) {
      return {
        ...state,
        getDropDownList: action.payload,
      };
    },
  },
};

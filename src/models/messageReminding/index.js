import {
  getDelBatchAPI,
  getProductInfoTableAPI,
  getReadsAPI,
} from '@/services/messageReminding/index';
import { getAsReadAPI } from '@/services/user';
import { message } from 'antd';

export default {
  namespace: 'messageReminding',

  state: {
    productTableInfo: { voList: [], total: '' },
    saveMessageDel: null,
    mPageNum: 1,
    mTaskTypeCode: 'lifecycle',
    mPageSize: 10,
    mType: '',
    mCeateTime: [],
    mIsHandle: '',
    mMsgTitle: '',
    mMsgProCodeList: [],
    mOnAndOff: false,
    mShowSearch: true,
    mProcessPageSize: 10,
    mProcessPageNum: 1,
  },

  effects: {
    // 表格:消息
    *getProductInfoTableFunc({ payload, callback }, { call, put }) {
      const response = yield call(getProductInfoTableAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productTableInfo',
          payload: response.data,
        });
        if (callback) callback(response.data);
      } else {
      }
    },

    // 已读:多条
    *getReadsFunc({ payload, callback }, { call }) {
      const response = yield call(getReadsAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },

    // 已读:全部
    *handleAsRead({ callback }, { call }) {
      const response = yield call(getAsReadAPI);
      if (response && response.status === 200) {
        message.success(`操作成功 , ${response.message}`);
        if (callback) callback(response.data);
      }
    },

    // 删除:多条
    *handleDelBatch({ payload, callback }, { call }) {
      const response = yield call(getDelBatchAPI, payload);
      if (response && response.status === 200) {
        if (callback) callback(response.data);
      }
    },
  },

  reducers: {
    // dicts(state, { payload }) {
    //   return {
    //     ...state,
    //     dicts: payload,
    //   };
    // },
    // 设置基础属性
    setNormalProperty(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    productTableInfo(state, { payload }) {
      return {
        ...state,
        productTableInfo: payload,
      };
    },

    // 消息详情
    saveMessageDel(state, { payload }) {
      return {
        ...state,
        saveMessageDel: payload,
      };
    },
  },
};

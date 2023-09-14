import { putdata, queryRule } from '@/services/resources';
import { message } from 'antd';

export default {
  namespace: 'resource',

  state: {
    data: {
      rows: [],
      total: 0,
    },
    loading: false,
    currentPage: 1,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const response = yield call(queryRule, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveListFetch',
          payload: response.data,
        });
      }
    },
    *putdata({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(putdata, payload);
      if (res.status === 200) {
        const currentPage = yield select(namespace => namespace.resource.currentPage);
        const basic = {
          currentPage,
          pageSize: 10,
          urlType: payload.index_type,
        };
        message.success('操作成功!');
        const response = yield call(queryRule, basic);
        if (response && response.status === 200) {
          yield put({
            type: 'saveListFetch',
            payload: response.data,
          });
        }
      } else {
        message.warn('很抱歉，由于网络原因本次操作未能成功!');
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveListFetch(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    savecurrentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

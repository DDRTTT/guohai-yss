import { message } from 'antd';
import { getTodoTasksAPI } from '@/services/workSpace';
import { getProductListApiv2 } from '@/services/product/info';
export default {
  namespace: 'customerIndex',

  state: {
    tasks: {
      rows: [],
      total: 0,
      currentPage: 1,
    },
    products: {
      rows: [],
      total: 0,
      currentPage: 1,
    },
  },

  effects: {
    *fetchTask({ payload }, { call, put, select }) {
      const response = yield call(getTodoTasksAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveTaskFetch',
          payload: response.data,
        });
      }
    },
    *fetchProducts({ payload }, { call, put, select }) {
      const response = yield call(getProductListApiv2, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveProductFetch',
          payload: response.data,
        });
      }
    },
    // *putdata({ payload }, { call, put, select }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const res = yield call(putdata, payload);
    //   if (res.status === 200) {
    //     const currentPage = yield select(namespace => namespace.resource.currentPage);
    //     const basic = {
    //       currentPage,
    //       pageSize: 10,
    //       urlType: payload.index_type,
    //     };
    //     message.success('操作成功!');
    //     const response = yield call(queryRule, basic);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //   } else {
    //     message.warn('很抱歉，由于网络原因本次操作未能成功!');
    //   }

    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });
    // },
  },

  reducers: {
    saveTaskFetch(state, action) {
      return {
        ...state,
        tasks: { ...state.tasks, ...action.payload },
      };
    },
    saveProductFetch(state, action) {
      return {
        ...state,
        products: { ...state.products, ...action.payload },
      };
    },
  },
};

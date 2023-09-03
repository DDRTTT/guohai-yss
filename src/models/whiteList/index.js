/**
 * 白名单
 * **/
import { message } from 'antd';
import {
  queryWhiteDetail,
  queryWhiteList,
  serviceWhiteAdd,
  serviceWhiteDel,
  serviceWhitePut,
  serviceWhiteSwitch,
} from '@/services/licenseManagement';
import { queryRuleJG } from '@/services/userManager';

let model = {
  namespace: 'whiteList',

  state: {
    currentPage: 1,

    whiteListData: {
      total: 0,
      rows: [],
    },

    //存储签章详情数据
    whiteDetailData: {},
    orgNameList: [],
  },

  effects: {
    //列表
    *whiteListWay({ payload }, { call, put }) {
      const response = yield call(queryWhiteList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'whiteListData',
          payload: response.data,
        });
      }
    },

    //详情
    *whiteDetail({ payload }, { call, put }) {
      const response = yield call(queryWhiteDetail, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'whiteDetailData',
          payload: response.data,
        });
      }
      return response;
    },

    //新增
    *whiteAdd({ payload }, { call, put }) {
      const response = yield call(serviceWhiteAdd, payload.params);

      if (response && response.status === 200) {
        message.success('添加成功');

        yield put({
          type: 'whiteListWay',
          payload: payload.payload,
        });
      } else {
        message.error(`添加失败`);
      }
      return response;
    },

    //修改
    *whiteUpdate({ payload }, { call, put }) {
      const response = yield call(serviceWhitePut, payload.params);

      if (response && response.status === 200) {
        message.success('修改成功');

        yield put({
          type: 'whiteListWay',
          payload: payload.payload,
        });
      } else {
        message.error(`修改失败`);
      }

      return response;
    },

    //删除
    *whiteDelete({ payload }, { call, put }) {
      const response = yield call(serviceWhiteDel, payload.params);

      if (response && response.status === 200) {
        message.success('删除成功');

        yield put({
          type: 'whiteListWay',
          payload: payload.payload,
        });
      } else {
        message.error('删除失败');
      }

      return response;
    },

    //切换操作
    *whiteSwitch({ payload }, { call, put }) {
      const response = yield call(serviceWhiteSwitch, payload.basic);

      if (response && response.status === 200) {
        yield put({
          type: 'whiteListWay',
          payload: payload.payload,
        });
      } else {
        message.error(response.message);
      }

      return response;
    },

    *applyList(_, { call, put }) {
      const response = yield call(queryRuleJG);
      if (response && response.status === 200) {
        yield put({
          type: 'orgNameList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    pageChange(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },

    whiteListData(state, action) {
      return {
        ...state,
        whiteListData: action.payload,
      };
    },

    whiteDetailData(state, action) {
      return {
        ...state,
        whiteDetailData: action.payload,
      };
    },

    orgNameList(state, action) {
      return {
        ...state,
        orgNameList: action.payload,
      };
    },
  },
};

export default model;

import {
  feedback,
  getAsReadAPI,
  getCountUnreadAPI,
  getTaskDetail,
  getUnreadMsgListAPI,
  handleGetMenuAPI,
  msgInit,
  query as queryUsers,
  queryCurrent,
  queryMail,
  updateAllRead,
  updateOneRead,
  updateSomeRead,
} from '@/services/user';
import { getMenu, getUserInfo, setMenu, setSession, setUserInfo } from '@/utils/session';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    currentUser: JSON.parse(getUserInfo()) || {},
    saveMenu: JSON.parse(getMenu()),
    authorizes: JSON.parse(getMenu()),
    saveSysId: null,
    saveCountUnread: 0,
    saveUnreadMsgList: [],
    saveParametersUnreadMsgList: {},
    // 流程引擎的未读消息
    processMail: [],
    processMailTotal: 0,
  },

  effects: {
    // 根据id获取任务详情
    *getQueryMsgById({ payload }, { call }) {
      const res = yield call(getTaskDetail, payload);
      if (res && res.status === 200) {
        return res.data;
      }
      return false;
    },

    // 流程引擎单条消息已读
    *updateOneRead({ payload }, { call }) {
      const response = yield call(updateOneRead, payload);
      if (response && response.status === 200) {
      } else {
        message.warn('操作失败');
      }
    },

    // 流程引擎全部已读
    *updateAllRead({ payload }, { call }) {
      const response = yield call(updateAllRead, payload);
      if (response && response.status === 200) {
      } else {
        message.warn('操作失败');
      }
    },

    // 流程引擎批量已读
    *updateSomeRead({ payload }, { call }) {
      const response = yield call(updateSomeRead, payload);
      if (response && response.status === 200) {
      } else {
        message.warn('操作失败');
      }
    },

    // 收到消息以后的反馈接口
    *queryMail({ payload }, { call, put }) {
      const response = yield call(queryMail, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'saveProcessMail',
          payload: response.data.rows,
        });
        yield put({
          type: 'saveProcessMailTotal',
          payload: response.data.total,
        });
        return response.data.rows;
      }
      message.warn('操作失败');
      return false;
    },

    // 收到消息以后的反馈接口
    *feedback({ payload }, { call }) {
      const response = yield call(feedback, payload);
      if (response && response.status === 200) {
        return true;
      }
      message.warn('操作失败');
      return false;
    },

    // 消息列表初始化接口
    *msgInit({ payload }, { call }) {
      const response = yield call(msgInit, payload);
      if (response && response.status === 200 && response.data) {
        return response.data;
      }
      message.warn('操作失败');
      return false;
    },

    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response && response.status === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data[0],
        });
        if (response.data[0] && response.data[0].usercode)
          setSession('SingleId', response.data[0].usercode);
        setSession('loginOrgId', response.data[0].orgId);// 当前登录人的归属机构
        setSession('loginId', response.data[0].id);// 当前登录人id，超级管理员 id 为1
        yield call(setUserInfo, JSON.stringify(response.data[0]));
      }
    },

    // 将未读消息全部标为已读
    *handleAsRead(_, { call, put, select }) {
      const response = yield call(getAsReadAPI);
      if (response && response.status === 200) {
        const saveParametersUnreadMsgList = yield select(m => m.user.saveParametersUnreadMsgList);
        put({
          type: 'saveUnreadMsgList',
          payload: saveParametersUnreadMsgList,
        });
        message.success('操作成功');
      } else {
        if (response.message) {
          message.warn(response.message);
        } else {
          message.warn('操作失败');
        }
      }
    },

    // 获取未读消息数量
    *handleGetCountUnread(_, { call }) {
      const response = yield call(getCountUnreadAPI);
      if (response && response.status === 200 && response.data) {
        return response.data;
      }
      return false;
    },

    // 消息列表查询
    *handleGetUnreadMsgList({ payload }, { call, put }) {
      const response = yield call(getUnreadMsgListAPI, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'saveUnreadMsgList',
          payload: response.data,
        });
        yield put({
          type: 'saveParametersUnreadMsgList',
          payload: response.data,
        });
        return response.data;
      }
      return false;
    },

    *handleGetMenu({ payload, callBack }, { call, put, select }) {
      const sysId = yield select(model => model.user.saveSysId);
      if (payload.sysId !== sysId) {
        yield put({
          type: 'saveMenu',
          payload: [],
        });
        yield put({
          type: 'saveSysId',
          payload: payload.sysId,
        });
        const res = yield call(handleGetMenuAPI, {
          needAction: true,
          ...payload,
        });
        if (res && res.status === 200) {
          const menu = res.data;
          setMenu(JSON.stringify(menu));
          yield put({
            type: 'saveMenu',
            payload: menu,
          });
        }
      }
      if (callBack) callBack();
    },
  },

  reducers: {
    saveProcessMailTotal(state, { payload }) {
      return {
        ...state,
        processMailTotal: payload,
      };
    },
    saveProcessMail(state, { payload }) {
      return {
        ...state,
        processMail: payload,
      };
    },
    saveCountUnread(state, { payload }) {
      return {
        ...state,
        saveCountUnread: payload,
      };
    },
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },

    saveSysId(state, { payload }) {
      return {
        ...state,
        saveSysId: payload,
      };
    },

    saveMenu(state, { payload }) {
      return {
        ...state,
        authorizes: payload || [],
        saveMenu: payload || [],
      };
    },
    saveUnreadMsgList(state, { payload }) {
      return {
        ...state,
        saveUnreadMsgList: payload,
      };
    },
    saveParametersUnreadMsgList(state, { payload }) {
      return {
        ...state,
        saveParametersUnreadMsgList: payload,
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

import { checktoken, queryNotices, tokenRefresh } from '@/services/user';
import { removeAllSession, setAuthToken } from '@/utils/session';
import { appendJs } from '@/utils/utils';
import {
  GET_REFRESH_TOKEN_API,
  GET_REFRESH_TOKEN_WITH_USERID_API,
  getNginxIP,
  handleTokenExchangeAPI,
} from '@/services/global';
import delay from 'lodash/delay';
import { message } from 'antd';
import { DATA_DICTIONARY_API } from '@/services/workSpace';

let num = 0;
const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    saveIP: { gateWayIp: '', jsApi: '' },
    SAVE_DATA_DICTIONARY: {},
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },

    // 刷新token
    *handleTokenRefresh(_, { call, race, put, take }) {
      // const sysTokenTime = 30 * 10 * 1000; // 5min
      const sysTokenTime = 50 * 10 * 1000;

      function* refreshToken() {
        let i = 0;
        while (true) {
          try {
            // if (checkUserActionTime) {
            // 用户最后时间操作校验——15min 为限制，校验不通过停止令牌交换，但是任务调度刷新继续
            const res = yield call(tokenRefresh);
            if (res && res.data && res.data.token) {
              yield call(setAuthToken, res.data.token);
            } else {
              yield put({
                type: 'login/logout',
              });
            }
            // }
            yield call(
              () =>
                new Promise(resolve => {
                  delay(resolve, sysTokenTime);
                }),
            );
          } catch (error) {
            i++;
            if (i === 3) {
              break;
            }
          }
        }
        // yield put({
        //   type: 'login/logout',
        // });
      }

      // 校验token
      const response = yield call(checktoken);
      const { status, data } = response;
      if (response && status && status === 200 && data === true) {
        yield race({
          task: call(refreshToken),
          logout: take('login/logout'),
        });
      } else {
        yield put({
          type: 'login/logout',
        });
      }
    },

    // 每次跳回到工作台都请求一次token，为了兼容单点登录到其他系统时间过长，token过期问题,userIc为当前用户id
    *GET_REFRESH_TOKEN_API_WITH_USERID({ payload }, { call }) {
      const res = yield call(GET_REFRESH_TOKEN_WITH_USERID_API, payload);
      if (
        res?.status &&
        res?.status === 200 &&
        res?.data?.token !== undefined &&
        res?.data?.token !== '' &&
        res?.data?.token !== null
      ) {
        // 将token放入cookies中缓存
        yield call(setAuthToken, res.data.token);
        return true;
      }
      return false;
    },

    // 交换token
    *handleTokenExchange(_, { call, put }) {
      const res = yield call(handleTokenExchangeAPI);
      if (res && res.status === 200 && res.data) {
        const { token } = res.data;
        if (token !== '') yield call(setAuthToken, token);
        yield put({
          type: 'handleTokenRefresh',
        });
      } else {
        message.warn(res.message);
        yield put({
          type: 'login/logout',
        });
      }
      yield put({
        type: 'user/fetchCurrent',
      });
    },

    // 获取畅写JDK IP 和 网关地址
    *handleGetNginxIP({ payload }, { call, put }) {
      const res = yield call(getNginxIP, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveIP',
          payload: res.data,
        });
        appendJs(res.data.jsApi);
      }
    },

    // 单点登录系统返回/workspace的时候，根据其他系统返回用户userid和所在系统sysid，获取新的token
    *GET_REFRESH_TOKEN({ payload }, { call, put }) {
      const res = yield call(GET_REFRESH_TOKEN_API, payload);
      if (res && res.status && res.status === 200 && res.data && res.data.token) {
        const { token } = res.data;
        if (token !== '') yield call(setAuthToken, token);
        yield put({
          type: 'handleTokenRefresh',
        });
        return true;
      }
      return false;
    },

    // 获取系统词汇
    *DATA_DICTIONARY_FETCH({ payload }, { call, put }) {
      const res = yield call(DATA_DICTIONARY_API, payload);
      if (res && res.status === 200 && res.data) {
        const { data } = res;
        yield put({
          type: 'SAVE_DATA_DICTIONARY',
          payload: data,
        });
      } else {
        message.warn(res.message);
      }
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    // 获取IP
    saveIP(state, { payload }) {
      return {
        ...state,
        saveIP: payload,
      };
    },
    SAVE_DATA_DICTIONARY(state, { payload }) {
      return {
        ...state,
        SAVE_DATA_DICTIONARY: payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname }) => {
        if (pathname === '/user/login') {
          removeAllSession();
          dispatch({
            type: 'user/saveSysId',
            payload: null,
          });
        }
      });
      history.listen(({ pathname }) => {
        const contentDom = document.getElementsByClassName('ant-layout')[2];
        const siderDom = document.getElementsByClassName('ant-pro-sider-menu-sider')[0];
        if (pathname === '/workspace') {
          num = 0;
          if (contentDom && siderDom) {
            siderDom.style.display = 'none';
            contentDom.style.paddingLeft = '0px';
          }
        } else if (num === 0) {
          if (contentDom && siderDom) {
            siderDom.style.display = 'block';
            contentDom.style.paddingLeft = '256px';
            dispatch({
              type: 'changeLayoutCollapsed',
              payload: false,
            });
            num++;
          }
        }
      });
    },
  },
};

export default GlobalModel;

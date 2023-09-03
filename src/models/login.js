// import { stringify } from 'querystring';
import { message } from 'antd';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import {
  accountLogin,
  getFakeCaptcha,
  handleCheckPassowrdAPI,
  handleUpdatePasswordAPI,
  redisInit,
} from '@/services/login';
// import { setAuthority } from '@/utils/authority';
import { removeAllSession, removeAuthToken, setAuthToken } from '@/utils/session';
import { setLassTime, setNountType, setCatchProjectConfigTime } from '@/utils/cookie';
import { decryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

export default {
  namespace: 'login',
  state: {
    token: undefined,
    modelVisible: false,
  },
  effects: {
    *login({ payload, flag = true, callback }, { call, put }) {
      const res = yield call(accountLogin, payload);
      removeAuthToken();
      if ((res && res?.data && res?.data?.token === '') || !res?.data) {
        const messageText = flag ? '账户或密码错误，请再次输入!' : '密码错误!请再次输入';
        message.warn(res?.data?.message ?? messageText, 3);
      }
      if (
        res?.status &&
        res?.status === 200 &&
        res?.data?.token !== undefined &&
        res?.data?.token !== '' &&
        res?.data?.token !== null
      ) {
        // 解决子项目不更新的问题:在登录时记录当前时间戳，拼接到project.config.js中entry的js文件后
        setCatchProjectConfigTime()
        // 将token放入cookies中缓存
        yield call(setAuthToken, res.data.token);
        // 检查密码是否未修改
        const response = yield call(handleCheckPassowrdAPI, payload);
        if (response && response.status === 200 && response.data === true) {
          if (callback) callback();
        } else if (response && response.status === 200 && response.data === false) {
          // 将登录标识存储至全局
          yield call(setNountType, decryptText(payload.nountype, ENCRYPTED_PASSWORD()));
          yield put({
            type: 'modelSwitch',
            payload: false,
          });
          setLassTime();
          if (flag) {
            yield call(redisInit, {});
            yield put(routerRedux.push('/'));
          }
        }
      }
      return true;
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    // 修改密码
    *handleUpdatePasswordFunc({ payload, callback1, callback2 }, { call }) {
      const response = yield call(handleUpdatePasswordAPI, payload);
      if (response && response.status === 200) {
        message.success('修改成功 , 请使用新密码重新登录 !');
        if (callback1) callback1();
      } else {
        message.error(`修改失败 ! 错误信息 : ${response.message}`);
        if (callback2) callback2();
      }
    },

    *checkNameAndPsd({ payload }, { call, put }) {
      yield call(setAuthToken, '');
      const res = yield call(accountLogin, payload);
      if (res.data.token !== undefined && res.data.token !== '' && res.data.token !== null) {
        yield call(setAuthToken, res.data.token);
        yield put({
          type: 'modelSwitch',
          payload: false,
        });
        setLassTime();
      } else {
        message.warn('密码错误!请再次输入');
      }
      return true;
    },

    logout() {
      // const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      removeAllSession();
      if (window.location.pathname !== '/user/login') {
        router.replace({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        });
      }
    },
  },
  reducers: {
    modelSwitch(state, { payload }) {
      return {
        ...state,
        modelVisible: payload,
      };
    },
  },
};

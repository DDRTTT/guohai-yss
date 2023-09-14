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
  redisInitAccess,
} from '@/services/login';
import { handleGetMenuAPI } from '@/services/user';
// import { setAuthority } from '@/utils/authority';
import { removeAllSession, removeAuthToken, setAuthToken, getCustomerFlag, setMenu, setSession, SYSID } from '@/utils/session';
import { setLassTime, setNountType } from '@/utils/cookie';
import { decryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';
const loginFunc = () => {
  sessionStorage.setItem('ONCLICK_TIME', Date.now())
  // 有url的情况下跳转至/base/processCenterHome
  handleGetMenuAPI({
    needAction: true,
    sysId: 1,
  }).then(res=>{
    if (res && res.status === 200) {
      const menu = res.data;
      setMenu(JSON.stringify(menu));
      setSession('d', '招募说明书智能撰写');
      setSession('sysId', 1);
      setSession(SYSID, 1);
      router.push('/base/prospectuSetHome');
      location.href = '/base/prospectuSetHome'
    }
  })
};
export default {
  namespace: 'login',

  state: {
    token: undefined,
    modelVisible: false,
  },
//20220824 廖志，测试提交权限
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
            // yield call(redisInitAccess, {});
            // yield put(routerRedux.push('/'));
            loginFunc();
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
      const customerFlag = getCustomerFlag();
      removeAllSession();
      if (window.location.pathname !== '/user/login') {
        customerFlag
          ? router.replace({
              pathname: '/userCustomer/login',
            })
          : router.replace({
              pathname: '/user/login',
            });
        return new Promise(resolve => resolve(true));
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

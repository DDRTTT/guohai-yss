import { routerRedux } from 'dva/router';
import {
  checkCodeAndMobile,
  checkDX,
  getdxinfo,
  getOrgType,
  register,
  registerPerson,
} from '@/services/register/register';
import { message } from 'antd';

let model = {
  namespace: 'register',
  state: {
    status: undefined,
    exist: {},
    DXInfo: undefined,
    PersonalSuccess: 'none', //控制个人用户注册成功页面的显示和隐藏参数
    companySuccess: 'none', //控制机构注册成功页面的显示和隐藏
    OrgFistdata: {}, //用户注册第一次保存数据
    OrgType: {}, //机构类型
    dxStatus: null, //验证码 校验
    CodeAndMobileStatus: null, // 用户名和手机号 校验
    saveFail: null, // 提交失败
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(register, payload);
      if (response.data.status === '200') {
        if (payload.deptId === 0) {
          yield put({
            type: 'PersonalSuccess',
            payload: 'block',
          });
        } else {
          yield put({
            type: 'companySuccess',
            payload: 'block',
          });
        }
      } else {
        yield put({
          type: 'saveFail',
          payload: 'none',
        });
        let errMag = response.data.errMsg;
        message.warn(errMag);
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },

    *submitPerson({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      let sortMes = {
        mobile: payload.mobile,
        verCode: payload.verCode,
      };

      let val = {
        mobile: payload.mobile,
        code: payload.code,
      };

      const response = yield call(checkCodeAndMobile, val);
      if (response && response.data && response.data.status === '200') {
        yield put({
          type: 'CodeAndMobileStatus',
          payload: true,
        });
        const response = yield call(checkDX, sortMes);
        if (response && response.data && response.data.status === '0000') {
          yield put({
            type: 'dxStatus',
            payload: true,
          });

          const response = yield call(registerPerson, payload);
          if (response.data.status === '200') {
            if (payload.deptId === 0) {
              yield put({
                type: 'PersonalSuccess',
                payload: 'block',
              });
            } else {
              yield put({
                type: 'companySuccess',
                payload: 'block',
              });
            }
          } else {
            yield put({
              type: 'saveFail',
              payload: 'none',
            });
            let errMag = response.data.errMsg;
            message.warn(errMag);
          }
        } else {
          message.warn('验证码有误,请再获取验证码并输入!');
          yield put({
            type: 'dxStatus',
            payload: false,
          });
        }
      } else {
        let msg = response.data.errMsg;
        message.warn(msg);
        yield put({
          type: 'CodeAndMobileStatus',
          payload: false,
        });
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },

    // 验证码 校验
    *checkDX({ payload }, { call, put }) {
      const response = yield call(checkDX, payload);
      if (response && response.data && response.data.status === '0000') {
        yield put({
          type: 'dxStatus',
          payload: true,
        });
      } else {
        message.warn('验证码有误,请再次输入!');
        yield put({
          type: 'dxStatus',
          payload: false,
        });
      }
    },

    // 用户名和手机号 校验
    *checkCodeAndMobile({ payload }, { call, put }) {
      const response = yield call(checkCodeAndMobile, payload);
      if (response && response.data && response.data.status === '200') {
        yield put({
          type: 'CodeAndMobileStatus',
          payload: true,
        });
      } else {
        let msg = response.data.errMsg;
        message.warn(msg);
        yield put({
          type: 'CodeAndMobileStatus',
          payload: false,
        });
      }
    },

    *getDX({ payload }, { call, put }) {
      const response = yield call(getdxinfo, payload);

      try {
        if (response && response.data.status === '0000') {
          yield put({
            type: 'savedx',
            payload: response.data.errCode,
          });
        } else {
          message.warn('验证码发送失败，请稍后再试!');
        }
      } catch (e) {
        console.log(e);
      }
    },

    *upPersonalSuccess({ payload }, { call, put }) {
      yield put({
        type: 'PersonalSuccess',
        payload: payload,
      });
      yield put(routerRedux.push('/user/index'));
    },

    *upcompanySuccess({ payload }, { call, put }) {
      yield put({
        type: 'companySuccess',
        payload: payload,
      });
      yield put(routerRedux.push('/user/index'));
    },

    *putOrgIfo({ payload }, { call, put }) {
      yield put({
        type: 'OrgFistdata',
        payload: payload,
      });
    },

    *getOrgType({ payload }, { call, put }) {
      const response = yield call(getOrgType);
      yield put({
        type: 'saveOrgType',
        payload: response,
      });
    },

    doNameValid: [
      function*({ payload: { username, callback } }, { call, put }) {
        const response = yield call(fetchUser, username);

        if (response.username) {
          yield call(callback, '该用户名已经被注册!');
        } else {
          yield call(callback);
        }
        yield put({
          type: 'setExist',
          payload: response,
        });
      },
      { type: 'takeLatest' },
    ],
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    savedx(state, { payload }) {
      return {
        ...state,
        DXInfo: payload,
      };
    },
    PersonalSuccess(state, { payload }) {
      return {
        ...state,
        PersonalSuccess: payload,
      };
    },
    OrgFistdata(state, { payload }) {
      return {
        ...state,
        OrgFistdata: payload,
      };
    },
    companySuccess(state, { payload }) {
      return {
        ...state,
        companySuccess: payload,
      };
    },
    saveOrgType(state, { payload }) {
      return {
        ...state,
        OrgType: payload,
      };
    },
    dxStatus(state, { payload }) {
      return {
        ...state,
        dxStatus: payload,
      };
    },
    CodeAndMobileStatus(state, { payload }) {
      return {
        ...state,
        CodeAndMobileStatus: payload,
      };
    },
    saveFail(state, { payload }) {
      return {
        ...state,
        saveFail: payload,
      };
    },
  },
};

export default model;

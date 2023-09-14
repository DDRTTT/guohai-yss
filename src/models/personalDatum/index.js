/**
 *Create on 2020/7/22.
 */

import { message } from 'antd';
import {
  checkPhoneCode,
  clickBind,
  clickBindEmail,
  getCelebritymotto,
  getPersonal,
  isPhoneExist,
  mailboxCode,
  revisePassword,
  saveCompany,
  saveDatum,
  sendCode,
  uploadPhoto,
  verificationCode,
} from '../../services/personalDatum';

const model = {
  namespace: 'personalDatum',
  state: {
    // 个人信息
    data: {
      data: [{}],
    },
    // 名人名言
    say: {
      data: [{}],
    },

    photo: {}, // 上传头像
    saveType: {}, // 保存个人资料
    saveCompany: {}, // 保存企业信息
    Password: {}, // 修改密码

    cellphoneCode: {
      data: {
        status: null,
      },
    }, // 核对手机验证码

    cellphoneCode2: {
      data: {
        status: null,
      },
    }, // 核对新手机验证码

    phoneExist: {
      data: {
        status: null,
      },
    }, // 判断手机号是否存在

    code: {},
    bindPhone: {},
    bindEmail: {},
    emailCodeArr: {
      data: {
        status: null,
      },
    }, // 核对邮箱验证码
    emailCodeArr2: {
      data: {
        status: null,
      },
    }, // 核对新邮箱验证码

    phoneCodeArr: {},
  },

  effects: {
    // 获取个人资料
    *getPersonInfo({ payload }, { call, put }) {
      const response = yield call(getPersonal, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'user/saveCurrentUser',
          payload: response.data[0],
        });
      }
    },

    // 上传头像
    *PhotoFun({ payload }, { call, put }) {
      const response = yield call(uploadPhoto, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'photo',
          payload: response,
        });
      }
    },

    // 获取名言警句
    *getSaying({ payload }, { call, put }) {
      const response = yield call(getCelebritymotto, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'say',
          payload: response,
        });
      }
    },

    // 保存个人资料
    *saveDatum({ payload }, { call, put }) {
      const response = yield call(saveDatum, payload);
      if (response.status === 200) {
        message.success('保存成功');
        // 保存成功后再次获取个人信息
        yield put({
          type: 'getPersonInfo',
        });
      } else {
        message.error('保存失败');
      }
      return response;
    },

    // 保存企业信息
    *saveCompanyFun({ payload }, { call, put }) {
      const response = yield call(saveCompany, payload);
      if (response.status === 200) {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
      yield put({
        type: 'saveCompany',
        payload: response,
      });
      return response;
    },

    // 保存修改密码
    *PasswordFun({ payload }, { call, put }) {
      const response = yield call(revisePassword, payload);
      if (response.status == 500) {
        message.error(`请按规则修改密码（${response.message}）`);
        return;
      }
      if (response.data.status === '200') {
        message.success('保存成功');
        message.success('即将跳转到登录页面');
        yield new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
        yield put({
          type: 'login/logout',
        });
      } else if (response.data.status === '300') {
        message.error('旧密码输入有误');
      } else {
        message.error('保存失败');
      }
    },

    // 发送手机验证码
    *sensPhoneCode({ payload }, { call, put }) {
      const response = yield call(verificationCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'phoneCodeArr',
          payload: response,
        });
      }
    },

    // 核对手机验证码
    *checkPhoneCodeFun({ payload }, { call, put }) {
      const response = yield call(checkPhoneCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'cellphoneCode',
          payload: response,
        });
      }
    },

    // 核对新手机验证码
    *checkPhoneCodeFun2({ payload }, { call, put }) {
      const response = yield call(checkPhoneCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'cellphoneCode2',
          payload: response,
        });
      }
    },

    // 发送验证码
    *isPhoneExistFun({ payload }, { call, put }) {
      const response = yield call(isPhoneExist, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'phoneExist',
          payload: response,
        });
      }
    },

    // 绑定手机
    *clickBindPhoneFun({ payload }, { call, put }) {
      const response = yield call(clickBind, payload);
      if (response.status === 200) {
        message.success('绑定手机号成功');
        // 保存成功后再次获取个人信息
        yield put({
          type: 'getPersonInfo',
        });
      } else {
        message.error('绑定手机号失败');
      }
      return response;
    },

    // 发送邮箱验证码
    *sendCodeFun({ payload }, { call, put }) {
      const response = yield call(sendCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'code',
          payload: response,
        });
      }
    },

    // 核对邮箱验证码
    *sensMailboxCode({ payload }, { call, put }) {
      const response = yield call(mailboxCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'emailCodeArr',
          payload: response,
        });
      }
    },

    // 核对邮箱验证码
    *sensMailboxCode2({ payload }, { call, put }) {
      const response = yield call(mailboxCode, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'emailCodeArr2',
          payload: response,
        });
      }
    },

    // 绑定邮箱
    *clickBindEmailFun({ payload }, { call, put }) {
      const response = yield call(clickBindEmail, payload);
      if (response.status === 200) {
        message.success('绑定邮箱成功');
        // 保存成功后再次获取个人信息
        yield put({
          type: 'getPersonInfo',
        });
      } else {
        message.error('绑定邮箱失败');
      }
      return response;
    },
  },

  reducers: {
    // 获取名人名言
    say(state, action) {
      return {
        ...state,
        say: action.payload,
      };
    },

    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    photo(state, action) {
      return {
        ...state,
        photo: action.payload,
      };
    },

    saveType(state, action) {
      return {
        ...state,
        saveType: action.payload,
      };
    },

    saveCompany(state, action) {
      return {
        ...state,
        saveCompany: action.payload,
      };
    },

    Password(state, action) {
      return {
        ...state,
        Password: action.payload,
      };
    },

    code(state, action) {
      return {
        ...state,
        code: action.payload,
      };
    },

    cellphoneCode(state, action) {
      return {
        ...state,
        cellphoneCode: action.payload,
      };
    },

    cellphoneCode2(state, action) {
      return {
        ...state,
        cellphoneCode2: action.payload,
      };
    },

    phoneExist(state, action) {
      return {
        ...state,
        phoneExist: action.payload,
      };
    },

    bindPhone(state, action) {
      return {
        ...state,
        bindPhone: action.payload,
      };
    },

    bindEmail(state, action) {
      return {
        ...state,
        bindEmail: action.payload,
      };
    },

    emailCodeArr(state, action) {
      return {
        ...state,
        emailCodeArr: action.payload,
      };
    },

    emailCodeArr2(state, action) {
      return {
        ...state,
        emailCodeArr2: action.payload,
      };
    },

    phoneCodeArr(state, action) {
      return {
        ...state,
        phoneCodeArr: action.payload,
      };
    },
  },
};

export default model;

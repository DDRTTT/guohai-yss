// import { stringify } from 'querystring';
import { message } from 'antd';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import {
  accountLogin,
  mobileLogin,
  getFakeCaptchaCode,
  handleCheckPassowrdAPI,
  handleUpdatePasswordAPI,
  redisInit,
  forgotPassword,
  handleForgetUpdatePasswordAPI,
  proAccountOutlets,
  cityListAPI,
  bankListAPI,
} from '@/services/login';
// import { setAuthority } from '@/utils/authority';
import { removeAllSession, removeAuthToken, setAuthToken, setCustomerFlag, setSys } from '@/utils/session';
import { setLassTime, setNountType } from '@/utils/cookie';
import { decryptText } from '@/utils/encryption';
import { ENCRYPTED_PASSWORD } from '@/utils/Code';

export default {
  namespace: 'loginCustomer',

  state: {
    token: undefined,
    modelVisible: false,

    depositListData: {
      //便捷查询数据
      rows: [], //
      total: 0,
    },
    loading: false,
    currentPage: 1,
    cityListData: { citys: [] },
    bankListData: { banks: [] },
  },

  effects: {
    // 第一次登录后，修改密码
    *handleUpdatePasswordFunc({ payload, callback1, callback2 }, { call }) {
      const response = yield call(handleUpdatePasswordAPI, payload);
      if (response && response.status === 200 && response.data.status === '200') {
        // 成功：{"status":200,"message":"success","data":{"errMsg":"保存成功","status":"200"},"rel":true}
        message.success('修改成功 , 请使用新密码重新登录 !', 8);
        if (callback1) callback1();
      } else {
        // 失败：{"status":200,"message":"success","data":{"errMsg":"旧密码输入错误","status":"300"},"rel":true}
        message.error(`修改失败，错误信息 : ${response.data.errMsg}`, 6);
        if (callback2) callback2();
      }
    },

    // 检查名字和密码
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

    // 退出
    logout() {
      removeAllSession();
      if (window.location.pathname !== '/user/login') {
        router.replace({
          pathname: '/userCustomer/loginCustomer',
        });
      }
    },

    // ---------------------对客平台
    // 获取验证码
    *getFakeCaptchaCode({ payload, callback }, { call }) {
      const res = yield call(getFakeCaptchaCode, payload.scene, payload.mobile, payload.flag);
      // console.log(res);
      if (res && res?.status && res?.status === 200 && res?.data && res?.data?.status === '0000') {
        // 成功：{"status":200,"message":"success","data":{"errMsg":"Success","status":"0000"},"rel":true}
        if (callback) callback();
      } else {
        // 错误：{"status":200,"message":"success","data":{"errMsg":"无当前用户，请注册！！","status":"1001"},"rel":true}
        const messageText = '获取验证码失败';
        message.warn(res?.data?.errMsg ?? messageText, 3);
      }
    },

    // 账号登录
    *loginCustomer({ payload, flag = true, callback1, callback2 }, { call, put }) {
      const res = yield call(accountLogin, payload);
      removeAuthToken();
      if ((res && res?.data && res?.data?.token === '') || !res?.data) {
        const messageText = flag ? '账户或密码错误，请再次输入!' : '密码错误!请再次输入';
        message.warn(res?.data?.message ?? messageText, 3);
        // @todo 触发图片验证码更新
        if (callback1) callback1();
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
        // 2022年05月17日14:09:59 吕世光 对客登录标识
        yield call(setCustomerFlag);
        // 检查密码是否未修改
        const response = yield call(handleCheckPassowrdAPI, payload);
        if (response && response.status === 200 && response.data === true) {
          if (callback2) callback2();
        } else if (response && response.status === 200 && response.data === false) {
          // 将登录标识存储至全局
          yield call(setNountType, decryptText(payload.nountype, ENCRYPTED_PASSWORD()));
          yield call(setSys, 12); // 对客平台，SYSID=12
          yield put({
            type: 'modelSwitch',
            payload: false,
          });
          setLassTime();
          if (flag) {
            yield call(redisInit, {});
            // yield put(routerRedux.push('/customer/index'));
            // yield put(routerRedux.push('/')); // @todo 等首页做好后这里需要改为上面一样一行
            yield put({
              type: 'user/handleGetMenu',
              payload: { sysId: 12 },
            });
            // 对客首页
            yield put(routerRedux.push('/customer/index'));
          }
        }
      }
      return true;
    },

    // 手机登录
    *phoneLoginCustomer({ payload, flag = true, callback1, callback2 }, { call, put }) {
      const res = yield call(mobileLogin, payload.code, payload.mobile);
      removeAuthToken();
      if (res && res.status === 200 && res.data.status === '0000' && res.data.errMsg) {
        // 成功：{"status":200,"message":"success","data":{"errMsg":"这里是成功后的token值","status":"0000"},"rel":true}
        // 将token放入cookies中缓存
        yield call(setAuthToken, res.data.errMsg);
        // 2022年05月17日14:09:59 吕世光 对客登录标识
        yield call(setCustomerFlag);
        // 检查密码是否未修改
        const response = yield call(handleCheckPassowrdAPI, payload);
        if (response && response.status === 200 && response.data === true) {
          if (callback2) callback2();
        } else if (response && response.status === 200 && response.data === false) {
          // 将登录标识存储至全局
          yield call(setNountType, decryptText(payload.nountype, ENCRYPTED_PASSWORD()));
          yield call(setSys, 12); // 对客平台，SYSID=12
          yield put({
            type: 'modelSwitch',
            payload: false,
          });
          setLassTime();
          if (flag) {
            yield call(redisInit, {});
            // yield put(routerRedux.push('/customer/index'));
            // yield put(routerRedux.push('/')); // @todo 等首页做好后这里需要改为上面一样一行
            // 请求对客菜单
            yield put({
              type: 'user/handleGetMenu',
              payload: { sysId: 12 },
            });
            // 对客首页
            yield put(routerRedux.push('/customer/index'));
          }
        }
      } else {
        // 失败：{"status":200,"message":"success","data":{"errMsg":"验证码错误！！！","status":"1111"},"rel":true}
        let messageText = flag ? '账户或密码错误，请再次输入!' : '密码错误!请再次输入';
        if (res?.data?.errMsg) {
          messageText = `登录失败，${res.data.errMsg}`;
        }
        message.warn(messageText, 5);
        if (callback1) callback1();
      }

      return true;
    },

    // 忘记密码，验证手机和验证码是否正确
    *handleForgotPassword({ payload, callback }, { call }) {
      const response = yield call(forgotPassword, payload.code, payload.mobile);
      if (response && response.status === 200 && response.data.status === '0000') {
        //成功：{"status":200,"message":"success","data":{"errMsg":"Success","status":"0000"},"rel":true}
        if (callback) callback();
      } else {
        // 失败：{"status":200,"message":"success","data":{"errMsg":"验证码错误！！","status":"9999"},"rel":true}
        message.error(`确认信息失败 ! 错误信息 : ${response.data.errMsg}`, 6);
      }
    },

    // 忘记密码，修改密码
    *handleForgotPasswordFunc({ payload, callback1, callback2 }, { call }) {
      const response = yield call(handleForgetUpdatePasswordAPI, payload.password, payload.mobile);
      if (response && response.status === 200) {
        // {"status":200,"message":"success","rel":true}
        message.success('修改成功 , 请使用新密码重新登录 !', 8); // 延迟8秒后才关闭
        if (callback1) callback1();
      } else {
        message.error(`修改失败 ! 错误信息 : ${response.data.errMsg}`, 6);
        if (callback2) callback2();
      }
    },

    // 城市
    *cityList({ payload }, { call, put }) {
      // console.log(' 快捷查询，城市列表===参数===', payload);
      const response = yield call(cityListAPI);
      if (response) {
        //成功：
        yield put({
          type: 'cityListToData',
          payload: {
            citys: response,
          },
        });
      }
    },
    // 银行
    *bankList({ payload, callback }, { call, put }) {
      // console.log(' 快捷查询，银行列表===参数===', payload);
      const response = yield call(bankListAPI);
      //成功：
      yield put({
        type: 'bankListToData',
        payload: {
          banks: response, // [...bankArr],
        },
      });
      if (callback) callback();
    },

    // 快捷查询，开户行列表（右侧）
    *depositList({ payload }, { call, put }) {
      // console.log(' 快捷查询，开户行列表===参数===', payload);
      const response = yield call(proAccountOutlets, payload);
      // console.log(' 快捷查询，开户行列表===参数===response===', response);
      if (response && response.status === 200) {
        //成功：
        const t = response?.data?.total ? response.data.total : 0;
        const dataSource = [
          {
            key: '1',
            name: '开户号1',
            address: '318100000019',
          },
          {
            key: '2',
            name: '开户号2',
            address: '318100000019',
          },
          {
            key: '3',
            name: '开户号3',
            address: '318100000019',
          },
          {
            key: '4',
            name: '开户号4',
            address: '318100000019',
          },
          {
            key: '5',
            name: '开户号5',
            address: '318100000019',
          },
          {
            key: '6',
            name: '开户号6',
            address: '318100000019',
          },
          {
            key: '7',
            name: '开户号7',
            address: '318100000019',
          },
          {
            key: '8',
            name: '开户号8',
            address: '318100000019',
          },
          {
            key: '9',
            name: '开户号9',
            address: '318100000019',
          },
          {
            key: '10',
            name: '开户号10',
            address: '318100000019',
          },
          {
            key: '11',
            name: '开户号11',
            address: '318100000019',
          },
          {
            key: '12',
            name: '开户号12',
            address: '318100000019',
          },
        ];
        const dataSource2 = [
          {
            key: '13',
            name: '开户号13',
            address: '318100000019',
          },
          {
            key: '14',
            name: '开户号13',
            address: '318100000019',
          },
        ];
        let d = payload.currentPage === 1 ? dataSource : dataSource2;
        yield put({
          type: 'depositListToData',
          payload: response.data,
          // payload: {
          //   rows: d, // response.data
          //   total: t,
          // },
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
    depositListToData(state, action) {
      return {
        ...state,
        depositListData: action.payload,
      };
    },
    cityListToData(state, action) {
      /*
        {
          "a": [
            {
              "SZM": "a",
              "FCODE": "513200",
              "FNAME": "阿坝藏族羌族自治州"
            },
            {
              "SZM": "a",
              "FCODE": "652900",
              "FNAME": "阿克苏地区"
            }
          ],
          "b": [
            {
              "SZM": "b",
              "FCODE": "150800",
              "FNAME": "巴彦淖尔市"
            }
          ]
        }

        转为
        [
          {
            title: 'A',
            data: [
              {
                "FCODE": "513200",
                "FNAME": "阿坝藏族羌族自治州"
              }
            ],
          },
          {
            title: 'B',
            data: [
              {
                "FCODE": "150800",
                "FNAME": "巴彦淖尔市"
              }
            ],
          }
        ]
      */
      const data = action.payload.citys;
      let arr = []; // 结果列表
      for (let [k, v] of Object.entries(data)) {
        if (k) {
          let key = k.toUpperCase();
          const kcode = key.charCodeAt();
          // console.log(key.charCodeAt()); //获取键
          // console.log(v); //获取值
          if (kcode >= 65 && kcode <= 90) {
            let vdList = [];
            if (v) {
            }
            arr[kcode - 65] = {
              title: key,
              data: v ? v : [],
            };
          }
        }
      }
      // 检查其中有空的赋值
      for (let i = 0; i < arr.length; i++) {
        // console.log('>>>>>>>', arr[i])
        if (!arr[i]) {
          arr[i] = {
            title: String.fromCharCode(i + 65),
            data: [],
          };
        }
      }
      // console.log('citys转换后===========', arr)
      // const cityArr = [
      //   {
      //     title: 'A',
      //     data: [
      //       {
      //         "FCODE": "513200",
      //         "FNAME": "阿坝藏族羌族自治州"
      //       }
      //     ],
      //   },
      //   {
      //     title: 'B',
      //     data: [
      //       {
      //         "FCODE": "150800",
      //         "FNAME": "巴彦淖尔市"
      //       }
      //     ],
      //   }
      // ];
      return {
        ...state,
        cityListData: {
          // action.payload,
          citys: arr, // cityArr,
        },
      };
    },
    bankListToData(state, action) {
      const data = action.payload.banks;
      let arr = []; // 结果列表
      for (let [k, v] of Object.entries(data)) {
        if (k) {
          let key = k.toUpperCase();
          const kcode = key.charCodeAt();
          // console.log(key.charCodeAt()); //获取键
          // console.log(v); //获取值
          if (kcode >= 65 && kcode <= 90) {
            let vdList = [];
            if (v) {
            }
            arr[kcode - 65] = {
              title: key,
              data: v ? v : [],
            };
          }
        }
      }
      // 检查其中有空的赋值
      for (let i = 0; i < arr.length; i++) {
        // console.log('>>>>>>>', arr[i])
        if (!arr[i]) {
          arr[i] = {
            title: String.fromCharCode(i + 65),
            data: [],
          };
        }
      }
      // console.log('banks转换后===========', arr)
      // let bankArr = [
      //   {
      //     title: 'B',
      //     data: [
      //       {
      //         "FCODE": "318",
      //         "FNAME": "渤海银行"
      //       }
      //     ],
      //   },
      //   {
      //     title: 'C',
      //     data: [
      //       {
      //         "FCODE": "401",
      //         "FNAME": "诚信社"
      //       },
      //       {
      //         "FCODE": "313",
      //         "FNAME": "城商行"
      //       }
      //     ],
      //   }
      // ];
      return {
        ...state,
        bankListData: {
          // action.payload,
          banks: arr, // bankArr
        },
      };
    },
  },
};

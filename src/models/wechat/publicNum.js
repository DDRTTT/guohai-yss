import {
  addPublic,
  getSelectList,
  investorOpenFileUpload,
  mesMouldAdd,
  mesMouldDelete,
  mesMouldList,
  mesMouldPreview,
  mesMouldSwith,
  mesMouldUpdate,
  parentList,
  publicList,
  publicMenu,
  publicMenuAdd,
  publicMenuDelete,
  publicMenuPublic,
  publicMenuUpdate,
  publicUntie,
  publicUpdate,
  userDetail,
  userListAdd,
  userListDelete,
  userListQue,
  userListUpdate,
  wechatDetail,
  wechatListQue,
  wechatReStart,
} from '../../services/Wechat/publicNum';

import { message } from 'antd';
import { cloneDeep } from 'lodash';

let model = {
  namespace: 'publicNum',
  state: {
    loading: true,

    editPublic: [
      {
        label: "公众号名称",
        filedName: "appName",
        showType: "input",
        initialValue: '',
        required: true,
        tipInfo: "",
        tipShow: true
      }, {
        label: "AppID（公众号）",
        filedName: "appId",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "用于自定义菜单等高级功能",
        tipShow: true
      }, {
        label: "公众号原始id",
        filedName: "developerId",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "比如：gh_423dwjkeww3",
        tipShow: true
      }, {
        label: "公众号昵称",
        filedName: "appNickName",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: true
      }, {
        label: "开发者密码",
        filedName: "appSecret",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: true
      }, {
        label: "开发者令牌",
        filedName: "token",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: true
      }, {
        label: "菜单服务域",
        filedName: "redirectDomain",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "重定向菜单服务域",
        tipShow: true
      }, {
        label: "页面服务域",
        filedName: "serviceDomain",
        showType: "input",
        initialValue: "",
        required: false,
        tipInfo: "普通菜单页面服务域",
        tipShow: true
      }, {
        label: "消息加密方式",
        filedName: "encodType",
        showType: "select",
        initialValue: "",
        required: false,
        tipInfo: "",
        tipShow: true
      }, {
        label: "AesEncodingKey",
        filedName: "encodAeskey",
        showType: "input",
        initialValue: "",
        required: false,
        tipInfo: "加密消息的AesEncodingKey",
        tipShow: true
      }, {
        label: "接入token验证",
        filedName: "isCheckeToken",
        showType: "radio",
        initialValue: 1,
        required: true,
        tipInfo: "是否允许微信服务器接入token验证",
        tipShow: true
      }
    ],
    editPublic2: [
      {
        label: "所属机构",
        filedName: "orgCode",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "机构类型",
        filedName: "orgType",
        showType: "select",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "数据密钥",
        filedName: "encryptKey",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "业务token",
        filedName: "authKey",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "服务地址",
        filedName: "serviceAddr",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }
    ],    //公众号表单控制
    data: {
      rows: [],
      total: 0
    },          //公众号列表
    addPublic: {},         //添加公众号
    updatePublic: {},      //修改公众号
    untiePublic: {},       //解绑公众号
    publicDetail: {
      status: null,
      data: {
        headIcon: null,
      },
    },   //存储公众号详情

    editMenu: [
      {
        label: "排序",
        filedName: "orderNum",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "数字大的排在前面（不填默认为0）",
        tipShow: true
      }, {
        label: "key值",
        filedName: "keyValue",
        showType: "input",
        initialValue: "",
        required: false,
        tipInfo: "菜单对应的key值",
        tipShow: true
      }, {
        label: "链接地址",
        filedName: "linkUrl",
        showType: "input",
        initialValue: "",
        required: false,
        tipInfo: "菜单链接的地址信息",
        tipShow: true
      }
      // {
      //   label:'是否重定向',
      //   filedName:'isRedirect',
      //   showType:'radio',
      //   initialValue:'',
      //   required:false,
      //   tipInfo:'',
      //   tipShow:true,
      // },{
      //   label:'定向服务地址',
      //   filedName:'redirectUrl',
      //   showType:'input',
      //   initialValue:'',
      //   required:false,
      //   tipInfo:'菜单重定向服务地址',
      //   tipShow:true,
      // },{
      //   label:'state标记',
      //   filedName:'state',
      //   showType:'input',
      //   initialValue:'',
      //   required:false,
      //   tipInfo:'重定向时state标记',
      //   tipShow:true,
      // },{
      //   label:'用户标示',
      //   filedName:'scope',
      //   showType:'select',
      //   list:[],
      //   initialValue:'',
      //   required:false,
      //   tipInfo:'重定向时获取用户基本信息的代码标示',
      //   tipShow:true,
      // }
    ],       //菜单管理表单控制
    publicMenu: {
      data: {
        rows: [],
        total: 0
      }
    },    //菜单查询
    publicMenuAdd: {},    //菜单添加
    publicMenuUpdate: {}, //菜单修改
    publicMenuDelete: {}, //菜单删除
    parentList: [],       //父级菜单下拉
    isNew: false,          //判断是否重定向参数

    mesMould: {
      data: {
        total: 0,
        rows: []
      }
    },       //消息模板查询
    mesView: {},           //消息模板预览
    mesAdd: {},            //消息模板添加
    mesLook: {
      data: {
        conInfo: []
      }
    },        //消息模板详情查看
    mesMouldUpdate: {},    //消息模板修改
    mesDelete: {},         //消息模板删除
    mesSwith: {},          //消息模板状态切换

    userMenu: [
      {
        label: "用户代码",
        filedName: "userId",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "用户姓名",
        filedName: "userName",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "性别",
        filedName: "userSex",
        showType: "radio",
        initialValue: "",
        required: false,
        tipInfo: "",
        tipShow: false
      }, {
        label: "密码",
        filedName: "userPwd",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }, {
        label: "所属机构",
        filedName: "userSys",
        showType: "input",
        initialValue: "",
        required: true,
        tipInfo: "",
        tipShow: false
      }
    ],      //业务用户表单控制
    wechatList: {
      data: {
        rows: [],
        total: 0
      }
    },    //微信用户查询
    wechatById: {},        //微信用户 详情查询
    businessList: {
      data: {
        rows: [],
        total: 0
      }
    },  //业务用户查询
    businessById: {},          //业务用户 详情查询


    busUserAdd: { status: null },        //业务用户添加
    busUserUpdate: { status: null },     //业务用户修改

    //页码存储
    currentPage: 1,
    currentPage2: 1,
    currentPage3: 1,

    //用戶列表
    currentPage4: 1,
    currentPage5: 1,

    //词汇字典下拉
    orgTypeList: [],
    busTypeList: [],

    //数据存储
    dataStore: [],

    templateList: []  //下载模板列表
  },

  effects: {
    //公众号列表查询
    * fetch({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });

      let response = yield call(publicList, payload);

      if (!payload.id) {
        yield put({
          type: "save",
          payload: response.data
        });
        yield put({
          type: "currentPage",
          payload: payload.start
        });
      } else {
        //查询公众号详情
        yield put({
          type: "publicDetail",
          payload: {
            data: response.data.rows[0],
            status: 200
          }
        });
      }

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //添加公众号
    * add({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(addPublic, payload);

      if (response.status == 200) {
        message.success("添加成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "addPublic",
        payload: response
      });
      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //修改公众号
    * update({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicUpdate, payload);

      if (response.status == 200) {
        message.success("修改成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "updatePublic",
        payload: response
      });
      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //控制菜单管理表单
    * menuForm({ payload }, { call, put, select }) {
      yield put({
        type: "changeLoading",
        payload: true
      });

      let oldMenu = yield select(state => state.publicNum.editMenu);
      yield put({
        type: "editMenu",
        payload: dataChange(payload.item, oldMenu, payload.type)
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //控制菜单管理表单
    * publicForm({ payload }, { call, put, select }) {
      yield put({
        type: "changeLoading",
        payload: true
      });

      let oldPublic = yield select(state => state.publicNum.editPublic);
      yield put({
        type: "editPublic",
        payload: dataChange(payload.item, oldPublic, payload.type)
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    * publicForm2({ payload }, { call, put, select }) {
      yield put({
        type: "changeLoading",
        payload: true
      });

      let oldPublic2 = yield select(state => state.publicNum.editPublic2);

      yield put({
        type: "editPublic2",
        payload: dataChange(payload.item, oldPublic2, payload.type)
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //查询菜单管理
    * menu({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicMenu, payload);
      yield put({
        type: "publicMenu",
        payload: response
      });

      yield put({
        type: "currentPage2",
        payload: payload.start
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //添加公众号菜单
    * menuAdd({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicMenuAdd, payload);
      if (response.status == 200) {
        message.success("添加成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "publicMenuAdd",
        payload: response
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //修改公众号菜单
    * menuUpdate({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicMenuUpdate, payload);
      if (response.status == 200) {
        message.success("修改成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "publicMenuUpdate",
        payload: response
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //发布公众号菜单
    * menuPublic({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicMenuPublic, payload);
      if (response.status == 200) {
        message.success("发布成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //公众号父级菜单下拉
    * menuParentList({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(parentList, payload);
      yield put({
        type: "parentList",
        payload: response.data

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //删除公众号菜单
    * menuDelete({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicMenuDelete, payload);
      if (response.status == 200) {
        message.success("删除成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "publicMenuDelete",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //查询消息模板列表
    * mould({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(mesMouldList, payload);
      yield put({
        type: "mesMould",
        payload: response

      });
      yield put({
        type: "currentPage3",
        payload: payload.currentPage
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //消息模板预览
    * mouldView({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let response = yield call(mesMouldPreview, payload);

      yield put({
        type: 'mesView',
        payload: response,

      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    //添加消息模板
    * mouldAdd({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(mesMouldAdd, payload);

      if(response.status!=200){
        message.error(response.message)
      }

      yield put({
        type: "mesAdd",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //查看消息模板详情
    * mouldLook({ payload }, { call, put }) {
      yield put({
        type: "mesLook",
        payload: payload.data

      });
    },

    //修改消息模板
    * mouldUpdate({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(mesMouldUpdate, payload);

      if(response.status!=200){
        message.error(response.message)
      }

      yield put({
        type: "mesMouldUpdate",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //删除消息模板
    * mouldDelete({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(mesMouldDelete, payload);
      if (response.status == 200) {
        message.success("删除成功");
      } else {
        message.error(response.message);
      }
      yield put({
        type: "mesDelete",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //消息模板状态切换
    * mouldSwith({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(mesMouldSwith, payload);
      yield put({
        type: "mesSwith",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //存储数据
    * memory({ payload }, { call, put }) {
      yield put({
        type: "dataStore",
        payload: payload.list

      });
    },

    //查询微信用户列表
    * wechat({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(wechatListQue, payload);
      yield put({
        type: "wechatList",
        payload: response

      });

      yield put({
        type: "currentPage4",
        payload: payload.start
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //刷新微信用户
    * reStart({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(wechatReStart, payload);

      yield put({
        type: "changeLoading",
        payload: false
      });
      return response
    },

    //查询微信用户 详情
    * wechatDetailed({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(wechatDetail, payload);
      yield put({
        type: "wechatById",
        payload: response.data

      });

      yield put({
        type: "currentPage4",
        payload: payload.start
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //查询业务用户列表
    * user({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(userListQue, payload);

      yield put({
        type: "businessList",
        payload: response

      });

      yield put({
        type: "currentPage5",
        payload: payload.start
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //查询业务用户 详情
    * userDetailed({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(userDetail, payload);
      yield put({
        type: "businessById",
        payload: response.data[0]

      });

      yield put({
        type: "currentPage5",
        payload: payload.start
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //控制菜单管理表单
    * userForm({ payload }, { call, put, select }) {
      yield put({
        type: "changeLoading",
        payload: true
      });

      let oldPublic = yield select(state => state.publicNum.userMenu);

      yield put({
        type: "userMenu",
        payload: dataChange(payload.item, oldPublic, payload.type)
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //添加业务用户
    * userAdd({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(userListAdd, payload.payload);

      if (response.status == 200) {
        message.success("业务用户添加成功");
        let response = yield call(userListQue, payload.addParam);
        yield put({
          type: "businessList",
          payload: response

        });
        yield put({
          type: "currentPage4",
          payload: payload.start
        });

      } else {
        message.error(response.message);
      }

      yield put({
        type: "busUserAdd",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //修改业务用户
    * userUpdate({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(userListUpdate, payload.payload);

      if (response.status == 200) {
        message.success("业务用户修改成功");
        let response = yield call(userListQue, payload.addParam);
        yield put({
          type: "businessList",
          payload: response

        });
        yield put({
          type: "currentPage4",
          payload: payload.start
        });

      } else {
        message.error(response.message);
      }

      yield put({
        type: "busUserUpdate",
        payload: response

      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //修改业务用户
    * userDelete({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      //第一次调用这个接口 判断是否被绑定
      // if (payload.time == 1) {
      //   let response = yield call(userListBind, payload.one);
      //   //参数大于0 被微信用户绑定
      //   if (response.data > 0) {
      //
      //   } else {
      //     let response = yield call(userListDelete, payload);
      //     let store = response;
      //     if (store.status == 200) {
      //       message.success("业务用户删除成功");
      //       let response = yield call(userListQue, payload.payload);
      //       yield put({
      //         type: "businessList",
      //         payload: response
      //
      //       });
      //       yield put({
      //         type: "currentPage4",
      //         payload: payload.start
      //       });
      //     } else {
      //       message.error(store.message);
      //     }
      //   }
      // }
      //第二次调用这个接口 直接删除
      // else{
      //   let response = yield call(userListDelete, payload);
      //   let store = response;
      //   if (store.status == 200) {
      //     message.success("业务用户删除成功");
      //     let response = yield call(userListQue, payload.payload);
      //     yield put({
      //       type: "businessList",
      //       payload: response
      //
      //     });
      //     yield put({
      //       type: "currentPage4",
      //       payload: payload.start
      //     });
      //   } else {
      //     message.error(store.message);
      //   }
      // }

        let response = yield call(userListDelete, payload.one);
        let store = response;
        if (store.status == 200) {
          message.success("业务用户删除成功");
          let response = yield call(userListQue, payload.payload);
          yield put({
            type: "businessList",
            payload: response

          });
          yield put({
            type: "currentPage4",
            payload: payload.start
          });
        } else {
          message.error(store.message);
        }

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //公众号删除
    * Untie({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response = yield call(publicUntie, payload);

      if (response.status == 200) {
        message.success("删除成功");
      } else {
        message.error(response.message);
      }

      yield put({
        type: "untiePublic",
        payload: response
      });

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //词汇字典下拉
    * selectList({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      let response  = yield call(getSelectList, payload);

      if (payload.fcode == "orgType") {
        yield put({
          type: "orgTypeList",
          payload: response

        });
      } else if (payload.fcode == "wechatMsgType") {
        yield put({
          type: "busTypeList",
          payload: response

        });
      } else if (payload.fcode == "BUSUSER_FILE") {
        yield put({
          type: "templateList",
          payload: response

        });
      }

      yield put({
        type: "changeLoading",
        payload: false
      });
    },

    //判断是否重定向参数
    * isNew({ payload }, { call, put }) {
      yield put({
        type: "isNew",
        payload: !payload
      });
    },

    //文件导入
    * uploadFile({ payload }, { call, put }) {
      yield put({
        type: "changeLoading",
        payload: true
      });
      const response = yield call(investorOpenFileUpload, payload);
      if (response) {
        if (response.status === 200 && response.message === "success") {
          message.success("上传文件成功");
        } else {
          if (response.error) {
            message.error(response.message);
          } else {
            message.error("文件导入失败");
          }
        }
      } else {
        message.error("文件导入失败");
      }
      yield put({
        type: "changeLoading",
        payload: false
      });
    }

  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      };
    },

    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },

    addPublic(state, action) {
      return {
        ...state,
        addPublic: action.payload
      };
    },

    updatePublic(state, action) {
      return {
        ...state,
        updatePublic: action.payload
      };
    },

    untiePublic(state, action) {
      return {
        ...state,
        untiePublic: action.payload
      };
    },

    publicDetail(state, action) {
      return {
        ...state,
        publicDetail: action.payload
      };
    },

    publicMenu(state, action) {
      return {
        ...state,
        publicMenu: action.payload
      };
    },

    publicMenuAdd(state, action) {
      return {
        ...state,
        publicMenuAdd: action.payload
      };
    },

    publicMenuUpdate(state, action) {
      return {
        ...state,
        publicMenuUpdate: action.payload
      };
    },

    publicMenuDelete(state, action) {
      return {
        ...state,
        publicMenuDelete: action.payload
      };
    },

    //父级菜单下拉
    parentList(state, action) {
      return {
        ...state,
        parentList: action.payload
      };
    },

    //消息模板查询
    mesMould(state, action) {
      return {
        ...state,
        mesMould: action.payload
      };
    },

    //消息模板预览
    mesView(state, action) {
      return {
        ...state,
        mesView: action.payload,
      };
    },

    //消息模板详情查询
    mesLook(state, action) {
      return {
        ...state,
        mesLook: action.payload
      };
    },

    //消息模板修改
    mesMouldUpdate(state, action) {
      return {
        ...state,
        mesMouldUpdate: action.payload
      };
    },

    //消息模板删除
    mesDelete(state, action) {
      return {
        ...state,
        mesDelete: action.payload
      };
    },

    //消息模板状态切换
    mesSwith(state, action) {
      return {
        ...state,
        mesSwith: action.payload
      };
    },

    //消息模板添加
    mesAdd(state, action) {
      return {
        ...state,
        mesAdd: action.payload
      };
    },

    //微信用户查询
    wechatList(state, action) {
      return {
        ...state,
        wechatList: action.payload
      };
    },

    //微信用户 详情
    wechatById(state, action) {
      return {
        ...state,
        wechatById: action.payload
      };
    },

    //业务用户查询
    businessList(state, action) {
      return {
        ...state,
        businessList: action.payload
      };
    },

    //业务用户 详情
    businessById(state, action) {
      return {
        ...state,
        businessById: action.payload
      };
    },

    //业务用户表单控制
    userMenu(state, action) {
      return {
        ...state,
        userMenu: action.payload
      };
    },

    //业务用户添加
    busUserAdd(state, action) {
      return {
        ...state,
        busUserAdd: action.payload
      };
    },

    //业务用户修改
    busUserUpdate(state, action) {
      return {
        ...state,
        busUserUpdate: action.payload
      };
    },

    //公众号管理表单控制
    editPublic(state, action) {
      return {
        ...state,
        editPublic: action.payload
      };
    },

    //公众号管理表单控制
    editPublic2(state, action) {
      return {
        ...state,
        editPublic2: action.payload
      };
    },

    //菜单管理表单控制
    editMenu(state, action) {
      return {
        ...state,
        editMenu: action.payload
      };
    },

    //存储公众号页码
    currentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload
      };
    },

    //存储菜单管理页码
    currentPage2(state, action) {
      return {
        ...state,
        currentPage2: action.payload
      };
    },

    //存储消息模板页码
    currentPage3(state, action) {
      return {
        ...state,
        currentPage3: action.payload
      };
    },

    //存储微信用户列表页码
    currentPage4(state, action) {
      return {
        ...state,
        currentPage4: action.payload
      };
    },

    //存储業務用户列表页码
    currentPage5(state, action) {
      return {
        ...state,
        currentPage5: action.payload
      };
    },

    //机构类型下拉
    orgTypeList(state, action) {
      return {
        ...state,
        orgTypeList: action.payload
      };
    },

    //业务分类下拉
    busTypeList(state, action) {
      return {
        ...state,
        busTypeList: action.payload
      };
    },

    //下载列表下拉
    templateList(state, action) {
      return {
        ...state,
        templateList: action.payload
      };
    },

    //数据存储
    dataStore(state, action) {
      return {
        ...state,
        dataStore: action.payload
      };
    },

    //判断是否重定向
    isNew(state, action) {
      return {
        ...state,
        isNew: action.payload
      };
    }
  }
};

//处理数据
function dataChange(item, old, type) {
  let oldMenu;
  const tempOld = cloneDeep(old);
  if (type == "edit") {
    for (var e in item) {
      tempOld.map((index, i) => {
        if (e == index.filedName) {
          index.initialValue = item[index.filedName];
        }
      });
    }
    ;
  } else {
    tempOld.map((index, i) => {
      index.initialValue = '';
    });
  }
  oldMenu = tempOld;
  return oldMenu;
}

export default model;

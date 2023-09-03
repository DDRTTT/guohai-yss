import {
  otherOrganInforList,
  myOrganInforList,
  getDictsAPI,
  toExamineAPI,
  myOrgDeleteAPI,
  otherOrgDeleteAPI,
  toExamines,
  fileTypeAPI,
  fileDelectAPI,
} from '@/services/institutionalInfoManager';
import { message } from 'antd';

export default {
  namespace: 'institutionalInfoManager',
  state: {
    // 本家机构信息列表
    myMechanismList: [],
    // 其他机构信息列表
    otherMechanismList: [],
    // 机构类型信息/资质类型信息
    typeList: [],
    // 上级机构
    SuperiorOrgs: [],
    // 所属机构和机构内码
    myOrgInfo: [],
    // 本机机构文件类型
    fileType: [],
  },

  effects: {
    // 获取机构信息列表
    *getOtherInstituInfor({ payload }, { call, put }) {
      const response = yield call(otherOrganInforList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setOtherInstituInfor',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 本家机构
    *getMyInstituInfor({ payload }, { call, put }) {
      const response = yield call(myOrganInforList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setMyInstituInfor',
          payload: response.data.home,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 字典
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(getDictsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setCodeList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 审核/反审核
    *examine({ payload }, { call }) {
      const response = yield call(toExamineAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // 本家机构删除
    *myOrgDelete({ payload }, { call }) {
      const response = yield call(myOrgDeleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('删除成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // 其他机构删除
    *otherOrgDelete({ payload }, { call }) {
      const response = yield call(otherOrgDeleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('删除成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // 批量审核/反审核
    *toExamines({ payload }, { call }) {
      const response = yield call(toExamines, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // 本机机构文件类型
    *fileType({ payload }, { call, put }) {
      const response = yield call(fileTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getfileType',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
      return response;
    },
    *fileDelect({ payload }, { call }) {
      const response = yield call(fileDelectAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('操作成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
  },
  reducers: {
    setOtherInstituInfor(state, { payload }) {
      return {
        ...state,
        otherMechanismList: payload.out,
        myMechanismList: payload.home,
      };
    },
    // setMyInstituInfor(state, { payload }) {
    //   return {
    //     ...state,
    //     myMechanismList: payload,
    //   };
    // },
    setCodeList(state, { payload }) {
      return {
        ...state,
        typeList: payload,
      };
    },
    getSuperiorOrg(state, { payload }) {
      return {
        ...state,
        SuperiorOrgs: payload,
      };
    },
    getfileType(state, { payload }) {
      return {
        ...state,
        fileType: payload,
      };
    },
  },
};

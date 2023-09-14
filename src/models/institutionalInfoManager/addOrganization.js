import {
  getDictsAPI,
  addOrg,
  superiorOrg,
  details,
  updateOrg,
  ascriptionAPI,
  queryimgAPI,
} from '@/services/institutionalInfoManager/addOrganization';
import { message } from 'antd';

export default {
  namespace: 'addOrganization',
  state: {
    codeList: [],
    SuperiorOrgs: [],
    organization: [],
    detailsList: {},
    myOrglst: {},
    img: '',
  },

  effects: {
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
    //保存
    *preservation({ payload }, { call, put }) {
      const response = yield call(addOrg, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // 修改
    *modifyOrg({ payload }, { call, put }) {
      const response = yield call(updateOrg, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('修改成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    // *superiorOrgList({ payload }, { call, put }) {
    //   const response = yield call(superiorOrg, payload);
    //   if (response && response.status === 200) {
    //     yield put({
    //       type: 'getSuperiorOrg',
    //       payload: response.data,
    //     });
    //   } else {
    //     message.error('查询失败');
    //   }
    // },
    //查看详情
    *getDetails({ payload }, { call, put }) {
      const response = yield call(details, payload);
      let flag = false;
      if (response && response.status === 200) {
        console.log(response, '详情信息');
        flag = true;
        let data = response?.data;
        if (data.registCapital) {
          data.registCapital = new Number(data.registCapital || "");
        }
        console.log(data);
        yield put({
          type: 'setDetails',
          payload: data,
        });
      } else {
        // message.error('详情查询失败');
      }
      return flag;
    },
    //机构
    *superiorOrgList({ payload }, { call, put }) {
      const response = yield call(superiorOrg, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'getSuperiorOrg',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
      return flag;
    },
    //所属组织机构和机构内码
    *getAscriptionAPI({ payload }, { call, put }) {
      const response = yield call(ascriptionAPI, payload);
      console.log(response, '机构内码');
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'setAscriptionAPI',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
      return flag;
    },
    //所属组织机构和机构内码
    *getqueryimg({ payload }, { call, put }) {
      const response = yield call(queryimgAPI, payload);
      console.log(response, '机构内码');
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'setgetqueryimg',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
      return flag;
    },
  },
  reducers: {
    setCodeList(state, { payload }) {
      return {
        ...state,
        codeList: payload,
      };
    },
    getSuperiorOrg(state, { payload }) {
      return {
        ...state,
        SuperiorOrgs: payload,
      };
    },
    setDetails(state, { payload }) {
      return {
        ...state,
        detailsList: payload,
      };
    },
    setAscriptionAPI(state, { payload }) {
      return {
        ...state,
        myOrglst: payload,
      };
    },
    setgetqueryimg(state, { payload }) {
      return {
        ...state,
        img: payload,
      };
    },
  },
};

import {
  getDepartLeaderAPI,
  staffListAPI,
  departmentAPI,
  empInfoPreseAPI,
  contactsAPI,
  organNameAPI,
  contactSaveAPI,
  contactDeleteAPI,
  employeeDeleteAPI,
  getDictsAPI,
  superiorOrg,
  addOrg,
  details,
  getOrgDropDownListAPI
} from '@/services/institutionalInfoManager/modify';
import { message } from 'antd';
export default {
  namespace: 'modify',
  state: {
    //机构人员列表
    departLeaderList:[],
    //员工列表
    stafList: [],
    //部门
    department: [],
    //联系人列表
    contactsList: [],
    //机构名称
    organName: [],
    //机构详情信息
    detailsList: [],
    //字典
    codeList: [],
    //所属组织机构
    SuperiorOrgs: [],
    //详情
    detailsList: {},
    // 获取详情
    detailOtherData: {}
  },

  effects: {
    //字典信息
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
    //获取机构人员列表
    *getDepartLeaderFunc({ payload }, { call, put }) {
      const response = yield call(getDepartLeaderAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'departLeaderList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //获取机构人员列表
    *getOrgDropDownList({ payload }, { call, put }) {
      const response = yield call(getOrgDropDownListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'departLeaderList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //获取员工信息列表 有参数
    *getStafList({ payload }, { call, put }) {
      const response = yield call(staffListAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setStafList',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //获取机构部门
    *getDepartment({ payload }, { call, put }) {
      const response = yield call(departmentAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setDepartment',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
      return response;
    },
    //员工新增(保存，修改)
    *getEmpInfoPrese({ payload }, { call, put }) {
      const response = yield call(empInfoPreseAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error('查询失败');
      }
      return flag;
    },
    //联系人列表
    *getContacts({ payload }, { call, put }) {
      const response = yield call(contactsAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setContacts',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //机构名称
    *getOrganName({ payload }, { call, put }) {
      const response = yield call(organNameAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setOrganName',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //联系人保存
    *getSaveContent({ payload }, { call, put }) {
      const response = yield call(contactSaveAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    //联系人删除
    *getDeleteContent({ payload }, { call, put }) {
      const response = yield call(contactDeleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('删除成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    //员工删除
    *getEmployeeDelete({ payload }, { call, put }) {
      const response = yield call(employeeDeleteAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('删除成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return flag;
    },
    //机构详情机构
    *getDetails({ payload }, { call, put }) {
      const response = yield call(details, payload);
      let flag = false;
      if (response && response.status === 200) {
        console.log(response, '详情信息');
        flag = true;
        yield put({
          type: 'setDetails',
          payload: response.data,
        });
      } else {
        // message.error('详情查询失败');
      }
      return flag;
    },
    // 获取机构详情
    *getOtherDetails({ payload }, { call, put }) {
      const response = yield call(details, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setOtherDetails',
          payload: response.data,
        });
      }
    },
    // 组织架构机构修改保存
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
    //所属组织机构
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
    //机构的新增、修改
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
  },
  reducers: {
    departLeaderList(state, { payload }) {
      return {
        ...state,
        departLeaderList: payload,
      };
    },
    setStafList(state, { payload }) {
      return {
        ...state,
        stafList: payload,
      };
    },
    setDepartment(state, { payload }) {
      return {
        ...state,
        department: payload,
      };
    },
    setContacts(state, { payload }) {
      return {
        ...state,
        contactsList: payload,
      };
    },
    setOrganName(state, { payload }) {
      return {
        ...state,
        organName: payload,
      };
    },
    //机构信息详情接口
    setDetails(state, { payload }) {
      return {
        ...state,
        detailsList: payload,
      };
    },
    //机构信息详情接口获取数据
    setOtherDetails(state, { payload }) {
      return {
        ...state,
        detailOtherData: payload,
      };
    },
    //字典
    setCodeList(state, { payload }) {
      return {
        ...state,
        codeList: payload,
      };
    },
    //所属组织机构
    getSuperiorOrg(state, { payload }) {
      return {
        ...state,
        SuperiorOrgs: payload,
      };
    },
  },
};

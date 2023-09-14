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
  getCodeList,
  superiorOrg,
  departmentAPI,
  contactsAPI,
  contactDeleteAPI,
  staffListAPI,
  employOrgAPI,
  details,
  addOrg,
  ascriptionAPI,
  blacklistAPI,
  contactSaveAPI,
  positionTypeAPI,
  getPositionAPI,
  getDetailsAPI,
  preservationAPI,
  employeeDeleteAPI,
  getDepartLeaderAPI,
  orgtionDeleteAPI,
  revokeAPI,
} from '@/services/orgInfoManagement';
import { message } from 'antd';

export default {
  namespace: 'orgInfoManagement',
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
    //词汇字典
    codeList: [],
    //上级机构
    SuperiorOrgs: [],
    //组织架构树形节点
    department: [],
    //联系人列表信息
    contactsList: [],
    //员工列表
    stafList: [],
    //员工新增中的所属部门
    employOrg: [],
    //查看详情信息
    detailsList: [],
    //机构内码
    myOrglst: {},
    //机构id
    orgid: '',
    //员工-职务类型
    positionTypeList: [],
    // 员工-岗位
    setPosition: [],
    //员工详情信息
    detailsLists: [],
    //机构人员列表
    departLeaderList: [],
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
    //内部组织架构删除
    *orgtionDelete({ payload }, { call }) {
      const response = yield call(orgtionDeleteAPI, payload);
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
    //词汇字典
    *getCodeLists({ payload }, { call, put }) {
      const response = yield call(getCodeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setCodeLists',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //上级机构
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
    // 归属部门(员工新增时候用)
    *getEmployOrg({ payload }, { call, put }) {
      const response = yield call(employOrgAPI, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'setEmployOrg',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //查看详情
    *getDetails({ payload }, { call, put }) {
      const response = yield call(details, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        let data = response?.data;
        if (data.registCapital) {
          data.registCapital = new Number(data.registCapital || '');
        }
        yield put({
          type: 'setDetails',
          payload: data,
        });
      } else {
        // message.error('详情查询失败');
      }
      return { flag: flag, data: response.data };
    },
    //机构保存、修改
    *preservation({ payload }, { call, put }) {
      const response = yield call(addOrg, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
        flag = true;
      } else {
        message.error(response.message);
      }
      return { flag, data: response.data };
    },
    //所属组织机构和机构内码
    *getAscriptionAPI({ payload }, { call, put }) {
      const response = yield call(ascriptionAPI, payload);
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
    //批量移入黑名单
    *getBlacklist({ payload }, { call, put }) {
      const response = yield call(blacklistAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        message.success('操作成功');
      } else {
        message.error(response.message);
      }
      return flag;
    },
    //联系人保存/修改
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
    // 员工职务类型
    *getPositionType({ payload }, { call, put }) {
      const response = yield call(positionTypeAPI, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'setPositionType',
          payload: response.data,
        });
      } else {
        message.error('获取失败');
      }
    },
    // 员工-获取岗位
    *getPosition({ payload }, { call, put }) {
      const response = yield call(getPositionAPI, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'setPosition',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
    },
    //员工信息详情
    *getEmployDetails({ payload }, { call, put }) {
      const response = yield call(getDetailsAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        flag = true;
        yield put({
          type: 'setEmployDetails',
          payload: response.data,
        });
      } else {
        message.error('查询失败');
      }
      return flag;
    },
    //员工-保存、修改
    *getPreservation({ payload }, { call }) {
      const response = yield call(preservationAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('保存成功');
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
    //内部组织架构撤销
    *revoke({ payload }, { call }) {
      const response = yield call(revokeAPI, payload);
      let flag = false;
      if (response && response.status === 200) {
        message.success('撤销成功');
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
    setCodeLists(state, { payload }) {
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
    setStafList(state, { payload }) {
      return {
        ...state,
        stafList: payload,
      };
    },
    setEmployOrg(state, { payload }) {
      return {
        ...state,
        employOrg: payload,
      };
    },
    setDetails(state, { payload }) {
      return {
        ...state,
        detailsList: payload ? payload : [],
      };
    },
    setAscriptionAPI(state, { payload }) {
      return {
        ...state,
        myOrglst: payload,
      };
    },
    setPositionType(state, { payload }) {
      return {
        ...state,
        positionTypeList: payload,
      };
    },
    setPosition(state, { payload }) {
      return {
        ...state,
        setPosition: payload,
      };
    },
    setEmployDetails(state, { payload }) {
      return {
        ...state,
        detailsLists: payload,
      };
    },
    departLeaderList(state, { payload }) {
      return {
        ...state,
        departLeaderList: payload,
      };
    },
  },
};

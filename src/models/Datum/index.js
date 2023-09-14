import { message } from 'antd';
import { queryRuleJG, restUserCode } from '@/services/userManager';
import { getPersonal } from '@/services/accountInformation';
import {
  handleAddGroup,
  handleAllProduct,
  handleAuthorization,
  handleAuthorized,
  handleCheckChild,
  handleCheckGroup,
  handleCheckUserCode,
  handleClassRole as handleClassRoles,
  handleDelete,
  handleDelGroup,
  handleGroupProduct,
  handleMemberAdd,
  handleMemberAllPermissions,
  handleMemberDel,
  handleMemberInfo,
  handleMemberManagementList,
  handleMemberPartialPermissions,
  handleMemberPermissionsPage,
  handleMobileOnly,
  handleMyGroups,
  handleOperationAuthority,
  handleOperationAuthorityForData,
  handleOrgInfo,
  handleOrgTypeDictionary,
  handlePermissionClass,
  handlePermissionsByCondition,
  handlePermissionsByConditionForAllCode,
  handleRoleDel,
  handleDelJobAPI,
  handleRoleModify,
  handleRoleNameModify,
  handleUpdateMember,
  orgadd,
  getDictList,
  getDeptAPI,
  saveJobAPI,
  updateJobAPI,
  detailJobAPI,
  getCurrentUserJobList,
  getRoleByPositionsAPI,

  // ----底稿----
  handleDGTreeAPI,
  handleDGProjectsAPI,
  getUserAuthorityAPI,
} from '@/services/datum/index';
import { queryforgtypeNew } from '@/services/file';
import { allmenutree } from '@/services/role';
import cloneDeep from 'lodash/cloneDeep';

let nullObj;
const model = {
  namespace: 'memberManagement',
  state: {
    data: {
      rows: [],
      total: 0,
    },
    members: {},

    partialPermissions: {
      data: [],
    },

    partialPermissionsPage: {
      data: {
        voList: [],
        total: 0,
      },
    },

    allPermissions: {
      data: [],
    },
    allPermissionsForAdd: {
      rows: [],
    },

    memberInfo: {
      data: [{}],
    },
    fprotype: [],
    saveStatus: {
      data: {
        status: '',
      },
    },
    // 新建成员id
    saveId: undefined,
    // 已授权数组
    saveAuthorized: [],
    currentPage: 1,
    // 产品类
    savePermissionClass: [],
    // 我的分组
    saveMyGroup: [],
    // 组件
    saveClassRole: {
      '01': [],
      '02': [],
    },
    // 权限树
    saveAllmenutree: [],
    loading: false,
    loadings: false,
    //----------------------------
    // 产品类数组
    saveCheckedKeys: [],
    // 分组数组
    saveCheckedKeys1: [],
    // 产品数组
    saveSelectedRowKeys: [],
    // 授权方式
    saveAuthorizationMethod: '',

    //-------------------
    saveOrgName: [],
    saveOrgInfo: {},
    saveUserInfo: {},
    saveOrgTypeDictionary: [],
    saveStepOne: {},
    saveOrgId: null,
    saveMobileQueryInfo: {},
    saveInfo: {},
    allPermissionsCode: [],
    saveGroupProduct: {
      data: [],
    },
    saveCheckGroup: {
      addModel1: 'none',
      addModel: false,
    },
    addModel1: 'none',
    saveAddGroup: false,
    saveAddGroupTwo: false,
    saveMoveProduct: [],
    saveMoveProductForEdit: [],
    saveMoveProductForEditKeys: [],
    groups: [],
    proTypes: [],
    selectedRowKeysForShow: [],
    selectedKeys: [],
    handleSaveOldInfo: {},
    current: 3,
    savePack: {},
    saveMoveProductKeys: [],
    selectedRowKeysForAddTableArr: [],
    selectedRowKeysForAddTableArrKey: [],
    handleonCheckProCodesForEdit: [],
    saveCurrent: 0,
    saveFetchParameter: {},
    saveAllProductByCondition: [],
    saveRecord: [],
    saveStepTwoInfo: {
      values: {},
    },
    saveDictList: {
      attributionSystem: [],
      SysUserType: [],
      authorizationStrategy: [],
    },
    saveGetDept: [],
    handleCacheInfo: {},
    // 获取当前用户有的岗位列表
    saveCurrentUserJobList: [],
    saveCurrentUserJobListArr: [],
    // 岗位对话框
    saveModalJob: false,
    // 岗位包含的组件id [string]
    saveJobActions: [],
    // 根据岗位查询包含组件的详情信息 [object]
    saveGetRoleByPositions: [],

    saveStepOneInfo: {},
    saveJobInfo: {},
    // ---------底稿------------
    saveDGData: {},
    // 底稿策略
    saveDGManuscriptStrategy: ['0'],
    // 权限策略
    saveAuthorizationStrategy: [],

    // 第一步保存的机构信息
    orgInfo: {},
    // 用户手机号
    saveUserMobile: '',
  },

  effects: {
    // 成员列表/查询handleMemberPermissionsPage
    *fetch({ payload }, { call, put }) {
      const res = yield call(handleMemberManagementList, payload);

      if (res && res.data && res.status === 200) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      }
      yield put({
        type: 'savecurrentPage',
        payload: payload.currentPage,
      });
      yield put({
        type: 'saveFetchParameter',
        payload,
      });
    },

    // 获取'当前成员'产品列表
    *handleMemberPartialPermissions({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleMemberPartialPermissions, payload);
      yield put({
        type: 'partialPermissions',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取'当前成员'产品列表
    *handleMemberPermissionsPage({ payload }, { call, put }) {
      try {
        yield put({
          type: 'changeLoading',
          payload: true,
        });

        const res = yield call(handleMemberPermissionsPage, payload);

        yield put({
          type: 'partialPermissionsPage',
          payload: res,
        });

        yield put({
          type: 'savecurrentPage',
          payload: payload.currentPage,
        });

        yield put({
          type: 'changeLoading',
          payload: false,
        });
      } catch (e) {
        console.log(e);
      }
    },

    // 获取'当前用户'产品列表
    *handleMemberAllPermissions({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleMemberAllPermissions, payload);

      if (res && res.data) {
        yield put({
          type: 'allPermissions',
          payload: res,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 删除成员
    *handleMemberDel({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleMemberDel, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      const mes = res.data.errMsg;

      if (res.data.status === '200') {
        message.success('删除成功！');
      } else {
        message.error(mes);
      }
    },

    // 添加成员
    *handleMemberAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleMemberAdd, payload);
      if (res.data.status === '200') {
        message.success('成员信息保存成功！');
        yield put({
          type: 'saveStatus',
          payload: res,
        });
        const id = res.message.split('/')[1];
        yield put({
          type: 'saveId',
          payload: id,
        });
      } else {
        message.error(`${res.data.errMsg}`);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 查看成员信息
    *handleMemberInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleMemberInfo, payload);

      yield put({
        type: 'memberInfo',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 更新成员信息
    *handleUpdateMember({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleUpdateMember, payload);

      if (res && res.data && res.data.status === '200') {
        message.success('保存成功');
      }
      // yield put({
      //   type: 'memberInfo',
      //   payload: res,
      // });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 产品类型
    *fetchforgtype(_, { call, put }) {
      const res = yield call(queryforgtypeNew);
      yield put({
        type: 'savefprotype',
        payload: res.data,
      });
    },

    // 删除保存成员成功的状态码
    *delStatus(_, { put }) {
      yield put({
        type: 'saveStatus',
        payload: {
          data: {
            code: '',
          },
        },
      });
    },

    // 组授权
    *handleAuthorization({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleAuthorization, payload);
      if (res && res.status === 200) {
        message.success('授权成功');
        yield put({
          type: 'handlePermissionsByCondition',
          payload: {
            currentPage: 1,
            pageSize: 10,
            memberId: model.saveId,
          },
        });
      }
      if (res && res.status === 10030100) {
        message.warning(res.message);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取已授权数组
    *handleAuthorized({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleAuthorized, payload);

      yield put({
        type: 'saveAuthorized',
        payload: res.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 删除分组
    *handleDelGroup({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleDelGroup, payload);
      if (res.data.message === false && res.message === 'success' && res.status === 200) {
        message.warning('该分组或子分组已被使用，请撤销授权后进行删除');
      }
      if (res.data.message === true && res.message === 'success' && res.status === 200) {
        message.success('删除成功');
        yield put({ type: 'handleMyGroup' });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取组件
    *handleClassRole({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleClassRoles, payload);
      if (res && res.data) {
        yield put({
          type: 'saveClassRole',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 功能点树
    *handleAllmenutree({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(allmenutree, payload);
      if (res && res.data) {
        yield put({
          type: 'saveAllmenutree',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 组件功能点修改
    *handleRoleModify({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleRoleModify, payload);
      if (res && res.data) {
        // yield put({
        //   type: 'saveRoleModify',
        //   payload: res.data,
        // });
        if (res.data === true && res.message === 'success' && res.status === 200) {
          message.success('修改成功');
        }
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 组件名称修改
    *handleRoleNameModify({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleRoleNameModify, payload);

      if (res.data.status === '0000' && res.message === 'success' && res.status === 200) {
        message.success('组件名称修改成功');
        yield put({
          type: 'handleClassRole',
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 组件删除
    *handleDelRole({ payload }, { put, call }) {
      const res = yield call(handleRoleDel, payload);
      if (res && res.status === 200) {
        message.success('组件删除成功');
        yield put({
          type: 'orgAuthorize/hasRoleSearch',
          payload: payload.firstSysId,
        });
      } else {
        message.warn('岗位删除失败，请稍后再试');
      }
    },

    // 删除岗位
    *handleDelJob({ payload }, { put, call }) {
      const res = yield call(handleDelJobAPI, payload.id);
      if (res && res.status === 200) {
        message.success('岗位删除成功');
        yield put({
          type: 'handleGetCurrentUserJobList',
          payload: payload.firstSysId,
        });
      } else {
        message.warn('岗位删除失败，请稍后再试');
      }
    },

    // saveId
    *saveIds({ payload }, { put }) {
      yield put({
        type: 'saveId',
        payload,
      });
    },

    *member({ payload }, { put }) {
      sessionStorage.setItem('saveOrgId', payload.orgId);
      sessionStorage.setItem('saveMemberId', payload.id);
      sessionStorage.setItem('memberInfos', JSON.stringify(payload));

      yield put({
        type: 'members',
        payload,
      });
      yield put({
        type: 'saveRecord',
        payload,
      });
      yield put({
        type: 'saveOrgId',
        payload: payload.orgId,
      });
    },

    //----------------------------------------

    // 重置密码
    *rest({ payload }, { call }) {
      const res = yield call(restUserCode, payload);
      if (res.status === 200) {
        message.success('修改成功!');
      } else {
        message.warn('修改失败!');
      }
    },

    // 删除
    *handleDelete({ payload }, { put, call, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const saveFetchParameter = yield select(state => state.memberManagement.saveFetchParameter);
      const res = yield call(handleDelete, { list: payload });
      if (res.status === 200) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
          payload: saveFetchParameter,
        });
      } else {
        message.warn('删除失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 按条件查询全部产品
    *handlePermissionsByCondition({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'currentPage',
        payload: payload.currentPage,
      });
      const res = yield call(handlePermissionsByCondition, payload);
      if (res && res.data) {
        if (res.data.rows) {
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].key = res.data.rows[i].proCode;
          }
        }
        yield put({
          type: 'allPermissions',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handlePermissionsByConditionForAdd({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'currentPage',
        payload: payload.currentPage,
      });
      const res = yield call(handlePermissionsByCondition, payload);
      if (res && res.data) {
        yield put({
          type: 'allPermissionsForAdd',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handlePermissionsByConditionForAllCodeForAll({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handlePermissionsByConditionForAllCode, payload.val);
      if (res && res.data) {
        yield put({
          type: 'allPermissionsCode',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handlePermissionsByConditionForAllCode({ payload }, { put, call }) {
      const res = yield call(handlePermissionsByConditionForAllCode, payload.val);
      if (res && res.data) {
        // yield put({
        //   type: 'allPermissionsCode',
        //   payload: res.data,
        // });

        const { selectedRowKeysForShow } = payload;
        const arr = res.data;

        yield put({
          type: 'uniqueArr',
          payload: {
            arr: selectedRowKeysForShow,
            brr: arr,
          },
        });
      }
    },

    *uniqueArr({ payload }, { put }) {
      const { arr, brr } = payload;
      const aa = cloneDeep(arr);
      for (let i = 0; i < brr.length; i++) {
        for (let j = 0; j < aa.length; j++) {
          if (aa[j] === brr[i]) {
            aa.splice(j, 1);
            j--;
          }
        }
      }
      yield put({
        type: 'selectedRowKeysForShow',
        payload: aa,
      });
    },

    *handlePermissionsByConditionForAllCodeNull(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'allPermissionsCode',
        payload: [],
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handlePermissionsByConditionTonull(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'allPermissions',
        payload: {
          total: 0,
          rows: [],
        },
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handleReset({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'allPermissions',
        payload: {
          total: 0,
          rows: [],
        },
      });
      yield put({
        type: 'groups',
        payload,
      });
      yield put({
        type: 'proTypes',
        payload,
      });
      yield put({
        type: 'selectedRowKeysForShow',
        payload,
      });
      yield put({
        type: 'selectedKeys',
        payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取产品类别=>[]
    *handlePermissionClass({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handlePermissionClass, payload);
      if (res.message === 'success' && res.status === 200) {
        yield put({
          type: 'savePermissionClass',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 我的分组
    *handleMyGroup({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleMyGroups, payload);
      if (res.message === 'success' && res.status === 200) {
        yield put({
          type: 'saveMyGroup',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取机构名称
    *handleOrgName(_, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(queryRuleJG);

      if (res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveOrgName',
          payload: res.data,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 根据机构id获取机构信息，并存储机构id
    *handleOrgInfoById({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleOrgInfo, payload);

      if (res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveOrgInfo',
          payload: (res.data && res.data[0]) || {},
        });
        yield put({
          type: 'saveOrgId',
          payload,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取当前登录用户的信息
    *handleUserInfo(_, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(getPersonal);

      if (res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveUserInfo',
          payload: res.data[0],
        });
        if (res.data[0]) {
          yield put({
            type: 'saveOrgId',
            payload: res.data[0].orgId,
          });
        }

        return res;
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 获取‘机构类型’词汇字典
    *handleOrgTypeDictionary({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleOrgTypeDictionary, payload);

      yield put({
        type: 'saveOrgTypeDictionary',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 缓存用户已选的机构信息
    *handleCacheInfo({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'saveStepOneInfo',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存用户已选的机构信息，创建机构
    *handleSaveOrg({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(orgadd, payload.val);
      if (res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveOrgId',
          payload: res.data,
        });
        yield put({
          type: 'handleStep',
          payload: payload.current + 1,
        });
      }

      if (res.status === 10051004) {
        message.warning('该机构已存在，无法重复添加！');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 根据手机号查询用户
    *handleMobileQueryInfo({ payload }, { put, call }) {
      const res = yield call(handleMobileOnly, payload);
      if (res.status === 200 && res.message === 'success') {
        yield put({
          type: 'saveMobileQueryInfo',
          payload: res.data,
        });
        // 保存用户手机号
        yield put({
          type: 'saveUserMobile',
          payload,
        });
      }
      return res;
    },

    // 清除手机号查询用户的信息
    *handleCleanMobileQueryInfo(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'saveMobileQueryInfo',
        payload: {},
      });
      // 清空用户手机号
      yield put({
        type: 'saveUserMobile',
        payload: '',
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存第二步用户信息
    *handleSaveInfo({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      if (!payload.disabled) {
        const res = yield call(handleCheckUserCode, payload.values.usercode);

        if (res.status === 200 && res.message === 'success' && res.data.status === '10030015') {
          message.warning('当前登录名已存在，请更换再试！');
        } else {
          yield put({
            type: 'saveInfo',
            payload: payload.values,
          });
          yield put({
            type: 'handleStep',
            payload: payload.current + 1,
          });
        }
      } else {
        yield put({
          type: 'saveInfo',
          payload: payload.values,
        });
        yield put({
          type: 'handleStep',
          payload: payload.current + 1,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 添加分组 仅保存组
    *handleSaveGroup({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const val = payload.productGroup.parentId;

      // 校验分组下是否有产品
      const res = yield call(handleCheckGroup, val);
      if (res.message === 'success' && res.status === 200) {
        // 有分组 不允许添加
        if (res.data.status === '10031000') {
          message.warn(res.data.errMsg);
        }
        // 可添加分组
        else {
          const res = yield call(handleAddGroup, payload);
          // 添加成功时
          if (res.message === 'success' && res.status === 200 && res.data.status === '200') {
            yield put({
              type: 'saveAddGroup',
              payload: false,
            });
            message.success('添加成功');
            yield put({ type: 'handleMyGroup' });
            yield put({
              type: 'handleModelStepTwo',
              payload: false,
            });
          }
          // 添加失败时
          else {
            yield put({
              type: 'saveAddGroup',
              payload: true,
            });
            message.success('改分组名称已存在，请更换分组名称！');
          }
        }
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 编辑分组，提交数据
    *handleSaveGroupForEdit({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      // 编辑分组时
      if (payload.type === 'edit') {
        const { id } = payload.productGroup;
        const res = yield call(handleCheckChild, id);

        if (res.message === 'success' && res.status === 200 && res.data.status === '200') {
          // 根据分组的id是否存在判断：
          // 1.如果分组id存在，为修改分组
          // 2.如果分组id不存在，为新增分组并添加产品
          const res = yield call(handleAddGroup, payload);

          // 添加成功时
          if (res.message === 'success' && res.status === 200) {
            yield put({
              type: 'saveAddGroup',
              payload: false,
            });
            message.success('修改成功');
          }
          // 添加失败时
          else {
            message.success('修改失败');
          }
        } else {
          message.info('当前分组下已有分组，无法添加产品，可创建新分组并添加产品');
        }
      }
      // 新增分组并添加产品
      else if (payload.type === 'add') {
        // 根据分组的id是否存在判断：1.如果分组id存在，为修改分组 2.如果分组id不存在，为新增分组并添加产品
        const res = yield call(handleAddGroup, payload);

        // 添加成功时
        if (res.message === 'success' && res.status === 200) {
          yield put({
            type: 'saveAddGroup',
            payload: false,
          });
          message.success('添加成功');
          yield put({ type: 'handleMyGroup' });
          yield put({
            type: 'handleModelStepTwo',
            payload: false,
          });
        }
        // 添加失败时
        else {
          // yield put({
          //   type: 'saveAddGroup',
          //   payload: true,
          // });
          message.success('添加失败');
        }
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 显示 新建分组第1步 弹框
    *handleModelStepOne({ payload }, { put }) {
      yield put({
        type: 'saveAddGroup',
        payload,
      });
    },

    // 显示/隐藏 新建分组第2步 弹框
    *handleModelStepTwo({ payload }, { put }) {
      yield put({
        type: 'saveAddGroupTwo',
        payload,
      });
    },

    // 查询分组下的产品信息 （当分组单独在一起时用该接口）
    *handleGroupProduct({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleGroupProduct, payload);

      // if (res.message === 'success' && res.status === 200) {
      //   yield put({
      //     type: 'saveMoveProductForEdit',
      //     payload: res.data,
      //   });
      // }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return res;
    },

    // 校验分组下是否有分组
    *handleCheckChild({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleCheckChild, payload);
      if (res.message === 'success' && res.status === 200) {
        message.info('当前分组下已有分组，无法添加产品，可创建新分组并添加产品');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 校验分组下是否有产品
    *handleCheckGroup({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handleCheckGroup, payload);
      if (res.message === 'success' && res.status === 200) {
        if (res.data.status === '10031000') {
          message.warn(res.data.errMsg);
        } else {
          yield put({
            type: 'saveAddGroup',
            payload: false,
          });
          yield put({
            type: 'saveAddGroupTwo',
            payload: true,
          });
        }
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 按条件查询产品添加到新分组
    *handlePermissionsByConditionToNewGroup({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(handlePermissionsByCondition, payload);
      if (res && res.data) {
        yield put({
          type: 'saveNewTable',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 将选择的产品添加到新分组的列表
    *handleMoveProduct({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const temp = [];
      const index = [];
      const l = payload.length;
      for (let i = 0; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (payload[i].proCode === payload[j].proCode) {
            i++;
            j = i;
          }
        }
        temp.push(payload[i]);
        index.push(i);
      }

      // let key = [];
      // for (let i = 0; i < temp.length; i++) {
      //   key.push(temp[i].proCode);
      // }

      // yield put({
      //   type: 'handleSplice',
      //   payload: temp,
      // });

      yield put({
        type: 'saveMoveProduct',
        payload: temp,
      });

      // yield put({
      //   type: 'saveMoveProductKeys',
      //   payload: key,
      // });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handleSplice({ payload }) {
      const { all, page } = payload;
      const rows = [...all];
      rows.splice(5 * page - 5, 5);
    },

    // 编辑--将选择的产品添加到新分组的列表
    *handleMoveProductForEdit({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const temp = [];
      const index = [];
      const l = payload.rows.length;
      for (let i = 0; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (payload.rows[i].proCode === payload.rows[j].proCode) {
            i++;
            j = i;
          }
        }
        temp.push(payload.rows[i]);
        index.push(i);
      }

      const arr = [];
      for (let i = 0; i < temp.length; i++) {
        arr.push(temp[i].proCode);
      }

      const val = {
        rows: temp,
        total: temp.length,
      };

      yield put({
        type: 'saveMoveProductForEdit',
        payload: val,
      });
      yield put({
        type: 'saveMoveProductForEditKeys',
        payload: arr,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 将选择的产品移除
    *handleRemoveProduct({ payload }, { put }) {
      let { selectKey, alltable } = payload;

      selectKey = cloneDeep(selectKey);
      alltable = cloneDeep(alltable);

      for (let i = 0; i < selectKey.length; i++) {
        for (let j = 0; j < alltable.length; j++) {
          if (selectKey[i].proCode === alltable[j].proCode) {
            alltable.splice(j, 1);
          }
        }
      }

      yield put({
        type: 'saveMoveProduct',
        payload: alltable,
      });
    },

    // 操作权限授权
    *handleOperationAuthority({ payload }, { put, call }) {
      yield put({
        type: 'changeLoadings',
        payload: true,
      });

      const res = yield call(handleOperationAuthority, payload.pack);

      if (res.message === 'success' && res.status === 200) {
        message.success('授权成功');
        yield put({
          type: 'handleStep',
          payload: payload.current + 1,
        });
      } else {
        message.warning('授权失败');
      }

      yield put({
        type: 'changeLoadings',
        payload: false,
      });
    },

    // 操作权限授权--‘数据授权’模块使用
    *handleOperationAuthorityForData({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const res = yield call(handleOperationAuthorityForData, payload.pack);

      if (res.message === 'success' && res.status === 200) {
        message.success('授权成功');
        yield put({
          type: 'handleStep',
          payload: payload.current + 1,
        });
      } else {
        message.warning('授权失败');
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存默认选中的分组数组，和 以后选中的分组的数组
    *handleonCheckGroup({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'groups',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存默认选中的分类数组，和 以后选中的分类的数组
    *handleonCheckProTypes({ payload }, { put }) {
      yield put({
        type: 'proTypes',
        payload,
      });
    },

    // 保存默认选中的tabel的keys数组，和 以后选中的tabel的keys数组
    *handleonCheckProCodes({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'selectedRowKeysForShow',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存默认选中的tabel的keys数组，和 以后选中的tabel的keys数组
    *handleonCheckProCodesForEdit({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'handleonCheckProCodesForEdit',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存点选的树
    *handleonOnSelectKeys({ payload }, { put }) {
      yield put({
        type: 'selectedKeys',
        payload,
      });
    },

    //
    *handleSaveOldInfo({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'handleSaveOldInfo_',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    //
    *handleSavePack({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'savePack',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    //
    *handleSavePack1(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      // yield put({
      //   type: 'savePack',
      //   payload: payload,
      // });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 保存 ，新建分组时tabel选中的row
    *handleSelectedRowKeysForAddTableArr({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'selectedRowKeysForAddTableArr',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *handleAllProduct({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'currentPage',
        payload: payload.currentPage,
      });
      const res = yield call(handleAllProduct, payload);
      const key = [];
      if (res && res.data) {
        yield put({
          type: 'saveAllProduct',
          payload: res.data,
        });
        yield put({
          type: 'selectedRowKeysForAddTableArr',
          payload: res.data,
        });

        for (let i = 0; i < res.data.length; i++) {
          key.push(res.data[i].proCode);
        }
        yield put({
          type: 'selectedRowKeysForAddTableArrKey',
          payload: key,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // usercode检查
    *handleCheckUserCode({ payload }, { put, call }) {
      const res = yield call(handleCheckUserCode, payload);
      return res;
    },

    // 控制步骤
    *handleStep({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'saveCurrent',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 置空
    *handleToNull(_, { put }) {
      yield put({
        type: 'allPermissions',
        payload: {
          total: 0,
          data: [],
        },
      });
      yield put({
        type: 'saveMoveProduct',
        payload: [],
      });
      yield put({
        type: 'allPermissionsForAdd',
        payload: {
          total: 0,
          rows: [],
        },
      });
    },

    /// ////////////////////////////////////////////////////////////

    // 根据条件查询产品
    *handleGetAllProduct({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // yield put({
      //   type: 'currentPage',
      //   payload: payload.currentPage,
      // });
      const res = yield call(handleAllProduct, payload);
      if (res && res.data) {
        yield put({
          type: 'saveAllProductByCondition',
          payload: res.data.rows,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 归属系统词汇
    *handleGetDictList({ payload }, { put, call }) {
      const res = yield call(getDictList, payload);
      if (res && res.data) {
        yield put({
          type: 'saveDictList',
          payload: res.data,
        });
      }
    },

    // 所属部门
    *handleGetDept({ payload }, { put, call }) {
      const res = yield call(getDeptAPI, payload);
      if (res && res.data) {
        yield put({
          type: 'saveGetDept',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 新增岗位
    *handleSaveJob({ payload }, { call, put }) {
      const res = yield call(saveJobAPI, payload);
      if (res && res.status === 200) {
        message.success('新增岗位成功');
        // 关闭新增岗位弹框
        yield put({
          type: 'saveModalJob',
          payload: false,
        });
        // 新增岗位成功，再次更新岗位信息
        yield put({
          type: 'handleGetCurrentUserJobList',
          payload: payload.sysId,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 更新岗位
    *handleUpdateJob({ payload }, { call, put }) {
      const res = yield call(updateJobAPI, payload);
      if (res && res.status === 200) {
        message.success('修改岗位成功');
        // 关闭新增岗位弹框
        yield put({
          type: 'saveModalJob',
          payload: false,
        });
        // 新增岗位成功，再次更新岗位信息
        yield put({
          type: 'handleGetCurrentUserJobList',
          payload: payload.sysId,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 岗位详情
    *handleDetailJob({ payload }, { call, put }) {
      const res = yield call(detailJobAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveJobActions',
          payload: res.data && res.data.roleIds,
        });
        yield put({
          type: 'saveJobInfo',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 客户经理/信披岗获取岗位名称
    *handlePosiNames({ payload }, { call, put }) {
      const res = yield call(detailJobAPI, payload);
      if (res && res.status === 200) {
        return res;
      } else {
        if(res.message) message.warn(res.message);
      }
    },

    // 修改岗位详情
    *handleModifyDetailJob({ payload }, { put }) {
      yield put({
        type: 'saveJobActions',
        payload,
      });
    },

    // true开启/false关闭 新增岗位弹框
    *handleSaveModalJob({ payload }, { put }) {
      yield put({
        type: 'saveModalJob',
        payload,
      });
    },

    // 获取当前用户有的岗位列表
    *handleGetCurrentUserJobList({ payload }, { put, call }) {
      const res = yield call(getCurrentUserJobList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'saveCurrentUserJobList',
          payload: res.data,
        });
        const list = res.data;
        const arr = [];
        list.map(item => {
          arr.push(item.id);
        });
        yield put({
          type: 'saveCurrentUserJobListArr',
          payload: arr,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 获取岗位包含的组件详情信息 根据岗位id查询组件信息
    *handleGetRoleByPositions(_, { put, call, select }) {
      const jobIdList = yield select(model => model.memberManagement.saveCurrentUserJobListArr);
      const saveMemberId = sessionStorage.getItem('saveMemberId');
      const par = {
        // 岗位[id]
        positions: jobIdList,
        userId: saveMemberId,
      };
      const res = yield call(getRoleByPositionsAPI, par);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'saveGetRoleByPositions',
          payload: res.data,
        });
      }
    },

    // -------------底稿------------------------------

    // 查询底稿类型树
    *handleDGTree({ payload }, { put, call }) {
      const res = yield call(handleDGTreeAPI, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'savePermissionClass',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    // 查询底稿类中产品
    *handleDGProjects({ payload }, { put, call }) {
      const res = yield call(handleDGProjectsAPI, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'allPermissions',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },

    *handleResetState(_, { put }) {
      yield put({
        type: 'reducerResetState',
        payload: nullObj,
      });
    },

    *handleGetUserAuthority({ payload }, { call, put }) {
      const res = yield call(getUserAuthorityAPI, payload);
      if (res && res.status === 200 && res.data) {
        yield put({
          type: 'allPermissions',
          payload: res.data,
        });
      } else {
        message.warn(res.message);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDictList(state, action) {
      return {
        ...state,
        saveDictList: action.payload,
      };
    },
    saveGetDept(state, action) {
      return {
        ...state,
        saveGetDept: action.payload,
      };
    },
    saveFetchParameter(state, action) {
      return {
        ...state,
        saveFetchParameter: action.payload,
      };
    },
    members(state, action) {
      return {
        ...state,
        members: action.payload,
      };
    },
    partialPermissions(state, action) {
      return {
        ...state,
        partialPermissions: action.payload,
      };
    },
    partialPermissionsPage(state, action) {
      return {
        ...state,
        partialPermissionsPage: action.payload,
      };
    },
    allPermissions(state, action) {
      return {
        ...state,
        allPermissions: action.payload,
      };
    },
    allPermissionsForAdd(state, { payload }) {
      let data;
      if (payload.rows) {
        for (let i = 0; i < payload.rows.length; i++) {
          payload.rows[i].key = payload.rows[i].proCode;
        }
      }
      return {
        ...state,
        allPermissionsForAdd: payload,
      };
    },
    allPermissionsCode(state, action) {
      return {
        ...state,
        allPermissionsCode: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeLoadings(state, action) {
      return {
        ...state,
        loadings: action.payload,
      };
    },
    memberInfo(state, action) {
      return {
        ...state,
        memberInfo: action.payload,
      };
    },
    savefprotype(state, action) {
      return {
        ...state,
        proType: action.payload,
      };
    },
    saveStatus(state, action) {
      return {
        ...state,
        saveStatus: action.payload,
      };
    },
    saveId(state, action) {
      return {
        ...state,
        saveId: action.payload,
      };
    },
    savecurrentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    savePermissionClass(state, action) {
      return {
        ...state,
        savePermissionClass: action.payload,
      };
    },
    saveAuthorized(state, action) {
      return {
        ...state,
        saveAuthorized: action.payload,
      };
    },
    saveMyGroup(state, action) {
      return {
        ...state,
        saveMyGroup: action.payload,
      };
    },
    saveClassRole(state, action) {
      return {
        ...state,
        saveClassRole: action.payload,
      };
    },
    saveAllmenutree(state, action) {
      return {
        ...state,
        saveAllmenutree: action.payload,
      };
    },
    saveCheckedKeys(state, action) {
      return {
        ...state,
        saveCheckedKeys: action.payload,
      };
    },
    saveCheckedKeys1(state, action) {
      return {
        ...state,
        saveCheckedKeys1: action.payload,
      };
    },
    saveSelectedRowKeys(state, action) {
      return {
        ...state,
        saveSelectedRowKeys: action.payload,
      };
    },
    saveAuthorizationMethod(state, action) {
      return {
        ...state,
        authorizationMethod: action.payload,
      };
    },

    //----------------------------------
    current(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    saveStepOneInfo(state, action) {
      return {
        ...state,
        saveStepOneInfo: action.payload,
      };
    },
    saveOrgName(state, action) {
      return {
        ...state,
        saveOrgName: action.payload,
      };
    },
    saveOrgInfo(state, action) {
      return {
        ...state,
        saveOrgInfo: action.payload,
      };
    },
    saveUserInfo(state, action) {
      return {
        ...state,
        saveUserInfo: action.payload,
      };
    },
    saveOrgTypeDictionary(state, action) {
      return {
        ...state,
        saveOrgTypeDictionary: action.payload,
      };
    },
    saveStepOne(state, action) {
      return {
        ...state,
        saveStepOne: action.payload,
      };
    },
    saveOrgId(state, action) {
      return {
        ...state,
        saveOrgId: action.payload,
      };
    },
    saveMobileQueryInfo(state, action) {
      return {
        ...state,
        saveMobileQueryInfo: action.payload,
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        saveInfo: action.payload,
      };
    },
    saveGroupProduct(state, action) {
      return {
        ...state,
        saveGroupProduct: action.payload,
      };
    },
    saveCheckGroup(state, action) {
      return {
        ...state,
        saveCheckGroup: action.payload,
      };
    },
    saveAddGroup(state, action) {
      return {
        ...state,
        saveAddGroup: action.payload,
      };
    },
    saveAddGroupTwo(state, action) {
      return {
        ...state,
        saveAddGroupTwo: action.payload,
      };
    },
    saveNewTable(state, action) {
      return {
        ...state,
        saveNewTable: action.payload,
      };
    },
    saveMoveProduct(state, action) {
      return {
        ...state,
        saveMoveProduct: action.payload,
      };
    },
    saveMoveProductForEdit(state, action) {
      return {
        ...state,
        saveMoveProductForEdit: action.payload,
      };
    },
    saveMoveProductForEditKeys(state, action) {
      return {
        ...state,
        saveMoveProductForEditKeys: action.payload,
      };
    },
    currentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    groups(state, action) {
      return {
        ...state,
        groups: action.payload,
      };
    },
    proTypes(state, action) {
      return {
        ...state,
        proTypes: action.payload,
      };
    },
    selectedRowKeysForShow(state, action) {
      return {
        ...state,
        selectedRowKeysForShow: action.payload,
      };
    },
    selectedKeys(state, action) {
      return {
        ...state,
        selectedKeys: action.payload,
      };
    },
    handleSaveOldInfo_(state, action) {
      return {
        ...state,
        handleSaveOldInfo: action.payload,
      };
    },
    savePack(state, action) {
      return {
        ...state,
        savePack: action.payload,
      };
    },
    saveMoveProductKeys(state, action) {
      return {
        ...state,
        saveMoveProductKeys: action.payload,
      };
    },
    selectedRowKeysForAddTableArr(state, action) {
      return {
        ...state,
        selectedRowKeysForAddTableArr: action.payload,
      };
    },
    saveAllProduct(state, action) {
      return {
        ...state,
        saveAllProduct: action.payload,
      };
    },
    selectedRowKeysForAddTableArrKey(state, action) {
      return {
        ...state,
        selectedRowKeysForAddTableArrKey: action.payload,
      };
    },
    handleonCheckProCodesForEdit(state, action) {
      return {
        ...state,
        handleonCheckProCodesForEdit: action.payload,
      };
    },
    saveCurrent(state, action) {
      return {
        ...state,
        saveCurrent: action.payload,
      };
    },
    saveRecord(state, action) {
      return {
        ...state,
        saveRecord: action.payload,
      };
    },

    /// /////////////////////////////////////////////////////////
    saveAllProductByCondition(state, action) {
      return {
        ...state,
        saveAllProductByCondition: action.payload,
      };
    },

    saveCurrentUserJobList(state, { payload }) {
      return {
        ...state,
        saveCurrentUserJobList: payload,
      };
    },
    saveCurrentUserJobListArr(state, { payload }) {
      return {
        ...state,
        saveCurrentUserJobListArr: payload,
      };
    },
    saveModalJob(state, { payload }) {
      return {
        ...state,
        saveModalJob: payload,
      };
    },
    saveJobActions(state, { payload }) {
      return {
        ...state,
        saveJobActions: payload,
      };
    },
    saveGetRoleByPositions(state, { payload }) {
      return {
        ...state,
        saveGetRoleByPositions: payload,
      };
    },
    saveJobInfo(state, { payload }) {
      return {
        ...state,
        saveJobInfo: payload,
      };
    },
    saveUserMobile(state, { payload }) {
      return {
        ...state,
        saveUserMobile: payload,
      };
    },

    // ---------底稿------------

    // 保存底稿中选中的类、产品和策略
    handleSaveDGData(state, { payload }) {
      return {
        ...state,
        saveDGData: payload,
      };
    },
    saveDGManuscriptStrategy(state, { payload }) {
      let par;
      if (payload.includes('0')) {
        par = payload;
      } else {
        par = [...payload, '0'];
      }
      return {
        ...state,
        saveDGManuscriptStrategy: par,
      };
    },
    saveAuthorizationStrategy(state, { payload }) {
      return {
        ...state,
        saveAuthorizationStrategy: Array.from(new Set(payload)),
      };
    },
    reducerResetState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

nullObj = cloneDeep(model.state);

export default model;

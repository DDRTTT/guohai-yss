/**
 *Create on 2020/7/13.
 */

import {
  add,
  addRoleCtrl,
  allmenutree,
  authorize,
  del,
  edit,
  emptyRole,
  getAllAuthorizeById,
  query,
  roleType,
} from '@/services/role';
import { getCrudModel } from '@/utils/commonTemplate';
import { message } from 'antd';
import { switch2SelectOption } from '@/utils/utils';
import { combine } from '@/utils/modelUtil';
import { stateClear } from '@/utils/decorators';
import { getSession } from '../../utils/session';

const namespace = 'role';

const baseModel = getCrudModel(namespace, {
  query,
  add,
  edit,
  del,
});

const model = {
  state: {
    authorizationPadVisible: false,
    actions: [],
    roletype: [],
    allmenutree: [],
    roleHas: '',
    emptyRoleData: {},
    addRoleResult: 0,
    updateRoleResult: 0,
    basics: { actionList: [] },
    saveAllMenuTreeCode: [],
    saveSysId: null,
  },

  effects: {
    *authorize({ payload }, { put, call }) {
      const response = yield call(authorize, payload);

      if (response) {
        yield put({ type: 'padVisibleSwitch' });
      }
    },

    *getEmptyRole({ payload }, { put, call }) {
      const response = yield call(emptyRole, payload);
      if (response) {
        yield put({
          type: 'roleNone',
          payload: response.data,
        });
      }
    },

    *getAuthorizeById({ payload }, { put, call }) {
      if (payload) {
        const response = yield call(getAllAuthorizeById, payload);
        if (response.data) {
          yield put({ type: 'padVisibleSwitch' });
          yield put({
            type: 'basicSet',
            payload: response.data[0],
          });
          if (response.data[0]) {
            yield put({
              type: 'actionsSet',
              payload: response.data[0]?.actionsList || [],
            });
          }
        }
      } else {
        yield put({
          type: 'actionsSet',
          payload: [],
        });
      }
    },

    // 获取当前选择的角色（单击）
    *hasChooseRole({ payload }, { put }) {
      yield put({
        type: 'chooseRole',
        payload,
      });
    },

    *init({ payload }, { put, call }) {
      // const response = yield call(roleType);
      // if (response && response.length !== 0) {
      //   const data = switch2SelectOption(response, 'name', 'code');
      //   yield put({
      //     type: 'saveroleType',
      //     payload: data,
      //   });
      // }
      // let obj = {};
      const res = yield call(allmenutree, payload);
      if (res && res.data && res.status === 200) {
        const authorizes = res.data;
        const arr = [];
        for (let i = 0; i < authorizes.length; i++) {
          if (authorizes[i].children) {
            const item = authorizes[i].children;
            item.map(items => {
              const mapItem = items.actions;
              const len = items.actions.length;
              for (let j = 0; j < len; j++) {
                arr.push(mapItem[j].id);
              }
            });
          }
        }
        // 树
        yield put({
          type: 'saveAllmenutree',
          payload: res.data,
        });
        // 全部的权限id
        yield put({
          type: 'saveAllMenuTreeCode',
          payload: arr,
        });
      }
    },

    *addRole({ payload }, { put, call }) {
      const response = yield call(addRoleCtrl, payload);
      if (response.data.errMsg === 'success') {
        if (payload.id) {
          message.success('修改组件成功');
          yield put({
            type: 'updateRole1',
            payload: 1,
          });
        } else {
          message.success('添加组件成功');
          yield put({
            type: 'addRole1',
            payload: 1,
          });
        }
        const sysId = getSession('sysId');
        const firstSysId = sysId?.split(',')[0] || '1';
        // 添加组件后刷新组件列表
        yield put({
          type: 'orgAuthorize/hasRoleSearch',
          payload: firstSysId,
        });
        return response;
      }
      message.error(response.data.errMsg);
    },
  },

  reducers: {
    padVisibleSwitch(state) {
      return {
        ...state,
        authorizationPadVisible: !state.authorizationPadVisible,
      };
    },
    actionsSet(state, action) {
      return {
        ...state,
        actions: action.payload,
      };
    },
    basicSet(state, action) {
      return {
        ...state,
        basics: action.payload,
      };
    },
    saveroleType(state, action) {
      return {
        ...state,
        roletype: action.payload,
      };
    },
    saveAllmenutree(state, action) {
      return {
        ...state,
        allmenutree: action.payload,
      };
    },
    chooseRole(state, action) {
      return {
        ...state,
        roleHas: action.payload,
      };
    },
    roleNone(state, action) {
      return {
        ...state,
        emptyRoleData: action.payload,
      };
    },
    addRole1(state, action) {
      return {
        ...state,
        addRoleResult: action.payload,
      };
    },
    updateRole1(state, action) {
      return {
        ...state,
        updateRoleResult: action.payload,
      };
    },
    saveAllMenuTreeCode(state, action) {
      return {
        ...state,
        saveAllMenuTreeCode: action.payload,
      };
    },
    handleSveSysId(state, action) {
      return {
        ...state,
        saveSysId: action.payload,
      };
    },
  },
};

const models = combine([baseModel, model]);
models.namespace = namespace;
stateClear(models);

export default models;

import { add, del, edit, EXPORT_MENU_API, init, menuMTree, query, save } from '@/services/menu';
import { getCrudModel } from '@/utils/commonTemplate';

import { message } from 'antd';
import { json2txt } from '@/utils/download';

const namespace = 'personMenu';
const baseModel = getCrudModel(namespace, {
  query,
  add,
  edit,
  del,
});
const stateClear = model => {
  model.state.initialStateBackup = model.state;
  model.reducers.STATE_CLEAR = (state, {}) => state.initialStateBackup;
  return model;
};
const combine = models => {
  return models.reduce((prev, cur) => ({
    state: { ...prev.state, ...cur.state },
    effects: { ...prev.effects, ...cur.effects },
    reducers: { ...prev.reducers, ...cur.reducers },
    subscriptions: { ...prev.subscriptions, ...cur.subscriptions },
  }));
};

const model = {
  namespace: 'personMenu',
  state: {
    isloading: false,
    isloading2: false,
    menuTree: [],
    actionType: [],
    methodType: [],
    seltree: [],
    url: [],
    modelVisible_new: false,
  },

  effects: {
    fetchMenu: [
      function*({ payload: { search, sysId } }, { call, put, select }) {
        // let userId = yield select(state => state['user'].URL);
        const parameter = {
          needAction: true,
          sysId,
          queryStr: search == null ? '' : search,
        };
        const response = yield call(menuMTree, parameter);
        if (response.data) {
          // 初始化菜单树
          yield put({
            type: 'loadMenus',
            payload: {
              menuTree: response.data,
            },
          });
        }

        return response;
      },
      { type: 'takeLatest' },
    ],

    *Menu({ payload: { fieldValues, code, sysId } }, { put, call, select }) {
      let gData = [];
      const response = yield call(code === '1' ? add : code === '2' ? del : edit, fieldValues);
      if (response && response.status === 200 && response.data) {
        const res = yield call(menuMTree, {
          needAction: true,
          queryStr: '',
          sysId,
        });
        if (res.data) {
          gData = res.data;
          yield put({
            type: 'loadMenus',
            payload: {
              menuTree: res.data,
            },
          });
        }

        // 删除子菜单后，子菜单table刷新
        const query_data = yield select(state => {
          const { current, pageSize, queryParameters } = state.personMenu;
          return { current, pageSize, queryParameters };
        });

        if (query_data.queryParameters) {
          yield put({
            type: 'fetch',
            payload: query_data,
          });
        }

        message.success(`菜单${code === '1' ? '新增' : code === '2' ? '删除' : '修改'}成功!`);
      } else {
        message.error('服务异常，请稍后再试!', 3);
      }

      yield put({
        type: 'modelSwitch_new',
        payload: false,
      });
      return gData;
    },

    // 初始化菜单
    *confirmInit({ payload }, { call, put }) {
      yield put({
        type: 'isloading',
        payload: true,
      });

      const response = yield call(init, payload);

      yield put({
        type: 'isloading',
        payload: false,
      });

      return response;
    },

    // 保存菜单层级
    *confirmSave({ payload }, { call, put }) {
      yield put({
        type: 'isloading2',
        payload: true,
      });
      const response = yield call(save, payload);

      yield put({
        type: 'isloading2',
        payload: false,
      });

      return response;
    },

    // 导出菜单
    *EXPORT_MENU({ payload }, { call }) {
      const res = yield call(EXPORT_MENU_API, payload);
      if (res) {
        json2txt(res, 'data');
        message.success('导出菜单成功');
      }
    },
  },

  reducers: {
    loadMenus(state, { payload: { menuTree } }) {
      return {
        ...state,
        menuTree,
      };
    },

    // 初始化菜单
    isloading(state, action) {
      return {
        ...state,
        isloading: action.payload,
      };
    },
    // 菜单层级修改
    isloading2(state, action) {
      return {
        ...state,
        isloading2: action.payload,
      };
    },
    saveuri(state, action) {
      return {
        ...state,
        url: action.payload,
      };
    },
    modelSwitch_new(state) {
      return {
        ...state,
        modelVisible_new: !state.modelVisible_new,
      };
    },
  },
};

let model2 = {
  namespace,
  state: { ...baseModel.state, ...model.state },
  effects: { ...baseModel.effects, ...model.effects },
  reducers: { ...baseModel.reducers, ...model.reducers },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/base/personMenu') {
          dispatch({
            type: 'fetchMenu',
            payload: { as: 11 },
          });
        }
      });
    },
  },
};

model2 = combine([baseModel, model2]);
model2.namespace = namespace;
stateClear(model2);

export default model2;

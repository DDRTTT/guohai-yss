import { add, del, edit, geturi, init, menuMTree, query } from '@/services/menu/menu';
import { getCrudModel } from '@/utils/commonTemplate';

const namespace = 'menu';
const stateClear = model => {
  model.state.initialStateBackup = model.state;
  model.reducers.STATE_CLEAR = (state, {}) => state.initialStateBackup;
  return model;
};
const combine = models => {
  return models.reduce(function(prev, cur) {
    return {
      state: { ...prev.state, ...cur.state },
      effects: { ...prev.effects, ...cur.effects },
      reducers: { ...prev.reducers, ...cur.reducers },
      subscriptions: { ...prev.subscriptions, ...cur.subscriptions },
    };
  });
};
const baseModel = getCrudModel(namespace, { query, add, edit, del });

const model = {
  state: {
    menuTree: [],
    actionType: [
      { text: 'Button', value: 'btn' },
      { text: 'uri', value: 'uri' },
    ],
    methodType: [
      { text: 'GET', value: 'GET' },
      { text: 'POST', value: 'POST' },
      { text: 'PUT', value: 'PUT' },
      { text: 'DELETE', value: 'DELETE' },
    ],
    seltree: [],
    url: [],
  },

  effects: {
    fetchMenu: [
      function*({ payload: { search } }, { call, put, select }) {
        // let userId = yield select(state => state['user'].URL);
        const parameter = { needAction: true, queryStr: search == null ? '' : search };
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
      },
      { type: 'takeLatest' },
    ],

    *initMenus({ payload: { menus } }, { put, call }) {
      const response = yield call(init, menus);

      if (response) {
        // 初始化菜单树
        yield put({
          type: 'fetchMenu',
          payload: {
            search: {},
          },
        });
      }
    },

    *add({ payload }, { put, call }) {
      // 设置状态为加载中...
      yield put({
        type: 'LANG_LOADING',
        payload: true,
      });
      const response = yield call(add, payload);

      if (response) {
        yield put({ type: 'modelSwitch' });
        yield put({ type: 'fetch', payload: {} });
      }
      // 关闭加载中...
      yield put({
        type: 'LANG_LOADING',
        payload: false,
      });
    },

    *getURL({ payload }, { put, call }) {
      const base = {
        ...payload,
        urlType: 2,
        flag: 2,
      };
      const response = yield call(geturi, base);

      if (response && response.status === 200) {
        yield put({
          type: 'saveuri',
          payload: response.data,
        });
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
    saveuri(state, action) {
      return {
        ...state,
        url: action.payload,
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
        if (pathname === '/base/menu') {
          dispatch({ type: 'fetchMenu', payload: { as: 11 } });
        }
      });
    },
  },
};

model2 = combine([baseModel, model2]);
model2.namespace = namespace;
stateClear(model2);

export default model2;

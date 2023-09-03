/**
 * 标准资源CRUD model
 * @param namespace 命名空间
 * @param query 查询函数
 * @param save 保存函数
 * @param del 删除函数
 * @param getById 单一资源查询函数
 * @returns {*}
 */
import { message } from 'antd';

export function getCrudModel(namespace, { query, add, edit, del, clear, getById }) {
  return {
    state: {
      data: {
        rows: [],
        total: 0,
      },
      loading: false,
      current: 1,
      pageSize: 10,
      queryParameters: null,
      detail: {},
      modelVisible: false,
    },

    effects: {
      *fetch({ payload: { current, pageSize, queryParameters } }, { call, put, select }) {
        // 设置状态为加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: true,
        });

        // 如果传入的参数中没有分页，则直接使用store中的
        if (!current) {
          const { current: curr, pageSize: size } = yield select(state => state[namespace]);
          current = curr;
          pageSize = size;
        }
        // 如果没有传入查询参数，则直接使用store中的
        if (!queryParameters) {
          queryParameters = yield select(state => state[namespace].queryParameters);
        }

        // 执行服务端查询方法
        const res = yield call(query, { current, pageSize, queryParameters });

        const finalData = res.data;
        if (!res.data.rows) {
          finalData.rows = [];
        }

        if (res && res.status === 200 && res.data) {
          // 查询完成，向store注入查询结果
          yield put({
            type: 'QUERY_DATA',
            payload: {
              data: finalData,
              current,
              pageSize,
              queryParameters,
            },
          });
        }

        // 关闭加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: false,
        });
      },

      *getById({ payload: { id, detail } }, { put, call }) {
        let result = { data: detail };
        if (id) {
          result = yield call(getById, id);
        }

        if (result.data) {
          yield put({
            type: 'detailSet',
            payload: { detail: result.data },
          });
        }
      },

      *add({ payload: { fieldValues } }, { put, call }) {
        // 设置状态为加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: true,
        });
        const res = yield call(add, fieldValues);

        if (res && res.data.status !== '200') {
          message.warn(res.data.errMsg, 3);
        }
        if (res && (res.data.status === 200 || res.data.status == '0000')) {
          yield put({ type: 'modelSwitch' });
          yield put({ type: 'fetch', payload: {} });
        }
        // 关闭加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: false,
        });
      },

      *edit({ payload: { fieldValues } }, { put, call }) {
        // 设置状态为加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: true,
        });
        const res = yield call(edit, fieldValues);
        if (res.data.status !== 200 && res.data.status != '0000') {
          message.warn(res.data.errMsg, 3);
        }
        if (res && (res.data.status === 200 || res.data.status == '0000')) {
          message.success('保存成功', 3);
          yield put({ type: 'modelSwitch' });
          yield put({ type: 'fetch', payload: {} });
        }
        // 关闭加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: false,
        });
      },

      *del({ payload: { id } }, { put, call }) {
        // 设置状态为加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: true,
        });
        const res = yield call(del, id);

        if (res) {
          yield put({ type: 'fetch', payload: {} });
        }
        // 关闭加载中...
        yield put({
          type: 'LANG_LOADING',
          payload: false,
        });
      },

      *clear({}, { put, call }) {
        yield put({
          type: 'clearData',
        });
      },
    },

    reducers: {
      QUERY_DATA(state, { payload: { data, current, pageSize, queryParameters } }) {
        return {
          ...state,
          data,
          current,
          pageSize,
          queryParameters,
        };
      },
      LANG_LOADING(state, action) {
        return {
          ...state,
          loading: action.payload,
        };
      },
      modelSwitch(state, {}) {
        return {
          ...state,
          modelVisible: !state.modelVisible,
        };
      },
      detailSet(state, { payload: { detail } }) {
        return {
          ...state,
          detail,
        };
      },
      clearData(state, {}) {
        return {
          ...state,
          data: {
            rows: [],
            total: 0,
          },
        };
      },
    },
  };
}

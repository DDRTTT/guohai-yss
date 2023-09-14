import {
  handleAddUser,
  handleCheckType,
  handleCompanyInfo,
  handleCompanyQuery,
  handleCompanyTypeQuery,
  handleList,
  handleReview,
  handleSearchCompany,
} from '@/services/institutionalAuditQuery';
import { combine } from '@/utils/modelUtil';
import { stateClear } from '@/utils/decorators';
import { message } from 'antd';

const namespace = 'institutionalAuditQuery';
let model = {
  state: {
    data: {
      data: {
        rows: [],
        total: 0,
      },
    },
    loading: true,
    checkType: [{}],
    companyInfo: {
      data: [{}],
    },
    companyId: '',
    currentPage: 1,
  },

  effects: {
    // 获取注册机构列表  参数为空，查询全部信息
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'savecurrentPage',
          payload: payload.currentPage,
        });

        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },

    // 新增用户
    *handleAddUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleAddUser, payload);

      if (response.status === 200 && response.data.status === '200') {
        message.success('用户添加成功！');
        yield put({
          type: 'addUserStatus',
          payload: response.rel,
        });
      } else {
        let msg = response.data.errMsg;
        if (response.status === 200 && response.data.status === '300') {
          message.error(`${msg}`);
          yield put({
            type: 'addUserStatus',
            payload: false,
          });
        }
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 查询机构
    *handleSearchCompany({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleSearchCompany, payload);

      yield put({
        type: 'save',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 通过/批量通过/驳回
    *handleReview({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleReview, payload);
      if (response && response.data && response.data.status !== '200') {
        message.warn('操作失败！');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      const basic = {
        currentPage: 1,
        pageSize: 10,
      };
      yield put({
        type: 'fetch',
        payload: basic,
      });

      yield put({
        type: 'handleCompanyInfo',
        payload: payload.list[0],
      });
    },

    // 机构模糊查询
    *handleCompanyQuery({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleCompanyQuery, payload);

      yield put({
        type: 'company',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 机构类型查询
    *handleCompanyTypeQuery({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleCompanyTypeQuery, payload);

      yield put({
        type: 'companyType',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 用户详情
    *handleCompanyInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'companyId',
        payload: payload,
      });

      let response = yield call(handleCompanyInfo, payload);
      yield put({
        type: 'companyInfo',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 驳回原因 字典
    *handleCheckType({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(handleCheckType, payload);
      yield put({
        type: 'checkType',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 清除添加用户成功状态
    *handleClean({ payload }, { call, put }) {
      yield put({
        type: 'addUserStatus',
        payload: payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      console.log(action.payload, '数据data');
      return {
        ...state,
        data: action.payload,
      };
    },
    companyType(state, action) {
      return {
        ...state,
        companyType: action.payload,
      };
    },
    companyInfo(state, action) {
      return {
        ...state,
        companyInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    addUserStatus(state, action) {
      return {
        ...state,
        addUserStatus: action.payload,
      };
    },
    checkType(state, action) {
      return {
        ...state,
        checkType: action.payload,
      };
    },
    companyId(state, action) {
      return {
        ...state,
        companyId: action.payload,
      };
    },
    savecurrentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
  },
};

model = combine([model]);
model['namespace'] = namespace;
stateClear(model);

export default model;

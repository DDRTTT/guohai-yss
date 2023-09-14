import { getAllData, handleClassRole } from '../../services/datum/index';
import { QUICK_AUTH_DETAIL_API } from '@/services/userManagement';

const model = {
  namespace: 'orgAuthorize',

  state: {
    loading: true,
    tags: {
      '01': [],
      '02': [],
    },
    hasRoleData: [],
    dataPage: {
      orgId: '',
      sysId: '',
      userRole: [],
      positions: [],
    },
    SAVE_PRO: {
      proCodes: [],
      proTypes: [],
      proGroups: [],
    },
  },

  effects: {
    // 获取大数据包
    *queAllData({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllData, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getAllAuthData',
          payload: response.data,
        });
        if (response.data) {
          const {
            data: { strategyCodes },
          } = response;
          // 产品：写入已选择授权策略 => []
          yield put({
            type: 'memberManagement/saveAuthorizationStrategy',
            payload: strategyCodes,
          });
          if (response.data.projects) {
            const {
              projects: { projects, proType, authtactics },
            } = response.data;
            // 底稿/产品：写入已选择的产品 => []
            yield put({
              type: 'memberManagement/handleonCheckProCodes',
              payload: projects,
            });
            // 底稿/产品：写入已选择的类 => []
            yield put({
              type: 'memberManagement/handleonCheckProTypes',
              payload: proType,
            });
            // 底稿：写入已选择策略 => []
            yield put({
              type: 'memberManagement/saveDGManuscriptStrategy',
              payload: authtactics,
            });
          }
        }
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *QUICK_AUTH_DETAIL_FETCH({ payload }, { call, put }) {
      const response = yield call(QUICK_AUTH_DETAIL_API, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'getAllAuthData',
          payload: response.data,
        });
        if (response.data) {
          console.log('便捷授权---response.data====', response.data)
          const {
            data: { strategyCodes, userRole, projects },
          } = response;
          // 产品：写入已选择授权策略 => []
          yield put({
            type: 'memberManagement/saveAuthorizationStrategy',
            payload: strategyCodes,
          });
          let proCodes = userRole[0]?.proCodes;
          let proTypes = userRole[0]?.proTypes;
          let proGroups = userRole[0]?.groups;
          const projectsDg = projects?.projects ? projects.projects : [];// 底稿系统取值--对标proCodes
          const proTypeDg = projects?.proType ? projects.proType : [];// 底稿系统取值--对标proTypes
          yield put({
            type: 'SAVE_PRO',
            payload: {
              proCodes: proCodes ?? [],
              proTypes: proTypes ?? [],
              proGroups: proGroups ?? [],
              projectsDg,
              proTypeDg
            },
          });
          if (response.data.projects) {
            const {
              projects: { projects, proType, authtactics },
            } = response.data;
            // 底稿/产品：写入已选择的产品 => []
            yield put({
              type: 'memberManagement/handleonCheckProCodes',
              payload: projects,
            });
            // 底稿/产品：写入已选择的类 => []
            yield put({
              type: 'memberManagement/handleonCheckProTypes',
              payload: proType,
            });
            // 底稿：写入已选择策略 => []
            yield put({
              type: 'memberManagement/saveDGManuscriptStrategy',
              payload: authtactics,
            });
          }
        }
      }
    },

    *queAllDataOld({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'getAllAuthData',
        payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *hasRoleSearch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleClassRole, payload);
      if (response && response.status === 200 && response.data) {
        yield put({
          type: 'hasRole',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *changeHasRole({ payload }, { put }) {
      yield put({
        type: 'getAllAuthData',
        payload: payload.data,
      });
    },
  },

  reducers: {
    hasRole(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    queRole(state, action) {
      return {
        ...state,
        hasRoleData: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getAllAuthData(state, action) {
      return {
        ...state,
        dataPage: action.payload,
      };
    },
    SAVE_PRO(state, { payload }) {
      return {
        ...state,
        SAVE_PRO: payload,
      };
    },
  },
};

export default model;

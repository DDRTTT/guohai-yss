import {
  searchTableDataAPI,
  getFileInfo,
  updateHandleState,
  getBusinessType,
} from '@/services/OAprocessDistribute';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'OAprocessDistribute',
  state: {
    name: 'OAprocessDistribute',
    dataSource: [],
    total: 10,
    page: 1,
    limit: 10,
    fileInfoList: [],
    fileListTotal:0,
    // pageNum:1,
    // pageSize:10,
    flowNameList: [
      {
        code: 'M001_7',
        name: '产品评审_对接OA',
        path: '/dynamicPage/pages/产品评审/4028e7b67443dc6e0174490aea870006/发起流程',
      },
      // { code: 'M001_13', name: '合同定稿_对接OA' ,path:'/dynamicPage/pages/合同定稿/4028e7b674b6714e0174e9e86ecd0039/发起流程'},
      {
        code: 'M001_31',
        name: '合同用印_对接OA',
        path: '/dynamicPage/pages/合同用印/4028e7b673bdc3af0174330245ae0097/流程发起',
      },
    ],
    businessType: [],
  },
  subscriptions: {},
  effects: {
    // *searchTableData({payload}, {call, put}){
    //   const {page, limit} = payload
    //   const response = yield call(searchTableData, page, limit)
    //   if(response){
    //       yield put({
    //           type: 'updeteTableData',
    //           payload: {dataSource:response.data.rows,
    //               total: response.data.total,
    //               page,
    //               limit}
    //       })
    //   }
    // },

    *searchTableData({ payload }, { call, put }) {
      const response = yield call(searchTableDataAPI, payload);
      if (response.data) {
        yield put({
          type: 'updeteTableData',
          payload: {
            dataSource: response.data.titleInfo,
            total: response.data.total,
            page: payload.currentPage,
            limit: payload.pageSize,
          },
        });
      }
    },

    *getFileInfo({ payload }, { call, put }) {
      const response = yield call(getFileInfo, payload.params);
      if (response) {
        const params = { ...payload, fileList: response.data.PoolsVo };
        yield put({
          type: 'updateFileInfoList',
          payload: {
            fileInfoList: response.data.PoolsVo,
            fileListTotal:response.data.total,
            // pageNum:payload.currentPage,
            // pageSize:payload.pageSize,
          },
        });
        if (payload.type === 'detail') {
          yield put(
            routerRedux.push({
              pathname: '/OAprocessDistribute/detail',
              query: {
                ...params,
              },
            }),
          );
        }
      }
    },

    *updateHandleState({ payload, callback }, { call, put }) {
      const response = yield call(updateHandleState, payload);
      if (response) {
        callback && callback(response);
      }
    },

    *getBusinessType({ payload, callback }, { call, put }) {
      const response = yield call(getBusinessType, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'updateBusinessType',
          payload: {
            businessType: response.data ? response.data : [],
          },
        });
      }
    },
  },

  reducers: {
    updeteTableData(state, action) {
      return {
        ...state,
        dataSource: action.payload.dataSource,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
      };
    },
    updateFileInfoList(state, action) {
      return {
        ...state,
        fileInfoList: action.payload.fileInfoList,
        fileListTotal: action.payload.fileListTotal,
        // pageNum: action.payload.pageNum,
        // pageSize: action.payload.pageSize,
      };
    },
    updateBusinessType(state, { payload }) {
      return {
        ...state,
        businessType: payload.businessType,
      };
    },
  },
};

import { getSeriesNameAPI, getSubTableListAPI, projectReportAPI } from '@/services/seriesManage';
import { message } from 'antd';

export default {
  namespace: 'seriesManage',
  state: {
    allSubTableListObj: {}, // 子表格对象集
    seriesList: [],
  },
  effects: {
    //系列下拉列表项
    *getSeriesName({ payload }, { call, put }) {
      const response = yield call(getSeriesNameAPI, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateProName',
          payload: {
            proName: response.data,
          },
        });
        return response;
      }
    },
    //获取展开列表数据
    *getProductBySeries({ payload }, { call, put }) {
      const res = yield call(getSubTableListAPI, payload);
      if (res && res.status === 200) {
        const data = res.data ? res.data : [];
        yield put({
          type: 'updateSubTableList',
          payload: {
            seriesCode: payload.seriesCode,
            data,
          },
        });
      } else {
        message.error(res.message);
      }
    },
    //项目申报
    *projectReport({ payload }, { call, put }) {
      const response = yield call(projectReportAPI, payload);
      return response;
    },
  },

  reducers: {
    updateProName(state, { payload }) {
      return {
        ...state,
        seriesList: payload.proName,
      };
    },
    // 子表格action
    updateSubTableList(state, { payload }) {
      const { seriesCode, data } = payload;
      const { allSubTableListObj } = state;
      return {
        ...state,
        allSubTableListObj: {
          ...allSubTableListObj,
          [`seriesCode_${seriesCode}`]: data,
        },
      };
    },
  },
};

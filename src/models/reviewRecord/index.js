import {
    reqDictsAPI,
    reqProSeries,
    reqReviewRecord,
    reqReviewDetail,
} from '@/services/reviewRecord/index';
import { message } from 'antd';

export default {
    namespace: 'reviewRecord',
    state: {},

    effects: {
        // 获取数据字典
        // *getDicts({ payload }, { call, put }) {
        //     const response = yield call(reqDictsAPI, payload.codeList);
        //     if (response && response.status === 200) {
        //         yield put({
        //             type: 'dicts',
        //             payload: response.data,
        //         });
        //     } else {
        //     }
        // },
        // 系列/产品全称
        *getProductDropList({ payload }, { call, put }) {
            const response = yield call(reqProSeries);
            if (response && response.status === 200) {
                return response.data;
            } else {
                if (response && response.message) {
                    console.log(response.message);
                } else {
                    console.log('系列/产品全称获取失败');
                }
            }
        },
        // 评审记录管理列表
        *getReviewRecord({ payload }, { call, put }) {
            const response = yield call(reqReviewRecord, payload);
            if (response && response.status === 200) {
                return response.data;
            } else {
                if (response && response.message) {
                    message.warn(response.message);
                } else {
                    message.warn('评审记录管理数据获取失败，请稍后重试');
                }
            }
        },
        // 评审记录查询列表
        *getReviewDetail({ payload }, { call, put }) {
            const response = yield call(reqReviewDetail, payload);
            if (response && response.status === 200) {
                return response.data;
            } else {
                if (response && response.message) {
                    message.warn(response.message);
                } else {
                    message.warn('评审记录查询数据获取失败，请稍后重试');
                }
            }
        },
    },

    reducers: {
        dicts(state, { payload }) {
            return {
                ...state,
                dicts: payload,
            };
        },

    },
};

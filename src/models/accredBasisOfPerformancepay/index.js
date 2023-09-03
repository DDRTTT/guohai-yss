// 单一业绩报酬计提基准约定书 -- 和“开放期参数变更”类似
import {
    getListAPI,
    getProType,
    getProNameAndCodeAPI,
    getDictsAPI,
    getInvestmentManagerAPI,
    getRevokeAPI,
    getDeleteAPI,
    batchCommit,
} from '@/services/accredBasisOfPerformancepay/index';
import { message } from 'antd';

export default {
    namespace: 'accredBasisOfPerformancepay',
    state: {
        dicts: {},
        proTypeDatas: [],
        investmentManagerDataList: [],
        proNameAndCodeData: [],
        riseOverTableData: {
            total: '',
            rows: [],
        },
        revokeData: {},
    },

    effects: {
        // 获取数据字典
        *getDicts({ payload }, { call, put }) {
            const response = yield call(getDictsAPI, payload.codeList);
            if (response && response.status === 200) {
                yield put({
                    type: 'dicts',
                    payload: response.data,
                });
            } else {
            }
        },

        *getProTypeFunc({ }, { call, put }) {
            const response = yield call(getProType);
            if (response && response.status === 200) {
                yield put({
                    type: 'proTypeDatas',
                    payload: response.data,
                });
            } else {
            }
        },

        // 获取产品全称/代码下拉列表数据
        *getProNameAndCodeFunc({ }, { call, put }) {
            const response = yield call(getProNameAndCodeAPI);
            if (response && response.status === 200) {
                yield put({
                    type: 'proNameAndCodeData',
                    payload: response.data,
                });
            } else {
            }
        },

        // 获取分页列表数据
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(getListAPI, payload);
            if (response && response.status === 200) {
                yield put({
                    type: 'riseOverTableData',
                    payload: response.data,
                });
                if (callback) callback(response.data);
            } else {
                message.error(response.message);
            }
        },

        // 获取投资经理下拉列表
        *getInvestmentManagerFunc({ }, { call, put }) {
            const response = yield call(getInvestmentManagerAPI);
            if (response && response.status === 200) {
                yield put({
                    type: 'investmentManagerDataList',
                    payload: response.data,
                });
            } else {
            }
        },

        // 删除
        *getDeleteFunc({ payload, callback }, { call }) {
            console.log(payload);
            const response = yield call(getDeleteAPI, payload);
            if (response && response.status === 200) {
                message.success(' 删除成功 ! ', 1);
                if (callback) callback();
            } else {
                message.error(' 删除失败 ! ', 1);
            }
        },

        // 撤销
        *getRevokeFunc({ payload, callback }, { call }) {
            console.log(payload);
            const response = yield call(getRevokeAPI, payload);
            if (response && response.status === 200) {
                if (response.message) {
                    message.success(response.message, 1);
                } else {
                    message.success(' 撤销成功 ! ', 1);
                }
                if (callback) callback();
            } else {
                if (response.message) {
                    message.error(response.message, 1);
                } else {
                    message.error(' 撤销成功 ! ', 1);
                }
            }
        },

        // 批量提交
        *handleGetBatchCommitFunc({ payload, callback }, { call }) {
            const response = yield call(batchCommit, payload);
            if (response && response.status === 200) {
                message.success('提交成功');
                if (callback) callback();
            } else {
                message.warn(response.message);
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

        proTypeDatas(state, { payload }) {
            return {
                ...state,
                proTypeDatas: payload,
            };
        },

        proNameAndCodeData(state, { payload }) {
            return {
                ...state,
                proNameAndCodeData: payload,
            };
        },

        investmentManagerDataList(state, { payload }) {
            return {
                ...state,
                investmentManagerDataList: payload,
            };
        },

        riseOverTableData(state, { payload }) {
            return {
                ...state,
                riseOverTableData: payload,
            };
        },
    },
};

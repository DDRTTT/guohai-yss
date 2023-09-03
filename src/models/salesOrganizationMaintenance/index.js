import {
  queryTableList,
  getSalesOrgList,
  batchCommit,
} from '@/services/salesOrganizationMaintenance/index';
import { message } from 'antd';

export default {
  namespace: 'salesOrganizationMaintenance',
  state: {
    tableList: [],
    sellerCodeList: [],
    sellerNameList: [],
  },
  reducers: {
    /**
     * 同步列表的数据
     */
    setTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload,
      };
    },
    /**
     * 同步下拉列表的option
     */
    setselectList(state, { payload: { nameList, codeList } }) {
      return {
        ...state,
        sellerNameList: nameList,
        sellerCodeList: codeList,
      };
    },
  },
  effects: {
    /**
     * 获取表格的数据
     */
    *getTableList({ payload }, { put, call }) {
      const res = yield call(queryTableList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTableList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 批量提交
     */
    *batchCommit({ payload, callback }, { put, call }) {
      const res = yield call(batchCommit, payload);
      if (res && res.status === 200) {
        message.success('提交成功');
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取机构下拉列表
     */
    *getOrgList({ payload }, { put, call }) {
      const res = yield call(getSalesOrgList, payload);
      if (res && res.status === 200) {
        const nameList = [];
        const codeList = [];
        res.data.forEach(item => {
          nameList.push(item.sellerNameFull);
          codeList.push(item.sellerCode);
        });
        yield put({
          type: 'setselectList',
          payload: {
            nameList,
            codeList,
          },
        });
      } else {
        message.error(res.message);
      }
    },
  },
};

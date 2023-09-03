import { message } from 'antd';
import { mysql, oracle, mysqlUpdate, oracleUpdate, mysqlTest, oracleTest, query, getList, like, del, getOrgData, getDropdownData, examine, getListCondition, getDetails, getSelectList } from '@/services/dataSourceManage';

const model = {
  namespace: 'dataSource',
  state: {},
  effects: {
    * mysql({ payload }, { call }) {
      const res = yield call(mysql, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * oracle({ payload }, { call }) {
      const res = yield call(oracle, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * mysqlUpdate({ payload }, { call }) {
      const res = yield call(mysqlUpdate, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * oracleUpdate({ payload }, { call }) {
      const res = yield call(oracleUpdate, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * mysqlTest({ payload }, { call }) {
      const res = yield call(mysqlTest, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * oracleTest({ payload }, { call }) {
      const res = yield call(oracleTest, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * query({ payload }, { call }) {
      const res = yield call(query, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getSelectList(_, { call }) {
      const res = yield call(getSelectList);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 不分页 
    * getList(_, { call }) {
      const res = yield call(getList);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 不分页 带查询条件
    * getListCondition({ payload }, { call }) {
      const res = yield call(getListCondition, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * like({ payload }, { call }) {
      const res = yield call(like, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * del({ payload }, { call }) {
      const res = yield call(del, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getOrgData({ payload }, { call }) {
      const res = yield call(getOrgData, payload);
      if (res?.status === 200) {
        // 修复：非超级管理员登录，返回的对象中有data.home和data.out.list；超级管理员登录，仅返回data.out.list
        const orgList = res.data.home ? res.data.home : res.data.out.list;
        return orgList;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getDropdownData({ payload }, { call }) {
      const res = yield call(getDropdownData, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res.message);
        return false
      }
    },
    * examine({ payload }, { call }) {
      const res = yield call(examine, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getDetails({ payload }, { call }) {
      const res = yield call(getDetails, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    }
  },
  reducers: {

  },
};

export default model;

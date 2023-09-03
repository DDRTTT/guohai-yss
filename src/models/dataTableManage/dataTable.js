import { message } from 'antd';
import { getTableList, getColumns, mapSave, del, query, getDetails, checkOr, getMapping, getTableRelationship, fuzzySearch } from '@/services/dataTableManage';

const model = {
  namespace: 'dataTable',
  state: {},
  effects: {
    * getTableList({ payload }, { call }) {
      const res = yield call(getTableList, payload);
      if (res?.status === 200) {
        return res.data
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * getColumns({ payload }, { call }) {
      const res = yield call(getColumns, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * mapSave({ payload }, { call }) {
      const res = yield call(mapSave, payload);
      if (res?.status === 200) {
        return true;
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
    * query({ payload }, { call }) {
      const res = yield call(query, payload);
      if (res?.status === 200) {
        return res.data
      } else {
        message.warn(res?.message);
        return false
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
    },
    * checkOr({ payload }, { call }) {
      const res = yield call(checkOr, payload);
      if (res?.status === 200) {
        return true
      } else {
        message.warn(res?.message);
        return false
      }
    },
    * getMapping({ payload }, { call }) {
      const res = yield call(getMapping, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * getTableRelationship({ payload }, { call }) {
      const res = yield call(getTableRelationship, payload);
      if (res?.status === 200) {
        return res.data
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    * fuzzySearch({ payload }, { call }) {
      const res = yield call(fuzzySearch, payload);
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

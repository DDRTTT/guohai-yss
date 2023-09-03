import { message } from 'antd';
import {
  businessAdd,
  query,
  oneKeyMatchList,
  oneKeyMatch,
  matchCheck,
  deleteProduct,
  getColumnList,
  saveBusiColumnMapping,
  getTableStructureList,
  getBusinessList,
  getBusiness,
  deleteBusiness,
  businessUpdate,
  exportBusiness,
  exportBusinessAll,
  getTableList,
  emigration,
} from '@/services/productElementsManage';

const model = {
  namespace: 'productElements',
  state: {},
  effects: {
    // 业务新增
    *businessAdd({ payload }, { call }) {
      const res = yield call(businessAdd, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 业务修改
    *businessUpdate({ payload }, { call }) {
      const res = yield call(businessUpdate, payload);
      if (res?.status === 200) {
        return true;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 业务详情查看
    *getBusiness({ payload }, { call }) {
      const res = yield call(getBusiness, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 业务删除
    *deleteBusiness({ payload }, { call }) {
      const res = yield call(deleteBusiness, payload?.id);
      if (res?.status === 200) {
        return res;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    *structureAdd({ payload }, { call }) {},
    *getBusinessList({ payload }, { call }) {
      const res = yield call(getBusinessList, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    *exportBusiness({ payload }, { call }) {
      return yield call(exportBusiness, payload);
    },
    *exportBusinessAll({}, { call }) {
      return yield call(exportBusinessAll);
    },
    *oneKeyMatchList({ payload }, { call }) {
      const res = yield call(oneKeyMatchList, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    *oneKeyMatch({ payload }, { call }) {
      const res = yield call(oneKeyMatch, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    *matchCheck({ payload }, { call }) {
      const res = yield call(matchCheck, payload);
      if (res?.status === 200) {
        return res;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 关联列表
    *getColumnList({ payload }, { call }) {
      const res = yield call(getColumnList, payload);
      if (res?.status === 200) {
        return res;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 关联
    *saveBusiColumnMapping({ payload }, { call }) {
      const res = yield call(saveBusiColumnMapping, payload);
      if (res?.status === 200) {
        return res;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 迁出
    *emigration({ payload }, { call }) {
      const res = yield call(emigration, payload);
      if (res?.status) {
        message.warn(res?.message);
        return false
      } else {
        return res;
      }
    },

    // 表结构列表
    *getTableStructureList({ payload }, { call }) {
      const res = yield call(getTableStructureList, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
    // 选择归属机构和系统查询表信息
    *getTableList({ payload }, { call }) {
      const res = yield call(getTableList, payload);
      if (res?.status === 200) {
        return res.data;
      } else {
        message.warn(res?.message);
        return false;
      }
    },
  },
  reducers: {},
};

export default model;

import {
  queryPage,
  delRole,
  addrole,
  getrolebyroleid,
  check,
  dellist,
} from '@/services/functionManagement/index';
import { message } from 'antd';
export default {
  namespace: 'functionManagement',
  state: {
    // 列表的数据
    tableList: [],
    // 角色的数据
    roleDetail: {},
  },
  reducers: {
    /**
     * 同步列表的数据
     */
    setTableList(state, { payLoad }) {
      return {
        ...state,
        tableList: payLoad,
      };
    },
    /**
     * 同步角色的数据
     */
    setRoleDetail(state, { payLoad }) {
      return {
        ...state,
        roleDetail: payLoad,
      };
    },
  },
  effects: {
    /**
     * 获取表格的数据
     */
    *getTableList({ payload }, { put, call }) {
      const res = yield call(queryPage, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTableList',
          payLoad: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 审核
     */
    *check({ payload }, { put, call }) {
      console.log(payload);
      const res = yield call(check, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 删除角色
     */
    *delRole({ payload }, { put, call }) {
      const res = yield call(delRole, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 添加角色
     */
    *addrole({ payload }, { put, call }) {
      const res = yield call(addrole, payload);
      if (res && res.status === 200) {
        if(res?.data?.status === "0000"){
          return true;
        }
        message.error(res?.data?.errMsg);
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取详情接口
     */
    *getrolebyroleid({ payload }, { put, call }) {
      const res = yield call(getrolebyroleid, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setRoleDetail',
          payLoad: res.data[0],
        });
        return res.data[0]
      } else {
        message.error(res.message);
      }
    },
    /**
     * 批量删除
     */
    *dellist({ payload }, { put, call }) {
      const res = yield call(dellist, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
  },
};

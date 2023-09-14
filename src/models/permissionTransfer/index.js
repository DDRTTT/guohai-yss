import {
  queryMemberByDept,
  getTurnoverNum,
  getAuthDraw,
  getUserVoByUserId,
  getDeptLeaderByUserId,
  taskListPage,
  dictQueryInfo,
  getProductEnumList,
  addTask,
  querybyid,
  getSeq,
  updateTask,
  getAllUser,
} from '@/services/permissionTransfer/index';
import { message } from 'antd';
export default {
  namespace: 'permissionTransfer',
  state: {
    taskList: [],
    taskTotal: 0,
    turnoverNum: '',
    turnoverTh: [],
    leaderInfo: '',
    depUserList: [],

    productList: [],
    productTotal: 0,

    pageDetail: {},

    allUserList: [],
  },
  reducers: {
    /**
     * 同步
     */
    setTaskListPage(state, { payLoad }) {
      return {
        ...state,
        taskList: payLoad,
      };
    },
    setTaskTotal(state, { payLoad }) {
      return {
        ...state,
        taskTotal: payLoad,
      };
    },
    setAllUserList(state, { payLoad }) {
      return {
        ...state,
        allUserList: payLoad,
      };
    },
    setPageDetail(state, { payLoad }) {
      return {
        ...state,
        pageDetail: payLoad,
      };
    },
    /**
     * 同步
     */
    setProductList(state, { payLoad }) {
      return {
        ...state,
        productList: payLoad,
      };
    },
    setProductTotal(state, { payLoad }) {
      return {
        ...state,
        productTotal: payLoad,
      };
    },
    /**
     * 同步
     */
    setTurnoverNum(state, { payLoad }) {
      return {
        ...state,
        turnoverNum: payLoad,
      };
    },
    /**
     * 同步
     */
    setTurnoverTh(state, { payLoad }) {
      return {
        ...state,
        turnoverTh: payLoad,
      };
    },
    /**
     * 同步
     */
    setLeaderInfo(state, { payLoad }) {
      return {
        ...state,
        leaderInfo: payLoad,
      };
    },
    /**
     * 同步
     */
    setDepUserList(state, { payLoad }) {
      return {
        ...state,
        depUserList: payLoad,
      };
    },
  },
  effects: {
    /**
     * 查询用户下的任务列表
     */
    *getTaskListPage({ payload }, { put, call }) {
      const res = yield call(taskListPage, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTaskListPage',
          payLoad: res.data.rows,
        });
        yield put({
          type: 'setTaskTotal',
          payLoad: res.data.total,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取全量用户
     */
    *getAllUserList({ payload }, { put, call }) {
      const res = yield call(getAllUser, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setAllUserList',
          payLoad: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 查询用户下的产品列表
     */
    *getProductListPage({ payload }, { put, call }) {
      const res = yield call(getProductEnumList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProductList',
          payLoad: res.data.rows,
        });
        yield put({
          type: 'setProductTotal',
          payLoad: res.data.total,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取委托交接编号
     */
    *getTurnoverNum({ payload }, { put, call }) {
      const res = yield call(getTurnoverNum, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTurnoverNum',
          payLoad: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 权限收回
     */
    *getAuthDraw({ payload }, { put, call }) {
      const res = yield call(getAuthDraw, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
    // 获取主键id
    *getSeq({ payload }, { put, call }) {
      const res = yield call(getSeq, payload);
      if (res && res.status === 200) {
        return res.data;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 提交信息
     */
    *addTask({ payload }, { put, call }) {
      const res = yield call(addTask, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 修改信息
     */
    *updateTask({ payload }, { put, call }) {
      const res = yield call(updateTask, payload);
      if (res && res.status === 200) {
        return true;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 查询详情
     */
    *querybyid({ payload }, { put, call }) {
      const res = yield call(querybyid, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setPageDetail',
          payLoad: res.data,
        });
        return res.data;
      } else {
        message.error(res.message);
      }
    },
    /**
     * 查询用户岗位信息
     */
    *getUserVoByUserId({ payload }, { put, call }) {
      const res = yield call(getUserVoByUserId, payload);
      if (res && res.status === 200) {
        yield put({ type: 'queryMemberByDept', payload: { deptId: res.data.rows[0]?.deptId } });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 根据岗位查询用户集合
     */
    *queryMemberByDept({ payload }, { put, call }) {
      const res = yield call(queryMemberByDept, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setDepUserList',
          payLoad: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 根据用户id查询部门领导人
     */
    *getDeptLeaderByUserId({ payload }, { put, call }) {
      const res = yield call(getDeptLeaderByUserId, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setLeaderInfo',
          payLoad: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 根据字典code获取字典列表
     */
    *getDictQueryInfo({ payload }, { put, call }) {
      const res = yield call(dictQueryInfo, payload);
      if (res) {
        yield put({
          type: 'setTurnoverTh',
          payLoad: res,
        });
      } else {
        message.error(res.message);
      }
    },
  },
};

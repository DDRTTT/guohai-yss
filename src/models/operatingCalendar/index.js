import {
  querylist,
  getHoliday,
  addTask,
  queryQuadrant,
  updateHandleSchedul,
  getAddress,
  stackedBarChart,
  updateTask,
  queryMsgById,
  getTabList,
  getInfoByUser,
  subscribeChange,
  getAllSubInfo,
  queryInfoListByCode,
  getFilter,
  getSecSubInfo,
  getProductEnum,
  getperson,
  queryProductPeriodInfoList,
  addProductPeriodInfo,
  delProductPeriodInfo,
  getProNameAndCodeAPI,
  getProTypeListAPI,
} from '@/services/operatingCalendar/index';
import {
  getHandleStrategyList,
  getSetPath,
  getAllSys,
  addBatchSys,
  deleteByName,
  getPer,
  addBatchPer,
  scheduleStrategyAdd,
  getAllByUser,
  scheduleStrategyDelete,
  getRemindList,
  addPeople,
  deleteById,
  getHandleList,
  handleStrategyAdd,
  handleStrategyDeleteById,
  getEnableByUser,
  taskHandleAdd,
} from '@/services/operatingCalendar/strategy';
import { message } from 'antd';
import flatMap from 'lodash/flatMap';

export default {
  namespace: 'operatingCalendar',
  state: {
    //分类列表的数据
    noticeList: [],
    // 任务的列表的数据
    taskList: [],
    //交易所休息日
    holidayList: [],
    // 象限视图的列表
    quadrantList: [],
    // 产品视图的列表
    stackedBarChartList: [],
    // 任务详情
    taskInfo: {},
    // tab的值
    tabList: [],
    // 订阅设置列表
    subscribeList: [],
    //全部任务分类的字典
    allSubInfoList: [],
    // 筛选条件列表
    filterList: [],
    // 二级分类列表
    secSubInfoList: [],
    // 产品名称下拉列表
    productEnum: [],
    // 获取机构下全部用户
    personList: [],
    // 系统设置的目录
    systemPathList: [],
    // 获取办理策略列表
    handleStrategyList: [],
    // 全量获取样式设置的模版
    allSysList: [],
    // 用户所有的日历策略
    calendarSetList: [],
    // 提醒策略的列表
    remindList: [],
    // 办理策略的列表
    handleList: [],
    // 用户目前已启用的日程策略
    enableByUser: {},
    // 产品全称下拉选项列表
    productAllNameList: [],
    // 开放日状态下拉列表
    openStateList: [],
  },
  reducers: {
    /**
     * 获取用户所有的日历策略
     */
    setCalendarSetList(state, { payload }) {
      return {
        ...state,
        calendarSetList: payload,
      };
    },
    /**
     * 获取全量的样式设置
     */
    setAllSys(state, { payload }) {
      return {
        ...state,
        allSysList: payload,
      };
    },
    /**
     * 获取系统设置的目录
     */
    setSystemPathList(state, { payload }) {
      return {
        ...state,
        systemPathList: payload,
      };
    },
    /**
     * 获取办理策略列表
     */
    setHandleStrategyList(state, { payload }) {
      return {
        ...state,
        handleStrategyList: payload,
      };
    },
    /**
     * 获取产品名称下拉列表
     */
    setPersonList(state, { payload }) {
      return {
        ...state,
        personList: payload,
      };
    },
    /**
     * 获取产品名称下拉列表
     */
    setProductEnum(state, { payload }) {
      return {
        ...state,
        productEnum: payload,
      };
    },
    /**
     * 二级分类列表
     */
    setSecSubInfoList(state, { payload }) {
      return {
        ...state,
        secSubInfoList: payload,
      };
    },
    /**
     * 同步筛选列表的数据
     */
    setFilterList(state, { payload }) {
      return {
        ...state,
        filterList: payload,
      };
    },
    /**
     * 同步分类列表的数据
     */
    setNoticeList(state, { payload }) {
      return {
        ...state,
        noticeList: payload,
      };
    },
    /**
     * 同步任务列表的数据
     */
    setTaskList(state, { payload }) {
      return {
        ...state,
        taskList: payload,
      };
    },
    /**
     * 同步交易所休息日
     */
    setHoliday(state, { payload }) {
      return {
        ...state,
        holidayList: payload,
      };
    },
    /**
     * 同步象限列表
     */
    setQuadrantList(state, { payload }) {
      return {
        ...state,
        quadrantList: payload,
      };
    },
    /**
     * 同步产品视图列表
     */
    setStackedBarChartList(state, { payload }) {
      return {
        ...state,
        stackedBarChartList: payload,
      };
    },
    /**
     * 同步消息详情数据
     */
    setQueryMsgById(state, { payload }) {
      return {
        ...state,
        taskInfo: payload,
      };
    },
    /**
     * 同步左上角的3个tab
     */
    setTabList(state, { payload }) {
      return {
        ...state,
        tabList: payload,
      };
    },
    /**
     * 同步订阅的列表
     */
    setSubscribeList(state, { payload }) {
      return {
        ...state,
        subscribeList: payload,
      };
    },
    /**
     * 同步提醒的列表
     */
    setGetRemindList(state, { payload }) {
      return {
        ...state,
        remindList: payload,
      };
    },
    /**
     * 同步任务类型字典
     */
    setAllSubInfoList(state, { payload }) {
      return {
        ...state,
        allSubInfoList: payload,
      };
    },
    /**
     * 同步办理策略
     */
    setGetHandleList(state, { payload }) {
      return {
        ...state,
        handleList: payload,
      };
    },
    /**
     * 同步用户目前已经启用的日历策略
     */
    setEnableByUser(state, { payload }) {
      return {
        ...state,
        enableByUser: payload,
      };
    },
    // 产品全称下拉选项值
    setProductAllNameList(state, { payload }) {
      return {
        ...state,
        productAllNameList: payload,
      };
    },
    // 开放日状态下拉列表
    setOpenStateList(state, { payload }) {
      return {
        ...state,
        openStateList: payload,
      };
    },
  },
  effects: {
    /**
     * 新增或修改办理状态
     */
    *taskHandleAdd({ payload, callBack }, { put, call }) {
      const res = yield call(taskHandleAdd, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 获取当前用户目前已经启用的日历策略
     */
    *getEnableByUser({ payload, callBack }, { put, call }) {
      const res = yield call(getEnableByUser, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setEnableByUser',
          payload: res.data || [],
        });
      }
    },
    /**
     * 删除办理策略
     */
    *handleStrategyDeleteById({ payload, callBack }, { put, call }) {
      const res = yield call(handleStrategyDeleteById, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 删除提醒策略
     */
    *deleteById({ payload, callBack }, { put, call }) {
      const res = yield call(deleteById, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 删除日历策略
     */
    *scheduleStrategyDelete({ payload, callBack }, { put, call }) {
      const res = yield call(scheduleStrategyDelete, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 添加或者修改日历策略
     */
    *scheduleStrategyAdd({ payload, callBack }, { put, call }) {
      const res = yield call(scheduleStrategyAdd, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 获取用户所有的日历策略
     */
    *getAllByUser({ payload }, { put, call }) {
      const res = yield call(getAllByUser, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setCalendarSetList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 获取用户个人的颜色设置
     */
    *getPer({ payload }, { put, call }) {
      const res = yield call(getPer, payload);
      if (res && res.status === 200) {
        return Promise.resolve(res.data);
      } else {
        message.error(res.message);
      }
    },
    /**
     * 删除模版
     */
    *deleteByName({ payload }, { put, call }) {
      const res = yield call(deleteByName, payload);
      if (res && res.status === 200) {
        return Promise.resolve(true);
      }
    },
    /**
     * 新增或修改个人颜色
     */
    *addBatchPer({ payload }, { put, call }) {
      const res = yield call(addBatchPer, payload);
      if (res && res.status === 200) {
        return Promise.resolve(res);
      }
    },
    /**
     * 新增或修改个人提醒策略
     */
    *addPeople({ payload }, { put, call }) {
      const res = yield call(addPeople, payload);
      if (res && res.status == 200) {
        return Promise.resolve(res);
      }
    },
    /**
     * 新增或修改办理策略
     */
    *handleStrategyAdd({ payload }, { put, call }) {
      const res = yield call(handleStrategyAdd, payload);
      if (res && res.status == 200) {
        return Promise.resolve(res);
      }
    },
    /**
     * 新增或修改系统颜色模版设置
     */
    *addBatchSys({ payload }, { put, call }) {
      const res = yield call(addBatchSys, payload);
      if (res && res.status === 200) {
        return Promise.resolve(res);
      }
    },
    /**
     * 获取样式设置的模版
     */
    *getAllSys({ payload }, { put, call }) {
      const res = yield call(getAllSys);
      if (res && res.status === 200) {
        yield put({
          type: 'setAllSys',
          payload: res.data || [],
        });
        return Promise.resolve(true);
      }
    },
    /**
     * 获取系统设置的代码
     */
    *getSystemPathList({ payload }, { put, call }) {
      const res = yield call(getSetPath);
      if (res && res.status === 200) {
        yield put({
          type: 'setSystemPathList',
          payload: res.data || [],
        });
        return Promise.resolve(true);
      }
    },
    /**
     * 获取办理策略列表
     */
    *getHandleStrategy({ payload }, { put, call }) {
      const res = yield call(getHandleStrategyList);
      if (res && res.status === 200) {
        yield put({
          type: 'setHandleStrategyList',
          payload: res.data || [],
        });
        return Promise.resolve(res.data);
      }
    },
    /**
     * 获取当前机构全部用户
     */
    *getPersonList({ payload }, { put, call }) {
      const res = yield call(getperson);
      if (res && res.status === 200) {
        yield put({
          type: 'setPersonList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 产品名称下拉列表
     */
    *getProductEnum({ payload }, { put, call }) {
      const res = yield call(getProductEnum);
      if (res && res.status === 200) {
        yield put({
          type: 'setProductEnum',
          payload: res.data || [],
        });
      }
    },
    /**
     * 获取二级分类列表
     */
    *getSecSubInfoList({ payload }, { put, call }) {
      const res = yield call(getSecSubInfo, { code: 'customItems' });
      if (res && res.status === 200) {
        yield put({
          type: 'setSecSubInfoList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 获取筛选条件的列表
     */
    *getFilterList({ payload }, { put, call }) {
      const res = yield call(getFilter, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setFilterList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 获取任务类型的字典
     */
    *getAllSubInfoList({ payload }, { put, call }) {
      const res = yield call(getAllSubInfo, payload);
      if (res && res.status === 200) {
        let tempData = {};
        res.data.map(item => {
          tempData[item.code] = item.name;
        });
        yield put({
          type: 'setAllSubInfoList',
          payload: tempData || {},
        });
        return Promise.resolve(res.data);
      }
    },
    /**
     * 获取任务列表
     */
    *getTaskList({ payload }, { put, call }) {
      const res = yield call(queryInfoListByCode, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTaskList',
          payload: res.data || [],
        });
        return Promise.resolve(true);
      }
    },
    /**
     * 切换订阅状态的接口
     */
    *subscribeChange({ payload }, { put, call }) {
      const res = yield call(subscribeChange, payload);
      if (res && res.status === 200) {
        return Promise.resolve(true);
      }
    },
    /**
     * [getRemindList 获取提醒设置的列表]
     */
    *getRemindList({ payload }, { put, call }) {
      const res = yield call(getRemindList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setGetRemindList',
          payload: res.data || [],
        });
      }
    },
    /**
     * [getHandleList 获取办理设置的列表]
     */
    *getHandleList({ payload }, { put, call }) {
      const res = yield call(getHandleList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setGetHandleList',
          payload: res.data || [],
        });
      }
    },
    /**
     * [getSubscribeList 获取订阅设置的列表]
     */
    *getSubscribeList({ payload }, { put, call }) {
      const res = yield call(getInfoByUser, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setSubscribeList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 获取左上角的tab的列表
     */
    *getTabList({ payload }, { put, call }) {
      const res = yield call(getTabList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setTabList',
          payload: res.data || [],
        });

        return Promise.resolve(res.data);
      }
    },
    /**
     * 获取表格的数据
     */
    *getNoticeList({ payload }, { put, call }) {
      const res = yield call(querylist, payload);
      if (res && res.status === 200) {
        // 处理数据
        let _data = res.data || [];
        let tempData = _data.map(item => {
          const localData = item.date;
          return item.taskList.map(sonItem => {
            return {
              title: JSON.stringify(sonItem),
              start: localData,
              color: 'transparent',
              textColor: 'black',
            };
          });
        });
        tempData = flatMap(tempData);
        yield put({
          type: 'setNoticeList',
          payload: tempData,
        });
      }
    },
    /**
     * 获取交易所休息日
     */
    *getHolidayList({ payload }, { put, call }) {
      const res = yield call(getHoliday, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setHoliday',
          payload: res.data || [],
        });
      }
    },
    /**
     * 添加任务
     */
    *addTask({ payload, callBack }, { put, call }) {
      const res = yield call(addTask, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 获取象限视图
     */
    *queryQuadrant({ payload }, { put, call }) {
      const res = yield call(queryQuadrant, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setQuadrantList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 完成/取消完成任务
     */
    *updateHandleSchedul({ payload, callBack }, { put, call }) {
      const res = yield call(updateHandleSchedul, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },
    /**
     * 获取产品数据视图的数据
     */
    *stackedBarChart({ payload, callBack }, { put, call }) {
      const res = yield call(stackedBarChart, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setStackedBarChartList',
          payload: res.data || [],
        });
      }
    },
    /**
     * 根据id获取任务详情
     */
    *getQueryMsgById({ payload, callBack }, { put, call }) {
      const res = yield call(queryMsgById, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setQueryMsgById',
          payload: res.data,
        });
      }
    },
    /**
     * 修改任务
     */
    *getUpdateTask({ payload, callBack }, { put, call }) {
      const res = yield call(updateTask, payload);
      if (res && res.status === 200) {
        callBack && callBack();
      }
    },

    // 开放日设置列表
    *queryProductPeriodInfoList({ payload, callback }, { call }) {
      const response = yield call(queryProductPeriodInfoList, payload);
      if (response && response.status === 200) {
        if (callback) callback(response);
      }
    },

    // 开放日设置新增
    *addProductPeriodInfo({ payload, callback }, { call }) {
      const response = yield call(addProductPeriodInfo, payload);
      if (response && response.status === 200) {
        if (callback) callback();
      }
    },

    // 开放日设置删除
    *delProductPeriodInfo({ payload, callback }, { call }) {
      const response = yield call(delProductPeriodInfo, payload);
      if (response) {
        if (callback) callback();
      }
    },

    // 产品全称下拉列表
    *getProNameAndCodeList(payload, { put, call }) {
      const res = yield call(getProNameAndCodeAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProductAllNameList',
          payload: res.data || [],
        });
      }
    },

    // 开放日状态下拉列表
    *getOpenStateList(payload, { put, call }) {
      const res = yield call(getProTypeListAPI);
      if (res) {
        yield put({
          type: 'setOpenStateList',
          payload: res || [],
        });
      }
    },
  },
};

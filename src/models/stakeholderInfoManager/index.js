import {
  queryTableList,
  queryType,
  queryById,
  productEnum,
  findAgencyByType,
  getOrgNameList,
  getEmployeeMap,
  getOrgLinkerNameList,
  getProInfo,
  addMap,
  deleteByIds,
  updateChecked,
  searchNameListApi,
  getDetailsAPI,
} from '@/services/stakeholderInfoManager/index';
import { message } from 'antd';

export default {
  namespace: 'stakeholderInfoManager',
  state: {
    // 表格数据
    tableList: [],
    // 干系人类别列表
    stakeholdersTypeList: [],
    // 产品名称下拉
    productEnum: [],
    // 机构下拉值
    orgNameList: [],
    // 干系人名字的列表
    nameList: [],
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
     * 同步干系人类别列表
     */
    setStakeholdersTypeList(state, { payload }) {
      return {
        ...state,
        stakeholdersTypeList: payload,
      };
    },
    /**
     * 同步产品名称列表
     */
    setProductEnumList(state, { payload }) {
      return {
        ...state,
        productEnum: payload,
      };
    },
    /**
     * 同步机构下拉值
     */
    setOrgNameList(state, { payload }) {
      return {
        ...state,
        orgNameList: payload,
      };
    },
    /**
     * 同步干系人下拉值
     */
    setNameList(state, { payload }) {
      // 去掉这个console会报错
      console.log(payload);
      return {
        ...state,
        nameList: payload,
      };
    },
    // 清空
    setResetList(state, { payload }) {
      return {
        ...state,
        // 干系人类别列表
        stakeholdersTypeList: [],
        // 产品名称下拉
        // productEnum: [],
        // 机构下拉值
        orgNameList: [],
        // 干系人名字的列表
        nameList: [],
      };
    },
  },
  effects: {
    /**
     * 根据id查询的信息详情 员工信息
     */
    *getEmployeesDetail({ payload }, { put, call }) {
      const res = yield call(getDetailsAPI, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setEmployeesDetail',
          payload: res.data,
        });
        return res.data;
      } else {
        message.error(res.message);
      }
    },
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
     * 获取干系人类别列表
     */
    *getStakeholdersTypeList({ payload }, { put, call }) {
      const res = yield call(queryType, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setStakeholdersTypeList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取产品名称下拉
     */
    *getProductEnumList({ payload }, { put, call }) {
      const res = yield call(productEnum, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setProductEnumList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取干系人详情
     */
    *getStakeholdersQueryById({ payload, callback }, { put, call }) {
      const res = yield call(queryById, payload);
      if (res && res.status === 200) {
        callback && callback(res.data);
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取机构名称的下拉
     */
    *getOrgNameList({ payload, categoryType }, { put, call }) {
      // if (categoryType == 0) {
      yield put({
        type: 'setOrgNameList',
        payload: [{ id: 7, orgName: '国海证券股份有限公司' }],
      });
      // }
      // } else {
      //   const res = yield call(getOrgNameList, payload);
      //   if (res && res.status === 200) {
      //     yield put({
      //       type: 'setOrgNameList',
      //       payload: res.data,
      //     });
      //   } else {
      //     message.error(res.message);
      //   }
      // }
    },
    /**
     * 获取干系人名字的下拉
     */
    *getNameList({ payload, categoryType }, { put, call }) {
      const res = yield call(categoryType == 0 ? getEmployeeMap : getOrgLinkerNameList, payload);
      if (res && res.status === 200) {
        yield put({
          type: 'setNameList',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    /**
     * 获取搜索用的名字的下拉列表
     */
    *getSearchNameList({ payload, callBack }, { put, call }) {
      const res = yield call(searchNameListApi, payload);
      if (res && res.status === 200) {
        return res.data;
      } else {
        if (res.message) {
          message.error(res.message);
        } else {
          console.log('获取姓名下拉数据失败');
        }
      }
    },
    /**
     * 获取产品的详细信息
     */
    *getProInfo({ payload, callback }, { put, call }) {
      const res = yield call(getProInfo, payload);
      if (res && res.status === 200) {
        callback && callback(res.data);
      } else {
        message.error(res.message);
      }
    },
    /**
     * 添加修改干系人
     */
    *addMap({ payload, callback }, { put, call }) {
      const res = yield call(addMap, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
    /**
     * 删除干系人信息
     */
    *deleteByIds({ payload, callback }, { put, call }) {
      const res = yield call(deleteByIds, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
    /**
     * 审核与反审核
     */
    *updateChecked({ payload, callback }, { put, call }) {
      const res = yield call(updateChecked, payload);
      if (res && res.status === 200) {
        callback && callback();
      } else {
        message.error(res.message);
      }
    },
  },
};

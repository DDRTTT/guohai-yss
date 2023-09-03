import { message } from 'antd';
import {
  getTableDataList,
  getProductList,
  getProductReleaseList,
  getProductInfoView,
  getUsersList,
  getProductSave,
  getProBeDepList,
  getmatterLebelAdd,
  getmatterLebel,
  getCalendarDataList,
  getProductDel,
  getProductInfo,
  getProductUpdateSave,
  getproTypeList,
  getExamineAPI,
  getRecordUsersList,
} from '@/services/productScheduling';
import { cloneDeep } from 'lodash';

const loopSetParent = arr => {
  arr.map(item => {
    if (item.id) {
      item.key = item.id + '_' + item.key;
      item.value = item.id + '_' + item.value;
    }
    if (item.children) {
      loopSetParent(item.children);
    }
  });
};

const model = {
  namespace: 'productScheduling',
  state: {
    /* 表格列表 */
    tableList: [],
    // 产品名称/产品代码
    productList: [],
    // 用户列表
    ccObjectList: [],
    // 产品归属部门列表
    proBeDepList: [],
    // 事项类型列表
    matterLebelList: [],
    // 日历列表
    calendarList: [],
    // 查询数据
    productData: [],
    assData: [],
    proTypeList: [],
  },
  effects: {
    /* 查询任务列表 */
    *handleTableDataList({ payload }, { call }) {
      const response = yield call(getTableDataList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 产品名称/产品代码 查询
    *queryProductList({ payload }, { call, put }) {
      const response = yield call(getProductList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productListDict',
          payload: { productDropList: response.data },
        });
      } else {
        message.error('查询失败');
      }
    },
    // 产品发布计划产品名称查询
    *queryProductReleaseList({ payload }, { call, put }) {
      const response = yield call(getProductReleaseList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'productRelease',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 产品发布计划产品名称回显信息
    *queryProductInfoView({ payload }, { call, put }) {
      const response = yield call(getProductInfoView, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 获取所有用户
    *queryUsersList({ payload }, { call, put }) {
      const response = yield call(getUsersList, payload);
      if (response && response.status === 200) {
        if (response.data && response.data.length) {
          response.data.forEach(item => {
            if (item.hasOwnProperty('parentId')) {
              delete item['parentId'];
            }
          });
        }
        yield put({
          type: 'users',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 获取备案联系人
    *queryRecordUsersList({ payload }, { call, put }) {
      const response = yield call(getRecordUsersList, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 产品类型 查询
    *handleProductTypeList({ payload }, { call, put }) {
      const response = yield call(getproTypeList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'proType',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 产品归属部门
    *queryProBeDepList({ payload }, { call, put }) {
      const response = yield call(getProBeDepList, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'department',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 新增事项类型
    *queryMatterLebelAdd({ payload }, { call }) {
      const response = yield call(getmatterLebelAdd, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.error('查询失败');
    },
    // 查询事项类型列表
    *queryMatterLebel({ payload }, { call, put }) {
      const response = yield call(getmatterLebel, payload);
      if (response && response.status === 200) {
        yield put({
          type: 'matterLebel',
          payload: response,
        });
      } else {
        message.error('查询失败');
      }
    },
    // 计划新增保存
    *queryProducrSave({ payload }, { call }) {
      const response = yield call(getProductSave, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 计划修改保存
    *queryProducrUpdateSave({ payload }, { call }) {
      const response = yield call(getProductUpdateSave, payload);
      if (response && response.status === 200) {
        return response;
      }
      message.warn(response.message);
    },
    // 日历列表
    *queryCalendarDataList({ payload }, { call, put }) {
      const res = yield call(getCalendarDataList, payload);
      // if (response && response.status === 200) {
      //   yield put({
      //     type: 'calendar',
      //     payload: response,
      //   });
      // } else {
      //   message.error('查询失败');
      // }
      if (!res.data) return;
      yield put({
        type: 'calendar',
        payload: res.data,
      });
    },
    // 计划发布删除
    *queryProductDel({ payload }, { call }) {
      const response = yield call(getProductDel, payload);
      if (response.status === 200) {
        return response;
      } else {
        message.error('删除失败');
      }
    },
    // 计划查询
    *queryProductInfo({ payload }, { call, put }) {
      const response = yield call(getProductInfo, payload);
      if (response.status === 200) {
        // yield put({
        //   type: 'prodectInfo',
        //   payload: response,
        // });
        return response;
      }
      message.warn(response.message);
    },
    // 审核、反审核
    *queryExamineAPI({ payload }, { call }) {
      const response = yield call(getExamineAPI, payload);
      let flag = false;
      if (response.status === 200) {
        flag = true;
        message.success('成功');
      } else {
        message.warn(response.message);
      }
      return flag;
    },
  },
  reducers: {
    productListDict(state, action) {
      return {
        ...state,
        productList: action.payload.productDropList,
      };
    },
    productRelease(state, action) {
      return {
        ...state,
        productList: action.payload.data,
      };
    },
    users(state, action) {
      const tempList = cloneDeep(action.payload.data);
      loopSetParent(tempList);
      console.log(tempList);
      return {
        ...state,
        ccObjectList: tempList,
      };
    },
    department(state, action) {
      return {
        ...state,
        proBeDepList: action.payload.data,
      };
    },
    matterLebel(state, action) {
      return {
        ...state,
        matterLebelList: action.payload.data,
      };
    },
    proType(state, action) {
      return {
        ...state,
        proTypeList: action.payload.data,
      };
    },
    calendar(state, { payload }) {
      return {
        ...state,
        calendarList: payload,
      };
    },
    // prodectInfo(state,action) {
    //   return {
    //     ...state,
    //     productData:action.payload.data,
    //   }
    // },
  },
};

export default model;

/**
 *Create on 2020/9/29.
 */
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  accountOpenBankDropDown,
  dictBatchQuery,
  dictNameAndCodeBatchQuery,
  handleAccountManagement,
  handleBaseInfoSave,
  handleCustodian,
  handleDel,
  handleExceladd,
  handleInvestoraccountQuerytById,
  handleInvestoraccountRemove,
  handleInvestoraccounttraAccountupdateapply,
  handleInvestorAddByExcel,
  handleInvestorDelete,
  handleInvestorPreviewinv,
  handleInvestorRiskLevel,
  handleInvestorSelectById,
  handleInvestorTempupdate,
  handleInvestorUpdate,
  handleReupload,
  handleReview,
  handleSearch,
  handleTA_ACCPTMD,
  handleTA_DELIVERTYPE,
  handleTA_IDTP,
  handleTA_IDTPTP,
  handleTA_PROTP,
  handleTA_STATEMENTFLAG,
  salesAgency,
  initFdistributorcode,
} from '@/services/investorsManagement/newCustomerHandling';

let model = {
  namespace: 'newCustomerHandling',

  state: {
    loading: false,
    currentPage: false,
    data: {
      data: {
        rows: [],
        total: 0,
      },
    },
    renderFdistributorcode: [],
    savePreviewinv: {
      data: {
        rows: [],
        total: 0,
      },
    },

    saveTA_IDTPTP: [],
    saveTA_IDTP: [],
    saveTA_PROTP: [],
    saveInvestorRiskLevel: [],
    saveTA_ACCPTMD: [],
    saveTA_STATEMENTFLAG: [],
    saveTA_DELIVERTYPE: [],
    saveCustodian: [],
    saveCardTypeAndCardNum: [],
    tablePayload: '',
    saveEditId: '',
    saveInvestorSelectById: {},
    saveInvestoraccountQuerytById: {},
    saveCardType: {},
    saveTA_IDTPP: {},
    saveReferrerType: {},
    saveTradingMethod: {},
    saleorginfoResult: {},
    savePayload: {},
    savePayloadForEdit: {},
    accountOpenBank: [],
    currentPages: 1,
    I_currentPage: 1,
    saveDictBatchQuery: {},
    saveDictNameAndCodeBatchQuery: {},
    cleanCommand: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleSearch, payload);

      yield put({
        type: 'savePayload',
        payload: payload,
      });
      yield put({
        type: 'savecurrentPage',
        payload: payload.currentPage,
      });
      yield put({
        type: 'saveNewCustomerHandlingTable',
        payload: response,
      });

      let items = response.data.rows;

      let arr = [];
      items.map((item, index) => {
        let obj = {};
        if (payload.currentPage > 1) {
          item['order'] = `${payload.currentPage}${index}`;
          item['key'] = `${payload.currentPage - 1}${index}`;
        } else {
          item['order'] = 1 + index;
          item['key'] = index;
        }

        obj['cardType'] = item['cardType'];
        obj['cardNum'] = item['cardNum'];
        arr.push(obj);
      });
      if (payload.types === 0) {
        yield put({
          type: 'saveCardTypeAndCardNum',
          payload: arr,
        });
      } else {
        const response = yield call(handleAccountManagement, { arr, ...payload });
        yield put({
          type: 'saveCardTypeAndCardNum',
          payload: response,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *search({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *editId({ payload }, { put }) {
      yield put({
        type: 'saveEditId',
        payload: payload,
      });
    },

    // 审核
    *check({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleReview, payload);
      const tablePayload = yield select(state => state.newCustomerHandling.tablePayload);
      if (response.status === 200 && response.message === 'success') {
        message.success('审核成功');
        yield put({
          type: 'fetch',
          payload: tablePayload,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 产品托管人select
    *custodian({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleCustodian, payload);

      yield put({
        type: 'saveCustodian',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 词汇字典批量查询
    *dictBatchQuery({ payload }, { call, put }) {
      const response = yield call(dictBatchQuery, payload);
      if (response.data) {
        yield put({
          type: 'saveDictBatchQuery',
          payload: response.data,
        });
      }
    },

    *dictNameAndCodeBatchQuery({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(dictNameAndCodeBatchQuery, payload);
      if (response.data) {
        yield put({
          type: 'saveDictNameAndCodeBatchQuery',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 词汇字典
    *dict({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const saveTA_IDTP = yield call(handleTA_IDTP);
      const saveTA_PROTP = yield call(handleTA_PROTP);
      const saveInvestorRiskLevel = yield call(handleInvestorRiskLevel);
      const saveTA_ACCPTMD = yield call(handleTA_ACCPTMD);
      const saveTA_STATEMENTFLAG = yield call(handleTA_STATEMENTFLAG);
      const saveTA_DELIVERTYPE = yield call(handleTA_DELIVERTYPE);

      yield put({
        type: 'saveTA_IDTP',
        payload: saveTA_IDTP.response,
      });
      yield put({
        type: 'saveTA_PROTP',
        payload: saveTA_PROTP.response,
      });
      yield put({
        type: 'saveInvestorRiskLevel',
        payload: saveInvestorRiskLevel.response,
      });
      yield put({
        type: 'saveTA_ACCPTMD',
        payload: saveTA_ACCPTMD.response,
      });
      yield put({
        type: 'saveTA_STATEMENTFLAG',
        payload: saveTA_STATEMENTFLAG.response,
      });
      yield put({
        type: 'saveTA_DELIVERTYPE',
        payload: saveTA_DELIVERTYPE.response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 销售机构下拉
    *dropDownSaleorginfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(salesAgency, payload);
      if (response.data) {
        yield put({
          type: 'saleorginfo',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 证件类型
    *cardType({ payload }, { call, put }) {
      const response = yield call(handleTA_IDTPTP, payload);
      if (response) {
        yield put({
          type: 'saveTA_IDTPTP',
          payload: response,
        });
      }
    },

    // 推荐人类型
    *referrerType({ payload }, { call, put }) {
      const response = yield call(handleTA_IDTPTP, payload);
      if (response) {
        yield put({
          type: 'saveReferrerType',
          payload: response,
        });
      }
    },

    // 交易手段
    *tradingMethod({ payload }, { call, put }) {
      const response = yield call(handleTA_IDTPTP, payload);
      if (response) {
        yield put({
          type: 'saveTradingMethod',
          payload: response,
        });
      }
    },

    // 经办人证件类型
    *cardTypeTA_IDTPP({ payload }, { call, put }) {
      const response = yield call(handleTA_IDTPTP, payload);
      if (response) {
        yield put({
          type: 'saveTA_IDTPP',
          payload: response,
        });
      }
    },

    // 保存信息
    *saveInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleBaseInfoSave, payload);
      if (response.status === 200 && response.message === 'success') {
        message.success('投资者信息添加成功');
        yield put(routerRedux.push('/productDataManage/myInvestor'));
      } else {
        message.warn(response.message);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 信息修改后保存
    *updateSaveInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleInvestorUpdate, payload.par);
      let investorId;
      if (response.status === 200 && response.message === 'success') {
        investorId = response.data;
        message.success('投资者基本信息添加成功');

        let val = payload.fundAccount;
        val.map(item => {
          item['investorId'] = investorId;
        });
        const res = yield call(handleInvestoraccounttraAccountupdateapply, [...val]);
        if (res.response.status === 200 && res.response.message === 'success') {
          investorId = response.data;
          message.success('投资者交易账号添加成功');
        } else {
          message.warn(response.message);
        }
      } else {
        message.warn(response.message);
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // '投资者'信息删除接口（同时调用删除投资人基金账号信息）
    *investorDelete({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let obj = { id: payload };
      const response1 = yield call(handleInvestorDelete, obj);
      const response2 = yield call(handleInvestoraccountRemove, payload);
      const tablePayload = yield select(state => state.newCustomerHandling.tablePayload);
      if (response1.response.status === 200 && response1.response.message === 'success') {
        message.success('投资者基本信息删除成功');
        yield put({
          type: 'fetch',
          payload: tablePayload,
        });
      }
      if (response2.response.status === 200 && response2.response.message === 'success') {
        message.success('投资者账号信息删除成功');
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 用户根据id查询投资人信息表数据（同时调用投资者账户信息）
    *investorSelectById({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(handleInvestorSelectById, payload);
      const response2 = yield call(handleInvestoraccountQuerytById, payload);
      if (response.status === 200 && response.message === 'success') {
        yield put({
          type: 'saveInvestorSelectById',
          payload: response.data,
        });
      }
      if (response2.response.status === 200 && response2.response.message === 'success') {
        yield put({
          type: 'saveInvestoraccountQuerytById',
          payload: response2.response.data,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // Excel导入投资人
    *addbyexcel({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(handleInvestorAddByExcel, payload);

      yield put({
        type: 'saveCustodian',
        payload: response.data,
      });

      if (response.status === 200) {
        message.success('上传成功');
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return true;
      } else {
        message.warn(response.message);
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return false;
      }
    },

    // 批量上传预览
    *handleInvestorPreviewinv({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(handleInvestorPreviewinv, payload);
      if (response.status === 200) {
        yield put({
          type: 'handleInvestorPreviewinv1',
          payload: response,
        });
        yield put({
          type: 'savecurrentPage',
          payload: payload.currentPage,
        });
        yield put({
          type: 'savePayloadForEdit',
          payload: payload,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 批量上传预览111111
    *handleInvestorPreviewinv1({ payload }, { put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'savePreviewinv',
        payload: payload,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 模板重新上传（临时表删除API）
    *handleReupload({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield call(handleReupload, payload);
      yield put(routerRedux.push('/productDataManage/addInBatches'));
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 模板数据保存
    *handleExceladd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(handleExceladd, payload);
      if (response.status === 200) {
        message.success('数据保存成功');
        // 保存成功后跳转
        yield put(routerRedux.push('/productDataManage/myInvestor'));
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 临时表修改
    *handleTempupdate({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(handleInvestorTempupdate, payload);
      const par = yield select(state => state.newCustomerHandling.savePayloadForEdit);

      if (response.status === 200) {
        message.success('数据保存成功');
        yield put({
          type: 'handleInvestorPreviewinv',
          payload: par,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *dropDownAccountOpenBank({ payload }, { call, put }) {
      const response = yield call(accountOpenBankDropDown, payload);
      if (response.data) {
        yield put({
          type: 'accountOpenBankInfo',
          payload: response.data,
        });
      }
    },

    *getFdistributorcode({ payload }, { call, put }) {
      yield put({
        type: 'institutionLoadingChange',
        payload: true,
      });
      const response = yield call(initFdistributorcode, payload);
      if (response.status === 200) {
        yield put({
          type: 'fdistributorcodePageChange',
          payload: payload.currentPage,
        });
        yield put({
          type: 'renderFdistributorcode',
          payload: response.data.rows,
        });
      }
      yield put({
        type: 'institutionLoadingChange',
        payload: false,
      });
    },

    // 删除临时表中一条
    *handleDel({ payload }, { call, put, select }) {
      yield put({
        type: 'institutionLoadingChange',
        payload: true,
      });
      const response = yield call(handleDel, payload);
      const par = yield select(state => state.newCustomerHandling.savePayloadForEdit);
      if (response.status === 200) {
        message.success('删除成功');
        yield put({
          type: 'handleInvestorPreviewinv',
          payload: par,
        });
      }
      yield put({
        type: 'institutionLoadingChange',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    currentPages(state, action) {
      return {
        ...state,
        currentPages: action.payload,
      };
    },
    savePayloadForEdit(state, action) {
      return {
        ...state,
        savePayloadForEdit: action.payload,
      };
    },
    renderFdistributorcode(state, action) {
      return {
        ...state,
        renderFdistributorcode: action.payload,
      };
    },
    accountOpenBankInfo(state, action) {
      return {
        ...state,
        accountOpenBank: action.payload,
      };
    },
    saveEditId(state, action) {
      return {
        ...state,
        saveEditId: action.payload,
      };
    },
    saveTA_IDTPP(state, action) {
      return {
        ...state,
        saveTA_IDTPP: action.payload,
      };
    },
    saveReferrerType(state, action) {
      return {
        ...state,
        saveReferrerType: action.payload,
      };
    },
    saveTradingMethod(state, action) {
      return {
        ...state,
        saveTradingMethod: action.payload,
      };
    },
    savePayload(state, action) {
      return {
        ...state,
        tablePayload: action.payload,
      };
    },
    savecurrentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    saveCardTypeAndCardNum(state, action) {
      return {
        ...state,
        saveCardTypeAndCardNum: action.payload,
      };
    },
    saveNewCustomerHandlingTable(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTA_IDTPTP(state, action) {
      return {
        ...state,
        saveTA_IDTPTP: action.payload,
      };
    },
    saveTA_IDTP(state, action) {
      return {
        ...state,
        saveTA_IDTP: action.payload,
      };
    },
    saveTA_PROTP(state, action) {
      return {
        ...state,
        saveTA_PROTP: action.payload,
      };
    },
    saveInvestorRiskLevel(state, action) {
      return {
        ...state,
        saveInvestorRiskLevel: action.payload,
      };
    },
    saveTA_ACCPTMD(state, action) {
      return {
        ...state,
        saveTA_ACCPTMD: action.payload,
      };
    },
    saveTA_STATEMENTFLAG(state, action) {
      return {
        ...state,
        saveTA_STATEMENTFLAG: action.payload,
      };
    },
    saveTA_DELIVERTYPE(state, action) {
      return {
        ...state,
        saveTA_DELIVERTYPE: action.payload,
      };
    },
    saveCustodian(state, action) {
      return {
        ...state,
        saveCustodian: action.payload,
      };
    },

    // 根据id查询信息
    saveInvestorSelectById(state, action) {
      return {
        ...state,
        saveInvestorSelectById: action.payload,
      };
    },
    saveInvestoraccountQuerytById(state, action) {
      return {
        ...state,
        saveInvestoraccountQuerytById: action.payload,
      };
    },
    savePreviewinv(state, action) {
      return {
        ...state,
        savePreviewinv: action.payload,
      };
    },
    saleorginfo(state, action) {
      return {
        ...state,
        saleorginfoResult: action.payload,
      };
    },
    savePreviewinvData(state, action) {
      return {
        ...state,
        savePreviewinvData: action.payload,
      };
    },
    fdistributorcodePageChange(state, action) {
      return {
        ...state,
        I_currentPage: action.payload,
      };
    },
    saveDictBatchQuery(state, action) {
      return {
        ...state,
        saveDictBatchQuery: action.payload,
      };
    },
    saveDictNameAndCodeBatchQuery(state, action) {
      return {
        ...state,
        saveDictNameAndCodeBatchQuery: action.payload,
      };
    },
    cleanCommand(state, action) {
      return {
        ...state,
        cleanCommand: action.payload,
      };
    },
  },
};

export default model;

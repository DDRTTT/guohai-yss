/**
 *Create on 2020/9/29.
 */
import {
  applyAccount,
  dealAdd,
  dealDel,
  dealRegister,
  dealUndo,
  fundAccount,
  getBank,
  getDataById,
  getDealTable,
  getFilterDealTable,
  getOperationRecord,
  getOrgData,
  getOrgType,
  getProductRecordingAgency,
  getProType,
  getQueryCriteria,
  initFdistributorcode,
  investorUpdate,
  updateAccessories,
} from '@/services/investorsManagement/myInvestor';
import { message } from 'antd';

let model = {
  namespace: 'myInvestorInfo',
  state: {
    data: {
      data: {},
    },
    dealData: {
      data: {},
    },
    filterDealData: {
      data: {},
    },
    orgType: [],
    productRecordingAgency: [],
    proTypeData: [],
    operatorData: {
      data: {},
    },
    loading: false,
    dealTableLoading: false,
    fundAccountLoading: false,
    institutionLoading: false,
    accessoriesLoading: false,
    filterLoading: false,
    dealSubBtn: false,
    dealAddBtn: false,
    currentPage: 1,
    D_currentPage: 1,
    G_currentPage: 1,
    I_currentPage: 1,
    dropDownList: {
      TA_IDTPTP: [],
      TA_IDTP: [], //机构证件类型
      TA_PROTP: [], //产品证件类型
      InvestorRiskLevel: [], //投资者风险等级
      TA_ACCPTMD: [], //受理方式
      TA_STATEMENTFLAG: [], //账单寄送方式
      TA_DELIVERTYPE: [], //账单寄送频率
      tradingMethod: [], //使用的交易手段
      referrerType: [], //推荐人类型
      proDate: [], //产品存续期
    },
    fdistributorcode: [],
    annexes: [], //附件
    dealTitle: '',
    addDealStatus: '',
    fundData: {},
    investorType: [
      { code: 0, name: '机构投资者' },
      { code: 1, name: '个人投资者' },
      { code: 2, name: '产品投资者' },
    ],
    qualifiedInvestor: [
      { code: 0, name: '未认定' },
      { code: 1, name: '普通投资者' },
      { code: 2, name: '专业投资者' },
    ],
    controlRel: [
      { code: 0, name: '否' },
      { code: 1, name: '是' },
    ],
    badRecord: [
      { code: 0, name: '否' },
      { code: 1, name: '是' },
    ],
    updateLoading: false,
    basic: false,
    communication: false,
    agent: false,
    aptitude: false,
    institution: false,
    director: false,
    product: false,
    other: false,
    cardType: 0,
    cardNum: '',
    bankData: [],
    applyAccountLoading: false,
    opening: false,
    addDealBtnLoading: false,
    orgData: {
      TG: { data: [] },
      GL: { data: [] },
    },
  },
  effects: {
    //投资人基本信息
    *getDataWithId({ payload }, { call, put }) {
      const response = yield call(getDataById, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: response,
        });

        yield put({
          type: 'getAnnexes',
          payload: response.data.accessories,
        });
      }
    },
    *getDealTable({ payload }, { call, put }) {
      yield put({
        type: 'dealChangeLoading',
        payload: true,
      });
      const response = yield call(getDealTable, payload);
      if (response.status === 200) {
        yield put({
          type: 'dealSave',
          payload: response,
        });
      }
      if (response.data) {
        yield put({
          type: 'dealPageChange',
          payload: payload.par.currentPage,
        });
      }
      yield put({
        type: 'dealChangeLoading',
        payload: false,
      });
    },
    *queryCriteria({ payload }, { call, put }) {
      const response = yield call(getQueryCriteria, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderDropDownList',
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
          type: 'renderFdistributorcode',
          payload: response.data.rows,
        });
      }
      if (response.data) {
        yield put({
          type: 'fdistributorcodePageChange',
          payload: payload.currentPage,
        });
      }
      yield put({
        type: 'institutionLoadingChange',
        payload: false,
      });
    },
    *investorDealUpdate({ payload }, { call, put }) {
      // yield put({
      //   type: 'dealChangeLoading',
      //   payload: true,
      // });
      // yield put({
      //   type: 'dealSubBtnChange',
      //   payload: true,
      // });
      // const {response} = yield call(dealUpdate, payload);
      // if(response.status === 200) {
      //   message.success('修改成功')
      // }
      // yield put({
      //   type: 'dealSubBtnChange',
      //   payload: false,
      // });
    },
    *investorDealAdd({ payload }, { call, put }) {
      yield put({
        type: 'addDealBtnLoadingChange',
        payload: true,
      });
      const response = yield call(dealAdd, payload);
      if (response.status === 200) {
        message.success('操作成功');
        yield put({
          type: 'dealAddBtnChange',
          payload: false,
        });
        yield put({
          type: 'addDealBtnLoadingChange',
          payload: false,
        });
        yield put({
          type: 'getDealTable',
          payload: {
            par: payload.queryPar.par,
            body: payload.queryPar.body,
          },
        });
        yield put({
          type: 'getFilterDealData',
          payload: payload.par,
        });
      }
      if (response.status === 10240001) {
        message.warn('交易账号重复');
        yield put({
          type: 'changeAddStatus',
          payload: 'ocustno',
        });
        yield put({
          type: 'addDealBtnLoadingChange',
          payload: false,
        });
      }
      if (response.status === 10240002) {
        message.warn('该银行账号已经申请过交易账号');
        yield put({
          type: 'changeAddStatus',
          payload: 'clearacct',
        });
        yield put({
          type: 'addDealBtnLoadingChange',
          payload: false,
        });
      }
    },
    *investorDealDel({ payload }, { call, put }) {
      yield put({
        type: 'dealSubBtnChange',
        payload: true,
      });
      const response = yield call(dealDel, payload.body);
      if (response.status === 200) {
        message.success('操作成功');
      }
      yield put({
        type: 'dealSubBtnChange',
        payload: false,
      });
      yield put({
        type: 'getDealTable',
        payload: {
          par: payload.queryPar.par,
          body: payload.queryPar.body,
        },
      });
    },
    *getAnnexes({ payload }, { call, put }) {
      const annexesArr = payload;
      const annexes = {};
      const InvestorInfo = [];
      const ManagerInfo = [];
      const ProductInfo = [];
      const OrganizationInfo = [];
      const CorporateInfo = [];
      const QualificationInfo = [];
      annexesArr.forEach(item => {
        if (item.fileType === 'InvestorInfo') {
          InvestorInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
        if (item.fileType === 'ManagerInfo') {
          ManagerInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
        if (item.fileType === 'ProductInfo') {
          ProductInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
        if (item.fileType === 'OrganizationInfo') {
          OrganizationInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
        if (item.fileType === 'CorporateInfo') {
          CorporateInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
        if (item.fileType === 'QualificationInfo') {
          QualificationInfo.push({
            uid: item.id,
            investorId: item.investorId,
            name: item.name,
            status: 'done',
            code: item.code,
          });
        }
      });
      annexes.InvestorInfo = InvestorInfo;
      annexes.ManagerInfo = ManagerInfo;
      annexes.ProductInfo = ProductInfo;
      annexes.OrganizationInfo = OrganizationInfo;
      annexes.CorporateInfo = CorporateInfo;
      annexes.QualificationInfo = QualificationInfo;
      yield put({
        type: 'saveAnnexes',
        payload: annexes,
      });
    },
    *investorDealUndo({ payload }, { call, put }) {
      yield put({
        type: 'dealSubBtnChange',
        payload: true,
      });
      const response = yield call(dealUndo, payload.par);
      if (response.status === 200) {
        message.success('操作成功');
      }
      yield put({
        type: 'dealSubBtnChange',
        payload: false,
      });
      yield put({
        type: 'getDealTable',
        payload: {
          par: payload.queryPar.par,
          body: payload.queryPar.body,
        },
      });
    },
    *investorDealRegister({ payload }, { call, put }) {
      yield put({
        type: 'dealSubBtnChange',
        payload: true,
      });
      const response = yield call(dealRegister, payload.par);
      if (response.status === 200) {
        message.success('操作成功');
      }
      yield put({
        type: 'dealSubBtnChange',
        payload: false,
      });
      yield put({
        type: 'getDealTable',
        payload: {
          par: payload.queryPar.par,
          body: payload.queryPar.body,
        },
      });
    },
    *changeDealAddModal({ payload }, { call, put }) {
      yield put({
        type: 'dealAddBtnChange',
        payload: payload,
      });
      if (!payload) {
        yield put({
          type: 'addDealBtnLoadingChange',
          payload,
        });
      }
    },
    *getFundAccount({ payload }, { call, put }) {
      yield put({
        type: 'changeFundAccountLoading',
        payload: true,
      });
      const response = yield call(fundAccount, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderFundMessage',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeFundAccountLoading',
        payload: false,
      });
    },
    *getBalance({ payload }, { call, put }) {
      yield put({
        type: 'changeFundAccountLoading',
        payload: true,
      });
      const response = yield call(getFundBalance, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderFundBalance',
          payload: response.data[0].fundBalance,
        });
      }
      yield put({
        type: 'changeFundAccountLoading',
        payload: false,
      });
    },
    *investorMessageUpdate({ payload }, { call, put }) {
      yield put({
        type: 'change' + payload.val,
        payload: true,
      });
      const response = yield call(investorUpdate, payload.formItems);
      if (response.status === 200) {
        message.success('操作成功');
        yield put({
          type: 'getDataWithId',
          payload: {
            id: payload.formItems.id,
          },
        });
      } else {
        message.error(response.message);
        yield put({
          type: 'getDataWithId',
          payload: {
            id: payload.formItems.id,
          },
        });
      }
      yield put({
        type: 'change' + payload.val,
        payload: false,
      });
    },
    *getBankData(_, { call, put }) {
      const response = yield call(getBank);
      if (response.status === 200) {
        yield put({
          type: 'renderBankData',
          payload: response.data,
        });
      }
    },
    *applyAccount({ payload }, { call, put }) {
      yield put({
        type: 'applyAccountLoadingChange',
        payload: true,
      });
      const response = yield call(applyAccount, payload);
      if (response.status === 200) {
        message.success('已申请开立基金账户');
        yield put({
          type: 'applyAccountLoadingChange',
          payload: false,
        });
        yield put({
          type: 'changeAccountModal',
          payload: false,
        });
        yield put({
          type: 'getFundAccount',
          payload: {
            investorId: payload.investorId,
          },
        });
      } else {
        message.error('操作失败');
      }
    },
    *changeAccountModal({ payload }, { call, put }) {
      yield put({
        type: 'accountModal',
        payload: payload,
      });
    },
    *resetAccountLoading({ payload }, { call, put }) {
      yield put({
        type: 'applyAccountLoadingChange',
        payload: payload,
      });
    },
    *getFilterDealData({ payload }, { call, put }) {
      yield put({
        type: 'filterLoadingChange',
        payload: true,
      });
      const response = yield call(getFilterDealTable, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderFilterDeal',
          payload: response,
        });
      }
      if (response.data) {
        yield put({
          type: 'getFilterDealDataChange',
          payload: payload.currentPage,
        });
      }
      yield put({
        type: 'filterLoadingChange',
        payload: false,
      });
    },
    *updateAccessories({ payload }, { call, put }) {
      yield put({
        type: 'accessoriesChange',
        payload: true,
      });
      const response = yield call(updateAccessories, payload);
      if (response.status === 200) {
        message.success('操作成功');
      }
      yield put({
        type: 'accessoriesChange',
        payload: false,
      });
    },
    *getOrgData({ payload }, { call, put }) {
      const response = yield call(getOrgData, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderAgentData',
          payload: response.data,
        });
      }
    },
    *resetDealSubBtn({ payload }, { call, put }) {
      yield put({
        type: 'dealSubBtnChange',
        payload,
      });
    },
    *getOrgType({ payload }, { call, put }) {
      const response = yield call(getOrgType, payload);
      yield put({
        type: 'renderOrgType',
        payload: response,
      });
    },
    *getOperationRecord({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getOperationRecord, payload);
      if (response.status === 200) {
        yield put({
          type: 'renderOperation',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getProType(_, { call, put }) {
      const response = yield call(getProType);
      if (response.status === 200) {
        yield put({
          type: 'proTypeSave',
          payload: response.data,
        });
      }
    },
    *getProductRecordingAgency({ payload }, { call, put }) {
      const response = yield call(getProductRecordingAgency, payload);
      yield put({
        type: 'renderProductRecordingAgency',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        cardType: action.payload.data.cardType,
        cardNum: action.payload.data.cardNum,
      };
    },
    dealSave(state, action) {
      return {
        ...state,
        dealData: action.payload,
        // dealTitle: action.payload.data.rows[0].orgName===undefined?'':'--'+action.payload.data.rows[0].orgName,
      };
    },
    dealPageChange(state, action) {
      return {
        ...state,
        D_currentPage: action.payload,
      };
    },
    dealChangeLoading(state, action) {
      return {
        ...state,
        dealTableLoading: action.payload,
      };
    },
    dealSubBtnChange(state, action) {
      return {
        ...state,
        dealSubBtn: action.payload,
      };
    },
    dealAddBtnChange(state, action) {
      return {
        ...state,
        dealAddBtn: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    renderDropDownList(state, action) {
      return {
        ...state,
        dropDownList: action.payload,
      };
    },
    renderFdistributorcode(state, action) {
      return {
        ...state,
        fdistributorcode: action.payload,
      };
    },
    saveAnnexes(state, action) {
      return {
        ...state,
        annexes: action.payload,
      };
    },
    changeAddStatus(state, action) {
      return {
        ...state,
        addDealStatus: action.payload,
      };
    },
    renderFundMessage(state, action) {
      return {
        ...state,
        fundData: action.payload,
      };
    },
    changeFundAccountLoading(state, action) {
      return {
        ...state,
        fundAccountLoading: action.payload,
      };
    },
    changeUpdateLoading(state, action) {
      return {
        ...state,
        updateLoading: action.payload,
      };
    },
    changebasic(state, action) {
      return {
        ...state,
        basic: action.payload,
      };
    },
    changecommunication(state, action) {
      return {
        ...state,
        communication: action.payload,
      };
    },
    changeagent(state, action) {
      return {
        ...state,
        agent: action.payload,
      };
    },
    changeaptitude(state, action) {
      return {
        ...state,
        aptitude: action.payload,
      };
    },
    changeinstitution(state, action) {
      return {
        ...state,
        institution: action.payload,
      };
    },
    changedirector(state, action) {
      return {
        ...state,
        director: action.payload,
      };
    },
    changeproduct(state, action) {
      return {
        ...state,
        product: action.payload,
      };
    },
    changeother(state, action) {
      return {
        ...state,
        other: action.payload,
      };
    },
    renderBankData(state, action) {
      return {
        ...state,
        bankData: action.payload,
      };
    },
    applyAccountLoadingChange(state, action) {
      return {
        ...state,
        applyAccountLoading: action.payload,
      };
    },
    accountModal(state, action) {
      return {
        ...state,
        opening: action.payload,
      };
    },
    addDealBtnLoadingChange(state, action) {
      return {
        ...state,
        addDealBtnLoading: action.payload,
      };
    },
    institutionLoadingChange(state, action) {
      return {
        ...state,
        institutionLoading: action.payload,
      };
    },
    filterLoadingChange(state, action) {
      return {
        ...state,
        filterLoading: action.payload,
      };
    },
    renderFilterDeal(state, action) {
      return {
        ...state,
        filterDealData: action.payload,
      };
    },
    accessoriesChange(state, action) {
      return {
        ...state,
        accessoriesLoading: action.payload,
      };
    },
    renderAgentData(state, action) {
      return {
        ...state,
        orgData: action.payload,
      };
    },
    renderOrgType(state, action) {
      return {
        ...state,
        orgType: action.payload,
      };
    },
    renderOperation(state, action) {
      return {
        ...state,
        operatorData: action.payload,
      };
    },
    getFilterDealDataChange(state, action) {
      return {
        ...state,
        G_currentPage: action.payload,
      };
    },
    fdistributorcodePageChange(state, action) {
      return {
        ...state,
        I_currentPage: action.payload,
      };
    },
    proTypeSave(state, action) {
      return {
        ...state,
        proTypeData: action.payload,
      };
    },
    renderProductRecordingAgency(state, action) {
      return {
        ...state,
        productRecordingAgency: action.payload,
      };
    },
  },
};

export default model;

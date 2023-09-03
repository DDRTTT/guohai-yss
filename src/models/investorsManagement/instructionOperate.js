/**
 *Create on 2020/9/29.
 */
import {
  accountDetail,
  batchInstruction,
  cLassDelete,
  commandAccountType,
  commandAdd,
  commandCommit,
  commandCorrect,
  commandDraw,
  commandMould,
  commandOne,
  commandProName,
  commandSave,
  commandUpdate,
  deleteImg,
  instructionAdd,
  instructionCLass,
  instructionSave,
  mouldDetail,
  paymentCurrency,
  queryAccMoneyNum,
  tellPower,
  deleteCommand,
} from '@/services/investorsManagement/instructionOperate';
import { message } from 'antd';

let model = {
  namespace: 'instructionOperate',
  state: {
    loading: false, //加载时状态
    loading1: false, //加载时状态 点击保存并提交
    loading2: false, //加载时状态 点击保存
    loading3: false, //加载时状态 点击删除
    /***
     * 单个指令操作
     * */

    dictateOne: {
      files: [],
    }, //指令详情

    //下拉
    mouldList: [], //模板指令
    mouldData: {}, //获取ocr详情
    proNameList: [], //产品名称
    drawList: [], //划款类型

    makeList: [{ value: '' }], //收款账户类型
    payList: [{ value: '' }], //付款账户类型
    makeName: [], //收款账户名
    payNum: [], //付款账号
    payName: [], //付款账户名
    currencyList: [], //付款币种

    //收款方账户信息
    collectionTeller: {},
    //付款方账户信息
    payingTeller: {},

    //文字识别与矫正数据存储
    correctData: {
      imgUrl: null, //图片地址
      fileId: null,
      data: [],
    },

    //控制模态框的显示与隐藏
    visible: false,

    bankStore: {
      bank: null,
    }, //收款银行数据存储
    bankStore2: {
      bank: null,
    }, //付款银行数据存储

    /***
     * 批量新增
     * */
    orderList: {
      data: {
        rows: [],
        total: 0,
      },
    }, //批量指令列表
    orderClass: {
      data: [],
    }, //批量指令分类

    classSelect: null, //分类选中存储
    currentPage: 1,

    //参数
    isUpload: true, //是否停留在上传页面上
    commitNum: null, //批量上传批次码
    retData: null,
  },

  effects: {
    /***
     * 单个指令操作
     * */
    //保存或保存并提交  修改
    *addOrSave({ payload }, { call, put }) {
      yield put({
        type: payload.type == 'add' ? 'changeLoading1' : 'changeLoading2',
        payload: true,
      });
      let result = null;
      //保存并提交？流程接口:（新增？新增接口:修改接口）
      let link =
        payload.type == 'add'
          ? commandAdd
          : payload.orderType == 'add'
          ? commandSave
          : commandUpdate;
      let response = yield call(link, payload.payload);
      if (response.status == 200) {
        if (payload.list.length > 0) {
          let list = [];
          payload.list.map(index => {
            list.push({
              tId: response.data,
              fileNumber: index.fileNumber,
              fileName: index.fileName,
            });
          });
          let res = yield call(commandCommit, list);
          if (res.response.status == 200) {
            message.success(payload.type == 'add' ? '提交成功' : '保存成功');
            result = true;
            //清空数据项
            yield put({
              type: 'dictateOne',
              payload: {
                files: [],
              },
            });
            yield put({
              type: 'collectionTeller',
              payload: {},
            });
            yield put({
              type: 'payingTeller',
              payload: {},
            });
            yield put({
              type: 'correctData',
              payload: {
                imgUrl: null, //图片地址
                fileId: null,
                data: [],
              },
            });
          } else {
            message.error(res.response.message);
          }
        } else {
          message.success(payload.type == 'add' ? '提交成功' : '保存成功');
          result = true;
          //清空数据项
          yield put({
            type: 'dictateOne',
            payload: {
              files: [],
            },
          });
          yield put({
            type: 'collectionTeller',
            payload: {},
          });
          yield put({
            type: 'payingTeller',
            payload: {},
          });
          yield put({
            type: 'correctData',
            payload: {
              imgUrl: null, //图片地址
              fileId: null,
              data: [],
            },
          });
        }
      } else {
        message.error(response.message);
      }

      yield put({
        type: payload.type == 'add' ? 'changeLoading1' : 'changeLoading2',
        payload: false,
      });
      return result;
    },

    //获取指令详情
    *orderOne({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(commandOne, payload);
      let data = response.data;
      let balance = 0;

      //查询账户余额
      if (data.payerAcctNumber) {
        let storeData = yield call(queryAccMoneyNum, data.payerAcctNumber);

        balance = storeData.response.data.balance;
      }
      data.amountBalance = balance;

      //查询一条详细数据
      yield put({
        type: 'dictateOne',
        payload: data,
      });

      //收款信息
      let makedata = {
        accName: data.payeeAcctName, //收款户名
        accNumber: data.payeeAcctNumber, //收款账号
        accBank: data.payeeOrgName, //收款开户行
        accLargepayNumber: data.payeeLargePaymentNo, //收款大额支付号
      };
      yield put({
        type: 'collectionTeller',
        payload: makedata,
      });

      //付款信息
      let paydata = {
        accProCode: data.productId, //产品代码&产品名称
        accName: data.payerAcctName, //付款户名
        accNumber: data.payerAcctNumber, //付款账号
        accBank: data.payerOrgName, //付款开户行
        accLargepayNumber: data.payerLargePaymentNo, //付款大额支付号
        amountBalance: balance,
      };
      yield put({
        type: 'payingTeller',
        payload: paydata,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    //下拉方法
    *SelectList({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let link = '';
      let list = '';
      if (payload.type == 'mould') {
        //指令模板
        link = commandMould;
        list = 'mouldList';
      } else if (payload.type == 'name') {
        //产品名称
        link = commandProName;
        list = 'proNameList';
      } else if (payload.type == 'draw') {
        //划款类型
        link = commandDraw;
        list = 'drawList';
      } else if (payload.type == 'makeOrPay') {
        //收款，付款账户类型
        link = commandAccountType;
        list = payload.payload.accountType == 'make' ? 'makeList' : 'payList';
      } else if (payload.type == 'payNum') {
        //付款账号
        link = accountDetail;
        list = 'payNum';
        //付款户名
      } else if (payload.type == 'payName') {
        link = accountDetail;
        list = 'payName';
        //收款账户名
      } else if (payload.type == 'makeName') {
        link = accountDetail;
        list = 'makeName';
      } else if (payload.type == 'add') {
        //点击ENTER 添加收款户名
        let makeNameData = yield select(state => state.instructionOperate.makeName);
        let arr = dataAdd(makeNameData, payload.payload);
        yield put({
          type: 'makeName',
          payload: arr,
        });
        return arr;
      } else {
        //付款币种
        link = paymentCurrency;
        list = 'currencyList';
      }

      let response = yield call(link, payload.payload);
      yield put({
        type: list,
        payload: payload.type == 'currency' ? response : response.data,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },

    //付款收款账户类型
    *SelectList2({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let link = '';
      let list = '';

      //收款，付款账户类型
      link = commandAccountType;
      list = payload.payload.accountType == 'make' ? 'makeList' : 'payList';

      let response = yield call(link, payload.payload);
      yield put({
        type: list,
        payload: response.data,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },

    //初始下拉接口（收款名称、付款名称下拉，付款账户下拉）
    *typeSelect({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let makeData = yield select(state => state.instructionOperate.makeList);
      let payData = yield select(state => state.instructionOperate.payList);

      //初始下拉
      let payParam = {
        accType: 'make',
        transferType: makeData[0].value,
      };
      let response = yield call(accountDetail, payParam);
      yield put({
        type: 'makeName', //收款名称下拉
        payload: response.data.total == 0 ? [] : response.data.rows,
      });

      let payParam2 = {
        accType: 'pay',
        transferType: payData[0].value,
      };
      let data = yield call(accountDetail, payParam2);
      yield put({
        type: 'payName', //付款名称下拉
        payload: data.response.data.total == 0 ? [] : data.response.data.rows,
      });
      yield put({
        type: 'payNum', //付款账户下拉
        payload: data.response.data.total == 0 ? [] : data.response.data.rows,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },

    *getAccount({ payload }, { call, put, select }) {
      //如果参数为clear 收款账户信息与付款账户信息清空
      if (payload.type == 'clear') {
        yield put({
          type: 'payingTeller',
          payload: {},
        });
        yield put({
          type: 'collectionTeller',
          payload: {},
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: true,
        });

        let response = yield call(accountDetail, payload.payload);

        //是否调用付款余额
        let balance = 0; //账户余额
        let storeData = {};

        //如果付款账户存在
        if (payload.payload.accountNum && payload.payload.accountNum != '') {
          storeData = yield call(queryAccMoneyNum, payload.payload.accountNum);
          balance = storeData.response.data.balance;
        } else {
          //如果在选择产品代码||付款账户类型||付款账号||付款名称 时候返回了 付款账户
          if (
            (payload.type == 'id' || payload.type == 'payChange') &&
            (response.data.total != 0 ? response.data.rows[0].accNumber : false)
          ) {
            storeData = yield call(queryAccMoneyNum, response.data.rows[0].accNumber);
            balance = storeData.response.data.balance;
          }
        }

        //产品代码||付款账户信息
        if (payload.type == 'id' || payload.type == 'payChange') {
          let data = response.data.total == 0 ? {} : response.data.rows[0];
          data.amountBalance = balance;
          //付款信息
          yield put({
            type: 'payingTeller',
            payload: data,
          });
          //收款账户信息
        } else if (payload.type == 'makeChange') {
          let data2 = response.data.total == 0 ? {} : response.data.rows[0];
          yield put({
            type: 'collectionTeller',
            payload: data2,
          });
        }

        yield put({
          type: 'changeLoading',
          payload: false,
        });

        return response;
      }
    },

    //收款付款详情
    *templateDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let balance = 0;

      let response = yield call(mouldDetail, payload);

      if (response.data[0].fpayerAcctNumber) {
        let storeData = yield call(queryAccMoneyNum, response.data[0].fpayerAcctNumber);
        balance = storeData.response.data.balance;
      }

      //收款信息
      let makedata = {
        accName: response.data[0].fpayeeAcctName ? response.data[0].fpayeeAcctName : '', //收款户名
        accNumber: response.data[0].fpayeeAcctNumber ? response.data[0].fpayeeAcctNumber : '', //收款账号
        accBank: response.data[0].fpayeeOrgName ? response.data[0].fpayeeOrgName : '', //收款开户行
        accLargepayNumber: response.data[0].fpayeeLargePaymentno
          ? response.data[0].fpayeeLargePaymentno
          : '', //收款大额支付号
      };
      yield put({
        type: 'collectionTeller',
        payload: makedata,
      });

      //付款信息
      let paydata = {
        accName: response.data[0].fpayerAcctName ? response.data[0].fpayerAcctName : '', //收款户名
        accNumber: response.data[0].fpayerAcctNumber ? response.data[0].fpayerAcctNumber : '', //收款账号
        accBank: response.data[0].fpayerOrgName ? response.data[0].fpayerOrgName : '', //收款开户行
        accLargepayNumber: response.data[0].fpayerLargePaymentno
          ? response.data[0].fpayerLargePaymentno
          : '', //收款大额支付号
        amountBalance: balance,
      };
      yield put({
        type: 'payingTeller',
        payload: paydata,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    //获取文字识别与矫正接口
    *correct({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield put({
        type: 'retData',
        payload: payload.fileId,
      });

      //清空ocr
      if (payload.type == 'clear') {
        yield put({
          type: 'correctData',
          payload: {
            data: [],
            imgUrl: null,
            fileId: null,
          },
        });
        yield put({
          type: 'dictateOne',
          payload: {
            files: [],
          },
        });
        yield put({
          type: 'collectionTeller',
          payload: {},
        });
        yield put({
          type: 'payingTeller',
          payload: {},
        });

        return 200;
      } else {
        let response = yield call(commandCorrect, payload);
        response.imgUrl =
          '../img/amsTransferServer/ocr/' + payload.fileId + '/' + payload.fileId + '.jpg';
        yield put({
          type: 'correctData',
          payload: response,
        });

        let arr = {};
        response.data.map((index, i) => {
          arr[index.key] = index.value;
        });
        arr.files = [];

        let balance = 0;
        if (arr.payerAcctNumber) {
          let storeData = yield call(queryAccMoneyNum, arr.payerAcctNumber);
          balance = storeData.response.data.balance;
        }

        arr.amountBalance = balance;

        //存储一条数据
        yield put({
          type: 'dictateOne',
          payload: arr,
        });

        //收款信息
        let makedata = {
          accName: arr.payeeAcctName ? arr.payeeAcctName : '', //收款户名
          accNumber: arr.payeeAcctNumber ? arr.payeeAcctNumber : '', //收款账号
          accBank: arr.payeeOrgName ? arr.payeeOrgName : '', //收款开户行
          accLargepayNumber: arr.payeeLargePaymentNo ? arr.payeeLargePaymentNo : '', //收款大额支付号
        };
        yield put({
          type: 'collectionTeller',
          payload: makedata,
        });

        //付款信息
        let paydata = {
          accProCode: arr.productCode ? arr.productCode : '', //产品名称
          accId: arr.productId ? arr.productId : '', //产品编码
          accName: arr.payerAcctName ? arr.payerAcctName : '', //收款户名
          accNumber: arr.payerAcctNumber ? arr.payerAcctNumber : '', //收款账号
          accBank: arr.payerOrgName ? arr.payerOrgName : '', //收款开户行
          accLargepayNumber: arr.payerLargePaymentNo ? arr.payerLargePaymentNo : '', //收款大额支付号
          amountBalance: balance,
        };
        yield put({
          type: 'payingTeller',
          payload: paydata,
        });

        yield put({
          type: 'changeLoading',
          payload: false,
        });

        return response;
      }
    },

    /***
     * 批量指令操作
     * */
    //批量新增数据查询
    *batchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(batchInstruction, payload);

      yield put({
        type: 'classSelect',
        payload: payload.parentCode,
      });

      yield put({
        type: 'orderList',
        payload: response,
      });

      yield put({
        type: 'currentPage',
        payload: payload.currentPage,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    //存储数据
    *memory({ payload }, { call, put }) {
      yield put({
        type: 'orderList',
        payload: {
          data: {
            rows: payload.list,
            total: payload.list.length,
          },
        },
      });
    },

    //批量新增分类
    *getBatchData({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(instructionCLass, payload);

      yield put({
        type: 'orderClass',
        payload: response,
      });
      if (response.data.length > 0) {
        let data = response.data;
        let batchList = yield call(batchInstruction, {
          currentPage: 1,
          pageSize: payload.pageSize,
          parentCode: data[0].value,
          commitNum: payload.commitNum,
        });
        // 存储选中参数id
        yield put({
          type: 'classSelect',
          payload: data[0].value,
        });
        yield put({
          type: 'orderList',
          payload: batchList.response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    //删除标签
    *delectTag({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(cLassDelete, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    //批量新增保存提交
    *batchSave({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading1',
        payload: true,
      });

      if (payload.submitCommitNum) {
        //提交
        let response = yield call(instructionAdd, payload);
        yield put({
          type: 'changeLoading1',
          payload: false,
        });
        yield put({
          type: 'changeLoading1',
          payload: false,
        });
        return response;
      } else {
        if (payload.length != 0) {
          //保存
          let response = yield call(instructionSave, payload);
          yield put({
            type: 'correctData',
            payload: response,
          });
          yield put({
            type: 'changeLoading1',
            payload: false,
          });
          return response;
        } else {
          //修改数据为空
          yield put({
            type: 'changeLoading1',
            payload: false,
          });

          return { status: 22222222, message: '请修改一条数据！' };
        }
      }
    },

    //是否停留在上传页面上
    *isUploadPage({ payload }, { call, put }) {
      yield put({
        type: 'isUpload',
        payload: !payload.isupload,
      });
      yield put({
        type: 'commitNum',
        payload: payload.commitNum,
      });
    },

    //批量指令删除
    *batchDelete({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading3',
        payload: true,
      });

      let response = yield call(deleteCommand, payload.ids);

      yield put({
        type: 'changeLoading3',
        payload: true,
      });

      return response;
    },

    //删除上传文件
    *DeleteFile({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(deleteImg, payload);

      yield put({
        type: 'changeLoading',
        payload: false,
      });

      return response;
    },

    //控制ocr模态框的显示与隐藏
    *visibleFun({ payload }, { call, put }) {
      yield put({
        type: 'visible',
        payload: !payload,
      });
    },

    //判断该用户是否有ocr识别产品的权限
    *proPower({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      let response = yield call(tellPower, payload);

      if (response.status !== 200) {
        message.error(response.message);
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    //加载时状态
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeLoading1(state, action) {
      return {
        ...state,
        loading1: action.payload,
      };
    },
    changeLoading2(state, action) {
      return {
        ...state,
        loading2: action.payload,
      };
    },
    changeLoading3(state, action) {
      return {
        ...state,
        loading3: action.payload,
      };
    },
    //指令详情
    dictateOne(state, action) {
      return {
        ...state,
        dictateOne: action.payload,
      };
    },
    //批量新增表格页码
    currentPage(state, action) {
      return {
        ...state,
        currentPage: action.payload,
      };
    },
    //文字识别与矫正
    correctData(state, action) {
      return {
        ...state,
        correctData: action.payload,
      };
    },
    //控制模态框的显示与隐藏
    visible(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
    //批量新增指令列表
    orderList(state, action) {
      return {
        ...state,
        orderList: action.payload,
      };
    },
    //批量新增指令分类
    orderClass(state, action) {
      return {
        ...state,
        orderClass: action.payload,
      };
    },

    //分类选中存储
    classSelect(state, action) {
      return {
        ...state,
        classSelect: action.payload,
      };
    },

    //收款银行数据存储
    bankStore(state, action) {
      return {
        ...state,
        bankStore: action.payload,
      };
    },

    //付款银行数据存储
    bankStore2(state, action) {
      return {
        ...state,
        bankStore2: action.payload,
      };
    },

    //收款账户信息
    collectionTeller(state, action) {
      return {
        ...state,
        collectionTeller: action.payload,
      };
    },

    //付款账户信息
    payingTeller(state, action) {
      return {
        ...state,
        payingTeller: action.payload,
      };
    },

    /***
     * 下拉
     */
    //指令模板
    mouldList(state, action) {
      return {
        ...state,
        mouldList: action.payload,
      };
    },
    //ocr详情
    mouldData(state, action) {
      return {
        ...state,
        mouldData: action.payload,
      };
    },

    //产品名称
    proNameList(state, action) {
      return {
        ...state,
        proNameList: action.payload,
      };
    },
    //划款类型
    drawList(state, action) {
      return {
        ...state,
        drawList: action.payload,
      };
    },
    //收款账户类型
    makeList(state, action) {
      return {
        ...state,
        makeList: action.payload,
      };
    },
    //付款账户类型
    payList(state, action) {
      return {
        ...state,
        payList: action.payload,
      };
    },
    //收款账户名
    makeName(state, action) {
      return {
        ...state,
        makeName: action.payload,
      };
    },
    //付款账号
    payNum(state, action) {
      return {
        ...state,
        payNum: action.payload,
      };
    },
    //付款户名
    payName(state, action) {
      return {
        ...state,
        payName: action.payload,
      };
    },
    //付款币种
    currencyList(state, action) {
      return {
        ...state,
        currencyList: action.payload,
      };
    },

    //是否停留在上传页面上
    isUpload(state, action) {
      return {
        ...state,
        isUpload: action.payload,
      };
    },

    commitNum(state, action) {
      return {
        ...state,
        commitNum: action.payload,
      };
    },

    //上传接口返回参数
    retData(state, action) {
      return {
        ...state,
        retData: action.payload,
      };
    },
  },
};

//判断用户输入的收款户名是否存在，不存在就添加进数组
function dataAdd(oldList, e) {
  let list2 = oldList;
  let obj = {
    accName: e,
    accBank: e,
    accLargepayNumber: e,
    accNumber: e,
    accOrgId: e,
    accOrgName: e,
    accProCode: e,
    accType: e,
    accTypeName: e,
  };
  let param = true;

  oldList.map(index => {
    if (index.accName == e) {
      param = false;
    }
  });

  if (param) {
    list2[oldList.length] = obj;
  }
  return list2;
}

export default model;

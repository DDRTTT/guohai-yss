// 划款指令/orderManagement/repaymentInstructions
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Form, Upload, Icon, Spin, Radio, Input } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import MoreOperation from '@/components/moreOperation';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';
import moment from 'moment';
import { moneyRender } from '@/pages/productBillboard/baseFunc';
import { getAuthToken } from '@/utils/session';
import request from '@/utils/request';

const { confirm } = Modal;
const { TextArea } = Input;

const Index = ({
  dispatch,
  listLoading,
  checksLoading,
  repaymentInstructions: {
    dicts,
    proNameAndCodeData,
    riseOverTableData,
  },
  publicTas,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const [spinLoading, setSpinLoading] = useState(false);
  const dataObj = useRef({}); // 请求参数
  const totalData = useRef(0); // 页码总数
  const pageNumData = useRef(1); // 当前页面页数
  const pageSizeData = useRef(10); // 当前页面展示数量
  const taskTypeCodeData = useRef(publicTas); // 选项卡key值

  const proNameData = useRef(''); // 产品名称
  const ordStatus = useRef(''); // 指令状态
  const ordDateStart = useRef(''); // 指令开始日期
  const ordDateEnd = useRef(''); // 指令结束日期
  const directionData = useRef(''); // 排序方式
  const fieldData = useRef(''); // 排序依据
  const keyWordsData = useRef(''); // 模糊搜索关键字
  const payAccName = useRef(''); // 付款人
  const payAccNo = useRef(''); // 付款账号
  const payAccBank = useRef(''); // 付款行
  const receiveAccName = useRef(''); // 收款人
  const receiveAccNo = useRef(''); // 收款账号
  const receiveAccBank = useRef(''); // 收款行
  const ordId = useRef(''); // 指令id
  const ordSource = useRef(''); // 来源
  const payType = useRef(''); // 款项类型

  const formdata = useRef([]); // 流程数据集合
  const repeatFiles = useRef([]); // 重复文件集合
  const files = useRef([]); // 流程文件集合
  const [fileNums, setFileNums] = useState([]); // 文件流水号集合
  const [fileList, setFileList] = useState([]); // 上传文件集合
  const [modalShow, setModalShow] = useState(false);

  const [batchData, setDatchData] = useState([]); // 批量操作参数
  const [batchObj, setBatchObj] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 导入PDF时参数
  const [modalPDFShow, setModalPDFShow] = useState(false); // 是否显示 导入PDF文件 弹框
  const [pdfFileList, setPdfFileList] = useState([]); // 上传的PDF文件集合
  const [pdfLoading, setPdfLoading] = useState(false); // 上传PDF文件弹框确定按钮loading状态

  // 导入PDF时参数
  const [modalRecallShow, setModalRecallShow] = useState(false); // 撤回意见 弹框
  const [recallOrdId, setOrdId] = useState(''); // 撤回时，当前行数据
  const [recallLoadingLoading, setRecallLoadingLoading] = useState(false); // 撤回意见弹框确定按钮loading状态

  const payTypeList = useRef([]);
  payTypeList.current = [
    ...(dicts.expensePaymentType || []),
    ...(dicts.transferOrdPayType || []),
    ...(dicts.nonFixNoOutTransOrderPaymentType || []),
    ...(dicts.nonFixOutTransOrderPaymentType || []),
  ];

  const [columns, setColumns] = useState(
    // 表头数据
    [
      {
        title: '产品全称',
        dataIndex: 'proName',
        ...tableRowConfig,
        width: 400,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        ...tableRowConfig,
      },
      {
        title: '款项类型',
        dataIndex: 'payType',
        ...tableRowConfig,
      },
      {
        title: '指令金额',
        dataIndex: 'ordMoney',
        sorter: true,
        align: 'left',
        width: 200,
        ...moneyRender,
      },
      {
        title: '来源',
        dataIndex: 'ordSource',
        ...tableRowConfig,
      },
      {
        title: '指令ID',
        dataIndex: 'ordId',
        ...tableRowConfig,
      },
      {
        title: '指令状态',
        dataIndex: 'ordStatus',
        ...tableRowConfig,
      },
      {
        title: '成交编号',
        dataIndex: 'constractNo',
        ...tableRowConfig,
      },
      {
        title: '收款人',
        dataIndex: 'receiveAccName',
        ...tableRowConfig,
      },
      {
        title: '收款账号',
        dataIndex: 'receiveAccNo',
        ...tableRowConfig,
      },
      {
        title: '收款行',
        dataIndex: 'receiveAccBank',
        ...tableRowConfig,
      },
      {
        title: '付款人',
        dataIndex: 'payAccName',
        ...tableRowConfig,
      },
      {
        title: '付款账号',
        dataIndex: 'payAccNo',
        ...tableRowConfig,
      },
      {
        title: '付款行',
        dataIndex: 'payAccBank',
        ...tableRowConfig,
      },
      {
        title: '划款用途',
        dataIndex: 'usage',
        ...tableRowConfig,
      },
      {
        title: '指令日期',
        dataIndex: 'ordDate',
        ...tableRowConfig,
      },
      {
        title: '合同编号',
        dataIndex: 'contractNo',
        ...tableRowConfig,
      },
      {
        title: '席位编号',
        dataIndex: 'seatCode',
        ...tableRowConfig,
      },
      {
        title: '席位佣金',
        dataIndex: 'seatCommission',
        sorter: true,
        align: 'left',
        width: 200,
        ...moneyRender,
      },
      {
        title: '佣金用途',
        dataIndex: 'commissionUsage',
        ...tableRowConfig,
      },
      {
        title: '证券公司编码',
        dataIndex: 'securityCompanyCode',
        ...tableRowConfig,
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        ...tableRowConfig,
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'operStatus',
        ...tableRowConfig,
      },
      {
        title: '操作',
        dataIndex: '操作',
        fixed: 'right',
        render: (_, record) => {
          switch (taskTypeCodeData.current) {
            case 'T001_1':
              switch (record.operStatus) {
                case '流程中':
                  return (
                    <div>
                      {handleAddButtonCheck(record)}
                      {handleAddButtonTransferHistory(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      <span style={{ paddingLeft: '-5px' }}>
                        <MoreOperation record={record} fn={handleGetListData} />
                      </span>
                    </div>
                  );
                case '撤回':
                  return (
                    <div>
                      {handleAddButtonCheck(record)}
                      {handleAddButtonTransferHistory(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      <span style={{ paddingLeft: '-5px' }}>
                        <MoreOperation record={record} fn={handleGetListData} />
                      </span>
                    </div>
                  );
                default:
                  '';
              }
            case 'T001_3':
              switch (record.operStatus) {
                case '流程中':
                  return (
                    <div>
                      {handleAddButtonDetails(record, 'ordId')}
                      {handleAddButtonTransferHistory(record)}
                      {handleAddButtonRecall(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      {handleAddResetCommit(record)}
                    </div>
                  );
                case '撤回':
                  return (
                    <div>
                      {handleAddButtonDetails(record, 'ordId')}
                      {handleAddButtonTransferHistory(record)}
                      {handleAddButtonRecall(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      {handleAddResetCommit(record)}
                    </div>
                  );
                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            case 'T001_5':
              switch (record.operStatus) {
                case '流程中':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      {handleAddResetCommit(record)}
                    </div>
                  );
                case '撤回':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                      {handleShowRevoke(record) ? handleAddRevoke(record) : ''}
                      {handleAddResetCommit(record)}
                    </div>
                  );
                case '已结束':
                  return (
                    <div>
                      {handleAddButtonDetails(record)}
                      {handleAddButtonTransferHistory(record)}
                    </div>
                  );
                default:
                  return '';
              }
            default:
              return '';
          }
        },
      },
    ],
  );

  // 处理分页以后的数据
  useEffect(() => {
    if (JSON.stringify(batchObj) !== '{}') {
      let tempList = [];
      for (const key in batchObj) {
        if (batchObj.hasOwnProperty(key)) {
          const element = batchObj[key];
          tempList = tempList.concat(element);
        }
      }
      setDatchData(tempList);
    }
  }, [batchObj]);

  // 交互:监听批量上传的文件流水号集合
  useEffect(() => {
    if (+fileNums !== 0 && +fileList.length !== 0 && fileNums.length === fileList.length) {
      const date = new Date();
      const arr = [];
      let files = {};
      fileNums.forEach(item => {
        files[item.name] = {
          fileName: item.name,
          fileType: 'TransferContractNote',
          fileForm: item.type,
          fileSource: '本地上传',
          fileVersion: 'V1',
          status: '0',
          fileSerialNumber: item.id,
          createTimeStr: date.Format('yyyy-MM-dd hh:mm:ss'),
          flag: 'upload',
          id: '',
          productCode: '',
          procinsId: '',
          processId: '',
          busId: '',
          isLetterDocument: 0,
          userInfoId: JSON.parse(sessionStorage.getItem('USER_INFO')).id,
          userId: JSON.parse(sessionStorage.getItem('USER_INFO')).id,
          processInstanceId: '',
          taskId: '',
          archivesClassification: 'otherArchives',
          documentType: 'TransferContractNote',
        };
      });
      formdata.current.forEach(item => {
        arr.push({
          ordId: item.C_IDEN,
          files: item.C_DVP_CONSTRACTNO,
          businessArchives: [],
        });
      });
      arr.map(item => {
        item.files.split(',').forEach(element => {
          if (files[element]) item.businessArchives.push(files[element]);
        });
      });
      arr.map((item, index) => {
        +item.businessArchives === 0 ? arr.splice(index, 1) : '';
      });
      dispatch({
        type: 'repaymentInstructions/handleGetUploadsFunc',
        payload: arr,
        callback: () => {
          handleCloseAll();
          handleGetListData();
        },
      });
    }
  }, [fileNums]);

  useEffect(() => {
    handleGetDataObj(); // 更新请求参数
    handleGetSelectOptions(); // 请求:获取展开搜索下拉列表
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetInvestmentManager(); // 请求:获取投资经理下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  /**
   * 更新请求参数
   * @method  handleGetDataObj
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      taskTypeCode: taskTypeCodeData.current,
      keyWords: keyWordsData.current,
      ordStatus: ordStatus.current,
      ordDateStart: ordDateStart.current,
      ordDateEnd: ordDateEnd.current,
      proName: proNameData.current,
      payAccName: payAccName.current,
      payAccNo: payAccNo.current,
      payAccBank: payAccBank.current,
      receiveAccName: receiveAccName.current,
      receiveAccNo: receiveAccNo.current,
      receiveAccBank: receiveAccBank.current,
      ordId: ordId.current,
      ordSource: ordSource.current,
      direction: directionData.current,
      field: fieldData.current,
      payType: payType.current,
    };
  };

  // 获取表格数据
  const handleGetListData = () => {
    handleGetDataObj();
    dispatch({
      type: 'repaymentInstructions/fetch',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };

  // 请求:字典数据
  const handleGetSelectOptions = () => {
    dispatch({
      type: 'repaymentInstructions/getDicts',
      payload: {
        codeList: [
          'A002',
          'transferOrdStatus',
          'transferOrdSource',
          'expensePaymentType',
          'transferOrdPayType',
          'pdfPaymentType',
          'nonFixNoOutTransOrderPaymentType',
          'nonFixOutTransOrderPaymentType',
        ],
      },
    });
  };

  // 请求:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'repaymentInstructions/getProNameAndCodeFunc',
      payload: { isAccountCancel: '1' }, // 剔除销户的账户和托管户销户的产品(资金运用部分优化)
    });
  };

  // 请求:获取投资经理下拉列表
  const handleGetInvestmentManager = () => {
    dispatch({
      type: 'repaymentInstructions/getInvestmentManagerFunc',
    });
  };

  const formatDate = date => {
    return moment(date).format('YYYY-MM-DD');
  };

  /**
   * 精确查询数据取值
   * @method  handleExactSerach
   */
  const handlerSearch = fieldsValue => {
    const values = fieldsValue || {};
    pageNumData.current = 1;
    pageSizeData.current = 10;
    proNameData.current = values.proName?.toString() || '';
    ordStatus.current = values.ordStatus?.toString() || '';
    ordDateStart.current =
      values?.ordDate && +values.ordDate !== 0 ? formatDate(values?.ordDate[0]._d) : '';
    ordDateEnd.current =
      values?.ordDate && +values.ordDate !== 0 ? formatDate(values?.ordDate[1]._d) : '';
    directionData.current = values.direction;
    payAccName.current = values.payAccName;
    payAccNo.current = values.payAccNo;
    payAccBank.current = values.payAccBank;
    receiveAccName.current = values.receiveAccName;
    receiveAccNo.current = values.receiveAccNo;
    receiveAccBank.current = values.receiveAccBank;
    ordId.current = values.ordId;
    ordSource.current = values.ordSource?.toString() || '';
    payType.current = values.payType?.toString() || '';
    handleGetDataObj();
    handleGetListData();
  };

  // 重置
  const handleReset = () => {
    pageNumData.current = 1;
    pageSizeData.current = 10;
    proNameData.current = '';
    ordStatus.current = '';
    ordDateStart.current = '';
    ordDateEnd.current = '';
    directionData.current = '';
    fieldData.current = '';
    keyWordsData.current = '';
    payAccName.current = '';
    payAccNo.current = '';
    payAccBank.current = '';
    receiveAccName.current = '';
    receiveAccNo.current = '';
    receiveAccBank.current = '';
    ordId.current = '';
    ordSource.current = '';
    payType.current = '';
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 搜索框值
   * @method  blurSearch
   * @param   {key}         搜索框值
   */
  const blurSearch = key => {
    keyWordsData.current = key;
    handleGetListData();
  };

  /**
   * 页码属性变更
   * @param   {pageSize}     string    表格行数据
   * @return  {string}
   */
  const handleUpdataPageSize = (current, pageSize) => {
    pageSizeData.current = pageSize;
    pageNumData.current = 1;
    handleGetDataObj();
  };

  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
  };

  // 页码属性设置
  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPageSize,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  // 详情
  const handleCanDetails = (record, type) => {
    const ordIdStr = type && record.returnStatus !== '3' ? '1' : '';
    // recall：添加撤回标识，在我发起详情页面判断是否需要撤回
    const url = `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}&ordId=${record.ordId}&recall=${ordIdStr}`;
    router.push(url);
  };

  // 交互:跳转(重新提交)
  const handleCanResetCommit = record => {
    const url = `/dynamicPage/pages/划款指令/8aaa820d81f54e0e0181faf854ae0000/重新提交?taskId=${record.taskId}&returnStatus=1&returnLogId=${record.returnLogId}`;
    router.push(url);
  };

  // 交互:撤回，跳转(重新提交)
  const handleRecallCanResetCommit = record => {
    const url = `/dynamicPage/pages/划款指令/8aaa82c5812554e5018258da8cc6000b/重新提交?taskId=${record.taskId}&returnStatus=1&returnLogId=${record.returnLogId}`;
    router.push(url);
  };

  /**
   * 去流程引擎的办理页面需要的参数
   * @method handleCanCheck
   * @params taskId 任务id
   * @params processDefinitionId 流程定义id
   * @params processInstanceId 流程实例id
   * @params taskDefinitionKey 任务定义key
   */
  const handleCanCheckPage = record => {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      id: record.id,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.id,
      proCode: record.proCode,
    };
    dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  };

  // 点击办理时，跳转
  const handleCanCheck = record => {
    // returnStatus 为 3，表示当前交易指令处于撤回流程中，需要跳转至详情页面
    if (record && record.returnStatus === '3') {
      handleRecallCanResetCommit(record);
    } else {
      handleCanCheckPage(record);
    }
  };
  // 撤销
  const handleCanRevoke = record => {
    confirm({
      title: '请确认是否撤销?',
      onOk() {
        dispatch({
          type: 'repaymentInstructions/getRevokeFunc',
          payload: {
            ordId: record.ordId,
            status: '109',
            remark: '',
          },
          callback: () => {
            handleGetListData();
          },
        });
      },
      onCancel() { },
    });
  };

  /**
   * 创建按钮-办理
   */
  const handleAddButtonCheck = record => {
    return (
      <Action code="repaymentInstructions:check">
        <Button type="link" onClick={() => handleCanCheck(record)} style={{ width: '45px' }}>
          办理
        </Button>
      </Action>
    );
  };

  // 撤销
  const handleAddRevoke = record => {
    return (
      <Action code="repaymentInstructions:revoke">
        <Button type="link" onClick={() => handleCanRevoke(record)} style={{ width: '45px' }}>
          撤销
        </Button>
      </Action>
    );
  };

  // 交互:按钮展示逻辑
  const handleShowRevoke = record => {
    let boo = false;
    if (record.ordDate) {
      const myDate = new Date();
      const date =
        myDate.getFullYear() +
        '-' +
        ((myDate.getMonth() + 1).toString().length === 1
          ? '0' + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1) +
        '-' +
        (myDate.getDate().toString().length === 1 ? '0' + myDate.getDate() : myDate.getDate());
      boo =
        record.ordDate.indexOf(date) !== -1 &&
          record.revoke == '1' &&
          record.operStatusCode !== 'S001_3' &&
          record.ordStatus !== '待划款' &&
          record.ordStatus !== '已划款' &&
          record.ordStatus !== '划款失败' &&
          record.ordStatus !== '已作废'
          ? true
          : false;
    }
    return boo;
  };

  /**
   * 创建按钮-流转历史
   */
  const handleAddButtonTransferHistory = record => {
    return (
      <Action code="repaymentInstructions:transferHistory">
        <Button
          type="link"
          onClick={() => handleShowTransferHistory(record)}
          style={{ width: '75px' }}
        >
          流转历史
        </Button>
      </Action>
    );
  };

  // 显示撤回意见弹框
  const handleShowButtonRecall = record => {
    setModalRecallShow(true);
    setOrdId(record.ordId);
  };

  // 关闭撤回弹框
  const handleRecallModalClose = () => {
    resetFields();
    setModalRecallShow(false);
    setOrdId('');
    setRecallLoadingLoading(false);
  };

  // 调用撤回意见接口
  const handleRecallModalSubmit = () => {
    validateFields(['recallVal'], (err, values) => {
      if (!err) {
        setRecallLoadingLoading(true);
        dispatch({
          type: 'repaymentInstructions/handleWithdraw',
          payload: { C_IDEN: recallOrdId, OPINIONS: values.recallVal },
          callback: data => {
            if (data && (data.existWithdrawApply || data.completeTransferApprove === '1')) {
              if (data.existWithdrawApply) {
                message.warning('该条指令已发起撤回申请，不可以再次撤回');
              } else {
                message.warning('该条指令已到达支付系统，不可以撤回');
              } 
            } else {
              message.success('撤回成功');
              setModalRecallShow(false);
              handleGetListData();
            }

            
          },
        }).finally(() => {
          setRecallLoadingLoading(false);
        });
      }
    });
  };

  // 撤回
  const handleAddButtonRecall = record => {
    return (
      <Action code="repaymentInstructions:recall">
        <Button
          disabled={record.returnStatus === '3'}
          type="link"
          onClick={() => handleShowButtonRecall(record)}
          style={{ width: '45px' }}
        >
          撤回
        </Button>
      </Action>
    );
  };

  /**
   * 创建按钮-详情
   */
  const handleAddButtonDetails = (record, orgId) => {
    return (
      <Action code="repaymentInstructions:details">
        <Button
          type="link"
          onClick={() => handleCanDetails(record, orgId)}
          style={{ width: '45px' }}
        >
          详情
        </Button>
      </Action>
    );
  };

  /**
   * 元素:按钮(重新提交)
   * @param {Object} record 行数据
   * @returns {HTML}
   */
  const handleAddResetCommit = record => {
    if (record.returnStatus && record.returnStatus === '1') {
      return (
        <Action code="repaymentInstructions:resetCommit">
          <Button
            type="link"
            onClick={() => handleCanResetCommit(record)}
            style={{ width: '70px' }}
          >
            重新提交
          </Button>
        </Action>
      );
    }
  };

  /**
   * 排序方法
   */
  const handleChangeSorter = (pagination, filters, sorter) => {
    fieldData.current = sorter.field;
    if (sorter.order === 'ascend') {
      directionData.current = 'asc'; // 升序
    } else if (sorter.order === 'desc') {
      directionData.current = 'descend'; // 降序
    } else {
      directionData.current = ''; // 默认
    }
    handleGetDataObj();
    handleGetListData();
  };

  /**
   * 表格多选框按钮
   * @const   rowSelection
   * @method  onChange
   * @param   {selectedRows} 选中项
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, rows) => {
      setBatchObj({ ...batchObj, [pageNumData.current]: rows });
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  /**
   * 渲染表格数据
   * @param
   * @return  {Object}     表格数据及属性
   */
  const tableData = columns => {
    return (
      <Table
        className={styles.controlButtonDiv}
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.taskId} // key值
        dataSource={riseOverTableData.rows} // 表数据源
        columns={columns} // 表头数据
        scroll={{ x: columns.length * 200 + 400 }}
        onChange={handleChangeSorter}
      />
    );
  };

  /**
   * 切换选项卡
   * @method  handleClickGetTabsData
   * @param   {key} 选项卡key值
   * @return  {void} 数据获取后自动渲染
   */
  const handleClickGetTabsData = key => {
    dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    taskTypeCodeData.current = key;
    handleReset();
  };

  /**
   * 批量提交
   */
  const handlerBatchSubmit = () => {
    dispatch({
      type: 'repaymentInstructions/handleGetBatchCommitFunc',
      payload: batchData,
      callback: () => {
        handleGetListData();
      },
    });
  };

  // 批量办理
  const handleCanChecks = () => {
    let auditFlag = 0;
    const ordIds = [];
    batchData &&
      +batchData !== 0 &&
      batchData.forEach(item => {
        ordIds.push(item.ordId);
        auditFlag =
          item.taskName.indexOf('交易经办岗审核') !== -1
            ? 1
            : item.taskName.indexOf('业务负责人经办') !== -1
              ? 2
              : item.taskName.indexOf('发起人阅办') !== -1
                ? 3
                : 0;
      });
    dispatch({
      type: 'repaymentInstructions/handleGetChecksFunc',
      payload: {
        ordIds,
        remark: '同意',
        auditFlag,
      },
      callback: () => {
        handleGetListData();
      },
    });
  };

  /**
   * 批量处理接口调用成功以后的回调
   */
  const handlerSuccessCallback = () => {
    setSelectedRowKeys([]);
    setBatchObj({});
  };

  // 条件查询配置
  const formItemData = [
    {
      name: 'proName',
      label: '产品全称',
      type: 'select',
      readSet: { name: 'proName', code: 'proName', bracket: 'proName' },
      config: { mode: 'multiple', getPopupContainer: () => document.getElementById('repay') },
      option: proNameAndCodeData,
    },
    {
      name: 'ordDate',
      label: '指令日期',
      type: 'rangePicker',
      config: { getCalendarContainer: () => document.getElementById('repay') }, // 注意：这个组件的属性是 getCalendarContainer
    },
    {
      name: 'ordStatus',
      label: '指令状态',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', getPopupContainer: () => document.getElementById('repay') },
      option: dicts.transferOrdStatus,
    },
    {
      name: 'payAccName',
      label: '付款人',
      type: 'input',
    },
    {
      name: 'payAccNo',
      label: '付款账号',
      type: 'input',
    },
    {
      name: 'payAccBank',
      label: '付款行',
      type: 'input',
    },
    {
      name: 'receiveAccName',
      label: '收款人',
      type: 'input',
    },
    {
      name: 'receiveAccNo',
      label: '收款账号',
      type: 'input',
    },
    {
      name: 'receiveAccBank',
      label: '收款行',
      type: 'input',
    },
    {
      name: 'ordId',
      label: '指令id',
      type: 'input',
    },
    {
      name: 'ordSource',
      label: '来源',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', getPopupContainer: () => document.getElementById('repay') },
      option: dicts.transferOrdSource,
    },
    {
      name: 'payType',
      label: '款项类型',
      type: 'select',
      readSet: { name: 'name', code: 'code' },
      config: { mode: 'multiple', getPopupContainer: () => document.getElementById('repay') },
      option: payTypeList.current,
    },
  ];

  const handleGetProcessData = () => {
    formdata.current = [];
    files.current = [];
    batchData.forEach(item => {
      request(`/api/billow-diplomatic/todo-task/processInfo?taskId=${item.taskId}`).then(res => {
        if (res?.status === 200) {
          const data = res.data?.formData || {};
          formdata.current = [...formdata.current, data];
          const ordId = res.data?.formData?.C_IDEN || '';
          const list = res.data?.formData?.businessArchives || [];
          if (+list !== 0) files.current = [...files.current, { ordId, files: [...list] }];
        } else {
          message.warn('流程文件信息下载失败 !', res.message);
        }
      });
    });
  };

  // 属性:文件上传组件的属性
  const fileProps = {
    multiple: true,
    showUploadList: true,
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList(arr => {
        return [...arr, file];
      });
      return false;
    },
    fileList,
  };

  // 交互:modal确定按钮
  const handleModalSubmit = () => {
    confirm({
      title: '确定要上传吗?',
      onOk() {
        setModalShow(false);
        setSpinLoading(true);
        fileList.forEach(item => {
          const form = new FormData();
          form.append('file', item);
          fetch(
            '/ams/ams-file-service/fileServer/uploadFile?uploadFilePath=lifecycle/productsfiles/liquidation',
            {
              method: 'POST',
              body: form,
            },
          ).then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                const name = item.name.split('.')[0];
                const type = item.name.split('.')[1];
                const id = data.data;
                setFileNums(arr => {
                  return [
                    ...arr,
                    {
                      name,
                      type,
                      id,
                    },
                  ];
                });
              });
            } else return message.error(res.message), setSpinLoading(false);
          });
        });
      },
      onCancel() { },
    });
  };

  const handleCloseAll = () => {
    setFileNums([]);
    formdata.current = [];
    setFileList([]);
    files.current = [];
    setModalShow(false);
    setSpinLoading(false);
  };

  // 交互:modal取消按钮
  const handleModalClose = () => {
    confirm({
      title: '确定要关闭吗?',
      onOk() {
        handleCloseAll();
      },
      onCancel() { },
    });
  };

  // 交互:判断上传的文件里是否有重名文件
  const handleCheckLocalFile = () => {
    let boo = false;
    const arr = [];
    fileList.forEach(item => arr.push(item.name));
    const noRepeat = [...new Set(arr)];
    let repeat = [...arr];
    noRepeat.forEach(item => {
      const i = repeat.indexOf(item);
      repeat = repeat.slice(0, i).concat(repeat.slice(i + 1, repeat.length));
    });
    const final = Array.from(new Set(repeat));
    if (+final !== 0) {
      message.warning(final + '文件已存在 , 请确认好后再上传 ! ', 3);
      boo = true;
    } else boo = false;
    return boo;
  };

  // 交互:判断上传的文件与流程的文件是否有重合的文件
  const handleContrastFilesName = () => {
    const arr = [];
    const obj = JSON.parse(JSON.stringify(files.current));
    for (const item in obj) {
      obj[item].files.forEach(element => {
        fileList.forEach(index => {
          if (index.name.split('.')[0] === element.fileName) {
            arr.push({ ordId: obj[item].ordId, fileName: index.name });
          }
        });
      });
    }
    +arr !== 0 &&
      arr.forEach(item => {
        message.warning(
          `指令id : ${item.ordId} , ${item.fileName} 文件已存在 , 请确认好后再上传 ! `,
          3,
        );
      });
    return +arr !== 0 ? true : false;
  };

  // 交互:判断上传的文件是否都能找到对应的成交单
  const handleContrastDealIds = () => {
    const obj = JSON.parse(JSON.stringify(formdata.current));
    const arr = [];
    const names = [];
    const codes = [];
    const data = [];
    fileList.forEach(item => {
      names.push(item.name.split('.')[0]);
    });
    obj.forEach(item => {
      const code = item.C_DVP_CONSTRACTNO.split(',');
      code.forEach(element => {
        // code.includes(element) ? arr.push({ ordId: item.C_IDEN, fileName: element }) : '';
        codes.push(element);
      });
    });
    names.forEach(item => {
      if (!codes.includes(item)) arr.push(item);
    });
    +arr !== 0 &&
      arr.forEach(item => {
        fileList.forEach(element => {
          item.includes(element.name.split('.')[0]) ? data.push(element.name) : '';
        });
      });
    +data !== 0 ? message.warning(`${data} 没有对应的划款指令，请确认。`) : '';
    return +arr !== 0 ? true : false;
  };

  // 交互:批量上传文件确定键的disable属性控制
  const handleShowModalSubmit = () => {
    if (modalShow) {
      if (fileList.length === 0) {
        return true;
      } else if (handleCheckLocalFile()) {
        return true;
      } else if (handleContrastFilesName()) {
        return true;
      } else if (handleContrastDealIds()) {
        return true;
      } else return false;
    } else return true;
  };

  // 交互:批量上传按钮的disable属性控制(根据办理节点判断)
  const handleShowUpload = () => {
    const arr = [];
    if (+batchData !== 0) {
      batchData.forEach(item => {
        if (item.taskName === '发起人阅办') {
          arr.push(true);
        } else arr.push(false);
      });
    }
    return +batchData !== 0 && !arr.includes(false) ? false : true;
  };

  // 以下是导入PDF生成费用划款指令的功能
  // 点击 导入PDF生成费用划款指令 按钮
  const importPDF = () => {
    setModalPDFShow(true);
  };

  // 属性:PDF文件上传组件的属性
  const pdfFileProps = {
    multiple: true,
    showUploadList: true,
    onRemove: file => {
      const index = pdfFileList.indexOf(file);
      const newFileList = pdfFileList.slice();
      newFileList.splice(index, 1);
      setPdfFileList(newFileList);
    },
    beforeUpload: file => {
      setPdfFileList(arr => {
        return [...arr, file];
      });
      return false;
    },
    fileList: pdfFileList,
  };

  // 交互:判断上传的PDF文件里是否有重名文件
  const handleCheckPDFLocalFile = () => {
    let boo = false;
    const arr = [];
    pdfFileList.forEach(item => arr.push(item.name));
    const noRepeat = [...new Set(arr)];
    let repeat = [...arr];
    noRepeat.forEach(item => {
      const i = repeat.indexOf(item);
      repeat = repeat.slice(0, i).concat(repeat.slice(i + 1, repeat.length));
    });
    const final = Array.from(new Set(repeat));
    if (+final !== 0) {
      message.warning(final + '文件已存在 , 请确认好后再上传 ! ', 3);
      boo = true;
    } else boo = false;
    return boo;
  };

  // 关闭弹框时的重置操作
  const handlePDFCloseAll = () => {
    setPdfFileList([]);
    setModalPDFShow(false);
  };

  // 点击 modal 取消按钮
  const handlePDFModalClose = () => {
    confirm({
      title: '确定要关闭吗?',
      onOk() {
        handlePDFCloseAll();
      },
      onCancel() { },
    });
  };

  // 禁用PDF弹框 确定 按钮
  const disabledPDFModalSubmit = () => {
    if (modalPDFShow) {
      if (pdfFileList.length === 0) {
        return true;
      } else if (handleCheckPDFLocalFile()) {
        return true;
      } else return false;
    } else return true;
  };

  // 交互:点击上传PDF文件modal确定按钮
  const handlePDFModalSubmit = () => {
    validateFields(['payTypeVal'], (err, values) => {
      if (!err) {
        confirm({
          title: '确定要上传吗?',
          onOk() {
            const token = sessionStorage.getItem('auth_token');
            const form = new FormData();
            form.append('payType', values.payTypeVal);
            pdfFileList.forEach(item => {
              form.append('files', item);
            });
            setPdfLoading(true);
            fetch('/ams/yss-lifecycle-flow/transfer/uploadInstructionfile', {
              method: 'POST',
              headers: {
                Token: token,
                Data: new Date().getTime(),
                Sys: 0,
              },
              body: form,
            })
              .then(response => response.json())
              .then(res => {
                if (res.status === 200) {
                  setModalShow(false);
                  router.push(
                    `/dynamicPage/pages/划款指令/8aaa817e7fda71a9017ffca8cd020000/新增费用划款指令?submitType=4&batchNo=${res.data}`,
                  );
                } else {
                  // 错误信息提示
                  message.error(res.message);
                }
              })
              .finally(() => {
                setPdfLoading(false);
              });
          },
          onCancel() { },
        });
      }
    });
  };

  // 元素:表格按钮组
  const handleAddTableButtons = (
    <span>
      <Action code="repaymentInstructions:export">
        <Button type="primary" onClick={importPDF}>
          导入PDF生成费用划款指令
        </Button>
      </Action>
      <Action code="repaymentInstructions:add">
        <Button
          type="primary"
          onClick={() => {
            router.push(
              `/dynamicPage/pages/费用划款指令/8aaa817e7fda71a9017ffcf5893c0001/新增费用划款指令?submitType=5`,
            );
          }}
          className={styles.buttonMarginLeft20}
        >
          新增费用划款指令
        </Button>
      </Action>
      <Action code="repaymentInstructions:checks">
        <Button
          type="primary"
          loading={checksLoading}
          onClick={handleCanChecks}
          disabled={+batchData === 0}
          className={styles.buttonMarginLeft20}
          style={taskTypeCodeData.current === 'T001_1' ? {} : { display: 'none' }}
        >
          批量办理
        </Button>
      </Action>
      <Action code="repaymentInstructions:uploads">
        <Button
          type="primary"
          disabled={handleShowUpload()}
          onClick={() => [setModalShow(true), handleGetProcessData()]}
          className={styles.buttonMarginLeft20}
          style={taskTypeCodeData.current === 'T001_1' ? {} : { display: 'none' }}
        >
          批量上传
        </Button>
      </Action>
      <Modal
        title="批量上传"
        visible={modalShow}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={handleShowModalSubmit()}
            onClick={handleModalSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <Upload {...fileProps}>
          <Button onClick={() => (repeatFiles.current = [])}>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
      </Modal>
      {/* 上传PDF文件弹框 */}
      <Modal
        title="导入PDF生成费用划款指令"
        width={600}
        visible={modalPDFShow}
        onCancel={handlePDFModalClose}
        footer={[
          <Button key="back" onClick={handlePDFModalClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={pdfLoading}
            disabled={disabledPDFModalSubmit()}
            onClick={handlePDFModalSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <>
          <Form layout="inline">
            <Form.Item label="费用类型：">
              {getFieldDecorator('payTypeVal', {
                rules: [
                  {
                    required: true,
                    message: '请选择费用类型',
                  },
                ],
              })(
                <Radio.Group>
                  {dicts.pdfPaymentType &&
                    dicts.pdfPaymentType.map(item => {
                      return (
                        <Radio value={item.code} key={item.code}>
                          {item.name}
                        </Radio>
                      );
                    })}
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
          <Upload {...pdfFileProps}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </>
      </Modal>
      {/* 撤回弹框弹框 */}
      <Modal
        title="撤回意见"
        visible={modalRecallShow}
        onCancel={handleRecallModalClose}
        footer={[
          <Button key="recall" onClick={handleRecallModalClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={recallLoadingLoading}
            onClick={handleRecallModalSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <>
          <Form>
            <Form.Item>
              {getFieldDecorator('recallVal', {
                rules: [
                  {
                    required: true,
                    message: '请输入撤回意见',
                  },
                ],
              })(<TextArea rows={4} maxLength={500} style={{ width: '100%' }} />)}
            </Form.Item>
          </Form>
        </>
      </Modal>
    </span>
  );

  const callBackHandler = value => {
    setColumns(value);
  };

  return (
    <Spin tip="文件上传中" spinning={spinLoading} id="repay" style={{ position: 'relative' }}>
      <List
        pageCode="orderManagement"
        dynamicHeaderCallback={callBackHandler}
        columns={columns} // 表头数据
        taskTypeCode={taskTypeCodeData.current}
        title={false}
        formItemData={formItemData}
        advancSearch={handlerSearch}
        resetFn={handleReset}
        searchPlaceholder="请输入产品全称/产品代码"
        fuzzySearch={blurSearch}
        tabs={{
          tabList: [
            { key: 'T001_1', tab: '我待办' },
            { key: 'T001_3', tab: '我发起' },
            { key: 'T001_5', tab: '已办理' },
          ],
          activeTabKey: taskTypeCodeData.current,
          onTabChange: handleClickGetTabsData,
        }}
        extra={handleAddTableButtons}
        tableList={
          <>
            {taskTypeCodeData.current === 'T001_1' && <> {tableData(columns)} </>}
            {taskTypeCodeData.current === 'T001_3' && <> {tableData(columns)} </>}
            {taskTypeCodeData.current === 'T001_5' && <> {tableData(columns)} </>}
            <MoreOperation
              batchStyles={{ position: 'relative', left: '35px', top: '-45px' }}
              opertations={{
                tabs: taskTypeCodeData.current,
                statusKey: 'operStatusCode',
              }}
              fn={handleGetListData}
              type="batch"
              batchList={batchData}
              submitCallback={handlerBatchSubmit}
              successCallback={handlerSuccessCallback}
            />
          </>
        }
      />
    </Spin>
  );
};

const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ repaymentInstructions, loading, publicModel: { publicTas } }) => ({
        repaymentInstructions,
        listLoading: loading.effects['repaymentInstructions/fetch'],
        checksLoading: loading.effects['repaymentInstructions/handleGetChecksFunc'],
        publicTas,
      }))(Index),
    ),
  ),
);

export default WrappedIndexForm;

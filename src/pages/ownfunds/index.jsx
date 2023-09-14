// 自有资金参与页面
import React, { Component } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
const ButtonGroup = Button.Group;
/* S001状态 */
const dictList = {
  codeList: 'S001',
};

@Form.create()
class Ownfunds extends Component {
  state = {
    isOpenFrame: false,
    taskTypeCode: this.props.publicTas,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    loading: false,
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        // align: 'center',
        sorter: true,
        width: 200,
        key: 'proName',
        ellipsis: {
          showTitle: false,
        },
        render: (proName, record) => {
          return (
            <Tooltip title={proName}>
              <span>{proName ? proName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        sorter: true,
        width: 200,
        // align: 'center',
        key: 'proCode',
        ellipsis: {
          showTitle: false,
        },
        render: (proCode, record) => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode ? proCode : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品类型',
        // align: 'center',
        dataIndex: 'proTypeName',
        sorter: true,
        width: 200,
        key: 'proTypeName',
        ellipsis: {
          showTitle: false,
        },
        render: (proTypeName, record) => {
          return (
            <Tooltip title={proTypeName}>
              <span>{proTypeName ? proTypeName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品阶段',
        // align: 'center',
        dataIndex: 'proStage',
        sorter: true,
        width: 200,
        key: 'proStage',
        ellipsis: {
          showTitle: false,
        },
        render: (proStage, record) => {
          return (
            <Tooltip title={proStage}>
              <span>{proStage ? proStage : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '实际募集结束日',
        // align: 'center',
        dataIndex: 'raiseEdateActual',
        sorter: true,
        width: 200,
        key: 'raiseEdateActual',
        ellipsis: {
          showTitle: false,
        },
        render: (raiseEdateActual, record) => {
          return (
            <Tooltip title={raiseEdateActual}>
              <span>{raiseEdateActual ? raiseEdateActual : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '是否达到成立条件',
        align: 'center',
        dataIndex: 'raiseResult',
        sorter: true,
        width: 200,
        key: 'raiseResult',
        ellipsis: {
          showTitle: false,
        },
        render: (raiseResult, record) => {
          return (
            <Tooltip title={raiseResult}>
              <span>{raiseResult ? raiseResult : '-'}</span>
            </Tooltip>
          );
        },
      },
      // {
      //   title: '自有资金投资金额',
      //   dataIndex: 'selfMoneyAmount',
      //   key: 'selfMoneyAmount',
      //   // align: 'center',
      //   sorter: true,
      //   width: 200,
      //   ellipsis: {
      //     showTitle: false,
      //   },
      //   render: (selfMoneyAmount, record) => {
      //     return (
      //       <Tooltip title={selfMoneyAmount}>
      //         <span>{selfMoneyAmount}</span>
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        title: '自有资金投资金额',
        dataIndex: 'selfAmount',
        key: 'selfAmount',
        // align: 'center',
        sorter: true,
        width: 200,
        align: 'right',
        ellipsis: {
          showTitle: false,
        },
        render: (selfAmount, record) => {
          return (
            <Tooltip title={selfAmount}>
              <span>{selfAmount ? selfAmount : selfAmount == 0 ? 0 : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '自有资金投资比例',
        dataIndex: 'selfMoneyRate',
        // align: 'center',
        key: 'selfMoneyRate',
        sorter: true,
        width: 200,
        align: 'right',
        ellipsis: {
          showTitle: false,
        },
        render: (selfMoneyRate, record) => {
          return (
            <Tooltip title={selfMoneyRate}>
              <span>{selfMoneyRate ? (selfMoneyRate * 100).toFixed(2) : 0}%</span>
            </Tooltip>
          );
        },
      },
      {
        title: '自有资金认购份额',
        dataIndex: 'selfMoneySubsQuota',
        align: 'right',
        key: 'selfMoneySubsQuota',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (selfMoneySubsQuota, record) => {
          return (
            <Tooltip title={selfMoneySubsQuota}>
              <span>
                {selfMoneySubsQuota ? selfMoneySubsQuota : selfMoneySubsQuota == 0 ? 0 : '-'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '任务到达时间',
        dataIndex: 'createTime',
        sorter: true,
        align: 'center',
        key: 'createTime',
      },
      {
        title: '状态',
        dataIndex: 'operStatusName',
        align: 'right',
        key: 'operStatusName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (operStatusName, record) => {
          return (
            <Tooltip title={operStatusName}>
              <span>{operStatusName ? operStatusName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        // align: 'center',
        fixed: 'right',
        // width: 250,
        render: (text, record) => {
          const { taskTypeCode } = this.state;
          return (
            <span>
              <Action code="ownfunds:update">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'update');
                  }}
                >
                  修改
                </a>
              </Action>
              <Action code="ownfunds:copy">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'copy');
                  }}
                >
                  复制
                </a>
              </Action>
              <Action code="ownfunds:submit">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatusName == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'submit');
                  }}
                >
                  提交
                </a>
              </Action>
              <Action code="ownfunds:check">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatusName == '流程中'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'check');
                  }}
                >
                  办理
                </a>
              </Action>
              <Action code="ownfunds:detail">
                <a
                  style={{
                    display:
                      ((taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                        record.operStatusName == '已结束') ||
                      taskTypeCode == 'T001_3' ||
                      taskTypeCode == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'detail');
                  }}
                >
                  详情
                </a>
              </Action>
              <Action code="ownfunds:history">
                <a
                  style={{
                    display:
                      ((taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                        record.operStatusName != '待提交') ||
                      taskTypeCode == 'T001_3' ||
                      taskTypeCode == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'history');
                  }}
                >
                  流转历史
                </a>
              </Action>
              <Action code="ownfunds:delete">
                <a
                  style={{
                    display: record.operStatusName == '待提交' ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'delete');
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="ownfunds:revoke">
                <a
                  style={{
                    display:
                      record.operStatusName == '流程中' && record.revoke == 1
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'revoke');
                  }}
                >
                  撤销
                </a>
              </Action>
              {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
              {/* <Action code="ownfunds:more"> */}
              <a
                className="ant-dropdown-link"
                style={{
                  display:
                    (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                    record.operStatusName == '流程中'
                      ? 'inline-block'
                      : 'none',
                  marginRight: 10,
                }}
                // onClick={this.groupOperate(record, 'more')}
              >
                {/* 更多 */}
                <MoreOperation record={record} fn={this.getTableList} />
              </a>
              {/* </Action> */}
              {/* </Dropdown> */}
            </span>
          );
        },
      },
    ],
  };

  componentDidMount() {
    this.getTableDataList();
    // this.getProductList();
    this.getDictList();
    this.getproTypeList();
    this.getProductDropList();
  }

  getProductDropList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ownfunds/getProductDropList',
      payload: {
        proStage: 'P002_2',
      },
    });
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   * @param codeList {Object} 字典类型
   */
  getDictList() {
    const { dispatch } = this.props;
    dispatch({
      type: `ownfunds/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  /**
   * 方法说明 表格数据查询
   * @method getTableDataList
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param formItems {Object} 表单项
   * @param direction {string} 升序/降序
   * @param field  {string} 被排序字段
   * @param keyWords {string} 关键字
   */
  getTableDataList() {
    const { oField, taskTypeCode } = this.state;
    if ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') && oField === '') {
      this.setState(
        {
          // oField: 'taskArriveTime',
          // direct: 'desc'
          oField: '',
          direct: '',
        },
        () => {
          this.getTableList();
        },
      );
    } else {
      this.getTableList();
    }
  }

  getTableList = () => {
    const { dispatch, form } = this.props;
    const { direct, oField, page, limit, taskTypeCode, proCode, proType, status } = this.state;
    const params = {
      pageNum: page,
      pageSize: limit,
      direction: direct,
      field: oField,
      taskTypeCode,
      keyWords: this.state.keyWords,
      proCode,
      proType,
      status,
    };
    // if (params.direction === 'ascend') {
    //   params.direction = 'asc';
    // } else if (params.direction === 'descend') {
    //   params.direction = 'desc';
    // }
    /* this.setState({
      loading: true,
    }); */
    dispatch({
      type: `ownfunds/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.taskList,
          oTotal: res.data.total,
          loading: false,
        });
      }
    });
  };

  /**
   * 方法说明  产品类型查询
   * @method getProductTypeList
   * @param menuCode {string} 菜单
   */
  getproTypeList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'ownfunds',
    };
    dispatch({
      type: `ownfunds/handleProductTypeList`,
      payload: params,
    });
  }

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   * @param menuCode {string} 菜单
   */
  getProductList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'ownfunds',
    };
    dispatch({
      type: `ownfunds/queryProductList`,
      payload: params,
    });
  }

  /**
   * 方法说明  排序change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order ? (sorter.order == 'ascend' ? 'asc' : 'desc') : '',
        oField: sorter.order ? sorter.field : '',
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // 页码change
  sizeChange = (current, size) => {
    this.setState(
      {
        page: current,
        limit: size,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  /* *
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param keyWords {string} 关键字
   */
  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * @method 展开搜索框
   * @param menuCode {string} 菜单
   */
  openConditions = () => {
    const { isOpenFrame } = this.state;
    this.setState({
      isOpenFrame: !isOpenFrame,
      keyWords: '',
    });
  };

  /**
   * @method renderColActions
   */
  renderColActions = (colActions, text, record) => {
    return (
      <>
        {colActions.map(btn =>
          btn.text === '更多' ? (
            this.actionButtonMore(record)
          ) : (
            <Action key={`ownfunds:${btn.flag}`} code={`ownfunds:${btn.flag}`}>
              <Button onClick={() => btn.onClick(record)} type="link" size="small">
                {btn.text}
              </Button>
            </Action>
          ),
        )}
      </>
    );
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('===选中列表===');
    console.log(selectedRowKeys, selectedRows);
    this.setState({
      selectedRowKeys,
      selectedRows,
      batchList: selectedRows,
    });
  };

  /**
   * 更多
   * @method actionButtonMore
   */
  actionButtonMore = record => {
    return (
      <Dropdown
        overlay={
          <Menu onClick={this.moreGroupButton} style={{ textAlign: 'center' }}>
            {record.operationAuthority &&
              record.operationAuthority.map(operationAuthorityItem => (
                <Menu.Item key={operationAuthorityItem}>{operationAuthorityItem}</Menu.Item>
              ))}
          </Menu>
        }
        trigger={['click']}
      >
        <a
          className="ant-dropdown-link"
          style={{ marginRight: 10 }}
          onClick={e => e.preventDefault()}
        >
          {' '}
          更多{' '}
        </a>
      </Dropdown>
    );
  };

  /**
   * 更多按钮操作事件
   * @method moreGroupButton
   * */
  moreGroupButton = val => {
    const { key } = val;
    console.log(val);
    if (key === '认领') {
    } else if (key === '委托') {
    } else if (key === '退回') {
    } else if (key === '移交') {
    } else if (key === '传阅') {
    } else if (key === '撤销') {
    }
  };

  /**
   * 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    const operations = (
      <Action code="ownfunds:add">
        <Button
          type="primary"
          onClick={() => {
            this.OwnfundsAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
    return operations;
  };

  // /**
  //  * @method 批量操作
  //  * @param {*} param0
  //  * @param {*} val
  //  * @param {*} record
  //  */
  // handleBatchOperation = ({ key }) => {
  //   console.log('===批量操作===');
  //   console.log(key);

  //   const { selectedRows } = this.state;
  //   if (selectedRows.length === 0) {
  //     message.error('请选择需要批量操作流程!');
  //   }
  //   const idArr = [];
  //   for (let i = 0; i < selectedRows.length; i++) {
  //     if (selectedRows[i].operStatusName === '已结束') {
  //       message.error('已结束的流程不能进行批量操作!');
  //       return;
  //     }
  //     if (key === '1' && selectedRows[i].operStatusName != '待提交') {
  //       message.error('待提交的流程才能进行批量操作!');
  //       return;
  //     }
  //     idArr.push(selectedRows[i].id);
  //   }
  //   switch (key) {
  //     case '1':
  //       console.log('key ==== 1');
  //       this.props.dispatch({
  //         type: 'ownfunds/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     case '2':
  //       this.props.dispatch({
  //         type: 'raiseAnnouncement/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     case '3':
  //       this.props.dispatch({
  //         type: 'raiseAnnouncement/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     case '4':
  //       this.props.dispatch({
  //         type: 'raiseAnnouncement/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     case '5':
  //       this.props.dispatch({
  //         type: 'raiseAnnouncement/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     case '6':
  //       this.props.dispatch({
  //         type: 'raiseAnnouncement/commitBatch',
  //         payload: {
  //           ids: idArr,
  //         },
  //       });
  //       break;
  //     default:
  //       console.log('default');
  //   }
  // };

  /**
   * 批量提交
   * @param {*} list
   */
  handlerBatchSubmit = list => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'ownfunds/commitBatch',
        payload: {
          ids,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.getTableDataList();
          this.handlerSuccessCallback();
        } else {
          message.error(res.message);
        }
      });
  };
  /**
   * 批量处理接口调用成功以后的回调
   */
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      batchList: [],
    });
  };

  /**
   * 提交
   * @method openSubmitModal
   */
  openSubmitModal = () => {
    confirm({
      title: '确认要发起申请吗?',
      onOk() {
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  OwnfundsAdd = () => {
    // const { dispatch } = this.props;
    // dispatch(
    //   routerRedux.push({
    //     pathname: '/dynamicPage/4028e7b673bdc3af0174098c06350051/自有资金参与划款新增发起流程页面',
    //   }),
    // );

    this.props.fnLink('ownfunds:add', '');
  };

  /**
   *
   * 批量复核事件
   * @method recheck
   */
  /* recheck = () => {
    const idArr = [];
    this.state.checkedArr.forEach(item => {
      if (item.taskId !== undefined) {
        idArr.push(item.taskId);
      }
    });
  };  */

  /**
   * 条件查询
   * @method searchBtn
   */
  handlerSearch = fieldsValue => {
    const { proCode, proType, status } = fieldsValue;
    this.setState(
      {
        proCode: proCode,
        proType: proType,
        status: status,
        page: 1,
        limit: 10,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        proCode: [],
        proType: [],
        status: [],
        page: 1,
        limit: 10,
        direct: '',
        oField: '',
        keyWords: '',
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  /**
   * 操作列 事件
   * @method groupOperate
   */
  groupOperate(record, mark) {
    const { dispatch } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
    };
    if (mark === 'copy') {
      this.props.fnLink('ownfunds:copy', `?processInstId=${record.processInstanceId}`);
    } else if (mark === 'update') {
      this.props.fnLink(
        'ownfunds:update',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'chart') {
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/nativeProduct',
      //     query: {
      //       status: 'update',
      //       proCode: record.productCode,
      //     },
      //   }),
      // );
    } else if (mark === 'check') {
      const params = {
        taskId: record.taskId,
        processDefinitionId: record.processDefinitionId,
        processInstanceId: record.processInstanceId,
        taskDefinitionKey: record.taskDefinitionKey,
        mode: 'deal',
        id: record.id,
        proCode: record.proCode,
      };
      this.props.dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'history') {
      handleShowTransferHistory(record);
    } else if (mark === 'more') {
    } else if (mark === 'submit') {
      this.props.fnLink(
        'ownfunds:submit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'detail') {
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'delete') {
      this.handleDelete(record);
    } else if (mark === 'revoke') {
      this.handleCancel(record);
    }
  }

  // 删除
  handleDelete = record => {
    confirm({
      // title: '温馨提示',
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = record.id.split(',');
        this.props.dispatch({
          type: 'ownfunds/deleteTable',
          payload,
          callback: res => {
            if (res.status == 200) {
              message.success('删除成功');
              this.getTableList();
            } else {
              message.error(res.message);
            }
          },
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };

  // 撤销
  handleCancel = record => {
    confirm({
      // title: '温馨提示',
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'ownfunds/revokeTable',
          payload,
          callback: res => {
            if (res.status == 200) {
              message.success('撤销成功');
              this.getTableList();
            } else {
              message.error(res.message);
            }
          },
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };
  /**
   * 方法说明 tab切换
   * @method  changeTabs
   * @param key {string}
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.props.form.resetFields();
    this.setState(
      {
        tableList: [],
        taskTypeCode: key,
        page: 1,
        limit: 10,
      },
      () => {
        this.handleReset();
      },
    );
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    /* const { } = this.props; */
    const {
      tableList,
      oTotal,
      page,
      limit,
      loading,
      taskTypeCode,
      batchList,
      columns,
    } = this.state;
    const {
      ownfunds: { proTypeList, statusList, productDropList },
    } = this.props;
    const moreActions = [
      {
        text: '修改',
        flag: 'update',
        onClick: record => this.groupOperate(record, 'update'),
      },
      {
        text: '提交',
        flag: 'submit',
        onClick: record => this.groupOperate(record, 'submit'),
      },
      // {
      //   text: '流程图',
      //   flag: 'chart',
      //   onClick: record => this.groupOperate(record, 'chart'),
      // },
      // {
      //   text: '删除',
      //   flag: 'delete',
      //   onClick: record => this.groupOperate(record, 'delete'),
      // },
    ];

    const joinedActions = [
      {
        text: '办理',
        flag: 'check',
        onClick: record => this.groupOperate(record, 'check'),
      },
      {
        text: '流转历史',
        flag: 'history',
        onClick: record => this.groupOperate(record, 'history'),
      },
      // {
      //   text: '撤销',
      //   flag: 'revoke',
      //   onClick: record => this.groupOperate(record, 'revoke'),
      // },
      {
        text: '更多',
        flag: 'more',
        onClick: record => this.groupOperate(record, 'more'),
      },
    ];

    const initActions = [
      {
        text: '详情',
        flag: 'detail',
        onClick: record => this.groupOperate(record, 'detail'),
      },
      {
        text: '流转历史',
        flag: 'history',
        onClick: record => this.groupOperate(record, 'history'),
      },
      // {
      //   text: '撤销',
      //   flag: 'revoke',
      //   onClick: record => this.groupOperate(record, 'revoke'),
      // },
    ];

    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const baseTable = () => {
      const { taskTypeCode } = this.state;
      return (
        <>
          <Table
            rowSelection={
              taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4'
                ? {
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: this.onSelectChange,
                  }
                : null
            }
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: columns.length * 200 + 100 }}
            onChange={this.handleTableChange}
            loading={loading}
          />
          {tableList.length > 0 ? (
            <Row style={{ paddingTop: 20 }}>
              <Pagination
                style={{ float: 'right' }}
                showSizeChanger
                showQuickJumper={oTotal > limit}
                pageSizeOptions={['10', '20', '30', '40']}
                total={oTotal}
                current={page}
                pageSize={limit}
                onShowSizeChange={this.sizeChange}
                onChange={this.sizeChange}
                showTotal={oTotal => `共 ${oTotal} 条数据`}
              />
              {/* <Dropdown
                overlay={
                  <Menu
                    style={{ textAlign: 'center' }}
                    onClick={key => {
                      this.handleBatchOperation(key);
                    }}
                  >
                    <Menu.Item key="1">提交</Menu.Item>
                    <Menu.Item key="2">认领</Menu.Item>
                    <Menu.Item key="3">委托</Menu.Item>
                    <Menu.Item key="4">退回</Menu.Item>
                    <Menu.Item key="5">移交</Menu.Item>
                    <Menu.Item key="6">传阅</Menu.Item>
                  </Menu>
                }
                placement="topLeft"
              >
                <Button
                  style={{
                    display:
                      taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4'
                        ? 'inline-block'
                        : 'none',
                  }}
                >
                  批量操作
                </Button>
              </Dropdown> */}
              {taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4' ? (
                <MoreOperation
                  batchStyles={{ position: 'relative' }}
                  opertations={{
                    tabs: taskTypeCode,
                    statusKey: 'operStatus',
                  }}
                  fn={this.getTableList}
                  type="batch"
                  batchList={batchList}
                  submitCallback={this.handlerBatchSubmit}
                  successCallback={this.handlerSuccessCallback}
                />
              ) : null}
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };

    // 条件查询配置
    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productDropList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: proTypeList,
      },
      {
        name: 'status',
        label: '产品状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: statusList,
      },
    ];
    return (
      <>
        <List
          pageCode="ownfunds"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="createTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.seachTableData}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: this.state.taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {this.state.taskTypeCode === 'T001_1' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_3' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_4' && <> {baseTable()} </>}
              {this.state.taskTypeCode === 'T001_5' && <> {baseTable()} </>}
            </>
          }
        />
      </>
    );
  }
}

// const WrappedSingleForm = Form.create()(
//   connect(({ ownfunds, loading }) => ({
//     ownfunds,
//     loading: loading.effects['ownfunds/handleTableDataList'],
//   }))(Ownfunds),
// );

// export default WrappedSingleForm;

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ ownfunds, loading, publicModel: { publicTas } }) => ({
        ownfunds,
        publicTas,
        loading: loading.effects['ownfunds/handleTableDataList'],
      }))(Ownfunds),
    ),
  ),
);

export default WrappedSingleForm;

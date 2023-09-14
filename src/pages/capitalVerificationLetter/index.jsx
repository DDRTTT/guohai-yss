// 验资询证函页面
import React, { Component } from 'react';
import { Button, Form, Input, Menu, message, Modal, Pagination, Select, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { confirm } = Modal;

@Form.create()
class CapitalVerificationLetter extends Component {
  state = {
    expand: false,
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    form: {},
    fuzzy: '',
    proCode: '',
    assetTypeCode: '',
    custodianName: '',
    investManagerName: '',
    operStatus: '',
    pageNum: 1,
    pageSize: 10,
    taskTypeCode: this.props.publicTas,
    direction: '',
    field: '',
    columns: [
      {
        key: 'productName',
        title: '产品全称',
        dataIndex: 'productName',
        sorter: true,
        width: 400,
        ellipsis: {
          showTitle: false,
        },
        render: (productName, record) => {
          return (
            <Tooltip title={productName}>
              <span>{productName ? productName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'proCode',
        title: '产品代码',
        dataIndex: 'proCode',
        sorter: true,
        width: 200,
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
        key: 'assetTypeName',
        title: '产品类型',
        dataIndex: 'assetTypeName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (assetTypeName, record) => {
          return (
            <Tooltip title={assetTypeName}>
              <span>{assetTypeName ? assetTypeName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'investManagerName',
        title: '投资经理',
        dataIndex: 'investManagerName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (investManagerName, record) => {
          return (
            <Tooltip title={investManagerName}>
              <span>{investManagerName ? investManagerName.replace(/null/g, '-') : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'custodianName',
        title: '托管人',
        dataIndex: 'custodianName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (custodianName, record) => {
          return (
            <Tooltip title={custodianName}>
              <span>{custodianName ? custodianName : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'taskTime',
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (taskTime, record) => {
          return (
            <Tooltip title={taskTime}>
              <span>{taskTime ? taskTime : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'operStatus',
        title: '状态',
        dataIndex: 'operStatus',
        sorter: true,
        width: 200,
        align: 'right',
        ellipsis: {
          showTitle: false,
        },
        render: (operStatus, record) => {
          return (
            <Tooltip title={operStatus}>
              <span>{operStatus ? operStatus : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        key: 'option',
        title: '操作',
        dataIndex: 'option',
        // width: 200,
        fixed: 'right',
        render: (val, record) => {
          const { taskTypeCode } = this.state;
          return (
            <span>
              <Action code="capitalVerificationLetter:update">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatus == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.updateTable(val, record);
                  }}
                >
                  修改
                </a>
              </Action>
              <Action code="capitalVerificationLetter:copy">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatus == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.copyTable(val, record);
                  }}
                >
                  复制
                </a>
              </Action>
              <Action code="capitalVerificationLetter:commit">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatus == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.submitTable(val, record);
                  }}
                >
                  提交
                </a>
              </Action>
              {/* <Action code="capitalVerificationLetter:chart">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                        record.operStatus == '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.flowTable(val, record);
                  }}
                >
                  流程图
                </a>
              </Action> */}
              <Action code="capitalVerificationLetter:delete">
                <a
                  style={{
                    display: record.operStatus == '待提交' ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.deleteTable(val, record);
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="capitalVerificationLetter:check">
                <a
                  style={{
                    display:
                      (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                      record.operStatus == '流程中'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.handleTable(val, record);
                  }}
                >
                  办理
                </a>
              </Action>
              <Action code="capitalVerificationLetter:detail">
                <a
                  style={{
                    display:
                      ((taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                        record.operStatus == '已结束') ||
                      taskTypeCode == 'T001_3' ||
                      taskTypeCode == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.lookDetail(val, record);
                  }}
                >
                  详情
                </a>
              </Action>
              <Action code="capitalVerificationLetter:history">
                <a
                  style={{
                    display:
                      ((taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                        record.operStatus != '待提交') ||
                      taskTypeCode == 'T001_3' ||
                      taskTypeCode == 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    handleShowTransferHistory(record);
                  }}
                >
                  流转历史
                </a>
              </Action>
              <Action code="capitalVerificationLetter:revoke">
                <a
                  style={{
                    display:
                      record.operStatus == '流程中' && record.revoke == 1 ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.revokeTable(val, record);
                  }}
                >
                  撤销
                </a>
              </Action>
              {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
              {/* <Action code="capitalVerificationLetter:more"> */}
              <a
                className="ant-dropdown-link"
                style={{
                  display:
                    (taskTypeCode == 'T001_1' || taskTypeCode == 'T001_4') &&
                    record.operStatus == '流程中'
                      ? 'inline-block'
                      : 'none',
                  marginRight: 10,
                }}
                // onClick={e => e.preventDefault()}
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

  /**
   * @method 请求表单下拉选项
   * 'A002' 产品类型, 'P001' 产品备案类型, 'M002' 运作方式,  'R001' 风险等级 'I009' 客户类型 'S001' 状态 'J004_2'托管人
   J006 管理人  暂时取字典  后期从企业信息管理表中获取
   产品归属业务部 投资经理  投资经理暂无字典
   */
  handleGetSelectOptions = () => {
    this.props.dispatch({
      type: 'capitalVerificationLetter/getDicts',
      // payload: { codeList: ['A002', 'J004_2', 'S001'] },
      payload: { codeList: ['J004_2', 'S001'] },
    });
  };

  /**
   *@method 获取产品类型下拉列表
   */
  handleGetProTypeList = () => {
    this.props.dispatch({
      type: 'capitalVerificationLetter/getProTypeList',
      payload: {},
    });
  };

  /**
   * @method 切换时间
   * @param {*} date
   * @param {*} dateString
   */
  changeDate = (date, dateString) => {
    this.setState({
      date: moment(dateString, 'YYYY-MM-DD'),
      time: dateString,
    });
  };

  /**
   * @method 生命周期钩子函数
   */
  componentDidMount() {
    this.handleGetSelectOptions();
    this.handleGetProTypeList();
    this.handleGetTableList();
    this.getProductDropList();
    this.getTrusteeList();
    this.getInvestManagerNameList();
  }

  getProductDropList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'capitalVerificationLetter/getProductDropList',
      payload: {
        proType: 'A002_2,A002_3',
      },
    });
  }

  getTrusteeList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'capitalVerificationLetter/getTrusteeEnum',
    });
  }

  getInvestManagerNameList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'capitalVerificationLetter/getInvestManagerNameList',
    });
  }

  /**
   * @method 请求表格列表
   */
  handleGetTableList = () => {
    if (this.state.field === '') {
      this.setState(
        {
          field: '',
          direction: '',
        },
        () => {
          this.getTableList();
        },
      );
    } else {
      this.getTableList();
    }
  };

  getTableList() {
    const payload = {
      fuzzy: this.state.fuzzy,
      proCode: this.state.proCode,
      assetTypeCode: this.state.assetTypeCode,
      // investManagerName: this.state.investManagerName,
      custodianName: this.state.custodianName,
      investManagerName: this.state.investManagerName,
      operStatus: this.state.operStatus,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      taskTypeCode: this.state.taskTypeCode,
      direction: this.state.direction,
      field: this.state.field,
    };
    this.props.dispatch({
      type: 'capitalVerificationLetter/searchTableData',
      payload,
    });
  }

  /**
   * @method 修改关键字
   * @param {*} value
   */
  changeKeyWords = value => {
    this.setState(
      {
        fuzzy: value,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 查询
   * @param {*} e
   */
  handlerSearch = fieldsValue => {
    const form = fieldsValue || {};
    const proCode = form.proCode ? form.proCode.join() : '';
    const assetTypeCode = form.assetTypeCode ? form.assetTypeCode.join() : '';
    const custodianName = form.custodianName ? form.custodianName.join() : '';
    const investManagerName = form.investManagerName ? form.investManagerName.join() : '';
    const operStatus = form.operStatus ? form.operStatus.join() : '';
    this.setState(
      {
        proCode,
        assetTypeCode,
        custodianName,
        investManagerName,
        operStatus,
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        fuzzy: '',
        proCode: '',
        assetTypeCode: '',
        custodianName: '',
        investManagerName: '',
        operStatus: '',
        direction: '',
        field: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 展开搜索/收起搜索
   */
  toggle = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
      assetTypeCode: '',
      custodianName: '',
      fuzzy: '',
      investManagerName: '',
      operStatus: '',
      proCode: '',
    });
    this.props.form.resetFields();
  };

  /**
   * 修改
   * @param {*} val
   * @param {*} record
   */
  updateTable(val, record) {
    console.log('===修改===');
    console.log(val);
    console.log(record);

    this.props.fnLink(
      'capitalVerificationLetter:update',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * 复制
   * @param {*} val
   * @param {*} record
   */
  copyTable(val, record) {
    console.log('===复制===');
    console.log(val);
    console.log(record);

    this.props.fnLink(
      'capitalVerificationLetter:copy',
      `?processInstId=${record.processInstanceId}`,
    );
  }

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  /**
   * @method 提交
   * @param {*} val
   * @param {*} record
   */
  submitTable(val, record) {
    console.log('===提交===');
    console.log(val);
    console.log(record);

    this.props.fnLink(
      'capitalVerificationLetter:commit',
      `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
    );
  }

  /**
   * @method 流程图
   * @param {*} val
   * @param {*} record
   */
  flowTable(val, record) {
    console.log('===流程图===');
    console.log(val);
    console.log(record);
  }

  /**
   * @method 删除
   * @param {*} val
   * @param {*} record
   */
  deleteTable(val, record) {
    console.log('===删除===');
    console.log(val);
    console.log(record);

    confirm({
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = record.id.split(',');
        this.props.dispatch({
          type: 'capitalVerificationLetter/deleteTable',
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
  }

  /**
   * @method 撤销
   * @param {*} val
   * @param {*} record
   */
  revokeTable(val, record) {
    console.log('===撤销===');
    console.log(val);
    console.log(record);

    confirm({
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'capitalVerificationLetter/revokeTable',
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
  }

  /**
   * @method 办理
   * @param {*} val
   * @param {*} record
   * @params taskId 任务id
   * @params processDefinitionId 流程定义id
   * @params processInstanceId 流程实例id
   * @params taskDefinitionKey 任务定义key
   */
  handleTable(val, record) {
    console.log('===办理===');
    console.log(val);
    console.log(record);

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
  }

  /**
   * @method 流转历史
   * @param {*} val
   * @param {*} record
   */
  historyTable(val, record) {
    console.log('===流转历史===');
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

  /**
   * @method 详情
   * @param {*} val
   * @param {*} record
   */
  lookDetail(val, record) {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
      }),
    );
  }

  /**
   * @method 切换页码 页大小
   * @param {*} page
   * @param {*} pageSize
   */
  changePage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
      batchList: selectedRows,
    });
  };

  /**
   * @method 切换tab
   * @param {*} key
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.props.form.resetFields();
    this.setState(
      {
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  /**
   * @method 改变表格排序
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   */
  changeTable = (pagination, filters, sorter) => {
    this.setState(
      {
        direction: sorter.order ? (sorter.order == 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? sorter.field : '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method 更多下拉菜单
   * @param {*} val
   * @param {*} record
   */
  HandleGetMenu = (val, record) => {
    return (
      <Menu onClick={this.moreGroupButton} style={{ textAlign: 'center' }}>
        {record.operationAuthority &&
          record.operationAuthority.map(operationAuthorityItem => (
            <Menu.Item key={operationAuthorityItem}>{operationAuthorityItem}</Menu.Item>
          ))}
      </Menu>
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

  // /**
  //  * @method 批量操作下拉菜单
  //  */
  // HandleGetBatchMenu = () => {
  //   return (
  //     <Menu
  //       style={{ textAlign: 'center' }}
  //       onClick={key => {
  //         this.handleBatchOperation(key);
  //       }}
  //     >
  //       <Menu.Item key="1">提交</Menu.Item>
  //       <Menu.Item key="2">认领</Menu.Item>
  //       <Menu.Item key="3">委托</Menu.Item>
  //       <Menu.Item key="4">退回</Menu.Item>
  //       <Menu.Item key="5">移交</Menu.Item>
  //       <Menu.Item key="6">传阅</Menu.Item>
  //     </Menu>
  //   );
  // };

  // /**
  //  * @method 批量操作
  //  * @param {*} param0
  //  * @param {*} val
  //  * @param {*} record
  //  */
  // handleBatchOperation = ({ key }) => {
  //   console.log('===批量操作===', key);
  //   const { selectedRows } = this.state;
  //   // if (selectedRows.length === 0) {
  //   //   message.error('请选择需要批量操作流程!');
  //   //   return;
  //   // }
  //   const idArr = [];
  //   for (let i = 0; i < selectedRows.length; i++) {
  //     // if (selectedRows[i].operStatusName === "已结束") {
  //     //   message.error('已结束的流程不能进行批量操作!');
  //     //   return;
  //     // } else if (key === '1' && selectedRows[i].operStatusName != "待提交") {
  //     //   message.error('待提交的流程才能进行批量提交操作!');
  //     //   return
  //     // }
  //     idArr.push(selectedRows[i].id);
  //   }
  //   console.log('key ==== 1', idArr);
  //   switch (key) {
  //     case '1':
  //       this.props.dispatch({
  //         type: 'capitalVerificationLetter/commitBatch',
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
        type: 'capitalVerificationLetter/commitBatch',
        payload: {
          ids,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.handleGetTableList();
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
   * @method 新增发起流程
   */
  addProcess = () => {
    this.props.fnLink('capitalVerificationLetter:add', '');
  };

  /**
   * @method 发起流程按钮
   */
  setOperations = () => {
    return (
      <Action code="capitalVerificationLetter:add">
        <Button
          type="primary"
          onClick={() => {
            this.addProcess();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  /**
   * @method 渲染模板
   */
  render() {
    const {
      dataSource,
      total,
      loading,
      dicts,
      proTypeList,
      trusteeList,
      investManagerNameList,
      productDropList,
      moreOperationStatus,
    } = this.props.capitalVerificationLetter;
    const { getFieldDecorator } = this.props.form;
    const { taskTypeCode, pageNum, pageSize, batchList, columns } = this.state;
    const { Option } = Select;
    const { Search } = Input;
    const { TabPane } = Tabs;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
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
        name: 'assetTypeCode',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: [
          { name: '小集合', code: 'A002_2' },
          { name: '大集合', code: 'A002_3' },
        ],
      },
      {
        name: 'custodianName',
        label: '托管人',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: trusteeList,
      },
      {
        name: 'investManagerName',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: investManagerNameList,
      },
      {
        name: 'operStatus',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts.S001List,
      },
    ];
    return (
      <>
        <List
          pageCode="capitalVerificationLetter"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入产品全称/产品代码"
          fuzzySearch={this.changeKeyWords}
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
              {this.state.taskTypeCode === 'T001_1' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 400 }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  <div
                    style={{
                      display: total == 0 ? 'none' : 'block',
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'status',
                        }}
                        fn={this.getTableList}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  </div>
                </>
              )}
              {this.state.taskTypeCode === 'T001_3' && (
                <>
                  <Table
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 400 }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  <div
                    style={{
                      display: total == 0 ? 'none' : 'block',
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  </div>
                </>
              )}
              {this.state.taskTypeCode === 'T001_4' && (
                <>
                  <Table
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: this.onSelectChange,
                    }}
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 400 }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  <div
                    style={{
                      display: total == 0 ? 'none' : 'block',
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <MoreOperation
                        batchStyles={{ position: 'relative' }}
                        opertations={{
                          tabs: taskTypeCode,
                          statusKey: 'status',
                        }}
                        fn={this.getTableList}
                        type="batch"
                        batchList={batchList}
                        submitCallback={this.handlerBatchSubmit}
                        successCallback={this.handlerSuccessCallback}
                      />
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  </div>
                </>
              )}
              {this.state.taskTypeCode === 'T001_5' && (
                <>
                  <Table
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: columns.length * 200 + 400 }}
                    pagination={false}
                    onChange={this.changeTable}
                  />
                  <div
                    style={{
                      display: total == 0 ? 'none' : 'block',
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <Pagination
                        style={{
                          float: 'right',
                        }}
                        defaultPageSize={pageSize}
                        onChange={this.changePage}
                        onShowSizeChange={this.changePage}
                        total={total}
                        current={pageNum}
                        pageSize={pageSize}
                        showTotal={() => `共 ${total} 条数据`}
                        showSizeChanger
                        showQuickJumper={total > pageSize}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          }
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ capitalVerificationLetter, publicModel: { publicTas } }) => ({
        capitalVerificationLetter,
        publicTas,
      }))(CapitalVerificationLetter),
    ),
  ),
);

export default WrappedSingleForm;

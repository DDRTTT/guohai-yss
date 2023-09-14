// 持有人大会页面

import React, { Component } from 'react';
import { Button, Form, message, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const { confirm } = Modal;

const codeList = 'A002, S001';

@Form.create()
class Index extends Component {
  state = {
    taskType: this.props.publicTas,
    isOpenFrame: false,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    loading: false,
    // checkedArr: [],
    selectedRowKeys: [],
    selectedRows: [],
    batchList: [],
    fieldsValue: {},
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        key: 'proName',
        sorter: true,
        width: 400,
        ellipsis: {
          showTitle: false,
        },
        render: proName => {
          return (
            <Tooltip title={proName}>
              <span>{proName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proCode => {
          return (
            <Tooltip title={proCode}>
              <span>{proCode || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        key: 'proTypeName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proTypeName => {
          return (
            <Tooltip title={proTypeName}>
              <span>{proTypeName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '投资经理',
        dataIndex: 'investmentManager',
        key: 'investmentManager',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: investmentManager => {
          return (
            <Tooltip title={investmentManager}>
              <span>{investmentManager ? investmentManager.replace(/null/g, '-') : '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '产品成立日',
        dataIndex: 'proCdate',
        key: 'proCdate',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: proCdate => {
          return (
            <Tooltip title={proCdate}>
              <span>{proCdate || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '会议预计时间',
        key: 'expectTime',
        dataIndex: 'expectTime',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: expectTime => {
          return (
            <Tooltip title={expectTime}>
              <span>{expectTime || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '任务到达时间',
        key: 'taskTime',
        dataIndex: 'taskTime',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: taskTime => {
          return (
            <Tooltip title={taskTime}>
              <span>{taskTime || '-'}</span>
            </Tooltip>
          );
        },
        // className: taskType === 'T001_3' || taskType === 'T001_5' ? style.notshow : '',
      },
      {
        title: '状态',
        key: 'operStatusName',
        dataIndex: 'operStatusName',
        sorter: true,
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: operStatusName => {
          return (
            <Tooltip title={operStatusName}>
              <span>{operStatusName || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        // Width: 280,
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        render: (text, record) => {
          const { taskType } = this.state;
          return (
            <span>
              <Action code="investorConference:edit">
                <a
                  style={{
                    display:
                      (taskType === 'T001_1' || taskType === 'T001_4') &&
                      record.operStatusName === '待提交'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'edit');
                  }}
                >
                  修改
                </a>
              </Action>
              <Action code="investorConference:copy">
                <a
                  style={{
                    display:
                      (taskType === 'T001_1' || taskType === 'T001_4') &&
                      record.operStatusName === '待提交'
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
              <Action code="investorConference:submit">
                <a
                  style={{
                    display:
                      (taskType === 'T001_1' || taskType === 'T001_4') &&
                      record.operStatusName === '待提交'
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
              <Action code="investorConference:delete">
                <a
                  style={{
                    display: record.operStatusName === '待提交' ? 'inline-block' : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'delete');
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="investorConference:handle">
                <a
                  style={{
                    display:
                      (taskType === 'T001_1' || taskType === 'T001_4') &&
                      record.operStatusName === '流程中'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'handle');
                  }}
                >
                  办理
                </a>
              </Action>
              <Action code="investorConference:view">
                <a
                  style={{
                    display:
                      ((taskType === 'T001_1' || taskType === 'T001_4') &&
                        record.operStatusName === '已结束') ||
                      taskType === 'T001_3' ||
                      taskType === 'T001_5'
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'view');
                  }}
                >
                  详情
                </a>
              </Action>
              <Action code="investorConference:history">
                <a
                  style={{
                    display:
                      ((taskType === 'T001_1' || taskType === 'T001_4') &&
                        record.operStatusName != '待提交') ||
                      taskType === 'T001_3' ||
                      taskType === 'T001_5'
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
              <Action code="investorConference:cancel">
                <a
                  style={{
                    display:
                      record.operStatusName === '流程中' && record.revoke == 1
                        ? 'inline-block'
                        : 'none',
                    marginRight: 10,
                  }}
                  onClick={() => {
                    this.groupOperate(record, 'cancel');
                  }}
                >
                  撤销
                </a>
              </Action>
              {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
              {/* <Action code="investorConference:more"> */}
              <a
                className="ant-dropdown-link"
                style={{
                  display:
                    (taskType === 'T001_1' || taskType === 'T001_4') &&
                    record.operStatusName === '流程中'
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
    this.getTableData();
    this.getDictList();
    this.getProductList();
    this.getProductTypeList();
    this.getInvestManagerNameList();
  }

  getProductTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'investorConference/getProductTypeList',
      payload: {},
    });
  }

  getInvestManagerNameList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'investorConference/getInvestManagerNameList',
    });
  }

  /**
   * 方法说明 词汇字典查询
   * @method  getDictList
   */
  getDictList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `investorConference/getDicts`,
      payload: {
        codeList,
      },
    });
  };

  /**
   * 方法说明 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="investorConference:add">
        <Button
          type="primary"
          onClick={() => {
            this.accountAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
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
    this.setState(
      {
        tableList: [],
        page: 1,
        taskType: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  accountAdd = () => {
    this.props.fnLink('investorConference:add', '');
  };

  // 删除参数中的空值选项
  deleteEmptyParam(value) {
    for (const key in value) {
      if (
        value[key] === '' ||
        value[key] === null ||
        value[key] === undefined ||
        value[key] === [] ||
        value[key].length === 0
      ) {
        delete value[key];
      }
    }
  }

  /**
   * 方法说明 表格数据查询
   * @method getTableData
   */
  getTableData = () => {
    const { oField, taskType } = this.state;
    if ((taskType === 'T001_1' || taskType === 'T001_4') && oField === '') {
      this.setState(
        {
          // oField: 'taskTime',
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
  };

  getTableList = () => {
    const { dispatch } = this.props;
    const { direct, oField, page, limit, taskType, fieldsValue } = this.state;
    if (fieldsValue.proCode !== undefined) {
      fieldsValue.proCode = fieldsValue.proCode.toString();
    }
    if (fieldsValue.investmentManager !== undefined) {
      fieldsValue.investmentManager = fieldsValue.investmentManager.toString();
    }
    if (fieldsValue.status !== undefined) {
      fieldsValue.status = fieldsValue.status.toString();
    }
    if (fieldsValue.proType !== undefined) {
      fieldsValue.proType = fieldsValue.proType.toString();
    }
    this.setState({
      loading: true,
    });

    const params = {
      pageNum: page,
      pageSize: limit,
      sortType: direct,
      sortField: oField,
      taskType,
      keyWords: '',
      ...fieldsValue,
    };
    // if (params.sortType === 'ascend') {
    //   params.sortType = 'asc';
    // } else if (params.sortType === 'descend') {
    //   params.sortType = 'desc';
    // }
    this.deleteEmptyParam(params);
    dispatch({
      type: `investorConference/getTaskList`,
      payload: params,
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
        });
      }
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `investorConference/getProductDropList`,
      payload: {
        proStage: 'P002_4',
        proType: 'A002_2,A002_3',
        proStatus: 'PS001_7',
      },
    });
  };

  /**
   * 方法说明  页码change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param filters
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
        oField: sorter.order ? sorter.field : '',
      },
      () => {
        this.getTableData();
      },
    );
  };

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  // 页码change
  sizeChange = (current, size) => {
    this.setState(
      {
        page: current,
        limit: size,
      },
      () => {
        this.getTableData();
      },
    );
  };

  // 产品名称change
  proNameChange = val => {
    this.props.form.setFieldsValue({
      proCode: val,
    });
  };

  // 产品代码change
  proCodeChange = val => {
    this.props.form.setFieldsValue({
      proName: val,
    });
  };

  /**
   * 条件查询
   * @method searchBtn
   */
  handleSubmit = fieldsValue => {
    this.setState(
      {
        page: 1,
        limit: 10,
        fieldsValue: fieldsValue || {},
      },
      () => {
        this.getTableData();
      },
    );
  };

  // 重置
  handleReset = () => {
    this.setState(
      {
        page: 1,
        limit: 10,
        oField: '',
        direct: '',
        fieldsValue: {},
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param taskType {string} 页数/当前页
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 当前页
   * @param keyWords {string} 关键字
   */
  seachTableData = val => {
    const { dispatch } = this.props;
    const params = {
      pageNum: 1,
      pageSize: 10,
      taskType: this.state.taskType,
      keyWords: val,
    };
    this.setState({
      loading: true,
    });
    dispatch({
      type: `investorConference/getTaskList`,
      payload: params,
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
        });
      }
    });
  };

  /**
   * @method 选中列表
   * @param {*} selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
      batchList: selectedRows,
    });
  };

  /**
   * 批量提交
   */
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'investorConference/commitBatch',
        payload: {
          ids,
        },
      })
      .then(res => {
        if (res && res.status === 200) {
          this.getTableData();
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
   * 操作列 事件
   * @method groupOperate
   * @param record {string} 行元素
   * @param mark {string} 标记
   *
   */
  groupOperate = (record, mark) => {
    const { dispatch } = this.props;
    if (mark === 'copy') {
      this.props.fnLink('investorConference:copy', `?processInstId=${record.processInstanceId}`);
    } else if (mark === 'edit') {
      this.props.fnLink(
        'investorConference:edit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'chart') {
      dispatch(
        routerRedux.push({
          pathname: '/nativeProduct',
          query: {
            status: 'update',
            proCode: record.productCode,
          },
        }),
      );
    } else if (mark === 'handle') {
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
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processHistory?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'view') {
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'more') {
    } else if (mark === 'submit') {
      this.props.fnLink(
        'investorConference:submit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'delete') {
      this.handleDelete(record);
    } else if (mark === 'cancel') {
      this.handleCancel(record);
    }
  };

  // 删除
  handleDelete = record => {
    confirm({
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = {
          ids: record.id.split(','),
          processInstanceIds: record.processInstanceId.split(','),
        };
        this.props.dispatch({
          type: 'investorConference/deleteTable',
          payload,
          callback: res => {
            if (res && res.status == 200) {
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
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'investorConference/revokeTable',
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
   * 更多按钮操作事件
   * @method moreGroupButton
   * */
  moreGroupButton = val => {
    const { key } = val;
    if (key === '认领') {
    } else if (key === '委托') {
    } else if (key === '退回') {
    } else if (key === '移交') {
    } else if (key === '传阅') {
    } else if (key === '撤销') {
    }
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      investorConference: { opts, productDropList, productTypeList, investManagerNameList },
    } = this.props;
    const { tableList, oTotal, page, limit, loading, taskType, batchList, columns } = this.state;

    const baseTable = () => {
      return (
        <>
          <Table
            rowSelection={
              taskType === 'T001_3' || taskType === 'T001_5'
                ? null
                : {
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: this.onSelectChange,
                  }
            }
            dataSource={tableList}
            columns={columns}
            onChange={this.handleTableChange}
            pagination={false}
            loading={loading}
            scroll={{ x: columns.length * 200 + 200 }}
          />
          {tableList && tableList.length !== 0 ? (
            <Row style={{ paddingTop: 20 }}>
              <MoreOperation
                batchStyles={{ position: 'relative' }}
                opertations={{
                  tabs: taskType,
                  statusKey: 'operStatus',
                }}
                fn={this.getTableList}
                type="batch"
                batchList={batchList}
                submitCallback={this.handlerBatchSubmit}
                successCallback={this.handlerSuccessCallback}
              />
              <Pagination
                style={{ float: 'right' }}
                showSizeChanger
                showQuickJumper={oTotal > limit}
                total={oTotal}
                current={page}
                pageSize={limit}
                onShowSizeChange={this.sizeChange}
                onChange={this.sizeChange}
                showTotal={() => `共 ${oTotal} 条数据`}
              />
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };

    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1, filterOption: this.productFilterOption },
        option: productDropList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1, optionFilterProp: 'children' },
        option: productTypeList,
      },
      {
        name: 'investmentManager',
        label: '投资经理',
        type: 'select',
        readSet: { name: 'name', code: 'empNo' },
        config: { mode: 'multiple', maxTagCount: 1, optionFilterProp: 'children' },
        option: investManagerNameList,
      },
      {
        name: 'status',
        label: '产品状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1, optionFilterProp: 'children' },
        option: opts && opts.S001,
      },
    ];

    return (
      <>
        <List
          pageCode="investorConference"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskType}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handleSubmit}
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
            activeTabKey: taskType,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={<>{baseTable()}</>}
        />
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ investorConference, loading, publicModel: { publicTas } }) => ({
        investorConference,
        loading: loading.effects['investorConference/getTaskList'],
        publicTas,
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

// 信披流程   杨辉  信息披露页面
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Button,
  Dropdown,
  Form,
  Icon,
  Menu,
  message,
  Modal,
  Pagination,
  Row,
  Tabs,
  Tooltip,
} from 'antd';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import styles from './index.less';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;
const { confirm } = Modal;
const ButtonGroup = Button.Group;

class Agent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVal: [],
      pageNum: 1,
      pageSize: 10,
      taskTypeCode: props.publicTas,
      keyWords: '',
      direction: '',
      field: '',
      ischecked: false,
      selectedRows: [],
      selectedRowKeys: [],
      isForm: true,
      panes: [
        {
          key: 'T001_1',
          title: '我待办',
          name: 'page1',
        },
        // {
        //   key: 'T001_2',
        //   title: '我参与',
        //   name: 'page2',
        // },
        {
          key: 'T001_3',
          title: '我发起',
          name: 'page3',
        },
        {
          key: 'T001_4',
          title: '未提交',
          name: 'page4',
        },
        {
          key: 'T001_5',
          title: '已办理',
          name: 'page5',
        },
      ],
      batchList: [],
      searchFormData: {},
      columns: [
        {
          title: '产品简称',
          dataIndex: 'proFname',
          sorter: true,
          width: 220,
          key: 'proFname',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '产品代码',
          dataIndex: 'proCode',
          sorter: true,
          width: 150,
          key: 'proCode',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '信披事项',
          dataIndex: 'infoPublishItemName',
          sorter: true,
          width: 180,
          key: 'infoPublishItemName',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '预计披露日期',
          dataIndex: 'predictPublishDate',
          sorter: true,
          width: 150,
          key: 'predictPublishDate',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '披露对象',
          dataIndex: 'publishTargetName',
          sorter: true,
          width: 120,
          key: 'publishTargetName',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '任务到达时间',
          dataIndex: 'taskTime',
          sorter: true,
          width: 200,
          key: 'taskTime',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '状态',
          dataIndex: 'statusName',
          sorter: true,
          width: 100,
          key: 'statusName',
          ellipsis: {
            showTitle: false,
          },
          render: text => {
            return (
              <Tooltip title={text}>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                    ? '-'
                    : 0}
              </Tooltip>
            );
          },
        },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          dataIndex: 'action',
          align: 'center',
          render: (text, record) => {
            const { taskTypeCode } = this.state;
            return (
              <span>
                <Action code="messageFlow:edit">
                  <Button
                    style={{
                      display:
                        (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName === '待提交'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'edit');
                    }}
                    type="link"
                    size="small"
                  >
                    修改
                  </Button>
                </Action>
                <Action code="messageFlow:copy">
                  <Button
                    style={{
                      display:
                        (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName === '待提交' &&
                          record.fullFlag !== '1'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'copy');
                    }}
                    type="link"
                    size="small"
                  >
                    复制
                  </Button>
                </Action>
                <Action code="messageFlow:submit">
                  <Button
                    style={{
                      display:
                        (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName === '待提交'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'submit');
                    }}
                    type="link"
                    size="small"
                  >
                    提交
                  </Button>
                </Action>
                <Action code="messageFlow:delete">
                  <Button
                    style={{
                      display: record.statusName === '待提交' ? 'inline-block' : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'delete');
                    }}
                    type="link"
                    size="small"
                  >
                    删除
                  </Button>
                </Action>
                <Action code="messageFlow:handle">
                  <Button
                    style={{
                      display:
                        (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName === '流程中'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'handle');
                    }}
                    type="link"
                    size="small"
                  >
                    办理
                  </Button>
                </Action>
                <Action code="messageFlow:view">
                  <Button
                    style={{
                      display:
                        ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName === '已结束') ||
                          taskTypeCode === 'T001_3' ||
                          taskTypeCode === 'T001_5'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'view');
                    }}
                    type="link"
                    size="small"
                  >
                    详情
                  </Button>
                </Action>
                <Action code="messageFlow:history">
                  <Button
                    style={{
                      display:
                        ((taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                          record.statusName !== '待提交') ||
                          taskTypeCode === 'T001_3' ||
                          taskTypeCode === 'T001_5'
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'history');
                    }}
                    type="link"
                    size="small"
                  >
                    流转历史
                  </Button>
                </Action>
                <Action code="messageFlow:cancel">
                  <Button
                    style={{
                      display:
                        record.statusName === '流程中' && record.revoke == 1
                          ? 'inline-block'
                          : 'none',
                    }}
                    onClick={() => {
                      this.groupOperate(record, 'cancel');
                    }}
                    type="link"
                    size="small"
                  >
                    撤销
                  </Button>
                </Action>

                {/* <Dropdown overlay={this.HandleGetMenu(val, record)} trigger={['click']}> */}
                {/* <Action code="messageFlow:more"> */}
                <Button
                  className="ant-dropdown-link"
                  style={{
                    display:
                      (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') &&
                        record.statusName === '流程中'
                        ? 'inline-block'
                        : 'none',
                  }}
                  type="link"
                  size="small"
                // onClick={this.groupOperate(record, 'more')}
                >
                  {/* 更多 */}
                  <MoreOperation record={record} fn={this.getTableList} isHideSkip={true} />
                </Button>
                {/* </Action> */}
                {/* </Dropdown> */}
              </span>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.getProductList();
    this.getProductTypeList();
    this.getInvestmentManagerList();
    this.props.dispatch({
      type: 'messageFlow/getDicts',
      payload: ['S001', 'A002', 'X011', 'X012'],
    });
  }

  getProductTypeList = () => {
    this.props.dispatch({
      type: 'messageFlow/getProductTypeList',
      payload: {},
    });
  };

  getInvestmentManagerList = () => {
    this.props.dispatch({
      type: 'messageFlow/getInvestmentManagerList',
      payload: {},
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `messageFlow/getProductDropList`,
    });
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
   * @method  handleGetTableList 请求table的数据
   */
  handleGetTableList = () => {
    if (
      (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') &&
      this.state.field === ''
    ) {
      this.setState(
        {
          // field: 'taskTime',
          // direction: 'desc'
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

  getTableList = () => {
    const {
      pageNum,
      pageSize,
      taskTypeCode,
      keyWords,
      direction,
      field,
      searchFormData,
    } = this.state;
    const formItems = searchFormData;
    if (formItems && formItems.predictPublishDate) {
      formItems.predictPublishDateStart =
        formItems.predictPublishDate && formItems.predictPublishDate.length
          ? formItems.predictPublishDate[0].format('YYYY-MM-DD')
          : '';
      formItems.predictPublishDateEnd =
        formItems.predictPublishDate && formItems.predictPublishDate.length
          ? formItems.predictPublishDate[1].format('YYYY-MM-DD')
          : '';
      delete formItems.predictPublishDate;
    }
    const params = {
      pageNum,
      pageSize,
      taskTypeCode,
      direction,
      field,
      keyWords,
      ...formItems,
    };
    // publishTargetName infoPublishItemName
    if (params.field === 'proTypeName') {
      params.field = 'proType';
    }
    if (params.field === 'publishTargetName') {
      params.field = 'publishTarget';
    }
    if (params.field === 'infoPublishItemName') {
      params.field = 'infoPublishItem';
    }
    if (params.field === 'statusName') {
      params.field = 'status';
    }
    if (params.field === 'investManagerNames') {
      params.field = 'investManager';
    }
    if (params.direction === 'ascend') {
      params.direction = 'asc';
    } else if (params.direction === 'descend') {
      params.direction = 'desc';
    }
    this.deleteEmptyParam(params);
    this.props.dispatch({
      type: 'messageFlow/handleQueryTableData',
      payload: params,
    });
  };

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch = val => {
    const { pageNum, pageSize, taskTypeCode } = this.state;
    this.setState({ keyWords: val, pageNum: 1 });
    const params = {
      pageNum: 1,
      pageSize,
      taskTypeCode,
      keyWords: val,
    };
    this.props.dispatch({
      type: 'messageFlow/handleQueryTableData',
      payload: params,
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
        direction: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
        field: sorter.order ? sorter.field : '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  // 页码change
  sizeChange = (current, size) => {
    this.setState(
      {
        pageNum: current,
        pageSize: size,
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * @method handleSetTaskTime 切换类别
   * @param key taskTime值
   */
  handleSetTaskTime = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.props.form.resetFields();

    // const { pageNum, pageSize, taskTypeCode } = this.state;
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
   * @method handleRowSelectChange checkbox触发
   * @param selectedRowKeys
   * @param selectedRows
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { tableVal } = this.state;
    let ischecked = false;
    tableVal.length === selectedRowKeys.length ? (ischecked = true) : (ischecked = false);

    this.setState({
      selectedRowKeys,
      selectedRows,
      ischecked,
      batchList: selectedRows,
    });
  };

  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions = () => {
    this.setState(state => ({
      isForm: !state.isForm,
      keyWords: '',
    }));
  };

  /**
   * @method handleSearchBtn 详细搜索
   */
  handlerSearch = fieldsValue => {
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        searchFormData: fieldsValue,
        keyWords: '',
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
        pageNum: 1,
        pageSize: 10,
        searchFormData: {},
        direction: '',
        field: '',
        keyWords: '',
      },
      () => {
        this.handleGetTableList();
      },
    );
  };

  /**
   * 新增跳转
   * @method editTask
   * @param type  add/edit 新增还是编辑
   */
  editTask() {
    this.props.fnLink('messageFlow:add', '');
  }

  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
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
   * 批量提交
   * @param {*} list
   */
  handlerBatchSubmit = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    this.props
      .dispatch({
        type: 'messageFlow/commitBatch',
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
      ischecked: false,
    });
  };

  /**
   * @method renderColActions
   */
  renderColActions = (colActions, text, record) => {
    return (
      <ButtonGroup>
        {colActions.map(btn =>
          btn.text === '更多' ? (
            this.actionButtonMore(record)
          ) : (
            <Action key={`messageFlow:${btn.flag}`} code={`messageFlow:${btn.flag}`}>
              <Button onClick={() => btn.onClick(record)} type="link" size="small">
                {btn.text}
              </Button>
            </Action>
          ),
        )}
      </ButtonGroup>
    );
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
        <Button type="link">
          更多
          <Icon type="down" style={{ marginLeft: 0 }} />
        </Button>
      </Dropdown>
    );
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

  /**
   * 操作列 事件
   * @method groupOperate
   * @param record {string} 行元素
   * @param mark {string} 标记
   *
   */
  groupOperate(record, mark) {
    const { dispatch } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
      id: record.id,
      proCode: record.proCode,
      processDefinitionKey: 'h31ab659dc914eb08b3df3620785ecc6',// 添加流程key，为了在用印登记的时候，过滤审批人（卢凯）使用
      infoPublishItem: record.infoPublishItem, // 添加infoPublishItem（信披事项），当信披事项为投资经理变更时，审批人是陈嘉斌；其他的信披事项，仍需要卢凯审批，陈没有权限
    };
    if (mark === 'copy') {
      this.props.fnLink('messageFlow:copy', `?processInstId=${record.processInstanceId}`);
    } else if (mark === 'edit') {
      this.props.fnLink(
        'messageFlow:edit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&fullFlag=${record.fullFlag}`,
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
      params.mode = 'deal';
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: { ...params },
        }),
      );
    } else if (mark === 'view') {
      dispatch(
        routerRedux.push({
          pathname: `/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`,
        }),
      );
    } else if (mark === 'history') {
      handleShowTransferHistory(record);
    } else if (mark === 'more') {
    } else if (mark === 'submit') {
      this.props.fnLink(
        'messageFlow:submit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}&fullFlag=${record.fullFlag}`,
      );
    } else if (mark === 'delete') {
      this.handleDelete(record);
    } else if (mark === 'cancel') {
      this.handleCancel(record);
    }
  }

  // 删除
  handleDelete = record => {
    confirm({
      content: '请确认是否删除?',
      closable: true,
      onOk: () => {
        const payload = {
          ids: record.id.split(','),
        };
        this.props.dispatch({
          type: 'messageFlow/deleteTable',
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
      content: '请确认是否撤销?',
      closable: true,
      onOk: () => {
        const payload = {
          processInstanceId: record.processInstanceId,
        };
        this.props.dispatch({
          type: 'messageFlow/revokeTable',
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

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const { selectedRowKeys, pageNum, pageSize, taskTypeCode, batchList, columns } = this.state;
    const {
      messageFlow: { tableList },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const {
      messageFlow: { opts, productDropList, productTypeList, investmentManagerList },
    } = this.props;
    // 搜索组件配置
    const formItemData = [
      {
        name: 'proCodeList',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productDropList,
      },
      // {
      //   name: 'proTypeList',
      //   label: '产品类型',
      //   type: 'select',
      //   readSet: { name: 'label', code: 'value' },
      //   config: { mode: 'tags' },
      //   option: productTypeList,
      // },
      // {
      //   name: 'investManagerList',
      //   label: '投资经理',
      //   type: 'select',
      //   readSet: { name: 'name', code: 'empNo' },
      //   config: { mode: 'tags' },
      //   option: investmentManagerList,
      // },
      {
        name: 'statusCodes',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: opts.S001,
      },
      {
        name: 'infoPublishItemList',
        label: '信披事项',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: opts.X011,
      },
      {
        name: 'predictPublishDate',
        label: '预计披露日期',
        type: 'RangePicker',
      },
      {
        name: 'publishTargetList',
        label: '披露对象',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: opts.X012,
      },
    ];
    return (
      <>
        <List
          pageCode="messageFlow"
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
          fuzzySearch={this.handleBlurSearch}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '我待办' },
              { key: 'T001_3', tab: '我发起' },
              { key: 'T001_4', tab: '未提交' },
              { key: 'T001_5', tab: '已办理' },
            ],
            activeTabKey: taskTypeCode,
            onTabChange: this.handleSetTaskTime,
          }}
          extra={
            <Action code="messageFlow:add">
              <Button type="primary" onClick={() => this.editTask()} className={styles.addBtn}>
                发起流程
              </Button>
            </Action>
          }
          tableList={
            <>
              <Table
                pagination={false}
                rowSelection={
                  taskTypeCode === 'T001_3' || taskTypeCode === 'T001_5' ? null : rowSelection
                }
                columns={columns}
                dataSource={tableList?.rows}
                onChange={this.handleTableChange}
                scroll={{ x: true }}
                loading={this.props.loading}
              />
              {tableList?.rows && tableList?.rows?.length !== 0 && (
                <Row style={{ paddingTop: 20 }}>
                  <MoreOperation
                    batchStyles={{ position: 'relative' }}
                    opertations={{
                      tabs: taskTypeCode,
                      statusKey: 'status',
                    }}
                    fn={this.getTableList}
                    type="batch"
                    batchList={batchList}
                    isHideSkip={true}
                    submitCallback={this.handlerBatchSubmit}
                    successCallback={this.handlerSuccessCallback}
                  />
                  <Pagination
                    style={{ float: 'right' }}
                    showSizeChanger
                    showQuickJumper={tableList?.total > pageSize}
                    pageSizeOptions={['10', '20', '30', '40']}
                    current={pageNum}
                    pageSize={pageSize}
                    total={tableList?.total}
                    onShowSizeChange={this.sizeChange}
                    onChange={this.sizeChange}
                    showTotal={() => `共 ${tableList?.total} 条数据`}
                  />
                </Row>
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
      connect(({ messageFlow, loading, publicModel: { publicTas } }) => ({
        messageFlow,
        publicTas,
        loading: loading.effects['messageFlow/handleQueryTableData'],
      }))(Agent),
    ),
  ),
);

export default WrappedSingleForm;

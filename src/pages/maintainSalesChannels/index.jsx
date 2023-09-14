// 维护销售渠道页面

import React, { Component } from 'react';
import { Button, Form, Modal, Pagination, Row, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import { handleTableCss } from '../manuscriptBasic/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

/* S001状态 */
const dictList = {
  codeList: 'S001',
};

@Form.create()
class SalesChannel extends Component {
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
    batchList: [],
    batchObj: {},
    selectedRowKeys: [],
    // checkedArr: [],
    fieldsValue: {},
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        key: 'proName',
        width: 400,
        render: text => {
          return (
            <Tooltip title={text}>
              <span>
                {text
                  ? text.toString().replace(/null/g, '-')
                  : text === '' || text === undefined
                  ? '-'
                  : 0}
              </span>
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        // sorter: true,
        // width: 200,
        key: 'proCode',
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '产品类型',
        dataIndex: 'proType',
        sorter: true,
        // width: 200,
        key: 'proType',
        render: (_, record) => {
          return (
            <Tooltip title={record.proTypeName} placement="topLeft">
              <span
                style={{
                  width: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  paddingTop: '5px',
                }}
              >
                {record.proTypeName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '销售机构名称',
        dataIndex: 'sellerNameFull',
        key: 'sellerNameFull',
        // sorter: true,
        width: 400,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '任务到达时间',
        dataIndex: 'taskTime',
        sorter: true,
        key: 'taskTime',
        ...tableRowConfig,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        width: 180,
        ellipsis: true,
        render: (_, record) => {
          return (
            <Tooltip title={record.statusName} placement="topLeft">
              <span
                style={{
                  width: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  paddingTop: '5px',
                }}
              >
                {record.statusName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (text, record) => {
          const { taskTypeCode } = this.state;
          if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
            // 待提交
            if (taskTypeCode === 'T001_1' && record.circulateFlag === '0') {
              // return this.renderColActions(reads, text, record);
              return (
                <a
                  style={{ marginRight: '10px' }}
                  onClick={() => this.groupOperate(record, 'read')}
                >
                  审阅
                </a>
              );
            }
            if (record.status === 'S001_1') {
              return this.renderColActions(moreActions, text, record);
            }
            if (record.status === 'S001_2') {
              // 流程中
              if (record.revoke === 1 || record.revoke === '1') {
                return this.renderColActions(joinedActions, text, record);
              }
              return this.renderColActions(revoke, text, record);
            }
            if (record.status === 'S001_3') {
              return this.renderColActions(initActions, text, record);
            }
          } else {
            if (record.status === 'S001_2' && (record.revoke === 1 || record.revoke === '1')) {
              return this.renderColActions(launch, text, record);
            }
            return this.renderColActions(initActions, text, record);
          }
        },
      },
    ],
  };

  componentDidMount() {
    this.getTableDataList();
    this.getproTypeList();
    this.getDictList();
    this.getProductList();
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
   * @param query {string}
   */
  getTableDataList(query) {
    const { dispatch } = this.props;
    const { direct, oField, page, limit, taskTypeCode, fieldsValue } = this.state;
    if (query) {
      this.setState({
        page: 1,
        limit: 10,
      });
    }
    const params = {
      pageNum: page,
      pageSize: limit,
      taskTypeCode,
      keyWords: this.state.keyWords,
      ...fieldsValue,
    };
    if (query === 'sorter') {
      params.direction = direct;
      params.field = oField;
    }
    if (query) {
      delete params.keyWords;
      params.pageNum = 1;
      params.pageSize = 10;
    }
    if (params.direction === 'ascend') {
      params.direction = 'asc';
    } else if (params.direction === 'descend') {
      params.direction = 'desc';
    }
    dispatch({
      type: `maintainSalesChannels/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
          loading: false,
        });
      }
    });
  }

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
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   * @param menuCode {string} 菜单
   */
  getProductList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'maintainSalesChannels',
    };
    dispatch({
      type: `maintainSalesChannels/queryProductList`,
      payload: params,
    });
  }

  /**
   * 方法说明  产品类型查询
   * @method getProductTypeList
   * @param menuCode {string} 菜单
   */
  getproTypeList() {
    const { dispatch } = this.props;
    const params = {
      menuCode: 'maintainSalesChannels',
    };
    dispatch({
      type: `maintainSalesChannels/handleProductTypeList`,
      payload: params,
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
      type: `maintainSalesChannels/queryCriteria`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

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
        page: 1,
        limit: 10,
        tableList: [],
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  /**
   * 方法说明  排序change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param sorter {string} 排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order,
        oField: sorter.field,
      },
      () => {
        this.getTableDataList('sorter');
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

  /**
   * 方法说明 模糊搜索
   * @method keyWordsSearch
   * @param val
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

  /**
   * @method 展开搜索框
   */
  openConditions = () => {
    const { isOpenFrame } = this.state;
    this.setState({
      isOpenFrame: !isOpenFrame,
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
            <Action code={btn.code}>
              <a style={{ marginRight: '10px' }} onClick={() => btn.onClick(record)}>
                {btn.text}
              </a>
            </Action>
          ),
        )}
      </>
    );
  };

  // 撤销
  handleCanBackOut(record) {
    Modal.confirm({
      title: '请确认是否撤销?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'maintainSalesChannels/getRevokeFunc',
          payload: record.processInstanceId,
        }).then(data => {
          if (data) {
            this.getTableDataList();
          }
        });
      },
    });
  }

  // 删除
  deleteInfo(record) {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'maintainSalesChannels/getDeleteFunc',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getTableDataList();
          }
        });
      },
    });
  }

  /**
   * 操作列 事件
   * @method groupOperate
   */
  groupOperate(record, mark) {
    const { dispatch, fnLink } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
    };
    if (mark === 'edit') {
      //   console.log('修改');
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/dynamicPage/pages/4028e7b67443dc6e01748a52699d006d/维护销售渠道',
      //     query: {
      //       // type: 'edit',
      //       id: record.id,
      //     },
      //   }),
      // );
      fnLink(
        'maintainSalesChannels:update',
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
      //   console.log('流程图');
    } else if (mark === 'handle') {
      // 办理
      params.mode = 'deal';
      params.id = record.id;
      (params.proCode = record.proCode),
        dispatch(
          routerRedux.push({
            pathname: '/processCenter/taskDeal',
            query: { ...params },
          }),
        );
    } else if (mark === 'history') {
      // 流转历史
      handleShowTransferHistory(record);
    } else if (mark === 'more') {
      //   console.log('更多');
    } else if (mark === 'submit') {
      fnLink(
        'maintainSalesChannels:commit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'look') {
      // 详情
      this.props.dispatch(
        routerRedux.push({
          pathname: '/processCenter/processDetail',
          query: {
            processInstanceId: record.processInstanceId,
            nodeId: record.taskDefinitionKey,
            taskId: record.taskId,
          },
        }),
      );
    } else if (mark === 'copy') {
      // 复制
      fnLink('maintainSalesChannels:copy', `?processInstId=${record.processInstanceId}`);
    } else if (mark === 'read') {
      // 审阅
      this.props.dispatch(
        routerRedux.push({
          pathname: '/processCenter/taskDeal',
          query: {
            id: record.taskId,
            taskId: record.taskId,
            processInstanceId: record.processInstanceId,
            processDefinitionId: record.processDefinitionId,
            taskDefinitionKey: record.taskDefinitionKey,
            mode: 'review',
          },
        }),
      );
    }
  }

  /**
   * 批量操作
   * @method actionButton
   */
  // actionButton = () => {
  //   return (
  //     <Dropdown
  //       overlay={
  //         <Menu onClick={this.moreGroupButton}>
  //           <Menu.Item key="0">提交</Menu.Item>
  //           <Menu.Item key="0">认领</Menu.Item>
  //           <Menu.Item key="1">委托</Menu.Item>
  //           <Menu.Item key="2">退回</Menu.Item>
  //           <Menu.Item key="3">移交</Menu.Item>
  //           {/* <Menu.Item key="4">传阅</Menu.Item> */}
  //         </Menu>
  //       }
  //       placement="topLeft"
  //     >
  //       <Button style={{ marginRight: 10, width: 100, height: 26 }}>批量操作</Button>
  //     </Dropdown>
  //   );
  // };

  // 重置
  handleReset = () => {
    this.setState(
      {
        oField: '',
        page: 1,
        limit: '10',
        fieldsValue: {},
        keyWords: '',
      },
      () => {
        this.getTableDataList('query');
      },
    );
  };

  /**
   * 发起流程
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="maintainSalesChannels:link">
        <Button
          type="primary"
          onClick={() => {
            this.salesChannelAdd();
          }}
        >
          发起流程
        </Button>
      </Action>
    );
  };

  salesChannelAdd = () => {
    const { fnLink } = this.props;
    fnLink('maintainSalesChannels:link', '');
  };

  /* *
   * 更多按钮操作事件
   * @method moreGroupButton
   * */
  moreGroupButton = val => {
    const { key } = val;
    if (key === '0') {
      //   console.log('认领');
    } else if (key === '1') {
      //   console.log('委托');
    } else if (key === '2') {
      //   console.log('退回');
    } else if (key === '3') {
      //   console.log('移交');
    } else if (key === '4') {
      //   console.log('传阅');
    }
  };

  /**
   * 更多
   * @method actionButtonMore
   */
  actionButtonMore = record => {
    return (
      // <Dropdown
      //   overlay={
      //     <Menu onClick={this.moreGroupButton}>
      //       <Menu.Item key="0">认领</Menu.Item>
      //       <Menu.Item key="1">委托</Menu.Item>
      //       <Menu.Item key="2">退回</Menu.Item>
      //       <Menu.Item key="3">移交</Menu.Item>
      //       <Menu.Item key="4">传阅</Menu.Item>
      //       <Menu.Item key="5" onClick={() => this.handleCanBackOut(record)}>
      //         撤销
      //       </Menu.Item>
      //     </Menu>
      //   }
      //   trigger={['click']}
      // >
      //   <Button type="link">
      //     更多
      //     <Icon type="down" />
      //   </Button>
      // </Dropdown>
      <MoreOperation record={record} fn={this.handleGetTableList} />
    );
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      maintainSalesChannels: { statusList, proTypeList, productList },
    } = this.props;

    const { tableList, oTotal, page, taskTypeCode, selectedRowKeys, columns } = this.state;

    const moreActions = [
      {
        text: '修改',
        onClick: record => this.groupOperate(record, 'edit'),
        code: 'maintainSalesChannels:update',
      },
      {
        text: '复制',
        onClick: record => this.groupOperate(record, 'copy'),
        code: 'maintainSalesChannels:copy',
      },
      {
        text: '提交',
        onClick: record => this.groupOperate(record, 'submit'),
        code: 'maintainSalesChannels:commit',
      },
      // {
      //   text: '流程图',
      //   onClick: record => this.groupOperate(record, 'chart'),
      //   code: 'maintainSalesChannels:processImage',
      // },
      {
        text: '删除',
        onClick: record => this.deleteInfo(record),
        code: 'maintainSalesChannels:delete',
      },
    ];

    const joinedActions = [
      {
        text: '办理',
        onClick: record => this.groupOperate(record, 'handle'),
        code: 'maintainSalesChannels:check',
      },
      {
        text: '流转历史',
        onClick: record => this.groupOperate(record, 'history'),
        code: 'maintainSalesChannels:transferHistory',
      },
      {
        text: '撤销',
        onClick: record => this.handleCanBackOut(record),
        code: 'maintainSalesChannels:cancel',
      },
      {
        text: '更多',
        onClick: record => this.groupOperate(record, 'more'),
        code: 'maintainSalesChannels:more',
      },
    ];
    const revoke = [
      {
        text: '办理',
        onClick: record => this.groupOperate(record, 'handle'),
        code: 'maintainSalesChannels:check',
      },
      {
        text: '流转历史',
        onClick: record => this.groupOperate(record, 'history'),
        code: 'maintainSalesChannels:transferHistory',
      },
      {
        text: '更多',
        onClick: record => this.groupOperate(record, 'more'),
        code: 'maintainSalesChannels:more',
      },
    ];

    const launch = [
      {
        text: '详情',
        onClick: record => this.groupOperate(record, 'look'),
        code: 'maintainSalesChannels:details',
      },
      {
        text: '流转历史',
        onClick: record => this.groupOperate(record, 'history'),
        code: 'maintainSalesChannels:transferHistory',
      },
      {
        text: '撤销',
        onClick: record => this.handleCanBackOut(record),
        code: 'maintainSalesChannels:cancel',
      },
    ];

    const initActions = [
      {
        text: '详情',
        onClick: record => this.groupOperate(record, 'look'),
        code: 'maintainSalesChannels:details',
      },
      {
        text: '流转历史',
        onClick: record => this.groupOperate(record, 'history'),
        code: 'maintainSalesChannels:transferHistory',
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        const { page } = this.state;
        this.state.batchObj = { ...this.state.batchObj, [page]: selectRows };
        this.setState(
          {
            selectedRowKeys,
          },
          () => {
            let tempList = [];
            for (const key in this.state.batchObj) {
              if (this.state.batchObj.hasOwnProperty(key)) {
                const element = this.state.batchObj[key];
                tempList = tempList.concat(element);
              }
            }
            this.setState({
              batchList: tempList,
            });
          },
        );
      },
    };

    const handlerBatchSubmit = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'maintainSalesChannels/batchSubm',
        payload: this.state.batchList.map(item => item.id),
      }).then(data => {
        if (data) {
          handlerSuccessCallback();
          this.getTableDataList();
        }
      });
    };

    // 批量处理成功以后的回调
    const handlerSuccessCallback = () => {
      this.setState({
        selectedRowKeys: [],
        batchList: [],
        batchObj: {},
      });
    };

    const baseTable = () => {
      const { loading } = this.props;
      return (
        <>
          <Table
            rowSelection={rowSelection}
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: columns.length * 200 + 520 }}
            onChange={this.handleTableChange}
            loading={loading}
            rowKey="taskId"
          />
          {tableList && tableList.length !== 0 ? (
            <Row style={{ paddingTop: 20 }}>
              <Pagination
                style={{ float: 'right' }}
                showSizeChanger
                showQuickJumper={oTotal > 10}
                pageSizeOptions={['10', '20', '30', '40']}
                current={page}
                total={oTotal}
                onShowSizeChange={this.sizeChange}
                onChange={this.sizeChange}
                showTotal={() => `共 ${oTotal} 条数据`}
              />
              {/* <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">提交</Menu.Item>
                    <Menu.Item key="1">认领</Menu.Item>
                    <Menu.Item key="2">委托</Menu.Item>
                    <Menu.Item key="3">退回</Menu.Item>
                    <Menu.Item key="4">移交</Menu.Item>
                  </Menu>
                }
                placement="topLeft"
              >
                <Button style={{ marginRight: 10, width: 100, height: 26 }}>批量操作</Button>
              </Dropdown> */}
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };

    const formItemData = [
      {
        name: 'proCodeList',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productList,
      },
      {
        name: 'proTypeList',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: proTypeList,
      },
      {
        name: 'statusCodes',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: statusList,
      },
    ];

    return (
      <div>
        <List
          pageCode="maintainSalesChannels"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={fieldsValue => {
            this.setState({ fieldsValue }, () => this.getTableDataList('query'));
          }}
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
            activeTabKey: taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {baseTable()}
              <MoreOperation
                batchStyles={{ float: 'left', marginTop: '-34px', marginLeft: '10px' }}
                opertations={{
                  tabs: taskTypeCode,
                  statusKey: 'status',
                }}
                fn={this.getTableDataList}
                type="batch"
                batchList={this.state.batchList}
                submitCallback={handlerBatchSubmit}
                successCallback={handlerSuccessCallback}
              />
            </>
          }
        />
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ maintainSalesChannels, loading, publicModel: { publicTas } }) => ({
        maintainSalesChannels,
        publicTas,
        loading: loading.effects['maintainSalesChannels/handleTableDataList'],
      }))(SalesChannel),
    ),
  ),
);

export default WrappedSingleForm;

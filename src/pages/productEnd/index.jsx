// 产品终止页面
import React, { Component } from 'react';
import { Button, Form, Menu, Modal, Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import MoreOperation from '@/components/moreOperation';
import styles from './index.less';
import { handleTableCss } from '../manuscriptBasic/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { TabPane } = Tabs;

@linkHoc()
@errorBoundary
@connect(({ loading, productEnd, publicModel: { publicTas } }) => ({
  tableLoading: loading.effects['productEnd/queryTableList'],
  productEnd,
  publicTas,
}))
@Form.create()
export default class Index extends Component {
  state = {
    expand: false,
    taskTypeCode: this.props.publicTas,
    keyWords: '',
    formValues: {},
    pageSize: 10,
    currentPage: 1,
    ischecked: false,
    checkedArr: [],
    direction: '',
    field: '',
    selectedRowKeys: [],
    batchList: [],
    batchObj: {},
    searchFormData: {},
    columns: [
      {
        title: '产品全称',
        dataIndex: 'proName',
        key: 'proName',
        sorter: true,
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
        key: 'proCode',
        width: 200,
        dataIndex: 'proCode',
        title: '产品代码',
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        key: 'proType',
        dataIndex: 'proType',
        title: '产品类型',
        width: 200,
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        key: 'proSdate',
        width: 200,
        dataIndex: 'proSdate',
        title: '产品终止日期',
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        key: 'causeTermination',
        width: 200,
        dataIndex: 'causeTermination',
        title: '终止原因',
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        key: 'taskTime',
        width: 200,
        dataIndex: 'taskTime',
        title: '任务到达时间',
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        sorter: true,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => {
          // 待提交 S001_1   流程中S001_2  已结束 S001_3
          const { taskTypeCode } = this.state;
          const menu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                  认领
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                  委托
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  撤回
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  移交
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  传阅
                </a>
              </Menu.Item>
            </Menu>
          );
          let content;
          if (taskTypeCode === 'T001_1' || taskTypeCode === 'T001_4') {
            switch (record.checked) {
              case 'S001_1':
                content = (
                  <>
                    <Action code="productEnd:update">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'edit')}
                      >
                        修改
                      </a>
                    </Action>
                    <Action code="productEnd:copy">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'copy')}
                      >
                        复制
                      </a>
                    </Action>
                    <Action code="productEnd:commit">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'submit')}
                      >
                        提交
                      </a>
                    </Action>
                    <Action code="productEnd:delete">
                      <a onClick={() => this.deleteInfo(record)}>删除</a>
                    </Action>
                  </>
                );
                break;
              case 'S001_2':
                content = (
                  <>
                    <Action code="productEnd:check">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'handle')}
                      >
                        {' '}
                        办理{' '}
                      </a>
                    </Action>
                    <Action code="productEnd:transferHistory">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'history')}
                      >
                        流转历史
                      </a>
                    </Action>
                    {this.revokeShow(record)}
                    <MoreOperation record={record} fn={this.initTableData} />
                  </>
                );
                break;
              case 'S001_3':
                content = (
                  <>
                    <Action code="productEnd:details">
                      <a
                        className={styles.operationBtn}
                        onClick={() => this.dealTask(record, 'details')}
                      >
                        详情
                      </a>
                    </Action>
                    <Action code="productEnd:transferHistory">
                      <a onClick={() => this.dealTask(record, 'history')}>流转历史</a>
                    </Action>
                  </>
                );
            }
          } else {
            content = (
              <>
                <Action code="productEnd:details">
                  <a
                    className={styles.operationBtn}
                    onClick={() => this.dealTask(record, 'details')}
                  >
                    详情
                  </a>
                </Action>
                <Action code="productEnd:transferHistory">
                  <a
                    className={styles.operationBtn}
                    onClick={() => this.dealTask(record, 'history')}
                  >
                    流转历史
                  </a>
                </Action>
                {this.revokeShow(record)}
              </>
            );
          }
          return content;
        },
      },
    ],
  };

  componentDidMount() {
    this.initSelectOptions();
    this.initTableData();
    this.getProductList();
    this.getProductType();
  }

  /**
   * 初始化表格数据
   */
  initTableData = () => {
    const { dispatch } = this.props;
    const { pageSize, currentPage } = this.state;
    dispatch({
      type: 'productEnd/queryTableList',
      payload: {
        params: {
          // keyWords: '',
          pageNum: currentPage,
          pageSize,
          taskTypeCode: this.state.taskTypeCode,
          // proType: '',
          // status: '',
          // proName: '',
          // proCode: '',
        },
      },
    });
  };

  /**
   * 初始化下拉框数据
   */
  initSelectOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productEnd/getDicts',
      payload: { codeList: ['A002', 'S001'] },
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productEnd/queryProductList`,
    });
  }

  /**
   * 方法说明  产品类型
   * @method   getProductType
   */
  getProductType() {
    const { dispatch } = this.props;
    dispatch({
      type: `productEnd/productType`,
    });
  }

  /**
   * 发起流程 跳转产品终止模板页面
   */
  initiateProcess = () => {
    this.props.fnLink('productEnd:link', '');
  };

  /**
   * tab bar上的操作按钮
   * @returns {jsx}
   */
  setOperations() {
    return (
      <Action code="productEnd:link">
        <Button type="primary" onClick={this.initiateProcess}>
          发起流程
        </Button>
      </Action>
    );
  }

  /**
   * 切换Tab页签
   * @param key
   */
  changeTabs = key => {
    this.props.dispatch({
      type: 'publicModel/setPublicTas',
      payload: key,
    });
    this.setState(
      {
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  // 查询触发的函数 获取表单中的所有查询条件 然后调用getTableData  请求数据
  // handleSearch = e => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (err) {
  //       return;
  //     }
  //     // values 就是form中的所有值 是一个Object
  //     const formValues = { ...values };
  //     formValues.proType = formValues.proType ? formValues.proType.join() : '';
  //     // formValues.proCode = formValues.proCode ? formValues.proCode.join() : '';
  //     formValues.proName = formValues.proName ? formValues.proName.join() : '';
  //     this.setState({ formValues }, () => {
  //       this.getTableData('9');
  //     });
  //   });
  // };

  /**
   *查询表格数据
   */
  getTableData(val) {
    const {
      keyWords,
      pageSize,
      currentPage,
      taskTypeCode,
      direction,
      field,
      searchFormData,
    } = this.state;
    if (searchFormData.proType) {
      searchFormData.proType = searchFormData.proType.toString();
    }
    if (searchFormData.status) {
      searchFormData.status = searchFormData.status.toString();
    }
    const params = {
      // keyWords,
      pageNum: currentPage,
      pageSize,
      taskTypeCode,
      ...searchFormData,
    };
    if (!val) {
      params.keyWords = keyWords;
    }
    if (val === 'query') {
      (params.pageNum = 1), (params.pageSize = 10);
      this.setState({
        currentPage: 1,
        pageSize: 10,
      });
    }
    if (direction || field) {
      (params.direction = direction), (params.field = field);
    }
    this.props.dispatch({
      type: 'productEnd/queryTableList',
      payload: {
        params,
      },
    });
  }

  /**
   * 条件查询
   * @method searchBtn
   */

  handlerSearch = fieldsValue => {
    this.setState(
      {
        searchFormData: fieldsValue || {},
        pageNum: 1,
        keyWords: '',
      },
      () => {
        this.getTableData('query');
      },
    );
  };

  /**
   * 搜索条件置空
   */
  handleReset = () => {
    this.setState(
      {
        searchFormData: {},
        pageNum: 1,
        field: '',
        direction: '',
        keyWords: '',
      },
      () => {
        this.getTableData('query');
      },
    );
  };

  /**
   *
   * @param record
   */
  handelBanli(record) {
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
      mode: 'deal',
    };
    this.props.dispatch(
      routerRedux.push({
        pathname: '/processCenter/taskDeal',
        query: { ...params },
      }),
    );
  }

  /**
   *
   * @param keywords 关键字 (系列/产品全称、系列号/产品代码)
   */
  changeKeyWords = keywords => {
    this.setState(
      {
        currentPage: 1,
        pageSize: 10,
        keyWords: keywords,
      },
      () => {
        this.getTableData();
      },
    );
  };

  /**
   * 每页条数更改
   * @param current 当前页
   * @param size  每页条数
   */
  handleShowSizeChange = (current, size) => {
    this.setState({ currentPage: 1, pageSize: size }, () => {
      this.getTableData();
    });
  };

  /**
   * 页码切换
   * @param page 当前页
   */
  handlePageNumChange = page => {
    this.setState({ currentPage: page }, () => this.getTableData());
  };

  /**
   * 选择框
   * @method rowSelection
   */

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        direction: sorter.order === 'ascend' ? 'asc' : 'desc',
        field: sorter.field,
      },
      () => {
        this.getTableData();
      },
    );
  };

  // 判断撤销按钮是否显示
  revokeShow(record) {
    if (record.checked === 'S001_2') {
      if (record.revoke === 1 || record.revoke === '1') {
        return (
          <>
            <Action code="productEnd:cancel">
              <a className={styles.operationBtn} onClick={() => this.handleCanBackOut(record)}>
                撤销
              </a>
            </Action>
          </>
        );
      }
    }
  }

  // 撤销
  handleCanBackOut(record) {
    Modal.confirm({
      title: '请确认是否撤销?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'productEnd/getRevokeFunc',
          payload: record.processInstanceId,
        }).then(data => {
          if (data) {
            this.getTableData();
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
          type: 'productEnd/getDeleteFunc',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getTableData();
          }
        });
      },
    });
  }

  dealTask(record, mark) {
    const { dispatch, fnLink } = this.props;
    const params = {
      taskId: record.taskId,
      processDefinitionId: record.processDefinitionId,
      processInstanceId: record.processInstanceId,
      taskDefinitionKey: record.taskDefinitionKey,
    };
    if (mark === 'handle') {
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
    } else if (mark === 'edit') {
      // 修改
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/dynamicPage/pages/4028e7b6736092490173a3f986630059/产品终止流程发起页面',
      //     query: {
      //       // type: 'edit',
      //       id: record.id,
      //     },
      //   }),
      // );
      fnLink(
        'productEnd:update',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'submit') {
      // 提交
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/dynamicPage/pages/4028e7b6736092490173a3f986630059/产品终止流程发起页面',
      //     query: {
      //       // type: 'submit',
      //       id: record.id,
      //     },
      //   }),
      // );
      fnLink(
        'productEnd:commit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'history') {
      // 流转历史
      handleShowTransferHistory(record);
    } else if (mark === 'details') {
      // 详情
      dispatch(
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
      // 复制功能
      fnLink('productEnd:copy', `?processInstId=${record.processInstanceId}`);
      // dispatch(
      //   routerRedux.push({
      //     pathname: `/dynamicPage/pages/产品终止/4028e7b676216e1b0176274f24820002/复制?processInstId=${record.processInstanceId}`,
      //   }),
      // );
    }
  }

  /**
   * 批量操作点击时候的回调
   */
  handlerBatchSubmit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productEnd/batchSubm',
      payload: this.state.batchList.map(item => item.id),
    }).then(data => {
      if (data) {
        this.handlerSuccessCallback();
        this.getTableData();
      }
    });
  };

  // 批量处理成功以后的回调
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      batchList: [],
      batchObj: {},
    });
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      productEnd: { dataSource, dicts, productList, productType },
    } = this.props;
    const { pageSize, currentPage, taskTypeCode, selectedRowKeys, columns } = this.state;
    const { tableLoading } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: this.handleShowSizeChange,
      onChange: this.handlePageNumChange,
      pageSize,
      current: currentPage,
      total: dataSource.total,
      showTotal: () => `共 ${dataSource.total} 条数据`,
    };

    // if (taskTypeCode === 'T001_3' || taskTypeCode === 'T001_5') {
    //   columns.splice(5, 1);
    // }

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        const { pageNum } = this.state;
        this.state.batchObj = { ...this.state.batchObj, [pageNum]: selectRows };
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

    const formItemData = [
      {
        name: 'proCode',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productList,
        rules: [{ required: true }],
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productType,
      },
      {
        name: 'status',
        label: '任务状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: dicts && dicts.S001List,
      },
    ];

    return (
      <>
        <List
          pageCode="productEnd"
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
            activeTabKey: taskTypeCode,
            onTabChange: this.changeTabs,
          }}
          extra={this.setOperations()}
          tableList={
            <>
              {taskTypeCode === 'T001_1' && (
                <Table
                  dataSource={dataSource.rows}
                  columns={columns}
                  pagination={pagination}
                  scroll={{ x: 2000 }}
                  loading={tableLoading}
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                  rowKey="taskId"
                />
              )}
              {taskTypeCode === 'T001_3' && (
                <Table
                  dataSource={dataSource.rows}
                  columns={columns}
                  pagination={pagination}
                  scroll={{ x: 2000 }}
                  loading={tableLoading}
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                  rowKey="taskId"
                />
              )}
              {taskTypeCode === 'T001_4' && (
                <Table
                  dataSource={dataSource.rows}
                  columns={columns}
                  pagination={pagination}
                  scroll={{ x: 1800 }}
                  loading={tableLoading}
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                  rowKey="taskId"
                />
              )}
              {taskTypeCode === 'T001_5' && (
                <Table
                  dataSource={dataSource.rows}
                  columns={columns}
                  pagination={pagination}
                  scroll={{ x: 1800 }}
                  loading={tableLoading}
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                  rowKey="taskId"
                />
              )}
              <MoreOperation
                opertations={{
                  tabs: taskTypeCode,
                  statusKey: 'checked',
                }}
                fn={this.getTableData}
                type="batch"
                batchList={this.state.batchList}
                submitCallback={this.handlerBatchSubmit}
                successCallback={this.handlerSuccessCallback}
              />
            </>
          }
        />
      </>
    );
  }
}

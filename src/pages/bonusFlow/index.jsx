// 产品分红页面
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MoreOperation from '@/components/moreOperation';
import { Button, Col, Form, Icon, Input, Modal, Row, Select, Tabs, Tooltip } from 'antd';
import styles from './index.less';
import { handleTableCss } from '../manuscriptBasic/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';

const { Search } = Input;
const { TabPane } = Tabs;

@Form.create()
class BonusFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 类别选项
      panes: [
        {
          key: 'T001_1',
          title: '我待办',
          name: 'page1',
        },
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
      // table 表头
      columns: [
        {
          title: '产品简称',
          dataIndex: 'proFname',
          sorter: true,
          width: 350,
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
          sorter: true,
          width: 150,
          render: text => {
            return handleTableCss(text);
          },
        },
        {
          title: '产品类型',
          dataIndex: 'proType',
          sorter: true,
          width: 150,
          render: text => {
            return handleTableCss(text);
          },
        },
        {
          title: '收益分配基准日',
          dataIndex: 'baseDate',
          sorter: true,
          width: 180,
          render: text => {
            return handleTableCss(text);
          },
        },
        {
          title: '利润分配比例',
          dataIndex: 'profitSharingProp',
          sorter: true,
          width: 150,
          align: 'right',
          render: (_, record) => {
            return (
              <Tooltip
                title={`${(record.profitSharingProp && record.profitSharingProp * 100).toFixed(
                  2,
                )}%`}
                placement="topLeft"
              >
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
                  {record.profitSharingProp
                    ? `${(record.profitSharingProp * 100).toFixed(2)}%`
                    : record.profitSharingProp === ''
                      ? '-'
                      : '0%'}
                </span>
              </Tooltip>
            );
          },
        },
        {
          title: '任务到达时间',
          dataIndex: 'taskTime',
          sorter: true,
          width: 180,
          render: text => {
            return handleTableCss(text);
          },
        },
        {
          title: '状态',
          dataIndex: 'operStatusName',
          sorter: true,
          width: 150,
          render: text => {
            return handleTableCss(text);
          },
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          render: (text, record) => {
            // 待提交 S001_1   流程中S001_2  已结束 S001_3
            // 代办 T001_1 未提交 T001_3
            let content;
            if (this.state.taskTypeCode === 'T001_1' || this.state.taskTypeCode === 'T001_4') {
              switch (record.operStatus) {
                case 'S001_1':
                  content = (
                    <>
                      <Action code="bonusFlow:update">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => this.dealTask(record, 'edit')}
                        >
                          修改
                        </Button>
                      </Action>
                      <Action code="bonusFlow:copy">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => this.dealTask(record, 'copy')}
                        >
                          复制
                        </Button>
                      </Action>
                      <Action code="bonusFlow:commit">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => this.dealTask(record, 'submit')}
                        >
                          提交
                        </Button>
                      </Action>
                      <Action code="bonusFlow:delete">
                        <Button type="link" size="small" onClick={() => this.deleteInfo(record)}>
                          删除
                        </Button>
                      </Action>
                    </>
                  );
                  break;
                case 'S001_2':
                  content = (
                    <>
                      <Action code="bonusFlow:check">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => this.dealTask(record, 'handle')}
                        >
                          {' '}
                          办理{' '}
                        </Button>
                      </Action>
                      <Action code="bonusFlow:transferHistory">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => handleShowTransferHistory(record)}
                        >
                          流转历史
                        </Button>
                      </Action>
                      {this.revokeShow(record)}
                      <MoreOperation record={record} fn={this.handleGetTableList} />
                    </>
                  );
                  break;
                case 'S001_3':
                  content = (
                    <>
                      <Action code="bonusFlow:details">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => this.dealTask(record, 'details')}
                        >
                          详情
                        </Button>
                      </Action>
                      <Action code="bonusFlow:transferHistory">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => handleShowTransferHistory(record)}
                        >
                          流转历史
                        </Button>
                      </Action>
                    </>
                  );
                  break;
              }
              return content;
            }
            content = (
              <>
                <Action code="bonusFlow:details">
                  <Button type="link" size="small" onClick={() => this.dealTask(record, 'details')}>
                    详情
                  </Button>
                </Action>
                <Action code="bonusFlow:transferHistory">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleShowTransferHistory(record)}
                  >
                    流转历史
                  </Button>
                </Action>
                {this.revokeShow(record)}
              </>
            );
            return content;
          },
        },
      ],
      // table 内容
      tableVal: [],
      total: 0,
      // table 选项
      pageNum: 1,
      pageSize: 10,
      taskTypeCode: props.publicTas,
      fuzzy: '',
      // 下方全选checkbox状态
      ischecked: false,
      // checkbox选中
      selectedRows: [],
      // checkbox  key
      selectedRowKeys: [],
      // isForm 展开和收起
      isForm: true,
      direction: '',
      field: '',
      // 批量选中的数据
      batchList: [],
      batchObj: {},
      seachData: {},
    };
  }

  // 判断撤销按钮是否显示
  revokeShow(record) {
    if (record.operStatus === 'S001_2') {
      if (record.revoke == 1) {
        return (
          <>
            <Action code="bonusFlow:cancel">
              <Button type="link" size="small" onClick={() => this.handleCanBackOut(record)}>
                撤销
              </Button>
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
          type: 'bonusFlow/getRevokeFunc',
          payload: record.processInstanceId,
        }).then(data => {
          if (data) this.handleGetTableList();
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
          type: 'bonusFlow/getDeleteFunc',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.handleGetTableList();
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
      //     pathname: '/dynamicPage/pages/4028e7b673b2859b0173b9868f400005/分红流程Test',
      //     query: {
      //       // type: 'edit',
      //       id: record.id,
      //     },
      //   }),
      // );
      fnLink(
        'bonusFlow:update',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'submit') {
      // 提交
      // dispatch(
      //   routerRedux.push({
      //     pathname: '/dynamicPage/pages/4028e7b673b2859b0173b9868f400005/分红流程Test',
      //     query: {
      //       // type: 'submit',
      //       id: record.id,
      //     },
      //   }),
      // );
      fnLink(
        'bonusFlow:commit',
        `?id=${record.id}&proCode=${record.proCode}&processInstanceId=${record.processInstanceId}&processInstId=${record.processInstanceId}`,
      );
    } else if (mark === 'history') {
      // 流转历史
      dispatch(
        routerRedux.push({
          pathname: '/processCenter/processHistory',
          query: {
            processInstanceId: record.processInstanceId,
            taskId: record.taskId,
          },
        }),
      );
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
      //  dispatch(
      //   routerRedux.push({
      //     pathname: `/dynamicPage/pages/分红流程/4028e7b676216e1b01762757e0090003/复制?processInstId=${record.processInstanceId}`,
      //   }),
      fnLink('bonusFlow:copy', `?processInstId=${record.processInstanceId}`);
    }
  }

  /**
   * @method componentDidMount 生命周期
   */
  componentDidMount() {
    this.handleGetTableList();
    this.getProductList();
    this.getProductType();
    this.props.dispatch({
      // 'A002' 产品类型, 'P001' 产品备案类型, 'M002' 运作方式,  'R001' 风险等级 'I009' 客户类型
      // J006 管理人  暂时取字典  后期从企业信息管理表中获取
      // S001 状态
      type: 'bonusFlow/getDicts',
      payload: ['S001', 'A002'],
    });
  }

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
  handleGetTableList = val => {
    const {
      bonusFlow: { tableList },
      dispatch,
    } = this.props;
    const { pageNum, pageSize, taskTypeCode, fuzzy, direction, field, seachData } = this.state;
    const values = seachData;
    if (values.proType) {
      values.proType = values.proType.toString();
    }
    if (values.checked) {
      values.checked = values.checked.toString();
    }
    if (values.proName) {
      values.proName = values.proName.toString();
    }
    if (values.proCode) {
      values.proCode = values.proCode.toString();
    }

    let payload = {
      pageNum,
      pageSize,
      taskTypeCode,
      fuzzy,
      direction,
      field,
      ...values,
    };
    if (val === 'query') {
      delete payload.fuzzy, (payload.pageNum = 1);
      payload.pageSize = 10;
      this.setState({
        pageNum: 1,
        pageSize: 10,
      });
    }
    this.deleteEmptyParam(payload);
    dispatch({
      type: 'bonusFlow/handleQueryTableData',
      payload,
    });
    this.setState({
      tableVal: tableList.rows,
      total: tableList.total,
    });
  };

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList() {
    const { dispatch } = this.props;
    dispatch({
      type: `bonusFlow/queryProductList`,
    });
  }

  getProductType() {
    const { dispatch } = this.props;
    dispatch({
      type: `bonusFlow/productType`,
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
   * 方法说明  页码change
   * @method handleTableChange
   * @param pagination {string} 分页
   * @param filters
   * @param sorter {string} 排序
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
    this.setState(
      {
        tableVal: [],
        pageNum: 1,
        pageSize: 10,
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };

  // 批量处理成功以后的回调
  handlerSuccessCallback = () => {
    this.setState({
      selectedRowKeys: [],
      batchList: [],
      batchObj: {},
    });
  };

  /**
   * 批量操作点击时候的回调
   */
  handlerBatchSubmit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bonusFlow/batchSubm',
      payload: this.state.batchList.map(item => item.id),
    }).then(data => {
      if (data) {
        this.handlerSuccessCallback();
        this.handleGetTableList();
      }
    });
  };

  /**
   * @method handleOpenConditions 展开与收起
   */
  handleOpenConditions() {
    this.setState(state => ({
      isForm: !state.isForm,
    }));
  }

  /**
   * @method handleClearVal 重置 // 清理value值
   */
  handleClearVal() {
    this.props.form.resetFields();
  }

  /**
   * @method handleSearchBtn 详细搜索
   */
  handleSearchBtn = seachData => {
    this.setState({ seachData: seachData || {}, pageNum: 1, pageSize: 10 }, () => {
      this.handleGetTableList('query');
    });
  };

  // 重置
  handleReset = () => {
    this.setState({ seachData: {}, field: '', direction: '', pageNum: 1, pageSize: 10 }, () => {
      this.handleGetTableList('query');
    });
  };

  /**
   * @method blurSearch 搜索方法
   * @param val value值
   */
  handleBlurSearch = val => {
    this.setState(
      {
        fuzzy: val,
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.handleGetTableList('fuzzy');
      },
    );
  };

  /**
   * 编辑跳转
   * @method editTask
   */
  editTask() {
    this.props.fnLink('bonusFlow:link', '');
  }

  /**
   * 每页条数更改
   * @param current 当前页
   * @param size  每页条数
   */
  handleShowSizeChange = (current, size) => {
    this.setState({ pageSize: size }, () => {
      this.handleGetTableList();
    });
  };

  /**
   * 页码切换
   * @param page 当前页
   */
  handlePageNumChange = page => {
    this.setState({ pageNum: page }, () => this.handleGetTableList());
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const { selectedRowKeys, pageSize, columns, pageNum, batchList, taskTypeCode } = this.state;
    const {
      bonusFlow: { tableList, productType, productList, opts },
      loading,
    } = this.props;
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
        config: { mode: 'multiple' },
        option: productList,
      },
      {
        name: 'proType',
        label: '产品类型',
        type: 'select',
        readSet: { name: 'label', code: 'value' },
        config: { mode: 'multiple' },
        option: productType,
      },
      {
        name: 'checked',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: opts && opts.S001,
      },
    ];

    return (
      <>
        <List
          pageCode="bonusFlow"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={taskTypeCode}
          taskArrivalTimeKey="taskTime"
          title={false}
          formItemData={formItemData}
          advancSearch={this.handleSearchBtn}
          resetFn={this.handleReset}
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
            <Action code="bonusFlow:link">
              <Button type="primary" onClick={() => this.editTask()} className={styles.addBtn}>
                发起流程
              </Button>
            </Action>
          }
          tableList={
            <>
              <Table
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: tableList.total,
                  showTotal: () => `共 ${tableList.total} 条数据`,
                  onShowSizeChange: this.handleShowSizeChange,
                  onChange: this.handlePageNumChange,
                  pageSize,
                  current: pageNum,
                }}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableList.rows}
                onChange={this.handleTableChange}
                scroll={{ x: true }}
                loading={loading}
                rowKey="taskId"
              />
              <MoreOperation
                opertations={{
                  tabs: taskTypeCode,
                  statusKey: 'operStatus',
                }}
                fn={this.handleGetTableList}
                type="batch"
                batchList={batchList}
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

const WrappedAdvancedSearchForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ bonusFlow, loading, publicModel: { publicTas } }) => ({
        bonusFlow,
        publicTas,
        loading: loading.effects['bonusFlow/handleQueryTableData'],
      }))(BonusFlow),
    ),
  ),
);

export default WrappedAdvancedSearchForm;

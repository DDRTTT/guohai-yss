/**
 * 回执编码申请审核
 * * */

import React from 'react';
import { connect, routerRedux } from 'dva';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Tabs,
} from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import Action from '@/utils/hocUtil';
import styles from './index.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
// 组件
import ExtendLicence from './extendLicence';
import FinalRejection from './finalRejection';
import { Table } from '@/components';
import List from '@/components/List';
import Gird from '@/components/Gird';

const { Search } = Input;
const { confirm } = Modal;
const { TabPane } = Tabs;

@errorBoundary
@Form.create()
@connect(({ loading, licenseManagement }) => ({
  loading: loading.effects['licenseManagement/receiptListWay'],
  licenseManagement,
}))
export default class Index extends BaseCrudComponent {
  state = {
    selectedRows: [],
    pageSize: 10,
    currentPage: 1,

    seniorType: false, // 高级搜索是否显示 false不显示 true显示
    receiptSearch: null,

    receiptModal1: false,
    receiptModal2: false,
    receiptModal3: false,
    receiptType: null,
    receiptId: null,
    taskType:'2',
    issueType:""
  };

  // 列表查询
  getList = e => {
    const { dispatch } = this.props;
    const { pageSize, currentPage, issueType } = this.state;

    this.setState(
      {
        receiptSearch: e,
      },
      () => {
        const basic = {
          pageSize,
          currentPage,
        };

        dispatch({
          type: 'licenseManagement/receiptListWay',
          payload: {
            basic,
            payload: {
              selectParams: {
                like: this.state.receiptSearch,
                checked: issueType ? 1 : 0,
              },
            },
          },
        });
      },
    );
  };

  handleStandardTableChange = pagination => {
    this.setState(
      {
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
      },
      () => {
        this.getList();
      },
    );
  };

  // 批量操作
  signManageAction = () => {
    const { issueType } = this.state;
    return (
      <div style={{ marginTop: -45, zIndex: 1 }}>
        <Dropdown
          overlay={
            <Menu onClick={this.handleClick}>
              {issueType ? (
                <Menu.Item key="1">
                  <Action key="licenseManagement:reAudit" code="licenseManagement:reAudit">
                    批量反审核
                  </Action>
                </Menu.Item>
              ) : (
                <Menu.Item key="2">
                  <Action key="licenseManagement:checkDel" code="licenseManagement:checkDel">
                    批量删除
                  </Action>
                </Menu.Item>
              )}
            </Menu>
          }
          placement="topLeft"
        >
          <Button style={{ marginRight: 10, width: 100, height: 26 }}>
            批量操作
            <Icon type="up" />
          </Button>
        </Dropdown>
      </div>
    );
  };

  // 批量操作
  handleClick = e => {
    const { selectedRows, pageSize, currentPage, receiptSearch, issueType } = this.state;
    const { dispatch } = this.props;
    const params = {
      basic: {
        pageSize,
        currentPage,
      },
      payload: {
        selectParams: {
          like: receiptSearch,
          checked: issueType ? 1 : 0,
        },
      },
    };

    if (selectedRows.length > 0) {
      // 批量反审核
      if (e.key === '1') {
        dispatch({
          type: 'licenseManagement/receiptCheck',
          payload: {
            deleteparams: {
              ids: selectedRows.join(','),
            },
            payload: params,
          },
        }).then(response => {
          if (response.status === 200) {
            this.selectedRowsReset();
          }
        });
      } else {
        dispatch({
          type: 'licenseManagement/receiptDelete',
          payload: {
            deleteparams: {
              ids: selectedRows.join(','),
            },
            payload: params,
          },
        }).then(response => {
          if (response.status === 200) {
            this.selectedRowsReset();
          }
        });
      }
    } else {
      message.warn('请至少选择一条数据');
    }
  };

  // 重置已选
  selectedRowsReset = () => {
    this.setState({
      selectedRows: [],
    });
  };

  // 切换 已审核 未审核
  issusChange = type => {
    const { dispatch } = this.props;
    const { receiptSearch, pageSize } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        taskType: type,
        issueType: type !== '1',
        selectedRows: [],
      },
      () => {
        const basic = {
          currentPage: 1,
          pageSize,
        };

        dispatch({
          type: 'licenseManagement/receiptListWay',
          payload: {
            basic,
            payload: {
              selectParams: {
                like: receiptSearch,
                checked: this.state.issueType ? 1 : 0,
              },
            },
          },
        });
      },
    );
  };

  // 签章处理回调
  handleCallback = (record, type) => {
    const { dispatch, form } = this.props;
    const { currentPage, pageSize, receiptSearch, issueType } = this.state;

    const params = {
      basic: {
        pageSize,
        currentPage,
      },
      payload: {
        selectParams: {
          like: receiptSearch,
          checked: issueType ? 1 : 0,
        },
      },
    };

    this.setState({
      receiptType: type,
      receiptId: record.id,
      receiptRecord: record,
    });
    const _this = this;

    if (type === 'delete') {
      confirm({
        title: '确定删除?',
        onOk() {
          // 删除
          dispatch({
            type: 'licenseManagement/receiptDelete',
            payload: {
              deleteparams: {
                ids: record.id,
              },
              payload: params,
            },
          });
        },
        onCancel() {},
      });
    } else if (type === 'adopt') {
      // 通过&&修改
      this.openModal(2);
    } else if (type === 'reject') {
      // 驳回
      this.openModal(3);
    } else if (type === 'look') {
      // 查看
      form.resetFields();
      dispatch({
        type: 'licenseManagement/receiptDetail',
        payload: {
          id: record.id,
        },
      }).then(function(response) {
        if (response.status === 200) {
          _this.openModal(1);
        } else {
          message.error(response.message);
        }
      });
    } else if (type === 'recheck') {
      // 反审核
      confirm({
        title: '确定反审核?',
        onOk() {
          dispatch({
            type: 'licenseManagement/receiptCheck',
            payload: {
              deleteparams: {
                ids: record.id,
              },
              payload: params,
            },
          });
        },
        onCancel() {},
      });
    }
  };

  // 新增或查看 取消回调
  cancelModal = num => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      [`receiptModal${num}`]: false,
    });
  };

  // 审核查看
  checkRender = () => {
    const {
      licenseManagement: { receiptDetailData },
    } = this.props;

    const drawerConfig = [
      { label: '机构ID', value: 'orgId' },
      { label: '使用类型', value: 'typeName' },
      { label: '手机号码', value: 'mobile' },
      { label: '申请时间', value: 'createTime' },
      { label: '申请说明', value: 'applyDesc' },
    ]
    const { issueType } = this.state;
    return (
      <div className={styles.receiptStyle}>
        <Gird config={drawerConfig} col={2} info={receiptDetailData} Col={2}/>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.receiptCol}>
          {issueType ? null : (
            <Button
              onClick={() => {
                this.openModal(3);
                this.cancelModal(1);
              }}
              type="danger"
              style={{ marginLeft: 24 }}
            >
              驳回
            </Button>
          )}

          <Button
            onClick={() => this.cancelModal(1)}
            style={{ marginRight: 24, float: 'right', marginLeft: 10 }}
          >
            取消
          </Button>
          {issueType ? null : (
            <Button onClick={() => this.openModal(2)} type="primary" style={{ float: 'right' }}>
              通过
            </Button>
          )}
        </Row>
      </div>
    );
  };

  // 打开模态框
  openModal = num => {
    this.setState({
      [`receiptModal${num}`]: true,
    });
  };

  // 跳转白名单
  goWhite = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/base/licenseManagement/whiteList'));
  };

  componentDidMount() {
    this.getList();
  }

  handleChangeRadioKey = key => this.issusChange(key);

  render() {
    const {
      licenseManagement: { receiptListDate },
      loading,
    } = this.props;

    const {
      issueType,
      seniorType,
      receiptModal1,
      receiptModal2,
      receiptModal3,
      receiptId,
      selectedRows,
      receiptRecord,
    } = this.state;

    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: selectedRowKeys => {
        this.setState({
          selectedRows: selectedRowKeys,
        });
      },
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '机构名称',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '机构ID',
        dataIndex: 'orgId',
        key: 'orgId',
      },
      {
        title: '使用类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '申请说明',
        dataIndex: 'applyDesc',
        key: 'applyDesc',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 300,
        render: (val, record) => (
          <span>
            {issueType ? (
              <div>
                <a style={{ paddingRight: 10 }} onClick={() => this.handleCallback(record, 'look')}>
                  查看
                </a>
                <a
                  style={{ paddingRight: 10 }}
                  onClick={() => this.handleCallback(record, 'adopt')}
                >
                  修改
                </a>
                <Action key="licenseManagement:reAudit" code="licenseManagement:reAudit">
                  <a
                    style={{ paddingRight: 10 }}
                    onClick={() => this.handleCallback(record, 'recheck')}
                  >
                    反审核
                  </a>
                </Action>
              </div>
            ) : (
              <div>
                <a style={{ paddingRight: 10 }} onClick={() => this.handleCallback(record, 'look')}>
                  查看
                </a>
                <Action key="licenseManagement:adopt" code="licenseManagement:adopt">
                  <a
                    style={{ paddingRight: 10 }}
                    onClick={() => this.handleCallback(record, 'adopt')}
                  >
                    通过
                  </a>
                  <a
                    style={{ paddingRight: 10 }}
                    onClick={() => this.handleCallback(record, 'reject')}
                  >
                    驳回
                  </a>
                </Action>
                <Action key="licenseManagement:checkDel" code="licenseManagement:checkDel">
                  <a
                    style={{ paddingRight: 10 }}
                    onClick={() => this.handleCallback(record, 'delete')}
                  >
                    删除
                  </a>
                </Action>
              </div>
            )}
          </span>
        ),
      },
    ];
    return (
      <>
        <List
          title={false}
          advancSearchBool={false}
          searchPlaceholder="请输入"
          fuzzySearch={this.getList}
          tabs={{
            tabList: [
              { key: '2', tab: '已审核' },
              { key: '1', tab: '待审核' }
            ],
            activeTabKey: this.state.taskType,
            onTabChange: this.handleChangeRadioKey,
          }}
          extra={
            <Button onClick={() => this.goWhite()} type="primary">
              白名单
            </Button>
          }
          tableList={(<>
            <Table
              rowKey={record => record.id}
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              dataSource={receiptListDate.rows}
              onChange={this.handleStandardTableChange}
            />
            {receiptListDate.rows.length > 0 ? this.signManageAction() : ''}
          </>)}
        />
        <Modal
            title="查看"
            visible={receiptModal1}
            onCancel={() => this.cancelModal(1)}
            loading={loading}
            footer={null}
            zIndex={10}
          >
            <div>{this.checkRender()}</div>
          </Modal>
          <Modal
            title="请设置许可到期时间"
            visible={receiptModal2}
            onCancel={() => this.cancelModal(2)}
            // loading={loading}
            footer={null}
            width={600}
            zIndex={11}
          >
            <ExtendLicence
              onCancel={() => this.cancelModal(1)}
              onCancel2={() => this.cancelModal(2)}
              id={receiptId}
              record={receiptRecord}
              issueType={issueType}
              getList={() => this.getList()}
            />
          </Modal>
          <Modal
            title="提示"
            visible={receiptModal3}
            onCancel={() => this.cancelModal(3)}
            loading={loading}
            footer={null}
            zIndex={11}
          >
            <FinalRejection
              onCancel={() => this.cancelModal(3)}
              id={receiptId}
              getList={() => this.getList()}
            />
          </Modal>
      </>
    );
  }
}

/**
 * 回执编码申请审核
 * * */

import React from 'react';
import { connect } from 'dva';
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
  Switch,
  TreeSelect,
} from 'antd';
import { Table } from '@/components';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import Action from '@/utils/hocUtil';
import styles from './index.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, PageContainers } from '@/components';

const FormItem = Form.Item;
const { TextArea } = Input;

@errorBoundary
@Form.create()
@connect(({ loading, whiteList }) => ({
  loading: loading.effects['whiteList/whiteListWay'],
  whiteList,
}))
export default class WhiteList extends BaseCrudComponent {
  state = {
    selectedRows: [],
    pageSize: 10,
    currentPage: 1,

    seniorType: false, // 高级搜索是否显示 false不显示 true显示
    whiteSearch: null,

    receiptModal1: false,
    receiptModal2: false,

    whiteType: null,
    whiteSwitch: false,
    receiptId: null,
  };

  // 列表查询
  getList = e => {
    const { dispatch } = this.props;
    const { pageSize, currentPage } = this.state;

    this.setState(
      {
        whiteSearch: e,
      },
      () => {
        const params = {
          basic: {
            pageSize,
            currentPage,
          },
          payload: {
            selectParams: {
              like: this.state.whiteSearch,
            },
          },
        };

        dispatch({
          type: 'whiteList/whiteListWay',
          payload: params,
        });
      },
    );
  };

  // 批量操作
  handleClick = () => {
    const { dispatch } = this.props;
    const { selectedRows, pageSize, whiteSearch } = this.state;
    if (selectedRows.length > 0) {
      dispatch({
        type: 'whiteList/whiteDelete',
        payload: {
          params: {
            ids: selectedRows.join(','),
          },
          payload: {
            basic: {
              pageSize,
              currentPage: 1,
            },
            payload: {
              selectParams: {
                like: whiteSearch,
              },
            },
          },
        },
      });
      this.setState({
        currentPage: 1,
      });
    } else {
      message.warn('请至少选择一条数据');
    }
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
    return (
      <div className={styles.batchStyle}>
        <Dropdown
          overlay={
            <Menu onClick={this.handleClick}>
              <Menu.Item key="1">
                <Action key="licenseManagement:whiteDel" code="licenseManagement:whiteDel">
                  批量删除
                </Action>
              </Menu.Item>
            </Menu>
          }
          placement="topLeft"
        >
          <Button className={styles.buttons}>
            批量操作
            <Icon type="up" />
          </Button>
        </Dropdown>
      </div>
    );
  };

  // 签章处理回调
  handleCallback = (record, type) => {
    const { dispatch, form } = this.props;
    const { currentPage, pageSize, whiteSearch } = this.state;

    const basic = {
      basic: {
        pageSize,
        currentPage,
      },
      payload: {
        selectParams: {
          like: whiteSearch,
        },
      },
    };

    this.setState({
      whiteType: type,
      receiptId: record.id,
    });

    if (type === 'delete') {
      // 删除
      dispatch({
        type: 'whiteList/whiteDelete',
        payload: {
          params: {
            ids: record.id,
          },
          payload: basic,
        },
      });
    }
    if (type === 'look' || type === 'update') {
      // 查看&&修改
      form.resetFields();
      dispatch({
        type: 'whiteList/whiteDetail',
        payload: {
          id: record.id,
        },
      }).then(response => {
        if (response.status === 200) {
          const num = type === 'look' ? 1 : 2;
          this.setState({
            [`receiptModal${num}`]: true,
            whiteSwitch: response.data.checked === 1,
          });
        } else {
          message.error(response.message);
        }
      });
    }
    if (type === 'switch') {
      // 切换
      dispatch({
        type: 'whiteList/whiteSwitch',
        payload: {
          basic: {
            id: record.id,
            checked: record.checked === 1 ? 0 : 1,
          },
          payload: basic,
        },
      });
    }
  };

  // 新增或查看 取消回调
  cancelModal = num => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      whiteType: null,
    });
    this.setState({
      [`receiptModal${num}`]: false,
    });
  };

  // 审核查看
  checkLookRender = () => {
    const {
      whiteList: { whiteDetailData },
    } = this.props;
    return (
      <div className={styles.receiptStyle}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <div className={styles.receiptLine}>
            <Col
              sm={24}
              md={8}
              xxl={8}
              className={styles.receiptCols}
            >
              <span className={styles.receiptLabel}>机构ID：</span>
            </Col>
            <Col sm={24} md={16} xxl={16} className={styles.receiptCol2}>
              <span className={styles.receiptWord}>
                {whiteDetailData.orgId ? whiteDetailData.orgId : '暂无'}
              </span>
            </Col>
          </div>
          <div className={styles.receiptLine}>
            <Col
              sm={24}
              md={8}
              xxl={8}
              className={styles.receiptCols}
            >
              <span className={styles.receiptLabel}>白名单IP：</span>
            </Col>
            <Col sm={24} md={16} xxl={16} className={styles.receiptCol2}>
              <span className={styles.receiptWord}>
                {whiteDetailData.ip ? whiteDetailData.ip : '暂无'}
              </span>
            </Col>
          </div>
          <div className={styles.receiptLine}>
            <Col
              sm={24}
              md={8}
              xxl={8}
              className={styles.receiptCols}
            >
              <span className={styles.receiptLabel}>创建时间：</span>
            </Col>
            <Col sm={24} md={16} xxl={16} className={styles.receiptCol2}>
              <span className={styles.receiptWord}>
                {whiteDetailData.createTime ? whiteDetailData.createTime : '暂无'}
              </span>
            </Col>
          </div>
          <div className={styles.receiptLine}>
            <Col
              sm={24}
              md={8}
              xxl={8}
              className={styles.receiptCols}
            >
              <span className={styles.receiptLabel}>启用状态：</span>
            </Col>
            <Col sm={24} md={16} xxl={16} className={styles.receiptCol2}>
              <span className={styles.receiptWord}>
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  disabled
                  checked={whiteDetailData.checked === 1}
                />
              </span>
            </Col>
          </div>

          <div className={styles.receiptLine}>
            <Col
              sm={24}
              md={8}
              xxl={8}
              className={styles.receiptCols}
            >
              <span className={styles.receiptLabel}>备注信息：</span>
            </Col>
            <Col sm={24} md={16} xxl={16} className={styles.receiptCol2}>
              <span className={styles.receiptWord}>
                {whiteDetailData.desc ? whiteDetailData.desc : '暂无'}
              </span>
            </Col>
          </div>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.receiptCol}>
          <Button
            onClick={() => this.cancelModal(1)}
            className={styles.receiptQuit}
          >
            取消
          </Button>
        </Row>
      </div>
    );
  };

  switchChange = e => {
    this.setState({
      whiteSwitch: e,
    });
  };

  // 新增||修改
  addOrPutRender = () => {
    const {
      form: { getFieldDecorator },
      whiteList: { whiteDetailData, orgNameList },
    } = this.props;
    const { whiteType, whiteSwitch } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="机构ID" {...formItemLayout}>
              {getFieldDecorator('orgId', {
                initialValue: whiteType === 'update' ? whiteDetailData.orgId : '',
                rules: [
                  {
                    required: true,
                    message: '机构ID不能为空',
                  },
                ],
              })(
                <TreeSelect
                  className={styles.treeStyle}
                  dropdownStyle={{ overflow: 'auto' }}
                  treeData={orgNameList}
                  treeDefaultExpandAll
                  showSearch
                  treeNodeFilterProp="label"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="白名单IP" {...formItemLayout}>
              {getFieldDecorator('ip', {
                initialValue: whiteType === 'update' ? whiteDetailData.ip : '',
                rules: [
                  {
                    required: true,
                    message: '白名单IP不能为空',
                  },
                ],
              })(<Input className={styles.colStyle} />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="启用状态" {...formItemLayout}>
              {getFieldDecorator('checked', {
                initialValue: whiteType === 'update' ? whiteSwitch : false,
                rules: [
                  {
                    required: true,
                    message: '启用状态不能为空',
                  },
                ],
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  checked={whiteSwitch}
                  onChange={e => this.switchChange(e)}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="备注信息" {...formItemLayout}>
              {getFieldDecorator('desc', {
                initialValue: whiteType === 'update' ? whiteDetailData.desc : '',
                rules: [
                  {
                    required: true,
                    message: '备注信息不能为空',
                  },
                ],
              })(<TextArea rows={4} className={styles.colStyle} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.rowStyle}>
          <Button className={styles.butStyle1} onClick={() => this.cancelAddOrPut()}>
            取消
          </Button>
          <Button className={styles.butStyle2} type="primary" onClick={() => this.sureRevise()}>
            确定
          </Button>
        </Row>
      </Form>
    );
  };

  // 取消
  cancelAddOrPut = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      whiteType: null,
    });
    this.cancelModal(2);
  };

  // 确定
  sureRevise = () => {
    const {
      dispatch,
      form,
      whiteList: { whiteDetailData },
    } = this.props;
    const { whiteType, currentPage, pageSize, whiteSearch } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (whiteType === 'update') {
          values.id = whiteDetailData.id;
        }
        values.checked = values.checked ? 1 : 0;
        dispatch({
          type: whiteType === 'update' ? 'whiteList/whiteUpdate' : 'whiteList/whiteAdd',
          payload: {
            params: values,
            payload: {
              basic: {
                pageSize,
                currentPage,
              },
              payload: {
                selectParams: {
                  like: whiteSearch,
                },
              },
            },
          },
        }).then(response => {
          if (response.status === 200) {
            this.cancelAddOrPut();
          } else {
            message.error(response.message);
          }
        });
      }
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 机构名称下拉
    dispatch({
      type: 'whiteList/applyList',
    });

    this.getList();
  }

  // 打开模态框
  openModal = num => {
    this.setState({
      [`receiptModal${num}`]: true,
    });
  };

  render() {
    const {
      whiteList: { currentPage, whiteListData },
      loading,
    } = this.props;
    const { selectedRows, receiptModal1, receiptModal2, whiteType } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: selectedRowKeys => {
        this.setState({
          selectedRows: selectedRowKeys,
        });
      },
    };
    // 页码属性设置
    const paginationProps = {
      showSizeChanger: true,
      // onShowSizeChange: handleUpdataPageSize,
      showQuickJumper: true,
      // onChange: handleUpdataPageNum,
      // current: pageNumData.current,
      total: whiteListData.total,
      showTotal: () => {
        return `共 ${whiteListData.total} 条数据`;
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
        title: '白名单IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '启用状态',
        dataIndex: 'checked',
        key: 'checked',
        render: (val, record) => (
          <Action key="licenseManagement:listSwitch" code="licenseManagement:listSwitch">
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={val === 1}
              onChange={() => this.handleCallback(record, 'switch')}
            />
          </Action>
        ),
      },
      {
        title: '备注信息',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 300,
        render: (val, record) => (
          <span>
            <div>
              <a className={styles.aStyle} onClick={() => this.handleCallback(record, 'look')}>
                查看
              </a>
              <Action key="licenseManagement:whitePut" code="licenseManagement:whitePut">
                <a
                  className={styles.aStyle}
                  onClick={() => this.handleCallback(record, 'update')}
                >
                  修改
                </a>
              </Action>
              <Action key="licenseManagement:whiteDel" code="licenseManagement:whiteDel">
                <a
                  className={styles.aStyle}
                  onClick={() => this.handleCallback(record, 'delete')}
                >
                  删除
                </a>
              </Action>
            </div>
          </span>
        ),
      },
    ];

    return (
      <PageContainers
        breadcrumb={[
          {
            title: '系统运营管理',
            url: '',
          },
          {
            title: '许可管理',
            url: '/base/licenseManagement',
          },
          {
            title: '白名单',
            url: '',
          },
        ]}
      >
        <div className={styles.index}>
          <Card
            bordered={false}
            title="白名单"
            extra={
              <Action key="licenseManagement:whiteAdd" code="licenseManagement:whiteAdd">
                <Button onClick={() => this.openModal(2)} type="primary">
                  新增IP
                </Button>
              </Action>
            }
          >
            <Table
              pagination={paginationProps}
              rowKey={record => record.id}
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              dataSource={whiteListData.rows}
              onChange={this.handleStandardTableChange}
              currentPage={currentPage}
            />
            {whiteListData.rows.length > 0 ? this.signManageAction() : ''}
          </Card>
          <Modal
            title="查看"
            visible={receiptModal1}
            onCancel={() => this.cancelModal(1)}
            loading={loading}
            footer={null}
          >
            <div>{this.checkLookRender()}</div>
          </Modal>
          <Modal
            title={whiteType === 'update' ? '修改' : '新增'}
            visible={receiptModal2}
            onCancel={() => this.cancelModal(2)}
            loading={loading}
            footer={null}
          >
            <div>{this.addOrPutRender()}</div>
          </Modal>
        </div>
      </PageContainers>
    );
  }
}

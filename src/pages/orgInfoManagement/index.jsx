//机构管理页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';
import { routerRedux } from 'dva/router';
import {
  Button,
  Dropdown,
  Form,
  Menu,
  Modal,
  Tooltip,
  Table,
  Input,
  Icon,
  Tabs,
  Row,
  Col,
  message,
} from 'antd';
import { Card, PageContainers, CommonSearch3 } from '@/components';
import styles from './index.less';
import List from '@/components/List';
// import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DynamicHeader from '@/components/DynamicHeader';
const { Search } = Input;
const { TabPane } = Tabs;

class orgInfoManagement extends Component {
  state = {
    moreIcon: true,
    advancSearchBool: true,
    expand: false,
    pageNum: 1,
    pageSize: 10,
    formData: {},
    // 列表中选中的数据
    checkedArr: [],
    //模糊查询的参数
    fuzzy: '',
    //tab切换标志
    taskTypeCode: localStorage.getItem('taskTypeCode')
      ? localStorage.getItem('taskTypeCode')
      : 'T001_1',
    //外部机构列表表头
    otherList: [
      {
        title: '机构名称',
        dataIndex: 'orgName',
        sorter: true,
        width: 400,

        render: this.Render,
      },
      {
        title: '机构简称',
        dataIndex: 'orgShortName',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      // {
      //   title: '所属组织机构',
      //   dataIndex: 'parentName',
      //   sorter: true,
      //   width: 200,

      //   render: this.Render,
      // },
      // {
      //   title: '资质类型',
      //   dataIndex: 'orgTypeName',
      //   sorter: true,
      //   width: 200,

      //   render: this.Render,
      // },
      {
        title: '机构类型',
        dataIndex: 'qualifyTypeName',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '注册资本（元）',
        dataIndex: 'registCapital',
        sorter: true,
        width: 120,

        render: text => (
          <Tooltip title={text}>
            {text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
          </Tooltip>
        ),
      },
      {
        title: '资本币种',
        dataIndex: 'capitalCurrencyName',
        sorter: true,
        width: 150,

        render: this.Render,
      },
      {
        title: '客户服务电话',
        dataIndex: 'orgPhone',
        sorter: true,
        width: 120,

        render: this.Render,
      },
      {
        title: '网址',
        dataIndex: 'orgWebSite',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'orgCode',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '报送机构编号',
        dataIndex: 'submitOrgCode',
        sorter: true,
        width: 150,

        render: this.Render,
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <>
              <Action code="fileAngement:add">
                <a
                  className={styles.operationBtn}
                  type="link"
                  onClick={() => this.goMyModify(record, '其他机构', 'detail')}
                >
                  查看
                </a>
              </Action>
              <Action code="orgInfoManagement:othermodify">
                <a
                  className={styles.operationBtn}
                  // disabled={record.status != '1'}
                  type="link"
                  onClick={() => this.goMyModify(record, '其他机构')}
                >
                  修改
                </a>
              </Action>
              <Action code="orgInfoManagement:examine">
                <a
                  className={styles.operationBtn}
                  disabled={record.status == '1'}
                  type="link"
                  onClick={() => {
                    this.examine(record, '0');
                  }}
                >
                  审核
                </a>
              </Action>
              <Action code="orgInfoManagement:delete">
                <a
                  className={styles.operationBtn}
                  disabled={record.status == '1'}
                  onClick={() => {
                    this.pldelInfo(record);
                  }}
                >
                  删除
                </a>
              </Action>
              <Action code="orgInfoManagement:blacklist">
                <a
                  className={styles.operationBtn}
                  onClick={() => this.blackList(record)}
                  disabled={record.status != '1'}
                >
                  黑名单
                </a>
              </Action>
            </>
          );
        },
      },
    ],
  };

  /**
   * 初始化钩子函数
   * @method componentDidMountco
   */
  componentDidMount() {
    localStorage.removeItem('taskTypeCode');
    this.otherOrgList();
    this.getCodeList();
    // this.getSuperiorOrg();
    // sessionStorage.removeItem('keyValue');
  }

  /**
   * 获取机构列表
   * @method otherOrgList
   */
  otherOrgList(val) {
    const { dispatch } = this.props;
    const { pageNum, pageSize, direction, fieldName, fuzzy, formData } = this.state;
    const payload = {
      isOut: true,
      pageNum,
      pageSize,
      isBlack: '0',
      ...formData,
    };
    if (direction) {
      payload.direction = direction;
      payload.fieldName = fieldName;
    }
    // if (val) {
    payload.fuzzy = fuzzy;
    // }
    dispatch({
      type: 'orgInfoManagement/getOtherInstituInfor',
      payload,
    });
  }
  // 条件查询重置
  handleReset = () => {
    this.setState({ formData: {}, fieldName: '', direction: '', fuzzy: '' }, () =>
      this.otherOrgList(),
    );
  };
  selfCallBackHandler = value => {
    this.setState({
      myList: value,
    });
  };
  handleSetTaskTime = key => {
    // this.props.dispatch({
    //   type: 'publicModel/setPublicTas',
    //   payload: key,
    // });
    // localStorage.setItem('taskTypeCode', key);
    this.setState(
      {
        // tableVal: [],
        pageNum: 1,
        pageSize: 10,
        taskTypeCode: key,
      },
      () => {
        this.handleReset();
      },
    );
  };
  //模糊搜索的回调函数
  changeKeyWords = val => {
    this.setState(
      {
        pageNum: 1,
        pageSize: 10,
        fuzzy: val,
      },
      () => {
        this.otherOrgList('fuzzy');
      },
    );
  };
  /**
   * 分页/页码切换/排序
   * @method handleTableChange
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        direction: sorter.order === 'ascend' ? 'asc' : 'desc',
        fieldName: sorter.field,
      },
      () => {
        this.otherOrgList('fuzzy');
      },
    );
  };
  updateExpand = val => {
    this.setState({
      expand: val,
    });
  };
  otherCallBackHandler = value => {
    this.setState({
      otherList: value,
    });
  };
  callback(val) {
    // console.log(val);
  }
  //新建机构
  goAddExtemalOrg = detail => {
    const { dispatch } = this.props;
    localStorage.setItem('taskTypeCode', this.state.taskTypeCode);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/orgInfoManagement/addExternalOrg',
        query: {
          type: detail,
        },
      }),
    );
  };
  //修改
  goMyModify = (record, name, detail, orgName) => {
    const { dispatch } = this.props;
    localStorage.setItem('taskTypeCode', this.state.taskTypeCode);
    localStorage.setItem('orgName', record.orgName);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/orgInfoManagement/orgmodify',
        query: {
          id: record.id || record,
          name,
          type: detail,
          orgName,
        },
      }),
    );
  };
  //跳转黑名单页面
  goBlacklist = () => {
    const { dispatch } = this.props;
    localStorage.setItem('taskTypeCode', this.state.taskTypeCode);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/orgInfoManagement/blacklist',
      }),
    );
  };
  /**
   * @method myOrgDelete 本家机构删除
   */
  myOrgDelete = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const payload = {
          id: record.id,
        };
        dispatch({
          type: 'institutionalInfoManager/myOrgDelete',
          payload,
        }).then(data => {
          if (data) {
            this.otherOrgList();
          }
        });
      },
    });
  };
  /**
   * @method examine 审核/反审核
   */
  examine = (record, value) => {
    const title = value == '1' ? '反审核' : '审核';
    Modal.confirm({
      title: `请确认是否${title}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const payload = {
          orgId: Number(record.id),
          operation: value,
        };
        dispatch({
          type: 'orgInfoManagement/examine',
          payload,
        }).then(data => {
          if (data) {
            this.otherOrgList();
          }
        });
      },
    });
  };
  batchpldelInfo = () => {
    if (this.state.checkedArr.length <= 0) {
      message.warning('请选择操作的数据');
      return;
    }
    const result = this.state.checkedArr.some((item, index, arr) => {
      return Number(item.status);
    });
    if (result) {
      message.warning('审核过的数据不能删除');
      return;
    }
    this.pldelInfo();
  };
  /**
   * @method pldelInfo 其他机构删除、批量删除
   */
  pldelInfo = record => {
    const { dispatch } = this.props;
    const idArr = [];
    this.state.checkedArr.map(item => idArr.push(item.id));
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'orgInfoManagement/otherOrgDelete',
          payload: record ? [record.id] : idArr,
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [], checkedArr: [] });
            this.otherOrgList();
          }
        });
      },
    });
  };
  //批量移入黑名单
  batchBlacklist = () => {
    if (this.state.checkedArr.length <= 0) {
      message.warning('请选择操作的数据');
      return;
    }
    const result = this.state.checkedArr.some((item, index, arr) => {
      return !Number(item.status);
    });
    if (result) {
      message.warning('未审核的数据不能移入黑名单');
      return;
    }
    // this.blackList();
  };
  // 黑名单
  blackList = record => {
    const { dispatch } = this.props;
    let idArr = [];
    if (record) {
      idArr = [record.id];
    } else {
      this.state.checkedArr.map(item => idArr.push(Number(item.id)));
    }
    Modal.confirm({
      title: '请确移入黑名单？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'orgInfoManagement/getBlacklist',
          payload: { isBlack: 1, idArr },
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [], checkedArr: [] });
            this.otherOrgList();
          }
        });
      },
    });
  };
  /**
   * 通过字典获取机构类型/资质类型
   * @method getCodeList
   */
  getCodeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getCodeList',
      payload: ['J001', 'J004'],
    });
  };

  render() {
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        this.setState({
          selectedRowKeys,
          checkedArr: selectRows,
        });
      },
    };
    const { taskTypeCode, otherList, pageSize, expand, advancSearchBool } = this.state;
    const {
      orgInfoManagement: { typeList, otherMechanismList, myMechanismList },
      loading,
    } = this.props;
    const formItemData = [
      {
        name: 'orgName',
        label: '机构名称',
        type: 'Input',
      },
      // {
      //   name: 'parentName',
      //   label: '所属组织机构',
      //   type: 'Input',
      // },
      {
        name: 'qualifyTypeCodes',
        label: '机构类型',
        type: 'select',
        config: { mode: 'multiple', maxTagCount: 1 },
        option: typeList && typeList.J001,
      },
      {
        name: 'orgTypeCodes',
        label: '资质类型',
        type: 'select',
        config: { mode: 'multiple', maxTagCount: 1 },
        option: typeList && typeList.J004,
      },
      {
        name: 'orgCode',
        label: '统一社会信用代码',
        type: 'Input',
        option: {
          rules: [
            {
              pattern: /^[0-9a-zA-Z]{1,18}$/,
              message: '统一社会信用代码不能超过18位',
            },
          ],
        },
      },
    ];
    return (
      <div className={styles.index}>
        <div
          className={
            taskTypeCode && taskTypeCode !== 'T001_1' ? styles.displaynone : styles.displayblock
          }
        >
          <PageContainers
            breadcrumb={[
              {
                title: '产品数据管理',
                url: '',
              },
              {
                title: '机构信息管理',
                url: '/productDataManage/orgInfoManagement/index',
              },
            ]}
            fuzz={''}
          />
        </div>
        <List
          pageCode={taskTypeCode && taskTypeCode !== 'T001_1' ? 'orgInfoManagement' : null}
          dynamicHeaderCallback={this.selfCallBackHandler}
          columns={otherList}
          taskTypeCode={taskTypeCode}
          title={false}
          showBreadCrumb={taskTypeCode && taskTypeCode !== 'T001_1' ? true : false}
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData, pageNum: 1, pageSize: 10 }, () => this.otherOrgList());
          }}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入机构名称"
          fuzzySearch={val => this.changeKeyWords(val)}
          tabs={{
            tabList: [
              { key: 'T001_1', tab: '内部机构' },
              { key: 'T001_3', tab: '外部机构' },
            ],
            activeTabKey: taskTypeCode,
            onTabChange: this.handleSetTaskTime,
          }}
          extra={
            taskTypeCode && taskTypeCode !== 'T001_1' ? (
              <>
                <Action code="orgInfoManagement:blacklist">
                  <Button onClick={this.goBlacklist} className={styles.blacklist}>
                    黑名单
                  </Button>
                </Action>
                <Action code="orgInfoManagement:otheradd">
                  <Button
                    onClick={() => {
                      this.goAddExtemalOrg('other');
                    }}
                    type="primary"
                  >
                    新增机构
                  </Button>
                </Action>
              </>
            ) : (
              <></>
            )
          }
          tableList={
            <>
              {taskTypeCode && taskTypeCode !== 'T001_1' ? (
                <>
                  <Table
                    rowKey={record => record.id}
                    pagination={{
                      showQuickJumper: true,
                      showSizeChanger: true,
                      total: otherMechanismList.total,
                      showTotal: () => `共 ${otherMechanismList.total} 条数据`,
                      // onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
                      pageSize,
                      current: this.state.pageNum,
                    }}
                    dataSource={otherMechanismList.list}
                    columns={otherList}
                    rowSelection={rowSelections}
                    scroll={{ x: otherList.length * 200 }}
                    onChange={this.handleTableChange}
                    loading={loading}
                  />
                  <div className={styles.batch}>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            className={styles.menutextalign}
                            key="1"
                            onClick={() => {
                              this.batchpldelInfo();
                            }}
                          >
                            删除
                          </Menu.Item>
                          <Menu.Item
                            className={styles.menutextalign}
                            key="2"
                            onClick={() => {
                              this.batchBlacklist();
                            }}
                          >
                            黑名单
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={['click']}
                    >
                      <Button>批量操作</Button>
                    </Dropdown>
                  </div>
                </>
              ) : (
                myMechanismList &&
                myMechanismList[0] && (
                  <div className={styles.insideOrg}>
                    <Row>
                      <Col span={4}>
                        <div className={styles.myorgimg}>
                          <img
                            className={styles.img}
                            src={myMechanismList[0] && myMechanismList[0].orgLoge}
                            alt="avatar"
                          />
                        </div>
                      </Col>
                      <Col span={20}>
                        <div className={styles.title}>
                          {myMechanismList[0] && myMechanismList[0].orgName}
                        </div>
                        <div className={styles.website}>
                          {myMechanismList[0] && myMechanismList[0].orgWebSite}
                        </div>
                        <div className={styles.btn}>
                          <Action code="orgInfoManagement:myshow">
                            <a
                              onClick={() =>
                                this.goMyModify(
                                  myMechanismList[0] && myMechanismList[0].id,
                                  '本家机构',
                                  'detail',
                                  myMechanismList[0] && myMechanismList[0].orgName,
                                )
                              }
                            >
                              查看
                            </a>
                          </Action>
                          <Action code="orgInfoManagement:mymodify">
                            <a
                              onClick={() =>
                                this.goMyModify(
                                  myMechanismList[0] && myMechanismList[0].id,
                                  '本家机构',
                                  undefined,
                                  myMechanismList[0] && myMechanismList[0].orgName,
                                )
                              }
                            >
                              修改
                            </a>
                          </Action>
                          {/* <Action code="orgInfoManagement:delete">
                            <a
                              onClick={() =>
                                this.myOrgDelete(myMechanismList[0] && myMechanismList[0].id)
                              }
                            >
                              删除
                            </a>
                          </Action> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              )}
            </>
          }
        />
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  // linkHoc()(
  Form.create()(
    connect(({ orgInfoManagement, loading, publicModel: { publicTas } }) => ({
      orgInfoManagement,
      publicTas,
      loading: loading.effects['orgInfoManagement/getOtherInstituInfor'],
    }))(orgInfoManagement),
  ),
  // ),
);

export default WrappedAdvancedSearchForm;

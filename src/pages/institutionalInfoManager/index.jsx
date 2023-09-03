// 机构信息管理页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { routerRedux } from 'dva/router';
import { Button, Dropdown, Form, Menu, Modal, Tooltip } from 'antd';

import styles from './less/index.less';
import { handleValidator } from '@/utils/utils';
import { Table, Card, CommonSearch } from '@/components';
import List from '@/components/List';
import DynamicHeader from '@/components/DynamicHeader';

@Form.create()
class InstitutionalInfoManager extends Component {
  state = {
    // 页面数据的条数
    pageSize: 10,
    // 当前页数
    pageNum: 1,
    // 展开搜索判断
    isForm: true,
    // 排序
    direction: '',
    // 排序名称
    fieldName: '',
    // 模糊查询
    fuzzy: '',
    checkedArr: [],
    formData: {},
    myList: [
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
      {
        title: '所属组织机构',
        dataIndex: 'parentName',
        sorter: true,
        width: 200,
        render: this.Render,
      },
      {
        title: '资质类型',
        dataIndex: 'orgTypeName',
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
        dataIndex: 'orgOtherCode',
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
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        render: (_, record) => (
          <span>
            <Action code="institutionalInfoManager:myshow">
              <Button
                type="link"
                size="small"
                onClick={() => this.goMyDetails(record, '本家机构')}
              >
                查看
              </Button>
            </Action>
            <Action code="institutionalInfoManager:mymodify">
              <Button
                type="link"
                size="small"
                onClick={() => this.goMyModify(record, '本家机构')}
              >
                修改
              </Button>
            </Action>
            <Action code="institutionalInfoManager:delete">
              <Button type="link" size="small" onClick={() => this.myOrgDelete(record)}>
                删除
              </Button>
            </Action>
          </span>
        ),
      },
    ],
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
      {
        title: '所属组织机构',
        dataIndex: 'parentName',
        sorter: true,
        width: 200,
        render: this.Render,
      },
      {
        title: '资质类型',
        dataIndex: 'orgTypeName',
        sorter: true,
        width: 200,
        render: this.Render,
      },
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
              <Action code="institutionalInfoManager:othershow">
                <Button
                  type="link"
                  size="small"
                  onClick={() => this.goMyDetails(record, '其他机构')}
                >
                  查看
                </Button>
              </Action>
              <Action code="institutionalInfoManager:othermodify">
                <Button
                  type="link"
                  size="small"
                  disabled={record.status == '1'}
                  onClick={() => this.goMyModify(record, '其他机构')}
                >
                  修改
                </Button>
              </Action>
              <Action code="institutionalInfoManager:examine">
                <Button
                  type="link"
                  size="small"
                  disabled={record.status == '1'}
                  onClick={() => {
                    this.examine(record, '0');
                  }}
                >
                  审核
                </Button>
              </Action>
              <Action code="institutionalInfoManager:examine">
                <Button
                  type="link"
                  size="small"
                  disabled={record.status == '0'}
                  onClick={() => {
                    this.examine(record, '1');
                  }}
                >
                  反审核
                </Button>
              </Action>
              <Action code="institutionalInfoManager:delete">
                <Button
                  type="link"
                  size="small"
                  disabled={record.status == '1'}
                  onClick={() => this.otherOrgDelete(record)}
                >
                  删除
                </Button>
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
    this.otherOrgList();
    this.getCodeList();
    this.getSuperiorOrg();
    sessionStorage.removeItem('keyValue');
  }

  // 条件查询重置
  handleReset = () => {
    this.setState(
      { formData: {}, pageNum: 1, pageSize: 10, fieldName: '', direction: '', fuzzy: '' },
      () => this.otherOrgList(),
    );
  };

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
      ...formData,
    };
    if (direction) {
      payload.direction = direction;
      payload.fieldName = fieldName;
    }
    if (val) {
      payload.fuzzy = fuzzy;
    }
    dispatch({
      type: 'institutionalInfoManager/getOtherInstituInfor',
      payload,
    });
  }

  /**
   * 上级机构
   * @method getCodes
   */
  getSuperiorOrg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'institutionalInfoManager/superiorOrgList',
    });
  };

  /**
   * 通过字典获取机构类型/资质类型
   * @method getCodeList
   */
  getCodeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'institutionalInfoManager/getCodeList',
      payload: ['J001', 'J004'],
    });
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
        this.otherOrgList();
      },
    );
  };

  /**
   * @method goOtherAddOrg 跳转新增页面
   */
  goOtherAddOrg() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        title: '1',
        pathname: '/productDataManage/institutionalInfoManager/index/addOrganization',
      }),
    );
  }

  goModify = record => {
    const { dispatch } = this.props;
    sessionStorage.setItem('orgName', record.orgName);
    sessionStorage.setItem('id', record.id);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/addOrganization',
        query: {
          id: record.id,
          type: 'othermodify',
        },
      }),
    );
  };

  /**
   * @method goMyDetails 跳转本家查看页
   */
  goMyDetails = (record, name) => {
    const { dispatch } = this.props;
    sessionStorage.setItem('orgName', record.orgName);
    sessionStorage.setItem('id', record.id);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/modify',
        query: {
          id: record.id,
          type: 'details',
          name,
        },
      }),
    );
  };

  /**
   * @method goMyModify 跳转本家修改
   */
  goMyModify = (record, name) => {
    const { dispatch } = this.props;
    sessionStorage.setItem('orgName', record.orgName);
    sessionStorage.setItem('id', record.id);
    const orgCode = record.orgCode || ''
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/index/modify',
        query: {
          id: record.id,
          name,
          orgCode,
        },
      }),
    );
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
          type: 'institutionalInfoManager/examine',
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
   * @method otherOrgDelete 其他机构删除
   */
  otherOrgDelete = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const payload = [record.id];
        dispatch({
          type: 'institutionalInfoManager/otherOrgDelete',
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
   * @method goDetails 跳转查看
   */
  goDetails = record => {
    const { dispatch } = this.props;
    sessionStorage.setItem('orgName', record.orgName);
    sessionStorage.setItem('id', record.id);
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/institutionalInfoManager/details',
        query: {
          id: record.id,
        },
      }),
    );
  };

  /**
   * @method handleClearVal 重置
   */
  handleClearVal = () => {
    this.props.form.resetFields();
  };

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
   * @method handleOpenConditions 展开与收起判断
   */
  handleOpenConditions = () => {
    const { isForm } = this.state;
    this.setState({
      isForm: !isForm,
    });
  };

  handleorgNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '机构名称长度过长');
  };

  handleParentNameValidator = (rule, value, callback) => {
    handleValidator(value, callback, 100, '上级机构长度过长');
  };

  // 批量审核
  plexamineInfo = value => {
    const title = value === '1' ? '反审核' : '审核';
    Modal.confirm({
      title: `请确认是否${title}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const idArr = [];
        this.state.checkedArr.map(item => idArr.push(item.id));
        const payload = {
          orgIds: idArr,
          operation: value * 1,
        };
        dispatch({
          type: 'institutionalInfoManager/toExamines',
          payload,
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [] });
            this.otherOrgList();
          }
        });
      },
    });
  };

  // 批量删除
  pldelInfo = () => {
    const { dispatch } = this.props;
    const idArr = [];
    this.state.checkedArr.map(item => idArr.push(item.id));
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'institutionalInfoManager/otherOrgDelete',
          payload: idArr,
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [] });
            this.otherOrgList();
          }
        });
      },
    });
  };

  Render = text => (
    <Tooltip title={text}>
      {text ? text.toString().replace(/null/g, '-') : text === '' || text === undefined ? '-' : 0}
    </Tooltip>
  );

  selfCallBackHandler = value => {
    this.setState({
      myList: value,
    });
  };

  otherCallBackHandler = value => {
    this.setState({
      otherList: value,
    });
  };

  render() {
    const {
      institutionalInfoManager: { typeList, otherMechanismList, myMechanismList },
      loading,
    } = this.props;
    const { pageSize, myList, otherList } = this.state;
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        this.setState({
          selectedRowKeys,
          checkedArr: selectRows,
        });
      },
    };

    const formItemData = [
      {
        name: 'orgName',
        label: '机构名称',
        type: 'Input',
      },
      {
        name: 'parentName',
        label: '所属组织机构',
        type: 'Input',
      },
      {
        name: 'qualifyTypeCodes',
        label: '机构类型',
        type: 'select',
        config: { mode: 'multiple' },
        option: typeList && typeList.J001,
      },
      {
        name: 'orgTypeCodes',
        label: '资质类型',
        type: 'select',
        config: { mode: 'multiple' },
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
      <>
        <List
          pageCode="institutionalInfoManager_self"
          dynamicHeaderCallback={this.selfCallBackHandler}
          columns={myList}
          taskTypeCode={null}
          title="本家机构"
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData, pageNum: 1, pageSize: 10 }, () => this.otherOrgList());
          }}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder="请输入机构名称/机构简称/机构类型"
          fuzzySearch={val => this.changeKeyWords(val)}
          tableList={
            <>
              <Table
                dataSource={myMechanismList}
                columns={myList}
                scroll={{ x: myList.length * 200 - 100 }}
                loading={loading}
                pagination={false}
              />
            </>
          }
        />
        <Card
          title="其他机构"
          defaultTitle={true}
          style={{
            borderTop: 'none',
            borderRadiusTop: 'none',
            marginTop: 16,
          }}
          extra={
            <>
              <Action code="institutionalInfoManager:otheradd">
                <Button
                  type="primary"
                  onClick={() => this.goOtherAddOrg()}
                // style={{ float: 'right' }}
                >
                  新建机构
                </Button>
              </Action>
              <DynamicHeader
                columns={otherList}
                pageCode="institutionalInfoManager_other"
                callBackHandler={this.otherCallBackHandler}
                taskTypeCode={null}
              />
            </>
          }
        >
          <Table
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              total: otherMechanismList.total,
              showTotal: () => `共 ${otherMechanismList.total} 条数据`,
              // onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
              pageSize: this.state,
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
          <div style={{ marginTop: -50 }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    style={{ textAlign: 'center' }}
                    disabled={this.state.checkedArr.some(item => item.status === '1')}
                    key="0"
                    onClick={() => {
                      this.plexamineInfo('0');
                    }}
                  >
                    审核
                  </Menu.Item>
                  <Menu.Item
                    style={{ textAlign: 'center' }}
                    disabled={this.state.checkedArr.some(item => item.status === '0')}
                    key="1"
                    onClick={() => {
                      this.plexamineInfo('1');
                    }}
                  >
                    反审核
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button>批量操作</Button>
            </Dropdown>
          </div>
        </Card>
      </>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ institutionalInfoManager, loading }) => ({
      institutionalInfoManager,
      loading: loading.effects['institutionalInfoManager/getOtherInstituInfor'],
    }))(InstitutionalInfoManager),
  ),
);

export default WrappedAdvancedSearchForm;

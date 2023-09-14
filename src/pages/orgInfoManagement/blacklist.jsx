//黑名单
import React, { Component } from 'react';
import List from '@/components/List';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  message,
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
} from 'antd';
class blacklist extends Component {
  state = {
    formData: {},
    pageNum: 1,
    pageSize: 10,
    // 列表中选中的数据
    checkedArr: [],
    columns: [
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
              <a
                //   className={styles.operationBtn}
                type="link"
                onClick={() => this.blackList(record)}
              >
                移除
              </a>
            </>
          );
        },
      },
    ],
  };
  componentDidMount = () => {
    this.otherOrgList();
  };
  // 条件查询重置
  // 条件查询重置
  handleReset = () => {
    this.setState({ formData: {}, fieldName: '', direction: '', fuzzy: '' }, () =>
      this.otherOrgList(),
    );
  };
  //批量移入黑名单
  batchBlacklist = () => {
    if (this.state.checkedArr.length <= 0) {
      message.warning('请选择操作的数据');
      return;
    }
    this.blackList();
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
      title: '请确移出黑名单？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'orgInfoManagement/getBlacklist',
          payload: { isBlack: 0, idArr },
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [] });
            this.otherOrgList();
          }
        });
      },
    });
  };
  /**
   * 获取机构列表
   * @method otherOrgList
   */
  otherOrgList(val) {
    const { dispatch } = this.props;
    const { pageNum, pageSize, direction, fieldName, fuzzy, formData } = this.state;
    const payload = {
      isBlack: '1',
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
      type: 'orgInfoManagement/getOtherInstituInfor',
      payload,
    });
  }
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
  render() {
    const { columns, pageSize, pageNum } = this.state;
    const {
      orgInfoManagement: { typeList, otherMechanismList },
    } = this.props;
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
        label: '机构简称',
        type: 'Input',
      },
      {
        name: 'qualifyTypeCodes',
        label: '机构类型',
        type: 'select',
        config: { mode: 'multiple', maxTagCount: 1 },
        option: typeList && typeList.J001,
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
    const pageContainerProps = {
      breadcrumb: [
        {
          title: '产品数据管理',
          url: '',
        },
        {
          title: '机构信息管理',
          url: '/productDataManage/orgInfoManagement/index',
        },
        {
          title: '黑名单',
          url: '',
        },
      ],
    };
    return (
      <div>
        <List
          //   pageCode="blacklist"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          // taskTypeCode={taskTypeCode}
          //   taskArrivalTimeKey="taskTime"
          pageContainerProps={pageContainerProps}
          title={'黑名单'}
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData, pageNum: 1, pageSize: 10 }, () => this.otherOrgList());
          }}
          resetFn={this.handleReset}
          searchPlaceholder="请输入机构名称/机构简称/机构类型"
          fuzzySearch={val => this.changeKeyWords(val)}
          extra={
            <Button type="primary" onClick={this.batchBlacklist}>
              批量移除
            </Button>
          }
          tableList={
            <>
              <Table
                rowKey={record => record.id}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: otherMechanismList.total,
                  showTotal: () => `共 ${otherMechanismList.total} 条数据`,
                  //   onShowSizeChange: this.handleShowSizeChange,
                  //   onChange: this.handlePageNumChange,
                  pageSize,
                  current: pageNum,
                }}
                scroll={{ x: columns.length * 200 }}
                rowSelection={rowSelections}
                columns={columns}
                dataSource={otherMechanismList.list}
                onChange={this.handleTableChange}
                // scroll={{ x: columns.length * 200 + 200 }}
                // loading={loading}
                // rowKey="taskId"
              />
            </>
          }
        />
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(blacklist),
  ),
);

export default WrappedAdvancedSearchForm;

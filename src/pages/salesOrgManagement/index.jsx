// 销售机构管理页面
import React, { Component } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Menu,
  message,
  Modal,
  Pagination,
  Row,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import router from 'umi/router';
import { getDynamicOptColWidth, getSumWidth } from '@/utils/utils';
import styles from './index.less';
import { Card, CommonSearch, Table } from '@/components';
import List from '@/components/List'

const dictList = {
  codeList: 'X001',
};
const channelCode = {
  codeList: 'X002,X010',
};

const Render = (text, record, code, type) => {
  return (
    <Tooltip title={type ? record[code] : text}>
      {type
        ? record[code]
          ? record[code].toString().replace(/null/g, '-')
          : record[code] === '' || record[code] === undefined
          ? '-'
          : 0
        : text
        ? text.toString().replace(/null/g, '-')
        : text === '' || text === undefined
        ? '-'
        : 0}
    </Tooltip>
  );
};

@Form.create()
class SalesOrgManagement extends Component {
  componentDidMount() {
    const { columns } = this.state;
    this.getTableDataList(() => {
      // 设置table scroll的值
      this.setState({
        scrollX: 60 + getSumWidth(columns) + getDynamicOptColWidth(),
      });
    });
    this.getTypeList();
    // this.getDicList();
    this.getListDicList();
  }

  // 方法说明 表格数据查询
  getTableDataList(callback) {
    const { dispatch } = this.props;
    const { direct, oField, page, limit, formData, keyWords } = this.state;

    const params = {
      pageNum: page,
      pageSize: limit,
      keyWords,
      ...formData,
    };
    if (oField) {
      params.field = oField;
    }
    if (direct === 'ascend') {
      params.direction = 'asc';
    } else if (direct === 'descend') {
      params.direction = 'desc';
    }
    dispatch({
      type: `salesOrgManagement/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState(
          {
            tableList: res.data.rows,
            oTotal: res.data.total,
          },
          () => {
            callback && callback();
          },
        );
      }
    });
  }

  // 词汇字典
  getTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: `salesOrgManagement/queryTypeList`,
      payload: {
        codeList: dictList.codeList,
      },
    });
  }

  // 列表渠道类型
  getListDicList() {
    const { dispatch } = this.props;
    dispatch({
      type: `salesOrgManagement/queryListCriteria`,
      payload: {
        codeList: channelCode.codeList,
      },
    });
  }

  /**
   * 方法说明  排序change
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        direct: sorter.order,
        oField: sorter.field,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // getDicList() {
  //   const { dispatch } = this.props;
  //   const params = { fcode: '' };
  //   dispatch({
  //     type: `salesOrgManagement/queryCriteria`,
  //     payload: params,
  //   });
  // }

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
   */
  seachTableData = val => {
    this.setState(
      {
        keyWords: val,
        page: 1,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // 条件查询
  searchBtn = () => {
    this.setState(
      {
        page: 1,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  // 重置
  resetBtn = () => {
    this.props.form.resetFields();
  };

  // //  渠道类型
  // onRadioChange = values => {
  //   const { dispatch } = this.props;
  //   const params = { fcode: values };
  //   const { resetFields } = this.props.form;

  //   dispatch({
  //     type: `salesOrgManagement/queryCriteria`,
  //     payload: params,
  //   }).then(res => {
  //     this.setState({
  //       channelList: res || [],
  //     });
  //     resetFields(['channelTypeList']);
  //   });
  // };

  /* *
   * @method 展开搜索框
   * @param menuCode {string} 菜单
   */
  openConditions = () => {
    const { isOpenFrame } = this.state;
    this.setState({
      isOpenFrame: !isOpenFrame,
    });
  };

  // 跳转新增
  openPage = () => {
    router.push(`/productDataManage/salesOrgManagement/add`);
  };

  // 跳转修改
  updateInfo = item => {
    router.push(`/productDataManage/salesOrgManagement/modify?id=${item.id}`);
  };

  // 查看
  detailInfo = item => {
    router.push(`/productDataManage/salesOrgManagement/details?id=${item.id}`);
  };

  // 审核
  examineInfo = (record, value) => {
    const title = value === '1' ? '反审核' : '审核';
    const { dispatch } = this.props;
    Modal.confirm({
      title: `请确认是否${title}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'salesOrgManagement/queryExamineAPI',
          payload: {
            ids: record.id,
            flag: value * 1,
          },
        }).then(data => {
          if (data) {
            this.getTableDataList();
          }
        });
      },
    });
  };

  // 批量审核
  plexamineInfo = value => {
    const title = value === '1' ? '反审核' : '审核';
    const { dispatch } = this.props;
    const idArr = [];
    // const params ={};
    this.state.checkedArr.map(item => idArr.push(item.id));
    if (!idArr.length) return message.warn('请选择要操作的数据');
    const params = {
      ids: idArr,
      flag: value * 1,
    };
    Modal.confirm({
      title: `请确认是否${title}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'salesOrgManagement/queryExamineAPI',
          payload: params,
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [] });
            this.getTableDataList();
          }
        });
      },
    });
  };

  // 新增协议
  addInfo = record => {
    router.push(
      `/dynamicPage/pages/维护销售协议/4028e7b676216e1b01762c49d4530012/发起流程?saleOrgId=${record.id}`,
    );
  };

  state = {
    isOpenFrame: false,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    isShowModal: false,
    checkedArr: [],
    selectedRowKeys: [],
    scrollX: 0,
    columns: [
      {
        title: '销售机构名称',
        dataIndex: 'sellerNameFull',
        sorter: true,
        width: 400,
        render: Render,
      },
      {
        title: '销售机构简称',
        dataIndex: 'sellerName',
        sorter: true,
        width: 150,
        render: Render,
      },
      {
        title: '销售商代码',
        dataIndex: 'sellerCode',
        sorter: true,
        width: 120,
        render: Render,
      },
      {
        title: '销售商类型',
        dataIndex: 'sellerType',
        sorter: true,
        width: 120,
        render: (text, record) => Render(text, record, 'sellerTypeName', true),
      },
      {
        title: '渠道类型',
        dataIndex: 'channelType',
        sorter: true,
        width: 120,
        render: (text, record) => Render(text, record, 'channelTypeName', true),
      },
      {
        title: '中登结算地点',
        dataIndex: 'zdSettlePlace',
        sorter: true,
        width: 200,
        render: (text, record) => Render(text, record, 'zdSettlePlaceName', true),
      },
      {
        title: '客服电话',
        dataIndex: 'customerPhone',
        sorter: true,
        width: 200,
        render: Render,
      },
      {
        title: '网址',
        dataIndex: 'website',
        sorter: true,
        width: 200,
        render: Render,
      },
      {
        title: '状态',
        dataIndex: 'checked',
        sorter: true,
        width: 100,
        render: (text, record) => Render(text, record, 'checkedName', true),
      },
      {
        title: '协议状态',
        dataIndex: 'contractStatus',
        sorter: true,
        width: 120,
        render: (text, record) => Render(text, record, 'contractStatusName', true),
      },
      {
        title: '签署时间',
        dataIndex: 'signingTime',
        sorter: true,
        width: 180,
        render: Render,
      },
      {
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        render: (_, record) => {
          return (
            <span>
              <Button type="link" size="small" onClick={() => this.detailInfo(record)}>
                查看
              </Button>
              {record.checked === 'D001_1' ? (
                <Action code="salesOrgManagement:update">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      this.updateInfo(record);
                    }}
                  >
                    修改
                  </Button>
                </Action>
              ) : (
                <Button disabled type="link" size="small">
                  修改
                </Button>
              )}
              {record.checked === 'D001_1' ? (
                <Action code="salesOrgManagement:examine">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      this.examineInfo(record, '0');
                    }}
                  >
                    审核
                  </Button>
                </Action>
              ) : (
                <Button disabled type="link" size="small">
                  审核
                </Button>
              )}
              {record.checked === 'D001_2' ? (
                <Action code="salesOrgManagement:examine">
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      this.examineInfo(record, '1');
                    }}
                  >
                    反审核
                  </Button>
                </Action>
              ) : (
                <Button disabled type="link" size="small">
                  反审核
                </Button>
              )}
              {record.checked === 'D001_1' ? (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    this.delInfo(record);
                  }}
                >
                  删除
                </Button>
              ) : (
                <Button disabled type="link" size="small">
                  删除
                </Button>
              )}
              {(record.sellerType === 'X010' && record.checked === 'D001_1') ||
              record.sellerType === 'X002' ? (
                <Button disabled type="link" size="small">
                  新增协议
                </Button>
              ) : (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    this.addInfo(record);
                  }}
                >
                  新增协议
                </Button>
              )}
            </span>
          );
        },
      },
    ],
    formData: {},
  };

  // 删除
  delInfo(item) {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'salesOrgManagement/getDeleteFunc',
          payload: {
            ids: item.id,
          },
        }).then(data => {
          if (data) {
            this.getTableDataList();
          }
        });
      },
    });
  }

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      salesOrgManagement: { sellerList, channelTypeList },
    } = this.props;
    // const { channelList } = this.state;
    const a = channelTypeList.X010 || [];
    const b = channelTypeList.X002 || [];
    const c = a.concat(b);

    /* const { } = this.props; */
    const { tableList, oTotal, page, isShowModal, columns, scrollX } = this.state;
    const { loading } = this.props;

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        this.setState({
          selectedRowKeys,
          checkedArr: selectRows,
        });
      },
    };

    const baseTable = () => {
      return (
        <>
          <Table
            rowSelection={rowSelection}
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: scrollX }}
            onChange={this.handleTableChange}
            loading={loading}
            rowKey="id"
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
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      value="0"
                      onClick={() => {
                        this.plexamineInfo('0');
                      }}
                      style={{ textAlign: 'center' }}
                    >
                      审核
                    </Menu.Item>
                    <Menu.Item
                      value="1"
                      onClick={() => {
                        this.plexamineInfo('1');
                      }}
                      style={{ textAlign: 'center' }}
                    >
                      反审核
                    </Menu.Item>
                  </Menu>
                }
                placement="topLeft"
              >
                <Button style={{ marginRight: 10, width: 100, height: 26 }}>批量操作</Button>
              </Dropdown>
            </Row>
          ) : (
            ''
          )}
        </>
      );
    };

    const formItemData = [
      {
        name: 'sellerNameFull',
        label: '销售机构名称',
        type: 'input',
      },
      {
        name: 'sellerName',
        label: '销售机构简称',
        type: 'input',
      },
      {
        name: 'sellerCode',
        label: '销售商代码',
        type: 'input',
      },
      {
        name: 'sellerTypeList',
        label: '销售商类型',
        type: 'select',
        option: sellerList,
        config: { mode: 'multiple' },
        readSet: { name: 'name', code: 'code' },
      },
      {
        name: 'channelTypeList',
        label: '渠道类型',
        type: 'select',
        option: c,
        config: { mode: 'multiple' },
        readSet: { name: 'name', code: 'code' },
      },
    ];

    return (
      <>
        <List
          pageCode="salesOrgManagement"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={null}
          title="销售机构管理"
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData });
            this.searchBtn(formData);
          }}
          resetFn={() => {
            this.setState({ formData: {}, oField: '', direct: '', keyWords: '' });
            this.searchBtn();
          }}
          searchInputWidth="300"
          searchPlaceholder="请输入销售机构名称/销售机构简称/销售机构代码"
          fuzzySearch={val => this.seachTableData(val)}
          extra={
            <Action code="salesOrgManagement:add">
              <div style={{ textAlign: 'right' }}>
                <div className={styles.addBtn} onClick={this.openPage}>
                  新增
                </div>
              </div>
            </Action>
          }
          tableList={
            <>
              {baseTable()}
              <Modal
                title="审核"
                width={540}
                visible={isShowModal}
                onCancel={() => {
                  this.setState({ isShowModal: false });
                }}
              >
                <>
                  <Row>
                    <Col offset={10} span={5}>
                      审核后数据状态变为“已生效”，确定审核该信息吗？
                    </Col>
                  </Row>
                </>
              </Modal>
            </>
          }
        />
        {/* <CommonSearch
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData });
            this.searchBtn();
          }}
          resetFn={() => {
            this.setState({ formData:{}, oField:"", direct: "", });
            this.searchBtn();
          }}
          searchInputWidth="300"
        /> */}

        {/* <Card
          title="销售机构管理"
          extra={
            <Action code="salesOrgManagement:add">
              <div style={{ textAlign: 'right' }}>
                <div className={styles.addBtn} onClick={this.openPage}>
                  新增
                </div>
              </div>
            </Action>
          }
        >
          {baseTable()}
          <Tabs style={{ marginBottom: 20,marginTop:5, }} tabBarExtraContent={this.setOperations()} >
            {baseTable()}
            </Tabs>
        </Card>
        <Modal
          title="审核"
          width={540}
          visible={isShowModal}
          onCancel={() => {
            this.setState({ isShowModal: false });
          }}
        >
          <>
            <Row>
              <Col offset={10} span={5}>
                审核后数据状态变为“已生效”，确定审核该信息吗？
              </Col>
            </Row>
          </>
        </Modal> */}
      </>
    );
  }
}

const WrappedSingleForm = Form.create()(
  linkHoc()(
    connect(({ salesOrgManagement, loading }) => ({
      salesOrgManagement,
      loading: loading.effects['salesOrgManagement/handleTableDataList'],
    }))(SalesOrgManagement),
  ),
);

export default WrappedSingleForm;

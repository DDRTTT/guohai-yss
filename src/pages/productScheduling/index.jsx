// 产品计划排期表页面
import React, { Component } from 'react';
import { Button, Col, Form, Modal, Pagination, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import Action from '@/utils/hocUtil';
import router from 'umi/router';
import { tableRowConfig } from '@/pages/investorReview/func';
import styles from './index.less';
import { Table, TableBtn } from '@/components';
import List from '@/components/List';
import Gird from '@/components/Gird';

@Form.create()
class ProductScheduling extends Component {
  state = {
    isOpenFrame: false,
    tableList: [],
    oTotal: 10,
    page: 1,
    limit: 10,
    direct: '',
    oField: '',
    isShowModal: false,
    activeItem: null,
    formData: {},
    // checkedArr: [],
  };

  componentDidMount() {
    this.getTableDataList();
    this.getProductList();
  }

  /**
   * 方法说明 表格数据查询
   */
  getTableDataList() {
    const { dispatch } = this.props;
    const { direct, oField, page, limit } = this.state;
    const { formData } = this.state;
    const params = {
      pageNum: page,
      pageSize: limit,
      keyWords: this.state.keyWords,
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
      type: `productScheduling/handleTableDataList`,
      payload: params,
    }).then(res => {
      if (res !== undefined) {
        this.setState({
          tableList: res.data.rows,
          oTotal: res.data.total,
        });
      }
    });
  }

  /**
   * 方法说明  产品名称/产品代码查询
   * @method getProductList
   */
  getProductList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryProductList`,
    });
  }

  /**
   * 方法说明  获取事项类型列表
   */
  getmatterLebel() {
    const { dispatch } = this.props;
    dispatch({
      type: `productScheduling/queryMatterLebel`,
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

  /**
   * 新增
   * @method  setOperations
   */
  setOperations = () => {
    return (
      <Action code="productScheduling:add">
        <div style={{ textAlign: 'right' }}>
          {/* <Switch
            checkedChildren={<Icon type="calendar" />}
            unCheckedChildren={<Icon type="unordered-list" />}
            style={{ marginRight: 10 }}
            defaultChecked
            onChange={value => {
              if (!value) {
                router.push('/taskCenter/productScheduling/calendar');
              }
            }}
          /> */}
          {/* <div style={{ textAlign: 'right' }}>
                <div className={styles.addBtn} onClick={this.openPage}>
                  新增
                </div>
              </div> */}
          <div style={{ textAlign: 'right' }}>
            <div onClick={this.openPage} className={styles.addBtn}>
              新增
            </div>
          </div>
        </div>
      </Action>
    );
  };

  // 条件查询
  handlerSearch = fieldsValue => {
    this.setState(
      {
        page: 1,
        formData: fieldsValue,
      },
      () => {
        this.getTableDataList();
      },
    );
  };

  handleReset = ()=> {
    this.setState(
      {
        page: 1,
        formData: {},
        keyWords: "",
      },
      () => {
        this.getTableDataList();
      },
    );
  }

  proNameChange = val => {
    this.props.form.setFieldsValue({
      proCode: val,
    });
  };

  // 产品全称产品code大写
  productFilterOption = (input, option) => {
    const label = option.props.children;
    const { value } = option.props;
    return (
      label
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      value
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase())
    );
  };

  // 确认删除
  onConfirmDel = record => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: `请确认是否删除?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'productScheduling/queryProductDel',
          payload: record.id,
        }).then(res => {
          if (res && res.status === 200) {
            // this.setState({
            //   isShowModal: !isShowModal,
            // });
            this.getTableDataList();
          }
        });
      },
    });
  };

  // 跳转新增
  openPage = () => router.push(`/taskCenter/productScheduling/calendar/add`);

  // 查看
  dealTask(item) {
    const { isShowModal } = this.state;
    this.setState({
      isShowModal: !isShowModal,
      activeItem: { ...item },
    });
  }

  // 跳转修改
  openEditPage = item => {
    router.push(`/taskCenter/productScheduling/calendar/modify?id=${item.id}`);
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
          type: 'productScheduling/queryExamineAPI',
          payload: {
            id: record.id,
            checked: value * 1,
          },
        }).then(data => {
          if (data) {
            this.getTableDataList();
          }
        });
      },
    });
  };

  // 产品看板
  // dealLook(item) {
  //   router.push(`/productLifecycle/productBillboard/productData?proCode=${item.proCode}&key=3&childKey=agSet`)
  // }

  render() {
    /* const { } = this.props; */
    const { tableList, oTotal, page, activeItem, isShowModal } = this.state;
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'proNames',
        key: 'proNames',
        sorter: true,
        ...tableRowConfig,
        width: 400,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        key: 'proTypeName',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '投资类型',
        dataIndex: 'proArchivalTypeName',
        key: 'proArchivalTypeName',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '产品归属部门',
        dataIndex: 'proBelongDepartmentNames',
        key: 'proBelongDepartmentNames',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '所属TA',
        dataIndex: 'proTa',
        key: 'proTa',
        sorter: true,
        width: 180,
        render: (_, record) => {
          return (
            <Tooltip title={record.proTaName} placement="topLeft">
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
                {record.proTaName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '募集开始日',
        dataIndex: 'recSdate',
        key: 'recSdate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '募集结束日',
        dataIndex: 'recEdate',
        key: 'recEdate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '计划成立日',
        dataIndex: 'proCdate',
        key: 'proCdate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '成立备案联系人',
        dataIndex: 'proRecordContactor',
        key: 'proRecordContactor',
        sorter: true,
        width: 180,
        render: (_, record) => {
          return (
            <Tooltip title={record.proRecordContactorNames} placement="topLeft">
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
                {record.proRecordContactorNames}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '预计自有资金参与日',
        dataIndex: 'canOwnfundPartDate',
        key: 'canOwnfundPartDate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '最晚自有资金公告日',
        dataIndex: 'canOwnfundNoticeDate',
        key: 'canOwnfundNoticeDate',
        sorter: true,
        ...tableRowConfig,
      },
      {
        title: '询证函是否寄出',
        dataIndex: 'councilSendFlag',
        key: 'councilSendFlag',
        sorter: true,
        width: 180,
        render: (_, record) => {
          return (
            <Tooltip title={record.councilSendFlagName} placement="topLeft">
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
                {record.councilSendFlagName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        sorter: true,
        ...tableRowConfig,
      },
      {
        key: 'id',
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        width: 260,
        render: (text, record) => {
          const userId = JSON.parse(sessionStorage.getItem('USER_INFO'));
          return (
            <TableBtn 
              config={[
                {name:"查看", Action:true, code:"productScheduling:detail", click:() => this.dealTask(record)},
                {name:"修改", disabled: !(record.checked === 'D001_1' && record.creatorId == userId.id), Action:true, code:"productScheduling:update", click:() => this.openEditPage(record)},
                {name:"删除", disabled: !(record.checked === 'D001_1' && record.creatorId == userId.id), Action:true, code:"productScheduling:delete", click:() => this.onConfirmDel(record)},
                {name:"审核", disabled: !(record.checked === 'D001_1' && record.creatorId == userId.id), Action:true, code:"productScheduling:check", click:() => this.examineInfo(record, '0')},
                {name:"反审核", disabled: !(record.checked === 'D001_2' && record.creatorId == userId.id), Action:true, code:"productScheduling:deCheck", click:() => this.examineInfo(record, '1')},
              ]}
            />
          );
        },
      },
    ];

    const baseTable = () => {
      const { loading = true } = this.props;
      return (
        <>
          <Table
            bordered
            dataSource={tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: columns.length * 200 + 200 }}
            onChange={this.handleTableChange}
            loading={loading}
            rowKey="id"
            rowClassName={(record, index) => {
              let className = '';
              if (index % 2 === 1) className = 'bgcFBFCFF';
              return className;
            }}
          />
          {tableList && tableList.length !== 0 && (
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
            </Row>
          )}
        </>
      );
    };
    const {
      productScheduling: { productList },
    } = this.props;
    // 菜单配置
    const formItemData = [
      {
        name: 'proCode',
        label: '产品名称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productList || [],
      },
      {
        name: 'ta',
        label: '所属TA',
        type: 'select',
        readSet: { name: 'name', code: 'code'},
        config: { mode: 'multiple' },
        option: [
          { name: '分TA', code: '0' },
          { name: '自TA', code: '1' },
        ],
      },
    ];

    // 弹窗配置-产品计划排期表-查看基本信息
    const drawerConfig = [
      { label: '产品名称', value: 'proNames'},
      { label: '产品代码', value: 'proCode'},
      { label: '产品类型', value: 'proTypeName'},
      { label: '投资类型', value: 'proArchivalTypeName'},
      { label: '产品归属部门', value: 'proBelongDepartmentNames'},
      { label: '所属TA', value: 'proTaName'},
      { label: '募集开始日', value: 'recSdate'},
      { label: '募集结束日', value: 'recEdate'},
      { label: '计划成立日', value: 'proCdate'},
      { label: '成立备案联系人', value: 'proRecordContactorNames'},
      { label: '是否自有资金参与', value: 'canOwnfundParticipation',type:'select',option:[{name:'是', code: '1'},{name:'否', code: '2'}]},
      { label: '预计自有资金参与日', value: 'canOwnfundPartDate',rule:activeItem && activeItem.canOwnfundParticipation !== '1'},
      { label: '最晚自有资金公告日', value: 'canOwnfundNoticeDate',rule:activeItem && activeItem.canOwnfundParticipation !== '1'},
      { label: '备注', value: 'remarks', proportion: true},
    ]

    return (
      <div>
        <List
           formItemData={formItemData}
           advancSearch={this.handlerSearch}
           resetFn={this.handleReset}
           searchInputWidth="300"
           searchPlaceholder="请输入产品名称/产品代码"
           fuzzySearch= { val => this.seachTableData(val) }
           extra={
            <Action code="productScheduling:add">
              <Button type="primary" onClick={this.openPage} className={'float_r'}>
                新增
              </Button>
            </Action>
           }
           tableList={baseTable()}
        />
        <Modal
          title="查看详情"
          width={900}
          visible={isShowModal}
          onCancel={() => {
            this.setState({ isShowModal: false });
          }}
          footer={[
            // <Button
            //   key="edit"
            //   onClick={() => this.openEditPage(activeItem)}
            //   type="primary"
            //   style={{ float: 'left' }}
            // >
            //   修改
            // </Button>,
            // <Popconfirm
            //   title="确认删除?"
            //   onConfirm={this.onConfirmDel}
            //   okText="确认"
            //   cancelText="取消"
            // >
            //   <Button key="del" style={{ float: 'left' }}>
            //     删除
            //   </Button>
            // </Popconfirm>,
            <Button
              key="close"
              onClick={() => {
                this.setState({ isShowModal: false });
              }}
            >
              关闭
            </Button>,
          ]}
        >
          <Gird config={drawerConfig} col={2} info={activeItem}/>
        </Modal>
      </div>
    );
  }
}

const WrappedSingleForm = Form.create()(
  connect(({ productScheduling, loading }) => ({
    productScheduling,
    loading: loading.effects['productScheduling/handleTableDataList'],
  }))(ProductScheduling),
);

export default WrappedSingleForm;

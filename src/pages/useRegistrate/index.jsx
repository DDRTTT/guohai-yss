/**
 * 用印登记页面
 */
import React, { Component } from 'react';
import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip
} from 'antd';
import { connect } from 'dva';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import record from '../electronicRecord/record';
import { Card, Table, TableBtn } from '@/components';
import Gird from '@/components/Gird';
import List from '@/components/List';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
// 新版用印登记
class Index extends Component {
  state = {
    expand: false,
    keyWords: '',
    proCodes: [],
    moduleCodes: [],
    pageNum: 1,
    pageSize: 10,
    visible: false,
    spinning: false,
    fileList: [],
    successFlag: false,
    batch: '',
    subjectName: '',
    subjectCode: '',
    moduleName: '',
  };

  /**
   * @method 生命周期钩子函数
   */
  componentDidMount() {
    // 获取主表格数据
    this.getTableList();
    // 获取产品下拉列表
    this.getProductList();
    // 获取流程名称下拉列表
    this.queryStatusList();
    // 获取印章种类下拉列表
    this.getSealTypeList();
    // 获取印章名下拉列表
    this.getSealNameList();
    // 获取审批人下拉列表
    this.getApproverList();
    // 获取用印申请人下拉列表
    this.getPersonList();
    // 获取承办人/合同责任人下拉列表
    this.getOAPersonList();
    // 获取合同类型/收付款类型下拉列表
    this.queryItemsList();
  }

  // 获取印章种类下拉列表
  getSealTypeList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getSealTypeList',
      payload: {},
    });
  }

  // 获取印章名下拉列表
  getSealNameList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getSealNameList',
      payload: {},
    });
  }

  // 获取审批人下拉列表
  getApproverList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getApproverList',
      payload: {},
    });
  }

  // 获取用印申请人下拉列表
  getPersonList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getPersonList',
      payload: {},
    });
  }

  // 获取承办人/合同责任人下拉列表
  getOAPersonList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getOAPersonList',
      payload: {},
    });
  }

  // 获取合同类型/收付款类型下拉列表
  queryItemsList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/queryItemsList',
      payload: {},
    });
  }

  // 获取流程名称下拉列表
  queryStatusList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/queryStatusList',
      payload: {},
    });
  }

  // 获取产品下拉列表
  getProductList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'useRegistrate/getProductList',
      payload: {},
    });
  }

  // 获取表格数据
  getTableList() {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    const payload = {
      keyWords: this.state.keyWords,
      proCodes: this.state.proCodes,
      moduleCodes: this.state.moduleCodes,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    dispatch({
      type: 'useRegistrate/getTableList',
      payload,
      callback: () => {
        this.setState({ loading: false });
      },
    });
  }

  // 搜索关键字查询
  changekeyWords = value => {
    this.setState(
      {
        keyWords: value,
        proCodes: [],
        moduleCodes: [],
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.getTableList();
      },
    );
  };

  /**
   * @method 查询
   * @param fieldsValue
   */
  handlerSearch = fieldsValue => {
    const { proCodes, moduleCodes } = fieldsValue || {};
    this.setState(
      {
        keyWords: '',
        proCodes,
        moduleCodes,
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.getTableList();
      },
    );
  };

  handleReset = () =>{
    this.setState(
      {
        keyWords: '',
        proCodes:[],
        moduleCodes:[],
        pageNum: 1,
        pageSize: 10,
      },
      () => {
        this.getTableList();
      },
    );
  }

  // 切换页码和页大小
  changePage = (pagesNum, pageSize) => {
    this.setState(
      {
        pageNum: pagesNum,
        pageSize,
      },
      () => {
        this.getTableList();
      },
    );
  };

  // 下拉筛选匹配
  productFilterOption = (input, option) => {
    const label = option.props.children.toLowerCase();
    const value = option.props.value.toLowerCase();
    const ipt = input.toLowerCase();
    return label.includes(ipt) || value.includes(ipt);
  };

  // 打开抽屉
  showDrawer = record => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      spinning: true,
      successFlag: record.successFlag,
      batch: record.batch,
      busId: record.busId,
      processInstanceId: record.processInstanceId,
      taskId: record.taskId,
    });
    const params = {
      busId: record.busId,
      processInstanceId: record.processInstanceId,
      taskId: record.taskId,
    };
    dispatch({
      type: 'useRegistrate/getDetailForSpecifyBatch',
      payload: params,
      callback: () => {
        this.setState({
          spinning: false,
        });
      },
    });
  };

  // 关闭抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 重新发送OA
  sendOA = (record, type) => {
    const { dispatch } = this.props;
    let params = {};
    if (type == 1) {
      params = {
        busId: record.busId,
        processInstanceId: record.processInstanceId,
        taskId: record.taskId,
      };
    } else {
      params = {
        busId: this.state.busId,
        processInstanceId: this.state.processInstanceId,
        taskId: this.state.taskId,
      };
    }

    confirm({
      title: '提示信息',
      content: `请确认要针对该条数据重新发送OA吗？`,
      okText: '确 认',
      cancelText: '取 消',
      onOk: () => {
        this.setState({
          loading: true,
        });
        dispatch({
          type: 'useRegistrate/resend2OA',
          payload: params,
          callback: res => {
            this.setState({
              loading: false,
            });
            if (res && res.status == 200) {
              this.setState(
                {
                  visible: false,
                },
                () => {
                  this.getTableList();
                },
              );
            }
          },
        });
      },
      onCancel() {},
    });
  };

  // 文件列表表头
  fileListColumns = () => {
    return [
      {
        title: '文件名称',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      // {
      //   title: '文件类型',
      //   dataIndex: 'fileType',
      //   key: 'fileType',
      // },
      {
        title: '文件格式',
        dataIndex: 'fileFormat',
        key: 'fileFormat',
      },
      // {
      //   title: '文件来源',
      //   dataIndex: 'source',
      //   key: 'source',
      // },
    ];
  };

  // 点击+展开
  onExpand = record => {
    this.setState({
      subjectName: record.subjectName,
      subjectCode: record.subjectCode,
      moduleName: record.moduleName,
    });
  };

  // 二级表格
  expandedRowRender = record => {
    const columns = [
      {
        title: '批次',
        key: 'batch',
        width: 100,
        render: record => <span>第{record.batch}批次</span>,
      },
      {
        title: '用印说明',
        key: 'sealRegisterRemark',
        render: record => (
          <span>{record.sealRegisterRemark ? record.sealRegisterRemark : '-'}</span>
        ),
      },
      {
        title: '用印状态',
        key: 'successFlag',
        width: 140,
        render: record => record.successFlag ? <div className="success">用印成功</div> : <div className="error">用印失败</div>
      },
      {
        title: '操作',
        key: 'operation',
        width: 220,
        render: record => (
          <TableBtn 
            config={[
              {name:"查看", Action:true, code:"useRegistrate:detail", click:() => this.showDrawer(record)},
              {name:"重新发送OA", disabled: record.successFlag == true, Action:true, code:"useRegistrate:send", click:() => this.sendOA(record, '1')},
            ]}
          />
        ),
      },
    ];
    return <Table style={{marginTop:0,marginBottom:0}} columns={columns} dataSource={record.resultList || []} pagination={false} />;
  };

  // 一级表格
  NestedTable = (tableList, total, pageNum, pageSize, loading) => {
    const columns = [
      {
        title: '主体名称',
        dataIndex: 'subjectName',
        key: 'subjectName',
        render: subjectName => <span>{subjectName || '-'}</span>,
      },
      {
        title: '主体代码',
        dataIndex: 'subjectCode',
        key: 'subjectCode',
        width: '400px',
        render: subjectCode => <span>{subjectCode || '-'}</span>,
      },
      {
        title: '流程名称',
        dataIndex: 'moduleName',
        key: 'moduleName',
        render: moduleName => <span>{moduleName || '-'}</span>,
      },
    ];
    return (
      <>
        <Table
          className="components-table-demo-nested"
          loading={loading}
          pagination={false}
          columns={columns}
          expandedRowRender={record => this.expandedRowRender(record)}
          onExpand={record => this.onExpand(record)}
          rowKey={record => record.busId + record.processInstanceId}
          dataSource={tableList || []}
        />
        {tableList && tableList.length !== 0 ? (
          <Row style={{ paddingTop: 20 }}>
            <Pagination
              style={{ float: 'right' }}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['10', '20', '30', '40']}
              total={total}
              current={pageNum}
              pageSize={pageSize}
              onShowSizeChange={this.changePage}
              onChange={this.changePage}
              showTotal={total => `共 ${total} 条数据`}
            />
          </Row>
        ) : (
          ''
        )}
      </>
    );
  };

  /**
   * @method 渲染模板
   */
  render() {
    const {
      total,
      tableList,
      productList,
      statusList,
      sealTypeList,
      sealNameList,
      approvalList,
      OAPersonList,
      personList,
      contractTypeList,
      payTypeList,
      detailInfo: { sealRegisterRemark, usingFileList, usingRegistrationInfoList, usingApplyTitle  },
    } = this.props.useRegistrate;
    const { pageNum, pageSize, loading } = this.state;

    // 菜单配置
    const formItemData = [
      {
        name: 'proCodes',
        label: '产品全称',
        type: 'select',
        readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
        config: { mode: 'multiple' },
        option: productList || [],
      },
      {
        name: 'moduleCodes',
        label: '流程名称',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple' },
        option: statusList.dataSource || [],
      },
    ];

    // 弹窗配置-用印基本信息
    const drawerConfigForSeal = [
      { label: '是否合同协议', value: 'iscontractagreement',type:'select',option:[{name:'合同协议', code: '1'},{name:'非合同协议', code: '2'}]},
      { label: '用印单位', value: 'usingunit'},
      { label: '用印内容', value: 'usingcontent'},
      { label: '审批形式', value: 'approvalform',type:'select',option:[{name:'OA审批', code: '1'},{name:'纸质审批', code: '2'}]},
      { label: '是否电子印章', value: 'isues',type:'select',option:[{name:'是', code: '1'},{name:'否', code: '0'}]},
      { label: '印章种类', value: 'sealtype',type:'multiple', option: sealTypeList || []},
      { label: '印章名', value: 'sealname', type:'multiple', option: sealNameList || []},
      { label: '审批人', value: 'approver',type:'select',option:approvalList || []},
      { label: '用印份数（份）', value: 'sealsnumber'},
      { label: '用印申请人', value: 'applicantseal',type:'select',option: personList || [],optionConfig:{name:'username',code:'id'}},
      { label: '承办人', value: 'promoter',type:'select',option: OAPersonList || [],optionConfig:{name:'username',code:'oaUsernum'}},
      { label: '备注', value: 'remark', proportion: true},
    ]

    // 弹窗配置-合同基本信息
    const drawerConfigForContract = [
      { label: '合同类型', value: 'contracttype',type:'select',option: contractTypeList || []},
      { label: '合同名称', value: 'contractname'},
      { label: '签订方', value: 'partiessign'},
      { label: '合同责任人', value: 'contractresponsible',type:'select',option: OAPersonList || [],optionConfig:{name:'username',code:'oaUsernum'}},
      { label: '签约日期', value: 'signingdate'},
      { label: '合同期限', value: 'contractdeadline'},
      { label: '合同开始日期', value: 'contractstartdate'},
      { label: '合同截止日期', value: 'contractenddate'},
      { label: '收付款类型', value: 'paymenttype',type:'select',option: payTypeList || []},
      { label: '合同金额(元)', value: 'contractamount'},
    ]

    return (
      <>
        <List
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          searchPlaceholder='请输入产品全称/产品代码/流程名称'
          fuzzySearch= {value => { this.changekeyWords(value) }}
          tableList ={this.NestedTable(tableList, total, pageNum, pageSize, loading)}
        />
        {/* title={`第${this.state.batch}批次`} */}
        <Drawer
          width="80%"
          placement="right"
          closable={true}
          getContainer={'body'}
          onClose={this.onClose}
          visible={this.state.visible}
          style={{ position: 'absolute' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 10001,
            }}
          >
            <Spin spinning={this.state.spinning} />
          </div>
          <div style={{ height: '50px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                lineHeight: '50px',
                padding: '0 15px',
                borderTop: '1px solid #e9e9e9',
                background: '#fff',
                textAlign: 'left',
                zIndex: 1001,
              }}
            >
              <b>{`第${this.state.batch}批次`}</b>
              <Icon type="close" onClick={this.onClose} />
            </div>
          </div>
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <b>用印标题：</b>
              <span>{usingApplyTitle}</span>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <b>用印说明：</b>
              <span>{sealRegisterRemark}</span>
            </Col>
          </Row>
          {usingRegistrationInfoList &&
            usingRegistrationInfoList.length > 0 &&
            usingRegistrationInfoList.map((item, index) => (
              <Card title={`第${index + 1}条登记信息`} defaultTitle={true} style={{ marginTop: 20 }} key={index}>
                <b>用印基本信息</b>
                <Gird config={drawerConfigForSeal} info={item}/>
                {item.iscontractagreement === 1 && (
                  <>
                    <b>合同详细信息</b>
                    <Gird config={drawerConfigForContract} info={item}/>
                  </>
                )}
              </Card>
            ))}

          <Card title="用印文件列表" defaultTitle={true} style={{ marginTop: 20 }}>
            <Table
              dataSource={usingFileList}
              columns={this.fileListColumns(record)}
              pagination={false}
            />
          </Card>
          {!this.state.successFlag ? (
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                zIndex: 1001,
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                取 消
              </Button>
              <Button onClick={() => this.sendOA({}, '2')} type="primary">
                重新发送OA
              </Button>
            </div>
          ) : (
            ''
          )}
        </Drawer>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ useRegistrate, loading }) => ({
        useRegistrate,
        loading: loading.effects['useRegistrate/getTableList'],
      }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

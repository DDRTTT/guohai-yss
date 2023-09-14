//员工管理
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Table,
  Row,
  Col,
  Input,
  TreeSelect,
  Upload,
  Button,
  Icon,
  message,
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { getAuthToken } from '@/utils/session';
import { handleTableCss } from '../../manuscriptBasic/func';
import AddEmployee from './addEmployee';
import { downloadNoToken } from '@/utils/download';
import styleSetPanel from '@/pages/operatingCalendar/setPanel/styleSetPanel';
import styles from '../index.less';
const token = getAuthToken();
@Form.create()
class employeeManage extends Component {
  state = {
    emppageNum: 1,
    emppageSize: 10,
    addContactsShow: false,
    //部门
    department: [],
  };
  componentDidMount() {
    this.getStafList();
    this.getDepartment();
  }
  onChange = info => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.response && info.file.response.status === 200) {
      message.success(`${info.file.name} 文件上传成功`);
      this.getStafList();
    } else if (info.file.response && info.file.response.status === 500) {
      message.error(info.file.response.message);
    }
  };
  //新增打开
  showEmployModal = record => {
    this.setState({
      details: false,
      record,
      addContactsShow: true,
    });
  };
  //查看
  staffView = record => {
    this.setState({
      details: true,
      record,
      addContactsShow: true,
    });
  };
  //新增关闭
  onOk = () => {
    this.setState(
      {
        addContactsShow: false,
      },
      () => this.getStafList(),
    );
  };
  // 员工查询
  employeeSearch = () => {
    this.setState(
      {
        emppageNum: 1,
        emppageSize: 10,
      },
      () => {
        this.getStafList();
      },
    );
  };
  /**
   * 重置
   * @method handleClearVal
   */
  handleClearVal = () => {
    this.props.form.resetFields();
    this.setState(
      {
        emppageNum: 1,
        emppageSize: 10,
      },
      () => {
        this.getStafList();
      },
    );
  };
  /**
   * 员工列表分页查询
   * @method getStafList
   */
  getStafList() {
    const { dispatch, location } = this.props;
    const { emppageSize, emppageNum } = this.state;
    const values = this.props.form.getFieldsValue();
    const payload = {
      pageNum: emppageNum,
      pageSize: emppageSize,
      orgId: this.props.orgid,
    };
    // if (location.query.id) {
    //   payload.orgId = Number(location.query.id);
    // }
    // payload.orgId = this.props.orgid;
    //参数先写死
    if (values && values.name) {
      payload.name = values.name;
    }
    if (values && values.depIdList) {
      payload.depIdList = [values.depIdList];
    }
    dispatch({
      type: 'orgInfoManagement/getStafList',
      payload,
    });
  }
  // 员工删除
  employeeDelete = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'orgInfoManagement/getEmployeeDelete',
          payload: record.id,
        }).then(data => {
          if (data) {
            this.getStafList();
          }
        });
      },
    });
  };
  //员工部门
  getDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgInfoManagement/getDepartment',
      // type: 'modify/superiorOrgList',
      payload: { needRoot: 0, orgId: this.props.orgid },
    }).then(data => {
      if (data.status === 200) {
        const {
          orgInfoManagement: { department },
        } = this.props;
        this.setState({
          department,
        });
      }
    });
  };
  /**
   * 员工分页/页码切换/排序
   * @method staffTableChange
   */
  staffTableChange = pagination => {
    this.setState(
      {
        emppageNum: pagination.current,
        emppageSize: pagination.pageSize,
        // direction: sorter.order == 'ascend' ? 'asc' : 'desc',
        // fieldName: sorter.field,
      },
      () => {
        this.getStafList();
      },
    );
  };
  /**
   * 员工下载
   * @method staffDownload
   */
  staffDownload = () => {
    downloadNoToken(`/ams/ams-base-parameter/employee/download`, {
      name: '员工信息模板.xlsx',
    });
  };
  /**
   * 员工信息查询
   * @method employeeInfor
   */
  employeeInfor() {
    const { getFieldDecorator } = this.props.form;
    const { department } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const uploadProps = {
      action: '/ams/ams-base-parameter/employee/import',
      name: 'multipartFile',
      method: 'post',
      headers: {
        Token: token,
      },
    };
    return (
      <>
        <Form {...layout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <Form.Item label="员工姓名" {...formItemLayout}>
                {getFieldDecorator('name', {
                  //   rules: [{ validator: this.handleNameValidator }],
                })(<Input autoComplete="off" allowClear placeholder="请输入员工姓名" />)}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="部门" {...formItemLayout}>
                {getFieldDecorator('depIdList')(
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={department}
                    placeholder="请选择部门"
                    treeDefaultExpandAll
                    // onChange={this.onChange}
                    showSearch
                    treeNodeFilterProp="title"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={4}>
              <span>
                <Button type="primary" onClick={() => this.employeeSearch()}>
                  查 询
                </Button>
                <Button className={styles.reset} onClick={() => this.handleClearVal()}>
                  重 置
                </Button>
              </span>
            </Col>
            <Col md={2} />
            <Col md={2} className={this.props.falg ? styles.displayblock : styles.displaynone}>
              <Button onClick={this.staffDownload}>下载模板</Button>
            </Col>
            <Col md={2} className={this.props.falg ? styles.displayblock : styles.displaynone}>
              <Upload showUploadList={false} {...uploadProps} onChange={this.onChange}>
                <Button>
                  <Icon type="upload" />
                  导入信息
                </Button>
              </Upload>
            </Col>
            <Col span={2} className={this.props.falg ? styles.displayblock : styles.displaynone}>
              <Button type="primary" onClick={() => this.showEmployModal()}>
                新增
              </Button>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
  render() {
    const {
      orgInfoManagement: { stafList },
    } = this.props;
    const { emppageSize, emppageNum, addContactsShow } = this.state;
    const employeeList = [
      {
        title: '姓名',
        dataIndex: 'name',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '性别',
        dataIndex: 'sexName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '员工部门',
        dataIndex: 'depName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '最高学位',
        dataIndex: 'highestDegreeName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '最高学历',
        dataIndex: 'highestEducationName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '是否在职',
        dataIndex: 'isOnJobName',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '任职开始日期',
        dataIndex: 'positionStartDate',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '任职结束日期',
        dataIndex: 'positionEndDate',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '操作',
        fixed: 'right',
        // sorter: true,
        width: 300,
        render: (text, record) => {
          const content = (
            <>
              <a className={styles.tablebtn} type="link" onClick={() => this.staffView(record)}>
                查看
              </a>
              <a
                className={this.props.falg ? styles.tablebtnblock : styles.tablebtnnone}
                type="link"
                onClick={() => this.showEmployModal(record)}
              >
                修改
              </a>
              <a
                className={this.props.falg ? styles.tablebtnblock : styles.tablebtnnone}
                type="link"
                onClick={() => this.employeeDelete(record)}
              >
                删除
              </a>
            </>
          );
          return content;
        },
      },
    ];
    return (
      <div className={styles.employeeManage}>
        {this.employeeInfor()}
        {addContactsShow && (
          <AddEmployee
            record={this.state.record}
            addContactsShow={addContactsShow}
            onOk={this.onOk}
            orgid={this.props.orgid}
            orgName={this.props.orgName}
            detailsFlag={this.state.details}
          />
        )}
        <Table
          rowKey={record => record.id}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            total: stafList.total,
            showTotal: () => `共 ${stafList.total} 条数据`,
            pageSize: emppageSize,
          }}
          dataSource={stafList.rows}
          columns={employeeList}
          scroll={{ x: 1300 }}
          // loading={tableLoading}
          // rowSelection={rowSelection}
          onChange={this.staffTableChange}
        />
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(employeeManage),
  ),
);

export default WrappedAdvancedSearchForm;

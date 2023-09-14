import React from 'react';
import { connect } from 'dva';
import { Button, Form, message, Select } from 'antd';
import { Table } from '@/components';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import InstitutionDetail from '../modal/institutionDetailsModal';
import styles from '../Less/dataLicense.less';
import List from '@/components/List';
const { Option } = Select;

@errorBoundary
@Form.create()
@connect(state => ({
  licenseChecked: state.licenseChecked,
  institutionalDetails: state.institutionalDetails,
  systeam: state.systeam,
}))
export default class LicenseChecked extends BaseCrudComponent {
  state = {
    selectedRows: [],
    status: 1,
    switchstatus: false,
    appedState: 1,
    currentPage: 1,
    pageSize: 10,
    detailModal: false,
    columns: [
      {
        title: '申请机构名称',
        dataIndex: 'appOrgName',
      },
      {
        title: '申请机构代码',
        dataIndex: 'appOrgCode',
      },
      {
        title: '申请时间',
        dataIndex: 'appDate',
      },
      {
        title: '经办人',
        dataIndex: 'appName',
      },
      {
        title: '申请人电话',
        dataIndex: 'appPhone',
      },
      {
        title: '申请机构角色',
        dataIndex: 'appedRoleTypeName',
      },
      {
        title: '申请状态',
        dataIndex: 'appedState',
        render: val => <div>{val == 1 ? '未授权' : val == 2 ? '已授权' : '已驳回'}</div>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        width: '170px',
        fixed: 'right',
        render: (val, record) => (
          <div>
            {/*<a className={styles.fright} onClick={()=>{this.licenseOpt(record,2)}}>授 权</a>*/}
            <a
              className={styles.fright}
              onClick={() => {
                this.seeDetail(record);
              }}
            >
              查 看
            </a>
            <a
              style={{ display: this.state.appedState == 1 ? '' : 'none' }}
              className={styles.fright}
              onClick={() => {
                this.lookDetail(record);
              }}
            >
              授 权
            </a>
            <a
              style={{ display: this.state.appedState == 1 ? '' : 'none' }}
              className={styles.fright}
              onClick={() => {
                this.licenseOpt(record, 3);
              }}
            >
              驳 回
            </a>
          </div>
        ),
      },
    ],
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.licenseChecked.backResultData != 0) {
      // 驳回
      if (nextProps.licenseChecked.backResultData == 1) {
        // nextProps.licenseChecked.backResultData = 0;
        this.setState({
          detailModal: false,
        });
      }
      const _this = this;
      // 授权
      if (nextProps.licenseChecked.backResultData == 2) {
        nextProps.licenseChecked.backResultData = 0;
        dispatch(routerRedux.push('/dataLicense/licenseDetail'));
        _this.setState({
          detailModal: false,
        });
        // confirm({
        //   title: '授权成功是否进行权限配置,如需配置会跳转到配置页面？',
        //   okText:'进入',
        //   cancelText:'取消',
        //   // content: '页面提示',
        //   onOk() {
        //     console.log('OK');
        //     dispatch(routerRedux.push('/dataLicense/licenseDetail'));
        //     // _this.setState({
        //     //   detailModal:false
        //     // })
        //   },
        //   onCancel() {
        //     console.log('Cancel');
        //   },
        // });
      }
    }
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    this.setState({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: `licenseChecked/fetchHasList`,
        payload: values,
      });
    });
  };

  /** *
   * 查询触发
   * @param e
   */
  handleSearch = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    let startDate;
    let endDate;
    if (formValues.configdata) {
      startDate = formValues.configdata[0].format('YYYY-MM-DD');
      endDate = formValues.configdata[1].format('YYYY-MM-DD');
    }
    const values = {
      ...formValues,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      startDate,
      endDate,
    };
    delete values.configdata;
    this.setState({
      formValues: values,
      appedState: values.appedState,
    });
    dispatch({
      type: `licenseChecked/fetchHasList`,
      payload: values,
    });
  };
  //条件查询
  handlerSearch = fieldsValue => {
    this.setState(
      {
        formValues: fieldsValue || {},
      },
      () => {
        this.handleSearch();
      },
    );
  };

  /**  列表操作  * */
  deleteTable = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
      };
      this.setState({
        formValues: values,
      });
      const { newValues } = fieldsValue;
      for (const i in newValues) {
        if (newValues[i] == '' || newValues[i] == undefined) {
          delete newValues[i];
        }
      }
      if (this.state.selectedRows.length == 0) {
        message.error('请选择需删除项');
      } else {
        let list = '';
        for (let i = 0; i < this.state.selectedRows.length; i++) {
          list = `${list + this.state.selectedRows[i].id},`;
        }
        this.state.selectedRows.length = 0;
        list = list.substr(0, list.length - 1);
        dispatch({
          type: 'licenseChecked/del',
          payload: {
            list,
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            appedState: this.state.appedState,
          },
        });
      }
    });
  };

  /**  重置  * */
  handleReset = () => {
    const { dispatch } = this.props;
    this.setState({
      formValues: {},
      appedState: 1,
    });
  };

  getStatus = () => {
    const e = [
      { id: 1, orgName: '未授权' },
      { id: 2, orgName: '已授权' },
      { id: 3, orgName: '已驳回' },
    ];
    const children = [];
    for (const key in e) {
      children.push(
        <Option key={e[key].id} value={e[key].id}>
          {e[key].orgName}
        </Option>,
      );
    }
    return <Select style={{ width: '100%' }}>{children}</Select>;
  };

  // 驳回操作
  licenseOpt = (record, status) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'licenseChecked/opt',
      payload: {
        opt: {
          list: record.id,
          status,
        },
        fetch: {
          currentPage: this.state.currentPage,
          pageSize: this.state.pageSize,
          appedState: this.state.appedState,
        },
      },
    });
  };

  // 批量驳回操作
  licenseOptMore = status => {
    const { dispatch } = this.props;
    let list = '';
    console.log(this.state.selectedRows, 'this.state.selectedRows');
    if (this.state.selectedRows.length == 0) {
      message.error('请选择需审核项');
    } else {
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        list = `${list + this.state.selectedRows[i].id},`;
      }
      // this.state.selectedRows.length = 0;
      dispatch({
        type: 'licenseChecked/opt',
        payload: {
          opt: {
            list,
            status,
          },
          fetch: {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            appedState: this.state.appedState,
          },
        },
      });
    }
  };

  // 用户授权
  lookDetail = record => {
    const { dispatch } = this.props;
    sessionStorage.setItem('licenseCheckedId', record.id);
    sessionStorage.setItem('appId', record.appId);
    sessionStorage.setItem('appOrgId', record.appOrgId);
    dispatch(routerRedux.push('/dataLicense/licenseDetail'));
    this.setState({
      detailModal: false,
    });
  };

  seeDetail = record => {
    const { dispatch } = this.props;
    this.setState({
      detailModal: true,
    });
    dispatch({
      type: 'institutionalDetails/fetch',
      payload: record.id,
    });
  };

  // 弹窗相关操作
  closeModal = () => {
    this.setState({
      detailModal: false,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const basic = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      appedState: this.state.appedState,
    };
    dispatch({
      type: 'licenseChecked/fetchHasList',
      payload: basic,
    });
  }

  // renderAdvancedForm() {
  //   const { getFieldDecorator } = this.props.form;
  //   const showALLform = (
  //     <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //       <Col xxl={6} sm={24} md={12}>
  //         <FormItem label="申请机构名称">
  //           {getFieldDecorator('appOrgName')(<Input placeholder="请输入" />)}
  //         </FormItem>
  //       </Col>
  //       <Col xxl={6} sm={24} md={12}>
  //         <FormItem label="申请时间：">
  //           {getFieldDecorator('configdata')(<RangePicker className={styles.RangePicker} />)}
  //         </FormItem>
  //       </Col>
  //       <Col xxl={6} sm={24} md={12}>
  //         <FormItem label="授权状态">
  //           {getFieldDecorator('appedState', {
  //             initialValue: this.state.appedState,
  //           })(this.getStatus())}
  //         </FormItem>
  //       </Col>
  //       <Col xxl={6} sm={24} md={12}>
  //         <Action key="licenseChecked:query" code="licenseChecked:query">
  //           <Button className={styles.btnStyleLong} type="primary" htmlType="submit">
  //             查询
  //           </Button>
  //         </Action>
  //         <Action key="licenseChecked:query" code="licenseChecked:query">
  //           <Button className={styles.btnStyleLong} onClick={this.handleReset}>
  //             重置
  //           </Button>
  //         </Action>
  //       </Col>
  //     </Row>
  //   );
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       {showALLform}
  //     </Form>
  //   );
  // }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      licenseChecked: { dataHasList },
      institutionalDetails: { modalShow },
    } = this.props;
    const formItemData = [
      {
        name: 'appOrgName',
        label: '申请机构名称',
        type: 'Input',
      },
      {
        name: 'configdata',
        label: '申请时间',
        type: 'RangePicker',
      },
      {
        name: 'appedState',
        label: '授权状态',
        type: 'select',
        readSet: { name: 'orgName', code: 'id' },
        option: [
          { id: 1, orgName: '未授权' },
          { id: 2, orgName: '已授权' },
          { id: 3, orgName: '已驳回' },
        ],
        initialValue: '1',
      },
    ];
    const rowSelections = {
      // selectedRows: this.state.selectedRows,
      onChange: (selectedRows, selectRows) => {
        console.log(selectRows, 'selectRows');
        this.setState({
          selectedRows: selectRows,
        });
      },
    };

    return (
      <div>
        {/* <Card bordered={false} title="授权申请 " style={{ minHeight: 50 }}>
          <div className={styles.tableListForm} style={{ marginTop: 14 }}>
            {this.renderForm()}
          </div>
        </Card> */}
        <div className={styles.table}>
          {/* <Card bordered={false} style={{ marginTop: 24, minHeight: 260 }}> */}
          {/* <StandardTable
              columns={columns}
              currentPage={currentPage}
              selectedRows={selectedRows}
              loading={loading}
              data={dataHasList}
              onSelectRow={this.handleSelectRows}
              onChange={this.pagConfigChange}
            /> */}
          {/* </Card> */}
          <List
            pageCode="licenseChecked"
            //   dynamicHeaderCallback={this.callBackHandler}
            columns={this.state.columns}
            taskTypeCode={null}
            taskArrivalTimeKey="taskTime"
            title={'数据授权审核'}
            fuzzySearchBool={false}
            formItemData={formItemData}
            advancSearch={this.handlerSearch}
            resetFn={this.handleReset}
            searchInputWidth="300"
            // searchPlaceholder="请输入产品全称/产品代码"
            // fuzzySearch={this.changeKeyWords}
            // extra={this.action()}
            tableList={
              <>
                <Table
                  dataSource={dataHasList.data.rows}
                  columns={this.state.columns}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    total: dataHasList.data.total,
                    showTotal: () => `共 ${dataHasList.data.total} 条数据`,
                    // onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
                    pageSize: this.state.pageSize,
                    current: this.state.currentPage,
                  }}
                  scroll={{ x: 2000 }}
                  // loading={loading}
                  rowSelection={rowSelections}
                  // onChange={this.handleStandardTableChange}
                  rowKey={record => record.key}
                />
                <div>
                  <Button
                    type="primary"
                    className={styles.dowmWBRBuutton}
                    // style={{ display: this.state.appedState == 1 ? 'block' : 'none' }}
                    onClick={() => this.licenseOptMore(3)}
                  >
                    {'批量驳回'}
                  </Button>
                </div>
              </>
            }
          />
        </div>
        {/* <div style={{ display: dataHasList.data.total === 0 ? 'none' : 'block' }}>
          <Button
            type="primary"
            className={styles.dowmWBRBuutton}
            style={{ display: this.state.appedState == 1 ? 'block' : 'none' }}
            onClick={() => this.licenseOptMore(3)}
          >
            {'批量驳回'}
          </Button>
        </div> */}
        <InstitutionDetail
          visible={this.state.detailModal}
          data={modalShow}
          closeAdd={this.closeModal}
          licenseOpt={this.licenseOpt}
          lookDetail={this.lookDetail}
          optState={this.state.appedState}
          destroyOnClose
        />
      </div>
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import Action from '@/utils/hocUtil';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import InstitutionDetail from '../modal/institutionDetailsModal';
import styles from '../Less/dataLicense.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.licenseChecked.backResultData != 0) {
      // 驳回
      if (nextProps.licenseChecked.backResultData == 1) {
        nextProps.licenseChecked.backResultData = 0;
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let startDate;
      let endDate;
      if (fieldsValue.configdata) {
        startDate = fieldsValue.configdata[0].format('YYYY-MM-DD');
        endDate = fieldsValue.configdata[1].format('YYYY-MM-DD');
      }
      const values = {
        ...fieldsValue,
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
    });
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
    const basic = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      appedState: 1,
    };
    this.setState({
      appedState: 1,
    });
    this.props.form.resetFields();
    dispatch({
      type: 'licenseChecked/fetchHasList',
      payload: basic,
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
    if (this.state.selectedRows.length == 0) {
      message.error('请选择需审核项');
    } else {
      for (let i = 0; i < this.state.selectedRows.length; i++) {
        list = `${list + this.state.selectedRows[i].id},`;
      }
      this.state.selectedRows.length = 0;
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

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const showALLform = (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col xxl={6} sm={24} md={12}>
          <FormItem label="申请机构名称">
            {getFieldDecorator('appOrgName')(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col xxl={6} sm={24} md={12}>
          <FormItem label="申请时间：">
            {getFieldDecorator('configdata')(<RangePicker className={styles.RangePicker} />)}
          </FormItem>
        </Col>
        <Col xxl={6} sm={24} md={12}>
          <FormItem label="授权状态">
            {getFieldDecorator('appedState', {
              initialValue: this.state.appedState,
            })(this.getStatus())}
          </FormItem>
        </Col>
        <Col xxl={6} sm={24} md={12}>
          <Action key="licenseChecked:query" code="licenseChecked:query">
            <Button className={styles.btnStyleLong} type="primary" htmlType="submit">
              查询
            </Button>
          </Action>
          <Action key="licenseChecked:query" code="licenseChecked:query">
            <Button className={styles.btnStyleLong} onClick={this.handleReset}>
              重置
            </Button>
          </Action>
        </Col>
      </Row>
    );
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {showALLform}
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      licenseChecked: { dataHasList },
      institutionalDetails: { modalShow },
    } = this.props;

    return (
      <div>
        <Card bordered={false} title="授权申请 " style={{ minHeight: 50 }}>
          <div className={styles.tableListForm} style={{ marginTop: 14 }}>
            {this.renderForm()}
          </div>
        </Card>
        <div className={styles.table}>
          <Card bordered={false} style={{ marginTop: 24, minHeight: 260 }}></Card>
        </div>
        <div style={{ display: dataHasList.data.total === 0 ? 'none' : 'block' }}>
          <Button
            type="primary"
            className={styles.dowmWBRBuutton}
            style={{ display: this.state.appedState == 1 ? 'block' : 'none' }}
            onClick={() => this.licenseOptMore(3)}
          >
            {'批量驳回'}
          </Button>
        </div>
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

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import Action from '@/utils/hocUtil';
import { nsHoc } from '@/utils/hocUtil';
// import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';
import pass from '@/assets/registrationReview/pass.png';
import fail from '@/assets/registrationReview/fail.png';
import unaudited from '@/assets/registrationReview/unaudited.png';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { PageContainers } from '@/components';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@errorBoundary
@nsHoc({ namespace: 'institutionalAuditQuery' })
@Form.create()
@connect(state => ({
  institutionalAuditQuery: state.institutionalAuditQuery,
}))
export default class userInfo extends Component {
  state = {
    data: [],
    action: null,
    id: null,
    autoCompleteResult: [],
    switchstatus: false,
    visible: false,
    record: null,
    checked: null,
  };

  componentDidMount() {
    const { dispatch, namespace } = this.props;
    this.handleGetUserInfo();
    // 驳回原因字典
    dispatch({
      type: `${namespace}/handleCheckType`,
    });
  }

  // 获取用户信息
  handleGetUserInfo = () => {
    const { dispatch, namespace } = this.props;
    let registrationReviewFunButtons = JSON.parse(
      sessionStorage.getItem('registrationReviewFunButtons'),
    );
    this.setState({
      id: registrationReviewFunButtons.id,
      checked: registrationReviewFunButtons.checked,
    });
    let id = registrationReviewFunButtons.id;
    dispatch({
      type: `${namespace}/handleCompanyId`,
      payload: id,
    });
    dispatch({
      type: `${namespace}/handleCompanyInfo`,
      payload: id,
    });
  };

  componentWillReceiveProps(props) {
    const {
      institutionalAuditQuery: {
        companyInfo: { data },
      },
    } = props;
    this.setState({
      checked: data[0].checked,
    });
  }

  // 通过
  handleExaminationPassed = () => {
    const {
      institutionalAuditQuery: { companyInfo },
    } = this.props;
    let data = companyInfo.data[0].id;
    let values = {
      list: [data],
      status: 1,
      checkMsg: '默认通过',
    };
    this.handleDispatch(values);
  };

  // 驳回
  handleExaminationFailed = record => {
    this.showModal();
    this.setState({
      record,
    });
  };

  // 显示弹框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // 弹框确认按钮
  handleOk = e => {
    e.preventDefault();
    const {
      institutionalAuditQuery: { companyInfo },
      form,
    } = this.props;
    let data = companyInfo.data[0].id;

    form.validateFields((err, value) => {
      if (err) return;
      let values = Object.assign({}, value);
      this.setState({
        visible: false,
      });
      let val = {
        list: [data],
        status: 2,
        checkMsg: values.checkMsg,
        desc: values.desc,
      };
      this.handleDispatch(val);
    });
  };

  // 取消弹框
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  // 触发 驳回/通过 请求
  handleDispatch = values => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/handleReview`,
      payload: values,
    });
    // setTimeout(() => {
    //   this.handleGetUserInfo();
    // });
  };

  // 按钮
  action = data => {
    const {
      institutionalAuditQuery: { loading },
    } = this.props;
    let checked = this.state.checked;
    if (checked === 0) {
      if (data.checkUser === 0) {
        return (
          <div className={styles.btn}>
            <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:check">
              <Button onClick={this.handleExaminationFailed} type="primary">
                驳回
              </Button>
            </Action>
            {/*<Button onClick={this.showModalclose} type="primary">返回</Button>*/}
          </div>
        );
      } else {
        return (
          <div className={styles.btn}>
            <Action key="institutionalAuditQuery:check" code="institutionalAuditQuery:check">
              <Button onClick={this.handleExaminationPassed} type="primary" loading={loading}>
                通过
              </Button>
              <Button onClick={this.handleExaminationFailed} type="primary">
                驳回
              </Button>
            </Action>
            {/*<Button onClick={this.showModalclose} type="primary">返回</Button>*/}
          </div>
        );
      }
    } else {
      return (
        <div />
        //<Button onClick={this.showModalclose} type="primary">返回</Button>
      );
    }
  };

  // 返回
  showModalclose = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/registrationReview/institutionalAuditQuery'));
  };

  otherRows = data => {
    let checked = this.state.checked;
    if (checked === 2) {
      return (
        <div>
          <Col md={8} sm={24}>
            <FormItem label="驳回原因">
              <strong>{data.checkMsg}</strong>
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="备注">
              <strong>{data.desc}</strong>
            </FormItem>
          </Col>
        </div>
      );
    }
  };

  // selection
  getRejectType(e) {
    let children = [];
    for (let key in e) {
      children.push(
        <Option key={e[key].code} value={e[key].name}>
          {e[key].name}
        </Option>,
      );
    }
    return (
      <Select style={{ width: '100%' }} placeholder="请选择驳回原因">
        {children}
      </Select>
    );
  }

  render() {
    const {
      institutionalAuditQuery: {
        checkType,
        companyInfo: { data },
      },
      form: { getFieldDecorator },
    } = this.props;
    let imgs;
    if (this.state.checked === 0) {
      imgs = <img src={unaudited} alt="未审核" />;
    } else if (this.state.checked === 1) {
      imgs = <img src={pass} alt="审核通过" />;
    } else {
      imgs = <img src={fail} alt="审核驳回" />;
    }
    return (
      <div className={styles.content}>
        <PageContainers
          breadcrumb={[
            {
              title: '系统运营管理',
              url: '',
            },
            {
              title: '注册审核授权',
              url: '/datum/institutionalAuditQuery/index',
            },
          ]}
          fuzz={''}
        />
        {/* <PageHeaderLayout father_url="/base/institutionalAuditQuery"> */}
        <Form onSubmit={this.handlerSave} layout="inline">
          <Card
            bordered={false}
            title="注册信息"
            style={{ marginTop: 24, minHeight: 40, lineHeight: '40px' }}
            extra={this.action(data[0])}
          >
            <Row>
              <Col md={8} sm={24}>
                <FormItem label="企业名称">
                  <strong>{data[0].orgName}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="机构代码">
                  <strong>{data[0].orgCode}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="机构类型">
                  <strong>{data[0].orgTypeName}</strong>
                </FormItem>
              </Col>
            </Row>
            <div className={styles.divider}>
              <Divider />
            </div>
            <Row>
              <Col md={8} sm={24}>
                <FormItem label="用户名">
                  <strong>{data[0].name}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="身份证号码">
                  <strong>{data[0].usernum}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="申请时间">
                  <strong>{data[0].registTime}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="邮箱地址">
                  <strong>{data[0].email}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="手机号码">
                  <strong>{data[0].mobile}</strong>
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="经办人">
                  <strong>{data[0].handler}</strong>
                </FormItem>
              </Col>

              {this.otherRows(data[0])}
            </Row>
            {imgs}
          </Card>
        </Form>
        <Modal
          title="用户注册驳回"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="517px"
          height="307px"
          destroyOnClose
        >
          <Form layout="vertical" style={{ paddingLeft: 114, paddingRight: 114 }}>
            <Row>
              <Col>
                <FormItem label="驳回原因：">
                  {getFieldDecorator('checkMsg', {
                    initialValue: `${checkType[0]['name']}`,
                  })(this.getRejectType(checkType))}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="备注：">{getFieldDecorator('desc')(<TextArea />)}</FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* </PageHeaderLayout> */}
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, Form, message, Row, Steps } from 'antd';
import RelatedProducts from '@/memberManagement/relatedProducts';
import Result from '@/components/Result';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from '../Less/dataLicense.less';
import BaseCrudComponent from '../../Base/BaseCrudComponent';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RoleAuthority from '../assembly/roleAuthority';
// import AuthorizationPad from '../../Base/AuthorizationPad';
import AuthorizationPad from '../assembly/authorityPreview';
import AddRole from '../modal/addRole';
import UpdateAuth from '../modal/updateAuth';

const { Step } = Steps;
const steps = [
  {
    title: '组件权限',
    current: 1,
  },
  {
    title: '产品权限',
    current: 2,
  },
  {
    title: '完成',
    current: 3,
  },
];

@errorBoundary
@Form.create()
@connect(state => ({
  institutionalDetails: state.institutionalDetails,
  orgAuthorize: state.orgAuthorize,
  role: state.role,
  systeam: state.systeam,
  memberManagement: state.memberManagement,
}))
export default class Index extends BaseCrudComponent {
  state = {
    tabNow: 0,
    selectedActions: null,
    addRoleCtrl: false,
    updateAuthCtrl: false,
    // 步骤条
    current: 0,
    child: null,
  };

  stepsFun = item => {
    const {
      role: { allmenutree, actions, emptyRoleData, roleHas },
      dispatch,
      orgAuthorize: { dataPage },
    } = this.props;
    switch (item) {
      case 1:
        return (
          <div>
            <RoleAuthority
              addRoleFun={this.addRole}
              dataPage={dataPage}
              emptyRoleData={emptyRoleData}
            />
            {/** 权限预览* */}
            <AuthorizationPad
              authorizes={allmenutree}
              selectedActions={actions}
              onSelectedActionsChange={this.onSelectedActionsChange}
              allowedModifying={false}
              update
              addRoleFun={this.updateAuth}
              dispatch={dispatch}
              roleHas={roleHas}
            />
          </div>
        );
      case 2:
        return (
          <RelatedProducts
            save={this.save}
            step={this.step}
            sign="dataAuthorization"
            grantApplication
          />
        );
      case 3:
        return <Done />;
      default:
        return <Done />;
    }
  };

  updateAuth = () => {
    const {
      dispatch,
      role: { roleHas },
    } = this.props;
    dispatch({
      type: `role/getAuthorizeByIdModal`,
      payload: roleHas,
    });
    this.setState({
      updateAuthCtrl: true,
    });
  };

  // 权限测试
  onSelectedActionsChange = selectedActions => {
    this.setState({ selectedActions });
  };

  // 关闭修改组件权限弹窗
  closeUpdateAuth = () => {
    this.setState({
      updateAuthCtrl: false,
    });
  };

  // 步骤条function
  save = ref => {
    this.setState({
      child: ref,
    });
  };

  // 步骤
  step = () => {
    const {
      dispatch,
      memberManagement: { saveCurrent },
    } = this.props;
    dispatch({
      type: `memberManagement/handleStep`,
      payload: saveCurrent + 1,
    });
  };

  // 上一步
  prev = () => {
    const {
      dispatch,
      memberManagement: { saveCurrent },
    } = this.props;
    dispatch({
      type: `memberManagement/handleStep`,
      payload: saveCurrent - 1,
    });
  };

  // 下一步
  next = () => {
    const {
      memberManagement: { saveCurrent },
    } = this.props;
    switch (saveCurrent) {
      case 0:
        this.handleSubmitRole();
        break;
      case 1:
        this.state.child.handleSubmit();
        break;
      case 2:
        this.handleSubmitRole();
        break;
      default:
        this.handleSubmitRole();
        break;
    }
  };

  handleSubmit = () => {
    this.state.child1.handleSubmit();
  };

  handleSubmitRole = () => {
    const {
      dispatch,
      institutionalDetails: { modalShow },
      orgAuthorize: { dataPage },
    } = this.props;
    if (dataPage && dataPage.userRole.length > 0) {
      dispatch({
        type: `memberManagement/member`,
        payload: { orgId: modalShow.appOrgId },
      });
      this.step();
    } else {
      message.error('请至少选择一个功能组件');
    }
  };

  addRole = () => {
    this.setState({
      addRoleCtrl: true,
    });
  };

  closeAddRole = () => {
    this.setState({
      addRoleCtrl: false,
    });
  };

  // 取消授权
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleStep`,
      payload: 0,
    });
    dispatch(routerRedux.push('/dataLicense/licenseChecked'));
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.role.addRoleResult == 1) {
      nextProps.role.addRoleResult = 0;
      this.setState({
        addRoleCtrl: false,
      });
      dispatch({
        type: 'orgAuthorize/hasRoleSearch',
      });
    }
    if (nextProps.role.updateRoleResult == 1) {
      nextProps.role.updateRoleResult = 0;
      this.setState({
        updateAuthCtrl: false,
      });
      dispatch({
        type: 'orgAuthorize/hasRoleSearch',
      });
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getEmptyRole',
    });

    dispatch({
      type: 'institutionalDetails/fetch',
      payload: sessionStorage.getItem('licenseCheckedId'),
    });

    dispatch({
      type: 'role/init',
    });
    const firstSysId = values.sysId.split(',')[0];
    dispatch({
      type: `orgAuthorize/queAllData`,
      payload: {
        userAuthedId: sessionStorage.getItem('appId'),
        orgAuthedId: sessionStorage.getItem('appOrgId'),
        sysId: firstSysId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleStep`,
      payload: 0,
    });
  }

  render() {
    const {
      institutionalDetails: { modalShow },
      role: { allmenutree, actions, basics },
    } = this.props;
    const {
      memberManagement: { saveCurrent, loading },
    } = this.props;
    return (
      <PageHeaderLayout father_url="/dataLicense/licenseChecked">
        <Card style={{ marginTop: 24, marginBottom: 24 }} loading={loading}>
          <div style={{ display: this.state.tabNow == 0 ? 'block' : 'none' }}>
            <Row className={styles.rowStyle} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>机构名称: </span>
                  <span title={modalShow.appOrgName} className={styles.Coltext}>
                    {modalShow.appOrgName}
                  </span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>机构代码: </span>
                  <span className={styles.Coltext}>{modalShow.appOrgCode}</span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>申请时间: </span>
                  <span className={styles.Coltext}>{modalShow.appDate}</span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>用户名: </span>
                  <span className={styles.Coltext}>{modalShow.appName}</span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>联系方式: </span>
                  <span className={styles.Coltext}>{modalShow.appPhone}</span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>申请组件: </span>
                  <span className={styles.Coltext}>{modalShow.appOrgTypeName}</span>
                </h3>
              </Col>
              <Col md={8} sm={24}>
                <h3>
                  <span className={styles.Coltitle}>申请描述: </span>
                  <span className={styles.Coltext}>{modalShow.appDesc}</span>
                </h3>
              </Col>
            </Row>
          </div>
          {/*          <div style={{ display: (this.state.tabNow == 1 ? 'block' : 'none') }}>
          <ProductAuthority/>
          </div>
          <div style={{ display: (this.state.tabNow == 2 ? 'block' : 'none') }}>
          <OperationAuthority/>
          </div> */}
        </Card>
        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <div className={styles.content}>
            <Steps current={saveCurrent}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{this.stepsFun(steps[saveCurrent].current)}</div>
            <div className="steps-action">
              {saveCurrent !== 2 && saveCurrent > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
              {saveCurrent === steps.length - 1 && (
                <Button type="primary" onClick={() => this.handleCancel()}>
                  完成
                </Button>
              )}
              {saveCurrent < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()} loading={loading}>
                  下一步
                </Button>
              )}
              {saveCurrent !== 2 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.handleCancel()}>
                  取消
                </Button>
              )}
            </div>
          </div>
        </Card>
        <AddRole
          authorizes={allmenutree}
          visible={this.state.addRoleCtrl}
          onSelectedActionsChange={this.onSelectedActionsChange}
          closeModal={this.closeAddRole}
          selectedActions={actions}
        />
        <UpdateAuth
          authorizes={allmenutree}
          visible={this.state.updateAuthCtrl}
          onSelectedActionsChange={this.onSelectedActionsChange}
          closeModal={this.closeUpdateAuth}
          selectedActions={actions}
          basics={basics}
        />
      </PageHeaderLayout>
    );
  }
}

const Done = () => {
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}>授权成功</div>}
      description="您已授权成功,点击'完成'，返回列表查看新增的用户。"
      // actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};

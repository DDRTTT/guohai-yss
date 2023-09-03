import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Col, Divider, Form, message, Modal, Row, Steps } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import Result from '@/components/Result';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { isEmptyObject } from '@/utils/utils';
import styles from './addMember.less';
import RoleAuthority from '../dataLicense/assembly/roleAuthority';
import AuthorizationPad from '../dataLicense/assembly/authorityPreview';
import AddRole from '../dataLicense/modal/addRole';
import UpdateAuth from '../dataLicense/modal/updateAuth';
import RelatedProducts from './relatedProducts';
import { getSession } from '@/utils/session';
import { PageContainers } from '@/components';

const { Step } = Steps;
const steps = [
  {
    title: '组件授权',
    current: 1,
  },
  {
    title: '产品关联',
    current: 2,
  },
  {
    title: '完成',
    current: 3,
  },
];
const steps1 = [
  {
    title: '组件授权',
    current: 1,
  },
  {
    title: '完成',
    current: 2,
  },
];
const { confirm } = Modal;

@errorBoundary
@Form.create()
@connect(state => ({
  memberManagement: state.memberManagement,
  orgAuthorize: state.orgAuthorize,
  role: state.role,
}))
export default class memberInformationEdit extends BaseCrudComponent {
  state = {
    // 步骤
    current: 0,
    child1: null,
    child2: null,
    child4: null,
    selectedActions: null,
    addRoleCtrl: false,
    updateAuthCtrl: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const orgId = sessionStorage.getItem('saveOrgId');
    const memberId = sessionStorage.getItem('saveMemberId');
    const sysId = getSession('sysId');
    const firstSysId = sysId?.split(',')[0] || 1;
    // 菜单树
    dispatch({
      type: 'role/init',
      payload: firstSysId,
    });

    dispatch({
      type: 'role/getEmptyRole',
    });

    // 获取数据包
    dispatch({
      type: `orgAuthorize/queAllData`,
      payload: {
        orgAuthedId: orgId,
        userAuthedId: memberId,
        sysId: firstSysId,
      },
    });

    dispatch({
      type: `memberManagement/queAllData`,
      payload: {
        orgAuthedId: orgId,
        userAuthedId: memberId,
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
    sessionStorage.removeItem('saveOrgId');
    sessionStorage.removeItem('saveMemberId');
    sessionStorage.removeItem('sysId');
    sessionStorage.removeItem('memberInfos');
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues, status } = this.state;
    this.handleStandardTabpage(pagination, filtersArg, sorter, formValues, status);
  };

  // 打开添加组件弹窗
  addRole = () => {
    this.setState({
      addRoleCtrl: true,
    });
  };

  save1 = ref => {
    this.setState({
      child1: ref,
    });
  };

  save2 = ref => {
    this.setState({
      child2: ref,
    });
  };

  save4 = ref => {
    this.setState({
      child4: ref,
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
      orgAuthorize: {
        dataPage: { orgId },
      },
    } = this.props;
    if (orgId === 0) {
      if (saveCurrent === 0) {
        this.handleSetAuth();
      }
    } else {
      switch (saveCurrent) {
        case 0:
          this.handleSubmitRole();
          break;
        case 1:
          this.handleConfirm();
          break;
        default:
          this.handleSubmitRole();
      }
    }
  };

  handleSubmit = () => {
    this.state.child1.handleSubmit();
  };

  handleSubmitRole = () => {
    const {
      orgAuthorize: { dataPage },
    } = this.props;
    if (dataPage && dataPage.userRole.length > 0) {
      this.step();
    } else {
      message.error('请至少选择一个功能组件');
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

  // 关闭修改组件权限弹窗
  closeUpdateAuth = () => {
    this.setState({
      updateAuthCtrl: false,
    });
  };

  // 权限测试
  onSelectedActionsChange = selectedActions => {
    this.setState({ selectedActions });
  };

  // 关闭新增组件弹窗
  closeAddRole = () => {
    this.setState({
      addRoleCtrl: false,
    });
  };

  // 取消授权
  handleCancel = () => {
    router.push('/datum/memberManagement');
  };

  handleConfirm = () => {
    confirm({
      title: '确定要完成授权么?',
      content: '点击下一步将完成授权操作',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.state.child4.handleSubmit();
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };

  stepsFun = item => {
    const {
      role: { allmenutree, actions, emptyRoleData, roleHas, basics },
      dispatch,
      memberManagement: { saveOrgId },
      orgAuthorize: {
        dataPage,
        dataPage: { orgId },
      },
    } = this.props;

    if (orgId === 0) {
      switch (item) {
        case 1:
          return (
            <div>
              <Card style={{ marginTop: 24, marginBottom: 24 }}>
                <RoleAuthority
                  addRoleFun={this.addRole}
                  dataPage={dataPage}
                  emptyRoleData={emptyRoleData}
                  // 标识是从哪个操作使用的组件，在组件中进行功能组件与业务组件的显示与隐藏判断
                  formType="edit"
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
                basics={basics}
                visible={this.state.updateAuthCtrl}
                onSelectedActionsChange={this.onSelectedActionsChange}
                closeModal={this.closeUpdateAuth}
                selectedActions={actions}
              />
            </div>
          );
        case 2:
          return <Done save={this.save4} step={this.step} />;
        default:
      }
    } else {
      switch (item) {
        case 1:
          return (
            <div>
              <Card style={{ marginTop: 24, marginBottom: 24 }}>
                <RoleAuthority
                  addRoleFun={this.addRole}
                  dataPage={dataPage}
                  emptyRoleData={emptyRoleData}
                  // 标识是从哪个操作使用的组件，在组件中进行功能组件与业务组件的显示与隐藏判断
                  formType="edit"
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
                basics={basics}
                visible={this.state.updateAuthCtrl}
                onSelectedActionsChange={this.onSelectedActionsChange}
                closeModal={this.closeUpdateAuth}
                selectedActions={actions}
              />
            </div>
          );
        case 2:
          return <RelatedProducts sign="edit" save={this.save4} step={this.step} />;
        case 3:
          return <Done save={this.save4} step={this.step} />;
        default:
      }
    }
  };

  // 设置权限（下一步按钮）
  handleSetAuth = () => {
    const {
      dispatch,
      memberManagement: { saveCurrent, savePack, saveOrgId },
      sign,
      orgAuthorize: { dataPage },
    } = this.props;

    let pack;
    if (isEmptyObject(savePack)) {
      pack = { ...dataPage, orgId: saveOrgId };
    } else {
      pack = savePack;
    }
    const { userRole } = pack;
    if (this.props.sign !== 'edit') {
      if (userRole.length === 0) {
        message.warning('请至少选择一个功能组件');
        return;
      }
    }

    if (sign === 'dataAuthorization') {
      // 数据授权时使用
      dispatch({
        type: 'memberManagement/handleOperationAuthorityForData',
        payload: {
          pack,
          current: saveCurrent,
        },
      });
    } else {
      // 创建成员时使用
      dispatch({
        type: 'memberManagement/handleOperationAuthority',
        payload: {
          pack,
          current: saveCurrent,
        },
      });
    }
  };

  restUserCode = record => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/rest`,
      payload: {
        id: record.id,
      },
    });
  };

  render() {
    const saveRecord = JSON.parse(sessionStorage.getItem('memberInfos')) || {};
    const {
      memberManagement: { saveCurrent, loadings },
      orgAuthorize: {
        dataPage,
        dataPage: { orgId },
      },
    } = this.props;

    let stepsArr;
    if (orgId === 0) {
      stepsArr = steps1;
    } else {
      stepsArr = steps;
    }

    return (
      <PageContainers
        breadcrumb={[
          {
            title: '系统运营管理',
            url: '',
          },
          {
            title: '成员管理',
            url: '/datum/memberManagement',
          },
          {
            title: '授权',
            url: '',
          },
        ]}
      >
        <Card className={styles.content} bordered={false} loading={loadings}>
          <div className={styles.drawers}>
            <div className={styles.bottomLeft} />
            <div className={styles.middleBox}>
              <Row>
                <Col span={14} className={styles.innerUser}>
                  {saveRecord.username}
                </Col>
                <Col span={2} className={styles.inner} />
                <Col span={8} className={styles.innerButton}>
                  <Button onClick={() => this.restUserCode(dataPage)}>重置密码</Button>
                </Col>
              </Row>

              <Row>
                <Col span={7} className={styles.inner}>
                  手机号码：{saveRecord.mobile}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构名称：{saveRecord.orgName}
                </Col>
                <Col span={7} className={styles.inner}>
                  创建时间：{saveRecord.createTime}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  电子邮箱：{saveRecord.email}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构代码：{saveRecord.orgCode}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构类型：{saveRecord.orgTypeName}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  用户代码：{saveRecord.usercode}
                </Col>
                <Col span={7} className={styles.inner}>
                  用户类型：
                  {dataPage.type === '01' ? '系统管理员' : '业务操作员'}
                </Col>
                {/* <Col span={7}>机构简称：{members.orgType}</Col> */}
              </Row>
              <Row>
                {/* <Col span={7}>当前状态：{members.state === 1 ? '正常' : '停用'}</Col> */}
                <Col span={7} />
                <Col span={7} />
              </Row>
            </div>
            <div className={styles.bottomLeft} />
          </div>
          <Divider />
          <Steps current={saveCurrent}>
            {stepsArr.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{this.stepsFun(steps[saveCurrent].current)}</div>
          <div className="steps-action">
            {saveCurrent !== 0 && saveCurrent !== 2 && saveCurrent > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            )}
            {saveCurrent === stepsArr.length - 1 && (
              <Button type="primary" onClick={() => this.handleCancel()}>
                完成
              </Button>
            )}
            {saveCurrent < stepsArr.length - 1 && (
              <Button type="primary" onClick={() => this.next()} loading={loadings}>
                下一步
              </Button>
            )}
            {saveCurrent !== 2 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleCancel()}>
                取消
              </Button>
            )}
          </div>
        </Card>
      </PageContainers>
    );
  }
}

const Done = () => {
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('memberInfos');
      sessionStorage.removeItem('saveOrgId');
      sessionStorage.removeItem('saveMemberId');
      sessionStorage.removeItem('sysId');
    };
  }, []);
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}>授权成功</div>}
      description="您已授权成功,点击'完成'，返回列表查看用户。"
      // actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};

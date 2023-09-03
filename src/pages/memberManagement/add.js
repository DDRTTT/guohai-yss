/**
 *Create on 2020/7/23.
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, message, Steps, Modal } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './add.less';
import SelectionAgency from './selectionAgency';
import UserInfo from './userInfo';
import RelatedProducts from './relatedProducts';
import RoleAuthority from '../dataLicense/assembly/roleAuthority';
import AuthorizationPad from '../dataLicense/assembly/authorityPreview';
import AddRole from '../dataLicense/modal/addRole';
import UpdateAuth from '../dataLicense/modal/updateAuth';

const { Step } = Steps;
const steps = [
  {
    title: '选择机构',
    current: 1,
  },
  {
    title: '用户信息',
    current: 2,
  },
  {
    title: '组件授权',
    current: 3,
  },
  {
    title: '产品关联',
    current: 4,
  },
  {
    title: '完成',
    current: 5,
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
export default class AddMember extends Component {
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleStep`,
      payload: 0,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 清空用户信息
    dispatch({
      type: `memberManagement/saveInfo`,
      payload: {},
    });
    dispatch({
      type: `memberManagement/saveMobileQueryInfo`,
      payload: {},
    });
  }

  stepsFun = item => {
    let com;
    const {
      role: { allmenutree, actions, emptyRoleData, roleHas, basics },
      dispatch,
      memberManagement: { saveOrgId },
      orgAuthorize: { dataPage },
    } = this.props;

    switch (item) {
      case 1:
        // 选择机构
        com = <SelectionAgency save={this.save1} step={this.step} />;
        break;
      case 2:
        // 用户信息
        com = <UserInfo save={this.save2} step={this.step} userAuthedId={saveOrgId} />;
        break;
      case 3:
        // 组件授权
        com = (
          <>
            <Card style={{ marginTop: 24, marginBottom: 60 }}>
              <RoleAuthority
                addRoleFun={this.addRole}
                dataPage={dataPage}
                emptyRoleData={emptyRoleData}
                // 标识是从哪个操作使用的组件，在组件中进行功能组件与业务组件的显示与隐藏判断
                formType="add"
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
          </>
        );
        break;
      // 产品关联
      case 4:
        // 产品关联
        com = <RelatedProducts save={this.save4} step={this.step} />;
        break;
      // 完成
      case 5:
        // 完成
        com = <Done />;
        break;
      default:
        com = '';
    }
    return com;
  };

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

  // 选择机构
  save1 = ref => {
    this.setState({
      child1: ref,
    });
  };

  // 用户信息
  save2 = ref => {
    this.setState({
      child2: ref,
    });
  };

  // 产品关联
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
    } = this.props;
    switch (saveCurrent) {
      case 0:
        this.state.child1.handleSubmit();
        break;
      case 1:
        this.state.child2.handleSubmit();
        break;
      case 2:
        this.handleSubmitRole();
        break;
      case 3:
        this.handleConfirm();
        break;
      default:
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

  render() {
    const {
      memberManagement: {
        saveCurrent,
        loadings,
        saveMobileQueryInfo,
        saveOrgInfo: { orgCode, orgName, orgTypeName },
        saveUserMobile,
      },
    } = this.props;
    let username, type, email, usercode, oaUsernum;
    const info = saveMobileQueryInfo[0];
    if (saveMobileQueryInfo && saveMobileQueryInfo[0]) {
      username = info.username;
      type = info.type;
      email = info.email;
      usercode = info.usercode;
      oaUsernum = info.oaUsernum;
    }

    return (
      <div className={styles.content}>
        <Card
          title={<div style={{ fontSize: 20 }}>新建用户</div>}
          bordered={false}
          style={{ minHeight: 50 }}
        >
          {/*          <div className={styles.drawers}>
            <div className={styles.bottomLeft} />
            <div className={styles.middleBox}>
              <Row>
                <Col span={14} className={styles.innerUser}>
                  {username}
                </Col>
              </Row>

              <Row>
                <Col span={7} className={styles.inner}>
                  手机号码：{saveUserMobile}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构名称：{orgTypeName}
                </Col>
                <Col span={7} className={styles.inner}>
                  员工编号：{oaUsernum}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  电子邮箱：{email}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构代码：{orgCode}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构类型：{orgName}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  用户代码：{usercode}
                </Col>
                <Col span={7} className={styles.inner}>
                  用户类型：
                  {type && (type === '01' ? '系统管理员' : '业务操作员')}
                </Col>
              </Row>
            </div>
            <div className={styles.bottomLeft} />
          </div>

          <Divider /> */}

          <Steps current={saveCurrent}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{this.stepsFun(steps[saveCurrent].current)}</div>
          <div className="steps-action">
            {saveCurrent !== 4 && saveCurrent > 0 && (
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
              <Button type="primary" onClick={() => this.next()} loading={loadings}>
                下一步
              </Button>
            )}
            {saveCurrent !== 4 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleCancel()}>
                取消
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
}

const Done = () => {
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}>授权成功</div>}
      description="您已授权成功,点击'完成'，返回列表查看新增用户。"
      // actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};

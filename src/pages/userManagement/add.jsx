import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Card, Checkbox, Col, Form, Modal, Row, Steps } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { USER_INFO } from '@/utils/session';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import router from 'umi/router';
import Result from '@/components/Result';
import SubRole from './subRole';
import cloneDeep from 'lodash/cloneDeep';
import PreviewModal from './preview';
import { PageContainers } from '@/components';

const { Step } = Steps;
const { Option } = AutoComplete;

const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,roleName,manuscriptStrategy';

const Done = () => {
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={
        <div className={styles.title}>
          <p>创建成功</p>
          <p className={styles.message}>用户新增成功</p>
        </div>
      }
      description={
        <div className={styles.description}>
          <div className={styles.content}>
            <div>密码:系统初始密码</div>
            {/* <div>所属部门:{deptId.split(',')}</div> */}
            {/* <div>所属岗位:{positions.split(',')}</div> */}
          </div>
        </div>
      }
      style={{ marginTop: 56 }}
    />
  );
};

const Index = ({
  dispatch,
  userManagement: { saveGetDept, saveOrgList, roleBySys, userauthed, saveInfoByUserName },
  roleManagement: {
    saveDictList,
    saveDictList: { authorizationStrategy, attributionSystem },
    savePositionsList,
    saveAllMenuTree,
    saveAuthorizeActionsList,
    tags,
    saveRoleDetail,
    savePositionsTree,
    savePositionAuthorizeActionsList,
  },
  workSpace: { GET_USER_SYSID },
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  form: { validateFieldsAndScroll, setFieldsValue, getFieldDecorator, resetFields },
  form,
  authorizeLoading,
  modify: { departLeaderList },
}) => {
  // 获取个人信息
  const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));
  const [sysId, setSysId] = useState('1');
  const [selectTagList, setSelectTagList] = useState([]);
  const [userNameModal, setUserNameModal] = useState(false);
  // 步骤
  const [current, setCurrent] = useState(0);

  // 权限预览
  const [authModal, setAuthModal] = useState(false);

  // 已关联功能组件
  const [associatedFunction, setAssociatedFunction] = useState([]);
  // 已关联岗位组件
  const [associatedJobs, setAssociatedJob] = useState([]);
  // 数据策略组件
  const [strategyCodes, setStrategyCodes] = useState([]);
  // 数据策略组件展示
  const [strategy, setStrategy] = useState([]);

  useEffect(() => {
    // 1 产品中心 4 底稿系统
    const cloneDeepAuthorizationStrategy =
      sysId === '1'
        ? cloneDeep(saveDictList?.authorizationStrategy)
        : sysId === '4'
        ? cloneDeep(saveDictList?.manuscriptStrategy)
        : [];
    cloneDeepAuthorizationStrategy?.map(item => {
      item.label = item.name;
      item.value = item.code;
    });
    setStrategy(cloneDeepAuthorizationStrategy);
  }, [saveDictList, sysId]);

  // 预览框中选中组件请求数据
  const handleFetchGetAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetAuthorizeById',
      payload: tag,
    });
  };

  const handleFetchGetPositionAuthorizeById = tag => {
    dispatch({
      type: 'roleManagement/fetchGetPositionAuthorizeById',
      payload: { positionIds: tag, sysId },
    });
  };

  // 重置方法
  const handleReset = () => {
    // 关闭弹框
    setAuthModal(false);
    // 重置通过组件id查询出的权限
    dispatch({
      type: 'roleManagement/saveAuthorizeActionsList',
      payload: [],
    });
  };

  useEffect(() => {
    if (userInfo?.orgId) {
      // 所属部门
      dispatch({
        type: 'userManagement/fetchGetDept',
        payload: {
          orgId: userInfo?.orgId, // 机构ID
          orgKind: 2,
        },
      });
    }

    // 查询字典
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });

    // 机构名称
    dispatch({
      type: `userManagement/handleGetOrgList`,
    });

    // 员工列表
    dispatch({
      type: 'modify/getOrgDropDownList',
      payload: {
        orgId: userInfo?.orgId,
      },
    });

    dispatch({
      type: 'workSpace/GET_USER_SYSID_FETCH',
    });
  }, []);

  useEffect(() => {
    // 查询功能组件
    dispatch({
      type: 'roleManagement/fetchHasRole',
      payload: sysId,
    });
    // 查询岗位组件树
    dispatch({
      type: 'roleManagement/fetchGetPositionsTree',
      payload: { sysId },
    });
    // 岗位列表
    dispatch({
      type: 'roleManagement/fetchGetPositionsList',
      payload: sysId,
    });
    // 权限树查询
    dispatch({
      type: 'roleManagement/fetchGetAuthTree',
      payload: sysId,
    });
  }, [sysId]);

  useEffect(() => {
    if (!userauthed || JSON.stringify(userauthed) === '{}') return;
    setAssociatedJob(userauthed.positions);
    setAssociatedFunction(userauthed.userRole);
    setStrategyCodes(userauthed.strategyCodes);
  }, [userauthed]);
  useEffect(() => {
    if (!saveRoleDetail || JSON.stringify(saveRoleDetail) === '{}') return;
    setAssociatedJob(saveRoleDetail.positions);
    setAssociatedFunction(saveRoleDetail.functions);
    setStrategyCodes(saveRoleDetail.dataStrategies.map(item => item.strategyCode));
  }, [saveRoleDetail]);

  useEffect(() => {
    // 根据归属系统查询可用的角色组件集合
    dispatch({
      type: 'userManagement/queryBySys',
      payload: sysId,
    });
  }, [sysId]);

  const handleRoleBySysId = sysId => {
    // 根据归属系统查询可用的角色组件集合
    dispatch({
      type: 'userManagement/queryBySys',
      payload: sysId,
    });
  };

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const defaultConfig = { width: 12 };

  // 根据员工名称查详情
  const handleGetRole = (item = '') => {
    dispatch({
      type: 'userManagement/getEmployeeInfo',
      payload: item,
    }).then(item => {
      setFieldsValue({
        username: item.name,
        oaUsernum: item.oaEmployeeId,
        sex: `${item.sex}`,
        mobile: item.phoneNumber,
        email: item.mailbox,
        deptId: `${item.depId}`,
        type: '02', // 默认选择业务员
      });
    });
  };

  const options =
    saveInfoByUserName &&
    Array.isArray(saveInfoByUserName) &&
    saveInfoByUserName.map(opt => (
      <Option key={opt.id} value={`${opt.id}`}>
        {opt.name}
      </Option>
    ));

  const validateUserCode = (rule, value, callback) => {
    const patrn = /^[\da-z]+$/im;
    if (patrn.test(value)) {
      callback();
      return;
    }
    callback('仅限数字及字母');
  };

  const validateUserName = (rule, value, callback) => {
    const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (!patrn.test(value)) {
      callback();
      return;
    }
    callback('不包能含特殊字符');
  };

  const productInfo = [
    {
      name: 'orgId',
      label: '机构名称',
      type: 'TreeSelect',
      width: 12,
      style: { display: userInfo?.orgId === 0 ? 'block' : 'none' },
      rules: [{ required: true, message: '请选择机构名称' }],
      config: {
        dropdownStyle: { maxHeight: 400, overflow: 'auto' },
        treeData: saveOrgList,
        treeDefaultExpandAll: true,
        showSearch: true,
        treeNodeFilterProp: 'title',
        getPopupContainer: () => document.getElementById('area'),
        onChange: orgId => {
          // 所属部门
          dispatch({
            type: 'userManagement/fetchGetDept',
            payload: {
              orgId,
              orgKind: 2,
            },
          });
          // 员工列表
          dispatch({
            type: 'modify/getOrgDropDownList',
            payload: {
              orgId,
            },
          });
        },
      },
      initialValue: userInfo?.orgId !== 0 ? userInfo?.orgId : '',
    },
    {
      name: 'name',
      label: '用户',
      type: 'select',
      readSet: { name: 'name', code: 'id', bracket: 'empNo' },
      option: departLeaderList,
      config: {
        onChange: e => handleGetRole(e),
      },
      ...defaultConfig,
    },
    {
      name: 'username',
      label: '用户名',
      style: { display: 'none' },
    },
    {
      name: 'oaUsernum',
      label: '员工编号',
      style: { display: 'none' },
    },
    {
      name: 'usercode',
      label: '登录名',
      rules: [
        { validator: validateUserCode },
        { required: true, message: '请输入登录名' },
        { max: 20, message: '不能超过20个字符' },
      ],
      ...defaultConfig,
    },
    {
      name: 'sex',
      label: '性别',
      type: 'select',
      config: {
        disabled: true,
      },
      option: [
        { name: '男', code: 0 },
        { name: '女', code: 1 },
      ],
      ...defaultConfig,
    },
    {
      name: 'mobile',
      label: '手机号码',
      config: {
        disabled: true,
      },
      ...defaultConfig,
    },
    {
      name: 'email',
      label: '电子邮箱',
      config: {
        disabled: true,
      },
      ...defaultConfig,
    },
    {
      name: 'deptId',
      label: '所属部门',
      type: 'select',
      option: saveGetDept,
      ...defaultConfig,
      readSet: {
        name: 'orgName',
        code: 'id',
      },
      config: {
        disabled: true,
        placeholder: '',
      },
    },
    {
      name: 'assistMgtDept',
      label: '协管部门',
      type: 'select',
      ...defaultConfig,
      readSet: {
        name: 'orgName',
        code: 'id',
      },
      option: saveGetDept,
    },
    {
      name: 'type',
      label: '用户类型',
      type: 'select',
      style: { display: 'none' },
      ...defaultConfig,
      // rules: [{ required: true, message: '请选择用户类型' }],
      option: [
        { name: '管理员', code: '01' },
        { name: '业务员', code: '02' },
      ],
    },
  ];

  const prev = () => {
    resetFields();
    setCurrent(0);
  };

  // 选中所属角色时候获取角色对应的功能&岗位数据
  const handleQueryBySys = tag => {
    dispatch({
      type: 'roleManagement/handleRoleDetail',
      payload: tag,
    });
  };

  const handleSubmit = () => {
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const tempTagList = selectTagList.map(item => item.id);
        const temp = {
          password: '',
          usernum: '',
          cardType: '',
          ...values,
          roleComIds: tempTagList,
          sysId: values.sysId.join(),
          type: '02',
        };
        dispatch({
          type: 'userManagement/authorize',
          payload: temp,
        }).then(res => {
          if (res) setCurrent(1);
        });
      }
    });
  };

  return (
    <PageContainers
      breadcrumb={[
        {
          title: '权限管理',
          url: '',
        },
        {
          title: '用户管理',
          url: '/authority/userManagement',
        },
        {
          title: '新建用户',
          url: '',
        },
      ]}
    >
      <div className={styles.addPage} id="area">
        <Card>
          <Steps style={{ marginBottom: '30px' }} current={current}>
            <Step title="用户信息" />
            <Step title="完成" />
          </Steps>
          {current === 0 && (
            <div>
              <Form {...layout}>
                <Row>
                  <CustomFormItem formItemList={productInfo} form={form} />
                </Row>
                <Row>
                  <Col span={24} pull={4}>
                    <Form.Item label="归属系统">
                      {getFieldDecorator('sysId', {
                        rules: [
                          {
                            required: true,
                            message: '请选择归属系统',
                          },
                        ],
                      })(
                        <Checkbox.Group style={{ width: '100%' }}>
                          {attributionSystem
                            ?.filter(item => GET_USER_SYSID?.includes(item.code))
                            .map(item => (
                              <div key={item.code}>
                                <Checkbox value={item.code}>{item.name}</Checkbox>
                                <SubRole
                                  key={item.code}
                                  // 系统id  string
                                  sysId={item.code}
                                  // 选中的角色 []
                                  setSelectTagList={setSelectTagList}
                                  // 选中的角色 Fn
                                  selectTagList={selectTagList}
                                  // 通过sysId查到角色 []
                                  roleBySys={roleBySys}
                                  // 通过sysId查到角色 Fn
                                  handleRoleBySysId={handleRoleBySysId}
                                  showModal={sysid => {
                                    setSysId(sysid);
                                    setAuthModal(true);
                                  }}
                                />
                              </div>
                            ))}
                        </Checkbox.Group>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <Button
                  onClick={() => {
                    router.goBack();
                  }}
                >
                  取消
                </Button>
                <Button
                  style={{ marginLeft: '20px' }}
                  type="primary"
                  onClick={handleSubmit}
                  loading={authorizeLoading}
                >
                  确定
                </Button>
              </div>
            </div>
          )}
          {current === 1 && (
            <>
              <Done />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button className={styles.btn} type="primary" onClick={prev}>
                  再次创建
                </Button>
                <Button
                  className={styles.btn}
                  type="primary"
                  style={{ marginLeft: '10px' }}
                  onClick={() => router.goBack()}
                >
                  返回
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
      {authModal && (
        <PreviewModal
          title={'预览权限'}
          authorizationStrategy={strategy}
          authModal={authModal}
          setAuthModal={setAuthModal}
          dataStrategies={strategyCodes}
          saveAuthorizeActionsList={saveAuthorizeActionsList}
          saveAllMenuTree={saveAllMenuTree}
          savePositionsTree={savePositionsTree}
          tags={[...(tags['01'] || []), ...(tags['02'] || [])]}
          positionsList={savePositionsList}
          functions={associatedFunction}
          positions={associatedJobs}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          handleReset={handleReset}
          ownershipSystem={attributionSystem}
          selectOwnershipSystem={sysId}
          ownershipSystemChange={value => {
            setSysId(value);
          }}
          userauthed={userauthed}
          roleComByUser={selectTagList}
          roleBySys={roleBySys}
          handleQueryBySys={handleQueryBySys}
          disabled={true}
        />
      )}
      <Modal
        title={'title'}
        visible={userNameModal}
        onOk={() => {
          document.getElementById('username').blur();
          setUserNameModal(false);
        }}
      />
    </PageContainers>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ workSpace, loading, userManagement, roleManagement, modify }) => ({
      workSpace,
      userManagement,
      roleManagement,
      fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      fetchGetPositionsTreeLoading: loading.effects['roleManagement/fetchGetPositionsTreeLoading'],
      handleCreateRoleLoading: loading.effects['roleManagement/handleCreateRole'],
      authorizeLoading: loading.effects['userManagement/authorize'],
      modify,
    }))(Index),
  ),
);

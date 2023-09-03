import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import SubRole from '@/pages/userManagement/subRole';
import cloneDeep from 'lodash/cloneDeep';
import { getSession, setSession, USER_INFO } from '@/utils/session';
import { parse } from 'qs';
import PreviewModal from './preview';
import router from 'umi/router';
import styles from './quickAuthorization.less';
import { Table } from '@/components';

const { TabPane } = Tabs;
const { Search } = Input;
const { TreeNode } = Tree;

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
};

const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,roleName,manuscriptStrategy';

let count = 0;
const text = '双击为使用';
// 临时使用角色(不选组件，只选产品的时候使用)
const tempRole = {
  actions: '',
  checked: 0,
  checkerId: 0,
  checkerTime: '',
  code: '',
  createTime: '',
  creator: '',
  creatorId: 0,
  deleteTime: '',
  deleted: 0,
  deletorId: 0,
  description: '',
  groups: [],
  id: 0,
  lastEditTime: '',
  lastEditorId: 0,
  name: '',
  orgId: 0,
  positons: [],
  proCodes: [],
  proTypes: [],
  sysId: 0,
  type: '',
};

const Index = ({
  dispatch,
  memberManagement: { saveAuthorizationStrategy },
  userManagement: { roleComByUser, roleBySys, userauthed },
  roleManagement: {
    saveDictList: { authorizationStrategy, attributionSystem, manuscriptStrategy },
    savePositionsList,
    saveAllMenuTree,
    saveAuthorizeActionsList,
    tags,
    saveRoleDetail,
    savePositionsTree,
    savePositionAuthorizeActionsList,

    SAVE_PRO_TREE,
    SAVE_PRO_GROUP,
    SAVE_PRO_PAGINATION,
    SAVE_PRO_PAGINATION2,
    SAVE_TEMP_PRO,
  },
  workSpace: { GET_USER_SYSID },
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  loading,
  form,
  form: { setFieldsValue, resetFields, getFieldDecorator, validateFieldsAndScroll },
  orgAuthorize: {
    dataPage: { userRole },
    dataPage,
    SAVE_PRO: { proCodes, proTypes, proGroups, projectsDg, proTypeDg },
  },
  role: { emptyRoleData },
  GET_PRO_PAGINATION_FETCH_LOADING,
  GET_PRO_PAGINATION2_FETCH_LOADING,
  SAVE_PRODUCT_TO_GROUP_FETCH_LOADING,
  LOADING,
  roleLOADING,
}) => {
  const myGroup = [
    {
      label: '我的分组',
      spare: 'myGroup',
      value: '-1',
      children: SAVE_PRO_GROUP,
    },
  ];
  // 获取个人信息
  const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO)) || {};
  const saveRecord = JSON.parse(sessionStorage.getItem('memberInfos')) || {};
  // 获取的连接里面的参数
  const queryParam = parse(window.location.search, { ignoreQueryPrefix: true });
  const { userId } = queryParam;

  const currentPages = useRef();

  const [selectTagList, setSelectTagList] = useState([]);
  const [sysId, setSysId] = useState('');

  const [show, setShow] = useState(false);
  const [check, setCheck] = useState();
  const [setCurrentTagId] = useState('');
  // 权限预览
  const [authModal, setAuthModal] = useState(false);
  // 已关联功能组件
  const [associatedFunction, setAssociatedFunction] = useState([]);
  // 已关联岗位组件
  const [associatedJobs, setAssociatedJob] = useState([]);
  // 数据策略组件
  const [strategyCodes, setStrategyCodes] = useState([]);
  const cloneDeepAuthorizationStrategy = cloneDeep(authorizationStrategy);
  const cloneManuscriptStrategy = cloneDeep(manuscriptStrategy);

  const [tabsChange, setTabsChange] = useState('1');

  // ----------------------------------------------------------------
  const [parameter, setParameter] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  // Tree
  const [allProductCheckTreePro, setAllProductCheckTreePro] = useState([]);
  const [checkTreePro, setCheckTreePro] = useState([]);
  const [checkGroupTreePro, setCheckGroupTreePro] = useState([]);// 由setGroupCheckTreePro 改为 setCheckGroupTreePro
  const [treeNodes, setTreeNodes] = useState({ proTypes: [], groups: [] }); // 产品中心：产品分类、我的分组左侧树的选中情况
  // Table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // proCodes
  // // 分组
  const [groupSelectedRowKeys, setGroupSelectedRowKeys] = useState([]);
  // 分页
  const [current, setCurrent] = useState(1);
  // 添加分组弹框
  const [addNewGroupModal, setAddNewGroupModal] = useState(false);
  // 删除分组弹框
  const [removeGroupModal, setRemoveGroupModal] = useState(false);
  // 编辑分组弹框
  const [editGroupModal, setEditGroupModal] = useState(false);
  // 选择的分组
  const [myGroupSelect, setMyGroupSelect] = useState('');
  // 添加分组和产品弹框
  const [addNewGroupWithProModal, setAddNewGroupWithProModal] = useState(false);
  const [proCondition, setProCondition] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const [leftTreeValue, setLeftTreeValue] = useState('');
  const [keyWords, setKeyWords] = useState('');
  const [proType, setProType] = useState('');

  // ----------------------------------------------------------------
  const [proCondition2, setProCondition2] = useState('');
  const [parameter2, setParameter2] = useState({});
  // 分页
  const [current2, setCurrent2] = useState(1);
  // ----------------------------------------------------------------
  const changePageTabs = e => {
    // 重新加载功能组件和岗位组件数据
    if (e.target.visibilityState === 'visible') {
      // 重新加载数据 查询功能组件
      if (sysId) {
        dispatch({
          type: 'roleManagement/fetchHasRole',
          payload: sysId,
        });
      }
    }
  }

  useEffect(() => {
    const proTypes = checkTreePro && checkTreePro.length > 0 ? checkTreePro.filter(item => !item.includes('-')) : [];// 过滤父节点key（传参不需要）
    const groups = checkGroupTreePro && checkGroupTreePro.length > 0 ? checkGroupTreePro.filter(item => !item.includes('-')) : [];
    setTreeNodes({ proTypes, groups }); // 用于区分是否可以setSelectedRowKeys([]);且return
  }, [checkTreePro, checkGroupTreePro])

  useEffect(() => {
    document.addEventListener('visibilitychange', changePageTabs, false);
    return () => document.removeEventListener('visibilitychange', changePageTabs, false)
  })

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < SAVE_TEMP_PRO.length; i++) {
      arr.push(SAVE_TEMP_PRO[i].proCode);
    }
    setGroupSelectedRowKeys(arr);
  }, [SAVE_TEMP_PRO]);

  useEffect(() => {
    if (sysId === '1') {
      // 产品分页
      handleAllProduct({ pageSize, currentPage: current, ...parameter, proCondition });
    }
    if (sysId === '4') {
      // 底稿产品分页
      handleDGAllProduct({ pageSize, currentPage: current, keyWords, proType });
    }
  }, [current, parameter, proCondition, keyWords, proType, pageSize]);// 添加pageSize的原因：根据客户要求，分页增加了每页展示条数的选择，当每页展示条数改变时，表格数据需要重新请求并加载 

  useEffect(() => {
    // 产品分页
    handleAllProduct2({
      pageSize,
      currentPage: current2,
      ...parameter2,
      proCondition: proCondition2,
    });
  }, [current2, parameter2, proCondition2, pageSize]);

  useEffect(() => {
    if (sysId === '1') {// 产品中心
      setSelectedRowKeys(proCodes ?? []);
      setCheckTreePro(proTypes ?? []);
      setCheckGroupTreePro(proGroups ?? []);
    }
    if (sysId === '4') {// 底稿系统
      setSelectedRowKeys(projectsDg);
      setCheckTreePro(proTypeDg);
      // setCheckGroupTreePro(proGroups ?? []);
    }
  }, [proCodes, proTypes, projectsDg, proTypeDg]);

  useEffect(() => {
    // 全部产品code
    handleAllProductCode({});

    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
    // 机构名称
    dispatch({
      type: `memberManagement/handleOrgName`,
    });
    // 重置状态
    dispatch({
      type: `memberManagement/handleResetState`,
    });

    dispatch({
      type: 'role/getEmptyRole',
    });

    // 获取我的产品分组
    dispatch({
      type: `roleManagement/GET_PRO_GROUP_FETCH`,
    });

    dispatch({
      type: 'workSpace/GET_USER_SYSID_FETCH',
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'roleManagement/hasRole',
      payload: {
        '02': [],
        '01': [],
      },
    });
    if (sysId) {
      // 查询功能组件
      dispatch({
        type: 'roleManagement/fetchHasRole',
        payload: sysId,
      });

      // 权限树查询
      dispatch({
        type: 'roleManagement/fetchGetAuthTree',
        payload: sysId,
      });

      // 岗位树查询
      dispatch({
        type: 'roleManagement/fetchGetPositionsTree',
        payload: { sysId },
      });
      // 根据归属系统查询可用的角色组件集合
      dispatch({
        type: 'userManagement/queryBySys',
        payload: sysId,
      });
      // 所属部门
      dispatch({
        type: 'userManagement/fetchGetDept',
        payload: {
          orgId: userInfo?.orgId, // 机构ID
          orgKind: 2,
        },
      });

      setFieldsValue({ sysId });

      if (sysId === '1') {
        // 产品类树
        dispatch({
          type: `roleManagement/GET_PRO_TREE_FETCH`,
        });
        // 产品分页
        handleAllProduct({ pageSize, currentPage: current, ...parameter, proCondition });
      }
      if (sysId === '4') {
        // 底稿产品类树
        dispatch({
          type: `roleManagement/GET_DG_PRO_TREE_FETCH`,
        });
        // 底稿产品分页
        handleDGAllProduct({ pageSize, currentPage: current });
      }
    }
  }, [sysId]);

  useEffect(() => {
    if (!userauthed || JSON.stringify(userauthed) === '{}') return;
    setAssociatedJob(userauthed.positions);
    setAssociatedFunction(userauthed.userRole);
  }, [userauthed]);

  useEffect(() => {
    if (!saveRoleDetail || JSON.stringify(saveRoleDetail) === '{}') return;
    setAssociatedJob(saveRoleDetail.positions);
    setAssociatedFunction(saveRoleDetail.functions);
    setStrategyCodes(saveRoleDetail.dataStrategies.map(item => item.strategyCode));
  }, [saveRoleDetail]);

  useEffect(() => {
    if (!roleComByUser) return;
    setSelectTagList(roleComByUser);
  }, [roleComByUser]);

  useEffect(() => {
    // 查询用户被授权的角色组建id集合
    userId &&
      sysId &&
      dispatch({
        type: 'userManagement/queryRoleComByUser',
        payload: { userId, sysId },
      });
  }, [userId, sysId]);

  cloneDeepAuthorizationStrategy?.map(item => {
    item.label = item.name;
    item.value = item.code;
  });
  cloneManuscriptStrategy?.map(item => {
    item.label = item.name;
    item.value = item.code;
  });

  const manuscriptStrategies = {
    1: cloneDeepAuthorizationStrategy, // 产品生命周期策略
    4: cloneManuscriptStrategy, // 底稿策略
  };

  // 选中所属角色时候获取角色对应的功能&岗位数据
  const handleQueryBySys = tag => {
    dispatch({
      type: 'roleManagement/handleRoleDetail',
      payload: tag,
    });
  };

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

  // 产品中心查询产品-分页
  const handleAllProduct = item => {
    dispatch({
      type: 'roleManagement/GET_PRO_PAGINATION_FETCH',
      payload: item,
    });
  };
  // 产品中心查询产品-分页-弹框部分数据
  const handleAllProduct2 = item => {
    dispatch({
      type: 'roleManagement/GET_PRO_PAGINATION2_FETCH',
      payload: item,
    });
  };

  // 产品中心查询产品-分页
  const handleDGAllProduct = item => {
    dispatch({
      type: 'roleManagement/GET_DG_PRO_PAGINATION_FETCH',
      payload: item,
    });
  };

  // 全部产品code
  const handleAllProductCode = parameter => {
    dispatch({
      type: 'roleManagement/GET_ALL_PRO_CODE_FETCH',
      payload: parameter,
    });
  };

  // 分页
  const handleStandardTableChange = (current) => setCurrent(current);

  // columns
  const columns = [
    {
      title: '产品代码',
      dataIndex: 'proCode',
      key: 'proCode',
    },
    {
      title: '产品名称',
      dataIndex: 'proName',
      key: 'proName',
    },
    {
      title: '产品类型',
      dataIndex: 'proTypeName',
      key: 'proTypeName',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    // onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      if (selected) {// 选中，先检测原回显的selectedRowKeys中是否有，没有才将选中的push进去
        const code = record.proCode;
        let rowKeys = selectedRowKeys;
        if (!rowKeys.includes(code)) {
          rowKeys.push(code);
          setSelectedRowKeys(rowKeys);
        }
      } else {// 如果取消选中，则需要在原回显的selectedRowKeys中过滤掉，否则取消选中，再保存，还是会给后台传参，即bug描述中所说的：授权不生效！
        const code = record.proCode;
        const rowKeys = selectedRowKeys.filter(item => item !== code);
        setSelectedRowKeys(rowKeys);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      let rowKeys = selectedRowKeys;// 全选/全不选，需要在原来的 selectedRowKeys 基础上增加，或者删除
      if (selected) {// 表格全选
        selectedRows.forEach(item => {
          rowKeys.push(item.proCode)
        })
        rowKeys = Array.from(new Set(rowKeys));// 去重
        setSelectedRowKeys(rowKeys);
      } else {// 表格全不选
        rowKeys = rowKeys.filter(m => changeRows.every(n => n.proCode !== m))
        rowKeys = rowKeys ? rowKeys : [];
        setSelectedRowKeys(rowKeys);
      }
    },
  };

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
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

  const handleStandardTableChange2 = (current) => setCurrent2(current);

  const handlePagination2 = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '40', '80'],
    onShowSizeChange: handleSizeChange,
    onChange: handleStandardTableChange2,
    showQuickJumper: true,
    pageSize: pageSize,
    current: current2,
    total: SAVE_PRO_PAGINATION2?.total ?? 0,
    showTotal: () => `共 ${SAVE_PRO_PAGINATION2?.total} 条数据`,
  };

  const renderTreeNodes = (data, par) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={`-${item[par]}`} title={item.label} value={`-${item[par]}`}>
            {renderTreeNodes(item.children, par)}
          </TreeNode>
        );
      }
      return <TreeNode key={item[par]} title={item.label} value={`-${item[par]}`} />;
    });
  };

  const renderTreeNodes2 = (data, par) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={`${item[par]}`} title={item.label} value={`${item[par]}`} disabled>
            {renderTreeNodes2(item.children, par)}
          </TreeNode>
        );
      }
      return <TreeNode key={item[par]} title={item.label} value={`${item[par]}`} />;
    });
  };

  const tagChange = (tag, index, type) => {
    count += 1;
    setTimeout(() => {
      if (count === 1) {
        if (check === tag.id + type) {
          setCheck('无');
          dispatch({
            type: `role/hasChooseRole`,
            payload: '',
          });
          dispatch({
            type: `role/getAuthorizeById`,
            payload: '',
          });
        } else {
          setCurrentTagId(tag.id);
          setCheck(tag.id + type);
          dispatch({
            type: `role/hasChooseRole`,
            payload: tag.id,
          });

          dispatch({
            type: `role/getAuthorizeById`,
            payload: tag.id,
          });
        }
      } else if (count === 2 && type !== 'has') {
        let num = 0;
        [...userRole].forEach(data => {
          if (data.id === tag.id) {
            num++;
          }
        });
        if (num !== 0) {
          message.warn('请勿重复添加组件');
        } else {
          const objectDataString = JSON.stringify(dataPage);
          const data = JSON.parse(objectDataString);
          const emptyRoleDataString = JSON.stringify(emptyRoleData);
          const emptyRoleDatas = JSON.parse(emptyRoleDataString);
          Object.keys(emptyRoleDatas).forEach(key => {
            emptyRoleDatas[key] = tag[key] ? tag[key] : emptyRoleDatas[key];
          });
          data.userRole.push(emptyRoleDatas);
          dispatch({
            type: 'orgAuthorize/changeHasRole',
            payload: { data },
          });
        }
      }
      count = 0;
    }, 300);
  };

  // 移除已选择的组件
  const closeTage = tagData => {
    if (`${tagData.id}has` === +check) {
      setCheck('无');
    }

    const target = cloneDeep(dataPage);
    target.userRole.forEach((item, i) => {
      if (tagData.id === item.id) {
        target.userRole.splice(i, 1);
      }
    });
    target.positions.forEach((item, i) => {
      if (tagData.id === item.id) {
        target.positions.splice(i, 1);
      }
    });
    dispatch({
      type: 'orgAuthorize/changeHasRole',
      payload: { data: target },
    });
  };

  // TODO: 2、已选择组件  4、功能组件 授权组件
  // 切换用户归属系统
  const handleJobChange = e => {
    const search = parse(window.location.search, { ignoreQueryPrefix: true });
    const orgId = sessionStorage.getItem('saveOrgId') || search.orgId;
    const memberId = sessionStorage.getItem('saveMemberId') || search.saveMemberId;
    const key = e.target.value;
    setSysId(key);
    resetFields(['searchValue']);

    const sysIds = getSession('sysId');
    const firstSysId = sysIds?.split(',');
    firstSysId?.filter(item => item !== key);
    firstSysId?.unshift(key);
    const uniqueSysIdArr = Array.from(new Set(firstSysId));

    // 将切换的系统
    setSession('sysId', uniqueSysIdArr.join());

    // TODO: 2、已选择组件  完成 √
    dispatch({
      type: `orgAuthorize/QUICK_AUTH_DETAIL_FETCH`,
      payload: {
        orgAuthedId: orgId,
        userAuthedId: memberId,
        sysId: key,
      },
    });

    // TODO: 4、功能组件 授权组件  完成 √
    dispatch({
      type: 'orgAuthorize/hasRoleSearch',
      payload: key,
    });
    // 暂存 选择的系统
    dispatch({
      type: 'role/handleSveSysId',
      payload: key,
    });
  };

  const childrenNode = (node, arr, key) => {
    const item = node?.props?.children;
    if (item) {
      const len = item.length;
      for (let i = 0; i < len; i++) {
        if (item[i].props.children) {
          childrenNode(item[i], arr, key);
        } else {
          arr.push(item[i][key]);
        }
      }
      return arr;
    }
    return [node?.key];
  };

  const onTreeSelect = (selectedKeys, e, key) => {
    const k = e.selected ? key : undefined;

    // 修复分类分组切换时，分页不重置
    const selectedNodes = e.selectedNodes[0]?.key;
    if (currentPages.current !== selectedNodes) {
      setCurrent(1);
    }
    currentPages.current = selectedNodes;

    setSelectedKeys(selectedKeys);
    switch (k) {
      case 'allProduct':
        setParameter({});
        break;
      case 'proType':
        const proTypeList = childrenNode(e?.selectedNodes[0], [], 'key');
        setParameter({ proTypeList });
        sysId === '4' && Array.isArray(proTypeList) && setProType(proTypeList.join());
        break;
      case 'myGroup':
        const groupList = childrenNode(e?.selectedNodes[0], [], 'key');
        setMyGroupSelect(groupList);
        setParameter({ groupList });
        break;
      case undefined:
        setMyGroupSelect('');
        dispatch({
          type: 'roleManagement/SAVE_PRO_PAGINATION',
          payload: {
            rows: [],
            total: 0,
          },
        });
        break;
      default:
        break;
    }
  };

  // 保存组并选择产品 先判断（第一步）
  const handleSaveGroupAndJudge = e => {
    e.preventDefault();
    validateFieldsAndScroll(['groupName', 'fatherName'], (err, values) => {
      if (!err) {
        dispatch({
          type: `roleManagement/CHECK_GROUP_FETCH`,
          payload: values.fatherName,
        }).then(boolean => {
          if (boolean) {
            setAddNewGroupWithProModal(true);
            setProCondition2('');
            setParameter2({});
            setCurrent2(1);
          }
        });
      }
    });
  };

  const handleOnCheck = (checkedKeys, e, key) => {// key为前端标识：proType/myGroup
    const filterCheckedKeys = checkedKeys.filter(item => !item.includes('-'));// 过滤父节点key（传参不需要）
    setCurrent(1);
    setSelectedKeys(checkedKeys);

    switch (key) {
      case 'allProduct':
        setAllProductCheckTreePro(checkedKeys);
        break;
      case 'proType':
        setCheckTreePro(checkedKeys);
        if (sysId === '1') {// 产品中心，可以直接调取获取proCode接口，实现右侧选中和数据存储
          if (filterCheckedKeys.length === 0) {// 当刷新表格数据接口、返回proCode结口传 proTypeList: []时（即父级tree全不选），报500（因为接口目前支持proTypeList要么不传，传必须是非空数组），传{}，默认展示产品类型所有数据
            if (treeNodes.groups.length === 0) {
              setParameter({});
              setSelectedRowKeys([]);
            } else {
              // 根据选中效果，刷新表格数据
              setParameter({ groupList: treeNodes.groups });
              // 请求获取对应的所有符合条件的proCode，并赋值给 selectedRowKeys，用数据驱动页面回显效果
              dispatch({
                type: 'roleManagement/getProCodeByConditions',
                payload: { groupList: treeNodes.groups }
              }).then(res => {
                const proCodes = res.data;
                setSelectedRowKeys(proCodes);
              })
            }
          } else {
            // 根据选中效果，刷新表格数据
            const params = treeNodes.groups.length > 0 ? { proTypeList: filterCheckedKeys, groupList: treeNodes.groups } : { proTypeList: filterCheckedKeys };
            setParameter(params);
            // 请求获取对应的所有符合条件的proCode，并赋值给 selectedRowKeys，用数据驱动页面回显效果
            dispatch({
              type: 'roleManagement/getProCodeByConditions',
              payload: params
            }).then(res => {
              const proCodes = res.data;
              setSelectedRowKeys(proCodes);
            })
          }
        } else {// 底稿系统，需要根据已有接口组装proCode，赋值给 selectedRowKeys(此处需区分checked)
          /**
           * 20220715版优化：左侧选中，右侧表格展示合集
           * 接口优化（连飞龙）：支持 proType 传多个，逗号隔开
           */
          if (e.checked) {// 如果选中    
            let proCodes = [];
            const proType = filterCheckedKeys.join(',');
            setProType(proType);// 更新右侧表格数据
            setPageSize(10000);
            setCurrent(1);
            dispatch({
              type: 'roleManagement/getDGProducts',
              payload: { pageSize: 10000, currentPage: 1, keyWords, proType }// pageSize 给极大值，一次获取所有数据，实现跨分页全选
            }).then(res => {
              const rows = res?.rows;
              if (rows && rows.length > 0) {
                rows.forEach(item => {
                  proCodes.push(item.proCode);
                })
              }
              setSelectedRowKeys(proCodes);
            })
          } else {// 取消选中
            if (filterCheckedKeys.length === 0) {
              setPageSize(10);
              setCurrent(1);
              setProType('');
              setSelectedRowKeys([]);
            } else {
              let noCodes = []; // 取消选中的 proCodes 集合
              const soloProType = e.node ? e.node.props.eventKey : '';// 当前取消选中的项
              const proType = filterCheckedKeys.join(',');// 取消选中后，仍然选中的项
              setProType(proType);// 更新右侧表格数据
              setPageSize(10000);
              setCurrent(1);
              dispatch({
                type: 'roleManagement/getDGProducts',
                payload: { pageSize: 10000, currentPage: 1, keyWords, proType: soloProType }
              }).then(res => {
                const rows = res?.rows;
                if (rows && rows.length > 0) {
                  rows.forEach(item => {
                    noCodes.push(item.proCode);
                  })
                  let rowKeys = selectedRowKeys.filter(m => noCodes.every(n => n !== m));// 仅当取消选中项返回非空数组，才从rowKeys 中过滤；否则 rowKeys 保持不变
                  rowKeys = rowKeys ? rowKeys : [];
                  setSelectedRowKeys(rowKeys);
                }
              })
            }
          }
        }
        break;
      case 'myGroup':
        setCheckGroupTreePro(checkedKeys);
        if (filterCheckedKeys.length === 0) {// 当刷新表格数据接口、返回proCode结口传 groupList: []时（即父级tree全不选），报500（因为接口目前支持proTypeList要么不传，传必须是非空数组-感觉接口设计有问题），传{}，默认展示产品类型所有数据
          if (treeNodes.proTypes.length === 0) {// 产品类型也无选中项，则页面初始化（左侧树和右侧表格都初始化）
            setParameter({});
            setSelectedRowKeys([]);
          } else {// 产品类型有之前选中的，需要回显
            // 根据选中效果，刷新表格数据
            setParameter({ proTypeList: treeNodes.proTypes });
            // 请求获取对应的所有符合条件的proCode，并赋值给 selectedRowKeys，用数据驱动页面回显效果
            dispatch({
              type: 'roleManagement/getProCodeByConditions',
              payload: { proTypeList: treeNodes.proTypes }
            }).then(res => {
              const proCodes = res.data;
              setSelectedRowKeys(proCodes);
            })
          }
        } else {
          // 根据选中效果，刷新表格数据
          const params = treeNodes.proTypes.length > 0 ? { proTypeList: treeNodes.proTypes, groupList: filterCheckedKeys } : { groupList: filterCheckedKeys };
          setParameter(params);
          // 请求获取对应的所有符合条件的proCode，并赋值给 selectedRowKeys，用数据驱动页面回显效果
          dispatch({
            type: 'roleManagement/getProCodeByConditions',
            payload: params
          }).then(res => {
            const proCodes = res.data;
            setSelectedRowKeys(proCodes);
          })
        }
        break;
      default:
        break;
    }
  };

  // 删除分组
  const handleDelGroup = e => {
    e.preventDefault();
    validateFieldsAndScroll(['targetId'], (err, values) => {
      if (err) {
        message.warn('请选择分组名称，再进行删除');
        return;
      }
      if (values.targetId) {
        dispatch({
          type: `roleManagement/DELETE_GROUP_FETCH`,
          payload: values.targetId,
        }).then(flag => {
          flag && resetFields(['targetId']);
          setRemoveGroupModal(false);
        });
      }
    });
  };

  // 仅保存组
  const handleSaveGroup = e => {
    e.preventDefault();
    validateFieldsAndScroll(['groupName', 'fatherName'], (err, values) => {
      if (!err) {
        dispatch({
          type: `roleManagement/SAVE_GROUP_FETCH`,
          payload: {
            productGroup: {
              groupName: values.groupName,
              parentId: values.fatherName,
            },
          },
        }).then(res => {
          if (res.modelType) {
            message.success('添加成功');
            setAddNewGroupModal(false);
            // 更新我的产品分组
            dispatch({ type: `roleManagement/GET_PRO_GROUP_FETCH` });
            return;
          }
          message.warn(res.message);
        });
      }
    });
  };

  // 添加分组，并在组中添加产品
  const handleSaveProduct2Group = () => {
    const arr = [];
    SAVE_TEMP_PRO.forEach(item => arr.push(item.proCode));
    validateFieldsAndScroll(['groupName', 'fatherName'], (err, values) => {
      if (!err) {
        dispatch({
          type: `roleManagement/SAVE_PRODUCT_TO_GROUP_FETCH`,
          payload: {
            productGroup: {
              groupName: values.groupName,
              parentId: values.fatherName,
              id: '',
            },
            proCodes: arr,
            type: 'add',
          },
        }).then(boolean => {
          if (boolean) {
            // 关闭添加分组产品弹框
            setAddNewGroupWithProModal(!boolean);
            // 关闭新建分组弹框
            setAddNewGroupModal(false);
          }
        });
      }
    });
  };

  // 编辑分组
  const handleEditProduct2Group = () => {
    const arr = [];
    SAVE_TEMP_PRO.forEach(item => arr.push(item.proCode));
    dispatch({
      type: `roleManagement/SAVE_PRODUCT_TO_GROUP_FETCH`,
      payload: {
        productGroup: {
          id: myGroupSelect[0],
        },
        proCodes: arr,
        type: 'add',
      },
    }).then(boolean => {
      if (boolean) {
        // 关闭编辑分组产品弹框
        setEditGroupModal(!boolean);
        setSelectedKeys([]);
        dispatch({
          type: 'roleManagement/SAVE_PRO_PAGINATION',
          payload: {
            rows: [],
            total: 0,
          },
        });
      }
    });
  };

  const handleSelectRows = (record, selected) => {
    const groupTemp = cloneDeep(SAVE_TEMP_PRO);
    const { proCode } = record;
    if (!groupSelectedRowKeys.includes(proCode) && selected) {
      setGroupSelectedRowKeys([...groupSelectedRowKeys, proCode]);
      dispatch({
        type: 'roleManagement/SAVE_TEMP_PRO',
        payload: [...groupTemp, record],
      });
    }
    if (groupSelectedRowKeys.includes(proCode) && !selected) {
      const temp = groupSelectedRowKeys;
      const tempIndex = temp.indexOf(proCode);
      if (~tempIndex) {
        temp.splice(tempIndex, 1);
        groupTemp.splice(tempIndex, 1);
      }
      setGroupSelectedRowKeys(temp);
      dispatch({
        type: 'roleManagement/SAVE_TEMP_PRO',
        payload: groupTemp,
      });
    }
  };

  // 角色变更
  const handleRoleChanges = () => {
    if (!sysId) {
      message.warn('请选择系统后操作');
      return;
    }
    dispatch({
      type: 'userManagement/modifyRole',
      payload: {
        id: userId,
        sysId,
        roleComIds: selectTagList.map(item => item?.id),
      },
    });
  };

  // 便捷授权
  const handleQuickAuthorizationSave = () => {
    if (!sysId) {
      message.warn('请选择系统后操作');
      return;
    }

    const chooseAuth = cloneDeep(dataPage);
    const userRole = chooseAuth.userRole;// id为3，标识：[产品中心]对应的默认组件；id为4，标识：[底稿系统]对应的默认组件（不应过滤掉）
    const chooseProductType = checkTreePro.filter(item => !item.includes('-'));
    const chooseProductGroup = checkGroupTreePro.filter(item => !item.includes('-'));
    chooseAuth.strategyCodes = saveAuthorizationStrategy;
    chooseAuth.currentSysId = sysId;

    const boolAnd = // boolAnd为true, 标识：产品、产品类型、我的分组全不选
      selectedRowKeys.length === 0 &&
      chooseProductType.length === 0 &&
      chooseProductGroup.length === 0;

    const boolOr = // boolOr为true, 标识：产品、产品类型、我的分组至少选其一
      selectedRowKeys.length !== 0 ||
      chooseProductType.length !== 0 ||
      chooseProductGroup.length !== 0;

    // 不选功能组件  不选产品
    if (userRole.length === 0 && boolAnd) {
      // 底稿系统特殊处理
      chooseAuth.projects.projects = [];// 右侧表格选中的项目集合
      chooseAuth.projects.proType = [];// 左侧树选中的项目id

      dispatch({
        type: 'userManagement/SAVE_QUICK_AUTH_FETCH',
        payload: {
          ...chooseAuth,
          userRole: [],
        },
      });
    }

    // 不选功能组件  只选产品
    if (userRole.length === 0 && boolOr) {
      tempRole.proCodes = selectedRowKeys;
      tempRole.proTypes = chooseProductType;
      tempRole.groups = chooseProductGroup;
      switch (sysId) {
        case '1':
          tempRole.id = 3;
          chooseAuth.userRole = [tempRole];
          break;
        case '4':
          tempRole.id = 4;
          // chooseAuth.userRole = [tempRole];
          // 底稿系统特殊处理
          chooseAuth.projects.projects = selectedRowKeys;// 右侧表格选中的项目集合
          chooseAuth.projects.proType = chooseProductType;// 左侧树选中的项目id
      }

      dispatch({
        type: 'userManagement/SAVE_QUICK_AUTH_FETCH',
        payload: chooseAuth,
      });
    }
    // 只选功能组件  不选产品
    // 选功能组件  选产品
    if ((userRole.length !== 0 && boolAnd) || (userRole.length !== 0 && boolOr)) {
      if (sysId === '4') {// 底稿系统（后台只会关注参数projects)需特殊处理
        chooseAuth.projects.projects = selectedRowKeys;
        chooseAuth.projects.proType = chooseProductType;
      }
      userRole.forEach(item => {// 产品中心，后台只会关注参数userRole
        item.proCodes = selectedRowKeys;
        item.proTypes = chooseProductType;
        item.groups = chooseProductGroup;
      });
      dispatch({
        type: 'userManagement/SAVE_QUICK_AUTH_FETCH',
        payload: chooseAuth,
      });
    }
  };

  const handleSave = () => {
    switch (tabsChange) {
      case '1':
        // 角色变更
        handleRoleChanges();
        break;
      case '2':
        // 便捷授权
        handleQuickAuthorizationSave();
        break;
    }
  };

  // 跳转新的tab页面新增功能组件
  const addFunctionalComponents = () => {
    window.open('/authority/functionManagement/detail?isDetail=0', "_blank");
  }


  const productInfo = [
    {
      name: 'sysId',
      label: '归属系统',
      type: 'radio',
      rules: [{ required: true, message: '请选择归属系统' }],
      // option: attributionSystem || [],
      option: attributionSystem?.filter(item => GET_USER_SYSID.includes(item.code)),
      width: 24,
      config: { onChange: e => setSysId(e.target.value) },
      extra: (
        <SubRole
          sysId={sysId}
          // 根据归属系统查询可用角色组件集合
          roleBySys={roleBySys}
          setSelectTagList={setSelectTagList}
          selectTagList={selectTagList}
          showModal={() => setAuthModal(true)}
        />
      ),
      initialValue: sysId,
    },
  ];

  function handleSizeChange(currentPage, size) {
    setPageSize(size);
    setCurrent(1);
    setCurrent2(1);
  }

  return (
    <div className={styles.cont}>
      <Spin spinning={!!LOADING}>
        <Card className={styles.content}>
          <div className={styles.drawers}>
            <div className={styles.bottomLeft} />
            <div className={styles.middleBox}>
              <Row>
                <Col span={14} className={styles.innerUser}>
                  {saveRecord.username}
                </Col>
                <Col span={2} className={styles.inner} />
                <Col span={8} className={styles.innerButton} />
              </Row>

              <Row>
                <Col span={7} className={styles.inner}>
                  手机号码：{saveRecord.mobile ?? '--'}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构名称：{saveRecord.orgName ?? '--'}
                </Col>
                <Col span={7} className={styles.inner}>
                  创建时间：{saveRecord.createTime ?? '--'}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  电子邮箱：{saveRecord.email ?? '--'}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构代码：{saveRecord.orgCode ?? '--'}
                </Col>
                <Col span={7} className={styles.inner}>
                  机构类型：{saveRecord.orgTypeName ?? '--'}
                </Col>
              </Row>
              <Row>
                <Col span={7} className={styles.inner}>
                  登录名：{saveRecord.usercode}
                </Col>
              </Row>
            </div>
            <div className={styles.bottomLeft} />
          </div>
          <Tabs
            defaultActiveKey="1"
            animated={false}
            onChange={key => {
              setSysId('');
              // 重置模糊查询
              setProCondition('');
              setKeyWords('');
              setTabsChange(key);
              setSelectTagList([]);
            }}
          >
            <TabPane tab="角色授权" key="1">
              {tabsChange === '1' && (
                <Form {...layout}>
                  <Row>
                    <CustomFormItem formItemList={productInfo} form={form} loading={roleLOADING} />
                  </Row>
                </Form>
              )}
            </TabPane>
            <TabPane tab="便捷授权" key="2">
              <Card bordered={false} loading={loading} className={styles.sysBox}>
                <Icon type="info-circle" /> 单次授权操作仅限一个系统授权
                <div className={styles.hasChooseRoleTileSys}>
                  归属系统：
                  <Radio.Group onChange={handleJobChange} value={sysId}>
                    {attributionSystem &&
                      attributionSystem
                        ?.filter(item => GET_USER_SYSID.includes(item.code))
                        .map(i => {
                          return (
                            <Radio key={i.name} value={i.code}>
                              {i.name}
                            </Radio>
                          );
                        })}
                  </Radio.Group>
                </div>
                <div className={styles.fLeft} style={{ marginTop: 35 }}>
                  <span className={styles.chooseText}>已选择组件：</span>
                  {[]
                    .concat(userRole)
                    .filter(item => +item.sysId === +sysId && item.id !== 3 && item.id !== 4)
                    .map((tag, index) => {
                      let color = tag.type === '01' ? 'geekblue' : 'green';
                      if (`${tag.id}has` === check) {
                        color = tag.type === '01' ? '#2f54eb' : '#52c41a';
                      }

                      return (
                        <span key={tag.id}>
                          <Tag
                            className={styles.tagStyle}
                            key={tag.id}
                            onClick={() => tagChange(tag, index, 'has')}
                            color={color}
                          >
                            {tag.name}
                            <Icon
                              onClick={e => {
                                e.stopPropagation();
                                closeTage(tag, index);
                              }}
                              type="close"
                            />
                          </Tag>
                        </span>
                      );
                    })}
                </div>
              </Card>
              <Card bordered loading={loading} className={styles.roleAllStyle}>
                <div style={{ float: 'left' }}>功能组件：</div>
                <div
                  style={{ display: tags && tags['02'].length > 7 ? 'block' : 'none' }}
                  className={styles.iconShow}
                  onClick={() => setShow(!show)}
                >
                  {show ? '收起' : '展开'}
                  <Icon type={show ? 'up' : 'down'} />
                </div>
                <div className={styles.addiconShow}>
                  <Tag
                    onClick={addFunctionalComponents}
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon type="plus" />
                    功能
                  </Tag>
                </div>
                <div className={show ? styles.fLeft : styles.hideTag}>
                  {tags &&
                    tags['02'].map((tag, index) => {
                      return (
                        <span key={tag.id}>
                          <Tag
                            key={tag.id}
                            style={{ fontSize: '14px' }}
                            className={+tag.id === +check ? styles.checkStyle : styles.unCheckStyle}
                            onClick={() => tagChange(tag, index, '')}
                          >
                            <Tooltip title={text}>{tag.name}</Tooltip>
                          </Tag>
                        </span>
                      );
                    })}
                </div>
              </Card>
              {/* 当归属系统是产品中心，或底稿系统时，渲染此代码 */}
              {(sysId === '1' || sysId === '4') && (
                <div style={{ border: '1px solid #e8e8e8', display: 'flex' }}>
                  <div style={{ background: '#fff', width: 200 }}>
                    <div className={styles.slider} id="slider">
                      <Row>
                        <Col span={24}>
                          <Form>
                            <Form.Item {...formItemLayout} label="" className={styles.searchInput}>
                              {getFieldDecorator('searchValue')(
                                <Search
                                  placeholder="请输入产品代码或产品名称"
                                  allowClear={true}
                                  onSearch={value => {
                                    if (sysId === '1') {
                                      setProCondition(value);
                                    }
                                    if (sysId === '4') {
                                      setKeyWords(value);
                                    }
                                    setCurrent(1);
                                  }}
                                  style={{ width: 180, margin: 10 }}
                                />,
                              )}
                            </Form.Item>
                          </Form>

                          <Tree
                            checkable
                            onCheck={(checkedKeys, e) => handleOnCheck(checkedKeys, e, 'proType')}
                            onSelect={(selectedKeys, e) => onTreeSelect(selectedKeys, e, 'proType')}
                            selectedKeys={selectedKeys}
                            checkedKeys={checkTreePro}
                          >
                            {sysId === '1' && renderTreeNodes(SAVE_PRO_TREE, 'spare')}
                            {sysId === '4' && renderTreeNodes2(SAVE_PRO_TREE, 'spare')}
                          </Tree>
                          {/* 底稿没有处理分组功能 */}
                          {sysId === '1' && (
                            <Tree
                              checkable
                              onCheck={(checkedKeys, e) => handleOnCheck(checkedKeys, e, 'myGroup')}
                              onSelect={(selectedKeys, e) => onTreeSelect(selectedKeys, e, 'myGroup')}
                              selectedKeys={selectedKeys}
                              checkedKeys={checkGroupTreePro}
                            >
                              {renderTreeNodes(myGroup, 'value')}
                            </Tree>
                          )}
                        </Col>
                        {sysId === '1' && [
                          <Col span={8}>
                            <div className={styles.box} onClick={() => setAddNewGroupModal(true)}>
                              <Tooltip title="添加分组">
                                <Icon type="plus" theme="outlined" />
                              </Tooltip>
                            </div>
                          </Col>,
                          <Col span={8}>
                            <div
                              className={styles.box}
                              onClick={() => {
                                if (!myGroupSelect) {
                                  message.warn('请先选择分组后再编辑');
                                  return;
                                }
                                setEditGroupModal(true);
                                dispatch({
                                  type: 'roleManagement/GET_GROUP_PRO_FETCH',
                                  payload: {
                                    groupId: myGroupSelect[0],
                                  },
                                });
                                handleAllProduct2({
                                  currentPage: 1,
                                  pageSize: 10,
                                });
                              }}
                            >
                              <Tooltip title="修改分组">
                                <Icon type="edit" theme="outlined" />
                              </Tooltip>
                            </div>
                          </Col>,
                          <Col span={8}>
                            <div className={styles.box} onClick={() => setRemoveGroupModal(true)}>
                              <Tooltip title="删除分组">
                                <Icon type="minus" theme="outlined" />
                              </Tooltip>
                            </div>
                          </Col>,
                        ]}
                      </Row>
                    </div>
                  </div>
                  <div style={{ background: '#fff', width: '100%' }}>
                    <Table
                      rowKey="proCode"
                      size="small"
                      columns={columns}
                      dataSource={SAVE_PRO_PAGINATION?.rows ?? []}
                      loading={GET_PRO_PAGINATION_FETCH_LOADING}
                      pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '40', '80', '10000'],
                        onShowSizeChange: handleSizeChange,
                        onChange: handleStandardTableChange,// handleStandardTableChange必须作为pagination的属性，不能直接作为Table的属性，否则分页会有问题
                        showQuickJumper: true,
                        current,
                        pageSize: pageSize,
                        total: SAVE_PRO_PAGINATION?.total ?? 0,
                        showTotal: () => `共 ${SAVE_PRO_PAGINATION?.total} 条数据`,
                      }}
                      rowSelection={rowSelection}
                    />
                  </div>
                </div>
              )}
            </TabPane>
          </Tabs>
        </Card>
        <div className={styles.saveContent}>
          <div className={styles.saveContentBox}>
            <Button className={styles.btn} onClick={() => router.goBack()}>
              取消
            </Button>
            <Button type={'primary'} className={styles.btn} onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </Spin>
      {authModal && (
        <PreviewModal
          title={'预览权限'}
          authorizationStrategy={manuscriptStrategies[sysId]}
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
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
          handleReset={handleReset}
          ownershipSystem={attributionSystem}
          selectOwnershipSystem={sysId}
          ownershipSystemChange={value => setSysId(value)}
          // userauthed={userauthed}
          roleComByUser={selectTagList}
          // 根据归属系统查询可用角色组件集合
          roleBySys={roleBySys}
          handleQueryBySys={handleQueryBySys}
          disabled={true}
          onClose={() => {
            // 重置所属角色
            // dispatch({
            //   type: 'userManagement/setQueryBySys',
            //   payload: [],
            // });
            // 重置已选角色的 功能组件
            setAssociatedFunction([]);
            // setSysId('');
          }}
        />
      )}
      <Modal
        zIndex={100}
        key="4"
        destroyOnClose
        style={{ width: '90%' }}
        visible={addNewGroupModal}
        title="新建分组"
        onCancel={() => setAddNewGroupModal(false)}
        footer={[
          <Button key="determine3" type="primary" onClick={handleSaveGroupAndJudge}>
            选择产品，并保存
          </Button>,
          <Button key="determine4" onClick={handleSaveGroup}>
            仅保存组
          </Button>,
        ]}
      >
        <Form>
          <Form.Item {...formItemLayout} label="分组名称">
            {getFieldDecorator('groupName', {
              rules: [
                {
                  required: true,
                  message: '分组名称不为空',
                },
              ],
            })(<Input style={{ width: 200 }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="父级名称">
            {getFieldDecorator('fatherName', {
              rules: [
                {
                  required: true,
                  message: '父级名称不为空',
                },
              ],
            })(
              <TreeSelect
                style={{ width: 200 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={myGroup}
                placeholder="请选择"
                treeDefaultExpandAll
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        destroyOnClose
        key="5"
        width={'70%'}
        visible={addNewGroupWithProModal}
        title="添加分组产品"
        onOk={handleSaveProduct2Group}
        onCancel={() => setAddNewGroupWithProModal(false)}
        afterClose={() => {
          // 清空已选产品
          setGroupSelectedRowKeys([]);
          dispatch({
            type: 'roleManagement/SAVE_TEMP_PRO',
            payload: [],
          });
          setLeftTreeValue('');
        }}
        mask={false}
      >
        <Row>
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Search
                placeholder="请输入产品代码或产品名称"
                onSearch={value => {
                  setProCondition2(value);
                  setCurrent2(1);
                }}
                style={{ width: 200 }}
                allowClear
              />
              <TreeSelect
                allowClear
                style={{ width: 200 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                treeDefaultExpandAll
                value={leftTreeValue}
                onChange={e => {
                  if (e) {// 防止清空查询条件时，给后台传 [null]
                    setParameter2({ proTypeList: [e] });
                  } else {
                    setParameter2({});// 清空查询条件时，赋初始值
                  }
                  setLeftTreeValue(e);
                  setCurrent2(1);
                }}
              >
                {renderTreeNodes2(SAVE_PRO_TREE, 'spare')}
              </TreeSelect>
            </div>
            <Table
              rowKey="proCode"
              columns={columns}
              dataSource={SAVE_PRO_PAGINATION2?.rows ?? []}
              loading={GET_PRO_PAGINATION2_FETCH_LOADING}
              pagination={handlePagination2}
              size="small"
              rowSelection={{
                // selectedRowKeys: groupSelectedRowKeys,
                onSelect: (record, selected) => {
                  handleSelectRows(record, selected);
                },
                onSelectAll: (selectedBoolean, selectedRows, changeRows) => {
                  const array = [];
                  const groupTemp = cloneDeep(SAVE_TEMP_PRO);
                  changeRows.forEach(item => array.push(item.proCode));
                  if (selectedBoolean) {
                    dispatch({
                      type: 'roleManagement/SAVE_TEMP_PRO',
                      payload: [...groupTemp, ...changeRows],
                    });
                  } else {
                    for (let i = groupTemp.length - 1; i >= 0; i--) {
                      const item = groupTemp[i];
                      if (array.includes(item.proCode)) {
                        groupTemp.splice(i, 1);
                      }
                    }
                    dispatch({
                      type: 'roleManagement/SAVE_TEMP_PRO',
                      payload: groupTemp,
                    });
                  }
                },
              }}
            />
          </Col>
          <Col span={1} />
          <Col span={11} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            </div>
            <div
              style={{
                height: 440,
                overflowY: 'scroll',
                marginTop: 50,
              }}
            >
              {SAVE_TEMP_PRO.map(i => {
                return (
                  <Tag
                    key={i.proCode}
                    value={i.proCode}
                    dataname={i.proName}
                    style={{ margin: 5 }}
                    closable={true}
                    onClose={() => {
                      const newArr = SAVE_TEMP_PRO.filter(item => item.proCode !== i.proCode);
                      dispatch({
                        type: 'roleManagement/SAVE_TEMP_PRO',
                        payload: newArr,
                      });
                    }}
                  >
                    {i.proName}
                  </Tag>
                );
              })}
            </div>
          </Col>
        </Row>
      </Modal>
      <Modal
        key="6"
        destroyOnClose
        style={{ width: 650 }}
        visible={removeGroupModal}
        title="删除分组"
        onOk={handleDelGroup}
        onCancel={() => setRemoveGroupModal(false)}
      >
        <Form>
          <Form.Item {...formItemLayout} label="请选择分组">
            {getFieldDecorator('targetId', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(
              <TreeSelect
                style={{ width: 200 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={myGroup}
                placeholder="请选择"
                treeDefaultExpandAll
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        destroyOnClose
        key="7"
        width={'70%'}
        visible={editGroupModal}
        title="修改分组"
        onOk={handleEditProduct2Group}
        onCancel={() => setEditGroupModal(false)}
        afterClose={() => { }}
      >
        <Spin spinning={!!SAVE_PRODUCT_TO_GROUP_FETCH_LOADING}>
          <Row>
            <Col span={12}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Search
                  placeholder="请输入产品代码或产品名称"
                  onSearch={value => {
                    setProCondition2(value);
                    setCurrent2(1);
                  }}
                  style={{ width: 200 }}
                  allowClear
                />
                <TreeSelect
                  allowClear
                  style={{ width: 200 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  value={leftTreeValue}
                  onChange={e => {
                    if (e) {// 防止清空查询条件时，给后台传 [null]
                      setParameter2({ proTypeList: [e] });
                    } else {
                      setParameter2({});// 清空查询条件时，赋初始值
                    }
                    setLeftTreeValue(e);
                    setCurrent2(1);
                  }}
                >
                  {renderTreeNodes2(SAVE_PRO_TREE, 'spare')}
                </TreeSelect>
              </div>
              <Table
                rowKey="proCode"
                columns={columns}
                dataSource={SAVE_PRO_PAGINATION2?.rows ?? []}
                loading={GET_PRO_PAGINATION2_FETCH_LOADING}
                pagination={handlePagination2}
                size="small"
                rowSelection={{
                  selectedRowKeys: groupSelectedRowKeys,
                  onSelect: (record, selected) => handleSelectRows(record, selected),
                  onSelectAll: (selectedBoolean, selectedRows, changeRows) => {
                    const array = [];
                    const groupTemp = cloneDeep(SAVE_TEMP_PRO);
                    changeRows.forEach(item => array.push(item.proCode));
                    if (selectedBoolean) {
                      dispatch({
                        type: 'roleManagement/SAVE_TEMP_PRO',
                        payload: [...groupTemp, ...changeRows],
                      });
                    } else {
                      for (let i = groupTemp.length - 1; i >= 0; i--) {
                        const item = groupTemp[i];
                        if (array.includes(item.proCode)) {
                          groupTemp.splice(i, 1);
                        }
                      }
                      dispatch({
                        type: 'roleManagement/SAVE_TEMP_PRO',
                        payload: groupTemp,
                      });
                    }
                  },
                }}
              />
            </Col>
            <Col span={1} />
            <Col span={11} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              </div>
              <div
                style={{
                  height: 440,
                  overflowY: 'scroll',
                  marginTop: 50,
                }}
              >
                {SAVE_TEMP_PRO.map(i => {
                  return (
                    <Tag
                      key={i.proCode}
                      value={i.proCode}
                      dataname={i.proName}
                      style={{ margin: 5 }}
                      closable={true}
                      onClose={() => {
                        const newArr = SAVE_TEMP_PRO.filter(item => item.proCode !== i.proCode);
                        dispatch({
                          type: 'roleManagement/SAVE_TEMP_PRO',
                          payload: newArr,
                        });
                      }}
                    >
                      {i.proName}
                    </Tag>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Spin>
      </Modal>
    </div>
  );
};

export default errorBoundary(
  Form.create()(
    connect(
      ({
        role,
        orgAuthorize,
        memberManagement,
        userManagement,
        loading,
        roleManagement,
        workSpace,
      }) => ({
        role,
        orgAuthorize,
        memberManagement,
        roleManagement,
        userManagement,
        workSpace,
        loading: loading.effects['memberManagement/fetch'],
        fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
        fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
        fetchGetPositionsTreeLoading:
          loading.effects['roleManagement/fetchGetPositionsTreeLoading'],
        handleUserFreezeLoading: loading.effects['userManagement/handleUserFreeze'],
        modifyRoleLoading: loading.effects['userManagement/modifyRole'],
        GET_PRO_PAGINATION_FETCH_LOADING:
          loading.effects['roleManagement/GET_PRO_PAGINATION_FETCH'],
        GET_PRO_PAGINATION2_FETCH_LOADING:
          loading.effects['roleManagement/GET_PRO_PAGINATION2_FETCH'],
        SAVE_PRODUCT_TO_GROUP_FETCH_LOADING:
          loading.effects['roleManagement/SAVE_PRODUCT_TO_GROUP_FETCH'],
        LOADING:
          loading.effects['orgAuthorize/QUICK_AUTH_DETAIL_FETCH'] ||
          loading.effects['userManagement/SAVE_QUICK_AUTH_FETCH'] ||
          loading.effects['orgAuthorize/hasRoleSearch'],
        roleLOADING: loading.effects['userManagement/queryRoleComByUser'],
      }),
    )(Index),
  ),
);

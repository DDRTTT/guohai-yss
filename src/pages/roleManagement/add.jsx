import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Layout,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Steps,
  Tag,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import router from 'umi/router';
import pinyin4js from 'pinyin4js';
import Result from '@/components/Result';
import cloneDeep from 'lodash/cloneDeep';
import PreviewModal from './preview';
import { parse } from 'qs';
import { USER_INFO } from '@/utils/session';
import { PageContainers, Table } from '@/components';

const { Search } = Input;
const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const { Step } = Steps;
const { TreeNode } = Tree;

const dirCode = 'attributionSystem,SysUserType,authorizationStrategy,manuscriptStrategy,roleName';

// 获取个人信息
const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));

const handleDataDeal = item => {
  const data = cloneDeep(item);
  data?.map(i => {
    i.label = i?.name;
    i.value = i?.code;
  });
  return data;
};

const DoneCom = () => {
  const { updateId } = parse(location.search, { ignoreQueryPrefix: true });
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={
        <div className={styles.title}>
          <p>{updateId ? '更新成功' : '创建成功'}</p>
          <p className={styles.message}>{updateId ? '角色更新成功' : '角色新增成功'}</p>
        </div>
      }
      style={{ marginTop: 56 }}
    />
  );
};

const Done = errorBoundary(
  connect(({ roleManagement }) => ({
    roleManagement,
  }))(DoneCom),
);

const RoleInfo = (// 点击去关联产品的弹窗页
  {
    form: {
      getFieldDecorator,
      validateFieldsAndScroll,
      getFieldsValue,
      resetFields,
      setFieldsValue,
    },
    saveGetDept,
    tags,
    sysId,
    setSysId,
    savePositionsList,
    dispatch,
    saveRoleDetail,
    saveDictList: { attributionSystem, roleName },
    // 数据策略组件 数据
    strategy,
    saveDictList,
    userSysId,
    SAVE_PRO_TREE,
    SAVE_PRO_GROUP,
    SAVE_PRO_PAGINATION,
    SAVE_PRO_PAGINATION2,
    SAVE_ALL_PRO_CODE,
    GET_PRO_PAGINATION_FETCH_LOADING,
    GET_PRO_PAGINATION2_FETCH_LOADING,
    SAVE_PRODUCT_TO_GROUP_FETCH_LOADING,
    SAVE_TEMP_PRO,
    flagType,
    handleAllProduct,
    handleDGAllProduct,
    handleGetFunctionComponentData,
    handleGetStationComponentData,
  },
  ref,
) => {
  const currentPages = useRef();

  const [addRoleName, setAddRoleName] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [functionLabel, setFunctionLabel] = useState([]);
  const [parameter, setParameter] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  // Tree
  const [checkAllProductTreePro, setAllProductCheckTreePro] = useState([]);
  const [checkTreePro, setCheckTreePro] = useState([]);
  const [checkGroupTreePro, setCheckGroupTreePro] = useState([]);// 由setGroupCheckTreePro 改为 setCheckGroupTreePro
  const [treeNodes, setTreeNodes] = useState({ proTypes: [], groups: [] }); // 产品中心：产品分类、我的分组左侧树的选中情况
  // Table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // proCodes
  // 分组
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
  // 要授权产品的功能组件
  const [functionName, setFunctionName] = useState('');
  const [resultProData, setResultProData] = useState({});
  const [proCondition, setProCondition] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const [leftTreeValue, setLeftTreeValue] = useState('');
  const [rightTreeValue, setRightTreeValue] = useState('');

  const [keyWords, setKeyWords] = useState('');
  const [proType, setProType] = useState('');
  // ----------------------------------------------------------------
  const [proCondition2, setProCondition2] = useState('');
  const [parameter2, setParameter2] = useState({});
  // 分页
  const [current2, setCurrent2] = useState(1);
  const sysIdStr = `${sysId}`;

  const changePageTabs = e => {
    // 重新加载功能组件和岗位组件数据
    if (e.target.visibilityState === 'visible') {
      handleGetFunctionComponentData();
      handleGetStationComponentData();
    }
  };

  useEffect(() => {
    const proTypes = checkTreePro && checkTreePro.length > 0 ? checkTreePro.filter(item => !item.includes('-')) : [];// 过滤父节点key（传参不需要）
    const groups = checkGroupTreePro && checkGroupTreePro.length > 0 ? checkGroupTreePro.filter(item => !item.includes('-')) : [];
    setTreeNodes({ proTypes, groups }); // 用于区分是否可以setSelectedRowKeys([]);且return
  }, [checkTreePro, checkGroupTreePro])

  useEffect(() => {
    document.addEventListener('visibilitychange', changePageTabs, false);
    return () => document.removeEventListener('visibilitychange', changePageTabs, false);
  });

  useEffect(() => {
    // 全部产品code
    handleAllProductCode({});
  }, []);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < SAVE_TEMP_PRO.length; i++) {
      arr.push(SAVE_TEMP_PRO[i].proCode);
    }
    setGroupSelectedRowKeys(arr);
  }, [SAVE_TEMP_PRO]);

  useEffect(() => {
    if (sysIdStr === '1') {
      // 产品分页
      handleAllProduct({ pageSize, currentPage: current, ...parameter, proCondition });
    }
    if (sysIdStr === '4') {
      // 底稿产品分页
      handleDGAllProduct({ pageSize, currentPage: current, keyWords, proType });
    }
  }, [current, parameter, proCondition, keyWords, proType, pageSize]);

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
    const functions = saveRoleDetail?.functions ?? [];
    setFunctionLabel(saveRoleDetail?.functions ?? []);
    // 已存在的 功能组件{id：{}}对象
    const functionsExistObj = {};
    functions.forEach(item => (functionsExistObj[item?.id] = item));
    setResultProData(functionsExistObj);
  }, [saveRoleDetail]);

  useImperativeHandle(ref, () => ({
    handleSubmit: (setCurrent, updateId) => handleSubmit(setCurrent, updateId),
    handleTemporaryStorage: cb => handleTemporaryStorage(cb),
  }));

  // 传到父组件中
  const handleTemporaryStorage = cb => cb(getFieldsValue());

  const handleDealSelectMap = (
    data,
    Com,
    changeHandle = () => { },
    key = 'code',
    value = 'code',
    name = 'name',
    ret,
  ) => {
    data = sysId === '1' ? data.filter(i => i.name !== '产品中心便捷授权隐藏组件') : data.filter(i => i.name !== '底稿系统便捷授权隐藏组件');
    return (
      data &&
      data.length !== 0 &&
      Array.isArray(data) &&
      data.map(i => {
        return (
          <Com key={i[key]} value={i[value]} onChange={changeHandle} {...ret} dataname={i[name]}>
            {i[name]}
          </Com>
        );
      })
    );
  };

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

  const formItemLayoutModal = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  };

  const handleParameters = parameters => {
    const deal = (item, code = 'id') => {
      const arr = [];
      item.map(id => arr.push({ [code]: id }));
      return arr;
    };
    let name;
    for (let i = 0; i < roleName.length; i++) {
      if (roleName[i].code === parameters.name) {
        name = roleName[i].name;
        break;
      } else {
        name = parameters.name;
      }
    }

    const funCodeWithPro = [...Object.values(resultProData)];

    return {
      ...saveRoleDetail,
      ...parameters,
      functions: funCodeWithPro.length === 0 ? functionLabel : funCodeWithPro,
      positions: deal(parameters.positions),
      dataStrategies: deal(parameters.dataStrategies || [], 'strategyCode'),
      type: 1,
      name,
      deptId: Array.isArray(parameters.deptId) ? parameters.deptId[0] : parameters.deptId,
    };
  };

  const handleToArr = (item, fn = null, code = 'id') => {
    if (item && item.length && item.length > 0) {
      item = sysId === '1' ? item.filter(i => i.name !== '产品中心便捷授权隐藏组件') : item.filter(i => i.name !== '底稿系统便捷授权隐藏组件');
    }
    const arr = [];
    if (item && Array.isArray(item)) {
      if (fn) {
        item && item.forEach(i => arr.push(fn(i && i[code])));
      } else {
        item && item.forEach(i => arr.push(i && i[code]));
      }
    }
    if (item && !Array.isArray(item)) {
      if (fn) {
        item && arr.push(fn(item));
      } else {
        item && arr.push(item);
      }
    }
    return arr;
  };

  const handleMessage = (res, text) => {
    if (res && res.status === 200) {
      message.success(`${text}成功`);
      setCurrent(1);
      resetFields();
    } else if (res?.status?.toString().length === 8) {
      message.warn(res.message);
    } else {
      message.warn(`${text}失败`);
    }
  };

  const handleSubmit = (setCurrent, updateId) => {
    validateFieldsAndScroll(
      ['sysId', 'name', 'code', 'remark', 'deptId', 'functions', 'positions', 'dataStrategies'],
      (err, values) => {
        if (!err) {
          if (updateId) {
            dispatch({
              type: 'roleManagement/handleUpdateRole',
              payload: handleParameters(values),
            }).then(res => {
              const text = '角色更新';
              handleMessage(res, text);
              if (res && res.status === 200) router.goBack();
            });
          } else {
            dispatch({
              type: 'roleManagement/handleCreateRole',
              payload: handleParameters(values),
            }).then(res => {
              const text = '角色创建';
              handleMessage(res, text);
              if (res && res.status === 200) router.goBack();
            });
          }
        }
      },
    );
  };

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

  const handleStandardTableChange = (current) => setCurrent(current);

  const handleStandardTableChange2 = (current) => setCurrent2(current);

  function handleSizeChange(currentPage, size) {
    setPageSize(size);
    setCurrent(1);
    setCurrent2(1);
  }

  const handlePagination = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '40', '80'],
    onShowSizeChange: handleSizeChange,
    onChange: handleStandardTableChange,// handleStandardTableChange必须作为pagination的属性，不能直接作为Table的属性，否则分页会有问题
    showQuickJumper: true,
    current,
    pageSize,
    total: SAVE_PRO_PAGINATION?.total ?? 0,
    showTotal: () => `共 ${SAVE_PRO_PAGINATION?.total} 条数据`,
  };

  const handlePagination2 = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '40', '80'],
    onShowSizeChange: handleSizeChange,
    onChange: handleStandardTableChange2,
    showQuickJumper: true,
    current: current2,
    pageSize,
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

  const myGroup = [
    {
      label: '我的分组',
      spare: 'myGroup',
      value: '-1',
      children: SAVE_PRO_GROUP,
    },
  ];

  // 产品中心查询产品-分页-弹框部分数据
  const handleAllProduct2 = item => {
    dispatch({
      type: 'roleManagement/GET_PRO_PAGINATION2_FETCH',
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
        sysIdStr === '4' && Array.isArray(proTypeList) && setProType(proTypeList.join());
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
            total: 0,
            rows: [],
          },
        });
        break;
      default:
        break;
    }
  };

  const rowSelection = {
    selectedRowKeys,
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
        rowKeys = rowKeys.filter(m => changeRows.every(n => n.proCode !== m));
        rowKeys = rowKeys ? rowKeys : [];
        setSelectedRowKeys(rowKeys);
      }
    },
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
        if (filterCheckedKeys.length === 0) {// 当刷新表格数据接口、返回proCode结口传 groupList: []时（即父级tree全不选），报500（因为接口目前支持proTypeList要么不传，传必须是非空数组-感觉接口设计有问题，导致前端要做很多逻辑限制！不然一旦groupList或者proTypeList传了空数组，就报500！），传{}，默认展示产品类型所有数据
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
            total: 0,
            rows: [],
          },
        });
      }
    });
  };

  // 跳转新的tab页面新增功能组件
  const addFunctionalComponents = () => {
    window.open('/authority/functionManagement/detail?isDetail=0', '_blank');
  };

  // 跳转新的tab页面新增岗位组件
  const addStationComponents = () => {
    window.open('/authority/positionManagement', '_blank');
  };

  return [
    <Form {...formItemLayout} id="area" key="1">
      <Form.Item label="归属系统">
        {getFieldDecorator('sysId', {
          rules: [{ required: true, message: '请选择归属系统' }],
          initialValue: saveRoleDetail.sysId && String(saveRoleDetail.sysId),
        })(
          <Radio.Group
            onChange={e => {
              setFieldsValue({
                name: '',
                code: '',
                remark: '',
                deptId: [],
                functions: [],
                positions: [],
                dataStrategies: [],
              });
              setSysId(e.target.value);
              setFunctionLabel([]);
            }}
          >
            {handleDealSelectMap(
              attributionSystem.filter(item => userSysId.includes(item.code)),
              Radio,
            )}
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="角色名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
          initialValue: saveRoleDetail.name,
        })(
          <Select
            getPopupContainer={() => document.getElementById('area')}
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={code => {
              setFieldsValue({ code });
            }}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div
                  style={{ padding: '4px 8px', cursor: 'pointer' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setAddRoleName(true)}
                >
                  <Icon type="plus" /> 添加角色名称
                </div>
              </div>
            )}
          >
            {roleName.map(item => (
              <Option key={item.code} value={item.code}>
                {item.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="角色代码">
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入角色代码', whitespace: true }],
          initialValue: saveRoleDetail.code,
        })(<Input style={{ width: '100%' }} disabled />)}
      </Form.Item>
      <Form.Item label="角色描述">
        {getFieldDecorator('remark', {
          initialValue: saveRoleDetail.remark,
        })(<TextArea rows={4} style={{ width: '100%' }} />)}
      </Form.Item>
      <Form.Item label="功能组件">
        {getFieldDecorator('functions', {
          rules: [{ required: true, message: '请选择功能组件' }],
          initialValue: handleToArr(saveRoleDetail.functions),
        })(
          <Select
            mode="multiple"
            placeholder="请选择"
            allowClear
            getPopupContainer={() => document.getElementById('area')}
            optionFilterProp="children"
            onChange={(_, option) => {
              const arr = [];
              const o = {};
              option.forEach(item => {
                const obj = {};
                obj.id = item?.props?.value;
                obj.code = item?.props?.value;
                obj.value = item?.props?.value;
                obj.name = item?.props?.children;
                obj.label = item?.props?.children;
                arr.push(obj);
                o[obj.id] = obj;
              });
              setFunctionLabel(arr);

              // 循环，将详情中返回的产品放到角色中，新角色则产品为空
              const b = {};
              for (const oElement in o) {
                b[oElement] = resultProData[oElement] ?? o[oElement];
              }

              setResultProData(b);
            }}
          >
            {
              handleDealSelectMap(
                [...(tags['01'] || []), ...(tags['02'] || [])],
                Option,
                null,
                'id',
                'id',
              )
            }
          </Select>,
        )}
        <Icon className={styles.plusBtn} type="plus-circle" onClick={addFunctionalComponents} />
      </Form.Item>
      <Form.Item label="岗位组件">
        {getFieldDecorator('positions', {
          initialValue: handleToArr(saveRoleDetail.positions, i => Number(i)),
        })(
          <Select
            mode="multiple"
            placeholder="请选择"
            allowClear
            getPopupContainer={() => document.getElementById('area')}
            optionFilterProp="children"
          >
            {handleDealSelectMap(savePositionsList, Option, null, 'id', 'id')}
          </Select>,
        )}
        <Icon className={styles.plusBtn} type="plus-circle" onClick={addStationComponents} />
      </Form.Item>
      {!!strategy && (
        <Form.Item label="数据策略组件">
          {getFieldDecorator('dataStrategies', {
            rules: [{ required: !!strategy, message: '请选择数据策略组件' }],
            initialValue: handleToArr(saveRoleDetail.dataStrategies, null, 'strategyCode'),
          })(<CheckboxGroup options={strategy} />)}
        </Form.Item>
      )}
      {!!strategy && (
        <Form.Item label="产品关联">
          <a
            onClick={() => {
              if (functionLabel.length === 0) {
                message.warn('请选择功能组件，再关联产品');
                return;
              }
              setAddProduct(true);
              setProType('');
              setKeyWords('');
              setCurrent(1);
              setProCondition('');
              setParameter({});
              setSelectedKeys([]);
              if (sysIdStr === '1') {
                // 产品分页
                handleAllProduct({
                  pageSize,
                  currentPage: current,
                  ...parameter,
                  proCondition,
                });
                const functionId = 3;
                setSelectedRowKeys(resultProData[functionId]?.proCodes ?? []);
                setCheckTreePro(resultProData[functionId]?.proTypes ?? []);// 产品分类树的回显
                setCheckGroupTreePro(resultProData[functionId]?.groups ?? []);// 我的分组树的回显
              }
              if (sysIdStr === '4') {
                // 底稿产品分页
                handleDGAllProduct({ pageSize, currentPage: current, keyWords, proType });
                const functionId = 4;
                setSelectedRowKeys(resultProData[functionId]?.proCodes ?? []);
                setCheckTreePro(resultProData[functionId]?.proTypes ?? []);// 产品分类树的回显
                setCheckGroupTreePro(resultProData[functionId]?.groups ?? []);// 我的分组树的回显
              }
            }}
          >
            点击去关联产品
          </a>
        </Form.Item>
      )}
    </Form>,
    <Modal
      destroyOnClose
      key="2"
      title="新增角色名称"
      onOk={() => {
        validateFieldsAndScroll(['newName'], (err, { newName }) => {
          if (!err) {
            const code = pinyin4js.convertToPinyinString(newName, '', pinyin4js.WITHOUT_TONE);
            setFieldsValue({ code, name: code });
            dispatch({
              type: 'roleManagement/saveDictList',
              payload: {
                ...saveDictList,
                roleName: [...roleName, { code, name: newName }],
              },
            });
          }
        });
        setAddRoleName(false);
      }}
      visible={addRoleName}
      onCancel={() => setAddRoleName(false)}
    >
      <Form {...formItemLayoutModal}>
        <Form.Item label="角色名称">
          {getFieldDecorator('newName', {})(<Input style={{ width: '100%' }} />)}
        </Form.Item>
      </Form>
    </Modal>,
    <Modal
      zIndex={99}
      key="3"
      destroyOnClose
      width={'70%'}
      visible={addProduct}
      title="关联产品"
      okText="确认关联"
      onOk={() => {
        // 产品代码
        const proCodes = checkAllProductTreePro.length !== 0 ? SAVE_ALL_PRO_CODE : selectedRowKeys;
        // 产品类型
        const proTypes = checkTreePro.filter(item => !item.includes('-'));
        // 产品分组
        const groups = checkGroupTreePro.filter(item => !item.includes('-'));
        const checkedFunction = sysId === '1' ? 3 : 4;
        const addProData = {
          proCodes,
          proTypes,
          groups,
        };
        // 确认关联的逻辑调整: 已选择组件仅展示，当新建/修改角色选择【产品中心】时，id 传 3；选择【底稿系统】时， id 传 4
        setResultProData({
          ...resultProData,
          [checkedFunction]: { ...addProData, id: checkedFunction },
        });
        setAddProduct(false);
        setAllProductCheckTreePro([]);
        setCheckTreePro([]);
        setCheckGroupTreePro([]);
        setSelectedRowKeys([]);
        const text = flagType === 'update' ? '更新角色' : '创建角色';
        message.success(`产品关联成功，${text}后生效`);

      }}
      onCancel={() => {
        setAllProductCheckTreePro([]);
        setCheckTreePro([]);
        setCheckGroupTreePro([]);
        setSelectedRowKeys([]);
        setAddProduct(false);
      }}
    >
      <>
        <Row>
          <Col span={24}>
            <Form>
              <Form.Item label="已选择组件">
                {handleDealSelectMap(functionLabel, Tag, null, 'id', 'id', 'name')}
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Layout style={{ background: '#fff', border: '1px solid #e8e8e8' }}>
          <Sider style={{ background: '#fff' }}>
            <div className={styles.slider} id="slider">
              <Row>
                <Col span={24}>
                  <Search
                    placeholder="请输入产品代码或产品名称"
                    allowClear={true}
                    onSearch={value => {
                      if (sysIdStr === '1') {
                        setProCondition(value);
                      }
                      if (sysIdStr === '4') {
                        setKeyWords(value);
                      }
                      setCurrent(1);
                    }}
                    style={{ width: 180, margin: 10 }}
                  />
                  {/* 注意：产品分类和我的分组在左侧树是分开的树，但是右侧共用一个表格，在实现时：先选择【产品分类-集合】，有379条数据全选，再选择【我的分组-测试4】，有1条数据选中；当取消测试4时，对于分组myGroup而言，filterCheckedKeys是空数组，则会setSelectedRowKeys为[]，但实际上，应该只将测试4的那条数组取消选中！ */}
                  <Tree
                    checkable
                    onCheck={(checkedKeys, e) => handleOnCheck(checkedKeys, e, 'proType')}
                    onSelect={(selectedKeys, e) => onTreeSelect(selectedKeys, e, 'proType')}
                    selectedKeys={selectedKeys}
                    checkedKeys={checkTreePro}
                  >
                    {/* 产品中心-产品分类 */}
                    {sysIdStr === '1' && renderTreeNodes(SAVE_PRO_TREE, 'spare')}
                    {/* 底稿系统-项目分类、系列分类 */}
                    {sysIdStr === '4' && renderTreeNodes2(SAVE_PRO_TREE, 'spare')}
                  </Tree>
                  {sysIdStr === '1' && (//产品中心特有：我的分组
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
                {sysIdStr === '1' && [
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
          </Sider>
          <Layout style={{ background: '#fff' }}>
            <Content>
              <Table
                rowKey="proCode"
                size="small"
                columns={columns}
                dataSource={SAVE_PRO_PAGINATION?.rows ?? []}
                loading={GET_PRO_PAGINATION_FETCH_LOADING}
                pagination={handlePagination}
                rowSelection={rowSelection}
              />
            </Content>
          </Layout>
        </Layout>
      </>
    </Modal>,
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
    </Modal>,
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
    </Modal>,
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
    </Modal>,
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
    </Modal>,
  ];
};

const RoleInfoWrapper = forwardRef(RoleInfo);

const RoleAdd = ({// 点击修改/新建角色的页面
  form,
  dispatch,
  roleManagement: {
    saveGetDept,
    saveDictList: { authorizationStrategy, manuscriptStrategy },
    saveDictList,
    savePositionsList,
    saveAllMenuTree,
    saveAuthorizeActionsList,
    savePositionAuthorizeActionsList,
    tags,
    saveRoleDetail,
    savePositionsTree,
    SAVE_PRO_TREE,
    SAVE_PRO_GROUP,
    SAVE_PRO_PAGINATION,
    SAVE_PRO_PAGINATION2,
    SAVE_ALL_PRO_CODE,
    SAVE_TEMP_PRO,
  },
  workSpace: { GET_USER_SYSID },
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  handleCreateRoleLoading,
  GET_PRO_PAGINATION_FETCH_LOADING,
  GET_PRO_PAGINATION2_FETCH_LOADING,
  SAVE_PRODUCT_TO_GROUP_FETCH_LOADING,
}) => {
  const strategy = {
    1: authorizationStrategy, // 产品生命周期策略
    4: manuscriptStrategy, // 底稿策略
  };

  const childRef = useRef();
  // 步骤
  const [current, setCurrent] = useState(0);
  // 默认系统为 “产品生命周期”
  const [sysId, setSysId] = useState('');
  // 权限预览
  const [authModal, setAuthModal] = useState(false);
  // 获取用户填入的表单数据(弹框使用)
  const [roleFormData, setRoleFormData] = useState({});

  const { flagType, updateId } = parse(window.location.search, { ignoreQueryPrefix: true });

  const [pagination] = useState({
    pageSize: 10,
    currentPage: 1,
  });

  const sysIdStr = `${sysId}`;

  useEffect(() => {

    dispatch({
      type: 'roleManagement/saveRoleDetail',
      payload: {},
    });

    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });

    // 所属部门
    dispatch({
      type: 'roleManagement/fetchGetDept',
      payload: {
        orgId: userInfo?.orgId,
        orgKind: 2,
      },
    });

    dispatch({
      type: 'workSpace/GET_USER_SYSID_FETCH',
    });


    // 获取我的产品分组
    dispatch({
      type: `roleManagement/GET_PRO_GROUP_FETCH`,
    });

    if (flagType === 'update') {
      dispatch({
        type: 'roleManagement/handleRoleDetail',
        payload: updateId,
      }).then(res => res && res.sysId && setSysId(res.sysId));
    }

    return () =>
      dispatch({
        type: 'roleManagement/saveRoleDetail',
        payload: {},
      });
  }, []);

  const handleGetFunctionComponentData = () => {
    // 查询功能组件
    dispatch({
      type: 'roleManagement/fetchHasRole',
      payload: sysId,
    });
  };

  const handleGetStationComponentData = () => {
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
  };

  useEffect(() => {
    if (sysId) {
      handleGetFunctionComponentData();
      handleGetStationComponentData();

      // 权限树查询
      dispatch({
        type: 'roleManagement/fetchGetAuthTree',
        payload: sysId,
      });

      if (sysIdStr === '1') {
        // 产品类树
        dispatch({
          type: `roleManagement/GET_PRO_TREE_FETCH`,
        });
        // 产品分页
        handleAllProduct({ ...pagination });
      }
      if (sysIdStr === '4') {
        // 底稿产品类树
        dispatch({
          type: `roleManagement/GET_DG_PRO_TREE_FETCH`,
        });
        // 底稿产品分页
        handleDGAllProduct({ ...pagination });
      }
    }

    return () => handleReset();
  }, [sysId]);

  // 产品中心查询产品-分页
  const handleAllProduct = item => {
    dispatch({
      type: 'roleManagement/GET_PRO_PAGINATION_FETCH',
      payload: item,
    });
  };

  // 底稿系统查询产品-分页
  const handleDGAllProduct = item => {
    dispatch({
      type: 'roleManagement/GET_DG_PRO_PAGINATION_FETCH',
      payload: item,
    });
  };

  // 下一步并提交
  const next = updateId => {
    childRef.current.handleSubmit(setCurrent, updateId);
  };

  // 再次创建
  const prev = () => {
    const cur = current - 1;
    setCurrent(cur);
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: dirCode },
    });
  };

  // 步骤组件
  const steps = [
    {
      title: '角色信息',
      content: (
        <Spin spinning={!!handleCreateRoleLoading}>
          <RoleInfoWrapper
            ref={childRef}
            form={form}
            dispatch={dispatch}
            saveGetDept={saveGetDept}
            tags={tags}
            sysId={sysIdStr}
            setSysId={setSysId}
            savePositionsList={savePositionsList}
            strategy={handleDataDeal(strategy[sysId])}
            saveRoleDetail={saveRoleDetail}
            saveDictList={saveDictList}
            userSysId={GET_USER_SYSID}
            SAVE_PRO_TREE={SAVE_PRO_TREE}
            SAVE_PRO_GROUP={SAVE_PRO_GROUP}
            SAVE_PRO_PAGINATION={SAVE_PRO_PAGINATION}
            SAVE_PRO_PAGINATION2={SAVE_PRO_PAGINATION2}
            SAVE_ALL_PRO_CODE={SAVE_ALL_PRO_CODE}
            GET_PRO_PAGINATION_FETCH_LOADING={GET_PRO_PAGINATION_FETCH_LOADING}
            GET_PRO_PAGINATION2_FETCH_LOADING={GET_PRO_PAGINATION2_FETCH_LOADING}
            SAVE_PRODUCT_TO_GROUP_FETCH_LOADING={SAVE_PRODUCT_TO_GROUP_FETCH_LOADING}
            // 暂时保存选择的产品
            SAVE_TEMP_PRO={SAVE_TEMP_PRO}
            flagType={flagType}
            handleAllProduct={handleAllProduct}
            handleDGAllProduct={handleDGAllProduct}
            handleGetFunctionComponentData={handleGetFunctionComponentData}
            handleGetStationComponentData={handleGetStationComponentData}
          />
        </Spin>
      ),
    },
    {
      title: '完成',
      content: <Done />,
    },
  ];

  // 获取用户填入的表单数据
  const handleGetRoleFormData = formData => {
    setRoleFormData(formData);
  };
  const handleModalAndFormData = () => {
    setAuthModal(true);
    childRef.current.handleTemporaryStorage(handleGetRoleFormData);
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

  // 重置方法
  const handleReset = () => {
    // 关闭弹框
    setAuthModal(false);
    // 重置通过组件id查询出的权限
    dispatch({
      type: 'roleManagement/saveAuthorizeActionsList',
      payload: [],
    });
    dispatch({
      type: 'roleManagement/savePositionAuthorizeActionsList',
      payload: [],
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
          title: '角色管理',
          url: '/authority/roleManagement',
        },
        {
          title: flagType === 'update' ? '修改角色' : '新建角色',
          url: '',
        },
      ]}
    >
      <div className={styles.base}>
        <Card>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className="steps-content">{steps[current].content}</div>

          <div className="steps-action">
            {current < steps.length - 1 && (
              <>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={() => router.push('/authority/roleManagement')}
                  loading={handleCreateRoleLoading}
                >
                  取消
                </Button>

                {flagType !== 'update' ? (
                  <Button
                    className={styles.btn}
                    type="primary"
                    onClick={() => next()}
                    loading={handleCreateRoleLoading}
                  >
                    创建
                  </Button>
                ) : (
                  <Button
                    className={styles.btn}
                    type="primary"
                    onClick={() => next(updateId)}
                    loading={handleCreateRoleLoading}
                  >
                    更新角色
                  </Button>
                )}
                <Button
                  className={styles.btn}
                  type="link"
                  onClick={handleModalAndFormData}
                  loading={handleCreateRoleLoading}
                >
                  权限预览
                </Button>
              </>
            )}

            {current === steps.length - 1 && (
              <>
                {!flagType && (
                  <Button className={styles.btn} type="primary" onClick={prev}>
                    再次创建
                  </Button>
                )}

                <Button
                  className={styles.btn}
                  type="primary"
                  onClick={() => router.push('/authority/roleManagement')}
                >
                  返回
                </Button>
              </>
            )}
          </div>
        </Card>

        <PreviewModal
          disabled={true}
          // 弹框标题
          title="预览权限"
          // 弹框脚
          footer={null}
          // 数据策略组件 Array<>
          authorizationStrategy={handleDataDeal(strategy[sysId])}
          // 选中的 数据策略组件 Array<>
          dataStrategies={roleFormData.dataStrategies}
          // 弹框 boolean
          authModal={authModal}
          // 控制弹框
          setAuthModal={setAuthModal}
          // 角色名称 string
          name={roleFormData.name}
          // 角色代码 string
          code={roleFormData.code}
          // 根据选中的功能组件id查询 已选的数据 Array<>
          saveAuthorizeActionsList={saveAuthorizeActionsList}
          // 根据选中的岗位id查询 已选的数据 Array<>
          savePositionAuthorizeActionsList={savePositionAuthorizeActionsList}
          // 功能权限树 Array<>
          saveAllMenuTree={saveAllMenuTree}
          // 岗位权限树 Array<>
          savePositionsTree={savePositionsTree}
          // 功能组件 Array<>
          tags={tags['02']}
          // 岗位组件  Array<>
          positionsList={savePositionsList}
          // 选中的 功能组件id Array<>
          functions={roleFormData.functions}
          // 选中的 岗位组件id Array<>
          positions={roleFormData.positions}
          // 通过功能组件id查询当前组件的权限 Fn
          handleFetchGetAuthorizeById={handleFetchGetAuthorizeById}
          // 通过岗位组件id查询当前组件的权限 Fn
          handleFetchGetPositionAuthorizeById={handleFetchGetPositionAuthorizeById}
          fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
          fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
          fetchGetPositionsTreeLoading={fetchGetPositionsTreeLoading}
          // 重置方法
          handleReset={handleReset}
        />
      </div>
    </PageContainers>
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ workSpace, roleManagement, loading }) => ({
      workSpace,
      roleManagement,
      fetchGetAuthorizeByIdLoading: loading.effects['roleManagement/fetchGetAuthorizeById'],
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      fetchGetPositionsTreeLoading: loading.effects['roleManagement/fetchGetPositionsTreeLoading'],
      GET_PRO_PAGINATION_FETCH_LOADING:
        loading.effects['roleManagement/GET_PRO_PAGINATION_FETCH'] ||
        loading.effects['roleManagement/GET_DG_PRO_PAGINATION_FETCH'],
      SAVE_PRODUCT_TO_GROUP_FETCH_LOADING:
        loading.effects['roleManagement/SAVE_PRODUCT_TO_GROUP_FETCH'],
      GET_PRO_PAGINATION2_FETCH_LOADING:
        loading.effects['roleManagement/GET_PRO_PAGINATION2_FETCH'],
    }))(RoleAdd),
  ),
);

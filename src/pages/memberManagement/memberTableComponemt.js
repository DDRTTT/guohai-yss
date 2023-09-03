import React from 'react';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { connect } from 'dva';
import cloneDeep from 'lodash/cloneDeep';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import styles from './memberTableComponemt.less';
import { getSession } from '@/utils/session';

const { Content } = Layout;
const { Option } = Select;
const { TreeNode } = Tree;
const { DirectoryTree } = Tree;
const FormItem = Form.Item;
const { Search } = Input;

const arr = [];

@Form.create()
@connect(({ memberManagement, orgAuthorize, role, loading }) => ({
  memberManagement,
  orgAuthorize,
  role,
  DGLoading: loading.effects['memberManagement/handleDGProjects'],
  loadingByCondition: loading.effects['memberManagement/handlePermissionsByCondition'],
  loadinghandlePermissionsByConditionForAdd:
    loading.effects['memberManagement/handlePermissionsByConditionForAdd'],
}))
export default class MemberTableComponents extends BaseCrudComponent {
  state = {
    visibleForEdit: false,
    visible1: false,
    editData: [],
    // 编辑的分组的id
    groupIdForEdit: '',
    selectedRowsEdit: [],
    saveMoveProductForEdit: [],
    selectedRowKeysForAddTableArr: [],
    proTypes: [],
    bool: false,
    selectedRowKeysForShow: [],
    groupName: '',
    checkedKeysAllProduct: [],
    // 产品类选中的数组
    checkedKeys: ['20', 'allProduct'],
    editModel1: 'none',
    addModel1: 'none',
    editModel: false,
    data: [],
    action: null,
    id: null,
    selectedRows: [],
    autoCompleteResult: [],
    confirmDirty: false,
    // radio
    value: 3,
    model1: false,
    model3: false,
    proList: [],
    // 用户权限radio
    memberFauthorityRadioVal: 3,
    handlerSaveDisable: false,
    selectedRowKeys: [],
    formValues: {
      currentPage: 1,
      pageSize: 10,
    },
    formValuesForShow: {
      currentPage: 1,
      pageSize: 10,
    },
    formValuesForEdit: {
      currentPage: 1,
      pageSize: 7,
    },
    collapsed: false,
    groupNameKey: null,
    inputVisible: false,
    inputValue: '',
    // 分组
    checkedValues: ['All'],
    // 要保存到的目标组
    selectedTags: [],
    // 要保存到的目标组的id
    targetId: null,
    // table是否可勾选
    rowSelection: false,
    // 产品类选中的数组
    checkedKeys2: [],
    // 我的分组选中的数组
    checkedKeys1: [],
    // 新建分组名称
    newGroupName: '',
    methodTpye: true,
    // 父级id
    parentId: null,
    // 已授权未授权
    authorizationType: 'all',
    // 新建成员id
    memberId: this.props.id,
    currentPage: 1,
    pageSize: 10,
    selectedKeys: [],
    disable: false,
    disable1: false,
    disableCheckbox: false,
    disableCheckbox1: false,

    DGProType: '',
    currentFlag: false,
    current: '',
  };

  setFormValues = val => {
    this.setState({
      formValuesForShow: val,
    });
  };

  onChangeRemoveGroup = () => {};

  handleStandardTableChange = pagination => {
    if (!this.state.currentFlag) {
      const page = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.setState({
        current: pagination.current,
      });
      this.handleGetUserAuthority(page);
    } else {
      const {
        formValues: { proCondition },
      } = this.props;
      const { selectedKeys } = this.state;
      const sysId = getSession('sysId');
      const firstSysIds = sysId?.split(',')[0] || 1;
      if (firstSysIds !== '4') {
        const page = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          proCondition,
          proTypeList: selectedKeys,
        };
        this.handlePermissionsByCondition(page);

        this.setState({
          formValuesForShow: { ...page },
        });
      } else {
        const page = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
        };
        // 底稿分页
        this.handleDGAllProduct({
          ...page,
          proType: this.state.DGProType,
        });
        this.setState({
          formValuesForShow: { ...page },
        });
      }
    }
  };

  // 产品分类
  onExpandForProductClass = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onExpandForMyGroup = expandedKeys1 => {
    this.setState({
      expandedKeys1,
      autoExpandParent1: false,
    });
  };

  onExpandForAllProduct = expandedKeys2 => {
    this.setState({
      expandedKeys2,
      autoExpandParent2: false,
    });
  };

  onExpandForAddGroup = expandedKeys3 => {
    this.setState({
      expandedKeys3,
      autoExpandParent3: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
    const { checkedKeys1, authorizationType, formValues, memberId } = this.state;
    if (checkedKeys1.includes('myGroup')) {
      checkedKeys1.splice(checkedKeys1.indexOf('myGroup'), 1);
    }
    if (checkedKeys.includes('0-0')) {
      checkedKeys.splice(checkedKeys.indexOf('0-0'), 1);
    }
    let par;
    if (authorizationType !== 'all') {
      par = {
        ...formValues,
        memberId,
        isAuth: authorizationType,
        proTypeList: checkedKeys,
        groupIdList: checkedKeys1,
      };
    } else {
      par = {
        ...formValues,
        memberId,
        proTypeList: checkedKeys,
        groupIdList: checkedKeys1,
      };
    }
    for (const e in par) {
      if (par.hasOwnProperty(e)) {
        if (Object.prototype.toString.call(par[e]) === '[object Array]' && par[e].length === 0) {
          delete par[e];
        }
      }
    }
    this.handlePermissionsByCondition(par);
  };

  renderTreeNodesForAll = (data, par) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.label}
            key={par ? item[par] : item.key}
            dataRef={item}
            icon={item.key === 'myGroup' ? '' : <Icon type="tool" />}
            disableCheckbox={this.state.disable1}
          >
            {this.renderTreeNodesForAll(item.children, par)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          disableCheckbox
          {...item}
          key={par ? item[par] : item.key}
          title={item.label}
          icon={<Icon type="tool" />}
        />
      );
    });
  };

  renderTreeNodes = (data, par) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.label}
            key={par ? `-${item[par]}` : `-${item.key}`}
            dataRef={item}
            icon={item.key === 'myGroup' ? '' : <Icon type="tool" />}
            disableCheckbox={this.state.disable}
          >
            {this.renderTreeNodes(item.children, par)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          disableCheckbox={this.state.disable}
          {...item}
          key={par ? item[par] : item.key}
          title={item.label}
          icon={<Icon type="tool" />}
        />
      );
    });
  };

  showModal = selectedKeys => {
    if (selectedKeys[0] === 'myGroup') return;
    this.setState({
      // editModel1: true,
      visibleForEdit: true,
      groupNameKey: selectedKeys[0],
      // editModel1: 'block',
    });
  };

  showModalFun = key => {
    this.setState({
      [key]: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, model1: false });
    }, 3000);
  };

  handleCancel = key => () => {
    this.setState({
      [key]: false,
    });
  };

  showModalSaveGroup = key => () => {
    this.setState({
      [key]: true,
    });
  };

  showRemoveModel = () => () => {
    this.setState({
      addModel1: 'block',
    });
  };

  // 产品类别选择
  onChange = checkedValues => {
    this.setState({
      // checkedValues,
      parentId: checkedValues,
      targetId: checkedValues,
    });
  };

  // 产品类别选择
  onChangeForChooseFather = checkedValues => {
    this.setState({
      // checkedValues,
      parentId: checkedValues,
      targetId: checkedValues,
    });
  };

  inputChange = e => {
    this.setState({
      newGroupName: e.target.value,
    });
  };

  // 添加分组
  handleAddGroup = () => {
    const { dispatch, namespace } = this.props;
    const { newGroupName, parentId } = this.state;
    const val = {
      flag: 1,
      content: {
        groupName: newGroupName,
        parentId,
      },
    };
    dispatch({
      type: `${namespace}/handleAddGroup`,
      payload: val,
    });
    this.setState({
      model3: false,
    });
  };

  // 删除分组
  handleDelGroup = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields(['targetId'], (err, values) => {
      if (err) {
        message.warn('请选择分组名称，再进行删除');
        return;
      }
      if (values.targetId) {
        dispatch({
          type: `memberManagement/handleDelGroup`,
          payload: values.targetId,
        });
        this.setState({
          removeModel: false,
        });
      }
    });
  };

  treeToArr = item => {
    const children = [];
    item.forEach(item => {
      if (item.children) {
        item.children.forEach(items => {
          children.push(
            <Option key={items.label} value={items.value}>
              {items.label}
            </Option>,
          );
        });
      } else {
        children.push(
          <Option key={item.key} value={item.value}>
            {item.label}
          </Option>,
        );
      }
    });
    return children;
  };

  //= ===========================================================

  // 仅保存组
  handleSaveGroup = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields(['groupName', 'fatherName'], (err, values) => {
      if (err) return;
      const val = {
        productGroup: {
          groupName: values.groupName,
          parentId: values.fatherName,
        },
      };
      if (!err) {
        dispatch({
          type: `memberManagement/handleSaveGroup`,
          payload: val,
        });
      }
    });
  };

  // 保存组并选择产品 先判断（第一步）
  handleSaveGroupAndJudge = e => {
    const { dispatch, namespace, form } = this.props;
    e.preventDefault();
    form.validateFields(['groupName', 'fatherName'], (err, values) => {
      if (err) return;
      if (!err) {
        this.setState({
          addModel1: 'block',
          saveAddGroup: false,
          groupName: values.groupName,
          fatherName: values.fatherName,
        });

        // 检查分组下是否有分组，有则无法添加产品
        dispatch({
          type: `memberManagement/handleCheckGroup`,
          payload: values.fatherName,
        });
        dispatch({
          type: 'memberManagement/handleonCheckProCodes',
          payload: [],
        });
      }
    });

    // this.setState({
    //   visible1: true,
    // });
    dispatch({
      type: 'memberManagement/handleModelStepOne',
      payload: false,
    });
  };

  // 保存组并选择产品（第二步）
  handleSaveGroupAndAddPro = e => {
    const {
      dispatch,
      namespace,
      form: { validateFields },
      memberManagement: { saveMoveProduct },
    } = this.props;
    const {
      groupNameForEdit,
      fatherName,
      selectedRowKeysForAddTable,
      groupIdForEdit,
      editData,
    } = this.state;
    const par = {
      groupName: groupNameForEdit,
      parentId: fatherName,
      id: groupIdForEdit,
      // proCodes: selectedRowKeysForAddTable,
    };
    const key = [];
    for (let i = 0; i < editData.length; i++) {
      key.push(editData[i].proCode);
    }
    validateFields(['groupNameEdit'], (err, values) => {
      if (!err) {
        dispatch({
          type: `memberManagement/handleSaveGroupForEdit`,
          payload: {
            productGroup: {
              ...par,
            },
            proCodes: key,
            type: 'edit',
          },
        });
        this.setState({
          visible1: false,
        });
      }
    });
  };

  handleSaveGroupAndAddPro1 = e => {
    const {
      dispatch,
      namespace,
      form: { validateFields },
      memberManagement: { saveMoveProduct },
    } = this.props;
    const {
      groupName,
      fatherName,
      selectedRowKeysForAddTable,
      groupIdForEdit,
      editData,
    } = this.state;
    const par = {
      groupName,
      parentId: fatherName,
      id: groupIdForEdit,
      // proCodes: selectedRowKeysForAddTable,
    };
    const key = [];
    for (let i = 0; i < saveMoveProduct.length; i++) {
      key.push(saveMoveProduct[i].proCode);
    }
    dispatch({
      type: `memberManagement/handleSaveGroupForEdit`,
      payload: {
        productGroup: {
          ...par,
        },
        proCodes: key,
        type: 'add',
      },
    });
    this.setState({
      visible1: false,
    });
  };

  // 编辑分组产品时，保存
  handleSaveGroupForEdit = e => {
    const {
      dispatch,
      namespace,
      form,
      memberManagement: { saveMoveProductForEditKeys },
    } = this.props;
    const {
      groupName,
      groupIdForEdit,
      groupNameForEdit,
      parentIdForEdit,
      fatherName,
      selectedRowKeysForAddTable,
      editData,
    } = this.state;

    const key = [];
    for (let i = 0; i < editData.length; i++) {
      key.push(editData[i].proCode);
    }

    const par = {
      groupName: groupNameForEdit,
      parentId: parentIdForEdit,
      id: groupIdForEdit,
    };

    dispatch({
      type: `memberManagement/handleSaveGroupForEdit`,
      payload: {
        productGroup: {
          ...par,
        },
        proCodes: key,
      },
    });
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });
    this.setState({
      editModel1: 'none',
    });
  };

  // 条件查询产品
  handlePermissionsByCondition = val => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    const par = {
      currentPage: 1,
      pageSize: 10,
      // userOrgId: saveOrgId,
      // userOrgId: 356,
      ...val,
    };
    this.setState({
      formValues: par,
    });
    dispatch({
      type: `memberManagement/handlePermissionsByCondition`,
      payload: par,
    });
  };

  // 条件查询产品code
  handlePermissionsByConditionForAllCodeForAll = val => {
    const {
      dispatch,
      memberManagement: { saveOrgId, selectedRowKeysForShow },
    } = this.props;
    dispatch({
      type: `memberManagement/handlePermissionsByConditionForAllCodeForAll`,
      payload: {
        selectedRowKeysForShow,
        val: {
          // userOrgId: saveOrgId,
          ...val,
        },
      },
    });
  };

  // 条件查询产品code
  handlePermissionsByConditionForAllCode = val => {
    const {
      dispatch,
      memberManagement: { saveOrgId, selectedRowKeysForShow },
    } = this.props;
    dispatch({
      type: `memberManagement/handlePermissionsByConditionForAllCode`,
      payload: {
        selectedRowKeysForShow,
        val: {
          // userOrgId: saveOrgId,
          ...val,
        },
      },
    });
  };

  // 条件查询产品code 置空
  handlePermissionsByConditionForAllCodeNull = val => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    dispatch({
      type: `memberManagement/handlePermissionsByConditionForAllCodeNull`,
    });
  };

  //= ===========================================================

  /// ////////////////////////////////////////////////////////////////////////////

  /// ////////////////////////////////////////////////////////////////////////////

  // 产品类
  handlePermissionClass = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handlePermissionClass`,
    });
  };

  // 获取我的分组
  handleMyGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleMyGroup`,
    });
  };

  // 选中请求，展示时
  onSelect = (key, selectedKeys) => {
    this.setState({ currentFlag: true });
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    const { sysIds } = this.state;
    // if (selectedKeys[0]?.includes('-')) {
    //   selectedKeys = selectedKeys[0].split('-') && [selectedKeys[0].split('-')[1]];
    // }
    const {
      dispatch,
      memberManagement: { savePermissionClass, saveMyGroup, saveOrgId },
    } = this.props;
    const { formValuesForShow } = this.state;
    const productClass = [
      {
        label: '产品分类',
        key: 'productClass',
        spare: 'productClass',
        children: savePermissionClass,
      },
    ];
    const treeData = [
      {
        label: '我的分组',
        key: 'myGroup',
        value: '-1',
        spare: 'myGroup',
        children: saveMyGroup,
      },
    ];

    this.setState({
      selectedKeys,
    });

    dispatch({
      type: 'memberManagement/handleonOnSelectKeys',
      payload: selectedKeys,
    });

    const { proTypes } = this.state;
    // 勾选和点击在同一支树上时，tabel不可勾选
    if (proTypes.includes(selectedKeys[0])) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }
    const val = {
      pageSize: 10,
      currentPage: 1,
      // userOrgId: saveOrgId,
    };
    this.setState({
      formValuesForShow: val,
    });

    if (selectedKeys[0]){
      switch (key) {
        case 'allProduct':
          this.handleAllProduct(val);
          break;
        case 'proTypeList':
          const par = selectedKeys[0] === '0-0' ? 'productClass' : selectedKeys[0];
          const arr = this.getPlainNode(productClass, par, 'spare');
          if (firstSysIds !== '4') {
            this.handleAllProduct({ proTypeList: arr });
            this.setState({
              selectedKeys: arr,
            });
          } else {
            // 底稿 选中的类型

            const par = {
              proType: selectedKeys[0],
              ...formValuesForShow,
              currentPage: 1,
            };
            this.setState({
              DGProType: selectedKeys[0],
            });
            // 底稿 产品列表查询
            this.handleDGAllProduct(par);
          }

          break;
        case 'groupList':
          const pars = selectedKeys[0] === 'myGroup' ? 'myGroup' : selectedKeys[0];
          const arrs = this.getPlainNode(treeData, pars, 'key');
          this.handleAllProduct({ groupList: arrs });
          break;
      }
    }else {
      dispatch({
        type: 'memberManagement/allPermissions',
        payload: {
          data: [],
        },
      });
    }

  };

  // 获取当前节点下子节点的key
  getPlainNode = (item, str, key) => {
    str = str && str.includes('-') ? str.split('-')[1] : str;
    const arr = [];
    const arr1 = [];

    function f(item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i][key] === str) {
          arr.push(item[i]);
        } else if (item[i].children) {
          f(item[i].children);
        }
      }
    }

    function f1(item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].children) {
          f1(item[i].children);
        } else {
          arr1.push(item[i][key]);
        }
      }
    }

    f(item);
    f1(arr);
    return arr1;
  };

  // 勾选时，‘全部产品’树
  onCheckAllProduct = checkedKeys => {
    const {
      dispatch,
      memberManagement: { saveOrgId, selectedKeys },
    } = this.props;
    this.setState({ checkedKeysAllProduct: checkedKeys });
    const val = {
      pageSize: 10,
      currentPage: 1,
      // userOrgId: saveOrgId,
    };
    this.setState({
      formValues: val,
      // proTypes: checkedKeys,
    });
    if (checkedKeys.length !== 0) {
      this.handlePermissionsByConditionForAllCodeForAll(val);
      this.setState({
        disable: true,
      });
    } else {
      this.handlePermissionsByConditionForAllCodeNull();
      this.setState({
        disable: false,
      });
    }
    if (checkedKeys[0] === selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }
  };

  // 勾选时，‘产品分类’树
  onCheckProTypeList = checkedKeys => {
    const { dispatch } = this.props;
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;

    if (firstSysIds !== '4') {
      checkedKeys = checkedKeys.filter(item => !item.includes('-'));

      this.setState({ proTypes: checkedKeys });
      dispatch({
        type: 'memberManagement/handleonCheckProTypes',
        payload: checkedKeys,
      });
      const { selectedKeys } = this.state;

      if (selectedKeys) {
        if (checkedKeys.includes(selectedKeys[0])) {
          this.setState({
            bool: true,
          });
        } else {
          this.setState({
            bool: false,
          });
        }
      }

      if (checkedKeys.length !== 0) {
        arr.push(1);
        this.setState({
          disable1: true,
        });
      } else {
        arr.pop();
        if (!arr.includes(1)) {
          this.setState({
            disable1: false,
          });
        }
      }

      if (checkedKeys.includes('0-0')) {
        checkedKeys.splice(checkedKeys.indexOf('0-0'), 1);
      }

      const val = {
        proTypeList: checkedKeys,
      };
      // this.handlePermissionsByCondition(val);
      this.handlePermissionsByConditionForAllCode(val);
    } else {
      checkedKeys = checkedKeys.filter(item => !item.includes('-'));
      dispatch({
        type: 'memberManagement/handleonCheckProTypes',
        payload: checkedKeys,
      });
    }
  };

  // 勾选时，‘分组’树
  onCheck1 = checkedKeys => {
    const { dispatch } = this.props;
    this.setState({ checkedKeys1: checkedKeys });
    dispatch({
      type: 'memberManagement/handleonCheckGroup',
      payload: checkedKeys,
    });
    if (checkedKeys[0] === this.state.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }

    if (checkedKeys.length !== 0) {
      arr.push(1);
      this.setState({
        disable1: true,
      });
    } else {
      arr.pop();
      if (!arr.includes(1)) {
        this.setState({
          disable1: false,
        });
      }
    }

    if (checkedKeys.includes('myGroup')) {
      checkedKeys.splice(checkedKeys.indexOf('myGroup'), 1);
    }

    const val = {
      proTypeList: checkedKeys,
    };
    // this.handlePermissionsByCondition(val);
    this.handlePermissionsByConditionForAllCode(val);
  };

  // 获取全部产品table
  handleAllProduct = item => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    const par = {
      currentPage: 1,
      pageSize: 10,
      ...item,
    };
    this.setState({
      formValues: par,
      formValuesForShow: par,
    });
    dispatch({
      type: 'memberManagement/handlePermissionsByCondition',
      payload: par,
    });
  };

  // 获取底稿全部产品table
  handleDGAllProduct = item => {
    const { dispatch } = this.props;
    const par = {
      ...item,
    };
    dispatch({
      type: 'memberManagement/handleDGProjects',
      payload: par,
    });
  };

  // 将选择的产品添加到新分组的列表
  handleMoveProduct = () => {
    const {
      dispatch,
      memberManagement: {
        saveMoveProduct,
        selectedRowKeysForAddTableArr,
        // 勾选全部产品时，获取的table
        saveAllProductByCondition,
      },
    } = this.props;
    const arr = [
      ...saveMoveProduct,
      ...selectedRowKeysForAddTableArr,
      ...saveAllProductByCondition,
    ];
    dispatch({
      type: 'memberManagement/handleMoveProduct',
      payload: arr,
    });
  };

  // 将选择的产品移除
  handleRemoveProduct = () => {
    const {
      dispatch,
      memberManagement: { saveMoveProduct },
    } = this.props;
    const {
      dataSourceForAddTableArr,
      selectedRowKeysForAddTableLeft,
      selectedRowKeysForAddTableLeftArr,
    } = this.state;
    const selectKey = selectedRowKeysForAddTableLeftArr || [];
    const val = {
      selectKey,
      alltable: saveMoveProduct,
    };

    dispatch({
      type: 'memberManagement/handleRemoveProduct',
      payload: val,
    });
  };

  // 将选择的产品添加到新分组的列表
  handleMoveProductForEdit = () => {
    const { selectedRowsEdit, editData, groupIdForEdit } = this.state;
    if (groupIdForEdit.length === 0) {
      message.warning('请先选择分组，再进行编辑');
      return;
    }
    const {
      memberManagement: { selectedRowKeysForAddTableArr },
    } = this.props;
    const as = [...selectedRowsEdit, ...editData, ...selectedRowKeysForAddTableArr];
    const temp = [];
    const index = [];
    const len = as.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (as[i].proCode === as[j].proCode) {
          i++;
          j = i;
        }
      }
      temp.push(as[i]);
      index.push(i);
    }

    this.setState({
      editData: [...temp],
    });
  };

  // 将选择的产品移除
  handleRemoveProductForEdit = () => {
    const {
      dispatch,
      memberManagement: { saveMoveProduct },
    } = this.props;
    const { groupIdForEdit, selectedRowKeysForEditKeys, editData } = this.state;
    if (groupIdForEdit.length === 0) {
      message.warning('请先选择分组，再进行编辑');
      return;
    }
    const middleData = [...editData];

    for (let i = 0; i < selectedRowKeysForEditKeys.length; i++) {
      for (let j = 0; j < middleData.length; j++) {
        if (selectedRowKeysForEditKeys[i] === middleData[j].proCode) {
          middleData.splice(j, 1);
        }
      }
    }

    this.setState({
      editData: middleData,
      selectedRowKeysForEditKeys: [],
      selectedRowKeysForEditRows: [],
    });
  };

  asdf1 = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    e.cancelBubble = true;
    e.stopPropagation();
    this.setState({
      editModel1: 'none',
    });
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });
  };

  // 显示 新建分组第1步 弹框
  showAddModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleModelStepOne',
      payload: true,
    });
  };

  // 隐藏 新建分组第1步 弹框
  hiddenAddModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleModelStepOne',
      payload: false,
    });
    this.setState({
      visible1: false,
      visibleForEdit: false,
    });
  };

  handleModelStepTwo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleModelStepTwo',
      payload: false,
    });
    this.setState({
      visible1: false,
      visibleForEdit: false,
    });
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });
  };

  // 获取全部产品table
  handleSerchAllProduct = item => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    const { formValues } = this.state;
    const val = {
      ...formValues,
      // userOrgId: saveOrgId,
      // userOrgId: 356,
      proCondition: item,
    };
    this.setState({
      formValues: val,
      proCondition: item,
    });
    dispatch({
      type: 'memberManagement/handlePermissionsByCondition',
      payload: val,
    });
  };

  //= =============================================新增==============================================

  // 勾选时，‘全部产品’树
  onCheckAllProductForAdd = checkedKeys => {
    checkedKeys = checkedKeys.filter(item => !item.includes('-'));
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;

    this.setState({ checkedKeysAllProductForAdd: checkedKeys });

    const par = {
      // userOrgId: saveOrgId,
    };
    if (checkedKeys.length !== 0) {
      this.handlePermissionsByConditionForAllCode();
      dispatch({
        type: 'memberManagement/handleAllProduct',
        payload: par,
      });
      //
      // dispatch({
      //   type: 'memberManagement/handleGetAllProduct',
      //   payload: {
      //     saveOrgId,
      //   },
      // });
    }
    if (checkedKeys[0] === this.state.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }
  };

  handleAllProductForAdd = item => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    const par = {
      currentPage: 1,
      pageSize: 10,
      // userOrgId: saveOrgId,
      // userOrgId: 356,
      ...item,
    };
    this.setState({
      formValues1: par,
    });

    dispatch({
      type: 'memberManagement/handlePermissionsByConditionForAdd',
      payload: par,
    });
  };

  // 选中请求，添加分组时
  onSelectForAdd = (key, selectedKeys) => {
    const {
      dispatch,
      memberManagement: { savePermissionClass, saveMyGroup },
    } = this.props;
    const productClass = [
      {
        label: '产品分类',
        key: 'productClass',
        spare: 'productClass',
        children: savePermissionClass,
      },
    ];
    const treeData = [
      {
        label: '我的分组',
        key: 'myGroup',
        value: '-1',
        spare: 'myGroup',
        children: saveMyGroup,
      },
    ];

    this.setState({
      selectedKeys,
    });

    dispatch({
      type: 'memberManagement/handleonOnSelectKeys',
      payload: selectedKeys,
    });

    // 勾选和点击在同一支树上时，tabel不可勾选
    if (selectedKeys[0] === this.state.proTypes[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }

    const val = {
      currentPage: 1,
      pageSize: 7,
    };
    switch (key) {
      case 'allProduct':
        this.handleAllProductForAdd(val);
        break;
      case 'proTypeList':
        const par = selectedKeys[0] === '0-0' ? 'productClass' : selectedKeys[0];
        const arr = this.getPlainNode(productClass, par, 'spare');
        this.handleAllProductForAdd({ proTypeList: arr, ...val });
        break;
      case 'groupList':
        const pars = selectedKeys[0] === 'myGroup' ? 'myGroup' : selectedKeys[0];
        const arrs = this.getPlainNode(treeData, pars, 'key');
        this.handleAllProductForAdd({ groupList: arrs, ...val });
        break;
    }
  };

  handleStandardTableChangeForAdd = ({ current, pageSize }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handlePermissionsByConditionForAdd',
      payload: {
        currentPage: current,
        pageSize,
      },
    });
  };

  handleStandardTableChangeForAddLeft = (pagination, filtersArg, sorter) => {
    const { formValues1 } = this.state;

    const namespace = 'memberManagement';
    const fetch = 'handleSavePack1';
    this.handleStandardTabpage(pagination, filtersArg, sorter, formValues1, fetch, namespace);
  };

  // 勾选时，‘产品分类’树
  onCheckProTypeListForAdd = checkedKeys => {
    checkedKeys = checkedKeys.filter(item => !item.includes('-'));
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    if (checkedKeys.includes('0-0')) {
      checkedKeys.splice(checkedKeys.indexOf('0-0'), 1);
    }

    this.setState({ proTypes: checkedKeys });
    dispatch({
      type: 'memberManagement/handleonCheckProTypes',
      payload: checkedKeys,
    });

    const val = {
      proTypeList: checkedKeys,
      // userOrgId: saveOrgId,
    };
    dispatch({
      type: 'memberManagement/handleAllProduct',
      payload: val,
    });

    if (checkedKeys[0] === this.state.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }

    this.handlePermissionsByConditionForAllCode(val);
  };

  // 勾选时，‘分组’树
  onCheckForAdd = checkedKeys => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    if (checkedKeys.includes('myGroup')) {
      checkedKeys.splice(checkedKeys.indexOf('myGroup'), 1);
    }

    const val = {
      groupList: checkedKeys,
      // userOrgId: saveOrgId,
    };
    dispatch({
      type: 'memberManagement/handleAllProduct',
      payload: val,
    });

    this.setState({ checkedKeys1: checkedKeys });
    dispatch({
      type: 'memberManagement/handleonCheckGroup',
      payload: checkedKeys,
    });
    if (checkedKeys[0] === this.state.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }

    this.handlePermissionsByConditionForAllCode(val);
  };

  //= =============================================新增==============================================

  //= =============================================编辑==============================================

  onChangeForEdit = (value, label, extra) => {
    const { parentId } = extra.triggerNode.props;

    const val = {
      // currentPage: 1,
      // pageSize: 7,
      groupId: value,
    };
    this.setState({
      groupIdForEdit: value,
      groupNameForEdit: label[0],
      parentIdForEdit: parentId,
      val,
    });
    this.handleAllProductForEdit(val);
  };

  handleStandardTableChangeForEdit = ({ current, pageSize }) => {
    const { proCondition } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handlePermissionsByCondition',
      payload: {
        currentPage: current,
        pageSize,
        proCondition,
      },
    });
  };

  handleStandardTableChangeForEditLeft = (pagination, filtersArg, sorter) => {
    // const { formValues } = this.state;
    const { formValuesForEdit } = this.state;
    const formValues = formValuesForEdit;
    const namespace = 'memberManagement';
    const fetch = 'handlePermissionsByCondition1';
    this.handleStandardTabpage(pagination, filtersArg, sorter, formValues, fetch, namespace);
  };

  // 编辑-‘全部产品树’
  onExpandForEdit1 = expandedKeys4 => {
    this.setState({
      expandedKeys4,
      autoExpandParent4: false,
    });
  };

  // 编辑-‘产品分类树’
  onExpandForEdit2 = expandedKeys5 => {
    this.setState({
      expandedKeys5,
      autoExpandParent5: false,
    });
  };

  // 编辑-勾选时，‘全部产品’树
  onCheckForEditAllProduct = checkedKeys => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;

    this.setState({ checkedKeysAllProduct: checkedKeys });
    const val = {
      currentPage: 1,
      pageSize: 7,
    };
    const par = {
      // userOrgId: saveOrgId,
    };
    if (checkedKeys.length !== 0) {
      this.handlePermissionsByConditionForAllCode(val);
      dispatch({
        type: 'memberManagement/handleAllProduct',
        payload: par,
      });
    } else {
      this.handlePermissionsByConditionForAllCodeNull();
    }
    if (checkedKeys[0] === this.props.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }
  };

  // 编辑-勾选时，‘产品分类’树
  onCheckForEditProTypeList = checkedKeys => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;

    this.setState({ proTypes: checkedKeys });

    if (checkedKeys[0] === this.state.selectedKeys[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }
    const par = {
      // userOrgId: saveOrgId,
    };
    if (checkedKeys.includes('0-0')) {
      checkedKeys.splice(checkedKeys.indexOf('0-0'), 1);
      dispatch({
        type: 'memberManagement/handleAllProduct',
        payload: par,
      });
    }

    const val = {
      proTypeList: checkedKeys,
    };
    this.handlePermissionsByConditionForAllCode(val);
  };

  // 编辑-选中请求
  onSelectForEdit = (key, selectedKeys) => {
    const {
      memberManagement: { savePermissionClass, saveMyGroup, saveOrgId },
    } = this.props;
    const productClass = [
      {
        label: '产品分类',
        key: 'productClass',
        spare: 'productClass',
        children: savePermissionClass,
      },
    ];
    const treeData = [
      {
        label: '我的分组',
        key: 'myGroup',
        value: '-1',
        spare: 'myGroup',
        children: saveMyGroup,
      },
    ];

    this.setState({
      selectedKeys,
    });

    // 勾选和点击在同一支树上时，tabel不可勾选
    if (selectedKeys[0] === this.state.proTypes[0]) {
      this.setState({
        bool: true,
      });
    } else {
      this.setState({
        bool: false,
      });
    }

    const val = {
      pageSize: 7,
      currentPage: 1,
      // userOrgId: saveOrgId,
    };
    this.setState({
      formValuesForEdit: val,
    });

    switch (key) {
      case 'allProduct':
        this.handleAllProduct({
          pageSize: 7,
          currentPage: 1,
        });
        break;
      case 'proTypeList':
        const par = selectedKeys[0] === '0-0' ? 'productClass' : selectedKeys[0];
        const arr = this.getPlainNode(productClass, par, 'spare');
        this.handleAllProduct({
          proTypeList: arr,
          pageSize: 7,
          currentPage: 1,
        });
        break;
      case 'groupList':
        const pars = selectedKeys[0] === 'myGroup' ? 'myGroup' : selectedKeys[0];
        const arrs = this.getPlainNode(treeData, pars, 'key');
        this.handleAllProduct({
          groupList: arrs,
          pageSize: 7,
          currentPage: 1,
        });
        break;
    }
  };

  // 编辑-获取全部产品table
  handleAllProductForEdit = item => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;
    const val = {
      // userOrgId: saveOrgId,
      ...item,
    };
    const _this = this;
    dispatch({
      type: 'memberManagement/handleGroupProduct',
      payload: val,
    }).then(function(res) {
      if (res.message === 'success' && res.status === 200) {
        const data = res.data || [];
        _this.setState({
          editData: data,
        });
      }
    });
  };

  //= =============================================编辑==============================================

  // 重置
  handleReset = () => {
    const {
      dispatch,
      memberManagement: { handleSaveOldInfo },
      orgAuthorize: { dataPage },
    } = this.props;
    this.setState({
      pack: handleSaveOldInfo,
      checkedKeysAllProduct: [],
    });

    dispatch({
      type: 'orgAuthorize/queAllDataOld',
      payload: handleSaveOldInfo,
    });
  };

  // 重置table的disabled属性
  handleBoolReset = () => {
    this.setState({
      bool: false,
    });
  };

  // 添加分组和产品后清空数据
  addModelAfterClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleToNull',
    });
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });
  };

  // 编辑分组产品后清空数据
  editModelAfterClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handlePermissionsByConditionTonull',
    });
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });

    this.setState({
      selectedRowKeysForEditKeys: [],
      editData: [],
    });
  };

  // 将权限保存到数据包（'关联到此组件'按钮）
  handleSetAuthToPack = () => {
    const {
      dispatch,
      orgAuthorize: { dataPage },
      // 选中的组件
      index,
      memberManagement: {
        allPermissionsCode,
        selectedRowKeysForShow,
        groups,
        saveOrgId,
        saveInfo,
        saveMobileQueryInfo,
        saveGetRoleByPositions,
        saveAuthorizationStrategy,
        proTypes,
      },
      handleLen,
    } = this.props;

    if (isNaN(index)) {
      message.warning('请先选择组件，再进行关联操作');
      return;
    }
    // const {
    //   // 选中的产品类[]
    //   proTypes,
    // } = this.state;
    let item;
    if (saveMobileQueryInfo[0]) {
      item = saveMobileQueryInfo[0];
    }
    //
    const pack = cloneDeep({ ...dataPage, ...saveInfo, ...item, orgId: saveOrgId });
    // 预留初始组件
    const Repack = { ...dataPage, ...saveInfo, ...item, orgId: saveOrgId };

    if (saveAuthorizationStrategy.length === 0) {
      if (
        selectedRowKeysForShow.length === 0 &&
        proTypes.length === 0 &&
        groups.length === 0 &&
        allPermissionsCode.length === 0
      ) {
        message.warning('请先选择产品，再进行关联操作');
        return;
      }
    }

    const arr = [...pack.userRole, ...saveGetRoleByPositions];
    const uniqueArr = [];
    const len = arr.length;

    function unique(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    }

    unique(arr);
    const role = arr[index];
    const oldProCodes = role.proCodes;
    const oldProTypes = role.proTypes;
    const oldGroups = role.groups;
    const NewProCodes = [...selectedRowKeysForShow, ...allPermissionsCode];
    const NewProTypes = proTypes;
    const NewGroups = groups;
    const val = {
      ...role,
      proCodes: Array.from(new Set([...NewProCodes])),
      proTypes: [...NewProTypes],
      groups: [...NewGroups],
    };

    pack.userRole[index] = val;
    pack.strategyCodes = saveAuthorizationStrategy;

    handleLen(val.proCodes.length);

    this.setState({
      pack,
      Repack,
      dataPage,
    });
    message.success('关联成功');
    dispatch({
      type: 'memberManagement/handleSavePack',
      payload: pack,
    });
    dispatch({
      type: 'orgAuthorize/queAllDataOld',
      payload: pack,
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      memberManagement: { pack },
    } = this.props;
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    const { userRole } = pack;

    for (let i = 0; i < userRole.length; i++) {
      const item = userRole[i];
      if (item.proTypes.length === 0 && item.proCodes.length === 0 && item.group.length === 0) {
        message.warning('请给组件关联产品');
        return;
      }
    }

    dispatch({
      type: 'memberManagement/handleOperationAuthority',
      payload: {
        ...pack,
        currentSysId: firstSysIds,
      },
    });
  };

  // 保存底稿中选中的类、产品和策略
  handleDGSubmit = () => {
    const {
      dispatch,
      memberManagement: { proTypes, selectedRowKeysForShow, saveDGManuscriptStrategy },
    } = this.props;

    const projects = {
      // 底稿产品
      projects: selectedRowKeysForShow, // 产品 右侧
      // 底稿树
      proType: proTypes, // 树   左侧
      authtactics: saveDGManuscriptStrategy, // 策略
    };
    // if (selectedRowKeysForShow.length === 0 && proTypes.length === 0) {
    //   message.warn('请先选择产品，再给用户授权产品');
    //   return;
    // }
    // TODO: 保存底稿中选中的   类、产品、策略
    dispatch({
      type: 'memberManagement/handleSaveDGData',
      payload: projects,
    });

    // message.success('添加产品权限成功，请继续完成授权操作');
  };

  componentDidMount() {
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;

    if (firstSysIds === '4') {
      // 查询底稿产品树
      this.handleDGTree();
      this.handleGetUserAuthority({
        currentPage: 1,
        pageSize: 10,
      });
    } else {
      // 查询产品分类，返回产品树
      this.handlePermissionClass();
      // 查询自定义分组，返回分组树
      this.handleMyGroup();
    }
    this.props.save(this);
  }

  // 只在底稿查询 获取用户当前权限产品
  handleGetUserAuthority = ({ currentPage = 1, pageSize = 10 }) => {
    const { dispatch } = this.props;
    const memberInfos = JSON.parse(sessionStorage.getItem('memberInfos')) || {};
    dispatch({
      type: 'memberManagement/handleGetUserAuthority',
      payload: {
        query: {
          currentPage,
          pageSize,
          userId: memberInfos.id,
        },
        body: {},
      },
    });
  };

  // 查询底稿产品树
  handleDGTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `memberManagement/handleDGTree`,
    });
  };

  componentWillReceiveProps() {
    const {
      memberManagement: {
        allPermissionsCode,
        saveMoveProductForEdit,
        selectedRowKeysForAddTableArrKey,
      },
      formValues,
    } = this.props;
    this.setState({
      formValues,
    });

    this.setState({
      // selectedRowKeysForShow: allPermissionsCode,
      selectedRowKeysForAdd: allPermissionsCode,
      selectedRowKeysForAddTable: selectedRowKeysForAddTableArrKey,
      saveMoveProductForEdit,
    });
  }

  // 重置数据
  componentWillUnmount() {
    const { dispatch } = this.props;
    // 置空table
    dispatch({
      type: 'handleTabelToNull',
    });
    // 置空已选中的table的selectedRowKeys
    dispatch({
      type: 'memberManagement/handleonCheckProCodes',
      payload: [],
    });
    dispatch({
      type: 'memberManagement/allPermissionsForAddToNull',
    });

    dispatch({
      type: 'memberManagement/handleSavePack',
      payload: {},
    });
    dispatch({
      type: 'memberManagement/handleReset',
      payload: [],
    });
  }

  render() {
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    const {
      methodTpye,
      groupName,
      selectedRowKeysForAddTable,
      bool,
      checkedKeysAllProductForAdd,
      selectedRowKeysForEditKeys,
      saveMoveProductForEdit,
      editData,
    } = this.state;

    const {
      loadinghandlePermissionsByConditionForAdd,
      memberManagement: {
        // 产品类[]
        savePermissionClass,
        // 我的分组
        saveMyGroup,
        allPermissions,
        allPermissionsForAdd,
        saveGroupProduct,
        saveCheckGroup,
        saveAddGroupTwo,
        saveAddGroup,
        saveNewTable,
        saveMoveProduct,
        // saveMoveProductForEdit,0
        currentPage,
        groups,
        proTypes,
        selectedRowKeysForShow,
        selectedKeys,
        handleonCheckProCodesForEdit,
        // saveMoveProductForEdit
      },
      form: { getFieldDecorator },
      dispatch,
      DGLoading,
      loadingByCondition,
    } = this.props;
    const allProduct = [
      {
        label: '全部产品',
        key: 'allProduct',
      },
    ];
    const treeData = [
      {
        label: '我的分组',
        key: 'myGroup',
        value: '-1',
        children: saveMyGroup,
      },
    ];
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
        // width: '300px',
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        key: 'proTypeName',
      },
    ];

    //= ======================Add==============================
    const rowSelectionForAddTable = {
      selectedRowKeys: selectedRowKeysForShow,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeysForAddTable: selectedRowKeys,
          checkedKeysAllProductForAdd: selectedRowKeys,
          selectedRowKeysForAddTableArr: selectedRows,
        });
        dispatch({
          type: 'memberManagement/handleSelectedRowKeysForAddTableArr',
          payload: selectedRows,
        });
        dispatch({
          type: 'memberManagement/handleonCheckProCodes',
          payload: selectedRowKeys,
        });
      },
      getCheckboxProps: record => ({
        // disabled: true,
        name: record.name,
      }),
    };
    const rowSelectionForAddTableLeft = {
      selectedRowKeysForAddTable,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeysForAddTableLeft: selectedRowKeys,
          selectedRowKeysForAddTableLeftArr: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        // disabled: record.isGrouped === 1, // Column configuration not to be checked
        // disabled: true,
        name: record.name,
      }),
    };
    const paginationForAddTable = {
      defaultPageSize: 7,
      showQuickJumper: true,
      pageSize: 7,
      current: currentPage,
      total: allPermissionsForAdd.total,
      showTotal: total => `共 ${allPermissionsForAdd.total} 条数据`,
    };
    const paginationForAddTableLeft = {
      // showQuickJumper: true,
      pageSize: 7,
      // current: currentPage,
      // total: saveMoveProduct.length,
      // showTotal: total => `共 ${saveMoveProduct.length} 条数据`,
    };

    //= ======================Add==============================

    //= ======================Edit==============================
    const rowSelectionForEdit = {
      selectedRowKeys: selectedRowKeysForShow,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'memberManagement/handleonCheckProCodes',
          payload: selectedRowKeys,
        });
        this.setState({
          selectedRowsEdit: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: bool,
        name: record.name,
      }),
    };
    const rowSelectionForEditLeft = {
      selectedRowKeys: selectedRowKeysForEditKeys,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeysForEditKeys: selectedRowKeys,
          selectedRowKeysForEditRows: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: bool,
        name: record.name,
      }),
    };
    const paginationForEdit = {
      defaultPageSize: 7,
      showQuickJumper: true,
      pageSize: 7,
      current: currentPage,
      total: allPermissions.total,
      size: 'small',
      showTotal: total => `共 ${allPermissions.total} 条数据`,
    };
    const paginationForEditLeft = {
      // showQuickJumper: true,
      pageSize: 7,
      // current: currentPage,
      // total: saveMoveProductForEdit.total,
      // showTotal: total => `共 ${saveMoveProductForEdit.total} 条数据`,
    };

    //= ======================Edit==============================

    //= ======================Show==============================
    const rowSelectionForShow = {
      selectedRowKeys: selectedRowKeysForShow,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'memberManagement/handleonCheckProCodes',
          payload: selectedRowKeys,
        });
      },
      getCheckboxProps: record => ({
        disabled: bool,
        name: record.name,
      }),
    };

    let current;
    if (!this.state.currentFlag) {
      current = this.state.current;
    } else {
      current = this.state.formValuesForShow.currentPage;
    }
    const pagination = {
      // showSizeChanger: true,
      showQuickJumper: true,
      current,
      total: allPermissions.total,
      showTotal: () => `共 ${allPermissions.total} 条数据`,
    };
    //= ======================Show==============================

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

    if (editData) {
      for (let i = 0; i < editData.length; i++) {
        editData[i].key = editData[i].proCode;
      }
    }

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false}>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <div style={{ display: 'flex', background: '#fff' }}>
              <div className={styles.slider} id="slider">
                <Row>
                  {firstSysIds !== '4' && (
                    <Col span={24}>
                      <Tree
                        // showLine
                        // showIcon
                        // 节点前添加 Checkbox 复选框
                        checkable
                        // 展开/收起节点时触发
                        onExpand={this.onExpandForAllProduct}
                        // （受控）展开指定的树节点
                        expandedKeys={this.state.expandedKeys2}
                        // 是否自动展开父节点
                        autoExpandParent={this.state.autoExpandParent2}
                        // 勾选 点击复选框触发
                        onCheck={this.onCheckAllProduct}
                        // '选中'复选框的树节点  勾选
                        checkedKeys={this.state.checkedKeysAllProduct}
                        // 点选 点击树节点触发
                        onSelect={e => this.onSelect('allProduct', e)}
                        // 设置选中的树节点
                        selectedKeys={selectedKeys}
                      >
                        <TreeNode
                          title="全部产品"
                          key="allProduct"
                          disableCheckbox={this.state.disable1}
                        />
                      </Tree>
                    </Col>
                  )}

                  <Col span={24}>
                    <Tree
                      // showLine
                      // showIcon
                      checkable={!this.props.grantApplication}
                      onExpand={this.onExpandForProductClass}
                      expandedKeys={this.state.expandedKeys}
                      autoExpandParent={this.state.autoExpandParent}
                      // 勾选
                      onCheck={this.onCheckProTypeList}
                      checkedKeys={proTypes}
                      // 点选
                      onSelect={e => this.onSelect('proTypeList', e)}
                      selectedKeys={selectedKeys}
                    >
                      {this.renderTreeNodes(savePermissionClass, 'spare')}
                    </Tree>
                  </Col>
                  {firstSysIds !== '4' && (
                    <Col span={24}>
                      <Tree
                        // showLine
                        showIcon
                        checkable
                        onExpand={this.onExpandForMyGroup}
                        expandedKeys={this.state.expandedKeys1}
                        autoExpandParent={this.state.autoExpandParent1}
                        // 勾选
                        onCheck={this.onCheck1}
                        checkedKeys={groups}
                        // 点选
                        onSelect={e => this.onSelect('groupList', e)}
                        selectedKeys={selectedKeys}
                      >
                        {this.renderTreeNodes(treeData)}
                      </Tree>
                    </Col>
                  )}
                </Row>
                {firstSysIds !== '4' && (
                  <Row>
                    <Col span={8}>
                      <div className={styles.box} onClick={this.showAddModel}>
                        <Tooltip title="添加分组">
                          <Icon type="plus" theme="outlined" />
                        </Tooltip>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.box} onClick={() => this.showModal('editModel')}>
                        <Tooltip title="修改分组">
                          <Icon type="edit" theme="outlined" />
                        </Tooltip>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.box} onClick={() => this.showModalFun('removeModel')}>
                        <Tooltip title="删除分组">
                          <Icon type="minus" theme="outlined" />
                        </Tooltip>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
              <div className={styles.table}>
                <Content
                  style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}
                >
                  <Table
                    bordered
                    rowKey="proCode"
                    columns={this.props.columns}
                    dataSource={allPermissions.rows}
                    loading={this.props.loading || DGLoading || loadingByCondition}
                    pagination={pagination}
                    rowSelection={rowSelectionForShow}
                    onChange={this.handleStandardTableChange}
                  />
                </Content>
              </div>
            </div>
          </Content>
        </Card>

        {/* 新建分组第1步 */}
        <Modal
          destroyOnClose
          style={{ width: '90%' }}
          visible={saveAddGroup}
          title="新建分组"
          onOk={this.hiddenAddModel}
          onCancel={this.hiddenAddModel}
          footer={[
            <Button key="determine3" type="primary" onClick={this.handleSaveGroupAndJudge}>
              保存，并选择产品
            </Button>,
            <Button key="determine4" onClick={this.handleSaveGroup}>
              仅保存组
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formItemLayout} label="分组名称">
              {getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    message: '分组名称不为空',
                  },
                ],
              })(<Input style={{ width: 200 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="父级名称">
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
                  treeData={treeData}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  // onChange={this.onChangeForChooseFather}
                />,
              )}
            </FormItem>
          </Form>
        </Modal>
        {/* 新建分组第2步 */}
        <Modal
          destroyOnClose
          visible={saveAddGroupTwo}
          title="添加分组"
          onOk={this.hiddenAddModel}
          onCancel={this.hiddenAddModel}
          footer={[
            <Button key="determine3" type="primary" onClick={this.handleSaveGroupAndAddPro1}>
              确 定
            </Button>,
            <Button key="determine4" onClick={this.handleModelStepTwo}>
              取 消
            </Button>,
          ]}
          width="90%"
          afterClose={this.addModelAfterClose}
        >
          <Row style={{ minHeight: 200 }}>
            <Col span={9}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>新增分组名称：{groupName}</div>
                <div />
              </div>
              <div className={styles.table} style={{ marginTop: 11 }}>
                <Table
                  // scroll={{ y: 400 }}
                  bordered
                  rowKey="proCode"
                  columns={columns}
                  dataSource={saveMoveProduct}
                  loading={this.props.loading}
                  pagination={paginationForAddTableLeft}
                  rowSelection={rowSelectionForAddTableLeft}
                  onChange={this.handleStandardTableChangeForAddLeft}
                  size="small"
                />
              </div>
            </Col>

            <Col span={2} style={{ textAlign: 'center', marginTop: '7%' }}>
              <button
                size="small"
                type="button"
                className="ant-btn ant-btn-primary btnStyle"
                onClick={this.handleMoveProduct}
              >
                <span>{'<-添加到组'}</span>
              </button>
              <br />
              <button
                size="small"
                type="button"
                className="ant-btn btnStyle"
                style={{ marginTop: '20px' }}
                onClick={this.handleRemoveProduct}
              >
                <span>{'取消授权->'}</span>
              </button>
            </Col>

            <Col span={13}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div />
                <div>
                  <Search
                    placeholder="输入产品代码或产品名称"
                    onSearch={value =>
                      this.handleAllProductForAdd({
                        proCondition: value,
                        currentPage: 1,
                        pageSize: 7,
                      })
                    }
                    style={{ width: 250 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', background: '#fff' }}>
                <div className={styles.sliders} id="slider">
                  {/* <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} defaultValue={['All']}> */}
                  <Row>
                    <Col span={24}>
                      <DirectoryTree
                        // showLine
                        showIcon
                        // 节点前添加 Checkbox 复选框
                        checkable
                        // 展开/收起节点时触发
                        onExpand={this.onExpandForAllProduct}
                        // （受控）展开指定的树节点
                        expandedKeys={this.state.expandedKeys2}
                        // 是否自动展开父节点
                        autoExpandParent={this.state.autoExpandParent2}
                        // '勾选'点击复选框触发
                        onCheck={this.onCheckAllProductForAdd}
                        // '勾选'复选框的树节点  勾选
                        checkedKeys={this.state.checkedKeysAllProductForAdd}
                        // '点击'树节点触发
                        onSelect={e => this.onSelectForAdd('allProduct', e)}
                        // '点击'设置选中的树节点
                        selectedKeys={this.state.selectedKeys}
                      >
                        {this.renderTreeNodes(allProduct)}
                      </DirectoryTree>
                    </Col>
                    <Col span={24}>
                      <DirectoryTree
                        // showLine
                        showIcon
                        checkable
                        onExpand={this.onExpandForAddGroup}
                        expandedKeys={this.state.expandedKeys3}
                        autoExpandParent={this.state.autoExpandParent3}
                        // 勾选
                        onCheck={this.onCheckProTypeListForAdd}
                        checkedKeys={this.state.proTypes}
                        // 点选
                        onSelect={e => this.onSelectForAdd('proTypeList', e)}
                        selectedKeys={this.state.selectedKeys}
                      >
                        {this.renderTreeNodes(savePermissionClass, 'spare')}
                      </DirectoryTree>
                    </Col>
                    <Col span={24}>
                      <DirectoryTree
                        // showLine
                        showIcon
                        checkable
                        onExpand={this.onExpandForMyGroup}
                        expandedKeys={this.state.expandedKeys1}
                        autoExpandParent={this.state.autoExpandParent1}
                        // 勾选
                        onCheck={this.onCheckForAdd}
                        checkedKeys={groups}
                        // 点选
                        onSelect={e => this.onSelectForAdd('groupList', e)}
                        selectedKeys={this.state.selectedKeys}
                      >
                        {this.renderTreeNodes(treeData)}
                      </DirectoryTree>
                    </Col>
                  </Row>
                  {/* </Checkbox.Group> */}
                </div>
                <div className={styles.table}>
                  <Table
                    bordered
                    rowKey="proCode"
                    columns={this.props.columns}
                    dataSource={allPermissionsForAdd.rows}
                    loading={loadinghandlePermissionsByConditionForAdd}
                    pagination={paginationForAddTable}
                    rowSelection={rowSelectionForAddTable}
                    onChange={this.handleStandardTableChangeForAdd}
                    size="small"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Modal>

        {/* 编辑分组 */}
        <Modal
          destroyOnClose
          visible={this.state.visibleForEdit}
          title="编辑分组"
          onOk={this.hiddenAddModel}
          onCancel={this.hiddenAddModel}
          footer={[
            <Button key="determine3" type="primary" onClick={this.handleSaveGroupAndAddPro}>
              确 定
            </Button>,
            <Button key="determine4" onClick={this.handleModelStepTwo}>
              取 消
            </Button>,
          ]}
          width="95%"
          afterClose={this.editModelAfterClose}
        >
          <div style={{ minHeight: 200 }}>
            <Row type="flex" justify="start">
              <Col span={4}>
                <Form>
                  <FormItem {...formItemLayout} label="分组名称">
                    {getFieldDecorator('groupNameEdit', {
                      rules: [
                        {
                          required: true,
                          message: '分组名称不为空',
                        },
                      ],
                    })(
                      <TreeSelect
                        style={{ width: 200 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={saveMyGroup}
                        placeholder="请选择"
                        treeDefaultExpandAll
                        onChange={this.onChangeForEdit}
                      />,
                    )}
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                编辑产品：
                <div className={styles.table} style={{ marginTop: 11 }}>
                  <Content>
                    <Table
                      // scroll={{ y: 400 }}
                      bordered
                      rowKey="proCode"
                      columns={columns}
                      dataSource={editData}
                      loading={this.props.loading}
                      pagination={paginationForEditLeft}
                      rowSelection={rowSelectionForEditLeft}
                      onChange={this.handleStandardTableChangeForEditLeft}
                      size="small"
                    />
                  </Content>
                </div>
              </Col>

              <Col span={2} style={{ textAlign: 'center', marginTop: '7%' }}>
                <Button type="primary" size="small" onClick={this.handleMoveProductForEdit}>
                  {`<-添加到组`}
                </Button>
                <br />
                <Button
                  size="small"
                  style={{ marginTop: '20px' }}
                  onClick={this.handleRemoveProductForEdit}
                >
                  {'取消授权->'}
                </Button>
              </Col>

              <Col span={13}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>选择产品:</div>
                  <div>
                    <Search
                      placeholder="输入产品代码或产品名称"
                      onSearch={value => this.handleSerchAllProduct(value)}
                      style={{ width: 250 }}
                    />
                  </div>
                </div>
                <div className={styles.table}>
                  <div className={styles.sliders} id="slider">
                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                      <Row>
                        <Col span={24}>
                          <Tree
                            // showLine
                            // showIcon
                            // 节点前添加 Checkbox 复选框
                            // checkable
                            // 展开/收起节点时触发
                            onExpand={this.onExpandForEdit1}
                            // （受控）展开指定的树节点
                            expandedKeys={this.state.expandedKeys4}
                            // 是否自动展开父节点
                            autoExpandParent={this.state.autoExpandParent4}
                            // 点击复选框触发
                            onCheck={this.onCheckForEditAllProduct}
                            // '选中'复选框的树节点  勾选
                            checkedKeys={this.state.checkedKeysAllProduct}
                            // 点击树节点触发
                            onSelect={e => this.onSelectForEdit('allProduct', e)}
                            // 设置选中的树节点
                            selectedKeys={this.state.selectedKeys}
                          >
                            {this.renderTreeNodes(allProduct)}
                          </Tree>
                        </Col>
                        <Col span={24}>
                          <Tree
                            // showLine
                            // showIcon
                            // checkable
                            onExpand={this.onExpandForEdit2}
                            expandedKeys={this.state.expandedKeys5}
                            autoExpandParent={this.state.autoExpandParent5}
                            // 勾选
                            onCheck={this.onCheckForEditProTypeList}
                            checkedKeys={this.state.proTypes}
                            // 点选
                            onSelect={e => this.onSelectForEdit('proTypeList', e)}
                            selectedKeys={this.state.selectedKeys}
                          >
                            {this.renderTreeNodes(savePermissionClass, 'spare')}
                          </Tree>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  </div>
                  <div className={styles.table}>
                    <Table
                      bordered
                      rowKey="proCode"
                      columns={this.props.columns}
                      dataSource={allPermissions.rows}
                      loading={loadingByCondition}
                      pagination={paginationForEdit}
                      rowSelection={rowSelectionForEdit}
                      onChange={this.handleStandardTableChangeForEdit}
                      scroll={{ x: 400 }}
                      size="small"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* 删除分组 */}
        <Modal
          destroyOnClose
          style={{ width: 650 }}
          visible={this.state.removeModel}
          title="删除分组"
          onOk={this.handleOk}
          onCancel={this.handleCancel('removeModel')}
          footer={[
            <Button key="determine2" type="primary" onClick={this.handleDelGroup}>
              确定
            </Button>,
            <Button key="cancel" onClick={this.handleCancel('removeModel')}>
              取消
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formItemLayout} label="请选择分组">
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
                  treeData={saveMyGroup}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={this.onChangeRemoveGroup}
                />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

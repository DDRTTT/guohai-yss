import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Tree,
  TreeSelect,
  Upload,
} from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import Action, { ActionBool, getCurrentMenu } from '@/utils/hocUtil';
import CrudComponent from '@/components/CrudComponent';
import { formItemCreate } from '@/components/FormUtil';
import * as types from '@/utils/FormItemType';
import styles from '@/utils/utils.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  BasicResources,
  DataCenterResources,
  FundApplication,
  ManuscriptResources,
  MultipleCheckBasicResources,
  PositionResources,
  ReportWorldBasicResources,
  SchedulingResources,
  SpecialProductsResources,
} from '@/common';
import MenuPage from './Menu';
import { getAuthToken } from '@/utils/session';
import PageContainer from '@/components/PageContainers';
import { Card } from '@/components';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

const token = getAuthToken();

@errorBoundary
@connect(({ personMenu, memberManagement, loading }) => ({
  personMenu,
  memberManagement,
  menuTreeLoading: loading.effects['personMenu/fetchMenu'],
  addEditDelLoading:
    loading.effects['personMenu/add'] ||
    loading.effects['personMenu/edit'] ||
    loading.effects['personMenu/del'] ||
    loading.effects['personMenu/EXPORT_MENU'] ||
    loading.effects['personMenu/fetch'],
}))
@Form.create()
export default class personMenu extends BaseCrudComponent {
  state = {
    fistInit: 0,
    gData: [],
    currentSelectNode: [],
    currentSelectAction: {},
    title: '新增',
    selectedKeys: null,
    action: 0, // 菜单操作动作，0_初始化状态  1_新增  2_删除 3_修改
    selectMenu: {},
    selectMenuSon: [],
    selectMenuSondata: {},
    TreeSelectdata: '',
    fistNodeCode: '',
    fistNodeId: '',

    childMenu: null,
    actionsShow: false, // 是否显示功能点列表
    sysType: 1,
    selectedKeysArr: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleGetDictList',
      payload: { codeList: 'attributionSystem' },
    });
  }

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id == key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data,
    });
  };

  onDragEnter = info => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  handleModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `personMenu/modelSwitch_new`,
    });
  };

  doDetailInit = (action, title) => {
    const { form } = this.props;
    form.resetFields();
    this.handleModalVisible();
    this.setState({
      action,
      title,
      selectMenu: {},
      selectMenuSon: [],
      selectMenuSondata: {},
      TreeSelectdata: '',
      fistNodeCode: '',
      fistNodeId: '',
      icon: '',
      order: '',
      path: '',
    });
  };

  addAction = (id, action) => {
    const { dispatch } = this.props;

    dispatch({
      type: `personMenu/add`,
      payload: { id, action },
    });
  };

  handlerSave = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      personMenu: { menuTree },
    } = this.props;
    const { sysType } = this.state;

    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (this.state.action == 1) {
        // 新增_区分菜单类型

        if (this.state.fistNodeId == '') {
          if (fieldsValue.icon == undefined || fieldsValue.icon == '') {
            message.warning('未选择父级菜单时,请输入图标代码!');
            return;
          }
          fieldsValue.parent = -1;
        } else {
          fieldsValue.parent = this.state.fistNodeId;
        }
        this.send('1', { ...fieldsValue, sysId: sysType });
      } else if (this.state.action == 2) {
        // 删除
        const data = this.checkTree(fieldsValue.id, menuTree);
        this.send('2', (fieldsValue.id = data));
      } else if (this.state.action == 3) {
        // 修改
        fieldsValue.id = this.state.fistNodeId;
        this.send('3', fieldsValue);
      }
    });
  };

  /**
   * 检查返回树节点下所有节点信息
   */
  checkTree = (rootDate, treeDate) => {
    /**
     * id 目标匹配id  ,tree  目标树,treedown  是否自己向下遍历取值
     */
    const data = [];

    function rootnode(id, tree, treedown) {
      for (const i of tree) {
        if (treedown) {
          data.push(i.id);
          if (i.children) {
            rootnode(id, i.children, true);
          }
        } else if (i.id == id) {
          data.push(i.id);
          if (i.children) {
            rootnode(id, i.children, true);
          }
        } else if (i.children) {
          rootnode(id, i.children, false);
        }
      }
    }

    rootDate.map(root => {
      rootnode(root, treeDate, false);
    });

    return data;
  };

  send = (typeAction, fieldValues) => {
    const { dispatch } = this.props;
    const that = this;
    dispatch({
      type: `personMenu/Menu`,
      payload: {
        fieldValues,
        code: typeAction,
      },
    }).then(res => {
      that.setState({
        gData: res.length > 0 ? res : that.state.gData,
      });
    });
  };

  /**
   * 菜单树加载
   * @param nodes
   * @returns {*}
   */
  loadMenus = nodes => {
    return nodes.map(menu => {
      return (
        <TreeNode
          title={menu.title}
          key={menu.id}
          icon={
            <Icon
              type={
                menu.path == '' || menu.path == undefined || menu.path == null ? 'folder' : 'file'
              }
            />
          }
        >
          {menu.children && this.loadMenus(menu.children)}
        </TreeNode>
      );
    });
  };

  onSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `personMenu/fetchMenu`,
      payload: {
        search: this.state.Search,
        sysId: this.state.sysType,
      },
    }).then(res => {
      if (res.status === 200) {
        this.setState({
          gData: res.data,
        });
      }
    });
  };

  getURL = e => {
    const { dispatch } = this.props;
    dispatch({
      type: `personMenu/getURL`,
      payload: {
        url: e,
      },
    });
  };

  // 点击查询
  handleNodeSelect = selectedKeys => {
    const { dispatch } = this.props;
    const { gData, childMenu } = this.state;
    const id = selectedKeys[0];
    let menuId;
    if (id == undefined) {
      menuId = this.state.selectedKeys;
    } else {
      this.setState({ selectedKeys: id, selectedKeysArr: selectedKeys });
      menuId = id;
    }

    // 判断是否是一级菜单
    const currentSelectNode = getCurrentMenu(gData, 'id', parseInt(id));

    this.setState(
      {
        actionsShow: !!currentSelectNode,
      },
      () => {
        if (this.state.actionsShow) {
          childMenu.handleNodeSelect2(selectedKeys);
        }
      },
    );

    if (selectedKeys.length > 1 || selectedKeys.length === 0) {
      dispatch({
        type: 'personMenu/QUERY_DATA',
        payload: {
          data: {
            rows: [],
            total: 0,
          },
          current: 1,
          pageSize: 10,
          queryParameters: { id: null },
        },
      });
    } else {
      this.doDataSearch({ id: menuId }, 1, 10, 'personMenu');
    }
  };

  getTable = () => {
    if (this.state.action == 1) {
      // 新增
      return this.getTableAdd('add');
    }
    if (this.state.action == 2) {
      // 删除
      return this.getTableDel();
    }
    if (this.state.action == 3) {
      // 修改
      return this.getTableAdd('edit');
    }
  };

  getTableAdd = e => {
    const { getFieldDecorator } = this.props.form;
    const {
      personMenu: { menuTree },
    } = this.props;

    const son_add = [
      {
        key: 'parent',
        label: e === 'add' ? '父级菜单' : '调整菜单',
        type: types.SIMPLE_MOHU_TREE,
        _data: menuTree,
        fieldNames: { label: 'title', value: 'code', children: 'children' },
        options: {
          rules: [{ required: true, message: '父级菜单不能为空!' }],
        },
        ignoreValue: true,
        initdata: this.state.TreeSelectdata,
        onChange: (v, n, e) => {
          const { id, code, title, icon, order, path } = e.triggerNode.props;
          this.setState({
            TreeSelectdata: title,
            fistNodeCode: code,
            fistNodeId: id,
            icon,
            order,
            path,
          });
        },
      },
      {
        key: 'title',
        label: e === 'add' ? '子级菜单' : '菜单名称',
        type: types.INPUT,
        options: {
          initialValue: e !== 'add' ? this.state.TreeSelectdata : '',
          rules: [{ required: true, message: '子级菜单不能为空!' }],
        },
      },
      {
        key: 'code',
        label: e === 'add' ? '子级代码' : '菜单代码',
        type: types.INPUT,
        options: {
          initialValue: e !== 'add' ? this.state.fistNodeCode : '',
          rules: [{ required: true, message: '子代码不能为空!' }],
        },
      },
      {
        key: 'icon',
        label: '图标',
        type: types.INPUT,
        options: {
          initialValue: e !== 'add' ? this.state.icon : '',
        },
      },
      {
        key: 'order',
        label: '序号',
        type: types.INPUT,
        options: {
          initialValue: e !== 'add' ? this.state.order : '',
          rules: [{ pattern: new RegExp(/^\d*$/), message: '序号为数字!' }],
        },
      },
      {
        key: 'path',
        label: '路径',
        type: types.INPUT,
        options: {
          initialValue: e !== 'add' ? this.state.path : '',
        },
      },
    ];
    return (
      <div>
        <span style={{ color: '#f5222d', marginLeft: 10 }}> * 若菜单为一级菜单请不要输入路径</span>
        {formItemCreate(getFieldDecorator, son_add, 2)}
      </div>
    );
  };

  getTableDel = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      personMenu: { menuTree },
    } = this.props;
    const menuTreeString = JSON.stringify(menuTree)
      .replace(/title/g, 'label')
      .replace(/id/g, 'value')
      .replace(/id/g, 'key');
    const treeData = JSON.parse(menuTreeString);

    const tProps = {
      treeData,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择菜单',
      style: {
        width: 300,
      },
    };
    return (
      <div className={styles.buttongrop}>
        <FormItem label="菜单列表:">
          {getFieldDecorator('id', {
            rules: [
              {
                required: true,
                message: '菜单列表不能为空',
              },
            ],
          })(<TreeSelect {...tProps} />)}
        </FormItem>
      </div>
    );
  };

  // 初始化菜单/调整菜单层级结构保存
  confirmInit = param => {
    const { dispatch } = this.props;
    const { sysType } = this.state;
    let basic;
    switch (sysType) {
      case 1:
        // 产品中心
        basic = BasicResources;
        break;
      case 2:
        // 报表世界
        basic = ReportWorldBasicResources;
        break;
      case 3:
        // 资讯中心
        basic = MultipleCheckBasicResources;
        break;
      case 4:
        // 底稿系统
        basic = ManuscriptResources;
        break;
      case 5:
        // 调度中心
        basic = SchedulingResources;
        break;
      case 6:
        // 数据中心
        basic = DataCenterResources;
        break;
      case 7:
        // 头寸系统
        basic = PositionResources;
        break;
      case 8:
        basic = FundApplication;
        break;
      case 10:
        basic = SpecialProductsResources;
        break;
      default:
        message.warning('该系统菜单数据不存在，请添加后再试');
    }
    /**
     * confirmSave 保存菜单层级
     * confirmInit 初始化菜单
     */
    dispatch({
      type: param === 'save' ? `personMenu/confirmSave` : `personMenu/confirmInit`,
      payload: {
        menuVoList: param === 'save' ? this.state.gData : basic,
        sysId: sysType,
      },
    }).then(res => {
      if (res && res.status === 200) {
        this.onSearch();
      } else {
        message.error(res && res.message);
      }
    });
  };

  // 选择系统时加载菜单
  handleChooseSys = item => {
    this.setState({ sysType: item }, () => {
      this.onSearch();
    });
  };

  // 导出菜单
  handleExportMenu = () => {
    const { dispatch } = this.props;
    const { sysType, selectedKeysArr } = this.state;
    dispatch({
      type: 'personMenu/EXPORT_MENU',
      payload: {
        id: selectedKeysArr.length > 0 ? selectedKeysArr.join('-') : '',
        sysId: sysType,
      },
    });
  };

  initDataMenu = () => {
    const {
      personMenu: { isloading, isloading2 },
      memberManagement: {
        saveDictList: { attributionSystem },
      },
    } = this.props;
    const { sysType } = this.state;

    const fileProps = {
      name: 'file',
      action: `/ams/yss-base-admin/menu/upload/${sysType}`,
      showUploadList: false,
      headers: {
        Token: token,
      },
      onChange: info => {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
          this.onSearch();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败，请稍后再试.`);
        }
      },
    };

    const menu = (
      <Menu>
        {ActionBool('personMenu:save') && (
          <Menu.Item>
            <Spin size="small" spinning={isloading2}>
              <Popconfirm
                title="确定将菜单及参数信息保存?"
                onConfirm={() => this.confirmInit('save')}
                okText="确定"
                cancelText="取消"
              >
                保存
              </Popconfirm>
            </Spin>
          </Menu.Item>
        )}
        {ActionBool('personMenu:import') && (
          <Menu.Item>
            <Upload {...fileProps}>菜单导入</Upload>
          </Menu.Item>
        )}
        {ActionBool('personMenu:export') && (
          <Menu.Item>
            <span onClick={this.handleExportMenu}>菜单导出</span>
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <div>
        <div style={{ float: 'left' }}>
          选择系统：
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            onChange={value => this.handleChooseSys(value)}
          >
            {attributionSystem &&
              attributionSystem.map(i => {
                return (
                  <Option key={+i.code} value={+i.code}>
                    {i.name}
                  </Option>
                );
              })}
          </Select>
        </div>
        <div style={{ float: 'left' }}>
          <Action key="personMenu:init" code="personMenu:init">
            <Spin size="small" spinning={isloading}>
              <Popconfirm
                title="确定将菜单及参数信息初始化?"
                onConfirm={() => this.confirmInit('init')}
                okText="确定"
                cancelText="取消"
              >
                <Button style={{ marginLeft: '12px' }} type="danger">
                  初始化
                </Button>
              </Popconfirm>
            </Spin>
          </Action>
        </div>
        <div style={{ float: 'left' }}>
          <Dropdown overlay={menu} placement="bottomCenter">
            <Button style={{ marginLeft: '12px' }}>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </div>
      </div>
    );
  };

  // 存储组件
  save = ref => {
    this.setState({
      childMenu: ref,
    });
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.personMenu.modelVisible_new == false) {
      this.setState(
        {
          action: 0,
        },
        () => {
          console.log();
        },
      );
    }

    if (this.state.fistInit == 0 && nextProps.personMenu.menuTree.length > 0) {
      this.setState({
        gData: nextProps.personMenu.menuTree,
        fistInit: 1,
      });
    }
  }

  render() {
    const {
      personMenu: { data, current, pageSize, modelVisible_new, seltree },
      menuTreeLoading,
      addEditDelLoading,
    } = this.props;

    const { currentSelectNode, currentSelectAction, title, gData, actionsShow } = this.state;

    const colorRedStyle = {
      color: 'red',
    };
    const colorGreenStyle = {
      // color: 'green',
    };
    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
        render(val, record) {
          return (
            <div style={record.parent === -1 ? colorRedStyle : colorGreenStyle}>
              {val || '- - -'}
            </div>
          );
        },
      },
      {
        title: '路径',
        dataIndex: 'path',
        render(val, record) {
          return (
            <div style={record.parent === -1 ? colorRedStyle : colorGreenStyle}>
              {val || '- - -'}
            </div>
          );
        },
      },
      {
        title: '编码',
        dataIndex: 'code',
        render(val, record) {
          return (
            <div style={record.parent === -1 ? colorRedStyle : colorGreenStyle}>
              {val || '- - -'}
            </div>
          );
        },
      },
      {
        title: '图标',
        dataIndex: 'icon',
        render(val, record) {
          return (
            <div style={record.parent === -1 ? colorRedStyle : colorGreenStyle}>
              {val || '- - -'}
            </div>
          );
        },
      },
      {
        title: '层级',
        dataIndex: 'parent',
        render(val) {
          return (
            <div style={val === -1 ? colorRedStyle : colorGreenStyle}>
              {val === -1 ? '首级菜单' : '子级菜单'}
            </div>
          );
        },
      },
    ];

    const gridButtons = [
      {
        text: '新增',
        code: 'add',
        onClick: () => this.doDetailInit(1, '新增'),
        type: 'primary',
      },
      {
        text: '修改',
        code: 'edit',
        onClick: () => this.doDetailInit(3, '修改'),
        type: 'primary',
      },
      {
        text: '删除',
        code: 'del',
        onClick: () => this.doDetailInit(2, '删除'),
        type: 'danger',
      },
    ];

    const ccProps = {
      data,
      loading: addEditDelLoading,
      current,
      pageSize,
      columns,
      gridButtons,
      menuCode: 'personMenu',
      tableExtra: {
        rowSelection: null,
      },
      forbiddenDefaultActions: true,
      doGridSearch: this.doDataSearch,
    };

    const layoutNew = {
      labelAlign: 'right',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <>
        <PageContainer />
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="菜单"
              bordered={false}
              bodyStyle={{
                padding: 0,
                overflowY: 'auto',
                height: '70vh',
              }}
              extra={this.initDataMenu()}
              loading={menuTreeLoading}
            >
              <Tree
                multiple
                showIcon
                defaultExpandAll={false}
                defaultExpandedKeys={seltree}
                onSelect={e => this.handleNodeSelect(e)}
                draggable
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                switcherIcon={<Icon type="down" style={{ fontSize: '12px' }} />}
              >
                {this.loadMenus(gData)}
              </Tree>
            </Card>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card style={{ marginBottom: 24 }} title="子级菜单" bordered={false}>
              <CrudComponent {...ccProps} />
            </Card>

            <div style={{ display: actionsShow ? 'block' : 'none' }}>
              <MenuPage selectNode={currentSelectNode} save={this.save} gData={gData} />
            </div>
          </Col>
        </Row>

        <Modal
          title={`${title}菜单`}
          visible={modelVisible_new}
          width={600}
          footer={null}
          onCancel={this.handleModalVisible}
        >
          <Form {...layoutNew} onSubmit={this.handlerSave}>
            <Card className={styles.card1}>
              <div>
                {this.getTable()}
                <div style={{ textAlign: 'center', marginTop: 5 }}>
                  <span className="submitButtons">
                    <Button
                      style={{ height: 28, marginRight: 20 }}
                      htmlType="submit"
                      type="primary"
                    >
                      保存
                    </Button>
                    <Button
                      style={{ height: 28 }}
                      type="danger"
                      onClick={() => this.handleModalVisible()}
                    >
                      取消
                    </Button>
                  </span>
                </div>
              </div>
            </Card>
          </Form>
        </Modal>
      </>
    );
  }
}

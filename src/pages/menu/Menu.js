import React from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Modal, Row, Tree } from 'antd';
import { getCurrentMenu } from '@/utils/hocUtil';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import CrudComponent from '@/components/CrudComponent';
import { formItemCreate } from '@/components/FormUtil';
import * as types from '@/utils/FormItemType';
import styles from '@/utils/utils.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';

const { TreeNode } = Tree;
const { Search } = Input;
const FormItem = Form.Item;
// @nsHoc({ namespace: 'menu' })
@errorBoundary
@connect(state => ({
  menu: state.menu,
}))
@Form.create()
export default class Menu extends BaseCrudComponent {
  state = {
    currentSelectNode: null,
    currentSelectAction: {},
    title: '新增',
    Search: '',
  };

  componentWillUnmount() {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/clear`,
    });
  }

  componentDidMount() {
    this.props.save(this);
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/getURL`,
      payload: {
        url: null,
      },
    });
  }

  handleModalVisible = () => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/modelSwitch`,
    });
  };

  doDetailInit = (record, title) => {
    const { form } = this.props;
    form.resetFields();
    this.handleModalVisible();
    this.setState({
      currentSelectAction: record,
      title,
    });
  };

  addAction = (id, action) => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/add`,
      payload: { id, action },
    });
  };

  handlerSave = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentSelectNode, currentSelectAction } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.code.indexOf(':') < 0) {
        fieldsValue.code = `${currentSelectNode.code}:${fieldsValue.code}`;
      }
      if (currentSelectAction.id) {
        // 更新
        fieldsValue.id = currentSelectAction.id;
        fieldsValue.menuId = currentSelectAction.menuId;
        // fieldsValue.uri = fieldsValue.uri;
        this.edit(fieldsValue, 'menu');
      } else {
        fieldsValue.menuId = currentSelectNode.id;
        this.addAction(currentSelectNode.id, fieldsValue);
      }
    });
  };

  loadMenus = nodes => {
    return nodes.map(menu => {
      return (
        <TreeNode
          title={menu.title}
          key={menu.id}
          disabled={menu.children !== undefined && menu.children !== null}
        >
          {menu.children && this.loadMenus(menu.children)}
        </TreeNode>
      );
    });
  };

  onSearchChange = e => {
    const { dispatch, namespace } = this.props;
    this.setState({
      Search: e.target.value,
    });
  };

  onSearch = () => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/fetchMenu`,
      payload: {
        search: this.state.Search,
      },
    });
  };

  getURL = e => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `menu/getURL`,
      payload: {
        url: e,
      },
    });
  };

  handleNodeSelect2 = selectedKeys => {
    const {
      menu: { menuTree },
      gData,
    } = this.props;
    if (selectedKeys[0] !== undefined) {
      this.setState({
        selectedKeys,
      });
      const id = parseInt(selectedKeys[0]);
      const currentSelectNode = getCurrentMenu(gData, 'id', id);

      // 只有点击叶子节点才能触发功能点查询操作
      if (currentSelectNode) {
        if (!currentSelectNode.children) {
          this.setState({ currentSelectNode });
          // 加载当前菜单的功能点列表
          this.doDataSearch({ id }, 1, 10, 'menu');
        }
      } else {
        this.setState({ currentSelectNode: { title: '一级菜单' } });
        // 加载当前菜单的功能点列表
        this.doDataSearch({ id: null }, 1, 10, 'menu');
      }
    }
  };

  switchActionCode = tree => {
    tree.forEach(menu => {
      if (menu.children) {
        this.switchActionCode(menu.children);
      } else if (menu.actions) {
        menu.actions.forEach(item => {
          item.code = `${menu.code}:${item.code}`;
        });
      }
    });
  };

  getURLFROM = () => {
    const {
      menu: { url },
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { currentSelectAction } = this.state;
    const url_data = [
      {
        key: 'uri',
        label: 'uri',
        type: types.SELECTOR,
        data: url,
        options: {
          initialValue: currentSelectAction.uri,
        },
      },
    ];
    if (this.state.title == '新增') {
      return (
        <div>
          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
            <label title="uri">url查询</label>
          </div>
          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-20">
            <Search
              key="search_09"
              placeholder="请输入资源标识"
              onSearch={value => this.getURL(value)}
              enterButton
            />
            <div style={{ width: 526, marginLeft: -87 }}>
              {formItemCreate(getFieldDecorator, url_data, 1, 'uri')}
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      menu: {
        data,
        loading,
        current,
        pageSize,
        menuTree,
        actionType,
        methodType,
        modelVisible,
        seltree,
        url,
      },
      form,
      selectNode,
    } = this.props;
    const { currentSelectNode, currentSelectAction, title } = this.state;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '编码',
        dataIndex: 'code',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: 'uri',
        dataIndex: 'uri',
        width: 600,
      },
      {
        title: 'method',
        dataIndex: 'method',
      },
    ];

    const gridButtons = [
      {
        text: '新增',
        code: 'addAction',
        onClick: () => this.doDetailInit({}, '新增'),
      },
    ];

    const colActions = [
      {
        text: '编辑',
        code: 'editAction',
        onClick: record => this.doDetailInit(record, '更新'),
      },
      {
        text: '删除',
        code: 'delAction',
        onClick: record => this.doDel(record, 'menu'),
      },
    ];

    const ccProps = {
      data,
      loading,
      current,
      pageSize,
      columns,
      gridButtons,
      colActions,
      menuCode: 'personMenu',
      space: 'menu',
      tableExtra: {
        rowSelection: null,
        scroll: { x: columns.length * 150 + 500 },
      },
      forbiddenDefaultActions: true,
      doGridSearch: this.doDataSearch,
    };

    const actionDetail = [
      {
        key: 'name',
        label: '名称',
        type: types.INPUT,
        options: {
          initialValue: currentSelectAction.name,
          rules: [{ required: true, message: '功能点名称不能为空!' }],
        },
      },
      {
        key: 'code',
        label: '代码',
        type: types.INPUT,
        options: {
          initialValue: currentSelectAction.code,
          rules: [{ required: true, message: '功能点代码不能为空!' }],
        },
      },
      {
        key: 'type',
        label: '类型',
        type: types.SELECTOR,
        data: actionType,
        options: {
          initialValue: currentSelectAction.type,
          rules: [{ required: true, message: '功能点类型不能为空!' }],
        },
      },
      // {
      //   key: 'method',
      //   label: 'method',
      //   type: types.SELECTOR,
      //   data: methodType,
      //   options: {
      //     initialValue: currentSelectAction.method,
      //   },
      // },
      {
        key: 'description',
        label: '描述',
        type: types.INPUT,
        options: {
          initialValue: currentSelectAction.description,
        },
      },
      {
        key: 'uri',
        label: 'uri',
        type: types.INPUT,
        data: url,
        options: {
          initialValue: currentSelectAction.uri,
        },
      },
    ];

    return (
      <div>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title={`${currentSelectNode ? currentSelectNode.title : ''} 功能点列表`}
              bordered={false}
            >
              <CrudComponent {...ccProps} />
            </Card>
          </Col>
        </Row>

        <Modal
          title={`${title}功能点`}
          visible={modelVisible}
          width={600}
          closable={false}
          maskClosable={false}
          className={styles.defaultModal}
          footer={null}
        >
          <Form onSubmit={this.handlerSave}>
            <Card className={styles.card1}>
              {formItemCreate(getFieldDecorator, actionDetail, 2)}
              {this.getURLFROM()}
              <div style={{ textAlign: 'center' }}>
                <span className="submitButtons">
                  <Button
                    htmlType="submit"
                    type="primary"
                    style={{ marginRight: '20px', height: 28 }}
                    loading={loading}
                  >
                    保存
                  </Button>
                  <Button
                    type="danger"
                    style={{ height: 28 }}
                    onClick={() => this.handleModalVisible()}
                  >
                    取消
                  </Button>
                </span>
              </div>
            </Card>
          </Form>
        </Modal>
      </div>
    );
  }
}

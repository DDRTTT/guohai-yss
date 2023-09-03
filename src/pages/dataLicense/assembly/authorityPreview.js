import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Checkbox, Col, List, Row, Spin, Table } from 'antd';
import eq from 'lodash/eq';
import styles from '../Less/dataLicense.less';

/**
 * 授权面板
 * 组成：
 * 1、面板本身，可以是Card，也可以是普通的div
 * 2、菜单列表或者菜单树
 * 3、功能点复选框
 */

@connect(({ role, loading }) => ({
  role,
  treeLoading: loading.effects['role/init'],
}))
export default class AuthorizationPad extends PureComponent {
  state = {
    checkedActions: [],
  };

  componentDidMount() {
    const { selectedActions } = this.props;
    this.updateActions(selectedActions);
  }

  componentWillReceiveProps(nextProps) {
    if (!eq(nextProps.selectedActions, this.props.selectedActions)) {
      this.updateActions(nextProps.selectedActions);
    }
  }

  updateActions = checkedValues => {
    this.setState({ checkedActions: checkedValues });
  };

  /**
   * 全选功能，暂不实现
   * @param e
   * @param record
   */
  // onMenuCheckboxChange = (e, record) => {};

  onActionCheckboxChange = checkedValues => {
    const { allowedModifying, onSelectedActionsChange } = this.props;
    if (allowedModifying) {
      this.updateActions(checkedValues);

      if (onSelectedActionsChange) {
        onSelectedActionsChange(checkedValues.filter(item => item > 0));
      }
    }
  };

  actionsRender = actions => {
    return (
      <Row gutter={24}>
        {actions &&
          actions.map(item => {
            return (
              <Col span={4} key={item.id}>
                <Checkbox value={item.id} key={item.id}>
                  {item.name}
                </Checkbox>
              </Col>
            );
          })}
      </Row>
    );
  };

  menuColumns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      width: '10%',
      // render: (text,record,index) => <Checkbox value={-record.id} onChange={ (e) => this.onMenuCheckboxChange(e,record)}>{text}</Checkbox>
    },
    {
      title: '功能点列表',
      dataIndex: 'actions',
      render: (text, record) => this.actionsRender(record.actions),
    },
  ];

  expandedRowRender = record => {
    const { authorizes } = this.props;
    let data = [];
    const codes = [];
    for (let i = 0; i < authorizes.length; i++) {
      if (authorizes[i].code === record.code) {
        data = authorizes[i].children;
        break;
      }
    }
    data?.forEach(item => codes.push(item.code));
    return (
      <Table
        key={records => records.code}
        defaultExpandedRowKeys={codes}
        defaultExpandAllRows={true}
        showHeader={false}
        columns={this.menuColumns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
    );
  };

  updateAuth = () => {
    this.props.addRoleFun();
  };

  checkAll = () => {
    const { allMenuTreeCode } = this.props;
    this.setState({ checkedActions: allMenuTreeCode });
    this.onActionCheckboxChange(allMenuTreeCode);
  };

  render() {
    const {
      authorizes,
      // allowedModifying,
      treeLoading,
    } = this.props;
    const { checkedActions } = this.state;
    const parData = [];
    const codes = [];
    authorizes.forEach(item => {
      parData.push({ title: item.title, code: item.code });
      codes.push(item.code);
    });

    return (
      <div style={{ marginTop: '40px' }} className={styles.tableStyle}>
        <Spin spinning={treeLoading}>
          <List className={styles.authList} bordered>
            <p className={styles.roleAuth}>权限预览</p>
            {/*          <Button
            onClick={this.checkAll}
            className={styles.checkAll}
            style={{ display: allowedModifying ? 'block' : 'none' }}
          >
            全选
          </Button> */}
            <Button
              disabled={this.props.roleHas == ''}
              onClick={() => {
                this.updateAuth();
              }}
              style={{ display: this.props.update ? 'block' : 'none' }}
              className={styles.updateAuth}
            >
              修改权限
            </Button>
          </List>
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={this.onActionCheckboxChange}
            value={checkedActions}
          >
            <Table
              key={record => record.code}
              defaultExpandedRowKeys={codes}
              showHeader={false}
              defaultExpandAllRows={true}
              columns={[{ title: '父菜单', dataIndex: 'title', key: 'title' }]}
              dataSource={parData}
              expandedRowRender={this.expandedRowRender}
              pagination={false}
              size="small"
            />
          </Checkbox.Group>
        </Spin>
      </div>
    );
  }
}

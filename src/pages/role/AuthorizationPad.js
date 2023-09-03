/**
 *Create on 2020/7/13.
 */

import React, { PureComponent } from 'react';
import { Checkbox, Col, Row, Table } from 'antd';
import eq from 'lodash/eq';

/**
 * 授权面板
 * 组成：
 * 1、面板本身，可以是Card，也可以是普通的div
 * 2、菜单列表或者菜单树
 * 3、功能点复选框
 */
export default class AuthorizationPad extends PureComponent {
  state = {
    checkedActions: [],
  };

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
  onMenuCheckboxChange = (e, record) => {
    console.log(e.target.checked);
  };

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
              <Col span={4}>
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
      render: (text, record, index) => this.actionsRender(record.actions),
    },
  ];

  expandedRowRender = record => {
    const { authorizes } = this.props;
    let data = [];
    for (let i = 0; i < authorizes.length; i++) {
      if (authorizes[i].code === record.code) {
        data = authorizes[i].children;
        break;
      }
    }

    return (
      <Table
        key={`menuAuthorization-${record.code}`}
        showHeader={false}
        columns={this.menuColumns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
    );
  };

  render() {
    const { authorizes } = this.props;
    const { checkedActions } = this.state;
    const parData = [];
    authorizes.forEach(item => {
      parData.push({ title: item.title, code: item.code });
    });

    return (
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={this.onActionCheckboxChange}
        value={checkedActions}
      >
        <Table
          key="menuAuthorization-table"
          showHeader={false}
          defaultExpandAllRows
          expandRowByClick
          columns={[{ title: '父菜单', dataIndex: 'title', key: 'title' }]}
          dataSource={parData}
          expandedRowRender={this.expandedRowRender}
          pagination={false}
          size="small"
        />
      </Checkbox.Group>
    );
  }
}

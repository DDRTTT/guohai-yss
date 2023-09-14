import React, { Component } from 'react';
import { Tree, Tooltip, Icon } from 'antd';
const { TreeNode } = Tree;
import { FormOutlined, PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
class SelfTree extends Component {
  state = {};
  //添加
  add = item => {
    this.props.add && this.props.add(item);
  };
  //修改
  modify = item => {
    this.props.modify && this.props.modify(item);
  };
  //删除
  delete = item => {
    this.props.delete && this.props.delete(item);
  };
  //撤销
  revoke = item => {
    this.props.revoke && this.props.revoke(item);
  };
  // onCheck = (checkedKeys, e) => {
  //   console.log(checkedKeys, e, '点击onCheck');
  // };

  treeData = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={
              <span className={item.checked == '2' ? styles.greytitle : styles.title}>
                {item.title}
                {this.props.details && (
                  <>
                    {item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.add.bind(this, item)}
                      >
                        <PlusOutlined />
                      </span>
                    )}
                    {item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.modify.bind(this, item)}
                      >
                        <FormOutlined />
                      </span>
                    )}

                    {!item.deletefalg && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.delete.bind(this, item)}
                      >
                        <DeleteOutlined />
                      </span>
                    )}
                    {this.props.org === 'own' && item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.revoke.bind(this, item)}
                      >
                        <ReloadOutlined />
                      </span>
                    )}
                  </>
                )}
              </span>
            }
            value={item.key}
          >
            {this.treeData(item.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            // disabled={true}
            key={item.key}
            title={
              <div className={item.checked == '2' ? styles.greytitle : styles.title}>
                {item.title}
                {this.props.details && (
                  <>
                    {item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.add.bind(this, item)}
                      >
                        <PlusOutlined />
                      </span>
                    )}
                    {item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.modify.bind(this, item)}
                      >
                        <FormOutlined />
                      </span>
                    )}

                    {!item.deletefalg && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.delete.bind(this, item)}
                      >
                        <DeleteOutlined />
                      </span>
                    )}
                    {this.props.org === 'own' && item.checked != '2' && (
                      <span
                        className={styles.box}
                        style={{ marginLeft: 10 }}
                        onClick={this.revoke.bind(this, item)}
                      >
                        <ReloadOutlined />
                      </span>
                    )}
                  </>
                )}
              </div>
            }
            value={item.key}
          />
        );
      }
    });
  render() {
    const { treeData } = this.props;
    return (
      <div className={styles.tree}>
        <Tree>{this.treeData(treeData)}</Tree>
      </div>
    );
  }
}

export default SelfTree;

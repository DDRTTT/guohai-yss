import React, { memo, useEffect, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Checkbox, Col, List, Modal, Row, Spin, Tabs, Tag, Tree } from 'antd';
import styles from '@/pages/roleManagement/index.less';

const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const CheckboxGroup = Checkbox.Group;

/**
 *
 * @param fetchGetAuthorizeByIdLoading
 * @param fetchGetAuthTreeLoading
 * @param allMenuTree
 * @param authorizeActionsList
 * @returns {JSX.Element}
 * @constructor
 */
const AuthTree = memo(
  ({ fetchGetAuthorizeByIdLoading = false, allMenuTree, authorizeActionsList, disabled }) => {
    const [expandedKeys, setExpandedKeys] = useState([]); // 展开的key值
    const [autoExpandParent, setAutoExpandParent] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]); // 选中的值

    useEffect(() => {
      const _authorizeActionsList = authorizeActionsList?.toString()?.split(',');
      setCheckedKeys(_authorizeActionsList);
      setExpandedKeys(_authorizeActionsList);
    }, [authorizeActionsList]);

    const onCheck = checkedKeys => {
      if (!disabled) {
        setCheckedKeys(checkedKeys);
      }
    };

    const onExpand = expandedKeys => {
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    };

    const renderTreeNodes = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.label} key={`_${item.id}`} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        if (item.actions && item.actions.length) {
          return (
            <TreeNode title={item.label} key={`_${item.id}`} dataRef={item} className={'auth-tree'}>
              {renderTreeNodes(item.actions)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.label} {...item} />;
      });
    return (
      <div className={styles.tableStyle}>
        <Spin spinning={fetchGetAuthorizeByIdLoading}>
          <List className={styles.authList} bordered>
            <p className={styles.roleAuth}>权限预览</p>
          </List>
          <Tree
            className="antd-tree"
            checkable
            onExpand={onExpand} // 展开收起触发
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent} // 是否自动展开父节点
            onCheck={onCheck} // 点击复选框触发
            checkedKeys={checkedKeys}
          >
            {renderTreeNodes(allMenuTree)}
          </Tree>
        </Spin>
      </div>
    );
  },
);

/**
 *
 * @param fetchGetAuthorizeByIdLoading
 * @param fetchGetAuthTreeLoading
 * @param positionsTree
 * @param authorizeActionsList
 * @param disabled {boolean} 是否可以编辑
 * @returns {JSX.Element}
 * @constructor
 */
const PositionsAuthTree = ({
  fetchGetAuthorizeByIdLoading = false,
  fetchGetAuthTreeLoading = false,
  positionsTree,
  authorizeActionsList = [],
  disabled,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]); // 展开的key值
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]); // 选中的值

  useEffect(() => {
    const arr = [];
    authorizeActionsList.forEach(item => arr.push(item.nodeId));
    setCheckedKeys(arr);
    setExpandedKeys(arr);
  }, [authorizeActionsList]);

  const onCheck = checkedKeys => {
    if (!disabled) {
      setCheckedKeys(checkedKeys);
    }
  };

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.nodesMap && item.nodesMap.length) {
        return (
          <TreeNode
            title={item.processName}
            key={`_${item.processDefinitionKey}`}
            dataRef={item}
            className={'auth-tree2'}
          >
            {renderTreeNodes(item.nodesMap)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.nodeId} title={item.nodeName} {...item} />;
    });
  return (
    <div className={styles.tableStyle}>
      <Spin spinning={fetchGetAuthorizeByIdLoading}>
        <List className={styles.authList} bordered>
          <p className={styles.roleAuth}>权限预览</p>
        </List>
        <Tree
          loading={fetchGetAuthTreeLoading}
          className="antd-tree"
          checkable
          onExpand={onExpand} // 展开收起触发
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent} // 是否自动展开父节点
          onCheck={onCheck} // 点击复选框触发
          checkedKeys={checkedKeys}
        >
          {renderTreeNodes(positionsTree)}
        </Tree>
      </Spin>
    </div>
  );
};
/**
 * 预览权限弹框
 * @param {string} title
 * @param {null} footer
 * @param {boolean} fetchGetAuthorizeByIdLoading
 * @param {boolean} fetchGetAuthTreeLoading
 * @param {boolean} fetchGetPositionsTreeLoading
 * @param {any[]} authorizationStrategy 数据策略组件
 * @param {boolean} authModal 弹框 boolean
 * @param {function} setAuthModal 控制弹框
 * @param {string} name 角色名称
 * @param {string} code 角色代码
 * @param {any[]} dataStrategies 选中的 数据策略组件
 * @param {any[]} saveAuthorizeActionsList 根据选中的功能组件id查询 已选的数据
 * @param {any[]} savePositionAuthorizeActionsList  根据选中的岗位id查询 已选的数据
 * @param {any[]} saveAllMenuTree   功能权限树
 * @param {any[]} savePositionsTree 岗位组件
 * @param {any[]} tags 功能组件
 * @param {any[]} functions // 选中的 功能组件id
 * @param {any[]} positionsList 岗位组件
 * @param {any[]} positions 选中的 岗位组件id
 * @param {function} handleReset 重置方法
 * @param {function} handleFetchGetAuthorizeById 通过功能组件id查询当前组件的权限
 * @param {function} handleFetchGetPositionAuthorizeById 通过岗位组件id查询当前组件的权限
 * @param {boolean} disabled 是否可以编辑
 * @returns {JSX.Element}
 * @constructor
 */
const Preview = ({
  title,
  footer,
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  authorizationStrategy,
  authModal,
  setAuthModal,
  name,
  code,
  dataStrategies,
  saveAuthorizeActionsList,
  savePositionAuthorizeActionsList,
  saveAllMenuTree,
  savePositionsTree,
  tags,
  functions,
  positionsList,
  positions,
  handleReset,
  handleFetchGetAuthorizeById,
  handleFetchGetPositionAuthorizeById,
  disabled,
}) => {
  // 预览框中选中的功能组件
  const [selectTags, setSelectTags] = useState([]);
  // 预览框中选中的岗位组件
  const [selectPositionTags, setSelectPositionTags] = useState([]);
  // 预览框中选中组件请求数据
  const handleTagChange = (tag, checked) => {
    const selectedTags = checked ? [tag] : selectTags.filter(t => t !== tag);
    setSelectTags(selectedTags);
    // 通过功能组件id查询当前组件的权限
    checked && handleFetchGetAuthorizeById(tag);
  };

  const handleTagChange1 = (tag, checked) => {
    const selectedTags = checked ? [tag] : selectPositionTags.filter(t => t !== tag);
    setSelectPositionTags(selectedTags);
    // 通过岗位组件id查询当前组件的权限
    checked && handleFetchGetPositionAuthorizeById(tag);
  };

  /**
   *
   * @param item {{id:number}[]} 全部数据
   * @param typeData {number[]} id集合
   * @param fn {Function} 钩子
   * @param selectTags {number[]}
   * @returns {ReactNode}
   */
  const handleTag = (item = [], typeData = [], fn, selectTags) => {
    return item
      .filter(m => typeData.includes(m.id))
      .map(tag => (
        <CheckableTag
          key={tag.id}
          checked={selectTags.indexOf(tag.id) > -1}
          onChange={checked => fn(tag.id, checked)}
          style={{ fontSize: 14, cursor: 'pointer' }}
        >
          {tag.name}
        </CheckableTag>
      ));
  };

  return (
    <Modal
      title={title}
      footer={footer}
      visible={authModal}
      onOk={() => setAuthModal(false)}
      onCancel={() => {
        handleReset();
        // 重置预览框中选中的组件
        setSelectTags([]);
      }}
      width="80%"
      // destroyOnClose
    >
      <Row>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <span> 角色名称：{name}</span>
          <span> 角色代码：{code}</span>
        </div>

        <Col span={24}>
          <Tabs tabPosition="left" style={{ marginTop: 24 }}>
            <TabPane tab="功能组件" key="1">
              已关联功能组件 :{handleTag(tags, functions, handleTagChange, selectTags)}
              <AuthTree
                disabled={disabled}
                allMenuTree={saveAllMenuTree}
                authorizeActionsList={saveAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
                fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
              />
            </TabPane>
            <TabPane tab="岗位组件" key="2">
              已关联岗位组件 :
              {handleTag(positionsList, positions, handleTagChange1, selectPositionTags)}
              <PositionsAuthTree
                disabled={disabled}
                positionsTree={savePositionsTree}
                authorizeActionsList={savePositionAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetPositionsTreeLoading}
                fetchGetAuthTreeLoading={fetchGetPositionsTreeLoading}
              />
            </TabPane>
            <TabPane tab="数据策略组件" key="3">
              <CheckboxGroup options={authorizationStrategy} value={dataStrategies} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
  );
};

export default errorBoundary(Preview);

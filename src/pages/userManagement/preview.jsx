import React, { useEffect, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, Checkbox, Col, List, Modal, Radio, Row, Spin, Tabs, Tag, Tree } from 'antd';
import styles from '@/pages/userManagement/index.less';

const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const CheckboxGroup = Checkbox.Group;

const AuthTree = ({
  fetchGetAuthorizeByIdLoading = false,
  allMenuTree,
  authorizeActionsList,
  disabled,
}) => {
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
};

const PositionsAuthTree = ({
  fetchGetAuthorizeByIdLoading = false,
  fetchGetAuthTreeLoading = false,
  positionsTree,
  authorizeActionsList,
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

const Preview = ({
  title,
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  fetchGetPositionsTreeLoading,
  authorizationStrategy,
  authModal,
  setAuthModal,
  dataStrategies,
  saveAuthorizeActionsList,
  saveAllMenuTree,
  savePositionsTree,
  tags,
  functions,
  positionsList,
  positions,
  handleReset,
  handleFetchGetAuthorizeById,
  handleFetchGetPositionAuthorizeById,
  isModel = true,
  ownershipSystem = [],
  selectOwnershipSystem,
  ownershipSystemChange,
  roleBySys,
  roleComByUser,
  handleQueryBySys,
  savePositionAuthorizeActionsList,
  disabled = false,
  onClose,
}) => {
  // 预览框中选中的功能组件
  const [selectTags, setSelectTags] = useState([]);
  // 预览框中选中的岗位组件
  const [selectPositionTags, setSelectPositionTags] = useState([]);
  // 预览框中选中的角色组件
  const [selectRoleTags, setSelectRoleTags] = useState([]);
  // 预览框中选中组件请求数据
  const handleTagChange = (tag, checked) => {
    const selectedTags = checked ? [tag] : selectTags.filter(t => t !== tag);
    setSelectTags(selectedTags);
    // 通过功能组件id查询当前组件的权限
    checked && handleFetchGetAuthorizeById(tag);
  };

  // 预览框中选中角色请求数据
  const handleRoleChange = (tag, checked) => {
    const selectedTags = checked ? [tag] : selectRoleTags.filter(t => t !== tag);
    setSelectRoleTags(selectedTags);
    // 通过功能组件id查询当前组件的权限
    checked && handleQueryBySys(tag);
  };

  const handleTagChange1 = (tag, checked) => {
    const selectedTags = checked ? [tag] : selectPositionTags.filter(t => t !== tag);
    setSelectPositionTags(selectedTags);
    // 通过岗位组件id查询当前组件的权限
    checked && handleFetchGetPositionAuthorizeById(tag);
  };

  const handleTag = (item = [], typeData = [], fn, selectTags) => {
    return (
      typeData
        // .filter(n => typeData.map(m => m.id).includes(n.id))
        .map(tag => (
          <CheckableTag
            key={tag.id}
            checked={selectTags.indexOf(tag.id) > -1}
            onChange={checked => fn(tag.id, checked)}
            className={styles.handleTagStyle}
          >
            {tag.name}
          </CheckableTag>
        ))
    );
  };
  console.log('tags', tags);
  console.log('functions', functions);
  return isModel ? (
    <Modal
      title={title}
      visible={authModal}
      onOk={() => {
        handleReset();
        // 重置预览框中选中的组件
        setSelectTags([]);
        setAuthModal(false);
      }}
      onCancel={() => {
        handleReset();
        // 重置预览框中选中的组件
        setSelectTags([]);
        setAuthModal(false);
        onClose && onClose();
      }}
      width="80%"
    >
      <Row>
        <Col span={24} offset={2}>
          <label>归属系统:</label>
          <Radio.Group
            onChange={e => ownershipSystemChange(e.target.value)}
            value={selectOwnershipSystem}
            className={styles.radioStyle}
          >
            {ownershipSystem.map(item => {
              return (
                <Radio key={item.code} value={item.code}>
                  {item.name}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
        <Col span={24} offset={2} className={styles.col1Style}>
          <label>所属角色:</label>
          <div className={styles.colDiv}>
            {handleTag(roleBySys, roleComByUser, handleRoleChange, selectRoleTags)}
          </div>
        </Col>

        <Col span={24}>
          <Tabs tabPosition="left" className={styles.col1Style}>
            <TabPane tab="功能组件" key="1">
              已关联功能组件 :{handleTag(tags, functions, handleTagChange, selectTags)}
              <AuthTree
                allMenuTree={saveAllMenuTree}
                authorizeActionsList={saveAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
                fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
                disabled={disabled}
              />
            </TabPane>
            {/* <TabPane tab="岗位组件" key="2">
              已关联岗位组件 :
              {handleTag(positionsList, positions, handleTagChange1, selectPositionTags)}
              <PositionsAuthTree
                positionsTree={savePositionsTree}
                authorizeActionsList={savePositionAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetPositionsTreeLoading}
                fetchGetAuthTreeLoading={fetchGetPositionsTreeLoading}
                disabled={disabled}
              />
            </TabPane> */}
            {/* <TabPane tab="数据策略组件" key="3">
              <CheckboxGroup options={authorizationStrategy} value={dataStrategies} />
            </TabPane> */}
          </Tabs>
        </Col>
      </Row>
    </Modal>
  ) : (
    <Card>
      <Row>
        <Col span={24} offset={2}>
          <label>归属系统:</label>
          <Radio.Group
            onChange={e => ownershipSystemChange(e.target.value)}
            value={selectOwnershipSystem}
            className={styles.radioStyle}
          >
            {ownershipSystem.map(item => {
              return (
                <Radio key={item.code} value={item.code}>
                  {item.name}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
        <Col span={24} offset={2} className={styles.col1Style}>
          <label>所属角色:</label>
          <div className={styles.colDiv}>
            {handleTag(roleBySys, roleComByUser, handleRoleChange, selectRoleTags)}
          </div>
        </Col>

        <Col span={24}>
          <Tabs tabPosition="left" className={styles.col1Style}>
            <TabPane tab="功能组件" key="1">
              已关联功能组件:{handleTag(tags, functions, handleTagChange, selectTags)}
              <AuthTree
                allMenuTree={saveAllMenuTree}
                authorizeActionsList={saveAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetAuthorizeByIdLoading}
                fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
                disabled={disabled}
              />
            </TabPane>
            {/* <TabPane tab="岗位组件" key="2">
              已关联岗位组件:
              {handleTag(positionsList, positions, handleTagChange1, selectPositionTags)}
              <PositionsAuthTree
                positionsTree={savePositionsTree}
                authorizeActionsList={savePositionAuthorizeActionsList}
                fetchGetAuthorizeByIdLoading={fetchGetPositionsTreeLoading}
                fetchGetAuthTreeLoading={fetchGetPositionsTreeLoading}
                disabled={disabled}
              />
            </TabPane> */}
            {/* <TabPane tab="数据策略组件" key="3">
              <CheckboxGroup options={authorizationStrategy} value={dataStrategies} />
            </TabPane> */}
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
};

export default errorBoundary(Preview);

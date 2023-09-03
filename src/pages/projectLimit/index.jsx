import React, { useEffect, useState } from 'react';
import SelfTree from '@/components/SelfTree';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  message,
  Layout,
  Tree,
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const { TreeNode } = Tree;
const { Search } = Input;
const FormItem = Form.Item;
const { Sider, Content } = Layout;
const selectTreeValue = [];

const Index = ({ dispatch, listLoading, projectLimit: { saveList, saveTreeData } }) => {
  //
  const [expandedKeys, setExpandedKeys] = useState([]);
  //
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  //
  const [checkedKeys, setCheckedKeys] = useState([]);
  //
  const [selectedKeys, setSelectedKeys] = useState([]);
  // 子组件传回信息
  const [childrenMsg, setChildrenMsg] = useState({});

  // 生命周期文档 列表
  useEffect(() => {
    handleGetList(1);
  }, []);

  // 列表信息
  const handleGetList = type => {
    dispatch({
      type: 'projectLimit/handleGetListInfo',
      payload: type,
    });
  };

  // 获取树
  const handleGetTreeData = code => {
    dispatch({
      type: 'projectLimit/handleGetTreeInfo',
      payload: { code },
    });
  };

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
    handleGetTreeData(selectedKeys[0]);
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  // 获取子组件点击信息
  const getClickMsg = (result, msg) => {
    // console.log(result, msg);
    setClickData(msg);
  };
  // 获取子组件check信息
  const getCheckMsg = (result, msg) => {
    // console.log(result, msg);
    setCheckData(msg);
  };

  return (
    <PageHeaderWrapper className={styles.parentBox} title="" breadcrumb={{}}>
      <Layout>
        <Sider
          width={300}
          style={{ background: '#fff', margin: 0, boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)' }}
        >
          <div className={styles.viewLeft}>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
            >
              {renderTreeNodes(saveList)}
            </Tree>
          </div>
        </Sider>
        <Content style={{ padding: '20px', background: '#fff' }}>
          {/* <div className={styles.spanParent}>
            <span>
              <Icon
                theme={'filled'}
                type="folder"
                style={{
                  color: 'blue',
                }}
              />
              {'非自定义目录下有文件'}
            </span>
            <span>
              <Icon
                theme={'filled'}
                type="folder"
                style={{
                  color: 'green',
                }}
              />
              {'自定义目录下有文件'}
            </span>
            <span>
              <Icon
                theme={'filled'}
                type="folder"
                style={{
                  color: '',
                }}
              />
              {'不适用目录下有文件'}
            </span>
            <span>
              <Icon
                theme={''}
                type="folder"
                style={{
                  color: 'blue',
                }}
              />
              {'非自定义目录下无文件'}
            </span>
            <span>
              <Icon
                theme={''}
                type="folder"
                style={{
                  color: 'green',
                }}
              />
              {'自定义目录下无文件'}
            </span>
            <span>
              <Icon
                theme={''}
                type="folder"
                style={{
                  color: '',
                }}
              />
              {'不适用目录下无文件'}
            </span>
          </div> */}
          <SelfTree
            treeData={saveTreeData}
            draggableFlag={false}
            checkableFlag={true}
            getClickMsg={getClickMsg}
            getCheckMsg={getCheckMsg}
          />
        </Content>
      </Layout>
    </PageHeaderWrapper>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ projectLimit, loading }) => ({
      projectLimit,
      listLoading: loading.effects['projectLimit/handleListFetch'],
    }))(Index),
  ),
);

export default WrappedIndexForm;

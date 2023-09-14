import React, { memo, useEffect, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Button, Form, List, Row, Spin, Tooltip, Tree, message } from 'antd';
import router from 'umi/router';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from '@/pages/userManagement/index.less';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { Card, PageContainers } from '@/components';

const { TreeNode } = Tree;
const AuthTree = memo(
  ({
    fetchGetAuthorizeByIdLoading = false,
    fetchGetAuthTreeLoading = false,
    allMenuTree,
    authorizeActionsList,
    disabled,
    setSelectAuth,
  }) => {
    const [expandedKeys, setExpandedKeys] = useState([]); // 展开的key值
    const [autoExpandParent, setAutoExpandParent] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]); // 选中的值

    useEffect(() => {
      const _authorizeActionsList = authorizeActionsList?.toString()?.split(',') || [];
      setCheckedKeys(_authorizeActionsList);
      setExpandedKeys(_authorizeActionsList);
      setSelectAuth(_authorizeActionsList);
    }, [authorizeActionsList]);

    const onCheck = checkedKeys => {
      if (disabled) {
        setCheckedKeys(checkedKeys);
        const _checkedKeys = checkedKeys.filter(val => !val.includes('_'));
        setSelectAuth(_checkedKeys);
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

const Preview = ({
  title,
  fetchGetAuthorizeByIdLoading,
  fetchGetAuthTreeLoading,
  addroleLoading = false,
  saveAllMenuTree,
  ownershipSystem = [],
  selectOwnershipSystem,
  ownershipSystemChange,
  disabled = false,
  form: { validateFieldsAndScroll },
  form,
  dispatch,
  isDetail,
  roleDetail,
}) => {
  // 选择的权限
  const [selectAuth, setSelectAuth] = useState();

  useEffect(() => {
    setSelectAuth(roleDetail?.actionsList);
  }, [roleDetail?.actionsList]);

  const layout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const defaultConfig = { disabled: isDetail === '1', pull: 4 };
  const productInfo = [
    {
      name: 'sysId',
      label: '所属系统',
      rules: [{ required: true, message: '请选择所属系统' }],
      type: 'radio',
      width: 20,
      option: ownershipSystem,
      initialValue: isDetail === '0' ? undefined : `${roleDetail?.sysId}`,
      config: {
        onChange: e => ownershipSystemChange(e.target.value),
        ...defaultConfig,
        value: selectOwnershipSystem,
      },
    },
    {
      name: 'type',
      label: (
        <>
          功能类型
          <Tooltip title="功能：只有使用权限，没有授权权限;授权：管理人可以给下级人员授权;">
            <span>
              <QuestionCircleOutlined />
            </span>
          </Tooltip>
        </>
      ),
      rules: [{ required: true, message: '请选择功能类型' }],
      type: 'radio',
      width: 20,
      option: [
        { name: '授权', code: '01' },
        { name: '功能', code: '02' },
      ],
      initialValue: roleDetail?.type,
      config: {
        ...defaultConfig,
      },
    },
    {
      name: 'name',
      label: '功能名称',
      width: 20,
      rules: [{ required: true, message: '请输入功能名称' }],
      initialValue: roleDetail?.name,
      config: {
        ...defaultConfig,
      },
    },
    {
      name: 'description',
      label: '功能描述',
      width: 20,
      rules: [{ required: false, message: '请输入功能描述' }],
      initialValue: roleDetail?.description,
      config: {
        ...defaultConfig,
      },
    },
  ];

  const submitHandler = () => {
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'functionManagement/addrole',
        payload: {
          ...values,
          id: roleDetail?.id,
          actionsList: selectAuth,
        },
      }).then(res => {
        if (res) {
          message.success('操作成功');
          // router.goBack();
          router.push('/authority/functionManagement');
        }
      });
    });
  };
  return (
    <PageContainers
      breadcrumb={[
        {
          title: '系统运营管理',
          url: '',
        },
        {
          title: '功能管理',
          url: '',
        },
        {
          title,
          url: '',
        },
      ]}
    >
      <Card title={false} default>
        <Spin spinning={addroleLoading}>
          <Row>
            <Form {...layout}>
              <Row>
                <CustomFormItem formItemList={productInfo} form={form} />
              </Row>
            </Form>
            <AuthTree
              allMenuTree={saveAllMenuTree}
              fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
              authorizeActionsList={roleDetail?.actionsList}
              setSelectAuth={setSelectAuth}
              disabled={disabled}
            />
          </Row>
          {disabled && (
            <Row>
              <Button className={styles.confirmBtn} onClick={submitHandler}>
                确定
              </Button>
            </Row>
          )}
        </Spin>
      </Card>
    </PageContainers>
  );
};

export default errorBoundary(Form.create()(Preview));

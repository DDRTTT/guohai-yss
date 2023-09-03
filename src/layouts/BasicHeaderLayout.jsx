/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React from 'react';
import { Layout } from 'antd';
import BasicHeader from './BasicHeader';
import styles from './BasicLayout.less';

const BasicHeaderLayout = ({ children }) => {
  return (
    <div className={styles.content}>
      <Layout>
        <BasicHeader />
        <ProLayout menuRender={false} headerRender={false}>
          {children}
        </ProLayout>
      </Layout>
    </div>
  );
};

export default BasicHeaderLayout;

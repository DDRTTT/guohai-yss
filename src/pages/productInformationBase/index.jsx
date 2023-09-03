/**
 * 产品看板-查看产品-产品信息库
 */
import React, { useContext, useEffect, useState } from 'react';
import { Table, Tabs, Button, message, Card, Breadcrumb, Tag } from 'antd';
import { connect, routerRedux } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import PageContainer from '@/components/PageContainers';

const { TabPane } = Tabs;

const url = '/dynamicPage/params';

const Index = ({ dispatch, productInformationBase: { menuList } }) => {
  // 获取菜单
  const handleDetMenuList = () => {
    dispatch({
      type: 'productInformationBase/getMenuListFunc',
      payload: '',
      callback: res => {},
    });
  };

  // Tabs页创建
  const handleAddTabs = data => {
    return (
      <div className={styles.bodyData} style={{overflowY: 'auto' }}>
        <Tabs tabPosition="left" defaultActiveKey="basisClass" style={{ margin: '20px 0 20px 0 ' }}>
          {handleAddTabPane(data)}
        </Tabs>
      </div>
    );
  };

  // TabPane创建
  const handleAddTabPane = data => {
    const arr = [];
    if (JSON.stringify(data) !== '{}') {
      for (const i in data) {
        arr.push(
          <TabPane tab={data[i].menuName} key={data[i].code}>
            {handleAddCard(data[i].childMenus)}
          </TabPane>,
        );
      }
    }
    return arr;
  };

  const handleColorChoice = val => {
    switch (val) {
      case '产品':
        return 'red';
      case '机构':
        return 'magenta';
      case '监管要素信息':
        return 'purple';
      case '干系人':
        return 'orange';
      case '客户':
        return 'cyan';
      case '销售机构':
        return 'green';
      case '账户':
        return 'blue';
      default:
        '';
    }
  };

  // card创建
  const handleAddCard = data => {
    const arr = [];
    if (data) {
      data.forEach(i => {
        arr.push(
          <Card
            className={styles.tabsData}
            key={i.code}
            onClick={() => handleGoRouterPush(i.name, i.uri)}
          >
            <Tag color={handleColorChoice(i.infoSubject)}>{i.infoSubject}</Tag>
            <h3 className={styles.tabsDataH3}>{i.name}</h3>
            <p className={styles.tabsDataP}>{i.busiScene}</p>
          </Card>,
        );
      });
    }
    return arr;
  };

  // 跳转
  const handleGoRouterPush = (v1, v2) => {
    return router.push(`${url}/产品要素库/${v2}/${v1}`);
  };

  useEffect(() => {
    handleDetMenuList();
  }, []);

  return (
    <>
      <PageContainer/>
      {handleAddTabs(menuList)}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ productInformationBase }) => ({
    productInformationBase,
  }))(Index),
);

export default WrappedIndexForm;

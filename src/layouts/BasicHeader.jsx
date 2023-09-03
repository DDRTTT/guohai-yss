import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import loginEnv from '@/utils/loginenv';
import RightContent from '@/components/GlobalHeader/RightContent';
import styles from './BasicHeader.less';
import { getSession, USER_INFO } from '@/utils/session';

const { Header } = Layout;

const BasicHeader = ({ dispatch }) => {
  const handleRefreshToken = () => {
    const userInfo = JSON.parse(getSession(USER_INFO));
    dispatch({
      type: 'global/GET_REFRESH_TOKEN_API_WITH_USERID',
      payload: {
        userId: userInfo?.id,
      },
    }).then(res => {
      if (res) {
        router.push('/workspace');
      }
    });
  };

  return (
    <Header className={styles.content}>
      <img src={loginEnv.LOGO} alt="HLOGO" className={styles.logo} onClick={handleRefreshToken} />
      <div className={styles.right}>
        <Menu theme="dark" mode="horizontal">
          {/* <Menu.Item key="1">首页</Menu.Item> */}
          {/* <Menu.Item key="2">工作台</Menu.Item> */}
          {/* <Menu.Item key="3">个人中心</Menu.Item> */}
        </Menu>
        <RightContent />
      </div>
    </Header>
  );
};

export default connect(({ global }) => ({
  global,
}))(BasicHeader);

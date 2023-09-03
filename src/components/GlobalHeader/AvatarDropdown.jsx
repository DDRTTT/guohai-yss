import { Avatar, Icon, Menu, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import SingleCustomerEvents from '@/utils/SingleCustomerEvents';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      // 关闭socket 因为会有socket没有连上就要断开的场景,会导致bug,所以暂时搁置这个问题
      // lifecycleWebsocket && lifecycleWebsocket.close();
      // processWebsocket && processWebsocket.close();
      SingleCustomerEvents.getInstance().dispatchEvent('logout');

      const tempFlag = sessionStorage.getItem('isLogin');
      if (tempFlag) {
        sessionStorage.removeItem('isLogin');
        sessionStorage.removeItem('project_time');
      }
      if (dispatch) {
        dispatch({
          type: 'workSpace/saveTodoTasks',
          payload: {
            taskInstances: [],
            total: 0,
          },
        });
        dispatch({
          type: 'workSpace/saveParticipateTasks',
          payload: {
            taskInstances: [],
            total: 0,
          },
        });
        dispatch({
          type: 'workSpace/saveInitiatedTasks',
          payload: {
            taskInstances: [],
            total: 0,
          },
        });
        dispatch({
          type: 'workSpace/saveProductCenterFlowId',
          payload: [],
        });
        dispatch({
          type: 'login/logout',
        });
      }

      window.location.reload();

      return;
    }

    // router.push(`/account/${key}`);
    router.push(`/datum/presonalDatum`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <Icon type="user" />
          个人中心
        </Menu.Item>
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.photoUrl} alt="avatar" />
          <span className={styles.name}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

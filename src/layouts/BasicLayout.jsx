/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
// import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Icon, Layout, message, Result, Spin } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import TokenModal from '@/components/TokenModal';
// import waterMark from '@/utils/waterMark';
import { getAuthorityFromRouter, handleChooseTree } from '@/utils/utils';
import { bootstrap, singleSpa } from '@/single-spa-core/Register';
import { getSession, USER_INFO } from '@/utils/session';
import ic_cpzx from '@/assets/index/ic_cpzx.png';
import BasicHeader from './BasicHeader';
import styles from './BasicLayout.less';
import cloneDeep from 'lodash/cloneDeep';
import projectConfig from '../../projects.config';
import { getAuthToken } from '@/utils/cookie';
import router from 'umi/router';

// message全局提示
message.config({
  top: 60,
  duration: 5,
});

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = props => {
  const [refreshToken, setRefreshToken] = useState(false);
  const [iframeLocal, setIframeLocal] = useState('');

  const {
    currentUser,
    collapsed,
    dispatch,
    children,
    settings,
    saveMenu,
    location = {
      pathname: '/',
    },
    location: {
      query: { sysid, userid },
    },
    SAVE_DATA_DICTIONARY: { iframeMatchCode = [], iframeHost = [] },
  } = props;

  const menuDataRender1 = () => {
    // 0、不隐，1、隐藏
    const menuTree = handleChooseTree(cloneDeep(saveMenu) || [], 'hide', 1);
    if (Array.isArray(menuTree)) {
      return menuTree;
    }
    return [];
  };

  const handleStyle = () => {
    const contentDom = document.getElementsByClassName('ant-layout')[2];
    const siderDom = document.getElementsByClassName('ant-pro-sider-menu-sider')[0];
    if (location.pathname === '/workspace') {
      if (siderDom && siderDom.style) {
        siderDom.style.display = 'none';
        contentDom.style.paddingLeft = '0px';
      }
    } else if (siderDom && siderDom.style) {
      siderDom.style.display = 'block';
      contentDom.style.paddingLeft = '256px';
    }
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'global/DATA_DICTIONARY_FETCH',
        payload: {
          codeList: 'iframeMatchCode,iframeHost',
        },
      });

      if (sysid && userid) {
        // 单点登录系统返回/workspace的时候，根据其他系统返回用户userid和所在系统sysid，获取新的token
        dispatch({
          type: 'global/GET_REFRESH_TOKEN',
          payload: {
            sysId: sysid,
            userId: userid,
          },
        }).then(bool => {
          if (bool) setRefreshToken(bool);
        });
      } else {
        setRefreshToken(true);
        // 交换token
        dispatch({
          type: 'global/handleTokenExchange',
        });
      }
      dispatch({
        type: 'global/handleGetNginxIP',
      });
    }
    bootstrap();
    handleStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // const username = currentUser?.username ? currentUser?.username : '';
  //   // waterMark.set(`YSSPLM${getDateStr(0, false)}${username}`);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser]);

  useEffect(() => {
    handleIframe();
  }, [window.location.pathname, iframeMatchCode]);

  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const title = getSession('d');
  const sysId = getSession('sysId');

  const handle = () => {
    const pathArr = [];
    projectConfig.map(item => pathArr.push(...item.path));
    const time = new Date().getTime();
    const path = location.pathname + `?time=${time}`;
    console.log("spa_test", path);
    const p = path.split('/')[1];
    if (pathArr.includes(p) && singleSpa.getMountedApps().length === 0) {
      return (
        <div id="singleChidren">
          <div className="page-loading-warp">
            <div className="ant-spin ant-spin-lg ant-spin-spinning">
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item" />
                <i className="ant-spin-dot-item" />
                <i className="ant-spin-dot-item" />
                <i className="ant-spin-dot-item" />
              </span>
            </div>
          </div>
        </div>
      );
    }
    return <div id="singleChidren" />;
  };

  const handleIframe = () => {
    // 报表嵌入
    let local;
    const token = getAuthToken();
    const RWHost = `${iframeHost[0]?.code}`;
    const matchRWCode = `${iframeMatchCode[0]?.code}`;
    let pathname = window?.location?.pathname;
    const matchPath = pathname.split('/')[1];

    pathname = pathname.slice(1, pathname?.length);

    if (
      (sysId === '2' || sysId === '9') &&
      matchRWCode?.split(',')?.includes(matchPath) &&
      RWHost &&
      pathname &&
      token
    ) {
      local = `${RWHost}/jgbs?ssologin=true&tag_url=${pathname}&auth_token=${token}`;
    }
    // 头寸嵌入
    // host
    const TCHost = `${iframeHost[1]?.code}`;
    // url
    const matchTCPath = window.location.pathname.split('/')[1];
    // code
    const matchTCCode = `${iframeMatchCode[1]?.code}`;
    if (sysId === '9' && matchTCCode?.split(',')?.includes(matchTCPath) && TCHost && token) {
      local = `${TCHost}/index.html#/user-data-auth?sysid=7&menuCode=M00003&token=${token}`;
    }

    setIframeLocal(local);
  };

  const Text = (
    <span
      style={{
        height: '21px',
        fontSize: '17px',
        fontFamily: 'Source Han SansCN',
        fontWeight: 400,
        color: '#95A4BC',
      }}
    >
      <img style={{ width: 17, height: 17 }} src={ic_cpzx} alt="logo" />
      <span style={{ marginLeft: '11px', display: !collapsed ? 'inline-block' : 'none' }}>
        {title}
      </span>
    </span>
  );

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
    <div className={styles.content}>
      <Layout>
        <BasicHeader />
        <ProLayout // logo={logo}
          menuHeaderRender={() => (
            <div className={styles.collapesd}>
              <div style={{ height: '100%' }}>
                {/* <Link to="/">{Text}</Link> */}
                <a onClick={handleRefreshToken}>{Text}</a>
              </div>
              <div
                style={{ height: '100%', marginTop: 3, color: 'rgb(149, 164, 188)', width: 31 }}
                onClick={() => handleMenuCollapse(!collapsed)}
              >
                {collapsed ? <Icon type="caret-right" /> : <Icon type="caret-left" />}
              </div>
            </div>
          )}
          onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          // footerRender={footerRender}
          footerRender={false}
          menuDataRender={menuDataRender1}
          rightContentRender={() => <RightContent />}
          {...props}
          {...settings}
          headerRender={false}
        >
          <Spin spinning={!refreshToken}>
            {refreshToken && (
              <>
                <Authorized authority={authorized.authority} noMatch={noMatch}>
                  {children}
                </Authorized>
                {iframeLocal && (
                  <iframe
                    src={iframeLocal}
                    style={{
                      width: '100%',
                      frameborder: '0',
                      scrolling: 'no',
                      style: 'border:0px;',
                      height: 'calc(100vh - 100px)',
                      border: 'none',
                    }}
                  />
                )}
                {handle()}
              </>
            )}
          </Spin>
        </ProLayout>
        <TokenModal currentUser={currentUser} dispatch={dispatch} />
      </Layout>
    </div>
  );
};

export default connect(({ global, user, settings }) => ({
  SAVE_DATA_DICTIONARY: global.SAVE_DATA_DICTIONARY,
  collapsed: global.collapsed,
  settings,
  saveMenu: user.saveMenu,
  currentUser: user.currentUser,
}))(BasicLayout);

/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Icon, Layout, message, Result, Spin, Drawer, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import TokenModal from '@/components/TokenModal';
// import waterMark from '@/utils/waterMark';
import { getAuthorityFromRouter, handleChooseTree } from '@/utils/utils';
import { HistoricalComparison } from '@/components';
import { bootstrap, singleSpa } from '@/single-spa-core/Register';
import { getSession } from '@/utils/session';
import ic_cpzx from '@/assets/index/ic_cpzx.png';
import BasicHeader from './BasicHeader';
import styles from './BasicLayout.less';
import cloneDeep from 'lodash/cloneDeep';
import projectConfig from '../../projects.config';
import { getAuthToken } from '@/utils/cookie';

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
    SAVE_ES_QUERY_BY_ID,
    drawerVisible,
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
      // // 将global.less中important设置的样式拿到这里来添加，放在那边当左侧边栏展开收起的时候样式会有影响
      // siderDom.style.flex = '0 0 206px';
      // siderDom.style.width = '206px';
      // siderDom.style.minWidth = '206px';
      // siderDom.style.maxWidth = '206px';
      siderDom.style.display = 'block';
      contentDom.style.paddingLeft = '206px';
    }
  };

  useEffect(() => {
    let nongShangIPPORT = 'http://10.20.84.162:9080';

    let url = ``;

    // 指令信息查询
    if (window.location.pathname === '/acs/acs-commandcenter/commandbasicinfo.ctrl') {
      url = `http://192.168.7.133:9082/acs/acs-commandcenter/commandbasicinfo.ctrl?method=toListView&_appFunctionId=21031513505782000711&_location=%E6%8C%87%E4%BB%A4%E4%B8%AD%E5%BF%83%2C%E6%8C%87%E4%BB%A4%E6%93%8D%E4%BD%9C%E4%B8%AD%E5%BF%83(1.0.7)%2C%E6%8C%87%E4%BB%A4%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7&__wid__=21011313523391000475-21031513505782000711`;
      window.open(url);
    }
    // 产品信息查询
    if (window.location.pathname === '/acs/acs-parameters/product.ctrl') {
      url = `http://192.168.7.133:9082/acs/acs-parameters/product.ctrl?method=toListView&_appFunctionId=20090814221679001350&_location=%E5%9F%BA%E7%A1%80%E4%BF%A1%E6%81%AF%2C%E4%BA%A7%E5%93%81%E6%88%90%E7%AB%8B%2C%E4%BA%A7%E5%93%81%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86&__wid__=20072409433389016632-20090814221679001350`;
      window.open(url);
    }

    // ----------------------------------农商银行------------------------------

    // 文件分拣信息管理
    if (window.location.pathname === '/sofa/acs-commandcenter/commandemail.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-commandcenter/commandemail.ctrl?method=toListView`;
      window.open(url);
    }

    // 指令待办
    if (window.location.pathname === '/sofa/acs-commandcenter/backlog.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-commandcenter/backlog.ctrl?method=toListView`;
      window.open(url);
    }

    // 流程业务配置
    if (window.location.pathname === '/sofa/acs-commandcenter/flowBusiness.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-commandcenter/flowBusiness.ctrl?method=toListView`;
      window.open(url);
    }

    // 电子印鉴信息管理
    if (window.location.pathname === '/sofa/acs-electronicsealcenter/electronicseal.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-electronicsealcenter/electronicseal.ctrl?method=toListView`;
      window.open(url);
    }

    // 电子印鉴业务流程管理中心
    if (window.location.pathname === '/sofa/acs-electronicsealcenter/electronicBusinessSeal.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-electronicsealcenter/electronicBusinessSeal.ctrl?method=toListView`;
      window.open(url);
    }

    // 报表印鉴批量申请设置中心
    if (window.location.pathname === '/sofa/acs-electronicsealcenter/reportBatch.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-electronicsealcenter/reportBatch.ctrl?method=toListView`;
      window.open(url);
    }

    // 用印信息查询
    if (window.location.pathname === '/sofa/acs-electronicsealcenter/seaLinformation.ctrl') {
      url = `${nongShangIPPORT}/sofa/acs-electronicsealcenter/seaLinformation.ctrl?method=toListView`;
      window.open(url);
    }
  }, [window.location.pathname]);

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
      // dispatch({
      //   type: 'global/handleGetNginxIP',
      // });
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
  }, [window.location.pathname, window.location.search, iframeMatchCode]);

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
    const path = location.pathname;
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
    // 报表嵌入 ----------------------------------------------------------------
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
    // 头寸嵌入 ----------------------------------------------------------------
    // host
    const TCHost = `${iframeHost[1]?.code}`;
    // url
    const matchTCPath = window.location.pathname.split('/')[1];
    // code
    const matchTCCode = `${iframeMatchCode[1]?.code}`;
    if (sysId === '9' && matchTCCode?.split(',')?.includes(matchTCPath) && TCHost && token) {
      local = `${TCHost}/index.html#/user-data-auth?sysid=7&menuCode=M00003&token=${token}`;
    }

    // 盘点系统嵌入 ----------------------------------------------------------------
    // host
    const PDHost = `${iframeHost[2]?.code}`;
    // url
    const matchPDPath = window?.location?.pathname.split('/')[2];
    // code
    const matchPDCode = `${iframeMatchCode[2]?.code}`;
    if (sysId === '13') {
      if (matchPDCode?.split(',')?.includes(matchPDPath) && PDHost && token) {
        if (pathname.includes('tkpd')) {
          const pathName = pathname.replace('tkpd', '');
          // local = `${PDHost}${pathname.split('tkpd')[1]}`;
          local = `${PDHost}${pathName}${window.location.search}`;
        }
        // local = `${PDHost}/${pathname}${window.location.search}`;
      }

      // const pathName = window.location.pathname.split('/');
      // const len = pathName.length;
      // const resid = pathName[len - 1];
      // const nodeid = pathName[len - 3];
      // const commandid = pathName[len - 2];
      // const page = pathName[len - 1];
      // if (pathName.includes('smartBiLogin')) {
      //   if (pathName.includes('openresource')) {
      //     local = `${PDHost}/tk/smartBiLogin/loginByToken/url=http://219.141.235.67:23098/smartbi/vision/openresource.jsp?resid=${resid}`;
      //   }
      //   local = `${PDHost}/tk/smartBiLogin/loginByToken/url=http://219.141.235.67:23098/smartbi/smartbix/?integrated=true&showheader=false&l=zh_CN&nodeid=${nodeid}&commandid=${commandid}#/page/${page}`;
      // }
    }
    setIframeLocal(local);
  };

  const linkToMenu = () => {
    sessionStorage.removeItem('keyValueSearch')
  }

  const Text = (
    <div
      style={{
        width: '100%',
        height: '100%',
        fontSize: '17px',
        fontFamily: 'Source Han SansCN',
        fontWeight: 400,
        color: '#95A4BC',
      }}
    >
      <Tooltip title={title}>
        <img style={{ width: 17, height: 17 }} src={ic_cpzx} alt="logo" />
        <span style={{
          width: `calc(100% - 38px)`,
          verticalAlign: 'middle',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          marginLeft: '11px', display: !collapsed ? 'inline-block' : 'none' }}>
          {title}
        </span>
      </Tooltip>
    </div>
  );
  return (
    <div className={styles.content}>
      <Layout>
        <BasicHeader />
        <ProLayout // logo={logo}
          menuHeaderRender={() => (
            <div className={styles.collapesd}>
              <div style={{ height: '100%', width: '100%' }}>
                <Link to="/">{Text}</Link>
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
            return <Link title= {menuItemProps.title} to={menuItemProps.path} onClick={linkToMenu}> {defaultDom} </Link>;
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
          siderFlex="206px"
          siderWidth="206px"
          siderMinWidth="206px"
          siderMaxWidth="206px"
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
        <Drawer
          title="变更详情"
          placement={'bottom'}
          onClose={() =>
            dispatch({
              type: 'global/drawerVisible',
              payload: false,
            })
          }
          visible={drawerVisible}
          height={'80%'}
        >
          <HistoricalComparison data={SAVE_ES_QUERY_BY_ID} />
        </Drawer>
      </Layout>
    </div>
  );
};

export default connect(({ global, user, settings }) => ({
  SAVE_DATA_DICTIONARY: global.SAVE_DATA_DICTIONARY,
  SAVE_ES_QUERY_BY_ID: global.SAVE_ES_QUERY_BY_ID,
  collapsed: global.collapsed,
  drawerVisible: global.drawerVisible,
  settings,
  saveMenu: user.saveMenu,
  currentUser: user.currentUser,
}))(BasicLayout);

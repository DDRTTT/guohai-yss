import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './UserCustomerLayout.less';
import plmBgVideo from '@/assets/login/plm_bgvideo.mp4';
import plmBg from '@/assets/login/plm_bg.png';
import { Layout, Menu, Row, Col } from 'antd';
import { Link } from 'umi';

const { Header, Footer, Content } = Layout;
const MenuItem = Menu.Item;

const UserCustomerLayout = props => {
  useEffect(() => {
    const { dispatch } = props;
    // waterMark.set(`YSSPLM${getDateStr(0, false)}`);
    props.dispatch({
      type: 'user/saveCurrentUser',
      payload: {},
    });
    // 获取项目信息（名称和Logo）
    props.dispatch({
      type: 'user/GET_PROJECT_INFO_FETCH',
    });
    // 获取加密信息
    dispatch({
      type: 'global/GET_ENCRYPTION_FETCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    route = {
      routes: [],
    },
    user: { SAVE_PROJECT_INFO },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });

  // 合作伙伴，@todo 落地时需要修改
  const partners = [{
                      name: '中国光大银行',
                      url: 'http://www.cebbank.com'
                    },
                    {
                      name: '交通银行',
                      url: 'http://bankcomm.com/BankCommSite/default.shtml'
                    },
                    {
                      name: '华夏银行',
                      url: 'https://www.hxb.com.cn/index.shtml'
                    },
                    {
                      name: '中信银行',
                      url: 'http://www.citicbank.com/'
                    },
                    {
                      name: '中国银行',
                      url: 'https://www.boc.cn/'
                    },
                    {
                      name: '中国民生银行',
                      url: 'http://www.cmbc.com.cn/'
                    },
                    {
                      name: '中国农业银行',
                      url: 'https://www.abchina.com/cn/'
                    },
                  ];
  // 二维码，@todo 目前一样需要更换
  const qrcodes = [
    require('@/assets/login/customer_qrcode.png'),
    require('@/assets/login/customer_qrcode.png'),
  ];

  const toBankHandle=(url)=>{
    const w = window.open('about:blank');
    w.location.href = url
  }

  return (
    <div className={styles.container}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className={styles.box}>
            <img
              className={styles.logo}
              src={`data:image/png;base64,${SAVE_PROJECT_INFO?.loginLogo}`}
              alt="LOGO"
            />
            {/* <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[location.pathname]}
              className={styles.header_menu}
            > */}
              {/* <MenuItem key="/userCustomer/home">
                <Link to="/userCustomer/home">&nbsp;&nbsp;首页&nbsp;&nbsp;</Link>
              </MenuItem>
              <MenuItem key="/userCustomer/assety">
                <Link to="/userCustomer/assety">资产托管</Link>
              </MenuItem> */}
              {/* <MenuItem key="/userCustomer/find">
                <Link to="/userCustomer/find">便捷查询</Link>
              </MenuItem> */}
              {/* <MenuItem key="/userCustomer/contact">
                <Link to="/userCustomer/contact">联系我们</Link>
              </MenuItem> */}
              {/* {location.pathname === '/userCustomer/login' ||
              location.pathname === '/userCustomer/forgetCustomer' ? (
                ''
              ) : (
                <MenuItem key="/userCustomer/login">
                  <Link to="/userCustomer/login">&nbsp;&nbsp;登录&nbsp;&nbsp;</Link>
                </MenuItem>
              )}
            </Menu> */}
          </div>
        </Header>
        <Content className={styles.content}>{children}</Content>
        {/* {(partners && partners.length > 0) || (qrcodes && qrcodes.length > 0) ? (
          <Footer className={styles.footer}>
            <div className={styles.box}> */}
              {/* {partners && partners.length > 0 ? (
                <div className={styles.leftFooter}>
                  <div className={styles.leftFooterTitle}>合作伙伴</div>
                  <ul>
                    {partners.map((item, i) => {
                      return <li key={i} onClick={() => {toBankHandle(item.url)}}>{item.name}</li>;
                    })}
                  </ul>
                </div>
              ) : (
                ''
              )} */}
              {/* {qrcodes && qrcodes.length > 0 ? (
                <div className={styles.rightFooter}>
                  {qrcodes.map((item, i) => {
                    return <img src={item} key={i} />;
                  })}
                </div>
              ) : (
                ''
              )} */}
            {/* </div>
          </Footer>
        ) : (
          ''
        )} */}
      </Layout>
    </div>
  );
};

export default connect(({ settings, user }) => ({
  ...settings,
  user,
}))(UserCustomerLayout);

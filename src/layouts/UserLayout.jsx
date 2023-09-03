import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import loginEnv from '@/utils/loginenv';
import styles from './UserLayout.less';
import plmBgVideo from '@/assets/login/plm_bgvideo.mp4';
import plmBg from '@/assets/login/plm_bg.png';

const UserLayout = props => {
  useEffect(() => {
    // waterMark.set(`YSSPLM${getDateStr(0, false)}`);
    props.dispatch({
      type: 'user/saveCurrentUser',
      payload: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    route = {
      routes: [],
    },
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
  return (
    <>
      {/*      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet> */}

      <div className={styles.container}>
        {/*        <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <video
          src={plmBgVideo}
          autoPlay={true}
          poster={plmBg}
          muted={true}
          loop={true}
          style={{ width: '100%', position: 'absolute', objectFit: 'cover', marginTop: '-70px' }}
        />
        <div className={styles.content}>
          <div className={styles.topHeader}>
            <div style={{ display: 'flex', color: 'rgba(255,255,255,.8)' }}>
              <img className={styles.logo} src={loginEnv.LOGO} alt="LOGO" />
              <span
                style={{
                  width: 1,
                  height: 32,
                  margin: '5px 14px 0px',
                  backgroundColor: 'rgba(255,255,255,.8)',
                }}
              />
              <div style={{ marginTop: -3, fontSize: 16 }}>
                {/* <span style={{ display: 'block', height: 21 }}>产品生命周期</span> */}
                {/* <span style={{ display: 'block' }}>资管业务管理平台</span> */}
                <span
                  style={{
                    letterSpacing: '3px',
                    display: 'block',
                    fontSize: '26px',
                    height: '42px',
                    fontWeight: '400',
                    lineHeight: '42px',
                  }}
                >
                  资管业务管理平台
                </span>
              </div>
            </div>
            <div className={styles.headerLink}>
              {/*               <span>网站首页</span>
              <span>联系我们</span>
              <span>最新活动</span> */}
            </div>
          </div>
          <div className={styles.inner}>
            {/* <div className={styles.letf}> */}
            {/*  <div className={styles.plantText}>{loginEnv.LOGINTITLE}</div> */}
            {/* </div> */}
            <div className={styles.loginBox}>{children}</div>
          </div>
          {/*          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>国海证券</span>
              </Link>
            </div>
            <div className={styles.desc}>国海证券</div>
          </div> */}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
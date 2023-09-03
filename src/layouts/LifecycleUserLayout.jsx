import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang'; // import logo from '../assets/logo.svg';

import logo from '@/assets/login/img_logo_gh@2x.png';
import dl_img from '@/assets/login/dl_img_lc@2x.png';
import styles from './LifecycleUserLayout.less';

const UserLayout = props => {
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
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.middle}>
          <div className={styles.lang}>
            <div className={styles.logo}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.text}>
              <span className={styles.tabs}>网站首页</span>
              <span className={styles.tabs}>联系我们</span>
              <span className={styles.tabs}>最新活动</span>
              {/* <SelectLang /> */}
            </div>
          </div>
          <div className={styles.inner}>
            <div className={styles.dl}>
              <span>国海证券资管业务管理平台</span>
              <img className={styles.img} src={dl_img} alt="" />
            </div>
            <div className={styles.content}>
              {/*          <div className={styles.top}>
              <div className={styles.header}>
              <Link to="/">
               <img alt="logo" className={styles.logo} src={logo} />
               <span className={styles.title}>Ant Design</span>
              </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
              </div> */}
              {children}
            </div>
          </div>

          {/* <DefaultFooter /> */}
        </div>
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);

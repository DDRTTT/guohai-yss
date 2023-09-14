import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Col, Form, Row, Tabs } from 'antd';
// import { getVersion } from '../../systeam/switchover';
import { getLoginOrg } from '@/utils/cookie';
import styles from './index.less';
//个人注册
// import WrappedRegistrationForm from './PersonalRegister';
// import WrappedPersonalSuccess from './PersonalRegisterSuccess';
//企业注册
import WrappedCompanyFirstForm from './CompanyRegisterFirst';
import WrappedCompanySecondForm from './CompanyRegisterSecond';
import WrappedCompanySuccess from './CompanyRegisterSuccess';
//本页面中插入的所有图片
import company_icon from '@/assets/register/company_icon.png';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import YSS_mark from '@/assets/register/sign_logo1.png'; //YSS

const TabPane = Tabs.TabPane;

@errorBoundary
@Form.create()
@connect(state => ({
  register: state.register,
}))

//输入函数
export default class Register extends Component {
  state = {
    PersonalSuccess: 'none', //控制个人用户注册成功页面的显示和隐藏参数
    companySecond: 'none', //控制机构注册页面第二个页面的显示和隐藏
    companySuccess: 'none', //控制机构注册成功页面的显示和隐藏
    homeType: 'YSS',
    homeData: {
      localLogo: {
        loginlogo: YSS_mark,
      },
    },
  };

  componentDidMount() {
    // this.setState({
    //   homeType: getVersion().code,
    //   homeData: getVersion(),
    // });
  }

  //控制个人用户注册成功页面的显示和隐藏
  onChildChanged1 = submitBtn => {
    const { dispatch, register } = this.props;
    let PersonalSuccess;
    if (submitBtn === 1) {
      PersonalSuccess = 'block';
    } else {
      PersonalSuccess = 'none';
    }
    dispatch({
      type: 'register/upPersonalSuccess',
      payload: PersonalSuccess,
    });
  };

  //控制机构注册点击下一步的时候跳转到下一页
  onChildChanged2 = companyFirstBtn => {
    if (companyFirstBtn === 1) {
      this.setState({ companySecond: 'block' });
    } else {
      this.setState({ companySecond: 'none' });
    }
  };

  //控制机构注册点击下一步的时候跳转到注册成功页面
  onChildChanged3 = companySecondBtn => {
    if (companySecondBtn === 1) {
      this.setState({ companySuccess: 'block' });
      this.setState({ companySecond: 'none' });
    } else {
      this.setState({ companySuccess: 'none' });
    }
  };

  render() {
    const { dispatch, register } = this.props;
    const { homeType, homeData } = this.state;
    let login_org = getLoginOrg();
    let url_org = '';
    if (login_org == 0) {
      url_org = '/user/YALogin';
    } else if (login_org == 1) {
      url_org = '/user/GDLogin';
    } else {
      url_org = '/user/Login';
    }

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.main}>
            <Row>
              <Col span={12}>
                <div className={styles.header_pic}>
                  <Link to={homeType == 'YSS' ? '/user/Login' : '/user/index'}>
                    <img alt="资管投资者服务平台" src={homeData.localLogo.loginlogo} />
                  </Link>
                </div>
              </Col>
              <Col span={12} className={styles.header_right}>
                已有账号？请<Link to={url_org}>登录</Link>
              </Col>
            </Row>
          </div>
          {/*main end 背景图片*/}
        </div>
        {/*header end 背景图片*/}
        <div className={styles.content}>
          <div className={styles.main}>
            <Tabs tabPosition="right">
              {/*<TabPane tab={<span><img className={styles.icon_pic} alt="个人用户注册" src={man_icon}/>个人用户注册</span>} key="1">*/}
              {/*<WrappedRegistrationForm*/}
              {/*callbackParent={this.onChildChanged1}*/}
              {/*dispatch={dispatch}*/}
              {/*register={register}*/}
              {/*/>*/}
              {/*<WrappedPersonalSuccess*/}
              {/*callbackChild1={register.PersonalSuccess}*/}
              {/*dispatch={dispatch}*/}
              {/*/>*/}
              {/*</TabPane>*/}
              <TabPane
                tab={
                  <span>
                    <img className={styles.icon_pic} alt="机构用户注册" src={company_icon} />
                    机构用户注册
                  </span>
                }
                key="2"
              >
                <WrappedCompanyFirstForm
                  callbackParent={this.onChildChanged2}
                  dispatch={dispatch}
                  register={register}
                />
                <WrappedCompanySecondForm
                  callbackChild2={
                    register && register.companySuccess === 'block'
                      ? 'none'
                      : this.state.companySecond
                  }
                  callbackParent={this.onChildChanged3}
                  dispatch={dispatch}
                  register={register}
                />
                <WrappedCompanySuccess
                  callbackChild3={register && register.companySuccess}
                  dispatch={dispatch}
                />
              </TabPane>
            </Tabs>
          </div>
          {/*main end 背景图片*/}
        </div>
        {/*content end 背景图片*/}
      </div>
    );
  }
}

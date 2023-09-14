/**
 *Create on 2020/6/20.
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  GET_REFRESH_TOKEN_WITH_USERID_API,
} from '@/services/global';
import {
  GET_PROJECT_INFO_API,
  handleGetMenuAPI,
} from '@/services/user';
import { setAuthToken, setMenu, removeAuthToken } from '@/utils/session';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Index = ({}) => {

  const loginFunc = (auth_token, url) => {
    setAuthToken(auth_token)
    sessionStorage.setItem('ONCLICK_TIME', Date.now())
    if (!url) { // 没有url的情况下跳转登录之后的首页
      location.href = '/workspace'
      return;
    }
    // 有url的情况下跳转至/base/processCenterHome
    handleGetMenuAPI({
      needAction: true,
      sysId: 1,
    }).then(res=>{
      if (res && res.status === 200) {
        const menu = res.data;
        setMenu(JSON.stringify(menu));
        location.href = '/base/processCenterHome'
      }
    })
  };
  useEffect(() => {
    sessionStorage.setItem('ENCRYPTION', '{"data":{"responseEncryFlag":false}}')
    // 获取document的title
    GET_PROJECT_INFO_API().then(res=>{
      if(res?.status===200) {
        document.title = res.data.loginTitle;
        sessionStorage.setItem('d', '招募说明书智能撰写')
      }
    })
    
    const userInfo = getPageQuery()
    GET_REFRESH_TOKEN_WITH_USERID_API({ userCode: userInfo.userCode }).then(res=>{
      if (
        res?.status &&
        res?.status === 200 &&
        res?.data?.token !== undefined &&
        res?.data?.token !== '' &&
        res?.data?.token !== null
      ) {
        if (res.data.token.indexOf('失败')===-1) {
          loginFunc(res.data.token, userInfo.url);
        } else {
          location.href = '/user/login';
          sessionStorage.removeItem('d');
        }
      } else {
        location.href = '/user/login';
        sessionStorage.removeItem('d');
      }
    }).catch(err=>{
      console.log(err)
    })
  }, []);

  return (
    <div>
      loading...
    </div>
  );

};

export default connect(({ user }) => ({user}))(Index);

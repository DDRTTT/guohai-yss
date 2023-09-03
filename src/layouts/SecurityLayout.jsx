import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { getAuthToken } from '@/utils/session';

const SecurityLayout = ({
  // dispatch,
  children,
  loading,
  // currentUser,
  token,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    // if (dispatch) {
    //   // dispatch({
    //   //   type: 'user/fetchCurrent',
    //   // });
    // }
  }, []);

  // const handleIsEmptyObject = obj => {
  //   for (var name in obj) {
  //     return false;
  //   }
  //   return true;
  // };

  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

  // const isLogin = currentUser && currentUser.userid;
  // const isLogin = !handleIsEmptyObject(currentUser) && (token || getAuthToken());
  const isLogin = token || getAuthToken();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && loading) || !isReady) {
    return <PageLoading />;
  }

  if (!isLogin && window.location.pathname !== '/user/login') {
    // return <Redirect to={`/user/login?${queryString}`} />;
    return <Redirect to="/user/login" />;
  }

  return children;
};

export default connect(({ login, user, loading }) => ({
  currentUser: user.currentUser,
  token: login.token,
  loading: loading.models.user,
}))(SecurityLayout);

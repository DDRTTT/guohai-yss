let lastRoute = false;
let msgRoute = false;
// 跳转到子项目的时候要保持原先的状态的功能 如果是在产品生命周期的目录下的时候要清空保存起来的选项
export function onRouteChange({ location, routes, action }) {
  // const reg = /(productLifecycle|workspace)+/;
  const reg = /(\/dynamicPage\/pages\/|\/processCenter\/processHistory|\/processCenter\/processDetail|\/processCenter\/taskDeal)+/;
  if (!reg.test(location.pathname) && lastRoute) {
    window.g_app._store.dispatch({
      type: 'publicModel/setPublicTas',
      payload: 'T001_1',
    });
  }
  lastRoute = !reg.test(location.pathname);

  // 这个是消息模块的清空数据
  const msgReg = /messageReminding+/;
  if (!msgReg.test(location.pathname) && msgRoute) {
    window.g_app._store.dispatch({
      type: 'messageReminding/setNormalProperty',
      payload: {
        mPageNum: 1,
        mTaskTypeCode: 'lifecycle',
        mPageSize: 10,
        mType: '',
        mCeateTime: [],
        mIsHandle: '',
        mMsgTitle: '',
        mMsgProCodeList: [],
        mOnAndOff: false,
        mShowSearch: true,
        mProcessPageSize: 10,
        mProcessPageNum: 1,
      },
    });
  }
  msgRoute = !msgReg.test(location.pathname);
}

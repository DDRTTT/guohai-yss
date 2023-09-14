import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import PreviewModal from './preview';
import { parse } from 'qs';

const Detail = ({
  dispatch,
  roleManagement: {
    saveDictList: { attributionSystem },
    saveAllMenuTree,
    saveAuthorizeActionsList,
  },
  fetchGetAuthTreeLoading,
  addroleLoading,
  form,
  functionManagement: { roleDetail },
}) => {
  // 获取的连接里面的参数
  const { dataId, isDetail } = parse(location.search, { ignoreQueryPrefix: true });
  const [sysId, setSysId] = useState();

  useEffect(() => {
    // 查询字典
    dispatch({
      type: 'roleManagement/handleGetDictList',
      payload: { codeList: 'attributionSystem' },
    });

    if (isDetail !== '0' && dataId) {
      dispatch({
        type: 'functionManagement/getrolebyroleid',
        payload: dataId,
      }).then(res=>{
        res?.sysId && GetAuthTree(res?.sysId)
      })
    }
  }, []);

  const GetAuthTree = val =>{
    // 权限树查询
    dispatch({
      type: 'roleManagement/fetchGetAuthTree',
      payload: val,
    });
  }

  return (
    <PreviewModal
      title={isDetail === '0' ? '新增功能' : (isDetail === '1' ? '功能详情' : '功能修改')}
      saveAuthorizeActionsList={saveAuthorizeActionsList}
      saveAllMenuTree={saveAllMenuTree}
      fetchGetAuthTreeLoading={fetchGetAuthTreeLoading}
      ownershipSystem={attributionSystem}
      addroleLoading={addroleLoading}
      selectOwnershipSystem={sysId}
      ownershipSystemChange={GetAuthTree}
      form={form}
      dispatch={dispatch}
      isDetail={isDetail}
      roleDetail={roleDetail}
      disabled={isDetail !== '1'}
    />
  );
};

export default errorBoundary(
  Form.create()(
    connect(({ loading, roleManagement, functionManagement }) => ({
      roleManagement,
      functionManagement,
      fetchGetAuthTreeLoading: loading.effects['roleManagement/fetchGetAuthTree'],
      addroleLoading: loading.effects['functionManagement/addrole'],
    }))(Detail),
  ),
);

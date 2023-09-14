import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button } from 'antd';
import FileMain from './components/FileMain';

const view = function({
  location,
  listLoading,
  dispatch,
  fileBorrower: {
    orderList: { rows, total },
    tranDicts,
    transFiles,
  },
}) {
  const [detail, setDetail] = useState({});
  useEffect(() => {
    const data = JSON.parse(decodeURI(location.query.detail));
    setDetail(data);
    dispatch({
      type: 'fileBorrower/getorderList',
      payload: {
        bizViewId: 'I8aaa82cd0180d50fd50f97bf0180f40b544b6400',
        isPage: '0',
        returnType: 'LIST',
        id: data.id,
      },
    });

    // 翻译字典 档案室等
    tranDicts.length === 0 &&
      dispatch({
        type: 'fileBorrower/getTranDicts',
        payload: {
          bizViewId: 'I8aaa82cd0180d50fd50f97bf018104339563029f',
          isPage: '0',
          returnType: 'LIST',
        },
      });
    // 翻译字典 档案大类等
    transFiles.length === 0 &&
      dispatch({
        type: 'fileBorrower/getFileTypes',
        payload: {},
      });
  }, []);
  return (
    <div>
      <FileMain
        buttons={[
          {
            type: '',
            label: '取消',
            click: () => {
              router.goBack();
            },
          },
        ]}
        detail={detail}
        selectedRows={rows}
        listLoading={listLoading}
        showDelSome={false}
      ></FileMain>
    </div>
  );
};

export default connect(({ fileBorrower, loading }) => ({
  fileBorrower,
  listLoading: loading.effects['fileBorrower/getorderList'],
}))(view);

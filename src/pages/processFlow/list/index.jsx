import React, {useEffect, useState} from 'react';
import {Form, message} from 'antd';
import {connect} from 'dva';
import List from "./List";
import {router} from "umi";


// const GuideContext = React.createContext({});
// 流程库指引
const Index = props => {
  const {
    dispatch,
    pageInfo,
    listData,
    serviceCdn,
    listLoading
  } = props;
  // 当前选中的card的指引
  const [currentId, setCurrentId] = useState(-1);
  // 当前的数据

  useEffect(() => {
  }, );

  const changeCreateStatus = (creatStatus) =>{
    // dispatch({
    //   type: 'processNode/setCreateStatus',
    //   payload: {creatStatus}
    // });
  };

  const deleteData = ({payload, cb})=>{
    dispatch({
      type:'processListModels/deleteListData',
      payload,
      cb
    });
  }

  const getData = ({payload})=>{
    dispatch({
      type:'processListModels/getListData',
      payload
    });
  }

  const getNodeData = (data, type) =>{
    if(!serviceCdn.jsApiIp){
      message.error('无法获取cdn文件服务');
      return;
    }

    // 暂时无法介入umi的redux数据持久化动作，只能先作缓存
    sessionStorage.setItem('_templateParams', JSON.stringify(data));
    sessionStorage.setItem('viewStatus', type);
    router.push('/prospectus/processFlow/process');// 是否需要再这里跳转
    // dispatch({
    //   type:'processNode/getNodeData',
    //   payload: { ...data }
    // });
  }

  return (
    // <GuideContext.Provider value={{ detailRef }}>
      <div>
        <List
          getNodeData={getNodeData}
          getData={getData}
          listData={listData}
          listLoading={listLoading}
          deleteData={deleteData}
          pageInfo={pageInfo}
          changeCreateStatus={changeCreateStatus}
        >
        </List>
      </div>
    // </GuideContext.Provider>
  );
};
const list = state => {
  const {
    dispatch,
    processListModels,
    processNode,
    loading
  } = state;
  return {
    dispatch,
    serviceCdn: processNode.serviceCdn,
    listData: processListModels.listData,
    pageInfo: processListModels.pageInfo, // 页面相关信息
    listLoading: loading.effects['processListModels/getListData'],
  };
};
export default Form.create()(connect(list)(Index));

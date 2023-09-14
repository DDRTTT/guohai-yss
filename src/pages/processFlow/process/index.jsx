import React, {useEffect, useRef, useState} from 'react';
import {ConfigProvider, Form, message} from 'antd';
import {connect} from 'dva';
import style from './index.less';
import EditDoc from "@/components/DocDeal";
import BaseForm from "@/pages/processFlow/process/BaseForm";
import OperationMenu from "@/components/OperationMenu";
import {router} from "umi";
import ShowHide from "@/components/ShowHide";
import {completeTask} from "@/services/processRelate";
import ShowFormsCon from "@/components/ShowFormsCon";
import ReviewComments from "@/pages/processFlow/process/ReviewComments";
import ReturnModal from "@/pages/processFlow/process/ReturnModal";
import {getJsonFromSession, getValFromSession} from './utils';
import request from "@/utils/request";

// const GuideContext = React.createContext({});
// 流程库指引
const Index = props => {
  const {
    dispatch,
    showMode,
    nodeInfo,
    tagsList,
    processData,
    docInfo,
    serviceCdn,
    fileDefaultPath,
    coreModule,
    inputParameters,
    selectTags,
    templateForms,
    viewStatus
  } = props;
  const { processList } = processData;
  if(!processList){
    const origin = location.origin;
    location.href = `${origin}/processFlow/list`;
  }

  const taskData = processList[0].taskList[0];

  const simpleHeader = {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  };
  
  const headers = {
    ...simpleHeader,
    Token: getValFromSession('auth_token') || '',
    Data: new Date().getTime(),
    Sys: 1,
    userId: getJsonFromSession('USER_INFO')?.id || null
  }

  const [returnVisible, setReturnVisible] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [positionIdList, setPositionIdList] = useState([]);
  // 当前选中的card的指引

  useEffect(() => {}, );

  const beforeSub = (e) => {
    e.preventDefault();
    //
    thirdPartAppRef.current.saveData();
  };
  //获取ip
  const getNnginxip = () => {
    return new Promise((resolve, reject)=>fetch(`/ams/ams-file-service/businessArchive/getnginxip`, {
      headers,
    }).then(resp => {
      resp.json().then((response) => {
        const data = response.data;
        resolve(data);
      });
    }).catch(()=> message.error('获取ip列表失败')));
  }
  //一键清稿
  const cleandraft = (url, params) => {
    return new Promise((resolve, reject)=>fetch(`${url}/cleandraft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(params)
    }).then(resp => {
      resp.json().then((response) => {
        const data = response.urls;
        resolve(data);
      });
    }).catch(()=> message.error('清稿失败，请重试')));
  }
  //清除畅写缓存
  const remove = (url, key) => {
    return new Promise((resolve, reject)=>fetch(`${url}/remove`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      params:{key}
    }).then(resp => {
        resolve(resp);
    }).catch(()=> message.error('清除失败，请重试')));
  }
  //替换清洁后的文件
  // const insteadWord = (params) => {
  //   return new Promise((resolve, reject)=>fetch(`/ams/yss-contract-server/RpTemplate/updateRemoteFileByUrl`, {
  //     method: 'GET',
  //     headers,
  //     params
  //   }).then(resp => {
  //     resp.json().then((response) => {
  //       const data = response;
  //       resolve(data);
  //     });
  //   }).catch(()=> message.error('替换失败，请重试')));
  // }

  const submitCallBack = (e)=>{
    e && e.preventDefault();
    function insteadWord(params) {
      return request(`/yss-contract-server/RpTemplate/updateRemoteFileByUrl`, {
        method: 'get',
        params
      });
    }
    // 先存畅写
    // 保存流程
    
    const data = {
      editMarks: {},
      files: [],
      formData: {},
      taskId: taskData.id
    };
    data.formData = {...nodeInfo.formData,
      updateType: '0',
      taskDefinitionKey: nodeInfo.taskDefinitionKey,
      processInstanceId: nodeInfo.processInstanceId
    };
    const templateParams = JSON.parse(sessionStorage.getItem('_templateParams'));
    if (templateParams.taskName.includes('办理人')) {
      thirdPartAppRef.current.save();
      completeTask(data).then((res)=>{
        if(res.status === 200){
          router.push('/prospectus/processFlow');
        }
      });
    } else {
      thirdPartAppRef.current.save();
      getNnginxip().then(res => {
        const key = templateParams.fileSerialNumber
        let url = `${res.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${key}`;
        const params = {
          fileUrl: url,
          acceptAllRevision: true,
        };
        cleandraft(res.jsApiIp, params).then(resp => {
          remove(res.jsApiIp, key).then(suc => {
            insteadWord({fileSerialNumber: key, url: resp['result.docx']}).then(succ => {
              if (succ.data) {
                completeTask(data).then((res)=>{
                  if(res.status === 200){
                    router.push('/prospectus/processFlow');
                  }
                });
              }
            })
          })
        })
      })
    }
  };
  const cancelCallBack = ()=>{
    router.goBack();
  };
  const saveCallBack = ()=>{
    // router.push('/processFlow/list');
    message.success('保存成功');
  };
  const returnCallBack = ()=>{
    setReturnVisible(true);
  };
  const dialogCallBack = ()=>{
   // setReturnVisible(true);
  };

  const thirdPartAppRef = useRef();
  const operationFunc = {
    saveCallBack,
    returnCallBack,
    submitCallBack,
    cancelCallBack
  }

  const modelOkConfig = (values) => {
    setReturnLoading(true)
    // {
    //   "files": [],
    //   "formData": {
    //   "TContractBusinessArchive": {
    //     "custodian": [],
    //       "proCode": [
    //       "010345"
    //     ],
    //       "financialDate": "2022-12-01",
    //       "expiryDate": "2022-12-01",
    //       "disclosureDate": "2022-12-01",
    //       "yesOrNo": "0"
    //   },
    //   "coreModule": "TContractBusinessArchive",
    //     "listModule": [
    //     ""
    //   ],
    //     "ignoreTable": [
    //     ""
    //   ],
    //     "processId": "c054d6d3b36b4dfc84965064169f59c5",
    //     "jianchajiheyijian": "已办理",
    //     "job": "19",
    //     "fileData": {
    //     "fileSerialNumber": "1219221419638958531",
    //       "fileName": "华泰柏瑞成长智选混合型证券投资基金招募说明书更新(2022年第2号).docx",
    //       "fileFormat": "docx"
    //   },
    //   "updateType": "0",
    //     "id": "987fb89ee8114e0dbb45b876fc41633d",
    //     "returnedTags": "[\"59009884\"]"
    // },
    //   "taskId": "d3664a53-803d-11ed-9a00-125db8f6da49",
    //   "editMarks": {},
    //   "job": "19",
    //   "executionId": "d3655fbf-803d-11ed-9a00-125db8f6da49"
    // }
    if(!selectTags.length){
      message.error('需要选中要退回的节点');
      return;
    }
    const data = {
      editMarks: {},
      executionId: nodeInfo.executionId,
      files: [],
      formData: {
        ...nodeInfo.formData,
        job: positionIdList.join(), // 退回岗位
        returnedTags: JSON.stringify(selectTags.map((item)=>item.directoryNumber))
      },
      job: positionIdList.join(), // 退回岗位
      taskId: nodeInfo.taskId
    };
    const reqBody = {
      taskId: nodeInfo.taskId,
      varibles: { returnedTags: JSON.stringify(selectTags.map((item)=>item.directoryNumber)) },
      procinsId: nodeInfo.processInstanceId
    }
    dispatch({
      type: 'processNode/returnProcess',
      payload: data,
      cb: ()=>{
        dispatch({
          type: 'processNode/returnTags',
          payload: reqBody,
          cb: () => {
            setReturnVisible(false);
            setReturnLoading(false);
            message.success('退回成功!');
            router.push('/prospectus/processFlow')
          }
        })
      }
    });
  };
  const modelCancelConfig = () => {setReturnVisible(false)};
  const checkedTagsCallBack = (tags) => {
    const positionList = [];
    tags.forEach((item) => {
      for (let i = 0; i < item?.positionInfoList.length; i++) {
        positionList.push(item?.positionInfoList[i].id);
      }
    });
    setPositionIdList(positionList); // 回退需要的数据
    // 选中项列表
    dispatch({
      type: 'processNode/setSelectTagsList',
      payload: tags,
    });
  };
  return (
    // <GuideContext.Provider value={{ detailRef }}>
    <ConfigProvider autoInsertSpaceInButton={ false }>
      <div className={style.processLibraryGuide}>
        <OperationMenu
          style={{margin: '-20px -20px 0 -20px', backgroundColor: '#ffffff'}}
          title={'招募说明书-办理'}
          isCreate={false}
          formTarget="formData"
          taskData={taskData}
          inputParameters={inputParameters}
          {...operationFunc}></OperationMenu>
        <EditDoc
          ref={thirdPartAppRef}
          isProcess={true}
          showMode={viewStatus === 'edit'}
          processData={processData}
          templateForms={templateForms}
          nodeInfo={nodeInfo}
          fileDefaultPath={ fileDefaultPath }
          docInfo={docInfo}
          docConfig={{}}
          tagsList={tagsList}
          serviceCdn={serviceCdn}
          checkedTagsCallBack={checkedTagsCallBack}
        ></EditDoc>
        <ShowHide  style={{ marginTop: 10 }}  title="基本表单">
          <BaseForm coreModule={coreModule} nodeInfo={nodeInfo}></BaseForm>
        </ShowHide>
        <ShowFormsCon templateForms={templateForms} target="jianchajiheyijian">
          <ShowHide  style={{ marginTop: 10 }} title="检查审核">
            <ReviewComments></ReviewComments>
          </ShowHide>
        </ShowFormsCon>
        <ReturnModal
          returnVisible={returnVisible}
          positionIdList={positionIdList}
          onOk={(value) => modelOkConfig(value)}
          onCancel={() => modelCancelConfig()}
          returnLoading={returnLoading}>
        </ReturnModal>
      </div>
    </ConfigProvider>
    // </GuideContext.Provider>
  );
};
const processFlow = state => {
  const {
    dispatch,
    processNode
  } = state;

  const { showMode,
    fileDefaultPath,
    nodeInfo,
    tagsList,
    processData,
    serviceCdn,
    docInfo,
    coreModule,
    selectTags,
    inputParameters,
    templateForms,
    viewStatus
  } = processNode;

  return {
    dispatch,
    showMode,
    nodeInfo,
    tagsList,
    processData,
    docInfo,
    serviceCdn,
    fileDefaultPath,
    coreModule,
    inputParameters,
    selectTags,
    templateForms,
    viewStatus
  };
};
export default connect(processFlow)(Form.create()(Index));

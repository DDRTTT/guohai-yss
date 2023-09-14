import React, {useEffect, useState} from "react";
import { Button, Row, Col} from 'antd';
import {router} from "umi";
import {Modal, Spin, Transfer} from "antd";
import styles from "@/components/DocDeal/index.less";

function transArrToObj(arr){
  const obj = {};
  if(arr){
    arr.forEach((item)=>{
      obj[item] = '1';
    });

  }
  return obj;
}

const OperationMenu = (props)=>{
  const { isCreate, formTarget, submitCallBack, cancelCallBack, returnCallBack, saveCallBack, title, style, taskData, inputParameters } = props;

  const [loading, setLoadingStatus] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  const handleEnter = (e) => {
    setSubVisible(true);
  };

  const handleSubmit = (e)=>{
    e && e.preventDefault();
    setLoadingStatus(true)
    setSubVisible(false);
    submitCallBack(e, ()=>setLoadingStatus(false));
  }
  const handleCancel = (e)=>{
    e.preventDefault();
    cancelCallBack();
  }

  const handleReturn = (e)=>{
    e.preventDefault();
    returnCallBack();
  }
  const handleSave = (e)=>{
    e.preventDefault();
    saveCallBack();
  }

  const onCancel = (e)=>{
    setSubVisible(false)
  }

  const processGraphic = () => {
    const {processInstanceId, id, taskDefinitionKey} = taskData;
    router.push(`/processCenter/processHistory?&taskId=${id}&processInstanceId=${processInstanceId}&nodeId=${taskDefinitionKey}`);// 需要taskId
  };

  const btnStyles = {
    marginLeft: 10, fontSize: 13
  };

  const btns = inputParameters && inputParameters.length ? transArrToObj(inputParameters[0].operationAuthority) : {};
  return (
    <>
    <Row style={{ padding: '15px 30px 10px 30px', ...style }}>
      <Col span={12} >
        <div style={{fontSize: 15, lineHeight: '32px', fontWeight: 600}}>{title}</div>
      </Col>
      <Col span={12} style={{textAlign: 'right'}}>
        <Button type="primary" style={btnStyles} loading={loading} htmlType="submit"  form={formTarget} onClick={handleEnter}>
          { isCreate ? '提交': '通过' }</Button>
        { !isCreate && (<Button style={btnStyles} onClick={processGraphic}>
          流转历史
        </Button>)}
        {/*{ !isCreate && (<Button style={btnStyles} onClick={handleSave}>*/}
        {/*  保存*/}
        {/*</Button>)}*/}
        { btns.hasOwnProperty('直线退回') && (<Button style={btnStyles} onClick={handleReturn}>
          直线退回
        </Button>)}
        <Button style={btnStyles} onClick={handleCancel}>
          取消
        </Button>
      </Col>
    </Row>
    <Modal
      title="系统提示"
      visible={subVisible}
      onOk={() => handleSubmit()}
      onCancel={() => onCancel()}
      zIndex={1001}
      width={300}
    >是否确定通过？</Modal>
    </>
  )
}

export default OperationMenu

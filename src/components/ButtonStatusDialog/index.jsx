import { Icon, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import {Button} from "antd";

const ButtonDialog = (props,ref) => {
  const {style, icon, footer, title, btnText, addNewBtn, okCallback} = props;
  const [openStatus, setOpenStatus] = useState(false);

  useEffect(()=>{},[title, footer, openStatus]);

  const showModal = () => {
    setOpenStatus(true);
  };

  const clickButton = (e)=>{
    e.preventDefault();
    addNewBtn();
    showModal();
  }

  const handleOk = e => {
    e.preventDefault();
    // setOpenStatus(false);
    okCallback();
  };

  const handleCancel = e => {
    setOpenStatus(false);
  };


  return (
   <span style={ style ? {...style}: {} }>
     <Button type="primary" size="small" onClick={(e)=>clickButton(e)}>{btnText} <Icon type={icon} /></Button>
     <Modal
       ref={ref}
       footer={footer}
       title={title}
       visible={openStatus}
       onOk={handleOk}
       onCancel={handleCancel}
       showModal={showModal}
       cancelButtonProps={handleCancel}
     >
       {props.children}
     </Modal>
   </span>
  );
};

const ButtonDialogInit = React.forwardRef(ButtonDialog);
export default ButtonDialogInit;

import { Icon, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import {Button} from "antd";

const ButtonDialog = (props,ref) => {
  const {btnConfig, dialogConfig, btnText} = props;
  const [openStatus, setOpenStatus] = useState(false);

  const showModal = () => {
    setOpenStatus(true);
  };

  const clickButton = (e)=>{
    e.preventDefault();
    btnConfig.addNewBtn();
    showModal();
  }

  const handleOk = e => {
    e.preventDefault();
    // setOpenStatus(false);
    dialogConfig.okCallback();
  };

  const handleCancel = e => {
    setOpenStatus(false);
    if(dialogConfig.cancelCallback instanceof Function){
      dialogConfig.cancelCallback();
    }
  };


  return (
   <span>
     <Button type="primary" size="small" onClick={(e)=>clickButton(e)}  {...btnConfig}>{btnText}</Button>
     <Modal
       ref={ref}
       {...dialogConfig}
       visible={openStatus}
       onOk={handleOk}
       onCancel={handleCancel}
       showModal={showModal}
     >
       {props.children}
     </Modal>
   </span>
  );
};

const ButtonDialogInit = React.forwardRef(ButtonDialog);
export default ButtonDialogInit;

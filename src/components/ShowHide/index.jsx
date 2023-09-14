import React, { useEffect, useState } from "react";
import { Button, Icon } from 'antd';


const configStyles = {
  textAlign: 'right',
  backgroundColor: '#ffffff',
  padding: '7px 20px 7px 20px',
  fontsize: 12
};

const bodyStyle = {
  display: 'block',
  backgroundColor: '#ffffff',
  padding: '10px'
}

const Index = ({children, style, title})=>{
  const [status, setStatus] = useState(false);// 产品 options
  const changeStatus = (e) => {
    e.preventDefault();
    setStatus(!status);
  }
  return (<>
    <div style={{ ...configStyles, ...style}}>
      {title ? (<span style={{float: 'left'}}>{title}</span>) : ''}
    {!status ? (<a type="text" onClick={changeStatus}>显示 <Icon type="up" /></a>) :
      (<a type="text"  onClick={changeStatus}>隐藏 <Icon type="down" /></a>) }
    </div>
      <div style={status ? { ...bodyStyle} : { ...bodyStyle, display:'none'}} >{children}</div>
  </>)
}

export default  Index;

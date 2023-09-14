import React, { useEffect, useState, useRef, useContext, forwardRef, useMemo } from 'react';
import {Row, Col, Form, Layout, message, Drawer, Button} from 'antd';
import style from './index.less';

///  暂时不用，没有找到直接访问流程图页面的方案

// const GuideContext = React.createContext({});
// 流程库指引
const Index = props => {
  const {
    dispatch,
    pageInfo
  } = props;
  // 当前选中的card的指引
  const [visible, setVisible] = useState(false);
  // 当前的数据

  useEffect(() => {
  }, );

  const showDrawer  = (e) =>{
    e.preventDefault();
    setVisible(true);
  };

  const onClose  = ()=>{
    setVisible(false);
  }

  return (
      <div className={style.processLibraryGuide}>
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
        <Drawer
          title="流程图"
          placement="right"
          width="80%"
          closable={false}
          onClose={onClose}
          visible={visible}
          drawerStyle={{padding: 0}}
        >
          <iframe width="100%" height="100%" src="http://localhost:8082/processCenter/processHistory"></iframe>
        </Drawer>
      </div>
  );
};
export default Index;

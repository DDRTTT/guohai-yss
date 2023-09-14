import React, {useEffect, useState} from "react";
import {Button, Form, Icon, Select} from "antd";
import styles from "@/pages/fundAchieveNote/index.less";
const Option = Select.Option;

import baseInfoManagementConfig from "@/pages/resetModalManagement.config";
import {queryOptionsData} from "@/services/processRelate";
const { contentType, linkId, coreModule } = baseInfoManagementConfig.fundAchieveNote;

const FilterForm = ({ submit, filterStatus, setFilterStatus})=>{

  const [optionsData, setOptionsData] = useState([]);
  const [selection, setSelection] = useState('');

  const tagStatus = e => {
    e.preventDefault()
    setFilterStatus(false);
  };

  useEffect(()=>{
    // 加载产品数据
    getOptionsData();
  },[]);

  const getOptionsData = ()=>{
    const data = {
      path: "/ams/yss-contract-server/RpFund/fuzzyQueryByName",
      methodName: "POST",
      linkId,
      contentType,
      queryParams: [
        {
          code: "keyWords",
          value: ""
        },
        {
          code: "currentPage"
        },
        {
          code: "pageSize"
        }
      ]
    }

    // 获取下拉数据
    queryOptionsData(data).then((res)=>{
      if(res?.status === 200){
        setOptionsData(res.data);
      }
    })
  };

  const searchCallBack = (e)=>{
    e.preventDefault();
    const params = {
      code: 'proNameList',
      value: selection
    };
    submit(params);
  }
  const resetData = (e)=>{
    e.preventDefault();
    const params = {
      code: 'proNameList',
      value: ''
    };
    submit(params);
  };

  const handleSelectChange = value => {
    setSelection(value.map((item)=>item.key).toString());
  }
  return (
    <div style={{clear:'both'}}>
      {filterStatus ?( <Form layout="horizontal" style={{display:'flex'}}>
        <div style={{flex:1}}>
          <Form.Item label="产品名称"  labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Select
              mode="multiple"
              labelInValue
              placeholder="请选择"
              onChange={handleSelectChange}
              allowClear
            >
              { optionsData.map((item)=>(<Option key={item.proCode} value={item.proCode}>{item.proName}</Option>))}
            </Select>
          </Form.Item>
        </div>
        <div style={{flex:1}}>
          <Form.Item style={{textAlign: 'right'}}  labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Button style={{fontSize: 12}} type="primary" size="small" htmlType="submit" onClick={(e)=>searchCallBack(e)}>
              查询
            </Button>
            <Button style={{marginLeft: 20, fontSize: 12}}  size="small" type="primary" onClick={(e)=>resetData(e)}>
              重置
            </Button>
            <span className={styles.fold} onClick={(e)=>tagStatus(e)}>收起<Icon type="up" /></span>
          </Form.Item>
        </div>
      </Form>) : (<span></span>)}
    </div>
  )
};

export default FilterForm;

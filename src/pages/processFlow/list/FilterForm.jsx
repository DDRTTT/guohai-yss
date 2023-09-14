import React, {useEffect, useState} from "react";
import {Button, Col, Form, Icon, Input, Row, Select} from "antd";
import styles from "@/pages/fundAchieveNote/index.less";
import baseInfoManagementConfig from "@/pages/resetModalManagement.config";
import {queryOptionsData} from "@/services/processRelate";
import SelectForAnt3 from "@/components/SelectForAnt3";

const Option = Select.Option;

const { contentType, linkId, coreModule } = baseInfoManagementConfig.fundAchieveNote;

const FilterForm = ({ submit, filterStatus, setHeadStatus})=>{

  const [optionsData, setOptionsData] = useState([]);
  const [selection, setSelection] = useState('');
  const [fileName, setFileName] = useState('');

  const tagStatus = e => {
    e.preventDefault()
    setHeadStatus(false);
  };

  useEffect(()=>{
    // 加载产品数据
    getOptionsData();
  },[]);

  const getOptionsData = ()=>{
    const data = {
      path: "/ams/yss-contract-server/RpProduct/queryAllByCondition",
      methodName: "POST",
      linkId,
      contentType,
      queryParams: []
    }
    // 获取下拉数据
    queryOptionsData(data).then((res)=>{
      if(res?.status === 200){
        setOptionsData(res.data.filter((item)=>item));
      }
    })
  };

  const searchCallBack = (e)=>{
    e.preventDefault();
    const params = [
      {
        code: 'proCodeList',
        value: selection
      },
      {
        code: 'fileName',
        value: fileName
      }
  ];
    sessionStorage.setItem('sessionQuery', JSON.stringify(params))
    submit(params);
  }
  const resetData = (e)=>{
    e.preventDefault();
    const params = {
      code: 'proCodeList',
      value: ''
    };
    submit(params);
  };

  const handleSelectChange = value => {
    setSelection(value.map((item)=>item.key).toString());
  }
  const handleInputChange = e => {
    setFileName(e.target.value)
  }
  return (
    <div style={{clear:'both'}}>
      {filterStatus ? ( <Form layout="horizontal" style={{display:'flex'}}>
        <Row gutter={[10, 10]} style={{width: '100%'}}>
          <Col span={6} >
            <Form.Item label="招募书名称"  labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Input placeholder="" allowClear={true} onChange={(e)=>handleInputChange(e)}/>
            </Form.Item>
          </Col>
          {/*<Col span={10} >*/}
          {/*  <Form.Item label="产品名称"  labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>*/}
          {/*    <Select*/}
          {/*      showSearch*/}
          {/*      optionFilterProp="children"*/}
          {/*      mode="multiple"*/}
          {/*      labelInValue*/}
          {/*      placeholder="请选择"*/}
          {/*      maxTagCount={1}*/}
          {/*      onChange={handleSelectChange}*/}
          {/*      allowClear*/}
          {/*      getPopupContainer={()=>document.body}*/}
          {/*    >*/}
          {/*      { optionsData.map((item)=>(<Option key={item.proCode} value={item.proCode}>{item.proName}</Option>))}*/}
          {/*    </Select>*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={6} >
            <Form.Item label="产品名称"  labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <SelectForAnt3
                selectConfig={{
                  mode: "multiple",
                  labelInValue: true,
                  placeholder: "请选择",
                  maxTagCount: 1,
                  maxTagTextLength: 12,
                  allowClear: true,
                  optionFilterProp: 'children',
                  onChange: handleSelectChange,
                }}
                labelKey="proName"
                valueKey="proCode"
                symbolKey="proCode"
                data={optionsData}
              />
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item style={{textAlign: 'right'}}  labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              <Button style={{fontSize: 12}} type="primary" htmlType="submit" onClick={(e)=>searchCallBack(e)}>
                查询
              </Button>
              <Button style={{marginLeft: 20, fontSize: 12}} onClick={(e)=>resetData(e)}>
                重置
              </Button>
              <span className={styles.fold} onClick={(e)=>tagStatus(e)}>收起<Icon type="up" /></span>
            </Form.Item>
          </Col>
        </Row>
      </Form>) : (<span></span>)}
    </div>
  )
};

export default FilterForm;

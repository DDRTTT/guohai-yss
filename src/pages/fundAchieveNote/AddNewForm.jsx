import React, {useEffect, useState} from "react";
import { Button, Input, Form, Select } from 'antd';
import {addPageOptionsData, addRpFundAnno} from "@/services/processRelate";
import baseInfoManagementConfig from "@/pages/resetModalManagement.config";
const { coreModule } = baseInfoManagementConfig.fundAchieveNote;

const { Option } = Select;

const NewOne = (props)=>{
  const { form: {getFieldDecorator, setFieldsValue},cancel, showMode, itemData, okCallback } = props;
  const {fid, fproName, fproCode, fanno} = itemData;

  const [optionsData, setOptionsData] = useState([]);
  const [fproNameLabel, setFproNameLabel] = useState('');

  useEffect(()=>{
    let fproCodeComputed = '';
    if(fid){
      fproCodeComputed = fproCode + '-' + fproName;
    }
    setFieldsValue({fanno: fanno, fproCode:{ key:fproCodeComputed, label: fanno}});
    if(!optionsData.length){
      getOptions();
    }
    if(!fproNameLabel){
      setFproNameLabel(fproName);
    }
  }, [itemData, showMode]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          coreModule,
          listModule: [
            coreModule
          ],
          ignoreTable: []
        };

        data[coreModule] = {
            fproName: values.fproCode.label,
              fanno: values.fanno,
              fproCode: values.fproCode.key,
        };

        if(fid){
          data.id = fid;
        }

        addRpFundAnno(data).then((res)=>{
          if(res?.status === 200){
            okCallback();
          }
        });
      }
    });
  };

  const handleSelectChange = value => {
    setFieldsValue({
      fproCode: value.key,
    });
    setFproNameLabel(value.label);
  };

  const handleCancel = ()=>{
    cancel(true);
  }

  const getOptions = ()=>{
    //
    const data = {
        viewId: "yss3FEEF95F8CA3333FC9D22C4E5733345F",
        queryParams: [],
        authStationAndUsers: []
      }
    addPageOptionsData(data).then((res)=>{
      if(res?.status === 200){
        setOptionsData(res.data.rows);
      }
    });
  }

  const optionSet = {
    key: 'yss3FEEF95F8CA3333FC9D22C4E5733345F丿proCode',
    label:'yss3FEEF95F8CA3333FC9D22C4E5733345F丿proName'
  };

  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onSubmit={handleSubmit}>
      <Form.Item label="产品名称">
        {getFieldDecorator('fproCode', {
          rules: [{ required: true, message: '基金业绩注解不得为空!' }],
        })(
          <Select
            disabled={!showMode || !!fid}
            placeholder="请选择"
            labelInValue
            onChange={handleSelectChange}
          >
            {optionsData.map((item)=> (<Option value={item[optionSet.key]}>{item[optionSet.label]}</Option>))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="基金业绩注解">
        {getFieldDecorator('fanno', {
          rules: [{ required: true, message: '基金业绩注解不得为空!' }],
        })(<Input.TextArea disabled={!showMode} autoSize />)}
      </Form.Item>

      { showMode ? (<div style={{textAlign:'right'}}>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
        <Button style={{marginLeft: 10}} type="primary" onClick={handleCancel}>
          取消
        </Button>
      </div>) : ''}
    </Form>
  )
}

 const AddNewForm =  Form.create({})(NewOne);
export default AddNewForm;

import React, {useEffect, useState} from "react";
import { Button, Input, Form, Select, Row, Col, Radio, DatePicker, ConfigProvider } from 'antd';
import { PageContainers } from '@/components';
import styles from './baseForm.less'

import OperationMenu from "@/components/OperationMenu";

import {
  addNewPreData,
  addPageOptionsData,
  addRpFundAnno, submitNewProcess,
} from "@/services/processRelate";
import { router } from 'umi';
import moment from "moment";

const aPreKey = 'yssF5E7DAB365DBBA096331DED5C47F0381'; // 托管人view
const bPreKey = 'yss4A5EE172F340EB6DC3E5551F0848B9A0'; // 产品 view
const cPreKey = 'yssEA029FBE17CE69594F6F28682D1CB529'; // 标签 view
const coreModule = 'TContractBusinessArchive';

// const { coreModule } = baseInfoManagementConfig.fundAchieveNote;

const { Option } = Select;

const NewOne = (props)=>{
  const { form: { getFieldDecorator, setFieldsValue, resetFields}, nodeInfo, processId, createStatus, style, coreModule } = props;

  const [optionsAgentData, setOptionsAgentData] = useState([]);// 代理人 options
  const [agent, setAgent] = useState([]); // 代理人

  const [optionsData, setOptionsData] = useState([]);// 产品 options
  const [product, setProduct] = useState([]); // 产品


  const [useTemplate, setUseTemplate] = useState('0');//

  const [type, setType] = useState('none');


  // 获取托管人
  const getOptionData = (queryParams, options)=>{
    const { viewId, callBack } = options;
    const data = {
      viewId,
      queryParams: [],
      authStationAndUsers: []
    };
    if(queryParams){
      const paramsArray = queryParams instanceof Array ? queryParams : [queryParams];
      data.queryParams = data.queryParams.concat(paramsArray);
    }

    addPageOptionsData(data).then((res)=>{
      if(res?.status === 200){
        callBack(res.data.rows)
      }
    });
  };

  useEffect(() => {
    const coreModule = nodeInfo.formData['coreModule'];
    const coreModuleData = nodeInfo.formData[coreModule];
    const formData = {
      custodian: coreModuleData?.custodian,
      disclosureDate: moment(coreModuleData?.disclosureDate),
      expiryDate: moment(coreModuleData?.expiryDate),
      financialDate: moment(coreModuleData?.financialDate),
      proCode: coreModuleData?.proCode,
      yesOrNo: coreModuleData?.yesOrNo
      // 导入招募书
    };
    if ( coreModuleData?.proCode?.length) {
        resetFields();
        setFieldsValue(formData);
    }
  }, [nodeInfo]);

  useEffect(()=>{
    // 获取托管人列表
    if(!optionsAgentData.length){
      getOptionData(null, {viewId: aPreKey, callBack: setOptionsAgentData});
    }
    if(!optionsData.length){
      getOptionData(null, {viewId: bPreKey, callBack: setOptionsData});
    }
  }, []);

  useEffect(()=>{
    // 获取产品列表
    const agentData = agent ? agent.toString() : '' ;
    getOptionData({
      type: 0,
      code: "id",
      required: 1,
      value: agentData  // 对应代理人值
    }, {viewId: bPreKey, callBack: setOptionsData});
  }, [agent]);

  useEffect(()=>{
    // 获取标签列表
    const productData = product ? product.toString() : '' ;
    const queryParams = [
      {
        type: 0,
        code: "type",
        required: 0,
        value: type
      },
      {
        type: 0,
        code: "proCodeList",
        required: 0,
        value: productData
      },
      {
        type: 0,
        code: "useTemplate",
        required: 0,
        value: useTemplate
      }
    ]
    if(productData){
      getOptionData(queryParams, {viewId: cPreKey, callBack: ()=>{}});
    }
  }, [product]);

  useEffect(()=>{
  }, [createStatus]);


  const handleSubmit = e => {
      e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          id: '',
          coreModule,
          listModule: [''],
          ignoreTable: [''],
          currentNode: 'chief', // 发起者？
          fileData: '',
          type: 'none',
        };
        //           updateType: '1', // 1 临时更新 0，全部更新
        data.updateType = createStatus === 'all' ? '0' : '1';
        data[coreModule] = {...values,
          disclosureDate: values.disclosureDate.format('yyyy-MM-DD'),
          expiryDate: values.expiryDate.format('yyyy-MM-DD'),
          financialDate: values.financialDate.format('yyyy-MM-DD'),
        };
        data[coreModule].yesOrNo = '0'; // 未知参数


        // TContractBusinessArchive: {
        //   "custodian": ["20221130092435779996"],
        //   "proCode": ["002550"],
        //   "type": "none",
        //   "useTemplate": "0",
        //   "financialDate": "2022-12-08",
        //   "expiryDate": "2022-12-09",
        //   "disclosureDate": "2022-12-10",
        //   "directoryNames": ["填充-产品名称","更新"], // 居然拿的label
        //   "yesOrNo": "0" // 未知参数
        // };


        submitNewProcess(data).then((res)=>{
          if(res?.status === 200){
            router.push('/processFlow/list');
          }
        });
      }
    });
  };
  const handleSelectChange = value => {
    setAgent(value);
  };

  const selectProduct = value =>{
    setProduct(value);
  };

  // 获取托管人的option
  const agentSet = {
    key: `${aPreKey}丿id`,
    label:`${aPreKey}丿orgName`
  };

  // 获取产品名称的，注意key
  const optionSet = {
    key: `${bPreKey}丿proCode`,
    label:`${bPreKey}丿proName`
  };



  return (
    <div className={styles.baseForm} style={{...style}}>
        <Form id="formData" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={handleSubmit}>
          <Row gutter={[0, 0]}>
            {type === 'none' ? (<Col xxl={8} xl={12} lg={12}>
              <Form.Item label="托管人">
                {getFieldDecorator('custodian', {
                  initialValue: []
                })(
                  <Select
                    disabled={true}
                    placeholder="请选择"
                    mode="multiple"
                    maxTagCount={1}
                    onChange={handleSelectChange}
                  >
                    {optionsAgentData.map((item)=> (<Option key={item[agentSet.key]} value={item[agentSet.key]}>{item[agentSet.label]}</Option>))}
                  </Select>,
                )}
              </Form.Item>
            </Col>) : ''}
            {type === 'none' ? (<Col xxl={8} xl={12} lg={12}>
              <Form.Item label="产品名称">
                {getFieldDecorator('proCode', {
                  rules: [],
                })(
                  <Select
                    disabled={true}
                    placeholder="请选择"
                    mode="multiple"
                    maxTagCount={1}
                    onChange={selectProduct}
                  >
                    {optionsData.map((item)=> (<Option key={item[optionSet.key]} value={item[optionSet.key]}>{item[optionSet.label]}</Option>))}
                  </Select>,
                )}
              </Form.Item>
            </Col>) : ''}
            <Col xxl={8} xl={12} lg={12}>
              <Form.Item label="财务日期">
                {getFieldDecorator('financialDate', {
                  rules: [],
                })(
                  <DatePicker  disabled={true} style={{width: '100%'}}>
                  </DatePicker>,
                )}
              </Form.Item>
            </Col>
            <Col xxl={8} xl={12} lg={12}>
              <Form.Item label="截至日期">
                {getFieldDecorator('expiryDate', {
                  rules: [],
                })(
                  <DatePicker disabled={true} style={{width: '100%'}}>
                  </DatePicker>,
                )}
              </Form.Item>
            </Col>
            <Col xxl={8} xl={12} lg={12}>
              <Form.Item label="披露日期">
                {getFieldDecorator('disclosureDate', {
                  rules: [],
                })(
                  <DatePicker disabled={true} style={{width: '100%'}}>
                  </DatePicker>,
                )}
              </Form.Item>
            </Col>
            <Col xxl={8} xl={12} lg={12}>
              <Form.Item label="导入招募书">
                {getFieldDecorator('yesOrNo', {})(
                  <Radio.Group disabled={true} >
                    <Radio value={'1'}>是</Radio>
                    <Radio value={'0'}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
    </div>
  )
}

export default Form.create()(NewOne);

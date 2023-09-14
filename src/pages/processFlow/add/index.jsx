import React, {useEffect, useState} from "react";
import {Button, Col, ConfigProvider, DatePicker, Form, Radio, Row, Select} from 'antd';
import {PageContainers} from '@/components';
import styles from './index.less'

import {addPageOptionsData,} from "@/services/processRelate";
import {connect} from "dva";
import {router} from 'umi';
import SelectForAnt3 from "@/components/SelectForAnt3";

const aPreKey = 'yssF5E7DAB365DBBA096331DED5C47F0381'; // 托管人view
const bPreKey = 'yss4A5EE172F340EB6DC3E5551F0848B9A0'; // 产品 view
const cPreKey = 'yssEA029FBE17CE69594F6F28682D1CB529'; // 标签 view
const coreModule = 'TContractBusinessArchive';

const {Option} = Select;

const NewOne = (props) => {
  const {
    dispatch,
    form: {getFieldDecorator, setFieldsValue, getFieldsValue, resetFields},
    createStatus
  } = props;

  const [optionsAgentData, setOptionsAgentData] = useState([]);// 代理人 options
  const [agent, setAgent] = useState([]); // 代理人

  const [optionsData, setOptionsData] = useState([]);// 产品 options
  const [product, setProduct] = useState([]); // 产品

  const [tagsOption, setTagsOption] = useState([]);// 标签
  const [tag, setTag] = useState([]);// 标签
  const [normalTag, setNormalTag] = useState([]);// 默认标签

  const [useTemplate, setUseTemplate] = useState('0');//

  const [type, setType] = useState('none');

  const [loading, setLoadingStatus] = useState(false);

  // 获取托管人
  const getOptionData = (queryParams, options) => {
    const {viewId, callBack} = options;
    const data = {
      viewId,
      queryParams: [],
      authStationAndUsers: []
    };
    if (queryParams) {
      const paramsArray = queryParams instanceof Array ? queryParams : [queryParams];
      data.queryParams = data.queryParams.concat(paramsArray);
    }
    const productData = product ? product.toString() : '';
    const arr = [];
    addPageOptionsData(data).then((res) => {
      if (res?.status === 200) {
        callBack(res.data.rows);
        if (productData && createStatus === 'tmp') {
          res.data.rows.forEach(item => {
            normalTag.forEach(ele => {
              if (item[`${cPreKey}丿directoryName`] == ele.label) {
                arr.push(ele)
              }
            })
          });
          setTag(arr.map(item => item.label));
          setFieldsValue({
            directoryNames: arr
          })
        }
      }
    });
  };
  //获取默认标签
  const getAutoTags = () => {
    return new Promise((resolve, reject)=>fetch(`/ams/ams-base-parameter/datadict/queryInfoTest?fcode=tagSelection`).then(resp => {
      resp.json().then((response) => {
        const data = response.data;
        resolve(data);
      });
    }).catch(()=> message.error('获取办理人标签列表失败')));
  }

  //自动获取默认标签
  useEffect(() => {
    if (createStatus == 'tmp') {
      getAutoTags().then(res => {
        const arr = [];
        res.forEach(item => {
          item[`${cPreKey}丿directoryName`] = item.code;
          arr.push({key:item.code, label: item.code})
        })
        setTagsOption(res)
        setTag(arr.map(item => item.label));
        setNormalTag(arr);
        setFieldsValue({
          directoryNames: arr
        })
      })
    }
  },[])
  useEffect(() => {
    // 获取托管人列表
    if (!optionsAgentData.length) {
      getOptionData(null, {viewId: aPreKey, callBack: setOptionsAgentData});
    }
    if (!optionsData.length) {
      getOptionData(null, {viewId: bPreKey, callBack: setOptionsData});
    }
  }, []);

  useEffect(() => {
    // 获取产品列表
    const agentData = agent ? agent.toString() : '';
    getOptionData({
      type: 0,
      code: "id",
      required: 1,
      value: agentData  // 对应代理人值
    }, {viewId: bPreKey, callBack: setOptionsData});
  }, [agent]);

  useEffect(() => {
    // 获取标签列表
    const productData = product ? product.toString() : '';
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
    if (productData && createStatus === 'tmp') {
      getOptionData(queryParams, {viewId: cPreKey, callBack: setTagsOption});
    }
  }, [product]);

  useEffect(() => {
  }, [createStatus]);


  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        setLoadingStatus(true);
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
        data[coreModule] = {
          ...values,
          disclosureDate: values.disclosureDate.format('yyyy-MM-DD'),
          expiryDate: values.expiryDate.format('yyyy-MM-DD'),
          financialDate: values.financialDate.format('yyyy-MM-DD'),
        };
        data[coreModule].yesOrNo = '0'; // 未知参数
        data[coreModule].directoryNames = tag; // 标签要求只要label

        dispatch({
          type: 'processNode/createProcess',
          payload: data,
          cb: ()=>{ setLoadingStatus(false);}
        });
      }
    });
  };

  const handleSelectChange = value => {
    setAgent(value);
  };

  const selectProduct = value => {
    const proCode = value.map((item)=>item.key).toString();
    props.form.setFieldsValue({ proCode });
    setProduct(value.map((item)=>item.key).toString());
  };

  const radioChange = (event) => {
    const value = event.target.value;
    setType(value);
    if (value === 'all') {
      setAgent('');
      setProduct('');
      resetFields(['custodian', 'proCode']); // 重置表单数据
    }
  };

  const tmpRadioChange = event => {
    setUseTemplate(event.target.value);
  };

  const handleTagsChange = (arr) => {
    setTag(arr.map((item) => item.label));
  }

  // 获取托管人的option
  const agentSet = {
    key: `${aPreKey}丿id`,
    label: `${aPreKey}丿orgName`
  };

  // 获取产品名称的，注意key
  const optionSet = {
    key: `${bPreKey}丿proCode`,
    label: `${bPreKey}丿proName`
  };

  const tagsSet = {
    key: `${cPreKey}丿orgId`,
    label: `${cPreKey}丿directoryName`
  };

  const submitCallBack = (e) => {
    e && e.preventDefault();

    handleSubmit(e);
  };
  const cancelCallBack = () => {
    router.goBack();
  };


  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <PageContainers
        fuzz={<span></span>}
        filter={<span></span>}
        breadcrumb={[
          {
            title: '招募说明书',
            url: '',
          },
          {
            title: '招募说明书办理-新建',
            url: '',
          },
        ]}
      >
        <div className={styles.processAdd}>
          <Row style={{padding: '15px 30px 10px 30px'}}>
            <Col span={12}>
              <div style={{fontSize: 15, lineHeight: '32px', fontWeight: 600}}>招募说明书-{location.href.includes('addAll')? '全部更新': '临时更新'}</div>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button htmlType="submit" loading={loading} onClick={(e) => submitCallBack(e)}>
                提交</Button>
              <Button style={{marginLeft: 10}} onClick={cancelCallBack}>取消</Button>
            </Col>
          </Row>
          <Form id="formData" labelCol={{span: 6}} wrapperCol={{span: 16}} onSubmit={handleSubmit}>
            <Row gutter={[0, 0]}>
              {type === 'none' ? (<Col xxl={12} xl={12} lg={12}>
                <Form.Item label="托管人">
                  {getFieldDecorator('custodian', {
                    initialValue: []
                  })(
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      maxTagCount={1}
                      allowClear={true}
                      onChange={handleSelectChange}
                    >
                      {optionsAgentData.map((item) => (
                        <Option value={item[agentSet.key]}>{item[agentSet.label]}</Option>))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>) : ''}
              {type === 'none' ? (<Col xxl={12} xl={12} lg={12}>
                <Form.Item label="产品名称">
                  {getFieldDecorator('proCode', {
                    rules: [{required: true, message: '产品名称不得为空'}],
                  })(
                    // <Select
                    //   placeholder="请选择"
                    //   mode="multiple"
                    //   maxTagCount={1}
                    //   onChange={selectProduct}
                    // >
                    //   {optionsData.map((item) => (
                    //     <Option key={item[optionSet.key]} value={item[optionSet.key]}>{item[optionSet.label]}</Option>))}
                    // </Select>
                    <SelectForAnt3
                      selectConfig={{
                        mode: "multiple",
                        labelInValue: true,
                        placeholder: "请选择",
                        maxTagCount: 1,
                        maxTagTextLength: 15,
                        allowClear: true,
                        optionFilterProp: 'children',
                        onChange: selectProduct,
                      }}
                      labelKey={optionSet.label}
                      valueKey={optionSet.key}
                      symbolKey={optionSet.key}
                      data={optionsData}
                    />
                    ,
                  )}
                </Form.Item>


              </Col>) : ''}
              <Col xxl={12} xl={12} lg={12}>
                <Form.Item label="是否全选产品">
                  {getFieldDecorator('type', {
                    rules: [{required: true, message: ''}],
                    initialValue: 'none'
                  })(
                    <Radio.Group onChange={radioChange}>
                      <Radio value={'all'}>是</Radio>
                      <Radio value={'none'}>否</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12}>
                <Form.Item label="是否优先使用模板">
                  {getFieldDecorator('useTemplate', {
                    rules: [{required: true, message: ''}],
                    initialValue: '0'
                  })(
                    <Radio.Group onChane={tmpRadioChange}>
                      <Radio value={'1'}>是</Radio>
                      <Radio value={'0'}>否</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12}>
                <Form.Item label="财务日期">
                  {getFieldDecorator('financialDate', {
                    rules: [{required: true, message: '财务日期不得为空'}],
                  })(
                    <DatePicker style={{width: '100%'}} />,
                  )}
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12}>
                <Form.Item label="截至日期">
                  {getFieldDecorator('expiryDate', {
                    rules: [{required: true, message: '截止日期不得为空'}],
                  })(
                    <DatePicker style={{width: '100%'}} />,
                  )}
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12}>
                <Form.Item label="披露日期">
                  {getFieldDecorator('disclosureDate', {
                    rules: [{required: true, message: '披露日期不得为空'}],
                  })(
                    <DatePicker style={{width: '100%'}} />,
                  )}
                </Form.Item>
              </Col>
              {createStatus === 'tmp' ? (<Col xxl={12} xl={12} lg={12}>
                <Form.Item label="标签选择">
                  {getFieldDecorator('directoryNames', {
                    rules: [{required: true, message: '标签不得为空'}],
                  })(
                    <Select
                      showSearch
                      placeholder="请选择"
                      mode="multiple"
                      labelInValue
                      maxTagCount={1}
                      optionFilterProp="children"
                      onChange={handleTagsChange}
                    >
                      {tagsOption.map((item) => (<Option value={item[tagsSet.label]}>{item[tagsSet.label]}</Option>))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>) : ''}
            </Row>
          </Form>
        </div>
      </PageContainers>
    </ConfigProvider>
  )
}

const add = state => {
  const {
    dispatch,
    processListModels,
    processNode,
    loading
  } = state;

  return {
    dispatch,
    processId: processListModels.processInfo.processId, // 该项新建中不需要由store带出
    createStatus: processNode.createStatus, // 该项新建中不需要由
    submitting: loading.effects['processNode/createProcess'],
  };
};
export default connect(add)(Form.create()(NewOne));

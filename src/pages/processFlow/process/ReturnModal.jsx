import React, {useEffect, useState} from "react";
import {Col, Form, message, Modal, Row, Select, Spin} from 'antd';
import {getNodeListByPositionIdList} from "@/services/processRelate";

const { Option } = Select;

const Index = (props)=>{
  const { form: { getFieldDecorator, setFieldsValue, resetFields}, returnVisible, positionIdList, onOk,onCancel, returnLoading } = props;

  const [options, setOptions] = useState([]);
  const [spinLoading, setSpinLoading] = useState(false)

  useEffect(()=>{
    if(returnVisible){
      // 请求选项节点数据
      if(!positionIdList.length){message.error('没有可退回的节点标签'); return;}
      getNodeListByPositionIdList({ positionIdList }).then((res)=>{
        if(res?.status === 200){
          const options = [];
          if(res.data){
            Object.keys(res.data).forEach(key=>{
              options.push({value: key, label: res.data[key]});
            });
          }
          setOptions(options);
        }
      });
    } else {
      resetFields();
    }
  }, [returnVisible]);

  useEffect(()=>{
    setSpinLoading(returnLoading)
  },[returnLoading]);
  
  const handleSubmit = e => {
      e && e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
      }
    });
  };
  const handleChange = value => {

  };

  return (
      <Modal
        title="任务直线退回"
        visible={returnVisible}
        onOk={() => handleSubmit()}
        onCancel={() => onCancel()}
        zIndex={1001}
        width={400}
      >
        <Spin spinning={spinLoading}>
        <Row>
          <Col md={24} sm={24}>
            <Form id="returnDataFormData" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} onSubmit={handleSubmit}>
              <Row gutter={[0, 0]}>
                <Col xxl={24} xl={24} lg={24}>
                  <Form.Item label="">
                    {getFieldDecorator('node', {
                      rules: [{ required: true, message: '没有选中节点' }],
                      initialValue: ''
                    })(
                      <Select
                        placeholder="请选择"
                        maxTagCount={1}
                        onChange={handleChange}
                      >
                        {options.map((item)=> (<Option key={item.value} value={item.value}>{item.label}</Option>))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        </Spin>
      </Modal>
  )
}

export default Form.create()(Index);

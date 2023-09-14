import React, {useEffect, useState, useContext} from "react";
import { Input, Form, Row, Col } from 'antd';

import ShowFormContext from "@/components/ShowFormsCon/ShowFormContext";

const Index = (props)=>{
  const { form: { getFieldDecorator, setFieldsValue, resetFields}, templateForms, target } = props;

  const [showMode, setShowMode] = useState(true); // 读写状态

  useEffect(()=>{
  }, [templateForms]);


  const handleSubmit = e => {
      e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {

      }
    });
  };
  const configStatus = () => {
      return templateForms.find((item) => item.formItem === target);
  };


  return (
    <div>
      { !!configStatus() ? (
        <Form id="formData" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={handleSubmit}>
          {/* 可能会不需要form，暂时先加 */}
          <ShowFormContext.Provider value={configStatus()}>
          {props.children}
          </ShowFormContext.Provider>
        </Form>
        ): <></>}
    </div>
  )
}

export default Form.create()(Index);

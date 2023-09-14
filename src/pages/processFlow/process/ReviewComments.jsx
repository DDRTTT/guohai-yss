import React, {useEffect, useState, useContext} from "react";
import { Input, Form, Row, Col } from 'antd';

import ShowFormContext from "@/components/ShowFormsCon/ShowFormContext";

const Index = (props)=>{
  const { form: { getFieldDecorator, setFieldsValue, resetFields}, createStatus, context } = props;

  const { editable } = useContext(ShowFormContext);
  const [useTemplate, setUseTemplate] = useState('');//

  useEffect(()=>{
  }, [createStatus]);


  const handleSubmit = e => {
      e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {

      }
    });
  };
  const handleChange = value => {

  };


  return (
    <div>
        <Form id="formData" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onSubmit={handleSubmit}>
          <Row gutter={[0, 0]}>
            <Col xxl={8} xl={12} lg={12}>
              <Form.Item label="检查审核意见">
                {getFieldDecorator('jianchajiheyijian', {
                  initialValue: '已办理'
                })(
                  <Input.TextArea
                    disabled={editable !== 1}
                    placeholder="请选择"
                    onChange={handleChange}
                  >
                  </Input.TextArea>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
    </div>
  )
}

export default Form.create()(Index);

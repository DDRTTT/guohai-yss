import React, { useImperativeHandle, forwardRef } from 'react';
import { Col, Input, Row, Form, Icon } from 'antd';

const { Search } = Input;
const FuzzySearch = forwardRef(
  (
    {
      props: {
        form: { getFieldDecorator, resetFields },
        initParams,
      },
      handleToggle,
      handleGetTableData,
    },
    ref,
  ) => {
    // 模糊搜索
    const handleBlurSearch = keyWords => {
      handleGetTableData({
        ...initParams,
        keyWords,
      });
    };
    // 重置
    const handleReset = () => {
      resetFields();
    };
    // 暴露子组件方法
    useImperativeHandle(ref, () => ({
      handleReset,
    }));

    return (
      <Form>
        <Row>
          <Col style={{ textAlign: 'right', marginBottom: '24px' }}>
            {getFieldDecorator('keyWords')(
              <Search
                placeholder="请输入文档名称"
                onSearch={handleBlurSearch}
                style={{
                  width: 300,
                  marginRight: 23,
                  height: 32,
                }}
              />,
            )}
            <a type="text" onClick={handleToggle}>
              展开搜索
              <Icon type="down" />
            </a>
          </Col>
        </Row>
      </Form>
    );
  },
);

export default FuzzySearch;

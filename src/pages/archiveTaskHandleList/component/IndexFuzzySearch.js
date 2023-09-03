import React, { useImperativeHandle, forwardRef } from 'react';
import { Breadcrumb, Col, Input, Row, Form, Icon, Button } from 'antd';

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
        keyWords: keyWords.replace(/\s/g, ''),
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
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>底稿项目管理</Breadcrumb.Item>
              <Breadcrumb.Item>项目任务管理</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col>
            {getFieldDecorator('keyWords')(
              <Search
                placeholder={`请输入${initParams.type ? '项目' : '系列'}名称`}
                onSearch={handleBlurSearch}
                style={{
                  width: 210,
                  marginRight: 23,
                  height: 32,
                }}
              />,
            )}
            <Button onClick={handleToggle} type="link">
              展开搜索
              <Icon type="down" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  },
);

export default FuzzySearch;

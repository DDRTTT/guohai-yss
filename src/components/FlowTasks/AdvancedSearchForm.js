import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import styles from './style.less';

const { Option } = Select;
/**
 * 方法说明 高级搜索
 * @method AdvancedSearchForm
 * @params prop {
 *  fields:父组件传来的表单item
 *  form:{
 *    getFieldDecorator,
 *    getFieldError,
 *    resetFields,
 *    getFieldsValue,
 *    submit
 *  ...
 * }}
 *  */
const AdvancedSearchForm = ({ form, fields, initData, formLayout }) => {
  // 函数内部属性
  const { getFieldDecorator, resetFields, validateFields } = form;
  const [expand, setExpand] = useState(false);

  // Form的布局问题
  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        }
      : null;
  /** 方法说明 查询
   *@method handleSearch 查询
   */
  const handleSearch = e => {
    e.preventDefault();
    validateFields((err, values) => {
      Object.keys(values).map(key =>
        values[key] === undefined ? (values[key] = '') : values[key],
      );
      initData('formChange', values);
    });
  };
  /**
   * 方法说明   高级搜索的展开收起
   * @method handleExpand
   * @param {*} e
   */
  const handlleExpand = e => {
    e.preventDefault();
    setExpand(!expand);
    resetFields();
    initData('expandChange');
  };
  return (
    <div className={styles.mainContent}>
      <Form onSubmit={handleSearch} layout={formLayout} className={styles.advancedForm}>
        <Row gutter={24}>
          <Col>
            {expand
              ? fields.map(field => {
                  const { name, label, allowClear, mode, opt, placeholder, type, size } = field;
                  let content;
                  switch (type) {
                    case 'input':
                      content = (
                        <Col span={8} key={name}>
                          <Form.Item label={`${label}`} {...formItemLayout}>
                            {getFieldDecorator(`${name}`)(
                              <Input allowClear={allowClear} placeholder={placeholder} />,
                            )}
                          </Form.Item>
                        </Col>
                      );
                      break;
                    case 'select':
                      content = (
                        <Col span={8} key={name}>
                          <Form.Item label={`${label}`} {...formItemLayout}>
                            {getFieldDecorator(`${name}`)(
                              <Select
                                size={size || 'default'}
                                mode={mode}
                                showArrow="false"
                                placeholder={placeholder}
                              >
                                {opt &&
                                  opt.map(item => <Option key={item.code}>{item.name}</Option>)}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      );
                      break;
                    default:
                      content = (
                        <Col span={8} key={name}>
                          <Form.Item label={`${label}`} {...formItemLayout}>
                            {getFieldDecorator(`${name}`)(
                              <Input allowClear={allowClear} placeholder={placeholder} />,
                            )}
                          </Form.Item>
                        </Col>
                      );
                  }
                  return content;
                })
              : ''}
          </Col>
          <Col>
            {expand ? (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => resetFields()}>
                  重置
                </Button>
              </Form.Item>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={22}>
            {!expand ? (
              <Form.Item>
                {getFieldDecorator(
                  `keyWords`,
                  {},
                )(
                  <Input
                    allowClear
                    style={{ height: 32, width: 250, float: 'right', marginRight: -60 }}
                    placeholder="请输入产品全称或产品代码"
                  />,
                )}
              </Form.Item>
            ) : (
              ''
            )}
          </Col>
          <Col span={2} style={{ textAlign: 'right' }}>
            <Button
              style={{
                marginLeft: -30, fontSize: 12, lineHeight: 12
              }}
              onClick={() => {handlleExpand}}
              type="link">{expand ? '收起' : '展开搜索'}<Icon type={expand ? 'up' : 'down'} />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

export default WrappedAdvancedSearchForm;

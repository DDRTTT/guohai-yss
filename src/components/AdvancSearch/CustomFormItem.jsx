import React from 'react';
import {
  AutoComplete,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 自定义输入框组件 可以根据type的类型返回不同的输入框
/**
 *
 * @param {string} name formItem的名字
 * @param {string} label formItem的label
 * @param {string} type formItem的类型
 * @param {object} config 控件的属性配置 可以配置一些自定义属性和回调
 * @param {array} rules 控件的校验规则
 * @param {array} option 下拉框的下拉列表 类型为下拉的时候需要填写 默认格式{name:'xxx',code:'xxx'}
 * @param {object} readSet 自定义读取option属性的key 例子:{ name: 'proName', code: 'proCode', bracket?: 'proCode' },bracket是name后面括号里的内容
 * @param {boolean} unRender 是否渲染
 */
const CustomInputItem = (data, loginId) => {
  const { config = {} } = data;
  let child;
  switch (data.type && typeof data.type === 'string' && data.type.toLowerCase()) {
    case 'select':
      if (!data.option) {
        child = (
          <Select
            allowClear
            showSearch
            showArrow
            optionFilterProp="children"
            placeholder="请选择"
            maxTagCount={1}
            disabled={loginId !== '1' && data.name === 'orgId' ? true : false}// 产品要素库需求变更：查询时，非管理员登录，归属机构默认为登录时所属的归属机构，不可编辑
            {...config}
          />
        );
      } else {
        // 设置默认值  默认绑定的字段是 name和code
        const { readSet = { name: 'name', code: 'code' } } = data;
        child = (
          <Select
            allowClear
            showSearch
            showArrow
            optionFilterProp="children"
            placeholder="请选择"
            maxTagCount={1}
            disabled={loginId !== '1' && data.name === 'orgId' ? true : false}// 产品要素库需求变更：查询时，非管理员登录，归属机构默认为登录时所属的归属机构，不可编辑
            {...config}
          >
            {data &&
            Array.isArray(data?.option)&&
              data.option.map((item, index) => {
                const isObj = Object.prototype.toString.call(item) === '[object Object]';
                return (
                  <Select.Option
                    key={`${isObj ? item[readSet.code] : item}`}
                    value={`${isObj ? item[readSet.code] : item}`}
                    title={isObj
                      ? item[readSet.bracket]
                        ? `${item[readSet.name]}(${item[readSet.bracket]})` // 因为要特殊显示所以加了一个bracket属性 显示为 产品名称(产品代码)
                        : item[readSet.name]
                      : item}
                  >
                    {isObj
                      ? item[readSet.bracket]
                        ? `${item[readSet.name]}(${item[readSet.bracket]})` // 因为要特殊显示所以加了一个bracket属性 显示为 产品名称(产品代码)
                        : item[readSet.name]
                      : item}
                  </Select.Option>
                );
              })}
          </Select>
        );
      }
      break;
    case 'datepicker':
      child = <DatePicker placeholder="请选择日期" allowClear {...config}  style={{width:"100%"}}/>;
      break;
    case 'rangepicker':
      child = <RangePicker placeholder="请选择日期" allowClear {...config} />;
      break;
    case 'timepicker':
      child = <TimePicker placeholder="请选择时间" allowClear {...config} />;
      break;
    case 'radio':
      const { readSet = { name: 'name', code: 'code' } } = data;
      child = (
        <Radio.Group {...config}>
          {data.option.map((item, index) => {
            const isObj = Object.prototype.toString.call(item) === '[object Object]';
            return (
              <Radio key={index} value={isObj ? item[readSet.code] : item}>
                {isObj ? item[readSet.name] : item}
              </Radio>
            );
          })}
        </Radio.Group>
      );
      break;
    case 'checkbox':
      const { readSet: readB = { name: 'name', code: 'code' } } = data;
      child = (
        <Checkbox.Group {...config}>
          {data.option.map((item, index) => {
            const isObj = Object.prototype.toString.call(item) === '[object Object]';
            return (
              <Checkbox key={index} value={isObj ? item[readB.code] : item}>
                {isObj ? item[readB.name] : item}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      );
      break;
    case 'area':
      child = <TextArea allowClear placeholder="请输入" {...config} autoSize={{ minRows: 2 }} />;
      break;
    case 'treeselect':
      child = <TreeSelect placeholder="请选择" {...config} />;
      break;
    case 'switch':
      child = <Switch {...config} />;
      break;
    case 'autocomplete':
      child = <AutoComplete {...config} placeholder="请输入" />;
      break;

    default:
      child = <Input allowClear placeholder="请输入" {...config} />;
      break;
  }
  return child;
};
// 自定义formItem组件
/**
 *
 * @param {array} formItemList  formItem的数组
 * @param {array} form form的实例
 *
 * @分割线--- (以下为formItemList数组里的配置,不属于当前组件)
 * @param {string} name formItem的名字
 * @param {string} label formItem的label
 * @param {string} type formItem的类型
 * @param {object} config 控件的属性配置 可以配置一些自定义属性和回调
 * @param {array} rules 控件的校验规则
 * @param {array} option 下拉框的下拉列表 类型为下拉的时候需要填写 默认格式{name:'xxx',code:'xxx'}
 * @param {object} readSet 自定义读取option属性的key 例子:{ name: 'proName', code: 'proCode', bracket?: 'proCode' },bracket是name后面括号里的内容
 * @param {boolean} unRender 是否不渲染 默认是false
 * @param {Element} extra 额外的组建
 */

const CustomFormItem = props => {
  const { getFieldDecorator } = props.form;
  const { loginId } = props;
  return props.formItemList.map((item,index) => {
    const { rules = [], initialValue, otherConfig = {}, extra } = item;
    // console.log("打印下组件接受的东西--------------------")
    // console.log(item)
    return !item.unRender ? (
      <Col
        span={item.width || 6}
        key={item.name}
        pull={item.pull}
        offset={item.offset}
        style={item.style}
        className=  {`"cust-col" ${item.className}`}
        // className={"cust-col"}
      >
        <Form.Item
          name={item.name}
          // labelCol={item.labelCol || { span: 7 }}
          // wrapperCol={item.wrapperCol || { span: 17 }}
          required={item.required}
          label={item.label}
          {...item.formItemConfig}
        >
          {getFieldDecorator(item.name, {
            rules,
            initialValue,
            ...otherConfig,
          })(CustomInputItem(item, loginId))}
          {extra && extra}
        </Form.Item>
      </Col>
    ) : (
      ''
    );
  });
};

export default CustomFormItem;

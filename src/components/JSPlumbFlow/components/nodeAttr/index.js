import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import { cloneDeep } from 'lodash';

const NodeAttr = props => {
  /**
   * @param key: 属性代码
   * @param name：属性名称
   * @param roperties：属性控件类型：0：下拉，1：文本，2：时间
   * @param precision：精度
   * @param defaultValue: 默认值
   * @param uri：取值地址
   * @param refCode：请求映射属性代码
   * @param refName：请求映射属性名称
   * @param order：属性排序
   */
  const { nodeAttrMsg, attrData } = props;
  const temp = cloneDeep(nodeAttrMsg);
  temp.forEach(element => {
    for (const i in attrData) {
      if (element.key === i) {
        element.data = attrData[i];
      }
    }
  });
  const attr = temp.map((item, index) => {
    let child;
    if (item.properties == '0') {
      child = (
        <Select>
          <Option value="lucy">Lucy</Option>
        </Select>
      );
    } else if (item.properties == '1') {
      child = <Input value={item.data} disabled />;
    } else if (item.properties == '2') {
    }
    return (
      <div className="right-types-item" key={index}>
        {item.name}
        {child}
      </div>
    );
  });

  return attr;
};

export default NodeAttr;

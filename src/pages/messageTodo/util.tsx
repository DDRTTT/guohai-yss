import React from 'react';
import { OptionProps } from 'antd/es/select';

/**
 * 根据data循环生成select的option
 * @param {any[]} data 原始数据
 * @param {ReactNode} Com option组件
 * @param {()=>void} changeHandle onChange方法
 * @param {string} key key值
 * @param {string} value value值
 * @param {string} name 显示name值
 */
export const handleMapSelectOption = (
  data: any[],
  Com: React.ClassicComponentClass<OptionProps>,
  changeHandle?: () => any,
  key = 'code',
  value = 'code',
  name = 'name',
): React.ReactNode => {
  if (data && data.length !== 0 && Array.isArray(data)) {
    return data.map(i => {
      return (
        // @ts-ignore
        <Com key={i[key]} value={i[value]} onChange={changeHandle}>
          {i[name]}
        </Com>
      );
    });
  }
  return [];
};

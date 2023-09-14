/**
 * 封装 antd4.x 的 TreeSelect
 * 使用的地方可以直接使用 TreeSelectV4，不再需要引入各种 antd4.x 的依赖
 */
import * as React from 'react'
import { ConfigProvider, TreeSelect } from 'antd4';
import zhCN from 'antd4/es/locale/zh_CN';
import 'antd4/dist/antd.less';
// import './style.scss'

export default class TreeSelectV4 extends React.Component {
  render () {
    return (
      <ConfigProvider locale={zhCN} prefixCls="ant-v4">
        <TreeSelect {...this.props} />
      </ConfigProvider>
    )
  }
}

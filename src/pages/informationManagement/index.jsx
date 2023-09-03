/**
 * 菜单名(开发时改成相应的菜单名)
 */
import React, { Component } from 'react';
import { Form } from 'antd';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';

@Form.create()
class Index extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return <div>xxx菜单内容</div>;
  }
}

const WrappedIndex = errorBoundary(Form.create()(connect(({ loading }) => ({}))(Index)));

export default WrappedIndex;

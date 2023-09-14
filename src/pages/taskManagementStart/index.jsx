/**
 * 项目任务发起(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';

import router from 'umi/router';

import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action, { linkHoc } from '@/utils/hocUtil';

import style from './index.less';
import OrderForm from '../../components/projectManagement/orderForm';

const { TextArea } = Input;
const { Option } = Select;
@Form.create()
class Index extends Component {
  state = {
    queryDate: '',
    disabled: false,
    type: -1,
    id: '',
  };

  componentWillMount() {
    // 点击编辑后获取到的数据
    if (document.getElementsByClassName('ant-layout')) {
      document.getElementsByClassName('ant-layout')[2].scrollTop = 0;
    }

    const date = this.props.location.query;
    if (date) {
      this.props.dispatch({
        type: 'taskManagement/getDetail',
        payload: date.id,
        callback: res => {
          this.setState({
            queryDate: res,
          });
        },
      });
      this.setState({
        disabled: Number(date.type) === 0,
        type: date.type,
        id: date.id,
      });
    }
  }

  render() {
    const { disabled, queryDate, type, id } = this.state;
    return <OrderForm dis={disabled} queryDate={queryDate} type={type} id={id} />;
  }
}

const WrappedIndex = errorBoundary(Form.create()(connect(({ loading }) => ({}))(Index)));

export default WrappedIndex;

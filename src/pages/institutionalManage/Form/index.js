import React, {memo, useEffect, useState,useRef} from 'react';
import {Layout, Button, Col, Form, Icon, message, Modal, Row, Select, Input, Table, Tooltip, Tag} from 'antd';
import {connect} from 'dva';
import {errorBoundary} from '@/layouts/ErrorBoundary'; //异常处理
import {linkHoc} from "@/utils/hocUtil";
import {
  handleClearQuickJumperValue,//解决antd 3x版本 页码分页bug
  removeSpaces //对象去空格
} from '@/pages/archiveTaskHandleList/util';
import styles from './index.less';

const Index = props => {
  let {
    dispatch,
    form: {getFieldDecorator, resetFields, validateFields},
    initParams,//目录树参
    isLeaf,//
    clickMsgData,//
    GetTableData,//父目录刷心
    handleGetSysTreeData,//左侧树刷新
    initQueryData
  }=props
}
const FormAdd = errorBoundary(
  linkHoc()(
    Form.create()(
      connect()(Index),
    ),
  ),
);
export default memo(FormAdd)

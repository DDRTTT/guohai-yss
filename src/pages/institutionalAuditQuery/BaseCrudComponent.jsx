import React, { PureComponent } from 'react';
// import { momentFormat } from '../../utils/utils';
import { Badge, Button, Icon, message, notification } from 'antd';

const ButtonGroup = Button.Group;

export default class BaseCrudComponent extends PureComponent {
  /***
   *获取选择id数据信息
   * @param selectedRows
   * @returns {Array}
   */
  getIDlist = selectedRows => {
    let fid = new Array();
    for (var key in selectedRows) {
      fid.push(selectedRows[key].fid);
    }
    return fid;
  };
  /***
   * 信息提示
   * @param title
   * @param descr
   */
  showmessage = (title, descr) => {
    notification.open({
      message: title,
      description: descr,
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
  };
  /***
   * 新增按钮（页面跳转）
   * @param url (跳转路径)
   * @param switchstatus（审核开关）
   */
  add = url => {
    location.href = `#/${url}?action=add`;
  };
  /***
   * 删除按钮
   * @param message（删除对象）
   */
  delete = fid => {
    const { dispatch, namespace } = this.props;
    let mes = '删除成功！';
    dispatch({
      type: `${namespace}/del`,
      payload: fid,
    });
    this.showmessage('成功！', mes);
  };
  /***
   * 修改按钮
   * @param url  (跳转路径)
   * @param selectedRows（选择参数）
   */
  update = (url, selectedRows) => {
    const { namespace } = this.props;
    if (selectedRows.length > 1) {
      message.warn('请选择一条数据信息进行修改', 3);
    } else {
      location.href = `#/${url}?fid=${selectedRows[0].fid}`;
    }
  };
  /***
   * 审核按钮
   * @param status（状态）
   */
  check = (status, fid) => {
    const { dispatch, namespace } = this.props;
    let fidall = {
      list: fid,
      status: status == 0 ? 1 : 0,
    };
    dispatch({
      type: `${namespace}/check`,
      payload: fidall,
    });
    let message = this.state.status == 0 ? '信息审核成功！' : '信息反审核成功！';
    this.showmessage('成功！', message);
    this.setState({
      selectedRows: [],
    });
  };
  /***
   * 查询触发
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, namespace } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue['freportDate'] != undefined) {
        fieldsValue['freportDate'] =
          fieldsValue['freportDate'][0].format('YYYY-MM-DD') +
          '_' +
          fieldsValue['freportDate'][1].format('YYYY-MM-DD');
      }
      //   momentFormat(fieldsValue);
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        currentPage: 1,
        pageSize: 10,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: `${namespace}/fetch`,
        payload: values,
      });
    });
  };
  handleStandardTabpage = (pagination, filtersArg, sorter, formValues, interFace, namespace) => {
    const { dispatch } = this.props;
    const getValue = obj =>
      Object.keys(obj)
        .map(key => obj[key])
        .join(',');
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let params;
    if (!(formValues == undefined)) {
      formValues['currentPage'] = pagination.current;
      formValues['pageSize'] = pagination.pageSize;
      params = {
        ...formValues,
        ...filters,
      };
    } else {
      params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      };
    }

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    let fetch = interFace == 'fetch' || interFace == undefined ? 'fetch' : interFace;
    namespace = namespace || this.props.namespace;
    dispatch({
      type: `${namespace}/${fetch}`,
      payload: params,
    });
  };
  /***
   * 重置
   */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  constructor(props) {
    super(props);
  }

  /**
   * table 工具栏筛选
   * @param type
   * @returns {Array}
   */
  getstatus(type) {
    const status = [];
    for (var key in type) {
      status.push(type[key].fname);
    }
    return status;
  }

  /**
   * table 工具栏筛选
   * @param type
   * @returns {Array}
   */
  getstatusMap(type) {
    var m = new Map();
    for (var key in type) {
      m.set(type[key].fcode, type[key].fname);
    }
    return m;
  }

  /**
   * table 工具栏筛选
   * @param type
   * @returns {Array}
   */
  getstatusclum(type) {
    const status = [];
    for (var key in type) {
      status.push({
        text: type[key].fname,
        value: type[key].fcode,
      });
    }
    return status;
  }

  /***
   * clum 显示数据是否审核判断
   * @param e（显示数据）
   * @returns {*}
   */
  columnsend(e) {
    let col = e;
    const statusMap = ['未审核', '已审核'];
    const status = ['error', 'success'];
    col.push({
      title: '审核状态',
      dataIndex: 'fchecked',
      filterMultiple: false,
      // filters:  [{ text: statusMap[0], value: 0, },  {text: statusMap[1], value: 1,  }],
      render(val) {
        return <Badge status={status[val]} text={statusMap[val]} />;
      },
    });
    return col;
  }
}

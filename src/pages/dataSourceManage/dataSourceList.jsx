
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Input, Modal, Breadcrumb, Row, Col, Icon, Button, Select, Divider, Popconfirm, message, Table, Tooltip } from 'antd';
import styles from './dataSource.less';
import List from '@/components/List';
import { Card, PageContainers } from '@/components';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;


@Form.create()
class Index extends Component {
  state = {
    total: 0,
    current: 1,
    pageSize: 40,
    loading: false,
    dataSource: [],
    dropDownData: [],
    orgData: [],
  };

  // 获取表单数据  用于查询列表、分页查询
  getFormItemVal = (page, size) => {
    let payload = {};
    this.props.form.validateFields((err, vals) => {
      if (err) return;
      let conditions = [];
      Object.keys(vals).forEach(k => {
        if (vals[k]) {
          conditions.push({ name: k, operator: 'EQ', value: vals[k] })
        }
      })
      payload = {
        conditions,
        pagination: {
          page,
          size,
        },
        sort: {
          createTime: 'desc',
        },
      }
    });
    return payload;
  }

  search = val => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/like',
        payload: {
          pagination: {
            page: 1,
            size: 10,
          },
          sort: {
            createTime: 'desc',
          },
          params: val,
        }
      }).then(res => {
        this.setState({ loading: false });
        if (res) {
          this.setState({ dataSource: res?.content, total: res.totalElements })
        }
      })
    })
  }

  jumpAdd = () => {
    this.props.dispatch(routerRedux.push('dataSourceManage/dataSourceAdd'))
  }

  del = record => {
    const { dataSource, current } = this.state;
    this.setState({ loading: true }, () => {
      if (dataSource.length === 1 && current > 1) {
        current--;
        this.setState({ current })
      }
      this.props.dispatch({
        type: 'dataSource/del',
        payload: { code: record.code }
      }).then(res => {
        if (res) {
          this.getList();
        } else {
          this.setState({ loading: false });
        }
      })
    })
  }

  jumpDetails = id => {
    this.props.dispatch(routerRedux.push({
      pathname: 'dataSourceManage/dataSourceDetails',
      query: { id },
    }))
  }

  jumpUpdate = record => {
    this.props.dispatch(routerRedux.push({
      pathname: 'dataSourceManage/dataSourceAdd',
      query: { id: record.code, type: record.type },
    }))
  }

  getList = () => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/getList'
      }).then(res => {
        if (res) {
          this.setState({ dataSource: res })
        }
        this.setState({ loading: false })
      })
    })
  }

  handleSetPageNum = current => {
    this.setState({ current }, () => {
      this.getList();
    })
  }

  handleSetPageSize = (current, pageSize) => {
    this.setState({ current, pageSize }, () => {
      this.getList();
    })
  }

  examine = (id, flag) => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/examine',
        payload: { idList: [id], checked: flag }
      }).then(res => {
        if (res) {
          message.success('操作成功');
          this.getList();
        } else {
          this.setState({ loading: false })
        }
      })
    })
  }

  resetForm = () => {
    this.props.form.resetFields();
  }

  // 获取所有机构（用于下拉框的option）
  getOrgData = () => {
    this.props.dispatch({
      type: 'dataSource/getOrgData',
      payload: { "isOut": true, "pageNum": 1, "pageSize": 9999 }
    }).then(res => {
      if (res) {
        // orgData = res;
        this.setState({ orgData: res })
      }
    })
  }

  // 获取下拉框(归属系统)
  getDropdownData = () => {
    this.props.dispatch({
      type: 'dataSource/getDropdownData',
      payload: { codeList: 'attributionSystem' }
    }).then(res => {
      if (res) {
        // dropDownData = res;
        this.setState({ dropDownData: res })
      }
    })
  }

  getNameByCode = (val = '', orgType = '', url = '') => {
    let data = [], name = '';
    if (val) {
      const { dropDownData } = this.state;
      if (orgType) {
        data = dropDownData[orgType];
        if (data?.length > 0) {
          data.forEach(item => {
            if (item.code === val) {
              name = item.name;
            }
          })
        }
      }
    }
    return name;
  }

  getOrgNameByorgCode = val => {
    let name = '';
    if (val) {
      const { orgData } = this.state;
      if (orgData?.length > 0) {
        orgData.forEach(item => {
          if (item.id === val) {
            name = item.orgName;
          }
        })
      }
    }
    return name;
  }


  componentDidMount() {
    this.getList();
    this.getOrgData();
    this.getDropdownData();
  }



  render() {
    const { isForm, loading, total, current, pageSize, dataSource } = this.state;
    const dataSourceColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 90, fixed: 'left', align: 'center', render: (text, record, index) => `${index + 1}` },
      { title: '数据源名称', dataIndex: 'name', key: 'name', fixed: 'left', width: 300, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '数据源代码', dataIndex: 'code', key: 'code', width: 350, ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '数据源类型', dataIndex: 'type', key: 'type' },
      { title: '数据源连接地址', dataIndex: 'jdbcUrl', key: 'jdbcUrl' },
      { title: '数据库名称', dataIndex: 'dataBaseName', key: 'dataBaseName', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: 'SID', dataIndex: 'sid', key: 'sid', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '服务名称', dataIndex: 'serverName', key: 'serverName', ellipsis: true, render: (text) => (<Tooltip placement="topLeft" title={text}>{text}</Tooltip>) },
      { title: '用户名', dataIndex: 'username', key: 'username' },
      { title: '密码', dataIndex: 'password', key: 'password' },
      { title: '归属机构', dataIndex: 'orgId', key: 'orgId', ellipsis: true, render: val => (<Tooltip placement="topLeft" title={this.getOrgNameByorgCode(val)}>{this.getOrgNameByorgCode(val)}</Tooltip>) },
      { title: '归属系统', dataIndex: 'sysId', key: 'sysId', render: val => this.getNameByCode(val, 'attributionSystem') },
      { title: '审核状态', dataIndex: 'checked', key: 'checked', render: val => (+val === 0 ? '未审核' : '已审核') },
      { title: '创建人', dataIndex: 'creatorId', key: 'creatorId' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      { title: '最后修改人', dataIndex: 'lastEditorId', key: 'lastEditorId' },
      { title: '最后修改时间', dataIndex: 'lastEditTime', key: 'lastEditTime' },
      { title: '审核人', dataIndex: 'checkerId', key: 'checkerId' },
      { title: '审核时间', dataIndex: 'checkerTime', key: 'checkerTime' },
      {
        title: '操作', align: 'center', fixed: 'right', width: 300, render: (text, record) => (
          <span>
            <a onClick={() => this.jumpDetails(record.code)}>查看</a>
            <Divider type="vertical" />
            <a disabled={+record.checked !== 0} onClick={() => this.jumpUpdate(record)}>修改</a>
            <Divider type="vertical" />
            <a disabled={+record.checked !== 0} onClick={() => this.examine(record.code, 1)}>审核</a>
            <Divider type="vertical" />
            <a disabled={+record.checked === 0} onClick={() => this.examine(record.code, 0)}>反审核</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={'确认删除此条数据么？'}
              onConfirm={() => this.del(record)}
              okText="确定"
              cancelText="取消"
            >
              <a disabled={+record.checked !== 0}>删除</a>
            </Popconfirm>
          </span>
        )
      },
    ];
    const formItemData = [
      {
        name: 'name',
        label: '数据源名称',
        type: 'input',
      },
      {
        name: 'jdbcUrl',
        label: '数据源连接地址',
        type: 'input',
      },
      {
        name: 'type',
        label: '数据源类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        option: [
          { name: 'MYSQL', code: 'MYSQL', },
          { name: 'ORACLE', code: 'ORACLE', },
        ],
      }
    ];
    return (<>
      <PageContainers
        breadcrumb={[
          {
            title: '产品要素管理',
            url: '',
          },
          {
            title: '数据源管理',
            url: '',
          },
        ]}
      />
      <Card title='数据源管理' extra={<Button type='primary' onClick={this.jumpAdd}>新增</Button>}>
        <Table
          dataSource={dataSource}
          columns={dataSourceColumns}
          scroll={{ x: dataSourceColumns.length * 200 + 680, y: 590 }}
          loading={loading}
          pagination={false}
        // pagination={{
        //   showSizeChanger: true,
        //   showQuickJumper: true,
        //   total,
        //   showTotal: () => `共 ${total} 条`,
        //   onChange: page => this.handleSetPageNum(page),
        //   onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
        //   pageSize,
        //   current,
        // }}

        />
      </Card>
    </>);
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ dataSource }) => ({ dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

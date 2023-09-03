
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Descriptions, Spin } from 'antd';
import styles from './dataSource.less';
import { Card, PageContainers } from '@/components';

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    record: {},
    dropDownData: [],
    orgData: [],
    loading: false,
    id: '',
  };
  componentDidMount() {
    const id = this.props.location?.query?.id;
    this.setState({ id, loading: true }, () => {
      this.props.dispatch({
        type: 'dataSource/getDetails',
        payload: { id }
      }).then(res => {
        if (res) {
          this.setState({ record: res, loading: false })
        }
        this.setState({ loading: false })
      })
    });
    this.getOrgData();
    this.getDropdownData();
  }

  // 获取所有机构（用于下拉框的option）
  getOrgData = () => {
    this.props.dispatch({
      type: 'dataSource/getOrgData',
      payload: { "isOut": true, "pageNum": 1, "pageSize": 9999 }
    }).then(res => {
      if (res) {
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
        this.setState({ dropDownData: res })
      }
    })
  }

  test = () => {
    const { record } = this.state;
    const { dispatch } = this.props;
    this.setState({ loading: true }, () => {
      if (record.type === 'MYSQL') {
        dispatch({
          type: 'dataSource/mysqlTest',
          payload: {
            jdbcUrl: record.jdbcUrl,
            port: record.port,
            dataBaseName: record.dataBaseName,
            username: record.username,
            password: record.password,
          }
        }).then(res => {
          if (res) {
            message.success('测试通过！');
          }
        })
      }
      if (record.type === 'ORACLE') {
        dispatch({
          type: 'dataSource/oracleTest',
          payload: {
            jdbcUrl: record.jdbcUrl,
            port: record.port,
            prefix: record.prefix,
            sid: record.sid,
            username: record.username,
            password: record.password,
          }
        }).then(res => {
          if (res) {
            message.success('测试通过！');
          }
        })
      }
      this.setState({ loading: false });
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
  render() {
    const { record, loading } = this.state;
    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品要素管理',
              url: '',
            },
            {
              title: '数据源管理',
              url: '/productEle/dataSourceManage',
            },
            {
              title: '数据源查看',
              url: '',
            },
          ]}
        />
        <Card title='数据源信息' extra={<Button loading={loading} onClick={this.test}>测试</Button>}>
          <Spin spinning={loading}>
            <div style={{ padding: '0 40px' }}>
              <Descriptions>
                <Descriptions.Item label="数据源类型">{record?.type || '--'}</Descriptions.Item>
                <Descriptions.Item label="归属机构">{this.getOrgNameByorgCode(record?.orgId) || '--'}</Descriptions.Item>
                <Descriptions.Item label="归属系统">{this.getNameByCode(record?.sysId, 'attributionSystem') || '--'}</Descriptions.Item>
                <Descriptions.Item label="数据源名称">{record?.name || '--'}</Descriptions.Item>
                <Descriptions.Item label="数据源代码">{record?.code || '--'}</Descriptions.Item>
                <Descriptions.Item label="主机地址">{record?.jdbcUrl || '--'}</Descriptions.Item>
                <Descriptions.Item label="端口号">{record?.port || '--'}</Descriptions.Item>
                {record?.type === 'MYSQL' && <Descriptions.Item label="数据库名称">{record?.dataBaseName || '--'}</Descriptions.Item>}
                {record?.type === 'ORACLE' && <Descriptions.Item label={record?.serverName ? '服务名' : 'sid'}>{record?.serverName || record?.sid || '--'}</Descriptions.Item>}
                <Descriptions.Item label="用户名">{record?.username || '--'}</Descriptions.Item>
                <Descriptions.Item label="口令">{record?.password || '--'}</Descriptions.Item>
              </Descriptions>
            </div>
          </Spin>
        </Card>
      </>
    );
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

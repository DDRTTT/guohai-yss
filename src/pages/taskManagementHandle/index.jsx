/**
 * 项目任务办理列表(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import { Form, Table, Button, Input, Row, Col, Select, DatePicker, Icon, Breadcrumb } from 'antd';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import HandleList from '../../components/projectManagement/handleList';
import style from './index.less';
import { setSession } from '@/utils/session';
import router from 'umi/router';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import styles from '@/pages/taskManagementDeal/index.less';

const { Search } = Input;
@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
    show: true,
    input: '',
    isForm: true,
  };

  handleChangeInput = value => {
    console.log(value);
    this.setState({
      input: value,
    });
  };

  sponsorTask = link => {
    router.push('/projectManagement/taskManagementStart');
  };

  // 任务办理
  onHandle = () => {};

  detailsSearchHtml() {
    // const {
    //   form: {getFieldDecorator},
    //   manuscriptManagementList: {proCode, awpProType, proDept},
    // } = this.props;
    // const formItemLayout = {
    //   labelCol: {
    //     xs: {span: 24},
    //     sm: {span: 8},
    //   },
    //   wrapperCol: {
    //     xs: {span: 24},
    //     sm: {span: 16},
    //   },
    // };
    // return (
    //   <Form className={styles.colHeader}>
    //     <Row gutter={{md: 8, lg: 24, xl: 48}}>
    //       <Col span={6}>
    //         <Form.Item label="项目编码" {...formItemLayout}>
    //           {getFieldDecorator('proCode')(
    //             <Select placeholder="请选择项目编码" mode="multiple" showArrow={false} allowClear>
    //               {proCode && proCode.map(item => (
    //                 <Select.Option key={item.code}>{item.name}</Select.Option>
    //               ))}
    //             </Select>
    //           )}
    //         </Form.Item>
    //       </Col>
    //       <Col span={6}>
    //         <Form.Item label="项目类型" {...formItemLayout}>
    //           {getFieldDecorator('proType')(
    //             <Select placeholder="请选择项目类型" mode="multiple" showArrow={false} allowClear>
    //               {awpProType &&
    //               awpProType.map(item => (
    //                 <Select.Option key={item.code}>{item.name}</Select.Option>
    //               ))}
    //             </Select>,
    //           )}
    //         </Form.Item>
    //       </Col>
    //       <Col span={6}>
    //         <Form.Item label="所属部门" {...formItemLayout}>
    //           {getFieldDecorator('proDept')(
    //             <Select placeholder="请选择所属部门" mode="multiple" showArrow={false} allowClear>
    //               {proDept &&
    //               proDept.map(item => (
    //                 <Select.Option key={item.code}>{item.name}</Select.Option>
    //               ))}
    //             </Select>,
    //           )}
    //         </Form.Item>
    //       </Col>
    //       <Col span={6}>
    //         <Form.Item label="开始日期：" style={{display: "flex"}}>
    //           {getFieldDecorator('proCDateMin')(
    //             <DatePicker/>,
    //           )}
    //         </Form.Item>
    //       </Col>
    //       <Col span={6}>
    //         <Form.Item label="结束日期：" style={{display: "flex"}}>
    //           {getFieldDecorator('proCDateMax')(
    //             <DatePicker/>,
    //           )}
    //         </Form.Item>
    //       </Col>
    //       <Col md={8} style={{float: 'right'}}>
    //         <span style={{float: 'right'}}>
    //           <Button type="primary" onClick={() => this.handleSearchBtn()}>
    //             查询
    //           </Button>
    //           <Button style={{marginLeft: 10}} onClick={() => this.handleClearVal()}>
    //             重置
    //           </Button>
    //           <a onClick={() => this.handleOpenConditions()} style={{marginLeft: 5}}>
    //             收起搜索
    //             <Icon type="up"/>
    //           </a>
    //         </span>
    //       </Col>
    //     </Row>
    //   </Form>
    // );
  }

  handleOpenConditions() {
    this.setState(state => ({
      isForm: !state.isForm,
    }));
  }
  render() {
    const { show, input, isForm } = this.state;
    return (
      <div>
        {this.state.isForm ? (
          <div className={style.topList}>
            <span>任务办理列表</span>
            <div style={{ display: 'flex' }}>
              <Input
                placeholder="请输入"
                value={input}
                name={input}
                prefix={<SearchOutlined style={{ fontSize: '1rem' }} />}
                onChange={event => {
                  this.handleChangeInput(input);
                }}
              />
              <Button
                onClick={() => this.handleOpenConditions()} className={style.openSearch}
                type="link"> 展开搜索<DownOutlined style={{ color: 'blue', fontSize: '1rem' }} />
              </Button>
            </div>
          </div>
        ) : (
          this.detailsSearchHtml()
        )}
        <HandleList childrenShow={false} handle={this.onHandle} />
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ taskManagement }) => ({
      taskManagement,
    }))(Index),
  ),
);

export default WrappedIndex;

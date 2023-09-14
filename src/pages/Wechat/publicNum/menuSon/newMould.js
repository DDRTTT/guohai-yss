import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { nsHoc } from '../../../../utils/hocUtil';
import { Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import EditTable from './EditTable';
import { errorBoundary } from '../../../../layouts/ErrorBoundary';


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@errorBoundary
@nsHoc({ namespace: 'publicNum' })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    status:'edit',
    type:null,
    mesLook:{},
  };

  componentDidMount() {
    const { dispatch,publicNum:{ mesLook } } = this.props;

    //业务分类下拉
    dispatch({
      type: 'publicNum/selectList',
      payload: {
        fcode: 'wechatMsgType',
      },
    });

    //消息范围下拉
    dispatch({
      type: 'publicNum/selectList',
      payload: {
        fcode: 'orgType',
      },
    });

    this.setState({
      type:sessionStorage.getItem('mouldType'),
    },()=>{
      if(this.state.type != 'addMould'){
        this.save(mesLook.conInfo)
      }else{
        this.save([])
      }
    })
  }

  componentWillUnmount(){
    sessionStorage.removeItem("mouldType");
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;
    const { type } = this.state;

    if(nextProps.publicNum.mesAdd.status == 200){
      dispatch(routerRedux.push("./mesMould"));
      nextProps.publicNum.mesAdd.status = null
    }

    if(nextProps.publicNum.mesMouldUpdate.status == 200){
      dispatch(routerRedux.push("./mesMould"));
      nextProps.publicNum.mesMouldUpdate.status = null
    }

  }

  //下拉渲染
  selectList = (data) => {
    let child = [];
    data.map((index,i)=>{
      child.push(<Option value={index.code} id={index.code}>{index.name}</Option>)
    })

    return(<Select>
      {child}
    </Select>)
  }

  //存储数据
  save = (list) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicNum/memory',
      payload: {
        list:list
      },
    });
  }

  //查询表单
  renderMenuForm() {
    const { getFieldDecorator } = this.props.form;
    const { publicNum: { busTypeList,orgTypeList,mesLook } } = this.props;
    const { type } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    let look = mesLook

    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem  {...formItemLayout} label="模板编号">
              {getFieldDecorator('tempCode',{
                initialValue: type == 'addMould'?'':look.tempCode,
                rules: [{ required: true, message:"请输入模板编号" }]
              })(
                <Input placeholder="请输入模板编号" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem  {...formItemLayout} label="模板标题">
              {getFieldDecorator('tempName',{
                initialValue: type == 'addMould'?'':look.tempName,
                rules: [{ required: true, message:"请输入模板标题" }]
              })(
                <Input placeholder="请输入模板标题" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem  {...formItemLayout} label="消息范围">
              {getFieldDecorator('touserOrgType',{
                initialValue: type == 'addMould'?'':look.touserOrgType,
                rules: [{ required: true, message:"请选择消息范围" }]
              })(
                this.selectList(orgTypeList)
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem  {...formItemLayout} label="业务分类">
              {getFieldDecorator('tempBuscode',{
                initialValue: type == 'addMould'?'':look.tempBuscode,
                rules: [{ required: true, message:"请选择业务分类" }]
              })(
                this.selectList(busTypeList)
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { publicNum: { dataStore },dispatch } = this.props;
    const { type } = this.state;

    return (
      <PageHeaderLayout father_url="/wechat/mesMould">
        <Card title="新增模板">
          {this.renderMenuForm()}
        </Card>

        {/*编辑表格*/}
        <Card title="详细信息" style={{marginTop:20}}>
          <EditTable
            edit={true}
            data={dataStore}
            dispatch={dispatch}
            form={this.props.form}
            type={type}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

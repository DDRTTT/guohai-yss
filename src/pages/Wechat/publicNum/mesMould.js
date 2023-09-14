import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { nsHoc } from '../../../utils/hocUtil';
import { Button, Card, Col, Form, Input, Popconfirm, Popover, Radio, Row, Select, Switch } from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import styles from '../Less/publicNum.less';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { errorBoundary } from "../../../layouts/ErrorBoundary";


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@errorBoundary
@nsHoc({ namespace: 'publicNum' })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum,
  // systeam: state.systeam,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    publicId:null,
    clickParam:null, //点击参数
    pageSize:10,
    currentPage:1,
    stateList:[
      {
        code:1,
        name:'启用',
      }, {
        code:0,
        name:'未启用',
      },
    ],

    stateParm:1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({
      publicId: sessionStorage.getItem('publicApp'),
    },()=>{
        this.inquiry()
    })

    //业务分类下拉
    dispatch({
      type: 'publicNum/selectList',
      payload: {
        fcode: 'wechatMsgType',
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;

    if(nextProps.publicNum.mesDelete.status == 200){
      this.setState({
        // pageSize:10,
        currentPage:1,
      },()=>{
        this.inquiry()
      })

     nextProps.publicNum.mesDelete.status = null
    }

    //mesSwith
    if(nextProps.publicNum.mesSwith.status == 200){

      this.setState({
        currentPage:1,
      },()=>{
        this.inquiry()
      })

      nextProps.publicNum.mesSwith.status = null
    }

  }

  //表格操作
  tableHandle = (item,type) => {
    const { dispatch } = this.props;

    if (type == 'edit') {
      sessionStorage.setItem('mouldId',item.tempCode);
      sessionStorage.setItem('mouldIdentity',item.id);
      sessionStorage.setItem('mouldType','updateMoule');

      dispatch({
        type: 'publicNum/mouldLook',
        payload: {
          data: item
        },
      });
      dispatch(routerRedux.push('./newMould'));
    }else {
      //删除
      dispatch({
        type: 'publicNum/mouldDelete',
        payload: {
          id: item.id
        },
      });
    }
  }



  //表单提交
  formSubmit = (e) => {


  }

  //模板内容下拉
  mesMouldSelect = (list) => {
    let child = [];
    list.map((index,i)=>{
      child.push(<Option value={index.code}>{index.name}</Option>)
    })
    return(<Select
      style={{ width:'100%' }}
      showSearch
      optionFilterProp={"children"}
    >
      {child}
      </Select>)
  }

  //查询表单
  renderMenuForm() {
    const { getFieldDecorator } = this.props.form;
    const { publicNum: { mesMould,busTypeList} } = this.props;
    const { stateList,stateParm } = this.state;

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

    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem  {...formItemLayout} label="模板标题">
              {getFieldDecorator('tempName',{

              })(
                <Input placeholder="请输入" style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem  {...formItemLayout} label="模板编号">
              {getFieldDecorator('tempCode',{
                initialValue: mesMould.tempCode,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem  {...formItemLayout} label="业务分类">
              {getFieldDecorator('tempBuscode')(
                this.mesMouldSelect(busTypeList)
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <Button type="primary" htmlType="submit" style={{width: 80, float: 'right',height:28}} onClick={this.inquiry}>查询</Button>
            {/* </span> */}
          </Col>
          <Col md={7} sm={24}>
            <FormItem  {...formItemLayout} label="模板状态">
              {getFieldDecorator('tempStatus',{
                initialValue: stateParm,
              })(
                this.mesMouldSelect(stateList)
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}></Col>
          <Col md={7} sm={24}></Col>
          <Col md={3} sm={24}>
            <Button style={{ width: 80, float: 'right' ,height:28}} onClick={this.handleFormReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    // this.setState({
    //   stateParm: null,
    // });
  }

  //新增模板
  addMenu = () => {
    const { dispatch } = this.props;
    sessionStorage.setItem('mouldType','addMould')

    dispatch({
      type: 'publicNum/mouldLook',
      payload: {
        data: {
          conInfo:[],
        },
      },
    });

    dispatch(routerRedux.push('./newMould'));
  }

  //根据id大小排序
  // sortId = (list) => {
  //   list.sort(function(a,b){return a.attrOrdnum-b.attrOrdnum});
  //   list.map((index,i)=>{
  //     index.contStyle2 =  index.contStyle;  //赋值
  //
  //     index.attrStyle = index.attrStyle.replace(/\$\{cn\}/, index.attrName);
  //     index.contStyle = index.contStyle.replace(/\$\{cn\}/, index.attrCode);  //字段显示
  //     index.contStyle2 = index.contStyle2.replace(/\$\{cn\}/, i.contExamples);  //样例展示
  //
  //     //最终显示
  //     index.result = ('<div>${cn}</div>').replace(/\$\{cn\}/,  index.attrStyle+':'+index.contStyle)
  //     //最终显示
  //     index.result2 = ('<div>${cn}</div>').replace(/\$\{cn\}/,  index.attrStyle+':'+index.contStyle2)
  //
  //   })
  //   return list;
  // }

  //弹出框显示
  contentPop = (record) => {
    const { publicNum: { mesView } } = this.props;
    // let list = this.sortId(record.conInfo);
    // let listShow = [];
    // let listShow2 = [];
    let finalShow = (
      <div dangerouslySetInnerHTML={{ __html: mesView.data }}></div>
    );

    // list.map((i,n)=>{
    //   listShow.push(<div>
    //     <div  dangerouslySetInnerHTML={{__html:i.result}}></div>
    //   </div>)
    // })
    //
    // list.map((i,n)=>{
    //   listShow2.push(<div>
    //     <div  dangerouslySetInnerHTML={{__html:i.result2}}></div>
    //   </div>)
    // })

    let showInfo = (<div>
        <div className={styles.popLine}>{record.tempBuscodeName}</div>
      {/*<div className={styles.popLine}>{listShow}</div>*/}
      {/*<div>{listShow2}</div>*/}
      {finalShow}
      </div>)
    return(<div>{showInfo}</div>)
  }

  //点击触发预览接口
  clickView = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicNum/mouldView',
      payload: {
        id: record.id,
      },
    });
  };

  //查询
  inquiry = () =>{
    const { dispatch, form } = this.props;
    const{ currentPage,pageSize,publicId } = this.state;
    form.validateFields((err, fieldsValue) => {
      fieldsValue.pageSize = pageSize;
      fieldsValue.currentPage = currentPage;
      fieldsValue.appAuthId = publicId;

      dispatch({
        type: 'publicNum/mould',
        payload: fieldsValue,
      });

    })
  }

  handleStandardTableChange = (pagination) => {
    this.setState({
      start: pagination.pageSize,
      currentPage: pagination.current,
    },()=>{
      this.inquiry()
    });
  }

  swithBtn = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicNum/mouldSwith',
      payload: {
        tempCode:record.tempCode,
        tempStatus:record.tempStatus == '1'?'0':'1'
      },
    });
  }



  render() {
    const { publicNum: { loading, mesMould, currentPage3 } } = this.props;

    const columns = [
      {
        title: '顺序',
        dataIndex: 'id',
      },
      {
        title: '模板编号',
        dataIndex: 'tempCode',
      },
      {
        title: '模板名称',
        dataIndex: 'tempName',
      }, {
        title: '业务分类',
        dataIndex: 'tempBuscodeName',
      },
      {
        title: '状态',
        dataIndex: 'tempStatus',
        render: (val,record) => (
          <div>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={val == '0'?false:true} onChange={()=>this.swithBtn(record)}/>
          </div>
        ),
      }, {
        title: '操作',
        dataIndex: 'tempBuscode',
        align:'center',
        width: 300,
        fixed: 'right',
        render: (val,record) => (
          <div>
            <Popover placement="leftTop" content={this.contentPop(record)} trigger="click">
              <a onClick={() => this.clickView(record)} style={{ marginRight: 10 }}>预览</a>
            </Popover>
            <a style={{ marginRight: 10 }} onClick={() => { this.tableHandle(record,'edit') }}>修改</a>
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.tableHandle(record,'delete')}>
              <a style={{ marginRight: 10 }} href="javascript:;" >删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];



    return (
      <PageHeaderLayout father_url="/wechat/publicNum">
        <Card
          title="消息模板"
          extra={<Button type="primary" style={{width: 80,height:28,textAlign:'center',padding:0}} onClick={()=>this.addMenu()}>
                  新增模板
                 </Button>}>
          {this.renderMenuForm()}
        </Card>

        {/*表格*/}
        <Card style={{marginTop:20}}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.mesDo}>
            <Col md={24} sm={24} style={{marginTop:20}}>
              <StandardTable
                columns={columns}
                unSelect={true}
                selectedRows={[]}
                loading={loading}
                data={mesMould}
                onChange={this.handleStandardTableChange}
                currentPage={currentPage3}
              >
              </StandardTable>
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}

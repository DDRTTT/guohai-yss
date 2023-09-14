
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Input, Modal, Breadcrumb, Row, Col, Icon, Button, Table, Select, message, Spin ,DatePicker} from 'antd';
import type, { DatePickerProps } from 'antd';
import { Card, PageContainers } from '@/components';
import { getSession } from '@/utils/session';
import request from "@/utils/request";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {router} from "umi";
import {
  getCombinationAPI,
} from '@/services/product/bulletinBoard';
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;


@Form.create()
class Index extends Component {
  state = {
    // msgContent :"请等待...",
    msgContent :[],
    loading: false,
    proCode:'',
    isModalVisible :false,
    isModalVisible1:false,
    record: {
      dbDate : {}
    },
    dateString:"",
    dropDownData: [],
    combinationData:[],
    combSubclass:[],
    id: '',
  };

  getCombination() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=TG004`).then(res => {
        if (res){
          this.setState({ combinationData: res })
        }
    })
  };

  getSubCombination() {
    request(`/ams-base-parameter/datadict/queryInfoNew?fcode=TG004_ALL`).then(res => {
      if (res){
        this.setState({ combSubclass: res })
      }
    })
  };

  componentDidMount() {
    // this.getDropdownData();
    this.getProName();
    this.getCombination();
    this.getSubCombination();

  }


  // 获取下拉框(产品名称)
  getProName = () => {
     let payload = {
       bizViewId:"I8aaa82b6018044a544a547620180bccb959a1946",
       likeBizViewId:"I8aaa82b6018044a544a547620180bd0a73fc1d00",
       isPage:1,
       returnType:"LIST",
       page:1,
       size:1000
     }
      request(`/yss-base-product/biProduct/smartbi/query`, {
        method: 'POST',
        data: payload,
      }).then(res => {
        const data  =res.data
        this.setState({ dropDownData: data })
      })

  }





  // 运营数据采集是否覆盖数据接口
  isCover = (type,requestKey,requestType) => {
    request(`/yss-base-product/dataCollection/isCover?type=${type}&requestKey=${requestKey}&requestType=${requestType}`).then(res => {
      if (res?.status === 200) {
        message.success(`操作成功！`);
        setTimeout(()=>router.goBack(),1500)
      }else{
        message.error(`操作失败 请重试！`);
      }
    });
  };

  dataUpdate = () => {
    const {  form } = this.props;
    const {dateString} = this.state;
    const {
      msgContent
    } = this.state;
    const that = this;
    form.validateFields((err, vals) => {
      if (err) return;
      let payload = { ...vals };

      payload.dbDate =dateString;

      payload.requestType = 1; //1：数据更新  2：增量更新  3：根据产品代码更新"
      // payload.combCategory = []; payload.combSubclass = [];
      request(`/yss-base-product/dataCollection/handAcsUpdate`, {
        method: 'POST',
        data: payload,
      }).then(res => {
        if (res.status === 200) {
          const requestKey = res.data;
          let resmsg ="";
          request(`/yss-base-product/dataCollection/getCopyWriting?requestKey=${requestKey}`).then(res => {
            if (res.status === 200) {
              let mss = res.data.msg
                if(mss){
                  mss = this.dealText(mss);
                }else{
                  // mss = "请等待..."
                  mss = ["请等待..."]
                }
              resmsg = mss;
              that.setState({msgContent:resmsg})
              if (res.data.code === "1000"){
                this.waitIsCover(resmsg,requestKey)
              }

              if (res.data.code === "2000" && res.data.isCover ==="1"){
                this.openIscover1(resmsg,requestKey)
              }

              if (res.data.code === "2000" && res.data.isCover ==="0"){
                that.setState({isModalVisible1:true})
              }

            }else {
              message.error(res.message);
            }});
        }else {
          message.error(res.message);
        }});
    })
  }

  dealText(text){
    let resText = "";
    let arr = [];
    if (text.indexOf("<br>")){
       arr = text.split("<br>")
      arr.forEach(item=>{
        resText=resText+item;
      })
    } else{
        resText = text;
        arr.push(text);
     }
    return arr;
}

  waitIsCover = (resmsg,requestKey) =>{

    let code = "1000";
    let isCover = "0";
    let msg ="";
    this.openMessage();

    let i =0;


   const test =  window.setInterval(() => {
     const {
       msgContent,isModalVisible
     } = this.state;
     if (!isModalVisible){
       clearInterval(test)
     }
      if (i>=40){
         clearInterval(test)
        this.setState({isModalVisible:false})
        return(
          message.warn("请求超时，请重试！")
        )
      }

     if (code === "2000" && isCover ==="1"){
       clearInterval(test)
       this.setState({isModalVisible:false})
       this.openIscover(resmsg,requestKey)
       return;
     }
     if (code === "2000" && isCover ==="0"){
       clearInterval(test)
       this.setState({isModalVisible:false})
       this.setState({isModalVisible1:true})
       return;
     }
     //2分钟内 循环请求接口msg
        setTimeout(() => {
          request(`/yss-base-product/dataCollection/getCopyWriting?requestKey=${requestKey}`)
            .then(res => {
              if (res.status === 200) {
                code = res.data.code;
                isCover = res.data.isCover;
                // code = "2000";
                // isCover = "1";
                // msg = res.data.msg.replace("<br>", "");
                // const wait =" 数据正在更新，请等待...."
                msg = this.dealText(res.data.msg.toString());
                this.setState({ msgContent: msg });
                // console.log(`循环${i}次 ${code} ${msgContent}`)

              } else {
                message.warn(res.message);
              }
            })
            .catch(err =>{
              console.log(err)
            })
          i++;

        });
      }, 3000);
    // }





  }
  openMessage(){
    const {
      isModalVisible
    } = this.state;
    this.setState({isModalVisible:true})

  }
  openIscover1(resmsg,requestKey)
  {
    const { confirm } = Modal;
    const that = this;
    const {
      msgContent
    } = this.state;
    return (
      confirm({
        title: <span>{msgContent?.length > 0 && msgContent.map(item => (
          <div key={item}><span>{item}</span><br/></div>
        ))}</span>,
        icon: <ExclamationCircleOutlined />,
        content: '是否覆盖?',
        okText: '是',
        cancelText: '否',
        onOk() {

          const type = 1;
          const requestType = 0;//0 更新覆盖 1导入覆盖

          that.isCover(type,requestKey,requestType);
        },
        onCancel() {

          const type = 0;
          const requestType = 0;

          that.isCover(type,requestKey,requestType);
        },
      })

    );
  }

  openIscover(resmsg,requestKey)
  {
    const { confirm } = Modal;
    const that = this;
    const {
      msgContent
    } = this.state;
    return (
      confirm({
        // title: <span>{msgContent}</span>,
        title: <span>{msgContent?.length > 0 && msgContent.map(item => (
          <div key={item}><span>{item}</span><br/></div>
        ))}</span>,
        icon: <ExclamationCircleOutlined />,
        content: '是否覆盖?',
        okText: '是',
        cancelText: '否',
        onOk() {
          const type = 1;
          const requestType = 0;//0 更新覆盖 1导入覆盖

          that.isCover(type,requestKey,requestType);
        },
        onCancel() {

          const type = 0;
          const requestType = 0;

          that.isCover(type,requestKey,requestType);
        },
      })

    );
  }

  // submit = () => {
  //   const { id } = this.state;
  //   if (id) {
  //     this.dataSourceUpdate();
  //   } else {
  //     this.dataSourceAdd();
  //   }
  // }



  typeChange = val => {
    this.setState({ type: val }, () => {
      this.props.form.resetFields(['dataType', 'dbDate']);
    })
  }

  handleChange = value => {
    this.setState({ dataType: value });
  };

  handleComChange= value => {
    console.log(`selected ${value}`);
    // if (value.indexOf(',')){
    //   const arr =value.toString().split(",")
    //   console.log(arr)
    //   const combSubclassTem =[];
    //   arr.forEach(ar =>{
    //     request(`/ams-base-parameter/datadict/queryInfoNew?fcode=${ar}`).then(res => {
    //       if (res){
    //         console.log("res")
    //         console.log(res)
    //         res.forEach(re =>{
    //           combSubclassTem.push(re)
    //         })
    //         this.setState({ combSubclass: combSubclassTem })
    //       }
    //     })
    //   })
    // }else{
    //   request(`/ams-base-parameter/datadict/queryInfoNew?fcode=TG004_ALL`).then(res => {
    //       this.setState({ combSubclass: res })
    //   })
    // }

  };

  handleProChange= value => {
    const {   proCode, dropDownData } = this.state;
    let proCodes="";
    dropDownData.rows.map(item => {
      if (item.proName === value){
        proCodes = item.proCode;
      }
    })
    this.setState({ proCode: proCodes });
    // this.setState({ dataType: value });
  };

  render() {
    const {isModalVisible,isModalVisible1,msgContent,  loading, record, dropDownData,combinationData,combSubclass,proCode } = this.state;
    const dateFormat = 'YYYY-MM-DD';
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const handleCancel = () => {
      this.setState({isModalVisible:false})
    };

    const handleOk = () => {
      this.setState({isModalVisible:false})
    };

    const handleCancel1 = () => {
      this.setState({isModalVisible1:false})
    };

    const handleOk1 = () => {
      this.setState({isModalVisible1:false})
      setTimeout(()=>router.goBack(),1500)
    };

    const onChange = (date, dateString) => {
      this.setState({dateString:dateString})
    };


    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '收入管理',
              url: '',
            },
            {
              title: '运营数据采集',
              url: '',
            },
            {
              title: `更新`,
              url: '/processCenter/update',
            },
          ]}
        />
        <Card title={`更新`}>
          <Spin spinning={loading}>
            <Form>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="数据类型:" {...formItemLayout}>
                    {getFieldDecorator('dataType', {
                      rules: [{ required: true, message: '请选择数据类型' }],
                      initialValue: "1",
                    })(
                      <Select onChange={val => this.handleChange(val)} placeholder='请选择数据类型' >
                        <Option key='1' value='1'>规模</Option>
                        <Option key='2' value='2'>托管费</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                    <FormItem label="数据日期:" {...formItemLayout}>
                      {getFieldDecorator('dbDate', {
                        rules: [{ required: true, message: '请选择数据日期' }],
                        // initialValue: record?.dbDate,
                      })(
                        <DatePicker onChange={onChange}  style={{width:"100%"}} />
                        // <DatePicker format={dateFormat} placeholder="请选择日期"  style={{width:"100%"}}/>
                      )}
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  {/*<Spin size='small' spinning={yssLoading}>*/}
                    <FormItem label="产品名称:" {...formItemLayout}>
                      {getFieldDecorator('proName', {
                        rules: [{ required: false, message: '请选择产品名称' }],
                        initialValue: "",
                      })(
                        <Select placeholder='请选择产品名称' onChange={key => this.handleProChange(key)} showSearch >
                          {dropDownData?.rows?.length > 0 && dropDownData.rows.map(item => (
                            <Option key={item.proCode} value={item.proName}>{item.proName}</Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>
                  {/*</Spin>*/}
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="产品代码:" {...formItemLayout}>
                    {getFieldDecorator('proCode', {
                      rules: [{ required: false }],
                      initialValue: proCode,
                    })(
                      <Input disabled={true} placeholder=''/>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="组合类型:" {...formItemLayout}>
                    {getFieldDecorator('combCategory', {
                      rules: [{ required: false, message: '请选择组合类型' }],
                      initialValue: [],
                    })(
                      <Select placeholder='请选择组合类型' onChange={key => this.handleComChange(key)} mode="multiple" >
                        {combinationData?.length > 0 && combinationData.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12}>
                  <FormItem label="组合子类:" {...formItemLayout}>
                    {getFieldDecorator('combSubclass', {
                      rules: [{ required: false, message: '请选择组合子类' }],
                      initialValue: [],
                    })(
                      <Select placeholder='请选择组合子类' mode="multiple">
                        {combSubclass?.length > 0 && combSubclass.map(item => (
                          <Option key={item.code} value={item.code}>{item.name}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <div style={{ marginBottom: 10 }}>
                <Row>
                  <Col span={4}></Col>
                  <Col span={18} style={{ marginBottom: 10 }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={this.dataUpdate}>确定</Button>
                    <Button style={{ marginRight: 8 }} onClick={()=>router.goBack()}>取消</Button>
                  </Col>
                </Row>
              </div>
            </Form>
            <Modal title="数据更新信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
              {msgContent?.length > 0 && msgContent.map(item => (
                <div key={item}><span>{item}</span><br/></div>
              ))}
              <span><p>请等待...</p></span>
            </Modal>
            <Modal title="数据更新信息" visible={isModalVisible1} onOk={handleOk1} onCancel={handleCancel1}>
              {/*<span>{msgContent}</span>*/}
              {msgContent?.length > 0 && msgContent.map(item => (
                <div key={item}><span>{item}</span><br/></div>
              ))}
            </Modal>
          </Spin>
        </Card>
      </>
    );
  }
}
//
const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ dataSource }) => ({ dataSource }))(Index),
    ),
  ),
);

export default WrappedSingleForm;

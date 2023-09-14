import React, { Component } from 'react';
import  { useState } from 'react';
import {Card, Select, Form, Input, Button, message, Upload, Icon, Col} from 'antd';
import { Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// const {  UploadOutlined  } = icons;
// import styles from './index.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { router } from 'umi';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import Action from "@/utils/hocUtil";
import {downloadNoToken,download} from "@/utils/download";
import {PageContainers} from "@/components";
import request from "@/utils/request";
const FormItem = Form.Item;
const { TextArea } = Input;

@errorBoundary
@Form.create()
export default class Index extends Component {
  state = {
    activeTabsKey: this.props.publicTas,
    fileInfo: {},
    upLoading: false,
    dataType: 1
  };
   // dataType = 1;
  save = () => {
    const { formValue } = this.state;
    const replaceList = [];
    if (this.tableData.length === 0) {
      message.warn('字典数据不能为空');
      return;
    }
    this.tableData.forEach(index => {
      if (index.code.length == 0 || index.code == '-') {
        message.warn('请输入字典代码');
        return;
      }
      if (index.name.length == 0 || index.name == '-') {
        message.warn('请输入字典名称');
        return;
      }
      replaceList.push(index.code);
    });

    if (!isRepeat(replaceList)) {
      message.warn('有重复数据');
      return;
    }
    const tempData = cloneDeep(this.tableData);
    tempData.map(item => {
      delete item.id;
    });
    this.props.dispatch({
      type: 'wordDictionary/addWord',
      payload: {
        ...formValue,
        datadict: tempData,
      },
    });
  };
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
  // 上传
  uploadChange = info => {
    const { confirm } = Modal;
    if (info.file.status === 'uploading') {
      this.setState({ upLoading: true, loading: true });
    }
    if (info.file.status === 'done') {
      const that = this;
      // const resKey = "4abd2d51-d0cc-466f-80f1-7552eab15aa5";
      if (info.file.response.status === 200) {
        const resKey = info.file.response.requestKey;
        let msg =  info.file.response.data.msg;
        // const resmsg = msg.replace("<br>","")
        const resmsg = this.dealText(msg);
          Modal.info({
            title: '',
            content: (
              <div>
               <span>{resmsg?.length > 0 && resmsg.map(item => (
                 <div key={item}><span>{item}</span><br/></div>
               ))}</span>
              </div>
            ),
            okText: '确定',
            onOk() {},
          });
        this.setState({ upLoading: false });
        if (info.file.response.code && info.file.response.code === "0000") {
          //替换试用
          return (
            confirm({
              title: <span>{resmsg?.length > 0 && resmsg.map(item => (
                <div key={item}><span>{item}</span><br/></div>
              ))}</span>,
              icon: <ExclamationCircleOutlined />,
              content: '是否覆盖?',
              okText: '是',
              cancelText: '否',
              onOk() {
                console.log('OK');
                that.setState({ upLoading: false });
                const type = 1;
                const requestType =1;
                const requestKey = resKey;
                that.isCover(type,requestKey,requestType);
              },
              onCancel() {
                console.log('Cancel');
                that.setState({ upLoading: false });
                const type = 0;
                const requestType =1;
                const requestKey = resKey;
                that.isCover(type,requestKey,requestType);
              },
            })

          );
        }

      } else {
        message.warn(`${info.file.response.message} 导入失败，请稍后再试`);
        this.setState({ upLoading: false });
      }
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 导入失败，请稍后再试`);
      this.setState({ upLoading: false });
    }
  };

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

  /**
   * 下载
   * * */
  handleDownLoad = () =>{
    const {
      dataType
    } = this.state;
    console.log("dataType");
    console.log(dataType);
    window.location.href = `/ams/yss-base-product/dataCollection/exportTemplate?selectTab=${dataType}`;
    // downloadNoToken(`/ams/yss-base-product/dataCollection/exportTemplate?selectTab=${dataType}`);
  };

  handleChange = value => {
    console.log(`selected ${value}`);
    this.setState({ dataType: value });
  };

  render() {
    const {
      upLoading,dataType
    } = this.state;
    const { Option } = Select;
    const uploadContractProps = {
      action: '/ams/yss-base-product/dataCollection/importTemplate',
      name: 'file',
      headers: {
        Token: sessionStorage.getItem('auth_token'),
      },
    };

    return (
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
            title: '导入',
            url: '/processCenter/importFile',
          }
        ]}
      >
        <Card bordered={false} style={{ marginTop: 14 }}>
      <div  style={{ marginTop: 50,marginLeft: 200}}>
        <span style={{font:16}}>请选择导入数据类型：</span>
        <Select  style={{ width: 120 }} defaultValue="1" onChange={this.handleChange} >
          <Option value="1">规模</Option>
          <Option value="2">托管费</Option>
        </Select>
        <span style={{marginLeft: 60}}>请选择要导入的文件：</span>
        <Upload
        {...uploadContractProps}
        data={{ type: dataType }}
        onChange={e => this.uploadChange(e)}
        showUploadList={false}
      >
        <Button loading={upLoading}>
          <Icon type="upload" />
          上传文件
        </Button>
      </Upload>
        <Button style={{ marginLeft: 60}} type="link"  onClick={this.handleDownLoad}>模板下载</Button>
      </div>
          </Card>
      </PageContainers>
    );
  }
}

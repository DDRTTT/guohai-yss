/**
 * 项目任务管理(开发时改成相应的菜单名)
 * Create on 2020/9/14.
 */
import React, { Component } from 'react';
import {Form, Modal, Button, Input, message} from 'antd';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { setSession } from '@/utils/session';
import router from 'umi/router';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import style from './index.less';
import TableChildrenList from '../../components/projectManagement/tableChildrenList';

@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
    show: false,
    input: '',
    childrenList: true,
    list:[],
    visible: true,
    selectedRows: [],
  };

  componentDidMount() {
    const item = this.props.router.location.query;
    if(item){
      this.props.dispatch({
        type: 'taskManagement/getChildrenList',
        payload: item.id,
        callback:(res)=>{
          this.setState({
            list:res.data
          })
        }
      });
      if(item.taskType==='常规任务'){
      }else if(item.taskType==='归档任务'){
        this.setState({
          childrenList: false
        })
      }
    }
  }

  onChange = (item,form) =>{
    console.log(item,form,'form')
    this.setState({
      selectedRows:item
    })
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onCancel = () => {
    this.props.history.go(-1)
  }

  commit = (key) => {
      const { selectedRows } = this.state;
      const ids = [];
      for (let i = 0; i < selectedRows.length; i++) {
        ids.push(selectedRows[i].proCode);
      }
      console.log(selectedRows.length)
      if(selectedRows.length===0){
        message.warning('请先勾选项目')
      }else if(selectedRows.length>1){
        message.warning('暂不支持批量操作，请勾选其一')
      }else{
        selectedRows.map((item)=>{
        this.props.dispatch({
          type:'taskManagement/autoMatic',
          payload:{
            awpFileNumber:item.awpFileNumber,
          },
          callback:(res)=>{
            message.warning(res.message)
          }
        })
        })
      }
  }
  handleDownLoad = () =>{
    const { selectedRows } = this.state;
    const ids = [];
    for (let i = 0; i < selectedRows.length; i++) {
      ids.push(selectedRows[i].proCode);
    }
    if(selectedRows.length===0){
      message.warning('请先勾选项目')
    }else if(selectedRows.length>1){
      message.warning('暂不支持批量操作，请勾选其一')
    }else{
      this.props.dispatch({
        type: 'manuscriptManagementList/getFileDownLoadReq',
        payload: [
          '09221418439527277456@POC测试方案.docx',
          '09252008551207066288@企业微信截图_16010357111231.png',
        ],
      });
    }
  }

  render() {
    const { show, input,childrenList } = this.state;
    const {
      taskManagement: { tableList, treeList},
    } = this.props;
    return (
      <div>
        <Modal
          title="完善底稿归档信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请在底稿文档列表中完善是否原件归档、原件份数、档案物理位置、档案盒号等四个信息</p>
        </Modal>
        {childrenList ? (
          <div className={style.topList}>
            <span className={style.right}>查看</span>
            <Button onClick={this.onCancel}>取消</Button>
          </div>
        ) : (
          <div className={style.topList}>
            <span className={style.right}>办理</span>
            <div className={style.leftBtn}>
              <Button type="primary" onClick={this.onCancel}>取消</Button>
              <Button type="primary" onClick={this.commit}>提交</Button>
              {/*<Button type="primary">保存</Button>*/}
            </div>
          </div>
        )}
        <div className={style.tContent}>
          {show ? <div>文档清单</div> : <div>底稿清单</div>}
          <Button onClick={this.handleDownLoad}>下载</Button>
        </div>
        <TableChildrenList onChange={this.onChange} listNum={this.state.list} childrenList={childrenList} />
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ taskManagement, router }) => ({
      taskManagement, router,
    }))(Index),
  ),
);

export default WrappedIndex;

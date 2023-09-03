import React, { Component } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {Form, Table, Modal, message, Button, Select, Input, Dropdown, Pagination, Menu} from 'antd';
import { connect } from 'dva';
import {EditOutlined} from '@ant-design/icons';
import style from './index.less';
import {filePreviewWithBlobUrl} from "@/utils/download";
const { Option } = Select;
class Index extends Component {
  state = {
    selectedRowKeys: [],
    backDoc:'',
    scriptNum:'',
    scriptLoca:'',
    fileBoxNum:'',
    show: false,
    num: 5,
    id:'',
    selectedRows: [],
    pageNum:0,
    pageSize:10,
    blobUrl:'',
    visible: false
  };

  onSelectChange = (selectedRowKeys,selectedRows) => {
    const {backDoc,scriptNum,scriptLoca,fileBoxNum} = this.state
    console.log(selectedRowKeys)
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
    const form = {
      backDoc,scriptNum,scriptLoca,fileBoxNum
    }
    this.props.onChange(selectedRows,form)
  };

  handleChangeInput = (event, name) => {
    let value = {};
    value[name] = event.target.value;
    this.setState(value);
  };

  handleSelect = (event, name) =>{
    let value = {};
    value[name] = event.target.value;
    this.setState(value);
  }

  onEdit = (index,id) => {
    console.log(index,id)
    this.setState({
      show: true,
      id: id,
      num: index,
    })
  }

  listSave = () => {
    this.setState({
      show: false,
    })
  }
// 分页获取列表
  handleSetPageNum = (page, pageSize) => {
    // this.props.dispatch({
    //   type: 'taskManagement/getChildrenList',
    //   payload: {
    //     pageNum: page,
    //     pageSize: pageSize,
    //   },
    // });
  };

  handleSetPageSize = (page,size) => {
    // this.props.dispatch({
    //   type: 'taskManagement/getChildrenList',
    //   payload: {
    //     pageNum: page,
    //     pageSize: size,
    //   },
    // });
  };

  delete = (item) => {
    this.props.dispatch({
      type:'taskManagement/batchDelete',
      payload:{
        ids: item.id
      },
      callback:(res)=>{
        message.warning(res.message)
      }
    })
  }
// 下载
  handleDownLoad=()=> {
    this.props.dispatch({
      type:'taskManagement/getFileDownLoadReq',
      payload:[
        '09221418439527277456@POC测试方案.docx',
        '09252008551207066288@企业微信截图_16010357111231.png',
      ]
    })
  }
// 查看/预览
  handleFilePreviewWithBlob() {
    filePreviewWithBlobUrl(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=09252008551207066288@企业微信截图_16010357111231.png`,
      blobUrl => {
        console.log(blobUrl);
        this.setState({
          blobUrl,
          visible: true,
        });
      },
    );
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  HandleGetBatchMenu = () => {
    // return (
    //   <Menu
    //     style={{ textAlign: 'center' }}
    //     onClick={key => {
    //       this.handleBatchOperation(key);
    //     }}
    //   >
    //     <Menu.Item key="1">提交</Menu.Item>
    //     <Menu.Item key="2">认领</Menu.Item>
    //     <Menu.Item key="3">委托</Menu.Item>
    //     <Menu.Item key="4">退回</Menu.Item>
    //     <Menu.Item key="5">移交</Menu.Item>
    //     <Menu.Item key="6">传阅</Menu.Item>
    //   </Menu>
    // );
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { selectedRowKeys ,backDoc,scriptNum,scriptLoca,show,fileBoxNum,num,id,pageNum,pageSize} = this.state;
    const {childrenList,
      taskManagement: {list}
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columnTask = [
      { title: '文档名称', dataIndex: 'awpName', key: 'awpName', width: 180 },
      { title: '底稿目录', dataIndex: 'awpCode', key: 'awpCode', width: 180 },
      { title: '是否用印文档', dataIndex: 'useSeal', key: 'useSeal', width: 180 },
      { title: '上传时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      { title: '文件格式', dataIndex: 'uploadTime', key: 'uploadTime', width: 180 },
      { title: '文件版本', dataIndex: 'oad', key: 'oad', width: 180 },
      { title: '文件状态', dataIndex: 'state', key: 'state', width: 180 },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 280,
        render: (text, record) => (
          <div className={style.actionBut}>
            <Button type="link" onClick={this.handleDownLoad}>下载</Button>
            <Button type="link" onClick={this.handleFilePreviewWithBlob}>查看</Button>
            <Button type="link" onClick={this.delete}>删除</Button>
          </div>
        ),
      },
    ];


    const columnMenu = [
      { title: '文档名称', dataIndex: 'awpName', key: 'awpName' },
      { title: '底稿名称', dataIndex: 'awpName', key: 'awpName' },
      { title: '底稿目录', dataIndex: 'awpCode', key: 'awpCode' },
      { title: '是否用印文档', dataIndex: 'useSeal', key: 'useSeal',width:180, },
      { title: '是否原件归档',
        dataIndex: 'scriptFileFlag',
        key: 'scriptFileFlag',
        width:180,
        render: (text, record) => (
          <div>
            {show && num === 0 && id===record.id?
              <div style={{display:'flex'}}>
                <Input
                  value={backDoc}
                  name={'backDoc'}
                  onChange={event => {
                    this.handleChangeInput(event, 'backDoc');
                  }}
                />
                <Button onClick={this.listSave}>保存</Button>
              </div>:
              <div>
                {backDoc!=='' && id===record.id?backDoc:
                  <div style={{cursor:'pointer'}} onClick={()=>this.onEdit(0,record.id)}>请填写<EditOutlined/></div>}
              </div>
            }
          </div>
        ),
      },
      { title: '原件份数', dataIndex: 'scriptNum',key: 'scriptNum',width:180,
        render: (text, record) => (
          <div>
            {show && num === 1 && id===record.id?
              <div style={{display:'flex'}}>
                <Input
                  value={scriptNum}
                  name={'scriptNum'}
                  onChange={event => {
                    this.handleChangeInput(event, 'scriptNum');
                  }}
                />
                <Button onClick={this.listSave}>保存</Button>
              </div> :
              <div>
                {scriptNum!=='' && id===record.id?scriptNum:
                  <div style={{cursor:'pointer'}} onClick={()=>this.onEdit(1,record.id)}>请填写<EditOutlined/></div>}
              </div>
            }
          </div>
        ), },
      { title: '档案物理位置', dataIndex: 'scriptLoca', key: 'scriptLoca',width:180,
        render: (text, record) => (
          <div>
            {show && num === 2 && id===record.id?
              <div style={{display:'flex'}}>
                <Input
                  value={scriptLoca}
                  name={'scriptLoca'}
                  onChange={event => {
                    this.handleChangeInput(event, 'scriptLoca');
                  }}
                />
                <Button onClick={this.listSave}>保存</Button>
              </div> :
              <div>
                {scriptLoca!=='' && id===record.id?scriptLoca:
                  <div style={{cursor:'pointer'}} onClick={()=>this.onEdit(2,record.id)}>请填写<EditOutlined/></div>}
              </div>
            }
          </div>
        ), },
      { title: '档案盒号', dataIndex: 'fileBoxNum', key: 'fileBoxNum' ,
        render: (text, record) => (
          <div>
            {show && num === 3 && id===record.id?
              <div style={{display:'flex'}}>
                <Input
                  value={fileBoxNum}
                  name={'fileBoxNum'}
                  onChange={event => {
                    this.handleChangeInput(event, 'fileBoxNum');
                  }}
                />
                <Button onClick={this.listSave}>保存</Button>
              </div> :
              <div>
                {fileBoxNum!=='' && id===record.id?fileBoxNum:
                  <div style={{cursor:'pointer'}} onClick={()=>this.onEdit(3,record.id)}>请填写<EditOutlined/></div>}
              </div>
            }
          </div>
        ),},
      { title: '所属流程', dataIndex: 'oad', key: 'oad' },
      { title: '上传时间', dataIndex: 'oad', key: 'oad' },
      { title: '归档时间', dataIndex: 'oad', key: 'oad' },
      { title: '文件格式', dataIndex: 'oad', key: 'oad' },
      { title: '版本号', dataIndex: 'oad', key: 'oad' },
      { title: '更新用户', dataIndex: 'oad', key: 'oad' },
      { title: '文件状态', dataIndex: 'state', key: 'state' },
      {
        title: '操作',
        key: 'operation',
        width: 200,
        fixed:'right',
        render: (text,record) => (
          <div className={style.tableEdit}>
            <Button type="link" onClick={this.handleDownLoad}>下载</Button>
            <Button type="link" onClick={this.handleFilePreviewWithBlob}>查看</Button>
            {/*<iframe src={this.state.blobUrl} />*/}
            <Button type="link" onClick={this.delete}>删除</Button>
          </div>
        ),
      },
    ];

    const data = [];
    this.props.listNum.map((item, index) => {
      console.log(item,'item')
      data.push({
        key: index,
        id: item.id,
        awpName: item.awpName,
        awpCode: item.awpCode,
        useSeal: item.useSeal === 0 ? '否' : '是',
        scriptFileFlag: item.scriptFileFlag === 0 ? '否' : '是',
        scriptNum: item.scriptNum,
        scriptLoca: item.scriptLoca,
        fileBoxNum: item.fileBoxNum,
        createTime: item.createTime,
        type: '文件格式',
        oad: '文件版本',
        state:
          item.state === 0
            ? '待审核'
            : item.state === 1
            ? '待复核'
            : item.state === 2
              ? '已复核'
              : item.state === 3
                ? '归档待审核'
                : item.state === 4
                  ? '归档待复核'
                  : item === 5
                    ? '归档已复核'
                    : '',
      });
    });
    const listData = childrenList ? columnTask : columnMenu;
    return (
      <div>
        <Modal
          title="查看"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <iframe src={this.state.blobUrl} />
        </Modal>
        <Table
          scroll={{ x: 2500 }}
          className="components-table-demo-nested"
          columns={listData}
          dataSource={data}
          rowSelection={rowSelection}
        />
        {list && list.length !== 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Dropdown overlay={this.HandleGetBatchMenu()} trigger={['click']}>
              <Button>批量操作</Button>
            </Dropdown>
            <Pagination
              style={{
                textAlign: 'right',
              }}
              defaultCurrent={pageNum}
              defaultPageSize={pageSize}
              onChange={(page)=>this.handleSetPageNum(page)}
              onShowSizeChange={(page, size) => this.handleSetPageSize(page, size)}
              total={list.length}
              showTotal={() => `共 ${list.length} 条数据`}
              showSizeChanger
              showQuickJumper={list.length > pageSize}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
const WrappedIndex = errorBoundary(Form.create()(connect(
  ({ router,taskManagement }) =>
    ({router,taskManagement}))(Index)));

export default WrappedIndex;

//页面-招募说明书看板
import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {connect, routerRedux} from 'dva';
import {Button, Form, message, Modal, Icon, Tag, Dropdown, Menu,Spin} from 'antd';
import {useSetState} from "ahooks";
import router from 'umi/router';
import Action, {ActionBool, linkHoc} from '@/utils/hocUtil';//权限
import {stringify} from "qs";
import { cloneDeep } from 'lodash';
import CleanWord from "./cleanWord"
import {
  tableRowConfig,
  listcolor,//带色表格块
  handleClearQuickJumperValue,
  removeSpaces, //对象去空格
  directionFun,//升降序转换
  templateDownload,//模板下载
  getUrlParam,//获取url参数
  BatchOperation,//批量操作
} from '@/pages/investorReview/func';
import { Table } from '@/components';
import List from '@/components/List';
import ExportData from '@/components/ExportData'
import ExportAll from "@/components/ExportAll";
import request from "@/utils/request";
import {download,actionDownload} from "@/utils/download";
import {getAuthToken} from "@/utils/cookie";

const Index = (props)=>{
  const {
    fnLink,publicTas,//T001_1
    prospectusBoard: {
      saveListFetch,
      saveSearch,
      getOrgNameInfo,
      queryInfoByList,
      rpOrgProperty,
    },
    form: {getFieldDecorator, resetFields, validateFields},dispatch, listLoading}=props
  let urlParam=useRef(getUrlParam())
  urlParam.current.title='招募说明书看板'

  const pageNum=useRef(1)
  const pageSize=useRef(30)
  const [dingGaoLoading,setDingGaoLoading]=useState(false)
  const [state, setState] = useSetState({
    selectedRows:'',
    selectedRowKeys:'',
    tabData:[],//当前主页tab列表数据
    publicTas:publicTas,//tab切换信息
    field:"",// 排序依据
    direction:'',// 排序方式
    saveListFetchData:[],//获取到的表格数据
    cleanWordVisible: false,
    columns:[//列表表头
      {
        title: '招募书名称',
        dataIndex: 'fileName',
        key: 'fileName',
        ...tableRowConfig,
        sorter: true,
        width: 256,
      },
      {
        title: '产品名称',
        key: 'proName',
        dataIndex: 'proName',
        ...tableRowConfig,
        width: 256,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '财务日期',
        dataIndex: 'financialDate',
        key: 'financialDate',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '截止日期',
        dataIndex: 'expiryDate',
        key: 'expiryDate',
        ...tableRowConfig,
      },
      {
        title: '披露日期',
        dataIndex: 'disclosureDate',
        key: 'disclosureDate',
        ...tableRowConfig,
      },
      {
        title: '批次号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        ...tableRowConfig,
        width: 50,
      },
      {
        title: '更新类型',
        dataIndex: 'updateType',
        key: 'updateType',
        ...tableRowConfig,
        render: (updateType) => {
          return (
            <span>{updateType === '0'? '全部更新': '临时更新'}</span>
          )
        }
      },
      {
        title: '状态',
        dataIndex: 'stateName',
        key: 'stateName',
        ...listcolor,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ...tableRowConfig,
      },
      {
        title: '办理人',
        dataIndex: 'handler',
        key: 'handler',
        ...tableRowConfig,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        align: 'center',
        width:210,
        render: (text, record) => {
          return (<>
            <div className='bottom-list' style={{margin:'auto',padding:'initial'}}>
              <Dropdown
                placement="bottomRight"
                disabled={dingGaoLoading}
                overlay={
                  <Menu>
                    <Menu.Item key={'1'}>
                      <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                              onClick={() => dowloadDOC(record)}>
                        下载
                      </Button>
                    </Menu.Item >
                    {delVisiable(record)?
                      <Menu.Item key={'2'}>
                        <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                                onClick={() => handleCanDelete(record)}>
                          删除
                        </Button>
                      </Menu.Item>
                    :''}
                    {tgrDgButton() && record.state == '2' && <Menu.Item key={'3'}>
                      <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                              onClick={() => draft(record)}>
                        定稿
                      </Button>
                    </Menu.Item>}
                    <Menu.Item key={'4'}>
                      <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                              onClick={() => view(record)}>
                        查看
                      </Button>
                    </Menu.Item>
                    <Menu.Item key={'5'}>
                      <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                              onClick={() => history(record)}>
                        流转历史
                      </Button>
                    </Menu.Item>
                    <Menu.Item key={'6'}>
                      <Button size="small" type="link" style={{color: '#666', width: '100%'}}
                              onClick={() => cleanWord(record)}>
                        下载清洁版
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button style={{width:'100%'}}>请选择操作</Button>
              </Dropdown>
            </div>
          </>);
        },
      }
    ]
  })
  let formItemData=[//高级搜索
    {
      name: 'fileName',
      label: '招募书名称',
      type: 'input',
    },
    {
      name: 'proName',
      label: '产品名称',
      type: 'select',
      readSet: {name: 'name', code: 'code'},
      config: {mode: 'multiple'},
      option: saveSearch,
    },
    {
      name: 'proCode',
      label: '产品代码',
      type: 'select',
      readSet: {name: 'code', code: 'code'},
      config: {mode: 'multiple'},
      option: saveSearch,
    },

    {
      name: 'state',
      label: '状态',
      type: 'select',
      readSet: {name: 'name', code: 'code'},
      option:[
        { name: '进行中', code: '1' },
        { name: '监察稽核已审核', code: '2' },
        { name: '已定稿', code: '3' },
      ]
    },
    {
      name: 'disclosureDate',
      label: '披露日期选择',
      type: 'datepicker',

    },
  ]
  useEffect(() => {
    //主页面数据
    handleGetListFetch(publicTas,pageSize.current,pageNum.current, state.field, state.direction,{});
    //高级搜索下拉数据
    handleGetSelectOptions('','','rpOrgType','rpOrgProperty')

    return () => {}
  }, []);
  //判断是否能删除
  const delVisiable = (record) => {
    const userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'))
    const positions = JSON.parse(sessionStorage.getItem('USER_INFO'))?.positions
    let delV = false;
    let delT = false
    if (record.creatorId == userInfo.id) {
      delV = true
    }
    if(positions) {
      for(let i = 0; i<positions.length;i++) {
        if(positions[i] == '统稿人') {
          delT = true
        }
      }
    }
    if(delV || delT) {
      return true
    }else{
      return false;
    }
  }
  //tgrDgButton() && record.state == '2'是否能定稿
  const tgrDgButton=()=>{
    const positions = JSON.parse(sessionStorage.getItem('USER_INFO'))?.positions
    if(positions) {
      for(let i = 0; i<positions.length;i++) {
        if(positions[i] == '统稿人') {
          return true
        }
      }
    }
    return false;
  }

  // 下载
  const dowloadDOC =async (record) => {
    await setDingGaoLoading(true)
    await request(`/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}`,
      {method:'GET',responseType: 'blob',
        headers: {
          Token: getAuthToken() || '', //设置token
        },
      }).then(r=>{
        if(r){
          actionDownload(
            window.URL.createObjectURL(new Blob([r])),
            `${record.fileName}`,
          )
        }else {message.error(`操作失败${r.status}`)}
      }).then(
        setTimeout(()=>{
          setDingGaoLoading(false)
        },1000)
      )
  }
  //定稿
  async function draft(record){
    let IPObject=''
    await message.success('正在启动编辑器,请等待.......')
    await getNginxIP().then(res => {
      if (res?.status === 200) {IPObject=res.data}else return message.error('IPObject获取失败')
    });
    await cleanDraft(record,IPObject, (data) => {
      batchFinalization(data.id)
    });
  }

  function getNginxIP(params) {
    return request(`/ams-file-service/businessArchive/getnginxip`, {
      method: 'get',
      params,
    });
  }
  //批量定稿
  async function finalizeManuscript(){
    let flag = true;
    setDingGaoLoading(true);
    if(state.selectedRows.length < 1) {
      setDingGaoLoading(false);
      return message.warning('请勾选需要定稿的招募书');
    }
    for(let i = 0; i < state.selectedRows.length; i++) {
      if (state.selectedRows[i].state != '2') {
        flag = false;
        break;
      }
    }
    if(!flag) {
      setDingGaoLoading(false);
      return message.warning('含有在进行中或者已定稿的招募书，请重新选择！')
    }
    //循环批量清稿
    await function mapCleandraft () {
      state.selectedRows.forEach(item => {
        cleanDraft(item)
      })
    }
    await batchFinalization(state.selectedRowKeys.join());
  }

  function updateState(params) {
    return request(`/yss-contract-server/businessArchive/updateState?${stringify(params)}`);
  }
  function batchFinalization (data){
    updateState({ contractIdList: data}).then(res => {
      if (res.status === 200) {
        setState({ selectedRowKeys: [], selectedRows: []});
        setDingGaoLoading(false);
        handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current)
      } else {
        setState({selectedRowKeys: [], selectedRows: []});
        setDingGaoLoading(false);
        message.error(res.message);
      }
    });
  }
  //一键清稿
  const cleanDraft = (data,IPObject,callback = null) => {
    function insteadWord(params) {
      return request(`/yss-contract-server/RpTemplate/updateRemoteFileByUrl`, {
        method: 'get',
        params
      });
    }
    let url = `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${data.fileSerialNumber}`;
    const params = {
      fileUrl: url,
      acceptAllRevision: true
    }
    fetch(`${IPObject.jsApiIp}/cleandraft`, {
      method: 'POST',
      headers:{
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(params)
    }).then(suc => {
      if (suc.status == 200) {
        suc.json().then(success => {
          if(success.end) {
            fetch(`${IPObject.jsApiIp}/remove`, {
              method: 'get',
              headers:{
                "Content-Type": "application/json;charset=UTF-8",
              },
              params:{key: data.fileSerialNumber}
            }).then(resp=>{
              let urls = success.urls;
              insteadWord({fileSerialNumber: data.fileSerialNumber, url: urls['result.docx']}).then(succ => {
                if (callback) {
                  callback(data)
                }
              });
            })
          }
        })
      }
    })
  }
  //查看
  const view = (record) => {
    if (record?.fileSerialNumber) {
      sessionStorage.setItem('_templateParams', JSON.stringify(record));
      router.push(`/prospectus/prospectusConfig/view?title=${urlParam.current.title}`); // 需要taskId
    } else return message.warning('未办理流程无法预览，请先移步办理页面进行办理！')
  };
  // 删除
  const handleCanDelete = record => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    Modal.confirm({
      title: '请确认是否删除?',okText: '确认',cancelText: '取消',
      onOk: () => {
        request(`/yss-contract-server/businessArchive/delete`,
          {method:'POST',data: [...id],
          }).then(r=>{r.status===200?(message.success('操作成功'),
            setState({selectedRows:[],selectedRowKeys:[]}),
            handleGetListFetch(publicTas,pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
          :message.error(`操作失败${r.status}`)
        })
      },
    });
  };
  // 流转历史
  function history(record){
    function getProcessInfo(params) {
      return request(`/yss-contract-server/businessArchive/businessArchiveHistory`, {
        method: 'get',
        params,
      });
    }
    getProcessInfo({ id: record.id }).then(res => {
      if (res.status === 200) {
        const taskInfo = res.data.taskInstanceResponseList;
        if (taskInfo && taskInfo.length > 0) {
          router.push({
            pathname: '/processCenter/processHistory',
            query: {
              taskId: res.data.id,
              processInstanceId: taskInfo[0].processInstanceId,
              nodeId: taskInfo[0].taskDefinitionKey,
            },
          });
        }
      } else {
        message.error(res.message);
      }
    });
  }
//下载清洁版
  const cleanWord = async (rowData) => {
  let IPObject = ''
  await setDingGaoLoading(true),message.success('操作成功,正在启动文档,请等待.....')
  await sessionStorage.setItem('_status', 'isSee');
  await getNginxIP().then(res => {
    if (res?.status === 200) {IPObject=res.data}else return message.error('IPObject获取失败'),setDingGaoLoading(false)
  });
  if (IPObject=='') return
  await cleanWords(rowData, IPObject);
}
  function cleanWords(rowData, IPObject){
    if (rowData?.fileSerialNumber) {
      let url = `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${rowData.fileSerialNumber}`;
      const params = {
        fileUrl: url,
        acceptAllRevision: true,
      };
      fetch(`${IPObject.jsApiIp}/cleandraft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(params),
      }).then(suc => {
        if (suc.status == 200) {
          suc.json().then(res => {
            if (res.end) {
              let url = res.urls['result.docx'];
              let key = res.key
              sessionStorage.setItem(
                'templateDetailsParams',
                JSON.stringify({
                  type: rowData.fileFormat,
                  isSmart: 1,
                  status: 'isSee',
                  templateName: rowData.fileName,
                  fileNumber: rowData.fileSerialNumber,
                  url: url, // 文件流水号
                  id: rowData.id,
                }),
              );
              setState({ cleanWordVisible: true});
            }
          });
        }
        setDingGaoLoading(false)
      });
    } else return message.warning('未办理流程无法预览，请先移步办理页面进行办理！'),setDingGaoLoading(false);

  }

  const cleanWordFn = () => {
    setState({cleanWordVisible: false})
  }

  //搜索参数集合
  const keyWordsValue = useRef('');
  /**
   * 发起请求 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param publicTas {任务类型}
   * @param pageSize
   * @param pageNum
   * @param field  {排序字段}
   * @param direction  {排序方式}
   * @param formData {表单项}
   * @param orgId {机构类型ID}
   */
  const handleGetListFetch = ( publicTas,pageSize,pageNum,field,direction,formData) => {
    dispatch({
      type: 'prospectusBoard/handleListFetch',
      payload: {
        publicTas,
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
      val:{url:`/yss-contract-server/businessArchive/queryBusinessArchiveList`,method:'POST',},
      callback: (res) => {
        if(res && res.status === 200){
          setState({saveListFetchData:saveListFetch})
          handleClearQuickJumperValue()
        }else {
          message.error(res.message)
        }
      }
    });
  };
  // 请求:获取表单下拉选项
  const handleGetSelectOptions = (value1,value2,value3,value4) => {
     dispatch({//产品名称
      type: 'prospectusBoard/handleSearch',
      payload: { codeList:value1||'' },
      val:{url:`/yss-contract-server/RpProduct/getProductInfo`,method:'GET',},
    });
  };
  //查询
  const blurSearch = formData => {
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction,{keyWords:keyWordsValue.current});
  };
  // 高级查询
  function advancSearch(formData){
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current);
  }

  // 高级重置
  const handleReset = () => {
    setState({
      pageNum:1,
      selectedRows:[],
      selectedRowKeys:[],
    })
    keyWordsValue.current = '';
    handleGetListFetch(publicTas, pageSize.current,pageNum.current, '', '', {});
  };
  //* table 回调
  const handleTabsChanges = key => {
    dispatch({type: 'publicModel/setPublicTas',payload: key,});
    setState({publicTas: key})
    handleReset();
  };

  //选中键值
  const  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    setState({selectedRows:selectedRows,selectedRowKeys: selectedRowKeys})
    console.log(state.selectedRows)
  };
  //分页回调
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    let direction=directionFun(sorter?.order)
    setState({
      pageNum:pagination.current,
      pageSize: pagination.pageSize,
      field:sorter.columnKey,
      direction:direction
    })
    pageSize.current=pagination.pageSize
    pageNum.current=pagination.current
    handleGetListFetch(
      publicTas,
      pagination.pageSize,
      pagination.current,
      sorter.columnKey,
      direction,
      keyWordsValue.current,
    );
  };

  const callBackHandler = value => {setState({columns:value})};
  const {columns,selectedRows,selectedRowKeys}=state
  //table组件
  const tableCom = (columns) => {
    return (<Table
      rowKey={'id'}
      loading={listLoading}
      dataSource={saveListFetch?.rows}
      columns={columns}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize:pageSize.current,
        current: pageNum.current,
        total: saveListFetch?.total,
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions:['30','50','100','300'],
      }}
      onChange={handlePaginationChange}
      scroll={{ x: true }}
      rowSelection={{//选中键值
        selectedRowKeys:selectedRowKeys,
        onChange: handleRowSelectChange,
      }}
    />);
  };


  return(
    <>
      {/*{listLoading?<Loading/>:''}*/}
      <Spin tip="请等待..." spinning={dingGaoLoading}>
      <List pageCode="prospectusBoard"
            pageContainerProps={{
              breadcrumb: [{ title: '招募说明书', url: '' },{ title: '招募说明书看板', url: '' }]
            }}
            showSearch={true}
            dynamicHeaderCallback={callBackHandler}
            columns={columns}
            taskTypeCode={publicTas}
            formItemData={formItemData}
            advancSearch={advancSearch}
            resetFn={handleReset}
            searchPlaceholder="请输入"
            fuzzySearch={blurSearch}
            loading={listLoading}
            tabs={{
              tabList: [
                // { key: 'T001_1', tab: '' },
                // { key: 'T001_3', tab: '我发起' },
                // { key: 'T001_4', tab: '未提交' },
                // { key: 'T001_5', tab: '已办理' },
              ],
              activeTabKey: publicTas,
              onTabChange: handleTabsChanges,
            }}
            title={`招募说明书看板`}
            extra={<>
              <Button loading={dingGaoLoading} onClick={()=>finalizeManuscript()}>批量定稿</Button>
              <ExportData data={props} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows}
                          url={'/ams/yss-contract-server/businessArchive/batchExportNew'}
              />
              <ExportAll data={props} url={'/ams/yss-contract-server/businessArchive/batchExportAllNew'}/>
            </>}
            tableList={
              <>
                {tableCom(columns)}
                {/*{publicTas === 'T001_3' ? <> {tableCom(state.columns)} </>:''}*/}
                {/*<MoreOperation/>*/}
                <BatchOperation selectedRows={selectedRows} DeleteFun={handleCanDelete}
                />
                <Modal
                visible={state.cleanWordVisible}
                mask={true}
                destroyOnClose={true}
                onCancel={() => cleanWordFn()}
                width={1200}
                style={{ top: 20 }}
                footer={null}
                maskClosable={false}
                >
                  <CleanWord data={dingGaoLoading} />
                </Modal>
              </>}
      />
      </Spin>
    </>
  )
}
const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ prospectusBoard, loading, publicModel: { publicTas } }) => ({
        prospectusBoard,
        publicTas,
        listLoading: loading.effects['prospectusBoard/handleListFetch'],
      }))(Index),
    ),
  ),
);
export default WrappedIndexForm;

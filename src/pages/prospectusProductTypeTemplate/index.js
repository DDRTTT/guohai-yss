//页面-招募说明书产品类型模板
import React, { useEffect, useRef, useState } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {connect, routerRedux} from 'dva';
import {Button, Form, message, Modal, Icon, Tag, Dropdown, Menu} from 'antd';
import {useSetState} from "ahooks";
import router from 'umi/router';
import Action, { linkHoc } from '@/utils/hocUtil';//权限
import { cloneDeep } from 'lodash';
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
import ImportData from '@/components/ImportData'
import ExportData from '@/components/ExportData'
import ExportAll from "@/components/ExportAll";
import HandleAdd from "./HandleAdd";
import request from "@/utils/request";
import {getAuthToken} from "@/utils/cookie";
import {download,actionDownload} from "@/utils/download";

let containerRef = ''

const Index = (props)=>{
  const {
    fnLink,publicTas,//T001_1
    prospectusProductTypeTemplate: {
      saveListFetch,
      saveSearch,
      getOrgNameInfo,
      queryInfoByList,
      rpOrgProperty,
    },
    form: {getFieldDecorator, resetFields, validateFields},dispatch, listLoading}=props
  let urlParam=useRef(getUrlParam())
  urlParam.current.title='招募说明书产品类型模板'

  const pageNum=useRef(1)
  const pageSize=useRef(30)
  const [state, setState] = useSetState({
    selectedRows:'',
    selectedRowKeys:'',
    tabData:[],//当前主页tab列表数据
    publicTas:publicTas,//tab切换信息
    field:"",// 排序依据
    direction:'',// 排序方式
    saveListFetchData:[],//获取到的表格数据
    columns:[//列表表头
      {
        title: '招募书名称',
        dataIndex: 'fileName',
        key: 'fileName',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '产品类型',
        key: 'proType',
        dataIndex: 'proType',
        ...tableRowConfig,
        width: 256,
      },
      {
        title: '模板类型',
        dataIndex: 'templateName',
        key: 'templateName',
        ...tableRowConfig,
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastEditTime',
        key: 'lastEditTime',
        ...tableRowConfig,
      },
      {
        title: '最后修改人',
        dataIndex: 'lastEditorName',
        key: 'lastEditorName',
        ...tableRowConfig,
      },
      {
        title: '数据来源',
        dataIndex: 'dataFrom',
        key: 'dataFrom',
        ...tableRowConfig,
      },
      {
        title: '审核状态',
        dataIndex: 'checkedName',
        key: 'checkedName',
        ...listcolor,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        align: 'center',
        render: (text, record) => {
          return (<>
              <Button type="link" size="small" onClick={() => view(record)}>查看</Button>
              {record.checkedType==='D001_1'? <Button type="link" size="small" onClick={() => handleCanUpdate(record)}>修改</Button>:''}
              {record.checkedType==='D001_1'? <Button type="link" size="small"   onClick={() => handleCanDelete(record)}>删除</Button>:''}
              {record.checkedType==='D001_1'?<Button type="link" size="small" onClick={() => checking(record)}>审核</Button>:''}
              {record.checkedType==='D001_2'? <Button type="link" size="small" onClick={() => antiChecking(record)}>反审核</Button>:''}
              <Button type="link" size="small" onClick={() => dowloadDOC(record)}>下载</Button>
          </>);
        },
      }
    ],
  })
  let formItemData=[//高级搜索
    {
      name: 'fileName',
      label: '招募书名称',
      type: 'input',
    },
    {
      name: 'proType',
      label: '产品类型',
      type: 'select',
      readSet: {name: 'assName', code: 'assCode'},
      config: {mode: 'multiple'},
      option: saveSearch,
    },
  ]
  useEffect(() => {
    //主页面数据
    handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction,{});
    //高级搜索下拉数据
    handleGetSelectOptions()
    return () => {}
  }, []);

  //新增
  const handleAdd = (record) => {
    return router.push(`/dynamicPage/pages/产品相关服务机构/4028e9c17f76cf7c017f8a55f1190004/新增?secondary=true`);
  };
  //查看
  const view = (record) => {
    sessionStorage.setItem('_templateParams', JSON.stringify(record));
    router.push(`/prospectus/prospectusConfig/view?title=${urlParam.current.title}`); // 需要taskId
  };
  //  修改
  const handleCanUpdate = (record, index) => {
    sessionStorage.setItem('_templateParams', JSON.stringify(record));
    sessionStorage.setItem('_status', '_isUpdate');
    router.push(`/prospectus/prospectusConfig/edit?title=${urlParam.current.title}&name=title=${urlParam.current.name}`); // 需要taskId
  }
  // 删除
  const handleCanDelete = record => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    Modal.confirm({
      title: '请确认是否删除?',okText: '确认',cancelText: '取消',
      onOk: () => {
        request(`/ams-file-service/businessArchive/deleteFile`,
          {method:'POST',data: id,
          }).then(r=>{r.status===200?(message.success('操作成功'),
            setState({selectedRows:[],selectedRowKeys:[]}),
            handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
          :message.error(`操作失败${r.status}`)
        })
      },
    });
  };
  //审核
  const checking = async (record) => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    request(`/ams-file-service/template/checked`,
      {method:'POST',data: {'id':id},
      }).then(r=>{r.status===200?(message.success('操作成功'),
        setState({selectedRows:[],selectedRowKeys:[]}),
        handleGetListFetch(publicTas,pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
      :message.error(`操作失败${r.status}`)
    });
  }
  //反审核
  const antiChecking = async (record) => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    request(`/ams-file-service/template/unChecked`,
      {method:'POST',data: {'id':id},
      }).then(r=>{r.status===200?(message.success('操作成功'),
        setState({selectedRows:[],selectedRowKeys:[]}),
        handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
      :message.error(`操作失败${r.status}`)
    });
  }
  //下载
  const dowloadDOC =async (record) => {
    await setState({dingGaoLoading: true})
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
          setState({dingGaoLoading: false})
        },1000)
      )
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
      type: 'prospectusProductTypeTemplate/handleListFetch',
      payload: {
        publicTas,
        pageSize,
        currentPage:pageNum,
        field,
        direction,
        ...formData,
        templateType:2
      },
      val:{url:`/ams-file-service/template/getAllTypeTemplate`,method:'POST',},
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
  const handleGetSelectOptions = (value) => {
     dispatch({//产品类型
      type: 'prospectusProductTypeTemplate/handleSearch',
      payload: { codeList:value||'' },
      val:{url:`/yss-contract-server/RpProduct/allAssetType`,method:'POST',},
    });
  };
  //查询
  const blurSearch = formData => {
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current, 1, state.field, state.direction,{keyWords:keyWordsValue.current});
  };
  // 高级查询
  function advancSearch(formData){
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current, 1, state.field, state.direction, keyWordsValue.current);
  }

  // 高级重置
  const handleReset = () => {
    setState({
      pageNum:1,
      selectedRows:[],
      selectedRowKeys:[],
    })
    keyWordsValue.current = '';
    handleGetListFetch(publicTas, pageSize.current, 1, '', '', {});
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
      <List pageCode="prospectusProductTypeTemplate"
            pageContainerProps={{
              breadcrumb: [{ title:`招募说明书`, url: '' },{ title:urlParam.current.title, url: '' }]
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
            title={urlParam.current.title}
            extra={<>
              <Button type="primary"  onClick={() => containerRef.showModal()}>新增</Button>
              <ExportData data={props} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows}
                          url={'/ams/ams-file-service/template/batchExportNew'}
              />
              <ExportAll data={props} url={'/ams/ams-file-service/template/batchExportAllNew?type=2'}/>
            </>}
            tableList={
              <>
                {tableCom(columns)}
                {/*{publicTas === 'T001_3' ? <> {tableCom(state.columns)} </>:''}*/}
                {/*<MoreOperation/>*/}
                <BatchOperation selectedRows={selectedRows} DeleteFun={handleCanDelete}
                                checking={checking} antiChecking={antiChecking}
                />
                <HandleAdd wrappedComponentRef={(form) => containerRef = form} />
              </>}
      />
    </>
  )
}
const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ prospectusProductTypeTemplate, loading, publicModel: { publicTas } }) => ({
        prospectusProductTypeTemplate,
        publicTas,
        listLoading: loading.effects['prospectusProductTypeTemplate/handleListFetch'],
      }))(Index),
    ),
  ),
);
export default WrappedIndexForm;

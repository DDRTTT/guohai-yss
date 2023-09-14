//页面 机构管理 机构信息
import React, {useEffect, useRef} from 'react';
import {errorBoundary} from '@/layouts/ErrorBoundary';
import {connect, routerRedux} from 'dva';
import {Button, Form, message, Modal} from 'antd';
import {useSetState} from "ahooks";
import router from 'umi/router';
import {linkHoc} from '@/utils/hocUtil'; //权限
import {
  BatchOperation,
  directionFun,
  getUrlParam,
  handleClearQuickJumperValue,
  listcolor,
  tableRowConfig,
  templateDownload,
} from '@/pages/investorReview/func';
import {Table} from '@/components';
import List from '@/components/List';
import ExportData from '@/components/ExportData'
import ExportAll from "@/components/ExportAll";
import request from "@/utils/request";

const Index = (props)=>{
  let {
    fnLink,publicTas,//T001_1
    institutionalManage: {
      orgSaveListFetch,
      orgSaveSearch,
    },
    form: {getFieldDecorator, resetFields, validateFields},dispatch, listLoading,}=props
  let urlParam=useRef(getUrlParam())
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
        title: '机构信息类型',
        key: 'orgInfoTypeName',
        dataIndex: 'orgInfoTypeName',
        ...tableRowConfig,
        width: 256,
      },
      {
        title: '生效日',
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '审核状态',
        dataIndex: 'checkedName',
        key: 'checkedName',
        ...listcolor,
        align: 'center',
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastEditTime',
        key: 'lastEditTime',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '最后修改人',
        dataIndex: 'lastEditorName',
        key: 'lastEditorName',
        ...tableRowConfig,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <Button type="link" size="small" onClick={() => handleCanCheck(record)}>查看</Button>
              {record.checked==='D001_1'? <Button type="link" size="small" onClick={() => handleCanUpdate(record)}>修改</Button>:''}
              {record.checked==='D001_1'?<Button type="link" size="small"   onClick={() => handleCanDelete(record)}>删除</Button>:''}
              {record.checked==='D001_1'?<Button type="link" size="small" onClick={() => checking(record)}>审核</Button>:''}
              {record.checked==='D001_2'? <Button type="link" size="small" onClick={() => antiChecking(record)}>反审核</Button>:''}
            </>
          );
        },
      }
    ],
  })
  let formItemData=[//高级搜索
    {
      name: 'orgInfoType',
      label: '机构信息类型',
      type: 'select',
      readSet: {name: 'name', code: 'code'},
      config: {mode: 'multiple'},
      option: orgSaveSearch,
    },
    {
      name: 'lastEditTime',
      label: '最后修改时间',
      type: 'RangePicker',
    },
  ]
  useEffect(() => {
    //主页面数据
    handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction,{},urlParam.current.orgId);
    //高级搜索下拉数据
    handleGetSelectOptions('rpOrgType')
    return () => {}
  }, []);


  // 查看
  const handleCanCheck = record => {
    return router.push(
      `/dynamicPage/pages/机构信息/4028e9c17f76cf7c017f8e9cb8170007/查看?orgId=${urlParam.current.orgId}&orgName=${urlParam.current.orgName}&orgType=${urlParam.current.orgTypeName}&secondary=true&type=view&id=${record.id}`
    );
  }
  // 新增
  const handleAdd = (record) => {
    dispatch(
      routerRedux.push(`/dynamicPage/pages/机构信息/000000007f6282b6017f6300d8740000/新增?orgId=${urlParam.current.orgId}&orgName=${urlParam.current.orgName}&orgType=${urlParam.current.orgTypeName}&secondary=true`)
    )
  };
  // 修改
  const handleCanUpdate = record => {
      sessionStorage.setItem('accountParameterAccountType', state.accountType);
    return router.push(
      `/dynamicPage/pages/机构信息/4028e9c17f76cf7c017f8ecfeb840008/修改?orgId=${urlParam.current.orgId}&orgName=${urlParam.current.orgName}&orgType=${urlParam.current.orgTypeName}&secondary=true&id=${record.id}`
    );
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
        request(`/yss-contract-server/RpOrgInfo/deleteByIds`,
          {method:'POST',data: {'ids':id},
        }).then(r=>{r.status===200?(message.success('操作成功'),
          handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current,urlParam.current.orgId))
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
    request(`/yss-contract-server/RpOrgInfo/isCheck`,
      {method:'POST',data: {'ids':id,checked:'D001_2'},
    }).then(r=>{r.status===200?(message.success('操作成功'),
      handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current,urlParam.current.orgId))
      :message.error(`操作失败${r.status}`)
    });
  }
  //反审核
  const antiChecking = async (record) => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    request(`/yss-contract-server/RpOrgInfo/isCheck`,
      {method:'POST',data: {'ids':id,checked:'D001_1'},
    }).then(r=>{r.status===200?(message.success('操作成功'),
      handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current,urlParam.current.orgId))
      :message.error(`操作失败${r.status}`)
    });
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
  const handleGetListFetch = ( publicTas,pageSize,pageNum,field,direction,formData,orgId) => {
    dispatch({
      type: 'institutionalManage/handleListFetchOrg',
      payload: {
        publicTas,
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
        orgId:orgId,
      },
      val:{url:`/yss-contract-server/RpOrgInfo/queryByPage`,method:'POST',},
      callback: (res) => {
        if(res && res.status === 200){
          setState({saveListFetchData:orgSaveListFetch,selectedRows:[],selectedRowKeys:[]})
          handleClearQuickJumperValue()
        }else {
          message.error(res.message)
        }
      }
    });
  };
  // 请求:获取表单下拉选项
  const handleGetSelectOptions = (value) => {
    dispatch({
      type: 'institutionalManage/handleSearchOrg',
      payload: { codeList:value||'' },
      val:{url:`/yss-contract-server/RpOrgInfo/getInfoType`,method:'GET',},
    });
  };
  //查询
  const blurSearch = formData => {
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas,pageSize.current, 1, state.field, state.direction,{keyWords:keyWordsValue.current},urlParam.current.orgId);
  };
  // 高级查询
  function advancSearch(formData){
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current, 1, state.field, state.direction, formData,urlParam.current.orgId);
  }

  // 高级重置
  const handleReset = () => {
    setState({
      pageNum:1,
      selectedRows:[],
      selectedRowKeys:[],
    })
    keyWordsValue.current = '';
    handleGetListFetch(publicTas, pageSize.current, 1, '', '', {},urlParam.current.orgId);
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
      keyWordsValue.current?.constructor=== Object?
        keyWordsValue.current:
        {keyWords:keyWordsValue.current}
    );
  };

  const callBackHandler = value => {setState({columns:value})};
  const {columns,selectedRows,selectedRowKeys}=state
  //table组件
  const tableCom = (columns) => {
    return (<Table
      rowKey={'id'}
      loading={listLoading}
      dataSource={orgSaveListFetch?.rows}
      columns={columns}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize:pageSize.current,
        current: pageNum.current,
        total: orgSaveListFetch?.total,
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
      <List pageCode="organizationInformation"
            pageContainerProps={{
              breadcrumb: [{ title: '基本信息管理', url: '' },{ title: '机构管理', url: '' },{ title: '机构信息', url: '' }]
            }}
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
            title={`${urlParam.current.orgName}-${urlParam.current.orgTypeName}`}
            extra={<>
              <Button type="primary"  onClick={() => {handleAdd()}}>新增</Button>
              {/*<ImportData data={props}*/}
              {/*            url={'/ams/yss-contract-server/RpOrgInfo/excel/import'}*/}
              {/*            handleGetListFetch={()=>{handleGetListFetch(publicTas, pageSize.current, 1, '', '', {},urlParam.current.orgId)}}*/}
              {/*/>*/}
              <ExportData data={props} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows}
                          url={'/ams/yss-contract-server/RpOrgInfo/export'}
              />
              <ExportAll data={props} url={`/ams/yss-contract-server/RpOrgInfo/exportExcelAll?orgId=${urlParam.current.orgId}`}/>
              {/*{templateDownload('/ams/yss-contract-server/RpOrgInfo/excel/downloadFile?fileName=机构信息导入模板',*/}
              {/*  '机构信息导入模板.xlsx')}*/}
            </>}
            tableList={
              <>
                {tableCom(columns)}
                {/*{publicTas === 'T001_3' ? <> {tableCom(state.columns)} </>:''}*/}
                {/*<MoreOperation/>*/}
                <BatchOperation selectedRows={selectedRows} DeleteFun={handleCanDelete}
                                checking={checking} antiChecking={antiChecking}
                                // action={{DeleteFun:'archiveTaskHandleList:treeNodeDelete',
                                //   checking:'archiveTaskHandleList:treeNodeDelete',
                                //   antiChecking:'archiveTaskHandleList:treeNodeDelete'
                                // }}
                />
              </>}
      />
    </>
  )
}
const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ institutionalManage, loading, publicModel: { publicTas } }) => ({
        institutionalManage,
        publicTas,
        listLoading: loading.effects['institutionalManage/handleListFetchOrg'],
      }))(Index),
    ),
  ),
);
export default WrappedIndexForm;

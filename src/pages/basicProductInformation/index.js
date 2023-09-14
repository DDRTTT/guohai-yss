//页面-产品基本信息
import React, {useEffect, useRef, useState} from 'react';
import {errorBoundary} from '@/layouts/ErrorBoundary';
import {connect, routerRedux} from 'dva';
import {Button, Dropdown, Form, Icon, Menu, message, Modal} from 'antd';
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
import ImportData from '@/components/ImportData'
import ExportData from '@/components/ExportData'
import ExportAll from "@/components/ExportAll";
import request from "@/utils/request";

const Index = (props)=>{
  const {
    fnLink,publicTas,//T001_1
    basicProductInformation: {
      saveListFetch,
      saveSearch,
    },
    form: {getFieldDecorator, resetFields, validateFields},dispatch, listLoading}=props
  let urlParam=useRef(getUrlParam())
  const pageNum=useRef(1)
  const pageSize=useRef(30)
  const [state, setState] = useSetState({
    accountType:sessionStorage.getItem('accountParameterAccountType') || 'A001_1',
    selectedRows:'',
    selectedRowKeys:'',
    tabData:[],//当前主页tab列表数据
    publicTas:publicTas,//tab切换信息
    field:"",// 排序依据
    direction:'',// 排序方式
    saveListFetchData:[],//获取到的表格数据
    columns:[//列表表头
      {
        title: '产品名称',
        key: 'proName',
        dataIndex: 'proName',
        ...tableRowConfig,
        width: 256,
      },
      {
        title: '产品简称',
        dataIndex: 'proFname',
        key: 'proFname',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '产品代码',
        dataIndex: 'proCode',
        key: 'proCode',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '产品类型',
        dataIndex: 'proTypeName',
        key: 'proTypeName',
        ...tableRowConfig,
        sorter: true,
      },
      {
        title: '是否分级产品',
        dataIndex: 'isClassifiedName',
        key: 'isClassifiedName',
        ...listcolor,
        align: 'center',
      },

      {
        title: '审核状态',
        dataIndex: 'checkedName',
        key: 'checkedName',
        ...listcolor,
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
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        align: 'center',
        render: (text, record) => {
          return (<>
              <Button type="link" size="small" onClick={() => handleCanCheck(record)}>查看</Button>
              {record.checked==='D001_1'? <Button type="link" size="small" onClick={() => handleCanUpdate(record)}>修改</Button>:''}
              {record.checked==='D001_1'?<Button type="link" size="small"   onClick={() => handleCanDelete(record)}>删除</Button>:''}
              {record.checked==='D001_1'?<Button type="link" size="small" onClick={() => checking(record)}>审核</Button>:''}
              {record.checked==='D001_2'? <Button type="link" size="small" onClick={() => antiChecking(record)}>反审核</Button>:''}
          </>);
        },
      }
    ],
  })
  let formItemData=[//高级搜索
    {
      name: 'proName',
      label: '产品名称',
      type: 'select',
      readSet: {name: 'proName', code: 'proName'},
      config: {mode: 'multiple'},
      option: saveSearch,
    },
    {
      name: 'proCode',
      label: '产品代码',
      type: 'select',
      readSet: {name: 'proCode', code: 'proCode'},
      config: {mode: 'multiple'},
      option: saveSearch,
    },
  ]
  useEffect(() => {
    //主页面数据
    handleGetListFetch(publicTas, pageSize.current, pageNum.current, state.field, state.direction,{});
    //高级搜索下拉数据
    handleGetSelectOptions('TAmsProduct')
    return () => {}
  }, []);


  // 查看
  const handleCanCheck = record => {
    return router.push(
      `/dynamicPage/pages/产品基本信息/4028e9c17f76cf7c017faefe22e7000f/查看?type=view&id=${record.id}&secondary=true`
    );
  }
  // 新增
  const handleAdd = (record) => {
    return router.push(`/dynamicPage/pages/产品基本信息/4028e9c17f76cf7c017f941d9202000e/新增?secondary=true`);
  };
  // 修改
  const handleCanUpdate = record => {
    // sessionStorage.setItem('accountParameterAccountType', state.accountType);
    dispatch(
      routerRedux.push({
        pathname: `/dynamicPage/pages/产品基本信息/000000007f729d88017f72c717770000/修改?id=${record.id}`,
        // query: { ...record },
      }),
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
        request(`/yss-contract-server/RpProduct/deleteByIds`,
          {method:'POST',data: {'ids':id},
          }).then(r=>{r.status===200?(message.success('操作成功'),
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
    request(`/yss-contract-server/RpProduct/isCheck`,
      {method:'POST',data: {'ids':id,checked:'D001_2'},
      }).then(r=>{r.status===200?(message.success('操作成功'),
        handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
      :message.error(`操作失败${r.status}`)
    });
  }
  //反审核
  const antiChecking = async (record) => {
    let id=[]
    if(Array.isArray(record)){
      record.forEach((v)=>{id.push(v.id)})
    }else {id=[record.id]}
    request(`/yss-contract-server/RpProduct/isCheck`,
      {method:'POST',data: {'ids':id,checked:'D001_1'},
      }).then(r=>{r.status===200?(message.success('操作成功'),
        handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
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
  const handleGetListFetch = ( publicTas,pageSize,pageNum,field,direction,formData) => {
    dispatch({
      type: 'basicProductInformation/handleListFetch',
      payload: {
        publicTas,
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
      val:{url:`/yss-contract-server/RpProduct/queryByPage`,method:'POST',},
      callback: (res) => {
        if(res && res.status === 200){
          setState({saveListFetchData:saveListFetch,selectedRows:[],selectedRowKeys:[]})
          handleClearQuickJumperValue()
        }else {
          message.error(res.message)
        }
      }
    });
  };
  // 请求:获取表单下拉选项
  const handleGetSelectOptions = (value) => {
    // 'CS021' 参数类型 / 'S001' 状态 / 'A002' 产品类型
    dispatch({
      type: 'basicProductInformation/handleSearch',
      payload: { coreModule:value||'' },
      val:{url:`/yss-contract-server/RpProduct/queryProductInfo`,method:'GET',},
    });
  };
  //查询
  const blurSearch = formData => {
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current, 1, state.field, state.direction, {keyWords:keyWordsValue.current});
  };
  // 高级查询
  function advancSearch(formData){
    setState({pageNum: 1,})
    keyWordsValue.current = formData;
    handleGetListFetch(publicTas, pageSize.current, 1, state.field, state.direction, formData);
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
  const Synchronization = (props) => {
    const [loading,setLoading]=useState(false)
    async function syGraded(n){
      let url=n?`/yss-contract-server/RpProductLayer/saveProductLayers`:`/yss-contract-server/RpProduct/productFromXB`
      await setLoading(true)
      await request(url,{method:'POST'}).then(r=>{r.status===200?(message.success('操作成功'),
          handleGetListFetch(publicTas, pageSize.current,pageNum.current, state.field, state.direction, keyWordsValue.current))
        :message.error(`操作失败${r.status}`)
      })
      await setLoading(false)
    }
    return<Dropdown
      placement="bottomLeft"
      overlay={
        <Menu>
            <Menu.Item key="1">
              <Button size="small" type="link" style={{color:'#666',width:'100%'}} onClick={() =>{syGraded(1)}}>同步分级产品基本信息</Button>
            </Menu.Item>
          <Menu.Item key="2">
            <Button size="small" type="link" style={{color:'#666',width:'100%'}} onClick={() =>{syGraded(0)}}>同步产品基本信息</Button>
          </Menu.Item>
        </Menu>
      }>
      <Button loading={loading}>同步操作<Icon type="down" /></Button>
    </Dropdown>
  }
  return(
    <>
      {/*{listLoading?<Loading/>:''}*/}
      <List pageCode="basicProductInformation"
            // pageContainerProps={{
            //   breadcrumb: [{ title: '基本信息管理', url: '' },{ title: '产品基本信息', url: '' }]
            // }}
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
            title={`产品基本信息`}
            extra={<>
              <Synchronization/>
              <Button type="primary"  onClick={() => {handleAdd()}}>新增</Button>
              <ImportData data={props}
                          url={'/ams/yss-contract-server/RpProduct/excel/import'}
                          handleGetListFetch={()=>{handleGetListFetch(publicTas,pageSize.current, 1, '', '', {})}}
              />
              <ExportData data={props} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows}
                          url={'/ams/yss-contract-server/RpProduct/export'} name={'产品基本信息'}
              />
              <ExportAll data={props} url={'/ams/yss-contract-server/RpProduct/exportExcelAll'}/>
              {templateDownload('/ams/yss-contract-server/RpOrgInfo/excel/downloadFile?fileName=产品基本信息导入模板',
                '产品基本信息导入模板.xlsx')}
            </>}
            tableList={
              <>
                {tableCom(columns)}
                {/*{publicTas === 'T001_3' ? <> {tableCom(state.columns)} </>:''}*/}
                {/*<MoreOperation/>*/}
                <BatchOperation selectedRows={selectedRows} DeleteFun={handleCanDelete}
                                checking={checking} antiChecking={antiChecking}
                />
              </>}
      />
    </>
  )
}
const WrappedIndexForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ basicProductInformation, loading, publicModel: { publicTas } }) => ({
        basicProductInformation,
        publicTas,
        listLoading: loading.effects['basicProductInformation/handleListFetch'],
      }))(Index),
    ),
  ),
);
export default WrappedIndexForm;

import React, {useEffect, useState, useRef} from 'react';
import {Button, Divider, message, Popconfirm, Tabs, Tooltip, Tag} from 'antd';
import {router} from 'umi';

// 公共组件
import {PageContainers} from '@/components';
// import DynamicHeader from "@/components/DynamicHeader";
import CommonTable from "@/components/CommonTable";
import fuzz from "@/components/CommonTable/fuzz";
import FilterForm from "@/pages/processFlow/list/FilterForm";
import {
  tableRowConfig,
  listcolor,//带色表格块
} from '@/pages/investorReview/func';
import styles from './List.less';

import resetModalManagement from "@/pages/resetModalManagement.config";

const { path } = resetModalManagement.contractDeal;

const { TabPane } = Tabs;

const userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));

const jobPosition = userInfo?.positions && userInfo?.positions.find(item => item.includes('统稿人'));

// const GuideContext = React.createContext({});
// 流程库指引
const List = props => {
  const { getData, deleteData, pageInfo, changeCreateStatus, listData, listLoading, getNodeData } = props;
  const { pageCode, contentType, linkId, coreModule } = pageInfo;
  const [filterStatus, setFilterStatus] = useState(false);

  // table
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const [taskType, setTaskType] = useState('T001_1')

  useEffect(() => {
    if(!dataSource.length){
       getDatasource();
    }
  }, [pageSize, current, taskType]);
  
  // useEffect(()=>{
    
  // })

  const getHistory = (record) => {
    const taskData = record.processList[0].taskList[0];
      const { processInstanceId, id, taskDefinitionKey } = taskData;
      router.push(`/processCenter/processHistory?&taskId=${id}&processInstanceId=${processInstanceId}&nodeId=${taskDefinitionKey}`);// 需要taskId
  };


  const view = (record, index) => {
    // store变化
    sessionStorage.setItem('_templateParams', JSON.stringify(record));
    if (record?.fileSerialNumber) {
      router.push(`/prospectus/prospectusConfig/view?title=招募说明书办理`);
    } else {
      message.warning('该条流程还未办理，请先办理后再查看')
    }
  }


  const setHeadStatus = (status) => {
    setFilterStatus(status);
  }

  const edit = (record, index) => {
    // store变化
    sessionStorage.setItem('_templateParams', JSON.stringify(record));
    getNodeData(record, 'edit');
   //  router.push('/processFlow/process');
  }

  const pageColumns = [
    {
      title: "序号",
      sort: 1,
      dataIndex: "seq",
      align: 'center',
      width: 60,
      textAlign: 'center',
      fixed: 'left',
    },
    {
      title: "招募说明书名称",
      sort: 2,
      dataIndex: "fileName",
      ...tableRowConfig,
      width: 256,
      ellipsis: false,
    },
    {
      title: "产品名称",
      sort: 3,
      dataIndex: "proName",
      ...tableRowConfig,
      ellipsis: false,
      width: 256,
    },
    {
      title: "创建时间",
      sort: 4,
      ...tableRowConfig,
      width: 180,
      dataIndex: "createTime",
    },
    {
      title: "财务时间",
      sort: 5,
      ...tableRowConfig,
      width: 120,
      dataIndex: "financialDate",
    },
    {
      title: "截至时间",
      sort: 6,
      ...tableRowConfig,
      width: 120,
      dataIndex: "expiryDate",
    },
    {
      title: "披露日期",
      sort: 7,
      ...tableRowConfig,
      width: 120,
      dataIndex: "disclosureDate",
    },
    {
      title: "更新类型",
      sort: 8,
      width: 120,
      dataIndex: "updateType",
      render: (updateType) => {
        return (
          <span>{updateType === '0'? '全部更新': '临时更新'}</span>
        )
      }
    },
    {
      title: "批次号",
      sort: 9,
      width: 80,
      dataIndex: "batchNumber",
    },
    {
      title: "状态",
      sort: 10,
      dataIndex: "state",
      width: 80,
      // ...listcolor,
      render: (value)=>{
        let color
        let text
        if (value == 1) text = '进行中' ;
        if (value == 2) text = '待定稿';
        if (value == 3) { color = 'green'; text = '已完成' };
        return (
          <Tooltip title={text} key={value} placement="topLeft" >
              <Tag color={color||''} style={{margin:'2px'}}>
                {text||'-'}
              </Tag>
            </Tooltip>
        )
      }
    },
    {
      title: "操作",
      sort: 11,
      dataIndex: "action",
      width: 180,
      fixed: 'right',
      render: (text, record, index)=>{
        return (
          <span style={{whiteSpace: 'nowrap'}}>
            <a style={{whiteSpace: 'nowrap'}} onClick={(e)=>getHistory(record, index)}>流转历史</a>
            <Divider type="vertical" />
            {taskType == 'T001_1' && <a  style={{whiteSpace: 'nowrap'}}  onClick={(e)=>edit(record, index)}>办理</a>}
            {taskType == 'T001_1' && <Divider type="vertical" />}
            {taskType == 'T001_5' &&  <a  style={{whiteSpace: 'nowrap'}}  onClick={(e)=>view(record, index)}>查看</a>}
            {taskType == 'T001_5' && <Divider type="vertical" />}
            {(userInfo.id == record.creatorId || jobPosition?.includes('统稿人')) && <Popconfirm placement="topLeft" title={'确定要删除么？'} onConfirm={(e)=>deleteItem(record, index)} okText="删除" cancelText="取消">
              <a  style={{whiteSpace: 'nowrap'}}>删除</a>
            </Popconfirm>}
          </span>
        )
      }
    }
  ];

  const deleteItem = (record)=>{
    const { linkId,contentType } = pageInfo;
    const data = {
      payload :{
        linkId,
        contentType,
        path: "/ams/yss-contract-server/businessArchive/deleteOne",
        methodName: "GET",
        queryParams: [
          {
            code: "contractId",
            value: record.id
          }
        ]
      },
      cb: getDatasource
    };
    deleteData(data)
  };

  const changeTab  = (key)=> {
    console.log(key);
    setTaskType(key);
    // 重新请求数据
    setCurrent(1);
    // 重置表单数据
    // getDatasource();
  }

  const handleSubmit = data => {
    const params = data instanceof Array ? [...data] : [data]
    setCurrent(1);
    getDatasource(params);
  };

  const dynamicHeaderCallback = (value, columns)=>{
    // 设置当前页面columns
    const cols = [];
    pageColumns.forEach((item)=>{
      // 过滤掉不显示的项
      const flagItem = columns.find((col)=>item.dataIndex === col.dataIndex && col.show !==0);
      if(flagItem){
        cols.push({...flagItem, ...item});
      }
    });
    setColumns(cols);
  };

  const rowSelection = {
    // onChange: (selectedRowKeys, selectedRows) => {
    // },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const onChange = (pageNumber) => {
    setCurrent(pageNumber);
    // getDatasource();
  }

  const onShowSizeChange = (val,size)=>{
    setPageSize(size);
    setCurrent(1);
    // getDatasource();
  };

  const pagination = {
    showQuickJumper: true,
    onChange: onChange,
    onShowSizeChange: onShowSizeChange,
    showSizeChanger: true,
  };


  const getDatasource = params => {
    const data = {
      path,
      linkId,
      contentType,
      methodName: "POST",
      queryParams: [
        {
          code: "taskType",
          value: taskType
        },
        {
          code: "processId",
          value: "c054d6d3b36b4dfc84965064169f59c5"
        },
        {
          code: "pageNum",
          value: current
        },
        {
          code: "pageSize",
          value: pageSize
        }
      ]
    };
    if(params){
      // 这里太糙了，需要重写
      data.queryParams.forEach((item)=>{
        const repeatItem = params.find((par)=>item.code === par.code);
        if(repeatItem){
          item.value = repeatItem.value;
        }
      });
      params.forEach((par)=>{
        const noRepeatItem = data.queryParams.find((item)=>item.code === par.code)
        if(!noRepeatItem){
          data.queryParams.push(par);
        }
      });
    }

    getData({
      payload: data
    });
  };

  const addAllNew = ()=>{
    router.push('/prospectus/processFlow/addAll');
  };
  const addTmpNew = ()=>{
    router.push('/prospectus/processFlow/addTmp');
  };

  return (
    // <GuideContext.Provider value={{ detailRef }}>
    <div>
      <PageContainers
        fuzz={fuzz({submit: handleSubmit, filterStatus, setHeadStatus})}
        filter={FilterForm({submit: handleSubmit, filterStatus, setHeadStatus})}
        breadcrumb={[
          {
            title: '招募说明书',
            url: '',
          },
          {
            title: '招募说明书办理',
            url: '',
          },
        ]}
      >
        <div className={styles.processListContainer}>
            <div style={{float: 'right', lineHeight: '48px', margin: '4px'}}>
              <Button icon="plus" onClick={addAllNew} type='primary'>新增全部更新</Button>
              <Button style={{marginLeft: 10}} icon="plus-circle" onClick={addTmpNew} type='primary'>新增临时更新</Button>
              {/*<DynamicHeader*/}
              {/*  columns={columns}*/}
              {/*  pageCode={pageCode}*/}
              {/*  callBackHandler={dynamicHeaderCallback}*/}
              {/*  taskTypeCode={''}*/}
              {/*  taskArrivalTimeKey={''}*/}
              {/*/>*/}
            </div>
          <Tabs defaultActiveKey="T001_1" onChange={changeTab} id='tabsTask'>
            <TabPane tab="我待办" key="T001_1"></TabPane>
            <TabPane tab="我发起" key="T001_3"></TabPane>
            <TabPane tab="已办理" key="T001_5"></TabPane>
          </Tabs>
          <div className={styles.content}>
            <CommonTable loading={listLoading} pagination={pagination} rowKey="id" rowSelection={rowSelection} columns={pageColumns} dataSource={listData} />
          </div>
        </div>
      </PageContainers>
    </div>
    // </GuideContext.Provider>
  );
};
export default List;

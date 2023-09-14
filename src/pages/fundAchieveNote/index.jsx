import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import {Popconfirm, message, Avatar, Button, Col, Row, Input, Table, Spin, Tooltip, Dropdown, Icon, Form, Select, Divider } from 'antd';
// import { getSession } from '@/utils/session';
// import router from 'umi/router';
import styles from '@/pages/fundAchieveNote/index.less';

import { useAntdTable } from 'ahooks';
// 公共组件
import { PageContainers } from '@/components';
import DynamicHeader from "@/components/DynamicHeader";
import ButtonStatusDialog from "@/components/ButtonStatusDialog";
import CommonTable from "@/components/CommonTable";
import fuzz from "@/components/CommonTable/fuzz";

// 私有组件
import AddNewFom from "@/pages/fundAchieveNote/AddNewForm";
import FilterForm from "@/pages/fundAchieveNote/FilterForm";

// 配置文件
import resetModalManagement from "@/pages/resetModalManagement.config";
const {pageCode, contentType, linkId, path, coreModule} = resetModalManagement.fundAchieveNote;

// api
import {delRpFundAnno, getColumns, getDataList, getFundAchieveNote, getListItemDetail} from "@/services/processRelate";


// const { Search } = Input;
// const fuzz = ({submit, filterStatus, setFilterStatus})=>{
//   const tagStatus = e => {
//     e.preventDefault()
//     setFilterStatus(true);
//   };
//   return (
//     <span style={{float: 'right'}}>
//     { !filterStatus ? ( <span>
//       <Search
//       placeholder="请输入"
//       onSearch={value => submit({code: 'keyWords', value})}
//       style={{ width: 200 }}
//     />
//       <a style={{marginLeft: 10, fontSize:12}} className="ant-dropdown-link" onClick={e => tagStatus(e)}>
//         高级搜索<Icon type="down" />
//       </a>
//       </span>): (<span></span>) }
//     </span>
//   )
// }





// /baseInfoManagement/fundAchieveNote

const Index = ({
  dispatch,
  currentUser, // 获取用户头像用
}) => {
  // 表格数据过滤
  const [filterStatus, setFilterStatus] = useState(false);
  // dialog
  const [showMode, setShowMode] = useState(true);
  const [dialogTitle, setDialogTitle] = useState('');
  const [btnText, setBtnText] = useState('');
  const [itemData, setItemData] = useState({});
  // table
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const pageColumns = [
    {
      title: "序号",
      sort: 1,
      dataIndex: "seq",
      width: 60,
    },
    {
      title: "产品名称",
      sort: 2,
      dataIndex: "fproName",
      width: 150,
      ellipsis: true
    },
    {
      title: "产品代码",
      sort: 3,
      dataIndex: "fproCode",
      width: 150,
    },
    {
      title: "基金业绩注解",
      sort: 4,
      dataIndex: "fanno",
      ellipsis: true
    },
    {
      title: "操作",
      sort: 5,
      dataIndex: "action",
      width: 150,
      render: (text, record, index)=>{
        return (
          <span>
            <a style={{whiteSpace: 'nowrap'}} onClick={(e)=>view(record, index)}>查看</a>
            <Divider type="vertical" />
            <a  style={{whiteSpace: 'nowrap'}}  onClick={(e)=>edit(record, index)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm placement="topLeft" title={'确定要删除么？'} onConfirm={(e)=>deleteItem(record, index)} okText="删除" cancelText="取消">
              <a  style={{whiteSpace: 'nowrap'}}>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const handleSubmit = data => {
    const params = data instanceof Array ? [...data, {
        code: "currentPage",
        value: 1
      }] : [data,{
      code: "currentPage",
      value: 1
    }]

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

  const deleteItem = (record, index) =>{
    const data = {
        path: "ams/yss-contract-server/RpFundAnno/delete",
        linkId,
        contentType,
        queryParams: [
        {
          code: "ids",
          value: record.fid
        }]
    };
    delRpFundAnno(data).then((res)=>{
      if(res?.status === 200){
        getDatasource(); // 需要拿到数据过滤项
      }
    });
  }

  const addDialog = useRef(null);
  const edit = async (record, index) =>{
    await getDetailInfo(record, 'view');
    setShowMode(true);
    setItemData({});
    setDialogTitle('编辑-基金业绩注解');

    addDialog.current.props.showModal();
  }

  const view = async (record, index) =>{
    await getDetailInfo(record, 'view');
    setShowMode(false);
    setItemData(record);
    setDialogTitle('查看-基金业绩注解');
    addDialog.current.props.showModal();
  }

  const addNewBtn = ()=>{
    setShowMode(true);
    setItemData({});
    setDialogTitle('新增-基金业绩注解');
  };

  const getDetailInfo = (record, type) => {
    const data = {
      id: record.fid,
      type,
      coreModule
    };

    getListItemDetail(data).then((res)=>{
      if(res?.status === 200){
        setItemData(res.data[coreModule]);
      }
    });
  };

  const okCallback = ()=>{
    // 新建、保存
    // 重新获取列表
      cancelModal();
      getDatasource();
  };
  const cancelModal = ()=>{
    addDialog.current.handleCancel();
    // setShowMode(true);
    setItemData({});
    setDialogTitle('');

  };

  // const getColumnsData = () =>{
  //   const data = {
  //     pageCode
  //   };
  //   getColumns(data).then((res)=>{
  //     if(res.status === 200){
  //       setColumns(res.data);
  //     }
  //   });
  // };

  const getDatasource = params => {

    setLoading(true);
    const data = {
      path,
      linkId,
      contentType,
      methodName: "POST",
      queryParams: [
        {
          code: "currentPage",
          value: 1
        },
        {
          code: "pageSize",
          value: 10
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

    getDataList(data).then((res)=>{
      if(res?.status === 200){
        setDataSource(res.data.rows);
        setTotal(res.data.total)
        setLoading(false);
      }
    })
  };

  useEffect(() => {
   // if(){}
   getDatasource();
  }, [columns]);


  const rowSelection = {
    // onChange: (selectedRowKeys, selectedRows) => {
    //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    // },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const onChange = (pageNumber) => {
    setCurrent(pageNumber);
    const data = [
      {
        code: "currentPage",
        value: pageNumber
      },
      {
        code: "pageSize",
        value: 10
      }
    ]
    getDatasource(data);
  }

  const onShowSizeChange = (val)=>{
    setPageSize(val);
    const data = [
      {
        code: "currentPage",
        value: 1
      },
      {
        code: "pageSize",
        value: pageSize
      }
    ]
    getDatasource(data);
  };

  const pagination = {
    defaultCurrent: 1,
    current,
    total,
    pageSize,
    showQuickJumper: true,
    onChange: onChange,
    onShowSizeChange: onShowSizeChange

  };
  return (
    <div>
      <PageContainers
        fuzz={fuzz({submit: handleSubmit, filterStatus, setFilterStatus})}
        filter={FilterForm({submit: handleSubmit, filterStatus, setFilterStatus})}
        breadcrumb={[
          {
            title: '基本信息管理项',
            url: '',
          },
          {
            title: '基金业绩注解',
            url: '',
          },
        ]}
      >
        <div className={styles.container}>
          <Row>
            <Col span={6}><div className={styles.header}><span>基金业绩注解</span></div></Col>
            <Col span={18} style={{textAlign: 'right', lineHeight: '48px'}}>
              <ButtonStatusDialog ref={addDialog} addNewBtn={addNewBtn} footer={false} btnText={'新增'} title={dialogTitle} showMode={showMode} okCallback={okCallback}>
                <AddNewFom itemData={itemData} cancel={cancelModal} showMode={showMode} okCallback={okCallback}></AddNewFom>
              </ButtonStatusDialog>
              <DynamicHeader
              columns={columns}
              pageCode={pageCode}
              callBackHandler={dynamicHeaderCallback}
              taskTypeCode={''}
              taskArrivalTimeKey={''}
            /></Col>
          </Row>

          <div className={styles.content}>
            <CommonTable loading={loading} pagination={pagination} rowKey="fid" rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
          </div>
        </div>
      </PageContainers>
    </div>
  );
};

export default connect(({ user, details }) => ({
  currentUser: user.currentUser, // 获取用户头像
}))(Index);

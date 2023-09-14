/*档案库查看、审核页面*/
import Gird from '@/components/Gird';
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, Button, Row, Col,Form,Input} from 'antd';
import { PageContainers } from '@/components';
import { routerRedux } from 'dva/router';
const { TextArea } = Input;
class details extends Component {
  state={
    details:false,
    examine:false,
    detailsList:{},
    title:''
  }
  componentDidMount = () => {
   this.details()
   this.getData()
  };
  // 返回档案库列表
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/archives/index',
      }),
    );
  };
  //详情接口
  details = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'archive/details',
      payload: {
        bizViewId: 'I8aaa82cd0180d50fd50f97bf0180fa0d8ee13f00',
        isPage: '0',
        returnType: 'OBJECT',
        id: location.query.id
      },
    }).then(data => {
      this.setState({
        detailsList: data.data ? data.data : {},
        //Gird 详情组件对以下四个字段反显失效(bug原因没时间排查)，自己用新的字段从新赋值
        fileRooms:data.data.fileRoom,
        fileRacks:data.data.fileRack,
        fileLocations:data.data.fileLocation,
        fileBoxs:data.data.fileBox,
      })
      this.archivesCenterChange(data.data.fileRoom)
      this.fileRackChange(data.data.fileRack)
      this.fileLocationChange(data.data.fileLocation)
    });
  }
  //取到下拉数据
  getData() {
    const { dispatch } = this.props;
    // 词汇字典
    dispatch({
      type: 'archive/getCodeList',
      payload: ['fileCarrier', 'duration', 'fileStatus'],
    });
    // 档案室
    dispatch({
      type: 'archive/getArchivesCenter',
      payload: '-1'
    });

  }
  //档案架
  fileRack = val => {
    console.log(val, 'val1')
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/getFileRack',
      payload: val,
    });
  }
  // 档案位置
  fileLocation = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/getFileLocation',
      payload: val,
    });
  }
  //档案盒
  fileBox = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/getFileBox',
      payload: val,
    });
  }

  // 根据档案室选择档案架
  archivesCenterChange = val => {
    this.fileRack(val)
  }
  // 根据档案架获取档案位置
  fileRackChange = val => {
    this.fileLocation(val)
  }
  // 根据档案位置获取档案盒
  fileLocationChange = val => {
    this.fileBox(val)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { detailsList } = this.state
    const { archivesCategoryData, documentTypeData, fileTypeData, codeList, archivesCenterList, fileRackList, fileLocationList, fileBoxList } = this.props.archive;
    const textAreaLayout = {
      labelAlign: 'right',
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
    const drawerConfig = info => {
      return [
        { label: '文件名称', value: 'fileName' },
        { label: '档案号', value: 'fileNo' },
        {
          label: '文档载体',
          value: 'fileCarrier',
          type: 'select',
          option: codeList.fileCarrier,
        },
        {
          label: '档案室',
          value: 'fileRooms',
          type: 'select',
          option: archivesCenterList,
        },
        {
          label: '档案架',
          value: 'fileRacks',
          type: 'select',
          option: fileRackList,
        },
        {
          label: '档案位置',
          value: 'fileLocations',
          type: 'select',
          option: fileLocationList,
        },
        {
          label: '档案盒',
          value: 'fileBoxs',
          type: 'select',
          option: fileBoxList,
        },
        {
          label: '保管期限',
          value: 'storageTime',
          type: 'select',
          option: codeList.duration,
        },
      ];
    };
    return (
      <>
      <PageContainers
          breadcrumb={[
            {
              title: '实物档案管理',
              url: '',
            },
            // {
            //   title: '档案归档',
            //   url: '/productDataManage/orgInfoManagement/index',
            // },
            {
              title: '档案库',
              url: '/physicalArchives/archive/archives/index',
            },
            {
              title: `查看`,
              url: '',
            },
          ]}
          fuzz={''}
        />
        <Card>
        <Row style={{ paddingBottom: 10 }} justify="end">
          <div style={{ float: 'right' }}>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={this.goBack}>
                取消
              </Button>
            </div>
          </Row>
          <Gird config={drawerConfig(detailsList)} info={detailsList} />
        </Card>
      </>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ archive }) => ({
      archive,
    }))(details),
  ),
);
export default WrappedAdvancedSearchForm;

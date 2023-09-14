/*档案库修改页面*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, Col, Row, Form, Input, Select, Button } from 'antd';
import { PageContainers } from '@/components';
import { routerRedux } from 'dva/router';
class modify extends Component {
  state={
    disabled: false,
    detailsList:{}
  }
  componentDidMount = () => {
    this.details()
    this.getData()
  };
  // 返回档案库列表
  goBack = detail => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/archives/index',
      }),
    );
  };
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
    this.props.form.resetFields(['fileRack', 'fileLocation', 'fileBox']);
    this.fileRack(val)
  }
  // 根据档案架获取档案位置
  fileRackChange = val => {
    this.props.form.resetFields(['fileLocation', 'fileBox']);
    this.fileLocation(val)
  }
  // 根据档案位置获取档案盒
  fileLocationChange = val => {
    this.props.form.resetFields(['fileBox']);
    this.fileBox(val)
  }
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
        detailsList: data.data ? data.data : {}
      })
      this.archivesCenterChange(data.data.fileRoom)
      this.fileRackChange(data.data.fileRack)
      this.fileLocationChange(data.data.fileLocation)
    });
  }
  // 保存修改
  preservation = () => {
    const { dispatch, location } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      values.fileSource = '0'
      //修改
      dispatch({
        type: 'archive/update',
        payload: {
          TPhysicalFiling: values,
          ignoreModule: [''],
          listModule: ['TPhysicalFiling'],
          coreModule: 'TAmsProduct',
          id: location.query.id
        },
      }).then(data => {
        if (data) {
          if (data.flag) {
            this.goBack()
          }
        }
      });;
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { detailsList,disabled } = this.state;
    const { archivesCategoryData, documentTypeData, fileTypeData, codeList, archivesCenterList, fileRackList, fileLocationList, fileBoxList } = this.props.archive;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
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
              title: '修改',
              url: '',
            },
          ]}
          fuzz={''}
        />
        <Card>
          <Row style={{ paddingBottom: 10 }} justify="end">
            <div style={{ float: 'right' }}>
              <Button type="primary" onClick={this.preservation}>
                保存
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.goBack}>
                取消
              </Button>
            </div>
          </Row>
          <Row>
            <Form {...layout}>
              <Col span={8}>
                <Form.Item label="文件名称">
                  {getFieldDecorator(
                    'fileName',
                    {
                      initialValue: detailsList.fileName,
                      rules: [
                        {
                          required: true,
                          message: '文件名称不可为空',
                        },
                      ],
                    },
                  )(
                    <Input
                      autoComplete="off"
                      allowClear
                      placeholder="请输入文件名称"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="档案号">
                  {getFieldDecorator(
                    'fileNo',
                    { initialValue: detailsList.fileNo },
                  )(
                    <Input
                      autoComplete="off"
                      disabled
                      allowClear
                      placeholder="请输入档案号"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="文档载体">
                  {getFieldDecorator(
                    'fileCarrier',
                    {
                      initialValue: detailsList.fileCarrier,
                      rules: [
                        {
                          required: true,
                          message: '文档载体不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择文档载体"
                      showArrow={false}
                      optionFilterProp="children"
                    >
                      {codeList.fileCarrier &&
                        codeList.fileCarrier.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="档案室">
                  {getFieldDecorator(
                    'fileRoom',
                    {
                      initialValue: detailsList.fileRoom,
                      rules: [
                        {
                          required: true,
                          message: '档案室不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      placeholder="请选择档案室"
                      onChange={this.archivesCenterChange}
                      showArrow={false}
                      showSearch
                    >
                      {archivesCenterList &&
                        archivesCenterList.map(item => (
                          <Select.Option key={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="档案架">
                  {getFieldDecorator(
                    'fileRack',
                    {
                      initialValue: detailsList.fileRack,
                      rules: [
                        {
                          required: true,
                          message: '档案架不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      placeholder="请选择档案架"
                      onChange={this.fileRackChange}
                      showArrow={false}
                      showSearch
                    >
                      {fileRackList &&
                        fileRackList.map(item => (
                          <Select.Option key={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="档案位置">
                  {getFieldDecorator(
                    'fileLocation',
                    {
                      initialValue: detailsList.fileLocation,
                      rules: [
                        {
                          required: true,
                          message: '档案位置不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      placeholder="请选择档案位置"
                      onChange={this.fileLocationChange}
                      showArrow={false}
                      showSearch
                    >
                      {fileLocationList &&
                        fileLocationList.map(item => (
                          <Select.Option key={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="档案盒">
                  {getFieldDecorator(
                    'fileBox',
                    {
                      initialValue: detailsList.fileBox,
                      rules: [
                        {
                          required: true,
                          message: '档案盒不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      placeholder="请选择档案盒"
                      // onChange={this.changeValue}
                      showArrow={false}
                      showSearch
                    >
                      {fileBoxList &&
                        fileBoxList.map(item => (
                          <Select.Option key={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="保管期限">
                  {getFieldDecorator(
                    'storageTime',
                    {
                      initialValue: detailsList.storageTime,
                      rules: [
                        {
                          required: true,
                          message: '保管期限不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择保管期限"
                      showArrow={false}
                      optionFilterProp="children"
                    >
                      {codeList.duration &&
                        codeList.duration.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </Card>
      </div>
    );
  }
}


const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ archive }) => ({
      archive,
    }))(modify),
  ),
);
export default WrappedAdvancedSearchForm;
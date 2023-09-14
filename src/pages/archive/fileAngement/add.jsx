/*档案整理新增修改页面*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, Col, Row, Form, Input, Select, Button } from 'antd';
import { PageContainers } from '@/components';
import { routerRedux } from 'dva/router';
class add extends Component {
  state = {
    disabled: false,
    detailsList: {},
    title: ''
  };
  componentDidMount = () => {
    const { location } = this.props;
    this.getData();
    if (location.query.val == 'add') {
      this.setState({
        title: '新增'
      })
    } else if (location.query.val == 'modify') {
      this.setState({
        title: '修改'
      })
      this.details()
    }
  };
  //返回档案整理页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/fileAngement/index',
      }),
    );
  };
  //取到下拉数据
  getData() {
    const { dispatch } = this.props;
    //档案大类
    dispatch({
      type: 'archive/archivesCategory',
    });
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
  //明细分类
  fileType = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/fileType',
      payload: val,
    });
  };
  //档案架
  fileRack = val => {
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
  // 文档类型数据
  documentType = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/documentType',
      payload: val,
    });
  };
  // 文档类型下拉选择的值
  documentTypeChange = val => {
    this.props.form.resetFields(['detailClass']);
    this.fileType(val);
  };
  //档案大类下拉选择的值
  fileChange = val => {
    this.props.form.resetFields(['fileType', 'detailClass']);
    this.documentType(val);
  };
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
      this.fileChange(data.data.fileCategories)
      this.documentTypeChange(data.data.fileType)
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
      if (location.query.val == 'modify') {
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
      } else {
        // 保存
        dispatch({
          type: 'archive/preservation',
          payload: {
            TPhysicalFiling: values,
            ignoreModule: [''],
            listModule: ['TPhysicalFiling'],
            coreModule: 'TAmsProduct',
          },
        }).then(data => {
          if (data) {
            if (data.flag) {
              this.goBack()
            }
          }
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, detailsList } = this.state;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { archivesCategoryData, documentTypeData, fileTypeData, codeList, archivesCenterList, fileRackList, fileLocationList, fileBoxList } = this.props.archive;
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
              title: '档案整理',
              url: '/physicalArchives/archive/fileAngement/index',
            },
            {
              title: this.state.title,
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
                <Form.Item label="档案大类">
                  {getFieldDecorator(
                    'fileCategories',
                    {
                      initialValue: detailsList.fileCategories,
                      rules: [
                        {
                          required: true,
                          message: '档案大类不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择档案大类"
                      showArrow={false}
                      optionFilterProp="children"
                      onChange={this.fileChange}
                    >
                      {archivesCategoryData &&
                        archivesCategoryData.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="文档类型">
                  {getFieldDecorator(
                    'fileType',
                    {
                      initialValue: detailsList.fileType,
                      rules: [
                        {
                          required: true,
                          message: '文档类型不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择文档类型"
                      showArrow={false}
                      optionFilterProp="children"
                      onChange={this.documentTypeChange}
                    >
                      {documentTypeData &&
                        documentTypeData.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="明细分类">
                  {getFieldDecorator(
                    'detailClass',
                    {
                      initialValue: detailsList.detailClass,
                      rules: [
                        {
                          required: true,
                          message: '明细分类不可为空',
                        },
                      ],
                    },
                  )(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择明细分类"
                      showArrow={false}
                      optionFilterProp="children"
                    >
                      {fileTypeData &&
                        fileTypeData.map(item => (
                          <Select.Option key={item.code}>{item.name}</Select.Option>
                        ))}
                    </Select>,
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
    }))(add),
  ),
);
export default WrappedAdvancedSearchForm;

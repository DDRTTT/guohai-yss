//补充信息弹框
import React, { Component } from 'react';
import {
    Form,
    Modal,
    Input,
    Icon,
    Select,
    Row,
    Col,
} from 'antd';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
class supplementModal extends Component {
    state={
        detailsList:{}
    }
    componentDidMount = () => {
        this.getData();
        this.details()
    }
    //取到下拉数据
    getData() {
        const { dispatch } = this.props;
        // 词汇字典
        dispatch({
            type: 'archive/getCodeList',
            payload: ['fileCarrier'],
        });
        // 档案室
        dispatch({
            type: 'archive/getArchivesCenter',
            payload: '-1'
        });
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
                id: this.props.supplementInfo.id
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
    handleOk = () => {
        const { dispatch, location } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            // values.fileSource = '0'
            //修改
            dispatch({
                type: 'archive/update',
                payload: {
                    TPhysicalFiling: {
                        // ...this.props.supplementInfo,
                        ...values
                    },
                    ignoreModule: [''],
                    listModule: ['TPhysicalFiling'],
                    coreModule: 'TAmsProduct',
                    id: this.props.supplementInfo.id
                },
            }).then(data => {
                if (data) {
                    if (data.flag) {
                        this.props.supplementClose && this.props.supplementClose()
                        this.props.getList && this.props.getList()
                    }
                }
            });;

        })
    }
    handleCancel = () => {
        this.props.supplementClose && this.props.supplementClose()
    }
    render() {
        const { codeList, archivesCenterList, fileRackList, fileLocationList, fileBoxList } = this.props.archive;
        const { getFieldDecorator } = this.props.form;
        const { detailsList  } = this.state;
        const layout = {
            labelAlign: 'right',
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <div>
                <Modal
                    title={'补录信息'}
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={1000}
                >
                    <Row>
                        <Form {...layout}>
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
                </Modal>
            </div >
        );
    }
}

const WrappedAdvancedSearchForm = errorBoundary(
    Form.create()(
        connect(({ archive }) => ({
            archive,
        }))(supplementModal),
    ),
);
export default WrappedAdvancedSearchForm;
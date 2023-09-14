// OA任务池页面
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import styles from './index.less';
import { linkHoc } from '@/utils/hocUtil';
import { filePreviewWithBlobUrl } from '@/utils/download';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import { launchIntoFullscreen, uuid } from '@/utils/utils';
import { Table } from '@/components';
import List from '@/components/List';

const IMGs =
  'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';

@Form.create()
class OAprocessDistribute extends Component {
  state = {
    visible: false,
    detailModalVisible: false,
    record: {},
    date: '',
    time: '',
    isHandle: '',
    selectedRowKeys: [],
    ablePreview: false,
    blobUrl: '',
    fileType: '',
    IMG: false,
    awpFileNumber: '',
    page: 1, // 任务列表
    limit: 10, // 任务列表
    pageNum: 1, // 文件列表
    pageSize: 10, // 文件列表
    title: '',
    classification: [],
    keyWords: '',
    columns: [
      {
        key: 'title',
        title: '标题',
        dataIndex: 'title',
        width: 600,
        sorter: true,
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                ? '-'
                : 0}
            </Tooltip>
          );
        },
        ellipsis: true,
      },
      {
        key: 'idHandleString',
        title: '结果',
        dataIndex: 'idHandleString',
        sorter: true,
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                ? '-'
                : 0}
            </Tooltip>
          );
        },
      },
      {
        key: 'businessClassification',
        title: '业务分类',
        dataIndex: 'businessClassification',
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                ? '-'
                : 0}
            </Tooltip>
          );
        },
        ellipsis: true,
        sorter: true,
      },
      {
        key: 'createTime',
        title: '消息时间',
        dataIndex: 'createTime',
        sorter: true,
        render: text => {
          return (
            <Tooltip title={text}>
              {text
                ? text.toString().replace(/null/g, '-')
                : text === '' || text === undefined
                ? '-'
                : 0}
            </Tooltip>
          );
        },
      },
      {
        key: 'handel',
        title: '操作',
        fixed: 'right',
        dataIndex: 'handel',
        width: 150,
        render: (val, record) => (
          <div>
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                this.lookMore(record);
              }}
            >
              查看
            </a>
            {/* <a
              style={{
                marginRight: 10,
                color: record.busClassification != 2 ? '#2450A5' : '#cccccc',
              }}
              onClick={() => {
                this.distribute(record);
              }}
            >
              分发
            </a> */}
            {record.busClassification == '1' || record.busClassification == '3' ? (
              <a
                style={{
                  marginRight: 10,
                }}
                onClick={() => {
                  this.distribute(record);
                }}
              >
                分发
              </a>
            ) : (
              ''
            )}
            {/* <Popconfirm title="确定要删除吗?" onConfirm={() => this.delData(record,'delete')}>
                  <a style={{ marginRight: 10 }} >删除</a>
                </Popconfirm> */}
          </div>
        ),
      },
    ],
  };

  // // 切换时间
  // changeDate = (date, dateString) => {
  //   this.setState({
  //     date: dateString ? moment(dateString, 'YYYY-MM-DD') : dateString,
  //     time: dateString,
  //   });
  // };

  // 切换状态
  changeStatus = e => {
    this.setState({
      isHandle: e,
    });
  };

  // 切换业务分类
  changeClassification = e => {
    this.setState({
      classification: e,
    });
  };

  // 切换标题
  changeTitle = e => {
    this.setState({
      title: e,
    });
  };

  // 查询
  handlerSearch = fieldsValue => {
    const time =
      fieldsValue && fieldsValue.time ? moment(fieldsValue.time).format('YYYY-MM-DD') : '';
    const payload = {
      ...fieldsValue,
      time,
      currentPage: 1,
      pageSize: 10,
      keyWords: this.state.keyWords,
    };
    this.setState({ page: 1, limit: 10, ...fieldsValue }, () => {
      this.handleGetTableList(payload);
    });
  };

  // 重置
  handleReset = () => {
    const fieldsValue = {
      time: '',
      title: '',
      classification: [],
      isHandle: '',
      keyWords: '',
    };
    const payload = {
      ...fieldsValue,
      currentPage: 1,
      pageSize: 10,
    };
    this.setState({ page: 1, limit: 10, ...fieldsValue }, () => {
      this.handleGetTableList(payload);
    });
  };

  // 选中列表
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 任务列表总条数
  showTotal = total => {
    return `共 ${total} 条数据`;
  };

  // 文件列表总条数
  showFileListTotal = fileListTotal => {
    return `共 ${fileListTotal} 条数据`;
  };

  // 切换页码（任务列表）
  changePage = (page, pageSize) => {
    this.setState({ page, limit: pageSize });
    const payload = {
      classification: this.state.classification,
      isHandle: this.state.isHandle,
      time: this.state.time,
      currentPage: page,
      pageSize,
      keyWords: this.state.keyWords,
    };
    this.handleGetTableList(payload);
  };

  // 切换页大小(任务列表)
  changePageSize = (current, size) => {
    this.setState({ page: current, limit: size });
    const payload = {
      classification: this.state.classification,
      isHandle: this.state.isHandle,
      time: this.state.time,
      currentPage: current,
      pageSize: size,
      keyWords: this.state.keyWords,
    };
    this.handleGetTableList(payload);
  };

  // 切换页码（文件列表）
  changePageNum = (page, pageSize) => {
    this.setState({ pageNum: page, pageSize }, () => {
      const params = {
        id: this.state.record.id,
        currentPage: this.state.pageNum,
        pageSize: this.state.pageSize,
      };
      this.props.dispatch({
        type: 'OAprocessDistribute/getFileInfo',
        payload: { params, fileType: this.state.record.businessClassification },
      });
    });
  };

  // 切换页大小(文件列表)
  changePageSizeNum = (current, size) => {
    this.setState({ pageNum: current, pageSize: size }, () => {
      const params = {
        id: this.state.record.id,
        currentPage: this.state.pageNum,
        pageSize: this.state.pageSize,
      };
      this.props.dispatch({
        type: 'OAprocessDistribute/getFileInfo',
        payload: { params, fileType: this.state.record.businessClassification },
      });
    });
  };

  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // handleCancelDetail
  handleCancelDetail = () => {
    this.setState({ detailModalVisible: false });
  };

  // 生命周期钩子函数
  componentDidMount() {
    const { dispatch } = this.props;
    const payload = {
      time: '',
      isHandle: '',
      currentPage: this.state.page,
      pageSize: this.state.limit,
      keyWords: this.state.keyWords,
    };
    this.handleGetTableList(payload);

    dispatch({
      type: 'OAprocessDistribute/getBusinessType',
    });
  }

  // 请求表格列表
  handleGetTableList = payload => {
    this.props.dispatch({
      type: 'OAprocessDistribute/searchTableData',
      payload,
    });
  };

  // 分发
  distribute(record) {
    // this.setState({
    //   visible: true,
    //   record,
    // });
    const { busClassification } = record;
    const { id } = record;
    const pathMap = {
      '1': '/dynamicPage/pages/产品评审/4028e7b67443dc6e0174490aea870006/发起流程',
      // "2":"/dynamicPage/pages/合同定稿/4028e7b674b6714e0174e9e86ecd0039/发起流程",
      '3': '/dynamicPage/pages/合同用印/4028e7b673bdc3af0174330245ae0097/流程发起',
    };
    const path = pathMap[busClassification];
    if (path) {
      (async () => {
        const pathname = `${path}?oaTitle=${id}`;
        await this.props.dispatch(
          routerRedux.push({
            pathname,
          }),
        );
        this.props.dispatch({
          type: 'OAprocessDistribute/updateHandleState',
          payload: [id],
        });
      })();
    } else {
      message.warn('该标题属于合同信息维护类，暂不支持分发!');
    }
  }

  // 查看
  lookMore(record) {
    this.setState({
      detailModalVisible: true,
      record,
      pageNum: 1,
      pageSize: 10,
    });
    const params = { id: record.id, currentPage: 1, pageSize: 10 };
    this.props.dispatch({
      type: 'OAprocessDistribute/getFileInfo',
      payload: { params, fileType: record.businessClassification },
    });
  }

  // 提交
  handleSubmit = e => {
    const {
      OAprocessDistribute: { flowNameList },
    } = this.props;
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const flow = flowNameList.filter(item => item.code === values.flowName);
        const { path } = flow[0];
        const { id } = this.state.record;
        (async () => {
          // let pathname = values.flowName === 'M001_7' ? `${path}?oaTitle=${id}`:`${path}`
          const pathname = `${path}?oaTitle=${id}`;
          await this.props.dispatch(
            routerRedux.push({
              pathname,
            }),
          );
          this.props.dispatch({
            type: 'OAprocessDistribute/updateHandleState',
            payload: [id],
          });
        })();
      }
    });
  };

  /**
   * 查看预览
   * * */
  handleFilePreviewWithBlob({ awpFileNumber, fileType, awpName }) {
    if (IMGs.includes(fileType)) {
      this.setState(
        {
          ablePreview: true,
          IMG: true,
        },
        () => {
          filePreviewWithBlobUrl(
            `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}@${awpName}`,
            blobUrl => {
              this.setState({
                blobUrl,
              });
            },
          );
        },
      );
    } else {
      if (!getDocumentType(fileType)) {
        message.warn('目前不支持预览该格式的文件');
        return;
      }
      this.setState({
        ablePreview: true,
        awpFileNumber,
        fileType,
      });
    }
  }

  filePreview(record) {
    this.handleFilePreviewWithBlob({
      awpFileNumber: record.fileSerialNumber,
      fileType: record.fileForm,
      awpName: record.fileName,
    });
  }

  onTableChange = (pagination, filters, sorter) => {
    const { page, limit } = this.state;
    const { order, field } = sorter;
    const payload = {
      currentPage: page,
      pageSize: limit,
      direction: order ? (order === 'descend' ? 'desc' : 'asc') : '',
      field: order ? field : '',
      keyWords: this.state.keyWords,
      time: this.state.time,
      title: this.state.title,
      classification: this.state.classification,
      isHandle: this.state.isHandle,
    };
    this.handleGetTableList(payload);
  };

  callBackHandler = value => {
    this.setState({ columns: value });
  };

  render() {
    const {
      awpFileNumber,
      IMG,
      fileType,
      blobUrl,
      record,
      page,
      limit,
      pageNum,
      pageSize,
      columns,
    } = this.state;
    const {
      OAprocessDistribute: {
        dataSource,
        total,
        flowNameList,
        fileInfoList,
        fileListTotal,
        businessType,
      },
      form: { getFieldDecorator },
      global: {
        saveIP: { gateWayIp },
      },
    } = this.props;
    const url = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${awpFileNumber}`;
    const key = uuid();

    const fileColumns = [
      {
        title: '名称',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      {
        title: '文件格式',
        dataIndex: 'fileForm',
        key: 'fileForm',
      },
      {
        title: '文件版本',
        dataIndex: 'fileVersion',
        key: 'fileVersion',
      },
      {
        title: '文件来源',
        dataIndex: 'source',
        key: 'source',
        render: text => {
          return <div>{text === '0' ? 'OA' : '本地上传'}</div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        width: 200,
        // fixed: 'right',
        render: (val, record) => (
          <div>
            {/* <a style={{ marginRight: 10 }} onClick={() => { this.lookMore(record,'look') }}>查看</a> */}
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                this.filePreview(record);
              }}
            >
              预览
            </a>
          </div>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const handleModel = () => this.setState({ ablePreview: false, IMG: false, blobUrl: '' });

    const formItemData = [
      {
        name: 'title',
        label: '标题',
        type: 'input',
      },
      {
        name: 'classification',
        label: '业务分类',
        type: 'select',
        readSet: { name: 'name', code: 'code', bracket: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: businessType.O006 || [],
      },
      {
        name: 'time',
        label: '消息时间',
        type: 'DatePicker',
      },
      {
        name: 'isHandle',
        label: '状态',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { maxTagCount: 1 },
        option: [
          { name: '未分发', code: '0' },
          { name: '已分发', code: '1' },
        ],
      },
    ];
    return (
      <>
        <List
          pageCode="OAprocessDistribute"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          taskTypeCode={null}
          formItemData={formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          fuzzySearchBool={false}
          tableList={
            <>
              <Table
                rowKey="id"
                // rowSelection={{
                //   selectedRowKeys: this.state.selectedRowKeys,
                //   onChange: this.onSelectChange,
                // }}
                dataSource={dataSource}
                columns={columns}
                // scroll={{ x: 880 }}
                scroll={{ x: 1300 }}
                pagination={false}
                onChange={this.onTableChange}
              />
              <Pagination
                style={{ textAlign: 'right', marginTop: 15 }}
                onChange={this.changePage}
                onShowSizeChange={this.changePageSize}
                total={total}
                pageSize={limit}
                current={page}
                showTotal={this.showTotal}
                showSizeChanger
                showQuickJumper
              />
            </>
          }
        />
        <ModalWin
          id="taskManagementDeal"
          width="80vw"
          resetContentHeight={true}
          hideModalFooter={true}
          denominator={10}
          visible={this.state.ablePreview}
          title="文件预览"
          okText="确定"
          onOk={handleModel}
          onCancel={handleModel}
        >
          <Button
            onClick={launchIntoFullscreen}
            style={{ margin: '20px 0', float: 'right', zIndex: 10 }}
          >
            全屏
          </Button>
          {IMG ? (
            <Spin
              tip="加载中..."
              spinning={!blobUrl.length}
              wrapperClassName={styles.iframeContent}
            >
              <iframe width="100%" height="100%" src={blobUrl} title="预览文件" id="preview" />
            </Spin>
          ) : (
            <OnlineEdit fileType={fileType} _key={key} title="预览文件" url={url} />
          )}
        </ModalWin>
        <Modal
          title="分发"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          zIndex={998}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="流程名称">
              {getFieldDecorator('flowName', {
                rules: [
                  {
                    required: true,
                    message: '请选择流程名称',
                  },
                ],
              })(
                <Select initialValue="M001_17" style={{ width: '100%' }}>
                  {flowNameList.map(optionItem => (
                    <Select.Option key={optionItem.code} value={optionItem.code}>
                      {optionItem.label || optionItem.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button onClick={this.handleCancel} style={{ marginRight: '10px' }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="详情"
          visible={this.state.detailModalVisible}
          footer={null}
          onCancel={this.handleCancelDetail}
          zIndex={998}
          width={900}
        >
          <Form {...formItemLayout}>
            <Row style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Form.Item label="标题:">
                  <Input value={record.title} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="业务分类:">
                  <Input value={record.businessClassification} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="分发状态:">
                  <Input value={record.idHandleString} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="创建时间:">
                  <Input value={record.createTime} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="id"
            dataSource={fileInfoList}
            columns={fileColumns}
            scroll={{ x: 700 }}
            pagination={false}
          />
          <Pagination
            style={{ textAlign: 'right', marginTop: 15 }}
            onChange={this.changePageNum}
            onShowSizeChange={this.changePageSizeNum}
            total={fileListTotal}
            showTotal={this.showFileListTotal}
            pageSize={pageSize}
            current={pageNum}
            showSizeChanger
            showQuickJumper
          />
          {/* <Row>
              <Col span={2} offset={22} style={{marginTop:10}}>
                <Button
                  onClick={() => {
                    this.setState({ detailModalVisible: false });
                  }}
                >
                  取消
                </Button>
              </Col>
            </Row> */}
        </Modal>
      </>
    );
  }
}

export default linkHoc()(
  connect(({ global, OAprocessDistribute, archiveTaskHandleList }) => ({
    OAprocessDistribute,
    archiveTaskHandleList,
    global,
  }))(OAprocessDistribute),
);

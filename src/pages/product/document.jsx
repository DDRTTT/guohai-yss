// 产品数据
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Form, Breadcrumb, Button, message, Row, Col, Pagination } from 'antd';
import { Card, PageContainers, Table } from '@/components';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import styles from './bulletinBoard.less';
import { uuid, launchIntoFullscreen } from '@/utils/utils';
import OnlineEdit from '@/components/OnlineEdit';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import { filePreview, downloadNoToken, filePreviewWithBlobUrl } from '@/utils/download';
// 布局
const layout = {
  labelAlign: 'right',
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
@Form.create()
class Index extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    seachData: {},
    showModalWin: false,
    showWhat: false,
    blobUrl: '',
    fileTypeData: '',
    urlData: '',
  };

  componentDidMount() {
    this.handleGetDicts();
    this.setState({ proCode: this.props?.proCode || '' }, () => {
      this.handleGetTableList();
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD') : '';
      const endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD') : '';
      this.setState(
        { pageNum: '1', pageSize: '10', seachData: { ...values, ...{ startTime, endTime } } },
        () => {
          this.handleGetTableList();
        },
      );
    });
  };
  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ seachData: {}, pageNum: '1', pageSize: '10' }, () => {
      this.handleGetTableList();
    });
  };

  // 切换页码（任务列表）
  changePage = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize: pageSize }, () => {
      this.handleGetTableList();
    });
  };

  /**
   * 初始化表格数据
   */
  handleGetTableList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, seachData, proCode } = this.state;
    dispatch({
      type: 'productForInfo/productFileDataFunc',
      payload: {
        proCode: proCode,
        pageNum: pageNum,
        pageSize: pageSize,
        ...seachData,
      },
    });
  };

  // 获取字典数据
  handleGetDicts = () => {
    const { dispatch } = this.props;
    // 数据字典
    dispatch({
      type: 'productForbulletinBoard/getDicts',
      payload: 'M001',
    });
    dispatch({
      type: 'productForInfo/getProductFileListDocTypeFunc',
      payload: { moduleCode: '' },
    });
    dispatch({
      type: 'productForInfo/getProductFileListFileTypeFunc',
      payload: { id: '' },
    });
    dispatch({
      type: 'productForInfo/getUserList',
      payload: {},
    });

    // 流程名称下拉
    dispatch({
      type: 'productForInfo/getProcessName',
      payload: {},
    });
  };

  // 查看
  handleCanCheck = record => {
    message.success('查看预览准备中 . . .');
    const {
      saveIP: { gateWayIp },
    } = this.props?.global;
    const IMGs =
      'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';
    if (IMGs.includes(record.fileForm)) {
      this.setState({ showModalWin: true, showWhat: false });
      filePreviewWithBlobUrl(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`,
        blobUrl => this.setState({ blobUrl }),
      );
    } else {
      this.setState({
        fileTypeData: record.fileForm,
        showModalWin: true,
        showWhat: false,
        urlData: `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}`,
      });
    }
  };

  handleShow = () => {
    const { showModalWin, showWhat, blobUrl, fileTypeData, urlData } = this.state;
    const key = uuid();
    return (
      <ModalWin
        id="taskManagementDeal"
        width="80vw"
        resetContentHeight={true}
        hideModalFooter={true}
        denominator={10}
        visible={showModalWin}
        title="文件预览"
        okText="确定"
        onOk={() => {
          this.setState({ showModalWin: false, blobUrl: '' });
        }}
        onCancel={() => {
          this.setState({ showModalWin: false, blobUrl: '' });
        }}
      >
        <Button
          onClick={launchIntoFullscreen}
          style={{ margin: '20px 0', float: 'right', zIndex: 10 }}
        >
          全屏
        </Button>
        {showWhat ? (
          <Spin tip="加载中..." spinning={!blobUrl.length} wrapperClassName={styles.iframeContent}>
            <iframe
              width="100%"
              height="100%"
              src={blobUrl}
              title="预览文件"
              id="preview"
              onLoad={() => inframeLoad()}
              className={styles.preview}
            />
          </Spin>
        ) : (
          <OnlineEdit fileType={fileTypeData} _key={key} title="预览文件" url={urlData} />
        )}
      </ModalWin>
    );
  };

  render() {
    const { pageNum, pageSize } = this.state;
    const { listLoading, productForInfo, form, productForbulletinBoard } = this.props;
    const {
      productFileData,
      productFileListDocType,
      productFileListFileType,
      processNameList,
    } = productForInfo;
    const { dicts } = productForbulletinBoard;

    const formItemData = [
      {
        name: 'moduleCodeList',
        label: '所属流程',
        type: 'select',
        readSet: { name: 'processName', code: 'moduleCode' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: processNameList || [],
      },
      {
        name: 'documentTypeList',
        label: '文档类型',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productFileListDocType || [],
      },
      {
        name: 'fileTypeList',
        label: '明细分类',
        type: 'select',
        readSet: { name: 'name', code: 'code' },
        config: { mode: 'multiple', maxTagCount: 1 },
        option: productFileListFileType || [],
      },
      {
        name: 'fileName',
        label: '文档名称',
      },
      {
        name: 'startTime',
        label: '归档开始日期',
        type: 'DatePicker',
        config: {
          format: 'YYYY-MM-DD',
        },
      },
      {
        name: 'endTime',
        label: '归档结束日期',
        type: 'DatePicker',
        config: {
          format: 'YYYY-MM-DD',
        },
      },
    ];

    // 表头数据
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        ...tableRowConfig,
        align: 'right',
        sorter: false,
        width: 100,
      },
      {
        title: '文档名称',
        dataIndex: 'fileName',
        key: 'fileName',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '档案大类',
        dataIndex: 'archivesClassification',
        key: 'archivesClassification',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '文档类型',
        dataIndex: 'documentType',
        key: 'documentType',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '明细分类',
        dataIndex: 'fileType',
        key: 'fileType',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '所属流程',
        dataIndex: 'processId',
        key: 'processId',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '文档来源',
        dataIndex: 'fileSource',
        key: 'fileSource',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '上传时间',
        dataIndex: 'uploadFileTime',
        key: 'uploadFileTime',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '归档时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '文档版本',
        dataIndex: 'stateName',
        key: 'stateName',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '版本号',
        dataIndex: 'fileVersion',
        key: 'fileVersion',
        align: 'center',
        ...tableRowConfig,
        sorter: false,
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: (_, record) => {
          return (
            <div>
              <Button type="link" onClick={() => this.handleCanCheck(record)}>
                查看
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <>
        <Form {...layout} onSubmit={this.handleSearch} className={'seachForm2'}>
          <Row gutter={24}>
            <CustomFormItem formItemList={formItemData} form={form} />
            <Col span={6} className={'textAlign_r padding_t8 padding_b8 float_r'}>
              <Button
                type="primary"
                loading={listLoading}
                htmlType="submit"
                className={'margin_l5 margin_l5'}
              >
                查询
              </Button>
              <Button onClick={this.handleReset} className={'margin_l5 margin_r5'}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={productFileData?.fileInfoList || []}
          scroll={{ x: columns.length * 200 - 200 }}
          loading={listLoading}
        />
        <Pagination
          style={{ textAlign: 'right', marginTop: 15 }}
          onChange={this.changePage}
          onShowSizeChange={this.changePage}
          total={productFileData?.total || 0}
          pageSize={pageSize}
          current={pageNum}
          showTotal={total => `共 ${total} 条数据`}
          showSizeChanger
          showQuickJumper
        />
        {this.handleShow()}
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ productForInfo, productForbulletinBoard, loading, global }) => ({
        productForInfo,
        productForbulletinBoard,
        global,
        listLoading: loading.effects['productForInfo/productFileDataFunc'],
      }))(Index),
    ),
  ),
);
//
export default WrappedSingleForm;

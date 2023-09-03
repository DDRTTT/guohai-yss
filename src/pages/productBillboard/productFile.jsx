/**
 * 产品看板-查看产品-产品文档
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Spin,
  message,
  Dropdown,
  Menu,
  Select,
  DatePicker,
  Checkbox,
  Input,
  Tooltip,
} from 'antd';
import { connect, routerRedux } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import MyContext from './myContext';
import styles from './index.less';
import { filePreview, downloadNoToken, filePreviewWithBlobUrl } from '@/utils/download';
import OnlineEdit, { getDocumentType } from '@/components/OnlineEdit';
import { uuid, launchIntoFullscreen } from '@/utils/utils';
import ModalWin from '@/pages/manuscriptProjectManage/projectInfoManger/addProjectInfo/ModalWin';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleAddStageSlecct } from './baseFunc';
import { Table } from '@/components';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const ProductFile = ({
  dispatch,
  listLoading,
  productBillboard: { dicts, productFileData, productFileListDocType, productFileListFileType },
  global: {
    saveIP: { gateWayIp },
  },
}) => {
  const { proCodeArguments } = useContext(MyContext); // 子组件接受的数据
  const dataObj = useRef({}); // 请求参数
  const pageNumData = useRef(1);
  const pageSizeData = useRef(10);
  const totalData = useRef(0);
  const moduleCodeListData = useRef([]); // 产品阶段
  const documentTypeListData = useRef([]); // 文档类型
  const fileTypeListData = useRef([]); // 明细分类
  const fileNameData = useRef(''); // 文档名称
  const startTimeData = useRef(''); // 归档开始时间
  const endTimeData = useRef(''); // 归档结束时间
  const flagData = useRef(undefined);
  const downloadAllArray = useRef([]); // 批量下载参数
  const [blobUrl, setBlobUrl] = useState('');
  const [showModalWin, setShowModalWin] = useState(false);
  const [showWhat, setShowWhat] = useState(false);
  const fileTypeData = useRef('');
  const urlData = useRef('');
  const IMGs =
    'webp.dubmp.pcx.zhitif.gif.jpg.jpeg.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.png.hdri.raw.wmf.flic.emf.ico';

  /**
   * 获取产品文档表格
   */
  const handleGetDictsData = () => {
    dispatch({
      type: 'productBillboard/getDicts',
      payload: { codeList: ['M001'] },
    });
  };

  /**
   * 获取产品文档表格下拉框列表(文档类型)
   */
  const handleGetFileListDocTypeData = () => {
    dispatch({
      type: 'productBillboard/getProductFileListDocTypeFunc',
      payload: { moduleCode: '' },
    });
  };

  /**
   * 获取产品文档表格下拉框列表(明细分类)
   */
  const handleGetFileListFileTypeData = () => {
    dispatch({
      type: 'productBillboard/getProductFileListFileTypeFunc',
      payload: { id: '' },
    });
  };
  /**
   * 获取产品文档表格
   */
  const handleGetProductFileData = () => {
    handleGetDataObj();
    dispatch({
      type: 'productBillboard/productFileDataFunc',
      payload: dataObj.current,
      callback: res => {
        totalData.current = res.total;
      },
    });
  };
  console.log(showModalWin);

  const inframeLoad = () => {
    console.log(123123123);
    if (
      showWhat &&
      document.getElementById('preview') &&
      document.getElementById('preview').contentWindow.document.getElementsByTagName('img')[0]
    ) {
      setTimeout(() => {
        document
          .getElementById('preview')
          .contentWindow.document.getElementsByTagName('img')[0].style.width = '100%';
      }, 1000);
    }
  };

  const handleShow = () => {
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
          setBlobUrl('');
          setShowModalWin(false);
        }}
        onCancel={() => {
          setBlobUrl('');
          setShowModalWin(false);
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
          <OnlineEdit
            fileType={fileTypeData.current}
            _key={key}
            title="预览文件"
            url={urlData.current}
          />
        )}
      </ModalWin>
    );
  };

  // 查看
  const handleCanCheck = record => {
    message.success('查看预览准备中 . . .');
    if (IMGs.includes(record.fileForm)) {
      setShowModalWin(true);
      setShowWhat(true);
      filePreviewWithBlobUrl(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`,
        blobUrl => setBlobUrl(blobUrl),
      );
    } else {
      fileTypeData.current = record.fileForm;
      urlData.current = `${gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}`;
      setShowModalWin(true);
      setShowWhat(false);
    }
  };

  /**
   * 下载
   */
  const handleCanDownload = record => {
    downloadNoToken(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`,
    );
  };

  /**
   * 更新请求参数
   */
  const handleGetDataObj = () => {
    dataObj.current = {
      proCode: proCodeArguments,
      pageNum: pageNumData.current,
      pageSize: pageSizeData.current,
      moduleCodeList: moduleCodeListData.current,
      documentTypeList: documentTypeListData.current,
      fileTypeList: fileTypeListData.current,
      fileName: fileNameData.current,
      startTime: startTimeData.current,
      endTime: endTimeData.current,
      flag: flagData.current,
    };
  };

  // 表头数据
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      ...tableRowConfig,
      align: 'right',
      width: 140,
    },
    {
      title: '文档名称',
      dataIndex: 'fileName',
      key: 'fileName',
      align: 'center',
      ...tableRowConfig,
      width: 400,
    },
    {
      title: '档案大类',
      dataIndex: 'archivesClassification',
      key: 'archivesClassification',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '文档类型',
      dataIndex: 'documentType',
      key: 'documentType',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '明细分类',
      dataIndex: 'fileType',
      key: 'fileType',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '所属流程',
      dataIndex: 'processId',
      key: 'processId',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '文档来源',
      dataIndex: 'fileSource',
      key: 'fileSource',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadFileTime',
      key: 'uploadFileTime',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '归档时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '文档版本',
      dataIndex: 'stateName',
      key: 'stateName',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '版本号',
      dataIndex: 'fileVersion',
      key: 'fileVersion',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '更新用户',
      dataIndex: 'lastEditorPeople',
      key: 'lastEditorPeople',
      align: 'center',
      ...tableRowConfig,
      width: 140,
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      align: 'center',
      width: 220,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div>
            <Button type="link" /*  disabled={disabled} */ onClick={() => handleCanCheck(record)}>
              查看
            </Button>
            <Button type="link" onClick={() => handleCanDownload(record)}>
              导出
            </Button>
          </div>
        );
      },
    },
  ];

  /**
   * 页码属性变更
   * @method  handleUpdataPageSize
   * @param   {pageSize}     string    表格行数据
   * @return  {string}
   */
  const handleUpdataPageSize = (current, pageSize) => {
    pageSizeData.current = pageSize;
    pageNumData.current = current;
    handleGetDataObj();
    handleGetProductFileData();
  };

  const handleUpdataPageNum = pageNum => {
    pageNumData.current = pageNum;
    handleGetDataObj();
    handleGetProductFileData();
  };

  // 页码属性设置
  const paginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: handleUpdataPageSize,
    onChange: handleUpdataPageNum,
    current: pageNumData.current,
    total: totalData.current,
    showTotal: () => {
      return `共 ${totalData.current} 条数据`;
    },
  };

  /**
   * 表格多选框
   * @const   rowSelection
   * @method  onChange
   * @param   {selectedRowKeys} 选中项key值
   */
  const rowSelection = {
    onChange: (_, record) => {
      let arr = [];
      for (let key in record) {
        arr.push(`${record[key].fileSerialNumber}@${record[key].fileName}.${record[key].fileForm}`);
      }
      downloadAllArray.current = arr;
    },
  };

  /**
   * 批量操作请求
   */
  const handleCanBatchToDo1 = () => {
    if (JSON.stringify(downloadAllArray.current) !== '[]') {
      message.success('多文件压缩包正在下载中 . . . 请稍后');
      downloadNoToken(
        `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${downloadAllArray.current}`,
      );
    } else {
      message.warn('请选择需要下载的文件');
    }
  };

  /**
   * 批量操作按钮(并渲染)
   */
  const handleGetCheckbox = () => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={handleCanBatchToDo1}>
          导出
        </Menu.Item>
      </Menu>
    );
  };

  const handleCanBatch = () => {
    return (
      <Dropdown overlay={handleGetCheckbox()} className={styles.batshSelect} placement="topLeft">
        <Button>批量操作</Button>
      </Dropdown>
    );
  };

  // 渲染表格数据
  const handleAddTable = () => {
    return (
      <Table
        rowSelection={rowSelection} // 开启checkbox多选框
        pagination={paginationProps} // 分页栏
        loading={listLoading} // 加载中效果
        rowKey={record => record.id} // key值
        dataSource={productFileData.fileInfoList} // 表数据源
        columns={columns} // 表头数据
        style={{ position: 'relative', width: '90%', left: '5%', textAlign: 'center' }}
        scroll={{ x: true }}
      />
    );
  };

  const handleChangeProSatge = val => {
    moduleCodeListData.current = val;
    handleGetProductFileData();
  };

  const handleChangeDocType = val => {
    documentTypeListData.current = val;
    handleGetProductFileData();
  };

  const handleChangeFileType = val => {
    fileTypeListData.current = val;
    handleGetProductFileData();
  };

  const handleChangeFileName = val => {
    fileNameData.current = val;
    handleGetProductFileData();
  };

  const handleChangeDate = (_, val) => {
    startTimeData.current = val[0];
    endTimeData.current = val[1];
    handleGetProductFileData();
  };

  const handleChangeFlag = e => {
    if (e.target.checked === true) {
      flagData.current = '1';
    } else {
      flagData.current = undefined;
    }
    handleGetProductFileData();
  };

  useEffect(() => {
    handleGetDictsData();
    handleGetFileListDocTypeData();
    handleGetFileListFileTypeData();
    handleGetProductFileData();
  }, [proCodeArguments]);

  return (
    <>
      {handleShow()}
      {handleAddStageSlecct(dicts.M001, '所有流程阶段', handleChangeProSatge)}
      {handleAddStageSlecct(productFileListDocType, '所有文档类型', handleChangeDocType)}
      {handleAddStageSlecct(productFileListFileType, '所有明细分类', handleChangeFileType)}
      <Search
        onSearch={handleChangeFileName}
        placeholder="请输入文件名称"
        style={{ width: '10%', margin: '0 0 15px 5%' }}
      />
      <RangePicker
        onChange={handleChangeDate}
        placeholder={['归档开始时间', '归档结束时间']}
        style={{ width: '20%', margin: '0 0 15px 5%' }}
      />
      {/* <Checkbox style={{ margin: '0 0 15px 5%', fontWeight: '700' }} onChange={handleChangeFlag}>
        用印文档
      </Checkbox> */}
      {handleAddTable()}
      {handleCanBatch()}
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ global, productBillboard, loading }) => ({
    productBillboard,
    global,
    listLoading: loading.effects['productBillboard/productFileDataFunc'],
  }))(ProductFile),
);

export default WrappedIndexForm;

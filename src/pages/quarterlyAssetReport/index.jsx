// 季度资产报告
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Tooltip } from 'antd';
import { routerRedux } from 'dva/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import styles from './index.less';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';
import { uuid } from '@/utils/utils';

const { confirm } = Modal;

const Index = ({
  dispatch,
  listLoading,
  buttonLoading,
  quarterlyAssetReport: { proNameAndCodeData, tableList, total },
}) => {
  const pageNum = useRef(1); // 当前页面页数
  const pageSize = useRef(10); // 当前页面展示数量
  const keyWords = useRef(''); // 模糊搜索关键字
  const proCode = useRef(''); // 产品代码
  const fileTitle = useRef(''); // 附件标题
  const [fileData, setFileData] = useState(''); // 文件内容数据
  const [modalShow, setModalShow] = useState(false); // 提示窗是否展开
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    handleGetProNameAndCode(); // 请求:获取产品全称/代码下拉列表
    handleGetListData(); // 请求:获取分页列表数据
  }, []);

  // 静态数据:表头 
  const columns = [
    {
      title: '产品全称',
      dataIndex: 'pdNm',
      key: 'pdNm',
      ...tableRowConfig,
      width: 400,
      sorter: false,
    },
    {
      title: '附件标题',
      dataIndex: 'fileTitle',
      key: 'fileTitle',
      ...tableRowConfig,
      width: 800,
      sorter: false,
    },
    {
      title: '上传时间',
      dataIndex: 'pushTime',
      key: 'pushTime',
      sorter: false,
      render: text => {
        if (text) {
          const value = text.split(' ')[0];
          return (
            <Tooltip title={value}>
              <span>{value}</span>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title={text}>
              <span>{text}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            loading={buttonLoading}
            disabled={!record.fileInfo}
            type="link"
            onClick={() => handleShowFile(record)}
          >
            查看
          </Button>
        );
      },
    },
  ];

  // 请求方法:获取表格数据
  const handleGetListData = (isKeyWords = true) => {
    if (isKeyWords) {
      dispatch({
        type: 'quarterlyAssetReport/getTableListFunc',
        payload: {
          direction: 'desc',
          field: 'pushTime',
          currentPage: pageNum.current,
          pageSize: pageSize.current,
          keyWords: keyWords.current ? keyWords.current : undefined,
          fuzzyFieldList: 'pdNm,fileTitle,pushTime'
        },
      });
    } else {
      dispatch({
        type: 'quarterlyAssetReport/getTableListFunc',
        payload: {
          direction: 'desc',
          field: 'pushTime',
          currentPage: pageNum.current,
          pageSize: pageSize.current,
          pdNmLike: pdNmLike.current || undefined,// 高级搜索中，产品全称和附件标题模糊匹配
          fileTitleLike: fileTitleLike.current || undefined,
        },
      });
    }
  };

  // 请求方法:获取产品全称/代码下拉列表
  const handleGetProNameAndCode = () => {
    dispatch({
      type: 'quarterlyAssetReport/getProNameAndCodeFunc',
    });
  };

  function handleCheckUrl(url) {
    // 修复直接跳转路径报错问题，逻辑如下：此处请求接口，将路径传给后台，若路径可用，直接跳转；若不可用，前端提示，不跳转
    dispatch({
      type: 'quarterlyAssetReport/getCheckUrl',
      payload: url,
    }).then(response => {
      if (response && response.status === 200) {
        // 直接跳转(不包含标签符)
        const w = window.open('about:blank');
        w.location.href = url;
      } else {
        message.warning('该条数据缺少对应的文件内容信息!');
      }
    });
  }

  // 请求+交互:查看
  const handleShowFile = record => {
    dispatch({
      type: 'quarterlyAssetReport/getFileDetailsFunc',
      payload: record.id,
      callback: res => {
        setFileData(res);
        if (res.indexOf('<') !== -1) {
          if (res.indexOf('<A') !== -1) {
            setFileData(res.replace(/<A/, "<A target='view_window'"));
            setModalShow(true);
          } else if (
            res.indexOf('<A') === -1 &&
            (res.indexOf('<P') !== -1 || res.indexOf('<p') !== -1)
          ) {
            setFileName(record.fileTitle);
            setFileData(res);
            setModalShow(true);
          } else {// 解决0518邮件问题：点击查看，不能正常展示数据（当fileInfo中数据没有被p标签包裹时）
            setFileName(record.fileTitle);
            const renderRes = `<p>${res}</p>`;
            setFileData(renderRes);
            setModalShow(true);
          }
        } else if (record?.fileInfo) {
          handleCheckUrl(res);
        } else {
          message.warning('该条数据缺少对应的文件内容信息!');
        }
      },
    });
  };

  // 页码属性设置
  const paginationProps = {
    total,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageNum.current,
    pageSize: pageSize.current,
    onChange: page => {
      pageNum.current = page;
      handleGetListData(keyWords.current ? true : false);// 修复切换页码时，总是不走高级搜索查询分支（不能使用keyWords判断，因为keyWord = {current: ""}，转换为布尔值永远是true，应该使用keyWords.current判断（建议使用useState，少用useRef）
    },
    onShowSizeChange: (_, size) => {
      pageSize.current = size;
      pageNum.current = 1;
      handleGetListData(keyWords.current ? true : false);// 修复问题同上
    },
    showTotal: () => {
      return `共 ${total} 条数据`;
    },
  };

  // 数据:条件查询配置
  const formItemData = [
    {
      name: 'pdNmLike',
      label: '产品全称',
      type: 'input',
    },
    {
      name: 'fileTitleLike',
      label: '附件标题',
      type: 'input',
    },
  ];

  const handleCloseModal = () => {
    setModalShow(false);
    setFileName('');
    setFileData('');
  };

  const handleCanDownload = () => {
    function fakeClick(obj) {
      var ev = document.createEvent('MouseEvents');
      ev.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      obj.dispatchEvent(ev);
    }

    function exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      fakeClick(save_link);
    }
    exportRaw(`${fileName}.txt`, document.getElementById('fileData').innerText);
    handleCloseModal();
  };

  const handleAddModal = () => {
    return (
      <Modal
        width="70%"
        title="文件内容"
        visible={modalShow}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            style={fileName ? { display: '' } : { display: 'none' }}
            disabled={fileName ? false : true}
            onClick={handleCanDownload}
          >
            下载
          </Button>,
        ]}
      >
        <div className="modalDiv">
          <div
            id="fileData"
            dangerouslySetInnerHTML={{ __html: fileData }}
          ></div>
        </div>
      </Modal>
    );
  };


  return (
    <>
      {handleAddModal()}
      <List
        title={'季度资产报告'}
        formItemData={formItemData}
        advancSearch={fieldsValue => {
          const values = fieldsValue || {};
          pageNum.current = 1;
          pdNmLike.current = values?.pdNmLike?.toString() || '';
          fileTitleLike.current = values?.fileTitleLike || '';
          handleGetListData(false);
        }}
        resetFn={() => {
          keyWords.current = '';
          pageNum.current = 1;
          handleGetListData();
        }}
        searchPlaceholder="请输入产品全称/附件标题/上传时间"
        searchInputWidth="270px"
        fuzzySearch={key => {
          keyWords.current = key;
          pageNum.current = 1;
          handleGetListData();
        }}
        tableList={
          <Table
            className={styles.controlButtonDiv}
            pagination={paginationProps} // 分页栏
            loading={listLoading} // 加载中效果
            rowKey={uuid()}// key值:后台返回了重复数据，因此不能使用record.id作为rowKey
            dataSource={tableList} // 表数据源
            columns={columns} // 表头数据
            scroll={{ x: true }}
          />
        }
      />
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  connect(({ quarterlyAssetReport, loading }) => ({
    quarterlyAssetReport,
    listLoading: loading.effects['quarterlyAssetReport/getTableListFunc'],
    buttonLoading: loading.effects['quarterlyAssetReport/getFileDetailsFunc'],
  }))(Index),
);

export default WrappedIndexForm;

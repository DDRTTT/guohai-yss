/**
 * 词汇字典
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Form, message, Popconfirm, Upload } from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import Action from '@/utils/hocUtil';
import { handleTableCss } from '@/utils/utils';
import styles from './index.less';
import { Table } from '@/components';
import List from '@/components/List';

const Index = ({ listLoading, form: { validateFields }, dispatch, wordDictionary: { data } }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [checkArr, setCheckArr] = useState([]);
  const [upload, setUpload] = useState(false);
  const [download, setDownload] = useState(false);
  const [searchForm, setSearchForm] = useState({});

  /**
   * 列表查询
   * @method  handleListFetch
   */
  const handleListFetch = (pages, limits) => {
    setPage(pages);
    validateFields((err, fieldsValue) => {
      dispatch({
        type: 'wordDictionary/fetch',
        payload: {
          page: pages,
          limit: limits,
          code: fieldsValue.code && fieldsValue.code.trim(),
          name: fieldsValue.name && fieldsValue.name.trim(),
        },
      });
    });
  };

  const handleCanDownload = arr => {
    dispatch({
      type: 'wordDictionary/handleDownloadFunc',
      payload: arr,
      callback: res => {
        if (typeof res === 'string') {
          exportText('词汇字典', res);
          message.success('导出成功 !');
        } else message.error('导出失败 !');
        return setDownload(false);
      },
    });
  };

  const handleList = fieldsValue => {
    setSearchForm(fieldsValue);
    setPage(1);
    setLimit(10);
  };

  useEffect(() => {
    dispatch({
      type: 'wordDictionary/fetch',
      payload: {
        page,
        limit,
        code: searchForm ? searchForm.code && searchForm.code.trim() : '',
        name: searchForm ? searchForm.name && searchForm.name.trim() : '',
      },
    });
  }, [page, limit, searchForm]);

  // 跳转查看更多
  const lookMore = (record, state) => {
    if (state !== 'delete') {
      const basic = { state };
      // 存储产品代码
      sessionStorage.setItem('dicId', record.id);
      // 存储产品代码
      sessionStorage.setItem('dicCode', record.code);

      dispatch({
        type: 'wordDictionary/state',
        payload: basic,
      });

      router.push('./wordDictionary/view');
    } else {
      dispatch({
        type: 'wordDictionary/deleteWord',
        payload: {
          id: record.id,
        },
      });
    }
  };

  // 跳转查看更多
  const handleView = (record, state) => {
    const basic = { state };
    // 存储产品代码
    sessionStorage.setItem('dicId', record.id);
    // 存储产品代码
    sessionStorage.setItem('dicCode', record.code);

    dispatch({
      type: 'wordDictionary/state',
      payload: basic,
    });

    router.push({
      pathname: './wordDictionary/view',
      query: {
        dicId: record.id,
        dicCode: record.code,
      },
    });
  };

  // 分页
  const handleStandardTableChange = ({ current, pageSize }) => {
    setPage(current);
    setLimit(pageSize);
  };

  // 导出为text文件
  const fakeClick = obj => {
    const ev = document.createEvent('MouseEvents');
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
  };

  // 导出为text文件
  const exportText = (name, data) => {
    const urlObject = window.URL || window.webkitURL || window;
    const export_blob = new Blob([data]);
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
  };

  // 文件导入
  const uploadFile = {
    name: 'file',
    action: '/ams/ams-base-parameter/datadict/inpDict',
    method: 'post',
    showUploadList: false,
    headers: {
      userId: JSON.parse(sessionStorage.getItem('USER_INFO'))?.id,
      Token: sessionStorage.getItem('auth_token'),
    },
    onChange(info) {
      setUpload(true);
      if (info.file.status === 'done') {
        if (info.file.response.status === 200) {
          message.success('导入成功 ! ');
          handleListFetch(1, 10);
        } else {
          message.warn('导入失败 ! ');
        }
      }
      if (info.file.status === 'error') {
        message.warn('导入失败 ! ');
      }
      setUpload(false);
    },
  };

  // 添加字典类目按钮
  const findAction = () => {
    return (
      <>
        <Action code="wordDictionary:adddatadict">
          <Button
            type="primary"
            onClick={() => {
              router.push('./wordDictionary/add');
            }}
          >
            {/* 添加 */}
            新增
          </Button>
        </Action>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          disabled={+checkArr === 0}
          loading={download}
          onClick={() => {
            setDownload(true);
            handleCanDownload(JSON.stringify(checkArr));
          }}
        >
          导出
        </Button>

        <Upload {...uploadFile} style={{ display: 'inline-block' }}>
          <Button
            type="primary"
            style={{ marginLeft: '20px' }}
            loading={upload}
            onClick={() => {
              console.log('导入');
            }}
          >
            导入
          </Button>
        </Upload>
      </>
    );
  };

  const columns = [
    {
      title: '字典代码',
      dataIndex: 'code',
      width: 200,
      render: text => handleTableCss(text),
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 200,
      render: text => handleTableCss(text),
    },
    {
      title: '字典描述',
      dataIndex: 'remark',
      width: 200,
      render: text => handleTableCss(text),
    },
    {
      title: '制作人',
      dataIndex: 'creatorIdName',
      width: 200,
      render: text => handleTableCss(text),
    },
    {
      title: '制作时间',
      dataIndex: 'createTime',
      width: 200,
      render: text => handleTableCss(text),
    },
    {
      title: '操作',
      dataIndex: 'id',
      // align: 'center',
      fixed: 'right',
      // width: 200,
      render: (val, record) => (
        <div>
          <Action code="wordDictionary:quryById">
            <a style={{ margin: '0 5px' }} onClick={() => handleView(record, 'look')}>
              查看
            </a>
          </Action>
          <Action code="wordDictionary:updatedatadict">
            <a style={{ margin: '0 5px' }} onClick={() => lookMore(record, 'edit')}>
              {/* 编辑 */}
              修改
            </a>
          </Action>
          <Action code="wordDictionary:deleteById">
            <Popconfirm title="确定要删除吗?" onConfirm={() => lookMore(record, 'delete')}>
              <a style={{ margin: '0 5px' }}>删除</a>
            </Popconfirm>
          </Action>
        </div>
      ),
    },
  ];

  const handlePagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: page,
    total: data.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  const formItemData = [
    {
      name: 'code',
      label: '字典代码',
      type: 'input',
    },
    {
      name: 'name',
      label: '字典名称',
      type: 'input',
    },
  ];

  // checkbox框
  const rowSelection = {
    onChange: (_, selectedRows) => {
      const arr = [];
      if (JSON.stringify(selectedRows) !== '[]') {
        selectedRows.map(i => {
          arr.push(i.id);
        });
      }
      setCheckArr(arr);
    },
  };

  return (
    <div className={styles.base}>
      <List
        formItemData={formItemData}
        advancSearch={handleList}
        loading={listLoading}
        resetFn={() => {
          setSearchForm({});
          setPage(1);
          setLimit(10);
        }}
        fuzzySearchBool={false}
        extra={findAction()}
        tableList={
          <Table
            columns={columns}
            rowSelection={rowSelection}
            loading={listLoading}
            dataSource={data.rows}
            onChange={handleStandardTableChange}
            pagination={handlePagination}
            scroll={{ x: columns.length * 200 }}
          />
        }
      />
    </div>
  );
};

const WrappedIndex = errorBoundary(
  Form.create()(
    connect(({ wordDictionary, loading }) => ({
      wordDictionary,
      listLoading: loading.effects['wordDictionary/fetch'],
    }))(Index),
  ),
);

export default WrappedIndex;

import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Button, Upload, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import List from '@/components/List';
import { Table } from '@/components';
import Action from '@/utils/hocUtil';
import { handleTableCss } from '@/utils/utils';
import router from 'umi/router';
import {
  getEditButton,
  getPaginationConfig,
  hideTaskTime,
  isNullObj,
  tableRowConfig,
} from '@/pages/investorReview/func';

@errorBoundary
@Form.create()
@connect(({ wordDictionary, loading }) => ({
  wordDictionary,
  listLoading: loading.effects['wordDictionary/fetch'],
}))
export default class Index extends Component {
  state = {
    pageSize: 10,
    pageNum: 1,
    searchParam: {},
    selectList: [],
    downLoading: false,
    upLoading: false,
  };

  componentWillMount() {
    this.getTableList(1, this.state.pageSize);
  }

  //   搜索区域内容
  formItemData = [
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

  //   多选配置
  rowSelection = {
    onChange: selectedRows => {
      this.setState({ selectList: selectedRows });
    },
  };

  // 文件导入
  uploadFile = {
    name: 'file',
    action: '/ams/ams-base-parameter/datadict/inpDict',
    method: 'post',
    showUploadList: false,
    headers: {
      userId: JSON.parse(sessionStorage.getItem('USER_INFO'))?.id,
      Token: sessionStorage.getItem('auth_token'),
    },
    onChange: info => {
      this.setState({
        upLoading: true,
      });
      if (info.file.status === 'done') {
        if (info.file.response.status === 200) {
          message.success('导入成功 ! ');
          this.setState({ pageNum: 1 }, () => {
            this.getTableList(1, this.state.pageSize, this.searchParam);
          });
        } else {
          message.warn('导入失败 ! ');
        }
      }
      if (info.file.status === 'error') {
        message.warn('导入失败 ! ');
      }
      this.setState({
        upLoading: false,
      });
    },
  };

  // 导出为text文件
  fakeClick = obj => {
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
  exportText = (name, data) => {
    const urlObject = window.URL || window.webkitURL || window;
    const export_blob = new Blob([data]);
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    this.fakeClick(save_link);
  };

  //   文件导出
  handleCanDownload = arr => {
    this.setState({ downLoading: true });
    this.props.dispatch({
      type: 'wordDictionary/handleDownloadFunc',
      payload: arr,
      callback: res => {
        if (typeof res === 'string') {
          this.exportText('词汇字典', res);
          message.success('导出成功 !');
        } else message.error('导出失败 !');
        this.setState({ downLoading: false });
      },
    });
  };

  // 添加字典类目按钮
  findAction = () => {
    const { downLoading, upLoading, selectList } = this.state;
    return (
      <>
        <Action code="wordDictionary:adddatadict">
          <Button
            type="primary"
            onClick={() => {
              router.push('wordDictionary/add');
            }}
          >
            新增
          </Button>
        </Action>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          disabled={+selectList === 0}
          loading={downLoading}
          onClick={() => {
            this.handleCanDownload(JSON.stringify(this.state.selectList));
          }}
        >
          导出
        </Button>

        {/* <Upload {...this.uploadFile} style={{ display: 'inline-block' }}>
          <Button
            type="primary"
            style={{ marginLeft: '20px' }}
            loading={upLoading}
            onClick={() => {
              console.log('导入');
            }}
          >
            导入
          </Button>
        </Upload> */}
      </>
    );
  };

  // 表格切换
  tableChange = ({ current, pageSize }) => {
    this.setState(
      {
        pageNum: current,
        pageSize,
      },
      () => {
        this.getTableList(current, pageSize, this.state.searchParam);
      },
    );
  };

  // 表格表头
  columns = [
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
            <a style={{ margin: '0 5px' }} onClick={() => this.lookMore(record, 'view')}>
              查看
            </a>
          </Action>
          <Action code="wordDictionary:updatedatadict">
            <a style={{ margin: '0 5px' }} onClick={() => this.lookMore(record, 'modify')}>
              修改
            </a>
          </Action>
          <Action code="wordDictionary:deleteById">
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.lookMore(record, 'delete')}>
              <a style={{ margin: '0 5px' }}>删除</a>
            </Popconfirm>
          </Action>
        </div>
      ),
    },
  ];

  lookMore = (record, state) => {
    if (state == 'delete') {
      this.props.dispatch({
        type: 'wordDictionary/deleteWord',
        payload: {
          id: record.id,
        },
      });
    } else {
      // 存储产品代码
      router.push({
        pathname: 'wordDictionary/view',
        query: {
          dicId: record.id,
          dicCode: record.code,
          pageType: state,
        },
      });
    }
  };

  //   搜索
  handlerSearch = param => {
    const { name = '', code = '' } = param;
    const tempParam = {
      name: name.trim(),
      code: code.trim(),
    };
    this.setState({ searchParam: tempParam }, () => {
      this.getTableList(1, this.state.pageSize, this.state.searchParam);
    });
  };

  //   重置
  handleReset = () => {
    this.setState(
      {
        pageNum: 1,
        searchParam: {},
      },
      () => {
        this.getTableList(1, this.state.pageSize);
      },
    );
  };

  //   获取列表数据
  getTableList = (page, limit, _extra = {}) => {
    this.props.dispatch({
      type: 'wordDictionary/fetch',
      payload: {
        page,
        limit,
        ..._extra,
      },
    });
  };

  render() {
    const {
      listLoading,
      wordDictionary: { data },
    } = this.props;
    const { pageSize, pageNum } = this.state;
    return (
      <>
        <List
          title={false}
          formItemData={this.formItemData}
          advancSearch={this.handlerSearch}
          resetFn={this.handleReset}
          searchInputWidth="300"
          loading={listLoading}
          fuzzySearchBool={false}
          extra={this.findAction()}
          tableList={
            <>
              <Table
                rowSelection={this.rowSelection}
                dataSource={data.rows}
                columns={this.columns}
                pagination={getPaginationConfig(data.total, pageSize, {
                  current: pageNum,
                })}
                onChange={this.tableChange}
                rowKey="id"
                loading={listLoading}
                scroll={{ x: this.columns.length * 200 + 200 }}
              />
            </>
          }
        />
      </>
    );
  }
}

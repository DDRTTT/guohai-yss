//档案整理
import React, { Component } from 'react';
import List from '@/components/List';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { download } from '@/utils/download';
import SupplementModal from './supplementModal'
import Action, { linkHoc } from '@/utils/hocUtil';
// import Table from './table';
import {
  message,
  Button,
  Dropdown,
  Form,
  Menu,
  Modal,
  Tooltip,
  Table,
  Input,
  Icon,
  Tabs,
  Select
} from 'antd';
class fileAngement extends Component {
  state = {
    formData: {
      fileName: '',
      fileStatus: '',
      fileCarrier: '',
    },
    visible: false,
    // 列表中选中的数据
    checkedArr: [],
    supplementInfo: {},
    keyWords: '',
    currentPage: 1,
    pageSize: 10,
    columns: [
      {
        title: '文件名称',
        dataIndex: 'fileName',
        sorter: true,
        width: 400,

        render: this.Render,
      },
      {
        title: '档案号',
        dataIndex: 'fileNo',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '档案大类',
        dataIndex: 'fileCategories',
        sorter: true,
        width: 200,
      },
      {
        title: '文档类型',
        dataIndex: 'fileType',
        sorter: true,
        width: 120,

      },
      {
        title: '明细分类',
        dataIndex: 'detailClass',
        sorter: true,
        width: 150,

        render: this.Render,
      },
      {
        title: '文档载体',
        dataIndex: 'fileCarrier',
        sorter: true,
        width: 120,
      },
      {
        title: '档案室',
        dataIndex: 'fileRoom',
        sorter: true,
        editable: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '档案架',
        dataIndex: 'fileRack',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '档案位置',
        dataIndex: 'fileLocation',
        sorter: true,
        width: 150,

        render: this.Render,
      },
      {
        title: '档案盒',
        dataIndex: 'fileBox',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '保管期限',
        dataIndex: 'storageTime',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '档案状态',
        dataIndex: 'fileStatus',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '操作人',
        dataIndex: 'statusName3',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '操作时间',
        dataIndex: 'statusName4',
        width: 100,
        sorter: true,

        render: this.Render,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <>
              <Action code="fileAngement:details">
                <a type="link" onClick={() => this.goDetails('details', record)}>
                  查看
                </a>
              </Action>
              <Action code="fileAngement:modify">
                <a type="link" className={styles.btn} onClick={() => this.goAdd('modify', record)}>
                  修改
                </a>
              </Action>
              <Action code="fileAngement:auditing">
                <a type="link" disabled={record.fileStatus == 'unCollated'} className={styles.btn} onClick={() => this.delete(record, '0')}>
                  审核
                </a>
              </Action>
              <Action code="fileAngement:delete">
                <a type="link" className={styles.btn} onClick={() => this.delete(record, '1')}>
                  删除
                </a>
              </Action>
              <Action code="fileAngement:repairRecord">
                {record.fileSource == '1' && <a type="link" className={styles.btn} onClick={() => this.supplement(record)}>
                  补录
                </a>}
              </Action>
            </>
          );
        },
      },
    ],
  };

  componentDidMount = () => {
    this.getList();
    this.getData()
  };
  supplement = (data) => {
    this.setState({
      supplementInfo: data,
      visible: true,
    })
  }
  //补录关闭
  supplementClose = () => {
    this.setState({
      visible: false
    })
  }
  //跳转新增、修改页面
  goAdd = (val, record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/fileAngement/add',
        query: {
          val,
          id: record ? record.id : '',
        },
      }),
    );
  };
  // 跳转查看、审核页面
  goDetails = (val, record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/fileAngement/details',
        query: {
          val,
          id: record ? record.id : '',
        },
      }),
    );
  };
  //查询列表接口
  getList = (val) => {
    const { dispatch } = this.props;
    const { currentPage, pageSize, formData, keyWords } = this.state;
    const payload = {
      bizViewId: "I8aaa82cd0180d50fd50f97bf0180ff67c005652a",
      likeBizViewId: "I8aaa82cd0180d50fd50f97bf0180ff64987164ea",
      isPage: "1",
      page: currentPage,
      size: pageSize,
      returnType: "LIST",
      keyWords,
      ...formData,
    };
    for (let key in payload) {
      if (payload[key] === '') {
        delete payload[key]
      }
    }
    dispatch({
      type: 'archive/getTableList',
      payload,
    });
  }
  getData() {
    const { dispatch } = this.props;
    // 词汇字典
    dispatch({
      type: 'archive/getCodeList',
      payload: ['fileCarrier', 'fileStatus'],
    });
    //档案大类
    dispatch({
      type: 'archive/archivesCategory',
    });
  }
  // 查询重置方法
  handleReset = () => {
    this.setState({ formData: {}, currentPage: 1, pageSize: 10 }, () => this.getList());
  };
  changeKeyWords = val => {
    this.setState({
      keyWords: val
    }, () => {
      this.getList()
    })
  };
  // 批量导出
  export = () => {
    download('/ams/yss-base-product/biProduct/smartbi/exportReport', {
      body: { reportId: 'I8aaa82cd0180d50fd50f97bf0180db98161d26e6' },
      name: `档案整理`,
      method: 'POST',
      fileType: '.xlsx',
    });
  }

  //整理、送批
  arrangement = (flag) => {
    const { dispatch } = this.props;
    if (this.state.checkedArr.length <= 0) {
      message.warning('请选择操作的数据');
      return;
    }
    const idArr = [];
    this.state.checkedArr.map(item => idArr.push(item.id));
    Modal.confirm({
      title: flag == '0' ? `您已选择${this.state.checkedArr.length}个产品，是否对已选择文件进行整理生成档案号` : `您已选择${this.state.checkedArr.length}个产品，是否选择送批`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'archive/arrangement',
          payload: { ids: idArr.toString(), flag },
        }).then(data => {
          if (data) {
            this.setState({ selectedRowKeys: [], checkedArr: [] });
            this.getList();
          }
        });
      },
    });
  };
  //删除、审核
  delete = (record, flag) => {
    const { dispatch } = this.props;
    if (flag == '1') {
      Modal.confirm({
        title: '确定删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'archive/delete',
            payload: { ids: record.id, flag },
          }).then(data => {
            if (data) {
              this.setState({ selectedRowKeys: [], checkedArr: [] });
              this.getList();
            }
          });
        },
      });
    } else {
      dispatch({
        type: 'archive/delete',
        payload: { ids: record.id, flag },
      }).then(data => {
        if (data) {
          this.setState({ selectedRowKeys: [], checkedArr: [] });
          this.getList();
        }
      });
    }
  }
  //分页改变
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
      () => {
        this.getList();
      },
    );
  };
  render() {
    const { pageSize, currentPage, columns } = this.state;
    const { tableDateList, codeList } = this.props.archive;
    console.log(codeList, 'codeList')
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        this.setState({
          selectedRowKeys,
          checkedArr: selectRows,
        });
      },
    };
    const formItemData = [
      {
        name: 'fileName',
        label: '文件名称',
        type: 'Input',
      },
      {
        name: 'fileStatus',
        label: '文档状态',
        type: 'select',
        // config: { mode: 'multiple', maxTagCount: 1 },
        option: codeList && codeList.fileStatus,
      },
      {
        name: 'fileCarrier',
        label: '文件载体',
        type: 'select',
        // config: { mode: 'multiple', maxTagCount: 1 },
        option: codeList && codeList.fileCarrier,
      },
    ];
    return (
      <>
        <List
          pageCode="fileAngement"
          dynamicHeaderCallback={this.callBackHandler}
          columns={columns}
          title={'档案整理'}
          formItemData={formItemData}
          advancSearch={formData => {
            this.setState({ formData, currentPage: 1, pageSize: 10 }, () => this.getList());
          }}
          resetFn={this.handleReset}
          searchPlaceholder="请输入文件名称"
          fuzzySearch={val => this.changeKeyWords(val)}
          extra={
            <>
              <Action code="fileAngement:add">
                <Button
                  type="primary"
                  onClick={() => {
                    this.goAdd('add');
                  }}
                >
                  新增
                </Button>
              </Action>
              <Action code="fileAngement:arrange">
                <Button className={styles.btn} type="primary" onClick={() => this.arrangement('0')}>
                  整理
                </Button>
              </Action>
              <Action code="fileAngement:sendApproval">
                <Button className={styles.btn} type="primary" onClick={() => this.arrangement('1')}>
                  送批
                </Button>
              </Action>
              <Action code="fileAngement:export">
                <Button className={styles.btn} type="primary" onClick={this.export}>
                  批量导出
                </Button>
              </Action>
            </>
          }
          tableList={
            <>
              <Table
                rowKey={record => record.id}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: tableDateList.total,
                  showTotal: () => `共 ${tableDateList.total} 条数据`,
                  //   onShowSizeChange: this.handleShowSizeChange,
                  //   onChange: this.handlePageNumChange,
                  pageSize,
                  current: currentPage,
                }}
                scroll={{ x: columns.length * 200 }}
                rowSelection={rowSelections}
                columns={columns}
                dataSource={tableDateList.rows}
                onChange={this.handleTableChange}
              />

            </>

          }
        />
        {this.state.visible && <SupplementModal visible={this.state.visible} supplementInfo={this.state.supplementInfo} supplementClose={this.supplementClose} getList={this.getList} />}
      </>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ archive }) => ({
      archive,
    }))(fileAngement),
  ),
);

export default WrappedAdvancedSearchForm;

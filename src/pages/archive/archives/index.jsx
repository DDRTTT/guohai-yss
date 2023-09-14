/*档案库列表页面*/
import React, { Component } from 'react';
import List from '@/components/List';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import SelfTree from './tree';
import { PageContainers } from '@/components';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { download } from '@/utils/download';
import Action, { linkHoc } from '@/utils/hocUtil';
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
  Layout,
  Select,
  TreeSelect
} from 'antd';
const { Sider, Content } = Layout;
const { Search } = Input;
class archives extends Component {
  state = {
    size: 10,
    page: 1,
    fileRoom: '',
    title: '',
    menuInfo: {},
    msg: false,
    keyWords: '',
    newTreeData: [],
    changeInfo: {},
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
        title: '文件载体',
        dataIndex: 'fileCategories',
        sorter: true,
        width: 200,

        render: this.Render,
      },
      {
        title: '档案室',
        dataIndex: 'fileType',
        sorter: true,
        width: 120,
        render: this.Render,
      },
      {
        title: '档案架',
        dataIndex: 'detailClass',
        sorter: true,
        width: 150,

        render: this.Render,
      },
      {
        title: '档案位置',
        dataIndex: 'fileCarrier',
        sorter: true,
        width: 120,
        render: this.Render,
      },
      // {
      //   title: '档案室',
      //   dataIndex: 'fileRoom',
      //   sorter: true,
      //   width: 200,

      //   render: this.Render,
      // },
      // {
      //   title: '档案架',
      //   dataIndex: 'fileRack',
      //   sorter: true,
      //   width: 200,

      //   render: this.Render,
      // },
      // {
      //   title: '档案位置',
      //   dataIndex: 'fileLocation',
      //   sorter: true,
      //   width: 150,

      //   render: this.Render,
      // },
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
        title: '归档时间',
        dataIndex: 'fileStatus',
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
              <Action code="archives:details">
                <a type="link" onClick={() => this.goDetails(record)}>
                  查看
                </a>
              </Action>
              <Action code="archives:modify">
                <a type="link" className={styles.btn} onClick={() => this.goModify(record)}>
                  修改
                </a>
              </Action>
              <Action code="archives:auditing">
                <a disabled={record.fileStatus == 'unCollated'} type="link" className={styles.btn} onClick={() => this.goDetails('examine')}>
                  审核
                </a>
              </Action>
            </>
          );
        },
      },
    ],
  };
  componentDidMount = () => {
    this.getTreeData();
    this.getList()
  };

  //查询列表接口
  getList() {
    const { dispatch } = this.props;
    const { currentPage, pageSize, fileRoom, page, size, keyWords } = this.state;
    const payload = {
      bizViewId: 'I8aaa82cd0180d50fd50f97bf018102d8f0637752',
      likeBizViewId: 'I8aaa82cd0180d50fd50f97bf018102d11b1976f1',
      returnType: 'LIST',
      isPage: '1',
      keyWords,
      page,
      size,
      fileRoom
    };
    for (let key in payload) {
      if (payload[key] === '') {
        delete payload[key]
      }
    }
    dispatch({
      type: 'archive/getArchivesList',
      payload,
    });
  }
  //树形数据
  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archive/getArchivesTree',
    }).then(data => {
      if (data.flag) {
        this.setState({
          newTreeData: this.getNewTree(data.data)
        })
      }
    });
  }
  getNewTree = (data) => {
    const newTree = []
    // function filter(data) {
    //   newTree.map(item => {
    //     item.code = item.id
    //     item[title] = item.name
    //     // newTree = [{ code: item.parentId, title: item.name }]
    //     if (item.children) {
    //       filter(item.children)
    //     }
    //   })
    // }
    data.forEach(item => {
      newTree.push({
        value: item.id,
        title: item.name,
        parentId: item.parentId,
        children: (item.children && item.children.length > 0) ? this.getNewTree(item.children) : []
      })
    });
    return newTree
  }
  // 跳转查看、审核页面
  goDetails = record => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/archives/details',
        query: {
          id: record ? record.id : '',
        },
      }),
    );
  };
  // 跳转修改页面
  goModify = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/physicalArchives/archive/archives/modify',
        query: {
          id: record ? record.id : '',
        },
      }),
    );
  };
  //树形添加
  add = data => {
    this.setState({
      title: '新增',
      menuInfos: { parentId: '', name: '' },
      isModalVisible: true,
    });
  };
  // 树形修改
  modify = data => {
    if (!this.state.msg) {
      message.warn('请点击选中要修改的节点');
      return;
    }
    this.setState({
      title: '修改',
      menuInfos: { ...this.state.menuInfo },
      isModalVisible: true,
    })
  }
  // 树形删除
  delete = data => {
    const { dispatch } = this.props;
    if (!this.state.msg) {
      message.warn('请点击选中要删除的节点');
      return;
    }
    Modal.confirm({
      title: '确定删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'archive/menuDelete',
          payload: this.state.menuInfo.id
        }).then(data => {
          if (data) {
            this.getTreeData();
          }
        });
      },
    });

  }
  // 树形修改新增菜单确定方法
  handleOk = () => {
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(this.state.changeInfo, 'this.state.changeInfo')
      const payload = {
        ...this.state.menuInfos,
        ...this.state.changeInfo,
        name: values.name
      }
      console.log(payload, 'payload')
      dispatch({
        type: 'archive/menuAdd',
        payload
      }).then(data => {
        this.setState({
          isModalVisible: false,
        });
        this.getTreeData()
      });
    })
  }
  //树形修改新增菜单关闭弹框
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  getLeftTreeClickMsg = (result, msg, newTreeData) => {
    this.setState({
      fileRoom: msg && msg.code,
      menuInfo: { parentId: msg.parentId, name: msg.name, id: msg.code },
      msg: msg.code ? true : false,
      keyWords: ''
    }, () => {
      // if (this.state.msg) {
      this.getList()
      // }
    })
  }
  getLeftTreeCheckMsg = (result, msg) => {

  }
  //分页改变
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        page: pagination.current,
        size: pagination.pageSize,
      },
      () => {
        this.getList();
      },
    );
  };
  //搜索时的回调
  onSearch = (val) => {
    this.setState({
      keyWords: val
    }, () => {
      this.getList()
    })
  }
  // 批量导出
  export = () => {
    download('/ams/yss-base-product/biProduct/smartbi/exportReport', {
      body: { reportId: 'I8aaa82cd0180d50fd50f97bf0180db98161d26e6' },
      name: `档案库`,
      method: 'POST',
      fileType: '.xlsx',
    });
  }
  // 导出目录
  exportDirectory = () => {
    download('/ams/yss-base-product/biProduct/smartbi/exportReport', {
      body: { reportId: 'I8aaa82cd0180d50fd50f97bf018102eb230b78a7' },
      name: `档案库目录`,
      method: 'POST',
      fileType: '.xlsx',
    });
  }
  list = () => {
    const { archivesTreeData, archivesList, codeList } = this.props.archive;
    const { size, page, columns } = this.state;
    return (
      <Layout style={{ background: '#fff' }}>
        <Sider
          width={300}
          style={{ background: '#fff', marginTop: '12px', overflow: 'auto', padding: '10px' }}
        >
          <div style={{ marginBottom: '10px' }}>
            <Action code="archives:treeAdd">
              <Button onClick={this.add}>添加</Button>
            </Action>
            <Action code="archives:treeModify">
              <Button onClick={this.modify} style={{ marginLeft: '10px' }}>修改</Button>
            </Action>
            <Action code="archives:treeDelete">
              <Button type="danger" onClick={this.delete} style={{ marginLeft: '10px' }}>删除</Button>
            </Action>
          </div>
          <SelfTree
            treeData={archivesTreeData}
            draggableFlag
            checkable
            getClickMsg={this.getLeftTreeClickMsg}
            getCheckMsg={this.getLeftTreeCheckMsg}
          />
        </Sider>
        <Content style={{ marginTop: '12px' }}>
          <List
            pageCode="fileAngement"
            title={'档案库'}
            columns={this.state.columns}
            searchPlaceholder="请输入文档名称"
            // fuzzySearch={val => this.changeKeyWords(val)}
            advancSearchBool={false}
            showBreadCrumb={false}
            extra={
              <>
                <Action code="archives:export">
                  <Button onClick={this.exportDirectory} type="primary" style={{ margin: '0 10px' }}>
                    导出目录
                  </Button>
                </Action>
                <Action code="archives:exportCatalogue">
                  <Button
                    onClick={this.export}
                    type="primary"
                  >
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
                    total: archivesList.total,
                    showTotal: () => `共 ${archivesList.total} 条数据`,
                    //   onShowSizeChange: this.handleShowSizeChange,
                    //   onChange: this.handlePageNumChange,
                    pageSize: size,
                    current: page,
                  }}
                  scroll={{ x: columns.length * 200 }}
                  // rowSelection={rowSelections}
                  columns={columns}
                  dataSource={archivesList.rows}
                  onChange={this.handleTableChange}
                />
              </>
            }
          />
        </Content>
      </Layout>
    );
  };
  treeSelectChange = (value, lable, extra) => {
    const { parentId, title } = extra.triggerNode.props
    this.setState({
      changeInfo: { parentId },
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { archivesTreeData } = this.props.archive;
    const layout = {
      labelAlign: 'right',
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '实物档案',
              url: '',
            },
            {
              title: '档案归档',
              url: '',
            },
            {
              title: '档案库',
              url: '/physicalArchives/archive/archives/index',
            },
          ]}
          fuzz={!this.state.msg ? <Search placeholder="请输入文件名称/档案号" onSearch={this.onSearch} /> : ''}
        />
        {/* <div
          style={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        > */}
        {this.list()}
        {/* </div> */}
        {this.state.isModalVisible && <Modal
          title={this.state.title}
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          <Form {...layout}>
            <Form.Item label="父级名称">
              {getFieldDecorator('parentId', {
                initialValue: this.state.menuInfos.parentId == '-1' ? '' : this.state.menuInfos.parentId,
              })(
                // <TreeSelect
                //   style={{ width: '100%' }}
                //   // value={treeSelectValue}
                //   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                //   treeData={[{id: "20220527151443000001",
                //   code: "20220527151443000001",
                //   title: "三号档案架子",
                //   parentId: "-1"}]}
                //   placeholder="请选择父级目录"
                //   treeDefaultExpandAll
                //   onChange={this.treeSelectChange}
                //                     treeNodeFilterProp="title"
                //   // disabled={disableFlag}
                // />,
                <TreeSelect
                  style={{ width: '100%' }}
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={
                    this.state.newTreeData
                    // archivesTreeData
                  }
                  placeholder="请选择所父级名称"
                  treeDefaultExpandAll
                  onChange={this.treeSelectChange}
                  // showSearch
                  treeNodeFilterProp="title"
                />,
              )}
            </Form.Item>
            <Form.Item label="菜单名称">
              {getFieldDecorator(
                'name',
                { initialValue: this.state.menuInfos.name },
              )(
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder="请输入菜单名称"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>}
      </>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ archive }) => ({
      archive,
    }))(archives),
  ),
);

export default WrappedAdvancedSearchForm;

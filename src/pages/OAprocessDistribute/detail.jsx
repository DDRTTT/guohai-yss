import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Modal, Form, Select, Button, Row, Col, Input } from 'antd';
import { routerRedux } from 'dva/router';

@Form.create()
class OAprocessDistribute extends Component {
  constructor() {
    super();
  }

  state = {
    visible: false,
    fileList: [],
    title: '',
    // formVlaue: {
    //     sunForm1: {
    //         isReview: '1',
    //         proCode: 'A001'
    //     },
    //     sunForm2: {
    //       objectLevel: '0'
    //   },
    // }
  };

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.fileList) {
      this.setState({
        fileList: this.props.location.query.fileList,
        title: this.props.location.query.title,
      });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'OAprocessDistribute/searchTableData',
      payload: {
        page: this.props.OAprocessDistribute.page,
        limit: this.props.OAprocessDistribute.limit,
      },
    });
  }

  distribute(record) {
    this.setState({
      visible: true,
      record,
    });
  }

  lookMore(record) {
    this.props.dispatch({
      type: 'OAprocessDistribute/getfileinfo',
      payload: { title: record.title, fileType: record.businessClassification },
    });
    // this.props.dispatch(routerRedux.push({
    //   pathname: '/productList'
    // }));
    // this.setState({
    //     visible: true
    // })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/productReview/add',
            query: {
              OATile: values.flowName,
              from: 'OA',
              record: this.state.record,
            },
          }),
        );
      }
    });
  };

  returnBack() {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/OAprocessDistribute/index',
      }),
    );
  }

  render() {
    const {
      OAprocessDistribute: { dataSource, flowNameList },
      form: { getFieldDecorator },
    } = this.props;
    const { fileList, title } = this.state;
    const columns = [
      {
        key: 'id',
        title: '序号',
        dataIndex: 'id',
        render: (a, b, c) => {
          return <span>{c + 1}</span>;
        },
      },
      {
        title: '文件名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '文件类型编码',
        dataIndex: 'fileTypeCode',
        key: 'fileTypeCode',
      },
      {
        title: '文件类型',
        dataIndex: 'fileFormat',
        key: 'fileFormat',
      },
      {
        title: '文件格式',
        dataIndex: 'fileVersion',
        key: 'fileVersion',
      },
      {
        title: '文件来源',
        dataIndex: 'fileSource',
        key: 'fileSource',
      },
      // {
      //   key: 'handel',
      //   title: '操作',
      //   align: 'center',
      //   width: 200,
      //   // fixed: 'right',
      //   render: (val, record) => (
      //     <div>
      //       <a style={{ marginRight: 10 }} onClick={() => { this.lookMore(record, 'look') }}>查看</a>
      //       <a style={{ marginRight: 10 }} onClick={() => { this.distribute(record, 'look') }}>分发</a>
      //       {/* <Popconfirm title="确定要删除吗?" onConfirm={() => this.delData(record,'delete')}>
      //               <a style={{ marginRight: 10 }} >删除</a>
      //             </Popconfirm> */}
      //     </div>
      //   ),
      // }
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
    return (
      <div>
        <button onClick={() => this.returnBack}>返回</button>
        <p>标题： {{ title }}</p>
        <Table rowKey="id" title="文件列表" dataSource={fileList} columns={columns} total={10} />;
      </div>
    );
  }
}
export default connect(({ OAprocessDistribute }) => ({
  OAprocessDistribute,
}))(OAprocessDistribute);

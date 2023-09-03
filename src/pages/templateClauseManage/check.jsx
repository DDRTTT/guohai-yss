import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import {
  Form,
  Select,
  Button,
  Row,
  Col,
  Card,
  DatePicker,
  Input,
  Breadcrumb,
  Tooltip,
  message
} from 'antd';
import Action from '@/utils/hocUtil';
import { Table} from '@/components';
import List from '@/components/List';

class TemplateClauseManageCheck extends Component {

  state = {
    visible: false,
    record: {},
    page: 1,
    limit: 10,
    id: '',// 从列表页获取
    searchValues: {},
    startTime: '',
    endTime: '',
    isSearch: false
  };

  // 列表总条数
  showTotal = total2 => {
    return `共 ${total2} 条数据`;
  };

  changePageWithSearch = () => {
    const { page, limit, isSearch, id, searchValues } = this.state;
    let data = null;
    if(isSearch){
      data = { id, ...searchValues };
    }else{
      data = { id };
    }
    this.getTableList(page, limit, data);
  };

  // 切换页码
  changePage = (page, pageSize) => {
    this.setState({ page, limit: pageSize },()=>{
      this.changePageWithSearch();
    });
  };

  // 切换页大小
  changePageSize = (currentPage, pageSize) => {
    this.setState({ page: 1, limit: pageSize }, () => {
      this.changePageWithSearch();
    });
  };

  getLabelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tempClauseManage/getLabelList'
    });
  };

  getRangeDate = (date, dateString) => {
    const startTime = dateString[0];
    const endTime = dateString[1];
    this.setState({startTime, endTime})
  };

  handleSearch = formData =>{
    const {time, fname, flabelName} = formData || {}
    const startTime = time && time[0] ? time[0].format('YYYY-MM-DD') : '';
    const endTime = time && time[1] ? time[1].format('YYYY-MM-DD') : '';
    this.setState({isSearch: true,startTime,endTime});
    const {id, limit, page} = this.state;
    const searchValues = {startTime, endTime,fname, flabelName};
    const data = {id, ...searchValues};
    this.setState({searchValues});
    this.getTableList(page, limit, data);
  }

  // 获取表格数据
  getTableList = (page, pageSize, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tempClauseManage/getTableList',
      payload: {
        page,
        pageSize,
        data
      }
    })
  };

  componentDidMount() {
    const { id } = this.props.location.query;
    const { page, limit } = this.state;
    this.setState({id})
    this.getLabelList();
    this.getTableList(page, limit, { id });
  }

  render() {
    const { page, limit } = this.state;
    const { total2, dataSource2, labelList } = this.props.tempClauseManage;
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const { form: { getFieldDecorator } } = this.props;
    const columnTooltip = (text) => {
      return (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      );
    };
    const columns = [
      {
        key: 'number',
        title: '序号',
        dataIndex: 'number',
        width: 70,
        render: (text, record, index) =>
          `${(page - 1) * limit + (index + 1)}`
      },
      {
        key: 'fname',
        title: '条款项',
        dataIndex: 'fname',
        width: 150,
        ellipsis: true,
        render: columnTooltip
      },
      {
        key: 'flabelName',// 不是menuName了，保留这个修改！！
        title: '文档标签',
        dataIndex: 'flabelName',
        width: 150,
        ellipsis: true,
        render: columnTooltip
      },
      {
        key: 'tempName',
        title: '对应模板',
        dataIndex: 'tempName',
        width: 200,
        ellipsis: true,
        render: columnTooltip
      },
      {
        key: 'fvalue',
        title: '内容文本',
        dataIndex: 'fvalue',
        width: 200,
        ellipsis: true,
        render: columnTooltip
      },
      {
        key: 'editorTime',
        title: '变更时间',
        dataIndex: 'editorTime',
        width: 150,
        ellipsis: true,
        render: columnTooltip
      }
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
  const formItemData = [
    {
      name: 'time',
      label: '日期',
      type: 'RangePicker',
    },
    {
      name: 'fname',
      label: '条款项',
      type: 'input',
    },
    {
      name: 'flabelName',
      label: '文档标签',
      type: 'select',
      readSet: { name: 'name', code: 'name' },
      option: labelList,
    },
  ];
    return (
      <>
        <List 
          title={false}
          formItemData={formItemData}
          advancSearch={this.handleSearch}
          searchInputWidth="300"
          resetFn={() => {
            proCodeList.current = [];
            accountName.current = '';
            handleGetTableDataAPI(params);
          }}
          fuzzySearchBool={false}
          tableList={(
            <Table
              rowKey="id"
              dataSource={dataSource2}
              columns={columns}
              scroll={{x: 1000}}
              pagination={{
                onChange: this.changePage,
                onShowSizeChange: this.changePageSize,
                total: total2,
                pageSize: limit,
                current: page,
                showTotal: this.showTotal,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          )}
        />
      </>
    );
  }
}

export default Form.create()(connect( ({ tempClauseManage }) => ({ tempClauseManage }) )(TemplateClauseManageCheck));// tempClauseManage  为页面组件对应的models中的 namesapce 


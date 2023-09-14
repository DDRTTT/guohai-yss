import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import {
  Table,
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

  handleSearch = (e) => {
    const { form: { validateFields } } = this.props;
    this.setState({isSearch: true});
    e.preventDefault();
    validateFields( (err, values) => {
      if(!err){
        const {id, limit, page, startTime, endTime} = this.state;
        const searchValues = {startTime, endTime, ...values};
        const data = {id, ...searchValues};
        this.setState({searchValues});
        this.getTableList(page, limit, data);
      }
    })
  };

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

    return (
      <>
        <Card bordered={false}>
          <Row>
            <Col md={20} sm={20}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <span>智能撰写</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                {/* 路径保留 electronic！ 不是electronicRecord!! */}
                  <Link to={`/electronic/templateClauseManage`}>
                    模板要素配置
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span>查看</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Card>
        <Card style={{marginTop: '10px'}}>
          <Form {...formItemLayout} style={{marginBottom: '-16px'}}>
            <Row type="flex" justify="space-between">
              <Col span={8}>
                <Form.Item label="日期">
                  <RangePicker format={dateFormat} onChange={this.getRangeDate}/>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="条款项">
                  {getFieldDecorator('fname')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="文档标签">
                {/* flabelName不要修改！！ */}
                  {getFieldDecorator('flabelName')(
                    <Select onChange={this.selectLabel} allowClear>
                      {
                        labelList.map(item => {// value={item.name}不要修改！！
                          return (
                            <Select.Option value={item.name} key={item.code}>
                              {item.name}
                            </Select.Option>
                          )
                        })
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={2} style={{textAlign: 'right'}}>
                <Form.Item>
                  <Action code="templateClauseManage:query">
                    <Button type="primary" onClick={this.handleSearch}>
                      查询
                    </Button>
                  </Action>
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
        </Card>
      </>
    );
  }
}

export default Form.create()(connect( ({ tempClauseManage }) => ({ tempClauseManage }) )(TemplateClauseManageCheck));// tempClauseManage  为页面组件对应的models中的 namesapce 


/**
 * 项目终止列表
 * Create on 2020/9/15.
 */
import React, { Component } from 'react';
import { Form, Table, Button, Input, Select, Icon, DatePicker } from 'antd';
import router from 'umi/router';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';

const { Option } = Select;
const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    name: `King ${i}`,
    age: 32,
    address: ` Lane no. ${i}`,
  });
}
function onChange(date, dateString) {
  console.log(date, dateString);
}

@Form.create()
class Index extends Component {
  state = {
    selectedRowKeys: [],
    show: false,
  };

  componentDidMount() {}

  lookOver = link => {
    router.push('/projectManagement/terminationManagementLookOver');
  };

  // 展开搜索
  searchUnfold = () => {
    this.setState({
      show: true,
    });
  };

  //   收起搜索
  searchPackUp = () => {
    this.setState({
      show: false,
    });
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const columns = [
      {
        title: '项目编码',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '项目名称',
        dataIndex: 'age',
        fixed: 'left',
        width: 400,
      },
      {
        title: '项目简称',
        dataIndex: 'address',
      },
      {
        title: '项目类型',
        dataIndex: '',
      },
      {
        title: '项目区域',
        dataIndex: '',
      },
      {
        title: '所属部门',
        dataIndex: '',
      },
      {
        title: '开始日期',
        dataIndex: '',
      },
      {
        title: '项目描述',
        dataIndex: '',
      },
      {
        title: '项目分类',
        dataIndex: '',
      },
      {
        title: '是否招投标',
        dataIndex: '',
      },
      {
        title: '客户名称',
        dataIndex: '',
      },
      {
        title: '客户类型',
        dataIndex: '',
      },
      {
        title: '终止原因',
        dataIndex: '',
      },
      {
        title: '终止时间',
        dataIndex: '',
      },
      {
        title: '操作人',
        dataIndex: '',
      },
      {
        title: '终止原因',
        dataIndex: '',
        fixed: 'right',
      },
      {
        title: '操作',
        dataIndex: '',
        fixed: 'right',
        width: 220,
        render: (text, record) => (
          <div className={style.actionButs}>
            <span className={style.actionBut} onClick={this.lookOver}>
              查看
            </span>
          </div>
        ),
      },
    ];

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div className={style.topHeader}>
          <div className={style.topHeaderTitle}>项目终止信息列表</div>
          {this.state.show ? (
            ''
          ) : (
            <div className={style.topHeaderSearch}>
              <Input
                addonBefore={<Icon type="search" />}
                defaultValue="mysite"
                placeholder="请输入"
                style={{ width: 300 }}
              />
              <Button
                className={style.topSearchUnfold} onClick={this.searchUnfold}
                type="link">展开搜索v
              </Button>
            </div>
          )}
        </div>
        {this.state.show ? (
          <div className={style.searchList}>
            <div className={style.mianBoxLeft}>
              <div className={style.mianBox}>
                <div className={style.mianList}>
                  <label>项目编码:</label>
                  <Select
                    defaultValue="请选择"
                    className={style.mianSelect}
                    onChange={event => {
                      this.handleSelect(event, 'proCode');
                    }}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={style.mianList}>
                  <label>项目名称:</label>
                  <Select
                    defaultValue="请选择"
                    className={style.mianSelect}
                    onChange={event => {
                      this.handleSelect(event, 'proCode');
                    }}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={style.mianList}>
                  <label>项目简称:</label>
                  <Select
                    defaultValue="请选择"
                    className={style.mianSelect}
                    onChange={event => {
                      this.handleSelect(event, 'proCode');
                    }}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
              </div>
              <div className={style.mianBox}>
                <div className={style.mianList}>
                  <label>项目类型:</label>
                  <Select
                    defaultValue="请选择"
                    className={style.mianSelect}
                    onChange={event => {
                      this.handleSelect(event, 'proCode');
                    }}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={style.mianList}>
                  <label>所属部门:</label>
                  <Select
                    defaultValue="请选择"
                    className={style.mianSelect}
                    onChange={event => {
                      this.handleSelect(event, 'proCode');
                    }}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </div>
                <div className={style.mianList}>
                  <label>开始日期:</label>
                  <DatePicker onChange={onChange} />
                </div>
              </div>
              <div className={style.mianBox}>
                <div className={style.mianList}>
                  <label>结束日期:</label>
                  <DatePicker onChange={onChange} />
                </div>
              </div>
            </div>
            {/* left of end */}
            <div className={style.mianBoxRight}>
              <Button>查询</Button>
              <span>重置</span>
              <Button
                onClick={this.searchPackUp}
                type="link">收起∧
              </Button>
            </div>
          </div>
        ) : (
          ''
        )}
        {/* list of end */}

        <div className={style.topBg} />
        <Table
          scroll={{ x: 2000 }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(Form.create()(connect(({ loading }) => ({}))(Index)));

export default WrappedIndex;

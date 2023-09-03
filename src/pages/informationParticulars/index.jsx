/**
 * 项目信息详情
 * Create on 2020/9/15.
 */
import React, { Component } from 'react';
import { Form, Button, Input, Select, DatePicker, Radio, Table } from 'antd';
import router from 'umi/router';

import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import style from './index.less';

import FormTable from '../../components/addInfomation/informationParticularsTable';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { TextArea } = Input;

function onChange(date, dateString) {
  console.log(date, dateString);
}
// onChange = e =>{
//   this.setState({
//     value: e.target.value,
//   });
// }

function handleSelect(event, name) {
  const value = {};
  value[name] = event;
  this.setState(value);
}

@Form.create()
class Index extends Component {
  state = {
    value: 1,
  };

  componentDidMount() {}

  sponsorTask = link => {};

  onSelectChange = selectedRowKeys => {};

  render() {
    return (
      <div>
        {/* .Header. */}
        <div className={style.topHeader}>
          <div className={style.topHeaderL}>
            <span className={style.topTitle}>信息详情查看</span>
          </div>
          <div className={style.topHeaderR}>
            <Button>取消</Button>
          </div>
        </div>
        {/* .Header of end. */}
        {/* mian */}
        <div className={style.informationTitle}>
          <span className={style.topTitle}>项目信息</span>
        </div>

        <div className={style.information}>
          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>*项目编号:</label>
              <Input placeholder="请输入客户编号" type="number" />
            </div>
            <div className={style.mianList}>
              <label>*项目名称</label>
              <Input placeholder="请输入客户名称" type="number" />
            </div>
            <div className={style.mianList}>
              <label>项目简称:</label>
              <Input placeholder="请输入客户简称" type="number" />
            </div>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>*项目类型:</label>
              <Select
                defaultValue="资产证券化"
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
              <label>*其他项目类型:</label>
              <Input placeholder="请输入其他项目类型" type="number" />
            </div>
            <div className={style.mianList}>
              <label>*项目区域:</label>
              <Input placeholder="请输入项目区域" type="number" />
            </div>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>境外区域名称:</label>
              <Input placeholder="请输入客户编号" type="number" />
            </div>
            <div className={style.mianList}>
              <label>*项目类型:</label>
              <Input placeholder="请输入客户名称" type="number" />
            </div>
            <div className={style.mianList}>
              <label>开始日期:</label>
              <DatePicker onChange={onChange} className={style.mianDate} />
            </div>
          </div>

          <div className={style.mianText} style={{ marginBottom: '20px' }}>
            <label>项目描述:</label>
            <TextArea placeholder="textarea with clear icon" onChange={onChange} />
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>*项目分类:</label>
              <Select
                defaultValue="管理人项目"
                className={style.mianSelect}
                onChange={handleSelect}
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
              <label>*是否招投标:</label>
              <Radio.Group onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className={style.informationTitle}>
            <span className={style.topTitle}>客户信息</span>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>*客户代名称:</label>
              <Input placeholder="请输入客户代名称" type="" />
            </div>
            <div className={style.mianList}>
              <label>客户简称</label>
              <Input placeholder="请输入客户简称" type="" />
            </div>
            <div className={style.mianList}>
              <label>*客户类型:</label>
              <Radio.Group onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>机构</Radio>
                <Radio value={2}>自然人</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>*统一社会信用代码:</label>
              <Input placeholder="请输入统一社会信用代码" type="" />
            </div>
            <div className={style.mianList}>
              <label>*所属行业:</label>
              <Select
                defaultValue="管理人项目"
                className={style.mianSelect}
                onChange={handleSelect}
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
              <label>*开成立时间:</label>
              <DatePicker onChange={onChange} className={style.mianDate} />
            </div>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>上市板块:</label>
              <Select
                defaultValue="清选择上市板块"
                className={style.mianSelect}
                onChange={handleSelect}
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
              <label>上市时间:</label>
              <DatePicker onChange={onChange} className={style.mianDate} />
            </div>
            <div className={style.mianList}>
              <label>法人代表:</label>
              <Input placeholder="" type="" />
            </div>
          </div>

          <div className={style.mianBox}>
            <div className={style.mianList}>
              <label>注册资本:</label>
              <Input placeholder="请输入注册资本" type="number" />
            </div>
            <div className={style.mianList}>
              <label>*经营范围:</label>
              <Input placeholder="请输入经营范围" type="number" />
            </div>
          </div>

          <div className={style.informationTable}>
            <FormTable name="123" onChange={this.add} />
          </div>
        </div>
        {/* mian  of end */}
      </div>
    );
  }
}

const WrappedIndex = errorBoundary(Form.create()(connect(({ loading }) => ({}))(Index)));

export default WrappedIndex;

import React from 'react';
import { Card, Table, Switch, Spin, Collapse, Button } from 'antd';
import { connect } from 'dva';
import styles from './../index.less';
import router from 'umi/router';
import { SetPanelLayout } from './strategyComponent';
const { Panel } = Collapse;

/**
 * 订阅页面
 */
class Index extends React.Component {
  // 当前激活的面板的key
  activeKey = '';
  componentDidMount() {
    this.getData();
  }
  columns = [
    {
      title: '事项名称',
      dataIndex: 'name',
      key: 'name',
      width: 400,
    },
    {
      title: '当前状态',
      dataIndex: 'stateName',
      key: 'stateName',
    },
    {
      title: '操作',
      key: 'opt',
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={!!record.state}
            onChange={checked => {
              this.changeSubscribeState(checked, record);
            }}
          />
        );
      },
    },
  ];
  /**
   * 切换订阅状态
   */
  changeSubscribeState = (state, record) => {
    this.props
      .dispatch({
        type: 'operatingCalendar/subscribeChange',
        payload: {
          firstCode: this.activeKey,
          subCode: record.code,
          state: Number(!state),
        },
      })
      .then(res => {
        this.getData();
      });
  };
  /**
   * 刷新列表
   */
  getData = () => {
    this.props.dispatch({
      type: 'operatingCalendar/getSubscribeList',
    });
  };
  /**
   * 切换一级tab
   */
  handlerCollapseChange = key => {
    this.activeKey = key;
  };
  /**
   * 解析数据
   */
  render() {
    const {
      subscribeList = [],
      changeLoading = false,
      listLoading = false,
      currentTitle,
    } = this.props;
    return (
      <SetPanelLayout currentTitle={currentTitle}>
        <Spin spinning={changeLoading || listLoading}>
          <div className={styles.subscribe}>
            <Collapse accordion onChange={this.handlerCollapseChange}>
              {subscribeList.map(item => {
                return (
                  <Panel header={item.name} key={item.code}>
                    <Table
                      pagination={false}
                      rowKey="code"
                      dataSource={item.list}
                      columns={this.columns}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </Spin>
      </SetPanelLayout>
    );
  }
}

const subscribe = state => {
  const {
    dispatch,
    operatingCalendar: { subscribeList },
    loading,
  } = state;
  return {
    dispatch,
    subscribeList,
    listLoading: loading.effects['operatingCalendar/getSubscribeList'],
    changeLoading: loading.effects['operatingCalendar/subscribeChange'],
  };
};
export default connect(subscribe)(Index);

import React from 'react';
import { Tabs, Spin, Menu, Layout, Row, Button, Input, Modal } from 'antd';
import { connect } from 'dva';
import cloneDeep from 'lodash/cloneDeep';
import { CheckColorItem, SetPanelLayout } from '../components/strategyComponent';
import styles from '@/pages/messageTodo/setPanel.less';

const { TabPane } = Tabs;
const { Sider, Content } = Layout;
const { confirm } = Modal;

class Index extends React.Component {
  // 用于提交用的数据
  submitData = [];
  // 当前模版的名称
  currentTemplateName = '';
  state = {
    //数据源的数组
    dataSourceList: [],
    //   第一层菜单
    firstActivety: 0,
    // 第二层菜单
    secActivety: '',
    // 第三层的列表
    threeList: [],
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'operatingCalendar/getAllSys',
      })
      .then(() => {
        this.setState({
          firstActivety: 0,
          secActivety: this.props.allSysList[0]?.list[0]?.code,
          threeList: this.props.allSysList[0]?.list[0]?.colorList,
          dataSourceList: cloneDeep(this.props.allSysList),
        });
        this.currentTemplateName = this.props.allSysList[0]?.name;
        this.props.allSysList.forEach(item => {
          this.submitData.push(this.dispostData(item));
        });
      });
  }
  getData = () => {
    const { firstActivety } = this.state;
    this.props
      .dispatch({
        type: 'operatingCalendar/getAllSys',
      })
      .then(() => {
        this.setState({
          secActivety: this.props.allSysList[firstActivety]?.list[0]?.code,
          threeList: this.props.allSysList[firstActivety]?.list[0]?.colorList,
          dataSourceList: cloneDeep(this.props.allSysList),
        });
        this.currentTemplateName = this.props.allSysList[firstActivety]?.name;
        this.props.allSysList.forEach(item => {
          this.submitData.push(this.dispostData(item));
        });
      });
  };
  //   处理数据
  dispostData = data => {
    const { list, name } = data;
    const tempList = [];
    list.forEach(item => {
      tempList.push({
        strategyName: name,
        firstCode: item.code,
        id: item.id,
        color: item.color || '#000000',
      });
      if (item.colorList.length) {
        item.colorList.forEach(sonItem => {
          tempList.push({
            strategyName: name,
            firstCode: item.code,
            subCode: sonItem.subCode || sonItem.code,
            color: sonItem.color || '#000000',
            id: sonItem.id,
          });
        });
      }
    });
    return tempList;
  };
  //   切换模版
  onChange = activeKey => {
    const { dataSourceList } = this.state;
    this.setState({
      firstActivety: Number(activeKey),
      secActivety: dataSourceList[Number(activeKey)]?.list[0]?.code,
      threeList: dataSourceList[Number(activeKey)]?.list[0]?.colorList,
    });
    this.currentTemplateName = dataSourceList[Number(activeKey)]?.name;
  };
  //   删除模版
  remove = targetKey => {
    confirm({
      title: '确认删除当前模版吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // console.log('OK');
        this.props
          .dispatch({
            type: 'operatingCalendar/deleteByName',
            payLoad: {
              strategyName: this.state.dataSourceList[Number(targetKey)]?.name,
            },
          })
          .then(() => {
            this.setState(
              {
                firstActivety: 0,
              },
              () => {
                this.getData();
              },
            );
          });
      },
    });
  };
  // 添加模版
  add = () => {
    const { dataSourceList } = this.state;
    this.props
      .dispatch({
        type: 'operatingCalendar/getHandleStrategy',
      })
      .then(res => {
        let tempData = cloneDeep(dataSourceList);
        tempData.push({
          name: '新建模版' + tempData.length,
          list: res,
        });
        let tempKey = tempData.length - 1;
        this.submitData[tempKey] = this.dispostData(tempData[tempKey]);
        this.setState({
          firstActivety: tempKey,
          secActivety: res[0]?.code,
          threeList: res[0]?.colorList,
          dataSourceList: tempData,
        });
        this.currentTemplateName = tempData[tempData.length - 1].name;
      });
  };

  //   二级选择菜单
  handleSecActivety = selectData => {
    const firstList = this.state.dataSourceList[this.state.firstActivety]?.list;
    const currentList = firstList.find(item => item.code == selectData.key)?.colorList;
    this.setState({
      secActivety: selectData.key,
      threeList: currentList,
    });
  };
  //   提交模版
  handlepickColorSubmit = () => {
    if (this.currentTemplateName !== this.submitData[this.state.firstActivety][0].strategyName) {
      this.submitData[this.state.firstActivety].forEach(item => {
        item.strategyName = this.currentTemplateName;
      });
    }
    this.props
      .dispatch({
        type: 'operatingCalendar/addBatchSys',
        payLoad: this.submitData[this.state.firstActivety],
      })
      .then(() => {
        this.getData();
      });
  };
  //   编辑
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  //  控制模版名称更改事件
  handleTemplateNameChange = e => {
    this.currentTemplateName = e.target.value;
  };

  render() {
    const { firstActivety, secActivety, threeList = [], dataSourceList } = this.state;
    const {
      getAllSysLoading = false,
      getHandleStrategyLoading = false,
      addBatchSysLoading = false,
      deleteByNameLoading = false,
      currentTitle,
    } = this.props;
    return (
      <div className={styles.content}>
        <SetPanelLayout currentTitle={currentTitle}>
          <h3>事项颜色设置</h3>
          <Spin
            spinning={
              getAllSysLoading ||
              getHandleStrategyLoading ||
              addBatchSysLoading ||
              deleteByNameLoading
            }
          >
            <Tabs
              type="editable-card"
              onChange={this.onChange}
              activeKey={firstActivety + ''}
              onEdit={this.onEdit}
            >
              {dataSourceList.map((pane, index) => (
                <TabPane tab={pane.name} key={index}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ width: '80%' }}>
                      <span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>模版名称:</span>
                      <Input
                        style={{ width: '30%' }}
                        defaultValue={pane.name}
                        onChange={this.handleTemplateNameChange}
                      />
                    </div>
                    <Button onClick={this.handlepickColorSubmit}>确定</Button>
                  </div>
                  <Layout>
                    <Sider
                      style={{ background: '#fff' }}
                      trigger={null}
                      collapsible
                      collapsed={undefined}
                    >
                      <Menu
                        mode="inline"
                        selectedKeys={secActivety}
                        onSelect={this.handleSecActivety}
                      >
                        {pane.list.map(item => {
                          return (
                            <Menu.Item key={item.code}>
                              <CheckColorItem
                                firstActivety={firstActivety}
                                data={item}
                                submitData={this.submitData}
                              />
                            </Menu.Item>
                          );
                        })}
                      </Menu>
                    </Sider>
                    <Layout style={{ backgroundColor: '#fff' }}>
                      <Row
                        type="flex"
                        justify="space-between"
                        style={{
                          height: '40px',
                          alignItems: 'center',
                          padding: '0 12px',
                          lineHeight: '40px',
                        }}
                      >
                        <h4>颜色设置</h4>
                        <div />
                      </Row>
                      <Content>
                        {threeList.map((item, index) => {
                          return (
                            <CheckColorItem
                              firstActivety={firstActivety}
                              data={item}
                              key={index}
                              submitData={this.submitData}
                            />
                          );
                        })}
                      </Content>
                    </Layout>
                  </Layout>
                </TabPane>
              ))}
            </Tabs>
          </Spin>
        </SetPanelLayout>
      </div>
    );
  }
}

const styleSet = state => {
  const {
    dispatch,
    operatingCalendar: { allSysList },
    loading,
  } = state;
  return {
    dispatch,
    allSysList,
    getAllSysLoading: loading.effects['operatingCalendar/getAllSys'],
    getHandleStrategyLoading: loading.effects['operatingCalendar/getHandleStrategy'],
    addBatchSysLoading: loading.effects['operatingCalendar/addBatchSys'],
    deleteByNameLoading: loading.effects['operatingCalendar/deleteByName'],
  };
};

export default connect(styleSet)(Index);

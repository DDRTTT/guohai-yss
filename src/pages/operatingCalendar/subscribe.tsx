import React from 'react';
import { Button, Layout, Menu, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import StyleSetPanel from './setPanel/styleSetPanel';
import CalendarSetPanel from './setPanel/calendarSetPanel';
import SubSetPanel from './setPanel/subSetPanel';
import RemaindSetPanel from './setPanel/remindSetPanel';
import TransaSetPanel from './setPanel/transaSetPanel';
import { Card, PageContainers } from '@/components';
import styles from './index.less';

const { Sider } = Layout;

/**
 * 订阅页面
 */
class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataSource: [
        {
          key: '1',
          name: '运营事项1',
          age: '已订阅',
        },
        {
          key: '2',
          name: '运营事项2',
          age: '未订阅',
        },
      ],
      // 当前选中的菜单的key
      currentSelectedKeys: undefined,
      // 当前选中的菜单的标题
      currentTitle: '',
    };
  }
  componentDidMount() {
    this.props
      .dispatch({
        type: 'operatingCalendar/getSystemPathList',
      })
      .then(() => {
        this.setState({
          currentSelectedKeys: this.props.systemPathList[0]?.code,
          currentTitle: this.props.systemPathList[0]?.name,
        });
      });
  }
  /**
   *菜单选择处理
   */
  handleMenuSelect = (selectData: any) => {
    const tempTitle = this.props.systemPathList.find((item: any) => item.code == selectData.key);
    this.setState({
      currentSelectedKeys: selectData.key,
      currentTitle: tempTitle.name,
    });
  };
  render() {
    const { dataSource, currentSelectedKeys, currentTitle } = this.state;
    const { getSystemPathListLoading = false, systemPathList = [] } = this.props;

    return (
      <PageContainers
        breadcrumb={[
          {
            title: '系统任务中心',
            url: '',
          },
          {
            title: '运营日历',
            url: '/taskCenter/operatingCalendar/index',
          },
          {
            title: '设置',
            url: '',
          },
        ]}
      >
        <Spin spinning={getSystemPathListLoading}>
          <Card
            title="系统设置"
            extra={
              <Button
                onClick={() => {
                  router.goBack();
                }}
                style={{ float: 'right' }}
              >
                返回
              </Button>
            }
          >
            <Card className={styles.subscribeCard}>
              <div className={styles.subscribe}>
                <Layout>
                  <Sider
                    style={{ background: '#fff' }}
                    trigger={null}
                    collapsible
                    collapsed={undefined}
                  >
                    <Menu
                      mode="inline"
                      selectedKeys={currentSelectedKeys}
                      onSelect={this.handleMenuSelect}
                    >
                      {systemPathList.map((item: any) => {
                        return (
                          <Menu.Item key={item.code}>
                            <span>{item.name}</span>
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  </Sider>
                  <Layout style={{ backgroundColor: '#fff' }}>
                    {/* 日历设置 */}
                    {currentSelectedKeys == 'calendarStrategy' && (
                      <CalendarSetPanel currentTitle={currentTitle} />
                    )}
                    {/* 样式设置 */}
                    {currentSelectedKeys == 'styleSet' && (
                      <StyleSetPanel currentTitle={currentTitle} />
                    )}
                    {currentSelectedKeys == 'SubscribeSet' && (
                      <SubSetPanel currentTitle={currentTitle} />
                    )}
                    {currentSelectedKeys == 'remindSet' && (
                      <RemaindSetPanel currentTitle={currentTitle} />
                    )}
                    {currentSelectedKeys == 'handleStrategy' && (
                      <TransaSetPanel currentTitle={currentTitle} />
                    )}
                  </Layout>
                </Layout>
              </div>
            </Card>
          </Card>
        </Spin>
      </PageContainers>
    );
  }
}

const subscribe = (state: any) => {
  const {
    dispatch,
    operatingCalendar: { systemPathList },
    loading,
  } = state;
  return {
    dispatch,
    systemPathList,
    getSystemPathListLoading: loading.effects['operatingCalendar/getSystemPathList'],
  };
};
export default connect(subscribe)(Index);

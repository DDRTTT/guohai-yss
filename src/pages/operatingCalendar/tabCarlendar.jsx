import React from 'react';
import { Tabs } from 'antd';
import moment from 'moment';

import styles from './tabCarlendar.less';

const { TabPane } = Tabs;

class Index extends React.Component {
  state = {
    currentMonthDays: 31,
    currentDay: '0',
    currentYear: '2020',
    currentMonth: '12',
  };

  UNSAFE_componentWillReceiveProps(props) {
    const { currentDate } = props;
    if (currentDate) {
      const [currentMonthDays, currentYear, currentMonth, currentDay] = this.getCurrentMonthDays(
        currentDate,
      );
      this.setState({
        currentMonthDays,
        currentDay,
        currentMonth,
        currentYear,
      });
    }
  }
  /**
   * tab被点击的回调
   */
  onTabClick = currentDay => {
    if (currentDay == this.state.currentDay) return;
    const { tabChange } = this.props;
    const { currentMonth, currentYear } = this.state;
    this.setState({ currentDay });

    tabChange &&
      tabChange(
        moment(currentYear + '-' + currentMonth + '-' + (+currentDay + 1)).format('YYYY-MM-DD'),
      );
  };
  /**
   * 获取当前的月份有几天
   */
  getCurrentMonthDays = _date => {
    let momentDate = moment(_date);
    let year = momentDate.format('YYYY');
    let month = momentDate.format('MM');
    let day = momentDate.format('D');
    return [new Date(year, month, -1).getDate() + 1, year, month, day - 1 + ''];
  };
  render() {
    const { currentMonthDays, currentDay } = this.state;
    return (
      <div className={styles.tabCarlendar}>
        <Tabs
          activeKey={currentDay}
          tabPosition="top"
          style={{ height: 40, width: '100%' }}
          onTabClick={this.onTabClick}
        >
          {[...Array(currentMonthDays).keys()].map(i => (
            <TabPane tab={i + 1} key={i}></TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default Index;

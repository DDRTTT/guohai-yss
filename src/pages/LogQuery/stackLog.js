/**
 * 堆栈日志
 */

import React from 'react';
import { connect } from 'dva';
import { Empty, Form, Input, Pagination, Select } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import { formatJson, getDateStr } from '@/utils/utils';
import styles from './stackLog.less';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import moment from 'moment';
import List from '@/components/List';

const dateFormat = 'YYYY-MM-DD';

const { Option } = Select;
const { TextArea } = Input;

@errorBoundary
@Form.create()
@connect(({ operationLog, loading }) => ({
  operationLog,
  loading: loading.effects['operationLog/fetchStackLog'],
}))
export default class stackLog extends BaseCrudComponent {
  state = {
    formValues: {
      currentPage: 1,
      pageSize: 1,
    },
  };

  // 分页
  handleStandardTableChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    formValues.currentPage = page;
    formValues.pageSize = pageSize;
    dispatch({
      type: `operationLog/fetchStackLog`,
      payload: {
        ...formValues,
      },
    });
  };

  // 查询
  handleSearch = fieldsValue => {
    const { dispatch } = this.props;
    const date = {
      startDate: getDateStr(-15),
      endDate: getDateStr(0),
    };
    if (fieldsValue?.date) {
      date.startDate = fieldsValue.date[0].format('YYYY-MM-DD');
      date.endDate = fieldsValue.date[1].format('YYYY-MM-DD');
    }
    const values = {
      service: fieldsValue?.service,
      severity: fieldsValue?.severity,
      message: fieldsValue?.message,
      currentPage: 1,
      pageSize: 1,
      ...date,
    };
    this.setState({
      formValues: values,
    });

    dispatch({
      type: `operationLog/fetchStackLog`,
      payload: values,
    });
  };
  
  //重置
  handleReset = () => {
    const { dispatch } = this.props;
    const values = { 
      currentPage: 1,
      pageSize: 1,
      startDate: moment(getDateStr(-15), dateFormat).format('YYYY-MM-DD'),
      endDate: moment(getDateStr(0), dateFormat).format('YYYY-MM-DD'),
    };
    this.setState({ formValues: values });
    dispatch({
      type: `operationLog/fetchStackLog`,
      payload: values,
    });
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // 服务模块 下拉
    dispatch({
      type: 'operationLog/searchgroup2',
      payload: {
        startDate: getDateStr(-7),
        endDate: getDateStr(0),
        group: [
          {
            groupName: 'service',
            groupLeve: 1,
          },
        ],
      },
    });

    // 日志级别 词汇
    dispatch({
      type: `operationLog/vocabularyDic`,
      payload: 'logLevel',
    });

    this.handleSearch();
  };

  render() {
    const {
      operationLog: { saveVocabularyDic, saveStackLog, saveSearchGroup },
      loading,
    } = this.props;

    const formItemData = [
      {
        name: 'date',
        label: '选择日期',
        type: 'RangePicker',
        initialValue: [moment(getDateStr(-15), dateFormat), moment(getDateStr(0), dateFormat)],
        rules: [
          {
            required: true,
            message: '请选择选择日期',
          },
        ],
      },
      {
        name: 'service',
        label: '服务模块',
        type: 'select',
        readSet: { name: 'key', code: 'key' },
        option: saveSearchGroup.rows,
      },
      {
        name: 'severity',
        label: '日志级别',
        type: 'select',
        option: saveVocabularyDic,
      },
      {
        name: 'message',
        label: '关键词',
        type: 'input',
      },
    ];

    return (
      <div className={styles.content}>
        <List
          formItemData={formItemData}
          advancSearch={this.handleSearch}
          resetFn={this.handleReset}
          loading={loading}
          fuzzySearchBool={false}
          tableList={(<>
            {saveStackLog.rows !== '' ? (
                <TextArea disabled value={formatJson(saveStackLog.rows)} className={styles.area} />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}

              {saveStackLog.rows !== '' ? (
                <Pagination
                  showQuickJumper
                  total={saveStackLog.total}
                  showTotal={total => `共 ${total} 条数据`}
                  defaultPageSize={1}
                  current={this.state.formValues.currentPage}
                  className={styles.pagination}
                  onChange={this.handleStandardTableChange}
                />
              ) : (
                ''
              )}
          </>)}
        />
      </div>
    );
  }
}

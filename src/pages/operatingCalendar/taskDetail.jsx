import React, { useState, useEffect, useContext } from 'react';
import {
  Select,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
  Spin,
} from 'antd';
import { connect } from 'dva';
import dataIcon from '@/assets/operatingCalendar/rw_ic_rl.png';
import timeIcon from '@/assets/operatingCalendar/rw_ic_nz.png';
import remindIcon from '@/assets/operatingCalendar/rw_ic_tx.png';
import priorityIcon from '@/assets/operatingCalendar/rw_ic_yxj.png';
import check1 from '@/assets/operatingCalendar/rw_ic_xk_n.png';
import check2 from '@/assets/operatingCalendar/rw_ic_xk_s.png';
import styles from './index.less';
import { isNullObj } from '@/pages/investorReview/func';
import moment from 'moment';
import { handleValidator } from '@/utils/utils';

import { IndexContext } from './modalPannel';
import { priorityEnum, remindRuleEnum, taskTypeEnum } from './staticEnum';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Index = props => {
  const { form } = useContext(IndexContext);
  const { getFieldDecorator } = form;
  const {
    privateConfig: { taskId },
    dispatch,
    taskInfo: { type: taskType, handleSchedule },
    taskInfo,
    taskInfoLoading,
  } = props;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'operatingCalendar/getQueryMsgById',
      payload: { id: taskId },
    });
  }, [taskId]);

  useEffect(() => {
    if (isNullObj(taskInfo)) return;
    setChecked(taskInfo['handleSchedule']);
    form.setFieldsValue({
      title: taskInfo['title'],
      content: taskInfo['content'],
      date: taskInfo['executeTime']
        ? [moment(taskInfo['executeTime']), moment(taskInfo['deadline'])]
        : [],
      time: taskInfo['remindTime'] ? moment(taskInfo['remindTime'], 'HH:mm:ss') : '',
    });
    if (taskType == 'task') {
      form.setFieldsValue({
        grade: +taskInfo['grade'] || '',
      });
    }
    if (taskType * 1 == 2) {
      form.setFieldsValue({
        grade: +taskInfo['remindRule'],
      });
    }
  }, [taskInfo]);

  // 完成/取消任务
  const handlerCheck = _checked => {
    setChecked(_checked);
    dispatch({
      type: 'operatingCalendar/updateHandleSchedul',
      payload: { flag: _checked ? 1 : 0, ids: taskId },
    });
  };

  // formItem的布局
  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
  return (
    <Spin spinning={taskInfoLoading}>
      <Form>
        <Form.Item {...formItemLayout}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              className={styles.commonMr}
              onClick={() => {
                handlerCheck(!checked);
              }}
              src={checked ? check2 : check1}
              alt=""
            />
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: `请输入${taskTypeEnum[taskType]}标题`,
                },
                {
                  validator: (rule, value, callback) => {
                    handleValidator(value, callback, 400, '输入的长度超过限制 , 请重新输入 !');
                  },
                },
              ],
            })(<Input placeholder={`请输入标题`} />)}
          </div>
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('content', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  handleValidator(value, callback, 2400, '输入的长度超过限制 , 请重新输入 !');
                },
              },
            ],
          })(<TextArea placeholder={`请输入描述`} />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={
            <span>
              <img src={dataIcon} className={styles.commonMr} />
              日期
            </span>
          }
        >
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: '请输入开始与结束日期',
              },
            ],
          })(<RangePicker />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={
            <span>
              <img src={timeIcon} className={styles.commonMr} />
              时间
            </span>
          }
        >
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: '请输入开始时间',
              },
            ],
          })(<TimePicker />)}
        </Form.Item>
        {
          <Form.Item
            {...formItemLayout}
            style={{ display: taskType && taskType != 'task' ? 'block' : 'none' }}
            label={
              <span>
                <img src={remindIcon} className={styles.commonMr} />
                提醒
              </span>
            }
          >
            {getFieldDecorator('remindRule', {
              // rules: [
              //   {
              //     required: true,
              //     message: '请选择提醒规则',
              //   },
              // ],
            })(
              <Select placeholder="请选择提醒规则">
                {remindRuleEnum.map((item, index) => {
                  return (
                    <Option key={item} value={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        }
        {
          <Form.Item
            style={{ display: taskType && taskType == 'task' ? 'block' : 'none' }}
            {...formItemLayout}
            label={
              <span>
                <img src={priorityIcon} className={styles.commonMr} />
                优先级
              </span>
            }
          >
            {getFieldDecorator(
              'grade',
              {},
            )(
              <Select placeholder="请选择优先级">
                {priorityEnum.map((item, index) => {
                  return (
                    <Option key={item} value={index + 1}>
                      {item}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        }
      </Form>
    </Spin>
  );
};
const operatingCalendar = state => {
  const {
    dispatch,
    operatingCalendar: { taskInfo },
    loading,
  } = state;
  return {
    dispatch,
    taskInfo,
    taskInfoLoading: loading.effects['operatingCalendar/getQueryMsgById'],
  };
};
export default connect(operatingCalendar)(Index);

import React, { useContext, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Icon, Input, Modal, Select } from 'antd';
import styles from './index.less';
import { taskTypeEnum } from './staticEnum';
import TaskDetail from './taskDetail';
import moment from 'moment';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import router from 'umi/router';

// 转换成数组
const taskKeys = Array.from(Object.keys(taskTypeEnum)).slice(1, 2);
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 共享状态
export const IndexContext = React.createContext();

// 选择任务类型
const AddTask = props => {
  const {
    privateConfig: { selectTaskType, grade },
  } = props;
  return (
    <div className={styles.taskTypeWrap}>
      {taskKeys.map((item, index) => {
        return (
          <p
            onClick={() => {
              selectTaskType(item, grade);
            }}
            key={'taskType' + item}
          >
            <Icon type="clock-circle" />
            {`创建${taskTypeEnum[item]}`}
          </p>
        );
      })}
    </div>
  );
};

// 添加任务模版
const TaskInfo = props => {
  const { form } = useContext(IndexContext);
  const { getFieldDecorator } = form;
  const {
    privateConfig: {
      showMore,
      setShowMore,
      taskType,
      startTime,
      grade,
      firstList,
      secList,
      personList,
    },
  } = props;

  // formItem的布局
  const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  // 如果是当天的就默认填充一下
  useEffect(() => {
    if (startTime) {
      form.setFieldsValue({
        date: [moment(startTime), moment(startTime)],
      });
    }
    if (taskType == 'task' && grade) {
      if (showMore) {
        form.setFieldsValue({
          grade: grade * 1,
        });
      } else {
        setShowMore(true);
      }
    }
  }, []);
  useEffect(() => {
    if (taskType == 'task' && showMore && grade) {
      form.setFieldsValue({
        grade: grade * 1,
      });
    }
  }, [showMore]);

  const layout = {
    labelAlign: 'left',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  let currentFirstTypeKey = firstList[0]?.code || '';

  const formItemData = [
    {
      name: 'type',
      label: '事项类型',
      type: 'select',
      width: 22,
      option: firstList,
      rules: [{ required: true, message: '请选择事项类型' }],
      config: {
        onChange: value => {
          form.setFieldsValue({ typeCode: '' });
          currentFirstTypeKey = value;
        },
        disabled: true,
      },
      initialValue: firstList[0]?.code || '',
    },
    {
      name: 'title',
      label: '自定义事项名称',
      width: 22,
      rules: [{ required: true, message: '请输入自定义事项名称' }],
    },
    {
      name: 'typeCode',
      label: '二级事项',
      type: 'select',
      width: 22,
      option: secList[currentFirstTypeKey],
      rules: [{ required: true, message: '请选择二级事项' }],
    },
    {
      name: 'content',
      label: '事项描述',
      type: 'area',
      width: 22,
      rules: [{ required: true, message: '请输入事项描述' }],
    },
    {
      name: 'date',
      label: '选择日期',
      type: 'rangepicker',
      width: 22,
      rules: [{ required: true, message: '请选择日期' }],
    },
    {
      name: 'time',
      label: '截止时间',
      type: 'timepicker',
      width: 22,
      rules: [{ required: true, message: '请选择时间' }],
    },
    {
      name: 'grade',
      label: '紧急程度',
      type: 'select',
      width: 22,
      option: [
        {
          name: '重要且紧急',
          code: 1,
        },
        {
          name: '重要不紧急',
          code: 2,
        },
        {
          name: '紧急但不重要',
          code: 3,
        },
        {
          name: '不紧急不重要',
          code: 4,
        },
      ],
    },
    {
      name: 'usercode',
      label: '添加委托人',
      type: 'select',
      option: personList,
      width: 22,
      config: { mode: 'multiple', maxTagCount: 1 },
      readSet: { name: 'username', code: 'id' },
    },
  ];

  return (
    <Form {...layout}>
      <CustomFormItem formItemList={formItemData} form={form} />
    </Form>
  );
};

// 添加任务的footer
const AddTaskFooter = props => {
  const { form } = useContext(IndexContext);
  const {
    privateConfig: {
      setShowTaskmodal,
      setShowMore,
      showMore,
      handlerSubmit,
      taskType,
      submitLoading = false,
    },
  } = props;

  //   添加任务提交数据的预处理
  const submitPayLoadPre = () => {
    form.validateFields((err, values) => {
      if (err) return;
      handlerSubmit({
        typeCode: values['typeCode'],
        type: values['type'],
        title: values['title'],
        grade: values['grade'],
        content: values['content'],
        remindTime: values['time'].format('HH:mm:ss'),
        executeTime: values['date'][0].format('YYYY-MM-DD'),
        deadline: values['date'][1].format('YYYY-MM-DD') + ' ' + values['time'].format('HH:mm:ss'),
        userList: values['usercode'],
      });
    });
  };
  return (
    <div className={styles.footerWrap}>
      <Button
        onClick={() => {
          // setShowMore(!showMore);
          router.push('/taskCenter/operatingCalendar/index/addTask');
        }}
        type="link"
      >
        更多选项
      </Button>
      <div>
        <Button
          onClick={() => {
            setShowTaskmodal(false);
          }}
        >
          取消
        </Button>
        <Button type="primary" loading={submitLoading} onClick={submitPayLoadPre}>
          确定
        </Button>
      </div>
    </div>
  );
};

// modal的卡槽
const Index = props => {
  const {
    setShowTaskmodal,
    showTaskmodal,
    modalConfig,
    privateConfig,
    form,
    submitLoading,
  } = props;
  const { modalType, handlerSubmit, taskType, cancelHandler, taskId } = privateConfig;
  //   是否显示更多选项 针对添加任务定制的
  const [showMore, setShowMore] = useState(false);

  return (
    <IndexContext.Provider value={{ form }}>
      <Modal
        bodyStyle={{ overflow: 'hidden' }}
        visible={showTaskmodal}
        destroyOnClose={true}
        footer={
          modalType == 'taskInfo' && (
            <AddTaskFooter
              privateConfig={{
                setShowTaskmodal,
                showMore,
                setShowMore,
                handlerSubmit,
                taskType,
                submitLoading,
              }}
            ></AddTaskFooter>
          )
        }
        {...modalConfig}
        onCancel={() => {
          //   添加任务提交数据的预处理
          if (modalType == 'taskDetail') {
            form.validateFields((err, values) => {
              if (err) return;
              cancelHandler &&
                cancelHandler({
                  id: taskId,
                  type: taskType,
                  title: values['title'],
                  content: values['content'],
                  executeTime: values['date'][0].format('YYYY-MM-DD'),
                  remindTime: values['time'].format('HH:mm:ss'),
                  deadline: values['date'][1].format('YYYY-MM-DD HH:mm:ss'),
                  grade: values['grade'],
                  remindRule: values['remindRule'],
                });
              setShowTaskmodal(false);
            });
          } else {
            setShowTaskmodal(false);
          }
        }}
      >
        {/*选择任务类型 */}
        {modalType == 'addTask' && <AddTask privateConfig={privateConfig}></AddTask>}
        {/* 添加任务 */}
        {modalType == 'taskInfo' && (
          <TaskInfo privateConfig={{ ...privateConfig, showMore, setShowMore }}></TaskInfo>
        )}
        {/* 任务详情 */}
        {modalType == 'taskDetail' && <TaskDetail privateConfig={privateConfig}></TaskDetail>}
      </Modal>
    </IndexContext.Provider>
  );
};

export default Form.create()(Index);

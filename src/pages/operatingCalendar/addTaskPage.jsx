import React from 'react';
import { Breadcrumb, Card, Form, Row, Button, Spin } from 'antd';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import router from 'umi/router';

class Index extends React.Component {
  //   当前一级事项选择的key
  currentFirstTypeKey = '';
  state = {
    breadCrumb: ['任务中心', '运营日历', '新增自定义事项'],
    firstList: [],
    secList: [],
  };
  layout = {
    labelAlign: 'left',
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };
  // 保存新增
  handlerSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const params = {
        typeCode: values['typeCode'],
        type: values['type'],
        title: values['title'],
        grade: values['grade'],
        content: values['content'],
        remindTime: values['time'].format('HH:mm:ss'),
        proCode: values['proCode'],
        executeTime: values['date'][0].format('YYYY-MM-DD'),
        deadline: values['date'][1].format('YYYY-MM-DD') + ' ' + values['time'].format('HH:mm:ss'),
        userList: values['usercode'],
      };
      this.props.dispatch({
        type: 'operatingCalendar/addTask',
        payload: params,
        callBack: () => {
          router.goBack();
        },
      });
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'operatingCalendar/getSecSubInfoList',
    });
    this.props.dispatch({
      type: 'operatingCalendar/getProductEnum',
    });
    this.props.dispatch({
      type: 'operatingCalendar/getPersonList',
    });
    this.props
      .dispatch({
        type: 'operatingCalendar/getAllSubInfoList',
      })
      .then(res => {
        const firstList = res.filter(item => item.parentId == 0);
        const secList = {};
        firstList.forEach(item => {
          res.forEach(sonItem => {
            if (item.id == sonItem.parentId) {
              if (secList[item.code]) {
                secList[item.code].push(sonItem);
              } else {
                secList[item.code] = [sonItem];
              }
            }
          });
        });
        this.setState({
          firstList,
          secList,
        });
      });
  }

  render() {
    const { breadCrumb, firstList, secList } = this.state;
    const {
      form,
      saveLoading = false,
      secSubInfoList = [],
      productEnum = [],
      personList = [],
      personListLoading = false,
      productEnumLoading = false,
      secSubInfoListLoading = false,
      submitLoading = false,
    } = this.props;
    // this.currentFirstTypeKey = firstList[0]?.code || '';
    this.currentFirstTypeKey = 'customItems';
    const formItemData = [
      {
        name: 'type',
        label: '事项类型',
        type: 'select',
        width: 13,
        option: firstList,
        rules: [{ required: true, message: '请选择事项类型' }],
        config: {
          onChange: value => {
            this.props.form.setFieldsValue({ typeCode: '' });
            this.currentFirstTypeKey = value;
          },
          disabled: true,
        },
        // initialValue: firstList[0]?.code || '',
        initialValue: 'customItems',
      },
      {
        name: 'title',
        label: '自定义事项名称',
        width: 13,
        rules: [{ required: true, message: '请输入自定义事项名称' }],
      },
      {
        name: 'typeCode',
        label: '二级事项',
        type: 'select',
        width: 13,
        option: secList[this.currentFirstTypeKey],
        rules: [{ required: true, message: '请选择二级事项' }],
      },
      {
        name: 'content',
        label: '事项描述',
        type: 'area',
        width: 13,
        rules: [{ required: true, message: '请输入事项描述' }],
      },
      {
        name: 'proCode',
        label: '产品名称',
        type: 'select',
        option: productEnum,
        readSet: { name: 'proName', code: 'proCode' },
        width: 13,
      },
      {
        name: 'date',
        label: '选择日期',
        type: 'rangepicker',
        width: 13,
        rules: [{ required: true, message: '请选择日期' }],
      },
      {
        name: 'time',
        label: '截止时间',
        type: 'timepicker',
        width: 13,
        rules: [{ required: true, message: '请选择时间' }],
      },
      {
        name: 'grade',
        label: '紧急程度',
        type: 'select',
        width: 13,
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
        width: 13,
        config: { mode: 'multiple', maxTagCount: 1 },
        readSet: { name: 'username', code: 'id' },
      },
    ];
    return (
      <>
        <Card>
          <Breadcrumb>
            {breadCrumb.map((item, index) => {
              return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
            })}
          </Breadcrumb>
        </Card>
        <Spin
          spinning={
            personListLoading || productEnumLoading || secSubInfoListLoading || submitLoading
          }
        >
          <Card
            title="新增自定义事项"
            extra={[
              <Button
                key="save"
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={this.handlerSubmit}
              >
                保存
              </Button>,
              <Button
                key="cancle"
                onClick={() => {
                  router.goBack();
                }}
              >
                取消
              </Button>,
            ]}
          >
            <Form {...this.layout}>
              <CustomFormItem formItemList={formItemData} form={form} />
            </Form>
          </Card>
        </Spin>
      </>
    );
  }
}

const addTaskPage = state => {
  const {
    dispatch,
    operatingCalendar: { secSubInfoList, productEnum, personList },
    loading,
  } = state;
  return {
    dispatch,
    secSubInfoList,
    productEnum,
    personList,
    secSubInfoListLoading: loading.effects['operatingCalendar/getSecSubInfoList'],
    productEnumLoading: loading.effects['operatingCalendar/getProductEnum'],
    personListLoading: loading.effects['operatingCalendar/getPersonList'],
    submitLoading: loading.effects['operatingCalendar/addTask'],
  };
};

export default errorBoundary(Form.create()(connect(addTaskPage)(Index)));

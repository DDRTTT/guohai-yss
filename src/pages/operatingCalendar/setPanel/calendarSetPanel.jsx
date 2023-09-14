import React from 'react';
import { Button, Form, Layout, Modal, Switch, Table } from 'antd';
import { connect } from 'dva';
import { SetPanelLayout } from './strategyComponent';
import { cloneDeep } from 'lodash';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';

const setPanelStyles = require('./setPanel.less');
const { confirm } = Modal;

const { Sider, Content } = Layout;

class calendarSetPanel extends React.Component {
  state = {
    modalVisible: false,
    modalTitle: '新增日历策略',
    initData: {},
  };
  //   当前编辑的数据
  currentEdit = null;
  layout = {
    labelAlign: 'right',
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['addressCode'],
    });
    this.getData();
  }

  /**
   *编辑
   */
  handleEdit = record => {
    let param = cloneDeep(record);
    this.currentEdit = cloneDeep(record);
    let { strategyName, tradeCode, weekBegins, displaysNum, isEnable } = param;
    tradeCode = tradeCode.split(',');
    param = { strategyName, tradeCode, weekBegins, displaysNum, isEnable };
    this.setState({
      modalTitle: '编辑日历策略',
      modalVisible: true,
      initData: param,
    });
  };

  /**
   * 删除
   */
  handleDelete = id => {
    confirm({
      title: '确认删除当前策略吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // console.log('OK');
        this.props.dispatch({
          type: 'operatingCalendar/scheduleStrategyDelete',
          payload: {
            ids: [id],
          },
          callBack: () => {
            this.getData();
          },
        });
      },
    });
  };

  /**
   *获取数据
   */
  getData = () => {
    this.props.dispatch({
      type: 'operatingCalendar/getAllByUser',
    });
  };

  columns = [
    {
      title: '日历策略',
      dataIndex: 'strategyName',
      key: 'strategyName',
    },
    {
      title: '每周开始于',
      dataIndex: 'weekBeginsString',
      key: 'weekBeginsString',
    },
    {
      title: '交易市场',
      dataIndex: 'tradeName',
      key: 'tradeName',
    },
    {
      title: '日程默认展示条数',
      dataIndex: 'displaysNumStr',
      key: 'displaysNumStr',
    },
    // {
    //   title: '待办状态显示',
    //   dataIndex: 'strategyName',
    //   key: 'strategyName',
    // },
    {
      title: '是否启用',
      key: 'isEnable',
      render: (text, record) => {
        return (
          <Switch
            checked={!!record.isEnable}
            onChange={checked => {
              const params = cloneDeep(record);
              params.isEnable = Number(checked);

              // todo:待后台接口配合
              //if (params.isEnable === 0) return;
              this.props.dispatch({
                type: 'operatingCalendar/scheduleStrategyAdd',
                payload: params,
                callBack: () => {
                  this.getData();
                },
              });
            }}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'handle',
      render: (text, record) => {
        return (
          <>
            <a
              onClick={() => {
                this.handleEdit(record);
              }}
            >
              编辑
            </a>
            <a
              style={{ marginLeft: '5px' }}
              onClick={() => {
                this.handleDelete(record.id);
              }}
            >
              删除
            </a>
          </>
        );
      },
    },
  ];

  /**
   * 新增日历策略
   */
  onAddHandler = () => {
    this.currentEdit = null;
    this.setState({
      modalTitle: '新增日历策略',
      modalVisible: true,
      initData: {
        strategyName: '',
        tradeCode: [],
        weekBegins: '1',
        displaysNum: '1',
        isEnable: 0,
      },
    });
  };
  /**
   * 弹出框确认的时候
   */
  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const params = cloneDeep(values);
      params.tradeCode = params.tradeCode.join(',');
      params.isEnable = Number(params.isEnable);
      if (this.currentEdit) {
        params.id = this.currentEdit.id;
      }
      this.props.dispatch({
        type: 'operatingCalendar/scheduleStrategyAdd',
        payload: params,
        callBack: () => {
          this.setState({
            modalVisible: false,
          });
          this.getData();
        },
      });
    });
  };

  render() {
    const { calendarSetList, currentTitle, form, codeList, calendarSetListLoading } = this.props;
    const { modalVisible, modalTitle, initData } = this.state;
    const formItemData = [
      {
        name: 'strategyName',
        label: '日历策略:',
        width: 24,
        rules: [{ required: true, message: '请输入策略名称' }],
        initialValue: initData.strategyName,
      },
      {
        name: 'weekBegins',
        label: '每周开始于:',
        type: 'select',
        option: [
          { name: '周一', code: 1 },
          { name: '周日', code: 0 },
        ],
        width: 24,
        rules: [{ required: true, message: '请选择每周开始时间' }],
        initialValue: initData.weekBegins + '',
      },
      {
        name: 'tradeCode',
        label: '交易市场:',
        type: 'checkbox',
        option: codeList['addressCode'] || [],
        width: 24,
        rules: [{ required: true, message: '请选择交易市场' }],
        initialValue: initData.tradeCode,
      },
      {
        name: 'displaysNum',
        label: '日程默认显示条数:',
        type: 'select',
        option: [
          { name: '1条', code: 1 },
          { name: '2条', code: 2 },
          { name: '3条', code: 3 },
          { name: '4条', code: 4 },
          { name: '5条', code: 5 },
          { name: '6条', code: 6 },
        ],
        width: 24,
        initialValue: initData.displaysNum + '',
      },
      //   {
      //     name: 'content',
      //     label: '日历待办状态显示',
      //     type: 'checkbox',
      //     width: 24,
      //   },
      {
        name: 'isEnable',
        label: '是否启用:',
        type: 'radio',
        option: [
          { name: '是', code: 1 },
          { name: '否', code: 0 },
        ],
        width: 24,
        initialValue: initData.isEnable,
      },
    ];
    return (
      <>
        <SetPanelLayout
          currentTitle={currentTitle}
          rightNode={<Button onClick={this.onAddHandler}>新增</Button>}
        >
          <Table
            pagination={false}
            rowKey="id"
            dataSource={calendarSetList}
            columns={this.columns}
            loading={calendarSetListLoading}
          />
        </SetPanelLayout>

        <Modal
          title={modalTitle}
          visible={modalVisible}
          destroyOnClose={true}
          onOk={this.handleModalOk}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <Form className={setPanelStyles.addForm} {...this.layout} style={{ overflow: 'hidden' }}>
            <CustomFormItem formItemList={formItemData} form={form} />
          </Form>
        </Modal>
      </>
    );
  }
}

const Index = state => {
  const {
    dispatch,
    operatingCalendar: { calendarSetList },
    investorReview: { codeList },
    loading,
  } = state;
  return {
    dispatch,
    codeList,
    calendarSetList,
    calendarSetListLoading: loading.effects['operatingCalendar/getAllByUser'],
  };
};
export default Form.create()(connect(Index)(calendarSetPanel));

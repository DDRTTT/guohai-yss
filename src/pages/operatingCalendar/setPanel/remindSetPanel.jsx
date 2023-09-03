import React from 'react';
import { Card, Table, Switch, Spin, Collapse, Button, Form, Modal } from 'antd';
import { connect } from 'dva';
import styles from './../index.less';
import router from 'umi/router';
import { SetPanelLayout } from './strategyComponent';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
const setPanelStyles = require('./setPanel.less');
const { Panel } = Collapse;
import { cloneDeep } from 'lodash';
const { confirm } = Modal;
import { getUserInfo } from '@/utils/session';

/**
 * 提醒
 */
class Index extends React.Component {
  // 当前激活的面板的key
  activeKey = '';
  //   当前一级事项选择的key
  currentFirstTypeKey = '';
  //   当前编辑的数据
  currentEdit = null;
  state = {
    modalTitle: '',
    modalVisible: false,
    initData: {},
    firstList: [],
    secList: [],
    showAddBtn: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['remindWay', 'remindTime', 'remindRate'],
    });
    // 只有管理员才显示新增按钮
    if (JSON.parse(sessionStorage.getItem('USER_INFO')).type == '01') {
      this.setState({
        showAddBtn: true,
      });
    }
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
    this.getData();
  }
  layout = {
    labelAlign: 'right',
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };
  columns = [
    {
      title: '事项类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '提醒时间',
      dataIndex: 'timeName',
      key: 'timeName',
    },
    {
      title: '提醒方式',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '提醒频率',
      dataIndex: 'rateName',
      key: 'rateName',
    },
    {
      title: '是否启用',
      key: 'isEnable',
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={!!record.isEnable}
            onChange={checked => {
              const params = cloneDeep(record);
              params.isEnable = Number(checked);
              this.props.dispatch({
                type: 'operatingCalendar/addPeople',
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
      key: 'opt',
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
   *编辑
   */
  handleEdit = record => {
    let param = cloneDeep(record);
    this.currentEdit = cloneDeep(record);
    let { firstCode, subCode, remindTime, remindType, remindFrequency, isEnable } = param;
    isEnable = !!isEnable;
    param = { firstCode, subCode, remindTime, remindType, remindFrequency, isEnable };
    this.currentFirstTypeKey = firstCode;
    this.setState({
      modalTitle: '编辑提醒策略',
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
        this.props.dispatch({
          type: 'operatingCalendar/deleteById',
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
   * 刷新列表
   */
  getData = () => {
    this.props.dispatch({
      type: 'operatingCalendar/getRemindList',
    });
  };
  /**
   * 切换一级tab
   */
  handlerCollapseChange = key => {
    this.activeKey = key;
  };
  /**
   *新增提醒策略
   */
  onAddHandler = () => {
    this.currentEdit = null;
    this.setState({
      modalTitle: '新增提醒策略',
      initData: {},
      modalVisible: true,
    });
  };
  /**
   * 弹出框确认的时候
   */
  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const params = cloneDeep(values);
      params.isEnable = Number(params.isEnable);
      if (this.currentEdit) {
        params.id = this.currentEdit.id;
      }
      this.props
        .dispatch({
          type: 'operatingCalendar/addPeople',
          payload: params,
        })
        .then(res => {
          if (res) {
            this.setState({
              modalVisible: false,
            });
            this.getData();
          }
        });
    });
  };
  /**
   * 解析数据
   */
  render() {
    const {
      remindList = [],
      changeLoading = false,
      listLoading = false,
      currentTitle,
      form,
      codeList,
    } = this.props;
    const { modalTitle, modalVisible, initData, firstList, secList, showAddBtn } = this.state;
    const formItemData = [
      {
        name: 'firstCode',
        label: '事项类型',
        type: 'select',
        width: 24,
        option: firstList,
        rules: [{ required: true, message: '请选择事项类型' }],
        initialValue: initData.firstCode,
        config: {
          onChange: value => {
            this.props.form.setFieldsValue({ subCode: '' });
            this.currentFirstTypeKey = value;
          },
        },
      },
      {
        name: 'subCode',
        label: '二级事项',
        type: 'select',
        width: 24,
        rules: [{ required: true, message: '请选择二级事项类型' }],
        initialValue: initData.subCode,
        option: secList[this.currentFirstTypeKey],
      },
      {
        name: 'remindTime',
        label: '提醒时间',
        type: 'select',
        width: 24,
        rules: [{ required: true, message: '请选择提醒时间' }],
        initialValue: initData.remindTime,
        option: codeList['remindTime'],
      },
      {
        name: 'remindType',
        label: '提醒方式',
        type: 'select',
        width: 24,
        rules: [{ required: true, message: '请选择提醒方式' }],
        option: codeList['remindWay'],
        initialValue: initData.remindType,
      },
      {
        name: 'remindFrequency',
        label: '提醒频率',
        type: 'select',
        width: 24,
        option: codeList['remindRate'],
        initialValue: initData.remindFrequency,
      },
      {
        name: 'isEnable',
        label: '启用本策略',
        type: 'switch',
        width: 24,
        initialValue: initData.isEnable,
        otherConfig: {
          valuePropName: 'checked',
        },
      },
    ];
    return (
      <>
        <SetPanelLayout
          currentTitle={currentTitle}
          rightNode={showAddBtn ? <Button onClick={this.onAddHandler}>新增</Button> : <></>}
        >
          <Spin spinning={changeLoading || listLoading}>
            <div className={styles.subscribe}>
              <Collapse accordion onChange={this.handlerCollapseChange}>
                {remindList.map(item => {
                  return (
                    <Panel header={item.name} key={item.code}>
                      <Table
                        pagination={false}
                        rowKey="id"
                        dataSource={item.remindList}
                        columns={this.columns}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </Spin>
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

const subscribe = state => {
  const {
    dispatch,
    operatingCalendar: { remindList },
    investorReview: { codeList },
    loading,
  } = state;
  return {
    dispatch,
    remindList,
    codeList,
    listLoading: loading.effects['operatingCalendar/getRemindList'],
    changeLoading: loading.effects['operatingCalendar/addPeople'],
  };
};
export default Form.create()(connect(subscribe)(Index));

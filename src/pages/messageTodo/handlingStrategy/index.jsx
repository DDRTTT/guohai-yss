/**
 * 办理策略
 */

import React from 'react';
import { Spin, Collapse, Button, Form, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../setPanel.less';
import { SetPanelLayout } from '../components/strategyComponent';
import CustomFormItem from '@/components/AdvancSearch/CustomFormItem';
import { ResizeableTable } from '@/components';
const setPanelStyles = require('../setPanel.less');
const { Panel } = Collapse;
import cloneDeep from 'lodash/cloneDeep';
const { confirm } = Modal;

/**
 * 办理
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
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'investorReview/getDicsByTypes',
      payLoad: ['handleWay', 'handleStrategy', 'handleRules'],
    });

    this.props
      .dispatch({
        type: 'operatingCalendar/getAllSubInfoList',
      })
      .then(res => {
        const firstList = res?.filter(item => item.parentId == 0);
        if (firstList) {
          // 把产品事项给删掉
          const indexNum = firstList.findIndex(item => item.code == 'productMatters');
          firstList.splice(indexNum, 1);
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
        }
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
      title: '事项名称',
      dataIndex: 'name',
      key: 'name',
      with: 100,
    },
    {
      title: '办理方式',
      dataIndex: 'wayName',
      key: 'wayName',
    },
    {
      title: '办理策略',
      dataIndex: 'strategyName',
      key: 'strategyName',
    },
    {
      title: '处理目标',
      dataIndex: 'processingArget',
      key: 'processingArget',
    },
    {
      title: '办理规则',
      dataIndex: 'dealRules',
      key: 'dealRules',
      render: text => {
        const list = text.split(',');
        const jgList = [
          ['不可延期', '可延期'],
          ['不可忽略', '可忽略'],
          ['不可委托', '可委托'],
          ['不可移交', '可移交'],
          ['不可手工', '可手工'],
        ];
        if (!list[0].length) {
          return <span />;
        }
        let str = list.map((item, index) => {
          return jgList[index][item] + (index == list.length - 1 ? '' : ',');
        });
        return <span>{str}</span>;
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
    let { firstCode, subCode, handleWay, handleStrategy, processingArget, dealRules } = param;
    this.currentFirstTypeKey = firstCode;
    const dealRulesList = dealRules.split(',');
    const [yanqi, hulue, weituo, yijiao, shougong] = [...dealRulesList];
    param = {
      firstCode,
      subCode,
      handleWay,
      handleStrategy,
      processingArget,
      yanqi,
      hulue,
      weituo,
      yijiao,
      shougong,
    };
    this.setState({
      modalTitle: '编辑办理策略',
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
          type: 'operatingCalendar/handleStrategyDeleteById',
          payLoad: {
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
   * 切换订阅状态
   */
  changeSubscribeState = (state, record) => {
    this.props
      .dispatch({
        type: 'operatingCalendar/subscribeChange',
        payLoad: {
          firstCode: this.activeKey,
          subCode: record.code,
          state: Number(!state),
        },
      })
      .then(() => {
        this.getData();
      });
  };
  /**
   * 刷新列表
   */
  getData = () => {
    this.props.dispatch({
      type: 'operatingCalendar/getHandleList',
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
      modalTitle: '新增办理策略',
      modalVisible: true,
      initData: {
        yanqi: 1,
        hulue: 1,
        yijiao: 1,
        weituo: 1,
        shougong: 1,
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
      if (this.currentEdit) {
        params.id = this.currentEdit.id;
      }
      const { yanqi = 1, hulue = 1, weituo = 1, yijiao = 1, shougong = 1 } = params;
      params.dealRules = [yanqi, hulue, weituo, yijiao, shougong].join(',');
      this.props
        .dispatch({
          type: 'operatingCalendar/handleStrategyAdd',
          payLoad: params,
        })
        .then(() => {
          this.setState({
            modalVisible: false,
          });
          this.getData();
        });
    });
  };
  /**
   * 解析数据
   */
  render() {
    const {
      handleList = [],
      changeLoading = false,
      listLoading = false,
      currentTitle,
      form,
      codeList,
    } = this.props;
    const { modalTitle, modalVisible, initData, firstList, secList } = this.state;
    const formItemData = [
      {
        name: 'firstCode',
        label: '事项名称',
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
        name: 'handleWay',
        label: '办理方式',
        type: 'select',
        width: 24,
        rules: [{ required: true, message: '请选择办理方式' }],
        initialValue:
          this.currentFirstTypeKey == 'processMatters'
            ? '0'
            : this.currentFirstTypeKey == 'customItems'
              ? '1'
              : initData.handleWay,
        // option: codeList['handleWay'],
        config: {
          disabled:
            this.currentFirstTypeKey == 'processMatters' ||
            this.currentFirstTypeKey == 'customItems',
        },
        option: [
          { name: '线上办理', code: 0 },
          { name: '线下办理', code: 1 },
        ],
      },
      {
        name: 'handleStrategy',
        label: '办理策略',
        type: 'select',
        width: 24,
        rules: [{ required: true, message: '请选择办理策略' }],
        option: codeList['handleStrategy'],
        config: {
          disabled: this.currentFirstTypeKey == 'processMatters',
        },
        initialValue:
          this.currentFirstTypeKey == 'processMatters' ? 'scheduleHandle' : initData.handleStrategy,
      },
      {
        name: 'processingArget',
        label: '处理目标',
        width: 24,
        initialValue: initData.processingArget,
      },
      // {
      //   name: 'dealRules',
      //   label: '办理规则',
      //   type: 'select',
      //   width: 24,
      //   option: codeList['handleRules'],
      //   initialValue: initData.dealRules,
      // },
      {
        name: 'yanqi',
        label: '是否可以延期',
        type: 'radio',
        width: 24,
        option: [
          { name: '可以', code: 1 },
          { name: '不可以', code: 0 },
        ],
        initialValue: +initData.yanqi,
        unRender: this.currentFirstTypeKey == 'processMatters',
      },
      {
        name: 'hulue',
        label: '是否可以忽略',
        type: 'radio',
        width: 24,
        option: [
          { name: '可以', code: 1 },
          { name: '不可以', code: 0 },
        ],
        initialValue: +initData.hulue,
        unRender: this.currentFirstTypeKey == 'processMatters',
      },
      {
        name: 'weituo',
        label: '是否可以委托',
        type: 'radio',
        width: 24,
        option: [
          { name: '可以', code: 1 },
          { name: '不可以', code: 0 },
        ],
        initialValue: +initData.weituo,
        unRender: this.currentFirstTypeKey == 'processMatters',
      },
      {
        name: 'yijiao',
        label: '是否可以移交',
        type: 'radio',
        width: 24,
        option: [
          { name: '可以', code: 1 },
          { name: '不可以', code: 0 },
        ],
        initialValue: +initData.yijiao,
        unRender: this.currentFirstTypeKey == 'processMatters',
      },
      {
        name: 'shougong',
        label: '是否可以手工发起',
        type: 'radio',
        width: 24,
        option: [
          { name: '可以', code: 1 },
          { name: '不可以', code: 0 },
        ],
        initialValue: +initData.shougong,
        unRender: this.currentFirstTypeKey == 'processMatters',
      },
    ];
    return (
      <div className={styles.content}>
        <SetPanelLayout
          currentTitle={currentTitle}
          rightNode={<Button onClick={this.onAddHandler}>新增</Button>}
        >
          <Spin spinning={changeLoading || listLoading}>
            <div className={styles.subscribe}>
              <Collapse accordion onChange={this.handlerCollapseChange}>
                {handleList.map(item => {
                  return (
                    <Panel header={item.name} key={item.code}>
                      <ResizeableTable
                        pagination={false}
                        rowKey="id"
                        dataSource={item.handleList}
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
      </div>
    );
  }
}

const subscribe = state => {
  const {
    dispatch,
    operatingCalendar: { handleList },
    investorReview: { codeList },
    loading,
  } = state;
  return {
    dispatch,
    handleList,
    codeList,
    listLoading: loading.effects['operatingCalendar/getHandleList'],
    changeLoading: loading.effects['operatingCalendar/subscribeChange'],
  };
};
export default Form.create()(connect(subscribe)(Index));

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import {
  Form,
  Table,
  Input,
  Modal,
  Row,
  Col,
  Button,
  Select,
  Divider,
  Popconfirm,
  Spin,
  message,
} from 'antd';
import styles from './index.less';
import List from '@/components/List';
import { Card } from '@/components';
// import { getSession } from '@/utils/session';

// const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

@Form.create()
class Index extends Component {
  state = {
    loading: false, // 列表加载状态
    current: 1,
    pageSize: 10,
    total: 0,
    dataSource: [], // 列表数据

    mapVisible: false, // 编辑弹出框标题
    mapLoading: false, // 编辑弹出框是否展示
    mapTitle: '', // 编辑弹出框标题
    editType: '', // 编辑类型：add=新增，view=详情，update=修改
    record: {}, // 查询/修改时，单条数据

    organizationList: [], // 管理人列表
    customId: undefined, // 选中管理人id
    recRecordTypeList: [], // 对账类型列表
    typeCode: undefined, // 选中对账类型
    recValuationList: [], // 不同表返回的字段      {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
    titleRow: 4, // 标题所占行数（excel表格中，表格头部占用标的行数），默认4
    id: undefined, // 当前编辑的id
  };
  componentDidMount() {
    this.query(); // 列表加载
    const { dispatch } = this.props;
    // 管理人
    dispatch({
      type: 'eleReconciliation/getOrganization',
    }).then(res => {
      if (res) {
        this.setState({ organizationList: res });
      }
    });
    // 对账类型
    dispatch({
      type: 'eleReconciliation/getRecRecordType',
    }).then(res => {
      if (res) {
        this.setState({ recRecordTypeList: res.recRecordType });
      }
    });
  }
  // 列表，查询分页
  query = () => {
    const { dispatch } = this.props;
    const { current, pageSize } = this.state;
    let payload = {
      currentPage: current,
      pageSize: pageSize,
    };
    this.setState({ loading: true }, () => {
      dispatch({
        type: 'eleReconciliation/getTableList',
        payload,
      }).then(res => {
        if (res) {
          this.setState({ dataSource: res.rows, total: res.total });
        }
        this.setState({ loading: false });
      });
    });
  };
  handleSetPageNum = current => {
    this.setState({ current }, () => {
      this.query();
    });
  };
  handleSetPageSize = (current, pageSize) => {
    this.setState({ current, pageSize }, () => {
      this.query();
    });
  };

  // 关闭编辑弹窗
  mapModalCancel = () => {
    this.setState({
      mapVisible: false,
      recValuationList: [],
      customId: undefined,
      typeCode: undefined,
      id: undefined,
      titleRow: 4,
    });
  };
  /*  列表右上角，新增按钮点击 
        record：    数据{}，查看/修改时需要
        mapTitle：  标题文案
        editType:   add=新增，update=修改，view=查看
    */
  setMappingModal = (record, mapTitle, editType) => {
    const { dispatch } = this.props;
    this.setState(
      { mapVisible: true, record, mapTitle, editType },
      () => {
        if (editType === 'view' || editType === 'update') {
          this.setState({ mapLoading: true }, () => {
            // 查详情
            dispatch({
              type: 'eleReconciliation/detail',
              payload: { id: record.id },
            }).then(res => {
              if (res) {
                this.setState({
                  id: record.id,
                  customId: res.TRecTemplate.customId,
                  typeCode: res.TRecTemplate.typeCode,
                  titleRow: res.TRecTemplate.titleRow,
                  recValuationList: res.TRecTemplateDetail,
                });
              }
              this.setState({ mapLoading: false });
            });
          });
        }
      },
    );
  };
  // 根据对账类型，显示对应表单字段集合
  showFrom() {
    const { getFieldDecorator } = this.props.form;
    const children = [];
    let { recValuationList, titleRow } = this.state;
    const resultItem = [];
    resultItem.push(
      <Row gutter={24}>
        <Col span={8} key="-1">
          <Form.Item label="标题行数:">
            {getFieldDecorator('titleRow', {
              rules: [
                {
                  required: true,
                  message: '请输入标题行数',
                },
              ],
              initialValue: titleRow,
            })(
              <Input
                placeholder="请输入"
                disabled={this.state.editType === 'view' ? true : false}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>,
    );
    if (recValuationList) {
      for (let i = 0; i < recValuationList.length; i++) {
        children.push(
          // {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
          <Col span={8} key={i}>
            <Form.Item label={recValuationList[i].standardName}>
              {getFieldDecorator(recValuationList[i].standardCode, {
                // rules: [
                //   {
                //     required: true,
                //     message: `请输入${recValuationList[i].standardName}`,
                //   },
                // ],
                initialValue: recValuationList[i].sourceName,
              })(
                <Input
                  placeholder="请输入"
                  disabled={this.state.editType === 'view' ? true : false}
                />,
              )}
            </Form.Item>
          </Col>,
        );
      }
    }
    resultItem.push(<Row gutter={24}>{children}</Row>);

    return resultItem;
  }
  // 对账类型修改，触发onchange
  recRecordTypeChange(value) {
    // 后去对应表下的表单
    const { dispatch } = this.props;
    dispatch({
      type: 'eleReconciliation/getRecRecordList',
      payload: {
        datadictCode: value,
      },
    }).then(res => {
      if (res) {
        const resultList = []; // 要拼接为 {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
        res.forEach((item, index) => {
          resultList.push({
            standardCode: item.code,
            standardName: item.name,
          });
        });
        this.setState({ typeCode: value, recValuationList: resultList });
      }
    });
  }
  // 编辑的保存
  mapSave = () => {
    const { customId, typeCode, editType, recValuationList } = this.state;
    const { dispatch, form } = this.props;
    if (!recValuationList || recValuationList.length <= 0) {
      message.warn('请填写完整');
      return;
    }
    let validateFields = ['customId', 'typeCode', 'titleRow']; // 需要验证的字段
    recValuationList.forEach((item, index) => {
      validateFields.push(item.standardCode); // {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
    });

    form.validateFields(validateFields, (err, vals) => {
      if (err) return;

      this.setState({ mapLoading: true }, () => {
        let submitFormData = {
          // 拼接要提交的结构
          coreModule: 'TRecTemplate',
          listModule: ['TRecTemplate', 'TRecTemplateDetail'],
          ignoreTable: [],
          TRecTemplate: {},
          TRecTemplateDetail: [],
        };
        let urlType = ''; // 需要请求的接口
        if (editType === 'update') {
          // 修改时拼接参数
          submitFormData.id = this.state.id;
          submitFormData.TRecTemplate = {
            id: this.state.id,
            customId: vals.customId,
            typeCode: vals.typeCode,
            titleRow: vals.titleRow,
          };
          recValuationList.forEach((item, index) => {
            // {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
            item.sourceName = vals[item.standardCode]; // 用户填写值
          });
          submitFormData.TRecTemplateDetail = recValuationList;
          urlType = 'eleReconciliation/update';
        } else {
          // 新增时拼接参数
          submitFormData.TRecTemplate = {
            customId: vals.customId,
            typeCode: vals.typeCode,
            titleRow: vals.titleRow,
          };
          let TRecTemplateDetail = [];
          recValuationList.forEach((item, index) => {
            // {"standardCode":"FKMBM","standardName":"科目编码","sourceName":"用户填写值"}
            TRecTemplateDetail.push({
              standardCode: item.standardCode,
              standardName: item.standardName,
              sourceName: vals[item.standardCode], // 用户填写值
            });
          });
          submitFormData.TRecTemplateDetail = TRecTemplateDetail;
          urlType = 'eleReconciliation/add';
        }

        dispatch({
          type: urlType,
          payload: submitFormData,
        }).then(res => {
          if (res) {
            message.success('操作成功');
            this.query(); // 刷新列表
            this.mapModalCancel(); // 关闭编辑弹出时的设置
          }
          this.setState({ mapLoading: false });
        });
      });
    });
  };
  
  // 删除
  del = id => {
    this.setState({ loading: true }, () => {
      this.props
        .dispatch({
          type: 'eleReconciliation/del',
          payload: { id },
        })
        .then(res => {
          if (res) {
            this.query();// 刷新列表
          } else {
            this.setState({ loading: false });
          }
        });
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      total,
      current,
      pageSize,
      dataSource,
      mapLoading,
      mapVisible,
      mapTitle,
      record,
      organizationList,
      recRecordTypeList,
      recValuationList,
      customId,
      typeCode,
      id,
    } = this.state;
    const dataTableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 90,
        fixed: 'left',
        align: 'center',
        render: (val, record, index) => `${index + 1 + (current - 1) * pageSize}`,
      },
      { title: '管理人', dataIndex: 'customId-value', key: 'customId-value' },
      { title: '对账类型', dataIndex: 'typeCode-value', key: 'typeCode-value' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 300,
        render: (text, record) => (
          <span>
            <a onClick={() => this.setMappingModal(record, '查看', 'view')}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.setMappingModal(record, '修改', 'update')}>修改</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title={'确认删除此条数据么？'}
              onConfirm={() => this.del(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <>
        <List
          title="电子对账模板设置"
          fuzzySearchBool={false}
          advancSearchBool={false}
          showSearch={false}
          // showBreadCrumb={false}
          extra={
            <Button type="primary" onClick={() => this.setMappingModal({}, '新增', 'add')}>
              新增
            </Button>
          }
          tableList={
            <Table
              rowKey={record => record.id}
              dataSource={dataSource}
              columns={dataTableColumns}
              loading={loading}
              scroll={{ x: dataTableColumns.length * 200, y: 590 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total,
                showTotal: () => `共 ${total} 条`,
                onChange: page => this.handleSetPageNum(page),
                onShowSizeChange: (page, size) => this.handleSetPageSize(page, size),
                pageSize,
                current,
              }}
            />
          }
        />
        <Modal
          title={`电子对账模板${mapTitle}`}
          visible={mapVisible}
          width={800}
          onCancel={this.mapModalCancel}
          footer={null}
          destroyOnClose={true}
          style={{ top: 20 }}
        >
          {mapVisible && (
            <Spin spinning={mapLoading}>
              <div className={styles.editDiv}>
                <Row gutter={24}>
                  <Col md={8}>
                    <Form.Item label="管理人:" {...formItemLayout}>
                      {getFieldDecorator('customId', {
                        rules: [{ required: true, message: '请选择管理人' }],
                        initialValue: this.state.customId,
                      })(
                        <Select
                          style={{ width: '100%' }}
                          placeholder="请选择管理人"
                          showSearch
                          optionFilterProp="children"
                          disabled={this.state.editType === 'add' ? false : true}
                        >
                          {organizationList?.length > 0 &&
                            organizationList.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.orgName}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8}>
                    <Form.Item label="对账类型:" {...formItemLayout}>
                      {getFieldDecorator('typeCode', {
                        rules: [{ required: true, message: '请选对账类型' }],
                        initialValue: this.state.typeCode,
                      })(
                        <Select
                          style={{ width: '100%' }}
                          placeholder="请选择对账类型"
                          showSearch
                          optionFilterProp="children"
                          onChange={val => this.recRecordTypeChange(val)}
                          disabled={this.state.editType === 'add' ? false : true}
                        >
                          {recRecordTypeList?.length > 0 &&
                            recRecordTypeList.map(item => (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <div
                  className={styles.container}
                >
                  {recValuationList?.length > 0 ? (
                    <div>{this.showFrom()}</div>
                  ) : (
                    <div className={styles.notypecode}>
                      请选择对账类型
                    </div>
                  )}
                </div>
                <div
                  style={{
                    margin: '10px 0 10px 0',
                    display: this.state.editType === 'view' ? 'none' : 'block',
                  }}
                >
                  <Row>
                    <Col span={24} style={{ marginBottom: 10, textAlign: 'right' }}>
                      <Button style={{ marginRight: 8 }} onClick={this.mapModalCancel}>
                        取消
                      </Button>
                      <Button
                        type="primary"
                        style={{ marginRight: 8 }}
                        loading={mapLoading}
                        onClick={this.mapSave}
                      >
                        确定
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Spin>
          )}
        </Modal>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(({ eleReconciliation, dataSource }) => ({ eleReconciliation, dataSource }))(Index),
    ),
  ),
);
export default WrappedSingleForm;

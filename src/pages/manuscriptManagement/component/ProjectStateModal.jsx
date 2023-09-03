import { Modal, Form, Select, Card, Tabs, Row, Col, Table } from 'antd';
import { connect } from 'dva';
import SelfTree from '@/components/SelfTree';

const { Option } = Select;
const { TabPane } = Tabs;

const ProjectStateModal = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    state = {
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '证件类型',
          dataIndex: 'idName',
          key: 'idName',
        },
        {
          title: '证件号码',
          dataIndex: 'idCard',
          key: 'idCard',
        },
        {
          title: '公司部门',
          dataIndex: 'department',
          key: 'department',
        },
        {
          title: '公司职务',
          dataIndex: 'job',
          key: 'job',
        },
        {
          title: '项目组角色',
          dataIndex: 'role',
          key: 'role',
        },
      ],
      curSelectState: null,
    };

    getReportPreviewReq = projectState => {
      const {
        curReportRecord: { proCode },
        reportTypeKey,
      } = this.props;
      this.props.dispatch({
        type: 'manuscriptManagement/getReportPreviewReq',
        payload: {
          proCode,
          projectState,
          reportTypeKey,
        },
      });
    };

    handleProjectStateChange = code => {
      this.setState({
        curSelectState: code,
      });
      if (code !== 'othersState') {
        this.getReportPreviewReq(code);
        this.props.form.setFieldsValue({
          othersState: null,
        });
      }
    };

    handleOthersStateChange = code => {
      this.getReportPreviewReq(code);
    };

    render() {
      const {
        manuscriptManagement: { previewInfo },
        visible,
        reportTypeKey,
        onCancel,
        onCreate,
        confirmLoading,
        form,
      } = this.props;
      const { columns, curSelectState } = this.state;
      const { getFieldDecorator } = form;

      return (
        <Modal
          width={'60vw'}
          bodyStyle={{
            height: '80vh',
            overflow: 'auto',
          }}
          visible={visible}
          title="选择项目阶段"
          okText={
            {
              0: '项目报送',
              1: '文件报送',
              2: '底稿范围外项目报送',
              3: '底稿范围外文件报送',
            }[reportTypeKey]
          }
          confirmLoading={confirmLoading}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="项目阶段">
              {getFieldDecorator('projectState', {
                rules: [{ required: true, message: '请选择项目阶段!' }],
              })(
                <Select onChange={this.handleProjectStateChange} placeholder="请选择项目阶段...">
                  <Option value="state2" key="0">
                    申报阶段
                  </Option>
                  <Option value="state3" key="1">
                    发行阶段
                  </Option>
                  <Option value="state5" key="2">
                    终止阶段
                  </Option>
                  <Option value="othersState" key="3">
                    其他阶段
                  </Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="其他阶段">
              {getFieldDecorator('othersState', {
                rules: [{ required: curSelectState === 'othersState', message: '请选择项目阶段!' }],
              })(
                <Select
                  onChange={this.handleOthersStateChange}
                  placeholder="请选择项目阶段..."
                  disabled={curSelectState !== 'othersState'}
                >
                  <Option value="state1" key="0">
                    立项阶段
                  </Option>
                  <Option value="state6" key="1">
                    尽职调查阶段
                  </Option>
                  <Option value="state7" key="2">
                    审批阶段
                  </Option>
                  <Option value="state4" key="3">
                    存续阶段
                  </Option>
                </Select>,
              )}
            </Form.Item>
            <Tabs defaultActiveKey="0">
              {(reportTypeKey == 0 || reportTypeKey == 2) && (
                <TabPane tab="基本信息" key="0">
                  <Card title="项目基本信息" style={{ marginTop: '12px' }}>
                    <Row gutter={[24, 16]}>
                      <Col span={8}>公司ID：{previewInfo.param.apiParam.companyId}</Col>
                      <Col span={8}>项目ID：{previewInfo.param.apiParam.itemId}</Col>
                      <Col span={8}>项目名称：{previewInfo.param.apiParam.itemName}</Col>
                      <Col span={8}>项目类型编号：{previewInfo.param.apiParam.itemType}</Col>
                      <Col span={8}>项目类型名称：{previewInfo.itemTypeName}</Col>
                      <Col span={8}>项目区域：{previewInfo.proAreaName}</Col>
                      {previewInfo.proAreaName === '境外' && (
                        <Col span={8}>区域名称：{previewInfo.param.apiParam.areaName}</Col>
                      )}
                      <Col span={8}>
                        项目阶段：
                        {curSelectState &&
                          {
                            state2: '申报阶段',
                            state3: '发行阶段',
                            state5: '终止阶段',
                            othersState: '其他阶段',
                          }[curSelectState]}
                      </Col>
                      {previewInfo.param.apiParam.stageName && (
                        <Col span={8}>阶段名称：{previewInfo.param.apiParam.stageName}</Col>
                      )}
                      <Col span={8}>交易场所：{previewInfo.tradingPlacesName}</Col>
                      <Col span={8}>项目期次：{previewInfo.param.apiParam.itemPeriod}</Col>
                      <Col span={8}>
                        证券信息：
                        {previewInfo.param.apiParam.securities &&
                          previewInfo.param.apiParam.securities
                            .map(item => item.stkSpName)
                            .join(',')}
                      </Col>
                      {previewInfo.sbDate && <Col span={8}>申报时间：{previewInfo.sbDate}</Col>}
                      {previewInfo.fxDate && <Col span={8}>发行时间：{previewInfo.fxDate}</Col>}
                      {previewInfo.gpDate && <Col span={8}>上市/挂牌时间：{previewInfo.gpDate}</Col>}
                      {previewInfo.zzDate && <Col span={8}>终止时间：{previewInfo.zzDate}</Col>}
                    </Row>
                  </Card>
                  <Card title="项目成员信息" style={{ marginTop: '12px' }}>
                    <Table
                      rowKey={(r, index) => index}
                      columns={columns}
                      dataSource={[
                        ...(previewInfo.param.apiParam.leader || []),
                        ...(previewInfo.param.apiParam.member || []),
                      ]}
                    />
                  </Card>
                </TabPane>
              )}
              {(reportTypeKey == 0 || reportTypeKey == 1 || reportTypeKey == 3) && (
                <TabPane tab="底稿目录" key="1">
                  <SelfTree
                    treeData={reportTypeKey == 0 ? previewInfo.wpDict : previewInfo.pathMap}
                    multipleFlag={false}
                    getCheckMsg={() => null}
                    getClickMsg={() => null}
                  />
                </TabPane>
              )}
            </Tabs>
          </Form>
        </Modal>
      );
    }
  },
);

export default connect(({ manuscriptManagement }) => ({ manuscriptManagement }))(ProjectStateModal);

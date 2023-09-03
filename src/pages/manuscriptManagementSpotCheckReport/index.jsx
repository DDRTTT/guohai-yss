import React, { Component } from 'react';
import { connect } from 'dva';
import { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Button, Col, Input, Row, Form, Card, Layout, message } from 'antd';
import SelfTree from '@/components/SelfTree';

const { Content } = Layout;

@Form.create()
class Agent extends Component {
  state = {
    proCode: this.props.router.location.query.proCode,
    fileCode: [],
  };

  componentDidMount() {
    const { proCode } = this.state;
    const { dispatch } = this.props;
    // 获取全部目录树
    dispatch({
      type: 'manuscriptManagementSpotCheckReport/getSysTreeReq',
      payload: {
        code: proCode,
      },
    });
    // 获取详情基础信息
    dispatch({
      type: 'manuscriptChangeLogDetail/getProjectBaseInfoDetailReq',
      payload: {
        proCode,
      },
    });
  }

  /**
   * 获取左侧树子节点信息
   * * */
  getCheckMsg = (result, msg) => {
    this.state.fileCode = msg.checkedKeys;
  };
  getClickMsg = (result, msg) => {};

  /**
   * 右侧下拉选中时重置左侧树
   * * */
  handleResetTree = ref => {
    this.child = ref;
  };
  handleResetTreeBtn = () => {
    this.child.handleReset();
  };

  /**
   * 抽查报送
   * * */
  handleConfirmSubmitReport() {
    const { proCode, fileCode } = this.state;

    if (!fileCode.length) {
      return message.warn('请选择文档目录~');
    }

    this.props.dispatch({
      type: 'manuscriptManagementSpotCheckReport/submitWpFileUploadWithoutDictReq',
      payload: {
        proCode,
        fileCode: fileCode.toString(),
        batchNumber: Date.now(),
      },
    });
  }

  render() {
    const {
      manuscriptChangeLogDetail: { baseInfo },
      manuscriptManagementSpotCheckReport: { allSysTreeList },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Layout style={{ backgroundColor: '#fff' }}>
          <Content>
            <Card title="项目信息" bordered={false}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={6}>
                  <Form.Item label="*项目编号" {...formItemLayout}>
                    <Input value={baseInfo.proCode || ''} disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="*项目名称" {...formItemLayout}>
                    <Input value={baseInfo.proName || ''} disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="*项目类型" {...formItemLayout}>
                    <Input value={baseInfo.proTypeName || ''} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Content>
          <Layout style={{ backgroundColor: '#fff' }}>
            <Card bordered={false} title="选择抽查报送的目录" style={{ overflow: 'auto' }}>
              <Row type="flex" justify="end" style={{ marginBottom: '20px' }} gutter={12}>
                <Col>
                  <Button onClick={() => this.handleResetTreeBtn()}>重置</Button>
                </Col>
                <Col>
                  <Button onClick={() => this.handleConfirmSubmitReport()}>确定</Button>
                </Col>
              </Row>
              <SelfTree
                defaultExpandAll
                checkableFlag
                treeData={allSysTreeList}
                getCheckMsg={this.getCheckMsg}
                getClickMsg={this.getClickMsg}
                onRef={this.handleResetTree}
              />
            </Card>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(
    Form.create()(
      connect(
        ({
          manuscriptChangeLogDetail,
          manuscriptManagementSpotCheckReport,
          manuscriptManagementReportResult,
          router,
        }) => ({
          manuscriptChangeLogDetail,
          manuscriptManagementSpotCheckReport,
          manuscriptManagementReportResult,
          router,
        }),
      )(Agent),
    ),
  ),
);

export default WrappedSingleForm;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Modal, Row } from 'antd';
import styles from '../Less/dataLicense.less';

@Form.create()
@connect(state => ({
  licenseChecked: state.licenseChecked,
}))
export default class institutionDetailsModal extends PureComponent {
  state = {};

  /**  关闭弹窗  * */
  close = () => {
    this.props.closeAdd();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={this.props.visible}
        title="机构详情"
        onCancel={() => this.close()}
        width={800}
        onOk={() => this.commitApplication()}
        footer={[
          <Button
            style={{ display: this.props.optState == 1 ? 'inline' : 'none' }}
            key="驳回"
            type="danger"
            onClick={() => this.props.licenseOpt(this.props.data, 3)}
          >
            驳回
          </Button>,
          <Button
            style={{ display: this.props.optState == 1 ? 'inline' : 'none' }}
            key="开始授权"
            type="primary"
            onClick={() => this.props.lookDetail(this.props.data)}
          >
            开始授权
          </Button>,
        ]}
      >
        <div className={styles.titleInstritution}>
          <img src="" />
          <p className={styles.orgName}>机构名称</p>
        </div>
        <Row className={styles.rowStyle} gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>机构代码: </span>
              <span title={this.props.data.appOrgCode} className={styles.Coltext}>
                {this.props.data.appOrgCode}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>创建时间: </span>
              <span title={this.props.data.appDate} className={styles.Coltext}>
                {this.props.data.appDate}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>机构类型: </span>
              <span title={this.props.data.appOrgTypeName} className={styles.Coltext}>
                {this.props.data.appOrgTypeName}
              </span>
            </h3>
          </Col>
        </Row>
        <h3 className={styles.infoTile}>申请人信息</h3>
        <Row className={styles.rowStyle} gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>用户名: </span>
              <span title={this.props.data.appName} className={styles.Coltext}>
                {this.props.data.appName}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>手机号码: </span>
              <span title={this.props.data.appPhone} className={styles.Coltext}>
                {this.props.data.appPhone}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>用户代码: </span>
              <span title={this.props.data.appUserCode} className={styles.Coltext}>
                {this.props.data.appUserCode}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>电子邮箱: </span>
              <span title={this.props.data.appEmail} className={styles.Coltext}>
                {this.props.data.appEmail}
              </span>
            </h3>
          </Col>
          <Col md={12} sm={24}>
            <h3>
              <span className={styles.modalTextTitle}>用户类型: </span>
              <span
                title={this.props.data.appUserType == '01' ? '管理员' : '业务操作员'}
                className={styles.Coltext}
              >
                {this.props.data.appUserType == '01' ? '管理员' : '业务操作员'}
              </span>
            </h3>
          </Col>
        </Row>
      </Modal>
    );
  }
}

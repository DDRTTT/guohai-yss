// 外部机构新增页面
import React, { Component } from 'react';
import { Card, Steps, Row, Col, Form, Upload, Button, Icon, Input } from 'antd';
import { PageContainers } from '@/components';
import PublicInfor from './component/publicInfor';
import OrgStructure from './component/orgStructure';
import ContactInfo from './component/contactInfo';
import { getUrlParams, handleValidator } from '@/utils/utils';
import styles from './index.less';
const { Step } = Steps;

class addExternalOrg extends Component {
  state = {
    current: 0,
    imgTitle: '',
    imageUrl: '',
    orgid: '',
    stepFlag: true,
    stepFlag2: true,
  };
  // 必填信息校验
  onChange = current => {
    if ((current == 1 || current == 2) && this.state.stepFlag) {
      this.publicInfor.preservation(current);
    } else {
      this.changeStep(current);
    }
  };
  //改变步骤
  changeStep = (current, orgid) => {
    if (orgid) {
      this.setState({ orgid, stepFlag: false });
    }
    this.setState({ current });
  };
  componentDidMount() { }

  render() {
    const { current, imgTitle, imageUrl, orgid } = this.state;
    return (
      <div className={styles.addExternalOrg}>
        <PageContainers
          breadcrumb={[
            {
              title: '产品数据管理',
              url: '',
            },
            {
              title: '机构信息管理',
              url: '/productDataManage/orgInfoManagement/index',
            },
            {
              title: '新增机构',
              url: '',
            },
          ]}
        />
        <Card>
          <Steps className={styles.step} current={current} onChange={this.onChange}>
            <Step title="公共信息" />
            <Step title="组织架构" />
            <Step title="联系人信息" />
          </Steps>
          <div className="steps-action">
            <div
              style={{
                overflow: 'auto',
                height: 'calc(100vh - 280px)',
                overflowX: 'hidden',
                overflowY: 'auto',
                display: current == 0 ? 'block' : 'none',
              }}
            >
              <PublicInfor
                falg={false}
                org={this.props.location.query.type}
                changeStep={this.changeStep}
                onRef={c => (this.publicInfor = c)}
              />
            </div>
            {current === 1 && (
              <div type="primary">
                <OrgStructure details={true} orgid={orgid} falg={true} />
              </div>
            )}
            {current === 2 && (
              <div>
                <ContactInfo orgid={orgid} falg={true} />
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }
}

export default addExternalOrg;

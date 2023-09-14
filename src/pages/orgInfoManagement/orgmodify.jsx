//本家机构和其他机构的修改、查看页面
import React, { Component } from 'react';
import { PageContainers } from '@/components';
import { connect } from 'dva';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Card, Tabs, Row, Col, Form, Button } from 'antd';
import EmployeeManage from './component/employeeManage';
import { routerRedux } from 'dva/router';
import PublicInfor from './component/publicInfor';
import ContactInfo from './component/contactInfo';
import OrgStructure from './component/orgStructure';
import OrgDetails from './component/orgDetails';
import styles from './index.less';
const { TabPane } = Tabs;
class orgmodify extends Component {
  state = {
    breadcrumb: '修改',
    defaultActiveKey: '1',
    orgName: '',
    falg: true,
    loading: false,
  };
  /**
   * tab切换
   * @method callback
   */
  callback = key => {
    // this.props.form.resetFields();
    this.setState({ defaultActiveKey: key }, () => {
      //   if (key === '2') {
      //     this.getStafList();
      //     // this.getDepartment();
      //   } else if (key === '3') {
      //     this.getContacts();
      //   }
    });
  };
  componentDidMount() {
    const { location } = this.props;
    if (location.query.name === '本家机构') {
      this.setState({
        orgName: 'own',
      });
    } else if (location.query.name === '其他机构') {
      this.setState({
        orgName: 'other',
      });
    }
    if (location.query.type === 'detail') {
      this.setState({
        falg: false,
        breadcrumb: '查看',
      });
    }
  }
  // 基本信息保存
  preservation = () => {
    this.publicInfor.preservation();
  };
  loading = () => {
    this.setState({
      loading: true
    })
  }
  //取消
  cancel = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/productDataManage/orgInfoManagement/index',
      }),
    );
  };
  render() {
    const { breadcrumb, defaultActiveKey, orgName, falg } = this.state;
    const { location } = this.props;
    return (
      <div className={styles.orgmodify}>
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
              title: breadcrumb,
              url: '',
            },
          ]}
          footer={
            <Tabs
              defaultActiveKey={this.state.defaultActiveKey}
              onChange={this.callback}
            // animated={false}
            >
              <TabPane tab="公共信息" key="1" />
              <TabPane tab="组织架构" key="0" />
              {location.query.name == '本家机构' && <TabPane tab="员工信息" key="2" />}
              {location.query.name == '其他机构' && <TabPane tab="联系人信息" key="3" />}
            </Tabs>
          }
        >
          <div>
            {defaultActiveKey == '0' && (
              <Card>
                <OrgStructure
                  details={location.query.type ? false : true}
                  org={orgName}
                  orgid={location.query.id}
                  orgName={location.query.orgName}
                />
              </Card>
            )}
            {defaultActiveKey == '1' && (
              <>
                {location.query.type ? (
                  <OrgDetails org={orgName} location={location} />
                ) : (
                  <Card>
                    <Row className={styles.prtion} justify="end">
                      <div className={styles.card1}>
                        <Button loading={this.state.loading} type="primary" onClick={this.preservation}>
                          保存
                        </Button>
                        <Button className={styles.cancel} onClick={this.cancel}>
                          取消
                        </Button>
                      </div>
                    </Row>
                    <div className={styles.divbox}>
                      <PublicInfor loading={this.loading} org={orgName} onRef={c => (this.publicInfor = c)} />
                    </div>
                  </Card>
                )}

                {/* <Button onClick={this.fn}>1111</Button> */}
              </>
            )}
            {defaultActiveKey == '2' && (
              <Card>
                <EmployeeManage
                  orgid={location.query.id}
                  orgName={location.query.orgName}
                  falg={falg}
                />
              </Card>
            )}
            {defaultActiveKey == '3' && (
              <Card>
                <ContactInfo orgid={location.query.id} falg={falg} />
              </Card>
            )}
          </div>
        </PageContainers>
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ orgInfoManagement }) => ({
      orgInfoManagement,
    }))(orgmodify),
  ),
);

export default WrappedAdvancedSearchForm;

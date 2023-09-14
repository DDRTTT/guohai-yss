import React from 'react';
import { connect } from 'dva';
import { nsHoc } from '@/utils/hocUtil';
import { Button, Card, Col, Form, Pagination, Row, Select, Tooltip, TreeSelect } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import tgrBlue from '@/assets/dataLicense/tgrBlue.png';
import tgrGray from '@/assets/dataLicense/tgrGray.png';
import tgrRed from '@/assets/dataLicense/tgrRed.png';
import tgrGreen from '@/assets/dataLicense/tgrGreen.png';
import wbrRed from '@/assets/dataLicense/wbrRed.png';
import wbrGreen from '@/assets/dataLicense/wbrGreen.png';
import wbrBlue from '@/assets/dataLicense/wbrBlue.png';
import wbrGray from '@/assets/dataLicense/wbrGray.png';
import glrGray from '@/assets/dataLicense/glrGray.png';
import glrBlue from '@/assets/dataLicense/glrBlue.png';
import glrGreen from '@/assets/dataLicense/glrGreen.png';
import glrRed from '@/assets/dataLicense/glrRed.png';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import ApplicationAuth from '../modal/ApplicationAuth';
import styles from '../Less/dataLicense.less';

const FormItem = Form.Item;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

@errorBoundary
@nsHoc({ namespace: 'userLicense' })
@Form.create()
@connect(state => ({
  userLicense: state.userLicense,
  systeam: state.systeam,
}))
export default class userLicense extends BaseCrudComponent {
  state = {
    applicateAuthorization: false,
    currentPage: 1,
    pageSize: 6,
    tabNum: -1,
  };

  onTabChange = key => {
    const { dispatch } = this.props;
    this.setState({
      tabNum: key,
    });
    if (key != -1) {
      dispatch({
        type: 'userLicense/fetch',
        payload: {
          appedState: key,
          currentPage: 1,
          pageSize: 6,
        },
      });
    } else {
      dispatch({
        type: 'userLicense/fetch',
        payload: {
          currentPage: 1,
          pageSize: 6,
          appedState: '',
        },
      });
    }
  };

  renderCard = data => {
    if (data) {
      return data.map(info => {
        return (
          <Col xxl={8} lg={12}>
            <Card className={styles.licenseBlock_single} bordered={false}>
              <div className={styles.licenseBlock_single__info}>
                <Row gutter={24}>
                  <Col span={12}>
                    <img className={styles.imgStyles} src={info.appedOrgLogo} />
                  </Col>
                  <Col span={12}>{this.renderRolesLogo(info.typeState)}</Col>
                </Row>
                <div className={styles.licenseBlock_single__info__pBlock}>
                  <p className={styles.licenseBlock_single__info__p}>
                    机构管理员：{info.appOrgManager}
                  </p>
                  <p className={styles.licenseBlock_single__info__p}>
                    服务热线：{info.appedOrgPhone}
                  </p>
                </div>
                <Row gutter={24}>
                  <ul className={styles.licenseBlock_single__info__des}>
                    <li className={styles.licenseBlock_single__info__des_p}>{info.appedOrgDesc}</li>
                    <li className={styles.licenseBlock_single__info__des_p}>
                      平台开放角色有：{this.renderRoles(info.typeState)}
                    </li>
                  </ul>
                </Row>
              </div>
              <div className={styles.licenseBlock_single__btn}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={16} sm={24} />
                  <Col md={8} sm={24}>
                    <Button
                      onClick={this.applicationAuthorization.bind(this, info)}
                      className={styles.btnStyleLong}
                      disabled={info.appedState == 1 || info.appedState == 2}
                      type="primary"
                    >
                      申请授权
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        );
      });
    }
  };

  // 平台开放角色
  renderRoles = typeData => {
    let returnData = '';
    typeData.map(data => {
      if (data.appedOrgType == 'WB') {
        returnData += '【外包人】';
      } else if (data.appedOrgType == 'TG') {
        returnData += '【托管人】';
      } else if (data.appedOrgType == 'GL') {
        returnData += '【管理人】';
      }
    });
    return returnData;
  };

  // 平台开放角色
  renderRolesLogo = (typeData, state) => {
    return typeData.map(data => {
      if (data.appedState == '0') {
        if (data.appedOrgType == 'WB') {
          return (
            <Tooltip title="未审核外包人角色">
              <img className={styles.marginImg} src={wbrGray} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'TG') {
          return (
            <Tooltip title="未审核托管人角色">
              <img className={styles.marginImg} src={tgrGray} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'GL') {
          return (
            <Tooltip title="未审核管理人角色">
              <img className={styles.marginImg} src={glrGray} />
            </Tooltip>
          );
        }
      } else if (data.appedState == '1') {
        if (data.appedOrgType == 'WB') {
          return (
            <Tooltip title="正在审核外包人角色">
              <img className={styles.marginImg} src={wbrBlue} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'TG') {
          return (
            <Tooltip title="正在审核托管人角色">
              <img className={styles.marginImg} src={tgrBlue} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'GL') {
          return (
            <Tooltip title="正在审核管理人角色">
              <img className={styles.marginImg} src={glrBlue} />
            </Tooltip>
          );
        }
      } else if (data.appedState == '2') {
        if (data.appedOrgType == 'WB') {
          return (
            <Tooltip title="已审核外包人角色">
              <img className={styles.marginImg} src={wbrGreen} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'TG') {
          return (
            <Tooltip title="已审核托管人角色">
              <img className={styles.marginImg} src={tgrGreen} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'GL') {
          return (
            <Tooltip title="已审核管理人角色">
              <img className={styles.marginImg} src={glrGreen} />
            </Tooltip>
          );
        }
      } else if (data.appedState == '3') {
        if (data.appedOrgType == 'WB') {
          return (
            <Tooltip title="已驳回外包人角色">
              <img className={styles.marginImg} src={wbrRed} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'TG') {
          return (
            <Tooltip title="已驳回托管人角色">
              <img className={styles.marginImg} src={tgrRed} />
            </Tooltip>
          );
        }
        if (data.appedOrgType == 'GL') {
          return (
            <Tooltip title="已驳回管理人角色">
              <img className={styles.marginImg} src={glrRed} />
            </Tooltip>
          );
        }
      }
    });
  };

  // 提交申请
  applicationAuthorization = (i, info) => {
    const { dispatch } = this.props;
    this.setState({
      applicateAuthorization: true,
    });
    dispatch({
      type: 'userLicense/fetchUserInfo',
      payload: i,
    });
  };

  // 关闭申请弹窗
  closeApplication = () => {
    const { form } = this.props;
    this.setState({
      applicateAuthorization: false,
    });
    form.resetFields();
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'userLicense/fetch',
      payload: {
        appedState: '',
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
      },
    });
  }

  // 分页切换
  pageChange = (current, pageSize) => {
    const { dispatch } = this.props;
    this.setState({
      currentPage: current,
      pageSize,
    });
    if (this.state.tabNum != -1) {
      dispatch({
        type: 'userLicense/fetch',
        payload: {
          appedState: this.state.tabNum,
          currentPage: current,
          pageSize,
        },
      });
    } else {
      dispatch({
        type: 'userLicense/fetch',
        payload: {
          currentPage: current,
          pageSize,
          appedState: '',
        },
      });
    }
  };

  render() {
    const {
      userLicense: { data, userInfo },
      dispatch,
    } = this.props;
    const tabType = [
      {
        key: -1,
        tab: '全部',
      },
      {
        key: 1,
        tab: '授权中',
      },
      {
        key: 2,
        tab: '已授权',
      },
      {
        key: 3,
        tab: '已驳回',
      },
    ];
    return (
      <div>
        <Card
          bordered={false}
          tabList={tabType}
          onTabChange={key => {
            this.onTabChange(key, 'key');
          }}
          style={{ minHeight: 50 }}
          // extra={this.action()}
        />
        <div className={styles.licenseBlock}>
          <Row gutter={24}>{this.renderCard(data.data.rows)}</Row>
        </div>
        <ApplicationAuth
          visible={this.state.applicateAuthorization}
          data={userInfo}
          dispatch={dispatch}
          closeAdd={this.closeApplication}
          destroyOnClose
        />
        <div className={styles.page}>
          <Pagination
            showQuickJumper
            current={this.state.currentPage}
            total={data.data.total}
            showTotal={total => `共 ${total} 条数据`}
            onChange={this.pageChange}
            defaultPageSize={6}
            // showQuickJumper
          />
        </div>
      </div>
    );
  }
}

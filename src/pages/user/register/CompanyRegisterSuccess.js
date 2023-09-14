import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Icon, Form, Button, Row, Col } from 'antd';
import styles from './index.less';

//本页面中插入的所有图片
import blue_dotted from '@/assets/blue_dotted.png';
import gray_dotted from '@/assets/gray_dotted.png';

//个人用户注册成功页面Personal registration success
class CompanySuccess extends React.Component {
  //控制注册页面的显示和隐藏

  login = () => {
    this.props.dispatch({
      type: 'register/upcompanySuccess',
      payload: 'none',
    });
  };

  render() {
    const callbackChild3 = this.props.callbackChild3;

    return (
      <div className={styles.CompanySuccess} style={{ display: callbackChild3 }}>
        <div className={styles.Step_bar}>
          <Row>
            <Col span={8} className={styles.Step_blue}>
              <p>1</p>
              <h4>经办人信息验证</h4>
            </Col>
            <Col span={8} className={styles.Step_blue}>
              <p>2</p>
              <h4>填写企业信息</h4>
              <div className={styles.gray_line}>
                <img alt="进行到的步骤" src={blue_dotted} />
              </div>
            </Col>
            <Col span={8} className={styles.Step_blue}>
              <p>3</p>
              <h4>注册完成</h4>
              <div className={styles.gray_line}>
                <img alt="进行到的步骤" src={blue_dotted} />
              </div>
            </Col>
          </Row>
        </div>
        <h3>
          <Icon type="check-circle" className={styles.success_icon} />
          恭喜您完成注册信息填写！
        </h3>
        <p>我们将在24小时之内，对您的信息进行审核并进行短信通知~</p>
        <div className={styles.input_box_submit}>
          <Button type="primary" onClick={() => this.login()}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }
}
const WrappedCompanySuccess = Form.create()(CompanySuccess);

export default WrappedCompanySuccess;

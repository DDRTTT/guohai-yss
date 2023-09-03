/**
 *Create on 2020/7/22.
 */

// 引入头像截取插件
// 引入头像截取插件
// import AvatarEditor from 'react-avatar-editor';
import React from 'react';
import ImgCrop from 'antd-img-crop';
import { connect } from 'dva';
import { nsHoc } from '@/utils/hocUtil';
import { Button, Col, Form, message, Radio, Row, Input, Upload } from 'antd';
import BaseCrudComponent from '@/components/BaseCrudComponent';
import indexPhoto from '@/assets/presonalDatum/indexPhoto.png';
import editImg from '@/assets/presonalDatum/down.png';
import packUp from '@/assets/presonalDatum/up.png';
import { getAuthToken } from '@/utils/session';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { handleValidator } from '@/utils/utils';
import styles from './index.less';
// 个人资料
import Person from './son/Person';
// 企业资料
import Company from './son/Company';
// 修改密码
import Password from './son/Password';
// 手机三部曲
import Phoneone from './phone/Phoneone';
import Phonetwo from './phone/Phonetwo';
import Phonethree from './phone/Phonethree';
// 邮箱三部曲
import Emailone from './email/Emailone';
import Emailtwo from './email/Emailtwo';
import Emailthree from './email/Emailthree';
// 头像图片
// 缩略图
// 裁剪
// 展开
// 上传

const Token = getAuthToken();

@errorBoundary
@nsHoc({ namespace: 'personalDatum' })
@Form.create()
@connect(state => ({
  personalDatum: state.personalDatum,
}))
export default class proFile extends BaseCrudComponent {
  state = {
    Token: getAuthToken(),
    status: 1,
    // 控制显示隐藏数组
    a1: false,
    a2: false,
    a3: false,
    a4: false,
    a5: false,
    a6: false,

    // 新更换的手机号
    newMobile: '',
    // 新更换的邮箱
    newEmailNum: '',

    emailStep: 0,
    emailCancel: true,
    phoneStep: 0,
    phoneCancel: true,

    headImg: false,

    // 修改头像是否显示 0 不显示 1 显示
    reviseShow: 0,

    // 裁剪照片
    newfile: null,

    // 显示照片
    fileShow: indexPhoto,

    // 默认头像裁剪比例
    scale: 1,

    // 0还没上传 1上传成功 2上传失败
    success: 0,

    // 0 还没裁剪 1 已经裁剪
    isCutting: 0,

    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const basic = {};

    // 查询个人信息
    dispatch({
      type: 'personalDatum/getPersonInfo',
    });

    // 获取名人名言
    dispatch({
      type: 'personalDatum/getSaying',
    });
  }

  // 获取个人资料
  getPerson = () => {
    const { dispatch } = this.props;
    // 查询个人信息
    dispatch({
      type: 'personalDatum/getPersonInfo',
    });
    // dispatch({
    //   type: 'user/fetchCurrent',
    // });
  };

  // 点击下一步或取消
  changeF = (n, a) => {
    if (a == 'e') {
      this.setState({
        emailStep: n,
      });
    } else {
      this.setState({
        phoneStep: n,
      });
    }
  };

  // 控制显示隐藏
  editClick = (b, n) => {
    if (n === 'a1') {
      b ? this.setState({ a1: false }) : this.setState({ a1: true });
    }
    if (n === 'a2') {
      b ? this.setState({ a2: false }) : this.setState({ a2: true });
    }
    if (n === 'a3') {
      b ? this.setState({ a3: false }) : this.setState({ a3: true });
    }
    if (n === 'a4') {
      b ? this.setState({ a4: false }) : this.setState({ a4: true });
    }
    if (n === 'a5') {
      b ? this.setState({ a5: false }) : this.setState({ a5: true });
    }
    if (n === 'a6') {
      b ? this.setState({ a6: false }) : this.setState({ a6: true });
    }
  };

  /*
   * 根据base64 内容 取得 bolb
   * @param dataURI
   * @returns Blob
   */
  getBlobBydataURI = (dataURI, type) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  };

  // 点击按钮修改头像
  revisePhoto = () => {
    // 显示
    if (this.state.reviseShow === 0) {
      this.setState({
        reviseShow: 1,
      });
      // 隐藏
    } else if (this.state.reviseShow === 1) {
      this.setState({
        reviseShow: 0,
      });
    }
  };

  onChange = info => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      new Promise(resolve => {
        setTimeout(() => {
          this.getPerson();
        }, 1000);
      });

      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  // 绑定邮箱
  bindEmail = _ => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields(['newEmailCode'], (err, value) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/clickBindEmailFun',
          payload: {
            newemail: value.newEmailCode,
          },
        }).then(res => {
          if (res.status === 200) {
            this.setState({
              emailStep: 0,
            });
          }
        });
      }
    });
  };

  // 绑定手机
  bindPhoneFun = _ => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields(['newmobile'], (err, value) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/clickBindPhoneFun',
          payload: {
            newmobile: value.newmobile,
          },
        }).then(res => {
          if (res.status === 200) {
            this.setState({
              phoneStep: 0,
            });
          }
        });
      }
    });
  };

  companySubmit = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields(['legalPerson', 'offAddr', 'offTel'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/saveCompanyFun',
          payload: values,
        }).then(res => {
          if (res.status === 200) {
            // this.setState({ a3: false });
          }
        });
      }
    });
  };

  personSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields(['city', 'sex', 'profession'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'personalDatum/saveDatum',
          payload: values,
        }).then(res => {
          if (res.status === 200) {
            // this.setState({ a1: false });
          }
        });
      }
    });
  };

  handleCityValidator = (rule, value, callback) => {
    handleValidator(value, callback, 40, '所在城市长度过长');
  };

  handleJobValidator = (rule, value, callback) => {
    handleValidator(value, callback, 40, '从事职业长度过长');
  };

  handleLegalPersonValidator = (rule, value, callback) => {
    handleValidator(value, callback, 40, '法人代表长度过长');
  };

  handleOffAddrValidator = (rule, value, callback) => {
    handleValidator(value, callback, 40, '公司地址长度过长');
  };

  render() {
    const {
      personalDatum: { data, say, emailCodeArr, phoneCodeArr },
      dispatch,
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    // 绑定新手机号
    const setValues = value => {
      this.setState({ newMobile: value });
    };

    // 绑定新手机号
    const setEmail = value => {
      this.setState({ newEmailNum: value });
    };

    // 控制显示隐藏变量
    const show = {
      display: '',
    };
    const hide = {
      display: 'none',
    };

    // 表单
    const FormItem = Form.Item;
    // 单选
    const RadioGroup = Radio.Group;

    // 上传头像
    const personalImg = (
      <Row
        gutter={{
          md: 24,
          lg: 24,
          xl: 48,
        }}
      >
        <Col md={12} sm={24}>
          <div
            className={styles.iconUser}
            style={{
              width: 10,
              height: 10,
            }}
          >
            <img src={data?.data[0]?.photoUrl} alt={'头像'} />
          </div>
          <Button
            type="primary"
            onClick={() => this.revisePhoto()}
            style={{
              marginLeft: 100,
              marginTop: 10,
            }}
          >
            {this.state.reviseShow === 0 ? '修改' : '收起'}
          </Button>
        </Col>
        {/* <a style={{ position: 'absolute', top: 5, left: 200, color: '#333', fontSize: 12 }}>请上传jpg,png格式的图片.</a> */}
        <Col md={12} sm={24} style={this.state.reviseShow === 0 ? hide : show}>
          <ImgCrop rotate shape="round">
            <Upload
              action="/ams/yss-base-admin/userdetail/ftpUploadImg"
              listType="picture-card"
              fileList={this.state.fileList}
              onChange={this.onChange}
              headers={{
                token: this.state.Token,
              }}
            >
              {this.state.fileList.length !== 1 && '上传头像'}
            </Upload>
          </ImgCrop>
        </Col>
      </Row>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 10,
        },
        sm: {
          span: 24,
          offset: 24,
        },
      },
    };
    return (
      <div
        style={{
          marginTop: -24,
          marginBottom: 0,
          marginLeft: -24,
          marginRight: -24,
        }}
      >
        {/* 头像+蓝色背景 */}
        <div className={styles.presonTop}>
          <img src={data?.data[0]?.photoUrl} alt={'头像'} />
          <div
            style={{
              float: 'left',
              width: 'calc(100% - 120px)',
            }}
          >
            <p className={styles.topWord}>
              嗨~{data?.data?.length === 0 ? '' : data?.data[0]?.username}
              {/* {say?.data?.length === 0 ? '--' : say?.data[0]?.sentence} */}
            </p>
            <p className={styles.bottomWord}>注册于 {data?.data[0]?.createTime}</p>
          </div>
        </div>

        {/* 编辑 */}
        <div className={styles.presonBottom}>
          <p className={styles.pbTitle}>账号设置</p>
          <div className={styles.pbBlock}>
            {/* 个人资料 */}
            <div className={styles.pbShowText}>
              {/* onClick={() => this.newslistclick("01", editImg, packUp)} */}
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a1, 'a1')}>
                <div className={styles.pbTitleTwo}>个人资料</div>
                <div className={styles.pbEditText} id="thum1" style={this.state.a1 ? hide : show}>
                  {data?.data[0]?.username}
                </div>
                <div className={styles.pbEdit}>
                  <span id="text1">{this.state.a1 ? '收起' : '编辑'}</span>
                  <img id="img1" src={this.state.a1 ? editImg : packUp} alt={'头像'} />
                </div>
              </div>
              {/* 编辑状态 */}
              <div className={styles.pbEditBlock} id="edit1" style={this.state.a1 ? show : hide}>
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>登录名：</p>
                  <p className={styles.leftText}>{data?.data[0]?.usercode}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>姓名：</p>
                  <p className={styles.leftText}>{data?.data[0]?.username}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>身份证号：</p>
                  {/* 暂无 */}
                  <p className={styles.leftText}>
                    {data?.data[0]?.userNum ? data?.data[0]?.userNum : '暂无'}
                  </p>
                </div>

                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Form {...formItemLayout} className="form">
                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                      <Col sm={24}>
                        <FormItem label="所在城市" className={styles.form}>
                          {getFieldDecorator('city', {
                            initialValue: data?.data[0]?.city,
                            rules: [{ validator: this.handleCityValidator }],
                          })(
                            <Input
                              placeholder="请输入所在城市"
                              style={{ width: '328px' }}
                              className={styles.formInput}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <FormItem label="性别" className={styles.form}>
                          {getFieldDecorator('sex', {
                            initialValue: data?.data[0]?.sex,
                          })(
                            <RadioGroup onChange={this.onChangeRadio} className={styles.leftText}>
                              <Radio value={0}>男</Radio>
                              <Radio value={1}>女</Radio>
                              <Radio value={2}>保密</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <FormItem label="从事职业" className={styles.form}>
                          {getFieldDecorator('profession', {
                            initialValue: data?.data[0]?.profession,
                            rules: [{ validator: this.handleJobValidator }],
                          })(
                            <Input
                              placeholder="请输入从事职业"
                              style={{ width: '328px' }}
                              className={styles.formInput}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <Form.Item {...tailFormItemLayout}>
                          <Button type="primary" onClick={this.personSubmit}>
                            绑定
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
              <br style={{ clear: 'both' }} />
            </div>

            {/* 上传头像 */}
            <div className={styles.pbShowText}>
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a2, 'a2')}>
                <div className={styles.pbTitleTwo}>头像</div>

                <div className={styles.pbEditText} id="thum2" style={this.state.a2 ? hide : show}>
                  <img src={data?.data[0]?.photoUrl} alt={'头像'} />
                </div>

                <div className={styles.pbEdit}>
                  <span id="text2">{this.state.a2 ? '收起' : '编辑'}</span>
                  <img src={this.state.a2 ? editImg : packUp} id="img2" alt={''} />
                </div>
              </div>
              {/* 编辑状态 */}

              <div className={styles.pbEditBlock} id="edit2" style={this.state.a2 ? show : hide}>
                {/* 上传头像 */}
                <div className={styles.nonForm} style={{ marginLeft: 119 }}>
                  {personalImg}
                </div>
              </div>
              <br style={{ clear: 'both' }} />
            </div>

            {/* 企业资料 */}
            <div className={styles.pbShowText}>
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a3, 'a3')}>
                <div className={styles.pbTitleTwo}>企业资料</div>
                <div className={styles.pbEditText} id="thum3" style={this.state.a3 ? hide : show}>
                  {data?.data[0]?.orgName}
                </div>
                <div className={styles.pbEdit}>
                  <span id="text3">{this.state.a3 ? '收起' : '编辑'}</span>
                  <img src={this.state.a3 ? editImg : packUp} id="img3" alt={''} />
                </div>
              </div>
              {/* 编辑状态 */}
              <div className={styles.pbEditBlock} id="edit3" style={this.state.a3 ? show : hide}>
                {/* 企业资料 */}
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>企业全称：</p>
                  <p className={styles.leftText}>{data?.data[0]?.orgName}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>机构代码：</p>
                  <p className={styles.leftText}>{data?.data[0]?.orgCode}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>机构类型：</p>
                  <p className={styles.leftText}>{data?.data[0]?.orgTypeName}</p>
                </div>

                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Form className="form" {...formItemLayout}>
                    <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                      <Col md={24} sm={24}>
                        <FormItem label="法人代表" className={styles.form}>
                          {getFieldDecorator('legalPerson', {
                            initialValue: data?.data[0]?.legalPerson,
                            rules: [
                              { required: true, message: '请输入法人代表' },
                              { validator: this.handleLegalPersonValidator },
                            ],
                          })(
                            <Input
                              placeholder="请输入法人代表"
                              style={{ width: '328px' }}
                              className={styles.formInput}
                              maxLength={50}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24}>
                        <FormItem label="公司地址" className={styles.form}>
                          {getFieldDecorator('offAddr', {
                            initialValue: data?.data[0]?.offAddr,
                            rules: [{ validator: this.handleOffAddrValidator }],
                          })(
                            <Input
                              placeholder="请输入公司地址"
                              style={{ width: '328px' }}
                              className={styles.formInput}
                              maxLength={50}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24} className={styles.comHeight}>
                        <FormItem label="公司固话" help="公司固话格式为：区号-固话">
                          {getFieldDecorator('offTel', {
                            initialValue: data?.data[0]?.offTel,
                            rules: [
                              {
                                pattern: new RegExp(/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/),
                                message: '请输入正确手机号码',
                              },
                            ],
                          })(
                            <Input
                              placeholder="请输入公司固话"
                              style={{ width: '328px' }}
                              className={styles.formInput}
                              maxLength={13}
                            />,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={24} sm={24} style={{ marginTop: 10 }}>
                        <Form.Item {...tailFormItemLayout}>
                          <Button type="primary" onClick={this.companySubmit}>
                            绑定
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
              <br style={{ clear: 'both' }} />
            </div>

            {/* 绑定邮箱 */}
            <div className={styles.pbShowText}>
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a4, 'a4')}>
                <div className={styles.pbTitleTwo}>绑定邮箱</div>
                {/* isEmailNull */}
                <div className={styles.pbEditText} id="thum4" style={this.state.a4 ? hide : show}>
                  {data?.data[0]?.email == '' || data?.data[0]?.email == null
                    ? '暂无'
                    : data?.data[0]?.email}
                </div>
                <div className={styles.pbEdit} onClick={() => this.editClick(this.state.a4, 'a4')}>
                  <span id="text4">{this.state.a4 ? '收起' : '编辑'}</span>
                  <img src={this.state.a4 ? editImg : packUp} id="img4" />
                </div>
              </div>
              {/* 编辑状态 */}
              <div
                className={styles.pbEditBlock}
                id="edit4"
                style={this.state.a4 ? (this.state.emailStep == 0 ? show : hide) : hide}
              >
                {/* 邮箱地址 */}
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>邮箱地址：</p>
                  <p className={styles.leftText}>{data?.data[0]?.email}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText} />
                  <p className={styles.leftText}>
                    <Button type="primary" onClick={() => this.changeF(1, 'e')}>
                      更改邮箱
                    </Button>
                  </p>
                </div>
              </div>

              {/* 第一步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a4 ? (this.state.emailStep == 1 ? show : hide) : hide}
              >
                <Form {...formItemLayout}>
                  <Row>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <Form className="form">
                        <Form.Item label="旧企业邮箱">
                          {
                            <Input
                              disabled
                              value={data?.data[0]?.email}
                              style={{ width: '328px' }}
                            />
                          }
                        </Form.Item>
                      </Form>
                    </Col>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <Form.Item label="新邮箱地址">
                        {getFieldDecorator('newEmailCode', {
                          rules: [
                            {
                              type: 'email',
                              message: '请输入正确的邮箱',
                            },
                          ],
                        })(<Input placeholder="请输入新的邮箱地址" style={{ width: '328px' }} />)}
                      </Form.Item>
                    </Col>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" onClick={this.bindEmail}>
                          绑定
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>

              {/* 第二步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a4 ? (this.state.emailStep == 2 ? show : hide) : hide}
              >
                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Emailtwo
                    dispatch={dispatch}
                    changeF={this.changeF}
                    data={data}
                    setEmail={setEmail}
                    cancel={this.state.emailCancel}
                  />
                </div>
              </div>

              {/* 第三步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a4 ? (this.state.emailStep == 3 ? show : hide) : hide}
              >
                {/* 邮箱地址 */}
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>新邮箱地址:</p>
                  <p className={styles.leftText}>{this.state.newEmailNum}</p>
                  {/* <p className={styles.leftTextLine}>验证邮件已发出 <a onClick={() => this.checkAccept()}>再发一次</a> </p> */}
                </div>
                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Emailthree
                    dispatch={dispatch}
                    changeF={this.changeF}
                    data={data}
                    emailCodeArr={emailCodeArr}
                    newEmail={this.state.newEmailNum}
                  />
                </div>
              </div>

              <br style={{ clear: 'both' }} />
            </div>

            {/* 绑定手机 */}
            <div className={styles.pbShowText}>
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a5, 'a5')}>
                <div className={styles.pbTitleTwo}>绑定手机</div>
                <div className={styles.pbEditText} style={this.state.a5 ? hide : show}>
                  {data?.data[0]?.mobile == '' || data?.data[0]?.mobile == null
                    ? '暂无'
                    : data?.data[0]?.mobile}
                </div>
                <div className={styles.pbEdit} onClick={() => this.editClick(this.state.a5, 'a5')}>
                  <span>{this.state.a5 ? '收起' : '编辑'}</span>
                  <img src={this.state.a5 ? editImg : packUp} />
                </div>
              </div>
              {/* 编辑状态 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a5 ? (this.state.phoneStep == 0 ? show : hide) : hide}
              >
                {/* 邮箱地址 */}
                <div className={styles.nonForm}>
                  <p className={styles.rightText}>手机号码：</p>
                  <p className={styles.leftText}>{data?.data[0]?.mobile}</p>
                </div>
                <div className={styles.nonForm}>
                  <p className={styles.rightText} />
                  <p className={styles.leftText}>
                    <Button type="primary" onClick={() => this.changeF(1, 'p')}>
                      更换号码
                    </Button>
                  </p>
                </div>
              </div>

              {/* 第一步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a5 ? (this.state.phoneStep == 1 ? show : hide) : hide}
              >
                <Form {...formItemLayout}>
                  <Row>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <Form className="form">
                        <Form.Item label="手机号码">
                          {
                            <Input
                              disabled
                              value={data?.data[0]?.mobile}
                              style={{ width: '328px' }}
                            />
                          }
                        </Form.Item>
                      </Form>
                    </Col>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <FormItem label="新手机号码">
                        {getFieldDecorator('newmobile', {
                          rules: [
                            {
                              pattern: new RegExp(/^((\+861|1)[0-9])\d{9}$/),
                              message: '请输入正确手机号码',
                            },
                          ],
                        })(<Input style={{ width: '328px' }} placeholder="请输入" />)}
                      </FormItem>
                    </Col>
                    <Col md={24} sm={24} style={{ marginTop: 10 }}>
                      <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" onClick={this.bindPhoneFun}>
                          绑定
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>

              {/* 第二步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a5 ? (this.state.phoneStep == 2 ? show : hide) : hide}
              >
                {/* 表单 */}
                <div className={styles.nonForm} style={{ marginBottom: 10 }}>
                  <Phonetwo
                    dispatch={dispatch}
                    changeF={this.changeF}
                    data={data}
                    setValues={setValues}
                    cancel={this.state.phoneCancel}
                  />
                </div>
              </div>

              {/* 第三步 */}
              <div
                className={styles.pbEditBlock}
                style={this.state.a5 ? (this.state.phoneStep == 3 ? show : hide) : hide}
              >
                {/* 手机号码 */}
                <div className={styles.nonForm} style={{ marginBottom: 10 }}>
                  <p className={styles.rightText}>新手机号码:</p>
                  <p className={styles.leftText}>{this.state.newMobile}</p>
                </div>
                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Phonethree
                    dispatch={dispatch}
                    changeF={this.changeF}
                    data={data}
                    newMobile={this.state.newMobile}
                    phoneCodeArr={phoneCodeArr}
                  />
                </div>
              </div>

              <br style={{ clear: 'both' }} />
            </div>

            {/* 修改密码 */}
            <div className={styles.pbShowText}>
              <div style={{ width: '100%' }} onClick={() => this.editClick(this.state.a6, 'a6')}>
                <div className={styles.pbTitleTwo}>修改密码</div>
                <div className={styles.pbEditText} id="thum6" style={this.state.a6 ? hide : show}>
                  *********
                </div>
                <div className={styles.pbEdit} onClick={() => this.editClick(this.state.a6, 'a6')}>
                  <span id="text5">{this.state.a6 ? '收起' : '编辑'}</span>
                  <img src={this.state.a6 ? editImg : packUp} id="img6" />
                </div>
              </div>
              {/* 编辑状态 */}
              <div className={styles.pbEditBlock} id="edit6" style={this.state.a6 ? show : hide}>
                {/* 表单 */}
                <div className={styles.nonForm}>
                  <Password dispatch={dispatch} data={data} />
                </div>
              </div>
              <br style={{ clear: 'both' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

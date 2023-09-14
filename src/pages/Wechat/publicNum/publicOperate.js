import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { nsHoc } from '../../../utils/hocUtil';
import { Card, Col, Form, Input, message, Radio, Row, Select, Slider, Upload } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../Less/publicNum.less';
import BaseCrudComponent from '@/components/BaseCrudComponent';

import { getAuthToken } from '../../../utils/cookie';
import indexPhoto from '../../../assets/Wechat/indexPhoto.png';
import { errorBoundary } from "../../../layouts/ErrorBoundary";

const Token = getAuthToken();

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@errorBoundary
@nsHoc({ namespace: "publicNum" })
@Form.create()
@connect(state => ({
  publicNum: state.publicNum
  // systeam: state.systeam,
}))

export default class TableList extends BaseCrudComponent {
  state = {
    value: 1,
    encryptList: [
      {
        name: "明文加密",
        code: "1",
        id: 1
      }, {
        name: "密文加密",
        code: "0",
        id: 0
      }
    ],

    //存储公众号id
    publicId: null,
    publicType: null,

    //公众号图表上传
    headImg: false,
    //修改头像是否显示 0 不显示 1 显示
    reviseShow: 0,
    //裁剪照片
    newfile: null,
    //显示照片
    fileShow: indexPhoto,
    //默认头像裁剪比例
    scale: 1,
    //0还没上传 1上传成功 2上传失败
    success: 0,
    //0 还没裁剪 1 已经裁剪
    isCutting: 0,

    headIcon: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    //获取索机构类型下拉
    dispatch({
      type: "publicNum/selectList",
      payload: {
        fcode: "orgType"
      }
    });

    this.setState({
      publicId: sessionStorage.getItem("publicApp"),
      publicType: sessionStorage.getItem("publicType")
    }, () => {
      //按照id查询公众号详情
      if (this.state.publicType == "edit") {
        this.getPublicDetail();
      } else {
        dispatch({
          type: "publicNum/publicForm",
          payload: {
            item: {},
            type: this.state.publicType
          }
        });

        dispatch({
          type: "publicNum/publicForm2",
          payload: {
            item: {},
            type: this.state.publicType
          }
        });
      }
    });
  };

  //在组件从 DOM 中移除之前立刻被调用
  componentWillUnmount() {
    sessionStorage.removeItem("publicApp");
    sessionStorage.removeItem("publicType");
  };

  //裁剪
  onClickSave = () => {
    const { fileShow } = this.state;
    if (fileShow == indexPhoto) {
      message.warning('请选择文件');
    } else {

      if (this.editor) {

        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
        // drawn on another canvas, or added to the DOM.
        const canvas = this.editor.getImage();

        // If you want the image resized to the canvas size (also a HTMLCanvasElement)
        const canvasScaled = this.editor.getImageScaledToCanvas();

        let image = new Image();
        image.src = canvasScaled.toDataURL('image/jpg');

        this.setState({
          isCutting: 1,
          newfile: image.src,
        }, () => {

        });

      }
    }
  };


  //查询公众号详情
  getPublicDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "publicNum/fetch",
      payload: {
        id: this.state.publicId,
        length: 1,
        start: 1
      }
    });

  };

  //单选按钮change事件
  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  //加密方式下拉
  encryptWay = (list = []) => {
    let child = [];
    list.map((index, i) => {
      child.push(<Option value={index.code}>{index.name}</Option>);
    });
    return (<Select style={{ width: "100%" }}>{child}</Select>);
  };

  //渲染表单
  renderForm = (formList) => {
    const { getFieldDecorator } = this.props.form;
    const { publicNum: { orgTypeList } } = this.props;
    const { encryptList } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    };
    let uploadInfo = [];
    formList.map((index, i) => {
      uploadInfo.push(<Col md={24} sm={24}>
        <FormItem  {...formItemLayout} label={index.label}>
          <Col md={index.tipShow ? 14 : 24} sm={24}>
            {index.showType == "input" ? getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + "为必填项!" }]
            })(
              <Input/>
            ) : (index.showType == "select" ? getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + "为必填项!" }]
            })(
              this.encryptWay(index.filedName == "orgType" ? orgTypeList : encryptList)
            ) : getFieldDecorator(index.filedName, {
              initialValue: index.initialValue,
              rules: [{ required: index.required, message: index.label + "为必填项!" }]
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            ))}
          </Col>
          <Col md={index.tipShow ? 10 : 0} sm={24}><p
            style={{ fontSize: 14, color: "#c3c9d2", marginLeft: 10 }}>{index.tipInfo}</p></Col>
        </FormItem>
      </Col>);
    });
    return uploadInfo;
  };

  addInfo = () => {
    const { publicNum: { editPublic } } = this.props;

    return (<Card title="添加公众号信息">
      {this.renderForm(editPublic)}
      {this.uploadImg()}
    </Card>);
  };

  handleChange = (info) => {
    let imgArr = [];
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    if (info.file.status !== "uploading") {
    }
  };

  //上传头像之前调用的方法
  beforeUpload = (file) => {
    this.setState({ fileShow: file });
  };

  //初始化头像实例
  setEditorRef = (editor) => this.editor = editor;

  //控制头像放大缩小
  onChangeScale = (value) => {
    this.setState({
      scale: value
    });
  };
  //保存头像
  savePhoto = () => {
    if (this.state.isCutting == 1) {
      //base64 转 blob
      let $Blob = this.getBlobBydataURI(this.state.newfile, "image/jpeg");
      let formData = new FormData();
      formData.append("file", $Blob, "file_" + Date.parse(new Date()) + ".jpg");
      //组建XMLHttpRequest 上传文件
      let request = new XMLHttpRequest();

      let _this = this;

      //上传连接地址
      let id = this.state.publicType != 'edit' ? 0 : this.state.publicId;

      request.open('POST', '/ams/yss-itc-admin/wechatapp/ftpuploadimg?appId=' + id);
      request.setRequestHeader("token", Token);

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          //判断返回字符串
          let tellData = JSON.parse(request.response);
          if (tellData.status == '200') {
            message.success("上传成功");

            _this.setState({
              headIcon: tellData.data,
              success: 1,
              reviseShow: 0, //上传成功 隐藏上传头像框
            });

          } else {
            message.error("上传失败");
            _this.setState({
              success: 2,
              reviseShow: 1,
            });
          }

        }
      };
      request.send(formData);
      //上传成功 裁剪参数设为未裁剪
      _this.setState({
        isCutting: 0
      });
    } else {
      message.warning("请裁剪您的头像");
    }
  };

  /*
   * 根据base64 内容 取得 bolb
   * @param dataURI
   * @returns Blob
   */
  getBlobBydataURI = (dataURI, type) => {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
  };
  uploadImg = () => {
    const { publicNum: { publicDetail } } = this.props;
    const { isCutting, success } = this.state;
    //控制显示隐藏变量
    const show = {
      display: "",
    }
    const hide = {
      display: "none",
    }

    //上传图片
    const propsUpload = {
      name: "file",
      action: "",
      accept: "image/*",
      listType: "picture",
      headers: {
        authorization: "authorization-text",
        token: Token
      },
      customRequest: () => {
      }
    };


    return (<Col md={24} sm={24} className={styles.uploadPublicImg}>
        <Col md={9} sm={24} >
          <div className={styles.iconUser}>
            <img src={(isCutting != 0 || success != 0) ? this.state.newfile : publicDetail.data.headIcon}/>
          </div>
          <button onClick={() => this.revisePhoto()} style={{ marginLeft: 90, marginTop: 10 }}>{this.state.reviseShow == 0 ? '修改' : '收起'}</button>
        </Col>
        {/* <a style={{ position: 'absolute', top: 5, left: 200, color: '#333', fontSize: 12 }}>请上传jpg,png格式的图片.</a> */}
        <Col md={15} sm={24} style={this.state.reviseShow == 0 ? hide : show}>
          <Upload {...propsUpload}
                  onChange={this.handleChange}
                  beforeUpload={this.beforeUpload}
                  className={styles.UploadBtn}
          >
            <button disabled={this.state.headImg} >上传头像</button>
          </Upload>
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.fileShow}
            width={120}
            height={120}
            border={50}
            borderRadius={100}    //圆角程度
            color={[255, 255, 255, 0.5]} // RGBA
            scale={this.state.scale}  //缩放比例0.5-1.5   默认1.0
            rotate={0}
            style={{ background: 'rgba(0,0,0,.15)', marginTop: 10 }}
          />
          <Slider
            className={styles.sliderCircle}
            min={0.5}
            max={1.5}
            step={0.1}
            value={this.state.scale}
            onChange={this.onChangeScale}
          />
          <div className={styles.cuttingBtn}>
            <button onClick={() => this.onClickSave()} >裁剪</button>
            <button onClick={() => this.savePhoto()}>保存</button>
          </div>
        </Col>
      </Col>
    );
  };


  //点击按钮修改头像
  revisePhoto = () => {
    //显示
    if (this.state.reviseShow == 0) {
      this.setState({
        reviseShow: 1,
      });
      //隐藏
    } else if (this.state.reviseShow == 1) {
      this.setState({
        reviseShow: 0,
      });
    }
  };
  //点击保存按钮
  saveAdd = () => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        let basic = {
          id: this.state.publicType == "edit" ? this.state.publicId : null,
          headIcon: this.state.headIcon,
          appId: fieldsValue.appId,
          developerId: fieldsValue.developerId,
          appName: fieldsValue.appName,
          appNickName: fieldsValue.appNickName,
          appSecret: fieldsValue.appSecret,
          token: fieldsValue.token,
          redirectDomain: fieldsValue.redirectDomain,
          serviceDomain: fieldsValue.serviceDomain,
          isCheckeToken: fieldsValue.isCheckeToken,
          encodAeskey: fieldsValue.encodAeskey,
          encodType: fieldsValue.encodType,
          wechatAppAuth: {
            authKey: fieldsValue.authKey,
            encryptKey: fieldsValue.encryptKey,
            orgCode: fieldsValue.orgCode,
            orgType: fieldsValue.orgType,
            serviceAddr: fieldsValue.serviceAddr
          }
        };

        dispatch({
          type: this.state.publicType != "edit" ? "publicNum/add" : "publicNum/update",
          payload: basic
        });

      }
    });

  };

  mainBody = () => {
    const { publicNum: { editPublic2 } } = this.props;
    return (<Card title="所属主体机构信息">
        {this.renderForm(editPublic2)}
        <Col md={5} sm={24}></Col>
        <Col md={19} sm={24}>
          <div className={styles.orgBtn}>
            <button onClick={() => this.saveAdd()}>保存</button>
          </div>
        </Col>
      </Card>
    );
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch, form } = this.props;


    //添加成功 页面跳转
    if (nextProps.publicNum.addPublic.status == 200) {
      dispatch(routerRedux.push('./publicNum'));
      nextProps.publicNum.addPublic.status = null;
    }

    //修改成功 页面跳转
    if (nextProps.publicNum.updatePublic.status == 200) {
      dispatch(routerRedux.push('./publicNum'));
      nextProps.publicNum.updatePublic.status = null;
    }

    if (nextProps.publicNum.publicDetail.status == 200) {
      dispatch({
        type: 'publicNum/publicForm',
        payload: {
          item: nextProps.publicNum.publicDetail.data,
          type: this.state.publicType,
        },
      });

      dispatch({
        type: 'publicNum/publicForm2',
        payload: {
          item: nextProps.publicNum.publicDetail.data.wechatAppAuth,
          type: this.state.publicType,
        },
      });
      nextProps.publicNum.publicDetail.status = null;
    }

  }


  render() {

    return (
      <PageHeaderLayout father_url="/wechat/publicNum">
        <Form className="form">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.publicDo}>
            <Col md={14} sm={24}>
              {this.addInfo()}
            </Col>
            <Col md={10} sm={24}>
              {this.mainBody()}
            </Col>
          </Row>
        </Form>
      </PageHeaderLayout>
    );
  }
}

/**
 *Create on 2020/9/29.
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Col, Form, message, Modal, Popconfirm, Row, Select, Upload } from 'antd';
import styless from './add.less';
import { getAuthToken } from '@/utils/session';
// import imgs from '../../../assets/commandManagement/ocr_hover.png';
// import prompt from '../../../assets/newCustomerHandling/prompt.png';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { uuid } from '@/utils/utils';
import XLSX from 'xlsx';

const token = getAuthToken();
const { Option } = Select;

const uploadProps = {
  action: './ams/ams-investor-service/investor/importinvestor',
  name: 'file',
  headers: {
    Token: token,
  },
};

@errorBoundary
@Form.create()
@connect(state => ({
  newCustomerHandling: state.newCustomerHandling,
  instructionOperate: state.instructionOperate,
}))
export default class addInBatches extends Component {
  state = {
    selectedRows: [],
    more: false,
    fileList: [],
    fileFinal: [],
    doType: null,
    isfirst: null,
    child11: null,
    isReset: null,
    // 是否必输项
    mustEnter: true,
    // 投资者类型 0机构 1个人 2产品
    finvestorType: '0',
    // 是否使用OCR识别 ，这导致组件使用不同
    isOcr: false,
    loadings: false,
    // 机构投资人
    institutionalInvestor: [],
    // 产品投资人
    productInvestor: [],
    // 个人投资人
    individualInvestor: [],
    visibleDownload: false,
    visibleUpLoad: false,
    fileTypeName: '机构投资人',
    fileType: 'Organ',
    ManagerInfo: '',
    OrganizationInfo: '',
    ProductInfo: '',
    jigou: [],
    chanpin: [],
    geren: [],
  };

  //点击orc OCR文字识别
  orcTest = () => {
    return (
      <div className={styless.ocrStyle} onClick={() => this.orcComponent()}>
        <a>手动录入太麻烦？试试OCR文字识别</a>
        {/*<img src={{ imgs }} alt="" style={{ width: 20, height: 20 }} />*/}
      </div>
    );
  };

  //ocr识别组件
  orcComponent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'instructionOperate/visibleFun',
      payload: false,
    });
  };

  //控制上传文件大小 不可超过1M
  beforeUpload = file => {
    let fileName = file.name;
    let sedStr = fileName.split('.')[1];
    // const fileType = file.type === 'application/vnd.ms-excel';
    if (sedStr !== 'xls') {
      message.error('文件格式不对');
    }
    const isLt2M = file.size / 1024 / 1024 < 50;
    if (!isLt2M) {
      message.error('文件小于50M!');
    }
    return isLt2M && sedStr;
  };
  onError = () => {
    message.error('文件上传失败');
  };
  handleFileChange = info => {
    const { fileType } = this.state;

    let arr;
    let fileList = info.fileList;
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.status === 200;
      } else if (file.status) {
        return file.status;
      }
    });
    if (info.file.status === 'done') {
      if (info.file.response.status === 200) {
        message.success(info.file.name + '上传成功');

        switch (fileType) {
          case 'agentInfo':
            let agentInfo = this.state.agentInfo;
            agentInfo.push({ name: info.file.name, uid: info.file.uid });
            this.setState({ agentInfo });
            break;
          case 'productInfo':
            let productInfo = this.state.productInfo;
            productInfo.push({ name: info.file.name, uid: info.file.uid });
            this.setState({ productInfo });
            break;
          case 'organizationInfo':
            let organizationInfo = this.state.organizationInfo;
            organizationInfo.push({ name: info.file.name, uid: info.file.uid });
            this.setState({ organizationInfo });
            break;
          case 'corporationInfo':
            let corporationInfo = this.state.corporationInfo;
            corporationInfo.push({ name: info.file.name, uid: info.file.uid });
            this.setState({ corporationInfo });
            break;
          case 'qualificationInfo':
            let qualificationInfo = this.state.qualificationInfo;
            qualificationInfo.push({ name: info.file.name, uid: info.file.uid });
            this.setState({ qualificationInfo });
            break;
        }
      } else {
        message.error('文件上传失败');
      }
    }

    if (info.file.status === 'uploading') {
      this.setState({ loadings: true });
    }

    this.setState({
      fileList: [...fileList],
      InvestorInfo: [...fileList],
    });
  };
  remove = (e, item) => {
    this.setState({
      [item]: [],
    });
  };

  //图片显示
  pictureShow = field => {
    const { retData, dictateOne } = this.props;
    let img = '';
    let imgStyle = '';
    for (let key in dictateOne) {
      if (key == field) {
        img = './img/amsTransferServer/ocr/' + retData + '/' + field + '.jpg';
        imgStyle = <img src={img} style={{ height: 30, width: '100%' }} />;
        return <div>{imgStyle}</div>;
      } else {
        imgStyle = '暂无识别数据';
      }
    }

    return <div>{imgStyle}</div>;
  };

  saveForm = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/productDataManage/batchPreview'));
  };

  handleOk = e => {
    this.setState({
      visible: false,
      visibleDownload: false,
      visibleUpLoad: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      visibleDownload: false,
      visibleUpLoad: false,
    });
  };

  // 单一添加跳转
  handleNewInvestor = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/productDataManage/myInvestor/newInvestor'));
  };

  visibleDownload = () => {
    this.setState({
      visibleDownload: true,
    });
  };

  visibleUpLoad = () => {
    this.setState({
      visibleUpLoad: true,
    });
  };

  // 上传文件显示列表，公共组件
  compon = fileType => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return getFieldDecorator(fileType)(
      <Upload
        {...uploadProps}
        fileList={this.state[fileType]}
        onChange={this.handleFileChange}
        beforeUpload={this.beforeUpload}
        onRemove={e => this.remove(e, fileType)}
      />,
    );
  };

  // 取消后跳转
  routerLink = path => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(path));
  };

  // 模板下载
  download = () => {
    document.getElementById('proInvestor').click();
    document.getElementById('orgInvestor').click();
    document.getElementById('perInvestor').click();
  };

  // 选择上传文件类型
  handleSelectChange = (value, Option) => {
    this.setState({
      fileType: value,
      fileTypeName: Option.props.children,
    });
  };

  // 上传
  getData = (data, fileTypes, fileName) => {
    const { dispatch } = this.props;
    const { fileTypeName, fileType } = this.state;

    dispatch({
      type: 'newCustomerHandling/addbyexcel',
      payload: {
        data: JSON.parse(data),
        title: fileType,
      },
    }).then(item => {
      if (item) {
        switch (fileTypes) {
          case 'Organ':
            this.setState({
              jigou: [
                {
                  name: fileName,
                  uid: uuid,
                },
              ],
            });
            break;
          case 'Product':
            this.setState({
              chanpin: [
                {
                  name: `${fileName}`,
                  uid: uuid,
                },
              ],
            });
            break;
          case 'Personal':
            this.setState({
              geren: [
                {
                  name: `${fileName}`,
                  uid: uuid,
                },
              ],
            });
            break;
        }
      }
    });
  };

  render() {
    const {
      newCustomerHandling: {
        // loading,
        currentPage,
        data,
      },
      instructionOperate: { visible, retData, correctData, loading },
      dispatch,
      form: { getFieldDecorator },
    } = this.props;

    const { loadings, fileTypeName, fileType } = this.state;

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

    return (
      <>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '20px' }}>新增投资人</div>
            <div>
              <Button onClick={this.handleNewInvestor}>单个添加+</Button>
            </div>
          </div>
        </Card>
        <div className={styless.content}>
          <div style={{ position: 'relative', zIndex: 999 }}>
            <Card title="批量新增" style={{ marginBottom: 50 }}>
              <Form>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={24} sm={24} style={{ paddingLeft: 32 }}>
                    <Col
                      md={4}
                      sm={24}
                      style={{ textAlign: 'right', paddingLeft: 0, paddingRight: 0 }}
                    />
                    <Col md={20} sm={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div className={styless.uploadFile}>
                        <div style={{ marginBottom: 20 }}>
                          <a href="javascript:;" onClick={this.visibleDownload}>
                            下载模板
                          </a>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <a href="javascript:;" onClick={this.visibleUpLoad}>
                            选择上传类型
                          </a>
                        </div>
                        <Form.Item {...formItemLayout} label="">
                          {getFieldDecorator('agentInfo')(
                            <div>
                              <FileUpload
                                sheet={fileTypeName}
                                fileType={fileType}
                                startStop={[0]}
                                getData={this.getData}
                                object={''}
                              />
                            </div>,
                          )}
                        </Form.Item>

                        <Form.Item {...formItemLayout} label="机构投资人">
                          {this.compon('jigou')}
                        </Form.Item>

                        <Form.Item {...formItemLayout} label="产品投资人">
                          {this.compon('chanpin')}
                        </Form.Item>

                        <Form.Item {...formItemLayout} label="个人投资人">
                          {this.compon('geren')}
                        </Form.Item>
                      </div>
                    </Col>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Modal
              title="模板下载"
              visible={this.state.visibleDownload}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
            >
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
                <div>
                  {/*<img src={prompt} alt="" style={{ marginRight: 8 }} />*/}
                  请选择下载以下哪种投资类型的模板
                </div>
                <div onClick={this.download}>
                  <a>全部下载</a>
                </div>
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-around' }}
                className={styless.excelBox}
              >
                <a
                  id="orgInvestor"
                  className={styless.box}
                  href="/img/amsInvestorServer/orgInvestor.xlsx"
                  download="机构投资者信息.xlsx"
                >
                  <div className={styless.excel} />
                  <div className={styless.font}>机构投资人</div>
                </a>
                <a
                  id="proInvestor"
                  className={styless.box}
                  href="/img/amsInvestorServer/proInvestor.xlsx"
                  download="产品投资者信息.xlsx"
                >
                  <div className={styless.excel} />
                  <div className={styless.font}>产品投资人</div>
                </a>
                <a
                  id="perInvestor"
                  className={styless.box}
                  href="/img/amsInvestorServer/perInvestor.xlsx"
                  download="个人投资者信息.xlsx"
                >
                  <div className={styless.excel} />
                  <div className={styless.font}>个人投资人</div>
                </a>
              </div>
            </Modal>

            <Modal
              title="请选择上传类型"
              visible={this.state.visibleUpLoad}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>请选择当前上传的文件属于哪个投资人类型</p>
              <p style={{ color: '#ff932a' }}>投资人类型需对应所用模板</p>
              <Select
                defaultValue="Organ"
                style={{ width: '100%' }}
                onChange={this.handleSelectChange}
              >
                <Option value="Organ">机构投资人</Option>
                <Option value="Product">产品投资人</Option>
                <Option value="Personal">个人投资人</Option>
              </Select>
            </Modal>

            <Card
              style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                marginTop: '20px',
                marginLeft: -20,
                zIndex: 10,
              }}
            >
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginRight: 170 }}>
                <Col
                  md={24}
                  sm={24}
                  style={{ textAlign: 'right', paddingLeft: -24, marginLeft: -24 }}
                >
                  <Popconfirm
                    title="确定要取消吗?"
                    onConfirm={() => this.routerLink('/productDataManage/newCustomerHandling')}
                  >
                    <Button style={{ marginRight: 10 }}>取消</Button>
                  </Popconfirm>
                  <Button type="primary" onClick={() => this.saveForm()} loading={loading}>
                    下一步
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

class FileUpload extends Component {
  componentDidMount() {
    this.setState({
      wb: null,
    });
  }

  importJSXlsx = () => {
    let { type } = this.props;
    let object = this.refs._excelfile;
    let wb; //读取完成的数据
    let rABS = true; //是否将文件读取为二进制字符串
    if (!object.files) return;
    let f = object.files[0];
    let reader = new FileReader();
    let fileName = f.name;
    let fileNameArr = fileName && fileName.split('.'),
      nameLen = fileNameArr.length;
    if (fileNameArr[nameLen - 1] !== 'xlsx' && fileNameArr[nameLen - 1] !== 'xls') {
      message.warn('上传文件模板格式错误，请检查');
      return;
    }
    if (rABS) reader.readAsBinaryString(f);
    else reader.readAsArrayBuffer(f);
    reader.onload = e => {
      //数据加载完成
      let data = e.target.result;
      if (!rABS) data = new Uint8Array(data);
      wb = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
      this._TOJSON(wb, fileName);
      this.setState({
        wb: wb,
      });
    };
  };

  _TOJSON = (wb, fileName) => {
    let { sheet, startStop, fileType } = this.props;

    let result = {};
    for (let i = 0; i < wb.SheetNames.length; i++) {
      let sheetName = wb.SheetNames[i];
      let start = null,
        stop = null;
      let roa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        header: 1,
        defval: '',
        blankrows: false,
      });
      if (sheet) {
        if (!start) {
          if (stop) roa = roa.slice(start, stop);
          else roa = roa.slice(start);
        }
        if (start == null && stop == null && startStop) {
          start = startStop[0];
          stop = startStop[1];
          if (stop == null) roa = roa.slice(start);
          else roa = roa.slice(start, stop);
        }
        if (roa.length) result['sheet' + ++i] = roa;
        // result.title = sheet;
      } else {
        if (start == null && stop == null && startStop) {
          start = startStop[0];
          stop = startStop[1];
          if (stop == null) roa = roa.slice(start);
          else roa = roa.slice(start, stop);
        }
        if (roa.length) result['sheet' + ++i] = roa;
        // result.title = sheet;
      }
    }

    let _ToJSON = JSON.stringify(result);
    if (this.props.getData) this.props.getData(_ToJSON, fileType, fileName);
  };

  render() {
    return <input type="file" ref="_excelfile" onChange={this.importJSXlsx} />;
  }
}

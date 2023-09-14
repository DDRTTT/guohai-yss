// 合同模板页面
import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
  Tooltip,
  Tree,
  TreeSelect,
  Upload,
} from 'antd';
import styles from './index.less';
import request from '@/utils/request';
import Action from '@/utils/hocUtil';
import router from 'umi/router';
import contractImg from '@/assets/contract.png';
import { getAuthToken } from '@/utils/cookie';
// import Debounce from 'lodash-decorators/debounce';
// import debounce from 'lodash/debounce';
import PageContainer from '@/components/PageContainers';

const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const dropdownList = {
  // 合同类型, 合同性质
  codeList: 'contractType, contractNature',
};
const uri = '/ams-file-service';
let timer = null;
let parentArr = [];
let valArr = [];

@Form.create()
class Index extends Component {
  state = {
    loading: false,
    isReview: true,
    open: false,
    tabsLoading: false,
    activeVal: 'all',
    title: '',
    templateAddVisible: false,
    like: '',
    isUpload: false,
    dropDownObj: [],
    switchStatus: true,
    oftenCurrent: 1,
    oftenTotal: 0,
    allCurrent: 1,
    allTotal: 0,
    myCurrent: 1,
    myTotal: 0,
    oftenData: [],
    allData: [],
    myData: [],
    oftenDataLoading: false,
    allDataLoading: false,
    myDataLoading: false,
    uploadBtnLoading: false,
    contractNatureLoading: false,
    templateDelTip: false,
    delId: '',
    delLoading: false,
    category: [],
    templateNameTip: '',
    goon: false,
    userInfo: {},
    treeVal: undefined,
    IPObject: {},
    cArr: [],
    delKey: '',
  };

  setTreeNode = data => {
    return data.map(item => (
      <TreeNode title={item.title} key={item.key}>
        {item?.children?.length > 0 && this.setTreeNode(item.children)}
      </TreeNode>
    ));
  };

  switchAndGetData = (isReview = true, status = 1) => {
    this.setState(
      {
        isReview,
        oftenData: [],
        allData: [],
        myData: [],
        oftenCurrent: 1,
        oftenTotal: 0,
        allCurrent: 1,
        allTotal: 0,
        myCurrent: 1,
        myTotal: 0,
      },
      () => {
        if (isReview) {
          this.templateQuery(1);
          this.templateQuery(2);
        } else {
          this.templateQuery(2);
        }
      },
    );
  };

  setOpen = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  tabsChangeQuery = val => {
    this.setState({ activeVal: val, oftenData: [], allData: [], myData: [] }, () => {
      if (this.state.isReview) {
        this.templateQuery(1);
        this.templateQuery(2);
      } else {
        this.templateQuery(2);
      }
    });
  };

  // 获取下一级节点
  getChildNode = id => {
    request(`/ams-base-parameter/fileTypeInfo/selListByParentIdAndPurpose?purpose=2&id=${id}`).then(
      res => {
        console.log(res.data);
        if (res?.status === 200) {
          this.setState({ cArr: res.data });
        }
      },
    );
  };

  showTabsItem = (val, id) => {
    const { activeVal } = this.state;
    this.setState({ activeVal: activeVal === val ? '' : val }, () => {
      // 加载子节点
      this.getChildNode(id);
    });
  };

  setAddModal = val => {
    this.setState(
      { templateAddVisible: true, isUpload: val === 'isUpload', contractNatureLoading: true },
      () => {
        this.getDropdownData();
      },
    );
  };

  search = val => {
    this.setState({ like: val }, () => {
      if (this.state.isReview) {
        this.templateQuery(1);
        this.templateQuery(2);
      } else {
        this.templateQuery(2);
      }
    });
  };
  switchChange = checked => {
    this.setState({ switchStatus: checked });
  };
  // 获取下拉列表(文件性质)
  getDropdownData = () => {
    request(`/ams-base-parameter/fileTypeInfo/selAllTreeByPurposeForVo?purpose=2`).then(res => {
      if (res?.status === 200) {
        this.setState({ dropDownObj: res.data, contractNatureLoading: false });
        this.setTreeNode(res.data);
      }
    });
  };

  // 模板查询
  templateQuery = (flag = 0, current = 1, pageSize = 6) => {
    if (+flag === 1) {
      this.setState({ oftenDataLoading: true });
    }
    if (+flag === 2) {
      this.setState({ allDataLoading: true });
    }
    // if (+flag === 0) {
    //   this.setState({ myDataLoading: true })
    // }
    const { isReview, activeVal, like } = this.state;
    const payload = {
      templateType: isReview ? 0 : 1,
      archivesClassification: activeVal === 'all' ? '' : activeVal,
      like,
      flag,
    };
    fetch(
      `/ams${uri}/template/oftentemplate?currentPage=${+flag === 1 ? 1 : current}&pageSize=${
        +flag === 1 ? 6 : pageSize
      }`,
      {
        headers: {
          Token: sessionStorage.getItem('auth_token'),
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Data: new Date().getTime(),
          Sys: 1,
        },
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ).then(res => {
      if (res?.status === 200) {
        res.json().then(res => {
          if (+flag === 1) {
            this.setState({
              oftenData: res?.data?.rows,
              oftenTotal: res?.data?.total,
              oftenDataLoading: false,
            });
          }
          if (+flag === 2) {
            this.setState({
              allData: res?.data?.rows,
              allTotal: res?.data?.total,
              allDataLoading: false,
            });
          }
        });

        // if (+flag === 0) {
        //   this.setState({ myData: res.data.rows, myTotal: res.data.total, myDataLoading: false })
        // }
      }
    });
  };

  pageChange = (e, flag) => {
    console.log('pageChange', e);
    if (+flag === 1) {
      this.setState({ oftenCurrent: e }, () => {
        this.templateQuery(flag, e);
      });
    }
    if (+flag === 2) {
      this.setState({ allCurrent: e }, () => {
        this.templateQuery(flag, e);
      });
    }
    // if (+flag === 0) {
    //   this.setState({ myCurrent: e }, () => {
    //     this.templateQuery(flag, e);
    //   })
    // }
  };

  // 获取文件存放路径
  getFilePathByCode = params => {
    request(`/ams-base-contract/contractfile/getfilebycode?code=${params}`).then(res => {
      if (res?.status === 200) {
        let category = {};
        if (valArr.length === 1) {
          category = {
            archivesClassification: valArr[0],
            documentType: '',
            fileType: '',
          };
        }
        if (valArr.length === 2) {
          category = {
            archivesClassification: valArr[0],
            documentType: valArr[1],
            fileType: '',
          };
        }
        if (valArr.length > 2) {
          category = {
            archivesClassification: valArr[0],
            documentType: valArr[1],
            fileType: valArr[valArr.length - 1],
          };
        }
        let formVals = this.props.form.getFieldsValue();
        formVals = {
          ...formVals,
          ...res.data,
          ...category,
          isSmart: this.state.switchStatus ? 1 : 0,
        };
        this.jumpPage(formVals, 'upload');
      }
    });
  };

  // 删除模板
  delTemplate = () => {
    let { isReview, allCurrent, allData, delId, delKey } = this.state;
    this.setState({ delLoading: true }, () => {
      fetch(`/ams${uri}/businessArchive/deleteFile`, {
        headers: {
          Token: sessionStorage.getItem('auth_token'),
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Data: new Date().getTime(),
          Sys: 1,
        },
        method: 'POST',
        body: JSON.stringify([delId]),
      }).then(res => {
        if (res?.status === 200) {
          message.success('操作成功');
          // 删除模板时同步删除掉模板中的标签数据
          request(`/ams-base-contract/directory/deleteByChangxieKey?changxieKey=${delKey}`);
          this.setState({ delLoading: false, templateDelTip: false }, () => {
            if (allData.length === 1) {
              allCurrent--;
            }
            if (isReview) {
              this.templateQuery(1);
              this.templateQuery(2, allCurrent);
            } else {
              this.templateQuery(2, allCurrent);
            }
          });
        }
      });
    });
  };

  before = () => {
    const { templateNameTip } = this.state;
    if (templateNameTip) {
      message.warn(templateNameTip);
    }
  };

  beforeUpload = file => {
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.warn('文件不能大于100M!');
    }
    return isLt100M;
  };

  uploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploadBtnLoading: true,
      });
    }
    if (info.file.status === 'done') {
      if (info?.file?.response?.status === 200) {
        message.success(`${info.file.name} 导入成功`);
        this.getFilePathByCode(info?.file?.response?.data);
        this.setState({ uploadBtnLoading: false });
      } else {
        message.warn(`${info.file.name} 导入失败，请稍后再试`);
        this.setState({
          uploadBtnLoading: false,
        });
      }
    }
    if (info.file.status === 'error') {
      message.warn(`${info.file.name} 导入失败，请稍后再试`);
      this.setState({
        uploadBtnLoading: false,
      });
    }
  };

  newTemplate = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      values.isSmart = this.state.switchStatus ? 1 : 0;
      let category = {};
      if ((valArr.length = 1)) {
        category = {
          archivesClassification: valArr[0],
          documentType: '',
          fileType: '',
        };
      }
      if ((valArr.length = 2)) {
        category = {
          archivesClassification: valArr[0],
          documentType: valArr[1],
          fileType: '',
        };
      }
      if (valArr.length > 2) {
        category = {
          archivesClassification: valArr[0],
          documentType: valArr[1],
          fileType: valArr[valArr.length - 1],
        };
      }
      values = {
        ...values,
        ...category,
      };

      this.jumpPage(values, 'newAdd');
    });
  };

  // 获取类目
  getCategoryData = () => {
    request('/ams-base-parameter/fileTypeInfo/selListByParentIdAndPurpose?purpose=2&id=-1').then(
      res => {
        if (res?.status === 200) {
          this.setState({ category: res.data });
        }
      },
    );
  };

  getTemplateName = e => {
    const val = e.target.value;
    if (val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.checkTemplateName(val);
      }, 1500);
    }
  };

  uploadCheckUp = arr => {
    this.props.form.validateFields(arr, (err, values) => {
      if (err) {
        this.setState({ goon: false });
        return false;
      }
      this.setState({ goon: true });
    });
  };

  // 校验文件名
  checkTemplateName = val => {
    request(`${uri}/template/checkthere`, {
      method: 'POST',
      body: JSON.stringify({ fileName: val }),
    }).then(res => {
      this.uploadCheckUp(['type', 'contractNature']);
      if (res?.status === 200) {
        this.setState({ templateNameTip: '' });
      }
      if (res?.status.toString().length === 8) {
        message.warn(res.message);
        this.setState({ templateNameTip: res.message, goon: false });
      }
    });
  };

  jumpPage = (item, status) => {
    item.status = status;
    sessionStorage.setItem('_status', status);
    sessionStorage.setItem('templateDetailsParams', JSON.stringify(item));
    router.push('./templateSet/templateDetails');
  };

  useTemplate = item => {
    router.push(
      `/dynamicPage/pages/合同审批/4028e7b6782a111001785878da6e000a/提交?fileType=${item.type}&key=${item.templateKey}&name=${item.fileName}&url=/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${item.fileNumber}&templateId=${item.id}&type=save`,
    );
  };

  treeSelectOnChange = treeVal => {
    this.setState({ treeVal }, () => {
      this.getCategory(this.state.dropDownObj, treeVal);
    });
    this.uploadCheckUp(['templateName', 'type']);
  };

  getParentID = (arr, val) => {
    let id = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === val) {
        id = arr[i].parentId;
        this.getCategory();
        break;
      } else if (arr[i]?.children.length > 0) {
        this.getParentID(arr[i].children, val);
      }
    }
    return id;
  };

  getCategory = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].parentId === '-1') {
        parentArr = [];
      }
      if (arr[i].value === val) {
        parentArr.push(arr[i].value);
        valArr = parentArr;
        break;
      } else if (arr[i]?.children.length > 0) {
        parentArr.push(arr[i].value);
        this.getCategory(arr[i].children, val);
      }
    }
  };

  componentDidMount() {
    const userInfo = sessionStorage.getItem('USER_INFO');
    this.setState({ userInfo: JSON.parse(userInfo) });
    // this.getDropdownData();
    this.getDropdownData();
    this.getCategoryData(); // 获取类目
    this.templateQuery(1); // 获取常用模板
    this.templateQuery(2); // 获取全部模板
  }

  onTreeSelect = selectedKeys => {
    this.setState({ activeVal: selectedKeys[0], oftenData: [], allData: [], myData: [] }, () => {
      if (this.state.isReview) {
        this.templateQuery(1);
        this.templateQuery(2);
      } else {
        this.templateQuery(2);
      }
    });
  };

  render() {
    const {
      cArr,
      treeVal,
      userInfo,
      templateNameTip,
      delLoading,
      templateDelTip,
      contractNatureLoading,
      loading,
      isReview,
      category,
      open,
      tabsLoading,
      activeVal,
      title,
      templateAddVisible,
      isUpload,
      switchStatus,
      dropDownObj,
      oftenData,
      allData,
      myData,
      oftenDataLoading,
      allDataLoading,
      myDataLoading,
      oftenCurrent,
      allCurrent,
      myCurrent,
      oftenTotal,
      allTotal,
      myTotal,
      uploadBtnLoading,
      goon,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadContractProps = {
      action: '/ams/ams-file-service/fileServer/uploadFile',
      name: 'file',
      headers: {
        Token: getAuthToken(),
      },
    };
    return (
      <>
        <PageContainer />
        <div className={styles.box}>
          <div className={styles.searchBox} style={{ marginTop: 7 }}>
            <div className={styles.reviewBox}>
              <Spin spinning={loading} size="small">
                <div
                  style={{ display: userInfo.type === '01' ? 'none' : 'inline-block' }}
                  className={[styles.reviewL, isReview ? styles.active : ''].join(' ')}
                  onClick={() => this.switchAndGetData(true, 1)}
                >
                  在线模板
                </div>
                <div
                  style={{ display: userInfo.type === '01' ? 'none' : 'inline-block' }}
                  className={[styles.reviewR, !isReview ? styles.active : ''].join(' ')}
                  onClick={() => this.switchAndGetData(false, 0)}
                >
                  我的模板
                </div>
              </Spin>
              <div className={styles.search}>
                <Action key="templateSet:query1" code="templateSet:query">
                  <Input.Search
                    placeholder="请输入"
                    onSearch={val => this.search(val)}
                    style={{ width: 242, marginRight: 20, height: 34 }}
                  />
                </Action>
                <Action code="templateSet:save">
                  <Button style={{ marginLeft: 8 }} onClick={() => this.setAddModal('isUpload')}>
                    导入模板
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => this.setAddModal('isAdd')}
                    type="primary"
                  >
                    新增模板
                  </Button>
                </Action>
              </div>
            </div>
          </div>
          <div>
            <Spin spinning={tabsLoading}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0 }}>
                <Col md={4} sm={24}>
                  <div style={{ color: '#000', fontWeight: 600, marginTop: 80 }} key="sslm">
                    所属类目：
                  </div>
                  <div
                    className={styles.tabBtn}
                    style={{
                      color: activeVal === 'all' ? 'blue' : '#000000A6',
                      marginTop: 5,
                      marginLeft: 30,
                      cursor: 'pointer',
                    }}
                    key="all"
                    onClick={() => this.tabsChangeQuery('all')}
                  >
                    全部
                  </div>
                  <Action key="templateSet:query2" code="templateSet:query">
                    <Tree onSelect={this.onTreeSelect}>
                      {dropDownObj.length > 0 && this.setTreeNode(dropDownObj)}
                    </Tree>
                  </Action>
                </Col>
                <Col md={20} sm={24}>
                  <div className={styles.tabContent}>
                    {isReview ? (
                      <div>
                        <Spin spinning={oftenDataLoading}>
                          <div className={styles.titleBox}>常用模板</div>
                          <div>
                            <Row
                              gutter={{ md: 8, lg: 24, xl: 48 }}
                              style={{ marginLeft: 0, marginRight: 0 }}
                            >
                              {oftenData.length > 0 ? (
                                oftenData.map(item => (
                                  <Col
                                    xxl={8}
                                    md={12}
                                    sm={24}
                                    key={item.id}
                                    style={{ marginTop: 20 }}
                                  >
                                    <Card className={styles.oftenCard} bodyStyle={{ padding: 10 }}>
                                      <div className={styles.imgBox}>
                                        <img src={contractImg} alt="模板封面" />
                                      </div>
                                      <div className={styles.doBox}>
                                        <Tooltip placement="topLeft" title={item.templateName}>
                                          <p>{item.templateName}</p>
                                        </Tooltip>
                                        <p>{item.createTime}</p>
                                        <p style={{ textAlign: 'right' }}>
                                          <a onClick={() => this.jumpPage(item, 'isSee')}>查看</a>
                                          {userInfo.type === '01' && (
                                            <a
                                              onClick={() => this.jumpPage(item, 'isUpdate')}
                                              style={{ marginLeft: 8 }}
                                            >
                                              修改
                                            </a>
                                          )}
                                          <a
                                            onClick={() => this.useTemplate(item)}
                                            style={{ marginLeft: 8 }}
                                          >
                                            使用
                                          </a>
                                          {userInfo.type === '01' && (
                                            <a
                                              onClick={() =>
                                                this.setState({
                                                  templateDelTip: true,
                                                  delId: item.id,
                                                  delKey: item.templateKey,
                                                })
                                              }
                                              style={{ marginLeft: 8 }}
                                            >
                                              删除
                                            </a>
                                          )}
                                        </p>
                                      </div>
                                    </Card>
                                  </Col>
                                ))
                              ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                              )}
                            </Row>
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.page}>
                              <Pagination
                                size="small"
                                current={oftenCurrent}
                                total={oftenTotal}
                                pageSize={6}
                                onChange={e => this.pageChange(e, 1)}
                                style={{ display: 'none' }}
                              />
                            </Row>
                          </div>
                        </Spin>
                        <Spin spinning={allDataLoading}>
                          <div className={styles.titleBox} style={{ marginTop: 40 }}>
                            全部模板
                          </div>
                          <div>
                            <Row
                              gutter={{ md: 8, lg: 24, xl: 48 }}
                              style={{ marginLeft: 0, marginRight: 0 }}
                            >
                              {allData.length > 0 ? (
                                allData.map(item => (
                                  <Col
                                    xxl={8}
                                    md={12}
                                    sm={24}
                                    key={item.id}
                                    style={{ marginTop: 20 }}
                                  >
                                    <Card className={styles.oftenCard} bodyStyle={{ padding: 10 }}>
                                      <div className={styles.imgBox}>
                                        <img src={contractImg} alt="模板封面" />
                                      </div>
                                      <div className={styles.doBox}>
                                        <Tooltip placement="topLeft" title={item.templateName}>
                                          <p>{item.templateName}</p>
                                        </Tooltip>
                                        <p>{item.createTime}</p>
                                        <p style={{ textAlign: 'right' }}>
                                          <a onClick={() => this.jumpPage(item, 'isSee')}>查看</a>
                                          {userInfo.type === '01' && (
                                            <a
                                              onClick={() => this.jumpPage(item, 'isUpdate')}
                                              style={{ marginLeft: 8 }}
                                            >
                                              修改
                                            </a>
                                          )}
                                          <a
                                            onClick={() => this.useTemplate(item)}
                                            style={{ marginLeft: 8 }}
                                          >
                                            使用
                                          </a>
                                          {userInfo.type === '01' && (
                                            <a
                                              onClick={() =>
                                                this.setState({
                                                  templateDelTip: true,
                                                  delId: item.id,
                                                  delKey: item.templateKey,
                                                })
                                              }
                                              style={{ marginLeft: 8 }}
                                            >
                                              删除
                                            </a>
                                          )}
                                        </p>
                                      </div>
                                    </Card>
                                  </Col>
                                ))
                              ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                              )}
                            </Row>
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.page}>
                              <Pagination
                                size="small"
                                current={allCurrent}
                                total={allTotal}
                                pageSize={6}
                                onChange={e => this.pageChange(e, 2)}
                                style={{ display: +allTotal === 0 ? 'none' : '' }}
                              />
                            </Row>
                          </div>
                        </Spin>
                      </div>
                    ) : (
                      <div>
                        <Spin spinning={allDataLoading}>
                          <div>
                            <Row
                              gutter={{ md: 8, lg: 24, xl: 48 }}
                              style={{ marginLeft: 0, marginRight: 0 }}
                            >
                              {allData.length > 0 ? (
                                allData.map(item => (
                                  <Col
                                    xxl={8}
                                    md={12}
                                    sm={24}
                                    key={item.id}
                                    style={{ marginTop: 20 }}
                                  >
                                    <Card className={styles.oftenCard} bodyStyle={{ padding: 10 }}>
                                      <div className={styles.imgBox}>
                                        <img src={contractImg} alt="模板封面" />
                                      </div>
                                      <div className={styles.doBox}>
                                        <Tooltip placement="topLeft" title={item.templateName}>
                                          <p>{item.templateName}</p>
                                        </Tooltip>
                                        <p>{item.createTime}</p>
                                        <p style={{ textAlign: 'right' }}>
                                          <a onClick={() => this.jumpPage(item, 'isSee')}>查看</a>
                                          <a
                                            onClick={() => this.jumpPage(item, 'isUpdate')}
                                            style={{ marginLeft: 8 }}
                                          >
                                            修改
                                          </a>
                                          <a
                                            onClick={() => this.useTemplate(item)}
                                            style={{ marginLeft: 8 }}
                                          >
                                            使用
                                          </a>
                                          <a
                                            onClick={() =>
                                              this.setState({
                                                templateDelTip: true,
                                                delId: item.id,
                                                delKey: item.templateKey,
                                              })
                                            }
                                            style={{ marginLeft: 8 }}
                                          >
                                            删除
                                          </a>
                                        </p>
                                      </div>
                                    </Card>
                                  </Col>
                                ))
                              ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                              )}
                            </Row>
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.page}>
                              <Pagination
                                size="small"
                                current={allCurrent}
                                total={allTotal}
                                pageSize={6}
                                onChange={e => this.pageChange(e, 2)}
                                style={{ display: +allTotal === 0 ? 'none' : '' }}
                              />
                            </Row>
                          </div>
                        </Spin>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              {/* <div className={styles.tabArea}>
                <span className={styles.tabTitle} >
                  <span style={{ color: '#000', fontWeight: 600 }} key="sslm">所属类目：</span>
                  <span className={styles.tabBtn} style={{ color: activeVal === 'all' ? 'blue' : '#000000A6' }} key='all' onClick={() => this.tabsChangeQuery('all')}>全部</span>
                </span>
                <span className={styles.tabTitle} style={{ overflow: 'hidden', width: '85%', height: open ? 'auto' : 25 }}>
                  {category.length > 0 && category.map(item => (
                    <span key={item.fileTypeCode}>
                      <span className={styles.tabBtn} style={{ color: activeVal === item.fileTypeCode ? 'blue' : '#000000A6' }} onClick={() => this.tabsChangeQuery(item.fileTypeCode)}>
                        {item.fileTypeName}
                      </span>
                      <Icon style={{ color: activeVal === item.fileTypeCode ? 'blue' : '#000000A6' }} type={activeVal === item.fileTypeCode ? "up" : "down"} onClick={() => this.showTabsItem(item.fileTypeCode, item.id)} />
                    </span>
                  ))}
                </span>
              </div> */}

              {/* <div>
                <span className={styles.tabTitle} style={{ overflow: 'hidden', width: '85%', height: open ? 'auto' : 25 }}>
                  {cArr.length > 0 && cArr.map(item => (
                    <span key={item.fileTypeCode}>
                      <span className={styles.tabBtn} style={{ color: activeVal === item.fileTypeCode ? 'blue' : '#000000A6' }} onClick={() => this.tabsChangeQuery(item.fileTypeCode)}>
                        {item.fileTypeName}
                      </span>
                      <Icon style={{ color: activeVal === item.fileTypeCode ? 'blue' : '#000000A6' }} type={activeVal === item.fileTypeCode ? "up" : "down"} onClick={() => this.showTabsItem(item.fileTypeCode, item.id)} />
                    </span>
                  ))}
                </span>
              </div> */}
            </Spin>
          </div>
          <Modal
            title={title}
            visible={templateAddVisible}
            onCancel={() => this.setState({ templateAddVisible: false })}
            destroyOnClose={true}
            footer={null}
            width={550}
          >
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0 }}>
                <Col md={24} sm={24}>
                  <FormItem label="文件名称">
                    {getFieldDecorator('templateName', {
                      rules: [
                        {
                          required: true,
                          message: '模板文件名称不能为空',
                        },
                      ],
                    })(<Input placeholder="请输入" onChange={this.getTemplateName} />)}
                  </FormItem>
                  <div
                    style={{
                      display: templateNameTip ? 'block' : 'none',
                      color: '#f5222d',
                      margin: '-10px 0 10px 90px',
                    }}
                  >
                    {templateNameTip}
                  </div>
                </Col>
                <Col md={24} sm={24}>
                  <FormItem label="文件类型">
                    {getFieldDecorator('type', {
                      rules: [
                        {
                          required: true,
                          message: '模板文件类型不能为空',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        onChange={() => this.uploadCheckUp(['templateName', 'contractNature'])}
                      >
                        {'.docx'.split(',').map((item, i) => (
                          <Option key={i} value={item.replace('.', '')}>
                            {item}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col md={24} sm={24}>
                  <Spin spinning={contractNatureLoading} size="small">
                    <FormItem label={`文件性质`}>
                      {getFieldDecorator('contractNature', {
                        rules: [
                          {
                            required: true,
                            message: `模板文件性质不能为空`,
                          },
                        ],
                      })(
                        <TreeSelect
                          style={{ width: '100%' }}
                          value={treeVal}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择"
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.treeSelectOnChange}
                          treeData={dropDownObj}
                        />,
                      )}
                    </FormItem>
                  </Spin>
                </Col>
                <Col md={24} sm={24}>
                  <FormItem label="智能模型">
                    {getFieldDecorator('isSmart')(
                      <Switch
                        checkedChildren="开"
                        unCheckedChildren="关"
                        checked={switchStatus}
                        onChange={this.switchChange}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className={styles.tipBtnBox} style={{ marginTop: 20, textAlign: 'right' }}>
              {isUpload ? (
                <Upload
                  {...uploadContractProps}
                  data={{
                    uploadFilePath: isReview
                      ? `contractfile/onlineTemplate`
                      : `contractfile/orgTemplate`,
                  }}
                  openFileDialogOnClick={goon}
                  accept=".docx"
                  onChange={e => this.uploadChange(e)}
                  beforeUpload={this.beforeUpload}
                  showUploadList={false}
                >
                  <Button
                    onClick={this.before}
                    loading={uploadBtnLoading}
                    type="primary"
                    // disabled={formListLoaging}
                  >
                    导入模板
                  </Button>
                </Upload>
              ) : (
                <Button
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={() => this.newTemplate()}
                >
                  确定
                </Button>
              )}
              <Button
                onClick={() =>
                  this.setState({ templateAddVisible: false, contractNatureLoading: false })
                }
                style={{ marginLeft: 8 }}
              >
                取消
              </Button>
            </div>
          </Modal>
          <Modal
            title="提示"
            visible={templateDelTip}
            // onOk={() => this.setTemplateDel()}
            onCancel={() => this.setState({ templateDelTip: false })}
            destroyOnClose={true}
            footer={null}
            width={450}
          >
            <div>
              <p className={styles.tipText}>
                <Icon
                  style={{ color: '#3384D5', marginRight: 10 }}
                  type="info-circle"
                  theme="filled"
                />
                确定删除当前选中的模板么？
              </p>
              <div style={{ textAlign: 'right' }}>
                <Button loading={delLoading} type="primary" onClick={() => this.delTemplate()}>
                  确定
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => this.setState({ templateDelTip: false, delLoading: false })}
                >
                  取消
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default Index;

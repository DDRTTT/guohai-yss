import React, { Component } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Spin,
  Switch,
  Table,
  Tabs,
  Transfer,
} from 'antd';
import styles from './index.less';
import request from '@/utils/request';
import Action from '@/utils/hocUtil';
import { uuid } from '@/utils/utils';
import router from 'umi/router';
import Base64 from '@/utils/Base64';
import { PageContainers } from '@/components';

const { TabPane } = Tabs;

let tagsCheckedArr = []; // 文档标签 选中项集合
let itemsCheckedArr = []; // 元素标签 选中项集合
let _id = 0;
// let _docxTags = [{ id: 2, name: '产品tujd称', text: '同时都不设置值则提取当前文档所有内容域的文本，返回值包含内容域的name,id及对应的文本内容，id通过接口查询' }, { id: 3, name: '币种', text: '同时都不设置值则提取当前文档所有内容域的文本，返回值包含内容域的name,id及对应的文本内容，id通过接口查询' }, { id: 4, name: '产品生产日期称', text: '同时都不设置值则提取当前' }];
let _docxTags = [];
let _formItems = [];
let _pair = [];

// 权限参数
const unitParameters = {
  download: true, // 下载
  edit: true, // 编辑
  print: true,
  review: true, // 修订
  copyoutenabled: false, // 是否可以复制编辑器里的内容
  commentFilter: {
    // 批注设置
    type: 'Default', // Default 全部可见 NoDisplay 全部不可见  DisplaySection 部分可见 NoDisplaySection 部分不可见
    userList: [], // 设置可以看见批注人员的id
  },
  chat: true, // 聊天菜单
  comments: true,
  zoom: 100, // 缩放 默认100
  leftMenu: true, // 左侧菜单  主要操作 搜索、文档结构(目录)、批注、聊天
  rightMenu: false, // 右侧菜单  主要操作 行间距、段间距、背景色、标签、边距等
  toolbar: true, // 上边菜单  所有的操作(包含左右菜单的所有功能)
  header: true,
  statusBar: true, // 下边菜单 主要操作 缩放、修订、显示总页数和当前页
  autosave: true,
  forcesave: true, // 强制保存
  mode: 'edit', // view 只读  edit 编辑
  user: {
    id: '',
    mane: '',
  },
};
// 页面样式参数
const cssParameters = {
  height: '800px',
  // height: "500px",
  width: '100%',
  type: 'desktop', // desktop PC端 mobile 移动端
};
let cx = {};
const OBJECT = {
  object: 'content',
  type: 'text',
  name: '',
  id: '',
};

const customization = {};

@Form.create()
class Index extends Component {
  state = {
    IPObject: {},
    templateDetailsParams: {},
    userInfo: {},
    templateKey: '',
    switchStatus: true,
    more: false,
    tags: [],
    data: [],
    saveBtn: true,
    docxTags: [],
    isWrite: 2,
    mappingVisible: false,
    shineLoading: false,
    pair: [],
    formItems: [],
    formItemLoading: false,
    itemChecked: '',
    idArr: [], // 映射关联 选中项集合
    checkL: [],
    isAll: '',
    saveLoading: false,
    permissionVisible: false,
    staffVisible: false,
    staffLoading: false,
    allKeys: [],
    targetKeys: [],
    contractDirectoryId: '',
    directoryNumber: '',
    record: {},
    permissionLoading: false,
    isSee: 0,
    _status: '',
    selectedKeys: [],
  };

  switchChange = checked => {
    this.setState({ switchStatus: checked, isWrite: checked ? 2 : 1 });
    if (!checked) {
      this.getStaffList();
    }
  };

  renderCXEditor = (fileType, key, title, url) => {
    console.log('renderCXEditor-params:', fileType, key, title, url);
    console.time('文档加载时间');
    const _status = sessionStorage.getItem('_status');
    const { IPObject, userInfo, templateDetailsParams } = this.state;
    const cxo_config = {
      // type: 'embedded',
      document: {
        fileType, // 指明要打开的文档的类型
        key, // 文档唯一ID
        title, // 文档标题
        url, // 文件存放路径
        permissions: {
          // permissions 文档权限  (permissions.edit和permissions.review 与 mode的值有关
          download: unitParameters.download, // 是否可下载
          edit: unitParameters.edit, // 是否可编辑 true 可编辑 false 只读
          print: unitParameters.print, // 是否可打印
          review: unitParameters.review, // 是否可修订
          copyoutenabled: unitParameters.copyoutenabled, // 是否可复制编辑器里的内容
          commentFilter: unitParameters.commentFilter, // 批注权限
        },
      },
      documentType: this.getDocumentType(fileType), // 指明文档类型 如 word excel
      editorConfig: {
        callbackUrl: `${IPObject.gateWayIp}/ams/ams-base-contract/personalversion/callbackadd`,
        customization: {
          about: false,
          createUrl:
            _status === 'newAdd'
              ? `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=04151625366557533937`
              : undefined,
          chat: unitParameters.chat,
          comments: unitParameters.comments,
          zoom: unitParameters.zoom,
          leftMenu: _status === 'isSee' ? false : unitParameters.leftMenu,
          rightMenu: unitParameters.rightMenu,
          toolbar: _status === 'isSee' ? false : unitParameters.toolbar,
          header: unitParameters.header,
          statusBar: _status === 'isSee' ? false : unitParameters.statusBar,
          autosave: unitParameters.autosave,
          forcesave: unitParameters.forcesave,
          logo: {
            image: '',
          },
        },
        mode: _status === 'isSee' ? 'view' : 'edit',
        user: {
          id: userInfo.id,
          name: userInfo.username,
        },
      },
      events: {
        onAppReady: this.onAppReady,
        onDocumentReady: this.onDocumentReady,
        onError: this.onError,
        onRequestClose: this.onRequestClose,
        onWarning: this.onWarning,
        onDocumentStateChange: this.onDocumentStateChange,
        onDownloadAs: this.onDownloadAs,
        onGetDocumentContent: this.onGetDocumentContent,
        // forceSave: this.forceSave,
      },
      height: cssParameters.height,
      width: cssParameters.width,
      type: cssParameters.type,
    };

    cx = new CXO_API.CXEditor('_COX_Editor_SKD', cxo_config);
  }; //  在线编辑 模板

  getDocumentType = ext => {
    if (
      '.doc.docx.docm.dot.dotx.dotm.odt.fodt.ott.rtf.txt.html.htm.mht.pdf.djvu.fb2.epub.xps'.indexOf(
        ext,
      ) !== -1
    )
      return 'text';
    if ('.xls.xlsx.xlsm.xlt.xltx.xltm.ods.fods.ots.csv'.indexOf(ext) !== -1) return 'spreadsheet';
    if ('.pps.ppsx.ppsm.ppt.pptx.pptm.pot.potx.potm.odp.fodp.otp'.indexOf(ext) !== -1)
      return 'presentation';
    return null;
  };

  onAppReady = () => {
    message.success('编辑器加载完成');
  };

  onDocumentReady = () => {
    message.success('文档加载完成');
    console.timeEnd('文档加载时间');
    this.setState({ saveBtn: false });
    cx.getDocumentContent(OBJECT);
  };

  onError = event => {
    message.error(`编辑器错误: code ${event.data.errorCode}, 描述 ${event.data.errorDescription}`);
  };

  onRequestClose = () => {
    if (window.opener) {
      window.close();
      return;
    }
    cx.destroyEditor();
  };

  onWarning = event => {
    message.warn(
      `编辑器警告: code ${event.data.warningCode}, 描述 ${event.data.warningDescription}`,
    );
  };

  onDocumentStateChange = () => {};

  onDownloadAs = () => {};

  setFormItems = () => {};

  onSearchL = val => {
    let { docxTags } = this.state;
    if (val === '') {
      this.setState({ docxTags: _docxTags, checkL: [], isAll: '' });
    } else {
      docxTags = _docxTags.filter(key => key.name.includes(val));
      this.setState({ docxTags: JSON.parse(JSON.stringify(docxTags)), checkL: [], isAll: '' });
    }
    tagsCheckedArr = [];
  };
  onSearchM = val => {
    let { pair } = this.state;
    if (val === '') {
      this.setState({ pair: _pair });
    } else {
      pair = _pair.filter(
        key => key.docxTags.name.includes(val) || key.formItems.label.includes(val),
      );
      this.setState({ pair: JSON.parse(JSON.stringify(pair)) });
    }
  };

  onSearchR = val => {
    let { formItems } = this.state;
    if (val === '') {
      this.setState({ formItems: _formItems });
    } else {
      formItems = _formItems.filter(key => key.label.includes(val));
      this.setState({ formItems: JSON.parse(JSON.stringify(formItems)) });
    }
  };

  checkBoxChangeL = ({ target: { checked } }, item) => {
    let { checkL } = this.state;
    if (checked) {
      tagsCheckedArr.push(item);
      checkL.push(item.id);
    } else {
      tagsCheckedArr = tagsCheckedArr.filter(key => key.id !== item.id);
      checkL = checkL.filter(key => key !== item.id);
    }
    this.setState({ checkL: JSON.parse(JSON.stringify(checkL)), isAll: '' });
  };

  checkBoxChangeM = ({ target: { checked } }, id) => {
    let { idArr } = this.state;
    if (checked) {
      idArr.push(id);
    } else {
      idArr = idArr.filter(key => key !== id);
    }
    this.setState({ idArr: JSON.parse(JSON.stringify(idArr)) });
  };

  checkBoxChangeR = ({ target: { checked } }, item) => {
    if (checked) {
      itemsCheckedArr = [];
      itemsCheckedArr.push(item);
      this.setState({ itemChecked: item.key });
    } else {
      itemsCheckedArr = [];
      this.setState({ itemChecked: '' });
    }
  };

  isCheckAll = str => {
    let { docxTags, checkL } = this.state;
    if (str === 'isAll') {
      docxTags.forEach(item => {
        const ID = checkL.find(key => key === item.id);
        if (!ID) {
          checkL.push(item.id);
        }
        const ITEM = tagsCheckedArr.find(key => key.id === item.id);
        if (!ITEM) {
          tagsCheckedArr.push(item);
        }
      });
    }
    if (str === 'recheck') {
      docxTags.forEach(item => {
        const ID = checkL.find(key => key === item.id);
        if (ID) {
          checkL = checkL.filter(key => key !== item.id);
        } else {
          checkL.push(item.id);
        }
        const ITEM = tagsCheckedArr.find(key => key.id === item.id);
        if (ITEM) {
          tagsCheckedArr = tagsCheckedArr.filter(key => key.id !== item.id);
        } else {
          tagsCheckedArr.push(item);
        }
      });
    }
    if (str === 'noAll') {
      checkL = [];
      tagsCheckedArr = [];
    }
    this.setState({ isAll: str, checkL: JSON.parse(JSON.stringify(checkL)) });
  };

  addPair = () => {
    let { pair, docxTags, checkL } = this.state;
    if (tagsCheckedArr.length === 0) {
      message.warn('请至少选择一个文档标签');
      return;
    }
    if (itemsCheckedArr.length !== 1) {
      message.warn('请选择模型要素且只能选择一个');
      return;
    }
    tagsCheckedArr.forEach(item => {
      ++_id;
      docxTags = docxTags.filter(key => key.id !== item.id);
      _docxTags = _docxTags.filter(key => key.id !== item.id);
      pair.push({
        docxTags: item,
        formItems: itemsCheckedArr[0],
        id: _id,
      });
      _pair.push({
        docxTags: item,
        formItems: itemsCheckedArr[0],
        id: _id,
      });
    });
    tagsCheckedArr = [];
    itemsCheckedArr = [];
    checkL = [];
    this.setState({
      pair: JSON.parse(JSON.stringify(pair)),
      docxTags: JSON.parse(JSON.stringify(docxTags)),
      checkL: JSON.parse(JSON.stringify(checkL)),
      itemChecked: '',
      isAll: '',
    });
  };

  delPair = () => {
    let { pair, docxTags, idArr, checkL } = this.state;
    if (idArr.length === 0) {
      message.warn('请至少选择一个映射关联数据');
      return;
    }
    idArr.forEach(id => {
      _pair.forEach(item => {
        if (item.id === id) {
          _docxTags.push(item.docxTags);
        }
      });
      const _index = _pair.findIndex((currentVal, i, arr) => {
        return currentVal.id === id;
      });
      _pair.splice(_index, 1);
      pair.forEach(item => {
        if (item.id === id) {
          docxTags.push(item.docxTags);
        }
      });
      const index = pair.findIndex((currentVal, i, arr) => {
        return currentVal.id === id;
      });
      pair.splice(index, 1);
    });
    tagsCheckedArr = [];
    itemsCheckedArr = [];
    checkL = [];
    this.setState({
      pair: JSON.parse(JSON.stringify(pair)),
      docxTags: JSON.parse(JSON.stringify(docxTags)),
      checkL: JSON.parse(JSON.stringify(checkL)),
      idArr: [],
    });
  };

  onGetDocumentContent = event => {
    let l = 0;
    const tags = event.data.text;
    _docxTags = tags;
    if (tags.length > 0 && tags.length > l) {
      l = tags.length;
      this.setState(
        {
          docxTags: JSON.parse(JSON.stringify(tags)),
          tags,
        },
        () => {
          const { templateKey } = this.state;
          const arr = [];
          tags.forEach((item, i) => {
            if (item.name) {
              arr.push({
                changxieKey: templateKey,
                directoryName: item.name,
                directoryNumber: item.id,
                text: item.text,
              });
            }
          });
          if (arr.length > 0) {
            // saveTags
            fetch(`/ams/ams-base-contract/directory/add?changxieKey=${templateKey}`, {
              headers: {
                Token: sessionStorage.getItem('auth_token'),
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                Data: new Date().getTime(),
                Sys: 1,
              },
              method: 'POST',
              body: JSON.stringify(arr),
            }).then(res => {
              if (res?.status === 200) {
                this.getStaffList();
              }
            });
          }
        },
      );
    }
  };

  // 查询权限设置列表
  getStaffList = () => {
    const { templateKey } = this.state;
    this.setState({ permissionLoading: true }, () => {
      request(`/ams-base-contract/directory/selectbychangxiekey?changxieKey=${templateKey}`).then(
        res => {
          if (res?.status === 200) {
            this.setState({ data: res.data, permissionLoading: false });
          }
        },
      );
    });
  };

  appendJQCDN = apiSrc => {
    const _this = this;
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.setAttribute('src', apiSrc);
    head.appendChild(script);
    // 判断外部js是否加载完成
    script.onload = script.onreadystatechange = function() {
      if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        const { IPObject, templateKey, templateDetailsParams } = _this.state;
        const _status = sessionStorage.getItem('_status');
        _this.renderCXEditor(
          templateDetailsParams?.type,
          templateKey,
          templateDetailsParams?.templateName || templateDetailsParams?.fileName,
          `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${
            _status !== 'newAdd' ? templateDetailsParams?.fileNumber : '04151625366557533937'
          }`,
        );
      }
      script.onload = script.onreadystatechange = null;
    };
  };

  // 获取地址
  getNginxIP = () => {
    request('/ams-base-contract/contractfile/getnginxip').then(res => {
      if (res?.status === 200) {
        this.appendJQCDN(res.data.jsApi);
        this.setState({ IPObject: res.data });
      }
    });
  };

  callback = key => {
    if (+key === 2) {
      this.reloadSignList();
    }
  };

  reloadSignList = () => {
    cx.getDocumentContent(OBJECT);
  };

  moreSet = flag => {
    this.setState({
      more: flag,
    });
  };

  setMappingBox = sign => {
    const { templateKey, userInfo, pair, docxTags } = this.state;
    this.setState({ mappingVisible: sign }, () => {
      if (sign) {
        this.setState({ shineLoading: true }, () => {
          // 获取右侧 表单项
          this.getFormItems();
          // 获取映射关系 并重新设置左侧文档标签
          request(
            `/ams-base-contract/data/selectByKey?changxieKey=${templateKey}&orgId=${userInfo.orgId}`,
          ).then(res => {
            if (res?.status === 200) {
              const { data } = res;
              if (data.length > 0) {
                _id = data.length;
                data.forEach((item, i) => {
                  const index = docxTags.findIndex(val => +val.id === +item.directoryNumber);
                  if (index !== -1) {
                    docxTags.splice(index, 1);
                  }
                  pair[i] = {
                    docxTags: {
                      id: +item.directoryNumber,
                      name: item.directoryName,
                      title: item.directoryName,
                      text: item.text,
                    },
                    formItems: { fromCode: item.fromCode, fromName: item.fromName },
                    id: i,
                  };
                });
                _docxTags = docxTags;
                _pair = pair;
              }
              this.setState({
                shineLoading: false,
                pair: JSON.parse(JSON.stringify(pair)),
                docxTags: JSON.parse(JSON.stringify(docxTags)),
              });
            } else {
              message.warn(res.message);
              // this.setState({ shineLoading: false })
            }
          });
        });
      } else {
        this.setState(
          {
            shineLoading: false,
            tagsCheckedArr: [],
            itemsCheckedArr: [],
            _docxTags: [],
            docxTags: [],
            _formItems: [],
            formItems: [],
            _pair: [],
            pair: [],
            _id: 0,
          },
          () => {
            this.reloadSignList(); // 获取左侧 文档标签
          },
        );
      }
    });
  };

  reSet = () => {
    this.setState(
      {
        shineLoading: true,
        tagsCheckedArr: [],
        itemsCheckedArr: [],
        _docxTags: [],
        docxTags: [],
        _formItems: [],
        formItems: [],
        _pair: [],
        pair: [],
        _id: 0,
      },
      () => {
        this.reloadSignList();
        setTimeout(() => {
          this.setMappingBox(true);
        }, 3000);
      },
    );
  };

  setDocxTags = (item, i) => {};

  unshiftData = () => {};

  // 获取右侧智能模型数据(全流程全量数据) bd9f3616cc8b40529082389097091c39
  getFormItems = () => {
    this.setState({ formItemLoading: false }, () => {
      request(`/ams-base-parameter/fileTypeQuery/selModuleKeyByFileTypeCode?fileTypeCode=b`).then(
        res => {
          if (res?.status === 200) {
            request(`/api/billow-diplomatic/template-id/${res.data[0]}`).then(res => {
              if (res?.status === 200) {
                const arr = [];
                const formItems = JSON.parse(Base64.decode(res.data.content)).formList;
                if (formItems.length > 1) {
                  formItems.forEach(item => {
                    if (item.label === '') {
                      if (item.value?.formList?.length > 0) {
                        arr.push(...item.value?.formList);
                      }
                    } else {
                      arr.push(item);
                    }
                  });
                }
                _formItems = arr;
                this.setState({ formItems: arr });
              } else {
                message.warn(res.message);
              }
              this.setState({ formItemLoading: false });
            });
          }
        },
      );
    });
  };

  saveTemplate = () => {
    const { templateDetailsParams, templateKey, userInfo, IPObject } = this.state;
    const _status = sessionStorage.getItem('_status');
    const fileName =
      templateDetailsParams?.fileName?.substring(
        0,
        templateDetailsParams.fileName.lastIndexOf('.'),
      ) || 'template';
    const payload = {
      fileSerialNumber: templateDetailsParams.fileNumber,
      fileName, // 去掉后缀名
      templateName: templateDetailsParams.templateName, //
      fileType: templateDetailsParams.fileType,
      archivesClassification: templateDetailsParams.archivesClassification,
      documentType: templateDetailsParams.documentType,
      busId: templateKey,
      fileForm: 'docx',
      sysCode: 'flow',
      fileKey: templateKey,
      isSmart: templateDetailsParams.isSmart,
      id: _status === 'isUpdate' ? templateDetailsParams?.id : undefined,
      formName: '',
    };
    const userdata = {
      fileSerialNumber: templateDetailsParams.fileNumber,
      fileName: templateDetailsParams.fileName,
      fileNumber: templateDetailsParams.fileNumber,
      templateKey,
      // contractType: templateMessage.contractType,
      // contractNature: templateMessage.contractNature,
      fileType: templateDetailsParams.fileType,
      archivesClassification: templateDetailsParams.archivesClassification,
      documentType: templateDetailsParams.documentType,
      type: templateDetailsParams.type,
      orgId: userInfo.orgId,
      dataType: _status === 'isUpdate' ? 5 : 4, // payload.dateType   0.仅保存 1.保存个人版本  2.行外推送保存个人版本 3 .合同文件保存模板  4.空白文档和导入文档保存模板  5.修改模板
      // dataType: 5,
      userId: userInfo.id,
      cover: '',
      fileNameTemp: fileName, // 去掉后缀名-------
      templateName: templateDetailsParams.templateName, //
      busId: templateKey,
      fileForm: 'docx',
      sysCode: 'flow',
      fileKey: templateKey,
      isSmart: templateDetailsParams.isSmart,
      id: _status === 'isUpdate' ? templateDetailsParams?.id : undefined,
      formName: '',
    };
    const params = {
      c: 'forcesave',
      key: templateKey,
      userdata: JSON.stringify(userdata),
    };
    this.setState({ saveLoading: true }, () => {
      fetch(`${IPObject.jsApiIp}/coauthoring/CommandService.ashx`, {
        method: 'POST',
        body: JSON.stringify(params),
      }).then(res => {
        if (res.status === 200) {
          res.json().then(response => {
            if (+response?.error === 0) {
              this.setState({ saveLoading: false });
              router.push('./templateSet');
            }
            if (+response?.error === 4) {
              // 表示文件无改动 强制保存调用templateSave 仅导入模板时
              message.warn('模板无改动');
              fetch('/ams/ams-file-service/template/add', {
                headers: {
                  Token: sessionStorage.getItem('auth_token'),
                  Accept: 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8',
                  Data: new Date().getTime(),
                  Sys: 1,
                },
                method: 'POST',
                body: JSON.stringify(payload),
              }).then(res => {
                if (res?.status === 200) {
                  message.success('操作成功');
                  this.setState({ saveLoading: false });
                  cx.destroyEditor && cx.destroyEditor();
                  router.push('./templateSet');
                }
                if (res?.status.toString().length === 8) {
                  message.warn(res.message);
                  this.setState({ saveLoading: false });
                }
              });
            }
          });
        }
      });
    });
  };

  saveMapping = () => {
    const { pair, templateKey, userInfo } = this.state;
    const list = [];
    // if (pair.length === 0) {
    //   message.warn('请设置标签映射关系');
    //   return;
    // }
    this.setState({ shineLoading: true }, () => {
      if (pair.length !== 0) {
        // 内容域中选中的文字最多保留长度30
        pair.forEach(item => {
          delete item.id;
          list.push({
            directoryNumber: item.docxTags.id,
            directoryName: item.docxTags.name,
            text: item.docxTags.text?.substr(0, 30),
            fromCode: item.formItems.key || item.formItems.fromCode,
            fromName: item.formItems.label || item.formItems.fromName,
          });
        });
      }
      const params = { list, changxieKey: templateKey, orgId: userInfo.orgId };
      fetch(`/ams/ams-base-contract/data/add`, {
        headers: {
          Token: sessionStorage.getItem('auth_token'),
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Data: new Date().getTime(),
          Sys: 1,
        },
        method: 'POST',
        body: JSON.stringify(params),
      }).then(res => {
        if (res?.status === 200) {
          message.success('操作成功');
          this.setState(
            {
              shineLoading: false,
              mappingVisible: false,
              tagsCheckedArr: [],
              itemsCheckedArr: [],
              _docxTags: [],
              docxTags: [],
              _formItems: [],
              formItems: [],
              _pair: [],
              pair: [],
              _id: 0,
            },
            () => {
              this.reloadSignList(); // 获取左侧 文档标签
            },
          );
        }
      });
    });
  };

  permissionBoxSet = (flag = false) => {
    if (flag) {
      this.setState(
        {
          permissionVisible: flag,
        },
        () => {
          this.getStaffList();
        },
      );
    } else {
      this.setState({ permissionLoading: flag, permissionVisible: flag });
    }
  };

  set = (flag = false, record = {}) => {
    this.setState(
      {
        staffVisible: flag,
        staffLoading: flag,
        directoryNumber: record.directoryNumber ? record.directoryNumber : '',
        contractDirectoryId: record.id ? record.id : '',
        orgId: record.orgId ? record.orgId : '',
        record,
      },
      () => {
        if (flag) {
          request(`/ams-base-contract/contractuser/getbyorgid?orgIds=${record.orgId}`).then(res => {
            if (res?.status === 200) {
              const response = res.data;
              const allKeys = [];
              const targetKeys = [];
              response.forEach(item => {
                allKeys.push({
                  key: item.code,
                  title: `${item.name}- ${item.code}`,
                });
              });
              record.directoryControlVos.forEach(item => {
                targetKeys.push(`${item.userId}`);
              });
              this.setState({
                allKeys: JSON.parse(JSON.stringify(allKeys)),
                targetKeys: JSON.parse(JSON.stringify(targetKeys)),
                staffLoading: false,
              });
            }
          });
        }
      },
    );
  };

  userMap = data => {
    return (
      <span>
        {data.length > 0 &&
          data.map((item, i) => (
            <Popover
              placement="topLeft"
              content={
                <div>
                  <p>用户类型: {item.typeName}</p>
                  <p>手机号码: {item.mobile}</p>
                  <p>邮箱账号: {item.email}</p>
                </div>
              }
              title={
                <div style={{ height: 60 }}>
                  <div style={{ float: 'left' }}>
                    <img
                      className={styles.headPortrait2}
                      src={`${this.state.IPObject.nginxIp}${item.logo}`}
                      alt="头像"
                    />
                  </div>
                  <div style={{ float: 'left' }}>
                    <p>{item.username}</p>
                    <p>{item.userId}</p>
                  </div>
                </div>
              }
            >
              <span className={styles.userNameBox}>{item.username}</span>
            </Popover>
          ))}
      </span>
    );
  };

  staffChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  staffSave = () => {
    const { targetKeys, contractDirectoryId } = this.state;
    const arr = [];
    targetKeys.forEach(item => {
      arr.push({
        contractDirectoryId,
        userId: item,
      });
    });
    this.setState(
      {
        staffLoading: true,
      },
      () => {
        fetch(
          `/ams/ams-base-contract/directorycontrol/update?contractDirectoryId=${contractDirectoryId}`,
          {
            headers: {
              Token: sessionStorage.getItem('auth_token'),
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              Data: new Date().getTime(),
              Sys: 1,
            },
            method: 'PUT',
            body: JSON.stringify(arr),
          },
        ).then(res => {
          if (res?.status === 200) {
            message.success('操作成功');
            this.setState(
              {
                staffLoading: false,
                staffVisible: false,
              },
              () => {
                // 刷新列表
                this.getStaffList();
              },
            );
          }
        });
      },
    );
  };

  updateTemplate = () => {
    const { templateDetailsParams, templateKey, IPObject } = this.state;
    sessionStorage.setItem('_status', 'isUpdate'); // 刷新后保持状态
    this.setState({ _status: 'isUpdate' }, () => {
      cx.destroyEditor && cx.destroyEditor();
      this.renderCXEditor(
        templateDetailsParams?.type,
        templateKey,
        templateDetailsParams?.templateName || templateDetailsParams?.fileName,
        `${IPObject.gateWayIp}/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${templateDetailsParams?.fileNumber}`,
      );
    });
  };

  PopconfirmConfirm = () => {
    router.push('/processCenter/processConfig');
  };

  PopconfirmCancel = () => {};

  selectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    });
  };

  useTemplate = () => {
    const { templateDetailsParams, templateKey } = this.state;
    const type = templateDetailsParams?.type;
    const name = templateDetailsParams?.templateName || templateDetailsParams?.fileName;
    const fileNumber = templateDetailsParams?.fileNumber;
    const templateId = templateDetailsParams.id;
    router.push(
      `/dynamicPage/pages/合同审批/4028e7b6782a111001785878da6e000a/提交?fileType=${type}&key=${templateKey}&name=${name}&url=/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${fileNumber}&templateId=${templateId}&type=save`,
    );
  };

  backJumpPage = () => {
    router.push('./templateSet');
  };

  componentDidMount() {
    cx.destroyEditor && cx.destroyEditor();
    const templateDetailsParams = JSON.parse(sessionStorage.getItem('templateDetailsParams'));
    if (!templateDetailsParams) {
      router.push('/contractManage/index');
      return;
    }
    const _status = sessionStorage.getItem('_status');
    this.setState(
      {
        templateDetailsParams,
        userInfo: JSON.parse(sessionStorage.getItem('USER_INFO')),
        switchStatus: +templateDetailsParams?.isSmart === 1,
        isWrite: +templateDetailsParams?.isSmart === 1 ? 2 : 1,
        _status,
      },
      () => {
        let templateKey = '';
        if (templateDetailsParams) {
          if (_status === 'newAdd' || _status === 'upload') {
            if (sessionStorage.getItem('_templateKey')) {
              templateKey = sessionStorage.getItem('_templateKey');
            } else {
              templateKey = uuid().replace(/-/g, '');
              sessionStorage.setItem('_templateKey', templateKey);
            }
          } else {
            templateKey = templateDetailsParams?.templateKey;
          }
        }
        this.setState({ templateKey }, () => this.getNginxIP());
      },
    );
  }

  componentWillUnmount() {
    cx && cx.destroyEditor && cx.destroyEditor();
    sessionStorage.removeItem('_templateKey');
    sessionStorage.removeItem('templateDetailsParams');
    sessionStorage.removeItem('_status');
  }

  render() {
    const {
      userInfo,
      selectedKeys,
      templateDetailsParams,
      permissionLoading,
      targetKeys,
      allKeys,
      staffLoading,
      staffVisible,
      permissionVisible,
      saveLoading,
      isAll,
      checkL,
      idArr,
      itemChecked,
      formItemLoading,
      switchStatus,
      more,
      tags,
      data,
      saveBtn,
      docxTags,
      isWrite,
      mappingVisible,
      shineLoading,
      pair,
      formItems,
    } = this.state;
    const columns = [
      {
        title: '标签名称',
        dataIndex: 'directoryName',
        width: 120,
      },
      {
        title: '授权用户数',
        dataIndex: 'userNumber',
        width: 120,
      },

      {
        title: '设置',
        dataIndex: 'id',
        width: 120,
        render: (val, record) => (
          <Action code="templateSet:empower">
            <a onClick={() => this.set(true, record)}>设置</a>
          </Action>
        ),
      },
      {
        title: '授权用户',
        dataIndex: 'directoryControlVos',
        render: val => this.userMap(val),
      },
    ];
    return (
      <PageContainers
        breadcrumb={[
          {
            title: '电子档案管理',
            url: '',
          },
          {
            title: '合同模板',
            url: '/templateManage/templateSet',
          },
          {
            title: sessionStorage.getItem('_status') === 'isSee' ? '查看' : '修改',
            url: '',
          },
        ]}
      >
        <div className={styles.btnArea}>
          是否启用智能撰写
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={switchStatus}
            onChange={this.switchChange}
            style={{ marginLeft: 2 }}
          />
          {!(userInfo.type === '02' && +templateDetailsParams.templateType === 0) &&
            sessionStorage.getItem('_status') === 'isSee' && (
              <Button
                onClick={this.updateTemplate}
                disabled={saveBtn}
                style={{ marginLeft: 18 }}
                loading={saveLoading}
              >
                修改模板
              </Button>
            )}
          {sessionStorage.getItem('_status') === 'isSee' ? (
            <Button
              style={{ marginLeft: 18 }}
              loading={saveLoading}
              disabled={saveBtn}
              onClick={this.useTemplate}
            >
              使用模板
            </Button>
          ) : (
            <Action code="templateSet:save">
              <Button
                onClick={this.saveTemplate}
                type="primary"
                disabled={saveBtn}
                style={{ marginLeft: 18 }}
                loading={saveLoading}
              >
                保存模板
              </Button>
            </Action>
          )}
        </div>
        <div className={styles.editArea}>
          <div id="_COX_Editor_SKD" />
        </div>
        <div className={styles.operatorArea}>
          <Card
            title=""
            style={{ marginTop: 20 }}
            headStyle={{ borderBottom: 'none', padding: '0 10px' }}
            bodyStyle={{ padding: '10px', minHeight: 800 }}
          >
            <Tabs defaultActiveKey="1" onChange={this.callback} size="small">
              <TabPane tab="标签设置" key="1">
                <div>
                  <div className={styles.method} style={{ display: more ? 'none' : 'block' }}>
                    <div>【使用说明&方法】</div>
                    {`为合同为模板设置通用标签，是为了更方便的使用这些标签做段落权限授权，您可以为团队自由选...`}
                    <div style={{ marginTop: 10 }}>
                      <a onClick={() => this.moreSet(true)}>查看更多</a>
                    </div>
                  </div>

                  <div className={styles.method} style={{ display: more ? 'block' : 'none' }}>
                    <div>【使用说明&方法】</div>
                    {`为合同模板设置通用标签，是为了更方便的使用这些标签做段落权限授权，您可以为团队自由选择是否设置标签。`}
                    <br />
                    方法：
                    <br />
                    &nbsp;&nbsp;
                    {`1.在"插入>内容控件>富文本/纯文本>设置标签"，您可以任意增加和修改标签.`}
                    <br />
                    &nbsp;&nbsp;
                    {`2.发起合同时，在段落授权中，使用这些标签，关联某些用户，这些用户将只获得该标签所包含的段落。`}
                    <div style={{ marginTop: 10 }}>
                      <a onClick={() => this.moreSet(false)}>收起</a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.labelSetBox}>
                    <div className={styles.syncBtn} onClick={this.reloadSignList}>
                      标签列表
                      <Icon type="sync" style={{ marginLeft: 10 }} />
                    </div>
                    <div className={more ? styles.tagsBox2 : styles.tagsBox1}>
                      {tags.map(item => (
                        <p key={item.id}>标签：{item.name}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab={'标签映射关系设置'} disabled={+isWrite !== 2} key="2">
                <div className={styles.mappingBox}>
                  {tags.length > 0 && tags.map(item => <p key={item.id}>{item.name}</p>)}
                </div>
                <Action code="templateSet:saveY">
                  <Button
                    style={{ margin: '10px 0 0 110px' }}
                    onClick={() => this.setMappingBox(true)}
                  >
                    映射设置
                  </Button>
                </Action>
              </TabPane>
              <TabPane tab={'权限设置'} key="3">
                <span>
                  {data.length > 0 ? (
                    <div className={styles.mappingBox}>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '5px 0' }}>
                        <Col md={16} sm={24} style={{ paddingRight: 0 }}>
                          <span>标签名称</span>
                        </Col>
                        <Col md={8} sm={24} style={{ paddingRight: 0 }}>
                          <span>用户数量</span>
                        </Col>
                      </Row>
                      {data.map(item => (
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '5px 0' }}>
                          <Col md={16} sm={24} style={{ paddingRight: 0 }}>
                            <div className={styles.signName} title={item.directoryName}>
                              {item.directoryName}
                            </div>
                          </Col>
                          <Col md={8} sm={24} style={{ paddingRight: 0, paddingLeft: 0 }}>
                            <div style={{ textAlign: 'center', color: '#4e78ee' }}>
                              {item.userNumber}
                            </div>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                  {/* {
                        (isSee && !isUpdate) ? '' :
                          <Button type={'primary'} style={{ margin: 20, float: 'right' }} onClick={() => this.permissionBoxSet(true)} >设置</Button>
                      } */}

                  <Action code="templateSet:getP">
                    <Button
                      type={'primary'}
                      style={{ margin: '10px 0 0 130px' }}
                      onClick={() => this.permissionBoxSet(true)}
                    >
                      设置
                    </Button>
                  </Action>
                </span>
              </TabPane>
            </Tabs>
          </Card>
        </div>
        <Modal
          // title="标签映射关系设置"
          visible={mappingVisible}
          mask={true}
          // onOk={() => this.saveMapping()}
          onCancel={() => this.setMappingBox(false)}
          footer={null}
          closable={false}
          destroyOnClose={true}
          width={1200}
          style={{ top: 20 }}
          headStyle={{ borderBottom: 'none' }}
        >
          <Spin spinning={shineLoading}>
            <div className={styles.container}>
              <div style={{ width: 300, height: 700 }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '5px 0' }}>
                  <Col md={24} sm={24} style={{ paddingRight: 0 }}>
                    <div style={{ marginBottom: 5 }}>文档标签</div>
                    <Checkbox
                      checked={isAll === 'isAll'}
                      style={{ marginRight: 2 }}
                      onClick={() => this.isCheckAll('isAll')}
                    />
                    全选
                    <Checkbox
                      checked={isAll === 'noAll'}
                      style={{ marginLeft: 8, marginRight: 2 }}
                      onClick={() => this.isCheckAll('noAll')}
                    />
                    全不选
                    {/* <Checkbox checked={isAll === 'recheck'} style={{ marginLeft: 8, marginRight: 2 }} onClick={() => this.isCheckAll('recheck')} />反选 */}
                  </Col>
                </Row>
                <div
                  style={{
                    height: 650,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                  }}
                >
                  <Input.Search
                    placeholder="请输入"
                    onSearch={this.onSearchL}
                    style={{ width: 280, margin: '5px 8px', height: 34 }}
                  />
                  {docxTags.length > 0 &&
                    docxTags.map((item, index) => (
                      <Row
                        key={item.id}
                        className={styles.docxTags}
                        gutter={{ md: 8, lg: 24, xl: 48 }}
                        style={{ marginLeft: 0, marginRight: 0 }}
                        onClick={() => this.setDocxTags(item, index)}
                      >
                        <Col md={18} sm={24} style={{ paddingRight: 0, paddingLeft: 8 }}>
                          <Checkbox
                            checked={checkL.includes(item.id)}
                            value={item.id}
                            style={{ marginRight: 8 }}
                            onChange={e => this.checkBoxChangeL(e, item)}
                          />
                          {item.name}
                          {/* <Tooltip placement="topLeft" title={item.text}> */}
                          <div className={styles.nameStyle} style={{ color: '#ddd', fontSize: 12 }}>
                            {item.text}
                          </div>
                          {/* </Tooltip> */}
                        </Col>
                      </Row>
                    ))}
                </div>
              </div>
              <div style={{ width: 500, height: 700 }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '5px 0' }}>
                  <Col md={24} sm={24} style={{ paddingRight: 0 }}>
                    <div style={{ marginBottom: 5 }}>标签与要素映射关联</div>
                    <a onClick={this.addPair}>添加</a>
                    <a onClick={this.delPair} style={{ marginLeft: 8 }}>
                      删除
                    </a>
                    <a style={{ marginLeft: 400 }} onClick={this.reSet}>
                      重置
                    </a>
                  </Col>
                </Row>
                <div
                  style={{
                    height: 650,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    boxShadow: '0 0 10px #ddd',
                    position: 'relative',
                  }}
                >
                  <div style={{ height: 590, overflowY: 'auto' }}>
                    <Input.Search
                      placeholder="请输入"
                      onSearch={this.onSearchM}
                      style={{ width: 280, margin: '5px 8px', height: 34 }}
                    />
                    {pair.length > 0 &&
                      pair.map(item => (
                        <Row
                          key={item.key}
                          className={styles.docxTags}
                          gutter={{ md: 8, lg: 24, xl: 48 }}
                          style={{ marginLeft: 0, marginRight: 0 }}
                        >
                          <Col
                            md={8}
                            sm={24}
                            style={{ paddingRight: 0, paddingLeft: 8 }}
                            className={styles.pairM}
                          >
                            <Checkbox
                              checked={idArr.includes(item.id)}
                              value={item.id}
                              style={{ marginRight: 8 }}
                              onClick={e => this.checkBoxChangeM(e, item.id)}
                            />
                            {item.docxTags.name}
                          </Col>
                          <Col md={2} sm={24}>
                            &
                          </Col>
                          <Col md={10} sm={24} style={{ paddingLeft: 0 }} className={styles.pairM}>
                            {item.formItems.label || item.formItems.fromName}
                          </Col>
                        </Row>
                      ))}
                  </div>
                </div>
              </div>
              <div style={{ width: 300, height: 700 }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '5px 0' }}>
                  <Col md={24} sm={24} style={{ paddingRight: 0 }}>
                    <div style={{ marginBottom: 5 }}>智能模型</div>
                  </Col>
                  <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                    <Popconfirm
                      title="将要跳转到流程配置页面，请先确认是否要保存标签映射关系？"
                      onConfirm={this.PopconfirmConfirm}
                      onCancel={this.PopconfirmCancel}
                      okText="跳转"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 5 }} href="#">
                        设置
                      </a>
                    </Popconfirm>
                  </Col>
                </Row>
                <Spin spinning={formItemLoading} size="small">
                  <div
                    style={{
                      height: 650,
                      overflowY: 'auto',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                    }}
                  >
                    <Input.Search
                      placeholder="请输入"
                      onSearch={this.onSearchR}
                      style={{ width: 280, margin: '5px 8px', height: 34 }}
                    />
                    {formItems.length > 0 &&
                      formItems.map(item => (
                        <Row
                          key={item.key}
                          className={styles.docxTags}
                          gutter={{ md: 8, lg: 24, xl: 48 }}
                          style={{ marginLeft: 0, marginRight: 0 }}
                        >
                          <Col md={18} sm={24} style={{ paddingRight: 0, paddingLeft: 8 }}>
                            <Checkbox
                              checked={itemChecked === item.key}
                              value={item.key}
                              style={{ marginRight: 8 }}
                              onChange={e => this.checkBoxChangeR(e, item)}
                            />
                            {item.label}
                          </Col>
                        </Row>
                      ))}
                  </div>
                </Spin>
              </div>
            </div>
          </Spin>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin: '15px 0' }}>
            <Col md={24} sm={24} style={{ textAlign: 'right' }}>
              <Button key="back" onClick={() => this.setMappingBox(false)}>
                取消
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={shineLoading}
                onClick={() => this.saveMapping()}
                style={{ marginLeft: 8 }}
              >
                确认
              </Button>
            </Col>
          </Row>
        </Modal>

        <Modal
          title="权限设置"
          onCancel={() => this.permissionBoxSet(false)}
          visible={permissionVisible}
          destroyOnClose={true}
          width={900}
          // closable={false}
          footer={null}
          headStyle={{ borderBottom: 'none' }}
        >
          <Table
            columns={columns}
            bordered={true}
            dataSource={data}
            pagination={false}
            loading={permissionLoading}
          />
        </Modal>

        <Modal
          // title="段落权限授权"
          visible={staffVisible}
          onOk={() => this.set(false)}
          onCancel={() => this.set(false)}
          footer={null}
          width={800}
        >
          <Spin spinning={staffLoading}>
            <Transfer
              dataSource={allKeys}
              titles={['备选待授权人员', '已选被授权人员']}
              operations={['审批入库', '撤消入库']}
              // showSearch
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={this.staffChange}
              onSelectChange={this.selectChange}
              render={item => item.title}
              listStyle={{
                width: 300,
                height: 400,
              }}
            />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0 }}>
              <Col md={24} sm={24} style={{ marginTop: 20 }}>
                <div className={styles.openQueryBtn}>
                  <Button onClick={() => this.set(false, '')}>关闭</Button>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.staffSave}>
                    保存
                  </Button>
                </div>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </PageContainers>
    );
  }
}

export default Index;

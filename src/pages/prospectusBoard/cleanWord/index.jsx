import React, { Component } from 'react';
import { message, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { getNginxIP } from '@/services/prospectuSet';
import request from '@/utils/request';
// 权限参数
let unitParameters = {
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
    name: '',
  },
};
// 页面样式参数
const cssParameters = {
  height: '800px',
  width: '100%',
  type: 'desktop', // desktop PC端 mobile 移动端
};
// 1.	提取当前文档所有内容域的标题、标签名称、id
const OBJECT = {
  object: 'content', // /操作内容域，必填项
  type: 'text', // 提取内容域属性，必填项
  name: '', // 提取指定标签名称内容域的属性，和id互斥，优先级高于id,如name及id都未填写，则获取当前文档全部内容域
  id: '', // 提取指定id内容域的属性，和name互斥,优先级低于id,如name及id都未填写，则获取当前文档全部内容域
};

let cx = {};
class Index extends Component {
  state = {
    IPObject: {},
    templateDetailsParams: {},
    userInfo: {},
    templateKey: '',
    tags: [],
  };

  renderCXEditor = (fileType, title, url, key) => {
    console.log('renderCXEditor-params:', fileType, title, url);
    console.time('文档加载时间');
    const { IPObject, userInfo, templateDetailsParams } = this.state;
    let cxo_config = {
      // type: 'embedded',
      document: {
        fileType, // 指明要打开的文档的类型
        // key, // 文档唯一ID
        title, // 文档标题
        url, // 文件存放路径
        permissions: {
          // permissions 文档权限  (permissions.edit和permissions.review 与 mode的值有关
          download: unitParameters.download, // 是否可下载
          edit: true, // 是否可编辑 true 可编辑 false 只读
          print: unitParameters.print, // 是否可打印
          review: false, // 是否可修订
          copyoutenabled: unitParameters.copyoutenabled, // 是否可复制编辑器里的内容
          commentFilter: unitParameters.commentFilter, // 批注权限
        },
      },
      documentType: this.getDocumentType(fileType), // 指明文档类型 如 word excel
      editorConfig: {
        callbackUrl: `${IPObject.gateWayIp}/ams/ams-file-service/businessArchive/callbackUpdateFile`,
        customization: {
          about: true,
          chat: unitParameters.chat,
          comments: unitParameters.comments,
          zoom: unitParameters.zoom,
          leftMenu: true,
          rightMenu: unitParameters.rightMenu,
          toolbar: true,
          header: unitParameters.header,
          statusBar: false,
          autosave: false, //自动保存
          forcesave: true, //强制保存
          logo: {
            image: '',
          },
        },
        mode: 'edit',
        user: {
          id: userInfo?.id + '', //  id 一定要string类型
          name: userInfo?.username,
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
    // message.success('编辑器加载完成');
  };

  onDocumentReady = () => {
    message.success('文档加载完成');
    console.timeEnd('文档加载时间');
    cx.getDocumentContent(OBJECT);
  };

  onError = event => {
    if (event.data.errorCode == 'forcesave') {
      JSON.parse(event.data.errorDescription).error == 0 && message.warning('清洁版文档不支持保存');
    } else {
      message.error(`编辑器错误: code ${event.data.errorCode}, 描述 ${event.data.errorDescription}`);
    }
  };

  onRequestClose = () => {
    if (window.opener) {
      window.close();
      return;
    }
    cx.destroyEditor();
  };

  onWarning = event => {
    message.warn(`编辑器警告: code ${event.data.warningCode}, 描述 ${event.data.warningDescription}`,);
  };

  onDocumentStateChange = () => { };

  onDownloadAs = event => {
    console.log(event);
    // router.push('/contract/instructionsBoard');
  };
  onGetDocumentContent = event => {
    let tags = event.data.text;
    this.setState({
      tags,
    }, () => {
      this.cleanWord()
    })
  };
  cleanWord = () => {
    this.state.tags.forEach(item=>{
      cx.setDocumentContent({
        object: 'content',
        type: 'remove',
        name: item.name,
        id: item.id
      })
    })
  }
  appendJQCDN = apiSrc => {
    let _this = this;
    let head = document.head || document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.setAttribute('src', apiSrc);
    head.appendChild(script);
    // 判断外部js是否加载完成
    script.onload = script.onreadystatechange = function () {
      if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        const { IPObject, templateKey, templateDetailsParams } = _this.state;
        _this.renderCXEditor(
          templateDetailsParams?.type,
          templateDetailsParams?.templateName || templateDetailsParams?.fileName,
          templateDetailsParams.url,
          templateKey
        );
      }
      script.onload = script.onreadystatechange = null;
    };
  };

  componentDidMount() {
    cx.destroyEditor && cx.destroyEditor();
    const templateDetailsParams = JSON.parse(sessionStorage.getItem('templateDetailsParams'));
    this.setState({
      templateDetailsParams,
      userInfo: JSON.parse(sessionStorage.getItem('USER_INFO')),
    }, () => {
      // 文档key 改为 使用文档的流水号  不再使用uuid生成
      let templateKey = templateDetailsParams.fileNumber;
      console.log(templateDetailsParams)
      this.setState({ templateKey }, () => {
        getNginxIP().then(res => {
          if (res?.status === 200) {
            this.appendJQCDN(res.data.jsApi);
            this.setState({ IPObject: res.data });
          }
        });
      });
    });
  }

  componentWillUnmount() {
    cx.destroyEditor && cx.destroyEditor();
    sessionStorage.removeItem('_templateKey');
    sessionStorage.removeItem('templateDetailsParams');
  }
  goBack (event) {
    event.preventDefault();
    history.go(-1);
  }
  render() {
    return (
      <div >
       {/* <Row>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Space size={20}>
                <a href="#" onClick={this.goBack}> <LeftOutlined /> 返回 </a>
                <a href="/base/processCenterHome"> 首页 </a>
              </Space>
            </Breadcrumb.Item>
            <Breadcrumb.Item>招募说明书</Breadcrumb.Item>
            <Breadcrumb.Item>招募说明书看板</Breadcrumb.Item>
          </Breadcrumb>
        </Row> */}
        <div style={{ width: '100%', padding: '12px', background: '#ffffff' }}>
          <div id="_COX_Editor_SKD"></div>
        </div>
      </div>
    );
  }
}

export default Index;

/**
 * 在线编辑 暂定文档仅预览 需要传4个参数
 * fileType(文档类型 例如‘docx’),
 * key(文档唯一key),
 * title(指定在编辑器中显示的文档名称 例如‘测试文档.docx’),
 * url(指定文档的路径)
 */
import React, { useEffect } from 'react';
import { errorBoundary } from '@/layouts/ErrorBoundary';

let cx = {};

// 权限参数
const unitParameters = {
  download: false, // 下载
  edit: false, // 编辑
  print: false,
  review: false, // 修订
  copyoutenabled: false, // 是否可以复制编辑器里的内容
  commentFilter: {
    // 批注设置
    type: 'Default', // Default 全部可见 NoDisplay 全部不可见  DisplaySection 部分可见 NoDisplaySection 部分不可见
    userList: [], // 设置可以看见批注人员的id
  },
  chat: false, // 聊天菜单
  comments: false,
  zoom: -2, // 缩放 默认100
  leftMenu: false, // 左侧菜单  主要操作 搜索、文档结构(目录)、批注、聊天
  rightMenu: false, // 右侧菜单  主要操作 行间距、段间距、背景色、标签、边距等
  toolbar: false, // 上边菜单  所有的操作(包含左右菜单的所有功能)
  header: false,
  statusBar: true, // 下边菜单 主要操作 缩放、修订、显示总页数和当前页
  autosave: false,
  forcesave: false, // 强制保存
  mode: 'edit', // view 只读  edit 编辑
  user: {
    id: '',
    name: '',
  },
  limitEditMode: 'nolimit',
};
// 页面样式参数
const cssParameters = {
  height: '100%',
  width: '100%',
  type: 'desktop', // desktop PC端 mobile 移动端
};

export const getDocumentType = ext => {
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

const OnlineEdit = ({ fileType, _key, title, url }) => {
  const appendJQCDN = apiSrc => {
    return new Promise((res, rej) => {
      const head = document.head || document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.setAttribute('src', apiSrc);
      head.appendChild(script);
      res();
    });
  };

  const renderCXEditor = (fileType, key, title, url) => {
    console.time('文档加载时间');
    const cxo_config = {
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
        usePdfjs: false,
      },
      documentType: getDocumentType(fileType), // 指明文档类型 如 word excel
      editorConfig: {
        // plugins: {
        //   autostart: ['asc.{EF5735E0-69A7-4D4A-9ABE-F58FD70F4ZZ}'],
        //   pluginsData: [
        //     // "http://39.96.11.1:10002/config.json"
        //     `${PORT}/config.json`,
        //   ],
        // },
        // callbackUrl: `${PORT}/ams/ams-base-contract/personalversion/callbackadd`,
        customization: {
          about: false,
          chat: unitParameters.chat,
          comments: unitParameters.comments,
          // zoom: unitParameters.zoom,
          leftMenu: unitParameters.leftMenu,
          rightMenu: unitParameters.rightMenu,
          toolbar: unitParameters.toolbar,
          header: unitParameters.header,
          statusBar: unitParameters.statusBar,
          autosave: unitParameters.autosave,
          forcesave: unitParameters.forcesave,
          logo: {
            image: '',
          },
        },
        mode: 'view',
        user: unitParameters.user,
        templates: [],
        limitEditMode: unitParameters.limitEditMode,
      },
      events: {
        onAppReady,
        onDocumentReady,
        onError,
        onRequestClose,
        onWarning,
      },
      height: cssParameters.height,
      width: cssParameters.width,
      type: cssParameters.type,
    };

    cx = new CXO_API.CXEditor('COX_Editor_SKD', cxo_config);
  }; //  在线编辑

  const onAppReady = () => {
    message.success('编辑器加载完成');
  };

  const onDocumentReady = () => {
    message.success('文档加载完成');
    console.timeEnd('文档加载时间');
  };

  const onError = event => {
    message.error(`编辑器错误: code ${event.data.errorCode}, 描述 ${event.data.errorDescription}`);
  };

  const onRequestClose = () => {
    if (window.opener) {
      window.close();
      return;
    }
    cx.destroyEditor();
  };

  const onWarning = event => {
    message.warn(
      `编辑器警告: code ${event.data.warningCode}, 描述 ${event.data.warningDescription}`,
    );
  };

  useEffect(() => {
    setTimeout(() => {
      renderCXEditor(fileType, _key, title, url);
    }, 2000);
  }, []);

  return (
    <div id="preview" style={{ height: '100%' }}>
      <div id="COX_Editor_SKD" />
    </div>
  );
};

const WrappedSingleForm = errorBoundary(OnlineEdit);

export default WrappedSingleForm;

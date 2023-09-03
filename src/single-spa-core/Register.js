import * as singleSpa from 'single-spa';
import { GlobalEventDistributor } from './GlobalEventDistributor';
import projectConfig from '../../projects.config';

const globalEventDistributor = new GlobalEventDistributor();

const runCss = async url => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.onload = resolve;
    link.onerror = reject;
    const firstLink = document.getElementsByTagName('link')[0];
    firstLink.parentNode.insertBefore(link, firstLink);
  });
};

// 普通路径模式
export function pathPrefix(app) {
  return location => {
    let isShow = false;
    // 如果该应用 有多个需要匹配的路劲
    if (isArray(app.path)) {
      app.path.forEach(path => {
        if (location.pathname.indexOf(`${path}`) === 0) {
          isShow = true;
        }
      });
    }
    // 普通情况
    else if (location.pathname.indexOf(`${app.path || app.url}`) === 0) {
      isShow = true;
    }
    return isShow;
  };
}

export async function registerApp(params) {
  // 导入store模块
  let storeModule = {};
  let customProps = { globalEventDistributor };

  // 尝试导入store
  try {
    storeModule = params.store
      ? await window.SystemJS.import(params.store)
      : { storeInstance: null };
  } catch (e) {
    console.log(`Could not load store of app ${params.name}.`, e);
    // 如果失败则不注册该模块
    return;
  }
  // 注册应用于事件派发器
  if (storeModule.storeInstance && globalEventDistributor) {
    // 取出 redux storeInstance
    customProps.store = storeModule.storeInstance;

    // 注册到全局
    globalEventDistributor.registerStore(storeModule.storeInstance);
  }

  // 准备自定义的props,传入每一个单独工程项目
  customProps = { store: storeModule, globalEventDistributor };
  if (singleSpa.getAppNames().includes(params.name)) return;
  singleSpa.registerApplication(
    params.name,
    async () => {
      // 首先加载应用全局依赖
      if (params.dependencies) {
        for (let i = 0; i < params.dependencies.length; i++) {
          const itm = params.dependencies[i];
          if (itm.indexOf('.css') > 0) {
            runCss(itm);
          } else {
            await window.SystemJS.import(itm);
          }
        }
      }
      // return window.SystemJS.import(params.main);
      if (typeof params.main === 'object') {
        return params.main.map(item => window.SystemJS.import(item));
      }
      return window.SystemJS.import(params.main);
    },
    pathPrefix(params),
  );
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

export async function bootstrap() {
  projectConfig.forEach(app => {
    registerApp(app);
  });
  singleSpa.start();
}

export async function unBootstrap() {
  singleSpa.getMountedApps(neme => singleSpa.unloadApplication(neme));
}

export { singleSpa };

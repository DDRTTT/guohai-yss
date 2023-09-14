import {IConfig, IPlugin} from 'umi-types';
import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import routerConfig from './router.config';
import theme from './theme';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const plugins: IPlugin[] = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
        immer: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 10,
      },
      dll: true,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  // ['umi-plugin-antd-theme', themePluginConfig],
];

export default {
  devtool: 'source-map',
  treeShaking: true,
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: routerConfig,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    ...theme,
  },
  define: {},
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
    // modifyVars: {
    //   "@primary-color": "#2450A5",
    //   "@ant-prefix": "ant4"
    // }
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  // extraBabelPlugins: [
  //   // 引入AntD3样式
  //   [
  //     'import',
  //     {
  //       libraryName: 'antd',
  //       libraryDirectory: 'es',
  //       style: true,
  //     },
  //   ],
  //   // 引入AntD4样式
  //   [
  //     'import',
  //     {
  //       libraryName: 'antd4',
  //       libraryDirectory: 'es',
  //       style: true,
  //     },
  //     'import-antd4', // 用了两次 babel-plugin-import，加个key，防止babel报错
  //   ]
  // ],
  manifest: {
    basePath: '/',
  },
  proxy,
  chainWebpack: webpackPlugin,
} as IConfig;

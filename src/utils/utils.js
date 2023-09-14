import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Tooltip } from 'antd';
import { getSession, USER_MENU } from '@/utils/session';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function isEmptyObject(obj) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
}

// JSON格式化
export function formatJson(json, options) {
  try {
    let reg = null;
    let formatted = '';
    let pad = 0;
    const PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket =
      options.newlineAfterColonIfBeforeBraceOrBracket === true;
    options.spaceAfterColon = options.spaceAfterColon !== false;

    if (typeof json !== 'string') {
      json = JSON.stringify(json);
    } else {
      json = JSON.parse(json);
      json = JSON.stringify(json);
    }

    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g;
      json = json.replace(reg, ':{');
      reg = /\:\r\n\[/g;
      json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
      reg = /\:/g;
      json = json.replace(reg, ':');
    }

    const jsonsplit = json.split('\r\n');
    for (let s = 0; s < jsonsplit.length; s++) {
      const node = jsonsplit[s];
      let i = 0;
      let indent = 0;
      let padding = '';
      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1;
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else {
        indent = 0;
      }
      for (i = 0; i < pad; i++) {
        padding += PADDING;
      }
      formatted += `${padding + node}\r\n`;
      pad += indent;
    }

    /* (json.split('\r\n')).forEach(function (node, index){
     var i = 0,
               indent = 0,
               padding = '';
           if (node.match(/\{$/) || node.match(/\[$/)) {
               indent = 1;
           } else if (node.match(/\}/) || node.match(/\]/)) {
               if (pad !== 0) {
                   pad -= 1;
               }
           } else {
               indent = 0;
           }
           for (i = 0; i < pad; i++) {
               padding += PADDING;
           }
           formatted += padding + node + '\r\n';
           pad += indent;
    }); */
    return unescape(formatted.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
  } catch (e) {
    return json;
  }
}

// 日期 xxxx-xx-xx
/*
前天： getDateStr(-2);
昨天： getDateStr(-1);
今天： getDateStr(0);
明天： getDateStr(1);
后天： getDateStr(2);
 */
export function getDateStr(AddDayCount, bool = true) {
  const dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
  const year = dd.getFullYear();
  const mon = dd.getMonth() + 1; // 获取当前月份的日期
  const day = dd.getDate();
  return bool
    ? `${year}-${mon < 10 ? `0${mon}` : mon}-${day < 10 ? `0${day}` : day}`
    : `${year}${mon < 10 ? `0${mon}` : mon}${day < 10 ? `0${day}` : day}`;
}

// 判断是否为数组
export function isArray(i) {
  return Object.prototype.toString.call(i) === '[object Array]';
}

export function getSumWidth(obj) {
  let val = 0;
  for (const i of obj) {
    if ('width' in i) val += i.width;
  }
  return val;
}

// 获取动态操作列的宽度
export function getDynamicOptColWidth() {
  return document.querySelector('.ant-table-fixed-right').clientWidth;
}

// uuid
export function uuid() {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  return s.join('');
}

// 根据文件后缀名返回畅写编辑器 documentType 属性值
export const getDocumentType = (ext) => {
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

/**
 * 删除没用的属性
 *
 * @var  {[object]} obj
 */
export const deletNUllProperty = obj => {
  for (const key in obj) {
    if (
      String(obj[key]).length <= 0 ||
      JSON.stringify(obj) === '{}' ||
      typeof obj === 'undefined' ||
      obj == null
    ) {
      delete obj[key];
    }
  }
};

// 全屏 TODO：固定了id，要动态
export const launchIntoFullscreen = () => {
  const element = document.getElementById('preview');
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

// 取消全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

// 向头部插入js文件
export const appendJs = src => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.setAttribute('src', src);
  head.appendChild(script);
};

// 截取url中指定的参数值
export const getUrlParams = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const param = window.location.search.substr(1).match(reg);
  return param && param[2];
};

// 获取字节长度（一个汉字两个字节）
export const getByteLen = val => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    const a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};

// antDesign表单校验
export const handleValidator = (value, callback, len, text) => {
  if (!value) {
    callback();
  } else if (getByteLen(value) > len) {
    callback(text);
  } else {
    callback();
  }
};

// 组织机构代码
export const orgCodeValidate = value => {
  if (value !== '') {
    const values = value.split('-');
    const ws = [3, 7, 9, 10, 5, 8, 4, 2];
    const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const reg = /^([0-9A-Z]){8}$/;
    if (!reg.test(values[0])) {
      return true;
    }
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += str.indexOf(values[0].charAt(i)) * ws[i];
    }
    let C9 = 11 - (sum % 11);
    const YC9 = `${values[1]}`;
    if (C9 === 11) {
      C9 = '0';
    } else if (C9 === 10) {
      C9 = 'X';
    } else {
      C9 += '';
    }
    return YC9 !== C9;
  }
};

/** 处理table每一个td省略号
 * @param {string}  text 列表展示数据
 * */
export const handleTableCss = text => {
  return (
    <Tooltip title={text} placement="topLeft">
      <span
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          width: '100%',
          paddingTop: '5px',
        }}
      >
        {text}
      </span>
    </Tooltip>
  );
};
// 递归获取json中数据
export const recursiveGetData = (data, key) => {
  if (!data) return;
  const arr = [];
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (Array.isArray(item[key])) {
        arr.push(recursiveGetData(item[key], key));
      } else {
        arr.push(item);
      }
    });
  } else if (Array.isArray(data[key])) {
    data[key].forEach(item => {
      if (Array.isArray(item[key])) {
        arr.push(recursiveGetData(item[key], key));
      } else {
        arr.push(item);
      }
    });
  } else {
    arr.push(data);
  }
  return arr;
};

/**
 * 递归遍历树，查找指定字段所在的对象并删除对象
 * @param {Array} tree
 * @param {string} flag
 * @param {any} hiddenType
 * @returns {Array} tree
 */
export const handleChooseTree = (tree = [], flag, hiddenType) => {
  let len = tree.length;
  for (let i = 0; i < len; i++) {
    if (!len) return;
    const item = tree[i];
    if (item[flag] === hiddenType) {
      tree.splice(i, 1);
      i--;
      len--;
    } else if (item.children) {
      handleChooseTree(item.children, flag, hiddenType);
    }
  }
  return tree;
};

export const arrayFindDeep = (arr = [], key, value) => {
  if (Array.isArray(arr)) {
    for (let i = arr.length - 1; i >= 0; --i) {
      const item = arr[i];
      if (item[key] === value) {
        return item;
      }
      if (item.children) {
        const menu = arrayFindDeep(item.children, key, value);
        if (menu) {
          return menu;
        }
      }
    }
  }
};

/**
 * 判断数组中对象，指定key是否重复
 * @returns {boolean} boolean
 * @param {object[]} data 判断数组
 * @param {string} judgmentKey 指定判断的key
 */
export const handleArrayJudgment = (data = [], judgmentKey) => {
  const a = data.map(value => value[judgmentKey]);
  const b = new Set(a);
  return b.size !== a.length;
};

export function formatParams(obj) {
  const array = [];
  if (obj !== '' || obj !== undefined) {
    for (const key in obj) {
      for (const par in queryParams) {
        if (key.indexOf(queryParams[par]) == 0 && obj[key] !== undefined && obj[key] !== '') {
          if (par == 'GELE') {
            const fistvalue = creatParams(
              key.substring(queryParams[par].length + 1),
              obj[key][0].format('YYYY-MM-DD HH:mm:ss'),
              'GREATERTHANEQUAL',
              'DATE',
            );
            const lastvalue = creatParams(
              key.substring(queryParams[par].length + 1),
              obj[key][1].format('YYYY-MM-DD HH:mm:ss'),
              'LESSTHANEQUAL',
              'DATE',
            );
            array.push(fistvalue);
            array.push(lastvalue);
          } else {
            const someone = creatParams(
              key.substring(queryParams[par].length + 1),
              obj[key],
              queryParams[par],
            );
            array.push(someone);
          }
        }
      }
    }
  }
  return array;
}

function creatParams(paramKey, paramValue, condition, paramProperty) {
  return { paramKey, paramValue, condition, paramProperty };
}

// 下拉框根据输入值模糊匹配
export const filterOption = (input, option) => {
  const label = option.props.children;
  const { value } = option.props;
  return (
    label
      .toString()
      .toLowerCase()
      .includes(input.toLowerCase()) ||
    value
      .toString()
      .toLowerCase()
      .includes(input.toLowerCase())
  );
};

// 获取当前页面的title
export function currentMenuTitle(paramTitle) {
  try {
    const menu = JSON.parse(getSession(USER_MENU));
    const currentPath = window.location.pathname.replace(/^\//, '');
    const { title } = arrayFindDeep(menu, 'path', currentPath);
    return title;
  } catch (e) {
    return paramTitle;
  }
}

/**
 * 根据传入的词汇数据，返回相应字符
 * @param {any[]} data 数据源
 * @param {string} code 代码
 * @param {string} name 判断字段
 * @returns {string} 返回相应字符
 */
export const utilsCodeToName = (data, code, name) => {
  let codeArr = typeof code === 'string' ? code.split(',') : [`${code}`];
  let str = '';
  data.map(d =>
    codeArr.map(c => {
      if (d.code === c) {
        str += `${d[name]} `;
      }
    }),
  );
  return str;
};

/**
 * 根据传入的 组件类型 英文名称，返回对应中文名称
 * @param {string} code 英文名称
 * @param {string} name 中文名称
 */
export const exChangeWidgetType = code => {
  let name = '';
  switch (code) {
    case 'text':
      name = '单行文本';
      break;
    case 'textarea':
      name = '多行文本';
      break;
    case 'select':
      name = '下拉选择器';
      break;
    case 'number':
      name = '数字';
      break;
    case 'time':
      name = '时间';
      break;
    case 'date':
      name = '日期';
      break;
    case 'datetime':
      name = '日期时间';
      break;
    case 'datetimerange':
      name = '日期时间域';
      break;
    case 'radioGroup':
      name = '单选框组';
      break;
    case 'checkboxGroup':
      name = '多选框组';
      break;
    default:
      name = '';
  }
  return name;
}

// 千分位
export function thousandthFormatter(value) {
  let currency = value + '';
  let result = 0;
  if (currency) {
    // 对整数部分进行千分位格式化.
    for (let i = 0; i < Math.floor((currency.length - (1 + i)) / 3); i++) {
      currency =
        currency.substring(0, currency.length - (4 * i + 3)) +
        ',' +
        currency.substring(currency.length - (4 * i + 3));
    }
    result = currency;
  }
  return result;
}


// 参数转换函数，用于将参数对象转化为流程模板参数数组
export function transDataToParams(dataObj, keyList) {
  const queryParams = [];
  for(const key in dataObj){
    if(keyList.find(key)){
      const value = dataObj[key] instanceof Array ? dataObj[key].toString() : dataObj[key];
      queryParams.push({
        code: key,
        value
      });
    }
  }
  return queryParams;
}

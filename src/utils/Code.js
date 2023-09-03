Date.prototype.Format = function(fmt) {
  // author: meizz
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
  return fmt;
};

// export const ENCRYPTED_PASSWORD = `YssAms${new Date().Format('yyyyMMdd')}`;
// 获取的有当前日期为避免隔夜日期失效，将变量替换为函数
export function ENCRYPTED_PASSWORD(){
  return `YssAms${new Date().Format('yyyyMMdd')}`
}


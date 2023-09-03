import CryptoJS from 'crypto-js';
import { hex_md5 } from './MD5';

/**
 * 通过MD5算法获得用于进行数据加密/解密的16密码信息
 * @param password 业务定义的明文密码信息
 * @returns {*}
 */

function getMD5Pwd(password) {
  let md5Value = hex_md5(password);
  // 将md5值进行大写转换
  md5Value = md5Value.toUpperCase();
  // 对MD5值进行数据截取，得到16的密码内容
  return md5Value.substring(8, 24);
}

/**
 * 数据加密
 * @param word 待加密的源数据内容
 * @param pwd  经过MD5处理后得到用于加密的16位密码信息
 * @returns {*}
 */
function encrypt(word, pwd) {
  const key = CryptoJS.enc.Utf8.parse(pwd);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * 数据解密
 * @param word 待解密的源数据内容
 * @param pwd  经过MD5处理后得到用于加密的16位密码信息
 * @returns {*}
 */
function decrypt(word, pwd) {
  const key = CryptoJS.enc.Utf8.parse(pwd);
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// 加密入口函数
export function encryptText(plain, plainPwd) {
  const md5plainPwd = getMD5Pwd(plainPwd);
  const encrypted = encrypt(plain, md5plainPwd);
  return encryptFormat(encodeURI(encrypted));
}

// 解密入口函数
export function decryptText(encrypted, todecryptPwd) {
  const md5todecryptPwd = getMD5Pwd(todecryptPwd);
  return decrypt(decryptFormat(encrypted), md5todecryptPwd);
}

// 加密数据格式化
function encryptFormat(enContent) {
  enContent = enContent.replace(/\r\n/g, '_r');
  enContent = enContent.replace(/\//g, '_a');
  enContent = enContent.replace(/\+/g, '_b');
  enContent = enContent.replace(/\=/g, '_c');
  enContent = enContent.replace(/\n/g, '_n');
  return enContent;
}

// 解密数据格式化
function decryptFormat(deContent) {
  deContent = deContent.replace(/_r/g, '\r\n');
  deContent = deContent.replace(/_a/g, '/');
  deContent = deContent.replace(/_b/g, '+');
  deContent = deContent.replace(/_c/g, '=');
  deContent = deContent.replace(/_n/g, '\n');
  return deContent;
}

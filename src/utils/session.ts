/**
 *Create on 2020/6/20.
 */
export const AUTH_TOKEN = 'auth_token';
export const USER_MENU = 'USER_MENU';
export const USER_INFO = 'USER_INFO';
export const MOCK = 'MOCK';
export const PRODUCT = 'PRODUCT';
export const SYSID = 'SYSID';

/**
 * 获取本地token
 * @method  getAuthToken
 * @return  {string} auth_token
 */
export const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN);

/**
 * 设置本地token
 * @method  setAuthToken
 * @param   {string} payload
 */
export const setAuthToken = (payload: string) => sessionStorage.setItem(AUTH_TOKEN, payload);

/**
 * 移除本地token
 * @method  setAuthToken
 */
export const removeAuthToken = () => sessionStorage.removeItem(AUTH_TOKEN);

/**
 * 设置本地用户信息
 * @method setUserInfo
 * @param {object} payload
 */
export const setUserInfo = (payload: string) => sessionStorage.setItem(USER_INFO, payload);

/**
 * 获取本地用户信息
 * @method setUserInfo
 */
export const getUserInfo = () => sessionStorage.getItem(USER_INFO);

/**
 * 设置本地Menu
 * @method  setMenu
 * @param   {string} parameters
 */
export const setMenu = (parameters: string) => sessionStorage.setItem(USER_MENU, parameters);

/**
 * 获取本地菜单
 * @method  getMenu
 * @return  {string}
 */
export const getMenu = () => sessionStorage.getItem(USER_MENU);

/**
 * 清空所有sessionStorage
 * @method  removeAllSession
 */
export const removeAllSession = () => sessionStorage.clear();

/**
 * 设置sessionStorage
 * @method  setSession
 * @param   {string} name
 * @param   {string} parameters
 */
export const setSession = (name: string, parameters: string) =>
  sessionStorage.setItem(name, parameters);

/**
 * 获取设置sessionStorage
 * @method  getSession
 * @param   {string} parameters key
 */
export const getSession = (parameters: string) => sessionStorage.getItem(parameters);

/**
 * 获取sysId
 * @method  getSys
 */
export const getSys = () => sessionStorage.getItem(SYSID);

/**
 *Create on 2020/9/21.
 *版本变量
 */

import guoHaiLogo from '@/assets/login/img_logo_gh.png';
import yssLogo from '@/assets/login/yys_logo.png';
import taikangLogo from '@/assets/login/taikang_logo.png';

// const version = 'taiKang';
// const version = 'guoHai';
const version = 'yss';

const LOGINTITLE = 'LOGINTITLE';
const LOGO = 'LOGO';
const ICON = 'ICON';

const guoHai = {
  [LOGINTITLE]: '资管业务管理平台',
  [ICON]: '',
  [LOGO]: guoHaiLogo,
};

const yss = {
  [LOGINTITLE]: '产品生命周期平台',
  [ICON]: '',
  [LOGO]: yssLogo,
};

const taiKang = {
  [LOGINTITLE]: '资管业务管理平台',
  [ICON]: '',
  [LOGO]: taikangLogo,
};

const loginEnv = version === 'yss' ? yss : guoHai;
// const loginEnv = taiKang;

export default loginEnv;

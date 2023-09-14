const yAdmin = `/yss-base-admin`;
const yParameter = `/ams-base-parameter`;
const aProduct = `/ams-base-product`;
const yLog = `/yss-base-log`;

// 导出菜单
export const EXPORT_MENU_API: string = `${yAdmin}/menu/download`;

// 词汇字典
export const DATA_DICTIONARY_API: string = `${yParameter}/datadict/queryInfoByList`;

// 根据用户的sysId查询对应系统的映射信息
export const GET_SYS_USER_INFO_API: string = `${yAdmin}/user/getSysUserInfo`;

// 获取用户拥有的系统
export const GET_USER_SYSID_API: string = `${yAdmin}/user/getUserSysIds`;

// 单点登录系统返回/workspace的时候，根据其他系统返回用户userid和所在系统sysid，获取新的token
export const GET_REFRESH_TOKEN_API: string = `${yAdmin}/jwt/getRefreshToken`;

// 每次跳回到工作台都请求一次token，为了兼容单点登录到其他系统时间过长，token过期问题
export const GET_REFRESH_TOKEN_WITH_USERID_API: string = `${yAdmin}/jwt/oauthtokenfeign`;

// 获取产品类树
export const GET_PRO_TREE_API: string = `${aProduct}/product/getauthorizprotypetreeGLA`;

// 获取我的产品分组
export const GET_PRO_GROUP_API: string = `${yAdmin}/productgroup/getprogroup`;

// 条件查询产品-分页
export const GET_PRO_PAGINATION_API: string = `${yAdmin}/userproduct/selectproGLA`;

// 校验分组下是否有产品
export const CHECK_GROUP_API: string = `${yAdmin}/productgroupinfo/checkgroup`;

// 添加/修改分组
export const ADD_GROUP_API: string = `${yAdmin}/productgroup/saveprogroup`;

// 获取全部产品code
export const GET_ALL_PRO_CODE_API: string = `${yAdmin}/userproduct/selectprocode`;

// 删除分组
export const DELETE_GROUP_API: string = `${yAdmin}/productgroup/delprogroup`;

// 便捷授权保存
export const SAVE_QUICK_AUTH_API: string = `${yAdmin}/role/setGLAAuthProduct?quickFlag=1`;

// 便捷授权详情
export const QUICK_AUTH_DETAIL_API: string = `${yAdmin}/userproduct/getGLAuserauthed?quickFlag=1`;

// 查询分组中产品
export const GET_GROUP_PRO_API: string = `${yAdmin}/productgroupinfo/getgroupproduct`;

// 查询底稿类型树
export const GET_DG_PRO_TREE_API: string = `${yAdmin}/user/getUserAuthProjectTypes`;

// 条件查询底稿产品-分页
export const GET_DG_PRO_PAGINATION_API: string = `${yAdmin}/user/getUserAuthProjects`;

// ES对比日期查询
export const GET_ES_BOOL_LIST_API: string = `${yLog}/es/boolList`;

// ES对比查询
export const GET_ES_QUERY_BY_ID_API: string = `${yLog}/es/queryIds`;

// 获取项目名称和Logo
export const GET_PROJECT_INFO_API: string = `${yAdmin}/jwt/getSysLogoInfo`;

// 加密查询
export const GET_ENCRYPTION_API: string = `/dynamicRoute/sysConfig`;

/**
 *Create on 2020/6/20.
 */

/**
 * mock环境 ：mock
 * 联调环境  ：dev
 * @type {string}
 */

export const Environment = 'dev';

const getEnvironment = () => Environment === 'dev';

export default getEnvironment;

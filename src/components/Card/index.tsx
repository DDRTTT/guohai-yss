import React from 'react';
import { Card } from 'antd';
import Title from './components/title';
import { currentMenuTitle } from '@/utils/utils';
import styles from './index.less';

// 未设置title的时候，使用菜单名称
// 设置false的时候不显示title
// 设置title的时候，为设置的值
const CardProvider: React.FC<{
  title?: any;
  default?: any;
  defaultTitle?: any;
}> = ({ title, defaultTitle, ...ret }) => {
  let props;
  if (title || title === undefined) {
    props = {
      ...ret,
      title: title ? (defaultTitle ? <Title currentTitle={title}/> : <Title currentTitle={currentMenuTitle(title)}/>) : "",
      // title: <Title currentTitle={currentMenuTitle(title)}/>,
    };
  }

  if (title === false) {
    props = { ...ret };
  }

  return (
    <div className={ret.default ? '' : styles.customizeCard}>
      <Card {...props} />
    </div>
  );
};

export default CardProvider;

import React from 'react';
import { Avatar, List, Divider } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  onMore,
  title,
  locale,
  emptyText,
  emptyImage,
  loading,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list} loading={loading}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    {/* <div className={styles.description} title={item.description}>
                      {item.description}
                    </div>
                    <div className={styles.datetime}>{item.datetime}</div> */}
                    <div className={styles.datetime}>{item.content}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.clear}>
        <div onClick={onClear}>
          {locale.clear}
          {title}
        </div>
        <div onClick={onMore}>{locale.viewMoreText}</div>
      </div>
    </div>
  );
}

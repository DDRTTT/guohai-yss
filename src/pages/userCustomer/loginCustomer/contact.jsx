import { Icon } from 'antd';
import React, { Component } from 'react';
import styles from './style.less';
import classNames from 'classnames';

const About = () => {
  const list = [
    {
      bizName: '业务类型',
      depName: '部门名称',
      resBiz: '负责业务',
      phone: '131 0000 0000',
      email: 'xxxxxxx@ysstech.com',
    },
    {
      bizName: '业务类型',
      depName: '部门名称',
      resBiz: '负责业务',
      phone: '132 0000 0000',
      email: 'xxxxxxx@ysstech.com',
    },
    {
      bizName: '业务类型',
      depName: '部门名称',
      resBiz: '负责业务',
      phone: '132 0000 0000',
      email: 'xxxxxxx@ysstech.com',
    },
  ];

  return (
    <div className={styles.aboutContent}>
      <div className={styles.title}>
        <div className={styles.left}>
          <div className={styles.textc}>联系我们</div>
          <div className={styles.textg}>CONTACT US</div>
        </div>
        <div className={styles.right}>
          <div className={styles.lian}>Copyright © 2006-2022 Yesstech</div>
        </div>
      </div>
      <div className={styles.contentBox}>
        <ul className={list.length <= 3 ? styles.less : ''}>
          {list.map((item, index) => {
            return (
              <li key={index}>
                <div className={styles.bizName}>{item.bizName}</div>
                <div className={styles.depName}>
                  <Icon type="user" />
                  &nbsp;&nbsp;{item.depName}&nbsp;&nbsp;&nbsp;&nbsp;{item.resBiz}
                </div>
                <div className={styles.phone}>
                  <Icon type="phone" />
                  &nbsp;&nbsp;{item.phone}
                </div>
                <div className={styles.email}>
                  <Icon type="mail" />
                  &nbsp;&nbsp;{item.email}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default About;

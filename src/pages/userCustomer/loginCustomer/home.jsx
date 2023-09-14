import { Alert, Button, Form, Input, Modal, Tabs } from 'antd';
import React, { Component } from 'react';
import styles from './style.less';
import classNames from 'classnames';

const Home = () => {
  const dataList = [
    {
      bgcolor: '#fff',
      typesetting: 'text_pic',
      title: `<p>一个服务平台</p>
      <p>与托管平台完美对接</p>
              `,
      info: `<p>对委托人、管理人进行功能的不同划分，实现各角色在本平台上均可查询及办理自身相关的业务；</p>
      <p>与托管平台实现无缝的对接，在流程及功能上均可实现双平台之间的交互操作以及数据的准确传输；</p>
              `,
      pic: require('@/assets/login/customer/home_1.png'),
    },
    {
      bgcolor: '#F2F5FF',
      typesetting: 'pic_text',
      title: `<p>“对客平台”</p>
      <p>包含了如下功能：</p>
              `,
      info: `<p>指令处理、流程对接、业务查询、开户申请、报表提供等，在功能实现上可以通过无纸化的文件传输、业务数据的实时查询以及系统管理等功能来让资产托管业务变得更加安全及方便快捷</p>
              `,
      pic: require('@/assets/login/customer/home_2.png'),
    },
    {
      bgcolor: '#fff',
      typesetting: 'text_pic',
      title: `<p>一个账号</p>
      <p>多端数据同步</p>
              `,
      info: `<p>安全、简单及便捷的服务，可以自动同步你的信息至公众号、APP、PC等，带来便捷的体验，在多场景下进行使用。</p>
              `,
      pic: require('@/assets/login/customer/home_3.png'),
    },
  ];

  return (
    <div className={styles.homeContent}>
      <ul>
        <li className={styles.banner}>
          <div className={styles.bannerBox}>
            <img src={require('@/assets/login/customer/banner.png')} />
            <div className={styles.bannerText}>
              <p className={styles.t1}>
                赢时胜托管服务对客平台<span>自主研发</span>
              </p>
              <p className={styles.t2}>服务于管理人、委托人的专业服务平台</p>
              <p className={styles.t3}>
                为各方提供{' '}
                <span>
                  安全<b>·</b>高效<b>·</b>便捷<b>·</b>专业
                </span>{' '}
                的服务
              </p>
            </div>
          </div>
        </li>
        {dataList.map((item, index) => {
          return (
            <li key={index} className={styles.item} style={{ backgroundColor: item.bgcolor }}>
              <div className={styles.itemBox}>
                {item.typesetting === 'text_pic' ? (
                  <>
                    <div className={styles.itemText}>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.title }}
                        className={styles.itemTitle}
                      ></div>
                      <div className={styles.itemPre}></div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.info }}
                        className={styles.itemInfo}
                      ></div>
                    </div>
                    <img src={item.pic} />
                  </>
                ) : (
                  <>
                    <img src={item.pic} />
                    <div className={styles.itemText}>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.title }}
                        className={styles.itemTitle}
                      ></div>
                      <div className={styles.itemPre}></div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.info }}
                        className={styles.itemInfo}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* {images.map((item, index) => {
        return (
          <div
            key={index}
            className={classNames(
              styles.homeItem,
              index === 0 ? styles.home0 : index % 2 === 0 ? styles.home2 : styles.home1,
            )}
          >
            <img src={item} />
          </div>
        );
      })} */}
    </div>
  );
};

export default Home;

import React, { Component } from 'react';
import styles from './index.less';

const $ = function(el) {
  try {
    const item = document.querySelector(el);
    return item.length === 1 ? item[0] : item;
  } catch (err) {
    console.log(err);
  }
};

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props?.list,
      isClick: false,
      active: null,
      activeIndex: null,
    };
  }

  componentDidMount() {
    const _ = this;
    this.emp = new Empile($('.container'), {
      waitForTransition: true,
      isClickSlide: true,
      navigation: {
        nextEl: $('.demo1 .btn-right'),
        prevEl: $('.demo1 .btn-left'),
      },
      on: {
        clickDotAfter(activeIndex) {
          _.setState({ activeIndex });
        },
      },
      pagination: {
        el: document.querySelector('.navigation'),
        clickable: true,
        bulletClass: 'dot',
        bulletActiveClass: 'active',
      },
      css(coord, absCoord) {
        const zIndex = 180 - absCoord;
        const opacity = Math.pow(0.92, absCoord).toFixed(3);
        const scale = `scale(${Math.pow(0.9, absCoord).toFixed(2)})`;
        const translateX = `translateX(${180 * coord}px)`;

        const transform = [translateX, scale].join(' ');
        return {
          zIndex,
          opacity,
          transform,
        };
      },
    });
  }

  countList(list = []) {
    if (list.length % 2 === 0) {
      return list.push(list[Math.ceil(list.length / 2)]) || [];
    }
    return list;
  }

  render() {
    const { activeIndex, list } = this.state;
    if (list.length % 2 === 0) {
      list.push(list[Math.ceil(list.length / 2)]) || [];
    }
    return (
      <div className={`${styles.empi} wrapper horizontal demo1`}>
        <div className={styles.swiper}>
          <ul className="container">
            {list.map(item => {
              return (
                <li
                  key={item.sysId}
                  className="cards-list"
                  style={{
                    backgroundColor: item.hoverColor,
                  }}
                  onClick={() => {
                    if (this.emp.activeIndex === activeIndex) {
                      item.handleFun(item.linkTo, item.title, item.sysId, item.flag);
                    }
                    if (!activeIndex && this.emp.activeIndex === 0) {
                      item.handleFun(item.linkTo, item.title, item.sysId, item.flag);
                    }
                  }}
                >
                  <div className="main-con">
                    <h4 className="main-con-name">{item.title}</h4>
                    <p className="main-con-content">{item.describe}</p>
                    <p className="main-con-label">{'点击进入>'}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <ul className="navigation">
            {list.map(item => {
              return <li key={item.sysId} className="dot" />;
            })}
          </ul>

          <i className="btn-direct btn-left" id="btn-left">
            <span className="shift-left" />
          </i>
          <i className="btn-direct btn-right" id="btn-right">
            <span className="shift-right" />
          </i>
        </div>
      </div>
    );
  }
}

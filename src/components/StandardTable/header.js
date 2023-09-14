import React from 'react';
import HeaderSon from './headerSon';
import { DndContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Checkbox, Collapse, message } from 'antd';
import styles from './index.less';

const Panel = Collapse.Panel;


class Container extends React.Component {
  state = {};


  moveCard = (dragIndex, hoverIndex, props) => {
    const { data } = this.props;
    const dragCard = data[dragIndex];
    if(dragCard.fixed==true||dragCard.fixed=='left'||dragCard.fixed=='right'){
      dragCard.fixed=false;
    }
    let newcard = [...this.props.data];
    newcard.splice(dragIndex, 1);
    newcard.splice(hoverIndex, 0, dragCard);

    this.props.orderbyindex(newcard);

  };

  callback = (e) => {
    // let arr = e[0];
    // if (arr == 'check') {
    //
    // } else {
    //
    // }
  };

  onChangebox = (e) => {
    if(e.length==0){
      message.warn("请至少保留一列数据项!")
    }else {
      this.props.checkboxdata(e);
    }

  };

  lock = (e) => {

    const dragCard = this.props.data[e.index];
    if(dragCard.fixed==true||dragCard.fixed=='left'||dragCard.fixed=='right'){
      dragCard.fixed=false;
    }
    let newcard = [...this.props.data];
    newcard.splice(e.index, 1);

    if (e.islock == true) {
      dragCard.islock = false;
      newcard.push(dragCard);
    } else {
      let lock = [];
      let unlock = [];
      newcard.map((card, i) => {
        if (card.islock == undefined || card.islock == 0) {
          unlock.push(card);
        } else {
          lock.push(card);
        }
      });
      dragCard.islock = true;
      lock.push(dragCard);
      newcard = [...lock, ...unlock];
    }

    this.props.orderbyindex(newcard);

  };


  render() {
    const { data, checkbox } = this.props;


    return (
      <div className={styles.header}>
        <Collapse onChange={this.callback}>
          <Panel header="自定义表头" key={'check'} style={{ lineHeight: '15px' }}>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangebox} value={checkbox}>
                {data.map((card, i) => (
                  <HeaderSon
                    key={card.dataIndex}
                    index={i}
                    id={card.dataIndex}
                    text={card.title}
                    moveCard={this.moveCard}
                    lock={this.lock}
                    check={checkbox}
                    islock={card.islock == undefined || card.islock == false ? false : true}
                  />
                ))}
              </Checkbox.Group>
            </div>
          </Panel>

        </Collapse>
      </div>
    );
  }

}

const Demo = DndContext(HTML5Backend)(Container);

export default Demo;

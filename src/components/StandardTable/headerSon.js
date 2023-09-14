import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Checkbox, Icon } from 'antd';
import styles from './index.less';

const style = {
  paddingLeft: '5px',
  paddingBottom: '2px',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag: (props) => {
    return {
      id: props.id,
      index: props.index,
    };
  },
  canDrag(props) {
    // You can disallow drag based on props
    return !props.islock;
  },
};

const cardTarget = {
  hover: (props, monitor, component) => {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(
      component,
    ).getBoundingClientRect();


    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;


    const clientOffset = monitor.getClientOffset();


    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }


    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveCard(dragIndex, hoverIndex, props);

    monitor.getItem().index = hoverIndex;
  },
};


class Card extends React.Component {

  sonlock = (e) => {
    this.props.lock(e);
  };

  render() {
    const {
      text,
      isDragging,
      connectDragSource,
      connectDropTarget,
      id,
      islock,
      index,
    } = this.props;

    const opacity = isDragging ? 0 : 1;


    return connectDragSource(
      connectDropTarget(
        <div style={{ ...style, opacity }} className={styles.over}>
          <div>
            <Checkbox value={id} key={id}>
              <p style={{ display: 'inline' }} title={text}>{text}</p>
            </Checkbox>

            <span style={{ float: 'right' }}>

              {
                islock ? <Icon type="lock" className={styles.unclick} style={{ fontSize: '18px' }}
                               onClick={() => this.sonlock({ id: id, islock: true, index: index })}/> :
                  <Icon type="unlock" className={styles.onclick} style={{ fontSize: '18px' }}
                        onClick={() => this.sonlock({ id: id, islock: false, index: index })}/>
              }

              <Icon type="bars" style={{ fontSize: '18px' }}/>
            </span>
          </div>
        </div>,
      ),
    );
  }
}


export default DropTarget(
  'header',
  cardTarget,
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    'header',
    cardSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(Card),
);


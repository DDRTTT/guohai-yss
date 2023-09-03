import React from 'react';
import { DragSource } from 'react-dnd';

const style = {
  border: '2px solid #40affe',
  borderRadius: '4px',
  padding: '0 10px',
  textAlign: 'center',
  lineHeight: '30px',
  margin: '5px 10px',
  cursor: 'move',
  width: '42%',
  display: 'inline-block',
};
const dragStyles = {
  type_stage: 'drag-item-stage',
  type_start: 'drag-item-start',
  type_end: 'drag-item-end',
  type_parallel: 'drag-item-parallel',
  type_common: 'drag-item-common',
};

const boxSource = {
  /**
   * 开始拖拽时触发当前函数
   * @param {*} props 组件的 props
   */
  beginDrag(props) {
    // 返回的对象可以在 monitor.getItem() 中获取到
    return {
      name: props.name,
    };
  },

  /**
   * 拖拽结束时触发当前函数
   * @param {*} props 当前组件的 props
   * @param {*} monitor DragSourceMonitor 对象
   */
  endDrag(props, monitor) {
    // 当前拖拽的 item 组件
    // 组件的根DOM节点的预计{x，y} client 偏移量
    // const item = monitor.getItem();
    const dragOffset = monitor.getSourceClientOffset();
    monitor.dragOffset = dragOffset;
    const { scrollTop } = document.querySelector('.visobox-mid');
    monitor.dragOffset.y = scrollTop + monitor.dragOffset.y;
  },
};

@DragSource(
  // type 标识，这里是字符串 'box'
  'dragBox',
  // 拖拽事件对象
  boxSource,
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => ({
    // 包裹住 DOM 节点，使其可以进行拖拽操作
    connectDragSource: connect.dragSource(),
    // 是否处于拖拽状态
    isDragging: monitor.isDragging(),
    dragOffset: monitor.dragOffset,
  }),
)
class Index extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { name, type, typeClass, code, oid, dragOffset = {} } = nextProps;
    if (!nextProps.isDragging && this.props.isDragging) {
      this.props.dragEndHandle(name, type, typeClass, code, oid, dragOffset);
    }
    return true;
  }

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name = 'avvv', type, code, typeClass, oid } = this.props;

    const opacity = isDragging ? 0.4 : 1;

    // 使用 connectDragSource 包裹住 DOM 节点，使其可以接受各种拖动 API
    // connectDragSource 包裹住的 DOM 节点才可以被拖动
    return (
      connectDragSource &&
      connectDragSource(
        <div className={dragStyles[typeClass]} style={{ ...style, opacity }}>
          {name}
        </div>,
      )
    );
  }
}

export default Index;

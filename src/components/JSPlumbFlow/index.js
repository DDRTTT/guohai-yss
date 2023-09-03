import React, { Component } from 'react';
import { Form, Input, Modal, Button, message, select, Select } from 'antd';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { getClientHeight } from '@/utils/utilsFlow';
import { cloneDeep } from 'lodash';
import DragComponent from '../DragComponent';
import RegionConfigForm from './components/regionForm';
import NodeAttr from './components/nodeAttr';
import 'jsplumb';

// import './data/data2';
localStorage.setItem('visoData', '{"nodeData":[],"connectionData":[]}');
// import './index.css';

const FormItem = Form.Item;
const { confirm } = Modal;

const { Option } = Select;
const { jsPlumb } = window;
const containerId = 'diagramContainer';
const containerSelector = `#${containerId}`;
const clientHeight = getClientHeight(); // 获取浏览器高度

// 是否允许改变流程图的布局（包括大小、连线、节点删除等）
const canChangeLayout = true;

// 很多连接线都是相同设置的情况下，可以将配置抽离出来，作为一个单独的变量，作为connect的第二个参数传入。
// 实际上connect的第二个参数会和第一个参数merge，作为一个整体。
const commonConfig = {
  // 是否可以拖动（作为连线起点）
  isSource: canChangeLayout,
  // 是否可以放置（连线终点）
  isTarget: canChangeLayout,
  // 设置连接点最多可以连接几条线
  // -1不限制，默认限制一条线
  maxConnections: -1,
  // 设置锚点位置，按照[target, source]的顺序进行设置
  // 可以有 Bottom Top Right Left四种方位
  // 还可以是BottomLeft BottomRight BottomCenter TopLeft TopRight TopCenter LeftMiddle RightMiddle的组合
  // 默认值 ['Bottom', 'Bottom']
  // anchor: ['Bottom', 'Bottom'],
  // 端点类型，形状（区分大小写），Rectangle-正方形 Dot-圆形 Blank-空
  endpoint: [
    canChangeLayout ? 'Dot' : 'Blank',
    {
      radius: 6,
    },
  ],
  // 设置端点的样式
  endpointStyle: {
    fill: '#456', // 填充颜色
    outlineStroke: 'blank', // 边框颜色
    outlineWidth: 0, // 边框宽度
  },
  // 设置连接线的样式 Bezier-贝瑟尔曲线 Flowchart-流程图 StateMachine-弧线 Straight-直线
  connector: ['Flowchart'],
  // 设置连接线的样式
  connectorStyle: {
    stroke: '#456', // 实线颜色
    strokeWidth: 3, // 实线宽度
    outlineStroke: 'blank', // 边框颜色
    outlineWidth: 2, // 边框宽度
  },
  // 设置连接线悬浮样式
  connectorHoverStyle: {
    stroke: 'lightblue', // 实线颜色
  },
  // 设置连接线的箭头
  // 可以设置箭头的长宽以及箭头的位置，location 0.5表示箭头位于中间，location 1表示箭头设置在连接线末端。 一根连接线是可以添加多个箭头的。
  connectorOverlays: [
    [
      'Arrow',
      {
        width: 10,
        length: 10,
        location: 1,
      },
    ],
  ],
};

// 不同节点类型的class类名
const TypeClassName = {
  startEvent: 'viso-start',
  endEvent: 'viso-end',
  exclusiveGateway: 'viso-gateway-exclusive',
  parallelGateway: 'viso-gateway-parallel',
  userTask: 'viso-task',
  stageType: 'viso-item-type1',
  type2: 'viso-item-type2',
  type3: 'viso-item-type3',
};

// 分支条件存储
const ConditionCache = {};

class Index extends Component {
  // 初始化页面常量、绑定事件方法
  constructor(props) {
    super(props);

    // 组件数据
    this.state = {
      // 连线编辑保存信息
      labelOverlay: null,
      editModalSourceId: '',
      eiditModalTargetid: '',
      editModalCondition: '',
      editModalLabelText: '',
      lunchCode: '',
      isTouchCode: '',
      // 流程节点
      nodeList: null,
      // 显示编辑浮层
      showEditModal: false,
      // 右侧展示属性
      nodeTypesSource: {},
      // 右侧添加属性btn
      typeBtnList: [],
      // 表单配置弹窗
      formVisible: false,
      // 右侧属性节点描述
      nodeDescription: '',
      // 结果弹窗 临时使用
      isShowResult: false,
      // 输出结果json
      showResult: '',
      // 绘图区域设置
      regionVisible: false,
      // 新建连线配置条件
      showNewConditionModal: false,
      // 存储连线状态，新增连线时使用
      connectInfo: null,
      // 所属阶段
      parentId: '',
      proType: '',
      proCode: '',
      lifecycleName: '',
      // 展示产品类型
      showProtype: true,
    };
  }

  // DOM挂载完成时调用
  componentDidMount() {
    this.initFlow();
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.flowInfo) !== JSON.stringify(this.props.flowInfo)) {
      if (!nextProps.flowInfo.nodeData) {
        return;
      }
      document.querySelector(containerSelector).innerHTML = '';

      const {
        nodeData,
        connectionData,
        regionConfig,
        proCode,
        proType,
        lifecycleName,
      } = nextProps.flowInfo;
      const newVisoData = {
        nodeData,
        connectionData,
        regionConfig,
        proCode,
        proType,
        lifecycleName,
      };
      localStorage.setItem('visoData', JSON.stringify(newVisoData));
      this.loadDataAndPaint(newVisoData);
      if (newVisoData.regionConfig) {
        this.setRegionConfig(
          newVisoData.regionConfig.regionWidth,
          newVisoData.regionConfig.regionHeight,
        );
      }
    }
  }

  // 初始化流程图
  initFlow() {
    jsPlumb.ready(() => {
      // 设置绘图容器
      jsPlumb.setContainer(containerId);

      // 可以使用importDefaults，来重写某些默认设置
      jsPlumb.importDefaults({
        ConnectionsDetachable: true, // 一般来说拖动创建的连接，可以再次拖动，让连接断开。如果不想触发这种行为，可以设置。
      });

      // 绑定加载数据的操作数据
      this.bindLoadData();

      // 绑定保存数据的操作数据
      // this.bindSaveData();

      // 绑定清除数据的操作数据
      this.bindClearData();

      // 绑定节点内容编辑
      this.bindEditNodeName();

      // 加载数据并绘制流程图
      this.loadDataAndPaint();

      // 绑定点击展示数据详情-h
      this.bindShowData();

      // 移动节点时触发事件
      this.dragNode();

      // 获取本地缓存是否有宽高配置
      this.getRegionConfig();

      // 允许改变流程图的布局
      if (canChangeLayout) {
        // 绑定删除连接线的操作处理
        this.bindDeleteConnection();

        // 绑定删除节点操作
        this.bindRemoveNode();

        // 阶段增加高度 默认：200
        this.addHeight();

        // 阶段减低高度 默认：200，不可小于
        this.cutHeight();

        // 绑定连接线添加label文本
        this.bindConnectionAddLabel();
      }
    });
  }

  // 获取本地缓存是否有宽高配置
  getRegionConfig = () => {
    const regionConfig = window.localStorage.getItem('regionConfig');
    if (regionConfig) {
      const { regionWidth, regionHeight } = JSON.parse(regionConfig);
      this.setRegionConfig(regionWidth, regionHeight);
    }
  };

  // 设置默认表现
  setDefault(id, flag) {
    canChangeLayout && this.setDraggable(id);
    this.addEndpoint(id, flag);
  }

  // 设置指定节点可拖动
  setDraggable(id) {
    jsPlumb.draggable(id, {
      containment: 'parent', // 限制节点的拖动区域
      grid: [10, 10], // 设置网格
    });
  }

  // 给指定节点添加端点
  addEndpoint(id, flag) {
    if (!flag) {
      jsPlumb.addEndpoint(id, { anchors: 'Left', uuid: `${id}-anchor-left-middle` }, commonConfig);
      jsPlumb.addEndpoint(
        id,
        { anchors: 'Right', uuid: `${id}-anchor-right-middle` },
        commonConfig,
      );
      jsPlumb.addEndpoint(id, { anchors: 'Top', uuid: `${id}-anchor-center-top` }, commonConfig);
      jsPlumb.addEndpoint(
        id,
        { anchors: 'Bottom', uuid: `${id}-anchor-center-bottom` },
        commonConfig,
      );
    }
  }

  // 设置连线
  setConnection(info) {
    // console.log(this.getAnchorID(info.source), this.getAnchorID(info.target));
    jsPlumb.connect({
      uuids: [this.getAnchorID(info.source), this.getAnchorID(info.target)],
      overlays: [
        [
          'Label',
          this.getLabelSetInfo(info.label || '', info.source.elementId, info.target.elementId),
        ],
      ],
    });
  }

  // 获取端点id
  getAnchorID(anchorInfo) {
    const nodeInfo = this.getNodeInfo(document.getElementById(anchorInfo.elementId));
    const posX = (anchorInfo.x - nodeInfo.x) / nodeInfo.width;
    const posY = (anchorInfo.y - nodeInfo.y) / nodeInfo.height;
    let posXName = 'center';
    let posYName = 'middle';

    if (posX === 0) {
      posXName = 'left';
    } else if (posX > 0.6) {
      posXName = 'right';
    }

    if (posY === 0) {
      posYName = 'top';
    } else if (posY > 0.6) {
      posYName = 'bottom';
    }

    return `${anchorInfo.elementId}-anchor-${posXName}-${posYName}`;
  }

  // 清除画布内容
  clearCont() {
    // 删除所有连接线
    jsPlumb.deleteEveryConnection();

    // 删除所有端点
    jsPlumb.deleteEveryEndpoint();

    // 删除所有节点
    // document.querySelector(containerSelector).innerHTML = '';
    this.setState({ nodeList: null });
  }

  // 获取节点数据
  getNodeData() {
    const visoEles = document.querySelectorAll(`${containerSelector} .viso-item`);
    const nodeData = [];
    for (let i = 0, len = visoEles.length; i < len; i++) {
      const nodeInfo = this.getNodeInfo(visoEles[i]);

      if (!nodeInfo.id) {
        message.error('流程图节点必须包含id');
        return;
      }

      if (!nodeInfo.name) {
        message.error('流程图节点必须包含name');
        return;
      }
      // switch (nodeInfo.type) {
      //   case '0':
      //     break;
      //   case '1':
      //     nodeInfo.typeClass = 'stageType';
      //     break;
      //   case '2':
      //     break;
      // }
      nodeData.push({
        id: nodeInfo.id,
        name: nodeInfo.name,
        code: nodeInfo.code,
        oid: nodeInfo.oid,
        type: nodeInfo.type,
        typeClass: nodeInfo.typeClass,
        width: nodeInfo.width,
        height: nodeInfo.height,
        description: nodeInfo.description, // 节点描述
        parentId: nodeInfo.parentId,
        x: nodeInfo.x,
        y: nodeInfo.y,
      });
    }

    return nodeData;
  }

  // 获取节点相关信息
  getNodeInfo(ele) {
    const id = ele.getAttribute('id');
    const eleName = ele.querySelector('.viso-name');
    const eleSelect = ele.querySelector('.ant-select-selection-selected-value');
    const eleRead = eleName || eleSelect;
    const name = eleRead
      ? (eleRead.innerText || eleRead.textContent).replace(/^\s+|\s+$/g, '')
      : '';
    const currentStyle = ele.currentStyle || window.getComputedStyle(ele, null);
    return {
      id,
      name,
      type: ele.getAttribute('data-type'),
      typeClass: ele.getAttribute('data-typeclass'),
      code: ele.getAttribute('data-code'),
      oid: ele.getAttribute('data-oid'),
      description: ele.getAttribute('data-description'),
      parentId: ele.getAttribute('data-parentid'),
      width: parseInt(currentStyle.width, 10) || 80,
      height: parseInt(currentStyle.height, 10) || 80,
      x: parseInt(currentStyle.left, 10) || 0,
      y: parseInt(currentStyle.top, 10) || 0,
    };
  }

  // 获取连线数据
  getConnectionData() {
    const originalData = jsPlumb.getAllConnections();
    const connectionData = [];

    originalData.forEach(item => {
      const anchorSource = item.endpoints[0].anchor;
      const anchorTarget = item.endpoints[1].anchor;
      const anchorSourceInfo = {
        name: anchorSource.type,
        x: anchorSource.x,
        y: anchorSource.y,
      };
      const anchorTargetInfo = {
        name: anchorTarget.type,
        x: anchorTarget.x,
        y: anchorTarget.y,
      };
      const anchorSourcePosition = this.getAnchorPosition(anchorSource.elementId, anchorSourceInfo);
      const anchorTargetPosition = this.getAnchorPosition(anchorTarget.elementId, anchorTargetInfo);

      const overlays = item.getOverlays();
      let labelText = '';
      let lunchCode;
      let isTouchCode;
      Object.keys(overlays).forEach(key => {
        if (overlays[key].type === 'Label') {
          labelText = overlays[key].labelText;
        }
      });
      const infoObj = {
        // 连线id
        id: item.id,
        // label文本
        label: labelText,
        lunch: this.state.lunchCode,
        isTouch: this.state.isTouchCode,
        // 源节点
        source: {
          elementId: anchorSource.elementId,
          x: anchorSourcePosition.x,
          y: anchorSourcePosition.y,
        },
        // 目标节点
        target: {
          elementId: anchorTarget.elementId,
          x: anchorTargetPosition.x,
          y: anchorTargetPosition.y,
        },
      };
      const condition = ConditionCache[`${anchorSource.elementId}:${anchorTarget.elementId}`];
      if (condition) {
        infoObj.conditionExpression = condition;
      }

      connectionData.push(infoObj);
    });

    return connectionData;
  }

  // 获取节点坐标信息
  getAnchorPosition(elementId, anchorInfo) {
    const nodeInfo = this.getNodeInfo(document.getElementById(elementId));

    return {
      x: nodeInfo.x + nodeInfo.width * anchorInfo.x,
      y: nodeInfo.y + nodeInfo.height * anchorInfo.y,
    };
  }

  // 获取设置Label文本的配置信息
  getLabelSetInfo(labelText, sourceId, targetId) {
    return {
      label: labelText || '',
      cssClass: 'jtk-overlay-label',
      location: 0.4,
      events: {
        click: labelOverlay => {
          this.setState({
            labelOverlay,
            editModalCondition: ConditionCache[`${sourceId}:${targetId}`],
            editModalSourceId: sourceId,
            eiditModalTargetid: targetId,
            editModalLabelText: labelOverlay.labelText,
            lunchCode: 0,
            isTouchCode: 0,
            showEditModal: false,
          });
        },
      },
    };
  }

  // 加载数据并绘制流程图
  loadDataAndPaint(data) {
    let visoData;
    if (data) {
      visoData = data;
    } else {
      const defData = { connectionData: [], nodeData: [] };
      const storageData = localStorage.getItem('visoData');
      visoData = storageData ? JSON.parse(storageData) : defData;
    }
    const { nodeData } = visoData;
    const { connectionData } = visoData;

    // 清除内容
    this.clearCont();

    // 添加节点
    const nodeList = nodeData.map(info => {
      const styleObj = {
        position: 'absolute',
        left: info.typeClass == 'stageType' ? `5%` : `${info.x}px`,
        top: `${info.y}px`,
      };
      if (info.width) {
        styleObj.width = `${info.width}`.indexOf('%') != -1 ? `${info.width}` : `${info.width}px`;
        styleObj.height = `${info.height}px`;
      }
      const nodeHTML = (
        <div
          key={info.id}
          id={info.id}
          data-id={info.id}
          data-description={info.description}
          data-parentid={info.parentId}
          data-typeclass={info.typeClass}
          className={`viso-item ${TypeClassName[info.typeClass]}`}
          style={styleObj}
          data-type={info.type}
          data-code={info.code}
          data-oid={info.oid}
        >
          <span className="viso-name">{info.name}</span>
          <span className="viso-close" style={{ display: canChangeLayout ? 'block' : 'none' }}>
            &times;
          </span>
          <span
            className="viso-add viso-commonIcon"
            style={{ display: info.typeClass && canChangeLayout ? 'block' : 'none' }}
          >
            +
          </span>
          <span
            className="viso-cut viso-commonIcon"
            style={{ display: info.typeClass && canChangeLayout ? 'block' : 'none' }}
          >
            -
          </span>
        </div>
      );
      return nodeHTML;
    });

    this.setState(
      {
        nodeList,
      },
      () => {
        // 设置默认表现
        nodeData.forEach(info => {
          let flag;
          if (info.typeClass === 'stageType') {
            flag = true;
          }
          this.setDefault(info.id, flag);
        });
        // 创建连线
        if (connectionData.length > 0) {
          connectionData.forEach(info => {
            if (info.conditionExpression) {
              ConditionCache[`${info.source.elementId}:${info.target.elementId}`] =
                info.conditionExpression;
            }
            this.setConnection(info);
          });
        }
      },
    );
  }

  // 拖拽左侧类型获取位置信息
  dragEndHandle = (name, type, typeClass, code, oid, dragOffset) => {
    const offsetX = dragOffset ? dragOffset.x : 0;
    const offsetY = dragOffset ? dragOffset.y : 0;
    // 300为左侧宽度, 256为菜单栏的最小宽度
    const dragX = offsetX - 300 - 256;
    // 45为header高度
    const dragY = offsetY;
    if (dragX < 0 || dragY < 0) {
      message.info('请拖拽至区域内！');
      return;
    }
    this.addNodeHandle(name, type, typeClass, code, oid, dragX, dragY);
  };

  // 添加节点
  addNodeHandle = (name, type, typeClass, code, oid, dragX, dragY) => {
    const defData = { connectionData: [], nodeData: [] };
    const storageData = localStorage.getItem('visoData');
    const visoData = storageData ? JSON.parse(storageData) : defData;
    const { nodeData } = visoData;
    let obj;
    obj = {
      id: uuidv4(),
      name,
      type,
      typeClass,
      code,
      oid,
      width: typeClass == 'stageType' ? '90%' : 90,
      height: typeClass == 'stageType' ? 200 : 32,
      x: dragX,
      y: dragY,
    };
    nodeData.push(obj);

    this.afreshNodeStage(obj, obj.y);

    const connectionData = this.getConnectionData();
    const newVisoData = {
      nodeData,
      connectionData,
    };
    localStorage.setItem('visoData', JSON.stringify(newVisoData));
    this.loadDataAndPaint();
  };

  // 拖动节点触发事件
  dragNode() {
    document.querySelector(containerSelector).addEventListener('mouseup', event => {
      if (event.target.getAttribute('data-type')) {
        return;
      }

      const currentNodeInfo = this.getNodeInfo(event.target.parentNode);
      this.afreshNodeStage(currentNodeInfo, currentNodeInfo.y);
    });
  }

  // 移动节点后，重新计算，节点所在的阶段
  afreshNodeStage(data, y) {
    console.log(y);
    if (!data.code) {
      return;
    }
    if (data.parentId) {
      this.setState({
        nodeTypesSource: data,
      });
    }
    const nodeData = this.getNodeData();
    const temp = nodeData.filter(item => {
      item.diff = y - item.y;
      return item.typeClass && item.y < y;
    });
    const minDiff = Math.min.apply(
      Math,
      temp.map(i => {
        return i.diff;
      }),
    );
    const temp1 = temp.filter(t => {
      return t.diff === minDiff;
    });
    if (temp1 && temp1[0]) {
      data.parentId = temp1[0].oid;
    }
    if (data.typeClass) {
      data.parentId = '';
    }
    const obj = nodeData.find(item => item.id === data.id);
    if (obj && !obj.typeClass) {
      obj.parentId = data.parentId;
    }
    const connectionData = this.getConnectionData();
    const newVisoData = {
      nodeData,
      connectionData,
    };
    localStorage.setItem('visoData', JSON.stringify(newVisoData));
    // this.loadDataAndPaint();
  }

  // 绑定删除连接线的操作处理
  bindDeleteConnection() {
    jsPlumb.bind('dblclick', function(connection) {
      // if (window.confirm('确定删除所点击的连接线吗？')) {
      //   // 删除指定连接线
      //   jsPlumb.deleteConnection(connection);
      // }
      confirm({
        title: '确定删除所点击的连接线吗?',
        content: '',
        onOk() {
          jsPlumb.deleteConnection(connection);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    });
  }

  // 绑定连接线添加label文本
  bindConnectionAddLabel() {
    // 建立连接线之前触发
    // 返回true正常建立连线，返回false取消连接
    jsPlumb.bind('beforeDrop', (info, originalEvent) => {
      // const labelText = window.prompt('请输入连接线的label') || '';
      this.setState({
        editModalSourceId: info.sourceId,
        eiditModalTargetid: info.targetId,
        connectInfo: info,
        editModalLabelText: '',
        lunchCode: 0,
        isTouchCode: 0,
        editModalCondition: '',
        showNewConditionModal: true,
      });

      // if (labelText) {
      //   info.connection.setLabel(this.getLabelSetInfo(labelText));
      // }

      return true;
    });
  }

  // 新增连线ok
  handleNewConditionOnOK = () => {
    // this.state.labelOverlay.setLabel(this.state.editModalLabelText || '');
    this.state.connectInfo.connection.setLabel(
      this.getLabelSetInfo(
        this.state.editModalLabelText || '',
        this.state.lunchCode,
        this.state.isTouchCode,
        this.state.connectInfo.sourceId,
        this.state.connectInfo.targetId,
      ),
    );
    ConditionCache[
      `${this.state.editModalSourceId}:${this.state.eiditModalTargetid}`
    ] = this.state.editModalCondition;
    this.setState({
      showNewConditionModal: false,
      editModalLabelText: '',
      lunchCode: 0,
      isTouchCode: 0,
      editModalCondition: '',
    });

    const temp = JSON.parse(localStorage.getItem('visoData'));
    const { nodeData } = temp;
    const connectionData = this.getConnectionData();

    const visoData = {
      nodeData,
      connectionData,
    };

    localStorage.setItem('visoData', JSON.stringify(visoData));
  };

  // 绑定加载数据的操作数据
  bindLoadData() {
    document.querySelector('#loadData').addEventListener('click', () => {
      this.loadDataAndPaint();
    });
  }

  // 绑定保存数据的操作数据
  bindSaveData() {
    document.querySelector('#saveData').addEventListener('click', () => {
      const nodeData = this.getNodeData();
      const connectionData = this.getConnectionData();

      const visoData = {
        nodeData,
        connectionData,
      };

      console.log('保存数据', visoData);

      localStorage.setItem('visoData', JSON.stringify(visoData));
      this.setState({
        isShowResult: true,
        showResult: JSON.stringify(visoData),
      });
    });
  }

  // 绑定清除内容的操作数据
  bindClearData() {
    document.querySelector('#clearData').addEventListener('click', () => {
      // 清空storage数据
      const defData = { connectionData: [], nodeData: [] };
      window.localStorage.setItem('visoData', JSON.stringify(defData));

      this.clearCont();
      document.querySelector(containerSelector).innerHTML = '';
    });
  }

  // 绑定删除节点操作
  bindRemoveNode() {
    document.querySelector(containerSelector).addEventListener('click', event => {
      if (this.matchesSelector(event.target, '.viso-close')) {
        const id = event.target.parentNode.getAttribute('id');
        // jsPlumb.remove(id);
        // 先存下拖拽后的位置
        this.saveNodeInfos();
        // 删除node节点数据
        this.removeNodeHandle(id);
        // 右侧属性数据设为空
        this.setState({
          nodeTypesSource: {},
        });
      }
    });
  }

  // 增加高度
  addHeight() {
    document.querySelector(containerSelector).addEventListener('click', event => {
      if (this.matchesSelector(event.target, '.viso-add')) {
        event.target.parentNode.style.height = `${event.target.parentNode.offsetHeight + 64}px`;
        const nodeData = this.getNodeData();

        const newVisoData = JSON.parse(localStorage.getItem('visoData'));
        newVisoData.nodeData = nodeData;

        localStorage.setItem('visoData', JSON.stringify(newVisoData));
        // jsPlumb.remove(id);
        // 先存下拖拽后的位置
        // this.saveNodeInfos();
        // 删除node节点数据
        // this.removeNodeHandle(id);
      }
    });
  }

  cutHeight() {
    document.querySelector(containerSelector).addEventListener('click', event => {
      if (this.matchesSelector(event.target, '.viso-cut')) {
        if (event.target.parentNode.offsetHeight === 200) {
          return;
        }
        event.target.parentNode.style.height = `${event.target.parentNode.offsetHeight - 64}px`;
        const nodeData = this.getNodeData();

        const newVisoData = JSON.parse(localStorage.getItem('visoData'));
        newVisoData.nodeData = nodeData;

        localStorage.setItem('visoData', JSON.stringify(newVisoData));
        // jsPlumb.remove(id);
        // 先存下拖拽后的位置
        // this.saveNodeInfos();
        // 删除node节点数据
        // this.removeNodeHandle(id);
      }
    });
  }

  // 保存下绘图区域位置信息
  saveNodeInfos = () => {
    const nodeData = this.getNodeData();
    const connectionData = this.getConnectionData();
    const visoData = {
      nodeData,
      connectionData,
    };

    localStorage.setItem('visoData', JSON.stringify(visoData));
  };

  // 删除节点操作
  removeNodeHandle = removeId => {
    const defData = { connectionData: [], nodeData: [] };
    const storageData = localStorage.getItem('visoData');
    const visoData = storageData ? JSON.parse(storageData) : defData;
    let { nodeData } = visoData;
    let connectionData = this.getConnectionData();
    // 移除节点
    nodeData = nodeData.filter(item => item.id !== removeId);
    connectionData = connectionData.filter(item => {
      const sourceId = item.source ? item.source.elementId : '';
      const targetId = item.target ? item.target.elementId : '';
      if (sourceId !== removeId && targetId !== removeId) {
        return item;
      }
      return false;
    });

    const newVisoData = {
      nodeData,
      connectionData,
    };
    localStorage.setItem('visoData', JSON.stringify(newVisoData));
    this.loadDataAndPaint();
  };

  // 绑定展示数据详情
  bindShowData() {
    document.querySelector(containerSelector).addEventListener('click', event => {
      let id = event.target.parentNode.getAttribute('id');
      if (!id || id === 'diagramContainer') {
        id = event.target.getAttribute('id');
      }
      this.showDataTypes(id);
    });
  }

  // 右侧展示属性
  showDataTypes = id => {
    const defData = { connectionData: [], nodeData: [] };
    const storageData = localStorage.getItem('visoData');
    const visoData = storageData ? JSON.parse(storageData) : defData;
    const { nodeData } = visoData;
    const obj = nodeData.find(item => item.id === id);
    if (obj) {
      this.setState({
        nodeTypesSource: obj,
        nodeDescription: obj.description || '',
      });
    }
  };

  // 绑定节点内容编辑
  bindEditNodeName() {
    document.querySelector(containerSelector).addEventListener('dblclick', event => {
      let visoItem;
      if (this.matchesSelector(event.target, '.viso-item')) {
        visoItem = event.target;
      } else if (this.matchesSelector(event.target.parentNode, '.viso-item')) {
        visoItem = event.target.parentNode;
      }

      const eleName = visoItem && visoItem.querySelector('.viso-name');
      const type = visoItem && visoItem.getAttribute('data-type').toLocaleLowerCase();
      const code = visoItem && visoItem.getAttribute('data-code');
      const oid = visoItem && visoItem.getAttribute('data-oid');
      if (eleName && type.indexOf('gateway') === -1) {
        const text = (eleName.innerText || eleName.textContent).replace(/^\s+|\s+$/g, '');
        const eleInput = visoItem.querySelector('.viso-input');

        if (eleInput) {
          eleInput.value = text;
          eleInput.style.display = 'block';
          this.moveEnd(eleInput);
        } else {
          const appendInput = document.createElement('input');
          appendInput.className = 'viso-input';
          appendInput.value = text;
          appendInput.addEventListener('blur', event => {
            this.saveInput(event.target);
          });
          visoItem.appendChild(appendInput);
          this.moveEnd(appendInput);
        }

        canChangeLayout && (visoItem.querySelector('.viso-close').style.display = 'block');
      }
    });

    document.querySelector(containerSelector).addEventListener('keyup', event => {
      if (this.matchesSelector(event.target, '.viso-input')) {
        if (event.keyCode === 13) {
          this.saveInput(event.target);
        }
      }
    });
  }

  // 保存数据
  saveInput(ele) {
    const val = ele.value;
    if (val.trim() !== '') {
      const eleName = ele.parentNode.querySelector('.viso-name');
      eleName.innerHTML = '';
      eleName.appendChild(document.createTextNode(val));
    }
    ele.style.display = 'none';
    canChangeLayout && (ele.parentNode.querySelector('.viso-close').style.display = 'none');
  }

  // 光标移至末尾
  moveEnd(ele) {
    ele.focus();
    const len = ele.value.length;
    if (document.selection) {
      const sel = ele.createTextRange();
      sel.moveStart('character', len);
      sel.collapse();
      sel.select();
    } else if (typeof ele.selectionStart === 'number' && typeof ele.selectionEnd === 'number') {
      ele.selectionStart = ele.selectionEnd = len;
    }
  }

  // element.matches兼容处理
  matchesSelector(ele, selector) {
    if (ele.matches) {
      return ele.matches(selector);
    }
    if (ele.matchesSelector) {
      return ele.matchesSelector(selector);
    }
    if (ele.webkitMatchesSelector) {
      return ele.webkitMatchesSelector(selector);
    }
    if (ele.msMatchesSelector) {
      return ele.msMatchesSelector(selector);
    }
    if (ele.mozMatchesSelector) {
      return ele.mozMatchesSelector(selector);
    }
    if (ele.oMatchesSelector) {
      return ele.oMatchesSelector(selector);
    }
  }

  // 编辑弹窗点击确认，保存连线label和成立条件
  handleEditModalOnOK = () => {
    this.state.labelOverlay.setLabel(this.state.editModalLabelText || '');
    this.state.labelOverlay.setLunch(this.state.lunchCode || '');
    this.state.labelOverlay.setTouch(this.state.isTouchCode || '');
    ConditionCache[
      `${this.state.editModalSourceId}:${this.state.eiditModalTargetid}`
    ] = this.state.editModalCondition;
    this.setState({
      showEditModal: false,
    });
  };

  // 编辑弹窗：修改label文本
  handleChangeLabelText = event => {
    this.setState({
      editModalLabelText: event.target.value,
    });
  };

  // 编辑弹窗：修改成立条件
  handleChangeCondition = (obj, value) => {
    if (obj === 'lunch') {
      this.setState({
        lunchCode: value,
      });
    }
    if (obj === 'isTouch') {
      this.setState({
        isTouchCode: value,
      });
    }
    this.setState({
      editModalCondition: value,
    });
  };

  // 弹出表单配置弹窗
  addTypesBtn = () => {
    this.setState({
      formVisible: true,
    });
  };

  // 表单配置取消
  formConfigCancel = () => {
    this.setState({
      formVisible: false,
    });
  };

  // 表单配置保存
  formConfigOk = () => {
    console.log('配置保存');
    this.setState({
      formVisible: false,
    });
  };

  // 右侧属性失去焦点保存
  onBlurChange = id => {
    console.log(id);
    const { nodeDescription } = this.state;
    const defData = { connectionData: [], nodeData: [] };
    const storageData = localStorage.getItem('visoData');
    const visoData = storageData ? JSON.parse(storageData) : defData;
    const { nodeData } = visoData;
    const obj = nodeData.find(item => item.id === id);
    if (obj) {
      obj.description = nodeDescription;
    }
    const connectionData = this.getConnectionData();
    const newVisoData = {
      nodeData,
      connectionData,
    };
    localStorage.setItem('visoData', JSON.stringify(newVisoData));
    this.loadDataAndPaint();
  };

  // 节点属性change
  nodeDescriptionChange = e => {
    console.log(e.target.value);
    this.setState({
      nodeDescription: e.target.value,
    });
  };

  showResultCancel = () => {
    this.setState({
      isShowResult: false,
      showResult: '',
    });
  };

  // 点击区域设置事件
  onRegionHandle = () => {
    this.setState({
      regionVisible: true,
    });
  };

  // 传入宽高设置 绘图区域
  setRegionConfig = (width, height) => {
    const regionDiv = document.getElementById('diagramContainer');
    if (regionDiv) {
      regionDiv.style.width = `${parseInt(width)}px`;
      regionDiv.style.height = `${parseInt(height)}px`;
    }
  };

  onRegionOk = () => {
    const { form } = this.regionFormRef.props;
    const { isHeightError, isWidthError } = this.regionFormRef.state;
    form.validateFields((err, values) => {
      if (err || isHeightError || isWidthError) {
        return;
      }
      const { regionWidth, regionHeight } = values;

      this.setRegionConfig(regionWidth, regionHeight);
      window.localStorage.setItem('regionConfig', JSON.stringify(values));

      this.onRegionCancel();
    });
  };

  onRegionCancel = () => {
    this.setState({
      regionVisible: false,
    });
  };

  // 线性节点
  originDeploy = () => {
    const { originData } = this.props;
    const temp = cloneDeep(originData);
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const attr = temp.map(item => {
      const child = (
        <FormItem
          label={item.name}
          colon={false}
          required={false}
          {...formItemLayout}
          key={item.key}
        >
          {/* <Input value={this.state.editModalCondition} onChange={this.handleChangeCondition} /> */}
          <Select
            style={{ display: item.properties == 0 ? '' : 'none' }}
            defaultValue="0"
            onChange={this.handleChangeCondition.bind(null, item.key)}
          >
            {item.dataValue.map(tnt => {
              return (
                <Option value={tnt.code} key={tnt.name}>
                  {tnt.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      );
      return child;
    });
    return <div>{attr}</div>;
  };

  // select 公共方法
  handleMapList = (data, name, code, mode = false, fnBoole = false, fn, value, a) => {
    if (a === 1) {
      console.log('value', value);
      console.log('data', data);
      if (!data) {
        data = {};
        data.data = [];
      }
      const e = data;
      if (e) {
        const children = [];
        for (const key of e) {
          const keys = key[code];
          const values = key[name];
          children.push(
            <Select.Option key={keys} value={keys}>
              {values}
            </Select.Option>,
          );
        }
        return (
          <Select
            maxTagCount={1}
            mode={mode}
            style={{ width: '100%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={fnBoole ? fn : ''}
            defaultValue={value}
            disabled={!!this.props.flowInfo.proCode}
          >
            {children}
          </Select>
        );
      }
    }
  };

  chooseParentType = value => {
    value === 'type' ? this.setState({ showProtype: true }) : this.setState({ showProtype: false });
    this.setState({ proType: value });
    this.props.getChildValue.proType = value;
  };

  // 选择产品类型
  chooseProCode = value => {
    this.setState({ proCode: value });
    this.props.getChildValue.proCode = value;
  };

  getLifeCycleName = e => {
    this.state.lifecycleName = e.target.value;
    this.setState({ lifecycleName: e.target.value });
    this.props.getChildValue.lifecycleName = e.target.value;
  };

  // DOM渲染
  render() {
    const {
      flowStageData,
      flowNodeData,
      wordDictionary,
      authorityProduct,
      flowInfo,
      preview,
      edit,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // console.log(this.state.nodeList);
    // console.log(this.state.nodeTypesSource);
    // let proCode = '';
    // let lifecycleName = '';
    // let proType = '';
    // if (JSON.parse(localStorage.getItem('newData'))) {
    //   proCode = JSON.parse(localStorage.getItem('newData')).proCode;
    //   proType = JSON.parse(localStorage.getItem('newData')).proType;
    //   lifecycleName = JSON.parse(localStorage.getItem('newData')).lifecycleName;
    // }
    // const pCode = proCode || '';
    // const pName = lifecycleName || '';
    // const pType = proType || '';
    return (
      <div id="visobox">
        <div className="visobox-left" id="visobox-left" style={{ display: preview ? 'none' : '' }}>
          <div className="operate-item">
            <div className="flowNodeTitle">添加类型</div>
            <div className="flowNodeItem">
              <Select
                maxTagCount={1}
                style={{ width: '100%' }}
                placeholder="请选择"
                optionFilterProp="children"
                onChange={this.chooseParentType}
                value={flowInfo.proType ? flowInfo.proType : this.state.proType}
                disabled={!!edit}
              >
                <Select.Option key="type" value="type">
                  产品类型
                </Select.Option>
                <Select.Option key="product" value="product">
                  产品代码
                </Select.Option>
              </Select>
            </div>
            <div style={{ display: this.state.showProtype ? '' : 'none' }}>
              <div className="flowNodeTitle">产品类型</div>
              <div className="flowNodeItem">
                <Select
                  maxTagCount={1}
                  // mode={mode}
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={this.chooseProCode}
                  value={flowInfo.proCode ? flowInfo.proCode : this.state.proCode}
                  disabled={!!edit}
                >
                  {(wordDictionary.A002 || []).map(item => {
                    return (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div style={{ display: this.state.showProtype ? 'none' : '' }}>
              <div className="flowNodeTitle">权限产品</div>
              <div className="flowNodeItem">
                <Select
                  maxTagCount={1}
                  // mode={mode}
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={this.chooseProCode}
                  value={flowInfo.proCode ? flowInfo.proCode : this.state.proCode}
                  disabled={!!edit}
                >
                  {(authorityProduct || []).map(item => {
                    return (
                      <Select.Option key={item.text} value={item.text}>
                        {item.value}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>

            <div className="flowNodeTitle">模板名称</div>
            <div className="flowNodeItem">
              <Input
                placeholder="请输入"
                onChange={this.getLifeCycleName}
                value={flowInfo.lifecycleName ? flowInfo.lifecycleName : this.state.lifecycleName}
              />
            </div>
          </div>
          <div className="operate-item">
            <div className="flowNodeTitle">阶段</div>
            <div className="flowNodeItem">
              <DndProvider backend={Backend}>
                {flowStageData.map(item => {
                  return (
                    <DragComponent
                      key={item.code}
                      name={item.name}
                      code={item.code}
                      type={item.type}
                      typeClass={item.typeClass}
                      oid={item.id}
                      dragEndHandle={this.dragEndHandle}
                    />
                  );
                })}
              </DndProvider>
            </div>
          </div>
          <div className="operate-item">
            <div className="flowNodeTitle">流程</div>
            <div className="flowNodeItem flowNodeList">
              <DndProvider backend={Backend}>
                {flowNodeData.map(item => {
                  return (
                    <DragComponent
                      key={item.code}
                      name={item.name}
                      code={item.code}
                      type={item.type}
                      typeClass={item.typeClass}
                      dragEndHandle={this.dragEndHandle}
                    />
                  );
                })}
                {/* <DragComponent name="常规" type="type_common" dragEndHandle={this.dragEndHandle} /> */}
              </DndProvider>
            </div>
          </div>
          <div className="operate-item">
            <div className="flowNodeTitle">通用</div>
            <div className="flowNodeItem">
              <DndProvider backend={Backend}>
                <DragComponent
                  name="开始"
                  type="type_start"
                  code="start"
                  dragEndHandle={this.dragEndHandle}
                />
                <DragComponent
                  name="结束"
                  type="type_end"
                  code="end"
                  dragEndHandle={this.dragEndHandle}
                />
                <DragComponent
                  name="并行"
                  type="type_parallel"
                  code="parallel"
                  dragEndHandle={this.dragEndHandle}
                />
              </DndProvider>
            </div>
          </div>
          <div className="operate-item">
            <Button id="loadData" style={{ width: '100%' }}>
              加载数据
            </Button>
          </div>
          <div className="operate-item">
            <Button id="clearData" style={{ width: '100%' }}>
              清除内容
            </Button>
          </div>
          <div className="operate-item">
            <Button style={{ width: '100%' }} onClick={this.onRegionHandle}>
              绘图区域设置
            </Button>
          </div>
          {/* <div className="operate-item">
            <Button id="saveData" type="primary" style={{ width: '100%' }}>
              保存数据
            </Button>
          </div> */}
        </div>
        <div className="visobox-mid" style={{ height: `${clientHeight}px` }}>
          <div id="diagramContainer">{this.state.nodeList}</div>
        </div>
        <div className="visobox-right" id="visobox-right">
          <div className="right-types">节点属性</div>
          {this.state.nodeTypesSource.name ? (
            <NodeAttr nodeAttrMsg={this.props.flowAttrData} attrData={this.state.nodeTypesSource} />
          ) : (
            <div>暂无数据</div>
          )}
        </div>
        <Modal
          width={300}
          title="编辑条件"
          visible={this.state.showEditModal}
          onOk={this.handleEditModalOnOK}
          onCancel={() => {
            this.setState({ showEditModal: false });
          }}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <FormItem label="配置条件：" colon={false} required={false} {...formItemLayout}>
              <Input value={this.state.editModalCondition} onChange={this.handleChangeCondition} />
            </FormItem>
          </div>
          <div>
            <FormItem label="显示文本：" colon={false} required={false} {...formItemLayout}>
              <Input value={this.state.editModalLabelText} onChange={this.handleChangeLabelText} />
            </FormItem>
          </div>
        </Modal>
        <Modal
          width={300}
          title="新增条件"
          visible={this.state.showNewConditionModal}
          destroyOnClose
          onOk={this.handleNewConditionOnOK}
          onCancel={() => {
            this.setState({ showNewConditionModal: false });
          }}
          okText="确认"
          cancelText="取消"
        >
          {/* <div>
            <FormItem label="配置条件：" colon={false} required={false} {...formItemLayout}>
              <Input value={this.state.editModalCondition} onChange={this.handleChangeCondition} />
            </FormItem>
          </div>
          <div>
            <FormItem label="显示文本：" colon={false} required={false} {...formItemLayout}>
              <Input value={this.state.editModalLabelText} onChange={this.handleChangeLabelText} />
            </FormItem>
          </div> */}
          {this.originDeploy()}
        </Modal>
        <Modal
          title="表单配置"
          width={800}
          visible={this.state.formVisible}
          onOk={this.formConfigOk}
          onCancel={this.formConfigCancel}
        >
          <p>按钮配置1</p>
        </Modal>
        <Modal
          title="保存数据"
          width={800}
          footer={null}
          visible={this.state.isShowResult}
          onCancel={this.showResultCancel}
        >
          <p>json格式</p>
          <div style={{ padding: 8, border: '1px solid #ccc', maxHeight: 300, overflow: 'auto' }}>
            {this.state.showResult}
          </div>
        </Modal>
        <Modal
          title="绘图区域设置"
          width={460}
          destroyOnClose
          visible={this.state.regionVisible}
          onCancel={this.onRegionCancel}
          onOk={this.onRegionOk}
        >
          <RegionConfigForm wrappedComponentRef={formRef => (this.regionFormRef = formRef)} />
        </Modal>
      </div>
    );
  }
}
export default Index;

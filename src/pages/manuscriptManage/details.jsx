import React, { useEffect, useState, useRef } from 'react';
import SelfTree from '@/components/SelfTree';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Breadcrumb,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Radio,
  Select,
  Table,
  message,
  Checkbox,
  DatePicker,
  TreeSelect,
  Layout,
  Modal,
} from 'antd';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { getUrlParams } from '@/utils/utils';
import { cloneDeep, result } from 'lodash';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;
const { TreeNode } = TreeSelect;
const { Content } = Layout;
const { TextArea } = Input;
//const actionBtns = ['删除', '修改', '添加', '不适用', '审核', '反审核'];
const routerPath = {
  linkAd: '/manuscriptSystem/manuscriptManage',
};
/**
 * 目录树：通过子节点获取所有父节点信息
 * treeData：树的数据源
 * 处理为合适的数据格式
 * **/
const valueMap = {};
const findParentNodeLoops = (treeData, parent) => {
  return (treeData || []).map(({ children, value, name, applicability }) => {
    const node = (valueMap[value] = {
      parent,
      value,
      name,
      applicability,
    });
    node.children = findParentNodeLoops(children, node);
    return node;
  });
};
/**
 * 目录树：获取当前点击元素的父节点信息
 * value：当前点击的子节点
 * **/
const findParentNodeGetPath = value => {
  const path = [];
  let current = valueMap[value];
  while (current) {
    if (current.value !== value) {
      path.unshift(current);
    }
    current = current.parent;
  }
  return path;
};

const Index = props => {
  const {
    form: { getFieldsValue, getFieldDecorator, resetFields, setFieldsValue, validateFields },
    dispatch,
    listLoading,
    saveManuscriptDetailInfo,
    saveTreeData,
    saveUpdateTreeData,
  } = props;

  // 多选设置
  const [checkableFlag, setCheckableFlag] = useState(true);
  // 拖动设置
  const [draggableFlag, setDraggableFlag] = useState(true);
  // 多选控制
  const [multipleFlag, setMultipleFlag] = useState(true);
  // 子组件传回点击信息
  const [clickData, setClickData] = useState({});
  // 子组件传回check信息
  const [checkData, setCheckData] = useState({});
  // 添加弹出框
  const [addVisible, setAddVisible] = useState(false);
  // 是否禁止父级目录操作
  const [disableFlag, setDisableFlag] = useState(false);
  // 父级目录是否显示
  const [parentFlag, setParentFlag] = useState(true);
  // 操作按钮
  const [actionBtns, setActionBtns] = useState([
    { label: '添加', code: 'manuscriptManage:treeAdd' },
  ]);
  // 弹出框title
  const [opType, setOpType] = useState('add');
  // 修改时选中的id
  const [id, setId] = useState('');
  // 不适用弹框
  const [noSuitVisible, setNoSuitVisible] = useState(false);
  // 不适用原因
  const [reason, setReason] = useState('');
  const [code, setCode] = useState('');
  // 不适用树选择组
  const [updateTreeList, setUpdateTreeList] = useState('');
  // 不适用树弹框
  const [updateSuitVisible, setUpdateSuitVisible] = useState(false);
  // 请求控制阀
  const [flag, setFlag] = useState(true);
  // 项目目录/系列目录
  const [mode, setMode] = useState('project');
  const [overseasProAreaFlag, setOverseasProAreaFlag] = useState(false);
  const [otherProTypeFlag, setOtherProTypeFlag] = useState(false);

  const treeRef = useRef();
  // 底稿目录管理，详情
  useEffect(() => {
    //const { proCode, checked, mode } = props.location.query;
    const proCode = getUrlParams('proCode');
    const checked = getUrlParams('checked');
    const mode = getUrlParams('mode');
    if (mode) {
      setMode(mode);
    }
    if (proCode) {
      handleGetItemInfo(proCode);
      handleGetTreeData(proCode);
      setCode(proCode);
    }
    if (checked) {
      // 审核状态下，只有反审核按钮
      if (checked == 1) {
        setActionBtns([{ label: '反审核', code: 'manuscriptManage:reAudit' }]);
      } else {
        setActionBtns([
          { label: '删除', code: 'manuscriptManage:treeDelete' },
          { label: '修改', code: 'manuscriptManage:treeUpdate' },
          { label: '添加', code: 'manuscriptManage:treeAdd' },
          { label: '不适用', code: 'manuscriptManage:treeApply' },
          { label: '不适用修改', code: 'manuscriptManage:treeRevApply' },
          { label: '审核', code: 'manuscriptManage:audit' },
        ]);
      }
    }
  }, []);

  /** ******************************************************************************** */

  // 获取树
  const handleGetTreeData = code => {
    dispatch({
      type: 'manuscriptManage/handleGetTreeInfo',
      payload: { code },
    });
  };

  // 添加树节点
  const handleAddNodeFetch = params => {
    dispatch({
      type: 'manuscriptBasicSov/handleAddTreeInfo',
      payload: { ...params },
    }).then(data => {
      setFlag(true);
      if (data) {
        setAddVisible(false);
        setDisableFlag(false);
        setParentFlag(true);
        // 修改form信息
        let newMsg = cloneDeep(clickData);
        newMsg.name = params.pathCode + ' ' + params.pathName;
        setClickData(newMsg);
        handleGetTreeData(code);
        setFieldsValue({
          parentId: '',
          pathCode: '',
          pathName: '',
          orderNum: '',
        });
      }
    });
  };

  // 根据proCode查详情
  const handleGetItemInfo = proCode => {
    dispatch({
      type: 'manuscriptManage/handleGetItemInfoFetch',
      payload: proCode,
    }).then(data => {
      if (data) {
        setFieldsValue({
          proCode: data.proCode,
          proName: data.proName,
          proShortName: data.proShortName,
          proType: data.proTypeName,
          otherProType: data.otherProType,
          proArea: data.proAreaName,
          overseasProArea: data.overseasProArea,
          proDept: data.proDept,
          setUpTime: moment(data.setUpTime),
          proDesc: data.proDesc,
          proBusType: data.proBusType === '1' ? '管理人项目' : '非管理人项目',
          biddingFlag: data.biddingFlag,
          productPeriod: data.productPeriod,
        });
        if (data.overseasProArea) {
          setOverseasProAreaFlag(true);
        }
        if (data.otherProType) {
          setOtherProTypeFlag(true);
        }
      }
    });
  };

  /**
   * 为操作列表按钮，绑定事件
   * @param {*} label
   * @param {*} record
   */
  const handleEdit = value => {
    const { parentId, name, orderNum } = clickData;
    const cCode = clickData.code;
    const pathCode = name && name.split(' ')[0];
    const pathName = name && name.split(' ')[1];
    let status;
    // source：0：标准目录；1：自定义目录；标准目录不可修改，删除
    switch (value) {
      case '删除':
        if (!checkData.checkedKeys || !checkData.checkedKeys.length) {
          message.warn('请勾选要删除的节点');
          return;
        }
        if (checkData) {
          console.log(checkData.dataSource);
          for (var item of checkData.dataSource) {
            if (item.value == 0) {
              message.warn('标准目录不可删除');
              return;
            }
          }
        }
        confirm({
          title: '确定删除所选节点吗?',
          content: '',
          onOk() {
            // 删除点击确定后，清空下勾选数据和点选数据
            treeRef.current.handleReset();
            dispatch({
              type: 'manuscriptBasicSov/handleDeleteTreeInfo',
              payload: checkData.checkedKeys,
            }).then(data => {
              if (data) {
                handleGetTreeData(code);
              }
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case '修改':
        if (!clickData.code) return message.warn('请选择1个修改的节点');
        if (clickData.dataSource == 0) return message.warn('标准目录不可修改');
        if (clickData.applicability == 0) return message.warn('不适用目录不可修改~');
        setOpType('edit');
        setDisableFlag(true);

        const id = cCode;
        setId(id);

        if (clickData.parentId == -1) {
          setParentFlag(false);
        }
        setAddVisible(true);
        setFieldsValue({ parentId, pathCode, pathName });
        break;
      case '添加':
        setOpType('add');
        setId('');
        setAddVisible(true);
        setParentFlag(true);
        setDisableFlag(false);
        if (clickData) {
          setFieldsValue({ parentId: cCode, pathCode: '', pathName: '' });
        }
        break;
      case '不适用':
        if (!checkData.checkedKeys || !checkData.checkedKeys.length) {
          message.warn('请勾选节点');
          return;
        }
        // 如果勾选节点中有不适用目录，给出提示
        for (const item of checkData.dataSource) {
          if (item.applicability === 0) {
            message.warn('勾选节点中含有不适用目录');
            return;
          }
        }
        setNoSuitVisible(true);
        break;
      case '审核':
        status = 1;
        dispatch({
          type: 'manuscriptManage/handleAudit',
          payload: { proCode: code, status, type: mode === 'project' ? 1 : 0 },
        }).then(data => {
          if (data) {
            // dispatch(
            //   routerRedux.push({
            //     pathname: routerPath.linkAd,
            //   }),
            // );
            setActionBtns([{ label: '反审核', code: 'manuscriptManage:reAudit' }]);
          }
        });
        break;
      case '反审核':
        status = 0;
        dispatch({
          type: 'manuscriptManage/handleAudit',
          payload: { proCode: code, status, type: mode === 'project' ? 1 : 0 },
        }).then(data => {
          if (data) {
            // dispatch(
            //   routerRedux.push({
            //     pathname: routerPath.linkAd,
            //   }),
            // );
            setActionBtns([
              { label: '删除', code: 'manuscriptManage:treeDelete' },
              { label: '修改', code: 'manuscriptManage:treeUpdate' },
              { label: '添加', code: 'manuscriptManage:treeAdd' },
              { label: '不适用', code: 'manuscriptManage:treeApply' },
              { label: '不适用修改', code: 'manuscriptManage:treeRevApply' },
              { label: '审核', code: 'manuscriptManage:audit' },
            ]);
          }
        });
        break;
      case '不适用修改':
        setUpdateSuitVisible(true);
        setUpdateTreeList('');
        dispatch({
          type: 'manuscriptManage/handleGetUpdateTreeInfo',
          payload: code,
          callback: treeData => {
            findParentNodeLoops(treeData);
          },
        });
        break;
    }
  };

  // 树选择器，值改变
  const treeSelectChange = value => {
    setFieldsValue({ parentId: value, pathCode: '', pathName: '' });
  };

  /**
   * 方法说明 循环生成select
   * @method  handleMapList
   * @return {void}
   * @param  {Object[]}       data 数据源
   * @param  {string}         name   select的name
   * @param  {string}         code  select的code
   * @param  {boolean|string} mode  是否可以多选(设置 Select 的模式为多选或标签)
   * @param  {boolean}        fnBoole 选择时函数控制
   * @param  {function}       fn 控制函数
   */
  const handleMapList = (data, code, name, mode = false, fnBoole = false, fn) => {
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
          disabled
        >
          {children}
        </Select>
      );
    }
  };

  // 日期选择
  const onChangeRangeTime = (value, dateString) => {
    console.log(value, dateString);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  // 树
  const onChangeTree = values => {
    console.log(values);
  };

  // 操作按钮
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map(item => {
      return (
        <Action code={item.code}>
          <Button
            key={item.code}
            type={item.label === '删除' ? 'danger' : 'default'}
            style={{ marginRight: 8 }}
            onClick={() => {
              props.handlerBack(item.label);
            }}
          >
            {item.label}
          </Button>
        </Action>
      );
    });
    return child;
  };

  // 获取子组件点击信息
  const getClickMsg = (result, msg) => {
    // console.log(result, msg);
    setClickData(msg);
  };
  // 获取子组件check信息
  const getCheckMsg = (result, msg) => {
    // console.log(result, msg);
    setCheckData(msg);
  };
  // 拖动树结构
  const dragTree = (result, data) => {
    //console.log(data);
    if (data) {
      dispatch({
        type: 'manuscriptManage/handleDragTree',
        payload: data,
      });
    }
  };

  const FormAttrbuite = () => {
    return (
      <div>
        <FormItem label="父级目录" style={{ display: parentFlag ? '' : 'none' }}>
          {getFieldDecorator(
            'parentId',
            {},
          )(
            <TreeSelect
              style={{ width: '100%' }}
              // value={treeSelectValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={saveTreeData}
              placeholder="请选择父级目录"
              treeDefaultExpandAll
              onChange={treeSelectChange}
              disabled={disableFlag}
            />,
          )}
        </FormItem>
        <FormItem label="目录编码">
          {getFieldDecorator('pathCode', {
            rules: [
              {
                required: true,
                message: '目录编码不能为空',
              },
            ],
            getValueFromEvent: event => {
              return event.target.value.replace(/\s+/g, '');
            },
          })(<Input placeholder="请输入目录编码" />)}
        </FormItem>
        <FormItem label="目录名称">
          {getFieldDecorator('pathName', {
            rules: [
              {
                required: true,
                message: '目录名称不能为空',
              },
            ],
            getValueFromEvent: event => {
              return event.target.value.replace(/\s+/g, '');
            },
          })(<Input placeholder="请输入目录名称" />)}
        </FormItem>
        {/* <FormItem label="目录顺序">
          {getFieldDecorator('orderNum', {})(<Input placeholder="请输入目录顺序" />)}
        </FormItem> */}
      </div>
    );
  };

  // 父节点下的文件状态判断
  const handleParentNodeFileState = pathId => {
    return new Promise(resolve => {
      dispatch({
        type: 'taskManagementDeal/getFileStateByPathReq',
        payload: {
          pathId,
        },
      }).then(res => {
        if (res && res.status === 200) {
          const { state, pathName } = res.data;
          switch (state) {
            case 'prohibit':
              message.warn(`${pathName} 禁止作为父级目录~`);
              resolve(false);
              return;
            case 'prompt':
              message.warn(`${pathName} 节点下有文档，调整后节点文档也随之删除，是否调整？`);
              resolve(false);
              return;
            case 'noApplicability':
              message.warn(`${pathName} 节点为不适用目录，不能作为父级目录~`);
              resolve(false);
              return;
            case 'ok':
              resolve(true);
              return;
          }
        }
      });
    });
  };

  // 添加-确认
  const handleAdd = () => {
    if (flag) {
      validateFields((err, values) => {
        const { parentId, pathCode, pathName } = values;
        if (err) return;
        if (!parentId) values.parentId = '-1';
        if (pathCode.length > 20) return message.warn('目录编码长度不可超过20');
        if (pathName.length > 50) return message.warn('目录名称长度不可超过50');
        if (values.parentId !== '-1') {
          handleParentNodeFileState(values.parentId).then(bool => {
            if (bool) {
              setAddVisible(false);
              setFlag(false);
              handleAddNodeFetch({ ...values, proCode: code, opType, id });
            }
          });
          return;
        }
        setAddVisible(false);
        setFlag(false);
        handleAddNodeFetch({ ...values, proCode: code, opType, id });
      });
    }
  };

  // 不适用-确认
  const handleSuit = () => {
    if (!reason) {
      message.warn('请填写不适用原因');
      return;
    }
    dispatch({
      type: 'manuscriptManage/handleSetPathFetch',
      payload: { code: checkData.checkedKeys, applicability: '0', reason: reason },
    }).then(data => {
      if (data) {
        setNoSuitVisible(false);
        setReason('');
        handleGetTreeData(code);
      }
    });
  };

  // 不适用原因--输入框
  const handleReasonChange = e => {
    setReason(e.target.value);
  };

  // 不适用树选择
  const updateTreeSelectChange = value => {
    setUpdateTreeList(value);
  };

  // 不适用树弹框确认
  const handleUpdateSuit = () => {
    const parentNodeArr = findParentNodeGetPath(updateTreeList);
    if (!updateTreeList) return message.warn('请选择目录~');
    if (parentNodeArr.some(item => item.applicability === 0))
      return message.warn(
        '父级目录不适用，无法调整子级目录。若要调整子级目录，请先将父级目录不适用修改~',
      );

    dispatch({
      type: 'manuscriptManage/handleSetPathFetch',
      payload: { code: [updateTreeList], applicability: '1', reason: '' },
    }).then(data => {
      if (data) {
        setUpdateSuitVisible(false);
        handleGetTreeData(code);
      }
    });
  };

  // 树选择器
  const loopTree = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.id}
            title={
              <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
                {item.title}
              </span>
            }
            value={item.id}
            disabled={item.applicability == 0 ? false : true}
          >
            {loopTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={
            <span style={{ textDecoration: item.applicability == 0 ? 'line-through' : '' }}>
              {item.title}
            </span>
          }
          value={item.id}
          disabled={item.applicability == 0 ? false : true}
        ></TreeNode>
      );
    });

  // 取消
  const handleBackPage = () => {
    dispatch(
      routerRedux.push({
        pathname: '/manuscriptSystem/manuscriptManage',
        query: { mode: mode },
      }),
    );
  };

  return (
    <PageHeaderWrapper className={styles.parentBox} title="底稿目录管理/详情" breadcrumb={{}}>
      <Layout>
        <Content style={{ margin: '20px 20px 0 20px' }}>
          <Card
            title={
              <Breadcrumb>
                <Breadcrumb.Item>项目底稿目录管理</Breadcrumb.Item>
                <Breadcrumb.Item>{`${
                  mode === 'project' ? '项目' : '系列'
                }目录详情`}</Breadcrumb.Item>
              </Breadcrumb>
            }
            extra={<Button onClick={handleBackPage}>取消</Button>}
          >
            <div
              style={{
                height: 'calc(100vh - 196px)',
                overflowY: 'auto',
              }}
            >
              <div className={styles.title}>项目信息</div>
              <Form {...formItemLayout} className={styles.list}>
                <Row
                  gutter={{
                    md: 8,
                    lg: 24,
                    xl: 48,
                  }}
                  type="flex"
                  justify="start"
                >
                  <Col md={8} sm={24}>
                    <FormItem label={mode === 'project' ? '项目编码' : '系列编码'}>
                      {getFieldDecorator('proCode', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        // initialValue: saveManuscriptDetailInfo.proCode,
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label={mode === 'project' ? '项目名称' : '系列名称'}>
                      {getFieldDecorator('proName', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        initialValue: saveManuscriptDetailInfo.proName,
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: mode === 'project' ? '' : 'none' }}>
                    <FormItem label="项目简称">
                      {getFieldDecorator('proShortName', {
                        initialValue: saveManuscriptDetailInfo.proShortName,
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="项目类型">
                      {getFieldDecorator('proType', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        initialValue: saveManuscriptDetailInfo.proTypeName,
                      })(handleMapList([], 'code', 'name', 'multiple'))}
                    </FormItem>
                  </Col>
                  <Col
                    md={8}
                    sm={24}
                    style={{
                      display: otherProTypeFlag ? '' : 'none',
                    }}
                  >
                    <FormItem label="其他项目类型">
                      {getFieldDecorator('otherProType', {
                        initialValue: saveManuscriptDetailInfo.otherProType,
                      })(<Input placeholder="请输入内容" disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="项目区域">
                      {getFieldDecorator('proArea', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        initialValue: saveManuscriptDetailInfo.proAreaName,
                      })(<Input placeholder="" disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: overseasProAreaFlag ? '' : 'none' }}>
                    <FormItem label="境外区域名称">
                      {getFieldDecorator('overseasProArea', {
                        initialValue: saveManuscriptDetailInfo.overseasProArea,
                      })(<Input placeholder="" disabled />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="所属部门">
                      {getFieldDecorator('proDept', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        initialValue: saveManuscriptDetailInfo.proDept,
                      })(handleMapList([], 'code', 'name', 'multiple'))}
                    </FormItem>
                  </Col>
                  {mode === 'project' ? (
                    <Col md={8} sm={24}>
                      <FormItem label="项目期次">
                        {getFieldDecorator('productPeriod', {
                          initialValue: saveManuscriptDetailInfo.productPeriod,
                        })(<Input disabled />)}
                      </FormItem>
                    </Col>
                  ) : null}
                  <Col md={8} sm={24} style={{ display: mode === 'project' ? '' : 'none' }}>
                    <FormItem label="开始日期">
                      {getFieldDecorator('setUpTime', {
                        initialValue: moment(saveManuscriptDetailInfo.setUpTime),
                      })(
                        <DatePicker
                          showTime={{ format: 'YYYY-MM-DD' }}
                          format="YYYY-MM-DD"
                          placeholder=""
                          onChange={onChangeRangeTime}
                          disabled
                        />,
                      )}
                    </FormItem>
                  </Col>
                  <Col
                    md={24}
                    sm={24}
                    style={{ display: mode === 'project' ? '' : 'none' }}
                    className={styles.descCss}
                  >
                    <Form.Item
                      label="项目描述"
                      labelCol={{ span: 2 }}
                      wrapperCol={{ span: 21, offset: 0 }}
                    >
                      {getFieldDecorator('proDesc', {
                        initialValue: saveManuscriptDetailInfo.proDesc,
                      })(<TextArea rows={4} disabled />)}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24} style={{ display: mode === 'project' ? '' : 'none' }}>
                    <FormItem label="项目分类">
                      {getFieldDecorator('proBusType', {
                        rules: [
                          {
                            required: true,
                            message: '必填项',
                          },
                        ],
                        initialValue: saveManuscriptDetailInfo.proBusType,
                      })(handleMapList([], 'code', 'name', 'multiple'))}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: mode === 'project' ? '' : 'none' }}>
                    <FormItem label="是否招投标">
                      {getFieldDecorator('biddingFlag', {
                        // rules: [
                        //   {
                        //     required: true,
                        //     message: '必填项',
                        //   },
                        // ],
                        initialValue: saveManuscriptDetailInfo.biddingFlag,
                      })(
                        <Radio.Group disabled>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <div className={styles.operate}>
                <div className={styles.title}>目录设置</div>
                <div className={styles.wrapButton}>
                  <ActionButton buttonList={actionBtns} handlerBack={handleEdit}></ActionButton>
                </div>
              </div>
              <SelfTree
                treeData={saveTreeData}
                draggableFlag={draggableFlag}
                checkableFlag={checkableFlag}
                multipleFlag={multipleFlag}
                getClickMsg={getClickMsg}
                getCheckMsg={getCheckMsg}
                dragTree={dragTree}
                ref={treeRef}
              />
            </div>
          </Card>
          <Modal
            title={opType === 'add' ? '添加' : '修改'}
            visible={addVisible}
            onOk={handleAdd}
            onCancel={() => {
              setAddVisible(false);
            }}
          >
            <Form {...formItemLayout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>{FormAttrbuite()}</Row>
            </Form>
          </Modal>
          <Modal
            title={'不适用'}
            visible={noSuitVisible}
            onOk={handleSuit}
            onCancel={() => {
              setNoSuitVisible(false);
              setReason('');
            }}
          >
            <TextArea
              rows={4}
              maxLength={200}
              placeholder={'请填写不适用原因'}
              value={reason}
              onChange={handleReasonChange}
            />
          </Modal>
          <Modal
            title={'适用性修改'}
            visible={updateSuitVisible}
            onOk={handleUpdateSuit}
            onCancel={() => {
              setUpdateSuitVisible(false);
            }}
          >
            <TreeSelect
              style={{ width: '100%' }}
              value={updateTreeList}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              // treeData={saveUpdateTreeData}
              placeholder="请选择目录"
              treeDefaultExpandAll
              // multiple
              onChange={updateTreeSelectChange}
            >
              {loopTree(saveUpdateTreeData)}
            </TreeSelect>
          </Modal>
        </Content>
      </Layout>
    </PageHeaderWrapper>
  );
};

const manuscriptDetail = state => {
  const {
    dispatch,
    manuscriptManage: { saveTreeData, saveManuscriptDetailInfo, saveUpdateTreeData },
  } = state;
  return {
    dispatch,
    saveTreeData,
    saveManuscriptDetailInfo,
    saveUpdateTreeData,
  };
};

export default linkHoc()(Form.create()(connect(manuscriptDetail)(Index)));

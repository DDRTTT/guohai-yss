import React, { useEffect, useState, useRef } from 'react';
import SelfTree from '@/components/SelfTree';
import { routerRedux } from 'dva/router';
import {
  Button,
  Breadcrumb,
  Form,
  Row,
  Col,
  Modal,
  Input,
  Select,
  Spin,
  message,
  TreeSelect,
} from 'antd';
import Action, { linkHoc } from '@/utils/hocUtil';
import { getUrlParams } from '@/utils/utils';
import { connect } from 'dva';
import styles from './index.less';
import { cloneDeep } from 'lodash';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const routerPath = {
  linkAd: '/manuscriptSystem/manuscriptBasic',
};
// 列表信息
let listMsg = [];

const Index = props => {
  const {
    dispatch,
    saveTreeData,
    saveWordDictionaryFetch,
    form: { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue },
  } = props;

  // 多选设置
  const [checkableFlag, setCheckableFlag] = useState(true);
  // 拖动设置
  const [draggableFlag, setDraggableFlag] = useState(true);
  // 多选控制
  const [multipleFlag, setMultipleFlag] = useState(true);
  // 添加弹出框
  const [addVisible, setAddVisible] = useState(false);
  // 是否禁止父级目录操作
  const [disableFlag, setDisableFlag] = useState(false);
  // 父级目录是否显示
  const [parentFlag, setParentFlag] = useState(true);
  // 子组件传回点击信息
  const [clickData, setClickData] = useState({});
  // 子组件传回check信息
  const [checkData, setCheckData] = useState({});
  // 操作按钮显示
  const [operateFlag, setOperateFlag] = useState(true);
  // 业务类型
  const [code, setCode] = useState('');
  // 产品代码
  const [checkProCode, setCheckProCode] = useState('');
  // 操作按钮
  const [actionBtns, setActionBtns] = useState([{ label: '取消', code: 'manuscriptBasic:cancel' }]);
  // 弹出框title
  const [opType, setOpType] = useState('add');
  // 修改时选中的id
  const [id, setId] = useState('');
  // 请求控制阀
  const [flag, setFlag] = useState(true);
  // 面包屑名称
  const [bread, setBread] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [pathCodeValue, setPathCodeValue] = useState('');

  /**
   * 组件配置
   */
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

  /** *************************************************************** */
  const treeRef = useRef();
  // 底稿基础设置
  useEffect(() => {
    handleGetDictFetch('awp_pro_type');
    handleGetListFetch(100, 1);
    const view = getUrlParams('view');
    const proCode = getUrlParams('proCode');
    //const { view, proCode } = props.location.query;
    if (!proCode) {
      setBread(false);
    }
    if (view === 'update') {
      setOperateFlag(false);
      setActionBtns([
        { label: '添加', code: 'manuscriptBasic:treeAdd' },
        { label: '取消', code: 'manuscriptBasic:cancel' },
      ]);
    } else if (view === 'reverseAudit') {
      setActionBtns([
        { label: '反审核', code: 'manuscriptBasic:reAudit' },
        { label: '取消', code: 'manuscriptBasic:cancel' },
      ]);
    } else {
      setActionBtns([
        { label: '添加', code: 'manuscriptBasic:treeAdd' },
        { label: '修改', code: 'manuscriptBasic:treeUpdate' },
        { label: '删除', code: 'manuscriptBasic:treeDelete' },
        { label: '审核', code: 'manuscriptBasic:audit' },
        { label: '取消', code: 'manuscriptBasic:cancel' },
      ]);
    }
    if (proCode) {
      setCode(proCode);
      setCheckProCode(proCode);
      handleGetTreeData(proCode);
    } else {
      handleGetTreeData('');
      setActionBtns([{ label: '取消', code: 'manuscriptBasic:cancel' }]);
    }
  }, []);

  // 获取列表信息
  const handleGetListFetch = (pageSize = pageSize, pageNum = pageNum) => {
    dispatch({
      type: 'manuscriptBasic/handleGetListMsg',
      payload: {
        pageSize,
        pageNum,
      },
    }).then(data => {
      if (data) {
        listMsg = data.pathList;
      }
    });
  };

  // 字典
  const handleGetDictFetch = codeList => {
    dispatch({
      type: 'manuscriptBasicSov/handleWordDictionaryFetch',
      payload: { codeList },
    });
  };

  // 获取树
  const handleGetTreeData = code => {
    dispatch({
      type: 'manuscriptBasicSov/handleGetTreeInfo',
      payload: { code },
    });
  };

  // 添加树节点
  const handleAddNodeFetch = params => {
    setSpinning(true);
    dispatch({
      type: 'manuscriptBasicSov/handleAddTreeInfo',
      payload: { ...params },
    }).then(data => {
      setSpinning(false);
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
        });
      }
    });
  };

  // 树选择器，值改变
  const treeSelectChange = value => {
    console.log('value:::===========', value);
    // setTreeSelectValue(value);
    setFieldsValue({ parentId: value });
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
        >
          {children}
        </Select>
      );
    }
  };

  // 业务类型选择
  const handleTypeSelect = value => {
    setCode(value);
    setCheckProCode(value);
    handleGetTreeData(value);
    // 根据不同的业务类型按钮不同
    if (listMsg.length) {
      const option = listMsg.filter(item => {
        return item.proCode === value;
      });
      if (option.length && option[0].checked === '已审核') {
        setActionBtns([
          { label: '反审核', code: 'manuscriptBasic:reAudit' },
          { label: '取消', code: 'manuscriptBasic:cancel' },
        ]);
      } else {
        setActionBtns([
          { label: '添加', code: 'manuscriptBasic:treeAdd' },
          { label: '修改', code: 'manuscriptBasic:treeUpdate' },
          { label: '删除', code: 'manuscriptBasic:treeDelete' },
          { label: '审核', code: 'manuscriptBasic:audit' },
          { label: '取消', code: 'manuscriptBasic:cancel' },
        ]);
      }
    }
  };

  // 操作按钮
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map(item => {
      return (
        <Action code={item.code}>
          <Button
            key={item.label}
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

  // 为操作按钮绑定事件
  const handleEdit = value => {
    //const { proCode } = props.location.query;
    const { saveTreeData } = props;
    const proCode = getUrlParams('proCode');
    const { parentId, code, name, orderNum } = clickData;
    const pathCode = name && name.split(' ')[0];
    const pathName = name && name.split(' ')[1];

    if (!saveTreeData.length && value !== '取消' && value !== '重置') {
      return message.warn('当前业务类型下没有目录');
    }
    switch (value) {
      case '删除':
        if (!checkData.checkedKeys || !checkData.checkedKeys.length) {
          message.warn('请勾选要删除的节点');
          return;
        }
        if (checkData) {
          console.log(checkData.dataSource);
          for (var item of checkData.dataSource) {
            if (item == 0) {
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
            setSpinning(true);
            dispatch({
              type: 'manuscriptBasicSov/handleDeleteTreeInfo',
              payload: checkData.checkedKeys,
            }).then(data => {
              if (data) {
                setSpinning(false);
                handleGetTreeData(checkProCode);
              }
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case '修改':
        console.log(clickData);
        if (!clickData.code) {
          message.warn('请选择1个修改的节点');
          return;
        }
        if (clickData) {
          console.log(clickData.dataSource);
          if (clickData.dataSource == 0) {
            message.warn('标准目录不可修改');
            return;
          }
        }
        setOpType('edit');
        setDisableFlag(true);
        const id = code;
        setId(id);
        if (clickData.parentId == -1) {
          setParentFlag(false);
        }
        setAddVisible(true);
        setFieldsValue({ parentId, pathCode, pathName });
        break;
      case '添加':
        if (!checkProCode) {
          message.warn('请选择业务类型');
          return;
        }
        setOpType('add');
        setId('');
        setAddVisible(true);
        setParentFlag(true);
        setDisableFlag(false);
        if (clickData) {
          setFieldsValue({ parentId: code, pathCode: '', pathName: '' });
        }
        break;
      case '审核':
        if (!checkProCode) {
          message.warn('请选择业务类型');
          return;
        }
        status = 1;
        setSpinning(true);
        dispatch({
          type: 'manuscriptBasic/handleAudit',
          // payload: { proCode: proCode, status },
          payload: { proCode: checkProCode, status },
        }).then(data => {
          if (data) {
            setSpinning(false);
            dispatch(
              routerRedux.push({
                pathname: routerPath.linkAd,
              }),
            );
          }
        });
        break;
      case '反审核':
        if (!checkProCode) {
          message.warn('请选择业务类型');
          return;
        }
        status = 0;
        setSpinning(true);
        dispatch({
          type: 'manuscriptBasic/handleAudit',
          payload: { proCode: checkProCode, status },
        }).then(data => {
          if (data) {
            setSpinning(false);
            // dispatch(
            //   routerRedux.push({
            //     pathname: routerPath.linkAd,
            //   }),
            // );
            setActionBtns([
              { label: '添加', code: 'manuscriptManage:treeAdd' },
              { label: '修改', code: 'manuscriptManage:treeUpdate' },
              { label: '删除', code: 'manuscriptManage:treeDelete' },
              { label: '审核', code: 'manuscriptManage:audit' },
              { label: '取消', code: 'manuscriptBasic:cancel' },
            ]);
          }
        });
        break;
      case '重置':
        treeRef.current.handleReset();
        break;
      case '取消':
        dispatch(
          routerRedux.push({
            pathname: routerPath.linkAd,
          }),
        );
        break;
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

  // 添加-确认
  const handleAdd = () => {
    if (flag) {
      validateFields(values => {
        if (!values) {
          values = getFieldsValue();
        }
        if (!values.parentId) {
          values.parentId = '-1';
        }
        // pathCode:20,pathName:50;
        if (values.pathCode.length > 20) {
          message.warn('目录编码长度不可超过20');
          return;
        }
        if (values.pathName.length > 50) {
          message.warn('目录名称长度不可超过50');
          return;
        }
        if (!values.pathCode.errors && !values.pathName.errors) {
          setAddVisible(false);
          setFlag(false);
          handleAddNodeFetch({ ...values, proCode: code, opType: opType, id: id });
        }
      });
    }
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
    console.log(data);
    if (data) {
      dispatch({
        type: 'manuscriptManage/handleDragTree',
        payload: data,
      });
    }
  };

  return (
    <Spin spinning={spinning}>
      <div className={styles.saveOrView}>
        <Col md={24} sm={12} className={styles.titleCss}>
          <Breadcrumb>
            <Breadcrumb.Item>底稿标准目录配置</Breadcrumb.Item>
            <Breadcrumb.Item>{bread ? '详情' : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <div style={{ padding: '10px' }}>
          <h3 className={styles.h3Css}>标准目录{operateFlag ? '设置' : '更新'}</h3>
          <div className={styles.operate}>
            <div>
              <span style={{ marginRight: '10px' }}>业务类型:</span>
              <Select style={{ width: 250 }} onChange={handleTypeSelect} value={code}>
                {(saveWordDictionaryFetch['awp_pro_type'] || []).map(item => {
                  return (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className={styles.wrapButton}>
              <ActionButton buttonList={actionBtns} handlerBack={handleEdit}></ActionButton>
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 324px)', overflowY: 'auto' }}>
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
        </div>
        {/* 添加弹出框 */}
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
      </div>
    </Spin>
  );
};
const manuscriptBasicSov = state => {
  const {
    dispatch,
    manuscriptBasicSov: { saveTreeData, saveWordDictionaryFetch },
  } = state;
  return {
    dispatch,
    saveTreeData,
    saveWordDictionaryFetch,
  };
};

export default linkHoc()(Form.create()(connect(manuscriptBasicSov)(Index)));

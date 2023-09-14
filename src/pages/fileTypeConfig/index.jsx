// 档案类别管理页面
import React, { useEffect, useState, useRef } from 'react';
import SelfTree from '@/pages/lifeCyclePRD/compoments/SelfTree';
import moment from 'moment';
import { connect } from 'dva';
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Select,
  message,
  Spin,
  TreeSelect,
  Modal,
} from 'antd';
import { routerRedux } from 'dva/router';
import { getUrlParams } from '@/utils/utils';
import styles from '@/pages/electronicRecord/index.less';
import PageContainer from '@/components/PageContainers';

const FormItem = Form.Item;
const { confirm } = Modal;
const routerPath = {
  linkAd: 'electronic/electronicRecord',
};

const Index = props => {
  const {
    form: { getFieldsValue, getFieldDecorator, setFieldsValue, validateFields },
    dispatch,
    saveAllTreeData,
  } = props;

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
    { label: '添加', code: '1' },
    { label: '修改', code: '2' },
  ]);
  // 弹出框title
  const [opType, setOpType] = useState('add');
  // 修改时选中的id
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  // 请求控制阀
  const [flag, setFlag] = useState(true);
  // 档案管理来源
  const [mode, setMode] = useState('1');

  const treeRef = useRef();
  // 底稿目录管理，详情
  useEffect(() => {
    //handleGetTreeData('-1');
    handleGetAllTreeData();
    const type = getUrlParams('type');
    setMode(type);
  }, []);

  /** ******************************************************************************** */

  // 获取树分级查
  const handleGetTreeData = id => {
    dispatch({
      type: 'electronicRecord/handleGetTreeInfo',
      payload: { id },
    });
  };
  // 获取树整个
  const handleGetAllTreeData = () => {
    dispatch({
      type: 'electronicRecord/handleGetAllTreeInfo',
      payload: '',
    });
  };

  // 添加树节点
  const handleAddNodeFetch = params => {
    let type = '';
    if (params.opType === 'add') {
      type = 'electronicRecord/handleAddTreeInfo';
    } else {
      type = 'electronicRecord/handleEditeTreeInfo';
    }
    dispatch({
      type: type,
      payload: { ...params },
    }).then(data => {
      setFlag(true);
      if (data) {
        setAddVisible(false);
        setDisableFlag(false);
        setParentFlag(true);
        handleGetAllTreeData();
        setFieldsValue({
          parentId: '',
          fileTypeCode: '',
          fileTypeName: '',
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
    const fileTypeCode = clickData.fileTypeCode;
    const fileTypeName = clickData.title;
    let status;
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
        console.log(clickData);
        if (!clickData.code) {
          message.warn('请选择1个修改的节点');
          return;
        }
        if (clickData) {
          console.log(clickData);
        }
        setOpType('edit');
        setDisableFlag(true);

        const id = cCode;
        setId(id);

        if (clickData.parentId == -1) {
          setParentFlag(false);
        } else {
          setParentFlag(true);
        }
        setAddVisible(true);
        setFieldsValue({ parentId, fileTypeCode, fileTypeName });
        break;
      case '添加':
        setOpType('add');
        setId('');
        setAddVisible(true);
        setParentFlag(true);
        setDisableFlag(false);
        if (clickData) {
          setFieldsValue({ parentId: cCode, fileTypeCode: '', fileTypeName: '' });
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
            //     fileTypeName: routerPath.linkAd,
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
            //     fileTypeName: routerPath.linkAd,
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
        console.log(code);
        dispatch({
          type: 'manuscriptManage/handleGetUpdateTreeInfo',
          payload: code,
        });
        break;
    }
  };

  // 树选择器，值改变
  const treeSelectChange = value => {
    console.log(value);
    // setTreeSelectValue(value);
    setFieldsValue({ parentId: value, fileTypeCode: '', fileTypeName: '' });
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

  const handleImportByList = () => {};

  // 操作按钮
  const ActionButton = props => {
    const { buttonList } = props;
    const child = buttonList.map(item => {
      return (
        // <Action code={item.code}>
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
        // </Action>
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
        <FormItem label="父级档案类别" style={{ display: parentFlag ? '' : 'none' }}>
          {getFieldDecorator(
            'parentId',
            {},
          )(
            <TreeSelect
              style={{ width: '100%' }}
              // value={treeSelectValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={saveAllTreeData}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={treeSelectChange}
              disabled={disableFlag}
            />,
          )}
        </FormItem>
        <FormItem label="档案类别编码">
          {getFieldDecorator('fileTypeCode', {
            rules: [
              {
                required: true,
                message: '档案类别编码不能为空',
              },
            ],
            getValueFromEvent: event => {
              return event.target.value.replace(/[^a-zA-Z]/g, '');
            },
          })(<Input placeholder="请输入英文档案类别编码" disabled={disableFlag} />)}
        </FormItem>
        <FormItem label="档案类别名称">
          {getFieldDecorator('fileTypeName', {
            rules: [
              {
                required: true,
                message: '档案类别名称不能为空',
              },
            ],
            getValueFromEvent: event => {
              return event.target.value.replace(/\s+/g, '');
            },
          })(<Input placeholder="请输入档案类别名称" />)}
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
        // fileTypeCode:20,fileTypeName:50;
        if (values.fileTypeCode.length > 50) {
          message.warn('档案类别编码长度不可超过50');
          return;
        }
        if (values.fileTypeName.length > 50) {
          message.warn('档案类别名称长度不可超过50');
          return;
        }
        if (!values.fileTypeCode.errors && !values.fileTypeName.errors) {
          setFlag(false);
          handleAddNodeFetch({
            ...values,
            opType: opType,
            id: opType === 'add' ? values.parentId : clickData.code,
          });
        }
      });
    }
  };

  // 取消
  const handleBackPage = () => {
    dispatch(
      routerRedux.push({
        pathname: routerPath.linkAd,
        query: { type: mode },
      }),
    );
  };

  return (
    <>
      <PageContainer/>
      <Spin spinning={!flag}>
        <Card
          style={{
            height: 'calc(100vh - 196px)',
            overflowY: 'auto',
          }}
        >
          <div className={styles.operate}>
            <div className={styles.wrapButton}>
              <ActionButton buttonList={actionBtns} handlerBack={handleEdit}></ActionButton>
            </div>
          </div>
          <SelfTree
            treeData={saveAllTreeData}
            draggableFlag
            checkable
            getClickMsg={getClickMsg}
            getCheckMsg={getCheckMsg}
            syncFlag={true}
            syncParam={'id'}
            typeUri={'electronicRecord/handleGetTreeNodesInfo'}
          />
        </Card>
      </Spin>

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
      {/*   <Modal
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
          placeholder={'请填写不适用原因'}
          value={reason}
          onChange={handleReasonChange}
        />
      </Modal> */}
    </>
  );
};

const electronicRecord = state => {
  const {
    dispatch,
    electronicRecord: { saveTreeData, saveAllTreeData },
  } = state;
  return {
    dispatch,
    saveTreeData,
    saveAllTreeData,
  };
};

export default Form.create()(connect(electronicRecord)(Index));

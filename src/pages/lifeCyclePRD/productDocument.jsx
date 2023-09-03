import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  Table,
  message,
  Modal,
  Checkbox,
  DatePicker,
  TreeSelect,
  Layout,
  Breadcrumb,
} from 'antd';
import { routerRedux } from 'dva/router';
import SelfTree from '@/components/SelfTree';
import { downloadNoToken, filePreview } from '@/utils/download';
import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;
const { Option } = Select;
const { Meta } = Card;
const selectTreeValue = [];
const routerPath = {
  linkAd: '/electronicRecord/lifeCyclePRDRecord',
};

const Index = ({
  form: { getFieldsValue, getFieldDecorator, resetFields, validateFields },
  dispatch,
  listLoading,
  lifeCyclePRD: {
    saveTreeData,
    saveListFetch,
    saveVersionData,
    savePersonalTreeData,
    documentBigType,
    documentType,
    breakdown,
  },
}) => {
  // tabs code
  const [tabs, setTabs] = useState('list');
  // 展开/收起
  const [seniorType, setSeniorType] = useState(false);
  // 每页数据条数
  const [pageSize, setPageSize] = useState(10);
  // 页码
  const [pageNum, setPageNum] = useState(1);
  // 批量选中数据
  const [selectData, setSelectData] = useState([]);
  // 表格选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 全选
  const [checkAll, setCheckAll] = useState(false);
  // 缩略图选中数据
  const [checkedList, setCheckedList] = useState([]);
  // 文档版本弹出框
  const [versionVisible, setVersionVisible] = useState(false);
  // 同步管理弹出框
  const [syncManageVisible, setSyncManageVisible] = useState(false);
  // 子组件传回点击信息
  const [clickData, setClickData] = useState({});
  // 左侧目录树节点信息
  const [leftTreeClickData, setLeftTreeClickData] = useState({});
  // 同步管理弹出框--选中标签
  const [syncTags, setSyncTags] = useState('');
  const [keywordValue, setKeywordValue] = useState('');

  const personalTreeRef = useRef();

  // 生命周期文档 列表
  useEffect(() => {
    // 获得树形结构数据
    handleGetTreeData();
    handleGetPersonalTreeData();
    handleGetListFetch(10, 1);
    documentBigTypeReq();
    documentTypeReq();
    breakdownReq();
  }, []);

  // 展开搜索表单创建
  const searchFrom = () => {
    return (
      <Form {...formItemLayout}>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          {leftTreeClickData && leftTreeClickData.code ? null : (
            <Col md={8} sm={24}>
              <FormItem label="档案大类">
                {getFieldDecorator('classificationList')(
                  handleMapList(documentBigType, 'code', 'name', 'multiple', false, '', false),
                )}
              </FormItem>
            </Col>
          )}
          <Col md={8} sm={24}>
            <FormItem label="文档类型">
              {getFieldDecorator('documentTypeList')(
                handleMapList(documentType, 'FCODE', 'FNAME', 'multiple', false, '', false),
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="明细分类">
              {getFieldDecorator('fileTypeList')(
                handleMapList(breakdown, 'code', 'name', 'multiple', false, false, '明细分类'),
              )}
            </FormItem>
          </Col>
          {/* 注:此字段需求已去 */}
          {/* <Col md={8} sm={24}>
            <FormItem label="主体信息">
              {getFieldDecorator('investmentManager')(
                handleMapList([], 'code', 'name', 'multiple'),
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <FormItem label="文档名称">
              {getFieldDecorator('fileName')(<Input placeholder="请输入内容" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="开始日期：">
              {getFieldDecorator('startTime')(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="结束日期：">
              {getFieldDecorator('endTime')(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* 注：后台定义日期是两个字段，开始日期和结束日期 */}
          {/* <Col md={8} sm={24}>
            <FormItem label="归档时间">
              {getFieldDecorator('guidanshijan')(
                <RangePicker
                  showTime={{ format: 'YYYY-MM-DD HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeRangeTime}
                />,
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <FormItem label="用印文档">
              {getFieldDecorator('flag')(<Checkbox onChange={onChangeSeal}>用印文档</Checkbox>)}
            </FormItem>
          </Col>
          <Col
            md={16}
            sm={24}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button type="primary" style={{ marginRight: '12px' }} onClick={handleGetSearchFetch}>
              查询
            </Button>
            <Button onClick={handleFormReset}>重置</Button>
            <Button type="link" onClick={() => setSeniorType()}>
              收起
              <Icon type="up" />
            </Button>
          </Col>
        </Row>
        {/* <Row type="flex" justify="end">
          <Col>
            <Button style={{ marginRight: '6px' }} type="primary" onClick={handleGetSearchFetch}>
              查询
            </Button>
            <Button onClick={handleFormReset}>重置</Button>
          </Col>
          <Col>
            <Button type="link" onClick={() => setSeniorType()} style={{ marginLeft: '6px' }}>
              收起
              <Icon type="up" />
            </Button>
          </Col>
        </Row> */}
        {/* <div style={{ textAlign: 'right' }}>
          <span className="submitButtons" style={{ marginLeft: 10 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                marginLeft: '10px',
                height: 28,
              }}
              onClick={handleGetSearchFetch}
            >
              查询
            </Button>
            <Button
              style={{ height: 28, marginLeft: '10px', color: '#1890ff' }}
              onClick={handleFormReset}
            >
              重置
            </Button>
          </span>
          <span
            className={styles.searchLabel}
            onClick={() => setSeniorType()}
            style={{ marginLeft: '20px' }}
          >
            收起
            <Icon type="up" />
          </span>
        </div> */}
      </Form>
    );
  };

  const handleGetTreeData = () => {
    dispatch({
      type: 'lifeCyclePRD/handleGetTreeInfo',
      payload: '',
    });
  };
  const handleGetPersonalTreeData = () => {
    dispatch({
      type: 'lifeCyclePRD/handleGetPersonalTreeInfo',
      payload: '',
    });
  };
  // 档案大类
  const documentBigTypeReq = () => {
    dispatch({
      type: 'lifeCyclePRD/handleGetDocumentBigTypeReq',
      payload: null,
    });
  };
  // 文档类别
  const documentTypeReq = () => {
    dispatch({
      type: 'lifeCyclePRD/handleGetDocumentTypeReq',
      payload: null,
    });
  };
  // 明细分类
  const breakdownReq = () => {
    dispatch({
      type: 'lifeCyclePRD/handleBreakdownReq',
      payload: null,
    });
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNum,
    total: saveListFetch.total,
    showTotal: total => `共 ${total} 条数据`,
  };

  /**
   * 分页回调
   * @method  handlePaginationChange
   */
  const handlePaginationChange = (pagination, filters, sorter, extra) => {
    const field = sorter.columnKey;
    console.log('sorter::', sorter);
    let direction;
    switch (sorter.order) {
      case 'ascend':
        direction = 'asc';
        break;
      case 'descend':
        direction = 'desc';
        break;
      default:
        direction = '';
        break;
    }
    validateFields(values => {
      setPageSize(pagination.pageSize);
      setPageNum(pagination.current);

      if (!values) {
        values = getFieldsValue();
      }
      // 点击左侧树，此目录下的所有文件
      if ('code' in leftTreeClickData) {
        const { code, parentId } = leftTreeClickData;
        values.classificationList = [parentId || code];
        values.proCode = parentId ? code : '';
      }
      //values = beforeFormFata(values);
      handleGetListFetch(pagination.pageSize, pagination.current, field, direction, values);
    });
  };

  /**
   * rowSelection 回调
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setSelectData(selectedRows);
    },
  };

  /**
   * table组件
   */
  const tableCom = () => {
    return (
      <Table
        rowKey={'id'}
        loading={listLoading}
        dataSource={saveListFetch.fileInfoList}
        columns={columns}
        pagination={paginationProps}
        onChange={handlePaginationChange}
        scroll={{ x: columns.length * 200 }}
        rowSelection={{
          // type: 'checkbox',
          ...rowSelection,
        }}
      />
    );
  };

  const columns = [
    {
      title: '文档名称',
      dataIndex: 'fileName',
      key: 'fileName',
      sorter: true,
    },
    {
      title: '档案大类',
      dataIndex: 'archivesClassification',
      key: 'archivesClassification',
      sorter: true,
    },

    {
      title: '明细分类',
      dataIndex: 'fileType',
      key: 'fileType',
      sorter: true,
    },
    {
      title: '所属流程',
      dataIndex: 'processId',
      key: 'processId',
      sorter: true,
    },
    {
      title: '文档来源',
      dataIndex: 'fileSource',
      key: 'fileSource',
      sorter: true,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadFileTime',
      key: 'uploadFileTime',
      sorter: true,
    },
    {
      title: '归档时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: '文档版本',
      dataIndex: 'stateName',
      key: 'stateName',
      sorter: true,
    },

    {
      title: '版本号',
      dataIndex: 'fileVersion',
      key: 'fileVersion',
      sorter: true,
    },
    {
      title: '更新用户',
      dataIndex: 'uploadPeole',
      key: 'uploadPeole',
      sorter: true,
    },
  ];

  // 文档版本columns
  const versionColumns = [
    {
      title: '文档名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '版本',
      dataIndex: 'fileVersion',
      key: 'fileVersion',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            onClick={() => {
              handleVersionDownload(record);
            }}
          >
            下载
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleVersionCheck(record);
            }}
          >
            查看
          </a>
        </span>
      ),
    },
  ];

  // 缩略图选中
  const onSelectChange = arr => {
    setCheckedList(arr);
    setCheckAll(arr.length === saveListFetch.fileInfoList.length);
    console.log(arr);
  };

  // 卡片组件
  const cardCom = () => {
    const data = saveListFetch.fileInfoList;
    const child = data.map(item => {
      return (
        <Col
          span={4}
          offset={1}
          key={item.id}
          style={{
            height: '300px',
            border: '1px solid #000',
            borderRadius: '10px',
            marginBottom: '15px',
            padding: '5px',
          }}
        >
          <Checkbox value={item.id} style={{ width: '100%' }}>
            {/* 注:此处样式优化 */}
            <Card
              // hoverable
              cover={cardFileType(item)}
              bordered={false}
              style={{
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Meta title={item.fileName} className={styles.cradMetaCss} />
            </Card>
          </Checkbox>
        </Col>
      );
    });
    return (
      <Checkbox.Group
        style={{ width: '100%' }}
        className={styles.checkboxCss}
        value={checkedList}
        onChange={onSelectChange}
      >
        <Row>{child}</Row>
      </Checkbox.Group>
    );
  };

  // 卡片内文件类型
  const cardFileType = form => {
    let child;
    const listType1 = ['word', 'pdf'];
    const listType2 = ['img', 'png', 'jpeg'];
    if (listType1.indexOf(form.fileForm) !== -1) {
      child = <Icon type={`file-${form.fileForm}`} className={styles.iconCss} />;
    } else if (listType2.indexOf(form.fileForm) !== -1) {
      child = (
        <img
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{ height: '228px', backgroundSize: 'cover' }}
        />
      );
    } else {
      child = <Icon type="file" className={styles.iconCss} />;
    }
    return child;
  };

  /**
   * 方法说明 列表（搜索）
   * @method  handleGetListFetch
   * @return {Object}
   * @param pageSize {number} 每页大小
   * @param pageNum  {number} 页数/当前页
   * @param field  {string} 排序字段
   * @param direction  {string} 排序方式
   * @param formData {Object} 表单项
   */
  const handleGetListFetch = (
    pageSize = pageSize,
    pageNum = pageNum,
    field,
    direction,
    formData,
  ) => {
    dispatch({
      type: 'lifeCyclePRD/handleGetListMsg',
      payload: {
        pageSize,
        pageNum,
        field,
        direction,
        ...formData,
      },
    });
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

  // 日期选择
  const onChangeRangeTime = (value, dateString) => {
    console.log(value, dateString);
  };

  /**
   * 查询按钮
   * @method  handleGetSearchFetch
   */
  const handleGetSearchFetch = () => {
    let values;
    values = getFieldsValue();
    // to正在读的你，我也很无奈，奈何人家后台就是这样要的...
    values.flag = values.flag ? 'true' : '';
    if (values.startTime) values.startTime = values.startTime.format('YYYY-MM-DD');
    if (values.endTime) values.endTime = values.endTime.format('YYYY-MM-DD');
    // 点击左侧树，此目录下的所有文件
    if ('code' in leftTreeClickData) {
      const { code, parentId } = leftTreeClickData;
      values.classificationList = [parentId || code];
      values.proCode = parentId ? code : '';
    }
    handleGetListFetch(10, 1, '', '', values);
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    resetFields();
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

  // 用印文档改变触发事件
  const onChangeSeal = e => {
    console.log(e.target.checked);
  };

  // 模糊搜索
  const blurSearch = value => {
    value = { keyWords: value };
    setKeywordValue('');
    handleGetListFetch(10, 1, '', '', value);
  };

  // tabs切换
  const handleTabsChanges = key => {
    console.log(key);
    setTabs(key);
  };

  /**
   * 批量操作下载请求
   */
  const handleCanBatchToDo1 = data => {
    if (JSON.stringify(data) !== '[]') {
      message.success('多文件压缩包正在下载中 . . . 请稍后');
      downloadNoToken(`/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${data}`);
    } else {
      message.warn('请选择需要下载的文件');
    }
  };

  // 查看
  const handleCanCheck = record => {
    message.success('查看预览准备中 . . .');
    let obj = {
      method: 'GET',
      boby: `${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`,
      name: record.fileName,
    };
    filePreview(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`,
    );
  };

  // 文档版本下载
  const handleVersionDownload = record => {
    let arr = [];
    arr.push(`${record.fileSerialNumber}@${record.fileName}.${record.fileForm}`);
    handleCanBatchToDo1(arr);
  };

  // 文档版本查看
  const handleVersionCheck = record => {
    handleCanCheck(record);
  };

  // 下载
  const handleDownLoad = () => {
    let arr = [];
    const record = selectData;
    for (let key in record) {
      arr.push(`${record[key].fileSerialNumber}@${record[key].fileName}.${record[key].fileForm}`);
    }
    handleCanBatchToDo1(arr);
  };
  const handleCheck = () => {
    if (!selectData.length || selectData.length > 1) {
      message.warn('请选择单个文件');
      return;
    }
    handleCanCheck(selectData[0]);
  };
  const handleVersion = () => {
    if (!selectData.length || selectData.length > 1) {
      message.warn('请选择单个文件');
      return;
    }
    const { fileName, busId } = selectData[0];
    dispatch({
      type: 'lifeCyclePRD/handleGetVersionListMsg',
      payload: {
        fileName,
        fileType: selectData[0].type,
        fileFormat: selectData[0].fileForm,
        busId,
      },
    });
    setVersionVisible(true);
  };
  const handleRecord = () => {
    if (!selectData.length || selectData.length > 1) {
      message.warn('请选择单个文件');
      return;
    }
    dispatch(
      routerRedux.push({
        pathname: routerPath.linkAd,
        query: { fileSerialNumber: selectData[0].fileSerialNumber },
      }),
    );
  };
  const handleSyncManage = () => {
    console.log('selectData::', selectData);
    if (!selectData.length) {
      message.warn('请选择文件');
      return;
    }
    setSyncManageVisible(true);
  };

  // 同步管理弹出框--确认
  const handleSyncManageOk = () => {
    if (!selectData.length) {
      message.warn('请选择文件');
      return;
    }
    let temp = [];
    for (let item of selectData) {
      temp.push(item.id);
    }
    dispatch({
      type: 'lifeCyclePRD/handleSaveTagsListMsg',
      payload: {
        achiveId: temp.join(','),
        id: clickData.code,
        label: syncTags,
      },
    }).then(data => {
      if (data) {
        setSyncManageVisible(false);
        setSyncTags('');
        personalTreeRef.current.handleReset();
        handleGetPersonalTreeData();
      }
    });
  };

  // 全选
  const onCheckAllChange = e => {
    setCheckAll(e.target.checked);
    const newArr = [];
    saveListFetch.fileInfoList.forEach(item => {
      newArr.push(item.id);
    });
    setCheckedList(e.target.checked ? newArr : []);
  };

  // 获取子组件点击信息
  const getClickMsg = (result, msg) => {
    // console.log(result, msg);
    setClickData(msg);
  };
  // 获取子组件check信息
  const getCheckMsg = (result, msg) => {
    console.log(result, msg);
  };

  // 初始化默认值
  const handleInitDefaultValue = () => {
    setTabs('list');
    setSeniorType(false);
    setPageSize(10);
    setPageNum(1);
    setSelectData([]);
    setSelectedRowKeys([]);
    setCheckAll([]);
    setCheckedList([]);
    setKeywordValue('');
    handleFormReset();
  };

  // 筛选条件增加用户选择的左侧目录树节点
  const getLeftTreeClickMsg = (result, msg) => {
    const { code, parentId } = msg;
    setLeftTreeClickData(msg);
    handleInitDefaultValue();
    if ('code' in msg) {
      handleGetListFetch(10, 1, '', '', {
        classificationList: [parentId || code],
        proCode: parentId ? code : '',
      });
    } else {
      handleGetListFetch(10, 1, '', '');
    }
  };
  const getLeftTreeCheckMsg = (result, msg) => {
    console.log(result, msg);
  };

  // 选择标签change事件
  const handleTagsChange = e => {
    setSyncTags(e.target.value);
  };

  return (
    <PageHeaderWrapper className={styles.parentBox} title="生命周期文档" breadcrumb={{}}>
      <Layout>
        <Sider width={250} style={{ background: '#fff', margin: 0, overflow: 'scroll' }}>
          <div className={styles.viewLeft}>
            <SelfTree
              treeData={saveTreeData}
              draggableFlag
              checkable
              getClickMsg={getLeftTreeClickMsg}
              getCheckMsg={getLeftTreeCheckMsg}
            />
          </div>
        </Sider>
        <Content>
          <Card style={{ margin: '12px 0', display: seniorType ? '' : 'none' }}>
            {searchFrom()}
          </Card>
          <Form {...formItemLayout}>
            <Card
              style={{
                margin: '12px 0',
                display: seniorType ? 'none' : '',
              }}
            >
              <Row type="flex" justify="space-between" align="middle">
                <Col>
                  {leftTreeClickData && leftTreeClickData.code ? (
                    <Breadcrumb>
                      <Breadcrumb.Item>{leftTreeClickData.parentName}</Breadcrumb.Item>
                      <Breadcrumb.Item>{leftTreeClickData.name}</Breadcrumb.Item>
                    </Breadcrumb>
                  ) : (
                    <Breadcrumb>
                      <Breadcrumb.Item>产品数据文档</Breadcrumb.Item>
                    </Breadcrumb>
                  )}
                </Col>
                <Col>
                  <Search
                    placeholder="请输入文档名称搜索"
                    onSearch={value => blurSearch(value)}
                    onChange={e => setKeywordValue(e.target.value)}
                    value={keywordValue}
                    style={{
                      width: 242,
                      marginRight: '6px',
                    }}
                  />
                  <Button
                    type="link"
                    onClick={() => {
                      setSeniorType(true);
                      setKeywordValue('');
                    }}
                  >
                    展开搜索
                    <Icon type="down" />
                  </Button>
                </Col>
              </Row>
            </Card>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className={styles.wrapButton}>
                  <Button type="primary" className={styles.listButtons} onClick={handleDownLoad}>
                    下载
                  </Button>
                  <Button type="primary" className={styles.listButtons} onClick={handleCheck}>
                    查看
                  </Button>
                  <Button type="primary" className={styles.listButtons} onClick={handleVersion}>
                    文档版本
                  </Button>
                  <Button type="primary" className={styles.listButtons} onClick={handleRecord}>
                    流转记录
                  </Button>
                  <Button type="primary" className={styles.listButtons} onClick={handleSyncManage}>
                    同步至个人管理
                  </Button>
                </div>
                <div className={styles.tabsStyle}>
                  <span className={styles.spanStyle}>
                    <Icon
                      type="menu"
                      className={[styles.iconStyle, tabs === 'list' ? styles.currentSpan : '']}
                      onClick={() => {
                        setTabs('list');
                      }}
                    />
                  </span>
                  <span>
                    <Icon
                      type="appstore"
                      className={[styles.iconStyle, tabs === 'thumb' ? styles.currentSpan : '']}
                      onClick={() => {
                        setTabs('thumb');
                      }}
                    />
                  </span>
                </div>
              </div>

              <div style={{ display: tabs === 'list' ? '' : 'none' }}>{tableCom()}</div>
              <div style={{ display: tabs === 'thumb' ? '' : 'none' }}>
                <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                  全选
                </Checkbox>
                {cardCom()}
              </div>
            </Card>
          </Form>
          <Modal
            title="文档版本"
            visible={versionVisible}
            onCancel={() => {
              setVersionVisible(false);
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setVersionVisible(false);
                }}
              >
                关闭
              </Button>,
            ]}
          >
            <Table
              rowKey={'id'}
              dataSource={saveVersionData}
              columns={versionColumns}
              pagination={false}
            />
          </Modal>
          <Modal
            title={'同步至个人管理'}
            visible={syncManageVisible}
            onOk={handleSyncManageOk}
            onCancel={() => {
              setSyncManageVisible(false);
              setSyncTags('');
              personalTreeRef.current.handleReset();
            }}
          >
            <div>选择文件夹</div>
            <SelfTree
              treeData={savePersonalTreeData}
              searchFlag={true}
              draggableFlag={false}
              checkableFlag={false}
              multipleFlag={false}
              getClickMsg={getClickMsg}
              getCheckMsg={getCheckMsg}
              dragTree={false}
              ref={personalTreeRef}
            />
            <div>选择标签</div>
            <Input value={syncTags} placeholder="请输入标签" onChange={handleTagsChange} />
          </Modal>
        </Content>
      </Layout>
    </PageHeaderWrapper>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ lifeCyclePRD, loading }) => ({
      lifeCyclePRD,
      listLoading: loading.effects['lifeCyclePRD/handleGetListMsg'],
    }))(Index),
  ),
);

export default WrappedIndexForm;

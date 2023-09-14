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
  Row,
  Select,
  message,
  Modal,
  Checkbox,
  DatePicker,
  Tooltip,
  Layout,
  Breadcrumb,
} from 'antd';
import { Table } from '@/components';
import { routerRedux } from 'dva/router';
import { downloadNoToken, filePreview } from '@/utils/download';
import { cloneDeep } from 'lodash';
import styles from '@/pages/lifeCyclePRD/index.less';

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
  lifeCyclePRD: { saveListFetch, saveVersionData, documentBigType, documentType, breakdown },
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
        <Row style={{ marginBottom: 10 }}>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item>最近文档</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="档案大类">
              {getFieldDecorator('classificationList')(
                handleMapList(documentBigType, 'code', 'name', 'multiple', false, '', false),
              )}
            </FormItem>
          </Col>
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
              {getFieldDecorator('fileName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <Form.Item label="开始日期：">
              {getFieldDecorator('startTime')(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="结束日期：">
              {getFieldDecorator('endTime')(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col> */}
          <Col md={8} sm={24} className={styles.rangePickerCss}>
            <FormItem label="归档时间">
              {getFieldDecorator('archivedTime')(
                <RangePicker
                  showTime={{ format: 'YYYY-MM-DD' }}
                  format="YYYY-MM-DD"
                  placeholder={['开始时间', '结束时间']}
                  onChange={onChangeRangeTime}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用印文档">
              {getFieldDecorator('flag')(<Checkbox onChange={onChangeSeal}>用印文档</Checkbox>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col
            md={24}
            sm={24}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button type="primary" onClick={handleGetSearchFetch}>
              查询
            </Button>
            <Button style={{ marginLeft: '18px' }} onClick={handleFormReset}>
              重置
            </Button>
            <Button
              className={styles.searchLabel}
              onClick={() => {
                setSeniorType();
                handleFormReset();
              }}
              type="link">收起<Icon type="up" />
            </Button>
          </Col>
        </Row>
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
    pageSize: pageSize,
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
      let obj = cloneDeep(values);
      obj.flag = obj.flag ? true : '';
      if (obj.archivedTime) {
        obj.archivedTime[0] = obj.archivedTime[0].format('YYYY-MM-DD');
        obj.archivedTime[1] = obj.archivedTime[1].format('YYYY-MM-DD');
      }
      handleGetListFetch(pagination.pageSize, pagination.current, field, direction, obj);
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

  // 处理table列样式
  const handleTableCss = text => {
    return (
      <Tooltip title={text} placement="topLeft">
        <span
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            width: '180px',
            paddingTop: '5px',
          }}
        >
          {text}
        </span>
      </Tooltip>
    );
  };

  const columns = [
    {
      title: '文档名称',
      dataIndex: 'fileName',
      key: 'fileName',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '档案大类',
      dataIndex: 'archivesClassification',
      key: 'archivesClassification',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },

    {
      title: '明细分类',
      dataIndex: 'fileType',
      key: 'fileType',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '文档类型',
      dataIndex: 'documentType',
      key: 'documentType',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '所属流程',
      dataIndex: 'processId',
      key: 'processId',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '文档来源',
      dataIndex: 'fileSource',
      key: 'fileSource',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '上传时间',
      dataIndex: 'uploadFileTime',
      key: 'uploadFileTime',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
    },
    {
      title: '归档时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
      render: text => {
        return handleTableCss(text);
      },
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
      render: text => {
        return handleTableCss(text);
      },
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
    setSelectData(arr);
  };

  // 卡片组件
  const cardCom = () => {
    const data = saveListFetch.fileInfoList;
    const child = data.map(item => {
      return (
        <Col
          offset={1}
          sm={5}
          xxl={4}
          key={item.id}
          style={{
            height: '164px',
            border: '1px solid #EBECF0',
            borderRadius: '4px',
            marginBottom: '15px',
            padding: '5px',
            boxShadow: '0px 0px 10px 0px rgba(66, 124, 229, 0.17)',
          }}
        >
          <Checkbox value={item} style={{ width: '100%' }}>
            {/* 注:此处样式优化 */}
            <Card
              // hoverable
              cover={cardFileType(item)}
              bordered={false}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 17,
              }}
            >
              <Tooltip placement="top" title={item.fileName}>
                <Meta title={item.fileName} className={styles.cradMetaCss} />
              </Tooltip>
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
      child = <Icon type="picture" className={styles.iconCss} />;
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
          showArrow
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
    const values = getFieldsValue();
    let obj = cloneDeep(values);
    obj.flag = obj.flag ? true : '';
    if (obj.archivedTime) {
      obj.archivedTime[0] = obj.archivedTime[0].format('YYYY-MM-DD');
      obj.archivedTime[1] = obj.archivedTime[1].format('YYYY-MM-DD');
    }
    handleGetListFetch(10, 1, '', '', obj);
  };

  /**
   * 重置表单按钮
   * @method  handleFormReset
   */
  const handleFormReset = () => {
    setPageNum(1);
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

  // 全选
  const onCheckAllChange = e => {
    setCheckAll(e.target.checked);
    const newArr = [];
    saveListFetch.fileInfoList.forEach(item => {
      newArr.push(item);
    });
    setCheckedList(e.target.checked ? newArr : []);
    setSelectData(newArr);
  };

  // 选择标签change事件
  const handleTagsChange = e => {
    setSyncTags(e.target.value);
  };

  return (
    <PageHeaderWrapper className={styles.parentBox} title="" breadcrumb={{}}>
      <Layout>
        <Content style={{ margin: '20px 20px 0' }}>
          <Card style={{ display: seniorType ? '' : 'none' }}>{searchFrom()}</Card>
          <Form {...formItemLayout}>
            <Card
              style={{
                display: seniorType ? 'none' : '',
                padding: '3px 0',
                marginBottom: '10px',
              }}
            >
              <Row type="flex" justify="space-between" align="middle">
                <Col>
                  <Breadcrumb>
                    <Breadcrumb.Item>最近文档</Breadcrumb.Item>
                  </Breadcrumb>
                </Col>
                <Col>
                  <Search
                    placeholder="请输入文档名称"
                    onSearch={value => blurSearch(value)}
                    onChange={e => setKeywordValue(e.target.value)}
                    value={keywordValue}
                    style={{
                      width: 242,
                      marginRight: '6px',
                    }}
                  />
                  <Button
                    className={styles.searchLabel}
                    onClick={() => {
                      setSeniorType(true);
                      setKeywordValue('');
                    }}
                    type="link">展开搜索<Icon type="down" />
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
                </div>
                <div className={styles.tabsStyle}>
                  <span
                    style={{ background: tabs === 'list' ? '#2450a5' : '' }}
                    className={styles.spanStyle_l}
                    onClick={() => {
                      setTabs('list');
                      setSelectData([]);
                    }}
                  >
                    <img
                      src={require('../../assets/electronic/list_default.svg')}
                      alt=""
                      style={{ display: tabs === 'list' ? '' : 'none' }}
                    />
                    <img
                      src={require('../../assets/electronic/list_pressed.svg')}
                      alt=""
                      style={{ display: tabs === 'list' ? 'none' : '' }}
                    />
                  </span>
                  <span
                    className={styles.spanStyle_r}
                    style={{ background: tabs === 'thumb' ? '#2450a5' : '' }}
                    onClick={() => {
                      setTabs('thumb');
                      setSelectData([]);
                    }}
                  >
                    <img
                      src={require('../../assets/electronic/thumb_default.svg')}
                      alt=""
                      style={{ display: tabs === 'thumb' ? '' : 'none' }}
                    />
                    <img
                      src={require('../../assets/electronic/thumb_pressed.svg')}
                      alt=""
                      style={{ display: tabs === 'thumb' ? 'none' : '' }}
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

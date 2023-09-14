import React, { useEffect, useState, useRef } from 'react';
import router from 'umi/router';
import FileMain from './components/FileMain';
import {
  Card,
  Collapse,
  DatePicker,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import { Table } from '@/components';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import styles from './style.less';
import { connect } from 'dva';
import { commonColumns, getStatus } from './common';
const { Panel } = Collapse;
const { Option } = Select;

const TableInfo = Form.create()(
  ({
    form: { getFieldDecorator, getFieldsValue, resetFields },
    fileBorrower: {
      _class,
      types,
      subTypes,
      orderList: { rows: data, total },
      tranDicts,
      transFiles,
    },
    listLoading,
    dispatch,
    selectedRows,
    setSelectedRows,
  }) => {
    const [formValues, setFormValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [keys, setKeys] = useState([]);
    const [rows, setRows] = useState([]);

    //初始化
    useEffect(() => {
      // 档案大类
      if (!_class.length) {
        dispatch({
          type: 'fileBorrower/getClass',
        });
      }
    }, []);

    useEffect(() => {
      setKeys(selectedRows.map(item => item.id));
      setRows(selectedRows);
    }, [selectedRows]);

    // 借阅单列表
    useEffect(() => {
      handleListFetch();
    }, [formValues, currentPage, limit]);

    const handleListFetch = () => {
      dispatch({
        type: 'fileBorrower/getorderList',
        payload: {
          bizViewId: 'I8aaa82cd0180d50fd50f97bf0180ff67c005652a',
          likeBizViewId: 'I8aaa82cd0180d50fd50f97bf0180ff64987164ea',
          isPage: '1',
          ...formValues,
          page: currentPage,
          size: limit,
          returnType: 'LIST',
          FCHECKED: 'D001_2',
        },
      });
    };

    const handleStandardTableChange = ({ current, pageSize }) => {
      if (pageSize !== limit) {
        setCurrentPage(1);
        setLimit(pageSize);
      } else {
        setCurrentPage(current);
        setLimit(pageSize);
      }
    };

    /** *
     * 搜索条件查询触发
     * @param fieldsValue
     */
    const handleSearch = e => {
      e.preventDefault();
      setLimit(10);
      setCurrentPage(1);
      setFormValues(getFieldsValue());
    };

    //搜索条件重置
    const handleReset = () => {
      setLimit(10);
      setCurrentPage(1);
      resetFields();
      setFormValues({});
    };

    // 分页参数
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: currentPage,
      total,
      showTotal: total => `共 ${total} 条数据`,
    };

    // 表格行选择
    const onSelectChange = (ids, rows) => {
      setKeys(ids);
      setRows(rows);
    };

    // 过滤父组件里面选择的
    const filterRows = rows => {
      let res = [];
      rows.forEach(item => {
        !selectedRows.find(ele => ele === item) && res.push(item);
      });
      return res;
    };

    // 添加一个
    const addOne = (id, item) => {
      setSelectedRows([...selectedRows, ...filterRows([item])]);
      // setKeys([...keys, id]);
      // setRows([...rows, item]);
    };

    //添加多个
    const addSome = () => {
      setSelectedRows([...selectedRows, ...filterRows(rows)]);
    };

    // 档案大类切换/文档类型切换
    const typeChange = (val, isSub = false) => {
      dispatch({
        type: 'fileBorrower/getTypes',
        payload: {
          val,
          isSub,
        },
      });
    };

    // 表格列配置
    const columns = commonColumns(transFiles, tranDicts, (id, record) => (
      <div className={styles.handlers}>
        <Button type="link" onClick={() => addOne(id, record)}>
          添加
        </Button>
      </div>
    ));

    return (
      <>
        <div className={styles.margintop15 + ' ' + styles.marginbottom15}>
          <Form
            name="lateform"
            className={styles.lateform}
            autoComplete="off"
            onSubmit={handleSearch}
            onReset={handleReset}
          >
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item label="文件名称" rules={[{ required: true, message: '请选择借阅人' }]}>
                  {getFieldDecorator('fileName')(<Input />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="档案大类">
                  {getFieldDecorator('fileCategories')(
                    <Select
                      placeholder="请选择档案大类"
                      onChange={val => {
                        typeChange(val);
                      }}
                    >
                      {_class.map(item => {
                        return (
                          <Option value={item.code} key={item.code}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="文档类型" name="date">
                  {getFieldDecorator('fileType')(
                    <Select
                      placeholder="请选择文档类型"
                      onChange={val => {
                        typeChange(val, true);
                      }}
                    >
                      {types.map(item => {
                        return (
                          <Option value={item.code} key={item.code}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  label="明细分类"
                  name="date"
                  rules={[{ required: true, message: '请选择归还时间' }]}
                >
                  {getFieldDecorator('detailClass')(
                    <Select placeholder="请选择明细分类">
                      {subTypes.map(item => {
                        return <Option value={item.code}>{item.name}</Option>;
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <div className={styles.lineheight40}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <span className={styles.buttonsWrap}>
                    <Button htmlType="reset">重置</Button>
                  </span>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.marginbottom15}>
          <Button type="primary" onClick={addSome} disabled={rows.length === 0}>
            批量添加
          </Button>
        </div>
        <Table
          scroll={{ x: 1000 }}
          columns={columns}
          loading={listLoading}
          dataSource={data}
          onChange={handleStandardTableChange}
          currentPage={currentPage}
          pagination={paginationProps}
          rowKey="id"
          rowSelection={{ selectedRowKeys: keys, onChange: onSelectChange }}
        />
      </>
    );
  },
);

const Applyinfo = Form.create()(
  ({
    form: { getFieldDecorator, getFieldsValue, validateFields, getFieldValue },
    fileBorrower: { persons, orgs },
    dispatch,
    selectedRows,
    detail,
  }) => {
    const personChange = val => {
      const personOrg = persons.find(item => item.id === val);
      dispatch({
        type: 'fileBorrower/getPersonOrg',
        payload: personOrg.orgId,
      });
    };
    //初始化
    useEffect(() => {
      // 借阅人
      if (!persons.length) {
        dispatch({
          type: 'fileBorrower/getPersons',
        });
      }
    }, []);
    useEffect(() => {
      //如果是修改的，触发一下查询组织的方法\
      detail?.borrower && personChange(detail?.borrower);
    }, [persons]);

    const submit = status => {
      validateFields((err, fieldsValue) => {
        const payload = { ...fieldsValue };
        if (err) return;
        if (detail?.id) payload.id = detail.id;
        payload.borrowedTime = moment(payload.borrowedTime).format('YYYY-MM-DD');
        payload.returnTime = moment(payload.returnTime).format('YYYY-MM-DD');
        // payload.deptId = payload.deptId.slice(-1)[0];
        payload.acrmngIds = selectedRows.map(item => item.id);
        payload.dataStatus = status;
        dispatch({
          type: 'fileBorrower/makeApply',
          payload,
        }).then(() => {
          router.goBack();
        });
      });
    };
    // 开始结束时间限制
    const disabledStartDate = borrowedTime => {
      const returnTime = getFieldValue('returnTime');
      if (!borrowedTime || !returnTime) {
        return false;
      }
      return borrowedTime.valueOf() > returnTime.valueOf();
    };

    const disabledEndDate = returnTime => {
      const borrowedTime = getFieldValue('borrowedTime');
      if (!returnTime || !borrowedTime) {
        return false;
      }
      return returnTime.valueOf() <= borrowedTime.valueOf();
    };

    const handler = [
      {
        type: '',
        label: '保存',
        click: () => {
          submit(getStatus('save'));
        },
      },
      {
        type: 'primary',
        label: '提交',
        click: () => {
          submit(getStatus('submit'));
        },
      },
      {
        type: '',
        label: '取消',
        click: () => {
          router.goBack();
        },
      },
    ];

    const renderButtons = handler => {
      return handler.map(item => (
        <span className={styles.buttonsWrap}>
          <Button type={item.type} onClick={item.click}>
            {item.label}
          </Button>
        </span>
      ));
    };

    return (
      <Card bordered={false} title="档案申请" extra={renderButtons(handler)}>
        <Form name="lateform" className={styles.lateform} autoComplete="off">
          <Row gutter={24}>
            <Col>
              <Form.Item label="借阅标题">
                {getFieldDecorator('borrowingTitle', {
                  rules: [{ required: true, message: '请填写借阅标题' }],
                  initialValue: detail?.borrowingTitle ?? '',
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="借阅人">
                {getFieldDecorator('borrower', {
                  rules: [{ required: true, message: '请选择借阅人' }],
                  initialValue: detail?.borrower ?? '',
                })(
                  <Select placeholder="请选择借阅人" onChange={personChange}>
                    {persons.map(item => {
                      return (
                        <Option key={item.usercode} value={item.id}>
                          {item.username}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属部门">
                {getFieldDecorator('deptId', {
                  rules: [{ required: true, message: '请选择所属部门' }],
                  initialValue: detail.deptId ? [detail.deptId + ''] : '',
                })(
                  <TreeSelect
                    showSearch
                    treeData={orgs}
                    placeholder="请选择所属部门"
                    treeNodeFilterProp="title"
                    treeDefaultExpandAll
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="借阅时间">
                {getFieldDecorator('borrowedTime', {
                  rules: [{ required: true, message: '请选择借阅时间' }],
                  initialValue: detail?.borrowedTime ? moment(detail.borrowedTime) : '',
                })(<DatePicker style={{ width: '100%' }} disabledDate={disabledStartDate} />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="归还时间">
                {getFieldDecorator('returnTime', {
                  rules: [{ required: true, message: '请选择归还时间' }],
                  initialValue: detail?.returnTime ? moment(detail.returnTime) : '',
                })(<DatePicker style={{ width: '100%' }} disabledDate={disabledEndDate} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="借阅用途">
                {getFieldDecorator('borrowingPurposes', {
                  rules: [{ required: true, message: '请填写借阅用途' }],
                  initialValue: detail?.borrowingPurposes ?? '',
                })(<Input.TextArea rows={4}></Input.TextArea>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  },
);

function apply(props) {
  const {
    dispatch,
    fileBorrower: { tranDicts, transFiles, selectedOrderList },
    location,
  } = props;
  const [collapseIsopen, setCollapseIsopen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detail, setDetail] = useState({});
  const collapseChange = e => {
    setCollapseIsopen(e.length > 0);
  };

  // 初始化
  useEffect(() => {
    // 修改
    if (location.query && location.query.detail) {
      const data = JSON.parse(decodeURI(location.query.detail));
      setDetail(data);
      dispatch({
        type: 'fileBorrower/getorderList',
        payload: {
          bizViewId: 'I8aaa82cd0180d50fd50f97bf0180f40b544b6400',
          isPage: '0',
          returnType: 'LIST',
          id: data.id,
          IS_SELECTED: true,
        },
      });
    } else {
      dispatch({
        type: 'fileBorrower/saveOrderList',
        payload: {
          payload: {
            IS_SELECTED: true,
            data: [],
          },
        },
      });
    }

    // 翻译字典 档案室等
    tranDicts.length === 0 &&
      dispatch({
        type: 'fileBorrower/getTranDicts',
        payload: {
          bizViewId: 'I8aaa82cd0180d50fd50f97bf018104339563029f',
          isPage: '0',
          returnType: 'LIST',
        },
      });
    // 翻译字典 档案大类等
    transFiles.length === 0 &&
      dispatch({
        type: 'fileBorrower/getFileTypes',
        payload: {},
      });
  }, []);

  useEffect(() => {
    console.log(selectedOrderList.rows);
    setSelectedRows(selectedOrderList.rows);
  }, [selectedOrderList]);

  // 删除
  const delOne = (id, record) => {
    setSelectedRows(selectedRows.filter(item => item.id !== id));
  };
  return (
    <div>
      <FileMain
        childrenIsheader
        handlerDo={(id, record) => (
          <div className={styles.handlers}>
            <Button type="link" onClick={() => delOne(id, record)}>
              删除
            </Button>
          </div>
        )}
        selectedRows={selectedRows}
        setSelectedRows={data => setSelectedRows(data)}
      >
        {/* 申请 */}
        <Applyinfo {...props} selectedRows={selectedRows} detail={detail}></Applyinfo>
        {/*  */}
        <div className={styles.margintop15 + ' ' + styles.bgwhite}>
          <Collapse
            defaultActiveKey={[]}
            onChange={collapseChange}
            expandIconPosition="right"
            bordered={false}
          >
            <Panel header={collapseIsopen ? '收起' : '展开'} key="1">
              <TableInfo
                {...props}
                selectedRows={selectedRows}
                setSelectedRows={data => setSelectedRows(data)}
              ></TableInfo>
            </Panel>
          </Collapse>
        </div>
      </FileMain>
    </div>
  );
}

const WrappedApply = errorBoundary(
  connect(({ fileBorrower, loading }) => ({
    fileBorrower,
    listLoading: loading.effects['fileBorrower/getorderList'],
  }))(apply),
);

export default WrappedApply;

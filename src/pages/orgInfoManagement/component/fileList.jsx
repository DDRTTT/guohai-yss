import React, { Component } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Upload,
  message,
  Select,
  Form,
  Popconfirm,
  Input,
  Modal,
} from 'antd';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { connect } from 'dva';
import { handleTableCss } from '../../manuscriptBasic/func';
import { downloadNoToken } from '@/utils/download';
import Preview from '@/components/Preview';
import record from '../../lifeCyclePRD/record';
import { getAuthToken } from '@/utils/session';
import { tableRowConfig } from '@/pages/investorReview/func';
import { Card } from '@/components';
import styleSetPanel from '@/pages/operatingCalendar/setPanel/styleSetPanel';
import styles from '../index.less';
const EditableContext = React.createContext();
const token = getAuthToken();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title, fileType } = this.props;
    const { editing } = this.state;
    const getfileType = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'institutionalInfoManager/fileType',
        payload: {
          moduleCode: 'institution',
          unionParamMap: 'common',
          common: 'institution',
        },
      }).then(res => {
        if (res.status == 200) {
          this.setState({
            fileType: res.data,
          });
        }
      });
    };
    return record[dataIndex] ? (
      <Form.Item className={styles.frommargin}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `文件类型不能为空`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Select
            className={styles.width}
            ref={node => (this.input = node)}
            // onPressEnter={this.save}
            onBlur={this.save}
            allowClear
          >
            {fileType.map(item => (
              <Select.Option key={item.code}>{item.name}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    ) : (
      <Form.Item className={styles.frommargin}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `文件类型不能为空`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Select
            className={styles.selectcolor}
            ref={node => (this.input = node)}
            onBlur={this.save}
          >
            {fileType.map(item => (
              <Select.Option allowClear key={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '文件名称',
        dataIndex: 'fileName',
        render: text => {
          return handleTableCss(text);
        },
        width: 400,
      },
      {
        title: '文件类型',
        dataIndex: 'fileType',
        editable: true,
        width: 200,
        ...tableRowConfig,
      },
      {
        title: '文件格式',
        dataIndex: 'fileForm',
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '文件来源',
        dataIndex: 'fileSource',
        // sorter: true,
        width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '文件版本',
        dataIndex: 'fileVersion',
        // sorter: true,
        // width: 200,
        render: text => {
          return handleTableCss(text);
        },
      },
      {
        title: '操作',
        fixed: 'right',
        // sorter: true,
        width: 300,
        render: (text, record) => {
          const content = (
            <>
              {this.props.falg !== 'details' ? (
                <a className={styles.tableBtn} onClick={() => this.downLoadFile(record)}>
                  下载
                </a>
              ) : null}

              <a
                className={styles.tableBtn}
                onClick={() => {
                  this.handlePreview(record);
                }}
              >
                查看
              </a>
              {this.props.falg !== 'details' ? (
                <a onClick={() => this.deleteFlie(record)}>删除</a>
              ) : null}
            </>
          );
          return content;
        },
      },
    ];

    this.state = {
      dataSource: props.businessArchives || [],
      count: 0,
      fileType: [],
      selectRow: [],
      previewShow: false,
      previewRecord: '',
      falg: true,
    };
  }

  componentDidMount = () => {
    this.getfileType();
    // this.getfile();
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.businessArchives) {
      this.setState({ dataSource: nextProps.businessArchives, falg: false });
    }
  }

  getfile = () => {
    const { businessArchives } = this.props;
    this.setState({
      dataSource: businessArchives,
    });
  };

  // 文件类型
  getfileType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'institutionalInfoManager/fileType',
      payload: {
        moduleCode: 'institution',
        unionParamMap: 'common',
        common: 'institution',
      },
    }).then(res => {
      if (res.status == 200) {
        this.setState({
          fileType: res.data,
        });
      }
    });
  };

  // 删除文件
  fileDelect = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'institutionalInfoManager/fileDelect',
      payload: [id],
    });
  };
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = info => {
    const { count, dataSource } = this.state;
    const newData = {
      key: new Date().getTime(),
      fileName: info.file.name.substring(0, info.file.name.lastIndexOf('.')),
      fileType: '',
      fileForm: info.file.name.substring(info.file.name.lastIndexOf('.') + 1),
      fileSource: '本地上传',
      fileVersion: 'V1',
      fileSerialNumber: info.file.response.data,
      processId: 'org',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      // count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  viewDetails = record => {
    this.setState({
      previewShow: true,
      previewRecord: record,
    });
  };

  handleModleHideAfter = () => {
    this.setState({
      previewShow: false,
      previewRecord: '',
    });
  };
  // 文件下载
  downLoadFile = item => {
    // 流水号+文件名+文件类型
    downloadNoToken(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${item.fileSerialNumber}@${item.fileName}.${item.fileForm}`,
    );
  };

  selectAll = () => {
    // 流水号+文件名+文件类型
    if (this.state.selectRow.length == 0) {
      message.warn('请先选择下载文件');
      return;
    }
    downloadNoToken(
      `/ams/ams-file-service/fileServer/downloadUploadFile?getFile=${this.state.selectRow}`,
    );
  };

  // 删除
  delete = record => {
    let arr;
    if (record.key) {
      arr = this.state.dataSource.filter(item => {
        return item.key !== record.key;
      });
    } else {
      this.fileDelect(record.id);
      arr = this.state.dataSource.filter(item => {
        return item.id !== record.id;
      });
    }
    this.setState(
      {
        dataSource: arr,
        selectRow: [],
      },
      () => {},
    );
  };

  deleteFlie = record => {
    Modal.confirm({
      title: '请确认是否删除?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.delete(record);
      },
    });
  };

  onChange = info => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.response && info.file.response.status === 200) {
      this.handleAdd(info);
      message.success(`文件上传成功`);
    } else if (info.file.response && info.file.response.status === 500) {
      message.error('文件上传失败');
    }
  };

  /**
   * 显示预览框
   * * */
  handlePreview = record => {
    this.setState(
      {
        previewRecord: record,
        // previewShow: true,
      },
      () => {
        this.child.handlePreview({
          awpName: `${record.fileName}.${record.fileForm}`,
          awpFileNumber: record.fileSerialNumber,
        });
      },
    );
  };

  render() {
    const { dataSource, fileType, previewRecord, previewShow } = this.state;
    const { dispatch, falg, businessArchives } = this.props;
    const { uploadAfter } = this.props;
    uploadAfter && uploadAfter(this.state.dataSource);
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          fileType,
        }),
      };
    });

    const props = {
      name: 'file',
      action:
        '/ams/ams-file-service/fileServer/uploadFile?uploadFilePath=lifecycle/productsfiles/liquidation',
      headers: {
        Token: getAuthToken(),
        authorization: 'authorization-text',
      },
    };
    const rowSelection = {
      // selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectRows) => {
        const arr = [];
        selectRows.map((item, index) => {
          const arrs = `${item.fileSerialNumber}@${item.fileName}.${item.fileForm}`;
          arr.push(arrs);
        });
        this.setState({
          // selectedRowKeys,
          // checkedArr: selectRows,
          selectRow: arr,
        });
      },
    };

    return (
      <Card
        title="机构文件"
        extra={[
          <Button className={styles.batchdownload} onClick={() => this.selectAll()}>
            批量下载
          </Button>,
          <Upload {...props} showUploadList={false} onChange={this.onChange}>
            <Button type="primary">上传</Button>
          </Upload>,
        ]}
        className={'margin_t16'}
      >
        <Preview
          id="taskManagementDeal"
          // record={previewRecord}
          // show={previewShow}
          // modleHideAfter={this.handleModleHideAfter}
          onRef={ref => (this.child = ref)}
        />
        <Table
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          scroll={{ x: columns.length * 200 + 200 }}
        />
      </Card>
    );
  }
}

const WrappedAdvancedSearchForm = errorBoundary(
  Form.create()(
    connect(({ institutionalInfoManager }) => ({
      institutionalInfoManager,
    }))(FileList),
  ),
);
export default WrappedAdvancedSearchForm;

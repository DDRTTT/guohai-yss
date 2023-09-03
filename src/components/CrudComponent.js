import React, { PureComponent } from 'react';
import { Button, Card, Form, message } from 'antd';
import moment from 'moment';
import Action from '@/utils/hocUtil';
import { formItemCreate } from './FormUtil';
import DataTable from './DataTable';
import styles from './CrudComponent.less';

const ButtonGroup = Button.Group;

/**
 * 页面通用CRUD 组件
 */
@Form.create()
export default class CrudComponent extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  momentFormat = (formFields, format = 'YYYY-MM-DD HH:mm:ss') => {
    Object.keys(formFields).forEach(field => {
      if (formFields[field] instanceof moment) {
        formFields[field] = formFields[field].format(format);
      }
    });
  };

  /**
   * 查询
   * @param e
   */
  handlerSearch = e => {
    e.preventDefault();

    const { form, doGridSearch, pageSize } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.momentFormat(fieldsValue);
      doGridSearch(fieldsValue, 1, pageSize);
    });
  };

  /**
   * 修改
   */
  handleUpdate = record => {
    this.detailInit(record, '修改', true);
  };

  handleBatchUpdate = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 1) {
      message.error('一次只能修改一条数据！');
    } else if (selectedRowKeys.length === 0) {
      message.error('请先选中一条数据！');
    } else {
      const { data } = this.props;
      const record = data.rows[selectedRowKeys[0]];
      this.detailInit(record, '修改');
    }
  };

  handleDel = record => {
    const { doDel } = this.props;

    doDel(record);
  };

  handleBatchDel = () => {
    const { selectedRowKeys } = this.state;
    const { data, doDel } = this.props;
    const record = data.rows[selectedRowKeys[0]];

    doDel(record);
  };

  /**
   * 新增窗口初始化
   * @param entity
   * @param winTitle
   */
  detailInit = (record, title, par) => {
    const { doDetailInit } = this.props;
    doDetailInit(record, title, par);
  };

  /**
   * 选中行变动
   * @param rows 行下标数组
   */
  handleSelectRows = rows => {
    this.setState({
      selectedRowKeys: rows,
    });
  };

  /**
   * 分页查询
   * @param current
   * @param pageSize
   */
  onPaginationChange = (current, pageSize) => {
    const { formValues, doGridSearch, space } = this.props;
    doGridSearch(formValues, current, pageSize, space);
  };

  defaultButtonClass = (type, index) => {
    return `buttons${index + 1}`;
  };

  /**
   * 列表操作按钮组，现在先使用按钮组，如果不符合的话，可以将按钮组放在一个流式div中
   * @param colActions
   * @returns {XML}
   */
  renderColActions = (colActions, record, menuCode) => {
    return (
      <ButtonGroup className={styles.operators}>
        {colActions.map(
          (btn, index) =>
            (!btn.visible || btn.visible(record)) && (
              <Action key={btn.code} code={`${menuCode}:${btn.code}`}>
                <Button
                  onClick={() => btn.onClick(record)}
                  className={
                    btn.className ? btn.className : this.defaultButtonClass(btn.text, index)
                  }
                  size="small"
                >
                  {btn.text === '暂停' && record.jobStatus === 'PAUSED' ? '恢复' : btn.text}
                </Button>
              </Action>
            ),
        )}
      </ButtonGroup>
    );
  };

  /**
   * 查询Form组装函数
   */
  renderSearchForm() {
    const { form, searchFields } = this.props;
    const { getFieldDecorator } = form;

    return (
      searchFields && (
        <Form layout="inline" onSubmit={this.handlerSearch}>
          {formItemCreate(getFieldDecorator, searchFields)}
        </Form>
      )
    );
  }

  render() {
    const {
      data,
      columns,
      loading,
      current,
      pageSize,
      gridButtons,
      colActions,
      menuCode,
      tableExtra,
      forbiddenDefaultActions,
      pagenation,
      onForm,
    } = this.props;

    let tableButtons = [];

    if (gridButtons) {
      tableButtons = gridButtons;
    }

    let colButtons = [
      {
        text: '编辑',
        code: 'edit',
        onClick: record => this.handleUpdate(record),
      },
      {
        text: '删除',
        code: 'del',
        onClick: record => this.handleDel(record),
      },
    ];

    if (forbiddenDefaultActions) {
      colButtons = [];
    }

    if (colActions) {
      colButtons = [...colButtons, ...colActions];
    }

    if (colButtons.length > 0) {
      columns.push({
        title: '操作',
        align: 'center',
        render: (text, record) => this.renderColActions(colButtons, record, menuCode),
      });
    }

    /**
     *列表参数
     */
    const tableConfig = {
      extra: tableExtra,
      columns,
      dataList: data.rows,
      total: data.total ? data.total : data.rows.length,
      loading,
      current,
      pageSize,
      menuCode,
      onPaginationChange: this.onPaginationChange,
      handleSelectRows: this.handleSelectRows,
      buttons: tableButtons,
      pagenation,
    };

    return (
      <div>
        {onForm === 1 ? null : this.renderSearchForm()}
        <DataTable {...tableConfig} />
      </div>
    );
  }
}

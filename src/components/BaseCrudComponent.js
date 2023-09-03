import React, { PureComponent } from 'react';

export default class BaseCrudComponent extends PureComponent {
  // 分页查询
  doDataSearch = (formValues, current, pageSize, space = 'personMenu') => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${space || namespace}/fetch`,
      payload: {
        queryParameters: formValues,
        current,
        pageSize,
      },
    });
  };

  handleModalVisible = () => {
    const { form, dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/modelSwitch`,
    });
    form.resetFields();
  };

  /**
   * 保存完成后按当前条件刷新列表
   * @param fieldValues
   */
  add = fieldValues => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/add`,
      payload: {
        fieldValues,
      },
    });
  };

  update = fieldValues => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        fieldValues,
      },
    });
  };

  edit = (fieldValues, space) => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${space || namespace}/edit`,
      payload: {
        fieldValues,
      },
    });
  };

  doDel = (record, space) => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${space || namespace}/del`,
      payload: {
        id: record.id,
      },
    });
  };

  getById = record => {
    const { dispatch, namespace } = this.props;
    dispatch({
      type: `${namespace}/getById`,
      payload: {
        id: record.id,
      },
    });
  };
}

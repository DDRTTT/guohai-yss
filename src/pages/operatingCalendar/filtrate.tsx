import React from 'react';
import { Drawer, Collapse, Checkbox, Form, Button, Spin } from 'antd';
const styles = require('./index.less');
import { FiltrateProps } from './operatingCalendar.d';
import { priorityEnum } from './staticEnum';
const { Panel } = Collapse;
class Index extends React.Component<FiltrateProps, any> {
  constructor(props: FiltrateProps) {
    super(props);
  }

  handlerSubmit = () => {
    const { onCloseCallBack, form, setFilterData } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      setFilterData(values);
      onCloseCallBack();
    });
  };

  render() {
    const {
      filtrateVisible,
      onCloseCallBack,
      filterList,
      form,
      filterParams,
      filterListLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Drawer
        title="日程筛选"
        placement="right"
        closable={false}
        destroyOnClose={true}
        onClose={onCloseCallBack}
        visible={filtrateVisible}
        getContainer={false}
      >
        <Spin spinning={filterListLoading}>
          <div className={styles.collapseWrapp}>
            <Form>
              <Collapse
                defaultActiveKey={filterList.map((item, index) => index)}
                expandIconPosition="right"
                bordered={false}
              >
                {filterList.map((item, index) => {
                  return (
                    <Panel header={item.name} name={item.code} key={index}>
                      <Form.Item>
                        {getFieldDecorator(item.code, { initialValue: filterParams[item.code] })(
                          <Checkbox.Group
                            options={item.list.map((sonItem: any) => {
                              return {
                                label: sonItem.name,
                                value: sonItem.code,
                              };
                            })}
                          />,
                        )}
                      </Form.Item>
                    </Panel>
                  );
                })}
              </Collapse>
              <Button
                key="save"
                type="primary"
                style={{ float: 'right' }}
                onClick={this.handlerSubmit}
              >
                筛选
              </Button>
            </Form>
          </div>
        </Spin>
      </Drawer>
    );
  }
}

export default Form.create()(Index);

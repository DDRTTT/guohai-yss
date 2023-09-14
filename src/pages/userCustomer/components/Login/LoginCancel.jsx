import { Button, Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

const LoginCancel = ({ className, ...rest }) => {
  const clsString = classNames(styles.cancel, className);
  return (
    <FormItem>
      <Button size="large" className={clsString} htmlType="button" {...rest} />
    </FormItem>
  );
};

export default LoginCancel;

import { Icon } from 'antd';
import React from 'react';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      className: '',
      hasicon: true,
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
      style: {
        height: 48,
        fontSize: 16,
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      hasicon: true,
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
      style: {
        height: 48,
        fontSize: 16,
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
      style: {
        height: 48,
        fontSize: 16,
        padding:'0 !important',
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
      style: {
        height: 48,
        fontSize: 16,
        padding:'0 !important',
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
  Verificode: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captchaPic',
      style: {
        height: 48,
        fontSize: 16,
        padding: 0,
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter CaptchaPic!',
      },
    ],
  },
  IdNo: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
      style: {
        height: 48,
        fontSize: 16,
        padding:'0 !important',
      },
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
};

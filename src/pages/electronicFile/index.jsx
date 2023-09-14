import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Radio,
  Tooltip,
  Row,
  Col,
  Button,
  Checkbox,
  Pagination,
  Divider,
  Tag,
  Modal,
  Input,
} from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  TagsOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import PageContainer from '@/components/PageContainers';
import styles from './index.less';
import List from '@/components/List';

const RadioGroup = Radio.Group;

const Index = ({
  form: { validateFields },
  dispatch,
  listLoading,
  resource: {
    data: { rows, total },
  },
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState({});
  const [limit, setLimit] = useState(10);
  const [contentVisable, setContentVisable] = useState(false);
  const [markVisable, setMarkVisable] = useState(false);

  useEffect(() => {
    const basic = {
      currentPage,
      pageSize: limit,
    };
    dispatch({
      type: 'resource/fetch',
      payload: basic,
    });
  }, []);

  /**
   * 列表查询
   * @method  handleListFetch
   */
  const handleListFetch = (pages, limits) => {
    setCurrentPage(pages);
    validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'resource/fetch',
        payload: {
          currentPage: pages,
          pageSize: limits,
          ...fieldsValue,
        },
      });
    });
  };

  const handleStandardTableChange = ({ current, pageSize }) => {
    if (pageSize !== limit) {
      handleListFetch(1, pageSize);
      setCurrentPage(1);
      setLimit(pageSize);
    } else {
      handleListFetch(current, pageSize);
      setCurrentPage(current);
      setLimit(pageSize);
    }
  };

  /** *
   * 查询触发
   * @param fieldsValue
   */
  const handleSearch = fieldsValue => {
    const values = {
      ...fieldsValue,
      currentPage: 1,
      pageSize: 10,
    };
    setLimit(10);
    setCurrentPage(1);
    setFormValues(values);

    dispatch({
      type: `resource/fetch`,
      payload: values,
    });
  };

  //重置
  const handleReset = () => {
    const values = {
      currentPage: 1,
      pageSize: 10,
    };
    setLimit(10);
    setCurrentPage(1);
    setFormValues({});

    dispatch({
      type: `resource/fetch`,
      payload: values,
    });
  };

  const onChange = () => {};
  const onShowSizeChange = () => {};
  const showContentModal = () => {
    setContentVisable(true);
  };
  const handleContentCancel = () => {
    setContentVisable(false);
  };
  const showMarkModal = () => {
    setMarkVisable(true);
  };
  const handleMarkCancel = () => {
    setMarkVisable(false);
  };

  const formItemData = [
    {
      name: 'proCode',
      label: '档案大类',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
    {
      name: 'upstairsSeries',
      label: '文档类型',
      type: 'select',
      readSet: { name: 'proName', code: 'proCode', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
    {
      name: 'proType',
      label: '明细分类',
      type: 'select',
      readSet: { name: 'label', code: 'value' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
    {
      name: 'investmentManager',
      label: '文档名称',
      type: 'input',
    },
    {
      name: 'proRisk',
      label: '用印文档',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
    {
      name: 'proCdate',
      label: '归档日期',
      type: 'datepicker',
    },
    {
      name: 'proRisk',
      label: '产品名称',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
    {
      name: 'investmentManager',
      label: '文档备注',
      type: 'input',
    },
    {
      name: 'proRisk',
      label: '文档标签',
      type: 'select',
      readSet: { name: 'name', code: 'code', bracket: 'proCode' },
      config: { mode: 'multiple', maxTagCount: 1 },
      option: [],
    },
  ];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: currentPage,
    total,
    showTotal: total => `共 ${total} 条数据`,
  };

  return (
    <>
      <List
        formItemData={formItemData}
        advancSearch={handleSearch}
        searchPlaceholder="请输入"
        resetFn={handleReset}
        loading={listLoading}
      />
      <Row className={styles.header}>
        <Col span={12}>
          <span className={styles.headerTitle}>电子档案管理</span>
        </Col>
        <Col span={12} className={styles.textRight}>
          <Button type="primary">下载</Button>
          <Button type="primary" className={styles.marginLeft10}>
            标签管理
          </Button>
        </Col>
      </Row>
      <Row gutter={10}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(ele => (
          <Col span={6}>
            <Card className={styles.cardItem} bodyStyle={{ padding: 0 }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardName}>
                  文档名称说明书文档名称说明书文档名称说明书
                  <Checkbox className={styles.Checkbox} onChange={onChange}></Checkbox>
                </div>
                <p className={styles.cardInfo}>
                  <span className={styles.infoTit}>产品名称：</span>
                  <span className={styles.infoCon}>产品标识所用文字应当为规范中文</span>
                </p>
                <p className={styles.cardInfo}>
                  <span className={styles.infoTit}>归档时间：</span>
                  <span className={styles.infoCon}>2022-01-20</span>
                </p>
                <p className={styles.cardInfo}>
                  <span className={styles.infoTit}>档案大类：</span>
                  <span className={styles.infoCon}>账户类</span>
                </p>
                <p className={[styles.cardInfo, styles.tagWrap].join(' ')}>
                  <Tag color="magenta" className={styles.customCard}>
                    magenta
                  </Tag>
                  <Tag color="red" className={styles.customCard}>
                    red
                  </Tag>
                  <Tag color="volcano" className={styles.customCard}>
                    volcano
                  </Tag>
                  <Tag color="orange" className={styles.customCard}>
                    orange
                  </Tag>
                  <Tag color="gold" className={styles.customCard}>
                    gold
                  </Tag>
                  <Tag color="lime" className={styles.customCard}>
                    lime
                  </Tag>
                  <Tag color="green" className={styles.customCard}>
                    green
                  </Tag>
                  <Tag color="cyan" className={styles.customCard}>
                    cyan
                  </Tag>
                  <Tag color="blue" className={styles.customCard}>
                    blue
                  </Tag>
                  <Tag color="geekblue" className={styles.customCard}>
                    geekblue
                  </Tag>
                  <Tag color="purple" className={styles.customCard}>
                    purple
                  </Tag>
                </p>
              </div>
              {/* <div className={styles.divider} /> */}
              <Divider className={styles.divider} />
              <Row className={styles.cardHandler}>
                <Col span={8} className={styles.textCenter}>
                  <div className={styles.btn} onClick={showContentModal}>
                    <EyeOutlined />
                    <span>查看</span>
                  </div>
                </Col>
                <Col span={8} className={styles.textCenter}>
                  <div className={styles.btn}>
                    <DownloadOutlined />
                    <span>下载</span>
                  </div>
                </Col>
                <Col span={8} className={styles.textCenter}>
                  <div className={styles.btn} onClick={showMarkModal}>
                    <TagsOutlined />
                    <span>标签</span>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <div className={styles.paginationWrap}>
        <Pagination {...paginationProps} />
      </div>
      <Modal
        visible={contentVisable}
        title="文档详情"
        onOk={handleContentCancel}
        onCancel={handleContentCancel}
        footer={[
          <Button key="back" onClick={handleContentCancel}>
            取消
          </Button>,
        ]}
      >
        <p>
          文档名称：<a>文档名称点击打开文档.xlsx</a>
        </p>
        <p>归档时间：2021-11-15</p>
        <p>档案大类：账户类</p>
        <p>文档类型：估值表</p>
        <p>明细分类：三级分类</p>
        <p>产品名称：天弘添利债券(LOF)</p>
        <p>文档标签：标签名称、标签名称</p>
        <p>更新用户：管理员</p>
        <p>文档备注：</p>
      </Modal>
      <Modal
        visible={markVisable}
        title="标签管理"
        onOk={handleMarkCancel}
        onCancel={handleMarkCancel}
        footer={[
          <Button key="back" onClick={handleMarkCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={false}
            onClick={() => {
              console.log('保存');
            }}
          >
            保存
          </Button>,
        ]}
      >
        <p>
          <Input
            style={{ width: '260px', marginRight: '10px' }}
            placeholder="搜索标签"
            prefix={<SearchOutlined className="site-form-item-icon" />}
          />
          <Button>
            <PlusOutlined />
            添加标签
          </Button>
        </p>
        <p className={styles.tagWrap}>
          <Tag
            color="magenta"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            magenta
          </Tag>
          <Tag
            color="red"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            red
          </Tag>
          <Tag
            color="volcano"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            volcano
          </Tag>
          <Tag
            color="orange"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            orange
          </Tag>
          <Tag
            color="gold"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            gold
          </Tag>
          <Tag
            color="lime"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            lime
          </Tag>
          <Tag
            color="green"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            green
          </Tag>
          <Tag
            color="cyan"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            cyan
          </Tag>
          <Tag
            color="blue"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            blue
          </Tag>
          <Tag
            color="geekblue"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            geekblue
          </Tag>
          <Tag
            color="purple"
            className={styles.customCard}
            closable
            onClose={() => {
              console.log('close');
            }}
          >
            purple
          </Tag>
        </p>
      </Modal>
    </>
  );
};

const WrappedIndexForm = errorBoundary(
  Form.create()(
    connect(({ resource, loading }) => ({
      resource,
      listLoading: loading.effects['resource/fetch'],
    }))(Index),
  ),
);

export default WrappedIndexForm;

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Action, { linkHoc } from '@/utils/hocUtil';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { Form, Breadcrumb, Button, message, Descriptions, Spin } from 'antd';
import styles from './productElements.less';
import { Card, PageContainers } from '@/components';
import Gird from '@/components/Gird';

@Form.create()
class Index extends Component {
  state = {
    record: {},
    info: {},
    loading: false,
    dropDownData: {},
    orgData: [],
    activeKey: '',
    id: '',
  };

  componentDidMount() {
    this.getOrgData();
    this.getDropDownData();
    this.setState({ id: this.props?.location?.query?.id, activeKey: this.props?.location?.query?.activeKey }, () => {
      this.getInfo(this.props?.location?.query?.id);
    });
  }

  getInfo = id => {
    const { dispatch } = this.props;
    this.setState({ loading: true }, () => {
      dispatch({
        type: 'productElements/getBusiness',
        payload: id,
      }).then(res => {
        this.setState({ info: res, loading: false });
      });
    });
  };

  getOrgData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getOrgData',
        payload: { isOut: true, pageNum: 1, pageSize: 9999 },
      })
      .then(res => {
        if (res) {
          this.setState({ orgData: res });
        }
      });
  };

  getDropDownData = () => {
    this.props
      .dispatch({
        type: 'dataSource/getDropdownData',
        payload: {
          codeList:
            'plmIndustry,plmSysPEDataSubject,plmSysPESubjectTopCategory,plmSysPESubjectSecondCategory,plmSysPESubjectThirdCategory,plmSysPEBusinessScenario,plmSysPEBusinessClassification,plmSysPEDataGrading,plmSysPEElementChangeWay,plmSysPESort,plmSysPEDataSource,plmSysPEDataPushSystem,plmSysPEScene,plmSysPEComponentType,attributionSystem',
        },
      })
      .then(res => {
        if (res) {
          this.setState({ dropDownData: res });
        }
      });
  };

  jumpBack = () => {
    const { activeKey } = this.state;
    this.props.dispatch(
      routerRedux.push({
        pathname: '../productElementsList',
        query: { activeKey },
      }),
    );
  };
  render() {
    const { record, loading, info, dropDownData, orgData, activeKey } = this.state;
    const drawerConfig = [
      {
        label: '数据主体',
        value: 'dataSubject',
        type: 'select',
        option: dropDownData?.plmSysPEDataSubject,
      },
      {
        label: '一级分类',
        value: 'dataThemeLevelOne',
        type: 'select',
        option: dropDownData?.plmSysPESubjectTopCategory,
      },
      {
        label: '二级分类',
        value: 'dataThemeLevelTwo',
        type: 'select',
        option: dropDownData?.plmSysPESubjectSecondCategory,
      },
      {
        label: '三级分类',
        value: 'dataThemeLevelThree',
        type: 'select',
        option: dropDownData?.plmSysPESubjectThirdCategory,
      },
      {
        label: '业务场景',
        value: 'bizScene',
        type: 'select',
        option: dropDownData?.plmSysPEBusinessScenario,
      },
      {
        label: '业务分类',
        value: 'bizClass',
        type: 'select',
        option: dropDownData?.plmSysPEBusinessClassification,
      },
      {
        label: '英文业务属性',
        value: 'attributeName',
      },
      {
        label: '中文业务属性',
        value: 'bizDataName',
      },
      {
        label: '数据分级',
        value: 'dataLevel',
        type: 'select',
        option: dropDownData?.plmSysPEDataGrading,
      },
      {
        label: '要素变更方式',
        value: 'elementChangeType',
        type: 'select',
        option: dropDownData?.plmSysPEElementChangeWay,
      },
      {
        label: '是否为系统级别字段',
        value: 'systemLevel',
        type: 'select',
        option: [
          { name: '是', code: '1' },
          { name: '否', code: '0' },
        ],
      },
      {
        label: '数据来源',
        value: 'source',
        type: 'select',
        option: dropDownData?.plmSysPEDataSource,
      },
      {
        label: '数据推送(系统)',
        value: 'pushSystem',
        type: 'select',
        option: dropDownData?.plmSysPEDataPushSystem,
      },
      {
        label: '数据推送(场景)',
        value: 'pushScene',
        type: 'select',
        option: dropDownData?.plmSysPEScene,
      },
      { label: '排序', value: 'sort' },
      { label: '默认值', value: 'defaultValue' },
      { label: '字典中文名称', value: 'dicItem' },
      { label: '字典英文名称', value: 'dicItemCode' },
      { label: '说明', value: 'description' },
      { label: '提示语', value: 'tip' },
      {
        label: '所属行业',
        value: 'industry',
        type: 'multiple',
        option: dropDownData?.plmIndustry,
      },
      {
        label: '归属机构',
        value: 'orgId',
        type: 'select',
        option: orgData,
        optionConfig: { name: 'orgName', code: 'id' },
      },
      {
        label: '归属系统',
        value: 'sysId',
        type: 'select',
        option: dropDownData?.attributionSystem,
      },
      {
        label: '组件类型',
        value: 'widgetType',
        type: 'select',
        option: dropDownData?.plmSysPEComponentType,
      },
      {
        label: '关联表',
        value: 'tableName',
      },
    ];

    return (
      <>
        <PageContainers
          breadcrumb={[
            {
              title: '产品要素管理',
              url: '',
            },
            {
              title: `查看产品要素${activeKey === 'business' ? '业务信息' : '表结构信息'}`,
              url: '',
            },
          ]}
        />
        <Spin spinning={loading}>
          <Card title={`产品要素-${activeKey === 'business' ? '业务信息' : '表结构信息'}`}>
            <Gird config={drawerConfig} info={info} />
          </Card>
        </Spin>
      </>
    );
  }
}

const WrappedSingleForm = errorBoundary(
  linkHoc()(Form.create()(connect(({ productElements }) => ({ productElements }))(Index))),
);

export default WrappedSingleForm;

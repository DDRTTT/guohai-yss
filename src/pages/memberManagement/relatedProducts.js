import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Input, message, Select, Radio, Tooltip, Checkbox } from 'antd';
import { isEmptyObject } from '@/utils/utils';
import cloneDeep from 'lodash/cloneDeep';
import styles from './relatedProducts.less';
import MemberTableComponemt from './memberTableComponemt';
import { getSession } from '@/utils/session';

const { Search } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(state => ({
  memberManagement: state.memberManagement,
  orgAuthorize: state.orgAuthorize,
}))
export default class relatedProducts extends Component {
  state = {
    selectedRowKeys: [],
    value: 1,
    proCodesLen: 0,
    formValues: {
      currentPage: 1,
      pageSize: 10,
    },
    groups: null,
    proCodes: null,
    proTypes: null,
    selectedKeysAllProduct: null,
    childThis: null,
    index: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.props.save(this);
    this.handleSaveOldInfo();
    const outDiv = document.getElementById('out');

    // 获取岗位包含的组件详情信息
    // dispatch({
    //   type: 'memberManagement/handleGetRoleByPositions',
    // });

    if (outDiv) {
      outDiv.onwheel = function(event) {
        // 禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）
        event.preventDefault();
        // 设置鼠标滚轮滚动时屏幕滚动条的移动步长
        const step = 50;
        if (event.deltaY < 0) {
          // 向上滚动鼠标滚轮，屏幕滚动条左移
          this.scrollLeft -= step;
        } else {
          // 向下滚动鼠标滚轮，屏幕滚动条右移
          this.scrollLeft += step;
        }
      };
    }
  }

  onChange = e => {
    const item = e.target;
    const { dispatch } = this.props;
    this.state.childThis.handleBoolReset();
    if (e) {
      const { groups } = item;
      const { proTypes } = item;
      const { proCodes } = item;

      this.setState({
        proCodesLen: proCodes.length,
        groups,
        proCodes,
        proTypes,
        selectedRowKeys: proCodes,
        selectedKeysAllProduct: ['allProduct'],
        index: item.value,
      });
      // 当前组件的分组code[]
      dispatch({
        type: 'memberManagement/handleonCheckGroup',
        payload: groups,
      });
      // 当前组件的分类code[]
      dispatch({
        type: 'memberManagement/handleonCheckProTypes',
        payload: proTypes,
      });
      // 当前组件的产品code[]
      dispatch({
        type: 'memberManagement/handleonCheckProCodes',
        payload: proCodes,
      });
      // 设置Tree反显
      dispatch({
        type: 'memberManagement/handleonOnSelectKeys',
        payload: ['allProduct'],
      });
      // 获取全部产品列表
      this.handleAllProduct();
    } else {
      this.setState({
        index: undefined,
      });
      this.handleReset();
      dispatch({
        type: 'memberManagement/handleReset',
        payload: [],
      });
    }
  };

  handleRadioBox = () => {
    const {
      orgAuthorize: {
        // 已选组件
        dataPage: { userRole },
      },
      // 已选岗位组件--
      memberManagement: { saveGetRoleByPositions },
    } = this.props;
    const uniqueArr = [...userRole, ...saveGetRoleByPositions];

    function unique(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    }

    unique(uniqueArr);
    const arr = uniqueArr
      .filter(item => item.sysId === 0 || item.sysId === 1)
      .map((item, index) => {
        const { groups } = item;
        const groupLen = groups.length;
        const { proCodes } = item;
        const proCodesLen = proCodes.length;
        const { proTypes } = item;
        const proTypesLen = proTypes.length;
        const type = item.type === '01' ? '#5180db' : '#3acccc';

        return (
          <div className={styles.gridStyle} style={{ background: type }} key={index}>
            <div className={styles.firBox}>
              <div className={styles.innerBox}>
                <Tooltip title={item.name}>{item.name}</Tooltip>
              </div>
              <Radio value={index} groups={groups} proCodes={proCodes} proTypes={proTypes} />
            </div>
            <div className={styles.sedBox}>
              <div>关联产品</div>
              <div>
                <p>
                  <span>{groupLen + proTypesLen}</span>
                  <span>组</span>
                </p>
                <p>
                  <span>{proCodesLen}</span>
                  <span>项</span>
                </p>
              </div>
            </div>
          </div>
        );
      });
    return (
      <RadioGroup
        value={this.state.index}
        className={styles.scrollBox}
        onChange={this.onChange}
        id="out"
      >
        {arr}
      </RadioGroup>
    );
  };

  // 存储proCodes的长度，用于显示
  handleLen = len => {
    this.setState({
      proCodesLen: len,
    });
  };

  // 基本信息
  selectedRole = () => {
    const {
      orgAuthorize: {
        dataPage: { userRole },
      },
      memberManagement: { saveGetRoleByPositions },
    } = this.props;
    return (
      <Card bordered={false} className={styles.content}>
        <p>已选择组件({userRole.length + saveGetRoleByPositions.length})：</p>
        <Card>{this.handleRadioBox()}</Card>
      </Card>
    );
  };

  // save4
  handleSubmit = () => {
    this.handleDGAddAuth();
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
        this.handleSetAuth();
      });
    });
  };

  handleTitle = () => {
    const {
      memberManagement: {
        saveDictList: { manuscriptStrategy },
        saveDGManuscriptStrategy,
      },
    } = this.props;
    const cloneDeepManuscriptStrategy = cloneDeep(manuscriptStrategy);
    cloneDeepManuscriptStrategy?.map(item => {
      item.label = item.name;
      item.value = item.code;
    });
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    if (firstSysIds !== '4') {
      return (
        <>
          <span>关联产品 :</span>
          <Search
            placeholder="请输入产品代码或产品名称"
            onSearch={value => this.handleAllProduct(value)}
            style={{ width: 215, marginLeft: 10 }}
          />
        </>
      );
    }
    return (
      <>
        <span>选择策略：</span>
        <Checkbox.Group
          options={cloneDeepManuscriptStrategy}
          onChange={this.onChangeStrategy}
          defaultValue={saveDGManuscriptStrategy}
        />
      </>
    );
  };

  onChangeStrategy = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/saveDGManuscriptStrategy',
      payload: item,
    });
  };

  onChangeAuthorizationStrategy = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/saveAuthorizationStrategy',
      payload: item,
    });
  };

  // 功能点
  handleExit = () => {
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    if (firstSysIds !== '4') {
      return (
        <div>
          <span>已关联产品：{`${this.state.proCodesLen}` ? `${this.state.proCodesLen}` : 0}个</span>
          <Button
            type="primary"
            style={{ marginLeft: 64, width: 113 }}
            onClick={this.handleSaveAuth}
          >
            关联到此组件
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
            重置
          </Button>
        </div>
      );
    }
    return (
      <div>
        {/*        <Button
          type="primary"
          // style={{ marginLeft: 64, width: 113 }}
          onClick={this.handleDGAddAuth}
        >
          添加权限
        </Button> */}
        {/*        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
          重置
        </Button> */}
      </div>
    );
  };

  handleDGAddAuth = () => {
    // 底稿授权按钮
    this.state.childThis.handleDGSubmit();
  };

  // 重置
  handleReset = () => {
    this.setState({
      proCodesLen: 0,
      groups: [],
      proCodes: [],
      proTypes: [],
      selectedKeysAllProduct: [],
      selectedRowKeys: [],
      index: undefined,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'memberManagement/handleSavePack',
      payload: {},
    });
    dispatch({
      type: 'memberManagement/handleReset',
      payload: [],
    });
    this.state.childThis.handleReset();
  };

  // 获取全部产品table
  handleAllProduct = item => {
    const {
      dispatch,
      memberManagement: { saveOrgId },
    } = this.props;

    const { formValues } = this.state;
    const val = {
      ...formValues,
      // userOrgId: saveOrgId,
      proCondition: item && item.trim(),
    };

    this.setState({
      formValues: val,
    });
    this.state.childThis.setFormValues(val);
    dispatch({
      type: 'memberManagement/handlePermissionsByCondition',
      payload: val,
    });
  };

  // 保存权限
  handleSaveAuth = () => {
    this.state.childThis.handleSetAuthToPack();
  };

  // 保存预留初始组件
  handleSaveOldInfo = () => {
    const {
      dispatch,
      orgAuthorize: { dataPage },
    } = this.props;
    // 预留初始组件
    const Repack = cloneDeep(dataPage);
    dispatch({
      type: 'memberManagement/handleSaveOldInfo',
      payload: Repack,
    });
  };

  uniqueArr = arr => {
    return [...new Set(arr)];
  };

  // 设置权限（下一步按钮）
  handleSetAuth = () => {
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    const {
      dispatch,
      memberManagement: {
        saveCurrent,
        savePack,
        saveOrgId,
        saveDGData,
        saveInfo,
        saveAuthorizationStrategy,
      },
      sign,
      step,
      orgAuthorize: { dataPage },
    } = this.props;

    const newProjects = (saveDGData && saveDGData?.projects) || [];
    const newProType = (saveDGData && saveDGData?.proType) || [];
    const newAuthtactic = (saveDGData && saveDGData?.authtactics) || [];

    const DGData = {
      projects: this.uniqueArr(newProjects),
      proType: this.uniqueArr(newProType),
      authtactics: this.uniqueArr(newAuthtactic),
    };

    let pack;
    if (isEmptyObject(savePack)) {
      pack = cloneDeep({ ...dataPage, orgId: saveOrgId, ...saveInfo });
    } else {
      pack = cloneDeep(savePack);
    }
    // 当前系统标识
    pack.currentSysId = firstSysIds;
    // 自动授权策略，不点击关联到此组件时，也会添加到数据中
    pack.strategyCodes = saveAuthorizationStrategy;
    // 底稿的类、产品和策略
    let authtactics;
    let projects;
    let proType;
    if (firstSysIds === '4') {
      pack.projects = DGData;
      authtactics = pack.projects.authtactics;
      proType = pack.projects.proType;
      projects = pack.projects.projects;
    }
    const { userRole } = pack;

    if (!userRole) {
      message.warning('请给组件关联产品，再进行下一步');
      return;
    }

    // 产品生命周期
    if (firstSysIds === '1') {
      if (userRole.length !== 0) {
        for (let i = 0; i < userRole.length; i++) {
          const item = userRole[i];
          if (pack.strategyCodes.length === 0) {
            if (
              item.proTypes.length === 0 &&
              item.groups.length === 0 &&
              item.proCodes.length === 0
            ) {
              message.warning('请给组件关联产品');
              return;
            }
          }
        }
      }
    }

    // 底稿
    if (firstSysIds === '4') {
      if (!authtactics && !projects && !proType) {
        message.warning('请给用户授权产品');
        return;
      }
      if (
        authtactics &&
        authtactics.length === 0 &&
        projects &&
        projects.length === 0 &&
        proType &&
        proType.length === 0
      ) {
        message.warning('请给用户授权产品');
        return;
      }
    }
    // 编辑授权保存
    dispatch({
      type: 'memberManagement/handleOperationAuthority',
      payload: {
        pack,
        current: saveCurrent,
      },
    });
  };

  save = childThis => {
    this.setState({
      childThis,
    });
  };

  render() {
    const sysId = getSession('sysId');
    const firstSysIds = sysId?.split(',')[0] || 1;
    const {
      memberManagement: {
        saveDictList: { authorizationStrategy },
        saveAuthorizationStrategy,
      },
    } = this.props;
    const {
      selectedRowKeys,
      groups,
      proTypes,
      proCodes,
      selectedKeysAllProduct,
      formValues,
      index,
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      // total: total,
    };
    let columns;
    if (firstSysIds === '4') {
      columns = [
        {
          title: '项目代码',
          dataIndex: 'proCode',
          key: 'proCode',
        },
        {
          title: '项目名称',
          dataIndex: 'proName',
          key: 'proName',
          // width: '300px',
        },
        {
          title: '项目类型',
          dataIndex: 'proTypeName',
          key: 'proTypeName',
        },
      ];
    } else {
      columns = [
        {
          title: '产品代码',
          dataIndex: 'proCode',
          key: 'proCode',
        },
        {
          title: '产品名称',
          dataIndex: 'proName',
          key: 'proName',
          // width: '300px',
        },
        {
          title: '产品类型',
          dataIndex: 'proTypeName',
          key: 'proTypeName',
        },
      ];
    }
    const rowSelection = {
      selectedRowKeys,
      fixed: false,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: record => ({
        name: record.name,
      }),
    };
    const cloneDeepAuthorizationStrategy = cloneDeep(authorizationStrategy);

    cloneDeepAuthorizationStrategy?.map(item => {
      item.label = item.name;
      item.value = item.code;
    });
    return (
      <div className={styles.content}>
        {firstSysIds !== '4' && this.selectedRole()}

        <Card bordered={false}>
          {firstSysIds === '1' && (
            <>
              <span>数据组件：</span>
              <Checkbox.Group
                options={cloneDeepAuthorizationStrategy}
                onChange={this.onChangeAuthorizationStrategy}
                defaultValue={saveAuthorizationStrategy}
              />
            </>
          )}
        </Card>

        <Card bordered={false} title={this.handleTitle()} extra={this.handleExit()}>
          <MemberTableComponemt
            grantApplication={this.props.grantApplication}
            columns={columns}
            formValues={formValues}
            pagination={paginationProps}
            rowSelection={rowSelection}
            // 分组code[]
            groups={groups}
            // 产品类code[]
            proTypes={proTypes}
            // 单一产品code[]
            proCodes={proCodes}
            selectedKeysAllProduct={selectedKeysAllProduct}
            save={this.save}
            // 组件索引
            index={index}
            // 获取组件个数保存显示
            handleLen={this.handleLen}
          />
        </Card>
      </div>
    );
  }
}

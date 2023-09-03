import React, { useEffect, useState, useRef, useContext, forwardRef, useMemo } from 'react';
import { Row, Col, Form, Layout, message, Spin, Select, Icon } from 'antd';
import { connect } from 'dva';
import icon_cornerMark from '@/assets/processLibraryGuide/icon_cornerMark.png';
import icon_test from '@/assets/processLibraryGuide/icon_test.png';
import icon_rightAllow from '@/assets/processLibraryGuide/icon_rightAllow.png';
import icon_close from '@/assets/processLibraryGuide/icon_close.png';
import router from 'umi/router';
import { commonRequest } from '@/services/processCenterHome/index';
import style from './index.less';
import flatMap from 'lodash/flatMap';
import { getMenu } from '@/utils/session';
import { recursiveGetData } from '@/utils/utils';

const { Header, Content } = Layout;
const { Option } = Select;
// 获取用户权限
let menuTree = [];
// 跳转
const handlerJump = (_nodeActionType, _nodeActionUri) => {
  if (_nodeActionType != '//') {
    // 跳转到本地路由
    if (_nodeActionType == 'uri') {
      // 判断跳转权限
      if (menuTree.includes(_nodeActionUri) || menuTree.includes(_nodeActionUri + '/index')) {
        router.push(_nodeActionUri);
      } else {
        message.error('您没有该流程的权限,请联系管理员');
      }
    } else {
      // 如果是resource的话,调接口,但是不用做处理
      commonRequest(_nodeActionUri);
    }
  }
};

// 获取node的y坐标
const getAbsPosition = element => {
  let actualTop = element.offsetTop;
  let parent = element.offsetParent;
  while (parent != null) {
    actualTop += parent.offsetTop + (parent.offsetHeight - parent.clientHeight) / 2;
    parent = parent.offsetParent;
  }
  return actualTop;
};

// 设置指引页的位置
const setDetailTop = (_node, _target) => {
  _target.style.top = `${getAbsPosition(_node) + 40}px`;
};
// 最底下的引导详情
const GuideDetail = forwardRef((props, ref) => {
  const {
    data: {
      name,
      id,
      cellImgUri,
      nodeActionUri,
      nodeActionType,
      cornerMark = 0,
      cellSummery,
      cellDetail,
    },
    changeCurrentId,
    currentId,
  } = props;
  const newCellDetail = cellDetail || { guideList: [], moreHelp: '' };
  const { guideList, moreHelp } = newCellDetail;
  return (
    <div style={{ display: currentId === id ? 'block' : 'none' }} ref={ref} className="descWrap">
      <div className="descTop">
        <p className="descTitle">{cellSummery}</p>
        <img
          src={icon_close}
          onClick={() => {
            changeCurrentId(id);
          }}
          alt=""
        />
      </div>
      <div className="descContent">
        {guideList.map((item, index) => {
          return (
            <div className="descStepItem" key={`descStep${index}`}>
              <p className="descTitle">{item.title}</p>
              <p>{item.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="descBottom">
        <div
          className="intoProcessBtn"
          onClick={() => {
            handlerJump(nodeActionType, nodeActionUri);
          }}
        >
          进入流程
          <img src={icon_rightAllow} alt="" />
        </div>
      </div>
    </div>
  );
});
// 流程的那些小卡片
const PhaseItem = props => {
  const {
    data: {
      name,
      id,
      cellImgUri,
      nodeActionUri,
      nodeActionType,
      cornerMark = 0,
      cellSummery,
      cellDetail,
    },
    changeCurrentId,
    currentId,
  } = props;
  const newCellDetail = cellDetail || { guideList: [], moreHelp: '' };
  const { guideList, moreHelp } = newCellDetail;
  const { detailRef } = useContext(GuideContext);
  return (
    <>
      <div className="phaseItem">
        <div className="cornerMark" style={{ display: cornerMark <= 0 ? 'none' : 'block' }}>
          <img src={icon_cornerMark} alt="" />
          <p>{cornerMark}</p>
        </div>
        <img src={`/img/lifecycle/process/icon/${cellImgUri}`} alt="" className="icon" />
        <p className="itemTitle">{name}</p>
        <div className="bottom">
          <p
            onClick={e => {
              setDetailTop(e.currentTarget.parentNode.parentNode, detailRef.current);
              changeCurrentId(id);
            }}
          >
            {currentId === id ? '收起指引' : '查看指引'}
          </p>
          <div className="line" />
          <div
            onClick={() => {
              handlerJump(nodeActionType, nodeActionUri);
            }}
          >
            进入流程
            <Icon type="caret-right" />
          </div>
        </div>
        <div className="trangle" style={{ display: currentId === id ? 'block' : 'none' }} />
      </div>
    </>
  );
};

// 流程的段落
const PhaseWrap = props => {
  const {
    data: { name, process },
    index,
    changeCurrentId,
    currentId,
  } = props;
  return (
    <div className="phaseWrap">
      <div className="title">
        <p id={`phaseStepItem${index}`}>{`—— ${name} ——`}</p>
        <div className="phaseContent">
          {process.map((item, index) => {
            return (
              <PhaseItem
                changeCurrentId={changeCurrentId}
                currentId={currentId}
                data={item}
                key={item.code}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const GuideContext = React.createContext({});
// 流程库指引
const Index = props => {
  const {
    dispatch,
    phaseData: phaseList,
    stageList: planList,
    proTypeAndCodeList,
    proStageTaskList,
    codeList: { A002: proTypeList = [] },
    getProTypeAndCodeLoading,
    // getProStageTaskLoading,
    getPhaseDataLoading,
    getStageListLoading,
  } = props;
  // 当前选中的card的指引
  const [currentId, setCirrentId] = useState(-1);
  // 当前的数据
  const [currentData, setCurrentData] = useState({});
  // 融合以后的数据
  const [fuseList, setFuseList] = useState([]);
  // 融合以后的阶段的数据
  const [fuseStageList, setfuseStageList] = useState([]);
  // 设置上面的loading
  const [upLoading, setUpLoading] = useState(false);
  // 设置下面的loaidng
  const [downLoading, setDownLoading] = useState(false);
  // 当前的code
  const [currentCode, setCurrentCode] = useState('');
  // 计算阶段统计的个数的loading
  const [getProStageTaskLoading, setGetProStageTaskLoading] = useState(false);
  // 切换的card的指引的时候
  const changeCurrentId = _id => {
    setCirrentId(currentId === _id ? -1 : _id);
  };
  // 自行计算统计数据
  const phaseMemoList = useMemo(() => {
    return () => {
      let temp = {};
      if (fuseList.length > 0) {
        fuseList.map((item, index) => {
          temp[item.code] = item.process.reduce((total, current) => {
            return total + current.cornerMark || 0;
          }, 0);
        });
      }
      return planList.map(item => {
        return {
          ...item,
          taskNum: temp[item.code] || 0,
        };
      });
    };
  }, [planList, fuseList]);

  const detailRef = useRef();
  // // 阶段的loading
  // useEffect(() => {
  //   setUpLoading(getStageListLoading || getProStageTaskLoading);
  // }, [getStageListLoading, getProStageTaskLoading]);
  // 最下面流程的loading
  useEffect(() => {
    setDownLoading(getPhaseDataLoading || getProTypeAndCodeLoading);
    setUpLoading(getPhaseDataLoading || getProTypeAndCodeLoading);
  }, [getPhaseDataLoading, getProTypeAndCodeLoading]);

  useEffect(() => {
    if (proTypeList.length > 0) {
      setCurrentCode(proTypeList[0].code);
    }
  }, [proTypeList]);

  useEffect(() => {
    if (!currentCode) return;
    dispatch({
      type: 'processLibraryGuide/getPhaseData',
      payload: {
        proCode: currentCode,
      },
    });
    dispatch({
      type: 'processLibraryGuide/getStageList',
      payload: {
        proCode: currentCode,
      },
    });
  }, [currentCode]);

  useEffect(() => {
    // 获取用户权限
    menuTree = ((getMenu() && JSON.parse(getMenu())) || []).find(item => {
      return item.code == 'productLifecycle';
    });
    menuTree = flatMap(recursiveGetData(menuTree, 'children'));
    menuTree =
      (menuTree &&
        menuTree.map(item => {
          return '/' + item.path;
        })) ||
      [];
    dispatch({
      type: 'investorReview/getDicsByTypes',
      payload: ['A002'],
    });
  }, []);
  useEffect(() => {
    if (!planList || planList.length <= 0 || !currentCode) return;
    const codes = planList.map(item => item.code);
    // dispatch({
    //   type: 'processLibraryGuide/getProStageTask',
    //   payload: { proStage: codes, proType: currentCode },
    // });
  }, [planList]);
  // useEffect(() => {
  //   if (!proStageTaskList || proStageTaskList.length <= 0) return;
  //   const tempList = JSON.parse(JSON.stringify(planList));
  //   tempList.forEach(item => {
  //     const tempItem = proStageTaskList.find(sonItem => sonItem.stage == item.code);
  //     item.taskNum = tempItem && tempItem.count ? tempItem.count : 0;
  //   });
  //   setfuseStageList(tempList);
  // }, [proStageTaskList]);
  useEffect(() => {
    let tempList = phaseList.map(item => {
      return item.process;
    });
    tempList = flatMap(tempList);
    const tempData = tempList.find(sonItem => sonItem.id == currentId) || {};
    setCurrentData(tempData);
  }, [currentId]);

  useEffect(() => {
    if (!phaseList || phaseList.length <= 0 || !currentCode) return;
    setFuseList(JSON.parse(JSON.stringify(phaseList)));
    let tempList = phaseList.map(item => {
      return item.process.map(item => item.code);
    });
    tempList = _.flatMap(tempList);
    dispatch({
      type: 'processLibraryGuide/getProTypeAndCode',
      payload: {
        codes: tempList,
        proType: currentCode,
      },
    });
  }, [phaseList]);

  useEffect(() => {
    if (!proTypeAndCodeList || proTypeAndCodeList.length <= 0) return;
    const temp = JSON.parse(JSON.stringify(fuseList));
    temp.map(item => {
      item.process.map(sonItem => {
        sonItem.cornerMark = proTypeAndCodeList.find(
          grandSonItem => sonItem.code == grandSonItem.code,
        ).count;
      });
    });
    setFuseList(temp);
  }, [proTypeAndCodeList]);

  const handleScrollIntoView = key => {
    document.querySelector(`#${key}`).scrollIntoView();
  };

  return (
    <GuideContext.Provider value={{ detailRef }}>
      <div className={style.processLibraryGuide}>
        <Spin spinning={upLoading} wrapperClassName="floatTop">
          <Header>
            <div className="headerLeft">
              <p>产品类型:</p>
              <Select
                style={{ width: 208 }}
                showSearch
                value={currentCode}
                onChange={value => {
                  setCurrentCode(value);
                }}
              >
                {proTypeList.map((item, index) => {
                  return (
                    <Option key={index} value={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="site-layout-background">
              <div className="bgBar" />
              <div className="phaseStepWrap">
                {/* {fuseStageList.map((item, index) => { */}
                {phaseMemoList().map((item, index) => {
                  return (
                    <div
                      className="phaseStepItem"
                      key={`phaseStepItem${index}`}
                      onClick={() => handleScrollIntoView(`phaseStepItem${index}`)}
                    >
                      <p>{item.taskNum}</p>
                      <p>{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Header>
        </Spin>
        <Spin spinning={downLoading}>
          <div className="content">
            {fuseList.map((item, index) => {
              return (
                <PhaseWrap
                  data={item}
                  index={index}
                  currentId={currentId}
                  changeCurrentId={changeCurrentId}
                  key={item.code}
                />
              );
            })}
            <GuideDetail
              ref={detailRef}
              data={currentData}
              currentId={currentId}
              changeCurrentId={changeCurrentId}
            />
          </div>
        </Spin>
      </div>
    </GuideContext.Provider>
  );
};
const processLibraryGuide = state => {
  const {
    dispatch,
    loading,
    processLibraryGuide: { phaseData, stageList, proTypeAndCodeList, proStageTaskList },
    investorReview: { codeList },
  } = state;

  return {
    dispatch,
    phaseData,
    stageList,
    proTypeAndCodeList,
    proStageTaskList,
    codeList,
    getStageListLoading: loading.effects['processLibraryGuide/getStageList'],
    getPhaseDataLoading: loading.effects['processLibraryGuide/getPhaseData'],
    // getProStageTaskLoading: loading.effects['processLibraryGuide/getProStageTask'],
    getProTypeAndCodeLoading: loading.effects['processLibraryGuide/getProTypeAndCode'],
  };
};
export default Form.create()(connect(processLibraryGuide)(Index));

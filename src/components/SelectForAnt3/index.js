/**
 * 解决antd3 select渲染性能问题
 **/
import React, {useEffect, useState} from 'react';
import {Select} from 'antd';

const { Option } = Select;

const Index = (props) => {
  const { labelKey, value ,valueKey, symbolKey, selectConfig, data } = props;
  const [showData, setShowData] = useState([]);
  const [showIndex, setShowIndex] = useState(0);
  const [limit, setLimit] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const showData = limitData(data);
    setShowIndex(0);
    setShowData(showData);
    setLimit(Math.ceil(data.length/100)); // 最大页数
  }, [data]);

  const handelPopupScroll = (e) => {
    const { target } = e;
    if(Math.ceil(target.scrollTop) + target.offsetHeight - 50 === target.scrollHeight){ // 当前显示内容高度极限
      if(showIndex + 1 < limit){
        setShowData([...data.slice(0, (showIndex + 2) * 100)]);
        setShowIndex(showIndex + 1);
      }
    }
  };

  const limitData = (data) => {
    return data.length > 100 ? data.slice(0, 100) : data;
  };

  const handelSearch = (value) => {
    if(selectConfig.onSearch){
      selectConfig.onSearch(value);
    } else {
      if(value.replace(/\s+/g)){
        // 过滤结果超过100条不显示
        const showData = limitData(data.filter((item)=>{
          return item[labelKey].includes(value);
        }));
        setShowData([...showData]);
      } else {
        setShowData([...limitData(data)]);
      }
    }
  };
  const handelBlur = (e) => {
    setShowData([...limitData(data)]);
  };
  return <Select
      { ...selectConfig }
      filterOption={false}
      onSearch={handelSearch}
      onBlur={handelBlur}
      onPopupScroll={handelPopupScroll}
    >
      { showData.map((item)=>(<Option key={symbolKey ? item[symbolKey] + '' : item[valueKey] + ''} value={item[valueKey]}>{item[labelKey]}</Option>)) }
    </Select>
}


export default Index;

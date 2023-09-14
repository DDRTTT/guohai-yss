import React, {forwardRef,useEffect} from 'react';
import {useSetState}from 'ahooks';
import {DatePicker} from 'antd';
import moment from 'moment';

 function YearPiker(props) {
  const [state,setState]=useSetState({
    isopen:false,
    time:null,
    allowClear:true
  })
  useEffect(()=>{
    setState({tim:moment()})
  },[props.isModalVisible])
  const handlePanelChange = (value) => {
    setState({
      isopen: false,
      tim:value
    })
    props.onPanelChange && props.onPanelChange(value)
  }

  const handleOpenChange = (status) => {
    if (status) {
      setState({ isopen: true })
    } else {
      setState({ isopen: false })
    }
  }

  const clearValue = () => {
    props.onPanelChange && props.onPanelChange(null)
  }

    return (
      <div>
        <DatePicker
          {...props}
          value={state.tim}
          mode="year"
          open={state.isopen}
          onOpenChange={handleOpenChange}
          onPanelChange={handlePanelChange}
          onChange={clearValue}
          allowClear={false}
          placeholder={'请选择'}
        />
      </div>
    )
}
export default forwardRef(YearPiker)

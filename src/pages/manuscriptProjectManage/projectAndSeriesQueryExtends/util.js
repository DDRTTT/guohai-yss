/**
 * select下拉框
 * 前台进行模糊匹配
 * **/
const handleFilterOption = (input, option) => {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

/**
 * 解决antd 3x版本 页码分页bug
 * 分页页码快速跳转失焦input内容不清空
 * 4x版本不存在此问题
 * **/
const handleClearQuickJumperValue = () => {
  setTimeout(() => {
    const inputDom = document.querySelector('.ant-pagination-options-quick-jumper input');
    if (inputDom) inputDom.value = '';
  }, 400);
};

/**
 * form表单提交时 格式化RangePicker格式日期
 * data: form表单获取到值
 * formatStr：后台所需的日期类型
 * 默认年月日 形如：startTime:["2021-01-07", "2021-01-10"]
 * **/
const rangPickerFormat = (data, formatStr = 'YYYY-MM-DD') => {
  return data ? data.map(item => item.format(formatStr)) : [];
};

/**
 * form表单提交时 格式化DatePicker格式日期
 * data: form表单获取到值
 * formatStr：后台所需的日期类型
 * 默认年月日 形如：startTime:"2021-01-07"
 * **/
const datePickerFormat = (data, formatStr = 'YYYY-MM-DD') => {
  return data ? data.format(formatStr) : '';
};

export { handleFilterOption, handleClearQuickJumperValue, rangPickerFormat, datePickerFormat };

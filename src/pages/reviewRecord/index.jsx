// 评审记录管理
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Tooltip } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';
import { uuid, getNamebyId } from '@/utils/utils';

const { confirm } = Modal;

const Index = ({
    dispatch,
    repaymentInstructions: { dicts, investmentManagerDataList },
}) => {
    const [pageNum, setPageNum] = useState(1); // 当前页面页数
    const [pageSize, setPageSize] = useState(10); // 当前页面展示数量
    const [total, setTotal] = useState(0); // 总条数
    const [tableList, setTableList] = useState([]); // 表格数据
    const [proList, setProList] = useState([]); // 表格数据
    const [tableLoading, setTableLoading] = useState(false);
    const [keyWords, setKeyWords] = useState(undefined); // 模糊搜索关键字
    const [superSearch, setSuperSearch] = useState(undefined); // 高级查询条件

    useEffect(() => {
        getProDropList();
        getDictsOptions();
        getInvestmentManager();
    }, []);

    useEffect(() => {
        getTableList();
    }, [pageNum, pageSize, keyWords, superSearch]);// 此4参数任一变化，会触发列表页加载

    // 字典数据-产品类型
    const getDictsOptions = () => {
        dispatch({
            type: 'repaymentInstructions/getDicts',
            payload: { codeList: ['A002'] },
        });
    };

    // 获取投资经理下拉列表
    const getInvestmentManager = () => {
        dispatch({
            type: 'repaymentInstructions/getInvestmentManagerFunc',
        });
    };

    // 获取产品全称/代码下拉列表
    const getProDropList = () => {
        dispatch({
            type: 'reviewRecord/getProductDropList'
        }).then(res => {
            setProList(res);
        })
    }

    // 请求方法:获取表格数据
    async function getTableList() {
        const basicSearch = { pageNum, pageSize, keyWords }; // 模糊查询条件
        const params = superSearch ? { ...basicSearch, ...superSearch } : basicSearch;
        setTableLoading(true);
        await dispatch({
            type: 'reviewRecord/getReviewRecord',
            payload: params
        }).then(res => {
            setTableList(res.rows);
            setTotal(res.total);
        })
        setTableLoading(false);
    }

    // 点击详情，跳转评审记录查询页
    function handleCheck(record) {
        router.push(`/productDataManage/reviewRecord/index/check?proCode=${record.proCode}&tabKey=${record.objectLevel}`);
    }

    // 页码属性设置
    const paginationProps = {
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        current: pageNum,
        onChange: page => {
            setPageNum(page);
        },
        onShowSizeChange: (current, size) => {
            setPageNum(1);
            setPageSize(size);
        },
        showTotal: () => {
            return `共 ${total} 条数据`;
        },
    };

    // 数据:条件查询配置
    const formItemData = [
        {
            name: 'proName',
            label: '系列/产品全称',
            type: 'select',
            readSet: { name: 'proName', code: 'proName' },
            option: proList
        },
        {
            name: 'proType',
            label: '产品类型',
            type: 'select',
            readSet: { name: 'name', code: 'code' },
            option: dicts.A002,
        },
        {
            name: 'investmentManager',
            label: '投资经理',
            type: 'select',
            readSet: { name: 'name', code: 'empNo' },
            option: investmentManagerDataList,
        },
    ];

    // 静态数据:表头
    const columns = [
        {
            title: '系列/产品简称',
            dataIndex: 'proName',// 实际含义：系列展示全称，产品展示简称
            key: 'proName',
            ...tableRowConfig,
            width: 480,
            sorter: false,
        },
        {
            title: '系列号/产品代码',
            dataIndex: 'proCode',
            key: 'proCode',
            ...tableRowConfig,
            width: 250,
            sorter: false,
            align: 'center',
        },
        {
            title: '产品类型',
            dataIndex: 'proType',
            key: 'proType',
            ...tableRowConfig,
            width: 250,
            sorter: false,
            align: 'center',
        },
        {
            title: '投资经理',
            dataIndex: 'investmentManager',
            key: 'investmentManager',
            width: 400,
            ellipsis: true,
            sorter: false,
            align: 'center',
            render: text => {
                const label = getNamebyId(text, investmentManagerDataList, 'empNo', 'name')
                return (
                    <Tooltip title={label} placement="topLeft">
                        {label
                            ? label.toString().replace(/null/g, '-')
                            : label === '' || label === undefined || label === null
                                ? '-'
                                : 0}
                    </Tooltip>
                );
            }
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            align: 'center',
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => handleCheck(record)}>
                        详情
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <List
                title={'评审记录管理'}
                formItemData={formItemData}
                advancSearch={fieldsValue => {
                    const values = fieldsValue || {};
                    setSuperSearch(values);
                    setPageNum(1);
                }}
                resetFn={() => {
                    setPageNum(1);
                    setSuperSearch(undefined);
                    setKeyWords(undefined);
                }}
                searchPlaceholder="请输入系列/产品全称"
                fuzzySearch={value => {
                    setKeyWords(value);
                    setPageNum(1);
                }}
                tableList={
                    <Table
                        pagination={paginationProps} // 分页栏
                        loading={tableLoading} // 加载中效果
                        rowKey={uuid()} // key值
                        dataSource={tableList} // 表数据源
                        columns={columns} // 表头数据
                        scroll={{ x: true }}
                    />
                }
            />
        </>
    );
};

const WrappedIndexForm = errorBoundary(
    connect(({ repaymentInstructions }) => ({
        repaymentInstructions,
    }))(Index),
);

export default WrappedIndexForm;

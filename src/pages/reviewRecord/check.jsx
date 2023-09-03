// 评审记录查询
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Tooltip, Tabs, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { errorBoundary } from '@/layouts/ErrorBoundary';
import { tableRowConfig } from '@/pages/investorReview/func';
import { handleShowTransferHistory } from '@/utils/transferHistory';
import { Table } from '@/components';
import List from '@/components/List';
import { getUrlParams } from '@/utils/utils'
import { uuid } from '@/utils/utils';

const { confirm } = Modal;
const { TabPane } = Tabs;
const rowConfig = { ...tableRowConfig, sorter: false, align: 'center', width: 150 };

const Index = ({
    dispatch,
    form,
    repaymentInstructions: { dicts },
}) => {
    const [pageNum, setPageNum] = useState(1); // 当前页面页数
    const [pageSize, setPageSize] = useState(10); // 当前页面展示数量
    const [tabType, setTabType] = useState('1'); // 默认定位在系列信息tab(产品信息 tabType = 2)
    const [keyWords, setKeyWords] = useState(undefined); // 模糊搜索-系列/产品名称
    const [tableList, setTableList] = useState([]); // 表格数据
    const [total, setTotal] = useState(0); // 总条数
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        let tabKey = getUrlParams('tabKey');
        tabKey = tabKey === '0' ? '1' : '2';// 评审记录管理页的 0 标识系列信息，对应本页的 1
        setTabType(tabKey);
        getDictsOptions();
    }, []);

    useEffect(() => {
        getTableList();
    }, [pageNum, pageSize, tabType, keyWords]);

    // 字典数据-风险等级
    const getDictsOptions = () => {
        dispatch({
            type: 'repaymentInstructions/getDicts',
            payload: { codeList: ['R001'] },
        });
    };

    // 请求方法:获取表格数据
    async function getTableList() {
        const proCode = getUrlParams('proCode');
        const params = { pageNum, pageSize, tabType, proCode, keyWords }; // 查询条件
        setTableLoading(true);
        await dispatch({
            type: 'reviewRecord/getReviewDetail',
            payload: params
        }).then(res => {
            setTableList(res.rows);
            setTotal(res.total);
        })
        setTableLoading(false);
    }

    function handleFuzzySearch(value) {// 模糊查询
        setKeyWords(value);
        setPageNum(1);
    }

    function changeTabPage(key) {
        setTabType(key);
        setKeyWords(undefined);
        setPageNum(1);
    }

    // 查看--跳转子项目的办理详情页
    function checkDetail(record) {
        router.push(`/processCenter/processDetail?processInstanceId=${record.processInstanceId}&nodeId=${record.taskDefinitionKey}&taskId=${record.taskId}`);
    }

    const operations = <Button onClick={() => window.history.go(-1)}>取消</Button>;

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

    const baseTable = () => {
        if (tabType === '1') {
            return (
                <Table
                    pagination={paginationProps}
                    loading={tableLoading}
                    rowKey={uuid()}
                    dataSource={tableList}
                    columns={columns1}
                    scroll={{ x: true }}
                />
            )
        } else {
            return (
                <Table
                    pagination={paginationProps}
                    loading={tableLoading}
                    rowKey={uuid()}
                    dataSource={tableList}
                    columns={columns2}
                    scroll={{ x: true }}
                />
            )
        }
    }

    // 静态数据:表头
    const commonColumns = [
        {
            title: '评审日期',
            dataIndex: 'reviewDate',
            key: 'reviewDate',
            ...rowConfig,
        },
        {
            title: '风险等级',
            dataIndex: 'riskLevelCode',
            key: 'riskLevelCode',
            sorter: false,
            ellipsis: true,
            width: 150,
            align: 'center',
            render: text => {
                const riskList = dicts.R001;
                let label = '';
                riskList.forEach(item => {
                    if (item.code === text) {
                        label = item.name
                    }
                })
                return (
                    <Tooltip title={label} placement="topLeft">
                        {label
                            ? label.toString().replace(/null/g, '-')
                            : label === '' || label === undefined || label === null
                                ? '-'
                                : 0}
                    </Tooltip>
                );
            },
        },
        {
            title: '资管评审结果',
            dataIndex: 'assetReviewResult',
            key: 'assetReviewResult',
            ...rowConfig,
        },
        {
            title: '产品委评审结果',
            dataIndex: 'proReviewResult',
            key: 'proReviewResult',
            ...rowConfig,
        },
        {
            title: '是否上投决会',
            dataIndex: 'referendum',
            key: 'referendum',
            ...rowConfig,
        },
        {
            title: '投决会日期',
            dataIndex: 'referendumDate',
            key: 'referendumDate',
            ...rowConfig,
        },
        {
            title: '投决会结果',
            dataIndex: 'referendumResult',
            key: 'referendumResult',
            ...rowConfig,
        },
        {
            title: '备注',
            dataIndex: 'reviewInfoVORemark',
            key: 'reviewInfoVORemark',
            ...tableRowConfig,
            sorter: false,
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: 120,
            align: 'center',
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => checkDetail(record)} disabled={!record.taskDefinitionKey}>
                        查看
                    </Button>
                );
            },
        },
    ];

    const columns1 = [
        {
            title: '系列名称',
            dataIndex: 'proName',
            key: 'proName',
            ...tableRowConfig,
            sorter: false,
            width: 300,
        },
        {
            title: '系列号',
            dataIndex: 'proCode',
            key: 'proCode',
            ...rowConfig,
        },
        ...commonColumns
    ];

    const columns2 = [
        {
            title: '产品简称',
            dataIndex: 'proFname',
            key: 'proFname',
            ...tableRowConfig,
            sorter: false,
            width: 300,
        },
        {
            title: '产品代码',
            dataIndex: 'proCode',
            key: 'proCode',
            ...rowConfig,
        },
        ...commonColumns
    ];

    return (
        <>
            <List
                title={false}
                pageContainerProps={{
                    breadcrumb: [
                        { title: '产品数据管理', url: '' },
                        { title: '评审记录管理', url: '' },
                        { title: `评审记录查询`, url: '' },
                    ]
                }}
                advancSearchBool={false}
                searchPlaceholder="请输入系列/产品全称"
                fuzzySearch={handleFuzzySearch}
                tabs={{
                    tabList: [
                        { key: '1', tab: '系列信息' },
                        { key: '2', tab: '产品信息' },
                    ],
                    activeTabKey: tabType,
                    onTabChange: changeTabPage,
                }}
                extra={operations}
                tableList={baseTable()}
            />
        </>
    );
};

const WrappedIndexForm = errorBoundary(
    Form.create()(
        connect(({ repaymentInstructions }) => ({
            repaymentInstructions,
        }))(Index)
    ),
);

export default WrappedIndexForm;

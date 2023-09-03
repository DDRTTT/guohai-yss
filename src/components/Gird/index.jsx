import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col } from 'antd';
import styles from './index.less';
/**
 * list             数据处理后的数组
 * outAndOutList    数据处理后的数组【独占整行的】
 * col              判断详情数据展示几列【默认3列】
 * info             详情数据
 * props
 *      ---->config            
 *              ----->label         名称
 *              ----->value         后台对应字段
 *              ----->rule          是否展示【false 正常展示】
 *              ----->proportion    数据页面占比【有的数据渲染独占一行，比如备注】
 *              ----->type          渲染类型【根据类型判断如何渲染】
 *              ----->option        下拉数据
 *              ----->optionConfig  返回下啦数据的 key 名【默认 name code】
 *              ----->click         事件
 * */
const Index = (props) => {
    const { config, info, col = 3 } = props;
    const [list, setList] = useState([]);
    const [outAndOutList, setoutAndOutList] = useState([]);

    useEffect(() => {
        // 获取展示数据 proportion 为 false 正常展示，rule 为 false 正常展示
        const oneThirdList = config.filter(item => !item.proportion && !item.rule)
        setoutAndOutList(config.filter(item => item.proportion && !item.rule))
        setList(handleData(oneThirdList, col))
    },[config])

    // 一维数组转换为二维数组
    const handleData = (arr, num) => {
        const iconsArr = []; // 声明数组
        arr.forEach((item, index) => {
            const page = Math.floor(index / num); // 计算该元素为第几个素组内
            if (!iconsArr[page]) { // 判断是否存在
                iconsArr[page] = [];
            }
            iconsArr[page].push(item);
        });
        return iconsArr;
    }

    // const twoColumns = () => {

    // }

    // 根据条件渲染对应的数据
    const handlRender = (item, info) => {
        if(item.optionType){
            switch (item.optionType) {
                case 'object':
                    return item.option[info[item.value]] || "—"
                    break;
            
                default:
                    break;
            }
        }

        switch (item.type) {
            case 'select':
                if (item.optionConfig) {
                    const selected = item.option && item.option.length && item.option.filter(selectItem => {
                        return selectItem[item.optionConfig.code] == info[item.value]
                    })
                    if(item.handle){
                        return <Button type="link" style={{padding:0}} onClick={item.handle}>{selected && selected.length && selected[0][item.optionConfig.name] || "—"}</Button>
                    }
                    return selected && selected.length && selected[0][item.optionConfig.name] || "—"
                } else {
                    const selected = item.option && item.option.length && item.option.filter(selectItem => selectItem.code == info[item.value])
                    return selected && selected.length && selected[0].name || "—"
                }
                break;
            case 'multiple':
                let textArr = []
                let newArr = [];
                if(typeof info[item.value] == 'object'){
                    console.log(info[item.value]);
                    newArr = info[item.value]
                }else{
                    newArr = info[item.value] && info[item.value].split(',') || []
                }
                item.option && item.option.length && item.option.forEach(optopnItem => {
                    if (item.optionConfig) {
                        if (newArr.includes(optopnItem[item.optionConfig.code])) {
                            textArr.push(optopnItem[item.optionConfig.name]);
                        }
                    } else {
                        if (newArr.includes(optopnItem.code)) {
                            textArr.push(optopnItem.name);
                        }
                    }
                })
                return textArr.join(",") || "—";
                break;
            default:
                return info[item.value] || "—"
                break;
        }
    }

    // 三列
    const triserial = () => {
        return (<>
            {list.map((res, key) => {
                return (<Row gutter={[16, 16]} key={key} className={styles.row}>
                    <Col span={2} />
                    {res.length && res.map((item, index) => {
                        return (<React.Fragment key={index}>
                            <Col span={2}>{item.label}:</Col>
                            {item.valType === 'img' && <Col span={4}>
                                <img
                                    src={info[item.value]}
                                    alt="avatar"
                                    style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                                />    
                            </Col>}
                            {!item.valType && <Col span={4} className={styles.wordWrap}>{handlRender(item, info)}</Col>}
                            <Col span={1} />
                        </React.Fragment>)
                    })}
                    <Col span={1} />
                </Row>)
            })}
            {/* 独占整行的数据 */}
            {outAndOutList.map((item, index) => {
                return (<Row gutter={[16, 16]} key={index} className={styles.row}>
                    <Col span={2} />
                    <Col span={2}>{item.label} :</Col>
                    <Col span={18} className={styles.wordWrap}>{info[item.value] || "—"}</Col>
                    <Col span={2} />
                </Row>)
            })}
        </>)
    }

    // 两列
    const distichous = () => {
        return (<>
            {list.map((res, key) => {
                return (<Row gutter={[16, 16]} key={key} className={styles.row}>
                    <Col span={2} />
                    {res.length && res.map((item, index) => {
                        return (<React.Fragment key={index}>
                            <Col span={4}>{item.label}:</Col>
                            <Col span={6} className={styles.wordWrap}>{handlRender(item, info)}</Col>
                        </React.Fragment>)
                    })}
                    <Col span={2} />
                </Row>)
            })}
            {/* 独占整行的数据 */}
            {outAndOutList.map((item, index) => {
                return (<Row gutter={[16, 16]} key={index} className={styles.row}>
                    <Col span={2} />
                    <Col span={4}>{item.label} :</Col>
                    <Col span={18} className={styles.wordWrap}>{info[item.value] || "—"}</Col>
                    <Col span={2} />
                </Row>)
            })}
        </>)
    }

    const returnColumns = () => {
        switch (col) {
            case 2:
                return distichous(); 
                break;
            case 3:
                return triserial(); 
                break;
        
            default:
                break;
        }
    }

    return (
        <>
            {returnColumns()}
        </>
    )
}

export default Index
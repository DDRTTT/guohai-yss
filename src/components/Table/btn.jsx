import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import Action from '@/utils/hocUtil';
import styles from './index.less';

const TableProvider = props => {
    const { config } = props;
    return (
        <>
            {
                config.map(item => {
                    return (<>
                        {
                            item.Action ? <Action code={item.code}>
                                <Button
                                    className={styles.proButton}
                                    style={{display: item.display}}
                                    disabled={item.disabled}
                                    type="link"
                                    onClick={item.click}
                                >
                                    {item.name}
                                </Button>
                            </Action>
                                :
                                <Button
                                    className={styles.proButton}
                                    style={{display: item.display}}
                                    disabled={item.disabled}
                                    type="link"
                                    onClick={item.click}
                                >
                                    {item.name}
                                </Button>
                        }
                    </>)
                })
            }
        </>
    );
};

export default TableProvider;

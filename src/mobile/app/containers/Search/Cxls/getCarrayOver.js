import React from 'react'
import { Button } from 'app/components'
import { cxAccountActions } from 'app/redux/Search/Cxls'

export function getCarrayOver (dispatch, item, editLrAccountPermission) {
    const makeOut = item.get('makeOut')
    const carryover = item.get('carryover')
    const certified = item.get('certified')
    const received = item.get('received')
    const receiving = item.get('receiving')
    const payed = item.get('payed')
    const paying = item.get('paying')
    const shouldReturn = item.get('shouldReturn')
    const runningType = item.get('runningType')
    const uuid = item.get('uuid')
    let elementList = []

    if (received == '1' || received == '3') {
        elementList.push(
            <Button
                key='c1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'SFGL', '付款金额'))
                }}
            >
                退款
            </Button>
        )
    }

    if (shouldReturn == '1' || shouldReturn == '3') {
        elementList.push(
            <Button
                key='f1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'SFGL', '付款金额'))
                }}
            >
                退款
            </Button>
        )
    }

    if (payed == '1' || payed == '3') {
        elementList.push(
            <Button
                key='d1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'SFGL', '收款金额'))
                }}
            >
                退款
            </Button>
        )
    }

    if (receiving == '1' || receiving == '3') {
        elementList.push(
            <Button
                key='e1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'SFGL', '收款金额'))
                }}
            >
                收款
            </Button>
        )
    }

    if (paying == '1' || paying == '3') {
        elementList.push(
            <Button
                key='j'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'SFGL', '付款金额'))
                }}
            >
                付款
            </Button>
        )
    }



    if (makeOut == 1) {
        elementList.push(
            <Button
                key='g'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'KJFP'))
            }}>
                开票
            </Button>
        )
    }

    // if (carryover == 1 && (runningType !== 'LX_ZZS_YKP' && runningType !== 'LX_ZZS_WKP' && runningType !== 'LX_ZZS_YRZ' && runningType !== 'LX_ZZS_WRZ')) {
    //     elementList.push(
    //         <Button
    //             key='h'
    //             disabled={!editLrAccountPermission}
    //             onClick={() => {
    //                 dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'JZCB'))
    //             }}
    //         >
    //             结转
    //         </Button>
    //     )
    // }

    if (certified == 1) {
        elementList.push(
            <Button
                key='i'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'FPRZ'))
            }}>
                认证
            </Button>
        )
    }

    return (
        <span key={uuid}>
            {elementList}
        </span>
    )
}

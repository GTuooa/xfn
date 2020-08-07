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
    let elementList = null

    if (received == '1' || received == '3') {
        elementList = <Button
                key='c1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CX_HSGL', 'SFGL', '付款金额'))
                    if (item.get('beOpened')) {
                        dispatch(cxAccountActions.getSfglCategoryList(item.get('assType'), uuid))
                    }
                }}
            >
                退
            </Button>
    }

    if (shouldReturn == '1' || shouldReturn == '3') {
        elementList = <Button
                key='f1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CX_HSGL', 'SFGL', '付款金额'))
                    if (item.get('beOpened')) {
                        dispatch(cxAccountActions.getSfglCategoryList(item.get('assType'), uuid))
                    }
                }}
            >
                退
            </Button>
    }

    if (payed == '1' || payed == '3') {
        elementList = <Button
                key='d1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CX_HSGL', 'SFGL', '收款金额'))
                    if (item.get('beOpened')) {
                        dispatch(cxAccountActions.getSfglCategoryList(item.get('assType'), uuid))
                    }
                }}
            >
                退
            </Button>
    }

    if (receiving == '1' || receiving == '3') {
        elementList = <Button
                key='e1'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CX_HSGL', 'SFGL', '收款金额'))
                    if (item.get('beOpened')) {
                        dispatch(cxAccountActions.getSfglCategoryList(item.get('assType'), uuid))
                    }
                }}
            >
                收
            </Button>
    }

    if (paying == '1' || paying == '3') {
        elementList = <Button
                key='j'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CX_HSGL', 'SFGL', '付款金额'))
                    if (item.get('beOpened')) {
                        dispatch(cxAccountActions.getSfglCategoryList(item.get('assType'), uuid))
                    }
                }}
            >
                付
            </Button>
    }

    return elementList
}

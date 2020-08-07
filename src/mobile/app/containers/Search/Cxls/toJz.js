import React from 'react'
import { Button } from 'app/components'
import { cxAccountActions } from 'app/redux/Search/Cxls'

export function toJz (dispatch, item, editLrAccountPermission) {
    const carryover = item.get('carryover')
    const runningType = item.get('runningType')
    const uuid = item.get('uuid')
    let jzCom = null


    if (item.get('childList').size > 0) {//有子流水--结转成本
        let number = 0//子流水需要去结转的个数
        let childUuid = ''

        item.get('childList').forEach(v => {
            const carryover = v.get('carryover')
            const runningType = v.get('runningType')
            const uuid = v.get('uuid')

            if (carryover == 1 && (runningType !== 'LX_ZZS_YKP' && runningType !== 'LX_ZZS_WKP' && runningType !== 'LX_ZZS_YRZ' && runningType !== 'LX_ZZS_WRZ')) {
                number ++
                childUuid = uuid
            }
        })

        if (number == 1) {//子流水中只有一个需要去结转
            jzCom = <Button
                key='h'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(childUuid, 'CXLS', 'JZCB'))
                }}
            >
                结转
            </Button>
        } else if (number > 1) {//子流水中有多个需要去结转
            jzCom = <Button
                key='h'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'JZCB'))
                }}
            >
                结转
            </Button>
        }

    } else {//无子流水
        if (carryover == 1 && (runningType !== 'LX_ZZS_YKP' && runningType !== 'LX_ZZS_WKP' && runningType !== 'LX_ZZS_YRZ' && runningType !== 'LX_ZZS_WRZ')) {//结转成本
            jzCom = <Button
                key='h'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'JZCB'))
                }}
            >
                结转
            </Button>
        }
    }


    //结转损益
    if (carryover == 1 && item.get('categoryType') == 'LB_CQZC') {//结转损益
        jzCom = <Button
            key='h'
            disabled={!editLrAccountPermission}
            onClick={() => {
                dispatch(cxAccountActions.getCxlsSingle(uuid, 'CXLS', 'JZSY'))
            }}
        >
            结转
        </Button>
    }



    return jzCom
}

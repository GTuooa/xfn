import React from 'react'
import { Button } from 'app/components'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'

export function stateFunc (dispatch, history, item, editLrAccountPermission) {
    const oriUuid = item.get('oriUuid')
    const jrJvUuid = item.get('jrJvUuid')
    const notHandleAmount = item.get('notHandleAmount')

    let direction = 'debit'
    if (item.get('creditAmount')) {
        direction = 'credit'
    }

    let elementList = []

    /*if (receive == '1' || receive == '2') {
        elementList.push(
            <Button
                key='a'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'SFGL', direction))
                }}
            >
                收款
            </Button>
        )
    }

    if (shouldReturn == '1' || shouldReturn == '2') {
        elementList.push(
            <Button
                key='b'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'SFGL', direction))
                }}
            >
                退款
            </Button>
        )
    }

    if (pay == '1' || pay == '2') {
        elementList.push(
            <Button
                key='c'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'SFGL', direction))
                }}
            >
                付款
            </Button>
        )
    }


    if (makeOut == '1' || makeOut == '2') {
        elementList.push(
            <Button
                key='d'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'KJFP'))
            }}>
                开票
            </Button>
        )
    }

    if (auth == '1' || auth == '2') {
        elementList.push(
            <Button
                key='e'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'FPRZ'))
            }}>
                认证
            </Button>
        )
    }

    if (carryover == '1' || carryover == '2') {
        elementList.push(
            <Button
                key='f'
                disabled={!editLrAccountPermission}
                onClick={() => {
                    dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, 'JZSY'))
            }}>
                结转
            </Button>
        )
    }*/

    const receive = item.get('receive')
	const pay = item.get('pay')
	const shouldReturn = item.get('shouldReturn')
	const makeOut = item.get('makeOut')
	const auth = item.get('auth')
	const carryover = item.get('carryover')
	const grant = item.get('grant')
	const defray = item.get('defray')
	const takeBack = item.get('takeBack')
	const back = item.get('back')

    let statusArr = [
		{key: 'receive', value: receive, toRouter: 'SFGL', direction: 'debit'},
		{key: 'pay',value: pay, toRouter: 'SFGL', direction: 'credit'},
		{key: 'shouldReturn',value: shouldReturn, toRouter: 'SFGL', direction: 'credit'},
		{key: 'makeOut',value: makeOut, toRouter: 'KJFP'},
		{key: 'auth',value: auth, toRouter: 'FPRZ'},
		{key: 'carryover',value: carryover, toRouter: 'JZSY'},
		{key: 'grant',value: grant, toRouter: 'XCZC'},
		{key: 'defray',value: defray, toRouter: 'DEFRAY'},
		{key: 'takeBack',value: takeBack, toRouter: 'ZSFKX'},
		{key: 'back',value: back, toRouter: 'ZSFKX'}
	]

    const btnName = {
		'shouldReturn' : '退款',
		'pay' : '付款',
		'receive' : '收款',
		'makeOut' : '开票',
		'auth' : '认证',
		'carryover' : '结转',
		'grant': `${notHandleAmount > 0 ? '发放' : '收款'}`,
		'defray':`${notHandleAmount > 0 ? '缴纳' : '收款'}`,
		'takeBack':'收回',
		'back':'退还',
	}

    statusArr.forEach(v => {
        if (v.value=='1' || v.value=='2') {
            elementList.push(
                <Button
                    key={v.key}
                    disabled={!editLrAccountPermission}
                    onClick={() => {
                        dispatch(searchRunningActions.getCxlsSingle(history, oriUuid, jrJvUuid, v['toRouter'], v['direction'], 'editRunning', v.key))
                }}>
                    {btnName[v.key]}
                </Button>
            )
        }
    })

    if (elementList.length) {
        return (
            <span key={oriUuid} onClick={(e) => e.stopPropagation()}>
                {elementList}
            </span>
        )
    } else {
        return null
    }

}

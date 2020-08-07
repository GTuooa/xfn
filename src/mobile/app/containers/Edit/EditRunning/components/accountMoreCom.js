import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, Amount, XfInput, Single, SwitchText } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'

//多账户组件
export default class AccountMoreCom extends Component  {

    render () {
        const { dispatch, history, accountList, accounts, beManagemented ,oriState, isManualWriteOff, sfglAmount } = this.props

        //金额改变时的回调
        let changeAmount = (value) => {
            if (beManagemented && ['STATE_YYSR_XS', 'STATE_YYZC_GJ', 'STATE_FY'].includes(oriState)) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
            }
            if (oriState=='STATE_SFGL' && !isManualWriteOff) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
            }
        }

        const moreTwo = accounts.size > 2 ? true : false

        let totalAmount = 0
        accounts.forEach(v => totalAmount += Number(v.get('amount')))

        return (
            <Row className='lrls-card'>
                {
                    accounts.map((v, i) => {

                        const accountUuid = v.get('accountUuid')
                        const accountName = v.get('accountName')

                        return (
                            <div key={i} style={{paddingBottom: '10px'}}>
                                <div className='lrls-more-card lrls-placeholder lrls-bottom'>
                                    <span>账户({i+1})</span>
                                    <span
                                        className='lrls-blue'
                                        style={{display: moreTwo ? '' : 'none'}}
                                        onClick={() => {
                                            dispatch(editRunningActions.accountMoreCard('delete', '', i))
                                            changeAmount(totalAmount - Number(v.get('amount')))

                                        }}
                                    >
                                            删除
                                    </span>
                                </div>

                                <Row className='lrls-more-card lrls-margin-top'>
                                    <label>金额:</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        placeholder='填写金额'
                                        value={v.get('amount')}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.accountMoreCard('amount', value, i))
                                            const amount = totalAmount - Number(v.get('amount')) + Number(value)
                                            changeAmount(decimal(amount))
                                        }}
                                        onFocus={() => {
                                            if (oriState=='STATE_SFGL' && Number(v.get('amount'))==0) {
                                                const amount = decimal(sfglAmount-totalAmount)
                                                if (amount > 0) {
                                                    dispatch(editRunningActions.accountMoreCard('amount', amount, i))
                                                    if (!isManualWriteOff) {
                                                        changeAmount(decimal(sfglAmount))
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Row>

                                <div className='lrls-more-card lrls-margin-top'>
                                    <label>账户:</label>
                                    <Single
                                        className='lrls-single'
                                        district={accountList.toJS()}
                                        value={accountUuid ? `${accountUuid}${Limit.TREE_JOIN_STR}${accountName}` : ''}
                                        onOk={value => {
                                            dispatch(editRunningActions.accountMoreCard('card', value, i))
                                        }}
                                        icon={{
                                                type: 'account-add',
                                                onClick: () => {
                                                    dispatch(editRunningConfigActions.beforAddAccontfromEditRunning(['views', 'flags'], 'insert'))
                                                    history.push('/config/account/card/edit')
                                                }
                                            }}
                                    >
                                       <Row className='lrls-category lrls-padding'>
                                           {
                                               accountUuid ? <span> {accountName} </span>
                                               : <span className='lrls-placeholder'>点击选择账户卡片</span>
                                           }
                                           <Icon type="triangle" />
                                       </Row>
                                    </Single>
                                </div>
                            </div>
                        )
                    })
                }

                <div className='lrls-more-card' style={{fontWeight: 'bold'}}>
                    <div>总金额：<Amount showZero>{decimal(totalAmount)}</Amount></div>
                    <div className='lrls-stock-bottom'>
                        <div className={ accounts.size > 31 ? 'lrls-placeholder' : 'lrls-blue'}
                            onClick={() => {
                                if (accounts.size > 31) { return }
                                dispatch(editRunningActions.accountMoreCard('add', '', accounts.size))
                            }}
                        >
                            +添加账户明细
                        </div>

                        {/* <div className='accountSwitch'>
                            <SwitchText
                                checked={true}
                                checkedChildren='多账户'
                                unCheckedChildren='多账户'
                                className='threeTextSwitch'
                                onChange={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedAccounts'], false))
                                }}
                            />
                        </div> */}
                    </div>
                </div>
            </Row>
        )
    }
}

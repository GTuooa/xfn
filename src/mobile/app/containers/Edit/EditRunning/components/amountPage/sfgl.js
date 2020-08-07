import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import Account from '../account.js'
import AccountMoreCom from '../accountMoreCom.js'
import { Row, Amount, XfInput, Switch, SwitchText, Icon } from 'app/components'

import { decimal } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


export default class SfglCom extends Component {

    render () {
        const { dispatch, history, oriTemp, isModify, accounts, accountList, pendingStrongList } = this.props

        const jrAmount = oriTemp.get('jrAmount')
        const oriState = oriTemp.get('oriState')
        const absTotalAmount = jrAmount < 0 ? -jrAmount : jrAmount
        const amount = oriTemp.get('amount')
        let moedAmount = oriTemp.get('moedAmount')
        const beMoed = oriTemp.get('beMoed')
        const isManualWriteOff = oriTemp.getIn(['pendingManageDto', 'isManualWriteOff'])//false 自动核销

        let amountTitle = jrAmount >= 0 ? '收款金额' : '付款金额'
        let moedTitle = jrAmount >= 0 ? '应收抹零' : '应付抹零'
        if (isManualWriteOff) {
            const allHandleAmount = oriTemp.get('allHandleAmount')
            moedTitle = moedAmount >= 0 ? '应收抹零' : '应付抹零'
            amountTitle = allHandleAmount >= 0 ? '收款金额' : '付款金额'
        }

        let hxAmount = decimal(Math.abs(amount)+Math.abs(moedAmount))

        // 多账户
        let showAccount = amount == 0 ? false : true //是否显示账户
        const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户
        let showMoreAccount = pendingStrongList.filter(v => v.get('beSelect')).size==1//多账户按钮显示
        if (usedAccounts) { showAccount = false }


        let component = null
        //新增
        if (!isModify) {
            component = (
                <div>
                    <div className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label>{amountTitle}:</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                disabled={isManualWriteOff || (!isManualWriteOff && usedAccounts)}
                                // placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                }}
                                onClick={() => {
                                    if (isManualWriteOff) {
                                        history.push('/editrunning/sfgl')
                                    }
                                }}
                            />
                            { showMoreAccount ? <label className='accountSwitch'>
                                <SwitchText
                                    checked={usedAccounts}
                                    checkedChildren='多账户'
                                    unCheckedChildren='多账户'
                                    className='threeTextSwitch'
                                    onChange={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedAccounts'], !usedAccounts))
                                        if (!usedAccounts) {//开启
                                            if (accounts.size==1) {
                                                dispatch(editRunningActions.accountMoreCard('add', '', 1))
                                            }
                                        } else {//关闭
                                            if (!isManualWriteOff) {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], absTotalAmount))
                                            }

                                        }
                                    }}
                                />
                            </label> : null}
                        </Row>
                        {showAccount ? <Row className='yysr-amount lrls-margin-top'>
                            <label>账户:</label>
                            <Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
                            />
                        </Row>: null }
                        
                    </div>
                    {
                        usedAccounts ?
					    	<AccountMoreCom
					    		dispatch={dispatch}
					    		history={history}
					    		accountList={accountList}
					    		accounts={accounts}
					    		beManagemented={false}
                                oriState={oriState}
                                isManualWriteOff={isManualWriteOff}
                                sfglAmount={isManualWriteOff ? amount : decimal(absTotalAmount-moedAmount)}
                            />
                        : null
					}

                    <Row className='lrls-card'>
                        <Row className='lrls-more-card'>
                            <span>{moedTitle}</span>
                            <span className='noTextSwitch'>
                                <Switch
                                    checked={beMoed}
                                    onClick={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beMoed'], !beMoed))
                                        if (beMoed) {//变为不开启
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'moedAmount'], ''))
                                        }
                                        let newPendingStrongList = pendingStrongList.toJS()
                                        newPendingStrongList.forEach(v => { v['moedAmount'] = '' })
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList'], fromJS(newPendingStrongList)))
                                    }}
                                />
                            </span>
                        </Row>
                        {
                            (beMoed) ? <Row className='lrls-padding-top'>
                                <Row className='yysr-amount'>
                                    <label>抹零金额： </label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        disabled={isManualWriteOff}
                                        value={moedAmount}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'moedAmount'], value))
                                        }}
                                        onClick={() => {
                                            if (isManualWriteOff) {
                                                history.push('/editrunning/sfgl')
                                            }
                                        }}
                                    />
                                </Row>
                            </Row> : null
                        }
                    </Row>

                    <Row className='lrls-card'>
                        <Row className='lrls-more-card'>
                            <div>
                                <span>核销金额：</span>
                                <span className={isManualWriteOff ? 'text-decoration' : ''}
                                    onClick={() => {
                                    if (isManualWriteOff) {
                                        history.push('/editrunning/sfgl')
                                    }
                                }}>
                                    {hxAmount ? <Amount>{hxAmount}</Amount> : (isManualWriteOff ? '点击输入' : null)}
                                    {isManualWriteOff ? <Icon type='edit'/> : null}
                                </span>
                            </div>
                            <SwitchText
                                checked={isManualWriteOff}
                                checkedChildren='手动核销'
                                unCheckedChildren='自动核销'
                                className='fourTextSwitch'
                                onChange={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingManageDto', 'isManualWriteOff'], !isManualWriteOff))
                                    let newPendingStrongList = pendingStrongList.toJS()
                                    let allHandleAmount = 0, allMoedAmount = 0
                                    newPendingStrongList.forEach(v => {
                                        v['moedAmount'] = v['moedAmount'] ? v['moedAmount'] : ''
                                        v['handleAmount'] = v['handleAmount'] ? v['handleAmount'] : v['amount']
                                        if (!isManualWriteOff) {//变为手动核销
                                            if (v['beSelect']) {
                                                const handleAmount = Number(v['handleAmount'])
                                                const moedAmount = Number(v['moedAmount'])
                                
                                                if (v['direction']=='debit') {//借方发生金额
                                                    allHandleAmount += Number(handleAmount)
                                                    allMoedAmount += Number(moedAmount)
                                                } else {//贷方发生金额
                                                    allHandleAmount -= Number(handleAmount)
                                                    allMoedAmount -= Number(moedAmount)
                                                }
                                            }
                                        }
                                    })
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingStrongList'], fromJS(newPendingStrongList)))
                                    if (isManualWriteOff) {//变为自动核销
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'moedAmount'], decimal(allMoedAmount)))
                                    } else {//变为手动核销
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], decimal(Math.abs(allHandleAmount))))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'allHandleAmount'], allHandleAmount))
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'moedAmount'], decimal(allMoedAmount)))
                                    }
                                }}
                            />
                        </Row>
                    </Row>
                </div>
            )
        }

        //修改
        if (isModify) {
            if (oriState=='STATE_SFGL') {//收付管理流水
                component = (
                    <div>
                        <div className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>{amountTitle}:</label>
                                { isManualWriteOff ?
                                    <span className='text-decoration' onClick={() => history.push('/editrunning/sfgl')}>
                                        <Amount>{amount}</Amount>
                                        <Icon type='edit'/>
                                    </span>
                                    : <XfInput.BorderInputItem
                                        mode='amount'
                                        disabled={usedAccounts}
                                        value={amount}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                        }}
                                    />
                                }
                                <ul>
                                <SwitchText
                                    checked={isManualWriteOff}
                                    checkedChildren='手动核销'
                                    unCheckedChildren='自动核销'
                                    className='fourTextSwitch'
                                    onChange={() => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingManageDto', 'isManualWriteOff'], !isManualWriteOff))
                                    }}
                                />
                                </ul>
                                
                                { showMoreAccount ? <label className='accountSwitch'>
                                    <SwitchText
                                        checked={usedAccounts}
                                        checkedChildren='多账户'
                                        unCheckedChildren='多账户'
                                        className='threeTextSwitch'
                                        onChange={() => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedAccounts'], !usedAccounts))
                                            if (!usedAccounts) {
                                                if (accounts.size==1) {
                                                    dispatch(editRunningActions.accountMoreCard('add', '', 1))
                                                }
                                            } else {//关闭
                                                if (!isManualWriteOff) {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], absTotalAmount))
                                                }
    
                                            }
                                        }}
                                    />
                                </label> : null}
                            </Row>
                            {   showAccount ? 
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>账户:</label>
                                        <Account
                                            dispatch={dispatch}
                                            accountList={accountList}
                                            accounts={accounts}
                                        />
                                    </Row>
                                : null 
                            }
                        </div>

                        {
                            usedAccounts ?
                                <AccountMoreCom
                                    dispatch={dispatch}
                                    history={history}
                                    accountList={accountList}
                                    accounts={accounts}
                                    beManagemented={false}
                                    oriState={oriState}
                                    isManualWriteOff={isManualWriteOff}
                                    sfglAmount={isManualWriteOff ? amount : decimal(absTotalAmount-moedAmount)}
                                />
                            : null
                        }                        
                    </div>
                    
                )
            }
            if (oriState=='STATE_SFGL_ML') {//抹零流水
                component = (
                    <div className='lrls-card'>
                        <Row className='lrls-more-card'>
                            {isManualWriteOff ? null : <label>{moedTitle}:</label>}
                            { isManualWriteOff ?
                                <div>
                                    <span className='title-left'>{moedTitle}:</span>
                                    <span className='text-decoration' onClick={() => history.push('/editrunning/sfgl')}>
                                        <Amount>{amount}</Amount>
                                        <Icon type='edit'/>
                                    </span>
                                </div>
                                : <XfInput.BorderInputItem
                                    mode='amount'
                                    // placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                            }
                            <SwitchText
                                checked={isManualWriteOff}
                                checkedChildren='手动核销'
                                unCheckedChildren='自动核销'
                                className='fourTextSwitch'
                                onChange={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'pendingManageDto', 'isManualWriteOff'], !isManualWriteOff))
                                }}
                            />
                        </Row>
                    </div>
                )

            }
        }


        return component
    }
}

import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Switch, Amount, XfInput } from 'app/components'
import Account from '../account.js'

import { decimal } from 'app/utils'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


export default class SfzcCom extends Component {
    state = {
        beOffsetAmount: false,//是否开启预交抵扣
    }

    render () {
        const { dispatch, oriTemp, accountList, accounts, isModify } = this.props
        const { beOffsetAmount  } = this.state

        const oriState = oriTemp.get('oriState')
        const propertyTax = oriTemp.get('propertyTax')
        const acTax = oriTemp.get('acTax')
        const beInAdvance = acTax.get("beInAdvance")// 是否预交增值税
        const beReduce =  acTax.get("beReduce")// 设置中是否开启减免
        const beReduceTax =  oriTemp.get("beReduceTax")// 流水中是否开启减免
        const reduceAmount = oriTemp.get('reduceAmount')//减免金额
        const amount = oriTemp.get('amount')
        const usedProject = oriTemp.get('usedProject')

        let component = null

        ;({
            'SX_ZZS': () => {//增值税
                const amount = oriTemp.get('amount')//支付金额
                const offsetAmount = oriTemp.get("offsetAmount")// 预交抵扣金额
                const deductedAmount = oriTemp.get("deductedAmount")// 待抵扣金额
                const jrAmount = oriTemp.get('jrAmount')//所勾选的计提流水的总额
                const totalPay = Number(offsetAmount) + Number(amount) + Number(reduceAmount)//税费总额

                let amountCom = null//金额组件
                let yjCom = null//预交组件
                let lsCom = null//税费总额组件
                let reduceCom = null//税费减免组件

                ;({
                    'STATE_SF_JN': () => {//缴纳
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>支付金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                                { (amount > 0) ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                /> : null }
                            </Row>
                        </Row>

                        lsCom = <Row className='lrls-card'>
                                    <div>处理税费：<Amount showZero>{decimal(totalPay)}</Amount></div>
                                </Row>

                        if (beInAdvance && deductedAmount > 0) {//开启预交
                            yjCom = <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>预交抵扣</span>
                                    <span className='noTextSwitch'>
                                        <Switch
                                            checked={beOffsetAmount || offsetAmount}
                                            onClick={() => {
                                                if (beOffsetAmount) {//变为不开启
                                                    this.setState({beOffsetAmount: false})
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], 0))
                                                } else {
                                                    this.setState({beOffsetAmount: true})
                                                }
                                            }}
                                        />
                                    </span>
                                </Row>
                                {
                                    (beOffsetAmount || offsetAmount) ? <Row className='lrls-padding-top'>
                                        <Row className='yysr-amount'>
                                            <label>金额： </label>
                                            <XfInput.BorderInputItem
                                                mode='amount'
                                                placeholder='填写金额'
                                                value={offsetAmount}
                                                onChange={(value) => {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], value))
                                                }}
                                            />
                                        </Row>
                                        <Row className='lrls-padding-top lrls-placeholder'>
                                            <span>待抵扣金额： <Amount showZero>{deductedAmount}</Amount></span>
                                        </Row>
                                    </Row> : null
                                }

                            </Row>
                        }

                        if (!isModify && beReduce) {//减免
                            reduceCom = <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>税费减免</span>
                                    <span className='noTextSwitch'>
                                        <Switch
                                            checked={beReduceTax}
                                            onClick={() => {
                                                if (beReduceTax) {//变为不开启
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], false))
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], ''))
                                                } else {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], true))
                                                }
                                            }}
                                        />
                                    </span>
                                </Row>
                                {
                                    (beReduceTax) ? <Row className='yysr-amount lrls-padding-top'>
                                        <label>金额： </label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写金额'
                                            value={reduceAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                                }
                            </Row>
                        }
                    },
                    'STATE_SF_YJZZS': () => {//预缴增值税
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label> 金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                                { (amount > 0) ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                /> : null }
                            </Row>
                        </Row>
                    },
                    'STATE_SF_ZCWJZZS': () => {//转出未交增值税
                        const transferAmount = oriTemp.get('transferAmount') ? oriTemp.get('transferAmount') : ''
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label> 金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                            </Row>
                            <Row className='lrls-padding-top lrls-placeholder'
                                style={{paddingLeft: '.6rem', display: isModify ? 'none' : ''}}
                            >
                                <span>待转增值税： <Amount showZero>{transferAmount}</Amount></span>
                            </Row>

                        </Row>
                    }
                }[oriState] || (() => null))()

                component = (
                    <div>
                        { lsCom }
                        {/* 金额组件 */}
                        { amountCom }
                        {/* 预交 */}
                        { yjCom }
                        {/* 减免 */}
                        { reduceCom }
                    </div>
                )
            },
            'SX_GRSF': () => {//个人税费
                const payableAmount = oriTemp.get('payableAmount')
                component = (
                    <Row className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label> 金额： </label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                }}
                            />
                        { (amount > 0) ? <Account
                            dispatch={dispatch}
                            accountList={accountList}
                            accounts={accounts}
                        /> : null }
                        </Row>
                        <div className='lrls-placeholder lrls-margin-top'
                            style={{paddingLeft: '.6rem', display: payableAmount > 0 ? '' : 'none'}}
                        >
                            <span style={{marginRight: '.2rem'}}>
                                未处理金额: <Amount showZero>{payableAmount}</Amount>
                            </span>
                        </div>

                    </Row>
                )
            },
            'SX_QTSF': () => {//其他税费
                let showAccount = false
                let jtCom = null//计提组件
                let reduceCom = null
                let totalCom = null

                ;({
                    'STATE_SF_JT': () => {//计提
                        showAccount = false
                    },
                    'STATE_SF_JN': () => {//缴纳
                        showAccount = true
                        if (!isModify && beReduce) {
                            reduceCom = <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>税费减免</span>
                                    <span className='noTextSwitch'>
                                        <Switch
                                            checked={beReduceTax}
                                            onClick={() => {
                                                if (beReduceTax) {//变为不开启
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], false))
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], ''))
                                                } else {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], true))
                                                }
                                            }}
                                        />
                                    </span>
                                </Row>
                                {
                                    (beReduceTax) ? <Row className='yysr-amount lrls-padding-top'>
                                        <label>金额： </label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写金额'
                                            value={reduceAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                                }
                            </Row>
                        }
                        totalCom = <Row className='lrls-card'
                            style={{display: reduceAmount ? '' : 'none'}}
                            >
                            <Row className='yysr-amount'>
                                <label>核销金额：</label>
                                <Amount showZero className='amount'>{Number(amount)+Number(reduceAmount)}</Amount>
                            </Row>
                        </Row>

                    },
                }[oriState] || (() => null))()

                component = (
                    <div>
                        <Row className='lrls-card'>
                            {/* 金额组件 */}
                            <Row className='yysr-amount'>
                                <label> 金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                                { (amount > 0 && showAccount) ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                /> : null }
                            </Row>
                        </Row>

                        { reduceCom }
                        { totalCom }
                    </div>
                )
            },
            'SX_QYSDS': () => {//企业所得税
                let showAccount = false
                let jtCom = null//计提组件
                let reduceCom = null
                let totalCom = null

                ;({
                    'STATE_SF_JT': () => {//计提
                        showAccount = false
                    },
                    'STATE_SF_JN': () => {//缴纳
                        showAccount = true
                        if (!isModify && beReduce) {//开启预交
                            reduceCom = <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>税费减免</span>
                                    <span className='noTextSwitch'>
                                        <Switch
                                            checked={beReduceTax}
                                            onClick={() => {
                                                if (beReduceTax) {//变为不开启
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], false))
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], ''))
                                                } else {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beReduceTax'], true))
                                                }
                                            }}
                                        />
                                    </span>
                                </Row>
                                {
                                    (beReduceTax) ? <Row className='yysr-amount lrls-padding-top'>
                                        <label>金额： </label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写金额'
                                            value={reduceAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'reduceAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                                }
                            </Row>
                        }
                        totalCom = <Row className='lrls-card'
                            style={{display: reduceAmount ? '' : 'none'}}
                            >
                            <Row className='yysr-amount'>
                                <label>核销金额：</label>
                                <Amount showZero className='amount'>{Number(amount)+Number(reduceAmount)}</Amount>
                            </Row>
                        </Row>
                    }
                }[oriState] || (() => null))()

                component = (
                    <div>
                        <Row className='lrls-card'>
                            {/* 金额组件 */}
                            <Row className='yysr-amount'>
                                <label> 金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                                { (amount > 0 && showAccount) ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                /> : null }
                            </Row>
                        </Row>

                        { reduceCom }
                        { totalCom }
                    </div>
                )
            }
        }[propertyTax] || (() => null))()

        if (oriState == 'STATE_SF_SFJM') {//税费减免 --修改新增的状态
            component = (
                <div className='lrls-card'>
                    <Row className='yysr-amount'>
                        <label>减免金额： </label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                    </Row>
                </div>
            )
        }

        return component
    }
}

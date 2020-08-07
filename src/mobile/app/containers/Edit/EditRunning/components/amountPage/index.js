import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, SinglePicker, Icon, Switch, Amount, XfInput, Single, MonthPicker, SwitchText } from 'app/components'
import Account from '../account.js'
import XczcCom from './xczc.js'
import SfzcCom from './sfzc.js'
import JzcbCom from './jzcb.js'
import ChdbCom from './chdb.js'
import ChyeCom from './chye.js'
import Jxsezc from './Jxsezc.js'
import ChzzCom from './Chzz.js'
import ChzzZzdCom from './ChzzZzd.js'
import GgfyftCom from './ggfyft.js'
import Chtrxm from './Chtrxm.js'
import Xmjz from './xmjz.js'
import SfglCom from './sfgl.js'
import KjfpCom from './Kjfp.js'

import { decimal, DateLib } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


//金额区 含往来单位等
export default class AmountCom extends Component  {

    render () {
        const { dispatch, oriTemp, accountList, accounts, isModify, pendingStrongList, stockList, stockCardList, projectCardList, projectList, hasSelect, history, isOpenedWarehouse, warehouseList, stockCategoryList, commonCardList, stockCardOtherList, projectCategoryList, commonProjectList, cardAllList } = this.props

        const categoryType = oriTemp.get('categoryType')
        const beProject = oriTemp.get('beProject')//类别是否开启项目管理
		const usedProject = oriTemp.get('usedProject')//流水是否开启项目
        const oriState = oriTemp.get('oriState')
        const amount = oriTemp.get('amount')
        const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//收付管理
        const isFullPayment = oriTemp.get('isFullPayment')//只有在修改时才可能为true
        const propertyCarryover = oriTemp.get('propertyCarryover')
        const isHw = propertyCarryover =='SX_HW' ? true : false//是否是货物属性

        let component = null

        switch (categoryType) {
            case 'LB_YYSR': {
                const currentAmount = oriTemp.get('currentAmount')
                const preAmount = oriTemp.get('preAmount')
                const payableAmount = oriTemp.get('payableAmount')
                const offsetAmount = oriTemp.get('offsetAmount')
                const stockStrongList = oriTemp.get('stockStrongList') ? oriTemp.get('stockStrongList') : fromJS([])
                const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户

                // let showAmount = (isHw || oriTemp.get('usedStock')) && oriState != 'STATE_YYSR_DJ' ? false : true//是否显示金额组件
                let showAmount = true//是否显示金额组件
                let showPreAmount = false//是否显示预收预付
                let showAccount = false//是否显示账户
                let amountTitle = '总金额:'
                let showOffsetAmount = false
                let showMoreAccount = true//多账户显示


                ;({
                    'STATE_YYSR_DJ': () => {
                        showAccount = true
                        amountTitle = '预收金额:'
                    },
                    'STATE_YYSR_XS': () => {
                        showAccount = beManagemented ? false : true
                        if (isFullPayment && isModify) {
                            showAccount = true
                        }
                        if (!isFullPayment && isModify) { showMoreAccount = false }
                        showOffsetAmount = (preAmount > 0 && !usedAccounts) ? true : false
                        showPreAmount = ((showOffsetAmount || (beManagemented && !usedAccounts)) && !isModify) ? true : false
                    },
                    'STATE_YYSR_TS': () => {
                        showAccount = beManagemented ? false : true
                        if (isFullPayment && isModify) {
                            showAccount = true
                        }
                        showOffsetAmount = (payableAmount && !usedAccounts) > 0 ? true : false
                        showPreAmount = ((showOffsetAmount || (beManagemented && !usedAccounts)) && !isModify) ? true : false
                        showMoreAccount = false//多账户显示
                    }
                }[oriState] || (() => null))()


                component = (
                    <div className='lrls-card' 
                        style={{
                            display: showAmount || (showAccount && !usedAccounts) || showPreAmount ? '' : 'none', 
                            marginBottom: usedAccounts ? '0' : '',
                            paddingBottom: usedAccounts ? '0' : '',
                        }}>

						<Row style={{display: showAmount ? '' : 'none'}} className='yysr-amount'>
							<label>{amountTitle}</label>
							{(isHw || oriTemp.get('usedStock')) && oriState != 'STATE_YYSR_DJ' ? <Amount showZero>{amount}</Amount> : <XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                        if (oriState == 'STATE_YYSR_DJ') {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                        } else {
                                            dispatch(editRunningActions.changeLrlsAmount(value))
                                        }
									}
								}}
							/>}
                            <label className='accountSwitch' style={{display: showMoreAccount ? '' : 'none'}}>
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
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], ''))
                                        }
                                    }}
                                />
                            </label>
						</Row>

                        <Row className={showAmount ? 'yysr-amount lrls-margin-top' : 'yysr-amount'}
                            style={{display: !usedAccounts && showAccount ? '' : 'none'}}
                        >
							<label>账户：</label>
							<Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
							/>
						</Row>

                        {
                            showPreAmount ?
                            <div className={((showAccount || showAmount) && (showOffsetAmount || !usedAccounts)) ? 'lrls-margin-top' : ''}>
                                <Row className='lrls-more-card' style={{display: !usedAccounts && !showAmount && showMoreAccount ? '' : 'none'}}>
                                    <span>多账户</span>
                                    <div className='accountSwitch'>
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
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], ''))
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>

                                <Row style={{display: showOffsetAmount ? '' : 'none'}}
                                    className={!usedAccounts && !showAmount && showMoreAccount ? 'lrls-margin-top' : ''}
                                >
                                    <div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
                                        <span style={{marginRight: '.2rem'}}>
                                            预收款: <Amount showZero>{preAmount}</Amount>
                                        </span>
                                        <span>
                                            应收款: <Amount showZero>{payableAmount}</Amount>
                                        </span>
                                    </div>

                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>{oriState=='STATE_YYSR_XS' ? '预收抵扣:' : '应收抵扣:'}</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写金额'
                                            value={offsetAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], value))
                                            }}
                                        />
                                    </Row>
                                </Row>

                                <Row className={showOffsetAmount || !usedAccounts ? 'yysr-amount lrls-margin-top' : 'yysr-amount'}
                                    style={{display: usedAccounts ? 'none' : ''}}
                                >
                                    <label>{oriState=='STATE_YYSR_XS' ? '本次收款:' : '本次付款:'}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        placeholder='填写金额'
                                        value={currentAmount}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
                                        }}
                                        onFocus={() => {
                                            const value = amount-offsetAmount
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value > 0 ? value : ''))
                                        }}
                                    />
                                    {
                                        currentAmount > 0 ? <Account
                                            dispatch={dispatch}
                                            accountList={accountList}
                                            accounts={accounts}
                                        /> : null
                                    }
                                </Row>
                            </div> : null
                        }
					</div>
                )
                break
            }
            case 'LB_YYZC': {
                const currentAmount = oriTemp.get('currentAmount')
                const preAmount = oriTemp.get('preAmount')
                const payableAmount = oriTemp.get('payableAmount')
                const offsetAmount = oriTemp.get('offsetAmount')
                const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户
                let showAmount = true//是否显示金额组件
                let showPreAmount = false//是否显示预收预付
                let showAccount = false//是否显示账户
                let amountTitle = '总金额:'
                let showOffsetAmount = false//是否显示抵扣金额组件
                let showMoreAccount = true//多账户显示
                ;({
                    'STATE_YYZC_DJ': () => {
                        showAccount = true
                        amountTitle = '预付金额:'
                    },
                    'STATE_YYZC_GJ': () => {
                        showAccount = beManagemented ? false : true
                        if (isFullPayment && isModify) {
                            showAccount = true
                        }
                        if (!isFullPayment && isModify) { showMoreAccount = false }
                        showOffsetAmount =  (preAmount > 0 && !usedAccounts) ? true : false
                        showPreAmount = ((showOffsetAmount || (beManagemented && !usedAccounts)) && !isModify) ? true : false
                    },
                    'STATE_YYZC_TG': () => {
                        showAccount = beManagemented ? false : true
                        if (isFullPayment && isModify) {
                            showAccount = true
                        }
                        showPreAmount = (beManagemented && !isModify) ? true : false
                        showOffsetAmount =  payableAmount > 0 ? true : false
                        showMoreAccount = false//多账户显示
                    }
                }[oriState] || (() => null))()

                component = (
                    <div className='lrls-card' 
                        style={{
                            display: showAmount || (showAccount && !usedAccounts) || showPreAmount ? '' : 'none', 
                            marginBottom: usedAccounts ? '0' : '',
                            paddingBottom: usedAccounts ? '0' : '',
                        }}>
                        <Row className='yysr-amount' style={{display: showAmount ? '' : 'none'}}>
							<label>{amountTitle}</label>
							{isHw && oriState != 'STATE_YYZC_DJ' ? <Amount showZero>{amount}</Amount> : <XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
                                    if (oriState == 'STATE_YYSR_DJ') {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    } else {
                                        dispatch(editRunningActions.changeLrlsAmount(value))
                                    }
								}}
							/>}
                            <label className='accountSwitch' style={{display: showMoreAccount ? '' : 'none'}}>
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
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], ''))
                                        }
                                    }}
                                />
                            </label>
						</Row>

                        <Row className={showAmount ? 'yysr-amount lrls-margin-top' : 'yysr-amount'}
                            style={{display: !usedAccounts && showAccount ? '' : 'none'}}
                        >
							<label>账户：</label>
							<Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
							/>
						</Row>

                        {
                            showPreAmount ?
                            <div className={((showAccount || showAmount) && (showOffsetAmount || !usedAccounts)) ? 'lrls-margin-top' : ''}>
                                <Row className='lrls-more-card' style={{display: !usedAccounts && !showAmount && showMoreAccount ? '' : 'none'}}>
                                    <span>多账户</span>
                                    <div className='accountSwitch'>
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
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], ''))
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>

                                <Row style={{display: showOffsetAmount ? '' : 'none'}} className={!usedAccounts && !showAmount && showMoreAccount ? 'lrls-margin-top' : ''}>
                                    <div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
                                        <span style={{marginRight: '.2rem'}}>
                                            预付款: <Amount showZero>{preAmount}</Amount>
                                        </span>
                                        <span>
                                            应付款: <Amount showZero>{payableAmount}</Amount>
                                        </span>
                                    </div>

                                    <Row className='yysr-amount margin-top-bot'>
                                        <label>{oriState=='STATE_YYZC_TG' ? '应付抵扣:' : '预付抵扣:'}</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写金额'
                                            value={offsetAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], value))
                                            }}
                                        />
                                    </Row>
                                </Row>

                                <Row className={showOffsetAmount || !usedAccounts ? 'yysr-amount lrls-margin-top' : 'yysr-amount'} style={{display: usedAccounts ? 'none' : ''}}>
                                    <label>{oriState=='STATE_YYZC_TG' ? '本次收款:' : '本次付款:'}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        placeholder='填写金额'
                                        value={currentAmount}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
                                        }}
                                        onFocus={() => {
                                            const value = amount-offsetAmount
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value > 0 ? value : ''))
                                        }}
                                    />
                                    {
                                        currentAmount > 0 ? <Account
                                            dispatch={dispatch}
                                            accountList={accountList}
                                            accounts={accounts}
                                        /> : null
                                    }
                                </Row>
                            </div> : null
                        }
					</div>
                )
                break
            }
            case 'LB_FYZC': {
                const currentAmount = oriTemp.get('currentAmount')
                const preAmount = oriTemp.get('preAmount')
                const payableAmount = oriTemp.get('payableAmount')
                const offsetAmount = oriTemp.get('offsetAmount')
                const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户
                let showMoreAccount = true//多账户显示

                let showAccount = false //是否显示账户
                if (oriState == 'STATE_FY_DJ') {
                    showAccount = true
                } 
                if (oriState == 'STATE_FY') {//发生
                    showAccount = beManagemented ? false : true
                    if (isFullPayment && isModify) { showAccount = true }
                    if (!isFullPayment && isModify) { showMoreAccount = false }
                }

                if (!(Number(amount)>=0)) {//负数 
                    showMoreAccount = false
                }

                let showPreAmount = (oriState == 'STATE_FY' && beManagemented  && !usedAccounts && !isModify) ? true : false
                let showOffsetAmount = false, offsetName = ''
                if (amount >= 0 && preAmount > 0) {
                    showOffsetAmount = true
                    offsetName = '预付抵扣:'
                }
                if (amount < 0 && payableAmount > 0) {
                    showOffsetAmount = true
                    offsetName = '应付抵扣:'
                }

                component = (
                    <div className='lrls-card' 
                        style={{
                            marginBottom: usedAccounts ? '0' : '',
                            paddingBottom: usedAccounts ? '0' : '',
                        }}>
                        <Row className='yysr-amount'>
                            <label>{oriState == 'STATE_FY_DJ' ? '预付金额:' : '金额: ' }</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={oriState == 'STATE_FY_DJ' ? false : true}
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    let reg = /^[-\d]\d*\.?\d{0,2}$/g
                                    if (oriState == 'STATE_FY_DJ') {
                                        reg = /^\d*\.?\d{0,2}$/g
                                    }

                                    if (reg.test(value)|| value == '') {
                                        if (oriState == 'STATE_FY_DJ') {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                        } else {
                                            dispatch(editRunningActions.changeLrlsAmount(value))
                                            if (!(Number(value)>=0)) {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedAccounts'], false))
                                            }
                                        }
                                    }
                                }}
                            />
                            <label className='accountSwitch' style={{display: showMoreAccount ? '' : 'none'}}>
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
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], ''))
                                        }
                                    }}
                                />
                            </label>
                        </Row>

                        <Row className='yysr-amount lrls-margin-top'
                            style={{display: !usedAccounts && showAccount ? '' : 'none'}}
                        >
							<label>账户：</label>
							<Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
							/>
						</Row>

						<Row className={((showAccount) && (showOffsetAmount || !usedAccounts)) ? 'lrls-margin-top' : ''} style={{display: showPreAmount ? '' : 'none'}}>
                            <Row style={{display: showOffsetAmount ? '' : 'none'}}>
                                <div style={{paddingLeft: '.6rem'}} className='lrls-placeholder'>
                                    <span style={{marginRight: '.2rem'}}>
                                        预付款: <Amount showZero>{preAmount}</Amount>
                                    </span>
                                    <span>
                                        应付款: <Amount showZero>{payableAmount}</Amount>
                                    </span>
                                </div>

                                <Row className='yysr-amount margin-top-bot'>
                                    <label>{offsetName}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        placeholder='填写金额'
                                        value={offsetAmount}
                                        onChange={(value) => {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'offsetAmount'], value))
                                        }}
                                    />
                                </Row>
                            </Row>
                            <Row className={showOffsetAmount || !usedAccounts ? 'yysr-amount lrls-margin-top' : 'yysr-amount'} style={{display: usedAccounts ? 'none' : ''}}>
                                <label>{amount < 0 ? '本次收款' : '本次付款'}: </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写金额'
                                    value={currentAmount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
                                    }}
                                    onFocus={() => {
                                        const value = Math.abs(amount)-offsetAmount
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value > 0 ? value : ''))
                                    }}
                                />
                                {
                                        currentAmount > 0 ? <Account
                                            dispatch={dispatch}
                                            accountList={accountList}
                                            accounts={accounts}
                                        /> : null
                                    }
                            </Row>
						</Row>
					</div>
                )
                break
            }
            case 'LB_XCZC': {
                component = <XczcCom
                    isModify={isModify}
                    dispatch={dispatch}
                    oriTemp={oriTemp}
                    accountList={accountList}
                    accounts={accounts}
                />

                break
            }
            case 'LB_SFZC': {
                component = <SfzcCom
                    isModify={isModify}
                    dispatch={dispatch}
                    oriTemp={oriTemp}
                    accountList={accountList}
                    accounts={accounts}
                />

                break
            }
            case 'LB_CQZC': {
                const beCleaning = oriTemp.get('beCleaning')
                const handleType = oriTemp.get('handleType')
                const currentAmount = oriTemp.get('currentAmount')
                let showAccount = (Number(currentAmount) > 0 || (!beManagemented)) ? true : false//新增
                if (isModify) {//修改时
                    showAccount = (isFullPayment || (!beManagemented)) ? true : false
                }

                let amountTitle = ''
                if (handleType == 'JR_HANDLE_GJ') {
                    if (amount >= 0) {
                        amountTitle='本次付款：'
                    } else {
                        amountTitle='本次收款：'
                    }
                } else {
                    if (amount >= 0) {
                        amountTitle='本次收款：'
                    } else {
                        amountTitle='本次付款：'
                    }
                }

                component = (
                    <div className='lrls-card'>
                        <Row className='yysr-amount'>
							<label>金额：</label>
							<XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={true}
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^[-\d]\d*\.?\d{0,2}$/g.test(value) || value == '') {
										dispatch(editRunningActions.changeLrlsAmount(value))
                                        if (!isModify && beManagemented && value!='-') {
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], Math.abs(value)))
                                        }
									}
                                    if (beCleaning) {//开启时
                                        dispatch(editRunningActions.autoCqzcCzAmount())
                                    }
								}}
							/>
						</Row>

						<Row className='yysr-amount lrls-margin-top' style={{display: !isModify && beManagemented ? '' : 'none'}}>
							<label>{amountTitle}</label>
							<XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={currentAmount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
								}}
							/>
						</Row>

                        <Row className='yysr-amount lrls-margin-top' style={{display: showAccount ? '' : 'none'}}>
							<label>账户：</label>
                            <Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
                            />
						</Row>
					</div>
                )
                break
            }
            case 'LB_YYWSR':
            case 'LB_YYWZC': {
                const currentAmount = oriTemp.get('currentAmount')
                let showAccount = (Number(currentAmount) > 0 || (!beManagemented && Number(amount) != 0)) ? true : false//新增
                if (isModify) {//修改时
                    showAccount = (isFullPayment || (!beManagemented && Number(amount) != 0)) ? true : false
                }
                let amountTitle = ''
                if (categoryType == 'LB_YYWSR') {
                    amountTitle = amount >= 0 ? '本次收款' : '本次付款'
                }
                if (categoryType == 'LB_YYWZC') {
                    amountTitle = amount >= 0 ? '本次付款' : '本次收款'
                }
                

                component = (
                    <div className='lrls-card'>
                        <Row className='yysr-amount'>
							<label>金额：</label>
							<XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={true}
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    if (!isModify && beManagemented) {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], Math.abs(value)))
                                    }
								}}
							/>
						</Row>
						<Row className='yysr-amount lrls-margin-top' style={{display: !isModify && beManagemented ? '' : 'none'}}>
							<label>{amountTitle}：</label>
							<XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={currentAmount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], value))
								}}
                                onFocus={() => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], Math.abs(amount)))
                                }}
							/>
						</Row>
                        <Row className='yysr-amount lrls-margin-top' style={{display: showAccount ? '' : 'none'}}>
                            <label>账户：</label>
							<Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
                            />
						</Row>
					</div>
                )
                break
            }
            case 'LB_ZSKX': {
                component = (<div className='lrls-card'>
                    <Row className='yysr-amount'>
                        <label>金额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                        <Account
                            dispatch={dispatch}
                            accountList={accountList}
                            accounts={accounts}
                        />
                    </Row>
                </div>)
                break
            }
            case 'LB_ZFKX': {
                component = (<div className='lrls-card'>
                    <Row className='yysr-amount'>
                        <label>金额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                        <Account
                            dispatch={dispatch}
                            accountList={accountList}
                            accounts={accounts}
                        />
                    </Row>
                </div>)
                break
            }
            case 'LB_JK': {
                component = (
                    <div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>金额：</label>
							<XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
								}}
							/>
							{
								oriState != 'STATE_JK_JTLX' ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
								/> : null
							}
						</Row>
					</div>
                )
                break
            }
            case 'LB_TZ': {
                const showAccount = (oriState == 'STATE_TZ_JTGL' || oriState == 'STATE_TZ_JTLX') ? false : true
                component = (
                    <div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>金额：</label>
							<XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
								}}
							/>
							{
								showAccount ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
								/> : null
							}
						</Row>
					</div>
                )
                break
            }
            case 'LB_ZB': {
                component = (
                    <div className='lrls-card'>
						<Row className='yysr-amount'>
							<label>金额：</label>
							<XfInput.BorderInputItem
                                mode='amount'
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
								}}
							/>
							{
								oriState != 'STATE_ZB_LRFP' ? <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
								/> : null
							}
						</Row>
					</div>
                )
                break
            }
            case 'LB_ZZ': {
                component = (<div className='lrls-card'>
                    <Row className='yysr-amount'>
                        <label> 金额: </label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                    </Row>
                    <Row className='yysr-amount lrls-home-account margin-top-bot'>
                        <label> 转出账户: </label>
                        <Account
                            dispatch={dispatch}
                            accountList={accountList}
                            accounts={accounts}
                            accountStatus={"ACCOUNT_STATUS_FROM"}
                        />
                    </Row>
                    <Row className='yysr-amount lrls-home-account'>
                        <label> 转入账户: </label>
                        <Account
                            dispatch={dispatch}
                            accountList={accountList}
                            accounts={accounts}
                            accountStatus={"ACCOUNT_STATUS_TO"}
                        />
                    </Row>
                </div>)
                break
            }
            case 'LB_SFGL': {
                component = <SfglCom
                    dispatch={dispatch}
                    history={history}
                    oriTemp={oriTemp}
                    isModify={isModify}
                    accounts={accounts}
                    accountList={accountList}
                    pendingStrongList={pendingStrongList}
                />
                break;
            }
            case 'LB_JZCB': {
                const relationCategoryUuid = oriTemp.get('relationCategoryUuid')//处理类别
                component = <JzcbCom
                    history={history}
                    dispatch={dispatch}
                    oriState={oriState}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    isModify={isModify}
                    isOpenedWarehouse={isOpenedWarehouse}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                    relationCategoryUuid={relationCategoryUuid}
                />
                break;
            }
            case 'LB_ZCWJZZS': {
                const handleMonth = oriTemp.get('handleMonth')
                let outputCount = 0, inputCount = 0, outputAmount = 0, inputAmount = 0
                pendingStrongList.forEach(v => {
                    if (v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX') {//销项税
                        outputCount++
                        outputAmount += v.get('taxAmount')
                    } else {
                        inputCount++
                        inputAmount += v.get('taxAmount')
                    }
                })

                component = (
                    <div className='lrls-card'>
                        <div className='lrls-more-card lrls-jzsy'>
                            <label>处理税额月份:</label>
                            <div className='antd-single-picker'>
                                <MonthPicker
                                    disabled={isModify}
                                    value={handleMonth}
                                    format={'YYYY_MM'}
                                    maxDate={new Date()}
                                    onChange={value => {
                                        let month = new DateLib(value).valueOf().slice(0,7)
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'handleMonth'], month))
                                        dispatch(editRunningActions.getWjzzsList(month))
                                    }}
                                >
                                    <Row className='lrls-padding lrls-category'>
                                        {
                                            handleMonth ? <span> {handleMonth} </span>
                                            : <span className='lrls-placeholder'>点击选择处理税额月份</span>
                                        }
                                        <Icon type="triangle" />
                                    </Row>
                                </MonthPicker>
                            </div>

                        </div>
                        <div className='lrls-more-card lrls-margin-top'>
                            <span>未交税额：</span>
                            <Amount showZero>{Number(outputAmount) - Number(inputAmount)}</Amount>
                        </div>
                    </div>
                )
                break
            }
            case 'LB_JZSY': {
                const assets = oriTemp.get('assets')
                const originalAssetsAmount = assets.get('originalAssetsAmount')// 资产原值
                const depreciationAmount = assets.get('depreciationAmount')// 折旧累计
                component = (<div className='lrls-card'>
                    <Row>
                        <label style={{marginRight: '.15rem'}}>{amount >= 0 ? '净收益金额：' : '净损失金额：'}</label>
                        <Amount showZero>{Math.abs(amount)}</Amount>
                    </Row>
                    <Row className='yysr-amount margin-top-bot lrls-jzsy'>
                        <label>资产原值:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='请填写资产原值'
                            value={originalAssetsAmount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'assets', 'originalAssetsAmount'], value))
                                dispatch(editRunningActions.autoJzsyAmount())
                            }}
                        />
                    </Row>
                    <Row className='yysr-amount lrls-jzsy'>
                        <label>累计折旧余额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='请填写累计折旧余额'
                            value={depreciationAmount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'assets', 'depreciationAmount'], value))
                                dispatch(editRunningActions.autoJzsyAmount())
                            }}
                        />
                    </Row>
                </div>)
                break
            }
            case 'LB_ZJTX': {
                component = (<div className='lrls-card'>
                    <Row className='yysr-amount'>
                        <label>金额:</label>
                        <XfInput.BorderInputItem
                            mode='amount'
                            placeholder='填写金额'
                            value={amount}
                            onChange={(value) => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                            }}
                        />
                    </Row>
                </div>)
                break
            }
            case 'LB_GGFYFT': {
                component = <GgfyftCom
                    projectCardList={projectCardList}
                    projectList={projectList}
                    dispatch={dispatch}
                    oriState={oriState}
                    hasSelect={hasSelect}
                    projectCategoryList={projectCategoryList}
                    commonProjectList={commonProjectList}
                />
                break
            }
            case 'LB_KJFP': {
                const jrTaxAmount = oriTemp.get('jrTaxAmount')//源流水收入(价税合计)
                const jrAmount = oriTemp.get('jrAmount')//税额
                const inputTax = oriTemp.get('inputTax')//开具发票直接输税额  false 输价税合计计算税额
                const taxTotal = oriTemp.get('taxTotal')//手动输入的价税合计
                component = <KjfpCom
                    dispatch={dispatch}
                    jrTaxAmount={jrTaxAmount}
                    jrAmount={jrAmount}
                    amount={amount}
                    pendingStrongList={pendingStrongList}
                    isModify={isModify}
                    inputTax={inputTax}
                    taxTotal={taxTotal}
                />
                

                break
            }
            case 'LB_FPRZ': {
                const jrTaxAmount = oriTemp.get('jrTaxAmount')
                const jrAmount = oriTemp.get('jrAmount')
                let beSelectList = [], showJrTaxTotal = true
                pendingStrongList.map(v => {
                    if (v.get('beSelect')) {
                        beSelectList.push('1')
                        if (v.get('beOpened')) {
                            showJrTaxTotal = false
                        }
                    }
                })
                const amountDisabled = beSelectList.length > 1  ? true : false


                let jrTaxTotal = jrTaxAmount
                if (!amountDisabled) {
                    jrTaxTotal = jrTaxAmount * amount / jrAmount
                }
                component = (
                    <div className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label>金额：</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                disabled={amountDisabled}
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                }}
                            />
                        </Row>
                        <div className='lrls-placeholder lrls-margin-top'
                            style={{paddingLeft: '.6rem', display: showJrTaxTotal ? '' : 'none'}}
                        >
                            <span style={{marginRight: '.2rem'}}>
                                价税合计: <Amount showZero>{jrTaxTotal}</Amount>
                            </span>
                        </div>
                    </div>
                )
                break
            }
            case 'LB_CHDB': {
                const warehouseCardList = oriTemp.get('warehouseCardList')
                component = <ChdbCom
                    dispatch={dispatch}
                    history={history}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    isModify={isModify}
                    warehouseList={warehouseList}
                    warehouseCardList={warehouseCardList}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                />
                break;
            }
            case 'LB_CHYE': {
                component = <ChyeCom
                    dispatch={dispatch}
                    history={history}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    isModify={isModify}
                    oriState={oriState}
                    isOpenedWarehouse={isOpenedWarehouse}
                    warehouseList={warehouseList}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                />
                break;
            }
            case 'LB_JXSEZC': {
                const warehouseCardList = oriTemp.get('warehouseCardList')
                const usedStock = oriTemp.get('usedStock')
                const stockRange = oriTemp.get('stockRange') ? oriTemp.get('stockRange') : fromJS([])
                component = <Jxsezc
                    dispatch={dispatch}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    isModify={isModify}
                    warehouseList={warehouseList}
                    usedStock={usedStock}
                    amount={amount}
                    isOpenedWarehouse={isOpenedWarehouse}
                    stockRange={stockRange}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                />
                break;
            }
            case 'LB_CHZZ': {
                if (oriState=='STATE_CHZZ_ZZCX') {
                    component = <ChzzCom
                        history={history}
                        dispatch={dispatch}
                        oriState={oriState}
                        stockCardList={stockCardList}
                        stockCardOtherList={stockCardOtherList}
                        stockList={stockList}
                        isOpenedWarehouse={isOpenedWarehouse}
                        stockCategoryList={stockCategoryList}
                        commonCardList={commonCardList}
                    />
                }
                if (oriState=='STATE_CHZZ_ZZD') {
                    component = <ChzzZzdCom
                        history={history}
                        dispatch={dispatch}
                        stockCardList={stockCardList}
                        isOpenedWarehouse={isOpenedWarehouse}
                        stockCategoryList={stockCategoryList}
                        cardAllList={cardAllList}
                    />
                }

                break;
            }
            case 'LB_CHTRXM': {
                component = <Chtrxm
                    dispatch={dispatch}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    history={history}
                    isOpenedWarehouse={isOpenedWarehouse}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                />
                break;
            }
            case 'LB_XMJZ': {
                const currentAmount = oriTemp.get('currentAmount')
                component = <Xmjz
                    dispatch={dispatch}
                    stockCardList={stockCardList}
                    stockList={stockList}
                    isModify={isModify}
                    isOpenedWarehouse={isOpenedWarehouse}
                    history={history}
                    stockCategoryList={stockCategoryList}
                    commonCardList={commonCardList}
                    jrAmount={oriTemp.get('jrAmount')}
                    oriState={oriState}
                    amount={amount}
                    currentAmount={currentAmount}
                    projectProperty={projectCardList.getIn([0, 'projectProperty'])}
                />
                break;
            }

            default: null
        }

        return component
    }
}

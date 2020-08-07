import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import { Row, Switch, Amount, XfInput } from 'app/components'
import Account from '../account.js'

import { decimal } from 'app/utils'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'


export default class XczcCom extends Component {
    state = {
        bePersonAccumulation: false, // 是否开启公积金(个人部分)
        bePersonSocialSecurity: false, // 社保(个人部分)
        beIncomeTax: false, // 个人所得税
    }

    render () {
        const { dispatch, oriTemp, accountList, accounts, isModify } = this.props
        const { bePersonAccumulation, bePersonSocialSecurity, beIncomeTax } = this.state

        const categoryType = oriTemp.get('categoryType')
        const oriState = oriTemp.get('oriState')
        const usedProject = oriTemp.get('usedProject')//流水是否开启项目
        const propertyPay = oriTemp.get('propertyPay')//薪酬属性
        const pendingStrongList = oriTemp.get('pendingStrongList').filter(v => v.get('beSelect'))

        const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//计提
        const beWithholding = oriTemp.getIn(['acPayment', 'beWithholding'])// 是否代扣代缴住房公积金
        const beWithholdSocial = oriTemp.getIn(['acPayment', 'beWithholdSocial'])// 是否代扣代缴社保
        const beWithholdTax = oriTemp.getIn(['acPayment', 'beWithholdTax'])// 是否代扣代缴个税

        const amount = oriTemp.get('amount')
        const payment = oriTemp.get('payment')
        const actualAmount = oriTemp.getIn(['payment', 'actualAmount'])// 支付金额
        const personAccumulationAmount = payment.get('personAccumulationAmount')// 公积金(个人部分)
        const accumulationAmount = oriTemp.get('accumulationAmount')//个人公积金未处理金额
        const personSocialSecurityAmount = payment.get('personSocialSecurityAmount') // 社保(个人部分)
        const socialSecurityAmount = oriTemp.get('socialSecurityAmount')//个人社保未处理金额
        const incomeTaxAmount = payment.get('incomeTaxAmount') // 个人所得税
        const payableAmount = oriTemp.get('payableAmount')// 个人所得税未处理金额
        const companySocialSecurityAmount = payment.get('companySocialSecurityAmount')//社保公司部分
        const companyAccumulationAmount = payment.get('companyAccumulationAmount')//公积金公司部分
        const jrAmount = oriTemp.get('jrAmount')//核销列表总金额

        let reg = /^[-\d]\d*\.?\d{0,2}$/g
        let component = null

        ;({
            'SX_GZXJ': () => {
                let fundCom = null//公积金
                let socialSecurityCom = null//社保
                let incomeTaxCom = null//个税

                let amountName = '金额'
                let showAccount = false //是否显示账户
                let autoCalculate = false//计算支付金额
                let shouldGetAmount = false//是否获取未处理金额

                //金额组件
                let amountCom = null
                let totalCom = null

                ;({
                    'STATE_XC_JT': () => {//计提
                        amountName = '金额'
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    negativeAllowed={true}
                                    placeholder={amountName}
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                            </Row>
                        </Row>
                    },
                    'STATE_XC_FF': () => {
                        //开启计提 发放 不显示费用性质
                        amountName = beAccrued ? '工资薪金' : '金额'
                        autoCalculate = beAccrued ? true : false
                        shouldGetAmount = beAccrued ? true : false
                        if (beAccrued) {
                            amountCom = !isModify ? <div className='lrls-card'>
                                <Row className='yysr-amount lrls-home-account'>
                                    <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder='填写金额'
                                        value={actualAmount}
                                        onChange={(value) => {
                                            if (pendingStrongList.size==0) {
                                                if (reg.test(value) || value == '') {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'actualAmount'], value))
                                                    if (value == '-') {
                                                        return
                                                    }
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            } else {
                                                if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'actualAmount'], value))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            }

                                        }}
                                        onFocus={() => {
                                            if (jrAmount) {
                                                const value = jrAmount-personAccumulationAmount-personSocialSecurityAmount-incomeTaxAmount
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'actualAmount'], Math.abs(decimal(value))))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }

                                        }}
                                    />
                                    <Account
                                        dispatch={dispatch}
                                        accountList={accountList}
                                        accounts={accounts}
                                    />
                                </Row>
                            </div> : <div className='lrls-card'>
                                <Row className='yysr-amount lrls-home-account'>
                                    <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
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
                            </div>


                            fundCom = (!isModify && beWithholding) ? <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>代扣个人公积金</span>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={bePersonAccumulation || personAccumulationAmount}
                                            onClick={() => {
                                                if (bePersonAccumulation) {//变为不代缴
                                                    this.setState({bePersonAccumulation: false})
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], ''))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                } else {
                                                    this.setState({bePersonAccumulation: true})
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>

                                <div style={{display: bePersonAccumulation || personAccumulationAmount ? '' : 'none'}}>
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personAccumulationAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], value))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }}
                                        />
                                    </Row>
                                    <div style={{paddingLeft: '.6rem', display: accumulationAmount > 0 ? '' : 'none'}}
                                        className='lrls-placeholder lrls-margin-top'
                                    >
                                        未处理金额: <Amount showZero>{accumulationAmount}</Amount>
                                    </div>
                                </div>
                            </Row> : null

                            socialSecurityCom = (!isModify && beWithholdSocial) ? <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>代扣个人社保</span>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={bePersonSocialSecurity || personSocialSecurityAmount}
                                            onClick={() => {
                                                if (bePersonSocialSecurity) {//变为不代扣
                                                    this.setState({bePersonSocialSecurity: false})
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], ''))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                } else {
                                                    this.setState({bePersonSocialSecurity: true})
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>
                                <div style={{display: bePersonSocialSecurity || personSocialSecurityAmount ? '' : 'none'}}>
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personSocialSecurityAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], value))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }}
                                        />
                                    </Row>
                                    <div className='lrls-placeholder lrls-margin-top'
                                        style={{paddingLeft: '.6rem', display: socialSecurityAmount > 0 ? '' : 'none'}}
                                    >
                                        未处理金额: <Amount showZero>{socialSecurityAmount}</Amount>
                                    </div>
                                </div>
                            </Row> : null

                            incomeTaxCom = (!isModify && beWithholdTax) ? <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>代扣个人所得税</span>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={beIncomeTax}
                                            onClick={() => {
                                                if (beIncomeTax) {//变为不代扣
                                                    this.setState({beIncomeTax: false})
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'incomeTaxAmount'], ''))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                } else {
                                                    this.setState({beIncomeTax: true})
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>
                                <div style={{display: beIncomeTax || incomeTaxAmount ? '' : 'none'}}>
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={incomeTaxAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'incomeTaxAmount'], value))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }}
                                        />
                                    </Row>
                                    <div className='lrls-placeholder lrls-margin-top'
                                        style={{paddingLeft: '.6rem', display: payableAmount > 0 ? '' : 'none'}}
                                    >
                                        未处理金额: <Amount showZero>{payableAmount}</Amount>
                                    </div>
                                </div>
                            </Row> : null

                            totalCom = <Row className='lrls-card'
                                style={{display: (personAccumulationAmount || personSocialSecurityAmount || incomeTaxAmount) && actualAmount ? '' : 'none'}}
                                >
                                <Row className='yysr-amount lrls-home-account'>
                                    <label>工资薪金：</label>
                                    <Amount showZero className='amount'>{amount}</Amount>
                                </Row>
                            </Row>

                        } else {
                            amountCom = <Row className='lrls-card'>
                                <Row className='yysr-amount'>
                                    <label> 金额： </label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder={amountName}
                                        value={amount}
                                        onChange={(value) => {                                            
                                            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                            
                                            if (value == '-') { return }
                                            if (autoCalculate) {
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }
                                        }}
                                    />
                                    <Account
                                        dispatch={dispatch}
                                        accountList={accountList}
                                        accounts={accounts}
                                    />
                                </Row>
                            </Row>
                        }
                    },
                    'STATE_XC_DK': () => {//修改的代扣
                        const totalAmount = decimal(Number(personAccumulationAmount) + Number(personSocialSecurityAmount) + Number(incomeTaxAmount))
                        const hxAccumulationAmount = oriTemp.get('hxAccumulationAmount')
                        const hxSocialSecurityAmount = oriTemp.get('hxSocialSecurityAmount')
                        const personTaxAmount = oriTemp.get('personTaxAmount')
                        totalCom = <div className='lrls-card'>
                            <Row className='yysr-amount lrls-home-account'>
                                <label>代扣合计：</label>
                                <Amount showZero className='amount'>{totalAmount}</Amount>
                            </Row>
                        </div>

                        fundCom = (beWithholding) ? <Row className='lrls-card'>
                            <Row className='lrls-more-card'>
                                <span>代扣个人公积金</span>
                                <div className='noTextSwitch'>
                                    <Switch
                                        checked={bePersonAccumulation || personAccumulationAmount}
                                        onClick={() => {
                                            this.setState({bePersonAccumulation: !bePersonAccumulation})
                                            if (bePersonAccumulation) {//变为不代缴
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], ''))
                                            }
                                        }}
                                    />
                                </div>
                            </Row>
                            {
                                (bePersonAccumulation || personAccumulationAmount) ?
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personAccumulationAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                            }
                            {
                                (hxAccumulationAmount) ?
                                    <Row className='lrls-margin-top lrls-placeholder'>
                                        其中公积金代缴抵扣：<Amount>{hxAccumulationAmount}</Amount>
                                    </Row> : null
                            }
                        </Row> : null

                        socialSecurityCom = (beWithholdSocial) ? <Row className='lrls-card'>
                            <Row className='lrls-more-card'>
                                <span>代扣个人社保</span>
                                <div className='noTextSwitch'>
                                    <Switch
                                        checked={bePersonSocialSecurity || personSocialSecurityAmount}
                                        onClick={() => {
                                            this.setState({bePersonSocialSecurity: !bePersonSocialSecurity})
                                            if (bePersonSocialSecurity) {//变为不代扣
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], ''))
                                            }
                                        }}
                                    />
                                </div>
                            </Row>
                            {
                                (bePersonSocialSecurity || personSocialSecurityAmount) ?
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personSocialSecurityAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                            }
                            {
                                (hxSocialSecurityAmount) ?
                                    <Row className='lrls-margin-top lrls-placeholder'>
                                        其中社保代缴抵扣：<Amount>{hxSocialSecurityAmount}</Amount>
                                    </Row> : null
                            }
                        </Row> : null

                        incomeTaxCom = (beWithholdTax) ? <Row className='lrls-card'>
                            <Row className='lrls-more-card'>
                                <span>代扣个人所得税</span>
                                <div className='noTextSwitch'>
                                    <Switch
                                        checked={beIncomeTax || incomeTaxAmount}
                                        onClick={() => {
                                            this.setState({beIncomeTax: !beIncomeTax})
                                            if (beIncomeTax) {//变为不代扣
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'incomeTaxAmount'], ''))
                                            }
                                        }}
                                    />
                                </div>
                            </Row>
                            {
                                (beIncomeTax || incomeTaxAmount) ?
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={incomeTaxAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'incomeTaxAmount'], value))
                                            }}
                                        />
                                    </Row> : null
                            }
                            {
                                (personTaxAmount) ?
                                    <Row className='lrls-margin-top lrls-placeholder'>
                                        其中个税代缴抵扣：<Amount>{personTaxAmount}</Amount>
                                    </Row> : null
                            }
                        </Row> : null
                    }
                }[oriState] || (() => null))()

                component = (
                    <div>
                        {/* 代扣个人公积金 */}
                        { fundCom }
                        {/* 代扣个人社保 */}
                        { socialSecurityCom }
                        {/* 代扣个人所得税 */}
                        { incomeTaxCom }
                        {/* 金额组件 */}
                        { amountCom }
                        {/* 金额合计 */}
                        {totalCom}
                    </div>
                )
            },
            'SX_SHBX': () => {
                let amountName = '金额'
                let shouldGetAmount = false//是否获取未处理金额

                //金额组件
                let amountCom = null
                let socialSecurityCom = null//社保
                let totalCom = null

                ;({
                    'STATE_XC_JT': () => {//计提
                        amountName = '金额(公司部分)'
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label> 金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    negativeAllowed={true}
                                    placeholder={amountName}
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                            </Row>
                        </Row>
                    },
                    'STATE_XC_JN': () => {
                        if (beAccrued || beWithholdSocial) {
                            amountCom = !isModify ? <div className='lrls-card'>
                                <Row className='yysr-amount lrls-home-account'>
                                    <label>社保金额: </label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder='填写金额'
                                        value={companySocialSecurityAmount}
                                        onChange={(value) => {
                                            if (pendingStrongList.size==0) {
                                                if (reg.test(value) || value == '') {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'companySocialSecurityAmount'], value))
                                                    if (value=='-') {
                                                        return
                                                    }
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            } else {
                                                if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'companySocialSecurityAmount'], value))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            }
                                        }}
                                    />
                                    {
                                        !beWithholdSocial ? <Account
                                             dispatch={dispatch}
                                             accountList={accountList}
                                             accounts={accounts}
                                         /> : null
                                    }

                                </Row>
                            </div> : <div className='lrls-card'>
                                <Row className='yysr-amount lrls-home-account'>
                                    <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
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
                            </div>

                            socialSecurityCom = (!isModify && beWithholdSocial) ? <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>代缴个人社保</span>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={bePersonSocialSecurity || personSocialSecurityAmount}
                                            color='#FF8348'
                                            onClick={() => {
                                                this.setState({bePersonSocialSecurity: !bePersonSocialSecurity})
                                                if (bePersonSocialSecurity) {//变为不代缴
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], 0))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>
                                <div style={{display: (bePersonSocialSecurity || personSocialSecurityAmount) ? '' : 'none'}}>
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personSocialSecurityAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], value))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }}
                                        />
                                    </Row>
                                    <div className='lrls-placeholder lrls-margin-top'
                                        style={{paddingLeft: '.6rem', display: socialSecurityAmount > 0 ? '' : 'none'}}
                                    >
                                        未处理金额: <Amount showZero>{socialSecurityAmount}</Amount>
                                    </div>
                                </div>
                            </Row> : null

                            totalCom = <div className='lrls-card' style={{display: !beWithholdSocial || isModify ? 'none' : ''}}>
                                <Row className='yysr-amount lrls-home-account'>
                                    {/* {jrAmount < 0 || actualAmount < 0 ? '收款金额：' : '付款金额：'} */}
                                    <label>{actualAmount < 0 ? '收款金额：' : '付款金额：'}</label>
                                    <Amount showZero className='amount'>{Math.abs(actualAmount)}</Amount>
                                    <Account
                                        dispatch={dispatch}
                                        accountList={accountList}
                                        accounts={accounts}
                                    />
                                </Row>
                            </div>

                        } else {
                            amountCom = <Row className='lrls-card'>
                                <Row className='yysr-amount'>
                                    <label>金额:</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder={amountName}
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
                            </Row>
                        }
                    },
                    'STATE_XC_DJ': () => {
                        const hxSocialSecurityAmount = oriTemp.get('hxSocialSecurityAmount')
                        socialSecurityCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>代缴金额：</label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写个人部分金额'
                                    value={personSocialSecurityAmount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personSocialSecurityAmount'], value))
                                    }}
                                />
                                <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                />
                            </Row>
                            {
                                (hxSocialSecurityAmount) ?
                                    <Row className='lrls-margin-top lrls-placeholder'>
                                        其中社保代扣抵扣：<Amount>{hxSocialSecurityAmount}</Amount>
                                    </Row> : null
                            }
                        </Row>
                    }
                }[oriState] || (() => null))()

                component = (
                    <div>
                        {/* 金额组件 */}
                        { amountCom }

                        {/* 代扣个人社保 */}
                        { socialSecurityCom }

                        { totalCom }
                    </div>
                )
            },
            'SX_ZFGJJ': () => {
                let amountName = '金额'
                let amountCom = null//金额组件
                let fundCom = null//公积金辅助核算
                let totalCom = null

                ;({
                    'STATE_XC_JT': () => {//计提
                        amountName = '金额(公司部分)'
                        amountCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>金额： </label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    negativeAllowed={true}
                                    placeholder={amountName}
                                    value={amount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                    }}
                                />
                            </Row>
                        </Row>
                    },
                    'STATE_XC_JN': () => {

                        if (beAccrued || beWithholding) {
                            amountCom = <div className='lrls-card'>
                                <Row className='yysr-amount'>
                                    <label>公积金额： </label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder='填写金额'
                                        value={companyAccumulationAmount}
                                        onChange={(value) => {
                                            if (pendingStrongList.size==0) {
                                                if (reg.test(value) || value == '') {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'companyAccumulationAmount'], value))
                                                    if (value=='-') {
                                                        return
                                                    }
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            } else {
                                                if (/^\d*\.?\d{0,2}$/g.test(value)) {
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'companyAccumulationAmount'], value))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            }

                                        }}
                                    />
                                    {
                                        !beWithholding ? <Account
                                             dispatch={dispatch}
                                             accountList={accountList}
                                             accounts={accounts}
                                         /> : null
                                    }
                                </Row>
                            </div>

                            if (isModify) {
                                amountCom = <div className='lrls-card'>
                                    <Row className='yysr-amount lrls-home-account'>
                                        <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            negativeAllowed={true}
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
                                </div>
                            }

                            totalCom = <div className='lrls-card' style={{display: !beWithholding || isModify ? 'none' : ''}}>
                                <Row className='yysr-amount lrls-home-account'>
                                    {/* {jrAmount < 0 || actualAmount < 0 ? '收款金额：' : '付款金额: ' } */}
                                    <label>{actualAmount < 0 ? '收款金额：' : '付款金额: ' }</label>
                                    <Amount showZero className='amount'>{Math.abs(actualAmount)}</Amount>
                                    <Account
                                        dispatch={dispatch}
                                        accountList={accountList}
                                        accounts={accounts}
                                    />
                                </Row>
                            </div>

                            fundCom = (!isModify && beWithholding) ? <Row className='lrls-card'>
                                <Row className='lrls-more-card'>
                                    <span>代缴个人公积金</span>
                                    <div className='noTextSwitch'>
                                        <Switch
                                            checked={bePersonAccumulation || personAccumulationAmount}
                                            onClick={() => {
                                                this.setState({bePersonAccumulation: !bePersonAccumulation})
                                                if (bePersonAccumulation) {//变为不代缴
                                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], ''))
                                                    dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                                }
                                            }}
                                        />
                                    </div>
                                </Row>
                                <div style={{display: (bePersonAccumulation || personAccumulationAmount) ? '' : 'none'}}>
                                    <Row className='yysr-amount lrls-margin-top'>
                                        <label>金额：</label>
                                        <XfInput.BorderInputItem
                                            mode='amount'
                                            placeholder='填写个人部分金额'
                                            value={personAccumulationAmount}
                                            onChange={(value) => {
                                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], value))
                                                dispatch(editRunningActions.xczcCalculateAmount(propertyPay))
                                            }}
                                        />
                                    </Row>
                                    <div style={{paddingLeft: '.6rem', display: accumulationAmount > 0 ? '' : 'none'}}
                                        className='lrls-placeholder lrls-margin-top'
                                    >
                                        未处理金额: <Amount showZero>{accumulationAmount}</Amount>
                                    </div>
                                </div>
                            </Row> : null

                        } else {
                            amountCom = <Row className='lrls-card'>
                                <Row className='yysr-amount'>
                                    <label>金额:</label>
                                    <XfInput.BorderInputItem
                                        mode='amount'
                                        negativeAllowed={true}
                                        placeholder={amountName}
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
                            </Row>
                        }
                    },
                    'STATE_XC_DJ': () => {
                        const hxAccumulationAmount = oriTemp.get('hxAccumulationAmount')
                        fundCom = <Row className='lrls-card'>
                            <Row className='yysr-amount'>
                                <label>代缴金额：</label>
                                <XfInput.BorderInputItem
                                    mode='amount'
                                    placeholder='填写个人部分金额'
                                    value={personAccumulationAmount}
                                    onChange={(value) => {
                                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'payment', 'personAccumulationAmount'], value))
                                    }}
                                />
                                <Account
                                    dispatch={dispatch}
                                    accountList={accountList}
                                    accounts={accounts}
                                />
                            </Row>
                            {
                                (hxAccumulationAmount) ?
                                    <Row className='lrls-margin-top lrls-placeholder'>
                                        其中公积金代扣抵扣：<Amount>{hxAccumulationAmount}</Amount>
                                    </Row> : null
                            }
                        </Row>
                    }
                }[oriState] || (() => null))()

                component = (
                        <div>
                            {/* 金额组件 */}
                            { amountCom }
                            {/* 代扣个人公积金 */}
                            { fundCom }
                            { totalCom }
                        </div>
                )
            },
            'SX_FLF': () => {
                const showAccount = oriState == 'STATE_XC_FF' ? true : false
                component = (
                    <Row className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={true}
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                }}
                            />
                            { showAccount ? <Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
                            /> : null }
                        </Row>
                    </Row>
                )

            },
            'SX_QTXC': () => {
                const showAccount = oriState == 'STATE_XC_FF' ? true : false
                component = (
                    <Row className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label>{jrAmount >= 0 ? '付款金额：' : '收款金额：'}</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={true}
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], value))
                                }}
                            />
                            { showAccount ? <Account
                                dispatch={dispatch}
                                accountList={accountList}
                                accounts={accounts}
                            /> : null }
                        </Row>
                    </Row>
                )
            }
        }[propertyPay] || (() => null))()

        return component
    }
}

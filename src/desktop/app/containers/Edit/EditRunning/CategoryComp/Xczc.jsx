import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { Checkbox, message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, JtHoc } from '../common/common'
import Project from '../Project'
import AccountComp from '../AccountComp'
import HandlingList from '../HandlingList'
import AccountPandge from '../AccountPandge'
import DisplayHandlingList from '../DisplayHandlingList'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@JtHoc('Payment')
@immutableRenderDecorator
export default
class Xczc extends React.Component {
    state = {
        personSocialSecurityAmountDisabled:false,
        personAccumulationAmountDisabled:false,
        incomeTaxAmountDisabled:false,
    }
    componentWillReceiveProps(nextprops) {
        const { oriTemp, categoryTypeObj, dispatch } = this.props
        const oriDate = oriTemp.get('oriDate')
        const insertOrModify = nextprops.insertOrModify
        const newOriDate = nextprops.oriTemp.get('oriDate')
        const oriState = oriTemp.get('oriState')
        const newOriState = nextprops.oriTemp.get('oriState')
        const categoryUuid = oriTemp.get('categoryUuid')
        const newCategoryUuid = nextprops.oriTemp.get('categoryUuid')
        const beWithholding = nextprops.oriTemp.getIn([categoryTypeObj,'beWithholding'])
        const beWithholdSocial = nextprops.oriTemp.getIn([categoryTypeObj,'beWithholdSocial'])
        const propertyCostList = nextprops.oriTemp.get('propertyCostList')
        if ((beWithholding || beWithholdSocial) && oriDate !== newOriDate && insertOrModify !== 'modify') {
            this.props.dispatch(editRunningActions.getJrPaymentAmountInfo(newCategoryUuid,newOriDate))
            this.props.dispatch(editRunningActions.getJrPaymentTaxInfo(newCategoryUuid,newOriDate))
        }
        if (categoryUuid !== newCategoryUuid || oriState !== newOriState) {
            this.setState({
                personSocialSecurityAmountDisabled:false,
                personAccumulationAmountDisabled:false,
                incomeTaxAmountDisabled:false,
            })
            insertOrModify !== 'modify' && dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', propertyCostList.get(0)))
        }

    }
    render() {
        const {
            oriTemp,
            accountList,
            projectList,
            dispatch,
            flags,
            MemberList,
            selectThingsList,
            thingsList,
            categoryTypeObj,
            insertOrModify,
            isCheckOut,
            accountPoundage,
            moduleInfo
        } = this.props
        const {
            personSocialSecurityAmountDisabled,
            personAccumulationAmountDisabled,
            incomeTaxAmountDisabled,
        } = this.state
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount')
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const beAccrued = oriTemp.getIn([categoryTypeObj,'beAccrued'])
        const beWithholding = oriTemp.getIn([categoryTypeObj,'beWithholding'])
        const beWithholdTax = oriTemp.getIn([categoryTypeObj,'beWithholdTax'])
        const beWithholdSocial = oriTemp.getIn([categoryTypeObj,'beWithholdSocial'])
        const beWelfare = oriTemp.getIn([categoryTypeObj,'beWelfare'])
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const strongList = oriTemp.get('strongList')
        const propertyPay = oriTemp.get('propertyPay')
        const accumulationAmount = oriTemp.get('accumulationAmount')
        const payableAmount = oriTemp.get('payableAmount')
        const currentProjectCardList = oriTemp.get('currentProjectCardList')
        const personTaxAmount = oriTemp.get('personTaxAmount')
        const hxAccumulationAmount = oriTemp.get('hxAccumulationAmount')
        const hxSocialSecurityAmount = oriTemp.get('hxSocialSecurityAmount')
        const socialSecurityAmount = oriTemp.get('socialSecurityAmount')
        const notHandleAmount = oriTemp.get('notHandleAmount')
        const actualAmount = oriTemp.getIn(['payment','actualAmount'])
        const companyAccumulationAmount = oriTemp.getIn(['payment','companyAccumulationAmount'])
        const personAccumulationAmount = oriTemp.getIn(['payment','personAccumulationAmount'])
        const companySocialSecurityAmount = oriTemp.getIn(['payment','companySocialSecurityAmount'])
        const personSocialSecurityAmount = oriTemp.getIn(['payment','personSocialSecurityAmount'])
        const incomeTaxAmount = oriTemp.getIn(['payment','incomeTaxAmount'])
        const currentpersonSocialSecurityAmount = oriTemp.get('currentpersonSocialSecurityAmount')
        const currentpersonAccumulationAmount = oriTemp.get('currentpersonAccumulationAmount')
        const currentpincomeTaxAmount = oriTemp.get('currentpincomeTaxAmount')
        const showSingleModal = flags.get('showSingleModal')
        const poundage = flags.get('poundage')
        const accountContactsRangeList = flags.get('accountContactsRangeList')
        const accountProjectList = flags.get('accountProjectList')
        const accountProjectRange = flags.get('accountProjectRange')
        const accountContactsRange = flags.get('accountContactsRange')
        let totalNotHandleAmount = 0
        pendingStrongList && pendingStrongList.forEach(v => {if (v.get('beSelect')) {
                insertOrModify === 'modify'?
                totalNotHandleAmount += Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
                :
                totalNotHandleAmount += Number(v.get('notHandleAmount'))

            }
        })
        return(
            <div>
                {
                    usedProject && insertOrModify === 'modify' && currentProjectCardList.size || beProject && (insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && ((beAccrued || beWelfare) && oriState === 'STATE_XC_JT' || !beAccrued && !beWelfare && (oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN'))?
                    <Project
                        projectCardList={projectCardList}
                        usedProject={usedProject}
                        projectList={projectList}
                        dispatch={dispatch}
                        beProject={beProject}
                        amount={amount}
                        taxRate={taxRate}
                        showSingleModal={showSingleModal}
                        MemberList={MemberList}
                        selectThingsList={selectThingsList}
                        thingsList={thingsList}
                        oriTemp={oriTemp}
                        flags={flags}
                        moduleInfo={moduleInfo}
                        insertOrModify={insertOrModify}
                    />:''
                }
                {
                    oriState === 'STATE_XC_FF' && (!beAccrued || propertyPay !== 'SX_GZXJ' && beAccrued)
                    || oriState === 'STATE_XC_JT' || oriState === 'STATE_XC_JN' && !beWithholding && !beWithholdTax && !beWithholdSocial && insertOrModify === 'insert'
                    || insertOrModify === 'modify' && oriState !== 'STATE_XC_DJ' && oriState !== 'STATE_XC_DK'?
                        <div className="edit-running-modal-list-item">
                            <label>{oriState === 'STATE_XC_JT'?'金额：':totalNotHandleAmount < 0?'收款金额：':'付款金额：' }</label>
                            {
                                (beProject && usedProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && projectCardList.size > 1
                                 || beAccrued && propertyPay==='SX_GZXJ' && oriState === 'STATE_XC_FF' && insertOrModify === 'insert'?
                                    <div>{formatMoney(amount)}</div>
                                    :
                                    <Input
                                        placeholder=""
                                        value={amount}
                                        onFocus={()=> {
                                            if (insertOrModify === 'modify' && totalNotHandleAmount) {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',Math.abs(totalNotHandleAmount)))
                                            }
                                        }}
                                        onChange={(e) => {
                                            numberTest(e,value => {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                                if (projectCardList.size === 1) {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                                }
                                                insertOrModify === 'insert' && beAccrued && oriState !== 'STATE_XC_JT' && dispatch(editRunningActions.autoCalculateAmount())
                                            },true)
                                        }}
                                    />
                            }
                        </div>:''
                }
                {
                    insertOrModify === 'insert' && oriState === 'STATE_XC_FF' && propertyPay === 'SX_GZXJ' && beAccrued && !beWithholding && !beWithholdTax && !beWithholdSocial?
                    <div className="edit-running-modal-list-item">
                        <label>{totalNotHandleAmount<0?'收款金额':'付款金额：'}</label>
                                <Input
                                    placeholder=""
                                    value={actualAmount}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','actualAmount'],value))
                                            // dispatch(editRunningActions.autoCalculateAmount())
                                        },true)
                                    }}
                                />
                    </div>:''
                }
                {
                    oriState === 'STATE_XC_DJ'?
                    <div className="edit-running-modal-list-item">
                        <label>{'代缴金额：'}</label>
                                <Input
                                    placeholder=""
                                    value={propertyPay === 'SX_SHBX'?personSocialSecurityAmount:personAccumulationAmount}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment',`${propertyPay === 'SX_SHBX'?'personSocialSecurityAmount':'personAccumulationAmount'}`],value))
                                            dispatch(editRunningActions.autoCalculateAmount())
                                        })
                                    }}
                                />
                    </div>:''
                }
                {
                    hxSocialSecurityAmount && oriState === 'STATE_XC_DJ' && insertOrModify === 'modify'?
                    <div className='extra-dikou'>
                        {`其中社保${propertyPay === 'SX_GZXJ'?'代缴':'代扣'}抵扣：`}{formatMoney(hxSocialSecurityAmount)}
                    </div>:''
                }
                {
                    hxAccumulationAmount && oriState === 'STATE_XC_DJ' && insertOrModify === 'modify'?
                    <div className='extra-dikou'>
                        {`其中公积金${propertyPay === 'SX_GZXJ'?'代缴':'代扣'}抵扣：`}{formatMoney(hxAccumulationAmount)}
                    </div>:''
                }
                {
                    oriState !== 'STATE_XC_JT' && oriState !== 'STATE_XC_DK' && oriState !== 'STATE_XC_JN'
                    && (!beWithholdTax && !beWithholding && !beWithholdSocial || propertyPay !== 'SX_GZXJ' || insertOrModify === 'modify' && amount != 0)?
                        <AccountComp
                            accountList={accountList}
                            accounts={accounts}
                            dispatch={dispatch}
                            isCheckOut={isCheckOut}
                            oriTemp={oriTemp}
                            amount={
                                {
                                    'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                    'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                        beWithholdSocial?
                                        actualAmount:amount
                                        :
                                        beWithholding?
                                        actualAmount:amount}`,
                                }[oriState]
                            }
                        />:''
                }
                {
                    (oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && (amount < 0 || totalNotHandleAmount < 0 || actualAmount < 0) &&
                    (oriState !== 'STATE_XC_JT' && oriState !== 'STATE_XC_DK' && oriState !== 'STATE_XC_JN'
                    && (!beWithholdTax && !beWithholding && !beWithholdSocial || propertyPay !== 'SX_GZXJ' || insertOrModify === 'modify' && amount != 0)) ?
                    <AccountPandge
                        accounts={accounts}
                        dispatch={dispatch}
                        accountPoundage={accountPoundage}
                        oriTemp={oriTemp}
                        poundage={poundage}
                        projectList={projectList}
                        accountContactsRangeList={accountContactsRangeList}
                        accountProjectList={accountProjectList}
                        accountProjectRange={accountProjectRange}
                        accountContactsRange={accountContactsRange}
                        insertOrModify={insertOrModify}
                        amount={
                            {
                                'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                    beWithholdSocial?
                                    actualAmount:amount
                                    :
                                    beWithholding?
                                    actualAmount:amount}`,
                            }[oriState]
                        }
                    />:''
                }
                {/* {
                    oriState === 'STATE_XC_JN' && (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ') && insertOrModify === 'modify' && (beWithholding || beWithholdSocial)?
                    <div className="edit-running-modal-list-item">
                        <label>{'付款金额：'}</label>
                                <Input
                                    placeholder=""
                                    value={propertyPay === 'SX_SHBX'?companySocialSecurityAmount:companyAccumulationAmount}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment',`${propertyPay === 'SX_SHBX'?'companySocialSecurityAmount':'companyAccumulationAmount'}`],value))
                                            dispatch(editRunningActions.autoCalculateAmount())
                                        })
                                    }}
                                />
                    </div>:''
                } */}
                <div
                    style={{
                        display:(oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN' )
                            && (beWithholding || beWithholdTax || beWithholdSocial)
                            && insertOrModify === 'insert'
                            || insertOrModify === 'modify' && oriState === 'STATE_XC_DK'
                             ?'':'none'
                        }}
                >
                    <div className="edit-running-modal-list-item" style={{display:propertyPay==='SX_SHBX' && beWithholdSocial?'':'none'}}>
                        <label className='large-width-label'>{`社会保险(公司部分)：`}</label>
                        <Input
                            placeholder=""
                            value={companySocialSecurityAmount}
                            onChange={(e) => {
                                numberTest(e,value => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','companySocialSecurityAmount'],value))
                                    dispatch(editRunningActions.autoCalculateAmount())
                                },true)
                            }}
                        />
                    </div>
                    <div
                        style={{display:(propertyPay==='SX_SHBX' || propertyPay==='SX_GZXJ') && oriState !== 'STATE_XC_JT' && (beWithholdSocial || currentpersonSocialSecurityAmount > 0)?'':'none'}}
                    >
                        <div className={`edit-running-modal-list-item ${hxSocialSecurityAmount?'.no-margin-bottom':''}`} >
                            <span style={{marginRight:'10px'}}>
                                <Checkbox
                                    checked={!personSocialSecurityAmountDisabled}
                                    onChange={(e) => {
                                        if (!personSocialSecurityAmountDisabled) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','personSocialSecurityAmount'],''))
                                        }
                                        this.setState({personSocialSecurityAmountDisabled:!personSocialSecurityAmountDisabled})
                                        dispatch(editRunningActions.autoCalculateAmount())
                                    }}
                                />
                            </span>
                            <label className='large-width-label'>{`${propertyPay === 'SX_SHBX'?'代缴':'代扣'}社会保险(个人部分)：`}</label>
                            <Input
                                disabled={personSocialSecurityAmountDisabled}
                                placeholder=""
                                value={personSocialSecurityAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','personSocialSecurityAmount'],value))
                                    })
                                    dispatch(editRunningActions.autoCalculateAmount())
                                }}
                            />
                            {
                                socialSecurityAmount>0?
                                <div className='dikou-content'>
                                    <label>未处理金额：</label>
                                    <div>{formatMoney(socialSecurityAmount)}</div>
                                </div>:''
                            }
                        </div>
                        {
                            hxSocialSecurityAmount && insertOrModify === 'modify'?
                            <div className='extra-dikou'>
                                {`其中社保${propertyPay === 'SX_GZXJ'?'代缴':'代扣'}抵扣：`}{formatMoney(hxSocialSecurityAmount)}
                            </div>:''
                        }
                    </div>
                    <div className="edit-running-modal-list-item" style={{display:propertyPay==='SX_ZFGJJ' && beWithholding?'':'none'}}>
                        <label className='large-width-label'>{`公积金(公司部分)：`}</label>
                        <Input
                            placeholder=""
                            value={companyAccumulationAmount}
                            onChange={(e) => {
                                numberTest(e,value => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','companyAccumulationAmount'],value))
                                    dispatch(editRunningActions.autoCalculateAmount())
                                },true)
                            }}
                        />
                    </div>
                    <div
                        style={{display:(propertyPay==='SX_ZFGJJ' || propertyPay==='SX_GZXJ') && (beWithholding || currentpersonAccumulationAmount > 0)?'':'none'}}
                    >
                        <div className={`edit-running-modal-list-item ${hxAccumulationAmount?'.no-margin-bottom':''}`} >
                            <span style={{marginRight:'10px'}}>
                                <Checkbox
                                    checked={!personAccumulationAmountDisabled}
                                    onChange={(e) => {
                                        if (!personAccumulationAmountDisabled) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','personAccumulationAmount'],''))
                                        }
                                        this.setState({personAccumulationAmountDisabled:!personAccumulationAmountDisabled})
                                        dispatch(editRunningActions.autoCalculateAmount())
                                    }}
                                />
                            </span>
                            <label className='large-width-label'>{`${propertyPay==='SX_ZFGJJ'?'代缴':'代扣'}公积金(个人部分)：`}</label>
                            <Input
                                disabled={personAccumulationAmountDisabled}
                                placeholder=""
                                value={personAccumulationAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','personAccumulationAmount'],value))
                                    })
                                    dispatch(editRunningActions.autoCalculateAmount())
                                }}
                            />
                            {
                                accumulationAmount>0?
                                <div className='dikou-content'>
                                    <label>未处理金额：</label>
                                    <div>{formatMoney(accumulationAmount)}</div>
                                </div>:''
                            }
                        </div>
                        {
                            hxAccumulationAmount && insertOrModify === 'modify'?
                            <div className='extra-dikou'>
                                {`其中公积金${propertyPay === 'SX_GZXJ'?'代缴':'代扣'}抵扣：`}{formatMoney(hxAccumulationAmount)}
                            </div>:''
                        }
                    </div>
                    <div
                        style={{display:(propertyPay==='SX_SHBX' || propertyPay==='SX_GZXJ') && oriState !== 'STATE_XC_JT' && (beWithholdTax || currentpincomeTaxAmount > 0)?'':'none'}}
                    >
                        <div className={`edit-running-modal-list-item ${personTaxAmount?'.no-margin-bottom':''}`} >
                            <span style={{marginRight:'10px'}}>
                                <Checkbox
                                    checked={!incomeTaxAmountDisabled}
                                    onChange={(e) => {
                                        if (!incomeTaxAmountDisabled) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','incomeTaxAmount'],''))
                                        }
                                        this.setState({incomeTaxAmountDisabled:!incomeTaxAmountDisabled})
                                        dispatch(editRunningActions.autoCalculateAmount())
                                    }}
                                />
                            </span>
                            <label className='large-width-label'>{`${propertyPay === 'SX_GZXJ'?'代扣':'代缴'}个人所得税：`}</label>
                            <Input
                                disabled={incomeTaxAmountDisabled}
                                placeholder=""
                                value={incomeTaxAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','incomeTaxAmount'],value))
                                    })
                                    dispatch(editRunningActions.autoCalculateAmount())
                                }}
                            />
                            {
                                propertyPay === 'SX_GZXJ' && payableAmount>0?
                                <div className='dikou-content'>
                                    <label>未处理金额：</label>
                                    <div>{formatMoney(payableAmount)}</div>
                                </div>:''
                            }
                        </div>
                        {
                            personTaxAmount && insertOrModify === 'modify'?
                            <div className='extra-dikou'>
                                其中个税代缴抵扣：{formatMoney(personTaxAmount)}
                            </div>:''
                        }
                    </div>
                    {
                        oriState === 'STATE_XC_FF' && beAccrued && propertyPay === 'SX_GZXJ' && insertOrModify === 'insert'?
                            <div className="edit-running-modal-list-item">
                                <label>{totalNotHandleAmount < 0 ? '收款金额：' :'付款金额：'}</label>
                                        <Input
                                            placeholder=""
                                            value={actualAmount}
                                            onFocus={() => {
                                                if(propertyPay === 'SX_GZXJ' && oriState === 'STATE_XC_FF' && pendingStrongList.size) {
                                                    const totalAmount = pendingStrongList.reduce((pre,cur) => cur.get('beSelect') ? pre+=(insertOrModify === 'insert' ? Number(cur.get('notHandleAmount')) : (Number(cur.get('notHandleAmount')) + Number(cur.get('handlingAmount')))) : pre,0)
                                                    const actualAmount = (Number(totalAmount || 0)-Number(personSocialSecurityAmount || 0) -Number(personAccumulationAmount || 0)-Number(incomeTaxAmount || 0)).toFixed(2)
                                                    if (totalAmount > 0 && actualAmount > 0 || totalAmount < 0 && actualAmount < 0) {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','actualAmount'],actualAmount!=0?Math.abs(actualAmount):''))
                                                    }
                                                    dispatch(editRunningActions.autoCalculateAmount())
                                                }
                                            }}
                                            onChange={(e) => {
                                                numberTest(e,value => {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','actualAmount'],value))
                                                    dispatch(editRunningActions.autoCalculateAmount('amount'))
                                                },true)
                                            }}
                                        />
                            </div>:''
                    }
                    {
                        (beWithholdTax || beWithholding || beWithholdSocial) && oriState === 'STATE_XC_FF' && actualAmount != 0 && actualAmount ?
                            <AccountComp
                                accountList={accountList}
                                accounts={accounts}
                                dispatch={dispatch}
                                isCheckOut={isCheckOut}
                                oriTemp={oriTemp}
                                amount={
                                    {
                                        'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                        'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                            beWithholdSocial?
                                            actualAmount:amount
                                            :
                                            beWithholding?
                                            actualAmount:amount}`,
                                    }[oriState]
                                }
                            />:''
                    }
                    {
                        (oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && (amount < 0 || totalNotHandleAmount < 0 || actualAmount < 0)
                        && (beWithholdTax || beWithholding || beWithholdSocial) && oriState === 'STATE_XC_FF' && actualAmount != 0 && actualAmount ?
                        <AccountPandge
                            accounts={accounts}
                            dispatch={dispatch}
                            accountPoundage={accountPoundage}
                            oriTemp={oriTemp}
                            poundage={poundage}
                            projectList={projectList}
                            accountContactsRangeList={accountContactsRangeList}
                            accountProjectList={accountProjectList}
                            accountProjectRange={accountProjectRange}
                            accountContactsRange={accountContactsRange}
                            insertOrModify={insertOrModify}
                            amount={
                                {
                                    'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                    'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                        beWithholdSocial?
                                        actualAmount:amount
                                        :
                                        beWithholding?
                                        actualAmount:amount}`,
                                }[oriState]
                            }
                        />:''
                    }
                    <div className="edit-running-modal-list-item" style={{display:propertyPay !== 'SX_GZXJ' && insertOrModify === 'insert'?'':'none'}}>
                        <label>实际{`${actualAmount<0?'收款':'支付'}`}金额：</label>
                        {formatMoney(Math.abs(actualAmount || 0))}
                    </div>
                    <div className="edit-running-modal-list-item" style={{display:propertyPay == 'SX_GZXJ' && insertOrModify === 'modify' && beAccrued?'':'none'}}>
                        <label>核销总金额：</label>
                        {formatMoney(Number(personAccumulationAmount || 0) + Number(personSocialSecurityAmount || 0) + Number(incomeTaxAmount || 0))}
                    </div>
                    <div className="edit-running-modal-list-item" style={{display:propertyPay === 'SX_GZXJ' && insertOrModify === 'insert'?'':'none'}}>
                        <label>工资薪金合计：</label>
                        {formatMoney(amount)}
                    </div>
                </div>
                {
                    oriState === 'STATE_XC_JN'?
                        <AccountComp
                            accountList={accountList}
                            accounts={accounts}
                            dispatch={dispatch}
                            isCheckOut={isCheckOut}
                            oriTemp={oriTemp}
                            amount={
                                {
                                    'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                    'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                        beWithholdSocial?
                                        actualAmount:amount
                                        :
                                        beWithholding?
                                        actualAmount:amount}`,
                                }[oriState]
                            }
                        />:''
                }
                {
                    (oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF') && (amount < 0 || totalNotHandleAmount < 0 || actualAmount < 0) &&
                    oriState === 'STATE_XC_JN' ?
                    <AccountPandge
                        accounts={accounts}
                        dispatch={dispatch}
                        accountPoundage={accountPoundage}
                        oriTemp={oriTemp}
                        poundage={poundage}
                        projectList={projectList}
                        accountContactsRangeList={accountContactsRangeList}
                        accountProjectList={accountProjectList}
                        accountProjectRange={accountProjectRange}
                        accountContactsRange={accountContactsRange}
                        insertOrModify={insertOrModify}
                        amount={
                            {
                                'STATE_XC_FF':`${propertyPay === 'SX_GZXJ' && beAccrued?actualAmount:amount}`,
                                'STATE_XC_JN':`${propertyPay === 'SX_SHBX'?
                                    beWithholdSocial?
                                    actualAmount:amount
                                    :
                                    beWithholding?
                                    actualAmount:amount}`,
                            }[oriState]
                        }
                    />:''
                }

                {
                    (beAccrued || beWelfare) && (oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_DK') && pendingStrongList.size?
                        <HandlingList
                            titleList={['日期','流水号','摘要','类型','流水金额','待支付金额']}
                            pendingStrongList={pendingStrongList}
                            stateName={`计提${propertyPay==='SX_GZXJ'?'工资薪金':propertyPay==='SX_SHBX'?'社会保险':propertyPay==='SX_GZXJ'?'公积金':'其他薪酬'}`}
                            modify={insertOrModify === 'modify'}
                            dispatch={dispatch}
                            listTitle={totalNotHandleAmount < 0 ? `待处理收款金额：`:'待处理付款金额：'}
                            extraFunc={
                                 {
                                     'SX_GZXJ':(totalNotHandleAmount) => {
                                         if (oriState !== 'STATE_XC_DK') {
                                             dispatch(editRunningActions.autoCalculateAmount())
                                         }
                                     },
                                     'SX_SHBX':(totalNotHandleAmount) => {
                                         if (oriState !== 'STATE_XC_DJ') {
                                             beWithholdSocial?
                                             dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','companySocialSecurityAmount'],Math.abs(totalNotHandleAmount).toFixed(2)))
                                             :
                                             dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',Math.abs(totalNotHandleAmount).toFixed(2)))
                                             dispatch(editRunningActions.autoCalculateAmount())
                                        }
                                     },
                                     'SX_ZFGJJ':(totalNotHandleAmount) => {
                                         if (oriState !== 'STATE_XC_DJ') {
                                             beWithholding?
                                             dispatch(editRunningActions.changeLrAccountCommonString('ori',['payment','companyAccumulationAmount'],Math.abs(totalNotHandleAmount).toFixed(2)))
                                             :
                                             dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',Math.abs(totalNotHandleAmount).toFixed(2)))
                                             dispatch(editRunningActions.autoCalculateAmount())
                                        }
                                     }
                                 }[propertyPay]
                            }
                        />:''
                }
                {
                    insertOrModify === 'modify' && strongList.size?
                    <DisplayHandlingList
                        titleList={['日期','流水号','摘要','类型','金额']}
                        strongList={strongList}
                        modify={insertOrModify === 'modify'}
                        dispatch={dispatch}
                        amount={amount}
                        oriState={oriState}
                        notHandleAmount={notHandleAmount}
                    />:''
                }
            </div>
        )
    }
}

import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { Checkbox } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, JtHoc } from '../common/common'
import Project from '../Project'
import AccountComp from '../AccountComp'
import HandlingList from '../HandlingList'
import DisplayHandlingList from '../DisplayHandlingList'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@JtHoc('Vat')
@immutableRenderDecorator
export default
class Sfzc extends React.Component {
    componentWillReceiveProps(nextprops) {
        const { oriTemp, categoryTypeObj } = this.props
        const insertOrModify = nextprops.insertOrModify
        const oriDate = oriTemp.get('oriDate')
        const newOriDate = nextprops.oriTemp.get('oriDate')
        const oriState = nextprops.oriTemp.get('oriState')
        const beInAdvance = nextprops.oriTemp.getIn([categoryTypeObj,'beInAdvance'])
        if (beInAdvance && oriDate !== newOriDate) {
            this.props.dispatch(editRunningActions.getJrVatPrepayList(newOriDate))
        }
        if (oriState == 'STATE_SF_ZCWJZZS' && oriDate !== newOriDate && insertOrModify === 'insert') {
            this.props.dispatch(editRunningActions.getTransferAmount(newOriDate))
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
            moduleInfo
        } = this.props
        const projectCardList = oriTemp.get('projectCardList')|| fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount') || 0
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const payableAmount = oriTemp.get('payableAmount')
        const beReduceTax = oriTemp.get('beReduceTax')
        const beReduce = oriTemp.getIn([categoryTypeObj,'beReduce'])
        const beAccrued = oriTemp.getIn([categoryTypeObj,'beAccrued'])
        const beInAdvance = oriTemp.getIn([categoryTypeObj,'beInAdvance'])
        const offsetAmount = oriTemp.get('offsetAmount') || 0
        const propertyTax = oriTemp.get('propertyTax')
        const strongList = oriTemp.get('strongList')
        const dikouAmount = oriTemp.get('dikouAmount')
        const transferAmount = oriTemp.get('transferAmount')
        const personTaxAmount = oriTemp.get('personTaxAmount')
        const pendingStrongList = oriTemp.get('pendingStrongList') || fromJS([])
        const reduceAmount = oriTemp.get('reduceAmount') || 0
        const notHandleAmount = oriTemp.get('notHandleAmount') || 0
        const showSingleModal = flags.get('showSingleModal')
        const currentProjectCardList = oriTemp.get('currentProjectCardList')
        return(
            <div>
                {
                    usedProject && insertOrModify === 'modify' && currentProjectCardList.size || beProject && (insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && (oriState === 'STATE_SF_JT' || !beAccrued && oriState === 'STATE_SF_JN' && propertyTax !== 'SX_ZZS')?
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
                <div style={{display:propertyTax === 'SX_ZZS' && oriState === 'STATE_SF_JN' && (insertOrModify === 'insert' || insertOrModify === 'modify' && offsetAmount > 0) ?'':'none'}}>
                    <div className="accountConf-separator"></div>
                    <div className="edit-running-modal-list-item">
                        <div className='input-right-amount'>
                            <span style={{margin:0}}>处理税费：{formatMoney(Number(offsetAmount) + Number(amount) + (beReduceTax && reduceAmount ? Number(reduceAmount):0))}</span>
                        </div>
                    </div>
                </div>
                <div className="edit-running-modal-list-item" style={{display:oriState === 'STATE_SF_JN' && beInAdvance&& (dikouAmount>0 || insertOrModify === 'modify' && offsetAmount > 0) ?'':'none'}}>
                    <label>预交抵扣金额：</label>
                    <div style={{display:'flex'}}>
                        <Input
                            style={{flex:1}}
                            value={offsetAmount || ''}
                            onChange={(e) => {
                                numberTest(e, (value) => dispatch(editRunningActions.changeLrAccountCommonString('ori', 'offsetAmount', value)))

                            }}
                        />
                        <div className='dikou-content'>
                            <label>待抵扣：</label>
                            <div>{formatMoney(dikouAmount)}</div>
                        </div>
                    </div>
                </div>
                <div className="edit-running-modal-list-item" style={{display:oriState !== 'STATE_SF_SFJM'?'':'none'}}>
                    <label>{`${propertyTax === 'SX_ZZS' && oriState === 'STATE_SF_JN'?'支付':''}金额：`}</label>
                    {
                        (beProject && usedProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && projectCardList.size > 1 ?
                            <div>{formatMoney(amount)}</div>
                            :
                            <Input
                                placeholder=""
                                value={amount || ''}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                        if (projectCardList.size === 1) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                        }
                                    })
                                }}
                            />
                    }
                    {
                        oriState === 'STATE_SF_ZCWJZZS' && insertOrModify === 'insert' && transferAmount > 0?
                        <div className='dikou-content'>
                            <label>待转增值税：</label>
                            <div>{formatMoney(transferAmount)}</div>
                        </div>:''
                    }
                    {
                        propertyTax === 'SX_GRSF' && payableAmount>0?
                        <div className='dikou-content'>
                            <label>待核销税费：</label>
                            <div>{formatMoney(payableAmount)}</div>
                        </div>:''
                    }
                </div>
                {
                    oriState !== 'STATE_SF_JT' && oriState !== 'STATE_SF_SFJM' && oriState !== 'STATE_SF_ZCWJZZS' && amount > 0?
                    <AccountComp
                        accountList={accountList}
                        accounts={accounts}
                        dispatch={dispatch}
                        isCheckOut={isCheckOut}
                        oriTemp={oriTemp}
                    />:''
                }
                {
                    personTaxAmount && insertOrModify === 'modify'?
                    <div className='extra-dikou'>
                        {`其中个税代扣抵扣： ${formatMoney(personTaxAmount)}`}
                    </div>:''
                }
                <div>
                    <div className="edit-running-modal-list-item" style={{display:beReduce && oriState === 'STATE_SF_JN' && insertOrModify === 'insert'? '' : 'none'}}>
                        <label>
                            <Checkbox
                                checked={beReduceTax}
                                onChange={(e) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','beReduceTax', e.target.checked))
                                }}
                            />
                            <span>
                                税费减免
                            </span>
                        </label>
                    </div>
                    <div>
                        <div className="edit-running-modal-list-item" style={{display:beReduceTax && insertOrModify === 'insert' || insertOrModify === 'modify' && oriState === 'STATE_SF_SFJM'?'':'none'}}>
                            <label>{`减免金额：`}</label>
                            <Input
                                placeholder=""
                                value={(insertOrModify === 'insert'?reduceAmount:amount) || ''}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        if (insertOrModify === 'modify' && oriState === 'STATE_SF_SFJM') {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                        } else {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','reduceAmount',value))
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
                {
                    (propertyTax === 'SX_ZZS' || beAccrued) && (oriState === 'STATE_SF_JN' || oriState === 'STATE_SF_SFJM') && (insertOrModify === 'insert' || insertOrModify === 'modify' && pendingStrongList.size)?
                        <HandlingList
                            titleList={['日期','流水号','摘要','类型','流水金额',`${propertyTax === 'SX_ZZS'?'待处理税费':'待支付金额'}`]}
                            pendingStrongList={pendingStrongList}
                            modify={insertOrModify === 'modify'}
                            dispatch={dispatch}
                            listTitle={'待处理付款金额：'}
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

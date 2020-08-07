import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { message, Switch } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from '../common/common'
import Project from '../Project'
import AccountComp from '../AccountComp'
import AccountPandge from '../AccountPandge'
import Management from '../Management'
import Invoice from '../Invoice'
import MultiAccountComp from '../MultiAccountComp'
import DisplayHandlingList from '../DisplayHandlingList'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Fyzc extends React.Component {
    componentWillReceiveProps(nextprops) {
        const { oriTemp, categoryTypeObj } = this.props
        const oriDate = oriTemp.get('oriDate')
        const oriState = oriTemp.get('oriState')
        const newOriDate = nextprops.oriTemp.get('oriDate')
        const categoryUuid = nextprops.oriTemp.get('categoryUuid')
        const newOriState = nextprops.oriTemp.get('oriState')
        const cardUuid = oriTemp.getIn(['currentCardList',0,'cardUuid'])
        const newCardUuid = nextprops.oriTemp.getIn(['currentCardList',0,'cardUuid'])
        const beManagemented = nextprops.oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const insertOrModify = nextprops.insertOrModify
        if (beManagemented
        && (oriDate !== newOriDate
        || cardUuid !== newCardUuid && newCardUuid || oriState !== newOriState && newOriState) && insertOrModify === 'insert') {
            this.props.dispatch(editRunningActions.getYyszPreAmount({categoryUuid,oriDate:newOriDate,cardUuid:newCardUuid,oriState:newOriState}))
        }
    }
    render() {
        const {
            oriTemp,
            taxRateTemp,
            accountList,
            projectList,
            contactsList,
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
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount')
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const currentCardList = oriTemp.get('currentCardList')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const strongList = oriTemp.get('strongList')
        const currentAmount = oriTemp.get('currentAmount')
        const usedCurrent = oriTemp.get('usedCurrent')
        const showSingleModal = flags.get('showSingleModal')
        const allGetFlow = Math.abs(amount) === Math.abs(currentAmount)
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
        const selectedKeys = flags.get('selectedKeys')
        const currentCardType = flags.get('currentCardType')
        const preAmount = oriTemp.get('preAmount')
        const payableAmount = oriTemp.get('payableAmount')
        const offsetAmount = oriTemp.get('offsetAmount')
        const usedAccounts = oriTemp.get('usedAccounts')
        const poundage = flags.get('poundage')
        const accountContactsRangeList = flags.get('accountContactsRangeList')
        const accountProjectList = flags.get('accountProjectList')
        const accountProjectRange = flags.get('accountProjectRange')
        const accountContactsRange = flags.get('accountContactsRange')
        return(
            <div>
                {
                    usedCurrent?
                        <Management
                            currentCardList={currentCardList}
                            dropManageFetchAllowed={dropManageFetchAllowed}
                            contactsList={contactsList}
                            oriState={oriState}
                            contactsRange={contactsRange}
                            dispatch={dispatch}
                            categoryTypeObj={categoryTypeObj}
                            selectedKeys={selectedKeys}
                            showSingleModal={showSingleModal}
                            MemberList={MemberList}
                            selectThingsList={selectThingsList}
                            insertOrModify={insertOrModify}
                            thingsList={thingsList}
                            contactsManagement={contactsManagement}
                            strongList={strongList}
                            currentCardType={currentCardType}
                            flags={flags}
                        />:''
                }
                {
                    beProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify'?
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


                <div className="edit-running-modal-list-item">
                    <label>{`${oriState === 'STATE_FY_DJ'?'预付':''}金额：`}</label>
                    {
                        (beProject && usedProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && projectCardList.size > 1 ?
                            <div>
                                {formatMoney(amount)}
                                {
                                    insertOrModify === 'insert' && amount > 0 || insertOrModify === 'modify' && allGetFlow && amount > 0?
                                    <Switch
                                        className="use-unuse-style"
                                        style={{marginLeft:'.2rem',minWidth: '69px',width: '69px',float: 'right'}}
                                        checked={usedAccounts}
                                        checkedChildren={'多账户'}
                                        unCheckedChildren={'多账户'}
                                        onChange={() => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','usedAccounts',!usedAccounts))
                                            if (!usedAccounts) {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori','offsetAmount',''))
                                                beManagemented && dispatch(editRunningActions.calculateCurAmount())
                                            }
                                        }}
                                    />:''
                                }
                            </div>
                            :
                            <div style={{display:'flex'}}>
                                <Input
                                    placeholder=""
                                    value={amount}
                                    onChange={(e) => {
                                        numberTest(e,value => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                            if (value <= 0) {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori','usedAccounts',false))
                                            }
                                            if (projectCardList.size === 1) {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                            }
                                        },oriState === 'STATE_FY_DJ'?false:true)
                                    }}
                                />
                                {
                                    insertOrModify === 'insert' && amount > 0 || insertOrModify === 'modify' && allGetFlow && amount > 0?
                                    <Switch
                                        className="use-unuse-style"
                                        style={{marginLeft:'.2rem',minWidth: '69px',width: '69px',float: 'right'}}
                                        checked={usedAccounts}
                                        checkedChildren={'多账户'}
                                        unCheckedChildren={'多账户'}
                                        onChange={() => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','usedAccounts',!usedAccounts))
                                            if (!usedAccounts) {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori','offsetAmount',''))
                                                beManagemented && dispatch(editRunningActions.calculateCurAmount())
                                            }
                                        }}
                                    />:''
                                }
                            </div>
                    }
                </div>
                {
                !usedAccounts && (oriState ==='STATE_FY'
                && beManagemented
                && insertOrModify === 'insert'
                && (preAmount > 0 && (!amount || amount > 0) || payableAmount > 0 && amount < 0))?
                    <div>
                        <div className="edit-running-modal-list-item">

                                <div className="edit-running-premount">
                                    <label></label>
                                    <label>{`预付款：`}</label>
                                    <div>
                                        {oriTemp.get('preAmount') }
                                    </div>
                                    <label>{`应付款：`}</label>
                                    <div>
                                        {oriTemp.get('payableAmount')}
                                    </div>
                                </div>
                        </div>
                        <div className="edit-running-modal-list-item">
                            <label>{`${amount>=0 || !amount?'预':'应'}付抵扣：`}</label>
                            <div>
                                <Input
                                    value={offsetAmount}
                                    onChange={(e) => {
                                        numberTest(e,(value) => dispatch(editRunningActions.changeLrAccountCommonString('ori', 'offsetAmount', value)))

                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                {
                    !usedAccounts && beManagemented && oriState === 'STATE_FY' && insertOrModify === 'insert' ?
                        <div className="edit-running-modal-list-item">
                            <label>本次{amount<0?'收':'付'}款：</label>
                            <Input
                                placeholder=""
                                value={currentAmount}
                                onFocus={() => {
                                    const curAmount = Math.abs(amount || 0) - Math.abs(offsetAmount || 0) > 0 ? Math.abs(amount || 0) - Math.abs(offsetAmount || 0).toFixed(2) : ''
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',curAmount))

                                }}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',value))
                                    })
                                }}
                            />
                        </div>:''
                }
                {
                    !usedAccounts && (oriState === 'STATE_FY_DJ' ||
                    beManagemented && currentAmount != 0 && currentAmount
                    && (insertOrModify === 'modify' && allGetFlow || insertOrModify === 'insert') || !beManagemented)?
                        <AccountComp
                            accountList={accountList}
                            accounts={accounts}
                            dispatch={dispatch}
                            isCheckOut={isCheckOut}
                            oriTemp={oriTemp}
                            amount={beManagemented?currentAmount:amount}
                        />:''
                }
                {
                    usedAccounts && amount > 0?
                    <MultiAccountComp
                        accountList={accountList}
                        accounts={accounts}
                        dispatch={dispatch}
                        isCheckOut={isCheckOut}
                        beManagemented={beManagemented}
                        oriTemp={oriTemp}
                        insertOrModify={insertOrModify}
                        amount={amount}
                    />:''
                }
                {
                    oriState === 'STATE_FY' && amount < 0 ?
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
                        amount={beManagemented?currentAmount:amount}
                    />:''
                }
                {
                    oriState === 'STATE_FY'?
                    <Invoice
                        dispatch={dispatch}
                        flags={flags}
                        oriTemp={oriTemp}
                        taxRateTemp={taxRateTemp}
                        insertOrModify={insertOrModify}
                    />:''
                }
                {
                    insertOrModify === 'modify' && beManagemented && !allGetFlow?
                    <DisplayHandlingList
                        titleList={['日期','流水号','摘要','类型','金额']}
                        strongList={strongList}
                        modify={insertOrModify === 'modify'}
                        dispatch={dispatch}
                        amount={amount}
                    />:''
                }
            </div>
        )
    }
}

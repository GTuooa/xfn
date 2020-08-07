import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import XfInput from 'app/components/XfInput'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from '../common/common'
import Project from '../Project'
import AccountComp from '../AccountComp'
import Management from '../Management'
import Invoice from '../Invoice'
import AccountPandge from '../AccountPandge'
import DisplayHandlingList from '../DisplayHandlingList'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Yywsr extends React.Component {
    render() {
        const {
            oriTemp,
            accountList,
            projectList,
            contactsList,
            dispatch,
            flags,
            categoryTypeObj,
            MemberList,
            selectThingsList,
            thingsList,
            insertOrModify,
            isCheckOut,
            taxRateTemp,
            moduleInfo,
            accountPoundage
        } = this.props
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount')
        const currentAmount = oriTemp.get('currentAmount')
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const taxRate = oriTemp.get('taxRate')
        const currentCardList = oriTemp.get('currentCardList')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const oriState = oriTemp.get('oriState')
        const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const usedCurrent = oriTemp.get('usedCurrent')
        const strongList = oriTemp.get('strongList')
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
        const showSingleModal = flags.get('showSingleModal')
        const allGetFlow = Math.abs(amount) === Math.abs(currentAmount)
        const currentCardType = flags.get('currentCardType')
        const selectedKeys = flags.get('selectedKeys')
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
                            showSingleModal={showSingleModal}
                            MemberList={MemberList}
                            selectThingsList={selectThingsList}
                            insertOrModify={insertOrModify}
                            thingsList={thingsList}
                            contactsManagement={contactsManagement}
                            strongList={strongList}
                            currentCardType={currentCardType}
                            selectedKeys={selectedKeys}
                            flags={flags}
                        />:''
                }
                {
                    (beProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify')?
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
                    <label>金额：</label>
                    {
                        (beProject && usedProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && projectCardList.size > 1 ?
                            <div>{formatMoney(amount)}</div>
                            :
                            <XfInput
                                mode='amount'
                                negativeAllowed
                                placeholder=""
                                value={amount}
                                onChange={(e) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',e.target.value))
                                    if (projectCardList.size === 1) {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],e.target.value))
                                    }
                                }}
                            />
                    }
                </div>
                {
                    beManagemented  && insertOrModify === 'insert'?
                        <div className="edit-running-modal-list-item">
                            <label>{amount<0?'本次收款：':'本次付款：'}</label>
                            <XfInput
                                mode='amount'
                                placeholder=""
                                value={currentAmount}
                                onFocus={() => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',Math.abs(amount) || ''))

                                }}
                                onChange={(e) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',e.target.value))
                                    if (projectCardList.size === 1) {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],e.target.value))
                                    }
                                }}
                            />
                        </div>:''
                }
                {
                    beManagemented && currentAmount > 0
                    && (insertOrModify === 'modify' && allGetFlow || insertOrModify === 'insert') || !beManagemented?
                        <AccountComp
                            accountList={accountList}
                            accounts={accounts}
                            dispatch={dispatch}
                            isCheckOut={isCheckOut}
                            oriTemp={oriTemp}
                        />:''
                }
                {
                    amount < 0 ?
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
                <Invoice
                    dispatch={dispatch}
                    flags={flags}
                    oriTemp={oriTemp}
                    taxRateTemp={taxRateTemp}
                    insertOrModify={insertOrModify}
                />
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

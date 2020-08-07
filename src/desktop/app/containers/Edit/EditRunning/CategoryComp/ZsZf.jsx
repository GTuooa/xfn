import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, JtHoc } from '../common/common'
import Project from '../Project'
import AccountPandge from '../AccountPandge'
import AccountComp from '../AccountComp'
import HandlingList from '../HandlingList'
import DisplayHandlingList from '../DisplayHandlingList'
import Management from '../Management'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@JtHoc('Temporary')
@immutableRenderDecorator
class ZsZf extends React.Component {
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
            insertOrModify,
            isCheckOut,
            contactsList,
            categoryTypeObj,
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
        const usedCurrent = oriTemp.get('usedCurrent')
        const pendingStrongList = oriTemp.get('pendingStrongList') || fromJS([])
        const strongList = oriTemp.get('strongList') || fromJS([])
        const showSingleModal = flags.get('showSingleModal')
        const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const currentCardList = oriTemp.get('currentCardList')
        const categoryType = oriTemp.get('categoryType')
        const cardAllList = oriTemp.get('cardAllList')
        const categoryUuid = oriTemp.get('categoryUuid')
        const condition = oriTemp.get('condition')
        const oriDate = oriTemp.get('oriDate')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
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
                    usedCurrent && (oriState === 'STATE_ZS_SQ' || oriState === 'STATE_ZF_FC')?
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
                            categoryType={categoryType}
                            flags={flags}
                        />:''
                }
                {
                    (oriState === 'STATE_ZS_SQ' || oriState === 'STATE_ZF_FC') && (beProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify')?
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
                            <Input
                                placeholder=""
                                value={amount}
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
                </div>
                <AccountComp
                    accountList={accountList}
                    accounts={accounts}
                    dispatch={dispatch}
                    isCheckOut={isCheckOut}
                    oriTemp={oriTemp}
                />
                {
                    oriState === 'STATE_ZS_SQ' || oriState === 'STATE_ZF_SH'?
                    <AccountPandge
                        accounts={accounts}
                        dispatch={dispatch}
                        accountPoundage={accountPoundage}
                        oriTemp={oriTemp}
                        contactsList={contactsList}
                        contactsRange={contactsRange}
                        poundage={poundage}
                        projectList={projectList}
                        accountContactsRangeList={accountContactsRangeList}
                        accountProjectList={accountProjectList}
                        accountProjectRange={accountProjectRange}
                        accountContactsRange={accountContactsRange}
                        insertOrModify={insertOrModify}
                    />:''
                }
                {
                    oriState === 'STATE_ZS_TH' || oriState === 'STATE_ZF_SH' && (insertOrModify === 'insert' || insertOrModify === 'modify' && pendingStrongList.size)?
                        <HandlingList
                            titleList={['日期','流水号','摘要','类型','流水金额',`待核销${oriState === 'STATE_ZS_TH'?'付':'收'}款金额`]}
                            pendingStrongList={pendingStrongList}
                            stateName={oriState === 'STATE_ZS_TH'?'暂收款项':'暂付款项'}
                            modify={insertOrModify === 'modify'}
                            dispatch={dispatch}
                            listTitle={oriState === 'STATE_ZS_TH'?'待处理付款金额：':'待处理收款金额：'}
                            currentCardList={currentCardList}
                            dropManageFetchAllowed={dropManageFetchAllowed}
                            insertOrModify={insertOrModify}
                            strongList={strongList}
                            oriState={oriState}
                            contactsRange={contactsRange}
                            contactsList={contactsList}
                            categoryUuid={categoryUuid}
                            categoryType={categoryType}
                            contactsManagement={contactsManagement}
                            cardAllList={cardAllList}
                            condition={condition}
                            oriDate={oriDate}
                        />:''
                }
                {
                    insertOrModify === 'modify' && (oriState === 'STATE_ZF_FC' || oriState === 'STATE_ZS_SQ')?
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
export default ZsZf

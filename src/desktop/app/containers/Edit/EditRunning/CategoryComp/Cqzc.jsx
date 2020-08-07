import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import Input from 'app/components/Input'
import { Checkbox, Switch, message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from '../common/common'
import Project from '../Project'
import AccountPandge from '../AccountPandge'
import AccountComp from '../AccountComp'
import Management from '../Management'
import Invoice from '../Invoice'
import CarrayoverRunning from '../CarrayoverRunning'
import DisplayHandlingList from '../DisplayHandlingList'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Cqzc extends React.Component {
    render() {
        const {
            oriTemp,
            accountList,
            contactsList,
            projectList,
            dispatch,
            flags,
            categoryTypeObj,
            taxRateTemp,
            MemberList,
            selectThingsList,
            thingsList,
            insertOrModify,
            accountPoundage,
            isCheckOut,
            moduleInfo
        } = this.props
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount')
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const categoryType = oriTemp.get('categoryType')
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const currentAmount = oriTemp.get('currentAmount')
        const currentCardList = oriTemp.get('currentCardList')
        const carryoverStrongList = oriTemp.get('carryoverStrongList')
        const strongList = oriTemp.get('strongList')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const beCleaning = oriTemp.getIn([categoryTypeObj,'beCleaning'])
        const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const originalAssetsAmount = oriTemp.getIn(['assets','originalAssetsAmount'])
        const depreciationAmount = oriTemp.getIn(['assets','depreciationAmount'])
        const netProfitAmount = oriTemp.getIn(['assets','netProfitAmount'])
        const lossAmount = oriTemp.getIn(['assets','lossAmount'])
        const cleaningAmount = oriTemp.getIn(['assets','cleaningAmount'])
        const beCleaningOut = oriTemp.get('beCleaning')
        const handleType = oriTemp.get('handleType')
        const projectRange = oriTemp.get('projectRange')
        const allProjectRange = oriTemp.get('allProjectRange')
        const showSingleModal = flags.get('showSingleModal')
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
        const selectedKeys = flags.get('selectedKeys')
        const usedCurrent = oriTemp.get('usedCurrent')
        const allGetFlow = Math.abs(amount) === Math.abs(currentAmount)
        const currentCardType = flags.get('currentCardType')
        const poundage = flags.get('poundage')
        const accountContactsRangeList = flags.get('accountContactsRangeList')
        const accountProjectList = flags.get('accountProjectList')
        const accountProjectRange = flags.get('accountProjectRange')
        const accountContactsRange = flags.get('accountContactsRange')
        return(
            <div style={{display:oriState === 'STATE_CQZC_JZSY'?'none':''}}>
                {
                    usedCurrent && handleType?
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
                        thingsList={thingsList}
                        insertOrModify={insertOrModify}
                        strongList={strongList}
                        carryoverStrongList={carryoverStrongList}
                        contactsManagement={contactsManagement}
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
                        projectRange={fromJS([allProjectRange.find(w => w.get('name') === '损益项目').get('uuid')])}
                    />:''
                }

                <div className="edit-running-modal-list-item">
                    <label>金额：</label>
                    <Input
                        placeholder=""
                        value={amount}
                        onChange={(e) => {
                            numberTest(e,(value) => {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                if (projectCardList.size === 1) {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                }
                                beCleaningOut && beProject && dispatch(editRunningActions.calculateGain())
                            },true)
                        }}
                    />
                </div>
                {
                    beManagemented  && insertOrModify === 'insert'?
                    <div className="edit-running-modal-list-item">
                            <label>{`本次${handleType === 'JR_HANDLE_GJ'?amount<0?'收':'付':amount<0?'付':'收'}款：`}</label>
                        <Input
                            placeholder=""
                            value={currentAmount}
                            onFocus={() => {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',Math.abs(amount || '')))

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
                    beManagemented && currentAmount != 0 && currentAmount
                    && (insertOrModify === 'modify' && allGetFlow || insertOrModify === 'insert') || !beManagemented?
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
                    handleType === 'JR_HANDLE_GJ' && amount < 0 || handleType === 'JR_HANDLE_CZ' ?
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
                <Invoice
                    dispatch={dispatch}
                    flags={flags}
                    oriTemp={oriTemp}
                    taxRateTemp={taxRateTemp}
                    insertOrModify={insertOrModify}
                />
                {/* 处置损益 */}
                {
                    beCleaning && handleType ==='JR_HANDLE_CZ' || oriState === 'STATE_CQZC_JZSY' ?
                    <div>
                        <div className="edit-running-modal-list-item" style={{display:insertOrModify === 'insert'? '' : 'none'}}>
                            <label>
                                <Checkbox
                                    checked={beCleaningOut}
                                    onChange={(e) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','beCleaning', e.target.checked))
                                        e.target.checked && dispatch(editRunningActions.calculateGain())
                                    }}
                                />
                            <span>
                                处置损益
                            </span>
                            </label>
                        </div>
                        {
                            beCleaningOut ?
                            <div >
                                    {
                                         netProfitAmount >= 0?
                                        <div className="edit-running-modal-list-item">
                                            <label>净收益金额：</label>
                                            <div>
                                                    {netProfitAmount}
                                            </div>
                                        </div>
                                        :
                                        (
                                            lossAmount > 0?
                                            <div className="edit-running-modal-list-item">
                                                <label>净损失金额：</label>
                                                <div>
                                                        {lossAmount}
                                                </div>
                                            </div>
                                            :
                                            ''
                                        )
                                    }
                                    <div className="edit-running-modal-list-item">
                                        <label>资产原值：</label>
                                        <div>
                                            <Input
                                                value={originalAssetsAmount}
                                                onChange={(e) => {
                                                    numberTest(e,(value) => {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['assets','originalAssetsAmount'], value))
                                                        dispatch(editRunningActions.calculateGain())

                                                    })
                                                }}

                                            />
                                        </div>
                                    </div>
                                    <div className="edit-running-modal-list-item">
                                        <label>累计折旧余额：</label>
                                        <div>
                                            <Input
                                                value={depreciationAmount}
                                                onChange={(e) => {
                                                    numberTest(e,(value) => {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['assets','depreciationAmount'], value))
                                                        dispatch(editRunningActions.calculateGain())

                                                    })
                                                }}

                                            />
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        </div>
                        :
                        null
                    }
                    {/* {
                       beCleaning  && oriState !== 'STATE_CQZC_JZSY'  && insertOrModify === 'modify' && handleType === 'JR_HANDLE_CZ'?
                        <div style={{marginBottom:'10px'}}>
                            <Button
                                type="ghost"
                                onClick={() => {
                                    dispatch(editRunningActions.AsssetsInsert())
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','oriState', 'STATE_CQZC_JZSY'))
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','beCarryover', true))
                                    dispatch(editRunningActions.calculateGain())
                                    dispatch(editRunningActions.changeStateAndAbstract(fromJS(oriTemp),'STATE_CQZC_JZSY'))

                                }}
                                >
                                处置损益
                            </Button>
                        </div>

                        :
                        null
                 } */}
                 {
                     insertOrModify === 'modify' && handleType === 'JR_HANDLE_CZ' && carryoverStrongList.size ?
                     <CarrayoverRunning
                         title={'处置结转流水：'}
                         strongList={carryoverStrongList}
                         dispatch={dispatch}
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

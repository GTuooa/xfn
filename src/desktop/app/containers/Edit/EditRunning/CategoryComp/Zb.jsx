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
import AccountComp from '../AccountComp'
import HandlingList from '../HandlingList'
import AccountPandge from '../AccountPandge'
import DisplayHandlingList from '../DisplayHandlingList'
import Management from '../Management'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@JtHoc('Capital')
@immutableRenderDecorator
export default
class Zb extends React.Component {
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
            categoryTypeObj,
            contactsList,
            accountPoundage,
        } = this.props
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const amount = oriTemp.get('amount')
        const accounts = oriTemp.get('accounts')
        const beAccrued = oriTemp.getIn(['acCapital','beAccrued'])
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const strongList = oriTemp.get('strongList')
        const pendingStrongList = oriTemp.get('pendingStrongList') || fromJS([])
        const showSingleModal = flags.get('showSingleModal')
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const currentCardList = oriTemp.get('currentCardList')
        const categoryType = oriTemp.get('categoryType')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
        const currentCardType = flags.get('currentCardType')
        const usedCurrent = oriTemp.get('usedCurrent')
        const curcurrentCardList = oriTemp.get('curcurrentCardList')
        const handleType = oriTemp.get('handleType')
        const selectedKeys = flags.get('selectedKeys')
        const poundage = flags.get('poundage')
        const accountContactsRangeList = flags.get('accountContactsRangeList')
        const accountProjectList = flags.get('accountProjectList')
        const accountProjectRange = flags.get('accountProjectRange')
        const accountContactsRange = flags.get('accountContactsRange')
        return(
            <div>
                {
                    usedCurrent && ((oriState !== 'STATE_ZB_ZFLR' && beAccrued || !beAccrued) || insertOrModify === 'modify' && curcurrentCardList.size)?
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
                                })
                            }}
                        />
                </div>
                {
                    oriState !== 'STATE_ZB_LRFP'?
                    <AccountComp
                        accountList={accountList}
                        accounts={accounts}
                        dispatch={dispatch}
                        isCheckOut={isCheckOut}
                        oriTemp={oriTemp}
                    />:''
                }
                {
                    handleType === 'JR_HANDLE_ZZ' ?
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
                    />:''
                }
                {
                    beAccrued && oriState === 'STATE_ZB_ZFLR' && (insertOrModify === 'insert' || insertOrModify === 'modify' && pendingStrongList.size)?
                        <HandlingList
                            titleList={['日期','流水号','摘要','类型','流水金额','待处理金额']}
                            pendingStrongList={pendingStrongList}
                            stateName={'计提分配利润'}
                            modify={insertOrModify === 'modify'}
                            dispatch={dispatch}
                            listTitle={'待处理付款金额：'}
                        />:''
                }
                {
                    insertOrModify === 'modify' && beAccrued && oriState === 'STATE_ZB_LRFP'?
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

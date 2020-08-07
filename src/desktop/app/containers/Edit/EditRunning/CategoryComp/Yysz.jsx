import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Select, Divider, Icon, Checkbox, Switch, Tooltip } from 'antd'
const Option = Select.Option
import Input from 'app/components/Input'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, propertyName, disablePropertyFunc, projectCodeTest, projectTip,CommonProjectTest, filterCarryover } from '../common/common'
import Project from '../Project'
import Inventory from '../Inventory'
import AccountComp from '../AccountComp'
import AccountPandge from '../AccountPandge'
import MultiAccountComp from '../MultiAccountComp'
import DisplayHandlingList from '../DisplayHandlingList'
import Management from '../Management'
import Invoice from '../Invoice'
import CarrayoverRunning from '../CarrayoverRunning'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Yysz extends React.Component {
    componentDidMount() {
        // const { oriTemp, categoryTypeObj } = this.props
        // const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
    }
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
            accountList,
            projectList,
            contactsList,
            dispatch,
            flags,
            taxRateTemp,
            MemberList,
            selectThingsList,
            thingsList,
            stockList,
            warehouseList,
            insertOrModify,
            isCheckOut,
            enableWarehouse,
            openQuantity,
            accountPoundage,
            moduleInfo
        } = this.props
        const categoryType = oriTemp.get('categoryType')
        const {
            categoryTypeObj,
            direction,
		} = getCategorynameByType(categoryType)
        const projectCardList = oriTemp.get('projectCardList') || fromJS([])
        const usedProject = oriTemp.get('usedProject')
        const oriDate = oriTemp.get('oriDate')
        const oriUuid = oriTemp.get('oriUuid')
        const amount = oriTemp.get('amount')
        const accounts = oriTemp.get('accounts')
        const beProject = oriTemp.get('beProject')
        const taxRate = oriTemp.get('taxRate')
        const oriState = oriTemp.get('oriState')
        const currentAmount = oriTemp.get('currentAmount')
        const currentCardList = oriTemp.get('currentCardList')
        const stockStrongList = oriTemp.get('stockStrongList')
        const contactsRange = oriTemp.getIn([categoryTypeObj,'contactsRange'])
        const beCarryover = oriTemp.getIn([categoryTypeObj,'beCarryover'])
        const beCarryoverOut = oriTemp.get('beCarryover')
        const carryoverCardList = oriTemp.get('carryoverCardList') || fromJS([])
        const stockRange = oriTemp.getIn([categoryTypeObj,'stockRange']) || fromJS([])
        const beDeposited = oriTemp.getIn([categoryTypeObj,'beDeposited'])
        const pendingStrongList = oriTemp.get('pendingStrongList')
        const usedCurrent = oriTemp.get('usedCurrent')
        const strongList = oriTemp.get('strongList')
        const stockCardList = oriTemp.get('stockCardList')
        const offsetAmount = oriTemp.get('offsetAmount')
        const preAmount = oriTemp.get('preAmount')
        const payableAmount = oriTemp.get('payableAmount')
        const propertyCarryover = oriTemp.get('propertyCarryover')
        const usedStock = oriTemp.get('usedStock')
        const usedAccounts = oriTemp.get('usedAccounts')
        const relationCategoryName = oriTemp.get('relationCategoryName')
        const usedCarryoverProject = oriTemp.get('usedCarryoverProject')
        const relationBeProject = oriTemp.get('relationBeProject')
        const propertyCost = oriTemp.get('propertyCost')
        const relationCategoryType = oriTemp.get('relationCategoryType')
        const dropManageFetchAllowed = flags.get('dropManageFetchAllowed')
        const batchList = flags.get('batchList')
        const serialList = flags.get('serialList')
        const showSingleModal = flags.get('showSingleModal')
        const showStockModal = flags.get('showStockModal')
        const allGetFlow = Math.abs(amount) === Math.abs(currentAmount)
        const currentCardType = flags.get('currentCardType')
        const selectedKeys = flags.get('selectedKeys')
        const pageCount = flags.get('pageCount')
        const relationCategoryPropertyCostList = flags.get('relationCategoryPropertyCostList') || fromJS([])
        const accountContactsRangeList = flags.get('accountContactsRangeList')
        const selectItem = flags.get('selectItem')
        const selectList = flags.get('selectList')
        const accountProjectList = flags.get('accountProjectList')
        const accountProjectRange = flags.get('accountProjectRange')
        const accountContactsRange = flags.get('accountContactsRange')
        const poundage = flags.get('poundage')
        const carryoverCategoryList = flags.get('carryoverCategoryList') || fromJS([])
        const carryoverProjectList = flags.get('carryoverProjectList') || fromJS([])
        const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
        const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
        const beZeroInventory = oriTemp.getIn([categoryTypeObj, 'beZeroInventory'])
        const carryoverProjectCardList = oriTemp.get('carryoverProjectCardList') || fromJS([])
        const newCarryoverCardList = filterCarryover(carryoverCardList,beCarryover,insertOrModify,enableWarehouse)
        // const newCarryoverCardList = []
        let carryoverCategory = []
		const loop = data => data.map(item => {
			if (item.get('childList').size > 0) {
				loop(item.get('childList'))
			} else {
				carryoverCategory.push(item.toJS())
			}
		})
		loop(carryoverCategoryList)
        const disableProperty =  disablePropertyFunc(propertyCost)
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
                            thingsList={thingsList}
                            insertOrModify={insertOrModify}
                            strongList={strongList}
                            stockStrongList={stockStrongList}
                            contactsManagement={contactsManagement}
                            currentCardType={currentCardType}
                            selectedKeys={selectedKeys}
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
                {
                    (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && usedStock && (stockRange.size || insertOrModify === 'modify' && stockCardList.size) ) && oriState !== 'STATE_YYSR_DJ' && oriState !== 'STATE_YYZC_DJ'?
                        <Inventory
                            dispatch={dispatch}
                            stockCardList={stockCardList}
                            stockList={stockList}
                            oriState={oriState}
                            stockRange={stockRange}
                            amount={amount}
                            taxRate={taxRate}
                            showSingleModal={showSingleModal}
                            MemberList={MemberList}
                            selectThingsList={selectThingsList}
                            thingsList={thingsList}
                            flags={flags}
                            categoryTypeObj={categoryTypeObj}
                            carryoverCardList={carryoverCardList}
                            currentCardType={currentCardType}
                            selectedKeys={selectedKeys}
                            warehouseList={warehouseList}
                            insertOrModify={insertOrModify}
                            enableWarehouse={enableWarehouse}
                            openQuantity={openQuantity}
                            selectList={selectList}
                            showStockModal={showStockModal}
                            selectItem={selectItem}
                            oriDate={oriDate}
                            pageCount={pageCount}
                            batchList={batchList}
                            serialList={serialList}
                            oriUuid={oriUuid}
                        />
                        : ''
                }
                <div className="edit-running-modal-list-item">
                    <label>{`${(beProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && stockCardList.size > 1?'合计':''}${oriState === 'STATE_YYSR_DJ'?'预收':''}金额：`}</label>
                    {
                        (beProject && usedProject && insertOrModify === 'insert' || usedProject && insertOrModify === 'modify') && projectCardList.size > 1 || stockCardList.size > 1 ?
                            <div>
                                {formatMoney(amount)}
                                {
                                    (insertOrModify === 'insert' || insertOrModify === 'modify' && (allGetFlow || oriState === 'STATE_YYSR_DJ'|| oriState === 'STATE_YYZC_DJ'))
                                    && oriState !== 'STATE_YYSR_TS'
                                    && oriState !== 'STATE_YYZC_TG'?
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
                                className="lrls-account-box"
                                placeholder=""
                                value={amount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',value))
                                        if (projectCardList.size === 1) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                        }
                                        if (stockCardList.size === 1) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',0,'amount'], value))
                                        }
                                        if (stockCardList.size === 1 && stockCardList.getIn([0,'quantity']) > 0) {
                                            const price = ((value || 0) / stockCardList.getIn([0,'quantity'])).toFixed(2)
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',0,'price'], price))
                                        }
                                    })
                                }}
                            />
                            {
                                (insertOrModify === 'insert' || insertOrModify === 'modify' && (allGetFlow || oriState === 'STATE_YYSR_DJ'|| oriState === 'STATE_YYZC_DJ'))
                                && oriState !== 'STATE_YYSR_TS'
                                && oriState !== 'STATE_YYZC_TG' ?
                                <Switch
                                    className="use-unuse-style"
                                    style={{marginLeft:'.2rem',minWidth: '69px',width: '69px'}}
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
                !usedAccounts && ((oriState ==='STATE_YYSR_XS' || oriState ==='STATE_YYZC_GJ' || oriState ==='STATE_YYSR_TS' || oriState ==='STATE_YYZC_TG')
                && beManagemented
                && insertOrModify === 'insert'
                && ((oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYZC_GJ') && preAmount > 0 && beDeposited
                || (oriState === 'STATE_YYSR_TS' || oriState === 'STATE_YYZC_TG') && payableAmount > 0))?
                    <div>
                        <div className="edit-running-modal-list-item">

                                <div className="edit-running-premount">
                                    <label></label>
                                    <label>{`预${direction ==='debit'?'收':'付'}款：`}</label>
                                    <div>
                                        {oriTemp.get('preAmount') }
                                    </div>
                                    <label>{`应${direction ==='debit'?'收':'付'}款：`}</label>
                                    <div>
                                        {oriTemp.get('payableAmount')}
                                    </div>
                                </div>
                        </div>
                        <div className="edit-running-modal-list-item">
                            <label>{`${oriState ==='STATE_YYSR_XS' || oriState ==='STATE_YYZC_GJ'?'预':'应'}${oriState ==='STATE_YYSR_XS' || oriState ==='STATE_YYSR_TS'?'收':'付'}抵扣：`}</label>
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
                    !usedAccounts && beManagemented && insertOrModify === 'insert' && oriState !== 'STATE_YYSR_DJ' && oriState !== 'STATE_YYZC_DJ'?
                        <div className="edit-running-modal-list-item">
                            <label>{`本次${oriState === 'STATE_YYSR_XS'||oriState === 'STATE_YYZC_TG'?'收':'付'}款：`}</label>
                            <Input
                                placeholder=""
                                value={currentAmount}
                                onFocus={() => {
                                    let diffAmount = (amount || 0) - (offsetAmount || 0)
                                    diffAmount = diffAmount > 0 ? diffAmount.toFixed(2) : ''
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',diffAmount))

                                }}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','currentAmount',value))
                                        if (projectCardList.size === 1) {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['projectCardList', 0, 'amount'],value))
                                        }
                                    })
                                }}
                            />
                        </div>:''
                }
                {
                    !usedAccounts && ((oriState === 'STATE_YYSR_DJ' || oriState === 'STATE_YYZC_DJ') ||
                    beManagemented && currentAmount > 0
                    && (insertOrModify === 'modify' && allGetFlow || insertOrModify === 'insert') || !beManagemented && !strongList.size)?
                    <AccountComp
                        accountList={accountList}
                        accounts={accounts}
                        dispatch={dispatch}
                        isCheckOut={isCheckOut}
                        oriTemp={oriTemp}
                        amount={
                            {
                                STATE_YYSR_DJ:amount,
                                STATE_YYSR_XS:`${beManagemented?currentAmount:amount}`,
                                STATE_YYZC_TG:`${beManagemented?currentAmount:amount}`
                            }[oriState]
                        }
                    />:''
                }
                {
                    usedAccounts && oriState !== 'STATE_YYSR_TS'?
                    <MultiAccountComp
                        accountList={accountList}
                        accounts={accounts}
                        dispatch={dispatch}
                        isCheckOut={isCheckOut}
                        beManagemented={beManagemented}
                        oriTemp={oriTemp}
                        insertOrModify={insertOrModify}
                        amount={
                            {
                                STATE_YYSR_DJ:amount,
                                STATE_YYSR_XS:`${beManagemented?currentAmount:amount}`,
                                STATE_YYZC_TG:`${beManagemented?currentAmount:amount}`
                            }[oriState]
                        }
                    />:''
                }
                {
                    {
                        STATE_YYSR_DJ:true,
                        STATE_YYSR_XS:beManagemented && (currentAmount > 0 || usedAccounts) || !beManagemented,
                        STATE_YYZC_TG:beManagemented && (currentAmount > 0 || usedAccounts) || !beManagemented
                    }[oriState] && insertOrModify === 'insert'?
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
                        amount={
                            {
                                STATE_YYSR_DJ:amount,
                                STATE_YYSR_XS:`${beManagemented?currentAmount:amount}`,
                                STATE_YYZC_TG:`${beManagemented?currentAmount:amount}`
                            }[oriState]
                        }
                    />:''
                }
                {
                    oriState !=='STATE_YYSR_DJ' && oriState !=='STATE_YYZC_DJ'?
                    <Invoice
                        dispatch={dispatch}
                        flags={flags}
                        oriTemp={oriTemp}
                        taxRateTemp={taxRateTemp}
                        insertOrModify={insertOrModify}
                    />:''
                }
                {
                    (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && stockRange.size && usedStock) && (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') && insertOrModify === 'insert'?
                    <div>
                        <div className="edit-running-separator"></div>
                        <label>
                            <Checkbox
                                checked={beCarryoverOut}
                                onChange={(e) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','beCarryover', e.target.checked))
                                    e.target.checked && dispatch(editRunningActions.changeLrAccountCommonString('ori','carryoverCardList', stockCardList.map(v => v.set('amount',''))))
                                }}
                            />
                        <span>
                            {`${oriState === 'STATE_YYSR_XS'?'结转成本':'转回成本'}`}
                        </span>
                        </label>
                        {
                            beCarryoverOut && newCarryoverCardList?
                                fromJS(newCarryoverCardList).map((v,i) => {
                                    const openAssist = v.getIn(['financialInfo','openAssist'])
                                    const openBatch = v.getIn(['financialInfo','openBatch'])
                                    const openShelfLife = v.getIn(['financialInfo','openShelfLife'])
                                    const assistList = v.get('assistList') || fromJS([])
                                    const batchValue = v.get('batch')?`${v.get('batch')}${openShelfLife && v.get('productionDate') && v.get('productionDate') !== 'undefined' ?`(${v.get('productionDate')})`:''}`:undefined
                                    let cardValue = '',cardTitle = ''
                                    if (openAssist && openBatch) {
                                        cardTitle = `属性|批次：`
                                        cardValue = `${assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():''} | ${v.get('batch')?batchValue:''}`
                                    } else if (openAssist || openBatch) {
                                        cardTitle = openAssist ? '属性：' : '批次：'
                                        cardValue =  openAssist ?
                                        assistList.some(w => w.get('propertyName'))? assistList.map(w => w.get('propertyName')).join():''
                                        :v.get('batch')?batchValue:''
                                    }
                                    return <div>
                                    {
                                        newCarryoverCardList.length>1?
                                        <div className="edit-carryover-modal-list-item ">
                                            <div>
                                                <label>存货({i+1})：</label>
                                                <div>
                                                    {`${v.get('code')?v.get('code'):''} ${v.get('name')?v.get('name'):''}`}
                                                </div>
                                            </div>
                                            {
                                                openAssist|| openBatch?
                                                <div style={{maxWidth:enableWarehouse?'33%':'50%'}}>
                                                    <label style={{width: '65px'}}>{cardTitle}</label>
                                                    <div className='ellipsis'>
                                                        {cardValue}
                                                    </div>
                                                </div>:''
                                            }
                                            {
                                                enableWarehouse?
                                                <div>
                                                    <label>仓库：</label>
                                                    <div>
                                                        {`${v.get('warehouseCardCode')?v.get('warehouseCardCode'):''} ${v.get('warehouseCardName')?v.get('warehouseCardName'):''}`}
                                                    </div>
                                                </div>:''
                                            }
                                        </div>
                                        : null
                                    }
                                     <div className="edit-running-modal-list-item">
                                        <label>成本金额：</label>
                                        <div>
                                            <Input
                                                value={v.get('amount')}
                                                onFocus={() => {
                                                    let totalQuantity = 0, totalAmount = 0
                                                    if (stockCardList.getIn([v.get('index'),'isOpenedQuantity']) == 'false' || v.get('price') < 0)return;
                                                    if (enableWarehouse) {
                                                        stockCardList.forEach(w => {
                                                            if (v.get('warehouseCardUuid') === w.get('warehouseCardUuid') && v.get('warehouseCardUuid')
                                                            && w.get('cardUuid') === v.get('cardUuid') && w.get('cardUuid')) {
                                                                const cardItem = stockList.find(z => z.get('uuid') === w.get('cardUuid'))
                                                                const quantity = cardItem.getIn(['unit','name']) === w.get('unitName') ? 1 : (cardItem.getIn(['unit','unitList']).find(z => z.get('name') === w.get('unitName')) || fromJS({})).get('basicUnitQuantity')
                                                                totalQuantity += Number(quantity) * Number(w.get('quantity')) || 0
                                                            }
                                                        })
                                                    } else {
                                                        stockCardList.forEach(w => {
                                                            if (w.get('cardUuid') === v.get('cardUuid') && w.get('cardUuid')) {
                                                                const cardItem = stockList.find(z => z.get('uuid') === w.get('cardUuid'))
                                                                const quantity = cardItem.getIn(['unit','name']) === w.get('unitName') ? 1 : (cardItem.getIn(['unit','unitList']).find(z => z.get('name') === w.get('unitName')) || fromJS({})).get('basicUnitQuantity')
                                                                totalQuantity += Number(quantity) * Number(w.get('quantity')) || 0
                                                            }
                                                        })
                                                    }
                                                    totalAmount = totalQuantity * v.get('referencePrice') || 0
                                                    totalAmount && dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',v.get('index'),'amount'], totalAmount.toFixed(2)))
                                                }}
                                                onChange={(e) => {
                                                    numberTest(e,(value) => {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['carryoverCardList',v.get('index'),'amount'], value))
                                                    })
                                                }}

                                            />
                                        </div>
                                        {
                                            stockCardList.getIn([v.get('index'),'isOpenedQuantity']) != 'false'  && stockList.find(w => w.get('uuid') === v.get('cardUuid')) && v.get('referencePrice') > 0?
                                            <span style={{marginLeft:5}}>参考单价：{v.get('referencePrice')}元/{stockList.find(w => w.get('uuid') === v.get('cardUuid')).getIn(['unit','name'])}</span>:''
                                        }
                                    </div>
                                </div>
                                })
                                :
                                null
                        }
                    </div>:''
                }
                {
                    beZeroInventory && insertOrModify === 'insert' && oriState === 'STATE_YYZC_GJ'?
                    <div>
                        <div className="edit-running-separator"></div>
                        <label>
                            <Checkbox
                                checked={beCarryoverOut}
                                onChange={(e) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','beCarryover', e.target.checked))
                                    dispatch(editRunningActions.getCarryoverCategory(oriState))

                                }}
                            />
                        <span>
                            直接成本结转
                        </span>
                        </label>
                        {
                            beCarryoverOut?
                            <div className="edit-running-modal-list-item">
                                <label>处理类别：</label>
                                <div className='chosen-right' style={{ display: 'flex' }}>
                                    <Select
                                        disabled={insertOrModify === 'modify'}
                                        value={relationCategoryName}
                                        onChange={(value,options)=> {
                                            const valueList = value.split(Limit.TREE_JOIN_STR)
                                            const uuid = valueList[0]
                                            const name = valueList[1]
                                            const categoryType = valueList[3]
                                            const projectRange = options.props.projectRange
                                            const propertyCostList = options.props.propertyCostList
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','relationCategoryUuid', uuid))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','relationCategoryName', name))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','relationCategoryType', categoryType))
                                            dispatch(editRunningActions.changeLrAccountCommonString('',['flags','relationCategoryPropertyCostList'], fromJS(propertyCostList)))
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','propertyCost',''))
                                            const beProjectBollen = valueList[2] === 'true' ? true : false
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori','relationBeProject', beProjectBollen))
                                            if (beProjectBollen) {
                                                dispatch(editRunningActions.getCarrayProjectCardList(projectRange,projectCardList))
                                            }
                                        }}
                                    >
                                        {
                                            carryoverCategory.map((v, i) => {
                                                return <Option
                                                    key={i}
                                                    value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.name}${Limit.TREE_JOIN_STR}${v.beProject}${Limit.TREE_JOIN_STR}${v.categoryType}`}
                                                    projectRange={v.projectRange}
                                                    propertyCostList={v.propertyCostList}
                                                    >
                                                    {v.name}
                                                </Option>
                                            })
                                        }
                                    </Select>
                                    {
                                        relationBeProject ?
                                            <Switch
                                                className="use-unuse-style lrls-jzsy-box"
                                                style={{ margin: '.1rem 0 0 .2rem' }}
                                                checked={usedCarryoverProject}
                                                checkedChildren={'项目'}
                                                unCheckedChildren={'项目'}
                                                onChange={() => {
                                                    if (!usedCarryoverProject) {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','carryoverProjectCardList', fromJS([]) ))
                                                    } else {
                                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','carryoverProjectCardList', fromJS([{}]) ))
                                                    }
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','usedCarryoverProject', !usedCarryoverProject))
                                                }}
                                            /> : ''
                                    }
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>:''
                }
                {
                    beCarryoverOut && relationCategoryPropertyCostList && relationCategoryPropertyCostList.size > 1 ?
                    <div className="edit-running-modal-list-item" style={{display:(oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_DJ') && pendingStrongList.filter(v => v.get('beSelect')).size >= 1?'none':''}}>
                        <label>费用性质：</label>
                        <div>
                            <Tooltip title={projectTip[propertyCost] || ''}
                                placement='topLeft'
                            >
                                <Select
                                    disabled={disableProperty}
                                    value={propertyName[propertyCost]}
                                    onChange={value => {
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','propertyCost',value))
                                    }}
                                    >
                                        {
                                            relationCategoryPropertyCostList.map((v, i) =>{
                                                const name = propertyName[v]
                                                return <Option key={i} value={v}>
                                                    {name}
                                                </Option>
                                            })
                                    }
                                </Select>
                            </Tooltip>
                        </div>
                    </div>:''

                }
                {
					beCarryoverOut && relationBeProject && usedCarryoverProject && oriState === 'STATE_YYZC_GJ' ?
					<div  className='project-content-area' >
						<div className="edit-running-modal-list-item" >
							<label>项目：</label>
							<div className='chosen-right'>
								<Select
									combobox
									showSearch
									value={`${projectCodeTest(carryoverProjectCardList.getIn([0,'code']))} ${carryoverProjectCardList.getIn([0,'name']) ? carryoverProjectCardList.getIn([0,'name']) : ''}`}
									onChange={(value,options) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										const cardUuid = valueList[0]
										const code = valueList[1]
										const name = valueList[2]
                                        const projectProperty = options.props.projectProperty
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori','carryoverProjectCardList', fromJS([{ cardUuid, name, code,projectProperty}])))
                                        switch(code) {
                                            case 'ASSIST':
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_FZSCCB'))
                                                break
                                            case 'MAKE':
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_ZZFY'))
                                                break
                                            case 'INDIRECT':
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_JJFY'))
                                                break
                                            case 'MECHANICAL':
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_JXZY'))
                                                break
                                            default:
                                            if (projectProperty === 'XZ_PRODUCE') {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_SCCB'))
                                            } else if (projectProperty === 'XZ_CONSTRUCTION') {
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', 'XZ_HTCB'))
                                            } else if (propertyCost !== 'XZ_FINANCE' && propertyCost !== 'XZ_MANAGE' && propertyCost !== 'XZ_SALE' && projectProperty) {
                                                propertyCost && dispatch(editRunningActions.changeLrAccountCommonString('ori', 'propertyCost', relationCategoryPropertyCostList.get(0)))
                                            }
                                        }
									}}
								>
									{carryoverProjectList &&
                                        CommonProjectTest(fromJS({categoryType:relationCategoryType}),carryoverProjectList)
                                            .map((v, i) =>
										<Option
                                            key={i}
                                            value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                            projectProperty={v.get('projectProperty')}
                                            >
											{`${projectCodeTest(v.get('code'))} ${v.get('name')}`}
										</Option>
									)}
								</Select>
							</div>
						</div>
					</div>: null
				}
                {
                    insertOrModify === 'modify' && stockStrongList.size?
                    <CarrayoverRunning
                        title={'成本结转流水：'}
                        strongList={stockStrongList}
                        dispatch={dispatch}
                    />:''

                }
                {
                    insertOrModify === 'modify' && (beManagemented || strongList.size) && !allGetFlow?
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

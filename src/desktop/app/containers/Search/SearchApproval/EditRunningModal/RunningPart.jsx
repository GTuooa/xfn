import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Tooltip, TreeSelect, Select } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { getSelectJrCategoryList, receiptList } from 'app/containers/Config/Approval/components/common.js'
import { XfInput, Icon } from 'app/components'
import { formatMoney } from 'app/utils'

import Invoice from './Invoice'
import Relative from './Relative'
import Project from './Project'
import Inventory from './Inventory'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import { getCategorynameByType, numberTest } from 'app/containers/Edit/EditRunning/common/common.js'

@immutableRenderDecorator
export default
	class RunningPart extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}

	render() {

		const {
			dispatch,
            editRunningModalState,
            taxRate,
            runningCategory,
            accountList,
            enableWarehouse,
            openQuantity,
            currentbillType,
            showProject,
            showContact
        } = this.props
        
        
        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const categoryData = editRunningModalState.get('categoryData')
        const datailList = editRunningModalState.get('datailList')
        // const runningCategory = allState.get('runningCategory')
        // const accountList = allState.get('accountList')
        // const taxRate = allState.get('taxRate')

        const jrDate = editRunningModalTemp.get('jrDate')
        const jrId = editRunningModalTemp.get('id')
        const dateFormat = 'YYYY-MM-DD'
        const beContact = editRunningModalTemp.get('beContact')
        const beProject = editRunningModalTemp.get('beProject')
        const jrCategoryUuid = editRunningModalTemp.get('jrCategoryUuid')
        const categoryName = editRunningModalTemp.get('categoryName')
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')
        const contactList = editRunningModalTemp.get('contactList')
        const detailType = editRunningModalTemp.get('detailType')
        const jrAbstract = editRunningModalTemp.get('jrAbstract')
        const jrAmount = editRunningModalTemp.get('jrAmount')
        const jrCostType = editRunningModalTemp.get('jrCostType')
        const projectList = editRunningModalTemp.get('projectList')
        const billList = editRunningModalTemp.get('billList')
        const dealState = editRunningModalTemp.get('dealState')
        const account = editRunningModalTemp.get('account')
        const stockList = editRunningModalTemp.get('stockList')
        // const carryoverCardList = editRunningModalTemp.get('carryoverCardList')
        const canChoseDetailList = editRunningModalTemp.get('canChoseDetailList')
        const { categoryTypeObj } = jrCategoryType ? getCategorynameByType(jrCategoryType) : {categoryTypeObj: ''}
        const payOrReceive = jrCategoryType ? (receiptList.indexOf(jrCategoryType) > -1 ? 'RECEIPT' : 'PAYMENT') : ''
        const propertyCarryover = categoryData.get('propertyCarryover')
        
        const isStock = detailType === '销售存货套件' || detailType === '采购存货套件'
        const isDJ = detailType === '预付账款' || detailType === '预收账款'
        const jrCategoryList = getSelectJrCategoryList(runningCategory, null, true, {jrCategoryType, payOrReceive, isStock, isDJ})
        const currentTaxRate = billList.getIn([0, 'taxRate'])

        const propertyCostList = categoryData.get('propertyCostList')
        const projectCardList = editRunningModalState.get('projectCardList')
        const contactCardList = editRunningModalState.get('contactCardList')
        const invetoryCardList = editRunningModalState.get('invetoryCardList')
        const warehouseCardList = editRunningModalState.get('warehouseCardList')

        const openProject = categoryData.get('beProject')
        const contactsManagement = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'contactsManagement']) : false
        const beManagemented = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beManagemented']) : false
        const projectRange = categoryData.get('projectRange')
        const contactsRange = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'contactsRange']) : fromJS([])
        const stockRange = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'stockRange']) : fromJS([])
        const beZeroInventory = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beZeroInventory']) : false

        const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])
        // const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
        // const openQuantity = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('QUANTITY') > -1

        const showStockModal = editRunningModalState.getIn(['views', 'showStockModal'])
        const MemberList = editRunningModalState.get('MemberList')
        const selectThingsList = editRunningModalState.get('selectThingsList')
        const thingsList = editRunningModalState.get('thingsList')
        const selectedKeys = editRunningModalState.get('selectedKeys')
        const selectList = editRunningModalState.get('selectList')
        const selectItem = editRunningModalState.get('selectItem')

        const showType = {
            'GLFY': '管理费用',
            'XSFY': '销售费用',
            'XZ_MANAGE': '管理费用',
            'XZ_SALE': '销售费用',
            'FZSCCB': '辅助生产成本',
            'ZZFY': '制造费用',
            'SCCB': '生产成本',
            'JJFY': '间接费用',
            'JXZY': '机械作业',
            'HTCB': '合同成本',
        }

        const invoiceCanUse = ['LB_YYSR', 'LB_YYZC', 'LB_FYZC', 'LB_YYWSR', 'LB_YYWZC']
        const directionJson = {
            'LB_YYSR': 'debit',
            'LB_YYZC': 'credit',
            'LB_FYZC': 'credit',
            'LB_YYWSR': 'debit',
            'LB_YYWZC': 'credit',
        }

        const index = datailList.findIndex(v => v.get('id') === jrId)

        let canAccount = false
        if (jrCategoryType === 'LB_XCZC') {
            if (categoryData.get('propertyPay') === 'SX_FLF') {
                canAccount = categoryData.getIn([categoryTypeObj, 'beWelfare'])  
            } else if (categoryData.get('propertyPay') === 'SX_QTXC') {
                canAccount = categoryData.getIn([categoryTypeObj, 'beAccrued']) 
            }
        } else {
            canAccount = beManagemented
        }

        const propertyCostTootipTitle = {
            'FZSCCB': '已选择“辅助生产成本”项目',
            'ZZFY': '已选择“制造费用”项目',
            'SCCB': '已选择生产项目',
            'JJFY': '已选择“间接费用”项目',
            'JXZY': '已选择“机械作业”项目',
            'HTCB': '已选择施工项目',
        }

        let oriState = ''
        if (isDJ) {
            if (jrCategoryType === 'LB_YYSR') {
                oriState = 'STATE_YYSR_DJ'
            } else if (jrCategoryType === 'LB_YYZC') {
                oriState = 'STATE_YYZC_DJ'
            } else if (jrCategoryType === 'LB_FYZC') {
                oriState = 'STATE_FY_DJ'
            }
        } else if (jrCategoryType==='LB_FYZC') {
            oriState = 'STATE_FY'
        }

		return (
			<div>
				{
                    detailType === '销售存货套件' || detailType === '采购存货套件' ? null :
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">明细金额：</span>
                        <span className="approval-running-card-input">
                            <XfInput
                                value={jrAmount}
                                mode="amount"
                                placeholder=""
                                negativeAllowed={isDJ ? false : true}
                                onChange={(e) => {
                                    // numberTest(e, (value) => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrAmount', e.target.value))
                                    // }, jrCategoryType === 'LB_YYWSR' || jrCategoryType === 'LB_YYWZC' ? false : true)
                                    // 营业外收入
                                }}
                            />
                        </span>
                    </div>
                }
                {
                    payOrReceive === 'RECEIPT' ?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">明细账户：</span>
                        <span className="approval-running-card-input approval-running-card-input-clear">
                            <Select
                                value={account && account.size ? `${account.get('accountName')}` : ''}
                                style={{ width: '100%' }}
                                onChange={value => {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('account', fromJS({
                                        "accountName": valueList[1],
                                        "accountUuid": valueList[0]
                                    })))
                                }}
                            >
                                {
                                    accountSelectList && accountSelectList.toJS().map((v, i) => <Select.Option value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.name}`} key={i}>{`${v.name}`}</Select.Option>)
                                }
                            </Select>
                            <Icon
                                className="search-approval-modal-clear-icon"
                                style={{display: account && account.size ? '' : 'none'}}
                                type="close-circle"
                                theme='filled'
                                onClick={() => {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('account', null))
                                }}
                            />
                        </span>
                    </div>
                    : null
                }
                <div className="approval-running-card-break"></div>

                <div className="approval-running-card-input-wrap">
                    <span className="approval-running-card-input-tip">流水类别：</span>
                    <span className="approval-running-card-input">
                        <TreeSelect
                            value={categoryData.get('canUse') ? (jrCategoryUuid ? jrCategoryUuid + Limit.TREE_JOIN_STR + jrCategoryType + Limit.TREE_JOIN_STR + categoryName : '') : (categoryName ? categoryName : '')}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={jrCategoryList}
                            placeholder="必填，请选择流水类别"
                            treeDefaultExpandAll
                            onChange={(info) => {
                                const valueList = info.split(Limit.TREE_JOIN_STR)
                                if (jrCategoryUuid !== valueList[0]) {
                                    dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCategory(valueList[0], valueList[1], valueList[2], editRunningModalTemp))
                                }
                            }}
                        />
                    </span>
                </div>
                {
                    propertyCostList.size > 1 && !isDJ ?
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">费用性质：</span>
                            <span className="approval-running-card-input">
                                <Tooltip placement='topLeft' title={propertyCostTootipTitle[jrCostType] ? propertyCostTootipTitle[jrCostType] : ''}>
                                    <Select
                                        value={jrCostType ? showType[jrCostType] : ''}
                                        disabled={propertyCostTootipTitle[jrCostType]}
                                        style={{ width: '100%' }}
                                        onChange={value => {
                                            const str = {
                                                XZ_MANAGE: 'GLFY',
                                                XZ_SALE: 'XSFY'
                                            }
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[value]))
                                        }}
                                    >
                                        {
                                            propertyCostList && propertyCostList.toJS().map(v => <Select.Option value={`${v}`}>{`${showType[v]}`}</Select.Option>)
                                        }
                                    </Select>
                                </Tooltip>
                            </span>
                        </div>
                        : null
                }                 
                <div className="approval-running-card-input-wrap">
                    <span className="approval-running-card-input-tip">摘要：</span>
                    <span className="approval-running-card-input">
                        <XfInput
                            value={jrAbstract}
                            placeholder=""
                            onChange={(e) => {
                                dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrAbstract', e.target.value))
                            }}
                        />
                    </span>
                </div>
                {
                    showContact ?
                        <Relative
                            contactList={contactList}
                            dispatch={dispatch}
                            contactCardList={contactCardList}
                            contactsRange={contactsRange}
                            beContact={beContact}
                            contactsManagement={contactsManagement}
                        />
                        : null
                }
                {
                    showProject ?
                        <Project
                            projectList={projectList}
                            dispatch={dispatch}
                            projectCardList={projectCardList}
                            projectRange={projectRange}
                            beProject={beProject}
                            openProject={openProject}
                            oriTemp={fromJS({
                                categoryType: jrCategoryType,
                                handleType: '',
                                // oriState: jrCategoryType==='LB_FYZC' ? 'STATE_FY' : '',
                                oriState: oriState,
                                propertyCarryover: propertyCarryover
                            })}
                            jrCostType={jrCostType}
                            propertyCostList={propertyCostList}
                        />
                        : null
                }
                {
                    // propertyCarryover === 'SX_HW' ?
                    detailType === '销售存货套件' || detailType === '采购存货套件' ?
                    <Inventory
                        dispatch={dispatch}
                        stockCardList={stockList}
                        stockList={invetoryCardList}
                        warehouseList={warehouseCardList}
                        stockRange={stockRange}
                        taxRate={currentTaxRate}
                        
                        showStockModal={showStockModal}
                        enableWarehouse={enableWarehouse}
                        openQuantity={openQuantity}
                        selectList={selectList}
                        selectItem={selectItem}
                        MemberList={MemberList}
                        selectThingsList={selectThingsList}
                        thingsList={thingsList}
                        selectedKeys={selectedKeys}
                    />
                    : null
                }
                {
                    detailType === '销售存货套件' || detailType === '采购存货套件' ?
                    <div className="approval-running-inventory-amont">合计金额： {formatMoney(jrAmount)}</div>
                    : null
                }
                <div className="approval-running-card-break"></div>
                {
                    invoiceCanUse.indexOf(jrCategoryType) > -1 && !isDJ ?
                    <Invoice
                        billList={billList}
                        taxRateConf={taxRate}
                        direction={directionJson[jrCategoryType]}
                        handleType={''}
                        dispatch={dispatch}
                        amount={jrAmount}
                        categoryType={jrCategoryType}
                        currentbillType={currentbillType}
                    />
                    : null
                }
			</div>
		)
	}
}

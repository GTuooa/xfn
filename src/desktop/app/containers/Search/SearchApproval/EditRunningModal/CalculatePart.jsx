import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { message, Select, Icon } from 'antd'
import { XfInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import Inventory from './stock/Inventory.jsx'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import { numberTest } from 'app/containers/Edit/EditRunning/common/common.js'

@immutableRenderDecorator
export default
	class CalculatePart extends React.Component {

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
            accountList,
            enableWarehouse,
            warehouseCanUse,
            openQuantity
        } = this.props
        
        
        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')      
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')    
        const jrAmount = editRunningModalTemp.get('jrAmount')       
        const jrDate = editRunningModalTemp.get('jrDate')
        const inputAccount = editRunningModalTemp.get('inputAccount')
        const outputAccount = editRunningModalTemp.get('outputAccount')
        const jrAbstract = editRunningModalTemp.get('jrAbstract')
        const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([])

        const billList = editRunningModalTemp.get('billList')
        const stockList = editRunningModalTemp.get('stockList')
        const invetoryCardList = editRunningModalState.get('invetoryCardList')
        const warehouseCardList = editRunningModalState.get('warehouseCardList')
        const currentTaxRate = billList.getIn([0, 'taxRate'])
        const selectList = editRunningModalState.get('selectList')
        const inputDepot = editRunningModalTemp.get('inputDepot')
        const outputDepot = editRunningModalTemp.get('outputDepot')

        const showStockModal = editRunningModalState.getIn(['views', 'showStockModal'])
        const MemberList = editRunningModalState.get('MemberList')
        const selectThingsList = editRunningModalState.get('selectThingsList')
        const thingsList = editRunningModalState.get('thingsList')
        const selectedKeys = editRunningModalState.get('selectedKeys')
        const selectItem = editRunningModalState.get('selectItem')

		return (
			<div>
				{
                    jrCategoryType === 'LB_ZZ' ?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">明细金额：</span>
                        <span className="approval-running-card-input">
                            <XfInput
                                autoSelect={true}
                                disabled={false}
                                value={jrAmount}
                                mode="amount"
                                placeholder=""
                                negativeAllowed={jrCategoryType === 'LB_ZZ' ? false : true}
                                onChange={(e) => {
                                    // numberTest(e, (value) => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrAmount', e.target.value))
                                    // }, )
                                    // 营业外收入
                                }}
                            />
                        </span>
                    </div>
                    : null
                }
               
               <div className="approval-running-card-break"></div>

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
                    jrCategoryType === 'LB_ZZ' ?
                    <div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">转出账户：</span>
                            <span className="approval-running-card-input approval-running-card-input-clear">
                                <Select
                                    value={outputAccount && outputAccount.size ? `${outputAccount.get('accountName')}` : ''}
                                    style={{ width: '100%' }}
                                    onChange={value => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputAccount', fromJS({
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
                                    style={{display: outputAccount && outputAccount.size ? '' : 'none'}}
                                    type="close-circle"
                                    theme='filled'
                                    onClick={() => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputAccount', null))
                                    }}
                                />
                            </span>
                        </div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">转入账户：</span>
                            <span className="approval-running-card-input approval-running-card-input-clear">
                                <Select
                                    value={inputAccount && inputAccount.size ? `${inputAccount.get('accountName')}` : ''}
                                    style={{ width: '100%' }}
                                    onChange={value => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputAccount', fromJS({
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
                                    style={{display: inputAccount && inputAccount.size ? '' : 'none'}}
                                    type="close-circle"
                                    theme='filled'
                                    onClick={() => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputAccount', null))
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                    : null
                }
                {
                    jrCategoryType === 'LB_CHDB' ?
                    <div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">调出仓库：</span>
                            <span className="approval-running-card-input approval-running-card-input-clear">
                                <Select
                                    combobox
                                    showSearch
                                    value={outputDepot.get('name') ? `${outputDepot.get('code')} ${outputDepot.get('name')}` : ''}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const uuid = options.props.uuid
                                        if (inputDepot.get('uuid') === uuid) {
                                            return message.info('调入与调出不能选择同一仓库')
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('outputDepot', fromJS({
                                                code: valueList[0],
                                                name: valueList[1],
                                                type: '',
                                                uuid,
                                            })))
                                            // dispatch(editCalculateActions.getStockCardList())
                                        }
                                        let selectUuidList = []
                                        stockList && stockList.map((item, i) => {
                                            if(item.get('isOpenedQuantity')){
                                                selectUuidList.push({
                                                    cardUuid:item.get('cardUuid'),
                                                    storeUuid: uuid,
                                                    isUniformPrice: item.get('isUniformPrice')
                                                })
                                            }
                                        })
                                        console.log('selectUuidList', selectUuidList.toJS());
                                        
                                        // selectUuidList && selectUuidList.length && dispatch(editCalculateActions.getCostTransferPrice(oriDate, selectUuidList,0, 'Stock'))
                                    }}
                                >
                                    {
                                        warehouseCardList && warehouseCardList.map((v, i) => {
                                            return <Option
                                                key={v.get('code')}
                                                value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                uuid={v.get('uuid')}
                                            >
                                                {
                                                    // v.get('code') && v.get('code') !== 'DFTCRD' ? `${v.get('code')} ${v.get('name')}` : v.get('name')
                                                }
                                                {`${v.get('code')} ${v.get('name')}`}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">调入仓库：</span>
                            <span className="approval-running-card-input approval-running-card-input-clear">
                                <Select
                                    combobox
                                    showSearch
                                    value={inputDepot.get('name') ? `${inputDepot.get('code')} ${inputDepot.get('name')}` : ''}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const uuid = options.props.uuid
                                        if (outputDepot.get('uuid') === uuid) {
                                            return message.info('调入与调出不能选择同一仓库')
                                        } else {
                                            dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('inputDepot', fromJS({
                                                code: valueList[0],
                                                name: valueList[1],
                                                type: '',
                                                uuid,
                                            })))
                                        }

                                    }}
                                >
                                    {
                                        warehouseCardList && warehouseCardList.map((v, i) => {
                                            return <Option 
                                                key={v.get('code')}
                                                value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                uuid={v.get('uuid')}
                                            >
                                                {`${v.get('code')} ${v.get('name')}`}
                                            </Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </div>
                    </div>
                    : null
                }

                {
                    jrCategoryType === 'LB_CHDB' ?
                    <div className="approval-running-card-break approval-running-card-break-margin"></div>
                    : null
                }

                {
                    jrCategoryType === 'LB_CHDB' ?
                    <Inventory
                        dispatch={dispatch}
                        fromPage="processCHDB"
                        stockCardList={stockList}
                        stockList={invetoryCardList}
                        stockRange={[]}
                        oriDate={jrDate}
                        MemberList={MemberList}
                        thingsList={thingsList}
                        selectThingsList={selectThingsList}
                        currentCardType={'stock'}
                        selectedKeys={selectedKeys}
                        warehouseList={warehouseCardList}
                        showStockModal={showStockModal}
                        insertOrModify={'modify'}
                        enableWarehouse={enableWarehouse}
                        warehouseCanUse={warehouseCanUse}
                        oriState={'STATE_CHDB'}
                        openQuantity={openQuantity}
                        selectList={selectList}
                        selectItem={selectItem}
                        stockTitleName={'存货'}
                        stockTemplate={'stockCardList'}
                        sectionTemp={'Stock'}
                        amountDisable={false}
                        isCardUuid={false}
                        needTotalAmount={true}
                        notNeedOpenModal={!outputDepot.get('uuid')}
                        notNeedOpenModal={false}
                        notNeedMessage={'请选择调出仓库'}
                        warehouseUuid={outputDepot.get('uuid')}
						addInBatchesFun={()=>{
                            if (outputDepot.get('uuid')) {
                                dispatch(editCalculateActions.getStockCardCategoryAndList())
                            } else {
                                return message.info('请选择调出仓库')
                            }
						}}
						selectStockFun={(cardUuid,i)=>{}}
						deleteStockFun={(i)=>{}}
						callback={(item) => {
                            const chooseIndex = stockList.size
                            let selectUuidList = []
                            selectItem && selectItem.size && selectItem.map((item, index) => {
                                if(item.get('isOpenedQuantity')){
                                    selectUuidList.push({
                                        cardUuid:item.get('uuid'),
                                        storeUuid: outputDepot.get('uuid'),
                                        isUniformPrice: item.get('isUniformPrice')
                                    })
                                }

                            })
                            selectUuidList && selectUuidList.length && dispatch(searchApprovalActions.getSearchApprovalCostTransferPrice(jrDate, selectUuidList ,chooseIndex, 'Stock'))
						}}
						selectTreeCallBack={(uuid, level) => {
                            if (uuid === 'all') {
                                dispatch(searchApprovalActions.getInventoryAllCardList([], 'hidecategory'))
                            } else {
                                dispatch(searchApprovalActions.getInventorySomeCardList(uuid,level))
                            }
						}}
                    />
                    : null
                }
			</div>
		)
	}
}
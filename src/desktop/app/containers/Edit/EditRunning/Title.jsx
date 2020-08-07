import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, message } from 'antd'
import { Amount, TableItem } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { debounce } from 'app/utils'
import { beforejumpCxToLr } from 'app/containers/components/moduleConstants/common'
import { getCategorynameByType, beforeSaveCheck } from 'app/containers/Edit/EditRunning/common/common'

// import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import * as allActions from 'app/redux/Home/All/allRunning.action'

export let refreshButtonAction = null
@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			dispatch,
			oriTemp,
			flags,
			editPermission,
			taxRateTemp,
			pageTab,
			paymentType,
			insertOrModify,
			calculateViews,
			projectList,
			SfglTemp,
			CqzcTemp,
			CommonChargeTemp,
			InternalTransferTemp,
			DepreciationTemp,
			InvoicingTemp,
			InvoiceAuthTemp,
			TransferOutTemp,
			CostTransferTemp,
			StockTemp,
			BalanceTemp,
			TaxTransferTemp,
			StockBuildUpTemp,
			StockIntoProjectTemp,
			ProjectCarryoverTemp,
			commonTemp,
		} = this.props

		const categoryType = oriTemp.get('categoryType')
		const {
			categoryTypeObj,
			direction,
		} = getCategorynameByType(categoryType)
		const rswitchUuidList = flags.get('switchUuidList') || []
		const cswitchUuidList = calculateViews.get('switchUuidList') || []
		const switchUuidList = pageTab === 'business' && paymentType !== 'LB_SFGL' ? rswitchUuidList : cswitchUuidList
		const name = oriTemp.get('name')
		const beCertificate = oriTemp.get('beCertificate')
		const currentUuid = pageTab === 'business' && paymentType !== 'LB_SFGL' ? oriTemp.get('oriUuid') : calculateViews.get('oriUuid')
		const uuidList = flags.get('uuidList')
		const currentSwitchUuid = flags.get('currentSwitchUuid')
		const scale = taxRateTemp.get('scale')

		const calBeCertificate = commonTemp.get('beCertificate')

		let newButtonAction = null
		let saveButtonAction = null

		const savePageTab = paymentType === 'LB_SFGL' ? 'payment' : pageTab

		switch (savePageTab) {
			case 'business':
				if (insertOrModify === 'modify') {
					refreshButtonAction = () => debounce(() => { // 刷新
						dispatch(editRunningActions.refreshRunningbusiness())
					})()
					newButtonAction = () => debounce(() => { //新增
						let errorList = beforeSaveCheck(oriTemp,scale,insertOrModify,projectList)
						if (errorList.length) {
							const info = errorList.join(',')
							message.info(info)
						} else {
							dispatch(editRunningActions.saveRunningbusiness(true))
						}
						dispatch(allActions.getRunningSettingInfo())
					})()
				} else {
					refreshButtonAction = () => debounce(() => { // 刷新
						dispatch(allActions.getRunningSettingInfo(true))
						dispatch(editRunningActions.selectAccountRunningCategory(oriTemp.get('categoryUuid'),true))
					})()
					newButtonAction = () => debounce(() => { //新增
						let errorList = beforeSaveCheck(oriTemp,scale,insertOrModify,projectList)
						if (errorList.length) {
							const info = errorList.join(',')
							message.info(info)
						} else {
							dispatch(editRunningActions.saveRunningbusiness(true))
						}
					})()
				}
				saveButtonAction = () => debounce(() => { //保存
					let errorList = beforeSaveCheck(oriTemp,scale,insertOrModify,projectList)
					if (errorList.length) {
						const info = errorList.join(',')
						message.info(info)
					} else {
						dispatch(editRunningActions.saveRunningbusiness())
					}
				})()
				break
			case 'payment':
				// if(calInsertOrModify === 'modify'){
				if (insertOrModify === 'modify') {
					refreshButtonAction = () => debounce(() => { // 刷新
						dispatch(editCalculateActions.modifyRefreshCalculate(paymentType))
					})()
					newButtonAction = () => debounce(() => { //新增
						dispatch(allActions.getRunningSettingInfo())
						dispatch(editCalculateActions.saveCalculatebusiness(paymentType,true))
					})()
				} else {
					refreshButtonAction = () => debounce(() => { // 刷新
						dispatch(allActions.getRunningSettingInfo(true))
						dispatch(editCalculateActions.insertRefreshCalculate(paymentType))
					})()
					newButtonAction = () => debounce(() => { //新增
						dispatch(editCalculateActions.saveCalculatebusiness(paymentType,true))
					})()
				}
				saveButtonAction = () => debounce(() => { //保存
					dispatch(editCalculateActions.saveCalculatebusiness(paymentType))
				})()
				break
			default:
				break
		}
		return (
			<div className="title">
				<div>
					<Button
						type="ghost"
						className="title-right"
						onClick={refreshButtonAction}
						>
						刷新
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={pageTab === 'business' && paymentType !== 'LB_SFGL' ? (!editPermission || beCertificate) : (!editPermission|| calBeCertificate) }
						onClick={newButtonAction}
						>
						{/* {insertOrModify === 'modify' && PageTab === 'business' || calInsertOrModify === 'modify' && PageTab === 'payment' ? '新增' : '保存并新增'} */}
						{'保存并新增'}
					</Button>
					<Button
						type="ghost"
						disabled={pageTab === 'business' && paymentType !== 'LB_SFGL' ? (!editPermission || beCertificate) : (!editPermission|| calBeCertificate)}
						className="title-right"
						onClick={saveButtonAction}
						>
						保存
					</Button>
				</div>
			{
				insertOrModify === 'modify' && switchUuidList.size?
				<div>
					<Button
						type="ghost"
						className="title-right"
						disabled={switchUuidList.some((v, i)=> {
							const uuid = v.get('oriUuid')
							return uuid === currentUuid && i === switchUuidList.size-1
							})
						}
						onClick={() => {
							const index = switchUuidList.findIndex(v => {
								const uuid = v.get('oriUuid')
								return uuid === currentUuid
							}) +1
							dispatch(searchRunningActions.getBusinessBeforeSwitch(switchUuidList.get(index),index,switchUuidList))
						}}
						>
						<Icon type="caret-right" />
					</Button>
					<Button
						type="ghost"
						className="title-right"
						disabled={switchUuidList.some((v, i)=> {
							const uuid = v.get('oriUuid')
							return uuid === currentUuid && i === 0
							})
						}
						onClick={() => {
							const index = switchUuidList.findIndex(v => {
								const uuid = v.get('oriUuid')
								return uuid === currentUuid
							}) -1
							dispatch(searchRunningActions.getBusinessBeforeSwitch(switchUuidList.get(index),index,switchUuidList))
						}}
						>
						<Icon type="caret-left" />
					</Button>
				</div>
				:''
			}
		</div>
		)
	}
}

import React from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

import Item from './Item.jsx'
import TableTit from './TableTit.jsx'
import { TableWrap, TableBody, TableAll, TablePagination, CxpzTableItem } from 'app/components'

import NumberInput from 'app/components/Input'
import { numberTest } from 'app/containers/Edit/EditRunning/common/common.js'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { formatNum, formatDate, formatMoney  } from 'app/utils'
import { categoryTypeAll, type, business, beforejumpCxToLr } from 'app/containers/components/moduleConstants/common'
import { Tooltip, Icon, Checkbox, Progress, message, Modal, DatePicker, Input, Select, Switch } from 'antd'
import Searchclosure from 'app/containers/components/Searchclosure'
import CalculatePandge from './CalculatePandge'

import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
@connect(state => state)
export default
	class CalculateModal extends React.Component {

	render() {

		const {
			manageModal,
			grantModal,
			defrayModal,
			takeBackModal,
			backModal,
			jzsyModal,
			invioceModal,
			defineModal,
			allState,
			homeState,
			searchRunningAllState,
			parent,
			approalCalculateState,
			dispatch,
			initModal,
			editRunningModalState
		} = this.props

		const runningFlowTemp = approalCalculateState.get('runningFlowTemp')
		const views = approalCalculateState.get('views')
		const categoryType = runningFlowTemp.get('categoryType')
		const modalTemp = approalCalculateState.get('modalTemp')
		const stockCardList = modalTemp.get('stockCardList') || []
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn(["currentCardList", 0])
		const oriDate = runningFlowTemp.get('oriDate')
		const magenerType = runningFlowTemp.get('magenerType')
		const propertyPay = runningFlowTemp.get('propertyPay')
		// const showChildList = searchRunningState.getIn(['flags', 'showChildList'])

		const accountList = allState.get('accountList')
		const accountPoundage = allState.get('accountPoundage')

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enclosureList = searchRunningAllState.get('enclosureList')
		const label = searchRunningAllState.get('label')
		const lrPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		const uploadKeyJson = allState.get('uploadKeyJson')
		const projectCardList = editRunningModalState.get('projectCardList')
        const contactCardList = editRunningModalState.get('contactCardList')

		let onCancel
		let title
		let onOk
		let childComponent = null

		if (manageModal) {
			// return (
			// 	<Modal
			// 		visible={manageModal}
			// 		onCancel={() => { initModal('manageModal') }}
			// 		className='single-manager'
			// 		title={`${magenerType === 'debit' ? '收款' : '付款'}核销`}
			// 		okText='保存'
			// 		onOk={() => {
			// 			dispatch(searchApprovalActions.insertRunningManagerModal(() => parent.setState({ 'manageModal': false }), categoryTypeObj))
			// 		}}
			// 	>
			title = `${magenerType === 'debit' ? '收款' : '付款'}核销`
			onCancel = () => { initModal('manageModal') }
			onOk = () => {

				// TODO

				dispatch(searchApprovalActions.insertRunningManagerModal(() => parent.setState({ 'manageModal': false }), categoryTypeObj))
			}
			childComponent = <div className='manager-content'>
				{
					contactsCardRange ?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						: ''
				}
				<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto', 'pendingManageList', 0, 'oriDate'])) > current
						}}
						value={modalTemp.get('oriDate') ? moment(modalTemp.get('oriDate')) : ''}
						onChange={value => {
							const date = value.format('YYYY-MM-DD')
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriDate'], date))
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						onFocus={(e) => e.target.select()}
						value={modalTemp.get('oriAbstract')}
						onChange={(e) => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriAbstract'], e.target.value))
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>{`${magenerType === 'debit' ? '收款' : '付款'}金额：`}</label>
					<NumberInput
						value={modalTemp.get('amount')}
						onChange={(e) => {
							numberTest(e, (value) => {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'amount'], value))
							})
						}}
					/>
				</div>
				<Account
					modalTemp={modalTemp}
					dispatch={dispatch}
					accountList={accountList}
				/>
				{
					magenerType === 'debit'?
					<CalculatePandge
						dispatch={dispatch}
						accountPoundage={accountPoundage}
						modalTemp={modalTemp}
						flags={views}
						projectCardList={projectCardList}
						contactCardList={contactCardList}
					/>:''
				}
			</div>
				// </Modal>
			// )
		} else if (grantModal) {
			// return (
			// 	<Modal
			// 		visible={grantModal}
			// 		onCancel={() => { initModal('grantModal') }}
			// 		className='single-manager'
			// 		title={`付款核销`}
			// 		okText='保存'
			// 		onOk={() => {
			// 			dispatch(searchApprovalActions.insertCommonModal(() => parent.setState({ 'grantModal': false }), categoryTypeObj, '', 'insertJrPayment'))
			// 		}}
			// 	>
			title = magenerType === 'debit' ? '收款核销' : '付款核销'
			onCancel = () => { initModal('grantModal') }
			onOk = () => {
				dispatch(searchApprovalActions.insertCommonModal(() => parent.setState({ 'grantModal': false }), categoryTypeObj, '', 'insertJrPayment'))
			}
			childComponent = <div className='manager-content'>
				{
					contactsCardRange ?
						<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
						: ''
				}
				<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						disabledDate={(current) => {
							return moment(modalTemp.getIn(['pendingManageDto', 'pendingManageList', 0, 'oriDate'])) > current
						}}
						value={modalTemp.get('oriDate') ? moment(modalTemp.get('oriDate')) : ''}
						onChange={value => {
							const date = value.format('YYYY-MM-DD')
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriDate'], date))
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>摘要：</label>
					<Input
						onFocus={(e) => e.target.select()}
						value={modalTemp.get('oriAbstract')}
						onChange={(e) => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriAbstract'], e.target.value))
						}}
					/>
				</div>
					
				<div className='manager-item'>
					<label>{magenerType === 'debit'?'收款金额：':'付款金额：'}</label>
					<NumberInput
						value={modalTemp.get('amount')}
						onChange={(e) => {
							numberTest(e,(value) => {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'amount'], value))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'payment','actualAmount'], value))

							})
						}}
					/>
				</div>
				<Account
					modalTemp={modalTemp}
					dispatch={dispatch}
					accountList={accountList}
				/>
				{
					magenerType === 'debit'?
					<CalculatePandge
						dispatch={dispatch}
						accountPoundage={accountPoundage}
						modalTemp={modalTemp}
						flags={views}
						projectCardList={projectCardList}
						contactCardList={contactCardList}
					/>:''
				}
			</div>
				// </Modal>
			// )
		} else if (takeBackModal) {
			title = '收款核销'
			onCancel = () => { initModal('takeBackModal') }
			onOk = () => {
				dispatch(searchApprovalActions.insertCommonModal(() => parent.setState({ 'takeBackModal': false }), categoryTypeObj, '', 'insertJrTemporaryReceipt'))
			}
			childComponent = <div className='manager-content'>
			{
				contactsCardRange?
				<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
				:''
			}
			<div className='manager-item'><label>日期：</label>
			<DatePicker
				allowClear={false}
				disabledDate={(current) => {
					return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
				}}
				value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
				onChange={value => {
				const date = value.format('YYYY-MM-DD')
					dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriDate'], date))
				}}
			/>
			</div>
			<div className='manager-item'>
				<label>摘要：</label>
				<Input
					onFocus={(e) => e.target.select()}
					value={modalTemp.get('oriAbstract')}
					onChange={(e) => {
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriAbstract'], e.target.value))
					}}
				/>
			</div>
			<div className='manager-item'>
				<label>{`收款金额：`}</label>
				<NumberInput
					value={modalTemp.get('amount')}
					onChange={(e) => {
						numberTest(e,(value) => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'amount'], value))
						})
					}}
				/>
			</div>
			<Account
					modalTemp={modalTemp}
					dispatch={dispatch}
					accountList={accountList}
				/>
				{
					magenerType === 'debit'?
					<CalculatePandge
						dispatch={dispatch}
						accountPoundage={accountPoundage}
						modalTemp={modalTemp}
						flags={views}
						projectCardList={projectCardList}
						contactCardList={contactCardList}
					/>:''
				}
		</div>

		} else if (backModal) {
			title = '付款核销'
			onCancel = () => { initModal('backModal') }
			onOk = () => {
				dispatch(searchApprovalActions.insertCommonModal(() => parent.setState({ 'backModal': false }), categoryTypeObj, '', 'insertJrTemporaryPay'))
			}
			childComponent = <div className='manager-content'>
			{
				contactsCardRange?
				<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
				:''
			}
			<div className='manager-item'><label>日期：</label>
			<DatePicker
				allowClear={false}
				disabledDate={(current) => {
					return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
				}}
				value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
				onChange={value => {
				const date = value.format('YYYY-MM-DD')
					dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriDate'], date))
				}}
			/>
			</div>
			<div className='manager-item'>
				<label>摘要：</label>
				<Input
					onFocus={(e) => e.target.select()}
					value={modalTemp.get('oriAbstract')}
					onChange={(e) => {
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'oriAbstract'], e.target.value))
					}}
				/>
			</div>
			<div className='manager-item'>
				<label>{`付款金额：`}</label>
				<NumberInput
					value={modalTemp.get('amount')}
					onChange={(e) => {
						numberTest(e,(value) => {
							dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'amount'], value))
						})
					}}
				/>
			</div>
			<div className='manager-item'>
				<label>账户：</label>
				<Select
					// combobox
					value={modalTemp.getIn(['accounts',0,'accountName'])}
					onChange={value => {
						const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
						const accountName = value.split(Limit.TREE_JOIN_STR)[1]
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid}])))
					}}
					>
					{accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
				</Select>
			</div>
		</div>
		}

		if (manageModal || grantModal || takeBackModal || backModal) {
			return (
				<Modal
					visible={true}
					onCancel={onCancel}
					className='single-manager'
					title={title}
					okText='保存'
					onOk={onOk}
				>
					{childComponent}
					<Searchclosure
						type="ls"
						className="cxls-enclosure-wrap"
						dispatch={dispatch}
						permission={lrPermissionInfo.getIn(['edit', 'permission'])}
						enclosureList={enclosureList}
						label={label}
						closed={false}
						reviewed={false}
						enCanUse={enCanUse}
						checkMoreFj={checkMoreFj}
						getUploadTokenFetch={() => dispatch(searchRunningAllActions.getUploadTokenFetch())}
						getLabelFetch={() => dispatch(searchRunningAllActions.getRunningLabelFetch())}
						deleteUploadImgUrl={(index) => dispatch(searchRunningAllActions.deleteRunningEnclosureUrl(index))}
						changeTagName={(index, tagName) => dispatch(searchRunningAllActions.changeRunningTagName(index, tagName))}
						downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
						uploadEnclosureList={(value) => {
							dispatch(searchRunningAllActions.uploadFiles(...value))
						}}
						uploadKeyJson={uploadKeyJson}
					/>
				</Modal>
			)
		}  else {
			return null
		}
	}
}	
	
class Account extends React.Component {
	render() {
		const { modalTemp, dispatch, accountList } = this.props
		const amount = this.props.amount || modalTemp.get('amount')
		return(
			<div className='manager-item'>
				<label>账户：</label>
				<Select
					// combobox
					value={modalTemp.getIn(['accounts',0,'accountName'])}
					onChange={(value,options) => {
						const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
						const accountName = value.split(Limit.TREE_JOIN_STR)[1]
						const poundageObj = options.props.poundage
						const poundage = poundageObj.get('poundage')
						const poundageRate = poundageObj.get('poundageRate')
						const sxAmount = Math.abs(amount || 0)*poundageRate/1000> poundage && poundage > 0
							? poundage
							: Math.abs(amount || 0)*poundageRate/1000

						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'accounts'], fromJS([{ accountName,accountUuid,poundage:poundageObj }])))
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp','accounts',0,'poundageAmount'],sxAmount.toFixed(2)))
					}}
					>
					{accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) =>
						<Option
							key={i}
							value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
							poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
						>
							{v.get('name')}
						</Option>)
					}
				</Select>
			</div>
		)
	}
}
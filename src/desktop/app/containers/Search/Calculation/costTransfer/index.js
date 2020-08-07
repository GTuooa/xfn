import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox, Button,Modal, DatePicker, Input, Select  } from 'antd'
import { formatNum, formatDate, numberTest  } from 'app/utils'
import moment from 'moment'
import CostTransferTitle from './CostTransferTitle'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import { fromJS } from 'immutable'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'

@immutableRenderDecorator
export default
class CostTransferTable extends React.Component {
	// componentDidMount() {
	// 	this.props.dispatch(accountConfActions.getRunningAccount())
	// }
	// shouldComponentUpdate(nextprops, nextstate) {
	// 	return this.props.allState != nextprops.allState || this.props.configState != nextprops.configState || this.props.qcyeState != nextprops.qcyeState || this.state !== nextstate
	// }
	state = {
		carryoverModal:false
	}
	render() {
		const {
			ass,
			// main,
			isCheck,
			accountingType,
			costTransferList,
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			panes,
			editLrAccountPermission,
			cxlsState,
			accountList,
			showDrawer
		} = this.props

		const showList = costTransferList.get('childList')
		const { carryoverModal } = this.state
		// const selectAcAll = main === 'duty' ? (showList.size ? selectList.size === showList.size : false) : false
		const selectAcAll = showList.size ? selectList.size === showList.size : false

		const modalTemp = cxlsState.get('modalTemp')
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		const categoryType = runningFlowTemp.get('categoryType')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const runningDate = runningFlowTemp.get('runningDate')
		const magenerType = runningFlowTemp.get('magenerType')
		return (
			<TableAll type="with-new" className="mxb-table-left">
				<CostTransferTitle
					className={'cxls-account-cbjz-table-width'}
					// main={main}
					selectAcAll={selectAcAll}
					onClick={() => dispatch(calculationActions.accountItemCheckboxCheckAll(selectAcAll, 'costTransferList'))}
				/>
				<TableBody>
					{
						showList.map(v => {
							const checked = selectList.indexOf(v.get('uuid')) > -1
							const uuid = v.get('parentUuid') ? v.get('parentUuid') : v.get('uuid')
							return <TableItem className='cxls-account-cbjz-table-width' key={v.get('uuid')}>
								<li
									onClick={(e) => {
										e.stopPropagation()
										dispatch(calculationActions.accountItemCheckboxCheck(checked, v.get('uuid'), v.get('runningDate')))
									}}
								>
									<Checkbox checked={checked}/>
								</li>
								<li>{v.get('runningDate')}</li>
								<TableOver
									textAlign='left'
									isLink={true}
									onClick = {() => {
										dispatch(yllsActions.getYllsBusinessData(v,showDrawer))
										// dispatch(accountActions.getRunningBusinessDuty(v.get('flowNumber'),uuid,showList))
									}}
									>
									<span className="account-flowNumber">{v.get('flowNumber')}</span>
								</TableOver>
								<TableOver textAlign='left'>{v.get('categoryName')}</TableOver>
								<TableOver textAlign='left'>{v.get('runningAbstract')+(v.get('cardAbstract')?v.get('cardAbstract'):'')}</TableOver>
								<li>{v.get('manageTypeName')}</li>

								<li><Amount>{v.get('amount')}</Amount></li>

								<li><Button
									type='ghost'
									className='handle-btn'
									disabled={!editLrAccountPermission}
									onClick={() => {
										dispatch(cxlsActions.getBusinessCarryoverModal(v,() => {this.setState({
											carryoverModal:true
										})}))
									}}>
										{v.get('runningState') === 'STATE_YYSR_TS' ? '回退' : '结转'}

								</Button></li>

							</TableItem>
						})
					}
				</TableBody>
				<Modal
					visible={carryoverModal}
					onCancel={() => {
						this.setState({'carryoverModal':false})
						dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
					}}
					className='single-manager'
					title='成本结转'
					okText='保存'
					onOk={() => {
						dispatch(cxlsActions.insertlrAccountCarryoverModal(()=>this.setState({'carryoverModal':false}),'fromcalCultion'))
					}}
				>
					<div className='manager-content'>
						<div className='manager-item'><label>日期：</label>
						<DatePicker
							value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
							onChange={value => {
							const date = value.format('YYYY-MM-DD')
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
							}}
						/>
						</div>
						<div className='manager-item'>
							<label>摘要：</label>
							<Input
								value={modalTemp.get('runningAbstract')}
								onChange={(e) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
								}}
							/>
						</div>
						<div className='manager-item'>
							<label>金额：</label>
							<Input
								value={modalTemp.get('carryoverAmount')}
								onChange={(e) => {
									numberTest(e,(value) => {
										dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'carryoverAmount'], value))

									})
								}}
							/>
						</div>
					</div>

				</Modal>
			</TableAll>
		)
	}
}

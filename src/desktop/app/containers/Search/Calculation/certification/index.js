import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { TableWrap, TableBody, TableAll, TableItem, Amount, TableOver } from 'app/components'
import { Tooltip, Icon, Checkbox, Button, Modal, DatePicker, Input, Select } from 'antd'
import { formatNum, formatDate  } from 'app/utils'
import moment from 'moment'
import CertificationTitle from './CertificationTitle'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'

@immutableRenderDecorator
export default
class CertificationTable extends React.Component {
	// componentDidMount() {
	// 	this.props.dispatch(accountConfActions.getRunningAccount())
	// }
	// shouldComponentUpdate(nextprops, nextstate) {
	// 	return this.props.allState != nextprops.allState || this.props.configState != nextprops.configState || this.props.qcyeState != nextprops.qcyeState || this.state !== nextstate
	// }
	state = {
		defineModal:false
	}
	render() {
		const {
			ass,
			// main,
			isCheck,
			accountingType,
			certificationList,
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
		const { defineModal } = this.state
		const modalTemp = cxlsState.get('modalTemp')
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		const categoryType = runningFlowTemp.get('categoryType')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const runningDate = runningFlowTemp.get('runningDate')
		const magenerType = runningFlowTemp.get('magenerType')
		const showList = certificationList.get('childList')
		// const selectAcAll = main === 'duty' ? (showList.size ? selectList.size === showList.size : false) : false
		const selectAcAll = showList.size ? selectList.size === showList.size : false
		const jumpCxToLr = (callBack) => {
			if (panes.includes('LrAccount')) {
				Modal.confirm({
					title: '温馨提示',
					content: '录入流水页面有未保存数据，是否直接覆盖',
					okText: '确定',
					cancelText: '不',
					onOk: () => {
						callBack()
					}
				})
			} else {
				callBack()
			}
		}
		return (
			<TableAll type="with-new" className="mxb-table-left">
				<CertificationTitle
					className={'cxls-account-fprz-table-width'}
					// main={main}
					selectAcAll={selectAcAll}
					onClick={() => dispatch(calculationActions.accountItemCheckboxCheckAll(selectAcAll, 'certificationList'))}
				/>
				<TableBody>
					{
						showList.map(v => {
							const checked = selectList.indexOf(v.get('uuid')) > -1
							return <TableItem className='cxls-account-fprz-table-width' key={v.get('uuid')}>
								<li
									onClick={(e) => {
										e.stopPropagation()
										// dispatch(cxlsActions.getBusinessPayment(v,'',showList))
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
										// dispatch(accountActions.getRunningBusinessDuty(v.get('flowNumber'),v.get('parentUuid'),showList))
									}}
									>
									<span className="account-flowNumber">{v.get('flowNumber')}</span>
								</TableOver>
								<TableOver textAlign='left'>{v.get('categoryName')}</TableOver>
								<TableOver textAlign='left'>{v.get('runningAbstract')+(v.get('cardAbstract')?v.get('cardAbstract'):'')}</TableOver>
								<TableOver textAlign='left'>{v.get('manageTypeName')}</TableOver>
								<li><Amount>{v.get('amount')}</Amount></li>
								<li>{v.get('taxRate')}%</li>
								<li><Amount>{v.get('tax')}</Amount></li>
								<li><Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
									dispatch(cxlsActions.getBusinessDefineModal(v,() => {this.setState({
										defineModal:true
									})}))
								}}>认证</Button></li>

							</TableItem>
						})
					}
				</TableBody>
				<Modal
					visible={defineModal}
					onCancel={() => {
						this.setState({'defineModal':false})
						dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
					}}
					className='single-manager'
					title='发票认证'
					okText='保存'
					onOk={() => {
						dispatch(cxlsActions.insertlrAccountInvioceDefineModal(()=>this.setState({'defineModal':false}),'fromcalCultion'))
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
				</div>
			</Modal>
			</TableAll>
		)
	}
}

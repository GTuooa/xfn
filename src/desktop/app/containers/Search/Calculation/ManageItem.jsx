import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'
import { formatNum, formatDate, numberTest } from 'app/utils'
import { Icon, Checkbox, Button, message, Tooltip, Modal, DatePicker, Input, Select }	from 'antd'
import { TableItem, ItemTriangle, TableOver, Amount } from 'app/components'
import moment from 'moment'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

// yezi
import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as Limit from 'app/constants/Limit.js'
import {categoryTypeAll, type } from 'app/containers/components/moduleConstants/common'
@immutableRenderDecorator
export default
class ManageItem extends React.Component {
	state = {
		manageModal:false
	}
	render() {
		const {
			ass,
			isCheck,
			className,
			accountingType,
			item,
			line,
			main,
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			panes,
			editLrAccountPermission,
			cxlsState,
			accountList,
			calculationState,
			showDrawer
		} = this.props
		const { manageModal } = this.state
		const modalTemp = cxlsState.get('modalTemp')
		const direction = item.get('direction')
		let amount = Number(item.get('amount'))
		let notHandleAmount = Number(item.get('notHandleAmount'))
		const runningState = item.get('runningState')
		if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') { //退销退购 状态下前端取负数
			notHandleAmount = -Math.abs(notHandleAmount)
			amount = -Math.abs(amount)
		}

		const flowType = item.get('flowType')

		const isWithNotPayment = runningState === 'withNotPayment'
		const beManagemented = item.get('beManagemented')

		let AmountSumPay = 0
		let NotAmountSumPay = 0
		const getAmount = (amount, notHandleAmount, direction, flowType) => {
			let showAmount = amount.toFixed(2)//总
			let showNotAmount = notHandleAmount.toFixed(2)//未处理
			let receiveAmount, payAmount, receiveNotAmount, payNotAmount
			if(direction === 'debit') {
				payAmount = <div className="padding-no-content"></div>
				payNotAmount = <div className="padding-no-content"></div>
				if(flowType === 'FLOW_INADVANCE') {
					receiveAmount = <div className="amount-left">{(Math.abs(showAmount)).toFixed(2)}</div>
					receiveNotAmount = <div className="amount-left">{(Math.abs(showNotAmount)).toFixed(2)}</div>
				}else {
					receiveAmount = <div className="amount-right">{showAmount}</div>
					receiveNotAmount = <div className="amount-right">{showNotAmount}</div>
				}
			}else {
				receiveAmount = <div className="padding-no-content"></div>
				receiveNotAmount = <div className="padding-no-content"></div>
				if(flowType === 'FLOW_INADVANCE') {
					payAmount = <div className="amount-left">{(Math.abs(showAmount)).toFixed(2)}</div>
					payNotAmount = <div className="amount-left">{(Math.abs(showNotAmount)).toFixed(2)}</div>
				}else {
					payAmount = <div className="amount-right">{showAmount}</div>
					payNotAmount = <div className="amount-right">{showNotAmount}</div>
				}
			}
			return { receiveAmount, payAmount, receiveNotAmount, payNotAmount }
		}
		const { receiveAmount, payAmount, receiveNotAmount, payNotAmount } = getAmount(amount,notHandleAmount, direction, flowType)//未处理

		let assList = item.get('assList').size ? '' : item.get('acFullName')

		if (item.get('assList').size) {
			item.get('assList').forEach(v => assList = assList ? assList + '、' + v.get('assName') : v.get('assName'))
		}
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		const childList = calculationState.getIn(['payManageList','childList'])
		const uuidList = modalTemp.get('uuidList')
		const categoryType = runningFlowTemp.get('categoryType')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const runningDate = runningFlowTemp.get('runningDate')
		const magenerType = runningFlowTemp.get('magenerType')
		const usedCard = runningFlowTemp.get('usedCard')
		const assType = modalTemp.get('assType')
		const managerCategoryList = cxlsState.getIn(['flags','managerCategoryList'])


		const getCarrayOver = (item) => {
			const waitReceiving = item.get('waitReceiving')
			const waitPaying = item.get('waitPaying')
			const makeOut = item.get('makeOut')
			const carryover = item.get('carryover')
			const certified = item.get('certified')
			const received = item.get('received')
			const receiving = item.get('receiving')
			const turnOut = item.get('turnOut')
			const payed = item.get('payed')
			const paying = item.get('paying')
			const shouldReturn = item.get('shouldReturn')
			const runningType = item.get('runningType')
			let elementList = []
			switch (waitReceiving) {
				case '1':
					elementList.push(
						<div key='a1'>
							<span>暂收款</span>

						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='a2'>
							<span>全部收款</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='a3'>
							<span>部分收款</span>

						</div>
					)

			}
			switch (waitPaying) {
				case '1':
					elementList.push(
						<div key='b1'>
							<span>暂付款</span>

						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='b2'>
							<span>全部付款</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='b3'>
							<span>部分付款</span>

						</div>
					)

			}
			switch (paying) {
				case '1':
					elementList.push(
						<div key='z1'>
							<span>应付款</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>付
							</Button>
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='z2'>
							<span>全部核销</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='z3'>
							<span>部分核销</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>付
							</Button>
						</div>
					)

			}
			switch (received) {
				case '1':
					elementList.push(
						<div key='c1'>
							<span>预收款</span>
							<Button
								type='ghost'
								disabled={!editLrAccountPermission}
								className='handle-btn'
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>退
							</Button>
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='c2'>
							<span>全部核销</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='c3'>
							<span>部分核销</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>退
							</Button>
						</div>
					)

			}
			switch (payed) {
				case '1':
					elementList.push(
						<div key='d1'>
							<span>预付款</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
								}}
								>退
							</Button>
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='d2'>
							<span>全部核销</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='d3'>
							<span>部分核销</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
								}}
								>退
							</Button>
						</div>
					)

			}
			switch (receiving) {
				case '1':
					elementList.push(
						<div key='e1'>
							<span>应收款</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
									// dispatch(cxlsActions.getBusinessPayment(item,'single'))
								}}
								>收
							</Button>
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='e2'>
							<span>全部收款</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='e3'>
							<span>部分收款</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'debit'))
									// dispatch(cxlsActions.getBusinessPayment(item,'single'))
								}}
								>收
							</Button>
						</div>
					)

			}
			switch (shouldReturn) {
				case '1':
					elementList.push(
						<div key='f1'>
							<span>应退款</span>
							<Button
								type='ghost'
								className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>退
							</Button>
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key='f2'>
							<span>全部退款</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='f3'>
							<span>部分退款</span>
							<Button
								type='ghost'
								className='handle-btn'
								onClick={() => {
									dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
										manageModal:true
									})},'credit'))
								}}
								>退
							</Button>
						</div>
					)

			}


			return (
				<div>
					{elementList}
				</div>
			)
		}
		const checked = selectList.indexOf(item.get('uuid')) > -1

		const uuid = item.get('parentUuid') ? item.get('parentUuid') : item.get('uuid')


		return (
			<TableItem line={line+1} className={className} heightAuto={true}>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(calculationActions.accountItemCheckboxCheck(checked, uuid, item.get('runningDate')))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver>{item.get('runningDate')}</TableOver>
				<TableOver
					textAlign='left'
					isLink={true}
					onClick={() => {
						// dispatch(accountActions.getRunningBusinessDuty(item.get('flowNumber'),item.get('uuid'),childList))
						dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
					}}
					>
					<span className="account-flowNumber">{item.get('flowNumber')}</span>
				</TableOver>
				<TableOver textAlign='left'>{item.get('categoryName')}</TableOver>
				<TableOver textAlign='left'>{item.get('runningAbstract')+(item.get('cardAbstract')?item.get('cardAbstract'):'')}</TableOver>
				<TableOver textAlign='left'>{type[item.get('runningType')]}</TableOver>
				<li>
					{
						accountingType === 'manages' && isCheck ?
							<div>
								{receiveNotAmount}
								{payNotAmount}
							</div>
						:
							<div>{receiveNotAmount}</div>
					}
				</li>
				<li>
					{
						accountingType === 'manages' && isCheck ?
							<div>
								{receiveAmount}
								{payAmount}
							</div>
						:
							<div>{payNotAmount}</div>
					}
				</li>
				<TableOver textAlign='left'>
					{item.get('cardPersonName') ? item.get('cardPersonName') : ''}
				</TableOver>
				<li>
					{getCarrayOver(item)}
				</li>
				<Modal
					visible={manageModal}
					onCancel={() => {
						this.setState({'manageModal':false})
						dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
					}}
					className='single-manager'
					title={`${magenerType === 'debit'?'收款':'付款'}核销`}
					okText='保存'
					onOk={() => {
						dispatch(cxlsActions.insertlrAccountManagerModal(()=>this.setState({'manageModal':false}),categoryTypeObj,'fromcalCultion'))
					}}
					>
						<div className='manager-content'>
						<div><label>往来单位：</label>{`${usedCard && usedCard.get('code')} ${usedCard && usedCard.get('name')}`}</div>
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
							<label>{`${magenerType === 'debit'?'收款':'付款'}金额：`}</label>
							<Input
								value={modalTemp.get('handlingAmount')}
								onChange={(e) => {
									numberTest(e,(value) => {
										dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'handlingAmount'],value))
									})
								}}
							/>
						</div>
						<div className='manager-item'>
							<label>账户：</label>
							<Select
								// combobox
								value={modalTemp.get('accountName')}
								onChange={value => {
									const uuid = value.split(Limit.TREE_JOIN_STR)[0]
									const accountName = value.split(Limit.TREE_JOIN_STR)[1]
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountName'], value))
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountUuid'], uuid))
								}}
								>
								{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
							</Select>
						</div>
						{
							modalTemp.get('beOpened')?
								<div className='manager-item'>
									<label>{{
										AC_AR:'应收期初类别:',
										AC_AP:'应付期初类别:',
										AC_PP:'预收期初类别:',
										AC_ADV:'预付期初类别:'
									}[assType]}</label>
									<Select
									value={uuidList && uuidList.getIn([0,'categoryName'])?uuidList.getIn([0,'categoryName']):''}
									onSelect={value => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										const uuid = uuidList.getIn([0,'uuid'])
										const assType = uuidList.getIn([0,'assType'])
										const categoryName = valueList[1]
										const categoryUuid = valueList[2]
										const newUuidList = fromJS([{uuid,assType,categoryName,categoryUuid,beOpened:true}])
										dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp','uuidList'],newUuidList))
									}}
									>
									{managerCategoryList.get(0) && managerCategoryList.get(0).map((w, ii) => <Option key={ii} value={`${w.get('code')}${Limit.TREE_JOIN_STR}${w.get('name')}${Limit.TREE_JOIN_STR}${w.get('uuid')}`}>{w.get('name')}</Option>)}
									</Select>
								</div>:''
						}
					</div>
				</Modal>
			</TableItem>
		)
	}
}

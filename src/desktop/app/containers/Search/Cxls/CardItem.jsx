import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Checkbox, Button, message, Tooltip, Modal, DatePicker, Input, Select, Dropdown, Menu, Switch }	from 'antd'
import { TableItem, ItemTriangle, TableOver, Amount, DateLib } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import moment from 'moment'
// yezi
import { formatNum, formatDate, formatMoney, numberTest } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll, type, business, beforejumpCxToLr } from 'app/containers/components/moduleConstants/common'

import * as accountActions from 'app/redux/Search/account/accountUnuse.action'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action.js'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

@immutableRenderDecorator
export default
class CardItem extends React.Component {

	state = {
		show: false, //子流水下拉展开
		deleteModal: false, //标签组件的状态
		isSeleck: false,//是否勾选
		deleteHasFj: false,//删除的凭证中是否有附件
		manageModal: false,//单笔流水核算弹窗
		carryoverModal: false,//单笔成本结转流水弹窗
		invioceModal: false,//单笔开具发票弹窗
		defineModal: false,//单笔发票认证弹窗
		jzsyModal:false,//单笔结转损益弹窗
		yllsVisible: false
	}

	render() {
		const {
			className,
			item,
			line,
			main,
			dispatch,
			selectList,
			openCardModal,
			openRunningModal,
			issuedate,
			panes,
			cxlsState,
			accountList,
			editLrAccountPermission,
			reviewLrAccountPermission,
			editPzPermission,
			simplifyStatus,
			intelligentStatus,
			uuidList,
			showDrawer,
			onClose,
			inputValue
		} = this.props
		const { deleteModal, isSeleck, deleteHasFj, manageModal, carryoverModal, show, invioceModal, defineModal, yllsVisible, jzsyModal } = this.state

		// 生成或修改凭证权限
		const canCreateVc = simplifyStatus ? editPzPermission : reviewLrAccountPermission

		const direction = item.get('direction')
		const amount = Number(item.get('amount'))
		const beManagemented = item.get('beManagemented')
		const flags = cxlsState.get('flags')
		const isClose = flags.get('isClose')
		const isAccount = flags.get('isAccount')
		const projectList = flags.get('projectList')
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		// 计算已处理的金额
		let handled = Number(item.get('handleAmount'))
		let payDirection = ''
		let assList = item.get('assList')
		let assName = assList.size?assList.map(v => v.get('assName')):fromJS([])
		let zero = ""
		let medium = ""
		let all = ""
		let inAdvanceStr = ""
		let returnStr = ''
		const categoryType = runningFlowTemp.get('categoryType')
		const modalTemp = cxlsState.get('modalTemp')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const runningDate = runningFlowTemp.get('runningDate')
		const magenerType = runningFlowTemp.get('magenerType')

		const jumpCxToLr = (callBack) => beforejumpCxToLr(callBack, panes, Modal)

		let deleteVcId = [], deleteYear, deleteMonth
		item.get('vcList').map((u, i) => {
			deleteVcId.push(u.get('vcIndex'))
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})
		const NegativeAllowed = (item) => {
			return item.get('categoryType') === 'LB_FYZC'
			|| item.get('categoryType') === 'LB_GGFYFT'
			|| item.get('runningType') === 'LX_YJDK'
			|| item.get('runningType') === 'LX_SFJM'
			|| item.get('runningType') === 'LX_DKSHBX'
			|| item.get('runningType') === 'LX_DKSDS'
		}
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
			const categoryType = item.get('categoryType')
			let elementList = []
			let rightElementList = []
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
							<span>全部核销</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='a3'>
							<span>部分核销</span>

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
							<span>全部核销</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='b3'>
							<span>部分核销</span>

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
					editLrAccountPermission && rightElementList.push({name:'付款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})
					break
				case '2':
					elementList.push(
						<div key='z2'>
							<span>全部付款</span>
						</div>
					)
					break
				case '3':
					elementList.push(
						<div key='z3'>
							<span>部分付款</span>
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
					editLrAccountPermission && rightElementList.push({name:'付款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})
					break

			}

			switch (received) {
				case '1':
					elementList.push(
						<div key='c1'>
							<span>预收款</span>
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
					editLrAccountPermission && rightElementList.push({name:'退款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})
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
									})},'debit'))
								}}
								>退
							</Button>
						</div>
					)
					editLrAccountPermission && rightElementList.push({name:'付款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})
			}

			switch (payed) {
				case '1':
					elementList.push(
						<div key='d1'>
							<span>预付款</span>
							<Button
								type='ghost'
								disabled={!editLrAccountPermission}
								className='handle-btn'
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
					editLrAccountPermission && rightElementList.push({name:'付款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})

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
					editLrAccountPermission && rightElementList.push({name:'收款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'debit'))
					}})
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
					editLrAccountPermission && rightElementList.push({name:'收款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'debit'))
					}})

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
					editLrAccountPermission && rightElementList.push({name:'退款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})
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
					editLrAccountPermission && rightElementList.push({name:'退款',onClick:() => {
						dispatch(cxlsActions.getBusinessManagerModal(item,() => {this.setState({
							manageModal:true
						})},'credit'))
					}})

			}

			if(makeOut != 0) {
				if(makeOut == 1) {
					elementList.push(<div key='3'><span>未开票</span><Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
						dispatch(cxlsActions.getBusinessInvioceModal(item,() => {this.setState({
							invioceModal:true
						})}))
					}}>开票</Button></div>)
					editLrAccountPermission && rightElementList.push({name:'开票',onClick:() => {
						dispatch(cxlsActions.getBusinessInvioceModal(item,() => {this.setState({
							invioceModal:true
						})}))
					}})
				}
				else{elementList.push(<div key='h'><span>已开票</span></div>)}
			}
			if(carryover != 0) {
				if(carryover == 1) {
					elementList.push(
						<div key='4'><span>未结转</span>
							{
								runningType !== 'LX_ZZS_YKP'
								&& runningType !== 'LX_ZZS_WKP'
								&& runningType !== 'LX_ZZS_YRZ'
								&& runningType !== 'LX_ZZS_WRZ'?
								<Button
									type='ghost'
									className='handle-btn'
									disabled={!editLrAccountPermission}
									onClick={() => {
										if (categoryType === 'LB_CQZC') {
											dispatch(cxlsActions.getBusinessJzsyModal(item,() => {this.setState({
												jzsyModal:true
											})}))
										} else {
											dispatch(cxlsActions.getBusinessCarryoverModal(item,() => {this.setState({
												carryoverModal:true
											})}))
										}
									}}>结转
								</Button>
								:
								null
							}


					</div>)
					if (runningType !== 'LX_ZZS_YKP'
					&& runningType !== 'LX_ZZS_WKP'
					&& runningType !== 'LX_ZZS_YRZ'
					&& runningType !== 'LX_ZZS_WRZ'
					&& editLrAccountPermission ) {
						if (categoryType === 'LB_CQZC') {
							rightElementList.push({name:'结转',onClick:() => {
								dispatch(cxlsActions.getBusinessJzsyModal(item,() => {this.setState({
									jzsyModal:true
								})}))
							}})
						} else {
							rightElementList.push({name:'结转',onClick:() => {
								dispatch(cxlsActions.getBusinessCarryoverModal(item,() => {this.setState({
									carryoverModal:true
								})}))
							}})
						}
					}
			}
				else{elementList.push(<div key='i'><span>已结转</span></div>)}
			}
			if(certified != 0) {

				if(certified == 1) {
					elementList.push(<div key='5'><span>未认证</span><Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
						dispatch(cxlsActions.getBusinessDefineModal(item,() => {this.setState({
							defineModal:true
						})}))
					}}>认证</Button></div>)
					editLrAccountPermission && rightElementList.push({name:'退款',onClick:() => {
						dispatch(cxlsActions.getBusinessDefineModal(item,() => {this.setState({
							defineModal:true
						})}))
					}})
				}
				else{elementList.push(<div key='j'><span>已认证</span></div>)}
			}
			if(turnOut != 0) {
				if(turnOut == 1) {elementList.push(<div key='zc'><span>未转出</span></div>)}
				else{elementList.push(<div key='zc'><span>已转出</span></div>)}
			}

			return (
					{elementList,rightElementList}
			)
		}

		const checked = selectList ? selectList.indexOf(item.get('uuid')) > -1 : false
		const beBusiness = item.get('beBusiness')
		const runningState = item.get('runningState')
		const uuid = item.get('uuid')
		const parentItem = item
		const debitAmount = item.get('debitAmount')
		const creditAmount = item.get('creditAmount')

		const flowNumberOnClick = (item) => {
			dispatch(yllsActions.getYllsBusinessData(item,showDrawer))
		}

		return (
			<div>
			<TableItem line={line+1} className={className} heightAuto={true} key={item.get('uuid')}>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(cxlsActions.accountItemCheckboxCheck(checked, item))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver>{item.get('runningDate')}</TableOver>
				<TableOver
					textAlign='left'
					>
					{
						<span
							className='account-flowNumber'
						>
						<Dropdown overlay={(
							<Menu className='cxls-menu-content'>
								<Menu.Item key='del'
									disabled={!editLrAccountPermission || isClose}
									onClick={()=> {
									dispatch(cxlsActions.deleteAccountItemCardAndRunning(true,inputValue,[item.get('uuid')]))
								}}>

								<Tooltip placement="right" title={!editLrAccountPermission ? '权限不足' : isClose?'结账后不允许该操作':''}>
									<span className="setting-common-ant-dropdown-menu-item">删除</span>
								</Tooltip>
								</Menu.Item>
								<Menu.Divider />
								<Menu.Item key='sh' disabled={!canCreateVc|| isClose} onClick={() => {
									item.get('beCertificate')?
									dispatch(cxlsActions.deleteVcItemFetch(deleteYear, deleteMonth, deleteVcId, issuedate,inputValue))
									:
									dispatch(cxlsActions.runningInsertVc(fromJS([{uuid:item.get('uuid'),flowNumber:item.get('flowNumber')}]), 'Business', issuedate,inputValue))
								}}>
								<Tooltip placement="right" title={!canCreateVc?'权限不足':isClose?'结账后不允许该操作':''}>
									<span className="setting-common-ant-dropdown-menu-item">{!item.get('beCertificate')?simplifyStatus?'生成凭证':'审核':simplifyStatus?'删除凭证':'反审核'}</span>
								</Tooltip>
								</Menu.Item>
								{
									getCarrayOver(item).rightElementList.map((v,i) =>
										<Menu.Item key={i} onClick={v.onClick}>
											<span className="setting-common-ant-dropdown-menu-item">{v.name}</span>
										</Menu.Item>
									)
								}
								<Menu.Item key='edit'
									disabled={!editLrAccountPermission}
									onClick={() => {
										if (!beBusiness && runningState !== 'STATE_ZZ') {
											dispatch(cxlsActions.getBusinessPayment(item, '', uuidList))
										} else {
											if (runningState === 'STATE_YYSR_JZCB') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_JZCB', uuidList)))
											} else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_FPRZ', uuidList)))
											} else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_KJFP', uuidList)))
											} else if (runningState === 'STATE_ZCWJZZS') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_ZCWJZZS', uuidList)))
											} else if (runningState === 'STATE_ZZ') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_ZZ', uuidList)))
											} else if (runningState === 'STATE_CQZC_ZJTX') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(item, 'modify', 'LB_ZJTX', uuidList)))
											} else if (runningState === 'STATE_GGFYFT') {
												jumpCxToLr(() => dispatch(cxlsActions.jumpCommonCharge(item, uuidList)))
											} else if (runningState === 'STATE_CQZC_JZSY') {
												jumpCxToLr(() => dispatch(cxlsActions.getInitLraccountJzsy(item, uuidList)))
											} else {
												dispatch(accountActions.getRunningBusinessDuty(item.get('flowNumber'), item.get('uuid'), uuidList))
											}
										}
								}}>
								<Tooltip placement="right" title={!editLrAccountPermission ? '权限不足' :''}>
									<span className="setting-common-ant-dropdown-menu-item">修改</span>
								</Tooltip>
							</Menu.Item>

							</Menu>
						)} placement="topCenter" trigger={['contextMenu']}>
							<span className="ant-dropdown-link" onClick={() => {
								flowNumberOnClick(item)
							}} >
								{`${item.get('flowNumber')}${item.get('runningIndex') ? '_'+item.get('runningIndex') : ''}`}
						 </span>
					 </Dropdown>
					</span>
				}
					{
						item.get('childList').size?
							show?
								<Icon
									type="up"
									onClick={(e) => {
										e.stopPropagation()
										this.setState({show:false})
									}}
									className='account-show'
									style={{marginLeft: 5}}
								/>
								:
								<Icon
									type="down"
									onClick={(e) => {
										e.stopPropagation()
										this.setState({show:true})
									}}
									className='account-show'
									style={{marginLeft: 5}}
								/>
						:
						null
					}
				</TableOver>
				<TableOver textAlign='left' liOnClice={onClose}>{item.get('categoryName')}</TableOver>
				<TableOver textAlign='left' liOnClice={onClose}>{item.get('runningAbstract')+(item.get('cardAbstract')?item.get('cardAbstract'):'')}</TableOver>
				<TableOver textAlign='left' liOnClice={onClose}>
					{type[item.get('runningType')]}
				</TableOver>
				{
					isAccount?
					<TableOver textAlign='right'>
						{item.get('debitAmount')?formatMoney(item.get('debitAmount')):''}
					</TableOver>
					:
					<TableOver textAlign='right'>
						<div style={{marginRight:'4px'}}>
							{
								NegativeAllowed(item) && Number(item.get('amount')) < 0 ?
								`-${formatNum(Math.abs(item.get('amount')).toFixed(2))}`
								:
								formatNum(Math.abs(item.get('amount')).toFixed(2))
							}
						</div>
					</TableOver>
				}
				{
					isAccount?
					<TableOver textAlign='right'>
						{item.get('creditAmount')?item.get('creditAmount')< 0?`-${formatNum(Math.abs(item.get('creditAmount')).toFixed(2))}`:formatMoney(item.get('creditAmount')):''}
					</TableOver>
					:''
				}
				{
					isAccount?
					<TableOver textAlign='right'>
					{item.get('endAmount')?item.get('endAmount')< 0?`-${formatNum(Math.abs(item.get('endAmount')).toFixed(2))}`:formatMoney(item.get('endAmount')):''}
					</TableOver>
					:''
				}

				<TableOver textAlign='left'>
					{getCarrayOver(item).elementList}
				</TableOver>
				<TableOver textAlign='left'>
					{item.get('createName')}
				</TableOver>
				<li >
					{
						item.get('vcList') && item.get('vcList').size ? simplifyStatus ?
						<span style={{width:'100%'}}>
							{
								item.get('vcList').map((u, i) => (
									<div className="cxls-have-vc" key={i}>
										<span
											className="current-underline current-underline-color"
											style={{color: canCreateVc ? '#222' : '#ccc'}}
											onClick={() => {
												if (canCreateVc) {
													let vcindexList = item.get('vcList').toJS().map(v => `${v.year}-${v.month}-01_${v.vcIndex}`)
													dispatch(lrpzActions.getPzVcFetch([u.get('year'), u.get('month')].join('-'), u.get('vcIndex'), i, vcindexList))
													dispatch(allActions.showPzBomb(true,'Cxpz'))
												}
											}}
										>
												{`记-${u.get('vcIndex')}`}
										</span>
										<span
											className="current-underline current-underline-color"
											style={{color: canCreateVc ? '#222' : '#ccc'}}
											onClick={()=> {
												if (canCreateVc) {
													this.setState({'deleteModal':true})
													dispatch(cxlsActions.currentPz(u.get('year'), u.get('month'), [u.get('vcIndex')]))
												}

											}}
										>
											删除
										</span>

									</div>

								))
							}

						</span>
						:
						intelligentStatus ?
						<span style={{width:'100%'}}>
							{
								item.get('vcList').map((u, i) => (
									<div className="cxls-have-vc" key={i}>
										<span
											className="current-underline current-underline-color"
											style={{color: canCreateVc ? '#222' : '#ccc'}}
											onClick={() => {
												if (canCreateVc) {
													let vcindexList = item.get('vcList').toJS().map(v => `${v.year}-${v.month}-01_${v.vcIndex}`)
													dispatch(lrpzActions.getPzVcFetch([u.get('year'), u.get('month')].join('-'), u.get('vcIndex'), i, vcindexList))
													dispatch(allActions.showPzBomb(true,'Cxpz'))
												}
											}}
										>
												{`记-${u.get('vcIndex')}`}
										</span>
										<span
											className="current-underline current-underline-color"
											style={{color: canCreateVc ? '#222' : '#ccc'}}
											onClick={()=> {
												if (canCreateVc) {
													// this.setState({'deleteModal':true})
													// dispatch(cxlsActions.currentPz(u.get('year'), u.get('month'), [u.get('vcIndex')]))
													dispatch(cxlsActions.deleteVcItemFetch(u.get('year'), u.get('month'), [u.get('vcIndex')], issuedate,inputValue))
												}

											}}
										>
											反审核
										</span>

									</div>

								))
							}

						</span>
						:
						<span>
							<Button
								type="ghost"
								disabled={!canCreateVc}
								onClick={() => {
									if (canCreateVc) {
										dispatch(cxlsActions.deleteVcItemFetch(deleteYear, deleteMonth, deleteVcId, issuedate,inputValue))
									}
									}}
								>
									反审核
							</Button>
						</span>
						:
						<span>
							<Button
								type="ghost"
								disabled={item.get('beCertificate') || !canCreateVc}
								onClick={() => dispatch(cxlsActions.runningInsertVc(fromJS([{uuid:item.get('uuid'),flowNumber:item.get('flowNumber')}]), 'Business', issuedate,inputValue))}
								>
									{
										simplifyStatus ? '生成凭证' : '审核'
									}
							</Button>
						</span>
					}
				</li>
			</TableItem>
			{
				item.get('childList').size && show?
				item.get('childList').map(item => {
					let assList = item.get('assList')
					const beBusiness = item.get('beBusiness')
					const runningState = item.get('runningState')
					let assName = assList.size?assList.map(v => v.get('assName')):fromJS([])
					const amount = formatNum(Math.abs(item.get('amount')).toFixed(2))
					return (
						<TableItem line={line+1} className={className} heightAuto={true} key={item.get('uuid')}>
							<li>
								<Checkbox checked={checked}/>
							</li>
							<TableOver></TableOver>
							<TableOver
								isLink={true}
								textAlign='left'
								onClick={() => {
									flowNumberOnClick(parentItem)
									// if (!beBusiness) {
									// 	dispatch(cxlsActions.getBusinessPayment(parentItem,'',uuidList))
									// } else {
									// 	if (runningState === 'STATE_YYSR_JZCB') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(parentItem, 'modify', 'LB_JZCB',uuidList)))
									// 	} else if (runningState === 'STATE_FPRZ_CG' || runningState === 'STATE_FPRZ_TG') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(parentItem, 'modify', 'LB_FPRZ',uuidList)))
									// 	} else if (runningState === 'STATE_KJFP_XS' || runningState === 'STATE_KJFP_TS') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(parentItem, 'modify', 'LB_KJFP',uuidList)))
									// 	} else if (runningState === 'STATE_ZCWJZZS') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(parentItem, 'modify', 'LB_ZCWJZZS',uuidList)))
									// 	} else if (runningState === 'STATE_ZZ') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCalculateCxToLr(parentItem, 'modify', 'LB_ZZ',uuidList)))
									// 	} else if (runningState === 'STATE_GGFYFT') {
									// 		jumpCxToLr(() => dispatch(cxlsActions.jumpCommonCharge(parentItem,uuidList)))
									// 	} else {
									// 		dispatch(accountActions.getRunningBusinessDuty(parentItem.get('flowNumber'),parentItem.get('uuid'),uuidList))
									// 	}
									// }
								}}
							>
							 		{`${item.get('flowNumber')}${item.get('runningIndex') ? '_'+item.get('runningIndex') : ''}`}
							</TableOver>
							<TableOver textAlign='left'>{item.get('categoryName')}</TableOver>
							<TableOver textAlign='left'>{item.get('runningAbstract')+(item.get('cardAbstract')?item.get('cardAbstract'):'')}</TableOver>
							<TableOver textAlign='left'>
								{type[item.get('runningType')]}
							</TableOver>
							<TableOver textAlign='right'>
								<div style={{marginRight:'4px'}}>
									{
										isAccount && item.get('direction') === 'debit' ?
											Number(item.get('displayAmount')) < 0 ?
												`-${formatNum(Math.abs(item.get('displayAmount')).toFixed(2))}`
												:
												formatNum(Number(item.get('displayAmount')).toFixed(2))
											:
											!isAccount?
											Number(item.get('amount')) < 0 ?
												`-${formatNum(Math.abs(item.get('amount')).toFixed(2))}`
												:
												formatNum(Number(item.get('amount')).toFixed(2))
											:''
									}
								</div>
							</TableOver>
						{
							isAccount ?
							<TableOver textAlign='right'>
								{
									item.get('direction') === 'credit' ?
										 Number(item.get('displayAmount')) < 0 ?
										`-${formatNum(Math.abs(item.get('displayAmount')).toFixed(2))}`
										:
										item.get('displayAmount') > 0 ?
											formatNum(Number(item.get('displayAmount')).toFixed(2)):''
									:
									''
								}
							</TableOver>
							:''
						}
						{
							isAccount?
							<TableOver textAlign='right'>
								{
									item.get('endAmount')<0?
									`-${formatNum(Math.abs(item.get('endAmount')).toFixed(2))}`
									:
									item.get('endAmount')>0?
										formatNum(Number(item.get('endAmount')).toFixed(2))
										:''
								}
							</TableOver>
							:''
						}
							<TableOver textAlign='left'>
								{getCarrayOver(item).elementList}
							</TableOver>
							<li></li>
							<li></li>
						</TableItem>

					)
				})
				:
				null

		}

		<Modal ref="modal"
			visible={deleteModal}
			title="提示"
			onCancel={()=>this.setState({'deleteModal':false})}
			footer={[
				<Button key="back" type="ghost" size="large" onClick={()=>this.setState({'deleteModal':false})}>
					取消
				</Button>,
				<Button key="submit" type="primary" size="large" disabled={deleteHasFj ? !isSeleck : false}
					onClick={()=>{
						this.setState({'deleteModal':false,'isSeleck':false});
						dispatch(cxlsActions.deleteVcItemFetch(flags.get('currentYear'), flags.get('currentMonth'), flags.get('currentVcIndex').toJS(), issuedate,inputValue))
					}}>
					确定
				</Button>
			]}>
				<p style={{display: deleteHasFj ? 'none' : ''}}>
					{
						intelligentStatus ? '确定反审核吗？' : '确定删除凭证吗？'
					}
				</p>
		</Modal>
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
				dispatch(cxlsActions.insertlrAccountManagerModal(()=>this.setState({'manageModal':false}),categoryTypeObj))
			}}
			>
				<div className='manager-content'>
				<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
				<div className='manager-item'><label>日期：</label>
				<DatePicker
					allowClear={false}
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
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'handlingAmount'], value))

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
			</div>
		</Modal>
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
				dispatch(cxlsActions.insertlrAccountCarryoverModal(()=>this.setState({'carryoverModal':false})))
			}}
		>
			<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
				<DatePicker
					allowClear={false}
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
		<Modal
			visible={jzsyModal}
			onCancel={() => {
				this.setState({'jzsyModal':false})
				dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
			}}
			className='single-manager'
			title='结转损益'
			okText='保存'
			onOk={() => {
				dispatch(cxlsActions.insertlrAccountJzsyModal(()=>this.setState({'jzsyModal':false})))
			}}
		>
			<div className='manager-content'>
				<div className='manager-item'><label>日期：</label>
					<DatePicker
						allowClear={false}
						value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
						onChange={value => {
						const date = value.format('YYYY-MM-DD')
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
						}}
					/>
				{
					runningFlowTemp.get('beProject')?
					<Switch
						className="use-unuse-style"
						style={{marginLeft:'10px'}}
						checked={modalTemp.get('usedProject')}
						checkedChildren={'项目'}
						onChange={() => {
							dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'usedProject'], !modalTemp.get('usedProject')))
						}}
					/>:''
				}

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
				{
					modalTemp.get('usedProject')?
					<div className="manager-item" >
						<label>项目：</label>
						<Select
							combobox
							showSearch
							value={`${modalTemp.getIn(['projectCard','code'])?modalTemp.getIn(['projectCard','code']):''} ${modalTemp.getIn(['projectCard','name'])?modalTemp.getIn(['projectCard','name']):''}`}
							onChange={value => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								const uuid = valueList[0]
								const code = valueList[1]
								const name = valueList[2]
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'projectCard'], fromJS({uuid,code,name})))
							}}
							>
							{projectList.map((v, i) =>
								<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
									{`${v.get('code')} ${v.get('name')}`}
								</Option>
							)}
						</Select>
					</div>:''
				}


				<div className='manager-item'>
					<label>{modalTemp.get('netProfitAmount')>0?'净收益金额：':'净损失金额：'}</label>
					{modalTemp.get('netProfitAmount')>0?modalTemp.get('netProfitAmount'):modalTemp.get('lossAmount')}
				</div>
				<div className='manager-item'>
					<label>资产原值：</label>
					<Input
						value={modalTemp.getIn(['acAssets','originalAssetsAmount'])}
						onChange={(e) => {
							numberTest(e,(value) => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','originalAssetsAmount'], value))
								dispatch(cxlsActions.calculateGainForJzsy())

							})
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>累计折旧摊销：</label>
					<Input
						value={modalTemp.getIn(['acAssets','depreciationAmount'])}
						onChange={(e) => {
							numberTest(e,(value) => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','depreciationAmount'], value))
								dispatch(cxlsActions.calculateGainForJzsy())
							})
						}}
					/>
				</div>
				<div className='manager-item'>
					<label>处置金额：</label>
					{formatMoney(runningFlowTemp.get('amount')-runningFlowTemp.get('tax'))}
				</div>
			</div>

		</Modal>
		<Modal
			visible={invioceModal}
			onCancel={() => {
				this.setState({'invioceModal':false})
				dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
			}}
			className='single-manager'
			title='开具发票'
			okText='保存'
			onOk={() => {
				dispatch(cxlsActions.insertlrAccountInvioceModal(()=>this.setState({'invioceModal':false})))
			}}
		>
			<div className='manager-content'>
			<div className='manager-item'><label>日期：</label>
			<DatePicker
				allowClear={false}
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
				dispatch(cxlsActions.insertlrAccountInvioceDefineModal(()=>this.setState({'defineModal':false})))
			}}
		>
			<div className='manager-content'>
			<div className='manager-item'><label>日期：</label>
			<DatePicker
				allowClear={false}
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

		</div>

		)
	}
}

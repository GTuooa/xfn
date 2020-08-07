import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { DateLib }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline, Tabs, Tree } from 'antd'
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import  QcModal  from './QcModal'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import { toJS, fromJS } from 'immutable'
import moment from 'moment'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
@immutableRenderDecorator
export default
class ModifyModal extends React.Component {
	constructor() {
		super()
		this.state = {
			yllsVisible:false
    }
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}
	componentDidMount() {
		const { calculateTemp, flags, dispatch } = this.props
		const runningDate = calculateTemp.get('runningDate')
		const detail = calculateTemp.get('detail')
		const modify = flags.get('modify')
		const managerCategoryList = flags.get('managerCategoryList')
		modify && detail.forEach((item,index) => {
			if(item.get('beOpened') && !managerCategoryList.get(index)) {
				dispatch(lrAccountActions.getManagerCategoryList(index,item.get('assType')))
			}
		})
		runningDate && this.props.dispatch(lrAccountActions.getAccountObjectList(runningDate))
	}
	render() {
		const {
			onCancel,
			dispatch,
			showRunningInfo,
			showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal,
			calculateTemp,
			disabledBeginDate,
			flags,
			accountList,
			hideCategoryList,
			configPermissionInfo,
			yllsState,
			panes
		} = this.props
		const { yllsVisible } = this.state
		let paymentTypeList = {'LB_SFGL': '收付管理'}
		const paymentType = flags.get('paymentType')
		const paymentInsertOrModify = flags.get('paymentInsertOrModify')
		const isQuery = flags.get('isQuery')
		const selectedKeys = flags.get('selectedKeys')
		const disabledDate = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		const runningDate = calculateTemp.get('runningDate')
		const flowNumber = calculateTemp.get('flowNumber')
		const runningAbstract = calculateTemp.get('runningAbstract')
		const handleAmount = calculateTemp.get('handleAmount')
		const accountName = calculateTemp.get('accountName')
		const amount = calculateTemp.get('amount')
		const selectList = flags.get('selectList')
		const detail = calculateTemp.get('detail')
		const cardList = calculateTemp.get('cardList')
		const acList = calculateTemp.get('acList')
		const usedCard = calculateTemp.get('usedCard')
		const issuedate = flags.get('issuedate')
		const modify = flags.get('modify')
		const totalAmount = flags.get('totalAmount')
		const indexList = flags.get('indexList')
		const accountType = flags.get('accountType')
		const managerCategoryList = flags.get('managerCategoryList')
		const handlingAmount = calculateTemp.get('handlingAmount')
		const showContactsModal = flags.get('showContactsModal')
		const runningIndex = calculateTemp.get('runningIndex')
		const runningState = calculateTemp.get('runningState')
		const contactsCardRange = calculateTemp.get('contactsCardRange')
		const cardUuid = calculateTemp.get('cardUuid')
		const direction = calculateTemp.get('direction')
		const flowType = calculateTemp.get('flowType')
		const moedAmount = calculateTemp.get('moedAmount')
		const beMoed = calculateTemp.get('beMoed')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const MemberList = flags.get('MemberList')
		const selectThingsList = flags.get('selectThingsList')
		const thingsList = flags.get('thingsList')
		// const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const lsItemData = yllsState.get('lsItemData')
		const reg = /^\d*\.?\d{0,2}$/
		let selectAcAll
		if (accountType === 'single') {
			selectAcAll = selectList.size === 1 ? true :false
		} else {
			selectAcAll = detail && detail.size ? selectList.size === detail.size : false
		}
		let  acAndAssList =[]
		let debitAmount = 0
		let creditAmount = 0
		let checkedAmount1 = 0
		let checkedAmount2 = 0
		if(cardList && cardList.size) {
			cardList.forEach((v, i) => {
				acAndAssList.push(
					<Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>
					{`${v.get('code')} ${v.get('name')}`}
				</Option>
		)
		})
		}
		if(acList && acList.size) {
			acList.map((v, i) => {
				acAndAssList.push(
					<Option key={v.get('acId')} value={`${v.get('acId')}${Limit.TREE_JOIN_STR}${v.get('acFullName')}${Limit.TREE_JOIN_STR}ac`}>
						{v.get('acFullName')}
					</Option>
				)
		})
		}
		const getAmount = (notHandleAmount, handleAmount, direction, flowType) => {
			let showAmount
			if(isQuery) {
				showAmount = handleAmount.toFixed(2)
			}else if (modify) {
				showAmount = (notHandleAmount+handleAmount).toFixed(2)
			}else {
				showAmount = notHandleAmount.toFixed(2)
			}
			let amount1, amount2
			if(direction === 'debit') {
				if(flowType === 'FLOW_INADVANCE') {
					amount1 = <span className="left-span">{showAmount}</span>
					checkedAmount1 -= Number(showAmount)
				}else {
					amount1 = <span className="right-span">{showAmount}</span>
					checkedAmount1 += Number(showAmount)
				}
			}else {
				if(flowType === 'FLOW_INADVANCE') {
					amount2 = <span className="left-span">{showAmount}</span>
					checkedAmount2 -= Number(showAmount)
				}else {
					amount2 = <span className="right-span">{showAmount}</span>
					checkedAmount2 += Number(showAmount)
				}
			}
			return { amount1, amount2 }
		}
		let detailElementList = []
		if (detail && detail.size) {
			detail.forEach((item, index) => {
				const runningState = item.get('runningState')
				let notHandleAmount = Number(item.get('notHandleAmount'))
				let handleAmount = Number(item.get('handleAmount'))
				if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') { //退销退购 状态下前端取负数
					notHandleAmount = -Math.abs(notHandleAmount)
					handleAmount = -Math.abs(handleAmount)
				}
				const direction = item.get('direction')
				const flowType = item.get('flowType')
				const { amount1, amount2 } = getAmount(notHandleAmount, handleAmount, direction, flowType)
				const checked = selectList.indexOf(item.get('uuid')) > -1
					if(!isQuery) {
						detailElementList.push(
							<TableItem className='lrAccount-table-sfgl-width' key={item.get('uuid')}>
							<li
								onClick={(e) => {
									e.stopPropagation()
									if(runningIndex === 0) {
										if(item.get('beOpened') && !managerCategoryList.get(index)) {
											dispatch(lrAccountActions.getManagerCategoryList(index,item.get('assType')))
										}
										dispatch(lrAccountActions.accountItemCheckboxCheck(checked, item.get('uuid'), index))
										dispatch(lrAccountActions.accountTotalAmount(true))
									}
								}}
							>
								<Checkbox checked={checked} disabled={runningIndex !== 0}/>
							</li>
							<li>
								{item.get('runningDate')}
							</li>
							<TableOver
								textAlign='left'
								className='account-flowNumber'
								onClick={() => {
									dispatch(yllsActions.getYllsBusinessData(item,() => this.setState({yllsVisible: true})))
								}}
							>
								<span>{item.get('flowNumber')}</span>
							</TableOver>
							<li className='qichuye'>
								<span>
									{
									item.get('beOpened') && checked?
										<Select
											value={item.get('categoryName')}
											onSelect={value =>dispatch(lrAccountActions.changeBeforeAmount(item,value,index))}
											>
												{managerCategoryList.get(index) && managerCategoryList.get(index).map((v, i) => <Option key={i} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>{v.get('name')}</Option>)}
										</Select>
										:
										item.get('categoryName')
									}
								</span>
							</li>
							<li className='over-dian'>
								<span>{item.get('beOpened')?'期初余额':item.get('runningAbstract')}</span>
							</li>
							<li>
								{amount1}
							</li>
							<li>
								{amount2}
							</li>
						</TableItem>
					)
				} else {
					detailElementList.push(
						<TableItem className='lrAccount-table-sfgl-success-width' key={item.get('uuid')}>
							<li>
								{item.get('runningDate')}
							</li>
							<li>
								<span>{item.get('flowNumber')}</span>
							</li>
							<li className='over-dian'>
								<span>{item.get('categoryName')}</span>
							</li>
							<li className='over-dian'>
								<span>{item.get('beOpened')?'期初余额':item.get('runningAbstract')}</span>
							</li>
							<li>
								{amount1}
							</li>
							<li>
								{amount2}
							</li>
						</TableItem>
					)
				}
			})



		}
		return (
			paymentType === 'LB_SFGL'?
				isQuery ?
                <div className="accountConf-modal-list accountConf-modal-list-hidden">
					<div className="accountConf-modal-list-item">
                        <label>流水号：</label>
                        <div>{flowNumber}</div>
                    </div>
					<div className="accountConf-modal-list-item">
                        <label>日期：</label>
                        <div>{runningDate}</div>
                    </div>
					<div className="accountConf-modal-list-item">
						<label>流水类别：</label>
						<div>{paymentTypeList[paymentType]}</div>
					</div>

					<div className="accountConf-modal-list-item">
						<label>往来单位：</label>
						<div>{`${usedCard.get('code')?usedCard.get('code'):''} ${usedCard.get('name')?usedCard.get('name'):''}`}</div>
                    </div>
					<div className='accountConf-separator'></div>

                    <div className="accountConf-modal-list-item">
                        <label>摘要：</label>
                        <div>{runningAbstract}</div>
                    </div>
					<div className="accountConf-modal-list-item">
                        <label>{`${totalAmount>=0?'收':'付'}款金额：`}</label>
                        <div>{handleAmount === undefined ? '' : handleAmount.toFixed(2)}</div>
                    </div>
                    <div className="accountConf-modal-list-item" style={{display:accountName?'':'none'}}>
                        <label>账户：</label>
                        <div>{accountName}</div>
                    </div>
					{
						beMoed?
						<div className="accountConf-modal-list-item">
	                        <label>抹零金额：</label>
	                        <div>{moedAmount.toFixed(2)}</div>
	                    </div>:''
					}
					<div className='accountConf-separator'></div>
					<div style={{margin:'10px 0'}}>核账详情：</div>
                    <TableAll className="lrAccount-table">
						<TableTitle
							className="lrAccount-table-sfgl-success-width"
							titleList={[ '日期','流水号','流水类别','摘要','收款核销','付款核销']}
						/>
						<TableBody>
							{
								detailElementList

							}
							<TableItem className='lrAccount-table-sfgl-success-width' key='total'>
								<li	></li>
								<li></li>
								<li></li>
								<li>合计</li>
								<li>
									{
										checkedAmount1?
											checkedAmount1<0?
												<span className="left-span">{Math.abs(checkedAmount1).toFixed(2)}</span>
												:
												<span className="right-span">{checkedAmount1.toFixed(2)}</span>
											:
											''
									}
								</li>
								<li>
									{
										checkedAmount2?
											checkedAmount2<0?
												<span className="left-span">{Math.abs(checkedAmount2).toFixed(2)}</span>
												:
												<span className="right-span">{checkedAmount2.toFixed(2)}</span>
											:
											''
									}
							</li>

							</TableItem>
						</TableBody>
					</TableAll>
				</div>
				:
				<div className="accountConf-modal-list accountConf-modal-list-hidden">
					<div className="accountConf-modal-list-item">
						<label>日期：</label>
						<div>
							<DatePicker
								allowClear={false}
								disabled={runningIndex != 0}
								disabledDate={(current) => {
									if (modify) {
										const detailDate = detail.getIn([0, 'runningDate'])
										return disabledDate(current, modify, detailDate)
									} else {
										return disabledDate(current)
									}


								}}
								value={moment(runningDate)}
								onChange={value => {
								const date = value.format('YYYY-MM-DD')
								dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'runningDate', date))
								if(paymentType === 'LB_SFGL' && paymentInsertOrModify === 'modify'){
									return
								}else{
									dispatch(lrAccountActions.getAccountObjectList(date))
									if(cardUuid) {
										dispatch(lrAccountActions.getBusinessList(date, cardUuid))
									}
								}

							}}/>
						</div>
					</div>
						<div className="accountConf-modal-list-item">
							<label>流水类别：</label>
							<div>
								<Select
									disabled={modify || accountType === 'single'}
									value={paymentTypeList[paymentType]}
									onChange={value => {
										dispatch(lrAccountActions.changeLrAccountCommonString('',['flags','paymentType'],value))
									}}
									>
										{
											hideCategoryList && hideCategoryList.size ? hideCategoryList.map(item => {
												return <Option key={item.get('uuid')} value={item.get('categoryType')}>
													{item.get('name')}
												</Option>
											})
											:
											null
									}

								</Select>
							</div>

						</div>
						<div className="accountConf-modal-list-item">
							<label>往来单位：</label>
							<div className='chosen-right'>
								<Select
									showSearch
									disabled={modify}
									combobox
									value={`${usedCard.get('code')?usedCard.get('code'):''} ${usedCard.get('name')?usedCard.get('name'):''}`}
									onChange={
										value => {
											const valueList = value.split(Limit.TREE_JOIN_STR)
											const code =  valueList[0]
											const name = valueList[1]
											const uuid = valueList[2]
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'cardUuid', uuid))
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', ['usedCard','code'], code))
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', ['usedCard','name'], name))
											if(runningDate) {
												dispatch(lrAccountActions.getBusinessList(runningDate, uuid))
											}
										}
									}
									>
									{acAndAssList}
								</Select>
								<div className='chosen-word'
									onClick={() => {
										if (!modify) {
											dispatch(lrAccountActions.getManagesCardList(runningDate))
											dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'contacts'))
										}
								}}>选择</div>
							</div>
						</div>
						<div className="accountConf-modal-list-item">
							<label>摘要：</label>
								<div>
									<Input

										value={runningAbstract}
										onChange={(e) => {
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'runningAbstract', e.target.value))
										}}
									/>
								</div>
							</div>
						<div className="accountConf-modal-list-item">
							<label>{`${totalAmount>=0?'收':'付'}款金额：`}</label>
							<div>
								<Input
									disabled={runningIndex != 0}
									value={handlingAmount}
									onChange={(e) => {
										//e.targt.value小于计提
										if (e.target.value === undefined)
											return

										let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
										if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
											value = value.substr(1)
										}
										if (reg.test(value) || value === '') {
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'handlingAmount', value))
										} else {
											message.info('金额只能输入带两位小数的数字')
										}

									}}
								/>
							</div>
						</div>
						<div className="accountConf-modal-list-item" style={{display:handlingAmount>0?'':'none'}}>
							<label>账户：</label>
							<div className="lrls-account-box">
								<Select
									// combobox
									disabled={runningIndex != 0}
									value={accountName}
									onChange={value => value || dispatch(lrAccountActions.changeLrAccountAccountName('calculate', 'accountUuid', 'accountName', value))}
									onSelect={value => dispatch(lrAccountActions.changeLrAccountAccountName('calculate', 'accountUuid', 'accountName', value))}
									>
									{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
								</Select>
								<Button
									disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
									className="title-right"
									type="ghost"
									onClick={()=>{
										dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
										dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
									}}
									>
										新增
									</Button>
								</div>
							</div>
							<div className="accountConf-modal-list-item" >
								<span style={{marginRight:'10px'}}>
									<Checkbox
										checked={beMoed}
										onChange={(e) => {
											dispatch(lrAccountActions.changeLrAccountCommonString('calculate','beMoed', !beMoed))
										}}
									/>
								</span>
									<label className='large-width-label'>{`应${totalAmount>=0?'收':'付'}抹零`}</label>
							</div>
							{
								beMoed?
								<div className="accountConf-modal-list-item">
									<label>抹零金额：</label>
									<div>
										<Input
											// disabled={runningIndex != 0}
											value={moedAmount}
											onChange={(e) => {
												//e.targt.value小于计提
												if (e.target.value === undefined)
													return

												let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
												if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
													value = value.substr(1)
												}
												if (reg.test(value) || value === '') {
													dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'moedAmount', value))
												} else {
													message.info('金额只能输入带两位小数的数字')
												}

											}}
										/>
									</div>
								</div>:''
							}

						<div className='accountConf-separator'></div>
						<div className='lrAccount-detail-title'>
							<div className="lrAccount-detail-title-top">请勾选需要核账的流水：</div>
							<div className='lrAccount-detail-title-bottom'>
								<span>
									已勾选流水：{indexList.size}条
								</span>
								<span>
									{`待核销${totalAmount>=0?'收':'付'}款金额：`}<span>{totalAmount?Math.abs(totalAmount).toFixed(2):'0.00'}</span>
								</span>
							</div>
						</div>
						<TableAll className="lrAccount-table">
							<TableTitle
								className="lrAccount-table-sfgl-width"
								titleList={['日期','流水号','流水类别','摘要', '预收/应收','预付/应付']}
								disabled={runningIndex !== 0}
								hasCheckbox={true}
								selectAcAll={selectAcAll}
								onClick={(e) => {
										e.stopPropagation()
										if (runningIndex === 0) {
											if(accountType === 'single') {
												dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, fromJS([calculateTemp])))
											} else {
												dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, detail))
											}
											dispatch(lrAccountActions.accountTotalAmount(true))
										}

								}}
							/>
							<TableBody>

							{detailElementList}
							<TableItem className='lrAccount-table-sfgl-width' key='total'>
								<li	></li>
								<li></li>
								<li></li>
								<li></li>
								<li>合计</li>
								<li>
									{
										checkedAmount1?
											checkedAmount1<0?
												<span className="left-span">{Math.abs(checkedAmount1).toFixed(2)}</span>
												:
												<span className="right-span">{Math.abs(checkedAmount1).toFixed(2)}</span>
											:
											''
									}
								</li>
								<li>
									{
										checkedAmount2?
											checkedAmount2<0?
												<span className="left-span">{Math.abs(checkedAmount2).toFixed(2)}</span>
												:
												<span className="right-span">{Math.abs(checkedAmount2).toFixed(2)}</span>
											:
											''
									}
								</li>

							</TableItem>
						</TableBody>
					</TableAll>
					{
						yllsVisible ?
						<Ylls
							yllsVisible={yllsVisible}
							dispatch={dispatch}
							yllsState={yllsState}
							onClose={() => this.setState({yllsVisible: false})}
							editLrAccountPermission={true}
							panes={panes}
							lsItemData={lsItemData}
							uuidList={detail.filter((v,i) => i>0 ? v.get('uuid') !== detail.getIn([i-1,'uuid']):true)}
							showDrawer={() => this.setState({yllsVisible: true})}
							refreshList={() => dispatch(lrAccountActions.getBusinessList(runningDate, cardUuid))}
							// inputValue={inputValue}
						/>
						: ''
					}				
					<QcModal
						showContactsModal={showContactsModal}
						MemberList={MemberList}
						thingsList={thingsList}
						selectThingsList={selectThingsList}
						dispatch={dispatch}
						currentCardType={'contacts'}
						modalName={'showContactsModal'}
						palceTemp={'calculate'}
						runningState={runningState}
						runningDate={runningDate}
						// categoryTypeObj={categoryTypeObj}
						selectedKeys={selectedKeys}
					/>

				</div>
				:
				null
		)
	}
}

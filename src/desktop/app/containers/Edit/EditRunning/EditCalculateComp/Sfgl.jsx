import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'
import moment from 'moment'

import { formatDate,numberCalculate, formatMoney, debounce, decimal }	from 'app/utils'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Tabs, Tree, Divider, Pagination, Tooltip, Radio, Switch } from 'antd'
import { Icon } from 'app/components'
const { Search } = Input
const { RangePicker } = DatePicker
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
const Option = Select.Option
import { TableBody, TableTitle, TableItem, TableAll, Amount, TableOver,TableBottomPage } from 'app/components'
import XfIcon from 'app/components/Icon'


import * as Limit from 'app/constants/Limit.js'
import { numberTest } from './component/numberTest'
import MultiAccountComp from './component/MultiAccountComp'
import  SingleModal  from '../SingleModal'
import NumberInput from './component/NumberInput'
import  PayCategorySelect  from './component/PayCategorySelect'
import CategorySelect from './component/CategorySelect'
import AccountSfglPandge from './component/AccountSfglPandge'
import { getUuidList } from './component/CommonFun'
import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'

@immutableRenderDecorator
export default
class Sfgl extends React.Component {

	static displayName = 'Sfgl'

	constructor() {
		super()
		this.state = {
            showModal: false,
			showDateModal: false,
			selectBeginDate:'',
			selectEndDate:'',
        }
	}

	componentDidMount() {
		const { SfglTemp, flags, dispatch, insertOrModify } = this.props
		const oriDate = this.props.oriDate
		const detail = SfglTemp.get('detail')
		const modify = insertOrModify === 'modify' ? true : false
		const managerCategoryList = SfglTemp.get('managerCategoryList')
		// modify && detail.forEach((item,index) => {
		// 	if(item.get('beOpened') && item.get('beCard') && !managerCategoryList.getIn([index,'category'])) {
		// 		dispatch(editCalculateActions.getManagerCategoryList(index,item.get('uuid')))
		// 	}
		// })
		if(this.props.needSendRequest){
			oriDate && !modify && this.props.dispatch(editCalculateActions.getContactsCardList(oriDate))
			!modify && this.props.dispatch(editCalculateActions.getPayManageList({
				oriDate,
				categoryUuidList: fromJS([]),
				cardUuidList:fromJS([]),
				oriUuid:'',
				currentCardPage: 1
			}))
		}

	}
	render() {
		const {
			onCancel,
			dispatch,
			showRunningInfo,
			showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal,
			SfglTemp,
			disabledBeginDate,
			firstDisabledBeginDate,
			flags,
			accountList,
			hideCategoryList,
			configPermission,
			panes,
			memberList,
			thingsList,
			insertOrModify,
			calculateViews,
			paymentType,
			isCheckOut,
			accountPoundage
		} = this.props
		const { showModal,showDateModal,selectBeginDate,selectEndDate } = this.state

		dispatch(editRunningAllActions.changeEditCalculateNeedSendRequest())

		const mlShow = true; //抹零屏蔽
		// let paymentTypeList = {'LB_SFGL': '收付管理'}
		const paymentTypeStr = calculateViews.get('paymentTypeStr')
		// const paymentType = flags.get('paymentType')
		const selectedKeys = flags.get('selectedKeys')
		const disabledDate = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}
		const oriUuid = SfglTemp.get('oriUuid')
		// const oriDate = insertOrModify === 'insert'?this.props.oriDate:SfglTemp.get('oriDate')
		const oriDate = this.props.oriDate
		const jrIndex = SfglTemp.get('jrIndex')
		const oriAbstract = SfglTemp.get('oriAbstract')

		const dateFormat = 'YYYY-MM-DD'
		const beginDate = SfglTemp.get('beginDate')
		const endDate = SfglTemp.get('endDate')

		const categoryUuid = SfglTemp.get('categoryUuid')
		const categoryName = SfglTemp.get('categoryName')
		const categoryUuidList = SfglTemp.get('categoryUuidList')
		const categoryNameList = SfglTemp.get('categoryNameList')
		const categoryNameAll = SfglTemp.get('categoryNameAll')
		const cardUuidList = SfglTemp.get('cardUuidList')
		const cardNameList = SfglTemp.get('cardNameList')
		const cardNameAll = SfglTemp.get('cardNameAll')


		const handleTypeCard = SfglTemp.get('handleTypeCard')
		const handleAmount = SfglTemp.get('handleAmount')
		const accountListAmount = SfglTemp.get('accountListAmount')
		const accountName = SfglTemp.get('accountName')
		const amount = SfglTemp.get('amount')
		const isModeRunning = SfglTemp.get('isModeRunning')
		const pageSize = SfglTemp.get('pageSize')
		const totalNumber = SfglTemp.get('totalNumber')

		const selectList = calculateViews.get('selectList')
		const modifycurrentPage = SfglTemp.get('modifycurrentPage')
		const start = (modifycurrentPage - 1) * pageSize
		const end = modifycurrentPage * pageSize
		const oriDetail = SfglTemp.get('detail')
		const detail = insertOrModify === 'insert' ? SfglTemp.get('detail') : SfglTemp.get('detail').slice(start,end)
		const cardList = SfglTemp.get('cardList') ? SfglTemp.get('cardList') : fromJS([])
		const debitTotal = SfglTemp.get('debitTotal')
		const creditTotal = SfglTemp.get('creditTotal')
		const categoryList = SfglTemp.get('categoryList')
		// const acList = SfglTemp.get('acList')
		const usedCard = SfglTemp.get('usedCard')
		const cardPages = SfglTemp.get('cardPages')
		const currentCardPage = SfglTemp.get('currentCardPage')
		const issuedate = flags.get('issuedate')

		const modify = insertOrModify === 'modify' ? true : false
		const totalAmount = calculateViews.get('totalAmount')
		const indexList = calculateViews.get('indexList')
		const selectItem = calculateViews.get('selectItem')
		const managerCategoryList = SfglTemp.get('managerCategoryList')
		const handlingAmount = Number(SfglTemp.get('handlingAmount')) < 0 ? -Number(SfglTemp.get('handlingAmount')) : SfglTemp.get('handlingAmount')
		const showSingleModal = flags.get('showSingleModal')
		const runningIndex = SfglTemp.get('runningIndex')
		const runningState = SfglTemp.get('runningState')
		const contactsCardRange = SfglTemp.get('contactsCardRange')
		const cardUuid = SfglTemp.get('cardUuid')
		const direction = SfglTemp.get('direction')
		const flowType = SfglTemp.get('flowType')
		const moedAmount = SfglTemp.get('moedAmount')
		const beMoed = SfglTemp.get('beMoed')
		const condition = SfglTemp.get('condition')
		const writeOffTypeList = SfglTemp.get('writeOffTypeList')
		const writeOffType = SfglTemp.get('writeOffType')
		const showDKModal = SfglTemp.get('showDKModal')
		const chooseWriteOffType = SfglTemp.get('chooseWriteOffType')
		const unAutomatic = SfglTemp.get('unAutomatic')
		const showHXModal = SfglTemp.get('showHXModal')
		const oriState = SfglTemp.get('oriState')
		const oldSelectItem = SfglTemp.get('oldSelectItem')
		const usedAccounts = SfglTemp.get('usedAccounts')
		const accounts = SfglTemp.get('accounts')
		const selectThingsList = flags.get('selectThingsList')
		// const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const reg = /^\d*\.?\d{0,2}$/
		let selectAcAll = true
		detail && detail.size && detail.map( item => {
			if(selectList.indexOf(item.get('uuid')) === -1){
				selectAcAll = false
			}
			// selectAcAll = selectList.indexOf(item.get('uuid')) === -1 ? false : true
		})
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

		let detailElementList = []
		let manualWriteOffList = []
		// let creditTotalAmount = 0
		// let debitTotalAmount = 0
		let detailDate = formatDate().slice(0,10)
		let curDateTime = 0
		let allQcList = true
		let hxdebitAmount = 0, hxCreditAmount = 0, hxReceiptAmount = 0, hxWipeZeroAmount = 0

		const amountTest = (amount,handleAmount,moedAmount,dealFun) => {
			if(Math.abs(numberCalculate(handleAmount,moedAmount)) > Math.abs(Number(amount))){
				message.info(`金额不能${Number(amount) > 0 ? '大于' : '小于'}待处理流水`)
			}else{
				dealFun()
			}
		}
		const modifyAmountTest = (amount,dealAmount,dealFun) => {
			if(Math.abs(Number(dealAmount)) > Math.abs(Number(amount))){
				message.info(`金额不能${Number(amount) > 0 ? '大于' : '小于'}待处理流水`)
			}else{
				dealFun()
			}
		}

		selectItem && selectItem.size && selectItem.map((item,index) => {
			const itemDate = new Date(item.get('oriDate')).getTime()
			// 不能早于前置流水最晚日期
			if(selectList.indexOf(item.get('uuid')) > -1){
				detailDate = curDateTime > itemDate ? detailDate : item.get('oriDate')
				curDateTime = new Date(detailDate).getTime()
			}

			const checked = selectList.indexOf(item.get('uuid')) > -1
			let managerCategory = fromJS([]),category = []
			managerCategoryList && managerCategoryList.toJS().map((v,i) => {
				if(v && v.uuid === item.get('uuid')){
					category = v.category.childList
					managerCategory = fromJS(category)
				}
			})

			const NegativeAllowed = Number(item.get('amount')) < 0 ? true : false
			const onlyNegative = Number(item.get('amount')) < 0 ? true : false
			if(item.get('direction') === 'debit'){
				hxdebitAmount = numberCalculate(hxdebitAmount,item.get('amount'))
				hxReceiptAmount = numberCalculate(hxReceiptAmount,item.get('handleAmount'))
				hxWipeZeroAmount = numberCalculate(hxWipeZeroAmount,item.get('moedAmount'))
			}else{
				hxCreditAmount = numberCalculate(hxCreditAmount,item.get('amount'))
				hxReceiptAmount = numberCalculate(hxReceiptAmount,item.get('handleAmount'),2,'subtract')
				hxWipeZeroAmount = numberCalculate(hxWipeZeroAmount,item.get('moedAmount'),2,'subtract')
			}

			manualWriteOffList.push(
				<TableItem className={!modify && beMoed ? 'running-sfgl-hx-modal-insert' : 'running-sfgl-hx-modal-modify'} key={item.get('uuid')} line={index+1}>
				<li>
					{item.get('oriDate')}
				</li>
				<TableOver
					textAlign='center'
					className='account-flowNumber'
					onClick={(e) => {
						e.stopPropagation()
						dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls'))
					}}
				>
					<span>{item.get('jrIndex') ? `${item.get('jrIndex')}号` : ''}</span>
				</TableOver>
				<li className='qichuye'>
					<span onClick={()=>{
						if(item.get('beOpened') && item.get('beCard') && !managerCategoryList.getIn([index,'category'])) {
							dispatch(editCalculateActions.getManagerCategoryList(index,item.get('uuid')))
						}

					}}>
						{
						item.get('beCard') && checked?
							<PayCategorySelect
								treeData={managerCategory}
								value={item.get('categoryName')}
								placeholder=""
								parentsDisable={true}
								treeCheckable={false}
								id='sfgl-select-running'
								onChange={value => {
									dispatch(editCalculateActions.changeBeforeAmount(value,index,item.get('uuid')))
								}}
							/> :
							<Tooltip
								placement="topLeft"
								title={item.get('categoryFullName')}
							>
								{item.get('categoryName')}
							</Tooltip>

						}
					</span>
				</li>
				<li className='over-dian'>
					<span>
						<Tooltip
							placement="topLeft"
							title={item.get('oriAbstract')}
						>
							{item.get('oriAbstract')}
						</Tooltip>
					</span>
				</li>
				<li>
					<p>
						<Amount>
							{item.get('direction') === 'debit' ? item.get('amount'): ''}
						</Amount>
					</p>
					<p>
						<Amount>
							{item.get('direction') === 'credit' ? item.get('amount'): ''}
						</Amount>
					</p>

				</li>
				{
					!modify ?
					<Fragment>
						<li>
							<span>
								<NumberInput
									value={item.get('handleAmount')}
									onChange={(e) => {
										numberTest(e, (value) => {
											amountTest(item.get('amount'),value,item.get('moedAmount'),()=>dispatch(editCalculateActions.changeEditCalculateCommonString('', ['views','selectItem',index,'handleAmount'], value)))

										},NegativeAllowed,'金额',onlyNegative)
									}}
								/>
							</span>
						</li>
						{
							beMoed ?
							<li>
								<span>
									<NumberInput
										value={item.get('moedAmount')}
										onChange={(e) => {
											numberTest(e, (value) => {
												amountTest(item.get('amount'),item.get('handleAmount'),value,()=>dispatch(editCalculateActions.changeEditCalculateCommonString('', ['views','selectItem',index,'moedAmount'], value)))
											},NegativeAllowed,'金额',onlyNegative)
										}}
									/>
								</span>
							</li> : ''
						}

					</Fragment> :
					!isModeRunning ?
					<li>
						<span>
							<NumberInput
								value={item.get('handleAmount')}
								onChange={(e) => {
									numberTest(e, (value) => {
										modifyAmountTest(item.get('amount'),value,()=>{
											dispatch(editCalculateActions.changeEditCalculateCommonString('', ['views','selectItem',index,'handleAmount'], value))
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', hxReceiptAmount))
										})
									},NegativeAllowed,'金额',onlyNegative)
								}}
							/>
						</span>
					</li> :
					<li>
						<span>
							<NumberInput
								value={item.get('moedAmount')}
								onChange={(e) => {
									numberTest(e, (value) => {
										modifyAmountTest(item.get('amount'),value,()=>dispatch(editCalculateActions.changeEditCalculateCommonString('', ['views','selectItem',index,'moedAmount'], value)))
									},NegativeAllowed,'金额',onlyNegative)
								}}
							/>
						</span>
					</li>
				}

				</TableItem>
			)
		})

		const finalUuidList = getUuidList(detail) // 上下条

		if (detail && detail.size) {
			detail.forEach((item, index) => {
				const checked = selectList.indexOf(item.get('uuid')) > -1
				if(item.get('beOpened') === false && selectList.indexOf(item.get('uuid')) > -1){
					allQcList = false
				}
				const managerCategory = managerCategoryList.getIn([index,'category']) && fromJS(managerCategoryList.getIn([index,'category','childList']).toJS()) || fromJS([])
				detailElementList.push(
					<TableItem className={'editRunning-table-sfgl-width'} key={item.get('uuid')} line={index+1}>
					<li
						onClick={(e) => {
							e.stopPropagation()
							if(selectItem.size >= Limit.RUNNING_CHECKED_MAX_NUMBER){
								message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
							}else{
								if(runningIndex === 0) {
									if(item.get('beOpened') && item.get('beCard')) {
										if(checked){
											dispatch(editCalculateActions.changeBeforeAmount(`${Limit.TREE_JOIN_STR}`,index,item.get('uuid')))
										}
									}

									dispatch(editCalculateActions.accountItemCheckboxCheck(checked, item, index))
									dispatch(editCalculateActions.accountTotalAmount(true))
								}
							}

						}}
					>
						<Checkbox checked={checked} disabled={runningIndex !== 0}/>
					</li>
					<li>
						{item.get('oriDate')}
					</li>
					<TableOver
						textAlign='center'
						className='account-flowNumber'
						onClick={(e) => {
							e.stopPropagation()
							dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls', fromJS(finalUuidList),()=>{
								dispatch(editCalculateActions.getPayManageList({
									oriDate,
									categoryUuidList,
									cardUuidList,
									oriUuid,
									currentCardPage: 1,
									condition: '',
									fromPage: false,
									writeOffType: '',
									beginDate: '',
									endDate: '',
									notCheckDate: true
								}))
							}))
						}}
					>
						<span>{item.get('jrIndex') ? `${item.get('jrIndex')}号` : ''}</span>
					</TableOver>
					<li className='qichuye'>
						<span onClick={()=>{
							if(runningIndex === 0){
								if(item.get('beOpened') && item.get('beCard') && !managerCategoryList.getIn([index,'category'])) {
									dispatch(editCalculateActions.getManagerCategoryList(index,item.get('uuid')))
								}
							}

						}}>
							{
							item.get('beCard') && checked?
								<PayCategorySelect
									treeData={managerCategory}

									value={item.get('categoryName')}
									placeholder=""
									parentsDisable={true}
									treeCheckable={false}
									id='sfgl-select-running'
									onChange={value => {
										dispatch(editCalculateActions.changeBeforeAmount(value,index,item.get('uuid')))
									}}
								/> :
								<Tooltip
									placement="topLeft"
									title={item.get('categoryFullName')}
								>
									{item.get('categoryName')}
								</Tooltip>

							}
						</span>
					</li>
					<li className='over-dian'>
						<span>
							<Tooltip
								placement="topLeft"
								title={item.get('oriAbstract')}
							>
								{item.get('oriAbstract')}
							</Tooltip>
						</span>
					</li>
					<li className='over-dian'>
						<span>
						{
							item.get('projectCardCode') ?
							<Tooltip
								placement="topLeft"
								title={ item.get('projectCardCode') !== 'COMNCRD' && item.get('projectCardCode') !== 'ASSIST' && item.get('projectCardCode') !== 'MAKE' && item.get('projectCardCode') !== 'INDIRECT' && item.get('projectCardCode') !== 'MECHANICAL' ? `${item.get('projectCardCode')} ${item.get('projectCardName')}` : item.get('projectCardName')}
							>
								{item.get('projectCardCode') !== 'COMNCRD' && item.get('projectCardCode') !== 'ASSIST' && item.get('projectCardCode') !== 'MAKE' && item.get('projectCardCode') !== 'INDIRECT' && item.get('projectCardCode') !== 'MECHANICAL' ? `${item.get('projectCardCode')} ${item.get('projectCardName')}` : item.get('projectCardName')}
							</Tooltip> :
							''
						}
						</span>
					</li>
					<li>
						<p>
							<Amount>
								{item.get('direction') === 'debit' ? item.get('amount'): ''}
							</Amount>
						</p>
						<p>
							<Amount>
								{item.get('direction') === 'credit' ? item.get('amount'): ''}
							</Amount>
						</p>

					</li>
				</TableItem>
			)
		})
		}

		const showTop = insertOrModify === 'insert' ? true : false

		const otherComp = <div className='table-bottom-select'>
							<p><span>借方金额合计：</span><span>贷方金额合计：</span></p>
							<p><Amount showZero={true}>{debitTotal}</Amount><Amount showZero={true}>{creditTotal}</Amount></p>
						</div>
		const hxModalTitle = !modify ? (beMoed ? ['日期','流水号','流水类别','摘要', '借方金额/贷方金额','核销金额','抹零金额'] : ['日期','流水号','流水类别','摘要', '借方金额/贷方金额','核销金额']) :
		!isModeRunning ? ['日期','流水号','流水类别','摘要', '借方金额/贷方金额','核销金额'] : ['日期','流水号','流水类别','摘要', '借方金额/贷方金额','抹零金额']

		const titleList = ['流水号','流水类别','摘要','项目', '借方金额/贷方金额']

		const curPage = insertOrModify === 'insert' ? currentCardPage : modifycurrentPage


		const curTotalAccountAmount = accounts.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)
		return (
			paymentType === 'LB_SFGL'?
				<div className="accountConf-modal-list accountConf-modal-list-hidden editcate-running-sfgl">
				{
					insertOrModify === 'modify'?
					<div className="edit-running-modal-list-item">
						<label>流水号：</label>
						<div>
							<NumberInput
								style={{width:'70px',marginRight:'5px'}}
								value={jrIndex}
								onChange={(e) => {
									if (/^\d{0,6}$/.test(e.target.value)) {
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp','jrIndex', e.target.value))
									} else {
										message.info('流水号不能超过6位')
									}
								}}
								PointDisabled={true}
							/>
							号
						</div>
					</div>
					:
					null
				}
					<div className="edit-running-modal-list-item">
						<label>日期：</label>
						<div>
							<DatePicker
								allowClear={false}
								disabled={runningIndex != 0}
								disabledDate={(current) => {
									if (modify && !allQcList) {
										// const detailDate = detail.getIn([0, 'oriDate'])

										return disabledDate(current, modify, detailDate)
									}else if(allQcList){
										return moment(disabledBeginDate) > current
									} else {
										return disabledDate(current)
									}


								}}
								value={moment(oriDate)}
								onChange={value => {

								const date = value.format('YYYY-MM-DD')
								// if (insertOrModify === 'insert') {
									dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
								// } else {
								// 	dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'oriDate', date))
								// }
								if(paymentType === 'LB_SFGL' && insertOrModify === 'modify'){
									return
								}else{
									dispatch(editCalculateActions.getContactsCardList(date))
									// if(cardUuid || categoryUuid) {

										dispatch(editCalculateActions.getPayManageList({
											oriDate:date,
											categoryUuidList,
											cardUuidList,
											oriUuid,
											currentCardPage: 1,
											condition: '',
											fromPage: false,
											writeOffType: '',
											beginDate: '',
											endDate: '',
											notCheckDate: true
										}))
									// }
								}

							}}/>
						</div>
					</div>
					<CategorySelect
						dispatch={dispatch}
						insertOrModify={insertOrModify}
						paymentTypeStr={paymentTypeStr}
						hideCategoryList={hideCategoryList}
					/>
					<div className='accountConf-separator'></div>
					<div className="edit-running-modal-list-item">
						<label>摘要：</label>
							<div>
								<Input className="focus-input"
									onFocus={(e) => {
										document.getElementsByClassName('focus-input')[0].select();
									}}
									value={oriAbstract}
									onChange={(e) => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'oriAbstract', e.target.value))
									}}
								/>
							</div>
					</div>
					{
						!isModeRunning ?
						<div className="edit-running-modal-list-item">
							<label>{`${!unAutomatic && totalAmount>=0 || unAutomatic && hxReceiptAmount > 0?'收':'付'}款金额：`}</label>
							<div style={{display:'flex',justifyContent: 'space-between'}}>
								{
									selectItem.size === 1 && usedAccounts && !unAutomatic ?
									<Fragment>
										<div style={{flex: '1'}}>{formatMoney(curTotalAccountAmount)}</div>
									</Fragment> :
									<Fragment>
										{
											!modify  ?
											<NumberInput
												showZero={true}
												disabled={runningIndex != 0 || unAutomatic}
												value={handlingAmount}
												onChange={(e) =>{
													numberTest(e,(value) => dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', value)))
												}}
											/> :
											unAutomatic ? //手动
											<span
												className='sfgl-edit-pen'
												onClick={()=>{
													if(selectList.size){
														dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showHXModal', true))
														dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'oldSelectItem', fromJS(selectItem)))
													}else{
														message.info('请勾选待核销流水')
													}

												}}
											>{formatMoney(handlingAmount)}<XfIcon type='edit-pen'/></span> :
											<NumberInput
												showZero={true}
												disabled={runningIndex != 0 || unAutomatic}
												value={handlingAmount}
												onChange={(e) =>{
													numberTest(e,(value) => dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', value)))
												}}
											/>
										}

									</Fragment>
								}



							</div>
							{
								modify ?
								<Tooltip title={unAutomatic ? '勾选流水后,点击金额输入框,逐笔输入核销金额' : '勾选流水后,根据流水先后顺序核销'}>
									<Switch
										className="use-unuse-style lend-bg"
										checked={unAutomatic}
										style={{ margin: '.1rem 0 0 .2rem' }}
										checkedChildren={'手动核销'}
										unCheckedChildren={'自动核销'}
										onChange={() => {
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'unAutomatic', !unAutomatic))
										}}
									/>
								</Tooltip> : null
							}
							{
								selectItem.size === 1 ?
								<Tooltip title='支持多账户核销单条流水'>
									<Switch
										className="use-unuse-style"
										style={{marginLeft:'.2rem',minWidth: '69px',width: '69px',float: 'right'}}
										checked={usedAccounts}
										checkedChildren={'多账户'}
										unCheckedChildren={'多账户'}
										onChange={(checked) => {
											if(!checked && accounts.getIn([0,'accountUuid'])){
												if(insertOrModify === 'insert'){
													const poundage = accounts.getIn([0,'poundage'])
													const sxAmount = Math.abs(handlingAmount || 0)*poundage.get('poundageRate')/1000>poundage.get('poundage') && poundage.get('poundage') > 0
														?poundage.get('poundage')
														:Math.abs(handlingAmount || 0)*poundage.get('poundageRate')/1000
													dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', 'poundageAmount', sxAmount.toFixed(2)))
													dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', 'poundage', poundage))
												}

												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'accountUuid', accounts.getIn([0,'accountUuid'])))
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'accountName', accounts.getIn([0,'accountName'])))
												// dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', accounts.getIn([0,'amount'])))

											}
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'usedAccounts', checked))


										}}
									/>
								</Tooltip> : ''

							}
						</div> :
						<div className="edit-running-modal-list-item">
							<label>{`${!unAutomatic && totalAmount>=0 || unAutomatic && hxWipeZeroAmount > 0 ?'收':'付'}款抹零：`}</label>
							<div>
								{
									!modify ?
									<NumberInput
										disabled={unAutomatic}
										value={moedAmount}
										onChange={(e) =>{
											numberTest(e,(value) => dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'moedAmount', value)))
										}}
									/> :
									unAutomatic ?
									<span
										className='sfgl-edit-pen'
										onClick={()=>{
											if(selectList.size){
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showHXModal', true))
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'oldSelectItem', fromJS(selectItem)))
											}else{
												message.info('请勾选待核销流水')
											}
										}}
									>{formatMoney(moedAmount)}<XfIcon type='edit-pen'/></span> :
									<NumberInput
										disabled={unAutomatic}
										value={moedAmount}
										onChange={(e) =>{
											numberTest(e,(value) => dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'moedAmount', value)))
										}}
									/>
								}

							</div>
							{
								modify ?
								<Tooltip title={unAutomatic ? '勾选流水后,点击金额输入框,逐笔输入核销金额' : '勾选流水后,根据流水先后顺序核销'}>
									<Switch
										className="use-unuse-style lend-bg"
										checked={unAutomatic}
										style={{ margin: '.1rem 0 0 .2rem' }}
										checkedChildren={'手动核销'}
										unCheckedChildren={'自动核销'}
										onChange={() => {
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'unAutomatic', !unAutomatic))
										}}
									/>
								</Tooltip> : null
							}
						</div>
					}
					{
						usedAccounts && accounts.size > 1 && selectItem.size === 1 ?
							<MultiAccountComp
								accountList={accountList}
								accounts={accounts}
								dispatch={dispatch}
								isCheckOut={isCheckOut}
								accountOnChange={(value,index)=>{
									dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index], fromJS(value)))
								}}
								amountOnChange={(e,v,index)=>{
									numberTest(e, (value) => {
										if (insertOrModify === 'insert') {
											const poundage = v.getIn(['poundage','poundage'])
											const poundageRate = v.getIn(['poundage','poundageRate'])
											const sxAmount = Math.abs(value || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?
											v.getIn(['poundage','poundage'])
											:Math.abs(value || 0)*v.getIn(['poundage','poundageRate'])/1000
											dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'poundageAmount'], (sxAmount || 0).toFixed(2)))
										}
										dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'amount'],value))
									})
								}}
								amountOnFocus={(v,allAmount,index)=>{
									const totalAmount = beMoed ? numberCalculate(allAmount,moedAmount) : allAmount
									if (!v.get('amount') && totalAmount < handlingAmount) {
										let ReAmount = 0
										if(unAutomatic){
											ReAmount = decimal(Number(handlingAmount) - (Number(allAmount) || 0))
										}else{
											ReAmount = beMoed ? decimal(Number(handlingAmount) - (Number(allAmount) || 0) - (Number(moedAmount) || 0)) : decimal(Number(handlingAmount) - (Number(allAmount) || 0))
										}
										dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'amount'],ReAmount))
										if (insertOrModify === 'insert') {
											const poundage = v.getIn(['poundage','poundage'])
											const poundageRate = v.getIn(['poundage','poundageRate'])
											const sxAmount = Math.abs(ReAmount || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?
											v.getIn(['poundage','poundage'])
											:Math.abs(ReAmount || 0)*v.getIn(['poundage','poundageRate'])/1000
											dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'poundageAmount'], (sxAmount || 0).toFixed(2)))
										}
									}
								}}
								amountOnKeyDown={(v,allAmount,index)=>{
									const totalAmount = beMoed ? numberCalculate(allAmount,moedAmount) : allAmount
									let ReAmount = 0
									if(unAutomatic){
										ReAmount = decimal(Number(handlingAmount) - (Number(allAmount) || 0))
									}else{
										ReAmount = beMoed ? decimal(Number(handlingAmount) - (Number(allAmount) || 0) - (Number(moedAmount) || 0)) : decimal(Number(handlingAmount) - (Number(allAmount) || 0))
									}
									if (ReAmount > 0) {
										if (insertOrModify === 'insert') {
											const poundage = v.getIn(['poundage','poundage'])
											const poundageRate = v.getIn(['poundage','poundageRate'])
											const sxAmount = Math.abs(ReAmount || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?
											v.getIn(['poundage','poundage'])
											:Math.abs(ReAmount || 0)*v.getIn(['poundage','poundageRate'])/1000
											dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'poundageAmount'], (sxAmount || 0).toFixed(2)))
										}
										dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', ['accounts',index,'amount'],ReAmount))
									}
								}}
								amountOnBlur={(totalAmount)=>{
									dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', totalAmount))
								}}
							/> :
							!isModeRunning ?
								<div className="edit-running-modal-list-item">
									<label>账户：</label>
									<div className="lrls-account-box">
									<Select
										showSearch
										value={accountName}
										dropdownRender={menu => (
											<div>
												{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div
														style={{ padding: '8px', cursor: 'pointer' }}
														onMouseDown={() => {
															if (configPermission) {
																dispatch(accountConfigActions.beforeInsertAccountConf())
																this.setState({showModal: true})
															}
														}}
													>
													<Icon type="plus" /> 新增账户
												</div>
											</div>
										)}
										onSelect={(value,options) => {
											const poundage = options.props.poundage
											const sxAmount = Math.abs(handlingAmount || 0)*poundage.get('poundageRate')/1000>poundage.get('poundage') && poundage.get('poundage') > 0
												?poundage.get('poundage')
												:Math.abs(handlingAmount || 0)*poundage.get('poundageRate')/1000
											dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', 'poundageAmount', sxAmount.toFixed(2)))
											dispatch(editCalculateActions.changeEditCalculateAccountName('Sfgl', 'accountUuid', 'accountName', value))
											dispatch(editCalculateActions.changeEditCalculateCommonString('Sfgl', 'poundage', poundage))
										}}
									>
										{
											accountList.getIn([0, 'childList']).map((v, i) =>
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
								</div> : ''
					}
					{
						//自动核销 totalAmount>=0 || 手动核销 hxReceiptAmount > 0
						!unAutomatic && totalAmount>=0 || unAutomatic && hxReceiptAmount > 0 ?
						<AccountSfglPandge
							dispatch={dispatch}
							accountPoundage={accountPoundage}
							someTemp={SfglTemp}
							insertOrModify={insertOrModify}
							accounts={accounts}
							needAccount={usedAccounts && selectItem.size === 1}
							position={'Sfgl'}
							otherPage
						/>:''
					}
					{
						!modify && mlShow ?
						<div className='accountConf-separator'></div> : null
					}


					{
						!modify && mlShow ?
						<div className="edit-running-modal-list-item" >
							<span style={{marginRight:'10px'}}>
								<Checkbox
									checked={beMoed}
									onChange={(e) => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp','beMoed', !beMoed))
										if(e.target.checked === false){
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'moedAmount', ''))
											let newSelectItem = []
											selectItem && selectItem.size && selectItem.toJS().map((item,index) => {
													newSelectItem.push({...item,moedAmount: ''})
											})

											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'selectItem', fromJS(newSelectItem)))

										}
									}}
								/>
							</span>
								<label className='large-width-label'>{`应${unAutomatic ? (hxWipeZeroAmount>=0?'收':'付') : totalAmount>=0?'收':'付'}抹零`}</label>
						</div> : ''

					}

					{
						!modify && beMoed ?
						<div className="edit-running-modal-list-item">
							<label>抹零金额：</label>
							<div>
								<NumberInput
									disabled={unAutomatic}
									value={moedAmount}
									onChange={(e) =>{
										numberTest(e,(value) => dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'moedAmount', value)))
									}}
								/>
							</div>
						</div>:''
					}
					{
						!modify ?
						<Fragment>
							<div className='accountConf-separator'></div>
							<div className="edit-running-modal-list-item">
								<label>{`核销${hxReceiptAmount > 0 ? '收款' : '付款'}金额：`}
								{ unAutomatic ?
									<span
										className='sfgl-edit-pen'
										onClick={()=>{
											if(selectList.size){
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showHXModal', true))
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'oldSelectItem', fromJS(selectItem)))
											}else{
												message.info('请勾选待核销流水')
											}

										}}
									>{selectItem && selectItem.size ? numberCalculate(Math.abs(hxReceiptAmount),Math.abs(moedAmount)) :'点击输入'}<XfIcon type='edit-pen'/></span> :
									<span>{selectItem.size === 1 && usedAccounts ? numberCalculate(curTotalAccountAmount,moedAmount) : numberCalculate(handlingAmount,moedAmount)} </span>} </label>
								<div>

								</div>
								<div style={{display: 'flex',justifyContent: 'flex-end'}}>
									<Tooltip title={unAutomatic ? '勾选流水后,点击金额输入框,逐笔输入核销金额' : '勾选流水后,根据流水先后顺序核销'}>
										<Switch
											className="use-unuse-style lend-bg"
											checked={unAutomatic}
											style={{ margin: '.1rem 0 0 .2rem' }}
											checkedChildren={'手动核销'}
											unCheckedChildren={'自动核销'}
											onChange={(checked) => {
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'unAutomatic', checked))
												checked && dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', hxReceiptAmount))
											}}
										/>
									</Tooltip>
								</div>
							</div>
						</Fragment>:''
					}


					<div className='accountConf-separator'></div>
					<div id='sfgl-select-running'>
						<div className={'editRunning-detail-title-no-select' }>
							{
								selectItem.size > 0 ?
								<div className='editRunning-detail-title-bottom'>
									<span>
										已勾选流水：{selectItem.size}条
									</span>
									<span>
										{`待核销${totalAmount>=0?'收':'付'}款金额：`}<span>{totalAmount?Math.abs(totalAmount).toFixed(2):'0.00'}</span>
									</span>
								</div> : <div className="editRunning-detail-title-top">请勾选需要核销的流水：</div>
							}

						</div>
						<TableAll className="editRunning-table" type={'amountYeb'}>
						{
							insertOrModify === 'insert' ?
							<div className="sfgl-table-top-select">
								<PayCategorySelect
									showSearch={true}
									disabled={modify}
									treeData={categoryList.getIn([0,'childList']) && categoryList.getIn([0,'childList']).size ? categoryList.getIn([0,'childList']) : fromJS([])}
									value={categoryNameAll.toJS()}
									// className={categoryNameAll.size === 1 ? 'table-top-select-long' : 'table-top-select-short'}
									placeholder=""
									parentsDisable={false}
									treeCheckable={true}
									treeCheckStrictly={true}
									chooseAll={true}
									placeholder={'筛选流水类别...'}
									id='sfgl-select-running'
									size={'small'}
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'categoryNameAll', fromJS(value)))
										let newCategoryUuidList = []
										let newCategoryNameList = []
										value && value.forEach(v => {
											const valueList = v.split(Limit.TREE_JOIN_STR)
											if(valueList[1]){
												newCategoryUuidList.push(valueList[0])
												newCategoryNameList.push(valueList[1])
											}

										})
										dispatch(editCalculateActions.initWriteOffType())
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'categoryUuidList', fromJS(newCategoryUuidList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'categoryNameList', fromJS(newCategoryNameList)))

										dispatch(editCalculateActions.getPayManageList({
											oriDate,
											categoryUuidList: fromJS(newCategoryUuidList),
											cardUuidList,
											oriUuid,
											currentCardPage: 1,
											condition
										}))


									}}
								/>
								<PayCategorySelect
									showSearch={true}
									disabled={modify}
									size={'small'}
									treeData={cardList && cardList.size ? cardList : fromJS([])}
									// value={`${usedCard.get('code')?usedCard.get('code'):''} ${usedCard.get('name')?usedCard.get('name'):''}`}
									value={cardNameAll.toJS()}
									className={cardNameAll.size === 1 ? 'table-top-select-long' : 'table-top-select-short'}
									placeholder=""
									parentsDisable={false}
									treeCheckable={true}
									treeCheckStrictly={true}
									placeholder={'筛选往来单位...'}
									id='sfgl-select-running'
									onChange={value => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardNameAll', fromJS(value)))
										let newCardUuidList = []
										let newCardNameList = []
										value && value.forEach(v => {
											const valueList = v.value.split(Limit.TREE_JOIN_STR)
											if(valueList[1]){
												newCardUuidList.push(valueList[0])
												newCardNameList.push(valueList[1])
											}

										})
										dispatch(editCalculateActions.initWriteOffType())
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardUuidList', fromJS(newCardUuidList)))
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardNameList', fromJS(newCardNameList)))
										// const valueList = value.split(Limit.TREE_JOIN_STR)
										// const code =  valueList[2]
										// const contactsName = valueList[1]
										// const contactsUuid = valueList[0]
										// dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardUuid', contactsUuid))
										// dispatch(innerCalculateActions.changeEditCalculateCommonString('Sfgl', ['usedCard','code'], code))
										// dispatch(innerCalculateActions.changeEditCalculateCommonString('Sfgl', ['usedCard','name'], contactsName))
										// dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handleTypeCard', true))
										if(oriDate) {
											dispatch(editCalculateActions.getPayManageList({
												oriDate,
												categoryUuidList,
												cardUuidList: fromJS(newCardUuidList),
												oriUuid,
												currentCardPage: 1,
												condition
											}))
										}


									}}
								/>
								<div className='table-top-write-off'>
									<Search
										placeholder="搜索摘要、金额、项目..."
										value={condition}
										onSearch={value => {
											dispatch(editCalculateActions.initWriteOffType())
											dispatch(editCalculateActions.getPayManageList({
												oriDate,
												categoryUuidList,
												cardUuidList,
												oriUuid,
												currentCardPage: 1,
												condition: value
											}))

										}}
										onChange={e => {
											dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'condition', e.target.value))
										}}
										style={{ width: 166 }}
									/>
									{
										writeOffTypeList.size ?
										<div
											className='one-click-write-off'
											onClick={() =>{
												dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showDKModal', true))
											}}
										>代扣代缴一键核销</div> : null
									}
								</div>

							</div> : null
						}
						<div className="table-title-wrap">
							<ul className={`editRunning-table-sfgl-width table-title`}>
								<li key={0} onClick={(e) => {
										e.stopPropagation()
										if(!selectAcAll && (Number(selectItem.size) + Number(detail.size) >= Limit.RUNNING_CHECKED_MAX_NUMBER)){
											message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
										}else{
											if (runningIndex === 0) {
												dispatch(editCalculateActions.manageCheckboxCheckAll(selectAcAll, detail))
												dispatch(editCalculateActions.accountTotalAmount(true))
											}
										}


								}}>
									{
										runningIndex !== 0 ? '' : <Checkbox checked={selectAcAll}/>
									}
								</li>
								<li
									key={'a'}
									onClick={()=> {
										if(!modify){
											this.setState({
												showDateModal: true,
												selectBeginDate: beginDate,
												selectEndDate: endDate
											})
										}
									}}
								>
									<span> 日期
									{
										!modify  ?
											(beginDate ?
											<XfIcon type='filter'/> :
											<XfIcon type='not-filter'/>) :
										''
									}
									</span>





								</li>
								{titleList.map((v, i) => <li key={i+1}>{<span>{v}</span>}</li>)}
							</ul>
						</div>
						<TableBody>
							{detailElementList}
						</TableBody>
						{
							<TableBottomPage
								otherComp={otherComp}
								total={totalNumber === 0 ? 1 : totalNumber}
								current={curPage}
								onChange={(page) => {
									const newWriteOffType = chooseWriteOffType ? writeOffType : ''
									insertOrModify === 'insert' ?
									dispatch(editCalculateActions.getPayManageList({
										oriDate,
										categoryUuidList,
										cardUuidList,
										oriUuid,
										currentCardPage: page,
										condition,
										fromPage: true,
										writeOffType: newWriteOffType
									})) :
									dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'modifycurrentPage', page))
								}}
								totalPages={cardPages}
								pageSize={pageSize}
								showSizeChanger={true}
								hideOnSinglePage={false}
								onShowSizeChange={(curPageSize) => {
									const newWriteOffType = chooseWriteOffType ? writeOffType : ''
									dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'pageSize', curPageSize))
									if(insertOrModify === 'insert'){
										dispatch(editCalculateActions.getPayManageList({
											oriDate,
											categoryUuidList,
											cardUuidList,
											oriUuid,
											currentCardPage: 1,
											condition,
											fromPage: true,
											writeOffType: newWriteOffType,
											pageSize: curPageSize
										}))
									}else{
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'modifycurrentPage', 1))
										dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardPages', Math.ceil(totalNumber/curPageSize)))
									}

								}}
								className={'payment-table-select' }
							/>
						}
						</TableAll>
					</div>

					<AccountModifyModal
						dispatch={dispatch}
						showModal={showModal}
						onClose={() => this.setState({showModal: false})}
						fromPage='editRunning'
						isCheckOut={isCheckOut}
					/>

					<SingleModal
						dispatch={dispatch}
						showSingleModal={showSingleModal}
						MemberList={memberList}
						selectThingsList={selectThingsList}
						thingsList={thingsList}
						selectedKeys={selectedKeys}
						title={'选择项目'}
						selectFunc={(code,name,cardUuid) => {
							dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'cardUuid', cardUuid))
							dispatch(innerCalculateActions.changeEditCalculateCommonString('Sfgl', ['usedCard','code'], code))
							dispatch(innerCalculateActions.changeEditCalculateCommonString('Sfgl', ['usedCard','name'], name))
							dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handleTypeCard', true))
							dispatch(editRunningActions.changeLrAccountCommonString('',['flags','showSingleModal'], false))
							if(oriDate) {
								dispatch(editCalculateActions.getPayManageList({
									oriDate,
									categoryUuidList,
									cardUuidList,
									oriUuid,
									currentCardPage
								}))
							}
						}}
						selectListFunc={(uuid,level) => {
							if(uuid === 'all'){
								dispatch(editCalculateActions.getPaymentCardList(oriDate))
							}else{
								dispatch(editCalculateActions.getPaymentCardTreeList(oriDate,uuid,level))
							}
						}}
					/>

					<Modal
						visible={showDKModal}
						title="代扣代缴一键核销"
						onCancel={() => {
							dispatch(editCalculateActions.initWriteOffType())
							dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showDKModal', false))

						}}
						onOk={() => {
							dispatch(editCalculateActions.getPayManageList({
								oriDate,
								categoryUuidList: fromJS([]),
								cardUuidList: fromJS([]),
								oriUuid: '',
								currentCardPage: 1,
								condition: '',
								fromPage: '',
								writeOffType
							}))
							dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showDKModal', false))
							dispatch(editCalculateActions.clearFilterCondition())
						}}
						okText="确定"
						cancelText="取消"

					>
						<p className='calculate-tips-title'>账套中存在以下代扣代缴未处理：</p>
						<div className="save-way-choose" style={{display: writeOffTypeList.indexOf('JR_TYPE_SHBX_QTYS') > -1 ? '' : 'none'}}>
							<Radio checked={writeOffType==='JR_TYPE_SHBX_QTYS'} onChange={() => {
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp','writeOffType','JR_TYPE_SHBX_QTYS'))
							}}>社会保险的代扣代缴</Radio>
						</div>
						<div className="save-way-choose" style={{display: writeOffTypeList.indexOf('JR_TYPE_ZFGJJ_QTYS') > -1 ? '' : 'none'}}>
							<Radio checked={writeOffType==='JR_TYPE_ZFGJJ_QTYS'} onChange={() => {
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp','writeOffType','JR_TYPE_ZFGJJ_QTYS'))
							}}>住房公积金的代扣代缴</Radio>
						</div>
						<div className="save-way-choose" style={{display: writeOffTypeList.indexOf('JR_TYPE_GRSDS') > -1 ? '' : 'none'}}>
							<Radio checked={writeOffType==='JR_TYPE_GRSDS'} onChange={() => {
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp','writeOffType','JR_TYPE_GRSDS'))
							}}>个人税费的代扣代缴</Radio>
						</div>
					</Modal>

					<Modal
						visible={showDateModal}
						title="日期筛选"
						onCancel={() => {
							this.setState({
								showDateModal: false
							})
						}}
						onOk={() => {
							this.setState({
								showDateModal: false
							})
							const newWriteOffType = chooseWriteOffType ? writeOffType : ''
							dispatch(editCalculateActions.getPayManageList({
								oriDate,
								categoryUuidList,
								cardUuidList,
								oriUuid,
								currentCardPage: 1,
								condition,
								fromPage: false,
								writeOffType: newWriteOffType,
								beginDate: selectBeginDate,
								endDate: selectEndDate,
								notCheckDate: true
							}))
						}}
						okText="确定"
						cancelText="取消"

					>
						<RangePicker
							disabledDate={(current)=>{
								return current && (moment(firstDisabledBeginDate) > current || current > moment(oriDate))
							}}
							className='sfgl-more-choose-month'
							allowClear={true}
							value={selectBeginDate ? [moment(selectBeginDate, dateFormat), moment(selectEndDate, dateFormat)] : []}
							format={dateFormat}
							onChange={(value, dateString) => debounce(() =>{
								if (dateString.length > 1) {
									const begin = dateString[0]
									let end = dateString[1]
									if(begin.indexOf('Invalid') === -1){
										if(end.indexOf('Invalid') > -1){
											end = ''
										}
										this.setState({
											selectBeginDate: begin,
											selectEndDate: end,
										})
									}else{
										message.info('日期格式错误，请刷新重试')
									}
								}
							})()}
						/>
					</Modal>
					<Modal
						visible={showHXModal}
						className='running-sfgl-manual'
						title="手动核销"
						width={760}

						onCancel={() => {
							dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showHXModal', false))
							dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'selectItem', fromJS(oldSelectItem)))

						}}
						onOk={() => {
							let rightFlags = true, errMsg = ''
							selectItem && selectItem.size && selectItem.map(item => {
								if(!modify){
									if(Math.abs(numberCalculate(item.get('handleAmount'),item.get('moedAmount'))) > Math.abs(Number(item.get('amount')))){
										rightFlags = false
										errMsg = `${item.get('oriDate')}记${item.get('jrIndex')}号流水金额有误，请重新输入`
										return
									}
								}else{
									if(Math.abs(Number(item.get('handleAmount'))) > Math.abs(Number(item.get('amount'))) || Math.abs(Number(item.get('moedAmount'))) > Math.abs(Number(item.get('amount')))){
										rightFlags = false
										errMsg = `${item.get('oriDate')}记${item.get('jrIndex')}号流水金额有误，请重新输入`
										return
									}
								}

							})
							if(rightFlags){
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'showHXModal', false))
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'moedAmount', Math.abs(hxWipeZeroAmount)))
								dispatch(editCalculateActions.changeEditCalculateCommonState('SfglTemp', 'handlingAmount', Math.abs(hxReceiptAmount)))
							}else{
								message.info(errMsg)
							}


						}}
						okText="确定"
						cancelText="取消"

					>
						<TableAll className="editRunning-table-sfgl-hx" type={'amountYeb'}>
							<TableTitle
								className={!modify && beMoed ? 'running-sfgl-hx-modal-insert' : 'running-sfgl-hx-modal-modify'}
								titleList={hxModalTitle}
								disabled={runningIndex !== 0}
								hasCheckbox={false}
							/>
							<TableBody>
								{manualWriteOffList}
							</TableBody>

							<div className='page-bottom-table-select payment-table-select'>

							<div className='table-bottom-select'>
								<p><span>借方金额合计：</span><span>贷方金额合计：</span></p>
								<p><Amount showZero={true}>{hxdebitAmount}</Amount><Amount showZero={true}>{hxCreditAmount}</Amount></p>
							</div>
							<div className='table-bottom-select'>
								<p>
									{ modify && oriState === 'STATE_SFGL_ML' ? null : <span>{`核销${hxReceiptAmount > 0 ? '收' : '付'}款金额：`}</span> }
									{ modify && oriState === 'STATE_SFGL' ? null : <span>{`核销${hxWipeZeroAmount > 0 ? '收' : '付'}款抹零：`}</span> }

								</p>
								<p>
									{ modify && oriState === 'STATE_SFGL_ML' ? null : <Amount showZero={true}>{Math.abs(hxReceiptAmount)}</Amount> }
									{ modify && oriState === 'STATE_SFGL' ? null : <Amount showZero={true}>{Math.abs(hxWipeZeroAmount)}</Amount> }
								</p>
							</div>
							</div>


						</TableAll>
					</Modal>

				</div> : null
		)
	}
}

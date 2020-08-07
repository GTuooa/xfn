import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import thirdParty from 'app/thirdParty'
import { Container, Row, ScrollView, Icon, Single, TextInput, ButtonGroup, Button, SearchBar } from 'app/components'
import MutiDateSelect from 'app/containers/components/MutiPeriodMoreSelect/MutiDateSelect.jsx'
import { searchTypeStr, searchNameStr, dateTypeStr, accountingTypeStr, accountingNameStr } from 'app/containers/Search/SearchApproval/common/common.js'
import { receiptList, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'
import { DateLib } from 'app/utils'

import Item from './Item'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
	class Detail extends React.Component {

	constructor() {
		super()
		this.state = {
			isSearch: false,
			multiOperationType: '',
			selectList: [],
			isloadingNext: false,
			startY: 0,
			isUpSliding: false,
		}
	}

	render() {
		const {
			allState,
			dispatch,
			homeState,
			history,
			searchApprovalState,
		} = this.props

		const { isSearch, multiOperationType, selectList, isloadingNext, isUpSliding, startY } = this.state

		const detailList = searchApprovalState.get('detailList')

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const views = searchApprovalState.get('views')
		const beginDate = views.get('beginDate')
		const endDate = views.get('endDate')
		const searchType = views.get('searchType')
		const searchContent = views.get('searchContent')
		const dateType = views.get('dateType')
		const accountingType = views.get('accountingType')
		const pageCount = views.get('pageCount')
		const currentPage = views.get('currentPage')

		let uuidList = fromJS([])
		detailList.map((v, i) => {
			if (v.get('jrOriUuid')) {
				let item = v.set('oriUuid', v.get('jrOriUuid'))
				uuidList = uuidList.push(item)
			}
		})

		const accountList = allState.get('accountList');
        const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

		return (
			<Container>
				<MutiDateSelect
					start={beginDate}
					end={endDate}
					dateSelectList={dateTypeStr}
					chooseValue={dateType}
					onBeginOk={(value1, value2) => {//跨期选择完开始时间后
						dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: value1, endDate: value2, accountingType: 'ALL' }, 1))
						this.setState({ isSearch: false, multiOperationType: '' })
					}}
					onEndOk={(value1, value2) => {//跨期选择完结束时间后
						dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: value1, endDate: value2, accountingType: 'ALL' }, 1))
						this.setState({ isSearch: false, multiOperationType: '' })
					}}
					changeChooseValue={(value) => {
						dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: value, beginDate: beginDate, endDate: endDate, accountingType: 'ALL' }, 1))
						this.setState({ isSearch: false, multiOperationType: '' })
					}}
				/>
				<Row className="search-approval-title-wrap">
					<div className="search-approval-title-switch-wrap" style={{ display: isSearch ? 'none' : '' }}>
						<ul className="search-approval-title-switch-list">
							<li
								className="search-approval-title-switch-item"
								onClick={() => {
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('currentPageType', 'ApprovalAll'))
									dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: 'DATE_TYPE_END', beginDate: beginDate, endDate: endDate, processCode: 'PROCESS_CODE_ALL' }, 1))
								}}
							>
								审批
							</li>
							<li className="search-approval-title-switch-item-cur">
								<span>明细：</span>
								<Single
									className="search-approval-title-switch-item-single"
									district={accountingTypeStr}
									value={accountingType}
									canSearch={false}
									onOk={value => {
										dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, accountingType: value.value }, 1))
										this.setState({ multiOperationType: '' })
									}}
								>
									{accountingNameStr[accountingType]}
									<Icon type="triangle" className="search-approval-title-switch-item-single-triangle" />
								</Single>
							</li>
						</ul>
						<i className="search-approval-title-switch-i"></i>
						<div
							className="search-approval-title-switch-search"
							onClick={() => {
								this.setState({ isSearch: true })
							}}
						>
							<Icon type="search" />
						</div>
					</div>
					<div className="search-approval-title-search-wrap" style={{ display: isSearch ? '' : 'none' }}>
						<Single
							className="search-approval-title-search-single"
							district={searchTypeStr}
							value={searchType}
							canSearch={false}
							onOk={value => {
								dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchType', value.value))
								this.setState({ multiOperationType: '' })
							}}
						>
							{searchNameStr[searchType]}&nbsp;<Icon type="triangle" />
						</Single>
						<i className="search-approval-title-search-i"></i>
						<span className="search-approval-title-search-input">
							<SearchBar
								placeholder={searchNameStr[searchType] ? `搜索${searchNameStr[searchType]}` : ''}
								value={searchContent}
								onChange={value => {
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchContent', value))
								}}
								onSubmit={(value) => {
									dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: searchType, searchContent: value, dateType: dateType, beginDate: beginDate, endDate: endDate, accountingType: accountingType }, 1))
								}}
								onCancel={() => {
									this.setState({ isSearch: false })
									dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, accountingType: accountingType }, 1))
								}}
								onClear={() => {
									dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, accountingType: accountingType }, 1))
								}}
							/>
						</span>
					</div>
				</Row>
				<ScrollView
					className="needsclick"
					flex='1'
					savePosition={true}
					uniqueKey="ApprovalDetail"
					onTouchStart={(e) => {
						const startY = e.touches[0].pageY;    
						this.setState({
							startY
						})
					}}
					onTouchEnd={(e) => {
						const endY = e.changedTouches[0].pageY;
						const dy = startY - endY;
						if (dy > 0) {//向上滑动
							this.setState({isUpSliding: true})
						}
					}}
					onScroll={(e) => {

						const clientHeight = e.target.clientHeight
						const scrollY = e.target.scrollTop
						const scrollHeight = e.target.scrollHeight

						if (isloadingNext) {
							return
						}

						if (clientHeight + scrollY >= scrollHeight && currentPage < pageCount && isUpSliding) {
							this.setState({isloadingNext: true})
							dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, accountingType: accountingType }, currentPage + 1, null, () => {
								this.setState({ isloadingNext: false, isUpSliding: false })
							}))
						}
					}}
				>
					{
						detailList.map((v, i) => {
							return (
								<Item
									key={i}
									item={v}
									dispatch={dispatch}
									history={history}
									uuidList={uuidList} // 浏览流水的列表
									editLrAccountPermission={editLrAccountPermission}
									accountingType={accountingType}
									multiOperationType={multiOperationType}
									addCheckDetailItem={idList => {
										let oriSelectList = Array.from(new Set(selectList.concat(idList)))
										this.setState({ selectList: oriSelectList })
									}}
									deleteCheckDetailItem={idList => {
										let oriSelectList = selectList.filter(v => idList.indexOf(v) === -1)
										this.setState({ selectList: oriSelectList })
									}}
									selectList={selectList}
									setSelectList={(list) => this.setState({ selectList: list })}
									accountSelectList={accountSelectList}
								/>
							)
						})
					}
				</ScrollView>
				<Row className="footer" style={{ display: accountingType === 'NONE' && !multiOperationType ? '' : 'none' }}>
					<ButtonGroup style={{ height: 50 }}>
						<Button onClick={() => {
							const that = this

							// const operationTypeList = ["收款", "付款", "挂账", "作废"]
							const operationTypeList = []

							let canAccount = false // 可否挂帐
							let canBookKeeping = false // 可否记帐
							let canPay = false // 可否付款
							let canReceive = false // 可否收款
							let canDisuse = false // 可否作废

							detailList.forEach(w => {
								if (!w.get('dealState')) {
									canDisuse = true

									if (hideCategoryCanSelect.indexOf(w.get('jrCategoryType')) > -1) {
										canBookKeeping = true
									} else {
										canAccount = true
									
										if (receiptList.indexOf(w.get('jrCategoryType')) > -1) {

											if (w.get('jrAmount') > 0) {
												canReceive = true
											} else if (w.get('jrAmount') < 0) {
												canPay = true
											}

										} else {
											if (w.get('jrAmount') > 0) {
												canPay = true
											} else if (w.get('jrAmount') < 0) {
												canReceive = true
											}
										}
									}
								}
							})

							if (canReceive) {
								operationTypeList.push('收款')
							}
							if (canPay) {
								operationTypeList.push('付款')
							}
							if (canBookKeeping) {
								operationTypeList.push('核记')
							}
							if (canAccount) {
								operationTypeList.push('挂账')
							}
							if (canDisuse) {
								operationTypeList.push('作废')
							}

							thirdParty.actionSheet({
								title: "请选择记账类型",
								cancelButton: "取消",
								otherButtons: operationTypeList,
								onSuccess: function (result) {
									if (result.buttonIndex == -1)
										return

									that.setState({
										multiOperationType: operationTypeList[result.buttonIndex],
										selectList: []
									})
								}
							})
						}}><Icon type="piliangjizhang"></Icon><span>批量记账</span></Button>
					</ButtonGroup>
				</Row>
				<Row className="footer" style={{ display: multiOperationType ? '' : 'none' }}>
					<ButtonGroup style={{ height: 50 }}>
						<Button onClick={() => {

							if (multiOperationType === '收款') {
								let canSelectList = [];
								detailList.forEach(w => { // 筛选除可以收款的
									if (receiptList.indexOf(w.get('jrCategoryType')) > -1) {
										if (w.get('jrAmount') > 0) {
											canSelectList.push(w.get('id'))
										}
									} else {
										if (w.get('jrAmount') < 0) {
											canSelectList.push(w.get('id'))
										}
									}
								})
								this.setState({
									selectList: canSelectList.length === selectList.length ? [] : canSelectList
								})
							} else if (multiOperationType === '付款') {
								let canSelectList = []
								detailList.forEach(w => { // 筛选除可以付款的
									if (receiptList.indexOf(w.get('jrCategoryType')) > -1) {
										if (w.get('jrAmount') < 0) {
											canSelectList.push(w.get('id'))
										}
									} else {
										if (w.get('jrAmount') > 0) {
											canSelectList.push(w.get('id'))
										}
									}
								})
								this.setState({
									selectList: canSelectList.length === selectList.length ? [] : canSelectList,
								})
							} else if (multiOperationType === '核记') {
								let canSelectList = []
								detailList.forEach(v => hideCategoryCanSelect.indexOf(v.get('jrCategoryType')) > -1 && canSelectList.push(v.get('id')))
								this.setState({
									selectList: canSelectList.length === selectList.length ? [] : canSelectList,
								})
							} else if (multiOperationType === '挂账') {
								let canSelectList = []
								detailList.forEach(v => hideCategoryCanSelect.indexOf(v.get('jrCategoryType')) === -1 && canSelectList.push(v.get('id')))
								this.setState({
									selectList: canSelectList.length === selectList.length ? [] : canSelectList,
								})
							} else if (multiOperationType === '作废') {
								let canSelectList = []
								detailList.forEach(v => canSelectList.push(v.get('id'))) // 全部都能作废
								this.setState({
									selectList: canSelectList.length === selectList.length ? [] : canSelectList,
								})
							}

						}}><Icon type="choose"></Icon><span>全选</span></Button>
						<Button onClick={() => {
							this.setState({
								multiOperationType: '',
							})
						}}><Icon type="cancel"></Icon><span>取消</span></Button>
						<Button disabled={!editLrAccountPermission} onClick={() => {

							if (!selectList.length) {
								return thirdParty.toast.info('请选择明细')
							}

							if (multiOperationType === '收款') {
								let receiveAmount = 0;
								let conSetAccount = false;
								detailList.forEach(w => {
									if (selectList.indexOf(w.get('id')) > -1) {
										if (receiptList.indexOf(w.get('jrCategoryType')) > -1) {
											if (w.get('jrAmount') > 0) {
												receiveAmount = receiveAmount + w.get('jrAmount')
											}
											if (w.getIn(['account', 'accountUuid'])) {
												conSetAccount = true
											}
										} else {
											if (w.get('jrAmount') < 0) {
												receiveAmount = receiveAmount - w.get('jrAmount') // 支付的负数可以加到手续费里
											}
										}
									}
								})

								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS(selectList)))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', receiveAmount))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', false))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('conSetAccount', conSetAccount))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
								history.push('/searchapproval/receiveapproval')

							} if (multiOperationType === '核记') {

								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS(selectList)))
								history.push('/searchapproval/bookKeepingapproval')

							} else if (multiOperationType === '付款') {
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS(selectList)))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({})))
								history.push('/searchapproval/payapproval')

							} else if (multiOperationType === '挂账') {
								if (editLrAccountPermission) {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS(selectList)))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
									history.push('/searchapproval/accountapproval')
								}

							} else if (multiOperationType === '作废') {
								dispatch(searchApprovalActions.disuseApprovalProcessDetailInfo(selectList, () => {
									this.setState({ multiOperationType: '' })
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([])))
								}))
							}
						}}><Icon type="shoufukuan"></Icon><span>{multiOperationType}</span></Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}

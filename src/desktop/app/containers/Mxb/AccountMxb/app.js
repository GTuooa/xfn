import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, Select, Input } from 'antd'
import { Icon } from 'app/components'
import { TableWrap } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.account.js'
import { debounce } from 'app/utils/mutiClick.js'

import Table from './Table'
import TreeContain from './TreeContain'

import * as accountMxbActions from 'app/redux/Mxb/AccountMxb/accountMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class AccountMxb extends React.Component {

	static displayName = 'AccountMxb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	componentDidMount() {
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			this.props.dispatch(accountMxbActions.getPeriodAndAccountMxbBalanceList())
			this.props.dispatch(accountMxbActions.getAccountMxbTree())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.accountMxbState != nextprops.accountMxbState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { allState, dispatch, accountMxbState, homeState } = this.props

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const issuedate = accountMxbState.get('issuedate')
		const endissuedate = accountMxbState.get('endissuedate')
		const accountCategory = accountMxbState.get('accountCategory')
		const accountTypeList = accountMxbState.get('accountTypeList')
		const accountType = accountMxbState.get('accountType')
		const otherCategory = accountMxbState.get('otherCategory')
		const otherType = accountMxbState.get('otherType')
		const currentPage = accountMxbState.get('currentPage')
		const pageCount = accountMxbState.get('pageCount')
		const detailList = accountMxbState.get('detailList')
		const beginDetail = accountMxbState.get('beginDetail')
		const totalDetail = accountMxbState.get('totalDetail')
		const cardPageObj = accountMxbState.get('cardPageObj')
		const views = accountMxbState.get('views')
		const chooseValue = views.get('chooseValue')
		const jrAbstract = views.get('jrAbstract')
		const currentAccoountUuid = views.get('currentAccoountUuid')
		const currentTab = views.get('currentTab')
		const categoryOrType = views.get('categoryOrType')
		const currentTreeSelectItem = views.get('currentTreeSelectItem')

		const accountList = accountMxbState.get('accountList')
		let accountSelectList = accountList.size ? accountList.toJS() : []
		accountSelectList.unshift({
			uuid: '',
			name: '全部'
		})

		// 树形显示哪个类别
		let showTreeList = fromJS({childList: []})
		let accountDetailType = ''
		if (currentTab === 'left') {
			showTreeList = accountCategory
			accountDetailType = 'ACCOUNT_CATEGORY'
		} else if (categoryOrType === 'category') {
			showTreeList = otherCategory
			accountDetailType = 'OTHER_CATEGORY'
		} else if (categoryOrType === 'type') {
			showTreeList = otherType
			accountDetailType = 'OTHER_TYPE'
		}

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		return (
			<ContainerWrap type="mxb-one" className="account-mxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb', 'pageList']).indexOf('账户明细表') === -1) {
										sessionStorage.setItem('previousPage', 'home')
									}
									dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<MutiPeriodMoreSelect
							issuedate={issuedate}
							endissuedate={endissuedate}
							issues={accountIssues}
							chooseValue={chooseValue}
							changeChooseperiodsStatu={(value) => dispatch(accountMxbActions.changeAccountMxbChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(value1, value2, currentAccoountUuid, accountDetailType,'',accountType))
								// dispatch(accountMxbActions.getAccountMxbTree(value1, value2, currentAccoountUuid))
							}}
						/>
						<span className="account-mxb-top-search">
							<span>摘要：</span>
							<span>
								{
									jrAbstract ?
									<Icon className="normal-search-delete" type="close-circle" theme='filled'
										onClick={() => {
											dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, 1))
										}}
									/> : null

								}
								<Icon className="cxpz-serch-icon" type="search"
									onClick={() => {
										dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, 1,'',jrAbstract))
									}}
								/>
								<Input placeholder="根据摘要搜索流水"
									className="cxls-serch-input"
									value={jrAbstract}
									onChange={e => dispatch(accountMxbActions.changeAccountMxbSearchContent(e.target.value))}
									onKeyDown={(e) => {
										if (e.keyCode == Limit.ENTER_KEY_CODE){
											dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, 1,'',jrAbstract))
										}
									}}
								/>
							</span>
						</span>
						{
							// <span className="account-mxb-top-search">
							// 	<span>账户：</span>
							// 	<Select
							// 		showSearch
							// 		searchPlaceholder="搜索账户"
							// 		className="account-mxb-top-search-select"
							// 		optionFilterProp="children"
							// 		notFoundContent="无法找到相应账户"
							// 		value={currentAccoountUuid}
							// 		onSelect={value => {
							// 			dispatch(accountMxbActions.getAccountMxbBalanceListFromSwitchPeriodOrAccount(issuedate, endissuedate, value, accountDetailType))
							// 			// dispatch(accountMxbActions.getAccountMxbTree(issuedate, endissuedate, value))
							// 		}}
							// 		showArrow={false}
							// 		>
							// 		{(issuedate ? accountSelectList : []).map((v, i) => <Select.Option key={i} value={`${v.uuid}`}>{v.name}</Select.Option>)}
							// 	</Select>
							// </span>
						}
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="fifth"
								exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/jr/excel/export/account/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&accountUuid=${currentAccoountUuid}&accountDetailType=${accountDetailType}&typeUuid=${currentTreeSelectItem.get('uuid')}&accountType=${accountType}`}
								ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAccountExcelDetail', {
									begin,
									end,
									accountUuid: `${currentAccoountUuid}`,
									accountDetailType: `${accountDetailType}`,
									typeUuid: `${currentTreeSelectItem.get('uuid')}`,
									accountType,
								}))}
								allexcelDownloadUrl={`${ROOT}/jr/excel/export/account/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&accountUuid=${currentAccoountUuid}&accountDetailType=${accountDetailType}&typeUuid=${currentTreeSelectItem.get('uuid')}&isExportAll=${true}`}
								allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAccountExcelDetail', {
									begin,
									end,
									accountUuid: `${currentAccoountUuid}`,
									accountDetailType: `${accountDetailType}`,
									typeUuid: `${currentTreeSelectItem.get('uuid')}`,
									isExportAll: true
								}))}

								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '账户明细表',
									}))
								}}
							/>
						</span>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(()=>{
								dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, currentPage,'',jrAbstract))
								dispatch(accountMxbActions.getAccountMxbTree(issuedate, endissuedate, currentAccoountUuid,accountType))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<TableWrap notPosition={true}>
					<Table
						dispatch={dispatch}
						accountDetailType={accountDetailType}
						currentPage={currentPage}
						pageCount={pageCount}
						detailList={detailList}
						beginDetail={beginDetail}
						totalDetail={totalDetail}
						currentTreeSelectItem={currentTreeSelectItem}
						endissuedate={endissuedate}
						issuedate={issuedate}
						currentAccoountUuid={currentAccoountUuid}
						jrAbstract={jrAbstract}
						accountType={accountType}
						paginationCallBack={value => dispatch(accountMxbActions.getAccountMxbBalanceListFromTreeOrPage(issuedate, endissuedate, currentAccoountUuid, accountDetailType, currentTreeSelectItem, value,'',jrAbstract))}
					/>
					<TreeContain
						dispatch={dispatch}
						currentPage={currentPage}
						issuedate={issuedate}
						endissuedate={endissuedate}
						accountDetailType={accountDetailType}
						currentAccoountUuid={currentAccoountUuid}
						accountSelectList={accountSelectList}
						currentTreeSelectItem={currentTreeSelectItem}
						showTreeList={showTreeList}
						accountType={accountType}
						accountTypeList={accountTypeList}
						cardPageObj={cardPageObj.toJS()}


					/>
				</TableWrap>
			</ContainerWrap>
		)
	}
}

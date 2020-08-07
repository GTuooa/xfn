import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Input, Icon } from 'antd'
const Search = Input.Search
import { debounce } from 'app/utils'
import { TableWrap, Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'
import TreeContains from './TreeContains'

import * as incomeExpendMxbActions from 'app/redux/Mxb/IncomeExpendMxb/incomeExpendMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class IncomeExpendMxb extends React.Component {

	static displayName = 'IncomeExpendMxb'

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
			this.props.dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbList())
		}

	}

	render() {

		const { allState, homeState, dispatch, incomeExpendMxbState } = this.props
		const { showModal } = this.state

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const issuedate = incomeExpendMxbState.get('issuedate')
		const endissuedate = incomeExpendMxbState.get('endissuedate')
		const incomeExpendDetailList = incomeExpendMxbState.get('incomeExpendDetailList')
		const openDetail = incomeExpendMxbState.get('openDetail')
		const totalAmountList = incomeExpendMxbState.get('totalAmountList')

		const views = incomeExpendMxbState.get('views')
		const chooseValue = views.get('chooseValue')
		const searchAbstract = views.get('searchAbstract')
		const categoryUuid = views.get('categoryUuid')
		const categoryName = views.get('categoryName')
		const oriName = views.get('oriName')
		const currentPage = incomeExpendMxbState.get('currentPage')
		const pageCount = incomeExpendMxbState.get('pageCount')
		const runningCategory = incomeExpendMxbState.get('runningCategoryList')

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : begin

		return (
			<ContainerWrap type="mxb-two" className="incomeExpend-mxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb', 'pageList']).indexOf('收支明细表') === -1) {
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
							changeChooseperiodsStatu={(value) => dispatch(incomeExpendMxbActions.changeIncomeExpendMxbChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbList(value1, value2))
								// dispatch(accountMxbActions.getAccountMxbTree(value1, value2, currentAccoountUuid))
							}}
						/>

						<span className="incomeExpend-mxb-top-search">
							<span>摘要：</span>
							<span>
								{
									searchAbstract ?
									<Icon className="normal-search-delete" type="close-circle" theme='filled'
										onClick={() => {
											dispatch(incomeExpendMxbActions.changeIncomeExpendMxbSearchContent(''))
											dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,categoryUuid,'',1))
										}}
									/> : null

								}
								<Icon className="cxpz-serch-icon" type="search"
									onClick={() => {
										dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,categoryUuid,searchAbstract,1))
									}}
								/>
								<Input placeholder="根据摘要搜索流水"
									className="cxls-serch-input"
									value={searchAbstract}
									onChange={e => dispatch(incomeExpendMxbActions.changeIncomeExpendMxbSearchContent(e.target.value))}
									onKeyDown={(e) => {
										if (e.keyCode == Limit.ENTER_KEY_CODE){
											dispatch(incomeExpendMxbActions.changeIncomeExpendMxbSearchContent(searchAbstract))
											dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,categoryUuid,searchAbstract,1))
										}
									}}
								/>
							</span>
						</span>
					</div>
					<div className="flex-title-right">
						{
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="fifth"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

									excelDownloadUrl={`${ROOT}/jr/excel/export/incomeAndExpense/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&jrCategoryUuid=${categoryUuid}&jrCategoryCompleteName=${categoryName}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendIncomeExcelDetail', {begin: `${begin}`, end: `${end}`, jrCategoryUuid: categoryUuid, jrCategoryCompleteName: categoryName}))}

									allexcelDownloadUrl={`${ROOT}/jr/excel/export/all/incomeAndExpense/detail?${URL_POSTFIX}&begin=${begin}&end=${end}`}
									allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAllIncomeExcelDetail', {
										begin,
										end,
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '收支明细表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbListRefalsh(issuedate, endissuedate,categoryUuid,searchAbstract))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<TableWrap notPosition={true}>
					<Table
						dispatch={dispatch}
						currentPage={currentPage}
						pageCount={pageCount}
						categoryName={categoryName}
						incomeExpendDetailList={incomeExpendDetailList}
						openDetail={openDetail}
						totalAmountList={totalAmountList}
						paginationCallBack={value => dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,categoryUuid,searchAbstract,value))}
						refreshList={() => {
							dispatch(incomeExpendMxbActions.getPeriodAndIncomeExpendMxbListRefalsh(issuedate, endissuedate,categoryUuid,searchAbstract))
							}}
					/>
					<TreeContains
						issuedate={issuedate}
						endissuedate={endissuedate}
						dispatch={dispatch}
						runningCategory={runningCategory}
						curCategory={`${categoryUuid}${Limit.TREE_JOIN_STR}${oriName}${Limit.TREE_JOIN_STR}${categoryName}`}
					/>

				</TableWrap>
			</ContainerWrap>
		)
	}
}

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Input, Icon } from 'antd'
const Search = Input.Search
import { debounce } from 'app/utils'
import { TableWrap } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'
import TreeContains from './TreeContains'

import * as runningTypeMxbActions from 'app/redux/Mxb/RunningTypeMxb/runningTypeMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class RunningTypeMxb extends React.Component {

	static displayName = 'RunningTypeMxb'

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
			this.props.dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbList())
		}

	}

	render() {

		const { allState, homeState, dispatch, runningTypeMxbState } = this.props
		const { showModal } = this.state

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const issuedate = runningTypeMxbState.get('issuedate')
		const endissuedate = runningTypeMxbState.get('endissuedate')
		const runningTypeDetailList = runningTypeMxbState.get('runningTypeDetailList')
		const openDetail = runningTypeMxbState.get('openDetail')
		const totalAmountList = runningTypeMxbState.get('totalAmountList')

		const views = runningTypeMxbState.get('views')
		const chooseValue = views.get('chooseValue')
		const searchAbstract = views.get('searchAbstract')
		const typeUuid = views.get('typeUuid')
		const acName = views.get('acName')
		const oriName = views.get('oriName')
		const currentPage = runningTypeMxbState.get('currentPage')
		const pageCount = runningTypeMxbState.get('pageCount')
		const runningCategory = runningTypeMxbState.get('runningCategoryList')

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''



		return (
			<ContainerWrap type="mxb-one" className="runningType-mxb">
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
							changeChooseperiodsStatu={(value) => dispatch(runningTypeMxbActions.changeRunningTypeMxbChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbListFromReflash(value1, value2,typeUuid,searchAbstract ))
								// dispatch(accountMxbActions.getAccountMxbTree(value1, value2, currentAccoountUuid))
							}}
						/>
						{
							<span className="runningType-mxb-top-search">
								<span>摘要：</span>
								<span>
								{
									searchAbstract ?
									<Icon className="normal-search-delete" type="close-circle" theme='filled'
										onClick={() => {
											dispatch(runningTypeMxbActions.changeRunningTypeMxbSearchContent(''))
											dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,typeUuid,'',1))
										}}
									/> : null
								}
								<Icon className="cxpz-serch-icon" type="search"
									onClick={() => {
										dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,typeUuid,searchAbstract,1))
									}}
								/>


									<Input placeholder="根据摘要搜索流水"
										className="cxls-serch-input"
										value={searchAbstract}
										onChange={e => dispatch(runningTypeMxbActions.changeRunningTypeMxbSearchContent(e.target.value))}
										onKeyDown={(e) => {
											if (e.keyCode == Limit.ENTER_KEY_CODE){
												dispatch(runningTypeMxbActions.changeRunningTypeMxbSearchContent(searchAbstract))
												dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,typeUuid,searchAbstract,1))
											}
										}}
									/>
								</span>
							</span>
						}
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="fifth"
								exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/jr/excel/export/type/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&acId=${typeUuid}&mergeName=${acName}`}
								ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendTypeExcelDetail', {begin: begin, end: end, acId: typeUuid, mergeName: acName}))}

								allexcelDownloadUrl={`${ROOT}/jr/excel/export/all/type/detail?${URL_POSTFIX}&begin=${begin}&end=${end}`}
								allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAllTypeExcelDetail', {
									begin,
									end,
								}))}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '账户余额表',
									}))
								}}
							/>
						</span>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								this.props.dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbListFromReflash(issuedate, endissuedate,typeUuid,searchAbstract))
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
						runningTypeDetailList={runningTypeDetailList}
						openDetail={openDetail}
						totalAmountList={totalAmountList}
						acName={acName}
						paginationCallBack={value => dispatch(runningTypeMxbActions.getRunningTypeMxbBalanceListPages(issuedate, endissuedate,typeUuid,searchAbstract,value))}
						refreshList={() => {
							this.props.dispatch(runningTypeMxbActions.getPeriodAndRunningTypeMxbListFromReflash(issuedate, endissuedate,typeUuid,searchAbstract))
							}}
					/>
					{
						<TreeContains
							issuedate={issuedate}
							endissuedate={endissuedate}
							dispatch={dispatch}
							runningCategory={runningCategory}
							curCategory={`${typeUuid}${Limit.TREE_JOIN_STR}${oriName}${Limit.TREE_JOIN_STR}${acName}`}
						/>
					}

				</TableWrap>
			</ContainerWrap>
		)
	}
}

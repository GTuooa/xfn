import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Select } from 'antd'
import { debounce } from 'app/utils'
import { Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'
import TablePR from './TablePR'
import CategorySelect from './CategorySelect'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class RelativeYeb extends React.Component {

	static displayName = 'RelativeYeb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	componentDidMount() {
		this.props.dispatch(relativeYebActions.getPeriodAndRelativeYebBalanceList())
		this.props.dispatch(relativeYebActions.getRelativeYebCategoryFetch())
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.relativeYebState != nextprops.relativeYebState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { allState, dispatch, homeState, relativeYebState } = this.props

		const issuedate = relativeYebState.get('issuedate')
		const endissuedate = relativeYebState.get('endissuedate')
		const views = relativeYebState.get('views')
		const chooseValue = views.get('chooseValue')
		const showChildList = views.get('showChildList')
		const currentRelativeItem = views.get('currentRelativeItem')
		const currentRunningItem = views.get('currentRunningItem')
		const orderBy = views.get('orderBy')
		const balanceReport = relativeYebState.get('balanceReport')
		const categoryList = relativeYebState.get('categoryList')
		const runningCategoryList = relativeYebState.get('runningCategoryList')

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const categoryUuid = currentRelativeItem.get('name') === '全部' ? '' : currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''
		const cardCategoryUuid = currentRelativeItem.get('name') === '全部' ? '' :  currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		const analysisType = views.get('analysisType') ? views.get('analysisType') : ''
		const wlRelationshipStr = ({
			'': () => '总览',
			'HAPPEN': () => '发生额',
			'PAYMENT': () => '收付额',
			'RECEIVABLE': () => '应收应付额'
		}[analysisType])()

		return (
			<ContainerWrap type="fjgl-one" className="relative-yeb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Yeb')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<MutiPeriodMoreSelect
							issuedate={issuedate}
							endissuedate={endissuedate}
							issues={accountIssues}
							chooseValue={chooseValue}
							changeChooseperiodsStatu={(value) => dispatch(relativeYebActions.changeRelativeYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(relativeYebActions.getRelativeYebBalanceListFromSwitchPeriod(value1, value2, currentRelativeItem,currentRunningItem))
								// dispatch(relativeYebActions.getRelativeYebCategoryFetch(value1, value2))
							}}
						/>
						<div className="title-select-container">
							<span className="relative-yeb-top-search">
								<span>往来分析：</span>
								<Select
									value={wlRelationshipStr}
									className="relative-yeb-top-search-select"
									onChange={(value) => {
										dispatch(relativeYebActions.changeRelativeYebAnalysisValue(value))
										dispatch(relativeYebActions.getRelativeYebBalanceListFromSwitchPeriod(issuedate, endissuedate, currentRelativeItem,currentRunningItem))
									}}
								>
									<Option key={'a'} value={''}>{'总览'}</Option>
									<Option key={'b'} value={'HAPPEN'}>{'发生额'}</Option>
									<Option key={'c'} value={'PAYMENT'}>{'收付额'}</Option>
									{
										// <Option key={'d'} value={'RECEIVABLE'}>{'应收应付额'}</Option>
									}
								</Select>
							</span>
							<span className="relative-yeb-top-search">
								<span>往来类别：</span>
								<CategorySelect
									className="relative-yeb-top-search-select"
									categoryList={categoryList}
									nameString={'name'}
									uuidString={'uuid'}
									currentRelativeItem={currentRelativeItem}
									onChange={(value, label) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)

										const relativeItem = {
											uuid: valueList[0],
											name: label[0],
											top: valueList[1] === 'true',
											value: value,
										}

										dispatch(relativeYebActions.getRelativeYebBalanceListFromSwitchPeriodOrRelative(issuedate, endissuedate, fromJS(relativeItem),currentRunningItem))
									}}
								/>
							</span>
							<span className="relative-yeb-top-search">
								<span>流水类别：</span>
								<CategorySelect
									className="relative-yeb-top-search-select"
									categoryList={runningCategoryList}
									nameString={'jrCategoryName'}
									uuidString={'jrCategoryUuid'}
									currentRelativeItem={currentRunningItem}
									onChange={(value, label) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)

										const runningItem = {
											uuid: valueList[0],
											name: label[0],
											value: value,
											direction: valueList[2]
										}

										dispatch(relativeYebActions.getRelativeYebBalanceListFromSwitchPeriodOrRelative(issuedate, endissuedate,currentRelativeItem, fromJS(runningItem)))
									}}
								/>
							</span>
						</div>
					</div>
					<div className="flex-title-right">
						{
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="first"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay || analysisType !== ''}
									exportDisableTips={analysisType !== '' ? '暂不支持，敬请期待' : ''}
									excelDownloadUrl={`${ROOT}/jr/excel/export/contact/balance?${URL_POSTFIX}&begin=${begin}&end=${end}&categoryUuid=${categoryUuid}&cardCategoryUuid=${cardCategoryUuid}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendRelativeExcelbalance', {begin: begin, end: end,categoryUuid: categoryUuid,cardCategoryUuid:cardCategoryUuid}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '往来余额表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(relativeYebActions.getRelativeYebBalanceListRefresh(issuedate, endissuedate, currentRelativeItem,currentRunningItem))
								dispatch(relativeYebActions.getRelativeYebCategoryFetch(issuedate, endissuedate))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				{
					analysisType === 'PAYMENT' || analysisType === 'HAPPEN' ?
					<TablePR
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						balanceReport={balanceReport}
						showChildList={showChildList}
						chooseValue={chooseValue}
						currentRunningItem={currentRunningItem}
						currentRelativeItem={currentRelativeItem}
						orderBy={orderBy}
						analysisType={analysisType}
					/> :
					<Table
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						balanceReport={balanceReport}
						showChildList={showChildList}
						chooseValue={chooseValue}
						currentRunningItem={currentRunningItem}
						currentRelativeItem={currentRelativeItem}
						orderBy={orderBy}
						analysisType={analysisType}
					/>

				}
			</ContainerWrap>
		)
	}
}

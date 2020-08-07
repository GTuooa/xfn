import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Input, Radio, Icon, Checkbox, Select } from 'antd'
const Search = Input.Search
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import { debounce } from 'app/utils'
import { TableWrap } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { Export, Tab } from 'app/components'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Income/Table'
import TableType from './Type/TableType'
import TreeContainer from './TreeContainer'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
	class ProjectMxb extends React.Component {

	static displayName = 'ProjectMxb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	// constructor() {
	// 	super()
	// 	this.state = {
	// 		showCommonModal: true
	// 	}
	// }

	componentDidMount() {
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			this.props.dispatch(projectMxbActions.getPeriodAndProjectMxbBalanceList())
			// this.props.dispatch(accountMxbActions.getAccountMxbTree())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.projectMxbState != nextprops.projectMxbState || this.props.homeState != nextprops.homeState
	}


	render() {

		const { allState, projectMxbState, dispatch, homeState } = this.props

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const issuedate = projectMxbState.get('issuedate')
		const endissuedate = projectMxbState.get('endissuedate')
		const reportData = projectMxbState.get('reportData')
		const projectCategoryList = projectMxbState.get('projectCategoryList')
		const cardList = projectMxbState.get('cardList')
		const cardPages = projectMxbState.get('cardPages')
		const cardPageNum = projectMxbState.get('cardPageNum')
		const runningCategoryList = projectMxbState.get('runningCategoryList')
		const runningTypeList = projectMxbState.get('runningTypeList')

		const views = projectMxbState.get('views')
		const chooseValue = views.get('chooseValue')
		const chooseDirection = views.get('chooseDirection')
		const currentProjectItem = views.get('currentProjectItem')
		const searchContent = views.get('searchContent')
		const selectType = views.get('selectType')
		const currentCardItem = views.get('currentCardItem')
		const currentRunningCategoryItem = views.get('currentRunningCategoryItem')
		const currentRunningTypeItem = views.get('currentRunningTypeItem')

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const moduleInfo = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo'])
        const openQuantity = moduleInfo.indexOf('QUANTITY') > -1

		const tableName = views.get('tableName')

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
		const exportCardCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid'))
		const exportCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : '')
		let allCardUUidList = []
		cardList && cardList.map(item => {
			allCardUUidList.push(item.get('uuid'))
		})
		const exportCardUUidList = currentCardItem.get('uuid') ? [currentCardItem.get('uuid'),] : allCardUUidList



		const analysisValue = views.get('analysisValue') ? views.get('analysisValue') : '0'
		const wlRelationshipStr = ({
			'0': () => '总览',
			'1': () => '发生额',
			'2': () => '收付额',
			'3': () => '应收应付额'
		}[analysisValue])()
		const showAll = views.get('showAll')
		const mergeStock = views.get('mergeStock')

		// 筛选弹框
		const commonCardObj = projectMxbState.get('commonCardObj')
		const showStock = commonCardObj.get('showStock')
		const showCurrent = commonCardObj.get('showCurrent')
		const showAccount = commonCardObj.get('showAccount')

		const showCommonModal = commonCardObj.get('showCommonModal')
		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const modalName = commonCardObj.get('modalName')
        const stockCardList = commonCardObj.get('stockCardList')
        const contactCardList = commonCardObj.get('contactCardList')
        const accountCardList = commonCardObj.get('accountCardList')
        const chooseStockCard = commonCardObj.get('chooseStockCard')
        const chooseContactCard = commonCardObj.get('chooseContactCard')
        const chooseAccountCard = commonCardObj.get('chooseAccountCard')
        const showAccountModal = commonCardObj.get('showAccountModal')
        const curSelectAccountUuid = commonCardObj.get('curSelectAccountUuid')
        const curSelectContactUuid = commonCardObj.get('curSelectContactUuid')
        const curSelectStockUuid = commonCardObj.get('curSelectStockUuid')

		const amountPlaces = 8, balancePlaces = 9

		return (
			<ContainerWrap type="mxb-two" className="project-mxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb', 'pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb', 'pageList']).indexOf('往来明细表') === -1) {
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
							changeChooseperiodsStatu={(value) => dispatch(projectMxbActions.changeProjectMxbChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(projectMxbActions.changeProjectMxbAnalysisValue(analysisValue))
								if (tableName === 'Income') {
									dispatch(projectMxbActions.getProjectMxbBalanceListFromChangePeriod(value1, value2, currentCardItem, chooseDirection))
								} else {
									dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromChangePeriod(value1, value2, currentCardItem, chooseDirection))
								}
								dispatch(projectMxbActions.changeProjectMxbSearchContent(''))

							}}
						/>
						{
							<div className='project-mxb-change-type'>
								<Tab
									radius
									tabList={[{key:'Income',value:'收支'},{key:'Type',value:'类型'}]}
									activeKey={tableName}
									tabFunc={(v) => {
										dispatch(projectMxbActions.changeProjectMxbTable(v.key))
										dispatch(projectMxbActions.changeProjectMxbSearchContent(''))
										if (v.key === 'Income') {
											dispatch(projectMxbActions.getPeriodAndProjectMxbBalanceList(issuedate, endissuedate, 'false'))
										} else {
											dispatch(projectMxbActions.changeProjectMxbAnalysisValue('0'))
											dispatch(projectMxbActions.getPeriodAndProjecTypetMxbBalanceList(issuedate, endissuedate, 'false'))
										}
									}}
								/>
							</div>
						}
						{

						}
						<div className="title-select-container">
						{
							tableName === 'Income' ?
							<span className="project-mxb-top-select">
								<span>项目分析：</span>
								<Select
									value={wlRelationshipStr}
									className="project-mxb-top-analysis"
									onChange={(value) => {
										dispatch(projectMxbActions.changeProjectMxbAnalysisValue(value))
										dispatch(projectMxbActions.changeProjectMxbSearchContent(''))
										const filterCardObj = {
											showAccount: false,
											showStock: false,
											showCurrent: false,
											accountList: [],
											currentList: [],
											stockList: [],
											analyse: value,
										}
										dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
									}}
								>
									<Option key={'a'} value={'0'}>{'总览'}</Option>
									<Option key={'b'} value={'1'}>{'发生额'}</Option>
									<Option key={'c'} value={'2'}>{'收付额'}</Option>
									{
										// <Option key={'d'} value={'3'}>{'应收应付额'}</Option>
									}
								</Select>
							</span> : null
						}

							{
								tableName === 'Income' && analysisValue === '0' ?
								<Fragment>
									<span>
										<Checkbox
											className='project-mxb-top-branch'
											checked={showAll}
											onChange={(e)=>{
												dispatch(projectMxbActions.changeCommonValue('showAll',e.target.checked))
												dispatch(projectMxbActions.getProjectMxbBalanceListFresh())
											}}
										/>&nbsp;
										展开分流水
									</span>
									{
										showAll ?
										<span>
											<Checkbox
												className='project-mxb-top-branch'
												checked={mergeStock}
												onChange={(e)=>{
													dispatch(projectMxbActions.changeCommonValue('mergeStock',e.target.checked))
													dispatch(projectMxbActions.getProjectMxbBalanceListFresh())
												}}
											/>&nbsp;
											合并存货分流水
										</span> : null
									}

								</Fragment> : null
							}

							{
								analysisValue === '0' && showAll ||  analysisValue !== '0' || tableName !== 'Income'?
								<span className="project-mxb-top-abstract">
									<span className='top-search-name'>摘要：</span>
									<span>
										{
											searchContent ?
											<Icon className="normal-search-delete" type="close-circle" theme='filled'
												onClick={() => {
													dispatch(projectMxbActions.changeProjectMxbSearchContent(''))
													tableName === 'Income' ?
													dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage('')) :
													dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromFilterOrPage(''))

												}}
											/> : null
										}
										<Icon className="cxpz-serch-icon" type="search"
											onClick={() => {
												tableName === 'Income' ?
												dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage(searchContent)) :
												dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromFilterOrPage(searchContent))
											}}
										/>
										<Input placeholder="根据摘要搜索流水"
											className="cxls-serch-input"
											value={searchContent}
											onChange={e => dispatch(projectMxbActions.changeProjectMxbSearchContent(e.target.value))}
											onKeyDown={(e) => {
												if (e.keyCode == Limit.ENTER_KEY_CODE){
													dispatch(projectMxbActions.changeProjectMxbSearchContent(searchContent))
													tableName === 'Income' ?
													dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage(searchContent)) :
													dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromFilterOrPage(searchContent))
												}
											}}
										/>
									</span>
								</span> : null
							}
						</div>

					</div>
					<div className="flex-title-right">
						{
							tableName === 'Type' ?
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="fifth"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

									excelDownloadUrl={`${ROOT}/jr/excel/export/current/project/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&cardUuid=${currentCardItem.get('uuid')}&direction=${chooseDirection}&jrTypeUuid=${currentRunningTypeItem.get('jrJvTypeUuid')}&mergeName=${currentRunningTypeItem.get('mergeName') ? currentRunningTypeItem.get('mergeName') : '全部'}&cardUuidList=${exportCardUUidList}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendProjectExcelbalance', {
										begin,
										end,
										direction: chooseDirection,
										jrTypeUuid: currentRunningTypeItem.get('jrJvTypeUuid'),
										mergeName: currentRunningTypeItem.get('mergeName')? currentRunningTypeItem.get('mergeName') : '全部',
										cardUuidList: exportCardUUidList

									}))}
									allexcelDownloadUrl={`${ROOT}/jr/excel/export/all/project/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&direction=${chooseDirection}`}
									allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAllProjectExcelDetail', {
										begin,
										end,
										direction: chooseDirection,
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '项目类型明细表',
										}))
									}}
								/>
							</span> :
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="fifth"
									exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay || analysisValue !== '0'}
									exportDisableTips={analysisValue !== '0' ? '暂不支持，敬请期待' : ''}
									excelDownloadUrl={`${ROOT}/jr/excel/export/project/incomeAndExpense/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&cardUuid=${currentCardItem.get('uuid')}&direction=${chooseDirection}&jrCategoryUuid=${currentRunningCategoryItem.get('jrCategoryUuid')}&categoryUuid=${exportCardCategoryUuid}&cardCategoryUuid=${exportCardCategoryUuid}&cardUuidList=${exportCardUUidList}&showAll=${showAll}&mergeStock=${mergeStock}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendProjectIncomeExcelDetail', {
										begin,
										end,
										direction: chooseDirection,
										jrCategoryUuid: currentRunningCategoryItem.get('jrCategoryUuid'),
										categoryUuid: exportCategoryUuid,
										cardCategoryUuid: exportCardCategoryUuid,
										cardUuidList: exportCardUUidList,
										showAll,
										mergeStock,
									}))}
									allexcelDownloadUrl={`${ROOT}/jr/excel/export/all/project/incomeAndExpense/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&direction=${chooseDirection}`}
									allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAllProjectIncomeExcelDetail', {
										begin,
										end,
										direction: chooseDirection,
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '项目收支明细表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								if (tableName === 'Income') {
									dispatch(projectMxbActions.getProjectMxbBalanceListFresh())
								} else {
									dispatch(projectMxbActions.getProjectTypeMxbBalanceListFresh())
								}

							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<TableWrap notPosition={true}>
					{
						tableName === 'Income' ?
							<Table
								dispatch={dispatch}
								reportData={reportData}
								currentProjectItem={currentProjectItem}
								issuedate={issuedate}
								endissuedate={endissuedate}
								currentCardItem={currentCardItem}
								chooseDirection={chooseDirection}
								analysisValue={analysisValue}
								showStock={showStock}
								showCurrent={showCurrent}
								showAccount={showAccount}
								openQuantity={openQuantity}
								paginationCallBack={value => {
									dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage(searchContent, value))
								}}
								refreshList={() => {
									dispatch(projectMxbActions.getProjectMxbBalanceListFresh())

								}}
								chooseStockCard={chooseStockCard}
								chooseContactCard={chooseContactCard}
								chooseAccountCard={chooseAccountCard}
								curSelectAccountUuid={curSelectAccountUuid}
								curSelectContactUuid={curSelectContactUuid}
								curSelectStockUuid={curSelectStockUuid}
								modalName={modalName}
								accountCardList={accountCardList}
								stockCardList={stockCardList}
								contactCardList={contactCardList}
								showAll={showAll}
								amountPlaces={amountPlaces}
								balancePlaces={balancePlaces}
							/> :
							<TableType
								dispatch={dispatch}
								reportData={reportData}
								currentProjectItem={currentProjectItem}
								currentCardItem={currentCardItem}
								chooseDirection={chooseDirection}
								paginationCallBack={value => {
									dispatch(projectMxbActions.getProjectMxbBalanceListFromFilterOrPage(searchContent, value))
								}}
								refreshList={() => {
									dispatch(projectMxbActions.getProjectTypeMxbBalanceListFresh())
								}}

								amountPlaces={amountPlaces}
								balancePlaces={balancePlaces}
							/>
					}

					<TreeContainer
						cardList={cardList}
						cardPages={cardPages}
						cardPageNum={cardPageNum}
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						currentCardItem={currentCardItem}
						projectCategoryList={projectCategoryList}
						selectType={selectType}
						runningCategoryList={runningCategoryList}
						runningTypeList={runningTypeList}
						currentRunningCategoryItem={currentRunningCategoryItem}
						currentRunningTypeItem={currentRunningTypeItem}
						currentProjectItem={currentProjectItem}
						tableName={tableName}
					/>
				</TableWrap>

			</ContainerWrap>
		)
	}
}

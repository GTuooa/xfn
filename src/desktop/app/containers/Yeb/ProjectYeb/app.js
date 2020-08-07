import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Select, Radio } from 'antd'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import { debounce } from 'app/utils'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import { Export, Tab } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'
import TablePR from './TablePR'
import CategorySelect from './CategorySelect'
import RunningSelect from './RunningSelect'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as projectYebActions from 'app/redux/Yeb/ProjectYeb/projectYeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
	class ProjectYeb extends React.Component {

	static displayName = 'ProjectYeb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	componentDidMount() {
		this.props.dispatch(projectYebActions.getPeriodAndProjectYebBalanceList())
		const currentProjectItem = fromJS({
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		})
		this.props.dispatch(projectYebActions.getProjectYebCategoryFetch('', '', 'Income',false,currentProjectItem,'0'))
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.projectYebState != nextprops.projectYebState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { allState, dispatch, homeState, projectYebState } = this.props

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const views = projectYebState.get('views')
		const tableName = views.get('tableName')

		const issuedate = projectYebState.get('issuedate')
		const endissuedate = projectYebState.get('endissuedate')
		const chooseValue = views.get('chooseValue')
		const showChildList = views.get('showChildList')
		const currentProjectItem = views.get('currentProjectItem')
		const currentRunningItem = views.get('currentRunningItem')
		const currentJrTypeItem = views.get('currentJrTypeItem')
		const runningJrTypeItem = tableName === 'Income' ? currentRunningItem : currentJrTypeItem
		const balanceReport = projectYebState.get('balanceReport')
		const categoryList = projectYebState.get('categoryList')
		const runningCategoryList = projectYebState.get('runningCategoryList')
		const jrTypeList = projectYebState.get('jrTypeList')

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const exportCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? currentProjectItem.get('uuid') : '')
		const exportCardCategoryUuid = currentProjectItem.get('name') === '全部' ? '' : (currentProjectItem.get('top') ? '' : currentProjectItem.get('uuid'))

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		const analysisValue = views.get('analysisValue') ? views.get('analysisValue') : '0'
		const xmRelationshipStr = ({
			'0': () => '总览',
			'1': () => '发生额',
			'2': () => '收付额',
			'3': () => '应收应付额'
		}[analysisValue])()

		return (
			<ContainerWrap type="fjgl-one" className="project-yeb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Yeb', 'pageList']).size <= 1 ? '' :
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
							changeChooseperiodsStatu={(value) => dispatch(projectYebActions.changeProjectYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								if (tableName === 'Income') {
									dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriod(value1, value2, currentProjectItem, currentRunningItem,analysisValue))
								} else {
									dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriod(value1, value2, currentProjectItem, currentJrTypeItem))
								}
							}}
						/>
						{
							<div className='project-yeb-change-type'>
								<Tab
									radius
									tabList={[{key:'Income',value:'收支'},{key:'Type',value:'类型'}]}
									activeKey={tableName}
									tabFunc={(v) => {
										dispatch(projectYebActions.changeProjectYebTable(v.key))
										const newRunningItem = {
											jrCategoryUuid: '',
											jrCategoryName: '全部',
											value: '全部',
											direction: 'double_credit'
										}

										const newTypeItem = {
											jrJvTypeUuid: '',
											typeName: '全部',
											value: '全部',
											direction: 'double_credit',
											mergeName: '全部'
										}
										const newProjectItem = {
											uuid: '',
											name: '全部',
											value: '全部',
											top: false,
										}
										if (v.key === 'Income') {
											dispatch(projectYebActions.changeTabIncomeOrType(issuedate, endissuedate,'Income', currentProjectItem, fromJS(newRunningItem),analysisValue))
										} else {
											dispatch(projectYebActions.changeProjectYebAnalysisValue('0'))
											dispatch(projectYebActions.changeTabIncomeOrType(issuedate, endissuedate,'Type', currentProjectItem, fromJS(newTypeItem)))
										}
									}}
								/>

							</div>
						}
						<div className="title-select-container">
						{
							tableName === 'Income' ?
								<span className="project-yeb-top-search">
									<span>项目分析：</span>
									<Select
										value={xmRelationshipStr}
										className="project-yeb-top-search-select"
										onChange={(value) => {
											const newRunningItem = {
												jrCategoryUuid: '',
												jrCategoryName: '全部',
												value: '全部',
												direction: 'double_credit'
											}
											dispatch(projectYebActions.changeProjectYebAnalysisValue(value))
											dispatch(projectYebActions.changeTabIncomeOrType(issuedate, endissuedate,'Income', currentProjectItem, fromJS(newRunningItem),value))
										}}
									>
										<Option key={'a'} value={'0'}>{'总览'}</Option>
										<Option key={'b'} value={'1'}>{'发生额'}</Option>
										<Option key={'c'} value={'2'}>{'收付额'}</Option>
										{
											// <Option key={'d'} value={'3'}>{'应收应付额'}</Option>
										}
									</Select>
								</span>
								: null
						}

							<span className="project-yeb-top-search">
								<span>项目类别：</span>
								<CategorySelect
									className="project-yeb-top-search-select"
									categoryList={categoryList}
									currentProjectItem={currentProjectItem}
									onChange={(value, label) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)

										const projectItem = {
											uuid: valueList[0],
											name: label[0],
											top: valueList[1] === 'true',
											value: value,
										}
										if (tableName === 'Income') {
											dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, fromJS(projectItem), currentRunningItem,analysisValue))
										} else {
											dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, fromJS(projectItem), currentJrTypeItem))
										}

									}}
								/>
							</span>
							{
								tableName === 'Income' ?
									<span className="project-yeb-top-search">
										<span>流水类别：</span>
										<RunningSelect
											className="project-yeb-top-search-select"
											runningCategoryList={runningCategoryList}
											currentRunningItem={currentRunningItem}
											uuidString={'jrCategoryUuid'}
											nameString={'jrCategoryName'}
											onChange={(value, label) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)

												const newRunningtem = {
													jrCategoryUuid: valueList[0],
													jrCategoryName: valueList[1],
													direction: valueList[2],
													value: value,
												}

												dispatch(projectYebActions.getProjectYebBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newRunningtem),analysisValue))
											}}
										/>
									</span> :
									<span className="project-yeb-top-search">
										<span>类型：</span>
										<RunningSelect
											className="project-yeb-top-search-select"
											runningCategoryList={jrTypeList}
											currentRunningItem={currentJrTypeItem}
											uuidString={'jrJvTypeUuid'}
											nameString={'typeName'}
											onChange={(value, label) => {
												const valueList = value.split(Limit.TREE_JOIN_STR)

												const newTypeItem = {
													jrJvTypeUuid: valueList[0],
													typeName: valueList[1],
													direction: valueList[2],
													value: value,
													mergeName: valueList[3]
												}

												dispatch(projectYebActions.getProjectTypeBalanceListFromSwitchPeriodOrProject(issuedate, endissuedate, currentProjectItem, fromJS(newTypeItem)))
											}}
										/>
									</span>
							}
						</div>


					</div>
					<div className="flex-title-right">
						{
							tableName === 'Type' ?
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="first"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}
									excelDownloadUrl={`${ROOT}/jr/excel/export/project/balance?${URL_POSTFIX}&begin=${begin}&end=${end}&isType=${tableName === 'Income'?false:true}&categoryUuid=${exportCategoryUuid}&cardCategoryUuid=${exportCardCategoryUuid}&jrCategoryUuid=${''}&jrJvTypeUuid=${currentJrTypeItem.get('jrJvTypeUuid')}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendProjectExcelDetail', {
										begin,
										end,
										isType: true,
										categoryUuid: exportCategoryUuid,
										cardCategoryUuid: exportCardCategoryUuid,
										jrCategoryUuid: '',
										jrJvTypeUuid: currentJrTypeItem.get('jrJvTypeUuid'),
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '项目类型余额表',
										}))
									}}
								/>
							</span> :
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="first"
									exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay || analysisValue !== '0'}
									exportDisableTips={analysisValue !== '0' ? '暂不支持，敬请期待' : ''}

									excelDownloadUrl={`${ROOT}/jr/excel/export/project/incomeAndExpense/balance?${URL_POSTFIX}&begin=${begin}&end=${end}&categoryUuid=${exportCategoryUuid}&cardCategoryUuid=${exportCardCategoryUuid}&jrCategoryUuid=${currentRunningItem.get('jrCategoryUuid')}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendProjectIncomeExcelbalance', {
										begin,
										end,
										categoryUuid: exportCategoryUuid,
										cardCategoryUuid: exportCardCategoryUuid,
										jrCategoryUuid: currentRunningItem.get('jrCategoryUuid'),
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '项目收支余额表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(projectYebActions.getProjectYebBalanceListRefresh(issuedate, endissuedate, currentProjectItem, runningJrTypeItem, tableName,analysisValue))
								dispatch(projectYebActions.getProjectYebCategoryFetch(issuedate, endissuedate, tableName,true,currentProjectItem,analysisValue))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				{
					analysisValue === '1' || analysisValue === '2' ?
					<TablePR
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						balanceReport={balanceReport}
						showChildList={showChildList}
						chooseValue={chooseValue}
						runningJrTypeItem={runningJrTypeItem}
						analysisValue={analysisValue}
						currentProjectItem={currentProjectItem}
						tableName={tableName}
					/> :
					<Table
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						balanceReport={balanceReport}
						showChildList={showChildList}
						chooseValue={chooseValue}
						tableName={tableName}
						analysisValue={analysisValue}
						runningJrTypeItem={runningJrTypeItem}
						currentProjectItem={currentProjectItem}
					/>

				}

			</ContainerWrap>
		)
	}
}

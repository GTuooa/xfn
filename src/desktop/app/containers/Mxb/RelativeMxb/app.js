import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message, Input, Radio, Checkbox, Select } from 'antd'
import { Icon } from 'app/components'
const Search = Input.Search
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { debounce } from 'app/utils'
import { TableWrap, Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'
import TreeContain from './TreeContain'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'


@connect(state => state)
export default
class RelativeMxb extends React.Component {

	static displayName = 'RelativeMxb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	// constructor() {
	// 	super()
	// 	this.state = {
	// 		searchValue: ''
	// 	}
	// }

	componentDidMount() {
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			this.props.dispatch(relativeMxbActions.getPeriodAndRelativeMxbBalanceList())
			// this.props.dispatch(accountMxbActions.getAccountMxbTree())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.relativeMxbState != nextprops.relativeMxbState || this.props.homeState != nextprops.homeState
	}


	render() {

		const { allState, relativeMxbState, dispatch, homeState } = this.props

		const issuedate = relativeMxbState.get('issuedate')
		const endissuedate = relativeMxbState.get('endissuedate')
		const reportData = relativeMxbState.get('reportData')
		const relativeCategoryList = relativeMxbState.get('relativeCategoryList')
		const cardList = relativeMxbState.get('cardList')
		const cardPages = relativeMxbState.get('cardPages')
		const cardPageNum = relativeMxbState.get('cardPageNum')
		const runningCategoryList = relativeMxbState.get('runningCategoryList')
		const runningTypeList = relativeMxbState.get('runningTypeList')

		const views = relativeMxbState.get('views')
		const chooseValue = views.get('chooseValue')
		const chooseDirection = views.get('chooseDirection')
		const currentRelativeItem = views.get('currentRelativeItem')
		const searchContent = views.get('searchContent')
		const selectType = views.get('selectType')
		const currentCardItem = views.get('currentCardItem')
		const currentRunningCategoryItem = views.get('currentRunningCategoryItem')
		const currentRunningTypeItem = views.get('currentRunningTypeItem')

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const isSpread = homeState.getIn(['views', 'isSpread'])

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const moduleInfo = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo'])
        const openQuantity = moduleInfo.indexOf('QUANTITY') > -1

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		const analysisType = views.get('analysisType') ? views.get('analysisType') : ''
		const wlRelationshipStr = ({
			'': () => '总览',
			'HAPPEN': () => '发生额',
			'PAYMENT': () => '收付额',
			'RECEIVABLE': () => '应收应付额'
		}[analysisType])()
		const needBranch = views.get('needBranch')
		const mergeStockBranch = views.get('mergeStockBranch')
		const showStock = views.get('showStock')
		const showProject = views.get('showProject')
		const showJrCategory = views.get('showJrCategory')
		const showAccount = views.get('showAccount')

		// 筛选弹框
		const commonCardObj = relativeMxbState.get('commonCardObj')
		const showCommonModal = commonCardObj.get('showCommonModal')
		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const modalName = commonCardObj.get('modalName')
        const stockCardList = commonCardObj.get('stockCardList')
        const accountCardList = commonCardObj.get('accountCardList')
        const projectCardList = commonCardObj.get('projectCardList')
        const jrCategoryList = commonCardObj.get('jrCategoryList')
        const chooseStockCard = commonCardObj.get('chooseStockCard')
        const chooseProjectCard = commonCardObj.get('chooseProjectCard')
        const chooseAccountCard = commonCardObj.get('chooseAccountCard')
        const chooseJrCategoryCard = commonCardObj.get('chooseJrCategoryCard')
        const showAccountModal = commonCardObj.get('showAccountModal')
        const curSelectAccountUuid = commonCardObj.get('curSelectAccountUuid')
		const curSelectProjectUuid = commonCardObj.get('curSelectProjectUuid')
        const curSelectStockUuid = commonCardObj.get('curSelectStockUuid')
        const curSelectJrCategoryUuid = commonCardObj.get('curSelectJrCategoryUuid')

		const accountList = allState.get('accountList')
		const categoryUuid = currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : '')
		const cardCategoryUuid = currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid'))


		return (
			<ContainerWrap type="mxb-two" className="relative-mxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
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
							changeChooseperiodsStatu={(value) => dispatch(relativeMxbActions.changeRelativeMxbChooseValue(value))}
							changePeriodCallback={(value1, value2) => {
								dispatch(relativeMxbActions.changeRelativeMxbAnalysisValue(analysisType))
								dispatch(relativeMxbActions.changeRelativeMxbSearchContent(''))
								dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangePeriod(value1, value2, currentCardItem,chooseDirection))
							}}
						/>
						<div className="title-select-container">
							<span className="relative-mxb-top-select">
								<span>往来分析：</span>
								<Select
									value={wlRelationshipStr}
									className="relative-mxb-top-analysis"
									onChange={(value) => {
										dispatch(relativeMxbActions.changeRelativeMxbAnalysisValue(value))
										dispatch(relativeMxbActions.changeRelativeMxbSearchContent(''))
										const filterCardObj = {
											showAccount: false,
											showStock: false,
											showProject: false,
											showJrCategory: false,
											accountList: [],
											projectList: [],
											stockList: [],
											analysisType: value,
										}
										dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate,endissuedate,currentCardItem,chooseDirection,filterCardObj))
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
							{
								analysisType === '' ?
								<Fragment>
									<span>
										<Checkbox
											className='relative-mxb-top-branch'
											checked={needBranch}
											onChange={(e)=>{
												dispatch(relativeMxbActions.changeCommonValue('needBranch',e.target.checked))
												!e.target.checked && dispatch(relativeMxbActions.changeCommonValue('showJrCategory',false))
												dispatch(relativeMxbActions.getRelativeMxbBalanceListFresh())
											}}
										/>&nbsp;
										展开分流水
									</span>
									{
										needBranch ?
										<span>
											<Checkbox
												className='relative-mxb-top-branch'
												checked={mergeStockBranch}
												onChange={(e)=>{
													dispatch(relativeMxbActions.changeCommonValue('mergeStockBranch',e.target.checked))
													dispatch(relativeMxbActions.getRelativeMxbBalanceListFresh())

												}}
											/>&nbsp;
											合并存货分流水
										</span> : null
									}

								</Fragment> : null
							}

							{
								analysisType === '' && needBranch ||  analysisType !== ''?
								<span className="relative-mxb-top-search">
									<span>摘要：</span>
									<span>
										{
											searchContent ?
											<Icon className="normal-search-delete" type="close-circle" theme='filled'
												onClick={() => {
													dispatch(relativeMxbActions.changeRelativeMxbSearchContent(''))
													dispatch(relativeMxbActions.getRelativeMxbBalanceListFromFilterOrPage(''))
												}}
											/> : null
										}
										<Icon className="cxpz-serch-icon" type="search"
											onClick={() => {
												dispatch(relativeMxbActions.getRelativeMxbBalanceListFromFilterOrPage(searchContent))
											}}
										/>
										<Input placeholder="根据摘要搜索流水"
											className="cxls-serch-input"
											value={searchContent}
											onChange={e => dispatch(relativeMxbActions.changeRelativeMxbSearchContent(e.target.value))}
											onKeyDown={(e) => {
												if (e.keyCode == Limit.ENTER_KEY_CODE){
													dispatch(relativeMxbActions.changeRelativeMxbSearchContent(searchContent))
													dispatch(relativeMxbActions.getRelativeMxbBalanceListFromFilterOrPage(searchContent))
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
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="fifth"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay || analysisType !== ''}

									excelDownloadUrl={`${ROOT}/jr/excel/export/contact/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&jrCategoryUuid=${currentRunningCategoryItem.get('jrCategoryUuid')}&cardUuid=${currentCardItem.get('uuid')}&categoryUuid=${categoryUuid}&cardCategoryUuid=${cardCategoryUuid}&direction=${chooseDirection}&needBranch=${needBranch}&mergeStockBranch=${mergeStockBranch}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendRelativeExcelDetail', {begin: begin, end: end, jrCategoryUuid: currentRunningCategoryItem.get('jrCategoryUuid'), cardUuid: currentCardItem.get('uuid'),categoryUuid,cardCategoryUuid,direction: chooseDirection,needBranch:needBranch,mergeStockBranch:mergeStockBranch }))}
									exportDisableTips={analysisType !== '' ? '暂不支持，敬请期待' : ''}

									allexcelDownloadUrl={`${ROOT}/jr/excel/export/all/contact/detail?${URL_POSTFIX}&begin=${begin}&end=${end}&jrCategoryUuid=${currentRunningCategoryItem.get('jrCategoryUuid')}&direction=${chooseDirection}&needBranch=${needBranch}&mergeStockBranch=${mergeStockBranch}`}
									allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAllRelativeExcelDetail', {
										begin: `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
										end: `${endissuedate ? endissuedate.substr(0, 4) : issuedate.substr(0, 4)}-${endissuedate ? endissuedate.substr(6, 2) : issuedate.substr(6, 2)}`,
										jrCategoryUuid: currentRunningCategoryItem.get('jrCategoryUuid'),
										direction: chooseDirection,
										needBranch,
										mergeStockBranch,
									}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '往来明细表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(relativeMxbActions.getRelativeMxbBalanceListFresh(needBranch))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<TableWrap notPosition={true}>
					<Table
						dispatch={dispatch}
						reportData={reportData}
						currentRelativeItem={currentRelativeItem}
						chooseDirection={chooseDirection}
						paginationCallBack={value => {
							dispatch(relativeMxbActions.getRelativeMxbBalanceListFromFilterOrPage(searchContent, value))
						}}
						needBranch={needBranch}
						mergeStockBranch={mergeStockBranch}
						analysisType={analysisType}
						showStock={showStock}
						showProject={showProject}
						showJrCategory={showJrCategory}
						showAccount={showAccount}
						openQuantity={openQuantity}
						currentCardItem={currentCardItem}

						chooseStockCard={chooseStockCard}
						chooseProjectCard={chooseProjectCard}
						chooseAccountCard={chooseAccountCard}
						chooseJrCategoryCard={chooseJrCategoryCard}

						issuedate={issuedate}
						endissuedate={endissuedate}
						accountCardList={accountCardList}
						stockCardList={stockCardList}
						projectCardList={projectCardList}
						jrCategoryList={jrCategoryList}
						curSelectAccountUuid={curSelectAccountUuid}
						curSelectProjectUuid={curSelectProjectUuid}
						curSelectStockUuid={curSelectStockUuid}
						curSelectJrCategoryUuid={curSelectJrCategoryUuid}
						modalName={modalName}
					/>
					<TreeContain
						cardList={cardList}
						cardPages={cardPages}
						cardPageNum={cardPageNum}
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						currentCardItem={currentCardItem}
						relativeCategoryList={relativeCategoryList}
						selectType={selectType}
						runningCategoryList={runningCategoryList}
						runningTypeList={runningTypeList}
						currentRunningCategoryItem={currentRunningCategoryItem}
						currentRunningTypeItem={currentRunningTypeItem}
						currentRelativeItem={currentRelativeItem}
					/>
				</TableWrap>
			</ContainerWrap>
		)
	}
}

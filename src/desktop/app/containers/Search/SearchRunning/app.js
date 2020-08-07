import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, Select, message, Progress } from 'antd'
const Option = Select.Option
import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'

import Title from './Title'
import CardTable from './CardTable'
import ContainerWrap from 'app/components/Container/ContainerWrap'
// import RunningPreview from 'app/containers/components/RunningPreview/index'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'

@connect(state => state)
export default
class SearchRunning extends React.Component {

	static displayName = 'SearchRunning'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		searchRunningState: PropTypes.instanceOf(Map),
		homeState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			// inputValue: '',
			showCardModal: false,
			showRunningModal: false,
			showPayOrReceive: false,
			payList: fromJS([]),
			receivedList : fromJS([]),
			showRunningInfoModal: false,
			runningInfoModalType: false,
			yllsVisible: false,
		}
	}
	componentWillMount() {
		console.log(new Date());
	}
	componentDidMount() {
		console.log(new Date());
		this.props.dispatch(searchRunningActions.getPeriodAndBusinessList())
		this.props.dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'inputValue'], ''))
		this.props.dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'searchType'], 'SEARCH_TYPE_ABSTRACT'))
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.props.searchRunningState !== nextprops.searchRunningState || this.state !== nextstate || this.props.searchRunningAllState !== nextprops.searchRunningAllState
	}

	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.props.allState.getIn(['views', 'searchRunningPreviewVisibility']) === true) {
			this.props.dispatch(previewRunningActions.closePreviewRunning())
		}
	}

	render() {

		const { allState, dispatch, searchRunningState, homeState, searchRunningAllState } = this.props
		const { showCardModal, showRunningModal, showPayOrReceive, payList, receivedList, showRunningInfoModal, runningInfoModalType, yllsVisible } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPzPermission = PzPermissionInfo.getIn(['edit', 'permission'])

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const pageController = userInfo.get('pageController')
		const QUERY_VC = pageController.get('QUERY_VC')
		// const QUERY_JR = pageController.get('QUERY_JR')

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const panes = homeState.get('panes')
		const allPanes = homeState.get('allPanes')
		const issues = searchRunningState.get('issues')
		const businessTemp = searchRunningState.get('businessTemp')

		const inputValue = searchRunningState.getIn(['flags', 'inputValue'])
		const issuedate = searchRunningState.getIn(['flags', 'issuedate'])
		const endissuedate = searchRunningState.getIn(['flags', 'endissuedate'])
		const flags = searchRunningState.get('flags')
		const currentAccount = searchRunningState.getIn(['flags', 'currentAccount'])
		const curCategory = searchRunningState.getIn(['flags', 'curCategory'])
		const curAccountUuid = searchRunningState.getIn(['flags', 'curAccountUuid'])
		// const insertOrModify = searchRunningState.getIn(['flags', 'insertOrModify'])
		// const payOrReceive = searchRunningState.getIn(['flags', 'payOrReceive'])
		const selectList = searchRunningState.getIn(['flags', 'selectList'])
		const selectItem = searchRunningState.getIn(['flags', 'selectItem'])
		const pzSelectAllList = searchRunningState.getIn(['flags', 'pzSelectAllList'])
		const currentVcIndex = searchRunningState.getIn(['flags', 'currentVcIndex'])
		// const showRunningInfo = searchRunningState.getIn(['flags', 'showRunningInfo'])
		const accountName = searchRunningState.getIn(['flags', 'accountName'])
		const searchType = searchRunningState.getIn(['flags', 'searchType'])
		const allItemShow = searchRunningState.getIn(['flags', 'allItemShow'])
		const pageSize = searchRunningState.get( 'pageSize')

		const dateSortType = searchRunningState.getIn(['orderByList', 'dateSortType'])
		const indexSortType = searchRunningState.getIn(['orderByList', 'indexSortType'])
		const categorySortType = searchRunningState.getIn(['orderByList', 'categorySortType'])
		const certificateSortType = searchRunningState.getIn(['orderByList', 'certificateSortType'])
		const nameSortType = searchRunningState.getIn(['orderByList', 'nameSortType'])

		const accountList = allState.get('accountList')
		const taxRateTemp = searchRunningState.get('taxRateTemp')
		const pzDealNum = searchRunningState.getIn(['flags', 'pzDealNum'])
		const pzDealStatus = searchRunningState.getIn(['flags', 'pzDealStatus'])
		const pzDealType = searchRunningState.getIn(['flags', 'pzDealType'])
		const orderType = searchRunningState.getIn(['flags', 'orderType'])

		const enclosureList = searchRunningAllState.get('enclosureList')
		const uploadKeyJson = allState.get('uploadKeyJson')
		const lrPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const label = searchRunningAllState.get('label');// 附件标签
		// 附件上传
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		
		const pzDealList =  pzDealType == 'insert' ? pzSelectAllList : currentVcIndex

		const pzDealSchedule = pzDealList.size  ? (pzDealNum * 100 / pzDealList.size ).toFixed(2) : 0

		// intelligentStatus  true为智能总账
		
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false
		const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])
		const accountPoundage = allState.get('accountPoundage')

		return (
			<ContainerWrap type="search-two" className="search-running"
				onClick={() => {
					// 为了流水预览可以点击除了流水号外关闭流水预览抽屉
					// 流水号做阻止冒泡事件
					if (searchRunningPreviewVisibility) {
						dispatch(previewRunningActions.closePreviewRunning())
					}
				}}
			>
				<Title
					issues={issues}
					issuedate={issuedate}
					endissuedate={endissuedate}
					searchType={searchType}
					inputValue={inputValue}
					accountName={accountName}
					accountList={accountList}
					currentAccount={currentAccount}
					dispatch={dispatch}
					curCategory={curCategory}
					curAccountUuid={curAccountUuid}
					selectList={selectList}
					pzSelectAllList={pzSelectAllList}
					// changeInputValue={(value) => this.setState({inputValue: value})}
					newCard={() => this.setState({showCardModal: true})}
					newRunning={() => this.setState({showRunningModal: true})}
					payOrReceiveOnClick={() => this.setState({showPayOrReceive: true})}
					setReceivedList={value => this.setState({receivedList: value})}
					setPayList={value => this.setState({payList: value})}
					pageList = {pageList}
					isSpread = {isSpread}
					editLrAccountPermission={editLrAccountPermission}
					reviewLrAccountPermission={reviewLrAccountPermission}
					flags={flags}
					allPanes={allPanes}
					orderType={orderType}
					selectItem={selectItem}
					pageSize={pageSize}
				/>
				{
					pzDealStatus ?
					<div className="cxls-pz-progress">
						<div class="cxls-pz-modal-mask"></div>
						<Progress
							className="pz-progress-percentage"
							type="circle"
							percent={pzDealSchedule}
							width={80}
						/>
					</div>
					: ''
				}
				<TableWrap className="table-cxls-wrap" notPosition={true}>
					<CardTable
						issuedate={issuedate}
						endissuedate={endissuedate}
						inputValue={inputValue}
						dateSortType={dateSortType}
						indexSortType={indexSortType}
						categorySortType={categorySortType}
						certificateSortType={certificateSortType}
						nameSortType={nameSortType}
						selectList={selectList}
						searchRunningState={searchRunningState}
						curAccountUuid={curAccountUuid}
						dispatch={dispatch}
						openCardModal={() => this.setState({showCardModal: true})}
						openRunningModal={() => this.setState({showRunningModal: true})}
						businessTemp={businessTemp}
						panes={panes}
						accountList={accountList}
						editLrAccountPermission={editLrAccountPermission}
						reviewLrAccountPermission={reviewLrAccountPermission}
						editPzPermission={editPzPermission}
						intelligentStatus={intelligentStatus}
						allItemShow={allItemShow}
						orderTyp={orderType}
						accountPoundage={accountPoundage}
						lrPermissionInfo={lrPermissionInfo}
						enclosureList={enclosureList}
						label={label}
						enCanUse={enCanUse}
						uploadKeyJson={uploadKeyJson}
						checkMoreFj={checkMoreFj}
						QUERY_VC={QUERY_VC}
						pageSize={pageSize}
					/>
				</TableWrap>
			</ContainerWrap>
		)
	}
}

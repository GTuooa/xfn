import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'
import './style/index.less'

import Title from './Title'
import CardTable from './CardTable'
import Ylls from './Ylls'
import { TableWrap } from 'app/components'
import { Button, Select, message, Progress } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Cxls extends React.Component {

	componentDidMount() {
		// this.props.dispatch(cxlsActions.getBusinessList())
		this.props.dispatch(cxlsActions.getPeriodAndBusinessList())
    }

	constructor() {
		super()
		this.state = {
			// inputValue: '',
			showCardModal: false,
			showRunningModal: false,
			showPayOrReceive: false,
			payList: fromJS([]),
			receivedList : fromJS([]),
			showRunningInfoModal: false,
			runningInfoModalType: false,
			inputValue: '',
			yllsVisible: false
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.accountConfState !== nextprops.accountConfState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.props.cxlsState !== nextprops.cxlsState || this.props.yllsState !== nextprops.yllsState || this.props.lrAccountState !== nextprops.lrAccountState || this.state !== nextstate
	}

	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}

    render() {

        const { allState, accountConfState, dispatch, cxlsState, homeState, yllsState, lrAccountState } = this.props
		const { showCardModal, showRunningModal, showPayOrReceive, payList, receivedList, showRunningInfoModal, runningInfoModalType, inputValue, yllsVisible } = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const reviewLrAccountPermission = LrAccountPermissionInfo.getIn(['review', 'permission'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPzPermission = PzPermissionInfo.getIn(['edit', 'permission'])

		const allasscategorylist = allState.get('allasscategorylist')
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const panes = homeState.get('panes')
		const issues = cxlsState.get('issues')
		const isAdOrOp = allState.get('isAdOrOp')
		const businessTemp = cxlsState.get('businessTemp')

		const issuedate = cxlsState.getIn(['flags', 'issuedate'])
		const flags = cxlsState.get('flags')
		const main = cxlsState.getIn(['flags', 'main'])
		const mainWater = cxlsState.getIn(['flags', 'mainWater'])
		const currentAccount = cxlsState.getIn(['flags', 'currentAccount'])
		const currentAss = cxlsState.getIn(['flags', 'currentAss'])
		const curCategory = cxlsState.getIn(['flags', 'curCategory'])
		const curAccountUuid = cxlsState.getIn(['flags', 'curAccountUuid'])
		const insertOrModify = cxlsState.getIn(['flags', 'insertOrModify'])
		const accountAssModalShow = cxlsState.getIn(['flags', 'accountAssModalShow'])
		const runningInsertOrModify = cxlsState.getIn(['flags', 'runningInsertOrModify'])
		const payOrReceive = cxlsState.getIn(['flags', 'payOrReceive'])
		const selectList = cxlsState.getIn(['flags', 'selectList'])
		const pzSelectAllList = cxlsState.getIn(['flags', 'pzSelectAllList'])
		const currentVcIndex = cxlsState.getIn(['flags', 'currentVcIndex'])
		const assId = cxlsState.getIn(['flags', 'assId'])
		const assCategory = cxlsState.getIn(['flags', 'assCategory'])
		const acId = cxlsState.getIn(['flags', 'acId'])
		const showRunningInfo = cxlsState.getIn(['flags', 'showRunningInfo'])
		const accountName = cxlsState.getIn(['flags', 'accountName'])
		const searchType = cxlsState.getIn(['flags', 'searchType'])

		const dateSortType = cxlsState.getIn(['orderByList', 'dateSortType'])
		const categorySortType = cxlsState.getIn(['orderByList', 'categorySortType'])
		const amountSortType = cxlsState.getIn(['orderByList', 'amountSortType'])
		const nameSortType = cxlsState.getIn(['orderByList', 'nameSortType'])

		const runningTemp = cxlsState.get('runningTemp')
		const cardTemp = cxlsState.get('cardTemp')
		const modalTemp = cxlsState.get('modalTemp')
		// 已发生的--- 权责发生制
		const dutyList = cxlsState.get('dutyList')
		// 收付款生成的 支付或收款流水
		const realityList = cxlsState.get('realityList')
		// 未收款未付款的集合
		const waitPayList = cxlsState.get('waitPayList')
		const mediumAcAssList = cxlsState.get('mediumAcAssList')
		// 未出账
		const budgetList = cxlsState.get('budgetList')

		const runningCategory = cxlsState.get('runningCategory')
		const accountList = accountConfState.get('accountList')
		const taxRateTemp = cxlsState.get('taxRateTemp')
		const pzDealNum = cxlsState.getIn(['flags', 'pzDealNum'])
		const pzDealStatus = cxlsState.getIn(['flags', 'pzDealStatus'])
		const pzDealType = cxlsState.getIn(['flags', 'pzDealType'])

		const pzDealList =  pzDealType == 'insert' ? pzSelectAllList : currentVcIndex

		const pzDealSchedule = pzDealList.size  ? (pzDealNum * 100 / pzDealList.size ).toFixed(2) : 0

		// simplifyStatus true为专业版  intelligentStatus  true为智能总账
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false

		const lsItemData = yllsState.get('lsItemData')
		const curItem = yllsState.get('curItem')
		const runningFlowTemp = cxlsState.get('runningFlowTemp')
		const runningDate = runningFlowTemp.get('runningDate')
		const magenerType = runningFlowTemp.get('magenerType')
		const categoryType = runningFlowTemp.get('categoryType')
		const categoryTypeObj = categoryTypeAll[categoryType]
		const contactsCardRange = runningFlowTemp.getIn([categoryTypeObj, 'contactsCardRange'])
		const uuidList = lrAccountState.getIn(['flags', 'uuidList'])
		const isClose = flags.get('isClose')
		const projectList = flags.get('projectList')
		return (
			<div className="cxls">
				<Title
					issues={issues}
					issuedate={issuedate}
					searchType={searchType}
					inputValue={inputValue}
					main={main}
					mainWater={mainWater}
					accountName={accountName}
					accountList={accountList}
					currentAccount={currentAccount}
					currentAss={currentAss}
					dispatch={dispatch}
					curCategory={curCategory}
					curAccountUuid={curAccountUuid}
					assId={assId}
					assCategory={assCategory}
					acId={acId}
					selectList={selectList}
					pzSelectAllList={pzSelectAllList}
					mediumAcAssList={mediumAcAssList}
					changeInputValue={(value) => this.setState({inputValue: value})}
					newCard={() => this.setState({showCardModal: true})}
					newRunning={() => this.setState({showRunningModal: true})}
					payOrReceiveOnClick={() => this.setState({showPayOrReceive: true})}
					setReceivedList={value => this.setState({receivedList: value})}
					setPayList={value => this.setState({payList: value})}
					pageList = {pageList}
					isSpread = {isSpread}
					editLrAccountPermission={editLrAccountPermission}
					editPzPermission={editPzPermission}
					reviewLrAccountPermission={reviewLrAccountPermission}
					simplifyStatus={simplifyStatus}
					flags={flags}

				/>
				{
					yllsVisible ?
					<Ylls
						yllsVisible={yllsVisible}
						dispatch={dispatch}
						yllsState={yllsState}
						onClose={() => this.setState({yllsVisible: false})}
						editLrAccountPermission={editLrAccountPermission}
						panes={panes}
						lsItemData={lsItemData}
						uuidList={businessTemp}
						showDrawer={() => this.setState({yllsVisible: true})}
						refreshList={() =>dispatch(cxlsActions.afterModifyAccountAllList(true))}
						fromCxls={true}
						curItem={curItem}
						modalTemp={modalTemp}
						intelligentStatus={intelligentStatus}
						magenerType={magenerType}
						contactsCardRange={contactsCardRange}
						categoryTypeObj={categoryTypeObj}
						accountList={accountList}
						issuedate={issuedate}
						inputValue={inputValue}
						isClose={isClose}
						simplifyStatus={simplifyStatus}
						editPzPermission={editPzPermission}
						reviewLrAccountPermission={reviewLrAccountPermission}
						projectList={projectList}
					/>
					: ''
				}
				<TableWrap className="table-cxls-wrap">
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
					<CardTable
						issuedate={issuedate}
						inputValue={inputValue}
						dateSortType={dateSortType}
						categorySortType={categorySortType}
						amountSortType={amountSortType}
						nameSortType={nameSortType}
						selectList={selectList}
						cxlsState={cxlsState}
						dutyList={dutyList}
						main={main}
						mainWater={mainWater}
						curAccountUuid={curAccountUuid}
						waitPayList={waitPayList}
						dispatch={dispatch}
						openCardModal={() => this.setState({showCardModal: true})}
						openRunningModal={() => this.setState({showRunningModal: true})}
						businessTemp={businessTemp}
						panes={panes}
						accountList={accountList}
						editLrAccountPermission={editLrAccountPermission}
						reviewLrAccountPermission={reviewLrAccountPermission}
						editPzPermission={editPzPermission}
						simplifyStatus={simplifyStatus}
						intelligentStatus={intelligentStatus}
						showDrawer={() => this.setState({yllsVisible: true})}
						onClose={() => this.setState({yllsVisible: false})}
					/>
				</TableWrap>
			</div>
		)
	}
}

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List, is } from 'immutable'
import './style.less'

import ContainerWrap from 'app/components/Container/ContainerWrap'
import * as Limit from 'app/constants/Limit.js'
import { categoryTypeAll } from 'app/containers/components/moduleConstants/common'
import { receiptList, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'

import Title from './Title'
import Table from './Table'
import EditRunningModal from './EditRunningModal/index.js'
import Modals from './Modals'
import DeleteModal from './DeleteModal'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { Modal } from 'antd'

@connect(state => state)
export default
class SearchApproval extends React.Component {

	static displayName = 'SearchApproval'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showEditRunningModal: false,
			selectList: [],

			showPayModal: false,// 付款
			showAccountModal: false, // 挂帐
			showReceiveModal: false, // 收款
			showBookKeepingModal: false, // 核记

			receiveType: 'modal',
			receiveMoney: 0,
			receiveAccountUuid: '',

			confirmAccountingApprovalDetail: null,
			confirmReceiveApprovalDetail: null,
			confirmPayApprovalDetail: null,
			confirmBookKeepingApprovalDetail: null,

			deleteModalShow: false,
		}
	}

	componentDidMount() {
		this.props.dispatch(searchApprovalActions.getApprovalProcessList({searchType: 'PROCESS_SEARCH_TITLE', searchContent:'', dateType: 'DATE_TYPE_END', beginDate: null, endDate: null, accountingType: 'ALL', isAsc: false, orderField: 'ORDER_DATE_END'}, 1, Limit.SEARCH_RUNNING_LINE_LENGTH))
		this.props.dispatch(homeActions.setDdConfig())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.props.searchApprovalState !== nextprops.searchApprovalState || this.state !== nextstate
	}

	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.props.allState.getIn(['views', 'searchRunningPreviewVisibility']) === true) {
			this.props.dispatch(previewRunningActions.closePreviewRunning())
		}

		if (!is(this.props.searchApprovalState.get('approvalList'), nextprops.searchApprovalState.get('approvalList'))) {
			this.setState({selectList: []})
		}
	}

	render() {

		const { allState, dispatch, searchApprovalState, homeState } = this.props
		const {
			showEditRunningModal,
			selectList,
			showPayModal,
			showAccountModal,
			showReceiveModal,
			showBookKeepingModal,
			confirmAccountingApprovalDetail,
			confirmReceiveApprovalDetail,
			confirmPayApprovalDetail,
			confirmBookKeepingApprovalDetail,
			receiveType,
			receiveMoney,
			receiveAccountUuid,
			deleteModalShow,
		} = this.state

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const controller = userInfo.getIn(['pageController', 'QUERY_PROCESS', 'preDetailList'])

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])	
		const searchType = searchApprovalState.getIn(['views', 'searchType'])	
		const accountingType = searchApprovalState.getIn(['views', 'accountingType'])	
		const beginDate = searchApprovalState.getIn(['views', 'beginDate'])	
		const dateType = searchApprovalState.getIn(['views', 'dateType'])	
		const endDate = searchApprovalState.getIn(['views', 'endDate'])	
		const searchContent = searchApprovalState.getIn(['views', 'searchContent'])
		const orderField = searchApprovalState.getIn(['views', 'orderField'])
		const sortByBeginDate = searchApprovalState.getIn(['views', 'sortByBeginDate'])
		const sortByEndDate = searchApprovalState.getIn(['views', 'sortByEndDate'])
		const sortByDealtype = searchApprovalState.getIn(['views', 'sortByDealtype'])
			
		const approvalList = searchApprovalState.get('approvalList')
		const currentPage = searchApprovalState.get('currentPage')
		const pageCount = searchApprovalState.get('pageCount')
		const pageSize = searchApprovalState.get('pageSize')

		const canDeleteIdList = searchApprovalState.get('canDeleteIdList')
		
		const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])

		let canAccount = false // 可否挂帐
		let canBookkeeping = false // 可否核记
		let canPay = false // 可否付款
		let canReceive = false // 可否收款
		let canDisuse = false // 可否作废
		let canSetAccount = false // 可否批量设置账户
		let receiveTotalMoney = 0

		if (selectList.length) {
			approvalList.forEach(v => {
				v.get('detailList').forEach(w => {
					if (selectList.indexOf(w.get('id')) > -1) {
						if (!w.get('dealState')) {

							canDisuse = true

							if (hideCategoryCanSelect.indexOf(w.get('jrCategoryType')) > -1) {
								canBookkeeping = true
							} else {
								canAccount = true
								if (receiptList.indexOf(w.get('jrCategoryType')) > -1) {

									if (w.get('jrAmount') > 0) {
										canReceive = true
										receiveTotalMoney = receiveTotalMoney + w.get('jrAmount')
									} else if (w.get('jrAmount') < 0) {
										canPay = true
									}
									
									if (w.getIn(['account', 'accountUuid'])) {
										canSetAccount = true
									}
								} else {
									if (w.get('jrAmount') > 0) {
										canPay = true
									} else if (w.get('jrAmount') < 0) {
										canReceive = true
										receiveTotalMoney = receiveTotalMoney - w.get('jrAmount') // 支付的负数可以加到手续费里
									}
								}
							}
						}
					}
				})
			})
		}

		return (
			<ContainerWrap type="search-three" className="search-approval"
				onClick={() => {
					// 为了流水预览可以点击除了流水号外关闭流水预览抽屉
					// 流水号做阻止冒泡事件
					if (searchRunningPreviewVisibility) {
						dispatch(previewRunningActions.closePreviewRunning())
					}
				}}
			>
				<Title
					pageList={pageList}
					isSpread={isSpread}
					dispatch={dispatch}
					receiveTotalMoney={receiveTotalMoney}
					selectList={selectList}
					clearSelectList={() => this.setState({selectList: []})}
					searchType={searchType}
					beginDate={beginDate}
					dateType={dateType}
					endDate={endDate}
					accountingType={accountingType}
					searchContent={searchContent}
					editLrAccountPermission={editLrAccountPermission}
					sortByBeginDate={sortByBeginDate}
					sortByEndDate={sortByEndDate}
					orderField={orderField}
					pageSize={pageSize}
					approvalList={approvalList}
					onShowPayModal={() => this.setState({showPayModal: true})}
					onShowAccountModal={() => this.setState({showAccountModal: true})}
					onShowReceiveModal={() => this.setState({showReceiveModal: true})}
					onShowBookKeepingModal={() => this.setState({showBookKeepingModal: true})}
					canAccount={canAccount}
					canPay={canPay}
					canReceive={canReceive}
					canDisuse={canDisuse}
					canBookkeeping={canBookkeeping}
					setConfirmAccountingApprovalDetail={(func) => this.setState({
						confirmAccountingApprovalDetail: func
					})}
					setConfirmReceiveApprovalDetail={(func) => this.setState({
						confirmReceiveApprovalDetail: func
					})}
					setConfirmPayApprovalDetail={(func) => this.setState({
						confirmPayApprovalDetail: func
					})}
					setBookKeepingApprovalDetail={(func) => this.setState({
						confirmBookKeepingApprovalDetail: func
					})}
					openDeleteModal={() => this.setState({deleteModalShow: true})}
				/>
				<Table
					approvalList={approvalList}
					dispatch={dispatch}
					openEditRunningModal={() => this.setState({showEditRunningModal: true})}
					addCheckDetailItem={idList => {
						let oriSelectList = Array.from(new Set(selectList.concat(idList)))
						this.setState({selectList: oriSelectList})
					}}
					deleteCheckDetailItem={idList => {
						let oriSelectList = selectList.filter(v => idList.indexOf(v) === -1)
						this.setState({selectList: oriSelectList})
					}}
					selectList={selectList}
					setSelectList={(list) => this.setState({selectList: list})}
					editLrAccountPermission={editLrAccountPermission}
					currentPage={currentPage}
					pageCount={pageCount}
					pageSize={pageSize}
					paginationCallBack={(value, pageSize) => {dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType, orderField, isAsc: ''}, value, pageSize))}}
					sortByBeginDateCallBack={() => {dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType, orderField: 'ORDER_DATE_START', isAsc: !sortByBeginDate}, 1, pageSize))}}
					sortByEndDateCallBack={() => {dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType, orderField: 'ORDER_DATE_END', isAsc: !sortByEndDate}, 1, pageSize))}}
					sortByDealtypeCallBack={() => {dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType, orderField: 'ORDER_DEAl_TYPE', isAsc: !sortByDealtype}, 1, pageSize))}}
					clearSelectList={() => this.setState({selectList: []})}
					sortByBeginDate={sortByBeginDate}
					sortByEndDate={sortByEndDate}
					sortByDealtype={sortByDealtype}
				/>
				{
					showEditRunningModal ?
					<EditRunningModal
						onShowPayModal={() => this.setState({showPayModal: true})}
						onShowAccountModal={() => this.setState({showAccountModal: true})}
						onShowReceiveModal={() => this.setState({showReceiveModal: true})}
						onShowBookKeepingModal={() => this.setState({showBookKeepingModal: true})}
						onCancel={() => {
							this.setState({showEditRunningModal: false})
							dispatch(searchApprovalActions.clearSearchApprovalTemp())
						}}
						setSelectList={(list) => this.setState({selectList: list})}
						setConfirmAccountingApprovalDetail={(func) => this.setState({
							confirmAccountingApprovalDetail: func
						})}
						setConfirmReceiveApprovalDetail={(func) => this.setState({
							confirmReceiveApprovalDetail: func
						})}
						setConfirmPayApprovalDetail={(func) => this.setState({
							confirmPayApprovalDetail: func
						})}
						setBookKeepingApprovalDetail={(func) => this.setState({
							confirmBookKeepingApprovalDetail: func
						})}
						setReceiveMoney={(value, uuid) => {
							this.setState({
								receiveType: 'modal',
								receiveMoney: value,
								receiveAccountUuid: uuid,
							})
						}}
						cancelSetReceiveMoney={() => {
							this.setState({
								receiveType: '',
								receiveMoney: 0,
								receiveAccountUuid: '',
							})
						}}
					/>
					: null
				}
				<Modals
					showPayModal={showPayModal}
					showAccountModal={showAccountModal}
					showReceiveModal={showReceiveModal}
					showBookKeepingModal={showBookKeepingModal}
					selectList={selectList}
					canSetAccount={canSetAccount}
					receiveTotalMoney={receiveTotalMoney} 
					callBack={() => this.setState({selectList: []})}
					cancelShowPayModal={() => this.setState({showPayModal: false})}
					cancelShowAccountModal={() => this.setState({showAccountModal: false})}
					cancelShowReceiveModal={() => this.setState({showReceiveModal: false})}
					cancelShowBookKeepingModal={() => this.setState({showBookKeepingModal: false})}
					confirmAccountingApprovalDetail={(values, callBack) => confirmAccountingApprovalDetail(values, callBack)}
					confirmReceiveApprovalDetail={(values, callBack) => confirmReceiveApprovalDetail(values, callBack)}
					confirmPayApprovalDetail={(values, callBack) => confirmPayApprovalDetail(values, callBack)}
					confirmBookKeepingApprovalDetail={(values, callBack) => confirmBookKeepingApprovalDetail(values, callBack)}
					receiveType={receiveType}
					editLrAccountPermission={editLrAccountPermission}
				
					receiveAccountUuid={receiveAccountUuid}
					cancelSetReceiveMoney={() => {
						this.setState({
							receiveType: '',
							receiveMoney: 0,
							receiveAccountUuid: '',
						})
					}}
				/>
				{
					deleteModalShow ?
					<DeleteModal
						onCloseModal={() => this.setState({deleteModalShow: false})}
						canDeleteIdList={canDeleteIdList}
						clearSelectList={() => this.setState({selectList: []})}
						approvalList={approvalList}
						editLrAccountPermission={editLrAccountPermission}
						dispatch={dispatch}
					/>
					: null
				}
			</ContainerWrap>
		)
	}
}

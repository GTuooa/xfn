import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import thirdParty from 'app/thirdParty'
import { Container, Row, ScrollView, Icon, Single, TextInput, SearchBar } from 'app/components'
import MutiDateSelect from 'app/containers/components/MutiPeriodMoreSelect/MutiDateSelect.jsx'
import { searchTypeStr, searchNameStr } from 'app/containers/Search/SearchApproval/common/common.js'

import Item from './Item'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
	class ApprovalAll extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({ title: '查询审批' })
		thirdParty.setIcon({
			showIcon: false
		})
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: 'DATE_TYPE_END', beginDate: null, endDate: null, processCode: 'PROCESS_CODE_ALL' }, 1))
			this.props.dispatch(searchApprovalActions.getApprovalProcessModelList({ dateType: 'DATE_TYPE_END', beginDate: null, endDate: null }, 1))
		}
	}

	constructor() {
		super()
		this.state = {
			isSearch: false,
			isloadingNext: false,
			startY: 0,
			isUpSliding: false
		}
	}

	render() {
		const {
			allState,
			dispatch,
			homeState,
			searchApprovalState,
			history,
		} = this.props
		const { isSearch, isloadingNext, startY, isUpSliding } = this.state

		const approvalList = searchApprovalState.get('approvalList')

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const views = searchApprovalState.get('views')
		const beginDate = views.get('beginDate')
		const endDate = views.get('endDate')
		const searchType = views.get('searchType')
		const searchContent = views.get('searchContent')
		const dateType = views.get('dateType')
		const processCode = views.get('processCode')
		const showChildList = views.get('showChildList')
		const pageCount = views.get('pageCount')
		const currentPage = views.get('currentPage')

		const processModelList = searchApprovalState.get('processModelList')

		let jrUuidList = fromJS([])
		let detailListSize = 0
		approvalList.map((v, i) => {
			let detailList = v.get('detailList')
			detailList.forEach(w => {
				detailListSize += 1
				if (w.get('jrOriUuid')) {
					let item = w.set('oriUuid', w.get('jrOriUuid'))
					jrUuidList = jrUuidList.push(item)
				}
			})
		})

		let source = []
		let sourceName = {}
		processModelList.forEach(v => {
			sourceName[v.get('processCode')] = v.get('modelName')
			source.push({
				key: v.get('modelName'),
				value: v.get('processCode')
			})
		})

		const accountList = allState.get('accountList');
        const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

		return (
			<Container className="search-approval">
				<MutiDateSelect
					start={beginDate}
					end={endDate}
					dateSelectList={[
						{ key: '提交日期', value: 'DATE_TYPE_START' },
						{ key: '完成日期', value: 'DATE_TYPE_END' },
					]}
					chooseValue={dateType}
					onBeginOk={(value1, value2) => {//跨期选择完开始时间后
						dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: value1, endDate: value2, processCode: 'PROCESS_CODE_ALL' }, 1))
						dispatch(searchApprovalActions.getApprovalProcessModelList({ dateType: dateType, beginDate: value1, endDate: value2 }, 1))
						this.setState({ isSearch: false })
					}}
					onEndOk={(value1, value2) => {//跨期选择完结束时间后
						dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: value1, endDate: value2, processCode: 'PROCESS_CODE_ALL' }, 1))
						dispatch(searchApprovalActions.getApprovalProcessModelList({ dateType: dateType, beginDate: value1, endDate: value2 }, 1))
						this.setState({ isSearch: false })
					}}
					changeChooseValue={(value) => {
						dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: value, beginDate: beginDate, endDate: endDate, processCode: 'PROCESS_CODE_ALL' }, 1))
						dispatch(searchApprovalActions.getApprovalProcessModelList({ dateType: value, beginDate: beginDate, endDate: endDate }, 1))
						this.setState({ isSearch: false })
					}}
				/>
				<Row className="search-approval-title-wrap">
					<div className="search-approval-title-switch-wrap" style={{ display: isSearch ? 'none' : '' }}>
						<ul className="search-approval-title-switch-list">
							<li className="search-approval-title-switch-item-cur">
								<span>审批：</span>
								<Single
									className="search-approval-title-switch-item-single"
									district={source}
									value={processCode}
									canSearch={false}
									onOk={value => {
										dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: value.value }, 1))
									}}
								>
									{sourceName[processCode]}
									<Icon type="triangle" className="search-approval-title-switch-item-single-triangle" />
								</Single>
							</li>
							<li
								className="search-approval-title-switch-item"
								onClick={() => {
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('currentPageType', 'Detail'))
									dispatch(searchApprovalActions.getApprovalProcessDetailList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: 'DATE_TYPE_END', beginDate: beginDate, endDate: endDate, accountingType: 'ALL' }, 1))
								}}
							>
								明细
							</li>
						</ul>
						<i className="search-approval-title-switch-i"></i>
						<div
							className="search-approval-title-switch-search"
							onClick={() => {
								this.setState({ isSearch: true })
							}}
						>
							<Icon type="search" />
						</div>
					</div>
					<div className="search-approval-title-search-wrap" style={{ display: isSearch ? '' : 'none' }}>
						<Single
							className="search-approval-title-search-single"
							district={searchTypeStr}
							value={searchType}
							canSearch={false}
							onOk={value => {
								dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchType', value.value))
							}}
						>
							{searchNameStr[searchType]}&nbsp;<Icon type="triangle" />
						</Single>
						<i className="search-approval-title-search-i"></i>
						{
							// <span className="search-approval-title-search-icon" onClick={() => {
							// 	dispatch(searchApprovalActions.getApprovalProcessList({ searchType: searchType, searchContent: searchContent, dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, 1))
							// }}>
							// 	<Icon type="search" />
							// </span>
						}
						<span className="search-approval-title-search-input">
							<SearchBar
								placeholder={searchNameStr[searchType] ? `搜索${searchNameStr[searchType]}` : ''}
								value={searchContent}
								onChange={value => {
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('searchContent', value))
								}}
								onSubmit={(value) => {
									dispatch(searchApprovalActions.getApprovalProcessList({ searchType: searchType, searchContent: value, dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, 1))
								}}
								onCancel={() => {
									this.setState({ isSearch: false })
									dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, 1))
								}}
								onClear={() => {
									dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, 1))
								}} 
							/>
						</span>
						{
							// <div className="search-approval-title-search-cancel" onClick={() => {
							// 	this.setState({ isSearch: false })
							// 	dispatch(searchApprovalActions.getApprovalProcessList({ searchType: 'PROCESS_SEARCH_TITLE', searchContent: '', dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, 1))
							// }}>
							// 	取消
							// </div>
						}
					</div>
				</Row>
				<ScrollView
					className="needsclick"
					flex='1'
					savePosition={true}
					uniqueKey="ApprovalAll"
					onTouchStart={(e) => {
						const startY = e.touches[0].pageY;    
						this.setState({
							startY
						})
					}}
					onTouchEnd={(e) => {
						const endY = e.changedTouches[0].pageY;
						const dy = startY - endY;
						if (dy > 0) {//向上滑动
							this.setState({isUpSliding: true})
						}
					}}
					onScroll={(e) => {
						const clientHeight = e.target.clientHeight
						const scrollY = e.target.scrollTop
						const scrollHeight = e.target.scrollHeight

						if (isloadingNext) {
							return
						}
						
						if (clientHeight + scrollY >= scrollHeight && currentPage < pageCount && isUpSliding) {
							this.setState({isloadingNext: true})
							dispatch(searchApprovalActions.getApprovalProcessList({ searchType: searchType, searchContent: searchContent, dateType: dateType, beginDate: beginDate, endDate: endDate, processCode: processCode }, currentPage + 1, null, () => {
								this.setState({isloadingNext: false, isUpSliding: false })
							}))
						}
					}}
				>
					{
						approvalList.map((v, i) => {
							return <Item
								key={i}
								item={v}
								dispatch={dispatch}
								editLrAccountPermission={editLrAccountPermission}
								history={history}
								jrUuidList={jrUuidList}
								showChildList={showChildList}
								addCheckDetailItem={id => {
									let newShowChildList = showChildList.push(id)
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('showChildList', newShowChildList))
								}}
								deleteCheckDetailItem={id => {
									let newShowChildList = showChildList.filter(v => v !== id)
									dispatch(searchApprovalActions.changeSearchApprovalCommonString('showChildList', newShowChildList))
								}}
								accountSelectList={accountSelectList}
							/>
						})
					}
				</ScrollView>
			</Container>
		)
	}
}

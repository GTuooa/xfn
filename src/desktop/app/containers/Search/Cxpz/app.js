import React from 'react'
import { toJS } from 'immutable'
import { connect } from 'react-redux'

import Table from './Table.jsx'
import Title from './Title.jsx'
import { Button, Menu, Dropdown, Icon, Pagination } from 'antd'
import { formatMoney } from 'app/utils'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import './style/index.less'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

@connect(state => state)
export default
class Cxpz extends React.Component {

	constructor() {
		super()
		this.state = {inputValue: '', sortBy: '', searchType: 'PROPERTY_ZONGHE', isSearching: false}
	}

	componentDidMount() {
		this.props.dispatch(cxpzActions.getPeriodAndVcListFetch('',{getPeriod:'true'}))
		this.props.dispatch(homeActions.setDdConfig())
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.cxpzState != nextprops.cxpzState || this.props.allState != nextprops.allState || this.props.homeState != nextprops.homeState || this.state != nextstate
	}

	render() {
		const { dispatch, cxpzState, allState, homeState } = this.props
		const { inputValue, sortBy, searchType, isSearching } = this.state
		//查询凭证权限
		const preDetailList = homeState.getIn(['data','userInfo','pageController','QUERY_VC','preDetailList'])
		// const QUERY_VC = homeState.getIn(['data','userInfo','pageController','QUERY_VC'])
		const AC_BALANCE_STATEMENT = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','AC_BALANCE_STATEMENT'])
		const SAVE_VC = homeState.getIn(['data','userInfo','pageController','SAVE_VC'])
		const PRINT = homeState.getIn(['data', 'userInfo','pageController','QUERY_VC','preDetailList','PRINT'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
		const issues = allState.get('issues')
		const vclist = cxpzState.get('vclist')

		const period = allState.get('period')
		const year = allState.getIn(['period', 'openedyear'])
		const month = allState.getIn(['period', 'openedmonth'])
		// const issuedate = cxpzState.get('issuedate') || issues.get(0)
		const issuedate = cxpzState.get('issuedate')

		const selectVcAll = cxpzState.getIn(['flags', 'selectVcAll'])
		const maxVoucherId = cxpzState.getIn(['flags', 'maxVoucherId'])
		const vclistSize = cxpzState.getIn(['flags', 'vclistSize'])

		const currentPage = cxpzState.getIn(['flags', 'currentPage'])
		const pageCount = cxpzState.getIn(['flags', 'pageCount'])
		const pageSize = cxpzState.getIn(['flags', 'pageSize'])
		const closeby = vclist.getIn([ 0, 'closedby']) ? true : false

		const vcindexSort = cxpzState.getIn(['flags', 'vcindexSort']) === 1 ? 'ASC' : 'DESC'
		const vcdateSort = cxpzState.getIn(['flags', 'vcdateSort']) === 1 ? 'ASC' : 'DESC'
		const vcreviewedSort = cxpzState.getIn(['flags', 'vcreviewedSort']) === 1 ? 'ASC' : 'DESC'

		const firstyear = period.get('firstyear')
		const lastyear = period.get('lastyear')

		const havVc = !!firstyear && !!lastyear
		const vclistExist = vclist.size ? true : false

		const receiveAble = vclist.filter(v => v.get('checkboxDisplay')).every(v => v.get('reviewedby'))
		const cancelReceiveAble = vclist.filter(v => v.get('checkboxDisplay')).some(v => v.get('reviewedby'))

		let sortByTime = ''
		let sortByIndex = ''
		let sortByReviewed = ''
		//有没有开启附件
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false

		;({
			'' : () => {
				return
			},
			'time' : () => {
				return(
					sortByTime = vcdateSort,
					sortByIndex = '',
					sortByReviewed = ''
				)
			},
			'index' : () => {
				return(
					sortByTime = '',
					sortByIndex = vcindexSort,
					sortByReviewed = ''
				)
			},
			'reviewed' : () => {
				return(
					sortByTime = '',
					sortByIndex = '',
					sortByReviewed = vcreviewedSort
				)
			}
		}[sortBy])()


		return (
			<ContainerWrap type="search-one" className="cxpz">
				<Title
					havVc={havVc}
					year={year}
					month={month}
					SAVE_VC={SAVE_VC}
					PRINT={PRINT}
					preDetailList={preDetailList}
					PzPermissionInfo={PzPermissionInfo}
					sortByTime={sortByTime}
					sortByIndex={sortByIndex}
					sortByReviewed={sortByReviewed}
					receiveAble={receiveAble}
					cancelReceiveAble={cancelReceiveAble}
					firstyear={firstyear}
					allState={allState}
					issues={issues}
					vclist={vclist}
					closeby={closeby}
					dispatch={dispatch}
					issuedate={issuedate}
					cxpzState={cxpzState}
					vclistExist={vclistExist}
					inputValue={inputValue}
					vcindexSort={vcindexSort}
					vcdateSort={vcdateSort}
					changeInputValue={(value) => {
						this.setState({inputValue: value})
					}}
					clearSearchInput={() => {
						this.setState({inputValue: ''})
					}}

					changeSearchValue={(value) => {
						if (!isSearching) {
							this.setState({isSearching: true})
							// dispatch(cxpzActions.getVcListFetch(issuedate, '1', sortByTime, sortByIndex, sortByReviewed, {condition: value, conditionType: searchType}, () => {
								dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage:'1', pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{condition: value, conditionType: searchType}, callback:() => {
								this.setState({isSearching: false})
							}}))
						}
						// dispatch(cxpzActions.serchForVc(value))
					}}
					onChange={value => {
						dispatch(cxpzActions.getVcListFetch(value,{currentPage:'1',pageSize}))
						this.setState({inputValue: ''})
					}}
					clearInputValue={() => this.setState({inputValue: ''})}
					enCanUse={enCanUse}
					currentPage={currentPage}
					pageSize={pageSize}
					sortTime={sortByTime}
					sortIndex={sortByIndex}
					pageList={pageList}
					isSpread={isSpread}
					URL_POSTFIX={URL_POSTFIX}
					isPlay={isPlay}
					searchType={searchType}
					changeSearchStr={value => this.setState({searchType: value})}
					intelligentStatus={intelligentStatus}
					// refreshCxpzCallBack={() => dispatch(cxpzActions.getVcListFetch(issuedate, currentPage, sortByTime, sortByIndex, sortByReviewed, {condition: inputValue, conditionType: searchType}))}
					refreshCxpzCallBack={() => dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage, pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{ condition: inputValue, conditionType: searchType }}))}
				/>
				<Table
					AC_BALANCE_STATEMENT={AC_BALANCE_STATEMENT}
					PzPermissionInfo={PzPermissionInfo}
					vcindexSort={vcindexSort}
					vcdateSort={vcdateSort}
					vcreviewedSort={vcreviewedSort}
					dispatch={dispatch}
					selectVcAll={selectVcAll}
					vclist={vclist}
					issuedate={issuedate}
					inputValue={inputValue}
					sortByTimeOnClick={() => this.setState({sortBy: 'time'})}
					sortByIndexOnClick={() => this.setState({sortBy: 'index'})}
					sortByReviewedOnClick={() => this.setState({sortBy: 'reviewed'})}
					currentPage={currentPage}
					pageCount={pageCount}
					pageSize={pageSize}
					searchType={searchType}
					intelligentStatus={intelligentStatus}
					// paginationCallBack={(value) => dispatch(cxpzActions.getVcListFetch(issuedate, value, sortByTime, sortByIndex, sortByReviewed, {condition: inputValue, conditionType: searchType}))}
					paginationCallBack={(value, pageSize) => dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage:value, pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{ condition: inputValue, conditionType: searchType }}))}

					// refreshCxpzCallBack={() => dispatch(cxpzActions.getVcListFetch(issuedate, currentPage, sortByTime, sortByIndex, sortByReviewed, {condition: inputValue, conditionType: searchType}))}
					refreshCxpzCallBack={() => dispatch(cxpzActions.getVcListFetch(issuedate, {currentPage, pageSize, sortTime:sortByTime, sortIndex:sortByIndex, sortReviewed:sortByReviewed, condition:{ condition: inputValue, conditionType: searchType }}))}
				/>
			</ContainerWrap>
		)
	}
}

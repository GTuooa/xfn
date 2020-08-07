import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Button, Select, message, Tabs, Menu } from 'antd'
const Option = Select.Option
const TabPane = Tabs.TabPane
import * as Limit from 'app/constants/Limit.js'
import { TableWrap } from 'app/components'
import Title from './Title'
import CardTable from './CardTable'
import CardWrap from './CardWrap'
import './style/index.less'
import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'

@connect(state => state)
export default
class XmMxb extends React.Component {
	state={
		yllsVisible:false
	}
	componentWillMount() {

    }

	componentDidMount() {
		const isYEJump = sessionStorage.getItem('isXmYEJump')
		if(isYEJump !== 'TRUE') {
			this.props.dispatch(xmmxActions.getFirstProjectDetailList())
		}
		sessionStorage.removeItem('isXmYEJump')
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.accountConfState != nextprops.accountConfState || this.props.xmmxState != nextprops.xmmxState || this.props.homeState != nextprops.homeState || this.props.yllsState != nextprops.yllsState || this.state !== nextstate
	}

	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}

	render() {
		const {
			allState,
			accountConfState,
			dispatch,
			xmmxState,
			homeState,
			yllsState
		} = this.props
		const { yllsVisible } = this.state
		const hideCategoryList = xmmxState.get('hideCategoryList')
		const runningCategory = xmmxState.get('runningCategory')
		const issues = allState.get('issues')
		const currentPage = xmmxState.get('currentPage')
		const curCategory = xmmxState.getIn(['flags', 'curCategory'])
		const pageCount = xmmxState.get('pageCount')
		const issuedate = xmmxState.getIn(['flags', 'issuedate'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const endissuedate = xmmxState.getIn(['flags', 'endissuedate'])
		const paymentType = xmmxState.getIn(['flags', 'paymentType'])
		const accountName = xmmxState.getIn(['flags', 'accountName'])
		const categoryName = xmmxState.getIn(['flags', 'categoryName'])
		const transferAccountName = xmmxState.getIn(['flags', 'transferAccountName'])
		const accountType = xmmxState.getIn(['flags', 'accountType'])
		const curAccountUuid = xmmxState.getIn(['flags', 'curAccountUuid'])
		const defaultCategory = xmmxState.getIn(['flags', 'defaultCategory'])
		const propertyCost = xmmxState.getIn(['flags', 'propertyCost'])
		const categoryUuid = xmmxState.getIn(['flags', 'categoryUuid'])
		const curCardUuid = xmmxState.getIn(['flags', 'curCardUuid'])
		const amountType = xmmxState.getIn(['flags', 'amountType'])
		const pageNum = xmmxState.getIn(['flags', 'pageNum'])
		const typeUuid = xmmxState.getIn(['flags', 'typeUuid'])
		const amountTypeName = xmmxState.getIn(['flags', 'amountTypeName'])
		const isTop = xmmxState.getIn(['flags', 'isTop'])
		const detailsTemp = xmmxState.getIn(['flags','detailsTemp'])?xmmxState.getIn(['flags','detailsTemp']):[]
		const chooseperiods = xmmxState.getIn(['flags','chooseperiods'])
		const cardPages = xmmxState.getIn(['flags','cardPages'])

		const flags = xmmxState.get('flags')
		const accountList = accountConfState.get('accountList')

		const PageTab = xmmxState.getIn(['flags', 'PageTab'])
		const panes = homeState.get('panes')
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const lsItemData = yllsState.get('lsItemData')
		const searchContent = flags.get('searchContent')
		return (
			<div className='Page-lrAccount xmMxb'>
                <Title
					issues={issues}
					accountList={accountList}
					accountName={accountName}
					transferAccountName={transferAccountName}
					categoryName={categoryName}
					PageTab={PageTab}
					curCategory={curCategory}
					currentPage={currentPage}
					issuedate={issuedate}
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					paymentType={paymentType}
					curAccountUuid={curAccountUuid}
					dispatch={dispatch}
					pageList={pageList}
					isSpread = {isSpread}
					chooseperiods = {chooseperiods}
					propertyCost={propertyCost}
					amountType={amountType}
					typeUuid={typeUuid}
					curCardUuid={curCardUuid}
					isTop={isTop}
					categoryUuid={categoryUuid}
					amountTypeName={amountTypeName}
					pageNum={pageNum}
					cardPages={cardPages}
					searchContent={searchContent}
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
						uuidList={detailsTemp.filter((v,i) => i>0 ? v.get('uuid') !== detailsTemp.getIn([i-1,'uuid']) && v.get('runningAbstract')!=='期初余额' : v.get('runningAbstract')!=='期初余额')}
						showDrawer={() => this.setState({yllsVisible: true})}
						refreshList={() => dispatch(xmmxActions.getFirstProjectDetailList(issuedate, endissuedate,currentPage,amountType,typeUuid,curCardUuid,isTop,categoryUuid,propertyCost))}
						// inputValue={inputValue}
					/>
					: ''
				}
				<CardWrap
					flags={flags}
					defaultCategory={defaultCategory}
					accountType={accountType}
					paymentType={paymentType}
					issuedate={issuedate}
					curCategory={curCategory}
					accountConfState={accountConfState}
					runningCategory={runningCategory}
					dispatch={dispatch}
					detailsTemp={detailsTemp}
					panes={panes}
					currentPage={currentPage}
					curAccountUuid={curAccountUuid}
					pageCount={pageCount}
					curCategoryTree={`${curCategory}${Limit.TREE_JOIN_STR}${accountType}${Limit.TREE_JOIN_STR}${paymentType}${Limit.TREE_JOIN_STR}${propertyCost}`}
					PageTab={PageTab}
					endissuedate={endissuedate}
					xmmxState={xmmxState}
					editLrAccountPermission={editLrAccountPermission}
					curCardUuid={curCardUuid}
					amountType={amountType}
					typeUuid={typeUuid}
					isTop={isTop}
					categoryUuid={categoryUuid}
					amountTypeName={amountTypeName}
					pageNum={pageNum}
					cardPages={cardPages}
					propertyCost={propertyCost}
					showDrawer={() => this.setState({yllsVisible: true})}
					searchContent={searchContent}
				/>
			</div>
		)
	}
}

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
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'

@connect(state => state)
export default
class ZhMxb extends React.Component {
	state={
		yllsVisible: false
	}
	componentWillMount() {

    }

	componentDidMount() {
		const isYEJump = sessionStorage.getItem('isAccountYEJump')
		if(isYEJump !== 'TRUE') {
			this.props.dispatch(zhmxActions.getPeriodDetailList())
		}
		sessionStorage.removeItem('isAccountYEJump')
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.accountConfState != nextprops.accountConfState || this.props.zhmxState != nextprops.zhmxState || this.props.homeState != nextprops.homeState || this.props.yllsState != nextprops.yllsState || this.state != nextstate
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
			zhmxState,
			homeState,
			yllsState
		} = this.props
		const { yllsVisible } = this.state
		const hideCategoryList = zhmxState.get('hideCategoryList')
		const runningCategory = zhmxState.get('runningCategory')
		const issues = zhmxState.get('issues')
		const currentPage = zhmxState.get('currentPage')
		const curCategory = zhmxState.getIn(['flags', 'curCategory'])
		const pageCount = zhmxState.get('pageCount')
		const issuedate = zhmxState.getIn(['flags', 'issuedate'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const endissuedate = zhmxState.getIn(['flags', 'endissuedate'])
		const paymentType = zhmxState.getIn(['flags', 'paymentType'])
		const accountName = zhmxState.getIn(['flags', 'accountName'])
		const categoryName = zhmxState.getIn(['flags', 'categoryName'])
		const transferAccountName = zhmxState.getIn(['flags', 'transferAccountName'])
		const accountType = zhmxState.getIn(['flags', 'accountType'])
		const curAccountUuid = zhmxState.getIn(['flags', 'curAccountUuid'])
		const defaultCategory = zhmxState.getIn(['flags', 'defaultCategory'])
		const propertyCost = zhmxState.getIn(['flags', 'propertyCost'])
		const searchContent = zhmxState.getIn(['flags', 'searchContent'])
		const detailsTemp = zhmxState.get('detailsTemp')
		const chooseperiods = zhmxState.get('chooseperiods')

		const flags = zhmxState.get('flags')
		const accountList = accountConfState.get('accountList')

		const PageTab = zhmxState.getIn(['flags', 'PageTab'])
		const panes = homeState.get('panes')
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const lsItemData = yllsState.get('lsItemData')
		const curUuid = curAccountUuid === '全部' ? '' : curAccountUuid
		return (
			<div className='Page-lrAccount zhMxb'>
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
						refreshList={() => dispatch(zhmxActions.getDetailList(curCategory,issuedate,currentPage,curUuid,endissuedate,propertyCost))}
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
					zhmxState={zhmxState}
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
					editLrAccountPermission={editLrAccountPermission}
					propertyCost={propertyCost}
					showDrawer={() => this.setState({yllsVisible: true})}
					searchContent={searchContent}
				/>
			</div>
		)
	}
}

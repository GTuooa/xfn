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
import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'

@connect(state => state)
export default
class WlMxb extends React.Component {
	state={
		yllsVisible:false
	}
	componentWillMount() {

    }

	componentDidMount() {
		const isYEJump = sessionStorage.getItem('isContactsYEJump')
		if(isYEJump !== 'TRUE') {
			this.props.dispatch(wlmxActions.getPeriodDetailList())
		}
		sessionStorage.removeItem('isContactsYEJump')
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.accountConfState != nextprops.accountConfState || this.props.wlmxState != nextprops.wlmxState || this.props.homeState != nextprops.homeState || this.props.yllsState != nextprops.yllsState || this.state != nextstate
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
			wlmxState,
			homeState,
			yllsState
		} = this.props
		const { yllsVisible } = this.state
		const runningCategory = wlmxState.get('runningCategory')
		const issues = wlmxState.get('issues')
		const currentPage = wlmxState.get('currentPage')
		const pageCount = wlmxState.get('pageCount')
		const cardPages = wlmxState.get('cardPages')
		const cardCurPage = wlmxState.get('cardCurPage')
		const issuedate = wlmxState.getIn(['flags', 'issuedate'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const endissuedate = wlmxState.getIn(['flags', 'endissuedate'])
		const propertyCost = wlmxState.getIn(['flags', 'propertyCost'])
		const detailsTemp = wlmxState.get('detailsTemp')?wlmxState.get('detailsTemp'):[]
		const chooseperiods = wlmxState.get('chooseperiods')
		const cardList = wlmxState.get('cardList')
		const curCardUuid = wlmxState.getIn(['flags', 'curCardUuid'])
		const categoryUuid = wlmxState.getIn(['flags', 'categoryUuid'])
		const categoryName = wlmxState.getIn(['flags', 'categoryName'])
		const wlRelate = wlmxState.getIn(['flags', 'wlRelate'])

		const flags = wlmxState.get('flags')
		const isTop = flags.get('isTop')
		const typeUuid = flags.get('typeUuid')
		const searchContent = flags.get('searchContent')
		const accountList = accountConfState.get('accountList')

		const PageTab = wlmxState.getIn(['flags', 'PageTab'])
		const panes = homeState.get('panes')
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
		const lsItemData = yllsState.get('lsItemData')
		return (
			<div className='Page-lrAccount wlMxb'>
                <Title
					issues={issues}
					currentPage={currentPage}
					issuedate={issuedate}
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					dispatch={dispatch}
					pageList={pageList}
					isSpread = {isSpread}
					chooseperiods = {chooseperiods}
					propertyCost={propertyCost}
					curCardUuid={curCardUuid}
					categoryUuid={categoryUuid}
					isTop={isTop}
					typeUuid={typeUuid}
					currentPage={currentPage}
					cardCurPage={cardCurPage}
					wlRelate={wlRelate}
					searchContent={searchContent}
				/>
				<CardWrap
					flags={flags}
					issuedate={issuedate}
					wlmxState={wlmxState}
					runningCategory={runningCategory}
					dispatch={dispatch}
					detailsTemp={detailsTemp}
					panes={panes}
					currentPage={currentPage}
					pageCount={pageCount}
					curCategoryTree={`${categoryUuid}${Limit.TREE_JOIN_STR}${categoryName}${Limit.TREE_JOIN_STR}${propertyCost}`}
					endissuedate={endissuedate}

					cardList={cardList}
					curCardUuid={curCardUuid}
					editLrAccountPermission={editLrAccountPermission}
					categoryUuid={categoryUuid}
					propertyCost={propertyCost}
					categoryName={categoryName}
					showDrawer={() => this.setState({yllsVisible: true})}
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
						refreshList={() => dispatch(wlmxActions.reflashDetailList(issuedate,endissuedate,isTop,typeUuid,curCardUuid,categoryUuid,propertyCost,currentPage,cardCurPage ))}
						// inputValue={inputValue}
					/>
					: ''
				}
			</div>
		)
	}
}

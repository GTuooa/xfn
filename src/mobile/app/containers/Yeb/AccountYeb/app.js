import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Container, Row, ScrollView } from 'app/components'
import { MutiPeriodMoreSelect } from 'app/containers/components'

import Item from './Item'

import * as accountYebActions from 'app/redux/Yeb/AccountYeb/AccountYeb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class AccountYeb extends React.Component {

	static displayName = 'AccountYeb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	componentDidMount() {
		thirdParty.setTitle({title: '账户余额表'})
		thirdParty.setIcon({showIcon: false})
		const reportExcelPermission = this.props.homeState.getIn(['permissionInfo', 'Report', 'exportExcel', 'permission'])
		if(!reportExcelPermission){
			thirdParty.setRight({show: false})
		}
		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(accountYebActions.initState())
			this.props.dispatch(accountYebActions.getPeriodAndBalanceList('','',"true"))
		}
	}

	render() {

		const { allState, dispatch, accountYebState, history } = this.props
		const { showModal } = this.state

		const balanceTemp = accountYebState.get('balanceTemp')
		const issuedate = accountYebState.get('issuedate')
		const endissuedate = accountYebState.get('endissuedate')
		const chooseValue = accountYebState.getIn(['views','chooseValue'])

		const issues = accountYebState.get('issues')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		// export
		const begin = issuedate
		const end = endissuedate ? endissuedate : begin

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('sendAccountExcelbalance', {begin: begin, end: end}))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="account-yeb">
				<MutiPeriodMoreSelect
					start={issuedate}
					issues={issues} //默认显示日期
					end={endissuedate}
					nextperiods={nextperiods}
					chooseValue={chooseValue}
					onBeginOk={(value) => {//跨期选择完开始时间后
						dispatch(accountYebActions.getPeriodAndBalanceList(value, ''))
					}}
					onEndOk={(value1,value2) => {//跨期选择完结束时间后
						dispatch(accountYebActions.getPeriodAndBalanceList(value1,value2))
					}}
					changeChooseValue={(value)=>dispatch(accountYebActions.changeAccountYebChooseValue(value))}
				/>
				<Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期收款</div>
					<div className='ba-title-item'>本期付款</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="accountyeb-scroll" savePosition>
					<div className='ba-list'>
						{
							balanceTemp.map((item,i) => {
								return <div key={i}>
									<Item
										className="balance-running-tabel-width"
										item={item}
										history={history}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										chooseValue={chooseValue}
									/>
								</div>
							})
						}
					</div>
				</ScrollView>
			</Container>
		)
	}
}

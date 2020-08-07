import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import Title from './Title'
import CardTable from './CardTable'
import { TableWrap } from 'app/components'
import { Button, Select, message } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import * as zhyeActions from 'app/redux/Yeb/ZhYeb/zhYeb.action'

import './style/index.less'

@connect(state => state)
export default
class Zhye extends React.Component {


	componentDidMount() {
		this.props.dispatch(zhyeActions.getPeriodAndBalanceList())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.cxlsState != nextprops.cxlsState || this.props.zhyeState != nextprops.zhyeState || this.props.homeState != nextprops.homeState
	}

    render() {

        const { allState, dispatch, cxlsState, zhyeState, homeState } = this.props

		const issues = zhyeState.get('issues')
		const balanceTemp = zhyeState.get('balanceTemp')


		const issuedate = zhyeState.getIn(['flags', 'issuedate'])
		const endissuedate = zhyeState.getIn(['flags', 'endissuedate'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const chooseperiods = zhyeState.get('chooseperiods')

		const allBeginAmount = zhyeState.getIn(['flags', 'allBeginAmount'])
		const allIncomeAmount = zhyeState.getIn(['flags', 'allIncomeAmount'])
		const allExpenseAmount = zhyeState.getIn(['flags', 'allExpenseAmount'])
		const allBalanceAmount = zhyeState.getIn(['flags', 'allBalanceAmount'])

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<div className="zhyeb table-title-content">
				<Title
					issues={issues}
					issuedate={issuedate}
					endissuedate={endissuedate}
					dispatch={dispatch}
					isSpread = {isSpread}
					pageList = {pageList}
					chooseperiods = {chooseperiods}
					nextperiods={nextperiods}
				/>
				<TableWrap className="table-normal-with-new">
					<CardTable
						issuedate={issuedate}
						zhyeState={zhyeState}
						dispatch={dispatch}
						balanceTemp={balanceTemp}
						endissuedate={endissuedate}
						allBeginAmount={allBeginAmount}
						allIncomeAmount={allIncomeAmount}
						allExpenseAmount={allExpenseAmount}
						allBalanceAmount={allBalanceAmount}
					/>
				</TableWrap>
			</div>
		)
	}
}

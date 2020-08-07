import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import Title from './Title'
import CardTable from './CardTable'
import { TableWrap } from 'app/components'
import { Button, Select, message } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import * as wlyeActions from 'app/redux/Yeb/WlYeb/wlYeb.action'

import './style/index.less'

@connect(state => state)
export default
class Wlye extends React.Component {


	componentDidMount() {
		this.props.dispatch(wlyeActions.getPeriodAndBalanceList())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.wlyeState !== nextprops.wlyeState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState
	}

    render() {

        const { allState, dispatch, wlyeState, homeState } = this.props

		const issues = wlyeState.get('issues')
		const balanceTemp = wlyeState.get('balanceTemp')


		const issuedate = wlyeState.getIn(['flags', 'issuedate'])
		const endissuedate = wlyeState.getIn(['flags', 'endissuedate'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const chooseperiods = wlyeState.get('chooseperiods')

		const allBeginIncomeAmount = wlyeState.getIn(['flags', 'allBeginIncomeAmount'])
		const allBeginExpenseAmount = wlyeState.getIn(['flags', 'allBeginExpenseAmount'])
		const allHappenIncomeAmount = wlyeState.getIn(['flags', 'allHappenIncomeAmount'])
		const allHappenExpenseAmount = wlyeState.getIn(['flags', 'allHappenExpenseAmount'])
		const allPaymentIncomeAmount = wlyeState.getIn(['flags', 'allPaymentIncomeAmount'])
		const allPaymentExpenseAmount = wlyeState.getIn(['flags', 'allPaymentExpenseAmount'])
		const allBalanceIncomeAmount = wlyeState.getIn(['flags', 'allBalanceIncomeAmount'])
		const allBalanceExpenseAmount = wlyeState.getIn(['flags', 'allBalanceExpenseAmount'])


		const wlRelate = wlyeState.getIn(['flags', 'wlRelate']) //往来关系： ‘’：全部， 1：付款，2：收款，3：收款兼付款
		const wlOnlyRelate = wlyeState.getIn(['flags', 'wlOnlyRelate'])
		const wlType = wlyeState.getIn(['flags', 'wlType'])
		const typeUuid = wlyeState.getIn(['flags', 'typeUuid'])
		const wlRelationship = wlyeState.getIn(['flags', 'wlRelationship'])
		const isTop = wlyeState.getIn(['flags', 'isTop'])
		const contactTypeTree = wlyeState.get('contactTypeTree')

		const pageCount = wlyeState.get('pageCount')
		const currentPage = wlyeState.get('currentPage')
		const runningCount = wlyeState.get('runningCount')

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<div className="wlyeb table-title-content">
				<Title
					issues={issues}
					issuedate={issuedate}
					endissuedate={endissuedate}
					dispatch={dispatch}
					isSpread = {isSpread}
					pageList = {pageList}
					chooseperiods = {chooseperiods}
					nextperiods={nextperiods}
					wlRelate={wlRelate}
					wlType={wlType}
					typeUuid={typeUuid}
					isTop={isTop}
					wlRelationship={wlRelationship}
					contactTypeTree={contactTypeTree}
					currentPage={currentPage}
					wlOnlyRelate={wlOnlyRelate}
				/>
				<TableWrap className="table-normal-with-new">
					<CardTable
						issuedate={issuedate}
						wlyeState={wlyeState}
						dispatch={dispatch}
						balanceTemp={balanceTemp}
						endissuedate={endissuedate}
						allBeginIncomeAmount={allBeginIncomeAmount}
						allBeginExpenseAmount={allBeginExpenseAmount}
						allHappenIncomeAmount={allHappenIncomeAmount}
						allHappenExpenseAmount={allHappenExpenseAmount}
						allPaymentIncomeAmount={allPaymentIncomeAmount}
						allPaymentExpenseAmount={allPaymentExpenseAmount}
						allBalanceIncomeAmount={allBalanceIncomeAmount}
						allBalanceExpenseAmount={allBalanceExpenseAmount}
						wlRelate={wlRelate}
						wlOnlyRelate={wlOnlyRelate}
						wlType={wlType}
						pageCount={pageCount}
						runningCount={runningCount}
						currentPage={currentPage}
						typeUuid={typeUuid}
						isTop={isTop}
					/>
				</TableWrap>
			</div>
		)
	}
}

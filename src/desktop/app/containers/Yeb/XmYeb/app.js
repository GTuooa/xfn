import React from 'react'
import { connect } from 'react-redux'
import { toJS, fromJS } from 'immutable'

import Title from './Title'
import CardTable from './CardTable'
import { TableWrap } from 'app/components'
import { Button, Select, message } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import * as xmyeActions from 'app/redux/Yeb/XmYeb/xmYeb.action'

import './style/index.less'

@connect(state => state)
export default
class Xmye extends React.Component {


	componentDidMount() {
		this.props.dispatch(xmyeActions.getFirstProjectList())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.xmyeState !== nextprops.xmyeState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState
	}

    render() {

        const { allState, dispatch, xmyeState, homeState } = this.props

		const issues = allState.get('issues')
		const balanceTemp = xmyeState.get('balanceTemp')


		const issuedate = xmyeState.getIn(['flags', 'issuedate'])
		const endissuedate = xmyeState.getIn(['flags', 'endissuedate'])
		const chooseperiods = xmyeState.getIn(['flags', 'chooseperiods'])
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)
		const incomeAmount = xmyeState.getIn(['flags','incomeAmount'])
		const expenseAmount = xmyeState.getIn(['flags','expenseAmount'])
		const balanceAmount = xmyeState.getIn(['flags','balanceAmount'])
		const realIncomeAmount = xmyeState.getIn(['flags','realIncomeAmount'])
		const realExpenseAmount = xmyeState.getIn(['flags','realExpenseAmount'])
		const realBalanceAmount = xmyeState.getIn(['flags','realBalanceAmount'])
		const runningCategoryUuid = xmyeState.getIn(['flags','runningCategoryUuid'])
		const categoryUuid = xmyeState.getIn(['flags','categoryUuid'])
		const categoryList = xmyeState.getIn(['flags','categoryList'])
		const projectCategoryList = xmyeState.getIn(['flags','projectCategoryList'])
		const xmType = xmyeState.getIn(['flags','xmType'])
		const runningType = xmyeState.getIn(['flags','runningType'])
		const propertyCost = xmyeState.getIn(['flags','propertyCost'])
		const isTop = xmyeState.getIn(['flags','isTop'])
		const currentPage = xmyeState.get('currentPage')
		const pageCount = xmyeState.get('pageCount')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])

		return (
			<div className="xmyeb table-title-content">
				<Title
					issuedate={issuedate}
					endissuedate={endissuedate}
					dispatch={dispatch}
					isSpread = {isSpread}
					pageList = {pageList}
					issues={issues}
					chooseperiods = {chooseperiods}
					nextperiods={nextperiods}
					categoryList={categoryList}
					projectCategoryList={projectCategoryList}
					xmType={xmType}
					runningType={runningType}
					runningCategoryUuid={runningCategoryUuid}
					categoryUuid={categoryUuid}
					isTop={isTop}
					currentPage={currentPage}
					propertyCost={propertyCost}
				/>
				<TableWrap className="table-normal-with-new">
					<CardTable
						issuedate={issuedate}
						xmyeState={xmyeState}
						dispatch={dispatch}
						balanceTemp={balanceTemp}
						endissuedate={endissuedate}
						incomeAmount={incomeAmount}
						expenseAmount={expenseAmount}
						balanceAmount={balanceAmount}
						realIncomeAmount={realIncomeAmount}
						realExpenseAmount={realExpenseAmount}
						realBalanceAmount={realBalanceAmount}
						pageCount={pageCount}
						currentPage={currentPage}
						// typeUuid={typeUuid}
					/>
				</TableWrap>
			</div>
		)
	}
}

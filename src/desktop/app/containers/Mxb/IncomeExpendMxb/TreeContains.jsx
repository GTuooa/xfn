import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
import { Select, Icon, Menu, Input }  from 'antd'
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'


import * as incomeExpendMxbActions from 'app/redux/Mxb/IncomeExpendMxb/incomeExpendMxb.action.js'

@immutableRenderDecorator
export default
class TreeContains extends React.Component {

	render() {
		const {
			issuedate,
			endissuedate,
			dispatch,
			runningCategory,
			curCategory,
		} = this.props
		const selectedKeys = curCategory
		return (
			<TableTree>
				<div className="table-right-tree" >
					<Trees
						category={runningCategory}
						selectedKeys={[selectedKeys]}
						dispatch={dispatch}
						onSelect={value => {
							if(value[0]){
								const valueList = value[0].split(Limit.TREE_JOIN_STR)
								dispatch(incomeExpendMxbActions.getIncomeExpendMxbBalanceListPages(issuedate, endissuedate,valueList[0],'',1))
								dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryUuid',valueList[0]))
								dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','oriName',valueList[1]))
								dispatch(incomeExpendMxbActions.changeIncomeExpendMxbCommonState('views','categoryName',valueList[2]))
							}
						}}
					/>
				</div>
			</TableTree>
		)
	}
}

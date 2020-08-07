import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
import { Select, Icon, Menu, Input }  from 'antd'
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

// import * as lrAccountActions from 'app/actions/lrAccount.action'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'

@immutableRenderDecorator
export default
class TreeContains extends React.Component {

	render() {
		const {
			dispatch,
			runningCategory,
			curCategory,
			curAccountUuid,
			issuedate,
			main,
			currentPage,
			pageCount,
			// taxRateTemp,
			flags,
			hideCategoryList,
			disabledChangeCategory,
			// cardTemp,
			PageTab,
			defaultCategory,
			accountType,
			paymentType,
			endissuedate,
			searchContent
		} = this.props

		const selectedKeys = curCategory
		return (
			<TableTree>
				{/* <Select
					showSearch
					searchPlaceholder="搜索科目"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					disabled
					showArrow={false}
					>
					<Option key='1' value='1'>11</Option>
				</Select>
				<Icon type="search" className="table-right-table-input-search"/> */}
				<div className="table-right-tree" style={{display: issuedate ? 'block' : 'none'}}>
					<Trees
						flags={flags}
						hideCategoryList={hideCategoryList}
						category={runningCategory}
						selectedKeys={[selectedKeys]}
						dispatch={dispatch}
						onSelect={value => {
							if(value[0]){
								const valueList = value[0].split(Limit.TREE_JOIN_STR)
								dispatch(zhmxActions.getDetailList(valueList[0], issuedate, 1,curAccountUuid,endissuedate,valueList[3],searchContent))
								dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'accountType'],valueList[1]))
								dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'paymentType'],valueList[2]))
								dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'propertyCost'],valueList[3]))
								dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'defaultCategory'],''))
							}
						}}
					/>
				</div>
			</TableTree>
		)
	}
}

import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
import { Select, Input }  from 'antd'
import { TableTree, Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

// import * as accountActions from 'app/actions/account.action'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {
	render() {
		const {
			dispatch,
			runningCategory,
			curCategory,
			curAccountUuid,
			issuedate,
			main,
			assId,
			assCategory,
			acId,
			accountingType,
			isCheck,
			flags,
			inputValue,
			billMakeOutType,
			billAuthType,
			runningState
		} = this.props

		let categoryList = []
		const loop = data => data.forEach((item, i) => {

			if (item.get('childList') && item.get('childList').size) {
				categoryList.push({
					value: item.get('name'),
					key: item.get('uuid')
				})
				loop(item.get('childList'))
			} else {
				categoryList.push({
					value: item.get('name'),
					key: item.get('uuid')
				})
			}
		})
		if(runningCategory.getIn([0, 'childList'])){
		loop(runningCategory.getIn([0, 'childList']))
		}
		return (
			<TableTree>
				{/* <Select
					combobox
					searchPlaceholder="搜索类别"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					onSelect={value => dispatch(accountActions.getAccountDimensionFetch(issuedate, main, value, curAccountUuid, acId, assCategory, assId))}
					>
					{categoryList.map((v, i) => <Option key={i} value={`${v.key}`}>{`${v.value}`}</Option>)}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/> */}
				<div className="table-right-tree">
					<div>
						<span className="lsmx-serch">
							<Icon className="lsmx-serch-icon" type="search"/>
							<Input
								disabled
								className="lsmx-serch-input"
								value=''
							/>
						</span>
					</div>
					<Trees
						flags={flags}
						// hideCategoryList={hideCategoryList}
						category={runningCategory}
						selectedKeys={[curCategory]}
						dispatch={dispatch}
						onSelect={value => {
							 if(value[0]){
			            const valueList = value[0].split(Limit.TREE_JOIN_STR)
						switch(accountingType){
			              case 'manages':
			                dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',valueList[0],assId, assCategory, isCheck,acId,inputValue,true))
								break
			              case 'invoicing':
			                dispatch(calculationActions.getCalculateInvoicingList(issuedate,valueList[0],billMakeOutType, inputValue,true))
			                	break
						  case 'certification':
					            dispatch(calculationActions.getCalculateCertificationList(issuedate,valueList[0],billAuthType, inputValue,true))
					            break
				          case 'costTransfer':
					            dispatch(calculationActions.getCalculateCarryoverList(issuedate,runningState, inputValue,true))
					            break
			              default:

			            }

							 }

						}}
					/>
				</div>
			</TableTree>
		)
	}
}

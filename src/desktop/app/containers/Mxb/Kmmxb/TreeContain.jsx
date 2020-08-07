import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'

import Trees from './Trees.jsx'
import { Select, Icon }  from 'antd'
import * as Limit from 'app/constants/Limit.js'

import { TableTree } from 'app/components'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	render() {

		const { dispatch, aclist, issuedate, cascadeAclist, currentAcId, currentAssId, currentAssCategory, endissuedate, chooseperiods, inputValue, clearInput } = this.props

		const selectTreeItem = currentAssId ? `${currentAcId}${Limit.TREE_JOIN_STR}${currentAssId}${Limit.TREE_JOIN_STR}${currentAssCategory}` : currentAcId

		let searchList = []
		const loop = data => data.map(v => {
			searchList.push({
				acId: v.get('acId'),
				acName: v.get('acName'),
			})
			if (v.get('childList') && v.get('childList').size) {
				loop(v.get('childList'))
			}
		})
		loop(aclist)

		return (
			<TableTree>
				<Select
					showSearch
					searchPlaceholder="搜索科目"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					onSelect={value => {
						clearInput()
						dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
							issuedate: issuedate,
							endissuedate: endissuedate,
							acId: value,
							assId: '',
							assCategory: '',
							condition: '',
							currentPage: '1',
						}))
					}}
					showArrow={false}
					>
					{searchList.map((v, i) => <Option key={i} value={`${v.acId}`}>{`${v.acId} ${v.acName}`}</Option>)}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				<div className="table-right-tree">
					<Trees
						data={aclist}
						cascadeAclist={cascadeAclist}
						dataKey={'acid'}
						dataValue={'acname'}
						currentAcid={selectTreeItem}
						onSelect={(info) => {
							if (info.length === 0 || info[0].indexOf('disable') === 0) {
								return
							}
							clearInput()

							const valueList = info[0].split(Limit.TREE_JOIN_STR)

							dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
								issuedate: issuedate,
								endissuedate: endissuedate,
								acId: valueList[0],
								assId: valueList[1] ? valueList[1] : '',
								assCategory: valueList[2] ? valueList[2] : '',
								condition: '',
								currentPage: '1',
							}))

							// let selected ={}
							// let loop = data=>data.map(item=>{
							// 	if(item.key===info[0]){
							// 		selected=item
							// 	}
							// 	if(item.children){
							// 		loop(item.children)
							// 	}
							// })
							// loop(cascadeAclist)
							// let doubleAss = false
							// for(let i in selected.children){
							// 	if(selected.children[i].key.split('')[0]==='5'){
							// 		doubleAss =true
							// 	}
							// }
							// if(selected.children && selected.children.length>1 && doubleAss && info[0].split('')[0]==='5'){
							// 	dispatch(kmmxbActions.showMutilColumnAccount(true))
							// }else{
							// 	dispatch(kmmxbActions.showMutilColumnAccount(false))
							// }
						}}
					/>
				</div>
			</TableTree>
		)
	}
}

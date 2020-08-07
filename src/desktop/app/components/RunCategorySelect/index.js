import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { Select } from 'antd'
const Option = Select.Option
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class RunCategorySelect extends React.Component{
	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled, insertOrModify, canBeModifyCategory } = this.props
		let list = []
        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {
                {loop(item.childList, upperIndex + '_' + i)}
            } else if (item.level != 1 || item.beSpecial) {
				list.push(
					<Option
					// disabled={!item.acAvailable}
					disabled={(!item.acAvailable && !item.beSpecial && insertOrModify === 'insert') || insertOrModify === 'modify' && !(['LB_YYSR','LB_YYZC','LB_YYWSR','LB_YYWZC','LB_ZSKX','LB_ZFKX','LB_FYZC'].includes(item.categoryType) && canBeModifyCategory)}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${upperIndex + '_' + i}`}
					key={item.uuid}
					>
						{item.name}
					</Option>
				)
			}
			// return <TreeNode
			// 	title={item.name}
			// 	value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${upperIndex + '_' + i}`}
			// 	key={item.uuid}
			// 	disabled={parentDisabled}
			// 	>
			// 	{loop(item.childList, upperIndex + '_' + i)}
			// </TreeNode>
			// }
			//
			// return item.level != 1 || item.beSpecial ? <TreeNode
			// title={item.name}
			// // disabled={!item.acAvailable}
			// disabled={(!item.acAvailable && (name!='内部转账' && upperIndex!=0)) || item.name =='长期资产' || item.level === 1 && !item.beSpecial }
			// value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${upperIndex + '_' + i}`}
			// key={item.uuid}
			// />:''


        })
		loop(treeData.getIn([0, 'childList']).toJS(), 0 )
		return (
			<Select
				combobox
				showSearch
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={[value]}
                onChange={onChange}
                >
					{/* {loop( treeData.getIn([0, 'childList']).toJS(), 0 )} */}
					{list}
            </Select>
		)
	}
}

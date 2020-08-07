import React from 'react'
import * as Limit from 'app/constants/Limit'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default class SelectType extends React.Component{

	static displayName = 'RunningConfSelectType'

	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled } = this.props

        const loop = (data, upperIndex) => data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.hasBalance}${Limit.TREE_JOIN_STR}${item.hasBusiness}`}
					key={`${item.uuid}${i}`}
					disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }
            return <TreeNode
				title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.hasBalance}${Limit.TREE_JOIN_STR}${item.hasBusiness}`}
                key={`${item.uuid}${i}`}
            />
        })

		return (
			<TreeSelect
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={[value]}
                onChange={onChange}
				onClick={(e) => {
					e.stopPropagation()
				}}
            >
                {loop( treeData.toJS(), 0 )}
            </TreeSelect>
		)
	}
}

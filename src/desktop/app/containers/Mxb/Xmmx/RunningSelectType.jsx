import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class RunningSelectType extends React.Component{
	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled } = this.props

        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
					key={item.uuid}
					disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                key={item.uuid}
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
                {treeData ? loop( treeData.toJS(), 0 ) : ''}
            </TreeSelect>
		)
	}
}

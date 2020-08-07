import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class CategorySelect extends React.Component{

	render() {

        const { categoryList, onChange, currentProjectItem, className } = this.props

        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.top}`}
					key={item.uuid}
					// disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.top}`}
                key={item.uuid}
            />
        })

		return (
            <TreeSelect
                className={className}
				value={currentProjectItem.get('name')}
				// disabled={disabled}
                // placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={onChange}
            >
                {loop( categoryList.toJS(), 0 )}
            </TreeSelect>
		)
	}
}

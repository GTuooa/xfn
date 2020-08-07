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

        const { categoryList, onChange, currentRelativeItem, className,nameString, uuidString } = this.props

        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item[nameString]}
					value={`${item[uuidString]}${Limit.TREE_JOIN_STR}${item.top}${Limit.TREE_JOIN_STR}${item.direction}`}
					key={item[uuidString]}
					// disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item[nameString]}
                value={`${item[uuidString]}${Limit.TREE_JOIN_STR}${item.top}${Limit.TREE_JOIN_STR}${item.direction}`}
                key={item[uuidString]}
            />
        })

		return (
            <TreeSelect
                className={className}
				value={currentRelativeItem.get('value')}
				// disabled={disabled}
                // placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={onChange}
            >
				<TreeNode
					title={'全部'}
					value={'全部'}
					key={'全部'}
				/>
                {loop( categoryList.toJS(), 0 )}
            </TreeSelect>
		)
	}
}

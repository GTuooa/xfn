import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class RunningSelect extends React.Component{

	render() {

        const { runningCategoryList, onChange, currentRunningItem, className,uuidString,nameString } = this.props
        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item[nameString]}
					value={`${item[uuidString]}${Limit.TREE_JOIN_STR}${item[nameString]}${Limit.TREE_JOIN_STR}${item.direction}${Limit.TREE_JOIN_STR}${item.mergeName}`}
					key={item[uuidString]}
					// disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item[nameString]}
                value={`${item[uuidString]}${Limit.TREE_JOIN_STR}${item[nameString]}${Limit.TREE_JOIN_STR}${item.direction}${Limit.TREE_JOIN_STR}${item.mergeName}`}
                key={item[uuidString]}
            />
        })

		return (
            <TreeSelect
                className={className}
				value={currentRunningItem.get(`${nameString}`)}
				// disabled={disabled}
                // placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={onChange}
            >
				<TreeNode
					title={'全部'}
					value={`${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}double_credit${Limit.TREE_JOIN_STR}全部`}
					key={''}
				/>
                {loop( runningCategoryList && runningCategoryList.toJS() || [], 0 )}
            </TreeSelect>
		)
	}
}

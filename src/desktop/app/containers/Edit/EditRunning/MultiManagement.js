import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
const { SHOW_PARENT } = TreeSelect;
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class MultiManagement extends React.Component{
	// 类别新增专用

	render() {
		const { className, treeData, value, placeholder, onChange, parentsDisable, disabled, showSearch,allowClear,multiple, treeCheckable } = this.props
		const loop = (data, leve) =>data &&  data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return <TreeNode
					disabled={parentsDisable}
					title={item.code ? `${item.code} ${item.name}` : item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.code}`}
					key={item.uuid}
					>
                    {loop(item.childList, leve+1)}
                </TreeNode>
            }

            return <TreeNode
                title={item.code ? `${item.code} ${item.name}` : item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.code}`}
                key={item.uuid}
            />
        })
		return (
			<TreeSelect
				showSearch={showSearch ? true : false}
				className={className}
                placeholder={placeholder}
				disabled={disabled}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={value}
				treeCheckable={true}
				showCheckedStrategy={SHOW_PARENT}
				treeCheckStrictly={true}
                onChange={onChange}
            >
				{loop(treeData.toJS(), 1 )}
            </TreeSelect>
		)
	}
}

import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
import * as Limit from 'app/constants/Limit.js'
// import { upperClassToTree } from 'app/utils'
import { toJS } from 'immutable'
@immutableRenderDecorator

class UpperClassSelect extends  React.Component{
	render() {
		const { type, className, placeholder, value, disabled, onSelect, treeData, disabledParent, disabledEnd, treeDefaultExpandAll, isLastSelect} = this.props

		// const formatTreeData = upperClassToTree(treeData)

		const loop = (data, leve) => data.map(v => {
			let newLeve = leve + 1

			if (v.get('childList').size) {
				return (
					<TreeNode
						key={v.get('uuid')}
						title={v.get('name')}
						value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
						disabled={disabledParent}
						item={v}
					>
						{loop(v.get('childList'), newLeve)}
					</TreeNode>
				)
			} else {
				return (<TreeNode
							// 四级不允许新增下级
							disabled={disabledEnd && leve > 4}
							key={v.get('uuid')}
							value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
							title={v.get('name')}
							item={v}
						/>)
			}

		})

		return (
            <TreeSelect
                className={className}
                value={value}
				disabled={disabled}
				treeDefaultExpandAll={treeDefaultExpandAll}
                dropdownStyle={{overflow: 'auto' }}
                placeholder={placeholder}
                onSelect={(info,options) => {
					onSelect(info,options)
                }}
            >
				{loop(treeData, 1)}
			</TreeSelect>
		)
	}
}

export default UpperClassSelect;
import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class RunUpperSelect extends React.Component{
	// 类别新增专用

	render() {
		const { className, treeData, value, placeholder, onChange, disabled, someDisabled, categoryType } = this.props

        const loop = (data, leve) => data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return <TreeNode
					title={item.name}
					disabled={item.name === '其他流水'||item.name === '内部转账'||leve>3 || (someDisabled && item.name === '长期资产') || (someDisabled && categoryType && item.categoryType !== categoryType)}


					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.property}${Limit.TREE_JOIN_STR}${item.categoryType}`}
					key={item.uuid}
					>
                    {loop(item.childList, leve+1)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
				// disabled={leve !== 2}
				disabled={item.name === '其他流水'||item.name === '内部转账'||leve>3 || (someDisabled && item.name === '长期资产' )|| (someDisabled && categoryType && item.categoryType !== categoryType)}

                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.property}${Limit.TREE_JOIN_STR}${item.categoryType}`}
                key={item.uuid}
            />
        })

		return (
			<TreeSelect
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={value}
                onChange={onChange}
                >
                {loop(treeData.getIn([0, 'childList']).toJS(), 1)}
            </TreeSelect>
		)
	}
}

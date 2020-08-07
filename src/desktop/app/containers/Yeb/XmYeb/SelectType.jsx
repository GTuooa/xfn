import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class SelectType extends React.Component{
	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled, needAll, treeDefaultExpandAll } = this.props
        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.top}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
					key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
					disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.top}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
            />
        })

		return (
			<TreeSelect
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll={treeDefaultExpandAll}
                value={[value]}
                onChange={onChange}
                >
					{
						needAll?
						<TreeNode
							title={'全部'}
							value={`${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}`}
							key={''}
						/>:[]
					}

                {treeData.length?loop( treeData[0].childList, 0 ):[]}
            </TreeSelect>
		)
	}
}

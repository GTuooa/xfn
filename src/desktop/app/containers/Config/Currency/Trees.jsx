import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tree } from 'antd'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Trees extends React.Component {
	
	render() {

		const {
			Data,
			onSelect,
			selectedKeys
		} = this.props

		const loop = data => data.map((item) => {
			if (item.children) {
				return (
					<TreeNode key={item.title.replace(' ', Limit.FC_JOIN_STR_CONNECT)} title={item.title} disableCheckbox={!item.checkedable}>
					{loop(item.children)}
					</TreeNode>
				)
			} else {
				return <TreeNode key={item.title.replace(' ', Limit.FC_JOIN_STR_CONNECT)} title={item.title} disableCheckbox={!item.checkedable}/>
			}


		})

		return (
			<Tree multiple checkable
				onCheck={onSelect}
				checkedKeys={selectedKeys}
				>
				{loop(Data)}
			</Tree>
		)
    }
}

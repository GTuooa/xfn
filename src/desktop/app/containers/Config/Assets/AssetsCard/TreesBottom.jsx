import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

const loop = data => data.map((item) => {
	if (item.children)
		return (
			<TreeNode key={item.key} title={item.title}>
				{loop(item.children)}
			</TreeNode>
		)
	return <TreeNode key={item.key} title={item.title} />
})

@immutableRenderDecorator
export default
class TreesBottom extends React.Component {

	render() {

		const {
			labelTreeList,
			onSelect,
			currentSelectedKeys
		} = this.props

		return (
			<div className="assetsmxb-bottom-tree">
				<div className="assetsmxb-label">标签：</div>
				{
					labelTreeList.length ?
					<Tree
						defaultExpandAll={false}
						selectedKeys={currentSelectedKeys}
						onSelect={onSelect}
						>
						{loop(labelTreeList)}
					</Tree> : ''
				}
			</div>
		)
	}
}

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
class Trees extends React.Component {
	render() {
		const {
			assetslist,
			dataKey,
			dataValue,
			onSelect,
			currentSelectedKeys
		} = this.props;

		return (
			<Tree
				defaultExpandAll={false}
				onSelect={onSelect}
				selectedKeys={currentSelectedKeys}
				>
				{loop(assetslist)}
			</Tree>
		)
}}

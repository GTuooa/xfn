import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

const loop = data => data.map((item) => {
	if (item.children)
		return (
			<TreeNode key={item.title} title={item.title} disabled>
			{loop(item.children)}
			</TreeNode>
		)
	return <TreeNode key={item.title} title={item.title} />
})

@immutableRenderDecorator
export default
class Trees extends React.Component {

	render() {
		const { Data, onSelect, selectedKeys } = this.props

		return (
			<Tree
				defaultExpandAll
				onSelect={onSelect}
				selectedKeys={selectedKeys}
				>
				{loop(Data)}
			</Tree>
		)
  }
}

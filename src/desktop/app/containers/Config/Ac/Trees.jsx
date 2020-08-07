import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

@immutableRenderDecorator
export default
class Trees extends React.Component {

	render() {
		
		const { Data, onSelect, selectedKeys, disabled } = this.props

		const loop = data => data.map((item) => {
			if (item.children)
				return (
					<TreeNode key={item.key} title={item.title} disabled={disabled} >
					{loop(item.children)}
					</TreeNode>
				)
			return <TreeNode key={item.key} title={item.title} disabled={disabled ? (item.key.length === 10 ? true : false) : false}/>
		})

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

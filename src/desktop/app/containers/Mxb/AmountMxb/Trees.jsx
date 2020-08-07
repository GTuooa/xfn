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
	return <TreeNode key={item.key} title={item.title} className={item.disableTime ? 'assmxb-fzhs-disable' : ''}/>
})

@immutableRenderDecorator
export default
class Trees extends React.Component {
	render() {
		const {
			cascadeAclist,
			dataKey,
			dataValue,
			onSelect,
			currentAcid,
			beSupport,
			currentSupportPos,
			style
		} = this.props;

		const defaultSelectedKeys = beSupport ? [currentSupportPos] : [currentAcid]

		return (
			<Tree
				defaultExpandAll={false}
				selectedKeys={defaultSelectedKeys}
				onSelect={onSelect}
				style={style}
				>
				{loop(cascadeAclist)}
			</Tree>
		)
}}
// expandedKeys = {defaultExpandedKeys}

import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode
import { toJS } from 'immutable'

const loop = data => data.map((item) => {
	if (item.children) {
		return (
			<TreeNode
				key={item.key}
				title={item.title}
				>
			{loop(item.children)}
			</TreeNode>
		)
	} else {
		return <TreeNode key={item.key} title={item.title} className={item.disableTime ? 'assmxb-fzhs-disable' : ''}/>
	}
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
			style
		} = this.props;

		const defaultSelectedKeys = [currentAcid]

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

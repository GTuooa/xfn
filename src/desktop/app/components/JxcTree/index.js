import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'
import { toJS } from 'immutable'

const loop = data => data.map((item) => {
	if (item.childList.length) {
		return (
			<TreeNode key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}`} title={`${item.name}${item.cardNumber?`(${item.cardNumber})`:''}`}>
				{loop(item.childList)}
			</TreeNode>
		)
	} else {
		return <TreeNode key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}`} title={`${item.name}${item.cardNumber?`(${item.cardNumber})`:''}`}/>
	}
})

@immutableRenderDecorator
export default
class JxcTrees extends React.Component {
	render() {
		const {
			dataList,
			dataKey,
			dataValue,
			onSelect,
			currentSelectedKeys
		} = this.props

		return (
			dataList.getIn([0,'name'])!=null && dataList.getIn([0,'name'])!=''?
				<Tree
					defaultExpandAll={true}
					onSelect={onSelect}
					selectedKeys={currentSelectedKeys}
					>
					{loop(dataList.toJS())}
				</Tree>
			:<div></div>
		)
    }
}

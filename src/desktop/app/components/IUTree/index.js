import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Tree, Checkbox,} from 'antd'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'
import { toJS } from 'immutable'

@immutableRenderDecorator

class IUTree extends React.Component {
	render() {
		const {
			dataList,
			onCheck,
			currentSelectedKeys,
			selectTreeNode,
			isDelete,
			iuTreeSelectList,
			getIndex
		} = this.props

		const loop = data => data.map((item,index) => {
			if (item.childList.length) {
				return (
		                <TreeNode key={`${item.uuid}`} title={item.name}>
		    				{loop(item.childList)}
		    			</TreeNode>
		            )
			} else {
				return (
		                <TreeNode key={`${item.uuid}`} title={item.name}/>
		        )
			}
		})

		let expanKeys = [];
		if( dataList.getIn([0,'childList']).size > 0 ){
			dataList.getIn([0,'childList']).map((v,i) =>{
				expanKeys.push(`${v.get('uuid')}`)
			})
		}
		return (
			dataList.getIn([0,'name'])!=null && dataList.getIn([0,'name'])!=''?
				<Tree
					defaultExpandedKeys={expanKeys}
					selectedKeys={currentSelectedKeys}
					checkable={isDelete}
					checkStrictly={true}
					onCheck={(checkedKeys, e) => {
						// if (e.checked) {
						let childUuidList = []
						const loopCheckedItem = (item) => item.map((v, i) => {
							if (v.props.children) {
								childUuidList.push(v.key)
								loopCheckedItem(v.props.children)
							} else {
								childUuidList.push(v.key)
							}
						})
						loopCheckedItem(e.checkedNodes)
						const allList = checkedKeys.checked.concat(childUuidList)
						let checkedList = []
						allList.forEach((v, i) => { // 去重
							if (allList.indexOf(v) == i) {
								checkedList.push(v)
							}
						})
						onCheck(checkedList)
						// } else {
						// 	onCheck(checkedKeys.checked)
						// }
					}}
					onSelect={(selectedKeys) => selectTreeNode(selectedKeys)}
					checkedKeys={iuTreeSelectList.toJS()}
					>
					{loop(dataList.toJS())}
				</Tree>
			:<div></div>
		)
    }
}

export default IUTree
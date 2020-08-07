import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import XfnSelect from './XfnSelect'
import { UpperClassSelect, SelectAc, NumberInput } from 'app/components'
import { Modal, message, Radio, Icon, Tree } from 'antd'
const { TreeNode } = Tree

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

export default
class WarehouseTreeModal extends React.Component {
	state={
		showMultiUnit:false,
	}
	render() {
		const {
			dispatch,
			showWarehouseModal,
			onClose,
			treeList,
			selectedKeys
		} = this.props

		const { showMultiUnit } = this.state
		const loop = (data,upperArr) => data.map(v => {
			if (v.get('childList') && v.get('childList').size) {
				return <TreeNode title={v.get('name')} key={`${v.get('uuid')}`}>
					{loop(v.get('childList'),upperArr + Limit.TREE_JOIN_STR+ v.get('uuid'))}
				</TreeNode>
			}
			return <TreeNode title={v.get('name')} key={`${v.get('uuid')}`}/>
		})
		return (
			<Modal
				destroyOnClose
				className='add-unit'
				width={'500px'}
				visible={showWarehouseModal}
				maskClosable={false}
				title={'选择仓库'}
				onCancel={() => {
					onClose()
					dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS([])))
				}}
				onOk={() => {
					dispatch(editInventoryCardActions.getSomeWarehouseTree(selectedKeys.toJS(),() => {
						onClose()
					}))
				}}
			>
				<Tree
					checkable
					defaultExpandAll
					checkedKeys={selectedKeys.toJS()}
					selectedKeys={[]}
					onCheck={(checkedKeys,e) => {
						// let arr = Array.from(new Set(checkedKeys.reduce((pre,cur) => pre.concat(cur.split(Limit.TREE_JOIN_STR)),[])))
						dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS(checkedKeys)))
					}}
					onSelect={() => ''}
				>
					{treeList.size?loop(treeList,''):[]}
				</Tree>
			</Modal>
		)
		// return (
		// 	<Modal
		// 		className='add-unit'
		// 		width={'500px'}
		// 		visible={showWarehouseModal}
		// 		maskClosable={false}
		// 		title={'选择仓库'}
		// 		onCancel={() => {
		// 			onClose()
		// 			dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS([])))
		// 			this.setState({checkedKeys:[]})
		// 		}}
		// 		onOk={() => {
		// 			dispatch(editInventoryCardActions.getSomeWarehouseTree(selectedKeys.toJS(),() => {
		// 				onClose()
		// 				this.setState({checkedKeys:[]})
		// 			}))
		// 		}}
		// 	>
		// 		<Tree
		// 			checkable
		// 			checkedKeys={checkedKeys}
		// 			selectedKeys={[]}
		// 			onCheck={(checkedKeys,e) => {
		// 				console.log(checkedKeys)
		// 				let arr = Array.from(new Set(checkedKeys.reduce((pre,cur) => pre.concat(cur.split(Limit.TREE_JOIN_STR)),[])))
		// 				dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS(arr)))
		// 				this.setState({checkedKeys:checkedKeys})
		// 			}}
		// 			onSelect={() => ''}
		// 		>
		// 			{treeList.size?loop(treeList,''):[]}
		// 		</Tree>
		// 	</Modal>
		// )
	}
}

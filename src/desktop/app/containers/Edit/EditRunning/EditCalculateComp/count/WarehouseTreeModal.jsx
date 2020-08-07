import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
// import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { Modal, Tree } from 'antd'
const { TreeNode } = Tree

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

export default
class WarehouseTreeModal extends React.Component {
	static displayName = 'Chye WarehouseTreeModal'
	constructor() {
		super()
		this.state = {
			uuid: '',
			name: '',
			isUniform: ''
		}
	}
	render() {
		const {
			dispatch,
			showWarehouseModal,
			onClose,
			treeList,
			selectedKeys,
			checkable,
			onSelect,
			onCheck,
			tempName,
			canClick,
			countStockCardList,
			needTotal,//是否需要全部
		} = this.props
		const { uuid, name, isUniform } = this.state
		let selectChildList = []
		const loop = (data,upperArr,selectUuid) => data && data.map(v => {
			if(selectUuid === v.get('uuid')){
				selectChildList = v.get('childList') ? v.get('childList').toJS() : []
			}
			if (v.get('childList') && v.get('childList').size) {
				return <TreeNode title={`${v.get('code')} ${v.get('name')}`} key={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isUniform')}${Limit.TREE_JOIN_STR}${false}${Limit.TREE_JOIN_STR}${v.get('price')}`} selectable={checkable || canClick}>
					{loop(v.get('childList'),upperArr + Limit.TREE_JOIN_STR+ v.get('uuid'))}
				</TreeNode>
			}else{
				return <TreeNode title={`${v.get('code')} ${v.get('name')}`} key={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isUniform')}${Limit.TREE_JOIN_STR}${true}${Limit.TREE_JOIN_STR}${v.get('price')}`}/>
			}

		})
		return (
			<Modal
				destroyOnClose
				className={checkable ? 'add-unit' : 'no-foot add-unit'}
				width={'500px'}
				visible={showWarehouseModal}
				maskClosable={false}
				title={'选择仓库'}
				onCancel={() => {
					this.setState({
						uuid:'',
						name:'',
						isUniform:''
					})
					onClose()
				}}
				onOk={() => {
					if(checkable){
						let wareHouseList = [],countStockCardIdList = [],selectWareHouseUuid = []
						countStockCardList && countStockCardList.map(v => countStockCardIdList.push(v.get('cardUuid')))
						selectedKeys && selectedKeys.length && selectedKeys.map(item => {
							const valueList = item.split(Limit.TREE_JOIN_STR)
							const nameList = valueList[1].split(' ')

							const uuid = valueList[0]
							const isUniform = valueList[3] === 'true' ? true : false
							const isLast = valueList[4] === 'true' ? true : false

							isLast && wareHouseList.push({
								cardUuid: uuid,
								code: valueList[1],
								name: `${valueList[1]} ${valueList[2]}`,
								isUniform
							})
							selectWareHouseUuid.push(uuid)


						})
						let newWareHouseList = []
						wareHouseList.map( v => {
							if(countStockCardIdList.indexOf(v.cardUuid) === -1){
								newWareHouseList.push(v)
							}
						})
						let newCountStockCardList = countStockCardList.toJS()
						newCountStockCardList = newCountStockCardList.filter(v => selectWareHouseUuid.indexOf(v.cardUuid) > -1)

						dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countStockCardList', fromJS(newCountStockCardList.concat(newWareHouseList))))
						onCheck(fromJS(newCountStockCardList.concat(newWareHouseList)))

					}

					onClose()
				}}
			>
				<Tree
					checkable={checkable}
					checkStrictly={false}
					defaultExpandAll
					checkedKeys={selectedKeys}
					onCheck={(checkedKeys,e) => {
						dispatch(editCalculateActions.changeEditCalculateCommonState(`${tempName}Temp`, 'warehouseSelectedKeys',fromJS(checkedKeys) ))
					}}
					onSelect={(value,info) => {
						if(value[0]){
							const valueList = value[0].split(Limit.TREE_JOIN_STR)
							const uuid = valueList[0]
							const code = valueList[1]
							const name = valueList[2]
							const isUniform = valueList[3] === 'true' ? true : false
							const notHasChild = valueList[4] === 'true' ? true : false
							const price = valueList[5]
							if(!notHasChild){//有子集
								loop(treeList.getIn([0,'childList']) ? treeList.getIn([0,'childList']) : [],'',uuid)
							}else{
								selectChildList = [{
									uuid,
									name: valueList[2],
									isUniform,
									code,
								}]
							}
							if(!checkable){
								onSelect(uuid,code,name,isUniform,selectChildList,price,notHasChild)
								onClose()
							}
						}
					}}
				>
					{
						needTotal ?
						<TreeNode
							title={`全部仓库`}
							key={`${treeList.getIn([0,'uuid']) ? treeList.getIn([0,'uuid']) : 'all'}${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}全部仓库${Limit.TREE_JOIN_STR}flase${Limit.TREE_JOIN_STR}${true}${Limit.TREE_JOIN_STR}${0}`}
						/> : []
					}

						{
							treeList.getIn([0,'childList']) && treeList.getIn([0,'childList']).size?loop(treeList.getIn([0,'childList']),''):[]
						}
				</Tree>
			</Modal>
		)
	}
}

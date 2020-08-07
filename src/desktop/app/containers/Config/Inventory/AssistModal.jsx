import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import XfnSelect from './XfnSelect'
import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab } from 'app/components'
import { Modal, message, Radio, Icon, Tree, Input, Button, Checkbox } from 'antd'
const { TreeNode } = Tree
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

export default
class WarehouseTreeModal extends React.Component {
	state={
		addAssistCategroy:false,
		activeUuid:'',
		activeType:'',
		newAssistClassificationList:this.props.assistClassificationList
	}
	componentDidMount() {
		this.props.dispatch(editInventoryCardActions.getAssistList(this.props.uuid))
	}
	emptySelect = () => {
		this.setState({activeType:'',activeUuid:''})
	}
	afterAdd = () => {
		this.setState({activeType:'',activeUuid:'plus'})
	}
	render() {
		const {
			dispatch,
			assistModal,
			allAssistClassificationList,
			assistClassificationList,
			onClose
		} = this.props
		const {
			addAssistCategroy,
			activeUuid,
			activeType ,
			title,
			classificationUuid,
			newAssistClassificationList
		} = this.state
		const index = allAssistClassificationList.findIndex(v => v.get('uuid') === classificationUuid)
		return (
			<Modal
				destroyOnClose
				className='add-unit'
				width={'800px'}
				visible={assistModal}
				maskClosable={false}
				title={'辅助属性'}
				onCancel={() => {
					onClose()
					dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS([])))
				}}
				onOk={() => {
					dispatch(editInventoryCardActions.changeInventoryInnerSrting(['financialInfo','assistClassificationList'],newAssistClassificationList))
					onClose()
				}}
			>
				<div>
					<div style={{color:'#999'}}> *请勾选属性，最多支持3个属性分类</div>
					<div>
					<TableAll className='assist-table'>
						<TableBody>
							{
								allAssistClassificationList.size?
								allAssistClassificationList.map((v,index) =>
									<TableItem>
										<li>{v.get('name')}</li>
										<li>
											{
												v.get('propertyList').map(w =>
													<span>
														<Checkbox
															disabled={newAssistClassificationList.size >= 3 && newAssistClassificationList.every(w => w.get('name') !== v.get('name'))}
															checked={newAssistClassificationList.some(y => y.get('propertyList').find(z => z.get('uuid') === w.get('uuid')))}
															onClick={e => {
																const index = newAssistClassificationList.findIndex(y => y.get('uuid') === v.get('uuid'))
																let list = newAssistClassificationList
																let newList = fromJS([])
																if (e.target.checked) {
																	if (index === -1) {
																		list = newAssistClassificationList.push(v.set('propertyList',fromJS([])).set('isUniform',true))
																	}
																	newList = list.updateIn([index,'propertyList'], v => v.push((w)))
																} else if (!e.target.checked && list.getIn([index,'propertyList']).size === 1) {
																	newList = list.delete(index)
																} else {
																	newList = list.updateIn([index,'propertyList'], v => v.splice((v.findIndex(z => z.get('uuid') === w.get('uuid'))),1))
																}
																this.setState({newAssistClassificationList:newList})
															}}
															>
																{w.get('name')}
														</Checkbox>
													</span>
												)
											}
											<span
												className='assist-add'
												onClick={() => {
													this.setState({
														addAssistCategroy:true,
														title:'属性管理：' + v.get('name'),
														classificationUuid:v.get('uuid'),
														activeUuid:'plus',
														activeType:'',
													})
											}}><XfIcon type='big-plus'/></span>
										</li>
									</TableItem>
								)
								:
								<TableItem>
									<div className='assist-item img-kongtaitu' style={{borderBottom:0}}>
										<div></div>
										<div>暂无属性分类，请新增属性分类</div>
									</div>
								</TableItem>
							}

						</TableBody>
					</TableAll>
					<span
						onClick={() => this.setState({
							addAssistCategroy:true,
							activeUuid:'plus',
							activeType:'',
							title:'属性分类',
						})}
						>

						<Button type='primary' style={{background:'#5e81d1',marginTop:'12px',borderColor:'#5e81d1'}}><XfIcon type='big-plus'/>新增属性分类</Button>
					</span>

					</div>
				</div>
				<Modal
					visible={addAssistCategroy}
					title={title}
					onCancel={() => this.setState({addAssistCategroy:false})}
					footer={[
						<Button
							onClick={() => {
								this.setState({
									addAssistCategroy:false
								})
							}}
							>取消</Button>,
						<Button
							disabled={!activeUuid || activeUuid === 'plus'}
							onClick={() => {
								title === '属性分类'?
								dispatch(editInventoryCardActions.deleteAssistCategroy(activeUuid,this.emptySelect))
								:
								dispatch(editInventoryCardActions.deleteAssist(activeUuid,this.emptySelect))

							}}
							>删除</Button>,
						<Button
							type='primary'
							disabled={!activeUuid}
							onClick={() => {

								if (title === '属性分类') {
									activeUuid === 'plus'?
									dispatch(editInventoryCardActions.insertAssistCategroy(activeType,this.afterAdd))
									:
									dispatch(editInventoryCardActions.modifyAssistCategroy(activeUuid,activeType))
								} else {
									activeUuid === 'plus'?
									dispatch(editInventoryCardActions.insertAssist(classificationUuid,activeType,this.afterAdd))
									:
									dispatch(editInventoryCardActions.modifyAssist(activeUuid,classificationUuid,activeType))
								}
							}}
							>保存</Button>,
					]}
					>
					<div>
						<Tab
							addButton
							tabList={title === '属性分类'?allAssistClassificationList.toJS().map(v => ({key:v.uuid,value:v.name})):(allAssistClassificationList.getIn([index,'propertyList']) || fromJS([])).toJS().map(v => ({key:v.uuid,value:v.name}))}
							activeKey={activeUuid}
							addKey={'plus'}
							addFunc={() => {
								this.setState({
									activeUuid:'plus',
									activeType:''
								})
							}}
							tabFunc={(v) => {
								this.setState({
									activeUuid:v.key,
									activeType:v.value
								})
							}}
						/>
						<div style={{display:'flex'}}>
							<span style={{width:'72px'}}>分类名称：</span>
							<Input
								value={activeType}
								onChange={e => {
								this.setState({
									activeType:e.target.value
								})
							}}/>
						</div>
					</div>
				</Modal>
			</Modal>
		)
	}
}

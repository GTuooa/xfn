import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck, formatMoney, formatNum, formatFour, numberFourTest } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, TableBody, TableTitle, TableItem, TableAll, XfnIcon, XfnSelect } from 'app/components'
import { Modal, message, Radio, Icon, Tree, Select, DatePicker, Input, Divider, Button } from 'antd'
const { TreeNode } = Tree
import InputFour from 'app/components/InputFour'
import WarehouseTableItem from './WarehouseTableItem'
import BatchDrop from './BatchDrop'

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
let warehouseTotalAmount = 0

export default
class WarehouseTable extends React.Component {
	state={
		showMultiUnit:false,
		hideChildList:[],
		newBatchNumber:'',
		newBatchDate:'',
		placeArr:[]
	}
	render() {
		const {
			dispatch,
			warehousePriceMode,
			isOpenedQuantity,
			enableWarehouse,
			treeList,
			showWarehouseModal,
			isCheckOut,
			assistClassificationList,
			batchList,
			uuid,
			financialInfo
		} = this.props
		const unit = this.props.unit || fromJS({})
		const serialList = financialInfo.get('serialList') || fromJS([])
		const openAssist = financialInfo.get('openAssist')
		const openSerial = financialInfo.get('openSerial')
		const openBatch = financialInfo.get('openBatch')
		const openShelfLife = financialInfo.get('openShelfLife')
		const shelfLife = financialInfo.get('shelfLife')
		const {
			showMultiUnit,
			hideChildList,
			placeArr,
			index,
			batchIndex
		} = this.state
		let count = 1
		let batchArr = []
		console.log(treeList.toJS())
		const loop = (data, placeArr,line,level) => data.map((v,i)=> {
			const line = i>0?data.getIn([i-1,'childList']).size %2 == 0 ?line + i:line + i + 1:line + i
			if (!v.get('childList') || !v.get('childList').size || v.get('isEnd')) {
				count++
				const assistList = v.getIn(['childList',0,'assistList']) || fromJS([])
				const extraList = v.get('childList') || fromJS([])
				const openedQuantity = (openBatch || openAssist) && isOpenedQuantity ? extraList.reduce((pre,cur) => pre +( Number(cur.get('openedQuantity')) || 0),0):v.get('openedQuantity')
				const openedAmount = (openBatch || openAssist) && isOpenedQuantity ? extraList.reduce((pre,cur) => pre + (Number(cur.get('openedAmount')) || 0),0):v.get('openedAmount')
				// if (extraInfo.get('batch')) {
				// 	batchArr.push(extraInfo.get('batch'))
				// }
				let value = ''
				const paddingLeft = 5+(level - 1)*7 + 'px'
			return <div className='item-content'>
				<TableItem key={v.get('warehouseUuid')} line={line}>
					<li className='inventory-code' style={{paddingLeft}}>{v.get('warehouseCode')}</li>
					<li	className='inventory-name'>
						<span>{v.get('warehouseName')}</span>
						{
							(openAssist || openBatch) && isOpenedQuantity?
							<Icon type="plus" onClick={() => {
								const childList = (v.get('childList') || fromJS([])).push(fromJS({openedQuantity:'',openedAmount:''}))
								dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList'],childList))

							}}/>:''
						}
					</li>
					{
						isOpenedQuantity?
						!openAssist && !openBatch?
						<li	className='force-centet'>
							{
								openSerial?
								<div className='serial-box' onClick={() => {
									dispatch(editInventoryCardActions.changeInventoryCardViews('serialPlaceArr',fromJS(['openList',...placeArr,i])))
									if (v.get('openUuid') && !v.get('isModify')) {
										dispatch(editInventoryCardActions.getSerialList(uuid,v.get('openUuid')))
									} else {
										dispatch(editInventoryCardActions.changeInventoryCardViews('serialList',v.get('serialList') || fromJS([])))
										dispatch(editInventoryCardActions.changeInventoryCardViews('serialModal',true))
									}

								}}>
									{v.get('openedQuantity') > 0 ? formatFour(v.get('openedQuantity')):'点击输入'}
									<XfnIcon type='edit-pen'/>
								</div>
								:
								<InputFour
									className='input-quantity'
									type="regAmount"
									disabled={isCheckOut}
									placeholder="必填，请输入数量"
									value={openedQuantity}
									onChange={(e) => {
										numberFourTest(e, (value) => {
										dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'openedQuantity'],value))
									},true)
									}}
								/>
							}
							<span>{unit.get('name')}</span>
						</li>
						:
						extraList.size?
						<li	className='force-centet'><span className='input-quantity'>{formatFour(openedQuantity)}</span><span>{unit.get('name')}</span></li>
						:<li></li>
						:''
					}

					{
						// warehousePriceMode !== 'U' && (isOpenedQuantity || enableWarehouse) || !isOpenedQuantity?
							!openAssist && !openBatch || !isOpenedQuantity?
								<li	className='force-centet'>
									<NumberInput
									type='regAmount'
									className='input-amount'
									disabled={isCheckOut}
									placeholder="必填，请输入金额"
									value={v.get('openedAmount')}
									onChange={(value) => {
										dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'openedAmount'],value))
									}}
									/>
									<span>元</span>
								</li>
								:
								<li	className='force-centet'><span className='input-amount'>{formatMoney(openedAmount)}</span><span>元</span></li>
							// :''
					}

				</TableItem>
				{
					extraList.size && isOpenedQuantity && (openAssist || openBatch)?
						extraList.map((w,index) => {
						// const newBatchList = batchList.filter(z => batchArr.some(zi => zi === z))
						const batchItem = batchList.find(z => z.get('batchUuid') === w.get('batchUuid') && w.get('batchUuid') || z.get('batch') === w.get('batch'))
						return(
							<TableItem className='detail-item' line={line}>
								<li></li>
								<li className='inventory-select'>
									{
										openAssist && assistClassificationList.map(y =>
											<Fragment>
											<XfnSelect
												showSearch
												className='assist-select'
												placeholder={y.get('name')}
												value={((w.get('assistList') || fromJS([])).find(z => z.get('classificationUuid') === y.get('uuid')) || fromJS({})).get('propertyName') || undefined}
												onChange={value => {
													const valueList = value.split(Limit.TREE_JOIN_STR)
													const propertyUuid = valueList[0]
													const propertyName = valueList[1]
													const assistList = w.get('assistList') || fromJS([])
													const size = assistList.size
													const childIndex = assistList.findIndex(z => z.get('classificationUuid') === y.get('uuid'))
													if (size === 0) {
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'assistList'],fromJS([{
															classificationUuid:y.get('uuid'),
															classificationName:y.get('name'),
															propertyUuid,
															propertyName
														}])))
													} else if (childIndex === -1) {
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'assistList',size],fromJS({
															classificationUuid:y.get('uuid'),
															classificationName:y.get('name'),
															propertyUuid,
															propertyName
														})))

													} else {
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'assistList',childIndex,'propertyUuid'],propertyUuid))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'assistList',childIndex,'propertyName'],propertyName))
													}
												}}
												>
												{
													y.get('propertyList').map(z =>
														<Option key={z.get('uuid')} value={`${z.get('uuid')}${Limit.TREE_JOIN_STR}${z.get('name')}`}>
															{z.get('name')}
														</Option>
													)
												}
											</XfnSelect>

										</Fragment>)
									}
									{
										openBatch?
										<Fragment>
											<div className='batch-content'>
												<XfnSelect
													showSearch
													className={`batch-select input${index}`}
													placeholder='请选择/新增批次'
													value={batchItem?`${batchItem.get('batch')}${openShelfLife && batchItem.get('expirationDate')?`(${batchItem.get('expirationDate')})`:''}`:undefined}
													showArrow={false}
													dropdownRender={menu => (
														<div onMouseDown={e => e.preventDefault()} className='edit-box'>
															{menu}
															<Divider style={{ margin: '4px 0' }} />
															<div className='edit-area' onClick={() => {
																dispatch(editInventoryCardActions.changeInventoryCardViews('batchModal',true))
															}}>
																<XfnIcon type='edit-pen'/>修改批次信息
															</div>
														</div>
													)}
													onChange={value => {
														const valueList = value.split(Limit.TREE_JOIN_STR)
														const batch = valueList[0]
														const batchUuid = valueList[1]
														const expirationDate = valueList[2]
														const assistList = v.getIn(['childList',0,'assistList'])
														this.setState({
															[`value${index}`]:false,
														})
														// const index = assistList.findIndex(z => z.get('classificationUuid') === y.get('uuid'))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'batch'],batch))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'batchUuid'],batchUuid))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'expirationDate'],expirationDate))

													}}
												>
													{
														batchList.map(w =>
															<Option
																key={w.get('batch')}
																value={`${w.get('batch')}${Limit.TREE_JOIN_STR}${w.get('batchUuid') || ''}${Limit.TREE_JOIN_STR}${w.get('expirationDate')}`}
															>
																{`${w.get('batch')}${openShelfLife && w.get('expirationDate')?`(${w.get('expirationDate')})`:''}`}
															</Option>
														)
													}
												</XfnSelect>
												<span className='add-button' onClick={() => {
													// const elemet = document.getElementsByClassName('input' + index)[0]
													// const react = elemet.getBoundingClientRect && elemet.getBoundingClientRect()
													this.setState({
														batchDrop:true,
														batchIndex:index,
														index:i,
														placeArr
													})
												}}>新增</span>
												</div>
											</Fragment>
											:''
									}
									<div className='close-button'>
										<Icon type='close' onClick={() => {
											dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList'],extraList.splice(extraList.size -1,1)))
										}}/>
									</div>
								</li>
								{
									isOpenedQuantity?
									<li className='force-centet'>
										{
											openSerial?
											<div className='serial-box' onClick={() => {
												dispatch(editInventoryCardActions.changeInventoryCardViews('serialPlaceArr',fromJS(['openList',...placeArr,i,'childList',index])))
												if (w.get('openUuid') && !w.get('isModify')) {
													dispatch(editInventoryCardActions.getSerialList(uuid,w.get('openUuid')))
												} else {
													dispatch(editInventoryCardActions.changeInventoryCardViews('serialList',w.get('serialList') || fromJS([])))
													dispatch(editInventoryCardActions.changeInventoryCardViews('serialModal',true))
												}
											}}>
												{w.get('openedQuantity') > 0 ? formatFour(w.get('openedQuantity')):'点击输入'}
												<XfnIcon type='edit-pen'/>
											</div>
											:
											<InputFour
												className='input-quantity'
												type="regAmount"
												disabled={isCheckOut}
												placeholder="必填，请输入数量"
												value={w.get('openedQuantity')}
												onChange={(e) => {
													numberFourTest(e, (value) => {
														dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'openedQuantity'],value))
													},true)
												}}
											/>
										}
										<span>{unit.get('name')}</span>
									</li>:''
								}
								<li className='force-centet'>
									<NumberInput
										type='regAmount'
										className='input-amount'
										disabled={isCheckOut}
										placeholder="必填，请输入金额"
										value={w.get('openedAmount')}
										onChange={(value) => {
											dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,i,'childList',index,'openedAmount'],value))
										}}
									/><span>元</span>
								</li>
							</TableItem>
						)
					}):''
				}
			</div>
			}
			count++
			const showChild = hideChildList.indexOf(v.get('warehouseUuid')) == -1
			return <div className='item-content' >
					<WarehouseTableItem
						item={v}
						showChild={showChild}
						hideChildList={hideChildList}
						warehousePriceMode = {warehousePriceMode}
						isOpenedQuantity={isOpenedQuantity}
						enableWarehouse={enableWarehouse}
						unit={unit}
						showChildFunc={() => this.setState({hideChildList:hideChildList.filter(w => w != v.get('warehouseUuid'))})}
						hideChildFunc={() => this.setState({hideChildList:[...hideChildList,v.get('warehouseUuid')]})}
						line={line}
						level={level}
						isCheckOut={isCheckOut}
						dispatch={dispatch}
						index={i}
						openAssist={openAssist}
						openBatch={openBatch}
					/>
					{showChild?loop(v.get('childList'),[...placeArr,i,'childList'],line+1,level+1):[]}
				</div>

			})
			let totalAmount = 0,totalNumber = 0
			const loopPlus = (data) => data.map(v => {
				if (v.get('childList') && v.get('childList').size && !v.get('isEnd')) {
					loopPlus(v.get('childList'))
				} else {
					if ((openAssist || openBatch) && isOpenedQuantity) {
						totalAmount += v.get('childList').reduce((pre,cur) => pre + (Number(cur.get('openedAmount')) || 0),0)
						totalNumber += v.get('childList').reduce((pre,cur) => pre + (Number(cur.get('openedQuantity')) || 0),0)
					} else {
						totalAmount += Number(v.get('openedAmount')) || 0
						totalNumber += Number(v.get('openedQuantity')) || 0
					}
				}
			})
			loopPlus(treeList)
			let className = ''
			if (isOpenedQuantity && enableWarehouse) {
				className = 'quantity-warehouse-table'
			} else if (!isOpenedQuantity && enableWarehouse) {
				className = 'warehouse-table'
			}
		return (
			<TableAll className={`inventory-table-width ${className}`}>
				<TableBody>
					<TableItem line={2}>
						<li>仓库编码</li>
						<li key='1'
							onClick={() => {
								if (isCheckOut) {
									message.info('已结账，不允许修改期初值')
									return
								}
								dispatch(editInventoryCardActions.getWarehouseTree(showWarehouseModal))
								// dispatch(editInventoryCardActions.getWarehouseTreeAndUpdate(treeList,showWarehouseModal))
								if (treeList.size) {
									let selectedKeys = []
									const loop = list => list.map(v => {
										if (v.get('childList') && v.get('childList').size) {
											loop(v.get('childList'))
										} else {
											selectedKeys.push(v.get('warehouseUuid'))
										}
									})
									loop(treeList)
									dispatch(editInventoryCardActions.changeInventoryCardViews('selectedKeys',fromJS(selectedKeys)))
								}
							}}
						>仓库<XfnIcon type='config-edit'/></li>
						{
							isOpenedQuantity?
							<li	>期初数量</li>:''
						}
						<li	>期初余额</li>
					</TableItem>
					{loop(treeList,[],1,1)}
					<TableItem key='2' line={count} className={'no-border-bottom'}>
						<li></li>
						<li	>合计</li>
						{
							isOpenedQuantity?
							<li	className='force-centet'><span className='input-quantity'>{formatFour(totalNumber)}</span><span>{unit.get('name')}</span></li>:''
						}
						<li	className='force-centet'><span className='input-amount'>{formatMoney(totalAmount)}</span><span>元</span></li>
					</TableItem>
					{
						this.state.batchDrop?
						<BatchDrop
							shelfLife={shelfLife}
							visible={this.state.batchDrop}
							index={this.state.batchIndex || 0}
							dispatch={dispatch}
							uuid={uuid}
							openShelfLife={openShelfLife}
							callBack={(batch,batchUuid,expirationDate) => {
								const itemList = treeList.getIn([...placeArr,index,'childList'])
								if (itemList.getIn([batchIndex,'batchUuid']) || itemList.getIn([batchIndex,'batch'])) {
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',itemList.size,'batch'],batch))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',itemList.size,'batchUuid'],batchUuid))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',itemList.size,'expirationDate'],expirationDate))
								} else {
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',batchIndex,'batch'],batch))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',batchIndex,'batchUuid'],batchUuid))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',...placeArr,index,'childList',batchIndex,'expirationDate'],expirationDate))

								}
							}}
							close={() => this.setState({batchDrop:false})}
						/>:''
					}

				</TableBody>
			</TableAll>
		)
	}
}

import React,{ Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck, formatMoney, formatNum, formatFour, numberFourTest } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, TableBody, TableTitle, TableItem, TableAll, XfnIcon, XfnSelect, Icon } from 'app/components'
import { Modal, message, Radio, Tree, Select, DatePicker, Input, Divider, Button } from 'antd'

import InputFour from 'app/components/InputFour'
import WarehouseTableItem from './WarehouseTableItem'
import BatchDrop from './BatchDrop'

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
import XfnInput from 'app/components/Input'
let warehouseTotalAmount = 0

const { TreeNode } = Tree
const Option = Select.Option

export default
class OpenQuantityTable extends React.Component {
	state={
		showMultiUnit:false,
		hideChildList:[],
		newBatchNumber:'',
		newBatchDate:'',
		x:'0px',
		y:'0px'
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
			financialInfo,
			insertOrModify
		} = this.props
		const unit = this.props.unit || fromJS({})
		const serialList = financialInfo.get('serialList') || fromJS([])
		const openAssist = financialInfo.get('openAssist')
		const openBatch = financialInfo.get('openBatch')
		const openSerial = financialInfo.get('openSerial')
		const openShelfLife = financialInfo.get('openShelfLife')
		const shelfLife = financialInfo.get('shelfLife')
		const { showMultiUnit, hideChildList, batchIndex } = this.state
		let totalAmount = 0,totalNumber = 0
		treeList.map(v => {
			totalNumber += Number(v.get('openedQuantity')) || 0
			totalAmount += Number(v.get('openedAmount')) || 0
		})
		const mapList = treeList.size ? treeList : fromJS([{}])
		let className = ''
		if (isOpenedQuantity && openAssist && openBatch) {
			className = 'quantity-assist-batch-table'
		} else if (isOpenedQuantity && (openAssist || openBatch)) {
			className = 'quantity-assist-or-batch-table'
		} else {
			className = 'quantity-table'
		}
		return (
			<TableAll className={`inventory-table-width ${className}`} style={{display:isOpenedQuantity?'':'none'}}>
				<TableBody>
					<TableItem line={2}>
						{
							openAssist || openBatch?
							<li>操作</li>
							:''
						}
						{
							openAssist?
							<li>属性</li>
							:''
						}
						{
							openBatch?
							<li	>批次</li>
							:''
						}
						<li	>期初数量</li>
						<li	>期初余额</li>
					</TableItem>
					<div className='item-content'>
					{
						mapList.map((v,index)=> {
							const line = index + 1
							const assistList = v.getIn(['childList',0,'assistList']) || fromJS([])
							const extraList = v.get('childList') || fromJS([{}])
							let value = ''
							return <TableItem className='detail-item' line={line}>
										{
											openAssist || openBatch?
											<li className='choose-li'>
												<span><Icon type='plus'  onClick={() => {
													if (treeList.size) {
														dispatch(editInventoryCardActions.changeInventoryCardContent('openList',treeList.push(fromJS({}))))
													} else {
														dispatch(editInventoryCardActions.changeInventoryCardContent('openList',treeList.concat(fromJS([{},{}]))))
													}
												}}/></span>
												<span><Icon type='close' onClick={() => {
													if (treeList.size) {
														dispatch(editInventoryCardActions.changeInventoryCardContent('openList',treeList.splice(index,1)))
													} else {
														dispatch(editInventoryCardActions.changeInventoryCardContent('openList',fromJS([{}])))
													}
												}}/></span>
											</li>:''
										}
										{
											openAssist?
											<li>
												{
													assistClassificationList.map(y =>
														<div className='batch-content'  style={{maxWidth:`calc(${100/assistClassificationList.size}% - 6px)`}}>
														<Select
															className='assist-select'
															placeholder={y.get('name')}
															value={((v.get('assistList') || fromJS([])).find(z => z.get('classificationUuid') === y.get('uuid')) || fromJS({})).get('propertyName') || undefined}
															onChange={value => {
																const valueList = value.split(Limit.TREE_JOIN_STR)
																const propertyUuid = valueList[0]
																const propertyName = valueList[1]
																const assistList = v.get('assistList') || fromJS([])
																const size = assistList.size
																const childIndex = assistList.findIndex(z => z.get('classificationUuid') === y.get('uuid'))
																if (size === 0) {
																	dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'assistList'],fromJS([{
																		classificationUuid:y.get('uuid'),
																		classificationName:y.get('name'),
																		propertyUuid,
																		propertyName
																	}])))
																} else if (childIndex === -1) {
																	dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'assistList',size],fromJS({
																		classificationUuid:y.get('uuid'),
																		classificationName:y.get('name'),
																		propertyUuid,
																		propertyName
																	})))

																} else {
																	dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'assistList',childIndex,'propertyUuid'],propertyUuid))
																	dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'assistList',childIndex,'propertyName'],propertyName))
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
														</Select>

													</div>)
												}
											</li>:''
										}
										{
											openBatch?
											<li>
												<div className='batch-content'>
													<XfnSelect
														className={`batch-select input${index}`}
														placeholder='请选择/新增批次'
														value={v.get('batch')?`${v.get('batch')}${openShelfLife && v.get('expirationDate')?`(${v.get('expirationDate')})`:''}`:undefined}
														showArrow={false}
														showSearch
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
															const batchUuid = valueList[1] || ''
															const expirationDate = valueList[2]
															const assistList = v.getIn(['childList',0,'assistList'])
															this.setState({
																[`value${index}`]:false,
															})
															// const index = assistList.findIndex(z => z.get('classificationUuid') === y.get('uuid'))
															dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'batch'],batch))
															dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'batchUuid'],insertOrModify === 'insert'?'':batchUuid))
															dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'expirationDate'],expirationDate))

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
															batchIndex:index
														})
													}}>新增</span>
													</div>
												</li>
												:''
										}
										<li className='force-centet'>
											{
												openSerial?
												<div className='serial-box' onClick={() => {
													dispatch(editInventoryCardActions.changeInventoryCardViews('serialPlaceArr',fromJS(['openList',index])))
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
													value={v.get('openedQuantity')}
													onChange={(e) => {
														numberFourTest(e, (value) => {
															dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'openedQuantity'],value))
														})
													}}
												/>
											}
											<span className='unit'>{unit.get('name')}</span>
											</li>
										<li className='force-centet'>
											<NumberInput
												className='input-amount'
												type="regAmount"
												disabled={isCheckOut}
												placeholder="必填，请输入金额"
												value={v.get('openedAmount')}
												onChange={(value) => {
													dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',index,'openedAmount'],value))
												}}
											/><span  className='unit'>元</span>
										</li>
									</TableItem>
						})
					}
					</div>
					{
						openAssist || openBatch?
							<TableItem key='2' line={treeList.size+1} className={'no-border-bottom'}>
								{openAssist?<li></li>:''}
								{openBatch?<li></li>:''}
								<li	>合计</li>
								<li	className='force-centet'><span className='input-quantity'>{formatFour(totalNumber)}</span><span>{unit.get('name')}</span></li>
								<li	className='force-centet'><span className='input-amount'>{formatMoney(totalAmount)}</span><span>元</span></li>
							</TableItem>
							:''
					}
					{
						this.state.batchDrop?
						<BatchDrop
							visible={this.state.batchDrop}
							index={batchIndex || 0}
							dispatch={dispatch}
							uuid={uuid}
							shelfLife={shelfLife}
							openShelfLife={openShelfLife}
							close={() => this.setState({batchDrop:false})}
							callBack={(batch,batchUuid,expirationDate) => {
								if (mapList.getIn([batchIndex,'batchUuid']) || mapList.getIn([batchIndex,'batch'])) {
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',mapList.size,'batch'],batch))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',mapList.size,'batchUuid'],batchUuid))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',mapList.size,'expirationDate'],expirationDate))
								} else {
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',batchIndex,'batch'],batch))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',batchIndex,'batchUuid'],batchUuid))
									dispatch(editInventoryCardActions.changeInventoryCardContent(['openList',batchIndex,'expirationDate'],expirationDate))
								}

							}}
						/>:''
					}

				</TableBody>
			</TableAll>
		)
	}
}

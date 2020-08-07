import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import './style.less'
import * as Limit from 'app/constants/Limit.js'
import { jxcConfigCheck, numberFourTest, DateLib } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, TableBody, TableTitle, TableItem, TableAll, XfnIcon, Icon } from 'app/components'
import { Switch, Select, Checkbox, Button, Modal, message, Radio, Tree, Tag } from 'antd'
const { Option, OptGroup } = Select
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
import XfnSelect from './XfnSelect'
import XfSelect from 'app/components/XfnSelect'
import AddUnitModal from './AddUnitModal'
import WarehouseTreeModal from './WarehouseTreeModal'
import WarehouseTable from './WarehouseTable'
import OpenQuantityTable from './OpenQuantityTable'
import MultipleModal from './MultipleModal'
import AssistModal from './AssistModal'
import SerialModal from './SerialModal'
import BatchModal from './BatchModal'
import XfIcon from 'app/components/Icon'
import { XfInput } from 'app/components'


import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

@connect(state => state)
export default
class AddCardModal extends React.Component {

	static displayName = 'InventoryConfAddCardModal'

	constructor() {
		super()
		this.state = {
            confirmModal : false,
			showAddModal:false,
			showMultiUnit:false,
			showWarehouseModal:false,
			page:'basic',
			showCheckModal:false,
			assistModal:false,
			modifyBatchUuid:'',
        }
	}
	componentDidMount() {
		const { inventoryCardState, dispatch } = this.props
		const assemblyState = inventoryCardState.getIn(['inventoryCardTemp','assemblyState'])
		const unitUuid = inventoryCardState.getIn(['inventoryCardTemp','assemblySheet','unitUuid'])
		const unitList = inventoryCardState.getIn(['inventoryCardTemp','unit','unitList'])
		const fromOpen = inventoryCardState.getIn(['views','fromOpen'])
		const unit = inventoryCardState.getIn(['inventoryCardTemp','unit'])
		if (assemblyState === 'OPEN' && fromOpen) {
			this.setState({page:'other'})
		}
		if (assemblyState === 'OPEN' && !unitList.size && !unitUuid) {
			dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitUuid'],unit.get('uuid')))
			dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitName'],unit.get('name')))
		}
	}
	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.inventoryCardState !== nextprops.inventoryCardState || this.props.showModal !== nextprops.showModal || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}
	render() {

		const {
			dispatch,
			showModal,
			// type,  // 录入流水用
			// inventoryConfState,
			inventoryCardState,
			homeState,
			enableWarehouse,
			Psi,
			cardList=fromJS([]),
			originTags,
			fromPage,
			isJz
		} = this.props
		const closeModal = () => {
			this.props.closeModal()
			this.setState({page:'basic'})
		}
		const {
			confirmModal,
			showAddModal,
			showMultiUnit,
			showWarehouseModal,
			page,
			showCheckModal,
			assistModal,
			modifyBatchUuid,
		} = this.state
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		const openQuantity = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('QUANTITY') > -1
		const ASSIST = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('ASSIST') > -1
		const BATCH = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('BATCH') > -1
		const SERIAL = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('SERIAL') > -1
		const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
		// const fromPage = inventoryCardState.getIn(['views', 'fromPage']) // 标识是存货卡片还是录入流水的新增
		const standardList = inventoryCardState.getIn(['views', 'standardList'])
		const customList = inventoryCardState.getIn(['views', 'customList'])
		const stockList = inventoryCardState.getIn(['views', 'stockList'])
		const serialModal = inventoryCardState.getIn(['views', 'serialModal'])
		const serialPlaceArr = inventoryCardState.getIn(['views', 'serialPlaceArr'])
		const curSerialList = inventoryCardState.getIn(['views', 'serialList'])
		const warehouseList = inventoryCardState.getIn(['views', 'warehouseList'])
		const selectedKeys = inventoryCardState.getIn(['views', 'selectedKeys'])
		const materialSelectedKeys = inventoryCardState.getIn(['views', 'materialSelectedKeys'])
		const MemberList = inventoryCardState.getIn(['views', 'MemberList'])
		const thingsList = inventoryCardState.getIn(['views', 'thingsList'])
		const showStockModal = inventoryCardState.getIn(['views', 'showStockModal'])
		const selectList = inventoryCardState.getIn(['views', 'selectList'])
		const selectItem = inventoryCardState.getIn(['views', 'selectItem'])
		const batchModal = inventoryCardState.getIn(['views', 'batchModal'])

		const allAssistClassificationList = inventoryCardState.getIn(['views', 'allAssistClassificationList'])
		const isFromOtherpage = fromPage !== 'inventoryConfig'
		if (isFromOtherpage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}

		const reserveTags = inventoryCardState.get('tags').filter(v => v.get('name') !== '全部')
		const insertOrModify = inventoryCardState.getIn(['views', 'insertOrModify'])
		const initOpenBatch = inventoryCardState.getIn(['views', 'initOpenBatch'])
		const cardTitle = insertOrModify === 'insert' ? `新增存货卡片` : `修改存货卡片`
		const inventoryCardTemp = inventoryCardState.get('inventoryCardTemp')
		const code = inventoryCardTemp.get('code')
		const name = inventoryCardTemp.get('name')
		const uuid = inventoryCardTemp.get('uuid')
		const warehousePriceMode = inventoryCardTemp.get('warehousePriceMode')
		const inventoryNature = inventoryCardTemp.get('inventoryNature')
		const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')
		const financialInfo = inventoryCardTemp.get('financialInfo') || fromJS({})
		const openAssist = inventoryCardTemp.getIn(['financialInfo','openAssist'])
		const openBatch = inventoryCardTemp.getIn(['financialInfo','openBatch'])
		const openShelfLife = inventoryCardTemp.getIn(['financialInfo','openShelfLife'])
		const shelfLife = inventoryCardTemp.getIn(['financialInfo','shelfLife'])
		const batchList = inventoryCardTemp.getIn(['financialInfo','batchList']) || fromJS([])
		const openSerial = inventoryCardTemp.getIn(['financialInfo','openSerial'])
		const serialList = inventoryCardTemp.getIn(['financialInfo','serialList']) || fromJS([])
		const assistClassificationList = inventoryCardTemp.getIn(['financialInfo', 'assistClassificationList']) || fromJS([])
		const isBatchUniform = inventoryCardTemp.getIn(['financialInfo', 'isBatchUniform'])
		const isUniform = assistClassificationList.every(v => v.get('isUniform'))

		const unit = inventoryCardTemp.get('unit') || fromJS({})
		const CurUnit = inventoryCardTemp.get('CurUnit') || fromJS({})
		const unitList = unit.get('unitList') || fromJS([])
		const openedQuantity = inventoryCardTemp.get('openedQuantity')
		const unitPriceList = inventoryCardTemp.get('unitPriceList')
		const opened = inventoryCardTemp.get('opened')
		const remark = inventoryCardTemp.get('remark')
		const openList = inventoryCardTemp.get('openList')
		const isAppliedSale = inventoryCardTemp.get('isAppliedSale')
		const isAppliedPurchase = inventoryCardTemp.get('isAppliedPurchase')
		const isAppliedProduce = inventoryCardTemp.get('isAppliedProduce')
		const categoryTypeList = inventoryCardTemp.get('categoryTypeList')
		const contacterInfo = inventoryCardTemp.get('contacterInfo')
		const isCheckOut = inventoryCardTemp.get('isCheckOut')
		const assemblySheet = inventoryCardTemp.get('assemblySheet') || fromJS({})
		const assemblyState = inventoryCardTemp.get('assemblyState')
		const materialList = assemblySheet.get('materialList') || fromJS([])
		const inventoryGoodsAcId = inventoryCardTemp.getIn(['defaultAc','inventoryGoodsAcId'])
		const inventoryGoodsAcName = inventoryCardTemp.getIn(['defaultAc','inventoryGoodsAcName'])
		const inventoryMaterialAcId = inventoryCardTemp.getIn(['defaultAc','inventoryMaterialAcId'])
		const inventoryMaterialAcName = inventoryCardTemp.getIn(['defaultAc','inventoryMaterialAcName'])
		const showConfirmModal = () => this.setState({confirmModal: true})
		const closeConfirmModal = () => this.setState({confirmModal: false})
		const beforeSave = (flag, closeModal) => {
			const checkList = [
				{
					type: 'stockName',
					value: name
				}, {
					type: 'code',
					value: code
				}, {
					type: 'remark',
					value: remark
				},
			]

			const success = (flag, closeModal) => {
				if (inventoryNature === '') {
					message.info('存货性质必选')
					return ;
				}
				// if (!isAppliedSale && !isAppliedPurchase) {
				// 	message.info('存货用途必选一项')
				// }
				let noCategoryChecked = true
				reserveTags.map((item,index) => {
					if(item.get('checked')){
						noCategoryChecked = false
					}
				})
				if (noCategoryChecked) {
					message.info('所属分类必选一项')
					return ;
				}
				let typeChoosed = false
				categoryTypeList.map((item,index) => {
					if (item.get('ctgyUuid') === '' || item.get('subordinateUuid') === '') {
						typeChoosed = true
					}
				})
				if (typeChoosed) {
					message.info('类别需要填写完整')
					return
				}
				if ((unitPriceList.filter(v => v.get('name') === unit.get('name') && v.get('type') == 1).size > 1
				|| unitPriceList.filter(v => v.get('name') === unit.get('name') && v.get('type') == 2).size > 1
				|| unitList.some(w => unitPriceList.filter(v => v.get('name') === w.get('name') && v.get('type') == 1).size >1)
				|| unitList.some(w => unitPriceList.filter(v => v.get('name') === w.get('name') && v.get('type') == 1).size >1)) && isOpenedQuantity) {
					message.info('同一个单位，默认采购价和默认销售价只能有一个')
					return
				}
				if (isOpenedQuantity && (unit.get('name') && unit.get('name').length > 6 || unitList.some(v => v.get('name') && v.get('name').length > 6))) {
					message.info('单位名称不可大于6个字符')
					return;
				}

				if ((assemblyState === 'OPEN' || assemblyState === 'INVALID') && !isOpenedQuantity) {
					this.setState({showCheckModal:true})
					return
				}
				if (materialList.some(v => v.get('materialUuid'))
				&& assemblySheet.get('unitUuid')
				&& assemblySheet.get('unitUuid') !== unit.get('uuid')
				&& unitList.every(v => v.get('uuid') !== assemblySheet.get('unitUuid'))) {
					message.info('组装单设置中，请重新选择成品的单位')
					return
				}
				if (isOpenedQuantity && openBatch && typeof isBatchUniform !== 'boolean') {
					message.info('请选择单价模式')
					return
				}
				dispatch(editInventoryCardActions.saveInventoryCard(fromPage, flag, closeModal, showConfirmModal, closeConfirmModal, isFromOtherpage))
			}
			jxcConfigCheck.beforeSaveCheck(checkList, () => success(flag, closeModal))
		}
		let lastIndex,nextIndex,curIndex
		if (insertOrModify === 'modify' && cardList.size) {
			curIndex = cardList.findIndex(v => v.get('code') === code)
			lastIndex = curIndex -1
			nextIndex = curIndex +1
		}
		return (
			<Modal
				className='inventory-addCard-modal'
				width={'800px'}
				visible={showModal}
				maskClosable={false}
				title={cardTitle}
				onCancel={() => closeModal()}
				footer={[
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('code') === code) === 0}
						onClick={() => {
							dispatch(editInventoryCardActions.beforeInventoryEditCard(cardList.get(lastIndex), () => {} , originTags,cardList.getIn([lastIndex,'assemblyState'])))
						}}
						>
					<Icon type='caret-left' />
					</Button>
					,
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('code') === code) === cardList.size -1 || !cardList.size}
						onClick={() => {
							dispatch(editInventoryCardActions.beforeInventoryEditCard(cardList.get(nextIndex), () => {}, originTags,cardList.getIn([nextIndex,'assemblyState'])))
						}}
					>
					<Icon type='caret-right' />
					</Button>,
					<Button
						key="cancel"
						type="ghost"
						onClick={() => closeModal()}>
						取 消
					</Button>,
					<Button
						key="ok"
						type={isFromOtherpage ? 'primary' : (insertOrModify == 'modify' ? 'primary' : 'ghost')}
						disabled={!editPermission}
						onClick={() => {
							beforeSave('insert', closeModal)
						}}
						>
						保 存
					</Button>,
					<Button
						key="addAndNew"
						type="primary"
						disabled={!editPermission}
						style={isFromOtherpage ? {display: 'none'} : {display: insertOrModify == 'modify' ? 'none' : 'inline-block'}}
						onClick={() => {
							beforeSave('insertAndNew')
						}}>
						保存并新增
					</Button>
				]}
			>
				<div className="jxc-config-card-modal-wrap">
					<div className='jxc-config-inventory-title' style={{display:(assemblyState === 'OPEN' || assemblyState === 'INVALID') && Psi?'':'none'}}>
						<span className={page === 'basic'?'active':'' } onClick={()=>{this.setState({page:'basic'})}}>基础设置</span>
						<span className={page === 'basic'?'':'active'} onClick={()=>{
							this.setState({page:'other'})
							// if (!unitList.size) {
							// 	dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitUuid'],unit.get('uuid')))
							// 	dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitName'],unit.get('name')))
							// }
						}}>
							组装单设置
						</span>
					</div>
					<div style={{display:page === 'other' && !['CLOSE','DISABLE'].includes(assemblyState)?'':'none',marginTop:10}}>
						<div className='inventory-content'>
							<div className='inventory-content-detail'>
								<span>投入物料</span>
								<span>数量</span>
								<span>单位</span>
							</div>
							{
								materialList.map((v,index) =>
									<div className='inventory-content-detail' key={index}>
										<span>
											<XfSelect
												combobox
												showSearch
												value={`${v.get('code')||''} ${v.get('name')||''}`}
												onChange={(value,options) => {
													const valueList = value.split(Limit.TREE_JOIN_STR)
													const cardUuid = valueList[0]
													const code = valueList[1]
													const name = valueList[2]
													dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList',index],fromJS({materialUuid:cardUuid,code,name})))
													dispatch(editInventoryCardActions.getInventorySettingOneCard(cardUuid,index))

												}}
												>
												{
													stockList.filter(v => v.get('code') !== code).map((v, i) => {
														return (
															<Option
																key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${i}`}
																priceList={v.get('unitPriceList')}
																unit={v.get('unit')}
																>
																	{`${v.get('code')} ${v.get('name')}`}
																</Option>
															)
													})
												}
											</XfSelect>
										</span>
										<span>
											<XfInput
												mode="number"
												tipTit="数量"
												placeholder='输入数量'
												value={v.get('quantity')}
												onChange={(e) => {
													let value = e.target.value
													// numberFourTest(e, (value) => {
														dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList',index,'quantity'], value))
													// })
												}}
											/>
										</span>
										<span>
											<XfSelect
												placeholder='单位'
												combobox
												showSearch
												dropdownClassName='auto-width'
												value={v.get('unitName') ?`${v.get('unitName')}`:undefined}
												onChange={value => {
													const valueList = value.split(Limit.TREE_JOIN_STR)
													const uuid = valueList[0]
													const name = valueList[1]
													dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList',index,'unitUuid'], uuid))
													dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList',index,'unitName'], name))
											}}
											>
												{
													(v.get('unitList') || []).map((v, i) => {
														return (
															<Option
																key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
																>
																	{`${v.get('name')}`}
																</Option>
														)
													})
												}
											</XfSelect>
										</span>
										<span>
											<XfIcon
												type="bigDel"
												theme="outlined"
												onClick={() => {
													if (materialList.size === 1) {
														dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList',0],fromJS({})))
													} else {
														dispatch(editInventoryCardActions.deleteMaterial(materialList, index))
													}
												}}
											/>
										</span>
									</div>
								)
							}
							<div className='inventory-button'>
								<Button
									onClick={() => {
										dispatch(editInventoryCardActions.addMaterial(materialList,materialList.size -1))
									}}
								>
										<XfIcon type='big-plus'/>添加存货明细
									</Button>
									<Button
										onClick={() => {
											dispatch(editInventoryCardActions.getInventoryAllCardList([],'showStockModal'))
										}}
									>
											<XfIcon type='editPlus'/>批量添加存货
									</Button>
							</div>
						</div>
						<div className='inventory-content'>
							<div className='inventory-content-detail'>
								<span>组装成品</span>
								<span>数量</span>
								<span>单位</span>

							</div>
								<div className='inventory-content-detail'>
									<span style={{borderBottom:'1px solid #d9d9d9',color: '#ccc'}}>
										{`${code||''} ${name||''}`}
									</span>
									<span>
										<XfInput
											mode="number"
											tipTit="数量"
											placeholder='输入数量'
											value={assemblySheet.get('quantity')}
											onChange={(e) => {
												let value = e.target.value
												// numberFourTest(e, (value) => {
													dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','quantity'], value))
												// })
											}}
										/>
									</span>
									<span>
										<Select
											placeholder='单位'
											combobox
											showSearch
											dropdownClassName='auto-width'
											value={assemblySheet.get('unitName') ?`${assemblySheet.get('unitName')}`:undefined}
											onChange={value => {
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const uuid = valueList[0]
												const name = valueList[1]
												dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitUuid'], uuid))
												dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','unitName'], name))
										}}
										>
											<Option
												key={unit.get('uuid')} value={`${unit.get('uuid')}${Limit.TREE_JOIN_STR}${unit.get('name')}`}
												>
													{`${unit.get('name')}`}
											</Option>
											{
												unitList.map((v, i) => {
													return (
														<Option
															key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
															>
																{`${v.get('name')}`}
															</Option>
													)
												})
											}
										</Select>
									</span>

								</div>
						</div>
					</div>
					<div style={{display:page === 'basic' || ['CLOSE','DISABLE'].includes(assemblyState) ?'':'none'}}>
						<div className="flex-row">
							<div className="flex-row-item">
								<label className="flex-row-label">编码：</label>
								<div className="flex-row-input">
									<XfInput
										style={{width:'100%'}}
										placeholder={'必填，支持数字和大小写英文，最长16个字符'}
										value={code}
										onChange={e => jxcConfigCheck.inputCheck('stockCode', e.target.value, () => dispatch(editInventoryCardActions.changeInventoryCardContent('code',e.target.value)))}
									/>
								</div>
							</div>
							<div className="flex-row-item">
								<label className="flex-row-label">名称：</label>
								<div className="flex-row-input">
									<XfInput
										style={{width:'100%'}}
										placeholder={'必填'}
										value={name}
										onChange={e => dispatch(editInventoryCardActions.changeInventoryCardContent('name', e.target.value))}
									/>
								</div>
							</div>
						</div>
						<div className="flex-row">
							<div className="flex-row-item">
								<label className="flex-row-label">存货性质：</label>
								<div className="flex-row-input">
									<RadioGroup
										onChange={(e) => {
											dispatch(editInventoryCardActions.changeInventoryCardNature('inventoryNature', e.target.value))
											if (e.target.value === 6) {
												dispatch(editInventoryCardActions.changeInventoryCardNature('inventoryAcId', inventoryMaterialAcId))
												dispatch(editInventoryCardActions.changeInventoryCardNature('inventoryAcName', inventoryMaterialAcName))
											} else {
												dispatch(editInventoryCardActions.changeInventoryCardNature('inventoryAcId', inventoryGoodsAcId))
												dispatch(editInventoryCardActions.changeInventoryCardNature('inventoryAcName', inventoryGoodsAcName))
											}
										}}
										value={inventoryNature}
									>
										<Radio key="a" value={5}>库存商品</Radio>
										<Radio key="b" value={6}>原材料</Radio>
									</RadioGroup>
								</div>
							</div>
						</div>
						<div className="jxc-config-card-modal-row" style={{marginTop:'10px'}}>
							<div className="jxc-config-card-modal-item">
								<label className="jxc-config-card-modal-label">所属分类：</label>
								<div className="jxc-config-card-modal-input">
									{
										reserveTags.map((item,index) => {
											return (
												<label key={index}>
													<Checkbox
														checked={item.get('checked')}
														onChange={(e)=> dispatch(editInventoryCardActions.changeInventoryCardCategoryStatus(item, e.target.checked))}
													/>
													<span>{item.get('name')}</span>
												</label>
											)
										})
									}
								</div>
							</div>
						</div>
						<div className="category-box">
							{
								reserveTags.map((item,index) =>{
									if(item.get('checked')){
										return (
											<div
												className="jxc-config-card-modal-row select-row-with-two"
												key={item.get('name')}
											>
												<div className="jxc-config-card-modal-item">
													<label className="jxc-config-card-modal-label">{item.get('name')}类别：</label>
													<div className="jxc-config-card-modal-input">
														<UpperClassSelect
															className='jxc-config-modal-select'
															placeholder={''}
															treeData={item.get('tree')? item.get('tree') : []}
															treeDefaultExpandAll={true}
															isLastSelect={true}
															disabledParent={true}
															value={item.get('selectUuid') ? [item.get('selectName')] : ['']}
															onSelect={value => {
																dispatch(editInventoryCardActions.changeInventoryCardCategoryType(item, value))
															}}
														/>
													</div>
												</div>
											</div>
										)
									} else {
										return null
									}
								})
							}
						</div>
						<div className="jxc-config-card-modal-row" style={isFromOtherpage ? {display: 'none'} : {clear:'both'}}>
							<div className="jxc-config-card-modal-item">
								<label className="jxc-config-card-modal-label">备注：</label>
								<div className="jxc-config-card-modal-input">
									<XfInput
										placeholder={placeholderText.remark}
										value={remark}
										onChange={e => dispatch(editInventoryCardActions.changeInventoryCardContent('remark', e.target.value))}
									/>
								</div>
							</div>
						</div>
						{
							isFromOtherpage && openQuantity || !isFromOtherpage?
							<div className="jxc-config-title" style={{marginBottom: 0,paddingBottom: '10px'}}>
								财务信息
							</div>:''
						}
						<div className="flex-row" style={{lineHeight:'28px'}}>
							{
								newJr && openQuantity?
								<div className="flex-row-item">
									{
										openQuantity?
										<div>
											<Checkbox
												style={{marginRight:'6px'}}
												checked={isOpenedQuantity}
												onChange={e => {
													dispatch(editInventoryCardActions.changeInventoryCardContent('isOpenedQuantity', !isOpenedQuantity))
													if (isOpenedQuantity) {
														dispatch(editInventoryCardActions.changeInventoryCardContent('warehousePriceMode', 'T'))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openAssist'], false))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openBatch'], false))
														dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openSerial'], false))
													} else {
														dispatch(editInventoryCardActions.changeInventoryCardContent('warehousePriceMode', 'U'))
														dispatch(editInventoryCardActions.getUnitCardList())
													}
												}}
											/>启用数量核算
										</div>:''
									}
									{
										isOpenedQuantity && SERIAL?
										<div>
											<Checkbox
												style={{marginRight:'6px'}}
												checked={openSerial}
												onChange={e => {
													dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openSerial'], !openSerial))
													if (!openSerial) {
														dispatch(editInventoryCardActions.emptyWarehouseListQuantity())
													}
												}}
											/>启用序列号管理
										</div>:''
									}
										<div style={{visibility: 'hidden'}}>
											<Checkbox
												style={{marginRight:'6px'}}
												checked={openSerial}
												onChange={e => {
													dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openSerial'], !openSerial))
												}}
											/>允许负库存
										</div>
								</div>:''
							}
							{
								isOpenedQuantity?
								<div className="flex-row-item">
									<label className="flex-row-label">计量单位：</label>
									<div className="flex-row-input" >
										<XfnSelect
											Type={'select'}
											dispatch={dispatch}
											disabled={insertOrModify === 'modify' && CurUnit.get('name')}
											selectListOne={standardList}
											selectListTwo={customList}
											onChange={({uuid,name,isStandard,unitList,unitQuantity,basicUnitUuid},option) => {
												unitList = unitList == 'undefined' || !unitList ? [] : JSON.parse(unitList)
												const { isCustom, basicStandardUnitQuantityList, basicStandardUnitUuidList } = option.props
												if (isCustom && basicStandardUnitUuidList.length) {
													basicUnitUuid = basicStandardUnitUuidList[0]
													unitQuantity = basicStandardUnitQuantityList[0]
													if (basicStandardUnitUuidList.length >= 2) {
														basicStandardUnitUuidList.slice(1).forEach((v,i) => {
															unitList[i].basicUnitUuid = v
															unitList[i].unitQuantity = basicStandardUnitQuantityList[i+1]
															if (v === basicStandardUnitUuidList[0]) {
																unitList[i].disabled = true
															}
														})
													}
												}
												dispatch(editInventoryCardActions.changeInventoryCardContent('unit',fromJS({uuid,name,isStandard,unitList,unitQuantity,basicUnitUuid})))
											}}
											onSwitch={() => {
												dispatch(editInventoryCardActions.initUnitState())
											}}
											name={`${unit.get('name')||''}${
												unitList.size?'(' + unit.get('name') + unitList.toJS().reduce((pre,cur) => pre += ':' + (cur.name || ''),''):''}${
													unitList.size?unitList.toJS().reduce((pre,cur) => pre += ':' + (cur.basicUnitQuantity || ''),'=1') + ')':''}`}
										/>
										<Button className='ant-btn-primary' style={{width:'55px',marginLeft:'10px',lineHeight: '28px'}} onClick={() => {
											this.setState({showAddModal:true})
											let newUnit = unit.toJS()
											if (newUnit.basicStandardUnitQuantity) {
												newUnit.unitQuantity = newUnit.basicStandardUnitQuantity
												newUnit.basicUnitUuid = newUnit.basicStandardUnitUuid
											}
											if (newUnit.unitList && newUnit.unitList.length) {
												newUnit.unitList.forEach((v,i) => {
													newUnit.unitList[i].unitQuantity = v.basicStandardUnitQuantity
													newUnit.unitList[i].basicUnitUuid = v.basicStandardUnitUuid
													if (v.basicStandardUnitUuid === newUnit.basicStandardUnitUuid) {
														newUnit.unitList[i].disabled = true
													}
												})
											}
											dispatch(editInventoryCardActions.changeInventoryCardContent('unit',fromJS(newUnit)))
											// dispatch(editInventoryCardActions.initUnitState())
										}}>{insertOrModify === 'modify' && CurUnit.get('name')?'修改':'多单位'}</Button>
									</div>
								</div>:''
							}
						</div>
						{
							enableWarehouse && newJr?
							<div className="flex-row">
								<div className="flex-row-item">
									<Checkbox
										style={{marginRight:'6px'}}
										checked={true}
										onClick={() => {
											message.info('账套已启用仓库核算')
										}}
									/>启用仓库核算
								</div>
								{
									enableWarehouse && isOpenedQuantity?
									<div className="flex-row-item">
										<label className="flex-row-label">单价模式</label>
										<div className="flex-row-input-nomal">
										<Select
											onChange={value => {
												dispatch(editInventoryCardActions.changeInventoryCardContent('warehousePriceMode', value))
											}}
											value={warehousePriceMode}
											>
											<Option key='1' value={'U'}>
												按全部仓库统一单价
											</Option>
											<Option key='2' value={'T'}>
												按一级仓库不同单价
											</Option>
											<Option key='3' value={'E'}>
												按不同仓库不同单价
											</Option>
										</Select>

										</div>
									</div>:''
								}
							</div>:''
						}
						<div className="flex-row">
							{
								isOpenedQuantity && newJr && ASSIST?
								<div className="flex-row-item">
									<Checkbox
										style={{marginRight:'6px'}}
										checked={openAssist}
										onChange={e => {
											dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openAssist'], !openAssist))
										}}
									/>启用辅助属性 {openAssist?<span className='assist-update' onClick={() => {

										dispatch(editInventoryCardActions.getAssistList('',() => {
											this.setState({assistModal:true})
										}))
									}} >编辑属性</span>:''}
								</div>:''
							}
							{
								openAssist && isOpenedQuantity?
								<div className="flex-row-item">
									<label className="flex-row-label">单价模式</label>
									<div className="flex-row-input-nomal">
									<Select
										onChange={value => {
											if (value[value.length -1] !== true) {
												dispatch(editInventoryCardActions.chooseAssitUniform(value.filter(v => v!== true),false))
											} else {
												dispatch(editInventoryCardActions.chooseAssitUniform(assistClassificationList.map(v => v.get('uuid')),true))
											}
										}}
										value={isUniform?[true]:assistClassificationList.filter(v => !v.get('isUniform')).map(v => v.get('uuid')).toJS()}
										mode={'multiple'}
										>
											<Option key='1' value={true}>
												按全部属性统一单价
											</Option>
											<OptGroup label={'按不同属性不同单价'}>
												{
													assistClassificationList.map(v =>
														<Option key={v.get('uuid')} value={v.get('uuid')}>
															不同{v.get('name')}不同单价
														</Option>
													)
												}
											</OptGroup>
									</Select>
								</div>
							</div>:''
						}
						</div>

						{
							openAssist && isOpenedQuantity?
							<div className='assist-content'>
								{
									assistClassificationList.size?
									assistClassificationList.map(v =>
										<div className='assist-item'>
											<span>{v.get('name')}：</span>
											{
												v.get('propertyList').map(v =>
													<Tag key={v.get('uuid')}>{v.get('name')}</Tag>
												)
											}
										</div>
									)
									:
									<div className='assist-item img-kongtaitu' >
										<div className=''></div>
										<div>暂无属性分类，请点击“编辑属性”新增分类</div>
									</div>
								}
							</div>:''
						}
						<div className="flex-row">
							{
								isOpenedQuantity && newJr && BATCH?
								<div className="flex-row-item">
									<div>
										<Checkbox
										style={{marginRight:'6px'}}
										checked={openBatch}
										onChange={e => {
											dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openBatch'], !openBatch))
											if (openBatch) {
												dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openShelfLife'], false))
											}
										}}
										/>启用批次管理
									</div>
									{
										openBatch?
										<div>
											<Checkbox
											style={{marginRight:'6px'}}
											checked={openShelfLife}
											onChange={e => {
												if (batchList.size) {
													message.info('请删除原有批次')
													return
												}
												dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','openShelfLife'], !openShelfLife))
											}}
										/>启用保质期管理
									</div>:<div></div>
									}
									{
										openShelfLife?
										<div>
											<XfInput
												tipTit={'保质期'}
												mode="integer"
												style={{width:'107px'}}
												placeholder={`请输入保质期天数`}
												value={shelfLife}
												onChange={e => {
													let value = e.target.value
													dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','shelfLife'], value))
												}}
												disabled={isCheckOut}
											/>
										</div>: <div></div>
									}
								</div>:''
							}
							{
								openBatch && isOpenedQuantity?
								<div className="flex-row-item">
									<label className="flex-row-label">单价模式</label>
									<div className="flex-row-input-nomal">
									<Select
										onChange={value => {
											dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','isBatchUniform'], value))
										}}
										value={isBatchUniform}
										>
											<Option key='1' value={true}>
												按全部批次统一单价
											</Option>
											<Option key='2' value={false}>
												按不同批次不同单价
											</Option>

									</Select>
								</div>
							</div>:''
						}
						</div>
						<div className="flex-row" style={isFromOtherpage && !unitList.size || enableWarehouse && !isOpenedQuantity? {display: 'none'} : {}}>

							{
								!enableWarehouse && !openBatch && !openAssist && !openSerial?
								<div className="flex-row-item">
									<label className="flex-row-label">期初余额：</label>
									<div className="flex-row-input">
										{
											enableWarehouse?
											<XfInput
												mode="number"
												style={{width:'250px'}}
												placeholder={`${isOpenedQuantity && warehousePriceMode === 'U'?'必填':'选填'}，请输入金额`}
												value={opened}
												onChange={e => {
													let value = e.target.value
													// numberFourTest(e, (value) => {
														dispatch(editInventoryCardActions.changeInventoryCardContent('opened', value))
													// })
												}}
												disabled={isCheckOut}
											/>
											:
											// <NumberInput
											// 	type="regAmount"
											// 	style={{width:'250px'}}
											// 	placeholder={`选填，请输入金额`}
											// 	value={opened}
											// 	onChange={value => dispatch(editInventoryCardActions.changeInventoryCardContent('opened', value))}
											// />
											<XfInput
												negativeAllowed={true}
												mode="amount"
												style={{width:'250px'}}
												placeholder={`选填，请输入金额`}
												value={opened}
												onChange={e => {
													let value = e.target.value
													dispatch(editInventoryCardActions.changeInventoryCardContent('opened', value))
												}}
												disabled={isCheckOut}
											/>
										}

									</div>
								</div>:''
							}
							{
								isOpenedQuantity && !enableWarehouse && !openBatch && !openAssist && !openSerial?
								<div className="flex-row-item">
									<label className="flex-row-label">期初数量：</label>
									<div className="flex-row-input">
										<XfInput
											mode="number"
											tipTit="数量"
											placeholder="选填，请输入数量"
											value={openedQuantity}
											onChange={e => {
												let value = e.target.value
												// numberFourTest(e, (value) => {
													dispatch(editInventoryCardActions.changeInventoryCardContent('openedQuantity', value))
												// })
											}}
											disabled={isCheckOut}
										/>
										<span style={{marginLeft:'10px'}}>
											{unit.get('name')}
										</span>
									</div>
								</div>:''
							}
						</div>
						{
							enableWarehouse || openBatch || openAssist || openSerial?
							<div style={{display:'flex',marginTop:'10px'}}>
								{
									enableWarehouse?
									<WarehouseTable
										dispatch={dispatch}
										warehousePriceMode = {warehousePriceMode}
										isOpenedQuantity={isOpenedQuantity}
										enableWarehouse={enableWarehouse}
										treeList={openList}
										unit={unit}
										isCheckOut={isCheckOut}
										assistClassificationList={assistClassificationList}
										batchList={batchList}
										uuid={uuid}
										financialInfo={financialInfo}
										showWarehouseModal={() => this.setState({showWarehouseModal:true})}
									/>
									:
									<OpenQuantityTable
										dispatch={dispatch}
										warehousePriceMode = {warehousePriceMode}
										isOpenedQuantity={isOpenedQuantity}
										enableWarehouse={enableWarehouse}
										treeList={openList}
										unit={unit}
										isCheckOut={isCheckOut}
										assistClassificationList={assistClassificationList}
										batchList={batchList}
										uuid={uuid}
										financialInfo={financialInfo}
										insertOrModify={insertOrModify}
										showWarehouseModal={() => this.setState({showWarehouseModal:true})}
									/>

								}

							</div>:''
						}

						{
							isOpenedQuantity?
							<div>
								<div className="flex-row" >
									{
										unitPriceList.map((v,i) =>
											v.get('type') === 1?
											<div className="flex-row-item">
												<label className="flex-row-label">{{1:'默认采购价：',2:'默认销售价：'}[v.get('type')]}</label>
												<div className="flex-row-input" style={{display:'flex'}}>
													<XfInput
														mode="number"
														style={{width:'140px'}}
														placeholder="选填，请输入金额"
														value={v.get('defaultPrice')}
														onChange={e => {
															let value = e.target.value
															// numberFourTest(e, (value) => {
															dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'defaultPrice'],value))
														// })
														}}
													/>
													{
														unitList.size?
															<div>
																<span style={{margin:'0 4px 0 2px'}}>元/</span>
																<Select
																	style={{width:'78px'}}
																	onChange={(value) => {
																		const valueList = value.split(Limit.TREE_JOIN_STR)
																		const unitUuid = valueList[0]
																		const name = valueList[1]
																		const isStandard = valueList[2]
																		dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'unitUuid'],unitUuid))
																		dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'name'],name))
																	}}
																	value={v.get('name')}
																>
																	<Option key={unit.get('uuid')} value={`${unit.get('uuid')}${Limit.TREE_JOIN_STR}${unit.get('name')}${Limit.TREE_JOIN_STR}${unit.get('isStandard')}`}>{unit.get('name')}</Option>
																	{
																		unitList.map(v =>
																			<Option key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isStandard')}`}>{v.get('name')}</Option>
																		)
																	}
																</Select>
															</div>
															:
															unit.get('name')?<span style={{marginLeft:'5px'}}>{`元/${unit.get('name')}`}</span>:''
													}
													{
														unitList.size?
														<div className='pre-content'>
															<XfnIcon type='bigPlus'
																style={unitPriceList.filter(w => w.get('type') === v.get('type')).size === 1?{lineHeight:'28px',fontSize:'15px'}:{}}
																onClick={() => {
																	dispatch(editInventoryCardActions.addUnitPrice(unitPriceList,i,v.get('type')))
																}}
															/>
															{
																unitPriceList.filter(w => w.get('type') === v.get('type')).size > 1 ?
																<XfnIcon type='bigDel' onClick={() => {
																	dispatch(editInventoryCardActions.deleteunitPrice(unitPriceList,i))
																}}/>:''
															}
														</div>:''
													}
												</div>
											</div>:''
										)
									}
								</div>
								<div className="flex-row" >
									{
										unitPriceList.map((v,i) =>
										v.get('type') === 2?
											<div className="flex-row-item">
												<label className="flex-row-label">{{1:'默认采购价：',2:'默认销售价：'}[v.get('type')]}</label>
												<div className="flex-row-input" style={{display:'flex'}}>
													<XfInput
														mode="number"
														tipTit="数量"
														style={{width:'140px'}}
														placeholder="选填，请输入金额"
														value={v.get('defaultPrice')}
														onChange={e => {
															let value = e.target.value
															// numberFourTest(e, (value) => {
															dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'defaultPrice'],value))
														// })
														}}
													/>
													{
														unitList.size?
															<div>
																<span style={{margin:'0 4px 0 2px'}}>元/</span>
																<Select
																	style={{width:'78px'}}
																	onChange={(value) => {
																		const valueList = value.split(Limit.TREE_JOIN_STR)
																		const unitUuid = valueList[0]
																		const name = valueList[1]
																		const isStandard = valueList[2]
																		dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'unitUuid'],unitUuid))
																		dispatch(editInventoryCardActions.changeInventoryCardContent(['unitPriceList',i,'name'],name))
																	}}
																	value={v.get('name')}
																>
																	<Option key={unit.get('uuid')} value={`${unit.get('uuid')}${Limit.TREE_JOIN_STR}${unit.get('name')}${Limit.TREE_JOIN_STR}${unit.get('isStandard')}`}>{unit.get('name')}</Option>
																	{
																		unitList.map(v =>
																			<Option key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isStandard')}`}>{v.get('name')}</Option>
																		)
																	}
																</Select>
															</div>
															:
															unit.get('name')?<span style={{marginLeft:'5px'}}>{`元/${unit.get('name')}`}</span>:''
													}
													{
														unitList.size?
														<div className='pre-content'>
															<XfnIcon type='bigPlus'
																style={unitPriceList.filter(w => w.get('type') === v.get('type')).size === 1?{lineHeight:'28px',fontSize:'15px'}:{}}
																onClick={() => {
																	dispatch(editInventoryCardActions.addUnitPrice(unitPriceList,i,v.get('type')))
																}}
															/>
															{
																unitPriceList.filter(w => w.get('type') === v.get('type')).size > 1 ?
																<XfnIcon type='bigDel' onClick={() => {
																	dispatch(editInventoryCardActions.deleteunitPrice(unitPriceList,i))
																}}/>:''
															}
														</div>:''
													}
												</div>
											</div>:''
										)
									}
									</div>
							</div>
							:''
						}
						<div className={'modalBomb'} style={{display:confirmModal ? '' : 'none'}}>
						</div>
					</div>
				</div>
				{
					showAddModal?
					<AddUnitModal
						dispatch={dispatch}
						inventoryCardState={inventoryCardState}
						enableWarehouse={enableWarehouse}
						showAddModal={showAddModal}
						insertOrModify={insertOrModify === 'modify' && CurUnit.get('name')?'modify':'insert'}
						closeAddModal={() => this.setState({showAddModal:false})}
					/>:''
				}
				<WarehouseTreeModal
					treeList={warehouseList}
					inventoryCardState={inventoryCardState}
					showWarehouseModal={showWarehouseModal}
					onClose={() => this.setState({showWarehouseModal:false})}
					dispatch={dispatch}
					selectedKeys={selectedKeys}
				/>
				<MultipleModal
                    MemberList={MemberList}
                    thingsList={thingsList}
                    dispatch={dispatch}
                    showModal={showStockModal}
                    selectList={selectList}
                    selectItem={selectItem}
                    materialSelectedKeys={materialSelectedKeys}
					materialList={materialList}
					code={code}
                />
				{
					assistModal?
					<AssistModal
						onClose={() => this.setState({assistModal:false})}
						dispatch={dispatch}
						assistModal={assistModal}
						uuid={inventoryCardTemp.get('uuid')}
						allAssistClassificationList={allAssistClassificationList}
						assistClassificationList={assistClassificationList}
					/>:''
				}

				<Modal
					visible={showCheckModal}
					title={'关闭数量核算'}
					onOk={() => {
						dispatch(editInventoryCardActions.saveInventoryCard(fromPage, 'modify', closeModal, showConfirmModal, closeConfirmModal, isFromOtherpage))
						this.setState({showCheckModal:false})
					}}
					onCancel={()=> this.setState({showCheckModal:false})}
					>
					<span>关闭数量核算，不可使用组装功能，组装单设置内容将被置空</span>
				</Modal>
				<BatchModal
					visible={batchModal}
					onClose={() => {
						dispatch(editInventoryCardActions.changeInventoryCardViews('batchModal',false))
					}}
					onOk={(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate) => {
                        if (insertOrModify === 'insert' || !initOpenBatch) {
                            const index = batchList.findIndex(v => v.get('batch') === this.state.batch)
                            dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','batchList',index,'batch'],modifyBatch))
                            dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','batchList',index,'productionDate'],openShelfLife?modifyBatchDate:''))
                            dispatch(editInventoryCardActions.changeInventoryCardViews('batchModal',false))
                        } else {
                            dispatch(editInventoryCardActions.modifyBatch(modifyBatch,modifyBatchUuid,openShelfLife?modifyBatchDate:'',modifyExpirationDate,uuid,() => {
                                dispatch(editInventoryCardActions.changeInventoryCardViews('batchModal',false))
                            }))
                        }
					}}
					onOkAndNew={(modifyBatch,modifyBatchUuid,modifyBatchDate,modifyExpirationDate) => {
						if (insertOrModify === 'insert' || !initOpenBatch) {
							const index = batchList.findIndex(v => v.get('batch') === this.state.batch)
							dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','batchList',index,'batch'],modifyBatch))
							dispatch(editInventoryCardActions.changeInventoryCardContent(['financialInfo','batchList',index,'productionDate'],openShelfLife?modifyBatchDate:''))
							this.setState({modifyBatch:'',modifyBatchDate:new DateLib().toString(),modifyBatchUuid:'',batch:''})
						} else {
							dispatch(editInventoryCardActions.modifyBatch(modifyBatch,modifyBatchUuid,openShelfLife?modifyBatchDate:'',modifyExpirationDate,uuid,() => {
								this.setState({modifyBatch:'',modifyBatchDate:new DateLib().toString(),modifyBatchUuid:'',batch:''})
							}))
						}
					}}
					batchList={batchList}
					openShelfLife={openShelfLife}
					shelfLife={shelfLife}
					insertOrModify={insertOrModify}
				/>
				{
					serialModal?
					<SerialModal
						fromPage='inventory'
						visible={serialModal}
						serialList={curSerialList}
						onClose={() => dispatch(editInventoryCardActions.changeInventoryCardViews('serialModal',false))}
						onOk={curSerialList => {
							dispatch(editInventoryCardActions.changeInventoryCardContent([...serialPlaceArr,'serialList'],fromJS(curSerialList)))
							dispatch(editInventoryCardActions.changeInventoryCardContent([...serialPlaceArr,'isModify'],true))
							dispatch(editInventoryCardActions.changeInventoryCardContent([...serialPlaceArr,'openedQuantity'],curSerialList.length))
						}}
					/>:''
				}

			</Modal>
		)
	}
}

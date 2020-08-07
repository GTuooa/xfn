import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import XfnSelect from './XfnSelect'
import { UpperClassSelect, SelectAc, NumberInput, XfnIcon } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, Radio, Tooltip } from 'antd'
import { Icon } from 'app/components'
const { Option, OptGroup } = Select
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

@connect(state => state)
export default
class AddCardModal extends React.Component {
	state={
		unitList:(this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']) && this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']).size ? this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']) : fromJS([{amount:'',uuid:''}])).toJS(),
		uuid:this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','uuid']),
		name:this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','name']),
		isStandard:this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','isStandard']),
		basicUnitUuid:this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','basicUnitUuid']),
		unitQuantity:this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitQuantity']),
		basicUnitQuantity:'',
		canEdit:true,
		relateBoth:'',
		allowSave:false,
		changeUnit:false,
		oldUnit:fromJS({})
	}
	initState() {
		this.setState({
			unitList:[{amount:'',uuid:''}],
			uuid:'',
			name:'',
			isStandard:false,
			basicUnitUuid:'',
			unitQuantity:'',
			basicUnitQuantity:'',
			canEdit:true,
			relateBoth:'',
			allowSave:false,
			changeUnit:false,
			oldUnit:fromJS({})
		})
	}
	beforeSaveCheck() {
		const { inventoryCardState, insertOrModify } = this.props
		const { unitList, name, oldUnit, uuid, unitQuantity, basicUnitQuantity, isStandard, basicUnitUuid } = this.state
		const standardList = inventoryCardState.getIn(['views', 'standardList'])
		if (!name) {
			message.info('基本单位必填')
			return false
		}
		if (unitList.some(v => v.basicUnitQuantity <= 1)) {
			message.info(`多单位关系必须大于1`)
			return false
		}
		if (unitList.some(v => !v.basicUnitQuantity || !v.name)) {
			message.info(`多单位填写完整`)
			return false
		}
		if (unitList.some(v => unitList.filter(w => w.name === v.name).length > 1) || unitList.filter(w => w.name === name).length > 0 ) {
			message.info(`同一存货的单位组中，不支持两个单位名称相同`)
			return false
		}
		if (unitList.some(v => unitList.filter(w => w.basicUnitQuantity == v.basicUnitQuantity).length > 1)) {
			message.info(`同一存货的单位组中，不支持与基本单位重复数量比的多单位`)
			return false
		}
		if (insertOrModify === 'modify' && JSON.parse(isStandard || 'false') && JSON.parse(oldUnit.get('isStandard') || 'false')) {
			const oldBasicUnitQuantity = standardList.find(w => w.get('uuid') === oldUnit.get('uuid')).get('basicUnitQuantity') || 0
			const prepare = Number(basicUnitQuantity || 0).toFixed(4)
			const prepareBasic = (Number(oldBasicUnitQuantity)/Number(unitQuantity || 0)).toFixed(4)
			if (prepare !== prepareBasic && basicUnitUuid === oldUnit.get('basicUnitUuid')) {
				message.info(`新旧基本单位关系错误`)
				return false
			}
		}
		return unitList.every((v,i) => unitList.every((w,ii) => {
			const prepare = (Number(v.unitQuantity || 0)/Number(w.unitQuantity || 0)).toFixed(4)
			const prepareBasic = (Number(v.basicUnitQuantity || 0)/Number(w.basicUnitQuantity || 0)).toFixed(4)
			if (v.basicUnitUuid  && v.basicUnitUuid === w.basicUnitUuid && i !== ii && prepare !== prepareBasic) {
				message.info(`多单位${i+1}和多单位${ii+1}关系错误`)
				return false
			}
			return true
		}))

	}
	render() {
		const {
			dispatch,
			// type,  // 录入流水用
			// inventoryConfState,
			inventoryCardState,
			homeState,
			enableWarehouse,
			showAddModal,
			closeAddModal,
			insertOrModify
		} = this.props
		const { unitList, uuid, name, isStandard, canEdit, allowSave, oldUnit, basicUnitQuantity, changeUnit, basicUnitUuid, unitQuantity } = this.state
		const fromPage = inventoryCardState.getIn(['views', 'fromPage']) // 标识是存货卡片还是录入流水的新增
		const standardList = inventoryCardState.getIn(['views', 'standardList'])
		const customList = inventoryCardState.getIn(['views', 'customList'])
		const inventoryCardTemp = inventoryCardState.get('inventoryCardTemp')
		const inventoryNature = inventoryCardTemp.get('inventoryNature')
		const isOpenedQuantity = inventoryCardTemp.get('isOpenedQuantity')
		const unitPriceList = inventoryCardTemp.get('unitPriceList')
		const unit = inventoryCardTemp.get('unit') || fromJS({})
		const CurUnit = inventoryCardTemp.get('CurUnit') || fromJS({})
		return (
			<Modal
				destroyOnClose
				className={`add-unit ${!allowSave && insertOrModify === 'modify'?'add-unit-disabled':''}`}
				width={'500px'}
				visible={showAddModal}
				maskClosable={false}
				title={`${insertOrModify === 'insert'?'新增':'修改'}单位`}
				okText={'保存'}
				onCancel={() => {
					closeAddModal()
					this.initState()
				}}
				onOk={() => {
					if (!allowSave && insertOrModify === 'modify') return;
					if (this.beforeSaveCheck()) {
						closeAddModal()
						this.initState()
						let newUnitPriceList = unitPriceList.toJS().filter(v =>
							name === v.name|| unitList.some(w => w.name === v.name)
						)
						if (!newUnitPriceList.some(v => v.type === 1)) {
							newUnitPriceList = newUnitPriceList.concat([{type:1}])
						}
						if (!newUnitPriceList.some(v => v.type === 2)) {
							newUnitPriceList = newUnitPriceList.concat([{type:2}])
						}
						dispatch(editInventoryCardActions.changeInventoryCardContent('unitPriceList',fromJS(newUnitPriceList)))
						dispatch(editInventoryCardActions.changeInventoryCardContent('unit',fromJS({
							uuid,
							name,
							isStandard,
							basicUnitQuantity,
							unitList,
							changeUnit,
							basicUnitUuid,
							unitQuantity
						})
						))
					}

				}}
			>
				<div>
					<div className='modal-flex'>
						{
							canEdit?
								<div className="modal-item" >
									<label>基本单位：</label>
									<div className="modal-input">
										<XfnSelect
											style={{width:'calc(100% - 75px)'}}
											disabled={canEdit && insertOrModify === 'modify'}
											selectListOne={standardList}
											selectListTwo={customList.filter(v => !(v.get('unitList') && v.get('unitList').size))}
											onChange={({uuid,name,isStandard,basicUnitUuid,unitQuantity}) => {
												this.setState({
													uuid,
													name,
													isStandard,
													basicUnitUuid,
													unitQuantity,
													unitList:unitList.map(v => {
														v.disabled = false
														return v
													})
												})
												if (String(isStandard) == 'true') {
													let initUnitList = unitList.map(v => {
														v.name = ''
														v.basicUnitQuantity = ''
														return v
													})
													this.setState({unitList:initUnitList})
												}
											}}
											onSwitch={() => {
												this.setState({
													uuid:'',
													name:'',
													isStandard:false
												})
											}}
											name={insertOrModify === 'modify' ? unit.get('name') : name }
										/>
										{
											insertOrModify === 'modify'?
											<XfnIcon type='config-edit'
												onClick={() => {
													this.setState({
														canEdit:false,
														oldUnit:unit,
														name:'',
														changeUnit:true,
														unitList:(this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']) && this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']).size ? this.props.inventoryCardState.getIn(['inventoryCardTemp', 'unit','unitList']) : fromJS([])).toJS(),
													})

												}}
											/>
											:''
										}
										{/* {
											insertOrModify === 'insert'?
												<Switch
													className="use-unuse-style"
													style={{marginLeft:'.4rem'}}
													checked={unitList.length}
													checkedChildren={'多单位'}
													unCheckedChildren={'多单位'}
													onChange={() => {
														this.setState({
															unitList:unitList.length?[]:[{}]
														})
													}}
												/>
											:''
										} */}

								</div>
						</div>
						:
						<div style={{flex:1}}>
							<div className="modal-flex" >
								<span className="modal-item">原基本单位</span>
								<span className="modal-item">新基本单位</span>
								<span className="modal-item">数量关系</span>
								<span style={{maxWidth:'70px'}}></span>
							</div>
							<div className="modal-flex" >
								<div className="modal-input-content">
									<span>{oldUnit.get('name')}&nbsp;&nbsp;=&nbsp;&nbsp;</span>
									<XfnSelect
										disabled={canEdit && insertOrModify === 'modify'}
										selectListOne={standardList}
										selectListTwo={customList.filter(v => !(v.get('unitList') && v.get('unitList').size))}
										onChange={({uuid,name,isStandard,basicUnitUuid,unitQuantity}) => {
											this.setState({
												uuid,
												name,
												isStandard,
												basicUnitUuid,
												unitQuantity,
												unitList:unitList.map(v => {
													v.disabled = false
													return v
												})
											})
											if (isStandard != 'false') {
												let initUnitList = unitList.map(v => {
													v.name = ''
													v.basicUnitQuantity = ''
													return v
												})
												this.setState({unitList:initUnitList})
											}
										}}
										onSwitch={() => {
											this.setState({
												uuid:'',
												name:'',
												isStandard:false
											})
										}}
										name={name}
									/>
									&nbsp;&nbsp;*&nbsp;&nbsp;
									<NumberInput
										type='count4'
										placeholder='请输入数量值'
										value={basicUnitQuantity}
										onChange={(value) => {
											this.setState({
												basicUnitQuantity:value
											})
										}}
									/>
									<Switch
										className="use-unuse-style"
										style={{marginLeft:'.4rem'}}
										checked={unitList.length}
										checkedChildren={'多单位'}
										unCheckedChildren={'多单位'}
										onChange={() => {
											this.setState({
												unitList:unitList.length?[]:[{}]
											})
										}}
									/>
								</div>
							</div>
						</div>
					}
				</div>
				{
					unitList.length?
					<div className='multi-unit-content'>

						{
							unitList.map((v,i) =>
								<div className={'multi-unit'}>
									<span>多单位{i+1}：</span>
									<XfnSelect
										selectListOne={standardList}
										selectListTwo={customList.filter(v => !(v.get('unitList') && v.get('unitList').size))}
										onChange={({uuid,name,isStandard,basicUnitUuid,unitQuantity}) => {
											let data = unitList
											if (isStandard == 'true' && basicUnitUuid == this.state.basicUnitUuid) {
												const basicBasicUnitQuantity = Number(this.state.unitQuantity || 0)
												const multiBasicUnitQuantity = Number(unitQuantity || 0)
												if (basicBasicUnitQuantity < multiBasicUnitQuantity) {
													data[i] = {
														uuid,
														name,
														isStandard,
														basicUnitQuantity:parseInt(multiBasicUnitQuantity/basicBasicUnitQuantity),
														disabled:true,
														unitQuantity
													}
													this.setState({
														unitList:data
													})
												} else {
													message.info('数量关系必须大于1')
												}
											} else {
												data[i] = {uuid,name,isStandard,basicUnitUuid,unitQuantity,basicUnitQuantity:v.basicUnitQuantity}
												this.setState({
													unitList:data
												})
											}
										}}
										onSwitch={() => {
											let data = unitList
											data[i] = {uuid:'',name:'',isStandard:false}
											this.setState({
												unitList:data
											})
										}}
										name={v.fullName || v.name}
									/>
									<span>&nbsp;= &nbsp;{name} &nbsp;* &nbsp;&nbsp;</span>
									<NumberInput
										type='count'
										placeholder='请输入数量值'
										value={v.basicUnitQuantity}
										disabled={v.disabled}
										onChange={(value) => {
											let data = unitList
											data[i].basicUnitQuantity = value
											this.setState({
												unitList:data
											})
										}}
									/>
									{
										unitList.length > 1 || insertOrModify === 'modify'?
										<XfnIcon type='bigDel'
											onClick={() => {
												unitList.splice(i,1)
												this.setState({unitList:unitList})
											}}
										/>:''
									}

								</div>
							)
						}

					</div>:''
				}
				{
					unitList.length || insertOrModify === 'modify' && canEdit?
					<div style={{marginBottom:'10px'}}>
						<Tooltip title={unitList.length>=2?'单位组最多3级单位':''}>
							<span style={{cursor:'pointer',color:unitList.length>=2?'#ccc':'#1eb6f8'}} onClick={() => {
								if (unitList.length>=2) {
									return;
								}
								unitList.push({amount:'',uuid:''})
								this.setState({unitList:unitList})
							}}><Icon type='plus' />增加单位</span>
						</Tooltip>
					</div>:''
				}
				{
					insertOrModify === 'modify'?
					<div>
						<Checkbox onChange={(e) => {
							this.setState({allowSave:e.target.checked})
						}}>所有历史单据中，该商品的单位将统一转换为基本单位</Checkbox>
					</div>:''
				}
			</div>
			</Modal>
		)
	}
}

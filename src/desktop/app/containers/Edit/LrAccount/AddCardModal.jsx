import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './style/common.less'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, Radio } from 'antd'
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

import { toJS } from 'immutable'
import * as inventorySettingAction from 'app/redux/Config/baseConf/inventorySetting/inventorySetting.action.js'

@immutableRenderDecorator
export default
class AddCardModal extends React.Component {
	constructor() {
		super()
		this.state = {
            confirmModal : false
        }
	}
	componentDidMount(){
		this.props.dispatch(lrAccountActions.inventorySettingInit())
	}
	render() {

		const {
			dispatch,
			showModal,
			closeModal,
			lrAclist,
			lrAccountState,
			simplifyStatus,
			stockRange
		} = this.props

		const {confirmModal} = this.state

		const reserveTags = lrAccountState.get('tagsStock').delete(0)
		const activeTapKey = lrAccountState.get('activeTapKey')
		const insertOrModify = lrAccountState.getIn(['inventorySettingCard','insertOrModify'])
		const cardTitle = insertOrModify === 'insert' ? `新增存货卡片` : `修改存货卡片`
		const inventorySettingCard = lrAccountState.get('inventorySettingCard')
		const code = inventorySettingCard.get('code')
		const name = inventorySettingCard.get('name')
		const inventoryNature = inventorySettingCard.get('inventoryNature')
		const inventoryAcName = inventorySettingCard.get('inventoryAcName')
		const inventoryAcId = inventorySettingCard.get('inventoryAcId')
		const opened = inventorySettingCard.get('opened')
		const remark = inventorySettingCard.get('remark')
		const isAppliedSale = inventorySettingCard.get('isAppliedSale')
		const isAppliedPurchase = inventorySettingCard.get('isAppliedPurchase')
		const isAppliedProduce = inventorySettingCard.get('isAppliedProduce')
		const categoryTypeList = inventorySettingCard.get('categoryTypeList')
		const contacterInfo = inventorySettingCard.get('contacterInfo')
		const isCheckOut = inventorySettingCard.get('isCheckOut')

		const beforeSave = (flag,closeModal) => {
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

			const success = (flag,closeModal) => {
				if(inventoryNature === ''){
					message.info('存货性质必选')
					return ;
				}
				// if(inventoryAcId === '' && simplifyStatus){
				// 	message.info('存货科目必选')
				// 	return ;
				// }
				// if(!isAppliedSale && !isAppliedPurchase){
				// 	message.info('存货用途必选一项')
				// }
				let noCategoryChecked = true
				reserveTags.map((item,index) =>{
					if(item.get('checked')){
						noCategoryChecked = false
					}
				})
				if(noCategoryChecked){
					message.info('所属分类必选一项')
					return ;
				}
				let typeChoosed = false
				categoryTypeList.map((item,index) =>{
					if(item.get('ctgyUuid') === '' || item.get('subordinateUuid') === ''){
						typeChoosed = true
					}
				})
				if(typeChoosed){
					message.info('类别需要填写完整')
					return ;
				}
				const showConfirmModal = () => this.setState({confirmModal:true})
				const closeConfirmModal = () => this.setState({confirmModal:false})
				dispatch(lrAccountActions.saveCard(flag,closeModal,showConfirmModal,closeConfirmModal,stockRange))
			}
			jxcConfigCheck.beforeSaveCheck(checkList, () => success(flag,closeModal))
		}

		return (
			<Modal
				width={'820px'}
				visible={showModal}
				maskClosable={false}
				title={cardTitle}
				onCancel={() => closeModal()}
				className='stock-contacts'
				footer={[
					<Button
						className="footer-btn"
						key="cancel"
						type="ghost"
						onClick={() => closeModal()}>
						取 消
					</Button>,
					<Button
						className="footer-btn"
						key="ok"
						type={'ghost'}
						onClick={() => {
							beforeSave('insert',closeModal)
						}}
						>
						保 存
					</Button>,
					// <Button
					// 	key="addAndNew"
					// 	type="primary"
					// 	style={{display: insertOrModify == 'insert' ? 'inline-block' : 'none'}}
					// 	onClick={() => {
					// 		beforeSave('insertAndNew')
					// 	}}>
					// 	保存并新增
					// </Button>
				]}
			>
				<div className="jxc-config-card-modal-wrap">
					<div className="jxc-config-card-modal-row">
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">编码：</label>
							<div className="jxc-config-card-modal-input">
								<Input
									placeholder={placeholderText.cardCode}
									value={code}
									onChange={e => jxcConfigCheck.inputCheck('cardCode', e.target.value,() => dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','code'],e.target.value)))}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">名称：</label>
							<div className="jxc-config-card-modal-input">
								<Input
									placeholder={placeholderText.name}
									value={name}
									onChange={e => dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','name'], e.target.value))}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-card-modal-row">
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">存货性质：</label>
							<div className="jxc-config-card-modal-input">
								<RadioGroup
									onChange={(e) => {
										dispatch(lrAccountActions.changeCardNature('inventoryNature', e.target.value))
										if (e.target.value === 6) {
											dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','inventoryAcId'], '1403'))
											dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','inventoryAcName'], '原材料'))
										} else {
											dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','inventoryAcId'], '1405'))
											dispatch(lrAccountActions.changeLrAccountOutString(['inventorySettingCard','inventoryAcName'], '库存商品'))
										}
									}}
									value={inventoryNature}
								>
									{/* <Radio key="a" value={1}>原料</Radio>
									<Radio key="b" value={2}>半成品</Radio>
									<Radio key="b" value={3}>产品</Radio> */}
									<Radio key="a" value={5}>库存商品</Radio>
									<Radio key="b" value={6}>原材料</Radio>
								</RadioGroup>
								{/* <Select
									style={{width:'100%'}}
									value={inventoryNature}
									onChange={(value) => dispatch(lrAccountActions.changeCardNature('inventoryNature', value))}
								>
									 <Option value={1}>原料</Option>
									 <Option value={2}>半成品</Option>
									 <Option value={3}>产品</Option>
								</Select> */}
							</div>
						</div>
					</div>
					{/* <div className="jxc-config-card-modal-row" style={{display:(isAppliedPurchase || isAppliedSale) ? '' : 'none'}}> */}
					<div className="jxc-config-card-modal-row">
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">所属分类：</label>
							<div className="jxc-config-card-modal-input">
								{
									reserveTags.map((item,index) =>{
										// let styleDisplay = (isAppliedPurchase && item.get('isAppliedPurchase') || isAppliedSale && item.get('isAppliedSale')) && stockRange.some(v => v === item.get('uuid'))
										let styleDisplay = stockRange.some(v => v === item.get('uuid'))
										return (
											<label style={{display:styleDisplay ? '' : 'none'}} key={index}>
												<Checkbox
													checked={item.get('checked')}
													onChange={(e)=> dispatch(lrAccountActions.changeCardCategoryStatus(item,e.target.checked))}
												/>
												{item.get('name')}
												&nbsp;&nbsp;&nbsp;&nbsp;
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
										<div className="jxc-config-card-modal-row select-row-with-two"
											 key={item.get('name')}
										 >
											<div className="jxc-config-card-modal-item">
												<label className="jxc-config-card-modal-label">{item.get('name')}类别：</label>
												<div className="jxc-config-card-modal-input">
													<UpperClassSelect
														className='jxc-config-modal-select'
														placeholder={''}
														treeData={item.get('tree')?item.get('tree'):[]}
														treeDefaultExpandAll={true}
														isLastSelect = {true}
														disabledParent = {true}
														value={item.get('selectUuid')?[item.get('selectName')]:['']}
														onSelect={value => {
															dispatch(lrAccountActions.changeCardCategoryType(item,value))
														}}
													/>
												</div>
											</div>
										</div>
									)
								}else{
									return null
								}
							})
						}
					</div>
					{
						 simplifyStatus ?
							<div className="jxc-config-title">
								财务信息
							</div>:''
					}
					{
						 simplifyStatus ?
						 <div className="jxc-config-card-modal-row">
	 						<div className="jxc-config-card-modal-item">
	 							<label className="jxc-config-card-modal-label">存货科目：</label>
	 							<div className="jxc-config-card-modal-input">
	 								<SelectAc
	 									tipText={'必填，请选择科目'}
	 									acId={inventoryAcId}
	 									acName={inventoryAcName}
	 									lrAclist={lrAclist}
	 									onChange={(value) => {
	 										dispatch(lrAccountActions.changeIUMangeCardAc(value,'inventoryAcId','inventoryAcName','inventorySettingCard'))
	 									}}
	 								/>
	 							</div>
	 						</div>
	 					</div>
						:''
					}

					<div className={'modalBomb'} style={{display:confirmModal?'':'none'}}>

					</div>
				</div>
			</Modal>
		)
	}
}

import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput } from 'app/components'
import { Input, Checkbox, Button, Modal, message } from 'antd'
import { TableTree, IUTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
const CheckboxGroup = Checkbox.Group;

import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

@immutableRenderDecorator
export default
class AddCardTypeModal extends React.Component {

	static displayName = 'InventoryConfAddCardTypeModal'

	constructor() {
		super()
		this.state = {
			confirmModal : false
		}
	}

	render() {

		const {
			dispatch,
			showModal,
			closeModal,
			editPermission,
			inventoryCardTypeTemp,
			typeTreeSelectList,
			inventorySettingBtnStatus,
			activeTapKeyUuid,
			treeList,
			originTags,
		} = this.props

		const { confirmModal } = this.state
		const showConfirmModal = () => this.setState({confirmModal:true})
		const closeConfirmModal = () => this.setState({confirmModal:false})

        const name = inventoryCardTypeTemp.get('name')
        const remark = inventoryCardTypeTemp.get('remark')
        const parentName = inventoryCardTypeTemp.get('parentName')

		const treeUuid = inventorySettingBtnStatus.get('treeUuid')
        const treeName = inventorySettingBtnStatus.get('treeName')
        const isDelete = inventorySettingBtnStatus.get('isDelete')
        const isAdd = inventorySettingBtnStatus.get('isAdd')
        const isEdit = inventorySettingBtnStatus.get('isEdit')
        const isUp = inventorySettingBtnStatus.get('isUp')
        const isDown = inventorySettingBtnStatus.get('isDown')

        // let treeList = inventorySettingState.get('typeTree')
		const isAll = treeUuid === treeList.getIn(['0','uuid']) ? true : false
		let HighTypeInfo = fromJS({})
		originTags.map((item, index) => {
			if (item.get('uuid') === activeTapKeyUuid) {
				HighTypeInfo = item
			}
		})

		return (
			<Modal
				width={'480px'}
				visible={showModal}
				maskClosable={false}
				title={'编辑类别'}
				onCancel={() => closeModal()}
				footer={null}
			>
				<div className="add-card-type-modal-wrap">
                    <div className="tree-list-left">
						<div className={['tree-box', isDelete ? 'check-box-not-show' : ''].join(' ')}>
							<IUTree
								dataList={treeList}
								onCheck={(list) => {
									dispatch(inventoryConfActions.changeInventoryCardTypeBoxChecked(list))
								}}
								iuTreeSelectList={typeTreeSelectList}
								currentSelectedKeys={[`${treeUuid}`]}
								selectTreeNode={(info) => {
                                    const uuid = info.length === 0 ? treeUuid : info[0]
                                    dispatch(inventoryConfActions.getInventoryTypeInfo(uuid))
                                }}
								isDelete={isDelete}
							/>
						</div>
						<div className="title-box">
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(inventoryConfActions.beforeInsertAddInventoryCardType())
									}
								}}
								style={{display: isAdd || isDelete ? 'none' : ''}}
							>
								新增
							</div>
							<div
								className={isUp ? '' : 'click-disabled'}
								onClick={() => {
									if (editPermission) {
										if(isUp){
											dispatch(inventoryConfActions.inventoryUpType())
										}
									}
								}}
								style={{display: isAdd || isDelete ? 'none' : ''}}
							>
								上移
							</div>
							<div
								className={isDown ? '' : 'click-disabled'}
								onClick={() => {
									if (editPermission) {
										if(isDown){
											dispatch(inventoryConfActions.inventoryDownType())
										}
									}
								}}
								style={{display:isAdd || isDelete? 'none' : ''}}
							>
								下移
							</div>
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(inventoryConfActions.deleteInventoryType())
									}
								}}
								style={{display:isAdd || isDelete ? 'none' : ''}}
							>
								删除
							</div>
							<div
								onClick={() => {
									dispatch(inventoryConfActions.cancelDeleteOrAddInventoryType())
								}}
								style={{display:isAdd || isDelete ? '' : 'none'}}
							>
								取消
							</div>
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(inventoryConfActions.confirmDeleteInventoryType())
									}
								}}
								style={{display:isDelete ? '' : 'none'}}
							>
								确认删除
							</div>
						</div>
                    </div>
					{
						isAll && !isAdd && !isEdit?
							<div className="jxc-config-modal-wrap add-card-type-content">
								<div className="jxc-config-modal-item">
									<label className="jxc-config-modal-label min-label">类别名称：</label>
									<div className="jxc-config-modal-input">
										{HighTypeInfo.get('name')}
									</div>
								</div>
								{/* <div className="jxc-config-modal-item">
									<label className="jxc-config-modal-label min-label">往来关系：</label>
									<div className="jxc-config-modal-input">
										<span>
											<label style={{display: HighTypeInfo.get('isAppliedPurchase') ? '' : 'none'}}>
												<Checkbox
													checked={HighTypeInfo.get('isAppliedPurchase')}
												/>
												&nbsp;采购
											</label>
											&nbsp;&nbsp;
											<label style={{display: HighTypeInfo.get('isAppliedSale') ? '' : 'none'}}>
												<Checkbox
													checked={HighTypeInfo.get('isAppliedSale')}
												/>
												&nbsp;销售
											</label>
										</span>
									</div>
								</div> */}
							</div>
						:
						<div className="jxc-config-modal-wrap add-card-type-content">
							<div className="jxc-config-modal-item">
								<label className="jxc-config-modal-label min-label">名称：</label>
									<div className="jxc-config-modal-input">
										<Input
											placeholder={placeholderText.name}
											type="text"
											value={name}
											onChange={e => dispatch(inventoryConfActions.changeInventoryCardTypeContent('name',e.target.value))}
											onFocus={(e) => e.target.select()}
										/>
								</div>
							</div>
							<div className="jxc-config-modal-item">
								<label className="jxc-config-modal-label min-label">上级类别：</label>
								<div className="jxc-config-modal-input" style={{maxWidth:'159px'}}>
									<UpperClassSelect
										className='jxc-config-modal-select'
										treeData={treeList}
										disabled={false}
										disabledEnd={true}
										treeDefaultExpandAll={true}
										value={[parentName]}
										onSelect={value => dispatch(inventoryConfActions.changeInventoryCardTypeSelect(value))}
									/>
								</div>
							</div>
							<Button
								type="primary"
								disabled={!editPermission}
								onClick={() => {
									const checkList = [{
										type:'name',
										value:name,
									}]

									jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(inventoryConfActions.saveInventoryCardType('edit', showConfirmModal, closeConfirmModal)))
								}}
								style={{display: isAdd ? 'none' : ''}}
							>
								保存
							</Button>
							<Button
                                type="primary"
								disabled={!editPermission}
                                onClick={() => {
                                    const checkList = [{
                                        type: 'name',
                                        value: name,
                                    }]
                                    jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(inventoryConfActions.saveInventoryCardType('new', showConfirmModal, closeConfirmModal)))
                                }}
                                style={{display: isAdd ? '' : 'none'}}
                            >
                                新增
                            </Button>
						</div>
					}
					<div className={'modalBomb'} style={{display:confirmModal?'':'none'}}>
					</div>
                </div>
			</Modal>
		)
	}
}

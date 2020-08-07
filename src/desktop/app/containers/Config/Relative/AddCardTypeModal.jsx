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

import * as relativeConfActions from 'app/redux/Config/Relative/relative.action.js'

@immutableRenderDecorator
export default
class AddCardTypeModal extends React.Component {

	static displayName = 'RelativeConfAddCardTypeModal'

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
			relativeTypeTemp,
			typeTreeSelectList,
			relativeTypeBtnStatus,
			activeTapKeyUuid,
			treeList,
			originTags,
		} = this.props

		const { confirmModal } = this.state
		const showConfirmModal = () => this.setState({confirmModal:true})
		const closeConfirmModal = () => this.setState({confirmModal:false})

        const name = relativeTypeTemp.get('name')
        const remark = relativeTypeTemp.get('remark')
        const parentName = relativeTypeTemp.get('parentName')

		const treeUuid = relativeTypeBtnStatus.get('treeUuid')
        const treeName = relativeTypeBtnStatus.get('treeName')
        const isDelete = relativeTypeBtnStatus.get('isDelete')
        const isAdd = relativeTypeBtnStatus.get('isAdd')
        const isEdit = relativeTypeBtnStatus.get('isEdit')
        const isUp = relativeTypeBtnStatus.get('isUp')
        const isDown = relativeTypeBtnStatus.get('isDown')

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
									dispatch(relativeConfActions.changeRelativeTypeBoxChecked(list))
								}}
								iuTreeSelectList={typeTreeSelectList}
								currentSelectedKeys={[`${treeUuid}`]}
								selectTreeNode={(info) => {
                                    const uuid = info.length === 0 ? treeUuid : info[0]
                                    dispatch(relativeConfActions.getRelativeTypeInfo(uuid))
                                }}
								isDelete={isDelete}
							/>
						</div>
						<div className="title-box">
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(relativeConfActions.beforeInsertAddRelativeConfType())
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
											dispatch(relativeConfActions.relativeUpType())
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
											dispatch(relativeConfActions.RelativeDownType())
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
										dispatch(relativeConfActions.beforeDeleteRelativeType())
									}
								}}
								style={{display:isAdd || isDelete ? 'none' : ''}}
							>
								删除
							</div>
							<div
								onClick={() => {
									dispatch(relativeConfActions.cancelRelativeTypeInsertOrDelete())
								}}
								style={{display:isAdd || isDelete ? '' : 'none'}}
							>
								取消
							</div>
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(relativeConfActions.confirmDeleteRelativeType())
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
											<label style={{display: HighTypeInfo.get('isPayUnit') ? '' : 'none'}}>
												<Checkbox
													checked={HighTypeInfo.get('isPayUnit')}
												/>
												&nbsp;向他付款
											</label>
											&nbsp;&nbsp;
											<label style={{display: HighTypeInfo.get('isReceiveUnit') ? '' : 'none'}}>
												<Checkbox
													checked={HighTypeInfo.get('isReceiveUnit')}
												/>
												&nbsp;向他收款
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
											onChange={e => dispatch(relativeConfActions.changeRelativeTypeContent('name',e.target.value))}
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
										onSelect={value => dispatch(relativeConfActions.changeRelativeTypeSelect(value))}
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

									jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(relativeConfActions.saveRelativeType('edit', showConfirmModal, closeConfirmModal)))
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
                                    jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(relativeConfActions.saveRelativeType('new', showConfirmModal, closeConfirmModal)))
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

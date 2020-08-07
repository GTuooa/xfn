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

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

@immutableRenderDecorator
export default
class AddCardTypeModal extends React.Component {

	static displayName = 'ProjectConfAddCardTypeModal'

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
			projectTypeTemp,
			typeTreeSelectList,
			projectTypeBtnStatus,
			activeTapKeyUuid,
			treeList,
			originTags,
		} = this.props

		const { confirmModal } = this.state
		const showConfirmModal = () => this.setState({confirmModal:true})
		const closeConfirmModal = () => this.setState({confirmModal:false})

        const name = projectTypeTemp.get('name')
        const remark = projectTypeTemp.get('remark')
        const parentName = projectTypeTemp.get('parentName')

		const treeUuid = projectTypeBtnStatus.get('treeUuid')
        const treeName = projectTypeBtnStatus.get('treeName')
        const isDelete = projectTypeBtnStatus.get('isDelete')
        const isAdd = projectTypeBtnStatus.get('isAdd')
        const isEdit = projectTypeBtnStatus.get('isEdit')
        const isUp = projectTypeBtnStatus.get('isUp')
        const isDown = projectTypeBtnStatus.get('isDown')

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
									dispatch(projectConfActions.changeProjectCardTypeBoxChecked(list))
								}}
								iuTreeSelectList={typeTreeSelectList}
								currentSelectedKeys={[`${treeUuid}`]}
								selectTreeNode={(info) => {
                                    const uuid = info.length === 0 ? treeUuid : info[0]
                                    dispatch(projectConfActions.switchProjectType(uuid))
                                }}
								isDelete={isDelete}
							/>
						</div>
						<div className="title-box">
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(projectConfActions.beforeInsertProjectConfCardType())
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
											dispatch(projectConfActions.projectUpType())
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
											dispatch(projectConfActions.projectDownType())
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
										dispatch(projectConfActions.deleteProjectType())
									}
								}}
								style={{display:isAdd || isDelete ? 'none' : ''}}
							>
								删除
							</div>
							<div
								onClick={() => {
									dispatch(projectConfActions.cancelInsertOrDeleteProjectType())
								}}
								style={{display:isAdd || isDelete ? '' : 'none'}}
							>
								取消
							</div>
							<div
								onClick={() => {
									if (editPermission) {
										dispatch(projectConfActions.confirmDeleteProjectType())
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
										onChange={e => dispatch(projectConfActions.changeProjectCardTypeContent('name', e.target.value))}
										onFocus={(e) => e.target.select()}
									/>
								</div>
							</div>
							<div className="jxc-config-modal-item">
								<label className="jxc-config-modal-label min-label" >上级类别：</label>
								<div className="jxc-config-modal-input" style={{maxWidth:'159px'}}>
									<UpperClassSelect
										className='jxc-config-modal-select'
										treeData={treeList}
										disabled={false}
										disabledEnd={true}
										treeDefaultExpandAll={true}
										value={[parentName]}
										onSelect={value => dispatch(projectConfActions.changeProjectCardTypeSelect(value))}
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

									jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(projectConfActions.saveProjectCardType('edit', showConfirmModal, closeConfirmModal)))
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
                                    jxcConfigCheck.beforeSaveCheck(checkList, () => dispatch(projectConfActions.saveProjectCardType('new', showConfirmModal, closeConfirmModal)))
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

import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, XfInput, Icon } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, Radio, Tooltip } from 'antd'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

import * as editProjectCardActions from 'app/redux/Config/Project/editProjectCard.action.js'

@connect(state => state)
export default
class AddCardModal extends React.Component {

	static displayName = 'ProjectConfAddCardModal'

	constructor() {
		super()
		this.state = {
            confirmModal : false
        }
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.projectCardState !== nextprops.projectCardState || this.props.showModal !== nextprops.showModal || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {

		const {
			dispatch,
			showModal,
			closeModal,
			projectCardState,
			homeState,
			originTags,
			fromPage,
			cardList=fromJS([]),
			allState,
			// moduleInfo=[]
		} = this.props

		const { confirmModal } = this.state


		const isCheckOut = allState.getIn(['period', 'closedyear']) ? true : false
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const typeTree = projectCardState.get('typeTree')
		const insertOrModify = projectCardState.getIn(['views', 'insertOrModify'])
		// const fromPosition = projectCardState.getIn(['views', 'fromPosition'])
		
		// const fromPage = projectCardState.getIn(['views', 'fromPage'])

		const isFromOtherpage = fromPage !== 'projectConfig'
		if (isFromOtherpage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}

		const cardTitle = insertOrModify === 'insert' ? `新增项目` : `修改项目`
		const projectCardTemp = projectCardState.get('projectCardTemp')
		const code = projectCardTemp.get('code')
		const name = projectCardTemp.get('name')
		const selectUuid = projectCardTemp.get('selectUuid')
		const selectName = projectCardTemp.get('selectName')
		const projectProperty = projectCardTemp.get('projectProperty')
		const projectPropertyName = projectCardTemp.get('projectPropertyName')
		const basicProductOpen = projectCardTemp.get('basicProductOpen')
		const contractCostOpen = projectCardTemp.get('contractCostOpen')
		const contractProfitOpen = projectCardTemp.get('contractProfitOpen')
		const engineeringSettlementOpen = projectCardTemp.get('engineeringSettlementOpen')

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const SCXM = moduleInfo.indexOf('SCXM') > -1
		const SGXM = moduleInfo.indexOf('SGXM') > -1
		const beforeSave = (flag) => {
			const checkList = [
				{
					type: 'stockName',
					value: name
				}, {
					type: 'code',
					value: code
				}
			]

			if (selectUuid === '') {
				message.info('请选择类别！')
				return ;
			}

			const success = (flag) => {
				const showConfirmModal = () => this.setState({confirmModal: true})
				const closeConfirmModal = () => this.setState({confirmModal: false})
				dispatch(editProjectCardActions.saveProjectCard(fromPage, flag, closeModal, showConfirmModal, closeConfirmModal))
			}
			jxcConfigCheck.beforeSaveCheck(checkList, () => success(flag))
		}
		let lastIndex,nextIndex,curIndex
		if (insertOrModify === 'modify' && cardList.size) {
			curIndex = cardList.findIndex(v => v.get('code') === code)
			lastIndex = curIndex -1
			nextIndex = curIndex +1
		}
		return (
			<Modal
				width={'820px'}
				visible={showModal}
				maskClosable={false}
				title={cardTitle}
				onCancel={() => closeModal()}
				footer={[
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('code') === code) === 0}
						onClick={() => {
							dispatch(editProjectCardActions.beforeEditProjectCard(cardList.get(lastIndex), () => {} , originTags))
						}}
						>
					<Icon type='caret-left' />
					</Button>
					,
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('code') === code) === cardList.size -1 || !cardList.size}
						onClick={() => {
							dispatch(editProjectCardActions.beforeEditProjectCard(cardList.get(nextIndex), () => {}, originTags))
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
							beforeSave('insert')
						}}
						>
						保 存
					</Button>,
					<Button
						key="addAndNew"
						type="primary"
						disabled={!editPermission}
						style={{display: insertOrModify == 'insert' && !isFromOtherpage ? 'inline-block' : 'none'}}
						onClick={() => {
							beforeSave('insertAndNew')
						}}>
						保存并新增
					</Button>
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
									onChange={e => jxcConfigCheck.inputCheck('cardCode', e.target.value, () => dispatch(editProjectCardActions.changeProjectCardContent('code', e.target.value)))}
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
									onChange={e => dispatch(editProjectCardActions.changeProjectCardContent('name', e.target.value))}
									onFocus={e => e.target.select()}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-card-modal-row">
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">项目性质：</label>
							<div className="jxc-config-card-modal-input" style={{maxWidth:'800px'}}>
								<RadioGroup
									onChange={(e) => {
										const valueList = e.target.value.split(Limit.TREE_JOIN_STR)
										const projectProperty = valueList[0]
										const projectPropertyName = valueList[1]
										dispatch(editProjectCardActions.changeProjectPropertyState(projectProperty,projectPropertyName))

									}}
									value={`${projectProperty}${Limit.TREE_JOIN_STR}${projectPropertyName}`}
								>
									<Radio value={`XZ_LOSS${Limit.TREE_JOIN_STR}损益项目`}>损益项目</Radio>
									{
										SCXM?
										<Radio value={`XZ_PRODUCE${Limit.TREE_JOIN_STR}生产项目`}>生产项目</Radio>:''
									}
									{
										SGXM?
										<Radio value={`XZ_CONSTRUCTION${Limit.TREE_JOIN_STR}施工项目`}>施工项目</Radio>
										:''
									}

								</RadioGroup>
							</div>
						</div>

					</div>
					<div className="jxc-config-card-modal-row">
					<div className="jxc-config-card-modal-item">
						<label className="jxc-config-card-modal-label">类别：</label>
						<div className="jxc-config-card-modal-input">
							<UpperClassSelect
								className='jxc-config-modal-select'
								placeholder={''}
								treeData={typeTree ? typeTree : []}
								treeDefaultExpandAll={true}
								isLastSelect={true}
								disabledParent={true}
								value={selectUuid ? [selectName] : ['']}
								onSelect={value => {
									dispatch(editProjectCardActions.changeProjectCardCategoryType(value))
								}}
							/>
						</div>
					</div>
					<div>

					</div>
					</div>
					{
						projectProperty === 'XZ_PRODUCE' || projectProperty === 'XZ_CONSTRUCTION'?
						<div className="jxc-config-title" style={{marginBottom: '10px'}}>
							期初信息
						</div>:''
					}
					<div className="jxc-config-card-modal-row">
					{
						projectProperty === 'XZ_PRODUCE'?
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">基本生产成本：</label>
							<div className="jxc-config-card-modal-input">
								<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
								<XfInput
									negativeAllowed
									mode="amount"
									placeholder='请输入金额'
									disabled={isCheckOut}
									value={basicProductOpen}
									onChange={(e) => {
										const value = e.target.value
										dispatch(editProjectCardActions.changeProjectCardContent('basicProductOpen', value))
									}}
								/>
								</Tooltip>
							</div>
						</div>:''
					}
					{
						projectProperty === 'XZ_CONSTRUCTION'?
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">合同成本：</label>
							<div className="jxc-config-card-modal-input">
								<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
								<XfInput
									negativeAllowed
									mode="amount"
									placeholder='请输入金额'
									disabled={isCheckOut}
									value={contractCostOpen}
									onChange={(e) => {
										const value = e.target.value
										dispatch(editProjectCardActions.changeProjectCardContent('contractCostOpen', value))
									}}
								/>
								</Tooltip>
							</div>
						</div>:''
					}
					{
						projectProperty === 'XZ_CONSTRUCTION'?
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">合同毛利：</label>
							<div className="jxc-config-card-modal-input">
								<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
								<XfInput
									negativeAllowed
									mode="amount"
									placeholder='请输入金额'
									disabled={isCheckOut}
									value={contractProfitOpen}
									onChange={(e) => {
										const value = e.target.value
										dispatch(editProjectCardActions.changeProjectCardContent('contractProfitOpen', value))
									}}
								/>
								</Tooltip>
							</div>
						</div>:''
					}

				</div>
				{
					projectProperty === 'XZ_CONSTRUCTION'?
					<div className="jxc-config-card-modal-row">
					<div className="jxc-config-card-modal-item">
						<label className="jxc-config-card-modal-label">工程结算：</label>
						<div className="jxc-config-card-modal-input">
							<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
							<XfInput
								negativeAllowed
								mode="amount"
								placeholder='请输入金额'
								disabled={isCheckOut}
								value={engineeringSettlementOpen}
								onChange={(e) => {
									const value = e.target.value
									dispatch(editProjectCardActions.changeProjectCardContent('engineeringSettlementOpen', value))
								}}
							/>
							</Tooltip>
						</div>
					</div>
					</div>:''
				}
				</div>
			</Modal>
		)
	}
}

import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, Icon } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message } from 'antd'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;

import * as editRelativeCardActions from 'app/redux/Config/Relative/editRelativeCard.action.js'

@connect(state => state)
export default
class AddCardModal extends React.Component {

	static displayName = 'RelativeConfAddCardModal'

	constructor() {
		super()
		this.state = {
            confirmModal : false
        }
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.relativeCardState !== nextprops.relativeCardState || this.props.showModal !== nextprops.showModal || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {

		const {
			dispatch,
			showModal,
			closeModal,
			relativeCardState,
			homeState,
			fromPage,
			cardList=fromJS([]),
			originTags
		} = this.props

		const { confirmModal } = this.state


		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const reserveTags = relativeCardState.get('tags').filter(v => v.get('name') !== '全部')

		const relativeCardTemp = relativeCardState.get('relativeCardTemp')
		const insertOrModify = relativeCardState.getIn(['views', 'insertOrModify'])
		// const fromPage = relativeCardState.getIn(['views', 'fromPage'])
		// const fromPosition = relativeCardState.getIn(['views', 'fromPosition'])
		const isFromOtherpage = fromPage !== 'relativeConfig'
		if (isFromOtherpage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}
		const cardTitle = insertOrModify === 'insert' ? `新增往来单位` : `修改往来单位`
		const code = relativeCardTemp.get('code')
		const name = relativeCardTemp.get('name')
		const isPayUnit = relativeCardTemp.get('isPayUnit')
		const isReceiveUnit = relativeCardTemp.get('isReceiveUnit')
		const companyAddress = relativeCardTemp.get('companyAddress')
		const companyTel = relativeCardTemp.get('companyTel')
		const financeName = relativeCardTemp.get('financeName')
		const financeTel = relativeCardTemp.get('financeTel')
		const remark = relativeCardTemp.get('remark')
		const receivableOpened = relativeCardTemp.get('receivableOpened')
		const advanceOpened = relativeCardTemp.get('advanceOpened')
		const payableOpened = relativeCardTemp.get('payableOpened')
		const prepaidOpened = relativeCardTemp.get('prepaidOpened')
		const categoryTypeList = relativeCardTemp.get('categoryTypeList')
		const enablePrepaidAc = relativeCardTemp.get('enablePrepaidAc')
		const enableAdvanceAc = relativeCardTemp.get('enableAdvanceAc')
		const contacterInfo = relativeCardTemp.get('contacterInfo')
		const isCheckOut = relativeCardTemp.get('isCheckOut')

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
				}, {
					type: 'companyAddress',
					value: companyAddress
				}, {
					type: 'financeName',
					value: financeName
				}
			]

			const success = () => {
				if (!(isPayUnit || isReceiveUnit)) {
					message.info('往来关系必选一项')
					return ;
				}

				let size = 0
				reserveTags.map((item,index) => {
					if (item.get('checked')) {
						size++
					}
				})

				if (size === 0) {
					message.info('所属分类必选一项')
					return
				}

				if (categoryTypeList.size > 0) {
					let allSelect = true
					categoryTypeList.map((item,index) =>{
						if(item.get('subordinateUuid') === undefined || item.get('subordinateUuid') === ''){
							allSelect = false
							return ;
						}
					})
					if (!allSelect) {
						message.info('请选择所属分类子级类别')
						return
					}
				} else {
					message.info('请选择所属分类子级类别')
					return
				}

				const showConfirmModal = () => this.setState({confirmModal: true})
				const closeConfirmModal = () => this.setState({confirmModal: false})

				dispatch(editRelativeCardActions.saveRelativeCard(fromPage, flag, closeModal, showConfirmModal, closeConfirmModal))
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
							dispatch(editRelativeCardActions.beforeRelativeEditCard(cardList.get(lastIndex), () => {} , originTags))
						}}
						>
					<Icon type='caret-left' />
					</Button>
					,
					<Button 
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('code') === code) === cardList.size -1 || !cardList.size}
						onClick={() => {
							dispatch(editRelativeCardActions.beforeRelativeEditCard(cardList.get(nextIndex), () => {}, originTags))
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
						style={isFromOtherpage ? {display: 'none'} : {display: insertOrModify == 'insert' ? 'inline-block' : 'none'}}
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
									onChange={e => jxcConfigCheck.inputCheck('cardCode', e.target.value, () => dispatch(editRelativeCardActions.changeRelativeCardContent('code', e.target.value)))}
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
									onChange={e => dispatch(editRelativeCardActions.changeRelativeCardContent('name', e.target.value))}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-card-modal-row">
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">所属分类：</label>
							<div className="jxc-config-card-modal-input">
								{
									reserveTags.map((item,index) => {
										return (
											<label key={index} className="checkbox-box">
												<Checkbox
													checked={item.get('checked')}
													onChange={(e)=> dispatch(editRelativeCardActions.changeRelativeCardCategoryStatus(item, e.target.checked))}
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
							reserveTags.map((item,index) => {
								if (item.get('checked')) {
									return (
										<div
											className="jxc-config-card-modal-row select-row-with-two"
											key={index}
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
															dispatch(editRelativeCardActions.changeRelativeCardCategoryType(item, value))
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
					<div className="jxc-config-card-modal-row" style={{clear: 'both'}}>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">备注：</label>
							<div className="jxc-config-card-modal-input">
								<Input
									placeholder={placeholderText.remark}
									value={remark}
									onChange={e => dispatch(editRelativeCardActions.changeRelativeCardContent('remark', e.target.value))}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-title" style={{display: isPayUnit || isReceiveUnit ? '' : 'none'}}>
						财务信息
					</div>
					<div className="jxc-config-card-modal-row" style={{display: isReceiveUnit ? '' : 'none'}}>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">应收期初值：</label>
							<div className="jxc-config-card-modal-input">
								<NumberInput
									type="amount"
									placeholder="(选填)"
									value={receivableOpened}
									onChange={value => dispatch(editRelativeCardActions.changeRelativeCardContent('receivableOpened', value))}
									onFocus={(e) => e.target.select()}
									disabled={isCheckOut}
								/>
							</div>
						</div>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">预收期初值：</label>
							<div className="jxc-config-card-modal-input">
								<NumberInput
									type="amount"
									placeholder="(选填)"
									value={advanceOpened}
									onChange={value => dispatch(editRelativeCardActions.changeRelativeCardContent('advanceOpened', value))}
									onFocus={(e) => e.target.select()}
									disabled={isCheckOut}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-card-modal-row" style={{display: isPayUnit ? '' : 'none'}}>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">应付期初值：</label>
							<div className="jxc-config-card-modal-input">
								<NumberInput
									type="amount"
									placeholder="(选填)"
									value={payableOpened}
									onChange={value => dispatch(editRelativeCardActions.changeRelativeCardContent('payableOpened', value))}
									onFocus={(e) => e.target.select()}
									disabled={isCheckOut}
								/>
							</div>
						</div>
						<div className="jxc-config-card-modal-item">
							<label className="jxc-config-card-modal-label">预付期初值：</label>
							<div className="jxc-config-card-modal-input">
								<NumberInput
									type="amount"
									placeholder="(选填)"
									value={prepaidOpened}
									onChange={value => dispatch(editRelativeCardActions.changeRelativeCardContent('prepaidOpened', value))}
									onFocus={(e) => e.target.select()}
									disabled={isCheckOut}
								/>
							</div>
						</div>
					</div>
					<div className="jxc-config-title" >
						<label>
							<Checkbox
								checked={contacterInfo}
								onChange={(e)=> dispatch(editRelativeCardActions.changeRelativeCardContent('contacterInfo', e.target.checked))}
							/>
							&nbsp;
							联系信息
						</label>
					</div>
					{
						contacterInfo ?
							<div>
								<div className="jxc-config-card-modal-row">
									<div className="jxc-config-card-modal-item">
										<label className="jxc-config-card-modal-label">单位地址：</label>
										<div className="jxc-config-card-modal-input">
											<Input
												placeholder={placeholderText.companyAddress}
												value={companyAddress}
												onChange={e => dispatch(editRelativeCardActions.changeRelativeCardContent('companyAddress', e.target.value))}
												onFocus={(e) => e.target.select()}
											/>
										</div>
									</div>
									<div className="jxc-config-card-modal-item">
										<label className="jxc-config-card-modal-label">单位电话：</label>
										<div className="jxc-config-card-modal-input">
											<Input
												placeholder="(选填)"
												value={companyTel}
												onChange={e => jxcConfigCheck.inputCheck('tel', e.target.value, () => dispatch(editRelativeCardActions.changeRelativeCardContent('companyTel', e.target.value)))}
												onFocus={(e) => e.target.select()}
											/>
										</div>
									</div>
								</div>
								<div className="jxc-config-card-modal-row">
									<div className="jxc-config-card-modal-item">
										<label className="jxc-config-card-modal-label">财务联系人：</label>
										<div className="jxc-config-card-modal-input">
											<Input
												placeholder={placeholderText.financeName}
												value={financeName}
												onChange={e => dispatch(editRelativeCardActions.changeRelativeCardContent('financeName', e.target.value))}
												onFocus={(e) => e.target.select()}
											/>
										</div>
									</div>
									<div className="jxc-config-card-modal-item">
										<label className="jxc-config-card-modal-label">联系电话：</label>
										<div className="jxc-config-card-modal-input">
											<Input
												placeholder="(选填)"
												value={financeTel}
												onChange={e => jxcConfigCheck.inputCheck('tel', e.target.value, () => dispatch(editRelativeCardActions.changeRelativeCardContent('financeTel', e.target.value)))}
												onFocus={(e) => e.target.select()}
											/>
										</div>
									</div>
								</div>
							</div>
						: null
					}
					<div className={'modalBomb'} style={{display:confirmModal?'':'none'}}>
					</div>
				</div>
			</Modal>
		)
	}
}

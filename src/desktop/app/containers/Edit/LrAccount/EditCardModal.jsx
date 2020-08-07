import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import 'app/containers/Config/components/common.less'

import { jxcConfigCheck } from 'app/utils'
import { UpperClassSelect, SelectAc, NumberInput } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message } from 'antd'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
import placeholderText from 'app/containers/Config/placehoderText'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { toJS } from 'immutable'
import * as intercourseUnitConfigAction from 'app/redux/Config/baseConf/intercourseUnitConfig/intercourseUnitConfig.action.js'

@immutableRenderDecorator
export default
class EditCardModal extends React.Component {
	constructor() {
		super()
		this.state = {
            confirmModal : false,
        }
	}
	componentDidMount() {
		this.props.dispatch(lrAccountActions.getIUmanageListTitle())
	}
	render() {

		const {
			dispatch,
			showModal,
			closeModal,
			lrAccountState,
			lrAclist,
			contactsRange,
			simplifyStatus
		} = this.props

		const {confirmModal} = this.state
		const reserveTags = lrAccountState.get('tags')
		const activeTapKey = lrAccountState.get('activeTapKey')
		const iuManageTypeCard = lrAccountState.get('iuManageTypeCard')
		const insertOrModify = iuManageTypeCard.get('insertOrModify')
		const code = iuManageTypeCard.get('code')
		const name = iuManageTypeCard.get('name')
		const isPayUnit = iuManageTypeCard.get('isPayUnit')
		const isReceiveUnit = iuManageTypeCard.get('isReceiveUnit')
		const payableAcName = iuManageTypeCard.get('payableAcName')
		const receivableAcName = iuManageTypeCard.get('receivableAcName')
		const advanceAcName = iuManageTypeCard.get('advanceAcName')
		const prepaidAcName = iuManageTypeCard.get('prepaidAcName')
		const payableAcId = iuManageTypeCard.get('payableAcId')
		const receivableAcId = iuManageTypeCard.get('receivableAcId')
		const advanceAcId = iuManageTypeCard.get('advanceAcId')
		const prepaidAcId = iuManageTypeCard.get('prepaidAcId')
		const companyAddress = iuManageTypeCard.get('companyAddress')
		const companyTel = iuManageTypeCard.get('companyTel')
		const financeName = iuManageTypeCard.get('financeName')
		const financeTel = iuManageTypeCard.get('financeTel')
		const remark = iuManageTypeCard.get('remark')
		const receivableOpened = iuManageTypeCard.get('receivableOpened')
		const advanceOpened = iuManageTypeCard.get('advanceOpened')
		const payableOpened = iuManageTypeCard.get('payableOpened')
		const prepaidOpened = iuManageTypeCard.get('prepaidOpened')
		const categoryTypeList = iuManageTypeCard.get('categoryTypeList')
		const enablePrepaidAc = iuManageTypeCard.get('enablePrepaidAc')
		const enableAdvanceAc = iuManageTypeCard.get('enableAdvanceAc')
		const contacterInfo = iuManageTypeCard.get('contacterInfo')
		const isCheckOut = iuManageTypeCard.get('isCheckOut')

		const cardTitle = insertOrModify === 'insert' ? `新增往来单位卡片` : `修改往来单位卡片`

		const beforeSave = (flag) => {
			// if(isReceiveUnit){
			// 	dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','enableAdvanceAc'], true))
			// }
			// if(isPayUnit){
			// 	dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','enablePrepaidAc'], true))
			// }

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

			const success = () =>{
				// if(isPayUnit){
				// 	if(payableAcId === ''){
				// 		message.info('应付科目不能为空')
				// 		return ;
				// 	}
				// 	if(enablePrepaidAc){
				// 		if(prepaidAcId=== ''){
				// 			message.info('预付科目不能为空')
				// 			return ;
				// 		}
				// 	}
				// }

				// if(isReceiveUnit){
				// 	if(receivableAcId === ''){
				// 		message.info('应收科目不能为空')
				// 		return ;
				// 	}
				//
				// 	if(enableAdvanceAc){
				// 		if(advanceAcId === ''){
				// 			message.info('预收科目不能为空')
				// 			return ;
				// 		}
				// 	}
				// }
				let size = 0;
				reserveTags.map((item,index) =>{
					if(item.get('checked')){
						size++
					}
				})

				if(size === 0){
					message.info('所属分类必选一项')
					return ;
				}

				if(categoryTypeList.size > 0){
					let allSelect = true
					categoryTypeList.map((item,index) =>{
						if(item.get('subordinateUuid') === undefined || item.get('subordinateUuid') === ''){
							allSelect = false
							return ;
						}
					})
					if(!allSelect){
						message.info('请选择所属分类子级类别')
						return ;
					}
				}else{
					message.info('请选择所属分类子级类别')
					return ;
				}

				const showConfirmModal = () => this.setState({confirmModal:true})
				const closeConfirmModal = () => this.setState({confirmModal:false})

				dispatch(lrAccountActions.saveIUManageTypeCard(closeModal,flag,showConfirmModal,closeConfirmModal,contactsRange))
			}
			jxcConfigCheck.beforeSaveCheck(checkList, () => success())

		}

		return (
			<Modal
				width={'820px'}
				visible={showModal}
				maskClosable={false}
				title={cardTitle}
				className='stock-contacts'
				onCancel={() => closeModal()}
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
							beforeSave('insert')
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
									onChange={e => jxcConfigCheck.inputCheck('cardCode', e.target.value,()=> dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','code'],e.target.value)))}
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
									onChange={e => dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','name'], e.target.value))}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
					</div>
					{/* {
						isPayUnit || isReceiveUnit ? */}
							<div className="jxc-config-card-modal-row">
								<div className="jxc-config-card-modal-item">
									<label className="jxc-config-card-modal-label">所属分类：</label>
									<div className="jxc-config-card-modal-input">
										{
											reserveTags.map((item,index) =>{
												// let styleDisplay = (isPayUnit && item.get('isPayUnit') || isReceiveUnit && item.get('isReceiveUnit')) && contactsRange.some(v => v === item.get('uuid'))
												let styleDisplay = contactsRange.some(v => v === item.get('uuid'))
												return (
													<label style={{display:styleDisplay ? '' : 'none'}} key={index}>
														<Checkbox
															checked={item.get('checked')}
															onChange={(e)=> dispatch(lrAccountActions.changeManageCardRelation(item,e.target.checked))}
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
						{/* : null
					} */}
					<div className="category-box">
						{
							reserveTags.map((item,index) =>{
								if(item.get('checked')){
									return (
										<div className="jxc-config-card-modal-row select-row-with-two"
											 key = {index}
										 >
											<div className="jxc-config-card-modal-item">
												<label className="jxc-config-card-modal-label">{item.get('categoryName')}类别：</label>
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
															dispatch(lrAccountActions.changeManageCardRelationType(item,value))
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
						<div className="clear-box">
							<div className="jxc-config-title" style={{display:isPayUnit||isReceiveUnit?'':'none'}}>
								财务信息
							</div>
							{
								simplifyStatus?
									<div className="jxc-config-card-modal-row middle-label" style={{display:isReceiveUnit?'':'none'}}>
										<div className="jxc-config-card-modal-item">
											<label className="jxc-config-card-modal-label">应收账款科目：</label>
											<div className="jxc-config-card-modal-input">
												<SelectAc
													tipText={'必填，请选择科目'}
													acId={receivableAcId ? receivableAcId : ''}
													acName={receivableAcName}
													lrAclist={lrAclist}
													onChange={(value) => {
														dispatch(lrAccountActions.changeIUMangeCardAc(value,'receivableAcId','receivableAcName','iuManageTypeCard'))
													}}
												/>
											</div>
										</div>

									</div>:null
							}
							{
								simplifyStatus?
									<div className="jxc-config-card-modal-row middle-label" style={{display:isPayUnit?'':'none'}}>
										<div className="jxc-config-card-modal-item">
											<label className="jxc-config-card-modal-label">应付账款科目：</label>
											<div className="jxc-config-card-modal-input">
												<SelectAc
													tipText={'必填，请选择科目'}
													acId={payableAcId ? payableAcId : ''}
													acName={payableAcName}
													lrAclist={lrAclist}
													onChange={(value) => {
														dispatch(lrAccountActions.changeIUMangeCardAc(value,'payableAcId','payableAcName','iuManageTypeCard'))
													}}
												/>
											</div>
										</div>

									</div>:null
							}

							<div className="jxc-config-card-modal-row  long-label" style={{display:isReceiveUnit?'':'none'}}>
								<div className="jxc-config-card-modal-item">
									<label className="jxc-config-card-modal-label long-table">
										<Checkbox
											checked={enableAdvanceAc}
											onChange={(e)=> dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','enableAdvanceAc'], e.target.checked))}
										/>
										启用预收管理
									</label>
								</div>
								<div className="jxc-config-card-modal-item"></div>
							</div>
							{
								simplifyStatus?
									<div className="jxc-config-card-modal-row middle-label" style={{display:enableAdvanceAc?'':'none'}}>
										<div className="jxc-config-card-modal-item">
											<label className="jxc-config-card-modal-label">预收账款科目：</label>
											<div className="jxc-config-card-modal-input">
												<SelectAc
													tipText={'必填，请选择科目'}
													acId={advanceAcId ? advanceAcId : ''}
													acName={advanceAcName}
													lrAclist={lrAclist}
													onChange={(value) => {
														dispatch(lrAccountActions.changeIUMangeCardAc(value,'advanceAcId','advanceAcName','iuManageTypeCard'))
													}}
												/>
											</div>
										</div>

									</div>
									:null
							}

							<div className="jxc-config-card-modal-row long-label" style={{display:isPayUnit?'':'none'}}>
								<div className="jxc-config-card-modal-item">
									<label className="jxc-config-card-modal-label long-table">
										<Checkbox
											checked={enablePrepaidAc}
											onChange={(e)=>dispatch(lrAccountActions.changeLrAccountOutString(['iuManageTypeCard','enablePrepaidAc'], e.target.checked))}
										/>
										启用预付管理
									</label>
								</div>
								<div className="jxc-config-card-modal-item"></div>
							</div>
							{
								simplifyStatus?
								<div className="jxc-config-card-modal-row middle-label" style={{display:enablePrepaidAc?'':'none'}}>
									<div className="jxc-config-card-modal-item">
										<label className="jxc-config-card-modal-label">预付账款科目：</label>
										<div className="jxc-config-card-modal-input">
											<SelectAc
												tipText={'必填，请选择科目'}
												acId={prepaidAcId ? prepaidAcId : ''}
												acName={prepaidAcName}
												lrAclist={lrAclist}
												onChange={(value) => {
													dispatch(lrAccountActions.changeIUMangeCardAc(value,'prepaidAcId','prepaidAcName','iuManageTypeCard'))
												}}
											/>
										</div>
									</div>

								</div>:null
							}


							<div className={'modalBomb'} style={{display:confirmModal?'':'none'}}>

							</div>
						</div> : ''
					}

				</div>
			</Modal>
		)
	}
}

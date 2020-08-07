// import React from 'react'
// import { connect }	from 'react-redux'
//
// import * as Limit from 'app/constants/Limit.js'
// import { ModalConfigTitle, NumberInput } from 'app/components'
// import { jxcConfigCheck } from 'app/utils'
// import { Input, Checkbox, Button, Modal, message, Icon } from 'antd'
// import { TableBody, TableTitle, TableAll, TableItem } from 'app/components'
//
// import { toJS } from 'immutable'
// import * as jxcCommonActions from 'app/actions/jxcConf/jxcCommon.action.js'
// import * as purchasingActions from 'app/actions/jxcConf/purchasing.action.js'
// import * as salesActions from 'app/actions/jxcConf/sales.action.js'
// import * as components from 'app/components'
//
// @connect(state => state)
// export default
// class UnitModal extends React.Component {
//
// 	constructor() {
// 		super()
// 		this.state = {
//
//         }
// 	}
//
// 	render() {
//
// 		const {
// 			dispatch,
// 			showModal,
//             allUnit,
//             usedUnit,
//             oldUsedUnit,
//             currentPage,
//             closeModal,
// 			insertOrModify,
// 			confirm,
// 			confirmOnClick
// 		} = this.props
//
// 		// const { confirm } = this.state
//
// 		return (
// 				<Modal
// 					visible={showModal}
// 					maskClosable={false}
// 					title="新增单位"
// 					onCancel={() => {
// 						if (insertOrModify === 'modify')
// 							dispatch(jxcCommonActions.cancelModifyJxcUnit(currentPage))
// 						closeModal()
// 					}}
// 					footer={[
// 						<Button key="cancel" type="ghost"
// 							onClick={() => {
// 								let t = setTimeout(()=>{
// 									dispatch(jxcCommonActions.cancelModifyJxcUnit(currentPage))
// 									clearTimeout(t);
// 								},200)
// 								closeModal()
// 							}}>
// 							取 消
// 						</Button>,
// 						<Button key="ok"
// 							type="ghost"
// 							onClick={() => {
//
// 								if (insertOrModify === 'modify' && !confirm) {
// 									return message.info('请先阅读修改单位注意事项并勾选复选框以确定')
// 								}
//
// 								let checkList = [
// 									{
// 										type: 'unitName',
// 										value: usedUnit.getIn(['unitList', 0, 'unitName'])
// 									}
// 								]
//
// 								if (insertOrModify === 'modify') {
// 									checkList.push({
// 										type: 'unitChangeRate',
// 										value: usedUnit.get('changeRate')
// 									})
// 								}
//
// 								const errorList = jxcConfigCheck.beforeSaveCheck(checkList, '', true)
//
// 								// 校验基本单位是否填写
// 								if (errorList.length) {
// 									return message.info(errorList.join(','))
// 								} else {
// 									usedUnit.get('unitList').forEach((v, i) => {
//
// 										if (i > 0) {
// 											if (v.get('unitName') === '' || v.get('unitName') === null) {
// 												errorList.push(`第${i}行的单位名称未填`)
// 											}
// 											if (v.get('unitRate') === '' || v.get('unitRate') === null) {
// 												errorList.push(`第${i}行的数量值未填`)
// 											} else if (v.get('unitRate') <= 1) {
// 												errorList.push(`第${i}行的数量值必须大于1`)
// 											} else if (v.get('unitRate') > 1000) {
// 												errorList.push(`第${i}行的数量值不可超过1000`)
// 											}
// 										}
// 									})
// 								}
//
// 								// 单位列表是否未填写
// 								if (errorList.length) {
// 									message.info(errorList.join(','))
// 								} else {
// 									dispatch(jxcCommonActions.saveJxcMultiUnit(currentPage))
// 									closeModal()
// 								}
// 							}}
// 							disabled={!confirm && insertOrModify != 'insert'}
// 							>
// 							保 存
// 						</Button>
// 					]}
// 				>
// 					<div>
// 						<div className="jxc-config-modal-wrap jxc-config-modal-unit">
// 							<div className="jxc-config-modal-item" style={{display: insertOrModify === 'insert' ? '' : 'none'}}>
// 								<label className="jxc-config-modal-label">基本单位：</label>
// 								<div className="jxc-config-modal-input">
// 									<Input
// 										placeholder="请输入单位名称"
// 										type="text"
// 										value={usedUnit.getIn(['unitList', 0, 'unitName'])}
// 										onChange={e => dispatch(jxcCommonActions.changeJxcBaseUnit(currentPage, e.target.value))}
// 										onFocus = { e => e.target.select()}
// 									/>
// 								</div>
// 							</div>
// 							<div className="jxc-config-modal-item" style={{display: insertOrModify === 'insert' ? 'none' : ''}}>
// 								<label className="jxc-config-modal-center">新基本单位</label>
// 								<label className="jxc-config-modal-center">原基本单位</label>
// 								<label className="jxc-config-modal-center">数量关系</label>
// 							</div>
// 							<div className="jxc-config-modal-item" style={{display: insertOrModify === 'insert' ? 'none' : ''}}>
// 								<div className="jxc-config-modal-unit-input">
// 									<Input
// 										placeholder="请输入单位名称"
// 										type="text"
// 										value={usedUnit.getIn(['unitList', 0, 'unitName'])}
// 										onChange={e => dispatch(jxcCommonActions.changeJxcBaseUnit(currentPage, e.target.value))}
// 									/>
// 								</div>
// 								<div className="jxc-config-modal-center">
// 									<span className="jxc-config-modal-unit-text">=</span>
// 									<span className="jxc-config-modal-unit-text">{oldUsedUnit.getIn(['unitList', 0, 'unitName'])}</span>
// 									<span className="jxc-config-modal-unit-text">
// 										<Icon type="close" />
// 									</span>
// 								</div>
// 								<div className="jxc-config-modal-unit-input">
// 									{/* <Input
// 										placeholder="(必填)"
// 										type="text"
// 										value={usedUnit.get('changeRate')}
// 										onChange={e => dispatch(jxcCommonActions.changeJxcChangeRate(currentPage, e.target.value))}
// 									/> */}
// 									<NumberInput
// 										placeholder="请输入数量值"
// 										type="count"
// 										value={usedUnit.get('changeRate')}
// 										onChange={value => dispatch(jxcCommonActions.changeJxcChangeRate(currentPage, value))}
// 									/>
// 								</div>
// 							</div>
// 							<div className="jxc-config-modal-item">
// 								<label className="jxc-config-modal-label"></label>
// 								<Button
// 									type="primary"
// 									style={{display: usedUnit.get('unitList').size > 1 ? 'none' : ''}}
// 									onClick={() => dispatch(jxcCommonActions.setJxcMultiUnit(currentPage))}
// 								>
// 									多单位
// 								</Button>
// 							</div>
// 							{/* <Button
// 								type="primary"
// 								style={{display: usedUnit.get('unitList').size > 1 ? 'none' : ''}}
// 								onClick={() => dispatch(jxcCommonActions.setJxcMultiUnit(currentPage))}
// 							>
// 								多单位
// 							</Button> */}
// 							<ModalConfigTitle
// 								style={{display: usedUnit.get('unitList').size > 1 ? '' : 'none'}}
// 								title="多单位"
// 							>
// 								<Icon
// 									type="close"
// 									onClick={() => dispatch(jxcCommonActions.clearJxcMultiUnit(currentPage))}
// 								/>
// 							</ModalConfigTitle>
// 							{
// 								usedUnit.get('unitList').map((v, i) => {
//
// 									if (i === 0)
// 										return
//
// 									return (
// 										<div className="jxc-config-modal-item" key={i}>
// 											<label className="jxc-config-modal-unit">单位{i}：</label>
// 											<div className="jxc-config-modal-unit-input">
// 												<Input
// 													placeholder="最长20个字符(必填)"
// 													type="text"
// 													value={v.get('unitName')}
// 													onChange={e => jxcConfigCheck.inputCheck('unitName', e.target.value, () => dispatch(jxcCommonActions.changeJxcMultiContent(currentPage, i, 'unitName', e.target.value)))}
// 													onFocus = { e => e.target.select()}
// 												/>
// 											</div>
// 											<span className="jxc-config-modal-unit-text">=</span>
// 											<span className="jxc-config-modal-unit-text">{usedUnit.getIn(['unitList', 0, 'unitName']) === '' ? '空' : usedUnit.getIn(['unitList', 0, 'unitName'])}</span>
// 											<span className="jxc-config-modal-unit-text">
// 												<Icon type="close" />
// 											</span>
// 											<div className="jxc-config-modal-unit-input">
// 												{/* <Input
// 													placeholder="(必填)"
// 													type="text"
// 													value={v.get('unitRate')}
// 													onChange={e => dispatch(jxcCommonActions.changeJxcMultiContent(currentPage, i, 'unitRate', e.target.value))}
// 												/> */}
// 												<NumberInput
// 													placeholder="(必填)"
// 													type="count"
// 													value={v.get('unitRate')}
// 													onChange={value => dispatch(jxcCommonActions.changeJxcMultiContent(currentPage, i, 'unitRate', value))}
// 													onFocus = { e => e.target.select()}
// 												/>
// 											</div>
// 											<span className="jxc-config-modal-unit-text hover-click-icon">
// 												<Icon onClick={() => dispatch(jxcCommonActions.deleteJxcMultiUnit(currentPage, i))} type="cross-circle-o" />
// 											</span>
// 										</div>
// 									)
// 								})
// 							}
// 							<div className="jxc-config-modal-item" style={{display: usedUnit.get('unitList').size > 1 ? '' : 'none'}}>
// 								{/* <label
// 									className="jxc-config-modal-item-add"
// 									onClick={() => dispatch(jxcCommonActions.setJxcMultiUnit(currentPage))}
// 								>
// 									<Icon type="plus" />
// 									增加单位
// 								</label> */}
// 								<label className="jxc-config-modal-label"></label>
// 								<Button
// 									type="primary"
// 									// onClick={() => dispatch(jxcCommonActions.setJxcMultiUnit(currentPage))}
// 									onClick={() => {
// 										if (usedUnit.get('unitList').size === 4) {
// 											return components.Alert('最多新增三个单位组')
// 										}
// 										dispatch(jxcCommonActions.setJxcMultiUnit(currentPage))
// 									}}
//
// 								>
// 									多单位
// 								</Button>
// 							</div>
// 							<div className="jxc-config-modal-item" style={{display: insertOrModify === 'insert' ? 'none' : ''}}>
// 								<span onClick={() => confirmOnClick()}>
// 									<Checkbox checked={confirm}/>若该商品已有业务关联，业务中的单位将统一转换为新基本单位
// 								</span>
// 							</div>
// 						</div>
// 					</div>
// 				</Modal>
// 		)
// 	}
// }

import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import './style/index.less'

import { jxcConfigCheck, nameCheck } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { AcouontAcSelect } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, TreeSelect } from 'antd'
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode

import * as warehouseConfigActions from 'app/redux/Config/warehouseConfig/warehouseConfig.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class WarehouseModifyModal extends React.Component {

	static displayName = 'AccountCongigModifyModal'

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	// shouldComponentUpdate(nextprops) {
	// 	return this.props.accountConfigState != nextprops.accountConfigState || this.props.homeState != nextprops.homeState || this.props.allState != nextprops.allState || this.props.showModal != nextprops.showModal
	// }

	render() {
		const {
            dispatch,
            showModal,
            homeState,
			allState,
			warehouseConfigState,
			onClose,
			fromPage,
		} = this.props

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		if (fromPage === 'otherPage') {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}

		const insertOrModify = warehouseConfigState.getIn(['views', 'insertOrModify'])
		const warehouseTemp = warehouseConfigState.get('warehouseTemp')
		const insertCardTemp = warehouseConfigState.get('insertCardTemp')
		const insertCode = insertCardTemp.get('code')
		const insertName = insertCardTemp.get('name')
		const insertParentCode = insertCardTemp.getIn(['parentCard','code'])
		const insertParentName = insertCardTemp.getIn(['parentCard','name'])
		const insertParentDisabled = warehouseTemp.get('insertParentDisabled')
		const cardList = warehouseTemp.get('cardList')
		const isCheckOut = allState.getIn(['period', 'closedyear']) ? true : false
		// 保存前要做的校验
		function beforeSaveCheck () {

			let errorList = []

			// if (name === '') {
			// 	errorList.push('账户名称必填')
			// } else if (name.length > 20) {
			// 	errorList.push('账户名称最长20个字符')
			// }
			// if (type === '') {
			// 	errorList.push('账户类型必填')
			// }
			// if (accountNumber.length > 40) {
			// 	errorList.push('卡号最长40个字符')
			// }
			// if (openingBank.length > 40) {
			// 	errorList.push('银行户名最长40个字符')
			// }
			// if (openingName.length > 40) {
			// 	errorList.push('开户行／机构最长40个字符')
			// }

			return errorList
		}
		const reg = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
		const loop = (data,level) => data.map((item,i) => {
			return <TreeNode
				title={`${item.code !== 'DFTCRD' && item.code !== 'ALLCRD' ?item.code:''} ${item.name}`}
				value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.code}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${level + '_' + i}`}
				disabled={item.beUsed}
				>
					{item.childList.length?loop(item.childList,level+1):''}
					{item.disableList.length?loop(item.childList,level+1):''}
				</TreeNode>
		})
		return (
			<Modal

				okText="保存"
				visible={showModal}
				maskClosable={false}
				title={insertOrModify == 'insert' ? '新增仓库' : '编辑仓库'}
				onCancel={() => {
					onClose()
					dispatch(warehouseConfigActions.clearInsertModal())
				}}
				width="800px"
				footer={[
					<Button
						key="cancel"
						type="ghost"
						onClick={() => {
							onClose()
                            dispatch(warehouseConfigActions.clearInsertModal())
						}}>
						取 消
					</Button>,
					<Button
                        key="ok"
						disabled={!editPermission}
						type={fromPage === 'otherPage' ? 'primary' : (insertOrModify == 'modify' ? 'primary' : 'ghost')}
						onClick={() => {
							const errorList = beforeSaveCheck()
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(warehouseConfigActions.saveWarehouseConfAccount(false, () => onClose()))
							}
						}}
						>
						保 存
					</Button>,
					<Button
                        key="addNextAc"
                        type="primary"
						disabled={!editPermission}
						style={{display: insertOrModify == 'insert' && fromPage !== 'otherPage' ? 'inline-block' : 'none'}}
						onClick={() => {
							const errorList = beforeSaveCheck()
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(warehouseConfigActions.saveWarehouseConfAccount(true))
							}
						}}>
						保存并新增
					</Button>
				]}
			>
                <div className="warehouseConf-modal-list">
					<div className="warehouseConf-modal-list-item">
						<label>编码：</label>
						<div>
							<Input
								placeholder="必填，支持数字和字母，最长16个字符"
								value={insertCode}
								onChange={e => jxcConfigCheck.inputCheck('stockCode', e.target.value, () => dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('insertCard', 'code', e.target.value)))
									}
							/>
						</div>
					</div>
					<div className="warehouseConf-modal-list-item">
						<label>名称：</label>
						<div>
							<Input
								value={insertName}
								placeholder="必填"
								onChange={(e) => {
									if (nameCheck(e.target.value)) {
										message.info(`名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
									} else {
										dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('insertCard', 'name', e.target.value))
									}
								}}
							/>
						</div>
					</div>
                    <div className="warehouseConf-modal-list-item">
                        <label>上级仓库：</label>
						<div>
							<TreeSelect
								disabled={insertOrModify=== 'modify' || insertParentDisabled}
								placeholder="请选择类别"
								value={`${insertParentCode && insertParentCode !== 'DFTCRD'&& insertParentCode !== 'ALLCRD'?insertParentCode:''} ${insertParentName && insertParentCode !== 'ALLCRD'?insertParentName:'无'}`}
								onChange={value=> {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const uuid = valueList[0]
									const code = valueList[1]
									const name = valueList[2]
									dispatch(warehouseConfigActions.changeWarehouseConfingCommonString('insertCard','parentCard', fromJS({uuid,code,name})))
								}}
							>
								{loop(cardList.getIn([0,'childList']).toJS(),1)}
								{loop(cardList.getIn([0,'disableList']).toJS(),1)}
							</TreeSelect>
						</div>
                    </div>

                </div>
			</Modal>
		)
	}
}

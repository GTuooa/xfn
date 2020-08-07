import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect }	from 'react-redux'
import './style/index.less'
import { NumberInput } from 'app/components'
import { typeList, typeStr } from './commom.js'
import * as Limit from 'app/constants/Limit.js'
import { AcouontAcSelect } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, Tooltip } from 'antd'
import { Icon } from 'app/components'
import { numberTest, nameCheck } from 'app/utils'
const Option = Select.Option

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class AccountModifyModal extends React.Component {

	static displayName = 'AccountCongigModifyModal'

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }

	shouldComponentUpdate(nextprops) {
		return this.props.accountConfigState != nextprops.accountConfigState || this.props.homeState != nextprops.homeState || this.props.allState != nextprops.allState || this.props.showModal != nextprops.showModal
	}

	render() {
		const {
            dispatch,
            showModal,
            homeState,
			allState,
			accountConfigState,
			onClose,
			fromPage,
			cardList=fromJS([]),
		} = this.props

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		let editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const isFromOtherPage = fromPage !== 'accountConfig'
		if (isFromOtherPage) {
			const lrAccountPermission = homeState.getIn(['permissionInfo', 'LrAccount'])
			editPermission = lrAccountPermission.getIn(['edit', 'permission'])
		}


		const insertOrModify = accountConfigState.getIn(['views', 'insertOrModify'])
		const accountTemp = accountConfigState.get('accountTemp')
		// 现金、一般户、基本户、支付宝、微信、其它
        // cash、general、basic、Alipay、WeChat、other

		const name = accountTemp.get('name')
		const uuid = accountTemp.get('uuid')
		const type = accountTemp.get('type')
		const openingName = accountTemp.get('openingName')
		const openingBank = accountTemp.get('openingBank')
		const accountNumber = accountTemp.get('accountNumber')
		const beginAmount = accountTemp.get('beginAmount')
		const isCheck = accountTemp.get('openInfo')
		const needPoundage = accountTemp.get('needPoundage')
		const poundage = accountTemp.get('poundage')
		const poundageRate = accountTemp.get('poundageRate')
		// const isCheckOut = allState.getIn(['views', 'isCheckOut'])
		const isCheckOut = allState.getIn(['period', 'closedyear']) ? true : false
		// 库存现金、银行存款、其他货币资金
		// const availAcId = ['1001', '1002', '1012']
		// const availAclist = lrAclist.filter(v => availAcId.some(w => v.get('acid').indexOf(w) === 0) && v.get('asscategorylist').size === 0)

		// 保存前要做的校验
		function beforeSaveCheck () {

			let errorList = []

			if (name === '') {
				errorList.push('账户名称必填')
			} else if (nameCheck(name)) {
				errorList.push(`名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
			}
			if (type === '') {
				errorList.push('账户类型必填')
			}
			if (accountNumber.length > 40) {
				errorList.push('卡号最长40个字符')
			}
			if (openingBank.length > 40) {
				errorList.push('银行户名最长40个字符')
			}
			if (openingName.length > 40) {
				errorList.push('开户行／机构最长40个字符')
			}
			if(beginAmount === '-') {
				errorList.push('请输入有效的数值')
			}
			// if(needPoundage && !poundageRate) {
			// 	errorList.push('费用比率必填')
			// } else  if (needPoundage && poundageRate == 0) {
			// 	errorList.push('费用比率不能为0')
			// } else
			if (needPoundage && (poundage === 0 || poundage === '0')) {
				errorList.push('费用上限不能为0')

			}
			return errorList
		}


		const reg = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
		const regPos = /^\d{0,14}(\.\d{0,2})?$/

		let lastIndex,nextIndex,curIndex
		if (insertOrModify === 'modify' && cardList.size) {
			curIndex = cardList.findIndex(v => v.get('uuid') === uuid)
			lastIndex = curIndex -1
			nextIndex = curIndex +1
		}
		return (
			<Modal
				okText="保存"
				visible={showModal}
				maskClosable={false}
				title={insertOrModify == 'insert' ? '新增账户' : '编辑账户'}
				// onCancel={() => dispatch(accountConfigActions.closeAccountconfModal())}
				onCancel={() => onClose()}
				width="480px"
				footer={[
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('uuid') === uuid) === 0}
						onClick={() => {
							dispatch(accountConfigActions.beforeModifyaccountConfRunningOld(cardList.get(lastIndex)))
						}}
						>
					<Icon type='caret-left' />
					</Button>
					,
					<Button
						style={{float:'left',display:insertOrModify == 'insert'?'none':''}}
						disabled={cardList.findIndex(v => v.get('uuid') === uuid) === cardList.size -1 || !cardList.size}
						onClick={() => {
							dispatch(accountConfigActions.beforeModifyaccountConfRunningOld(cardList.get(nextIndex)))
						}}
					>
					<Icon type='caret-right' />
					</Button>,
					<Button
						key="cancel"
						type="ghost"
						style={{display: insertOrModify == 'insert' ? 'none' : 'inline-block'}}
						onClick={() => {
							onClose()
                            // dispatch(accountConfigActions.closeAccountconfModal())
						}}>
						取 消
					</Button>,
					<Button
                        key="ok"
						disabled={!editPermission}
						type={isFromOtherPage ? 'primary' : (insertOrModify == 'modify' ? 'primary' : 'ghost')}
						onClick={() => {
							const errorList = beforeSaveCheck()
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(accountConfigActions.saveAccountConfAccount(false, () => onClose()))
							}
						}}
						>
						保 存
					</Button>,
					<Button
                        key="addNextAc"
                        type="primary"
						disabled={!editPermission}
						style={{display: insertOrModify == 'insert' && !isFromOtherPage ? 'inline-block' : 'none'}}
						onClick={() => {
							const errorList = beforeSaveCheck()
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(allRunningActions.saveAccountConfAccount(fromPage, true))
							}
						}}>
						保存并新增
					</Button>
				]}
			>
                <div className="accountConf-modal-list">
					<div className="accountConf-modal-list-item">
						<label>账户名称：</label>
						<div>
							<Input
								placeholder="请输入便于识别的账户名"
								value={name}
								onChange={(e) => {
									dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'name', e.target.value))
								}}
							/>
						</div>
					</div>
                    <div className="accountConf-modal-list-item">
                        <label>账户类型：</label>
						<Tooltip title={insertOrModify=== 'modify' && isCheckOut && beginAmount != 0? '账套已结账且存在期初值，请通过反悔模式进行修改' : ''}>
							<div>
								<Select
									disabled={insertOrModify=== 'modify' && isCheckOut && beginAmount != 0}
									placeholder="（必填）"
									value={typeStr(type)}
									onChange={value=> {
										dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'type', value))
									}}
								>
									{
										typeList.map((v, i) => <Option key={v.key} value={v.key}>{v.value}</Option>)
									}
								</Select>
							</div>
						</Tooltip>
                    </div>
					<div className="accountConf-modal-list-item">
						<label>期初余额：</label>
						<div>
							<Input
								disabled={isCheckOut}
								value={beginAmount}
								placeholder="（选填）"
								onChange={(e) => {
									numberTest(e,value => {
										dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'beginAmount', value))

									},true)
								}}
							/>
						</div>
					</div>
					<div style={{display:type === 'spare' || type === 'cash'?'none':''}}>
						<Checkbox
							onChange={(e)=>{
								dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'needPoundage', e.target.checked))
							}}
							checked={needPoundage}>
							启用账户手续费
						</Checkbox>
					</div>
					{
						needPoundage && type !== 'spare' && type !== 'cash'?
						<div>
							<div className="accountConf-modal-list-item">
								<label>费用比率：</label>
								<div style={{display: 'flex',lineHeight:'28px'}}>
									<Input
										placeholder="请输入手续费费用比率"
										value={poundageRate}
											onChange={(e) => {
												let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
												value = value.replace(/,/g,'')
												if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
													value = value.substr(1)
												}
												if (value === '.' || value === '-.') {
													message.info('请输入正确的数值')
												} else if (value > 1000) {
													message.info('费用比率必须小于1000‰')
												} else if (value.indexOf('-') === 0) {
													message.info('费用比率不能为负')
												} else if (!regPos.test(value)) {
													message.info('金额只能输入小于14位数两位小数的数字')
												} else {
													dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'poundageRate', value))
											}
										}}
									/>‰
								</div>
							</div>
							<div className="accountConf-modal-list-item">
								<label>费用上限：</label>
								<div>
									<Input
										placeholder="请输入手续费金额上限"
										value={poundage === -1 ? '' : poundage}
											onChange={(e) => {
												let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
												value = value.replace(/,/g,'')
												if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
													value = value.substr(1)
												}
												if (value === '.' || value === '-.') {
													message.info('请输入正确的数值')
												} else if (value.indexOf('-') === 0) {
													message.info('费用上限不能为负')
												} else if (value !== '' && !regPos.test(value)) {
													message.info('费用上限需大于0')
												} else {
													dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'poundage', value))
											}
										}}
									/>
								</div>
							</div>
						</div>
						: ''
					}
					{
						type === 'cash' || type === 'spare' ? '' :
						<Checkbox onChange={(e)=>{
							dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'openInfo', e.target.checked))
						}} checked={isCheck}>账户信息</Checkbox>
					}
					{
						isCheck && type !== 'cash' && type !== 'spare' ?
						<div>
							<div style={{display: type === 'cash' ? 'none' : ''}} className="accountConf-modal-list-item">
								<label>账号：</label>
								<div>
									<Input
										placeholder="请输入账户号码"
										value={accountNumber}
										onChange={(e) => {
											dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'accountNumber', e.target.value))
										}}
										onBlur={e => dispatch(accountConfigActions.changeAccountConfAccountNumber(typeStr(type), accountNumber))}
									/>
								</div>
							</div>
							<div style={{display: type === 'cash' ? 'none' : ''}} className="accountConf-modal-list-item">
								<label>开户名：</label>
								<div>
									<Input
										placeholder="请输入账户的开户名称"
										value={openingName}
										onChange={(e) => {
											dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'openingName', e.target.value))
										}}
									/>
								</div>
							</div>
							<div style={{display: type === 'cash' ? 'none' : ''}} className="accountConf-modal-list-item">
								<label>开户行/机构：</label>
								<div>
									<Input
										placeholder="请填入开户行或支付机构名称"
										value={openingBank}
										onChange={(e) => {
											dispatch(accountConfigActions.changeAccountConfingCommonString('account', 'openingBank', e.target.value))
										}}
									/>
								</div>
							</div>
						</div>
						: ''
					}
                </div>
			</Modal>
		)
	}
}

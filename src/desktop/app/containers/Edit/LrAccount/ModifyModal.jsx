import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { AcouontAcSelect } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message} from 'antd'
const Option = Select.Option

import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class ModifyModal extends React.Component {
	constructor() {
		super()
		this.state = {
            acId: ''
        }
	}
	// componentWillReceiveProps(nextprops) {
	// }

	render() {
		const {
            dispatch,
            showModal,
			accountTemp,
			lrAclist,
			accountList,
			simplifyStatus
		} = this.props

		// const type =

		// 现金、一般户、基本户、支付宝、微信、其它
        // cash、general、basic、Alipay、WeChat、other

		const name = accountTemp.get('name')
		const type = accountTemp.get('type')
		const acId = accountTemp.get('acId')
		const acFullName = accountTemp.get('acFullName')
		const openingName = accountTemp.get('openingName')
		const openingBank = accountTemp.get('openingBank')
		const accountNumber = accountTemp.get('accountNumber')
		const beginAmount = accountTemp.get('beginAmount')
		const isCheck = accountTemp.get('openInfo')
		// 库存现金、银行存款、其他货币资金
		const availAcId = ['1001', '1002', '1012']
		const availAclist = lrAclist.filter(v => availAcId.some(w => v.get('acid').indexOf(w) === 0) && v.get('asscategorylist').size === 0)

		// 保存前要做的校验
		function beforeSaveCheck () {

			let errorList = []

			if (name === '') {
				errorList.push('账户名称必填')
			} else if (name.length > 20) {
				errorList.push('账户名称最长20个字符')
			}
			if (acId === '' && simplifyStatus) {
				errorList.push('关联科目必填')
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

			return errorList
		}

		const typeList = [
			{
				key: 'cash',
				value: '现金'
			},
			{
				key: 'general',
				value: '一般户'
			},
			{
				key: 'basic',
				value: '基本户'
			},
			{
				key: 'Alipay',
				value: '支付宝'
			},
			{
				key: 'WeChat',
				value: '微信'
			},
			{
				key: 'other',
				value: '其它'
			}
		]
    const reg = /^\d*\.?\d{0,2}$/
		const typeStr = (type) => ({
			'cash': () => '现金',
			'general': () => '一般户',
			'basic': () => '基本户',
			'Alipay': () => '支付宝',
			'WeChat': () => '微信',
			'other': () => '其它'
		}[type] || (() => '未匹配'))()

		return (
			<Modal
				okText="保存"
				visible={showModal}
				maskClosable={false}
				title={'新增账户'}
				onCancel={() => dispatch(lrAccountActions.closeAccountconfModal())}
				footer={[
					<Button
                        key="ok"
						type={'ghost'}
						onClick={() => {
							const errorList = beforeSaveCheck()
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(accountConfActions.saveAccountConfAccount(true,'fromLrAccount'))
							}
						}}
						>
						保 存
					</Button>
				]}
			>
				<div className="lrls-account-add">
					<div className="accountConf-modal-list">
						<div className="accountConf-modal-list-item">
							<label>账户名称：</label>
							<div>
								<Input
									placeholder="请输入便于识别的账户名"
									value={name}
									onChange={(e) => {
										dispatch(accountConfActions.changeAccountConfCommonString('account', 'name', e.target.value))
									}}
								/>
							</div>
						</div>
						{
							simplifyStatus ?
							<div className="accountConf-modal-list-item">
								<label>关联科目：</label>
								<div>
									<AcouontAcSelect
										// disabled={!accountTemp.get('modifiable')} //已生成凭证后不可修改科目
										lrAclist={availAclist}
										acId={acId}
										acName={acFullName}
										tipText="请点击选择所关联的科目"
										onChange={value => {

											const acid = value.split(Limit.TREE_JOIN_STR)[0]
											// const account = accountList.getIn([0, 'childList']).filter((v, i) => v.get('acId') === acid)

											// if (account.size && acid) {
											// 	message.info(`该科目已在${account.getIn([0, 'name'])}里使用过`)
											// } else {
											const acItem = availAclist.find(v => v.get('acid') === acid)
											dispatch(accountConfActions.selectAccountConfAllAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'account', ''))
											// }
										}}
									/>
								</div>
							</div>
							: ''
						}

	                    <div className="accountConf-modal-list-item">
	                        <label>账户类型：</label>
							<div>
								<Select
									placeholder="（必填）"
									value={typeStr(type)}
									onChange={value=> {
										dispatch(accountConfActions.changeAccountConfCommonString('account', 'type', value))
									}}
								>
									{
										typeList.map((v, i) => <Option key={v.key} value={v.key}>{v.value}</Option>)
									}
								</Select>
							</div>
	                    </div>

						{
							simplifyStatus ? '' :
							<div className="accountConf-modal-list-item">
								<label>期初余额：</label>
								<div>
									<Input
										value={beginAmount}
										onChange={(e) => {
											if (e.target.value === undefined)
												return
												
											let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
											if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
												value = value.substr(1)
											}
											if (reg.test(value) || (value === '')) {
												dispatch(accountConfActions.changeAccountConfCommonString('account', 'beginAmount', value))
											} else {
												message.info('金额只能输入带两位小数的数字')
											}

										}}
									/>
								</div>
							</div>
						}



						<Checkbox onChange={(e)=>{
							dispatch(accountConfActions.changeAccountConfCommonString('account', 'openInfo', e.target.checked))
						}} checked={isCheck}>账户信息</Checkbox>
						{
							isCheck ?
							<div>
								<div style={{display: type === 'cash' ? 'none' : ''}} className="accountConf-modal-list-item">
			                        <label>账号：</label>
									<div>
										<Input
											placeholder="请输入账户号码"
											value={accountNumber}
											onChange={(e) => {
												dispatch(accountConfActions.changeAccountConfCommonString('account', 'accountNumber', e.target.value))
											}}
											onBlur={e => dispatch(accountConfActions.changeAccountConfAccountNumber(typeStr(type), accountNumber))}
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
												dispatch(accountConfActions.changeAccountConfCommonString('account', 'openingName', e.target.value))
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
												dispatch(accountConfActions.changeAccountConfCommonString('account', 'openingBank', e.target.value))
											}}
										/>
									</div>
			                    </div>
							</div>
							: ''
						}
	                </div>
				</div>

			</Modal>
		)
	}
}

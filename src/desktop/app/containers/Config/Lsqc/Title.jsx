import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as thirdParty from 'app/thirdParty'
import { ROOT } from 'app/constants/fetch.constant.js'
import { Button,Modal, Select } from 'antd'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class Title extends React.Component {

	static displayName = 'QCTitle'

	render() {

		const { dispatch, isModified,curModifyBtn, Qcdate, issues ,issuedate,isCheckOut,simplifyStatus } = this.props

		const modifyMoudleStr = ({
			'Account': () => '账户',
			'Tax': () => '税费',
			'Salary': () => '薪酬',
			'Contacts': () => '往来款',
			'Stock': () => '存货',
			'Others': () => '其他应收、应付',
			'LongTerm': () => '长期资产',
			'CIB': () => '资本、投资、借款',
		}[curModifyBtn] || (()=>''))()

		return (
			<FlexTitle>
				<div className="flex-title-left">
					<div className="lsqc-top-title">
						期初余额
					</div>
					<div className="lsqc-top-title-month">
						<label>流水起始账期：</label>
						<Select
							className="title-date title-date-margin-right"
							value={issuedate}
							disabled={isCheckOut || !simplifyStatus}
							onChange={(value) => {
								// issuedate, main或count
								dispatch(lsqcActions.modifyPeriod(value))
							}}
						>
							{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
						</Select>
					</div>
				</div>
				<div className="flex-title-right">		
					<Button
						className="title-right"
						type="ghost"
						onClick={() => {
							if (curModifyBtn === '') {
								dispatch(lsqcActions.getBeginningList(true))
							}else{
								const alertMessage = `“${modifyMoudleStr}”的期初余额未保存，是否保存后继续操作？`
								Modal.confirm({
									title: '提示',
									content: alertMessage,
									okText: '保存',
									cancelText: '刷新',
									onOk: () => {
										// callBack()
										dispatch(lsqcActions.saveBeginningBalance(curModifyBtn))
									},
									onCancel: () => {
										dispatch(lsqcActions.getBeginningList(true))
									}
								})
							}

						}}
					>
						刷新
					</Button>
					<Button
						className="title-right title-modify"
						type="ghost"
						onClick={() => {
							if (curModifyBtn === '') {
								// dispatch(lsqcActions.showQcye(false))
								dispatch(homeActions.addPageTabPane('ConfigPanes', 'Running', 'Running', '流水设置'))
								dispatch(homeActions.addHomeTabpane('Config', 'Running', '流水设置'))
							}else{
								const alertMessage = `“${modifyMoudleStr}”的期初余额未保存，是否保存后继续操作？`
								Modal.confirm({
									title: '提示',
									content: alertMessage,
									okText: '保存',
									cancelText: '放弃',
									onOk: () => {
										// callBack()
										dispatch(lsqcActions.saveBeginningBalance(curModifyBtn))
									},
									onCancel: () => {
											// dispatch(lsqcActions.showQcye(false))
											dispatch(lsqcActions.restoreModification(curModifyBtn))
											dispatch(homeActions.addPageTabPane('ConfigPanes', 'Running', 'Running', '流水设置'))
											dispatch(homeActions.addHomeTabpane('Config', 'Running', '流水设置'))
									}
								})
							}
						}}
					>
						返回
					</Button>
				</div>
			</FlexTitle>
		)
	}
}

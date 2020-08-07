import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'
import { cqzcAccountActions } from 'app/redux/Edit/Lrls/cqzcAccount'
import { ylProject, propertyCostObj, hxCom } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Cqzc extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
			showProject: true
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList, showProject } = this.state

		const data = yllsState.get('data')

		const flowNumber = data.get('flowNumber')
		const accountName = data.get('accountName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningStateName = {'STATE_CQZC_WF': '未付款', 'STATE_CQZC_YF': '已付款', 'STATE_CQZC_WS': '未收款', 'STATE_CQZC_YS': '已收款', 'STATE_CQZC_ZJTX': '长期资产折旧摊销'}[runningState]
		const categoryName = data.get('categoryName')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const isJzsy = runningState === "STATE_CQZC_JZSY" ? true : false
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')

		const acAssets = data.get('acAssets')
		const beManagemented = acAssets.get('beManagemented')//收付管理
		const businessList = data.get('businessList')

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acAssets, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		const assetType = data.get('assetType')
		const assetTypeName = {XZ_GJZC: '购进资产', XZ_CZZC: '处置', XZ_ZJTX: '资产折旧/摊销'}[assetType]

		const taxRate = data.get('taxRate')
		const tax = data.get('tax')
		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {
			billChecked = true
			fromNoToYes = true//从未认证到认证（或开票）
		} else {
			billChecked = billStates === 'bill_states_not_auth' ? true : false
		}

		let invoiceCom = null//发票
		let taxRateCom = null//税率组件
		let otherCom = null//其他票据

		const showAccount = runningState === 'STATE_CQZC_WF' || runningState === 'STATE_CQZC_WS' || assetType == 'XZ_ZJTX' ? false : true//是否显示账户

		;({
			'XZ_GJZC': () => {//购进资产
				if (!isJzsy && billType === 'bill_special') {
					invoiceCom = (<Row className='ylls-card lrls-padding-top'>
						<Row className='ylls-item'>
							<div>增值税专用发票</div>
							<div>税额：<Amount showZero>{tax}</Amount></div>
						</Row>
						<Row  className='ylls-item'>
							<div className='ylls-blue'>{fromNoToYes || billStates === 'bill_states_not_auth' ? '未认证' : '已认证' }</div>
							<div>税率：{ `${taxRate}%` }</div>
						</Row>
						{ fromNoToYes ? <Row>发票已认证 认证流水：{billList.getIn([0, 'flowNumber'])} </Row> : null }
					</Row>)
				}
				if (!isJzsy && billType === 'bill_other') {
					otherCom = <div className='ylls-padding'>票据：其他票据</div>
				}

			},
			'XZ_CZZC': () => {//处置
				if (!isJzsy && billType === 'bill_common' ) {
					invoiceCom = (<Row className='ylls-card lrls-padding-top'>
						<Row className='ylls-item'>
							<div>发票</div>
							<div>税额：<Amount showZero>{tax}</Amount></div>
						</Row>
						<Row  className='ylls-item'>
							<div className='ylls-blue'>{fromNoToYes || billStates === 'bill_states_not_make_out' ? '未开票' : '已开票' }</div>
							<div>税率：{ `${taxRate}%` }</div>
						</Row>
						{ fromNoToYes ? <Row>发票已开票 开票流水：{billList.getIn([0, 'flowNumber'])} </Row> : null }

					</Row>)
				}
				if (!isJzsy && billType === 'bill_other') {
					otherCom = <div className='ylls-padding'>票据：其他票据</div>
				}
			},
			'XZ_ZJTX': () => {//折旧摊销

			}
		}[assetType] || (() => null))()


		let bodyCom = null, HxCom = null, totalAmount = 0
		if (isJzsy) {
			const originalAssetsAmount = acAssets.get('originalAssetsAmount')// 资产原值
			const depreciationAmount = acAssets.get('depreciationAmount')// 折旧累计
			let totalAmount = Number(depreciationAmount) + Number(amount) - Number(originalAssetsAmount)

			bodyCom = <Row>
				<Row className='ylls-card'>
					<div className='ylls-padding'>资产结转</div>
					<div className='ylls-padding'>流水号：{flowNumber}</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>{totalAmount >= 0 ? '净收益金额：' : '净损失金额：'}<Amount showZero>{Math.abs(totalAmount)}</Amount></div>
					<div className='ylls-padding'>资产原值：<Amount showZero>{originalAssetsAmount}</Amount></div>
					<div className='ylls-padding'>累计折旧余额：<Amount showZero>{depreciationAmount}</Amount></div>
				</Row>

				<Row className='ylls-card'>
					<Row className='ylls-item'>
						<div>关联流水</div>
						<div></div>
					</Row>
					<Row className='ylls-item'>
						<div className='ylls-padding'>流水号：{businessList.getIn([0, 'flowNumber'])}</div>
						<div className='ylls-padding'>金额：<Amount showZero>{businessList.getIn([0, 'acAssets', 'cleaningAmount'])}</Amount></div>
					</Row>
					</Row>
			</Row>

		} else {
			let contactsCardCom = null
			if (beManagemented && assetType != 'XZ_ZJTX') {
				const contactsCardRange = acAssets.get('contactsCardRange')//往来关系卡片
				contactsCardCom = <div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>

				const paymentList = data.get('paymentList')
				if (paymentList.size) {
					let onClick = () => this.setState({'showList': !showList})
					HxCom = hxCom(paymentList, showList, onClick)
				}
			}

			bodyCom = <Row className='ylls-card'>
				<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
				<div className='ylls-item ylls-line'>
					<div className='ylls-gray'>流水号：{flowNumber}</div>
					<div>{runningStateName}</div>
				</div>
				<div className='ylls-padding'>处理类型： {assetTypeName} </div>
				{
					assetType == 'XZ_ZJTX' ? <div className='ylls-padding'>费用性质： {propertyCostName} </div> : null
				}
				<div className='ylls-padding'>摘要： {runningAbstract} </div>
				{/* 往来关系卡片 */}
				{ contactsCardCom }
				<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
				{ showAccount ? <div className='ylls-padding'>账户：{accountName} </div> : null }
				{ otherCom }
				{ (businessList && businessList.size) ? <div className='ylls-padding ylls-blue'> 资产已结转 结转流水：{businessList.getIn([0, 'flowNumber'])} </div> : null }
			</Row>
		}

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject && (isJzsy || assetType == 'XZ_ZJTX')) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick, false)
		}

		return(
			<ScrollView flex="1">
				{ bodyCom }
				{ ProjectCom }
				{/* 发票 */}
				{ invoiceCom }
				{/* 核销 */}
				{ HxCom }
				{
					data.get('enclosureList') && data.get('enclosureList').size ?
					<Ylfj
						enclosureList={data.get('enclosureList')}
						label={data.get('label')}
						dispatch={dispatch}
						history={history}
					/> : ''
				}
			</ScrollView>
		)
	}
}

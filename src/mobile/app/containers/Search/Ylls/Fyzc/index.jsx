import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { hxCom, propertyCostObj, ylProject } from 'app/containers/Edit/Lrls/components'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { fyzcAccountActions } from 'app/redux/Edit/Lrls/fyzcAccount'
import Ylfj from '../Ylfj'


@connect(state => state)
export default
class Fyzc extends React.Component {
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
		const flowNumber = yllsState.getIn(['data', 'flowNumber'])

		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const acCost = data.get('acCost')
		const beManagemented = acCost.get('beManagemented')//收付管理
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acCost, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		const billType = data.get('billType')
		const billStates = data.get('billStates')

		const taxRate = data.get('taxRate')
		const tax = data.get('tax')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {//未认证
			billChecked = true
			fromNoToYes = true//从未认证到认证
		} else {
			billChecked = billStates === 'bill_states_not_auth' ? true : false
		}

		let invoiceCom = null//发票
		if (billType == 'bill_special' && runningState != 'STATE_FY_DJ') {//发票
			invoiceCom = (<Row className='ylls-card lrls-padding-top'>
				<Row className='ylls-item'>
					<div>增值税专用发票</div>
					<div>税额：<Amount showZero>{tax}</Amount></div>
				</Row>
				<Row  className='ylls-item'>
					<div className='ylls-blue'>{billChecked ? '未认证' : '已认证'}</div>
					<div>税率：{ `${taxRate}%` }</div>
				</Row>
				{ fromNoToYes ? <Row> 发票已认证 认证流水：{billList.getIn([0, 'flowNumber'])} </Row> : null }
			</Row>)
		}
		let otherCom = null//其他票据
		if (runningState != 'STATE_FY_DJ' && billType === 'bill_other') {
			otherCom = <div className='ylls-padding'>票据：其他票据</div>
		}

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardRange = acCost.get('contactsCardRange')//往来关系卡片
			contactsCardCom = <div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>
		}

		let runningStateName = ''
		let showAccount = false//是否显示账户
		;({
			'STATE_FY_YF': () => {
				runningStateName = '已付款'
				showAccount = true
			},
			'STATE_FY_WF': () => {
				runningStateName = '未付款'
			},
			'STATE_FY_DJ': () => {
				runningStateName = '预付'
				showAccount = true
			}
		}[runningState] || (() => null))()

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject && runningState != 'STATE_FY_DJ') {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick)
		}

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					{ runningState != 'STATE_FY_DJ' ? <div className='ylls-padding'>费用性质： {propertyCostName} </div> : null }
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{/* 往来关系 */}
					{ contactsCardCom }
					<div className='ylls-padding'>金额：<Amount className='ylls-bold'>{amount}</Amount></div>
					{ showAccount ? <div className='ylls-padding'>账户：{accountName} </div> : null }
					{ otherCom }
				</Row>
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

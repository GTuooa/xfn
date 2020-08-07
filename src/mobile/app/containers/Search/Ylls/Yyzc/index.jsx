import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yyzcAccountActions } from 'app/redux/Edit/Lrls/yyzcAccount'
import { yllsActions } from 'app/redux/Ylls'
import { hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../Ylfj'


@connect(state => state)
export default
class Yyzc extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
			showProject: true
		}
    }
	// componentDidMount() {
	// 	this.props.dispatch(yllsActions.getYyzcPreAmount())
	// }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList, showProject } = this.state

		const data = yllsState.get('data')
		const preData = yllsState.get('preData')
		const flowNumber = yllsState.getIn(['data', 'flowNumber'])

		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const acBusinessExpense = data.get('acBusinessExpense')
		const beManagemented = acBusinessExpense.get('beManagemented')//收付管理
		const beDeposited = acBusinessExpense.get('beDeposited')//定金管理
		const propertyCarryover = data.get('propertyCarryover')
		const isHw = propertyCarryover=='SX_HW' ? true : false//是否是货物属性
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {//未认证
			billChecked = true
			fromNoToYes = true//从未认证到认证
		} else {
			billChecked = billStates === 'bill_states_not_auth' ? true : false
		}
		const taxRate = data.get('taxRate')
		const tax = data.get('tax')

		const preAmount = preData.get('preAmount')//预付款
		const receiveAmount = preData.get('receiveAmount')//应付款
		const offsetAmount = data.get('offsetAmount')//预付款 应付款 抵扣
		const currentAmount = data.get('currentAmount')//本次付 收 款

		let amountTitle = '总金额：'
		let handleAmountCom = null

		let invoiceCom = null//发票
		let taxRateCom = null//税率组件
		let runningStateName = ''//流水属性名称
		let stockCardCom = null
		let otherCom = null//其他票据

		const componentAss = () => {
			//存货卡片
			if (isHw) {//是货物
				const stockCardRange = acBusinessExpense.get('stockCardList')//存货卡片
				stockCardCom = <div>
					{
						stockCardRange.map((v, i) => {
							return (
								<div key={i}>
									<div  className='ylls-padding'>
										存货： {`${v.get('code')} ${v.get('name')}`}
									</div>
									<div  className='ylls-padding'>
										金额： <Amount>{v.get('amount')}</Amount>
									</div>
								</div>

							)
						})
					}
				</div>
			}

			if (billType == 'bill_special') {//增值税专用发票
				invoiceCom = (<Row className='ylls-card lrls-padding-top'>
					<Row className='ylls-item'>
						<div>增值税专用发票</div>
						<div>税额：<Amount showZero>{tax}</Amount></div>
					</Row>
					<Row  className='ylls-item'>
						<div className='ylls-blue'>{!billChecked ? '已认证' : '未认证'}</div>
						<div>税率：{ `${taxRate}%` }</div>
					</Row>
					{ fromNoToYes ? <Row> 发票已认证 认证流水：{billList.getIn([0, 'flowNumber'])} </Row> : null }
				</Row>)
			}
			if (billType === 'bill_other') {
				otherCom = <div className='ylls-padding'>票据：其他票据</div>
			}
		}


		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		let contactsCardCom = null//往来关系
		if (beManagemented) {//开启收付管理
			const contactsCardRange = acBusinessExpense.get('contactsCardRange')//往来关系卡片
			contactsCardCom = <div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>
		}

		let showAccount = false//是否显示账户
		let showPreAmount = false//是否显示预收预付
		;({
			'STATE_YYZC_DJ': () => {
				runningStateName = '预付'
				amountTitle = '预付金额：'
				showAccount = true
				showPreAmount = false
			},
			'STATE_YYZC_GJ': () => {
				componentAss()
				runningStateName = '购进'
				showAccount = beManagemented && currentAmount != amount ? false : true
				showPreAmount = beManagemented ? true : false
			},
			'STATE_YYZC_TG': () => {
				componentAss()
				runningStateName = '退购'
				showAccount = beManagemented && currentAmount != amount ? false : true
				showPreAmount = beManagemented ? true : false
			}
		}[runningState] || (() => null))()

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			ProjectCom = ylProject(projectCard, showProject, onClick, !isHw)
		}

		return(
			<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{/* 往来关系卡片 */}
					{ contactsCardCom }
					{/* 存货卡片 */}
					{ stockCardCom }
					<div className='ylls-padding'>{amountTitle}<Amount className='ylls-bold'>{amount}</Amount></div>
					{ showAccount ? <div className='ylls-padding'>账户：{accountName} </div> : null }
					{ otherCom }
				</Row>
				{ ProjectCom }
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

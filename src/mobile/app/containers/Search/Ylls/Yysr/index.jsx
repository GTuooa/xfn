import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yysrAccountActions } from 'app/redux/Edit/Lrls/yysrAccount'
import { hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import { yllsActions } from 'app/redux/Ylls'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Yysr extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
			showProject: true
		}
    }
	// componentDidMount() {
	// 	this.props.dispatch(yllsActions.getYysrPreAmount())
	// }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList, showProject } = this.state

        const accountName = yllsState.getIn(['data', 'accountName'])
		const data = yllsState.get('data')
		const preData = yllsState.get('preData')
		const flowNumber = yllsState.getIn(['data', 'flowNumber'])

		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const acBusinessIncome = data.get('acBusinessIncome')
		const beManagemented = acBusinessIncome.get('beManagemented')//收付管理
		const beDeposited = acBusinessIncome.get('beDeposited')//定金管理
		const propertyCarryover = data.get('propertyCarryover')
		const isHw = propertyCarryover=='SX_HW' ? true : false//是否是货物属性

		const beCarryover = acBusinessIncome.get('beCarryover')//结转成本
		const currentAmount = data.get('currentAmount')

		const runningBeCarryover = data.get('beCarryover')//录入流水是否开启结转成本
        const carryoverAmount = data.get('carryoverAmount')
		const billType = data.get('billType')
		const billStates = data.get('billStates')
		const billList = data.get('billList')
		let billChecked = false, fromNoToYes = false
		if (billList && billList.size) {//未开票
			billChecked = true
			fromNoToYes = true//从未开票到开票
		} else {
			billChecked = billStates === 'bill_states_not_make_out' ? true : false
		}

		const taxRate = data.get('taxRate')
		const tax = data.get('tax')

		const inAdvanceList = acBusinessIncome.get('inAdvanceList')//定金科目的辅助核算列表
		const businessList = data.get('businessList')

		const preAmount = preData.get('preAmount') //预收款
		const receiveAmount = preData.get('receiveAmount')//应收款
		const offsetAmount = data.get('offsetAmount')//抵扣

		let amountTitle = '总金额：'
		let handleAmountCom = null
		let carryoverCom = null//成本结转
		let invoiceCom = null//发票
		let taxRateCom = null//税率组件
		let preAmountCom = null
		let runningStateName = ''//流水属性
		let stockCardCom = null
		let otherCom = null//其他票据

		const componentAss = () => {
			//存货卡片
			if (isHw) {//是货物
				const stockCardRange = acBusinessIncome.get('stockCardList')//存货卡片
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

			if (billType == 'bill_common') {//发票
				invoiceCom = (<Row className='ylls-card lrls-padding-top'>
					<Row className='ylls-item'>
						<div>发票</div>
						<div>税额：<Amount showZero>{tax}</Amount></div>
					</Row>
					<Row  className='ylls-item'>
						<div className='ylls-blue'>{billChecked ? '未开票' : '已开票'}</div>
						<div>税率：{ `${taxRate}%` }</div>
					</Row>
					{ fromNoToYes ? <Row> 发票已开票 开票流水：{billList.getIn([0, 'flowNumber'])} </Row> : null }

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

		let showAccount = false//是否显示账户
		let showPreAmount = false//是否显示预收预付
		;({
			'STATE_YYSR_DJ': () => {
				runningStateName = '预收'
				showAccount = true
				showPreAmount = false
				amountTitle = '预收金额：'
			},
			'STATE_YYSR_XS': () => {
				componentAss()
				runningStateName = '销售'
				showAccount = beManagemented && currentAmount != amount ? false : true
				showPreAmount = beManagemented ? true : false
			},
			'STATE_YYSR_TS': () => {
				componentAss()
				runningStateName = '退销'
				showAccount = beManagemented && currentAmount != amount ? false : true
				showPreAmount = beManagemented ? true : false
			}
		}[runningState] || (() => null))()

		let contactsCardCom = null
		if (beManagemented) {
			const contactsCardRange = acBusinessIncome.get('contactsCardRange')//往来关系卡片
			contactsCardCom = <div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>
		}

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
			const projectCard = data.get('projectCard')
			let onClick = () => this.setState({'showProject': !showProject})
			if (isHw) {
				let showName = `${projectCard.getIn([0, 'code'])} ${projectCard.getIn([0, 'name'])}`
                if (projectCard.getIn([0, 'name']) == '项目公共费用') {
                    showName = '项目公共费用'
                }
				ProjectCom = <div className='ylls-padding'>项目：{showName}</div>
			} else {
				ProjectCom = ylProject(projectCard, showProject, onClick, !isHw)
			}
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
					{ isHw ? ProjectCom : null }
					{/* 往来关系卡片 */}
					{ contactsCardCom }
					{/* 存货卡片 */}
					{ stockCardCom }
					<div className='ylls-padding'>{amountTitle}<Amount className='ylls-bold'>{amount}</Amount></div>
					{ showAccount ? <div className='ylls-padding'>账户：{accountName} </div> : null }
					{ otherCom }
				</Row>
				{ isHw ? null : ProjectCom }
				{/* 成本结转 */}
				{ carryoverCom }
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

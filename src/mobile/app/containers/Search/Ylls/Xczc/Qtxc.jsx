import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Icon, Row, ScrollView, Amount } from 'app/components'
import { propertyCostObj, hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Qtxc extends React.Component {
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
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const propertyPay = data.get('propertyPay')//薪酬属性
		const acPayment = data.get('acPayment')
		const beAccrued = acPayment.get("beAccrued")// 是否计提
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		let showPropertyCost = false//是否显示费用性质
		let showAccount = false //是否显示账户
		let shouldGetAmount = false//是否获取未处理金额
		let showJtAmount = false //是否显示待发放薪酬
		let runningStateName = ''

		;({
			'STATE_XC_JT': () => {//计提
				showPropertyCost = true
				runningStateName = '计提'
			},
			'STATE_XC_FF': () => {
				//开启计提 发放 不显示费用性质
				showPropertyCost = beAccrued ? false : true
				showAccount = true
				shouldGetAmount = beAccrued ? true : false
				// accruedCom = beAccrued ? accruedCom : null
				showJtAmount = beAccrued ? true : false
				runningStateName = '发放'
			}
		}[runningState] || (() => null))()

		let ProjectCom = null//项目组件
		const usedProject = data.get('usedProject')
		if (usedProject) {
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
					{	//费用性质
						showPropertyCost ? <div className='ylls-padding'>费用性质：{propertyCostName}</div> : null
					}
					<div className='ylls-padding'>摘要： {runningAbstract} </div>

					{/* 金额组件 */}
					<div className='ylls-padding'>
						金额：<Amount showZero className='ylls-bold'>{amount}</Amount>
					</div>

					{ showAccount ? <div className='ylls-padding'>账户：{accountName}</div> : null }

				</Row>
				{ ProjectCom }
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

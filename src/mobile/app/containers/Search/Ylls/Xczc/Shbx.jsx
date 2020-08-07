import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Icon, Container, ScrollView, Amount, Row } from 'app/components'
import { propertyCostObj, hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Shbx extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bePersonSocialSecurity: false, // 社保(个人部分)
			showList: false,
			showProject: true
        }
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { bePersonSocialSecurity, showList, showProject } = this.state

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')

		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const propertyPay = data.get('propertyPay')//薪酬属性
		const acPayment = data.get('acPayment')
		const beAccrued = acPayment.get("beAccrued")// 是否计提
		const beWithholdSocial = acPayment.get("beWithholdSocial")// 是否代扣代缴
		const actualAmount = acPayment.get("actualAmount")// 支付金额
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const amount = data.get('amount')
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		//核销组件
		let HxCom = null
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}

		let showPropertyCost = false//是否显示费用性质
		let amountName = '金额'
		let showAccount = false //是否显示账户
		let shouldGetAmount = false//是否获取未处理金额
		let runningStateName = ''

		//金额组件
		let amountCom = null
		let socialSecurityCom = null//社保

		;({
			'STATE_XC_JT': () => {//计提
				runningStateName = '计提'
				showPropertyCost = true
				amountName = '金额(公司部分)'
				amountCom = <div>
					<div className='ylls-padding'>
						{amountName}： <Amount showZero>{amount}</Amount>
					</div>

					{ showAccount ? <div className='ylls-padding'>
						账户：{accountName}</div> : null }
				</div>
			},
			'STATE_XC_JN': () => {
				runningStateName = '缴纳'
				//开启计提 发放 不显示费用性质
				showPropertyCost = beAccrued ? false : true
				showAccount = true
				shouldGetAmount = beAccrued ? true : false

				if (beAccrued) {
					const personSocialSecurityAmount = acPayment.get('personSocialSecurityAmount') // 社保(个人部分)
					const companySocialSecurityAmount = acPayment.get('companySocialSecurityAmount') // 社保(公司部分)

					amountCom = <div>
						<Row className='ylls-padding'>
							支付金额：
							<Amount showZero className='ylls-blod'>{actualAmount}</Amount>
						</Row>
						<div className='ylls-padding'>账户：{accountName}</div>
						<Row className='ylls-padding'>
							社保金额(公司部分)：
							<Amount showZero>{companySocialSecurityAmount}</Amount>
						</Row>
					</div>

					socialSecurityCom = (beWithholdSocial && personSocialSecurityAmount) ? <Row className='ylls-card'>
						<Row className='ylls-padding'>
							代缴部分
						</Row>
						<Row className='ylls-padding ylls-top-line'>
							金额(个人部分金额)：
								<Amount showZero>{personSocialSecurityAmount}</Amount>
						</Row>
					</Row> : null

				} else {
					amountCom = <Row>
						<div className='ylls-padding'> {amountName}： <Amount showZero>{amount}</Amount></div>
						{ showAccount ? <div className='ylls-padding'>账户：{accountName}</div> : null }
					</Row>
				}
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
				<div className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					{	//费用性质
						showPropertyCost ? <div className='ylls-padding'>费用性质：{propertyCostName}</div> : null
					}
					<div className='ylls-padding'>摘要：{runningAbstract}</div>
					{/* 金额组件 */}
					{ amountCom }
				</div>
				{ ProjectCom }
				{/* 代扣个人社保 */}
				{ socialSecurityCom }
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

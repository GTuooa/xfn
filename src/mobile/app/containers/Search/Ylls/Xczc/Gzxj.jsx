import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { propertyCostObj, hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { yllsActions } from 'app/redux/Ylls'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Gzxj extends React.Component {
	componentDidMount() {
		this.props.dispatch(yllsActions.getXczcAccumulationAmount())
		this.props.dispatch(yllsActions.getXczcSocialSecurityAmount())
	}
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
		const propertyPay = data.get('propertyPay')//薪酬属性
		const acPayment = data.get('acPayment')
		const beAccrued = acPayment.get("beAccrued")// 是否计提
		const beWithholding = acPayment.get("beWithholding")// 是否代扣代缴住房公积金
		const beWithholdSocial = acPayment.get("beWithholdSocial")// 是否代扣代缴社保
		const beWithholdTax = acPayment.get("beWithholdTax")// 是否代扣代缴个税
		const actualAmount = acPayment.get("actualAmount")// 支付金额
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		//费用性质
		const propertyCost = data.get('propertyCost')
		const costObj = propertyCostObj(acPayment, propertyCost)
		const propertyCostName = costObj.get('propertyCostName')

		let fundCom = null//公积金辅助核算
		let socialSecurityCom = null//社保
		let incomeTaxCom = null//个税

		let showPropertyCost = false//是否显示费用性质
		let amountName = '金额'
		let autoCalculate = false//计算支付金额
		let shouldGetAmount = false//是否获取未处理金额
		let runningStateName = ''

		//金额组件
		let amountCom = null

		;({
			'STATE_XC_JT': () => {//计提
				showPropertyCost = true
				amountName = '金额(公司部分)'
				runningStateName = '计提'
				amountCom = <div className='ylls-padding'>
					{amountName}：<Amount showZero>{amount}</Amount>
				</div>
			},
			'STATE_XC_FF': () => {
				//开启计提 发放 不显示费用性质
				showPropertyCost = beAccrued ? false : true
				amountName = beAccrued ? '工资薪金' : '金额'
				autoCalculate = beAccrued ? true : false
				shouldGetAmount = beAccrued ? true : false
				// accruedCom = beAccrued ? accruedCom : null
				runningStateName = '发放'
				if (beAccrued) {
					amountCom = <div>
						<div className='ylls-padding'> 支付金额： <Amount showZero className='ylls-bold'>{actualAmount}</Amount></div>
						<div className='ylls-padding'>账户：{accountName}</div>
						<div className='ylls-padding'>工资薪金： <Amount showZero>{amount}</Amount></div>
					</div>

					// if (paymentList.size) {
					// 	let onClick = () => this.setState({'showList': !showList})
					// 	HxCom = hxCom(paymentList, showList, onClick)
					// }

					const personAccumulationAmount = acPayment.get('personAccumulationAmount')// 公积金(个人部分)
					const accumulationAmount = data.get('accumulationAmount')
					const personSocialSecurityAmount = acPayment.get('personSocialSecurityAmount') // 社保(个人部分)
					const socialSecurityAmount = data.get('socialSecurityAmount')
					const incomeTaxAmount = acPayment.get('incomeTaxAmount') // 个人所得税

					fundCom = (beWithholding && personAccumulationAmount) ? <Row className='ylls-padding'>
							个人公积金：<Amount showZero>{personAccumulationAmount}</Amount>
						</Row> : null

					socialSecurityCom = (beWithholdSocial && personSocialSecurityAmount) ? <Row className='ylls-padding'>
							个人社保：<Amount showZero>{personSocialSecurityAmount}</Amount>
						</Row> : null

					incomeTaxCom = (beWithholdTax && incomeTaxAmount) ? <Row className='ylls-padding'>
							个人所得税：<Amount showZero>{incomeTaxAmount}</Amount>
						</Row> : null

				} else {
					amountCom = <div>
						<div className='ylls-padding'>{amountName}：<Amount showZero>{amount}</Amount></div>
						<div className='ylls-padding'>账户：{accountName} </div>
					</div>
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

		let HxCom = null//核销组件
		const paymentList = data.get('paymentList')
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick)
		}


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>
					{showPropertyCost ? <div className='ylls-padding'>费用性质： {propertyCostName} </div> : null}
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					{/* 金额组件 */}
					{ amountCom }
				</Row>
				{ ProjectCom }
				{
					(fundCom || socialSecurityCom || incomeTaxCom) ? <Row className='ylls-card'>
						<div className='ylls-line'>代扣部分</div>
						{/* 代扣个人公积金 */}
						{ fundCom }
						{/* 代扣个人社保 */}
						{ socialSecurityCom }
						{/* 代扣个人所得税 */}
						{ incomeTaxCom }
					</Row> : null
				}

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

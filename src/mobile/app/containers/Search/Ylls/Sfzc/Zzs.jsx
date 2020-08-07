import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { hxCom } from 'app/containers/Edit/Lrls/components'
import { decimal } from 'app/utils'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Zzs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
        }
    }

	render () {
		const { yllsState, dispatch, history } = this.props
		const { showList } = this.state

		const data = yllsState.get('data')
		const flowNumber = yllsState.getIn(['data', 'flowNumber'])
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const handleAmount = data.get('handleAmount')//支付金额
		const offsetAmount = data.get("offsetAmount")// 预交抵扣金额
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const reduceAmount = data.get('reduceAmount')//减免金额
		const totalPay = Number(offsetAmount) + Number(handleAmount) + Number(reduceAmount)//税费总额
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const propertyTax = data.get('propertyTax')//属性
		const acTax = data.get('acTax')
		const beInAdvance = acTax.get("beInAdvance")// 是否预交增值税
		const paymentList = data.get('paymentList')
		const usedReduce =  data.get("beReduce")// 流水中是否开启减免

		let amountCom = null//金额组件
		let yjCom = null//预交组件
		let lsCom = null//税费总额组件
		let runningStateName = ''
		let reduceCom = null//税费减免组件

		;({
			'STATE_SF_JN': () => {//缴纳
				runningStateName = '缴纳'
				amountCom = <Row>
					<div className='ylls-padding'> 支付金额： <Amount showZero>{handleAmount}</Amount></div>
					{ handleAmount > 0 ? <div className='ylls-padding'> 账户： {accountName}</div> : null}
				</Row>

				lsCom = <div className='ylls-padding'>税费总额：<Amount showZero>{decimal(totalPay)}</Amount></div>

				if (beInAdvance && offsetAmount) {//开启预交
					yjCom = <Row className='ylls-card'>
						<div className='ylls-padding'>预交抵扣： <Amount showZero>{offsetAmount}</Amount></div>
					</Row>
				}

				if (usedReduce) {//开启减免
					reduceCom = <Row className='ylls-card'>
						<div className='ylls-padding'>税费减免： <Amount showZero>{reduceAmount}</Amount></div>
					</Row>
				}


			},
			'STATE_SF_YJZZS': () => {//预缴增值税
				runningStateName = '预缴增值税'
				amountCom = <Row>
					<div  className='ylls-padding'>金额：<Amount showZero>{amount}</Amount></div>
					<div  className='ylls-padding'>账户：{accountName}</div>
				</Row>
			}
		}[runningState] || (() => null))()

		let HxCom = null
		if (paymentList.size) {
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, '未交增值税')
		}


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>

					<div className='ylls-padding'>摘要：{runningAbstract}</div>
					{ lsCom }
					{/* 金额组件 */}
					{ amountCom }
				</Row>
				{/* 预交 */}
				{ yjCom }
				{/* 减免 */}
				{ reduceCom }
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

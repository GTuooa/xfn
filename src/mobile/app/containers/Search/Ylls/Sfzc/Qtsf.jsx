import React from 'react'
import { connect }	from 'react-redux'
import { Row, Icon, ScrollView, Amount } from 'app/components'
import { hxCom, ylProject } from 'app/containers/Edit/Lrls/components'
import Ylfj from '../Ylfj'

@connect(state => state)
export default
class Qtsf extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false,
			showProject: true
        }
    }

	render () {
		const { yllsState, dispatch, history } = this.props
		const { showList, showProject } = this.state

		const data = yllsState.get('data')
		const flowNumber = data.get('flowNumber')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningState = data.get('runningState')
		const runningAbstract = data.get('runningAbstract')
		const accountName = data.get('accountName')
		const amount = data.get('amount')
		const jtAmount = data.get('jtAmount')//所勾选的计提流水的总额
		const parentCategoryList = data.get('parentCategoryList').toJS()
		parentCategoryList.push(categoryName)

		const propertyTax = data.get('propertyTax')//属性
		const acTax = data.get('acTax')
		const beAccrued = acTax.get("beAccrued")// 是否计提
		const paymentList = data.get('paymentList')

		let showAccount = false
		let runningStateName = ''
		let reduceCom = null

		;({
			'STATE_SF_JT': () => {//计提
				showAccount = false
				runningStateName = '计提'
			},
			'STATE_SF_JN': () => {//缴纳
				showAccount = amount > 0 ? true : false
				runningStateName = '缴纳'
				const usedReduce =  data.get("beReduce")// 流水中是否开启减免
				const reduceAmount =  data.get("reduceAmount")
				if (usedReduce) {//开启减免
					reduceCom = <Row className='ylls-card'>
						<div className='ylls-padding'>税费减免： <Amount showZero>{reduceAmount}</Amount></div>
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

		let HxCom = null//核销组件
		if (beAccrued && paymentList.size) {//开启计提
			let onClick = () => this.setState({'showList': !showList})
			HxCom = hxCom(paymentList, showList, onClick, propertyTax === 'SX_QTSF' ? '计提其他税费' : '计提企业所得税')
		}

		return(
			<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
				<Row className='ylls-card'>
					<div className='overElli ylls-bold'>{parentCategoryList.join('_')}</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningStateName}</div>
					</div>

					<div className='ylls-padding'>摘要：{runningAbstract}</div>
					{/* 金额组件 */}
					<div className='ylls-padding'>金额：<Amount showZero>{amount}</Amount></div>
					{ showAccount ? <div className='ylls-padding'>账户：{accountName}</div> : null }
				</Row>
				{ reduceCom }
				{ ProjectCom }
				{/* 核销组件 */}
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

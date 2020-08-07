import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { decimal } from 'app/utils'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class KjfpLs extends React.Component {

	render () {
		const { dispatch, editRunningState } = this.props
		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const inputTax = editRunningState.getIn(['oriTemp', 'inputTax'])//开具发票直接输税额  false 输价税合计计算税额

		let countNumber = 0
		let totalAmount = 0
		let jrTaxAmount = 0
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += Math.abs(v.get('notHandleAmount'))
				jrTaxAmount += Math.abs(v.get('oriAmount'))
			}
		})

		return(
			<Container className="edit-running">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						pendingStrongList.map((v, i) => {
							const taxRate = v.get('taxRate') == -1 ? '**' : v.get('taxRate')
							return (
								<Row
									key={i}
									className='jr-card'
									onClick={() => {
										if (v.get('beSelect')) {
											dispatch(editRunningActions.pendingStrongListBeSelect(i, false))
										} else {
											dispatch(editRunningActions.pendingStrongListBeSelect(i, true))
										}
									}}
								>
									<div className='jr-item jr-line'>
										<span>
											<Checkbox style={{'paddingRight': '10px'}} checked={v.get('beSelect') ? true : false}/>
											{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')} 号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>

									<div className='jr-item'>
										<span className='overElli'>摘要：{v.get('oriAbstract')}</span>
									</div>

									<div className='jr-item'>
										<span className='overElli'>{v.get('categoryName')}</span>
										<Amount showZero className='hx-bold'>{Math.abs(v.get('notHandleAmount'))}</Amount>
									</div>

									{
										v.get('beOpened') ? null : <div className='jr-item'>
												<span>
													价税合计：<Amount showZero>{v.get('oriAmount')}</Amount>
												</span>
												<span>税率：{`${taxRate}%`}</span>
											</div>
									}
								</Row>
							)
						})
					}

				</ScrollView>
				<div className='jr-card hx-top-line' style={{display: countNumber > 0 ? '' : 'none'}}>
					<div className='jr-item'>
						<span>已勾选流水：{countNumber}条</span>
						<span>待开发票税额：<Amount showZero>{totalAmount}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
						if (countNumber > 160) { return thirdParty.Alert('勾选的核销流水不能超过160条') }
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], decimal(totalAmount)))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrTaxAmount'], decimal(jrTaxAmount)))
						if (countNumber==1) {
							if (inputTax==false) {
								dispatch(editRunningActions.changeLrlsData(['oriTemp', 'taxTotal'], decimal(jrTaxAmount)))
							}
						} else {
							dispatch(editRunningActions.changeLrlsData(['oriTemp', 'inputTax'], true))
						}
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

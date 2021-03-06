import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import { tzAccountActions } from 'app/redux/Edit/Lrls/Qtls/tzAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class TzLs extends React.Component {

	render () {
		const { dispatch, tzAccountState } = this.props
		const paymentList = tzAccountState.getIn(['data', 'paymentList'])

		let countNumber = 0
		let totalAmount = 0
		paymentList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('notHandleAmount')
			}
		})

		return(
			<Container className="lrls">
				<ul className='lrls-row xczc-ls'>
					<li>已勾选流水：{countNumber}条</li>
					<li>待收入金额：<Amount showZero>{totalAmount}</Amount></li>
				</ul>
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						paymentList.map((v, i) => {
							return (
								<Row
									key={i}
									className='lrls-card'
									onClick={() => {
										if (v.get('beSelect')) {
											dispatch(tzAccountActions.paymentListBeSelect(i, false))
										} else {
											dispatch(tzAccountActions.paymentListBeSelect(i, true))
										}
									}}
								>
									<div className='xczc-ls-line xczc-ls-top'>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
											/>
											{v.get('flowNumber')}
										</span>
										<span className='xczc-ls-color'>{v.get('runningDate')}</span>
									</div>
									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											摘要：{v.get('runningAbstract')}
										</span>
										<Amount showZero>{v.get('notHandleAmount')}</Amount>
									</div>
									<div className='xczc-ls-line xczc-ls-bottom'>
										<span className='xczc-ls-color'> 计提股利</span>
									</div>
								</Row>
							)
						})
					}
				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_TZ'))
						dispatch(tzAccountActions.changeTzData('amount', totalAmount))
						dispatch(tzAccountActions.changeTzData('jtAmount', totalAmount))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

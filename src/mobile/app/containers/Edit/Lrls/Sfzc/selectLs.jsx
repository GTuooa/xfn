import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { sfzcAccountActions } from 'app/redux/Edit/Lrls/sfzcAccount'

@connect(state => state)
export default
class SfzcLs extends React.Component {

	render () {
		const { dispatch, sfzcAccountState } = this.props

		const paymentList = sfzcAccountState.getIn(['data', 'paymentList'])
		const propertyTax = sfzcAccountState.getIn(['data', 'propertyTax'])//税费属性
		const isQtsf = (propertyTax == 'SX_QTSF' ||  propertyTax == 'SX_QYSDS') ? true : false
		let stateType = '未交增值税'
		if (propertyTax == 'SX_QTSF') {
			stateType = '计提其他税费'
		}
		if (propertyTax == 'SX_QYSDS') {
			stateType = '计提企业所得税'
		}

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
					<li>合计金额：<Amount showZero>{totalAmount}</Amount></li>
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
											dispatch(sfzcAccountActions.paymentListBeSelect(i, false))
										} else {
											dispatch(sfzcAccountActions.paymentListBeSelect(i, true))
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
											{v.get('runningAbstract')}
										</span>
										<Amount showZero>{v.get('notHandleAmount')}</Amount>
									</div>
									<div className='xczc-ls-line xczc-ls-bottom'>
										<span className='xczc-ls-color'>
											{stateType}
										</span>
									</div>
								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_SFZC'))
						dispatch(sfzcAccountActions.changeSfzcData('jtAmount', totalAmount))
						if (isQtsf) {
							dispatch(sfzcAccountActions.changeSfzcData('amount', totalAmount))
						} else {
							dispatch(sfzcAccountActions.changeSfzcData('handleAmount', totalAmount))
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

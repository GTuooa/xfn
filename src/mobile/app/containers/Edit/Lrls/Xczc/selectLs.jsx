import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { xczcAccountActions } from 'app/redux/Edit/Lrls/xczcAccount'
import './index.less'

@connect(state => state)
export default
class Xczc extends React.Component {

	render () {
		const { dispatch, xczcAccountState } = this.props

		const paymentList = xczcAccountState.getIn(['data', 'paymentList'])
		const propertyPay = xczcAccountState.getIn(['data', 'propertyPay'])
		const runningStateTitle = {
            SX_GZXJ: '计提工资薪金',
            SX_SHBX: '计提社会保险',
            SX_QTXC: '计提其他薪酬',
            SX_ZFGJJ: '计提公积金'
        }[propertyPay]

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
											dispatch(xczcAccountActions.paymentListBeSelect(i, false))
										} else {
											dispatch(xczcAccountActions.paymentListBeSelect(i, true))
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
										<span className='xczc-ls-color'>
											{runningStateTitle}
										</span>
									</div>
								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_XCZC'))
						dispatch(xczcAccountActions.changeXczcData('amount', totalAmount))
						dispatch(xczcAccountActions.xczcPersonAmount('companySocialSecurityAmount', totalAmount))
						dispatch(xczcAccountActions.xczcPersonAmount('companyAccumulationAmount', totalAmount))
						dispatch(xczcAccountActions.changeXczcData('jtAmount', totalAmount))
						dispatch(xczcAccountActions.autoCalculateAmount(propertyPay))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { jzsyAccountActions } from 'app/redux/Edit/Lrls/Hsgl/jzsyAccount'

@connect(state => state)
export default
class JzsyLs extends React.Component {

	render () {
		const { dispatch, jzsyAccountState } = this.props
		const hxList = jzsyAccountState.get('hxList')

		let countNumber = 0
		let totalAmount = 0
		hxList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('amount')
			}
		})

		return(
			<Container className="lrls">

				<ul className='lrls-row xczc-ls'>
					<li>已勾选流水：{countNumber}条</li>
					<li>处置收入金额：<Amount showZero>{totalAmount}</Amount></li>
				</ul>
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						hxList.map((v, i) => {
							return (
								<Row
									key={i}
									className='lrls-card'
									onClick={() => {
										if (v.get('beSelect')) {
											dispatch(jzsyAccountActions.jzsyHxListBeCheck(i, false))
										} else {
											dispatch(jzsyAccountActions.jzsyHxListBeCheck(i, true))
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
											{v.get('categoryName')}
										</span>
										<Amount showZero>{v.get('amount')- Number(v.get('tax'))}</Amount>
									</div>

									{/* <div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli xczc-ls-color'>
											摘要：{v.get('runningAbstract')}
										</span>
										<span></span>
									</div>

									<div className='xczc-ls-line xczc-ls-center'>
										<div></div>
										<div>
											<span style={{paddingRight: '10px'}}>
												价税合计：<Amount showZero>{v.get('amount')}</Amount>
											</span>
											税率：{`${v.get('taxRate')}%`}
										</div>
									</div> */}
								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_JZSY'))
						dispatch(jzsyAccountActions.changeJzsyData(['data', 'amount'], totalAmount))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

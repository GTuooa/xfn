import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { jzcbAccountActions } from 'app/redux/Edit/Lrls/Hsgl/jzcbAccount'

@connect(state => state)
export default
class JzcbLs extends React.Component {

	render () {
		const { dispatch, jzcbAccountState } = this.props

		const data = jzcbAccountState.get('data')
		const insertOrModify = jzcbAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const hxList = jzcbAccountState.get('hxList')
		const runningState = jzcbAccountState.getIn(['data', 'runningState'])
		const titleName = runningState === 'STATE_YYSR_XS' ? '收入金额合计：' : '退销金额合计：'

		let countNumber = 0
		let totalAmount = 0
		hxList.forEach(v => {
			if (v.get('isCheck')) {
				countNumber++
				totalAmount += v.get('amount')
			}
		})

		return(
			<Container className="lrls">

				<ul className='lrls-row xczc-ls'>
					<li>已勾选流水：{countNumber}条</li>
					<li>{titleName}<Amount showZero>{totalAmount}</Amount></li>
				</ul>
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						hxList.map((v, i) => {
							return (
								<Row
									key={i}
									className='lrls-card'
									onClick={() => {
										if (v.get('isCheck')) {
											dispatch(jzcbAccountActions.jzcbHxListBeCheck(i, false))
										} else {
											dispatch(jzcbAccountActions.jzcbHxListBeCheck(i, true))
										}
									}}
								>
									<div className='xczc-ls-line xczc-ls-top'>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('isCheck') ? true : false}
												onChange={() => {}}
											/>
											{v.get('flowNumber')}
										</span>
										<span className='xczc-ls-color'>{v.get('runningDate')}</span>
									</div>
									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											{v.get('categoryName')}
										</span>
										<Amount showZero>{v.get('amount')}</Amount>
									</div>
									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											摘要：{v.get('runningAbstract')}
										</span>
										<span></span>
									</div>
									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											{v.get('cardStockName')}
										</span>
										<span></span>
									</div>
								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_JZCB'))
						dispatch(jzcbAccountActions.changeJzcbData('totalAmount', totalAmount))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

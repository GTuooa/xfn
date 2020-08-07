import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'

import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { ggfyftAccountActions } from 'app/redux/Edit/Lrls/Hsgl/ggfyftAccount'

@connect(state => state)
export default
class JzcbLs extends React.Component {

	render () {
		const { dispatch, ggfyftAccountState } = this.props

		const data = ggfyftAccountState.get('data')
		const insertOrModify = ggfyftAccountState.getIn(['views', 'insertOrModify'])
		const isModify = insertOrModify === 'modify' ? true : false

		const hxList = ggfyftAccountState.get('hxList')

		let countNumber = 0
		let totalAmount = 0
		let hasBeSelect = false
		hxList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('amount')
				hasBeSelect = true
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
						hxList.map((v, i) => {
							let disabled = false
							if (hasBeSelect && totalAmount * v.get('amount') < 0) {//同正同负可以被选中
								disabled = true
							}
							return (
								<Row
									key={i}
									className='lrls-card'
									onClick={() => {
										if (disabled) {
											return
										}
										if (v.get('beSelect')) {
											dispatch(ggfyftAccountActions.hxListBeSelect(i, false))
										} else {
											dispatch(ggfyftAccountActions.hxListBeSelect(i, true))
										}
									}}
								>
									<div className='xczc-ls-line xczc-ls-top'>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
												onChange={() => {}}
												disabled={disabled}
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
									<div className='xczc-ls-line xczc-ls-bottom'>
										<span className='xczc-ls-color'>
											{Common.runningType[v.get('runningType')]}
										</span>
									</div>
								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_GGFYFT'))
						dispatch(ggfyftAccountActions.changeGgfyftData('totalAmount', totalAmount))
						dispatch(ggfyftAccountActions.autoCalculate())
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}

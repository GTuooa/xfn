import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import { decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class JkLs extends React.Component {

	render () {
		const { dispatch, editRunningState } = this.props
		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])

		let countNumber = 0
		let totalAmount = 0
		pendingStrongList.forEach(v => {
			if (v.get('beSelect')) {
				countNumber++
				totalAmount += v.get('notHandleAmount')
			}
		})

		return(
			<Container className="edit-running">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						pendingStrongList.map((v, i) => {
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
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('beSelect') ? true : false}
											/>
											{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}
										</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>
									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>
									<div className='jr-item'>
										<span>{v.get('jrJvTypeName')}</span>
										<Amount showZero className='hx-bold'>{v.get('notHandleAmount')}</Amount>
									</div>
								</Row>
							)
						})
					}
				</ScrollView>
				<div className='jr-card hx-top-line' style={{display: countNumber > 0 ? '' : 'none'}}>
					<div className='jr-item'>
						<span>已勾选流水：{countNumber}条</span>
						<span>待支付金额：<Amount showZero>{totalAmount}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
						if (countNumber > 160) { return thirdParty.Alert('勾选的核销流水不能超过160条') }
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], decimal(totalAmount)))
						dispatch(editRunningActions.changeLrlsData(['oriTemp', 'jrAmount'], decimal(totalAmount)))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

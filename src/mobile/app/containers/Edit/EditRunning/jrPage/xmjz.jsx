import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { decimal } from 'app/utils'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

@connect(state => state)
export default
class Xmjz extends React.Component {

	render () {
		const { dispatch, editRunningState } = this.props
		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])
		const projectProperty = editRunningState.getIn(['oriTemp', 'projectCardList', 0, 'projectProperty'])
		let allHappenAmount = 0, allStoreAmount = 0
		let leftName = '发生金额:', rightName = '已入库金额:'

		return(
			<Container className="edit-running">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						pendingStrongList.map((v, i) => {
							const happenAmount = v.get('happenAmount')
							const storeAmount = v.get('storeAmount')
							const direction = v.get('direction')
							
							if (projectProperty=='XZ_CONSTRUCTION') {
								leftName = direction == 'debit' ? '待确认收入' : '已确认收入'
								rightName = direction == 'debit' ? '待确认成本' : '已确认成本'
								if (direction == 'debit') {
									if (happenAmount) {
										allHappenAmount += Number(happenAmount)
									}
									if (storeAmount) {
										allStoreAmount += Number(storeAmount)
									}
								}
								if (direction == 'credit') {
									if (happenAmount) {
										allHappenAmount -= Number(happenAmount)
									}
									if (storeAmount) {
										allStoreAmount -= Number(storeAmount)
									}
								}
							} else {
								if (happenAmount) {
									allHappenAmount += Number(happenAmount)
								}
								if (storeAmount) {
									allStoreAmount += Number(storeAmount)
								}
							}

							return (
								<Row key={i} className='jr-card'>
									<div className='jr-item jr-line'>
										<span>{v.get('beOpened') ? '期初值' : `${v.get('jrIndex')}号`}</span>
										<span className='lrls-placeholder'>{v.get('oriDate')}</span>
									</div>

									<div className='jr-item'>
										<span className='overElli'>
											{v.get('categoryName')}
										</span>
									</div>

									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>

									<div className='jr-item'>
                                        <div>{happenAmount ? leftName : null} <Amount className='hx-bold'>{happenAmount}</Amount></div>
                                        <div>{storeAmount ? rightName : null} <Amount className='hx-bold'>{storeAmount}</Amount></div>
                                    </div>
								</Row>
							)
						})
					}

				</ScrollView>
				<div className='jr-card hx-top-line'>
					<div className='jr-item'>
						<span>{projectProperty=='XZ_CONSTRUCTION' ? '待确认收入净额' : leftName} <Amount showZero>{decimal(allHappenAmount)}</Amount></span>
						<span>{projectProperty=='XZ_CONSTRUCTION' ? '待确认成本净额' : rightName} <Amount showZero>{decimal(allStoreAmount)}</Amount></span>
					</div>
				</div>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(editRunningActions.changeLrlsData(['views', 'showJrPage'], false))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

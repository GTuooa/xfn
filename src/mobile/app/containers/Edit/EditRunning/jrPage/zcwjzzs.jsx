import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ButtonGroup, Button, Container, ScrollView, Amount } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

@connect(state => state)
export default
class ZcwjzzsLs extends React.Component {

	render () {
		const { dispatch, editRunningState } = this.props
		const pendingStrongList = editRunningState.getIn(['oriTemp', 'pendingStrongList'])

		return(
			<Container className="edit-running">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						pendingStrongList.map((v, i) => {
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
										<Amount showZero>{v.get('taxAmount')}</Amount>
									</div>

									<div className='jr-item'>
										<span className='overElli'>
											摘要：{v.get('oriAbstract')}
										</span>
									</div>

									<div className='jr-item'>
										<span className=''>
											{v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX' ? '销项税' : '进项税'}
										</span>
										<div>
											<span>
												价税合计：<Amount showZero>{v.get('oriAmount')}</Amount>
											</span>
										</div>
									</div>
								</Row>
							)
						})
					}
				</ScrollView>
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

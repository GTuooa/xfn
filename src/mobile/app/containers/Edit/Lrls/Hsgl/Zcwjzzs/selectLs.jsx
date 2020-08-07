import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, ButtonGroup, Button, Container, ScrollView, Amount } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'

@connect(state => state)
export default
class ZcwjzzsLs extends React.Component {

	render () {
		const { dispatch, zcwjzzsAccountState } = this.props
		const flowDtoList = zcwjzzsAccountState.getIn(['hxList', 'flowDtoList'])

		return(
			<Container className="lrls">
				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						flowDtoList.map((v, i) => {
							return (
								<Row key={i} className='lrls-card'>
									<div className='xczc-ls-line xczc-ls-top'>
										<span>{v.get('flowNumber')}</span>
										<span className='xczc-ls-color'>{v.get('runningDate')}</span>
									</div>

									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											{v.get('categoryName')}
										</span>
										<Amount showZero>{v.get('parentTax') ? v.get('parentTax') : v.get('tax')}</Amount>
									</div>

									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli xczc-ls-color'>
											摘要：{v.get('runningAbstract')}
										</span>
										<span></span>
									</div>

									<div className='xczc-ls-line xczc-ls-bottom'>
										<span className='xczc-ls-color'>
											{v.get('billType') === 'bill_common' ? '销项税' : '进项税'}
										</span>
										<div>
											<span>
												价税合计：<Amount showZero>{v.get('amount')}</Amount>
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
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_ZCWJZZS'))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'

import { sfglAccountActions } from 'app/redux/Edit/Lrls/Hsgl/sfglAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

const runningName = (flowType, direction) => {
	let name = ''
	if (flowType == 'FLOW_INADVANCE') {
		if (direction=='credit') {
			name = '预付'
		} else {
			name = '预收'
		}
	} else {
		if (direction=='credit') {
			name = '应付'
		} else {
			name = '应收'
		}
	}
	return name
}

@connect(state => state)
export default
class Ggfyft extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: true
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList } = this.state

		const data = yllsState.get('data')

		const flowNumber = data.get('flowNumber')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const absAmount = data.get('amount') < 0 ? -data.get('amount') : data.get('amount')
		const projectCard = data.get('projectCard')
		const paymentList = data.get('paymentList')


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>项目公共费用分摊</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						<div>{runningDate}</div>
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
				</Row>

				<Row className='ylls-card'>
					{
						projectCard.map((v, i) => {
							let showName = `${v.get('code')} ${v.get('name')}`
							return (
								<div key={i}>
									<div className='ylls-item ylls-padding'>
										<span>项目明细({i+1}):</span>
										<div>{showName}</div>
									</div>
									<div className='ylls-item ylls-padding'>
										<div>
											分摊金额：
											<Amount className='ylls-bold'>
												{v.get('amount')}
											</Amount>
										</div>
										<div>分摊占比：{v.get('percent')}%</div>
									</div>
								</div>
							)
						})
					}
				</Row>


				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>待分摊金额：<Amount showZero>{amount}</Amount></div>
						<div>
							{showList ? '收起' : '展开'}
							<Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
						</div>
					</div>
					<div style={{display: showList ? '' : 'none'}}>
						{
							paymentList.map((v,i) => {
								return (<div key={i} className='ylls-top-line'>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('categoryName')}</div>
												<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
											</div>
											<div className='ylls-item'>
												<span></span>
												<div><Amount showZero className='ylls-bold'>{v.get('amount')}</Amount></div>
											</div>
										</div>)
								}
							)
						}
					</div>
				</Row>
				{
					data.get('enclosureList') && data.get('enclosureList').size ?
					<Ylfj
						enclosureList={data.get('enclosureList')}
						label={data.get('label')}
						dispatch={dispatch}
						history={history}
					/> : ''
				}
			</ScrollView>
		)
	}
}

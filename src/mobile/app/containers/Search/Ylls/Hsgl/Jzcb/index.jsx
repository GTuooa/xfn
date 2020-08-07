import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'

import { jzcbAccountActions } from 'app/redux/Edit/Lrls/Hsgl/jzcbAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Jzcb extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showList: false
		}
    }

	render () {
		const { dispatch, yllsState, history } = this.props
		const { showList } = this.state

		const data = yllsState.get('data')

		const flowNumber = data.get('flowNumber')
		const runningType = data.get('runningType')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const carryoverAmount = data.get('amount')
		const categoryName = data.get('categoryName')
		const stockCardRange = data.getIn(['acBusinessIncome', 'stockCardList'])
		const titleName = runningType === 'LX_JZCB' ? '收入金额合计：' : '退销金额合计：'
		const runningStateName = runningType === 'LX_JZCB' ? '销售成本结转' : '退销转回成本'

		const hxList = data.get('businessList')
		let totalAmount = 0
		hxList.forEach(v => {
			totalAmount += v.get('amount')
		})

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>成本结转</div>
						<div>{runningStateName}</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>流水类型： {categoryName} </div>
					<div>
						{
							stockCardRange.map((v, i) => {
								return (
									<div key={i}>
										<div  className='ylls-padding'>
											存货： {`${v.get('code')} ${v.get('name')}`}
										</div>
										<div  className='ylls-padding'>
											成本金额： <Amount>{v.get('amount')}</Amount>
										</div>
									</div>

								)
							})
						}
					</div>
				</Row>

				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>{titleName}<Amount showZero>{totalAmount}</Amount></div>
						<div>
							{showList ? '收起' : '展开'}
							<Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
						</div>
					</div>
					<div style={{display: showList ? '' : 'none'}}>
						{
							hxList.map((v,i) => {
								return (<div key={i} className='ylls-top-line'>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('categoryName')}</div>
												<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
											</div>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('runningAbstract')}</div>
											</div>
											<div className='ylls-item'>
												<div className='overElli'>{v.get('cardStockName')}</div>
												<div><Amount className='ylls-bold' showZero>{v.get('amount')}</Amount></div>
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

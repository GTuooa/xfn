import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'

import { kjfpAccountActions } from 'app/redux/Edit/Lrls/Hsgl/kjfpAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Kjfp extends React.Component {
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

		const categoryName = data.get('categoryName')
		const flowNumber = data.get('flowNumber')
		const runningState = data.get('runningState')
		const runningStateName = runningState === 'STATE_KJFP_XS' ? '销售开票' : '退售开票'
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const totalAmount = data.get('tax')
		const hxList = data.get('businessList')

		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>{categoryName}</div>
						<div>{runningStateName}</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
				</Row>

				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>待开发票税额：<Amount showZero>{totalAmount}</Amount></div>
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
											<div className='ylls-item'>
												<span className='ylls-blue'>税率：{`${v.get('taxRate')}%`}</span>
												<div><Amount className='ylls-bold' showZero>{v.get('tax')}</Amount></div>
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

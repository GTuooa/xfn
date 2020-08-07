import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'

import { Row, Icon, ScrollView, Amount } from 'app/components'

import { zcwjzzsAccountActions } from 'app/redux/Edit/Lrls/Hsgl/zcwjzzsAccount'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Ylfj from '../../Ylfj'

@connect(state => state)
export default
class Zcwjzzs extends React.Component {
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
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const handleMonth = data.getIn(['businessList', 0, 'runningDate']).slice(0, 7).replace('-', '年')
		const totalAmount = data.get('amount')

		const hxList = data.get('businessList')
		let outputCount = 0, inputCount = 0, outputAmount = 0, inputAmount = 0
		hxList.forEach(v => {
			if (v.get('billType') === 'bill_common') {//销项税
				outputCount++
				outputAmount += v.get('parentTax') ? v.get('parentTax') : v.get('tax')
			} else {
				inputCount++
				inputAmount += v.get('parentTax') ? v.get('parentTax') : v.get('tax')
			}
		})


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>{categoryName}</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>处理税额月份： {handleMonth}月 </div>
				</Row>

				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>未交税额：<Amount showZero>{Number(outputAmount)-Number(inputAmount)}</Amount></div>
						<div>
							{showList ? '收起' : '展开'}
							<Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
						</div>
					</div>
					<div className='ylls-padding'>销项税-流水数：{outputCount}条；合计税额：<Amount>{outputAmount}</Amount></div>
					<div className='ylls-padding'>进项税-流水数：{inputCount}条；合计税额：<Amount>{inputAmount}</Amount></div>
					<div style={{display: showList ? '' : 'none'}}>
						{
							hxList.map((v,i) => {
								return (<div key={i} className='ylls-top-line'>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('categoryName')}</div>
												<div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
											</div>
											<div className='ylls-item'>
												<span className='ylls-blue'>{v.get('billType') === 'bill_common' ? '销项税' : '进项税'}</span>
												<div>
													<Amount className='ylls-bold' showZero>
														{v.get('parentTax') ? v.get('parentTax') : v.get('tax')}
													</Amount>
												</div>
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

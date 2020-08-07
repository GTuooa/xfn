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
class Sfgl extends React.Component {
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
		const accountName = data.get('accountName') ? data.get('accountName') : '无'
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const absAmount = data.get('amount') < 0 ? -data.get('amount') : data.get('amount')
		const contactsCardRange = data.get('usedCard')//往来关系卡片
		const manageList = data.get('detail')
		const beMoed = data.get('beMoed')//抹零
		const moedAmount = data.get('moedAmount')//抹零金额

		let totalAmount = 0
		manageList.map(v => {
			const flowType = v.get('flowType')
			const direction = v.get('direction')
			const runningState = v.get('runningState')
			let handleAmount = v.get('handleAmount')
			if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
				handleAmount = -Math.abs(handleAmount)
			}
			if (flowType == 'FLOW_INADVANCE') {
				if (direction=='credit') {
					totalAmount += handleAmount
				} else {
					totalAmount -= handleAmount
				}
			} else {
				if (direction=='credit') {
					totalAmount -= handleAmount
				} else {
					totalAmount += handleAmount
				}
			}
		})


		return(
			<ScrollView flex="1">
				<Row className='ylls-card'>
					<div className='ylls-item'>
						<div className='overElli ylls-bold'>收付管理</div>
					</div>
					<div className='ylls-item ylls-line'>
						<div className='ylls-gray'>流水号：{flowNumber}</div>
						{/* <div>{runningDate}</div> */}
					</div>
					<div className='ylls-padding'>摘要： {runningAbstract} </div>
					<div className='ylls-padding'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`} </div>
					<div className='ylls-padding'>{totalAmount > 0 ? '收' : '付'}款金额：<Amount className='ylls-bold' showZero>{amount}</Amount></div>
					<div className='ylls-padding'>账户：{accountName} </div>
					{ beMoed ? <div className='ylls-padding'>抹零金额：<Amount showZero>{moedAmount}</Amount></div> : null }
				</Row>

				<Row className='ylls-card'>
					<div className='ylls-item' onClick={() => this.setState({'showList': !showList})}>
						<div>核销总计：<Amount showZero>{Number(amount) + Number(moedAmount)}</Amount></div>
						<div>
							{showList ? '收起' : '展开'}
							<Icon style={showList ? {transform: 'rotate(180deg)', marginBottom: '.1rem'} : ''} type="arrow-down"/>
						</div>
					</div>
					<div style={{display: showList ? '' : 'none'}}>
						{
							manageList.map((v,i) => {
								return (<div key={i} className='ylls-top-line'>
											<div className='ylls-item ylls-padding'>
												<div className='overElli'>{v.get('categoryName')}</div>
												{
													v.get('beOpened') ? <span></span> : <div className='ylls-gray'>流水号：{v.get('flowNumber')}</div>
												}
											</div>
											<div className='ylls-item'>
												{
													v.get('beOpened') ? <span></span> :
													<div className='ylls-blue'> { runningName(v.get('flowType'), v.get('direction')) } </div>
												}
												<div><Amount showZero className='ylls-bold'>{v.get('handleAmount')}</Amount></div>
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

import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { TextInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account } from 'app/containers/Edit/Lrls/components'

import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import { cxAccountActions } from 'app/redux/Search/Cxls'


@connect(state => state)
export default
class Jzcb extends React.Component {

	componentDidMount() {
		const runningDate = new DateLib(new Date()).valueOf()
		this.props.dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], runningDate))
	}

	render () {
		const { dispatch, cxAccountState } = this.props
		const data = cxAccountState.get('data')

		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const carryoverAmount = data.get('carryoverAmount')
		const stockCardList =  data.get('stockCardList')
		const cardList = data.get('cardList')
		const fromRouter = cxAccountState.getIn(['views', 'fromRouter'])
		const isLast = stockCardList.size - 1

		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], value))

					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(cxAccountActions.changeCxlsData(['data', 'runningAbstract'], value))
							}}
						/>
					</div>

					<div className='lrls-card'>
						<div>
							{
								stockCardList.map((v ,i) => {
									return (
										<div key={i} style={{paddingBottom: i == isLast ? '0' : '20px'}}>
											<Row className='lrls-bottom lrls-more-card'>
												<label>存货卡片:</label>
												<div className='antd-single-picker'>
													{`${v.get('code')} ${v.get('name')}`}
												</div>
											</Row>
											<Row className='lrls-bottom lrls-more-card'>
												<label>金额:</label>
												<div className='antd-single-picker'>
													<Amount>{v.get('amount')}</Amount>
												</div>
											</Row>
											<Row className='lrls-more-card'>
												<label>成本金额:</label>
												<TextInput
													placeholder='填写成本金额'
													value={cardList.getIn([i, 'amount'])}
													onChange={(value) => {
														if (/^\d*\.?\d{0,2}$/g.test(value)) {
															dispatch(cxAccountActions.changeCxlsData(['data', 'cardList', i, 'amount'], value))
														}
													}}
												/>
											</Row>
										</div>
									)
								})
							}
						</div>
					</div>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(cxAccountActions.saveJzcb())
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

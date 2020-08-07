import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem, XfInput } from 'app/components'
import { TopDatePicker, EnclosurePublic } from 'app/containers/components'

import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'


@connect(state => state)
export default
class Fprz extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({ title: '发票认证' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		sessionStorage.setItem('prevPage','searchrunning')
	}

	render () {
		const { dispatch, searchRunningState, history } = this.props
		const data = searchRunningState.get('data')
		const oriDate = data.get('oriDate')
		const oriAbstract = data.get('oriAbstract')
		const amount = data.get('amount')

		return(
			<Container className="edit-running">
				<TopDatePicker
					value={oriDate}
					onChange={date => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], value))

					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={oriAbstract}
							onChange={(value) => {
								dispatch(searchRunningActions.changeCxlsData(['data', 'oriAbstract'], value))
							}}
						/>
					</div>
					<div className='lrls-card'>
                        <Row className='yysr-amount'>
                            <label>金额：</label>
                            <XfInput.BorderInputItem
							    mode='amount'
                                placeholder='填写金额'
                                value={amount}
                                onChange={(value) => {
                                    dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], value))
                                }}
                            />
                        </Row>
                    </div>
					<EnclosurePublic history={history}/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(searchRunningActions.saveFprz(history))
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}

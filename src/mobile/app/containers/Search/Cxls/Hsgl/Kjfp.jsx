import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { TextInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem } from 'app/components'
import { TopDatePicker } from 'app/containers/components'

import { DateLib } from 'app/utils'
import { cxAccountActions } from 'app/redux/Search/Cxls'


@connect(state => state)
export default
class Kjfp extends React.Component {

	componentDidMount() {
		const runningDate = new DateLib(new Date()).valueOf()
		this.props.dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], runningDate))
	}

	render () {
		const { dispatch, cxAccountState } = this.props
		const data = cxAccountState.get('data')

		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const fromRouter = cxAccountState.getIn(['views', 'fromRouter'])

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
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(cxAccountActions.saveKjfp())
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
